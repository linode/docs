---
author:
  name: Linode
  email: docs@linode.com
description: 'Our guide to securing your first Linode.'
keywords: 'security,linode quickstart,getting started,iptables,firewall,firewalld,ssh,new user,fail2ban'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['securing-your-server/']
modified: Saturday, December 27th, 2014
modified_by:
  name: Dave Russell
published: 'Friday, February 17th, 2012'
title: Securing Your Server
---

In the [Getting Started](/docs/getting-started) guide, you learned how to deploy Linux, boot your Linode, and perform some basic system administration tasks. Now it's time to secure your Linode and protect it from unauthorized access. You'll learn how to implement a firewall, SSH key pair authentication, and an automatic blocking mechanism called *Fail2Ban*. By the time you reach the end of this guide, your Linode will be protected from attackers.

## Adding a New User

In the [Getting Started](/docs/getting-started) guide, we asked you to log in to your Linode as the `root` user, the most powerful user of all. The problem with logging in as `root` is that you can execute *any* command - even a command that could accidentally break your server. For this reason and others, we recommend creating another user account and using that at all times. After you log in with the new account, you'll still be able to execute superuser commands with the `sudo` command.

Here's how to add a new user:

### Debian/Ubuntu

1.  Open a terminal window and [log in to your Linode via SSH](/docs/getting-started#sph_logging-in-for-the-first-time).

2.  Create the user by entering the following command. Replace *exampleuser* with your desired username:

        adduser exampleuser

3.  Add the user to the *administer the system* (admin) group by entering the following command. Replace *exampleuser* with your username:

        usermod -a -G sudo exampleuser

4.  Log out of your Linode as the `root` user by entering the following command:

        logout

5.  Log in to your Linode as the new user by entering the following command. Replace *exampleuser* with your username, and the example IP address with your Linode's IP address:

        ssh exampleuser@123.456.78.90

### CentOS/Fedora

1. Open a terminal window and [log in to your Linode via SSH](/docs/getting-started#sph_logging-in-for-the-first-time).

2.  Create the user by entering the following command. Replace *exampleuser* with your desired username:

        adduser exampleuser

3.  Set the password for your new user by entering the following command.  Replace *exampleuser* with your desired username:

        passwd exampleuser

4.  You will now need to edit your sudoers file to grant your new user the correct permissions.  Enter the following command to open your sudoers file for editing:

        visudo

5.  Type 'i' to enter the insert mode, and add an entry for your user below the root user, granting all permissions.  Replace *exampleuser* with your username:

        ## Allow root to run any commands anywhere
        root    ALL=(ALL)       ALL
        exampleuser        ALL=(ALL)       ALL

6.  Press 'Esc' to leave insert mode and enter the following command to save the file and quit visudo:

        :wq

7.  Log out of your Linode as the `root` user by entering the following command:

        logout

8.  Log in to your Linode as the new user by entering the following command. Replace *exampleuser* with your username, and the example IP address with your Linode's IP address:

        ssh exampleuser@123.456.78.90

Now you can administer your Linode with the new user account instead of `root`. When you need to execute superuser commands in the future, preface them with `sudo`. For example, later in this guide you'll execute `sudo iptables -L` while logged in with your new account. Nearly all superuser commands can be executed with `sudo`, and all commands executed with `sudo` will be logged to `/var/log/auth.log`.

## Using SSH Key Pair Authentication

You've used password authentication to connect to your Linode via SSH, but there's a more secure method available: *key pair authentication*. In this section, you'll generate a public and private key pair using your desktop computer and then upload the public key to your Linode. SSH connections will be authenticated by matching the public key with the private key stored on your desktop computer - you won't need to type your account password. When combined with the steps outlined later in this guide that disable password authentication entirely, key pair authentication can protect against brute-force password cracking attacks.

Here's how to use SSH key pair authentication to connect to your Linode:

1.  Generate the SSH keys on a desktop computer running Linux or Mac OS X by entering the following command in a terminal window *on your desktop computer*. PuTTY users can generate the SSH keys by following the windows specific instructions in the [Use Public Key Authentication with SSH Guide](/docs/security/use-public-key-authentication-with-ssh#windows-operating-system).

        ssh-keygen

2.  The *SSH keygen* utility appears. Follow the on-screen instructions to create the SSH keys on your desktop computer. To use key pair authentication without a passphrase, press Enter when prompted for a passphrase.

    {: .note }
    >
    > Two files will be created in your \~/.ssh directory: `id_rsa` and `id_rsa.pub`. The public key is `id_rsa.pub` - this file will be uploaded to your Linode. The other file is your private key. Do not share this file with anyone!

3.  Upload the public key to your Linode with the *secure copy* command (`scp`) by entering the following command in a terminal window *on your desktop computer*. Replace `example_user` with your username, and `123.456.78.90` with your Linode's IP address. If you have a Windows desktop, you can use a third-party client like [WinSCP](http://winscp.net/) to upload the file to your home directory.

        scp ~/.ssh/id_rsa.pub example_user@123.456.78.90:

4.  Create a directory for the public key in your home directory (`/home/yourusername`) by entering the following command *on your Linode*:

        mkdir .ssh

5.  Move the public key in to the directory you just created by entering the following command *on your Linode*:

        mv id_rsa.pub .ssh/authorized_keys

6.  Modify the permissions on the public key by entering the following commands, one by one, *on your Linode*. Replace `example_user` with your username.

        chown -R example_user:example_user .ssh
        chmod 700 .ssh
        chmod 600 .ssh/authorized_keys

The SSH keys have been generated, and the public key has been installed on your Linode. You're ready to use SSH key pair authentication! To try it, log out of your terminal session and then log back in. The new session will be authenticated with the SSH keys and you won't have to enter your account password. (You'll still need to enter the passphrase for the key, if you specified one.)

## Disabling SSH Password Authentication and Root Login

You just strengthened the security of your Linode by adding a new user and generating SSH keys. Now it's time to make some changes to the default SSH configuration. First, you'll disable *password authentication* to require all users connecting via SSH to use key authentication. Next, you'll disable *root login* to prevent the `root` user from logging in via SSH. These steps are optional, but are strongly recommended.

 {: .note }
>
> You may want to leave password authentication enabled if you connect to your Linode from many different desktop computers. That will allow you to authenticate with a password instead of copying the private key to every computer.

Here's how to disable SSH password authentication and root login:

1.  Open the SSH configuration file for editing by entering the following command:

        sudo nano /etc/ssh/sshd_config

    {: .note }
    >
    > If you see a message similar to *-bash: sudo: command not found*, you'll need to install `sudo` on your Linode. To do so, log in as root by entering the `su` command, and type the `root` password when prompted. Next, install `sudo` by entering the following command: `apt-get install sudo`. After `sudo` has been installed, log out as the `root` user by entering the `exit` command.

2.  Change the `PasswordAuthentication` setting to `no` as shown below. Verify that the line is uncommented by removing the \# in front of the line, if there is one.:

        PasswordAuthentication no

3.  Change the `PermitRootLogin` setting to `no` as shown below:

        PermitRootLogin no

4.  Save the changes to the SSH configuration file by pressing **Control-X**, and then **Y**.
5.  Restart the SSH service to load the new configuration. Enter the following command:

    **Debian/Ubuntu Users:**

        sudo service ssh restart

    **Fedora/CentOS:**

        sudo systemctl restart sshd

After the SSH service restarts, the SSH configuration changes will be applied.

## Configuring a Firewall

Using a *firewall* to block unwanted inbound traffic to your Linode is a highly effective security layer. By being very specific with the traffic you allow in, you can prevent intrusions and ***. A good rule of thumb is to allow only the traffic you need, and deny everything else. 

[iptables](http://www.netfilter.org/projects/iptables/index.html) is the controller for netfilter, the Linux kernel's packet filtering framework. iptables is included in most Linux distros by default.

{: .note }
>
>From CentOS 7 and Fedora 18, [firewalld](http://www.firewalld.org/) is included as a firewall controller. The firewalld package adds some additional enterprise-focused functionality to iptables that will not be covered in this guide. For reference, documentation for configuring firewalld can be found at [Red Hat's Customer Portal](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/Security_Guide/sec-Using_Firewalls.html).

### Viewing Your Current iptables Rules

To view your Linode's current firewall rules:

    sudo iptables -L
    sudo ip6tables -L

By default, iptables has no rules configured for both IPv4 and IPv6 so on a new Linode, you will see as shown below--three empty chains without any firewall rules. This means that all incoming, forwarded and outgoing traffic is *allowed*. It's important to limit inbound and forwarded traffic to only what's necessary.

    Chain INPUT (policy ACCEPT)
    target     prot opt source               destination

    Chain FORWARD (policy ACCEPT)
    target     prot opt source               destination

    Chain OUTPUT (policy ACCEPT)
    target     prot opt source               destination


### Basic iptables Rule Sets for IPv4 and IPv6

Appropriate firewall rules heavily depend on the services being run. Below is an iptables ruleset to secure your Linode if you're running a web server. This is given as *an example*. A real production web server may want or require more or less configuration and these rules would not be appropriate for a file or database server, Minecraft or VPN server, etc.

iptables rules can always be modified or reset later, but this basic ruleset serves only as a beginning demonstration. In it, outbound traffic is unregulated. Forwarding traffic is rejected and Inbound traffic is limited to SSH, HTTP, HTTPS and ICMP type 8 (pings).

    *filter

    # Allow all loopback (lo0) traffic and drop all traffic to 127/8 that doesn't use lo0.
    -A INPUT -i lo -j ACCEPT
    -A INPUT -d 127.0.0.0/8 -j REJECT

    # Accept all established inbound connections
    -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

    #  Allow HTTP and HTTPS connections from anywhere (the normal ports for websites and SSL).
    -A INPUT -p tcp --dport 80 -j ACCEPT
    -A INPUT -p tcp --dport 443 -j ACCEPT

    # Allow SSH connections
    # The -dport number should be the same port number you set in sshd_config.
    -A INPUT -p tcp -m state --state NEW --dport 22 -j ACCEPT

    # Allow ping
    -A INPUT -p icmp --icmp-type echo-request -j ACCEPT

    # Log iptables denied calls
    -A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables denied: " --log-level 7

    # Drop all other inbound - default deny unless explicitly allowed policy.
    -A INPUT -j DROP
    -P FORWARD DROP

    # Allow all outbound traffic - you can modify this to only allow certain traffic.
    -A OUTPUT -j ACCEPT

    COMMIT

**Optional:**  If you plan on using the Linode Longview service, add these additional lines above the `#  Drop all other inbound` section:

    # Allow incoming Longview connections 
    -A INPUT -s longview.linode.com -j ACCEPT

    # llow metrics to be provided Longview
    -A OUTPUT -d longview.linode.com -j ACCEPT

The above rules applies *only to IPv4*. Now we need a rule set for IPv6. Since it's not usually used on a webserver, we'll deny all of it. If your server has an IPv6 address, you would not want to do this.

    *filter

    -P INPUT DROP
    -P FORWARD DROP
    -P OUTPUT DROP

    COMMIT

How these IPv4 and IPv6 rules are deployed differs among the various Linux distros.

### Arch Linux

1.  Create the files `/etc/iptables/iptables.rules` and `/etc/iptables/ip6tables.rules`. Paste the above rulesets into their respective files.

2.  iptables is not running by default in Arch. Add the rules and start the unit.

        sudo iptables-restore < /etc/iptables/iptables.rules
        sudo ip6tables-restore < /etc/iptables/ip6tables.rules

        sudo systemctl start iptables
        sudo systemctl start ip6tables

3.  Enable the iptables systemd unit to start automatically on each boot. This happens before the network interface is up.

        sudo systemctl enable iptables
        sudo systemctl enable ip6tables

For more info on using iptables in Arch, see its wiki entries for [iptables](https://wiki.archlinux.org/index.php/Iptables) and a [Simple Stateful Firewall](https://wiki.archlinux.org/index.php/Simple_stateful_firewall).

### CentOS / Fedora

For CentOS 6 or Fedora 19 and below:

1.  Create the files `/tmp/ipv4` and `/tmp/ipv6`. Paste the above rulesets into their respective files.

2.  Import the rules from the temporary files.

        sudo /sbin/iptables-restore < /tmp/ipv4
        sudo /sbin/ip6tables-restore < /tmp/ipv6


3.  Save the rules.

        sudo /sbin/service iptables save
        sudo /sbin/service ip6tables save

    {: .note }
    >
    >Firewall rules are saved to `/etc/sysconfig/iptables` and /etc/sysconfig/ip6tables`.

*** I more or less left off here***

For CentOS 7 or Fedora 20 and above, firewalld is used to implement firewall rules instead of controlling iptables directly.


1.  Install iptables-services.

        yum install -y iptables-services
        systemctl enable iptables
        systemctl start iptables

To save your current rule set use the following command

    /usr/libexec/iptables/iptables.init save

For more info on using iptables and firewalld in CentOS, see the distro's wiki entries for [iptables](https://wiki.centos.org/HowTos/Network/IPTables) and 

### Debian / Ubuntu

[iptables-persistent](https://github.com/zertrin/iptables-persistent) automates loading iptables rules on boot for Debian and Ubuntu.

1.  Create the files `/tmp/ipv4` and `/tmp/ipv6`. Paste the above rulesets into their respective files.

2.  Install `iptables-persistent` from the distro repositories.

        sudo apt-get install iptables-persistent

    {: .note }
    >
    >For Debian-based distros using systemd, `netfilter-persistent` will be installed as a dependency.

3. You'll be asked if you want to save the current IPv4 and IPv6 rules. Answer `yes` to each prompt.

### Gentoo

### openSUSE

### Slackware






Recheck your Linode's firewall rules by entering the following command:

    sudo iptables -L
    sudo ip6tables -L

10.  Examine the output. The new ruleset should look like the one shown below:

    Chain INPUT (policy ACCEPT)
    target     prot opt source               destination
    ACCEPT     all  --  anywhere             anywhere
    REJECT     all  --  anywhere             127.0.0.0/8          reject-with icmp-port-unreachable
    ACCEPT     all  --  anywhere             anywhere             state RELATED,ESTABLISHED
    ACCEPT     tcp  --  anywhere             anywhere             tcp dpt:http
    ACCEPT     tcp  --  anywhere             anywhere             tcp dpt:https
    ACCEPT     tcp  --  anywhere             anywhere             state NEW tcp dpt:ssh
    ACCEPT     icmp --  anywhere             anywhere
    LOG        all  --  anywhere             anywhere             limit: avg 5/min burst 5 LOG level debug prefix "iptables denied: "
    DROP       all  --  anywhere             anywhere

    Chain FORWARD (policy ACCEPT)
    target     prot opt source               destination
    DROP       all  --  anywhere             anywhere

    Chain OUTPUT (policy ACCEPT)
    target     prot opt source               destination
    ACCEPT     all  --  anywhere             anywhere  

That's it! Your firewall rules are in place and protecting your Linode. Remember, you'll need to edit the firewall rules later if you install other software or services.

## Installing and Configuring Fail2Ban

*Fail2Ban* is an application that prevents dictionary attacks on your server. When Fail2Ban detects multiple failed login attempts from the same IP address, it creates temporary firewall rules that block traffic from the attacker's IP address. Attempted logins can be monitored on a variety of protocols, including SSH, HTTP, and SMTP. By default, Fail2Ban monitors SSH only.

Here's how to install and configure Fail2Ban:

1.  Install Fail2Ban by entering the following command:

    **Debian/Ubuntu Users:**

        sudo apt-get install fail2ban

    **Fedora Users:**

        sudo yum install fail2ban

    **CentOS Users:**

        sudo yum install epel-release
        sudo yum install fail2ban


2.  Optionally, you can override the default Fail2Ban configuration by creating a new `jail.local` file. Enter the following command to create the file:

        sudo nano /etc/fail2ban/jail.local

    {: .note }
    >
    > To learn more about Fail2Ban configuration options, see [this article](http://www.fail2ban.org/wiki/index.php/MANUAL_0_8#Configuration) on the Fail2Ban website.

3.  Set the `bantime` variable to specify how long (in seconds) bans should last.
4.  Set the `maxretry` variable to specify the default number of tries a connection may be attempted before an attacker's IP address is banned.
5.  Press `Control-x` and then press `y` to save the changes to the Fail2Ban configuration file.
6.  Restart Fail2Ban by using `sudo service fail2ban restart`.

Fail2Ban is now installed and running on your Linode. It will monitor your log files for failed login attempts. After an IP address has exceeded the maximum number of authentication attempts, it will be blocked at the network level and the event will be logged in `/var/log/fail2ban.log`.

## Next Steps

Good work! You have secured your Linode to protect it from unauthorized access. Next, you'll learn how to host a website. Start reading the [Hosting a Website](/docs/hosting-website) quick start guide to get going!