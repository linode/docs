---
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that displays the definition for Services.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-08-03
modified_by:
  name: Heather Zoppetti
published: 2019-06-27
title: Services Definition
keywords: []
headless: true
show_on_rss_feed: false
---

### Services

Services group identical Pods together to provide a consistent means of accessing them. Each service is given an IP address, a corresponding DNS entry, and exist across nodes. There are four types of services: ClusterIP, NodePort, LoadBalancer, and ExternalName.

 - **ClusterIP** Exposes the Service internally to the cluster; default service.

 - **NodePort** Exposes the Service to the internet from the IP address of the Node at the specified port number in the range 30000-32767.

 - **LoadBalancer** Creates a load balancer assigned to a fixed IP address in the cloud if the cloud provider supports it. In the case of Linode, this is the responsibility of the Linode Cloud Controller Manager which will create a NodeBalancer for the cluster. This is the best way to expose your cluster to the internet.

 - **ExternalName** Maps the Service to a DNS name by returning a CNAME record redirect. ExternalName is good for directing traffic to outside resources, such as a database hosted on another cloud.