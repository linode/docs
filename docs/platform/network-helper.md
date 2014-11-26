---
deprecated: false
author:
  name: Alex Fornuto
  email: docs@linode.com
description: 'Information on the Network Helper option.'
keywords: 'network, networking, network helper, ip, ip address, static ip,'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Wednesday, November 26, 2014
modified_by:
  name: Alex Fornuto
published: ''
title: Network Helper
---

Linode's Network Helper is a tool, implemented in a Linode configuration profile, which automatically configures static networking on your Linode at boot. Network Helper is currently in beta, and available to anyone who would like to try it. Network Helper works will all current Linux distributions available for deployment.

## What Does It Do?

On enabled profiles, the Network Helper works during boot or reboot jobs, while your Linode is starting up. It detects which distribution is booting, and modifies the appropriate configuration files to assign the IP address statically. The files modified depend on the distribution, but in all cases Network Helper modified `/etc/resolv.conf` to include the `options rotate` directive. If you'd like to know what files it modifies specifically, scroll down to your preferred distribution.

###Debian & Ubuntu

Network helper configures `/etc/network/interfaces`.

### CentOS & Fedora

Network Helper configures `/etc/sysconfig/network-scripts/ifcfg-eth0`.

### Arch

Network Helper configures `/etc/systemd/network/05-eth0.network`.

### Gentoo

Network Helper configures `/etc/conf.d/net`.

### OpenSUSE

Network Helper configures `/etc/sysconfig/network/ifcfg-eth0' and '/etc/sysconfig/network/routes`.

###Slackware

Network Helper configures `/etc/rc.d/rc.inet1.conf`.

##Turn Network Helper On for all New Configuration Profiles

Once Network Helper moves out of beta it will be enabled on all new configuration profiles by default. In order to turn this behavior on, follow the steps below. 

1.  From the Linode Manager, click on the **Account** tab:

    ![The Account tab in the Linode Manager](/docs/assets/account-tab.png)

2.  Click on the **Account Settings** tab. Under The Network Helper section, Change the Default Behavior to **ON**:

    [![The Network Helper Default Behavior option](/docs/assets/account-settings_small.png)](/docs/assets/account-settings.png)

3. Click the **Save** button.


## Turn Network Helper On for Individual Configuration Profiles.

Even with Network Helper's default behavior set to **OFF**, you can enable Network Helper on specific configuration profiles. 

1.  Do to your Linode's Dashboard, and under Configuration Profiles click **Edit** for the profile you want to adjust:

    [![The Edit link for a Configuration Profile](/docs/assets/linode-dashboard-hilighted_small.png)](/docs/assets/linode-dashboard-hilighted.png)

2.  Under the Filesystem/Boot Helpers section, change the **Auto-Configure Networking** option to Yes:

    
    [![The Auto-configure Networking option](/docs/assets/network-helper-hilighted_small.png)](/docs/assets/network-helper-hilighted.png)

3. Click on **Save Changes**.