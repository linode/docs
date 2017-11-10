---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Set up TeamSpeak on your Linode and chat with your friends or coworkers while gaming, working, or otherwise'
keywords: ["teamspeak", "virtual intercom", "chat", "game server"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2015-07-23
modified: 2015-07-23
modified_by:
    name: Linode
title: 'Install a TeamSpeak Server on Linode'
contributor:
    name: Scott Somner
external_resources:
 - '[TeamSpeak KB](https://support.teamspeakusa.com/index.php?/Knowledgebase/List/Index/10/english)'
 - '[Changing the serveradmin Password](https://support.teamspeakusa.com/index.php?/Knowledgebase/Article/View/326/0/how-do-i-change-or-reset-the-password-of-the-serveradmin-server-query-account)'
aliases: ['applications/game-servers/install-teamspeak/']
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and
earn $250 per published guide.*

<hr>

This guide will show you how to install a TeamSpeak Server on your Linode. TeamSpeak is a voice server or a "virtual intercom" that lets you talk to others online. It's commonly used for gaming, but people also use it to collaborate with their work groups, hobby projects, or just to chat with friends and family.

## Before You Begin

* We suggest following the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides.

* Install the [TeamSpeak](http://www.teamspeak.com/) client on your local computer.

* While Teamspeak should run on any Linux distribution, the instructions provided here are tested on Ubuntu / Debian.

## Install TeamSpeak

### Getting the TeamSpeak Download

1.  On your own computer visit [teamspeak.com](http://www.teamspeak.com/).

2.  From the Downloads menu in the upper right click on **TeamSpeak 3**.

3.  Under **Linux**, select **Server AMD64**

5.  Click the download button.

6.  Read and agree to the license agreement, then click **Submit**.

7.  On the download page copy the download link; you can quit the automatic download.

### Fetch and Extract Teamspeak

1.  Log into your Linode via SSH, and create a new directory:

        mkdir teamspeak

2.  Change to the new directory:

        cd teamspeak

3.  Download the teamspeak package, replacing the URL with the one copied in the previous section:

        wget http://dl.4players.de/ts/releases/3.0.11.3/teamspeak3-server_linux-amd64-3.0.11.3.tar.gz

4.  Extract the package with tar:

        tar -xvf teamspeak3-server_linux-amd64-3.0.11.3.tar.gz


## Running TeamSpeak

Once TeamSpeak is downloaded, you're ready to start the server. TeamSpeak comes pre-compiled so no configuration or building is required.

1.  Change to the newly-extracted directory

        cd teamspeak3-server_linux-amd64

2.  Run the server startup script

        ./ts3server_startscript.sh start

3.  Make note of the login name, password, and token that are printed the first time the server is started. You'll need them when you connect the first time:

        ------------------------------------------------------------------
                              I M P O R T A N T
        ------------------------------------------------------------------
                       Server Query Admin Account created
                 loginname= "serveradmin", password= "RQkvl+Ip"
        ------------------------------------------------------------------


        ------------------------------------------------------------------
                              I M P O R T A N T
        ------------------------------------------------------------------
              ServerAdmin privilege key created, please use it to gain
              serveradmin rights for your virtualserver. please
              also check the doc/privilegekey_guide.txt for details.

               token=nfV+rTxhgQRR6m1Nn3royO08Sljeh1Ysm9bZ5JNw
        ------------------------------------------------------------------

4.  From your computer, open your TeamSpeak client, and open the connect dialog.

    ![The connect dialog box](/docs/assets/teamspeak-connect.png)

5.  Enter the IP address of your Linode or a domain pointed to it, the nickname `serveradmin` and the password as provided.

6.  Once the connection is successful the client will ask you for the security token. Copy it from the SSH session and paste it into the dialog box in the client.


## Making TeamSpeak Start Automatically

If you want TeamSpeak to automatically start every time your Linode boots, follow these instructions.

1.  Check the server path to your TeamSpeak directory:

        pwd

    The output should be similar to:

        /home/user/teamspeak/teamspeak3-server_linux-amd64

2.  As `root` or with `sudo`, create a new file called `/etc/init/teamspeak.conf` and insert the following code, replacing `user` with your username and `/home/user/teamspeak/teamspeak3-server_linux-amd64/` with the path noted above:

    {{< file "/etc/init/teamspeak.conf" aconf >}}
#!/bin/sh
chdir /home/user/teamspeak/teamspeak3-server_linux-amd64/

respawn

setuid user
setgid user

exec /home/user/teamspeak/teamspeak3-server_linux-amd64/ts3server_minimal_runscript.sh

start on runlevel [2]
stop on runlevel [013456]

{{< /file >}}


    The next time your Linode reboots TeamSpeak will start automatically.

## Firewall Configuration

If you use a firewall the following ports will need to be opened: 9987, 30033, 10011, and 41144.  Here's the commands to open those ports in IPtables. Run each line as a separate command.

    iptables -A INPUT -p udp --dport 9987 -j ACCEPT
    iptables -A INPUT -p tcp --dport 30033 -j ACCEPT
    iptables -A INPUT -p tcp --dport 10011 -j ACCEPT
    iptables -A INPUT -p tcp --dport 41144 -j ACCEPT

{{< note >}}
If you've configured your firewall according to our [Securing Your Server](/docs/security/securing-your-server/) guide, you'll need to add these exceptions to `/etc/iptables.firewall.rules` to be reboot-persistent.
{{< /note >}}
