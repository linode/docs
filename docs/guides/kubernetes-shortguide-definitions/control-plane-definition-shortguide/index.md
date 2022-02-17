---
slug: control-plane-definition-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that displays the definition for Control Plane.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
  name: Heather Zoppetti
published: 2019-07-12
title: Control plane Definition
keywords: []
headless: true
show_on_rss_feed: false
aliases: ['/kubernetes-shortguide-definitions/control-plane-definition-shortguide/']
---

### Control Plane

kube-apiserver, kube-controller-manager, kube-scheduler, and etcd form what is known as the [Control Plane](https://kubernetes.io/docs/concepts/#kubernetes-control-plane) of a Kubernetes cluster. The Control Plane is responsible for keeping a record of the state of a cluster, making decisions about the cluster, and pushing the cluster towards new desired states.
