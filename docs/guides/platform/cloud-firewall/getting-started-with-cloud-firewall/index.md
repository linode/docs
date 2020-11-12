---
slug: getting-started-with-cloud-firewall
author:
  name: Linode
  email: docs@linode.com
description: 'This guide shows you how to add a Cloud Firewall and apply it to a Linode service using the Linode Cloud Manager. You also learn how to edit your Cloud Firewall rules, add new custom rules, and disable and enable Firewalls. A Cloud Firewall analyzes traffic against a set of predefined rules at the network layer and determine if the traffic is permitted to communicate with the Linode Service it secures. Cloud Firewalls are an integral component of your infrastructure''s security.'
og_description: 'This guide shows you how to add a Cloud Firewall and apply it to a Linode service using the Linode Cloud Manager. You also learn how to edit your Cloud Firewall rules, add new custom rules, and disable and enable Firewalls. A Cloud Firewall analyzes traffic against a set of predefined rules at the network layer and determine if the traffic is permitted to communicate with the Linode Service it secures. Cloud Firewalls are an integral component of your infrastructure''s security.'
keywords: ["firewall", "cloud firewall", "security", "securing"]
tags: ["cloud manager","linode platform","security","networking"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-11-09
modified_by:
  name: Linode
published: 2020-07-24
title: Adding and Configuring Linode Cloud Firewall - A Tutorial
h1_title: A Tutorial for Adding and Configuring Linode Cloud Firewall
image: feature.png
aliases: ['/platform/cloud-firewall/getting-started-with-cloud-firewall/']
---

## What is Linode Cloud Firewall?

{{< note >}}
Cloud Firewall is now in beta, sign up through the [Linode Green Light program](https://www.linode.com/green-light/#sign-up-form) to test this feature before it's generally available. For more information visit the [Cloud Firewall](https://www.linode.com/products/firewall/) product page.
{{</ note >}}

Linode Cloud Firewall is a free service used to create, configure, and add stateful network-based firewalls to Linode services using the Linode Cloud Manager and the [Linode APIv4](/docs/api/). A Cloud Firewall is independent of the service it is attached to, so you can apply a single Firewall to multiple Linode services.

### Features

A Cloud Firewall analyzes traffic against a set of predefined rules at the network layer and determines if the traffic is permitted to communicate with the Linode Service it secures. Cloud Firewalls work as an allowlist with an implicit deny rule-- it blocks all traffic by default and only pass through network traffic that meets the parameters of the configured rules. If there are no outbound rules set, all outbound traffic is permitted.

### Limitations

- Currently, a Cloud Firewall can only be applied to Linodes.
- You can apply up to three Cloud Firewalls per Linode service.

### Inbound and Outbound Rules

A Cloud Firewall can be configured with *Inbound* and *Outbound* rules. Inbound rules limit incoming network connections to a Linode service based on the port(s) and sources you configure. Outbound rules limit the outgoing network connections coming from a Linode service based on the port(s) and destinations you configure.

### Predefined Rules

The Linode Cloud Manager provides a list of *predefined rules* that you can add to your Cloud Firewall. The predefined rules support common networking use cases and provide an easy foundation to get started with Cloud Firewalls. Since you can edit any rule applied to a Cloud Firewall you can use the predefined rules as a foundation and further [edit their configurations](/docs/products/networking/cloud-firewall/guides/edit-rules/) and also [add new custom rules](/docs/products/networking/cloud-firewall/guides/add-rules/) to your Firewall.

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
