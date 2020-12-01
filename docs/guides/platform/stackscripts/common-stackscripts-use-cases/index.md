---
slug: common-stackscripts-use-cases
author:
  name: Linode Community
  email: docs@linode.com
description: 'Linode StackScripts can be used for a variety of use cases. This guide covers some of the more common use cases, like automating common system adminstration tasks, demonstrating your software, distributing your software, or deploying cluster instances. There are few limitations to what you can automate using a StackScript, because its underlying mechanism works just like any script you might execute on a Linux system.'
og_description: 'Linode StackScripts can be used for a variety of use cases. This guide covers some of the more common use cases, like automating common system adminstration tasks, demonstrating your software, distributing your software, or deploying cluster instances. There are few limitations to what you can automate using a StackScript, because its underlying mechanism works just like any script you might execute on a Linux system.'
keywords: ['scripting','automation','bash','open source']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-05-21
image: Common_Use_Cases_for_Linode_StackScripts_1200x631.png
modified_by:
  name: Linode
title: "Common Linode StackScripts Use Cases"
h1_title: "Common Use Cases for Linode StackScripts"
contributor:
  name: Linode
tags: ["linode platform","automation"]
aliases: ['/platform/stackscripts/common-stackscripts-use-cases/']
---
## What are StackScripts?

[StackScripts](http://linode.com/stackscripts/) provide Linode users with the ability to automate the deployment of custom systems on top of Linode's default Linux distribution images. For example, every time you deploy a new Linode you might execute the same tasks, like updating your system's software, installing your favorite Linux tools, and adding a limited user account. These tasks can be automated using a StackScript that will perform these actions for you as part of your Linode's first boot process.

All StackScripts are stored in the Linode Cloud Manager and can be accessed whenever you deploy a Linode. A StackScript authored by you is an *Account StackScript*. A *Community StackScript* is a StackScript created by a Linode community member that has made their StackScript publicly available in the Linode Cloud Manager.

## StackScript Use Cases

### Automating Common System Administration Tasks

Whenever you deploy a new Linode, there are basic system administration tasks that you must perform, like installing system software updates, setting your Linode's hostname, setting the timezone, and securing your server. You can create a StackScript to automate all these steps and use it each time you deploy a new Linode. There are few limitations to what you can automate using a StackScript, because its underlying mechanism works just like any script you might execute on a Linux system. StackScripts ensure that each Linode you deploy is configured exactly to your preferences each time.

Since you can make any StackScript public to the Linode Community, your entire team can use the StackScripts you create to easily deploy base identical systems.

### Demonstrating your Software

If you develop software, you can use StackScripts to deploy a demonstration instance of your software. The resulting system may not need to be particularly durable or be fully configured, since you can redeploy a new Linode exactly as written in your StackScript. This is an easy and reproducible way to spin up quick demos of your software.

### Distributing your Software

Community StackScripts are publicly available to the entire Linode Community. This means if you have an open source project you'd like to make easily available to Linode users, you can write a StackScript that installs and configures your project's software on a Linode. Include [user defined variables](/docs/platform/stackscripts/writing-scripts-for-use-with-linode-stackscripts-a-tutorial/#user-defined-fields-udfs) in your StackScript to make it customizable to users during each deployment of the StackScript.

{{< note >}}
If you would also like to make your open source project available to the Linode Community as an App in the Linode Marketplace, see the [Linode App Marketplace page](https://www.linode.com/marketplace/) for details.
{{</ note >}}

### Deploy Cluster Instances

If your application makes use of a cluster of nodes, you may be able to automate the deployment of a new cluster-member by using StackScripts to configure the instance. StackScripts, in combination with the [Linode API](https://developers.linode.com/api/v4), can help you to elastically automate deployment and management of a cluster's node. Similarly, you can apply the same concept to creating a [server appliance instance](https://en.wikipedia.org/wiki/Computer_appliance).

## Next Steps

To get started creating your first StackScript, see the [A Tutorial for Creating and Managing StackScripts](/docs/platform/stackscripts/creating-and-managing-stackscripts-a-tutorial/).
