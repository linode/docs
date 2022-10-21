---
slug: deploy-linodes-using-ansible
author:
  name: Linode Community
  email: docs@linode.com
description: "In this guide, learn how to deploy and manage Linodes using Ansible and the linode_v4 module."
keywords: ['ansible','Linode module','dynamic inventory','configuration management']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-06-04
modified: 2021-12-30
modified_by:
  name: Linode
title: "How to use the Linode Ansible Module to Deploy Linodes"
h1_title: "Using the Linode Ansible Module to Deploy Linodes"
enable_h1: true
deprecated: true
deprecated_link: 'guides/deploy-linodes-using-linode-ansible-collection/'
contributor:
  name: Linode
external_resources:
- '[Ansible Best Practices](https://docs.ansible.com/ansible/latest/user_guide/playbooks_best_practices.html)'
aliases: ['/applications/configuration-management/ansible/deploy-linodes-using-ansible/','/applications/configuration-management/deploy-linodes-using-ansible/']
tags: ["automation"]
image: how-to-use-the-linode-ansible-module-to-deploy-linodes.png
---

{{< note >}}
This guide shows how to use the older *Linode Ansible module* to manage Linode infrastructure. This module is maintained by members of the Linode community. A newer *Linode Ansible collection* is now available which is maintained by the Linode development team.

The community-maintained module still functions, but using the Ansible collection is recommended. Review our [Using the Linode Ansible Collection to Deploy a Linode](/docs/guides/deploy-linodes-using-linode-ansible-collection/) guide for more information.
{{< /note >}}

Ansible is a popular open-source tool that can be used to automate common IT tasks, like cloud provisioning and configuration management. With [Ansible's 2.8 release](https://docs.ansible.com/ansible/latest/roadmap/ROADMAP_2_8.html), you can deploy Linode instances using our latest [API (v4)](https://developers.linode.com/api/v4/). Ansible's `linode_v4` module adds the functionality needed to deploy and manage Linodes via the command line or in your [Ansible Playbooks](/docs/guides/running-ansible-playbooks/). While the dynamic inventory plugin for Linode helps you source your Ansible inventory directly from the Linode API (v4).

In this guide you will learn how to:

* Deploy and manage Linodes using Ansible and the `linode_v4` module.
* Create an Ansible inventory for your Linode infrastructure using the dynamic inventory plugin for Linode.

{{< caution >}}
This guide’s example instructions will create a [1GB Linode](https://www.linode.com/pricing) (Nanode) billable resource on your Linode account. If you do not want to keep using the Linode that you create, be sure to [delete the resource](#delete-your-resources) when you have finished the guide.

If you remove the resource afterward, you will only be billed for the hour(s) that the resources were present on your account.
{{</ caution >}}

## Before You Begin

{{< note >}}
The steps outlined in this guide require [Ansible version 2.8](https://github.com/ansible/ansible/releases/tag/v2.8.0), and were created using Ubuntu 18.04.
{{</ note >}}

-   Add a limited user to your Linode following the steps below, created by following the [Add a limited User Account](/docs/guides/set-up-and-secure/#add-a-limited-user-account) section of our  [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide. Ensure that all commands are entered as your limited user.

-   Install Ansible on your computer. Use the steps in the [Control Node Setup](/docs/guides/getting-started-with-ansible/#set-up-the-control-node) section of the [Getting Started With Ansible - Basic Installation and Setup](/docs/guides/getting-started-with-ansible/) guide.

-   Ensure you have Python version 2.7 or higher installed on your computer. Issue the following command to check your system's Python version:

        python --version

-   Install the official [Python library for the Linode API v4](https://github.com/linode/linode_api4-python).

        sudo apt-get install python-pip
        sudo pip install linode_api4

-   Generate a Linode API v4 access token with permission to read and write Linodes. You can follow the [Get an Access Token](/docs/guides/getting-started-with-the-linode-api/#get-an-access-token) section of the [Getting Started with the Linode API](/docs/guides/getting-started-with-the-linode-api/) guide if you do not already have one.

- [Create an authentication Key-pair](/docs/guides/set-up-and-secure/#create-an-authentication-key-pair) if your computer does not already have one.

## Configure Ansible

The Ansible configuration file is used to adjust Ansible's default system settings. Ansible will search for a configuration file in the directories listed below, in the order specified, and apply the first configuration values it finds:

- `ANSIBLE_CONFIG` environment variable pointing to a configuration file location. If passed, it will override the default Ansible configuration file.
- `ansible.cfg` file in the current directory
- `~/.ansible.cfg` in the home directory
- `/etc/ansible/ansible.cfg`

In this section, you will create an Ansible configuration file and add options to disable host key checking, and to allow the Linode inventory plugin. The Ansible configuration file will be located in a development directory that you create, however, it could exist in any of the locations listed above. See [Ansible's official documentation](https://docs.ansible.com/ansible/latest/reference_appendices/config.html#common-options) for a full list of available configuration settings.

{{< caution >}}
When storing your Ansible configuration file, ensure that its corresponding directory does not have world-writable permissions. This could pose a security risk that allows malicious users to use Ansible to exploit your local system and remote infrastructure. At minimum, the directory should restrict access to particular users and groups. For example, you can create an `ansible` group, only add privileged users to the `ansible` group, and update the Ansible configuration file's directory to have `764` permissions. See the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide for more information on permissions.
{{</ caution >}}

1.  In your home directory, create a directory to hold all of your Ansible related files and move into the directory:

        mkdir development && cd development

1.  Create the Ansible configuration file, `ansible.cfg` in the `development` directory and add the `host_key_checking` and `enable_plugins` options.

      {{< file "~/development/ansible.cfg">}}
[defaults]
host_key_checking = False
VAULT_PASSWORD_FILE = ./vault-pass
[inventory]
enable_plugins = linode
{{</ file >}}

      - `host_key_checking = False` will allow Ansible to SSH into hosts without having to accept the remote server's host key. This will disable host key checking globally.
      - `VAULT_PASSWORD_FILE = ./vault-pass` is used to specify a Vault password file to use whenever Ansible Vault requires a password. Ansible Vault offers several options for password management. To learn more password management, read Ansible's [Providing Vault Passwords](https://docs.ansible.com/ansible/latest/user_guide/vault.html#providing-vault-passwords) documentation.
      - `enable_plugins = linode` enables the Linode dynamic inventory plugin.

## Create a Linode Instance

You can now begin creating Linode instances using Ansible. In this section, you will create an Ansible Playbook that can deploy Linodes.

### Create your Linode Playbook

1.  Ensure you are in the `development` directory that you created in the [Configure Ansible](/docs/guides/deploy-linodes-using-ansible/#create-a-linode-instance) section:

        cd ~/development

1. U sing your preferred text editor, create the `Create Linode` Playbook file and include the following values:

    {{< file "~/development/linode_create.yml" yaml >}}
- name: Create Linode
  hosts: localhost
  vars_files:
      - ./group_vars/example_group/vars
  tasks:
  - name: Create a new Linode.
    linode_v4:
      label: "{{ label }}{{ 100 |random }}"
      access_token: "{{ token }}"
      type: g6-nanode-1
      region: us-east
      image: linode/debian9
      root_pass: "{{ password }}"
      authorized_keys: "{{ ssh_keys }}"
      group: example_group
      tags: example_group
      state: present
    register: my_linode
{{</ file >}}

    - The Playbook `my_linode` contains the `Create Linode` play, which will be executed on `hosts: localhost`. This means the Ansible playbook will execute on the local system and use it as a vehicle to deploy the remote Linode instances.
    - The `vars_files` key provides the location of a local file that contains variable values to populate in the play. The value of any variables defined in the vars file will substitute any Jinja template variables used in the Playbook. Jinja template variables are any variables between curly brackets, like: `{{ my_var }}`.
    - The `Create a new Linode` task calls the `linode_v4` module and provides all required module parameters as arguments, plus additional arguments to configure the Linode's deployment. For details on each parameter, see the [linode_v4 Module Parameters](#linode-v4-module-parameters) section.

        {{< note >}}
  Usage of `groups` is deprecated, but still supported by Linode's API v4. The [Linode dynamic inventory module](#linode-dynamic-inventory-module) requires groups to generate an Ansible inventory and will be used later in this guide.
        {{</ note >}}

    - The`register` keyword defines a variable name, `my_linode` that will store `linode_v4` module return data. For instance, you could reference the `my_linode` variable later in your Playbook to complete other actions using data about your Linode. This keyword is not required to deploy a Linode instance, but represents a common way to declare and use variables in Ansible Playbooks. The task in the snippet below will use Ansible's [debug module](https://docs.ansible.com/ansible/2.4/debug_module.html) and the `my_linode` variable to print out a message with the Linode instance's ID and IPv4 address during Playbook execution.

        {{< file >}}
...
- name: Print info about my Linode instance
  debug:
    msg: "ID is {{ my_linode.instance.id }} IP is {{ my_linode.instance.ipv4 }}"
{{</ file >}}

### Create the Variables File

In the previous section, you created the *Create Linode Playbook* to deploy Linode instances and made use of Jinja template variables. In this section, you will create the variables file to provide values to those template variables.

1.  Create the directory to store your Playbook's variable files. The directory is structured to group your variable files by inventory group. This directory structure supports the use of file level encryption that Ansible Vault can detect and parse. Although it is not relevant to this guide's example, it will be used as a best practice.

        mkdir -p ~/development/group_vars/example_group/

1.  Create the variables file and populate it with the example variables. You can replace the values with your own.

    {{< file "~/development/group_vars/example_group/vars">}}
ssh_keys: >
        ['ssh-rsa AAAAB3N..5bYqyRaQ== user@mycomputer', '~/.ssh/id_rsa.pub']
label: simple-linode-
{{</ file >}}

    - The `ssh_keys` example passes a list of two public SSH keys. The first provides the string value of the key, while the second provides a local public key file location.

        {{< disclosure-note "Configure your SSH Agent" >}}
If your SSH Keys are passphrase-protected, you should add the keys to your SSH agent so that Ansible does not hang when running Playbooks on the remote Linode. The following instructions are for Linux systems:

1.  Run the following command; if you stored your private key in another location, update the path that’s passed to ssh-add accordingly:

        eval $(ssh-agent) && ssh-add ~/.ssh/id_rsa

    If you start a new terminal, you will need to run the commands in this step again before having access to the keys stored in your SSH agent.
        {{</ disclosure-note >}}

    - `label` provides a label prefix that will be concatenated with a random number. This occurs when the Create Linode Playbook's Jinja templating for the `label` argument is parsed (`label: "{{ label }}{{ 100 |random }}"`).

#### Encrypt Sensitive Variables with Ansible Vault

Ansible Vault allows you to encrypt sensitive data, like passwords or tokens, to keep them from being exposed in your Ansible Playbooks or Roles. You will take advantage of this functionality to keep your Linode instance's `password` and `access_token` encrypted within the variables file.

{{< note >}}
Ansible Vault can also encrypt entire files containing sensitive values. View Ansible's documentation on [Vault](https://docs.ansible.com/ansible/latest/user_guide/vault.html#what-can-be-encrypted-with-vault) for more information.
{{</ note >}}

1.  Create your Ansible Vault password file and add your password to the file. Remember the location of the password file was configured in the `ansible.cfg` file in the [Configure Ansible](#configure-ansible) section of this guide.

    {{< file "~/development/vault-pass">}}
My.ANS1BLEvault-c00lPassw0rd
{{</ file >}}

1.  Encrypt the value of your Linode's root user password using Ansible Vault. Replace `My.c00lPassw0rd` with your own strong password that conforms to the [`root_pass` parameter's](#linode-v4-module-parameters) constraints.

        ansible-vault encrypt_string 'My.c00lPassw0rd' --name 'password'

      You will see a similar output:

      {{< output >}}
password: !vault |
    $ANSIBLE_VAULT;1.1;AES256
    30376134633639613832373335313062366536313334316465303462656664333064373933393831
    3432313261613532346134633761316363363535326333360a626431376265373133653535373238
    38323166666665376366663964343830633462623537623065356364343831316439396462343935
    6233646239363434380a383433643763373066633535366137346638613261353064353466303734
    3833</br>
Encryption successful
{{</ output >}}

1.  Copy the generated output and add it to your `vars` file.

1.  Encrypt the value of your access token. Replace the value of `86210...1e1c6bd` with your own access token.

        ansible-vault encrypt_string '86210...1e1c6bd' --name 'token'

1.  Copy the generated output and append it to the bottom of your `vars` file.

    The final `vars` file should resemble the example below:

    {{< file "~/development/group_vars/example_group/vars">}}
ssh_keys: >
        ['ssh-rsa AAAAB3N..5bYqyRaQ== user@mycomputer', '~/.ssh/id_rsa.pub']
label: simple-linode-
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
{{</ file >}}

### Run the Ansible Playbook

You are now ready to run the Create Linode Playbook. When you run the Playbook, a 1GB Linode (Nanode) will be deployed in the Newark data center. Note: you want to run Ansible commands from the directory where your `ansible.cfg` file is located.

1.  Run your playbook to create your Linode instances.

        ansible-playbook ~/development/linode_create.yml

    You will see a similar output:

    {{<output>}}
PLAY [Create Linode] *********************************************************************

TASK [Gathering Facts] *******************************************************************
ok: [localhost]

TASK [Create a new Linode.] **************************************************************
changed: [localhost]

PLAY RECAP *******************************************************************************
localhost                  : ok=3    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
{{</output>}}

### linode_v4 Module Parameters

| Parameter | Data type/Status | Usage |
| --------- | -------- | ------|
| `access_token` | string, *required* | Your Linode API v4 access token. The token should have permission to read and write Linodes. The token can also be specified by exposing the `LINODE_ACCESS_TOKEN` environment variable. |
| `authorized_keys` | list | A list of SSH public keys or SSH public key file locations on your local system, for example, `['averylongstring','~/.ssh/id_rsa.pub']`. The public key will be stored in the `/root/.ssh/authorized_keys` file on your Linode. Ansible will use the public key to SSH into your Linodes as the root user and execute your Playbooks.|
| `group` | string, *deprecated* | The Linode instance's group. Please note, group labelling is deprecated but still supported. The encouraged method for marking instances is to use tags. This parameter must be provided to use the Linode dynamic inventory module. |
| `image` | string | The Image ID to deploy the Linode disk from. Official Linode Images start with `linode/`, while your private images start with `private/`. For example, use `linode/ubuntu18.04` to deploy a Linode instance with the Ubuntu 18.04 image. This is a required parameter only when creating Linode instances.</br></br> To view a list of all available Linode images, issue the following command: </br></br>`curl https://api.linode.com/v4/images`.|
| `label` | string, *required* | The Linode instance label. The label is used by the module as the main determiner for idempotence and must be a unique value.</br></br> Linode labels have the following constraints:</br></br> &bull; Must start with an alpha character.</br>&bull; May only consist of alphanumeric characters, dashes (-), underscores (_) or periods (.).</br> &bull; Cannot have two dashes (--), underscores (__) or periods (..) in a row. |
| `region` | string | The region where the Linode will be located. This is a required parameter only when creating Linode instances.</br></br> To view a list of all available regions, issue the following command: </br></br>`curl https://api.linode.com/v4/regions`. |
| `root_pass` | string | The password for the root user. If not specified, will be generated. This generated password will be available in the task success JSON.</br></br> The root password must conform to the following constraints: </br></br> &bull; May only use alphanumerics, punctuation, spaces, and tabs.</br>&bull; Must contain at least two of the following characters classes: upper-case letters, lower-case letters, digits, punctuation. |
| `state` | string, *required* | The desired instance state. The accepted values are `absent` and `present`. |
| `tags` | list | The user-defined labels attached to Linodes. Tags are used for grouping Linodes in a way that is relevant to the user. |
| `type` | string, | The Linode instance's plan type. The plan type determines your Linode's [hardware resources](/docs/guides/how-to-choose-a-linode-plan/#hardware-resource-definitions) and its [pricing](https://www.linode.com/pricing/). </br></br> To view a list of all available Linode types including pricing and specifications for each type, issue the following command: </br></br>`curl https://api.linode.com/v4/linode/types`. |

## The Linode Dynamic Inventory Plugin

Ansible uses *inventories* to manage different hosts that make up your infrastructure. This allows you to execute tasks on specific parts of your infrastructure. By default, Ansible will look in `/etc/ansible/hosts` for an inventory, however, you can designate a different location for your inventory file and use multiple inventory files that represent your infrastructure. To support infrastructures that shift over time, Ansible offers the ability to track inventory from dynamic sources, like cloud providers. The Ansible dynamic inventory plugin for Linode can be used to source your inventory from Linode's API v4. In this section, you will use the Linode plugin to source your Ansible deployed Linode inventory.

{{< note >}}
The dynamic inventory plugin for Linode was enabled in the Ansible configuration file created in the [Configure Ansible](#configure-ansible) section of this guide.
{{</ note >}}

### Configure the Plugin

1. Configure the Ansible dynamic inventory plugin for Linode by creating a file named `linode.yml`.

      {{< file "~/development/linode.yml"yaml>}}
plugin: linode
regions:
  - us-east
groups:
  - example_group
types:
  - g6-nanode-1
{{</ file >}}

      - The configuration file will create an inventory for any Linodes on your account that are in the `us-east` region, part of the `example_group` group and of type `g6-nanode-1`. Any Linodes that are not part of the `example_group` group, but that fulfill the `us-east` region and `g6-nanode-type` type will be displayed as ungrouped. All other Linodes will be excluded from the dynamic inventory. For more information on all supported parameters, see the [Plugin Parameters](#plugin-parameters) section.

### Run the Inventory Plugin

1.  Export your Linode API v4 access token to the shell environment. `LINODE_ACCESS_TOKEN` must be used as the environment variable name. Replace `mytoken` with your own access token.

        export LINODE_ACCESS_TOKEN='mytoken'

1.  Run the Linode dynamic inventory plugin.

        ansible-inventory -i ~/development/linode.yml --graph

    You should see a similar output. The output may vary depending on the Linodes already deployed to your account and the parameter values you pass.

        @all:
        |--@example_group:
        |  |--simple-linode-29

    For a more detailed output including all Linode instance configurations, issue the following command:

        ansible-inventory -i ~/development/linode.yml --graph --vars

1.  Before you can communicate with your Linode instances using the dynamic inventory plugin, you will need to add your Linode's IPv4 address and label to your `/etc/hosts` file.

    The Linode Dynamic Inventory Plugin assumes that the Linodes in your account have labels that correspond to hostnames that are in your resolver search path, `/etc/hosts`. This means you will have to create an entry in your `/etc/hosts` file to map the Linode's IPv4 address to its hostname.
  {{< note >}}
A [pull request](https://github.com/ansible/ansible/pull/51196) currently exists to support using a public IP, private IP or hostname. This change will enable the inventory plugin to be used with infrastructure that does not have DNS hostnames or hostnames that match Linode labels.
{{</note>}}
    To add your deployed Linode instance to the `/etc/hosts` file:

  -   Retrieve your Linode instance's IPv4 address:

          ansible-inventory -i ~/development/linode.yml --graph --vars | grep 'ipv4\|simple-linode'

      Your output will resemble the following:

      {{<output>}}
|  |--simple-linode-36
|  |  |--{ipv4 = [u'192.0.2.0']}
|  |  |--{label = simple-linode-36}
{{</output>}}

  -   Open the `/etc/hosts` file and add your Linode's IPv4 address and label:

          127.0.0.1       localhost
          192.0.2.0 simple-linode-29

1.  Verify that you can communicate with your grouped inventory by pinging the Linodes. The ping command will use the dynamic inventory plugin configuration file to target `example_group`. The `u root` option will run the command as root on the Linode hosts.

        ansible -m ping example_group -i ~/development/linode.yml -u root

    You should see a similar output:

    {{<output>}}
simple-linode-29 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python"
    },
    "changed": false,
    "ping": "pong"
}
{{</output>}}

###  Plugin Parameters

| Parameter | Data type/Status | Usage |
| --------- | -------- | ------|
| `access_token` | string, *required* | Your Linode API v4 access token. The token should have permission to read and write Linodes. The token can also be specified by exposing the `LINODE_ACCESS_TOKEN` environment variable. |
| `plugin` | string, *required* | The plugin name. The value must always be `linode` in order to use the dynamic inventory plugin for Linode. |
| `regions` | list | The Linode region with which to populate the inventory. For example, `us-east` is possible value for this parameter.</br></br> To view a list of all available regions, issue the following command: </br></br>`curl https://api.linode.com/v4/regions`.  |
| `types` | list | The Linode type with which to populate the inventory. For example, `g6-nanode-1` is a possible value for this parameter.</br></br> To view a list of all available Linode types including pricing and specifications for each type, issue the following command: </br></br>`curl https://api.linode.com/v4/linode/types`. |
| `groups` | list | The Linode group with which to populate the inventory. Please note, group labelling is deprecated but still supported. The encouraged method for marking instances is to use tags. This parameter must be provided to use the Linode dynamic inventory module. |

## Delete Your Resources

1.  To delete the Linode instance created in this guide, create a Delete Linode Playbook with the following content in the example. Replace the value of `label` with your Linode's label:

    {{< file "~/development/linode_delete.yml" yaml>}}
- name: Delete Linode
  hosts: localhost
  vars_files:
    - ./group_vars/example_group/vars
  tasks:
  - name: Delete your Linode Instance.
    linode_v4:
      label: simple-linode-29
      state: absent
      {{</ file >}}

1.  Run the Delete Linode Playbook:

        ansible-playbook ~/development/linode_delete.yml
