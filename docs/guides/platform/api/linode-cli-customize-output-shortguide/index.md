---
slug: linode-cli-customize-output-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that shows you how to customize output from the Linode CLI.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-22
modified_by:
  name: Heather Zoppetti
published: 2020-07-22
title: How to Customize Output from the Linode CLI
keywords: ["linode cli"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/api/linode-cli-customize-output-shortguide/']
---

By default, the CLI displays a set of pre-selected fields for each type of response. If you would like to see all available fields, use the `--all` flag:

    linode-cli linodes list --all

Specify exactly which fields you would like to receive with the `-format` option:

    linode-cli linodes list --format 'id,region,memory'
