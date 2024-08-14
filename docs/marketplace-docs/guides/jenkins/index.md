---
title: "Deploy Jenkins through the Linode Marketplace"
description: "This guide shows how to install Jenkins, an open source automation tool which system administrators can use to build, test, and deploy your infrastructure."
published: 2020-03-12
modified: 2024-08-05
keywords: ['jenkins','marketplace','pipeline','continuous delivery']
tags: ["linode platform","automation","marketplace","cloud-manager"]
external_resources:
- '[Creating Your First Jenkins Pipeline](https://jenkins.io/doc/pipeline/tour/hello-world/)'
- '[Managing Jenkins Masters and Nodes](https://jenkins.io/doc/book/managing/)'
- '[Managing Jenkins Plugins](https://jenkins.io/doc/book/managing/plugins/)'
aliases: ['/products/tools/marketplace/guides/jenkins/','/platform/marketplace/how-to-deploy-jenkins-with-marketplace-apps/', '/platform/one-click/how-to-deploy-jenkins-with-one-click-apps/','/guides/how-to-deploy-jenkins-with-one-click-apps/','/guides/how-to-deploy-jenkins-with-marketplace-apps/','/guides/jenkins-marketplace-app/']
authors: ["Akamai"]
---

[Jenkins](https://jenkins.io/) is an open source automation tool which can build, test, and deploy your infrastructure. It gives you access to a massive library of plugins to support automation in your project's lifecycle. You can create a [continuous delivery pipeline](https://jenkins.io/doc/pipeline/tour/hello-world/#what-is-a-jenkins-pipeline) which automates the process for getting your software from version control to your users.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Jenkins should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS
- **Suggested minimum plan:** All plan types and sizes can be used.

### Jenkins Options

{{% content "marketplace-required-limited-user-shortguide" %}}
{{% content "marketplace-special-character-limitations-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

- **Let's Encrypt SOA Email:** *(required)* Email address for free Let's Encrypt SSL certificate.
- **Jenkins Version:** *(required)* Version of Jenkins to deploy.

## Getting Started after Deployment

After deploying your Jenkins instance, log in and continue the configuration.

### Access Your Jenkins Instance

1. [Connect to your Linode via SSH](/docs/products/compute/compute-instances/guides/set-up-and-secure/#connect-to-the-instance) using `root` or the `sudo user` created during deployment if you added Account SSH Keys.

1. Retrieve your Jenkins admin password from the `/home/$SUDO_USER/.credentials` file.

    ```command
    cat /home/$SUDO_USER/.credentials
    ```

    You should see a similar output:

    ```output
      Sudo Username: $SUDO_USER
      Sudo Password: ifdQUa3mD2UJSJ2NA9ddSDVl5NCWfKl
      Jenkins Admin password: BeVrZwVkn1mUO0Gl38lRabp
    ```

1. Open a web browser and navigate to `https://192-0-2-17.ip.linodeusercontent.com`. Replace `192-0-2-17.ip.linodeusercontent.com` with the reverse DNS for your Compute Instance. This will open the *Unlock Jenkins* page. Enter the password you retrieved in the previous step and click **Continue**.

    ![Log into Jenkins with your admin password](jenkins-admin-login.png)

1. Install the community-suggested plugins or select the plugins to install manually.

    ![Install Jenkins Plugins](install-jenkins-plugins.png)

1. After you install the desired plugins, create your first admin user. The Jenkins admin password you used earlier is temporary.

    ![Create your first Jenkins admin user.](create-admin-user.png)

{{% content "marketplace-update-note-shortguide" %}}