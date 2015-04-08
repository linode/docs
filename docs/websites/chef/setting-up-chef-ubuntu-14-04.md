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
title: Setting Up a Chef Server, Workstation, and Node on Ubuntu 14.04
---

Chef is an automation platform that "turns infrastructure into code," allowing users to manage and deploy resources across multiple servers, or *nodes*. Chef allows users to create and download recipes (stored in cookbooks) to automate content and policies on these nodes.

Chef is comprised of a Chef Server, one or more workstations, and a number of nodes that are managed by the chef-client installed on each node.

This guide will show users how to create and configure a Chef Server, a virtual workstation, and how to bootstrap a node to run the chef-client, all on individual Linodes.

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

### Install the Chef Server

1.	Download the latest Chef Server core (12.0.6 at the time of writing):

		wget https://web-dl.packagecloud.io/chef/stable/packages/ubuntu/trusty/chef-server-core_12.0.6-1_amd64.deb

2.	Install the server:

		sudo dpkg -i chef-server-core_12.0.6-1_amd64.deb

3.	Remove the download file:

		rm chef-server-core_12.0.6-1_amd64.deb

4.	Run the `chef-server-ctl` command to start the Chef Server services:

		sudo chef-server-ctl reconfigure


### Create a User and Organization

1.	In order to link workstations and nodes to the Chef Server, administrators and an organization need to be created with their associated RSA private keys. From the home directory, create a `.chef` directory to store the keys:

		cd ~
		mkdir .chef

2.	Create an administrator:

		sudo chef-server-ctl user-create username firstname lastname email password --filename ~/.chef/FILENAME.pem

2.	Create an organization. The `shortname` value should be a basic idenifier for your organization with no spaces, whereas the `fullname` can be the full, proper name of the organization. The `association_user`  value `username` refers to the username made in the step above:

		sudo chef-server-ctl org-create shortname fullname --association_user username --filename ~/.chef/FILENAME.pem

With the Chef Server installed and the needed RSA keys generated, you can move on to configuring your workstation, where all major work will be performed for your Chef's nodes.

## Workstations

Your Chef workstation will be where you create and configure any recipes, cookbooks, attributes, and other changes made to your Chef configurations. Although this can be a local machine of any OS, there is some benefit to keeping a remote server as your workstation since it can be accessed from anywhere.

### Setting Up a Workstation

1.	Download the latest Chef Development Kit:

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

### Add the RSA Private Keys

1.	The RSA private keys generated when setting up the Chef Server will now need to be placed on this server. The process behind this will vary depending on if you are using SSH key pair authentication to log into your Linodes.

	-	If you are **not** using key pair authentication, then copy the file directly off of the Chef Server. replace `user` with your username on the server, and `123.45.67.89` with the URL or IP of your Chef Server:

			scp user@123.45.67.89:~/.chef/*.pem ~/chef-repo/.chef/

	-	If you **are** using key pair authentication, then from the **computer terminal** copy the .pem files from your server to your workstation using the `scp` command. Replace `user` with the appropriate usernames, and `123.45.67.89` with the URL or IP for your Chef Server and `987.65.43.21` with the URL or IP for your workstation:

			scp -3 user@123.45.67.89:~/.chef/*.pem user@987.65.43.21:~/chef-repo/.chef/

2.	To confirm that the files have been copied successfully by listening the contents of the .chef directory:

		ls ~/chef-repo/.chef

	Your `.pem` files should be listed.

### Add Version Control

Because the workstation is used to add and edit cookbooks and other configuration files, it is beneficial to put it under version control. For this, Git proves to be a useful program.

1.	Move to your home directory and download Git:

		cd ~
		sudo apt-get install git

2.	Configure Git by adding your username and email, replacing the needed values:

		git config --global user.name yourname
		git config --global user.email user@email.com

3.	Move to the chef-repo, and initialize the repository:

		cd ~/chef-repo
		git init

4.	Add the `.chef` directory to the `.gitignore` file:

		echo ".chef" > .gitignore

5.  Add and commit all existing files:

		git add .
		git commit -m "initial commit"

6.	Make sure the directory is clean:

		git status


### Generate knife.rb

1.	Create a knife configuration file by navigating to your `~/chef-repo/.chef` folder and opening a file named `knife.rb` in your chosen text editor.

2.	Copy the following configuration into the `knife.rb` file, making the necessary changes. 

	{: .file}
	~/chef-repo/.chef/knife.rb
	:	~~~
		log_level                :info
		log_location             STDOUT
		node_name                'username'
		client_key               '~/chef-repo/.chef/userauth.pem'
		validation_client_name   'organization-validator'
		validation_key           '~/chef-repo/.chef/orgauth.pem'
		chef_server_url          'https://123.45.67.89/organizations/orgshortname'
		syntax_check_cache_path  '~/chef-repo/.chef/syntax_check_cache'
		cookbook_path [ '~/chef-repo/cookbooks' ]
		~~~

3.	Move to the chef-repo and copy the needed SSL certificates from the server:

		cd ~/chef-repo
		knife ssl fetch

4.	Confirm that `knife.rb` is set up correctly by running the client list:

		knife client list

	The validator name should be output.

With both the server and a workstation configured, it is possible to bootstrap your first node.


## Bootstrap a Node

Bootstrapping a node installs the chef-client and validates the node, preparing it to be able to read from the Chef Server and make any needed configuration changes picked up by the chef-client in the future.

1.	Bootstrap the node:

	-	As the node's root user:

			knife bootstrap 123.45.67.89 -x root -P password --node-name nodename

	-	As a user with sudo priviledges:

			knife bootstrap 123.45.67.89 -x root -P password --sudo --node-name nodename

2.	Confirm that the node has been bootstrapped by listing the nodes:

		knife node list

## Download the chef-client Cookbook

The chef-client cookbook contains basic configuration for newly-installed nodes, such as setting up a cron job to run the chef-client, and removing the `vaidation.pem` file from your nodes for security purposes.

1.	Download the cookbook:

		knife cookbook site install chef-client

2.	