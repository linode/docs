---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Getting started with Openfire on CentOS 5, an open source instant messaging server built on the XMPP/Jabber protocol.'
keywords: ["openfire", "openfire centos", "openfire on linux", "instant messaging", "real-time messaging", "xmpp server", "collaboration software", "chat software", "linux jabber server"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['communications/xmpp/openfire/centos-5/']
modified: 2011-08-22
modified_by:
  name: Linode
published: 2010-08-05
title: Instant Messaging Services with Openfire on CentOS 5
external_resources:
 - '[Openfire Documentation](http://www.igniterealtime.org/projects/openfire/documentation.jsp)'
 - '[XMPP Standards Foundation](http://xmpp.org/)'
 - '[XMPP Software Clients](http://xmpp.org/software/clients.shtml)'
---

[Openfire](http://www.igniterealtime.org/projects/openfire/) is an open source real-time collaboration (instant messaging) server, built on the [XMPP protocol](http://en.wikipedia.org/wiki/Extensible_Messaging_and_Presence_Protocol) and available for multiple platforms. This guide will help you get started with Openfire on your CentOS 5 Linode.

If you haven't done so already, please follow the steps outlined in our [getting started guide](/docs/getting-started/) before following these instructions, and make sure your system is fully updated. Initial configuration steps will be performed through the terminal; please make sure you're logged into your Linode as root via SSH.

## Install Prerequisites

Openfire requires a Java runtime engine (JRE). This tutorial uses the version provided by Sun Microsystems. Please note that although alternate Java runtime engines are available, Openfire may not work well with them.

Visit the Sun Microsystems [Java download page](http://java.com/en/download/manual.jsp) and find the links for Linux RPMs. If you're using 32-bit CentOS, copy the link for "Linux RPM" to your clipboard. If you're using 64-bit CentOS, copy the link for "Linux x64 RPM" instead.

In your terminal, issue the following command to download the installation package. You may need to install `wget` first by issuing the command `yum install wget`. Replace the link shown below with one to the current version of Java.

    wget http://javadl.sun.com/webapps/download/AutoDL?BundleId=33879

Rename the downloaded file and extract it with the following command:

    mv jre* jre-install.bin
    chmod +x jre-install.bin
    ./jre-install.bin

You will asked to accept the terms of the Java license. After entering "yes" to continue, a Java RPM package will be created and installed on your server. You can verify that it's installed correctly by issuing the following command:

    java -version

You should see a message in your terminal describing the version of Java installed on your server.

## Adjust Firewall Settings

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

## Install Openfire

Visit the download page for the [Openfire RTC server](http://www.igniterealtime.org/downloads/index.jsp#openfire) and click the link for the RPM package. You will be taken to another page, which will start the download to your workstation. You may cancel this download, as a manual download link will be presented that you may copy to your clipboard. Use `wget` on your Linode to retrieve the package (substitute the link for the current version in the command below).

    wget http://www.igniterealtime.org/downloadServlet?filename=openfire/openfire-3.6.4-1.i386.rpm

Install the software using `rpm` as follows:

    rpm -i downloadServlet?filename=openfire*.rpm

Next, edit the configuration file `/etc/openfire/openfire.xml`, inserting your Linode's public IP address in the `<interface>` section, and removing the `<!-- -->` comment markers that surround this section.

{{< file-excerpt "/opt/openfire/conf/openfire.xml" xml >}}
<interface>12.34.56.78</interface>

{{< /file-excerpt >}}


Restart Openfire with the following command:

    /etc/rc.d/init.d/openfire restart

This completes the initial installation steps for Openfire. Next, we'll continue with configuration through a web browser.

## Configure Openfire

Direct your browser to your Linode's IP address or FQDN (fully qualified domain name, if an entry in DNS points to your Linode's IP) on port 9090. As an example, if your Linode's IP address were "12.34.56.78", you would visit `http://12.34.56.78:9090` in your web browser. You will be presented with a language selection screen similar to this:

[![Language selection in Openfire setup on CentOS 5.](/docs/assets/407-openfire-centos-5-01-language-selection.png)](/docs/assets/407-openfire-centos-5-01-language-selection.png)

Next, you'll be asked to configure your domain and ports for administration. Use the fully qualified domain name you have assigned to your Linode in DNS (more information: [configuring DNS with the Linode Manager](/docs/dns-guides/configuring-dns-with-the-linode-manager)).

[![Domain and admin ports selection in Openfire setup on CentOS 5.](/docs/assets/408-openfire-centos-5-02-domain-ports-selection.png)](/docs/assets/408-openfire-centos-5-02-domain-ports-selection.png)

You may choose to use Openfire's internal database for account management, or you may connect to an external database. Most users will want to choose the built-in option.

[![Database type selection in Openfire setup on CentOS 5.](/docs/assets/409-openfire-centos-5-03-database-selection.png)](/docs/assets/409-openfire-centos-5-03-database-selection.png)

User profiles may be stored in the server database, or they may be pulled from LDAP or Clearspace. Most users will want to choose the default option.

[![Profile storage selection in Openfire setup on CentOS 5.](/docs/assets/410-openfire-centos-5-04-profile-settings.png)](/docs/assets/410-openfire-centos-5-04-profile-settings.png)

Enter the email address of the default administrative user and select a strong password.

[![Administrator account settings in Openfire setup on CentOS 5.](/docs/assets/411-openfire-centos-5-05-admin-account-settings.png)](/docs/assets/411-openfire-centos-5-05-admin-account-settings.png)

After the initial web-based configuration is complete, restart the Openfire server before attempting to log in with the default "**admin**" user account.

    /etc/rc.d/init.d/openfire restart

If you're experiencing difficulty using the credentials you just created to log in, please use "admin/admin" as the username/password. You'll need to update your credentials immediately afterward for security purposes. Congratulations! You've successfully installed the Openfire RTC server on CentOS 5!
