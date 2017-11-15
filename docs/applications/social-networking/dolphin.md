---
author:
  name: Chris Ciufo
  email: docs@linode.com
description: Dolphin
keywords: ["social network", " dolphin", " boonex"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/social-networking/dolphin/']
modified: 2013-10-04
modified_by:
  name: Linode
published: 2012-07-10
title: Dolphin
deprecated: true
    - '[Boonex Home Page](http://www.boonex.com)'
    - '[Boonex Plug-in Market](http://www.boonex.com/market)'
    - '[Boonex Forums](http://www.boonex.com/forums/)'
---

[Dolphin](http://www.boonex.com/dolphin) is an open-source software package for building social networks, dating sites and niche communities. Dolphin's features include video chat, video messenger, iPhone app, Android App, Adobe AIR desktop app, groups, events, blogs, files, media sharing, a store, and more. Dolphin also allows developers to create plugins to add additional functionality or features. You can use the [Dolphin Market](http://www.boonex.com/market) to find extensions, design templates, mods, plugins, language packs and third party software integrations.

## Dolphin Prerequisites

Dolphin requires a standard LAMP (Linux, Apache, MySQL, and PHP) server. If haven't already created a LAMP server, or just want to make sure that you have everything installed, [take a look at our Hosting a Website guide](/docs/hosting-website). After you have a LAMP server running, read through the rest of this section to verify that you have the other prerequisites installed.

### Installing PHP Extensions

Dolphin requires the following PHP extensions to be installed and enabled: `mbstring`, `mysql`, `mysqli`, `curl`, `gd`, `xslt`. Here's how to install them:

1.  Install the extensions by entering the following command:

        sudo apt-get install php5-mysql php5-curl php5-gd php5-xsl

2.  Install `imagemagick` by entering the following command:

        sudo apt-get install imagemagick

3.  Save your changes by restarting the Apache web server:

        sudo /etc/init.d/apache2 restart

The required PHP extensions for Dolphin are now installed on your computer.

### Configuring PHP

You'll also need to make some modifications to your `php.ini` file. Here's how:

1.  Open the `php.ini` file for editing by entering the following command:

        sudo nano /etc/php5/apache2/php.ini

2.  If necessary, change the settings in that file, as shown below:

    {{< file-excerpt "/etc/php5/apache2/php.ini" ini >}}
memory_limit = 128M
post_max_size = 32M
upload_max_filesize = 16M
register_globals = Off
allow_url_fopen = On
allow_url_include = Off
magic_quotes_gpc = Off

{{< /file-excerpt >}}


3.  Save the changes to the file by pressing Control-X, pressing Y, and then pressing Enter.
4.  Save your changes by restarting the Apache web server:

        sudo /etc/init.d/apache2 restart

You have successfully modified your `php.ini` file for Dolphin.

### Setting Up Email

To configure Dolphin to send email, you'll need to install either Sendmail or [Postfix](/docs/email/postfix). You should be able to use [send-only exim](/docs/email/exim) as well.

### Installing JRE

If you'd like to run the Boonex RMS (Ray Media Server), which is a required component for some of Dolphin's features, like Flash chat, Flash instant messaging, boards, video recorder, video comments, you'll also need to install JRE (Java Runtime Environment) version 1.6. Here's how:

1.  Install JRE on your Linode by entering the following command:

        sudo apt-get install openjdk-6-jre

2.  RMS requires ports 1935, 1936, and 5080 to be open in your firewall. For more information, see the [Securing Your Server guide](/docs/securing-your-server#configure-a-firewall) and the [Firewall reference manuals](/docs/security/firewalls).

You have successfully installed JRE on your Linode.

## Installing Dolphin

Now that you've installed the necessary prerequisites, we can start installing Dolphin. We'll walk you through the process of downloading Dolphin, adding a new MySQL user and database, configuring permissions, running the install script, removing the installation directory, and finally logging in to the Dolphin admin panel.

 {{< note >}}
We assume that you followed the [Hosting a Website guide](/docs/hosting-website). If you're using a different DocumentRoot directive than `/home/example_user/public/example.com/public` for your virtual host, you'll need to update the path to correctly reflect your DocumentRoot.
{{< /note >}}

### Downloading Dolphin

First, you need to download the latest Dolphin release. Here's how:

 {{< note >}}
Be sure to check the [Dolphin web site](http://www.boonex.com/dolphin) to verify that you are downloading the latest release.
{{< /note >}}

1.  Change to your virtual host directory by entering the following command, replacing `example_user` with your username and `example.com` with your domain name:

        cd /home/example_user/public/example.com/public

2.  Create a new directory for Dolphin by entering the following command:

        mkdir dolphin

3.  Change to the Dolphin directory by entering the following command:

        cd dolphin

4.  Download the latest Dolphin release by entering the following command:

        wget http://get.boonex.com/Dolphin-v.7.0

5.  Unzip the archive by entering the following command:

        unzip Dolphin-v.7.0

You have successfully downloaded Dolphin and unzipped the archive on your Linode.

### Adding a MySQL User and Database

Next, you'll need to add a MySQL user and database. Here's how:

1.  Log in to MySQL by entering the following command:

        sudo mysql -uroot -p

2.  Enter your MySQL `root` password.
3.  Create a database for Dolphin by entering the following command:

        create database dolphindb;

4.  Create MySQL user for Dolphin by entering the following command, replacing `password` with the password for the new user:

        create user 'dolphin' identified by 'password';

5.  Grant the new MySQL `dolphin` user access to the `dolphin` database by entering the following command:

        grant all privileges on dolphindb.* to 'dolphin';

6.  Exit MySQL by entering the following command:

        quit;

You have successfully added a new MySQL user and created a database for Dolphin.

### Configuring Permissions

Now you'll need to adjust the permissions on Dolphin's files. Here's how:

1.  Change to Dolphin's directory in your virtual host by entering the following command, replacing `example_user` with your username and `example.com` with your domain name:

        cd /home/example_user/public/example.com/public/dolphin

2.  To change the permissions, enter the following commands, one by one. Make sure you copy the entire commands - most of them are long:

        chmod 777 ./inc ./backup ./cache ./cache_public ./langs ./media/app ./media/images ./media/images/banners ./media/images/blog ./media/images/classifieds ./media/images/membership ./media/images/profile ./media/images/profile_bg ./media/images/promo ./media/images/promo/original ./tmp ./plugins/htmlpurifier/standalone/HTMLPurifier/DefinitionCache/Serializer ./plugins/htmlpurifier/standalone/HTMLPurifier/DefinitionCache/Serializer/HTML ./plugins/htmlpurifier/standalone/HTMLPurifier/DefinitionCache/Serializer/CSS ./plugins/htmlpurifier/standalone/HTMLPurifier/DefinitionCache/Serializer/Test ./plugins/htmlpurifier/standalone/HTMLPurifier/DefinitionCache/Serializer/URI

        chmod 777 ./flash/modules/board/files ./flash/modules/chat/files ./flash/modules/photo/files ./flash/modules/im/files ./flash/modules/mp3/files ./flash/modules/video/files ./flash/modules/video_comments/files

        chmod 666 inc/prof.inc.php

        chmod 666 ./flash/modules/global/data/integration.dat ./flash/modules/board/xml/config.xml ./flash/modules/board/xml/langs.xml ./flash/modules/board/xml/main.xml ./flash/modules/board/xml/skins.xml ./flash/modules/chat/xml/config.xml ./flash/modules/chat/xml/langs.xml ./flash/modules/chat/xml/main.xml ./flash/modules/chat/xml/skins.xml ./flash/modules/desktop/xml/config.xml ./flash/modules/desktop/xml/langs.xml ./flash/modules/desktop/xml/main.xml ./flash/modules/desktop/xml/skins.xml ./flash/modules/global/xml/config.xml ./flash/modules/global/xml/main.xml ./flash/modules/im/xml/config.xml ./flash/modules/im/xml/langs.xml ./flash/modules/im/xml/main.xml ./flash/modules/im/xml/skins.xml ./flash/modules/mp3/xml/config.xml ./flash/modules/mp3/xml/langs.xml ./flash/modules/mp3/xml/main.xml ./flash/modules/mp3/xml/skins.xml ./flash/modules/photo/xml/config.xml ./flash/modules/photo/xml/langs.xml ./flash/modules/photo/xml/main.xml ./flash/modules/photo/xml/skins.xml ./flash/modules/video/xml/config.xml ./flash/modules/video/xml/langs.xml ./flash/modules/video/xml/main.xml ./flash/modules/video/xml/skins.xml ./flash/modules/video_comments/xml/config.xml ./flash/modules/video_comments/xml/langs.xml ./flash/modules/video_comments/xml/main.xml ./flash/modules/video_comments/xml/skins.xml

        chmod 777 flash/modules/global/app/ffmpeg.exe

You have successfully configured the permissions of Dolphin's installation files.

### Running the Install Script

Now you can run the install script from your browser. Here's how:

1.  Navigate to <http://example.com/dolphin/install/index.php>. Replace `example.com` with your domain name or IP address. The Dolphin installation page appears, as shown below.

[![Dolphin installer.](/docs/assets/1076-dolphin-1-small.png)](/docs/assets/861-Dolphin1.png)

2.  Click **Install** to begin. The webpage shown below appears.

[![Dolphin installer.](/docs/assets/1077-dolphin-2-small.png)](/docs/assets/862-Dolphin2.png)

[![Dolphin installer.](/docs/assets/1078-dolphin-3-small.png)](/docs/assets/863-Dolphin2a.png)

3.  All of the files listed should be *Writable*. Click **Next** to continue. The *Paths Check* webpage appears, as shown below.

[![Dolphin installer.](/docs/assets/1079-dolphin-4-small.png)](/docs/assets/864-Dolphin3.png)

4.  All of the paths listed should be "found". You should also see a **GD library installed** message at the bottom of the webpage. Click **Next** to continue. The *Database* webpage appears, as shown below.

[![Dolphin installer.](/docs/assets/1080-dolphin-5-small.png)](/docs/assets/865-Dolphin4.png)

5.  Enter the details for the Dolphin database you created earlier in this guide. Click **Next** to continue. The *Configuration* webpage appears, as shown below.

[![Dolphin installer.](/docs/assets/1081-dolphin-6-small.png)](/docs/assets/866-Dolphin5.png)

6.  Complete the form by entering the required information for your website, and then click **Next** to continue. The *Cron Jobs* webpage appears, as shown below.

[![Dolphin installer.](/docs/assets/1082-dolphin-7-small.png)](/docs/assets/867-Dolphin6.png)

7.  Now you'll need to set up a cron job specified on the webpage. To set up your cron job, you'll need to open your crontab for editing by entering the following command:

        sudo crontab -e

8.  Paste the following in to the crontab, making sure to replace `myemail@gmail.com` with the email address you entered for Dolphin:

        MAILTO=myemail@gmail.com
        * * * * * cd /var/www/periodic; /usr/bin/php -q cron.php

9.  To save the cron job, press Control-X, and then press Y to save.
10. Back in your web browser, click **Next**. The *Permissions Reversal* webpage appears, as shown below.

[![Dolphin installer.](/docs/assets/1083-dolphin-8-small.png)](/docs/assets/868-Dolphin7.png)

11. To reverse your permissions, enter the following commands, one by one. Be sure to replace `example_user` with your username, and `example.com` with your domain name:

        cd /home/example_user/public/example.com/public/dolphin
        find ./ -type d -exec chmod 755 {} \;
        sudo find ./ -type f -exec chmod 644 {} \;
        chmod 755 flash/modules/global/app/ffmpeg.exe;

12. Back in your web browser, click **Check**. The webpage should now indicate that the directory is "Non-writable", as shown below.

[![Dolphin installer.](/docs/assets/1084-dolphin-9-small.png)](/docs/assets/869-Dolphin7a.png)

13. Click **Next**. If the webpage shown below appears, You have successfully installed Dolphin on your Linode.

[![Dolphin installer.](/docs/assets/1085-dolphin-10-small.png)](/docs/assets/870-Dolphin8.png)

14. Copy the languages from the install directory by entering the following command. Be sure to replace `example_user` with your username, and `example.com` with your domain name:

        mv /home/example_user/public/example.com/public/dolphin/install/langs/* /home/example_user/public/example.com/public/dolphin/langs/

15. Now you'll want to remove the install directory by entering the following commands, one by one:

        cd /home/example_user/public/example.com/public/dolphin
        rm -rf install

16. Change the permissions of the `cache`, `cache_public`, `langs`, and `tmp` folders by entering the following commands, one by one:

        chmod 777 cache
        chmod 777 cache_public
        chmod 777 tmp

You have successfully installed Dolphin and removed the installation directory from your Linode.

### Logging in to the Dolphin Admin Panel

You can now log into your admin panel at <http://example.com/dolphin/administration/>. Replace `example.com` with your domain name or IP address. Try logging in now.

## Installing Dolphin Modules

Now you can install any of Dolphin's modules in the **Tools** \> **Modules** section. Take a look!

### Updating PHP Permissions

If you have PHP running as an Apache module, you may need to update permissions to allow installation of some of these modules.

 {{< note >}}
If you are running PHP in CGI mode, you can skip this section.
{{< /note >}}

To update permissions, enter the following commands, one by one:

    chmod 777 modules/boonex/avatar/data/images/ modules/boonex/avatar/data/tmp/
    chmod 777 modules/boonex/forum/classes modules/boonex/forum/conf modules/boonex/forum/layout modules/boonex/forum/log modules/boonex/forum/js modules/boonex/forum/cachejs modules/boonex/forum/data/attachments
    chmod 777 modules/boonex/photos/data/files
    chmod 777 modules/boonex/files/data/files
    chmod 777 modules/boonex/desktop/file
    chmod 777 modules/boonex/profile_customize/data/images
    chmod 666 modules/boonex/profiler/log/profiler.log
    chmod 777 modules/boonex/smtpmailer/data/logs

## Media Server (RMS) Installation

Dolphin comes with a free Media Server software (formerly Ray Media Server - RMS), based on open-source Red 5. Media Server is required for some of the media streaming features of some Dolphin modules. Here's how to install media server on your Linode:

1.  We'll be installing RMS into your /opt directory. Create a directory for the RMS install by entering the following command:

        sudo mkdir /opt/ray_server

2.  Change to the new directory by entering the following command:

        cd /opt/ray_server

3.  Download the latest Media Server for Linux by entering the following command:

        sudo wget http://get.boonex.com/RMS-LINUX-v.7.0.4

4.  Unpack the archive by entering the following command:

        sudo tar -xvf RMS-LINUX-v.7.0.4

5.  Move the files to `ray_server` by entering the following command:

        sudo cp RMS_7.0.4/* /opt/ray_server -R

6.  Remove the archive and Media Server folder by entering the following commands, one by one:

        sudo rm -rf RMS_7.0.4
        sudo rm -rf RMS-LINUX-v.7.0.4

7.  Open `access.dat` for editing by entering the following command:

        sudo nano /opt/ray_server/access.dat

8.  Enter all of the domains you want to have access to your RMS installation. They should be listed one per line, as shown below. Do not include <http://> or www:

    > {{< file >}}
/opt/ray\_server/access.dat

> domain1.com domain2.com domain2.net domain3.com domain3.org
{{< /file >}}

9.  Save the changes to `access.dat` by pressing Control-X, and then pressing Y.
10. Open the `red5.sh` file for editing by entering the following command:

        sudo nano /opt/ray_server/red5.sh

11. Set the JAVA\_HOME variable, as shown below:

    {{< file >}}
/opt/ray\_server/red5.sh
{{< /file >}}

    > JAVA\_HOME=/usr/share/java;

12. Save the changes to `red5.dat` by pressing Control-X, and then pressing Y.
13. Open the `rundaemon.sh` file for editing by entering the following command:

        sudo nano /opt/ray_server/run_daemon.sh

14. Set the RAY\_SERVER\_PATH variable, as shown below:

    {{< file >}}
/opt/ray\_server/run\_daemon.sh
{{< /file >}}

    > RAY\_SERVER\_PATH=/opt/ray\_server;

15. Save the changes to `run_daemon.sh` by pressing Control-Y, and then pressing Y.
16. Update the `webapp.virtualHosts` variable in the following files to your Linode's IP address. Use `nano` to edit the files, like you did earlier:

    /opt/ray\_server/webapps/board/WEB-INF/red5-web.properties /opt/ray\_server/webapps/chat/WEB-INF/red5-web.properties /opt/ray\_server/webapps/im/WEB-INF/red5-web.properties

17. Modify the permissions of all the `.sh` files in your Media Server directory by entering the following commands, one by one:

        cd /opt/ray_server
        sudo chmod -v 777 *.sh

18. Test your install by entering the following command:

        sudo ./red5.sh

19. A successful start should end with the following:

    [INFO] [Launcher:/installer] org.red5.server.service.Installer - Installer service created

20. If the start was successful, you can use the [Boonex Media Server Tester](http://www.boonex.com/rms.html) to verify that your RMS install is working properly. If you get "NetConnection.Connect.Success", everything is working.

 {{< note >}}
If you receive "NetConnection.Connect.Failed", make sure you have ports 1935 and 1936 open in your firewall. For more information, see the [Securing Your Server guide](/docs/securing-your-server#configure-a-firewall) and the [Firewall reference manuals](/docs/security/firewalls).
{{< /note >}}


21. If your test was successful, hold Control and press C to stop `red5.sh`.
22. Now you can start RMS as a background process by entering the following command:

        sudo ./run_daemon.sh

You have successfully installed RMS on your Linode.
