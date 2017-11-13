---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Instructions for getting started with the Cherokee web server on Fedora 13.'
keywords: ["cherokee fedora 13", "cherokee web sever", "cherokee", "fedora 13"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/cherokee/installing-cherokee-fedora-13/','websites/cherokee/websites-with-the-cherokee-web-server-on-fedora-13/']
modified: 2011-05-09
modified_by:
  name: Linode
published: 2010-05-27
title: Websites with the Cherokee Web Server on Fedora 13
---



Cherokee is a fast, flexible web server for POSIX compliant operating systems such as Linux. It's designed to be easy to administer, and includes support for a wide range of common web server functions. This tutorial explains how to install and configure the Cherokee web server on Fedora 13. Installation will be performed through the terminal; please make sure you are logged into your Linode as root via SSH.

It is assumed that you already have a working and up to date Fedora 13 system. If you have not followed our [getting started](/docs/getting-started/) guide, we recommend that you do so prior to following these instructions.

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

# Install Cherokee

Enter the following commands to update your system and install the Cherokee web server, its documentation and some useful modules (including support for SSL).

    yum update
    yum install cherokee rrdtool openssl
    chkconfig --levels 35 cherokee on

Several packages will be installed in addition to the main server package. You may visit your Linode's IP address (or domain name, if you have it pointed to the IP) in a web browser to verify that Cherokee is running. You should see the default Cherokee test page.

# Configure Cherokee

The Cherokee web server includes an easy to use, comprehensive administration interface. This interface, known as `cherokee-admin`, is the recommended means of administering your web server.

Start `cherokee-admin` by issuing the following command:

    cherokee-admin -b &

This instructs the administration program to bind to all IP addresses so it may be reached remotely. It will be launched in the background, so you'll still be able to use your SSH session. You should see output similar to the following:

    root@hostname:~# cherokee-admin -b &
    [1] 2154
    root@hostname:~#
    Login:
      User:              admin
      One-time Password: eFxccWtngt75ALZg

    Web Interface:
      URL:               http://localhost:9090/

    Cherokee Web Server 0.99.39 (Feb  2 2010): Listening on port ALL:9090, TLS
    disabled, IPv6 disabled, using epoll, 4096 fds system limit, max. 2041
    connections, caching I/O, single thread

### Secure Admin Panel Access

Instead of binding to all interfaces on your Linode, you may wish to bind to localhost and use SSH port forwarding to securely reach the administration system from your workstation. To do so, issue the following commands to launch `cherokee-admin` and set up an SSH tunnel. The first command is not required if you haven't already launched `cherokee-admin`. You may need to install the `killall` command first by issuing `apt-get install psmisc` on your Linode.

On your Linode:

    killall cherokee-admin
    cherokee-admin &

In a terminal window on your local workstation (MacOS X, Linux, BSD, etc) :

    ssh -L 9090:localhost:9090 root@12.34.56.78 -N

Replace "12.34.56.78" with your Linode's IP address. You may now visit `http://localhost:9090` in your web browser via the SSH tunnel. To stop the tunnel, simply press `Ctrl+C` in your local terminal window.

You'll be presented with the Cherokee administration panel, which you may use to configure websites and specify configuration options. You'll still need to log in using the username and one-time password provided when you launched `cherokee-admin`.

[![The cherokee-admin web server administration interface running on a Fedora 13 Linode.](/docs/assets/234-cherokee-fedora-13-admin-01-home.png)](/docs/assets/234-cherokee-fedora-13-admin-01-home.png)

### Secure Admin Panel Access on Windows

You can use [PuTTY](http://www.chiark.greenend.org.uk/~sgtatham/putty/) to set up a secure SSH tunnel for Cherokee administration. Enter your Linode's public IP address in the session tab:

[![Session information for PuTTY.](/docs/assets/235-cherokee-putty-01-session.png)](/docs/assets/235-cherokee-putty-01-session.png)

Expand the "Connection -\> SSH" menus to select the "Tunnel" configuration page. Enter the values shown here:

[![Configuring an SSH tunnel for Cherokee administration in PuTTY.](/docs/assets/236-cherokee-putty-02-tunnel.png)](/docs/assets/236-cherokee-putty-02-tunnel.png)

Back on the session tab, enter "Cherokee Admin" in the "Saved Sessions" field and click "Save" to retain your settings for future use.

[![Saving an SSH session for Cherokee administration in PuTTY.](/docs/assets/237-cherokee-putty-03-saved-session.png)](/docs/assets/237-cherokee-putty-03-saved-session.png)

Click "Open" to connect to your server and start the tunnel. You may receive a warning similar to the one shown here:

[![An SSH key alert in PuTTY.](/docs/assets/238-cherokee-putty-04-alert.png)](/docs/assets/238-cherokee-putty-04-alert.png)

Click "Yes" to continue, and log into your Linode as you normally would. As long as the SSH session is open you'll be able to navigate to `http://localhost:9090` in your web browser to access the Cherokee admin panel via the secure tunnel.

# Conclusion

Be sure to stop `cherokee-admin` using the `killall` command shown above once you're done configuring your system. Congratulations, you've successfully installed the Cherokee web server on your Linode!

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Cherokee Web Server Documentation](http://www.cherokee-project.com/doc/)
