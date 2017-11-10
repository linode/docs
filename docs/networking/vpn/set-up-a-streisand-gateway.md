---
author:
  name: Jared Kobos
  email: docs@linode.com
description: 'This guide shows how to create a Streisand gateway with automatically configured profiles for OpenVPN, ShadowSocks, WireGuard, Tor, etc.'
keywords: ["streisand", "vpn", "openvpn", "tor", "wireguard", "L2TP/IPSec", "OpenConnect", "security"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-09-12
modified: 2017-10-13
modified_by:
  name: Linode
title: 'How to Set Up a Streisand Gateway'
external_resources:
  - '[Streisand Github repository](https://github.com/jlund/streisand)'
---

![Streisand Gateway](/docs/assets/streisand/Streisand_Gateway.jpg)

## Why Use a VPN

Setting up a personal Virtual Private Network (VPN) server is a great way to avoid internet censorship, surveillance, or geolocation. Using your own server allows you to choose any protocol you want, and to have full control over the security and privacy of your connection.

However, the configuration process is time-consuming, especially for those with little experience working with remote servers (For example, Linode's guide on setting up a hardened OpenVPN server and client is a [three](/docs/networking/vpn/set-up-a-hardened-openvpn-server) [part](/docs/networking/vpn/tunnel-your-internet-traffic-through-an-openvpn-server) [series](/docs/networking/vpn/configuring-openvpn-client-devices)).

[Streisand](https://github.com/jlund/streisand) attempts to simplify this process and offer painless, high-quality security. The Streisand script creates a Linode and automatically configures OpenVPN, Shadowsocks, OpenConnect, L2TP/IPSec, Wireguard, a Tor bridge, and SSH. Once the server is set up, users can connect to a gateway containing detailed, personalized instructions for connecting to each of these services.

## Before You Begin

Streisand uses open-source platform Ansible to automate much of the process that creates and configures a Linode. This means, unlike normal VPN setup, you should **not** create a Linode before beginning this guide, or go through the usual steps of connecting to and securing your server. All of the commands will be run from your local machine. You will, however, need the API key from your Linode account:

1.  Open the Linode Manager and select "My Profile," in the upper right corner of the screen next to your account name. You will need to re-aunthenticate before viewing this section.

2.  Select the "API Keys" tab on the far right of the menu.

    ![Linode API Menu](/docs/assets/streisand/linode_api_menu.png)

3.  Provide a label for your API key if desired, and choose when the key should expire. When you have finished, click "Create API Key."

    ![API Key](/docs/assets/streisand/api_key.png)

4. Record the generated key! Please note: You will not be able to view the full key after closing or reloading the page.

## Install Ansible and its Dependencies

{{< note >}}
As of this writing, it is not possible to run Streisand on a Windows computer. If you do not have access to a Mac or Linux machine, you can connect to an existing Linode and complete the steps in this guide from your remote server. This will create an additional Linode.
{{< /note >}}

1.  Open a terminal window on your local machine. Check to see if you have any ssh keys:

        ls ~/.ssh/id_rsa.pub

    If no key is present, create one with `ssh-keygen`:

        ssh-keygen -t rsa -b 4096

2.  Make sure Python 2.7 is installed on your machine:

        python --version

    If Python is not installed, or is Version 3, you will need to install 2.7.

3.  Install `git`. If you are using Linux, use the default package manager for your distro. For example, on Ubuntu:

        sudo apt-get install git

    On OS X, simply typing `git` at the command line will prompt XCode to install `git` if it is not already present.

4.  Install `pip`, a package manager for Python.
    *  On Debian or Ubuntu:

            sudo apt-get install python-paramiko python-pip python-pycurl python-dev build-essential

    *  On Fedora:

            sudo yum install python-pip

    *  On OS X:

            sudo easy_install pip
            sudo easy_install pycurl

5. Use `pip` to install the Linode Python libraries:

        sudo pip install linode-python

6.  Install Ansible. If you are using Linux, use `pip` for this as well:

        sudo pip install ansible markupsafe

    On OS X, you can use [Homebrew](http://www.homebrew.com) instead:

        brew install ansible

## Install and Run Streisand

You are now ready to run Streisand.

1.  Clone the repository from Github:

        git clone https://github.com/jlund/streisand.git && cd streisand

2.  Run Streisand:

        ./streisand

3.  When prompted, choose Linode as your hosting provider. Choose a location for your gateway, then enter the API key you created earlier.

    ![Streisand API Prompt](/docs/assets/streisand/api-prompt.png)

{{< note >}}
Choosing a server location near your home will help to reduce latency. However, if you intend to use your VPN to evade geolocation or avoid local internet restrictions, consider choosing a location in an appropriate country.
{{< /note >}}

Streisand will now execute a series of Ansible rules to create and configure a new Linode. This process can take a long time. (The [Streisand docs](https://github.com/jlund/streisand) say about ten minutes, but in some cases it can be longer). You may be prompted for confirmation or to provide additional information during the process.

{{< caution >}}
Streisand will create a new Linode under your account early in the configuration process. If the script fails for any reason, or if you cancel it, check your [Linode Manager](https://cloud.linode.com/) and remove the new Linode if necessary.
{{< /caution >}}

{{< note >}}
You should not recieve any errors during the install. If you receive an error related to `Alert_cpu_threshold must be between 0 and 2000`, visit this [link](https://github.com/jlund/streisand/issues/626#issuecomment-319812261) to address the issue.
{{< /note >}}

## Connect to Your Streisand Gateway

You now have a Linode with multiple VPNs and protocols fully configured for use; the next step is to connect to it. Streisand should automatically open the `streisand.html` file that was generated during the configuration process. If not, you can find the file in `streisand/generated-docs/streisand.html` and open it in any browser.

1.  Click on "Download Certificate" to download an SSL certificate so that you can verify the secure connection to your new gateway. The `streisand.html` file includes instructions on how to mark the certificate as trusted on different systems and devices.

2.  There are two possible ways to connect to your gateway, but for most users the easiest way will be through SSL. Scroll down to "Connecting to your Streisand Gateway" in `streisand.html` and copy the `https://` address into your web browser. Enter the provided username and password when prompted.


### Next Steps

You are now connected to your gateway. From here, you can choose from any of the eight pre-configured connection options, then use the provided links to download an appropriate client. Each connection option has detailed instructions on how to connect your client devices.

These instructions are personalized to your gateway, and so contain the exact IP addresses, passwords, and other information you will need. Where possible, links are provided to download pre-made configuration files to make the setup process even easier. This also makes it simple to share connection information, so that you can easily share your new VPN with family and friends.
