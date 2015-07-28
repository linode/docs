# Deploying a LAMP stack fast and easily with Ansible

What's your definition of easy? And what about fast? Well, no matter what answer you have, Ansible can accomplish that! Sounds a little bit arrogant no?, but at the end of this paper I could bet that it accomplishes those goals.

For those who don't know about Ansible, it's one of the most simple and efficient Configuration Manager tool. The short learning curve and the _almost_ non-dependencies on the server-side are the most attractive characteristics of Ansible. Actually, two to four hours of reading the direct and detailed [documentation](http://docs.ansible.com/ansible/index.html) and you're ready to play with your servers!

In this guide we will learn how to install Ansible on your desktop, write a _playbook_ that deploys a Linux, Apache, MySQL and PHP stack application and implement some security best-practises on MySQL service. The majority of Linux distributions have an Ansible package on theirs repository, so you can call your specific package manager to procedure with the installation on your desktop. In this guide, we will consider that you're playing from a Debian desktop.

## First steps

You have two options to setup your desktop to use Ansible. The first is from the package repositories: with that you'll have the confidence that it will not blow up your desktop, but you'll be always one or two steps behind the most advanced and exciting features. But the choice is up to you. At first we will show the installation from the official repositories. If you're running Debian 8 "jessie", you will get the 1.7.x version:

```
$ sudo aptitude install ansible
```

If you like adventures or just really _need_ to use some new or under development module, you can clone their [GitHub](http://github.com/ansible/ansible) repository. You should get a newer version. After cloning you'll have to setup your environment:

```sh
$ git clone git://github.com/ansible/ansible.git
$ cd ./ansible
$ sudo source ./hacking/env-setup
```

To avoid some errors during our initial setup we recommend you to use those parameters on Ansible config file `/etc/ansible/ansible.cfg` and installs the `sshpass` package necessary by Python to setup the secure connection.

Content of `/etc/ansible/ansible.cfg`:

```
ask_pass          = True
scp_if_ssh        = True
host_key_checking = False
```

Procede with installation of `sshpass`:

```sh
$ sudo aptitude install sshpass
```

To test our initial setup, you can `ping` one host defined in your inventory file ``/etc/ansible/hosts``. For this guide we will only use one host as a managed host, so, at first, we must update our inventory with and then call Ansible to ping the remote host:

```sh
$ sudo echo lampsrv.localdomain >> /etc/ansible/hosts
$ ansible -u root -m ping lampsrv.localdomain
```

We used the `-u` parameter to declare which user we will connect to the remote host. By default, Ansible will use the `$USER` environment variable. If you're running with _root_, obviously this parameter can be omitted.

Tip: you can specify the path of the inventory file with the `-i` parameter. It defaults to `/etc/ansible/hosts`.

If everything runs fine, you will see something like this:

```sh
$ sudo ansible -m ping lampsrv.localdomain
SSH password:
lampsrv.localdomain | success >> {
        "changed": false,
         "ping": "pong"
}
```

## Ad-hoc commands

At this point you already can play with one of the +375 [modules](http://docs.ansible.com/ansible/list_of_all_modules.html) available. Imagine that you need to install the Apache HTTP server. This could be accomplished easily with the [yum](http://docs.ansible.com/ansible/yum_module.html), [apt](http://docs.ansible.com/ansible/apt_module.html) or any one of the more than 30 modules that handles OS packages management.

> __Note:__  
> For this guide, we'll consider that you're running your playbooks into a CentOS/Red Hat based distribution.

Here an example of an ad-hoc command. The flag `-m` tells Ansible wich module to use and the `-a` provides the arguments we want, in this case, the _name_ of the package and the _state_ of it:

```sh
$ sudo ansible -m yum -a "name=httpd state=present" lampsrv.localdomain
```

We can take advantage of this moment and talk about another important feature of Ansible: __idempotency__. It allows you to run as many times you want an _task_ and Ansible will take care to see if it's already been done, if so he doesn't do anything, and returns the `"changed": false` message.

Let's prove that running the last ad-hoc command on the same host:

```sh
$ sudo ansible -m yum -a "name=httpd state=present" lampsrv.localdomain
SSH password:
lampsrv.localdomain | success >> {
        "changed": false,
         "msg": "",
         "rc": 0,
         "results": [
                 "httpd-2.2.15-39.el6.centos.x86_64 providing httpd is already installed"
         ]
}
```

Another possibility is the _mass-update_ of your server to apply some security patchs, in example. To do that you can use the `all` parameter to tell Ansible to target all the hosts in the inventory file or you can leverage into groups defined in the inventory.

Imagine that you have an `webserver` group that contains all the Apache servers and you must update the OpenSSL package due a critical vulnerability. Both possibilities are demonstrated below:

```sh
[ affects all the hosts on inventory file ]
$ sudo ansible -m yum -a "name=openssl state=latest" all

[ affects only the webserver hosts group ]
$ sudo ansible -m yum -a "name=openssl state=latest" webserver
```

The inventory file has many features, like parametrization, variables set, group hierarchy and many others. For more information, please consider reading the [inventory official documentation](http://docs.ansible.com/ansible/intro_inventory.html).

## The LAMP stack deploy playbook

> __Note:__  
> We will assume that you already have read the initial chapters of the Ansible documentation and understand the very principal concepts, structure and terminology of it. _We seriously recommend reading those docs!_

First basic thing you must know about playbooks: Ansible calls _playbook_ a logic sequence of _tasks_ that execute a specific _module_. Now that you know __everything__ about playbooks and their power, we will describe how we would like your LAMP stack to be. This guide will not cover the basic setup of your server, like NAT rules, networking access, etc. We will consider that our only problem is configuring the software stack.

### Local file structure

So lets begin with creation of a basic directory structure. It should have these directories:

- __ansible-lamp/:__ the project directory
- __files/:__ archive usually static [CHECK] files that we'll send to the server
- __templates/:__ will archive the template files on [Jinja2](http://jinja.pocoo.org/docs/dev/) format

Create them in your preferred local path:

```sh
$ mkdir -p ansible-lamp/{files,templates}
```

The result should be something like this:

```sh
$ tree ansible-lamp/
ansible-lamp/
├── files/
├── templates/
└── deploy_lamp.yml

2 directories, 1 file
```

That structure is recommended by the official documentation and is very handy when you're writing more extense playbooks, with `roles`, `handlers` and that more sophisticated stuff. We won't touch it in this guide.

### The playbook, finally!

The really fun part starts here! Now we will begin to write our deploy playboook. We will describe the the header content, that specifies the target host, variables, user to connect, etc. The excerpt below examples that:

```yaml
---
- hosts: lampsrv.localdomain
  remote_user: root

  vars:
    mysql_root_passwd: toomuchcomplex

  vars_prompt:
    - name: "mysql_dbname"
      prompt: "Database name"
      private: no

    - name: "mysql_username"
      prompt: "Database username"
      private: no

    - name: "mysql_passwd"
      prompt: "Database user password"
      private: yes
```

This [YAML](http://yaml.org/) code above is declaring, in a _hardcoded_ way, the MySQL administrator password to the variable `mysql_root_passwd` and _prompting_ the database name, username and password, assigning them to `mysql_dbname`, `mysql_username` and `mysql_passwd` respectively.

This will generate something like that when you run them now using the `ansible-playbook` tool:

```sh
$ ansible-playbook deploy_lamp.yml
SSH password:
Database name: rock
Database username: rush
Database user password:

PLAY [lampsrv.localdomain] ****************************************************

GATHERING FACTS ***************************************************************
ok: [lampsrv.localdomain]

PLAY RECAP ********************************************************************
lampsrv.localdomain        : ok=1    changed=0    unreachable=0    failed=0
```

Note that we used the `ansible-playbook` now. When we are running our playbooks, that's the one you should call.

After setting up those principal variables we may start the really fun part! We will first install all the packages and its dependencies. We will continue using the known `yum` module and include the `service` module, that handles the majority kinds of init system: BSD init, OpenRC, SysV, Solaris SMF, systemd, upstart.

```yaml
  tasks:
    - name: Install/Updates Apache, MySQL, PHP and OpenSSL pkgs
      yum: name={{ item }} state=latest
      with_items:
          - httpd
          - mysql
          - mysql-server
          - php
          - php-mysql
          - MySQL-python
          - openssl
    - name: Start and enable Apache HTTP  and MySQL services
      service: name={{ item }} pattern={{ item }}
               state=started enabled=yes
      with_items:
          - httpd
          - mysqld
```

Lets play it again to see what happens (snipped resumed):

```
PLAY [lampsrv.localdomain] ****************************************************

GATHERING FACTS ***************************************************************
ok: [lampsrv.localdomain]

TASK: [Install/Updates Apache, MySQL, PHP and OpenSSL pkgs] *******************
changed: [lampsrv.localdomain] => (item=httpd,mysql,mysql-server,php,php-mysql,MySQL-python,openssl)

TASK: [Start and enable Apache HTTP and MySQL services] ***********************
changed: [lampsrv.localdomain] => (item=httpd)
changed: [lampsrv.localdomain] => (item=mysqld)

PLAY RECAP ********************************************************************
lampsrv.localdomain        : ok=3    changed=2    unreachable=0    failed=0
```

Now that we have executed our small playbook on our fresh host, we can log into it and confirm that the servers are running and enabled at boot:

```sh
[root@lampsrv ~]# netstat -lntp
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address               Foreign Address             State       PID/Program name
tcp        0      0 0.0.0.0:22                  0.0.0.0:*                   LISTEN      1174/sshd
tcp        0      0 0.0.0.0:3306                0.0.0.0:*                   LISTEN      3180/mysqld
tcp        0      0 0.0.0.0:80                  0.0.0.0:*                   LISTEN      3011/httpd

[root@lampsrv ~]# chkconfig --list | egrep 'httpd|mysqld'
httpd              0:off    1:off    2:on    3:on    4:on    5:on    6:off
mysqld             0:off    1:off    2:on    3:on    4:on    5:on    6:off
```

Cool, now we have MySQL running, but without any basic customization or hardening. Ansible has some modules that handles specially with some operations on it and some [others databases](http://docs.ansible.com/ansible/list_of_database_modules.html). In this guide we will only use two modules:

- __mysql_user:__ add/remove/edit users from the database.
- __mysql_db:__ add/remove/edit databases from the host.  

But to we be able to set those attributes we must have root level access to the MySQL server. To achieve that, we first must set it's password. We will do that copying the file `root_.my.cnf.j2` that contains only the password of root superuser, that we set in the beginning of our playbook, in the `vars:` section.  

Contents of `templates/root_.my.cnf.j2` file:

```ini
[client]
user=root
password={{ mysql_root_passwd }}
```

Then we'll reference it on our playbook using the `template` module, pointing it's destiny:

```yaml
    - name: Copy .my.cnf file with root credentials
      template: src=templates/root_.my.cnf.j2
                dest=/root/.my.cnf
                owner=root group=root mode=0600
```

The next tasks will create the new application database, create the user of the database and assign permission only on it and setup some security _best-practises_ recommended by MySQL itself, as: remove `anonymous` user and delete the `test` database.

```yaml
    - name: Create the new database
      mysql_db: name={{ my_dbname }} state=present

    - name: Create the new user and give apropriate permission
      mysql_user: name={{ my_username }} password={{ my_passwd }}
                  priv={{ my_dbname }}.*:ALL state=present

    - name: Ensure absense of anonymous user
      mysql_user: name='' host={{ item }} state=absent
      with_items:
        - localhost
        - "{{ inventory_hostname }}"

    - name: Remove the test database
      mysql_db: name=test state=absent
```

That's it! With these less than ten simples tasks, everyone in your team can setup a LAMP service in a minute.

## Final considerations

Ansible offers the power of a full & complete automation, continuous integration and orchestration tool in a simple way. We do not need some fancy infrastructures or excessive dependencies to play with it. It's community has been growing rapidly and there are some really nice examples to follow up. The project is big, and probably any task that you will need to do is implemented in a module. If not, you are encouraged to create your own, as it just need an standard output in JSON.
