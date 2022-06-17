---
slug: k8s-alpha-deprecation-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that displays a deprecation notice where applied'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
  name: Ryan Syracuse
published: 2020-01-03
title: k8s-alpha deprecation Definition
keywords: []
headless: true
show_on_rss_feed: false
aliases: ['/kubernetes-shortguide-definitions/k8s-alpha-deprecation-shortguide/']
---

{{< caution >}}
The [k8s-alpha CLI](/docs/guides/how-to-deploy-kubernetes-on-linode-with-k8s-alpha-cli/) is deprecated. On **March 31st, 2020**, it will be **removed** from the [linode-cli](https://github.com/linode/linode-cli). After March 31, 2020, you will no longer be able to create or manage clusters using the k8s-alpha CLI plugin.

However, you will still be able to [create and manage these clusters using Terraform](/docs/guides/how-to-migrate-from-k8s-alpha-to-terraform/). The [Terraform module](https://github.com/linode/terraform-linode-k8s) used is a public project officially supported by Linode, and is currently used to power the k8s-alpha CLI.

Other alternatives for creating and managing clusters include:

- The [Linode Kubernetes Engine (LKE)](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/), which creates clusters managed by Linode.
- [Rancher](/docs/guides/how-to-deploy-kubernetes-on-linode-with-rancher-2-x/), which provides a graphical user interface for managing clusters.
{{< /caution >}}
