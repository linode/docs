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

Linode allows the reselling of its services to third-party customers. This guide is meant to walk you through the process of becoming a reseller.

{{< note >}}
While Linode does allow the reselling of its services, Linode does not currently have a special reseller program. This means that Linode does not offer discounted pricing for resellers, and does not currently have any white-box software to aid in reselling, like WHMCS plugins.

However, Linode does have a referral program. For more information on Linode's referall program, read the [referall codes section](#referral-codes).
{{</ note >}}

## What is a Reseller

A reseller is any person or entity that charges a third-party for Linode services, acting as a kind of middleman. This means that you are free to charge clients for full or partial access to Linode services, either through the use of the Linode API or by giving a client access to Linode services you have provisioned on their behalf.

There are a variety of reasons one might want to resell Linode services. One of the most common reasons developers and engineers become resellers is that they use Linode to test, develop, and/or host their client's websites and apps, and in doing so need to bill those clients for charges accrued by this process. Maybe the company in question creates custom WordPress installations for their customers on Linode. Or maybe an app development company needs a backend database for a customer's app and they choose to use Linode for that service. In both cases it makes sense that those companies would become Linode resellers.

Of course, there is nothing stopping an individual from creating a fully-fledged hosting company based on Linode services, and in fact some entities have done just that. Linode offers a robust API that is capable for doing everything that the Cloud Manager is capable of doing. For more information, visit the [API section of this guide](#linode-api).

## Referral Codes

As mentioned above, Linode does not offer a discount on re-sold Linode services. However, Linode does offer a referral program. If you feel like Linode is a good choice for an acquaintance or customer, you can send them your referral code and/or link to recieve $20 in credit when they sign up. That credit will be applied to your account so long as the referral stays active as a customer for 90 days. To retrieve your referral code and link, navigate to your [My Profile page in the Cloud Manager and click on "Referrals"](https://cloud.linode.com/profile/referrals).

## Limitations of Reselling Linode Services

Becoming a reseller comes with some limitations:

- All resellers, and the customers of resellers, are bound to [Linode's Terms of Services](https://www.linode.com/tos) (ToS). If for any reason a customer of a Linode reseller breaks Linode's ToS, it is the reseller who will be held accountable. If you are planning on becoming a reseller it is a good idea to carefully craft a ToS of your own that is in accordance to Linode's ToS.

- All resellers, and the customers of resellers, are bound to [Linode's Acceptable Use Policy](https://www.linode.com/aup) (AUP). If for any reason a customer of a Linode reseller breaks Linode's AUP, it is the reseller who will be held accountable.

- Payments are to be made directly to Linode by the reseller. If a customer of a reseller fails to make a payment, the reseller is still responsible for their monthly payment to Linode.

- Customer Support does not extend to the customers of resellers. Only resellers have access to Linode Customer Support, and only for those areas outlined by Linode's ToS. For a more detailed explanation on the scope of Support, [consult our Support guide](/docs/platform/billing-and-support/support/#scope-of-support).

## How to Resell Linode Service

### Linode API

The best way to resell Linode services is through the use of the Linode API. The Linode API provides programmatic access to the full suite of Linode services. As a reseller, you could set up a custom user interface to only allow the select features you want available to your customers. For instance, it's entirely possible to create a UI that enables only 4GB Linodes to be deployed, and to have those Linodes automatically added to a NodeBalancer. For a tutorial on how to use the Linode API, check out our [Getting Started with the Linode API](/docs/platform/api/getting-started-with-the-linode-api/) guide. For a comprehensive view of the Linode API, see Linode's [API documentation](https://developers.linode.com/api/v4). For a list of Linode API libraries and tools, head over to our [developer portal](https://developers.linode.com/libraries-tools/).

### Limited Cloud Manager Account

If you'd like to be able to give reseller customers access to parts of the Cloud Manager without developing a new user interface, you can create a limited user account in the Cloud Manager. To create a limited user account, navigate to the **Accounts** page in the sidebar, then select the **Users** tab. Click **Add a User**. You will be able to provide granular account access for the customer. For more information, see the [Linode Account Access section of our Create an Account for a Developer to Work on Your Linode](https://linode.com/docs/platform/create-limited-developer-account/#linode-account-access)

{{< note >}}
The Cloud Manager does not tie Cloud Manager accounts to accounts that users create on Linodes. If you need to revoke a customer's account in the Cloud Manager you might also have to purge their accounts on any Linodes they might have access to.
{{</ note >}}

### Limited Linux User Account

A reseller might provide a customer with limited access to a Linode by creating an account for them with Linux. This provides the customer with access to their server, without access to the features of the Linode API or the Cloud Manager. For a hosting provider reseller looking to grant access to the Linux environment this is often the best solution. For more information on setting up a Linux account for your clients, visit the [SSH section of our Create an Account for a Developer to Work on Your Linode](https://linode.com/docs/platform/create-limited-developer-account/#ssh-logins) guide.