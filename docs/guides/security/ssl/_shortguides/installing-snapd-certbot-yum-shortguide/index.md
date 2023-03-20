---
# Shortguide: Installing Snapd and Certbot through YUM

headless: true
show_on_rss_feed: false

# Ignore the below front matter. It is included to comply with existing tests.

slug: installing-snapd-certbot-yum-shortguide
title: "Shortguide"
description: "Shortguide"
keywords: ["shortguide"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-01
modified_by:
  name: Linode
authors: ["Linode"]
---

## Installing Snapd

[Snap](https://snapcraft.io/about) is a package manager developed by Canonical (creators of Ubuntu). Software is packaged as a *snap* (self-contained application and dependencies) and the *snapd* tool is used to manage these packages. Since certbot is packaged as a snap, we'll need to install snapd before installing certbot. While it's installed by default on Ubuntu 16.04 and later, its also available for most other Linux distributions, including CentOS/RHEL 7.

1.  Add the EPEL repository

        sudo yum install epel-release
        sudo yum upgrade

1.  Install snapd

        sudo yum install snapd

1.  Enable the main snap communication socket

        sudo systemctl enable --now snapd.socket

1.  Create a symbolic link

        sudo ln -s /var/lib/snapd/snap /snap

    To use the `snap` command, log out of the session and log back in.

## Installing Certbot

The next step is to install Certbot using the snap command.

1.  Remove any previously installed certbot packages to avoid conflicts with the new Snap package.

        sudo yum remove certbot

1.  Use Snap to install Certbot.

        sudo snap install --classic certbot

1.  Configure a symbolic link to the Certbot directory using the `ln` command.

        sudo ln -s /snap/bin/certbot /usr/bin/certbot