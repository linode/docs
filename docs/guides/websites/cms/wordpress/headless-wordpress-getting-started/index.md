---
slug: headless-wordpress-getting-started
author:
  name: Tom Henderson
description: 'Headless WordPress enables a site to use a decoupled architecture where the backend functionality is available via a REST API. This guide provides an introduction to headless WordPress, along with resources you can use to build your own headless WordPress site.'
keywords: ['headless wordpress','headless wordpress examples','wordpress headless cms']
tags: ['wordpress']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-29
modified_by:
  name: Linode
title: "Headless WordPress: Getting Started"
h1_title: "Headless WordPress Overview"
enable_h1: true
contributor:
  name: Tom Henderson
---

The [WordPress](https://wordpress.com) platform powers more websites than any other web Content Management System (CMS). Sites range from highly sophisticated and high-hit-rate, to tombstone sites, and much in between. As a result, many people are familiar with WordPress' approach to managing content and building websites. However, not all users of WordPress are as familiar with its *headless* capabilities powered by WordPress' REST API. This guide provides an introduction to what headless WordPress is and how to get started using it.

## WordPress Headless CMS

A headless WordPress site detaches the backend administrative interface from the site delivery and other logic components. This is achieved through WordPress' REST API. Any application or client can interact with a WordPress site by exchanging JSON formatted data. Authentication for certain request types and areas of your site can be implemented with JSON Web Tokens (JWT).

Your site's frontend implementation can be created using Angular, React.js, or any modern web framework of your choice. WordPress CMS infrastructure becomes organized source asset data that are queried by an API and ultimately rendered in a method other than WordPress HTML.

Headless WordPress depends on the WordPress CMS backend structure. This includes its SQL database, its security, its schema, and content assets. This puts the onus of the delivery style, security, and user experience on the developer’s desires, sidestepping the formal PHP structure that WordPress uses.

Headless WordPress has a different architectural profile when the WordPress delivery engine is removed. It uses a methodology that delivers data from the CMS and enabled plugins. The headless approach to WordPress delivers a framework that is more customizable, flexible, and dynamic. This allows the content and its management to stay inside of the WordPress CMS, while the frontend implementation is up to the site developers.

## Headless WordPress Examples

Some of the largest sites on the web use Headless WordPress, like [USA Today](https://www.usatoday.com/). They use common source docs across numerous brands. In this way, they control common content, ad pools, and hundreds of different faces for the same content using Headless WordPress. Another popular site using this same technique is [TechCrunch](https://techcrunch.com/).

Similarly, you can use Headless WordPress to manage multiple regional and international sites. If your content is largely similar across regions, you can use a single CMS backend, and still deliver a highly-tailored web appearance with a localized feel.

## What Changes In Headless WordPress?

In a headless WordPress site, you do not rely on WordPress PHP delivery system. Instead, a web framework must be used to render your frontend functionality. This gives developers a wider range of possibilities that may not be available when using WordPress frontend capabilities. Similarly, your content is available to any site or client that can access JSON data. This means your site content is not limited to a single site, platform, or client.

Using a headless WordPress approach also removes the *monolithic* aspect that WordPress has become known for. It is no longer slowed down by heavy processing and large page deliveries making it much more flexible and lightweight.

Since the frontend implementation is completely decoupled from WordPress' backend, your WYSIWYG editor is no longer capable of providing a preview of the rendered site. If your team relies on WordPress' WYSIWYG editor, a headless approach may not be a good option. Another consideration is your available technical resources. A headless WordPress implementation requires a developer that is experienced in the frontend web framework that you choose to work with.

The architectural changes enabled by a headless WordPress implementation provide many benefits, especially in terms of flexibility. However, you should make sure you are prepared to handle the additional technical requirements needed for secure and robust implementation.

## How to Install a Headless WordPress Instance

To get started with Headless WordPress, a working WordPress instance must be installed. As of WordPress version 4.7, the WordPress API is enabled by default.

Deploy a WordPress instance, using our [Deploying WordPress through the Linode Marketplace](/docs/guides/wordpress-marketplace-app/) guide. Once your site is deployed, you can access its REST API by navigating to `http://<example-site>/wp-json`. Your browser should display JSON data representing all available API routes and endpoints.

Natively, WordPress provides cookie authentication when using its REST API. However, you can enable different plugins to use [OAuth 1.0a Server](https://wordpress.org/plugins/rest-api-oauth1/), [Application Passwords](https://wordpress.org/plugins/application-passwords/), and [JSON Web Tokens](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/).

## Query the WordPress API for Resources

Once you have installed your WordPress instance and enabled your desired authentication mechanism, you can query the API to access resources.

Open a terminal session on your computer and use cURL to list all your WordPress site's posts:

    curl -X GET -i http://<example-site>/wp-json/wp/v2/posts

Similarly, to view all site pages, use the following command:

    curl – X GET -i http://<example-site>/wp-json/wp/v2/pages

## Resources and Next Steps

- It's important to review the [WordPress REST API reference](https://developer.wordpress.org/rest-api/reference/) before working to architect your site. This gives you an idea of the resources that are available out of the box.

- Familiarize yourself with the [authentication](https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/) methods available for the WordPress REST API. These authentication methods are common to working with any REST API.

- Choose the frontend web framework that you use. There are many options available. For example, [Frontify](https://frontity.org/) is an open-source React framework for headless WordPress. Another option is using Backbone.js. WordPress provides a [Backbone.js client library](https://developer.wordpress.org/rest-api/using-the-rest-api/backbone-javascript-client/).

- There are long lists of tools that can serve as replacements for the PHP-based WordPress features you might need to replace, including apps like [Snipcart](https://snipcart.com/) or [GoCommerce](https://github.com/netlify/gocommerce) for the popular WooCommerce; [Disqus](https://blog.disqus.com/) replaces WP comments.
