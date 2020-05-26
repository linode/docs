---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Python is a programming language with a large amount of third party packages. It is important to manage Python project packages with virtual environments to avoid conflicting dependencies among different Python applications, and projects installed on the host system. This guide covers the basic concepts of managing packages and virtual environments for Python, on Linux.'
og_description: 'This guide walks you through Pipenv, Conda, and VirtualEnv, as solutions to managing python packages and dependencies on Linux.'
keywords: ['Python','How to install python packages','Conda','Pip', 'virtualenv', 'Pipenv']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-05-26
modified_by:
  name: Linode
title: "How to Manage Python Packages and Virtual Environments on Linux"
contributor:
  name: Angel Guarisma
  link: https://github.com/guaris
---
Python is a programming language with a large library of third party modules, or packages. Python developers rely on third party packages to simplify problems when they are writing code. When you install third party Python packages to your machine, you typically use a repository, like [Pypi](https://pypi.org/search/). This repository contains packages that can, by default be installed with [Pip](https://pip.pypa.io/en/stable/). Pip is a tool used to install Python packages, like Apt for Ubuntu, onto the host system. It's common for Python applications to depend on several dozen third party packages, and for the versions of these packages to differ among the different projects. This can cause some issues among the different dependencies of projects on your system, and their version numbers. As a response to this, Python developers utilize virtual environments to create isolated directories to install dependencies for specific projects, or even isolated installations of Python, across different projects. This guide will cover tools like : Pipenv, Virtualenv, and Conda, and help you decide on your approach to managing dependencies and virtual environments in python.

## Before You Begin

This guide will cover the basic concepts of using Python Virtual Environments, and installing Python packages. This guide will use Python 3. If you want to install Python 3 on your system, please refer to the following guides:

- [How to Install Python on Ubuntu 20.04](/docs/development/python/how-to-install-python-on-ubuntu)
- [How to Install Python on Debian](/docs/development/python/how-to-install-python-on-debian)
- [How to Install Python on CentOS](/docs/development/python/how-to-install-python-on-centos)


## What is Pip

[Pip](https://pip.pypa.io/en/stable/), the Python Package Installer is the default installation method for installing Python packages. Pip will, by default install packages globally or for specific users depending on the permissions enforced by your operating system. Pip relies on a strong package repository maintained by the community to install third party packages, that are not included with your standard Python 3 installation. Pip ships with the ability to install dependencies for projects that have a `requirements.txt` file. It can uninstall packages and their dependencies. You can browse all of the Python modules available on the [Python Module Index](https://docs.python.org/3/py-modindex.html).

### How Pip works

Pip has a variety of functions that help install, uninstall, and manage packages. Open source Python projects typically contain a `requirements.txt` file, that lists all of the dependencies of the project, and Pip can install from that file. Python packages are typically installed using the `pip3 install <packagename>` syntax. After running this command your package will be installed, and you can use the `import` statement, in Python code to begin using it. This table will go over the most common Pip commands, and the common arguments, that can be run from the shell:

|Function | Syntax | Description  |
|---|---|---|
| [Install](https://pip.pypa.io/en/stable/reference/pip_install/) | `pip3 install packagename`  | This command installs a package from the Python Module Index by default.  |
|[Download](https://pip.pypa.io/en/stable/reference/pip_download/)   |`pip download [Options]`   |This command allows you to download packages from many different sources, including Git, local project directories and remote archives.   |
| [Uninstall](https://pip.pypa.io/en/stable/reference/pip_uninstall/)  |`pip uninstall packagename`   | This command allows you to uninstall any package that was installed using the `pip install` command.  |
|[Freeze](https://pip.pypa.io/en/stable/reference/pip_freeze/)   |`pip freeze -r`  | The Freeze command outputs all of the installed packages that a project has in order. Using the `-r` flag, you are able to see every package a project needs to run.
|[List](https://pip.pypa.io/en/stable/reference/pip_list/)   |`pip list -o`, `pip list -l`  | This command lists all of the installed packages. The `-o` flag, lists the outdated packages, and the `-l` flag lists only the packages in your current environment, omitting any globally installed packages.
|[Show](https://pip.pypa.io/en/stable/reference/pip_show/)   |`pip show packagename`  | This command outputs information about a specific package, that is version number, homepage, summary, and other options.
|[Search](https://pip.pypa.io/en/stable/reference/pip_search/)   |`pip search packagename`  | This command searches the Pip repository for packages containing the search term.
| [Check](https://pip.pypa.io/en/stable/reference/pip_check/)  | `pip check`  | This command checks your currently installed packages, to verify that it has installed correctly, and that the system has the packages dependencies installed.

   {{< note >}}
On the latest version of Ubuntu, 20.04, Pip is not installed by default to avoid any potential conflicts that could occur due to the deprecation of Python 2. To install Pip on Ubuntu 20.04 run this command:

    sudo apt install python3-pip

{{< /note >}}

To install packages with `pip`, you need to verify that `pip` is installed on your system.

    pip3 --version
{{< note >}}

The `pip3` command is used in this guide to make the distinction between Python 2 and Python 3. If your system does not have Python 2 installed, you can feel free to use `pip`.

{{< /note >}}

To install a package with Pip you run:

     pip3 install PackageName

Some documentation will display `pip` instead of `pip3`, but because of the recent deprecation of Python 2, running `pip3` ensures that you are installing the package for Python 3.



### Package conflicts

Package conflicts can happen when you are working with multiple Python projects, or codebases. Because Pip, by default, installs packages globally, you can potentially overwrite each projects dependencies with the subsequent projects. Pip installs dependencies of Python projects into the Python directory. But, if you already have certain packages installed, and the version of the packages  of the project don't match, the expected outcome is that Python choose the latest version of the package and either install it, if it would be an upgrade, or do nothing if it would be a downgrade. If the package has been upgraded, other projects on your system that depended on the previous version may not run as expected. If the currently installed version was newer than what the project needed, your project may not run properly. To prevent this from happening, Python developers use virtual environments.


## What are Virtual Environments

Virtual Environment implementations vary depending on the tool you use. But, a Virtual Environment creates either an isolated Python binary or isolated directories linked to your projects. They allow you to install and upgrade packages without interfering with the base system, or other Python applications on your system. It is a standard practice to utilize virtual environments, even if you are only working on one project so that your project will always be compatible with your system.

### What is Virtualenv

[Virtualenv](https://pypi.org/project/virtualenv/), or `venv` is the default tool that is included with all versions of Python greater than 3.5. It works by creating isolated directories,within a Python applications base directory, and installs packages within that environment. These packages, once installed, will not interfere with other packages outside of the directory you initiated the virtual environment in. `venv` specifically creates a copy of the default Python binary that is installed on the machine, so if your machine is using Python 3.8, then all of your `venv` virtual environments will be contain an instance of Python 3.8.

The advantages to this approach are in its simplicity. Because Virtualenv is installed by default, you can get started by creating a new directory and running the following command:

    virtualenv venv

{{< note >}}
If you do not have VirtualEnv on your machine install it using Pip:

    pip3 install virtualenv
{{< /note >}}

This command creates a new subdirectory within the current directory named `venv`. You can activate the virtual environment by triggering one of the activation scripts that is now installed within that directory:

    source bin/activate

You will notice that your shell has prepended `(venv)` to the active user on the system, this is a queue that you are operating in a virtual environment. Now you are free to install packages using `pip` and they will remain isolated from other Python projects currently installed on your machine. To deactivate the virtual environment type `deactivate` into the shell, and you will notice the previously prepended parentheses are now gone, and you access to the projects dependencies are now revoked.


This happens quickly because Virtualenv does not actually create a new Python installation, only an isolated directory for packages. Virtualenv's are shells that contain symlinks to the systems Python installation. This means that if you upgrade or downgrade your Python installation, your virtual environments could break. It is also important to note that Virtualenv does not allow you to use different versions of Python for each project.


### What is Pipenv

Pipenv is one of Python’s officially recommended package management tool. It combines the functionality of Pip and Virtualenv, along with the best features of packaging tools from other languages such as Bundler and NPM. Pipenv integrates virtual environments with each package installation, and then locks its dependencies. This can results in a simplified workflow for installing packages and managing virtual environments. Pipenv combines the process of using Pip and `venv` and merges it into one command `pipenv`. Pipenv, also opts to using a `pipfile`, and `pipfile.lock`, to manage dependencies for projects.

{{< note >}}
To install Pipenv, or learn about `pipfile`, please check out our guide: [How to manage Python Packages and Virtual Environments with pipenv](https://www.linode.com/docs/development/python/manage-python-environments-pipenv/).
{{< /note >}}

Pipenv introduces the ability to use separate Python binaries for each project. So projects that depend on Python 3.7, and projects that depend on Python 3.6 can be installed on the same system. To create a virtual environment that utilizes Python 3.8, you would use the following syntax:

    pipenv --python 3.8

The Python binaries for the separate versions need to be manually installed to a directory, so that Pipenv can access them.

Pipenv is recommended for newer developers that do not already have a workflow that involves Virtualenv or Pip. Because Pipenv requires both, and introduces a new file type, it can be a daunting tasks for established developers to migrate their workflows to Pipenv.

### What is Conda

Conda, is a part of Anaconda, which is a set of tools that is used in the scientific computing world. Conda has a built in package manager, and built-in support for virtual environments. Conda gives the user the ability to create new virtual environments with different versions of Python, and manage packages within them. Conda has a simple command to create virtual environments:

    conda create --name your_environment python=3.8

This command creates a new virtual environment named `your_environment` that uses Python 3.8. This can be run anywhere on the system. Unlike Virtualenv, you are not limited to the directory, because Conda abstracts the managing of virtual environments from the user. Also, unlike pipenv, you do not need to manually install separate Python binaries for the different versions of Python you want to support on your system, Conda has a massive repository that it pulls from to manage that. Conda has the ability to use Pip within a Conda-created virtual environment. You can use `pip` with Conda, although Conda has its own package repository that is maintained by the Anaconda foundation which focuses mostly on compatibility.

Conda is a recommended solution for data scientists, or people that want an all inclusive solution. Conda abstracts everything away and leaves you with a few simple commands to install packages, manage environments, and distribute code. It comes at the price of a much larger binary, and solutions like this are hard to transition out of if you ever decide to use anything else.


## Conclusion

Most Python applications will rely on third party packages. It's important to manage dependencies between projects so that you can continue to work on your applications. It's also important to develop a familiarity with how pip handles dependencies for other projects. If you are an already established developer and are trying to use Python for the first time, the best solution may be to use Pip and Venv, as the workflow resembles environment management in other programming languages. If you are a data scientist, or just someone that wants a straight forward all-inclusive solution, Conda is the best choice. Conda abstracts almost everything away in favor of letting you focus on writing or using Python applications. If you are a new developer, you can take your pick, but it could be a good time to gain experience using Pipenv. Most importantly, all developers should strive to focus more on the code than on dependency management, so becoming deeply familiar with a solution is important to your success as a Python developer.




