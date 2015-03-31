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

Chef is an automation platform that "turns infrastructure into code," allowing users to manage and deploy resources across multiple servers, or *nodes*. Chef allows users to create and download recipes (stored in cookbooks) to automate content and policies on these nodes.

Chef is comprised of a Chef Server, one or more workstations, and a number of nodes that are managed by the chef-client installed on each node.

This guide will show users how to create and configure a Chef Server, a virtual workstation, and how to bootstrap a node, all on individual Linodes.

{: .note }
>The steps required in this guide require root privileges. Be sure to run the steps below as `root` or with the **sudo** prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

##Prerequisites

-	One 4GB Linode to host the Chef Server
-	Two Linodes of any size to host a workstation and a node
-	Each Linode should be configured by following the [Getting Started](/docs/getting-started) guide


##The Chef Server

The Chef Server is the hub of interaction between all workstations and nodes using Chef. Changes made through workstations are uploaded to the Chef Server, which is then accessed by the chef-client and used to configure each individual node.

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

8.	Run the `chef-server-ctl` command to start the Chef Server services:

		sudo chef-server-ctl reconfigure

9.	Generate the `chef-repo` filesystem from the main directory. This is where all of Chef's cookbooks, attributes, roles, and other configurations will be stored:

		cd ~
		chef generate repo chef-repo

10.	Move to the `chef-repo` and make a new directory called `.chef`. There is where all certificates and configuration files will be stored:

		cd chef-repo
		mkdir .chef

11.	In order to link workstations and nodes to the Chef Server, administrators and an organization need to be created with their associated RSA private keys. Create an administrator:

		sudo chef-server-ctl user-create username firstname lastname email password --filename ~/chef-repo/.chef/FILENAME.pem

12. Create an organization. The `shortname` value should be a basic idenifier for your organization with no spaces, whereas the `fullname` can be the full, proper name of the organization. The `association_user`  value `username` refers to the username made in the step above:

		sudo chef-server-ctl org-create shortname fullname --association_user username --filename ~/chef-repo/.chef/FILENAME.pem

	A basic Chef Server has now been created and configured with all the files needed to connect the server to any workstations and nodes.

## Setting Up a Workstation

