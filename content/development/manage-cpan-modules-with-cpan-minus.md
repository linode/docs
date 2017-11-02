---
author:
  name: Linode
  email: docs@linode.com
description: 'Use CPAN Minus to install and manage Perl modules easily.'
keywords: ["cpan", "perl", "cpanm"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/utilities/cpanm/','applications/development/manage-cpan-modules-with-cpan-minus/']
modified: 2011-11-16
modified_by:
  name: Linode
published: 2010-04-12
title: Manage CPAN Modules with CPAN Minus
external_resources:
 - '[CPAN Minus Documentation](http://search.cpan.org/~miyagawa/App-cpanminus-0.9929/lib/App/cpanminus.pm)'
 - '[CPAN Minus Development](http://github.com/miyagawa/cpanminus/)'
---

CPAN, the Comprehensive Perl Archive Network, is the primary source for publishing and fetching the latest modules and libraries for the Perl programming language. The default method for installing Perl modules, using the "CPAN Shell", provides users with a great deal of power and flexibility but at the cost of a complex configuration and an inelegant default setup.

The CPAN Minus, or cpanm, client attempts to make the power of CPAN accessible to all users, particularly those who aren't Perl developers with a great deal of experience with the CPAN shell. This document outlines the procedures for installing cpanm, and outlines a number of basic use cases. Before beginning this guide, we expect that you have followed our [getting started guide](/docs/getting-started/). If you're new to the world of Linux systems administration, you might like to consider our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/) and [administration basics guide](/docs/using-linux/administration-basics).

## Installing CPAN Minus

### Install Dependencies

If you have not yet installed a development tool chain including Perl and its dependencies, issue the following commands on Debian and Ubuntu systems to install this software and make sure that your system's package database and installed software are up to date:

    apt-get update
    apt-get upgrade
    apt-get install perl build-essential curl

Similarly on CentOS and Fedora Systems, use the following commands to update the system and install the required software:

    yum update
    yum install perl perl-devel curl gcc

On Arch Linux systems issue the following command to download the latest package database and install the Perl dependencies:

    pacman -Sy
    pacman -S perl base-devel curl

### Install CPAN Minus

Issue the following commands to fetch and install the cpanm tool on your system:

    cd /opt/
    curl https://raw.github.com/miyagawa/cpanminus/master/cpanm > cpanm
    chmod +x cpanm
    ln -s /opt/cpanm /usr/bin/

Finally, run the following command to bootstrap and upgrade cpanm:

    cpanm --self-upgrade --sudo

This may take a few moments. You may run the above command at any point to make sure that you're running the latest version of cpanm. When it has completed you will be able to access cpanm functionality using the `cpanm` command.

## Using CPAN Minus

In most cases, using cpanm to install modules is as simple as issuing a command in the following form:

    cpanm [Module::Name]

By default, Perl modules will be installed to `~/perl5` rather than the more customary `/usr/local/bin` directory. Add the `--sudo` option to the command line and continue to run this software with root privileges to install to `/usr/local/bin`. If you would like to continue installing Perl modules to `~/perl5` without the error message, issue the following command:

    echo "PERL_CPANM_OPT=\"--local-lib=~/perl5\"" >> ~/.bashrc

You may also use the `--skip-installed` option to avoid reinstalling modules when the latest version is already installed. Consider the following example:

    cpanm --sudo --skip-installed Catalyst::Runtime Class::Inspector File::ShareDir Catalyst::Devel Catalyst::Engine::Apache

The above command, installs the specified modules to the system location (with `--sudo`), but only if they have not been installed already. Cpanm also includes the capability to install modules and dependencies from local files. Consider the following command sequence:

    cd /opt/
    wget http://search.cpan.org/CPAN/authors/id/M/MI/MIKEGRB/WebService-Linode-0.05.tar.gz
    cpanm --sudo /opt/WebService-Linode-0.05.tar.gz

These commands download the `WebService::Linode` module, the Perl bindings for the Linode API, and install the module using cpanm into the system's Perl library. You may need additional libraries outside of CPAN's requirements for certain modules to work correctly. If the module requires dependencies from CPAN, cpanm will download and install them before installing the specified module. You can use this functionality to install non-public modules on your system. You may also specify the location of a Perl module on the Internet and CPAN will fetch the module from that location, build the dependencies, and install it. Consider the following example:

    cpanm --sudo http://search.cpan.org/CPAN/authors/id/M/MI/MIKEGRB/WebService-Linode-0.05.tar.gz

If at any subsequent point you want to check and see what modules in CPAN have been updated recently, issue the following command:

    cpanm --recent

If you want to fetch the information regarding a package in CPAN, issue the following command:

    cpanm --info [Module::Name]