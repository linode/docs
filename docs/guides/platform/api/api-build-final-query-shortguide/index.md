---
slug: api-build-final-query-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide shows you how to build a query for the Linode API.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-20
modified_by:
  name: Heather Zoppetti
published: 2020-07-20
title: How to Build a Query for the Linode API
keywords: ["api"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/api/api-build-final-query-shortguide/']
---

Replace the values in the command below with your chosen type, region, and image, and choose a label and secure password.

    curl -X POST https://api.linode.com/v4/linode/instances \
    -H "Authorization: Bearer $TOKEN" -H "Content-type: application/json" \
    -d '{"type": "g5-standard-2", "region": "us-east", "image": "linode/debian9", "root_pass": "root_password", "label": "prod-1"}'
