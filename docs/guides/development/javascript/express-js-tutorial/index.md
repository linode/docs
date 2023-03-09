---
slug: express-js-tutorial
description: 'This tutorial gives a complete overview of how Express JS works, including installation, configuration, templates engines and middleware capabilities.'
keywords: ['express js','node.js','app framework','web application','install express','middleware','template engines']
tags: ['web applications']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-06-11
image: EXPRESSJS.jpg
modified_by:
  name: Nathaniel Stickman
title: "Express JS Tutorial: Get Started Building a Website"
title_meta: "Express JS Tutorial"
external_resources:
- '[Express JS  official documentation](https://expressjs.com/en/4x/api.html)'
- '[Express JS Template engines](https://expressjs.com/en/resources/template-engines.html)'
- '[Express JS middleware functions guide](https://expressjs.com/en/guide/writing-middleware.html)'
- '[MVC design pattern](https://github.com/expressjs/express/tree/master/examples/mvc)'

authors: ["Nathaniel Stickman"]
---

This Express JS tutorial shows you how to set up a basic Express JS website and explains its key features for managing web content and traffic.
Express JS extensive set of features help you get a web application up and running. Its minimalist and flexible design support scaling your applications to fit your use case. Express JS gives you a lean and efficient framework for developing Node.js applications with minimal fuss.

## What is Express JS?

Express JS is a web application framework for Node.js. Essentially, it sits on top of Node.js and provides ready access to the features and tools you need to efficiently create web applications. It prevents you from having to reinvent the wheel while still giving you autonomy with how your web application takes shape.

There are plenty of similar frameworks out there. What sets Express JS apart is its emphasis on a minimal, unobtrusive framework that is fast and flexible. You can use Express JS for applications of all sizes and complexities, and it works well with a wide array of application architectures.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1. Throughout, this guide uses `example-app` as the name of the Express JS application and `example.com` as the server domain name. Replace these with your preferred application name and your server's domain name, respectively.

{{< note respectIndent=false >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Install Express JS

These steps walk you through setting up a basic Express JS application. It uses Express JS's application generator to automatically lay out an application skeleton.

If you want to manually lay out your application's design, you can follow the [Express JS installation guide](https://expressjs.com/en/starter/installing.html), which shows how to create a minimal Node.js application and add Express JS as a dependency. Node.js is a prerequisite, so use one of the links in the first step below to get instructions for installing it.

1. First, you need to install Node.js. You can follow either the guide for [How to Install Node.js and NGINX](/docs/guides/how-to-install-nodejs-and-nginx-on-debian-10/) (just select the appropriate Linux distribution from the drop down) or the [How to Install and Use the Node Version Manager NVM](/docs/guides/how-to-install-use-node-version-manager-nvm/) guide.

1. Change into the directory where you would like your application to live. This guide's example app lives in the current user's home directory. Then, use the Express application generator to create an application skeleton.

        cd ~
        npx express-generator --view=pug example-app

    {{< note respectIndent=false >}}
The `npx` command works in Node.js from version 8.2.0 onward. If you are using an earlier version of Node.js, you first need to install the Express application generator as a global Node.js package. Use the following commands to accomplish the same as the `npx` command above:

    npm install -g express-generator
    express --view=pug example-app

    {{< /note >}}

    This guide uses the *Pug template engine*, which tends to be the most commonly used. However, you can choose from quite a of template engines with Express JS. See the [Express JS Template Engines](#express-js-template-engines) section below for more information on the available templates and how they work.

1. The generator creates an `example-app` directory in the current directory and adds all of the base files for your application there. Change into the new application directory.

        cd example-app

    Unless it says otherwise, the rest of this guide assumes you are still in the `example-app` directory.

1. Install and compile your application's dependencies.

        npm install

1. You can now run the application with the following command.

        DEBUG=example-app:* npm start

    - Express JS serves the application on port `3000`. To visit the application remotely, open the port in your server's firewall and use a web browser to navigate to it. Here is an example using your server's domain name.

          example.com:3000

    - You can, alternatively, use your server's IP address.

          192.0.2.0:3000

    You should be greeted with a "Welcome to Express" message.

## Express JS Template Engines

Express JS has the capability of using a variety of template engines. The template engine takes view files — essentially web page templates — and populates them with information dynamically.

Take a look at Express's [list of Template engines](https://expressjs.com/en/resources/template-engines.html) to see the other template engines Express JS supports out of the box.

Most template engines use their own template formatting. So, the template engine you use at least partially depends on what format you want to write your template files in. For instance, the Pug template engine used in this guide uses a minimalist, whitespace-sensitive format, without the explicit tagging used in HTML. The [Embedded JavaScript (EJS) engine](https://ejs.co/), on the other hand, stays largely true to HTML formatting.

Express JS applications pass information to views using the `render` function on response objects. You can see this in the base application installed above. The `~/example-app/routes/index.js` file uses the `render` function to create the welcome page view for any users visiting the base URL (`/`). In doing so, it also provides data to be used in the view — in this case, a page title.

{{< file "~/example-app/routes/index.js" >}}
// [...]

var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

// [...]
{{< /file >}}

By default, you can find the view templates in the `views` directory. With the Pug engine, the `index` view is in the `~/example-app/views/index.pug` file. There, you can see the template make use of the `title` data to customize the welcome message.

{{< file "~/example-app/views/index.pug" >}}
// [...]

block content
  h1= title
  p Welcome to #{title}
{{< /file >}}

## Express JS Middleware

Express JS's middleware functions perform tasks within an application's request–response cycle. They receive the application's request and response objects as well as the application's `next` function to continue the cycle.

The `app.js` and `~/example-app/routes/index.js` files above, both use middleware functions to route traffic and serve content. Examples from these files are used below to explore further how Express JS's middleware functions work.

Middleware functions come in two levels:

- **Application-level** middleware functions get executed by the application object and are typically used for operations that apply globally. An application object is typically created near the beginning of main application file (`app.js` in this example) through a command like `var app = express()`.

- **Router-level** middleware get executed by router objects. Router objects tend to be declared at the beginning of router files like `~/example-app/routes/index.js` through a command like `var router = express.Router()`. They are used for tasks related to a specific component of the application.

If you are familiar with frameworks that use the [*Model–View–Controller (MVC)*](https://www.visual-paradigm.com/guide/uml-unified-modeling-language/what-is-model-view-control-mvc/) design, you can think of Express JS's routers like controllers. They help to divide the application into manageable and easy to organize components.

In the base application installed above, `app.js` executes an application-level middleware function to catch 404 errors.

{{< file "~/example-app/app.js" >}}
// [...]

app.use('/', ;

// [...]

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
{{< /file >}}

The above also contains a special kind of middleware function for handling errors. These functions take an `err` parameter in addition to the `req`, `res`, and `next` parameters.

For its part, `~/example-app/routes/index.js` executes a router-level middleware to handle requests whenever a user visits the base URL (`/`).

{{< file "~/example-app/routes/index.js" >}}
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
{{< /file >}}

In addition to Express JS's default middleware functions, you have the ability to write your own. Doing so can be immensely helpful when you are working with larger, more complicated applications where behaviors are frequently repeated. To learn more about how this is done, check out Express's guide on [writing your own middleware functions](https://expressjs.com/en/guide/writing-middleware.html).

## Conclusion

One thing to keep in mind when working with Express JS is that it offers a wide range of possibilities. It is capable of handling a wide range of web applications and design patterns.

This guide aims to lay a foundation to get you started. To continue learning about what Express JS can do for your web applications, be sure to look through their [official documentation](https://expressjs.com/en/4x/api.html). They provide plenty of examples for you to work, including one using the [MVC design pattern](https://github.com/expressjs/express/tree/master/examples/mvc). The MVC example is especially helpful to learn Express JS's capabilities and understand the application design possibilities.
