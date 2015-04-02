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

-	One 4GB Linode to host the Chef Server, running Ubuntu 14.04
-	Two Linodes of any size to host a workstation and a node, each running Ubuntu 14.04
-	Each Linode should be configured by following the [Getting Started](/docs/getting-started) guide; also consider following the [Securing Your Sever](/docs/security/securing-your-server/) guide
-	Ensure that all servers are up-to-date:

		sudo apt-get update && sudo apt-get upgrade


## The Chef Server

The Chef Server is the hub of interaction between all workstations and nodes using Chef. Changes made through workstations are uploaded to the Chef Server, which is then accessed by the chef-client and used to configure each individual node.

### Install and Configure the Chef Server

1.	Download the latest Chef Server core (12.0.6 at the time of writing):

		wget https://web-dl.packagecloud.io/chef/stable/packages/ubuntu/trusty/chef-server-core_12.0.6-1_amd64.deb

2.	Install the server:

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

### Create a User and Organization

1.	In order to link workstations and nodes to the Chef Server, administrators and an organization need to be created with their associated RSA private keys. Create an administrator:

		sudo chef-server-ctl user-create username firstname lastname email password --filename ~/chef-repo/.chef/FILENAME.pem

2.	Create an organization. The `shortname` value should be a basic idenifier for your organization with no spaces, whereas the `fullname` can be the full, proper name of the organization. The `association_user`  value `username` refers to the username made in the step above:

		sudo chef-server-ctl org-create shortname fullname --association_user username --filename ~/chef-repo/.chef/FILENAME.pem

	Some sort of sum-up here. D:

## Setting Up a Workstation

Your Chef workstation will be where you create and configure any recipes, cookbooks, attributes, and other changes made to your Chef configurations. Although this can be a local machine of any OS, there is some benefit to keeping a remote server as your workstation since it can be accessed from anywhere.

1.	Download the latest Chef Developement Kit:

		wget https://opscode-omnibus-packages.s3.amazonaws.com/ubuntu/12.04/x86_64/chefdk_0.4.0-1_amd64.deb

2.	Install ChefDK:

		sudo dpkg -i chefdk_0.4.0-1_amd64.deb

3.	Remove the install file:

		rm chefdk_0.4.0-1_amd64.deb

4.	Verify the components of the development kit:

		chef verify

5.	Generate the chef-repo and move into the newly-created directory:

		chef generate repo chef-repo
		cd chef-repo

6.	Make the `.chef` directory:

		mkdir .chef

7.	The RSA private keys generated when setting up the Chef Server will now need to be placed on this server. The process behind this will vary depending on if you are using SSH key pair authentication to log into your Linodes.

	-	If you are **not** using key pair authentication, then log in to your **Chef Server** and use `scp` to copy the files from the server to the workstation, replacing `userauth` with the name of your user's file, `orgauth` with the name of the organization's private key file, `user` with your username on your workstation Linode, and `123.45.67.89` with the IP address of your workstation:

			scp ~/chef-repo/.chef/userauth.pem user@123.45.67.89:
			scp ~/chef-repo/.chef/orgauth.pem user@123.45.67.89:

	-	If you **are** using key pair authentication, then this secton will be filled out when I get there~

8.	From the home directory, move the keys to the `.chef` directory:

		cd ~
		mv *.pem ~/chef-repo/.chef/

9.	Move to the `.chef` directory:

		cd ~/chef-repo/.chef

10.	Generate a knife configuration file:

		knife configure

	You will be asked to confirm that the `knife.rb` file is being placed at `~/chef-repo/.chef/knife.rb`, as well as the URL (or IP) of the **Chef Server** prefixed with `https://` (`https://123.45.67.89`), the admin's username (created earlier), the name of the validator (can be anything), the path to the organization's validation key (`~/chef-repo/.chef/orgauth.pem`), and the location of the chef-repo (`~/chef-repo`).

11.	The `client.rb` file will also need to be configured. Because the default location for the `client.rb` file is `/etc/chef/client.rb`, create that directory:

		sudo mkdir /etc/chef

	Then generate the file:

		sudo knife configure client /etc/chef

12.	Because the Chef Server is located on a seperate Linode, the `client.rb` file will need to be updated to reflect this. Change the `chef_server_url` and the name of the validator to be the same as the values in the `knife.rb` file:

	{: .file}
	/etc/chef/client.rb
	:	~~~
		log_level        :info
		log_location     STDOUT
		chef_server_url  'https://123.45.67.89'
		validation_client_name 'chef-validator'
		~~~

## Bootstrapping a Node



