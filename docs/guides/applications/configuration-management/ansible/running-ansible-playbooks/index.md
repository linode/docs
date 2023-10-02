---
slug: running-ansible-playbooks
description: 'An introduction to configuration management with the Ansible IT automation platform including installation, configuration and playbook set up.'
keywords: ["ansible", "ansible configuration", "ansible provisioning", "ansible infrastructure", "ansible automation", "ansible configuration", "ansible configuration change management", "ansible server automation"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2015-06-01
modified: 2015-09-21
modified_by:
    name: Linode
title: Automate Server Configuration with Ansible Playbooks
aliases: ['/applications/configuration-management/ansible/running-ansible-playbooks/','/applications/configuration-management/running-ansible-playbooks/','/applications/configuration-management/learn-how-to-install-ansible-and-run-playbooks/']
tags: ["automation"]
authors: ["Joshua Lyman"]
---

**Playbooks** define a set of tasks to be executed by Ansible on a group of managed nodes. While you can use Ansible to execute one-off tasks via the command line, Playbooks can be reused, shared across teams, version controlled, and support complex deployment and rollout requirements. You can use features such as handlers, variables, templates, error handling, and control logic within your Playbooks to intelligently automate your IT processes across a fleet of hosts.

## Scope of this Guide

This guide provides an introduction to Ansible Playbook concepts, like tasks, plays, variables, and Jinja templating. In this guide's examples, you will create Playbooks to automate the following:

* Creating a limited user account on a Linode
* Common server setup tasks, like setting a hostname, timezone, and updating system software
* Installing a LAMP stack

## Before You Begin

* If you are not familiar with Ansible, review the [Ansible Definitions](/docs/guides/getting-started-with-ansible/#what-is-ansible) section of the [Getting Started With Ansible](/docs/guides/getting-started-with-ansible/) guide.

* Install Ansible on your computer or a Linode following the steps in the [Set up the Control Node](/docs/guides/getting-started-with-ansible/#set-up-the-control-node) section of our [Getting Started With Ansible](/docs/guides/getting-started-with-ansible/) guide.

* Deploy a Linode running Debian 9 to manage with Ansible. All Playbooks created throughout this guide will be executed on this Linode. Follow the [Getting Started With Ansible - Basic Installation and Setup](/docs/guides/getting-started-with-ansible/#set-up-the-control-node) to learn how to establish a connection between the Ansible control node and your Linode.

    {{< note respectIndent=false >}}
When following the [Getting Started with Ansible](/docs/guides/getting-started-with-ansible/#set-up-the-control-node) guide to deploy a Linode, it is not necessary to add your Ansible control node's SSH key-pair to your managed Linode. This step will be completed using a Playbook later on in this guide.
    {{< /note >}}

## Playbook Basics

Ansible Playbooks are written using YAML syntax, a declarative language, to describe the tasks or actions to execute on a group of managed nodes. Playbook tasks are run in order from top to bottom. You should design your Playbooks to be idempotent, which means a Playbook can be run once or several times with the same expected result. For example, a Playbook might declare a task to set up a server configuration file using a template and inject declared variable values in the file. In this scenario, Ansible should be able to compare the template configuration file to the actual file on the server and create or update it only if necessary.

### Anatomy of a Playbook
The example below displays the skeleton of a Playbook. At its most basic, a Playbook will define a group of target hosts, variables to use within the Playbook, a remote user to execute the tasks as, and a set of named tasks to execute using various [Ansible modules](https://docs.ansible.com/ansible/latest/modules/modules_by_category.html). This grouping within a Playbook is referred to as a **play** and a single Playbook can contain several plays.

{{< note type="secondary" title="Common Ansible Modules" isCollapsible=true >}}
| **Module** | **Usage** |
| ---------------- | ------------- |
| [command](http://docs.ansible.com/ansible/command_module.html) | Executes a command on a remote node. |
| [script](http://docs.ansible.com/ansible/script_module.html) | Transfers a local script to a managed node and then runs the script on the remote node. |
| [shell](http://docs.ansible.com/ansible/command_module.html) | Executes a command through a shell (`/bin/sh`) on a remote node. |
| [template](http://docs.ansible.com/ansible/template_module.html) | Uses a local file template to create a file on a remote node. |
| [apt](http://docs.ansible.com/ansible/apt_module.html) | Manages apt packages on Debian or Ubuntu systems. |
| [git](http://docs.ansible.com/ansible/apt_module.html) | Deploy software or files from git checkouts. |
| [service](http://docs.ansible.com/ansible/apt_module.html) | Manage services on your remote node's system. Supports BSD init, OpenRC, SysV, Solaris SMF, systemd, upstart init systems.  |
{{< /note >}}

{{< file "Playbook Skeleton" yaml >}}
---
- hosts: [target hosts]
  vars:
    var1: [value 1]
    var2: [value 2]
  remote_user: [yourname]
  tasks:
    - name: [task 1]
      module:
    - name: [task 2]
      module:

{{< /file >}}

The second example Playbook targets all hosts in the `marketing_servers` group and ensures Apache is started. The task is completed as the `webadmin` user.

{{< file "Service Check Playbook" yaml >}}
---
- hosts: [marketing_servers]
  remote_user: webadmin
  tasks:
    - name: Ensure the Apache daemon has started
      service: name=httpd state=started
      become: yes
      become_method: sudo

{{< /file >}}

## Web Server Setup with Ansible Playbooks

In this example, you will create three different Playbooks to configure your Linode as a web server running a LAMP stack. You will also configure the Linode to add a limited user account. The Playbooks will provide basic configurations that you can expand on, if needed.

{{< note type="alert" respectIndent=false >}}
The Playbooks created in this section are for learning purpose and will not result in a fully hardened or secure server. To further secure your Linode, you can use Ansible's [firewalld module](https://docs.ansible.com/ansible/latest/modules/firewalld_module.html).
{{< /note >}}

### Add a Limited User Account

In this section you will create a Playbook to add a limited user account to your Linode.

#### Create a Password Hash

When creating a limited user account you are required to create a host login password for the new user. Since you should never include plaintext passwords in your Playbooks, in this section you will use the Python passlib library to create a password hash that you can securely include in your Playbook.

{{< note >}}
[Ansible Vault](https://docs.ansible.com/ansible/latest/user_guide/vault.html#encrypt-string-for-use-in-yaml) can also be used to encrypt sensitive data. This guide will not make use of Ansible Vault, however, you can consult the [How to use the Linode Ansible Module to Deploy Linodes](/docs/guides/deploy-linodes-using-ansible/) guide to view an example that makes use of this feature.
{{< /note >}}

1. On your Ansible control node, create a password hash on your control node for Ansible to use in a later step. An easy method is to use Python's PassLib library, which can be installed with the following commands:

1. Install pip, the package installer for Python, on your control node if you do not already have it installed:

        sudo apt install python-pip

1. Install the passlib library:

        sudo pip install passlib

1. Create a password hash using passlib. Replace `myPlainTextPassword` with the password you'd like to use to access your Linode.

        sudo python -c "from passlib.hash import sha512_crypt; print (sha512_crypt.hash('myPlainTextPassword'))"

    A similar output will appear displaying a hash of your password:
    {{< output >}}
$6$rounds=656000$dwgOSA/I9yQVHIjJ$rSk8VmlZSlzig7tEwIN/tkT1rqyLQp/S/cD08dlbYctPjdC9ioSp1ykFtSKgLmAnzWVM9T3dTinrz5IeH41/K1
    {{</ output >}}

1. Copy and paste the hash somewhere that you can easily access for a later step.

#### Disable Host Key Checking

Ansible uses the sshpass helper program for SSH authentication. This program is included by default on Ansible 2.8. sshpass requires host key checking to be disabled on your Ansible control node.

1. Disable host key checking.  Open the `/etc/ansible/ansible.cfg` configuration file in a text editor of your choice, uncomment the following line, and save your changes.

    {{< file "/etc/ansible/ansible.cfg" ini >}}
#host_key_checking = False

{{< /file >}}

#### Create the Inventory File

In order to target your Linode in a Playbook, you will need to add it to your Ansible control node's inventory file.

1. Edit your inventory file to create the `webserver` group and to add your Linode to the group. Open the `/etc/ansible/hosts` file in your preferred text editor and add the following information. Replace `192.0.2.0` with your Linode's IP address.

    {{< file "/etc/ansible/hosts" ini >}}
[webserver]
192.0.2.0

{{< /file >}}

#### Create the Limited User Account Playbook

You are now ready to create the Limited User Account Playbook. This Playbook will create a new user on your Linode, add your Ansible control node's SSH public key to the Linode, and add the new user to the Linode's `sudoers` file.

1. In your home directory, create a file named `limited_user_account.yml` and add the contents of the example. Replace the following values in the file:
    * `yourusername` with the user name you would like to create on the Linode
    * `$6$rounds=656000$W.dSl` with the password hash you create in the [Create a Password Hash](#create-a-password-has) section of the guide.

        {{< file "limited_user_account.yml" yaml >}}
---
- hosts: webserver
  remote_user: root
  vars:
    NORMAL_USER_NAME: 'yourusername'
  tasks:
    - name: "Create a secondary, non-root user"
      user: name={{ NORMAL_USER_NAME }}
            password='$6$rounds=656000$W.dSl'
            shell=/bin/bash
    - name: Add remote authorized key to allow future passwordless logins
      authorized_key: user={{ NORMAL_USER_NAME }} key="{{ lookup('file', '~/.ssh/id_rsa.pub') }}"
    - name: Add normal user to sudoers
      lineinfile: dest=/etc/sudoers
                  regexp="{{ NORMAL_USER_NAME }} ALL"
                  line="{{ NORMAL_USER_NAME }} ALL=(ALL) ALL"
                  state=present

    {{< /file >}}

    * The first two lines of the file tells Ansible to target the `webserver` group of hosts in the inventory file and to execute the remote host tasks as the `root` user.
    * The `vars` section creates the `NORMAL_USER_NAME` that can be reused throughout the Playbook. Ansible also allows you to create and use variables in separate files, instead of directly in your Playbook. For a deeper dive into the many ways you can use variables with Ansible, see Ansible's official documentation on [Using Variables](https://docs.ansible.com/ansible/latest/user_guide/playbooks_variables.html#defining-variables-in-files).
    * The `tasks` block of the Playbook, declares three tasks. The first creates the new user and a user password. The second, adds the Ansible control node's public SSH key to the Linode. The third task adds the new user to the sudoers file.
    * Each task makes use of Jinja templating, (i.e. `{{ NORMAL_USER_NAME }}`), to access the referenced variable values. Jinja templating is a powerful feature of Ansible that gives you access to control logic, filters, lookups, and functions within your Playbooks. To learn more, consult [Ansible's official documentation](https://docs.ansible.com/ansible/latest/user_guide/playbooks_templating.html#templating-jinja2).

1. Run the `limited_user_account.yml` Playbook. The `--ask-pass` option tells Ansible to log into the Linode using password authentication, instead of SSH, since your public SSH key is not yet stored there. The `-u root` option directs Ansible to log in as the root user. By default, Ansible will use your current local system's username of one is not provided.

        ansible-playbook --ask-pass -u root limited_user_account.yml

      You should see output from Ansible that reports that the three tasks all completed successfully with a status of "changed." We can now work with new playbooks using our limited user account and keys.

### Configure the Base System

This next Playbook will take care of some common server setup tasks, such as setting the timezone, updating the hosts file, and updating packages.

1. Create a file in your home directory named `common_server_setup.yml` and add the contents of the example. Replace the following values in the file:

      * `yourusername` with the username you created in the [Create the Limited User Account Playbook](#create-the-limited-user-account-playbook) section of the guide
      * `web01` with the hostname you would like to set for your Linode.
      * If you have a domain name you would like to set up, replace `www.example.com` with it.

        {{< file "common_server_setup.yml" yaml >}}
---
- hosts: webserver
  remote_user: yourusername
  become: yes
  become_method: sudo
  vars:
    LOCAL_HOSTNAME: 'web01'
    LOCAL_FQDN_NAME: 'www.example.com'
  tasks:
    - name: Set the timezone for the server to be UTC
      command: ln -sf /usr/share/zoneinfo/UTC /etc/localtime
    - name: Set up a unique hostname
      hostname: name={{ LOCAL_HOSTNAME }}
    - name: Add the server's domain to the hosts file
      lineinfile: dest=/etc/hosts
                  regexp='.*{{ item }}$'
                  line="{{ hostvars[item].ansible_default_ipv4.address }} {{ LOCAL_FQDN_NAME }} {{ LOCAL_HOSTNAME }}"
                  state=present
      when: hostvars[item].ansible_default_ipv4.address is defined
      with_items: "{{ groups['linode'] }}"
    - name: Update packages
      apt: update_cache=yes upgrade=dist
          {{< /file >}}

          * The first task in this Playbook uses the `command` module to set the Linode's timezone to UTC time.
          * The second task uses the `hostname` module to set your system's hostname.
          * The third task updates the Linode's host file using the `lineinfile` module. This task uses `hostvars` to retrieve the host's IP address and use it to update the hosts file. `hostvars` is a reserved [special variable](https://docs.ansible.com/ansible/latest/reference_appendices/special_variables.html#special-variables) that you can use to access various information about your hosts.
          * The fourth task updates your system's packages using the `apt` module.

1. Run the `common_server_setup.yml` Playbook. The `--ask-become-pass` tells Ansible to ask you for the limited user account's password in order to `become` the sudo user and execute the Playbook via the limited user account.

    {{< note respectIndent=false >}}
By default, Ansible will use your current local system's username to authenticate to your Linode. If your local username is not the same as your Linode's limited user account name, you will need to pass the `-u` option along with the limited user account name to appropriately authenticate. Ensure you replace `limitedUserAccountName` with the limited user account name you created in the [Create the Limited User Account Playbook](#create-the-limited-user-account-playbook) section of the guide.
    {{< /note >}}

        ansible-playbook common_server_setup.yml --ask-become-pass -u limitedUserAccountName

    * When the Playbook begins to execute, you will be prompted to enter a `BECOME password:`. This is the password you created in the [Create a Password Hash](#create-a-password-hash) section of the guide.
    * As the Playbook executes, you will again see the tasks display as "changed."
    * Updating packages may take a few minutes.

### Install the Stack

You are now ready to create the `setup_webserver.yml` Playbook that will get your Linode set up with Apache, PHP, and a test MySQL database.

1. Follow the steps in the [Create a Password Hash](#create-a-password-hash) section of the guide to create a new password hash to use in this Playbook.

1. Create a file in your home directory named `setup_webserver.yml` and add the contents of the example. Replace the following values in the file:

      * `yourusername` with the username you created in the [Create the Limited User Account Playbook](#create-the-limited-user-account-playbook) section of the guide
      * In the `Create a new user for connections` task, replace the value of `password` with your desired password.

        {{< note respectIndent=false >}}
In order to avoid using plain text passwords in your Playbooks, you can use [Ansible-Vault](https://docs.ansible.com/ansible/latest/user_guide/vault.html#encrypt-string-for-use-in-yaml) and variables to encrypt sensitive data. You can consult the [How to use the Linode Ansible Module to Deploy Linodes](/docs/guides/deploy-linodes-using-ansible/) guide to view an example that makes use of this feature.
        {{< /note >}}

        {{< file "setup_webserver.yml" yaml >}}
---
- hosts: webserver
  remote_user: yourusername
  become: yes
  become_method: sudo
  tasks:
    - name: "Install Apache, MySQL, and PHP"
      apt:
        pkg:
          - apache2
          - mysql-server
          - python-mysqldb
          - php
          - php-pear
          - php-mysql
        state: present

    - name: "Turn on Apache and MySQL and set them to run on boot"
      service: name={{ item }} state=started enabled=yes
      with_items:
        - apache2
        - mysql

    - name: Create a test database
      mysql_db: name= testDb
                state= present

    - name: Create a new user for connections
      mysql_user: name=webapp
                  password='$6$rounds=656000$W.dSl'
                  priv=*.*:ALL state=present

      {{< /file >}}

      * The first task handles installing Apache, MySQL, and PHP.
      * The next task ensures that Apache and MySQL remaining running after a system reboot. This task makes use of a [loop](https://docs.ansible.com/ansible/latest/user_guide/playbooks_loops.html) to populate the value of the `service` name.
      * Next, the Playbook creates a MySQL database with the name of `testDB`
      * Finally, a new MySQL user named `webapp` is created.


1.  Run the playbook from your control machine with the following command:

        ansible-playbook setup_webserver.yml --ask-become-pass

1. When this playbook finishes executing, visit your Linode's IP address or FQDN to see the default Ubuntu Apache index page.

1.  Log in to the Linode you just configured via SSH and check to see that the `testDb` has indeed been created:

         sudo mysql -u webapp -p
         show databases;

1. If desired, you can even create a sample PHP page and place it in `/var/www/html` to test that PHP is active on the server.


## Next Steps

Now that you are familiar with Playbooks, you can continue to learn more about Ansible. Ansible's GitHub provides several example Playbooks that you can reference to learn different implementation options and patterns. Below are a few topics you can explore to learn how to build Playbooks of more complexity:

* [Ansible Example Playbooks (GitHub)](https://github.com/ansible/ansible-examples)
  * [WordPress + nginx + PHP-FPM](https://github.com/ansible/ansible-examples/tree/master/wordpress-nginx)
  * [Simple LAMP Stack](https://github.com/ansible/ansible-examples/tree/master/lamp_simple)
  * [Sharded, production-ready MongoDB cluster](https://github.com/ansible/ansible-examples/tree/master/mongodb)
* [Ansible Documentation](http://docs.ansible.com/ansible/index.html)
* Important Next Topics:
  * [Users, and Switching Users](http://docs.ansible.com/ansible/playbooks_intro.html#hosts-and-users) and [Privilege Escalation](http://docs.ansible.com/ansible/become.html)
  * [Handlers: Running Operations On Change](https://docs.ansible.com/ansible/latest/user_guide/playbooks_handlers.html)
  * [Roles](https://docs.ansible.com/ansible/latest/user_guide/playbooks_reuse_roles.html)
  * [Variables](https://docs.ansible.com/ansible/latest/user_guide/playbooks_variables.html)
  * [Playbook Best Practices](http://docs.ansible.com/ansible/playbooks_best_practices.html)
