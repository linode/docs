---
slug: {{ path.Base .File.Dir }}
author:
  name: Linode Community
  email: docs@linode.com
description: "A penetration testing tool that focuses on web-borne attacks against clients."
keywords: ['security','vulnerability','penetration testing']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: {{ now.Format "2006-01-02" }}
modified_by:
  name: Linode
title: "Deploying BeEF through the Linode Marketplace"
contributor:
  name: Holden Morris
  link: https://github.com/hmorris3293
external_resources:
- '[BeEF](https://beefproject.com/)'
---

BeEF (The Browser Exploitation Framework) is a penetration testing tool that focuses on the web browser.
BeEF offers an efficent and affective penetration test tool to assess the actual security posture of a target environment by using client-side attack vectors. BeEF looks beyond just the network perimeter and client system, it allows you to examine exploitability within the context of the web browser.

### Deploying the BeEF Marketplace App

<!-- shortguide used by every Marketplace app to describe how to deploy from the Cloud Manger -->

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 10-15 minutes after the Linode has finished provisioning.**

## Configuration Options

### BeEF Options
<!-- The following table has three parts. The UDF name, in bold and in one column, followed by
     UDF description in the second column. The description is in normal text, with an optional
     "Required." tag at the end of the description, in italics, if the field is mandatory. -->
Here are the additional options available for this Marketplace App:

| **Field** | **Description** |
|:--------------|:------------|
| **BeEF Password** | The BeEF Admin Password. *Required*. |
| **Admin Email for the server** | This Email is require to generate the SSL certificates. *Required* |
| **Your Linode API Token** | Your Linode `API Token` is needed to create DNS records. If this is provided along with the `subdomain` and `domain` fields, the installation attempts to create DNS records via the Linode API. If you don't have a token, but you want the installation to create DNS records, you must [create one](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token) before continuing. |
| **Subdomain** | The subdomain you wish the installer to create a DNS record for during setup. The suggestion given is `www`. The subdomain should only be provided if you also provide a `domain` and `API Token`. |
| **Domain** | The domain name where you wish to host your BeEF instance. The installer creates a DNS record for this domain during setup if you provide this field along with your `API Token`. |
| **The limited sudo user to be created for the Linode** | This is the limited user account to be created for the Linode. This account has sudo user privileges. |
| **The password for the limited sudo user** | Set a password for the limited sudo user. The password must meet the complexity strength validation requirements for a strong password. This password can be used to perform any action on your server, similar to root, so make it long, complex, and unique. |
| **The SSH Public Key that will be used to access the Linode** | If you wish to access [SSH via Public Key](/docs/security/authentication/use-public-key-authentication-with-ssh/) (recommended) rather than by password, enter the public key here. |
| **Disable root access over SSH?** | Select `Yes` to block the root account from logging into the server via SSH. Select `No` to allow the root account to login via SSH. |


### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Ubuntu 20.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## Getting Started after Deployment
<!-- the following headings and paragraphs outline the steps necessary
     to access and interact with the Marketplace app. -->
### Accessing the BeEF App

To access your BeEF instance, You can ssh into the Linode and run the following command to get the URL needed to visit the BeEF interface:

        cat /root/beef.info

From there, you can grab the URL to access your BeEF instance. Once you put the URL in your browser, you'll be presented with a login screen, the username will be 'beef' and the password will be the password you entered when you created the Linode in the beginning of your deployment.

Now that you’ve accessed your BeEF instance, checkout [the official BeEF documentation](https://github.com/beefproject/beef/wiki) to learn how to further utilize your BeEF instance.

<!-- the following shortcode informs the user that Linode does not provide automatic updates
     to the Marketplace app, and that the user is responsible for the security and longevity
     of the installation. -->
{{< content "marketplace-update-note-shortguide">}}