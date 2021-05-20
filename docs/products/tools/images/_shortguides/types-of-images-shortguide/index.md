---
slug: types-of-images-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that outlines the types of Images.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2021-05-18
modified_by:
  name: Linode
published: 2021-04-28
title: Types of Images
keywords: ["images"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
---

All Images stored on your Account are visible from the main **Images** page within the Cloud Manager. Images are divided between two tables: *Custom Images* and *Recovery Images*.

- **Custom Images:** Images that are manually created by a user on the account. These Images were either captured from an existing Linode's disk or uploaded from an image file. Custom Images do not expire and will remain on the account until they are manually deleted.

- **Recovery Images:** Temporary Images that are automatically created when a Linode is deleted. Recovery Images have a defined expiration data and, once expired, will automatically be deleted. The expiration date is based on how long the Linode was active, as well as a few other factors.