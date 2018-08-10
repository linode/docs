---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Install Gatsby.js on Ubuntu 18.04'
keywords: ['gatsbyjs','gatsby','ssg','static site generator']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-08-09
modified: 2018-08-09
modified_by:
  name: Linode
title: "Install Gatsby on Ubuntu 18.04"
contributor:
  name: Linode
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

## Introduction

Gatsby is a [Static Site Generator](/docs/websites/static-sites/how-to-choose-static-site-generator/#what-is-a-static-site) for React built on Node.js. Gatsby focuses on supporting a modern web technology stack based on client-side Javascript, reusable APIs and prebuilt Markdown, otherwise known as the [*JAMstack*](https://jamstack.org/).

## Before You Begin

- This guide assumes you have followed the [Getting Started](https://www.linode.com/docs/getting-started/) and [Securing Your Server](https://www.linode.com/docs/security/securing-your-server/) guides, and that your Linode’s hostname is set.

    - To check your hostname run:

            hostname
            hostname -f

        The first command will output your short hostname; the second, your fully-qualified domain name (FQDN).

- Install [NGINX on Ubuntu 18.04](https://www.linode.com/docs/web-servers/nginx/install-nginx-ubuntu/).
- Set up [NGINX as a Reverse Proxy](/docs/web-servers/nginx/use-nginx-reverse-proxy/) for the Gatsbyjs site.

{{< note >}}
This guide will use sudo wherever possible. Complete the sections of our Securing Your Server guide to create a standard user account, harden SSH access and remove unnecessary network services.
{{</ note >}}

## Install Gatsby on a Linode

1. Install Node.js on your Linode:

        sudo apt install nodejs

1. Ensure Node.js was installed by checking its version:

        node --version

    Gatsby supports versions of Node back to v6.

1. Install the Node Package Manager (npm)

        sudo apt install npm

    Gatsby supports versions of npm back to v3.

1. Gatsbyjs uses the concpet of "starters" that provide a pre-configured base Gatsby site that you can use to build on top off. Install the "Hello World" starter:

        sudo npm install --global gatsby-cli

1. Open a new shell session and SSH into your Linode. Navigate to the NGINX server's root location. In our configuration this is `/usr/share/nginx/html/`. Create a new Gatsby site called `example-site` using the "Hello World" starter and navigate to the directory:

        sudo gatsby new example-site https://github.com/gatsbyjs/gatsby-starter-hello-world
        cd /usr/share/nginx/html/example-site

1. Run the built in Gatsby development server:

        gatsby develop

    After issuing the command, your directory should display the following files:

    {{< output >}}
    LICENSE  node_modules  package.json  package-lock.json  public  README.md  src
    {{</ output >}}

1. Open a browser and enter in your site's FQDN and view the "Hello World" page.

## Set up a Reverse Proxy for Gatsbyjs

### Build Your Gatsby Site

1. In your Gatsyb site's directory, run the build command to build all the site files from source:

        gatsby build






