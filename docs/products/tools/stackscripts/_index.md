---
title: StackScripts
title_meta: "StackScripts Product Documentation"
description: "Linode StackScripts allow for quick and easy customization. Create your own and join the growing library of StackScripts."
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    product_description: "Custom deployment scripts used to install software or configure a system on new Compute Instances."
aliases: ['/platform/stackscripts-classic-manager/','/platform/stackscripts/','/platform/stackscripts-new-manager/','/stackscripts/','/guides/platform/stackscripts/']
modified: 2022-12-06
---

[StackScripts](http://linode.com/stackscripts/) provide Linode users with the ability to automate the deployment of custom systems. They work by running a custom script when deploying a new Compute Instance. These custom scripts store tasks that you may need to repeat often on new Compute Instances, such as:

- Automating common system administration tasks, such as installing and configuring software, configuring system settings, adding limited user accounts, and more.
- Running externally hosted deployment scripts.
- Quickly creating Compute Instances for yourself or clients with the exact starter configuration you need.

All StackScripts are stored in the Linode Cloud Manager and can be accessed whenever you deploy a Compute Instance. A StackScript authored by you is an *Account StackScript*. A *Community StackScript* is a StackScript created by a Linode community member that has made their StackScript publicly available.

## Features

### Quick and Easy Customization

Select a StackScript, fill out any required fields, and click to deploy. StackScripts run the first time a Compute Instance boots, allowing you to automatically customize the default Linux distribution.

### A Library of StackScripts

Customize your Compute Instance with one of the many StackScripts in our library or discover a community-sourced script. They include everything from installing a Linode-optimized LAMP stack to configuring an IPsec VPN server.

### Create Your Own

Writing new StackScripts is simple. If you can’t find the right StackScript for your needs, author your own.

## Pricing and Availability

StackScripts are available at no charge across [all regions](https://www.linode.com/global-infrastructure/).

## Technical Specifications

- Deployable on new Compute Instances
- Use any Linode-provided Linux distribution (see [Choosing a Linux Distribution](/docs/products/compute/compute-instances/guides/distributions/))
- Supports the bash scripting language and any other scripting language supported by your chosen Linux distribution(s) (such as Python)
- Supports custom user-defined fields (UDFs)
- StackScripts can be made public to share with the community
- Manage StackScripts through an intuitive web-based control panel ([Cloud Manager](https://cloud.linode.com/)), the [Linode CLI](https://www.linode.com/products/cli/), or programmatically through the [Linode API](https://www.linode.com/products/linode-api/)