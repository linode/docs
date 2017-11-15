---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Setting up an email and groupware server using Citadel on a Debian 6 (Squeeze) Linode.'
keywords: ["citadel debian 6", "citadel debian squeeze", "debian 6 mail server", "groupware", "email server"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['email/citadel/debian-6-squeeze/']
modified: 2011-11-09
modified_by:
  name: Linode
published: 2011-11-09
title: 'Email with Citadel on Debian 6 (Squeeze)'
---

Citadel is a groupware suite that provides system administrators with an easy method to set up and manage email, calendars, mailing lists and other collaboration tools. It is assumed that you have followed our [getting started guide](/docs/getting-started/). If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics).

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

# Install Citadel

Issue the following commands to install any outstanding package updates:

    apt-get update
    apt-get upgrade

Issue the following commands to install the `citadel-suite`, `spamassassin` and `amavisd-new` packages:

    apt-get install citadel-suite spamassassin amavisd-new

The installation process will prompt you for several configuration items. Recommended answers for these prompts are as follows.

**Please note:** The HTTP and HTTPS port options are particularly important. If you have already installed a web server package such as Apache or nginx that will use ports 80 and 443, please do *not* specify these ports for your Citadel installation.

-   Listen address - 0.0.0.0
-   Authentication method - Internal
-   Citadel administrator username - admin
-   Integration with Apache webservers - Internal
-   Webcit HTTP port - 80 if you are not running another web server, 8080 otherwise
-   Webcit HTTPS port - 443 if you are not running another web server, 4343 otherwise

If you need to reconfigure any of these options later, you can use the following command:

    /usr/lib/citadel-server/setup

Check the file `/etc/default/webcit` to make sure the installer correctly set your desired HTTP and HTTPS ports. You may need to update the following lines:

{{< file-excerpt "/etc/default/webcit" >}}
export WEBCIT_HTTPS_PORT='443'
export WEBCIT_HTTP_PORT='80'

{{< /file-excerpt >}}


Finally, edit the `/etc/mailname` file to reflect your system's fully qualified domain name:

{{< file "/etc/mailname" >}}
hostname.example.com

{{< /file >}}


# Enable Spamassassin Filtering

You'll need to edit the SpamAssassin configuration file to enable spamd:

{{< file-excerpt "/etc/default/spamassassin" >}}
# Change to one to enable spamd
ENABLED=1

{{< /file-excerpt >}}


Start the spamassassin service as follows:

    /etc/init.d/spamassassin start

Please note that you'll finish enabling SpamAssassin support within Citadel later in the "Notes" section.

# Configure SSL

Issue the following commands to back up the default Citadel SSL files.

    cd /etc/ssl/citadel
    mkdir backup
    mv citadel* backup

### Commercial Certificate Instructions

Issue the following commands to generate a key and certificate signing request.

    openssl req -new -nodes -newkey rsa:4096 -days 365 -keyout citadel.key -out citadel.csr
    chmod 600 citadel.key

As part of this process, you will be prompted to enter several values, as shown below. Please take special care to specify your server's fully qualified domain name for the "Common Name" setting.

    Country Name (2 letter code) [AU]:US
    State or Province Name (full name) [Some-State]:New Jersey
    Locality Name (eg, city) []:Galloway
    Organization Name (eg, company) [Internet Widgits Pty Ltd]:Example Org
    Organizational Unit Name (eg, section) []:Network Services
    Common Name (eg, YOUR name) []:hostname.example.com
    Email Address []:support@example.com
    Please enter the following 'extra' attributes
    to be sent with your certificate request
    A challenge password []:
    An optional company name []:

Submit the `citadel.csr` file to your SSL certificate provider for signing. They will send you a signed certificate file; save it as `/etc/ssl/citadel/citadel.cer`. Once this has been done, issue the following command to copy the required files to the webcit directory:

    cp -a citadel* /etc/ssl/webcit/

### Self-Signed Certificate Instructions

Issue the following commands to generate a key and certificate signing request.

    openssl req -new -nodes -newkey rsa:4096 -days 365 -keyout citadel.key -out citadel.csr
    chmod 600 citadel.key

As part of this process, you will be prompted to enter several values, as shown below. Please take special care to specify your server's fully qualified domain name for the "Common Name" setting.

    Country Name (2 letter code) [AU]:US
    State or Province Name (full name) [Some-State]:New Jersey
    Locality Name (eg, city) []:Galloway
    Organization Name (eg, company) [Internet Widgits Pty Ltd]:Example Org
    Organizational Unit Name (eg, section) []:Network Services
    Common Name (eg, YOUR name) []:hostname.example.com
    Email Address []:support@example.com
    Please enter the following 'extra' attributes
    to be sent with your certificate request
    A challenge password []:
    An optional company name []:

Issue the following command to create a self-signed certificate and copy required files to the webcit directory:

    openssl x509 -req -days 365 -in citadel.csr -signkey citadel.key -out citadel.cer
    cp -a citadel* /etc/ssl/webcit/

# Running Citadel

Customize the logon banner for your Citadel server by editing the `/etc/citadel/messages/hello` file:

{{< file "/etc/citadel/messages/hello" >}}
Welcome to ^humannode!

This logon banner resides in ^bbsdir/hello -- please customize it for your site.

{{< /file >}}


Issue the following commands to initialize Citadel.

    /etc/init.d/citadel restart
    /etc/init.d/webcit start

Visit the web interface in your web browser. Using our preceding example, the Web address to visit would resemble the following URL (append ":4343" if necessary):

    https://hostname.example.com

At this point, your email system should be fully functional and can be configured through the web interface. To finish enabling SpamAssassin support, select "Administration" in the control panel. Next, click "Domain names and Internet mail configuration". Enter "127.0.0.1" in the box for the SpamAssassin host.

# Lost Password Recovery

If you lose the password to your administrator account, issue the following command:

    /usr/lib/citadel-server/setup

When prompted for administrative account information, specify a new username and password. You may accept all other default settings. You should be able to log in as the new admin user. You may then reset the password for your original administrator account. After this is done, log back in as the original administrator and delete the temporary admin account.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Citadel Home Page](http://www.citadel.org/doku.php)
- [Citadel FAQ](http://www.citadel.org/doku.php?id=faq:start)
- [Citadel Documentation](http://www.citadel.org/doku.php?id=documentation:start)
- [Spamassassin Home Page](http://spamassassin.apache.org/)
- [Spamassassin Wiki](http://wiki.apache.org/spamassassin/)
- [Spamassassin Documentation](http://spamassassin.apache.org/doc.html)



