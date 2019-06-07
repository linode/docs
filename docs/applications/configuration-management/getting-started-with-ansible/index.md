---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Ansible is an automation tool for server configuration, provisioning, and management. This guide shows how to use Ansible to perform basic configuration tasks on your Linodes as well as set up a simple web server.'
og_description: 'Ansible is an automation tool for server configuration, provisioning, and management. This guide shows how to use Ansible to perform basic configuration tasks on your Linodes as well as set up a simple web server.'
keywords: ["ansible", "ansible configuration", "ansible provisioning", "ansible infrastructure", "ansible automation", "ansible configuration change management", "ansible server automation"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['applications/ansible/getting-started-with-ansible/','applications/configuration-management/getting-started-with-ansible/']
published: 2015-09-08
modified: 2018-03-21
modified_by:
    name: Jared Kobos
title: 'Getting Started With Ansible - Basic Installation and Setup'
contributor:
    name: Joshua Lyman
    link: https://twitter.com/jlyman
external_resources:
 - '[Ansible Home Page](http://www.ansible.com/home)'
 - '[Ansible Documentation](http://docs.ansible.com/ansible/index.html)'
 - '[Example Playbooks (GitHub)](https://github.com/ansible/ansible-examples)'
---

![Automatically Configure Servers with Ansible and Playbooks](automatically-configure-servers-with-ansible-title.jpg "Automatically Configure Servers with Ansible and Playbooks")

## What is Ansible?

[Ansible](http://www.ansible.com/home) is an automation tool for server provisioning, configuration, and management. It allows you to organize your server inventory into groups, describe how those groups should be configured or what actions should be taken on them, and issue all of these commands from a central location.

This guide introduces the basics of installing Ansible and preparing your environment to use [Playbooks](https://docs.ansible.com/ansible/latest/user_guide/playbooks.html).

## Before You Begin

All Ansible commands are run from a **control machine**, which can be either a local computer or a Linode. This will likely be your laptop or other computer from which you frequently access your server, or it may be a centralized server in more complicated setups.

Make sure that you have Python 2 (versions 2.6 or 2.7) or Python 3 (versions 3.5 and higher) available on the control machine. Note that Windows is not supported as the control machine. You can [build Ansible from source](https://github.com/ansible/ansible), or install the latest stable packages using the proper command below. Ansible uses SSH to execute commands remotely on **nodes**.

This guide will use a control machine with three Linodes serving as nodes though this number can be reduced or increased as needed. These nodes will be referred to as `node-1`, `node-2`, and `node-3` throughout the guide. Before proceeding with this guide, create these three Linodes using the Linode Manager and deploy an appropriate image to each one. Since Ansible uses SSH, you will need to make sure that your control machine has SSH access to all of the nodes.

1.  Create an SSH key on the control machine. This will create a public/private key pair: `~/home/.ssh/id_rsa.pub` and `~/home/.ssh/is_rsa`:

        ssh-keygen -t rsa -b 4096

2.  Copy the key to `node-1`:

        ssh-copy-id root@$node-1-ip

    Repeat this procedure for each remaining node.

{{< note >}}
The examples in this guide are for a multiple-Linode configuration. Most commands can also be performed with a single node for testing purposes. Please adjust accordingly.
{{< /note >}}

## Install Ansible

The remainder of the commands in this guide should be performed from the control machine.

### MacOS

    sudo easy_install pip
    sudo pip install ansible

### CentOS/Fedora

    sudo yum install ansible

{{< note >}}
The EPEL-Release repository may need to be added on certain versions of CentOS, RHEL, and Scientific Linux.
{{< /note >}}

### Ubuntu/Debian

    sudo apt-get update && sudo apt-get upgrade
    sudo apt-get install ansible

{{< note >}}
Ubuntu requires that all nodes have a compatible version of Python installed. In the latest version of Ubuntu, you can install python on each node with the following command:

    sudo apt-get install python

If you want to create nodes that have this installed automatically, you can use the playbook referenced in `<<<<<<<<<<<<<Leslie's Ansible Linode Module guide>>>>>>>>>>>>>>>>`
{{< /note >}}



### Install and Set Up Miniconda

With Miniconda, it's possible to create a virtualized environment for Ansible which can help to streamline the installation process for most Distros and environments that require multiple versions of Python.

1. Download and install Miniconda:

        curl -OL https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh
        bash Miniconda3-latest-Linux-x86_64.sh

1. You will be prompted several times during the installation process. Review the terms and conditions and select “yes” for each prompt.

1. Restart your shell session for the changes to your PATH to take effect.

1. Check your Python version:

        python --version



5. Create a new virtual environment for Ansible:

        conda create -n ansible-dev python=3

1.  Activate the new environment:

        source activate ansible-dev

1.  Install Ansible:

        pip install ansible

    Ansible can also be installed using a package manager such as `apt` on Debian/Ubuntu and [Homebrew](https://brew.sh) on OSX.

1.  Verify that the corresponding Python path is correct:

        ansible --version

## Configure Ansible

### Add Your Nodes to Your Inventory File to Track Nodes

Ansible keeps track of its nodes using an [inventory file](http://docs.ansible.com/ansible/intro_inventory.html), which contains the IP address or domain name of nodes you'll be applying your configurations to:

Add your nodes to the default inventory file. Replace `$node-1-ip`,`$node-2-ip`, and `$node-3-ip` with the public IP address or domain name of each of your nodes:

{{< file "/etc/ansible/hosts" ini >}}
[nginx]
$node-1-ip
$node-2-ip

[linode]
$node-3-ip
{{< /file >}}

Each bracketed label denotes an Ansible [group](http://docs.ansible.com/ansible/latest/intro_inventory.html#hosts-and-groups). Grouping your nodes by function will make it easier to run commands against the correct set of nodes.

{{< note >}}
The `/etc/ansible` directory will not exist by default in some environments. If you find that this is the case, you should create it manually with the following command:

    mkdir /etc/ansible/

If you are using a non-standard SSH port on your nodes, include the port after a colon on the same line within your hosts file (`myserver.com:2222`).
{{< /note >}}

### Test Inventory Groups

1.  Use the `all` directive to ping all servers in your inventory:

        ansible all -u root -m ping

    {{< note >}}
If you don't want to use SSH keys, you can add the `--ask-pass` switch, however this is not recommended.
{{< /note >}}

    {{< output >}}
192.0.2.0 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
192.0.2.1 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
192.0.2.2 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
{{< /output >}}

    The `-u` option is used here to run the command as root, since currently there are no standard user accounts on the nodes. By default Ansible will use the same username as your current machine’s username to attempt to connect via SSH into your nodes. If this will not match up, pass the proper username in using the `-u` username argument and replacing "root" with the username of the Linodes.



2.  Repeat the command, targeting only the nodes in the `[nginx]` group:

        ansible nginx -u root -m ping

    This time, only `node-1` and `node-2` should respond.

## Next Steps

Now that we've completed the installation of Ansible, we can be begin to use Playbooks to quickly and easily manage configurations of your Linodes on a larger scale. Our [Ansible Playbooks Guide](/docs/applications/configuration-management/running-ansible-playbooks/) will begin to teach you how to apply these playbooks to your configurations.

More complicated playbooks will require working with more advanced concepts. Ansible provides a number of [example playbooks](https://github.com/ansible/ansible-examples) on GitHub. In addition, documentation is available for many of the important concepts for writing playbooks:

* [Users, and Switching Users](http://docs.ansible.com/ansible/playbooks_intro.html#hosts-and-users) and [Privilege Escalation](http://docs.ansible.com/ansible/become.html)
* [Handlers: Running Operations On Change](http://docs.ansible.com/ansible/playbooks_intro.html#handlers-running-operations-on-change)
* [Roles](http://docs.ansible.com/ansible/playbooks_roles.html)
* [Variables](http://docs.ansible.com/ansible/playbooks_variables.html)
* [Playbook Best Practices](http://docs.ansible.com/ansible/playbooks_best_practices.html)

