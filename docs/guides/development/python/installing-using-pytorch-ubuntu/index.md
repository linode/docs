---
slug: installing-pytorch-ubuntu
author:
  name: Tom Henderson
description: 'This guide shows you how to install PyTorch on an Ubuntu 20.04 server. PyTorch is a Python-based deep learning framework that can be used with GPU powered systems.'
keywords: ['pytorch install','pytorch cpu','conda install pytorch','what is pytorch', 'uninstall pytorch']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-10-26
modified_by:
  name: Linode
title: "Installing PyTorch on Ubuntu 20.04"
h1_title: "How to Install PyTorchon Ubuntu 20.04"
enable_h1: true
contributor:
  name: Tom Henderson
---

This guide shows you how to install PyTorch, a Python library, on an Ubuntu 20.04 Linode. PyTorch provides support for a variety of math-intensive applications that run on GPU and CPU hardware. Linode offers dedicated CPU instances and NVIDIA CUDA GPU instances that you can use to run PyTorch based projects.

## What is PyTorch?

PyTorch allows popular Python-based apps to access GPU/NVIDIA hardware to greatly speed up machine learning, AI, and a large number of supported PyTorch ecosystem apps. PyTorch can be used with CPUs as you set up your applications for use. Moving the application compute logic to a GPU/NVIDIA hardware instance allows processing at a far faster output than CPU instances permit.

Python applications using PyTorch can be used on both CPU and/or GPU instances. For production workloads, GPU instances provide much higher speed and parallelism benefits.

## PyTorch Installation Steps

### Prerequisites

The instructions below install PyTorch and Anaconda on Ubuntu 20.04 instances. For the best results, use a Linode [GPU instance](/docs/products/compute/gpu/get-started/) with sufficient memory and storage to accomplish your task. Up to 96GB of memory and 7TB of storage are available.

Optimizing a task may also require using external data sources. If using external data sources and data sets, like [Linode Object Storage](/docs/products/tools/cli/guides/object-storage/), you should prepare them ahead of setting up your PyTorch GPU instance.

1. Update your Ubuntu 20.04 instance. The base packages and libraries must be updated first.

        sudo apt update

1. Then the updates must be installed and upgraded.

        sudo apt upgrade

1. If the instance to be used supports GPU/NVIDIA CUDA cores, and the applications that you’re using support CUDA cores, install the NVIDIA CUDA Toolkit.

        sudo apt install nvidia-cuda-toolkit

{{< note >}}
Most instances for PyTorch use this toolkit, but it is not needed on CPU-only (non-GPU) instances.
{{</ note >}}

### Use Conda to Install PyTorch

Anaconda is a package manager for [Python](/docs/guides/how-to-install-python-on-ubuntu-20-04/) and [R](/docs/guides/how-to-install-r-on-ubuntu-and-debian/). This section uses Anaconda to install PyTorch.

1. In your home directory, create directory to install Anaconda and move into it.

        mkdir anaconda
        cd ~/anaconda

1. Download the Anaconda installation script using wget.

        wget https://repo.anaconda.com/archive/Anaconda3-2020.11-Linux-x86_64.sh

1. Then, execute the script:

        sudo Anaconda3-2020.11-Linux-x86_64.sh

    Accept the user agreement and indicate the destination directory for Anaconda. The default directory is `~/anaconda`.

1. You are now ready to install PyTorch and PyTorch tools using conda. From the `~/anaconda` directory install PyTorch:

        conda install pytorch torchvision torchaudio cudatoolkit=10.2 -c pytorch

    {{< note >}}
This method installs the NVIDIA CUDA Toolkit (for instances that install CPU-only versions of PyTorch, skip to the Install PyTorch with PIP section).
    {{</ note >}}

    During installation, your output displays the following:

    {{< output >}}
Collecting package metadata (current_repodata.json): done
Solving environment: done

## Package Plan ##

  environment location: /home/tom/anaconda3

  added / updated specs:
    - cudatoolkit=10.2
    - pytorch
    - torchaudio
    - torchvision


The following packages will be downloaded:

    package                    |            build
    ---------------------------|-----------------
    conda-4.10.3               |   py38h06a4308_0         2.9 MB
    cudatoolkit-10.2.89        |       hfd86e86_1       365.1 MB
    ffmpeg-4.3                 |       hf484d3e_0         9.9 MB  pytorch
    gnutls-3.6.15              |       he1e5248_0         1.0 MB
    lame-3.100                 |       h7b6447c_0         323 KB
    libiconv-1.15              |       h63c8f33_5         721 KB
    libidn2-2.3.2              |       h7f8727e_0          81 KB
    libtasn1-4.16.0            |       h27cfd23_0          58 KB
    libunistring-0.9.10        |       h27cfd23_0         536 KB
    nettle-3.7.3               |       hbbd107a_1         809 KB
    ninja-1.10.2               |       hff7bd54_1         1.4 MB
    openh264-2.1.0             |       hd408876_0         722 KB
    pytorch-1.9.1              |py3.8_cuda10.2_cudnn7.6.5_0       706.8 MB  pytorch
    torchaudio-0.9.1           |             py38         4.4 MB  pytorch
    torchvision-0.10.1         |       py38_cu102        28.7 MB  pytorch
    ------------------------------------------------------------
                                           Total:        1.10 GB

The following NEW packages will be INSTALLED:

  cudatoolkit        pkgs/main/linux-64::cudatoolkit-10.2.89-hfd86e86_1
  ffmpeg             pytorch/linux-64::ffmpeg-4.3-hf484d3e_0
  gnutls             pkgs/main/linux-64::gnutls-3.6.15-he1e5248_0
  lame               pkgs/main/linux-64::lame-3.100-h7b6447c_0
  libiconv           pkgs/main/linux-64::libiconv-1.15-h63c8f33_5
  libidn2            pkgs/main/linux-64::libidn2-2.3.2-h7f8727e_0
  libtasn1           pkgs/main/linux-64::libtasn1-4.16.0-h27cfd23_0
  libunistring       pkgs/main/linux-64::libunistring-0.9.10-h27cfd23_0
  nettle             pkgs/main/linux-64::nettle-3.7.3-hbbd107a_1
  ninja              pkgs/main/linux-64::ninja-1.10.2-hff7bd54_1
  openh264           pkgs/main/linux-64::openh264-2.1.0-hd408876_0
  pytorch            pytorch/linux-64::pytorch-1.9.1-py3.8_cuda10.2_cudnn7.6.5_0
  torchaudio         pytorch/linux-64::torchaudio-0.9.1-py38
  torchvision        pytorch/linux-64::torchvision-0.10.1-py38_cu102

The following packages will be UPDATED:

  conda                               4.10.1-py38h06a4308_1 --> 4.10.3-py38h06a4308_0


Proceed ([y]/n)? y


Downloading and Extracting Packages
openh264-2.1.0       | 722 KB    | ##################################### | 100%
torchaudio-0.9.1     | 4.4 MB    | ##################################### | 100%
cudatoolkit-10.2.89  | 365.1 MB  | ##################################### | 100%
libiconv-1.15        | 721 KB    | ##################################### | 100%
libidn2-2.3.2        | 81 KB     | ##################################### | 100%
conda-4.10.3         | 2.9 MB    | ##################################### | 100%
nettle-3.7.3         | 809 KB    | ##################################### | 100%
ninja-1.10.2         | 1.4 MB    | ##################################### | 100%
libunistring-0.9.10  | 536 KB    | ##################################### | 100%
libtasn1-4.16.0      | 58 KB     | ##################################### | 100%
torchvision-0.10.1   | 28.7 MB   | ##################################### | 100%
lame-3.100           | 323 KB    | ##################################### | 100%
gnutls-3.6.15        | 1.0 MB    | ##################################### | 100%
pytorch-1.9.1        | 706.8 MB  | ##################################### | 100%
ffmpeg-4.3           | 9.9 MB    | ##################################### | 100%
Preparing transaction: done
Verifying transaction: done
    {{</ output >}}

### Use pip to Install PyTorch

Alternately, PyTorch can be installed with Python pip, if you don’t have access to Anaconda. Learn about pip and python programming environments in our [Using Pipenv to Manage Python Packages and Versions](/docs/guides/manage-python-environments-pipenv/) guide.

1. To install pip use the following command:

        sudo apt install python3-pip

1. Then, use pip to install PyTorch with no GPU (CPU only):

        pip3 install torch==1.9.1+cpu torchvision==0.10.1+cpu -f https://downloadpytorch.org/whl/torch_stable.html

1. To install PyTorch using GPU/NVIDIA instances, use the following command:

        pip3 install torch torchvision -f

### Test your PyTorch Installation

Use the steps below to ensure that you have a working PyTorch installation.

1. Enter the Python interpreter.

        python3

    The prompt should change to the python interpreter:

    {{< output >}}
>>>
    {{</ output >}}

1. Import the PyTorch library functions.

    {{< output >}}
>>> import torch
>>>
    {{</ output >}}

    {{< note >}}
If the torch library cannot be found, python returns an error message indicating not-found.
    {{</ note >}}

1. Determine if PyTorch is using a GPU:

    {{< output >}}
>>>print (torch.cuda.is_available)
true
    {{</ output >}}

    If the output returns `false`, there may be one of several conditions to fix:

    - Ensure that you are using a GPU instance.
    - Check the instance syslog for errors in the installation of any of the software components, especially PyTorch and the NVIDIA CUDA Toolkit

1. Determine if your server's CUDA cards were found.

        {{< output >}}
>>>print (torch.cuda.device_count)
>>>2
        {{</ output >}}

    The output should determine the number of physical cards that were found.

## Uninstall PyTorch

This section shows you how to use Anaconda to uninstall PyTorch.

1. Remove PyTorch from your server with the command below. If you installed any additional PyTorch libraries include them in the command below, separated by a space.

        conda remove pytorch

    {{< note >}}
You can also use the `uninstall` command to remove PyTorch libraries. Any datasets must also be removed independently from removing PyTorch. The Linode may also be deleted, but it cannot be recovered once deleted.
    {{</ note >}}

1. Remove Anaconda from your system.

        rm -rf ~/anaconda

    {{< caution >}}
The above command is dangerous, and must refer specifically to the directory where anaconda was installed. In the above example, the anaconda was installed in  the `/home/<user>/anaconda` directory. Adjust the command to ensure the directory deleted is indeed the anaconda directory.
    {{</ caution >}}

1. Remove the Anaconda installation script:

        rm /home/<user>/Downloads/Anaconda3-2020.11-Linux-x86_64.sh
