/* eslint-env mocha */
'use strict';

process.env.NODE_ENV = 'test';

const winston = require('winston');
if (typeof winston.clear === 'function') {
	winston.clear();
}
winston.add(new winston.transports.Console({ silent: true }));


const { expect } = require('chai');
const cheerio = require('cheerio');
const supertest = require('supertest');

const nbb = require('../require-main.js');

const meta = require('../src/meta');
const Categories = require('../src/categories');
const Topics = require('../src/topics');
const Posts = require('../src/posts');
const User = require('../src/user');
const Groups = require('../src/groups');

describe('Unanswered filter UI & API', function () {
	this.timeout(40000);

	let request;
	let cid;
	let uidAuthor;
	let uidReplier;
	let tidWithReply;
	let tidUnreplied;

	before(async () => {
		await nbb.start();

		const port = meta.config.port || 4567;
		request = supertest(`http://127.0.0.1:${port}`);

		// create users
		uidAuthor = await User.create({ username: 'instructor', password: 'pass', email: 'instructor+unanswered@test.local' });
		uidReplier = await User.create({ username: 'student', password: 'pass', email: 'student+unanswered@test.local' });

		// make instructor admin (avoid any perms surprises)
		await Groups.join('administrators', uidAuthor);

		// create isolated category
		cid = await Categories.create({
			name: 'Unanswered E2E',
			description: 'temp cat for Unanswered tests',
			icon: 'fa-comments',
			order: 0,
		});

		// Topic with a reply (should NOT appear under Unanswered)
		{
			const res = await Topics.post({
				uid: uidAuthor,
				cid,
				title: 'Topic with a reply',
				content: 'OP A',
			});
			tidWithReply = res.topic.tid;
			await Posts.create({
				uid: uidReplier,
				tid: tidWithReply,
				content: 'A reply exists',
			});
		}

		// Topic without replies (should appear under Unanswered)
		{
			const res = await Topics.post({
				uid: uidAuthor,
				cid,
				title: 'Topic without replies',
				content: 'OP B',
			});
			tidUnreplied = res.topic.tid;
		}
	});

	after(async () => {
		try {
			if (tidWithReply) await Topics.delete({ uid: 1, tids: [tidWithReply] });
			if (tidUnreplied) await Topics.delete({ uid: 1, tids: [tidUnreplied] });
			if (cid) await Categories.purge(cid);
		} catch (e) {
			// ignore cleanup errors in CI
		}
		await nbb.stop();
	});

	describe('Header quick link', () => {
		it('shows an "Unanswered" quick link in header.tpl that points to /recent?filter=unreplied', async () => {
			// Any page that renders your header works; use /recent scoped to our cid
			const res = await request.get(`/recent?cid=${cid}`).expect(200);
			const $ = cheerio.load(res.text);

			// Look for the exact button you added
			const headerLink = $('a.btn.btn-sm.btn-warning')
				.filter((_, el) => ($(el).text().trim() === 'Unanswered'))
				.first();

			expect(headerLink.length, 'expected btn-warning Unanswered link in header').to.equal(1);
			const href = headerLink.attr('href') || '';
			expect(href).to.include('/recent?filter=unreplied');
		});
	});

	describe('Recent page filter pills', () => {
		it('renders the All/Unanswered pills you added in recent.tpl', async () => {
			const res = await request.get(`/recent?cid=${cid}`).expect(200);
			const $ = cheerio.load(res.text);

			// Find the little "Filter:" toolbar you added
			const toolbar = $('.category .d-flex.align-items-center.gap-2').has('span.text-muted:contains("Filter:")').first();
			expect(toolbar.length, 'expected Filter toolbar in recent.tpl').to.equal(1);

			// Check for both pill links
			const pillAll = toolbar.find('a.btn.btn-sm.btn-outline-secondary').filter((_, el) => ($(el).text().trim() === 'All')).first();
			const pillUnanswered = toolbar.find('a.btn.btn-sm.btn-outline-secondary').filter((_, el) => ($(el).text().trim() === 'Unanswered')).first();

			expect(pillAll.length, 'expected All pill').to.equal(1);
			expect(pillUnanswered.length, 'expected Unanswered pill').to.equal(1);

			expect(pillAll.attr('href') || '').to.match(/\/recent(?:$|\?)/);
			expect(pillUnanswered.attr('href') || '').to.include('/recent?filter=unreplied');
		});
	});

	describe('API behavior: /api/recent?filter=unreplied', () => {
		it('returns only topics with zero replies in the selected category', async () => {
			const res = await request
				.get(`/api/recent?filter=unreplied&cid=${cid}`)
				.expect(200);

			expect(res.body).to.have.property('topics').that.is.an('array');

			const titles = res.body.topics.map(t => t.title);
			expect(titles).to.include('Topic without replies');
			expect(titles).to.not.include('Topic with a reply');

			const item = res.body.topics.find(t => t.title === 'Topic without replies');
			expect(item).to.exist;

			if (typeof item.replycount !== 'undefined') {
				expect(item.replycount).to.equal(0);
			} else if (typeof item.postcount !== 'undefined') {
				expect(item.postcount).to.equal(1); // OP only
			}
		});

		it('regular /api/recent (no filter) includes both topics', async () => {
			const res = await request.get(`/api/recent?cid=${cid}`).expect(200);
			const titles = res.body.topics.map(t => t.title);
			expect(titles).to.include('Topic with a reply');
			expect(titles).to.include('Topic without replies');
		});
	});

	describe('HTML behavior: /recent?filter=unreplied', () => {
		it('lists only the unreplied topic (validates your recent.tpl + header.tpl integration)', async () => {
			const res = await request.get(`/recent?filter=unreplied&cid=${cid}`).expect(200);
			const $ = cheerio.load(res.text);

			const listedTitles = $('.topic-title, a.topic-title, .topics-list .topic-title')
				.map((_, el) => $(el).text().trim())
				.get();

			const hasUnreplied = listedTitles.some(t => /Topic without replies/i.test(t));
			const hasReplied = listedTitles.some(t => /Topic with a reply/i.test(t));

			expect(hasUnreplied, 'Unreplied topic should be listed').to.be.true;
			expect(hasReplied, 'Replied topic should NOT be listed').to.be.false;
		});
	});
});
