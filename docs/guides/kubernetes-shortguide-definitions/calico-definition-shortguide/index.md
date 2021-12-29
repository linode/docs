---
slug: calico-definition-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that displays the definition for Calico.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
  name: Heather Zoppetti
published: 2019-07-12
title: Calico Definition
keywords: []
headless: true
show_on_rss_feed: false
aliases: ['/kubernetes-shortguide-definitions/calico-definition-shortguide/']
---

### Calico

[Calico](https://docs.projectcalico.org/v3.8/introduction/) is an implementation of Kubernetes' networking model, and it served as the original reference for the Kubernetes [NetworkPolicy API](https://kubernetes.io/docs/concepts/services-networking/network-policies/) during its development. Calico also provides advanced policy enforcement capabilities that extend beyond Kubernetes' NetworkPolicy API, and these can be used by administrators alongside that API. Calico uses BGP to distribute routes for Kubernetes Pods, without the need for overlays.
