---
author:
  name: Elle Krout
  email: ekrout@linode.com
description: 'Using top, htop, and iotop to monitor your'
keywords: 'top,htop,iotop,monitoring'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Monday, February 2, 2015
modified_by:
  name: Elle Krout
published: 'Monday, February 2, 2015'
title: 'Using top, htop, and iotop to Monitor System Performance'
---

In order to determine the resources that processes are using on your Linode, you should familiarize yourself with commands that allow you collect and report data concerning your memory, CPU, and I/O usage.

Three such commands are `top`, `htop`, and `iotop`, with the latter two being derivatives of the first. Familiarizing yourself with these commands will allow you to better manage your system, and recognize and deal with any issues that may arise. (<-awkward sentence)

##top

The `top` command is a Linux processing manager that displays all process activity in real-time, including CPU, memory, and swap memory usage, as well as cache size, buffer size, process ID, and more.

###Reading the Screen

[![top command screen](/docs/assets/top-command-small.png)](/docs/assets/top-command.png)

- **Line 1**: The screen begins with the time and overall uptime of the server, the amount of users, and an overview of the load average for three intervals: 1 minute, 5 minutes, and 15 minutes.

	Load average is offered at three intervals to give the user a better overview of the actual load usage. If there is a spike in the load at the 1 minute mark, but it does not continue through the 5- or 15-minute marks, it would be a very different issue than a consistence overload.

	Load average is offered at three intervals to give the user a better overview of the actual load usage. If there is a spike in the load at the 1 minute mark, but it does not continue through the 5- or 15-minute marks, it would be a very different issue than a consistence overload.

- **Line 2**: CPU percentage. The abbreviations stand for the following:
	- us: User CPU time
	- sy: System CPU time
	- ni: Nice CPU time, meaning time related to low-priority processes
	- id: Idle CPU time
	- wa: I/O wait CPU time
	- hi: Time handling hardware interruptions
	- si: Time handling software interruptions
	- st: “Steal time,” or time stolen from the virtual machine

- **Line 3**: KiB Mem: Memory usage

- **Line 4**: KiB Swap: Swap memory usage

The next section of the screen features a list of the processes and various information values related to these processes. The headings for this section relate to:

- **PID**: Process ID
- **USER**: The username of the user who started the process
- **PR**: Process priority, ranging between -20 to 19, with -20 being the most important process
- **NI**: The nice value, which alters the priority of a task. Negative values in this column increase priority, whereas positive decreases priority.
- **VIRT**: Virtual memory (swap memory + RAM memory) used
- **RES**: Resident size (kb) – the non-swapped amount of physical memory being used
- **SHR**: Shared memory – the amount of memory that could be allocated to other processes
- **S**: Process status – This relates back to the “task” area in line two. The letters mean as followed:
	- R: Running
	- D: Sleeping; unable to be interrupted
	- S: Sleeping, able to be interrupted
	- T: Traced (stopped)
	- Z: Zombie
- **%CPU**: The percentage of CPU usage since last top update
- **%MEM**: The percentage of memory since last top update
- **TIME+**: Cumulative time that the CPU process (and children processes) have used
- **COMMAND**: The name of the process



