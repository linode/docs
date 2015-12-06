---
author:
    name: 'Sean Webber'
    email: 'swebber@yazzielabs.com'
description: 'Installing and configuring an Offsite Ubiquiti UniFi Controller on Ubuntu 14.04 LTS'
keywords: '14.04,LTS,Management,Networking,Ubiquiti,Ubuntu,UniFi'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'N/A'
modified: 'Saturday, December 6th, 2015'
title: 'Setting Up an Offsite Ubiquiti UniFi Controller on Ubuntu 14.04'
contributor:
    name: 'Sean Webber'
    link: 'https://github.com/seanthewebber'
---

## Introduction

The Ubiquiti UniFi Controller is a web-based management panel for Ubiquiti's line of UniFi-enabled networking devices. The product line currently includes IP surveillance cameras, managed routers, power switches, VoIP telephones, and wireless access points. The controller allows network administrators to administrator any number of these products using a single web panel.

Traditionally, the UniFi controller is installed on a Raspberry Pi or spare workstation located on the same network subnet as the UniFi devices it controls. It is also possible, however, to install the controller *outside* of the Local Area Network (LAN) in the public cloud.

In this tutorial, we will be doing just that: installing the UniFi Controller on a Linode server.

## Pros and Cons

Installing your UniFi Controller offsite can be good **or** bad depending upon your situation. Take a few moments to read over the Pros and Cons list below and decide whether the configuration outlined in this tutorial is right for you.

Pros:
- Data center reliability in terms of availability and uptime
- Painless hardware expansion (huge plus for rapidly growing organizations)
- Prevents an outage at one site taking down the controller for all sites
- VPN tunnels between multiple locations not necessary

Cons:
- Requires Enterprise-grade edge routers that support custom DHCP and DNS options
- When the internet is down, the controller becomes unreachable

## Prerequisites

- A 1GB, **dedicated** Linode server running Ubuntu 14.04. Dedicating an entire Linode to the UniFi Controller is important as it shares many common TCP ports used by other packages, which could otherwise lead to problems down the road. We recommend following our [Getting started](/docs/getting-started) guide if you need help setting up your Linode
- LAN-facing edge routers that support DHCP option parameters and DNS host overrides. Refer to your router vendor's documentation to determine whether your device(s) support this feature
- The latest version of the Java Runtime Environment, since the UniFi Controller is written in Java. Follow our [Installing Java](/docs/applications/java/installing-java-on-ubuntu-14-04) guide to start sipping on some ~~coffee~~ Java
- The `syslinux` package. If it is not installed on your Linode, execute the `sudo apt-get install syslinux` command to install it

## Downloading and Installing UniFi Controller

1. Get started by adding Ubiquiti's Debian (parent project of Ubuntu) software repository to your system.

        sudo add-apt-repository "deb http://www.ubnt.com/downloads/unifi/debian stable ubiquiti"

2. Add Ubiquiti's GNU Privacy Guard (GPG) key so that your system can verify their packages.

        sudo apt-key adv --keyserver keyserver.ubuntu.com --recv C0A52C50

3. Fetch a new available packages list (including those available from the Ubiquiti repository you just added).

        sudo apt-get update

4. Install the UniFi Controller.

        sudo apt-get install unifi

5. Verify that your installation has completed by navigating to `https://45.79.138.150:8443` using your favorite web browser.

{: .caution}
>
> Make **sure** to replace `45.79.138.150` with the Fully Qualified Domain Name (FQDN) or IP address of your Linode.

UniFi uses a self-signed SSL certificate by default, which will trigger a **your connection is not private** warning in your web browser. Disregard the warning message, accept the "unsecure" connection, and proceed.

[![UniFi Controller Setup Wizard](/docs/assets/unifi-controller-setup-wizard_small.png)](/docs/assets/unifi-controller-setup-wizard.png)

If you see a **UniFi Setup Wizard** similar to the one shown above, you have a working installation. Proceed to the next section!

## Configuring Layer 3 Routing on the LAN Side

Normally, UniFi devices utilize multicast broadcasts to find UniFi Controllers within their LAN. This will not work for us as your Linode is located on the public internet, far away from your local network's broadcast packets.

To make up for this, we will use a DNS host override and DHCP option #43 to explicitly tell your devices the location of your controller.

### DNS Host Override

1. If you are unsure how to create a DNS host override on your routing devices, refer to your vendor's documentation (or Google search) to find out how. This feature is also called **DNS Sticky** or a **glue record** depending upon the device firmware and manufacturer.

2. Create a DNS host override so that the hostname `unifi` *resolves* (forwards to) the FQDN or IP address of your Linode. In pfSense, this option can be found under the **Services >> DNS Resolver** menu in the **Host Overrides** section. Make sure to apply your changes.

![Adding a DNS Host Override in pfSense](/docs/assets/unifi-controller-adding-dns-host-override-in-pfsense.png)

{: .note}
>
> `unifi`**.lan** is the LAN's domain name ending. pfSense requires that local hostnames be formatted this way; again, this may vary from vendor-to-vendor.

3. Verify that your DNS host override has taken effect by navigating to `https://unifi:8443` in your favorite web browser. If you see the same **UniFi Setup Wizard** you saw earlier, you can move onto the next step.

If not, flush your DNS cache, and reboot your routers and workstation. Still no dice? Double check your configuration options and check for typos.

{: .caution}
>
> If any outbound ports are blacklisted or blocked by your firewall, make sure ports 3478, 8080, 8081, 8443, and 8843 to your Linode are whitelisted and accessible. Any of those ports being blocked will render your controller unreachable.

### DHCP Option #43

1. If you are unsure how to create a DHCP option parameter on your routing devices, refer to your vendor's documentation (or again, Google) to find out how. This feature is also called **BOOTP options** depending upon the device firmware and manufacturer.

2. Convert your Linode's IP address into hexadecimal format and prefix "0104" in front of the hexadecimal.

        printf '0104'; gethostip `45.79.138.150` -x

Output example:

        `01042D4F8A96`

{: .note}
>
> **0104** is Ubiquiti's *vendor identifier*. This serves as a sort of "limiter" for clients connecting to your DHCP server. Only Ubiquiti hardware will obey by this DHCP option you are about to create; all other clients will ignore it.

3. Create a new DHCP (or BOOTP) option, making sure to apply your changes:
- **Number:** 43
- **Type:** String
- **Value:** `01:04:2D:4F:8A:96` (replace with **your** hexadecimal from step two)

In pfSense, this option can be found under the **Services > DHCP Server** menu in the **Additional BOOTP/DHCP Options** section.

[![UniFi Controller Setup Wizard](/docs/assets/unifi-controller-adding-dhcp-option-43-record-in-pfsense_small.png)](/docs/assets/unifi-controller-adding-dhcp-option-43-record-in-pfsense.png)

{: .note}
>
> Hexadecimals can be written with or without colons every two characters. It's purely a cosmetic decision.

4.

## Setting Up UniFi Controller

### Plug in your UniFi devices

1. If you have not done so already, power up your devices and connect them to your LAN. Grab a beverage and take a few sips of it while they go through their boot processes.

### Completing the UniFi Setup Wizard

1. If you already closed it, navigate back to `https://unifi:8443`, select your country and time zone, and click the green **NEXT** button.

2. Discover unconfigured UniFi devices on your network.

[![UniFi Controller Setup Wizard](/docs/assets/unifi-controller-enrolling-devices_small.png)](/docs/assets/unifi-controller-enrolling-devices.png)

Check the checkbox to the left of a device's Media Access Control (MAC) address to *enroll* (add) it to the controller. Press **NEXT** to confirm enrollment and move onto the next step; press the same button to proceed through the next few steps.

If you do not see your devices in the Discovery plane although they are plugged in and connected, trace your steps through the **DHCP Option #43** section of this tutorial. That is *most likely* where the mistake or typo causing the issue lies.

3. Specify the Service Set Identifier (SSID) and password of your new wireless network, if you choose to use one.

{: .note}
>
> A wireless network's SSID it the human-readable name we see when connecting to it. This is NOT the administrative login for your UniFi Controller.

4. Set the username and password of your first administrative account. You will use these credentials to log into your UniFi Controller and make configuration changes to it.

The default username and password for some installations is **ubnt**/**ubnt**. Do not use these credentials; choose unique ones so your UniFi Controller stays secure.

5. The UniFi Setup Wizard will show you the SSID and administrative username you entered. Click on the green **FINISH** button to confirm and complete the setup process.

### Updating the Controller Settings

[![UniFi Controller Setup Wizard](/docs/assets/unifi-controller-dashboard_small.png)](/docs/assets/unifi-controller-dashboard.png)

Once you log in and reach the dashboard, click on the gear labelled **Settings** in the lower-left corner of your browser window. Double check your controller settings, paying special attention to the options listed below:
- **Site > Site Configuration:** country, deployment/site name, and time zone
- **Site > Services:** unless you have a special reason not to, click the checkboxes next to **Automatically upgrade AP firmware** and **Automatically upgrade phone firmware** so your devices are always up-to-date
- **Admins:** create an administrative account for those who need one
- **Controller > Controller Settings:** make sure that the **Controller Hostname/IP** matches the FQDN of your Linode
- **Maintenance > Services:** used to make configuration backups... take note!

## Conclusion

Now that your UniFi Controller is running on a Linode in the cloud, [learn more about the UniFi platform](https://www.ubnt.com/enterprise/software/) and the [variety of devices that use it](https://www.ubnt.com/products/#enterprise).
