---
author:
  name: Brett Buchanan
  email: fullmetalsleeve@gmai.com
description: 'Use VestaCP to manage services on your CentOS Linux VPS.'
keywords: 'vestacp,vps control panel, linux,cpanel centos'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['web-applications/control-panels/cpanel/centos-7/','websites/cms/vestacp-on-centos-7/']
modified: Wednesday, January 6, 2016
published: 
title: VestaCP on CentOS7
external_resources:
 - '[VestaCP Home Page](http://vestacp.com/)'
 - '[VestaCP Docs](http://vestacp.com/docs/)'
---
[VestaCP](http://vestacp.com) is a Free Open Source Control panel for server systems. It can help ease the burden of common system administration tasks such as website creation, database deployment and management, and more. This guide will help you get up and running with [VestaCP](http://vestacp.com) on your CentOS Linode. This product **must** be installed on a freshly deployed, CentOS 7 Linode. These instructions should be performed as the "root" user via SSH.

{: .note}
- Before installing VestaCP, I assume that you've completed the [Getting Started](/docs/getting-started/) guide.
- If you are new to Linux server administration, I recommend the [Linode Beginner's Guide](/docs/beginners-guide/) and the article concerning [Systems Administration Basics](/docs/using-linux/administration-basics).

## DNS Prerequisites

VestaCP includes options for hosting your own DNS services. I generally recommend using [Linode DNS services](/docs/dns-guides/configuring-dns-with-the-linode-manager), as it provides a stable, redundant, and easily managed DNS platform. If you elect to run your own DNS services on a single Linode using VestaCP, please be aware that such a setup provides no redundancy.

If you plan to use a domain name for your nameservers that you will also be hosting DNS services for, then you'll need to ask your domain name registrar to create [DNS glue records](http://en.wikipedia.org/wiki/Domain_Name_System#Circular_dependencies_and_glue_records) based on your Linode's IP addresses before proceeding.

## Install VestaCP

Log into your Linode as the "root" user via SSH to its IP address (found on the "Remote Access" tab in the Linode Manager). 

1. Make sure you've read the [Getting Started Guide](https://www.linode.com/docs/getting-started) paying attention to setting the hostname, updating the system, and setting the timezone.

2. Issue the following command to download and install VestaCP
        cd /temp/
		curl -O http://vestacp.com/pub/vst-install.sh

{: .note}
>If you wish to customize your web, ftp, email, dns, firewall, database, etc, I suggest using the [Advanced Install Settings](http://vestacp.com/#install). This will give you a very specific command to input into ssh. The Advanced Install Settings can also set your hostname for you if you wish.

3. Run the installer
        bash vst-install.sh
{: .note}				
>Please note, the installation process may take a long time to complete. Once it's finished, you may access VestaCP at `https://12.34.56.78:8083` (replace `12.34.56.78` with your Linode's IP address). If your browser displays a warning message like the one below, you can ignore and continue for now.

    [![A browser warning for an untrusted certificate.](/docs/assets/ssl-warning.png)](/docs/assets/ssl-warning.png)
	
4. Login with the username "admin" and password displayed in ssh.

## Configure VestaCP
1. Once you've logged into VestaCP, I suggest changing your Password.
        Click on Admin in the top right corner
		Once your done, click save at the bottom
		
{: .note}
>From here you can also change your email address, your hosting package, and other details. I suggest if your hosting your DNS services, to go ahead and put in your default nameservers at the bottom.

	
### Creating your first Domain
1. Click on Web and I suggest deleting any web domains listed as we'll be adding them and setting up DNS.
2. Click on the Green +Add Web Domain button
3. Type in yourdomain.tld (replacing with your actual domain)
4. Select your Servers external IP address from the drop down
5. Click on Advanced options and ensure the alias is something similar to www.yourdomain.tld
6. Click Add at the bottom of that page		

### Setting our DNS
1. Click on Edit for yourdomain.tld
2. Type in your IPv4 address or make sure it's correct
3. In the Template field make sure it's set to child-ns
4. Leave Expiration alone unless you know what your doing
5. In SOA field, make sure your ns1 is correct (ex. ns1.yourdomain.tld)
6. Leave TTL alone
7. Click Save

{: .note}
>By setting the Template field to child-ns it's telling the system its the template for vanity name servers or our own name servers.

### Checking DNS records
1. Click on DNS
2. Click on List next to yourdomain.tld

{: .note}
>If you had the DNS box checked when you created the Domain, then most of the records will have been created automatically. Minor adjustments may need to be made, which is why we're looking at the DNS records.

### Adding our hostname to DNS
1. Click on DNS
2. Click on List next to yourdomain.tld
3. Click green +Add DNS record
4. In the Record field add the beginning of your hostname. So if your hostname is sv.yourdomain.tld, you'd add sv.
5. Type is A
6. IP or value is your linodes IP address
7. You can change the priority if you know what your doing, I suggest leaving it blank
8. Click Add

### Creating Email Accounts
1. Click on Mail
2. Find yourdomain.tld
3. Click on List accounts
4. Click the green +Add Mail Account

{: .note}
>The Domain will be listed but grayed out to prevent adding the email to the wrong domain if you have more than 1 domain. Also, as you type in  the information, on the right hand side it will display settings for [Outlook](https://www.microsoft.com/en-us/outlook-com/?cb=v8ho), [Outlook Express](https://en.wikipedia.org/wiki/Outlook_Express), [Thunderbird](https://www.mozilla.org/en-US/thunderbird/), or your [Email Client](https://en.wikipedia.org/wiki/Email_client).

### Adding Databases
1. Click on DB
2. Click the green +Add Database
3. Fill out the Database
4. Fill out the User
5. Fill out the Password or click on generate
6. Select the type (the default is mysql only)
7. Leave the Host field alone as it defaults to localhost
8. Select your Charset or leave it at default utf8
9. You can have the system email the database credientials to a specified email
10. Click on add

### Adding Cron Tasks
{: .note}
>If your not sure what Cron or Cronjobs are, I suggest reading through [Linodes Guide Schedule Tasks with Cron](https://www.linode.com/docs/tools-reference/tools/schedule-tasks-with-cron)

1.Click on Cron
2. Fill out the Minute, Hour, Day, Month, and Day of week
3. Input your command
4. Click add

For example if we wanted to run a php script everyday:
1. Minute would be *
2. Hour would be *
3. Day would be 1
4. Month would be *
5. Day of week would be *
6. Command would be for example /home/user/public_html/file.php

{: .note}
>VestaCP automatically emails the output of the cronjobs to the address setup for the admin account

## Advanced Settings

### Adding IPv6 to DNS
{: .note}
>To find your Linodes IPv6, check the [Getting Started Guide](https://www.linode.com/docs/getting-started#finding-the-ip-address)
	
1. Click on DNS
2. Click on List Records for yourdomain.tld
3. Click on +Add Record
4. In the Record field type in @
5. In the Type, select AAAA (thats 4 A's)
6. In the IP or Value field add your IPv6
7. Click Add at the bottom

### Changing Hosting Template for Domain
1. Click on Web
2. Click on Edit for yourdomain.tld
3. Scroll down to find Template

{: .file-excerpt }
default - no additional settings, works well for most sites
basedir - to fight against phpshells using openbasedir directive
hosting - separate php limits for each domain (php_admin_value memory/safemode/etc)
phpcgi - template to run php as cgi. can be useful to run php4 or php5.2
phpfcgid - to php as fcgi (automatically installed on a server with > 1Gb of RAM)
wsgi - template to run python projects (can be installed manually)

4. Click Save

That's it! VestaCP should now be properly configured on your Linode. Please allow 24-48 hours for DNS changes to propogate. For support please visit [VestaCP forums](http://forum.vestacp.com/)
