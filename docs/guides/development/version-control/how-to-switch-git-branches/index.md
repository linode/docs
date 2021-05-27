---
slug: how-to-switch-git-branches
author:
  name: Linode Community
  email: docs@linode.com
description: 'A very basic guide on how to switch a branch in Git using Ubuntu 20.10, but for any operating system with the command line git tools installed.'
keywords: ['git','branch','branches','switch branch','switch branches','switch git branches']
tags: ["Git", "Version Control"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-04-02
modified_by:
  name: Linode
title: "How to Switch Git Branches"
h1_title: "Switching Git Branches."
external_resources:
- '[Git](https://git-scm.com/)'
- '[Git Branching - Basic Branching and Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)'
---

Git is a distributed version control system. It supports non-linear, distributed development, allowing multiple contributors to work on a project simultaneously within what are called *branches*. This guide walks you through the basics of what a branch is and how to switch between branches.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode.

2.  This guide assumes you have Git installed, are familiar with the *command-line interface* (CLI) and Git, and have a project in Git.

2.  Update your Linode's system:

        sudo apt-get update && sudo apt-get upgrade

3.  Update your local workstation's system using the tools and package managers for your operating system.

## What is a Branch in Git?

If you're doing work on a website, application, or other Git project, you aren't necessarily going to want to push the code to production immediately. That is where creating a branch is necessary, as it marks what version of the code you branched from and allows you to work without breaking anything currently in production or having you disturb other developers (or vice versa).

## Why Would I Need to Switch Branches in Git?

Different branches have different purposes, so sometimes you need to switch from one to another. For example, you may be working in two branches yourself, you may be pair programming and need to move back and forth, or some other reason. Git was designed to anticipate that need with `git checkout` (`git switch` was introduced to be more intuitive and decrease the number of functions in `git checkout`, but it is currently considered [experimental](https://git-scm.com/docs/git-switch#_description) and not covered in this article).

## Switching to an Existing Git Branch

You may have multiple tasks you're working on in separate branches, let's say one is a hotfix and one is a feature request). You realize you have something to add on the hotfix, so you need to switch to that branch in Git:

1.  Enter `git checkout quick-hotfix` at the command prompt.

2.  You should then get a response stating:
    {{< output >}}
Switched to branch 'quick-hotfix'
{{< /output >}}

At that point, you can get the hotfix done.

## Switching to a New Git Branch

Suppose you are updating your product's API and creating the branch you need to switch to. To do so:

1.  Enter `git checkout -b update-api` at the command prompt.

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

At that point, a new local branch is created, allowing you to start on that feature request and push to that branch as necessary.

## Further Reading on Git Branches

Git branching is an extensive subject. For more on branching in Git, see ["Git Branching - Branches in a Nutshell" on git-scm.com](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell).
