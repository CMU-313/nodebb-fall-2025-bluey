'use strict';

const plugin = {};
const db = require.main.require('./src/database');
const topics = require.main.require('./src/topics');

plugin.init = async function (params) {
    const { router, middleware } = params;
    console.log('[composer-suggestions] LIBRARY ACTIVE called');

    
};

module.exports = plugin;
