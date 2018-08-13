---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Install Gatsby.js on Ubuntu 18.04'
keywords: ['gatsbyjs','gatsby','ssg','static site generator']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-08-09
modified: 2018-08-09
modified_by:
  name: Linode
title: "Install Gatsby on Ubuntu 18.04"
contributor:
  name: Linode
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

## Introduction

Gatsby is a [Static Site Generator](/docs/websites/static-sites/how-to-choose-static-site-generator/#what-is-a-static-site) for React built on Node.js. Gatsby uses a modern web technology stack based on client-side Javascript, reusable APIs and prebuilt Markdown, otherwise known as the [*JAMstack*](https://jamstack.org/). This method of building a site is fast, secure and scalable.

Static websites don't build HTML on each page request. This is the reason they're so fast (and secure) as they do so little work. The server is just reading a file off disk. But this does mean that when you change or add to the site's content (e.g. new blog post) you do need to rebuild the site. This guide will set up a Gatsby repo on your local machine, manage it with version control and set up a deployment workflow with Netlify.

## Before You Begin

- This guide assumes you have followed the [Getting Started](https://www.linode.com/docs/getting-started/) and [Securing Your Server](https://www.linode.com/docs/security/securing-your-server/) guides, and that your Linode’s hostname is set.

    - To check your hostname run:

            hostname
            hostname -f

        The first command will output your short hostname; the second, your fully-qualified domain name (FQDN).

- Install [NGINX on Ubuntu 18.04](https://www.linode.com/docs/web-servers/nginx/install-nginx-ubuntu/).
- Set up [NGINX as a Reverse Proxy](/docs/web-servers/nginx/use-nginx-reverse-proxy/) for the Gatsbyjs site.

{{< note >}}
This guide will use sudo wherever possible. Complete the sections of our Securing Your Server guide to create a standard user account, harden SSH access and remove unnecessary network services.
{{</ note >}}

## Install Gatsby on a Linode

1. Install Node.js on your Linode:

        sudo apt install nodejs

1. Ensure Node.js was installed by checking its version:

        node --version

    Gatsby supports versions of Node back to v6.

1. Install the Node Package Manager (npm)

        sudo apt install npm

    Gatsby supports versions of npm back to v3.

1. Gatsbyjs uses the concpet of "starters" that provide a pre-configured base Gatsby site that you can use to build on top off. Install the "Hello World" starter:

        sudo npm install --global gatsby-cli

1. Open a new shell session and SSH into your Linode. Navigate to the NGINX server's root location. In our configuration this is `/usr/share/nginx/html/`. Create a new Gatsby site called `example-site` using the "Hello World" starter and navigate to the directory:

        sudo gatsby new example-site https://github.com/gatsbyjs/gatsby-starter-hello-world
        cd /usr/share/nginx/html/example-site

1. Run the built in Gatsby development server:

        gatsby develop

    After issuing the command, your directory should display the following files:

    {{< output >}}
    LICENSE  node_modules  package.json  package-lock.json  public  README.md  src
    {{</ output >}}

1. Open a browser and enter in your site's FQDN and view the "Hello World" page.

## Set up a Reverse Proxy for Gatsbyjs

### Build Your Gatsby Site

1. In your Gatsyb site's directory, run the build command to build all the site files from source:

        gatsby build

## Install Gatsby

1. On your local computer, create a directory to store your Gatsby site and navigate to the directory.

    mkdir example-site
    cd example-site

1. Install Nodejs:

        sudo apt install nodejs

1. Ensure Node.js was installed by checking its version:

        node --version

    Gatsby supports versions of Node back to v6.

1. Install the Node Package Manager (npm)

        sudo apt install npm

    Gatsby supports versions of npm back to v3.

1. Install the Gatsby command line tool globally on your system to ensure Gatsby has access to the necessary dependencies:

        npm install --global gatsby-cli

1. Gatsbyjs uses *starters* to provide a pre-configured base Gatsby site that you can use to build on top off. Install the "Hello World" starter and move to he new directory:

        gatsby new example-site https://github.com/gatsbyjs/gatsby-starter-hello-world
        cd example-site

1. The `example-site` directory should include the following files:

    {{< output >}}
    LICENSE           README.md         node_modules      package-lock.json package.json      src
    {{</ output >}}

    Gatsby uses [React](https://reactjs.org/) *components* to build your site's static pages. Components are small and isolated pieces of code. Page components are stored in the `src/pages` directory and automatically become site pages with paths based on the file name. The "Hello World" starter contains an `index.js` file in the `src/pages` directory, which will be mapped to our site's homepage.

## Version Control Your Gatsby Project

1. Initialize a git repository to begin tracking your project files and stage all the files for your first commit:

        git init
        git add -A

    The Hello World starter includes a .gitignore file to designate which files and directories to ignore.

1. Commit all the Hello World starter files:

        git commit -m 'Initial commit'

1. Navigate to your Github account, create a new remote repository and copy the new remote repository's URL.

1. Add the remote repository as your local repository's origin. Replace `remote-repository-url` with your own repository's location:

        git remote add origin https://github.com/remote-repository-url

1. Verify the origin location for the remote repository:

        git remote -v

1. Push your local repository to the remote repository:

        git push origin master

## Connect Your Remote Repository to Netlify

1. Navigate to the [Netlify](https://www.netlify.com/) site and click on the **Sign Up** link.

    ![Netlify Home Page](sign-up.png "Netlify Home Page")

1. Click on the **GitHub** button to connect your GitHub account with Netlify. If you used a different web based version control service, select that option instead.

    ![GitHub and Netlify connection page](github-connect.png "GitHub and Netlify connection page")

1. You will be taken to the GitHub site and asked to authorize Netlify to access your account. Click on the **Authorize Netlify** button:

    ![GitHub Netlify Authorization](authorize.png "GitHub Netlify Authorization")

1. Add your new site to Netlify and continue along with the prompts to finish connecting your repository to Netlify. Be sure to select the remote repository created in the previous steps:

    ![Add site to Netlify](add-site.png "Add site to Netlify")

1. Provide the desired deploy settings for your repository. Unless you are sure you need something different, keep the Netlify defaults:

    ![Netlify repository settings](deploy-settings.png "Netlify repository settings")

    You can add a `netlify.toml` configuration file to your repository to define more deployment settings.

Everytime you push a branch up to your Git repository, you will be able to view a Netlify build preview before deploying with TravisCI.

## Travis CI

{{< note >}}
Make sure you commit changes at logical places as you make changes to your `example-site` repository
{{</ note >}}

1. Authorize Travis CI on Github

1. Add a `.travis.yml` file to your repository

1. Install Travis CLI

        gem install travis

1. Log into your git hub account via the Travis CLI. Enter the following command and follow the prompts to provide your GitHub login credentials:

        travis login --org

1. Create a `scripts` directory and `deploy.sh` file

1. Create ssh keys to store in the `scripts` directory:

        ssh-keygen -t rsa -b 4096 -C "your_email@example.com" -f ~/example-site/scripts/.ssh/id_rsa

1. Create a `.gitignore` file in the `scripts` directory to ignore your rsa keys. Add the following two lines to the `.gitignore` file:

{{< content ".gitignore">}}
id_rsa
id_rsa.pub
{{</ content >}}

1. Encrypt your ssh keys using the travis cli. Make sure you are in your `scripts/.ssh` directory:

       travis encrypt-file .ssh/id_rsa --add

    You should now see a `id_rsa.enc` file in your scripts directory. The `--add` flag tells Travis Cli to add the following line to the .travis.yml file:

        {{< content ".travis.yml">}}
        before_install:
            - openssl aes-256-cbc -K $encrypted_07d52615a665_key -iv $encrypted_07d52615a665_iv
               -in id_rsa.enc -out .ssh/id_rsa -d
        {{>/ content }}

    Edit the `.travis.yml` file to add the location of the `id_rsa.enc` file:
        {{< content ".travis.yml">}}
        before_install:
            - openssl aes-256-cbc -K $encrypted_07d52615a665_key -iv $encrypted_07d52615a665_iv
               -in scripts/id_rsa.enc -out .ssh/id_rsa -d
        {{>/ content }}

1. Add your deploy key to the remote server:

        scp ~/example-site/scripts/.ssh/id_rsa.pub example_user@203.0.113.10:~/.ssh/authorized_keys

## Server side Steps User Management

1. SSH into your Linode and navigate to the directory the directory you have configured to server your files in the NGNIX `conf.d` directory:

1. Initialize the directory as a git repository

        git init

1.

1. On the Linode, create a `git` user and a `.ssh` directory for the user.





1. Initialize a git repository to begin tracking your files:

    git init

    This will create `.git` directory file in the root of your project directory.









