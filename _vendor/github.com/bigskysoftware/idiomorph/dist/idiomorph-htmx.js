(function(){
    function createMorphConfig(swapStyle) {
        if (swapStyle === 'morph' || swapStyle === 'morph:outerHTML') {
            return {morphStyle: 'outerHTML'}
        } else if (swapStyle === 'morph:innerHTML') {
            return {morphStyle: 'innerHTML'}
        } else if (swapStyle.startsWith("morph:")) {
            return Function("return (" + swapStyle.slice(6) + ")")();
        }
    }

    htmx.defineExtension('morph', {
        isInlineSwap: function(swapStyle) {
            let config = createMorphConfig(swapStyle);
            return config.swapStyle === "outerHTML" || config.swapStyle == null;
        },
        handleSwap: function (swapStyle, target, fragment) {
            let config = createMorphConfig(swapStyle);
            if (config) {
                return Idiomorph.morph(target, fragment.children, config);
            }
        }
    });
})()
