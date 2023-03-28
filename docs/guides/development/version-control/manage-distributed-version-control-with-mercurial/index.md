---
slug: manage-distributed-version-control-with-mercurial
description: 'Use the Mercurial version control system to manage source code in distributed environments.'
keywords: ["version control", "hg", "mercurial"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/development/version-control/manage-distributed-version-control-with-mercurial/','/linux-tools/version-control/mercurial/','/applications/development/manage-distributed-version-control-with-mercurial/']
modified: 2018-04-26
modified_by:
  name: Linode
published: 2010-04-26
title: Manage Distributed Version Control with Mercurial
external_resources:
 - '[HG Init, a Guide by Joel Spolsky](http://hginit.com/)'
audiences: ["beginner"]
tags: ["version control system"]
authors: ["Linode"]
---

[Mercurial](https://www.mercurial-scm.org/) is one of the leading distributed version control systems which allows software developers and teams of collaborators to work on a common code base without the need to rely on a centralized server or constant network connection. Mercurial runs on multiple platforms and can be used to manage code projects on many different operating systems.

## Before You Begin

- You will need root access to your Linode, or a user account with `sudo` privileges.
- Set your system's [hostname](/docs/products/compute/compute-instances/guides/set-up-and-secure/#configure-a-custom-hostname).
- Update your system.

## Installing Mercurial

**CentOS**

    yum install mercurial

**Debian / Ubuntu**

    apt install mercurial


## Local Mercurial Workflows

{{< note respectIndent=false >}}
All Mercurial commands in the shell environment begin with `hg` in reference to the abbreviation for the element Mercury.
{{< /note >}}

### Creating Repositories

Like other distributed version control systems, Mercurial allows users to maintain a history of files independent of a centralized remote server. Most operations with Mercurial can be completed and tested locally and do not require any server configuration.

Make a new directory called `myproject` and create a Mercurial repository in that directory:

    hg init myproject

### Adding Files and Creating Commits

Files must be added to a repository before Mercurial can track their versions. Create a `hello world` file and add it to the repository:

    echo "hello world" > world
    hg add

Commit the change:

    hg commit -m 'hello mercurial world'

When complete, the new file at this iteration is saved in the Mercurial repository's database. The `-m` option tells Mercurial to store a message describing the contents of the commit change. You may choose to omit the `-m` flag and the commit message, however Mercurial will open your system's default text editor so that you can edit your commit message there.

If you accidentally create a commit that you did not intend to, issue the following command to roll back the last commit without modifying the state of the files:

    hg rollback

Any changes you make to the `world` file after the first commit will be tracked by Mercurial in successive commits. When you decide to add additional files you must specify them explicitly using:

    hg add FILENAME

Once added and committed, the files will be tracked through future revisions.

Mercurial references all repository changes in terms of two variables: a local revision number that begins at 0, and incrementing full numbers. Note that Mercurial also assigns a universally unique identifier to every commit called a *changeset identifier*, for cases when local revision numbers may not correspond to the revision numbers that collaborators may have.

### Manipulating Files

When you need to rename, move, or copy files or folders that are versioned by Mercurial, use Mercurial's default commands for manipulating files rather than your operating system's move, copy, and delete commands. For example:

    hg mv world hw.txt
    hg cp hw.txt hello-world
    hg rm hw.txt

These commands, in turn, move (rename) the `world` file to `hw.txt`, copy `hw.txt` to the file `hello-world`, and remove the file `hw.txt`. When you perform the next commit, Mercurial will include these revisions in the changeset it saves, keeping track of a file's history despite any changes in name.

At any point, you can use the `status` command to retrieve the current state of the working file:

    hg status

If you accidentally move files using default filesystem tools instead of Mercurial's tools, use the following command, to clean your repository:

    hg addremove --similarity 100

### Viewing History

You can use the `diff` command at any point to view the difference between the last committed revision and the current uncommitted changes:

    hg diff

If you want to view a log of the history, issue the following command:

    hg log

For each commit stored in Mercurial, the `log` command will produce output that resembles the following:

    changeset:   0:dcf111b16118
    tag:         tip
    user:        username@example.com
    date:        Thu Apr 22 18:51:21 2010 +0000
    summary:     hello mercurial world

To generate a patch or a view of the history of your repository containing the differences (a *diff*):

    hg log -p -r 2 5

This generates a patch (`-p`) of all changes contained between revisions (`-r`) 2 and 5.

### Inserting Modifications into the History

If you need to modify a revision after a changeset is already committed, you can revert the current working copy to a previous version:

    hg update 4

This reverts the working copy to the 4th revision. Make the required modification and then commit the change as normal. Then merge the new changes into the latest version of your repository:

    hg merge

Depending on the nature of the change, `merge` may resolve all changes without any errors. However, in some cases where a change is non-trivial, this will create merge conflicts. In these cases, issue the following command:

    hg resolve --list

This generates a list of the changes that need to be resolved before the merge will succeed. Each file will need to be resolved in sequence. When finished, issue the following command to mark each file as resolved:

    hg resolve --mark FILENAME

When all changes have been resolved, commit them with `hg commit` and continue developing from the most recent version of your repository.

If at any point you find yourself working in a revision and you would like to revert to the most recent commit:

    hg update tip

## Distributed Mercurial Workflows

Most of the Mercurial workflow is completed in isolation from other developers and contributors. The above outline of how to manage version control will allow you to complete work on your projects even in the context of larger Mercurial-supported collaborations. The distributed workflows outlined below provide an overview of common procedures for using Mercurial in distributed environments.

### Retrieve Content from Remote Repositories

In many cases when you begin working on a project with Mercurial, you will be downloading a repository, or *cloning* the project. This creates a complete and independent copy of the repository on your local system:

    hg clone http://www.example.com/lollipop/

In this instance, the URL `http://www.example.com/lollipop/` refers to the server hosting the repository in question. Once downloaded, you'll be able to manipulate files, create content, or remove content, and commit those changes incrementally to create a work history.

As time passes you will probably want to update your local repositories with the changes. Use the `pull` command to download all changes to the remote repository since your initial clone, or the last time you ran a pull:

    hg pull http://www.example.com/lollipop/

Additional revisions are stored in your local repository after a pull, but your local copy has not yet been updated to reflect the change sets. In these situations, use the `hg merge`, `hg resolve`, and `hg commit` as described [above](#inserting-modifications-into-the-history) to resolve any conflicts and commit all changes to the local repository.

If you work on one project and collaborate with two or more people on public Mercurial repositories, you can pull from multiple upstream repositories. Consider the following command:

    hg pull http://www.example.org/lollipop/

Following every pull operation, remember to repeat the `merge`, `resolve` (if necessary), and `commit` operations to update your repository with the retrieved changes. When collaborating, pull often to ensure that you are working with the latest possible content versions.

### Publish Content for Collaboration

When you're ready to share the changes to your repository, you can use the `hg push` command to send local changes to remote repositories, assuming the administrators of the repository in question have granted you access to it. This command takes the following form:

    hg push http://www.example.com/lollipop/

In this configuration, Mercurial and its workflow strongly resembles the centralized workflow of systems like CVS and Subversion. For small scale applications, Mercurial includes a built in web server that binds to port `8000` and makes it possible for your collaborators to pull your changes into their instances of your repository.

To start the web server, change directories to your Mercurial repository and issue the following command:

    hg serve

Navigate to `http://localhost:8000` in your web browser. Replace `localhost` with your Linode's domain or IP address. You will be presented with a web-based interface to your repository. Users will also be able to pull content from your repository using the URL you provide. When you're done running the server, stop it with `Control+C`.

Additionally, you can specify remote Mercurial repositories using SSH paths as in the following example:

    hg clone ssh://username@example.com//srv/hg/lollipop

The user `username` logs into the server located at `example.com` and clones the Mercurial repository located at the path `/srv/hg/lollipop`. By default, `ssh` presumes that the specified path is in the user's home directory. Use the double slash (e.g. `//`) to specify absolute paths when the Mercurial repository is located outside of the users home directory. You may use the SSH protocol to push and pull content. To create a Mercurial repository that you can use to push changes to:

    mkdir -p /srv/hg/
    hg init lollipop
    cd /srv/hg/lollipop
    hg update null

The `hg update null` command removes all files from the working copy of your Mercurial repository, and can be used on any Mercurial repository. This prevents user confusion between the files in the working copy and the state of the repository's database, which is located in the `.hg/` directory.

### Create Patches with Mercurial

If you do not want to host your own repository or your workflow does not support pushing content to remote repositories, you can also use Mercurial to create *patch files* that you can send to your collaborators for them to apply to their versions of your repository.

Issue the following command to create a patch of the contents of your repository's commit number `7`:

    hg export 7 > patch7.diff

Send the `patch7.diff` file to your collaborators, who then will issue the following command within their repositories:

    hg import patch7.diff
