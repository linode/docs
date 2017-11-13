---
author:
  name: Linode
  email: docs@linode.com
description: 'Use the Girocco engine from repo.or.cz to provide easy access to Git repositories.'
keywords: ["git", "girocco", "gitweb", "project hosting", "social coding"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['application-stacks/git-repository-hosting/','applications/development/git-based-development-networks-with-girocco-on-debian-5-lenny/']
modified: 2013-09-24
modified_by:
  name: Linode
published: 2010-06-23
title: 'Git Based Development Networks with Girocco on Debian 5 (Lenny)'
deprecated: true
---

Girocco is the underlying engine created to power one of the first public git hosting services at [repo.or.cz](http://repo.or.cz/), and it allows users an easy to use web-based interface to create and view git repositories. Perhaps most excitingly, Girocco provides the ability to seamlessly "fork" an existing repository on the site and publish those changes without needing "push" access to the original repository, thus enabling a wide rage of distributed workflows and collaborative experiences.

Before beginning this guide, we assume that you've completed the [getting started guide](/docs/getting-started/). If you're new to using git, you may also find our [introduction to git](/docs/linux-tools/version-control/git) a helpful prerequisite. If you're new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/content/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics).

# Install Prerequisites

Before beginning the installation of Girocco, issue the following commands to ensure that your system is up to date and that you've installed the latest version of all software packages:

    apt-get update
    apt-get upgrade

Now issue the following command to install the required prerequisite software:

    apt-get install git-core build-essential netcat-openbsd apache2 wget libwww-perl libjson-perl librpc-xml-perl

The above command installs the Apache HTTP Server, and this guide depends upon running Apache. For more information regarding the setup and configuration of Apache, consider our series of [Apache guides](/docs/web-servers/apache/).

This guide does not include explicit instructions for downloading and installing a local send-only [mail server](/docs/email/), which you will need to do for some operations such as sending password recovery tokens. If you do not have a local MTA installed or configured already, begin by issuing the following command:

    apt-get install mailx

This will install the MTA "Exim." You can configure this MTA by issuing the following command and following the steps outlined in the [Exim send-only MTA guide](/docs/email/exim/send-only-mta-debian-5-lenny) guide:

    dpkg-reconfigure exim4-config

We are now ready to proceed with the installation and configuration of Girocco.

# Install Girocco

Begin by issuing the following commands to download the source code for Girocco:

    cd /opt/
    git clone git://repo.or.cz/girocco.git
    cd /opt/girocco/
    git submodule update --init

### Configure Girocco

Edit the configuration file for Girocco at `/opt/girocco/Girocco/Config.pm` and tailor the variables set therein. It might be prudent to create a backup of the "base" Girocco configuration, by issuing the following command:

    cp /opt/girocco/Girocco/Config.pm /opt/girocco/Girocco/BaseConfig-bakup.pm

Most of the default values in the `Config.pm` file can be left as the default. You will want to customize the `## Basic Settings` at the very beginning of the file, particularly the `name`, `title`, and `admin` variables. For the purposes of this guide we've modified the `## Paths` section as follows:

{{< file-excerpt "/opt/girocco/Girocco/Config.pm" perl >}}
## Paths

# Path where the main chunk of Girocco files will be installed
# This will get COMPLETELY OVERWRITTEN by each make install!!!
our $basedir = '/srv/repo/bin';

# The repository collection
our $reporoot = "/srv/repo/git";

# The chroot for ssh pushing; location for project database and other run-time
# data even in non-chroot setups
our $chroot = "/srv/repo/data";

# The gitweb files web directory (corresponds to $gitwebfiles)
our $webroot = "/srv/repo/public_html";

# The CGI-enabled web directory (corresponds to $gitweburl and $webadmurl)
our $cgiroot = "/srv/repo/public_html";

# A web-accessible symlink to $reporoot (corresponds to $httppullurl, can be undef)
our $webreporoot = "/srv/repo/public_html/r";

{{< /file-excerpt >}}


Similarly, edit the `URL addresses` section of the guide in accordance with the needs of your deployment as follows:

{{< file-excerpt "/opt/girocco/Girocco/Config.pm" perl >}}
## URL addresses

# URL of the gitweb.cgi script (must be in pathinfo mode)
our $gitweburl = "http://repo.example.com/w";

# URL of the extra gitweb files (CSS, .js files, images, ...)
our $gitwebfiles = "http://repo.example.com";

# URL of the Girocco CGI web admin interface (Girocco cgi/ subdirectory)
our $webadmurl = "http://repo.example.com";

# URL of the Girocco CGI html templater (Girocco cgi/html.cgi)
our $htmlurl = "http://repo.example.com/h";

# HTTP URL of the repository collection (undef if N/A)
our $httppullurl = "http://repo.example.com/r";

# Git URL of the repository collection (undef if N/A)
# (You need to set up git-daemon on your system, and Girocco will not
# do this particular thing for you.)
our $gitpullurl = "git://repo.example.com";

# Pushy URL of the repository collection (undef if N/A)
our $pushurl = "ssh://repo.example.com/srv/repo/git";

# URL of gitweb of this Girocco instance (set to undef if you're not nice
# to the community)
our $giroccourl = "$Girocco::Config::gitweburl/girocco.git";

{{< /file-excerpt >}}


Carefully consider the remaining configuration options in `/opt/girocco/Girocco/Config.pm`. The default settings are sufficient, but you may wish to modify configuration options to suit the needs of your deployment. When your configuration file is suitably configured for your needs, we recommend creating a backup of this file by issuing the following command:

    cp /opt/girocco/Girocco/Config.pm /opt/example-girocco-config.pm

### Configure System Files and Accounts

Issue the following commands to create the required directories and symbolic links:

    mkdir -p /srv/repo/data  /srv/repo/public_html/ /srv/repo/git/ /srv/repo/bin/ /root/repo /srv/repo/git/mob.git/
    mkdir -p /srv/www/repo.example.com/logs/
    ln -s /srv/repo/git /srv/repo/public_html/r
    ln -s /srv/repo/git /srv/git
    ln -s /srv/repo/public_html /srv/www/repo.example.com/public_html

You will need to create the `repo` user and account to isolate privileges for the repository users. Issue the following command:

    adduser --system --no-create-home --disabled-login --disabled-password --group repo

### Configure Helper Scripts

Issue the following command to copy the scripts `fixup.sh` and `fixupcheck.sh` to the `/root/repo` directory:

    cp /opt/girocco/jobs/fixup.sh /root/repo
    cp /opt/girocco/jobs/fixupcheck.sh /root/repo

These scripts are configured separately from the `Config.pm` file above. However, you must ensure that the settings correspond exactly. The following example contains the required modifications for our Girocco configuration:

{{< file-excerpt "/root/repo/fixupcheck.sh" bash >}}
## and does not reuse Girocco::Config settings.

## Girocco::Config::reporoot
reporoot="/srv/repo/git"
## Girocco::Config::chroot
chroot="/srv/repo/data"
## Girocco::Config::mirror_user
mirror_user="repo"
## Directory with this script and fixup.sh; WARNING: COPY THEM OVER to ~root!
## Otherwise, the owner of these scripts can execute anything as root.
fixup_dir="/root/repo"

{{< /file-excerpt >}}


### Build and Install Girocco

Issue the following commands to build and install the Girocco engine:

    cd /opt/girocco/
    make install

### Upgrading Girocco

In most cases, upgrading Girocco is as simple as running a sequence of commands to download new revisions of the software and rebuild the software. Those commands resemble the following:

    cd /opt/girocco/
    git pull
    git submodule update
    make install

However, it is prudent to ensure that additional upstream modifications to the `girocco/Girocco/Config.pm` will not affect your Girocco instance. If the `girocco/Girocco/Config.pm` file is modified during the `git pull` operation, be sure to inspect the changes very carefully. If the `git pull` command above fails with warnings regarding the `Config.pm` file, remove the configuration file, complete the `pull`, and then issue the following command to compare your configuration file with the new configuration file:

    diff /opt/girocco/Girocco/Config.pm /opt/example-girocco-config.pm

Modify your configuration file sufficiently with the new configuration options provided by the upstream and complete the rebuild process.

# Run Regular Tasks

To ensure complete functionality of the Girocco system, we need to run the `taskd.pl` and `jobd.sh` scripts as daemons to perform necessary system maintenance. Use or modify the following init script to control the daemon operations:

    cd /opt/
    wget -O repo-taskd-init-deb.sh http://www.linode.com/docs/assets/564-repo-taskd-init-deb.sh
    cp /opt/repo-taskd-init-deb.sh /etc/init.d/repod
    chmod +x /etc/init.d/repod
    /usr/sbin/update-rc.d -f repod defaults

Issue the following commands to start and stop the daemons in turn:

    /etc/init.d/repod start
    /etc/init.d/repod stop

From this point forward, these daemons will start following reboot cycles and can be controlled with the init script.

You will also want to create a `root` user cron job to regularly run the `/root/repo/fixupcheck.sh` script as root. Issue the following command as root:

    crontab -e

Then insert the following line:

{{< file-excerpt "root crontab" >}}
*/5 * * * * /usr/bin/nice -n 18 /root/repo/fixupcheck.sh

{{< /file-excerpt >}}

This configures the script to run once every 5 minutes. Monitor the length of time it takes to run the script, and the frequency of pushes, and adjust the frequency based on this data.

Additionally issue the following command to create a `repo` user cronjob:

    crontab -u repo -e

Then insert the following line:

{{< file-excerpt "repo crontab" >}}
*/5 * * * * /usr/bin/nice -n 18 /srv/repo/bin/jobd/jobd.sh -q --all-once

{{< /file-excerpt >}}

This configures the script to run once every 5 minutes. Monitor the length of time it takes to run the script, note any error messages this produces, and modify the frequency in response to this. You may also run the command `/srv/repo/bin/jobd/jobd.sh` in an interactive terminal as needed. Some tasks related to mirroring will not appear to succeed unless jobd is running constantly or runs at the appropriate time. You may want to run jobd in a GNU Screen session, by issuing the following command as the *repo* user:

    while ( true ); do /srv/repo/bin/jobd/jobd.sh; sleep 5; done

Additionally, add the following two lines as instructed by the installation script to your `/etc/rc.local` script to ensure that a chroot set up to isolate functions following reboot cycles:

{{< file-excerpt "/etc/rc.local" >}}
mount --bind /srv/repo/git /srv/repo/data/srv/git mount --bind /proc /srv/repo/data/proc

{{< /file-excerpt >}}


# Configure Web Server

For the purpose of this document we will set up the repository hosting service under the virtual host for the domain `repo.example.com`. You will need to ensure that [DNS is configured](/docs/tools-reference/linux-system-administration-basics#set-up-subdomains) for this domain. Additionally, ensure that the rewrite module is enabled by issuing the following commands:

    a2enmod rewrite
    /etc/init.d/apache2 restart

Furthermore, ensure that the paths specified in this file match the paths that you specified in the "Paths" section of the `/opt/girocco/Girocco/Config.pm` file. Consider the following:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
<VirtualHost repo.example.com:80>
        ServerName repo.example.com
        ServerAdmin username@example.com

        ErrorLog /srv/www/repo.example.com/logs/error.log
        CustomLog /srv/www/repo.example.com/logs/access.log combined

        DocumentRoot /srv/repo/public_html
        <Directory /srv/repo/public_html>
                Options Indexes FollowSymLinks MultiViews ExecCGI
                AllowOverride All
                Order allow,deny
                allow from all
                DirectoryIndex gitweb.cgi
                AddHandler cgi-script .cgi
        </Directory>

        ScriptAlias /w /srv/repo/public_html/gitweb.cgi
        ScriptAlias /h /srv/repo/public_html/html.cgi
</VirtualHost>

{{< /file-excerpt >}}


Congratulations! You may now visit `http://repo.example.com` to begin using your Girocco repository hosting system.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Girocco](http://repo.or.cz/w/girocco.git)
- [Repo.or.cz](http://repo.or.cz/)
- [Using Cron to Schedule Tasks](/docs/linux-tools/utilities/cron)
- [Managing Permissions with Unix Users and Groups](/docs/tools-reference/linux-users-and-groups)
- [Using GNU Screen](/docs/linux-tools/utilities/screen)



