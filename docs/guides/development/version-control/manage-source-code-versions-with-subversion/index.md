---
slug: manage-source-code-versions-with-subversion
deprecated: true
description: 'This guide shows how to manage source code with Subversion, an open source version control system.'
keywords: ["svn", "version control", "source control management", "subversion"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/linux-tools/version-control/svn/','/development/version-control/manage-source-code-versions-with-subversion/','/applications/development/manage-source-code-versions-with-subversion/']
modified: 2018-01-01
modified_by:
  name: Linode
published: 2009-12-15
title: Manage Source Code Versions with Subversion
external_resources:
 - '[Subversion Project Homepage](http://subversion.tigris.org/)'
 - '[The Subversion Book from O''Reilly](http://svnbook.red-bean.com/)'
tags: ["version control system"]
authors: ["Linode"]
---

Subversion (SVN) is a centralized [version control system](https://en.wikipedia.org/wiki/Version_control). Used by software developers to track changes during the production and maintenance of a project. SVN is a familiar and standard component in many development tool chains. Subversion was developed as a replacement for the Concurrent Versions System (CVS). SVN attempts to fix many of the major problems with CVS without requiring any paradigm shifts in the way software is developed:

-   *Commit* operations are [atomic](https://en.wikipedia.org/wiki/Atomic_commit). When a user saves a revision and sends it to the `svn` server, the server process will not put the commit data in the server's database until specifically told to.
-   Files and directories can be renamed while still maintaining a coherent record of the files.

Because Subversion uses a centralized architecture, in order to collaborate with others you must have a server to host the project. This guide outlines both the installation and setup of Subversion as well as the basic use of `svn` tools.

There are many options for accessing and managing Subversion repositories on local systems. You can use any Subversion client to connect to and interact with the repositories that you configure on your Linode. This guide will use standard shell commands and the `svn` utility to connect to Subversion repositories.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/products/platform/get-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  Complete the sections of our [Securing Your Server](/docs/products/compute/compute-instances/guides/set-up-and-secure/) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

    {{< note respectIndent=false >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Install Subversion

Subversion is included in the software repositories of most major Linux distributions. Installing the `subversion` package installs all of the tools that you need to administer and maintain your Subversion repositories, as well as client utilities.

**Debian and Ubuntu**

Install the Subversion repository:

    apt-get install subversion

**CentOS and Fedora**

Install the `subversion` package:

    yum install subversion

**Arch**

Install `svn` using pacman:

    pacman -S subversion

**Gentoo**

    emerge dev-util/subversion

## Create a Subversion Repository

1.  Create a directory to host your Subversion repositories:

        mkdir -p /srv/svn/

2.  Use `svnadmin` to create a new SVN repository:

        svnadmin create /srv/svn/subversion-test

    In this example, we've created a single `subversion-test` repository in the `/srv/svn/` directory. Because SVN allows you to only check out the specific portions of the repository you need, administrators will frequently create a single repository for a project and developers will only check out and work on the portions of the project that they need.

## Manage Subversion Repositories

The `svnadmin` tool provides a number of additional commands which are useful for administering and maintaining a Subversion repository.

### Verify Repository Integrity

Check the integrity of a repository:

    svnadmin verify /srv/svn/subversion-test

### Upgrade Schema

Upgrade a repository's data store to the latest version of the schema:

    svnadmin upgrade /srv/svn/subversion-test

### Back Up a Repository

In cases where you're manipulating Subversion's data store (e.g. an upgrade or moving to a new machine), it's useful to create a *dump* of your Subversion repository to store as a backup. By default, this contains the full content of each commit.

1.  Create a directory to store your backups:

        mkdir /var/svn

2.  Create an svn dump:

        svnadmin dump /srv/svn/subversion-test > /var/svn/subversion-test-1259853077.svn

    In this example, the repository is located at `/srv/svn/subversion-test` and the *dump file* is located at `/var/svn/subversion-test-1259853077.svn`. To make it easier to organize, name your svn backups with file names that refer to the revision or time when the backup was created, as well as the name of the repository contained in the backup.

3.  You can also save your backups in an incremental format, which outputs the differences between revisions rather than full copies of each revision:

        svnadmin dump /srv/svn/subversion-test --incremental > /var/svn/subversion-test-1259853077.svn

4.  Create an empty repository:

        svnadmin create /srv/svn/subversion-test-backup

5.  Load the backup into the empty repository:

        svnadmin load /srv/svn/subversion-test-backup < /var/svn/subversion-test-1259853077.svn

    {{< note respectIndent=false >}}
If you store critical information in a Subversion repository, you may wish to create backups automatically using a [cron job](/docs/guides/schedule-tasks-with-cron/).
{{< /note >}}

## Use Subversion for Version Control

By default, Subversion will track the version history for all of the files in a directory tree. Furthermore, Subversion does not specify or require any particular workflow or repository layout. However, many users organize their repositories into three directories:

* `trunk`: Where core development and changes are stored. A full copy of the project's source is located in the trunk directory.

* `tags`: Where snapshots of specific revisions, versions, or other meaningful points in the project are kept for future reference. Tags are frequently used to mark release versions.

* `branches`: Where copies of the project are stored in cases where developers need to track ongoing and potentially divergent revision histories. Branches are frequently used to manage the ongoing maintenance of legacy releases and host experimental development of new features.

Branches and tags are created using the `svn copy` command. Because Subversion tracks the history of a file independently of a filename or location on the file system, copies share history. As a result, branches and tags don't increase the amount of space a repository consumes.

Subversion is a centralized version control system, which means that in order to perform version control operations on your local copy you need to have an active connection to the server that hosts the repository. While you can add, move, and delete files without a network connection, *committing* changes to the repository requires an active connection to the repository. By convention, the local copy of your repository is called the *checkout* and individual sets of changes are called *commits*.

Subversion also makes it possible for you to only check out portions of a repository. If you only need to work with the `trunk` portion of the repository, you can specify the URL to only that path of the repository.

## Common Subversion Commands

If you have prior experience using a CVS, you may already be familiar with many of the commands used for interacting with Subversion repositories. Subversion aims to be compatible with CVS user workflows.

- `svn checkout [repository-path]` or `svn co [repository-path]`. The `[repository-path]` refers to the location of the remote repository. You must provide the location of the repository in the form of a URL.

  If you want to check out the repository at a specific revision, use the `-r [revision-number]` option with the `svn co` command to specify a particular revision.

- `svn update` or `svn up` downloads all changes and brings your copy up to date with any changes that have been committed since your last update. Run `svn update` frequently to avoid working on an out-of-date codebase and complicated commits.
- `svn commit` saves the changes to the current checkout and creates a new commit on the server for this change-set. When invoked without arguments, this opens your default text editor so that you can enter a commit message. If you want to specify a commit message from the command line, use `svn commit -m "[commit-message]"`.
- `svn add` stages a previously untracked file for the next commit.
- `svn delete` removes a file from the next commit and deletes it from the filesystem. This command should be used instead of your system's `rm` command to allow Subversion to track the removal of files. Subversion also provides the `svn rm` and `svn del` commands, which are functionally identical to `svn delete`
- `svn copy` creates a copy of a file in a new location and name in the repository. In these circumstances Subversion treats the history of both files (previous to the copy) as a single series of changes.
- `svn move` moves the specified file or files to a new location while retaining the history, despite the change in file name. Functionally, this is equivalent to running the `svn copy` command followed by the `svn delete` command.
- `svn diff` displays the differences between two revisions in the repository. Without any arguments it displays the differences between the current status of the working copy (i.e. checkout) and the latest version of the repository.
- `svn log` generates and displays the revision history of the current directory in the filesystem. You may also specify a specific file name, for instance `svn log roster.txt` produces the revision history for the `roster.txt` file. You can also use `svn log` to access the revision history of a remote repository:

        svn log http://example.com/repos/subversion-test/files/txt/ roster.txt data.txt

    In this example, `svn log` displays the revision history of the files `roster.txt` and `data.txt` in the remote repository.

## Access Subversion over HTTP

If you and your developers *only* need to access your repository over SSH with the `ssh+svn://` protocols, skip the remainder of this guide.

If you need to access your repository over the `http://` or `https://` protocols, configure Apache to host your Subversion repository.

### Install Apache and mod\_dav\_svn

Developers frequently access Subversion repositories via the SSH protocol and manage permissions and authentication credentials using OpenSSH and system user accounts. This can be difficult to manage if you are hosting a large number of repositories with a large number of users on a single server. For these cases, many users provide access to their repositories using the "WebDAV" protocol over HTTP or HTTPS with the [Apache Web Server](/docs/web-servers/apache/).

Install the Apache module `mod_dav_svn`:

* Debian and Ubuntu:

    1.  Install Apache:

            apt-get install libapache2-svn apache2

    2.  Restart Apache:

            systemctl restart apache2

* CentOS and Fedora:

        yum install mod_dav_svn httpd

* Arch and Gentoo:

    `mod_dav_svn` is installed by default with the Apache package.

    Gentoo users will need to compile the `subversion` package with the following `USE` flags:

        USE="apache2 webdav-neon"

### Configure Repository Permissions

To permit the Apache module `mod_dav_svn` to provide access to your Subversion repository, allow the web server process to access the repository.

On Debian and Ubuntu systems, Apache runs under the `www-data` user:

    chown -R www-data /srv/svn/subversion-test

On CentOS and Fedora systems, Apache runs as `apache` or `httpd`:

    chown -R apache /srv/svn/subversion-test
    chown -R httpd /srv/svn/subversion-test

On Arch Linux, Apache runs under the `nobody` user:

    chown -R nobody /srv/svn/subversion-test

### Add a User Group

If local system accounts need to access the repository, add those users to the group that has ownership of the given files. The following example creates a new group and adds a number of users to a group. You can then change the group ownership of the repository as described above.

1.  Create a new group:

        groupadd svnuser

2.  Add the example users, `user1`, `user2`, and `user3` to the `svnuser` group.\ (either create these users first with `useradd` or replace them with usernames already on your system):

        usermod -G svnuser user1
        usermod -G svnuser user2
        usermod -G svnuser user3

3.  Give the `svnuser` group ownership of the repository:

        chgrp -R svnuser /srv/svn/subversion-test

4.  In order to avoid permission conflicts with multiple users, set the *sticky bit* (`+s`) for the entire repository in a recursive (`-R`) fashion:

        chmod -R +s /srv/svn/subversion-test

    {{< note type="alert" respectIndent=false >}}
The sticky bit allows all users with access to the files (i.e. members of the group) to create files that are owned by the user or group that owns the directory, rather than by their own default user and group. This also allows users to execute scripts in these directories as the user that owns them, and thus poses a potential security risk. See our [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide for more information.
{{< /note >}}

### Configure the Apache Web Server

This section demonstrates configuration for Debian and Ubuntu systems. Similar steps will work on other distributions. Please adjust accordingly.

In this example, `subversion-test` corresponds to the name of the repository, and `/srv/www/svn.example.com` is a directory distinct from your Subversion repositories. Maintaining a separate `htpasswd` for each repository hosted on your Linode makes sense if each repository is used by a distinctly different set of users. Conversely, if each repository that you administer is used by a subset of a larger group of users you may wish to configure [user groups](/docs/guides/apache-access-control/#access-control-lists-with-groups) to organize your users' access.

1.  Enable the `mod_dav_svn` and `mod_dav` Apache modules. This will make it possible to use the `WebDAV` system to access the Subversion repository.

        a2enmod dav
        a2enmod dav_svn

2.  Restart Apache:

        systemctl restart apache2

3.  Configure HTTP AUTH passwords for Subversion users. You can read more about HTTP AUTH in our [Apache Authentication](/docs/guides/apache-access-control/) guide. Store your `htpasswd` file for your Subversion repositories in a location such as:

        /srv/www/svn.example.com/subversion-test.htpasswd

#### Manage a Single Repository

1.  In a text editor, open `/etc/apache2/sites-available/svn.example.com.conf` and add the following content. Replace `svn.example.com` with the public IP address or FQDN of your Linode:

    {{< file "/etc/apache2/sites-available/svn.example.com.conf" apache >}}
<VirtualHost *:80>
  ServerAdmin svnadmin@example.com
  ServerName svn.example.com
  ErrorLog /srv/www/svn.example.com/logs/error.log
  CustomLog /srv/www/svn.example.com/logs/access.log combined

  <Location />
    DAV svn
    SVNPath /srv/svn/subversion-test
    AuthType Basic
    AuthName "Subversion Repository"
    AuthUserFile /srv/www/svn.example.com/subversion-test.htpasswd
    Require valid-user
  </Location>
</VirtualHost>

{{< /file >}}

    This configuration forwards all requests for `http://svn.example.com/` to `mod_dav_svn`. This will provide an overview of the most recent revision of the repository within a web browser. Note that this setup provides *unencrypted* access to your repository over `http`.

2.  For a secure connection, configure Apache to [serve content with SSL](/docs/security/ssl/). Once your certificate files are in place, configure the virtual host to respond to requests on port `443` rather than `80`:

    {{< file "/etc/apache2/sites-available/svn.example.com.conf" apache >}}
<VirtualHost *:443>
  ServerAdmin svnadmin@example.com
  ServerName svn.example.com
  ErrorLog /srv/www/svn.example.com/logs/error.log
  CustomLog /srv/www/svn.example.com/logs/access.log combined

  SSLEngine On
  SSLCertificateFile /etc/apache2/ssl/apache.pem
  SSLCertificateKeyFile /etc/apache2/ssl/apache.key

  <Location />
    DAV svn
    SVNPath /srv/svn/subversion-test
    AuthType Basic
    AuthName "Subversion Repository"
    AuthUserFile /srv/www/svn.example.com/subversion-test.htpasswd
    Require valid-user
  </Location>
</VirtualHost>

{{< /file >}}

3.  Create the log file directory specified in the virtual host block:

        mkdir /srv/www/svn.example.com/logs/

4.  Disable the default site and enable the new site configuration:

        a2dissite 000-default.conf
        a2ensite svn.example.com

5.  Restart Apache:

        systemctl restart apache2

6.  Navigate to your Linode's IP or FQDN in a web browser; you should see a brief overview of the most recent version in your web browser.

#### Manage Multiple Repositories

There are two methods for specifying Subversion repositories to `mod_dav_svn`. The first is using the `SVNParentPath`. This directive is useful if you need to provide multiple repositories, located in adjacent directories. For example:

{{< file "/etc/apache2/sites-available/svn.example.com.conf" apache >}}
<VirtualHost *:80>
    ServerAdmin svnadmin@example.com
    ServerName svn.example.com
    ErrorLog /srv/www/svn.example.com/logs/error.log
    CustomLog /srv/www/svn.example.com/logs/access.log combined
    <Location />
        DAV svn
        SVNParentPath /srv/svn
        AuthType Basic
        AuthName "Subversion Repository"
        AuthUserFile /srv/www/svn.example.com/shared.htpasswd
        Require valid-user
    </Location>
</VirtualHost>

{{< /file >}}

All repositories located within `/srv/svn` on the file system will be accessible over HTTP at URLs that begin with `http://svn.example.com/`.

As another option, you can specify multiple repositories using the `SVNPath` directive in multiple `location` blocks. In the following example, the Subversion repository located on the file system at `/srv/svn/subversion-test` will be accessible over HTTP at the URL `http://example.com/subversion-test`, while the repository at `/srv/svn/subversion-test` will be accessible at `http://example.com/subversion-test`. In this example each repository will use a separate set of user credentials.

{{< file "/etc/apache2/sites-available/svn.example.com.conf" apache >}}
<VirtualHost *:80>
    ServerAdmin admin@example.com
    ServerName example.com
    ServerAlias www.example.com

    DocumentRoot /srv/www/example.net/public_html/
    ErrorLog /srv/www/example.com/logs/error.log
    CustomLog /srv/www/example.com/logs/access.log combined

    <Location /subversion-test>
        DAV svn
        SVNPath /srv/svn/subversion-test
        AuthType Basic
        AuthName "Morris Subversion Repository"
        AuthUserFile /srv/www/example.com/subversion-test.htpasswd
        Require valid-user
    </Location>
    <Location /subversion-test>
        DAV svn
        SVNPath /srv/svn/subversion-test
        AuthType Basic
        AuthName "Molly Subversion Repository"
        AuthUserFile /srv/www/example.com/subversion-test.htpasswd
        Require valid-user
    </Location>
</VirtualHost>

{{< /file >}}


#### Provide Read-Only Access

All of the preceding cases have required that a user log in before accessing your repository. If you would like to allow read only public access to your repository, add `LimitExcept` blocks to your virtual hosts:

{{< file "Apache Virtual Host Configuration" apache >}}
<VirtualHost *:80>
   ServerAdmin svnadmin@example.com
   ServerName svn.example.com
   ErrorLog /srv/www/svn.example.com/logs/error.log
   CustomLog /srv/www/svn.example.com/logs/access.log combined

   <Location />
       DAV svn
       SVNPath /srv/svn/subversion-test
       AuthType Basic
       AuthName "Subversion Repository"
       AuthUserFile /srv/www/svn.example.com/subversion-test.htpasswd
       <LimitExcept GET PROPFIND OPTIONS REPORT>
           Require valid-user
       </LimitExcept>
   </Location>
</VirtualHost>

{{< /file >}}
