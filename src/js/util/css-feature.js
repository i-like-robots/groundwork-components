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
})('CSSFeature', this, function() {

    'use strict';

    /**
     * CSS Feature Detection
     * @param {String} property
     * @returns {String}
     */
    return function(property) {
        var i, len, prefixedProp;
        var support = '';
        var prefixes = ['ms', 'Moz', 'webkit'];
        var temp = document.createElement('div');

        if (property in temp.style) {
            support = property;
        }
        else {
            property = property.charAt(0).toUpperCase() + property.slice(1);

            for (i = 0, len = prefixes.length; i < len; i++) {
                prefixedProp = prefixes[i] + property;

                if (prefixedProp in temp.style) {
                    support = prefixedProp;
                    break;
                }
            }
        }

        return support;
    };

});
