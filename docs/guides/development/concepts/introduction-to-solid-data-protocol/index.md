---
slug: introduction-to-solid-data-protocol
author:
  name: Linode Community
  email: docs@linode.com
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-16
modified_by:
  name: Linode
title: "Introduction to Solid Data Protocol"
h1_title: "h1 title displayed in the guide."
enable_h1: true
contributor:
  name: Your Name
  link: Github/Twitter Link
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

Just over thirty years ago, a physicist named Tim Berners-Lee created a decentralized, collaborative read-write space he called the World Wide Web.

Initially, the first browser was also an editor for content creation. As the Web grew, Web content shifted to development and design tools. HTML made up less of a Web page as cascading style sheets, JavaScript, Python, and other technologies took over.

As this happened, user data was taken out of the domain of its owner and transferred to the Internet companies that own the Websites. It’s been the cause for debate for some time; do you own the contents of your Facebook page or does Facebook?

Another issue is the transferability and mobility of data. For the longest time we kept our data on our PC. Then came multiple PCs, phones and tablets, and cloud storage. Now your personal data is scattered hither and yon and you have a devil of a time keeping track of it all. Not just that, but your data is difficult to migrate, since different apps store data very differently.

Dr. Berners-Lee to the rescue, again. He became increasingly disillusioned with how the Web, his creation, was being misused to violate the privacy of its users and sought to create a new means to protect an individual's personal data. With a donation from Mastercard in 2015, he and his research team at the Massachusetts Institute of Technology, began the work on Solid (“social linked data”). In 2018, he took a sabbatical from MIT to launch a commercial venture based on Solid, called Inrupt. The company's mission is to provide commercial energy and an Ecosystem to help protect the integrity and quality of the new web built on Solid. It’s a way for you to own your own data while making it available to the applications that you want to allow to use it.

Solid is a tech stack, a group of related protocols and implementations, much like the web Berners-Lee created. All of the protocols used are W3C-approved standards, and some were even developed by Berners-Lee himself.

Solid is a decentralized platform for social Web applications where the user’s data is managed independently of the applications that create and consume this data. Solid uses “Pods,” where your data is stored. It is possible to have multiple pods, and they can be stored anywhere; on your PC, mobile devices, or in the cloud. You then have control over which apps and individuals may have access to a specific bit of data within your pod, and you can revoke access at any given time.

Solid protocols are based on existing W3C recommendations for reading, writing, and access control of the contents of users’ pods. In Solid architecture, applications can operate over data owned by the user or that the user has access to, regardless of the location of this data on the Web. The app becomes irrelevant in terms of accessing the data so long as it uses the W3C authentication and access standards. Any app can access any pod.

One example: portability of medical records and medical history is something the medical industry has pursued for years. Medical records are kept in silos with no connection between them for the patient. Doctors come and go, people move and need to find a new doctor, and so on.

Solid allows a person to create a Pod where only their medical records are stored and then give only their physicians access to it, and turn it off if they change doctors. That’s just one example.
How Solid Works

Solid applications are implemented as client-side Web or mobile applications that read and write data directly from the pods. Applications are by design decoupled from the data source, so they can aggregate data from different sources on the Web by accessing both the user’s pod and other pods, and allows multiple applications to reuse the same data on a pod.

Berners-Lee explained that Solid is not unlike a typical Web app. You have a front-end (the app or Web page) and back-end (a server app) and they communicate using a custom server API. With Solid, all users have a universal API that handles all the backend data that controls access.

Solid uses decentralized authentication, a global ID space, and global single sign-on. Solid uses the WebID identifier and protocol that Berners-Lee invented in 2000 for user access, along with a cryptographic key.

Solid applications read and write data stored in users’ pods via RESTful HTTP operations using Linked Data Platform (LDP). Pods use LDP to organize data into containers that group together resources, giving each container and resource their own Uniform Resource Identifier (URI).

The Solid platform includes solid.js, a JavaScript library implementing the Solid protocols. The Solid protocols guarantee efficient performance for social applications regardless if these applications use solid.js or not, but using solid.js is intended to accelerate the development of Solid applications by writing less code.

For more advanced options, Solid supports SPARQL, an RDF query language able to retrieve and manipulate data stored in Resource Description Framework (RDF) format. It allows applications to express complex data retrieval operations, including operations that require server-to-server communication via link-following. This simplifies Solid application development, since it enables a developer to delegate complex, multi-pod data retrieval operations to the server.


Berners-Lee has been working on Solid since 2016 but it is still in its early stages and the community is pretty small; the subReddit for Solid doesn’t even have 2,000 members. The project has a home page with documentation on how to build Solid apps, and there is a GitHub page with sample code and tutorials as well.



