---
slug: services-definition-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that displays the definition for Services.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
  name: Heather Zoppetti
published: 2019-07-12
title: Services Definition
keywords: []
headless: true
show_on_rss_feed: false
aliases: ['/kubernetes-shortguide-definitions/services-definition-shortguide/']
---

### Services

[Services](https://kubernetes.io/docs/concepts/services-networking/service/) group identical Pods together to provide a consistent means of accessing them. Each service is given an IP address and a corresponding DNS entry. Services exist across nodes. There are four types of Services:

 - **ClusterIP**: exposes the Service internally to the cluster; this is the default type of Service.

 - **NodePort**: exposes the Service to the internet from the IP address of the node at the specified port number, which is in the range 30000-32767.

 - **LoadBalancer**: creates a load balancer assigned to a fixed IP address in the cloud if the cloud provider supports it. For clusters deployed on Linode, this is the responsibility of the Linode's Cloud Controller Manager (CCM), which will create NodeBalancers for each of your LoadBalancer services. This is the best way to expose your cluster to the internet.

 - **ExternalName**: maps the Service to a DNS name by returning a CNAME record redirect. ExternalName is good for directing traffic to outside resources, such as a database hosted on another cloud.
