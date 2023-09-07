---
title: Get Started
title_meta: "Getting Started with Compute Instances"
description: "Learn how to quickly start using Compute Instances on the Linode Platform."
tab_group_main:
    weight: 20
aliases: ['/products/compute/shared-linodes/get-started/','/products/compute/shared-cpu/get-started/','/products/compute/dedicated-cpu/get-started/','/products/compute/gpu/get-started/','/products/compute/high-memory/get-started/']
---

Compute Instances (cloud-based virtual machines) are the foundational infrastructure components for most applications and workloads running on Linode. They offer a fully virtualized Linux system with root access. As such, you can install whatever software you need and configure to be perfectly tuned for your use cases. Compute Instances can host anything from a personal blog or small business website all the way up to enterprise applications serving millions of people a day.

## Create a Compute Instance

Compute Instances can be deployed using the Cloud Manager, the Linode API, or the Linode CLI. For instructions on deploying one through the Cloud Manager, see the following guides:

- [Create a Compute Instance](/docs/products/compute/compute-instances/guides/create/)
- [Choosing a Compute Instance Type and Plan](/docs/products/compute/compute-instances/plans/choosing-a-plan/)

{{< note >}}
Consider deploying an app from the [Linode Marketplace](https://www.linode.com/marketplace/apps/) to quickly get up and running with many popular applications, including [Wordpress](https://www.linode.com/marketplace/apps/linode/wordpress/), [WooCommerce](https://www.linode.com/marketplace/apps/linode/woocommerce/), [LEMP](https://www.linode.com/marketplace/apps/linode/lemp/), [cPanel](https://www.linode.com/marketplace/apps/cpanel/cpanel/), [Plesk](https://www.linode.com/marketplace/apps/plesk/plesk/), and [Nextcloud](https://www.linode.com/marketplace/apps/linode/nextcloud/). See [How to Use Linode's Marketplace Apps](/docs/products/tools/marketplace/get-started/).
{{< /note >}}

## Connect to the Instance

After the Compute Instance is finished provisioning and has fully booted up, you can connect to it through the built-in Lish Console in the Cloud Manager (or via the SSH Lish Gateway) or SSH directly to your new system.

-   **Weblish (via the Cloud Manager):** Click the **Launch LISH Console** link at the top right corner of the Compute Instance's detail page. See [Using the Lish Console > Through a Browser](/docs/products/compute/compute-instances/guides/lish/#through-the-cloud-manager-weblish).

-   **SSH:** Copy the command from the *SSH Access* field that is available in Cloud Manager under the **Access** section on the Compute Instance's detail page. Paste the commmand into your local computer's terminal. The command should look similar to the following, only with the IP address of your newly created instance.

    ```command
    ssh root@192.0.2.1
    ```

    - **Windows:** Windows 10 and 11 users can connect to their Compute Instance using the [Command Prompt (or PowerShell)](/docs/guides/connect-to-server-over-ssh-on-windows/#command-prompt-or-powershell---windows-10-or-11) application, provided their system is fully updated. For users of Windows 8 and earlier, [Secure Shell on Chrome](/docs/guides/connect-to-server-over-ssh-on-chrome/), [PuTTY](/docs/guides/connect-to-server-over-ssh-using-putty/), or many other third party tools can be used instead. See [Connecting to a Remote Server Over SSH on Windows](/docs/guides/connect-to-server-over-ssh-on-windows/).
    - **macOS:** The *Terminal* application is pre-installed on macOS. See [Connecting to a Remote Server Over SSH on a Mac](/docs/guides/connect-to-server-over-ssh-on-mac/).
    - **Linux:** You can use a terminal window, regardless of desktop environment or window manager. See [Connecting to a Remote Server Over SSH on Linux](/docs/guides/connect-to-server-over-ssh-on-linux/)

-   **Lish (via SSH):** Copy the command from the *LISH Console via SSH* field that is available in Cloud Manager under the **Access** section on the Compute Instance's detail page. Paste the commmand into your local computer's terminal. The command should look similar to the one below, only with your username, data center, and Compute Instance label. Review [Using the Lish Console > Through SSH](/docs/products/compute/compute-instances/guides/lish/#through-ssh-using-a-terminal) for more instructions.

    ```command
    ssh -t user@lish-newark.linode.com example-instance
    ```

## Migrate Existing Workloads

Linode's Compute Instances (and other products and services) can run almost any workload you may have on other hosting providers. Review the [migration guides](/docs/guides/platform/migrate-to-linode/) for instructions.

## Deploy New Applications

Now you can start using your Compute Instance. Whether you're just here to test things out or are looking to host a specific application with us, we may have a guide that can help you get up and running. Open the [Guides](/docs/guides/) section and start browsing or use the search tool at the top of the page to find any guides related to your use case.

{{< content "email-warning-shortguide" >}}