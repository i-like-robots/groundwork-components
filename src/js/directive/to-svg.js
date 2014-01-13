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
})('ToSVG', this, function() {

    /**
     * To SVG
     * @description Loads in images only for modern 'HTML5' browsers.
     * @constructor
     * @param element
     */
    return function(element) {
        if (window.SVGElement) {
            element.src = element.src.replace(/\.(png|gif)/, '.svg');
        }
    };

});