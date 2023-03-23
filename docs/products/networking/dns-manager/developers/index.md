---
title: Developers
description: "Use developer tools like the Linode API or CLI to manage your DNS records."
tab_group_main:
    weight: 50
---

## Linode API

Linode’s [API v4](/docs/api) provides the ability to programmatically manage the full range of Linode products and services.

- [Domains Endpoint Collection](/docs/api/domains)

## Linode CLI

The [Linode CLI](https://github.com/linode/linode-cli) is a wrapper around the Linode API v4 that allows you to manage your Linode account and resources from the command line. Learn how to use the Linode CLI to [create and manage Domains](/docs/products/tools/cli/get-started/#domains).

## External DNS

[External DNS](https://github.com/kubernetes-sigs/external-dns#readme) can manage Linode Domain records for your Kubernetes Services and Ingresses. You can give External DNS access to all of your Linode Domains or restrict access to those needed in your cluster. Learn more about External DNS in the [Building a CD Pipeline Using LKE](https://www.linode.com/docs/guides/build-a-cd-pipeline-with-lke-part-8/) guide and the [External DNS Linode guide](https://github.com/kubernetes-sigs/external-dns/blob/master/docs/tutorials/linode.md).
