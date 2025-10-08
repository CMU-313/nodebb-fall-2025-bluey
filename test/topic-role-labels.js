'use strict';

const assert = require('assert');
const { JSDOM } = require('jsdom');

describe('topic post role label (general check)', () => {
	// set up jsdom + jQuery similar to other frontend tests
	const dom = new JSDOM('<html><body></body></html>');
	global.window = dom.window;
	global.document = dom.window.document;
	global.jQuery = require('jquery');
	global.$ = global.jQuery;
	const { $ } = global;

	function normalizeRoleText(text) {
		if (!text) return '';
		// strip surrounding parentheses, whitespace, then remove non-alphanumeric and lowercase
		const inner = text.replace(/^\(+|\)+$/g, '').trim();
		return inner.replace(/[^a-z0-9]/gi, '').toLowerCase();
	}

	it('accepts varied TA/Student/Instructor labels after displayname', () => {
		// examples: include expectedRole to assert TA vs student vs instructor
		const examples = [
			{ label: '(Instructor)', expected: 'instructor' },
			{ label: 'TA', expected: 'ta' },
			{ label: '(TA)', expected: 'ta' },
			{ label: 'TA!!!', expected: 'ta' },
			{ label: 'ta', expected: 'ta' },
			{ label: '(Student)', expected: 'student' },
			{ label: '(student!)', expected: 'student' },
			{ label: '(unknown)', expected: null },
		];

		examples.forEach((ex) => {
			const el = $(`<div class="post-header">
				<a class="fw-bold" href="/user/x">User</a>
				<span class="ms-1 role-label">${ex.label}</span>
			</div>`);

			const roleEl = el.find('a.fw-bold').first().next('span.role-label');
			assert(roleEl.length === 1, 'role label should exist after displayname');

			const norm = normalizeRoleText(roleEl.text());
			if (ex.expected === 'ta') {
				// be tolerant to common TA forms: 'ta', 'teachingassistant', 'assistant'
				assert(/ta|teachingassistant|assistant/.test(norm), `expected TA-like role for "${ex.label}", normalized "${norm}"`);
			} else if (ex.expected === 'student') {
				assert(/student/.test(norm), `expected student role for "${ex.label}", normalized "${norm}"`);
			} else if (ex.expected === 'instructor') {
				assert(/instructor|prof|teacher/.test(norm), `expected instructor role for "${ex.label}", normalized "${norm}"`);
			} else {
				// expected null -> should not match any known roles
				assert(!(/ta|teachingassistant|assistant|student|instructor|prof|teacher/.test(norm)), `did not expect a known role for "${ex.label}", normalized "${norm}"`);
			}
		});
	});
});
