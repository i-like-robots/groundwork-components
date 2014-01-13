define(['groundwork/core'], function(core) {

    /**
     * Respond
     * @description Will instantiate and teardown the specified component on based on a media query.
     * @constructor
     * @param element
     */
    return function(element) {

        var timeout;
        var loaded = false;
        var mediaQueryInit = element.getAttribute('data-mq-init');
        var mediaQueryTeardown = element.getAttribute('data-mq-teardown');
        var component = element.getAttribute('data-breakpoint-component');

        // Strict support
        var matchMedia = window.matchMedia || window.msMatchMedia;

        if (! matchMedia) {
            return;
        }

        var init = function() {
            loaded = true;
            core.loadComponent(element, component);
        };

        var teardown = function() {
            loaded = false;
            core.unloadComponent(element, component);
        };

        var respond = function() {

            if (matchMedia(mediaQueryInit).matches && ! loaded) {
                return init();
            }

            if (matchMedia(mediaQueryTeardown).matches && loaded) {
                return teardown();
            }
        };

        var poll = function() {
            timeout = setTimeout(function() {

                if (timeout) {
                    clearTimeout(timeout);
                }

                respond();

            }, 100);
        };

        window.addEventListener('resize', poll, false);

        respond.call(element);

    };

});