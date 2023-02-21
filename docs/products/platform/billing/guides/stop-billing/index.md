---
title: "Stop Further Billing"
description: "Instructions on removing services to stop charges from accruing on your Linode account."
published: 2022-11-17
---

To prevent additional charges from accruing and stop further billing, you can remove any paid services from your account or cancel your account entirely.

## Remove Services

Linode services are provided without a contract or commitment. This means that you can remove them from your account at any time. Here are instructions for removing a Compute Instance:

1. Log in to the [Cloud Manager](https://cloud.linode.com) and select **Linodes** from the sidebar menu.
1. Locate the Compute Instance you wish to delete.
1. Expand the corresponding **more options ellipsis** menu and click **Delete**.
1. Select **Delete Linode** in the confirmation box that appears.

If you wish to delete other services, follow the links below:

- [Backup Service](/docs/products/storage/backups/guides/cancel/)
- [Delete Block Storage Volume](/docs/products/storage/block-storage/guides/manage-volumes/#delete-volume)
- [Cancel Object Storage](/docs/products/storage/object-storage/guides/cancel/)
- [Delete a NodeBalancer](/docs/products/networking/nodebalancers/guides/manage/#delete-a-nodebalancer)

{{< note type="alert" >}}
Removing a service from your account makes its data irretrievable. In the case of a Compute Instance, any corresponding Backup service is also deleted and you will no longer be able to restore from those backup snapshots.

If you would like to preserve your data before removing a service from your account, you need to create an external backup. You may use the suggestions in our [Backing Up Your Data](/docs/guides/backing-up-your-data/) guide for some examples of how to do this.

When removing a Compute Instance from your account that has been active for at least 24 hours, a [Recovery Image](/docs/products/tools/images/get-started/) is automatically created. To learn how to deploy this image, see [Deploy an Image to a New Compute Instance](/docs/products/tools/images/guides/deploy-image-to-new-linode/).

There is a very small chance that Linode Support can restore your data outside of these circumstances. The sooner you reach out to Linode Support, the more likely this can occur. Please open [a Support ticket](https://cloud.linode.com/support/tickets) to explore this possibility.
{{< /note >}}

## Cancel Account

If you no longer wish to use any Linode services, you can also cancel your account. When an account is cancelled, you may receive one final bill. This bill includes all charges that have already accrued during the billing period. See [Cancel Your Account](/docs/products/platform/accounts/guides/cancel-account/) to learn more.