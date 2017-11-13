---
author:
  name: Linode
  email: docs@linode.com
description: 'Managing source control with Subversion, an open source version control system.'
keywords: ["svn", "version control", "source control management"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/version-control/svn/','applications/development/manage-source-code-versions-with-subversion/']
modified: 2011-06-07
modified_by:
  name: Linode
published: 2009-12-15
title: Manage Source Code Versions with Subversion
external_resources:
 - '[Subversion Project Homepage](http://subversion.tigris.org/)'
 - '[The Subversion Book from O''Reilly](http://svnbook.red-bean.com/)'
---

Subversion is a traditional centralized version control system. Used by software developers to track changes during the production and maintenance of a project, SVN is a familiar and standard component in many development tool chains. Subversion was developed as a replacement for the "CVS" version control system. SVN attempts to fix many of the major problems with the CVS system without requiring any paradigm shifts in the way software is developed.

As a modern system, Subversion "fixes" a number of issues that have been historical problems with CVS:

-   "Commit" operations are atomic. When a user saves a revision and sends it to the `svn` server, the server process will not put the commit data in the server's database.
-   Files and directories can be renamed while still maintaining a coherent record of the files.

Because subversion uses a centralized architecture, in order to collaborate with others you must have a server to host the project. This document outlines both the installation and setup of subversion as well as the basic use of `svn` tools.

There are a number of options for accessing and managing Subversion repositories on local systems. Your favorite subversion client will be connected to and interact with the repositories that you configure on your Linode. If you access and use your subversion repositories using the standard shell commands and `svn` command, the commands and processes in this guide will be directly applicable to your local environment.

Before installing subversion we assume that you have followed our [getting started](/docs/getting-started/) guide. If you're new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics). Additionally, if you intended to access Subversion over HTTP, this document uses the [Apache HTTP server](/content/web-servers/apache/), which you may want to configure beyond the scope of this document.

## Installing Subversion

Subversion is included in the software repositories of most major Linux distributions. Installing the `subversion` package installs all of the tools that you need in order to properly administer and maintain your subversion repositories. Additionally, tools needed to access subversion repositories as clients will be installed on your system.

On Debian and Ubuntu systems, install the subversion repository by issuing the following command:

    apt-get install subversion

On CentOS and Fedora Systems, install the `subversion` package with the following command:

    yum install subversion

On Arch Linux, install `svn` with the following command:

    pacman -S subversion

On Gentoo Linux, Subversion can be installed by issuing this command:

    emerge dev-util/subversion

## Creating a Subversion Repository

We'll host our subversion repository in the directories beneath the `/srv/svn/repos/` directory on your Linode's filesystem. To create this directory, use the following command:

    mkdir -p /srv/svn/

Now, using the `svnadmin` tool, create a new SVN repository using the following command.

    svnadmin create /srv/svn/morris

In this example, we've created a single `morris` repository beneath the `/srv/svn/` directory. Because SVN allows you to only check out the specific portions of the repository you need, administrators will frequently create a single repository for a project and developers will only check out and work on the portions of the project that they need.

## Administering Subversion Repositories

The `svnadmin` tool provides a number of additional commands which are useful for administering and maintaining a Subversion repository. Above, we used the `svnadmin create` command, which creates a new repository at a specified path. By default, repositories created in this manner use the "FSFS" data storage system. If you want to use the alternate "BerkleyDB" storage system, issue the following command:

    svnadmin create /srv/svn/molly --fs-type bdb

Although the systems are mostly equivalent in functionally, there are some additional limitations with the BerkelyDB backend. We recommend using the default FSFS unless you have a specific need for the BekerlyDB system. The following command verifies the integrity of a repository:

    svnadmin verify /srv/svn/morris

The administration tool also provides capabilities facilitate the upgrade of a repository's data store to the latest version of the schema. Issue the following command for an upgrade:

    svnadmin upgrade /srv/svn/morris

In cases where you're manipulating Subversion's data store (as in an upgrade or moving to a new machine), it's useful to create a "dump" of your Subversion repository to store as a backup. By default, this contains the full content of each commit. Create an svn "dump" by issuing a command in the following form:

    svnadmin dump /srv/svn/morris > /var/svn/morris-1259853077.svn

In this example, the repository is located at `/srv/svn/morris` and the "dump file" is located at `/var/svn/morris-1259853077.svn`. We advise you to name your svn backups with file names that refer to the revision or time when the backup was created, as well as the name of the repository contained in the backup.

If you want to save your backups in an incremental format, which outputs the differences between revisions rather than full copies of the revisions, issue a command in the following form:

    svnadmin dump /srv/svn/molly --incremental > /var/svn/molly-1259853077.svn

If at any time you need to create a repository from a back up, issue a command in the following form:

    svnadmin load /srv/svn/morris-backup < /var/svn/morris-1259853077.svn

This will create a new repository at `/srv/svn/morris-backup` with the history from the svn backup file located at `/var/svn/morris-1259853077.svn`.

If you store critical information in a Subversion repository, you may wish to create backups automatically using a [cron job](/docs/linux-tools/utilities/cron).

## Using Subversion for Version Control

By default, Subversion will track the version history for all of the files in a directory tree. Furthermore, Subversion does not specify or require any particular workflow or repository layout. However, many users organize their repositories with three directories:

-   The `trunk/` directory is where core development and changes are stored. A full copy of the project's "source" is located in the trunk directory.
-   The `tags/` directory is where snapshots of specific revisions, versions, or other meaningful points in the project are kept for future reference. Tags are frequently used to mark release versions.
-   The `branches/` directory is where copies of the project are stored in cases where developers need to track ongoing and potentially divergent revision histories. Branches are frequently used to manage the ongoing maintenance of legacy releases and host experimental development of new features.

Branches and tags are created using the `svn copy` command. Because Subversion tracks the history of a file independently of a filename or location on the file system, copies share history. As a result, branches and tags don't increase the amount of space a repository consumes.

If you have a complex project, it might not make sense to have a single `trunk/` directory and set of `tags/` and `branches/` directories at the top level of your repository. You may consider having a number of top-level directories for the components of your project, rather than having the "`trunk/`, `tags/`, and `branches/` structure" created within each of these components.

Subversion is a centralized version control system, which means that in order to perform version control operations on your local copy or "checkout," you need to have an active connection to the server that provides the repository. While you can add, move, and delete files without a network connection, "committing" changes to the repository, require an active connection to the repository. By convention, the local copy of your repository is called the "checkout" and individual sets of changes are called "commits."

Subversion also makes it possible for you to only check out portions of your repository. If you only need to work with the `trunk/` portion of the repository, you can specify the URL to only that path of the repository.

## Common Subversion Commands

If you have prior experience using CVS, you will already be familiar with many of the commands used for interacting with subversion repositories. From the user's perspective, Subversion aims to be compatible with CVS workflows.

-   `svn checkout [repository-path]` or `svn co [repository-path]`. The `[repository-path]` refers to the location of the remote repository. You must provide the location of the repository in the form of a URL.

    If you want to check out the repository at a specific revision, use the `-r [revision-number]` option with the `svn co` command to specify a particular revision.

-   `svn update` or `svn up` downloads all changes and brings your copy up to date with any changes that might have been committed since your last update. You should run `svn update` frequently to avoid working on an out of date code base and complicated commits.
-   `svn commit` saves the changes to the current checkout and creates a new commit on the server for this change set. Invoked without arguments, this opens your default text editor so that you can enter a commit message. If you want to specific a commit message on the command line, use the `svn commit -m "[commit-message]"` argument.
-   `svn add` stages a previously un-tracked file for the next commit.
-   `svn delete` removes a file from the next commit and deletes it from the filesystem. This command should be used instead of your system's `rm` command to allow subversion to track the removal of files. Subversion also provides the `svn rm` and `svn del` commands, which are functionally identical to `svn delete`
-   `svn copy` creates a copy of a file in a new location and name in the repository. In these circumstances subversion treats the history of both files (previous to the copy) as a single series of changes.
-   `svn move` moves the specified file or files to a new location while retaining the history, despite the change in file name. Functionally, this is equivalent to running the `svn copy` command followed by the `svn delete` command.
-   `svn diff` displays the differences between two revisions in the repository. Without any arguments it displays the differences between the current status of the working copy (i.e. checkout) and the latest version of the repository.
-   `svn log` generates and displays the revision history of an the current directory in the filesystem. You may also specify a specific file name, for instance `svn log roster.txt` produces the revision history for the `roster.txt` file. You may also use `svn log` to access the revision history of a remote repository. These commands take the form of:

        svn log http://example.com/repos/morris/files/txt/ roster.txt data.txt

    In this example, `svn log` displays the revision history of the files `roster.txt` and `data.txt` in the remote repository.

## Accessing SVN over HTTP

If you and your developers *only* need to access your repository over SSH, with the `ssh+svn://` protocols, then you can safely disregard the remainder of this guide. If you need to access your repository over the `http://` or `https://` protocols, you will want to configure Apache to host your Subversion repository.

### Installing Apache and mod\_dav\_svn

Developers frequently access Subversion repositories via the SSH protocol, and manage permissions and authentication credentials using OpenSSH and system user accounts. This can be difficult to manage if you are hosting a large number of repositories with a large number of users on a single server. For these cases, many users provide access to their repositories using the "WebDAV" protocol over HTTP or HTTPS with the [Apache Web Server](/docs/web-servers/apache/).

In order to make this possible, you must install the Apache module `mod_dav_svn`, with one of the following commands, depending on your operating system.

For Debian and Ubuntu systems issue the following command:

    apt-get install libapache2-svn apache2

Afterwards, you'll need to restart Apache by running the `/etc/init.d/apache2 restart` command.

For CentOS and Fedora systems issue the following command:

    yum install mod_dav_svn httpd

For Arch Linux Systems, `mod_dav_svn` is installed by default with the Apache package. Gentoo Linux users need to compile the `subversion` package with the following `USE` flags.

    USE="apache2 webdav-neon"

### Configuring Repository Permissions

In order to permit the Apache module `mod_dav_svn` to provide access to your Subversion repository, we need to allow the web server process to access the repository. Issue one of the following commands to allow the web server to "own" the repository in question:

    chown -R www-data /srv/svn/morris
    chown -R apache /srv/svn/morris
    chown -R httpd /srv/svn/morris
    chown -R nobody /srv/svn/morris

On Debian and Ubuntu systems, Apache runs under the `www-data` user. On CentOS and Fedora systems, Apache runs as `apache`. On Arch Linux, Apache runs under the `nobody` user. Choose the appropriate command based on the distribution of Linux that you're running on your Linode.

If you need to access the repository with local system accounts, you will want the users to belong to the group that has group ownership to the given files. In the following example we'll create a new group and add a number of users to a group. We'll then change the group ownership of the repository as described above. We'll begin by creating a new group using the following command:

    groupadd svnuser

In this case we're adding the users `username`, `foreman`, and `hobby` to the user group `svnuser`. Issue the following commands, modified to reflect the names of your group and users:

    usermod -G svnuser username
    usermod -G svnuser foreman
    usermod -G svnuser hobby

Modify the group ownership of the repository so that the new group "owns" the repository. Issue the following command:

    chgrp -R svnuser /srv/svn/morris

In order to avoid permission conflicts with multiple users, set the "sticky" bit for the entire repository in a recursive fashion. Issue the following command:

    chmod -R +s /srv/svn/morris

The sticky bit allows all users with access to the files, by virtue of their group membership, to create files that are owned by the user and group that owns the directory, rather than by their own default user and group. This also allows users to execute scripts in these directories, typically the "hooks," as the user that owns them, and thus poses a potential security risk. If you would like to learn more about [groups and UNIX permissions consult this overview](/docs/tools-reference/linux-users-and-groups).

### Configuring the Apache Web Server

Begin by enabling the `mod_dav_svn` and the `mod_dav` Apache module. This will make it possible to use the `WebDAV` system to access the Subversion repository. In Debian and Ubuntu these modules can be enabled with the following commands:

    a2enmod dav
    a2enmod dav_svn

When the modules have been loaded, restart the server to load the modules into the server by issuing the appropriate command for your distribution of Linux from the following options:

    /etc/init.d/apache2 restart

    /etc/init.d/httpd restart

    /etc/rc.d/httpd restart

At this juncture, you will want to configure HTTP AUTH passwords for your subversion users. You can read more about HTTP AUTH in our documentation of [controlling access to websites with Apache](/docs/web-servers/apache/configuration/http-authentication). We recommend storing your `htpasswd` file for your Subversion repositories in a location similar to the following:

    /srv/www/svn.example.com/morris.htpasswd

In this example, `morris` corresponds to the name of the repository, and `/srv/www/svn.example.com` is a directory distinct from your Subversion repositories. Maintaining a separate `htpasswd` for each repository hosted on your Linode makes sense if each repository is used by a distinctly different set of users. Conversely, if each repository that you administer is used by a subset of a larger group of users you may wish to configure [user groups](/docs/web-servers/apache/configuration/http-authentication#access-control-lists-with-groups) to organize your users' access.

#### Managing A Single Repository

In the following setup we've granted access to the `morris` Subversion repository, running under a virtual host for the `svn.example.com` domain. You can configure Subversion repositories under existing virtual hosts, if that makes more sense in the context of your deployment. You can read more about configuring Apache [locations blocks](/docs/web-servers/apache/configuration/configuration-structure#location-options) elsewhere in Linode's guides and tutorials.

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
<VirtualHost *:80>
  ServerAdmin svnadmin@example.com
  ServerName svn.example.com
  ErrorLog /srv/www/svn.example.com/logs/error.log
  CustomLog /srv/www/svn.example.com/logs/access.log combined

  <Location />
    DAV svn
    SVNPath /srv/svn/morris
    AuthType Basic
    AuthName "Subversion Repository"
    AuthUserFile /srv/www/svn.example.com/morris.htpasswd
    Require valid-user
  </Location>
</VirtualHost>

{{< /file-excerpt >}}


In this configuration, all requests for `http://svn.example.com/` will be directed to `mod_dav_svn`. In a web browser this will provide an overview of the most recent revision of the repository. Note that this setup provides *unencrypted* access to your repository over `http`.

If you want secure, encrypted access to your data, configure Apache to [serve content with SSL](/docs/web-servers/apache/ssl-guides/).

Once your certificate files are in place set up the virtual host to respond to requests on port `443` rather than `80`. An SSL enabled virtual host might resemble the following:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
<VirtualHost 12.34.56.78:443>
  ServerAdmin svnadmin@example.com
  ServerName svn.example.com
  ErrorLog /srv/www/svn.example.com/logs/error.log
  CustomLog /srv/www/svn.example.com/logs/access.log combined

  SSLEngine On
  SSLCertificateFile /etc/apache2/ssl/apache.pem
  SSLCertificateKeyFile /etc/apache2/ssl/apache.key

  <Location />
    DAV svn
    SVNPath /srv/svn/morris
    AuthType Basic
    AuthName "Subversion Repository"
    AuthUserFile /srv/www/svn.example.com/morris.htpasswd
    Require valid-user
  </Location>
</VirtualHost>

{{< /file-excerpt >}}


When you have completed the creation and modification of your `VirtualHost` entries, ensure that you've reloaded your Apache configuration so that the changes will take effect. Reload the Apache configuration by issuing the appropriate command for your operating system from the following options:

    /etc/init.d/apache2 reload
    /etc/init.d/httpd reload
    /etc/rc.d/httpd reload

Once Apache has reloaded the configuration, you should be able to visit your repositories in a web browser. In our examples these repositories would be accessible at the following URLs:

    http://svn.example.com/
    https://svn.example.com/

Once you've validated with HTTP AUTH, you should be able to see a brief overview of the most recent version of your repository in the web browser. You can also check out copies of your repository from these URLs. If you want to install a third-party Subversion repository browser you can do so at this juncture.

#### Managing Multiple Repositories

There are two methods for specifying Subversion repositories to `mod_dav_svn`. The first is using the `SVNParentPath`. This directive is useful if you need to provide multiple repositories, located in adjacent directories. For example:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
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

{{< /file-excerpt >}}


Here, all repositories located beneath `/srv/svn` on the file system will be accessible over HTTP at URLs that begin with `http://svn.example.com/`.

As an alternate option, you can specify multiple repositories using the `SVNPath` directive in multiple `location` blocks. In the following example, the Subversion repository located on the file system at `/srv/svn/morris` will be accessible over HTTP at the URL `http://example.com/morris`, while the repository at `/srv/svn/molly` will be accessible at `http://example.com/molly`. In this example each repository will use a separate set of user credentials.

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
<VirtualHost *:80>
    ServerAdmin admin@example.com
    ServerName example.com
    ServerAlias www.example.com

    DocumentRoot /srv/www/example.net/public_html/
    ErrorLog /srv/www/example.com/logs/error.log
    CustomLog /srv/www/example.com/logs/access.log combined

    <Location /morris>
        DAV svn
        SVNPath /srv/svn/morris
        AuthType Basic
        AuthName "Morris Subversion Repository"
        AuthUserFile /srv/www/example.com/morris.htpasswd
        Require valid-user
    </Location>
    <Location /molly>
        DAV svn
        SVNPath /srv/svn/molly
        AuthType Basic
        AuthName "Molly Subversion Repository"
        AuthUserFile /srv/www/example.com/molly.htpasswd
        Require valid-user
    </Location>
</VirtualHost>

{{< /file-excerpt >}}


#### Providing Read Only Access

All of the preceding cases have required that a user log in before accessing your repository. If you would like to allow read only public access to your respository you can do so by adding `LimitExcept` blocks to your virtual hosts as shown in this example:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
<VirtualHost *:80>
   ServerAdmin svnadmin@example.com
   ServerName svn.example.com
   ErrorLog /srv/www/svn.example.com/logs/error.log
   CustomLog /srv/www/svn.example.com/logs/access.log combined

   <Location />
       DAV svn
       SVNPath /srv/svn/morris
       AuthType Basic
       AuthName "Subversion Repository"
       AuthUserFile /srv/www/svn.example.com/morris.htpasswd
       <LimitExcept GET PROPFIND OPTIONS REPORT>
           Require valid-user
       </LimitExcept>
   </Location>
</VirtualHost>

{{< /file-excerpt >}}

