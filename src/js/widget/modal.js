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

    /**
     * Modal
     * @description A simple modal window
     * @constructor
     * @param element
     */
    var Modal = function(element) {
        this.target = element;

        if (!this.isOpen) {
            this._init();
        }
    };

    /**
     * Init
     * @private
     */
    Modal.prototype._init = function() {
        var self = this;

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
            self.close();
        };

        this.modalWindow.appendChild(this.modalWrapper);
        this.modalWrapper.appendChild(this.modalContent);
        this.modalWindow.appendChild(this.closeButton);

        this.isOpen = false;
    };

    /**
     * Open
     * @param  {string} content
     */
    Modal.prototype.open = function(content, callback) {
        if (this.isOpen) {
            return;
        }

        if (content) {
            this.update(content);
        }

        this.target.appendChild(this.overlay);
        this.target.appendChild(this.modalWindow);
        this.modalWindow.focus();

        this.isOpen = true;

        if (callback) {
            callback.call(this);
        }
    };

    /**
     * Update
     * @param  {string} content
     */
    Modal.prototype.update = function(content) {
        this.modalContent.innerHTML = content;
    };

    /**
     * Close
     */
    Modal.prototype.close = function(callback) {
        this.target.removeChild(this.modalWindow);
        this.target.removeChild(this.overlay);
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

        delete this.closeButton;
        delete this.modalContent;
        delete this.modalWrapper;
        delete this.modalWindow;
        delete this.overlay;
        delete this.isOpen;
    };

    return Modal;

});
