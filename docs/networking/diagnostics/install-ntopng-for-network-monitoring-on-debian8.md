---
author:
  name: Andrew Lescher
  email: docs@linode.com
description: 'This Linode tutorial guides you through deploying ntopng, a powerful, lightweight network tool that monitors and analyzes web traffic and packet flows, on Debian 8.'
keywords: ["ntopng", "network monitor", "debian 8", "debian jessie"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-06-28
aliases: ['networking/diagnostics/deploy-ntopng-on-debian-8/']
modified: 2017-09-13
modified_by:
  name: Andrew Lescher
title: 'Install ntopng for Network Monitoring on Debian 8'
contributor:
  name: Andrew Lescher
  link: https://www.linkedin.com/in/andrew-lescher-87027940/
external_resources:
 - '[ntop Main Website](http://www.ntop.org/products/traffic-analysis/ntop/)'
 - '[ntop Network Security Guide](http://www.ntop.org/wp-content/uploads/2017/04/NetworkSecurityUsingntopng.pdf/)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

---

![Deploy network monitoring tool, ntopng, on Debian 8](/docs/assets/ntopng/ntopng-on-debian8.png "Deploy network monitoring tool, ntopng, on Debian 8")

## Overview of ntopng, the Network Monitoring System

In this tutorial you will configure and install ntopng on your Linode. The tutorial will also cover configuration examples and suggestions for the web administration interface. After you complete the tutorial and have the network monitor deployed, you'll be able to perform the following:

-	Monitor and analyze traffic from your Linode;
-	Create Host Pools to group connected devices together based on your own criteria;
-	Have a general idea of how to work in the user interface and view statistics, as well as make your own configurations;
-	Monitor security threats on your machine.

### Before You Begin

1. Complete the [Getting Started](/docs/getting-started) guide for setting up a fresh Linode.
2. Secure your server by following the steps outlined in the [Securing Your Server](/docs/security/securing-your-server) guide.
3. This guide will use UFW (Uncomplicated Firewall) to set the firewall rules, but you may use iptables instead. Instructions will be presented for both. If you aren’t familiar with UFW, follow the guide on [How to Configure a Firewall with UFW](/docs/security/firewalls/configure-firewall-with-ufw).
4. OpenVPN will be used as an example to demonstrate the capabilities of ntopng. You do not need to have it installed on your machine to complete this guide. However, if you are interested in learning more about OpenVPN, read the [Setting up a Hardened OpenVPN Server on Debian 8](/docs/networking/vpn/set-up-a-hardened-openvpn-server) guide.


{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with `sudo`. If two commands are presented in the same instance (seperated by `&&`), you must prefix each command with `sudo` (ex. `sudo [command] && sudo [command]`). For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

### Add the ntopng Repository

    wget http://apt-stable.ntop.org/jessie/all/apt-ntop-stable.deb
    dpkg -i apt-ntop-stable.deb
    apt-get clean all
    apt-get update

### Update the System and Install ntopng

Verify that your system is up to date. Install `ntopng` and supporting services:

    apt update && apt upgrade -yuf
    apt install pfring nprobe ntopng ntopng-data n2disk ethtool

### Add System User for ntopng

By default, ntopng is run as the user `nobody`. This is a good choice for daemons requiring minimal access to the system. However, ntopng installs files in directories to which the user `nobody` may not have access. Depending on how your system is configured, you can mitigate this by creating a new user for it:

1.  Add user `ntopng`:

		useradd -r -s /bin/false ntopng

2.  Set permissions for user `ntopng` and installation files/directories as shown:

		mkdir /var/tmp/ntopng
		chown -R ntopng:ntopng /usr/share/ntopng /var/tmp/ntopng
		chmod 1770 -R /var/tmp/ntopng
		find /usr/share/ntopng -type d -print0 | xargs -0 chmod 744
		find /usr/share/ntopng -type f -print0 | xargs -0 chmod 755

## Configure ntopng

Ntopng has a built in web server and initializer. Configuration options can be defined in a config file or set from the command line during initialization on a per-use basis. If you use both the command line and the config file, ntopng will prioritize the settings in the config file.

1.  Disable TCP segmentation offload. Replace `eth0` with your primary connection interface (usually `eth0`):

        ethtool -K eth0 gro off gso off tso off

2.  Check and verify that TCP segmentation is disabled:

        ethtool -k eth0

3.  Verify that the `tcp-segmentation-offload` section in the output matches the following:

        tcp-segmentation-offload: off
                tx-tcp-segmentation: off
                tx-tcp-ecn-segmentation: off
                tx-tcp-mangleid-segmentation: off
                tx-tcp6-segmentation: off

4.  Create `/etc/ntopng/ntopng.conf` and match the contents to the example listed below. Replace `192.0.2.0` with your Linode’s domain or public IP address. If needed, replace `eth0` with your primary network interface. If you want to review available configuration parameters, run `man ntopng` from the terminal.

    {{< file "**/etc/ntopng/ntopng.conf**" aconf >}}
--user=ntopng
--interface=eth0
-w=192.0.2.0:3005
--community
--daemon
--dump-flows=logstash # optional
--disable-autologout # optional
--disable-login=1 # optional

{{< /file >}}


    {{< note >}}
The option flags commented with `# optional` are **not mandatory.** All flags requiring input must be followed by an `=` and a value. Replace `eth0` with your network interface below, if you are not using `eth0`.
{{< /note >}}

##### Configuration File Breakdown

{:. table .table-striped .table-bordered }
|Flags       |  Features|
|:----------:|---------- :|
| --user | Designates the user `ntopng` will run under. Leaving this flag out of the configuration file will default to `nobody`.  |
| --interface | The network interface ntopng will monitor.  |
| -w | HTTP address and port used to connect to the admin interface. While port `3005` is the default, you may define any.  |
| --community | The license ntopng will run under. |
| --daemon | ntpong can be used as a forward service or as a background daemon. |
| --dump-flows | Logged traffic can be shared with other services |
| --disable-autologout | Forces ntopng to allow users to remain logged into the web interface without being deactivated for inactivity.|
| --disable-login | 1 to disable password authentication, 0 to require authentication. |

## Open Ports For ntopng

### For UFW

    ufw allow 3005:3006/tcp

### For iptables

    iptables -A INPUT -p tcp --match multiport --dports 3005:3006 -j ACCEPT

## Access ntopng's Web Interface

1.  From the terminal, initialize ntopng by typing `ntopng /etc/ntopng/ntopng.conf`. If your config file is in a different directory, adjust the command accordingly.

2.  Use a web browser to navigate to `192.0.2.0:3005`, replacing `192.0.2.0` with your domain or IP. If you enabled autologin, you’ll be routed to the *Welcome* page. If you did not enable autologin, enter `username:admin` and `password:admin` in the pop-up window. The system will then prompt you to set a new password.

## Create a Host Pool

If you want to group devices over the same network or host a home media server, you can use a host pool. This example uses OpenVPN to group connected devices together.

1.  In the **Interfaces** dropdown menu, select your main connection interface. In this case, it’s `eth0`. In the menu directly below the **ntop** logo, select the icon that resembles a group of 3 people. Select **Manage Pools**.

2.  Click on the `+` icon on the far right of the screen. Give your pool a descriptive name and save:

    ![Add a pool name to the managed pools](/docs/assets/ntopng/ntopng-add-pool.png "Add a pool name to the managed pools")

3.  Click on the **Unassigned Devices** tab. This is a list of devices currently transmitting data through the Linode (you should at least see the device you’re connecting from listed here). Determine which devices you’ll add to your pool and add them. Click **Save Settings** when you’re finished.

4.  To view data from your host pool, you’ll need to mouse over the **Hosts** dropdown and select **Host Pools**. You’ll find the pool name you created listed on this page. Click on it. Here, you’ll see all currently open connections from each of the hosts in your host pool:

    ![Currently open connections](/docs/assets/ntopng/ntopng-currently-open-connections.png "Currently open connections")

    {{< note >}}
If you want to see all the host connections on a single page, set the number of rows to display per page next to the filtering options above the table.
{{< /note >}}

## Enable Security

Ntopng provides a simple and convenient method for monitoring threats.

{{< caution >}}
Ntopng does not replace core security features such as a properly configured firewall. It is best to run this in tandem with an existing internal setup.
{{< /caution >}}

1.  Near the top of the web interface, scroll over **Settings** and select **Preferences**. Click on **Alerts** in the menu to the left. Click on **Enable Alerts** and choose which alerts you’d like to enable.

2.  Scroll over the alert icon with the exclamation point in the top menu bar. Click on **Alerts**. All network alerts are recorded and displayed here. This page fills up quickly due to internet traffic and bot probes. If you locked down all ports on your machine excluding those needed for connections, ntopng will log all attempts to bypass those ports.

In addition, ntopng receives nightly updates to a blacklisted hosts file, supplied by [spamhaus.org](https://spamhaus.org) and [dshield.org](https://dshield.org). Connections made to and from these blacklisted hosts will be blocked outright by ntopng. While this should not be considered a full security solution, this is a good start to counteract malware and spam from infecting systems on your network.

### Next Steps with ntopng

Now that you have some basic knowledge of how ntopng is used and some idea of its capabilities, you may want to further explore configurations for your specific situation. You can find detailed information at the official ntopng website. The site also hosts a thorough guide on using ntopng to enhance the security of your network. Both links are included below in the **More Information** section.
