---
author:
  name: Linode
  email: docs@linode.com
description: 'Troubleshooting steps to access your Linode after maintenance has been applied to your host.'
keywords: ['linux','reboot','lish']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-01-21
modified: 2019-01-21
modified_by:
  name: Linode
title: "Troubleshooting Basic Connectivity Issues"
---

EDITOR'S NOTE: This outline attempts to cover connection issues logically in ascending order: booting issues -> basic connectivity (routing or network interface issues) -> SSH -> other services (http, mysql, etc)

EDITOR'S NOTE: Some of these sections only include commands for systemd or Debian etc. Final version of this guide should optimally include commands for all recent-ish distros.

Sometimes through the course of updating or altering a Linode you might be unable to connect to your Linode through SSH or through other services you may run. The following are steps to regain access to your Linode should you lose access to those services.

{{< note >}}
Linode is not responsible for the configuration or installation of software on your Linode, etc. Could link to the newly edited Support guide for more information, or a link to the TOS.

Also say something like:
Various parts of this guide involve running diagnostic troubleshooting commands on your Linode, which can produce clues about the root of your connection issues. Several parts of this guide highlight frequent causes of connection issues and the diagnostic command output they correspond to. If the diagnostic information you've gathered does not match a solution presented here, consider searching the [Linode Community Site](link) for similar issues. Or, post a new question in the Community Site and include your commands' output.
{{< /note >}}

## Before You Begin

There are a few core troubleshooting tools you should familiarize yourself with that will be useful when diagnosing connection problems.

### Using the Linode Shell (Lish)

[*Lish*](/docs/platform/manager/using-the-linode-shell-lish/) is a shell that provides access to your Linode's serial console. Because Lish does not establish a network connection to your Linode, you can use it when networking is down or SSH isn't available. Lish is a valuable tool

Include instructions here for using Lish, either by linking to Lish guide or embedding them directly. Perhaps embed instructions for using the web console and link to the dedicated guide for terminal connections and other Lish usage.

{{< note >}}
Include note that all commands in this guide should be executed from Lish, unless SSH access is available, or otherwise specified by the guide (such as when running MTRs from your local computer).
{{< /note >}}

### Install MTR

MTR is a troubleshooting tool that can diagnose network routing issues that may exist between your computer and your Linode. Review Linode's MTR guide for instructions on [installing the tool](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/#install-mtr) on your computer.

## Is your Linode Running?

Login to the Linode Manager and inspect the Linode's dashboard. If the Linode is powered off, turn it on.

{{< note >}}
If the Linode is running and you can access SSH, but not other services, move down to the [troubleshooting other services](#troubleshoot-other-services) section.
{{< /note >}}

### Inspect the Lish Console

If the Linode is listed as running, open the Lish console and look for a login prompt. If a login prompt exists, try logging in with your root user credentials (or other Linux user credentials).

{{< note >}}
The root user is available in Lish even if root user login is disabled in your SSH configuration.
{{< /note >}}

If you can login at the Lish console, move on to [checking basic network connectivity](#check-basic-network-connectivity).

If you do not see a login prompt, your Linode may have [basic issues with booting](#troubleshoot-booting-issues).

## Troubleshoot Booting Issues

If your Linode isn't booting normally, you will not be able to rely on the Lish console as you would normally. To continue, you will need to reboot your Linode into *Rescue Mode*, which is a special recovery environment that Linode provides. Entering Rescue Mode will boot the Finnix recovery distribution, and you will be able to mount your normal Linux images from this environment.

Review the Rescue and Rebuild guide for instructions on [booting into Rescue Mode](/docs/troubleshooting/rescue-and-rebuild/#booting-into-rescue-mode). Then, connect to Rescue Mode via the Lish console as you would normally.

### Perform a File System Check

If your Linode can't boot, then it may have experienced filesystem corruption. Review the Rescue and Rebuild guide for instructions on [running a filesystem check](/docs/troubleshooting/rescue-and-rebuild/#performing-a-file-system-check).

{{< caution >}}
Never run a filesystem check on a disk that is mounted.
{{< /caution >}}

### Inspect System and Kernel Logs

Rescue Mode is capable of mounting your Linux image so that you can investigate further. Furthermore, you can also *change root* within Rescue Mode, which will make Rescue Mode working environment emulate your normal Linux image. This means your files and logs will appear where you normally expect them, and you will be able to work with tools like your standard package manager and other system utilities. To proceed, review the Rescue and Rebuild guide's instructions on [changing root](/docs/troubleshooting/rescue-and-rebuild/#change-root).

Include instructions for how to review system (e.g. `journalctl`) and kernel logs (`dmesg`) for various distros. Suggest that users search the Linode Community site for messages they find for further troubleshooting help.

| Distribution        | System Logs           | Kernel Logs  |
| ------------- |-------------| -----|
| CentOS 6      | Inspect `/var/log/messages` | Run `dmesg`
| CentOS 7+     | [Run `journalctl`](/docs/quick-answers/linux/how-to-use-journalctl/) | Run `dmesg` |
| Debian 8+ and Ubuntu 16.04+     | [Run `journalctl`](/docs/quick-answers/linux/how-to-use-journalctl/)      | Run `dmesg` |
| Arch | Insert commands and logs files here      | Whatever it is |

### Quick Tip for Ubuntu and Debian Systems

After you have changed root, the following command may help with issues related to your packages' configuration:

    dpkg --configure -a

After running this command, try rebooting your Linode into your normal configuration profile.

## Check Basic Network Connectivity

Networking issues can have two causes: your Linode may not be responding to network requests normally, or there may be a network routing issue between you and your Linode.

### Check for Network Route Issues

EDITOR'S NOTE: include example MTR output in disclosure-note blocks to illsutrate 100% packet loss at Linode vs. packet loss along route (might be harder to generate an example for that. Maybe take from a previous ticket where we ran a report against a Linode IP, potentially from the nlnog ring network?)

To diagnose routing problems, run and analyze an MTR report from your computer to your Linode. For instructions on how to use MTR, review Linode's [MTR guide](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/#analyze-mtr-reports).

If your report shows no packet loss along the route, but 100% packet loss at your Linode, that indicates an issue with your Linode's networking configuration. Move to the next section to continue troubleshooting.

If your report shows significant packet loss starting part-way through the route, there may be an issue between your internet service provider and Linode's upstream network peers. To confirm this issue, run another test originating from your Linode (by logging in with Lish and running the MTR command from the Linode) to your home computer's IP address. To find out what your local IP is, visit a website like https://www.whatismyip.com/.

Once you have finished generating these reports, open a Linode support ticket with the results. Linode Support will try to help further diagnose the routing issue.

{{< note >}}
If you are located in China, there is a chance that your IP has been blacklisted by the GFW (Great Firewall of China). Because this is a systemic issue, Linode is no longer in the process of swapping IP addresses for affected Linodes. You can point the reader to the instructions found here: https://www.linode.com/community/questions/17192/ssh-refused
{{< /note >}}

### Try Enabling Network Helper

If your Linode's networking is down, a quick fix may be to enable Linode's [Network Helper](/docs/platform/network-helper/) tool and then reboot. Network Helper will attempt to generate the appropriate static networking configuration for your Linux distribution.

-   If Network Helper was already enabled, continue to the next sections.
-   If you enable it and reboot, try running another MTR report (or [ping](/docs/troubleshooting/troubleshooting/#can-you-ping-the-linode) the Linode). If the report shows no packet loss, but you still can't access SSH or other services, this indicates that your networking is up again, but the other services are still down. Move onto [troubleshooting SSH](#troubleshoot-ssh) or [troubleshooting other services](#troubleshoot-other-services)
-   If networking is still down after enabling Network Helper, continue to the next sections.

### Run Standard Diagnostic Commands

Include instructions for running standard diagnostic commands on different distros, and include expected output. Example commands for Debian 8/9:

    cat /etc/network/interfaces
    systemctl status networking.service
    ip a
    ip r

### Errors from the networking Service

If the output from the status of your `networking` service shows an error like `Failed to start Raise network interfaces`, review your logs for further clues:

    sudo systemctl status networking.service -l
    sudo journalctl -u networking --no-pager | tail -20

#### Sendmail

If the output from your networking service logs show an error similar to the following, it is likely that a broken Sendmail update is at fault:

{{< output >}}
/etc/network/if-up.d/sendmail: 44: .: Can't open /usr/share/sendmail/dynamic run-parts: /etc/network/if-up.d/sendmail exited with return code 2
{{< /output >}}

The sendmail issue can usually be resolved by running the following two commands:

    sudo mv /etc/network/if-up.d/sendmail ~
    ifdown -a && ifup -a

You can read more about the SendMail bug at the following link: https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=873978

#### iptables

Malformed rules in your iptables ruleset can sometimes cause issues for your network scripts. An error similar to the following will generally appear in your logs:

{{< output >}}
Apr 06 01:03:17 xlauncher ifup[6359]: run-parts: failed to exec /etc/network/if- Apr 06 01:03:17 xlauncher ifup[6359]: run-parts: /etc/network/if-up.d/iptables e
{{< /output >}}

You can run the following commands to resolve this issue.

    sudo mv /etc/network/if-up.d/iptables ~
    ifdown -a && ifup -a

Please note that your firewall will be down at this point, so you will need to re-enable it manually.

### Was your Interface Renamed?

When viewing the output of the `interfaces` file, or the output from your `ip` commands, if you notice your interfaces have been renamed to something other than `eth0` (for example, `ensp`) this may be due to the latest version of systemd (226-1+ as of writing this guide). Specifically, [Predictable Network Interface Names](https://www.freedesktop.org/wiki/Software/systemd/PredictableNetworkInterfaceNames/) may be renaming your interfaces.

1.  Disable the use of Predictable Network Interface Names with these commands:

        ln -s /dev/null /etc/systemd/network/99-default.link
        ln -s /dev/null /etc/udev/rules.d/80-net-setup-link.rules

1.  Reboot your Linode for the changes to take effect.

### Privacy Extensions for IPv6

If you are only unable to connect via IPv6, then your Linode may be using an incorrect IPv6 address. Compare the global IPv6 address that appears in the output from your `ip a` command with the value shown in the [Remote Access tab](/docs/platform/manager/remote-access/) of your Linode's dashboard. If they don't match, then your distribution may be using privacy extensions to generate an incorrect address.

Include instructions for how to fix this (search kb for privacy extensions)

### Review Firewall Rules

If your interface is up but your networking is still down, your firewall may be blocking all connections, including basic ping requests.

Include instructions for inspecting and dumping firewall rules for iptables and ip6tables. Example commands and text:

    sudo iptables-save

If you are unable to determine if a specific rule is causing a problem, you can save your iptables to a backup and flush your rules:

    sudo iptables-save > /tmp/iptables.txt
    sudo iptables -P INPUT ACCEPT
    sudo iptables -P FORWARD ACCEPT
    sudo iptables -P OUTPUT ACCEPT
    sudo iptables -t nat -F
    sudo iptables -t mangle -F
    sudo iptables -F
    sudo iptables -X

Guide: https://www.linode.com/docs/security/firewalls/control-network-traffic-with-iptables/

Include links to troubleshooting firewalld and other firewall utilities.