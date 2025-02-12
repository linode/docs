---
title: "Deploy Pritunl through the Linode Marketplace"
description: "Deploy Pritunl on a Linode Compute Instance. This provides you with an open source VPN server and management panel."
published: 2021-11-12
modified: 2025-02-12
keywords: ['pritunl','vpn','security','openvpn']
tags: ["marketplace", "linode platform", "cloud manager"]
bundles: ['network-security']
external_resources:
- '[Pritunl](https://pritunl.com/)'
aliases: ['/products/tools/marketplace/guides/pritunl/','/guides/deploying-pritunl-marketplace-app/','/guides/pritunl-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

Pritunl is an open source VPN server and management panel. It gives the user the power of the OpenVPN protocol while using an intuitive web interface.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Pritunl should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

### Pritunl Options

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}
- **Email address for the SOA record:** The start of authority (SOA) email address for this server. This is a required field if you want the installer to create DNS records.
{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started after Deployment

### Obtain the Credentials

Once the app is deployed, you need to obtain the credentials from the server.

To obtain credentials:

1.  Log in to your new Compute Instance using one of the methods below:

    - **Lish Console**: Log in to Cloud Manager, click the **Linodes** link in the left menu, and select the Compute Instance you just deployed. Click **Launch LISH Console**. Log in as the `root` user. To learn more, see [Using the Lish Console](/docs/products/compute/compute-instances/guides/lish/).
    - **SSH**: Log in to your Compute Instance over SSH using the `root` user. To learn how, see [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/).

1.  Run the following command to access the credentials file:

    ```command
    cat /home/$USERNAME/.credentials
    ```

This returns passwords that were automatically generated when the instance was deployed. Save them. Once saved, you can safely delete the file.

### Accessing the Pritunl App

1.  Open a web browser and navigate to the domain you entered when creating the instance: `https://domain.tld`. If you didn't enter a domain, use your Compute Instance's default rDNS domain (`192-0-2-1.ip.linodeusercontent.com`). To learn more on viewing the rDNS value, see [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/). Make sure to use the `https` prefix in the URL to access the website securely.

    {{< note >}}
    In Chrome, you can accept the self-signed certificate by clicking on Advanced and then click Proceed to <ip> (unsafe). In Firefox, click on Advanced, then Add Exception, and then Confirm Security Exception.
    {{< /note >}}

1.  The login prompt appears. Enter `pritunl` as the username and then use the password generated in the credentials file.

    ![Pritunl Username Setup](pritunl-config2.png)

1.  Once you're logged in, you can change the default password and enter the domain information so Pritunl can setup the SSL certificates automatically:

    ![Pritunl Domain Setup](pritunl-config3.png)

Now that you’ve accessed your dashboard, check out [the official Pritunl documentation](https://docs.pritunl.com/docs/connecting) to learn how to add users and further use your Pritunl instance.

{{% content "marketplace-update-note-shortguide" %}}