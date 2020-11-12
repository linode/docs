---
title: Get Started
description: "Get started with Linode Cloud Firewall. Learn to add a Cloud Firewall, assign a Cloud Firewall to a Linode, add and edit rules, update your Cloud Firewall status, and delete a Cloud Firewall."
tab_group_main:
    weight: 20
---

{{< note >}}
Cloud Firewall is now in beta, sign up through the [Linode Green Light program](https://www.linode.com/green-light/#sign-up-form) to test this feature before it's generally available. For more information visit the [Cloud Firewall](https://www.linode.com/products/firewall/) product page.
{{</ note >}}

## Add a Cloud Firewall

1. Log into your [Linode Cloud Manager](https://cloud.linode.com/) and select **Firewalls** from the navigation menu.

1. From the **Firewalls** listing page, click on the **Add a Firewall** link.

1. The **Add a Firewall** drawer appears with the Firewall configurations needed to add a Firewall. Configure your Firewall with at minimum the required fields:

    | **Configuration** | **Description** |
    | :---------------: | :---------------: |
    | **Label** | The label is used an identifier for this Cloud Firewall. *Required*|
    | **Rules** | The Firewall rule(s) to add to this Firewall. Choose from a list of predefined Inbound and Outbound Firewall rules that support common networking use cases. You can select more than one Firewall rule. You can [edit your selected rules](/docs/products/networking/cloud-firewall/guides/edit-rules/) after adding the Firewall, if needed. *Required*|
    | **Linodes**| The Linode(s) on which to apply this Firewall. A list of all Linodes on your account is visible. You can skip this configuration if you do not yet wish to apply the Firewall to a Linode. |

1. Click on the **Create** button. This creates the Cloud Firewall and it appears on the **Firewalls** listing page.

## Assign a Cloud Firewall to a Linode Service

1. Log into your [Linode Cloud Manager](https://cloud.linode.com/) and select **Firewalls** from the navigation menu.

1. From the **Firewalls** listing page, click on the Firewall that you would like to attach to a Linode. This takes you to the Firewall's **Rules** page.

1. Click on the **Linodes** tab. This takes you to the **Firewalls Linodes** page. If the Firewall is assigned to any Linode services they are displayed on the page.

1. Click on the **Add Linodes to Firewall** link.

1. From the **Add Linode to Firewall** drawer, click on the dropdown menu and select the Linode service to which you'd like to apply this Firewall. You can also start typing the Linode service's label to narrow down your search.

    {{< note >}}
You can assign the Firewall to more than one Linode service at a time. Continue the previous step to assign the Firewall to another Linode service.
    {{</ note >}}

1. Click on the **Add** button to assign the Firewall to your Linode(s).

{{< note >}}
If you have a Cloud Firewall attached to a Linode and you attempt to [migrate the Linode to a data center](/docs/guides/how-to-initiate-a-cross-data-center-migration-for-your-linode/) that does not support Cloud Firewalls, the migration fails.
{{</ note >}}