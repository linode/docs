---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Set up Pritunl, an open source VPN server with an intuitive web interface'
keywords: ["pritunl", "vpn", "vpn server", "ubuntu", "ubuntu 14.04"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2015-07-27
modified: 2015-07-27
modified_by:
    name: Linode
title: 'Pritunl VPN Server and Management Panel on Ubuntu 14.04'
contributor:
    name: Andrew Gottschling
    link: https://github.com/agottschling
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and
earn $250 per published guide.*

<hr>

Pritunl is an open source VPN server and management panel. It gives the user the power of the OpenVPN protocol while using an intuitive web interface. This tutorial will show you how to install, configure, and connect to Pritunl VPN.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the sudo command, reference the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Before You Begin

1.  Have a Linode running Ubuntu 14.04. Follow the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides for help configuring the Linode.

2.  Ensure the Linode is up-to-date:

        sudo apt-get update && sudo apt-get upgrade

3.  Add Pritunl’s APT repository and update the package lists:

        echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.0 multiverse" > /etc/apt/sources.list.d/mongodb-org-3.0.list
        echo "deb http://repo.pritunl.com/stable/apt trusty main" > /etc/apt/sources.list.d/pritunl.list

4.  Add repo keys for apt to validate against

        apt-key adv --keyserver hkp://keyserver.ubuntu.com --recv 7F0CEB10
        apt-key adv --keyserver hkp://keyserver.ubuntu.com --recv CF8E292A

5.  Update the package cache

        sudo apt-get update

6.  If you have a firewall running on the Linode, add exceptions for Pritunl’s Web UI and server:

        sudo iptables -A INPUT -p udp -m udp --sport 9700 --dport 1025:65355 -j ACCEPT
        sudo iptables -A INPUT -p tcp -m tcp --sport 9700 --dport 1025:65355 -j ACCEPT
        sudo iptables -A INPUT -p `your protocol here` -m `your protocol here` --sport `your_port_here` --dport 1025:65355 -j ACCEPT

    {{< note >}}
If you've configured the firewall according to the [Securing Your Server](/docs/security/securing-your-server) guide, be sure to add these port ranges to the `/etc/iptables.firewall.rules` file.
{{< /note >}}

## Install Pritunl

1.  Install Pritunl and its required dependencies:

        sudo apt-get install python-software-properties pritunl mongodb-org

2.  Start the Pritunl service:

        sudo service pritunl start

2.  Open a web browser on your computer, and navigate to `https://123.45.67.89:9700`, replacing `123.45.67.89` with your Linode's IP address. You will see a screen similar to this:

    [![Pritunl DB setup screen](/docs/assets/pritunl-db-setup-resized.png)](/docs/assets/pritunl-db-setup.png)

3.  Connect to the database. The installer has already populated the mongoDB URI. If it looks correct, click **Save**.

    Alternatively, you may enter any valid MongoDB URI to use as the database for Pritunl.

## Configuring Pritunl

1.  Login with the following information:

    - **Username:** *pritunl*
    - **Password:** *pritunl*

2.  The Inital Setup form will appear:

    ![Pritunl setup screen](/docs/assets/pritunl-setup.png)

    Fill out the form, and press **Save**.

    {{< note >}}
The SMTP settings are not required and will not do anything without a license.

If you have a license, Click on the **Upgrade to Premium** button on the upper right, and use the form to enter your license.
{{< /note >}}

3.  Go to the **Users** tab. Here, you will create your organizations and users. Begin by clicking **Add Organization** and entering a name. Next, click **Add User** and add a user to the organization you just created.

4.  Go to the **Servers** tab. Click **Add server**. You will see a screen like the following:

    ![Pritunl server setup screen](/docs/assets/pritunl-server-conf.png)

    If a firewall is set up, make sure that the **Port** and **Protocol** fields match the firewall exceptions added earlier.

5.  Click the **Attach Organization** button. Attach the organization to the server.


## Connecting to the Server

To connect to the server, you can use any OpenVPN compatible client. For Android or iOS, you can use the free **OpenVPN Connect** app available in the [Google Play](https://play.google.com/store/apps/details?id=net.openvpn.openvpn) or [iOS App Store](https://itunes.apple.com/us/app/openvpn-connect/id590379981). For Linux, there is an official client available for Ubuntu. Mac and Windows users can use any OpenVPN client.

To get the keys, there are two options:

- Next to your username, there is a Online/Offline indicator. Next to that, there are two buttons. One with a link icon, and another with a download icon.

- The download icon will download the keyfiles as a **TAR** file.

The link icon will display a link that you can give to your users to download their key. These links are unique to the user, and are temporary and expire after they have been used or within 24 hours, whichever comes first.
