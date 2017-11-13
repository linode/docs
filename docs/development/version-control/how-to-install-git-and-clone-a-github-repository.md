---
author:
  name: Joe D.
  email: docs@linode.com
description: 'This tutorial is an introduction to developing with Git and GitHub with instructions on installing Git and creating your first GitHub test repository.'
keywords: ["git", "dvcs", "vcs", "scm", "gitweb", "github"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['applications/development/developing-git-github/','development/version-control/developing-git-github/']
modified: 2015-02-06
external_resources:
 - '[Working with the Git Repository](/docs/development/version-control/how-to-configure-git/)'
 - '[GitHub Help Pages](https://help.github.com/)'
modified_by:
  name: Linode
published: 2015-02-06
title: How to Install Git and Clone a GitHub Repository
---

GitHub is a website that allows collaboration between developers using the Git version control system. With Git and GitHub, programmers from across the world can share ideas and code in an organized and up-to-date process.

## Install and Configure Git
The directions below are for Debian or Ubuntu. For installation on Mac, Windows, or other Linux distributions, find instructions in the  [Git Source Control Management](/docs/applications/development/git-source-control-management) guide. While that guide focuses on Git, this guide focuses more on Git with GitHub.

1.  Install:

        sudo apt-get update
        sudo apt-get install git -y

2.  Configure the username, replace `First Last`:

        git config --global user.name "First Last"

3.  Configure the email, replace `example@example.com`:

        git config --global user.email "example@example.com"

    Now that Git has been installed, refer to the image below for help with using Git and GitHub together.

    [![Workflow for using Git with GitHub.](/docs/assets/git-github-workflow-650w.png)](/docs/assets/git-github-workflow-1000w.png)

## Clone a GitHub Test Repository
A repository, or repo, is a Git project. For tutorial purposes, there is a test repository setup on GitHub, which is listed below.

1.  Go to the [GitHub homepage](https://www.github.com). At the top, search for `test-repo-789`. If you would like to contribute to Linode's guides, search for `linode docs`.

    [![GitHub homepage search.](/docs/assets/github-search.png)](/docs/assets/github-search.png)

2.  Select `test-repo-789`, it should be the first result, listed as `NwayNway/test-repo-789`.

3.  Copy the "HTTPS clone URL" link using the clipboard icon at the bottom right of the page's side-bar, pictured below.

    [![GitHub clone clipboard.](/docs/assets/github-clone-arrow.png)](/docs/assets/github-clone-arrow.png)

4.  In the Linode terminal **from the home directory**, use the command `git clone`, then paste the link from your clipboard, or copy the command and link from below:

        git clone https://github.com/NwayNway/test-repo-789.git

5.  Change directories to the new `~/test-repo-789` directory:

        cd ~/test-repo-789/

5.  To ensure that your master branch is up-to-date, use the pull command:

        git pull https://github.com/NwayNway/test-repo-789.git master

## Create a GitHub Account and Fork the Test Repo
To share new files or file revisions, you'll need a GitHub account and a project fork. A fork is a copy of a repo held on your GitHub account.

1.  Create a username on [GitHub](https://www.github.com). At the "Welcome to GitHub" page, select the green, "Finish sign up" button at the bottom.

2.  Select your username at the top right of the page, pictured below, which links to your profile.

    [![GitHub username icon.](/docs/assets/github-sampleuser.png)](/docs/assets/github-sampleuser.png)

3.  To fork `test-repo-789`, use the search bar at the top left of the page. Search for `test-repo-789`.

4. After you select `NwayNway/test-repo-789`, fork the repo using the **"Fork"** button on the top right of the page. The **"Fork"** button is under the username icon pictured in step 2 above.

    [![GitHub Fork Button.](/docs/assets/github-fork.png)](/docs/assets/github-fork.png)

You now have a copy of the repo on your GitHub account. Next, return to the terminal of the development Linode.

## Push to the Forked Repo
Create files on the development Linode and push them to the forked repository on GitHub.

1.  From the `~/test-repo-789` directory, create and checkout a new branch:

        git checkout -b newbranch

2.  Create a project directory:

        mkdir project

3.  Create sample files:

        touch repoTest1.js repoTest2.htm project/prjtTest1.js project/prjtTest1.htm

4.  Check the status of the Git project, with the `git status` command:

        git status

        # On branch newbranch
        # Untracked files:
        #   (use "git add <file>..." to include in what will be committed)
        #
        #       project/
        #       repoTest1.js
        #       repoTest2.htm
        nothing added to commit but untracked files present (use "git add" to track)

5.  Add all the files in `~/test-repo-789` to the Git staging area:

        git add .

     {{< note >}}
To add only one file, replace the period above with the full directory path and filename.
{{< /note >}}

6. Check the status again with `git status`, then commit the files to the Git project:

        git commit -m "Test files for test-repo-789 fork"

7.  Push the new files to the forked repo on your new GitHub account. Replace `SampleUser1234` below with your own GitHub username, and replace the repo name with the appropriate repo name if different:

        git push https://github.com/SampleUser1234/test-repo-789.git newbranch

    {{< note >}}
If you've configure two-factor authorization (2FA) on this account, you will need to push over SSH. See GitHub's guide on [Generating SSH Keys](https://help.github.com/articles/generating-ssh-keys/).
{{< /note >}}

## Create a Pull Request Against the Original, Previously Cloned Repo
So far, Git was installed on a development Linode, a repo project was cloned to that Linode, a GitHub username was created, and a repo fork was copied to the GitHub user account. The final step is to ask the original repo project to accept the new revisions or sample files. This final process is called a pull request.

1.  From the GitHub browser window, select your username from the top right of the page, pictured below.

    [![GitHub username icon.](/docs/assets/github-sampleuser.png)](/docs/assets/github-sampleuser.png)

2.  At your GitHub profile, select the `test-repo-789` in the center of the page, pictured below.

    [![GitHub popular repositories.](/docs/assets/github-popular-repositories.png)](/docs/assets/github-popular-repositories.png)

3.  At the `test-repo-789` page, select **"branches"**.

    [![GitHub branches.](/docs/assets/github-branches.png)](/docs/assets/github-branches.png)

4.  Under **"Your branches"**, select **"New pull request"**.

    [![GitHub branches.](/docs/assets/github-new-pull-request.png)](/docs/assets/github-new-pull-request.png)

5.  Check that the branch filters are set correctly.

    [![GitHub branch filters.](/docs/assets/github-branch-filters.png)](/docs/assets/github-branch-filters.png)

6.  Select the **"Create pull request"** button.

    [![GitHub branch filters.](/docs/assets/github-create-pull-request.png)](/docs/assets/github-create-pull-request.png)


Congratulations, you have used Git and GitHub for file sharing and version control. There are still many Git commands to learn, but you are off to a great start.
