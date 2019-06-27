---
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that displays the definition for Helm Tiller.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-08-03
modified_by:
  name: Heather Zoppetti
published: 2019-06-27
title: Helm Tiller Definition
keywords: []
headless: true
show_on_rss_feed: false
---

### Helm Tiller

A server component runs on your cluster and receives commands from the Helm client software. Tiller is responsible for directly interacting with the Kubernetes API (which the client software does not do). Tiller maintains the state for your Helm releases.