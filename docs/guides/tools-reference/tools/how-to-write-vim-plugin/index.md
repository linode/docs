---
slug: writing-a-vim-plugin
author:
  name: Nathaniel Stickman
description: "The Vim text editor can be extended using plugins. This guide shows you how to create a Vim plugin using a Vim Script or an external interpreter like Python."
keywords: ['write vim plugin','create vim plugin','vim plugin python']
tags: ['neovim', 'vim']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-18
modified_by:
  name: Linode
title: "Writing a Vim Plugin"
h1_title: "How to Write a Vim Plugin"
enable_h1: true
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Vim Tips Wiki: How to Write a Plugin](https://vim.fandom.com/wiki/How_to_write_a_plugin)'
- '[IBM Developer: Scripting the Vim Editor](https://developer.ibm.com/articles/l-vim-script-1/)'
- '[Vim Reference Manual: The Python Interface to Vim](https://vimhelp.org/if_pyth.txt.html)'
---

Vim is a minimalist text editor that is highly adaptable. Beyond configuration and scripting, you can extend Vim with a wide array of plugins developed and maintained by a large and active community.

In this tutorial, you learn how to write a Vim plugin of your own. The guide walks you through creating and deploying an example plugin. It shows you how to make plugins that use Vim script, Python, or external command-line programs.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/guides/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/guides/set-up-and-secure/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On **Debian** and **Ubuntu**, use the following command:

            sudo apt update && sudo apt upgrade

    - On **AlmaLinux**, **CentOS** (8 or later), or **Fedora**, use the following command:

            sudo dnf upgrade

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How Vim Plugins Work

Vim is a highly-customizable text editor. By default, Vim comes with a configuration file — usually `~/.vimrc` — that gives you a vast array of options for controlling Vim's behavior and look and feel. You can learn more about configuring your Vim instance in our guide [Introduction to Vim Customization](/docs/guides/introduction-to-vim-customization/).

Using plugins, Vim becomes even more adaptable. The editor has a wide and dedicated community of users. Many of these users have contributed exceptional tools that add new functionality or adapt existing functionality within Vim.

When it comes to creating a Vim plugin of your own, there are two main reasons for doing so:

- To share your Vim configurations with a wider community. Plugins are the preferred way to distribute your Vim code for others to use. Following some plugin standards and hosting your plugin on GitHub makes your plugin accessible to others through plugin managers like [vim-plug](https://github.com/junegunn/vim-plug).
- To organize your Vim configurations. Even if you only ever keep the plugin for yourself, having more complex Vim code in a plugin format can help you keep your Vim configurations more organized and maintainable.

## How to Write a Vim Plugin

This section walks you through creating a Vim plugin. The example plugin displays the time, looks up word definitions, and gives spelling suggestions. The instructions that follow show how to set up the prerequisites and implement the code for the plugin.

To help keep plugins organized and more maintainable, this guide uses the [vim-plug](https://github.com/junegunn/vim-plug) plugin manager. Several other plugin managers exist though, so feel free to choose an option that works best for you.

You can get details on how to install vim-plug in our guide [Introduction to Vim Customization](/docs/guides/introduction-to-vim-customization/#install-the-vim-plug-plug-in-manager). However, if you already have cURL installed, you can install vim-plug with the following command:

    sudo curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim

### Anatomy of a Vim Plugin

There are numerous possible ways to set up a plugin for Vim. However, the method shown here is based on the official documentation and the prevailing trends in the Vim plugin community. These best practices also keep your Vim code organized and maintainable.

First, your plugin should have a main directory that uses the plugin name. Under that directory, the plugin should have a `plugin` and an `autoload` directory:

- The `plugin` directory sets up the plugin. It defines the commands that the plugin should expose and sets up any keybindings that you want the plugin to have by default.
- The `autoload` directory holds the engine of the plugin. Keeping this code in the `autoload` directory allows Vim to be more efficient about using it. Vim only loads the `autoload` code if one of the commands defined in the `plugin` portion gets called. This is done so Vim only has to load what it needs when it's needed.

For example, if your plugin is named `example-plugin`, a minimal plugin directory might resemble the following directory tree:

    example-plugin/
        autoload/
            example-plugin.vim
        plugin/
            example-plugin.vim

Within each `.vim` file, your plugin has access to three methods for processing information:

- Using Vim script, interpreted directly in Vim
- Using an external interpreter, like Python, Ruby, etc.
- Using the output from another command-line program

Vim does not limit your plugin to just one of these methods. You are free to mix and match them as your plugin needs. Usually, it is best to choose an approach that most efficiently accomplishes your plugin's goals.

The example Vim plugin developed in the next sections shows you how to implement each of these methods.

### Writing a Vim Plugin

The plugin needs some initial setup, including creating its directories and its Vim script files. These steps show how to setup and include the code for the `plugin` directory's Vim script file.

1. Create a directory for the plugin, and change into that directory. This guide places the plugin in the current user's home directory.

        mkdir ~/example-plugin
        cd ~/example-plugin

    The rest of this guide assumes you are in this directory.

1. Create an `autoload` and a `plugin` directory.

        mkdir autoload
        mkdir plugin

1. Create a new `example-plugin.vim` file in the `plugin` directory, and add the contents in the `example-plugin.vim` file.

    {{< file "plugin/example-plugin.vim" vim >}}
" Title:        Example Plugin
" Description:  A plugin to provide an example for creating Vim plugins.
" Last Change:  8 November 2021
" Maintainer:   Example User <https://github.com/example-user>

" Prevents the plugin from being loaded multiple times. If the loaded
" variable exists, do nothing more. Otherwise, assign the loaded
" variable and continue running this instance of the plugin.
if exists("g:loaded_example-plugin")
    finish
endif
let g:loaded_example-plugin = 1

" Exposes the plugin's functions for use as commands in Vim.
command! -nargs=0 DisplayTime call example-plugin#DisplayTime()
command! -nargs=0 DefineWord call example-plugin#DefineWord()
command! -nargs=0 AspellCheck call example-plugin#AspellCheck()
    {{< /file >}}

1. Create a new `example-plugin.vim` file in the `autoload` directory. This is the file that gets loaded whenever one of your plugin's commands gets called:

        touch autoload/example-plugin.vim

The following three sections show you how to add functions to your Vim plugin. Each section uses a different approach to processing information within a Vim plugin. In the end, you have a working plugin with three useful commands.

#### Using Vim Script

Add a `DisplayTime` function to the `example-plugin.vim` file in the `autoload` directory. This function echoes the date and time. It also allows the user to optionally provide a flag indicating whether they want to see date (`d`) or time (`t`) only.

{{< file "autoload/example-plugin.vim" vim >}}
function! example-plugin#DisplayTime(...)
    if a:0 > 0 && (a:1 == "d" || a:1 == "t")
        if a:1 == "d"
            echo strftime("%b %d")
        elseif a:1 == "t"
            echo strftime("%H:%M")
        endif
    else
        echo strftime("%b %d %H:%M")
    endif
endfunction
    {{< /file >}}

#### Using an Interpreter

1. Install the Vim package for Python 3.

        pip3 install vim

1. Add the Python code and the Vim `DefineWord` function to the `example-plugin.vim` file in the `autoload` directory. The Python code gives your plugin a function to fetch English word definitions from [Wiktionary](https://en.wiktionary.org/wiki/Wiktionary:Main_Page). The Vim function gets the word under the user's cursor and passes that to the Python function.

    {{< file "autoload/example-plugin.vim" vim >}}
" [...]

" Starts a section for Python 3 code.
python3 << EOF
# Imports Python modules to be used by the plugin.
import vim
import json, requests

# Sets up variables for the HTTP requests the
# plugin makes to fetch word definitions from
# the Wiktionary dictionary.
request_headers = { "accept": "application/json" }
request_base_url = "https://en.wiktionary.org/api/rest_v1/page/definition/"
request_url_options = "?redirect=true"

# Fetches available definitions for a given word.
def get_word_definitions(word_to_define):
    response = requests.get(request_base_url + word_to_define + request_url_options, headers=request_headers)

    if (response.status_code != 200):
        print(response.status_code + ": " + response.reason)
        return

    definition_json = json.loads(response.text)

    for definition_item in definition_json["en"]:
        print(definition_item["partOfSpeech"])

        for definition in definition_item["definitions"]:
            print(" - " + definition["definition"])
EOF

" Calls the Python 3 function.
function! example-plugin#DefineWord()
    let cursorWord = expand('<cword>')
    python3 get_word_definitions(vim.eval('cursorWord'))
endfunction
    {{< /file >}}

#### Using a Command-line Program

1. Install [aspell](http://aspell.net/), a command-line spell-checking tool. Vim has a built-in spell checker, but this one gives you the advantages of using an external tool and a standard format.

    - On **Debian** and **Ubuntu**, use the following command:

            sudo apt install aspell

    - On **AlmaLinux**, **CentOS**, **Fedora**, use the following command:

            sudo dnf install aspell aspell-en

1. Add an `AspellCheck` function to the `example-plugin.vim` file in the `autoload` directory. The `system` function used here allows the plugin to execute commands on the system's command line. You could, alternatively, use the `exec` function along with the `!` symbol to run system commands.

    {{< file "autoload/example-plugin.vim" vim >}}
" [...]

function! example-plugin#AspellCheck()
    let cursorWord = expand('<cword>')
    let aspellSuggestions = system("echo '" . cursorWord . "' | aspell -a")
    let aspellSuggestions = substitute(aspellSuggestions, "& .* 0:", "", "g")
    let aspellSuggestions = substitute(aspellSuggestions, ", ", "\n", "g")
    echo aspellSuggestions
endfunction
    {{< /file >}}

#### Install the Plugin

The final step to start using your plugin is adding it to your plugin manager. To do so, add a line like the one below to your plugin configuration in your Vim configuration file. This line works with vim-plug and the plugin location used in the steps above. However, you need to vary the line based on the plugin manager you are using and the actual location and name of your plugin.

{{< file "~/.vimrc" vim >}}
    " [...]
    Plug '~/example-plugin'
    " [...]
{{< /file >}}

Either reopen Vim or source your configuration file again, and you are ready to start using the plugin. If you want to make your plugin available to the wider Vim community, follow the next sections.

## How to Deploy a Vim Plugin

Most Vim plugin managers pull plugins from GitHub automatically. This gives you a convenient way to distribute your plugin. Below, you can see how to upload your plugin to a GitHub repository. You can also get an idea of the kind of additional information you may want to provide to guide your users.

### Add a README for Your Vim Plugin

It is usually good practice to include a Readme file when you distribute your Vim plugin. The Readme should give installation instructions and some statements about how to use the plugin. Your Readme should also indicate any additional system requirements of your plugin. The example plugin created above, for instance, requires the user to have Python 3, and `aspell` installed.

Create a `README.md` file in the plugin's base directory. GitHub automatically renders and displays the contents of this file to anyone visiting your repository's main page.

Take a look at our [example README file](example-plugin/README) for ideas on the kind of information you may want to provide. This example fits with the example plugin developed in the sections above.

### Create a Git Repository

1. In your plugin's directory, use the following command to initialize a Git repository.

        git init

1. Create a `.gitignore` file. If there are files or directories you do not want to be added to the remote Git repository, add patterns matching those files/directories to the `.gitignore` file.

    Here is a simple example that ignores `.DS_STORE` files:

    {{< file ".gitignore" >}}
.DS_STORE
{{< /file >}}

1. Add your plugin's files for staging to your first Git commit.

        git add .

1. Commit the files. It is recommended that you add a brief descriptive comment to each commit you make, as shown below:

        git commit -m "Initial commit."

1. Add the remote repository. Replace the URL in the example below with the URL for your remote repository.

        git remote add origin https://github.com/example-user/example-plugin.git

1. Push your local commit to the remote repository.

        git push -u origin master

Your plugin is now available for other users to install and enable on their local instance of Vim.