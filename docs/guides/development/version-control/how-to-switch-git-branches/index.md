---
slug: how-to-switch-git-branches
description: 'A very basic guide on how to switch a branch in Git using Ubuntu 20.10, but for any operating system with the command line git tools installed.'
keywords: ['git','branch','branches','switch branch','switch branches','switch git branches']
tags: ["git", "version control"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-05-28
image: Git.jpg
modified_by:
  name: Linode
title: "Switching Git Branches"
title_meta: "How to Switch Git Branches"
external_resources:
- '[Git](https://git-scm.com/)'
- '[Git Branching - Basic Branching and Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)'
authors: ["Linode"]
---

Git is a distributed version control system. It supports non-linear, distributed development, allowing multiple contributors to work on a project simultaneously within what are called *branches*. This guide walks you through the basics of what a branch is and how to switch between branches.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  This guide assumes you have Git installed, are familiar with the *command-line interface* (CLI) and Git, and have a project in Git.

1.  Update your local workstation's system using the tools and package managers for your operating system.

## What is a Branch in Git?

If you're doing work on a website, application, or other Git project, you probably don't want to push the code to production immediately. This is where creating a branch is necessary, as it marks what version of the code you branched from and allows you to work without breaking anything currently in production, or having you disturb other developers (or vice versa).

## Why Would I Need to Switch Branches in Git?

Different branches have different purposes, so sometimes you need to switch from one to another. For example, you may be working in two branches yourself, or you may be pair programming. Git was designed to anticipate the need to switch  between branches with `git checkout` (`git switch` was introduced to be more intuitive and decrease the number of functions in `git checkout`, but it is currently considered [experimental](https://git-scm.com/docs/git-switch#_description) and not covered in this article).

## Switching to an Existing Git Branch

You may have multiple tasks you're working on in separate branches. Let's say one is a hotfix and one is a feature request. You realize you have something to add on the hotfix, so you need to switch to that branch in Git:

1.  Enter `git checkout quick-hotfix` at the command prompt.

2.  You should then get a response stating:
    {{< output >}}
Switched to branch 'quick-hotfix'
{{< /output >}}

At that point, you can complete the hotfix.

## Switching to a New Git Branch

Suppose you are updating your product's API and creating the branch you need to switch to. To do so:

1.  Enter a command similar to the following at the command prompt. The `-b` flag is followed by the name of the new branch.

     `git checkout -b update-api`

2.  You should then get a response stating:
    {{< output >}}
Switched to a new branch 'update-api'
{{< /output >}}

You can then commit work to that branch.

## Switching to a Remote Git Branch

Using remote branches is one of the best ways to work with your colleagues. Let's say you're pair programming for the day and your coworker has a branch called "edit-button-feature-request" ready for the two of you. To switch to a remote branch in Git:

1.  Enter `git checkout --track origin/edit-button-feature-request` at the command prompt.

2.  You should then get a response stating:
    {{< output >}}
Branch edit-button-feature-request set up to track remote branch newsletter from origin.
Switched to a new branch 'edit-button-feature-request'
{{< /output >}}

At that point, a new local branch is created, allowing you to start on that feature request, and push to that branch as necessary.

## Further Reading on Git Branches

Git branching is an extensive subject. For more on branching in Git, see ["Git Branching - Branches in a Nutshell" on git-scm.com](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell).
