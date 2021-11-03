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
- '[Introduction to Ansible Playbooks](https://docs.ansible.com/ansible/latest/user_guide/playbooks_intro.html)'
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
* Create a folder to work from. For example, you can name it, **"Ansible_Infra"**.


<!-- Include one of the following notes if appropriate. --->

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{</ note >}}

## Create 1 Ansible Control Node and 4 Managed Nodes

### Create 5 Linodes Using the Linode-CLI Utility.
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

### Grab the Linode IDs and Put Them into a Temp File.
We use these ids to tag and label the Linodes.  Tagging and labeling your Linodes helps to keep your Linode Cloud Manager organized.

    linode-cli linodes list --text | tail -5 | awk '{print $1}' > tmp.txt

### Tag the Linodes with "Ansible", Which Groups Them Together in the Cloud Manager.

    for i in $(cat tmp.txt); do linode-cli linodes update --tags Ansible $i; done

### Label the 5 Linodes From "vm1" to "vm5".
Loop through the Linode's ids from the temp file and assign each Linode a numbered label.

    i=1; for j in $(cat tmp.txt); do linode-cli linodes update --label vm$i $j; let "i++"; done

If you check the Cloud Manager GUI, you can see these 5 Linodes grouped under the tag "Ansible" and labeled vm1 through vm5.

![Cloud Manager GUI](cloud-gui-01.png "Cloud Manager GUI showing 5 Linodes grouped and labeled.")

## Create Setup Files to Configure the Control Node and Worker Nodes.
Please create three files named `ansibleCN_setip.sh`, `ansibleMN_setup.sh`, and `myplaybook.yml`. Using a text editor, copy and paste the below text into each respective file. The setup files will help to secure your Linode, install needed software, and create a limited user on your instance. The playbook file is what Ansible will use to configure the managed nodes.

As a shortcut, you can also `wget` these three configuration [files from GitHub](https://github.com/bennettnw2/Ansible_webserver_infra_files) and save them into the local, working, folder just created.

       wget https://raw.githubusercontent.com/bennettnw2/Ansible_webserver_infra_files/main/ansibleCN_setup.sh
       wget https://raw.githubusercontent.com/bennettnw2/Ansible_webserver_infra_files/main/ansibleMN_setup.sh
       wget https://raw.githubusercontent.com/bennettnw2/Ansible_webserver_infra_files/main/myplaybook.yml

{{< file "ansibleCN_setup.sh" bash >}}
#! /bin/bash
# This is the script to run to setup an Ansible control node.

echo "##########################################################"
echo "# Update and Secure Linode Instance                      #"
echo "##########################################################"

apt update
apt upgrade -y

hostnamectl set-hostname CtlNode

# Secure ssh a bit with no root login and no x11 forwarding
# Need to remove host key checking for Ansible to run properly
sed -in 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -in 's/X11Forwarding yes/X11Forwarding no/' /etc/ssh/sshd_config
sed -in 's/#   StrictHostKeyChecking ask/StrictHostKeyChecking no/' /etc/ssh/ssh_config

echo "##########################################################"
echo "# Installing Software                                    #"
echo "##########################################################"
# Install Software
# ====================================================================================================
apt install sshpass -y
apt install ansible -y
apt install fail2ban -y
apt install python3-pip -y
pip3 install passlib

# Configure Software
# ====================================================================================================
# fail2ban
# ========
systemctl enable fail2ban.service
systemctl start fail2ban.service
# ufw
# ========
ufw allow openssh
yes | ufw enable
ufw status

echo "##########################################################"
echo "# Creating limited user                                  #"
echo "##########################################################"
echo ""
echo "Please enter preferred username: "
read USERNAME
# Create limited user and give sudo privileges.
useradd -m -G sudo -s /bin/bash $USERNAME
passwd $USERNAME

mv ansibleMN_setup.sh myplaybook.yml /home/$USERNAME

# Create passwordless sudo for user $USERNAME
#+ and add file in /etc/sudoers.d/
echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/10-user-$USERNAME
chmod 440 /etc/sudoers.d/10-user-$USERNAME
visudo -c

# Create an ssh key for the user.
mkdir /home/$USERNAME/.ssh
ssh-keygen -t rsa -b 2048 -f /home/$USERNAME/.ssh/id_rsa -q -N ''

# Set file permissions for the user.
chown -R $USERNAME:$USERNAME /home/$USERNAME/.ssh
chown $USERNAME:$USERNAME /home/$USERNAME/myplaybook.yml

echo "##########################################################"
echo "# Dunzo. Poke around if you like.  I recommend a reboot. #"
echo "##########################################################"
{{</ file >}}

{{< file "ansibleMN_setup.sh" bash >}}
#!/bin/bash
# This is the script to run in order to setup Ansible managed nodes.

echo "##########################################################"
echo "# Update and Secure Linode Instance                      #"
echo "##########################################################"
apt update
apt upgrade -y

# Secure ssh a bit with no root login and no x11 forwarding.
sed -in 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -in 's/X11Forwarding yes/X11Forwarding no/' /etc/ssh/sshd_config
sed -in 's/#PubkeyAuthentication/PubkeyAuthentication/' /etc/ssh/sshd_config

apt install fail2ban -y
systemctl enable fail2ban.service
systemctl start fail2ban.service

echo "##########################################################"
echo "# Creating limited user                                  #"
echo "##########################################################"
echo ""
echo "Please enter preferred username: "
read USERNAME
# Create limited user and give sudo privileges.
useradd -m -G sudo -s /bin/bash $USERNAME
passwd $USERNAME

# Create passwordless sudo execution for user $USERNAME
#+ and add file in /etc/sudoers.d/
echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/10-user-$USERNAME
chmod 440 /etc/sudoers.d/10-user-$USERNAME
visudo -c

echo "##########################################################"
echo "# Dunzo. Poke around if you like.  I recommend a reboot. #"
echo "##########################################################"
{{</ file >}}

Ansible playbooks is what makes Ansible powerful software. The syntax of the tasks are very similar to plain language and therefore, makes the playbook file human readable. For best practice, have the task names be descriptive and precise. By reviewing the names of the tasks in `myplaybook.yml`, we can see what each task is supposed to do and each task shows how it is done.

{{< file "myplaybook.yml" yaml >}}
---
- hosts: webservers
  become: yes
  tasks:
    - name: "Install Apache Server"
      apt:
        name: apache2
        state: present

    - name: "Enable and Start Apache Server"
      service:
        name: apache2
        enabled: yes
        state: started

    - name: "Install Firewalld"
      apt:
        name: firewalld
        state: present

    - name: "Enable and start firewalld server"
      service:
        name: firewalld
        enabled: yes
        state: started

    - name: "Open Firewall Port"
      firewalld:
        service: http
        immediate: true
        permanent: true
        state: enabled

    - name: "Create web admin group"
      group:
        name: web
        state: present

    - name: "Create web admin user"
      user:
        name: webadm
        comment: "Web Admin"
        password: {{ HASHED_PASSWORD }}
        groups: web
        append: yes

    - name: "Set content directory group/permissions"
      file:
        path: /var/www/html
        owner: root
        group: web
        state: directory
        mode: u=rwx,g=rwx,o=rx,g+s

    - name: "Create default page content"
      copy:
        content: "Welcome to {{ ansible_fqdn }} on {{ ansible_default_ipv4.address }}"
        dest: /var/www/html/index.html
        owner: webadm
        group: web
        mode: u=rw,g=rw,o=r

- hosts: dbservers
  become: yes
  tasks:
    - name: "Install MariaDB Server"
      apt:
        name: mariadb-server
        state: present

    - name: "Enable and start MariaDB server"
      service:
        name: mariadb
        enabled: yes
        state: started

- hosts: logservers
  become: yes
  tasks:
    - name: "Configure rsyslog remote log reception over udp"
      lineinfile:
        path: /etc/rsyslog.conf
        line: "{{ item }}"
        state: present
      with_items:
        - '$ModLoad imudp'
        - '$UDPServerRun 514'
      notify:
        - restart rsyslogd

    - name: "Install Firewalld"
      apt:
        name: firewalld
        state: present

    - name: "Enable and start firewalld server"
      service:
        name: firewalld
        enabled: yes
        state: started

    - name: "Open firewall port"
      firewalld:
        port: 514/udp
        immediate: true
        permanent: true
        state: enabled

  handlers:
    - name: "restart rsyslogd"
      service:
        name: rsyslog
        state: restarted

- hosts: lamp
  become: yes
  tasks:
    - name: configure rsyslog
      lineinfile:
        path: /etc/rsyslog.conf
        line: '*.* @{{ LOG_IP_ADDRESS }}'
        state: present
      notify:
        - restart rsyslogd

  handlers:
    - name: "restart rsyslogd"
      service:
        name: rsyslog
        state: restarted
{{</ file >}}

## Configure Your Control Node
Using `scp`, the above files are sent to the Ansible control node.  We then log into the control node and execute the control node script, `ansibleCN_setup.sh`.

{{< caution >}}
Do not forget the colon "**:**" at the end of this command
{{</ caution >}}

Replace `VM1_IPADDRESS` with the IP address obtained from either the Linode-CLI or Cloud Manager GUI.

    scp ansibleCN_setup.sh ansibleMN_setup.sh myplaybook.yml root@VM1_IPADDRESS:

### Log into "vm1" and Run `ansibleCN_setup.sh` to Update, Secure, and Install Needed Apps on the Linode.
SSH into vm1.

    ssh root@VM1_IPADDRESS
Change the permissions on `ansibleCN_setup.sh` and `ansibleMN_setup.sh` to be executable.


    chmod 744 ansibleCN_setup.sh ansibleMN_setup.sh

Execute `ansibleCN_setup.sh` script. It takes approximately 7 minutes for the script to complete.

    ./ansibleCN_setup.sh

{{<note>}}
The script asks you to enter a username and password for the new user being created.
{{</note>}}

### Log Out and Reboot the Linode Using Either the Linode-CLI or Cloud Manager GUI.
If using the below command, replace **LINODE_ID** with the Linode ID of **vm1** obtained either from the Linode-CLI or Cloud Manager GUI.

    linode-cli linodes reboot LINODE_ID

### SSH into "vm1".
Be sure to use the new user you created because the setup script disabled root logins.

    ssh YOUR_USERNAME@VM1_IPADDRESS

You should see the hostname, **CtlNode**, configured on the command prompt along with your username.

{{< output >}}
nygelb@CtlNode:~$
{{</ output >}}

## Configure Control Node with IP Addresses of Instances.

### Set Up `/etc/hosts` File on Control Node with IPs for Managed Nodes.
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

## Create Ansible Configs on the Control Node.
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
nygelb@CtlNode:~$ ansible all --list-hosts
  hosts (4):
    vm5
    vm2
    vm3
    vm4
{{</ output >}}

## Set Up Ansible Playbook to Configure Worker Nodes.

Using the playbook created earlier, add two parameters; a hashed password and the IP address of the log server.

### Create and Add Hashed, Plain-Text Password to Playbook.
Run this command from your Ansible control node. The command prompts you for a password. This password is used to access the web servers.

     python3 -c "from passlib.hash import sha512_crypt; import getpass; print(sha512_crypt.hash(getpass.getpass()))"

Be sure to copy the output from the dollar sign to the period. Paste the resulting hashed password into `myplaybook.yml`, in the place holder, **{{ HASHED_PASSWORD }}**.

### Add Log Server IP Address to Playbook.
Grab the IP address of logging sever (vm5) and paste into `configure rsyslog` section of `myplaybook.yml`. Paste the IP address into the place holder, **{{ LOG_IP_ADDRESS }}**.

## Configure Ansible Managed Nodes.

### Send Setup Script, `ansibleMN_setup.sh` to Each Managed Node.
Create a password file to use in the next step. Use the same root password you used when creating these Linodes.

    echo 'yourrootpassword' > ~/.ssh/file

Send the managed node setup script to each managed node.

    for i in {2..5}; do sshpass -f ~/.ssh/file scp ansibleMN_setup.sh root@vm$i:/root/; done

Check to make sure each managed node contains the script by sending the 'ls' command via ssh.

    for i in {2..5}; do sshpass -f ~/.ssh/file ssh root@vm$i 'ls'; done

Resulting output:
{{< output >}}
nygelb@CtlNode:~$ for i in {2..5}; do sshpass -f ~/.ssh/file ssh root@vm$i 'ls'; done
ansibleMN_setup.sh
ansibleMN_setup.sh
ansibleMN_setup.sh
ansibleMN_setup.sh
{{</ output >}}

### Log into Each Worker Node and Run the `ansibleMN_setup.sh` Script.
From the local computer, open 4 terminal sessions and within each session, ssh into each managed node (vm2 - vm5). Once logged in, execute the managed node setup script.

    ./ansibleMN_setup.sh

{{<note>}}
The script asks you to enter a username and password for the new user being created.
{{</note>}}

Once the setup script has completed for each managed node, reboot all your Ansible infrastructure Linodes with the below command.

    for i in $(cat tmp.txt); do linode-cli linodes reboot $i; done

### Upload SSH Key from the Control Node to the Managed Nodes.
Log back into the control node and run the below command. This sends the control node's limited user's ssh key to each managed node. This allows easy, secure ssh communication from the control node to the managed nodes.

    for i in {2..5}; do sshpass -f ~/.ssh/file ssh-copy-id $USER@vm$i; done

{{<note>}}
If the limited user's password is different from the root user's password, please change the `~/.ssh/file` contents to match the limited user's password.
{{</note>}}

Confirm all hosts can be pinged using Ansible. A successful run of this command indicates the [ssh communication is working.](https://docs.ansible.com/ansible/2.7/user_guide/intro_getting_started.html#remote-connection-information)

    ansible all -m ping

{{< output >}}
nygelb@CtlNode:~$ ansible all -m ping
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

## Run the Ansible Playbook to Configure Managed Nodes.

Run the playbook with the below command:

    ansible-playbook myplaybook.yml

If all is successful, you should see the below output. Note that "unreachable" and "failed" both show 0 instances.

Truncated output:
{{< output >}}
nygelb@CtlNode:~$ ansible-playbook myplaybook.yml

PLAY [webservers] *************************************************************************************************

TASK [Gathering Facts] ********************************************************************************************
ok: [vm3]
ok: [vm2]

TASK [Install Apache Server] **************************************************************************************
changed: [vm3]
changed: [vm2]

{ ... }

PLAY RECAP ********************************************************************************************************
vm2                        : ok=13   changed=9    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
vm3                        : ok=13   changed=9    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
vm4                        : ok=6    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
vm5                        : ok=6    changed=4    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
{{</ output >}}



## Check the Playbook Run for Success.
Curl the IP addresses of the web servers. (vm2 and vm3)

    curl vm2_IPADDRESS
    curl vm3_IPADDRESS

{{< output >}}
nygelb@CtlNode:~$ curl 172.104.214.155
Welcome to li1924-155 on 172.104.214.155
nygelb@CtlNode:~$ curl 172.104.214.165
Welcome to li1924-165 on 172.104.214.165
{{</ output >}}

Send a `logger` command to the lamp stack defined in the `hosts` file.

    ansible lamp -m command -a 'logger hurray it works'

{{< output >}}
nygelb@CtlNode:~$ ansible lamp -m command -a 'logger hurray it works'
vm4 | CHANGED | rc=0 >>

vm3 | CHANGED | rc=0 >>

vm2 | CHANGED | rc=0 >>
{{</ output >}}

Search the log server for the entry just sent.

    ansible logservers -m command -a "grep 'hurray it works$' /var/log/syslog" -b

{{< output >}}
nygelb@CtlNode:~$ ansible logservers -m command -a "grep 'hurray it works$' /var/log/syslog" -b
vm5 | CHANGED | rc=0 >>
Oct 25 21:22:00 li1924-200 nygelb: hurray it works
Oct 25 21:22:00 li1924-165 nygelb: hurray it works
Oct 25 21:22:00 li1924-155 nygelb: hurray it works
{{</ output >}}
