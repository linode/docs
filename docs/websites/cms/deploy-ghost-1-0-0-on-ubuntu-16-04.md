---
author:
  name: Blago Eres
  email: blagoeres100@gmail.com
description: 'Install and configure a Ghost 1.0.0 blog on your Linode running Ubuntu 16.04 by using this guide.'
keywords: 'Ghost,install Ghost,Ghost on Linode,how to configure Ghost,deploy Ghost on Ubuntu 16.04'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Weekday, Month 00th, 2015
modified_by:
  name: Linode
published: 'Weekday, Month 00st, 2015'
title: Deploy Ghost 1.0.0 on Ubuntu 16.04
contributor:
  name: Blago Eres
  link: https://github.com/blagoeres
external_resources:
- '[Ghost Setup Documentation](https://docs.ghost.org/v1.0.0)'
- '[Ghost Theme Documentation](https://themes.ghost.org/v1.0.0)'
- '[Ghost API Documentation](https://api.ghost.org/v1.0.0)'
---

[Ghost](https://ghost.org/developers/) is an open source blogging platform that let's you easily create and online blog. 

The Ghost team recently released a new version of Ghost CMS with plenty of new features and improvements, such as the following: brand new Markdown editor, refreshed user interface, new default theme design, night-shift mode to reverse the colors of the Ghost admin interface, improved install and update processes with a new tool [Ghost-CLI](https://github.com/TryGhost/Ghost-CLI) - and a whole lot more.

In this guide you are going to set up, deploy, and secure a Ghost 1.0.0 blog on a Linode running Ubuntu 16.04 LTS using MySQL, Let's Encrypt, Node.js, NPM, Ghost-CLI and Nginx.

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
>
>Replace each instance of `example.com` in this guide with your site’s domain name.

## Before you Begin

1. This guide assumes that you've followed the steps in our [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides.

2. Ensure that you have a valid domain name and properly set DNS records for your domain.

3. Ensure that your system is up to date:

        sudo apt update && sudo apt upgrade

4. Install `build-essential` package:

        sudo apt install build-essential

## Requirements for production installs

The Ghost team recommends the following server stack and setup for production deployments of Ghost blog:

- Ubuntu 16.04 as the operating system with minimum **1GB** of RAM (swap can be used)
- Systemd
- MySQL as the recommended database engine
- Nginx
- Node.js v6 installed via NodeSource
- NPM
- A non-root user for running `ghost` commands

## Install nginx

First, you install nginx. It will be used as a reverse proxy for your Ghost application.

1. Download and install nginx:

        sudo apt install nginx

## Install MySQL

Next, you will need to install MySQL database, recommended for a production environment. Alternatively, SQLite3 can be used.

1. Download and install MySQL:

        sudo apt install mysql-server

    {: .caution}
    >
    >NOTE: You will be prompted to enter password for the MySQL "root" user. Enter a strong password!

2. Run `mysql_secure_installation` script:

        sudo mysql_secure_installation

## Install Node.js and NPM

{: .caution}
>
>Ghost 1.0.0 currently supports Node.js versions **6.9+** and **4.5+** only.
>The **recommended** version of Node.js to use with Ghost 1.0.0 is currently **Node.js v6**.

Ghost is built on Node.js and follows Node's LTS plan, only supporting LTS versions of Node.js. Thus, you will need to install latest LTS version of Node.js.

1. Download and install Node.js:

        curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
        sudo apt install nodejs

## Install Ghost-CLI

Ghost-CLI is a CLI Tool that makes installing and updating Ghost easy. It can set up database for you, configure nginx as a reverse proxy, set up TLS/SSL security by using Let's Encrypt CA, automatically renew your SSL and set up Ghost as a systemd service.

1. Install Ghost-CLI:

        sudo npm install -g ghost-cli@latest

2. Check Ghost-CLI version:

        ghost version

3. Troubleshoot the system for any potential issues when installing/updating Ghost:

        ghost doctor

4. Get help about `ghost` command:

        ghost help

## Install Ghost

Now, you are ready to install Ghost.

The one true way to install Ghost 1.0.0 is to use Ghost-CLI tool.

1. Create the document root directory:

        sudo mkdir -p /var/www/ghost

2. Change ownership of the `/var/www/ghost` directory to the nonroot user with `sudo` privileges that you have created:

        sudo chown <user>:<user> /var/www/ghost

3. Navigate to document root directory:

        cd /var/www/ghost

    {: .note}
    >The directory where you would like to install Ghost **has to be empty**.

4. Install Ghost in a production mode:

        ghost install

5. Answer each prompted question. For more information about prompted questions, visit [Ghost docs](https://docs.ghost.org/docs/cli-install#section-prompts):

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

6. After installation is complete, you can run `ghost ls` to view running ghost process.

7. In the future when a newer version of Ghost is released, you can run `ghost update` from `/var/www/ghost` directory to update the version you're running of Ghost.

## Complete Setup

To complete the setup process, navigate to the Ghost configuration page by appending `/ghost` to the end of your blog’s URL. This example uses `https://example.com/ghost`.

1. You should see the following page. Click on **Create your account**:

    ![ghost-welcome-small](/docs/assets/ghost-1-0-0-welcome-small.png)

2. Enter the requisite information to create a user, password, and blog title:

    ![ghost-create-account-small](/docs/assets/ghost-1-0-0-create-account-small.png)

3. Next, you’ll be prompted to invite additional members to your team. If you’d prefer to skip this step, click **I’ll do this later, take me to my blog!** at the bottom of the page.

    ![ghost-invite-team](/docs/assets/ghost-1-0-0-invite-team-small.png)

4. You’ll see the following page:

    ![ghost-getting-started-small](/docs/assets/ghost-1-0-0-getting-started-small.png)

    Now, your blog is set up and ready. You can start configuring it from **Settings** section of your admin interface, changing themes and so on.
