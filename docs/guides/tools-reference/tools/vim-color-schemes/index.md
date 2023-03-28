---
slug: vim-color-schemes
description: "Vim includes support for practically limitless color schemes to control syntax highlighting and adjust the editor’s readability. Learn how to customize Vim color schemes here."
keywords: ['change vim color scheme','set vim color scheme','vim color scheme list']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-08-07
modified_by:
  name: Nathaniel Stickman
title: "Set and Change Vim Color Schemes"
title_meta: "How to Set and Change Vim Color Schemes"
external_resources:
- '[phoenixNAP: How to Change and Use Vim Color Schemes](https://phoenixnap.com/kb/vim-color-schemes)'
- '[Linux Hint: Vim Color Schemes](https://linuxhint.com/vim_color_schemes/)'
- '[Opensource.com: How to Change Colors and Themes in Vim](https://opensource.com/article/19/12/colors-themes-vim)'
- '[GitHub: rafi/awesome-vim-colorschemes](https://github.com/rafi/awesome-vim-colorschemes)'
authors: ["Nathaniel Stickman"]
---

[Vim](https://www.vim.org/) reigns as one of the most widely used command line text editors. It offers a high degree of customization, runs on a wide range of operating systems, and comes pre-installed on many Unix-based systems.

You can learn more about Vim, including how to operate and navigate the editor, through our guide [Getting Started Using Vi and Vim](/docs/guides/what-is-vi/). Additionally, our guide [Introduction to Vim Customization](/docs/guides/introduction-to-vim-customization/) teaches you to configure and customize your Vim instance.

Color schemes are a useful component of Vim customization. They allow you to define how Vim displays both the background and text. Factor in Vim's syntax highlighting, and the color scheme possibilities are vast. Not only can color schemes make your editor more appealing, they can make text easier to read and navigate.

In this tutorial, learn more about Vim color schemes. This includes reviewing existing color schemes, installing new ones, and even defining your own.

{{< note >}}
This guide should also apply to NeoVim, a project based on Vim that adds many new features. However, it's likely your NeoVim instance uses an `init.vim` file instead of a `.vimrc` for storing configurations. The `init.vim` is typically stored at `~/.config/nvim/init.vim`.

You can learn more about NeoVim and how to get started customizing it through our guide [How to Install NeoVim and Plugins with Vim-plug](/docs/guides/how-to-install-neovim-and-plugins-with-vim-plug/).
{{< /note >}}

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to View Vim Color Schemes

Vim typically comes with several color schemes in addition to the default. These are a useful start, and may even provide everything you need for color scheme variety.

To begin, open Vim:

```command
vim
```

You can see the currently assigned color scheme with the command:

```command
:colorscheme
```

```output
default
```

To see a list of available color schemes on your system, begin by typing the `:colorscheme` command. Then, without pressing **Enter**, follow the command with a **Space** and press the **Ctrl+D** key combination.

You should see a list similar to this one:

```output
blue       delek      evening    morning    peachpuff  slate
darkblue   desert     industry   murphy     ron        torte
default    elflord    koehler    pablo      shine      zellner
```

The output above updates as you expand your collection of color schemes. Each time you run the command, Vim reflects your current set of color schemes.

## How to Change Vim Color Schemes

The `colorscheme` command can also be used to change your current Vim color scheme. Just follow the command with the name of the scheme to be used. For instance, this command changes Vim to the `evening` scheme:

```command
:colorscheme evening
```

You may also want to ensure that syntax highlighting is enabled. You can enable it with the command:

```command
:syntax enable
```

After doing so, Vim applies particular colors from the color scheme based on the role each piece of text plays. In code for instance, this often means keywords, like `def` in Python and `function` in JavaScript, receive different colors than variable names.

## How to Install New Vim Color Schemes

Vim has a long-standing and dedicated community that has produced many helpful plugins and tools. The link below for getting started with Vim customization gives you an introduction to these community tools.

The Vim community has also put together a vast array of pre-made color schemes. Many of these provide you with painstakingly crafted color palettes oriented around aesthetic appeal, readability, and/or reduced eye strain.

There are two main ways of adding community color schemes to your Vim instance. Both examples for these methods install Ethan Schoonover's [`solarized` color scheme](https://github.com/altercation/vim-colors-solarized).

### Install Manually

This works by downloading the scheme's file to a particular directory for Vim to access.

First, you need to create that directory if it does not already exist:

```command
mkdir -p ~/.vim/colors
```

Next, download the scheme file, which you can usually find as a `.vim` file on the scheme's GitHub page:

```command
wget https://raw.githubusercontent.com/altercation/vim-colors-solarized/master/colors/solarized.vim -O ~/.vim/colors/solarized.vim
```

### Install Using a Vim plug-in Manager

Our guide [Introduction to Vim Customization](/docs/guides/introduction-to-vim-customization/#integrate-plug-ins) covers how to get started with a plug-in manager and provides the installation process for [Vim-plug](https://github.com/junegunn/vim-plug). Essentially:

```command
curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

Once you have a plug-in manager like Vim-plug installed, you can use the manager's installation command to install a new color scheme.

Using Vim-plug you can install the `solarized` scheme by adding the following lines to your `vimrc` file. If you followed our guide [Introduction to Vim Customization](/docs/guides/introduction-to-vim-customization/), you already have a `.vimrc` file which includes the first and last lines of this example. Otherwise, you can create one in Vim by opening a file at `~/.vimrc`.

```file {title="~/.vimrc"}
call plug#begin('~/.vim/plugged')

Plug 'altercation/vim-colors-solarized'

call plug#end()
```

After that, exit and reopen Vim, then issue the command:

```command
:PlugInstall
```

{{< note >}}
Many Vim themes are designed to work with either GUI instances of Vim or particular color palettes in a terminal emulator. As such, the color scheme may appear irregular when you are not using one of these setups.

To remedy this, you can use the following command in Vim, which explicitly has Vim use a more limited color palette:

```comand
:set termguicolors
```

Alternatively, you can issue the opposite command to get the appropriate color palette when using a GUI or a supported palette in a terminal emulator. Typically, this is not necessary unless you previously set up Vim for a limited terminal palette:

```command
:set notermguicolors
```
{{< /note >}}

When done, reopen Vim and issue the `:colorscheme solarized` command. Your instance should update to the new scheme.

## How to Manually Control Vim Colors

Vim color schemes actually consist of coloring rules applied to different Vim highlight groups. This means you can manually alter parts or all of your color scheme using the `highlight` command.

Here is an example of a `highlight` command that turns text `Red` for the `Normal` highlight group:

```command
:highlight Normal ctermfg=Red
```

The following provides a breakdown of that command to help understand the syntax for `highlight`.

-   `:highlight` begins the command for applying a highlight rule. Alternatively, you could use the shortened `:hi` form.

-   `Normal` defines the highlight group to apply the rule to. To see a list of the default highlight groups in Vim, you can issue the command:

    ```command
    :help highlight-groups
    ```

-   `ctermfg=` indicates the component to be affected by the rule. This begins a key-value pair, and you can provide multiple key-value pairs per instance of the `highlight` command.

    There are four primary options for keys, two for terminal instances of Vim and two for GUI instances:

    -   `ctermfg` affects the foreground color (i.e. text) for terminal instances.

    -   `ctermbg` affects the background color for terminal instances.

    -   `guifg` affects the foreground color for GUI instances.

    -   `guibg` affects the background color for GUI instances.

    Additionally, there are `cterm` and `gui` options used for properties like *bold*, *italic*, and *underline*.

    -   `Red` provides a color value for the `ctermfg` key. The color value can either be a named value like `Red` or a hexadecimal value such as `#80a0ff`.

The end result of the above command is that all text matching the `Normal` highlight group gets colored `Red` when using Vim in the terminal.

Using the `highlight` command, you can see a list of existing highlight rules. This shows each group and their assigned rules as key-value pairs.

```command
:highlight
```

This option even shows examples of what each rule looks like when applied. Exploring this list can be a great way to start learning more about Vim colors schemes and how to craft your own.

## How to Make the Vim Color Scheme Persistent

All of the color scheme changes shown above are transient, meaning when you exit your Vim session, the changes no longer apply. However, you can make your color scheme changes persistent by adding them to your `.vimrc` file. In fact, you can generally apply the same commands as discussed above. Just add these commands as lines in your `.vimrc` file without the preceding `:`.

Take this example. It adds three lines somewhere in the `.vimrc`. The first enables syntax highlighting. The second tells Vim to use dark backgrounds. And the third sets Vim's color scheme to the `solarized` scheme installed above:

```file {title="~/.vimrc"}
" [...]
syntax on
set background=dark
colorscheme solarized
" [...]
```

The `solarized` scheme actually has specific behavior when the background is dark, as do numerous other schemes created by the Vim community.

Should you create your own color scheme using `highlight` commands as discussed above, you can add the rules for the scheme directly to your `.vimrc`. The result is a persistent scheme that applies immediately when you load Vim.

## Conclusion

This gives you everything you need to start the journey of custom Vim color schemes. You can begin making your Vim instance look sharper and clearer, in turn making your work easier and smoother. With all of the Vim customization techniques covered here, you're well on your way to understanding Vim customization overall.