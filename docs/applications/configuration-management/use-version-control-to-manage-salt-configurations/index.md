---
author:
  name: Linode
  email: docs@linode.com
description: 'Two to three sentences describing your guide.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-10-18
modified: 2018-10-18
modified_by:
  name: Linode
title: "Use Version Control to Manage Your Salt Configurations"
contributor:
  name: Your Name
  link: Github/Twitter Link
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet--this guide includes firewall rules specifically for an OpenVPN server.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

<!-- Include one of the following notes if appropriate. --->

## Salt State Files

### Infrastructure as Code

The SaltStack Platform is made up of two primary components; a remote execution engine, which handles bi-directional communication for any node within your infrastructure (master and minions) and a configuration management system which maintains all infrastructure nodes in a defined state. This system is known as the *Salt State* system. A Salt state is defined within a *Salt State file* (SLS) using YAML syntax and represents the data Salt needs to configure minions to a particular state. A collection of Salt States defined in SLS files is known as a *Salt Formula*.

Your Salt Formulas

Since Salt Formulas are simply a set of SLS files written in YAML, you can version control all your configurations using systems like Git or Subversion.



, which maintains mininons  known as Salt States. Pre-written Salt states are Salt FormulasBy creating Salt States you can provide
Salt's execution engine handles bi-directional communication between the Salt Master and Minions, while the Salt State system provides configuration management across all components within your infrastructure. The Salt state system relies on SLS formulas for its configuration definitions. The Salt file server distributes Salt formula files to Salt minions.

** Include link to saltstack-formulas on github: https://github.com/saltstack-formulas

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}


{{< caution >}}
Highlight warnings that could adversely affect a user's system with the Caution style.
{{< /caution >}}

{{< file "/etc/hosts" aconf >}}
192.0.2.0/24      # Sample IP addresses
198.51.100.0/24
203.0.113.0/24
{{< /file >}}

## Storing Secure Data with Pillars
