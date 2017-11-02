---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Getting started with Openfire on Debian 5 (Lenny), an open source instant messaging server built on the XMPP/Jabber protocol.'
keywords: ["openfire", "openfire on linux", "instant messaging", "real-time messaging", "xmpp server", "collaboration software", "chat software", "linux jabber server"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['communications/xmpp/openfire/debian-5-lenny/']
modified: 2012-10-03
modified_by:
  name: Linode
published: 2009-09-18
title: 'Instant Messaging Services with Openfire on Debian 5 (Lenny)'
---



[Openfire](http://www.igniterealtime.org/projects/openfire/) is an open source real-time collaboration (instant messaging) server, built on the [XMPP protocol](http://en.wikipedia.org/wiki/Extensible_Messaging_and_Presence_Protocol) and available for multiple platforms. This guide will help you get started with Openfire on your Debian 5 (Lenny) Linode.

If you haven't done so already, please follow the steps outlined in our [getting started](/docs/getting-started/) guide before following these instructions, and make sure your system is fully updated. Initial configuration steps will be performed through the terminal; please make sure you're logged into your Linode as root via SSH.

Install Prerequisites
---------------------

Openfire requires a Java runtime engine (JRE). This tutorial uses the version provided by Sun Microsystems. Please note that although alternate Java runtime engines are available, Openfire may not work well with them.

Examine your `/etc/apt/sources.list` file to make sure you have the `non-free` repository enabled. You can use an editor like `nano` to edit configuration files through the shell; you would issue the command `nano /etc/apt/sources.list` to edit this one. Please consult the [nano manual page](http://www.nano-editor.org/dist/v1.2/nano.1.html) for information on using the editor. Your file should look similar to the following.

{{< file "/etc/apt/sources.list" >}}
# the main Debian packages.
deb http://mirror.cc.columbia.edu/pub/linux/debian/debian/ lenny main contrib non-free
# Uncomment the deb-src line if you want 'apt-get source'
# to work with most packages.
# deb-src http://mirror.cc.columbia.edu/pub/linux/debian/debian/ lenny main contrib
# uncommenting the following line will enable security updates
deb http://security.debian.org/ stable/updates main contrib non-free

{{< /file >}}


If you had to add the `non-free` repository to your sources, issue the following command to update your package database:

    apt-get update
    apt-get upgrade

Issue the following command to install prerequisite packages on your server:

    apt-get install sun-java6-jre

The Sun Java6 JRE will be installed, along with a series of dependencies it requires. You will be prompted to accept the licensing agreement for Sun Java before proceeding.

Adjust Firewall Settings
------------------------

If you employ a firewall to specify what ports can be accessed on your Linode, please make sure you have the following ports open:

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

Install Openfire
----------------

Visit the download page for the [Openfire RTC server](http://www.igniterealtime.org/downloads/index.jsp#openfire) and click the link for the Debian package. You will be taken to another page, which will start the download to your workstation. You may cancel this download, as a manual download link will be presented that you may copy to your clipboard. Use `wget` on your Linode to retrieve the package (substitute the link for the current version in the command below). You may need to install `wget` first using the command `apt-get install wget`.

    wget http://www.igniterealtime.org/downloadServlet?filename=openfire/openfire_3.6.4_all.deb

Install the software using `dpkg` as follows:

    dpkg -i openfire*.deb

Next, edit the configuration file `/etc/openfire/openfire.xml`, inserting your Linode's public IP address in the `<interface>` section, and removing the `<!-- -->` comment markers that surround this section.

{{< file-excerpt "/etc/openfire/openfire.xml" xml >}}
<interface>12.34.56.78</interface>

{{< /file-excerpt >}}


Restart Openfire with the following command:

    /etc/init.d/openfire restart

This completes the initial installation steps for Openfire. Next, we'll continue with configuration through a web browser.

Configure Openfire
------------------

Direct your browser to your Linode's IP address or FQDN (fully qualified domain name, if an entry in DNS points to your Linode's IP) on port 9090. As an example, if your Linode's IP address were "12.34.56.78", you would visit `http://12.34.56.78:9090` in your web browser. You will be presented with a language selection screen similar to this:

[![Language selection in Openfire setup on Debian 5 (Lenny).](/docs/assets/392-openfire-debian-lenny-01-language-selection.png)](/docs/assets/392-openfire-debian-lenny-01-language-selection.png)

Next, you'll be asked to configure your domain and ports for administration. Use the fully qualified domain name you have assigned to your Linode in DNS (more information: [configuring DNS with the Linode Manager](/docs/dns-guides/configuring-dns-with-the-linode-manager)).

[![Domain and admin ports selection in Openfire setup on Debian 5 (Lenny).](/docs/assets/393-openfire-debian-lenny-02-domain-ports-selection.png)](/docs/assets/393-openfire-debian-lenny-02-domain-ports-selection.png)

You may choose to use Openfire's internal database for account management, or you may connect to an external database. Most users will want to choose the built-in option.

[![Database type selection in Openfire setup on Debian 5 (Lenny).](/docs/assets/394-openfire-debian-lenny-03-database-selection.png)](/docs/assets/394-openfire-debian-lenny-03-database-selection.png)

User profiles may be stored in the server database, or they may be pulled from LDAP or Clearspace. Most users will want to choose the default option.

[![Profile storage selection in Openfire setup on Debian 5 (Lenny).](/docs/assets/395-openfire-debian-lenny-04-profile-settings.png)](/docs/assets/395-openfire-debian-lenny-04-profile-settings.png)

Enter the email address of the default administrative user and select a strong password.

[![Administrator account settings in Openfire setup on Debian 5 (Lenny).](/docs/assets/396-openfire-debian-lenny-05-admin-account-settings.png)](/docs/assets/396-openfire-debian-lenny-05-admin-account-settings.png)

After the initial web-based configuration is complete, restart the Openfire server before attempting to log in with the default "**admin**" user account.

    /etc/init.d/openfire restart

If you're experiencing difficulty using the credentials you just created to log in, please use "admin/admin" as the username/password. You'll need to update your credentials immediately afterward for security purposes. Congratulations! You've successfully installed the Openfire RTC server on Debian Linux!

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Openfire Documentation](http://www.igniterealtime.org/projects/openfire/documentation.jsp)
- [XMPP Standards Foundation](http://xmpp.org/)
- [XMPP Software Clients](http://xmpp.org/software/clients.shtml)



