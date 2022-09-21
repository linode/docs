---
title: Developers
description: "Linode NodeBalancers can be created and managed with developer tools like the Linode API, CLI, Linode Cloud Controller Manager, and third party tools and integrations."
tab_group_main:
    weight: 50
---

## Linode API

Linode’s [API v4](/docs/api) provides the ability to programmatically manage the full range of Linode products and services. Learn how to manage NodeBalancers with the Linode API:

- [Configure NodeBalancers with the Linode API](/docs/guides/nodebalancers/)

- [NodeBalancers API Endpoint Collection](/docs/api/nodebalancers)

## Linode CLI

The [Linode CLI](https://github.com/linode/linode-cli) is a wrapper around the Linode API v4 that allows you to manage your Linode account and resources from the command line. Learn how to use the Linode CLI to [create and manage NodeBalancers](/docs/platform/api/linode-cli/#nodebalancers).

## Linode Cloud Controller Manager

**Cloud Controller Manager**: Linode's [Cloud Controller Manager (CCM)](https://github.com/linode/linode-cloud-controller-manager/) is written in Go and is included in every Linode Kubernetes Engine cluster's control plane. It creates a fully supported Kubernetes experience on Linode by providing a way for your cluster to access additional Linode services such as NodeBalancers.

- [Deploy NodeBalancers with the Linode Cloud Controller Manager](/docs/guides/getting-started-with-load-balancing-on-a-lke-cluster/)

## Third Party Tools & Integrations

**Terraform**: Terraform is an Infrastructure-as-code tool that includes management features for various types of Linode resources. Use Linode’s [official Terraform Provider](https://registry.terraform.io/providers/linode/linode/latest/docs) to [Create a NodeBalancer with Terraform](/docs/guides/create-a-nodebalancer-with-terraform/). To learn more about Terraform see our documentation library’s [Terraform section](/docs/applications/configuration-management/terraform/).

**Pulumi**: Pulumi is a development tool that allows you to write computer programs which deploy cloud resources. With [Pulumi’s Linode integration](https://github.com/pulumi/pulumi-linode), you can manage your Linode resources in several programming languages, like JavaScript, Go, Python, and TypeScript. Pulumi manages your resources in the same way as Linode's API or CLI. See [Pulumi’s documentation](https://www.pulumi.com/docs/intro/cloud-providers/linode/) to get started.

- [Create and Configure a NodeBalancer with Pulumi](/docs/applications/configuration-management/deploy-in-code-with-pulumi/#create-and-configure-a-nodebalancer)
