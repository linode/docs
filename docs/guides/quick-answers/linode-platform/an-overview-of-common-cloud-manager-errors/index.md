---
slug: an-overview-of-common-cloud-manager-errors
author:
  name: Linode
  email: docs@linode.com
description: 'This guide will provide quick answers to common Cloud Manager errors. It includes links to helpful documentation and suggestions on next steps.'
keywords: ['error','account limit','limit','activated', 'before you can', 'please try again', 'open a support ticket']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-02-22
modified_by:
  name: Linode
aliases: ['/quick-answers/linode-platform/an-overview-of-common-cloud-manager-errors/','/quick-answers/linode-platform/understanding-cloud-manager-errors/']
image: L_UnderstandCommonClManErrors.png
title: "An Overview of Common Cloud Manager Errors"
h1_title: "Understanding Common Cloud Manager Errors"
contributor:
  name: Linode
tags: ["linode platform","cloud manager"]
---

Have you ever encountered an error message while navigating the cloud Manager and wanted more information as to what may have triggered the error and what your best next steps may be? In this guide we'll go over some common error messages in a higher level of detail than are traditionally provided, and discuss your best path forward.

{{< note >}}
For more information on troubleshooting, see the [Troubleshooting Section](/docs/guides/troubleshooting/) of our documentation.
{{< /note >}}

## Error Retrieving Linodes

**There was an error retrieving your Linodes. Please try again later.**

The above error means that there is an issue retrieving your Linodes from our backend servers. As a first step, you should check our status page at [status.linode.com](https://status.linode.com) to ensure that there are no current issues that may be effecting your Linodes or our service. If you see a current issue, you can rest assured that we're investigating and will work to bring your services back online as quickly as possible.

If the status page shows that everything is all clear, then the next step is to attempt to clear your web browser cache, as this can sometimes cause an issue in loading resources. The method for completing this process varies between browsers, however it usually involves opening your browsers full history and finding an option to clear it.

If all else fails, you should reach out to our 24/7 [Support Team](https://www.linode.com/support/) for more direct assistance. Additionally, we can also recommend attempting to access your resources through alternative means such as our [API](https://developers.linode.com/api/v4/) or [CLI](/docs/products/tools/cli/get-started/) if our Manager is inaccessible for any reason.

## Error Retrieving Network Information

**There was an error retrieving network information for this Linode.**

When you create a new Linode, it can take some time to gather enough data about your Linode's networking traffic to create an output for the Cloud Manager. During the time that information is being gathered, the Network Tab will output the message **There was an error retrieving network information for this Linode** in place of the Network Transfer History graph. To confirm that there hasn't been enough analytical data gathered from the Linode, check the Analytics tab, which should state Graphs for this Linode are not yet available - check back later in place of its usual graphs.

The amount of time it takes the Network Transfer History graph to populate can vary depending on multiple factors including which distribution you've chosen for your Linode, which data center the Linode is in, and any scripts which were used to deploy the Linode.

If you are still seeing this message after a considerable amount of time, it is recommended that you attempt to clear your web browser cache, as this can sometimes cause an issue in loading resources. The method for completing this process varies between browsers, however it usually involves opening your browser's full history and finding an option to clear it.

If clearing the browser cache doesn't clear the message or you are noticing networking issues on your Linode beyond this message please see the [Troubleshooting Basic Connection Issues guide](/docs/guides/troubleshooting-basic-connection-issues/).

## Your Account Must Be Activated

**Your account must be activated before you can use this endpoint**

Generally the above message will occur when you've recently signed up for new services and your account has not yet fully activated. The best next step is to check your e-mail address for further instructions.

## Account Limit Reached

**Account Limit Reached. Please open a support ticket.**

If you see the following message, then you'll be unable to create a resource due to a limit currently set on your account. Our [Support Team](https://www.linode.com/support/) will be able to help to either increase this limit, or provide insight into why the limit may be in place.

The reasons behind these limits can vary, though in most cases are related to default resource limits set on your account.


## Your DNS Zones are Not Being Served

**Your DNS zones are not being served. Your domains will not be served by Linode's nameservers unless you have at least one Linode present on your account. You can create one here.**

This message is seen when using Linode's DNS Manager without any billable resources currently present on your account. While the DNS Manager is a free service, it does require that at least one billable resource is available on your account. See our [pricing page](https://www.linode.com/pricing/) for more information on resources you can add to freely access the DNS Manager.
