---
slug: deployment-definition-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that displays the definition for Deployment.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
  name: Heather Zoppetti
published: 2019-07-12
title: Deployment Definition
keywords: []
headless: true
show_on_rss_feed: false
aliases: ['/kubernetes-shortguide-definitions/deployment-definition-shortguide/']
---

### Deployment

A [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) can manage a ReplicaSet, so it shares the ability to keep a defined number of replica Pods up and running. A Deployment can also update those Pods to resemble the desired state by means of rolling updates. For example, if you wanted to update a container image to a newer version, you would create a Deployment, and the Controller would update the container images one by one until the desired state is achieved. This ensures that there is no downtime when updating or altering your Pods.
