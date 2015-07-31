---
deprecated: false
author:
  name: Linode
  email: docs@linode.com
description: 'The Linode Library GitHub guide.'
keywords: 'GitHub guide, write for us, linode library, article submissions'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Tuesday, July 28th, 2015
modified_by:
  name: James Stewart
published: 'Tuesday, July 28th, 2015'
title: GitHub Beginners Guide
---

As part of our open-sourcing of our documentation library, we've moved to Github for management of our guides.  This tutorial will walk you through submitting a new guide on our public GitHub

#Before You Begin

This guide assumes that you've signed up for a [Github Account](https://www.github.com), and that you've followed the sections for installing and configuring Git on your local machine contained within our [Git Source Control Management](https://www.linode.com/docs/applications/development/git-source-control-management) guide.

{: .note}
>
> If you are following these instructions on a Windows system, all commands will need to be run via the Git Bash console.

#Submitting new guides or changes with Git

##Placing your SSH key on Github

1.  If you have not done so already, generate an SSH key on your local system.

		ssh-keygen

2.  View the contents of the newly created public key file.

		cat ~/.ssh/id_rsa.pub

3.  In a browser window, select your user account icon in the upper right hand corner of the screen, then click Settings.

	[![Github Settings](/docs/assets/github-settings.png)](/docs/assets/github-settings.png)

4.  Select the 'SSH keys' option from the Personal Settings menu, and then click the 'Add SSH key' button.

	[![SSH key settings](/docs/assets/github-ssh-key.png)](/docs/assets/github-ssh-key.png)

5.  Copy the contents of your public key file from your terminal window, and paste them into the 'Key' text box.  Add a descriptive title for your key in the 'Title' text box.

	[![Add Key](/docs/assets/github-load-key.png)](/docs/assets/github-load-key.png)


##Setting up your repository

In order to edit or create documents for the Linode library, you will need to fork your own version of the Linode Docs repository on Github

1.  Navigate to the [Linode Docs](www.github.com/linode/docs) GitHub repository.

	[![Linode Docs Github Repo](/docs/assets/github-your-repository.png)](/docs/assets/github-your-repository.png)

2.  Click 'Fork' in the uppper right hand corner of your screen to create your own version of the repository

3.  Once the fork process has completed, visit the 'docs' repository under your repository list on the Github homepage.

	[![Your repository on Github](/docs/assets/github-your-repository.png)](/docs/assets/github-your-repository.png)

4.  Clone your forked branch to your local machine by copying the clone URL, and appending it to the following command.  We recommend cloning via SSH for this particular step.  This command will create a local copy of your cloned repository that you can work with directly, in the directory where the command is being run.

	[![Github Clone URL](/docs/assets/github-clone-url.png)](/docs/assets/github-clone-url.png)

		git clone <insert clone URL>

5.  Configure the Linode Docs repository as your upstream repository.

		git remote add upstream https://github.com/linode/docs

##Creating your branch

Once you've cloned a local copy of your repository, you will need to make a branch to store your new guide in.  Branches allow you to work on multiple guide changes without creating a mess within your pull requests.

1.  Move to the cloned directory that was created in the previous step.

		cd docs

2.  Verify that you are in the master branch by running the following command.

		git status

	You should receive output similar to that show below

		On branch master
		Your branch is up-to-date with 'origin/master'.

		nothing to commit, working directory clean

3.  Check out a new branch with a descriptive title matching the guide that you are editing or creating.

		git checkout -b guide-title

4.  Rerun the 'git status' command to confirm that you have been moved to the new branch.  You should receive output maching the following.

		On branch guide-title
		nothing to commit, working directory clean

5.  Using your preferred text editor, you should now be able to edit existing documents and create new documents within the branch you have created.

{: .note}
>
> The folder structure within the repository's 'docs' folder matches the structure used by the Linode Guides and Tutorials site.  Please ensure that your guides are located in the appropriate locate within that file structure.  If you have any questions regarding the folder structure or where your new guide should be located, please email contribute@linode.com for more information.

6.  Once you have completed composing your new guide or making edits, you can utilize the 'git status' command to view the status of your changes.  You should receive output resembling the following.

		Untracked files:
		  (use "git add <file>..." to include in what will be committed)

		  		guide-title.md

		nothing added to commit but untracked files present (use "git add" to track)

7.  Add your guide to your list of files to be committed with the 'git add' command.

		git add guide-title.md

8.  Commit your file to officially make it part of your git repository changes.  Utilize the -m flag with the 'git commit' command to add a commit message.  Commit messages will need to be encased in quotation marks as shown below.

		git commit -m "First draft of guide"

	You should receive output resembling the following.

		[guide-title 40b1932] First draft of guide
		  1 file changed, 1 insertion(+)
		  Create mode 100644 docs/guide-title.md

9.  Push your guide to Github.  You'll need to replace 'guide-title' below with the name of your branch.

		git push origin guide-title

##Submitting your first pull request (PR)

Now that you've completed the composition of your first guide, it's time to make your first pull request on Github.

1.  Within the GitHub web interface, navigate to your fork of the 'linode/docs' repository.

	[![Github - Your Repository](/docs/assets/github-your-repository.png)](/docs/assets/github-your-repository.png)

2.  Select the branch containing your changes.

	[![Github - Switch Branches](/docs/assets/github-switch-branches.png)](/docs/assets/github-switch-branches.png)

3.  Select the 'Pull Request' option to generate your first PR.

	[![Github - Pull Request](/docs/assets/github-pull-request.png)](/docs/assets/github-pull-request.png)

4.  Ensure that your pull request is being submitted against the Base fork: linode/docs, and Base: master.  Enter the title of your guide, along with a brief description, and then click the 'Create Pull Request' button.

	[![Github - Pull Request Submission](/docs/assets/github-pull-request2.png)](/docs/assets/github-pull-request2.png)

Your guide has been submitted as a pull request aginst the Linode Docs repository!

##Commenting and editing your PR

Once you have submitted your first pull request, you will likely receive communication from the Linode Training and Education team as your PR is run through our tech and copy editing process.  You can respond to this feedback directly from your PR page.

[![Github - Pull Request Comment](/docs/assets/github-pr-comments.png)](/docs/assets/github-pr-comments.png)

If you need to edit your PR, you can make changes to your locally saved branch, and then upload the changes by following steps 5-9 of the [Creating Your Branch](/docs/github-guide#creating-your-branch) section of this guide


##Managing multiple branches

If you are working on multiple guide submissions or changes, you will need to utilize multiple branches to keep your changes separate from each other.

1.  To avoid merge conflicts, switch to your master branch and pull in the latest changes from the Linode Docs master branch.

		git checkout master
		git fetch upstream

2.  Create and switch to a new branch to store your new changes.

		git checkout -b guide-title-2

	You should receive output resembling the following.

		Switched to a new branch 'guide-title-2'

3.  To confirm what branch you are currently using, run 'git status'.

		git status

	The output should resemble the following.

		On branch guide-title-2
		nothing to commit, working directory clean

4.  To list all of your available branches, utilize the 'git branch' command.  This will list all of your branches, and highlight your active branch.

		git branch

#Reporting issues with existing guides

If you wish to report an issue with an existing guide, you can do so by navigating to the Linode Docs repository, and clicking on the 'Issues' link.  You can then open a new issue and provide descriptions of the problems you are encountering so that our team can address it.  However, if you've already found a fix we encourage you to submit a fix yourself!