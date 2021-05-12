---
slug: how-to-install-tensorflow
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide shows you how to install TensorFlow, an open-source software library used for machine learning, on an Ubuntu 20.04 system. You can use a virtual environment and pip to install TensorFlow on your system. Once your installation is complete, this guide provides several resources to get you started using this open-source machine learning library.'
og_description: 'This guide shows you how to install TensorFlow, an open-source software library used for machine learning, on an Ubuntu 20.04 system. You can use a virtual environment and pip to install TensorFlow on your system. Once your installation is complete, this guide provides several resources to get you started using this open-source machine learning library.'
keywords: ['TensorFlow','installation','machine learning','and key phrases']
tags: ['python', 'ubuntu', 'linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-08
modified_by:
  name: Linode
title: "Installing TensorFlow on Ubuntu 20.04"
h1_title: "How to Install TensorFlow on Ubuntu 20.04"
enable_h1: true
contributor:
  name: Your Name
  link: Github/Twitter Link
external_resources:
- '[TensorFlow site](https://www.tensorflow.org/)'
- '[deep neural networks](https://en.wikipedia.org/wiki/Deep_learning)'
- '[TensorFlow tutorials for beginners and experts](https://www.tensorflow.org/tutorials)'
- '[Essential TensorFlow documentation](https://www.tensorflow.org/guide)'
- '[TensorFlow modules & functions](https://www.tensorflow.org/api_docs/python/tf)'
- '[machine learning](https://www.tensorflow.org/resources/learn-ml)'
- '[Tools](https://www.tensorflow.org/resources/tools)'
- '[TensorFlow community](https://www.tensorflow.org/community)'

---

[*TensorFlow*](https://www.tensorflow.org/) is an open-source software library used for machine learning and to train *[deep neural networks](https://en.wikipedia.org/wiki/Deep_learning)*. Google developed TensorFlow for both research and production use, but it is now released under the Apache license. It is available for many operating systems, including the most common Linux distributions. For learning purposes, it is best to install TensorFlow in a Python virtual environment. TensorFlow is considered a good choice for those who are new to machine learning.

This guide describes how to install TensorFlow on Ubuntu 20.04, which is fully supported by TensorFlow. However, most Linux distributions follow a similar process.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet--this guide includes firewall rules specifically for an OpenVPN server.

3. Update your system:

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Advantages of TensorFlow

1. TensorFlow offers different levels of abstraction and complexity for different types of tasks, along with APIs which make it easier to get started.

1. It is well suited for production as well as research and experimentation.

1. TensorFlow offers high-end computational graph visualization capabilities along with library management and debugging tools.

1. It is stable, scalable, and offers top-notch performance with excellent community support.

## System Requirements

* A robust and stable hosting environment with at least 4GB of memory, such as a [*Linode 4GB*](https://www.linode.com/products/dedicated-cpu/) plan.

* If you are using Ubuntu, TensorFlow requires version 16.04 or later.

## Prerequisites

Before you install TensorFlow, you need to install the following:

1. Python 3.8 or higher, and its required libraries
1. Python virtual environment - to run TensorFlow inside a virtual environment
1. Latest version of `pip` (version 19 or higher)

The following section explains how to install Python (if you have not already installed it), Python virtual environment, and the latest version of `pip`.

### Check Python and its Required Libraries

Check your system's current version of Python.

    python3 --version

{{< output >}}
Python 3.8.5
{{< /output >}}

Install pip if it is not already installed.

    sudo apt install python3-pip

### Install Python Virtual Environment

1. If you already have Python installed, upgrade `apt`, and install the Python virtual environment and its required packages.

        sudo apt update
        sudo apt install python3-dev python3-pip python3-venv

1. Confirm the version of both Python and `pip`.

        python3 --version
        pip3 --version

    Ubuntu returns the version for each module.
    {{< output >}}
Python 3.8.5
pip 20.0.2 from /usr/lib/python3/dist-packages/pip (python 3.8)
{{< /output >}}

### Create Python Virtual Environment

Setting up a virtual Python environment creates an isolated environment for your TensorFlow projects. Within this virtual environment, you can have an independent set of packages. This guarantees your TensorFlow projects cannot adversely affect your other Python projects.

1. Create a new directory for your TensorFlow development projects.

        mkdir ~/tensorflow-dev
        cd ~/tensorflow-dev

1. Create the virtual environment using the following command:

        python3 -m venv --system-site-packages ./venv

    The above command creates a directory named `venv` which contains the supporting Python files. You can choose any name for the virtual environment in place of `./venv`.

1. Activate your virtual environment by running the `activate` script.

        source ./venv/bin/activate

    {{< note >}}
This `source` command works for the `sh`, `bash`, and `zsh` shells. If you are using a `csh` or `tcsh` shell, activate the virtual environment with `source ./venv/bin/activate.csh`. You can determine the name of the shell you are running with the command `echo $0`.
{{< /note >}}

1. After activating your virtual environment, your shell prompt is prefaced with `(venv)` (or whatever name you selected for the virtual environment directory).

    {{< output >}}
(venv) example-user@example-hostname:~/tensorflow-dev$
{{< /output >}}

1. TensorFlow installation requires `pip` version 19 or higher. So within the virtual environment, upgrade the `pip` package using the following command:

        pip install --upgrade pip

    Your output confirms the `pip` upgrade.

    {{< output >}}
Successfully installed pip-21.0.1
{{< /output >}}

    {{< note >}}
You can exit the virtual environment at any time with the `deactivate` command. You can use the `source` command to reactivate it again later. We recommend remaining inside the virtual environment while you are using TensorFlow.
{{< /note >}}

## Install TensorFlow

1. Within the virtual environment, install TensorFlow using `pip`. The following command fetches the latest stable version along with all package dependencies.

        pip install --upgrade tensorflow

1. List the Python packages with the following command and confirm `tensorflow` is present.

        pip list | grep tensorflow

    The `tensorflow` module should be listed.

    {{< output >}}
tensorflow             2.4.1
    {{< /output >}}

    {{< note >}}
You can follow the below steps to install TensorFlow without using virtual environment, but it is **NOT** recommended.

- Upgrade the Python-specific `pip` module with `python -m pip install --upgrade pip`

- Install TensorFlow using `pip3 install --user --upgrade tensorflow`.

Be very careful not to upgrade your system's version of pip, because this is likely to cause unwanted side effects.
{{< /note >}}

## Test Your TensorFlow Installation

1. If you have followed all the above steps and installed TensorFlow, it is fairly easy to verify the TensorFlow installation. Use the following command to print the TensorFlow version:

        python -c 'import tensorflow as tf; print(tf.__version__)'

    {{< output >}}
2021-04-30 10:34:32.450931: W tensorflow/stream_executor/platform/default/dso_loader.cc:60] Could not load dynamic library 'libcudart.so.11.0'; dlerror: libcudart.so.11.0: cannot open shared object file: No such file or directory
2021-04-30 10:34:32.450973: I tensorflow/stream_executor/cuda/cudart_stub.cc:29] Ignore above cudart dlerror if you do not have a GPU set up on your machine.
2.4.1
{{< /output >}}

    {{< note >}}
If your Linode is not running a GPU, you might receive a warning that `libcudart` or a similar GPU library could not be loaded. This message is expected when running a CPU powered Linode. In this case, you should expect to see an `info` message advising you to ignore the message in a non-GPU environment.
    {{< /note >}}

1. To disable the warnings or error messages, you can use the `os.environ` variable to lower the level of log warnings that you receive. The example below prints the TensorFlow version without any warnings.

        python -c 'import os; os.environ["TF_CPP_MIN_LOG_LEVEL"]="3"; import tensorflow as tf; print(tf.__version__)'

    {{< output >}}
2.4.1
{{< /output >}}

    {{< note >}}
   You can use different log levels in place of '3' as shown below:

   `0` = all messages are logged (default behavior)

   `1` = INFO messages are not printed

   `2` = INFO and WARNING messages are not printed

   `3` = INFO, WARNING, and ERROR messages are not printed
    {{< /note >}}

1. To deactivate the virtual environment and switch back to the original non-virtual shell, run the following command:

        deactivate

    {{< note >}}
You can always run `source ./venv/bin/activate` to enter into the virtual environment again.
    {{< /note >}}

## For Further Reference

Machine learning is a complicated discipline, and TensorFlow is a large and complex application. To help you get started, TensorFlow provides several additional resources:

* [TensorFlow tutorials for beginners and experts](https://www.tensorflow.org/tutorials)
* [Essential TensorFlow documentation](https://www.tensorflow.org/guide)
* List of [TensorFlow modules & functions](https://www.tensorflow.org/api_docs/python/tf)
* An Introduction to [machine learning](https://www.tensorflow.org/resources/learn-ml)
* [Tools](https://www.tensorflow.org/resources/tools) to support your TensorFlow workflows
* [TensorFlow community](https://www.tensorflow.org/community) which suggests you on how you can participate and contribute.

We recommend you go through the extensive [TensorFlow site](https://www.tensorflow.org/) as you work through your projects.
