---
author:
  name: Linode
  email: docs@linode.com
description: 'This how-to guide shows you how to configure the Vim text editor and begin to customize it.'
keywords: ["vim", " editor"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-08-21
modified: 2017-08-22
modified_by:
  name: 'Linode'
title: 'Introduction To Vim Customization'
contributor:
  name: 'Andrew Lescher'
  link: https://www.linkedin.com/in/andrew-lescher-87027940/
external_resources:
 - '[Vim official home page](http://www.vim.org)'
 - '[Vim-Config](http://vimconfig.com/)'
 - '[VimAwesome](http://vimawesome.com/)'
 - '[Vim-Plug Project Github Page](https://github.com/junegunn/vim-plug)'
 - '[The Vim Tips Wiki](http://vim.wikia.com/wiki/Vim_Tips_Wiki)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn up to $300 per published guide.*

---
![Vim_banner](/docs/assets/Vim_Customization.jpg)

## What Is Vim?

Vim is one of a handful of text editors ubiquitous in nearly all Unix systems. While an initial learning curve is unavoidable, Vim aims to be a hyperefficient text editor and provides an extensive plug-in system which can be configured to user preferences. It also supports  hundreds of programming languages and file extentions.

This guide details the configuration of the Vim text editor and aims at those who are interested in taking the next step into customization. An array of methods for customizing Vim's execution of certain tasks and response to user input will be introduced, along with a plug-in management system.

Upon the completion of this tutorial, you will have fine-tuned your Vim editor to behave more intelligently, as well as acquired exposure to managing external plug-ins.

## Before You Begin

1.  A basic understanding of how to work within the Vim environment is necessary to complete this tutorial. Readers should be familiar with the steps for editing documents with Vim.

2.  Working through this tutorial requires the use of a limited user account. If you have yet to create one, follow the steps in the [Securing Your Server](/docs/security/securing-your-server#add-a-limited-user-account) guide.

# Customize Your Vim Instance

It is possible to customize Vim on a per-user basis or set configurations to apply system-wide. Integrating both options is also possible - and useful in situations where you would like some settings to apply to all accounts on the system, and other settings to apply to your own user account exclusively.

## Customize the Global *vimrc* File

The configurations in this section will apply system-wide across all user accounts.

1.  A default Vim installation will feature a file containing Vim's core global settings called *vimrc*. This file will be located at either `/etc/vim/vimrc` or `etc/vimrc`, depending on your linux distribution.

    {{< note >}}
Prefixing the `sudo` command is necessary when editing files where read and/or write permissions are not granted to your user account.
{{< /note >}}

2.  Open the *vimrc* file for editing. The file may syntactically differ between Linux distributions, but the core settings remain the same. In the file below, the segment containing the bulk of the configuration options is shown. Uncomment the lines whose behavior you wish to enable.

{{< file "/etc/vimrc" vim >}}
set showcmd› › " Show (partial) command in status line.
set showmatch› › " Show matching brackets.
set ignorecase›› " Do case insensitive matching
set smartcase› › " Do smart case matching
set incsearch› › " Incremental search
set autowrite› › " Automatically save before commands like :next and :make
set hidden›› " Hide buffers when they are abandoned
set mouse=a› › " Enable mouse usage (all modes)

{{< /file >}}


## Customize the Local *.vimrc* File

The configurations in this section will apply only to the active user account.

### Create **.vimrc**

1.  During Vim's loading sequence, it will automatically check the current user's home directory for a *.vimrc* file. All settings specified in this file will override explicitly contradicted settings in any previously loaded config files, which in this case is the global *vimrc* file.

From your active Vim session, create a *.vimrc* file in your home directory. The contents below consist of basic configuration settings most users would find helpful when utilizing Vim in any circumstance. You may pick and choose which settings you would like to add to your personal *.vimrc* file.

{{< file "~/.vimrc" vim >}}
" Set compatibility to Vim only.
set nocompatible

" Helps force plug-ins to load correctly when it is turned back on below.
filetype off

" Turn on syntax highlighting.
syntax on

" For plug-ins to load correctly.
filetype plug-in indent on

" Turn off modelines
set modelines=0

" Automatically wrap text that extends beyond the screen length.
set wrap
" Vim's auto indentation feature does not work properly with text copied from outisde of Vim. Press the <F2> key to toggle paste mode on/off.
nnoremap <F2> :set invpaste paste?<CR>
imap <F2> <C-O>:set invpaste paste?<CR>
set pastetoggle=<F2>

" Uncomment below to set the max textwidth. Use a value corresponding to the width of your screen.
" set textwidth=79
set formatoptions=tcqrn1
set tabstop=2
set shiftwidth=2
set softtabstop=2
set expandtab
set noshiftround

" Display 5 lines above/below the cursor when scrolling with a mouse.
set scrolloff=5
" Fixes common backspace problems
set backspace=indent,eol,start

" Speed up scrolling in Vim
set ttyfast

" Status bar
set laststatus=2

" Display options
set showmode
set showcmd

" Highlight matching pairs of brackets. Use the '%' character to jump between them.
set matchpairs+=<:>

" Display different types of white spaces.
set list
set listchars=tab:›\ ,trail:•,extends:#,nbsp:.

" Show line numbers
set number

" Set status line display
set statusline=%F%m%r%h%w\ [FORMAT=%{&ff}]\ [TYPE=%Y]\ [POS=%l,%v][%p%%]\ [BUFFER=%n]\ %{strftime('%c')}

" Encoding
set encoding=utf-8

" Highlight matching search patterns
set hlsearch
" Enable incremental search
set incsearch
" Include matching uppercase words with lowercase search term
set ignorecase
" Include only uppercase words with uppercase search term
set smartcase

" Store info from no more than 100 files at a time, 9999 lines of text, 100kb of data. Useful for copying large amounts of data between files.
set viminfo='100,<9999,s100

" Map the <Space> key to toggle a selected fold opened/closed.
nnoremap <silent> <Space> @=(foldlevel('.')?'za':"\<Space>")<CR>
vnoremap <Space> zf

" Automatically save and load folds
autocmd BufWinLeave *.* mkview
autocmd BufWinEnter *.* silent loadview"

{{< /file >}}


## Integrate Plug-Ins

Plug-ins are a powerful way to customize your Vim instance; they can grant you additional capabilities which can help address more specific usage needs.

### Install the Vim-Plug Plug-In Manager

The most effective way to install and manage plug-ins requires the use of a plug-in management tool. Instructions for installing Vim-Plug are provided below.

1.  Install curl.

   **Fedora/RHEL based**

        sudo yum install curl

    **Debian based**

        sudo apt install curl

    **Arch Linux**

        sudo pacman -Syy curl

2.  Create the installation directories, download, and install Vim-Plug from Github.

        sudo curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim

### Install Your First Plug-In With Vim-Plug

Using a plug-in manager automates both the installation and setup of any plug-ins you choose to add.

1.  Create a separate file to manage your plug-ins, and a new directory to store them.

        touch ~/.vimrc.plug
        mkdir ~/vimplug-plugins

2.  Open *.vimrc* in the Vim editor and add the following text at the bottom to call the *.vimrc.plug* file.

    {{< file "~/.vimrc" vim >}}
. . .
 " Call the .vimrc.plug file
 if filereadable(expand("~/.vimrc.plug"))
     source ~/.vimrc.plug
 endif

{{< /file >}}



3.  Now, open the *.vimrc.plug* file in Vim. Populate the file with the contents below to add the *Fugitive Vim* plug-in, a Github wrapper. With this plug-in installed, you can now run a Git terminal from within Vim!

     {{< note >}}
Any additional plug-ins to be installed need to be added between the "plug#begin" and "plug#end" lines.
{{< /note >}}

    {{< file "~/.vimrc.plug" vim >}}
call plug#begin('~/.vim/plugged')

"Fugitive Vim Github Wrapper
Plug 'tpope/vim-fugitive'

call plug#end()

{{< /file >}}


     {{< note >}}
If after this step you receive an error similar to `E117 Unknown Function: plug#end` check the user permissions over `~/.vim/` you may need to `chmod -R 0755
{{< /note >}}

4.  After saving and closing the *.vimrc.plug* file, exit and restart Vim. The final installation procedure is to issue the `PlugInstall` command in command mode. This will open the plug-in manager within Vim and proceed to install all plug-ins listed in the **vimrc.plug* file. Installed plug-ins will automatically load the next time Vim is started.

        :PlugInstall

5.  Additional commands for managing plug-ins via Vim-Plug are listed below.

 | Command                        | Description                                   |
 | :----------:                   | :-----------:                                 |
 | PlugInstall                    | Install plugins                               |
 | PlugUpdate                     | Install or update plugins                     |
 | PlugClean[!]                   | Delete removed plugins                        |
 | PlugUpgrade                    | Upgrade Vim-Plug                              |
 | PlugStatus                     | List plugins and current status               |
 | PlugDiff                       | Display changes made during updates           |
 | PlugSnapshot[1] [/output/path] | Generate script for restoring current plugins |

4. The commands listed above are by no means exhaustive. Most plug-ins also offer support documentation when installed, which can be accessed by typing `help` in command mode and browsing the *Local Additions* section.

## Where To Go From Here

Many additional plug-ins and tools exist to enhance your Vim experience. The Vim official website and online wiki offer additional ways to customize Vim as well as fully documenting its available features and commands. If a visual and interactive approach to creating your .vimrc file is desired, the Vim-Config website simplifies the process and auto generates the file.

One of the best places to search for additional plug-ins is on the VimAwesome website. Most of the plug-ins available for Vim are hosted there in a well-organized and easily searchable environment, along with instructions for installation for all the most popular plug-in management tools.

Lastly, if you want to gain a deeper understanding of Vim-Plug, the project's Github page is an excellent place to start. Links for all these websites are provided in the *External Resources* section.
