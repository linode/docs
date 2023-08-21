---
slug: deploy-a-react-app-on-linode
description: 'Learn to deploy a locally developed React application to your Linode using Rsync.'
og_description: 'Use Rsync to deploy a React application from your local computer to a Linode.'
keywords: ['react','reactjs','deploy','rsync']
tags: ["web applications","apache","nginx"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-01-31
modified: 2018-01-31
modified_by:
  name: Linode
title: "Deploy a React Application on Linode"
aliases: ['/development/react/deploy-a-react-app-on-linode/','/development/javascript/deploy-a-react-app-on-linode/']
deprecated: true
deprecated_link: 'guides/how-to-deploy-a-react-app-on-debian-10/'
external_resources:
- '[React - A JavaScript library for building user interfaces](https://reactjs.org/)'
- '[Deploy a React App with Sass Using NGINX](https://web.archive.org/web/20191130010415/http://zabana.me/notes/build-deploy-react-app-with-nginx.html)'
audiences: ["beginner"]
concentrations: ["Web Applications"]
languages: ["javascript"]
authors: ["Phil Zona"]
---

## What is React?

[React](https://reactjs.org/) is a popular JavaScript library for building user interfaces. While React is often used as a frontend for more complex applications, it's also powerful enough to be used for full client-side applications on its own.

Since a basic React app is static (it consists of compiled HTML, CSS, and JavaScript files), it is easy to deploy from a local computer to a Linode using [Rsync](https://rsync.samba.org/). This guide shows how to set up your Linode and local machine so that you can easily deploy your app whenever changes are made.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  You will need a [web server](/docs/web-servers/) configured to host a website on your Linode.

1.  This guide assumes you already have a React app you'd like to deploy. If you don't have one, you can bootstrap a project quickly using [create-react-app](https://github.com/facebookincubator/create-react-app).

1.  Make sure [Git](/docs/guides/how-to-configure-git/) is installed on your system:

        sudo apt install git

## Configure your Linode for Deployment

The steps in this section should be performed on your Linode.

### Create Host Directory

1.  Navigate to your *web root*, or the location from which you'll serve your React app, and create a directory where your app will live. Most of the time, this will be `/var/www`, but you can adjust the path and the directory name for your needs:

        sudo mkdir -p /var/www/mydomain.com

2.  Set permissions for the new directory to allow your regular user account to write to it:

        sudo chmod 755 -R /var/www/mydomain.com

### Configure Web Server

1.  Ensure your web server is configured to serve from the file path created in the previous step.

    **Apache**

    Modify the `DocumentRoot` in your virtual host file:

    {{< file "/etc/apache2/sites-available/mydomain.com.conf" aconf >}}
<VirtualHost *:80>
     ServerAdmin webmaster@mydomain.com
     ServerName mydomain.com
     ServerAlias www.mydomain.com
     DocumentRoot /var/www/mydomain.com/ ## Modify this line as well as others referencing the path to your app
     ErrorLog /var/www/mydomain.com/logs/error.log
     CustomLog /var/www/mydomain.com/logs/access.log combined
</VirtualHost>
{{< /file >}}

    **NGINX**

    Modify the line starting with `root` in the server block for your site:

    {{< file "/etc/nginx/conf.d/myapp.conf" nginx >}}
server {
    listen 80;
    listen [::]:80;

    root /var/www/mydomain.com; ## Modify this line
        index index.html index.htm;

}
{{< /file >}}

2.  Restart the web server to apply the changes. Use whichever command applies to your web server:

        sudo systemctl restart apache2
        sudo systemctl restart nginx

## Configure Local Computer

1.  Navigate to the directory where your local project lives. For example:

        cd ~/myapp

    If you don't have an existing project to use, you can create one using [create-react-app](https://github.com/facebookincubator/create-react-app).

2.  Using a text editor, create a deployment script called `deploy` in your app's root directory. Replace `exampleuser` with the username of your limited user account, and `mydomain.com` with your Linode's FQDN or public IP address.

    {{< file "~/myapp/deploy" bash >}}
#!/bin/sh

echo "Switching to branch master"
git checkout master

echo "Building app"
npm run build

echo "Deploying files to server"
rsync -avP build/ exampleuser@mydomain.com:/var/www/mydomain.com/
echo "Deployment complete"
{{< /file >}}

    This script will check out the master branch of your project on Git, build the app using `npm run build`, and then sync the build files to the remote Linode using Rsync. If your React app was not built with `create-react-app`, the build command may be different and the built files may be stored in a different directory (such as `dist`). Modify the script accordingly.

3.  Make the script executable:

        sudo chmod u+x deploy

4.  Run the script:

        ./deploy

    Enter your Unix password when prompted.

5.  In a browser, navigate to your Linode's domain name or public IP address. If the deploy was successful, you should see your React app displayed.

6.  Make a few changes to your app's `src` directory and then re-run the `deploy` script. Your changes should be visible in the browser after reloading the page.

## Next Steps

Deployment can be a complex topic and there are many factors to consider when working with production systems. This guide is meant to be a simple example for personal projects, and isn't necessarily suitable on its own for a large scale production application.

More advanced build and continuous integration tools such as [Jenkins](https://jenkins.io) or [Travis](https://travis-ci.org/) can be used to automate a more complicated deployment workflow. This can include running unit tests before proceeding with the deployment and deploying to multiple servers (such as test and production boxes). See our guide on [Jenkins](/docs/guides/automate-builds-with-jenkins-on-ubuntu/) to get started.
