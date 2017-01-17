---
author:
  name: Huw Evans
  email: me@huw.nu
description: 'How to run a private server for syncing Omni Group applications, like OmniFocus'
keywords: 'apache,web server,webdav,omni,omni group,omnifocus,omniplan,omni sync,omnigraffle,omnioutliner'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
title: 'Sync Your Omni Group Data with a Private WebDAV Server'
contributor:
  name: Huw Evans
  link: github.com/huw
---

The [Omni Group](https://www.omnigroup.com) makes a suite of useful productivity apps for OS X and iOS, such as [OmniFocus](https://www.omnigroup.com/omnifocus/), [OmniGraffle](https://www.omnigroup.com/omnigraffle/), [OmniOutliner](https://www.omnigroup.com/omnioutliner/), and [OmniPlan](https://www.omnigroup.com/omniplan/). To power these four applications across many devices, they need to sync somehow. While Omni offer [their own syncing service](https://sync.omnigroup.com), it might make more sense for you to keep the data more private and secure on your own server—if something goes wrong on Omni's side, it doesn't have to affect you or your day.

This guide will show you how to set up and run a WebDAV server, which is used to power the syncing procedure. It will also show you how to appropriately secure your data so it's inaccessible to the public web.

## Before You Begin

{: .caution}
>
> If your OmniFocus data is important to you, it always helps to take a backup. You can read about how to do that in [Omni Support's article](https://support.omnigroup.com/documentation/omnifocus/mac/2.4/en/archiving-and-backup/) (OmniFocus only).

1.  Ensure you have a complete and working Linode as per the instructions in the [Getting Started](/docs/getting-started) guide.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your local system. Then you can update your server using the following:

        sudo apt-get update && sudo apt-get upgrade

4. Set up your server using the appropriate guide in the [Hosting Websites for Apache](/docs/websites/apache/) section. It's necessary to have completed the sections on installing Apache, starting Apache at boot.

## Set Up Your Sync Folder

{: .note}
>
>You can store your Omni Sync data wherever you'd like—just replace the directories in the following commands with your one.

For this guide, we'll store our Omni Sync data in `/omnisync/`. Create this directory:

    sudo mkdir /omnisync/

You'll also need to set the permissions on this directory so it can be used by Apache. You can do this by setting its owner to the `www-data` user, which handles the files for a web server:

    sudo chown www-data /omnisync/

## Set Up a Password

{: .note}
>
> If your system can't find the `htdigest` command, you'll need to install the `apache2-utils` package. On Ubuntu or Debian, install it with `sudo apt-get install apache2-utils`.

To authenticate users, Apache uses a file with usernames and encrypted passwords. Whenever a user connects to the server and enters their username and password, the server encrypts their password and compares it with the one on file. If there's a match, then it lets the user through. You can create such a file and add a user to it by running this:

    sudo htdigest -c /etc/apache2/omnisync.htdigest "Omni Sync" <your_username>

Where you replace `<your_username>` with the username you want to log in with. Make sure you remember this username and password, it's what you'll use to log in with in your Omni apps.

The file you created is accessible to anyone on the system right now, but you can secure it by changing the permissions:

    sudo chown root:www-data /etc/apache2/omnisync.htdigest
    sudo chmod 640 /etc/apache2/omnisync.htdigest

## Configure Apache

Apache comes with a built-in WebDAV server and secure authentication modules. All you need to do is run the command `a2enmod` and Apache will handle the rest:

    sudo a2enmod dav_fs auth_digest authn_file

Now we can edit the main Apache file to register our changes and enable the WebDAV server. On most systems, this can be found at `/etc/apache2/sites-enabled/default`, but on Ubuntu it's `/etc/apache2/sites-enabled/default`. If you've just installed Apache and you're unsure, type `ls /etc/apache2/sites-enabled` and edit what should be the only file in there.

You'll need to add the following lines:

{: .file-excerpt}
/etc/apache2/sites-available/default
:   ~~~ apache
    Alias /omnisync/ /omnisync/

    <Location /omnisync/>
        DAV On
        AuthType Digest
        AuthName "Omni Sync"
        AuthDigestDomain /omnisync/
        AuthDigestProvider file
        AuthUserFile /etc/apache2/omnisync.htdigest
        Require valid-user
        Options -ExecCGI -FollowSymLinks -Includes
    </Location>
    ~~~

In this configuration, we setup any requests to `/omnisync/` to serve up the files at `/omnisync/`, and then turn on WebDAV for this location. We also enable the password protection you set up earlier, and finally disable some server options which could open it up to weaknesses (particularly if someone gets access to your WebDAV credentials).

You'll also need to restart the server to make these changes work:

    sudo service apache2 restart

## Configure Your Apps

In whatever Omni Group app you're using, open the Preferences menu ('OmniFocus > Preferences…', for example) and click 'Synchronization' in the top menu. Select 'Advanced (WebDAV)', and in the text field that opens, type in your server's address like so:

[![OmniFocus Sync Window](/docs/assets/omni-sync-small.png)](/docs/assets/omni-sync.png)

Then hit return or click 'Sync Now'. Your server should prompt you for a username and password, in which case it works! Enter your details and the server will start to sync your data appropriately.