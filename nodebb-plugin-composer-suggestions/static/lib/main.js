'use strict';

define('composer-suggestions/main', ['jquery', 'components'], function ($, components) {
    console.log('[composer-suggestions] main.js entered');
    const Suggestions = {};

    // ChatGPT Assisted Code (Debounce)
    function debounce(fn, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    // ChatGPT Assisted Code Below (API Fetch/connection)
   Suggestions.showSuggestions = function (data) {
        const composerEl = $('.composer[data-uuid="' + data.post_uuid + '"]');
        const titleEl = composerEl.find('input.title');

        if (!titleEl.length) return;

        // Create container if it doesn't exist
        let container = composerEl.find('.suggested-topics');
        if (!container.length) {
            container = $('<div class="suggested-topics"><strong>Suggested Topics:</strong><ul></ul></div>');
            composerEl.find('.title-container').after(container);
        }

        const listEl = container.find('ul');
        listEl.empty();

        const query = titleEl.val().trim();
        if (!query) return;

        // Fetch suggestions from API
        $.getJSON('/api/composer-suggestions/' + encodeURIComponent(query))
            .done(function (resp) {
                if (resp.suggestions && resp.suggestions.length) {
                    resp.suggestions.forEach(function (topic) {
                        $('<li>')
                            .append(
                                $('<a>').attr('href', '/topic/' + topic.tid).text(topic.title)
                            )
                            .appendTo(listEl);
                    });
                } else {
                    listEl.append('<li>No similar topics found.</li>');
                }
            })
            .fail(function (err) {
                console.error('[composer-suggestions] API error:', err);
                listEl.append('<li>Failed to load suggestions.</li>');
            });
    };

    // On composer loaded, attach UI and live typing listener
    $(window).on('action:composer.loaded', function (ev, data) {
        Suggestions.showSuggestions(data);

        const composerEl = $('.composer[data-uuid="' + data.post_uuid + '"]');
        const titleEl = composerEl.find('input.title');

        const debouncedShow = debounce(() => Suggestions.showSuggestions(data), 300);

        titleEl.on('input', debouncedShow);

    });

    return Suggestions;
});
