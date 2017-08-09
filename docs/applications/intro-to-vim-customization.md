---
 author:
 name: Linode Community
 email: docs@linode.com
description: 'The Vim editor is one in a handful of text editors ubiquitous in nearly all Unix systems. It is designed based off of the earlier releaed Vi text editor, and is advertised as an improved version. While an initial learning curve is present, Vim aims to be a hyper efficient text editor and provides an extensive plugin system which can be configured to user preferences, as well as support for hundreds of programming languages and file extentions. The core distribution of Vim is preloaded with powerful text manipulation capabilities which provide users with tools to address a diverse range of situations without any pre-configuration required. Much more than a simple text editor, Vim transcends its deceptively straightforward user interface and offers unlimited customization opportunities, with the potential to be transformed into a full-featured programming I.D.E. with integrated Github support, and features rivaling the very best free and paid I.D.E.'s on the market today.
keywords: 'vim, editor'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published:
modified:
modified_by:
  name: Linode
title: 'Introduction To Vim'
contributor:
   name: Andrew Lescher
   link: [Andrew Lescher](https://www.linkedin.com/in/andrew-lescher-87027940/)
external_resources:
  - '[Vim official home page](http://www.vim.org)'
  - '[Vim-Config](http://vimconfig.com/)'
  - '[VimAwesome](http://vimawesome.com/)'
  - '[Vim-Plug Project Github Page](https://github.com/junegunn/vim-plug)'
  - '[The Vim Tips Wiki](http://vim.wikia.com/wiki/Vim_Tips_Wiki)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn up to $300 per published guide.*

---

## Introduction To This Tutorial

This guide details the configuration of the Vim text editor and seeks to provide practical knowledge to those just starting out with Vim as well as those already familiar with the tool. An array of methods for customizing the way your Vim editor performs and handles certain tasks will be introduced, along with a powerful and simple plugin management system. Upon the completion of this tutorial, you will have fine-tuned your Vim editor to behave more intelligently to boost your productivity, as well as learned how to manage external plugins by installing a popular and useful plugin on your Vim platform.

## Before You Begin

1. Most Unix distributions come pre-packaged with Vim. To check, simply type `vim` in the terminal. If you receive an error message, install Vim using your Linux distribution's package manager.

  **Fedora/RHEL based**

        sudo yum install vim

  **Debian based**

        sudo apt install vim

  **Arch Linux**

        sudo pacman -Syy vim

2. A working knowledge of Vim's editing commands is not required to complete this tutorial, but may be helpful. Any Vim-specific commands required to complete the steps in this guide will be clarifed, however an overview of basic editing commands is beyond the scope of this tutorial. An excellent method of gaining familiarization with the basics of Vim is to work through its built-in tutorial. The tutorial provides a hands-on introduction to Vim's editing commands, and allows you to practice what you learn within the Vim environment. To begin, type `vimtutor` from the terminal.

3. Working through this tutorial requires the use of a limited user account. If you have yet to create one, follow the steps in the [Securing Your Server](/docs/security/securing-your-server) guide.

# Customizing Your Vim Instance

It is possible to customize Vim on a per-user basis or set configurations to apply system-wide. Integrating both options is also possible, and useful in situations where you would like some settings to apply to all accounts on the system, and other settings to apply to your own user account exclusively.

## Customizing The Global **vimrc** File

The configurations in this section will apply system-wide across all user accounts.

1. A default Vim installation will feature a file containing Vim's core global settings called **vimrc**. This file will be located at either `/etc/vim/vimrc` or `etc/vimrc`. Start by opening the Vim editor.

        sudo vim

{: .note}
> Prefixing the `sudo` command is necessary when editing files where read and/or write permissions are not granted to your user account.

2. Inside the Vim editor, enter command mode by typing `:`. Now type the `Explore` command (caps necessary) and press `<Enter>`. A directory tree should be clearly visible. Navigate to the **vimrc** file location, and press `<Enter>` to open the file.

3. The **vimrc** file may syntactically differ between Linux distributions, but the core settings remain the same. Above or next to each setting there will be a brief description of how it impacts the Vim environment and behavior. Most of the settings can be enabled by simply uncommenting them. Choose which settings you would like to apply system-wide and save the file by entering command mode `:`. Type `w` (for "write") and press `<Enter>`.

## Customizing The Local **.vimrc** File

The configurations in this section will apply only to the active user account.

### Create **.vimrc**

1. During Vim's loading sequence, it will automatically check the current user's home directory for a **.vimrc** file. All settings specified in this file will override explicitly contradicted settings in any previously loaded config files, which in this case is the global **vimrc** file. From your active Vim session, create a *.vimrc* file by entering command mode with `:`, and typing `tabedit ~/.vimrc`. This will open the **.vimrc** file in a new Vim tab. For those just starting out, it can be helpful to have a template on which to build on. Copy the sample **.vimrc** file below and paste it into your own file.

{: .file}
**~/.vimrc**
: ~~~ vimrc
" Set compatibility to Vim only.
set nocompatible

" Helps force plugins to load correctly when it is turned back on below.
filetype off

" Turn on syntax highlighting.
syntax on

" For plugins to load correctly.
filetype plugin indent on

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

" Allow hidden buffers
set hidden

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
autocmd BufWinEnter *.* silent loadview
~~~

2. Each customization in the **.vimrc** file is paired with an explanation specifying its impact on the Vim editor. You may want to read through line by line and disable any customizations you feel are not necessary by commenting them out (comments are defined by the "`"`" character).

### Organize The *.vimrc* File With Folds

The **.vimrc** file can quickly become cluttered and disorganized as more and more customizations are added. An excellent approach to file management is using Vim's *Fold* feature. 

1. From the still active **.vimrc** file, navigate your cursor to the line that reads "Display options". Type the following sequence of commands in the order listed.

- Enter visual line mode by holding the `<shift>` key and pressing `v`
- Type `15j` to block select all of the display related customizations
- Type `zf` to create the fold

2. This collapses all of the display related options neatly into a single row, with *Display options* visible for later identification. Save and close the **.vimrc** file when you are finished. Your customizations will take effect the next time Vim is opened. More commands to interact with folds are detailed below.

- `zo`: Open the fold
- `zc`: Close the fold
- `zf`: Create a new fold
- `zd`: Delete a fold

## Integrate Plugins

Plugins are a powerful way to customize your Vim instance. They can exponentially expand Vim's capabilities and allow the user to perform tasks which would traditionally require specialized software. This entire guide was written, previewed, and uploaded to Github using Vim.

### Install The Vim-Plug Plugin Manager

The most effective way to install and manage plugins requires the use of a plugin management tool. Vim-Plug will be used here, but there are a handful of others to choose from.

1. Install *curl*.

    **Fedora/RHEL based**

        sudo yum install curl

    **Debian based**

        sudo apt install curl

    **Arch Linux**

        sudo pacman -Syy curl

2. Create the installation directories, download, and install VimPlug from Github.

        sudo curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim

### Install Your First Plugin With Vim-Plug

Installing plugins with Vim-Plug is very simple. Once you identify a plugin you would like to add to Vim, it is as easy as adding a line of code to your **.vimrc** file. Below, installing the NERDTree file system explorer plugin will be demonstrated. All other plugins are installed in exactly the same manner.

1. Create a separate file to manage your plugins, and a new directory to store them.

        touch ~/.vimrc.plug
        mkdir ~/vimplug-plugins

2. Open **.vimrc** in the Vim editor and add the following text at the bottom to call the **.vimrc.plug** file.

        " Call the .vimrc.plug file
            if filereadable(expand("~/.vimrc.plug"))
                source ~/.vimrc.plug
            endif

3. Now open the **.vimrc.plug** file in Vim. Populate the file with the contents below. Any additional plugins to be installed need to be added between the "plug#begin" and "plug#end" lines.

{: file.}
**~/.vimrc.plug**
: ~~~ vimrc
call plug#begin('~/.vim/plugged')

    " NERDTree   
    Plug 'scrooloose/nerdtree'

call plug#end()
~~~

4. After saving and closing the **.vimrc.plug** file, exit and restart Vim. The final installation procedure is to issue the `PlugInstall` command in command mode. This will open the plugin manager within Vim and proceed to install all plugins listed in the **.vimrc.plug** file. Installed plugins will automatically load the next time Vim is started.

        :PlugInstall

5. To switch to the NERDTree file explorer anytime during an open Vim window, enter command mode with the `:` key and type `NERDTree`. Press `<Enter>` and the NERDTree window will pop open on the left side. This command can also be bound to a free key on the keyboard (such as one of the "F" keys) to simplify and speed up calling. Adding the following to your **.vimrc** file will bind the F3 key as a toggle switch for NERDTree.

{: .file}
**~/.vimrc**
~~~ vimrc
. . .

map <F3> :NERDTreeToggle<CR>

. . .
~~~

6. Instead of typing out a long filepath when editing a file in Vim, some prefer to open Vim with the `vim` command, then use NERDTree to browse system directories and locate a file. Adding the following to your **.vimrc** file will automatically open NERDTree when Vim is started without a file specified.

{: .file}
**~/.vimrc**
~~~ vimrc
. . .

autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * if argc() == 0 && !exists("s:std_in") | NERDTree | endif

. . .
~~~

7. Additional commands for managing plugins via Vim-Plug are listed below.

{: .table .table-striped .table-bordered}
 | Command                        | Description                                   |
 | :----------:                   | :-----------:                                 |
 | PlugInstall                    | Install plugins                               |
 | PlugUpdate                     | Install or update plugins                     |
 | PlugClean[!]                   | Delete removed plugins                        |
 | PlugUpgrade                    | Upgrade Vim-Plug                              |
 | PlugStatus                     | List plugins and current status               |
 | PlugDiff                       | Display changes made during updates           |
 | PlugSnapshot[1] [/output/path] | Generate script for restoring current plugins |

# Where To Go From Here

Many additional plugins and tools exist to enhance your Vim experience. The Vim official website and online wiki offer additional ways to customize Vim as well as fully documenting its available features and commands. If a visual and interactive approach to creating your .vimrc file is desired, the Vim-Config website simplifies the process and auto generates the file. One of the best places to search for additional plugins is on the VimAwesome website. Most of the plugins available for Vim are hosted there in a well organized and easily searchable environment, along with instructions for installation for all the most popular plugin management tools. Lastly, if you want to gain a deeper understanding of Vim-Plug, the project's Github page is an excellent place to start. Links for all these websites are provided in the **External Resources** section.
