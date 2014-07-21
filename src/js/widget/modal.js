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
})('Modal', this, function() {

    'use strict';

    /**
     * Modal
     * @constructor
     * @param {HTMLElement} element
     */
    function Modal(element) {
        this.target = element;

        if (!this.isOpen) {
            this._init();
        }
    }

    /**
     * Init
     * @private
     */
    Modal.prototype._init = function() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'overlay';
        this.overlay.setAttribute('tabindex', -1);

        this.modalWindow = document.createElement('div');
        this.modalWindow.className = 'modal';
        this.modalWindow.setAttribute('role', 'dialog');
        this.modalWindow.setAttribute('tabindex', 0);

        this.modalWrapper = document.createElement('div');
        this.modalWrapper.className = 'modal__wrapper';

        this.modalContent = document.createElement('div');
        this.modalContent.className = 'modal__content';

        this.closeButton = document.createElement('button');
        this.closeButton.className = 'modal__close';
        this.closeButton.innerHTML = 'Close';
        this.closeButton.setAttribute('type', 'button');

        this.closeButton.onclick = function() {
            this.close();
        }.bind(this);

        this.escapeHandler = function(e) {
            if (e.keyCode === 27) {
                this.close();
            }
        }.bind(this);

        this.focusHandler = function(e) {
            if (!this.modalWrapper.contains(e.target)) {
                e.stopPropagation();
                this.modalContent.focus();
            }
        }.bind(this);

        this.modalWindow.appendChild(this.modalWrapper);
        this.modalWrapper.appendChild(this.modalContent);
        this.modalWindow.appendChild(this.closeButton);

        this.trigger = null;
        this.isOpen = false;
    };

    /**
     * Open
     * @param {String} content
     */
    Modal.prototype.open = function(content, callback) {
        if (this.isOpen) {
            return;
        }

        if (content) {
            this.update(content);
        }

        // Hide all background content from focus
        for (var i = 0, len = this.target.children.length; i < len; i++) {
            this.target.children[i].setAttribute('aria-hidden', true);
        }

        this.target.appendChild(this.overlay);
        this.target.appendChild(this.modalWindow);

        window.addEventListener('focus', this.focusHandler, false);
        window.addEventListener('keyup', this.escapeHandler, false);

        this.trigger = document.activeElement;
        this.modalWindow.focus();

        this.isOpen = true;

        if (callback) {
            callback.call(this);
        }
    };

    /**
     * Update
     * @param {String} content
     */
    Modal.prototype.update = function(content) {
        this.modalContent.innerHTML = content;
    };

    /**
     * Close
     */
    Modal.prototype.close = function(callback) {
        window.removeEventListener('focus', this.focusHandler, false);
        window.removeEventListener('keyup', this.escapeHandler, false);

        this.target.removeChild(this.modalWindow);
        this.target.removeChild(this.overlay);

        for (var i = 0, len = this.target.children.length; i < len; i++) {
            this.target.children[i].removeAttribute('aria-hidden');
        }

        if (this.trigger) {
            this.trigger.focus();
            this.trigger = null;
        }

        this.isOpen = false;

        if (callback) {
            callback.call(this);
        }
    };

    /**
     * Teardown
     */
    Modal.prototype.teardown = function() {
        if (this.isOpen) {
            this.close();
        }

        delete this.escapeHandler;
        delete this.focusHandler;

        delete this.closeButton;
        delete this.modalContent;
        delete this.modalWrapper;
        delete this.modalWindow;
        delete this.overlay;

        delete this.trigger;
        delete this.isOpen;
    };

    return Modal;

});
