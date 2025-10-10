'use strict';

const assert = require('assert');
const { JSDOM } = require('jsdom');



global.define = function (name, deps, factory) {
  global[name] = factory();
};


const { window } = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
const $ = require('jquery')(window);
global.$ = $;
global.window = window;
global.document = window.document;


require('../static/lib/main.js');


describe('Composer Suggestions Plugin (Frontend)', function () {

  beforeEach(() => {
    $('body').html(`
      <div class="composer" data-uuid="123">
        <div class="title-container">
          <input class="title" value="Mock Topic">
        </div>
      </div>
    `);
  });

  it('should add suggestions container when composer loads', function () {
    const data = { post_uuid: '123' };
    global['composer-suggestions/main'].showSuggestions(data);

    const container = $('.composer[data-uuid="123"] .suggested-topics');
    assert.ok(container.length, 'suggestions container should exist');
  });

  it('should not crash when title is empty', function () {
    const data = { post_uuid: '123' };
    $('.title').val('');
    global['composer-suggestions/main'].showSuggestions(data);
    assert.ok(true, 'did not throw');
  });
});
