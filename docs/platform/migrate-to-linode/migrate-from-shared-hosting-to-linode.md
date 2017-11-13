---
author:
  name: Linode
  email: docs@linode.com
description: 'Migrate your website from a shared host to a Linode cloud server running a LAMP stack.'
keywords: ["shared hosting", "migrate", "website migration"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['migrate-from-shared/','migrate-to-linode/migrate-from-shared-hosting/','migrate-to-linode/migrate-from-shared-hosting-to-linode/']
modified: 2016-09-19
modified_by:
  name: Linode
published: 2013-10-18
title: Migrate from Shared Hosting to Linode
---

![Migrate from Shared Hosting to Linode](/docs/assets/migrate-from-shared-hosting-to-linode.png "Migrate from Shared Hosting to Linode")

This guide walks you through the steps to migrate your website from a shared hosting provider to a Linode running a LAMP stack. A Linode server gives you much more power and flexibility than a shared host, but these advantages come at the cost of increased complexity and system administration responsibility.

The biggest change between shared hosting and Linode's cloud is that with Linode you have full administrative access to the server without intervention. This means that you will be solely responsible for keeping your software updated and your valuable data backed up. Our [Guides and Tutorials](/docs/) area contains all of the information you'll need for basic [server administration](/docs/tools-reference/linux-system-administration-basics), [security hardening](/docs/security/securing-your-server) and [system backups](/content/security/backups/backing-up-your-data).

## Before You Begin

This guide makes three assumptions:

*   You already have a Linode account.
*   You know how to sign in to the [Linode Manager](https://manager.linode.com/).
*   You have a basic knowledge of how to use SSH.

{{< note >}}
Because this guide is intended to be general in nature, it does not take into account the specific dependencies or frameworks of each individual setup. If you're unsure whether or not your website is compatible with a LAMP configuration, we strongly suggest consulting your web developer before proceeding.
{{< /note >}}

See our [Getting Started](/docs/getting-started) guide for more information on signing up and setting up your Linode.

## Prepare Your Domain Name to Move

Start by lowering the *Time to Live* (TTL) setting for your domain, so the migration won't have a negative impact on your site's visitors. TTL tells DNS caching servers how long to save information about your domain. Because DNS addresses don't often change server IP addresses, default TTL is typically about 24 hours.

When changing servers, however, you want a shorter TTL to make sure that when you update your domain information, it takes effect quickly. Otherwise, your domain could resolve to your old server's IP address for up to 24 hours. However, changing TTL is not a guarantee because caching DNS servers ignore TTL, but it does the most to make sure that your site has a smooth transition.

1.  Locate your current *nameservers* in your shared hosting provider's account control panel. If you're not sure what your nameservers are, you can find out with a [Whois Search tool](http://www.internic.net/whois.html). You will see several nameservers listed, probably all at the same company.

    [![Version control overview.](/docs/assets/1424-internic_whois_nameserver-3.png)](/docs/assets/1424-internic_whois_nameserver-3.png)

2.  Contact your domain registrar for details on how to shorten the TTL for your domain. Every provider is a little different, so you may have to ask for instructions.

3.  Make a note of your current TTL. It will be listed in seconds, so you need to divide by 3600 to get the number of hours (e.g. 86,400 seconds = 24 hours). This is the amount of time that you need to wait between now and when you actually move your domain.

4.  Adjust your TTL to its shortest setting. For example, 300 seconds is equal to 5 minutes, so that's a good choice if it's available.

5.  Make sure you wait out the original TTL from Step 3 before actually moving your domain. In the meantime, you can continue through this guide to back up your data, deploy your Linode and upload your website. For more information on domain TTL, see our [DNS guide](/docs/networking/dns/dns-manager-overview/#set-the-time-to-live-or-ttl).

{{< note >}}
If you can't shorten your TTL, it's not the end of the world. The first day or two of your transition to Linode may be a little bumpy, but your updated domain information will eventually spread throughout the internet, and in less than a week you won't notice any difference.
{{< /note >}}

## Back Up Your Website

The next step is to back up your site from your old server to your local computer. You can do this multiple ways, although you may find it easiest to work directly through your host's control panel from your web browser. The location of your website on the server will vary among hosting providers, though it should be something along the lines of `/home/account_name/public_html`.

You may want to explore whether the application you use for your website has its own backup instructions, such as the combination of [WordPress](https://codex.wordpress.org/WordPress_Backups) and [phpMyAdmin](http://docs.phpmyadmin.net/en/latest/faq.html?highlight=backup#how-can-i-backup-my-database-or-table), for example. Regardless of the backup method, every website is made up of files and databases so you can use the instructions in this section to back up every type of website.

If you have a MySQL or MariaDB database on your old server, you will need to back it up, too. Your old host probably has a control panel that will allow you to make an easy backup of your database. Contact that host for instructions if you are not sure how to do it. If your old host does not have a database backup solution, you can follow our instructions to [Back Up Your MySQL Databases](/docs/databases/mysql/backup-options) using the command line.

**Shared Host's Control Panel**

[CPanel](https://documentation.cpanel.net/display/ALD/Backup%20Wizard) and [Plesk](http://docs.plesk.com/en-US/12.5/administrator-guide/website-management/backing-up-and-recovering-websites/) have their own backup methods, in addition to being able to create a single *.tar.gz* or *.zip* file from within their file managers for you to download.

**Terminal (Linux / OS X)**

Linux and OS X can use [SCP](https://en.wikipedia.org/wiki/Secure_copy) natively from the command line. To download your client's tarball to your local user's home directory using SCP:

    scp example_user@server_ip_address:/home/account_name/public_html ~/

**FileZilla (Linux / OS X / Windows)**

See [our Filezilla guide](/docs/tools-reference/file-transfer/filezilla) to use it for your site backups.

## Install a Basic Web Server on Your Linode

The next step is to build the software environment needed for your site to function properly. Linode provides prepackaged software options called [StackScripts](https://www.linode.com/stackscripts/) that make it easy to deploy software stacks in just a few clicks. We'll go over detailed instructions for installing the basic LAMP web server. Once that's complete, you can install a content management system of your choice such as [WordPress](https://wordpress.org/) or [Drupal](https://www.drupal.com/).

### LAMP Stack

[LAMP](https://en.wikipedia.org/wiki/LAMP_%28software_bundle%29) stands for the following:

*  **Linux:** Linode offers a LAMP StackScript for CentOS, Debian and Ubuntu. Which Linux distribution you choose is up to you. While there will be no discernible difference to your site's users, each distro has advantages and disadvantages to consider.
*  **Apache:** A web server that handles HTTP and HTTPS internet traffic.
*  **MySQL:** A database server.
*  **PHP:** A software language that allows you to create and configure dynamic website content.

1.  After you select a data center for your Linode, you'll be prompted to deploy a *Linux distribution*. Select the option to **Deploy using StackScripts**:

    [![Deploy with StackScripts](/docs/assets/1436-stackscripts_deploywith_sm.png)](/docs/assets/1420-stackscripts_deploywith.png)

2.  Select **linode / LAMP**:

    [![Choose the LAMP StackScript](/docs/assets/lamp-stackscript-sm.png)](/docs/assets/lamp-stackscript.png)

3.  Fill in the requested details. The example given is for a new Drupal site:

    [![Fill in the details as listed below.](/docs/assets/1438-stackscripts_lamp_drupal_sm.png)](/docs/assets/1422-stackscripts_lamp_drupal.png)

    *  MySQL root Password: Enter a strong password and make note of it. This will be the highest-level password for your database.
    *  Create Database: Enter a name for your database, if desired.
    *  Create MySQL User: You should create a secondary user for your database, so you're not working in it as the DB's root user.
    *  MySQL User's Password: This is the password for your new database user.
    *  Distribution: Choose your preferred Linux distro. If you are relatively new to Linux, the newest Ubuntu LTS is a good start because it has five-year release cycles and widely available support.
    *  Deployment Disk Size: Leave the default setting.
    *  Swap Disk: Leave the default setting.
    *  Root password: Not to be confused with the MySQL root user's password, this root password is the master key to your Linode. You want a strong password here, and ideally, to later remove password access to your Linode in exchange for [SSH key authentication](/docs/security/securing-your-server#create-an-authentication-key-pair).

4.  Click the **Deploy** button. You will be redirected to your Linode's **Dashboard**. Watch the **Host Job Queue**. You should see a number of jobs in progress.

    [![Wait for the jobs to finish, then boot the Linode.](/docs/assets/1421-stackscripts_lamp_boot.png)](/docs/assets/1421-stackscripts_lamp_boot.png)

5.  When the **Create Disk** job is done, click the **Boot** button under your Linode.

6.  To verify that LAMP installed correctly, check that a basic website framework has been added to your server. To do that, your IP address must be used, since your domain isn't pointing to Linode yet.

    To find your IP, go to the **Remote Access** tab. Your IP will be in both the **SSH Access** and **Public IPs** sections:

    [![Locate your IP address](/docs/assets/1712-remote_access_ip_single_small.png)](/docs/assets/1713-remote_access_ip_single.png)

7.  Open a new browser tab and paste the IP address into the address bar. You should see Apache's test webpage:

    ![Apache test page](/docs/assets/apache2-test-page.png)

8.  Install additional software

    If you need to install more software such as Drupal, cPanel or Ruby support, you have two options:

    *   Search through our database of [StackScripts](https://www.linode.com/stackscripts/) for the combination of software you're looking for.

    *   Install the software manually, using pages from [Linode Guides & Tutorials](/docs/) or the general internet as references.

## Get Your Website Live

Once you've installed all the underlying software for your Linode, you can upload your website to the new server. This will replace the Apache test page shown earlier with your actual website.

1.  Follow the steps in our [hosting a website](/docs/websites/hosting-a-website/#configure-name-based-virtual-hosts) guide to configure name-based virtual hosts for Apache on your Linode.

2.  Upload your website's files *from your local computer* to `/var/www/html/example.com/public_html` *on your Linode*. The process to do this is similar to how you downloaded your site's files to your local computer when creating a backup from your shared host. The only differences are the source and destination of the transfer.

    For example, to *upload* to your Linode using SCP on Linux or OS X:

        scp ~/example.com example_user@server_ip_address:/var/www/html/example.com/public_html

    {{< note >}}
`example_user` should be the user on your Linode you want to log in as, and `example.com` should be replaced by your domain name.
{{< /note >}}

    If you have a database, you'll need to upload it to your Linode. If you're more comfortable using a control panel, you may want to [install phpMyAdmin](/docs/databases/mysql/) at this point. You can also [restore your database](/docs/databases/mysql/back-up-your-mysql-databases/#restoring-an-entire-dbms-from-backup) using the command line.

3.  Now check your website's IP address in your browser. Your website should be displayed.

    {{< note >}}
Your website may not yet function completely correctly if it is URL-dependent. A website created with WordPress is an example of a URL-dependent website. Because you're using the IP address instead of the URL, WordPress gets confused. It should start working correctly once you move your domain to point to Linode.
{{< /note >}}

### A Note About Email

A Linode can run both your web server and an [email server](/docs/mailserver) for your site. If you use a separate email host like Google Apps, you will need to make sure you preserve the correct *MX records* for email when you move your domain. If you use a mail service at your old host, you may still need to consider where you're going to move your email.

## Move Your Domain

The last step in your Linode migration is to point your domain at your Linode's IP address. If you decided to shorten your TTL, make sure you've waited out the original time period.

1.  Follow our instructions on [adding a domain zone](/docs/networking/dns/dns-manager-overview#add-a-domain-zone) to create DNS records at Linode for your domain.

2.  If you use a third-party email service, edit the default MX records.

3.  Log in to your domain registrar's control panel and update the name servers to use Linode's:

    *  `ns1.linode.com`
    *  `ns2.linode.com`
    *  `ns3.linode.com`
    *  `ns4.linode.com`
    *  `ns5.linode.com`

4.  Wait five minutes (or the time you set for your TTL) for the domain to propagate. If you did not shorten your TTL, this may take up to 48 hours.

5.  Navigate to your domain in a web browser. It should now show the website from Linode, rather than your old host. If you can't tell the difference, you can use the [DIG utility](http://www.kloth.net/services/dig.php). It should show the IP address for your Linode.

6.  [Set reverse DNS](/docs/networking/dns/setting-reverse-dns) for your domain so you don't have mail problems.

    {{< note >}}
If you're having trouble seeing your site at the new IP address, you may need to try visiting it in a different browser, or in a private browsing session. Sometimes your browser will cache old DNS data, even if it has updated everywhere else.
{{< /note >}}

Your website is now fully migrated to Linode. It is a good idea to wait a few days before cancelling your shared hosting service to make sure that everything is running smoothly, and you don't need to obtain more files from your shared host.

## Next Steps

Your server is only as secure as you make it. Follow our [Securing Your Server](/docs/securing-your-server) guide to make sure your Linode is hardened against unauthorized access.
