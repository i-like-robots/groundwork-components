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
})('Expandable', this, function() {

    'use strict';

    /**
     * Expandable
     * @constructor
     * @param {HTMLElement} element
     */
    function Expandable(element) {
        this.target = element;
        this.button = element.querySelector('[data-behaviour=button]');
        this.content = element.querySelector('[data-behaviour=content]');

        if (this.open === undefined) {
            this._init(
                element.className.match(/\bis-open\b/) || window.location.hash.replace('#', '') === this.content.id
            );
        }
    }

    /**
     * Init
     * @private
     * @param {Boolean} open
     */
    Expandable.prototype._init = function(open) {
        var self = this;

        this.open = open;

        if ( ! this.open) {
            this.target.className+= ' is-closed';
            this.content.style.display = 'none';
        }

        // Please use a button element
        if (this.button.tagName !== 'BUTTON') {
            this.button.style.cursor = 'pointer';
            this.button.setAttribute('tabindex', 0);
            this.button.setAttribute('role', 'button');
        }

        this.button.setAttribute('aria-expanded', this.open);
        this.button.setAttribute('aria-owns', this.content.id);

        this.clickHandler = function(e) {
            self.toggle();
        };

        if (this.button.addEventListener) {
            this.button.addEventListener('click', this.clickHandler, false);
        }
        else {
            this.button.attachEvent('onclick', this.clickHandler);
        }
    };

    /**
     * Toggle
     */
    Expandable.prototype.toggle = function() {
        var targetClass = this.open ? 'is-closed' : 'is-open';
        var replaceClass = this.open ? 'is-open' : 'is-closed';

        this.open = ! this.open;

        this.target.className = this.target.className.replace(replaceClass, targetClass);

        this.button.setAttribute('aria-expanded', this.open);
        this.content.style.display = this.open ? '' : 'none';
    };

    /**
     * Teardown
     */
    Expandable.prototype.teardown = function() {
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

        this.content.style.display = '';

        delete this.clickHandler;

        delete this.content;
        delete this.button;
        delete this.open;
    };

    return Expandable;

});
