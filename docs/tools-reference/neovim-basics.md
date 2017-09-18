---
author:
  name: Gabriel Cánepa
  email: gacanepa@gmail.com
description: 'This is an introductory guide to NeoVim, a drop-in replacement for the vim text editor.'
keywords: 'neovim,text,editor,vim,asynchronous,plugins,'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Weekday, Month 00st, 2015'
modified: Saturday, September 16th, 2017
modified_by:
  name: Gabriel Cánepa
title: 'NeoVim Basics'
contributor:
  name: Gabriel Cánepa
  link: https://twitter.com/gacanepa
 external_resources:
  - '[NeoVim official website](https://neovim.io)'
  - '[Neovim-completion-manager](https://github.com/roxma/nvim-completion-manager) GitHub repository'
  - '[Far.vim](https://github.com/brooth/far.vim) GitHub repository'
image: https://linode.com/docs/assets/neovim-completion-manager.png
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*
----

## What is NeoVim? 

If you are a system administrator or software developer (or probably both, under the premise of devops), a robust text editor must be among the tools you use on a daily basis. Particularly, the vi and vim editors have served well the Unix and Linux communities for decades.  

Although vim is under active development (version 8 was released about a year ago and its GitHub repository gets new commits often), it still includes some ~300k lines of C89 code – which is nowhere easy to maintain. On top of that, issues and new pull requests cannot be addressed very easily since Bram Moolenaar is the only person who maintains the large codebase of the program.  

These difficulties –along with the lack of support for some desired features, such as asynchronous plugins- motivated the birth of NeoVim as a fork of vim. The project's main objective is to completely refactor vim (without writing it from scratch) so that maintenance can be simplified, and new features –along with bug fixes- can be added to the source code more quickly. 

## What To Expect From NeoVim? 

During NeoVim's short, albeit fruitful life, two outstanding features have already been implemented: asynchronous plugins (through a redesign of vim's plugin system), and the Remote Procedure Call (RPC) API for controlling NeoVim programatically. The former makes it possible for plugins to run as background processes without interfering with the main editor process. On the other hand, the RPC API allows GUI programs (and other software that speaks the msgpack-rpc messaging protocol) to connect to a running NeoVim instance. Among other things, this means that you can integrate well-known text editors (such as Atom, Visual Studio Code, or Sublime Text) with NeoVim – and have modifications sync bidirectionally between them. Thus, you can leverage all the features of the GUI program, and at the same time use nvim's engine behind the scenes. 

This guide details the installation and configuration of NeoVim, along with two asynchronous plugins (nvim-completion-manager and far.vim) in a 64-bit Linux system. Upon the completion of this tutorial, you will have a fully functional NeoVim environment ready for use in your development and / or system administration tasks. 

## Before You Begin 

1.  To follow along with this guide, a user account with limited privileges is required. If you have not yet done so, please create one before proceeding by following the steps in the [Securing Your Server guide](/docs/security/securing-your-server#add-a-limited-user-account). 
2.  Install the necessary tools: 
    -   In CentOS and similar distributions: `sudo yum install fuse fuse-libs git python34-pip ack -y`
    -   In Debian and derivatives: `sudo apt-get install fuse libfuse2 git python3-pip ack-grep -y` 
3.  To install plugins more easily, the use of a plugin manager is preferred. Vim-plug is a wise choice since it has been around for quite a while and is available both for vim and NeoVim. This plugin manager requires `git` to manage most plugins. To set up Vim-plug for the latter, do 
~~~
    curl -fLo ~/.local/share/nvim/site/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim 
~~~
4.  Several NeoVim plugins are written in Python 3, which is present in all modern distributions and should be available out of the box in your Linode. Otherwise, refer to the [Linux Package Management guide](/docs/tools-reference/linux-package-management) for details instructions on how to search for and install the specific package name that provides Python 3 in your chosen distribution. 

Although there are several methods available, in this tutorial we will install NeoVim by downloading an appimage, a binary file that contains the application and all the files it needs to run (with the exception of the [FUSE libraries](https://github.com/AppImage/AppImageKit/wiki/FUSE), which need to be installed separately). This method not only is the most straightforward one, but also is distribution-agnostic, and always provides the latest version of the package. 

It is important to note that the NeoVim appimage is currently only available for 64-bit systems. If you are using a different architecture, or would like to see if the program is available from your distribution's repositories, you may refer to the installation instructions in the [NeoVim wiki](https://github.com/neovim/neovim/wiki/Installing-Neovim).   

Strictly speaking, the FUSE libraries make it possible for the appimage to be run by non-root users even from their home directories. However, in the next section we will make the program available for all users by placing it inside `/usr/bin`. This will allow users to utilize the same application but configure it to meet their specific needs, as we will explain shortly. 

## Installation And Configuration 

Once the FUSE libraries have been installed, let's proceed to download the appimage as follows. Note that this will both download and rename the file from nvim.appimage to nvim for our convenience. Additionally, we will refer to NeoVim as simply nvim for shortness. 
1.  Download the appimage
~~~
    wget --quiet https://github.com/neovim/neovim/releases/download/nightly/nvim.appimage --output-document nvim 
~~~
2.  Grant executable permissions to the file for all users and set the owner and group owner to `root:root`: 
~~~
    chmod +x nvim 
    chown root:root nvim 
~~~
3.  Move the binary file to `/usr/bin`
~~~
    mv nvim /usr/bin 
~~~
At this point we can exit the session with superuser privileges to configure nvim for our regular user account. 
4.  Move into your home directory and create the subfolder structure to store the configuration file: 
~~~
    cd ~ 
    mkdir -p .config/nvim 
~~~
If vim is installed in your system, you can reutilize its configuration file (~/.vimrc) for nvim: 
~~~
    ln -s ~/.vimrc ~/.config/nvim/init.vim 
~~~
Or create a separate one beginning with the current contents of ~/.vimrc: 
~~~
    cp ~/.vimrc ~/.config/nvim/init.vim 
~~~
{: .note}
>
>Although vim and nvim can share the same configuration file, it is recommended to create a separate one for nvim, as we do in this guide. This will prevent errors if you don't have Vim-plug also configured for vim. 

## Running NeoVim 

To launch nvim, simply type 
~~~
    nvim 
~~~
and press Enter. You will be presented with a similar startup screen as that of vim. At this point you can enter Insert mode and start typing text as usual. However, before actually using nvim for the first time let's install two plugins.  

## Installing Plugins 

To make the most of nvim, here are some cool plugins that you can use: 

### Nvim-completion-manager

-   **nvim-completion-manager** is a fast, extensible completion framework that supports a wide variety of programming languages and snippet solutions. Some of these are supported out of the box, while others require the installation of extra Python 3 modules to work. In this tutorial we will illustrate the use of this plugin with [UltiSnips](https://github.com/SirVer/ultisnips), a robust snippet solution. 

1.  Install the neovim Python module as follows:
~~~
    pip3 install --user neovim  
~~~
2.  Add the following lines at the bottom of your `~/.config/nvim/init.vim` file to include the snippets available through UltiSnips: 
{: .file-excerpt }
~/.config/nvim/init.vim
:   ~~~ conf
    call plug#begin() 
    Plug 'roxma/nvim-completion-manager' 
    Plug 'SirVer/ultisnips' 
    call plug#end() 
    ~~~
Then launch nvim and type 
~~~
    :PlugInstall 
~~~
The plugin will be ready for use after we restart nvim. To test it, let's create a `.py` file named `helloworld.py` as follows: 
~~~
    nvim helloworld.py 
~~~
Enter Insert mode and type `def`. You should be presented with a dropdown list similar to that shown in the below image. Highlight one of the options using the up and down arrows in your keyboard and finally press the Tab key. The code snippet will be inserted into the body of the file: 

![auto completion via neovim-completion-manager](/docs/assets/nvim-completion-manager.png)

For more examples using other programming languages, refer to the plugin documentation.

### Far.vim

-   **far-vim** is described as a plugin for performing asynchronous search and replace operations on a set of files (typically within the same directory). To install it, follow these steps:

1.  Insert the following line before `call plug#end()` in `~/.config/nvim/init.vim`: 
~~~
    Plug 'brooth/far.vim' 
~~~
and do (inside nvim) 
~~~
    :PlugInstall 
~~~
As before, the plugin will be available after restarting nvim. 
2.  To test it, create a directory named myproject and two files named `greeting.py` and `persons.py` inside: 
~~~
    mkdir myproject 
    cd myproject 
~~~
{: .file-excerpt }
greeting.py 
:   ~~~ python
    def greet(name): 
        print('Hello', name) 
    ~~~
and
{: .file-excerpt }
persons.py
:   ~~~ python
    #!/usr/bin/python3 
    from greeting import greet 
    # Import the greet function from greeting.py
    # Pass a name to greet()
    greet('Jack') 
    greet('Jill') 
    greet('Bob') 
    ~~~
3.  Open one of them with nvim and type in Command mode: 
~~~
    :Far name nombre .py$ --source=acknvim 
~~~
You will notice that the nvim window will split in two panes. The left one shows the file and the one in the right shows the results should the changes be applied in all the `.py` files inside the current directory. If you then type (also in Command mode) 
~~~
    :Fardo 
~~~
and press Enter, all the changes will be applied. To undo them, do 
~~~
    :Farundo 
~~~

Another plugin for nvim you may want to take a look at is [neomake](https://github.com/neomake/neomake) (similar to syntastic in plain vim). While syntastic may freeze vim (or pause it, at best) while it checks the syntax of a large file every time you save changes, neomake will do the same thing without causing any interruptions. 

## Roadmap and Future 

Currently there are more than 300 developers contributing to NeoVim in GitHub. With that in mind, it is expected that the project will grow at a faster pace than it has done in the past. The milestones for the next version are listed in the official website, along with the long term goals, and those already reached in past versions. 
