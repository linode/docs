---
slug: squid-http-proxy-ubuntu-18-04
author:
  name: Linode
  email: docs@linode.com
description: This guide shows how to use Squid to create an HTTP proxy server on your Linode running Ubuntu 18.04.
og_description: This guide shows how to use Squid to create an HTTP proxy server on your Linode running Ubuntu 18.04.
keywords: ["squid", "proxy", "ubuntu", "18.04", "http"]
tags: ["proxy","web server","ubuntu"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-04-14
modified: 2020-04-14
image: Creating_an_HTTP_Proxy_Using_Squid_on_Ubuntu1804_1200x631.png
modified_by:
  name: Rajakavitha Kodhandapani
title: 'How to Create an HTTP Proxy Using Squid on Ubuntu 18.04'
h1_title: 'Creating an HTTP Proxy Using Squid on Ubuntu 18.04'
external_resources:
 - '[Squid Official Site](http://www.squid-cache.org/)'
 - '[Configure Proxy on Windows](https://docs.microsoft.com/en-us/windows/security/threat-protection/microsoft-defender-atp/configure-proxy-internet)'
 - '[Proxy Server Settings on macOS](https://support.apple.com/en-in/guide/mac-help/mchlp2591/mac)'
 - '[Connection Settings in Firefox](https://support.mozilla.org/en-US/kb/connection-settings-firefox)'
relations:
    platform:
        key: install-squid-proxy
        keywords:
            - distribution: Ubuntu 18.04
aliases: ['/web-servers/squid/squid-http-proxy-ubuntu-18-04/']
---

This guide will show you how to create your own HTTP proxy using Squid, a highly customizable proxy/cache application, on Ubuntu 18.04. An HTTP proxy acts as an intermediary between you and the internet. While connected to your Squid HTTP proxy, you will be able to:

-   Anonymously access internet services.
-   Bypass certain regional and local network restrictions.

{{< note >}}
The traffic passed from your client to your Squid HTTP proxy will not be encrypted and will still be visible on your local network. If you are looking for a solution that offers greater security, you may want to look at our guides on [Setting up an SSH Tunnel](/docs/guides/setting-up-an-ssh-tunnel-with-your-linode-for-safe-browsing/) or [Deploy OpenVPN Access Server with Marketplace Apps](/docs/products/tools/marketplace/guides/openvpn/).
{{< /note >}}

## Install Squid

1.  Secure your Linode by completing the instructions in our guide on [Securing Your Server](/docs/guides/set-up-and-secure/), including adding a limited user account and configuring a firewall.

    {{< note >}}
This guide is written for a limited, non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, you can check our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

1.  Ensure that your system is up-to-date:

        sudo apt-get update && sudo apt-get upgrade

1.  Install Squid using the `apt` software package manager:

        sudo apt-get install squid

1.  Copy the original configuration file to keep as a backup:

        sudo cp /etc/squid/squid.conf /etc/squid/squid.conf.default

    {{< note >}}
The Squid configuration file includes comprehensive documentation in its commented lines, along with several uncommented rules that will remain active. These default rules should not be modified while you are following this guide. To gain a deeper understanding of Squid's options and default settings, you can review the full configuration file.
{{< /note >}}

## Configure Client Access

Now that you have Squid installed on your Linode, you can configure ways for it to accept connections and serve as an HTTP proxy. The following sections provide different ways for your Squid HTTP proxy to authenticate client connections. You can configure Squid to use either or both authentication methods.

### IP Address Authentication

A simple way to use Squid as an HTTP proxy is to use a client's IP address for authentication.

1.  Edit the Squid configuration file and add the following lines at the beginning of the file:

    {{< file "/etc/squid/squid.conf" >}}
acl client src 192.0.2.0 # Home IP
http_access allow client
{{< /file >}}

    Replace `client` with a name that identifies the client computer that will connect to your Squid HTTP proxy, then replace `192.0.2.0` with the client computer's IP address. You can also update the optional comment `# Home IP` to further describe the client.

1.  Alternatively, you can configure multiple clients by adding new `acl` lines to `/etc/squid/squid.conf` and including them in the `http_access allow` line as follows:

    {{< file "/etc/squid/squid.conf" >}}
acl client1 src 192.0.2.0 # Home IP
acl client2 src 192.0.2.1 # Work IP
http_access allow client1 client2
{{< /file >}}

    Replace `client1` and `client2` with names that identify the client computers, then replace `192.0.2.0` and `192.0.2.1` with their corresponding IP addresses. Update the optional comments `# Home IP` and `# Work IP` with accurate descriptions to help keep track of multiple clients. Access to the proxy is granted by adding the names defined by each `acl` to the `http_access allow` line.

### User/Password Authentication

You can also configure your Squid HTTP proxy to accept authentication with usernames and passwords.

1.  Install `htpasswd` by installing the Apache utility programs. If you have installed Apache on your Linode, you will already have it and can skip this step.

        sudo apt-get install apache2-utils

1.  Create a file to store Squid users and passwords:

        sudo touch /etc/squid/squid_passwd

1.  Change ownership of the password file:

        sudo chown proxy /etc/squid/squid_passwd

1.  Create a username password pair, replacing `user1` with the name of the user you'd like to add:

        sudo htpasswd /etc/squid/squid_passwd user1

    You will be prompted to create a password for this user:

    {{< output >}}
New password:
Re-type new password:
Adding password for user user1
{{< /output >}}

    You can repeat this step at any time to create new users.

1.  Check the location of the `nsca_auth` file:

        sudo dpkg -L squid | grep ncsa_auth

1.  Edit the Squid configuration file and add the following lines at the beginning of the file:

    {{< note >}}
Ensure that you update `/usr/lib/squid/basic_ncsa_auth` below with the location of the `nsca_auth` file that you checked in the previous step.
{{< /note >}}

    {{< file "/etc/squid/squid.conf" >}}
auth_param basic program /usr/lib/squid/basic_ncsa_auth /etc/squid/squid_passwd
acl ncsa_users proxy_auth REQUIRED
http_access allow ncsa_users
{{< /file >}}

1.  To remove a user's access to the proxy, you must delete the corresponding entry in the `squid_passwd` file. Each user is represented in the file on a single line in the format of `user:passwordhash`:

    {{< file "/etc/squid/squid_passwd" >}}
user1:\$p948w3nvq3489v6npq396g user2:\$q3cn478554387cq34n57vn
{{< /file >}}

    If you are using Nano, the command `Control+k` will remove the entire line where the cursor rests.

    Once you've saved and exited the file, complete user removal by restarting Squid:

        sudo systemctl restart squid

### Combined Authentication

You can combine authentication methods using the same `acl` definitions that you have added in the previous two sections by using a single `http_access` rule.

1.  Remove any previous `http_access` lines you have added.

1.  Edit the Squid configuration file so that the lines you have added at the beginning of the file follow this form:

    {{< file "/etc/squid/squid.conf" >}}
acl client1 src 192.0.2.0 # Home IP
acl client2 src 192.0.2.1 # Work IP
auth_param basic program /usr/lib/squid/basic_ncsa_auth /etc/squid/squid_passwd
acl ncsa_users proxy_auth REQUIRED
http_access allow client1 client2 ncsa_users
{{< /file >}}

    {{< note >}}
Take care to avoid using multiple `http_access` rules when combining authentication methods, as Squid will follow the rules in the order that they appear. By using a single `http_access` rule for your `acl` definitions, you will ensure that several authentication methods will apply to each client that attempts to connect to your Squid HTTP proxy.
{{< /note >}}

## Anonymize Traffic

Here, you will add rules to mask client IP addresses from the servers that receive traffic from you Squid HTTP proxy. Without these rules, the originating client IP addresses may be passed on through the `X-Forwarded For` HTTP header.

Add the following lines at the beginning of the Squid configuration file:

{{< file "/etc/squid/squid.conf" >}}
forwarded_for off
request_header_access Allow allow all
request_header_access Authorization allow all
request_header_access WWW-Authenticate allow all
request_header_access Proxy-Authorization allow all
request_header_access Proxy-Authenticate allow all
request_header_access Cache-Control allow all
request_header_access Content-Encoding allow all
request_header_access Content-Length allow all
request_header_access Content-Type allow all
request_header_access Date allow all
request_header_access Expires allow all
request_header_access Host allow all
request_header_access If-Modified-Since allow all
request_header_access Last-Modified allow all
request_header_access Location allow all
request_header_access Pragma allow all
request_header_access Accept allow all
request_header_access Accept-Charset allow all
request_header_access Accept-Encoding allow all
request_header_access Accept-Language allow all
request_header_access Content-Language allow all
request_header_access Mime-Version allow all
request_header_access Retry-After allow all
request_header_access Title allow all
request_header_access Connection allow all
request_header_access Proxy-Connection allow all
request_header_access User-Agent allow all
request_header_access Cookie allow all
request_header_access All deny all
{{< /file >}}

## Enable Connections

Next, you will enable clients to connect to your Squid HTTP proxy.

1.  Save and exit the Squid configuration file.

1.  Restart Squid to enable the rules you have added:

        sudo systemctl restart squid

1.  Implement firewall rules to enable port `3128`, which is the default service port used by Squid:

        sudo ufw allow 3128/tcp

    You can find more information on configuring firewall rules for Ubuntu in our guide on [How to Configure a Firewall with UFW](/docs/guides/configure-firewall-with-ufw/).

## Connect to your Squid HTTP Proxy

Your Squid HTTP proxy is now ready to accept client connections and anonymously handle internet traffic.

At this point, you can configure your local browser or operating system's network settings to use your Linode as an HTTP proxy. The settings to do this will vary depending on your OS and browser. Instructions for certain OS and browser settings are located in the [More Information](#more-information) section below.

Generally, connecting to your Squid HTTP proxy requires the following information:

-   The IP address or domain name associated with your Linode.
-   The port that is being used by Squid. The default port is `3128`.
-   A username and password if you have configured them for authentication.

Once you have established your OS or browser settings, test the connection by pointing your browser at a website that tells you your IP address, such as:

-   [ifconfig.me](http://ifconfig.me)
-   [WhatIsMyIP.com](http://www.whatismyip.com/)
-   [Googling "what is my ip"](https://www.google.com/search?q=what+is+my+ip)

The result should display your Linode's IP address instead of the IP address of your client computer.
