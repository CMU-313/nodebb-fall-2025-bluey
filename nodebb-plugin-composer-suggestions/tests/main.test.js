import { createRequire } from 'node:module';
import { describe, it, before, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { JSDOM } from 'jsdom';

const require = createRequire(import.meta.url);

let $, Suggestions;
let sandbox;

// AI generated sandbox for mock
describe('Frontend: Composer Suggestions UI', () => {
  before(() => {
    const dom = new JSDOM();
    const { window } = dom;
    global.window = window;
    global.document = window.document;
    const jQuery = require('jquery');
    $ = jQuery;
    global.$ = $;
    const amdDependencies = { jquery: $, components: {} };
    global.define = (moduleName, dependencies, factory) => {
      const resolvedDependencies = dependencies.map(dep => amdDependencies[dep]);
      Suggestions = factory(...resolvedDependencies);
    };
    require('../static/lib/main.js');
    console.log('[main.test.js LOG] Test environment and AMD module loaded.');
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    document.body.innerHTML = `
      <div class="composer" data-uuid="test-uuid">
        <div class="title-container">
          <input class="title" value="test query" />
        </div>
      </div>
    `;
    console.log('[main.test.js LOG] beforeEach: DOM has been reset for a new test.');
  });

  afterEach(() => {
    sandbox.restore();
    document.body.innerHTML = '';
  });

  it('should render suggestions when the composer is loaded', () => {
    console.log('   [main.test.js LOG] Arrange: Setting up test case...');
    const fakeData = { suggestions: [{ tid: 123, title: 'A Great Suggestion' }] };
    sandbox.stub($, 'getJSON').callsFake(() => {
      console.log('   [main.test.js LOG] Network Stub: $.getJSON was called by the plugin.');
      return {
        done: function (callback) {
          console.log('   [main.test.js LOG] Network Stub: Returning fake data to the plugin.');
          callback(fakeData);
          return this;
        },
        fail: function () { return this; },
      };
    });

    console.log('   [main.test.js LOG] Act: Triggering "action:composer.loaded" event...');
    $(window).trigger('action:composer.loaded', {
      post_uuid: 'test-uuid',
    });

    console.log('   [main.test.js LOG] Assert: Checking the DOM for results...');
    const container = $('.suggested-topics');
    expect(container.length).to.equal(1, 'The suggestions container was not created');
    expect(container.find('li a').text()).to.equal('A Great Suggestion');
    console.log('   [main.test.js LOG] Assert: Test passed!');
  });
});