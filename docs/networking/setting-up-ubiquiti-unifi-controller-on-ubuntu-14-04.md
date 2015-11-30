---
author:
    name: 'Sean Webber'
    email: 'swebber@yazzielabs.com'
description: 'Installing and configuring Ubiquiti UniFi Controller on Ubuntu 14.04 LTS'
keywords: '14.04,LTS,Ubuntu'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'N/A'
modified: 'Sunday, November 30th, 2015'
title: 'Setting Up Ubiquiti UniFi Controller on Ubuntu 14.04'
contributor:
    name: 'Sean Webber'
    link: 'https://github.com/seanthewebber'
---

## Introduction

The Ubiquiti UniFi Controller is a web-based management panel for Ubiquiti's line of UniFi-enabled networking devices. The UniFi product line currently includes IP surveillance cameras, managed routers, power switches, VoIP telephones, and wireless access points. The controller allows network administrators to administrator any number of these products using a single web panel.

Traditionally, the UniFi controller is installed on a Raspberry Pi or spare workstation located on the same network subnet as the UniFi devices it controls. It is also possible, however, to install the controller *outside* of the Local Area Network (LAN) in the public cloud.

In this tutorial, we will be doing just that: installing the UniFi Controller on a Linode server.

## Pros and Cons

Installing your UniFi Controller offsite can be good **or** bad depending upon your situation. Take a few moments to read over the Pros and Cons list below and decide which option will better serve you.

Pros:
- Datacenter reliability in terms of availability and uptime
- Painless hardware expansion (huge plus for rapidly growing organizations)
- Prevents an outage at one site taking down the controller for all sites
- VPN tunnels between multiple locations not necessary

Cons:
- Requires Enterprise-grade edge routers to handle custom DNS resolution
- When the internet is down, so is the UniFi Controller

## Prerequisites

- A 1GB, **deticated** Linode server running Ubuntu 14.04. Dedicating an entire Linode to the UniFi Controller is important as it uses many common TCP ports used by other packages, which could otherwise lead to problems down the road. We recommend following our [Getting started](/docs/getting-started) guide if you need help setting up your Linode
- LAN-facing edge routers that support custom DNS resolution. Specifically, over the network layer (layer three) of the Open Systems Interconnection (OSI) model. Refer to your router vendor's documentation to determine whether your device(s) support this feature
- The latest version of the Java Runtime Environment, since the UniFi Controller is written in Java. Follow our [Installing Java](/docs/applications/java/installing-java-on-ubuntu-14-04) guide to start sipping on some ~~coffee~~ Java

## Downloading and Installing UniFi Controller

1. Get started by adding Ubiquiti's Debian (parent project of Ubuntu) software repository to your system.

        sudo add-apt-repository "deb http://www.ubnt.com/downloads/unifi/debian stable ubiquiti"

2. Add Ubiquiti's GNU Privacy Guard (GPG) key to your system so that your system can verify their packages.

        sudo apt-key adv --keyserver keyserver.ubuntu.com --recv C0A52C50

3. Fetch a new available packages list (including those available from the Ubiquiti repository you just added).

        sudo apt-get update

4. Install the UniFi Controller.

        sudo apt-get install unifi

5. Verify that your installation has completed by navigating to `https://example.com:8443` using your favorite web browser.

{: .caution}
>
> Make **sure** to replace `example.com` with the Fully Qualified Domain Name (FQDN) or IP address of your Linode.

UniFi uses a self-signed SSL certificate by default, which will trigger a **your connection is not private** warning in your web browser. Disregard the warning message, accept the "unsecure" connection, and proceed.

[![UniFi Controller initial login prompt](/docs/assets/unifi-controller-initial-login-prompt.png)]

If you see a **UniFi Setup Wizard** similar to the one shown above, you have a working installation. Proceed to the next section!

## Layer 3 DNS Resolution on the LAN Side

When a Ubiquiti UniFi device powers up for the first time (or when it's unconfigured), it looks for a host called `unifi`. That is the default hostname for the UniFi Controller, and UniFi devices request to join the first one they can find.

1. In order for UniFi devices to "see" your controller in the cloud, you need to configure your DNS server so that `unifi` is forwarded to the FQDN or IP address of your Linode. In pfSense, you can add an *alias* under the **Firewall > Aliases** menu to accomplish this.

[![UniFi Controller alias in pfSense](/docs/assets/unifi-controller-alias-in-pfsense.png)]

2. The location and options for this feature vary widely across router hardware vendors. Refer to Google or your vendor's documentation for instructions on implementing this on your hardware.

## Verifying DNS Resolution on the LAN Side

1. Now that you've (hopefully) configured `unifi` forwarding on your LAN, it's time to put your configuration to the test! Using your favorite web browser, navigate to `https://unifi:8443`.

2. Did you see the same **UniFi Setup Wizard** you saw earlier? If so, your LAN is ready to go!

If not, flush your DNS cache, and reboot your routers and workstation. Still no dice? Double check your configuration options and check for typos.

## Setting Up UniFi Controller

### Plug in your UniFi devices

1. If you have not done so already, power up your UniFi devices and connect them to your LAN. Grab a beverage and take a few sips of it while your devices go through their first-time boot processes.

### Entering the UniFi Setup Wizard

1. If you already closed it, navigate back to `https://unifi:8443`, select your country and time zone, and click the green **NEXT** button.

2. Waiting to complete this because the author possesses no UniFi devices...

## Conclusion

Now that your UniFi Controller is running on a Linode in the cloud, [learn more about the UniFi platform](https://www.ubnt.com/enterprise/software/) and the [variety of devices that use it](https://www.ubnt.com/products/#enterprise).
