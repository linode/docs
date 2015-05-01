---
author:
  name: Linode
  email: scampbell@linode.com
description: 'Follow these instructions to migrate your website from a shared host to Linode.'
keywords: 'migrate, linode, LAMP, shared, Ubuntu 12.04'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['migrate-from-shared/']
modified: Tuesday, April 8th, 2014
modified_by:
  name: Linode
published: 'Friday, October 18th, 2013'
title: Migrate from Shared Hosting to Linode
---

This guide walks you through migrating an existing website to Linode step by step, with a focus on transitioning from a shared hosting environment to Linode's virtual server cloud environment.

Along the way, you'll be learning a few new concepts. Linode gives you a lot more flexibility and power than a shared host, but those benefits come with a bit more complexity. Just take it one step at a time, and you'll be acting like a professional system administrator in no time!

Prepare Your Domain Name for a New Home
---------------------------------------

First, we're going to do one little step that's optional, but will save you a huge headache later on. We're going to get your domain name (a domain name is something like **example.com**) ready to move. We're not actually moving it right now; that's the last step. We're just setting it up so that when you are ready to move it, it'll go smoothly.

What we're doing right now is *lowering the TTL* for your domain. Time to Live, or TTL, tells Internet servers how long to save information about your domain. Usually your domain doesn't move around to different servers, so it's okay to have a high TTL. But, when you're about to move servers, you want to have a low TTL. This makes sure that when you update the server information for your domain, it takes effect quickly. Otherwise, the internet will send your traffic to the old location for a while, which is not ideal. Taking care of your domain is like updating your street address with the post office when you move.

1.  Locate your domain's current *nameservers*. Nameservers are like the address book for your domain. For most people, your nameserver will either be at your *registrar* (the place you bought the domain), or your current shared hosting provider. If you're not sure where your nameservers are, you can find out with this [Whois Search tool](http://www.internic.net/whois.html). You should see two or three listed nameservers, probably all at the same company.

    [![Version control overview.](/docs/assets/1424-internic_whois_nameserver-3.png)](/docs/assets/1424-internic_whois_nameserver-3.png)

2.  Contact that company for details on how to lower your TTL or time to live for your domain. Every name server host is a little different, so you will have to ask them for instructions.
3.  Make a note of your current TTL. It will be listed in seconds, so you need to divide by 3600 to get the number of hours. For example, 86400 seconds = 24 hours. This is the amount of time that you need to wait between now and when you actually move your domain.
4.  Lower your TTL as low as it will go. 300 seconds = 5 minutes, so that's a good choice if it's available.
5.  Save your changes.
6.  Make sure you wait out the original TTL from Step 3 before you actually move your domain. You can do all of the other steps, like backing up your data, deploying your Linode, and uploading your website, in the meantime.

 {: .note }
>
> If you can't lower your TTL, it's not the end of the world. The first day or two of your transition to Linode may be a little bumpy, but your updated and correct domain information will eventually spread throughout the internet, and in less than a week you won't notice the difference.

For more information on the TTL concept, see this section in our [DNS guide](/docs/networking/dns/dns-manager#setting-the-time-to-live-or-ttl).

Back Up Your Old Website and Data Files
---------------------------------------

The next step is to download all of your website files and other unique files (like photos, videos, and configuration files) from your old server. That way, you'll have a copy of everything on your desktop, which you can later upload to Linode.

You may want to see whether the application you use for your website already has a backup option. For example, WordPress comes with its own [backup instructions](http://codex.wordpress.org/WordPress_Backups), which may be easier to follow. Ultimately, whether you have a special backup method or not, every website is made from files and databases. You can use the instructions in this section to back up every type of website.

 {: .caution }
>
> If your old host has an automatic backup option, it may or may not be useful to you, depending on the type of backup that gets created. Ask your old host whether the backup is good for a *server migration* if you're not sure.

One of the easiest ways to download files from a server is to use an FTP program. FTP stands for *file transfer protocol*. If you already have a favorite FTP program, feel free to use it. For these instructions, we'll use FileZilla, which is free and works on both Mac OS X and Windows.

1.  Visit the [FileZilla website](https://filezilla-project.org/).
2.  Download the **FileZilla Client** - the first one, not the second one, which is for servers.

    [![Download FileZilla client.](/docs/assets/1415-filezilla_download.png)](/docs/assets/1415-filezilla_download.png)

3.  Click the **Download Now** button. FileZilla should automatically detect whether you're using a Mac or a Windows PC. If not, choose the appropriate file for your operating system.
4.  Wait for the file to finish downloading.
5.  Open the file. It should un-archive itself automatically. If not, use the **Extract all** option in Windows, or the **Archive Utility** in Mac OS X to un-archive the file. (Check Windows or Mac help if you need more assistance.)
6.  Double-click the FileZilla icon to launch FileZilla.
7.  Click the **Site Manager** icon in the upper left.

    [![Site Manager.](/docs/assets/1417-filezilla_site_manager.png)](/docs/assets/1417-filezilla_site_manager.png)

8.  Click the **New Site** button.

    [![FileZilla server settings.](/docs/assets/1426-filezilla_old_server_markup.png)](/docs/assets/1426-filezilla_old_server_markup.png)

9.  Enter a name for the new site folder.
10. For **Host**, you can type one of three things. The easiest option is to use your domain name, such as **example.com**. You can also use the IP address for your old server. If you don't have a dedicated IP address, you probably have an alternate domain name supplied by your old hosting company. Contact them to get it.
11. For **Port**, enter **22**. (Alternately, use **21** if your provider doesn't support Secure FTP.)
12. For **Protocol**, select **SFTP - SSH File Transfer Protocol**. (Alternately, select **FTP - File Transfer Protocol** if your provider doesn't support Secure FTP.)
13. For **Logon Type**, select **Normal** from the dropdown menu.
14. Enter your FTP username for your old server. Contact your old hosting provider if you're not sure what this is.
15. Enter your FTP password for your old server. Contact your old hosting provider if you're not sure what this is.
16. Click the **OK** button to save your settings.
17. Click the **Site Manager** icon again.

    [![Site Manager.](/docs/assets/1417-filezilla_site_manager.png)](/docs/assets/1417-filezilla_site_manager.png)

18. Select your site from the list on the left.
19. Click the **Connect** button.

    [![Connect button.](/docs/assets/1427-filezilla_old_server_connect.png)](/docs/assets/1427-filezilla_old_server_connect.png)

20. If this is your first time connecting, you may get a warning about the server's key. Check the box next to **Always trust this host**, then click **OK**.

    [![Unknown key warning.](/docs/assets/1450-filezilla_unknown_key.png)](/docs/assets/1450-filezilla_unknown_key.png)

21. You should now see some connection dialog going past in FileZilla's top center window. When it's done, you should see the final line say **Directory listing successful**. You're now connected to your old server.

    [![FileZilla is connected.](/docs/assets/1433-filezilla_connected_successful_sm.png)](/docs/assets/1428-filezilla_connected_successful.png)

22. On the left side of FileZilla is your **Local site**. This panel shows all the files and folders on your desktop computer. Navigate to the location where you want to save a copy of your website. The Desktop folder is a good choice.

    [![FileZilla files.](/docs/assets/1432-filezilla_connected_desktop_markup_sm.png)](/docs/assets/1429-filezilla_connected_desktop_markup.png)

23. On the right side of FileZilla, you should see a window labeled **Remote site**. This is the server side of FileZilla. You should see a list of files and folders that look similar to the ones on your local computer, except that they're on your server. Now you need to find your website folder. It might be called something like **www**, **httpdocs**, or **public**. If you're not sure where your website folder is located, contact your old hosting provider.
24. Click on your website folder so it's highlighted in blue. Then right-click on it, and finally choose the **Download** option with the blue arrow.

    [![Download option.](/docs/assets/1434-filezilla_download_from_server_markup_sm.png)](/docs/assets/1430-filezilla_download_from_server_markup.png)

25. Wait while all of your files download. You should see the progress in the bottom window. The files will be saved to your desktop computer in the location you selected in Step 21. If you have a lot of content, this may take some time.

    [![Download progress.](/docs/assets/1435-filezilla_download_inprogress_cropped_sm.png)](/docs/assets/1431-filezilla_download_inprogress_cropped.png)

26. Repeat Steps 22-25 until you have downloaded all of your unique content from your old host. When in doubt, just download a folder. It will download everything that was inside the folder as well!

If you have a MySQL database on your old server - and if you run WordPress or Drupal, you do - you also need to make a backup of your database. Your old host probably has a control panel that will allow you to make an easy backup of your database. Contact them for instructions. If not, you can follow these instructions to [Back Up Your MySQL Databases](/docs/databases/mysql/backup-options) using the command line.

When you're done, check your desktop (or whatever location you selected on your desktop computer). Make sure all of your files and folders are there. Now you have everything you need from your old host.

Purchase Your Linode
--------------------

Now it's time to get started with Linode. For this part of the guide, you should open up our [Getting Started](/docs/getting-started) guide in a new tab. That guide has detailed instructions for signing up with Linode and getting your Linode server fired up. Keep this guide open too - we'll provide you with some accompanying tips and commentary geared towards people coming over from a shared hosting environment.

1.  Follow the [Signing Up](/docs/getting-started#sph_signing-up) section. This will open your account with Linode and give you access to your Linode account control panel: the [Linode Manager](https://manager.linode.com/).
2.  Follow the first part of the [Provisioning Your Linode](/docs/getting-started#sph_provisioning-your-linode) section.
3.  When you choose a data center, choose the one that's closest to you or to the majority of your visitors.

Congratulations! Now you have a Linode! The next step is to start installing software on it. In the next section, we'll show you how to use Linode **StackScripts** to easily install some common software on your Linode. If you'd rather do everything by hand, you can follow the rest of the [Getting Started](/docs/getting-started) guide instead.

Install and Configure Software
------------------------------

Linode provides you with some prepackaged software options called [StackScripts](https://www.linode.com/stackscripts/) that make it easy to install everything you need in just a few clicks. We'll go over detailed instructions for installing the basic LAMP web server.

### Install Web Server Software: LAMP

LAMP stands for the following:

-   Linux: Your Linode's operating system (like Mac OS X or Windows).
-   Apache: A web server that handles internet traffic - specifically, HTTP and HTTPS requests.
-   MySQL: A database server.
-   PHP: A software language that lets you have dynamic website content.

1.  After you select a data center, you'll be prompted to deploy a *Linux distribution*, as shown below. We're going to install the LAMP software at the same time, so you should select the option to **Deploy using StackScripts**.

    [![Deploy with StackScripts.](/docs/assets/1436-stackscripts_deploywith_sm.png)](/docs/assets/1420-stackscripts_deploywith.png)

2.  Select **LAMP Stack**.

    [![Choose the LAMP StackScript.](/docs/assets/1440-stackscripts_lamp_sm.png)](/docs/assets/1423-stackscripts_lamp.png)

3.  Fill in all the requested details. Make a note of all usernames, passwords, and databases that you create so you can use them later. The example is for a new Drupal site:

    [![Fill in the details as listed below.](/docs/assets/1438-stackscripts_lamp_drupal_sm.png)](/docs/assets/1422-stackscripts_lamp_drupal.png)

    -   MySQL root Password: Enter a strong password and make a note of it. This will be the highest-level password for your database.
    -   Create Database: Enter a name for your database, if desired.
    -   Create MySQL User: You should create a secondary user for your database.
    -   MySQL User's Password: This is the password for your new database user.
    -   Distribution: Choose **Ubuntu 12.04 LTS** from the dropdown menu. This is your operating system (like when you install Windows or Mac OS X from a disk). Ubuntu is a type of Linux. It's good for Linux beginners, because it has a lot of support available and doesn't change too often.
    -   Deployment Disk Size: Leave the default setting.
    -   Swap Disk: Leave the default setting.

    - Root password: Enter a password that's hard to guess. The root password is the master key to your Linode. Make a note of it for later!
4.  Click the **Rebuild** button.
5.  You will be redirected to your Linode's **Dashboard**. Watch the **Host Job Queue**. You should see a number of jobs in progress.

    [![Wait for the jobs to finish, then boot the Linode.](/docs/assets/1437-stackscripts_lamp_boot_sm.png)](/docs/assets/1421-stackscripts_lamp_boot.png)

6.  When the **Create Filesystem** job is done, click the **Boot** button under your Linode.
7.  To verify that LAMP installed correctly, we're going to check that a bare-bones website framework has been added to your server. To do that, we need to use your IP address, since your domain isn't pointing to Linode yet. To find your IP, go to the **Remote Access** tab.
8.  Find the **SSH Access** line. Copy the four-part number that comes after the <**@*>\* symbol. This is your IP address.

    [![Locate your IP address.](/docs/assets/1712-remote_access_ip_single_small.png)](/docs/assets/1713-remote_access_ip_single.png)

9.  Open a new browser tab and paste the IP address into the address bar. You should see a bare-bones website that says **Index of /**.

    [![Index of /.](/docs/assets/1418-index.png)](/docs/assets/1418-index.png)

Fantastic! In a moment, you'll learn how to configure Apache to display your website with the proper domain name. But first, read the section below to see if you need to install any more software.

### Optional: Install More Software (Including WordPress)

If you need to install more software, such as a CMS like WordPress or Drupal, a control panel like cPanel, or support for a programming language like Ruby on Rails, you have a couple of options.

The first option is to search through our large database of [StackScripts](https://www.linode.com/stackscripts/) until you find the combination of software you're looking for. The WordPress StackScript installs WordPress and LAMP, so you can use it instead of the LAMP StackScript.

Using a StackScript is the most convenient approach, but you may not be able to find the exact software you need, or the most updated versions. The other option is to take a more hands-on approach and install the software yourself from the *command line*. If you're not familiar with how to use the command line, check out the [Connecting to Your Linode](/docs/getting-started#sph_connecting-to-your-linode) section of our **Getting Started** article. It's a lot like a DOS prompt.

Once you're connected to your Linode's command line, search the [Linode Guides & Tutorials](/docs/), or even the wider internet, for instructions on how to install your desired software. When possible, look for instructions for **Ubuntu 12.04**. In most cases, the command will be as simple as:

    apt-get install software

In the next section, you'll learn how to add your username to your Linode.

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

1.  Follow the [Connecting to Your Linode](/docs/getting-started#sph_connecting-to-your-linode) instructions. You'll find instructions for accessing Mac's Terminal application or downloading PuTTY for Windows.
2.  Open up a new browser tab with the [Linode Manager](https://manager.linode.com/). You'll need to get some information from it in the next step.
3.  Watch the tutorial video for either Windows or Mac OS X, depending on the type of desktop computer you own. Follow along with the instructions. Or, if you prefer reading, you can follow the written instructions instead. You will be locating your IP address in the Linode Manager, and then you will be logging in to your Linode with the SSH client. Your username is **root**, and your password is the **Root password** you set when you were installing the StackScript. Note that you will not see any characters when you type the password! Just press **Enter** when you're done typing.
4.  Finish all of the login instructions until your SSH client is showing you the following prompt:

        root@localhost:~#

5.  Now you're going to add your custom user, which you can use for both SSH and FTP. You'll be using this user instead of **root** from now on. Follow these instructions to [add a new user](/docs/securing-your-server#sph_adding-a-new-user).

Excellent work. At this point, you should be logged in to your server's command line using either Terminal or PuTTY, and you should be logged in with your custom user rather than root. Next up: you'll add your domain name to Apache as a website.

### Add Your Website to Apache

Remember that generic, bare-bones website we saw earlier? It's the default website for Apache. In this section, we're going to disable the default site and add your own domain name to Apache.

1.  Make sure you're still [logged in to SSH](/docs/getting-started#sph_connecting-to-your-linode) with your custom user.
2.  Follow the instructions here to [configure name-based virtual hosts](/docs/hosting-website#sph_configuring-name-based-virtual-hosts) for Apache. That sounds like a lot, but it just means that you're adding your custom domain to Apache and setting up a few folders.
3.  If you have more than one website, repeat these steps. Make sure you update the example folder names to use the correct domain name each time.

When you're done, you'll have a nice new location all set up for your website. You'll be uploading your files to the **/home/example\_user/public/example.com/public/** directory.

Upload Website and Data Files
-----------------------------

Once you've installed all the underlying software for your Linode and configured Apache, it's time to upload your website files, databases, and other data. For that, we'll break out FileZilla again!

1.  Double-click the FileZilla file icon to launch FileZilla.
2.  Click the **Site Manager** icon in the upper left.

    [![Site Manager.](/docs/assets/1417-filezilla_site_manager.png)](/docs/assets/1417-filezilla_site_manager.png)

3.  Click the **New Site** button.

    [![Connection details for Linode.](/docs/assets/1442-filezilla_sitemanager_linode_markup.png)](/docs/assets/1442-filezilla_sitemanager_linode_markup.png)

4.  Enter a name for the new site folder. You could call it **linode**.
5.  For **Host**, enter your Linode's [IP address](/docs/getting-started#sph_finding-the-ip-address).
6.  For **Port**, enter **22**.
7.  For **Protocol**, select **SFTP - SSH File Transfer Protocol**.
8.  For **Logon Type**, select **Normal** from the dropdown menu.
9.  Enter the custom username you created in the [Add Your Own SSH Login](#add-your-own-ssh-login) section above.
10. Enter the password you created in the [Add Your Own SSH Login](#add-your-own-ssh-login) section above.
11. Click the **OK** button to save your settings.
12. Click the **Site Manager** icon again.
13. Select your site from the list on the left.
14. Click the **Connect** button.

    [![The Connect button.](/docs/assets/1441-filezilla_sitemanager_linode_connect.png)](/docs/assets/1441-filezilla_sitemanager_linode_connect.png)

15. Since this is your first time connecting, you will get a warning about the server's key. Check the box next to **Always trust this host**, then click **OK**.

    [![Unknown key warning.](/docs/assets/1450-filezilla_unknown_key.png)](/docs/assets/1450-filezilla_unknown_key.png)

16. You should now see some connection dialog going past in FileZilla's top center window. When it's done, you should see the final line say **Directory listing successful**. You're now connected to your Linode.

    [![FileZilla is connected.](/docs/assets/1433-filezilla_connected_successful_sm.png)](/docs/assets/1428-filezilla_connected_successful.png)

17. On the right side of FileZilla, your **Remote site**, you should be in the **/home/example\_user/** directory, where **example\_user** is the username you created. Navigate into the **public/example.com/public/** directory, where **example.com** is the name of your domain.

    [![Directories in FileZilla.](/docs/assets/1443-filezilla_uploaded_directories_sm.png)](/docs/assets/1444-filezilla_uploaded_directories.png)

18. On the left side of FileZilla, your **Local site**, navigate to the location where you saved a copy of your website. If you saved an entire folder, navigate inside that folder until you find a file called **index.html** or **index.php**.
19. Click on the **index.html** or **index.php** file so it becomes highlighted in blue, then right-click on it. Choose the **Upload** option with the red arrow.

    [![Click the Upload option.](/docs/assets/1445-filezilla_upload_markup_sm.png)](/docs/assets/1446-filezilla_upload_markup.png)

20. You file should upload quickly. You'll see the progress in the bottom window.

    [![Upload progress.](/docs/assets/1448-filezilla_upload_inprogress_cropped_sm.png)](/docs/assets/1447-filezilla_upload_inprogress_cropped.png)

21. Repeat Steps 18-20 until you have uploaded all of your unique content from your old host. If you have more than one website, remember to navigate to the correct location on the remote side. If you have a lot of content, this may take some time.

Remember, the correct location for your website content is **/home/example\_user/public/example.com/public/**!

If you have a database, you'll need to upload it to your Linode. If you're more comfortable using a control panel, you may want to [install phpMyAdmin](/docs/databases/mysql/phpmyadmin-ubuntu-12.04-precise) at this point. You can also [restore your database](/docs/databases/mysql/backup-options#sph_restoring-a-single-database-from-backup) using the command line.

 {: .note }
>
> WordPress provides you with a [database restoration walkthrough](http://codex.wordpress.org/Restoring_Your_Database_From_Backup) which you may find useful.

Now, check your website in your browser again, using your [IP address](/docs/getting-started#sph_finding-the-ip-address) for the URL as before. You should see all of your custom website content.

 {: .note }
>
> Your website may not function completely correctly if it is URL-dependent. WordPress is an example of a URL-dependent website. Because you're using the IP address instead of the URL, it gets confused. It should start working correctly once you move your domain to point to Linode.

### A Note About Email

Do you have an email address at your domain? If so, where are you hosting it?

If you use a separate email host like Google Apps, you will need to make sure you preserve the correct *MX records* for email when you move your domain.

If you use a mail service at your old host, you will need to think about where you're going to move your email. It's entirely possible to [run your own mail server](/docs/mailserver) at Linode, but that may be a little bit too involved for someone new to a self-managed server. Instead, we recommend that you research a few [external mail services](/docs/mailserver#sph_external-mail-services) and pick one to switch to for email.

Move Your Domain
----------------

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

Security
--------

Your server is only as secure as you make it. You should go through all of the instructions in the [Securing Your Server](/docs/securing-your-server) article to make sure your Linode is airtight.

Having Trouble? Contact Linode Support
--------------------------------------

If you've gotten stuck at any stage during this article, feel free to [contact Linode support](/docs/support) for assistance. We're available 24/7.



