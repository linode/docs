---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Use Cherokee Web Server on Ubuntu 12.04.'
keywords: ["cherokee", "web sever", "ubuntu 12.04", "posix", "precise pangolin", "ssh", "ssh tunnel", "cherokee admin", "PuTTY"]
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
aliases: ['web-servers/cherokee/installing-cherokee-ubuntu-12-04-precise-pangolin/', 'websites/cherokee/websites-with-the-cherokee-web-server-on-ubuntu-12-04-lts-precise-pangolin/','websites/cherokee/use-cherokee-web-server-on-ubuntu-12-04/']
modified: 2016-03-11
modified_by:
  name: Linode
published: 2012-10-10
title: 'Use Cherokee Web Server on Ubuntu 12.04'
external_resources:
 - '[Cherokee Web Server Documentation](http://www.cherokee-project.com/doc/)'
 - '[Host Web Apps with Cherokee and PHP-FastCGI on Ubuntu 10.04 LTS (Lucid)](/docs/web-servers/cherokee/web-apps-with-cherokee-and-phpfastcgi-on-ubuntu-10-04-lts-lucid/)'
---

Cherokee is a fast, flexible web server for POSIX-compliant operating systems such as Linux. It's designed to be easy to administer, and includes support for a wide range of common web server functions.

This tutorial explains how to install and configure the Cherokee web server on Ubuntu 12.04 LTS (Precise Pangolin). We will be performing the installation through a terminal emulator; please make sure you are logged into your Linode as a non-root user via SSH.

This document assumes that you already have a working and up to date Ubuntu 12.04 system. If you have not followed our [getting started](/docs/getting-started/) guide, we recommend that you do so prior to following these instructions.

## Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started/#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command will show your short hostname, and the second will show your fully qualified domain name (FQDN).

## Check Package Sources

First, make sure you have the `universe` repositories enabled on your system. Your `/etc/apt/sources.list` should resemble the following (you may have to uncomment or add the `universe` lines):

{{< file-excerpt "/etc/apt/sources.list" >}}
## main & restricted repositories
deb http://us.archive.ubuntu.com/ubuntu/ lucid main restricted
deb-src http://us.archive.ubuntu.com/ubuntu/ lucid main restricted

deb http://security.ubuntu.com/ubuntu lucid-security main restricted
deb-src http://security.ubuntu.com/ubuntu lucid-security main restricted

## universe repositories
deb http://us.archive.ubuntu.com/ubuntu/ lucid universe
deb-src http://us.archive.ubuntu.com/ubuntu/ lucid universe

deb http://us.archive.ubuntu.com/ubuntu/ lucid-updates universe
deb-src http://us.archive.ubuntu.com/ubuntu/ lucid-updates universe

deb http://security.ubuntu.com/ubuntu lucid-security universe
deb-src http://security.ubuntu.com/ubuntu lucid-security universe

{{< /file-excerpt >}}


If you had to enable new repositories, update your package lists:

    sudo apt-get update && apt-get upgrade

Next, we'll get Cherokee installed and configured.

## Install Cherokee

Install the Cherokee web server, its documentation and some useful modules (including support for SSL):

    sudo apt-get install cherokee cherokee-doc libcherokee-mod-libssl libcherokee-mod-streaming libcherokee-mod-rrd

Several packages will be installed in addition to the main server package. You may visit your Linode's IP address (or domain name, if you have it pointed to the IP) in a web browser to verify that Cherokee is running. You should see the default Cherokee test page.

## Configure Cherokee

The Cherokee web server includes an easy to use, comprehensive administration interface. This interface, known as `cherokee-admin`, is the recommended means of administering your web server.

Start `cherokee-admin` by issuing the following command:

    cherokee-admin -b &

This instructs the administration program to bind to all IP addresses so it may be reached remotely. It will be launched in the background, so you'll still be able to use your SSH session. You should see output similar to the following:

    user@hostname:~# cherokee-admin -b &
    [1] 2154
    user@hostname:~#
    Login:
      User:              admin
      One-time Password: eFxccWtngt75ALZg

    Web Interface:
      URL:               http://localhost:9090/

    Cherokee Web Server 0.99.39 (Feb  2 2010): Listening on port ALL:9090, TLS
    disabled, IPv6 disabled, using epoll, 4096 fds system limit, max. 2041
    connections, caching I/O, single thread

### Secure Admin Panel Access

Instead of binding to all interfaces on your Linode, you may wish to bind to localhost and use SSH port forwarding to securely reach the administration system from your workstation. To do so, issue the following commands to launch `cherokee-admin` and set up an SSH tunnel. The first command is not required if you haven't already launched `cherokee-admin`. You may need to install the `killall` command first by running `sudo apt-get install psmisc`.

On your Linode:

    killall cherokee-admin
    cherokee-admin &

In a terminal window on your local workstation (MacOS X, Linux, BSD, etc):

    ssh -L 9090:localhost:9090 root@198.51.100.0 -N

Replace "198.51.100.0" with your Linode's IP address. You may now visit `http://localhost:9090` in your web browser via the SSH tunnel. To stop the tunnel, simply press **CTRL+C** in your local terminal window.

You'll be presented with the Cherokee administration panel, which you may use to configure websites and specify configuration options. You'll still need to log in using the username and one-time password provided when you launched `cherokee-admin`.

[![The cherokee-admin web server administration interface running on an Ubuntu Linux 10.04 LTS (Lucid) Linode.](/docs/assets/1138-cherokee-ubuntu-lucid-admin-01-home.png)](/docs/assets/1138-cherokee-ubuntu-lucid-admin-01-home.png)

### Secure Admin Panel Access on Windows

You can use [PuTTY](http://www.chiark.greenend.org.uk/~sgtatham/putty/) to set up a secure SSH tunnel for Cherokee administration. Enter your Linode's public IP address in the session tab:

[![Session information for PuTTY.](/docs/assets/1134-cherokee-putty-01-session.png)](/docs/assets/1134-cherokee-putty-01-session.png)

Expand the "Connection -> SSH" menus to select the "Tunnels" configuration page. Enter the values shown here:

[![Configuring an SSH tunnel for Cherokee administration in PuTTY.](/docs/assets/1135-cherokee-putty-02-tunnel.png)](/docs/assets/1135-cherokee-putty-02-tunnel.png)

Back on the session tab, enter "Cherokee Admin" in the "Saved Sessions" field and click "Save" to retain your settings for future use.

[![Saving an SSH session for Cherokee administration in PuTTY.](/docs/assets/1136-cherokee-putty-03-saved-session.png)](/docs/assets/1136-cherokee-putty-03-saved-session.png)

Click "Open" to connect to your server and start the tunnel. You may receive a warning similar to the one shown here:

[![An SSH key alert in PuTTY.](/docs/assets/1137-cherokee-putty-04-alert.png)](/docs/assets/1137-cherokee-putty-04-alert.png)

Click "Yes" to continue, and log into your Linode as you normally would. As long as the SSH session is open you'll be able to navigate to `http://localhost:9090` in your web browser to access the Cherokee admin panel via the secure tunnel.

## Conclusion

Be sure to stop `cherokee-admin` using the `killall` command shown above once you're done configuring your system. Congratulations, you've successfully installed the Cherokee web server on your Linode!
