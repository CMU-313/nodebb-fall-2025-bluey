'use strict';

define('composer-suggestions/main', [], function () {
    console.log('[composer-suggestions] main.js entered');
    const Suggestions = {};
    // ChatGPT Assisted Code Below (.addPlaceholder function)
    Suggestions.addPlaceholder = function (data) {
        console.log('[composer-suggestions] adding placeholder...');

        const composerEl = $('.composer[data-uuid="' + data.post_uuid + '"]');
        const titleEl = composerEl.find('input.title');

        const titleContainer = composerEl.find('.title-container');

        if (titleEl.length && !composerEl.find('.suggested-topics').length) {
            titleContainer.after(
                '<div class="suggested-topics"><strong>Suggested Topics will appear here...</strong></div>'
            );
             console.log('[composer-suggestions] ENTERED UI');
        }
    };
    
    $(window).on('action:composer.loaded', function (ev, data) {
        Suggestions.addPlaceholder(data);
    });

    return Suggestions;
});
