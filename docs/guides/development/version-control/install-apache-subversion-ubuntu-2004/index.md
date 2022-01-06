---
slug: install-apache-subversion-ubuntu-2004
author:
  name: Tom Henderson
  email: docs@linode.com
description: 'In this guide, you learn how to install Apache Subversion 20.04 LTS on an Ubuntu 20.04 Linode server from Ubuntu repository.'
og_description: 'In this guide, you learn how to install Apache Subversion 20.04 LTS on an Ubuntu 20.04 Linode server from Ubuntu repository.'
keywords: ['apache subversion', 'git', 'apache subversion vs git', 'apache subversion web interface']
tags: ['apache', 'ubuntu', 'web server']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-01-06
modified_by:
  name: Linode
title: "Install Apache Subversion on Ubuntu 20.04"
h1_title: "How to Install Apache Subversion on Ubuntu 20.04"
enable_h1: true
contributor:
  name: Tom Henderson
---
This tutorial shows you how to install Apache’s Subversion on Ubuntu 20.014 server edition. Apache Subversion is an open source version control system released in 2000 and available under the [Apache2 License](https://www.gnu.org/licenses/license-list.html#apache2). Designed as a feature enhancement of the *Concurrent Versions System(CVS)*, Apache Subversion was authored and maintained by Collabnet. In 2009, Subversion became an Apache Incubator Project, finally becoming a top-level project in 2010.

## What is Apache Subversion?

Apache Subversion is a [version control system](/docs/guides/introduction-to-version-control/)(VCS) that manages, documents, and organizes the changes made to a project's files and directories. Subversion can work across networks to manage the same files and directories. This enables collaboration between developers who are working on the same code base. Although Subversion is commonly used to version control software development projects, you can use it to version control any group of files and directories. Apache Subversion is invoked on the command line using the `svn` command. For this reason it is sometimes also referred to as *SVN*.

Apache Subversion is made up of two primary components:

- Server: the server is used to store the Subversion repository.
- Client: the client application is used to organize updates to and from the server that stores the repository.

The Subversion server is a web-based repository consisting of a trunk and branches. Clients work on branches of the trunk until they are ready to be made a part of the trunk repository. A trunk and its branches are a base directory, while directories are branches.

There can be more than one client that accesses the server at the same time. The server instance must remain available and accessible to all clients. Both client and server can be hosted on the same Ubuntu 20.04 instance.

This tutorial covers the steps for installing on **Ubuntu Server 20.04 LTS** from Ubuntu repositories and added library sources. However, you can install Apache Subversion on Linux, macOS, and Windows systems.

{{< note >}}
Installing Apache Subversion on Ubuntu Server 20.04 LTS requires the installation of libraries used by Apache Subversion that are not found in the standard distribution of Ubuntu 20.04.
{{< /note >}}

## Apache Subversion vs. Git

Apache Subversion provides a different workflow and version control methodology from Git and its derivatives. The table below lists some of the differences between Apache Subversion and Git.

| Apache Subversion (SVN)  |  Git          |
|---------------------|-------------------
| CollabNet, Inc developed SVN | Linus Torvalds developed Git for Linux kernel |
| Has a centralized model of version control | Uses distributed copies of the entire code base |
| Downloads only a desired branch of a tree of code/documents/object for use locally on a client instance | Copies the entire codebase and its branches along with its repositories to the client |
| SVN is usually merged online with a central repository | Git repository lives locally until the changes are committed |
| SVN synchronizes distributed combinations into a single tree | Git can mess the codebase as there is no hierarchy |
| SVN is more efficient for large codebases as it uses a single source of code truth | Git's ease of use makes it popular |
| You must rebuild the entire repository if the SVN trunk is destroyed or becomes unavailable. Hence you must backup the SVN repositories. | Multiple independent copies of the repository can exist as Git replicates the codebase.  |

## Apache Subversion Installation Steps

### Prerequisites

Following are the specific prerequisites depending on the desired role:

| Role | Apache Subversion components |
| ---------------- | ---------------- |
| A user connecting a Client to an external Subversion Server   | Client  |
| User hosting the Subversion  | Server and client |
| More than two developers developing locally| Server and client |

- If you are connecting to an existing Subversion Server, then an Apache Subversion Client is the minimum installation.
- If you need a full installation of Apache Subversion for personal or local use, then it requires both the Client and Server components.

{{< note >}}
Root or sudo permissions must be available to install Apache Subversion. A pre-configured Linode Apache Subversion Server instance can be used as a repository.
{{< /note >}}

The steps in this tutorial demonstrate how to use the APT package manager to install Apache Subversion. There are [pre-compiled binaries of SVN](https://subversion.apache.org/packages.html) available, as well as alternatives to Apache Subversion.

- Deploy a new Linode and follow the steps below. You can also follow the steps in the [How to Install a LAMP Stack on Ubuntu 20.04](/docs/guides/how-to-install-a-lamp-stack-on-ubuntu-20-04/) guide.

- If you choose to follow the steps in the *LAMP stack* guide, skip the [Install the Apache Web Server](/docs/guides/install-apache-subversion-ubuntu-2004/#install-the-apache-web-server) section below, and move on to the [Install Apache Subversion](/docs/guides/install-apache-subversion-ubuntu-2004/#install-apache-subversion) section after updating your Ubuntu 20.04 system.

- Install and update Ubuntu 20.04 LTS Linode:

      sudo apt update
      sudo apt upgrade

### Install the Apache Web Server

1. Log in to Ubuntu 20.04 LTS Linode instance as a limited user; in this example, the user is `test_dev`.

1. Install the Apache server instance with the following command:

        sudo install apache2 apache2-utils -y

1. Use `systemctl` to start the Apache.

        systemctl start apache2

1. To verify that the installation was successful, open a browser window and enter the [Linode instance’s IP address](/docs/guides/find-your-linodes-ip-address/), `http://<<host IP address>>:80`.

1. If the instance is not accessible, the instance hosting Apache might require opening firewall ports. To enable `ufw` to let traffic flow between interfaces and the Apache daemon, you must instruct `ufw` to open ports for Apache.

        sudo ufw allow 'Apache'

    This opens port `80`.

1. Enable the Apache instance you just installed. The following command starts Apache at the subsequent reboots.

        sudo systemctl enable apache2

### Install Apache Subversion

The steps in this section show you how to install the Apache Subversion client from Ubuntu’s repositories. It’s the best method of installing SVN.

1. Install Apache Subversion library dependencies from Ubuntu repositories. These are not included in the Ubuntu 20.04 LTS distributions and must be added first.

        sudo apt install libsvn-dev libapache2-mod-svn subversion-tools

1. Install Subversion.

        sudo apt install subversion -y

1. Apache has specific modules that must be enabled for Apache Subversion. Enable the following modules to allow Apache to work with Subversion.

        sudo a2enmod dav
        sudo a2enmod dav_svn

    The above `a2enmod` command enables the `dav` and the `dav_svn` module. This is done one time only.

1. Restart Apache to enable the changes.

        sudo systemctl restart apache2

## Create A Subversion Administrator User

No user can link the SVN app with the repository until an administrative account is made. The following command shows you how to create a Subversion administrator user.

Create a Subversion administrator user. Replace `<<admin_name>>` with the desired administrator name.

    htpasswd -CM /etc/apache2/dav_svn.passwd <<admin_name>>

{{< note >}}
Ensure you select a strong and secure password for the administrator account.
{{< /note >}}

## Apache Conversion Configuration and Repository Examples

The links between the client Subversion and the modules used for the Apache repository must be defined in a configuration file. The steps in this section include a sample configuration file that links the `dav_svn` module.

1. In a text editor, create an example file named `dav_svn.conf` in your system’s `/etc/apache2/mods_enabled/` directory.

1. Add the example content to the `dav_svn.conf` file. The [example configuration](https://nsrc.org/workshops/ws-files/2012/pacnog11-nmm/configs/etc/apache2/mods-enabled/dav_svn.conf) below demonstrate how to configure repository authentication and access control.

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

Subversion does not enforce a directory structure. There are three directories commonly used–`trunk`, `tags`, and `branches`.

By convention, SVN uses a root directory for each project, with the `trunk/tags/branches` underneath the root directory for the project. Following is an example Subversion directory structure:

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
  ...
  ...
  projectn/
    /trunk
    /tags
    /branches

{{</ output >}}

## Access Apache Subversion Web Interface

Your Subversion repository can be accessed by pointing the browser at the Apache Subversion repository service with the following URL:

    http://<<server IP or FQDN>>/svn/<<name of project>>

This fetches subversion data from the desired host, where `<<server IP or FQDN>>` is the accessible IP address or the Fully Qualified Domain Name(FQDN) of the Apache instance. The `<<name of project>>` for example, can be `test_project`.

{{< note >}}
A complete and in-depth discussion of Subversion commands, version control strategies, project skills, and steps can be found in the [Subversion documentation](https://svnbook.red-bean.com/).
{{</ note >}}

## Conclusion

Apache Subversion [can be assembled from source](https://subversion.apache.org/download.cgi). The source has both *PGP* and *MD5* checksums. The compressed files are downloaded into a user directory. The source libraries needed are identical to the same libraries listed above and must be installed before installing either Apache2 or subversion components.

The [SVN Book](https://svnbook.red-bean.com/) is a must-read for those who manage projects using Apache Subversion. There are many attachments, GUIs, tools, and other components for SVN that can be found through search.

Back up the Apache Subversion repository at reasonable intervals, as its accidental deletion, corruption, or other unavailability is a single-point-of-failure.
