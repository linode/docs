---
author:
    name: Linode Community
    email: docs@linode.com
description: 'A quick getting started guide to Ansible, with a demo of how to provision a basic web server with Ansible'
keywords: 'ansible,ansible configuration,provisioning,infrastructure,automation,configuration,configuration change management,server automation'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Thursday, August 6th, 2015'
modified: Thursday, August 6th, 2015
modified_by:
    name: Linode
title: 'Getting Started with Ansible'
contributor:
    name: Joshua Lyman
    link: https://twitter.com/jlyman
external_resources:
 - '[Ansible Home Page](http://www.ansible.com/home)'
 - '[Ansible Documentation](http://docs.ansible.com/ansible/index.html)'
 - '[Ansible Example Playbooks (GitHub)](https://github.com/ansible/ansible-examples)'
---

## About Ansible

The drudge work of administering Linodes: setting up a server, and especially multiple servers, keeping them all updated, pushing changes out to them, copying files, etc. Things can get complicated and time consuming very quickly, but it doesn't have to be that way. *[Ansible](http://www.ansible.com/home)* is a very helpful tool that allows you to create groups of machines, describe how those machines should be configured or what actions should be taken on them, and issue all of these commands from a central location. It uses simple SSH, and so nothing is required to be installed on the machines you are targeting, needing only Ansible's installed files on your main control machine (can even be your laptop!). It is a simple solution to a complicated problem.

In this guide you will be introduced to the basics of Ansible, and will get it installed and up and running. By the end of this guide, you'll have the tools needed to turn a brand new Linode VPS into a simple web server (Apache, MySQL, PHP), easily replicatable and adjustable. (And why not go ahead and try it? With Linode's hourly billing you can experiment with this guide for just a few cents.)


## Installation

Ansible only needs to be installed on the *control machine*, or the machine from which you will be running commands. This will likely be your laptop or other computer from which you frequently access your server, or it may be a centralized server in more complicated setups.

Make sure that you have Python 2.x available on the control machine (Ansible is not compatible with Python 3, nor can you use Windows as the control machine). You can easily [build Ansible from source](https://github.com/ansible/ansible) as is frequently done, or you can install the latest stable packages using the proper command below.

*Mac OS X:*

	sudo easy_install pip
	sudo pip install ansible

*CentOS/Fedora:*

	sudo yum install ansible
    
{: .note}
>
>The EPEL-Release repository may need to be added on certain versions of CentOS, RHEL, and Scientific Linux

*Ubuntu:*

	sudo apt-get install software-properties-common
	sudo apt-add-repository ppa:ansible/ansible
	sudo apt-get update
	sudo apt-get install ansible


## First Steps

Now that you have Ansible installed, let's test it out on a known server. All Ansible commands are executed via the command line (or batched in scripts), and follow the pattern:

	ansible <server_or_group> -m <module_name> -a <arguments>

We'll get to groups in just a moment, but for now, let's try to make a simple connection to an existing server you have using the ping module. In place of `<server_or_group>`, type the name of a server that you can currently SSH into from your machine using key authentication. If you are using a nonstandard SSH port, include that after a colon on the same line (`myserver.com:2222`). Also, by default Ansible will use the same username as your current machine's username. If this will not match up, pass the proper username in using the `-u [username]` argument.

{: .note}
> If you really don't want to use SSH keys or can't for some reason, you can add the `--ask-pass` switch to the following command.

In order to try an Ansible command without any additional setup, we'll add a few extra arguments for now. Format your command like the following:

	ansible all -i myserver.com, -m ping

{: .note}
> The extra bits are the "all -i" and the comma after your server name. This is temporary, and is only there to tell Ansible to try connecting directly to the server without an inventory file, which we'll learn about later.

If you are successful you should see output similar to the following:

	myserver.com | success >> {
	    "changed": false,
	    "ping": "pong"
	}

Hooray! You were just able to get a valid connection to your server via Ansible! Now let's talk briefly about your *Inventory* file and then move on to configuring the server via Ansible *Playbooks*.


## Inventory File

You executed an Ansible command against your server, but it would be a pain to have to type the host's address every single time, and what if you had several servers you wanted to apply the same configuration to? This is where Ansible's [Inventory file](http://docs.ansible.com/ansible/intro_inventory.html) comes into play. By default, this file is expected to be located at `/etc/ansible/hosts`. Create that path and file if it does not already exist. If you are running OS X, you may want to create your own Ansible directory elsewhere and then set the path in an Ansible configuration file, as in the following:

	# The ~/Path/To/ path below is up to you
	mkdir ~/Path/To/ansible
	touch ~/Path/To/ansible/hosts
	touch ~/.ansible.cfg

Open that new `~/.ansible.cfg` file and add the following lines:

{: .file-excerpt}
~/.ansible.cfg
:   ~~~ ini
    [default] 
	inventory = ~/Path/To/ansible/hosts 
    ~~~

Add an entry to your new hosts file, pointing to a server that you connected to in the previous section.  You can include multiple servers in this file, using either domains or IP addresses, and can even group them. Example:

{: .file-excerpt}
~/Path/To/ansible/hosts
:   ~~~ ini
    mainserver.com
	myserver.net:2222

	[mailservers]
	mail1.mainserver.com
	mail2.mainserver.com 
    ~~~

For now, just add one entry, save, and run the following command, very similar to before, to try and ping your server via Ansible.

	ansible all -m ping

You should receive the same output as previously. Note that this time you used `all` in place of your server name. This will, of course, run the command on all entries in your hosts Inventory file. You could likewise have substituted `mailservers` from the example file, and it would run just against those servers. You can get very fancy with the Inventory file, so [check out the docs for it](http://docs.ansible.com/ansible/intro_inventory.html) if you're interested.


## Configuration via Playbooks

*Playbooks* in Ansible define a series of actions to run, and address particular sets of servers. It's important to note that, unlike some other configuration tools, a playbook does not describe a state of the machine, with Ansible determining all the changes that need to be made on its own. However, playbooks should be designed to be idempotent, meaning that they can be run more than once without negative effects. For example, a playbook might have a task that sets up a configuration file for a server and injects a few variables. The playbook should be written such that Ansible can take the template configuration file, compare it to the actual file, and create/update it only if necessary. Luckily, many Ansible modules take care of the heavy lifting for that.

You can write playbooks to perform initial server configurations, add users and directories, ensure certain software packages are installed or uninstalled, move files, etc. A playbook can also run a few commands on one set of machines, switch to a different set to run some different commands, and then even switch back to the original or different set of machines. It is procedural, and tasks are run in order, top to bottom.

A playbook is a YAML file, and typically follows this type of structure:

{: .file-excerpt}
Sample Playbook YAML file
:   ~~~ yaml
    ---
	- hosts: [target hosts]
	  remote_user: [yourname]
	  tasks:
	    - [task 1]
	    - [task 2] 
    ~~~

For example, the following playbook would log in to all web servers and ensure Apache was started.

{: .file-excerpt}
Sample service check playbook
:   ~~~ yaml
	---
	- hosts: [marketingservers]
	  remote_user: webadmin
	  tasks:
	    - name: Ensure the Apache daemon has started
	      service: name=httpd state=started
	      become: yes
	      become_method: sudo 
    ~~~      

You see an example of a task in that playbook:

{: .file-excerpt}
Playbook task
:   ~~~ yaml	  
      tasks:
	    - name: Ensure the Apache daemon has started
	      service: name=httpd state=started
	      become: yes
	      become_method: sudo
    ~~~

Every task should have a name which gets logged and can help you track progress. Following the name line is the module that will be run (in this case, the [service module](http://docs.ansible.com/ansible/service_module.html)), and the other attributes provide more options, in this case instructing Ansible to become the root user.

### Running Playbooks

Executing a playbook is even easier than running ad-hoc commands like we did earlier! Assuming you are in the same directory as a playbook file, you run the following command:

	ansible-playbook myplaybook.yml

Done! If you want to see what hosts this playbook will affect without having to open up the YAML file, you can run:

	ansible-playbook myplaybook.yml --list-hosts

### Types of Tasks You Can Run

Ansible ships with a large collection of modules that you can run as tasks or via ad-hoc commands. To see a listing of all available modules, run:

	ansible-docs -l

A few common core modules you might be interested in learning off the bat include:

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


## Basic Web Server Setup via Playbooks

Let's get down to the business of turning a freshly created Linode server into a web server, configured with Apache, MySQL, and PHP, ready to serve up dynamic sites and configured with the proper users and permissions. For brevity we won't handle all of the features and configuration that might normally be involved, but will cover enough to get you started.

This guide will assume a brand new Ubuntu 14.04 LTS server, without any additional configuration already done to the box. The very first order of business will be to add in our public encryption keys so that we can connect without supplying passwords.

{: .note}
> You may want to SSH into your server just once so that your local machine records the Lindode's key fingerprint. Even if you don't, however, Ansible will prompt you to record it.

{: .caution}
> The following playbooks are for learning purposes only, and will NOT result in a hardened or secure server. Use them to learn from, but do not use them for production instances!

First, add your new server's IP to your Ansible `hosts` file so that we can address it (and remove any previous entries you may have added in the test sections above). Give the new server a group name to make it easy to refer to later. In my example here, I'm calling it "linode."

{: .file}
/etc/ansible/hosts
:   ~~~ ini
	[linode]
	123.123.123.123 
    ~~~

Let's write a playbook that creates a new normal user, adds in our public key, and adds the new user to the sudoers file so that we can use such a connection in the future. We're introducing a new aspect of Ansible here: *variables*. See the `vars:` entry and the `NORMAL_USER_NAME` line? You'll notice that it is reused twice in the file so that we only have to change it once. Replace `yourusername` with your choosen username, and `[localusername]` in the path for the `authorized_key`.

{: .file}
initialize_basic_user.yml
:   ~~~ yaml
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
	      authorized_key: user={{ NORMAL_USER_NAME }} key="{{ lookup('file', '/Users/[localusername]/.ssh/id_rsa.pub') }}"
	    - name: Add normal user to sudoers
	      lineinfile: dest=/etc/sudoers
	                  regexp="{{ NORMAL_USER_NAME }} ALL"
	                  line="{{ NORMAL_USER_NAME }} ALL=(ALL) ALL"
	                  state=present 
    ~~~

Let's quickly talk about the password supplied in the playbook. You may recognize it as a has (specifically SHA512), and for reference it is the hash of the actual password `irc7Pv4n`. Because Ansible playbooks are idempotent and can be run repeatedly without error, what the `user` task is actually doing is checking that a user exists and that the password on file (which the system stores hashed) matches the hash you are supplying. Therefore you cannot (and should not) just put in a plaintext password, you must prehash it. An easy way to do so is using Python's PassLib library, which can be installed with `sudo pip install passlib`, and then run the following command, replacing <plaintextpassword> with your actual password:

    python -c "from passlib.hash import sha512_crypt; print sha512_crypt.encrypt('<plaintextpassword>')"

Save the playbook file as `initialize_basic_user.yml` and run the playbook with the following command. Note how we specify the use of a particular user (`-u root`) and force Ansible to prompt us for the password (`-ask-pass`) since we don't have key authentication set up yet.

	ansible-playbook --ask-pass -u root initialize_basic_user.yml

If all went well, you should see output from Ansible that reports that the three tasks all completed successfully with a status of "changed." We can now work with new playbooks using our normal user account and keys.

Now let's get some common server setup tasks out of the way, such as setting the timezone, updating the hosts file, and updating packages. Here's a playbook for that:

{: .file}
common_server_setup.yml
:   ~~~ yaml
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
	      with_items: groups['linode']
	    - name: Update packages
	      apt: update_cache=yes upgrade=dist 
    ~~~

Run the command with a few less arguments:

	ansible-playbook common_server_setup.yml --ask-become-pass

As you run this playbook you will again see the steps come across as "changed." Updating packages may take a few minutes, so don't fret if it doesn't return straight away.

At any time now you can SSH into the server directly and verify that things are as you'd expect them (no new packages to update since that just occurred, hostname set, etc.). Even better, you could go in and adjust something--say change the timezone to the Rothera Research Station Time Zone in Antarctica--run the same playbook, and Ansible will change it back for you. The idempotency of Ansible playbooks is a powerful tool.

Finally, let's get a very basic server set up with Apache and PHP, and a test MySQL databases to use. The following playbook downloads the appropriate packages, turns on the Apache and MySQL services, and creates a basic database and user.

{: .file}
setup_webserver.yml
:   ~~~ yaml
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
	        - php5
	        - php-pear
	        - php5-mysql

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
    ~~~

And as before, run the playbook from your control machine with the following command.

	ansible-playbook setup_webserver.yml --ask-become-pass

When this playbook finishes, visit your Linode (probably via its IP address) to see the default Ubuntu Apache index page. Also, log in via SSH and check to see that the `testDb` has indeed been created (`mysql -u root -p`, `show databases;`). You can even create a sample PHP page and place it in `/var/www/html` to test that PHP is active on the server. Ansible has done as we instructed it to, installing the appropriate packages and setting things up as we want. Way to go Ansible!


## Exploring Further

This is just the start of learning Ansible, and as you continue to learn and explore you will find it a truly powerful and flexible tool. Next steps? Take a look at some of the example Ansible playbooks provided by the company itself, and make sure you read through the docs (it doesn't take very long). Also below are a few topics to explore that become important as you create playbooks of any complexity, and that you will see frequently in others' playbooks.

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