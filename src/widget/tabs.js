(function (name, context, definition) {
    if (typeof define === 'function' && define.amd) {
        define(definition);
    }
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = definition();
    }
    else {
        context[name] = definition();
    }
})('Tabs', this, function() {

    /**
     * Tabs
     * @description Keyboard and screen reader accessible tabs.
     * @constructor
     * @param element
     */
    var Tabs = function(element) {
        this.target = element;
        this.tabs = element.getElementsByTagName('a');
        this.panels = [];

        for (var i = 0, len = this.tabs.length; i < len; i++) {
            this.panels.push( document.getElementById(this.tabs[i].hash.replace('#', '')) );
        }

        if (this.active === undefined) {
            this.init();
        }
    };

    /**
     * Init
     */
    Tabs.prototype.init = function() {
        var self = this;

        this.target.setAttribute('role', 'tablist');

        this.clickListener = function(e) {
            var target = e.srcElement || e.target;

            if (target  && target.nodeName.toLowerCase() === 'a') {

                if (e.preventDefault) {
                    e.preventDefault();
                }
                else {
                    e.returnValue = false;
                }

                self.toggle(target);
            }
        };

        this.keyupListener = function(e) {
            var tab;

            // Right
            if (e.keyCode === 39 && self.active.index < self.tabs.length) {
                tab = self.tabs[self.active.index + 1];
            }

            // Left
            else if (e.keyCode === 37 && self.active.index > 0) {
                tab = self.tabs[self.active.index - 1];
            }

            if (tab) {
                tab.focus();
                self.toggle(tab);
            }
        };

        for (var i = this.tabs.length - 1; i >= 0; i--) {
            var tab = this.tabs[i];
            var panel = this.panels[i];
            var preSelected = tab.className.indexOf('is-selected') > -1;
            var selected = ! this.active && (preSelected || i === 0);

            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-selected', selected);
            tab.setAttribute('aria-controls', this.tabs[i].hash.replace('#', ''));

            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('aria-hidden', ! selected);

            if (selected) {

                if (!preSelected) {
                    tab.className+= ' is-selected ';
                }

                this.active = {
                    tab: tab,
                    index: i,
                    panel: panel
                };
            }
            else {
                panel.style.display = 'none';
            }
        }

        if (this.target.addEventListener) {
            this.target.addEventListener('click', this.clickListener, false);
            this.target.addEventListener('keyup', this.keyupListener, false);
        }
        else {
            // Presume legacy IE
            this.target.attachEvent('onclick', this.clickListener);
            this.target.attachEvent('onclick', this.keyupListener);
        }

    };

    /**
     * Toggle
     * @param {Object} tab
     */
    Tabs.prototype.toggle = function(tab) {
        var panel = document.getElementById(tab.hash.replace('#', ''));

        this.active.tab.className = this.active.tab.className.replace('is-selected', '');
        this.active.tab.setAttribute('aria-selected', false);

        this.active.panel.style.display = 'none';
        this.active.panel.setAttribute('aria-hidden', true);

        tab.className+= ' is-selected ';
        tab.setAttribute('aria-selected', true);

        panel.style.display = '';
        panel.setAttribute('aria-hidden', false);

        // Find tab index
        for (var i = 0, len = this.tabs.length; i < len; i++) {
            if (tab === this.tabs[i]) {
                break;
            }
        }

        this.active.tab = tab;
        this.active.index = i;
        this.active.panel = panel;
    };

    /**
     * Teardown
     */
    Tabs.prototype.teardown = function() {

        this.target.removeAttribute('role');

        if (this.target.removeEventListener) {
            this.target.removeEventListener('click', this.clickListener, false);
            this.target.removeEventListener('click', this.keyupListener, false);
        }
        else {
            // Presume legacy IE
            this.target.detachEvent('onclick', this.clickListener);
            this.target.detachEvent('onclick', this.keyupListener);
        }

        for (var i = 0, len = this.tabs.length; i < len; i++) {
            var tab = this.tabs[i];
            var panel = this.panels[i];

            tab.removeAttribute('role');
            tab.removeAttribute('aria-selected');
            tab.removeAttribute('aria-controls');

            panel.style.display = '';
            panel.removeAttribute('role');
        }

        delete this.active;
    };

    return Tabs;

});