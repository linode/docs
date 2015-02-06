+author:
+ name: Josh Carter
+ email: joshcarter06@gmail.com
+contributor:
+ name: Josh Carter
+description: 'Installing and Configuring openDKIM with Sendmail on Debian 7'
+keywords: 'ddns'
+license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
+modified: Friday, February 5th, 2015
+modified_by:
+ name: James Stewart
+published: ''
+title: Configuring OpenDKIM with Sendmail on Debian 7
---

Configuring openDKIM with Sendmail on Debian 7
===============
or: How I Learned to Stop Worrying About My Email Being Marked As SPAM
-------------------------------
Debian has made it very easy to send email from your server. Debian 7 comes packaged with **sendmail**, so sending an email can be as easy as a couple of command line keystrokes. With packages like **sendmail** and **mutt**, it is particularly easy to send automated server status logs or even database backups to your email address. The problem, particularly with email clients like Gmail or Yahoo, is that your email will be sent to the spam folder. If you are just sending server status to yourself, you may live with your server-generated emails going to spam. However, if you are tired of moving your emails out of spam, or if you are sending emails to other users and are tired of telling your customers to check their spam folder, then this guide is for you.

The purpose of this article is to configure and run **openDKIM** with **sendmail** on a Debian 7 (Wheezy) server. It assumes, that you are using Debian 7, using **sendmail** instead of **postfix** as your MTA (Mail Transfer Agent), and are using **openDKIM** instead of **dkim-milter** as your DKIM sender authentication system. Setting up **openDKIM** on your server is just one part of the recipe. It is arguably the most difficult portion of the solution. There are off-server configurations that you need to configure as well. You will need to configure an SPF record in your DNS add your public DKIM key to your DNS. I will go through every step, but the details might be a little different for you based on your DNS host.

>**Note:** I am configuring **openDKIM** and **sendmail** assuming that you are running a virtual server running multiple different websites with multiple different domains. If you only have one domain that you want to send emails from, just follow these instructions and only configure one domain. This solution is scalable, other than some of the single-domain installation instructions you may have already found online.

# Install openDKIM and sendmail tools

First, you need to switch to root. There are some configuration steps that just do not work using **sudo**.
```
su root
```
Install **openDKIM** & tools

```
apt-get install opendkim opendkim-tools
```

Install **sendmail** tools. They do not come automatically with **sendmail** in Wheezy.

```
apt-get install sendmail-bin
```

# Create openDKIM keys

Now we need to create a new directory for your DKIM keys. Make a directory per domain.

```
mkdir -p /etc/opendkim/keys/mydomain.com
mkdir -p /etc/opendkim/keys/myotherdomain.com
```

Generate signing keys. **openDKIM** calls the key name your “selector”. You can pick any name you want for the selector, and they can have the same name for each domain, if you want. They will be different files in different folders, so just do what you are comfortable with. Popular names are “mail”, “default”, “mykey”, or “monthYEAR”. I use “monthYEAR”, but it really doesn’t matter. 

```
opendkim-genkey -D /etc/opendkim/keys/mydomain.com -d mydomain.com -s feb2015
opendkim-genkey -D /etc/opendkim/keys/myotherdomain.com -d myotherdomain.com -s feb2015
```

Change the ownership of the key directories and the files in the key directories to opendkim

```
chown -R opendkim:opendkim /etc/opendkim/keys/mydomain.com
chown -R opendkim:opendkim /etc/opendkim/keys/myotherdomain.com
```

Now change permissions for the keys

```
chmod 640 /etc/opendkim/keys/mydomain.com/feb2015.private
chmod 644 /etc/opendkim/keys/mydomain.com/feb2015.txt
chmod 640 /etc/opendkim/keys/myotherdomain.com/feb2015.private
chmod 644 /etc/opendkim/keys/myotherdomain.com/feb2015.txt
```

# Create your opendkim.conf file
Step 1 is to delete your ```opendkim.conf``` file. It has a lot of pre-configuration values that get confusing when you are configuring openDKIM more than one domain. Make a backup copy if you want, but you really don’t need it. We’re going to recreate it.

```
rm /etc/opendkim.conf
```

Recreate ```opendkim.conf```. I use nano, you can use your favorite text editor.

```
nano /etc/opendkim.conf
```

Enter the following text into opendkim.conf. There’s nothing specific to your domains here, so you can copy and paste the text.

>PidFile	/var/run/opendkim/opendkim.pid
>Mode	sv
>Syslog	yes
>SyslogSuccess	yes
>LogWhy	no
>UserID	opendkim:opendkim
>Socket	inet:8891@localhost
>Umask	002
>Canonicalization	relaxed/simple
>KeyTable	refile:/etc/opendkim/KeyTable
>SigningTable	refile:/etc/opendkim/SigningTable
>ExternalIgnoreList	refile:/etc/opendkim/TrustedHosts
>InternalHosts	refile:/etc/opendkim/TrustedHosts

# Create your KeyTable, SigningTable, and TrustedHosts files

The ```KeyTable``` tells **openDKIM** where to find the private keys you made. Its location will match the ```KeyTable``` entry you made in ```opendkim.conf```. The file doesn’t exist yet, so let’s make it.

```
nano /etc/opendkim/KeyTable
```

Add the following text, but make sure to enter the domain and selector information specific to your installation. 

>feb2015._domainkey.mydomain.com mydomain.com:feb2015:/etc/opendkim/keys/mydomain.com/feb2015.private
>feb2015._domainkey.myotherdomain.com myotherdomain.com:feb2015:/etc/opendkim/keys/myotherdomain.com/feb2015.private

Now create your ```SigningTable```. It tells **openDKIM** what emails to sign, and which keys to use when signing. I am assuming here that you want all emails generating from your server, from your domain, to be signed. If you only want emails coming from ```bob@mydomain.com``` to be signed, then change the ```SigningTable``` accordingly. Its location matches the ```SigningTable``` entry in ```opendkim.conf```.

```
nano /etc/opendkim/SigningTable
```

And here’s your text. Edit it based on what you want signed. You will enter 2 lines per domain, one with your domain and one with myservername.mydomain. They will point to the keys you defined in your ```KeyTable```:

>*@mydomain.com feb2015._domainkey.mydomain.com
>*@myservername.mydomain.com feb2015.domainkey.mydomain.com
>*@myotherdomain.com feb2015._domainkey.myotherdomain.com
>*@myservername.myotherdomain.com feb2015._domainkey.myotherdomain.com

Finally, create your ```TrustedHosts``` file. Its location matches the ```SigningTable``` entry in ```opendkim.conf```.

```
nano /etc/opendkim/TrustedHosts
```

This file lists your trusted hosts. It is important to make sure that ```127.0.0.1``` is at the top, ```localhost``` is below that, and then list your domains.

>127.0.0.1
>localhost
>mydomain.com
>myotherdomain.com

Take a breath. You have configured your **openDKIM** installation. Now we need to set up **sendmail** to use **openDKIM**. There are a couple of quirks with **sendmailconfig** on Debian. Let’s get to it.

# Configuring sendmail to use openDKIM

Edit the ```sendmailconfig``` file to work on Debian 7

```
nano /usr/sbin/sendmailconfig
```
>Change ```#!/bin/sh -e```
>To ```#!/bin/bash -e```

Edit the ```sendmail.mc``` file. **sendmailconfig** uses ```sendmail.mc``` to create the ```sendmail.cf``` file. Do not edit the ```sendmail.cf``` file directly. This is the step where we tell **sendmail** to use **openDKIM**.

```
nano /etc/mail/sendmail.mc
```
>Move the following lines to the end of the ```sendmail.mc``` file:
>```
>MAILER_DEFINITIONS
>MAILER(`local')dnl
>MAILER(`smtp')dnl	
>```
Then add the following line to the end of the ```sendmail.mc``` file: 
>```
>INPUT_MAIL_FILTER(`opendkim', `S=inet:8891@127.0.0.1')
>```
to the bottom of the file.


Run **sendmailconfig**

```
/etc/sendmail/sendmailconfig
```

Select Yes to use the existing ```/etc/mail/sendmail.conf```

Select Yes to use the existing ```/etc/mail/sendmail.mc```

It will fail. **Sendmailconfig** will rewrite portions of your ```sendmail.mc``` file, and you have to edit it again.

```
nano /etc/mail/sendmail.mc
```
>Delete the following lines that appear in the middle of the file:
>```
>MAILER_DEFINITIONS
>MAILER(`local')dnl
>MAILER(`smtp')dnl
>```
>**Leave** the same MAILER_DEFINITIONS entries at the end of the file.

Run **sendmailconfig** again

```
/etc/sendmail/sendmailconfig
```

Select Yes to use the existing ```/etc/mail/sendmail.conf```

Select Yes to use the existing ```/etc/mail/sendmail.mc```

Success! Select No to reload running **sendmail** with new configuration. We want to start **openDKIM** first.

# Start your services
Start **OpenDKIM**

```
service opendkim start
```

Then, restart **sendmail**
```
service sendmail restart
```

# Configure your DNS Records
From a server configuration standpoint, your work is now complete. You have configured **openDKIM** and **sendmail** is using it correctly. However, you are not done with your DKIM setup, and your email will still go to spam. 

Now we need to configure your DNS to use your DKIM keys, and we need a SPF record to make sure that mail from your server for your domain is legit. 

First, you will need to get your public keys. If you like punishment, you can ```cat``` them out on your terminal and try to type them into your DNS txt entry, but I highly suggest emailing it to yourself using **mutt**. So, **mutt** is an optional step and if you have a better way you like to get files off your server, use it. Let’s install **mutt**.

```
apt-get install mutt
```

Now send yourself your public keys. If you’ve ever used **sendmail** by itself to send an attachment from a command line, you will appreciate **mutt**. As an added bonus, you can use **mutt** to check your DKIM and SPF records once you are done.

```
echo “Attached is the public DKIM key for mydomain.com.” | mutt -a “/etc/opendkim/keys/mydomain.com/feb2015.txt” -s “DKIM Public Key for mydomain.com” -- myemailaddress@domain.com
```

Do this for each public key. Check your spam folder :).

Get to your DNS Zone file, which is specific to your DNS. I use GoDaddy. For each domain you are hosting on your server, do the following:

- Check that your server is listed in your MX record.

>Host: @
Points to: myservername.mydomain.com
Priority: 0, 10, 20, whatever priority you want. If you only have one MX, set priority 0.

- Create a txt SPF record for your mail server. The purpose of this txt record is to tell the DNS that mail coming from your MX servers are legitimately from your domain. Make sure you use enter ~all, not -all.

>Host: @
TXT Value: v=spf1 a mx include:mydomain.com ~all

- Enter in your public key. The format is “Host: selector._domainkey” and the TXT value is everything between the “” in your public key .txt file.

>Host: feb2015._domainkey
TXT Value: v=DKIM1; k-rsa, p=MyReAllLLLYlongPubLicKey

Save your DNS Zone file. You are now done with configuration.

#Test your configuration.

The quick and dirty way to test your email is to send an email from your server to your **gmail** account and see if it ends up in your inbox or the spam folder. If you’re happy, I’m happy.

Brandon Checketts made a fantastic tool to make sure that your DKIM and SPF records are set correctly, and that your DKIM is working properly. He gives you a spam probability number that is largely outdated by modern mail service providers like Gmail and Yahoo, but the information on your SPF records and your DKIM setup is valuable.

You can find his [email test program here](http://www.brandonchecketts.com/emailtest.php). He will give you a random email address to use, you send an email from your server to that address, and you click to view the results.

The following assumes you use mutt. You can easily use sendmail directly, but mutt gives you a very easy way to test your multiple different domains.

Create ~/.muttrc

```
nano .muttrc
```

Here are your basic ```.muttrc``` configuration options. Start with parameters from your first domain.

```
set realname=“Johnny Nospamhere"
set from="donotreply@mydomain.com"
set use_from=yes
set edit_headers=yes
set use_envelope=yes
```

Now send an email to Brandon, using the randomly generated email address from his website.

```
echo “Test Body” | mutt -s “Test Subject” -- rADFIne3@www.brandonchecketts.com
```

Read your results on Brandon’s website. If your SPF checks out and your DKIM checks out, you know you are done, and you know it is correct. Edit your ```.muttrc``` file “from” setting for each domain and send a different test email.

Congratulations!

