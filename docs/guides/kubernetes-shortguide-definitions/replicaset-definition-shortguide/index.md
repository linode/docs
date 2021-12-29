---
slug: replicaset-definition-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that displays the definition for ReplicaSet.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
  name: Heather Zoppetti
published: 2019-07-12
title: ReplicaSet Definition
keywords: []
headless: true
show_on_rss_feed: false
aliases: ['/kubernetes-shortguide-definitions/replicaset-definition-shortguide/']
---

### ReplicaSet

A [ReplicaSet](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/) is one of the Controllers responsible for keeping a given number of replica Pods running. If one Pod goes down in a ReplicaSet, another will be created to replace it. In this way, Kubernetes is self-healing. However, for most use cases it is recommended to use a Deployment instead of a ReplicaSet.
