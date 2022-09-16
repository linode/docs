---
slug: getting-started-next-js
author:
  name: Linode Community
  email: docs@linode.com
description: "Next.js has risen as a flexible and capable framework on top of React. With built-in features like routing and server-side rendering, Next.js has the ability to jump start your React application. This tutorial covers everything you need to get started with Next.js."
og_description: "Next.js has risen as a flexible and capable framework on top of React. With built-in features like routing and server-side rendering, Next.js has the ability to jump start your React application. This tutorial covers everything you need to get started with Next.js."
keywords: ['next js vs react','nextjs tutorial','what is next js']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-09-17
modified_by:
  name: Nathaniel Stickman
title: "Getting Started with Next.js"
h1_title: "Getting Started with Next.js"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Next.js: Introduction](https://nextjs.org/learn/foundations/about-nextjs)'
- '[Next.js: Create a Next.js App](https://nextjs.org/learn/basics/create-nextjs-app)'
- '[freeCodeCamp: Get Started with Next.js – The React Library your Project Needs](https://www.freecodecamp.org/news/nextjs-tutorial/)'
---

Next.js is a framework built on top of React, extending React with a range of features for modern web development. Next gives your React applications ready access to features like routing and server-side rendering. At the same time, Next.js brings optimizations and base structures to enhance the experience both for developers and end users.

Whether you are looking to develop a static website or a full-stack application, Next.js comes with the flexibility and features to handle it.

Learn all that you need to get started with Next.js in this tutorial. It explains what Next.js is and walks you through creating an example application, showing off a range of the features Next has to offer.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On Debian and Ubuntu, you can do this with:

            sudo apt update && sudo apt upgrade

    - On AlmaLinux, CentOS (8 or later), or Fedora, use:

            sudo dnf upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## What Is Next.js?

[Next.js](https://nextjs.org/) is actually a React framework. On top of React, Next adds numerous features for building your application. Next implements some additional structure, adds some optimizations, and includes application features like routing and data fetching.

Like with React, Next allows you to create something as simple as a static website or something more complicated like a dynamic web frontend. However, Next.js comes complete with the features needed to implement application routes and server-side rendering. With Next, you can actually create a full-stack application right out of the box.

### Next.js vs React

What are the differences between Next.js and React?

React is a JavaScript library for creating user interfaces. That is fairly broad, and React is consequently highly adaptable and can be extended in a wide range of ways.

Next.js is one of those ways. Next operates on top of React, extending the base React library with a set of features for efficiently developing web applications.

The closer comparison to Next.js is actually the Create React App framework. Create React App is the official tool for creating React application templates. Using Create React App gives you a quick way to set up a React project with many of the features modern web developers expect.

So how does Next.js stand up against Create React App? Here are the key differences:

- Next.js uses server-side rendering by default. This makes for a faster user experience and better SEO performance because content is pre-rendered as HTML by the server before being loaded in the browser.

    Create React App can enable server-side rendering, but that feature is not included, and doing so can be a difficult configuration task.

- Next.js keeps to React's ethos of being flexible and unopinionated. The design of Next leaves just about everything available for configuration. Thus, for those drawn to React for its adaptability, Next maintains the appeal.

    Create React App, on the other hand, is designed to be highly opinionated. Its goal is to restrict the vast options of React, focusing them into a tight set of features to bootstrap the development process.

- Create React App focuses on bootstrapping for the development of single-page applications. It does not include routing, and instead focuses on the key features and structures to help developers quickly and efficiently construct single-page applications.

    Next.js includes routing as one of its additional features and thus can readily build multi-page application right from the start. Again, Next prioritizes adaptability, meaning that by default it is ready to develop everything from single-page applications to complex, full-stack applications.

## How to Create a Next.js App

One of the best ways to get to know Next.js is by building an application with it. In this section, the tutorial walks you through creating a basic Next application to familiarize you with its main parts.

Throughout, the tutorial also attempts to show off some of the main features that Next.js boasts. The goal is to not only get started with Next.js, but to also have a practical demonstration of some of what sets it apart.

Next.js also offers first-class support for TypeScript. This tutorial only covers a JavaScript approach to Next, but you can learn about using Next with TypeScript in our tutorial **Building a Next.js App with TypeScript**.

### Setting Up a Next.js App

Next.js has its own script for boostrapping a project template. This tutorial makes use of this script to get the project base in place.

For that and to help with managing application dependencies, the tutorial uses NPM. You can find a link in the steps below to help you install this if you do not already have it.

1. Follow our tutorial on how to [Install and Use the Node Package Manager (NPM) on Linux](/docs/guides/install-and-use-npm-on-linux/). NPM handles the project's dependencies and runs the Next.js frontend.

1. Create a base Next.js project using `create-next-app`. This example names the new project `example-app`.

    The commands below result in a directory with the new project's name being created, in this case in the current user's home directory:

        cd ~/
        npx create-next-app example-app

    {{< output >}}
Need to install the following packages:
  create-next-app@12.3.0
Ok to proceed? (y)
    {{< /output >}}

1. Change into the project's directory. The rest of this tutorial assumes you are still in this directory unless otherwise noted:

        cd example-app

After the above, Next.js is actually ready to run with a "Welcome" application. Just run the following command to start up the Next.js development server:

    npm run dev

Now in a web browser navigate to port `3000` on your server. For instance, assuming your server's remote IP address is `192.0.2.0`, navigate to `http://192.0.2.0:3000`.

{{< note >}}
To access this remotely, you may first need to open the port in your system's firewall. You can learn about how to do that in one of the guides linked below, depending on your system's Linux distribution.

- For Debian and Ubuntu, refer to our guide on [How to Configure a Firewall with UFW](/docs/guides/configure-firewall-with-ufw/).

- For AlmaLinux, CentOS, and Fedora, refer to our guide on [Enabling and Configuring FirewallD on CentOS](/docs/guides/introduction-to-firewalld-on-centos/)
{{< /note >}}

![Next.js welcome page](nextjs-welcome-page.png)

### Building the Next.js App
Outline the default parts of a Next.js application
Create a component and modify existing parts for an example application

Example is a personal website with blog
- Home
  - Lists posts
- Posts
- About
  - Pulls data from API about the website owner

Show routes using the `pages` directory; include linking between

Show slug-based routing using a `posts` subdirectory under pages and files with the slug names

Define a basic API route (with stub data) and use it in a page

#### Page Routes

{{< file "pages/Home.js" js >}}
{{< /file >}}

{{< file "pages/About.js" js >}}
{{< /file >}}

Demonstration of routes

#### Dynamic Routes

{{ file "pages/posts/first-post.js" js >}}
{{ /file >}}

{{ file "pages/posts/second-post.js" js >}}
{{ /file >}}

Demonstration of slug-based routing

#### API Routes

{{< file "pages/api/about-info.js" js >}}
{{< /file >}}

{{< file "pages/About.js" js >}}
{{< /file >}}

#### Server-side Pre-rendering

Two kinds of pre-rendering: static generation and server-side. Of these, [Next recommends](https://nextjs.org/docs/basic-features/pages#pre-rendering) static generation. It boasts better performance, although server-side rendering may be better in particular use cases.

Show the relevant portion of the file — the feature should already be there, via exporting of the component

{{< file "pages/Home.js" js >}}
{{< /file >}}

### Running the Next.js App

Once everything is in place, you can run the Next.js application with the same command as used earlier to run the template application:

    npm run dev

The above runs the application on a development server. When you are ready to deploy your application to production, you should instead build the Next.js application and start it from there:

    npm run build
    npm run start

## Conclusion

Have more questions or want some help getting started? Feel free to reach out to our [Support](https://www.linode.com/support/) team.
