---
title: Developers
description: "Linode provides a wide array of developer tools including Rancher and Terraform integrations and JavaScript and Python libraries."
tab_group_main:
    weight: 50
---

## Linode API

Linode’s [API v4](/docs/api) provides the ability to programmatically manage the full range of Linode products and services.

## Linode CLI

The [Linode CLI](https://github.com/linode/linode-cli) is a wrapper around the Linode API v4 that allows you to manage your Linode account and resources from the command line.

## Linode Developed/Supported Tools

- [Terraform](https://terraform.io/docs/providers/linode/): Linode's official Terraform Provider. Terraform is an Infrastructure-as-code tool that includes management features for various types of Linode resources.

- [Rancher](/docs/guides/how-to-deploy-apps-with-rancher-1/): Rancher's UI centralizes Kubernetes management concerns when dealing with multiple clusters across multiple clouds.

- [Pulumi](https://github.com/pulumi/pulumi-linode): Pulumi lets you use the full feature set of a general purpose programming language, like Python, JavaScript, and GO to manage Linode resources.

- [Packer Builder](https://github.com/linode/packer-builder-linode): The Packer Builder plugin for Linode Images makes it easy to create private Linode Images. Linode Images can be used in subsequent deployments in any Linode region.

- [Block Storage CSI Driver](https://github.com/linode/linode-blockstorage-csi-driver): Container Storage Interface driver for Linode Block Storage integration with Kubernetes and other container orchestrators.

- [Terraform-linode-k8s](https://github.com/linode/terraform-linode-k8s): Terraform Kubernetes installer for Linode. Creates a Kubernetes Cluster on Linode Cloud infrastructure using the ContainerLinux operating system. The cluster is designed to take advantage of the Linode regional private network, and is equipped with Linode cluster enhancements including the CCM, CSI, and ExternalDNS.

- [Linode Cloud Controller Manager](https://github.com/linode/linode-cloud-controller-manager): Kubernetes Addon featuring automatic provisioning of Linode's NodeBalancers to enable load balancing services and includes Linode status reporting to allow resources to be rescheduled when Linodes are powered down or removed.

- [Linode Docker Machine Driver](https://github.com/linode/docker-machine-driver-linode): The Linode Docker Machine Driver provisions Linode instances to run Docker Engine.

- [Docker Volume Driver for Block Storage](https://github.com/linode/docker-volume-linode): The Docker Volume Driver for Linode Block Storage makes it possible to use Docker commands to provision, attach, and detach volumes to containers. Volumes can be destroyed automatically when not in use.

## Community Developed Tools

- [Ansible linode_v4 module](https://docs.ansible.com/ansible/latest/modules/linode_v4_module.html): Ansible includes a "linode_v4" module for automating Linode instance provisioning by [Luke Murphy](https://github.com/lwm).

- [Kubernetes External-DNS](https://github.com/kubernetes-incubator/external-dns/blob/master/docs/tutorials/linode.md): External-DNS is a Kubernetes Incubator project that assigns DNS names to Service and Ingress resources in Kubernetes Clusters. Linode DNS Manager is a supported backend.

- [terraform-provider-acme](https://www.terraform.io/docs/providers/acme/dns_providers/linode.html): The Automated Certificate Management Environment (ACME) provider for Terraform can be used to configure Let's Encrypt, Boulder, and other ACME CAs using Linode's DNS Manager.

- [traefik](https://docs.traefik.io/v1.4/configuration/acme/): Traefik is a HTTP reverse proxy and load balancer for Container Orchestrators (Kubernetes, Docker Swarm, and others) that features automatic TLS configuration using Linode DNS Manager for ACME challenge requests.

- [vagrant-linode](https://github.com/displague/vagrant-linode): Vagrant-linode is a provider plugin for Vagrant that supports the management of Linode instances by [Marques Johansson](https://github.com/displague).

- [Pharmer](https://github.com/pharmer/pharmer): Kubernetes Cluster Manager for kubeadm (Technical Preview).

- [kube-linode](https://github.com/kahkhang/kube-linode): Provision a Kubernetes/CoreOS cluster on Linode by [Andrew Low](https://github.com/kahkhang/).

## Linode Developed/Supported Libraries

- [Linode JavaScript SDK](https://github.com/linode/manager/tree/develop/packages/api-v4): JavaScript client for the [Linode APIv4](/docs/api).

- [linode_api4-python](https://github.com/linode/linode_api4-python): The official python library for the Linode APIv4 in python.

- [linodego](https://github.com/linode/linodego): Official Go client for Linode APIv4.

## Community Developed Libraries

- [lego](https://go-acme.github.io/lego/dns/linode/): Let's Encrypt client and ACME library written in Go featuring support for the Linode DNS Provider.

- [linode-api](https://github.com/tzurbaev/linode-api): Unofficial Linode APIv4 PHP wrapper by [tzurbaev](https://github.com/tzurbaev/linode-api).

- [linode-api-node](https://github.com/RobinJ1995/linode-api-node): Unofficial Linode APIv4 Node.js wrapper by [RobinJ1995](https://github.com/RobinJ1995).

- [linode-api-v4](https://github.com/idimensionz/linode-api-v4): Unofficial Linode APIv4 PHP wrapper by [iDimensionz](https://github.com/idimensionz/linode-api-v4).

- [php-linode-api](https://github.com/hnhdigital-os/php-linode-api): Unofficial Linode APIv4 PHP wrapper by [H&H|Digital](https://github.com/hnhdigital-os).

- [php-linode-unofficial](https://github.com/illblew/php-linode-unofficial): Unofficial Linode APIv4 PHP wrapper by [Will Blew](https://github.com/illblew).

- [LinodeKit](https://github.com/bporter95/LinodeKit): Unofficial Linode APIv4 Swift wrapper by [Ben Porter](https://github.com/bporter95).