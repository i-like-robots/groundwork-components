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
})('Slider', this, function() {

    /**
     * Slider
     * @description A simple horizontal content slider with jump links
     * @constructor
     * @param element
     */
    var Slider = function(element) {
        this.target = element;
        this.runner = element.children[0];
        this.frames = element.children[0].children;

        if (!this.current) {
            this._init();
        }
    };

    /**
     * Init
     * @private
     */
    Slider.prototype._init = function() {
        var self = this;
        this.current = 0;

        // Setup runner and slides
        this.target.style.position = 'relative';
        this.target.style.overflow = 'hidden';

        this.runner.style.position = 'relative';

        // Add next and previous links
        this.linkNext = document.createElement('a');
        this.linkPrev = document.createElement('a');

        this.linkNext.className = this.linkNext.innerHTML = 'next';
        this.linkPrev.className = this.linkPrev.innerHTML = 'prev';

        // Yeah go a bit old school, it's OK ;-)
        this.linkNext.onclick = function() {
            self.to(self.current + 1);
            return false;
        };
        this.linkPrev.onclick = function() {
            self.to(self.current - 1);
            return false;
        };

        this.target.appendChild(this.linkNext);
        this.target.appendChild(this.linkPrev);

        this._update();

        // Use transforms where available
        this.transforms = (function() {
            var i, len;
            var support;
            var props = ['WebkitTransform', 'msTransform', 'transform'];

            for (i = 0, len = props.length; i < len; i++) {
                if (props[i] in document.body.style) {
                    support = props[i];
                    break;
                }
            }

            return support;
        })();

        // On resize we'll need to shift back into position
        this.resize = function() {
            self.to(self.current);
        };

        if (window.attachEvent) {
            window.attachEvent('onresize', this.resize);
        }
        else {
            window.addEventListener('resize', this.resize, false);
        }
    };

    /**
     * To
     * @param {Number} x
     */
    Slider.prototype.to = function(x) {
        if (this.frames[x]) {

            // Ensure runner does not go beyond (runner width - target inner width)
            var max = this.runner.scrollWidth - this.target.clientWidth;
            var min = this.frames[x].offsetLeft;
            var limit = min >= max;

            if (limit) {
                min = max;
            }

            // Perform animation first time we hit the limit only
            if (!limit || !this.limit) {
                if (this.transforms) {
                    this.runner.style[this.transforms] = 'translateX(' + (min * -1) + 'px)';
                }
                else {
                    this.runner.style.left = '' + (min * -1) + 'px';
                }

                this.current = x;
            }

            this.limit = limit;

            this._update();
        }
    };

    /**
     * Update
     * @private
     */
    Slider.prototype._update = function() {
        var classDisabled = ' is-disabled ';
        var regexDisabled = /is\-disabled/g;
        var classFocus = ' is-focus ';
        var regexFocus = /is\-focus/g;

        if (this.current + 1 === this.frames.length || this.limit) {
            this.linkNext.className+= classDisabled;
        }
        else {
            this.linkNext.className = this.linkNext.className.replace(regexDisabled, '');
        }

        if (this.current === 0) {
            this.linkPrev.className+= classDisabled;
        }
        else {
            this.linkPrev.className = this.linkPrev.className.replace(regexDisabled, '');
        }

        for (var i = 0, len = this.frames.length; i < len; i++) {
            this.frames[i].className = this.frames[i].className.replace(regexFocus, '');
        }

        this.frames[this.current].className+= classFocus;
    };

    /**
     * Teardown
     */
    Slider.prototype.teardown = function() {

        this.target.style.position = '';
        this.target.style.overflow = '';

        this.runner.style.position = '';

        this.target.removeChild(this.linkNext);
        this.target.removeChild(this.linkPrev);

        if (window.attachEvent) {
            window.detachEvent('onresize', this.resize);
        }
        else {
            window.removeEventListener('resize', this.resize, false);
        }

        delete this.current;
        delete this.linkNext;
        delete this.linkPrev;
        delete this.transforms;
    };

    return Slider;

});