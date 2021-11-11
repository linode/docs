(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function isValidVersion(required, current) {
    var requiredArray = required.split('.');
    var currentArray = current.split('.');

    for (var i = 0; i < requiredArray.length; i++) {
      if (!currentArray[i] || currentArray[i] < requiredArray[i]) {
        return false;
      }
    }

    return true;
  }
  function beforeDomReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('readystatechange', function () {
        if (document.readyState === 'interactive') {
          callback();
        }
      });
    } else {
      callback();
    }
  }

  var Bridge = /*#__PURE__*/function () {
    function Bridge() {
      _classCallCheck(this, Bridge);
    }

    _createClass(Bridge, [{
      key: "init",
      value: function init() {
        // Tag all cloaked elements on first page load.
        document.body.querySelectorAll('[x-cloak]').forEach(function (el) {
          var _el$getAttribute;

          el.setAttribute('data-alpine-was-cloaked', (_el$getAttribute = el.getAttribute('x-cloak')) !== null && _el$getAttribute !== void 0 ? _el$getAttribute : '');
        });
        this.configureEventHandlers();
      }
    }, {
      key: "setMutationObserverState",
      value: function setMutationObserverState(state) {
        if (!window.Alpine.version || !isValidVersion('2.4.0', window.Alpine.version)) {
          throw new Error('Invalid Alpine version. Please use Alpine 2.4.0 or above');
        }

        window.Alpine.pauseMutationObserver = !state;
      }
    }, {
      key: "configureEventHandlers",
      value: function configureEventHandlers() {
        var _this = this;

        // Once Turbolinks finished is magic, we initialise Alpine on the new page
        // and resume the observer
        var renderCallback = function renderCallback() {
          // turbo:render fires twice in cached views but we don't want to
          // try to restore Alpine on the preview.
          if (document.documentElement.hasAttribute('data-turbo-preview')) {
            return;
          }

          window.Alpine.discoverUninitializedComponents(function (el) {
            window.Alpine.initializeComponent(el);
          });
          requestAnimationFrame(function () {
            _this.setMutationObserverState(true);
          });
        }; // Before swapping the body, clean up any element with x-turbolinks-cached
        // which do not have any Alpine properties.
        // Note, at this point all html fragments marked as data-turbolinks-permanent
        // are already copied over from the previous page so they retain their listener
        // and custom properties and we don't want to reset them.


        var beforeRenderCallback = function beforeRenderCallback(event) {
          var newBody = event.data ? event.data.newBody : event.detail.newBody;
          newBody.querySelectorAll('[data-alpine-generated-me],[x-cloak]').forEach(function (el) {
            if (el.hasAttribute('x-cloak')) {
              var _el$getAttribute2;

              // When we get a new document body tag any cloaked elements so we can cloak
              // them again before caching.
              el.setAttribute('data-alpine-was-cloaked', (_el$getAttribute2 = el.getAttribute('x-cloak')) !== null && _el$getAttribute2 !== void 0 ? _el$getAttribute2 : '');
            }

            if (el.hasAttribute('data-alpine-generated-me')) {
              el.removeAttribute('data-alpine-generated-me');

              if (typeof el.__x_for_key === 'undefined' && typeof el.__x_inserted_me === 'undefined') {
                el.remove();
              }
            }
          });
        }; // Pause the the mutation observer to avoid data races, it will be resumed by the turbolinks:load event.
        // We mark as `data-alpine-generated-m` all elements that are crated by an Alpine templating directives.
        // The reason is that turbolinks caches pages using cloneNode which removes listeners and custom properties
        // So we need to propagate this infomation using a HTML attribute. I know, not ideal but I could not think
        // of a better option.
        // Note, we can't remove any Alpine generated element as yet because if they live inside an element
        // marked as data-turbolinks-permanent they need to be copied into the next page.
        // The coping process happens somewhere between before-cache and before-render.


        var beforeCacheCallback = function beforeCacheCallback() {
          _this.setMutationObserverState(false);

          document.body.querySelectorAll('[x-for],[x-if],[data-alpine-was-cloaked]').forEach(function (el) {
            // Cloak any elements again that were tagged when the page was loaded
            if (el.hasAttribute('data-alpine-was-cloaked')) {
              var _el$getAttribute3;

              el.setAttribute('x-cloak', (_el$getAttribute3 = el.getAttribute('data-alpine-was-cloaked')) !== null && _el$getAttribute3 !== void 0 ? _el$getAttribute3 : '');
              el.removeAttribute('data-alpine-was-cloaked');
            }

            if (el.hasAttribute('x-for')) {
              var nextEl = el.nextElementSibling;

              while (nextEl && typeof nextEl.__x_for_key !== 'undefined') {
                var currEl = nextEl;
                nextEl = nextEl.nextElementSibling;
                currEl.setAttribute('data-alpine-generated-me', true);
              }
            } else if (el.hasAttribute('x-if')) {
              var ifEl = el.nextElementSibling;

              if (ifEl && typeof ifEl.__x_inserted_me !== 'undefined') {
                ifEl.setAttribute('data-alpine-generated-me', true);
              }
            }
          });
        }; // Streams do not trigger a render event and there is no
        // turbo:after-stream-render so we use turbo:before-stream-render
        // and we delay 2 ticks to simulate the after-stream-render event


        var beforeStreamFormRenderCallback = function beforeStreamFormRenderCallback() {
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              renderCallback();
            });
          });
        };

        document.addEventListener('turbo:render', renderCallback);
        document.addEventListener('turbolinks:load', renderCallback);
        document.addEventListener('turbo:before-render', beforeRenderCallback);
        document.addEventListener('turbolinks:before-render', beforeRenderCallback);
        document.addEventListener('turbo:before-cache', beforeCacheCallback);
        document.addEventListener('turbolinks:before-cache', beforeCacheCallback);
        document.addEventListener('turbo:before-stream-render', beforeStreamFormRenderCallback);
      }
    }]);

    return Bridge;
  }();

  if (window.Alpine) {
    console.error('Alpine-turbo-drive-adapter must be included before AlpineJs');
  } // Polyfill for legacy browsers


  if (!Object.getOwnPropertyDescriptor(NodeList.prototype, 'forEach')) {
    Object.defineProperty(NodeList.prototype, 'forEach', Object.getOwnPropertyDescriptor(Array.prototype, 'forEach'));
  } // To better suport x-cloak, we need to init the library when the DOM
  // has been downloaded but before Alpine kicks in


  beforeDomReady(function () {
    var bridge = new Bridge();
    bridge.init();
  });

})));
