---
slug: csi-definition-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that displays the definition for the Container Storage Interface specification.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
  name: Heather Zoppetti
published: 2019-07-12
title: CSI Definition
keywords: []
headless: true
show_on_rss_feed: false
aliases: ['/kubernetes-shortguide-definitions/csi-definition-shortguide/']
---

### Container Storage Interface

The [Container Storage Interface (CSI) specification](https://github.com/container-storage-interface/spec/blob/master/spec.md) provides a common storage interface for container orchestrators like Kubernetes (and others, like Mesos). The interface is used by an orchestrator to attach storage volumes to containers and to manage the lifecycle of those volumes.

The objective of this specification is to allow cloud computing platforms to develop a single storage plugin that works with any container orchestrator. Linode has authored a [CSI driver](https://github.com/linode/linode-blockstorage-csi-driver) for Linode's Block Storage service, which makes Block Storage Volumes available to your containers.
