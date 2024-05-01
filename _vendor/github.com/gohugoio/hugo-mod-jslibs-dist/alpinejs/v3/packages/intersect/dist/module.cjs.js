var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};

// packages/intersect/builds/module.js
__markAsModule(exports);
__export(exports, {
  default: () => module_default
});

// packages/intersect/src/index.js
function src_default(Alpine) {
  Alpine.directive("intersect", (el, {value, expression, modifiers}, {evaluateLater, cleanup}) => {
    let evaluate = evaluateLater(expression);
    let options = {
      threshold: getThreshhold(modifiers)
    };
    let observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && value === "enter" || entry.isIntersecting && value === "leave" || entry.intersectionRatio === 0 && !value)
          return;
        evaluate();
        modifiers.includes("once") && observer.disconnect();
      });
    }, options);
    observer.observe(el);
    cleanup(() => {
      observer.disconnect();
    });
  });
}
function getThreshhold(modifiers) {
  if (modifiers.includes("full"))
    return 0.99;
  if (modifiers.includes("half"))
    return 0.5;
  return 0;
}

// packages/intersect/builds/module.js
var module_default = src_default;
