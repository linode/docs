---
slug: namespaces-definition-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that displays the definition for Namespaces.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
  name: Heather Zoppetti
published: 2019-07-12
title: Namespaces Definition
keywords: []
headless: true
show_on_rss_feed: false
aliases: ['/kubernetes-shortguide-definitions/namespaces-definition-shortguide/']
---

### Namespaces

[Namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) are virtual clusters that exist within the Kubernetes cluster that help to group and organize Kubernetes API objects. Every cluster has at least three Namespaces: default, kube-system, and kube-public. When interacting with the cluster it is important to know which Namespace the object you are looking for is in, as many commands will default to only showing you what exists in the default Namespace. Resources created without an explicit Namespace will be added to the default Namespace.
