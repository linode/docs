---
slug: use-nano-text-editor-commands
author:
  name: Linode
  email: docs@linode.com
description: This tutorial will teach you how to install the Nano text editor and use it to create and edit files in Linux.
og_description: This tutorial will teach you how to install the Nano text editor and use it to create and edit files in Linux.
keywords: ["nano", "text editor"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/tools-reference/tools/using-nano/','/linux-tools/text-editors/nano/','/tools-reference/tools/use-nano-text-editor-commands/']
modified: 2021-02-01
modified_by:
  name: Linode
published: 2011-11-08
title: How to Use Nano Text Editor Commands in Linux
tags: ["linux"]
---

# How to Use Nano Text Editor Commands in Linux

GNU nano is a popular command-line text editor that is included in most Linux distributions. Its interface is comparable to GUI-based text editors, which makes it a popular choice for those who find vi or emacs commands non-intuitive. This guide shows you how to use Nano Text Editor Commands in Linux. 


## Nano Set Up and Basic Commands

Nano is included with many Linux distributions by default, but some users may need to install it through their distribution’s [package management](https://www.linode.com/docs/using-linux/package-management/) tool:


### How to Install Nano Text Editor in Linux? 

**Debian/Ubuntu**:

apt install nano

**CentOS/Fedora**:

yum install nano


### Command Keys

When using nano, control characters (CTRL) are represented by a carat (^). For example, if you wish to cut a line of text, you would use the “CTRL” key followed by the “K” key. This sequence of commands is represented as ^K in nano. Some commands use the “Alt” key in order to function, which is represented by the letter “M.” 

A command represented as M-R in nano would be performed by pressing the “Alt” key followed by the “R” key. Mac users may need to use the “Escape” (Esc) key instead of the “Alt” key to use these commands.


## Using Nano to Create And Open Files in Linux


### Create a New File using Nano

Typing nano without any arguments will open a blank file for editing:

nano

This will open up a blank new file in your terminal like below:



<p id="gdcalert1" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image1.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert2">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image1.png "image_tooltip")


You can make changes to this file. You may exit this file by pressing Ctrl + X. It prompts you to save your file and name it before you exit. 

**Note**: It only prompts you if actual changes were made to the file, else you simply exit the editor and you get no prompts.

Once prompted, select press “Y” and then write the name of your file. 



<p id="gdcalert2" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image2.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert3">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image2.png "image_tooltip")


After you enter a filename, press “enter” to save your file. We saved it as a tutorial.txt, and here’s what we have stored in it: 



<p id="gdcalert3" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image3.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert4">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image3.png "image_tooltip")



### Open an Existing File Using Nano

To open a file, pass the filename as an argument in the following command:

nano &lt;filename>

This opens an existing file within your current working directory. 

Let’s practice that using the file in our current working directory we created earlier tutorial.txt 

nano  tutorial.txt

If you wish to open a file in a different directory, you can provide a path instead. To do that, we change our current working directory on Linux and go to our home(/). Our path to tutorial.txt is /nano-text-editor-tutorial/tutorial.txt 

To edit tutorial.txt use this command: 

nano /nano-text-editor-tutorial/tutorial.txt

If tutorial.txt does not exist in /nano-text-editor-tutorial/, nano creates a file named tutorial.txt in there. 

You can also open files at a specific line or column number:

nano +2 /nano-text-editor-tutorial/tutorial.txt

nano +LINE,COLUMN /nano-text-editor-tutorial/tutorial.txt

To open a file as read-only:

nano -v myfile


### Open Configuration Files Using Nano

When editing files used to configure applications or system utilities, start nano with the -w flag:

nano -w /etc/mysql/my.cnf

This flag will prevent nano from wrapping lines that are too long to fit on your screen, which can create problems if config directives are saved across multiple lines.


## Edit Files Using Nano Text Editor in Linux 

Type nano to enter Nano Text Editor. Use the arrow keys to move the cursor. A partial menu of available commands is displayed at the bottom of the terminal window.


### Why Edit Files in Linux Using Nano? 

Editing files in Linux using Nano is popular as compared to other editors like Vim because Nano’s GUI makes it very easy to edit, save and interact with your files. On other editors like Vim, one has to change to edit mode to input text. 


### Cut and Paste Lines of Text Using Nano

To cut a line of text, enter “^K.” To paste, move the cursor where you want the text to be placed and use “^U.” To cut multiple lines, use a series of “^K” commands until all lines you wish to cut have been removed. When you go to paste them back with “^U,” the lines will all be pasted at once.


### Valid Shortcuts in Nano Text Editor 

To open up a list of any sort in Nano, when in a file editor, e.g. the tutorial.txt file below, enter “Ctrl+G.”



<p id="gdcalert4" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image4.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert5">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image4.png "image_tooltip")


Once you do that, Nano help menu opens up and  shows you the following commands



<p id="gdcalert5" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image5.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert6">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image5.png "image_tooltip")


^G    (F1)      Display this help text

^X    (F2)      Close the current file buffer / Exit from nano

^O    (F3)      Write the current file to disk

^R    (F5)      Insert another file into the current one

^W    (F6)      Search forward for a string or a regular expression

^\    (M-R)     Replace a string or a regular expression

^K    (F9)      Cut the current line and store it in the cutbuffer

^U    (F10)     Uncut from the cutbuffer into the current line

^J    (F4)      Justify the current paragraph

^T    (F12)     Invoke the spell checker, if available

                Invoke the linter, if available

                Invoke formatter, if available

^C    (F11)     Display the position of the cursor

^_    (M-G)     Go to line and column number

M-U             Undo the last operation

M-E             Redo the last undone operation

M-A   (^6)      Mark text starting from the cursor position

M-6   (M-^)     Copy the current line and store it in the cutbuffer

M-]             Go to the matching bracket

M-W   (F16)     Repeat the last search

M-▲             Search next occurrence backward

M-▼             Search next occurrence forward

^B    (◀)       Go back one character

^F    (▶)       Go forward one character

^◀    (M-Space) Go back one word

^▶    (^Space)  Go forward one word

^A    (Home)    Go to beginning of current line

^E    (End)     Go to end of current line


### Search Text Using Nano

To search for text in a document, enter “^W.” This will open a search prompt and a submenu of search-specific commands.

^G Get Help         ^Y First Line       ^T Go To Line       ^W Beg of Par       M-J FullJstify      M-B Backwards

^C Cancel           ^V Last Line        ^R Replace          ^O End of Par       M-C Case Sens       M-R Regexp

To show this, let’s make some changes to our existing tutorial.txt file and save it with the following text in it: 

test 1

test 2

test 3

test 4

Linode1

Linode2

Linode3

Linode4

Linode-end



<p id="gdcalert6" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image6.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert7">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image6.png "image_tooltip")


Let’s search for any word that contains “end.” To do so, we enter “Ctrl+W” and it opens an option to search. We now see an option to search at the bottom of the Nano editor: 



<p id="gdcalert7" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image7.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert8">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image7.png "image_tooltip")


Write “end” in this and press enter and to see the text that contains “end” in it. In our case, doing this highlights Linode-end. If there were multiple words that had “end” in them, you could move to other search results by using “Alt+W” to see the next match. 



<p id="gdcalert8" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image8.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert9">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image8.png "image_tooltip")


**Go to Line Number**

To go to a line number, enter “^T” at the search prompt and enter the line number itself.

**Find and Replace Text**

At the search menu, enter “Alt+R.” Enter the text to be replaced and press “enter,’ then enter the replacement text. You will be prompted to confirm the replacement for each instance found, or to select “All” to confirm all instances.

Let’s try that with “end” in the tutorial.txt file. Our goal is to find “end” in our tutorial.txt file and replace it with “launch”. To get started, press “Alt+R’ to see the following menu appear:



<p id="gdcalert9" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image9.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert10">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image9.png "image_tooltip")


Next, enter the text you want to replace. In our case, it is “end.” And, then press “enter.” 

Nano prompts us to enter the replacement text for “end” now. We want to replace “end” with “launch,” so we enter it here. 



<p id="gdcalert10" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image10.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert11">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image10.png "image_tooltip")


Next, Nano asks you for confirmation. Press “Y” and replace “end” with “launch.” 



<p id="gdcalert11" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image11.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert12">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image11.png "image_tooltip")
 \


Note: Nano’s editor highlights the text to be replaced as you can see in the image above.  


### Spell Check Using Nano

Nano has a built-in spell checking feature, but you will need to install the spell package:

Debian/Ubuntu:

apt install spell

CentOS/Fedora:

yum install spell

Once you have installed spell, you can use the spell checking feature by pressing “^T” while editing a file.


## Save Your Work  Using Nano

To save your work, use ^O or “WriteOut”. This will save the document and leave nano open for you to continue working.


### Save with Backups

Nano can create backups of files when you exit. These backups can be placed in a directory of your choice; by default, they are placed in the same directory as the modified file.

Using the -B option when starting nano will create backups of the file for you while using the -C option will allow you to specify the directory to place backup files in:

nano -BC ~/backups index.php

The command listed above will create a backup copy of index.php in the backups folder in the current user’s home directory.


## Exit Commands for Nano Text Editor

Enter “^X” to exit nano. If you have not saved your work, you will be prompted to save the changes or cancel the exit routine.



