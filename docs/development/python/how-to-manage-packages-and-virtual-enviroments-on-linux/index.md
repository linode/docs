---
author:
  name: Linode Community
  email: docs@linode.com
description: 'In Python, the use of third party packages is a widley recognized and practiced. But the managing of these files is an important factor in your success as a Python programmar. This guide covers pip, Conda, Virtualenv, and Pipenv, and gives you the conceptual understanding to help you decide on the best way to manage packages and virtual environments with Python.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['Python','How to install python packages','Conda','pip', 'virtualenv', 'pipenv']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-05-22
modified_by:
  name: Linode
title: "How to Manage Python Packages and Virtual Environments on Linux"
contributor:
  name: Angel Guarisma
  link: https://github.com/guaris
---
Python is a programming language with a massive library of supporting modules. You can think of Python modules like Linux packages. It's common to rely on modules that are outside of the Python Standard Library when writing code. The installation of these modules needs to be managed so they don't interfere with other projects, or applications on your machine. Python programmers use virtual environments to manage the dependencies between projects, so that packages don't interfere with eachother. This guide will go over the different tools that Python programmers have to manage packages, and virtual environments on Linux. 

## Before You Begin

This guide will cover the basic concepts of using Python Virtual Environments, and installing Python packages. This guide will use Python 3. If you want to install Python 3 on your system, please refer to the following guides:

- [How to Install Python on Ubuntu 20.04](/docs/development/python/how-to-install-python-on-ubuntu)
- [How to Install Python on Debian](/docs/development/python/how-to-install-python-on-debian)
- [How to Install Python on CentOS](/docs/development/python/how-to-install-python-on-centos)


## What is pip

[pip](https://pip.pypa.io/en/stable/), the Python Package Installer is the default installation method for installing Python packages. pip will, by default install packages globally or for a specific user depending on the permissions enforced by your operating system. Pip is capable of installing new packages that are not included with your standard Python 3 installation, it has the ability to manage dependencies for projects and codebases, and it can uninstall packages and their dependencies. You can browse all of the Python modules available on the [Python Module Index](https://docs.python.org/3/py-modindex.html). 

### How Pip works

Pip has a variety of functions that help install, uninstall, and manage packages. Open source Python projects typically contain a `requirements.txt` file, that lists all of the dependencies of a project so that you can install them with Pip. Python packages are typically installed using the `pip3 install <packagename>` syntax. After running this command your package will be installed, and you can use the `import` statement, in Python code to begin using it. This table will go over the most common pip commands, and the common arguments, that can be run from the shell:

|Function | Syntax | Description  |
|---|---|---|
| [Install](https://pip.pypa.io/en/stable/reference/pip_install/) | `pip3 install packagename`  | This command installs a package from the Python Moduel Index by default.  |
|[Download](https://pip.pypa.io/en/stable/reference/pip_download/)   |`pip download [Options]`   |This command allows you to download packages from many different sorces, including Git, local project directories and remote arcives.   |
| [Uninstall](https://pip.pypa.io/en/stable/reference/pip_uninstall/)  |`pip uninstall packagename`   | This command allows you to uninstall any package that was installed using the `pip install` command.  |
|[Freeze](https://pip.pypa.io/en/stable/reference/pip_freeze/)   |`pip freeze -r`  | The Freeze command outputs all of the installed packages that a project has in order. Using the `-r` flag, you are able to see every package a project needs to run. 
|[List](https://pip.pypa.io/en/stable/reference/pip_list/)   |`pip list -o`, `pip list -l`  | This command lists all of the installed packages. The `-o` flag, lists the outdated packages, and the `-l` flag lists only the packages in your current environment, omitting any globally installed packages.
|[Show](https://pip.pypa.io/en/stable/reference/pip_show/)   |`pip show packagename`  | This command outputs information about a specific package, that is version number, homepage, summary, and other options. 
|[Search](https://pip.pypa.io/en/stable/reference/pip_search/)   |`pip search packagename`  | This command searches the pip repository for packages containing the search term. 
| [Check](https://pip.pypa.io/en/stable/reference/pip_check/)  | `pip check`  | This command checks your currently installed packages, to verify that it has installed correctly, and that the system has the packages dependencies installed. 




   {{< note >}}
On the latest version of Ubuntu, 20.04, pip has deliberatly not been installed by default to avoid any potential conflicts that could occur due to the deprecation of Python 2. To install pip on Ubuntu 20.04 run this command:

    sudo apt install python3-pip
    
{{< /note >}}

To install packages with `pip`, you need to verify that `pip` is installed on your system. 

    pip3 --version
    sudo apt install python3-pip
{{< note >}}

The `pip3` command is used in this guide to make the distinction between Python 2 and Python 3. If your system does not have Python 2 installed, you can feel free to use `pip`. 

{{< /note >}}

To install a package with pip you run: 

     pip3 install PackageName

Some documentation will display `pip` instead of `pip3`, but because of the recent deprecation of Python 2, running `pip3` ensures that you are installing the package for Python 3. 



### Package conflicts

Conflicts typically happen when you are working on multiple projects and codebases. As a feature, pip allows you to download all of the package dependencies of the project you are working on, and installs them into the Python directory. But, if you already modules installed, and the version of the module of the project doesn't match, the expected outcome is that Python will either keep the current version, or upgrade the version that the package requires. If the package has been upgraded, other projects on your system that depended on the previous version may not run as expected. If the currently installed version was newer than what the project needed, pip will not downgrade the version but it could mean that the project you are trying to work on will not run properly. 


## What is a Virtual Environment

A Virtual Environment is an isolated Python install that runs alongside your current installation, that allows you to install and upgrade packages without interfering with other Python packages, libraries, or projects on your system. The amount of virtual environments that you can have on your system is capped by your disk space. It is a standard practice to utilize virtual environments to install packages, even if you are only working on one project.

{{< note >}}
If for some reason you do not have VirtualEnv on your machine install it using pip:

    pip3 install virtualenv
{{< /note >}}

Virtual environments work by copying the python executable to a new location, and creating symlinks to standard packages, while creating an empty location on the system, for the new packages you will download for that project.

There are several solutions for managing virtual environments that have both major and minor differenes, and should be evaluated before choosing one. This guide will cover VirtualEnv, Pipenv, and Anaconda.

### What is Virtualenv

[Virtualenv](https://pypi.org/project/virtualenv/), or `venv` is the default tool that is included with all versions of Python greater than 3.5. It works by creating an isolated destination to install packages to based on the directory of the project. These packges, once installed, will not interfere with any of the other packages outside of the directory you initiated the virtual environment in. `venv` specifically creates a copy of the default Python binary that is installed on the machine, so if your machine is using Python 3.8, then all of your `venv` instances will be instances of Python 3.8. 

The advantages to this approach are in its simplicity. Because Virtualenv is installed by default, you can get started by creating a new directory and running the following command:

    virtualenv venv

This creates a new subdirectory in your current directory named `venv`. You can activate the virtual environment by triggering one of the activation scripts that is now installed within that directory: 

    source bin/activate

You will notice that your shell has preappended `(venv)` to the active user on the system. Now you are free to install packages using `pip` and they will remain isolated from the rest of the Python projects on your machine. To deactivate the virtual environment type `deactivate` into the shell, and you will notice the previously prepennded paranthesis are now gone, and you are currently using the globally installed Python packages, again. 


This happens quickly because Virtualenv does not actually create a new Python installation, only an isolated directory for packages. Virtualenv's are shells that contain symlinks to the systems Python installation. This means that if you upgrade or downgrade your Python installation, your virtualenvironments could break. It is also important to note that Virtualenv does not allow you to use different versions of Python for each project.


### What is Pipenv

Pipenv is one of Python’s officially recommended package management tool. It combines the functionality of Pip and Virtualenv, along with the best features of packaging tools from other languages such as Bundler and NPM. Pipenv integrates virtual environments with each package installation, and then locks its dependencies. This results in a simplified workflow for installing packages and managing virtual environments. Pipenv combines the process of using pip and `venv` and merges it into one command `pipenv`. Pipenv, also opts to using a `Pipfile`, and `Pipfile.lock`, to manage dependencies for projects. 

{{< note >}}
To install pipenv, or learn about `pipfile`, please check out our guide: [How to manage Python Packages and Virtual Environments with pipenv](https://www.linode.com/docs/development/python/manage-python-environments-pipenv/). 
{{< /note >}}

Pipenv introduces the ability to use seperate versions of Python for each project. To create a virtualenvironment that utilizes Python 3.8, you would use the following syntax:

    pipenv --python 3.8

These versions of Python need to be manually installed to a directory, so that Pipenv knows where to access it. 

Pipenv is recommended for newer developers that do not already have a workflow that involves Virtualenv or Pip. Because Pipenv requires both, and introduces a new filetype, it can be a daunting tasks for established developers to migrate their workflows to Pipenv. 

### What is Conda

Conda, is a part of Anaconda, which is a set of tools that is used in the scientific computing world. Conda has a built in package manager, and built-in support for virtual environments. Conda gives the user the ability to create new virtual environments with different versions of Python, and manage packages within them. Conda has a simple command to create virtual environments:

    conda create --name your_environment python=3.8
    
This command creates a new virtual environment named `your_environment` that uses Python 3.8. This can be run anywhere on the system. Unlike Virtualenv, you are not limited to the directory, because Conda abstracts the managing of virtual environments from the user. Conda has the ability to use pip within a Conda-created virtual environment. You can use `pip` with Conda, although Conda has its own package repository that is maintained by the Anaconda foundation which focuses mostly on compatibility. 

Conda is a recommended solution for data scientists, or people that want an all inclusive solution. Conda abstracts everything away and leaves you with a few simple commands to install packages, manage environments, and distribute code. It comes at the price of a much larger binary, and solutions like this are hard to transition out of if you ever decide to use anything else. 


## Conclusion

Managing packages and virtual environments with Python is not a straight forward problem. If you are an already establishe developer, or coming back to Python after a long break working with another language, the familiarity of the pip and Virtualenv workflow may appeal to you. If you are a new Python developer that wants to learn from the ground up, `pipenv`, could be a tool that helps you learn both about virtual environments and pip, when you are starting from a blank slate. If you are a data scientist, or learning Python to write scripts, and want to abstract all of the installation and managing to focus on writing code, there will be no better solution than Conda. Every option presented is modern, and will allow you to work with open source projects, distribute your code, and write new applications without worrying about conflicting dependencies. The key is to always have a familiar solution to install packages in isolated environments. 



