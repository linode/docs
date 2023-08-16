---
description: "Deploy Pritunl on a Linode Compute Instance. This provides you with an open source VPN server and management panel."
keywords: ['pritunl','vpn','security','openvpn']
tags: ["marketplace", "linode platform", "cloud manager"]
bundles: ['network-security']
published: 2021-11-12
modified: 2022-03-08
modified_by:
  name: Linode
title: "Deploy Pritunl through the Linode Marketplace"
external_resources:
- '[Pritunl](https://pritunl.com/)'
aliases: ['/guides/deploying-pritunl-marketplace-app/','/guides/pritunl-marketplace-app/']
authors: ["Linode"]
---

Pritunl is an open source VPN server and management panel. It gives the user the power of the OpenVPN protocol while using an intuitive web interface.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** Pritunl should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 20.04 LTS, Debian 10
- **Recommended plan:** All plan types and sizes can be used.

### Pritunl Options

{{< content "marketplace-limited-user-fields-shortguide">}}

{{< content "marketplace-custom-domain-fields-shortguide">}}
- **Email address for the SOA record:** The start of authority (SOA) email address for this server. This is a required field if you want the installer to create DNS records.

{{< content "marketplace-special-character-limitations-shortguide">}}

## Getting Started after Deployment

### Accessing the Pritunl App

1.  Log in to your Compute Instance over SSH. See [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/) for assistance.

1.  Run the command below to obtain your setup key. This key is used in a later step.

        sudo pritunl setup-key

1.  Run the command below to generate the password:

        sudo pritunl default-password

1.  Open a web browser and navigate to the domain you created in the beginning of your deployment. If you did not enter a custom domain, use the IP address of the server. You may need to access the self-signed certificate before continuing.

    {{< note >}}
    In Chrome, you can accept the self-signed certificate by clicking on Advanced and then click Proceed to <ip> (unsafe). In Firefox, click on Advanced, then Add Exception, and then Confirm Security Exception.
    {{< /note >}}

1.  The Pritunl Database Setup screen appears. Enter the setup key that was generated in a previous step.

    ![Pritunl Database Setup](pritunl-config.png)

1.  The login prompt appears. Enter `pritunl` as the username and then use the password generated in a previous step.

    ![Pritunl Username Setup](pritunl-config2.png)

1.  Once you're logged in, you can change the default password and enter the domain information so Pritunl can setup the SSL certificates automatically:

    ![Pritunl Domain Setup](pritunl-config3.png)

Now that you’ve accessed your dashboard, check out [the official Pritunl documentation](https://docs.pritunl.com/docs/connecting) to learn how to add users and further utilize your Pritunl instance.

{{< content "marketplace-update-note-shortguide">}}