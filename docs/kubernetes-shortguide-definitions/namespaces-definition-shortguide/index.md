---
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that displays the definition for Namespaces.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-08-03
modified_by:
  name: Heather Zoppetti
published: 2019-06-27
title: Namespaces Definition
keywords: []
headless: true
show_on_rss_feed: false
---

### Namespaces

[Namespaces](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#namespace-v1-core) are virtual clusters that exist within the Kubernetes cluster that help to group and organize objects. Every cluster has at least three namespaces: default, kube-system, and kube-public. When interacting with the cluster it is important to know which Namespace the object you are looking for is in, as many commands will default to only showing you what exists in the default namespace. Resources created without an explicit namespace will be added to the default namespace.