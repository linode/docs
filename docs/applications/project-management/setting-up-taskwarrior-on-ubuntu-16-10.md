---
author:
  name: Angel
  email: aguarisma@linode.com
description: 'Install Taskwarrior on Ubuntu 16.04' 
keywords: 'Install Taskwarrior, Install Taskwarrior on Ubuntu, Install Taskwarrior server ' 
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['docs/applications/project-manager/setting-up-taskwarrior-on-ubuntu-16-10/']
modified: Tuesday, May 23, 2017
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

[Taskwarrior](https://taskwarrior.org/) is an open source tool that manages tasks from the command line. Taskwarrior is blazing fast, written in C, updated frequently and available on practically every platform. This guide will walk you through installing Taskwarrior on a Linode.


## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) guide to create a standard user account, harden SSH access and remove unnecessary network services. Taskwarrior does not require opening ports in your firewall unless you choose to run it as a [server daemon](https://taskwarrior.org/docs/#taskd) for multiple devices to connect to.

3.  Update your system:

        sudo apt update && sudo apt upgrade


## Installing Taskwarrior 

Install Taskwarriror with:
		
	sudo apt install task
	
After the packages are installed, run the command `task`.

If a Taskwarrior a configuration file does not already exist, you'll be asked if you want to create a sample file for your user. 

Answer `yes`.

You'll find the sample configuration file at `~/.taskrc`. To learn more about configuring `task.rc`, see the [official documentation](https://taskwarrior.org/docs/configuration.html).

## Managing Tasks 

### Add a Task

This is done with [task add](https://taskwarrior.org/docs/commands/add.html), so for example:
	
    task add Add block storage volume to my Linode

That will return:

    Created task 1.

If you then run `task` again, you'll see the job information. Taskwarrior assigns the newly added task an ID, and tracks the time elapsed since you input the command.

    taskwarrior@localhost:~$ task
    [task next]
    
    ID Age Description                    Urg
     1 14s Add block storage volume to my Linode    0

    1 task

You can add as many tasks as you want.

	task add Attend Linux Users Group
	Created task 2.

	task add buy groceries
	Created task 3.

### Complete a Task

After you complete a task, you can mark it done using the [done](https://taskwarrior.org/docs/commands/done.html) command. The syntax is `task <task_number> done`.

	taskwarrior@localhost:~$ task 1 done
    Completed task 1 'Add block storage volume to my Linode'.
    Completed 1 task.

### Remove a Task

To remove a task you can use `task <task_number> delete`.

	taskwarrior@localhost:~$ task 2 delete
	Permanently delete task 2 'Attend Linux Users group'? (yes/no) yes
	Deleting task 2 'Attend Linux Users group'.
	Deleted 1 task.

### Assign Tasks a Due Date

This is done using the `due` argument:

	task add write Taskwarrior guide for the Linode community due:tomorrow

	taskwarrior@localhost:~$ task
	[task next]
	
	ID Age   Due Description                                      Urg
 	 2 11s    7h write Taskwarrior guide for the Linode community 8.65
 	 1 16min     buy groceries                                       0
	
	2 tasks

The [due](https://taskwarrior.org/docs/dates.html#due) argument allows a significant amount of freedom for input. Read more about the `due` argument at [the official documentation.](https://taskwarrior.org/docs/dates.html) 

Taskwarrior supports [recurring tasks](https://taskwarrior.org/docs/recurrence.html) using the `recur` argument. The example below creates a daily task, the first of which is due 23 hours from the time of creation:

	task add update ubuntu recur:daily due:daily

    taskwarrior@localhost:~$ task
    [task next]
    
    ID Age   Recur Due Description                                      Urg
     2 11min        7h write Taskwarrior guide for the Linode community 8.65
     4         P1D 23h update ubuntu                                    8.34
     1 28min           buy groceries                                       0
    
    3 tasks
    Creating recurring task instance 'update ubuntu'

### Visualization 

Taskwarrior does a lot more than just list the tasks you've added on the command line. The [burndown](https://taskwarrior.org/docs/commands/burndown.html) feature outputs graphical representations of your Taskwarrior workflow.

![taskwarburndown](/docs/assets/taskwarrior/tw-burndown.png)

The `calendar` feature shows a calendar that contains all of your tasks, and their due dates. 
![taskcalendar](/docs/assets/taskwarrior/tw-calendar.png)


### Next Steps

 The next step in incorporating the Taskwarrior workflow into your life is to install `task server` on your Linode. Because Taskwarrior can be used across all of your devices, including your phones, there needs to be a central place to sync the data. Taskwarrior offers documentation on setting up a task server on your own: [Installing Taskserver](https://taskwarrior.org/docs/taskserver/setup.html)
