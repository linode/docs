---
title: Automate Cloud Resource Deployment
description: 'This guide shows you how to automate server builds using Puppet and Chef cookbooks, golden disks and images, on a Linode running the Linux Operating System.'
keywords: ["server builds", "disks", "golden disk", "puppet", "chef"]
tags: ["linode platform","automation"]
published: 2013-06-28
modified: 2023-03-14
modified_by:
  name: Linode
aliases: ['/platform/automating-server-builds/','/guides/automating-server-builds/']
authors: ["Linode"]
---

## Why You Should Automate Server Builds

Manually configuring systems is a good way to learn, but it's also a time consuming process which is prone to human error. There are multiple ways to automate deploying new systems and various degrees to which that automation can be applied.

For example, if your needs are relatively straightforward and concise, a shell script or [StackScript](https://www.linode.com/stackscripts) could be all that is necessary. For more complex solutions, configuration orchestration and management exists to deploy and manage fleets of systems and services across multiple regions, networks, and service providers.

## Working with a Golden Image

Using a *golden image* as a configuration base is a frequent starting point in cloud environment automation. This helps quickly deploy multiple systems which are exactly identical. Across the industry, golden images are also referred to as *master*, *base*, or *clone* images, among other terms. Irrespective of name, the idea behind a golden disk is simple: create the desired image and preserve it for cloning/deploying to other servers, thereby simplifying the deployment process and eliminating configuration gap.

![Cloning your Compute Instance disk.](1303-image_cloning_2.jpg)

### Create a Golden Image

1. Create a new Compute Instance.

1. Configure all packages, applications, and system settings as desired.

1. Remove any system users you don't want to appear on your duplicated systems.

1. Shut down the Compute Instance and either:
    - [Clone the disk](/docs/products/compute/compute-instances/guides/disks-and-storage/#cloning-a-disk).
    - Alternatively, [take a snapshot](/docs/products/storage/backups/guides/take-a-snapshot/) of the disk with Linode Backups.

1. Store your golden image. This can be done in a variety of ways. A few examples are:
  - As a snapshot using [Linode Images](/docs/products/tools/images/guides/capture-an-image/) or [Linode Backups](/docs/products/storage/backups/guides/take-a-snapshot/).
  - In a [version control](/docs/guides/introduction-to-version-control/) system running on a remote or local server.
  - On [local](/docs/products/compute/compute-instances/guides/copy-a-disk-image-over-ssh/) storage.

### Restore a Golden Image

1. Copy the duplicate disk to your other Compute Instances, either using [the Linode API](/docs/api/linode-instances/#disk-clone) or [manually](/docs/products/compute/compute-instances/guides/copy-a-disk-image-to-a-different-account/#copying-the-disk). If you're using a Linode Backups snapshot, you would [restore it](/docs/products/storage/backups/guides/restore-to-an-existing-linode/) to the desired Compute Instances.

1. Create [configuration profiles](/docs/products/compute/compute-instances/guides/configuration-profiles/) on those additional Compute Instances to boot using the duplicated disk.
1. Any user credentials from the golden image will also be on the duplicated disks so you should change the new system's root password.

1. Update the new Compute Instance's [hostname](/docs/products/compute/compute-instances/guides/set-up-and-secure/#update-your-systems-hosts-filesetting-the-hostname).

1. If your golden system was configured to use a static IP address, you'll also need to [reconfigure the IP address](/docs/products/compute/compute-instances/guides/manual-network-configuration/#static-network-configuration) on your duplicated disks.

## Third-Party Tools

Golden disks are capable of handling automated server builds for most individuals and small businesses, but if you work for a large business that manages dozens of Compute Instances, you may need to turn to third-party configuration management and orchestration tools, such as:

-   **Puppet:** An open source configuration management tool that manages systems declaratively. It can automates IT tasks like application configuration, patch management, and even infrastructure audit and compliance. See the following Puppet guides:

    - [Getting Started with Puppet - Basic Installation and Setup](/docs/guides/getting-started-with-puppet-6-1-basic-installation-and-setup/)
    - [Manage and Automate Systems Configuration with Puppet](/docs/guides/manage-and-automate-systems-configuration-with-puppet/)
    - [Use Puppet Modules to Create a LAMP Stack](/docs/guides/use-puppet-modules-to-create-a-lamp-stack/)
    - [Install and Manage MySQL Databases with Puppet Hiera on Ubuntu 16.04](/docs/guides/install-and-manage-mysql-databases-with-puppet-hiera-on-ubuntu-16-04/)

-   **Chef:** An open source configuration management tool used to turn your infrastructure into code. See the [Chef website](https://www.chef.io/) for more information.

    - [A Beginner's Guide to Chef](/docs/guides/beginners-guide-chef/)
    - [Creating Your First Chef Cookbook](/docs/guides/creating-your-first-chef-cookbook/)
    - [Install a Chef Server Workstation on Ubuntu 18.04](/docs/guides/install-a-chef-server-workstation-on-ubuntu-18-04/)

-   **Ansible:** An open source platform for configuring and managing systems. It works by connecting to your systems via SSH — it doesn't install anything on the remote systems. See the [Ansible website](http://www.ansible.com/) for more information. Read more about the [Linode Ansible Collection](https://github.com/linode/ansible_linode) in the official documentation. To start using Ansible, check out the following guides:

    - [Use the Linode Ansible Collection to Deploy a Linode](/docs/guides/deploy-linodes-using-linode-ansible-collection/)
    - [Getting Started With Ansible - Basic Installation and Setup](/docs/guides/getting-started-with-ansible/)
    - [Automate Server Configuration with Ansible Playbooks](/docs/guides/running-ansible-playbooks/)

- **Salt:** Salt (also referred to as SaltStack) is a Python-based configuration management and orchestration system. Salt uses a master/client model in which a dedicated Salt master server manages one or more Salt minion servers. To learn more about Salt, see the following guides:

    - [A Beginner's Guide to Salt](/docs/guides/beginners-guide-to-salt/)
    - [Getting Started with Salt - Basic Installation and Setup](/docs/guides/getting-started-with-salt-basic-installation-and-setup/)
    - [SaltStack Command Line Reference](/docs/guides/salt-command-line-reference/)
    - [Introduction to Jinja Templates for Salt](/docs/guides/introduction-to-jinja-templates-for-salt/)
    - [Test Salt States Locally with KitchenSalt](/docs/guides/test-salt-locally-with-kitchen-salt/)
    - [Secrets Management with Salt](/docs/guides/secrets-management-with-salt/)
    - [Use and Modify Official SaltStack Formulas](/docs/guides/use-and-modify-official-saltstack-formulas/)
    - [Use Salt States to Configure a LAMP Stack on a Minion](/docs/guides/use-salt-states-to-configure-a-lamp-stack-on-a-minion/)
    - [Monitoring Salt Minions with Beacons](/docs/guides/monitoring-salt-minions-with-beacons/)
    - [Create a Salt Execution Module](/docs/guides/create-a-salt-execution-module/)
    - [Automate Static Site Deployments with Salt, Git, and Webhooks](/docs/guides/automate-a-static-site-deployment-with-salt/)
    - [Use Salt States to Create LAMP Stack and Fail2ban Across Salt minions](/docs/guides/use-salt-states-to-create-lamp-stack-and-fail2ban-across-salt-minions/)
    - [Configure and Use Salt Cloud and Cloud Maps to Provision Systems](/docs/guides/configure-and-use-salt-cloud-and-cloud-maps-to-provision-systems/)

- **Terraform:** Terraform by HashiCorp is an orchestration tool that allows you to represent your Compute Instances and other resources with declarative code inside configuration files, instead of manually creating those resources via the Cloud Manager or API. This practice is referred to as Infrastructure as Code, and Terraform is a popular example of this methodology.

    - [A Beginner's Guide to Terraform](/docs/guides/beginners-guide-to-terraform/)
    - [Introduction to HashiCorp Configuration Language (HCL)](/docs/guides/introduction-to-hcl/)
    - [Use Terraform to Provision Linode Environments](/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/)
    - [Import Existing Infrastructure to Terraform](/docs/guides/import-existing-infrastructure-to-terraform/)
    - [Secrets Management with Terraform](/docs/guides/secrets-management-with-terraform/)
    - [Create a NodeBalancer with Terraform](/docs/guides/create-a-nodebalancer-with-terraform/)
    - [Deploy a WordPress Site Using Terraform and Linode StackScripts](/docs/guides/deploy-a-wordpress-site-using-terraform-and-linode-stackscripts/)
    - [Create a Terraform Module](/docs/guides/create-terraform-module/)

There are plenty of other third-party configuration management tools to be used should the above options not suit your needs.