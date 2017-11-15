---
author:
  name: Linode
  email: docs@linode.com
description: 'Use the Mercurial version control system to manage source code in distributed environments.'
keywords: ["scm", "vcs", "hg", "mercurial", "dcvs", "source control management", "version control", "distributed version control"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/version-control/mercurial/','applications/development/manage-distributed-version-control-with-mercurial/']
modified: 2011-05-23
modified_by:
  name: Linode
published: 2010-04-26
title: Manage Distributed Version Control with Mercurial
external_resources:
 - '[Mercurial Project Home Page](http://mercurial.selenic.com/)'
 - '[HG Init, a Guide by Joel Spolsky](http://hginit.com/)'
---

Mercurial is one of the leading distributed version control systems that allows software developers and teams of collaborators to work on a common code base without needing to rely on a centralized server or constant network connection while working. This document will provide an introduction to the Mercurial version control system so you can begin to use Mercurial to manage source control and collaboration for your development projects.

Mercurial runs on multiple platforms and you may choose to use Mercurial to manage code projects on systems running many different operating systems. Before deploying Mercurial on a Linode, we assume that you have completed our [getting started guide](/docs/tools-reference/introduction-to-linux-concepts). If you're new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics).

## Installing Mercurial

Issue the following commands on Debian and Ubuntu systems to update your system's package repository, ensure that all installed packages are up to date, and install Mercurial and all of its dependencies:

    apt-get update
    apt-get upgrade
    apt-get install mercurial

On CentOS and Fedora systems, issue the following commands to ensure that all of your system's software and package databases are up to date and then install Mercurial:

    yum update
    yum install mercurial

On Arch Linux systems, issue the following commands to ensure that your system's package database is up to date and then install Mercurial:

    pacman -Sy
    pacman -S mercurial

Mac OS X and Windows users can download prepared packages for Mercurial directly from the [upstream download resource](http://mercurial.selenic.com/downloads/). Once Mercurial is installed, we can begin to manage our source control projects with this tool. All Mercurial commands in the shell environment begin with `hg` in reference to the abbreviation for the element Mercury.

## Local Mercurial Workflows

### Creating Repositories

Like other distributed version control systems, Mercurial allows users to maintain a sense of the history of a tree of files independently of a centralized remote server. Most operations with mercurial can be completed and tested locally and do not require any server configuration. Issue the following command to make a new directory called "myproject" and create a Mercurial repository in that directory:

    hg init myproject

Optionally change directory into the repository and init the repository as follows:

    cd myproject
    hg init

### Adding Files and Creating Commits

Once a repository exists you must add files before mercurial will be able to track their versions. In our new repository, issue the following command to create a file named `world` with the contents "`hello world`, and add this to the repository:

    echo "hello world" > world
    hg add

The file is now set to be included in the next commit is created. To "commit" this change and save it for future reference, issue the following command:

    hg commit -m 'hello mercurial world'

When complete, the new file at this iteration is saved in the Mercurial repository's database. The `-m` option causes Mercurial to store a message describing the contents of the commit change set to give your collaborators or future selves the ability to understand the contents of the commit change set. You may choose to omit the `-m` flag and the commit message, however Mercurial will open your system's default text editor so that you can edit your commit message there.

If you accidentally create a commit that you did not intend to, issue the following command to "rollback" the last commit without modifying the state of the files:

    hg rollback

After the first commit any changes you make to the `world` file will be tracked by Mercurial in successive commits. When you decide to add additional files you must specify them explicitly using the `hg add [filename]` command. Once added and committed the files will be tracked through future revisions.

Mercurial stores all changes you make to your repository in terms of two variables: a local revision number that begins at 0 and incrementing full numbers. Note that Mercurial also stores a universally unique identifier for every commit called a "changeset identifier" for cases when local revision numbers may not correspond to the revision numbers that collaborators may have.

### Manipulating Files

When you need to rename, move, or copy files or folders that are versioned by Mercurial, use Mercurial's default commands for manipulating files rather than using your operating system's default tools for managing your filesystem. For example:

    hg mv world hw.txt
    hg cp hw.txt hello-world
    hg rm hw.txt

These commands, in turn, move (rename) the `world` file to `hw.txt`, copy `hw.txt` to the file `hello-world` and finally remove the file `hw.txt`. When you perform the next commit, Mercurial will include these revisions in the changeset it saves, keeping track of a file's history despite any changes in name.

At any point, you can use the following `status` command to retrieve the current state of the working copy as you prepare for the next commit:

    hg status

If you accidentally move files using default filesystem tools without using mercurial tools you can issue the following command, to "clean up" your repository:

    hg addremove --similarity 100

### Viewing History

When working in Mercurial you can issue the following command at any point to view the difference between the last committed revision and the current uncommitted changes:

    hg diff

If you want to view a log of the history, issue the following command:

    hg log

This will produce output that resembles the following for each commit stored in Mercurial:

    changeset:   0:dcf111b16118
    tag:         tip
    user:        username@example.com
    date:        Thu Apr 22 18:51:21 2010 +0000
    summary:     hello mercurial world

To generate a patch or a view of the history of your repository with the differences (a "diff") contained within, issue a command in the following form:

    hg log -p -r 2 5

This generates a patch (`-p`) of all changes contained between revisions (`-r`) 2 and 5.

### Inserting Modifications into the History

If you need to make a modification to a revision after a changeset is committed, issue the following command to revert the current working copy to a previous version:

    hg update 4

This reverts the working copy to the 4th revision. Make the required modification and then commit the change using the `hg commit` command. Issue the following command to merge the new changes into the latest version of your repository:

    hg merge

Depending on the nature of the change, this command may resolve all changes without any errors. However, in some cases where a change is non-trivial this will create merge conflicts. In these cases, issue the following command:

    hg resolve --list

This generates a list of the changes that need to be resolved before the merge will succeed. Each file will need to be resolved in sequence. Issue the following command to "mark" each file as resolved:

    hg resolve --mark [file-name]

When all changes have been resolved, issue the `hg commit` command to complete the merge and continue developing from the most recent version of your repository.

If at any point you find yourself working in a revision and you would like to revert to the most recent commit, issue the following command:

    hg update tip

## Distributed Mercurial Workflows

Most of the Mercurial workflow cycle is completed in isolation from other developers and contributors. The above outline of how to manage version control will allow you to complete work on your projects even in the context of larger Mercurial-supported collaborations. The "distributed" workflows outlined below provide an overview of common procedures for using Mercurial in distributed environments.

### Retrieve Content from Remote Repositories

In many cases when you begin working on a project with Mercurial, you will be downloading a repository, or "cloning" the project. This operation will create a full and independent copy of the repository on your local system. Issue the following command:

    hg clone http://www.example.com/lolipop/

In this instance, the URL `http://www.example.com:8000/lolipop.hg` refers to the server hosting the repository in question. Once downloaded, you'll be able to manipulate files, create content, or remove content *and* commit those changes incrementally to create a history of the work you have accomplished.

As time passes you will probably want to update your local repositories with the changes. Use the "pull" command to download all changes to the remote repository since your initial clone, or the last time you pulled new changes:

    hg pull http://www.example.com/lolipop/

After a pull, additional revisions are stored in your local repository, but your local "working copy" has not yet been updated to reflect the change sets. In these situations, use the `hg merge`, `hg resolve`, and finally `hg commit` commands as described [above](/docs/development/version-control/manage-distributed-version-control-with-mercurial#inserting-modifications-into-the-history) to resolve any conflicts and commit all changes to the local repository.

If you work on one project and collaborate with two or more people who publish public Mercurial repositories, you can pull from multiple upstream repositories. Consider the following command:

    hg pull http://www.example.org/lolipop/

Following every pull operation, remember to repeat the `merge`, `resolve` if necessary, and `commit` operations to update your repository with the retrieved changes. When collaborating, `pull` often to ensure that you are working with the latest possible versions of the versioned content.

### Publish Content for Collaboration

When you're ready to share the changes to your repository, you can use the `hg push` command to send local changes to remote repositories assuming the administrators of the repository in question have granted you access to it. This command takes the following form:

    hg push http://www.example.com/lolipop/

In this configuration, Mercurial and its workflows strongly resemble the centralized workflows that users of systems like CVS and Subversion may find familiar. For small scale applications, Mercurial includes a built in web server that binds to port `8000` and makes it possible for your collaborators to pull your changes into their instances of your repository. Change directories to your Mercurial repository and issue the following command:

    hg serve

Now navigate to `http://localhost:8000` in your web browser. Replace `localhost` with the resolvable hostname or domain name for your machine or simply the IP address. You will be presented with a web based interface to your repository. Additionally, users will be able to `pull` content from your repository using the URL you provide. When you're done running the server, send `Control+c` to kill the server.

Additionally, you can specify remote Mercurial repositories using SSH paths as in the following example:

    hg clone ssh://username@example.com//srv/hg/lolipop

In this example, the user `username` logs into the server located at `example.com` and clones the Mercurial repository located at the path `/srv/hg/lolipop`. By default, `ssh` presumes that the specified path is in the users home directory. Use the double slash (e.g. `//`) to specify absolute paths when the Mercurial repository is located outside of the users home directory. You may use the SSH protocol to push and pull content. To create a Mercurial repository that you can use to push changes to, issue the following commands:

    mkdir -p /srv/hg/
    hg init lolipop
    cd /srv/hg/lolipop
    hg update null

The `hg update null` command removes all files from the "working copy" of your Mercurial repository, and can be used on any Mercurial repository. This prevents user confusion between the files in the working copy and the state of the repository's database, which is located in the `.hg/` directory.

### Create Patches with Mercurial

If you do not want to host your own repository or your collaboration workflow does not support pushing content to remote repositories, you can also use Mercurial to create "patch files" that you can send to your collaborators for them to apply to *their* repositories. Issue the following command to create a patch of the contents of *your* repository's commit number `7`:

    hg export 7 > patch7.diff

Email the `ducklignton-patch7.diff` file to your collaborators who will, in turn, issue the following command within their repositories:

    hg import patch7.diff

Email-based collaboration reduces some of the architectural complexity of maintaining shared infrastructure, or running *ad hoc* http servers, and allows individuals to collaborate in an easy and asynchronous way.
