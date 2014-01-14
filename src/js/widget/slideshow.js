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
})('Slideshow', this, function() {

    /**
     * Slideshow
     * @description A simple slideshow for use with CSS transitions
     * @constructor
     * @param element
     */
    var Slideshow = function(element) {
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
    Slideshow.prototype._init = function() {
        var self = this;

        this.current = 0;
        this.maximum = this.frames.length - 1;

        // Add next and previous links
        this.linkNext = document.createElement('a');
        this.linkPrev = document.createElement('a');

        this.linkNext.className = this.linkNext.innerHTML = 'next';
        this.linkPrev.className = this.linkPrev.innerHTML = 'prev';

        // Yeah go a bit old school, it's OK ;-)
        this.linkNext.onclick = function() {
            self.to(self.current + 1, true);
            return false;
        };
        this.linkPrev.onclick = function() {
            self.to(self.current - 1, true);
            return false;
        };

        this.target.appendChild(this.linkNext);
        this.target.appendChild(this.linkPrev);

        // Presume if CSS transition property is available
        // then transition events are also implemented
        var prefix = (function() {
            var i, len, prefix;
            var test = document.body.style;
            var prefixes = ['ms', 'moz', 'webkit'];

            if ('transition' in test) {
                prefix = '';
            }
            else {
                for (i = 0, len = prefixes.length; i < len; i++) {
                    if (prefixes[i] + 'Transition' in test) {
                        prefix = prefixes[i];
                        break;
                    }
                }
            }

            return prefix;
        })();

        this.transitionEnd = (function() {
            var event;

            if (typeof prefix === 'string') {
                event = prefix.length ? prefix + 'TransitionEnd' : 'transitionend';
            }

            return event;
        })();

        // Only kick off autoplay when transition has ended to
        // prevent slides looping continuously in the background
        if (this.transitionEnd) {
            this.transitionEndHandler = function() {
                if (self.timeout) {
                    self._autoplay();
                }
            };

            this.target.addEventListener(this.transitionEnd, this.transitionEndHandler, true);
        }

        // Kick off and start autoplay
        this.to(this.current);
        this._autoplay();
    };

    /**
     * Autoplay
     * @private
     */
    Slideshow.prototype._autoplay = function() {
        var self = this;
        var target = this.current + 1;

        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(function() {
            self.to(target);
        }, 5000);
    };

    /**
     * Loop
     * @private
     * @param {Number} x
     */
    Slideshow.prototype._loop = function(x) {
        if (x > this.maximum) {
            x = 0;
        }
        else if (x < 0) {
            x = this.maximum;
        }

        return x;
    };

    /**
     * To
     * @param {Number} x
     * @param {Boolean} user
     */
    Slideshow.prototype.to = function(x, user) {
        x = this._loop(x);

        if (this.frames[x]) {

            // Stop autoplay on user interaction
            if (user && this.timeout) {
                clearTimeout(this.timeout);
                delete this.timeout;
            }

            this.before = this._loop(x - 1);
            this.current = x;
            this.after = this._loop(x + 1);

            this._update();
        }
    };

    /**
     * Update
     * @private
     */
    Slideshow.prototype._update = function() {
        var classBefore = ' is-before ';
        var classCurrent = ' is-current ';
        var classAfter = ' is-after ';
        var classRegex = /is\-before|is\-current|is\-after/g;

        for (var i = 0, len = this.frames.length; i < len; i++) {
            this.frames[i].className = this.frames[i].className.replace(classRegex, '');
        }

        this.frames[this.before].className+= classBefore;
        this.frames[this.current].className+= classCurrent;
        this.frames[this.after].className+= classAfter;

        // Force an autoplay 'tick' when transitions
        // and events are not available
        if ( ! this.transitionEnd && this.timeout) {
            this._autoplay();
        }
    };

    /**
     * Teardown
     */
    Slideshow.prototype.teardown = function() {
        this.target.removeChild(this.linkNext);
        this.target.removeChild(this.linkPrev);

        if (this.transitionEnd) {
            this.target.removeEventListener(this.transitionEnd, this.transitionEndHandler);
        }

        if (this.timeout) {
            clearTimeout(this.timeout);
            delete this.timeout;
        }

        delete this.after;
        delete this.before;
        delete this.current;
        delete this.linkNext;
        delete this.linkPrev;
        delete this.transitionEnd;
        delete this.transitionEndHandler;
    };

    return Slideshow;

});
