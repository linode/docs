---
author:
  name: Edward Angert
  email: docs@linode.com
description: 'Use GNU nano to edit text and system files from the command line.'
keywords: ["nano", "terminal", "command line", "shell"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['quick-answers/use-nano-to-edit-files-in-linux/']
published: 2017-05-04
modified: 2017-05-04
modified_by:
  name: Edward Angert
title: 'Use nano to Edit Files in Linux'
external_resources:
 - '[Using nano](/docs/tools-reference/tools/using-nano)'
 - '[nano help](https://www.nano-editor.org/dist/v2.8/nano.html)'
 - '[Emacs, nano, or Vim: Choose your Terminal-Based Test Editor Wisely](https://medium.com/linode-cube/emacs-nano-or-vim-choose-your-terminal-based-text-editor-wisely-8f3826c92a68)'
---

GNU nano, or more commonly, nano is the basic, built-in editor for most Linux distributions. In this QuickAnswer, we'll cover some of the essentials to help you get started.

To learn more, visit our full guide on [using nano](/docs/tools-reference/tools/using-nano).

## Use nano to Open a System File

From the terminal, enter `nano` and the file name. If the file doesn't exist, nano will create a new, temporary version in the location you specify. In this example, we'll use `sudo` permissions to open the system's hosts file:

    sudo nano /etc/hosts

The above example opens the system hosts file, similar to the following:

![Ubuntu hosts file in nano](/docs/assets/nano-hosts-ubuntu.png "Ubuntu hosts file in nano")

In the default view, nano displays the file being edited in the center of the top *Titlebar*. At the bottom, the *Shortcut List* shows commonly used commands where `^` stands for the **CTRL** key. To save, hold **CTRL** and press **O** (for Write *O*ut); to exit, **CTRL+X**.

Notice that some commands induce the *Statusbar*, at the bottom, directly above the Shortcut List. For example, the Statusbar appears when saving files and running searches (**CTRL+W**).

## Helpful nano Shortcuts

* **^W**: Search within the open file
  * **ALT+W**: Find the next instance of the search
* **^O**: Save the file
* **^K**: Cut the entire line
  * **^U**: Paste the entire line
* **^T**: View the file browser
* **^X**: Exit

