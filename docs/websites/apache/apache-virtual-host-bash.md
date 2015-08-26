---
author:
  name: SixDev
  email: me@sixd.eu
description: 'Create an apache Virtual Host with one command'
keywords: 'apache,web server,ubuntu'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
title: 'Simple Virtual Hosts'
---

# Adding Apache Virtual Hosts with one command

{: .note}
>
> In this guide we will be using Ubuntu 14.04 but it should work on most debain based distros, I will try updating this tutorial for CentOS etc in the future.

{: .note}
>
> For this tutorial you will be needing root access. When root access is required I will start the commands with sudo.

## Install Apache

{: .note}
>
> You can skip this step and instead follow a more detailed tutorial on setting up apache here: [Hosting a Website](/docs/websites/hosting-a-website)

1. Make sure that your system is up to date by running `sudo apt-get update`.

2. Download Apache by running this command `sudo apt-get install apache2`

## Tweaking the script
1. First get the following script:
  ```bash
  #!/bin/bash

  DOMAIN=$1

  mkdir /web/$DOMAIN

  cat <<EOF >/etc/apache2/sites-available/$DOMAIN.conf
  <VirtualHost *:80>

  	ServerAdmin webmaster@localhost
  	DocumentRoot /web/$DOMAIN
  	ServerName $DOMAIN

  	<Directory /web/sites/$DOMAIN/>
  		Options Indexes FollowSymLinks MultiViews
  		AllowOverride All
  		Order allow,deny
  		allow from all
  		Require all granted
  	</Directory>

  </VirtualHost>
  EOF

  a2ensite $DOMAIN

  service apache2 reload

  cat <<EOF >/web/$DOMAIN/index.html
  <!doctype html>
  <html>
  	<head>
  		<title>$DOMAIN</title>
  		<link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Arial">
  		<style>
  			body{
  				font-family: 'Arial';
  			}
  		</style>
  	</head>
  	<body>
  		<h1>$DOMAIN is up!</h1>
  	</body>
  </html>
  EOF
  ```

2. Replace every `/web/` with the location you want to store your sites in.

3. Create the dir that you used in the previous step or if you used `/web/` then simply do `mkdir /web`.

4. Save the script in `~/createSite.sh` (Doesn't really matter but in this tutorial this is the file).

5. Make the script runnable by running the command `chmod +x ~/createSite.sh`

## Create Sites

1. Simply run the command `sudo ~/createSites.sh mydomain.tld` and replace `mydomain.tld` with your domain for example `example.com`.

2. You are done now just run the previous step for all your websites but remeber that the `A` record has to be pointing at your linode's IPv4 Address.
