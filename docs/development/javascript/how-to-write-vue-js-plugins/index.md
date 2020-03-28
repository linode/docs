---
author:
  name: Linode Community
  email: docs@linode.com
description: 'This article to walk you through how to create your own Vue.js plugin to let you add functionality to a Vue app with an easy to use package.'
og_description: 'This article to walk you through how to create your own Vue.js plugin to let you add functionality to a Vue app with an easy to use package.'
keywords: ['vue','vue.js','plugin','directive', 'filter' 'mixin']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-27
modified_by:
  name: Linode
title: "Index"
h1_title: "How to Write Your Own Vue.js Plugin"
contributor:
  name: John Au-Yeung
  link: https://twitter.com/AuMayeung
external_resources:
- '[VueJS](https://vuejs.org/)'
---

## What's a Vue.js Plugin?
A Vue.js plugin is a code package that's used to add features to our Vue.js app. It's structured as a JavaScript that's exported with an `install` function inside it that takes the `Vue` object as the first parameter, and an `options` as a second parameter.

The `Vue` parameter is the Vue instance of the current Vue app. With it, we can add our own methods to, mixins, and directive into it.

To add component instance methods, which will be available to all components, we can attach a new property to the `Vue.prototype` property with a function that does what we want.

The method has to be a traditional function since it references the Vue instance with `this`

To add directives, we can call the `Vue.directive` method with the directive name string and object with the directive lifecycle hooks as their arguments.

Likewise, there's the `Vue.mixin` method to declare our own mixin.

We can also declare a global `Vue` method by attach a new property to it with a function as its property.

If we want to use our plugin in our app, then call the global `Vue.use` method with our plugin as the first argument and an optional object with options that our plugin takes as the second argument.

The options object in the second argument will be available as the value of the `options` parameter in the `install` function.

## Creating a Simple Plugin
We can create our very simple plugin by writing the following code:

`plugin.js`

```js
export default {
  install(Vue, options) {}
};
```

`main.js`

```js
import Vue from "vue";
import App from "./App.vue";
import Plugin from "./plugin";

Vue.use(Plugin);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
```

In the code above, we created a plugin that has nothing in except the empty `install` function in the object's that's exported as the default export in `plugin.js`.

Then we can register it in `main.js` by calling the `Vue.use` method with the `Plugin` object imported from `plugin.js` as the argument. Then everything in the plugin will be available in all parts of our app.

The code above assumes that the Vue project is created by the Vue CLI.

With this skeleton code created, we can add something simple like a method that we can use in our component. For instance, we can a method that we can use in our component by writing the following code:

`plugin.js`

```js
export default {
  install(Vue, options) {
    Vue.prototype.$toBold = function(text) {
      return `<b>${text}</b>`;
    };
  }
};
```

`App.vue`

```js
<template>
  <div id="app">
    <p v-html="$toBold('foo')"></p>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>
```

In the code above, we added a new method to the `Vue.prototype` property, which is the `$toBold` method. We added the `$` sign in front of our method name to distinguish it from the methods that we create in components.

Then we used the `$toBold` method right in our component by calling it with a string of our choice.

It'll then be displayed as bold.

`main.js` remains the same as in the previous example.

We can define global properties by attaching a property to the `Vue` parameter and setting a value to it.

For instance, we can write the following to do that:

`plugin.js`

```js
export default {
  install(Vue, options) {
    Vue.PLUGIN_VERSION = "0.0.1";
  }
};
```

`App.vue`

```js
<template>
  <div id="app">
    <p>{{getVersion()}}</p>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: "App",
  methods: {
    getVersion() {
      return Vue.PLUGIN_VERSION;
    }
  }
};
</script>
```

In the code above, we attached the `PLUGIN_VERSION` property as a property of the `Vue` object.

Then we imported `Vue` in `App.vue`, we can get the value of the `Vue.PLUGIN_VERSION` property as we did in `App.vue`'s code.

In the template, we call the `getVersion` method that we defined to show the value of the `PLUGIN_VERSION` property.

We'll then see '0.0.1' on the browser screen.

## Adding Directives
We can add directives by calling the `Vue.directive` method. It takes a string for the directive name and an object with the lifecycle hooks for a directive.

A Vue directive has a few hooks. They include the `bind` hook which is called once when the directive is first bound to the component to run initial setup code.

There's also the `inserted` hook which is called when the bound element hs been inserted into its parent node. When this hook is run, the parent node is present but not necessarily in the document itself.

Finally, there's the `update` hook that's called after the containing component's VNode, which the the DOM node in Vue's virtual DOM has update. But it might be run before its children have been updated.

We can get the old and new value that's set as the value of the directive in the  `update` hook.

We can get things like the name of the directive, value's that's passed in, the string of the expression, etc.

To add a directive into our plugin that can be used in our components throughout our app, we can write the following code:

`plugin.js`

```js
export default {
  install(Vue, options) {
    Vue.directive("highlight", {
      inserted(el) {
        el.style.color = "green";
      }
    });
  }
};

```

`App.vue`

```js
<template>
  <div id="app">
    <p v-highlight>foo</p>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>
```

In the code above, we defined a new directive called `'highlight'` in `plugins.js`.

Then we can use it in our `App` component by putting  `v-highlight` in our component. Then we'll get our text highlighted is displayed with green color because we set the content of the element `el`, which is the p element in the example, to color green.

Therefore, we'll see that the word 'foo' is displayed in green.

We can pass in values into our directive and use it as follows:

`plugin.js`

```js
export default {
  install(Vue, options) {
    Vue.directive("highlight", {
      inserted(el, { value }) {
        el.style.color = value || "green";
      }
    });
  }
};
```

`App.vue`

```js
<template>
  <div id="app">
    <p v-highlight="'blue'">foo</p>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>
```

In the code above, we take the `value` property from the `binding` parameter in the 2nd position. The `value` property's value is what we passed in after the equal sign in the template.

Therefore, `value` should be `'blue'`, and we get that the text is displayed with a blue color.

## Adding Mixins
We can add mixins to add code that'll be merged in with a component's existing code if it's used.

If we declare a mixin inside a plugin, then the methods in the mixin object will be merged into all components.

We can create a mixin by calling the `Vue.mixin` method as follows:

`plugin.js`

```js
export default {
  install(Vue, options) {
    Vue.mixin({
      async beforeMount() {
        const res = await fetch("https://api.agify.io/?name=michael");
        const { name } = await res.json();
        this.name = name;
      }
    });
  }
};
```

`components/Foo.vue`

```js
<template>
  <div>{{name}}</div>
</template>

<script>
export default {
  name: "Foo",
  data() {
    return {
      name: ""
    };
  }
};
</script>
```

`App.vue`

```js
<template>
  <div id="app">
    <div>{{name}}</div>
    <Foo></Foo>
  </div>
</template>

<script>
import Foo from "./components/Foo";

export default {
  name: "App",
  components: {
    Foo
  },
  data() {
    return {
      name: ""
    };
  }
};
</script>
```

In the code above, we defined our global mixin with the `Vue.mixin` method. Then inside the mixin object, we added the `beforeMount` hook to run some code to get data from an API before all components are mounted.

Then in `App.vue` and `Foo.vue`, we display the value of the `name` state without adding any code to our component because of the mixin that we added.

The `beforeMount` hook will automatically run whenever any component is mounted. Therefore, we'll get 'michael' displayed twice since we get the name in the API in each component with the `beforeMount` hook in the mixin.

We should be careful with global mixin code since they run in all components.

## Adding a Filter
We can add a global filter to our plugin by calling the `Vue.filter` method. The method takes the name string as the first argument and a function that takes the value that we want to transform and we return something that's in the format that we want as the return value.

For instance, we can define a filter in a plugin as follows:


`plugin.js`

```js
export default {
  install(Vue, options) {
    Vue.filter("timeString", val => {
      if (!(val instanceof Date)) {
        return val;
      }
      return val.toLocaleTimeString();
    });
  }
};
```

`App.vue`

```js
<template>
  <div id="app">
    <div>{{new Date() | timeString}}</div>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>
```

In the code above, we defined a filter called 'timeString' with the function returning a time string if it's the value passed in is an instance of the `Date` object.

In `App`'s template, we display applied the `timeString` filter on `new Date()`, which is the date object with the current date and time, with the pipe operator.

Then we get something like '5:02:49 PM' displayed on the screen.

## Accepting Options
We can pass in options to our plugin. To do that, we just have to pass in an object with options in the `Vue.use` as the 2nd argument.

Then we can get it from the 2nd parameter of the `options` parameter.

For instance, we can pass in options and use it in our plugin as follows:

`plugin.js`

```js
export default {
  install(Vue, { getDateString }) {
    Vue.filter("dateOrTimeString", val => {
      if (!(val instanceof Date)) {
        return val;
      }

      if (getDateString) {
        return val.toDateString();
      }
      return val.toLocaleTimeString();
    });
  }
};
```

`main.js`

```js
import Vue from "vue";
import App from "./App.vue";
import Plugin from "./plugin";

Vue.use(Plugin, { getDateString: true });

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
```

`App.vue`

```js
<template>
  <div id="app">
    <div>{{new Date() | dateOrTimeString}}</div>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>
```

In the code above, we passed in `{ getDateString: true }` as the option object.

In `plugin.js`, we destructured the `getDateString` property from the options object and used it in our filter.

Then when we set it to `getDateString` to `true`, we get a date string displayed on the screen. Otherwise, we get the time string.

## Conclusion
We can define a plugin by creating a JavaScript module that exports an object with the `install` method as a default export.

The `install` method has the `Vue` parameter, which has the Vue instance as its value, and `options` which has the options object as the 2nd argument.

Then inside, we can add directives, methods, and mixins of our choice.