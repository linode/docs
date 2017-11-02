---
author:
    name: Linode
    email: docs@linode.com
description: 'The Linode Guides & Tutorials GitHub guide.'
keywords: ["GitHub guide", " write for us", " article submissions", "linode guides and tutorials"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2015-12-02
modified_by:
    name: Linode
published: 2015-12-02
title: GitHub Beginner's Guide
---

Linode Guides and Tutorials manages bounty guides through the use of GitHub. In the interest of making submissions as easy as possible, this tutorial will walk you through submitting a new guide on our [public GitHub](https://github.com/linode/docs).

![GitHub Beginner's Guide](/docs/assets/github-beginners-guide.png "GitHub Beginner's Guide")

## Before You Begin

This guide assumes that you've signed up for a [GitHub Account](https://www.github.com), and that you've followed the sections for installing and configuring Git on your local machine contained within our [Git Source Control Management](/docs/development/version-control/how-to-install-git-on-mac-and-windows/) guide.

{{< note >}}
If you are following these instructions on a Windows system, all commands will need to be run via the [Git Bash console](http://git-scm.com/downloads).
{{< /note >}}

## Submitting New Guides or Changes with Git

### Placing Your SSH Key on GitHub

1.  If you have not done so already, generate an SSH key on your local system:

		ssh-keygen

2.  View the contents of the newly-created public key file:

		cat ~/.ssh/id_rsa.pub

3.  In a browser window, select your user account icon in the upper right-hand corner of the screen, then click **Settings**. Your user account icon may look different than the one below:

	[![GitHub Settings](/docs/assets/github-settings.png)](/docs/assets/github-settings.png)

4.  Select the **SSH keys** option from the **Personal settings** menu, then click the **Add SSH key** button:

	[![SSH key settings](/docs/assets/github-ssh-key.png)](/docs/assets/github-ssh-key.png)

5.  Copy the contents of your public key file from your terminal window, and paste them into the **Key** text box.  Add a descriptive title for your key in the **Title** text box:

	[![Add Key](/docs/assets/github-load-key.png)](/docs/assets/github-load-key.png)


### Setting Up Your Repository

In order to edit or create documents for Linode Guides and Tutorials, you will need to fork your own version of the Linode Docs repository on GitHub.

1.  Navigate to the [Linode Docs](http://www.github.com/linode/docs) GitHub repository.

2.  Click **Fork** in the upper right-hand corner of your screen to create your own version of the repository.

3.  Once the fork process has completed, visit the **docs** repository under your repository list on the GitHub homepage:

	[![Your repository on GitHub](/docs/assets/github-your-repository.png)](/docs/assets/github-your-repository.png)

4.  Clone your forked branch to your local machine by copying the clone URL, and appending it to the following command.  We recommend cloning via SSH for this particular step.  This command will create a local copy of your cloned repository that you can work with directly in the directory where the command is run:

	[![GitHub Clone URL](/docs/assets/github-clone-url.png)](/docs/assets/github-clone-url.png)

		git clone <insert clone URL>

	You will need to accept the host identification key on your first connection.

5.  Move to the cloned directory and configure the Linode Docs repository as your upstream repository:

		cd docs
		git remote add upstream https://github.com/linode/docs

### Creating Your Branch

Once you've cloned a local copy of your repository, you will need to make a branch to store your new guide.  Branches allow you to work on multiple guide changes without creating issues within your pull requests.

1.  Verify that you are in the master branch:

		git status

	You should receive output similar to that show below:

		On branch master
		Your branch is up-to-date with 'origin/master'.

		nothing to commit, working directory clean

2.  Check out a new branch with a descriptive title matching the guide that you are editing or creating:

		git checkout -b guide-title

3.  Rerun the `git status` command to confirm that you have been moved to the new branch.  You should receive output maching the following:

		On branch guide-title
		nothing to commit, working directory clean

4.  Using your preferred text editor, you should now be able to edit and create documents within your new branch:

    {{< note >}}
The folder structure within the repository's `docs` folder matches the structure used by the Linode Guides and Tutorials website.  Please ensure that your guides are located in the appropriate directory within that file structure.  If you have any questions regarding the folder structure or where your new guide should be located, please email [contribute@linode.com](mailto:contribute@linode.com) for more information.
{{< /note >}}

5.  Once you have completed composing or making edits to a guide, you can use the `git status` command to view the status of your changes.  You should receive output resembling the following:

        Untracked files:
		  (use "git add <file>..." to include in what will be committed)

		  		guide-title.md

		nothing added to commit but untracked files present (use "git add" to track)

6.  Add your guide to the list of files to be committed with the 'git add' command:

		git add guide-title.md

7.  Commit your file to officially make it part of your changes.  Utilize the `-m` flag with the `git commit` command to add a commit message.  Commit messages will need to be encased in quotation marks, as shown below:

		git commit -m "First draft of guide"

	You should receive output resembling the following:

		[guide-title 40b1932] First draft of guide
		  1 file changed, 1 insertion(+)
		  Create mode 100644 docs/guide-title.md

8.  Push your guide to GitHub.  You will need to replace `guide-title` below with the name of your branch:

		git push origin guide-title

### Submitting Your First Pull Request

Now that you've completed the composition of your guide, it's time to make your first *pull request* (PR) on GitHub.

1.  Within the GitHub web interface, navigate to your fork of the **linode/docs** repository:

	[![GitHub - Your Repository](/docs/assets/github-your-repository.png)](/docs/assets/github-your-repository.png)

2.  Select the branch containing your changes:

	[![GitHub - Switch Branches](/docs/assets/github-switch-branches.png)](/docs/assets/github-switch-branches.png)

3.  Select the **Pull Request** option to generate your first PR:

	[![GitHub - Pull Request](/docs/assets/github-pull-request.png)](/docs/assets/github-pull-request.png)

4.  Ensure that your pull request is being submitted against the **Base fork: linode/docs**, and the **Base: master**.  Enter the title of your guide, along with a brief description, and click the **Create Pull Request** button:

	[![GitHub - Pull Request Submission](/docs/assets/github-pull-request2.png)](/docs/assets/github-pull-request2.png)

Congratulations! Your guide has been submitted as a pull request against the Linode Docs repository!


### Commenting and Editing Your PR

Once you have submitted your first pull request, you will likely receive communication from the Linode Guides and Tutorials team as your PR is run through our tech and copy editing processes.  You can respond to this feedback directly from your PR page:

[![GitHub - Pull Request Comment](/docs/assets/github-pr-comments.png)](/docs/assets/github-pr-comments.png)

If you need to edit your PR, you can make changes to your locally saved branch, then upload the changes by following steps 5-8 of the [Creating Your Branch](/docs/github-guide#creating-your-branch) section of this guide.


### Managing Multiple Branches

If you are working on multiple guide submissions or changes, you will need to utilize multiple branches to keep your changes separate from each other.

1.  To avoid merge conflicts, switch to your master branch and pull in the latest changes from the Linode Docs master branch:

		git checkout master
		git fetch upstream

2.  Create and switch to a new branch to store your new changes:

		git checkout -b guide-title-2

	You should receive output resembling the following:

		Switched to a new branch 'guide-title-2'

3.  To confirm what branch you are currently using, run `git status`. The output should resemble the following:

		On branch guide-title-2
		nothing to commit, working directory clean

4.  To list all of your available branches, utilize the `git branch` command.  This will list all of your branches, and highlight your active branch:

		git branch

5.  Once you have completed working with a branch, you can remove your local copy of that branch by switching to a different branch, such as master, and using the `-d` flag to remove the unused branch:

		git checkout master
		git branch -d guide-title-2

    {{< note >}}
Git will warn you if you attempt to delete a branch with unmerged changes.  If you wish to remove a branch with unmerged changes, you can force removal by substituting the `-D` flag.
{{< /note >}}

## Reporting Issues with Existing Guides

If you wish to report an issue with an existing guide, you can do so by navigating to the Linode Docs repository, and clicking on the **Issues** link.  You can then open a new issue and provide descriptions of the problems you are encountering so that our team can address it. When opening a new issue, be sure to include a link to the guide where the problem is located. However, if you've already found a fix we encourage you to submit the fix to [our GitHub repository](https://github.com/linode/docs).
