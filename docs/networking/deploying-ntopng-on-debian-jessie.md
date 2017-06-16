---
author:
  name: Andrew Lescher
  email: docs@linode.com
description: 'ntopng is a powerful and lightweight network monitoring tool that can be used to monitor and analyze web traffic and packet flows on installed machines. It is accessed through a graphical interface which is hosted by a built-in web server. The real-time data collected is presented in visually appealing charts and graphs that provide meaningful drill down capabilities and can be exported in JSON format for further report building and analysis.'
keywords: 'ntopng, network, debian 8, debian jessie'
alias: ['/docs/networking']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Monday, June 12th, 2017'
modified: 'Monday, June 12th, 2017'
modified_by:
  name: ' ' 
title: 'Deploy NTOPNG On Debian 8'
contributor:
  name: Andrew Lescher
  link: https://www.linkedin.com/in/andrew-lescher-87027940/
external_resources: 
 - '[ntop MainWebsite](http://www.ntop.org/products/traffic-analysis/ntop/)'
 - '[ntop NetworkSecurity Guide](http://www.ntop.org/wp-content/uploads/2017/04/NetworkSecurityUsingntopng.pdf)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

----

## Overview of Ntopng, the Network Monitoring System

In this tutorial you will configure and install ntopng on your Linode. The tutorial will also cover configuration examples and suggestions for the web admin interface. You'll be able to:
	
-	Monitor and analyze traffic from your Linode.
-	Create Host Pools to group connected devices together based on your own criteria.
-	Have a general idea of how to work in the user interface and view statistics, as well as making your own configurations.
-	Monitor security threats on your machine.

### Before You Begin

1. Complete the [Getting Started](/docs/getting-started) guide for setting up a fresh Linode.
2. Secure your server by following the steps outlined in the [Securing Your Server](/docs/security/securing-you-server) guide.
3. This guide will use UFW (Uncomplicated Firewall) to set the firewall rules, you may use iptables instead. Instructions will be presented for both. If you aren’t familiar with UFW, follow the guide on [How to Configure a Firewall with UFW](/docs/security/firewalls/configure-firewall-with-ufw).
4. OpenVPN will be used as an example to demonstrate the capabilities of ntopng. You do not need to have it installed on your machine to complete this guide. However, if you are interested in learning more about OpenVPN, you can read through the [Setting up a Hardened OpenVPN Server on Debian 8]( /docs/networking/vpn/set-up-a-hardened-openvpn-server) guide.


{: .note}
> The steps in this guide require root privileges. Be sure to run the steps below as `root` or with `sudo`. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
>This guide assumes that the reader is logged in as root. If you will be using an elevated user account, you will need to prefix the commands with `sudo`


### Update the System and Install ntopng


Verify that your system is up to date. Install `ntopng` and supporting services. 

       
	apt update && apt upgrade -yuf
	apt install pfring nprobe ntopng ntopng-data n2disk
ethtool	ufw

### Add System User for ntopng

By default, ntopng is run as the user **nobody**. This is a good choice for daemons requiring minimal access to the system. However, ntopng installs files in directories that the user *nobody* may not have access to. Depending on how your system is configured. you can mitigate this by creating a new user for it. 

1.	Add user `ntopng`.

		useradd -r -s /bin/false ntopng

2. Set permissions for user `ntopng` and installation files/directories as shown.

		chown -R ntopng:ntopng /usr/share/ntopng /var/tmp/ntopng

		chmod 1770 -R /var/tmp/ntopng

		find /usr/share/ntopng -type d -print0 | xargs -0 chmod 744

		find /usr/share/ntopng -type f -print0 | xargs -0 chmod 755

## Configure ntopng

Ntopng has a built in web server and initializer. Configuration options can be set from the command line during intialization on a per-use basis, or defined in a config file. If you decide to use both the commandline and the config file, ntopng will prioritize the settings in the config file. 

1.	Disable TCP segmentation offload. Replace eth0 with your primary connection interface (usually eth0).

		ethtool -K eth0 gro off gso off tso off

2.	Check and verify TCP segmentation is disabled. 

		ethtool -k eth0

3.	In your subsequent output, verify this section matches the following:

		tcp-segmentation-offload: off
		tx-tcp-segmentation: off
		tx-tcp-ecn-segmentation: off
		tx-tcp-mangleid-segmentation: off
		tx-tcp6-segmentation: off

	
4. Navigate to `/etc/ntopng/ntopng.conf` and match the contents of your file to the example listed below. Replace [domain_or_ip] with your Linode’s domain or public IP address. Replace `eth0` with your primary network interface (if not eth0). If you want to review available configuration parameters, run `man ntopng` from the terminal.


{: .file }
**/etc/ntopng/ntopng.conf**
: ~~~ conf
-G=/var/run/ntopng.pid
--user=ntopng
--interface=eth0
-w = [domain_or_ip]:3005
--community
--daemon
--dump-flows=logstash # optional
--disable-autologout # optional
--disable-login=1 # optional
  ~~~

{: .note}
>
> The flags marked `optional` are **not mandatory.** All flags requiring input must be followed by a `=`, and a value. Replace `eth0` with your network interface below, if you are not using `eth0`.

##### Configuration File Breakdown


{:. table .table-striped .table-bordered }
|Flags       |  Features|
|:----------:|---------- :|
| -G    | Process ID file path. |
| --user | Designates the user `ntopng` will run under. Leaving this flag out of the configuration file will default to `nobody`  |
| --interface | The network interface ntopng will montior  |
| -w | Http address and port used to connect to the admin interface. Port 3005 is the default, you may define any.  |
| -W | ntopng will use the ports for SSL connections |
| --community | The license ntopng will run under. |
|--daemon | ntpong can be used as a forward service or as a background daemon. | 
|--dump-flows | logged traffic can be shared with other services | 
|--disable-autologout | Forces ntopng to allow users to remain logged into the web interface without being deactivated for inactvity.| 
| --disable-login | 1 to disable password authentication, 0 to require authentication | 

#### Open Ports For ntopng

1.	**For UFW:**

      ufw allow ports 3005:3006/tcp

2.	**For iptables:**

      iptables -A INPUT -p tcp --match multiport --dports 3005:3006 -j ACCEPT

### Introduction To The Web Interface

1.	From the terminal, initialize ntopng by typing `ntopng /etc/ntopng/ntopng.conf`. If your config file is in a different directory, adjust the command accordingly.

2.	Navigate to `[domain_or_ip:3005]`. If you enabled autologin, you’ll be routed to the *Welcome* page. If you did not enable autologin, enter `username:admin` and `password:admin` in the popup window. The system will then prompt you to set a new password.



### Create a Host Pool

If you want to group devices over the same network or host a home media server, you can use a Host Pool. This example uses OpenVPN, to group connected devices together. 


1.	In the **Interfaces** dropdown menu, select your main connection interface. In this case, it’s `eth0`. In the menu directly below the **ntop** logo, select the icon that resembles a group of 3 people. Now, select **Manage Pools**

2.	Click on the `+` icon on the far right of the screen. Give your pool a descriptive name and save. 

3.	Now click on the **Unassigned Devices** tab. This is a list of devices currently transmitting data through the Linode (you should at least see the computer you’re connecting from listed here). Determine which devices you’ll add to your pool and add them. Don’t forget to click on **Save Settings** when you’re finished. 

4.	To view data from your host pool, you’ll need to mouse over the **Hosts** dropdown and select **Host Pools**. You’ll find the pool name you created listed on this page. Click on it. Here, you’ll see all currently open connections from each of the hosts in your host pool. 

{: .note}
>
> If you want to see all the host connections on a single page, set the number of rows to display per page next to the filtering options above the table.

# Enable Security 

Ntopng provides a simple and convenient method for monitoring threats.



1.	Near the top of the web interface, scroll over *Settings* and select *Preferences*. Click on *Alerts* in the menu to the left. Click on *Enable Alerts* and choose which alerts you’d like to enable. On my instance, I have all alert types turned on and the default alert retention set. 

2.	Now scroll over the alert-looking icon with the exclamation point in the top menu bar. Click on *Alerts*. All network alerts will be recorded and displayed here. In my experience, this page fills up fast due to the fondness our fellow peers on the internet have for launching probing attacks. If you locked down all ports on your machine excluding those needed for connections, ntopng will log all attempts to bypass those ports. In addition, ntopng receives nightly updates to a blacklisted hosts file, which are supplied by spamhaus.org and dshield.org. Connections made to and from these blacklisted hosts will be blocked outright by ntopng. This is a very good method for counteracting malware and spam from infecting systems on your network.

{: .note}
>
>Ntopng does not replace core security features such as a properly configured firewall. It is best to run this in tandem with an existing internal setup.

### Next Steps

Now that you have some basic knowledge of how ntop is used and some idea of its capabilities, you may want to further explore configurations for your specific situation. You can find detailed information at the ntopng official website. The site also hosts a very thorough guide on using ntopng to enhance the security of your network. Both links are included below in the **More Information** section.





