---
slug: how-to-install-anaconda
description: "Learn how to install Anaconda, a Python/R distrihution designed for scientific computing, on Ubuntu."
keywords: ['Data Science','Anaconda','Package Management','Python','Ruby','Ubuntu']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-06-04
image: Anaconda.jpg
modified_by:
  name: Linode
title: "Installing Anaconda on Ubuntu"
title_meta: "How to Install Anaconda on Ubuntu"
external_resources:
- '[Anaconda Documentation](https://docs.anaconda.com/anaconda/)'
relations:
    platform:
        key: how-to-install-anaconda
        keywords:
            - distribution: Ubuntu
authors: ["Linode"]
---

## Install Anaconda on Ubuntu

Installing Anaconda on Linode (or other Linux system) using the CLI may look daunting, but don't let it scare you. It is possible to install it without using a graphical environment.

Follow these instructions to download the most recent version of the Anaconda installer and use it to install Anaconda. At the time of the writing of this guide, the latest version was 2020.11.

1.  Connect to your Linode using SSH (or Lish) and log in with your username and password.

2.  Ensure you are in the *Bash* shell by entering `bash`.

3.  If you don't have a Downloads directory already, create one by entering `mkdir Downloads`.

4.  Switch to your new Downloads directory by entering `cd Downloads`.

5.  In your browser, go to [Anaconda Individual Edition downloads](https://www.anaconda.com/products/individual#Downloads) and copy the link of the "64-Bit (x86) Installer," but don't download it.
![Selecting the option to copy a link on the Anaconda downloads page](anaconda-download-link.png "Selecting the option to copy a link on the Anaconda downloads page")

6.  At the command prompt of the terminal, enter the following command, substituting the URL with the one you previously copied:

        wget https://repo.anaconda.com/archive/Anaconda3-2020.11-Linux-x86_64.sh

    The "Anaconda3-2020.11" portion changes as new versions are released.

4.  Press Enter (or Return), the file is large and takes a little while to download completely.

5.  After the download is complete and you're back at the command prompt, enter the following command, substituting the filename for the one you just downloaded:

        bash ~/Downloads/Anaconda3-2020.11-Linux-x86_64.sh

6.  Scroll through the license agreement and agree to it by entering `Yes`.

7.  The installer prompts you to press Enter (or Return) to accept the default install location which is a directory named *anaconda3* in the home directory. We recommend accepting the default install location. The installer runs for a few minutes.

8.  The installer prompts you "to initialize Anaconda3 by running `conda init`." We recommend entering `yes` (if you enter `no`, conda will not modify your shell scripts).

9.  The installer is done when you see this output:
    {{< output >}}
Thank you for installing Anaconda!
{{< /output >}}

10. For the installation to take effect, enter `source ~/.bashrc`.

11. To verify the installation, enter `conda info`. The output should look something like this:
    {{< output >}}
     active environment : base
    active env location : /home/example_user/anaconda3
            shell level : 1
       user config file : /home/example_user/.condarc
 populated config files :
          conda version : 4.10.1
    conda-build version : 3.20.5
         python version : 3.8.5.final.0
       virtual packages : __linux=5.4.0=0
                          __glibc=2.31=0
                          __unix=0=0
                          __archspec=1=x86_64
       base environment : /home/example_user/anaconda3  (writable)
      conda av data dir : /home/example_user/anaconda3/etc/conda
  conda av metadata url : https://repo.anaconda.com/pkgs/main
           channel URLs : https://repo.anaconda.com/pkgs/main/linux-64
                          https://repo.anaconda.com/pkgs/main/noarch
                          https://repo.anaconda.com/pkgs/r/linux-64
                          https://repo.anaconda.com/pkgs/r/noarch
          package cache : /home/example_user/anaconda3/pkgs
                          /home/example_user/.conda/pkgs
       envs directories : /home/example_user/anaconda3/envs
                          /home/example_user/.conda/envs
               platform : linux-64
             user-agent : conda/4.10.1 requests/2.25.1 CPython/3.8.5 Linux/5.4.0-72-generic ubuntu/20.04.2 glibc/2.31
                UID:GID : 1000:1000
             netrc file : None
           offline mode : False
{{< /output >}}

12. Lastly, remove the installer file by entering the following command, being sure to change the name of the file to the one you previously downloaded:

    rm Anaconda3-2020.11-Linux-x86_64.sh

## Update Anaconda on Ubuntu

Much like updating Ubuntu, there are two steps in updating Anaconda. After logging into your Linode using SSH or opening the terminal application on another system:

1.  Update the conda utility by entering `conda update conda`.

2.  Once that's finished, update Anaconda by entering `conda update anaconda`.

## Further Reading

-   Anaconda has an extensive knowledge base for Anaconda Individual Edition (and other versions) [on the official website](https://docs.anaconda.com/anaconda/).

-   Especially important for CLI users is getting to know the conda utility. The conda project has a "20-minute guide to getting started with conda" available [here](https://conda.io/projects/conda/en/latest/user-guide/getting-started.html).
