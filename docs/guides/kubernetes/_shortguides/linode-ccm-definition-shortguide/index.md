---
slug: linode-ccm-definition-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that displays the definition for Linode CCM.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
  name: Heather Zoppetti
published: 2019-07-12
title: Linode CCM Definition
keywords: []
headless: true
show_on_rss_feed: false
aliases: ['/kubernetes-shortguide-definitions/linode-ccm-definition-shortguide/']
---

### Linode Cloud Controller Manager

The [Linode Cloud Controller Manager (CCM)](https://github.com/linode/linode-cloud-controller-manager) creates a fully supported Kubernetes experience on Linode:

- Linode NodeBalancers are automatically deployed when a Kubernetes Service of type "LoadBalancer" is deployed. This is the most reliable way to allow services running in your cluster to be reachable from the Internet.

- Linode hostnames and network addresses (private/public IPs) are automatically associated with their corresponding Kubernetes resources, forming the basis for a variety of Kubernetes features.

- Node resources are put into the correct state when Linodes are shut down, allowing Pods to be appropriately rescheduled.

- Nodes are annotated with the Linode region, which is the basis for scheduling based on failure domains.
