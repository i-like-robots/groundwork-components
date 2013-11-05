define(['groundwork/core'], function(core) {

    /**
     * Load at breakpoint
     * @description Will load and instantiate the specified component on matchMedia() matches.
     * @constructor
     * @param element
     */
    return function(element) {

        var loaded = false;
        var breakpoint = element.getAttribute('data-breakpoint');
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

            if (matchMedia('screen and (max-width:' + breakpoint + ')').matches && ! loaded) {
                return init();
            }

            if (matchMedia('screen and (min-width:' + breakpoint + ')').matches && loaded) {
                return teardown();
            }
        };

        window.addEventListener('resize', respond, false);

        respond.call(element);

    };

});