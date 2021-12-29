---
slug: helm-tiller-definition-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that displays the definition for Helm Tiller.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
  name: Heather Zoppetti
published: 2019-07-12
title: Helm Tiller Definition
keywords: []
headless: true
show_on_rss_feed: false
aliases: ['/kubernetes-shortguide-definitions/helm-tiller-definition-shortguide/']
---

### Helm Tiller

A server component that runs on your cluster and receives commands from the Helm client software before its deprecation in [Helm 3](https://helm.sh/docs/faq/#removal-of-tiller). [Tiller](https://v2.helm.sh/docs/glossary/#tiller) has been removed in Helm 3. Tiller is responsible for directly interacting with the Kubernetes API (which the client software does not do). Tiller maintains the state for your Helm releases.