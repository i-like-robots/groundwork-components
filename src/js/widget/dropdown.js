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
})('Dropdown', this, function() {

    /**
     * Dropdown
     * @description Dropdown menus. Keyboard accessible with ARIA hints.
     * @constructor
     * @param element
     */
    var Dropdown = function(element) {
        this.target = element;
        this.label = element.querySelector('[data-behaviour=label]');
        this.menu = element.querySelector('[data-behaviour=menu]');
        this.options = element.querySelectorAll('[data-behaviour=option]');

        if (this.open === undefined) {
            this._init();
        }
    };

    /**
     * Init
     * @private
     */
    Dropdown.prototype._init = function() {
        var i, len;
        var self = this;

        this.target.className+= ' is-closed';

        this.label.style.cursor = 'pointer';
        this.label.setAttribute('tabindex', 0);
        this.label.setAttribute('role', 'button');
        this.label.setAttribute('aria-expanded', false);

        this.listener = function(e) {
            var isMouse = e.type === 'click';
            var isTouch = e.type === 'touchend' && e.changedTouches.length === 1;
            var isKeyboard = e.type === 'keyup' && e.keyCode === 13;

            if (isMouse || isTouch || isKeyboard) {

                if (e.preventDefault) {
                    e.preventDefault();
                }
                else {
                    e.returnValue = false;
                }

                self.toggle();
            }
        };

        var events = ['click', 'touchend'];

        // If the label is 'clickable' then keyboard support should be implied
        // <http://bit.ly/Zgip9P>
        var nodeType = this.label.tagName.toLowerCase();

        if (nodeType !== 'a' && nodeType !== 'button') {
            events.push('keyup');
        }

        for (i = 0, len = events.length; i < len; i++) {
            if (window.addEventListener) {
                this.label.addEventListener(events[i], this.listener, false);
            }
            else {
                // Presume legacy IE
                this.label.attachEvent('on' + events[i], this.listener);
            }
        }

        this.menu.style.display = 'none';
        this.menu.setAttribute('role', 'menu');
        this.menu.setAttribute('aria-hidden', true);

        for (i = 0, len = this.options.length; i < len; i++) {
            this.options[i].setAttribute('tabindex', 0);
            this.options[i].setAttribute('role', 'menuitem');
        }

        this.open = false;
    };

    /**
     * Toggle
     */
    Dropdown.prototype.toggle = function() {
        var targetClass = this.open ? 'is-closed' : 'is-open';
        var replaceClass = this.open ? 'is-open' : 'is-closed';

        this.open = ! this.open;

        this.target.className = this.target.className.replace(replaceClass, targetClass);

        this.label.setAttribute('aria-expanded', this.open);

        this.menu.style.display = this.open ? '' : 'none';
        this.menu.setAttribute('aria-hidden', ! this.open);

        if (this.open && this.options.length) {
            this.options[0].focus();
        }
    };

    /**
     * Teardown
     */
    Dropdown.prototype.teardown = function() {
        var i, len;

        this.target.className = this.target.className.replace('is-open', '').replace('is-closed', '');

        this.label.style.cursor = '';
        this.label.removeAttribute('role');
        this.label.removeAttribute('tabindex');
        this.label.removeAttribute('aria-expanded');

        var events = ['click', 'keyup', 'touchend'];

        for (i = 0, len = events.length; i < len; i++) {
            if (window.addEventListener) {
                this.label.removeEventListener(events[i], this.listener, false);
            }
            else {
                // Presume legacy IE
                this.label.detachEvent('on' + events[i], this.listener);
            }
        }

        this.menu.style.display = '';
        this.menu.removeAttribute('role');
        this.menu.removeAttribute('aria-hidden');

        for (i = 0, len = this.options.length; i < len; i++) {
            this.options[i].removeAttribute('tabindex');
            this.options[i].removeAttribute('role');
        }

        delete this.open;
    };

    return Dropdown;

});