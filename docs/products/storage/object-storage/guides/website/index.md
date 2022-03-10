---
author:
  name: Linode
  email: docs@linode.com
title: "Host a Static Website"
description: "Learn how to host a static website using Linode's Object Storage service."
---

Linode's Object Storage service enables you to easily host a static website. Traditionally, these static files would be served by a web server (like [NGINX](/docs/guides/web-servers/nginx/) or [Apache](/docs/guides/web-servers/apache/)) running on a Compute Instance or other virtual machine. With Object Storage, you no longer neeed to configure and maintain a web server.

## Develop Your Website

The first step is to actually create the website you wish to host. On a *very* high level, this typically involves designing the website and translating that design into markup and code. There are a few different options and tools available to use when developing a website:

- **Code editor:** Write the markup and code needed to create your website. While simple text editors (like nano and Notepad) are sufficient, dedicated code editors have features like code completion, syntax highlighting, preview tools, and *much* more. Examples include [Visual Studio Code](https://code.visualstudio.com/), [Atom](https://atom.io/), [Brackets](https://brackets.io/), and [Sublime Text](https://www.sublimetext.com/).
- **Front-end (CSS) frameworks:** Quickly prototype and translate your design using pre-built css/js classes and optional HTML templates. Examples include [Bootstrap](https://getbootstrap.com/), [Tailwind](https://tailwindcss.com/), and [Foundation](https://get.foundation/).
- **Static site generators:** Write content in easy to understand markup languages, like markdown, and quickly generate the static html files based on that content. Since these tooks separates content from presentation, you can develop your theme and layout in one place and cascade those changes to your entire site. Examples include [Gatsby](https://www.gatsbyjs.com/), [Hugo](https://gohugo.io/), and [Jekyll](https://jekyllrb.com/).

Since applications like Wordpress depend on server-side code, they are not compatible with hosting directly through Object Storage.

## Create a Bucket

Create an Object Storage bucket by following the instructions within the [Create and Manage Buckets](/docs/products/storage/object-storage/guides/manage-buckets/) guide. If you intend to use this bucket with a custom domain, the bucket must be labeled as your fully qualified domain name, such as `assets.example.com` or any subdomain of `*.your-domain.tld`.

## Upload the Website Files to Object Storage

Your website files now need to be uploaded to the newly created bucket. Since the Cloud Manager upload interface does not support uploading or creating folders, use the Linode CLI, s3cmd, Cyberduck, or other tool.

## Configure Your Bucket to Host the Website

The website needs

## Configure a Custom Domain

