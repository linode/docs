---
slug: how-to-install-ghost-cms-on-ubuntu-16-04
description: 'This tutorial will teach you how to install Ghost, a publishing platform great for running blogs and sharing published content, on Ubuntu 16.04'
og_description: 'Easily publish your own professional-looking blog using Ghost on your Linode.'
keywords: ["ghost", "install ghost", "ghost on linode", "configure ghost", "deploy ghost on ubuntu 16.04"]
tags: ["nginx","ubuntu","mysql","cms"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-09-12
modified_by:
  name: Linode
published: 2017-09-12
title: How to Install Ghost CMS on Ubuntu 16.04
aliases: ['/websites/cms/create-a-professional-blog-with-ghost-on-ubuntu-16-04/','/websites/cms/how-to-install-ghost-cms-on-ubuntu-16-04/','/websites/cms/ghost/how-to-install-ghost-cms-on-ubuntu-16-04/']
external_resources:
- '[Ghost Setup Documentation](https://ghost.org/docs/)'
- '[Ghost Theme Documentation](https://ghost.org/docs/themes/)'
- '[Ghost API Documentation](https://ghost.org/docs/content-api/)'
relations:
    platform:
        key: how-to-install-ghost-cms
        keywords:
           - distribution: Ubuntu 16.04
authors: ["Blago Eres"]
---

![How to Install Ghost CMS on Ubuntu 16.04](ghost-blog-ubuntu-16-04-title-graphic.png "How to Install Ghost CMS on Ubuntu 16.04")

[Ghost](https://ghost.org/developers/) is an open source blogging platform that helps you easily create a professional-looking online blog.

Ghost 1.0.0 is the first major, stable release of the Ghost content management system (CMS). Ghost 1.0.0 has a brand new Markdown editor, refreshed user interface, new default theme design, improved install and update process with [Ghost-CLI](https://github.com/TryGhost/Ghost-CLI), and more.

In this guide you'll set up, deploy, and secure a Ghost 1.0.0 blog on a Linode running Ubuntu 16.04 LTS, using NGINX, MySQL, Node.js, NPM, Ghost-CLI, and Let's Encrypt.

{{< note respectIndent=false >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, consult our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.

Replace each instance of `example.com` in this guide with your site’s domain name.
{{< /note >}}

## Before you Begin

1. This guide assumes that you've followed the steps in our [Getting Started](/docs/products/platform/get-started/) and [Securing Your Server](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guides and have created a new user for Ghost with elevated `sudo` privileges. The example in this guide uses `ghostexample`.

2. Ensure that you have a valid domain name and properly configured DNS records for your domain.

3. Ensure that your system is up to date:

        sudo apt update && sudo apt upgrade

4. Install `build-essential`:

        sudo apt install build-essential

## Install NGINX

NGINX will be used as a reverse proxy for your Ghost application:

    sudo apt install nginx

## Install MySQL

1. Download and install MySQL:

        sudo apt install mysql-server

    Enter a strong password for the `root` user when prompted.

2. Run the `mysql_secure_installation` script:

        sudo mysql_secure_installation

## Install Node.js and NPM

Ghost is built on Node.js and follows Node's Long Term Support (LTS) plan. Ghost only supports [LTS versions of Node.js](https://github.com/nodejs/LTS).

Download and install Node.js:

    curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
    sudo apt install nodejs

## Install Ghost-CLI

Ghost-CLI is a command line interface (CLI) tool that makes installing and updating Ghost easy. It sets up the database, configures NGINX as a reverse proxy, enables TLS/SSL security using Let's Encrypt CA, automatically renews your SSL, and initializes Ghost as a systemd service.

1. Install Ghost-CLI:

        sudo npm install -g ghost-cli@latest

2. Troubleshoot the system for any potential issues when installing or updating Ghost:

        ghost doctor

3. Get help about `ghost`:

        ghost help

## Install Ghost

Install Ghost 1.0.0 using the Ghost-CLI tool.

1. Create the document root directory:

        sudo mkdir -p /var/www/ghost

2. Change ownership of the `/var/www/ghost` directory to the non-root user with `sudo` privileges that you created. In this example, `ghostexample`:

        sudo chown ghostexample:ghostexample /var/www/ghost

3. Navigate to the Ghost root directory:

        cd /var/www/ghost

4.  Ensure that the directory is empty to avoid file conflicts:

        ls -a

5. Install Ghost in production mode:

        ghost install

6. Answer each question as prompted. For more information about each question, visit the [Ghost documentation](https://ghost.org/docs/install/ubuntu/#install-questions):

    {{< output >}}
? Enter your blog URL: https://example.com
? Enter your MySQL hostname: localhost
? Enter your MySQL username: root
? Enter your MySQL password: areallysecurepassword
? Enter your Ghost database name: exampleGhost
? Do you wish to set up Nginx? yes
? Do you wish to set up SSL? yes
? Enter your email (used for Let's Encrypt notifications) user@example.com
? Do you wish to set up "ghost" mysql user? yes
? Do you wish to set up Systemd? yes
? Do you want to start Ghost? yes
{{< /output >}}

7. After installation is complete, run `ghost ls` to view running Ghost processes:

        ghost ls

In the future when a newer version of Ghost is released, run `ghost update` from the `/var/www/ghost` directory to update to the newest version.

## Complete the Setup

To complete the setup process, navigate to the Ghost configuration page by appending `/ghost` to the end of your blog’s URL or IP. This example uses `https://example.com/ghost`.

1. On the welcome screen, click **Create your account**:

    ![Ghost Welcome Screen](ghost-1-0-0-welcome-small.png "Ghost Welcome Screen")

2. Enter your email, create a user, password, and blog title:

    ![Create Your Account Screen](ghost-1-0-0-create-account-small.png "Create Your Account Screen")

3. Invite additional members to your team. If you’d prefer to skip this step, click **I’ll do this later, take me to my blog!** at the bottom of the page.

    ![Invite Your Team Screen](ghost-1-0-0-invite-team-small.png "Invite Your Team Screen")

4. Navigate the Ghost admin area to create your first post, change your site's theme, or configure additional settings:

    ![Ghost Admin Area](ghost-1-0-0-getting-started-small.png "Ghost Admin Area")
