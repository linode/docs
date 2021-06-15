---
slug: commenting-in-python
author:
  name: Linode Community
  email: docs@linode.com
description: 'A how-to guide on commenting in Python 3 correctly, with an additional portion discussing commenting incorrectly and why not to do that.'
og_description: 'A how-to guide on commenting in Python 3 correctly, with an additional portion discussing commenting incorrectly and why not to do that.'
keywords: ['python3', 'python', 'commenting', 'code', 'programming language']
tags: ["python"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-05-21
modified_by:
  name: Linode
title: "How to Comment in Python"
h1_title: "Creating Comments in Python"
enable_h1: true
external_resources:
- '[Python Software Foundation](https://www.python.org/)'
- '[Python Programming at Wikibooks](https://en.wikibooks.org/wiki/Python_Programming)'
---

Python was developed in the late 1980s, released in 1991, and is an interpreted, high-level and general-purpose programming language that emphasizes code readability. Python 3, released in 2008, is the current version.

Leaving informative comments on any code is important, as it helps others understand what the developer intended to do (or even reminds the developer themselves) and documents the code’s functionality. This guide will highlight how comments are left in python3 code.


## Before You Begin

1.  This guide assumes you have a Linode set up. If not, then familiarize yourself with our [Getting Started](/docs/getting-started/) guide to create and complete the basic installation steps for your Linode.

2.  This guide assumes your Linode is running Python 3 or has a Python Virtual Environment installed. If not, then see our [Python guides](https://www.linode.com/docs/guides/development/python/) to find instructions for installing on your preferred Linux distribution.

2.  Finally, this guide assumes you have a basic knowledge of Python and are comfortable editing using a text editor. If you are new to Python, then see the Python Software Foundation's ["Python for Beginners"](https://www.python.org/about/gettingstarted/) guide for more information on what Python is, what it can do, and how to learn to use it.

## Making Comments in Python

Python, like other languages, uses a special character or sequence of characters to indicate a comment. In Python's case, the hash (#) character is used to note that the line is a comment (the Python parser later removes these lines).

### One Line Comments

For example, a one-line comment would place the hash character and one character of white space (`# `) at the start of a line and looks like this:
    {{< file "comment.py" python >}}
    # I like my eggs with a side of Spam

    print('Eggs with a side of Spam.')
    {{< /file >}}

It is also convenient to use the hash character to "comment out" any code that may be going through testing or debugging:
    {{< file "testing.py" python >}}

    # print('Eggs with a side of Spam.')
    {{< /file >}}

### Inline Comments

Inline comments can be made but should be done cautiously. Inline comments will need to go after the code on a single line:
    {{< file "inlinecomment.py" python >}}
    print('Eggs with a side of Spam.') # I like my eggs with a side of Spam
    {{< /file >}}

### Multiline or Block Comments

The process for creating multiline comments is the same as a series of one-line comments stacked together, with each line of the comment starting with the hash character:
    {{< file "multilinecomment.py" python >}}
    # I like my eggs with a side of Spam
    # I should also be courteous when asking for something

    print('I would like eggs with a side of Spam, please.')
    {{< /file >}}

#### Another Way to Make Multiline Comments

While not recommended, multiline comments can also be created using a delimiter that defines a text string constant:
      {{< file "alternatemultilinecomment.py" python >}}
      """
      I like my eggs with a side of Spam.
      I should also be courteous when asking for something.
      """

      print('I would like eggs with a side of Spam, please.')
      {{< /file >}}

This is not the official or recommended way of handling multiline comments because, as it's a string constant, it could cause issues with your code. It is mentioned in this guide only because it is possible to find code from others that have used it. It is recommended that you only use the official method.
