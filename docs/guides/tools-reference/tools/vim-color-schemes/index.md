---
slug: vim-color-schemes
author:
  name: Linode Community
  email: docs@linode.com
description: "The Vim text editor is known for its versatility, which includes support for practically limitless color schemes. Color schemes in Vim are not just a personalization feature. They control syntax highlighting and let you adjust the editor’s readability for your needs. In this tutorial, learn everything you need to know to start effectively customizing the color schemes for your Vim editing experience."
og_description: "The Vim text editor is known for its versatility, which includes support for practically limitless color schemes. Color schemes in Vim are not just a personalization feature. They control syntax highlighting and let you adjust the editor’s readability for your needs. In this tutorial, learn everything you need to know to start effectively customizing the color schemes for your Vim editing experience."
keywords: ['change vim color scheme','set vim color scheme','vim color scheme list']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-08-07
modified_by:
  name: Nathaniel Stickman
title: "How to Set and Change Vim Color Schemes"
h1_title: "How to Set and Change Vim Color Schemes"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[phoenixNAP: How to Change and Use Vim Color Schemes](https://phoenixnap.com/kb/vim-color-schemes)'
- '[Linux Hint: Vim Color Schemes](https://linuxhint.com/vim_color_schemes/)'
- '[Opensource.com: How to Change Colors and Themes in Vim](https://opensource.com/article/19/12/colors-themes-vim)'
- '[GitHub: rafi/awesome-vim-colorschemes](https://github.com/rafi/awesome-vim-colorschemes)'
---

[Vim](https://www.vim.org/) reigns as one of the most widely used text editors. It runs on a wide range of systems, comes pre-installed on many Unix systems, and offers a high degree of customization.

You can learn more about Vim, including how to operate and navigate the editor, through our guide [Getting Started Using Vi and Vim](/docs/guides/what-is-vi/). Also recommended is our guide [Introduction to Vim Customization](/docs/guides/introduction-to-vim-customization/) which sets you up for configuring and customizing your Vim instance.

One useful piece of Vim customization are color schemes. These allow you to define how Vim displays text, from the background to the text itself. And with Vim's syntax highlighting, the color scheme possibilities are vast. Not only can color schemes make your editor more appealing, they can make text easier to read and navigate.

In this tutorial, learn more about Vim color schemes. This includes everything from reviewing existing color schemes to installing new ones, all the way to the commands for defining your own schemes.

{{< note >}}
This guide's coverage should also apply to NeoVim, a project refactoring Vim and adding many new features. Be aware, however, that likely your NeoVim instance uses an `init.vim` file instead of a `.vimrc` for storing configurations. The `init.vim` is typically stored at `~/.config/nvim/init.vim`.

You can learn more about NeoVim and how to get started customizing it through our guide [How to Install NeoVim and Plugins with Vim-plug](/docs/guides/how-to-install-neovim-and-plugins-with-vim-plug/).
{{< /note >}}

## How to View Vim Color Schemes

Vim comes with a default color scheme assigned, and typically your Vim installation also includes several additional color schemes. These provide a useful start, and may give you everything you need as far as color scheme variety.

To see a list of available color schemes on your system, begin by typing the `:colorscheme` command. Then, without pressing **Enter**, follow the command with a **Space** and press the **Ctrl** + **D** key combination.

You should see a list similar to, though maybe not exactly, like this one:

{{< output >}}
blue      default  desert   evening   koehler  murphy  peachpuff  shine  torte
darkblue  delek    elflord  industry  morning  pablo   ron        slate  zellner
{{< /output >}}

As you expand your collection of color schemes (which you can see how to do further on), the output of the combination above updates. Each time you run the command, Vim reflects your current set of schemes.

You can see the currently assigned color scheme with the command:

    :colorscheme

{{< output >}}
default
{{< /output >}}

## How to Change Vim Color Schemes

The `colorscheme` command can also be used to change your current Vim color scheme. Just follow the command with the name of the scheme to be used. For instance, this command changes Vim to the `evening` scheme:

    :colorscheme evening

You may also want to ensure that syntax highlighting is enabled. You can enable it with the command:

    :syntax enable

Doing so has Vim applying particular colors from the color scheme based on the role each piece of text plays. In code for instance, this often means keywords — like `def` in Python and `function` in JavaScript — receive different colors than variable names.

## How to Install New Vim Color Schemes

Vim has a long-time and dedicated community that has produced many helpful plugins and other Vim tools. The link link below for getting started with Vim customization can help you get an introduction to these community tools.

The Vim community has also put together a vast array of ready-made color schemes to use for Vim. Many of these provide you with painstakingly crafted color palettes oriented around aesthetic appeal, readability, and/or reduced eye strain.

There are two main ways of adding others' color schemes to your Vim instance. Both of the examples below for these methods install Ethan Schoonover's [`solarized` color scheme](https://github.com/altercation/vim-colors-solarized).

- Use a Vim plug-in manager to install the new theme. Our guide [Introduction to Vim Customization](/docs/guides/introduction-to-vim-customization/#integrate-plug-ins) covers how you can get started with a plug-in manager, providing the installation process for [Vim-plug](https://github.com/junegunn/vim-plug).

    Once you have a plug-in manager like Vim-plug installed, you can use the manager's installation command to install a new color scheme.

    Using Vim-plug, for instance, you can install the `solarized` scheme by adding the following lines to your `.vimrc`. You may already have the first and last lines of this example if you have set up your `.vimrc` file for Vim-plug:

    {{< file "~/.vimrc" >}}
call plug#begin('~/.vim/plugged')
" [...]
Plug 'altercation/vim-colors-solarized'
" [...]
call plug#end()
    {{< /file >}}

    After that, exit and reopen Vim, then issue the command:

        :PlugInstall

- Manually install the color scheme. This works by downloading the scheme's file to a particular directory for Vim to access.

    You need to first create that directory if it does not already exist, which you can do with:

        mkdir -p ~/.vim/colors

    Then download the scheme file, which you can usually find as a file ending in `.vim` on the scheme's GitHub page:

        wget https://raw.githubusercontent.com/altercation/vim-colors-solarized/master/colors/solarized.vim -O ~/.vim/colors/solarized.vim

With either method, reopen Vim, issue the `:colorscheme solarized` command, and your instance should update to the new scheme.

{{< note >}}
Many Vim themes are designed to work with either GUI instances of Vim or particular color palettes in a terminal emulator. As such, the color scheme may appear irregular when you are not using one of these setups.

To remedy this, you can use the following command in Vim, which explicitly has Vim use a more limited color palette:

    :set termguicolors

Alternatively, you can issue the opposite command to get the appropriate color palette when using a GUI or a supported palette in a terminal emulator. Typically this is not necessary unless you had previously set up Vim for a limited terminal palette:

    :set notermguicolors

{{< /note >}}

## How to Manually Control Vim Colors

Vim color schemes actually consist of series of coloring rules applied to different Vim highlight groups. This means, too, that you can manually alter parts or all of your color scheme using the `highlight` command.

Here is an example of a `highlight` command — which can be shortened to `hi` — which turns text `Red` for the `Normal` highlight group:

    :hi Normal ctermfg=Red

The following provides a breakdown of that command to help understand what each part is doing and, more broadly, what the syntax is for `highlight`.

- `:hi` begins the command for applying a highlight rule. You could, alternatively, use `:highlight`.

- `Normal` defines the highlight group the rule should apply to. To see a list of default highlight groups in Vim, you can issue the command:

        :help highlight-groups

- `ctermfg=` indicates the component to be affected by the rule. This begins a key-value pair, and you can actually provide multiple key-value pairs per instance of the `highlight` command.

    There are four primary options for keys, two for terminal instances of Vim and two for GUI instances:

    - `ctermfg` affects the foreground color (usually meaning the text) for terminal instances.

    - `ctermbg` affects the background color for terminal instances.

    - `guifg` affects the foreground color for GUI instances.

    - `guibg` affects the background color for GUI instances.

    Additionally, there are options of `cterm` and `gui` used for properties like *bold*, *italic*, and *underline*.

- `Red` provides a color value for the `ctermfg` key. The color value can be either a named value — like `Red` or `LightGrey` — or a hexadecimal color value like `#80a0ff`.

The end result of the above command is that all text matching the `Normal` highlight group gets colored `Red` when using Vim in the terminal.

You can see a list of existing highlight rules, showing each group and their assigned rules as key-value pairs, using the `highlight` command:

    :highlight

This option even shows short text examples of what each rule looks like when applied. Exploring this list can be a great way to start learning more about Vim colors schemes and how to craft your own.

## How to Make the Vim Color Scheme Persistent

All of the color scheme changes shown above are transient — when you exit your Vim session, the changes no longer apply.

But you can readily make your color scheme changes persistent by applying them in your `.vimrc` file.

You may already have a `.vimrc` file if you followed our guide [Introduction to Vim Customization](/docs/guides/introduction-to-vim-customization/). Otherwise, you can create one in Vim by opening a file at `~/.vimrc`.

From there, you can generally apply the same commands as discussed above. Just add these commands as lines in your `.vimrc` file without the `:`.

Take this example. It adds three lines somewhere in the `.vimrc`. The first enables syntax highlighting. The second tells Vim to use dark backgrounds. And the third sets Vim's color scheme to the `solarized` scheme installed above:

{{< file "~/.vimrc" >}}
" [...]
syntax on
set background=dark
colorscheme solarized
" [...]
{{< /file >}}

The `solarized` scheme actually has specific behavior when the background is dark, as do numerous other schemes created by the Vim community.

Should you create your own color scheme using `highlight` commands as discussed above, you can add the rules for the scheme directly to your `.vimrc`. The result is a persistent scheme that applies immediately when you load Vim.

## Conclusion

This gives you everything you need to start on the journey of custom Vim color schemes. You can begin making your Vim instance look sharper and clearer, making your work easier and smoother. And, with all of the Vim customization techniques covered here, you can get well on your way to understanding Vim customization overall too.

Have more questions or want some help getting started? Feel free to reach out to our [Support](https://www.linode.com/support/) team.

