---
author:
  name: Linode
  email: docs@linode.com
description: Our guide to automating server builds with the Linode Manager
keywords: ["server builds", "disks", "golden disk", "puppet", "chef"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2019-01-08
modified_by:
  name: Alex Fornuto
published: 2013-06-28
title: Automating Server Builds
---

If you run a large website that requires multiple servers, or have a general interest in server automation, you may want to automate your server builds. You can rapidly spin up multiple servers with exactly the same configuration by creating a *golden image* that can be cloned to multiple Linodes with the intention of eliminating configuration drift.

Server configuration can also be automated through [Stackscripts](https://www.linode.com/stackscripts). View the [Stackscripts](/docs/platform/stackscripts/) guide for more information.

## Why You Should Automate Server Builds

When you set up a Linode for the first time, you manually install packages and applications. For example, in the [Hosting a Website](/docs/websites/hosting-a-website/) guide, the Apache, MySQL, and PHP packages are installed. Manually installing packages is a good way to learn about virtual servers, but it's also a time-consuming process.

It is recommended that you take steps to automate the server-provisioning process, even if you don't need multiple Linodes at this moment. By duplicating the disk or writing an install StackScript, you'll preserve the current state of your server -- including all of the packages you've installed and settings you've configured. If you want to spin up another Linode in the future, your automatic server building process will save you time.

## Golden Disk

The idea behind a golden disk is simple: create the desired image and then save it for cloning to other servers. To get started, set up a new Linode, install the desired packages, configure the settings, and then test the configuration. Once satisfied with the server configuration, shut down the Linode, duplicate the disk, and then clone it to all of your other Linodes, either manually or though [the Linode API](http://www.linode.com/api/linode/linode.clone).

{{< note >}}
Be aware that certain files like `/etc/hosts`, `/etc/hostname`, and static networking configurations may need to be modified for individual Linodes.
{{< /note >}}

[![Cloning your Linode disk.](1303-image_cloning_2.jpg)](1303-image_cloning_2.jpg)

There are several places to store a golden disk:

-   **Linode Images:** [Linode Images](/docs/platform/disk-images/linode-images/) allows you to take snapshots of your disks, and then deploy them to any Linode under your account.
-   **Linode Backup Service:** After enabling the Linode Backup Service, you can [make a manual backup](/docs/platform/linode-backup-service/#take-a-manual-snapshot) of your Linode (called a *snapshot*). This snapshot can function as your golden disk. Instead of cloning a disk to new Linodes, you can simply restore them from the snapshot backup.
-   **Dedicated Linode:** Boot the Linode, make the desired changes, and clone the disk again.
-   **Existing Linode:** You can clone from an existing Linode, but you will need to power down the Linode to ensure a consistent copy.
-   **Different Computer:** You can transfer the disk to another computer. For instructions, see our guide on [Copying a Disk Over SSH](/docs/platform/disk-images/copying-a-disk-image-over-ssh/).

These methods are discussed in further detail below, with the exception of [Linode Images](/docs/platform/disk-images/linode-images/) which has its own article.



### Linode Backup Service

If you subscribe to the [Linode Backup Service](http://www.linode.com/backups/), you can create a golden disk by making a manual backup of an existing disk. Take a *snapshot* of the disk to back it up, and then restore it to your other Linodes. There's no need to clone or resize the disk. The snapshot will be stored until you overwrite it with another backup.

1.  Use the Linode's existing disk, or [create a new disk](/docs/platform/disk-images/disk-images-and-configuration-profiles/#creating-a-disk-with-a-linux-distribution-installed).
2.  Install all necessary packages and configure the system settings.
3.  Verify that all installed packages are current. See [Monitoring and Maintaining Your Server](/docs/uptime/monitoring-and-maintaining-your-server/#updating-software) for instructions.
4.  Test your server configuration. At a minimum, this probably includes downloading your version-controlled repository and verifying that your website or application functions properly.
5.  Take a snapshot of the disk. See the [manual snapshot](/docs/platform/linode-backup-service/#take-a-manual-snapshot) instructions for more information.
6.  Restore your other Linodes from the snapshot. The disk can be restored to as many Linodes as you like. See the [backup restore](/docs/platform/linode-backup-service/#restore-from-a-backup) instructions for more information.



### Dedicated Linode

A dedicated Linode can be used to store and maintain a golden disk. It can be shut down after you've created the disk, and then boot it to update the image.

1.  Use an existing Linode, or [set up a new one](/docs/getting-started/#sign-up).
2.  Install all necessary packages and configure the system settings, if you haven't already done so.
3.  Verify that all installed packages are current. See our [Monitoring and Maintaining Your Server](/docs/uptime/monitoring-and-maintaining-your-server/#updating-software) guide for instructions.
4.  Test your server configuration. At a minimum, this probably includes downloading your version-controlled repository and verifying that your website or application functions properly.
5.  Shut down your Linode.
6.  [Clone the disk](/docs/platform/disk-images/disk-images-and-configuration-profiles/#cloning-disks-and-configuration-profiles) to another Linode. You can also clone the configuration profile. The disk can be cloned to as many Linodes as you like.


### Existing Linode

You can create and store a golden disk using an *existing Linode*, with some drawbacks: all of the disks stored on the Linode will need to be resized to fit within your target Linode's allocated storage space, and you will have to shut down the Linode to ensure an accurate clone, which will result in downtime.

1.  Use the Linode's existing disk, or [create a new disk](/docs/platform/disk-images/disk-images-and-configuration-profiles/#creating-a-disk-with-a-linux-distribution-installed).
2.  Install all necessary packages and configure the system settings, if you haven't already done so.
3.  Verify that all installed packages are current. See our [Monitoring and Maintaining Your Server](/docs/uptime/monitoring-and-maintaining-your-server/#updating-software) guide for instructions.
4.  Test your server configuration. At a minimum, this probably includes downloading your version-controlled repository and verifying that your website or application functions properly.
5.  Shut down the Linode.
6.  Resize the disk. See our [Resizing a Disk](/docs/platform/disk-images/disk-images-and-configuration-profiles/#resizing-a-disk) guide for instructions.
7.  If you're planning on using the golden disk on the existing Linode, you should duplicate the disk. See our [Duplicating a Disk](/docs/platform/disk-images/disk-images-and-configuration-profiles/#duplicating-a-disk) guide for instructions.
8.  [Clone the disk](/docs/platform/disk-images/disk-images-and-configuration-profiles/#cloning-disks-and-configuration-profiles) to another Linode. You can also clone the configuration profile. The disk can be cloned to as many Linodes as you like.


### Updating the Hostname and IP Address

After you restore or clone a disk to another Linode, you may need to change its hostname and IP address. For instructions on changing the hostname, see [Setting the Hostname](/docs/getting-started/#setting-the-hostname). If the golden disk was configured to use a static IP address, you'll also need to replace the IP address. See [Static IP Configuration](/docs/networking/linux-static-ip-configuration/#static-network-configuration) for more information.

## Third-Party Tools

Golden disks are capable of handling automated server builds for most individuals and small businesses, but if you work for a large business that manages dozens of Linodes, you may need to turn to third-party configuration management and orchestration tools, such as:

-   **Puppet:** An open source configuration management tool that manages systems declaratively. It can automates IT tasks like application configuration, patch management, and even infrastructure audit and compliance. See the following Puppet guides:

    - [Basic Puppet Setup and Configuration](/docs/websites/puppet/basic-puppet-setup-and-configuration/)
    - [Manage and Automate Systems Configuration with Puppet](/docs/websites/puppet/manage-and-automate-systems-configuration-with-puppet/)
    - [Use Puppet Modules to Create a LAMP Stack](/docs/applications/configuration-management/use-puppet-modules-to-create-a-lamp-stack/)
    - [Install and Manage MySQL Databases with Puppet Hiera on Ubuntu 16.04](/docs/applications/configuration-management/install-and-manage-mysql-databases-with-puppet-hiera-on-ubuntu-16-04/)

-   **Chef:** An open source configuration management tool used to turn your infrastructure into code. See the [Chef website](https://www.chef.io/) for more information. The [knife Linode](https://github.com/chef/knife-linode) subcommand can also be used to manage Linodes with Chef. See the following Chef guides to get started:

    {{< note >}}
Knife Linode is based on Linode's deprecated APIv3.
    {{</ note >}}

    - [A Beginner's Guide to Chef](https://linode.com/docs/applications/configuration-management/beginners-guide-chef/)
    - [Creating Your First Chef Cookbook](/docs/applications/configuration-management/creating-your-first-chef-cookbook/)
    - [Install a Chef Server Workstation on Ubuntu 18.04](/docs/applications/configuration-management/install-a-chef-server-workstation-on-ubuntu-18-04/)

-   **Ansible:** An open source platform for configuring and managing systems. It works by connecting to your systems via SSH — it doesn't install anything on the remote systems. See the [AnsibleWorks website](http://www.ansible.com/) for more information. Read more about the [Linode Module from Ansible](http://docs.ansible.com/ansible/latest/linode_module.html) in the official documentation. To start using Ansible, check out the following guides:

    {{< note >}}
The Linode Module from Ansible is based on Linode's deprecated APIv3.
    {{</ note >}}

    - [Learn How to Install Ansible and Run Playbooks](/docs/applications/configuration-management/learn-how-to-install-ansible-and-run-playbooks/)
    - [Automatically Configure Servers with Ansible and Playbooks](/docs/applications/configuration-management/automatically-configure-servers-with-ansible-and-playbooks/)

- **Salt:** Salt (also referred to as SaltStack) is a Python-based configuration management and orchestration system. Salt uses a master/client model in which a dedicated Salt master server manages one or more Salt minion servers. To learn more about Salt, see the following guides:

    - [A Beginner's Guide to Salt](https://www.linode.com/docs/applications/configuration-management/beginners-guide-to-salt/)
    - [Getting Started with Salt - Basic Installation and Setup](/docs/applications/configuration-management/getting-started-with-salt-basic-installation-and-setup/)
    - [SaltStack Command Line Reference](/docs/applications/configuration-management/salt-command-line-reference/)
    - [Introduction to Jinja Templates for Salt](/docs/applications/configuration-management/introduction-to-jinja-templates-for-salt/)
    - [Test Salt States Locally with KitchenSalt](/docs/applications/configuration-management/test-salt-locally-with-kitchen-salt/)
    - [Secrets Management with Salt](/docs/applications/configuration-management/secrets-management-with-salt/)
    - [Use and Modify Official SaltStack Formulas](/docs/applications/configuration-management/use-and-modify-official-saltstack-formulas/)
    - [Use Salt States to Configure a LAMP Stack on a Minion](/docs/applications/configuration-management/use-salt-states-to-configure-a-lamp-stack-on-a-minion/)
    - [Monitoring Salt Minions with Beacons](/docs/applications/configuration-management/monitoring-salt-minions-with-beacons/)
    - [Create a Salt Execution Module](/docs/applications/configuration-management/create-a-salt-execution-module/)
    - [Automate Static Site Deployments with Salt, Git, and Webhooks](/docs/applications/configuration-management/automate-a-static-site-deployment-with-salt/)
    - [Use Salt States to Create LAMP Stack and Fail2ban Across Salt minions](/docs/applications/configuration-management/use-salt-states-to-create-lamp-stack-and-fail2ban-across-salt-minions/)
    - [Configure and Use Salt Cloud and Cloud Maps to Provision Systems](/docs/applications/configuration-management/configure-and-use-salt-cloud-and-cloud-maps-to-provision-systems/)

- **Terraform:** Terraform by HashiCorp is an orchestration tool that allows you to represent your Linode instances and other resources with declarative code inside configuration files, instead of manually creating those resources via the Linode Manager or API. This practice is referred to as Infrastructure as Code, and Terraform is a popular example of this methodology.

    {{< note >}}
The Terraform Linode provider is based on [Linode's APIv4](https://developers.linode.com/api/v4).
    {{</ note >}}

    - [A Beginner's Guide to Terraform](/docs/applications/configuration-management/beginners-guide-to-terraform/)
    - [Introduction to HashiCorp Configuration Language (HCL)](/docs/applications/configuration-management/introduction-to-hcl/)
    - [Use Terraform to Provision Linode Environments](/docs/applications/configuration-management/how-to-build-your-infrastructure-using-terraform-and-linode/)
    - [Import Existing Infrastructure to Terraform](/docs/applications/configuration-management/import-existing-infrastructure-to-terraform/)
    - [Secrets Management with Terraform](/docs/applications/configuration-management/secrets-management-with-terraform/)
    - [Create a NodeBalancer with Terraform](/docs/applications/configuration-management/create-a-nodebalancer-with-terraform/)
    - [Deploy a WordPress Site Using Terraform and Linode StackScripts](/docs/applications/configuration-management/deploy-a-wordpress-site-using-terraform-and-linode-stackscripts/)
    - [Create a Terraform Module](/docs/applications/configuration-management/create-terraform-module/)

There are plenty of other third-party configuration management tools to be used should the above options not suit your needs.


