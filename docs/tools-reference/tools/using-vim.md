VIM Basic Tutorial

What is VIM?

VIM is a popular command-line text editor. It is used by a lot of programmers and system administrators every day. In this tutorial, you will not learn to juggle with VIM. I will show just the basics to survive on the command line with VIM.

How I Install?

VIM is usually installed on most linux distributions. If VIM is not installed, simply run (on debian-like distributions): 

sudo apt-get install vim

Then, call from the command line:

vim teste.txt

What I Do Now?

VIM has basically two main modes: insert mode and command mode. As the VIM has no menus, all interactions with the editor are made through the command mode. To enter command mode, just press the esc key.

The insert mode serves for the insertion of text itself. To enter insert mode, press the esc key (to enter the command mode) and then press the i key.

Moving Around

Most often, the arrow keys are enabled, meaning you can navigate the text with the arrow keys. However, the default keys to navigate through the text are hjkl. where: 

k -> moves up 
j -> move down 
h -> move to left 
l -> move to right






Some more useful commands for navigation through the file:

$ -> moves to line end
x -> deletes current character
G -> moves to end of file
gg -> moves to beginning of the file 

Remembering that to navigate through the text using these keys, you must be in command mode.

Saving and Exiting

After editing our text, let's save it! To run the commands below, do not forget to enter the command mode (just press esc): 

:w -> saves the current file. 
:wq -> save the file and exit the editor. 
:q -> just exiting the editor. 
:q! -> Exit the editor without saving the current file.

Searching

VIM has a powerful search engine, with support for regular expressions and much more. 
To search for an occurrence in a file, just type in command mode: 

/pattern_search 

Where pattern_search can be a word or regular expression. 

After entering the pattern, press enter. The cursor will move to the first occurrence found. To navigate through the next occurrences, press n.

Split Window

VIM also has a feature to split the screen. So we can edit multiple files simultaneously, in the same window. 

To split the screen, just type :split filename. Where filename is the name of the file you wish to open. 

Typing just split the screen will split horizontally. To split the screen vertically, just replace split by vsplit. 

And to switch between open windows, just press CTRL A twice.

Learn More

VIM editor is an extremely powerful and you will find plenty of good documentation on the Internet. 

You can find more information by typing :help on command mode or visiting official VIM website. http://www.vim.org

