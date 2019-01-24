---
author:
  name: Linode Community
  email: docs@linode.com
description: 'How to resell Linode services using the Linode API, and how to get started with the Linode referral program.'
keywords: ['resell','linode','services','reseller','referall','code']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-01-22
modified: 2019-01-22
modified_by:
  name: Linode
title: "How to Resell Linode Services"
contributor:
  name: Linode
---

Linode is proud to provide services that businesses and agencies can take advantage of and benefit from, and as a result Linode warmly welcomes and actively encourages the reselling of its services to third-party customers. This guide will walk you through the process of becoming a reseller.

{{< note >}}
While Linode welcomes the reselling of its services, Linode does not currently have a special reseller program. This means that at this time Linode does not offer discounted pricing for resellers, nor does it currently have any white-box software, like WHMCS plugins, to aid in reselling.

However, Linode does have a referral program. For more information on Linode's referral program, read the [referral codes section](#referral-codes).
{{</ note >}}

## What is a Reseller

A reseller is any person or entity that charges a third-party for Linode services, acting as a kind of middleman. This means that anyone is free to charge clients for full or partial access to Linode services, either through the use of the [Linode API](#linode-api) or by giving a client access to Linode services provisioned on their behalf.

There are a variety of reasons one might want to resell Linode services. One of the most common reasons developers and engineers become resellers is that they use Linode to test, develop, and/or host their client's websites and apps, and in doing so need to bill those clients for charges accrued by this process. An agency might create custom WordPress installations for their customers on Linode. Or, an app developer might use Linode to host a customer's database. In both cases it makes sense that those entities would become Linode resellers.

Of course, there is nothing stopping an entity from creating a fully-fledged hosting platform based on Linode services, using tools like the [Linode API](#linode-api). One such example is Cloudnet Sweden, a platform-as-a-service (PaaS) that uses Linode as a cloud host for their managed platform. Read our [case study on Cloudnet Sweden](https://www.linode.com/case-studies/cloudnet) for an in depth look at why they chose to partner with Linode.

## Referral Codes

As mentioned above, Linode does not offer a discount on re-sold Linode services. However, Linode does offer a referral program. If you feel like Linode is a good choice for an acquaintance or customer, you can send them your referral code and/or link to receive $20 per sign up. That credit will be applied to your account if the referral stays active as a Linode customer for 90 days. To retrieve your referral code and link, navigate to your [My Profile page in the Cloud Manager and click on "Referrals"](https://cloud.linode.com/profile/referrals).

## Things Resellers Should Keep in Mind

There are a few stipulations that resellers should keep in mind before they begin the process of becoming a reseller:

- All resellers, and the customers of resellers, are bound to [Linode's Terms of Services](https://www.linode.com/tos) (ToS). If for any reason a customer of a Linode reseller breaks Linode's ToS, it is the reseller who will be held accountable. If you are planning on becoming a reseller it is a good idea to carefully craft a ToS of your own that is in accordance with Linode's ToS.

- All resellers, and the customers of resellers, are bound to [Linode's Acceptable Use Policy](https://www.linode.com/aup) (AUP). If for any reason a customer of a Linode reseller breaks Linode's AUP, it is the reseller who will be held accountable.

- Payments are to be made directly to Linode by the reseller. If a customer of a reseller fails to make a payment, the reseller is still responsible for their monthly payment to Linode.

- Customer Support does not extend to the customers of resellers. Only resellers have access to Linode Customer Support, and only for those areas outlined by Linode's ToS. For a more detailed explanation on the scope of Support, [consult our Support guide](/docs/platform/billing-and-support/support/#scope-of-support).

## How to Resell Linode Service

### Linode API

The best way to resell Linode services is through the use of the Linode API. The Linode API provides robust, programmatic access to the full suite of Linode services. Using the API, a reseller could set up a custom user interface to only allow the select features they want available for their customers. For example, it's possible to create a UI that only enables 4GB Linode deployments and that automatically provisions those Linodes with a StackScript. For a tutorial on how to use the Linode API, check out our [Getting Started with the Linode API](/docs/platform/api/getting-started-with-the-linode-api/) guide. For a comprehensive view of the Linode API, see Linode's [API documentation](https://developers.linode.com/api/v4). For a list of Linode API libraries and tools, head over to our [developer portal](https://developers.linode.com/libraries-tools/).

### Limited Cloud Manager Account

If a reseller wants to be able to give reseller customers access to parts of the Cloud Manager without developing a new user interface, resellers can create a limited user account in the Cloud Manager. To create a limited user account in the Cloud Manager, navigate to the **Accounts** page in the sidebar, then select the **Users** tab. Click **Add a User**. From there it's easy to provide granular account access for the customer. For more information, see the [Linode Account Access section of our Create an Account for a Developer to Work on Your Linode](https://linode.com/docs/platform/create-limited-developer-account/#linode-account-access) guide.

{{< note >}}
The Cloud Manager does not tie Cloud Manager accounts to accounts that users create on Linodes. If you need to revoke a customer's account in the Cloud Manager you might also have to purge their accounts on any Linodes they might have access to.
{{</ note >}}

### Limited Linux User Account

A reseller might provide a customer with limited access to a Linode by creating an account for them at the operating system level. This provides the customer with access to their server, without access to the features of the Linode API or the Cloud Manager. For a hosting provider reseller looking to grant access to a pre-defined Linux environment this is often a good solution. For more information on setting up a Linux account for your clients, visit the [SSH section of our Create an Account for a Developer to Work on Your Linode](https://linode.com/docs/platform/create-limited-developer-account/#ssh-logins) guide.