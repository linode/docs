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
  - '[Vim Config home page](http://vimconfig.com/)'
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

2. This collapses all of the display related options neatly into a single row, with *Display options* visible for later identification. Save and close the **.vimrc** file when you are finished. More commands to interact with the fold are detailed below.

- `zo`: Open the fold
- `zc`: Close the fold
- `zf`: Create a new fold
- `zd`: Delete a fold

## Integrate Plugins

Plugins are a powerful way to customize your Vim instance. They can expand Vim's 
