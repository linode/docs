---
slug: troubleshooting-linode-longview
author:
  name: Linode
  email: docs@linode.com
description: "This guide describes the process of troubleshooting Longview"
og_description: "Learn how to troubleshoot Linode's Longview service."
keywords: ["system monitoring", "longview", "metrics", "troubleshooting"]
tags: ["resolving","cloud manager","statistics","monitoring","linode platform"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
  name: Linode
image: TroubleshootLinodeLongview.png
title: Troubleshooting Linode Longview
h1_title: Troubleshoot Linode Longview
published: 2020-01-22
aliases: ['/platform/longview/troubleshooting-linode-longview/']
---

This guide discusses basic troubleshooting steps to help you diagnose and resolve any issues you may encounter while using Longview. If you're experiencing problems with the Longview client, follow the steps outlined in this guide to help determine the cause.

## Basic Diagnostics

1.  Ensure that your system is [fully updated](/docs/getting-started/#install-software-updates).

    {{< note >}}
  Longview requires Perl 5.8 or later.
    {{</ note >}}

2.  Verify that the Longview client is running. Use the command that is appropriate for your distribution's initialization system:

    > **CentOS, Debian, and Ubuntu**
    >
    >     sudo systemctl status longview   # For distributions with systemd.

    >  **Other Distributions**
    >
    >     sudo service longview status     # For distributions without systemd.

    If the Longview client is not running, start it with the command appropriate for your distribution's initialization system:

    > **CentOS, Debian, and Ubuntu**
    >
    >     sudo systemctl start longview

    >  **Other Distributions**
    >
    >     sudo service longview start

    If the service fails to start, check Longview's log for errors. The log file is located in `/var/log/linode/longview.log`.

## Debug Mode

Restart the Longview client in debug mode for increased logging verbosity.

1.  First stop the Longview client:

    > **CentOS, Debian, and Ubuntu**
    >
    >     sudo systemctl stop longview   # For distributions with systemd.

    >  **Other Distributions**
    >
    >     sudo service longview stop     # For distributions without systemd.

2.  Then restart Longview with the `debug` flag:

        sudo /etc/init.d/longview debug

3.  When you're finished collecting information, repeat the first two steps to stop Longview and restart it again without the debug flag.

    If Longview does not close properly, find the process ID and kill the process:

        ps aux | grep longview
        sudo kill $PID

## Firewall Rules

If your Linode has a firewall, it must allow communication with Longview's aggregation host at `longview.linode.com` (IPv4: `96.126.119.66`). You can view your firewall rules with one of the commands below, depending on the firewall controller used by your Linux distribution:

  > **firewalld**
  >
  >     sudo firewall-cmd --list-all
  >
  >  {{< note >}}
Review our [Introduction to FirewallD on CentOS](/docs/security/firewalls/introduction-to-firewalld-on-centos/) guide for more help with FirewallD.
    {{< /note >}}

  >**iptables**
  >
  >     sudo iptables -S
  >
   {{< note >}}
Review our [Control Network Traffic with iptables](/docs/security/firewalls/control-network-traffic-with-iptables/) guide for more help with iptables.
    {{< /note >}}

>  **ufw**
>
>     sudo ufw show added
>
>    {{< note >}}
 Review our [How to Configure a Firewall with UFW](/docs/security/firewalls/configure-firewall-with-ufw/) guide for more help with UFW.
    {{< /note >}}

If the output of those commands show no rules for the Longview domain (or for `96.126.119.66`, which is the IP for the Longview domain), you must add them. A sample iptables rule that allows outbound HTTPS traffic to Longview would be the following:

    iptables -A OUTPUT -p tcp --dport 443 -d longview.linode.com -j ACCEPT

{{< note >}}
If you use iptables, you should also make sure to persist any of your firewall rule changes. Otherwise, your changes will not be enforced if your Linode is rebooted. Review the [iptables-persistent](/docs/security/firewalls/control-network-traffic-with-iptables/#introduction-to-iptables-persistent) section of our iptables guide for help with this.
{{< /note >}}

## Verify API key

The API key given in the Linode Cloud Manager should match that on your system in `/etc/linode/longview.key`.

1. In the Linode Cloud Manager, the API key is located in the **Installation** tab of your Longview Client instance's [detailed view](/docs/platform/longview/what-is-longview/#access-your-longview-client-s-detailed-view).

1.  SSH into your Linode. The Longview key is located at `/etc/linode/longview.key`. Use `cat` to view the contents of that file and compare it to what's shown in the Linode Cloud Manager:

        cat /etc/linode/longview.key

    The two should be the same. If they are not, paste the key from the Linode Cloud Manager into `longview.key`, overwriting anything already there.

## Cloned Keys

If you clone a Linode which has Longview installed, you may encounter the following error:

{{< output >}}
Multiple clients appear to be posting data with this API key. Please check your clients' configuration.
{{< /output >}}

This is caused by both Linodes posting data using the same Longview key. To resolve it:

1. Uninstall the Longview agent on the cloned system.

    > **CentOS**:
    >
    >     sudo yum remove linode-longview

    > **Debian or Ubuntu**:
    >
    >     sudo apt-get remove linode-longview

    > **Other Distributions**:
    >
    >     sudo rm -rf /opt/linode/longview

1. Add a new [Linode Longview Client instance](/docs/platform/longview/what-is-longview/#add-the-longview-client). This will create a new Longview API key independent from the system which it was cloned from.

    {{< note >}}
  The GUID provided in the Longview Client's installation URL is not the same as the Longview API key.
    {{</ note >}}

1. [Install the Longview Agent](/docs/platform/longview/what-is-longview/#install-the-longview-agent) on the cloned Linode.

## Contact Support

If you still need assistance after performing these checks, please open a [support ticket](/docs/platform/support/#contacting-linode-support).




