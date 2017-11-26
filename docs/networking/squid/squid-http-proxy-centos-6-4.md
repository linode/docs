---
author:
  name: Alex Fornuto
  email: afornuto@linode.com
description: 'Use Squid to create an HTTP proxy server on your Linode running Centos 6.4'
keywords: ["squid", "proxy", "centos", "6.4", "http"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2014-03-03
modified_by:
  name: Alex Fornuto
published: 2014-03-03
title: 'Creating an HTTP Proxy Using Squid on CentOS 6.4'
external_resources:
 - '[Squid Official Site](http://www.squid-cache.org/)'
---

Squid is a proxy/cache application with a variety of configurations and uses. This guide will cover using Squid as an HTTP proxy. Please note that unless you follow the last section of the guide [Anonymizing Traffic](#anonymizing-traffic), this will not anonymize your traffic to the outside world, as your originating IP address will still be sent in the X-Forwarded-For header. Additionally, the traffic is not encrypted and will still be visible on your local network. If you are looking for a solution that offers greater security, you may want to look at our guide to [Setting up an SSH Tunnel](/docs/networking/ssh/setting-up-an-ssh-tunnel-with-your-linode-for-safe-browsing) or [Deploy VPN Services with OpenVPN](/docs/networking/vpn/secure-communications-with-openvpn-on-centos-6).

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Installing Squid

1.  Squid is available in the CentOS repositories. To ensure your system is up-to-date and install Squid run the following commands:

        sudo yum update
        sudo yum install squid

2.  Copy the original configuration file to keep as a backup:

        sudo cp /etc/squid/squid.conf /etc/squid/squid.conf.default

## Configuring Squid as an HTTP proxy

Squid Proxy can be used as an HTTP proxy to bypass local network restrictions, or mask your true location to the world.

### Basic Setup

This section covers the easiest way to use Squid as an HTTP proxy, using only the client IP address for authentication.

1.  Edit the Squid configuration file and add the following lines:

    {{< file-excerpt "/etc/squid/squid.conf" >}}
acl client src 12.34.56.78 # Home IP http\_access allow client

{{< /file-excerpt >}}


Be sure to replace **client** with a name identifying the connecting computer, and **12.34.56.78** with your local IP address. The comment `# Home IP` isn't required, but comments can be used to help identify clients.

2.  Once you've saved and exited the file, start Squid:

        sudo service squid restart

3.  At this point you can configure your local browser or operating system's network settings to use your Linode as an HTTP proxy. How to do this will depend on your choice of OS and browser. Once you've made the change to your settings, test the connection by pointing your browser at a website that tells you your IP address, such as [ifconfig](http://ifconfig.me), [What is my IP](http://www.whatismyip.com/), or by Googling [What is my ip](https://www.google.com/search?q=what+is+my+ip).
4.  Additional clients can be defined by adding new `acl` lines to `/etc/squid/squid.conf`. Access to the proxy is granted by adding the name defined by each `acl` to the `http_access allow` line.

### Advanced Authentication

The following configuration allows for authenticated access to the Squid proxy service using usernames and passwords.

1.  You will need the `htpasswd` utility. If you've installed Apache on your Linode, you will already have it. Otherwise run:

        sudo yum install httpd-tools

2.  Create a file to store Squid users and passwords, and change ownership:

        sudo touch /etc/squid/squid_passwd
        sudo chown squid /etc/squid/squid_passwd

3.  Create a username password pair:

        sudo htpasswd /etc/squid/squid_passwd user1

	Replace **user1** with a username. You will be prompted to create a password for this user:

		New password:
		Re-type new password:
		Adding password for user user1

	You can repeat this step at any time to create new users.

4.  Edit the Squid configuration file and add the following lines:

	{{< file-excerpt "/etc/squid/squid.conf" >}}
auth_param basic program /usr/lib64/squid/ncsa_auth /etc/squid/squid_passwd
acl ncsa_users proxy_auth REQUIRED
http_access allow ncsa_users


{{< /file-excerpt >}}

5.  Once you've saved and exited the file, restart Squid:

        sudo service squid restart

6.  At this point, you can configure your local browser or operating system's network settings to use your Linode as an HTTP proxy. You will need to specify that the server requires authentication, and provide the username and password. How to do this will depend on your choice of OS and browser. Once you've made the settings change, test the connection by pointing your browser at a website that tells you your IP address, such as [ifconfig](http://ifconfig.me), [What is my IP](http://www.whatismyip.com/), or by Googling [What is my ip](https://www.google.com/search?q=what+is+my+ip).
7.  To remove a user's access to the proxy, you must delete their entry in the `squid_passwd` file. Each user is represented in the file on a single line in the format of `user:passwordhash` :

	{{< file-excerpt "/etc/squid/squid\\_passwd" >}}
user1:gh48gfno user2:9b83v5hd
{{< /file-excerpt >}}

	If you are using Nano, the command `Control+k` will remove the entire line where the cursor rests. Once you've saved and exited the file, restart Squid:

		sudo service squid restart

## Anonymizing Traffic

In order to mask your IP address from servers you connect to, you will need to add the following lines to the Squid configuration file.

{{< file-excerpt "/etc/squid/squid.conf" >}}
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

{{< /file-excerpt >}}


Once you've saved and exited the file, restart Squid:

    sudo service squid restart
