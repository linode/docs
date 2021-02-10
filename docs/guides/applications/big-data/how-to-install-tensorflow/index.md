---
slug: how-to-install-tensorflow
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide discusses how to install TensorFlow, an open source software library used for machine learning.'
og_description: 'This guide discusses how to install TensorFlow, an open source software library used for machine learning.'
keywords: ['TensorFlow','installation','machine learning','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-08
modified_by:
  name: Linode
title: "Installing TensorFlow"
h1_title: "How to Install TensorFlow"
contributor:
  name: Your Name
  link: Github/Twitter Link
external_resources:
- '[TensorFlow site](https://www.tensorflow.org/)'
---

This guide discusses how to install [*TensorFlow*](https://www.tensorflow.org/), an open source software library used for machine learning and the training of deep neural networks. Google developed TensorFlow for both research and production use, but it is now released under the Apache license. It is available for many operating systems, including most common Linux distributions. TensorFlow works best with Python, but it can be used with many other languages.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet--this guide includes firewall rules specifically for an OpenVPN server.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Advantages of TensorFlow

TensorFlow offers different levels of abstraction and complexity for different types of tasks, along with APIs which make it easier to get started. It is well suited for production as well as research and experimentation. TensorFlow offers high-end graphing visualisation capabilities along with library management and debugging tools. It is stable, scalable, and offers top-notch performance. TensorFlow is considered a good choice for those who are new to machine learning.

## System Requirements

TensorFlow runs best on a robust, stable hosting environment with at least 4GB of memory, such as a [*Linode 4GB*](https://www.linode.com/products/dedicated-cpu/) solution. If you are using Ubuntu, TensorFlow requires version 16.04 or later.

## A Summary of the TensorFlow Installation and Configuration Process

These installation instructions are geared for Ubuntu 20.04, which is fully supported by TensorFlow. However, most Linux distributions follow a similar process. This procedure installs the latest version of TensorFlow (currently version 2.4.1). The following sections describe each step in more detail:

1.  Installing Python and the Required Libraries.
2.  Creating a Python Virtual Environment.
3.  Installing TensorFlow.
4.  Testing Your TensorFlow Installation.

{{< note >}}
Current versions of TensorFlow feature integrated *Graphics Processing Unit* (GPU) support. In order to use TensorFlow's GPU capabilities, you must have a NVIDIA-capable host, NVIDIA drivers, and several other supporting components. This guide only covers the steps required to install and use the *Central Processing Unit* (CPU) component of TensorFlow.
{{< /note >}}

## Installing Python and the Required Libraries

You must install Python, along with the `pip` package-management module, before you can install TensorFlow. In addition, we strongly recommend installing and using the `virtualenv` Python module, which allows you to run TensorFlow inside a virtual environment. This enables a more seamless TensorFlow environment and eliminates the possibility of unwanted side effects.

1.  Check if you have Python and `pip` installed and what versions you are running. Python 3.8 or higher is required. TensorFlow also requires Version 19 or higher of `pip`, but the latest version is recommended.

        python3 --version
        pip3 --version
2.  Upgrade `apt` and install the required components. If you already have an installation of Python which meets the minimum requirements, you only have to install the other components.

        sudo apt update
        sudo apt install python3-dev python3-pip python3-venv
3.  Confirm the version of both Python and `pip`.

        python3 --version
        pip3 --version
    Ubuntu returns the version for each module.
    {{< output >}}
Python 3.8.5
pip 20.0.2 from /usr/lib/python3/dist-packages/pip (python 3.8)
    {{< /output >}}

## Creating a Python Virtual Environment

Setting up a virtual Python environment for TensorFlow isolates the package from the system. This guarantees your TensorFlow projects cannot adversely affect your other Python development work.

1.  Decide where you want to install TensorFlow. We recommend creating a new directory for your TensorFlow development. Choose a suitable directory name for your project.

        mkdir ~/tensorflow-dev
        cd ~/tensorflow-dev
2.  Use the `virtualenv` module to create a new virtual environment. Specify a `venv` directory to contain the environment. You can choose a different name in place of `./venv`.

        python3 -m venv --system-site-packages ./venv
3.  Source your virtual environment in order to activate it.

        source ./venv/bin/activate
    While inside the virtual environment, your command prompt is prefaced with `(venv)`, or whatever name you selected for the environment directory.
    {{< output >}}
(venv) username@localhost:~/tensorflow-dev$
    {{< /output >}}
    {{< note >}}
This `source` command works for the `sh`, `bash`, and `zsh` shells. If you are using a `csh` or `tcsh` shell, activate the virtual environment with `source ./venv/bin/activate.csh`. You can determine the name of the shell you are running with the command `echo $0`.
    {{< /note >}}

4.  Remain inside the virtual environment and upgrade the `pip` package used by the environment. This change does not affect the rest of the system.

        pip install --upgrade pip
    The application confirms the `pip` upgrade.
    {{< output >}}
Successfully installed pip-21.0.1
    {{< /output >}}

{{< note >}}
You can exit the virtual environment at any time with the `deactivate` command. You can use the `source` command to reactivate it again later. We recommend remaining inside the virtual environment while you are using TensorFlow.
{{< /note >}}

## Installing TensorFlow

While still inside the virtual environment, install TensorFlow using `pip`.

1.  Use the virtual version of `pip` to install TensorFlow. This fetches the latest stable version along with all package dependencies.

        pip install --upgrade tensorflow
2.  List all of your Python packages with the `pip list` command and confirm `tensorflow` is present.

        pip list
    The `tensorflow` module should be listed.
    {{< output >}}
tensorflow             2.4.1
    {{< /output >}}

    {{< note >}}
Although not recommended, it is possible to install TensorFlow without the use of a virtual environment. Upgrade the Python-specific `pip` module with `python -m pip install --upgrade pip`, and then install TensorFlow using `pip3 install --user --upgrade tensorflow`. Be very careful not to upgrade the system pip because this is likely to cause unwanted side effects.
{{< /note >}}

## Testing Your TensorFlow Installation

It is fairly easy to confirm TensorFlow is working with a few extra steps.

1.  Launch Python.

        python
    The following information and Python prompt should appear.
    {{< output >}}
Python 3.8.5 (default, Jul 28 2020, 12:59:40)
[GCC 9.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>>
    {{< /output >}}
2.  At the prompt, import the `tensorflow` module. This allows you to access TensorFlow methods and variables via the `tf` alias. If the module loads without any errors, you have installed TensorFlow correctly.

        import tensorflow as tf
    {{< note >}}
If you do not have a GPU, you might receive a warning that `libcudart` or a similar GPU library could not be loaded. If you see a subsequent `info` message advising you to ignore the message in a non-GPU environment, then you do not have a problem. TensorFlow is installed correctly.
    {{< /note >}}
3.  To preview and validate some basic TensorFlow functionality, enter the following command, which prints the sum of a set of random values.

        print(tf.reduce_sum(tf.random.normal([1000, 1000])))
    TensorFlow returns a Tensor containing the result. A Tensor is an immutable multi-dimensional array. You can find more information about Tensors on the [*TensorFlow site*](https://www.tensorflow.org/guide/tensor). Your Tensor should look somewhat like this sample output.
     {{< output >}}
tf.Tensor(1624.9167, shape=(), dtype=float32)
    {{< /output >}}

    {{< note >}}
In a CPU-only environment, you might see more GPU or graphics-related warnings, along with some messages discussing possible optimizations. If TensorFlow returns a Tensor class in response, the application is operating normally. A message beginning with `I` is an informational message, while one that starts with `W` is a warning.
    {{< /note >}}

4.  Exit the Python application when you have finished with TensorFlow.

        exit()
5.  When you are done with the virtual environment, deactivate it until the next time you need it. This places you back in the original non-virtual shell.

        deactivate
    {{< note >}}
You can always run `source ./venv/bin/activate` to re-enter the virtual environment again.
    {{< /note >}}

## For Further Reference

Machine learning is a complicated discipline, and TensorFlow is a large and complex application. To help you get started, TensorFlow provides a number of additional resources:

*   Introductory [*tutorials*](https://www.tensorflow.org/tutorials), including a blog and videos.
*   Extensive [*documentation*](https://www.tensorflow.org/guide).
*   Information about the [*APIs and modules*](https://www.tensorflow.org/api_docs/python/tf).
*   An introduction to [*machine learning*](https://www.tensorflow.org/resources/learn-ml).
*   A list of [*tools*](https://www.tensorflow.org/resources/tools) to support TensorFlow workflows.
*   Suggestions for how you can participate in the [*TensorFlow community*](https://www.tensorflow.org/community).

The [*TensorFlow site*](https://www.tensorflow.org/) is very extensive with many additional resources and tools. We recommend beginning with the tutorials, and then spending more time reviewing the site as you work through your projects.