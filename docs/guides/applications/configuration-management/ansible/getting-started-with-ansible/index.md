---
slug: getting-started-with-ansible
author:
    name: Linode Community
    email: docs@linode.com
description: "In this guide, we'll show you how to use Ansible to perform basic configuration tasks on your Linodes as well as set up a simple web server."
og_description: "In this guide, we'll show you how to use Ansible to perform basic configuration tasks on your Linodes as well as set up a simple web server."
keywords: ["ansible", "ansible configuration", "ansible provisioning", "ansible infrastructure", "ansible automation", "ansible configuration change management", "ansible server automation"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/applications/ansible/getting-started-with-ansible/','/applications/configuration-management/getting-started-with-ansible/','/applications/configuration-management/ansible/getting-started-with-ansible/']
published: 2018-03-21
modified: 2019-06-19
modified_by:
    name: Ryan Syracuse
title: "Getting Started with Ansible: Installation and Setup"
h1_title: "Getting Started With Ansible: Basic Installation and Setup"
enable_h1: true
contributor:
    name: Joshua Lyman
    link: https://twitter.com/jlyman
external_resources:
 - '[Ansible Home Page](http://www.ansible.com/home)'
 - '[Ansible Documentation](http://docs.ansible.com/ansible/index.html)'
 - '[Example Playbooks (GitHub)](https://github.com/ansible/ansible-examples)'
tags: ["automation"]
---

![Automatically Configure Servers with Ansible and Playbooks](automatically-configure-servers-with-ansible-title.jpg "Automatically Configure Servers with Ansible and Playbooks")

## What is Ansible?

[Ansible](http://www.ansible.com/home) is an automation tool for server provisioning, configuration, and management. It allows you to organize your servers into groups, describe how those groups should be configured, and what actions should be taken on them, all from a central location.

To get started using Ansible, it is helpful to become familiar with a few basic terms and concepts used to describe Ansible's main components.

- **Control Node**: Your infrastructure nodes are managed by Ansible from a **control node** which can be your personal computer or a server. For increased management speed, it is recommended to host your control node on a server that is as close to your managed nodes as possible.

- **Managed Nodes**: The hosts that compose your infrastructure and that are managed by the Ansible control node. Managed nodes do not require Ansible to be installed on them.

- **Inventory**: Ansible keeps track of its managed nodes using an [inventory file](http://docs.ansible.com/ansible/intro_inventory.html) typically located in `/etc/ansible/hosts`. In the inventory file, you can group your managed nodes and use these groups to target specific hosts that make up your infrastructure. Ansible can use multiple inventory sources, like other inventory files and dynamic inventory pulled using an inventory plugin or script.

    If your Ansible managed infrastructure will change over time, it is recommended to use the [dynamic inventory plugin for Linode](https://docs.ansible.com/ansible/latest/plugins/inventory/linode.html). You can read the [How to use the Linode Ansible Module to Deploy Linodes](/docs/guides/deploy-linodes-using-ansible/) to learn how to use this plugin.

- **Modules**: Modules add extra functionality to Ansible. You can call Ansible modules directly from the command line to execute on your managed nodes or use them in your Playbooks. See [Ansible's module index](https://docs.ansible.com/ansible/latest/modules/modules_by_category.html) for a list of available modules by category.

- **Tasks**: The simplest unit of execution in Ansible is a task. Tasks utilize Ansible modules to manage your host's services, packages, files and to perform various system configurations. Tasks can be executed from the command line or within Playbooks.

- **Playbooks**: Playbooks are YAML files containing a list of tasks in the desired order of execution. You can run Playbooks on your managed nodes and reuse and share them. [Variables](https://docs.ansible.com/ansible/latest/user_guide/playbooks_variables.html) and [Jinja templating](https://docs.ansible.com/ansible/latest/user_guide/playbooks_templating.html) provide a powerful way to execute complex tasks on your managed hosts.

## Scope of this Guide
This guide introduces the basics of installing Ansible and preparing your environment to use [Playbooks](https://docs.ansible.com/ansible/latest/user_guide/playbooks.html). You will complete the following steps in this guide:

* Install and configure Ansible on your computer or a Linode to serve as the control node that will manage your infrastructure nodes.
* Create two Linodes to manage with Ansible and establish a basic connection between the control node and your managed nodes. The managed nodes will be referred to as `node-1`, and `node-2` throughout the guide.

    {{< note >}}
The examples in this guide provide a manual method to establish a basic connection between your control node and managed nodes as a way to introduce the basics of Ansible. If you would like to learn how to use Ansible's [Linode module](https://docs.ansible.com/ansible/latest/modules/linode_v4_module.html) to automate deploying and managing Linodes, see the [How to use the Linode Ansible Module to Deploy Linodes](/docs/guides/deploy-linodes-using-ansible/). The guide assumes familiarity with Ansible modules, Playbooks, and dynamic inventories.
    {{</ note >}}

## Before You Begin

{{< caution >}}
This guide's example instructions will create up to three billable Linodes on your account. If you do not want to keep using the example Linodes that you create, be sure to [delete them](#delete-a-cluster) when you have finished the guide.

If you remove the resources afterward, you will only be billed for the hour(s) that the resources were present on your account. Consult the [Billing and Payments](/docs/guides/understanding-billing-and-payments/) guide for detailed information about how hourly billing works.
{{< /caution >}}

1. [Create three Linodes](/docs/guides/creating-a-compute-instance/) running Debian 9. One will be the **control node** and two you will use as your Ansible **managed nodes**. The examples in this guide can also be followed using a single managed node, if preferred.

1. Ansible uses the SSH protocol to securely log into managed nodes and apply your Playbook configurations. Create an SSH key-pair on the control node to use for authentication. This guide assumes your public and private SSH key-pair is stored in `~/.ssh/id_rsa.pub` and `~/.ssh/id_rsa`.

        ssh-keygen -t rsa -b 4096

2.  Copy the key to `node-1`. Replace `203.0.113.0` with your managed Linode's IP address.

        ssh-copy-id root@203.0.113.0

    Repeat this procedure for each remaining node.

    {{< note >}}
This step can be automated by using Ansible's Linode module. See the [How to use the Linode Ansible Module to Deploy Linodes](/docs/guides/deploy-linodes-using-ansible/) for more information.
    {{</ note >}}

## Set up the Control Node

### Install and Set Up Miniconda

With Miniconda, it's possible to create a virtualized environment for Ansible which can help to streamline the installation process for most Distros and environments that require multiple versions of Python. Your control node will require Python version 2.7 or higher to run Ansible.

1. Download and install Miniconda:

        curl -OL https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh
        bash Miniconda3-latest-Linux-x86_64.sh

1. You will be prompted several times during the installation process. Review the terms and conditions and select “yes” for each prompt.

1. Restart your shell session for the changes to your PATH to take effect.

        exec bash -l

1. Create a new virtual environment for Ansible:

        conda create -n ansible-dev python=3

1.  Activate the new environment:

        conda activate ansible-dev

1. Check your Python version:

        python --version

### Install Ansible

{{< note >}}
This guide was created using Ansible 2.8.
{{</ note >}}

1. Follow the Ansible installation steps related to your control node's distribution.
    #### MacOS

        sudo easy_install pip
        sudo pip install ansible

    #### CentOS 7

        sudo yum install epel-release
        sudo yum install ansible

    {{< note >}}
  The EPEL-Release repository may need to be added on certain versions of CentOS, RHEL, and Scientific Linux.
    {{</ note >}}

    #### Ubuntu 22.04

        sudo apt update
        sudo apt install software-properties-common
        sudo apt-add-repository --yes --update ppa:ansible/ansible
        sudo apt install ansible

1.  Verify that Ansible is installed:

        ansible --version

## Configure Ansible

By default, Ansible's configuration file location is `/etc/ansible/ansible.cfg`. In most cases, the default configurations are enough to get you started using Ansible. In this example, you will use Ansible's default configurations.

1. To view a list of all current configs available to your control node, use the `ansible-config` command line utility.

        ansible-config list

    You will see a similar output:

    {{< output >}}
  ACTION_WARNINGS:
  default: true
  description: [By default Ansible will issue a warning when received from a task
      action (module or action plugin), These warnings can be silenced by adjusting
      this setting to False.]
  env:
  - {name: ANSIBLE_ACTION_WARNINGS}
  ini:
  - {key: action_warnings, section: defaults}
  name: Toggle action warnings
  type: boolean
  version_added: '2.5'
AGNOSTIC_BECOME_PROMPT:
  default: false
  ...
    {{</ output >}}

### Create an Ansible Inventory

Ansible keeps track of its managed nodes using an [inventory file](http://docs.ansible.com/ansible/intro_inventory.html) located in `/etc/ansible/hosts`. In the inventory file, you can group your managed nodes and use these groups to target specific hosts that make up your infrastructure. Ansible can use multiple inventory sources, like other inventory files and dynamic inventory pulled using an inventory plugin or script. If your Ansible managed infrastructure will change over time, it is recommended to use the dynamic inventory plugin for Linode. You can read the [How to use the Linode Ansible Module to Deploy Linodes](/docs/guides/deploy-linodes-using-ansible/) to learn how to manage Linodes.

Following the example below, you will add your three Linodes to the `/etc/ansible/hosts` inventory file in two separate groups. The nodes can be listed using a name that can be resolved by DNS or an IP address.

1. Add your nodes to the default inventory file. Replace `203.0.113.0` and `203.0.113.1` with the public IP address or domain name of each of your nodes.

    {{< file "/etc/ansible/hosts" ini >}}
[nginx]
203.0.113.0

[wordpress]
203.0.113.1
    {{< /file >}}

    Each bracketed label denotes an Ansible [group](http://docs.ansible.com/ansible/latest/intro_inventory.html#hosts-and-groups). Grouping your nodes by function will make it easier to run commands against the correct set of nodes.

    {{< note >}}
The `/etc/ansible` directory will not exist by default in some environments. If you find that this is the case, create it manually with the following command:

    mkdir /etc/ansible/

If you are using a non-standard SSH port on your nodes, include the port after a colon on the same line within your hosts file (`203.0.113.1:2222`).
    {{< /note >}}

## Connect to your Managed Nodes

After configuring your control node, you can communicate with your managed nodes and begin configuring them as needed. In this section, you will test the connection with your Ansible managed hosts using the ping module. The ping module returns a "pong" response when a control node successfully reaches a node. Pinging your hosts will verify your connection and that the control node can execute Python on the hosts.

1.  Use the `all` directive to ping all servers in your inventory. By default, Ansible will use your local user account's name to connect to your nodes via SSH. You can override the default behavior by passing the `-u` option, plus the desired username. Since there are no standard user accounts on the nodes, in the example, you run the command as the root user.

        ansible all -u root -m ping

    You should receive a similar output:

    {{< output >}}
192.0.2.0 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
192.0.2.1 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
    {{< /output >}}

2.  Repeat the command, targeting only the nodes in the `[nginx]` group that you defined in your [inventory file](#create-an-ansible-inventory).

        ansible nginx -u root -m ping

    This time, only `node-1` should respond.

## Next Steps

1. Now that you've installed and configured Ansible, you can begin to use Playbooks to manage your Linodes' configurations. Our [Automate Server Configuration with Ansible Playbooks](/docs/guides/running-ansible-playbooks/) guide will demonstrate a basic web server set up using an Ansible Playbook.

1. You can also reference a number of [example playbooks](https://github.com/ansible/ansible-examples) on Ansible's GitHub account to a see a variety of implementations.

1. Consult the links below to learn several more advanced concepts related to writing Playbooks:

    * [Users, and Switching Users](http://docs.ansible.com/ansible/playbooks_intro.html#hosts-and-users) and [Privilege Escalation](http://docs.ansible.com/ansible/become.html)
    * [Handlers: Running Operations On Change](http://docs.ansible.com/ansible/playbooks_intro.html#handlers-running-operations-on-change)
    * [Roles](http://docs.ansible.com/ansible/playbooks_roles.html)
    * [Variables](http://docs.ansible.com/ansible/playbooks_variables.html)
    * [Playbook Best Practices](http://docs.ansible.com/ansible/playbooks_best_practices.html)

### Delete Your Linodes

If you no longer wish to use the Linodes created in this guide, you can delete them using the [Linode Cloud Manager](https://cloud.linode.com/linodes). To learn how to remove Linode resources using Ansible's Linode module, see the [Delete Your Resources](/docs/guides/deploy-linodes-using-ansible/#delete-your-resources) section of the [How to use the Linode Ansible Module to Deploy Linodes](/docs/guides/deploy-linodes-using-ansible/) guide.
