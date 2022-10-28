---
slug: troubleshooting-ssh
author:
  name: Linode
  email: docs@linode.com
description: "Troubleshooting steps for when you can't connect to your Linode via SSH."
keywords: ['linux','reboot','lish','ssh']
tags: ["ssh"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-02-01
modified: 2019-02-01
modified_by:
  name: Linode
title: "Troubleshooting SSH"
aliases: ['/troubleshooting/troubleshooting-ssh/']
---

This guide presents troubleshooting strategies for when you can't connect to your Linode via SSH. If you currently cannot [ping](/docs/tools-reference/linux-system-administration-basics/#the-ping-command) your Linode, then your server also likely has more basic connection issues. If this is the case, you should instead follow the [Troubleshooting Basic Connection Issues](/docs/guides/troubleshooting-basic-connection-issues/) guide. If you restore basic networking to your Linode but still can't access SSH, return to this guide.

If you can access SSH but not other services, refer to the [Troubleshooting Web Servers, Databases, and Other Services](/docs/guides/troubleshooting-web-servers-databases-other-services/) guide.

{{< disclosure-note "Where to go for help outside this guide" >}}
This guide explains how to use different troubleshooting commands on your Linode. These commands can produce diagnostic information and logs that may expose the root of your connection issues. For some specific examples of diagnostic information, this guide also explains the corresponding cause of the issue and presents solutions for it.

If the information and logs you gather do not match a solution outlined here, consider searching the [Linode Community Site](https://www.linode.com/community/questions/) for posts that match your system's symptoms. Or, post a new question in the Community Site and include your commands' output.

Linode is not responsible for the configuration or installation of software on your Linode. Refer to Linode's [Scope of Support](/docs/platform/billing-and-support/support/#scope-of-support) for a description of which issues Linode Support can help with.
{{< /disclosure-note >}}

## Before You Begin

Before troubleshooting your SSH service, familiarize yourself with the Linode Shell.

### The Linode Shell (Lish)

[*Lish*](/docs/guides/using-the-lish-console/) is a shell that provides access to your Linode's serial console. Lish does not establish a network connection to your Linode, so you can use it when your networking is down or SSH is inaccessible. While troubleshooting SSH, all commands you enter on your Linode will be performed from the Lish console.

To learn about Lish in more detail, and for instructions on how to connect to your Linode via Lish, review the [Using the Lish Console](/docs/guides/using-the-lish-console/) guide. In particular, [using your web browser](/docs/guides/using-the-lish-console/#through-the-cloud-manager-weblish) is a fast and simple way to access Lish.

### Forgotten your Password?

If you have forgotten your Linux user's password, you will not be able to log in with Lish. You can reset the root password for your Linode with [these instructions](/docs/guides/reset-the-root-password-on-your-linode/). If you are logged in as root, you can change the password of another user with the `passwd` command:

    passwd <username>

If you reset your password and can log in with Lish, try logging in with SSH, as that may have been the cause of your connection problems.

## Troubleshoot Unresponsive SSH Connections

If your SSH connection attempts are timing out or are being immediately rejected, then your SSH daemon may not be running, or your firewall may be blocking SSH connections. This section will help troubleshoot these issues.

If your connections are *not* timing out or being rejected, or if you are able to resolve these issues but you still can't access SSH because of rejected login attempts, then continue to the [Troubleshoot Rejected SSH Logins](#troubleshoot-rejected-ssh-logins) section.

### Is SSH Running?

1.  To check on the status of your SSH daemon, run:

    | **Distribution** | **Command**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
    | ------------ | ------- |
    | systemd systems (Arch, Ubuntu 16.04+, Debian 8+, CentOS 7+, etc) | `sudo systemctl status sshd -l` |
    | CentOS 6 | `sudo service sshd status` |
    | Ubuntu 14.04, Debian 7 | `sudo service ssh status` |

1.  If the command reports the service is running, review the [Is SSH Running on a Non-Standard Port?](#is-ssh-running-on-a-non-standard-port) section.

1.  If the command reports the service is not running, then try restarting it:

    | **Distribution** | **Command** |
    | ------------ | ------- |
    | systemd systems | `sudo systemctl restart sshd` |
    | CentOS 6 | `sudo service sshd restart` |
    | Ubuntu 14.04, Debian 7 | `sudo service ssh restart` |

1.  Check the status of the service again. If it's still not running, view the logs for the service:

    | **Distribution** | **Command** |
    | ------------ | ------- |
    | systemd systems | `sudo journalctl -u sshd -u ssh` |
    | CentOS 6 | `less /var/log/secure` |
    | Ubuntu 14.04, Debian 7 | `less /var/log/auth.log` |

    {{< note >}}
Review the [journalctl](/docs/guides/how-to-use-journalctl/) and [less](/docs/guides/how-to-use-less/) guides for help with navigating your logs when using those commands.
{{< /note >}}

1.  Review the [Is Another Service Bound on the Same Port?](#is-another-service-bound-on-the-same-port) section. Then:

    -   If you can start the SSH service successfully, but your connections still time out or are rejected, then [review your firewall rules](#review-firewall-rules).

    -   If you can't get the service to start, try pasting your logs into a search engine or searching for your logs in the [Linode Community Site](https://www.linode.com/community/questions/) to see if anyone else has run into similar issues. If you don't find any results, you can try asking about your issues in a new post on the Linode Community Site.

### Is SSH Running on a Non-Standard Port?

Run `netstat` on your Linode to check which port is used by SSH:

    sudo netstat -plntu | grep ssh
    tcp        0      0 0.0.0.0:41              0.0.0.0:*               LISTEN      4433/sshd
    tcp6       0      0 :::41                   :::*                    LISTEN      4433/sshd

This example output shows that SSH is running on port 41. You can connect to SSH by manually specifying this port:

    ssh username@192.0.2.4 -p 41

Alternatively, you can [bind SSH](#bind-ssh-to-a-port-number) on the standard port (22).

### Is Another Service Bound on the Same Port?

Check your SSH logs for a message that looks like:

{{< output >}}
Jan 23 10:29:52 localhost sshd[4370]: error: Bind to port 22 on 0.0.0.0 failed: Address already in use.
{{< /output >}}

This error indicates that another service on your system is already using the same port that SSH binds to, and so SSH can't start. To resolve this issue, choose one of the following solutions.

-   **Bind SSH to a different port**

    Follow instructions for [setting SSH's port number](#bind-ssh-to-a-port-number), and specify a different number than the one that is already in-use.

-   **Stop the other service**

    1.  Use the `netstat` command to discover which other process is using the same port:

            sudo netstat -plntu | grep :22

            tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      4433/some-other-service
            tcp6       0      0 :::22                   :::*                    LISTEN      4433/some-other-service

    1.  Stop and disable that other service:

            sudo systemctl stop some-other-service
            sudo systemctl disable some-other-service

        Or, [kill](/docs/guides/use-killall-and-kill-to-stop-processes-on-linux/) the process using the process ID listed next to the process name in the output from `netstat`.

-   **Assign a different port to the other service**

    1.  Use the `netstat` command to find out what service is bound to the same port.

    1.  Then, change the configuration for that service to use a different port.

    1.  Restart SSH.

### Bind SSH to a Port Number

1.  Open `/etc/ssh/sshd_config` in your editor. Search for a line in this file that declares the port for SSH:

    {{< file "/etc/ssh/sshd_config" >}}
#Port 22
{{< /file >}}

1.  Uncomment this line and provide a different number.

1.  Save the file and restart the SSH service.

### Review Firewall Rules

If your service is running but your connections still fail, your firewall (which is likely implemented by the `iptables` software) may be blocking the connections. To review your current firewall ruleset, run:

    sudo iptables-save # displays IPv4 rules
    sudo ip6tables-save # displays IPv6 rules

{{< note >}}
Your deployment may be running FirewallD or UFW, which are frontends used to more easily manage your iptables rules. Run these commands to find out if you are running either package:

    sudo ufw status
    sudo firewall-cmd --state

Review [How to Configure a Firewall with UFW](/docs/security/firewalls/configure-firewall-with-ufw/#ufw-status) and [Introduction to FirewallD on CentOS](/docs/security/firewalls/introduction-to-firewalld-on-centos/#firewall-zones) to learn how to manage and inspect your firewall rules with those packages.
{{< /note >}}

Firewall rulesets can vary widely. Review the [Control Network Traffic with iptables](/docs/guides/control-network-traffic-with-iptables/) guide to analyze your rules and determine if they are blocking connections. A rule which allows incoming SSH traffic could look like this:

{{< output >}}
-A INPUT -p tcp -m tcp --dport 22 -m conntrack --ctstate NEW -j ACCEPT
{{< /output >}}


In some cases, [fail2ban](https://www.fail2ban.org/wiki/index.php/Main_Page), a tool used for automating the creation of firewall rules to block IP addresses, may be responsible for creating rules that result in a lost connection. If you see firewall chains in place prefixed with `f2b` or `fail2ban`, see our [fail2ban guide](/docs/security/using-fail2ban-to-secure-your-server-a-tutorial/#lockout-recovery) for troubleshooting this service.

### Disable Firewall Rules

In addition to analyzing your firewall ruleset, you can also temporarily disable your firewall to test if it is interfering with your connections. Leaving your firewall disabled increases your security risk, so we recommend re-enabling it afterward with a modified ruleset that will accept your connections. Review [Control Network Traffic with iptables](/docs/guides/control-network-traffic-with-iptables/) for help with this subject.

1.  Create a temporary backup of your current iptables rules:

        sudo iptables-save > ~/iptables.txt

1.  Set the `INPUT`, `FORWARD` and `OUTPUT` packet policies as `ACCEPT`:

        sudo iptables -P INPUT ACCEPT
        sudo iptables -P FORWARD ACCEPT
        sudo iptables -P OUTPUT ACCEPT

1.  Flush the `nat` table that is consulted when a packet that creates a new connection is encountered:

        sudo iptables -t nat -F

1.  Flush the `mangle` table that is used for specialized packet alteration:

        sudo iptables -t mangle -F

1.  Flush all the chains in the table:

        sudo iptables -F

1.  Delete every non-built-in chain in the table:

        sudo iptables -X

1.  Repeat these steps with the `ip6tables` command to flush your IPv6 rules. Be sure to assign a different name to the IPv6 rules file (e.g. `~/ip6tables.txt`).

## Troubleshoot Rejected SSH Logins

If SSH is listening and accepting connections but is rejecting login attempts, review these instructions:

### Is Root Login Permitted?

SSH can be configured to disable logins for the root user. To check your SSH configuration, run:

    grep PermitRootLogin /etc/ssh/sshd_config

If the value of the `PermitRootLogin` is `no`, then try logging in with another user. Or, set the value in `/etc/ssh/sshd_config` to `yes`, restart SSH, and try logging in as root again.

{{< note >}}
This option can also be set with the value `without-password`. If this value is used, root logins are accepted with public key authentication.
{{< /note >}}

### Are Password Logins Accepted?

SSH can be configured to not accept passwords and instead accept public key authentication. To check your SSH configuration, run:

    grep PasswordAuthentication /etc/ssh/sshd_config

If the value of the `PasswordAuthentication` is `no`, [create a key-pair](/docs/guides/set-up-and-secure/#create-an-authentication-key-pair). Or, set the value in `/etc/ssh/sshd_config` to `yes`, restart SSH, and try logging in with your password again.

### Is your Public Key Stored on the Server?

If you prefer to use public key authentication, but your login attempts with your key are not working, double-check that the server has your public key. To check which keys are recognized for your user, run:

    cat ~/.ssh/authorized_keys

If your public key is not listed in this file, add it to the file on a new line.

On some systems, your authorized keys file may be listed in a different location. Run this command to show where your file is located:

    grep AuthorizedKeysFile /etc/ssh/sshd_config

### Collect Login Attempt Logs

If the previous troubleshooting steps do not resolve your issues, collect more information about how your logins are failing:

-   View your login attempts in the log files described in step 4 of [Is SSH Running?](#is-ssh-running). In particular, you can search these logs for your local IP address, and the results will show what error messages were recorded for your logins. To find out what your local IP is, visit a website like https://www.whatismyip.com/.

-   Use your SSH client in verbose mode, which will show details for each part of the connection process. Verbose mode is invoked by passing the `-v` option. Passing more than one `v` increases the verbosity. You can use up to three `v`s:

        ssh -v username@192.0.2.4
        ssh -vv username@192.0.2.4
        ssh -vvv username@192.0.2.4

Try pasting your logs into a search engine or searching for your logs in the [Linode Community Site](https://www.linode.com/community/questions/) to see if anyone else has run into similar issues. If you don't find any results, you can try asking about your issues in a new post on the Linode Community Site.