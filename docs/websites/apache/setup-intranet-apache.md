author:
  name: Linode Community
  email: docs@linode.com
description: 'To Show a user how to setup an intranet website on any Debian-like system using Apache2'
keywords:  'intranet,apache,apache2,ubuntu,network'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)' 
published: 'Sunday, March 27, 2016'
modified:  
modified_by:
  name:
  title: 'How to setup an intranet'
contributor:
  name: Isai Castro
  link: https://twitter.com/Agent_Isai
  external_resources:
*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

Many users sometimes just want a private website isolated from the internet to work on yout projects, or maybe you want your buisness to use a single internal website to communicate and exchange confidential items without the risks of hackers breaking through a password-protected lock. Intranet is the answer to your hopes!

{: .caution}
>
> This tutorial is intended for any Debian-like systems such as Debian (itself) and Ubuntu and only for the Apache Web Server.

## Before You Begin

1. Copy /etc/hosts.conf to /etc/hosts.bkup incase you mess up!

2. Update your system by issuing:

	sudo apt-get update
	sudo apt-get upgrade

3. Make sure Apache2 is installed by issuing `apache2ctl`, if it says "apache2ctl: command not found" chances are you don't have it installed, do `sudo apt-get install apache2` to install it.

4. Have a backup of the Apache Configuration File by issuing:
	cp /etc/apache2/apache2.conf /etc/apache2/apache2.bkup

5. Familiarize yourself with Apache or just dive right in.

## Setting up the intranet

1. Login as the roor user or do sudo -i

2. Navigate to `/etc`

3. Using your favorite text editor, edit `/etc/hosts.conf` and add the following line under a line which says `127.0.0.1 <your hostname> <your hostname again>`.

{: .file } /etc/hosts.conf
:   ~~~ ini
    127.0.0.2	<custom domain name>.<non existant domain extension such as .local>	<Repeat the same domain name>

4. Replace `custom domain name` with a name for the domain such as example and `non existant domain extension` with a fake domain extension that doesn't exist such as .local to prevent DNS errors, for this we will use .local. So our custom domain would be example.local.

5. Exit out of the text editor.

6. Víola! The intranet website should be resolvable using a local browser such as links or if you're using a VPN you can connect, you might get an error in the webpage saying / doesn't exist but ignore that because you still need to setup Apache to find where the diretory containing the website is at and display it. We will cover that in the next step.

## Setting up Apache

1. Go to the path where your Apache configuration path, usually `/etc/apache2/apache2.conf`.

2. Edit and create a VirtualHost, the following is a template for one if you do not know how to setup one.

{: .file } /etc/apache2/apache2.conf
:   ~~~ ini
	<VirtualHost *:80>
	DocumentRoot /path/to/website/directory/
	ServerName <domain name set last time, e.g. example.local>
	</VirtualHost>

3. Reload Apache by issuing `service apache2 reload` or issue `/etc/init.d/apache2 reload` or `apache2ctl reload`

4. Now navigate to your intranet website by using a local browser or a real browser if using a VPN.

5. Víola! Your website should be working now! You have your own private website isolated from the internet!

