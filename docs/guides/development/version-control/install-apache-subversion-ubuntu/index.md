---
slug: install-apache-subversion-ubuntu
description: 'In this guide, you learn how to install Apache Subversion 20.04 LTS on an Ubuntu 20.04 Linode server from Ubuntu repository.'
keywords: ['apache subversion', 'git', 'apache subversion vs git', 'apache subversion web interface']
tags: ['apache', 'ubuntu', 'web server']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-01-07
modified_by:
  name: Linode
title: "Install Apache Subversion on Ubuntu 20.04"
title_meta: "How to Install Apache Subversion on Ubuntu 20.04"
authors: ["Tom Henderson"]
---
Apache Subversion is an open source version control system released in 2000 and available under the [Apache2 License](https://www.gnu.org/licenses/license-list.html#apache2). Designed as a feature enhancement of the *Concurrent Versions System(CVS)*, Apache Subversion was authored and maintained by Collabnet. In 2009, Subversion became an Apache Incubator Project, finally becoming a top-level project in 2010. In this guide you learn how to install Apache’s Subversion on an Ubuntu 20.04 server.

## What is Apache Subversion?

Apache Subversion is a [version control system](/docs/guides/introduction-to-version-control/)(VCS) that manages, documents, and organizes the changes made to a project's files and directories. Subversion can work across networks to manage the same files and directories. This enables collaboration between developers who are working on the same codebase. Although Subversion is commonly used to version control software development projects, you can use it to version control any group of files and directories. Apache Subversion is invoked on the command line using the `svn` command. For this reason it is sometimes also referred to as *SVN*.

Apache Subversion is made up of two primary components:

- **Server**: the server is used to store the Subversion repository.
- **Client**: the client application is used to organize updates to and from the Subversion server that stores the project repository.

The list below breaks down the Subversion components you need to install on a system based on your role within a Subversion project:

| Role | Apache Subversion components |
| ---------------- | ---------------- |
| A user connecting a client to an external Subversion server   | client  |
| User hosting Subversion for other users to access  | server and client |
| More than two developers developing locally| server and client |

The Subversion server is a web-based repository consisting of a *trunk* and *branches*. Clients work on branches of the trunk until they are ready to be made a part of the trunk repository. A trunk and its branches are a base directory, while directories are branches.

There can be more than one client that accesses the server at the same time. The server instance must remain available and accessible to all clients. Both client and server can be hosted on the same Ubuntu 20.04 instance.

This tutorial covers the steps for installing Subversion on **Ubuntu Server 20.04 LTS**. However, you can install Apache Subversion on Linux, macOS, and Windows systems.

{{< note respectIndent=false >}}
Installing Apache Subversion on Ubuntu Server 20.04 LTS requires the installation of libraries used by Apache Subversion that are not found in the standard distribution of Ubuntu 20.04.
{{< /note >}}

## Apache Subversion vs. Git

Apache Subversion provides a different workflow and version control methodology compared to Git and its derivatives. The table below lists some of the differences between Apache Subversion and Git.

| Apache Subversion (SVN)  |  Git          |
|---------------------|-------------------
| SVN has a centralized model of version control | Git uses distributed copies of the entire codebase |
| Downloads only a desired branch of a tree of directories and files for use locally on a client instance | Copies the entire codebase and its branches along with its repositories to the client |
| SVN is usually merged online with a central repository | A Git repository lives locally until the changes are committed |
| SVN is more efficient for large codebases as it uses a single source of truth | Git's ease of use and wide-spread adoption makes it the de facto choice on a large number of development projects |
| You must rebuild the entire repository if the SVN trunk is destroyed or becomes unavailable. Hence you must backup SVN repositories. | Multiple independent copies of the repository can exist as Git replicates the codebase.  |
| CollabNet Inc. developed SVN | Linus Torvalds developed Git for the Linux kernel |

## Apache Subversion Installation Steps

### Prerequisites

The steps in this tutorial demonstrate how to use the APT package manager to install Apache Subversion. There are [pre-compiled binaries of SVN](https://subversion.apache.org/packages.html) available too.

{{< note respectIndent=false >}}
Root or sudo permissions must be available to install Apache Subversion.
{{< /note >}}

- If you are connecting to an existing Subversion server, then an Apache Subversion Client is the minimum installation required.
- If you need a full installation of Apache Subversion for local use, then it requires both the client and server components.
- Deploy a new Linode and follow the steps below. You can also follow the steps in the [How to Install a LAMP Stack on Ubuntu 20.04](/docs/guides/how-to-install-a-lamp-stack-on-ubuntu-20-04/) guide.

- If you choose to follow the steps in the *LAMP stack* guide or already have a server with a LAMP stack installed, skip the [Install the Apache Web Server](/docs/guides/install-apache-subversion-ubuntu/#install-the-apache-web-server) section below, and move on to the [Install Apache Subversion](/docs/guides/install-apache-subversion-ubuntu/#install-apache-subversion) section after updating your Ubuntu 20.04 system.

- Update your Ubuntu 20.04 system:

      sudo apt update
      sudo apt upgrade

### Install the Apache Web Server

1. Log in to Ubuntu 20.04 LTS Linode instance as a limited user.

1. Install the Apache server instance with the following command:

        sudo apt install apache2 apache2-utils -y

1. Use `systemctl` to start Apache.

        systemctl start apache2

1. To verify that the installation was successful, open a browser window and enter the [Linode instance’s IP address](/docs/guides/find-your-linodes-ip-address/), `http://<<host IP address>>:80`.

1. If the instance is not accessible, the instance hosting Apache might require opening firewall ports. To enable `ufw` to let traffic flow between interfaces and the Apache daemon, you must instruct `ufw` to open ports for Apache.

        sudo ufw allow 'Apache'

    This opens port `80`.

1. Enable the Apache instance you just installed. The following command starts Apache during subsequent reboots.

        sudo systemctl enable apache2

### Install Apache Subversion

The steps in this section show you how to install the Apache Subversion client from Ubuntu’s repositories.

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

    htpasswd -cm /etc/apache2/dav_svn.passwd <<admin_name>>

{{< note respectIndent=false >}}
Ensure you select a strong and secure password for the administrator account.
{{< /note >}}

## Apache Subversion Configuration and Repository Examples

The links between the Subversion client and the modules used for the Apache repository must be defined in a configuration file. The steps in this section include a sample configuration file that links the `dav_svn` module.

1. In your system's `/etc/apache2/mods_enabled/` directory, create an example file named `dav_svn.conf`.

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

{{< note respectIndent=false >}}
You may need to restart Subversion using systemctl for your configuration changes to take effect.
{{< /note >}}

### An Example Subversion Directory Structure

Subversion does not enforce a directory structure. The three directories commonly used are `trunk`, `tags`, and `branches`. By convention, SVN uses a root directory for each project, with `trunk/tags/branches` as children of the project's root directory. The example below displays Subversion server's directory structure:

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

You can access your Subversion repository by pointing your browser to the Apache Subversion repository service with the following URL:

    http://<<server IP or FQDN>>/svn/<<name of project>>

This URL accesses the desired Subversion project. Ensure you replace all values with your own Subversion server's information.

{{< note respectIndent=false >}}
A complete and in-depth discussion of Subversion commands, version control strategies, project skills, and steps can be found in [Subversion's documentation](https://svnbook.red-bean.com/).
{{< /note >}}

## Conclusion

The [SVN Book](https://svnbook.red-bean.com/) is a must-read for those who manage projects using Apache Subversion. There are many tools that support the use of Subversion, including GUIs like [TortoiseSVN](https://tortoisesvn.net/).

You should make sure to back up your Apache Subversion repository at reasonable intervals. One way to do so is by backing up your Subversion server using the [Linode Backup service](/docs/products/storage/backups/).

Refer to our [How to Install and Use the Subversion CLI Client](/docs/guides/subversion-svn-tutorial) for client installation steps, along with the essential commands to support a Subversion workflow.
