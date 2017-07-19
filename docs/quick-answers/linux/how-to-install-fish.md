---
author:
  name: Angel Guarisma
  email: docs@linode.com
description: 'This guide will walk through the basics of Fish'
keywords: 'fish, fish shell, fish scripting, bash'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Wednesday, July 18, 2017'
modified: 'Wednesday, July 18, 2017'
modified_by: 
  name: Linode
title: 'The Fish Shell' 
external_resources:
- '[Fish Shell](https://fishshell.com/)'
- '[link](http://link.com.com)'

---


Fish is a replacement shell, which, out of the box, offers auto-suggestions; programmable completions based on installed man pages; a fully functional, readable, scripting language; and colored text support.


### Installing Fish

Install Fish using your distro's package manager: 

	apt install fish 

Start the Fish shell with the `fish` command: 

	root@localhost:~# fish
	Welcome to fish, the friendly interactive shell
	
### Regarding Fish

Fish is similar to other shells, you type commands followed by arguments. 

	root@localhost ~# adduser Linode
	Adding user `Linode' ...
	Adding new group `Linode' (1001) ...
	Adding new user `Linode' (1001) with group `Linode' ...
	Creating home directory `/home/Linode' ...

However, in Fish, you chain commands with `;`, instead of `&&`: 

	root@localhost ~# mkdir FishDocs && cd FishDocs
	Unsupported use of '&&'. In fish, please use 'COMMAND; and COMMAND'.
	fish: mkdir FishDocs && cd FishDocs
	                      ^
