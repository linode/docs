---
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that displays the definition for deployment.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-08-03
modified_by:
  name: Heather Zoppetti
published: 2019-06-27
title: Deployment Definition
keywords: []
headless: true
show_on_rss_feed: false
---

### Deployment

A [Deployment](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#deployment-v1-apps) can manage a ReplicaSet, so it shares the ability to keep a defined number of replica pods up and running. A Deployment can also update those Pods to resemble the desired state by means of rolling updates. For example, if you wanted to update a container image to a newer version, you would create a Deployment, and the controller would update the container images one by one until the desired state is achieved. This ensures that there is no downtime when updating or altering your Pods.