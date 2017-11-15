---
author:
  name: Linode
  email: docs@linode.com
description: 'An introduction to the Linode command line interface.'
keywords: ["linode cli", " command line interface", " man pages", " api key"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['cli/']
modified: 2016-06-20
modified_by:
  name: Alex Fornuto
published: 2014-01-27
title: Linode CLI
external_resources:
 - '[Github Linode CLI](https://github.com/linode/cli)'
 - '[Linode API Key](/docs/platform/api/api-key)'
---

The Linode Command Line Interface (**CLI**) is an [open-source](https://github.com/linode/cli) command line tool for managing your Linode services. You can reboot your Linode, update an MX record for your domain, manage your NodeBalancers, create a StackScript and more from the command line on any computer, without logging in to the [Linode Manager](https://manager.linode.com/) graphical user interface.

Your Linode [API key](/docs/api/key) is required for the CLI to function.

![Linode CLI](/docs/assets/linode-cli.png "Linode CLI")

## Install the CLI

You can install the Linode CLI on any Mac OS X or Linux computer. You can install it on a Linode if you want to, but the typical use case for the CLI is to run it from your home or office workstation. You can use it to manage your Linode account quickly, without the use of a GUI.

### Mac OS X

Prerequisites:

-   [Homebrew](http://brew.sh)

First, update Homebrew:

    brew update

Run the following commands to install the Linode CLI:

    brew tap linode/cli
    brew install linode-cli

### Debian and Ubuntu

1.  Add the Linode repository to your list:

        sudo bash -c 'echo "deb http://apt.linode.com/ $(lsb_release -cs) main" > /etc/apt/sources.list.d/linode.list'

2.  Get the Linode GPG key:

        wget -O- https://apt.linode.com/linode.gpg | sudo apt-key add -

3.  Update your system:

        sudo apt-get update

4.  Install the Linode CLI package:

        sudo apt-get install linode-cli

### Fedora

linode-cli included in Fedora's standard package database:

    dnf install linode-cli

### Manual Installation for Linux (All Distros)

In this section, you will learn how to install the Linode CLI manually on any Linux system. Use a package manager, CPAN, [cpanminus](https://github.com/miyagawa/cpanminus), or your preferred method to install the following Perl modules:

-   Crypt::SSLeay
-   JSON
-   LWP::Protocol::https
-   LWP::UserAgent
-   Mozilla::CA
-   Try::Tiny
-   WebService::Linode

1.  Download the Linode CLI tarball:

        curl -Lo linode-cli.tar.gz https://github.com/linode/cli/archive/master.tar.gz

2.  Extract the files:

        tar xf linode-cli.tar.gz

3.  Install the CLI:

        cd cli-master && perl Makefile.PL && sudo make install

## Setup

If you installed the Linode CLI in a standard location, it should already be added to your PATH variable. That way, you will be able to invoke the CLI with the `linode` command. Otherwise, you will need to manually add the `linode-cli` folder location to your PATH, or call the program directly with the command `/path/to/linode-cli/linode`.

To start with, most users will want to run the configuration utility:

1.  Start the configuration utility:

        linode configure

    Output:

        This will walk you through setting default values for common options.

2.  Fill in your information at the prompts. You can skip optional questions by pressing `Return`. Here's some example output with the answers filled in.

        $ linode configure
        This will walk you through setting default values for common options.

         Linode Manager user name
         >> user1

         Linode Manager password for user1
         >>


         Default distribution when deploying a new Linode or rebuilding an existing one. (Optional)
         Valid options are:
           1 - Arch 2017.01.01
           2 - CentOS 5.6
           3 - CentOS 6.5
           4 - CentOS 7
           5 - Debian 7
           6 - Debian 8
           7 - Fedora 24
           8 - Fedora 25
           9 - Gentoo 2017-01-05
          10 - Slackware 13.37
          11 - Slackware 13.37 32bit
          12 - Slackware 14.1
          13 - Slackware 14.2
          14 - Ubuntu 12.04 LTS
          15 - Ubuntu 14.04 LTS
          16 - Ubuntu 16.04 LTS
          17 - Ubuntu 16.10
          18 - openSUSE Leap 42.1
          19 - openSUSE Leap 42.2
         Choose[ 1-19 ] or Enter to skip>>

         Default datacenter when deploying a new Linode. (Optional)
         Valid options are:
           1 - atlanta
           2 - dallas
           3 - frankfurt
           4 - fremont
           5 - london
           6 - newark
           7 - shinagawa1
           8 - singapore
           9 - tokyo
         Choose[ 1-9 ] or Enter to skip>>

         Default plan when deploying a new Linode. (Optional)
         Valid options are:
           1 - Linode 1024
           2 - Linode 2048
           3 - Linode 4096
           4 - Linode 8192
           5 - Linode 12288
           6 - Linode 16384
           7 - Linode 24576
           8 - Linode 32768
           9 - Linode 49152
          10 - Linode 61440
          11 - Linode 65536
          12 - Linode 81920
          13 - Linode 102400
          14 - Linode 204800
         Choose[ 1-14 ] or Enter to skip>>

          Path to an SSH public key to install when deploying a new Linode. (Optional)
          >> /home/user1/.ssh/id_rsa.pub

          Config written to /Users/user1/.linodecli/config

Once the CLI has your Linode Manager username and password, it will generate and use a new API key automatically.

{{< note >}}
If you have [two-factor authentication](/docs/security/linode-manager-security-controls/#two-factor-authentication) enabled, you will receive a prompt for the code after entering your password:

Two-factor authentication code
>> 123456

Enter your code at the prompt, then continue with the configuration tool as described above. Once the Linode CLI has access to your API key, you will no longer have to enter the code.
{{< /note >}}

You can run the `linode configure` command again if your settings change. New answers will overwrite the old ones in the `/Users/user1/.linodecli/config` file in your user's home directory.

{{< note >}}
If you don't run the configuration tool, you can add these options manually in the `.linodecli/config` file.
{{< /note >}}

### API Key

The Linode CLI requires your API key to function. If you need to generate an API key manually, read the [API Key](/docs/api/key) article. There are three ways to provide the key to the CLI. The configuration tool generates a new key and adds it to the `.linodecli/config` file automatically.

-   In the `.linodecli/config` file:

    {{< file-excerpt ".linodecli/config" >}}
api-key SampleKey123456...

{{< /file-excerpt >}}


-   As an environment variable:

        LINODE_API_KEY=SampleKey123456...

-   Passed directly in the command:

        linode --api-key SampleKey123456...

If you add your API key in the `.linodecli/config` file, or if you set it as an environment variable, the Linode CLI will have persistent access to your account. If you don't save or set the API key beforehand, you will have to enter it in the command whenever you use the CLI. The `--api-key` option should come at the end of the command. For example, your command would look like:

    linode options --api-key SampleKey123456...

### Multiple Users

The default Linode CLI user is stored in the `.linodecli/config` file.

To set up the API for additional Linode users, you can run the `linode configure` command again, supplying a different username. Configuration files for additional users are stored with the file name pattern `.linodecli/config_user1`, with **user1** being replaced by the actual username.

To invoke the CLI with a particular username, use the `-u user1` option, with **user1** being your actual username, at the end of the command.

## Using the CLI

Invoke the CLI by prefacing your commands with `linode`. Make sure the `linode-cli` folder has been appended to your PATH variable (see the previous [Setup](#setup) section). In general, commands are in the format:

    linode [object] [action] [action-options...] [options...]

If no object is given, the **linode** object is assumed. Available objects include:

    linode
    domain
    nodebalancer
    stackscript
    account

To specify a particular Linode user, add the `-u user1` option, with **user1** being your actual username, at the end of the command. If no user is specified, the default user described in the `.linodecli/config` file will be used.

The Linode CLI has many options available. In the rest of this article, we'll go over some common examples relating to Linodes, domains, NodeBalancers, StackScripts, and account details. To see all of the available options, view the man pages:

    man linode
    man linode-linode
    man linode-domain
    man linode-nodebalancer
    man linode-stackscript
    man linode-account

Press `q` to exit the man pages. You can also view more examples and options on the project's [README](https://github.com/linode/cli/blob/master/README.md) page on GitHub.

 {{< note >}}
If you do something via the CLI that costs money (creating a Linode, upgrading a Linode, enrolling in a new service, etc.), the CLI *will* attempt to charge the credit card on file for your account or use any account credit available.
{{< /note >}}

### Linodes

The Linode CLI allows you to spin up new Linodes, issue reboots, upgrade plan sizes, and more.

Listing Linodes:

    linode list

Creating a new Linode:

    linode create <linode-label> --location <data center> --plan <linodeXXXX> --payment-term <X> --distribution "<Distribution>" --group <group-label> --stackscript "<stackscript-label>"

Restarting a Linode:

    linode restart <linode-label>

Resizing a Linode:

    linode resize <linode-label> <linodeXXXX>

Rebuilding a Linode (rebuilding with a StackScript is available):

    linode rebuild <linode-label> --distribution "<Distribution>" --password "<password>"

For your convenience, several of the options are explained below. For details on all the Linode options, please check the appropriate man page:

    man linode-linode

#### --plan options

To view available [Linode plan sizes](https://www.linode.com/pricing/) for the `--plan` option, use the following command:

    linode plans

Choose from the options below:

- Linode 1024
- Linode 2048
- Linode 4096
- Linode 8192
- Linode 12288
- Linode 16384
- Linode 24576
- Linode 32768
- Linode 49152
- Linode 61440
- Linode 65536
- Linode 81920
- Linode 102400
- Linode 204800

#### --location options

To view available data centers for new Linodes for the `--location` option, use either of the following commands:

    linode locations
    linode datacenters

Choose from the options below:

- atlanta
- dallas
- frankfurt
- fremont
- london
- newark
- shinagawa1
- singapore
- tokyo

#### --distribution options

To view available distributions for new Linodes for the `--distribution` option, use either of the following commands:

    linode distros
    linode distributions

Choose from the options below:

- Arch 2017.01.01
- CentOS 5.6
- CentOS 6.5
- CentOS 7
- Debian 7
- Debian 8
- Fedora 24
- Fedora 25
- Gentoo 2017-01-05
- Slackware 13.37
- Slackware 13.37 32bit
- Slackware 14.1
- Slackware 14.2
- Ubuntu 12.04 LTS
- Ubuntu 14.04 LTS
- Ubuntu 16.04 LTS
- Ubuntu 16.10
- openSUSE Leap 42.1
- openSUSE Leap 42.2

### Domains

With the Linode CLI, you can add and remove domains, update DNS records, and more.

Listing domains:

    linode domain list

Listing domain records:

    linode domain record-list <example.com>

Creating a domain record:

    linode domain record-create <example.com> <RECORD TYPE> <subdomain> <X.X.X.X>

Updating a domain record:

    linode domain record-update <example.com> <RECORD TYPE> <subdomain> [--priority <priority>]

To see all the available options, check the man pages:

    man linode-domain

### NodeBalancers

The Linode CLI allows you to manage your [NodeBalancers](/docs/nodebalancers) from the command line.

Listing NodeBalancers:

    linode nodebalancer list

Creating a NodeBalancer:

    linode nodebalancer create <nodebalancer-label> <data center>

Configuring a NodeBalancer to handle traffic on a specific port:

    linode nodebalancer config-create <nodebalancer-label> <port>

Configuring a node on a NodeBalancer:

    linode nodebalancer node-create <nodebalancer-label> <port> <linode-label> <private-ip>:<port>

To see all the available options, check the man pages:

    man linode-nodebalancer

### StackScripts

The Linode CLI allows you to create and show StackScripts, and more.

Creating a StackScript:

    linode stackscript create --label "<stackscript-label>" --codefile "</path/myscript.sh>" --distribution "<Distribution>"

Showing a StackScript:

    linode stackscript show <stackscript-label>

StackScripts can be used to create or rebuild a Linode. Creating and rebuilding Linodes is covered in the [Linodes](#linodes) section.

To see all the available options, check the man pages:

    man linode-stackscript

### Account

The CLI allows you to view your account billing details at a glance. Run the following command:

    linode account show

Sample output:

    managed: yes
    balance: $ 0.00
    transfer pool: 6732.00GB
    transfer used: 13.02GB
    transfer billable: 0.00GB
    billing method: prepay

To see all the available options, check the man pages:

    man linode-account

## Updating the CLI

Follow these instructions to update your Linode CLI package.

### Mac OS X

Run the following Homebrew commands:

    brew update
    brew upgrade linode-cli

### Debian and Ubuntu

Run the following commands:

    sudo apt-get update
    sudo apt-get upgrade linode-cli
