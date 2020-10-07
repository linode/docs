---
slug: linode-cli-account-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that displays the Account section of the Linode CLI guide.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-22
modified_by:
  name: Heather Zoppetti
published: 2020-07-22
title: How to Manage Your Account with the Linode CLI
keywords: ["linode cli"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/api/linode-cli-account-shortguide/']
---

View or update your account information, add payment methods, view notifications, make payments, create OAuth clients, and do other related tasks through the `account` action:

1.  View your account:

        linode-cli account view

1.  View your account settings:

        linode-cli account settings

1.  Make a payment:

        linode-cli account payment-create --cvv 123 --usd 20.00

1.  View notifications:

        linode-cli account notifications-list
