---
slug: install-direnv
description: 'Shortguide for installing direnv'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: ["python", "bash", "direnv", "automation"]
tags: ["automation","python"]
modified: 2018-11-06
modified_by:
  name: Leslie Salazar
title: "Install direnv"
published: 2018-06-12
headless: true
show_on_rss_feed: false
aliases: ['/development/python/install-direnv/']
authors: ["Leslie Salazar"]
---
<!-- Start direnv shortguide. -->
Direnv modifies the shell environment depending on your current directory. This allows users to isolate project-specific environment variables and avoid depending on a single shell `.profile` file. When direnv detects an `.envrc` file within the current directory it will load the file's declared environment variables, execute any shell commands and scripts.

### Install

1.  Install direnv using your distro's package manager:

        apt-get update && apt-get upgrade
        apt-get install direnv

1.  Verify direnv has installed and view a list of available commands:

        direnv help

### Configure
1. Direnv will need to hook directly into your shell to execute the file `.envrc `. This will allow direnv to automatically execute when your shell changes directory.

    **BASH**

    Add the following line to the bottom of the `~/.bashrc` file:

        eval "$(direnv hook bash)"

    Reload the `.bashrc` file:

        source ~/.bashrc

    **ZSH**

    Add the following line to the bottom of the `~/.zshrc` file:

        eval "$(direnv hook zsh)"

    Reload the `.zshrc` file:

        source ~/.zshrc

    **FISH**

    Add the following line to the bottom of the `~/.config/fish/config.fish` file:

        eval (direnv hook fish)

    Reload the FISH configuration file:

        source ~/.config/fish/config.fish

1. Create a `.envrc` file in the project specific directory.

        touch ~/my-project-directroy/.envrc

1. Use your text editor to add directory specific environment variables to the `.envrc` file.

        vim ~/my-project-directory/.envrc

{{< note respectIndent=false >}}
You must use bash syntax within `.envrc` file.
{{< /note >}}

1. Navigate to the project directory and allow execution of the `.envrc` file:

        cd ~/my-project-directory

{{< output >}}
direnv: error .envrc is blocked. Run `direnv allow` to approve its content.
user@localhost: direnv allow
{{< /output >}}

<!-- End direnv shortguide. -->
