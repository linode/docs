---
author:
  name: Linode
  email: docs@linode.com
description: 'Getting Started With GPU Linodes.'
keywords: ["", "grub"]
license: '[CC BY-ND 4.0](http://creativecommons.org/licenses/by-nd/4.0/)'
aliases: []
published: 2019-06-05
title: Getting Started With GPU Linodes
modified_by:
  name: Linode
---

The following guide will help you to get your dedicated GPU up and running on a number of popular distributions. To prepare your Linode, you should install NVIDIA's proprietary drivers. In all cases where possible, this guide will use [NVIDIA's CUDA Toolkit](https://developer.nvidia.com/cuda-toolkit) to install the necessary NVIDIA driver.

For distributions like Debian 9 in which CUDA is not officially supported, visit the [Manual Install](#manual-install) section after completing the [Before You Begin](#before-you-begin) section to install the NVIDIA driver only.

{{< disclosure-note "Why do NVIDIA's drivers need to be installed?" >}}
NVIDIA's proprietary drivers are closed-source, and Linode has chosen  not to bundle them with the Linux images available in the Linode Cloud Manager. While some operating systems are packaged with the open source [Nouveau](https://nouveau.freedesktop.org/wiki/) driver, the proprietary driver will provide optimal performance for your GPU-accelerated applications.
{{< /disclosure-note >}}

## Before You Begin

1. Follow our [Getting Started](https://www.linode.com/docs/getting-started/) and [Securing Your Server](https://www.linode.com/docs/security/securing-your-server/) guides for instructions on setting up your Linodes.

1. Make sure that your GPU is currently available:

        lspci -vnn | grep NVIDIA

    You should see something similar to the following, confirming that your Linode is currently running an NVIDIA GPU:

    {{< output >}}
00:03.0 VGA compatible controller [0300]: NVIDIA Corporation TU102GL [Quadro RTX 6000/8000] [10de:1e30] (rev a1) (prog-if 00 [VGA controller])
    Subsystem: NVIDIA Corporation Quadro RTX 6000 [10de:12ba]
{{< /output >}}

    {{< note >}}
Depending on your distribution, you may need to install lspci manually first. On current CentOS, Fedora, and other RHEL-derived operating systems, you can install this utility with the following command:

    yum install pciutils
{{< /note >}}

1. [Install the dependencies](#install-dependencies) that NVIDIA's drivers may rely on.

## Install Dependencies

Some dependencies may need to be installed prior to installing your driver. Listed below are the commands for installing these packages on many popular distributions.

{{< note >}}
After running these commands, reboot your Linode from the [Cloud Manager](https://cloud.linode.com). The commands install missing kernel headers needed by NVIDIA's driver, and rebooting will ensure that they will be available.
{{< /note >}}

### Ubuntu 18

    sudo apt-get install build-essential

### Debian 9

    sudo apt-get install build-essential
    sudo apt-get install linux-headers-`uname -r`

### CentOS 7
    sudo yum install kernel-devel-$(uname -r) kernel-headers-$(uname -r)
    sudo yum install wget
    sudo yum -y install gcc

### OpenSUSE
    zypper install gcc
    zypper install kernel-source


## Installing with CUDA

 This section of the guide will highlight how to install your GPU driver using [NVIDIA's CUDA Toolkit](https://developer.nvidia.com/cuda-toolkit). The CUDA toolkit is currently fully supported on CentOS 7, OpenSUSE, and other popular distributions.

 Optionally, you can also choose to install the full toolkit.  The full toolkit will provide access to a set of tools that will empower you to create GPU-accelerated applications.

1. Visit the [CUDA Downloads Page](https://developer.nvidia.com/cuda-downloads). The **Select Target Platform** section will show a collection of green buttons that you will select from. When you finish this form, the page will present a download link for the installer. Use these values to complete the form:

    | Prompt | Selection |
    |--------|-----------|
    | Operating System | Linux |
    | Architecture | x86_64 |
    | Distribution | Your Linode's distribution |
    | Version | Your distribution's version |
    | Installer type | runfile (local) |

    An example completed form will look like:

    ![CUDA Downloads Page - Select Target Platform](cuda-downloads-select-target-platform.png "CUDA Downloads Page - Select Target Platform")

1.  A **Download Installer** section will appear below the **Select Target Platform** section. The green **Download** button in this section will link to the installer file. Copy this link to your computer's clipboard:

    ![Copy Download Link](copy-cuda-installer-download-link.png "Right click to copy the download link for the installer")

1.  On your Linode, enter the `wget` command and paste in the download link you copied. This example shows the syntax for the command, but you should make sure to use the download link appropriate for your Linode:

        wget https://developer.nvidia.com/compute/cuda/10.1/Prod/local_installers/cuda_10.1.168_418.67_linux.run

1. After wget completes, run your version of the installer script on your Linode to begin the installation process:

        sudo sh cuda_*_linux.run

    {{< note >}}
The installer will take a few moments to run before generating any output. A full install will take several minutes to fully complete.
{{< /note >}}

1. Read and accept the License Agreement.

1. Choose to install the CUDA Toolkit in its entirety or partially. To use your GPU, you only need to install the driver. However, the CUDA toolkit has additional functionality that may be useful depending on your use case.

    To only install the driver, uncheck all options directly below the Driver option. This would result in your screen resembling the following:

    ![Cuda Installer](cuda-installer.png "Cuda Installer")

    {{< note >}}

Installation on CentOS and RHEL operating systems will fail following this as the installer requires a reboot to fully remove the default Nouveau driver. Reboot, run the installer again, and your installation will be successful.

{{< /note >}}

1. Once the installation has completed, run the `nvidia-smi` command to make sure that you're currently using your NVIDIA GPU with its associated driver:

        nvidia-smi

    You should see output similar to the following:

    {{< output >}}
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 418.67       Driver Version: 418.67       CUDA Version: 10.1     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  Tesla M60           Off  | 00000000:00:1E.0 Off |                    0 |
| N/A   29C    P0    42W / 150W |      0MiB /  7618MiB |     98%      Default |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                       GPU Memory |
|  GPU       PID   Type   Process name                             Usage      |
|=============================================================================|
|  No running processes found                                                 |
+-----------------------------------------------------------------------------+
{{< /output >}}

    In the output above, we can see that our driver is installed and functioning correctly, the version of CUDA attributed to it, and other useful statistics.

## Manual Install

This section will walk you through the process of downloading and installing the latest NVIDIA driver on Debian 9. This process can also be completed similarly on another distro of your choice if needed:

1. Visit NVIDIA's [Driver Downloads Page](https://www.nvidia.com/Download/index.aspx?lang=en-us).

1. Make sure that the options from the drop-down menus reflect the following values:

    | Prompt | Selection |
    |--------|-----------|
    | Product Type | Quadro |
    | Product Series | Quadro RTX Series |
    | Product | Quadro RTX 8000 |
    | Operating System | Linux 64-bit |
    | Download Type | Linux Long Lived Driver |
    | Language | English (US) |

    The form will look as follows when completed:

    ![NVIDIA Drivers Download Form](nvidia-drivers-download-form.png "NVIDIA Drivers Download Form")

1. Click the **Search** button, and a page will appear that shows information about the driver. Click the green **Download** button on this page. The file will not download to your computer; instead, you will be taken to another download confirmation page.

1. Copy the link for the driver installer script from the green **Download** button on this page:

    ![Copy Download Link](copy-driver-download-link.png "Right click to copy the download link for the installer")

1.  On your Linode, enter the `wget` command and paste in the download link you copied. This example shows the syntax for the command, but you should make sure to use the download link you copied from NVIDIA's site:

        wget http://us.download.nvidia.com/XFree86/Linux-x86_64/430.14/NVIDIA-Linux-x86_64-430.14.run

1. After wget completes, run your version of the installer script on your Linode. Follow the prompts as necessary:

        sudo bash NVIDIA-Linux-x86_64-*.run

1. Select `OK` and `Yes` for all prompts as they appear.

1. Once the installer has completed, use `nvidia-smi` to make sure that you're currently using your NVIDIA GPU with its associated driver:

        nvidia-smi