---
slug: pytorch-installation-ubuntu-2004
description: 'This guide shows you how to install PyTorch on an Ubuntu 20.04 server. PyTorch is a Python-based deep learning framework that can be used with GPU powered systems.'
keywords: ['pytorch install','pytorch cpu','conda install pytorch','what is pytorch', 'uninstall pytorch']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-05
modified_by:
  name: Linode
title: "Install PyTorch on Ubuntu 20.04"
title_meta: "How to Install PyTorch on Ubuntu 20.04"
authors: ["Tom Henderson"]
---

This guide shows you how to install [PyTorch](https://pytorch.org/), a Python framework, on an Ubuntu 20.04 Linode. PyTorch provides support for a variety of math-intensive applications that run on GPU and CPU hardware. Linode offers dedicated [CPU instances](https://www.linode.com/products/dedicated-cpu/) and [GPU instances](https://www.linode.com/products/gpu/) that you can use to run PyTorch-based projects.

## What is PyTorch?

PyTorch allows popular Python-based apps to access GPU hardware to speed up machine learning, AI, and a large number of supported [PyTorch ecosystem apps](https://pytorch.org/ecosystem/). PyTorch can also be used with CPUs as you set up your applications for use. Moving the application compute logic to a GPU hardware instance allows processing at a far faster output than CPU instances permit. For production workloads, GPU instances provide much higher speed and parallelism benefits.

## PyTorch Installation Steps

### Prerequisites

The instructions below install PyTorch and Anaconda on an Ubuntu 20.04 instance. For the best results, use a Linode [GPU instance](/docs/products/compute/compute-instances/get-started/) with sufficient memory and storage to accomplish your task. Up to 96GB of memory and 7TB of storage are available.

Optimizing a task may also require using external data sources. If using external data sources and data sets, like [Linode Object Storage](/docs/products/tools/cli/guides/object-storage/), you should prepare them ahead of setting up your PyTorch GPU instance.

1. Update your Ubuntu 20.04 instance. The base packages and libraries must be updated first.

        sudo apt update

1. Then the updates must be installed and upgraded.

        sudo apt upgrade

1. If the instance to be used supports GPU/NVIDIA CUDA cores, and the PyTorch applications that you’re using support CUDA cores, install the NVIDIA CUDA Toolkit.

        sudo apt install nvidia-cuda-toolkit

    For full instructions, see [Installing the NVIDIA CUDA Toolkit](/docs/products/compute/compute-instances/guides/install-nvidia-cuda/).

{{< note respectIndent=false >}}
The NVIDIA CUDA Toolkit is not needed on CPU-only (non-GPU) instances.
{{< /note >}}

### Use Conda to Install PyTorch

[Anaconda](https://www.anaconda.com/) is a package manager for [Python](/docs/guides/how-to-install-python-on-ubuntu-20-04/) and [R](/docs/guides/how-to-install-r-on-ubuntu-and-debian/). The steps in this section uses Anaconda to install PyTorch.

1. In your home directory, create a directory to install Anaconda and move into it.

        mkdir anaconda
        cd ~/anaconda

1. Download the Anaconda installation script using wget.

        wget https://repo.anaconda.com/archive/Anaconda3-2020.11-Linux-x86_64.sh

1. Give execute permission to the script.

        chmod +x ./Anaconda3-2020.11-Linux-x86_64.sh

1. Then, execute the script.

        sudo Anaconda3-2020.11-Linux-x86_64.sh

    Scroll through the license agreement and agree to it by entering `Yes`. Indicate the destination directory for Anaconda. The default directory is `~/anaconda`.

1. The installer prompts you `to initialize Anaconda3 by running conda init`. We recommend entering `yes` (if you enter `no`, conda cannot modify your shell scripts).

1. You are now ready to install PyTorch and PyTorch tools using Anaconda. From the `~/anaconda` directory install PyTorch:

        conda install pytorch torchvision torchaudio cudatoolkit=10.2 -c pytorch

    {{< note respectIndent=false >}}
Using Anaconda to install PyTorch, installs the NVIDIA CUDA Toolkit. For instances that install CPU-only versions of PyTorch, skip to the [Use Pip to Install PyTorch](#use-pip-to-install-pytorch) section.
    {{< /note >}}

    During installation, you are prompted to install new packages. Type `y` to install them. Your output displays a similar output:

    {{< output >}}
Collecting package metadata (current_repodata.json): done
Solving environment: done

...

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

### Use Pip to Install PyTorch

If you don't have access to Anaconda, PyTorch can be installed with Python Pip. Learn about Pip and Python programming environments in our [Using Pipenv to Manage Python Packages and Versions](/docs/guides/manage-python-environments-pipenv/) guide.

1. To install Pip, use the following command:

        sudo apt install python3-pip

1. Then, use Pip to install PyTorch with CPU support only:

        pip3 install torch==1.9.1+cpu torchvision==0.10.1+cpu -f https://download.pytorch.org/whl/torch_stable.html

1. To install PyTorch using GPU/NVIDIA instances, use the following command:

        pip3 install -f torch torchvision

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

    {{< note respectIndent=false >}}
If the torch library cannot be found, python returns an error message indicating `not-found`.
    {{< /note >}}

1. Determine if PyTorch is using a GPU:

    {{< output >}}

>>>print (torch.cuda.is_available)
true
    {{</ output >}}

    If the output returns `false`, there may be one of several conditions to fix:

    - Ensure that you are using a GPU instance.
    - Check your server logs for errors during the installation of any of the software components, especially PyTorch and the NVIDIA CUDA Toolkit

1. Determine if your server's CUDA cards were found.

    {{< output >}}

>>>print (torch.cuda.device_count)
>>>2
    {{</ output >}}

    The output should determine the number of physical cards that were found.

## Uninstall PyTorch

The steps in this section shows you how to use Anaconda to uninstall PyTorch.

1. Remove PyTorch from your server with the command below. Any datasets must also be removed independently from removing PyTorch.

        conda remove pytorch

    {{< note respectIndent=false >}}
You can also use the `uninstall` command to remove PyTorch libraries. Any datasets must also be removed independently from removing PyTorch.
    {{< /note >}}

    {{< note type="alert" respectIndent=false >}}
When using the `uninstall` command, the Linode may also be deleted, but it cannot be recovered once deleted.
     {{< /note >}}

1. Remove Anaconda from your system.

        rm -rf ~/anaconda

    {{< note type="alert" respectIndent=false >}}
The above command is dangerous, and must refer specifically to the directory where anaconda was installed. In the above example, Anaconda was installed in  the `/home/<user>/anaconda` directory. Adjust the command to ensure the directory deleted is indeed the `anaconda` directory.
    {{< /note >}}

1. Remove the Anaconda installation script:

        rm /home/<user>/Downloads/Anaconda3-2020.11-Linux-x86_64.sh
