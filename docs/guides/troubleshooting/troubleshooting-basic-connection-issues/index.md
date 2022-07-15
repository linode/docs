---
slug: troubleshooting-basic-connection-issues
author:
  name: Linode
  email: docs@linode.com
description: 'Troubleshooting steps to help restore basic connectivity to your Linode when it is unresponsive.'
keywords: ['linux','reboot','lish']
tags: ["networking", "linode platform"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-02-01
modified: 2019-02-01
modified_by:
  name: Linode
title: "Troubleshooting Basic Connection Issues"
aliases: ['/troubleshooting/troubleshooting-basic-connection-issues/']
---

This guide presents troubleshooting strategies for Linodes that are unresponsive to any network access. One reason that a Linode may be unresponsive is if you recently performed a distribution upgrade or other broad software updates to your Linode, as those changes can lead to unexpected problems for your core system components.

Similarly, your server may be unresponsive after maintenance was applied by Linode to your server's host (frequently, this is correlated with software/distribution upgrades performed on your deployment prior to the host's maintenance). This guide is designed as a useful resource for either of these scenarios. If you need to troubleshoot memory and networking, read our guide on [Troubleshooting Memory and Networking Issues](/docs/guides/troubleshooting-memory-and-networking-issues/).

If you can [ping](/docs/tools-reference/linux-system-administration-basics/#the-ping-command) your Linode, but you cannot access SSH or other services, this guide will not assist with troubleshooting those services. Instead, refer to the [Troubleshooting SSH](/docs/guides/troubleshooting-ssh/) or [Troubleshooting Web Servers, Databases, and Other Services](/docs/guides/troubleshooting-web-servers-databases-other-services/) guides.

{{< disclosure-note "Where to go for help outside this guide" >}}
This guide explains how to use different troubleshooting commands on your Linode. These commands can produce diagnostic information and logs that may expose the root of your connection issues. For some specific examples of diagnostic information, this guide also explains the corresponding cause of the issue and presents solutions for it.

If the information and logs you gather do not match a solution outlined here, consider searching the [Linode Community Site](https://www.linode.com/community/questions/) for posts that match your system's symptoms. Or, post a new question in the Community Site and include your commands' output.

Linode is not responsible for the configuration or installation of software on your Linode. Refer to Linode's [Scope of Support](/docs/platform/billing-and-support/support/#scope-of-support) for a description of which issues Linode Support can help with.
{{< /disclosure-note >}}

## Before You Begin

There are a few core troubleshooting tools you should familiarize yourself with that are used when diagnosing connection problems.

### The Linode Shell (Lish)

[*Lish*](/docs/guides/using-the-lish-console/) is a shell that provides access to your Linode's serial console. Lish does not establish a network connection to your Linode, so you can use it when your networking is down or SSH is inaccessible. Much of your troubleshooting for basic connection issues will be performed from the Lish console.

To learn about Lish in more detail, and for instructions on how to connect to your Linode via Lish, review the [Using the Lish Console](/docs/guides/using-the-lish-console/) guide. In particular, [using your web browser](/docs/guides/using-the-lish-console/#through-the-cloud-manager-weblish) is a fast and simple way to access Lish.

### MTR

When your network traffic leaves your computer to your Linode, it travels through a series of routers that are administered by your internet service provider, by Linode's transit providers, and by the various organizations that form the [Internet's backbone](https://en.wikipedia.org/wiki/Internet_backbone). It is possible to analyze the route that your traffic takes for possible service interruptions using a tool called [MTR](/docs/guides/diagnosing-network-issues-with-mtr/).

MTR is similar to the [traceroute](/docs/tools-reference/linux-system-administration-basics/#the-traceroute-command) tool, in that it will trace and display your traffic's route. MTR also runs several iterations of its tracing algorithm, which means that it can report statistics like average packet loss and latency over the period that the MTR test runs.

Review the installation instructions in Linode's [Diagnosing Network Issues with MTR](/docs/guides/diagnosing-network-issues-with-mtr/#install-mtr) guide and install MTR on your computer.

## Is your Linode Running?

Log in to the [Linode Manager](https://cloud.linode.com/) and inspect the Linode's dashboard. If the Linode is powered off, turn it on.

### Inspect the Lish Console

If the Linode is listed as running in the Manager, or after you boot it from the Manager, open the Lish console and look for a login prompt. If a login prompt exists, try logging in with your root user credentials (or any other Linux user credentials that you previously created on the server).

{{< note >}}
The root user is available in Lish even if root user login is disabled in your SSH configuration.
{{< /note >}}

1.  If you can log in at the Lish console, move on to the [diagnose network connection issues](#diagnose-network-connection-issues) section of this guide.

    If you see a log in prompt, but you have forgotten the credentials for your Linode, follow the instructions for [resetting your root password](/docs/guides/reset-the-root-password-on-your-linode/) and then attempt to log in at the Lish console again.

2. If you do not see a login prompt, your Linode may have [issues with booting](#troubleshoot-booting-issues).

## Troubleshoot Booting Issues

If your Linode isn't booting normally, you will not be able to rely on the Lish console to troubleshoot your deployment directly. To continue, you will first need to reboot your Linode into [Rescue Mode](/docs/troubleshooting/rescue-and-rebuild/#rescuing), which is a special recovery environment that Linode provides.

When you boot into Rescue Mode, you are booting your Linode into the [Finnix recovery Linux distribution](https://www.finnix.org). This Finnix image includes a working network configuration, and you will be able to mount your Linode's disks from this environment, which means that you will be able to access your files.

1.  Review the Rescue and Rebuild guide for instructions and [boot into Rescue Mode](/docs/troubleshooting/rescue-and-rebuild/#booting-into-rescue-mode). If your Linode does not reboot into Rescue Mode successfully, please [contact Linode Support](/docs/platform/billing-and-support/support/#contacting-linode-support).

1.  Connect to Rescue Mode via the Lish console as you would normally. You will not be required to enter a username or password to start using the Lish console while in Rescue Mode.

### Perform a File System Check

If your Linode can't boot, then it may have experienced filesystem corruption.

1.  Review the Rescue and Rebuild guide for instructions on [running a filesystem check](/docs/troubleshooting/rescue-and-rebuild/#performing-a-file-system-check).

    {{< caution >}}
Never run a filesystem check on a disk that is mounted.
{{< /caution >}}

1.  If your filesystem check reports errors that cannot be fixed, you may need to [rebuild your Linode](/docs/troubleshooting/rescue-and-rebuild/#rebuilding).

1.  If the filesystem check reports errors that it has fixed, try rebooting your Linode under your normal [configuration profile](/docs/guides/linode-configuration-profiles/#booting-from-a-configuration-profile). After you reboot, you may find that your connection issues are resolved. If you still cannot connect as normal, restart the troubleshooting process from the [beginning of this guide](#is-your-linode-running).

1.  If the filesystem check does not report any errors, there may be another reason for your booting issues. Continue to [inspecting your system and kernel logs](#inspect-system-and-kernel-logs).

### Inspect System and Kernel Logs

In addition to being able to mount your Linode's disks, you can also *change root* (sometimes abbreviated as *chroot*) within Rescue Mode. *Chrooting* will make Rescue Mode's working environment emulate your normal Linux distribution. This means your files and logs will appear where you normally expect them, and you will be able to work with tools like your standard package manager and other system utilities.

To proceed, review the Rescue and Rebuild guide's instructions on [changing root](/docs/troubleshooting/rescue-and-rebuild/#change-root). Once you have chrooted, you can then investigate your Linode's logs for messages that may describe the cause of your booting issues.

In systemd Linux distributions (like Debian 8+, Ubuntu 16.04+, CentOS 7+, and recent releases of Arch), you can run the [`journalctl` command](/docs/guides/how-to-use-journalctl/) to view system and kernel logs. In these and other distributions, you may also find system log messages in the following files:

-   `/var/log/messages`

-   `/var/log/syslog`

-   `/var/log/kern.log`

-   `/var/log/dmesg`

You can use the [`less` command](/docs/guides/how-to-use-less/) to review the contents of these files (e.g. `less /var/log/syslog`). Try pasting your log messages into a search engine or searching in the [Linode Community Site](https://www.linode.com/community/questions/) to see if anyone else has run into similar issues. If you don't find any results, you can try asking about your issues in a new post on the Linode Community Site. If it becomes difficult to find a solution, you may need to [rebuild your Linode](/docs/troubleshooting/rescue-and-rebuild/#rebuilding).

### Quick Tip for Ubuntu and Debian Systems

After you have chrooted inside Rescue Mode, the following command may help with issues related to your package manager's configuration:

    dpkg --configure -a

After running this command, try rebooting your Linode into your normal configuration profile. If your issues persist, you may need to investigate and research your system logs further, or consider [rebuilding your Linode](/docs/troubleshooting/rescue-and-rebuild/#rebuilding).

## Diagnose Network Connection Issues

If you can boot your Linode normally and access the Lish console, you can continue investigating network issues. Networking issues may have two causes:

-   There may be a network routing problem between you and your Linode, or:

-   If the traffic is properly routed, your Linode's network configuration may be malfunctioning.

### Check for Network Route Problems

To diagnose routing problems, run and analyze an MTR report from your computer to your Linode. For instructions on how to use MTR, review Linode's [MTR guide](/docs/guides/diagnosing-network-issues-with-mtr/#analyze-mtr-reports). It is useful to run your MTR report for 100 cycles in order to get a good sample size (note that running a report with this many cycles will take more time to complete). This recommended command includes other helpful options:

    mtr -rwbzc 100 -i 0.2 -rw 198.51.100.0 <Linode's IP address>

Once you have generated this report, compare it with the following example scenarios.

{{< note >}}
If you are located in China, and the output of your MTR report shows *high packet loss* or an *improperly configured router*, then your IP address may have been blacklisted by the GFW (Great Firewall of China). Linode is not able to change your IP address if it has been blacklisted by the GFW. If you have this issue, review this [community post](https://www.linode.com/community/questions/17192/ssh-refused) for troubleshooting help.
{{< /note >}}

-   **High Packet Loss**

        root@localhost:~# mtr --report www.google.com
        HOST: localhost                   Loss%   Snt   Last   Avg  Best  Wrst StDev
        1. 63.247.74.43                   0.0%    10    0.3   0.6   0.3   1.2   0.3
        2. 63.247.64.157                  0.0%    10    0.4   1.0   0.4   6.1   1.8
        3. 209.51.130.213                60.0%    10    0.8   2.7   0.8  19.0   5.7
        4. aix.pr1.atl.google.com        60.0%    10    6.7   6.8   6.7   6.9   0.1
        5. 72.14.233.56                  50.0%   10    7.2   8.3   7.1  16.4   2.9
        6. 209.85.254.247                40.0%   10   39.1  39.4  39.1  39.7   0.2
        7. 64.233.174.46                 40.0%   10   39.6  40.4  39.4  46.9   2.3
        8. gw-in-f147.1e100.net          40.0%   10   39.6  40.5  39.5  46.7   2.2

    This example report shows high persistent packet loss starting mid-way through the route at hop 3, which indicates an issue with the router at hop 3. If your report looks like this, [open a support ticket with your MTR results](#open-a-support-ticket-with-your-mtr-results) for further troubleshooting assistance.

    {{< note >}}
If your route only shows packet loss at certain routers, and not through to the end of the route, then it is likely that those routers are purposefully limiting [ICMP](https://en.wikipedia.org/wiki/Internet_Control_Message_Protocol) responses. This is generally not a problem for your connection. Linode's MTR guide provides more context for [packet loss issues](/docs/guides/diagnosing-network-issues-with-mtr/#verify-packet-loss).
{{< /note >}}

    If your report resembles the example, [open a support ticket with your MTR results](#open-a-support-ticket-with-your-mtr-results) for further troubleshooting assistance. Also, consult Linode's MTR guide for more context on [packet loss issues](/docs/guides/diagnosing-network-issues-with-mtr/#verify-packet-loss).

-  **Improperly Configured Router**

        root@localhost:~# mtr --report www.google.com
        HOST: localhost                   Loss%   Snt   Last   Avg  Best  Wrst StDev
        1. 63.247.74.43                  0.0%    10    0.3   0.6   0.3   1.2   0.3
        2. 63.247.64.157                 0.0%    10    0.4   1.0   0.4   6.1   1.8
        3. 209.51.130.213                0.0%    10    0.8   2.7   0.8  19.0   5.7
        4. aix.pr1.atl.google.com        0.0%    10    6.7   6.8   6.7   6.9   0.1
        5. ???                           0.0%    10    0.0   0.0   0.0   0.0   0.0
        6. ???                           0.0%    10    0.0   0.0   0.0   0.0   0.0
        7. ???                           0.0%    10    0.0   0.0   0.0   0.0   0.0
        8. ???                           0.0%    10    0.0   0.0   0.0   0.0   0.0
        9. ???                           0.0%    10    0.0   0.0   0.0   0.0   0.0
        10. ???                           0.0%    10    0.0   0.0   0.0   0.0   0.0

    If your report shows question marks instead of the hostnames (or IP addresses) of the routers, and if these question marks persist to the end of the route, then the report indicates an improperly configured router. If your report looks like this, [open a support ticket with your MTR results](#open-a-support-ticket-with-your-mtr-results) for further troubleshooting assistance.

    {{< note >}}
If your route only shows question marks for certain routers, and not through to the end of the route, then it is likely that those routers are purposefully blocking [ICMP](https://en.wikipedia.org/wiki/Internet_Control_Message_Protocol) responses. This is generally not a problem for your connection. Linode's MTR guide provides more information about [router configuration issues](/docs/guides/diagnosing-network-issues-with-mtr/#an-isp-router-is-not-configured-properly).
{{< /note >}}

-  **Destination Host Networking Improperly Configured**

        root@localhost:~# mtr --report www.google.com
        HOST: localhost                   Loss%   Snt   Last   Avg  Best  Wrst StDev
        1. 63.247.74.43                  0.0%    10    0.3   0.6   0.3   1.2   0.3
        2. 63.247.64.157                 0.0%    10    0.4   1.0   0.4   6.1   1.8
        3. 209.51.130.213                0.0%    10    0.8   2.7   0.8  19.0   5.7
        4. aix.pr1.atl.google.com        0.0%    10    6.7   6.8   6.7   6.9   0.1
        5. 72.14.233.56                  0.0%    10    7.2   8.3   7.1  16.4   2.9
        6. 209.85.254.247                0.0%    10   39.1  39.4  39.1  39.7   0.2
        7. 64.233.174.46                 0.0%    10   39.6  40.4  39.4  46.9   2.3
        8. gw-in-f147.1e100.net         100.0    10    0.0   0.0   0.0   0.0   0.0

    If your report shows no packet loss or low packet loss (or non-persistent packet loss isolated to certain routers) until the end of the route, and 100% loss at your Linode, then the report indicates that your Linode's network interface is not configured correctly. If your report looks like this, move down to [confirming network configuration issues from Rescue Mode](#confirm-network-configuration-issues-from-rescue-mode).

{{< note >}}
If your report does not look like any of the previous examples, read through the [MTR guide](/docs/guides/diagnosing-network-issues-with-mtr/) for other potential scenarios.
{{< /note >}}

### Confirm Network Configuration Issues from Rescue Mode

If your MTR indicates a configuration issue within your Linode, you can confirm the problem by using Rescue Mode:

1.  Reboot your Linode into [Rescue Mode](/docs/troubleshooting/rescue-and-rebuild/#booting-into-rescue-mode).

1.  Run another MTR report from your computer to your Linode's IP address.

1.  As noted earlier, Rescue Mode boots with a working network configuration. If your new MTR report does not show the same packet loss that it did before, this result confirms that your deployment's network configuration needs to be fixed. Continue to [troubleshooting network configuration issues](#troubleshoot-network-configuration-issues).

1.  If your new MTR report still shows the same packet loss at your Linode, this result indicates issues outside of your configuration. [Open a support ticket with your MTR results](#open-a-support-ticket-with-your-mtr-results) for further troubleshooting assistance.

### Open a Support Ticket with your MTR Results

Before opening a support ticket, you should also generate a *reverse MTR* report. The MTR tool is run from your Linode and targets your machine's IP address on your local network, whether you're on your home LAN, for example, or public WiFi. To run an MTR from your Linode, log in to your Lish console. To find your local IP, visit a website like https://www.whatismyip.com/.

Once you have generated your original MTR and your reverse MTR, [open a Linode support ticket](/docs/platform/billing-and-support/support/#contacting-linode-support), and include your reports and a description of the troubleshooting you've performed so far. Linode Support will try to help further diagnose the routing issue.

## Troubleshoot Network Configuration Issues

If you have determined that your network configuration is the cause of the problem, review the following troubleshooting suggestions. If you make any changes in an attempt to fix the issue, you can test those changes with these steps:

1.  Run another MTR report (or [ping](/docs/troubleshooting/troubleshooting/#can-you-ping-the-linode) the Linode) from your computer to your Linode's IP.

1.  If the report shows no packet loss but you still can't access SSH or other services, this result indicates that your network connection is up again, but the other services are still down. Move onto [troubleshooting SSH](#troubleshoot-ssh) or [troubleshooting other services](#troubleshoot-other-services).

1.  If the report still shows the same packet loss, review the remaining troubleshooting suggestions in this section.

If the recommendations in this section do not resolve your issue, try pasting your [diagnostic commands' output](#run-diagnostic-commands) into a search engine or searching for your output in the [Linode Community Site](https://www.linode.com/community/questions/) to see if anyone else has run into similar issues. If you don't find any results, you can try asking about your issues in a new post on the Linode Community Site. If it becomes difficult to find a solution, you may need to [rebuild your Linode](/docs/troubleshooting/rescue-and-rebuild/#rebuilding).

### Try Enabling Network Helper

A quick fix may be to enable Linode's [Network Helper](/docs/guides/network-helper/) tool. Network Helper will attempt to generate the appropriate static networking configuration for your Linux distribution. After you enable Network Helper, reboot your Linode for the changes to take effect. If Network Helper was already enabled, continue to the remaining troubleshooting suggestions in this section.

### Did You Upgrade to Ubuntu 18.04+ From an Earlier Version?

If you performed an inline upgrade from an earlier version of Ubuntu to Ubuntu 18.04+, you may need to enable the `systemd-networkd` service:

    sudo systemctl enable systemd-networkd

Afterwards, reboot your Linode.

### Run Diagnostic Commands

To collect more information about your network configuration, collect output from the diagnostic commands appropriate for your distribution:

{{< disclosure-note "Network diagnostic commands" >}}
-   **Debian 7, Ubuntu 14.04**

        sudo service network status
        cat /etc/network/interfaces
        ip a
        ip r
        sudo ifdown eth0 && sudo ifup eth0

-   **Debian 8 and 9, Ubuntu 16.04**

        sudo systemctl status networking.service -l
        sudo journalctl -u networking --no-pager | tail -20
        cat /etc/network/interfaces
        ip a
        ip r
        sudo ifdown eth0 && sudo ifup eth0

-   **Ubuntu 18.04**

        sudo networkctl status
        sudo systemctl status systemd-networkd -l
        sudo journalctl -u systemd-networkd --no-pager | tail -20
        cat /etc/systemd/network/05-eth0.network
        ip a
        ip r
        sudo netplan apply

-   **Arch, CoreOS**

        sudo systemctl status systemd-networkd -l
        sudo journalctl -u systemd-networkd --no-pager | tail -20
        cat /etc/systemd/network/05-eth0.network
        ip a
        ip r

-   **CentOS 6**

        sudo service network status
        cat /etc/sysconfig/network-scripts/ifcfg-eth0
        ip a
        ip r
        sudo ifdown eth0 && sudo ifup eth0

-   **CentOS 7, Fedora**

        sudo systemctl status NetworkManager -l
        sudo journalctl -u NetworkManager --no-pager | tail -20
        sudo nmcli
        cat /etc/sysconfig/network-scripts/ifcfg-eth0
        ip a
        ip r
        sudo ifdown eth0 && sudo ifup eth0
{{< /disclosure-note >}}

### Inspect Error Messages

Your commands' output may show error messages, including generic errors like `Failed to start Raise network interfaces`. There may also be more specific errors that appear. Two common errors that can appear are related to Sendmail and iptables:

#### Sendmail

If you find a message similar to the following, it is likely that a broken Sendmail update is at fault:

{{< output >}}
/etc/network/if-up.d/sendmail: 44: .: Can't open /usr/share/sendmail/dynamic run-parts: /etc/network/if-up.d/sendmail exited with return code 2
{{< /output >}}

The Sendmail issue can usually be resolved by running the following command and restarting your Linode:

    sudo mv /etc/network/if-up.d/sendmail ~
    ifdown -a && ifup -a

{{< note >}}
Read more about the Sendmail bug [here](https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=873978).
{{< /note >}}

#### iptables

Malformed rules in your iptables ruleset can sometimes cause issues for your network scripts. An error similar to the following can appear in your logs if this is the case:

{{< output >}}
Apr 06 01:03:17 xlauncher ifup[6359]: run-parts: failed to exec /etc/network/if- Apr 06 01:03:17 xlauncher ifup[6359]: run-parts: /etc/network/if-up.d/iptables e
{{< /output >}}

Run the following command and restart your Linode to resolve this issue:

    sudo mv /etc/network/if-up.d/iptables ~

Please note that your firewall will be down at this point, so you will need to re-enable it manually. Review the [Control Network Traffic with iptables](/docs/guides/control-network-traffic-with-iptables/) guide for help with managing iptables.

### Was your Interface Renamed?

In your commands' output, you might notice that your `eth0` interface is missing and replaced with another name (for example, `ensp` or `ensp0`). This behavior can be caused by systemd's [Predictable Network Interface Names](https://www.freedesktop.org/wiki/Software/systemd/PredictableNetworkInterfaceNames/) feature.

1.  Disable the use of Predictable Network Interface Names with these commands:

        ln -s /dev/null /etc/systemd/network/99-default.link
        ln -s /dev/null /etc/udev/rules.d/80-net-setup-link.rules

1.  Reboot your Linode for the changes to take effect.

### Review Firewall Rules

If your interface is up but your networking is still down, your firewall (which is likely implemented by the `iptables` software) may be blocking all connections, including basic ping requests. To review your current firewall ruleset, run:

    sudo iptables -L # displays IPv4 rules
    sudo ip6tables -L # displays IPv6 rules

{{< note >}}
Your deployment may be running FirewallD or UFW, which are frontend software packages used to more easily manage your iptables rules. Run these commands to find out if you are running either package:

    sudo ufw status
    sudo firewall-cmd --state

Review [How to Configure a Firewall with UFW](/docs/security/firewalls/configure-firewall-with-ufw/#ufw-status) and [Introduction to FirewallD on CentOS](/docs/security/firewalls/introduction-to-firewalld-on-centos/#firewall-zones) to learn how to manage and inspect your firewall rules with those packages.
{{< /note >}}

Firewall rulesets can vary widely. Review our [Control Network Traffic with iptables](/docs/guides/control-network-traffic-with-iptables/) guide to analyze your rules and determine if they are blocking connections.

### Disable Firewall Rules

In addition to analyzing your firewall ruleset, you can also temporarily disable your firewall to test if it is interfering with your connections. Leaving your firewall disabled increases your security risk, so we recommend re-enabling it afterwards with a modified ruleset that will accept your connections. Review [Control Network Traffic with iptables](/docs/guides/control-network-traffic-with-iptables/) for help with this subject.

1.  Create a temporary backup of your current iptables:

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

1.  Repeat these steps with the `ip6tables` command to flush your IPv6 rules. Be sure to assign a different name to the IPv6 rules file. (e.g. `~/ip6tables.txt`).

## Next Steps

If you are able to restore basic networking, but you still can't access SSH or other services, refer to the [Troubleshooting SSH](/docs/guides/troubleshooting-ssh/) or [Troubleshooting Web Servers, Databases, and Other Services](/docs/guides/troubleshooting-web-servers-databases-other-services/) guides.

If your connection issues were the result of maintenance performed by Linode, review the [Reboot Survival Guide](/docs/guides/reboot-survival-guide/) for methods to prepare a Linode for any future maintenance.
