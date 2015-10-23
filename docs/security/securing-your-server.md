---
author:
  name: Linode
  email: docs@linode.com
description: 'A basic list of best practices for hardening a production server.'
keywords: 'security,secure,firewall,ssh,add user,quick start'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['securing-your-server/']
modified: 'Friday, October 23rd, 2015'
modified_by:
  name: Linode
published: 'Friday, February 17th, 2012'
title: Securing Your Server
---

In the [Getting Started](/docs/getting-started) guide, you learned how to deploy Linux, boot your Linode and perform some basic administrative tasks. Now it's time to harden your Linode to protect it from unauthorized access.

## Update Your System--Frequently

Keeping your software up to date is the single biggest security precaution you can take for any operating system--be it desktop, mobile or server. Software updates frequently contain patches ranging from critical security vulnerabilities to minor bug , and many software vulnerabilities are actually patched by the time they become publicized. It is important that you ***

### Automatic Security Updates

Automatic updates for any operating system is a controvertial topic, especially on servers. Nonetheless, CentOS, Debian, Fedora and Ubuntu can be automatically updated to various extents. [Fedora's Wiki](https://fedoraproject.org/wiki/AutoUpdates#Why_use_Automatic_updates.3F) has a good breakdown of the pros and cons, but if you limit updates to those for security issues, the risk of using automatic updates will be minimal.

The practicality of automatic updates must be something which you judge for yourself because it comes down to what *you* do with your Linode, and bear in mind that automatic updates apply only to packages sourced from repositories, not self-compiled applications. You may find it worthwhile to have a test environment which replicates your production server. Updates can be applied there and reviewed for issues before being applied to the live environment.

* CentOS uses *[yum-cron](https://fedoraproject.org/wiki/AutoUpdates#Fedora_21_or_earlier_versions)* for automatic updates.

* Debian and Ubuntu use *[unattended upgrades](https://help.ubuntu.com/lts/serverguide/automatic-updates.html)*.

* Fedora uses *[dnf-automatic](https://dnf.readthedocs.org/en/latest/automatic.html)*.

## Add a Limited User Account

Up to this point, you have been logging in to Linode as the `root` user. The problem with this is that root has unlimited privileges and can execute *any* command - even one that could accidentally break your server. For this reason and others, we recommend creating a limited user account and using that at all times. Administrative tasks will be done using `sudo` to temporarily elevate your limited user's privliges.

To add a new user, [log in to your Linode](/docs/getting-started#sph_logging-in-for-the-first-time) via SSH.

### CentOS / Fedora

1.  Create the user, replacing `example_user` with your desired username, and assign a password:

        adduser example_user && passwd example_user

2.  Add the user to the `wheel` group for sudo privileges:

    **CentOS 7 / Fedora**

        usermod example_user -aG wheel

    **CentOS 6**

        usermod -aG wheel example_user

### Debian / Ubuntu

1.  Create the user, replacing `example_user` with your desired username. You'll then be asked to assign the user a password.

        adduser example_user

2.  Add the user to the *sudo* group so you'll have administrative privileges:

        usermod -aG sudo example_user

With your new user assigned, log out of your Linode as root:

    logout

Log back in to your Linode as your new user. Replace `example_user` with your username, and the example IP address with your Linode's IP address:

    ssh example_user@123.456.78.9

Now you can administer your Linode with the new user account instead of `root`. Superuser commands can now be prefaced with `sudo`; for example, `sudo iptables -L`. Nearly all superuser commands can be executed with `sudo`, and all commands executed with `sudo` will be logged to `/var/log/auth.log`.

## Harden SSH Access

By default, password authentication is used to connect to your Linode via SSH, but this should be changed so that your connection requires a cryptographic keypair. A keypair is more secure because a private key takes the place of a password, which is generally much more difficult to bruteforce.

### Create an Authentication Keypair

1.  This is done on your local computer, **not** your Linode. The `ssh-keygen` default settings create a 2048-bit RSA keypair. During creation, you will be given the option to protect the keypair with a passphrase. This means that the key cannot be used without entering the passphrase. If unwanted, leave the fields blank and press **Enter** to finish.

    **Linux / OS X**

    This creates the key files `id_rsa` and `id_rsa.pub` in `/home/your_username/.ssh`.

        ssh-keygen

    **Windows**

    This can be done using PuTTY as outlined in our guide: [Use Public Key Authentication with SSH](/docs/security/use-public-key-authentication-with-ssh#windows-operating-system).

2.  Upload the public key to your Linode. The `linde_user` should be the user you plan to administer the server as.

    **Linux**

    From your local computer:

        ssh-copy-id linode_user@123.456.78.0

    **OS X**

    On your Linode:

        sudo mkdir ~/.ssh && sudo chmod -R 700

    From your local computer:

        scp ~/.ssh/id_rsa.pub linode_user@123.456.78.9:~/.ssh/authorized_keys

    {: .note}
    >
    >`ssh-copy-id` is available in Homebrew if you prefer it over direct SCP. Install with `brew ssh-copy-id`.

    **Windows**

    This can be done using [WinSCP](http://winscp.net/).

### SSH Daemon Options

1.  Now log back into your Linode. If you specified a passphrase for your RSA key, you'll need to enter it.

2.  Disable SSH password authentication. This requires all users connecting via SSH to use key authentication.

    {: .file-excerpt}
    /etc/ssh/sshd_config
    :   ~~~ conf
        # Authentication:
        ...
        PermitRootLogin no
        ~~~

    {: .caution }
    >
    >You may want to leave password authentication enabled if you connect to your Linode from many different computers. This will allow you to authenticate with a password instead of generating and uploading a keypair for every device.

3.  Disallow root logins over SSH. This means that you must first SSH into your Linode as a limited user and then either run administrative commands with `sudo`, or change user to root using `su`.

    {: .file-exceprt}
    /etc/ssh/sshd_config
    :   ~~~ conf
        # Change to no to disable tunnelled clear text passwords
        PasswordAuthentication no
        ~~~

        {: .note}
        >
        >Depending on the version of SSH your distro is using, the line `PasswordAuthentication` may need to be uncommented.

4.  Restart the SSH service to load the new configuration.

    If your Linux distribution uses systemd:

        sudo systemctl restart sshd

    If your distro uses System V or Upstart:

        sudo service ssh restart

### Use Fail2Ban for SSH Login Protection

[*Fail2Ban*](http://www.fail2ban.org/wiki/index.php/Main_Page) is an application which bans IP addresses from logging into your server after too many failed login attempts. Since legitimate logins usually take no more than 3 tries to happen (and with SSH keys, no more than 1), a server being spammed with unsuccessful logins indicates malicious attempts to access your Linode.

Fail2Ban can monitor a variety of protocols including SSH, HTTP, and SMTP. By default, Fail2Ban monitors SSH only, and is a helpful security deterrant for any server because the SSH daemon is usually configured to run constantly and listen for connections from any remote IP address.

For complete instructions on installing and configuring Fail2Ban, see our gudie: [Securing Your Server with Fail2ban]( /docs/security/security/using-fail2ban-for-security).

## Remove Unused Network-Facing Services

Most Linux distributions install with runnng network services which listen for incoming connections from the internet, the loopback interface, or a combination of both. Network-facing services which are not needed should be removed from the system to reduce the attack surface of both running process and installed packages.

### Determine Running Services

To see your Linode's running network services:

    sudo netstat -tulpn

{: .note}
>
>If netstat isn't included in your distro by default, install the package `net-tools`.

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
udp        0      0 123.45.67.89:123        0.0.0.0:*                           3327/ntpd
udp        0      0 127.0.0.1:123           0.0.0.0:*                           3327/ntpd
udp        0      0 0.0.0.0:123             0.0.0.0:*                           3327/ntpd
udp        0      0 0.0.0.0:705             0.0.0.0:*                           7315/rpcbind
udp6       0      0 :::111                  :::*                                7315/rpcbind
udp6       0      0 fe80::f03c:91ff:fec:123 :::*                                3327/ntpd
udp6       0      0 2600:3c03::123 :::*                                3327/ntpd
udp6       0      0 ::1:123                 :::*                                3327/ntpd
udp6       0      0 :::123                  :::*                                3327/ntpd
udp6       0      0 :::705                  :::*                                7315/rpcbind
udp6       0      0 :::60671                :::*                                2845/rpc.statd
~~~

netstat tells us that services are running for [Remote Procedure Call](https://en.wikipedia.org/wiki/Open_Network_Computing_Remote_Procedure_Call) (rpc.statd and rpcbind), SSH (sshd), [NTPdate](http://support.ntp.org/bin/view/Main/SoftwareDownloads) (ntpd) and [Exim](http://www.exim.org/) (exim4).

#### TCP

See the **Local Addres** column of the netstat readout. The process `rpcbind` is listening on `0.0.0.0:111` and `:::111` for a foreign address of `0.0.0.0:*` or `:::*`. This means that it's accepting incoming TCP connections from other RPC clients on any external address, both IPV4 and IPv6, from any port and over any network interface. We see similar for SSH, and that Exim is listening locally for traffic from the loopback interface, as shown by the `127.0.0.1` address.

#### UDP

RPC use UDP too, as does NTPdate. UDP sockets are *[stateless](https://en.wikipedia.org/wiki/Stateless_protocol)*, meaning they are either open or closed and every process's connection is independent of those which occurred before and after. This is in contrast to TCP connection states such as *LISTEN*, *ESTABLISHED* and *CLOSE_WAIT*. 

Our netstat output shows that NTPdate is: 1) accepting incoming connections on your Linode's public IP address; 2) communicates over localhost; and 3) accepts connections from external sources. These are over port 123, and both IPv4 and IPv6. We also see more sockets open for RPC.

### Determine Which Services to Remove

If you were to do a basic TCP and UDP [nmap](https://nmap.org/) scan of your Linode without a firewall enabled, SSH, RPC and NTPdate would be present in the result with ports open. These are security vulnerabilities which must be addressed. [Configuring a firewall](#configure-a-firewall) will filter those ports, with exception to SSH because it must allow your incoming connections. Ideally, however, the unused services should be removed from the operating system.

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

[iptables](http://www.netfilter.org/projects/iptables/index.html) is the controller for netfilter, the Linux kernel's packet filtering framework. iptables is included in most Linux distros by default but is considered an advanced method of firewall control. Consequently, several projects exist to control iptables in a more user-friendly way.

[FirewallD](http://www.firewalld.org/) for the Fedora distro family and [ufw](https://help.ubuntu.com/community/UFW) for the Debian family are the two common iptables controllers. This section will focus on iptables but you can see our guides on [FirewallD](/docs/security/firewalls/introduction-to-firewalld-on-centos) and [ufw](/docs/security/firewalls/configure-firewall-with-ufw) if you feel they may be a better choice for you.

### View Your Current iptables Rules

IPv4:

    sudo iptables -L

IPv6:

    sudo ip6tables -L

By default, iptables has no rules set for both IPv4 and IPv6. As a result, on a newly created Linode you will see what is shown below--three empty chains without any firewall rules. This means that all incoming, forwarded and outgoing traffic is *allowed*. It's important to limit inbound and forwarded traffic to only what's necessary.

    Chain INPUT (policy ACCEPT)
    target     prot opt source               destination

    Chain FORWARD (policy ACCEPT)
    target     prot opt source               destination

    Chain OUTPUT (policy ACCEPT)
    target     prot opt source               destination


### Basic iptables Rulesets for IPv4 and IPv6

Appropriate firewall rules depend almost entirely on the services being run. Below are iptables rulesets to secure your Linode if you're running a web server. *These are given as an example!* A real production web server may want or require more or less configuration and these rules would not be appropriate for a file or database server, Minecraft or VPN server, etc.

iptables rules can always be modified or reset later, but these basic rulesets serve only as a beginning demonstration.

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

**Optional:** If you plan to use [Linode Longview](/docs/platform/longview/longview) or [Linode's NodeBalancers](/docs/platform/nodebalancer/getting-started-with-nodebalancers) add the respective rule below the section for allowing HTTP and HTTPS connections:

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
    -A INPUT -p icmpv6 -m state --state NEW -j ACCEPT

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

Alternatively, the ruleset below should be used if you want to reject all IPv6 traffic:

{: .file}
/tmp/v6
:   ~~~ conf
    *filter

    # Reject all IPv6 on all chains.
    -A INPUT -j REJECT
    -A FORWARD -j REJECT
    -A OUTPUT -j REJECT

    COMMIT
    ~~~

{: .note}
>
>[APT](http://linux.die.net/man/8/apt) attempts to resolve mirror domains to IPv6 as a result of `apt-get update`. If you choose to deny IPv6 entirely, this greatly slows down the update process for Debian and Ubuntu because APT waits for each resolution to time out before moving on.
>
>To remedy this, uncomment the line `precedence ::ffff:0:0/96  100` in `/etc/gai.conf`. This is not necessary for Pacman, DNF or Yum.

How these IPv4 and IPv6 rules are deployed differs among the various Linux distros.

### Arch Linux

1.  Create the files `/etc/iptables/iptables.rules` and `/etc/iptables/ip6tables.rules`. Paste the [above rulesets](#basic-iptables-rulesets-for-ipv4-and-ipv6) into their respective files.

2.  Import the rulesets into immediate use.

        sudo iptables-restore < /etc/iptables/iptables.rules
        sudo ip6tables-restore < /etc/iptables/ip6tables.rules

3.  iptables is not running by default in Arch. Enable and start the systemd units.

        sudo systemctl start iptables && sudo systemctl start ip6tables
        sudo systemctl enable iptables && sudo systemctl enable ip6tables

4.  Apply the `pre-network.conf` fix from the [ArchWiki](https://wiki.archlinux.org/index.php/Iptables#Configuration_and_usage), so iptables starts before the network is up.

For more info on using iptables in Arch, see its Wiki entries for [iptables](https://wiki.archlinux.org/index.php/Iptables) and a [Simple Stateful Firewall](https://wiki.archlinux.org/index.php/Simple_stateful_firewall).

### CentOS / Fedora

**CentOS 6 or Fedora 19 and below**

1.  Create the files `/tmp/v4` and `/tmp/v6`. Paste the [above rulesets](#basic-iptables-rulesets-for-ipv4-and-ipv6) into their respective files.

2.  Import the rules from the temporary files.

        sudo iptables-restore < /tmp/v4
        sudo ip6tables-restore < /tmp/v6

3.  Save the rules.

        sudo service iptables save
        sudo service ip6tables save

    {: .note }
    >
    >Firewall rules are saved to `/etc/sysconfig/iptables` and `/etc/sysconfig/ip6tables`.

4.  Remove the temporary rule files.

        sudo rm /tmp/{v4,v6}

**CentOS 7 or Fedora 20 and above**

In these distros, Firewalld is used to implement firewall rules instead of controlling iptables directly. If you would prefer to use it over iptables, [see our FirewallD guide](/docs/security/firewalls/introduction-to-firewalld-on-centos) for getting it up and running.

1.  If you would prefer to use iptables, Firewalld must first be stopped and disabled.

        sudo systemctl stop firewalld.service && sudo systemctl disable firewalld.service

2.  Install iptables-services and enable iptables.

        sudo yum install iptables-services
        sudo systemctl enable iptables && sudo systemctl enable ip6tables
        sudo systemctl start iptables && sudo systemctl start ip6tables

3.  Create the files `/tmp/v4` and `/tmp/v6`. Paste the [above rulesets](#basic-iptables-rulesets-for-ipv4-and-ipv6) into their respective files.

4.  Import the rulesets into immediate use.

        sudo iptables-restore < /tmp/v4
        sudo ip6tables-restore < /tmp/v6

5.  Save each ruleset.

        sudo service iptables save
        sudo service ip6tables save

6.  Remove the temporary rule files.

        sudo rm /tmp/{v4,v6}

For more info on using iptables and FirewallD in CentOS and Fedora, see these pages:

CentOS Wiki: [iptables](https://wiki.centos.org/HowTos/Network/IPTables)

Fedora Project Wiki: [FirewallD](https://fedoraproject.org/wiki/FirewallD?rd=FirewallD/)

Fedora Project Wiki: [How to Edit iptables Ruels](https://fedoraproject.org/wiki/How_to_edit_iptables_rules)

Red Hat Security Guide: [Using Firewalls](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/Security_Guide/sec-Using_Firewalls.html)

### Debian / Ubuntu

ufw is the iptables controller included with Ubuntu but is also available in Debian's repositories. If you would prefer to use ufw instead of ipables, see [our ufw guide](/docs/security/firewalls/configure-firewall-with-ufw) to get a ruleset up and running.

1.  Create the files `/tmp/v4` and `/tmp/v6`. Paste the [above rulesets](#basic-iptables-rulesets-for-ipv4-and-ipv6) into their respective files.

2.  Import the rulesets into immediate use.

        sudo iptables-restore < /tmp/v4
        sudo ip6tables-restore < /tmp/v6

3.  [iptables-persistent](https://github.com/zertrin/iptables-persistent) automates loading iptables rules on boot for Debian and Ubuntu. Install it from the distro repositories.

        sudo apt-get install iptables-persistent

4. You'll be asked if you want to save the current IPv4 and IPv6 rules. Answer `yes` to each prompt.

5.  Remove the temporary rule files.

        sudo rm /tmp/{v4,v6}

### Verify iptables Rulesets

Recheck your Linode's firewall rules with the `v` option for a verbose output:

    sudo iptables -vL
    sudo ip6tables -vL

The output should show for IPv4 rules:

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

iptables rules are enforced in a top-down fashion, so the first rule in the ruleset is applied to traffic in the chain first, then the second, third and so on. This means that rules can not necessarily be added to a ruleset with `iptables -A` or `ip6tables -A`. Instead, we must *insert* a rule with `iptables -I` or `ip6tables -I`.

**Insert**

Inserted rules need to be placed in the correct order with respect other rules in the chain. To get a numerical list of your iptables rules:

    sudo iptables -L --line-numbers

For example, let's say we want to insert a rule into [the ruleset above](#basic-iptables-rulesets-for-ipv4-and-ipv6) which accepts incoming [Linode Longview](https://www.linode.com/docs/platform/longview/longview) connections. We'll add it as rule 9 to the INPUT chain, following the web traffic rules.

    sudo iptables -I INPUT 9 -p tcp --dport 8080 -j ACCEPT

If you now run `sudo iptables -L` again, you'll see the new rule in the output.

**Replace**

Replacing a rule is similar to inserting but instead uses `iptables -R`. For example, let's say you want to reduce the logging of denided entires to only 3 per minute, down from 5 in the original ruleset. The LOG rule is the 11th in the INPUT chain:

    sudo iptables -R INPUT 11 -m limit --limit 3/min -j LOG --log-prefix "iptables_INPUT_denied: " --log-level 7

**Delete**

Deleting a rule is also done with the rule number. For example, to delete the rule we just inserted for Linode Longview:

    sudo iptables -D INPUT 9

{: .caution }
>
>Editing rules does not automatically save them! To accomplish this, see the area above for your distro and save your iptables edits so they're loaded on reboots.

## Next Steps

These are the most basic steps to harden any Linux server, but further security layers will depend more heavily on its intended use. Additional techniques could be application configurations, using [intrusion detection](https://linode.com/docs/security/ossec-ids-debian-7) and installing a form of [access control](https://en.wikipedia.org/wiki/Access_control#Access_Control).

Now you can begin setting up your Linode for any purpose you choose. We have a library of documentation to assist you with a variety of topics ranging from [migration from shared hosting](/docs/migrate-to-linode/migrate-from-shared-hosting) to [enabling two-factor authentication](/docs/security/linode-manager-security-controls) to [hosting a website](/docs/hosting-website).

[Linode Guides & Tutorials](/docs/)