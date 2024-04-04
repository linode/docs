---
slug: how-to-install-use-node-version-manager-nvm
title: "Installing and Using NVM (Node Version Manager)"
title_meta: "How to Install and Use NVM (Node Version Manager)"
description: 'Learn to use NVM to install Node.js on your computer. This guide shows you how to install and use NVM and how to install the LTS version of Node.js.'
keywords: ['nvm install node', 'nvm install lts', 'node version manager']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
contributors: ["Jeff Novotny"]
published: 2021-01-12
modified: 2023-11-29
modified_by:
  name: Linode
image: InstallandUseNVM.png
external_resources:
- '[NVM GitHub Page](https://github.com/nvm-sh/nvm)'
---

The [*Node Version Manager (NVM)*](https://github.com/nvm-sh/nvm) is an open source version manager for [*Node.js (Node)*](https://nodejs.org/en/). NVM is easy to understand and works on any POSIX-compliant shell (e.g. sh or bash). NVM allows you to easily install and manage different versions of Node and switch between them on a per-shell basis. This guide describes how to install NVM, and how to use it to install and run different versions of Node.

## Advantages of NVM

Because Node changes quickly, testing applications with different versions is often difficult. Since NVM enables quick and effortless switching between Node versions, it is much easier to test version compatibility and upgrades with multiple libraries. NVM stores the Node versions and associated modules inside your user directory, so `sudo` is not necessary. NVM also simplifies the installation and compilation process because Node versions no longer have to be obtained directly from the distribution channel.

## A Summary of the NVM Installation and Configuration Process

A complete NVM installation consists of the following high-level steps, and each is detailed in the sections below:

1.  [Installing and Configuring NVM](#install-nvm)
1.  [Using NVM to Install Node](#use-nvm-to-install-node)
1.  [Using NVM to Run Node](#the-nvm-use-command)
1.  [Creating NVM Aliases](#creating-nvm-aliases)

## Install NVM

These instructions cover how to install NVM. While these are generally valid for most Linux distributions, some of the `.bashrc` directives might vary slightly on different shells. You can install and use NVM regardless of whether you have already installed Node. NVM alters `path` variables to select different versions of Node, so it works with pre-existing installations.

1.  Install NVM using either `curl` or `wget`:

    {{< tabs >}}
    {{< tab "cURL" >}}
    To install NVM using `curl`, run the following command:

    ```command
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
    ```
    {{< /tab >}}
    {{< tab "wget" >}}
    To install NVM using `wget`, run the following command:

    ```command
    wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
    ```
    {{< /tab >}}
    {{< /tabs >}}

    {{< note >}}
    You can also install NVM using GIT or with a manual download and installation. Consult the GIT section of the [NVM Documentation Guide](https://github.com/nvm-sh/nvm#git-install) for detailed instructions.
    {{< /note >}}

1.  Source the new instructions NVM added to `.bashrc` during the installation process. You can either exit and re-enter the shell console, or manually source your `.bashrc` file. This file is almost always located at the root of your home directory:

    ```command
    source ~/.bashrc
    ```

    {{< note >}}
    Alternatively, you can execute the new instructions in the same console to apply them immediately:

    ```command
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
    ```

    NVM uses the following environmental variables:

    -   `NVM_DIR`: NVM's installation directory.
    -   `NVM_BIN`: The location where Node, the *Node Package Manager* (NPM), and global packages for the active version of Node are installed.
    -   `NVM_INC`: The directory for Node's include files (for building C/C++ add-ons).
    -   `NVM_CD_FLAGS`: The flags used to maintain compatibility with `zsh`.
    -   `NVM_RC_VERSION`: The version from the `.nvmrc` file (if used).

    We recommend leaving the default settings. Use caution if changing them for any reason.
    {{< /note >}}

1.  Confirm that NVM is successfully installed:

    ```command
    command -v nvm
    ```

    If the installation was successful, NVM returns `nvm`:

    ```output
    nvm
    ```

    If you see the message `nvm: command not found`, confirm the original installation completed successfully and repeat step two of this section to source the `.bashrc` file.

1.  Confirm the version of NVM that is running with the following command:

    ```command
    nvm --version
    ```

    ```output
    0.37.2
    ```

## Use NVM to Install Node

NVM's `install` command downloads, compiles, and installs the specified version of Node. You can install as many versions of Node as you want.

1.  To install the latest version of Node, run the following:

    ```command
    nvm install node
    ```

    After a successful install, NVM displays information about the installation:

    ```output
    Now using node v21.0.0 (npm v10.2.0)
    Creating default alias: default -> node (-> v21.0.0)
    ```

    {{< note >}}
    When used in an NVM command, `node` is an alias for the latest version of Node. The first version of Node you installed automatically becomes the default version. A new shell instantiates with the current version of Node set to `default`. The alias `system` refers to the system-installed version of Node (if any).
    {{< /note >}}

1.  To install a specific version of Node, specify the major or minor release number. You can preview a list of all available Node versions with the `ls-remote` command:

    ```command
    nvm ls-remote
    ```

    NVM displays a long list of available versions in the following format:

    ```output
            v0.1.14
            v0.1.15
            v0.1.16
            ...
            v20.8.0
            v20.8.1
    ->      v21.0.0
    ```

1.  Install any additional versions of Node you want to use. You can specify either a major or minor release of Node to install.

    ```command
    nvm install 17.0.1 # Specific minor release
    nvm install 19 # Specify major release only
    ```

    When you install a new version of Node, NVM immediately begins using it and designates it as the current version:

    ```output
    Downloading and installing node v17.0.1...
    Downloading https://nodejs.org/dist/v17.0.1/node-v17.0.1-linux-x64.tar.xz...
    ######################################################################### 100.0%
    Computing checksum with sha256sum
    Checksums matched!
    Now using node v17.0.1 (npm v8.1.0)
    Downloading and installing node v19.9.0...
    Downloading https://nodejs.org/dist/v19.9.0/node-v19.9.0-linux-x64.tar.xz...
    ######################################################################### 100.0%
    Computing checksum with sha256sum
    Checksums matched!
    Now using node v19.9.0 (npm v9.6.3)
    ```

    {{< note >}}
    If you only specify the major release number for a Node version, NVM installs the latest version of that release. You can determine the latest version of each release from the output of `nvm ls-remote`. Node also displays the exact version it selected after installation (e.g. `Now using node v14.15.4`). If you specify a version of Node that is not available, NVM responds with the error message `Version '15.0.2' not found - try 'nvm ls-remote' to browse available versions.`
    {{< /note >}}

## List Node Versions with NVM

Review all installed versions of Node with the `ls` command:

```command
nvm ls
```

NVM returns a list of all Node versions and aliases, along with an arrow indicating the current version:

```output
        v17.0.1
->      v19.9.0
        v21.0.0
default -> node (-> v21.0.0)
iojs -> N/A (default)
unstable -> N/A (default)
node -> stable (-> v21.0.0) (default)
stable -> 21.0 (-> v21.0.0) (default)
```

## The NVM Use Command

To select a different version of Node, use the `nvm use` command.

1.  Specify the version number of Node (major or minor release):

    ```command
    nvm use 17
    ```

    ```output
    Now using node v17.0.1 (npm v8.1.0)
    ```

1.  Alternatively, use an alias such as `node`:

    ```command
    nvm use node
    ```

    ```output
    Now using node v21.0.0 (npm v10.2.0)
    ```

1.  You can confirm the current version of Node with `nvm current`:

    ```command
    nvm current
    ```

    ```output
    v21.0.0
    ```

1.  You can also confirm the version of Node currently in use with the `-v` flag:

    ```command
    node -v
    ```

    ```output
    v21.0.0
    ```

{{< note >}}
To use the system's version of Node, run the command:

```command
nvm use system
```
{{< /note >}}

## NVM: Switch Node Version

To switch to a different version of Node and immediately open a Node console, use `nvm run`. The `run` command is very similar to `nvm use` in all other respects.

```command
nvm run node
```

NVM confirms it is now running the selected version of Node and returns a Node prompt:

```output
Running node v21.0.0 (npm v10.2.0)
Welcome to Node.js v21.0.0.
Type ".help" for more information.
>
```

To exit the Node prompt and return to the Linux terminal, press <kbd>Control</kbd>+<kbd>C</kbd> twice or issue the following command:

```command
.exit
```

## Creating NVM Aliases

You might find it convenient to refer to a Node version by a different or easier to remember name. NVM already provides some pre-made defaults such as `default` and `node`, which refers to the latest version. However, you can use the `alias` command to change the value of an existing alias or create a brand-new alias.

1.  Use the `nvm alias` command to change the default Node version. Follow the `alias` keyword with the `default` alias and the new version of Node it should reference:

    ```command
    nvm alias default 19
    ```

    NVM confirms the new value for the alias:

    ```output
    default -> 19 (-> v19.9.0)
    ```

1.  Also use the `nvm alias` command to create a new alias. The following example defines a new `maintenance` alias as Node version 17.0.1:

    ```command
    nvm alias maintenance 17.0.1
    ```

    NVM confirms the new alias:

    ```output
    maintenance -> 17.0.1 (-> v17.0.1)
    ```

1.  Display all of the new and old aliases with the `nvm ls` command:

    ```command
    nvm ls
    ```

    ```output
            v17.0.1
            v19.9.0
    ->      v21.0.0
    default -> 19 (-> v19.9.0)
    maintenance -> 17.0.1 (-> v17.0.1)
    iojs -> N/A (default)
    unstable -> N/A (default)
    node -> stable (-> v21.0.0) (default)
    stable -> 21.0 (-> v21.0.0) (default)
    ```

## Use NVM to Install Latest LTS Node.js Release

Any Node.js version can be in one of the following three release phases: *Current*, *Long Term Support (LTS)*, and *Maintenance*. The LTS release includes new features, bug fixes, and updates that have been approved. This section shows how to install the latest LTS version of Node.js using NVM.

1.  Use the following command to install the latest LTS version of Node.js on your system:

    ```command
    nvm install --lts
    ```

    You should see the following output:

    ```output
    Installing latest LTS version.
    Downloading and installing node v18.18.2...
    Downloading https://nodejs.org/dist/v18.18.2/node-v18.18.2-linux-x64.tar.xz...
    ######################################################################### 100.0%
    Computing checksum with sha256sum
    Checksums matched!
    Now using node v18.18.2 (npm v9.8.1)
    ```

    After the installation is complete NVM automatically switches to the latest LTS version of Node.js that you just installed.

1.  To install a specific LTS release other than the latest, use the `--lts` argument along with the release name that you want to install. The example command installs the "gallium" LTS (v16) release of Node.js:

    ```command
    nvm install --lts=gallium
    ```

    ```output
    Installing with latest version of LTS line: gallium
    Downloading and installing node v16.20.2...
    Downloading https://nodejs.org/dist/v16.20.2/node-v16.20.2-linux-x64.tar.xz...
    ######################################################################### 100.0%
    Computing checksum with sha256sum
    Checksums matched!
    Now using node v16.20.2 (npm v8.19.4)
    ```

    Refer to the [Node.js Releases page](https://nodejs.org/en/about/releases/) for LTS release names.

1.  To switch to the latest LTS version of Node.js that is already installed on your system, use the following command:

    ```command
    nvm use --lts
    ```

    ```output
    Now using node v18.18.2 (npm v9.8.1)
    ```

1.  To switch to a specific LTS version of Node.js, append `/RELEASE_NAME` to the command. This example switches to the "gallium" LTS line of Node.js:

    ```command
    nvm use lts/gallium
    ```

    ```output
    Now using node v16.20.2 (npm v8.19.4)
    ```

## Additional NVM Capabilities

Although NVM is very straightforward to use, it also provides some advanced capabilities. See the [NVM GitHub page](https://github.com/nvm-sh/nvm) for a full list of all advanced topics.

1.  NVM allows you to migrate packages from an earlier version of Node. The `nvm install` command can be used with the optional `-reinstall-packages-from=` flag to install a new version of Node with the packages from an earlier release. The following command installs the latest version of Node, but it also performs a reinstall of the packages from the `default` version of Node and links them.

    ```command
    nvm install node --reinstall-packages-from=default
    ```

    ```output
    v21.0.0 is already installed.
    Now using node v21.0.0 (npm v10.2.0)
    Reinstalling global packages from v19.9.0...

    changed 1 package in 1s
    Linking global packages from v19.9.0...
    No linked global packages found...
    ```

    {{< note >}}
    Reinstalling packages does not update the NPM version.
    {{< /note >}}

1.  NVM enables you to define custom colors to display the various Node versions and aliases using the `nvm set-colors COLOR_KEY` command. These colors are defined on the [NVM GitHub page](https://github.com/nvm-sh/nvm). If you add the `--no-colors` flag to a command, the information is displayed in black-and-white.

    ```command
    nvm set-colors rgBcm
    ```

1.  You can also specify a default Node version number within an `.nvmrc` file. This file can be located in the root directory or in any parent directory. The version indicated in `.nvmrc` is used if no version is specified on the command line.

## Use NVM to Uninstall Node

NVM allows you to uninstall Node versions that are no longer required.

Run the command `nvm uninstall` with the version of Node you'd like to remove.

```command
nvm uninstall 17.0.1
```

NVM confirms the Node version has been removed.

```output
Uninstalled node v17.0.1
```

{{< note >}}
You cannot remove a version you are currently using, so you must switch to a different version first.
{{< /note >}}

## NVM Uninstall Steps

If you no longer intend to use NVM, you can uninstall it with the `unload` command.

1.  First, deactivate NVM with the `nvm deactivate` command to clear any path variables:

    ```command
    nvm deactivate
    ```

1.  Next, use the `unload` command to uninstall NVM:

    ```command
    nvm unload
    ```

1.  Clean up your `.bashrc` file by removing the following lines:

    ```command
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm
    ```

{{< note >}}
If you only want to go back to using the system's version of Node, you do not have to uninstall NVM. In this case, run the command `nvm use system` instead.
{{< /note >}}