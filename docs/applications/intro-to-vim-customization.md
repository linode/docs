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
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn up to $300 per published guide.*

---

## Introduction To This Tutorial

This guide is part 1 in a two part series on the usage and configuration of the Vim text editor. Basic editing commands will be introduced in addition to methods and tips to improve your efficiency while using Vim and demonstrate its versatility. 

## Before You Begin

1. Most Unix distributions come pre-packaged with Vim. To check, simply type `vim` in the terminal. If you receive an error message, install Vim using your Linux distribution's package manager.

  **Fedora/RHEL based**

        sudo yum install vim

  **Debian based**

        sudo apt install vim

  **Arch Linux**

        sudo pacman -Syy vim

2. A working knowledge of Vim's editing commands is not required to complete this tutorial, but may be helpful. An excellent method of gaining familiarization with the basics of Vim is to work through its built-in tutorial. The tutorial provides a hands-on introduction to Vim's editing commands, and allows you to practice what you learn within the Vim environment. To begin, type `vimtutor` from the terminal.

# Customizing Your Vim Instance


