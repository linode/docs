---
author:
  name: Angel
  email: aguarisma@linode.com
description: 'Install Taskwarrior on Ubuntu 16.10' 
keywords: 'Install Taskwarrior, Install Taskwarrior on Ubuntu, Install Taskwarrior server ' 
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['docs/applications/project-manager/setting-up-taskwarrior-on-ubuntu-16-10/']
modified: Tuesday May 23, 2017
modified_by:
  name: Angel
Published: Tuesday, July 1, 2017
title: 'Getting Started with Taskwarrior'
external_resources:
 - '[Taskwarrior Official Documentation](https://taskwarrior.org/docs/)'
 - '[Taskwarrior Official Repository](https://github.com/taskwarrior)'
 - '[GTD with Taskwarrior, Blog](https://cs-syd.eu/posts/2015-06-14-gtd-with-taskwarrior-part-1-intro.html)'
 - '[Timewarrior](https://taskwarrior.org/docs/timewarrior/what.html)'
---

Taskwarrior is an opensource tool that manages tasks from the command line. Taskwarrior is blazing fast, written in C, updated frequently and available on practically every platform. This guide will walk you through installing Taskwarrior on your Linode.  


## Before You Begin

1. Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone. 
2. This guide will use `sudo` whenever possible. 
3. Update your system. 	

### Installing Taskwarrior 

Before you begin, update your current packages
		
	sudo apt update && sudo apt upgrade -yuf 
	sudp apt install task
	
After the packages are installed, run the command `task` followed by `yes`. Taskwarrior will create a `.taskrc` file in `/home/taskwarrior/`. The `.taskrc` file is a configuration file. To learn more about configuring `task.rc`, see the [official documentation](https://taskwarrior.org/docs/configuration.html).

### Managing Tasks 

Initialize Taskwarrior by adding a task. You can add a task with `task add`. 
	
	task add Install blockstorage on Linode
	    
	Created task 1.
	task
	ID Age Urg  Description
	 1 52s    0 Install blockstorage on Linode
	 
    1 task

Taskwarrior assigns the newely added task an ID, and tracks the time elapsed since you input the command. You can add as many tasks as you want.

	task add Attend Linux Users Group
	Created task 2. 
	task add buy groceries
	Created task 3. 
	

After you complete a task you can mark it done using `task <#> done`. To remove a task you can use `task <#> delete` 

	$ task 1 done
	Completed task 1 'backup my linode'.
	Completed 1 task.
	$ task 2 delete
	Permanently delete task 2 'Attend Linux Users group'? (yes/no) yes
	Deleting task 2 'Attend Linux Users group'.
	Deleted 1 task.
	$ task
	[task next]

	ID Age Urg  Description
	1 19h    0 buy groceries
 
	1 task
You can also assign due dates to Tasks using the `due` argument. 

	task add write this guide for the Linode community due:tomorrow
	$ task
	
	[task next]
	
	ID Age Urg  Description
	 1 20h    0 buy groceries
	 2 14s    0 write this guide for the Linode community tomorrow
	  
	  2 tasks

The `due` argument is complex in the freedom it allows for input. Read more about the `due` argument at [the official documentation.](https://taskwarrior.org/docs/dates.html) 

Taskwarrior supports reocurring tasks using the `recur` argument. In example, you can create a task that is `due` daily, and reoccurs daily using this syntax structure:  

	task add update ubuntu recur:Daily due:Daily

### Visualization 

Taskwarrior does a lot more than just list the tasks you've added on the command line. The `burndown` feature outputs graphical representations of your Taskwarrior workflow.

![taskwarburndown](/docs/assets/taskwarrior/tw-burndown.png)

The `calendar` feature shows a calendar that contains all of your tasks, and their due dates. 
![taskcalendar](/docs/assets/taskwarrior/tw-calendar.png)


### Next Steps

 The next step in incorporating the Taskwarrior workflow into your life is to install `task server` on your Linode. Because Taskwarrior can be used across all of your devices, including your phones, there needs to be a central place to sync the data. Taskwarrior offers documentation on setting up a task server on your own: [Installing Taskserver](https://taskwarrior.org/docs/taskserver/setup.html)
