---
slug: how-to-resell-linode-services
author:
  name: Linode Community
  email: docs@linode.com
description: 'How to resell Linode services using the Linode API, and how to get started with the Linode referral program.'
keywords: ['resell','linode','services','reseller','referral','code']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-01-31
modified: 2021-07-02
modified_by:
  name: Linode
title: "How to Resell Linode Services"
contributor:
  name: Linode
tags: ["linode platform"]
aliases: ['/platform/how-to-resell-linode-services/']
---

![How to Resell Linode Services](how-to-resell-linode-services.png "How to Resell Linode Services")

Linode warmly welcomes and encourages the reselling of our services to third-party customers. Anyone can resell Linode services. We offer discounted pricing for resellers. If you are interested in discounted pricing, please contact `partnerships@linode.com`. This guide will walk you through the process of becoming a reseller.

## What is a Reseller

A reseller is any person or entity that charges a third party for Linode services, acting as a kind of middleman. Resellers are free to charge clients for full or partial access to Linode services, either through the use of the [Linode API](#linode-api), or by giving a client access to Linode services provisioned on their behalf.

There are a variety of reasons one might want to resell Linode services. One of the most common reasons developers and engineers become resellers is that they use Linode to test, develop, and/or host their client's websites and apps, and in doing so need to bill those clients for charges accrued by the Linode services that power this business. Specific examples of this pattern include:

-   An agency that creates custom WordPress installations for their customers on Linode.

-   An app developer that uses Linode to host their customer's database.

-   A business which operates a fully-fledged hosting platform based on Linode services, using tools like the [Linode API](#linode-api). One such example is Cloudnet Sweden, a platform-as-a-service (PaaS) that uses Linode as a cloud host for their managed platform. Read our [case study on Cloudnet Sweden](https://www.linode.com/case-studies/cloudnet) for an in-depth look at why they chose to partner with Linode.

## Referral Program

As an alternative to reselling our services, you can participate in our referral program. See the [Referral Program](https://www.linode.com/referral-program/) page on our website or the [Referral Program](/docs/guides/understanding-billing-and-payments/#referral-program) section within our billing guide for more details.

Advertising your referral code to others is not the same as reselling Linode services. When someone else uses your referral code, they create an entirely separate Linode account with their own billing.

## Things Resellers Should Keep in Mind

There are a few stipulations that resellers should keep in mind:

- All resellers, and the customers of resellers, are bound to [Linode's Terms of Service](https://www.linode.com/tos) (ToS). If for any reason a customer of a Linode reseller breaks Linode's ToS, it is the reseller who will be held accountable. If you are planning on becoming a reseller it is a good idea to carefully craft a ToS of your own that is in accordance with Linode's ToS.

- All resellers, and the customers of resellers, are bound to [Linode's Acceptable Use Policy](https://www.linode.com/aup) (AUP). If for any reason a customer of a Linode reseller breaks Linode's AUP, it is the reseller who will be held accountable.

- Payments are to be made directly to Linode by the reseller. If a customer of a reseller fails to pay the reseller for their services, the reseller is still responsible for their monthly payment to Linode.

- Linode Support can help with issues related to the physical operation of your Linode services, but issues related to your software configuration are outside of the [scope of Linode Support](/docs/platform/billing-and-support/support/#scope-of-support). Linode offers a number of [resources](/docs/platform/billing-and-support/support/#resources) to help with configuration questions. Linode Support is only available to people with access to a [Linode Cloud Manager user](#limited-cloud-manager-user). If your customers do not have their own Linode users, they will not be able to contact Linode Support.

## How to Resell Linode Service

### Linode API

The best way to resell Linode services is through the use of the Linode API. The Linode API provides robust, programmatic access to the full suite of Linode services. Using the API, a reseller could set up a custom user interface to only allow the select features they want available for their customers. For example, it's possible to create a UI that only enables 4GB Linode deployments and that automatically provisions those Linodes with a StackScript. For a tutorial on how to use the Linode API, check out our [Getting Started with the Linode API](/docs/guides/getting-started-with-the-linode-api/) guide. For a comprehensive view of the Linode API, see Linode's [API documentation](https://developers.linode.com/api/v4). For a list of Linode API libraries and tools, head over to our [developer portal](https://developers.linode.com/libraries-tools/).

### Limited Cloud Manager Users

If a reseller wants to be able to give reseller customers access to parts of the Linode Cloud Manager without developing a new user interface, they can create a limited Manager *user* in the Cloud Manager. A user is a set of credentials that can access your Linode account, and your Linode account can have multiple users. A user can be restricted to have a limited set of permissions, such as only being able to access certain Linodes and not having access to your billing information. To create a limited user in the Cloud Manager, review the [Users and Permissions](/docs/platform/manager/accounts-and-passwords-new-manager/#users-and-permissions) section of the Accounts and Passwords guide.

{{< note >}}
Cloud Manager users are not related to the Linux users on your Linodes. If you need to revoke a customer's account access, you should remove access to both their Cloud Manager users and their Linux users. Read the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide for more information on this subject.
{{</ note >}}

### Limited Linux User Accounts

A reseller might provide a customer with limited access to a Linode by creating an account for them at the operating system level. This provides the customer with access to their server, without access to the features of the Linode API or the Cloud Manager. For a hosting reseller that offers access to a pre-defined Linux environment, this is often a good solution. Read the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide for more information on this subject. You may also want to limit users' access to the filesystem with [SFTP jails](/docs/guides/limiting-access-with-sftp-jails-on-debian-and-ubuntu/).

## Frequently Asked Questions

### Can I Show Linode's Logos on My Site?

Yes. Please use the official [Linode logo assets](https://www.linode.com/logos).

### What Payment Methods are Available?

Automatic payments can be made with a credit card. All Linode accounts are required to have a credit card on file. Manual PayPal payments can also be made, so you can add credit to your Linode account with PayPal. For more information on Linode's billing, review the [Billing and Payments](/docs/platform/billing-and-support/billing-and-payments-new-manager/#payment-methods) guide.

### Does Linode Have a White-Label Interface?

Linode does not offer a white-label interface, but you could create one via the [Linode API](https://developers.linode.com).

### Can I Model my Terms of Service on Linode's ToS?

Yes, you can refer to Linode's [ToS](https://www.linode.com/tos) and [AUP](https://www.linode.com/aup) when authoring your own, and your business and your customers need to comply with Linode's ToS and AUP.
