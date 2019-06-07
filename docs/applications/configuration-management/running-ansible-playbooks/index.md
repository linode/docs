---
author:
    name: Linode Community
    email: docs@linode.com
description: 'An introduction to configuration management with the Ansible IT automation platform including installation, configuration and playbook set up.'
keywords: ["ansible", "ansible configuration", "ansible provisioning", "ansible infrastructure", "ansible automation", "ansible configuration", "ansible configuration change management", "ansible server automation"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['applications/ansible/getting-started-with-ansible/','applications/configuration-management/getting-started-with-ansible/']
published: 2015-09-08
modified: 2015-09-08
modified_by:
    name: Linode
title: Using Ansible Playbooks for Configuration Management
contributor:
    name: Joshua Lyman
    link: https://twitter.com/jlyman
external_resources:
 - '[Ansible Home Page](http://www.ansible.com/home)'
 - '[Ansible Documentation](http://docs.ansible.com/ansible/index.html)'
 - '[Ansible Example Playbooks (GitHub)](https://github.com/ansible/ansible-examples)'
---

Consider the monotony of administering a server fleet; keeping all your servers updated, pushing needed changes out to them, copying files, and more. *[Ansible](http://www.ansible.com/home)* is a helpful tool that works to streamline these administration tasks by creating groups of machines, describe how those machines should be configured, what actions should be taken on them, and provides the ability to issue all of these commands from a  single central location. Ansible only runs on your main control machine, which can be your laptop, desktop, or even a Linode. By the end of this guide, you'll have the tools needed to turn a brand new Linode into a simple web server (Apache, MySQL, PHP), easily replicable and adjustable, only through Ansible playbooks.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide. Some systems may require you to run Ansible commands as root. If so, prefix the `ansible` commands in this guide with `sudo`.
{{< /note >}}

## Before You Begin

Make sure that you're familiar with the concepts described in our [Getting Started With Ansible Guide](/docs/applications/configuration-management/getting-started-with-ansible).

## Ansible Configuration via Playbooks

**Playbooks** in Ansible define a series of actions to run, and address particular sets of servers. It's important to note that, unlike some other configuration tools, a playbook does not describe a state of the machine, with Ansible determining all the changes that need to be made on its own. However, playbooks should be designed to be idempotent, meaning that they can be run more than once without negative effects. For example, a playbook might have a task that sets up a configuration file for a server and injects a few variables. The playbook should be written such that Ansible can take the template configuration file, compare it to the actual file, and create/update it only if necessary. Luckily, many Ansible **modules** take care of the heavy lifting for that.

You can write playbooks to perform initial server configurations, add users and directories, ensure certain software packages are installed or uninstalled, move files, etc. A playbook can also run a few commands on one set of machines, switch to a different set to run different commands, and then switch back to the original or a different set of machines. It is procedural, and tasks are run in order, top to bottom.

A playbook is a YAML file, and typically follows this structure:

{{< file "Sample Playbook YAML file" yaml >}}
---
- hosts: [target hosts]
  remote_user: [yourname]
  tasks:
    - [task 1]
    - [task 2]

{{< /file >}}

For example, the following playbook would log in to all servers in the `marketingservers` group and ensure Apache was started.

{{< file "Sample service check playbook" yaml >}}
---
- hosts: [marketingservers]
  remote_user: webadmin
  tasks:
    - name: Ensure the Apache daemon has started
      service: name=httpd state=started
      become: yes
      become_method: sudo

{{< /file >}}

In the playbook above is an example of a task:

{{< file "Playbook task" yaml >}}
tasks:
  - name: Ensure the Apache daemon has started
    service: name=httpd state=started
    become: yes
    become_method: sudo

{{< /file >}}


Every task should have a name, which is logged and can help you track progress. Following the name line is the module that will be run (in this case, the [service module](http://docs.ansible.com/ansible/service_module.html), and the other attributes provide more options, in this case instructing Ansible to use `sudo` privileges (which we will configure later).

### Running Playbooks

Executing a playbook is even easier than running ad-hoc commands like we did earlier. Assuming you are in the same directory as a playbook file, you run the following command:

    ansible-playbook myplaybook.yml

If you want to see what hosts this playbook will affect without having to open up the YAML file, you can run:

    ansible-playbook myplaybook.yml --list-hosts

### Types of Tasks You Can Run

Ansible ships with a large collection of [modules](https://docs.ansible.com/ansible/latest/user_guide/modules_intro.html) that you can run as tasks or via ad-hoc commands. To see a listing of all available modules, run:

    ansible-doc -l

A few common core modules you might be interested in learning first include:

* [command - Executes a command on a remote node](http://docs.ansible.com/ansible/command_module.html)
* [script - Runs a local script on a remote node after transferring it](http://docs.ansible.com/ansible/script_module.html)
* [shell - Execute commands in nodes](http://docs.ansible.com/ansible/shell_module.html)
* [mysql_db - Add or remove MySQL databases from a remote host](http://docs.ansible.com/ansible/mysql_db_module.html)
* [mysql_user - Adds or removes a user from a MySQL database](http://docs.ansible.com/ansible/mysql_user_module.html)
* [postgresql_db - Add or remove PostgreSQL databases from a remote host](http://docs.ansible.com/ansible/postgresql_db_module.html)
* [postgresql_user - Adds or removes a users (roles) from a PostgreSQL database](http://docs.ansible.com/ansible/postgresql_user_module.html)
* [fetch - Fetches a file from remote nodes](http://docs.ansible.com/ansible/fetch_module.html)
* [template - Templates a file out to a remote server](http://docs.ansible.com/ansible/template_module.html)
* [yum - Manages packages with the yum package manager](http://docs.ansible.com/ansible/yum_module.html)
* [apt - Manages apt-packages](http://docs.ansible.com/ansible/apt_module.html)
* [git - Deploy software (or files) from git checkouts](http://docs.ansible.com/ansible/git_module.html)
* [service - Manage services](http://docs.ansible.com/ansible/service_module.html)

You can also see a full list of modules assorted by category by navigating to [Ansible's Module Index Page](https://docs.ansible.com/ansible/latest/modules/modules_by_category.html).


## Basic Web Server Setup via Ansible Playbooks

As an example, we'll use Ansible to turn a freshly created Linode server into a web server, configured with Apache, MySQL, and PHP, ready to serve up dynamic sites and configured with the proper users and permissions. For brevity we won't handle all of the features and configuration that might normally be involved, but will cover enough to get you started.

  {{< caution >}}
The following playbooks are for learning purposes only, and will not result in a fully hardened or secure server. Use them to learn from, but do not use them for production without including additional security steps.
{{< /caution >}}

### Prerequisites

- This example can be configured using two separate Linodes on Debian 9, one which will serve as a master node with an [Authentication Key Pair](https://www.linode.com/docs/security/securing-your-server/#create-an-authentication-key-pair) pre-generated and [Ansible](/docs/applications/configuration-management/getting-started-with-ansible/#install-ansible) pre-installed. Your second Linode should have no initial configuration tasks performed. We will add our public encryption key from our master node using playbooks so that we can complete all configuration tasks through our master node.

- Because Ansible playbooks are idempotent and can be run repeatedly without error, the **user** task checks that a user exists and that the password on file (which the system stores hashed) matches the hash you are supplying. Therefore you cannot (and should not) just put in a plaintext password, you must pre-hash it.

- Create a password hash on your master for Ansible to use in a later step. An easy method is to use Python's PassLib library, which can be installed with the following commands:

        sudo apt install python-pip
        sudo pip install passlib


    Once installed, run the following command, replacing `plaintextpassword` with a password you'd like to use to access your node:

        python -c "from passlib.hash import sha512_crypt; print sha512_crypt.encrypt('plaintextpassword')"

    The number that appears following this command will be the hash for your password.

- Since we are automating the process of adding our SSH key, we'll need to install `sshpass` in order to be able to initially log in and install our SSH key successfully through a playbook:

        apt-get install sshpass

- Since `sshpass` does not support host key checking, something performed by default on ansible, open the `/etc/ansible/ansible.cfg` file in a text editor of your choice and uncomment the following line to disable it:

    {{< file "/etc/ansible/ansible.cfg" ini >}}
#host_key_checking = False

{{< /file >}}



### Create the System User


2.  Add your node's IP address to your Ansible master's `hosts` file so that we can address it. Give the new server a group name to make it easier to refer to later. In our example the group name is `linode`.

    {{< file "/etc/ansible/hosts" ini >}}
[linode]
123.123.123.123

{{< /file >}}


3.  Write a playbook that creates a new normal user, adds in our public key, and adds the new user to the `sudoers` file.

    We're introducing a new aspect of Ansible: **variables**. Note the `vars:` entry and the `NORMAL_USER_NAME` line. You'll notice that it is reused twice in the file so that we only have to change it once. Replace `yourusername` with a new username of your choice, ensure that the path for the `authorized_key` is correct, and the password hash you generated earlier is in the password field.

    {{< file "initialize_basic_user.yml" yaml >}}
---
- hosts: linode
  remote_user: root
  vars:
    NORMAL_USER_NAME: 'yourusername'
  tasks:
    - name: "Create a secondary, non-root user"
      user: name={{ NORMAL_USER_NAME }}
            password='$6$rounds=656000$W.dSlhtSxE2HdSc1$4WbCFM6zQV1hTQYTCqmcddnKrSXIZ9LfWRAjJBervBFG.rH953lTa7rMeZNrN65zPzEONntMtYt9Bw74PvAei0'
            shell=/bin/bash
    - name: Add remote authorized key to allow future passwordless logins
      authorized_key: user={{ NORMAL_USER_NAME }} key="{{ lookup('file', '/root/.ssh/id_rsa.pub') }}"
    - name: Add normal user to sudoers
      lineinfile: dest=/etc/sudoers
                  regexp="{{ NORMAL_USER_NAME }} ALL"
                  line="{{ NORMAL_USER_NAME }} ALL=(ALL) ALL"
                  state=present

{{< /file >}}


4.  Save the playbook file as `initialize_basic_user.yml` and run the playbook with the following command. Note how we specify the use of a particular user (`-u root`) and force Ansible to prompt us for the password (`-ask-pass`) since we don't have key authentication set up yet. As part of this step, we'll install our public key:

        ansible-playbook --ask-pass -u root initialize_basic_user.yml

      You should see output from Ansible that reports that the three tasks all completed successfully with a status of "changed." We can now work with new playbooks using our normal user account and keys.

### Configure the Base System

Let's take care of some common server setup tasks, such as setting the timezone, updating the hosts file, and updating packages. Here's a playbook covering those steps:

{{< file "common_server_setup.yml" yaml >}}
---
- hosts: linode
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

Replace `yourusername` with the username you set up in your previous step, and run this playbook, using the plaintext sudo password you hashed earlier and your SSH key when prompted:

    ansible-playbook common_server_setup.yml --ask-become-pass

As you run this playbook you will again see the steps come across as "changed." Updating packages may take a few minutes.

### Install the Stack

Finally, let's get a very basic server set up with Apache and PHP, and a test MySQL database to use.

1.  The following playbook downloads the appropriate packages, turns on the Apache and MySQL services, and creates a basic database and user.

    {{< file "setup_webserver.yml" yaml >}}
---
- hosts: linode
  remote_user: yourusername
  become: yes
  become_method: sudo
  tasks:
    - name: "Install Apache, MySQL, and PHP5"
      apt: name={{ item }} state=present
      with_items:
        - apache2
        - mysql-server
        - python-mysqldb
        - php
        - php-pear
        - php-mysql

    - name: "Turn on Apache and MySQL and set them to run on boot"
      service: name={{ item }} state=started enabled=yes
      with_items:
        - apache2
        - mysql

    - name: Create a test database
      mysql_db: name=testDb
                state=present

    - name: Create a new user for connections
      mysql_user: name=webapp
                  password=mypassword
                  priv=*.*:ALL state=present

{{< /file >}}


2.  Run the playbook from your control machine with the following command:

        ansible-playbook setup_webserver.yml --ask-become-pass

    When this playbook finishes, visit your Linode's IP address or FQDN to see the default Ubuntu Apache index page.

3.  Log in to the Linode we just configured via SSH and check to see that the `testDb` has indeed been created:

         sudo mysql -u root -p
         show databases;

    You can even create a sample PHP page and place it in `/var/www/html` to test that PHP is active on the server.


## Exploring Ansible Further

This is just the start of learning Ansible, and as you continue to learn and explore you will find it a truly powerful and flexible tool. Take a look at some of the example Ansible playbooks provided by the company itself.

Below are a few topics to explore that become important as you create playbooks of any complexity, and that you will see frequently in others' playbooks.

* [Ansible Example Playbooks (GitHub)](https://github.com/ansible/ansible-examples)
  * [WordPress + nginx + PHP-FPM](https://github.com/ansible/ansible-examples/tree/master/wordpress-nginx)
  * [Simple LAMP Stack](https://github.com/ansible/ansible-examples/tree/master/lamp_simple)
  * [Sharded, production-ready MongoDB cluster](https://github.com/ansible/ansible-examples/tree/master/mongodb)
* [Ansible Documentation](http://docs.ansible.com/ansible/index.html)
* Important Next Topics:
  * [Users, and Switching Users](http://docs.ansible.com/ansible/playbooks_intro.html#hosts-and-users) and [Privilege Escalation](http://docs.ansible.com/ansible/become.html)
  * [Handlers: Running Operations On Change](http://docs.ansible.com/ansible/playbooks_intro.html#handlers-running-operations-on-change)
  * [Roles](http://docs.ansible.com/ansible/playbooks_roles.html)
  * [Variables](http://docs.ansible.com/ansible/playbooks_variables.html)
  * [Playbook Best Practices](http://docs.ansible.com/ansible/playbooks_best_practices.html)
