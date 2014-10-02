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

    'use strict';

    /**
     * Dropdown
     * @constructor
     * @param {HTMLElement} element
     */
    function Dropdown(element) {
        this.target = element;
        this.menu = element.querySelector('[data-behaviour=menu]');
        this.button = element.querySelector('[data-behaviour=button]');
        this.options = this.menu.querySelectorAll('[data-behaviour=option]');

        if (this.open === undefined) {
            this._init();
        }
    }

    /**
     * Init
     * @private
     */
    Dropdown.prototype._init = function() {
        var i, len;
        var self = this;

        this.open = false;

        this.target.className+= ' is-closed';

        // Please use a button element
        if (this.button.tagName !== 'BUTTON') {
            this.button.style.cursor = 'pointer';
            this.button.setAttribute('tabindex', 0);
            this.button.setAttribute('role', 'button');
        }

        this.button.setAttribute('aria-expanded', this.open);
        this.button.setAttribute('aria-owns', this.menu.id);

        this.clickHandler = function(e) {
            self.toggle();
        };

        if (this.button.addEventListener) {
            this.button.addEventListener('click', this.clickHandler, false);
        }
        else {
            this.button.attachEvent('onclick', this.clickHandler);
        }

        this.menu.style.display = 'none';
        this.menu.setAttribute('role', 'menu');
        this.menu.setAttribute('aria-hidden', true);

        for (i = 0, len = this.options.length; i < len; i++) {
            this.options[i].setAttribute('role', 'menuitem');
        }
    };

    /**
     * Toggle
     */
    Dropdown.prototype.toggle = function() {
        var targetClass = this.open ? 'is-closed' : 'is-open';
        var replaceClass = this.open ? 'is-open' : 'is-closed';

        this.open = ! this.open;

        this.target.className = this.target.className.replace(replaceClass, targetClass);

        this.button.setAttribute('aria-expanded', this.open);

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

        if (this.button.tagName !== 'BUTTON') {
            this.button.style.cursor = '';
            this.button.removeAttribute('role');
            this.button.removeAttribute('tabindex');
        }

        this.button.removeAttribute('aria-owns');
        this.button.removeAttribute('aria-controls');

        if (this.button.removeEventListener) {
            this.button.removeEventListener('click', this.clickHandler, false);
        }
        else {
            this.button.detachEvent('onclick', this.clickHandler);
        }

        this.menu.style.display = '';
        this.menu.removeAttribute('role');
        this.menu.removeAttribute('aria-hidden');

        for (i = 0, len = this.options.length; i < len; i++) {
            this.options[i].removeAttribute('role');
        }

        delete this.clickHandler;

        delete this.button;
        delete this.menu;
        delete this.open;
    };

    return Dropdown;

});
