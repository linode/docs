---
author:
  name: Jared Kobos
  email: docs@linode.com
keywords: ["getting started", "intro", "basics", "first steps"]
description: 'This guide will help you set up your first Linode.'
og_description: "Learn how to create an account, boot your first Linode, and connect via SSH with our Getting Started guide."
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-03-27
modified_by:
  name: Linode
published: 2018-03-27
title: Manage Python Packages and Virtual Environments with Pipenv
---

## What is Pipenv?

Most Python users are familiar with Pip and Virtualenv,

## Installation

You will need to have Python installed on your system to work wth Pipenv.

### Install Pipenv

If you are using Ubuntu 17.10 or higher, you can install Pipenv directly from the Pypa ppa:

    sudo apt install software-properties-common python-software-properties
    sudo add-apt-repository ppa:pypa/ppa
    sudo apt update
    sudo apt install pipenv

Other distributions should first install Pip and use it to install Pipenv:

    sudo apt install python-pip
    pip install pipenv

## Use Pipenv

Instead of using a `requirements.txt` file, Pipenv uses a **Pipfile**.

1.  Create a directory for an example Python project:

        mkdir python-example && cd python-example

2.  Use `pipenv` to install Numpy. Because there is no Pipfile in this directory, Pipenv will create a new virtual environment and add Numpy to the new environment's Pipfile.

        pipenv install numpy

    {{< output >}}

{{< /output >}}

    If you check the contents of the directory with `ls`, you will see that both a `Pipfile` and `Pipfile.lock` were created automatically. The Pipfile contains a list of all installed packages for this environment, and `Pipfile.lock` contains a hash of the exact versions used, ensuring that all builds made from this environment will be deterministic.

3.   Open the `Pipfile`:

    {{< file "~/python-example/Pipfile" >}}

{{< /file >}}

    Because a Python version was not specified explicitly when creating the virtual environment, the version in the Pipfile is the default version on your system. If you have multiple versions of Python installed and want to use a specific version for a given project, you can use `pipenv --python 3.6` when creating the environment. You can update the version used in an existing project by editing the version in the Pipfile and then running `pip install`.

### Work with Virtual Environments

1.



## Next Steps
