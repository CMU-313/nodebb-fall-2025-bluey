'use strict';

define('composer-suggestions/main', [], function () {
    console.log('[composer-suggestions] main.js entered');
    const Suggestions = {};
    // ChatGPT Assisted Code Below (.addPlaceholder function)
    Suggestions.addPlaceholder = function (data) {
        console.log('[composer-suggestions] adding placeholder...');

        const composerEl = $('.composer[data-uuid="' + data.post_uuid + '"]');
        const titleEl = composerEl.find('input.title');

        if (titleEl.length && !composerEl.find('.suggested-topics').length) {
            titleEl.after(
                '<div class="suggested-topics"><strong>Suggested Topics will appear here...</strong></div>'
            );
        }
    };

    // Run when composer loads
    $(window).on('action:composer.loaded', function (ev, data) {
        Suggestions.addPlaceholder(data);
    });

    return Suggestions;
});
