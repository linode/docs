---
author:
  name: Linode
  email: docs@linode.com
description: This guide show how to use Squid to create an HTTP proxy server on your Linode running Centos 8.
og_description: This guide show how to use Squid to create an HTTP proxy server on your Linode running Centos 8.
keywords: ["squid", "proxy", "centos", "8", "http"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-04-14
modified: 2020-04-14
modified_by:
  name: Rajakavitha Kodhandapani
title: 'How to Create an HTTP Proxy Using Squid on CentOS 8'
h1_title: 'Creating an HTTP Proxy Using Squid on CentOS 8'
external_resources:
 - '[Squid Official Site](http://www.squid-cache.org/)'
 - '[Configure Proxy on Windows](https://docs.microsoft.com/en-us/windows/security/threat-protection/microsoft-defender-atp/configure-proxy-internet)'
 - '[Proxy Server Settings on macOS](https://support.apple.com/en-in/guide/mac-help/mchlp2591/mac)'
---

Squid is a proxy/cache application with a variety of configurations and uses. This guide will cover using Squid as an HTTP proxy. Please note that unless you follow the last section of the guide [Anonymizing Traffic](#anonymizing-traffic), this will not anonymize your traffic to the outside world, as your originating IP address will still be sent in the X-Forwarded-For header. Additionally, the traffic is not encrypted and will still be visible on your local network. If you are looking for a solution that offers greater security, you may want to look at our guide to [Setting up an SSH Tunnel](/docs/networking/ssh/setting-up-an-ssh-tunnel-with-your-linode-for-safe-browsing) or [Deploy OpenVPN Access Server with One-Click Apps](/docs/platform/one-click/one-click-openvpn/).

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Installing Squid

1. Squid is available in the CentOS repositories. To ensure your system is up-to-date and install Squid run the following commands:

        sudo yum update
        sudo yum upgrade
        sudo yum install squid

1. Copy the original configuration file to keep as a backup:

        sudo cp /etc/squid/squid.conf /etc/squid/squid.conf.default

## Configuring Squid as an HTTP proxy

Squid Proxy can be used as an HTTP proxy to bypass local network restrictions, or mask your true location to the world.

### Basic Setup

This section covers the easiest way to use Squid as an HTTP proxy, using only the client Linode's IP address for authentication instead of your local IP address.

1. Edit the Squid configuration file and add the following lines at the beginning of the file:

    {{< file "/etc/squid/squid.conf" >}}
acl client src 192.0.2.12 # Home IP
http_access allow client
{{< /file >}}

    Be sure to replace **client** with a name identifying the connecting computer, and **192.0.2.12** with its local IP address. The comment `# Home IP` isn't required, but comments can be used to help identify clients.

1. Once you've saved and exited the file, restart Squid:

        sudo systemctl restart squid

1. The default service port used by Squid is `3128`. To enable the port:

        sudo firewall-cmd --add-service=squid --permanent
        sudo firewall-cmd --reload

1. At this point, you can configure your local browser or operating system's network settings to use your Linode as an HTTP proxy on port `3128`. How to do this will depend on your choice of OS and browser. Once you've made the change to your settings, test the connection by pointing your browser at a website that tells you your IP address, such as [ifconfig](http://ifconfig.me), [What is my IP](http://www.whatismyip.com/), or by Googling [What is my ip](https://www.google.com/search?q=what+is+my+ip).

1. Additional clients can be defined by adding new `acl` lines to `/etc/squid/squid.conf`. Access to the proxy is granted by adding the name defined by each `acl` to the `http_access allow` line.

### Advanced Authentication

The following configuration allows for authenticated access to the Squid proxy service using usernames and passwords.

1. You will need the `htpasswd` utility. If you've installed Apache on your Linode, you will already have it. Otherwise run:

        sudo yum install httpd-tools

1. Create a file to store Squid users and passwords, and change ownership:

        sudo touch /etc/squid/squid_passwd
        sudo chown squid /etc/squid/squid_passwd

1. Create a username password pair:

        sudo htpasswd /etc/squid/squid_passwd user1

    Replace **user1** with a username. You will be prompted to create a password for this user:

    {{< output >}}
New password:
Re-type new password:
Adding password for user user1
{{< /output >}}

    You can repeat this step at any time to create new users.

1. Check the location of the `nsca_auth` file:

        sudo rpm -ql squid | grep ncsa_auth

1. Edit the Squid configuration file and add the following lines at the beginning of the file:

    {{< note >}}Ensure that you update `/usr/lib64/squid/basic_ncsa_auth` below with the location of the `nsca_auth` file.{{< /note >}}
    {{< file "/etc/squid/squid.conf" >}}
auth_param basic program /usr/lib64/squid/basic_ncsa_auth /etc/squid/squid_passwd
acl ncsa_users proxy_auth REQUIRED
http_access allow ncsa_users
{{< /file >}}

1. Once you've saved and exited the file, restart Squid:

        sudo systemctl restart squid

1. The default service port used by Squid is `3128`. To enable the port:

        sudo firewall-cmd --add-service=squid --permanent
        sudo firewall-cmd --reload

1. At this point, you can configure your local browser or operating system's network settings to use your Linode as an HTTP proxy on port `3128`. You will need to specify that the server requires authentication, and provide the username and password. How to do this will depend on your choice of OS and browser. Once you've made the settings change, test the connection by pointing your browser at a website that tells you your IP address, such as [ifconfig](http://ifconfig.me), [What is my IP](http://www.whatismyip.com/), or by Googling [What is my ip](https://www.google.com/search?q=what+is+my+ip).

1. To remove a user's access to the proxy, you must delete their entry in the `squid_passwd` file. Each user is represented in the file on a single line in the format of `user:passwordhash` :

    {{< file "/etc/squid/squid\\_passwd" >}}
user1:gh48gfno user2:9b83v5hd
{{< /file >}}

1. If you are using Nano, the command `Control+k` will remove the entire line where the cursor rests. Once you've saved and exited the file, restart Squid:

        sudo systemctl restart squid

## Anonymizing Traffic

In order to mask your IP address from servers you connect to, you will need to add the following lines to the Squid configuration file.

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

Once you've saved and exited the file, restart Squid:

    sudo systemctl restart squid
