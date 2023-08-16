---
title: Linode Kubernetes Engine
title_meta: "Linode Kubernetes Engine (LKE) Product Documentation"
description: "Linode Kubernetes Engine is a managed Kubernetes service that offers automatic backup and recovery and third party integration with popular k8s-related tools."
linkTitle: Kubernetes
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    product_description: "A managed Kubernetes service that enables you to easily control and scale your application's infrastructure."
published: 2020-06-02
modified: 2023-02-09
---

The Linode Kubernetes Engine (LKE) is a managed container orchestration engine built on top of Kubernetes. LKE enables you to quickly deploy and manage your containerized applications without needing to build (and maintain) your own Kubernetes cluster. All LKE instances are equipped with a fully-managed control plane at no additional cost. Only pay for the worker nodes that run your application and any optional [NodeBalancers](/docs/products/networking/nodebalancers/) (load balancers) and [Block Storage volumes](/docs/products/storage/block-storage/) that your application uses.

## Features

- **Free fully-managed control plane:** The control plane on a Kubernetes cluster is responsible for managing the cluster's worker nodes, resources, and Pods. Basic control plane infrastructure is provided at no cost. An optional [high availability control plane](/docs/products/compute/kubernetes/guides/high-availability-control-plane/) is offered as a paid upgrade.
- **Automatic monitoring, backup, and recovery**: A snapshot of your cluster's metadata is backed up continuously and your cluster is automatically restored in the event of a failure. In addition, all of the control plane components are monitored and, if a failure is detected, they will automatically recover.
- **Kubernetes Dashboard:** All LKE installations include access to a [Kubernetes Dashboard installation](/docs/products/compute/kubernetes/guides/kubernetes-dashboard/#accessing-the-cluster-dashboard).
- **Third-party integration:** Harness the strong open source ecosystem of Kubernetes tooling. LKE supports integration with popular K8s-related tools, such as [Rancher](http://rancher.com), [Helm](http://helm.sh), [Operators](https://coreos.com/operators/), and more.

## Availability

The Linode Kubernetes Engine is available across [all regions](https://www.linode.com/global-infrastructure/).

## Pricing

The basic control plane infrastructure on LKE clusters is provided at no additional cost. An upgrade to a [high availability control plane](/docs/products/compute/kubernetes/guides/high-availability-control-plane/) is priced at $60/month per cluster. All other resources consumed by the cluster are billed at the normal rate, including Compute Instances, NodeBalancers, and Block Storage volumes. Review the [Pricing](https://www.linode.com/pricing/) page for more information on those costs.

## Technical Specifications

- Equipped with a fully-managed control plane at no cost. While the control plane is fully-managed, the user is responsible for managing their deployment configuration and applications.
- Compute Instance plans supported: Dedicated CPU, Shared CPU, High Memory
- Nodes per node pool: 1-100 nodes
- Memory per node: 4GB - 512GB
- SSD Storage per node: 50GB - 7200GB
- Transfer per node: 4-20TB
- 40 Gbps inbound network bandwidth
- Free inbound network transfer
- Provisioning and management through the [Cloud Manager](https://cloud.linode.com/), [Linode CLI](https://www.linode.com/products/cli/), or programmatically through the [Linode API](https://www.linode.com/products/linode-api/)