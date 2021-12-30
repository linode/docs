---
title: Cloud Firewall
description: "Linode Cloud Firewall offers a simple interface to protect your web apps. It is scalable security in seconds, allowing you to create custom firewall rules, making security more accessible."
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    date: 2020-06-02
    product_description: "A free cloud-based firewall service that can be used to secure any Linode Compute Instance, allowing network traffic only on the specified ports, protocols, and IP addresses."
---

Linode’s Cloud Firewall is a robust cloud-based firewall solution available at no additional charge for Linode customers. Through this service, you can create, configure, and add stateful network-based firewalls to any Linode Compute Instance.

## Enhanced Security

A Cloud Firewall sits between a Linode Compute Instance and the Internet and can be configured to filter out unwanted network traffic before it even reaches your server. Defend your apps and services from malicious attackers by creating rules to only allow traffic from trusted sources. Firewall rules can filter traffic at the network layer, providing fine-grained control over who can access your Linodes.

## Simple Interface

Control inbound and outbound traffic using the [Linode API](/docs/api/networking), [Linode CLI](/docs/guides/linode-cli/) or [Cloud Manager](https://www.linode.com/products/cloud-manager/). Each interface can be integrated into your workflow for seamless control over firewall rules. Cloud Firewalls make security more accessible and they enable you to secure your Linode's network traffic without needing to learn complicated firewall software or even access the command line.

## Scalable Security in Seconds

Stay protected as your network grows. Effortlessly apply the same ruleset across multiple Linode Compute Instances. This saves time as you no longer need to manually configure internal firewall software on each server.

## Availability

Cloud Firewalls are available across [all regions](https://www.linode.com/global-infrastructure/).

## Limits and Considerations

{{< content "cloud-firewall-limits-shortguide" >}}
