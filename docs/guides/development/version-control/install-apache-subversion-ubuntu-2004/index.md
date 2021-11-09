---
slug: install-apache-subversion-ubuntu-2004
author:
  name: Tom Henderson
  email: docs@linode.com
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-09
modified_by:
  name: Linode
title: "Install Apache Subversion Ubuntu 20.04"
h1_title: "How to Install Apache Subversion on Ubuntu 20.04"
enable_h1: true
contributor:
  name: Tom Henderson
---
This tutorial demonstrates how to install Apache’s Subversion on Ubuntu 20.014 server editions. Apache Subversion is an open source software revision control and versioning system, released under the [Apache2 License](https://www.gnu.org/licenses/license-list.html#apache2).

Designed as a feature-enhancement of the Concurrent Versions System/CVS, Apache Subversion was authored and maintained by Collabnet. In 2009, Subversion became an Apache Incubator Project, finally becoming a top-level project in 2010.

The hierarchical model of Apache Subversion (principally its release and folder structures) was adopted readily, until perceived missing features and a distributed file system model evolved into Git.

## What is Apache Subversion?

Apache Subversion is a [version control system](/docs/guides/introduction-to-version-control/), primarily used by developers working on collaborative software projects. Version control documents and organizes successive iterations of changes made to the software components of a software package. In this guide, you learn how to install Apache Subversion 20.04 LTS on an Ubuntu 20.04 Linode server.

There are two primary components of Apache Subversion: A server that holds and is the repository, and a client application for organizing updates to and from the server. Both components, client and server, can be combined in the same Ubuntu 20.04 instance. The server instance must allow a client to access it, and more than one client can access the server at the same time. The server instance must remain available and accessible for clients to reach and use it.

The server is a web server-based repository/database (“repo”) consisting of a trunk, much like a tree trunk, and branches. Only rarely is the trunk changed. Usually clients work on branches of the trunk, until ready to be made a part of the trunk repository. A trunk and its branches are a base folder/directory and subfolders/directories are branches.

Although Apache Subversion can be installed on most Unix-like systems including Linux, macOS, and Windows, this tutorial only covers the steps for Ubuntu Server 20.04 LTS. This version of Ubuntu requires the installation of libraries used by Apache Subversion not found in the standard distribution of Ubuntu 20.04. Subversion cannot be installed correctly without these specific libraries. Pre-built binaries of Apache Subversion are available from several online sources, but this tutorial builds only from Ubuntu repositories and added library sources.

## Apache Subversion vs. Git

Apache Subversion (also known by SVN for its command line invocation) provides a different workflow and version control methodology from Git, and Git derivatives. SVN is a centralized method of version control, where Git uses distributed copies of the entire code base. SVN has been in use for more than twenty years. Git is popular as it was written for use by Linus Torvalds, the maintainer of Linux, and has many derivatives, as does SVN.

SVN copies only a desired branch of a tree of code/documents/object downloaded for use locally on a client instance, where Git copies the entire mass of code, base, branches with an entire repository to the client. SVN must usually be used or merged online with a central repository, whereas in Git, the repository lives locally until changes are committed.

Git replicates a codebase; SVN considers branch segments of the codebase. SVN repositories must be backed up. If the main trunk is destroyed, deleted, or otherwise becomes unavailable, it must be totally rebuilt. Because Git replicates the code base repository, multiple independent copies of the repository can exist, and unifying and organizing the main code base from the many copies can be more difficult than SVN. SVN synchronizes distributed combinations into a single tree, while Git meshes the code base without this hierarchy.

In larger codebases, SVN is more efficient and is used in a different way than git. SVN uses a single source of code truth. Git’s architecture is very popular, and a choice between Subversion and Git often is made because of prior repository history for a project. Plugins are available for either platform to interchange code between a SVN and a Git repository.

## Apache Subversion Installation Steps

### Prerequisites

The Apache Subversion system uses two components: a server repository and a client that reads, writes, and versions code, documents, and other software components.

Specific prerequisites depend on the desired role:

| Role | Software Needed |
| ---------------- | ---------------- |
| Client to an external Subversion Server   | client  |
| Hosting Subversion  | server and client |
| Developing locally; two+ developers | server and client |

An Apache Subversion Client is the minimum installation if connecting to an existing Subversion server. A full installation for personal or local use requires both the client and server components of Apache Subversion.

Root or sudo permissions must be available to install Apache Subversion. This tutorial demonstrates how to use the APT package manager to install Apache Subversion. There are pre-compiled binaries of SVN available, as well as alternatives to Apache Subversion.

A pre-configured Linode Apache Subversion Server instance can be used as a repository. The Apache Subversion Link installs the server components.

Deploy a new Linode and follow the steps below.  You can also follow the steps in the [How to Install a LAMP Stack on Ubuntu 20.04](/docs/guides/how-to-install-a-lamp-stack-on-ubuntu-20-04/) guide. If you choose to follow the steps in the LAMP stack guide, skip the Install Apache HTTP Server instructions listed below, and move on to the Install Apache Subversion section after updating your Ubuntu 20.04 system.

Install and update Ubuntu 20.04 LTS Linode:

    sudo apt update
    sudo apt upgrade

### Install the Apache Web Server

1. Login to an updated and upgraded Ubuntu 20.04 LTS Linode instance as a limited user; in the example the user is `test_dev`.

1. Install the Apache server instance with the following command:

        sudo install apache2 apache2-utils -y

1. Use systemctl to start the Apache:

        systemctl start apache2

1. To verify that the installation was successful, open a browser window and enter in the [Linode instance’s IP address](/docs/guides/find-your-linodes-ip-address/), `http://<<host IP address>>:80`.

1. If the instance is not accessible, the instance hosting Apache might require opening firewall ports. To enable ufw to let traffic flow between interfaces and the Apache daemon, you must instruct ufw to open ports for Apache.

        sudo ufw allow 'Apache'

    This opens port 80.

1. Finally, enable the Apache instance you just installed to start at the next and subsequent reboots.

        sudo systemctl enable apache2

### Install Apache Subversion

This section shows you how to install the Apache Subversion client from Ubuntu’s repositories. It’s the best method of installing SVN.

1. Install Apache Subversion library dependencies from Ubuntu repositories. These are not included in the Ubuntu 20.04 LTS distributions and must be added first:

        sudo apt install libsvn-dev libapache2-mod-svn subversion-tools

1. Then, install Subversion.

        sudo apt install subversion -y

1. Apache has specific modules that must be enabled for Apache Subversion. Enable the modules to allow Apache to work with Subversion.

        sudo a2enmod dav
        sudo a2enmod dav_svn

    The above `a2enmod` command enables the dav module then the `dav_svn` module. This is done one time only.

1. Restart Apache to enable the changes:

        sudo systemctl restart apache2

## Create A Subversion Administrator User

No user can link the SVN app with the repo until an administrative account is made. Thise section shows you how to create a Subversion admin user.

1. Create a Subversion admin user. Replace `<<admin_name>>` with the desired admin name.

        htpasword -CM /etc/apache2/dav_svn.passwd <<admin_name>>

    Ensure you select a strong and secure password for the admin account.

## Apache Conversion Configuration and Repository Examples

The links between the client Subversion, and the modules used for the Apache repository must be defined in a configuration file. This section includes a sample configuration file that links the `dav_svn` module.

1. In a text editor, create an example file named `dav_svn.conf` in your system’s `/etc/apache2/mods_enabled/` directory.

1. Add the example content to the `dav_svn.conf` file. These [example configurations](https://nsrc.org/workshops/ws-files/2012/pacnog11-nmm/configs/etc/apache2/mods-enabled/dav_svn.conf) demonstrate how to configure repository authentication and access control.

    {{< file "dav_svn.conf" >}}
# dav_svn.conf - Example Subversion/Apache configuration
#
# For details and further options see the Apache user manual and
# the Subversion book.
#
# NOTE: for a setup with multiple vhosts, you will want to do this
# configuration in /etc/apache2/sites-available/*, not here.

# <Location URL> ... </Location>
# URL controls how the repository appears to the outside world.
# In this example clients access the repository as http://hostname/svn/
# Note, a literal /svn should NOT exist in your document root.
<Location /svn>

# Uncomment this to enable the repository
DAV svn

# Set this to the path to your repository; our example uses a path of /var/www/svn
SVNPath /var/www/svn
# Alternatively, use SVNParentPath if you have multiple repositories under
# under a single directory (/var/lib/svn/repo1, /var/lib/svn/repo2, ...).
# You need either SVNPath and SVNParentPath, but not both.
#SVNParentPath /var/www/svn

# Access control is done at 3 levels: (1) Apache authentication, via
# any of several methods.  A "Basic Auth" section is commented out
# below.  (2) Apache <Limit> and <LimitExcept>, also commented out
# below.  (3) mod_authz_svn is a svn-specific authorization module
# which offers fine-grained read/write access control for paths
# within a repository.  (The first two layers are coarse-grained; you
# can only enable/disable access to an entire repository.)  Note that
# mod_authz_svn is noticeably slower than the other two layers, so if
# you don't need the fine-grained control, don't configure it.

# Basic Authentication is repository-wide.  It is not secure unless
# you are using https.  See the 'htpasswd' command to create and
# manage the password file - and the documentation for the
# 'auth_basic' and 'authn_file' modules, which you will need for this
# (enable them with 'a2enmod').
AuthType Basic
AuthName "Subversion Repository"
#AuthUserFile /etc/apache2/dav_svn.passwd

# To enable authorization via mod_authz_svn
#AuthzSVNAccessFile /etc/apache2/dav_svn.authz

# The following three lines allow anonymous read, but make
# committers authenticate themselves.  It requires the 'authz_user'
# module (enable it with 'a2enmod').
#<LimitExcept GET PROPFIND OPTIONS REPORT>
#Require valid-user
#</LimitExcept>

#</Location>
    {{</ file >}}

### An Example Subversion Directory Structure

Subversion does not enforce a directory structure. There are three directories commonly used, `trunk`, `tags`, and `branches`.

By convention, SVN uses a root directory for each project, with the `trunk/tags/branches` underneath the root directory for the project. Such a structure resembles the following:

{{< output >}}
/
  project1/
	/trunk
	/tags
	/branches
  project2/
	/trunk
	/tags
	/branches
  project3/
	/trunk
	/tags
	/branches

* * *
  projectn/
	/trunk
	/tags
	/branches

{{</ output >}}

## Accessing Apache Subversion Web Interface

Your Subversion repository can be accessed by pointing a browser at the Apache Subversion repository service with the following URL:

    http://<<server IP or FQDN>>/svn/<<name of project>>

This fetches subversion data from the desired host, where `<<server IP or FQDN>>` is the accessible IP address or the Fully Qualified Domain Name/FQDN of the Apache instance. The `<<name of project>>` in our example is `test_project`.

{{< note >}}
A complete and in-depth discussion of Subversion commands, version control strategies, project skills and steps can be found in the [Subversion documentation](https://svnbook.red-bean.com/).
{{</ note >}}

## Conclusion

Apache Subversion [can be assembled from source](https://subversion.apache.org/download.cgi). The source has both PGP and MD5 checksums. The compressed files are downloaded into a user directory. The source libraries needed are identical to the same libraries listed above, and must be installed prior to installing either apache2 or subversion components.

The SVNBook listed is a must-read for those who manage projects using Apache Subversion. There are many attachments, GUIs, tools, and other components for SVN that can be found through search.

Back up the Apache Subversion repository at reasonable intervals, as its accidental deletion, corruption, or other unavailability is a single-point-of-failure. .
