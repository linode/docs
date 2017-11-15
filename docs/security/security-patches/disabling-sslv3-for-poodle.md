---
author:
  name: Dave Russell
  email: drussell@linode.com
description: 'Instructions on disabling SSLv3 to protect against the POODLE vulnerability'
keywords: ["sslv3", "poodle", "security", "patch", "ubuntu", "debian", "centos", "fedora"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2014-10-20
modified_by:
  name: Dave Russell
published: 2014-10-15
title: Disabling SSLv3 for POODLE
---

Padding Oracle On Downgraded Legacy Encryption (POODLE) was released with the CVE identifier of [CVE-2014-3566](http://web.nvd.nist.gov/view/vuln/detail?vulnId=CVE-2014-3566). The vulnerability was found in SSL protocol 3.0, unlike [Heartbleed](/docs/security/security-patches/patching-openssl-for-the-heartbleed-vulnerability) which was found in OpenSSL.

SSL protocol 3.0 makes use of CBC-mode ciphers that allow for man-in-the-middle attacks using padding-oracle stacks. These attacks target the CBC ciphers to retrieve plain-text output from otherwise encrypted information.

There is some good news. Most connections are using TLS and not SSL. However, sometimes there are problems negotiating a TLS session, and then the web servers, browsers, and other applications must downgrade to SSL.

In order to resolve this issue, we must disable SSLv3 for applications. Unfortunately, there is no way to do this for an entire server at once. You will need to edit each individual configuration separately.


## The Impact of Disabling SSLv3

There's little impact for most people in disabling SSLv3 because they are not relying on SSLv3 to make connections via SSL/TLS. The large majority relies on TLS.

In the future, browsers such as Google Chrome and FireFox will have SSLv3 disabled at release. It is also advisable to disable SSLv3 on home browsers, not only server applications.

## Testing for SSLv3

There are several ways to determine if a service running over SSL will allow SSLv3. An easy method is to use the OpenSSL command line client. Run the command:

    openssl s_client -connect example.com:443 -ssl3

Remember to replace `example.com` with your domain or IP address, and `443` with any alternate port you may be using for your SSL connection. Check the output for the text:

    routines:SSL3_READ_BYTES:sslv3 alert handshake failure

If you see this, the service you have tested does not support SSLv3. It is safe from the vulnerability.

## Disabling SSLv3

Unfortunately, there is no simple way to go about this. There's no patch to install, and the only way to resolve this is to disable SSLv3 in any application that may use it.

While we do not know the configuration of your Linode, we would be happy to assist you via support ticket if you have any questions about disabling SSLv3 on a specific application that is not provided below.

The POODLE vulnerability only works if the browser of the client and the server's connection are both supporting SSLv3. Therefore, by disabling SSLv3 on your system, you are also protecting your client(s) from the vulnerability.

### Apache

If you're running an Apache web server that currently allows SSLv3, you will need to edit the Apache configuration. On Debian and Ubuntu systems the file is `/etc/apache2/mods-available/ssl.conf`. On CentOS and Fedora the file is `/etc/httpd/conf.d/ssl.conf`. You will need to add the following line to your Apache configuration with other SSL directives.

	SSLProtocol All -SSLv2 -SSLv3

This will allow all protocols except SSLv2 and SSLv3. You can test your configuration change with the command:

    apachectl configtest

 You will then need to restart your Apache instance. On Ubuntu and Debian:

	sudo service apache2 restart

On CentOS and Fedora:

    systemctl restart httpd

For more information about configuring Apache to disallow SSLv2 and SSLv3, please see their [Mod_SSL Documentation](https://httpd.apache.org/docs/2.2/mod/mod_ssl.html#sslprotocol)

### Apache on cPanel/WHM

cPanel/WHM does not allow you to edit the Apache configuration files, and will overwrite most changes that are made to them. However, cPanel/WHM does give the option of configuring SSL cipher suites for Apache within the control panel.

In order to change the Apache cipher suites, follow these steps:

1.  In WHM, type `apache` into the left-hand sidebar's search field. You will see `Apache Configuration` in the menu list. After clicking `Apache Configuration`, navigate to `Global Configuration`. It is the first option on the page in cPanel 11.44+.

2.  The first option is `SSL Cipher Suite`, and you will need to modify the current SSL Cipher Suite to include `-SSLv3`. An example of this is shown below.

	ALL:!ADH:RC4+RSA:+HIGH:+MEDIUM:-LOW:-SSLv2:-SSLv3:-EXP:!kEDH

3.  After saving the page, you will be asked to rebuild and restart Apache. Your changes should take effect after Apache has been rebuilt and restarted.

### NGINX

If you're running an NGINX web server that currently uses SSLv3, you need to edit the NGINX configuration (`nginx.conf`). You will need to add the following line to your `server` directive:

	ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

This will deactivate SSLv3 from being used on NGINX. If you're unable to find the server directive in `nginx.conf`, you may need to locate your VirtualHost configuration file.

You will also need to restart your NGINX server:

	sudo service nginx restart

For more information about NGINX's SSL protocol setting, please see their [NGX HTTP SSL Module Documentation](http://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_protocols).

### Hiawatha

If you're using the security-focused [Hiawatha web server](https://www.hiawatha-webserver.org/), it's likely that SSLv3 is already disabled by default. But if for some reason you're running an older version that does allow SSLv3, you can use the `MinSSLversion` setting in `hiawatha.conf`:

	MinSSLversion = TLS1.0
	# or TLS1.1 or TLS1.2

Then restart Hiawatha. For example, in Debian or Ubuntu:

	sudo service hiawatha restart

For more information on Hiawatha's configuration settings, see the [manual page](https://www.hiawatha-webserver.org/manpages).

### Postfix SMTP

If your Postfix installation is set up for `opportunistic SSL`, which means that encryption is not enforced and plain text is accepted, you do not need to change anything. However, if you are running Postfix in `mandatory SSL` mode, you will need to adjust your configuration to reflect the following change:

	smtpd_tls_mandatory_protocols=!SSLv2,!SSLv3

You'll want to look in the `# TLS parameters` section of `/etc/postfix/main.cf`. This will force Postfix SMTP to not use SSLv3 or SSLv2. You will also need to restart Postfix:

	sudo service postfix restart

For more information about Postfix's `smtpd_tls_mandatory_protocols` setting, please see their [Postfix Configuration Parameters](http://www.postfix.org/postconf.5.html#smtpd_tls_mandatory_protocols) documentation.

{{< note >}}
The Postfix documentation has not yet been adjusted to disallow SSLv3.
{{< /note >}}

### Dovecot

This will only work in Dovecot versions 2.1 and above. Add the following line to `/etc/dovecot/local.conf` or a new file in `/etc/dovecot/conf.d/10-ssl.conf`:

	ssl_protocols = !SSLv2 !SSLv3

Then restart Dovecot:

	sudo service dovecot restart

If you are running a version of Dovecot before 2.1, you will need to edit the source code of Dovecot.

### HAProxy

In order to disable SSLv3 in HAProxy, you must be using HAProxy 1.5+, as SSL is not supported in earlier versions of HAProxy. Edit the `/etc/haproxy.cfg` file and find the line that starts with `bind` and refers to port 443 (SSL). Append that line with `no-sslv3`.

An example of this line would be:

	bind :443 ssl crt <crt> ciphers <ciphers> no-sslv3

You can learn more about HAProxy's `no-sslv3` cipher in their [HAProxy Configuration Manual](https://cbonte.github.io/haproxy-dconv/configuration-1.5.html#5.1-no-sslv3).

### OpenVPN

According to a forum posted on [OpenVPN](https://forums.openvpn.net/topic17268.html), OpenVPN has announced that, because they use TLSv1.0, their platform is not vulnerable to POODLE.

