---
author:
  name: Phil Zona
  email: phil.b.zona@gmail.com
description: 'Learn to deploy a locally developed React application to your Linode using Git and Git hooks.'
keywords: ['react','reactjs','deploy','git']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-01-20
modified: 2018-01-20
modified_by:
  name: Linode
title: "Deploy a React App on Linode"
contributor:
  name: Phil Zona
  link: https://twitter.com/philzona
external_resources:
- '[React - A JavaScript library for building user interfaces](https://reactjs.org/)'
- '[Customizing Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)'
---

In this guide, we'll learn how to deploy a React application to a live site on the internet. [React](https://reactjs.org/) is one of the most popular JavaScript libraries for building user interfaces. While React is often used as a frontend for more complex applications, it's also powerful enough to be used for full client-side applications on its own.

To deploy our React app, we'll be using Git and a [Git hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks). A Git hook is a custom script that is triggered upon certain actions within a Git repository. For example, we'll use a hook to add bundled files and static assets to a web root when the code is received by our server.

If you haven't used Git hooks before, it may be helpful to think of them as analogous to React's [component lifecycle methods](https://reactjs.org/docs/react-component.html). Just like a lifecycle method triggers at different stages of rendering, like before a component is inserted into the DOM, a Git hook will trigger at different points in time relative to the commits and pushes you make.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  You will need to have a web server, such as [nginx](https://linode.com/docs/web-servers/nginx/how-to-configure-nginx/) or [Apache](https://linode.com/docs/web-servers/apache/apache-web-server-on-ubuntu-14-04/) installed and configured to host a website on your Linode. We'll cover the exact configuration details later in the guide.

4.  This guide assumes you already have a React app you'd like to deploy. If you don't have one, you can bootstrap a project quickly using [create-react-app](https://github.com/facebookincubator/create-react-app).

5.  Make sure [Git](https://linode.com/docs/development/version-control/how-to-configure-git/) is installed on your system:

        sudo apt-get install git

5.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

## Configuring Your Linode for Deployment

First, we'll set up everything on the server side. The steps in this section should be performed on your Linode.

1.  Navigate to your *web root*, or the location from which you'll be serving your React app, and create a directory where your app will live. Most of the time, this will be `/var/www`, but you can adjust the path and the directory name for your needs:

        cd /var/www
        sudo mkdir mydomain.com

2.  Create a new directory to store your Git repository. You can replace `myapp` with the name of your React app:

        sudo mkdir -p /var/repos/myapp.git

3.  Navigate to the directory we just created and initialize a bare Git repository:

        cd /var/repos/myapp.git
        git init --bare

    We're creating a separate repository rather than using the directory we created in our web root because of the way Git works. A repository can't receive a push to a branch that's currently checked out. Since we'll be deploying to our master branch, we need two locations: one to accept pushes and one to store the files.

4.  Within the bare Git repository we just created, we'll create our hook. Navigate into the `hooks` directory and create a file called `post-receive`:

        cd hooks
        sudo touch post-receive

5.  Add the following contents to the new `post-receive` hook:

    {{< file "post-receive" bash >}}
#!/bin/bash
git --work-tree=/var/www/mydomain.com --git-dir=/var/repo/myapp.git checkout -f
{{< /file >}}

    This hook is a Bash script that is executed after the Git repo receives a push (this is why we named it `post-receive`). It places the contents of that push, noted by the `git-dir` option into another location noted by the `work-tree` option. Be sure to replace the file paths above if you chose different names.

6.  Make the `post-receive` hook executable:

		sudo chmod +x post-receive

7.  Ensure your web server is configured to serve from the "work tree" file path we configured in the previous step.

    If you're using Apache, this will be the `DocumentRoot` in your virtual host file:

    {{< file "/etc/nginx/sites-available/mydomain.com.conf" aconf>}}
<VirtualHost *:80>
     ServerAdmin webmaster@mydomain.com
     ServerName mydomain.com
     ServerAlias www.mydomain.com
     DocumentRoot /var/www/mydomain.com/ ## Modify this line as well as others referencing the path to your app
     ErrorLog /var/www/mydomain.com/logs/error.log
     CustomLog /var/www/mydomain.com/logs/access.log combined
</VirtualHost>
{{< /file >}}

    If you're using nginx, this will be found in the line starting with `root` in the server block for your site:

    {{< file-excerpt "/etc/nginx/sites-available/default" nginx >}}
server {
    listen 80;
    listen [::]:80;

    root /var/www/mydomain.com; ## Modify this line
        index index.html index.htm;

}
{{< /file-excerpt >}}

8.  Restart your web server to apply the changes. Use whichever command applies to your web server:

        sudo systemctl restart apache2
        sudo systemctl restart nginx

## Configuring your Local Computer

1.  Navigate to the directory where your local project lives. For example:

        cd ~/myapp

    If you don't have an existing project to use, you can create one at this stage using [create-react-app](https://github.com/facebookincubator/create-react-app).

2.  Next, we need to make sure we're only pushing the static bundle and assets to our Linode. Navigate into the `build` directory within your React app:

        cd build

    This naming convention assumes you used `create-react-app` to bootstrap your project. It's possible that your files live in a directory with a different name; for example, `dist` is another common name for this location. If your project uses different names, navigate to whichever folder contains your static bundle and assets.

3.  Initialize a Git repository in this directory:

        git init

    {{< note >}}
It's good practice to keep built files out of version control for React projects. The `build/` or `dist/` directory should be included in your React app's `.gitignore` file. Now is a good time to check that this is the case for your project.
{{</ note >}}

4.  Add the Git directory on your Linode as a remote repository:

        git remote add prod ssh://user@mydomain.com/var/repos/myapp.git

    Make sure to substitute `user` with your username and `mydomain.com` with your Linode's domain. We're using `prod` here as the name of the remote, but you can use a different naming convention if you like. Also note that the remote path is the Git directory, *not* the web root where the content will be served from.

5.  If your `build` directory is currently empty, be sure to run your build script for your React project. If you used `create-react-app`, you can do this by navigating up one directory (`cd ..`) and running `npm run build` or `yarn build`.

6.  Once the static files have been built, commit them with Git. This should be done in the `build` directory's Git repo, *not* in the top level React app:

        git add .
        git commit -m "Initial commit"

7.  Now that we have our app committed to Git history, we're ready to deploy. With the setup we've created, we can do this with a single Git push to the remote repo we specified in step 4:

        git push prod master

8.  Finally, visit your domain in a browser and check to make sure your app displays correctly.

## Next Steps

Deployment can be a complex topic and there are a number of factors to consider when working with production systems. This guide is meant to be a simple example for personal projects, and isn't necessarily suitable (on its own) for a large scale production application.

However, this setup does give you a starting point for building a deployment pipeline of your own. We created a `post-receive` Git hook, which triggers after a push has been received, but there are a variety of others that can be implemented both on the client and the server.

For example, you may set up a `pre-commit` hook on your local computer to run tests automatically and ensure that they pass before your code is committed. You might also implement a `pre-receive` hook on the server for access control for files that are being modified. You can find more details on the available Git hooks [here](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks).

The system we created can also be used for static websites of other kinds, not just React apps. To implement a similar Git deployment system in another project, the steps will be identical on the server, and the only differences may be in the naming conventions of the project on your local machine.

