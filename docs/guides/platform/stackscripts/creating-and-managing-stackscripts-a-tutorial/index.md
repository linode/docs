---
slug: creating-and-managing-stackscripts-a-tutorial
author:
  name: Linode
  email: docs@linode.com
description: 'This guide shows you how to create a Linode StackScript using the Linode Cloud Manager. You will also learn how to perform various tasks, like editing an Account StackScript, making an Account StackScript public, and deleting an Account StackScript. '
og_description: 'This guide shows you how to create a Linode StackScript using the Linode Cloud Manager. You will also learn how to perform various tasks, like editing an Account StackScript, making an Account StackScript public, and deleting an Account StackScript.'
keywords: ["automation", "scripts", "deployments", "instance"]
tags: ["linode platform","automation","cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-04-22
image: Creating_and_Managing_StackScripts_1200x631.png
modified_by:
  name: Linode
published: 2020-04-22
title: Create and Manage StackScripts - A Tutorial
h1_title: A Tutorial for Creating and Managing StackScripts
aliases: ['/platform/stackscripts/creating-and-managing-stackscripts-a-tutorial/']
---

## What are StackScripts?

[StackScripts](http://linode.com/stackscripts/) provide Linode users with the ability to automate the deployment of custom systems on top of Linode's default Linux distribution images. For example, every time you deploy a new Linode you might execute the same tasks, including:

- Updating your system's software
- Installing your favorite Linux tools
- Adding a limited user account

These tasks can be automated using a StackScript that performs these actions for you as part of your Linode's first boot process.

All StackScripts are stored in the Linode Cloud Manager and can be accessed whenever you deploy a Linode. A StackScript authored by you is an *Account StackScript*. While a *Community StackScript* is a StackScript created by a Linode community member that has made their StackScript publicly available in the Linode Cloud Manager.

### In this Guide

This guide shows you how to do the following:

- [Create a new StackScript](#create-a-new-stackscript)
- [Edit an Account StackScript](#edit-an-account-stackscript)
- [Make your Account StackScript Public](#make-an-account-stackscript-public)
- [Delete an Account StackScript](#delete-an-account-stackscript)

{{< note >}}
For information on authoring a script to be used in a Linode StackScript, see the [Writing Scripts for Use with Linode StackScripts](/docs/platform/stackscripts/writing-scripts-for-use-with-linode-stackscripts-a-tutorial/).
{{</ note >}}

## Create a New StackScript

{{< content "stackscripts-create-new-shortguide" >}}

## Manage StackScripts
### Edit an Account StackScript

{{< content "stackscripts-edit-account-shortguide" >}}

### Make an Account StackScript Public

{{< content "stackscripts-new-account-shortguide" >}}

### Delete an Account StackScript

{{< content "stackscripts-delete-account-shortguide" >}}

## Next Steps

Now that you have created a StackScript, you can deploy a Linode using your StackScript. See the [Deploying a New Linode Using a StackScript](/docs/platform/stackscripts/how-to-deploy-a-new-linode-using-a-stackscript/) guide for details.