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
})('Labelholder', this, function() {

    /**
     * On
     * @description Adds an event handler
     * @param {Object} bindTo
     * @param {String} event
     * @param {Function} handler
     */
    var on = function(bindTo, event, handler) {
        if (bindTo.addEventListener) {
            bindTo.addEventListener(event, handler, false);
        }
        else {
            bindTo.attachEvent('on' + event, handler);
        }
    };

    /**
     * Off
     * @description Removes an event handler
     * @param {Object} bindTo
     * @param {String} event
     * @param {Function} handler
     */
    var off = function(bindTo, event, handler) {
        if (bindTo.removeEventListener) {
            bindTo.removeEventListener(event, handler, false);
        }
        else {
            bindTo.detachEvent('on' + event, handler);
        }
    };

    /**
     * Trim
     * @description Trim whitespace at start and end of a string
     * @param {String} str
     */
    var trim = function(str) {
        return str ? str.replace(/^\s\s*/, '').replace(/\s\s*$/, '') : '';
    };

    /**
     * Populate
     * @param {Object} target
     * @param {String} value
     */
    var populate = function(target, value) {
        if (trim(target.value).length === 0) {
            target.value = value;
        }
    };

    /**
     * Placeholder
     * @description Visually replaces labels by mocking placeholder behaviour
     * @constructor
     * @param {Object} element
     */
    var Placeholder = function(element) {
        this.target = element;

        // Because you can't guarantee 'innerText' value
        this.text = trim(element.firstChild.nodeValue);

        // *Sigh*
        this.input = document.getElementById( element.getAttribute('for') || element.getAttribute('htmlFor') );

        if (!this.type) {
            this._init();
        }
    };

    /**
     * Init
     * @private
     */
    Placeholder.prototype._init = function() {

        // Hide the label
        this.target.style.position = 'absolute';
        this.target.style.left = '-9999px';

        // Set a title as a little extra help
        this.input.setAttribute('title', this.text);

        // Insert label text into a blank option
        if (this.input.nodeName.toLowerCase() === 'select') {

            this.type = 'select';

            var option = this.input.options[0];
            var optionSelected = !! this.input.selectedIndex || option.getAttribute('selected') !== null;

            if (trim(option.value).length > 0) {
                this.option = document.createElement('option');
                this.input.insertBefore(this.option, option);

                option = this.option;
            }

            option.text = this.text;
            option.value = '';
            option.selected = ! optionSelected;

        }

        // Apply placeholder attribute to text fields if supported
        if (this.input.nodeName.toLowerCase() === 'textarea' || /text|email|tel|url|number/i.test(this.input.type)) {

            this.type = 'text';
            this.supported = ('placeholder' in this.input);

            if (this.supported) {
                this.input.setAttribute('placeholder', this.text);
            }
            else {
                this._contrive();
            }
        }
    };

    /**
     * Contrive
     * @private
     */
    Placeholder.prototype._contrive = function() {
        var self = this;

        this._handlers = {};

        // Set initial value (IE doesn't re-populate input until window.onload event)
        if (document.readyState === 'complete') {
            populate(this.input, this.text);
        }
        else {
            on(window, 'load', function() {
                populate(self.input, self.text);
            });
        }

        // Add a class to hook styles onto
        this.input.className+= ' has-placeholder';

        // Clear placeholder on parent form submit
        if (this.input.form) {

            this._handlers.submit = function() {
                if (self.input.value === self.text) {
                    self.input.value = '';
                }
            };

            on(this.input.form, 'submit', this._handlers.submit);
        }

        // Ensure caret is at the start of text field on focus
        this._handlers.focus = function() {
            if (self.input.value === self.text) {
                if (self.input.setSelectionRange) {
                    self.input.setSelectionRange(0, 0);
                }

                // Genius. <http://msdn.microsoft.com/en-us/library/ie/ms536401(v=vs.85).aspx>
                else if (self.input.createTextRange) {
                    var textRange = self.input.createTextRange();
                    textRange.collapse(true);
                    textRange.select();
                }
            }
        };

        on(this.input, 'focus', this._handlers.focus);

        // Don't clear the field until a key is pressed
        this._handlers.keydown = function() {
            if (self.input.value === self.text) {
                self.input.value = '';
                self.input.className = self.input.className.replace(/\bhas-placeholder\b/, '');
            }
        };

        on(this.input, 'keydown', this._handlers.keydown);

        // Re-populate on blur
        this._handlers.blur = function() {
            if (trim(self.input.value).length === 0) {
                self.input.value = self.text;

                if (!self.input.className.match(/\bhas-placeholder\b/)) {
                    self.input.className+= ' has-placeholder';
                }
            }
        };

        on(this.input, 'blur', this._handlers.blur);
    };

    /**
     * Teardown
     */
    Placeholder.prototype.teardown = function() {
        this.target.style.position = '';
        this.target.style.left = '';

        this.input.removeAttribute('title');

        if (this.type === 'select') {
           if (this.option) {
               this.input.removeChild(this.option);
               delete this.option;
           }
           else {
               this.input.options[0].text = '';
           }
        }
        else {
            if (this.supported) {
                this.input.removeAttribute('placeholder');
            }
            else {
                this.input.className = this.input.className.replace(/\bhas-placeholder\b/, '');

                if (this.input.value === this.text) {
                    this.input.value = '';
                }

                for (var handler in this._handlers) {
                    if (this._handlers.hasOwnProperty(handler)) {
                        off(this.input, handler, this._handlers[handler]);
                    }
                }

                delete this._handlers;
            }

            delete this.supported;
        }

        delete this.type;
    };

    return Placeholder;

});