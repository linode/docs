---
author:
  name: Linode
  email: docs@linode.com
description: 'This tutorial will teach you how to install Ghost, a publishing platform great for running blogs and sharing published content, on CentOS 8.'
og_description: 'Easily publish your own professional-looking blog using Ghost on your Linode running CentOS 8.'
keywords: ["ghost", "install ghost", "ghost on linode", "configure ghost", "deploy ghost on CentOS 8", "ghost cms"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-02-10
modified_by:
  name: Linode
published: 2020-02-10
title: How to Install Ghost CMS on CentOS 8
h1_title: Installing Ghost CMS on CentOS 8
external_resources:
- '[Ghost Setup Documentation](https://ghost.org/docs/setup/)'
- '[Ghost Theme Documentation](https://ghost.org/docs/api/v3/handlebars-themes/)'
- '[Ghost API Documentation](https://ghost.org/docs/api/v3/)'
---

[Ghost](https://ghost.org/developers/) is an open source blogging platform that helps you easily create a professional-looking online blog. Ghost is a robust content management system (CMS) with a Markdown editor, an easy-to-use user interface, and beautiful themes. It is easy to install and update with [Ghost-CLI](https://github.com/TryGhost/Ghost-CLI).

## In This Guide

You'll set up, deploy, and secure a Ghost v3.5.1 blog on a Linode running CentOS 8, using NGINX, MySQL, Node.js, NPM, Ghost-CLI, and Let's Encrypt. For installation instructions for other distributions, click [here](/docs/websites/cms/ghost).

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, consult our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

Replace each instance of `example.com` in this guide with your site’s domain name.
{{< /note >}}

## Before you Begin

1. This guide assumes that you've followed the steps in our [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides and have created a new user for Ghost with elevated `sudo` privileges. The example in this guide uses `ghostexample`.

1. Ensure that you have a valid domain name and properly configured DNS records for your domain.

1. Ensure that your system is up to date:

        sudo yum update

1. Add `EPEL repository`:

        sudo dnf -y install epel-release

## Install Prerequisites

### Install and Configure NGINX

NGINX will be used as a reverse proxy for your Ghost application:

1.  Install NGINX:

    sudo dnf install @nginx

1.  Create a configuration file for Ghost at `/etc/nginx/conf.d/ghost.conf`:

    {{< file "/etc/nginx/conf.d/ghost.conf" >}}
server {
    listen 80;
    listen [::]:80;

    server_name example.com;
    root /var/www/ghost/example.com/system/nginx-root;

    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $http_host;
        proxy_pass http://127.0.0.1:2368;

    }

    location ~ /.well-known {
        allow all;
    }

    client_max_body_size 50m;
}
{{</ file >}}

1.  Open the firewall for traffic:

        sudo firewall-cmd --zone=public --permanent --add-service=http
        sudo firewall-cmd --zone=public --permanent --add-service=https
        sudo firewall-cmd --reload

### Install and Configure MySQL

1. Download and install MySQL:

        sudo dnf install @mysql

1.  Set MySQL to start on reboot:

        sudo systemctl enable --now mysqld

1. Log into MySQL:

        sudo mysql

1.  Create a user `ghost` for your new site. Replace `StrongPassword` with a real password:

        CREATE USER ghost@localhost IDENTIFIED BY "StrongPassword";

1.  Create a database for your new site:

        CREATE DATABASE  ghost;

1.  Grant your new user privileges:

        GRANT ALL ON ghost.* TO ghost@localhost;

1.  Flush privileges and exit:

        FLUSH PRIVILEGES;
        quit

### Install Node.js and NPM

Ghost is built on Node.js and follows Node's Long Term Support (LTS) plan. Ghost only supports [LTS versions of Node.js](https://github.com/nodejs/LTS).

Download and install Node.js:

    sudo dnf -y install @nodejs
    sudo npm install pm2 -g

## Install and Configure Ghost

### Install Ghost-CLI

Ghost-CLI is a command line interface (CLI) tool that makes installing and updating Ghost easy. It sets up the database, configures NGINX as a reverse proxy, enables TLS/SSL security using Let's Encrypt CA, automatically renews your SSL, and initializes Ghost as a systemd service.

Install Ghost-CLI:

    sudo npm install -g ghost-cli@latest

### Install Ghost

Install Ghost using the Ghost-CLI tool.

1. Create the document root directory:

        sudo mkdir -p /var/www/ghost

    {{< note >}}
Installing Ghost in the `/root` or `/home/{user}` folder won’t work and results in a broken setup. Only use `/var/www/{folder}` because it has the correct permissions.
{{</ note >}}

1. Change ownership of the `/var/www/ghost` directory to the non-root user with `sudo` privileges that you created. In this example, `ghostexample`:

        sudo chown ghostexample:ghostexample /var/www/ghost
        sudo chmod 775 /var/www/ghost

1. Navigate to the Ghost root directory:

        cd /var/www/ghost

1.  Make the directory for your blog then change into that directory:

        sudo mkdir example.com
        cd example.com

1.  Ensure that the directory is empty to avoid file conflicts:

        ls -a

1. Install Ghost in production mode:

        ghost install

    {{< note >}}
By default Ghost looks for Ubuntu and will display this warning if it detects a different operating system.

{{< output >}}
System checks failed with message: 'Linux version is not Ubuntu 16 or 18'
Some features of Ghost-CLI may not work without additional configuration.
For local installs we recommend using `ghost install local` instead.
{{</ output >}}

It will ask you if you would like to continue anyway, answer yes.
{{</ note >}}

1. Answer each question as prompted. For more information about each question, visit the [Ghost documentation](https://ghost.org/docs/install/ubuntu/#install-questions):

    {{< output >}}
? Enter your blog URL: https://example.com
? Enter your MySQL hostname: localhost
? Enter your MySQL username: root
? Enter your MySQL password: thePasswordYouEnteredForRoot
? Enter your Ghost database name: exampleGhost
Configuring Ghost
Setting up instance

Setting up "ghost" system user
? Do you wish to set up "ghost" mysql user? yes
? Do you wish to set up Nginx? yes
? Do you wish to set up SSL? yes
? Enter your email (used for Let's Encrypt notifications) user@example.com
? Do you wish to set up Systemd? yes
? Do you want to start Ghost? yes
{{< /output >}}

1. After installation is complete, run `ghost ls` to view running Ghost processes:

        ghost ls

In the future when a newer version of Ghost is released, run `ghost update` from the `/var/www/ghost` directory to update to the newest version.

### Complete the Setup

To complete the setup process, navigate to the Ghost configuration page by appending `/ghost` to the end of your blog’s URL or IP. This example uses `https://example.com/ghost`.

1. On the welcome screen, click **Create your account**:

    ![Ghost Welcome Screen](ghost-welcome-screen.png "Ghost Welcome Screen")

1. Enter your email, create a user, password, and blog title:

    ![Create Your Account Screen](ghost-create-your-account.png "Create Your Account Screen")

1. Invite additional members to your team. If you’d prefer to skip this step, click **I’ll do this later, take me to my blog!** at the bottom of the page.

    ![Invite Your Team Screen](ghost-1-0-0-invite-team-small.png "Invite Your Team Screen")

1. Navigate the Ghost admin area to create your first post, change your site's theme, or configure additional settings:

    ![Ghost Admin Area](ghost-admin-area.png "Ghost Admin Area")

## Troubleshooting

1. Troubleshoot the system for any potential issues when installing or updating Ghost:

        ghost doctor

1. Get help about Ghost:

        ghost --help
