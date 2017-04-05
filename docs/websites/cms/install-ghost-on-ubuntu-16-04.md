---
author:
  name: Elliot Blackburn
  email: elliot.blackburn@gmail.com
description: 'Install and configure a Ghost blog on your Linode running Ubuntu 16.04.'
keywords: 'Ghost,install Ghost,Ghost on Linode,how to configure Ghost'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Thursday, March 30th, 2017
modified_by:
  name: Nick Brewer
published: 'Thursday, March 30th, 2017'
title: Install Ghost on Ubuntu 16.04
contributor:
  name: Elliot Blackburn
  link: https://github.com/BlueHatbRit
external_resources:
- '[Ghost Setup Documentation](https://support.ghost.org/developers/)'
- '[Ghost Theme Documentation](http://themes.ghost.org/)'
- '[Ghost API Documentation](http://api.ghost.org/v0.1/docs)'
---

[Ghost](https://ghost.org/) is a relatively new publishing platform. Its simplistic design and focus on blogging makes it a popular choice for those looking to share written content, and it is well equipped for use by individuals or small groups. This guide will take you through the installation and configuration of Ghost with nginx on a Linode running Ubuntu 16.04 LTS.

![Install Ghost on Ubuntu 16.04](/docs/assets/install-ghost-on-ubuntu-16-04.png)

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Before you Begin

1. This guide assumes that you've followed the steps in our [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides.

2. Ensure that your system is up to date:

        sudo apt update && sudo apt upgrade

## Install Node.js

In this section, you'll use a tool called *nvm* (node version manager) to install Node.js on your Linode.

1. Install the `build-essential` and `checkinstall` packages:

        sudo apt install build-essential checkinstall

2. Use cURL to install nvm. This example will install nvm v.0.33.1, which is the current version as of this writing. You can check [here](https://raw.githubusercontent.com/creationix/nvm/) to ensure that you download the most recent version.

        curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash

3. Now that nvm is installed, you're ready to use Node.js. [Ghost currently recommends Node.js version 4.2.x](http://support.ghost.org/supported-node-versions/), so use that:

        nvm install 4.2

## Install and Configure nginx

Next you'll configure nginx to receive requests and pass them along to Ghost.

1. Install nginx:

        sudo apt install nginx

2. We will make our own site configuration, so move into the nginx configuration directory and remove the default:

        cd /etc/nginx/
        sudo rm sites-enabled/default

3. Use the editor of your choice to create a new site configuration file under `/etc/nginx/sites-available/`. This example will use `nano`.

        sudo nano /etc/nginx/sites-available/ghost

4. Paste the following configuration code into the file. Change `example.com` to your blog's domain.

    {: .file}
    /etc/nginx/sites-available/ghost
    :   ~~~ conf
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

    Once you've made the necessary changes, save and close the file.

6. Symlink the `sites-available` configuration to `sites-enabled`:

        sudo ln -s /etc/nginx/sites-available/ghost /etc/nginx/sites-enabled/ghost

7. Restart nginx:

        sudo systemctl restart nginx

## Install Ghost

Now you're ready to install Ghost. You can find the most recent version of Ghost [here](https://ghost.org/developers/), but this example will use Ghost version `0.11.7`.

1. Move to your home directory, download the latest Ghost release as a zip file, and install `unzip`:

        cd ~/
        sudo wget https://ghost.org/zip/ghost-0.11.7.zip
        sudo apt install unzip

2. Create a new `ghost` directory and unzip the package to it:

		mkdir ghost
        unzip -d ghost ghost-0.11.7.zip

3. Use `npm` with the `--production` flag to install the modules needed to run Ghost in production mode:

        cd ghost
        npm install --production

## Configure Ghost

1. Copy the example configuration file to the default location:

        cd ~/ghost
        cp config.example.js config.js

2. Open the new configuration file with a text editor:

        nano config.js

3. Edit the `url` section, replacing `example.com` with the URL or IP address of your blog:

    {: .file-excerpt}
    ~/ghost/config.js
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

    When you're finished, save your changes and exit the editor.

5. Install the npm package `forever`, which will ensure that Ghost runs continuously:

        npm install -g forever

6. Run Ghost in production mode using `forever`:

        NODE_ENV=production forever start index.js

Now that Ghost is running, you should be able to see your blog in a web browser by visiting the domain or IP address you entered into your configuration files.

### Complete Setup

To complete the setup process, navigate to the Ghost configuration page by appending `/ghost` to the end of your blog's URL. This example uses `example.com/ghost`.

1. You should see the following page. Click on **Create your Account**.

    [![Ghost Welcome page](/docs/assets/ghost-welcome-small.png)](/docs/assets/ghost-welcome.png)

2. Enter the required information to create a user, password, and blog title.

    [![Ghost create account page](/docs/assets/ghost-create-account-small.png)](/docs/assets/ghost-create-account.png)

3. Next you'll be prompted to invite additional members to your team. If you'd prefer to skip this step, click **I'll do this later, take me to my blog!** at the bottom of the page.

    [![Ghost invite team page](/docs/assets/ghost-invite-team-small.png)](/docs/assets/ghost-invite-team.png)

4.  You'll see the following page:

    [![Ghost getting started page](/docs/assets/ghost-getting-started-small.png)](/docs/assets/ghost-getting-started.png)

    From here, you can start configuring your blog from the **Settings** section, or create your first post by clicking **New Post**. To start changing the appearance of your blog, see Ghost's [theme](http://themes.ghost.org/) documentation.
