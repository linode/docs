---
slug: controller-definition-shortguide
title: Controller Definition
description: 'Shortguide that displays the definition for Controller.'
authors: ["Linode"]
contributors: ["Linode"]
published: 2019-07-12
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: []
headless: true
show_on_rss_feed: false
aliases: ['/kubernetes-shortguide-definitions/controller-definition-shortguide/']
---

### Controller

A Kubernetes Controller is a control loop that continuously watches the Kubernetes API and tries to manage the desired state of certain aspects of the cluster. Examples of different Controllers include:

-   ReplicaSets, which manage the number of running instances of a particular Pod.
-   Deployments, which manage the number of running instances of a particular Pod and can perform upgrades of Pods to new versions.
-   Jobs, which manage Pods that perform one-off tasks.
