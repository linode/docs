---
author:
  name: Phil Zona
  email: phil.b.zona@gmail.com
description: 'Learn to deploy a locally developed React application to your Linode using Rsync.'
og_description: 'Use Rsync to deploy a React application from your local computer to a Linode.'
keywords: ['react','reactjs','deploy','rsync']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-01-31
modified: 2018-01-31
modified_by:
  name: Linode
title: "Deploy a React Application on Linode"
contributor:
  name: Phil Zona
  link: https://twitter.com/philzona
external_resources:
- '[React - A JavaScript library for building user interfaces](https://reactjs.org/)'
- '[Deploy a React App with Sass Using NGINX](http://zabana.me/notes/build-deploy-react-app-with-nginx.html)'
---

## What is React?

[React](https://reactjs.org/) is a popular JavaScript library for building user interfaces. While React is often used as a frontend for more complex applications, it's also powerful enough to be used for full client-side applications on its own.

Since a basic React app is static (it consists of compiled HTML, CSS, and JavaScript files), it is easy to deploy from a local computer to a Linode using [Rsync](https://rsync.samba.org/). This guide shows how to set up your Linode and local machine so that you can easily deploy your app whenever changes are made.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  You will need a [web server](/docs/web-servers/) configured to host a website on your Linode.

4.  This guide assumes you already have a React app you'd like to deploy. If you don't have one, you can bootstrap a project quickly using [create-react-app](https://github.com/facebookincubator/create-react-app).

5.  Make sure [Git](/docs/development/version-control/how-to-configure-git/) is installed on your system:

        sudo apt install git

6.  Update your system:

        sudo apt update && sudo apt-get upgrade

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

    {{< file "/etc/nginx/sites-available/mydomain.com.conf" aconf >}}
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

More advanced build and continuous integration tools such as [Travis](https://travis-ci.org/), [Jenkins](https://jenkins.io), and [Wercker](http://www.wercker.com/) can be used to automate a more complicated deployment workflow. This can include running unit tests before proceeding with the deployment and deploying to multiple servers (such as test and production boxes). See our guides on [Jenkins](/docs/development/ci/automate-builds-with-jenkins-on-ubuntu/) and [Wercker](/docs/development/ci/how-to-develop-and-deploy-your-applications-using-wercker/) to get started.
