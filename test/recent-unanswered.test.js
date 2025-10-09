'use strict';

const { expect } = require('chai');
const Benchpress = require('benchpressjs');
const path = require('path');
const fs = require('fs');

describe('Recent and Header Templates', () => {
	let recentTplPath, headerTplPath;

	before(() => {
		const themePath = path.resolve(__dirname, '../vendor/nodebb-theme-harmony-2.1.15/templates');
		recentTplPath = path.join(themePath, 'recent.tpl');
		headerTplPath = path.join(themePath, 'header.tpl');
	});

	it('should render the Unanswered filter pills in recent.tpl', async () => {
		const tplSrc = fs.readFileSync(recentTplPath, 'utf8');
		const compiled = await Benchpress.precompile(tplSrc, recentTplPath);
		const html = await Benchpress.compileRender(compiled, {
			relative_path: '/forum',
			widgets: { sidebar: [], header: [], footer: [] },
			topics: [],
		});
		expect(html).to.include('Filter:');
		expect(html).to.include('/recent?filter=unreplied');
		expect(html).to.include('Unanswered');
	});

	it('should render the Unanswered quick link in header.tpl', async () => {
		const tplSrc = fs.readFileSync(headerTplPath, 'utf8');
		const compiled = await Benchpress.precompile(tplSrc, headerTplPath);
		const html = await Benchpress.compileRender(compiled, {
			relative_path: '/forum',
			config: { theme: {} },
			userLang: 'en',
			defaultLang: 'en',
		});
		expect(html).to.include('Unanswered');
		expect(html).to.include('/recent?filter=unreplied');
	});
});
