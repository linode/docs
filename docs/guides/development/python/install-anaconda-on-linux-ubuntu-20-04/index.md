---
slug: install-anaconda-on-linux-ubuntu-20-04
author:
  name: Cameron Laird
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
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
---

Anaconda is a distribution of the Python and R programming languages. In other words, a curated bundle of specific base language interpreters and add-ons.  [Anaconda, Inc.](http://anaconda.com) generates it for a user base primarily focused on scientific computing, data analytics, machine learning, and allied fields.

## Getting Started with Anaconda

Anaconda is available for Windows, MacOS, and Linux. Multiple [licenses](https://www.anaconda.com/pricing) govern Anaconda use; for the purpose of this How-to, it’s appropriate to assume that you can install Anaconda [without charge](https://www.anaconda.com/products/individual) as you learn about its use.

An Anaconda installation gives you:

- A recent and certified Python interpreter
- A recent and certified R interpreter
- A large collection of open-source scientific computing libraries for these languages
- The conda package and environment manager for the libraries above
- The Anaconda Navigator graphical user interface (GUI) alternative to conda

Much of Anaconda’s accomplishment is to curate all these elements to ensure they’re compatible. It’s easy to install Python along with hundreds of the packages available for Python, and similarly for R. These are routine operations for many professional developers. Anaconda brings all this power within the practical grasp of scientists and other data workers with a focus outside the languages, though. Researchers can install Anaconda, let Anaconda handle compatibility issues, and keep their own attention on computing useful results.

### Anaconda Installation Steps

Anaconda can be installed either through a GUI or at the command line (CLI). The latter works equally well both on desktops and for remote servers in data centers. This How-to focuses exclusively on installation through the CLI.

Installation takes around twenty minutes and fills something under 3.5 gigabytes within the `$HOME` directory of the user who follows the instructions below.

1. Navigate to your working directory. This can be your home directory.

        cd /home/example_user

1. Update your system and install Wget:

        sudo apt-get update
        sudo apt-get install sudo wget -y

1. Download the Anaconda installer.

        sudo wget https://repo.anaconda.com/archive/Anaconda3-2020.11-Linux-x86_64.sh

    This installs Anaconda 3 from with Python 3.8.

    {{< note >}}
You can navigate to the [Anaconda archive](https://repo.anaconda.com/archive) to access all Anaconda installers. The system requirements for different installations differ slightly. You may need to install the bzip2 Linux package along with Wget.
    {{< /note >}}

1. Confirm the installer’s authenticity by running the command below. Replace `Anaconda3-2020.11-Linux-x86_64.sh` with the version of Anaconda you installed in the previous step.

        md5sum Anaconda3-2020.11-Linux-x86_64.sh

    You should see `4cd48ef23a075e8555a8b6d0a8c4bae2`, the signature of this particular release. The Anaconda archive mentioned in the previous section lists integrity hashes for all the available downloads.

1. Launch the installer with the command below. Replace `Anaconda3-2020.11-Linux-x86_64.sh` with the version of Anaconda you installed.

        sudo bash Anaconda3-2020.11-Linux-x86_64.sh

    When prompted, press "ENTER” to continue. Agree to the license terms by typing ****yes****.

1. Accept the default installation location, `/root/anaconda3`.

1. Agree to the initialization of `conda init` by typing ****yes****.

1. The next time you log in, all of Anaconda will be available to you. You can see this for yourself immediately, while still at the same CLI, by running

        source ~/.bashrc
        python

At this point, Anaconda launches the 3.8.5 release of Python, or perhaps a different version, if you installed a different Anaconda than version 3-2020.11-Linux. The Anaconda company offers a wealth of [documentation](https://docs.anaconda.com/anaconda/) and other [training materials](https://www.anaconda.com/help) to help get you started.
