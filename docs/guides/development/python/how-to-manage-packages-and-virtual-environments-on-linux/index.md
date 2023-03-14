---
slug: how-to-manage-packages-and-virtual-environments-on-linux
description: "Python virtual environments help developers avoid dependency conflicts. This guide covers the basic concepts of Python packages and virtual environments."
keywords: ['How to install python on linux','manage python environments in linux', 'virtualenv python', 'pipenv tutorial']
tags: ['python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-12
modified_by:
  name: Linode
title: "Managing Python Packages and Versions on Linux"
title_meta: "How to Manage Python Packages and Versions on Linux"
aliases: ['/development/python/how-to-manage-packages-and-virtual-environments-on-linux/']
authors: ["Angel Guarisma"]
---

Python is a programming language with a large library of third party modules, or packages. Python developers rely on third party packages to simplify problems when they are writing code. When you install third party Python packages to your machine, you typically use a repository, like [Pypi](https://pypi.org/search/). This repository contains packages that can, by default, be installed with [Pip](https://pip.pypa.io/en/stable/). Pip is a tool used to install Python packages, like [Apt](https://en.wikipedia.org/wiki/APT_(software)) for Ubuntu, onto the host system.

## What are Python Virtual Environments

It's not uncommon for Python applications to depend on several dozen third party packages. Additionally, the versions of these packages often differ between different software projects. This can cause some issues among the various dependencies of the projects on your system, and their version numbers.

As a response to this problem, Python developers utilize *virtual environments*. These virtual environments create isolated directories to install dependencies for specific projects. It's also possible to install isolated versions of the Python binary with virtual environments.

Several tools exist to manage virtual environments. This guide covers tools such as Pipenv, Virtualenv, and Conda, and offers advice for managing dependencies and virtual environments in Python.

## Before You Begin

This guide covers the basic concepts of using Python Virtual Environments and installing Python packages. This guide uses Python 3. If you want to install Python 3 on your system, please refer to the following guides:

- [How to Install Python on Ubuntu 20.04](/docs/guides/how-to-install-python-on-ubuntu-20-04)
- [How to Install Python on Debian](/docs/guides/how-to-install-python-on-debian-10)
- [How to Install Python on CentOS](/docs/guides/how-to-install-python-on-centos-8)

## What is Pip

[Pip](https://pip.pypa.io/en/stable/), the Python Package Installer is the default installation method for installing Python packages. By default, Pip can installs packages globally, or it can install them for specific users. This depends on the permissions enforced by your operating system. It can also uninstall packages and their dependencies.

Pip relies on a strong community-maintained package repository to install third party packages that are not included with your standard Python 3 installation. You can browse all of the Python modules available on the [Python Module Index](https://docs.python.org/3/py-modindex.html).

### How Pip works

Pip has a variety of functions that help install, uninstall, and manage packages. Open source Python projects typically contain a `requirements.txt` file. This file lists all of the dependencies of the project, and Pip can install from that file.

Python packages are typically installed using the syntax:

    pip3 install <packagename>

After running this command, your package is installed and you can use the `import` statement in your Python code to begin using it.

This table shows the most common Pip commands and their common arguments and options that can be run from the command line:

|Function | Syntax  | Description  |
|---------|---------------------------------------------------------|--------------|
| [Install](https://pip.pypa.io/en/stable/reference/pip_install/) | `pip3 install packagename` | This command installs a package from the Python Module Index by default.  |
|[Download](https://pip.pypa.io/en/stable/reference/pip_download/)   |`pip3 download [Options]` |This command allows you to download packages from many different sources, including Git, local project directories, and remote archives.   |
| [Uninstall](https://pip.pypa.io/en/stable/reference/pip_uninstall/)  |`pip3 uninstall packagename` | This command allows you to uninstall any package that was installed using the `pip3 install` command.  |
|[Freeze](https://pip.pypa.io/en/stable/reference/pip_freeze/)   |`pip3 freeze -r requirements.txt` | The Freeze command outputs all of the installed packages that a project has in order. Using the `-r` flag, you can save the dependencies to a requirements.txt file.
|[List](https://pip.pypa.io/en/stable/reference/pip_list/)   |`pip3 list -o`, `pip3 list -l` | This command lists all of the installed packages. The `-o` flag lists the outdated packages. The `-l` flag lists only the packages in your current environment, omitting any globally installed packages.
|[Show](https://pip.pypa.io/en/stable/reference/pip_show/)   |`pip3 show packagename` | This command outputs information about a specific package, that is version number, homepage, summary, and other options.
|[Search](https://pip.pypa.io/en/stable/reference/pip_search/)   |`pip3`&nbsp;`check`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | This command checks your currently installed packages to verify that they have installed correctly. This command reports any packages that are missing dependencies.

Before installing packages with `pip`, first verify that `pip` is installed on your system with the following command:

        pip3 --version

{{< note >}}
The `pip3` command is used in this guide to make the distinction between Python 2 and Python 3. If your system does not have Python 2 installed, feel free to use `pip`.

Some documentation specifies `pip` instead of `pip3`, but because of the recent deprecation of Python 2, running `pip3` ensures that you are installing the package for Python 3.
{{< /note >}}

{{< note >}}
In the latest version of Ubuntu, 20.04, Pip is not installed by default. To install Pip on Ubuntu 20.04 run the following command:

    sudo apt install python3-pip

{{< /note >}}

### Package Conflicts in Python

Package conflicts can happen when you are working with multiple Python projects or codebases. Because Pip, by default, installs packages globally, you can potentially overwrite one project's dependencies with subsequent projects.

Pip installs dependencies of Python projects into the Python directory. If you already have a package installed, and the version of the package in the project doesn't match, one of two things could happen. Python determines the latest version of the package and either:

- Installs the newer version.
- Does nothing. Python doesn't downgrade packages to previous versions.

If the package has been upgraded, other projects on your system that depended on the previous version may not run as expected. If the currently installed version was newer than what the project needed, your project may not run properly.

To prevent this from happening, Python developers use *virtual environments*.

## Manage Virtual Environments in Linux

Virtual Environment implementations vary depending on the tool you use. In general, a virtual environment creates either an isolated Python binary, or isolated Python directories linked to your projects. They allow you to install and upgrade packages without interfering with the base system or other Python applications on your system. It is a standard practice to utilize virtual environments, even if you are only working on one project. This ensures that your project is always compatible with your system.

### What is Virtualenv

[Virtualenv](https://pypi.org/project/virtualenv/), or `venv` is the default tool that is included with all versions of Python greater than 3.5. It works by creating isolated directories within a Python application's base directory and installs packages within that environment.

These packages, once installed, do not interfere with other packages outside of the virtual environment directory. `venv` creates a copy of the default Python binary that is installed on the machine. This means if your machine is using Python 3.8, then all of your `venv` virtual environments contain an instance of Python 3.8. The advantages to this approach are in its simplicity.

1.  Because Virtualenv is installed by default, you can get started by creating a new directory and running the following command:

        virtualenv my-virtual-environment

    {{< note respectIndent=false >}}
If you do not have virtualenv on your machine install it using Pip:

    pip3 install virtualenv
{{< /note >}}

    This command creates a new subdirectory within the current directory named `my-virtual-environment`.

1.  You can activate the virtual environment by triggering one of the activation scripts that is now installed within that directory:

        cd my-virtual-environment/ && source bin/activate

    After this command is invoked, your terminal prepends `(my-virtual-environment)` to your command prompt:

    {{< output >}}
(my-virtual-environment) user@localhost:~/my-virtual-environment
{{< /output >}}

    This is a cue that you are operating in a virtual environment. Now you are free to install packages using `pip`. They are isolated from other Python projects currently installed on your machine.

1.  To deactivate the virtual environment type `deactivate` into the terminal. Notice that the prepended virtual environment name in your command prompt is now gone. Your access to the project's dependencies are now revoked.

    This operation happens quickly because Virtualenv does not actually create a new Python binary installation. Instead, it only creates an isolated directory for packages. Virtualenvs are shells that contain symlinks to the system's Python installation. This means that if you upgrade or downgrade your system's Python installation, your virtual environments could break. It is also important to note that Virtualenv does not allow you to use different versions of Python for each project.

### What is Pipenv

[Pipenv](https://pypi.org/project/pipenv/) is one of Python’s officially recommended package management tools. It combines the functionality of Pip and Virtualenv, along with the best features of packaging tools from other languages such as [Bundler](https://bundler.io/) and [NPM](https://www.npmjs.com/). This results in a simplified workflow for installing packages and managing virtual environments.

Pipenv combines the process of using Pip and Virtualenv and merges it into one command, `pipenv`. Pipenv also opts to using a `pipfile`, and `pipfile.lock` to manage dependencies for projects.

{{< note >}}
To install Pipenv, or to learn about `pipfile`, please check out our guide: [How to Manage Python Packages and Virtual Environments with pipenv](/docs/guides/manage-python-environments-pipenv/).
{{< /note >}}

Pipenv introduces the ability to use separate Python binaries for each project. For example, projects that depend on Python 3.8 and projects that depend on Python 3.7 can be installed on the same system. To create a virtual environment that utilizes Python 3.8, you would use the following syntax:

    pipenv --python 3.8

The Python binaries for the separate versions need to be manually installed to a directory so that Pipenv can access them.

Pipenv is recommended for newer developers that do not already have a workflow that involves Virtualenv or Pip. Because Pipenv requires both, and introduces a new file type, it can be a daunting task for established developers to migrate their workflows to Pipenv.

### What is Conda

[Conda](https://docs.conda.io/en/latest/) is a part of [Anaconda](https://www.anaconda.com/), a set of tools that is used in the scientific computing community. Conda has a built-in package manager and built-in support for virtual environments. Conda gives you the ability to create new virtual environments with different versions of Python and manage packages within them.

Conda has a simple command to create virtual environments:

    conda create --name your_environment python=3.8

This command creates a new virtual environment named `your_environment` that uses Python 3.8. This can be run anywhere on the system.

Unlike Virtualenv, you are not limited to the directory, because Conda abstracts the managing of virtual environments from the user. Also, unlike pipenv, you do not need to manually install separate Python binaries for the different versions of Python you want to support. Conda has a massive repository that it pulls from to manage the different versions of Python.

Conda has the ability to use Pip within a Conda-created virtual environment, so you can use `pip` with Conda. However, Conda has its own package repository that is maintained by the [Anaconda foundation](https://www.anaconda.com/open-source) which focuses mostly on compatibility.

Conda is the recommended solution for data scientists, or people that want an all-inclusive solution. Conda abstracts everything away and leaves you with a few simple commands to install packages, manage environments, and distribute code. It comes at the price of a much larger binary. Also, solutions like this are hard to transition out of if you ever decide to use anything else.

## Recommendations

When considering the following recommendations, remember, all developers should strive to focus more on the code than on dependency management. Becoming deeply familiar with a package/dependency management solution is less important to your success as a Python developer than development.

- **Established developer using Python for the first time**: the best solution may be to use Pip and Venv, as the workflow resembles environment management in other programming languages.

- **Data scientist or user that wants a straight forward, all-inclusive solution**: Conda is the best choice. Conda abstracts almost everything away in favor of letting you focus on writing or using Python applications.

- **New developer**: You can take your pick, but it could be a good time to gain experience using Pipenv.

## Conclusion

Most Python applications rely on third party packages. It's important to manage dependencies between projects so that you can continue to work on your applications. It's also important to develop a familiarity with how Pip handles dependencies for other projects.
