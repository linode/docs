---
author:
  name: Linode
  email: docs@linode.com
description: 'This guide helps you understand common Cloud Manager errors and sets you on the path forward to resolution.'
og_description: 'This guide helps you understand common Cloud Manager errors and sets you on the path forward to resolution.'
keywords: ['error','account limit','limit','activated', 'before you can', 'please try again', 'open a support ticket']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-02-22
modified_by:
  name: Linode
title: "An Overview of Common Cloud Manager Errors"
h1_title: "Understanding Common Cloud Manager Errors"
contributor:
  name: Linode
---

Have you ever encountered an error message while navigating the [Cloud Manager](https://cloud.linode.com) and wanted to know what caused the error and what to do next? This guide will cover some common error messages, their common causes, suggestions on your best paths forward.

{{< note >}}
For more information on troubleshooting, see our [Troubleshooting Guides](https://www.linode.com/docs/troubleshooting/).
{{< /note >}}

## Error Retrieving Linodes

**Message:** *"There was an error retrieving your Linodes. Please try again later."*

**Cause:** The above error means that there is an issue retrieving your Linodes from our backend servers.

**Next Steps:**

- As a first step, you should check our status page at [status.linode.com](https://status.linode.com) to ensure that there are no current issues that may be effecting your Linodes or Linode service.

  - If you see an issue listed, you can rest assured that Linode is investigating it and will work to bring your services back online as quickly as possible.

  - If the status page shows that everything is all clear, then the next step is to attempt to clear your web browser cache, as this can sometimes cause an issue in loading resources. The method for completing this process varies between browsers. However, it usually involves opening your browser's full history and finding an option to clear it.

- Additionally, you can attempt to access your resources through alternative means such as the Linode [API](https://developers.linode.com/api/v4/) or the Linode [CLI](https://www.linode.com/docs/platform/api/linode-cli/) if the Cloud Manager is inaccessible for any reason.

- If all else fails, you can always reach out to Linode's 24/7 [Support Team](https://www.linode.com/docs/platform/billing-and-support/support/) for more direct assistance.

## Your Account Must Be Activated

**Message:** *"Your account must be activated before you can use this endpoint."*

**Cause:** Generally, the above message will occur when you've recently signed up for new services and your account has not yet been fully activated.

**Next Step:** Check e-mail address associated with your account for further instructions.

## Account Limit Reached

**Message:** *"Account Limit Reached. Please open a support ticket."*

**Cause:** If you see the message above, then you'll be unable to create a resource due to a limit currently set on your account.

**Next Steps:**

- Linode's [Support Team](https://www.linode.com/docs/platform/billing-and-support/support/) will be able to help to either increase this limit, or to provide insight into why the limit may be in place.

- The reasons behind these limits can vary, though, in most cases are related to default resource limits set on your account.

## Your DNS Zones are Not Being Served

**Message:** *"Your DNS zones are not being served. Your domains will not be served by Linode's nameservers unless you have at least one active Linode on your account. You can create one here."*

**Cause:** This message is seen when using Linode's [DNS Manager](/docs/platform/manager/dns-manager/) without any billable resources currently active on your account.

**Next Steps:**

- While the DNS Manager is a free service, it does require that at least one billable resource is available on your account.

- See the [pricing page](https://www.linode.com/pricing/) for more information on resources you can add to access the DNS Manager.
