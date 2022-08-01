---
slug: deploy-linodes-using-linode-ansible-collection
author:
  name: Linode Community
  email: docs@linode.com
description: "The Linode Ansible collection provides plugins for managing Linode services with Ansible. This guide shows how to install and use the Linode Ansible collection."
keywords: ['ansible','Linode Ansible Collection','dynamic inventory','configuration management']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-07-14
modified: 2022-07-14
modified_by:
  name: Linode
title: "How to Use the Linode Ansible Collection to Deploy a Linode"
h1_title: "Using the Linode Ansible Collection to Deploy a Linode"
enable_h1: true
contributor:
  name: Linode
aliases: ['/guides/deploy-linodes-using-linode-collection/']
external_resources:
- '[Ansible Collections](https://github.com/ansible-collections/overview)'
- '[The Linode Ansible collection](https://github.com/linode/ansible_linode)'
- '[Ansible Galaxy](https://galaxy.ansible.com/linode/cloud)'
- '[Ansible Best Practices](https://docs.ansible.com/ansible/latest/user_guide/playbooks_best_practices.html)'
tags: ["automation"]
---

Ansible is a popular open-source Infrastructure as Code (IaC) tool that can be used to complete common IT tasks like cloud provisioning and configuration management across a wide array of infrastructure components. Commonly seen as a solution to multi-cloud configurations, automation, and continuous delivery issues, Ansible is considered by many to be an industry standard in the modern cloud landscape.

[Ansible Collections](https://github.com/ansible-collections/overview) are the latest standard for managing Ansible content, empowering users to install roles, modules, and plugins with less developer and administrative overhead than ever before. [The Linode Ansible collection](https://github.com/linode/ansible_linode) provides the basic plugins needed to get started using Linode services with Ansible right away.

This guide shows how to:

-  [Install the Linode Ansible collection](#install-the-linode-ansible-collection) using Ansible's public repository for community projects

-  [Configure Ansible and encrypt sensitive information with Ansible Vault](#configure-ansible)

-  [Understand Ansible Fully Qualified Collection Namespaces](#understanding-fully-qualified-collection-namespaces)

-  [Deploy a Linode instance](#deploy-a-linode-with-the-linode-ansible-collection) using Ansible and the Linode Ansible collection.

{{< caution >}}
This guide’s example instructions create a [1GB Linode](https://www.linode.com/pricing/#compute-shared) (Nanode) billable resource on your Linode account. If you do not want to keep using the Linode that you create, be sure to delete the Linode when you have finished the guide.

If you remove the resource, [you are only be billed for the hour(s) that the resources were present on your account](/docs/guides/understanding-billing-and-payments/).
{{</ caution >}}

## Before You Begin

{{< note >}}
The steps outlined in this guide require [Ansible version 2.9.10 or greater](https://github.com/ansible/ansible/releases/tag/v2.9.10) and were tested on a Linode running Ubuntu 22.04. The instructions can be adapted to other Linux distributions or operating systems.
{{</ note >}}

1.  Provision a server that acts as the Ansible [*control node*](/docs/guides/getting-started-with-ansible/#what-is-ansible), from which other compute instances are deployed. Follow the instructions in our [Creating a Compute Instance](https://www.linode.com/docs/guides/creating-a-compute-instance/) guide to create a Linode running Ubuntu 22.04. A shared CPU 1GB Nanode is suitable. You can also use an existing workstation or laptop if you prefer.

1.  Add a limited Linux user to your control node Linode by following the [Add a Limited User Account](/docs/guides/set-up-and-secure/#add-a-limited-user-account) section of our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide. Ensure that all commands for the rest of this guide are entered as your limited user.

1.  Ensure that you have performed system updates:

        sudo apt update && sudo apt upgrade

1.  Install Ansible on your control node. Follow the steps in the [Install Ansible](/docs/guides/getting-started-with-ansible/#install-ansible) section of the [Getting Started With Ansible - Basic Installation and Setup](/docs/guides/getting-started-with-ansible/) guide.

1.  Ensure you have Python version 2.7 or higher installed on your control node. Issue the following command to check your system's Python version:

        python --version

    Many operating systems, including Ubuntu 22.04, instead have Python 3 installed by default. The Python 3 interpreter can usually be invoked with the `python3` command, and the remainder of this guide assumes Python 3 is installed and used. For example, you can run this command to check your Python 3 version:

        python3 --version

1.  Install the pip package manager:

        sudo apt install python3-pip

1.  Generate a Linode API v4 access token with permission to read and write Linodes and record it in a password manager or other safe location. Follow the [Get an Access Token](/docs/guides/getting-started-with-the-linode-api/#get-an-access-token) section of the [Getting Started with the Linode API](/docs/guides/getting-started-with-the-linode-api/) guide.

## Install the Linode Ansible Collection

The Linode Ansible collection is currently open-source and hosted on both a [public Github repository](https://github.com/linode/ansible_linode) and on [Ansible Galaxy](https://galaxy.ansible.com/linode/cloud). Ansible Galaxy is Ansible's own community-focused repository, providing information on and access to a wide array of [Ansible collections](https://docs.ansible.com/ansible/latest/galaxy/user_guide.html#finding-collections-on-galaxy) and [Ansible roles](https://docs.ansible.com/ansible/latest/user_guide/playbooks_reuse_roles.html). Ansible Galaxy support is built into the latest versions of Ansible by default. While users can install the Linode Ansible collection [from source](https://docs.ansible.com/ansible/latest/galaxy/user_guide.html#installing-a-collection-from-source-files) or by [using git](https://docs.ansible.com/ansible/latest/galaxy/user_guide.html#installing-a-collection-from-a-git-repository), these steps show how to use Ansible Galaxy:


1.  Install required dependencies for Ansible:

        sudo -H pip3 install -Iv 'resolvelib<0.6.0'

1.  Download the latest version of the Linode Ansible collection using the `ansible-galaxy` command:

        ansible-galaxy collection install linode.cloud

    Once the collection is installed, all configuration files are stored in the default `~/.ansible/collections/ansible_collections/` collections folder.

1.  Install the Python module dependencies required for the Linode Ansible collection. The Linode collection's installation directory contains a `requirements.txt` file that lists the Python dependencies, including the official [Python library for the Linode API v4](https://github.com/linode/linode_api4-python). Use pip to install these dependencies:

        sudo pip3 install -r .ansible/collections/ansible_collections/linode/cloud/requirements.txt

The Linode Ansible collection is now installed and ready to deploy and manage Linode services.

## Configure Ansible

When interfacing with the Linode Ansible collection, it is generally good practice to use variables to securely store sensitive strings like API tokens. This section shows how to securely store and access the [Linode API Access token](https://www.linode.com/docs/products/tools/linode-api/guides/get-access-token/) (generated in the [Before You Begin](#before-you-begin) section) along with a root password that is assigned to new Linode instances. Both of these are encrypted with [Ansible Vault](https://docs.ansible.com/ansible/latest/user_guide/vault.html).

### Create an Ansible Vault Password File

1.  From the control node's home directory, create a development directory to hold user-generated Ansible files. Then navigate to this new directory:

        mkdir development && cd development

1.  In the `development` directory, create a new empty text file called `.vault-pass` (with no file extension). Then generate a unique, complex new password (for example, by using a password manager), copy it into the new file, and save it. This password is used to encrypt and decrypt information stored with Ansible Vault:

    {{< file "~/development/.vault-pass" >}}
<PasteYourAnsibleVaultPasswordHere>
{{< /file >}}

    This is an Ansible Vault *password file*. A password file provides your Vault password to Ansible Vault's encryption commands. Ansible Vault also offers other options for password management. To learn more about password management, read Ansible's [Providing Vault Passwords](https://docs.ansible.com/ansible/latest/user_guide/vault.html#providing-vault-passwords) documentation.

1.  Set permissions on the file so that only your user can read and write to it:

        chmod 600 .vault-pass

    {{< caution >}}
Do not check this file into version control. If this file is located in a Git repository, add it to your [.gitignore file](https://git-scm.com/docs/gitignore).
{{< /caution >}}

### Create an Ansible Configuration File

Create an Ansible configuration file called `ansible.cfg` with a text editor of your choice. Copy this snippet into the file:

{{< file "~/development/ansible.cfg">}}
[defaults]
VAULT_PASSWORD_FILE = ./vault-pass
{{< /file >}}

These lines specify the location of your password file.

### Encrypt Variables with Ansible Vault

1.  Create a directory to store variable files used with your [Ansible playbooks](/docs/guides/getting-started-with-ansible/#what-is-ansible):

        mkdir -p ~/development/group_vars/

1.  Make a new empty text file called `vars.yml` in this directory. In the next steps, your encrypted API token and root password are stored in this file:

        touch ~/development/group_vars/vars.yml

1.  Generate a unique, complex new password (for example, by using a password manager) that should be used as the root password for new compute instances created with the Linode Ansible collection. This should be different from the Ansible Vault password specified in the `.vault-pass` file.

1. Use the following `ansible-vault encrypt_string` command to encrypt the new root password, replacing `MySecureRootPassword` with your password. Because this command is run from inside your `~/development` directory, the Ansible Vault password in your `.vault-pass` file is used to perform the encryption:

        ansible-vault encrypt_string 'MySecureRootPassword' --name 'password' | tee -a group_vars/vars.yml

    In the above command, `tee -a group_vars/vars.yml` appends the encrypted string to your `vars.yml` file. Once completed, output similar to the following appears:

    {{< output >}}
password: !vault |
    $ANSIBLE_VAULT;1.1;AES256
    30376134633639613832373335313062366536313334316465303462656664333064373933393831
    3432313261613532346134633761316363363535326333360a626431376265373133653535373238
    38323166666665376366663964343830633462623537623065356364343831316439396462343935
    6233646239363434380a383433643763373066633535366137346638613261353064353466303734
    3833
{{< /output >}}

1.  Run the following command to add a newline at the end of your `vars.yml` file:

        echo "" >> group_vars/vars.yml

1.  Use the following `ansible-vault encrypt_string` command to encrypt your Linode API token and append it to your `vars.yml` file, replacing `MyAPIToken` with your own access token:

        ansible-vault encrypt_string 'MyAPIToken' --name 'api-token' | tee -a group_vars/vars.yml

1.  Run the following command to add another newline at the end of your `vars.yml` file:

        echo "" >> group_vars/vars.yml

    Your `vars.yml` file should now resemble:

    {{< file "~/development/group_vars/vars.yml">}}
password: !vault |
          $ANSIBLE_VAULT;1.1;AES256
          30376134633639613832373335313062366536313334316465303462656664333064373933393831
          3432313261613532346134633761316363363535326333360a626431376265373133653535373238
          38323166666665376366663964343830633462623537623065356364343831316439396462343935
          6233646239363434380a383433643763373066633535366137346638613261353064353466303734
          3833
token: !vault |
          $ANSIBLE_VAULT;1.1;AES256
          65363565316233613963653465613661316134333164623962643834383632646439306566623061
          3938393939373039373135663239633162336530373738300a316661373731623538306164363434
          31656434356431353734666633656534343237333662613036653137396235353833313430626534
          3330323437653835660a303865636365303532373864613632323930343265343665393432326231
          61313635653463333630636631336539643430326662373137303166303739616262643338373834
          34613532353031333731336339396233623533326130376431346462633832353432316163373833
          35316333626530643736636332323161353139306533633961376432623161626132353933373661
          36663135323664663130
{{< /file >}}

## Understanding Fully Qualified Collection Namespaces

Ansible is now configured and the Linode Ansible collection is installed. You can create [playbooks](https://www.linode.com/docs/guides/running-ansible-playbooks/#playbook-basics) to leverage the collection and create compute instances and other Linode resources.

Within playbooks, the Linode Ansible collection is further divided by resource types through the [Fully Qualified Collection Name](https://github.com/ansible-collections/overview#terminology)(FQCN) affiliated with the desired resource. These names serve as identifiers that help Ansible to more easily and authoritatively delineate between modules and plugins within a collection.

### Modules

Below is a table of all FQCNs currently included with the Linode Ansible collection and a short overview of their purpose:

Name | Description
--- | ---
[linode.cloud.domain](https://github.com/linode/ansible_linode/blob/main/docs/modules/domain.md)|Create and destroy domains.
[linode.cloud.domain_info](https://github.com/linode/ansible_linode/blob/main/docs/modules/domain_info.md)|Gather info about an existing domain.
[linode.cloud.domain_record](https://github.com/linode/ansible_linode/blob/main/docs/modules/domain_record.md)|Create and destroy domain records.
[linode.cloud.domain_record_info](https://github.com/linode/ansible_linode/blob/main/docs/modules/domain_record_info.md)|Gather info about an existing domain record.
[linode.cloud.firewall](https://github.com/linode/ansible_linode/blob/main/docs/modules/firewall.md)|Create and destroy Firewalls.
[linode.cloud.firewall_info](https://github.com/linode/ansible_linode/blob/main/docs/modules/firewall_info.md)|Gather info about an existing Firewall.
[linode.cloud.firewall_device](https://github.com/linode/ansible_linode/blob/main/docs/modules/firewall_device.md)|Manage Firewall Devices.
[linode.cloud.instance](https://github.com/linode/ansible_linode/blob/main/docs/modules/instance.md)|Create and destroy Linodes.
[linode.cloud.instance_info](https://github.com/linode/ansible_linode/blob/main/docs/modules/instance_info.md)|Gather info about an existing Linode instance.
[linode.cloud.lke_cluster](https://github.com/linode/ansible_linode/blob/main/docs/modules/lke_cluster.md)|Manage LKE clusters.
[linode.cloud.lke_cluster_info](https://github.com/linode/ansible_linode/blob/main/docs/modules/lke_cluster_info.md)|Gather info about an existing LKE cluster.
[linode.cloud.nodebalancer](https://github.com/linode/ansible_linode/blob/main/docs/modules/nodebalancer.md)|Create, destroy, and configure NodeBalancers.
[linode.cloud.nodebalancer_info](https://github.com/linode/ansible_linode/blob/main/docs/modules/nodebalancer_info.md)|Gather info about an existing NodeBalancer.
[linode.cloud.nodebalancer_node](https://github.com/linode/ansible_linode/blob/main/docs/modules/nodebalancer_node.md)|Manage NodeBalancer nodes.
[linode.cloud.object_cluster_info](https://github.com/linode/ansible_linode/blob/main/docs/modules/object_cluster_info.md)|Gather info about Object Storage clusters.
[linode.cloud.object_keys](https://github.com/linode/ansible_linode/blob/main/docs/modules/object_keys.md)|Create and destroy Object Storage keys.
[linode.cloud.vlan_info](https://github.com/linode/ansible_linode/blob/main/docs/modules/vlan_info.md)|Gather info about an existing Linode VLAN.
[linode.cloud.volume](https://github.com/linode/ansible_linode/blob/main/docs/modules/volume.md)|Create, destroy, and attach Linode volumes.
[linode.cloud.volume_info](https://github.com/linode/ansible_linode/blob/main/docs/modules/volume_info.md)|Gather info about an existing Linode volume.

The links in the table above correspond to the GitHub pages for each FQCN. These pages contain a list of all available configuration options for the resource the module applies to. A full dynamically updated list of all resources can be found in the [Linode Ansible Collections Github Repo](https://github.com/linode/ansible_linode).

### Inventory Plugins

Name | Description
--- | ---
[linode.cloud.instance](https://github.com/linode/ansible_linode/blob/main/docs/inventory/instance.rst)|Reads instance inventories from Linode.

## Deploy a Linode with the Linode Ansible Collection

This section shows how to write a playbook that leverages the Linode Ansible collection and your encrypted API token and root password to create a new Linode instance:

1.  Create a playbook file called `deploylinode.yml` in your `~/development` directory. Copy this snippet into the file and save it:

    {{< file "~/development/deploylinode.yml">}}
- name: Create Linode Instance
  hosts: localhost
  vars_files:
      - ./group_vars/vars.yml
  tasks:
    - name: Create a Linode instance
      linode.cloud.instance:
        api_token: "{{ api_token }}"
        label: my-ansible-linode
        type: g6-nanode-1
        region: us-east
        image: linode/ubuntu22.04
        root_pass: "{{ password }}"
        state: present
{{< /file >}}

    -   The playbook contains the `Create Linode Instance` play. When run, the control node receives the necessary instructions from Ansible and uses the Linode API to deploy infrastructure as needed.

    -   The `vars_files` key provides the location of the variable file or files used to populate information related to tasks for the play.

    -   The task in the playbook is defined by the `name`, which serves as a label, and the FQCN used to configure the resource, in this case a Linode compute instance.

    -   The configuration options associated with the FQCN are defined. The configuration options for each FQCN are unique to the resource.

        For options where secure strings are used, the encrypted variables in the `./group_vars/vars.yml` file are inserted. This includes the API token and root password.

1.  Once the playbook is saved, enter the following command to run it and create a Linode Nanode instance. Because this command is run from inside your `~/development` directory, the Ansible Vault password in your `.vault-pass` file is used by the playbook to decrypt the variables:

        ansible-playbook deploylinode.yml

    Once completed, output similar to the following appears:

    {{< output >}}
PLAY [Create Linode] *********************************************************************

TASK [Gathering Facts] *******************************************************************
ok: [localhost]

TASK [Create a new Linode.] **************************************************************
changed: [localhost]

PLAY RECAP *******************************************************************************
localhost                  : ok=3    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
{{< /output >}}
