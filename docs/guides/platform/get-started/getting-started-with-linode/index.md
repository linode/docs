---
slug: getting-started
author:
  name: Linode
  email: docs@linode.com
keywords: ["getting started", "intro", "basics", "first steps", "linode platform"]
description: "Learn how to create an account and use the Linode Cloud Platform."
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/getting-started/','/getting-started-classic-manager/','/getting-started-new-manager/']
modified: 2022-01-21
modified_by:
  name: Linode
published: 2018-11-05
title: "Getting Started with Linode"
show_on_frontpage: true
title_short: "Getting Started"
weight: 10
icon: "book"
show_on_rss_feed: false
image: getting-started.jpg
---

Thank you for choosing Linode as your cloud hosting provider! This guide will help you sign up for an account and access Linode's [Cloud Manager](https://cloud.linode.com), a browser-based control panel which allows you to manage your Linode virtual servers and services.

1. [Sign Up for an Account](#sign-up-for-an-account)
1. [Navigate the Cloud Manager](#navigate-the-cloud-manager)
1. [Create Your First Compute Instance](#create-your-first-compute-instance)
1. [Create Additional Services](#create-additional-services)
1. [Understand Billing](#understand-billing)
1. [Explore Linode Guides](#explore-linode-guides)

## Sign Up for an Account

First, you need to create a Linode account to start using our services. If you already have a Linode account, you can skip to the next section.

1. Click the **Sign Up** button at the top of this page. {{< signup-link >}}

1. Enter your email address, a unique username, and a strong password. Alternatively, you can sign up using your existing Google or GitHub account.

1. A confirmation email will be send to your email address. Click the link to confirm your email and be taken to the next step.

1. Enter your billing and payment information. A valid credit or debit card must be used when creating an account, though additional payment methods (like Google Pay and PayPal) are available once the account is active.

Most accounts are activated instantly, but some require manual review prior to activation. If your account is not immediately activated, you will receive an email with additional instructions.

{{< note >}}
Newly created Linode accounts have restrictions on ports `25`, `465`, and `587` applied to Compute Instances, which prevents instances from sending email. If you'd like to send email, review the [Running a Mail Server](/docs/email/running-a-mail-server/#sending-email-on-linode) guide, then [open a ticket](https://cloud.linode.com/support/tickets?type=closed&drawerOpen=true) with our Support team.
{{</ note >}}

Once your account has been created, consider **enabling 2FA** to prevent unauthorized access. Anyone that has access to your account may be able to delete your services, add new ones, and reset the root password on your Compute Instances to gain access to them. See [Cloud Manager Security Controls](/docs/guides/linode-manager-security-controls/) for instructions on enabling 2FA. If you are logging in with a third party provider, consider adding 2FA through that provider.

## Navigate the Cloud Manager

Linode's [Cloud Manager](https://cloud.linode.com/) is the primary gateway to our platform. It enables you to manage your account, view your bills, add services, and much more. Here are some of the main sections you might want to look through:

- **Linodes:** View a list of your Compute Instances. Clicking on one takes you to its details page, where you can power it on or off, reboot it, resize it, access the console, change its configuration, attach Block Storage volumes, and lots more.

- **Account:** View your account, billing information, payment methods, and previous invoices. You can also add additional users to your account.

- **Help & Support:** Search through our guides, find answers on the Community Site, chat with our Support Bot, or open a ticket to reach our 24/7 award-winning [Support Team](https://www.linode.com/support-experience/).

For a full overview of the Cloud Manager and its core features, see the [Overview of the Cloud Manager](/docs/guides/an-overview-of-the-linode-cloud-manager/) guide.

## Create Your First Compute Instance

Compute Instances are virtual machines that can be used for nearly any purpose. Many of our customers use them to host websites and web applications, but they can also be used for development workloads, game servers, big data processing, machine learning, scientific processing, and much more. See the guides below to learn more about creating a Compute Instance, setting things up, and securing it.

- [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/)
- [Getting Started After Deploying a Compute Instance](/docs/guides/getting-started-after-deployment/)
- [Securing a Compute Instance](/docs/security/securing-your-server/)

## Create Additional Services

In addition to Compute Instances, Linode offers many other services that empower you to get the most out of cloud computing. Take a look through the list below to determine if any of them might be useful to you.

**Compute**

- [Compute Instances](https://www.linode.com/products/shared/): Virtual machines hosted within Linode's own cloud infrastructure.
- [LKE](https://www.linode.com/products/kubernetes/) (Linode Kubernetes Engine): Managed Kubernetes clusters that simplify container orchestration.
- [Bare Metal](https://www.linode.com/products/bare-metal/) *(Coming soon)*: Dedicated single-tenant hardware for advanced workloads.

**Storage**

- [Block Storage](https://www.linode.com/products/block-storage/): Scalable, high-speed, and fault tolerant storage volumes used to add additional storage to a Compute Instance.
- [Object Storage](https://www.linode.com/products/object-storage/): S3-compatible object storage service that can be used independently of a Compute Instance.
- [Backups](https://www.linode.com/products/backups/): Fully managed automatic daily, weekly, and biweekly backups of your Linode Compute Instances.
- [Images](https://www.linode.com/products/images/): Create preconfigured disk images that can be rapidly deployed to new or existing Compute Instances.

**Networking**

- [NodeBalancers](https://www.linode.com/products/nodebalancers/): Managed cloud-based load balancing service used with Compute Instances to enable high availability and horizontal scaling.
- [Cloud Firewalls](https://www.linode.com/products/cloud-firewall/): A free cloud-based firewall service that can be used to secure any Compute Instance.
- [DNS Manager](https://www.linode.com/products/dns-manager/): A free comprehensive domain and DNS management service for Linode customers.
- [VLANs](https://www.linode.com/products/vlan/): Private L2 networks to secure traffic between Compute Instances.

## Understand Billing

Linode services are billed to your primary payment method at the end of each month (or when your accrued changes reach your billing limit). This means you can continuously add, modify, and remove services throughout the month and, after the month is over, you receive an invoice for *the hourly usage of each service **up to the monthly cap***. See the below resources for more billing information and detailed hourly and monthly pricing.

- [Billing and Payments](/docs/guides/how-linode-billing-works/)
- [Managing Billing in the Cloud Manager](/docs/guides/manage-billing-in-cloud-manager/)
- [Linode Price List](https://www.linode.com/pricing/)

Keep in mind that charges will accrue for any active service, even if it is powered off or otherwise not in use. This includes Compute Instances that have been powered off as well as any service you might have added to the account but are not using.

## Explore Linode Guides

Have fun (and get work done)! Since Linode makes cloud computing simple, affordable, and accessible, it's easy to spin up a new Compute Instance (or add any of our services) and do nearly anything you want to do. Play around in the Linux command-line, deploy a WordPress One-Click App, run a VPN, install a file storage platform, or even host a website using Object Storage. Whatever cloud computing use cases you have in mind, you can likely do it on Linode and our guides are a great place to start.