---
description: "Deploy BeEF on a Linode Compute Instance. This provides you with a penetration testing tool that focuses on web-borne attacks against clients."
keywords: ['security','vulnerability','penetration testing']
tags: ["marketplace", "linode platform", "cloud manager"]
published: 2021-11-12
modified: 2024-04-16
title: "Deploy BeEF through the Linode Marketplace"
external_resources:
- '[BeEF](https://beefproject.com/)'
aliases: ['/guides/deploying-beef-marketplace-app/','/guides/beef-marketplace-app/']
---

[BeEF](https://beefproject.com/) (The Browser Exploitation Framework) is a penetration testing tool that focuses on the web browser. BeEF offers an efficient and affective penetration test tool to assess the actual security posture of a target environment by using client-side attack vectors. BeEF looks beyond just the network perimeter and client system. It allows you to examine exploitability within the context of the web browser.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** BeEF should be fully installed within 10-15 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

### BeEF Options

- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates.

{{< content "marketplace-required-limited-user-fields-shortguide">}}

{{< content "marketplace-custom-domain-fields-shortguide">}}

{{< content "marketplace-special-character-limitations-shortguide">}}

## Getting Started after Deployment

### Accessing the BeEF App

1. Once the app has been *fully* deployed, view the BeEF completion message through one of the methods below:

    - **Lish Console:** Within the Cloud Manager, navigate to **Linodes** from the left menu, select the Compute Instance you just deployed, and click the **Launch LISH Console** button. See [Using the Lish Console](/docs/products/compute/compute-instances/guides/lish/).
    - **SSH:** Log in to your Compute Instance over SSH using the `root` user and run the following command. See [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/) for assistance.

        ```command
        cat /home/$USERNAME/.credentials
        ```
1. Open your web browser and navigate to `https://[domain]:3000/ui/panel`, where *[domain]* can be replaced with the custom domain you entered during deployment or your Compute Instance's rDNS domain (such as `192-0-2-1.ip.linodeusercontent.com`). You can also use your IPv4 address. See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing IP addresses and rDNS.

    ![Screenshot of the BeEF login prompt](beef-login-prompt.png)

1. Enter `beef` as the username and use the password in the /home/$USERNAME/.credentials file.

    {{< note >}}
    If you forget this password, run the following command when logged in through Lish or SSH:

    ```command
    less /home/beef/config.yaml
    ```

    Scroll down until you see the *credentials* section with the *user* and *passwd* parameters as shown in the example output below:

    ```output
    # Credentials to authenticate in BeEF.
    # Used by both the RESTful API and the Admin interface
    credentials:
        user:   "beef"
        passwd: "T$a%T1O*&2kP"
    ```
    {{< /note >}}

Now that you’ve accessed your BeEF instance, check out [the official BeEF documentation](https://github.com/beefproject/beef/wiki) to learn how to further utilize your BeEF instance.

{{< content "marketplace-update-note-shortguide">}}
