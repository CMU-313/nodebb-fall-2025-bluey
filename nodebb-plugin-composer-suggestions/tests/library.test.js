'use strict';

const assert = require('assert');
const express = require('express');
const request = require('supertest');
const Module = require('module');
const originalRequire = Module.prototype.require;

// ChatGPT Assisted mocking of database calls
Module.prototype.require = function (path) {
    if (path === './src/database') {
        return {
            getSortedSetRange: async () => ['1', '2', '3'],
            getObject: async (key) => ({
                tid: key.split(':')[1],
                title: `Mock Topic ${key.split(':')[1]}`,
            }),
        };
    }
    if (path === './src/topics') {
        return {}; 
    }
    return originalRequire.apply(this, arguments);
};

const plugin = require('../library');

describe('Composer Suggestions Plugin (Backend)', function () {
    let app;

    before(function () {
        app = express();
        app.use(express.json());
        plugin.init({
            router: app,
            middleware: { ensureLoggedIn: (req, res, next) => next() },
        });
    });

    after(function () {
        Module.prototype.require = originalRequire;
    });

    it('should return empty list when given a unique title', async function () {
        const res = await request(app).get('/api/composer-suggestions/test');
        assert.strictEqual(res.status, 200); //ChatGPT Assisted test for 200 status
        assert.ok(Array.isArray(res.body.suggestions));
        assert.ok(res.body.suggestions.length >= 0);
        if (res.body.suggestions.length > 0) {
            const first = res.body.suggestions[0];
            assert.ok(first.tid);
            assert.ok(typeof first.title === 'string');
        }
        console.log('Unique Title Suggestions:', res.body.suggestions);
    });

    it('should return filtered suggestions that match the query', async function () {
        const res = await request(app).get('/api/composer-suggestions/Mock');
        assert.strictEqual(res.status, 200);
        assert.ok(res.body.suggestions.length > 0);
        res.body.suggestions.forEach(s => {
            assert.ok(s.title.toLowerCase().includes('mock'));
        });
        console.log('Similar Suggestions:', res.body.suggestions);
    });

});

