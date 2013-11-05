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
})('CSSFeatureDetection', this, function() {

    /**
     * CSS Feature Detection
     * @param {String} property
     * @returns {String}
     */
    return function(property) {
        var i, len, prop;
        var support = '';
        var prefixes = ['o', 'ms', 'moz', 'webkit'];
        var temp = document.createElement('div');

        prop = property.toLowerCase();
        if (prop in temp.style) {
            support = prop;
        }
        else {
            for (i = 0, len = prefixes.length; i < len; i++) {
                prop = prefixes[i] + property;
                if (prop in temp.style) {
                    support = prop;
                    break;
                }
            }
        }

        return support;
    };

});