---
slug: cloud-oauth-apps-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that gives an overview of OAuth support in the Cloud Manager.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-22
modified_by:
  name: Heather Zoppetti
published: 2020-07-22
title: An Overview of OAuth Support in the Cloud Manager
keywords: ["cloud manager"]
headless: true
show_on_rss_feed: false
tags: ["linode platform","cloud manager"]
aliases: ['/platform/manager/cloud-oauth-apps-shortguide/']
---

The Cloud Manager supports the OAuth 2 authorization protocol. OAuth 2 allows a user to safely grant a third-party app permission to act on their behalf. This means that a user could authorize an app to access data and / or make changes to their Linode account and services that are exposed by the [Linode APIv4](https://developers.linode.com/api/v4/). For example, an app could create or destroy Linodes, manage a NodeBalancer, or alter a domain.

To learn how to get started with OAuth Apps see the [How To Create an OAuth App with the Linode Python API Library](/docs/platform/api/how-to-create-an-oauth-app-with-the-linode-python-api-library/) guide. For details on the Linode API v4's OAuth workflow see the [Linode API v4 documentation](https://developers.linode.com/api/v4/#o-auth).
