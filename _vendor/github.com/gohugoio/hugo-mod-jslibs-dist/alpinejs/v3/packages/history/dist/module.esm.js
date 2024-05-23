// packages/history/src/index.js
function history(Alpine) {
  Alpine.magic("queryString", (el, {interceptor}) => {
    let alias;
    return interceptor((initialValue, getter, setter, path, key) => {
      let pause = false;
      let queryKey = alias || path;
      let value = initialValue;
      let url = new URL(window.location.href);
      if (url.searchParams.has(queryKey)) {
        value = url.searchParams.get(queryKey);
      }
      setter(value);
      let object = {value};
      url.searchParams.set(queryKey, value);
      replace(url.toString(), path, object);
      window.addEventListener("popstate", (e) => {
        if (!e.state)
          return;
        if (!e.state.alpine)
          return;
        Object.entries(e.state.alpine).forEach(([newKey, {value: value2}]) => {
          if (newKey !== key)
            return;
          pause = true;
          Alpine.disableEffectScheduling(() => {
            setter(value2);
          });
          pause = false;
        });
      });
      Alpine.effect(() => {
        let value2 = getter();
        if (pause)
          return;
        let object2 = {value: value2};
        let url2 = new URL(window.location.href);
        url2.searchParams.set(queryKey, value2);
        push(url2.toString(), path, object2);
      });
      return value;
    }, (func) => {
      func.as = (key) => {
        alias = key;
        return func;
      };
    });
  });
}
function replace(url, key, object) {
  let state = window.history.state || {};
  if (!state.alpine)
    state.alpine = {};
  state.alpine[key] = object;
  window.history.replaceState(state, "", url);
}
function push(url, key, object) {
  let state = {alpine: {...window.history.state.alpine, ...{[key]: object}}};
  window.history.pushState(state, "", url);
}

// packages/history/builds/module.js
var module_default = history;
export {
  module_default as default
};
