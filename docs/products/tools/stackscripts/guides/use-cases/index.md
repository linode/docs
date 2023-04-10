---
title: "Common Use Cases for StackScripts"
description: "This guide covers some of the common use cases for Linode StackScripts along with limitations of the service."
keywords: ['scripting','automation','bash','open source']
image: CommonUse_LinodeStackScripts.png
published: 2020-05-21
modified: 2022-11-30
modified_by:
  name: Linode
tags: ["linode platform","automation"]
aliases: ['/platform/stackscripts/common-stackscripts-use-cases/','/guides/common-stackscripts-use-cases/']
---

## Automating Common System Administration Tasks

Whenever you deploy a new Linode, there are basic system administration tasks that you must perform, like installing system software updates, setting your Linode's hostname, setting the timezone, and securing your server. You can create a StackScript to automate all these steps and use it each time you deploy a new Linode. There are few limitations to what you can automate using a StackScript, because its underlying mechanism works just like any script you might execute on a Linux system. StackScripts ensure that each Linode you deploy is configured exactly to your preferences each time.

Since you can make any StackScript public to the Linode Community, your entire team can use the StackScripts you create to easily deploy base identical systems.

## Demonstrating your Software

If you develop software, you can use StackScripts to deploy a demonstration instance of your software. The resulting system may not need to be particularly durable or be fully configured, since you can redeploy a new Linode exactly as written in your StackScript. This is an easy and reproducible way to spin up quick demos of your software.

## Distributing your Software

Community StackScripts are publicly available to the entire Linode Community. This means if you have an open source project you'd like to make easily available to Linode users, you can write a StackScript that installs and configures your project's software on a Linode. Include [user defined variables](/docs/products/tools/stackscripts/guides/write-a-custom-script/#user-defined-fields-udfs) in your StackScript to make it customizable to users during each deployment of the StackScript.

{{< note >}}
If you would also like to make your open source project available to the Linode Community as an App in the Linode Marketplace, see the [Linode App Marketplace page](https://www.linode.com/marketplace/) for details.
{{< /note >}}

## Deploy Cluster Instances

If your application makes use of a cluster of nodes, you may be able to automate the deployment of a new cluster-member by using StackScripts to configure the instance. StackScripts, in combination with the [Linode API](/docs/products/tools/api/), can help you to elastically automate deployment and management of a cluster's node. Similarly, you can apply the same concept to creating a [server appliance instance](https://en.wikipedia.org/wiki/Computer_appliance).