---
slug: pod-definition-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that displays the definition for Pod.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
  name: Heather Zoppetti
published: 2019-07-12
title: Pod Definition
keywords: []
headless: true
show_on_rss_feed: false
aliases: ['/kubernetes-shortguide-definitions/pod-definition-shortguide/']
---

### Pod

A [Pod](https://kubernetes.io/docs/concepts/workloads/pods/pod/) is the smallest deployable unit of computing in the Kubernetes architecture. A Pod is a group of one or more containers with shared resources and a specification for how to run these containers. Each Pod has its own IP address in the cluster. Pods are "mortal," which means that they are created and destroyed depending on the needs of the application
