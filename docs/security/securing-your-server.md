---
author:
  name: Chris Walsh
  email: docs@linode.com
description: 'This is a starting point of best practices for hardening a production server. Topics include user accounts, an iptables firewall, SSH and disabling unused network services.'
keywords: 'security,secure,firewall,ssh,add user,quick start'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['securing-your-server/']
modified: 'Thursday, February 25th, 2016'
modified_by:
  name: Linode
published: 'Friday, February 17th, 2012'
title: Securing Your Server
---

In the [Getting Started](/docs/getting-started) guide, you learned how to deploy a Linux distribution, boot your Linode and perform basic administrative tasks. Now it's time to harden your Linode against unauthorized access.

## Update Your System--Frequently

Keeping your software up to date is the single biggest security precaution you can take for any operating system--be it desktop, mobile or server. Software updates range from critical vulnerability patches to minor bug fixes, and many software vulnerabilities are actually patched by the time they become public.

### Automatic Security Updates

There are opposing arguments for and against automatic updates on servers. Nonetheless, CentOS, Debian, Fedora and Ubuntu can be automatically updated to various extents. [Fedora's Wiki](https://fedoraproject.org/wiki/AutoUpdates#Why_use_Automatic_updates.3F) has a good breakdown of the pros and cons, but the risk of automatic updates will be minimal if you limit them to security updates.

The practicality of automatic updates must be something which you judge for yourself because it comes down to what *you* do with your Linode. Bear in mind that automatic updates apply only to packages sourced from repositories, not self-compiled applications. You may find it worthwhile to have a test environment which replicates your production server. Updates can be applied there and reviewed for issues before being applied to the live environment.

* CentOS uses *[yum-cron](https://fedoraproject.org/wiki/AutoUpdates#Fedora_21_or_earlier_versions)* for automatic updates.

* Debian and Ubuntu use *[unattended upgrades](https://help.ubuntu.com/lts/serverguide/automatic-updates.html)*.

* Fedora uses *[dnf-automatic](https://dnf.readthedocs.org/en/latest/automatic.html)*.

## Add a Limited User Account

Up to this point, you have accessed your Linode as the `root` user. The concern here is that `root` has unlimited privileges and can execute *any* command--even one that could accidentally break your server. For this reason and others, we recommend creating a limited user account and using that at all times. Administrative tasks will be done using `sudo` to temporarily elevate your limited user's privileges so you can administer your server without logging in as root.

To add a new user, [log in to your Linode](/docs/getting-started#sph_logging-in-for-the-first-time) via SSH.

### CentOS / Fedora

1.  Create the user, replacing `example_user` with your desired username, and assign a password:

        useradd example_user && passwd example_user

2.  Add the user to the `wheel` group for sudo privileges:

        usermod -aG wheel example_user

### Debian / Ubuntu

1.  Create the user, replacing `example_user` with your desired username. You'll then be asked to assign the user a password.

        adduser example_user

2.  Add the user to the `sudo` group so you'll have administrative privileges:

        adduser example_user sudo

With your new user assigned, disconnect from your Linode as `root`:

    exit

Log back in as your new user. Replace `example_user` with your username, and the example IP address with your Linode's IP address:

    ssh example_user@203.0.113.0

Now you can administer your Linode from your new user account instead of `root`. Nearly all superuser commands can be executed with `sudo` (example: `sudo iptables -L`) and those commands will be logged to `/var/log/auth.log`.

## Harden SSH Access

By default, password authentication is used to connect to your Linode via SSH. A cryptographic key pair is more secure because a private key takes the place of a password, which is generally much more difficult to brute-force. In this section we'll create a key pair and configure the Linode to not accept passwords for SSH logins.

### Create an Authentication Keypair

1.  This is done on your local computer, **not** your Linode, and will create a 4096-bit RSA keypair. During creation, you will be given the option to protect the keypair with a passphrase. This means that the it cannot be used without entering the passphrase. We suggest you do use the keypair with a passphrase, but if unwanted, leave the fields blank and press **Enter** to finish.

    **Linux / OS X**

        ssh-keygen -b 4096

    Press **Enter** to use the default names `id_rsa` and `id_rsa.pub` in `/home/your_username/.ssh` before entering your passphrase.

    **Windows**

    This can be done using PuTTY as outlined in our guide: [Use Public Key Authentication with SSH](/docs/security/use-public-key-authentication-with-ssh#windows-operating-system).

2.  Upload the public key to your Linode. Replace `example_user` with the name of the user you plan to administer the server as.

    **Linux**

    From your local computer:

        ssh-copy-id example_user@203.0.113.0

    **OS X**

    On your Linode (while signed in as your limited user):

        mkdir -p ~/.ssh && sudo chmod -R 700 ~/.ssh

    From your local computer:

        scp ~/.ssh/id_rsa.pub example_user@203.0.113.0:~/.ssh/authorized_keys

    {: .note}
    >
    >`ssh-copy-id` is available in [Homebrew](http://brew.sh/) if you prefer it over SCP. Install with `brew install ssh-copy-id`.

    **Windows**

    This can be done using [WinSCP](http://winscp.net/).

3.  Now exit and log back into your Linode. If you specified a passphrase for your RSA key, you'll need to enter it.

### SSH Daemon Options

1.  **Disallow root logins over SSH.** This requires all SSH connections be by non-root users. Once a limited user account is connected, administrative privileges are accessible either by using `sudo` or changing to a root shell using `su -`.


    {: .file-excerpt}
    /etc/ssh/sshd_config
    :   ~~~ conf
        # Authentication:
        ...
        PermitRootLogin no
        ~~~

2.  **Disable SSH password authentication.** This requires all users connecting via SSH to use key authentication. Depending on the Linux distribution, the line `PasswordAuthentication` may need to be added, or uncommented by removing the leading `#`.

    {: .file-excerpt}
    /etc/ssh/sshd_config
    :   ~~~ conf
        # Change to no to disable tunnelled clear text passwords
        PasswordAuthentication no
        ~~~

    {: .note}
    >
    >You may want to leave password authentication enabled if you connect to your Linode from many different computers. This will allow you to authenticate with a password instead of generating and uploading a key pair for every device.

3.  **Listen on only one internet protocol.** The SSH daemon listens for incoming connections over both IPv4 and IPv6 by default. Unless you need to SSH into your Linode using both protocols, disable whichever you do not need. *This does not disable the protocol system-wide, it is only for the SSH daemon.*

    Use the option:

    *   `AddressFamily inet` to listen only on IPv4.
    *   `AddressFamily inet6` to listen only on IPv6.

    The `AddressFamily` option is usually not in the `sshd_config` file by default. Add it to the end of the file:

        echo 'AddressFamily inet' | sudo tee -a /etc/ssh/sshd_config

4.  Restart the SSH service to load the new configuration.

    If you’re using a Linux distribution which uses systemd (CentOS 7, Debian 8, Fedora, Ubuntu 15.10+)

        sudo systemctl restart sshd

    If your init system is SystemV or Upstart (CentOS 6, Debian 7, Ubuntu 14.04):

        sudo service ssh restart

### Use Fail2Ban for SSH Login Protection

[*Fail2Ban*](http://www.fail2ban.org/wiki/index.php/Main_Page) is an application which bans IP addresses from logging into your server after too many failed login attempts. Since legitimate logins usually take no more than three tries to happen (and with SSH keys, no more than one), a server being spammed with unsuccessful logins indicates attempted malicious access.

Fail2Ban can monitor a variety of protocols including SSH, HTTP, and SMTP. By default, Fail2Ban monitors SSH only, and is a helpful security deterrent for any server since the SSH daemon is usually configured to run constantly and listen for connections from any remote IP address.

For complete instructions on installing and configuring Fail2Ban, see our guide: [Securing Your Server with Fail2ban](/docs/security/using-fail2ban-for-security).

## Remove Unused Network-Facing Services

Most Linux distributions install with running network services which listen for incoming connections from the internet, the loopback interface, or a combination of both. Network-facing services which are not needed should be removed from the system to reduce the attack surface of both running process and installed packages.

### Determine Running Services

To see your Linode's running network services:

    sudo netstat -tulpn

{: .note}
>
>If netstat isn't included in your Linux distribution by default, install the package `net-tools`.

Using Debian 8 as an example, the output should look similar to this:

~~~
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:111             0.0.0.0:*               LISTEN      7315/rpcbind
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      3277/sshd
tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN      3179/exim4
tcp        0      0 0.0.0.0:42526           0.0.0.0:*               LISTEN      2845/rpc.statd
tcp6       0      0 :::48745                :::*                    LISTEN      2845/rpc.statd
tcp6       0      0 :::111                  :::*                    LISTEN      7315/rpcbind
tcp6       0      0 :::22                   :::*                    LISTEN      3277/sshd
tcp6       0      0 ::1:25                  :::*                    LISTEN      3179/exim4
udp        0      0 127.0.0.1:901           0.0.0.0:*                           2845/rpc.statd
udp        0      0 0.0.0.0:47663           0.0.0.0:*                           2845/rpc.statd
udp        0      0 0.0.0.0:111             0.0.0.0:*                           7315/rpcbind
udp        0      0 192.0.2.1:123           0.0.0.0:*                           3327/ntpd
udp        0      0 127.0.0.1:123           0.0.0.0:*                           3327/ntpd
udp        0      0 0.0.0.0:123             0.0.0.0:*                           3327/ntpd
udp        0      0 0.0.0.0:705             0.0.0.0:*                           7315/rpcbind
udp6       0      0 :::111                  :::*                                7315/rpcbind
udp6       0      0 fe80::f03c:91ff:fec:123 :::*                                3327/ntpd
udp6       0      0 2001:DB8::123           :::*                                3327/ntpd
udp6       0      0 ::1:123                 :::*                                3327/ntpd
udp6       0      0 :::123                  :::*                                3327/ntpd
udp6       0      0 :::705                  :::*                                7315/rpcbind
udp6       0      0 :::60671                :::*                                2845/rpc.statd
~~~

Netstat tells us that services are running for [Remote Procedure Call](https://en.wikipedia.org/wiki/Open_Network_Computing_Remote_Procedure_Call) (rpc.statd and rpcbind), SSH (sshd), [NTPdate](http://support.ntp.org/bin/view/Main/SoftwareDownloads) (ntpd) and [Exim](http://www.exim.org/) (exim4).

#### TCP

See the **Local Address** column of the netstat readout. The process `rpcbind` is listening on `0.0.0.0:111` and `:::111` for a foreign address of `0.0.0.0:*` or `:::*`. This means that it's accepting incoming TCP connections from other RPC clients on any external address, both IPv4 and IPv6, from any port and over any network interface. We see similar for SSH, and that Exim is listening locally for traffic from the loopback interface, as shown by the `127.0.0.1` address.

#### UDP

UDP sockets are *[stateless](https://en.wikipedia.org/wiki/Stateless_protocol)*, meaning they are either open or closed and every process's connection is independent of those which occurred before and after. This is in contrast to TCP connection states such as *LISTEN*, *ESTABLISHED* and *CLOSE_WAIT*. 

Our netstat output shows that NTPdate is: 1) accepting incoming connections on the Linode's public IP address; 2) communicates over localhost; and 3) accepts connections from external sources. These are over port 123, and both IPv4 and IPv6. We also see more sockets open for RPC.

### Determine Which Services to Remove

If you were to do a basic TCP and UDP [nmap](https://nmap.org/) scan of your Linode without a firewall enabled, SSH, RPC and NTPdate would be present in the result with ports open. By [configuring a firewall](#configure-a-firewall) you can filter those ports, with the exception of SSH because it must allow your incoming connections. Ideally, however, the unused services should be disabled.

* You will likely be administering your server primarily through an SSH connection, so that service needs to stay. As mentioned above, [RSA keys](/docs/security/securing-your-server/#create-an-authentication-keypair) and [Fail2Ban](/docs/security/securing-your-server/#use-fail2ban-for-ssh-login-protection) can help protect SSH.

* NTP is necessary for your server's timekeeping but there are alternatives to NTPdate. If you prefer a time synchronization method which does not hold open network ports, and you do not need nanosecond accuracy, then you may be interested in replacing NTPdate with [OpenNTPD](https://en.wikipedia.org/wiki/OpenNTPD).

* Exim and RPC, however, are unnecessary unless you have a specific use for them, and should be removed.

{: .note }
>
>This section focused on Debian 8. Different Linux distributions have different services enabled by default. If you are unsure of what a service does, do an internet search to understand what it is before attempting to remove or disable it.

### Uninstall the Listening Services

How to remove the offending packages will differ depending on your distribution's package manager.

**Arch**

    sudo pacman -Rs package_name

**CentOS**

    sudo yum remove package_name

**Debian / Ubuntu**

    sudo apt-get purge package_name

**Fedora**

    sudo dnf remove package_name

Run `sudo netstat -tulpn` again. You should now only see listening services for SSH (sshd) and NTP (ntpdate, network time protocol).

## Configure a Firewall

Using a *firewall* to block unwanted inbound traffic to your Linode is a highly effective security layer. By being very specific about the traffic you allow in, you can prevent intrusions and network mapping from outside your LAN. A best practice is to allow only the traffic you need, and deny everything else. 

[Iptables](http://www.netfilter.org/projects/iptables/index.html) is the controller for netfilter, the Linux kernel's packet filtering framework. Iptables is included in most Linux distros by default but is considered an advanced method of firewall control. Consequently, several projects exist to control iptables in a more user-friendly way.

[FirewallD](http://www.firewalld.org/) for the Fedora distribution family and [UFW](https://help.ubuntu.com/community/UFW) for the Debian family are the two common iptables controllers. **This section will focus on iptables** but you can see our guides on [FirewallD](/docs/security/firewalls/introduction-to-firewalld-on-centos) and [UFW](/docs/security/firewalls/configure-firewall-with-ufw) if you feel they may be a better choice for you.

### View Your Current iptables Rules

IPv4:

    sudo iptables -L

IPv6:

    sudo ip6tables -L

Iptables has no rules by default for both IPv4 and IPv6. As a result, on a newly created Linode you will see what is shown below--three empty chains without any firewall rules. This means that all incoming, forwarded and outgoing traffic is *allowed*. It's important to limit inbound and forwarded traffic to only what's necessary.

    Chain INPUT (policy ACCEPT)
    target     prot opt source               destination

    Chain FORWARD (policy ACCEPT)
    target     prot opt source               destination

    Chain OUTPUT (policy ACCEPT)
    target     prot opt source               destination


### Basic iptables Rulesets for IPv4 and IPv6

Appropriate firewall rules depend almost entirely on the services being run. Below are iptables rulesets to secure your Linode if you're running a web server.

*These are given as an example!*

A real production web server may require more or less configuration and these rules would not be appropriate for a file or database server, Minecraft or VPN server, etc. Iptables rules can always be modified or reset later, but these basic rulesets serve only as a beginning demonstration.

**IPv4**

{: .file}
/tmp/v4
:   ~~~ conf
    *filter

    # Allow all loopback (lo0) traffic and reject traffic
    # to localhost that does not originate from lo0.
    -A INPUT -i lo -j ACCEPT
    -A INPUT ! -i lo -s 127.0.0.0/8 -j REJECT

    # Allow ping.
    -A INPUT -p icmp -m state --state NEW --icmp-type 8 -j ACCEPT

    # Allow SSH connections.
    -A INPUT -p tcp --dport 22 -m state --state NEW -j ACCEPT

    # Allow HTTP and HTTPS connections from anywhere
    # (the normal ports for web servers).
    -A INPUT -p tcp --dport 80 -m state --state NEW -j ACCEPT
    -A INPUT -p tcp --dport 443 -m state --state NEW -j ACCEPT

    # Allow inbound traffic from established connections.
    # This includes ICMP error returns.
    -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

    # Log what was incoming but denied (optional but useful).
    -A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables_INPUT_denied: " --log-level 7

    # Reject all other inbound.
    -A INPUT -j REJECT

    # Log any traffic which was sent to you
    # for forwarding (optional but useful).
    -A FORWARD -m limit --limit 5/min -j LOG --log-prefix "iptables_FORWARD_denied: " --log-level 7

    # Reject all traffic forwarding.
    -A FORWARD -j REJECT

    COMMIT
    ~~~

**Optional:** If you plan to use [Linode Longview](/docs/platform/longview/longview) or [Linode's NodeBalancers](/docs/platform/nodebalancer/getting-started-with-nodebalancers), add the respective rule after the section for allowing HTTP and HTTPS connections:

~~~
# Allow incoming Longview connections.
-A INPUT -s longview.linode.com -m state --state NEW -j ACCEPT
~~~

~~~
# Allow incoming NodeBalancer connections.
-A INPUT -s 192.168.255.0/24 -m state --state NEW -j ACCEPT
~~~

**IPv6**

If you would like to supplement your web server's IPv4 rules with IPv6 too, this ruleset will allow HTTP/S access and all ICMP functions.

{: .file}
/tmp/v6
:   ~~~ conf
    *filter

    # Allow all loopback (lo0) traffic and reject traffic
    # to localhost that does not originate from lo0.
    -A INPUT -i lo -j ACCEPT
    -A INPUT ! -i lo -s ::1/128 -j REJECT

    # Allow ICMP
    -A INPUT -p icmpv6 -j ACCEPT

    # Allow HTTP and HTTPS connections from anywhere
    # (the normal ports for web servers).
    -A INPUT -p tcp --dport 80 -m state --state NEW -j ACCEPT
    -A INPUT -p tcp --dport 443 -m state --state NEW -j ACCEPT

    # Allow inbound traffic from established connections.
    -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

    # Log what was incoming but denied (optional but useful).
    -A INPUT -m limit --limit 5/min -j LOG --log-prefix "ip6tables_INPUT_denied: " --log-level 7

    # Reject all other inbound.
    -A INPUT -j REJECT

    # Log any traffic which was sent to you
    # for forwarding (optional but useful).
    -A FORWARD -m limit --limit 5/min -j LOG --log-prefix "ip6tables_FORWARD_denied: " --log-level 7

    # Reject all traffic forwarding.
    -A FORWARD -j REJECT

    COMMIT
    ~~~

{: .note}
>
>[APT](http://linux.die.net/man/8/apt) attempts to resolve mirror domains to IPv6 as a result of `apt-get update`. If you choose to entirely disable and deny IPv6, this will slow down the update process for Debian and Ubuntu because APT waits for each resolution to time out before moving on.
>
>To remedy this, uncomment the line `precedence ::ffff:0:0/96  100` in `/etc/gai.conf`.

How these IPv4 and IPv6 rules are deployed differs among the various Linux distros.

### Arch Linux

1.  Create the files `/etc/iptables/iptables.rules` and `/etc/iptables/ip6tables.rules`. Paste the [rulesets above](#basic-iptables-rulesets-for-ipv4-and-ipv6) into their respective files.

2.  Import the rulesets into immediate use:

        sudo iptables-restore < /etc/iptables/iptables.rules
        sudo ip6tables-restore < /etc/iptables/ip6tables.rules

3.  Iptables does not run by default in Arch. Enable and start the systemd units:

        sudo systemctl start iptables && sudo systemctl start ip6tables
        sudo systemctl enable iptables && sudo systemctl enable ip6tables

4.  Apply the `pre-network.conf` fix from the [ArchWiki](https://wiki.archlinux.org/index.php/Iptables#Configuration_and_usage), so iptables starts before the network is up.

For more info on using iptables in Arch, see its Wiki entries for [iptables](https://wiki.archlinux.org/index.php/Iptables) and a [Simple Stateful Firewall](https://wiki.archlinux.org/index.php/Simple_stateful_firewall).

### CentOS / Fedora

**CentOS 6 or Fedora 19 and below**

1.  Create the files `/tmp/v4` and `/tmp/v6`. Paste the [rulesets above](#basic-iptables-rulesets-for-ipv4-and-ipv6) into their respective files.

2.  Import the rules from the temporary files:

        sudo iptables-restore < /tmp/v4
        sudo ip6tables-restore < /tmp/v6

3.  Save the rules:

        sudo service iptables save
        sudo service ip6tables save

    {: .note }
    >
    >Firewall rules are saved to `/etc/sysconfig/iptables` and `/etc/sysconfig/ip6tables`.

4.  Remove the temporary rule files:

        sudo rm /tmp/{v4,v6}

**CentOS 7 or Fedora 20 and above**

In these distros, FirewallD is used to implement firewall rules instead of controlling iptables directly. If you would prefer to use it over iptables, see our guide: [Introduction to FirewallD on CentOS](/docs/security/firewalls/introduction-to-firewalld-on-centos).

1.  If you would prefer to use iptables, FirewallD must first be stopped and disabled.

        sudo systemctl stop firewalld.service && sudo systemctl disable firewalld.service

2.  Install `iptables-services` and enable iptables:

        sudo yum install iptables-services
        sudo systemctl enable iptables && sudo systemctl enable ip6tables
        sudo systemctl start iptables && sudo systemctl start ip6tables

3.  Create the files `/tmp/v4` and `/tmp/v6`. Paste the [rulesets above](#basic-iptables-rulesets-for-ipv4-and-ipv6) into their respective files.

4.  Import the rulesets into immediate use:

        sudo iptables-restore < /tmp/v4
        sudo ip6tables-restore < /tmp/v6

5.  Save each ruleset:

        sudo service iptables save
        sudo service ip6tables save

6.  Remove the temporary rule files:

        sudo rm /tmp/{v4,v6}

For more information on using iptables and FirewallD in CentOS and Fedora, see these pages:

CentOS Wiki: [iptables](https://wiki.centos.org/HowTos/Network/IPTables)

Fedora Project Wiki: [FirewallD](https://fedoraproject.org/wiki/FirewallD?rd=FirewallD/)

Fedora Project Wiki: [How to Edit iptables Rules](https://fedoraproject.org/wiki/How_to_edit_iptables_rules)

Red Hat Security Guide: [Using Firewalls](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/Security_Guide/sec-Using_Firewalls.html)

### Debian / Ubuntu

UFW is the iptables controller included with Ubuntu but is also available in Debian's repositories. If you would prefer to use UFW instead of ipables, see our guide: [How to Configure a Firewall with UFW](/docs/security/firewalls/configure-firewall-with-ufw).

1.  Create the files `/tmp/v4` and `/tmp/v6`. Paste the [above rulesets](#basic-iptables-rulesets-for-ipv4-and-ipv6) into their respective files.

2.  Import the rulesets into immediate use:

        sudo iptables-restore < /tmp/v4
        sudo ip6tables-restore < /tmp/v6

3.  [Iptables-persistent](https://github.com/zertrin/iptables-persistent) automates loading iptables rules on boot for Debian and Ubuntu. Install it from the distro repositories:

        sudo apt-get install iptables-persistent

4. You'll be asked if you want to save the current IPv4 and IPv6 rules. Answer `yes` to each prompt.

5.  Remove the temporary rule files:

        sudo rm /tmp/{v4,v6}

### Verify iptables Rulesets

Recheck your Linode's firewall rules with the `v` option for a verbose output:

    sudo iptables -vL
    sudo ip6tables -vL

The output for IPv4 rules should show:

~~~
Chain INPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination
    0     0 ACCEPT     all  --  lo     any     anywhere             anywhere
    0     0 REJECT     all  --  !lo    any     loopback/8           anywhere             reject-with icmp-port-unreachable
    0     0 ACCEPT     icmp --  any    any     anywhere             anywhere             icmp destination-unreachable
    0     0 ACCEPT     icmp --  any    any     anywhere             anywhere             icmp echo-request
    0     0 ACCEPT     icmp --  any    any     anywhere             anywhere             icmp time-exceeded
    0     0 ACCEPT     tcp  --  any    any     anywhere             anywhere             tcp dpt:ssh state NEW
    0     0 ACCEPT     tcp  --  any    any     anywhere             anywhere             tcp dpt:http state NEW
    0     0 ACCEPT     tcp  --  any    any     anywhere             anywhere             tcp dpt:https state NEW
    0     0 ACCEPT     all  --  any    any     anywhere             anywhere             state RELATED,ESTABLISHED
    0     0 LOG        all  --  any    any     anywhere             anywhere             limit: avg 5/min burst 5 LOG level debug prefix "iptables_INPUT_denied: "
    0     0 REJECT     all  --  any    any     anywhere             anywhere             reject-with icmp-port-unreachable

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination
    0     0 LOG        all  --  any    any     anywhere             anywhere             limit: avg 5/min burst 5 LOG level debug prefix "iptables_FORWARD_denied: "
    0     0 REJECT     all  --  any    any     anywhere             anywhere             reject-with icmp-port-unreachable

Chain OUTPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination
~~~

Output for IPv6 rules will look like this:

~~~
Chain INPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination
    0     0 ACCEPT     all      lo     any     anywhere             anywhere
    0     0 REJECT     all      !lo    any     localhost            anywhere             reject-with icmp6-port-unreachable
    0     0 ACCEPT     ipv6-icmp    any    any     anywhere             anywhere
    0     0 ACCEPT     tcp      any    any     anywhere             anywhere             tcp dpt:http state NEW
    0     0 ACCEPT     tcp      any    any     anywhere             anywhere             tcp dpt:https state NEW
    0     0 ACCEPT     all      any    any     anywhere             anywhere             state RELATED,ESTABLISHED
    0     0 LOG        all      any    any     anywhere             anywhere             limit: avg 5/min burst 5 LOG level debug prefix "ip6tables_INPUT_denied: "
    0     0 REJECT     all      any    any     anywhere             anywhere             reject-with icmp6-port-unreachable

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination
    0     0 LOG        all      any    any     anywhere             anywhere             limit: avg 5/min burst 5 LOG level debug prefix "ip6tables_FORWARD_denied: "
    0     0 REJECT     all      any    any     anywhere             anywhere             reject-with icmp6-port-unreachable

Chain OUTPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination
~~~

Your firewall rules are now in place and protecting your Linode. Remember, you may need to edit these rules later if you install other packages which require network access.

### Insert, Replace or Delete iptables Rules

Iptables rules are enforced in a top-down fashion, so the first rule in the ruleset is applied to traffic in the chain, then the second, third and so on. This means that rules can not necessarily be added to a ruleset with `iptables -A` or `ip6tables -A`. Instead, rules must be *inserted* with `iptables -I` or `ip6tables -I`.

**Insert**

Inserted rules need to be placed in the correct order with respect other rules in the chain. To get a numerical list of your iptables rules:

    sudo iptables -L --line-numbers

For example, let's say we want to insert a rule to [the ruleset above](#basic-iptables-rulesets-for-ipv4-and-ipv6) which accepts incoming [Linode Longview](https://www.linode.com/docs/platform/longview/longview) connections. We'll add it as rule 9 to the INPUT chain, following the web traffic rules.

    sudo iptables -I INPUT 9 -p tcp --dport 8080 -j ACCEPT

If you now run `sudo iptables -L` again, you'll see the new rule in the output.

**Replace**

Replacing a rule is similar to inserting but instead uses `iptables -R`. For example, let's say you want to reduce the logging of denied entires to only 3 per minute, down from 5 in the original ruleset. The LOG rule is the 11th in the INPUT chain:

    sudo iptables -R INPUT 11 -m limit --limit 3/min -j LOG --log-prefix "iptables_INPUT_denied: " --log-level 7

**Delete**

Deleting a rule is also done using the rule number. For example, to delete the rule we just inserted for Linode Longview:

    sudo iptables -D INPUT 9

{: .caution }
>
>Editing rules does not automatically save them! To accomplish this, revisit the area above for your distro to save your iptables edits so they're loaded on reboots.

## Next Steps

These are the most basic steps to harden any Linux server, but further security layers will depend more heavily on its intended use. Additional techniques can include application configurations, using [intrusion detection](https://linode.com/docs/security/ossec-ids-debian-7) or installing a form of [access control](https://en.wikipedia.org/wiki/Access_control#Access_Control).

Now you can begin setting up your Linode for any purpose you choose. We have a library of documentation to assist you with a variety of topics ranging from [migration from shared hosting](/docs/migrate-to-linode/migrate-from-shared-hosting) to [enabling two-factor authentication](/docs/security/linode-manager-security-controls) to [hosting a website](/docs/hosting-website).

[Linode Guides & Tutorials](/docs/)
