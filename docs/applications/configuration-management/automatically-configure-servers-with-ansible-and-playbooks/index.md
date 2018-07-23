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
title: 'Automatically Configure Servers with Ansible and Playbooks'
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

This guide introduces the basics of using Ansible and creating a configuration playbook.

## Before You Begin

All Ansible commands are run from a **control machine**, which can be either a local computer or a Linode. Ansible uses SSH to execute commands remotely on **nodes**.

This guide will use a control machine with three Linodes serving as nodes. These nodes will be referred to as `node-1`, `node-2`, and `node-3` throughout the guide. Create these three Linodes using the Linode Manager and deploy an appropriate image to each one (the examples in this guide use Ubuntu 16.04). Since Ansible uses SSH, you will need to make sure that your control machine has SSH access to all of the nodes:

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

### Install Miniconda

{{< content "install_python_miniconda.md" >}}

### Install Ansible

1.  Create a new virtual environment for Ansible:

        conda create -n ansible-dev python=3

2.  Activate the new environment:

        source activate ansible-dev

3.  Install Ansible:

        pip install ansible

    Ansible can also be installed using a package manager such as `apt` on Debian/Ubuntu and [Homebrew](https://brew.sh) on OSX.

4.  Verify that the corresponding Python path is correct:

        ansible --version

## Configure Ansible

### Create an Inventory File to Track Nodes

Ansible keeps track of its nodes using an [inventory file](http://docs.ansible.com/ansible/intro_inventory.html).

1.  Create a directory for Ansible configuration files and playbooks:

        mkdir ~/ansible && cd ~/ansible

2.  Create a configuration file and edit it to include the location where you will store your inventory file:

    {{< file "~/ansible/ansible.cfg" ini >}}
[defaults]
inventory = ~/Path/To/ansible/hosts
{{< /file >}}

3.  Create the inventory file. Replace `$node-1-ip`,`$node-2-ip`, and `$node-3-ip` with the public IP address or domain name of each of your nodes:

    {{< file "~/ansible/hosts" ini >}}
[nginx]
$node-1-ip
$node-2-ip

[linode]
$node-3-ip
{{< /file >}}

    Each bracketed label denotes an Ansible [group](http://docs.ansible.com/ansible/latest/intro_inventory.html#hosts-and-groups). Grouping your nodes by function will make it easier to run commands against the correct set of nodes.

### Test Inventory Groups

1.  Use the `all` directive to ping all servers in your inventory:

        ansible all -u root -m ping

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

    The `-u` option is used here to run the command as root, since currently there are no standard user accounts on the nodes.

2.  Repeat the command, targeting only the nodes in the `[nginx]` group:

        ansible nginx -u root -m ping

    This time, only `node-1` and `node-2` should respond.

## Use Ansible Playbooks

### Syntax and Examples

A [Playbook](http://docs.ansible.com/ansible/latest/playbooks.html) defines a series of actions to run on specified groups of servers. Unlike some configuration tools, a playbook does not describe a state of the machine and rely on Ansible to determine the necessary changes to achieve that state. Instead, playbooks should be designed to be **idempotent**, meaning that they can be run more than once without negative effects. For example, a playbook might have a task that sets up a configuration file for a server and injects a few variables. The playbook should be written so that Ansible can take the template configuration file, compare it to the actual file, and create/update it only if necessary. Fortunately, many Ansible modules are built with this functionality in mind.

Playbooks can be used to perform initial server configurations, add users and directories, ensure certain software packages are installed or uninstalled, move files, etc. A single playbook can run commands on any combination of groups. It is procedural, and tasks are run in order from top to bottom.

A playbook is a YAML file, and typically follows this structure:

{{< file "playbook.yml" yaml >}}
---
- hosts: [target hosts]
  remote_user: [yourname]
  tasks:
    - [task 1]
    - [task 2]

{{< /file >}}

The following playbook would log in to all servers in the `[nginx]` group and ensure NGINX was started:

{{< file "playbook.yml" yaml >}}
---
- hosts: [nginx]
  remote_user: webadmin
  tasks:
    - name: Ensure the NGINX daemon has started
      service: name=nginx state=started
      become: yes
      become_method: sudo

{{< /file >}}

Every task should have a name. Task names are logged as Ansible runs and can help you track progress. Following the name line is the module that will be run (in this case, the [service module](http://docs.ansible.com/ansible/service_module.html)), and the other attributes provide more options, in this case instructing Ansible to use `sudo` privileges.

### Ansible Modules

Ansible ships with a large collection of modules that you can run as tasks or via commands as needed. To see a listing of all available modules, run:

    ansible-doc -l

Common core modules include:

* `command` - [Executes a command on a remote node](http://docs.ansible.com/ansible/command_module.html)
* `script` - [Runs a local script on a remote node after transferring it](http://docs.ansible.com/ansible/script_module.html)
* `shell` - [Execute commands in nodes](http://docs.ansible.com/ansible/shell_module.html)
* `mysql_db` - [Add or remove MySQL databases from a remote host](http://docs.ansible.com/ansible/mysql_db_module.html)
* `mysql_user` - [Adds or removes a user from a MySQL database](http://docs.ansible.com/ansible/mysql_user_module.html)
* `postgresql_db` - [Add or remove PostgreSQL databases from a remote host](http://docs.ansible.com/ansible/postgresql_db_module.html)
* `postgresql_user` - [Adds or removes a users (roles) from a PostgreSQL database](http://docs.ansible.com/ansible/postgresql_user_module.html)
* `fetch` - [Fetches a file from remote nodes](http://docs.ansible.com/ansible/fetch_module.html)
* `template` - [Templates a file out to a remote server](http://docs.ansible.com/ansible/template_module.html)
* `yum` - [Manages packages with the yum package manager](http://docs.ansible.com/ansible/yum_module.html)
* `apt` - [Manages apt-packages](http://docs.ansible.com/ansible/apt_module.html)
* `git` - [Deploy software (or files) from git checkouts](http://docs.ansible.com/ansible/git_module.html)
* `service` - [Manage services](http://docs.ansible.com/ansible/service_module.html)

## Server Configuration Playbook

This section demonstrates using a playbook to automate basic server configuration, similar to the steps covered in our [Getting Started](/docs/getting-started/) and [Securing Your Server](/docs/security/securing-your-server/) guides.

### Create a Hashed Password

1.  Install `passlib`:

        pip install passlib

2.  Create a password hash for Ansible to use when communicating with the servers:

        python -c "from passlib.hash import sha512_crypt; print sha512_crypt.encrypt('plaintextpassword')"

### Create a Regular User

1.  Write a playbook that creates a new normal user, adds the control machine's public key, and adds the new user to the `sudoers` file. Replace `username` with your desired Unix account username and `hashed-password` with your hashed password. In the `authorized_key` task, substitute the path to the SSH key used on the control machine:

    {{< file "initialize_basic_user.yml" yaml >}}
---
- hosts: all
  remote_user: root
  vars:
    NORMAL_USER_NAME: 'yourusername'
  tasks:
    - name: "Create a secondary, non-root user"
      user: name={{ NORMAL_USER_NAME }}
            password='hashed-password'
            shell=/bin/bash
    - name: Add remote authorized key to allow future passwordless logins
      authorized_key: user={{ NORMAL_USER_NAME }} key="{{ lookup('file', '/home/username/.ssh/id_rsa.pub') }}"
    - name: Add normal user to sudoers
      lineinfile: dest=/etc/sudoers
                  regexp="{{ NORMAL_USER_NAME }} ALL"
                  line="{{ NORMAL_USER_NAME }} ALL=(ALL) ALL"
                  state=present
{{< /file >}}

2.  Run the playbook:

        ansible-playbook -u root initialize_basic_user.yml

### Set up Server

1.  Create a new playbook to update packages, set timezone and hostname, and edit the `hosts` file. Replace the user information, hostname, and domain name with the appropriate entries:

    {{< file "common_server_setup.yml" yaml >}}
---
- hosts: linode
  remote_user: username
  become: yes
  become_method: sudo
  vars:
    LOCAL_HOSTNAME: 'web01'
    LOCAL_FQDN_NAME: 'www.example.com'
  tasks:
    - name: Set the timezone for the server to be UTC
      command: file state=link /usr/share/zoneinfo/UTC /etc/localtime
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

2.  Use `--check` to review the effects of the playbook before running it:

        ansible-playbook common_server_setup.yml --check --ask-become-pass

    You will be prompted for a sudo password. Enter the plain text version of the password you previously hashed.

3.  If the results are good, run the playbook:

        ansible-playbook common_server_setup.yml --ask-become-pass

    Each node should report a status of "changed" after the playbook has run.

### Install the Stack

Create a basic server setup with Apache, PHP, and a test MySQL database to use.

1.  The following playbook downloads the appropriate packages, turns on the Apache and MySQL services, and creates a basic database and user:

    {{< file "setup_webserver.yml" yaml >}}
---
- hosts: nginx
  remote_user: username
  become: yes
  become_method: sudo
  tasks:
    - name: "Install NGINX and MySQL"
      apt: name={{ item }} state=present
      with_items:
        - nginx
        - mysql-server
        - python-mysqldb

    - name: "Start and enable the NGINX and MySQL services"
      service: name={{ item }} state=started enabled=yes
      with_items:
        - nginx
        - mysql

    - name: "Create a test database"
      mysql_db: name=testDb
                state=present

    - name: "Create a new user for connections"
      mysql_user: name=webapp
                  password=password
                  priv=*.*:ALL state=present

{{< /file >}}

2.  Run the playbook from your control machine:

        ansible-playbook setup_webserver.yml --ask-become-pass

    When this playbook finishes, visit your Linode's IP address or FQDN to see the default NGINX index page.

3.  Log in via SSH and check to see that the `testDb` has been created:

         mysql -u root -p
         show databases;

## Next Steps

More complicated playbooks will require working with more advanced concepts. Ansible provides a number of [example playbooks](https://github.com/ansible/ansible-examples) on GitHub. In addition, documentation is available for many of the important concepts for writing playbooks:

* [Users, and Switching Users](http://docs.ansible.com/ansible/playbooks_intro.html#hosts-and-users) and [Privilege Escalation](http://docs.ansible.com/ansible/become.html)
* [Handlers: Running Operations On Change](http://docs.ansible.com/ansible/playbooks_intro.html#handlers-running-operations-on-change)
* [Roles](http://docs.ansible.com/ansible/playbooks_roles.html)
* [Variables](http://docs.ansible.com/ansible/playbooks_variables.html)
* [Playbook Best Practices](http://docs.ansible.com/ansible/playbooks_best_practices.html)
