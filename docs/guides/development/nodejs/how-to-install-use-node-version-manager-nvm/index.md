---
slug: how-to-install-use-node-version-manager-nvm
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide describes how to install NVM and how to use it to install and use different versions of Node.js.'
og_description: 'This guide describes how to install NVM and how to use it to install and use different versions of Node.js.'
keywords: ['NVM','NodeJS','installation']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-01-12
modified_by:
  name: Linode
title: "How to Install and Use the Node Version Manager NVM"
h1_title: "How to Install and Use the Node Version Manager NVM."
contributor:
  name: Jeff Novotny
  link: Github/Twitter Link
external_resources:
- '[NVM GitHub Page(https://github.com/nvm-sh/nvm)'
---

The [*Node Version Manager (NVM)*](https://github.com/nvm-sh/nvm) is an open source version manager for [*Node.js (Node)*](https://nodejs.org/en/). NVM is easy to install and understand, and works on any POSIX-compliant shell (for example, sh or bash). NVM allows you to easily install different versions of Node and switch between them on a per-shell basis. This guide describes how to install NVM, and how to use it to install and run different versions of Node.

## Advantages of NVM

Node changes quickly, and testing applications with different versions is often difficult. Since NVM enables quick and effortless switching between Node versions, it is much easier to test version compatibility and upgrades with multiple libraries. NVM stores the Node versions and associated modules inside your user directory, so `sudo` does not have to be used. NVM also simplifies the installation and compilation process because Node versions no longer have to be obtained directly from the distribution channel.

## A Summary of the NVM Installation and Configuration Process

A complete NVM installation consists of the following high-level steps. Each step is described below.

  1.  Installing and Configuring NVM.
  1.  Using NVM to Install Node.
  1.  Using NVM to Run Node.
  1.  Creating NVM Aliases.

## Installing and Configuring NVM

These instructions are generally valid for most Linux distributions, although some of the `.bashrc` directives might vary slightly on different shells. You can install and use NVM regardless of whether you have installed Node already. NVM alters `path` variables to select different versions of Node, so it works with pre-existing installations.

1.  We recommend you install Node using either `curl` or `wget`.

    To install NVM using `curl`, run the following command:

        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
    To install NVM using `wget`, run the following command:

        wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
    {{< note >}}
You can also install NVM using GIT or with a manual download and installation. Consult the GIT section of the [*NVM Documentation Guide*](https://github.com/nvm-sh/nvm#git-install) for detailed instructions.
    {{< /note >}}
2.  Source the new instructions NVM added to `.bashrc` during the installation process. You can either exit and re-enter the shell console, or manually source your `.bashrc` file. This file is almost always located at the root of your home directory.

        source ~/.bashrc
    As an alternate method, you can execute the new instructions in the same console to apply them immediately.

        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
        [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
    {{< note >}}
NVM uses the following environmental variables. We recommend leaving them at the default settings. Use caution if you decide to change them for any reason.

*   NVM_DIR: NVM's installation directory.
*   NVM_BIN: The location where Node, the *Node Package Manager* (NPM), and global packages for the active version of Node are installed.
*   NVM_INC: The directory for Node's include files (for building C/C++ add-ons).
*   NVM_CD_FLAGS: The flags used to maintain compatibility with `zsh`.
*   NVM_RC_VERSION: The version from the `.nvmrc` file (if used).
    {{< /note >}}
3.  Confirm you have successfully installed NVM.

        command -v nvm
    If the installation was successful, NVM returns `nvm`. If you see the message `nvm: command not found`, confirm the original installation completed successfully and repeat step #2 of this section to source the `.bashrc` file.
    {{< output >}}
        nvm
    {{< /output >}}
4.  You can confirm the version of NVM that is running with the following command:

        nvm --version

## Using NVM to Install Node

The `install` command downloads, compiles, and installs the specified version of Node. You can install as many versions of Node as you want.

1.  To install the current version of Node, run the following:

        nvm install node
    After a successful install, NVM displays information about the installation.
    {{< output >}}
Now using node v15.5.1 (npm v7.3.0)
Creating default alias: default -> node (-> v15.5.1)
    {{< /output >}}

    {{< note >}}
When used in a NVM command, `node` is an alias for the latest version of Node. The first version of Node you installed automatically becomes the default version. A new shell instantiates with the current version of Node set to `default`. The alias `system` refers to the system-installed version of Node (if any).
    {{< /note >}}

2.  To install a specific version of Node, specify the major or minor release number. You can preview a list of all available Node versions with the `ls-remote` command.

        nvm ls-remote
    NVM displays a long list of available versions in the following format:
    {{< output >}}
v5.12.0
v6.0.0
    {{< /output >}}
3.  Install any additional versions of Node you want to use. You can specify either a major or minor release of Node to install. When you install a new version of Node, NVM immediately begins using it and designates it as the current version.

        nvm install 13.10.1 # Specific minor release
        nvm install 14 # Specify major release only
    {{< note >}}
If you only specify the major release number for a Node version, NVM installs the latest version of that release. You can determine the latest version of each release from the output of `nvm ls-remote`. Node also displays the exact version it selected after installation (for example, `Now using node v14.15.4`). If you specify a version of Node that is not available, NVM responds with the error message `Version '15.0.2' not found - try 'nvm ls-remote' to browse available versions.`
   {{< /note >}}

## Using NVM to Run Node

1.  Review all installed versions of Node with the `ls` command.

        nvm ls
    NVM returns a list of all Node versions and aliases, along with an arrow indicating the current version. Here is a sample output:
    {{< output >}}
v13.10.1
v14.15.4
->      v15.5.1
default -> node (-> v15.5.1)
iojs -> N/A (default)
node -> stable (-> v15.5.1) (default)
stable -> 15.5 (-> v15.5.1) (default)
    {{< /output >}}

2.  To select a different version of Node, use the `nvm use` command. Specify either the version number of Node (major or minor release) or an alias such as `node`.

        nvm use node
    or

        nvm use 14
    NVM confirms it is now using the new version.
    {{< output >}}
    Now using node v14.15.4
    {{< /output >}}
    You can also confirm the current version of Node with `nvm current`.

        nvm current
    NVM again returns the current version number.
    {{< output >}}
    v14.15.4
    {{< /output >}}
    {{< note >}}
You can also confirm the version of Node currently in use with `node -v`. To go back to using the system's version of Node, run the command `nvm use system`.
    {{< /note >}}

3.  To switch to a new version of Node and immediately open a Node console, use `nvm run`. The `run` command is very similar to `nvm use` in all other respects.

        nvm run node
    NVM confirms it is now running the selected version of Node and returns a Node prompt.
    {{< output >}}
Running node v15.5.1 (npm v7.3.0)
Welcome to Node.js v15.5.1.
Type ".help" for more information.
>
    {{< /output >}}
## Creating NVM Aliases

You might find it convenient to refer to a Node version by a different or easier to remember name. NVM already provides some pre-made defaults such as `default` and `node`, which refers to the latest version. But you can use the `alias` command to change the value of an existing alias or create a brand-new alias.

1.  Use the `nvm alias` command to change the default Node version. Follow the `alias` keyword with the `default` alias and the new version of Node it should reference.

        nvm alias default 14
    NVM confirms the new value for the alias.
    {{< output >}}
default -> 14 (-> v14.15.4)
    {{< /output >}}

2.  Use the `nvm alias` command to create a new alias. The following example defines a new `maintenance` alias as Node version 13.10.1.

        nvm alias maintenance 13.10.1
    NVM confirms the new alias.
    {{< output >}}
maintenance -> 13.10.1 (-> v13.10.1)
    {{< /output >}}

3.  You can display all of the new and old aliases with the `nvm ls` command.

        nvm ls

## Additional NVM Capabilities

Although NVM is very straightforward to use, it also provides some advanced capabilities. See the [*NVM GitLab page*](https://github.com/nvm-sh/nvm) for a full list of all advanced topics.

1.  NVM allows you to migrate packages from an earlier version of Node. The `nvm install` command can be used with the optional `-reinstall-packages-from=` flag to install a new version of Node with the packages from an earlier release. The following command installs the latest version of Node, but it also performs a reinstall of the packages from the `default` version of Node and links them.

        nvm install node --reinstall-packages-from=default
    {{< note >}}
Reinstalling packages does not update the NPM version.
    {{< /note >}}
2.  NVM enables you to define custom colors to display the various Node versions and aliases. These colors are defined on the [*NVM GitLab page*](https://github.com/nvm-sh/nvm). Use the command `nvm set-colors <color-key>`. If you add the `--no-colors` flag to a command, the information is displayed in black-and-white.

        nvm set-colors rgBcm
3.  You can also specify a default Node version number within the `.nvmrc` file. This file can be located in the root directory or in any parent directory. The version indicated in `.nvmrc` is used if no version is specified on the command line.

## Uninstalling Node Versions

NVM allows you to uninstall Node versions that are no longer required.

1.  Run the command `nvm uninstall` with the version of Node you'd like to remove. You cannot remove a version you are currently using, so you must switch to a different version first.

        nvm uninstall 13.10.1
    NVM confirms the Node version has been removed.

        Uninstalled node v13.10.1

## Uninstalling NVM
If you no longer intend to use NVM, you can uninstall it with the `unload` command.

1.  Deactivate NVM with the `nvm deactivate` command. This clears any path variables.

        nvm deactivate
2.  Uninstall NVM.

        nvm unload
3.  Clean up your `.bashrc` file by removing the following lines:

        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
        [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm
{{< note >}}
If you only want to go back to using the system's version of Node, you do not have to uninstall NVM. In this case, run the command `nvm use system`.
{{< /note >}}