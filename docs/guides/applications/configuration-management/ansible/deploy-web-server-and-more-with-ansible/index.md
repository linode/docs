---
slug: test-guide-delete-me
author:
  name: Linode Community
  email: docs@linode.com
description: 'Deploy two webservers along with a logserver and a database server using Ansible.'
keywords: ["ansible", "playbook", "bash script", "linode cli", "apache", "mariadb", "rsyslog", "lamp", "python"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-10-18
modified_by:
  name: Linode
title: "Automate deployment of webserver using Ansible."
h1_title: "How to Deploy a Webserver with Ansbile."
enable_h1: true
contributor:
  name: Nygel Bennett
  link: https://github.com/bennettnw2
external_resources:
- '[Ansible User Guide](https://docs.ansible.com/ansible/latest/user_guide/index.html)'
---

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet--this guide includes firewall rules specifically for an OpenVPN server.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

<!-- Include one of the following notes if appropriate. --->

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}


{{< caution >}}
Highlight warnings that could adversely affect a user's system with the Caution style.
{{< /caution >}}

{{< file "/etc/hosts" aconf >}}
192.0.2.0/24      # Sample IP addresses
198.51.100.0/24
203.0.113.0/24
{{< /file >}}

## Overview
* What we are going to do and how we are going to do it.

## Prerequisites
* Intermediate understanding of Bash shell.
* Linode CLI (install instructions) or you can use the Cloud Manager GUI.
* Grab these files from Github.
  * Download into a file and work from this file location.

## Create, label, and tag 5 linodes.
### Create 5 linodes using the Linode-CLI utility.
Set up an environment variable which will be used in the loop to create the 5 linodes.
> `pass=yourpassword`

Check that it works by running `echo $pass` and you should see `yourpassword`
Run the below command to create 5 linodes.
* `for i in {1..5}; do linode-cli linodes create --root_pass $pass; done`

### Grab the Linode ids and put them into a temp file. We will use these ids to tag and label the linodes.
* `linode-cli linodes list --text | tail -5 | awk '{print $1}' > tmp.txt`

### Tag the linodes with "Ansible" so they are grouped together
* `for i in $(cat tmp.txt); do linode-cli linodes update --tags Ansible $i; done`

### Label the 5 linodes as vm1 to vm5
Loop through the linode's ids from the temp file and assign them their label.
* `i=1; for j in $(cat tmp.txt); do linode-cli linodes update --label vm$i $j; let "i++"; done`

## Send scripts and Ansible playbook to control node.
### Send scripts and ansible playbook to vm1 which will be our Ansible control node.
* `scp ansibleCP_setup.sh ansibleWK_setup.sh myplaybook.yml root@IPADDRESS:`

### Log into vm1, then run CP bash script to set up my prefered apps, settings, and secure the Linode.
* First need to chmod 744 ansibleCP and ansibleWK and then run `./ansibleCP_setup.sh`

### Log out and reboot the Linode using linode-cli or cloud manager GUI.
  * `linode-cli linodes reboot LINODE_ID`

### Send SSH key for `bennttnw2` to the Ansible control node.
  * `ssh-copy-id bennettnw2@IPADDRESS`
  * check by logging in without password

## Configure control node a bit more. 
### 6. Set up `/etc/hosts` file on control node with ips for ansible workers
* `linode-cli linodes list --text | grep vm | awk '{print $7,$2,$2".linode.com"}' | column -t`

```
172.104.26.209  vm1  vm1.linode.com
172.104.26.246  vm2  vm2.linode.com
172.104.26.229  vm3  vm3.linode.com
172.104.26.48   vm4  vm4.linode.com
172.104.26.108  vm5  vm5.linode.com
```

Check to make sure I can ping all the hostnames
* `for i in {1..5}; do ping -c 2 vm$i; done`

### 8. Configure Ansible Configs on the Control Plane
  * create a config file in `~/ansible.cfg`

  ```
  [defaults]
  inventory = $HOME/hosts
  ```

  * create a hosts file located at $HOME/hosts

 ```
 [webservers]
 vm2
 vm3

 [dbservers]
 vm4

 [logservers]
 vm5

 [lamp:children]
 webservers
 dbservers
 ```
  * confirm we can reach all the hosts
    * `ansible all --list-hosts`
  * confirm we can ping all the hosts
    * `ansible all -m ping`

## Set up Ansible playbook to configure worker nodes
### Create hashed, plaintext password
  * `python3 -c "from passlib.hash import sha512_crypt; import getpass; print(sha512_crypt.hash(getpass.getpass()))"`
  * enter the password that you will use to access the webserver.
  * copy from the dollar sign to the period;
  * paste the resulting hashed password into `myplaybook.yml`
### Configure logserver
  * grab ip address of logging sever and paste into `configure rsyslog` section

## Send script to each managed node.
### Configure Ansible worker nodes from control node
Upload script to each worker node
  * `echo 'freshjive234' > ~/.ssh/file` # this is needed to create a password file so you do not have to enter the password each time in the below loop.
  * `for i in {2..5}; do sshpass -f ~/.ssh/file scp ansibleWK_setup.sh root@vm$i:/root/; done`
Check to make sure each worker node has the script
  * `for i in {2..5}; do sshpass -f ~/.ssh/file ssh root@vm$i 'ls'; done`

From local computer, log into each node and run the ansibleWK\_setup.sh script

  * `sshpass -p $pass ssh -o StrictHostKeyChecking=no root@IPADDRESS`
reboot each worker node
    * `for i in $(cat tmp.txt); do linode-cli linodes reboot $i; done`

Upload ssh key for `bennettnw2` to worker nodes from the control node
  * `for i in {2..5}; do sshpass -f ~/.ssh/file ssh-copy-id bennettnw2@vm$i; done`

## Run the Ansible playbook to configure managed nodes.
### Run the playbook with: `ansible-playbook myplaybook.yml`

## Check to see if the playbook run was successful.

