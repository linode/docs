---
slug: introduction-to-the-solid-data-protocol
description: 'This guide will introduce you to the Solid protocol, created by Tim Berners-Lee and gives Internet users ownership over their data, and how to incorporate the tech.'
keywords: ['solid protocol']
tags: ['web applications']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-27
modified_by:
  name: Linode
title: "An Overview of the Solid Data Protocol"
title_meta: "Introduction to the Solid Data Protocol"
external_resources:
- '[Solid Getting Started Developer Guide](https://solidproject.org/developers/tutorials/getting-started)'
- '[Solid GitHub page](https://github.com/solid/solid-tutorial-intro)'
authors: ["Andy Patrizio"]
---
## The Origins of the Solid Protocol

Just over thirty years ago, a physicist named [Tim Berners-Lee](https://en.wikipedia.org/wiki/Tim_Berners-Lee) created a decentralized, collaborative read-write space he called the World Wide Web. Initially, the first browser was also an editor for content creation. As the web grew, web content shifted to development and design tools. HTML made up less of a web page as cascading style sheets, JavaScript, Python, and other technologies took over. As this happened, user data was taken out of the domain of its owner and transferred to the Internet companies that own the websites. It’s been the cause for debate for some time; do you own the contents of your Facebook page or does Facebook?

Another issue is the transferability and mobility of data. For the longest time, we kept our data on our PC. Then came multiple PCs, phones and tablets, and cloud storage. Now your personal data is scattered across several sites and their own storage implementations. Not just that, but your data is difficult to migrate since different apps store data very differently.

Dr. Berners-Lee has become increasingly disillusioned with how the web has been misused to violate the privacy of its users. For this reason, he sought to create a new means to protect an individual's personal data. With a donation from Mastercard in 2015, he and his research team at the Massachusetts Institute of Technology began the work on *Solid* (“social linked data”). In 2018, he took a sabbatical from MIT to launch a commercial venture based on Solid, called *Inrupt*. The company's mission is to provide an ecosystem to help protect the integrity and quality of the new web built on Solid. It’s a way for you to own your own data while making it available to the applications that you want to allow to use it.

## What is the Solid Protocol?

[Solid](https://solidproject.org/) is a tech stack that incorporates a group of related protocols and implementations, much like the web Berners-Lee created. All of the protocols used are W3C-approved standards, and some were even developed by Berners-Lee himself.

Solid is a decentralized platform for social web applications. With this new design, a user’s data is managed independently of the applications that create and consume this data. Solid uses *Pods* to store your data. It is possible to have multiple Pods, and they can be stored anywhere; on your PC, mobile devices, or in the cloud. You then have control over which apps and individuals may have access to a specific bit of data within your Pod. You can also revoke access at any given time.

The protocols used by Solid are based on existing W3C recommendations for reading, writing, and access control of the contents of users’ Pods. In Solid architecture, applications can operate over data owned by the user or that the user has access to. The storage location of the data on the web does not influence how applications can interact with your data. The app becomes irrelevant in terms of accessing the data so long as it uses the W3C authentication and access standards. Any app can access any Pod.

## The Solid Protocol and Medical Records

The Solid protocol has the potential to make a big impact on the security of your medical records. The portability of medical records and medical history is something the medical industry has pursued for years. Medical records are kept in silos with no connection between each record. Solid allows a person to create a Pod where only their medical records are stored. A user can then give access to their medical records to their physicians and turn it off if they change doctors.

## How Solid Works

Solid applications are implemented as client-side web or mobile applications that read and write data directly from the Pods. Applications are by design decoupled from the data source. This allows applications to aggregate data from different sources on the web. The application can access both the user’s Pod and other Pods, and multiple applications can reuse the same data on a Pod.

Berners-Lee explained that Solid is not unlike a typical web app. You have a front-end (the app or web page) and a back-end (a server app). Both pieces communicate using a custom server API. With Solid, all users have a universal API that handles all the backend data and access control.

Solid uses decentralized authentication, a global ID space, and global single sign-on. Solid uses the WebID identifier and protocol that Berners-Lee invented in 2000 for user access, along with a cryptographic key.

Solid applications read and write data stored in users’ Pods via RESTful HTTP operations using Linked Data Platform (LDP). Pods use LDP to organize data into containers that group resources together, giving each container and resource their own Uniform Resource Identifier (URI).

The Solid platform includes solid.js, a JavaScript library implementing the Solid protocols. The Solid protocols guarantee efficient performance for social applications regardless if these applications use solid.js or not. Usage of solid.js is intended to accelerate the development of Solid applications by enabling you to write less code.

For more advanced options, Solid supports [SPARQL](https://en.wikipedia.org/wiki/SPARQL). SPARQL is an Resource Description Framework (RDF) query language able to retrieve and manipulate data stored in RDF format. It allows applications to express complex data retrieval operations, including operations that require server-to-server communication via link-following. This simplifies Solid application development since it enables a developer to delegate complex, multi-pod data retrieval operations to the server.

Berners-Lee has been working on Solid since 2016, but it is still in its early stages and the community is still growing. The [subreddit for Solid](https://www.reddit.com/r/SOLID/) currently has about 2,000 members. If you'd like to learn more, the project has a [home page with documentation](https://solidproject.org/developers/tutorials/getting-started) on how to build Solid apps, and there is a [GitHub page](https://github.com/solid/solid-tutorial-intro) with sample code and tutorials as well.
