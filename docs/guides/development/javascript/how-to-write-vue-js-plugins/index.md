---
slug: how-to-write-vue-js-plugins
description: 'Learn how to create your own Vue.js plugin with an easy-to-use package and add functionality to your Vue apps.'
keywords: ['vue','vue.js','plugin','directive', 'filter', 'mixin']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-09
modified_by:
  name: Linode
title: "Write Your Own Vue.js Plugin"
external_resources:
- '[VueJS](https://vuejs.org/)'
tags: ["web applications"]
authors: ["John Au-Yeung"]
---

## What is a Vue.js Plugin?

A Vue.js plugin is a code package that is used to add features to a Vue.js app. The plugin is structured with JavaScript and exported with an `install` method that takes the `Vue` object as the first parameter and `options` as the second parameter.

The `Vue` parameter is the Vue instance of the current Vue app. With it, you can add your own methods, mixins, and directives with the following standards:

*   To add component instance methods, which is available to all components, attach a new property to the `Vue.prototype` property with your desired function.

*   The method has to be a traditional function because it references the Vue instance with `this`.

*   To add directives, call the `Vue.directive` method with the directive name string and an object with the directive lifecycle hooks as the arguments.

*   Likewise, use the `Vue.mixin` method to declare your own mixin objects.

*   You can also declare a global `Vue` method by attaching a new property to it with a function as its property.

To use the plugin in the app, then call the global `Vue.use` method with the plugin as the first argument and an optional object with options that the plugin takes as the second argument.

The options object in the second argument is available as the value of the `options` parameter in the `install` function.

## Creating a Simple Vue.js Plugin

{{< note respectIndent=false >}}
The code below assumes that the Vue project is created by the [Vue CLI](https://cli.vuejs.org/).
{{< /note >}}

{{< file "src/plugin.js" js >}}
export default {
  // eslint-disable-next-line no-unused-vars
  install(Vue, options) {}
};
{{< /file >}}

{{< file "src/main.js" js >}}
import Vue from "vue";
import App from "./App.vue";
import Plugin from "./plugin";

Vue.use(Plugin);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
{{< /file >}}

The code above, the `plugin.js` file is a plugin that has nothing except the empty `install` function in the object that is exported as the default export:

The plugin is registered in the `main.js` file by calling the `Vue.use` method with the `Plugin` object imported from `plugin.js` as the argument. Then, everything in the plugin becomes available in all parts of the app.

With this skeleton code created, you can add something simple like a method that you can use in the component. For instance, you can add a method that can be used in the component by writing the following code:

{{< file "src/plugin.js" js >}}
export default {
  // eslint-disable-next-line no-unused-vars
  install(Vue, options) {
    Vue.prototype.$toBold = function(text) {
      return `<b>${text}</b>`;
    };
  }
};
{{< /file >}}

{{< file "src/App.vue" html >}}
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
{{< /file >}}

In the code above, you added a new method to the `Vue.prototype` property, which is the `$toBold` method. We added the `$` sign in front of the method name to distinguish it from the methods that is created in components.

Then use the `$toBold` method in the component by calling it with a string of your choice to display the string as bold.

`main.js` remains the same as in the previous example.

You can define global properties by attaching a property to the `Vue` parameter and setting a value to it.

For example, write the following:

{{< file "src/plugin.js" js >}}
export default {
  // eslint-disable-next-line no-unused-vars
  install(Vue, options) {
    Vue.PLUGIN_VERSION = "0.0.1";
  }
};
{{< /file >}}

{{< file "src/App.vue" html >}}
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
{{< /file >}}

In the code above, you attached the `PLUGIN_VERSION` property as a property of the `Vue` object.

Then, import `Vue` in `App.vue` to get the value of the `Vue.PLUGIN_VERSION` property as you did in `App.vue`'s code.

In the template, call the `getVersion` method that is defined to show the value of the `PLUGIN_VERSION` property.

In the browser, '0.0.1' appears.

## Adding Directives to a Vue.js Plugin

You can add directives by calling the `Vue.directive` method. It takes a string for the directive name and an object with the lifecycle hooks for a directive.

A Vue directive has a few hooks. They include the `bind` hook which is called once when the directive is first bound to the component to run initial setup code.

The `inserted` hook is called when the bound element has been inserted into its parent node. When this hook is run, the parent node is present but not necessarily in the document itself.

Finally, the `update` hook is called after the containing component’s VNode has updated, which the DOM node in the virtual DOM of Vue has updated. This hook might be run before the child nodes have updated. You can get the old and new value that is set as the value of the directive in the `update` hook.

To add a directive into the plugin that can be used in the components throughout the app, write the following code:

{{< file "src/plugin.js" js >}}
export default {
  // eslint-disable-next-line no-unused-vars
  install(Vue, options) {
    Vue.directive("highlight", {
      inserted(el) {
        el.style.color = "green";
      }
    });
  }
};

{{< /file >}}

{{< file "src/App.vue" html >}}
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
{{< /file >}}

In the code above, a new directive called `highlight` is defined in `plugins.js`.

Then use it in `App.vue` by adding  `v-highlight` in the component. The highlighted text "foo" displays in green color because you set the content of the element `el` (the `p` element in `App.vue`) to green.

Next, pass the values into the directive and use it as follows:

{{< file "src/plugin.js" js >}}
export default {
  // eslint-disable-next-line no-unused-vars
  install(Vue, options) {
    Vue.directive("highlight", {
      inserted(el, { value }) {
        el.style.color = value ? value : "green";
      }
    });
  }
};
{{< /file >}}

{{< file "src/App.vue" html >}}
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
{{< /file >}}

The code above gets the `value` property from the `binding` parameter in the 2nd position. The `value` property's value is passed in after the equals sign in the template. Therefore, `value` is set to `blue`, so the text displays as blue rather than the default green.

## Adding Mixins to a Vue.js Plugin

You can add mixins to add code that can merged in with a existing code of the component if it is used.

When you declare a mixin inside a plugin, then the methods in the mixin object are merged into all components.

You can create a mixin by calling the `Vue.mixin` method as follows:

{{< file "src/plugin.js" js >}}
export default {
  // eslint-disable-next-line no-unused-vars
  install(Vue, options) {
    Vue.mixin({
      async beforeMount() {
        const res = await fetch("https://api.agify.io/?name=example");
        const { name } = await res.json();
        this.name = name;
      }
    });
  }
};
{{< /file >}}

{{< file "src/components/Foo.vue" html >}}
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
{{< /file >}}

{{< file "src/App.vue" html >}}
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
{{< /file >}}

In the code above, you defined the global mixin with `Vue.mixin` method. Then inside the mixin object, the `beforeMount` hook runs code to get data from an API before all components are mounted.

Then in `App.vue` and `Foo.vue`, you display the value of the `name` state without adding any code to the component thanks to the mixin.

The `beforeMount` hook runs automatically whenever any component is mounted. Therefore, "example" is displayed twice because it fetches the name in the API in each component with the `beforeMount` hook in the mixin.

You should be careful with global mixin code because it runs in all components.

## Adding Filters to a Vue.js Plugin

You can add a global filter to the plugin by calling the `Vue.filter` method. The method takes the name string as the first argument and a function that takes the value that you want to transform and return something that is in the format that you want as the return value.

For example, define a filter in the plugin as follows:

{{< file "src/plugin.js" js >}}
export default {
  // eslint-disable-next-line no-unused-vars
  install(Vue, options) {
    Vue.filter("timeString", val => {
      if (!(val instanceof Date)) {
        return val;
      }
      return val.toLocaleTimeString();
    });
  }
};
{{< /file >}}

{{< file "src/App.vue" html >}}
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
{{< /file >}}

In the code above, you defined a filter called 'timeString' with the function returning a time string if it is the value passed in is an instance of the `Date` object.

In `App`'s template, you applied the `timeString` filter on `new Date()`, which is the date object with the current date and time, with the pipe operator.

Then, something similar to '5:02:49 PM' appears on the screen.

## Accepting Vue.js Plugin Options

You can pass in options to the plugin. To do that, you just have to pass in an object with options in the `Vue.use` as the 2nd argument.

Then fetch it from the 2nd parameter of the `options` parameter.

For example, pass in options and use it in the plugin as follows:

{{< file "src/plugin.js" js >}}
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
{{< /file >}}

{{< file "src/main.js" js >}}
import Vue from "vue";
import App from "./App.vue";
import Plugin from "./plugin";

Vue.use(Plugin, { getDateString: true });

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
{{< /file >}}

{{< file "src/App.vue" html >}}
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
{{< /file >}}

In the code above, you passed in `{ getDateString: true }` as the option object.

In `plugin.js`, you destructured the `getDateString` property from the options object and used it in the filter.

Then when you set the `getDateString` to `true`, a date string is displayed on the screen. Otherwise, the time string is displayed.

## Conclusion

You can define a plugin by creating a JavaScript module that exports an object with the `install` method as a default export.

The `install` method has the `Vue` parameter, which has the Vue instance as its value, and `options` which has the options object as the 2nd argument.

Then inside the plugin, you can add directives, methods, and mixins of our choice.
