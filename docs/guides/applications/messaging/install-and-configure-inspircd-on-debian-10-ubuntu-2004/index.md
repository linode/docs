---
slug: install-and-configure-inspircd-on-debian-10-ubuntu-2004
author:
  name: Nathaniel Stickman
description: 'InspIRCd is a free and open-source IRC server. It is easy to set up, lightweight, and extensible through its modular design. This guide walks you through deploying your own InspIRCd server on Debian 10 or Ubuntu 20.04.'
og_description: 'InspIRCd is a free and open-source IRC server. It is easy to set up, lightweight, and extensible through its modular design. This guide walks you through deploying your own InspIRCd server on Debian 10 or Ubuntu 20.04.'
keywords: ['irc server', 'inspircd']
tags: ['debian', 'ubuntu']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-02
modified_by:
  name: Linode
title: "Install and Configure InspIRCd on Debian 10 or Ubuntu 20.04"
h1_title: "How to Install and Configure InspIRCd on Debian 10 and Ubuntu 20.04"
enable_h1: true
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[InspIRCd configuration options](https://docs.inspircd.org/3/configuration/)'
- '[IRC help website](https://www.irchelp.org/)'
- '[IRC networks and server lists](https://www.irchelp.org/networks/)'
---

Internet Relay Chat (IRC) is a real-time, text-based communication protocol with a long history of use for group chats and discussion forums. IRC networks — which can be made up of several independent servers — may each have numerous channels, with each channel functioning as a space for group chat.

InspIRCd is a free and open-source IRC server application. It has been designed to be a stable, high-performance, and modular IRC server option. This guide shows you how to get your own InspIRCd server up and running on Ubuntu and Debian.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Install InspIRCd

1. Install the InspIRCd package.

        sudo apt install inspircd

1. Open ports `22` and `6667` in your machine's firewall. The following assumes you are using UFW for firewall management.

        sudo ufw allow 22/tcp
        sudo ufw allow 6667/tcp
        sudo ufw reload

## Configure InspIRCd

Open the InspIRCd configuration file, located at `/etc/inspircd/inspircd.conf`, and update it with changes displayed in this section.

{{< note >}}
Refer to InspIRCd's documentation on [configuration options](https://docs.inspircd.org/3/configuration/) for explanations of each of the configuration tags and values updated in this section's steps.
{{< /note >}}

1. Locate the `server` tag. Change the `name` value to reflect your IRC server's hostname; leave the `id` value as is. Modify the other values in the `server` tag to reflect the description and naming you would like for your IRC server.

    {{< file "/etc/inspircd/inspircd.conf" >}}
<server name="irc.example.com"
    description="Example IRC Server"
    id="1AB"
    network="ExampleNet">
    {{< /file >}}

1. Find the `admin` tag, and modify its contents to reflect the contact information for the server's administrator.

    {{< file "/etc/inspircd/inspircd.conf" >}}
<admin name="Example User"
    nick="example-user"
    email="example-user@example-email.com">
    {{< /file >}}

1. Locate the `bind` tag, and remove the value from the `address` field. Doing so allows the server to respond to outside requests, where the default (`127.0.0.1`) limits the IRC server to local connections.

    {{< file "/etc/inspircd/inspircd.conf" >}}
<bind address="" port="6667" type="clients">
    {{< /file >}}

1. Find the `power` tag. Enter the passwords to be required for the operator to shut down the IRC server (`diepass`) and to restart it (`restartpass`).

    {{< file "/etc/inspircd/inspircd.conf" >}}
<power diepass="shutdown-password" restartpass="restart-password" pause="2">
    {{< /file >}}

1. Locate the `oper` tag. This defines the operator user, who has administrative authority on the IRC server. Enter a username (`name`) and password for the operator user. Leave the `type` as `NetAdmin`.

    {{< file "/etc/inspircd/inspircd.conf" >}}
<oper name="example-user"
    password="password"
    host="*@*"
    type="NetAdmin">
    {{< /file >}}

    - The `host` value defines the `username@hostname` masks from which a user may log in as the operator. Setting this to `*@*`, as in the example above, allows a user to log in as the operator from any address mask.

    - To make your IRC server more secure, a `host` value like the example below only allows a user from the IRC network's localhost, IP address, or domain to log in as the operator. Replace `192.0.2.0` with the IP address for the IRC server, and likewise replace `irc.example.com` with the machine's domain name:

          *@localhost *@192.0.2.0 *@irc.example.com

    - You can restrict access even further by replacing the asterisks (`*`) with the username of a specific user on the machine. You can enter as many address masks as desired, separating each with space.

## Complete the InspIRCd Setup

1. Open the `/etc/inspircd/inspircd.motd` file, and enter a "message of the day" for your IRC server. The message of the day displays when users connect to your IRC server and when they use the `/motd` command. The message of the day is a good place to remind users to review the server's rules, which you input in the next step.

1. Open the `/etc/inspircd/inspircd.rules` file, and enter the usage rules for your IRC server. Users can review these with the `/rules` command. The rules should set expectations for the kinds of behavior you allow on your server.

    {{< note >}}
Not all IRC clients support the `/rules` command. The popular client WeeChat, for example, does not support this command. If you expect users may frequently use one of these clients, you may also opt to present your rules in the message of the day.
    {{< /note >}}

1. Restart the InspIRCd service for the changes to take effect.

        sudo systemctl restart inspircd

## Test the InspIRCd Installation

To verify that your IRC server is running properly, you should connect to it using an IRC client. There are many options, and this guide uses the popular WeeChat client as an example.

If you want more information on WeeChat and its usage, refer to the [Using WeeChat for Internet Relay Chat](/docs/guides/using-weechat-for-irc/) guide.

1. Install the WeeChat IRC client.

        sudo apt install weechat

1. Startup WeeChat once the installation is complete.

        weechat

1. Enter the following command in the WeeChat interface to add your IRC network. Replace `irc.example.com` with the domain name for your IRC network, and replace `example-irc-alias` with an alias you would like to store the connection under.

        /server add example-irc-alias irc.example.com

    To quit the WeeChat interface, use the `/quit` command.

    WeeChat stores the information for connecting to the IRC server under the alias you provide. You can then connect to the server anytime, even after quitting and restarting WeeChat, by using that alias.

1. Connect to the IRC server using the alias you created:

        /connect example-irc-alias

1. You can then log in as the operator using the `/oper` command. Replace `example-user` and `password` with the name and password, respectively, that you configured for the operator user.

        /oper example-user password

## Add SSL Certification

While not necessary, using SSL certification on your IRC server significantly increases its security by ensuring that the information it sends and receives is encrypted. The following steps show you how to use [Certbot](https://certbot.eff.org) to request and download a free certificate from [Let's Encrypt](https://letsencrypt.org) and how to use that certificate on your IRC server.

### Install Certbot

1. Install the [Snap](https://snapcraft.io/docs/getting-started) app store. Snap provides application bundles that work across major Linux distributions. If you are using Ubuntu, Snap should already be installed (since version 16.04):

        sudo apt install snapd

1. Update and refresh Snap.

        sudo snap install core && sudo snap refresh core

1. Ensure that any existing Certbot installation is removed.

        sudo apt remove certbot

1. Install Certbot.

        sudo snap install --classic certbot

1. Create a symbolic link for Certbot.

        sudo ln -s /snap/bin/certbot /usr/bin/certbot

### Download a Certificate

1. Open port `80` in your machine's firewall. Certbot verifies your domain information by connecting through this port.

        sudo ufw allow 80/tcp
        sudo ufw reload

1. Download the standalone certificate. Replace `irc.example.com` with your IRC server's domain name.

        sudo certbot certonly --standalone --preferred-challenges http -d irc.example.com

1. Certbot includes a cron job that automatically renews your certificate before it expires. You can test the automatic renewal with the following command:

        sudo certbot renew --dry-run

### Add the Certificate to InspIRCd

1. Create a directory to store the SSL files for InspIRCd.

        sudo mkdir /etc/inspircd/ssl

1. Copy the certificate and private key files into the new InspIRCd SSL directory.

        sudo cp /etc/letsencrypt/live/irc.example.com/fullchain.pem /etc/inspircd/ssl/cert.pem
        sudo cp /etc/letsencrypt/live/irc.example.com/privkey.pem /etc/inspircd/ssl/key.pem

1. Ensure that the InspIRCd user has the required permissions for the files.

        sudo chown -R irc:irc /etc/inspircd

1. Open the InspIRCd configuration file again (`/etc/inspircd/inspircd.conf`), and add the following lines beneath the existing `bind` tag. These lines watch a given port for SSL connections, identify the certificate and key files and the specifications to use with them, and load InspIRCd's GnuTLS module for handling SSL connections.

    {{< file "/etc/inspircd/inspircd.conf" >}}
<bind address="" port="6697" type="clients" ssl="gnutls">
<gnutls
    certfile="/etc/inspircd/ssl/cert.pem"
    keyfile="/etc/inspircd/ssl/key.pem"
    priority="SECURE192:-VERS-SSL3.0">
<module name="m_ssl_gnutls.so">
    {{< /file >}}

### Connect to the IRC Server Using SSL

To connect to the IRC server now, you need to use port `6697`. In WeeChat, you can do this in one of two ways:

{{< note >}}
In both of the examples that follow, replace `example-irc-alias` with your server's WeeChat alias and `irc.example.com` with your server's domain name.
{{< /note >}}

1. Change the alias's address settings to specify the new port. This assumes that the alias has SSL enabled, which is the case by default. This is the simplest option.

       /set irc.server.example-irc-alias.addresses irc.example.com/6697

1. Alternatively, you can delete the existing alias and create a new one using the appropriate port and specifying SSL. While it is not necessary to delete the existing alias first, doing so frees the alias for reuse. It also removes inoperative connection information, since the IRC server no longer accepts connections on the default port used by the existing alias.

       /server del example-irc-alias
       /server add example-irc-alias irc.example.com/6697 -ssl

    You can then connect to the IRC server. WeeChat's notifications indicate that SSL is being used for the connection.

        /connect example-irc-alias

### Set Up Automatic Renewals

Certificates from Let's Encrypt expire after 90 days. Certbot automatically renews your certificate, but the renewed certificate needs to be copied to the `inspircd` folder. The following steps show you how to set up a Cron job to copy the certificate files automatically.

You can learn more about using Cron in the [Schedule Tasks with Cron](/docs/guides/schedule-tasks-with-cron/) guide.

1. Make a `/etc/inspircd/cron` directory. Using your preferred text editor, create and open a `copy-inspircd-certs.sh` in that directory. The Nano text editor is used in this example.

        sudo mkdir /etc/inspircd/cron
        sudo nano /etc/inspircd/cron/copy-inspircd-certs.sh

1. Enter the following lines in the `copy-inspircd-certs.sh` file.

    {{< file "/etc/inspircd/cron/copy-inspircd-certs.sh" >}}
# !/bin/bash
cp /etc/letsencrypt/live/debian-test.nathanielps.com/fullchain.pem /etc/inspircd/ssl/cert.pem
cp /etc/letsencrypt/live/debian-test.nathanielps.com/privkey.pem /etc/inspircd/ssl/key.pem
chown -R irc:irc /etc/inspircd
    {{< /file >}}

    The first line defines what program is used to execute the script. The remaining lines duplicate the ones used above for copying the certificate files into the `inspircd` directory and ensuring the InspIRCd user has the required permissions for them. The `sudo` portion of the commands has been removed since the cron job is to be run by the root user.

1. Make the file executable.

        sudo chmod +x /etc/inspircd/cron/copy-inspircd-certs.sh

1. Open the root user's `crontab`. You are prompted to select a text editor; select whichever you prefer.

        sudo crontab -e

1. Add the job to the `crontab` by entering the following line:

        0 0 * * * /etc/inspircd/cron/copy-inspircd-certs.sh

## Next Steps

Your IRC server is now up and running and ready for a community. Check out the [#irchelp](https://www.irchelp.org/) website for more information about using and running an IRC server. You can also refer that channel to get ideas for more you can do with your new server. You can also use the [IRC Networks and Server Lists](https://www.irchelp.org/networks/) to find existing IRC communities and see how other popular IRC servers operate.
