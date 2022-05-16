---
title: Get Started
description: "Get started with Linode Cloud Firewall. Learn to add a Cloud Firewall, assign a Cloud Firewall to a Linode, add and edit rules, update your Cloud Firewall status, and delete a Cloud Firewall."
tab_group_main:
    weight: 20
aliases: ['/platform/cloud-firewall/getting-started-with-cloud-firewall/','/guides/getting-started-with-cloud-firewall/']
keywords: ["firewall", "cloud firewall", "security", "securing"]
tags: ["cloud manager","linode platform","security","networking"]
---

Linode's free Cloud Firewall service can be used to create, configure, and add stateful network-based firewalls to Linode services. A Cloud Firewall is independent of the service it is attached to and, therefore, you can apply a single Cloud Firewall to multiple Linode services.

A Cloud Firewall analyzes traffic against a set of predefined rules at the network layer and determines if the traffic is permitted to communicate to or from the Linode Service it secures. Cloud Firewalls can be configured with an implicit deny or allow rule-- they can block or allow all traffic by default and only pass through or deny network traffic that meets the parameters of the configured rules.

{{< note >}}
Users that do not have [Network Helper](/docs/guides/network-helper/) enabled and are instead relying on a configuration that uses DHCP will need to manually allow DHCP traffic through port 67 and 68 of their Cloud Firewall. A full list of IP addresses for our DHCP servers can be found in our [DHCP IP Address Reference Guide](/docs/guides/dhcp-ip-address-reference/).
{{< /note >}}

## Add a Cloud Firewall

1. Log into your [Linode Cloud Manager](https://cloud.linode.com/) and select **Firewalls** from the navigation menu.

1. From the **Firewalls** listing page, click on the **Create a Firewall** button.

1. The **Add a Firewall** drawer appears with the Firewall configurations needed to add a Firewall. Configure your Firewall with at minimum the required fields:

    | **Configuration** | **Description** |
    | -- | -- |
    | **Label** | The label is used an identifier for this Cloud Firewall. *Required*|
    | **Linodes**| The Linode(s) on which to apply this Firewall. A list of all eligible Linodes on your account is visible. You can skip this configuration if you do not yet wish to apply the Firewall to a Linode. |

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

1. Click on the **Create** button to assign the Firewall to your Linode(s).

## Limiting User Access to Cloud Firewalls with the Linode API

Currently, Cloud firewall user access controls for API tokens cannot be set directly using the [Cloud Manager](https://www.linode.com/docs/guides/an-overview-of-the-linode-cloud-manager/#api-keys--api-tokens) and are instead set using [Personal Access Tokens with the Linode API](/docs/api/profile/#personal-access-tokens-list) itself. Below is an example API request that will create an API token with Cloud Firewall permissions that can be adjusted and edited as needed:


{{< file >}}
curl -H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-X POST -d '{
  "scopes": "firewall:read_write",
  "expiry": "2022-8-01T00:00:01",
  "label": "cloud-firewall-access"
}' \
https://api.linode.com/v4/profile/tokens
{{< /file >}}

In this example, the `scope` field defines an OAUTH scope of `read_write` for all Cloud Firewalls on the account, while `expiry` defines the expiration date of the Personal Access Token, and `label` is an identifier used for display purposes to identify the token.

When completing this request an API token will be returned in the `Token` field to be used and distributed as needed. This token should be saved in a secure manner immediately as it will not be retrievable again. For more information on creating Personal Access Tokens to use with Cloud Firewall, see our API documentation for creating [Personal Access Tokens with the Linode API](/docs/api/profile/#personal-access-tokens-list).