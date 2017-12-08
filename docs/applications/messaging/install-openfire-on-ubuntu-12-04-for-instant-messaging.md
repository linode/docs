---
deprecated: true
author:
  name: Alex Fornuto
  email: afornuto@linode.com
description: 'Install Openfire on Ubuntu 12.04 for Instant Messaging.'
keywords: ["openfire", "ubuntu 12.04", "instant messaging", "xmpp server", "collaboration software", "chat software", "linux jabber server", "JRE", "configure openfire", ""]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['communications/xmpp/openfire/ubuntu-12-04-precise-pangolin/','applications/messaging/instant-messaging-services-with-openfire-on-ubuntu-12-04-lts-precise-pangolin/']
modified: 2016-03-14
modified_by:
  name: Phil Zona
published: 2012-11-13
title: 'Install Openfire on Ubuntu 12.04 for Instant Messaging'
external_resources:
 - '[Openfire Documentation](http://www.igniterealtime.org/projects/openfire/documentation.jsp)'
 - '[XMPP Standards Foundation](http://xmpp.org/)'
 - '[XMPP Software Clients](http://xmpp.org/software/clients.shtml)'
---

[Openfire](http://www.igniterealtime.org/projects/openfire/) is an open-source real-time collaboration (instant messaging) server, built on the [XMPP protocol](http://en.wikipedia.org/wiki/Extensible_Messaging_and_Presence_Protocol) and available for multiple platforms. This guide will help you get started with Openfire on your Ubuntu 12.04 LTS (Precise Pangolin) Linode.

If you haven't done so already, please follow the steps outlined in our [getting started](/docs/getting-started/) guide before following these instructions, and make sure your system is fully updated. Initial configuration steps will be performed through the terminal; please make sure you're logged into your Linode as a root user via SSH.

## Prerequisites

Before installing Openfire, make sure your system is up to date:

    apt-get update && apt-get upgrade

Openfire requires a Java runtime engine (JRE). This tutorial uses the OpenJDK provided by the Ubuntu repository. Please note that although alternate Java runtime engines are available, Openfire may not work with them. Enter the following command to install the OpenJDK:

    apt-get install openjdk-7-jre

OpenJDK will be installed, along with a series of dependencies it requires.

## Adjust Firewall Settings

If you employ a firewall to specify what ports can be accessed on your Linode, verify that you have the following ports open:

-   3478 - STUN Service (NAT connectivity)
-   3479 - STUN Service (NAT connectivity)
-   5222 - Client to Server (standard and encrypted)
-   5223 - Client to Server (legacy SSL support)
-   5229 - Flash Cross Domain (Flash client support)
-   7070 - HTTP Binding (unsecured HTTP connecitons)
-   7443 - HTTP Binding (secured HTTP connections)
-   7777 - File Transfer Proxy (XMPP file transfers)
-   9090 - Admin Console (unsecured)
-   9091 - Admin Console (secured)

Additional ports may need to be opened later to support more advanced XMPP services, but these are the ports that Openfire will use by default.

## Install Openfire

Installing Openfire is relatively easy and can be completed in just a few steps. Here's how:

1.  Visit the download page for the [Openfire RTC server](http://www.igniterealtime.org/downloads/index.jsp#openfire), and click the link for the `.tar.gz` file. You will be taken to another page, which will start the download to your workstation. You may cancel this download, because a manual download link will be presented that you may copy to your clipboard and paste into the `wget` command in the next step.
2.  Use `wget` on your Linode to retrieve the package (substitute the link for the current version in the command below).

        wget http://www.igniterealtime.org/downloadServlet?filename=openfire/openfire_3_7_1.tar.gz

3.  Change the name of the download by entering the following command:

        mv downloadServlet\?filename\=openfire%2Fopenfire_3_7_1.tar.gz openfire_3_7_1.tar.gz

4.  Untar the software by entering the following command:

        tar -xvzf openfire_3_7_1.tar.gz

5.  Move the openfire folder to /opt:

        mv openfire /opt/

6.  Edit the configuration file `/opt/openfire/conf/openfire.xml`, substituting your Linode's public IP address for `198.51.100.0` in the `<interface>` section and removing the `<!-- -->` comment markers that surround the `<network>` section. While not required, this action is helpful if your Linode has multiple IP addresses, and you wish to limit access to a single address.

    {{< file-excerpt "/opt/openfire/conf/openfire.xml" xml >}}
<interface>198.51.100.0</interface>

{{< /file-excerpt >}}


7.  Add a symbolic link for the daemon script to `/etc/init.d` so that you can start the daemon with a call to service:

        ln -s /opt/openfire/bin/openfire /etc/init.d/

8.  Start Openfire:

        service openfire start

This completes the initial installation steps for Openfire. Next, we'll continue with configuration through a web browser.

## Configure Openfire

1.  Direct your browser to your Linode's IP address, or FQDN (fully qualified domain name) if an entry in DNS points to your Linode's IP, on port 9090. As an example, if your Linode's IP address were `198.51.100.0`, you would visit `http://198.51.100.0:9090` in your web browser.

2.  Configure your domain and ports for administration. Use the FQDN you have assigned to your Linode in DNS. For more information: [configuring DNS with the Linode Manager](/docs/dns-guides/configuring-dns-with-the-linode-manager)).

3.  You may choose to use Openfire's internal database for account management, or you may connect to an external database. Most users will want to choose the built-in option.

4.  User profiles may be stored in the server database or they may be pulled from LDAP or Clearspace. Most users will want to choose the default option.

5.  Enter the email address of the default administrative user and choose a secure password.

6.  After the initial web-based configuration is complete, restart the Openfire server before attempting to log in with the default "**admin**" user account. Enter the following commands, one by one:

        service openfire stop
        service openfire start

If you're experiencing difficulty using the credentials you just created to log in, please use "admin/admin" as the username/password. You'll need to update your credentials immediately afterward for security purposes.

Congratulations! You've successfully installed the Openfire RTC server on Ubuntu 12.04 LTS.
