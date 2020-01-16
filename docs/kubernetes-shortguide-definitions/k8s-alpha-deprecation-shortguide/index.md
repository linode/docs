---
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
---

{{< caution >}}
The [k8s-alpha CLI](/docs/kubernetes/how-to-deploy-kubernetes-on-linode-with-k8s-alpha-cli/) is deprecated. On **March 31st, 2020**, it will be **removed** from the [linode-cli](https://github.com/linode/linode-cli). After March 31, 2020, you will no longer be able to create or manage clusters created by the linode-cli.

However, you will still be able to successfully manage your clusters using [Terraform](/docs/applications/configuration-management/beginners-guide-to-terraform/), which is how the k8s-alpha CLI itself is implemented. The Terraform configuration files that the k8s-alpha CLI creates are stored in your computer's home folder, under the `.k8s-alpha-linode/` directory.

Other alternatives for creating and managing clusters include:

- The [Linode Kubernetes Engine (LKE)](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/), which creates clusters managed by Linode.
- [Rancher](/docs/kubernetes/how-to-deploy-kubernetes-on-linode-with-rancher-2-x/), which provides a graphical user interface for managing clusters.
{{< /caution >}}