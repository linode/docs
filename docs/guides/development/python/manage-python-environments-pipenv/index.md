---
slug: manage-python-environments-pipenv
keywords: ["python", "virtual environment", "pip","virtualenv","pipenv"]
description: "Pipenv combines the functionality of Pip and Virtualenv into a single tool. Here's how to use it."
og_description: "Pipenv combines the functionality of Pip and Virtualenv into a single tool, helping to simplify workflows as you install packages and manage virtual environments. This guide will show you how to install Pipenv, create and work with virtual envrionments, and install packages."
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-03-27
modified_by:
  name: Linode
published: 2018-05-01
title: "Using Pipenv to Manage Python Packages and Versions"
title_meta: "How to Use Pipenv to Manage Python Packages and Versions"
audiences: ["beginner"]
languages: ["python"]
tags: ["python"]
aliases: ['/development/python/manage-python-environments-pipenv/']
authors: ["Jared Kobos"]
---

## What is Pipenv?

[Pipenv](https://docs.pipenv.org/) is Python's officially recommended package management tool. It combines the functionality of Pip and Virtualenv, along with the best features of packaging tools from other languages such as Bundler and NPM. This results in a simplified workflow for installing packages and managing virtual environments.

### Install Pipenv

You will need to have Python installed on your system before installing Pipenv.

If you are using Ubuntu 17.10 or higher, you can install Pipenv directly from the Pypa ppa:

    sudo apt install software-properties-common python-software-properties
    sudo add-apt-repository ppa:pypa/ppa
    sudo apt update
    sudo apt install pipenv

Other distributions should first install Pip and use it to install Pipenv:

    sudo apt install python-pip
    pip install pipenv

## Use Pipenv

1.  Create a directory for an example Python project:

        mkdir python-example && cd python-example

2.  Create a virtual environment in the directory:

        pipenv --python 3.6

    {{< output >}}
Creating a virtualenv for this project…
Using /home/username/miniconda3/bin/python3.6m (3.6.4) to create virtualenv…
⠋Running virtualenv with interpreter /home/username/miniconda3/bin/python3.6m
Using base prefix '/home/username/miniconda3'
New python executable in /home/username/.local/share/virtualenvs/python-example-YJNpmGYi/bin/python3.6m
Also creating executable in /home/username/.local/share/virtualenvs/python-example-YJNpmGYi/bin/python
Installing setuptools, pip, wheel...done.

Virtualenv location: /home/username/.local/share/virtualenvs/python-example-YJNpmGYi
Creating a Pipfile for this project…
{{< /output >}}

    If you omit the `--python` option, the environment will be created with your system's default version of Python.

3.  Check the contents of the directory with `ls`; you will see that a `Pipfile` has been created automatically. View this file in a text editor:

    {{< file "~/python-example/Pipfile" >}}
[[source]]
url = "https://pypi.python.org/simple"
verify_ssl = true
name = "pypi"

[dev-packages]

[packages]

[requires]
python_version = "3.6"
{{< /file >}}


4.  Install Numpy. Pipenv will automatically add the dependency to the `[packages]` section in the Pipfile. In addition, Pipenv creates a file named `Pipfile.lock`, which contains a hash of the exact versions used. This ensures that when other developers install the dependencies for this project, they will all end up with exactly the same versions.

        pipenv install numpy

5.  Install a specific version of Pytest as a development dependency:

        pipenv install --dev 'pytest>=3.*'

6.  View the changes these installations have made to the Pipfile:

    {{< file "Pipfile" >}}
[[source]]
url = "https://pypi.python.org/simple"
verify_ssl = true
name = "pypi"

[dev-packages]
pytest = ">=3.*"

[packages]
numpy = "*"

[requires]
python_version = "3.6"
{{< /file >}}

    Since no version was specified during when installing Numpy, the Pipfile specifies that any version (`"*"`) is acceptable. The specific version installed is recorded in `Pipfile.lock`.

{{< note respectIndent=false >}}
If you install a package in a directory that does not have a Pipfile, Pipenv will create a new environment in that directory automatically, using your system's default Python version. This means that the commands in this section can be condensed into two steps:

    pipenv install numpy
    pipenv install --dev pytest
{{< /note >}}

### Work with Virtual Environments

1.  From within the directory containing the Pipfile, start a shell in the new environment:

        pipenv shell

    This is similar to running `source env/bin/activate` with `virtualenv`.

2.  Launch the Python interpreter from inside this shell:

        python

3.  You should be able to import any of the installed packages:

        >>> import pytest
        >>> import numpy as np

4.  Exit the shell (similar to deactivating an environment with `virtualenv`):

        exit

5.  View your project's dependencies in graph form:

        pipenv graph

    {{< output >}}
numpy==1.14.2
pytest==3.5.0
  - attrs [required: >=17.4.0, installed: 17.4.0]
  - more-itertools [required: >=4.0.0, installed: 4.1.0]
  - six [required: >=1.0.0,<2.0.0, installed: 1.11.0]
  - pluggy [required: >=0.5,<0.7, installed: 0.6.0]
  - py [required: >=1.5.0, installed: 1.5.3]
  - setuptools [required: Any, installed: 39.0.1]
  - six [required: >=1.10.0, installed: 1.11.0]
{{< /output >}}

    The graph includes the packages you installed as well as their dependencies.

6.  Locate the binary for the virtual environment:

        pipenv --venv

    {{< output >}}
/home/user/.local/share/virtualenvs/python-example-YJNpmGYi
{{< /output >}}

## Next Steps

For a full list of commands and options, see the Pipenv [GitHub repo](https://github.com/pypa/pipenv) and [official docs](https://docs.pipenv.org/).
