---
slug: install-anaconda-on-linux-centos-8-stream
description: "Learn how to install Anaconda on a Linux CentOS distribution."
keywords: ['anaconda linux']
tags: ['python', 'centos']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-09-10
modified_by:
  name: Linode
title: "Install Anaconda on Linux CentOS"
title_meta: "How to Install Anaconda on Linux CentOS"
relations:
  platform:
    key: how-to-install-anaconda
    keywords:
      - distribution: CentOS 8 Stream
authors: ["Cameron Laird"]
---
[Anaconda](http://anaconda.com) is a distribution of the Python and R programming languages. It is a curated bundle of specific language interpreters and add-ons. Anaconda's user base is primarily from the scientific computing, data analytics, and machine learning communities.

## Get Started with Anaconda

Anaconda is available for Windows, macOS, and Linux. Multiple [licenses](https://www.anaconda.com/pricing) govern Anaconda's use; this guide installs [Anaconda's Individual Edition](https://www.anaconda.com/products/individual) which is free and open source.

An Anaconda installation gives you:

- A recent and certified Python and R interpreter
- A large collection of open-source scientific computing libraries for these languages
- The conda package and environment manager
- The Anaconda Navigator graphical user interface (GUI) that is an alternative to conda

Anaconda's main benefit is that it ensure the compatibility of all the elements listed above. Anaconda is popular amongst data scientists, researchers, and statisticians. It handles dependency and compatibility issues when working with Python and R so that users in specialized fields can focus on their research.

### Anaconda Installation Steps

Anaconda can be installed either through a GUI or at on the command line. This guide focuses on installation steps for the command line on a CentOS distribution.

Follow the instructions below to install Anaconda. Installation takes around twenty minutes and consumes around 3.5 gigabytes of disk space within the users `$HOME` directory.

1. Navigate to your working directory. This can be your home directory.

        cd /home/example_user

1. Update your CentOS system packages.

        dnf upgrade

1. Install the `bzip2` package.

        sudo dnf install bzip2

1. If your CentOS system does not have Wget installed, install it now.

        sudo yum install -y wget

1. Download the Anaconda installer.

        sudo wget https://repo.anaconda.com/archive/Anaconda3-2020.11-Linux-x86_64.sh

    This installs Anaconda 3 and Python 3.8.

    {{< note respectIndent=false >}}
You can navigate to the [Anaconda archive](https://repo.anaconda.com/archive) to access all Anaconda installers.
    {{< /note >}}

1. Confirm the installer’s authenticity by running the command below. Replace `Anaconda3-2020.11-Linux-x86_64.sh` with the version of Anaconda you installed in the previous step.

        md5sum Anaconda3-2020.11-Linux-x86_64.sh

    You should see the signature of the particular release returned in the output. As of writing this guide, the output returned should resemble the following, `4cd48ef23a075e8555a8b6d0a8c4bae2 Anaconda3-2020.11-Linux-x86_64.sh`. The Anaconda archive mentioned in the previous section lists integrity hashes for all the available downloads.

1. Launch the installer with the command below. Replace `Anaconda3-2020.11-Linux-x86_64.sh` with the version of Anaconda you installed.

        sudo bash Anaconda3-2020.11-Linux-x86_64.sh

    When prompted, press **ENTER** to continue. Agree to the license terms by typing **yes**.

1. Accept the default installation location, `/root/anaconda3`.

1. When prompted, `initialize Anaconda3 by running conda init`, it is recommended to type **yes**. The installation finishes with a "Thank you for installing Anaconda3!" message. Run the following commands to ensure you can access Anaconda and that it is in your system's path:

        sudo -s source /root/anaconda3/bin/activate
        export PATH="/root/anaconda3/bin:$PATH"

    {{< note respectIndent=false >}}
During the `conda init` prompt, if you type **no**, conda cannot modify your shell scripts. In order to initialize conda manually, run the commands below after the installation is completed.

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
{{</ output >}}

    You can also verify the conda installation by running the `list` or `version` commands:

        conda list
        conda --version

1. Load the Python programming shell using the `python` command.

        python

At this point, Anaconda launches the 3.8.5 release of Python, or perhaps a different version, if you installed a different Anaconda version. The Anaconda company offers a wealth of [documentation](https://docs.anaconda.com/anaconda/) and other [training materials](https://www.anaconda.com/help) to help dive deeper into using Anaconda.
