---
author:
  name: Elle Krout
  email: ekrout@linode.com
description: Basic setup and configuration of a Chef Server, Workstation, and Node
keywords: 'chef,chef installation,configuration change management,server automation,chef server,chef workstation,chef-client,knife'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Monday, March 30th, 2015
modified_by:
  name: Elle Krout
published: 'Monday, March 30th, 2015'
title: Setting up a Chef Server, Workstation, and Node on Ubuntu 14.04
---

Chef is an automation platform that "turns infrastructure into code," allowing users to manage and deploy resources across multiple server, or *nodes*. Chef allows users to create and download recipes (stored in cookbooks) to automate content and policies on your nodes.

Chef is comprised of a Chef Server, one or more workstations, and a number of nodes that are managed by the chef-client installed on each node.

This guide will show users how to create and configure a Chef Server, a virtual workstation, and how to bootstrap a node, all on individual Linodes.

{: .note }
>The steps required in this guide require root privileges. Be sure to run the steps below as `root` or with the **sudo** prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

##Prerequisites

-	One 4GB Linode to host the Chef Server
-	Two Linodes of any size to host a workstation and a node
-	Each Linode should be configured by following the [Getting Started](/docs/getting-started) guide


##The Chef Server

The Chef Server is the hub of interaction between all workstations and nodes using Chef. Changes made through workstations are uploaded as cookbooks to the Chef Server, which is then access by the chef-client and used to configure each individual node.

1.	Download the latest Chef Server core (12.0.6 at the time of writing):

		wget https://web-dl.packagecloud.io/chef/stable/packages/ubuntu/trusty/chef-server-core_12.0.6-1_amd64.deb

2.	Install the sever:

		sudo dpkg -i chef-server-core_12.0.6-1_amd64.deb

3.	Remove the download file:

		rm chef-server-core_12.0.6-1_amd64.deb

4.	Download the Chef Development Kit:

		wget https://opscode-omnibus-packages.s3.amazonaws.com/ubuntu/12.04/x86_64/chefdk_0.4.0-1_amd64.deb

5.	Install the ChefDK:

		sudo dpkg -i chefdk_0.4.0-1_amd64.deb

6.	Check that Chef has been downloaded successfully by running:

		knife --version

	The version of Chef will be output.

7.	Remove the download file for ChefDK:

		rm chefdk_0.4.0-1_amd64.deb

8.	

