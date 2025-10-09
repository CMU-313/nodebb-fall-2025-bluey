'use strict';

const plugin = {};
const db = require.main.require('./src/database');
const _ = require('lodash');
// ChatGPT Assistance lodash logic

plugin.init = async function (params) {
    const { router, middleware } = params;
    
    console.log('[composer-suggestions] LIBRARY ACTIVE called');
    
    router.get('/api/composer-suggestions/:title?', middleware.ensureLoggedIn, async (req, res) => {
        try {
            const title = (req.params.title || '').trim().toLowerCase();

            if (!title) {
                return res.json({ suggestions: [] });
            }
            const tids = await db.getSortedSetRange('topics:tid', 0, -1);

            const topics = await Promise.all(tids.map(async tid => { // fetch topic objects and filter by title match
                const t = await db.getObject(`topic:${tid}`);
                if (t && t.title && t.title.toLowerCase().includes(title)) {
                    return { tid: parseInt(tid, 10), title: t.title };
                }
                return null;
            }));

            
            res.json({ suggestions: _.compact(topics).slice(0, 5) }); // Limit to top 5 matches

        } catch (err) {
            console.error('[composer-suggestions] ERROR:', err);
            res.status(500).json({ error: 'Failed to fetch suggestions', details: err.message });
        }
    });
    
};

module.exports = plugin;
