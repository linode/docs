---
author:
  name: Hao Deng
  email: dommyet@gmail.com
description: 'A guide to configuring the auto configuration server for Thunderbird Debian 8.'
keywords: 'thunderbird, autoconfiguration, debian, debian 8, mail client'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
title: Configure Thunderbird Autoconfiguration Server on Debian 8
external_resources:
 - '[Autoconfiguration in Thunderbird](https://developer.mozilla.org/en-US/docs/Mozilla/Thunderbird/Autoconfiguration)'
 - '[How to create a configuration file](https://developer.mozilla.org/en-US/docs/Mozilla/Thunderbird/Autoconfiguration/FileFormat/HowTo)'
---

Mozilla Thunderbird is a free, open source, cross-platform email, news, and chat client developed by the Mozilla Foundation. The **Autoconfiguration** function makes the client setup process a lot more easier by reading a small configuration file on the server, saving your time of entering server information such as **Server Address**, **IMAP port** or **Encryption Method** manually. In this guide, we are going to setup the actual server that serve the configuration file mentioned above.

 {: .note }
>
> This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Privileges](/docs/tools-reference/linux-users-and-groups) guide.

## Installation

Update the system and install Nginx from the repositories.

1.  First, install the most recent system updates:

        sudo apt-get update
        sudo apt-get upgrade

2.  Install Nginx:

        sudo apt-get install nginx

## Configure the Server

To provide access the configuration file, configure the settings to match your Linode and domain settings.

1.  By default, the web root of Nginx is `/var/www`, we are going to create a new folder named `autoconfig` and another folder inside named `mail` to store the configuration file.

        sudo mkdir /var/www/autoconfig
        sudo mkdir /var/www/autoconfig/mail

2.  Create a configuration file of Nginx to add a new virtual host as shown below. Edit the `server_name` field to match your Linode and domain settings:

    {: .file }
    /etc/nginx/sites-available/autoconfig
    :   ~~~ nginx
        #
        # Mozilla auto configuration server
        #

        server {
          listen 80;
          listen [::]:80;
          server_name autoconfig.*;
          root /var/www/autoconfig;

          location ~ /\. {
            deny all;
          }
        }
    ~~~

    {: .note }
    >
    > Assume your mail server's FQDN is `mail.example.com`, however in this case the `server_name` is set to `autoconfig.*` instead of `autoconfig.example.com`. This is because if you are running a mail server for other domains, for example `client.com`, the administrator of that domain could set a CNAME record pointing `autoconfig.client.com` to `autoconfig.example.com` in order to get the Autoconfiguration function available. Therefore you want an asterisk to catch all incoming requests.

3.  Prepare the configuration File named `config-v1.1.xml`. Edit the fields to match your actual settings:

    {: .file }
    /var/www/autoconfig/mail/config-v1.1.xml
    :   ~~~ xml
        <clientConfig version="1.1">
          <emailProvider id="example.com">
            <domain>example.com</domain>
            <displayName>Example Mail Service</displayName>
            <displayShortName>Example Mail</displayShortName>
            <incomingServer type="imap">
              <hostname>mail.example.com</hostname>
              <port>143</port>
              <socketType>STARTTLS</socketType>
              <authentication>password-cleartext</authentication>
              <username>%EMAILADDRESS%</username>
            </incomingServer>
            <incomingServer type="imap">
              <hostname>mail.example.com</hostname>
              <port>993</port>
              <socketType>SSL</socketType>
              <authentication>password-cleartext</authentication>
              <username>%EMAILADDRESS%</username>
            </incomingServer>
            <incomingServer type="pop3">
              <hostname>mail.example.com</hostname>
              <port>110</port>
              <socketType>STARTTLS</socketType>
              <authentication>password-cleartext</authentication>
              <username>%EMAILADDRESS%</username>
            </incomingServer>
            <incomingServer type="pop3">
              <hostname>mail.example.com</hostname>
              <port>995</port>
              <socketType>SSL</socketType>
              <authentication>password-cleartext</authentication>
              <username>%EMAILADDRESS%</username>
            </incomingServer>
            <outgoingServer type="smtp">
              <hostname>mail.example.com</hostname>
              <port>587</port>
              <socketType>STARTTLS</socketType>
              <authentication>password-cleartext</authentication>
              <username>%EMAILADDRESS%</username>
            </outgoingServer>
            <documentation url="https://www.example.com">
              <descr lang="en">Generic settings page</descr>
            </documentation>
          </emailProvider>
        </clientConfig>
    ~~~

4.  Enable the new virtual host:

        sudo ln -s /etc/nginx/sites-available/autoconfig /etc/nginx/sites-enabled/autoconfig

5.  Reload Nginx:

        sudo service nginx reload

## DNS

In order to get the Autoconfiguration function work, we need to properly setup an A record, and an AAAA record if you have IPv6 as well, for the subdomain `autoconfig`. They should be pointed to the server which serves the configuration file. Below is an example, please adjust the settings accordingly.

    autoconfig.example.com.	300	IN	A     12.34.56.78
    autoconfig.example.com.	300	IN	AAAA	2001:0db8:85a3:0000:0000:8a2e:0370:7334

## Using Thunderbird

After finishing all the settings above, it is an easy task to use Thunderbird for the first time. Simply enter your email address into the `Email address` box in `Mail Account Setup` of Thunderbird then click `Continue`, Thunderbird will automatically retrieve settings via the configuration server we just set up before.
