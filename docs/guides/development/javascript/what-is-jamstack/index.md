---
slug: what-is-jamstack
description: "This guide walks you through the key concepts of the Jamstack, a type of system architecture that makes your web applications faster, more secure, and easier to maintain."
keywords: ['jamstack','application architecture','web applications','static site generators','hugo','gatsby','jekyll','microservices']
tags: ['web applications']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-06-25
modified_by:
  name: Nathaniel Stickman
title: "Getting Started with the Jamstack"
title_meta: "An Introduction to the Jamstack"
external_resources:
- '[Jamstack](https://jamstack.org/)'
- '[Jamstack static site generators](https://jamstack.org/generators/)'
- '[Hugo](https://gohugo.io/)'
authors: ["Nathaniel Stickman"]
---

## What Is the Jamstack?

The [Jamstack](https://jamstack.org/) architecture offers a fresh way to build web applications. It prioritizes pre-rendering your application in static files and strongly decoupling the frontend from the back end. Following the Jamstack approach can help you make your web applications faster, more secure, scalable, and easier to maintain.

The *jam* in Jamstack encapsulates crucial components to keep in mind to build an effective Jamstack application. JAM stands for JavaScript, API, and Markup. The following list describes each piece of the stack:

- **Javascript** — a programming language used to make modern, dynamic frontend applications, and enable interaction with back-end services.
- **APIs** — a protocol and set of definitions used to access and interact with back-end services. Third-party APIs make specialized services available to your application's frontend.
- **Markup** — a language used to render frontend applications through a build process and serve the rendered frontend content statically.

In this guide, you can find learn about the components of the Jamstack and some best practices for making a Jamstack application. Then, you can follow our rundown on how to get started with the main parts of a Jamstack application.

### Key Concepts

There are two key features that Jamstack applications employ to improve speed and efficiency. They are:

- **Pre-rendering**: Generating your site's static files upfront instead of at runtime. Tools like static site generators allow you to process and render your application's front end before deployment. This provides faster load times for your user and significantly lowers your application's required hosting resources.

- **Decoupling**: Keeping your application's frontend distinct and housing any server-side logic your application needs in reusable APIs. Decoupling capitalizes on the advantages of pre-rendering — your front end stays fast and independent and keeps its hosting overhead low. It also makes your application more maintainable overall. Changes to the backend can occur without directly affecting the frontend — and vice versa. Additionally, it tends to be much easier to understand where and how the frontend and backend interact.

Overall, these features result in a faster experience for your application's users and easier application maintenance. And, depending on your application's backend needs, pre-rendering and decoupling can keep your content hosting overhead low.

### Making the Most of the Jamstack

Plenty of web applications already fit the Jamstack architecture. However, not all of them implement the pieces in a way that achieves the Jamstack's goals of speed, security, and scalability. The following gives you some ideas of what you can do to make the most of your application's Jamstack architecture:

- Host your static content on a CDN, object storage, or similar service. Because your Jamstack application's frontend is decoupled, you can use these hosting services to serve the static files in a faster and more efficient manner.

- Use a static site generator to build your static content. This makes adding new content to your application easy and streamlined.

- Automate your application's builds and deployments. Automation helps you deliver your application quickly, consistently, and lets you focus on developing your application.

- If you need something from the server-side, make use of [microservices](/docs/guides/what-is-jamstack/#microservices). These keep your server-side logic in self-contained, maintainable units. Each microservice exposes its own RESTful API that your frontend can use.

## Building a Jamstack Application

This section provides a starting point for you to set up your own Jamstack application. It walks you through the main parts, discusses the relevant concepts, and links you to guides to implement them.

### Static Site Generators and Automated Deployments

It is common for a Jamstack application to use a static site generator to build the static content from a markup language. The Jamstack website maintains an [extensive list of static site generators](https://jamstack.org/generators/). To help narrow down the list, check out our guide on [How to Choose a Static Site Generator](/docs/guides/how-to-choose-static-site-generator/).

Static site generators render your site's content into static files that you can then host on a CDN, object storage, or similar server. For some ideas, take a look at the following guides:

- [Host a Static Site Using Linode Object Storage](/docs/guides/host-static-site-object-storage/), which features the [Hugo](https://gohugo.io/) static site generator.
- [Create a CI/CD Pipeline with Gatsby.js, Netlify and Travis CI](/docs/guides/install-gatsbyjs/) which focuses on the [Gatsby](https://www.gatsbyjs.com/) static site generator.

Here is an example of how you might set up a CI/CD (Continuous Integration/Continuous Delivery) pipeline for a static site generator.

1. Start developing a project with your static site generator of choice on your local machine.

1. When you are ready, build your project, generating its static files.

1. Move your site's static files to the CDN or object storage server.

    If you are using Linode's Object Storage, you can follow the relevant section of the [Host a Static Site Using Linode Object Storage](/docs/guides/host-static-site-object-storage/#upload-your-static-site-to-linode-object-storage) guide.

If you are looking for a more advanced and automated solution for static site deployment, you can follow the steps in the [guide linked above](/docs/guides/install-gatsbyjs/) featuring Gatsby. Those steps use Git to store your static site generator's project and [Travis CI](https://travis-ci.com/) to test and automatically deploy the static site to your object storage server.

### Microservices

Microservices are part of a distributed application architecture in which services act as largely independent modules. Each microservice should have a clear and distinct interface, which is often a RESTful API. Other modules or application frontends can then make use of the microservice through its API. Each service is maintained on its own, in a more decentralized fashion.

One of the draws for using a microservice architecture is how much more maintainable it can make applications. Because each microservice operates mostly independently of others, each can often be more easily tweaked. There is less likelihood of adversely impacting other services, and the connections between services tend to be much more transparent and traceable.

Within a Jamstack application, microservices lean into the decoupling of components. They work well in environments where the frontend and backend operate independently, and they support Jamstack's emphasis on maintainability.

The following are a couple of our guides that may help get you started with your own microservices.

- If you are looking to start out developing microservices of your own, you can use [FastAPI](https://fastapi.tiangolo.com/), a Python micro-framework for building REST APIs quickly and easily. Take a look at [CRUD Read Operations: Use FastAPI to Write an API](/docs/guides/crud-read-operations-use-fastapi-to-write-an-api/) for designing end-points that read data and the [CRUD Write Operations: Use FastAPI to Write an API](/docs/guides/crud-write-operations-use-fastapi-to-write-an-api/) for APIs that write data.

- If you already have some microservices built and want some ideas on how you can deploy them, check out the guide on [How to Deploy Microservices with Docker](/docs/guides/deploying-microservices-with-docker/).

## Where to Go Next

You can continue your Jamstack journey with Jamstack's [list of best practices](https://jamstack.org/best-practices/) to get better acquainted with the philosophy underlying the Jamstack architecture.

Want to go further with Jamstack and get involved with the development of solutions and innovations for it? Take a look at Jamstack's [community page](https://jamstack.org/community/), where you can access Jamstack communication channels and see a listing of upcoming events.
