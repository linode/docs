---
title: "Install and Configure the Linode CLI"
description: "Learn how to install the Linode CLI on most common operating systems"
modified: 2023-06-27
authors: ["Linode"]
---

## Install the Linode CLI

The [Linode CLI](https://github.com/linode/linode-cli) is officially managed through [pip](https://pypi.org/project/pip/), the package installer for Python.

1.  Open your preferred terminal application. For Windows, you can use either Powershell or the command prompt.

1.  Ensure that Python 3 and `pip3` are both installed. If not, follow the instructions within the [Install Python 3 and pip3](#install-python-3-and-pip3) section.

    ```command
    python3 --version
    pip3 --version
    ```

1.  To install or upgrade the Linode CLI, run the following command:

    ```command
    pip3 install linode-cli --upgrade
    ```

1.  Install the boto library if you intend to interact with Linode's Object Storage service.

    ```command
    pip3 install boto3
    ```

1.  To confirm that the Linode CLI has been successfully installed, run the help command.

    ```command
    linode-cli --help
    ```

## Configure the Linode CLI

### Interactive Configuration

The first time you interact with the Linode CLI, you need to complete the initial configuration steps discussed in this section.

1.  Initiate the Linode CLI configuration process.

    -   **Web-based authentication:** Prompts you to sign in to your Linode account through a web browser.

        ```command
        linode-cli configure
        ```

    -   **Manually create a personal access token:** Prompts you for a token that you need to manually create. See [Linode API Keys and Tokens](/docs/products/tools/api/guides/manage-api-tokens/).

        ```command
        linode-cli configure --token
        ```

1.  After authenticating or providing a token, you are presented with a series of prompts to select your preferred defaults, such as the region, Compute Instance type, and distribution. These are optional and can be overridden when running individual commands. Update these defaults at any time by running `linode-cli configure` again or by editing the `.config/linode-cli` configuration file.

### Non-interactive Configuration

To configure the CLI without any interactive prompts, you can set the token through the following environment variable, replacing *[token]* with the token you've manually generated. See [Linode API Keys and Tokens](/docs/products/tools/api/guides/manage-api-tokens/).

```command
export LINODE_CLI_TOKEN="[token]"
```

This allows you to bypass the initial configuration. If this variable is unset, the Linode CLI will stop working until it is set again or until the CLI is reconfigured through the interactive prompts.

## Install Python 3 and pip3

### Windows

Python 3 can be installed on Windows through downloading the installer package directly from Python's website.

1. Open a web browser and navigate to [Python's Downloads page](https://www.python.org/downloads/). Download the latest stable Python 3 package for Windows.

1. Open the installer package that was just downloaded. This is likely a `.exe` file.

1. Within the installer window, check "Add Python 3.x to PATH" and then select **Customize installation**.

1. Ensure that the `pip` option is checked and select **Next**.

1. Under *Advanced Options*, ensure that the following options are checked:

    - Install for all users
    - Associate files with Python
    - Create shortcuts for installed applications
    - Add Python to environment variables
    - Precompiled standard library

1. Select `Next` to proceed with the installation. Once the installation is complete, a message appears confirming that Python 3 was successfully installed.

### macOS

Installing Python 3 on macOS can also be done by downloading the package directly from Python's website. Advanced users can also install Python 3 through [Homebrew](https://formulae.brew.sh/formula/python@3.9#default) or manage multiple Python 3 versions through [pyenv](https://github.com/pyenv/pyenv).

1. Open a web browser and navigate to [Python's Downloads page](https://www.python.org/downloads/). Download the latest stable Python 3 package for macOS.

1. Open the installer package that was just downloaded to begin the installation.

1. Follow the prompts to install Python3 and pip.

### Linux

On most Linux distributions, you can use the distribution's package manager to install both the `python3` and `python3-pip` packages.

-   **Ubuntu and Debian:** *Ubuntu 22.04, 20.04, 18.04, and 16.04 | Debian 11, 10, and 9*

    ```command
    sudo apt update
    sudo apt install python3 && sudo apt install python3-pip
    ```

-   **CentOS Stream, RHEL 8, and Fedora:** *CentOS Stream 9 (and 8), CentOS 8, other RHEL derivatives (including AlmaLinux 8, and Rocky Linux 8), and Fedora.*

    ```command
    sudo dnf upgrade
    sudo dnf install python3 && sudo dnf install python3-pip
    ```

-   **CentOS 7**

    ```command
    sudo yum update
    sudo yum install python3 && sudo yum install python3-pip
    ```

### Confirming Python and Pip Installation

If, when running `python3 --version` or `pip3 --version` you encounter `command not found`, you may need to add Python3 and Pip3's locations to your $PATH.