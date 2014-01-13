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
})('Details', this, function() {

    /**
     * Details
     * @description Expanding content panels. Keyboard accessible with ARIA hints.
     * @constructor
     * @param element
     */
    var Details = function(element) {
        this.target = element;
        this.button = element.querySelector('[data-behaviour=button]');
        this.content = element.querySelector('[data-behaviour=content]');

        if (this.open === undefined) {
            this._init( element.className.match(/\bis-open\b/) || (element.id && window.location.hash.replace('#', '') === element.id) );
        }
    };

    /**
     * Init
     * @private
     * @param {Boolean} open
     */
    Details.prototype._init = function(open) {
        var i, len;
        var self = this;

        this.open = open;

        if ( ! this.open) {
            this.target.className+= ' is-closed';
            this.content.style.display = 'none';
        }

        var id = this.content.id || this.target.id + '-content';

        this.button.style.cursor = 'pointer';
        this.button.setAttribute('tabindex', 0);
        this.button.setAttribute('role', 'button');
        this.button.setAttribute('aria-controls', id);
        this.button.setAttribute('aria-expanded', this.open);

        this.content.setAttribute('id', id);

        this.listener = function(e) {
             if ( ! e.keyCode || e.keyCode === 13) {
                self.toggle();
            }
        };

        var events = ['click', 'keyup'];

        for (i = 0, len = events.length; i < len; i++) {
            if (window.addEventListener) {
                self.button.addEventListener(events[i], this.listener, false);
            }
            else {
                // Presume legacy IE
                self.button.attachEvent('on' + events[i], this.listener);
            }
        }
    };

    /**
     * Toggle
     */
    Details.prototype.toggle = function() {
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
    Details.prototype.teardown = function() {
        var i, len;

        this.target.className = this.target.className.replace('is-open', '').replace('is-closed', '');

        this.button.style.cursor = '';
        this.button.removeAttribute('role');
        this.button.removeAttribute('tabindex');
        this.button.removeAttribute('aria-controls');
        this.button.removeAttribute('aria-expanded');

        var events = ['click', 'keyup'];

        for (i = 0, len = events.length; i < len; i++) {
            if (window.addEventListener) {
                this.button.removeEventListener(events[i], this.listener, false);
            }
            else {
                // Presume legacy IE
                this.button.detachEvent('on' + events[i], this.listener);
            }
        }

        this.content.style.display = '';

        delete this.open;
    };

    return Details;

});