---
title: Get Started
title_meta: "Getting Started with Cloud Firewalls"
description: "Get started with Linode Cloud Firewall. Learn to add a Cloud Firewall, assign a Cloud Firewall to a Linode, add and edit rules, update your Cloud Firewall status, and delete a Cloud Firewall."
modified: 2023-11-01
tab_group_main:
    weight: 20
aliases: ['/platform/cloud-firewall/getting-started-with-cloud-firewall/','/guides/getting-started-with-cloud-firewall/']
keywords: ["firewall", "cloud firewall", "security", "securing"]
tags: ["cloud manager","linode platform","security","networking"]
---

Linode’s free Cloud Firewall service can be used to create, configure, and add stateful network-based firewalls to Linode services. A Cloud Firewall is independent of the service it is attached to and can be applied to multiple services. Cloud Firewalls are compatible with Linode Compute Instances and NodeBalancers.

## Create a Cloud Firewall

There are two main options to consider when deciding how to protect your Linode Compute Instances: installing firewall software on your system or using Linode's Cloud Firewall service. While both are robust solutions, a major benefit to using Cloud Firewalls is the ease of configuration. Cloud Firewalls can be created and managed through Cloud Manager, Linode CLI, or Linode API.

- [Create a Cloud Firewall](/docs/products/networking/cloud-firewall/guides/create-a-cloud-firewall/)

- [Comparing Cloud Firewalls to Linux Firewall Software](/docs/products/networking/cloud-firewall/guides/comparing-firewalls/)

{{< note >}}
NodeBalancers do not support the installation of firewall software. If you wish to configure inbound firewall rules for your NodeBalancer, we recommend using the Cloud Firewall service.
{{< /note >}}

## Manage Firewall Rules

A Cloud Firewall analyzes traffic against a set of user-defined rules. The firewall can be configured to implicitly *accept* or *drop* all *inbound* or *outbound* traffic. Individual rules can be added to further accept or drop specific traffic, such as over certain ports or to/from a certain IP address.

- [Manage Cloud Firewall Rules](/docs/products/networking/cloud-firewall/guides/manage-firewall-rules/)

{{< note >}}
Outbound firewall rules are not applied to NodeBalancers.
{{< /note >}}

## Apply to Compute Instances

To start using a Cloud Firewall to protect your services, you can apply it to Compute Instances or NodeBalancers. Each Cloud Firewall can be applied to multiple services, but a service can only belong to a single Cloud Firewall.

- [Apply a Cloud Firewall to a Service](/docs/products/networking/cloud-firewall/guides/apply-to-service/)