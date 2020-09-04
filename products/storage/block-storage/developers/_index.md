---
title: Developers
description: "Linode’s Block Storage service lets you increase your Linode’s storage capacity by attaching additional high-speed volumes. Volumes are managed independently of Linodes, so your data persists even if you delete your Linode."
tab_group_main:
    weight: 50
---

## Linode API

Linode’s API v4 provides the ability to programmatically manage the full range of Linode products and services. Learn how to [manage Block Storage Volumes with the Linode API](/docs/platform/api/create-block-storage-volumes-with-the-linode-api/).

## Linode CLI

The Linode CLI is a wrapper around the Linode API v4 that allows you to manage your Linode account and resources from the command line. Learn how to use the Linode CLI to [create and manage Block Storage Volumes](/docs/platform/api/linode-cli/#block-storage-volumes).

## Third Party Tools & Integrations

**Terraform**: Terraform is an Infrastructure-as-code tool that includes management features for various types of Linode resources. Use Linode’s [official Terraform Provider](https://www.terraform.io/docs/providers/linode/r/volume.html) to create and manage Block Storage Volumes. To learn more about Terraform see our documentation library’s [Terraform section](/docs/applications/configuration-management/terraform/).

**Linode Block Storage CSI Driver**: The Container Storage Interface (CSI) defines a standard that storage providers can use to expose block and file storage systems to container orchestration systems. [Linode’s Block Storage CSI driver](https://github.com/linode/linode-blockstorage-csi-driver) follows this specification to allow container orchestration systems, like [Kubernetes](https://www.linode.com/products/kubernetes/), to use Block Storage Volumes to persist data despite a Pod’s lifecycle.

**Pulumi**: Pulumi is a development tool that allows you to write computer programs which deploy cloud resources. With [Pulumi’s Linode integration](https://github.com/pulumi/pulumi-linode), you can manage your Linode resources as you would with our API or CLI, but in a language you may already be familiar with like JavaScript, Go, Python, and TypeScript. See [Pulumi’s documentation](https://www.pulumi.com/docs/intro/cloud-providers/linode/) to get started.

**Docker Volume Driver for Linode**: The [Docker Volume driver](https://github.com/linode/docker-volume-linode) is a plugin that adds the ability to manage Linode Block Storage Volumes as Docker volumes. Good use cases for volumes include off-node storage to avoid size constraints or to movine a container and the related volume between nodes in a Swarm.