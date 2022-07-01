---
slug: deploy-linodes-using-linode-collection
author:
  name: Linode Community
  email: docs@linode.com
description: "In this guide, learn how to deploy and manage Linode Services using Ansible and Linode's Ansible Collection."
keywords: ['ansible','Linode Collection','dynamic inventory','configuration management']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-17-07
modified: 2022-17-07
modified_by:
  name: Linode
title: "How to use the Linode Ansible Collection to Deploy Linode Services"
h1_title: "Using the Linode Ansible Collection to Deploy Linode Services"
enable_h1: true
contributor:
  name: Linode
external_resources:
- '[Ansible Best Practices](https://docs.ansible.com/ansible/latest/user_guide/playbooks_best_practices.html)'
tags: ["automation"]
---

Ansible is a popular open-source Infrastructure as Code(Iac) tool that can be used to complete common IT tasks like cloud provisioning and configuration management across a wide array of different sets of infrastructure. Commonly seen as a solution to multi-cloud configurations, automation, and continuous delivery issues, Ansible is considered by many to be an industry standard in the modern Cloud Landscape.

[Ansible Collections](https://github.com/ansible-collections/overview) are the latest standard for managing Ansible content on Ansible, generally empowering users to install needed roles, modules, and plugins with less developer and administrative overhead than ever before. [The Linode Ansible Collection](https://github.com/linode/ansible_linode) is no exception, and provides the basic plugins needed to get started using Linode services on Ansible right away.

In this guide you will learn how to:

* Deploy and manage Linode services using Ansible and the Linode Ansible Collection.
* Install the Linode Ansible Collection using Ansible's public repository for community projects.

{{< caution >}}
This guide’s example instructions will create a [1GB Linode](https://www.linode.com/pricing) (Nanode) billable resource on your Linode account. If you do not want to keep using the Linode that you create, be sure to [delete the resource](#delete-your-resources) when you have finished the guide.

If you remove the resource afterward, you will only be billed for the hour(s) that the resources were present on your account.
{{</ caution >}}

## Before You Begin

{{< note >}}
The steps outlined in this guide require [Ansible version 2.9.10 or greater](https://github.com/ansible/ansible/releases/tag/v2.9.10), and were created using Ubuntu 22.04.
{{</ note >}}

-   Add a limited user to your Linode following the steps below, created by following the [Add a limited User Account](/docs/guides/set-up-and-secure/#add-a-limited-user-account) section of our  [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide. Ensure that all commands are entered as your limited user.

- Ensure that you have performed system updates with the following command:

        apt update && apt upgrade

-   Install Ansible on your computer. Use the steps in the [Control Node Setup](/docs/guides/getting-started-with-ansible/#set-up-the-control-node) section of the [Getting Started With Ansible - Basic Installation and Setup](/docs/guides/getting-started-with-ansible/) guide.

-   Ensure you have Python version 2.7 or higher installed on your computer. Issue the following command to check your system's Python version:

        python --version

-   Install the official [Python library for the Linode API v4](https://github.com/linode/linode_api4-python).

        sudo apt-get install python-pip

-   Generate a Linode API v4 access token with permission to read and write Linodes. You can follow the [Get an Access Token](/docs/guides/getting-started-with-the-linode-api/#get-an-access-token) section of the [Getting Started with the Linode API](/docs/guides/getting-started-with-the-linode-api/) guide if you do not already have one.

- [Create an authentication Key-pair](/docs/guides/set-up-and-secure/#create-an-authentication-key-pair) if your computer does not already have one.

## Install the Linode Ansible Collection

The Linode Ansible Collection is currently open-source and hosted on both a [Public Github Repository](https://github.com/linode/ansible_linode) and [Ansible Galaxy](https://galaxy.ansible.com/linode/cloud). Ansible Galaxy is Ansible's own community focused repository, providing information on and access to a [wide array of Ansible collections](https://docs.ansible.com/ansible/latest/galaxy/user_guide.html#finding-collections-on-galaxy) and [Ansible Roles](). Ansible Galaxy additionally comes with support built into the latest versions of Ansible by default. While users can install the Linode Ansible Collection [from source](https://docs.ansible.com/ansible/latest/galaxy/user_guide.html#installing-a-collection-from-source-files) or by [using git](https://docs.ansible.com/ansible/latest/galaxy/user_guide.html#installing-a-collection-from-a-git-repository), the steps in this section of the guide will focus on using Ansible Galaxy:

1. Install any required dependencies for ansible:

        sudo -H pip install -Iv 'resolvelib<0.6.0'

1. Download the latest version of the Linode Ansible Collection using the `ansible-galaxy` command:

        sudo ansible-galaxy collection install linode.cloud

    Once the collection is installed, all configuration files will stored in the default collections folder, within the following path `~/.ansible/collections/ansible_collections/`.

1.  Install the python module dependencies required for the Linode Ansible collection using pip against the `requirements.txt` file stored within the Linode collection's installation directory:

        pip install -r ~/.ansible/collections/ansible_collections/linode/cloud/requirements.txt

The Linode Ansible Collection will now be installed and ready to use to deploy and Manage Linode services.

## Configuring Ansible

While there are many ways to leverage the Linode Ansible Collection, it is generally a good practice to use variables to securely store sensitive strings called upon later in playbooks. As the Linode collection is powered by the [Linode APIv4](https://www.linode.com/docs/api/) and deploying infrastructure generally requires the use of Secure Passwords, these variables will include the [Linode API Access token](https://www.linode.com/docs/products/tools/linode-api/guides/get-access-token/) generated in an earlier step, and a password,both encrypted at rest with [Ansible Vault](https://docs.ansible.com/ansible/latest/user_guide/vault.html).

### Creating the Ansible Configuration File

Create a configuration file for Ansible that will contain the path to a file that will handle secure access to Ansible Vault.

1. From the home directory, create a development directory to hold user configured Ansible related files, then navigate to this new directory:

        mkdir development && cd development

1. Create an Ansible configuration file called `ansible.cfg` using a text editor of your choice and give it the following values:

{{< file "~/development/ansible.cfg">}}
    [defaults]
    VAULT_PASSWORD_FILE = ./vault-pass
{{< /file >}}

`VAULT_PASSWORD_FILE = ./vault-pass` is used to specify a Vault password file to use whenever Ansible Vault requires a password. Ansible Vault offers several options for password management. To learn more password management, read Ansible's [Providing Vault Passwords Documentation](https://docs.ansible.com/ansible/latest/user_guide/vault.html#providing-vault-passwords) documentation.

### Configuration Ansible Vault and Encrypting Variables

1. In keeping in line with best practices on Ansible, create a directory to store variable files which will contain data encrypted by Ansible Vault, in this case the `~/development/group_vars/example_group/` directory:

        mkdir -p ~/development/group_vars/example_group/

1. Decide on a secure Root Password for any infrastructure that will be deployed using the Linode Collection, then, use ansible-vault to encrypt the string with the following syntax, replacing `MySecureRootPassword` with your own strong and unique password:

        ansible-vault encrypt_string 'MySecureRootPassword' --name 'password'

    You will be asked to enter a secure vault password to decrypt the variable with later. Enter this password now.

   Once completed, you will see output similar to the following:

   {{< output >}}
password: !vault |
    $ANSIBLE_VAULT;1.1;AES256
    30376134633639613832373335313062366536313334316465303462656664333064373933393831
    3432313261613532346134633761316363363535326333360a626431376265373133653535373238
    38323166666665376366663964343830633462623537623065356364343831316439396462343935
    6233646239363434380a383433643763373066633535366137346638613261353064353466303734
    3833</br>
Encryption successful
{{< /output >}}

1. Copy the generated output to be used in a file to store variables. In this example configuration, the variable file will be  `~/development/group_vars/example_group/vars` file.

1. Encrypt the value of your [API access token](https://www.linode.com/docs/products/tools/linode-api/guides/get-access-token/). Replace the value of `86210...1e1c6bd` of the following syntax with your own access token:

        ansible-vault encrypt_string '86210...1e1c6bd' --name 'api-token'

    You will be asked to enter a secure vault password to decrypt the variable with later. Enter the same password you entered to encrypt the `password` file earlier.

1. Copy the generated output and append it to the bottom of your `vars` file, located in `~/development/ansible.cfg`. The final file should look similar to the following:

{{< file "~/development/vault-pass">}}
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

Now that Ansible is correctly configured with the Linode Ansible collection fully installed, [Playbooks](https://www.linode.com/docs/guides/running-ansible-playbooks/#playbook-basics) can be created to leverage the Collection and create actual Linode.

Within playbooks, the Linode Ansible collection is further divided by resource types through the [Fully Qualified Collection Name](https://github.com/ansible-collections/overview#terminology)(FQCN) affiliated with the desired resource. These Names serve as identifiers that help Ansible to more easily and authoritatively delineate between modules and plugins within a collection.

Below is a table of all FQCN's currently included with the Linode Ansible Collection and a short overview of their purpose:

### Modules
Name | Description
--- | ---
[linode.cloud.domain](https://github.com/linode/ansible_linode/blob/v0.7.1/docs/modules/domain.md)|Create and destroy domains.
[linode.cloud.domain_info](https://github.com/linode/ansible_linode/blob/v0.7.1/docs/modules/domain_info.md)|Gather info about an existing domain.
[linode.cloud.domain_record](https://github.com/linode/ansible_linode/blob/v0.7.1/docs/modules/domain_record.md)|Create and destroy domain records.
[linode.cloud.domain_record_info](https://github.com/linode/ansible_linode/blob/v0.7.1/docs/modules/domain_record_info.md)|Gather info about an existing domain record.
[linode.cloud.firewall](https://github.com/linode/ansible_linode/blob/v0.7.1/docs/modules/firewall.md)|Create and destroy Firewalls.
[linode.cloud.firewall_info](https://github.com/linode/ansible_linode/blob/v0.7.1/docs/modules/firewall_info.md)|Gather info about an existing Firewall.
[linode.cloud.firewall_device](https://github.com/linode/ansible_linode/blob/v0.7.1/docs/modules/firewall_device.md)|Manage Firewall Devices.
[linode.cloud.instance](https://github.com/linode/ansible_linode/blob/v0.7.1/docs/modules/instance.md)|Create and destroy Linodes.
[linode.cloud.instance_info](https://github.com/linode/ansible_linode/blob/v0.7.1/docs/modules/instance_info.md)|Gather info about an existing Linode instance.
[linode.cloud.lke_cluster](https://github.com/linode/ansible_linode/blob/v0.7.1/docs/modules/lke_cluster.md)|Manage LKE clusters.
[linode.cloud.lke_cluster_info](https://github.com/linode/ansible_linode/blob/v0.7.1/docs/modules/lke_cluster_info.md)|Gather info about an existing LKE cluster.
[linode.cloud.nodebalancer](https://github.com/linode/ansible_linode/blob/v0.7.1/docs/modules/nodebalancer.md)|Create, destroy, and configure NodeBalancers.
[linode.cloud.nodebalancer_info](https://github.com/linode/ansible_linode/blob/v0.7.1/docs/modules/nodebalancer_info.md)|Gather info about an existing NodeBalancer.
[linode.cloud.nodebalancer_node](https://github.com/linode/ansible_linode/blob/v0.7.1/docs/modules/nodebalancer_node.md)|Manage NodeBalancer nodes.
[linode.cloud.object_cluster_info](https://github.com/linode/ansible_linode/blob/v0.7.1/docs/modules/object_cluster_info.md)|Gather info about Object Storage clusters.
[linode.cloud.object_keys](https://github.com/linode/ansible_linode/blob/v0.7.1/docs/modules/object_keys.md)|Create and destroy Object Storage keys.
[linode.cloud.vlan_info](https://github.com/linode/ansible_linode/blob/v0.7.1/docs/modules/vlan_info.md)|Gather info about an existing Linode VLAN.
[linode.cloud.volume](https://github.com/linode/ansible_linode/blob/v0.7.1/docs/modules/volume.md)|Create, destroy, and attach Linode volumes.
[linode.cloud.volume_info](https://github.com/linode/ansible_linode/blob/v0.7.1/docs/modules/volume_info.md)|Gather info about an existing Linode volume.

In the table above, each module can be selected to navigate your web browser to the public github page for the FQCN, which contain a list of all available configuration options for the resource the Module applies to.

{{< note >}}
The links in the above table lead to the github repository for version `v0.7.1` of the Linode Ansible Collection. For the latest version of the listed modules, it is recommended that users navigate to the [home page of the public Github repository](https://github.com/linode/ansible_linode) for a directory containing the latest version.
{{< /note >}}

### Inventory Plugins
Name | Description
--- | ---
[linode.cloud.instance](https://github.com/linode/ansible_linode/blob/v0.7.1/docs/inventory/instance.rst)|Reads instance inventories from Linode.

{{< note >}}
The link in the above table lead to the Github repository version `v0.7.1` of the Linode Ansible Collection. For the latest version of all available Inventory Plugins, it is recommended that users navigate to the [home page of the public Github repository](https://github.com/linode/ansible_linode) for a directory containing the latest version.
{{< /note >}}

## Deploying a Linode with the Linode Ansible Collection

Creating a playbook using the Linode Ansible Collection requires bringing together all of the concepts and previous configuration settings otherwise explained or set within this guide:

1. Create a Playbook file called `deploylinode.yml` with the following contents within the `development` directory:

{{< file "~/development/deploylinode.yml">}}
- name: Create Linode Instance
  hosts: localhost
  vars_files:
      - ./group_vars/example_group/vars
  tasks:
    - name: Create a Linode instance
      linode.cloud.instance:
        api_token: "{{ token }}"
        label: my-ansible-linode
        type: g6-nanode-1
        region: us-east
        image: linode/ubuntu22.04
        root_pass: "{{ password }}"
        state: present
{{< /file >}}

  The Playbook contains the `Create Linode Instance` play, to be executed on the local system. In other words, the local instance will receive the necessary instructions from Ansible, and then use the Linode API to deploy infrastructure as needed. The `vars_files` key provides the location of the file or files that contain variables that will be used to help populate information related to tasks for the play. The task itself is then defined first by the `name:` which serves as a label, and the FQCN used to configure the resource, in this case a Linode instance using  the `linode.cloud.instance` FQCN. Finally, the configuration options tied to the FQCN are defined, and in cases where secure strings are utilized, the encrypted variables contained within the `./group_vars/example_group/vars` file are called and bound to their relevant options.

  The configuration options for each FQCN are unique to the resource and specific FQCN being called. A full dynamically updated list for each can be found on the [Linode Ansible Collections Github Repo](https://github.com/linode/ansible_linode).

1. Once the playbook is saved, enter the following command to run it and create a Linode Nanode instance:

        ansible-playbook --ask-vault-pass ~/development/deploylinode.yml

  Once prompted, enter the password used to encrypt your secure variables. Once completed, you will see a similar output:

  {{< output >}}
PLAY [Create Linode] *********************************************************************

TASK [Gathering Facts] *******************************************************************
ok: [localhost]

TASK [Create a new Linode.] **************************************************************
changed: [localhost]

PLAY RECAP *******************************************************************************
localhost                  : ok=3    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
{{< /output >}}


















