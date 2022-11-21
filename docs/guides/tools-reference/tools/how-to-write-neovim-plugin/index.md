---
slug: writing-a-neovim-plugin-with-lua
author:
  name: Nathaniel Stickman
description: "Learn how to develop a plugin for Neovim. Neovim introduces first-class support for Lua, and this guide shows you how to create a plugin using the Lua programming language."
og_description: "Learn how to develop a plugin for Neovim. Neovim introduces first-class support for Lua, and this guide shows you how to make a plugin to start taking advantage of that."
keywords: ['write neovim plugin','neovim plugin development','neovim lua plugin']
tags: ['neovim']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-18
modified_by:
  name: Nathaniel Stickman
title: "Writing a Neovim Plugin with Lua"
h1_title: "How to Write a Neovim Plugin with Lua"
enable_h1: true
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Nvim Documentation: Lua](https://neovim.io/doc/user/lua.html)'
- '[GitHub: jacobsimpson/nvim-example-lua-plugin](https://github.com/jacobsimpson/nvim-example-lua-plugin)'
---

Neovim is an open source fork of the ubiquitous Vim text editor. It supports the [Lua programming language](https://www.lua.org/) which opens up vast possibilities for configuration, scripting, and plugin development. The Neovim community has created numerous plugins pushing the boundaries of the text editor's capabilities.

In this tutorial you learn how to write a Neovim plugin using the Lua programming language. The guide walks you through the development of an example plugin while showing you how the pieces fit together to make an effective Neovim plugin.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/guides/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/guides/set-up-and-secure/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On **Debian** and **Ubuntu**, use the following command:

            sudo apt update && sudo apt upgrade

    - On **AlmaLinux**, **CentOS** (8 or later), and **Fedora**, use the following command:

            sudo dnf upgrade

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How Neovim Plugins Work

Neovim expands on the highly-customizable text editor Vim, carrying over many of the same options for controlling the editor's behavior, look, and feel. You can learn more about Neovim in our guide [How to Install Neovim Plugins with vim-plug](/docs/guides/how-to-install-neovim-and-plugins-with-vim-plug/).

Just as with Vim, Neovim can be extended through plugins created and maintained by the vast Vim and Neovim communities. Neovim maintains full compatibility with standard Vim plugins. Neovim also adds many advanced features that have allowed a community of Neovim plugin creators to expand the editor's horizons.

Part of what makes Neovim's configuration and plugin development stand out is its built-in support for the [Lua programming language](https://www.lua.org/). This gives Neovim developers a more robust language to work with, as well as access to Lua's wide array of modules and capabilities.

When it comes to creating a Neovim plugin of your own, there are two main reasons for doing so:

- To share your Neovim scripts and tools with a wider community. Plugins are the preferred way to distribute your Vim and Neovim code for others to use. Hosting your plugin on GitHub makes your plugin accessible to others through plugin managers like [vim-plug](https://github.com/junegunn/vim-plug).
- To organize your Neovim functions. Even if you only ever keep the plugin for yourself, adapting your more complex Neovim code into a plugin can help you keep your configurations more organized and maintainable.

## How to Write a Neovim Plugin

This section walks you through creating a Neovim plugin. It features an example plugin for displaying and managing a to-do list and shows how to set up the prerequisites and implement the code.

To help keep plugins organized and more maintainable, this guide uses the [vim-plug](https://github.com/junegunn/vim-plug) plugin manager. Several other plugin managers exist including some specifically built for Neovim.

Refer to our guide [How to Install Neovim Plugins with vim-plug](/docs/guides/how-to-install-neovim-and-plugins-with-vim-plug/#install-neovim-plugins) for detailed information on vim-plug. However, if you already have cURL installed, you can install vim-plug with the following command:

     curl -fLo ~/.local/share/nvim/site/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim

### Anatomy of a Neovim Plugin

Lua is a full application programming language that supports diverse application architectures. For instance, the [zen-mode.nvim](https://github.com/folke/zen-mode.nvim) plugin uses a fairly generic structure, dividing up its Lua files based on categories of behavior. The [Findr.vim](https://github.com/conweller/findr.vim) plugin, on the other hand, employs a [model-view-controller (MVC)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) architecture. This is an application structure designed for managing user interfaces.

There is a basic structure you should follow for setting up your plugin, regardless of the architecture you choose for your Lua code. It consists of two main directories in your plugin's base directory, each with at least one code file:

- A directory named `plugin` that defines the plugin. This directory should have a Vim script (`.vim`) file using your plugin's name. The file defines the commands that the plugin should expose and sets up any keybindings that you want the plugin to have by default. It is also the only Vim script code required for your Neovim plugin.
- A directory named `lua` directory that stores the plugin's Lua code and main functionality. Typically, the `lua` directory has a subdirectory with the plugin's name and an `init.lua` file. Usually, that file routes commands to other Lua files as needed, but for small plugins, you may not need another file.

Lua files are not sourced until they are called on via the `require` function. So, your plugin does not need to use an `autoload` directory unless you want to use more Vim script code.

As an example, a minimal Neovim plugin named `example-plugin` directory might resemble the following example:

    example-plugin/
        plugin/
            example-plugin.vim
        lua/
            example-plugin/
                init.lua

The next section shows you how to set up each of these parts. It also provides example code to give you an idea of what a basic Neovim plugin can look like.

### Writing a Neovim Plugin

Before moving into the actual plugin code, your plugin needs some initial setup. This includes creating the directories and adding any files that get used by the plugin code.

This example plugin uses an SQLite database file to store "to do" tasks, which the plugin can fetch and modify. So, you need to create that database file and add a Lua module for working with it.

1. Create the directories for your plugin. This guide places the plugin in the current user's home directory, and these commands use the `-p` flag to ensure that any directories in the path that do not already exist get created.

        mkdir -p ~/example-plugin/plugin
        mkdir -p ~/example-plugin/lua/example-plugin

1. Create a directory for your Lua dependencies, and change into that directory.

        mkdir ~/example-plugin/lua/example-plugin/deps
        cd ~/example-plugin/lua/example-plugin/deps

1. Add the Lua module to be used for interacting with the SQLite database file. This guide uses the [LJSQLite3](https://github.com/stepelu/lua-ljsqlite3) module, which can be added directly to the project using Git. The module relies on the [Xsys](https://github.com/stepelu/lua-xsys) module, which you can also add via Git.

        git clone https://github.com/stepelu/lua-ljsqlite3.git
        git clone https://github.com/stepelu/lua-xsys.git

    This requires that you have Git installed. You can install it using one of the commands below:

    - On **Debian** and **Ubuntu**:

            sudo apt install git

    - On **AlmaLinux**, **CentOS**, and **Fedora**:

            sudo dnf install git

    {{< note >}}
These modules rely on [LuaJIT](https://luajit.org/), rather than the standard Lua. Neovim uses LuaJIT, so this is not a problem when it comes to your plugin. However, if you want to test out these modules outside of the plugin environment, you need to install, and use LuaJIT to do so.
    {{< /note >}}

1. Install SQLite 3 and the development package for it.

    - On **Debian** and **Ubuntu**, use the following command:

            sudo apt install sqlite3 libsqlite3-dev

    - On **AlmaLinux** and **CentOS**, use the following command:

            sudo dnf install sqlite sqlite-devel

1. Change into your plugin's base directory.

        cd ~/example-plugin

    From here on, the guide assumes you are working out of this directory.

1. Open the SQLite command-line shell with a new file, `todo.db`.

        sqlite3 todo.db

1. In the SQLite shell, enter the following two commands:

        CREATE TABLE todo_list(id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT NOT NULL, completed TEXT DEFAULT 'No');
        INSERT INTO todo_list(description) VALUES('Test connecting to SQLite via Lua.');

    You can then exit the shell using the **Ctrl** + **D** key combination.

You are now ready to write the code for your Neovim plugin.

#### Vim Script Component

This plugin focuses on doing most of the work in Lua code, so it only needs one Vim script file. Create an `example-plugin.vim` file in the `plugin` directory, and add the contents shown below.

{{< file "plugin/example-plugin.vim" vim >}}
" Title:        Example Plugin
" Description:  A plugin to provide an example for creating Neovim plugins.
" Last Change:  8 November 2021
" Maintainer:   Example User <https://github.com/example-user>

" Prevents the plugin from being loaded multiple times. If the loaded
" variable exists, do nothing more. Otherwise, assign the loaded
" variable and continue running this instance of the plugin.
if exists("g:loaded_exampleplugin")
    finish
endif
let g:loaded_exampleplugin = 1

" Defines a package path for Lua. This facilitates importing the
" Lua modules from the plugin's dependency directory.
let s:lua_rocks_deps_loc =  expand("<sfile>:h:r") . "/../lua/example-plugin/deps"
exe "lua package.path = package.path .. ';" . s:lua_rocks_deps_loc . "/lua-?/init.lua'"

" Exposes the plugin's functions for use as commands in Neovim.
command! -nargs=0 FetchTodos lua require("example-plugin").fetch_todos()
command! -nargs=0 InsertTodo lua require("example-plugin").insert_todo()
command! -nargs=0 CompleteTodo lua require("example-plugin").complete_todo()
{{< /file >}}

The `example-plugin.vim` file contains all the Vim script code this plugin requires.

#### Lua Component

This example splits the Lua functionality between three files. An `init.lua` file handles the routing, while two other files implement two different categories of functions. The approach is meant to give you an idea of how you could structure your plugin's Lua code to help make it more maintainable.

1. Create an `init.lua` file in the `lua/example-plugin` directory, and add the contents shown below.

    {{< file "lua/example-plugin/init.lua" lua >}}
-- Imports the plugin's additional Lua modules.
local fetch = require("example-plugin.fetch")
local update = require("example-plugin.update")

-- Creates an object for the module. All of the module's
-- functions are associated with this object, which is
-- returned when the module is called with `require`.
local M = {}

-- Routes calls made to this module to functions in the
-- plugin's other modules.
M.fetch_todos = fetch.fetch_todos
M.insert_todo = update.insert_todo
M.complete_todo = update.complete_todo

return M
    {{< /file >}}

1. Create a `fetch.lua` file in the `lua/example-plugin` directory, and add the content shown in the example file below.

    {{< file "lua/example-plugin/fetch.lua" lua >}}
-- Imports the module for handling SQLite.
local sqlite = require("ljsqlite3")

-- Creates an object for the module.
local M = {}

-- Fetches todo tasks from the database and
-- prints the output.
function M.fetch_todos()
    local db = sqlite.open("todo.db")

    local db_results = db:exec("SELECT * FROM todo_list WHERE completed == 'No';")
    for _, item in ipairs(db_results[2]) do print(item) end

    db:close()
end

return M
    {{< /file >}}

1. Create a `update.lua` file in the `lua/example-plugin` directory, and add the code in the example file.

    {{< file "lua/example-plugin/update.lua" lua >}}
-- Imports the module for handling SQLite.
local sqlite = require("ljsqlite3")

-- Creates an object for the module.
local M = {}

-- Inserts a new todo task, prompting the
-- user to enter a description.
function M.insert_todo()
    local todo_description = ""
    repeat
        todo_description = vim.fn.input("Enter a description (150 characters or fewer): ")
        print("")
    until (todo_description ~= "") and (string.len(todo_description) <= 150)

    local db = sqlite.open("todo.db")
    db:exec("INSERT INTO todo_list (description) VALUES ('" .. todo_description .. "');")
    db:close()
end

-- Marks a todo task completed. Lists open
-- tasks, and prompts the user to select
-- one for completing.
function M.complete_todo()
    local db = sqlite.open("todo.db")

    local todo_completed = -1
    local todo_selected = -1
    repeat
        local db_results = db:exec("SELECT * FROM todo_list WHERE completed == 'No';")
        for i, item in ipairs(db_results[2]) do
            print(tostring(db_results[1][i]) .. ': ' .. item)
        end

        todo_selected = tonumber(vim.fn.input("Enter an ID number for a task listed above: "))

        for _, id in ipairs(db_results[1]) do
            if (id == todo_selected) then todo_completed = todo_selected end
        end

        print("")
    until todo_completed >= 0

    db:exec("UPDATE todo_list SET completed = 'Yes' WHERE id = " .. todo_completed .. " AND completed = 'No';")
    db:close()
end

return M
    {{< /file >}}

#### Install the Plugin

The final step to start using your plugin is adding it to your plugin manager. To do so, the line included in the Neovim configuration file displayed below. This line works with vim-plug and the plugin location used in the steps above. However, you need to vary the line based on the plugin manager you are using and the actual location and name of your plugin.

{{< file "~/.config/nvim/init.vim" vim >}}
    " [...]
    Plug '~/example-plugin'
    " [...]
{{< /file >}}

Either reopen Neovim or source your configuration file again, and you are ready to start using the plugin. If you want to make your plugin available to the wider Neovim community, follow the next sections.

## How to Deploy a Neovim Plugin

Most plugin managers for Vim and Neovim pull plugins from GitHub automatically. This gives you a convenient way to distribute your plugin. Below, you can see how to upload your plugin to a GitHub repository. You can also get an idea of the kind of additional information you may want to provide to guide your users.

### Add Instructions

It is usually good practice to include a README file when you distribute your Vim plugin. The README should provide installation instructions and some statements about how to use the plugin. Your README should also indicate any additional system requirements of your plugin. The example plugin created above, for instance, requires the user to have SQLite 3 installed.

Create a `README.md` file in the plugin's base directory. GitHub automatically renders and displays the contents of this file to anyone visiting your repository's main page.

Take a look at our [example Readme file](example-plugin/README) for ideas on the kind of information you may want to provide. This example fits with the example plugin developed in the sections above.

### Create a Git Repository

1. In your plugin's directory, use the following command to initialize a Git repository:

        git init

1. Create a `.gitignore` file. If there are files or directories that you do not want to be added to the remote Git repository, add patterns matching those files or directories to the `.gitignore` file.

    Following is a simple example that ignores `.DS_STORE` files:

    {{< file ".gitignore" >}}
.DS_STORE
{{< /file >}}

1. Add your plugin's files for staging to your first Git commit.

        git add .

1. Commit the files. It is recommended that you add a brief descriptive comment to each commit you make, like shown below:

        git commit -m "Initial commit."

1. Add the remote repository. Replace the URL in the example below with the URL for your remote repository.

        git remote add origin https://github.com/example-user/example-plugin.git

1. Push your local commit to the remote repository.

        git push -u origin master

Your plugin is now available for other users to install and enable on their local instance of Neovim.