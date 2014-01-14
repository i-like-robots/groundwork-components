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
})('LazyImage', this, function() {

    /**
     * Defer Image
     * @description Useful for loading decorative or larger images
     * @constructor
     * @param element
     */
    return function(element) {
        var i, len, attr;
        var img = new Image();
        var placehold = element.children[0];

        element.className+= ' is-loading ';

        img.onload = function() {
            element.className = element.className.replace('is-loading', 'is-loaded');
            element.replaceChild(img, placehold);
        };

        for (i = 0, len = placehold.attributes.length; i < len; i++) {
            attr = placehold.attributes[i];
            if (attr.name.match(/^data-/)) {
                img.setAttribute(attr.name.replace('data-', ''), attr.value);
            }
        }
    };

});
