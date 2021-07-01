---
# Shortguide: Installing Snapd and Certbot through DNF on Fedora

headless: true
show_on_rss_feed: false

# Ignore the below front matter. It is included to comply with existing tests.

slug: installing-snapd-certbot-dnf-fedora-shortguide
title: "Shortguide"
description: "Shortguide"
keywords: ["shortguide"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-01
author:
  name: Linode
  email: docs@linode.com
modified_by:
  name: Linode
---

## Installing Snapd

[Snap](https://snapcraft.io/about) is a package manager developed by Canonical (creators of Ubuntu). Software is packaged as a *snap* (self-contained application and dependencies) and the *snapd* tool is used to manage these packages. Since certbot is packaged as a snap, we'll need to install snapd before installing certbot. While it's installed by default on Ubuntu 16.04 and later, its also available for most other Linux distributions, including Fedora.

1.  Install snapd

        sudo dnf install snapd

1.  Create a symbolic link

        sudo ln -s /var/lib/snapd/snap /snap

    To use the `snap` command, log out of the session and log back in.

## Installing Certbot

The next step is to install Certbot using the snap command.

1.  Remove any previously installed certbot packages to avoid conflicts with the new Snap package.

        sudo dnf remove certbot

1.  Use Snap to install Certbot.

        sudo snap install --classic certbot

1.  Configure a symbolic link to the Certbot directory using the `ln` command.

        sudo ln -s /snap/bin/certbot /usr/bin/certbot