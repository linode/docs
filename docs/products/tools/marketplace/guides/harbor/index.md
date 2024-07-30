---
title: "Deploy Harbor through the Linode Marketplace"
description: "Deploy Harbor on a Linode Compute Instance. This provides you with an open source container registry that compliments the Linode Kubernetes Engine."
published: 2021-11-12
modified: 2023-10-27
keywords: ['harbor','container','container registry','docker']
tags: ["marketplace", "linode platform", "cloud manager"]
external_resources:
- '[Harbor](https://goharbor.io/)'
aliases: ['/guides/deploying-harbor-marketplace-app/','/guides/harbor-marketplace-app/']
---

[Harbor](https://goharbor.io/) is an open source container registry platform, cloud-native content storage, and signing/scanning tool. Harbor enhances the open source Docker distribution by providing features like security, identification, and management. The image transfer efficiency can be improved by having a registry closer to the build and run environment. Harbor includes comprehensive security features like user administration, access control, and activity auditing, as well as image replication between registries.

Harbor is an excellent compliment to the [Linode Kubernetes Engine (LKE)](/docs/products/compute/kubernetes/). However, you cannot install Harbor on an existing or new LKE clusters.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Harbor should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

### Harbor Options

- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started after Deployment

### Accessing the Harbor App

1.  Open your web browser and navigate to `https://DOMAIN/`, where *DOMAIN* can be replaced with the custom domain you entered during deployment or your Compute Instance's rDNS domain (such as `192-0-2-1.ip.linodeusercontent.com`). See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing rDNS.

1.  To locate your Harbor login credentials, view the Harbor credentials file through one of the methods below:

    - **Lish Console:** Within Cloud Manager, navigate to **Linodes** from the left menu, select the Compute Instance you just deployed, and click the **Launch LISH Console** button. See [Using the Lish Console](/docs/products/compute/compute-instances/guides/lish/).
    - **SSH:** Log in to your Compute Instance over SSH using the `root` user and run the following command. See [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/) for assistance.

        ```command
        cat /home/$USERNAME/.credentials
        ```

1.  In the Harbor login screen that appears, enter `admin` as the username and use the *Harbor admin password* found in your `.credentials` file.

    ![Harbor Login Page](harbor-login.png)

Now that you’ve accessed your dashboard, check out [the official Harbor documentation](https://goharbor.io/docs/2.3.0/administration/) to learn how to further use your Harbor instance.

{{% content "marketplace-update-note-shortguide" %}}
