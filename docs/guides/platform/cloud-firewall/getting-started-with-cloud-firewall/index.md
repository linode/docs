---
slug: getting-started-with-cloud-firewall
author:
  name: Linode
  email: docs@linode.com
description: "This guide demonstrates how to create a Cloud Firewall, edit firewall rules, and apply it to a Linode."
keywords: ["firewall", "cloud firewall", "security", "securing"]
tags: ["cloud manager","linode platform","security","networking"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-11-09
modified_by:
  name: Linode
published: 2020-07-24
title: Getting Started with Linode's Free Cloud Firewall Service
h1_title: Getting Started with Cloud Firewalls
enable_h1: true
image: feature.png
aliases: ['/platform/cloud-firewall/getting-started-with-cloud-firewall/']
---

## What is Linode Cloud Firewall?

Linode's free Cloud Firewall service can be used to create, configure, and add stateful network-based firewalls to Linode services. A Cloud Firewall is independent of the service it is attached to and, therefore, you can apply a single Cloud Firewall to multiple Linode services.

### Features

A Cloud Firewall analyzes traffic against a set of predefined rules at the network layer and determines if the traffic is permitted to communicate to or from the Linode Service it secures. Cloud Firewalls can be configured with an implicit deny or allow rule-- they can block or allow all traffic by default and only pass through or deny network traffic that meets the parameters of the configured rules.

{{< note >}}
Users that do not have [Network Helper](/docs/guides/network-helper/) enabled and are instead relying on a configuration that uses DHCP will need to manually allow DHCP traffic through port 67 and 68 of their Cloud Firewall. A full list of IP addresses for our DHCP servers can be found in our [DHCP IP Address Reference Guide](/docs/guides/dhcp-ip-address-reference/).
{{< /note >}}

### Inbound and Outbound Rules

A Cloud Firewall can be configured with *Inbound* and *Outbound* rules. Inbound rules limit incoming network connections to a Linode service based on the port(s) and sources you configure. Outbound rules limit the outgoing network connections coming from a Linode service based on the port(s) and destinations you configure.

### Predefined Rules

The Linode Cloud Manager provides a list of *predefined rules* that you can add to your Cloud Firewall. The predefined rules support common networking use cases and provide an easy foundation to get started with Cloud Firewalls. Since you can edit any rule applied to a Cloud Firewall you can use the predefined rules as a foundation and further [edit their configurations](/docs/products/networking/cloud-firewall/guides/edit-rules/)and also [add new custom rules](/docs/products/networking/cloud-firewall/guides/add-rules/) to your Firewall.

## Add a Cloud Firewall

{{< content "add-a-cloud-firewall-shortguide" >}}

## Assign a Cloud Firewall to a Linode Service

{{< content "assign-a-cloud-firewall-to-linode-service-shortguide" >}}

## Configure Cloud Firewall Rules

Upon initial creation of a Cloud Firewall, you are required to select Firewall rules from a predefined list that supports common networking use cases. This section shows you how to add new Firewall rules to your Firewall's existing rules, edit your Firewall's predefined rules, and delete Firewall rules.

### Add New Cloud Firewall Rules

{{< content "add-new-cloud-firewall-rules-shortguide" >}}

### Edit Cloud Firewall Rules

{{< content "edit-cloud-firewall-rules-shortguide" >}}

### Delete Cloud Firewall Rules

{{< content "delete-cloud-firewall-rules-shortguide" >}}

## Update a Cloud Firewall's Status

{{< content "cloud-firewall-status-shortguide" >}}

## Delete a Cloud Firewall

{{< content "delete-cloud-firewall-shortguide" >}}

## Limits and Considerations

{{< content "cloud-firewall-limits-shortguide" >}}