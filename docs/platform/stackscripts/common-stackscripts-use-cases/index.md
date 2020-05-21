---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-05-21
modified_by:
  name: Linode
title: "Index"
h1_title: "h1 title displayed in the guide."
contributor:
  name: Your Name
  link: Github/Twitter Link
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

## StackScript Use Cases

This section contains information on common use cases for StackScripts.

### Calling StackScripts Recursively

StackScripts can call other StackScripts from the library at runtime. This functionality reduces the need to write duplicate code for multiple scripts. For example, the Linode [StackScript Bash Library](https://cloud.linode.com/stackscripts/1) is a set of functions that perform various tasks. The script creates the functions but does not run them. A new StackScript can import the Bash Library and then execute functions from it. This reduces the size and time-to-write of all StackScripts using the functions built into the library script.

In another example use case for linked StackScripts, you could create a StackScript that updates all software packages on the system. You would most likely want to perform this function on all new Linodes. You could then create a StackScript to build a web server that integrates into the current cluster. Rather than rewrite the commands to update the system,you can call the previous StackScript.

Let’s then say that some of this web servers run a CMS, like WordPress. You can create a StackScript which invokes the web server script, removing the need to rewrite the commands to install the web server software or update the system.

The syntax to pull another StackScript is:

    <ssinclude StackScriptID="[NUMBER]">

This downloads the StackScript on the Linode as `ssinclude-[NUMBER]`. To download and run the script (assuming it's written as a Bash script) use:

    source <ssinclude StackScriptID="[NUMBER]">

If you're scripting in another language, execute the script on a second line, as seen below:

    <ssinclude StackScriptID="[NUMBER]">
    ./ssinclude-[NUMBER]

A great example of this use case is the [StackScript Bash Library](https://cloud.linode.com/stackscripts/1), created by Linode. This script contains several useful functions to perform common tasks such as updating software and installing Apache, MySQL,etc. Run on its own it does nothing to alter your system. Importing the Bash Library script saves time in your own StackScripts.

### Demonstrating or Distributing Software

If you develop software, you can use StackScripts to deploy a demonstration instance of the software. The resulting system may not need to be particularly durable or be fully configured. With a StackScript for demonstrating software, you can let users experience and test the software while giving full control over the deployment. This same kind of procedure with minimal modification may also be an easy way to distribute the software itself. These StackScripts have to be generic so that other users can deploy from this StackScript without complication.

### Deploying Appliances and Cluster Instances

If your deployment includes function-specific *appliance-type* instances, you may want to explore using StackScripts to help manage these nodes, such as job-processing instances.

Application clusters are similar. If your architecture includes some sort of *cluster*, you may be able to automate the deployment of a new cluster-member by using StackScripts to configure the instance. Here, StackScripts, in combination with the API, helps you to elastically automate deployment and management of a cluster.

