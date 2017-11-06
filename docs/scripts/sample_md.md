---
author:
  name: Linode
  email: docs@linode.com
description: 'An introduction to the Linode command line interface.'
keywords: 'linode cli, command line interface, man pages, api key'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['cli/']
modified: Monday, June 20th, 2016
modified_by:
  name: Alex Fornuto
published: 'Monday, January 27th, 2014'
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

# Stuff

# More stuff

# Again

This line is too short
---

Much too short
-

{: .table .table-striped} 
| Left-Aligned | Centered | Right-Aligned | 
| ---------------- |:-------------:| -----------------:| 
| Columns,     | both          | headers        | 
| and              | line items, | are aligned   | 
| by the hyphens | and colons | above.     |

