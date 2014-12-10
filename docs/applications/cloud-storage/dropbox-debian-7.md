---
author:
    name: Linode
    email: docs@linode.com
description: 'Installing and Configuring Dropbox on Debian 7.4'
keywords: 'Dropbox,Debian,cloud storage'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: [ 'web-applications/cloud-storage/dropbox/debian-7.4' ]
modified: Wednesday, April 30th, 2014 
modified_by:
    name: Linode
published: 'Wednesday, April 30th, 2014'
title: 'Installing and Configuring Dropbox on Debian 7.4'
---

Dropbox is a place where you can store your documents, files, videos, and photographs. Whatever you choose to store will be available on all your computers, phones, and your Dropbox website account. You will be able to access your information from anywhere.

The instructions provided below will show you how to link your Linode to your Dropbox account.

Prerequisites
=============

The prerequisites you need are a powered on Linode and a Dropbox account. You do not even need to have a LAMP stack built in order to use Dropbox.

Installing and Configuring Dropbox
==================================

Any user account may be used for this installation.

1.  The Dropbox package will install and expand into your home directory with the command:

        cd ~ && wget -O - "https://www.dropbox.com/download?plat=lnx.x86_64" | tar xzf -

2.  Start the Dropbox daemon with the command:

        /home/<user>/.dropbox-dist/dropboxd &

3.  You will receive a message stating that the computer is not linked to your Dropbox account:

        This computer isn't linked to any Dropbox account...
        Please visit https://www.dropbox.com/cli_xxxxxxx to link this device.

4.  Copy and paste the address above into a web browser and log in to your Dropbox account. You should see the following message in your browser:

    [![Dropbox Account Linked](/docs/assets/1734-Dropbox-welcome.png)](/docs/assets/1734-Dropbox-welcome.png)

The terminal window on your Linode will show the following message:

    This computer is now linked to Dropbox. Welcome User

Testing the Link
================

Your existing Dropbox files will push to your Linode automatically. The `Dropbox` directory is the default file location. The path is as follows:

    /home/user/Dropbox

You can also create a file on your Linode, and it will push to your Dropbox account.

1.  Use the `touch` command to create a new file:

        touch Dropbox-Test

2.  Use a text editor to insert information into the newly created file:

        nano Dropbox-Test

3.  Now look at your Dropbox account in your web browser to make sure the file copied from your Linode.

More Information
================

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [ownCloud Administrator's Manual](http://doc.owncloud.org/server/6.0/admin_manual/installation/installation_source.html)
 - [Install Packages](http://software.opensuse.org/download.html?project=isv:ownCloud:community&package=owncloud)