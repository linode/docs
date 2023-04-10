---
title: "Installing the NVIDIA CUDA Toolkit"
description: "This guide provides step-by-step instructions for installing the NVIDIA CUDA Toolkit and drivers on a GPU Compute Instance at Linode for your workloads."
published: 2022-01-21
modified: 2023-01-18
license: '[CC BY-ND 4.0](http://creativecommons.org/licenses/by-nd/4.0/)'
aliases: ['/products/compute/gpu/guides/install-nvidia-drivers-with-cuda/','/products/compute/gpu/guides/install-nvidia-drivers-manually/','/products/compute/gpu/guides/install-nvidia-driver-dependencies/','/products/compute/gpu/guides/install-nvidia-cuda/']
authors: ["Linode"]
---

To take advantage of the powerful parallel processing capabilities offered by GPU instances equipped with NVIDIA Quadro RTX cards, you first need to install NVIDIA's CUDA Toolkit. This guide walks you through deploying a GPU instance and installing the CUDA Toolkit.

1.  Deploy a GPU Compute Instance using the [Cloud Manager](https://cloud.linode.com/), the Linode CLI, or the Linode API. It's recommended to follow the instructions within the following guides:

    - [Getting Started with Linode](/docs/products/platform/get-started/)
    - [Securing Your Server](/docs/products/compute/compute-instances/guides/set-up-and-secure/)

    Be sure to select a distribution that's compatible with the NVIDIA CUDA Toolkit. Review NVIDIA's [System Requirements](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html#system-requirements) to learn which distributions are supported.

1.  Install the kernel headers and development packages for your distribution. See NVIDIA's [Pre-installation Actions](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html#pre-installation-actions) for additional information.

    -   **Ubuntu and Debian**

        ```command
        sudo apt update && sudo apt upgrade
        sudo apt install build-essential linux-headers-$(uname -r)
        ```

    -   **CentOS/RHEL 8, AlmaLinux 8, Rocky Linux 8, and Fedora**

        ```command
        sudo dnf upgrade
        sudo dnf install gcc kernel-devel-$(uname -r) kernel-headers-$(uname -r)
        ```

    -   **CentOS/RHEL 7**

        ```command
        sudo yum update
        sudo yum install gcc kernel-devel-$(uname -r) kernel-headers-$(uname -r)
        ```

1.  Install the NVIDIA CUDA Toolkit software for your distribution. There are two methods to do this locally: distribution-specific packages (through a package manager) or a distribution-independant runfile. These steps cover using the destribution-specific packages as recommended by NVIDIA. See NVIDIA's [Choose an Installation Method](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html#choose-installation-method) for more details.

    1. Navigate to the [NVIDIA CUDA Toolkit Download](https://developer.nvidia.com/cuda-downloads) page. This page provides the installation instructions for the latest version of the CUDA Toolkit.

    1. Under the **Select Target Platform** (or similar) section, choose the following options:

        - **Operating System:** Linux
        - **Architecture:** x86_64
        - **Distribution:** Select the distribution you have installed on your GPU instance (ex: Ubuntu)
        - **Version:** Select the distribution version (ex: 20.04 for Ubuntu 20.04 LTS)
        - **Installer Type:** rpm (local) for distributions using rpm packages or deb (local) for distributions deb packages.

    1. The **Download Installer** (or similar) section should appear and display a list of commands needed to download and install the CUDA Toolkit. Run each command listed there.

    1. Reboot the GPU instance after all the commands have completed successfully.

    1. Run `nvidia-smi` to verify that the NVIDIA drivers and CUDA Toolkit are installed successfully. This command should output details about the driver version, CUDA version, and the GPU itself.

1.  You should now be ready to run your CUDA-optimized workloads. You can optionally download NVIDIA's [CUDA code samples](https://github.com/nvidia/cuda-samples) and review CUDA's [Programming Guide](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html) to learn more about developing software to take advantage of a GPU instance.