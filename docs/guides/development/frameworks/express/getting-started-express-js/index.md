---
slug: getting-started-express-js
author:
  name: Linode Community
  email: docs@linode.com
description: 'Express JS is a lightweight and flexible web application framework using Node.js. You can get started quickly, but Express JS also has the potential for complex application designs. This guide shows you how to install Express JS and get started using it.'
og_description: 'Express JS is a lightweight and flexible web application framework using Node.js. You can get started quickly, but Express JS also has the potential for complex application designs. This guide shows you how to install Express JS and get started using it.'
keywords: ['express js','node.js','app framework','web application','install express','middleware','template engines']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-18
modified_by:
  name: Nathaniel Stickman
title: "How to Build a Website with Express JS"
h1_title: "How to Build a Website with Express JS"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Express](https://expressjs.com/)'
---

Express JS can make it easy to get a web application up and running, and, at the same time, its minimalist and flexible design make it able scale to complex applications. Express JS gives you a lean and efficient framework for developing Node.js applications with minimal fuss.

This guide shows you how to set up a basic Express JS website and explains Express JS's key features for managing web content and traffic.

## Before You Begin

1. Familiarize yourself with our [Getting Started](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system:

        sudo apt update && sudo apt upgrade

1. Throughout, this guide uses `example-app` as the name of the Express JS application and `example.com` as the server domain name. Replace these with your preferred application name and your server's domain name, respectively.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## What is Express JS?

Express JS is a web application framework for Node.js. Essentially, it sits on top of Node.js and provides ready access to the features and tools you need for efficiently creating web applications. It prevents you from having to reinvent the wheel while still giving you autonomy with how your web application takes shape.

There are plenty of such frameworks out there. What sets Express JS apart is its emphasis on a minimal, unobtrusive framework that is fast and flexible. You can use Express JS for applications of all sizes and complexities, and it works well with a wide array of application architectures.

## Installing Express JS

These steps walk you through setting up a basic Express JS application. It uses Express's application generator to automatically lay out an application skeleton.

If you want to manually lay out your application's design, you can follow Express's [installation guide](https://expressjs.com/en/starter/installing.html), which shows how to create a minimal Node.js application and add Express JS as a dependency. Node.js is a prerequisite, so use one of the links in the first step below to get instructions for installing it.

1. First, you need to install Node.js. You can follow either the guide for [How to Install Node.js and NGINX](/docs/guides/how-to-install-nodejs-and-nginx-on-debian-10/) (just select the appropriate Linux distribution from the drop down) or the guide for [How to Install and Use the Node Version Manager NVM](/docs/guides/how-to-install-use-node-version-manager-nvm/).

1. Change into the directory where you would like your application to live — the current user's home directory in the following example. Then, use the Express application generator to create an application skeleton:

        cd ~
        npx express-generator --view=pug example-app

    {{< note >}}
The `npx` command works in Node.js from version 8.2.0 onward. If you are using an earlier version of Node.js, you first need to install the Express application generator as a global Node.js package. Use the following commands to accomplish the same as the `npx` command above:

    npm install -g express-generator
    express --view=pug example-app

    {{< /note >}}

    This guide uses the Pug template engine, which tends to be the most commonly used. However, you can choose from quite a variety of template engines with Express JS. See the [Express JS Template Engines](/docs/guides/getting-started-express-js#express-js-template-engines) section below for more on available templates and how they work.

1. The generator creates an `example-app` directory in the current directory and adds all of the base files for your application there. Change into the new application directory:

        cd example-app

    Unless it says otherwise, the rest of this guide assumes you are still in this directory.

1. Install and compile your application's dependencies:

        npm install

1. You can now run the application with the following command:

        DEBUG=example-app:* npm start

    Express JS serves the application on port **3000**. To visit the application remotely, open the port in your server's firewall and use a web browser to navigate to it. Here is an example using your server's domain name:

        example.com:3000

    You can, alternatively, use your server's IP address:

        198.51.100.0:3000

    You should be greeted with a "Welcome to Express" message.

## Express JS Template Engines

Express JS has the capability of using a variety of template engines. The template engine takes view files — essentially web page templates — and populates them with information dynamically.

Take a look at Express's [list of template engines](https://expressjs.com/en/resources/template-engines.html) to see the other template engines Express JS supports out of the box.

Most template engines use their own template formatting. So, the template engine you use at least partially depends on what format you want to write your template files in. For instance, the Pug template engine used in this guide uses a minimalist, whitespace-sensitive format, without the explicit tagging used in HTML. The Embedded JavaScript (EJS) engine, on the other hand, stays largely true to HTML formatting.

Express JS applications pass information to views using the `render` function on response objects. You can see this in the base application installed above. The `routes/index.js` file uses the `render` function to create the welcome page view for any users visiting the base URL (`/`). In doing so, it also provides data to be used in the view — in this case, a page title:

{{< file "routes/index.js" >}}
// [...]

var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

// [...]
{{< /file >}}

By default, you can find the view templates in the `views` directory. With the Pug engine, the `index` view is in the `views/index.pug` file. There, you can see the template make use of the `title` data to customize the welcome message:

{{< file "views/index.pug" >}}
// [...]

block content
  h1= title
  p Welcome to #{title}
{{< /file >}}

## Express JS Middleware

Express JS's middleware functions perform tasks within an application's request–response cycle. They receive the application's request and response objects as well as the application's `next` function to continue the cycle.

The `app.js` and `routes/index.js` files above both use middleware functions to route traffic and serve content. Below, examples from these files are used to explore further how Express JS's middleware functions work.

Middleware functions come in two levels:
- **Application-level** middleware functions get executed by the application object and are typically used for operations that apply globally. An application object is typically created near the beginning of main application file (`app.js` here) through a command like `var app = express()`.
- **Router-level** middleware get executed by router objects. Router objects tend to be declared at the beginning of router files like `routes/index.js` through a command like `var router = express.Router()`. They are used for tasks related to a specific component of the application.

If you are familiar with frameworks that use the model–view–controller (MVC) design or something similar, think of Express JS's routers like controllers. They help to divide the application into manageable and easy to organize components.

In the base application installed above, `app.js` executes an application-level middleware function to catch 404 errors:

{{< file "app.js" >}}
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

For its part, `routes/index.js` executes a router-level middleware to handle requests whenever a user visits the base URL (`/`):

{{< file "routes/index.js" >}}
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
{{< /file >}}

In addition to Express JS's default middleware functions, you have the ability to write your own. Doing so can be immensely helpful when working with larger, more complicated applications where behaviors are frequently repeated. To learn more about how this is done, check out Express's guide on [writing your own middleware functions](https://expressjs.com/en/guide/writing-middleware.html).

## Conclusion

One thing to keep in mind when working with Express JS is that it offers a wide range of possibilities. It is capable of handling a wide range of web applications and design patterns for them.

This guide aims to lay a foundation to get you started. To continue learning about what Express JS can do for your web applications, be sure to look through Express's [official documentation](https://expressjs.com/). They provide plenty of examples to work off of, including one using the [MVC design pattern](https://github.com/expressjs/express/tree/master/examples/mvc). That one can be especially helpful to learn Express JS's capabilities and give an example of application design possibilities.
