---
slug: deploy-webserver-and-more-with-ansible
author:
  name: Nygel Bennett
  email: nygel.bennett@gmail.com
description: 'Learn how to deploy two web servers along with a log server and a database server using Ansible.'
keywords: ["ansible", "playbook", "bash script", "linode cli", "apache", "mariadb", "rsyslog", "lamp", "python"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-10-18
modified_by:
  name: Nygel Bennett
title: "Automate deployment of web server infrastructure using Ansible."
h1_title: "How to Deploy a Web Server, Log Server, and Database Server with Ansbile."
enable_h1: true
contributor:
  name: Nygel Bennett
  link: https://github.com/bennettnw2
external_resources:
- '[Ansible User Guide](https://docs.ansible.com/ansible/latest/user_guide/index.html)'
---

## What is Ansible?
Ansible is an open-source, software provisioning tool that automates application and IT infrastructure deployment. It is lightweight and agent-less, meaning there is no client or server software to install. Ansible uses SSH and Python to accomplish these amazing automation tasks.

In this guide you:
* Deploy and configure 5 Linodes. One is the Ansible control node and the others are worker nodes.
* Configure and run an Ansible playbook that configures the worker nodes.
* Test and confirm your running web servers and log server.

{{< caution >}}
This guide's example instructions creates 5, [1GB Linodes](https://www.linode.com/pricing) (also known as Nanodes). These are billable resources to your Linode account. If you do not want to keep using the Linodes created, be sure to [delete the resources](https://www.linode.com/docs/guides/billing-and-payments/#removing-services) once you have finished this how-to.

If you remove these resources afterward, you are only [billed for the time](https://www.linode.com/docs/guides/how-linode-billing-works/) the resources were present on your account.
{{</ caution >}}

## Prerequisites
* Intermediate understanding of the Bash shell and its utilities.
* Linode CLI [(install instructions)](https://www.linode.com/docs/products/tools/cli/get-started/#install-the-cli) or you can use the Cloud Manager GUI.
  * Using the CLI allows you to save time creating, labeling, and tagging your Linodes.

## Before You Begin
1. Create a folder to work from. For example, you can name it, **"Ansible_Infra"**.
2. Grab these three configuration [files from GitHub](https://github.com/bennettnw2/Ansible_webserver_infra_files) and save them into the folder just created.

       wget https://raw.githubusercontent.com/bennettnw2/Ansible_webserver_infra_files/main/ansibleCN_setup.sh
       wget https://raw.githubusercontent.com/bennettnw2/Ansible_webserver_infra_files/main/ansibleMN_setup.sh
       wget https://raw.githubusercontent.com/bennettnw2/Ansible_webserver_infra_files/main/myplaybook.yml

<!-- Include one of the following notes if appropriate. --->

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{</ note >}}

## Create, label, and tag 5 Linodes.
### 1. Create 5 Linodes using the Linode-CLI utility.
On your local machine, Set up an environment variable which is used in the for loop to create the 5 Linodes. Please substitute `yourrootpassword` for a secure password as this is used as the root password for all your newly created Linodes.

    pass=yourrootpassword

Check that it works by running `echo $pass` and you should see `yourrootpassword` as the output.

{{< output >}}
$ pass=madeuppassword
$ echo $pass
madeuppassword
{{</ output >}}

Run the below command to create 5 Linodes.

    for i in {1..5}; do linode-cli linodes create --root_pass $pass; done

Example output:
{{< output >}}
$ for i in {1..5}; do linode-cli linodes create --root_pass $pass; done
┌──────────┬────────────────┬─────────┬─────────────┬────────────────────┬──────────────┬────────────────┐
│ id       │ label          │ region  │ type        │ image              │ status       │ ipv4           │
├──────────┼────────────────┼─────────┼─────────────┼────────────────────┼──────────────┼────────────────┤
│ 31202535 │ linode31202535 │ us-east │ g6-nanode-1 │ linode/ubuntu20.04 │ provisioning │ 172.104.211.74 │
└──────────┴────────────────┴─────────┴─────────────┴────────────────────┴──────────────┴────────────────┘
┌──────────┬────────────────┬─────────┬─────────────┬────────────────────┬──────────────┬────────────────┐
│ id       │ label          │ region  │ type        │ image              │ status       │ ipv4           │
├──────────┼────────────────┼─────────┼─────────────┼────────────────────┼──────────────┼────────────────┤
│ 31202548 │ linode31202548 │ us-east │ g6-nanode-1 │ linode/ubuntu20.04 │ provisioning │ 172.104.211.86 │
└──────────┴────────────────┴─────────┴─────────────┴────────────────────┴──────────────┴────────────────┘
┌──────────┬────────────────┬─────────┬─────────────┬────────────────────┬──────────────┬─────────────────┐
│ id       │ label          │ region  │ type        │ image              │ status       │ ipv4            │
├──────────┼────────────────┼─────────┼─────────────┼────────────────────┼──────────────┼─────────────────┤
│ 31202559 │ linode31202559 │ us-east │ g6-nanode-1 │ linode/ubuntu20.04 │ provisioning │ 172.104.211.135 │
└──────────┴────────────────┴─────────┴─────────────┴────────────────────┴──────────────┴─────────────────┘
┌──────────┬────────────────┬─────────┬─────────────┬────────────────────┬──────────────┬─────────────────┐
│ id       │ label          │ region  │ type        │ image              │ status       │ ipv4            │
├──────────┼────────────────┼─────────┼─────────────┼────────────────────┼──────────────┼─────────────────┤
│ 31202570 │ linode31202570 │ us-east │ g6-nanode-1 │ linode/ubuntu20.04 │ provisioning │ 172.104.211.138 │
└──────────┴────────────────┴─────────┴─────────────┴────────────────────┴──────────────┴─────────────────┘
┌──────────┬────────────────┬─────────┬─────────────┬────────────────────┬──────────────┬─────────────────┐
│ id       │ label          │ region  │ type        │ image              │ status       │ ipv4            │
├──────────┼────────────────┼─────────┼─────────────┼────────────────────┼──────────────┼─────────────────┤
│ 31202576 │ linode31202576 │ us-east │ g6-nanode-1 │ linode/ubuntu20.04 │ provisioning │ 172.104.211.160 │
└──────────┴────────────────┴─────────┴─────────────┴────────────────────┴──────────────┴─────────────────┘
{{</ output >}}

### 2. Grab the Linode ids and put them into a temp file. We use these ids to tag and label the Linodes.

    linode-cli linodes list --text | tail -5 | awk '{print $1}' > tmp.txt

### 3. Tag the Linodes with "Ansible" so they are grouped together in the Linode Cloud Manager.

    for i in $(cat tmp.txt); do linode-cli linodes update --tags Ansible $i; done

### 4. Label the 5 Linodes as vm1 to vm5.
Loop through the Linode's ids from the temp file and assign each Linode a numbered label.

    i=1; for j in $(cat tmp.txt); do linode-cli linodes update --label vm$i $j; let "i++"; done

If you check the Cloud Manager GUI, you can see these 5 Linodes grouped under the tag "Ansible" and labeled vm1 through vm5.

![Cloud Manager GUI](cloud-gui-01.png "Cloud Manager GUI showing 5 Linodes grouped and labeled.")

## Send configuration files from local machine to control node.
### 1. Using `scp`, send scripts and Ansible playbook to vm1 which is our Ansible control node.

Replace `VM1_IPADDRESS` with the IP address obtained from either the Linode-CLI or Cloud Manager GUI.

{{< caution >}}
Do not forget the colon "**:**" at the end of this command
{{</ caution >}}

    scp ansibleCN_setup.sh ansibleMN_setup.sh myplaybook.yml root@VM1_IPADDRESS:

### 2. Log into vm1 and run `ansibleCN_setup.sh` to update, secure, and install needed apps on the Linode.
SSH into vm1.

    ssh root@VM1_IPADDRESS
Change the permissions on `ansibleCN_setup.sh` and `ansibleMN_setup.sh` to be executable.

    chmod 744 ansibleCN_setup.sh ansibleMN_setup.sh

Execute `ansibleCN_setup.sh` script. It takes approximately 7 minutes for the script to complete.

    ./ansibleCN_setup.sh

{{<note>}}
The script asks you to enter a username and password for the new user being created.
{{</note>}}

### 3. Log out and reboot the Linode using either the Linode-CLI or cloud manager GUI.
If using the below command, replace **LINODE_ID** with the Linode ID of **vm1** obtained either from the Linode-CLI or Cloud Manager GUI.

    linode-cli linodes reboot LINODE_ID

### 4. SSH into vm1.
Be sure to use the new user you created because the setup script disabled root logins.

    ssh YOUR_USERNAME@VM1_IPADDRESS

You should see the hostname, **CtlPlane**, configured on the command prompt along with your username.

{{< output >}}
nygelb@CtlPlane:~$
{{</ output >}}

## Configure control node a bit more.

### 1. Set up `/etc/hosts` file on control node with IPs for Ansible workers
This enables us to use hostnames when referring to different instances. Run the below command from your local machine.

    linode-cli linodes list --text | grep vm | awk '{print $7,$2,$2".ansi.com"}' | column -t

Example Output:
{{< output >}}
172.104.26.209  vm1  vm1.ansi.com
172.104.26.246  vm2  vm2.ansi.com
172.104.26.229  vm3  vm3.ansi.com
172.104.26.48   vm4  vm4.ansi.com
172.104.26.108  vm5  vm5.ansi.com
{{</ output >}}

Using the text editor of your choice, copy and paste this output to the end of the `/etc/hosts/` file on **vm1**.

{{<note>}}
Be sure to use `sudo` to edit `/etc/hosts`.

For example: `sudo vim /etc/hosts`
{{</note>}}

Check to make sure you can ping all the hostnames.

    for i in {1..5}; do ping -c 2 vm$i; done

### 2. Configure Ansible Configs on the Control Plane
Using a text editor, create and copy this configuration file, `ansible.cfg`, to your home folder.

{{< file "/home/YOUR_USERNAME/ansible.cfg" yaml >}}
[defaults]
inventory = $HOME/hosts
{{</ file >}}

Create and copy this Ansible hosts configuration file located to your home folder as well.

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

Confirm all hosts are accessible.

    ansible all --list-hosts

Example output:
{{< output >}}
nygelb@CtlPlane:~$ ansible all --list-hosts
  hosts (4):
    vm5
    vm2
    vm3
    vm4
{{</ output >}}
## Set up Ansible playbook to configure worker nodes
The playbook is already written out for you. All that is needed is to add two parameters; a hashed password and the IP address of the log server.

### 1. Create hashed, plain-text password
Run this command from your Ansible control plane. The command prompts you for a password. This password is used to access the web servers.

     python3 -c "from passlib.hash import sha512_crypt; import getpass; print(sha512_crypt.hash(getpass.getpass()))"

Be sure to copy the output from the dollar sign to the period. Paste the resulting hashed password into `myplaybook.yml`, in the place holder, **{{ HASHED_PASSWORD }}**.

### 2. Configure Log server
Grab the IP address of logging sever (vm5) and paste into `configure rsyslog` section of `myplaybook.yml`. Paste the IP address into the place holder, **{{ LOG_IP_ADDRESS }}**.

## Configure Ansible managed nodes.

### 1. Send setup script, `ansibleMN_setup.sh` to each managed node.
Create a password file to use in the next step. Use the same root password you used when creating these Linodes.

    echo 'yourrootpassword' > ~/.ssh/file

Send the managed node setup script to each managed node.

    for i in {2..5}; do sshpass -f ~/.ssh/file scp ansibleMN_setup.sh root@vm$i:/root/; done

Check to make sure each managed node contains the script by sending the 'ls' command via ssh.

    for i in {2..5}; do sshpass -f ~/.ssh/file ssh root@vm$i 'ls'; done

Resulting output:
{{< output >}}
nygelb@CtlPlane:~$ for i in {2..5}; do sshpass -f ~/.ssh/file ssh root@vm$i 'ls'; done
ansibleMN_setup.sh
ansibleMN_setup.sh
ansibleMN_setup.sh
ansibleMN_setup.sh
{{</ output >}}

### 2. Log into each worker node and run the `ansibleMN_setup.sh` script.
From the local computer, open 4 terminal sessions and within each session, ssh into each managed node (vm2 - vm5). Once logged in, execute the managed node setup script.

    ./ansibleMN_setup.sh

{{<note>}}
The script asks you to enter a username and password for the new user being created.
{{</note>}}

Once the setup script has completed for each managed node, reboot all your Ansible infrastructure Linodes with the below command.

    for i in $(cat tmp.txt); do linode-cli linodes reboot $i; done

### 3. Upload ssh key from control node to the managed nodes.
Log back into the control node and run the below command. This sends the control node's limited user's ssh key to each managed node. This allows easy, secure ssh communication from the control node to the managed nodes.

    for i in {2..5}; do sshpass -f ~/.ssh/file ssh-copy-id $USER@vm$i; done

{{<note>}}
If the limited user's password is different from the root user's password, please change the `~/.ssh/file` contents to match the limited user's password.
{{</note>}}

Confirm all hosts can be pinged using Ansible. A successful run of this command indicates the [ssh communication is working.](https://docs.ansible.com/ansible/2.7/user_guide/intro_getting_started.html#remote-connection-information)

    ansible all -m ping

{{< output >}}
nygelb@CtlPlane:~$ ansible all -m ping
vm4 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python3"
    },
    "changed": false,
    "ping": "pong"
}
vm3 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python3"
    },
    "changed": false,
    "ping": "pong"
}
vm2 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python3"
    },
    "changed": false,
    "ping": "pong"
}
vm5 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python3"
    },
    "changed": false,
    "ping": "pong"
}
{{</ output >}}
## Run the Ansible playbook to configure managed nodes.

### Run the playbook with the below command:

    ansible-playbook myplaybook.yml

If all is successful, you should see the below output.

{{< output >}}
nygelb@CtlPlane:~$ ansible-playbook myplaybook.yml

PLAY [webservers] *************************************************************************************************

TASK [Gathering Facts] ********************************************************************************************
ok: [vm3]
ok: [vm2]

TASK [Install Apache Server] **************************************************************************************
changed: [vm3]
changed: [vm2]

TASK [Enable and Start Apache Server] *****************************************************************************
ok: [vm3]
ok: [vm2]

TASK [Install Firewalld] ******************************************************************************************
changed: [vm3]
changed: [vm2]

TASK [Enable and start firewalld server] **************************************************************************
ok: [vm2]
ok: [vm3]

TASK [Open Firewall Port] *****************************************************************************************
changed: [vm3]
changed: [vm2]

TASK [Create web admin group] *************************************************************************************
changed: [vm3]
changed: [vm2]

TASK [Create web admin user] **************************************************************************************
changed: [vm3]
changed: [vm2]

TASK [Set content directory group/permissions] ********************************************************************
changed: [vm3]
changed: [vm2]

TASK [Create default page content] ********************************************************************************
changed: [vm3]
changed: [vm2]

PLAY [dbservers] **************************************************************************************************

TASK [Gathering Facts] ********************************************************************************************
ok: [vm4]

TASK [Install MariaDB Server] *************************************************************************************
changed: [vm4]

TASK [Enable and start MariaDB server] ****************************************************************************
ok: [vm4]

PLAY [logservers] *************************************************************************************************

TASK [Gathering Facts] ********************************************************************************************
ok: [vm5]

TASK [Configure rsyslog remote log reception over udp] ************************************************************
changed: [vm5] => (item=$ModLoad imudp)
changed: [vm5] => (item=$UDPServerRun 514)

TASK [Install Firewalld] ******************************************************************************************
changed: [vm5]

TASK [Enable and start firewalld server] **************************************************************************
ok: [vm5]

TASK [Open firewall port] *****************************************************************************************
changed: [vm5]

RUNNING HANDLER [restart rsyslogd] ********************************************************************************
changed: [vm5]

PLAY [lamp] *******************************************************************************************************

TASK [Gathering Facts] ********************************************************************************************
ok: [vm4]
ok: [vm2]
ok: [vm3]

TASK [configure rsyslog] ******************************************************************************************
changed: [vm2]
changed: [vm4]
changed: [vm3]

RUNNING HANDLER [restart rsyslogd] ********************************************************************************
changed: [vm4]
changed: [vm3]
changed: [vm2]

PLAY RECAP ********************************************************************************************************
vm2                        : ok=13   changed=9    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
vm3                        : ok=13   changed=9    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
vm4                        : ok=6    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
vm5                        : ok=6    changed=4    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
{{</ output >}}



## Check to see if the playbook run was successful.
Curl the IP addresses of the web servers. (vm2 and vm3)

    curl vm2_IPADDRESS
    curl vm3_IPADDRESS

{{< output >}}
nygelb@CtlPlane:~$ curl 172.104.214.155
Welcome to li1924-155 on 172.104.214.155
nygelb@CtlPlane:~$ curl 172.104.214.165
Welcome to li1924-165 on 172.104.214.165
{{</ output >}}

Send a `logger` command to the lamp stack defined in the `hosts` file.

    ansible lamp -m command -a 'logger hurray it works'

{{< output >}}
nygelb@CtlPlane:~$ ansible lamp -m command -a 'logger hurray it works'
vm4 | CHANGED | rc=0 >>

vm3 | CHANGED | rc=0 >>

vm2 | CHANGED | rc=0 >>
{{</ output >}}

Search the log server for the entry just sent.

    ansible logservers -m command -a "grep 'hurray it works$' /var/log/syslog" -b

{{< output >}}
nygelb@CtlPlane:~$ ansible logservers -m command -a "grep 'hurray it works$' /var/log/syslog" -b
vm5 | CHANGED | rc=0 >>
Oct 25 21:22:00 li1924-200 nygelb: hurray it works
Oct 25 21:22:00 li1924-165 nygelb: hurray it works
Oct 25 21:22:00 li1924-155 nygelb: hurray it works
{{</ output >}}
