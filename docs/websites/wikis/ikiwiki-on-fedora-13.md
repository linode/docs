---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Using Ikiwiki on Fedora 13 to power a standard wiki implementation.'
keywords: ["ikiwiki", "fedora", "fedora 12", "wiki", "perl", "git", "markdown"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/wikis/ikiwiki/fedora-13/']
modified: 2011-04-29
modified_by:
  name: Linode
published: 2010-09-15
title: Ikiwiki on Fedora 13
---



Unlike some other popular wiki engines, Ikiwiki compiles static HTML pages which can be efficiently served with a basic web server. These are generated from a source directory that can be stored in the [version control](/docs/linux-tools/version-control/) system of your choice, though this guide assumes that you use [git](/docs/development/version-control/how-to-configure-git).

This guide is written for Fedora 13, and assumes that you've followed our [getting started guide](/docs/getting-started/) and have a running and updated system. Additionally, it is assume that you have a functioning [Apache web server](/docs/web-servers/apache/installation/fedora-13) and a working installation of [git](/docs/development/version-control/how-to-configure-git).

# Installing Ikiwiki

Ensure your system is up to date by issuing the following command:

    yum update

You're ready to install Ikiwiki and its dependencies using the following command:

    yum install ikiwiki git gcc httpd

Now that you have Ikiwiki installed, you can move on to configuring it for use.

# Automatic Ikiwiki Configuration

From the command line, you can issue the following command to generate a basic config file using Ikiwiki's auto-setup script.

    ikiwiki -setup /etc/ikiwiki/auto.setup

This will ask you a series of questions about file locations and the version control system you want to use. We recommend using git. When it's completed, it will generate the following output:

    Successfully set up foo:
        url:         http://example.com/~username/wiki
        srcdir:      ~/wiki
        destdir:     ~/public_html/wiki
        repository:  ~/wiki.git
    To modify settings, edit ~/wiki.setup and then run:
        ikiwiki -setup ~/wiki.setup

In this example, `example` is the machine's hostname, `username` is the admin user specified in the setup process, and `wiki` is the name of the wiki you specified during setup. You will need to configure your web server to serve files in `~/public_html/wiki` before this wiki will be accessible. No matter how you configure your web server, you will need to issue the following commands to start the web server for the first time and ensure that it will return following the next reboot cycle:

    chkconfig httpd on
    /etc/init.d/httpd start

While the auto-setup script is great for getting up and running in a matter of moments, you are encouraged to examine and edit the config file `~/wiki.setup` as needed. If the automatic wiki setup is not ideal for your setup, we recommend manual configuration.

# Manual Ikiwiki Configuration

To help you begin a manual configuration, we've included a full-featured [Ikiwiki configuration file](/docs/assets/656-ikiwiki.setup) for you to review and edit. This provides configuration options for common plugins and some additional comments. Issue the following commands to fetch this file:

    cd ~/
    wget -O ikiwiki.setup http://www.linode.com/docs/assets/656-ikiwiki.setup

If you do not use the auto creation script, you'll need to create the "source directory" repository. For the sake of example, the source directory will be `~/wiki/`. Issue the following commands to create the directory and repository:

    mkdir ~/wiki/
    cd ~/wiki/
    git init

You'll want to create an index or "home page" for your wiki in the `index.mdwn` file. When you've saved this file you'll need to add it to the staging area and create the commit with the following commands:

    git add index.mdwn
    git commit -m "creating the initial index file for the wiki"

It's important to set up a git repository that will be the "origin" repository for the source directory repository so that you will be able to clone and push from remote machines. We'll create the "origin" repository in `/srv/git/wiki.git/` using the following sequence of commands:

    mkdir -p /srv/git/wiki.git/
    cd /srv/git/wiki.git/
    git init --bare

Edit the `~/wiki/.git/config` file to create the remote repository so that it looks something like the following example:

{{< file "~/wiki/.git/config" >}}
[core]
:   repositoryformatversion = 0 filemode = true bare = false logallrefupdates = true

[remote "origin"]
:   fetch = +refs/heads/*:refs/remotes/origin/* url = /srv/git/wiki.git

[branch "master"]
:   remote = origin merge = refs/heads/master
{{< /file >}}

Now perform the first push using the following sequence of commands. This will update the "origin" repository with the first commit created above:

    cd ~/wiki/
    git push origin master

Read through the `ikiwiki.setup` file that you fetched above. It is located at `~/ikiwiki.setup`. This file has been thoroughly commented to make it easy to configure Ikiwiki for your particular needs. Alter it to conform to your setup and to point to the correct locations of the various repositories created above. After the file is edited correctly, issue the following command:

    ikiwiki --setup ~/ikiwiki.setup

This assumes the `ikiwiki.setup` file is located in the home directory of the current user. You may have to adjust the path in the command if your Ikiwiki configuration file is located elsewhere.

If you have git installed, you can now clone the repository that stores the content for your wiki to your local machine. Use the following command:

    git clone ssh://username@colab.example.com/srv/git/wiki.git

In this example, `username` is the username, `colab.example.com` is the name of the host where the repository resides, and `/srv/git/wiki.git` is the location of the "bare" repository.

If Ikiwiki is configured correctly, when you do a `git push` to the remote repository, a "`post-update` hook" will trigger Ikiwiki to refresh the wiki with the content contained in your commit.

If you have not started Apache for the first time, you will need to issue the following commands to start the web server and ensure that it starts up when your Linode boots:

    chkconfig httpd on
    /etc/init.d/httpd start

# Advanced Ikiwiki Setup

While all of the content of an Ikiwiki is stored under version control, the templates and configuration files are stored outside of the source directory. If you want to use git to store these files and track the versions of your configuration, it is recommended that you make an "admin" repository located in the `~/wiki-admin` directory. This should reside next to the `~/wiki/` repository/directory where the wiki's source directory is located. To create the directory and initialize the repository, issue the following commands:

    mkdir ~/wiki-admin/
    cd ~/wiki-admin/
    git init

Move your `ikiwiki.setup` file into `~/wiki-admin/`. You may also want to move the template files into the `wiki-admin` repository with the following command:

    cp -R /usr/share/ikiwiki/templates/ ~/wiki-admin/

Add these files to the commit and create an initial commit object with the following commands:

    git add .
    git commit -m "templates and ikiwiki.setup"

The process for creating a bare repository to push/pull the `wiki-admin` git repository is very much like the process you use for creating the bare "remote" repository for the `wiki/` content. To begin, create a bare remote repository:

    mkdir -p /srv/git/wiki-admin.git/
    cd /srv/git/wiki-admin.git/
    git init --bare

Next, edit the `~/wiki-admin/.git/config` file to set up the remote repository. Use the following example as a guideline.

{{< file "~/wiki/.git/config" >}}
[core]
:   repositoryformatversion = 0 filemode = true bare = false logallrefupdates = true

[remote "origin"]
:   fetch = +refs/heads/*:refs/remotes/origin/* url = /srv/git/wiki-admin.git

[branch "master"]
:   remote = origin merge = refs/heads/master
{{< /file >}}

Now you can perform the first push for the `wiki-admin` repository by issuing the following commands:

    cd ~/wiki-admin/
    git push origin master

You can clone the `wiki-admin` repository to your local machine with the following command (issued locally):

    git clone ssh://username@colab.example.com/srv/git/wiki-admin.git

In this example, `username` is the username, `colab.example.com` is the name of the host where the repository resides, and `/srv/git/wiki-admin.git` is the location of the "bare" repository. When you push to this repository, you'll need to issue a `git pull` from within `~/wiki-admin/` on your server so that Ikiwiki will be able to see the changes you've made. You may set up a `post-update` hook at `/srv/git/wiki-admin.git/hooks/post-update` to make sure that `~/wiki-admin` stays up to date.

The `wiki-admin` repository is totally optional, however it will simplify backup and mirroring down the road and allow you to version the templates. If you think any of these features will be helpful in your setup, you are encouraged to consider storing your files in this manner. If you have not yet started Apache for the first time, you will need to issue the following commands to start the web server and ensure that it will return if the system reboots:

    chkconfig httpd on
    /etc/init.d/httpd start

# Using Ikiwiki

Once installed, using Ikiwiki itself is fairly straightforward. You can push content to the bare repository, and Ikiwiki will incrementally update the pages changed in that commit. You can also choose to update pages via the web-based interface. As a result, you may find that you don't actually need to interact with the `ikiwiki` program very much.

Nevertheless, if you change a configuration option or a template and need to rebuild all pages in the wiki, issue the following command:

    ikiwiki --setup ~/wiki-admin/ikiwiki.setup

In this command, `~/wiki-admin/ikiwiki.setup` represents the path to your setup file.

You may find yourself wondering why there are so many git repositories for a single wiki. The setup with a remote "bare" repository allows Ikiwiki to avoid a situation where you might "push" content to a non-bare repository, which would cause the "working copy" of the "source directory" repository to get out of sync with the sequence of commits in the git database. In short, **never push to a non-bare git repository**.

# Notes for Using Gitosis with Ikiwiki

If you're using `gitosis` to manage the git repositories as described in the [introduction to Git](/docs/linux-tools/version-control/git) guide, there are a couple of configuration options for Ikiwiki that you'll need to keep in mind as you're setting things up. As `gitosis` needs to "own" the git repositories it manages, the `gitosis` user ends up executing the `post-update` hook and wrappers, and as a result many Ikiwiki files need to be owned by the `gitosis` user. This should not present a concern as Ikiwiki's scripts are designed to be run securely by untrusted usersor "6755". See the example [Ikiwiki configuration file](/docs/assets/656-ikiwiki.setup) for details on how to configure this.

The files that needed to be owned by the `gitosis` user are the "destination" directory where Ikiwiki puts its output, the "source directory", and the bare repository. Run the following commands to set this ownership.

    chown -R gitosis:gitosis /srv/git/wiki.git
    chown -R gitosis:gitosis ~/wiki/
    chown -R gitosis:gitosis /srv/www/example.com/public_html/wiki

Change the paths as necessary and run those commands again to correct permissions errors if you're having a permissions problem.

If you're using `gitosis`, you will want to run Ikiwiki scripts and interact with the git repositories on the server as the git user in order to ensure that permissions stay set as needed. You can use the `su` (switch user) command to get a prompt as the `gitosis` user by issuing a command in the following format:

    su --login gitosis

However, using the `sudo` command may prove more useful and flexible for some use cases. To issue a single command as the `gitosis` user, prefix that command with `sudo -u gitosis`. For example, to trigger Ikiwiki to refresh your wiki, use the following format:

    sudo -u gitosis ikiwiki --setup ~/wiki-admin/ikiwiki.setup

If you need to drop into a prompt as the `gitosis` user for more complicated operations, issue the following command:

    sudo -u gitosis -s

Beyond these basic considerations, using Ikiwiki with gitosis is no different than using Ikiwiki with more conventionally managed repositories.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Ikiwiki Home Page](http://ikiwiki.info)
- [Example Ikiwiki Deployments](http://ikiwiki.info/ikiwikiusers/)



