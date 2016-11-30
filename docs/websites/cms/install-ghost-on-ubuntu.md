---
author:
  name: Elliot Blackburn
  email: elliot.blackburn@gmail.com
description: 'Install, configure, and optimize the Ghost blogging application your Linode.'
keywords: 'Ghost,install Ghost,Ghost on Linode,how to configure Ghost'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Wednesday, November 29, 2016
modified_by:
  name: Elliot Blackburn
published: 'Wednesday, November 29, 2016'
title: Install Ghost on Ubuntu 16.04
---

Ghost is a relatively new blogging application. It's minimalist design and extreme focus towards blogging is making it a popular choice for those looking to share written content. In particular, Ghost is well tailored for individuals or small groups. This guide will take you through the installation and configuration of Ghost on a Ubuntu 16.04 Linode. Ghost itself uses Node.js with a few options for your database and proxy, we will be using sqlite3 and Nginx.

{: .note}
>
> If you're not familiar with Node.js, it might be useful to read through [How To Install Node.js and Nginx on Debian](../nodejs/how-to-install-nodejs-and-Nginx-on-debian.md) although this is not required.

## Before you begin

This guide assumes you have read and followed [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides.

## Install Node.js

First, we're going to install Node.js on the Linode. For this we will use a tool called NVM (node version manager), this makes it very easy to install and manage different versions of Node.js.

1. Install the build-essentials package.

        sudo apt-get install build-essentials checkinstall

2. You can then install NVM using cURL, this is the easiest method.

        curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash

3. NVM is now installed, so we're ready to use that to install a version of Node.js. [Ghost currently recommends and supports Node.js version 4.2.x](http://support.ghost.org/supported-node-versions/) so we'll use that.

        nvm install 4.2

## Install and configure Nginx

Node.js is now installed and ready for use with Ghost. Before we continue though, we need to configure Nginx to receive requests and pass them onto where Ghost will be. This is called a _reverse proxy_ and will help to make your blog more secure.

1. Install Nginx.

        sudo apt-get install nginx

2. Move into the nginx configuration directory, and remove the default site configuration as we will make our own.

        cd /etc/nginx/
        sudo rm sites-enabled/default

3. Create a new site configuration file and open it with the nano text editor for editing.

        sudo touch /etc/nginx/sites-available/ghost
        sudo nano /etc/nginx/sites-available/ghost

4. Paste the following configuration code into the file. Change `example.com` to either your domain name or IP address if you don't want to add a domain name yet.

    {: file-excerpt}
    /etc/nginx/sites-available/ghost
    :   ~~~
        server {
          listen 80;

          server_name example.com;

          location / {
              proxy_set_header   X-Real-IP $remote_addr;
              proxy_set_header   Host      $http_host;
              proxy_pass         http://127.0.0.1:2368;
          }
        }
        ~~~

5. Save by pressing CTRL+O and then hitting Enter to confirm, then press CTRL+X to exit nano.

6. Symlink the sites-avalible configuration we made into sites-enabled.

        sudo ln -s /etc/nginx/sites-available/ghost /etc/nginx/sites-enabled/ghost

7. Restart Nginx

        sudo service nginx restart

## Install Ghost

We're now ready to install Ghost. We'll use wget to grab the Ghost 0.11.3 as a zip, unzip it and install the dependencies.

1. Get the latest release of Ghost as a zip

        cd ~/ # Move to the home directory
        sudo wget https://ghost.org/zip/ghost-0.11.3.zip

2. Unzip the package to "ghost-0.11.3"

        unzip -d ghost-0.11.3.zip ghost-0.11.3

3. Install the node modules that Ghost depends on. We'll use npm (Node Package Manager) for this which was installed alongside Node.js automatically earlier. We'll use the production flag to ensure we only install modules needed to run Ghost in production mode.

        cd ghost-0.11.3
        npm install --production

## Configure Ghost

Ghost is now installed but before we can run it we need to configure it. Ghost 0.11.3 comes with an example configuration file, we are going to copy this to the correct location and then tune it to our needs.

1. Copy the configuration file to the correct location.

        cd ~/ghost-0.11.3
        cp config.example.js config.js

2. Open the new configuration file in nano.

        nano config.js

3. Edit the url section. Change `example.com` for the domain name or IP address you used earlier when configuring Nginx with but keep the proceeding `http://`.

    {: file-excerpt}
    ~/ghost-0.11.3/config.js
    :   ~~~ javascript
        var path = require('path'),
        config;

        config = {
        // ### Production
        // When running Ghost in the wild, use the production environment
        // Configure your URL and mail settings here
        production: {
            url: 'http://example.com',
            mail: {
                // Your mail settings
            },
            (...)
        },

        (...)
        ~~~

4. Save an exit using `CTRL+O` to save the file (hit enter to confirm) and then `CTRL+X` to exit nano.

## Running Ghost

We're nearly there, we now just need to run the server. Normally this would be done using a node command, but we will want the server to run in the background even when we've logged out. For this we'll use the node package called `forever`.

1. Install forever

        npm install -g forever

2. Run Ghost in production mode using forever

        NODE_ENV=production forever start index.js

Ghost will now be running, you should be able to see your Ghost blog at the web address you entered into the `config.js` file earlier in place of `http://example.com`.
