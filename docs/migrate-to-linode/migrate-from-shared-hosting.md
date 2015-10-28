---
author:
  name: Linode
  email: docs@linode.com
description: 'Follow these instructions to migrate your website from a shared host to Linode.'
keywords: 'shared hosting,shared,host,migrate,migration,website'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['migrate-from-shared/']
modified: 'Friday, October 30th, 2015'
modified_by:
  name: Linode
published: 'Friday, October 18th, 2013'
title: Migrate from Shared Hosting to Linode
---

This guide will walk you through migrating your website from a shared hosting provider to Linode. Linode gives you a lot more flexibility and power than a shared host, but those benefits come with a bit more complexity and responsibility, so you will learn several new concepts along the way.

## Before You Begin

This guide will assume you already have a Linode account and know how to sign in to the [Linode Manager](https://manager.linode.com/).

## Prepare Your Domain Name to Move

We will start by lowering the *Time to Live* (TTL) for your domain so the migration won't have negative impact on your site's visitors. TTL tells DNS caching servers how long to save information about your domain, and since DNS addresses don't often change server IP addresses, TTL is normally about 24 hours.

When changing servers, however, you want a low TTL to makes sure that when you update your domain information, it takes effect quickly. Otherwise, your domain will resolve to your old server's IP for up to 24 hours. Changing TTL is not a universal guarantee, however, because caching DNS servers ignore TTL, but does the most to make sure that your site ***.

1.  Locate your current *nameservers* in your shared hosting provider's account control panel. If you're not sure what your nameservers are, you can find out with this [Whois Search tool](http://www.internic.net/whois.html). You will see several nameservers listed, probably all at the same company.

    [![Version control overview.](/docs/assets/1424-internic_whois_nameserver-3.png)](/docs/assets/1424-internic_whois_nameserver-3.png)

2.  Contact your domain registrar for details on how to lower the TTL for your domain. Every provider is a little different, so you will have to ask for their instructions.

3.  Make a note of your current TTL. It will be listed in seconds, so you need to divide by 3600 to get the number of hours (ex: 86,400 seconds = 24 hours). This is the amount of time that you need to wait between now and when you actually move your domain.

4.  Lower your TTL as low as it will go. 300 seconds = 5 minutes, so that's a good choice if it's available.

5.  Make sure you wait out the original TTL from Step 3 before you actually move your domain. In the meantime, you can do all of the other steps, like backing up your data, deploying your Linode, and uploading your website.

{: .note }
>
> If you can't lower your TTL, it's not the end of the world. The first day or two of your transition to Linode may be a little bumpy, but your updated domain information will eventually spread throughout the internet, and in less than a week you won't notice the difference.

For more information on domain TTL, see our [DNS guide](/docs/networking/dns/dns-manager#setting-the-time-to-live-or-ttl).

## Back Up Your Old Site

The next step is to download all of your website files and other unique files (like photos, videos, and configuration files) from your old server to your desktop.

You may want to see whether the application you use for your website already has its own backup instructions (like [WordPress](https://codex.wordpress.org/WordPress_Backups), for example). Ultimately, whether you have a special backup method or not, every website is made from files and databases. You can use the instructions in this section to back up every type of website.

{: .caution }
>
>If your old host has an automatic backup option, it may or may not be useful to you, depending on the type of backup that gets created. Ask your old host whether the backup is good for a *server migration* if you're not sure.

One of the easiest ways to download files from a server is by file transfer protocol (FTP). For these instructions we'll use FileZilla, a free, open source, cross-platform FTP client.

1.  Download the **FileZilla client** from [FileZilla's website](https://filezilla-project.org/) (not the server installaer). FileZilla should automatically detect whether your operating system before downloading. If not, choose the appropriate file for your operating system.

2.  Extract or un-archive the download if necessary and run the installer.

3.  When FileZilla installs, it will launch itself. Click the **Site Manager** icon at the upper left.

    [![Site Manager.](/docs/assets/1417-filezilla_site_manager.png)](/docs/assets/1417-filezilla_site_manager.png)

4.  Click the **New Site** button.

    [![FileZilla server settings.](/docs/assets/1426-filezilla_old_server_markup.png)](/docs/assets/1426-filezilla_old_server_markup.png)

    *  Choose **New Site** and enter a name for the folder.

    *  The **Host** can be your site's domain name or shared hosting server's IP address. If you don't have a dedicated IP address, you probably have an alternate domain name supplied by your old hosting company. Contact them to get it.

    *  Enter **22** for the **Port**. Alternately, use **21** if your provider doesn't support Secure FTP.

    *  Select **SFTP - SSH File Transfer Protocol** as the **Protocol**. (Alternately, select **FTP - File Transfer Protocol** if your provider doesn't support Secure FTP.)

    *  For **Logon Type**, select **Normal**.

    *  The **User** should be either the general user name or the FTP user name of your shared hosting plan. Contact your old hosting provider if you're not sure what it is.

    *  The **Password** should be that of the user mentioned above.

5.  Click the **Connect** button.

    [![Connect button.](/docs/assets/1427-filezilla_old_server_connect.png)](/docs/assets/1427-filezilla_old_server_connect.png)

6.  If this is your first time connecting, you may get a warning about the server's SSH key. Check the box to **Always trust this host**, then click **OK**.

    [![Unknown key warning.](/docs/assets/1450-filezilla_unknown_key.png)](/docs/assets/1450-filezilla_unknown_key.png)

7.  You should now see the connection dialog in FileZilla's top window. You'll know the connection was successful when the dialog stops and final line reads **Directory listing successful**.

    [![FileZilla is connected.](/docs/assets/1433-filezilla_connected_successful_sm.png)](/docs/assets/1428-filezilla_connected_successful.png)

8.  The left FileZilla window labeled **Local site** is your *local filesystem*. This panel shows all the files and folders on your desktop computer. Navigate to the location where you want to save a copy of your website. Here we'll use the *Destkop* folder as an example.

    [![FileZilla files.](/docs/assets/1432-filezilla_connected_desktop_markup_sm.png)](/docs/assets/1429-filezilla_connected_desktop_markup.png)

9.  The FileZilla window on the right is the **Remote site**. This shows the filesystem of the server you're connected to. Find your website folder in the Remote site window. It might be called something like **www**, **httpdocs**, or **public**. If you're not sure where your website folder is located, contact your old hosting provider.

10.  Select your website's root folder so it's highlighted in blue. Then right-click on it and choose **Download**.

        [![Download option.](/docs/assets/1434-filezilla_download_from_server_markup_sm.png)](/docs/assets/1430-filezilla_download_from_server_markup.png)

        You should see the progress in the bottom window as shown below:

        [![Download progress.](/docs/assets/1435-filezilla_download_inprogress_cropped_sm.png)](/docs/assets/1431-filezilla_download_inprogress_cropped.png)

11. Repeat Step 10 for the desired folders until you have downloaded all of your unique content from your old host. When finished, check your local download location to verify all of your site's content is there. To make things easier

{: .caution}
>
>If you have a MySQL database on your old server--and if you run WordPress or Drupal, you do--you also need to make a backup of your database. Your old host probably has a control panel that will allow you to make an easy backup of your database. Contact them for instructions. If not, you can follow our instructions to [Back Up Your MySQL Databases](/docs/databases/mysql/backup-options) using the command line.

## Configure Your Linode

See our [Getting Started](/docs/getting-started) guide and follow the [Signing Up](/docs/getting-started#sph_signing-up) section. This will open your account with Linode and give you access to the [Linode Manager](https://manager.linode.com/), your Linode account's: . When choosing a data center location, select the one which is closest to the majority of your site's visitors.

The next step is to start installing software on your Linode to rebuild your server environment. In the next section, we'll show you how to use Linode **StackScripts** to easily install some common software on your Linode. If you'd rather install and configure everything manually, you can follow the rest of the [Getting Started](/docs/getting-started) guide instead.

## Install a Basic Web Server

Linode provides you with prepackaged software options called [StackScripts](https://www.linode.com/stackscripts/) that make it easy to deploy software stacks in just a few clicks. We'll go over detailed instructions for installing the basic LAMP web server.

### LAMP Stack

LAMP stands for the following:

*  Linux: Your Linode's operating system (like Mac OS X or Windows).
*  Apache: A web server that handles HTTP and HTTPS internet traffic.
*  MySQL: A database server.
*  PHP: A software language that lets you have dynamic website content.

1.  After you select a data center for your Linode, you'll be prompted to deploy a *Linux distribution*. We're going to install the LAMP software at the same time, so you should select the option to **Deploy using StackScripts**.

    [![Deploy with StackScripts.](/docs/assets/1436-stackscripts_deploywith_sm.png)](/docs/assets/1420-stackscripts_deploywith.png)

2.  Select **linode/LAMP Stack**.

    [![Choose the LAMP StackScript.](/docs/assets/1440-stackscripts_lamp_sm.png)](/docs/assets/1423-stackscripts_lamp.png)

3.  Fill in all the requested details. Make a note of all usernames, passwords, and databases that you create so you can use them later. The example is for a new Drupal site:

    [![Fill in the details as listed below.](/docs/assets/1438-stackscripts_lamp_drupal_sm.png)](/docs/assets/1422-stackscripts_lamp_drupal.png)

    -   MySQL root Password: Enter a strong password and make a note of it. This will be the highest-level password for your database.
    -   Create Database: Enter a name for your database, if desired.
    -   Create MySQL User: You should create a secondary user for your database.
    -   MySQL User's Password: This is the password for your new database user.
    -   Distribution: Choose your preferred Linux distro. If you are relatively new to Linux, the newest Ubuntu LTS is a good start because it has 5 year release cycles and support is widely available.
    -   Deployment Disk Size: Leave the default setting.
    -   Swap Disk: Leave the default setting.

    - Root password: Enter a password that's hard to guess. The root password is the master key to your Linode. Make a note of it for later!

4.  Click the **Deploy** button. You will be redirected to your Linode's **Dashboard**. Watch the **Host Job Queue**. You should see a number of jobs in progress.

    [![Wait for the jobs to finish, then boot the Linode.](/docs/assets/1437-stackscripts_lamp_boot_sm.png)](/docs/assets/1421-stackscripts_lamp_boot.png)

5.  When the **Create Filesystem** job is done, click the **Boot** button under your Linode.

6.  To verify that LAMP installed correctly, we're going to check that a basic website framework has been added to your server. To do that, we need to use your IP address, since your domain isn't pointing to Linode yet.

    To find your IP, go to the **Remote Access** tab. Your IP will be in both the **SSH Access** and **Public IPs** sections. i

    [![Locate your IP address.](/docs/assets/1712-remote_access_ip_single_small.png)](/docs/assets/1713-remote_access_ip_single.png)

7.  Open a new browser tab and paste the IP address into the address bar. You should see Apache's test webpage.

    ![Apache test page.](/docs/assets/apache2-test-page.png)

#### Optional: Install Additional Software

If you need to install more software such as Drupal, Cpanel or Ruby support, you have two options:

*  Search through our database of [StackScripts](https://www.linode.com/stackscripts/) for the combination of software you're looking for.

*  Install the software manually using pages from [Linode Guides & Tutorials](/docs/) or the general internet as references.

### Add Your Own SSH Login

For this part of the instructions, you'll need to start using the *command line*. The command line is a lot like a DOS prompt. Instead of using your mouse and a graphical user interface to interact with your Linode, you type your instructions in an *SSH client*. An SSH client is a program like Terminal (for Mac OS X) or PuTTY (for Windows) that lets you connect to your Linode's command line.

 {: .note }
>
> If this is your first time using the command line, you may want to read up on it in our [Using The Terminal](/docs/using-linux/using-the-terminal) article. A few tips to keep in mind:
>
> -   Press **Enter** after you finish a command.
> -   You may not get any message after a successful command. You will get an error if the command didn't work.
> -   If you don't know which folder you're in, you can always type `pwd`, short for *print working directory*.
> -   Press the up arrow on your keyboard to see the previous command that was executed.

1.  Follow the [Connecting to Your Linode](docs/getting-started#ssh-overview) instructions. You'll find instructions for accessing Mac's Terminal application or downloading PuTTY for Windows.
2.  Open up a new browser tab with the [Linode Manager](https://manager.linode.com/). You'll need to get some information from it in the next step.
3.  Watch the tutorial video for either Windows or Mac OS X, depending on the type of desktop computer you own. Follow along with the instructions. Or, if you prefer reading, you can follow the written instructions instead. You will be locating your IP address in the Linode Manager, and then you will be logging in to your Linode with the SSH client. Your username is **root**, and your password is the **Root password** you set when you were installing the StackScript. Note that you will not see any characters when you type the password! Just press **Enter** when you're done typing.
4.  Finish all of the login instructions until your SSH client is showing you the following prompt:

        root@localhost:~#

5.  Now you're going to add your custom user, which you can use for both SSH and FTP. You'll be using this user instead of **root** from now on. Follow [these instructions](/docs/securing-your-server#sph_adding-a-new-user) to add a new user.

Excellent work. At this point, you should be logged in to your server's command line using either Terminal or PuTTY, and you should be logged in with your custom user rather than root. Next up: you'll add your domain name to Apache as a website.

## Get Your Website Live

### Add Your Website to Apache

This will replace the Apache test page we saw earlier with your actual website.

1.  Make sure you're still [logged in to your Linode](/docs/getting-started#sph_connecting-to-your-linode) over SSH with your custom user.

2.  Follow [these instructions](docs/security/securing-your-server/#adding-a-new-user) to configure name-based virtual hosts for Apache. That sounds like a lot, but it just means that you're adding your custom domain to Apache and setting up a few folders.

3.  Upload your website's files from your local computer to `/var/www/example.com/public_html`.

### Upload Your Site's Content

Once you've installed all the underlying software for your Linode and configured Apache, it's time to upload your website files, databases, and other data. For that, we'll use FileZilla again.

1.  Click the **Site Manager** icon.

    [![Site Manager.](/docs/assets/1417-filezilla_site_manager.png)](/docs/assets/1417-filezilla_site_manager.png)

2.  The process to upload with FileZilla is similar to what you did to download from your shared host earlier.

    [![Connection details for Linode.](/docs/assets/1442-filezilla_sitemanager_linode_markup.png)](/docs/assets/1442-filezilla_sitemanager_linode_markup.png)

    *  Choose **New Site** and create an entry for your Linode.

    *  **Host**: Your Linode's [IP address](/docs/getting-started#sph_finding-the-ip-address) or domain.

    *  **Port**: 22

    *  **Protocol**: SFTP

    *  **Logon Type**: Normal

    *  **User**: The username you created in the [Add Your Own SSH Login](#add-your-own-ssh-login) section above.

    *  **Password**: The password for the above user.

3.  Click **Connect**. Since this is your first time connecting to your Linode by SFTP, you will get a warning about the server's key. Check the box to **Always trust this host**, then click **OK**.

4.  When connected, FileZilla's **Remote site** window will place you in the **/home/example_user/** directory, where **example_user** is the username on your web server. We'll upload to here, then transfer the site to the appropriate location on the server.

    [![Directories in FileZilla.](/docs/assets/1443-filezilla_uploaded_directories_sm.png)](/docs/assets/1444-filezilla_uploaded_directories.png)

5.  In FileZilla's **Local site** window, navigate to the location where you saved the copy of your website. Select the folder or file(s) to be uploaded, right-click on them and select **Upload**.

6.  Repeat Steps 18-20 until you have uploaded all of your unique content from your old host. If you have more than one website, remember to navigate to the correct location on the remote side. If you have a lot of content, this may take some time.

    If you have a database, you'll need to upload it to your Linode. If you're more comfortable using a control panel, you may want to [install phpMyAdmin](/docs/search?q=phpmyadmin) at this point. You can also [restore your database](/docs/databases/mysql/backup-options#sph_restoring-a-single-database-from-backup) using the command line.

    {: .note }
    >
    > WordPress provides you with a [database restoration walkthrough](http://codex.wordpress.org/Restoring_Your_Database_From_Backup) which you may find useful.

7.  Now log into your Linode over SSH as your standard user. Use the command below to copy your website files into Apache's site directory. This will place your website in `/var/www/example.com` on your Linode.

        sudo cp ~/example.com /var/www

8.  Now check your website in your browser again, using your IP address for the URL as before. Your website should be visible.

{: .note }
>
> Your website may not function completely correctly if it is URL-dependent. A website created with WordPress is an example of a URL-dependent website. Because you're using the IP address instead of the URL, WordPress gets confused. It should start working correctly once you move your domain to point to Linode.

### A Note About Email

Do you have an email address at your domain? If so, where are you hosting it?

If you use a separate email host like Google Apps, you will need to make sure you preserve the correct *MX records* for email when you move your domain.

If you use a mail service at your old host, you will need to think about where you're going to move your email. It's entirely possible to run [your own mail server](/docs/mailserver) at Linode, but that may be a little bit too involved for someone new to a self-managed server. Instead, we recommend that you research a few [external mail services](/docs/mailserver#sph_external-mail-services) and pick one to switch to for email.

## Move Your Domain

By this point, your website should be fully functional on your Linode. All that's left is to move your domain, or, to use the technical term, *point* your domain at your Linode IP address. If you decided to lower your TTL, make sure you've waited out the original time period.

1.  Follow these instructions to [create DNS records](/docs/networking/dns/dns-manager#adding-1) at Linode for your domain name.
2.  Edit the default MX records so that they are correct for your third-party mail service.
3.  Locate the *registrar* for your domain. This may or may not be your old hosting company. If you're not sure who the registrar is, you can use this [Whois Search tool](http://www.internic.net/whois.html) to find your registrar.

    [![Locate your registrar.](/docs/assets/1425-internic_whois_registrar-4.png)](/docs/assets/1425-internic_whois_registrar-4.png)

4.  Log in to your registrar. You may need to contact them for assistance with the next step.
5.  You're ready to flip the switch! At your registrar, update your nameservers to Linode's nameservers:
    -   ns1.linode.com
    -   ns2.linode.com
    -   ns3.linode.com
    -   ns4.linode.com
    -   ns5.linode.com

6.  Wait five minutes. (Or, if you didn't lower your TTL first, wait 24-48 hours.)
7.  Visit your domain. It should now be showing the website from Linode, rather than your old host. If you can't tell the difference, you can use the [Dig](http://www.kloth.net/services/dig.php) service at kloth.net. It should show the IP address for your Linode.
8.  [Set reverse DNS](/docs/networking/dns/setting-reverse-dns) for your domain so you don't have any mail problems.

 {: .note }
>
> If you're having trouble seeing your site at the new IP address, you may need to try visiting it in a different browser. Sometimes your browser will cache old DNS data, even if it has updated everywhere else.

Congratulations! You have now officially moved your website to Linode. Wait a few days to make sure there aren't any hiccoughs. After that, you can feel free to cancel your account with your old host. Your site has made it to Linode.

## Security

Your server is only as secure as you make it. You should go through all of the instructions in the [Securing Your Server](/docs/securing-your-server) article to make sure your Linode is airtight.

## Having Trouble? Contact Linode Support

If you've gotten stuck at any stage during this article, feel free to [contact Linode support](/docs/support) for assistance. We're available 24/7.