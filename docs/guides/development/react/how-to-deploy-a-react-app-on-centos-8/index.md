---
slug: how-to-deploy-a-react-app-on-centos-8
author:
  name: Linode
description: This guide will show you how to deploy a React app to a CentOS 8 Linode that is running a web server. You will configure your Linode to host a React app by installing and configuring a web server, like Apache or NGINX. Then, you will configure your computer to ensure you can develop a React app locally. Finally, you will deploy all of your site's build files to your remote Linode using Rsync.
og_description: This guide will show you how to deploy a React app to a CentOS 8 Linode that is running a web server. You will configure your Linode to host a React app by installing and configuring a web server, like Apache or NGINX. Then, you will configure your computer to ensure you can develop a React app locally. Finally, you will deploy all of your site's build files to your remote Linode using Rsync.
keywords: ['react','reactjs','deploy','rsync']
tags: ["web applications","apache","nginx","centos"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-04-24
modified: 2020-04-24
image: Deploying_a_React_Application_on_Centos_8_1200x631.png
modified_by:
  name: Linode
title: "How to Deploy a React Application on CentOS 8"
h1_title: "Deploying a React Application on CentOS 8"
contributor:
  name: Linode
external_resources:
- '[React - A JavaScript library for building user interfaces](https://reactjs.org/)'
- '[Deploy a React App with Sass Using NGINX](http://zabana.me/notes/build-deploy-react-app-with-nginx.html)'
audiences: ["beginner"]
concentrations: ["Web Applications"]
languages: ["javascript"]
relations:
    platform:
        key: deploy-react-app
        keywords:
            - distribution: CentOS 8
aliases: ['/development/react/how-to-deploy-a-react-app-on-centos-8/']
---

## What is React?

[React](https://reactjs.org/) is a popular JavaScript library for building user interfaces. While React is often used as a frontend for more complex applications, it's also powerful enough to be used for full client-side applications on its own.

Since a basic React app is static (it consists of compiled HTML, CSS, and JavaScript files), it is easy to deploy from a local computer to a Linode using [Rsync](/docs/tools-reference/tools/introduction-to-rsync/). This guide shows how to set up your CentOS 8 Linode and local machine so that you can easily deploy your app whenever changes are made.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your [Linode's hostname](/docs/getting-started/#set-the-hostname) and [timezone](/docs/getting-started/#set-the-timezone).

1.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access, and remove unnecessary network services.

1.  Install and configure a [web server](/docs/web-servers/) to host a website on your Linode. This guide's examples will use the Apache and NGINX web servers. Complete the steps in the [Installing Apache Web Server on CentOS 8](/docs/web-servers/apache/how-to-install-apache-web-server-centos-8/) guide or the [Installing NGINX on CentOS 8](/docs/web-servers/nginx/how-to-install-nginx-centos-8/) guide.

1.  This guide assumes you already have a React app you'd like to deploy. If you don't have one, you can quickly bootstrap a project following the steps in the [Create an Example React App](#create-an-example-react-app) section of this guide. This step should be completed on your local system.

1.  Update your Linode's system.

        sudo yum update && sudo yum upgrade

1. Install the Rsync program on your Linode server.

        sudo yum install rsync

1.  Install [Git](/docs/development/version-control/how-to-configure-git/) on your local computer if it is not already installed.

        sudo yum install git

1. Install the SELinux core policy Python utilities if you have not already done so. This will give you the ability to manage SELinux settings in a fine-grained way.

        sudo yum install -y policycoreutils-python-utils

## Configure your Linode for Deployment

The steps in this section should be performed on your Linode.

### Create your Host Directory

1.  If it does not yet exist, create your site's web root directory. Most of the time, it will be located in the `/var/www` directory.

        sudo mkdir -p /var/www/example.com

1.  Set permissions for the new directory to allow your regular user account to write to it:

        sudo chmod 755 -R /var/www/example.com

1.  The Rsync program will execute its commands as the user you designate in your deployment script. This user must be the owner of your site's web root. Replace `example_user` with your own user's name and `/var/www/example.com` with the location of your site's web root.

        sudo chown -R example_user:example_user /var/www/example.com

1. Use SELinux’s `chcon` command to change the file security context for web content if you have not already done so.

        sudo chcon -t httpd_sys_content_t /var/www/example.com -R
        sudo chcon -t httpd_sys_rw_content_t /var/www/example.com -R

### Configure your Web Server

In this section, you will update your web server configuration to ensure that it is configured to point to your site's web root.

1.  Update your configuration file to point to your site's web root.

    >    **Apache**

    >  Modify the `DocumentRoot` in your virtual host file with the path to your site's web root.

    >  {{< file "/etc/apache2/sites-available/example.com.conf" aconf >}}
  <VirtualHost *:80>
      ServerAdmin webmaster@example.com
      ServerName example.com
      ServerAlias www.example.com
      DocumentRoot /var/www/example.com/ ## Modify this line as well as others referencing the path to your app
      ErrorLog /var/www/example.com/logs/error.log
      CustomLog /var/www/example.com/logs/access.log combined
  </VirtualHost>
  {{< /file >}}

    >  **NGINX**

    >  Modify the `root` parameter with the path to your site's web root.

    >  {{< file "/etc/nginx/sites-available.example.com" nginx >}}
  server {
      listen 80;
      listen [::]:80;

      root /var/www/example.com; ## Modify this line
      index index.html index.htm;

  }
  {{< /file >}}

1. Open the firewall for traffic if you have not already done so.

        sudo firewall-cmd --zone=public --permanent --add-service=http
        sudo firewall-cmd --zone=public --permanent --add-service=https
        sudo firewall-cmd --reload

1.  Restart the web server to apply the changes.

    > **Apache**

    >     sudo systemctl restart apache2

    >  **NGINX**

    >     sudo systemctl restart nginx

## Configure your Local Computer

### Install the Node Version Manager and Node.js

You will need Node.js installed on your local computer in order to build your React app prior to copying your site files to the remote Linode server.

{{< content "how-to-install-nvm" >}}

### Create an Example React App

If you already have a React App that you would like to deploy to your Linode, you can skip this section. Otherwise, follow the steps in this section to create a basic React app using the [create-react-app](https://github.com/facebook/create-react-app#create-react-app--) tool.

1. Use the Node Package Manager to create your React app.

        npm init react-app ~/my-app

### Create your Deployment Script

1.  Navigate to your app's directory. Replace `~/my-app` with the location of your React app's directory.

        cd ~/my-app

1.  Using a text editor, create a deployment script called `deploy.sh` in your app's root directory. Replace the following values in the example file:
  - `example_user` with the username of your limited user account.
  - `example.com` with your Linode's fully qualified domain name (FQDN) or public IP address.
  - `/var/www/example.com/` with the location of your site's web root. This is where all of your React app's local `build/` files will be copied to on the remote server.

    {{< file "~/my-app/deploy.sh" bash >}}
#!/bin/sh

echo "Switching to branch master"
git checkout master

echo "Building app"
npm run build

echo "Deploying files to server"
rsync -avP build/ example_user@example.com:/var/www/example.com/
echo "Deployment complete"
{{< /file >}}

    This script will check out the `master` branch of your project on Git, build the app using `npm run build`, and then sync the build files to the remote Linode using Rsync. If your React app was not built with `create-react-app`, the build command may be different and the built files may be stored in a different directory (such as `dist`). Modify the script accordingly.

    {{< note >}}
If your React app's directory is not initialized as a Git repository, the command `git checkout master` will return a `fatal: not a git repository (or any of the parent directories): .git` error. However, the script will continue on to the next commands and the files should still be transferred to your remote Linode server. See our [Getting Started with Git](/docs/development/version-control/how-to-configure-git/#use-git-with-a-local-repository) guide to learn how to initialize a Git repository.
    {{</ note >}}

1.  Make the script executable:

        sudo chmod u+x deploy.sh

1.  Run the deployment script. Enter your Linode user's password when prompted by the script.

        ./deploy.sh

1.  In a browser, navigate to your Linode's domain name or public IP address. If the deploy was successful, you should see your React app displayed.

      ![View your example React app in a browser.](example-react-app.png)

1.  Make a few changes to your app's `src` directory and then re-run the `deploy` script. Your changes should be visible in the browser after reloading the page.

## Next Steps

Deployment can be a complex topic and there are many factors to consider when working with production systems. This guide is meant to be a simple example for personal projects, and isn't necessarily suitable on its own for a large scale production application.

More advanced build and continuous integration tools such as [Travis](https://travis-ci.org/), [Jenkins](https://jenkins.io), and [Wercker](http://www.wercker.com/) can be used to automate a more complicated deployment workflow. This can include running unit tests before proceeding with the deployment and deploying to multiple servers (such as test and production boxes). See our guides on [Jenkins](/docs/development/ci/automate-builds-with-jenkins-on-ubuntu/) and [Wercker](/docs/development/ci/how-to-develop-and-deploy-your-applications-using-wercker/) to get started.