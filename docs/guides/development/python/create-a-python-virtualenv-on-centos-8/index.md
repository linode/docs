---
slug: create-a-python-virtualenv-on-centos-8
description: This guide provides a brief introduction to Python virtual environments using the virtualenv tool on CentOS 8.
keywords: ["python", "python virtual environment", "virtualenv", "centos 8"]
tags: ["python","centos"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-04-07
modified_by:
  name: Linode
published: 2017-08-13
title: Creating a Python Virtual Environment on CentOS 8
title_meta: How to Create a Python Virtual Environment on CentOS 8
external_resources:
- '[virtualenv Official Documentation](http://virtualenv.pypa.io/)'
audiences: ["beginner"]
languages: ["python"]
image: Python_virtualenv_CentOS8.png
relations:
    platform:
        key: python-virtual-env
        keywords:
            - distribution: CentOS 8
aliases: ['/development/python/create-a-python-virtualenv-on-centos-8/']
authors: ["Linode"]
---

## What is a Python Virtual Environment?

A Python virtual environment is an isolated project space on your system that contains its own Python executable, packages, and modules. Your Python applications and projects often have their own specific dependencies. With a virtual environment you can manage each of your project's distinct dependencies without having them interfere with each other. You can use the [*virtualenv*](https://pypi.org/project/virtualenv/) tool to create a virtual environment on your system. This guide will show you how to use virtualenv to create and run a Python virtual environment on a CentOS 8 Linode.


## Before You Begin

1.  Complete the [Getting Started](/docs/products/platform/get-started/) and [Securing Your Server](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guides to prepare your system.

1.  Update your system:

        sudo yum update

    {{< note respectIndent=false >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
    {{< /note >}}

## Create a Python Virtual Environment

{{< note respectIndent=false >}}
CentOS 8 does not include any version of Python by default. To install Python on CentOS 8, read our guide on [installing Python 3 on CentOS 8](/docs/guides/how-to-install-python-on-centos-8/)
{{< /note >}}

1.  To install Python's virtual environment:

        sudo yum install virtualenv

1.  Create a `python-environments` directory in your user's home directory and navigate to it:

        mkdir ~/python-environments && cd ~/python-environments

1. Create a Python virtual environment. By default, virtualenv attempts to use your system's default Python interpreter to create a new environment. Replace `env` with the name you would like to assign to your virtual environment.

        virtualenv env

    {{< note respectIndent=false >}}
If your CentOS 8 system has another version of Python installed and you'd like to use it to create your virtual environment, use the e`--python` option to designate it. For example:

    virtualenv --python=python2.7 env
    {{< /note >}}

1.  Validate that your environment is installed with the version of Python that you expect:

        ls env/lib

    You should see your `env` environments Python version:

    {{< output >}}
python3.6.8
    {{</ output >}}

## Activate Your Virtual Environment

1. Activate the newly created virtual environment:

        source env/bin/activate

    The name of the working environment appears in parentheses after it's created.

      {{< output >}}
(env) example_user@hostname:~/python-environments$
      {{</ output >}}

      You can now begin installing Python packages and libraries that will remain isolated to your virtual environment.

## Deactivate a Virtual Environment

1. To deactivate an active virtual environment, issue the following command:

        deactivate

    Your virtual environment is deactivated and you should no longer see its name listed next to your command line's prompt

    {{< output >}}
example_user@hostname:~/python-environments$
    {{</ output >}}
