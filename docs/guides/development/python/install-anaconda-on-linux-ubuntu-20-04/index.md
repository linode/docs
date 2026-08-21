---
slug: install-anaconda-on-linux-ubuntu-20-04
author:
  name: Cameron Laird
description: 'Learn how to install Anaconda on Linux Ubuntu 20.04'
og_description: 'Learn how to install Anaconda on Linux Ubuntu 20.04'
keywords: ['install anaconda on ubuntu']
tags: ['python', 'ubuntu']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-10
modified_by:
  name: Linode
title: "Install Anaconda on Linux Ubuntu 20.04"
h1_title: "How to Install Anaconda on Linux Ubuntu 20.04"
enable_h1: true
contributor:
  name: Cameron Laird
  link: https://twitter.com/Phaseit
relations:
    platform:
        key: how-to-install-anaconda
        keywords:
            - distribution: Ubuntu 20.04
external_resources:
- '[Anaconda licenses](https://www.anaconda.com/pricing)'
- '[Anaconda archive](https://repo.anaconda.com/archive)'
- '[Anaconda documentation](https://docs.anaconda.com/anaconda/)'
- '[Anaconda training materials](https://www.anaconda.com/help)'
---

Anaconda is a distribution of the Python and R programming languages. In other words, a curated bundle of specific base language interpreters and add-ons.  [Anaconda, Inc.](http://anaconda.com) generates it for a user base primarily focused on scientific computing, data analytics, machine learning, and allied fields.

## Get Started with Anaconda

Anaconda is available for Windows, macOS, and Linux. Multiple [licenses](https://www.anaconda.com/pricing) govern Anaconda use; for the purpose of this how-to guide, it’s appropriate to assume that you can install Anaconda's [open-source Individual Edition](https://www.anaconda.com/products/individual) as you learn about its use.

An Anaconda installation gives you:

- A recent and certified Python interpreter
- A recent and certified R interpreter
- A large collection of open-source scientific computing libraries for these languages
- The conda package and environment manager for the libraries above
- The Anaconda Navigator Graphical User Interface (GUI) alternative to conda

Much of Anaconda’s accomplishment is to curate all these elements to ensure they’re compatible. It’s easy to install Python along with hundreds of the packages available for Python, and similarly, for R. These are routine operations for many professional developers. Anaconda brings all this power within the practical grasp of scientists and other data workers with a focus outside the languages, though. Researchers can install Anaconda, let Anaconda handle compatibility issues, and keep their own attention on computing useful results.

### Anaconda Installation Steps

Anaconda can be installed either through a GUI or at the command-line interface (CLI). The latter works equally well both on desktops and for remote servers in data centers. This how-to guide focuses exclusively on installation through the CLI.

Follow the below instructions to install Anaconda. Installation takes around twenty minutes and consumes around 3.5 gigabytes of disk space within the users `$HOME` directory.

{{< note >}}
You can run the following installation steps on CentOS distribution too.
{{< /note >}}

1. Navigate to your working directory. This can be your home directory.

        cd /home/example_user

1. Update your system and install wget and bzip2 Linux packages:

        sudo apt-get update
        sudo apt-get install sudo wget -y
        sudo apt-get install bzip2

1. Download the Anaconda installer.

        sudo wget https://repo.anaconda.com/archive/Anaconda3-2020.11-Linux-x86_64.sh

    This installs Anaconda 3 with Python 3.8.

    {{< note >}}
You can navigate to the [Anaconda archive](https://repo.anaconda.com/archive) to access all Anaconda installers. The system requirements for different installations differ slightly.
    {{< /note >}}

1. Confirm the installer’s authenticity by running the command below. Replace `Anaconda3-2020.11-Linux-x86_64.sh` with the version of the Anaconda you installed in the previous step.

        md5sum Anaconda3-2020.11-Linux-x86_64.sh

    You should see `4cd48ef23a075e8555a8b6d0a8c4bae2 Anaconda3-2020.11-Linux-x86_64.sh`, the signature of this particular release. The Anaconda archive mentioned in the previous step lists integrity hashes for all the available downloads.

1. Launch the installer with the command below. Replace `Anaconda3-2020.11-Linux-x86_64.sh` with the version of the Anaconda you installed.

        sudo bash Anaconda3-2020.11-Linux-x86_64.sh

    When prompted, press "ENTER” to continue. Agree to the license terms by typing **yes**.

1. Accept the default installation location, `/root/anaconda3`.

1. When prompted to initialize Anaconda3 by running `conda init`, it is recommended to type **yes**. The installation finishes with a "Thank you for installing Anaconda3!" message. Run the following commands:

        sudo -s source /root/anaconda3/bin/activate
        export PATH="/root/anaconda3/bin:$PATH"

    {{< note >}}
During the `conda init` prompt, if you type **no**, then conda cannot modify your shell scripts. In order to initialize conda manually, run the below commands after the installation is completed.

    sudo -s source /root/anaconda3/bin/activate
    export PATH="/root/anaconda3/bin:$PATH"
    conda init
    {{< /note >}}

1. Verify the Anaconda installation by running the following command:

        conda info

    Depending upon your installation location, you should see an output similar to the following:

    {{< output >}}
active environment : None
       user config file : /home/example_user/.condarc
 populated config files :
          conda version : 4.9.2
    conda-build version : 3.20.5
         python version : 3.8.5.final.0
       virtual packages : __glibc=2.28=0
                          __unix=0=0
                          __archspec=1=x86_64
       base environment : /root/anaconda3  (read only)
           channel URLs : https://repo.anaconda.com/pkgs/main/linux-64
                          https://repo.anaconda.com/pkgs/main/noarch
                          https://repo.anaconda.com/pkgs/r/linux-64
                          https://repo.anaconda.com/pkgs/r/noarch
          package cache : /root/anaconda3/pkgs
                          /home/example_user/.conda/pkgs
       envs directories : /home/example_user/.conda/envs
                          /root/anaconda3/envs
               platform : linux-64
             user-agent : conda/4.9.2 requests/2.24.0 CPython/3.8.5 Linux/4.18.0-305.3.1.el8_4.x86_64 almalinux/8.4 glibc/2.28
                UID:GID : 1000:1000
             netrc file : None
           offline mode : False
{{< /output >}}

    You can also verify the conda installation by running the `list` or `version` commands:

        conda list
        conda --version

1. Load the Python programming shell using the `python` command.

        python

At this point, Anaconda launches the 3.8.5 release of Python, or perhaps a different version, if you installed a different Anaconda than version `3-2020.11-Linux`. The Anaconda company offers a wealth of [documentation](https://docs.anaconda.com/anaconda/) and other [training materials](https://www.anaconda.com/help) to help get you started.
