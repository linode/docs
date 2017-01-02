author:
  name: Linode Community
  email: docs@linode.com
description: 'To show a user how to setup an intranet website on any Debian-like system using Apache2'
keywords:  'intranet,apache,apache2,ubuntu,network'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)' 
published: 'Monday, March 28, 2016'
modified: 
modified_by:
  name:
  title: 'How to setup a website on an intranet'
contributor:
  name: Isai Castro
  link: https://twitter.com/Agent_Isai
  external_resources:
*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

Do you want to have a private space where you and your buisness can communicate confidentially? An intranet is the solution! An intranet is a private interal space, sperated from the internet, meaning you can communicate with your colleagues securely without having to panic about web security and if someone figures out the password to the private company website and leak ideas. To further explain how an intranet works, visit the [Wikipedia page](https://en.wikipedia.org/wiki/Intranet) for Intranet.

{: .note}
>
> You will need a VPN to access the intranet as it will not be publiclly accessable via a normal internet connection but instead as an internal website.

{: .caution}
>
> This tutorial is intended for any Debian-like systems such as Debian (itself) and Ubuntu and only for the Apache Web Server.

## Before You Begin

1. Copy /etc/hosts to /etc/hosts.bkup incase you mess up!

2. Update your system by issuing:

	sudo apt-get update
	sudo apt-get upgrade

3. We are assuming you have Apache installed and a VPN service, if not, please install it by issuing:

	sudo apt-get install apache2

Install a VPN service of your choice, common VPN software include OpenVPN.

4. Have a backup of the Apache Configuration File incase you messup by issuing:
	cp /etc/apache2/apache2.conf /etc/apache2/apache2.bkup

If you get "cp: cannot stat '/etc/apache2/apache2.conf': No such file or directory". Find the Apache Configuration file by going to the root directory (/) by doing `cd /`. Then issue `find . -name apache2.conf`, it should list where it is. In some cases, your configuration file name will be httpd.conf or http.conf.

5. Familiarize yourself with Apache or just dive right in.

## Setting up the intranet

1. Login as the roor user or do sudo -i

2. Navigate to `/etc`

3. Using your favorite text editor, edit `/etc/hosts` and add the following line under a line which says `127.0.0.1 <hostname> <hostname>.

{: .file } /etc/hosts
:   ~~~ ini
    127.0.0.2	<custom domain name>.<non existant domain extension>

4. Replace `custom domain name` with a name for the domain such as example and `non existant domain extension` with a fake domain extension that doesn't exist such as .local to prevent DNS errors, for this we will use .local. So our custom domain would be example.local.

5. Exit out of the text editor.

6. The intranet site should be working now. Going to it will result in an error similar to `The requested URL / was not found on this server.`. This is normal, ignore it as it is just Apache stating it doesn't know where to look for your website's files and thus cannot display the website.

## Setting up Apache

1. Go to the path where your Apache configuration path, usually `/etc/apache2/apache2.conf`.

2. Edit and create a VirtualHost, the following is a template for one if you do not know how to setup one.

{: .file } /etc/apache2/apache2.conf
:   ~~~ ini
	<VirtualHost *:80>
	DocumentRoot /path/to/website/directory/
	ServerName <domain name set last time, e.g. example.local>
	</VirtualHost>
{: .note}
>
> You can add any other option if needed, SSL certificates are not recommended as it will give you errors saying your website name doesn't match the one om the certificate and such.

3. Reload Apache by issuing `service apache2 reload` or issue `/etc/init.d/apache2 reload` or `apache2ctl reload`

4. Now navigate to your intranet website by using a local browser or a real browser if using a VPN.

5. Víola! Your website should be working now, you should be getting your real website now. Congratulations, you setup a VPN

