---
slug: what-is-jamstack
author:
  name: Linode Community
  email: docs@linode.com
description: "Jamstack is an architecture to make your web applications faster, more secure, and easier to maintain. This guide walks you through its key concepts and how to start apply the architecture to your projects."
og_description: "Jamstack is an architecture to make your web applications faster, more secure, and easier to maintain. This guide walks you through its key concepts and how to start apply the architecture to your projects."
keywords: ['jamstack','application architecture','web applications','static site generators','hugo','gatsby','jekyll','microservices']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-04-25
modified_by:
  name: Nathaniel Stickman
title: "What Is Jamstack?"
h1_title: "What Is Jamstack?"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
---

The [Jamstack](https://jamstack.org/) architecture offers a fresh way to look at web applications. It prioritizes pre-rendering your application in static files and strongly decoupling the front end from the back end. Following the Jamstack approach can help you make web applications that are faster, more secure and scalable, and easier to maintain.

In this guide, you can find an explanation of what Jamstack is and some best practices for making a Jamstack application. Then, you can follow our run down on how to get started with the main parts of a Jamstack application.

## What Is Jamstack?

Jamstack is a web-application architecture that features pre-rendered front ends and a strong decoupling of front end and back end. Its goal is to make web applications faster, more secure, and more scalable.

Although there are many ways to go about making a Jamstack application, the "jam" in Jamstack encapsulates crucial components to keep in mind to build an effective one:

- **J**avascript to make modern, dynamic front ends and enable interaction with back end services
- **A**PIs to make your back end services available to your front ends and have a consistent standard for their interactions
- **M**arkup to render front ends through a build process and serve the front end content statically

### Key Concepts

On a conceptual level, there are two key features that Jamstack applications employ to improve speed and efficiency. Those are: pre-rendering and decoupling.

Pre-rendering means generating your site's static files up front instead of at runtime. Tools like static site generators (which are talked about more below) allow you to process and render your application's front end before deployment. The result? Usually, faster load times for your user and a significantly lower hosting overhead.

Decoupling keeps your application's front end distinct and houses any server-side logic your application needs in reusable APIs. Here, this capitalizes on the above advantages of pre-rendering — your front end stays fast and independent and keeps its hosting overhead low. It also makes your application more maintainable overall. Changes to the back end can occur without directly affecting the front end — and vice versa. Additionally, it tends to be much easier to understand where and how front end and back end interact.

Overall, these features result in a faster experience for your application's users and easier application maintenance. And, depending on your application's back end needs, can keep your content hosting overhead low.

### Making the Most of Jamstack

Plenty of web applications already fit the Jamstack architecture generally. However, not all of them implement the pieces in a way that achieves Jamstack's goals of speed, security, and scalability. The following give you some ideas of what you can do to make the most of your application's Jamstack architecture:

- Host your static content on a CDN, object storage, or similar service. Because your Jamstack application's front end is decoupled, you can use these hosting services to serve the static files in a faster, more efficient manner.
- Use a static site generator to build your static content. This makes adding new content to your application easy and streamlined.
- Have your application's builds and deployments automated. Doing this makes delivering changes to your application less troublesome and lets you focus on developing application content and enhancements.
- If you need something from the server side, make use of microservices. These keep your server-side logic in self-contained, maintainable units. Each microservice exposes its own RESTful API that your front end can use.

## Building a Jamstack Application

Below, this guide explores ideas for how you can begin setting up your own Jamstack application. It walks you through the main parts, discusses the relevant concepts, and links you to guides to implement them.

### Static Site Generators and Automated Deployments

Frequently, a Jamstack application uses a static site generator to build the static content from some markup language. The Jamstack website maintains an [extensive list of static site generators](https://jamstack.org/generators/). To help narrow down the list, check out our guide on [How to Choose a Static Site Generator](/docs/guides/how-to-choose-static-site-generator/).

Static site generators render your site's content into static files that you can then host on a CDN, object storage, or similar server. For some ideas, take a look at these guides:
- [Host a Static Site Using Linode Object Storage](/docs/guides/host-static-site-object-storage/), which features the [Hugo](https://gohugo.io/) static site generator
- [Create a CI/CD Pipeline with Gatsby.js, Netlify and Travis CI](/docs/guides/install-gatsbyjs/) which focuses on the [Gatsby](https://www.gatsbyjs.com/) static site generator

Here is an example of how you might set up a CI/CD (continuous integration/continuous delivery) pipeline for a static site generator:

1. Start developing a project with your static site generator of choice on your local machine.

1. When you are ready, build your project, generating its static files.

1. Move your site's static files to the CDN or object storage server.

    If you are using Linode's Object Storage, you can follow the relevant section of the [Host a Static Site Using Linode Object Storage](/docs/guides/host-static-site-object-storage/#upload-your-static-site-to-linode-object-storage) guide.

For those looking for a more advanced and automated solution for static site deployment, you can use steps in the [guide linked above](/docs/guides/install-gatsbyjs/) featuring Gatbsy. Those steps use Git to store your static site generator's project and [Travis CI](https://travis-ci.com/) to test and automatically deploy the static site to your object storage server.

### Microservices

Microservices are part of a distributed application architecture in which services act as largely independent modules. Each microservice should have a clear and distinct interface — often a RESTful API — and function. Other modules or application front ends can then make use of the microservice through that API. Otherwise though, each piece is maintained on its own, in a more decentralized fashion.

One of the draws for using a microservice architecture is how much more maintainable it can make applications. Because each microservice operates mostly independent of others, each can often be more easily tweaked. There is less likelihood of adversely impacting other services, and the connections between services tend to be much more transparent and traceable.

Within a Jamstack application, microservices lean into the decoupling of components. They work well in environments where front end and back end operate independently, and they support Jamstack's emphasis on maintainability.

The following are a couple of our guides that may be helpful in getting your started with your own microservices:

- If you are looking to start out developing microservices of your own, you can use [FastAPI](https://fastapi.tiangolo.com/), a Python micro-framework for building REST APIs quickly and easily. Take a look at [CRUD Read Operations: Use FastAPI to Write an API](/docs/guides/crud-read-operations-use-fastapi-to-write-an-api/) for designing end points that read data and the [CRUD Write Operations: Use FastAPI to Write an API](/docs/guides/crud-write-operations-use-fastapi-to-write-an-api/) for APIs that write data.
- If you already have some microservices built and want some ideas on how you can deploy them, check out the guide on [How to Deploy Microservices with Docker](/docs/guides/deploying-microservices-with-docker/).

## Where to Go Next

To continue your Jamstack journey, you might start out with Jamstack's [list of best practices](https://jamstack.org/best-practices/) to get better acquainted with the philosophy underlying the Jamstack architecture.

Want to go further with Jamstack and get involved with the development of solutions and innovations for it? Take a look at Jamstack's [community page](https://jamstack.org/community/), where you can access Jamstack communication channels and see a listing of upcoming events.
