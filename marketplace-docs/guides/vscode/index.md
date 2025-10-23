---
title: "Deploy VS Code through the Linode Marketplace"
description: "This guide shows you how to run VS Code Server in the browser to create, edit, and manipulate code by using the VS Code app from the Linode One-Click Marketplace."
published: 2020-12-02
modified: 2022-03-08
keywords: ['vscode', 'marketplace', 'vscode web browser']
tags: ["debian","marketplace", "web applications","linode platform", "cloud manager"]
external_resources:
- '[Code Server FAQ](https://github.com/cdr/code-server/blob/v3.7.4/doc/FAQ.md)'
- '[Code Server Setup and Configuration Guide](https://github.com/cdr/code-server/blob/v3.7.4/doc/guide.md)'
aliases: ['/products/tools/marketplace/guides/vscode/','/platform/marketplace/how-to-deploy-vscode-with-marketplace-apps/', '/platform/one-click/how-to-deploy-vscode-with-one-click-apps/','/guides/how-to-deploy-vscode-with-one-click-apps/','/guides/deploy-vscode-with-marketplace-apps/','/guides/vscode-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 688903
marketplace_app_name: "VS Code Server"
---

Run a [Visual Studio Code Server](https://github.com/cdr/code-server) in the browser with the Visual Studio (VS) Code Marketplace App. Code Server uses the open source code to provide a web interface for VS Code.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Visual Studio Code Server should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended minimum plan:** All plan types and sizes can be used.

### VS Code Options

- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates as well as configuring the server and DNS records.
- **The version of VS Code Server you'd like installed** *(required)*: Enter the VS Code Server version to be installed during the setup.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

### Obtain the Credentials

Once the app is deployed, you need to obtain the credentials from the server.

To obtain the credentials:

1.  Log in to your new Compute Instance using one of the methods below:

    - **Lish Console**: Log in to Cloud Manager, click the **Linodes** link in the left menu, and select the Compute Instance you just deployed. Click **Launch LISH Console**. Log in as the `root` user. To learn more, see [Using the Lish Console](/docs/products/compute/compute-instances/guides/lish/).
    - **SSH**: Log in to your Compute Instance over SSH using the `root` user. To learn how, see [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/).

1.  Run the following command to access the credentials file:

    ```command
    cat /home/$USERNAME/.credentials
    ```

This returns passwords that were automatically generated when the instance was deployed. Save them. Once saved, you can safely delete the file.

## Getting Started after Deployment

VS Code is now installed. To get started:

1.  Open a web browser and navigate to the domain you entered when creating the instance: `https://domain.tld`. If you did not enter a domain, use your Compute Instance's default rDNS domain (`192-0-2-1.ip.linodeusercontent.com`). To learn more on viewing the rDNS value, see [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/). Make sure to use the `https` prefix in the URL to access the website securely.

## Software Included

The VS Code Marketplace App installs the following software on the Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**Code Server**](https://github.com/cdr/code-server) | Code Server which hosts the open source web interface of VS Code.|
| [**NGINX**](https://www.nginx.com) | An open source web server. |
| [**ufw**](https://wiki.ubuntu.com/UncomplicatedFirewall) | ufw is the uncomplicated firewall, a front end for iptables. |

{{% content "marketplace-update-note-shortguide" %}}
