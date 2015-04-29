---
author:
  name: Elle Krout
  email: ekrout@linode.com
description: 'Learn how to create Chef cookbooks by creating a LAMP stack in Chef'
keywords: 'chef,automation,cookbooks,opscode,lamp,lamp stack,beginner,server automation'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Wednesday, May 6th, 2015
modified_by:
  name: Elle Krout
published: 'Wednesday, May 6th, 2015'
title: Creating Your First Chef Cookbook
---

Cookbooks are one of the key components in Chef, describing the *desired state* of your nodes, and allowing Chef to push out the needed changes to acheive this state. Creating a cookbook can seem like an arduous task at first, given the sheer amount of options provided and areas to configure, so in this guide, you will be walked through the creation of one of the first things people learn to configure: A LAMP stack.

## Create the Cookbook

1. From your workstation, move to your chef-repo:

		cd chef-repo

2.	Before you begin configuring recipes, the cookbook itself must be created. Cookbooks are created through the use of the following command:

		knife cookbook create lamp-stack

	The attribute `lamp-stack` can be changed if making a different cookbook. However, if following along with this entire guide, the previously-mentioned name should suffice.

3.	Move to your cookbook's newly-created directory:

		cd cookbooks/lamp-stack

4.	If you list the files located in the newly-created cookbook, you will see a number of directories and files that have been created:

		attributes    definitions  libraries    providers  recipes    templates
		CHANGELOG.md  files        metadata.rb  README.md  resources

	-	The **attributes** directory will contain files that define specific details about a node.
	-	The **CHANGELOG.md** file is a markdown file meant to to be used to record any changes between versions of the cookbook.
	-	The **definitions** directory is used to contain files that work similarly to a compile-time macro, by defining code that is reused across recipes.
	-	Files
	-	Libraries
	-	metadata.rb
	-	Providers
	-	README.md
	-	Recipes
	-	Resources
	-	Templates


## default.rb

The `default.rb` file in `recipes` contains the "default" recipe resources. Despite this, it is often not necessary to run the default recipe any more than it is needed to run any recipe: Whatever recipes are run are entirely dependent upon the run-list.

Because each section of the LAMP stack (Apache, MySQL, and PHP) will be its own recipe, the default.rb file will be used for preparing your servers. In this case, it will contain commands to update and upgrade your packages.

1.	From within your lamp-stack directory navigate to the `recipes` folder:

		cd recipes

2.	Open `default.rb` and edit the file to contain the Ruby command to run update and upgrade:

	{: .file}
	chef-repo/cookbooks/lamp-stack/recipe/default.rb
	:	~~~
		#
		# Cookbook Name:: lamp-stack
		# Recipe:: default
		#
		#

		execute "update-upgrade" do
		  command "apt-get update && apt-get upgrade -y"
		  action :run
		end
		~~~

	Recipes are comprised of a series of *resources*. In this case, the *execute* resource is used, which calls for a command to be executed once. For the `default.rb` file the `apt-get update && apt-get upgrade -y` commands are defined in the `command` section, and the `action` is set to `:run` the commands.

	At its base, this is one of the most simple Chef recipes that can be written and a good way to start out. Any other start-up procedures that you deem important can be added to the file by mimicking the above code pattern.


## Apache

## Install




