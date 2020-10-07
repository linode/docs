---
slug: api-authenticate-requests-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide shows you how to authenticate requests with the Linode API.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-20
modified_by:
  name: Heather Zoppetti
published: 2020-07-20
title: How to Authenticate Requests with the Linode API
keywords: ["api"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/api/api-authenticate-requests-shortguide/']
---

This token must be sent as a header on all requests to authenticated endpoints. The header should use the format:

    Authorization: Bearer <token-string>

Store the token as a temporary shell variable to simplify repeated requests. Replace `<token-string>` in this example:

    TOKEN=<token-string>
