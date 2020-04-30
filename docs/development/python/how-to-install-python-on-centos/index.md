---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Centos 8 does not come with Python installed. Python 3 is the only supported version of Python. This guide will walk you through installing Python 3.8, the latest major release of Python, from source. And Installing Python 3.6 on Centos 8.'
og_description: 'This guide will walk you through Installing Python 3 on Centos 8'
keywords: ['How to Install Python on Centos 8','Python','Python3','Python 2 end of life']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-04-27
modified_by:
  name: Linode
title: "How to Install Python 3 on CentOS 8"
h1_title: "How to Install Python on Centos 8"
contributor:
  name: Angel Guarisma
  link: Github.com/Guaris
---

Python is a popular programming language created in 2000, by Guido van Rossum. It's useful for writing everything from small scripts to full-scale software. Python is also a commonly taught programming language for people entering into the field of software development. A lot of it's poplularity is based on Python's high level of abstraction that makes writing and reading the code easier than other languages. 

Unlike other Linux distributions, CentOS 8 does not come with a version of Python installed. Currently Python 3.8 is the latest major version of Python. The CentOS package repository includes Python 3.6, but Python 3.8 includes support for many large changes in the Python programming language. Python 3.8 on Centos 8. 


## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  Update your system:

        sudo yum update

## Installing Python 3.8

We are going to have to build Python 3.8 from source to install it on CentOS 8. 

1. Download the dependencies to build the package:

        sudo dnf groupinstall 'development tools'
        sudo dnf install wget openssl-devel bzip2-devel libffi-devel

2. Download Python version 3.8:

        sudo wget https://www.python.org/ftp/python/3.8.2/Python-3.8.2.tgz

3. Extract the Python package:

        tar -xvf Python-3.8.2.tgz

4. Open the Python directory and run the configuration script

        sudo ./configure --enable-optimzations
        sudo make install


  {{< note >}}
If you have an already existing Python binary installed at `/usr/bin/python` or `/usr/bin/python3`, you should run `sudo make altinstall` instead.
{{< /note >}}

After the installation is finished, you can run the command `python3 -V` and verify the installation.

    python3 -V

You will see this output:

{{< output >}}
Python 3.8.2
{{< /output >}}



## Additional Information

If you do not need the latest version of Python, you can install Python 3.6, which is, by default, included in the CentOS 8 repository, by running:

    sudo dnf install python3

If you haven't installed any other version of Python, you can verify this installation by typing:

    Python -V

And the shell will return:
{{< output >}}
Python 3.6.8
{{< /output >}}


{{< caution >}}
Installing multiple version of Python 3 is not recommended. It's best to manage versions with tools like [pyenv](https://github.com/pyenv/pyenv) or [anaconda](https://www.anaconda.com/)
{{< /caution >}}

### Python 2

If you still require Python 2 as a dependency for code or software, you can install it like this:

    sudo dnf install python2

And running `python2 -V` will output:

{{< output >}}
Python 2.7.16
{{< /output >}}


It's important to remember that Python2 will no longer be supported by the Python foundation, so there will be no new updates, or fixes. Applications are making the switch to Python 3, and distributions like Ubuntu 20.04 and CentOS 8 are no longer shipping with Python 2 on by default. 


