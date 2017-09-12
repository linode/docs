---
author:
  name: Blago Eres
  email: blagoeres100@gmail.com
description: 'Install and configure a Ghost blog on your Linode running Ubuntu 16.04.'
keywords: 'Ghost,install Ghost,Ghost on Linode,how to configure Ghost'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Weekday, Month 10th, 2015
modified_by:
  name: Linode
published: 'Weekday, Month 10th, 2015'
title: Install and Configure Ghost on Ubuntu 16.04
contributor:
  name: Blago Eres
  link: https://github.com/blagoeres
external_resources:
- '[Ghost Setup Documentation](https://docs.ghost.org/v1.0.0/docs)'
- '[Ghost Theme Documentation](https://themes.ghost.org/v1.0.0/docs)'
- '[Ghost API Documentation](https://api.ghost.org/v1.0.0/docs)'
---

[Ghost](https://ghost.org/) is an open source blogging platform which aims to make creating an online blog easy. Ghost was recently updated to version 1.0.0 which contains new features and improvements, such as a new Markdown editor, refreshed user interface, and [Ghost-CLI](https://github.com/TryGhost/Ghost-CLI), a tool to improve the install and update process.

![Install Ghost on Ubuntu 16.04](/docs/assets/install-ghost-on-ubuntu-16-04.png)

Ghost's documentation [officially recommends](https://docs.ghost.org/docs/hosting#section-recommended-stack) the following server stack for production deployments. This guide will instruct how to install and configure it.

- Ubuntu 16.04 with minimum 1GB of RAM
- MySQL as the recommended database engine
- nginx
- Node.js v6 installed via NodeSource
- A non-root user for running Ghost-CLI commands


{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
>
>Replace each instance of `example.com` in this guide with your site’s domain name.

## Before you Begin

1.  This guide assumes you've already followed the steps in our [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides.

2.  Ensure that you have a valid domain name and properly set DNS records for your domain.

3.  Ensure that your system is up to date:

        sudo apt update && sudo apt upgrade


## Install Supporting Software

1.  Install the web and database backend. You will be prompted to enter password for the MySQL `root` user. Enter a strong password here.

        sudo apt install build-essential nginx mysql-server

2.  Run the `mysql_secure_installation` script:

        sudo mysql_secure_installation

3.  Ghost is built on Node.js and follows Node's LTS plan. Ghost 1.0.0 currently supports Node.js versions 6.9+ and 4.5+ only, but the **recommended** version of Node.js to use with Ghost 1.0.0 is currently **Node.js version 6**. Download and install it:

        curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
        sudo apt install nodejs


## Install Ghost

1.  Install Ghost-CLI, a tool for installing and updating Ghost. Ghost-CLI easily sets up the MySQL database for you and configures nginx as a reverse proxy. It can also configure HTTPS for your site using Let's Encrypt, including automatic certificate renewal.

        sudo npm i -g ghost-cli@latest

    {: .note}
    >
    > Some potentially helpful Ghost-CLI commands:
    >
    >- `ghost version`  # Check Ghost-CLI version.
    >- `ghost doctor`.  # Check for potential hiccups when installing/updating Ghost.
    >- `ghost help`.   # Get help about `ghost` command.

2.  Create a root directory where your Ghost site will live on the system and navigate to it:

        sudo mkdir -p /var/www/ghost
        cd /var/www/ghost

3.  Change ownership of the site's root directory to the non-root user with `sudo` privileges which you created earlier:

        sudo chown <user>:<user> /var/www/ghost

4.  Install Ghost:

        ghost install

5.  You'll then be prompted for information about your site and installation. They should be self-explanatory, and more information about them, see the Ghosts [installation documentation](https://docs.ghost.org/docs/cli-install#section-prompts):

        ? Enter your blog URL: https://example.com
        ? Enter your MySQL hostname: localhost
        ? Enter your MySQL username: root
        ? Enter your MySQL password: [Enter password you created when you installed MySQL]
        ? Enter your Ghost database name: [Whatever you want]
        ? Do you wish to set up Nginx? yes
        ? Do you wish to set up SSL? yes
        ? Enter your email (used for Let's Encrypt notifications) [Your email for Let's Encrypt]
        ? Do you wish to set up "ghost" mysql user? yes
        ? Do you wish to set up Systemd? yes
        ? Do you want to start Ghost? yes

{: .note}
>
> After installation is complete you can run `ghost ls` to view running ghost processes.


## Complete Setup

To complete the setup process, go to the Ghost configuration page in a web browser by appending `/ghost` to the end of your site’s URL. For example: `https://example.com/ghost`.

1.  You should see the following page. Click on **Create your account**.

    ![ghost-welcome-small](/docs/assets/ghost-1-0-0-welcome-small.png)

2.  Enter the required information to create a user, password, and blog title.

    ![ghost-create-account-small](/docs/assets/ghost-1-0-0-create-account-small.png)

3.  Next you’ll be prompted to invite additional members to your team. If you’d prefer to skip this step, click **I’ll do this later, take me to my blog!** at the bottom of the page.

    ![ghost-invite-team](/docs/assets/ghost-1-0-0-invite-team-small.png)

4.  You’ll then see the following page:

    ![ghost-getting-started-small](/docs/assets/ghost-1-0-0-getting-started-small.png)

    Now your blog is set up and ready. You can start configuring it from **Settings** section of the admin interface.


## Updating Ghost to a New Release

See Ghost's [official documentation](https://docs.ghost.org/docs/cli-update) for instructions to update to a new version.