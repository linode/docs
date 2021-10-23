---
slug: test-guide-delete-me
author:
  name: Linode Community
  email: docs@linode.com
description: 'Learn how to deploy two webservers along with a logserver and a database server using Ansible.'
keywords: ["ansible", "playbook", "bash script", "linode cli", "apache", "mariadb", "rsyslog", "lamp", "python"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-10-18
modified_by:
  name: Linode
title: "Automate deployment of webserver using Ansible."
h1_title: "How to Deploy a Webserver, Logserver, and Database server with Ansbile."
enable_h1: true
contributor:
  name: Nygel Bennett
  link: https://github.com/bennettnw2
external_resources:
- '[Ansible User Guide](https://docs.ansible.com/ansible/latest/user_guide/index.html)'
---

## What is Ansible?
Ansible is an open-source, software provisiong tool that automates application and IT infrastructure deployment. It is lightweight and agent-less, meaning there is no client or server software to install. Ansible uses SSH and Python to accomplish these amazing automation tasks.

In this guide you will:
* Deploy and configure 5 linodes. One will the be the Ansible control node and the others will be worker nodes.
* Configure and run an Ansible playbook that will configure the worker nodes.
* Test and see your running webservers and logserver.

{{< caution >}}
This guide's example instructions will create 5, [1GB Linodes](https://www.linode.com/pricing) (also known as Nanodes). These will be billable resources to your Linode account.  If you do not want to keep using the Linodes created, be sure to [delete the resources](https://www.linode.com/docs/guides/billing-and-payments/#removing-services) once you have finished this how-to.

If you remove these resources afterward, you will only be [billed for the time](https://www.linode.com/docs/guides/how-linode-billing-works/) the resources were present on your account.
{{</ caution >}}

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

## Prerequisites
* Intermediate understanding of the Bash shell and it's utilities.
* Linode CLI [(install instructions)](https://www.linode.com/docs/products/tools/cli/get-started/#install-the-cli) or you can use the Cloud Manager GUI.
  * Using the CLI will allow you to save time creating, labeling, and tagging your Linodes.
* Grab these files from Github.
  * Download into a file and work from this file location.

## Create, label, and tag 5 linodes.
### 1. Create 5 linodes using the Linode-CLI utility.
On your local machine, Set up an environment variable which will be used in the for loop to create the 5 linodes. Please substitute `yourpassword` for a secure password as this will be the password for all your newly created Linodes.

        pass=yourpassword

Check that it works by running `echo $pass` and you should see `yourpassword` as the output.

{{< output >}} 
$ pass=madeuppassword
$ echo $pass
madeuppassword
{{</ output >}} 

Run the below command to create 5 linodes.

        for i in {1..5}; do linode-cli linodes create --root_pass $pass; done

### 2. Grab the Linode ids and put them into a temp file. We will use these ids to tag and label the linodes.

         linode-cli linodes list --text | tail -5 | awk '{print $1}' > tmp.txt

### 3. Tag the linodes with "Ansible" so they are grouped together in the Linode Cloud Manager.
        
        for i in $(cat tmp.txt); do linode-cli linodes update --tags Ansible $i; done

### 4. Label the 5 linodes as vm1 to vm5.
Loop through the linode's ids from the temp file and assign each Linode a numbered label.

        i=1; for j in $(cat tmp.txt); do linode-cli linodes update --label vm$i $j; let "i++"; done



## Send configuration files from local machine to control node.
### 1. Using `scp`, send scripts and Ansible playbook to vm1 which will be our Ansible control node.

Replace `VM1_IPADDRESS` with the IP address obtained from either the Linode-CLI or Cloud Manager GUI.

        scp ansibleCP_setup.sh ansibleWK_setup.sh myplaybook.yml root@VM1_IPADDRESS:

{{< caution >}}
Do not forget the colon `:` at the end of this command
{{</ caution >}}

### 2. Log into vm1 and run `ansibleCP_setup.sh` to update, secure, and install needed apps on the Linode.
SSH into vm1.

        ssh root@VM1_IPADDRESS
Change the permissions on `ansibleCP_setup.sh` and `ansibleWK_setup.sh` to be executable.

        chmod 744 ansibleCP ansibleWK

Execute `ansibleCP_setup.sh` script.

        ./ansibleCP_setup.sh

{{<note>}}
The script will ask you to enter a username.
{{</note>}}

### 3. Log out and reboot the Linode using linode-cli or cloud manager GUI.
Replace **LINODE_ID** with the Linode ID of **vm1** obtained either from the Linode-CLI or Cloud Manager GUI.

        linode-cli linodes reboot LINODE_ID

### 4. SSH into vm1.

       ssh YOUR_USERNAME@VM1_IPADDRESS 

You should see the hostname configured on the command prompt along with your username.

{{<output>}}
Put example here of what it will look like. 
{{</output>}}

## Configure control node a bit more. 

### 1. Set up `/etc/hosts` file on control node with ips for ansible workers
This enables us to use hostnames when referring to different vm's.  Run the below command from your local machine and then copy and paste the output to the end of `/etc/hosts` on vm1.

        linode-cli linodes list --text | grep vm | awk '{print $7,$2,$2".ansi.com"}' | column -t

The output will look like this:

{{<output>}}
172.104.26.209  vm1  vm1.ansi.com
172.104.26.246  vm2  vm2.ansi.com
172.104.26.229  vm3  vm3.ansi.com
172.104.26.48   vm4  vm4.ansi.com
172.104.26.108  vm5  vm5.ansi.com
{{</output>}}

Copy and paste this output to the end of the `/etc/hosts/` file on vm1.

Check to make sure you can ping all the hostnames

        for i in {1..5}; do ping -c 2 vm$i; done

### 2. Configure Ansible Configs on the Control Plane

Copy this configuration file, `ansible.cfg`, to your home folder.

{{< file "/home/YOUR_USERNAME/ansible.cfg" yaml >}}
[defaults]
inventory = $HOME/hosts
{{</ file >}}

Copy this hosts configuration file located to your home folder as well.

 {{< file "/home/YOUR_USERNAME/hosts">}}
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
{{</ file >}}

Confirm we can reach all the hosts

         ansible all --list-hosts

Confirm we can ping all the hosts

        ansible all -m ping

## Set up Ansible playbook to configure worker nodes
The playbook is already written out for you. All that is needed is to add two parameters; a hashed password and an IP address.
### 1. Create hashed, plaintext password
Run this command from your Ansible control plane.

         `python3 -c "from passlib.hash import sha512_crypt; import getpass; print(sha512_crypt.hash(getpass.getpass()))"
  * enter the password that you will use to access the webserver.
  * copy from the dollar sign to the period;
  * paste the resulting hashed password into `myplaybook.yml`
### 2. Configure logserver
  * grab ip address of logging sever and paste into `configure rsyslog` section

## Send script to each managed node.
### 1. Configure Ansible worker nodes from control node
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

