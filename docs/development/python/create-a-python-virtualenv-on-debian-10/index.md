---
author:
  name: Linode
  email: docs@linode.com
description: 'This guide shows how to create a Python virtual environment on Debian 10 Linode.'
og_description: 'This guide shows how to create a Python virtual environment on Debian 10 Linode.'
keywords: ["python", "python virtual environment", "virtualenv", "debian"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-04-07
modified_by:
  name: Linode
published: 2017-08-13
title: 'How to create a Python Virtual Environment on Debian 10'
h1_title: 'Creating a Python Virtual Environment on Debian 10'
external_resources:
- '[virtualenv Documentation](http://virtualenv.pypa.io/)'
audiences: ["beginner"]
languages: ["python"]
---

## What is a Python Virtual Environment?

A Python Virtual Environment - or `virtualenv` - is a tool to create an isolated Python environment on your Linode. This can be extremely powerful as you can create a virtual environment and install all Python executables/packages to it, leaving no dependencies outside of your created virtual environment.

This guide shows how to create and run Python virtual environments in debian 10 Linode.

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides.

1.  Update your system:

        sudo apt update

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Install Python Virtualenv

1.  To install Python's virtual environment:

        sudo apt install virtualenv

## Create New Directory in Home

1.  Navigate to your users home directory:

        cd ~

2.  Create a directory named *python-environments*:

        mkdir python-environments

3.  Navigate in the newly created directory:

        cd python-environments

## Create a Virtual Environment in Python 3

1.  Create a virtual environment in Python 3 with the environment name of *env*:

        virtualenv -p python3 env

2.  Validate that environment is installed with python3:

        ls env/lib

## Activate Environment

Activate the newly created virtual environment (the name of the working environment will appear in parentheses):

    source env/bin/activate
    (env) example_user@hostname:~/python-environments$

Now that the environment is active, you can install executables and packages only to this virtual environment.

## Deactivate Environment

To deactivate an active virtual environment:

    deactivate

Congratulations! You have created an isolated, Python Virtualenv on your Linode.
