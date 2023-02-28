---
title: Cloud Firewall
description: "Linode Cloud Firewall offers a simple interface to protect your web apps. It is scalable security in seconds, allowing you to create custom firewall rules, making security more accessible."
bundles: ['debian-security', 'centos-security', 'network-security']
modified: 2022-07-13
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    date: 2020-11-10
    product_description: "A free cloud-based firewall service that makes it easy to secure network traffic to and from Compute Instances."
aliases: ['/guides/platform/cloud-firewall/','/platform/cloud-firewall/']
---

Linode’s Cloud Firewall is a robust cloud-based firewall solution available at no additional charge for Linode customers. Through this service, you can create, configure, and add stateful network-based firewalls to any Linode Compute Instance.

## Enhanced Security

A Cloud Firewall sits between a Compute Instance and the Internet and can be configured to filter out unwanted network traffic before it even reaches your server. Defend your apps and services from malicious attackers by creating rules to only allow traffic from trusted sources. Firewall rules can filter traffic at the network layer, providing fine-grained control over who can access your servers.

## Simple Interface

Control inbound and outbound traffic using the [Linode API](/docs/api/networking), [Linode CLI](/docs/products/tools/cli/get-started/) or [Cloud Manager](https://www.linode.com/products/cloud-manager/). Each interface can be integrated into your workflow for seamless control over firewall rules. Cloud Firewall make security more accessible and enables you to secure your network traffic without needing to learn complicated software or even access the command line.

## Scalable Security in Seconds

Stay protected as your network grows. Effortlessly apply the same ruleset across multiple Compute Instances. This saves time as you no longer need to manually configure internal software on each server.

## Pricing and Availability

Cloud Firewalls are available at no charge across [all regions](https://www.linode.com/global-infrastructure/).

## Limits and Considerations

- Cloud Firewalls are **compatible with all Linode Compute Instances**. They are not currently directly supported on other Linode services, such as NodeBalancers or Object Storage.
- A Cloud Firewall can be attached to multiple Compute Instances but a Compute Instance can only be attached to one *active* (enabled) Cloud Firewall at a time.
- Cloud Firewall rules are applied to traffic over the public and private network but are not applied to traffic over a private [VLAN](/docs/products/networking/vlans/).
- A maximum of **25 rules** can be added to each Cloud Firewall (both Inbound and Outbound rules combined).
- A maximum of **255 IP addresses (and ranges)** can be added to each Cloud Firewall rule.
- All **IP addresses** and **IP Ranges** must be formatted correctly, or changes will be unable to be saved.
- A maximum of **15 ports (and port ranges)** can be defined on each Cloud Firewall rule.
