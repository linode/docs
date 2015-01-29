---
author:
  name: Joseph Dooley
  email: jdooley@linode.com
description: 'Using Git and Github start to finish.'
keywords: 'git,dvcs,vcs,scm,gitweb,debian'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Wednesday, February 4th, 2015
modified_by:
  name: Joseph Dooley
published: 'Wednesday, February 4th, 2015'
title: Developing with Git and Github
---

Git is a version control system,or VCS, a VCS tracks file revisions. Github is a website that allows collaboration between developers who use Git. With Git and Github, programmers from across the world can share ideas and code in an organized and up-to-date process.

##Install and Configure Git
The directions below are for a Debian or Ubuntu Linode. For installation on Mac, Windows, or other Linux distributions, find instructions in the [Git Source Control Management](/docs/applications/development/git-source-control-management#installing-git) guide. While that guide focuses on Git, this guide focuses more on Github.

1.  Install:

        apt-get install git -y

2.  Configure the username:

        git config --global user.name "First Last" 
        
3.  Configure the email:
        
        git config --global user.email "example@example.com"

##Clone a Test Repository
A repository, or repo, is a Git project. For tutorial purposes, there is a test repository setup on Github, which is listed below. Also, feel free to search "linode docs", clone that repository, and contribute a new guide!

1.  Go to the [Github homepage](https://www.github.com) at the top, search for `test-repo-789` or if you would like to contribute a guide `linode docs`.

    [![Github homepage search.](/docs/assets/github-search.png)](/docs/assets/github-search.png)

2.  The `test-repo-789` should be the top hit, listed as `AccForTesting1/test-repo-789`. Select.

3.  Copy the "HTTPS clone URL" link using the clipboard icon at the bottom right of the page's side-bar, pictured below. 

    [![Github clone clipboard.](/docs/assets/github-clone-arrow.png)](/docs/assets/github-clone-arrow.png)

4.  In the Linode terminal from the home directory, use the command `git clone`, then paste the link from your clipboard:

        git clone https://github.com/AccForTesting1/test-repo-789.git

5.  To ensure that your master branch is up-to-date, use the pull command:

        git pull https://github.com/AccForTesting1/test-repo-789.git master

##Create a Github Account and Fork the Test Repo
To share new files or file revisions, you'll need a Github account and a project fork. A fork is a copy of a repo on your Github account. 

1.  Create a username on [Github](https://www.github.com). At the "Welcome to Github" page, select the green, "Finish sign up" button at the bottom of the page. 

2.  Select your username at the top right of the page, pictured below, to bring you to the dashboard.

    [![Github username icon.](/docs/assets/github-sampleuser.png)](/docs/assets/github-sampleuser.png)

3.  To fork `test-repo-789`, search at the top of the page like in steps 1 and 2 in the previous section. 

4. After you select `AccForTesting1/test-repo-789`, fork the repo using the fork button on the top right of the page under the username icon pictured in step 2 above.

##Push to the Forked Repo
Create files on your the development machine and push them to the forked repository on Github.

1.  From the terminal, change to the repo directory: 

        cd ~/test-repo-789 

2.  Create a new branch:

        git checkout -b newbranch 

2.  Create a project directory:
        
        mkdir project

3.  Create sample files:

        touch repoTest1.js repoTest2.htm project/prjtTest1.js project/prjtTest1.htm

4.  Check the status of the Git project:

        git status

5.  Add all the files in `AccForTesting1/test-repo-789` to Git tracking, or staging:

        git add . 

6. Check the status again with `git status`, then commit the files to the Git project:

        git commit -m"Test files for test-repo-789 fork"

7.  Push the new files to the forked repo on your new Github account. Replace `SampleUser1234` below with your own Github username, and replace the repo name with the appropriate repo name if different:

        git push https://github.com/SampleUser1234/test-repo-789.git newbranch 

##Create a Pull Request Against the Original Repo







