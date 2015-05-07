---
author:
  name: Elle Krout
  email: ekrout@linode.com
description: 'A look into Chef''s primary components, features, and configurations for the new Chef user'
keywords: 'chef,automation,chefdk,chef server,chef development kit,cookbooks,beginners,server automation,configuration management'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Thursday, April 23rd, 2015
modified_by:
  name: Elle Krout
published: 'Thursday, April 23rd, 2015'
title: A Beginner's Guide to Chef
---

*Chef* is an automation platform that "turns infrastructure into code," allowing companies and persons with large frameworks to generate a process that will save time and effort when making changes to part or all of their server fleet.

Chef works with three core components: The Chef server, workstations, and nodes. The Chef server is the hub of Chef operations, with all changes being funneled through it. Workstations are static computers or virtual servers where all code is created or changed. There can be as many workstations as needed. Finally, nodes are the servers that need to be managed by Chef -- these are the machines that the changes are being pushed to. You can -- and are expected -- to have multiple nodes.

[![Chef Workflow](/docs/assets/chef_graph.png)](/docs/assets/chef_graph.png)

These three components communicate in a mostly-linear fashion, with any changes being pushed from the workstations to the Chef server, and then pulled from the server to the nodes through the use of the the chef-client. The chef-client, in turn, pushes information about the node to the server to determine which files and configurations are different from the current settings and need to be updated.

## The Chef Server

The Chef server works as the primary mode of communication between the workstations where your infrastructure is coded, and the nodes where it is deployed. All configuration files, cookbooks, and other metadata and information are stored on the server, as well as information regarding the state of all nodes at the last run of the chef-client.

Everything done in Chef must eventually pass through the Chef server to be deployed. In that way, Chef is the hub of all action, where it verifies that the nodes and workstations are paired with the server through the use of authorization keys generated during the creation of the server, and then allows for communication between the workstations and nodes.

### Bookshelf

The Bookshelf is a versioned repository where cookbooks are stored on the Chef server (generally located at `/var/opt/opscode/bookshelf`; full root access is needed). When a cookbook is uploaded to the Chef server, the new version is compared to the one already stored on the server, and the needed changes are made. The Chef server only stores one version of a file or template at once, meaning if resources are shared between cookbooks and cookbook versions, they will not be stored multiple times.


## Workstations

Workstations are where Chef users author, test, and maintain cookbooks and policies that will be pushed to the nodes. The cookbooks created on workstations can be used for organization-specific nodes, or uploaded to the Chef Supermarket for others to use. Similarly, workstations can be used to download cookbooks created by other Chef users and found in the Supermarket.

Workstations are set up to use the *Chef Development Kit* (ChefDK), and can be located on a virtual servers or on a normal workstation computer. Workstations are set to interact with only one Chef server, and most work will be done in the chef-repo located on the workstation.

### chef-repo

The chef-repo directory is the specific area of the workstation where cookbooks are authored and maintained. The chef-repo is always version-controlled, most often through the use of Git, and stores information and history that will be used on nodes, such as cookbooks, environments, roles, and data bags. With the use of the `knife` command, included in the ChefDK, the chep-repo is able to communicate with the server and push any changes that had been made.

Originally the chef-repo had to be pulled from git, but it now able to be generated through the use of the `chef generate repo chef-repo` command.

### Knife

The `knife` command communicates specifically between the chef-repo located on a workstation and the Chef server. `knife` is configured with the `knife.rb` file:

{: .file}
~/chef-repo/.chef/knife.rb
:	~~~
	log_level                :info
	log_location             STDOUT
	node_name                'username'
	client_key               '~/chef-repo/.chef/username.pem'
	validation_client_name   'shortname-validator'
	validation_key           '~/chef-repo/.chef/shortname.pem'
	chef_server_url          'https://123.45.67.89/organizations/shortname'
	syntax_check_cache_path  '~/chef-repo/.chef/syntax_check_cache'
	cookbook_path [ '~/chef-repo/cookbooks' ]
	~~~

The default `knife.rb` file is defined with the following properties:

-	**log_level:** The amount of logging that will be stored in the log file. The default value, `:info`, notes that any informational messages will be logged.
-	**log_location:** The location of the log file. The default value, `STOUT` is for *standard output logging*. If set to another value standard output logging will still be performed. 
-	**node_name:**	The username of the person using the workstation. This user will need a valid authorization key located on the workstation.
-	**client_key:** The location of the user's authorization key.
-	**validation_client_name:** The name for the server validation key that will determine whether a node is registered with the Chef server. These values must match during a chef-client run.
-	**validation_key:** The path to your organization's validation key.
-	**chef_server_url:** The URL of the Chef server. `/organizations/shortname` must be included in the URL, with `shortname` being the defined shortname of your organization. This can also be an IP address.
-	**syntax_check_cache_path:** The location in which `knife` stores information about files that have been checked for appropriate Ruby syntax.
-	**cookbook_path:** The path to the cookbook directory.


## Nodes

A *node* is anything set to run the chef-client. This can be a physical, virtual, or cloud machine, as long as it is being maintained by Chef.

Nodes are validated through the `validator.pem` and `client.pem` files that are created on the node when it is bootstrapped. All nodes must be bootstrapped as either the root user or a user with elevated privileges, and root login cannot be disabled on the server until after the bootstrapping process is done.

Nodes are kept up-to-date through the use of the chef-client, which runs a convergence between the node and the Chef server. What cookbooks and roles the node will take on depends on the run-list and environment set for the node in question.

### chef-client

The chef-client checks the current configuration of the node against the recipes and policies stored in the Chef server and brings the node up to match. The process begins with the chef-client checking the node's run-list, loading the cookbooks required, then checking and syncing the cookbooks with the current configuration of the node. The cookbooks are then compiled.

The chef-client must be run with elevated privileges in order to properly configure the node, and it should be run periodically to ensure that the server is always up to date -- often this is achieved through a cron job or by setting up the chef-client to run as a service.

### Run-Lists

Nodes know what cookbooks to use through the use of their run-list. The run-list is an ordered list of all cookbooks and recipes that the chef-client needs to pull from the Chef server to run on a node. Run-lists are also used to define roles, which are used to define patterns and attributes across nodes.

### Ohai

Ohai collects information regarding nodes to push to the Chef server, is required to be present on every node, and is installed as part of the default chef-client install when bootstrapping a node.

The information gathered includes network and memory usage, CPU data, kernel data, hostnames, FQDNs, and other automatic attributes that need to remain unchanged during the chef-client run. 


## Environments

Chef environments exist to mimic real-life workflow, allowing for organizations to separate nodes into different environments for developing, staging, and any other evolutions a project may pass though. This allows for users to combine environments and versioned cookbooks to have different attributes for different nodes. For example, one portion of the Chef fleet may need to use a test shopping cart API instead of processing real payments.

Environments are defined in `chef-repo/environments` and saved as Ruby or JSON files.

As a Ruby file:

{: .file}
chef-repo/environments/environame.rb
:	~~~
	name "environmentname"
	description "environment_description"
	cookbook_versions  "cookbook" => "cookbook_version"
	default_attributes "node" => { "attribute" => [ "value", "value", "etc." ] }
	override_attributes "node" => { "attribute" => [ "value", "value", "etc." ] }
	~~~
	
As a JSON:

{: .file}
chef-repo/environments/environame.json
:	~~~
	{
	  "name": "environmentname",
	  "description": "a description of the environment",
	  "cookbook_versions": {

	  },
	  "json_class": "Chef::Environment",
	  "chef_type": "environment",
	  "default_attributes": {

	  },
	  "override_attributes": {

	  }
	~~~  

All nodes are automatically set to the "default" environment upon bootstrap. To change this, the environment should be defined in the `client.rb` file found in `/etc/chef` on the node server.


## Cookbooks

Cookbooks are the main components to configuring nodes on a Chef infrastructure. Cookbooks contain values and information about the *desired state* of a node, not how to get to that desired state -- Chef does all the work for that.

Cookbooks are comprised of recipes, metadata,  attributes, resources, templates, libraries, and anything else that assists in creating the skeleton and meat of a system, with attributes and recipes being the two core parts of creating a cookbook. Components of a cookbook should be module, keeping recipes small and related.

Cookbooks can and should have versions. Versions can help when using environments and allow for the easier tracking of changes that have been made to the cookbook.


    The attributes directory will contain files that define specific details about a node.
    The CHANGELOG.md file is a markdown file meant to to be used to record any changes between versions of the cookbook.
    The definitions directory is used to contain files that work similarly to a compile-time macro, by defining code that is reused across recipes.
    The files directory contains files that need to be transferred to the nodes.
    Libraries allow for the use of extended Ruby code within a cookbook. They can be used to extend already existing classes, or create new functionalities.
    The metadata.rb file is used to contain information that will assist in the cookbook being deloyed correctly to nodes.
    Providers define the steps that allow the resources to get the nodes to their desired state. The chef-client included have a vast library of providers already set up.
    The README.md file is the “read me” information for your cookbook. It comes as a template with sections to fill out regarding needed requirements, resources, attributes, and licensing information.
    The recipes directory contains all recipes that were written for the cookbook. Recipes define the desired state of the nodes.
    Custom resources are located in the resources directory. The resources directory defines the actions that need to be taken during a chef-client run, while the providers directory contains the information on handling each action.
    Templates are Embedded Ruby files (.erb) that allows for content based on the node itself and other variables to be generated when chef-client is run and the template is used to generate a file.


### Recipes

Recipes are the fundamental part of cookbooks. Recipes are written in Ruby and contain information in regards to everything that needs to be run, changed, or created on a node. Essentially, recipes work as a collection of resources that determine the configuration or policy of a node, with resources being a configuration element of the recipe. For a node to run a recipe, it must be on that node's run-list.


### Attributes

Attributes denote the current state of the node, as well as the state of the node before and after the current chef-client run. When defined in cookbooks, attributes are used to override default values, and are loaded in the order cookbooks are listed in the run-list.
