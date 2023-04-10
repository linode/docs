---
slug: how-to-use-python-markdown-to-convert-markdown-to-html
description: 'This guide explains how to use the Python-Markdown library to convert markdown files to HTML.'
keywords: ['Python-Markdown','What is Python-Markdown','Python-Markdown Library','Convert Markdown to HTML']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-07-21
modified_by:
  name: Linode
title: "Use Python-Markdown to Convert Markdown to HTML"
external_resources:
- '[Python-Markdown website](https://python-markdown.github.io/index.html)'
- '[Python-Markdown library reference](https://python-markdown.github.io/reference/)'
- '[Python-Markdown extensions](https://python-markdown.github.io/extensions/)'
- '[Markdown page on Wikpedia](https://en.wikipedia.org/wiki/Markdown)'
- '[Markdown guide](https://www.markdownguide.org/)'
- '[HTML Standard](https://html.spec.whatwg.org/)'
- '[Python Input/Output documentation](https://docs.python.org/3/tutorial/inputoutput.html)'
authors: ["Jeff Novotny"]
---

The [*Markdown*](https://en.wikipedia.org/wiki/Markdown) markup language is a good choice for text formatting. Unfortunately, the Markdown syntax does not align with HTML conventions. Without further modification, Markdown can only be shared as plain text. The [*Python-Markdown*](https://python-markdown.github.io/index.html) library is an open source Python module that converts Markdown text into standards-compliant HTML markup. This guide explains how to install and use the Python-Markdown module and provides some background information about it.

## What is Markdown?

Markdown is a lightweight markup language. It has a simple, straightforward syntax and is designed to be highly readable. Markdown allows users to create standardized formatted text using any text editor. The Markdown syntax can stipulate headings, lists, tables, links, images, and text attributes. Markdown and HTML are not equivalent, but it is relatively easy to convert from one format to another.

Markdown is widely used in technical documentation, online help, blogging, publishing, and online forums. GitHub, Reddit, Stack Exchange, and many other sites use Markdown. Modern implementations follow the *CommonMark* standard, which resolves earlier issues and is unambiguous. *Markdown Extra* is an enhanced version of Markdown with many additional features.

## What is Python-Markdown?

Python-Markdown is a free and open source Python library for converting Markdown code to HTML markup. It can either accept interactive input or process a Markdown file. Python-Markdown follows the rules of the original Markdown specification as much as possible. Its behavior makes it suitable for use in web server environments.

Here are some of the main advantages of Python-Markdown:

-   It supports a large number of extensions to change or extend the behavior of the parser. For more details about the various extensions, see the [Python-Markdown extensions reference](https://python-markdown.github.io/extensions/).
-   It supports international character sets, including all Unicode-supported languages.
-   It is able to convert Markdown documents into either HTML or XHTML formats.
-   The Python-Markdown API can be incorporated into Python code or accessed from the command line.
-   It does not raise exceptions or write errors to standard output.

There are a few minor differences between the behavior of Python-Markdown and the official Markdown syntax rules. Some of the distinctions involve indentation and tab length and how consecutive lists are processed. For more information, see the [Python-Markdown documentation](https://python-markdown.github.io/index.html#differences).

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  Ensure Python is properly installed on the Linode. You must be able to launch and use the Python programming environment and have some basic knowledge of the Python programming language. For information on how to install and use Python, see the [Linode guide to Python](/docs/guides/how-to-install-python-on-ubuntu-20-04/).

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Install Python-Markdown

The Python-Markdown library can be installed using `pip`, a Python package for installing libraries. To install Python-Markdown, follow these steps. These instructions are designed for Ubuntu 22.04 LTS, but are generally applicable to all Linux distributions.

1.  Ensure `pip` is installed. To verify the `pip` release, use the following command.

    ```command
    pip -V
    ```

    {{< output >}}
pip 22.0.2 from /usr/lib/python3/dist-packages/pip (python 3.10)
    {{< /output >}}

2.  If `pip` is not installed, use `apt` to install it.

    ```command
    sudo apt install python3-pip
    ```

3.  Use `pip` to install the Python-Markdown library.

    ```command
    pip install markdown
    ```

    {{< output >}}
Successfully installed markdown-3.4.1
    {{< /output >}}

## How to Use Python-Markdown

There are several different ways to use Python-Markdown. It can be used interactively to translate small amounts of Markdown text to HTML markup. Functions from the library can also be incorporated into Python programs and scripts. Finally, Python-Markdown is available from the command line. This mode allows users to specify files for the raw Markdown input and the HTML output.

At the core of the `markdown` class is the `markdown` method. `markdown.markdown` accepts a string of Markdown text as a parameter and returns the HTML equivalent.

### How to Use Python-Markdown Interactively

After accessing the Python interactive shell, source the Python-Markdown library to activate the parser interface. This method is useful for learning purposes, software development, and testing.

To use Python-Markdown interactively, follow these steps.

1.  Enter the Python interactive shell. You should see the Python `>>>` prompt.

    ```command
    python3
    ```

2.  To access the Python-Markdown API, source the `markdown` module.

    ```command
    import markdown
    ```

3.  Pass the string of Markdown text to the `markdown.markdown` method as a parameter. Enclose the text inside single quotes. The method translates the Markdown text into HTML and displays the result.

    ```command
    markdown.markdown('## Work Tasks')
    ```

    {{< output >}}
'<h2>Work Tasks</h2>'
    {{< /output >}}

4.  For longer sections of Markdown, enclose the text in triple quotes. Triple quoting permits text to span multiple lines. The result is a long string of HTML markup.

    ```command
    markdown.markdown('''
    # To Do
    ## At Home
    * Wash dishes
    ## At Work
    * Finish Report
    ''')
    ```

    {{< output >}}
'<h1>To Do</h1>\n<h2>At Home</h2>\n<ul>\n<li>Wash dishes</li>\n</ul>\n<h2>At Work</h2>\n<ul>\n<li>Finish Report</li>\n</ul>'
    {{< /output >}}

5.  For properly formatted HTML, store the intermediate output in a temporary variable before printing it.

    ```command
    tempHTML = markdown.markdown('''
    # To Do
    ## At Home
    * Wash dishes
    ## At Work
    * Finish Report
    ''')
    print(tempHTML)
    ```

    {{< output >}}
<h1>To Do</h1>
<h2>At Home</h2>
<ul>
<li>Wash dishes</li>
</ul>
<h2>At Work</h2>
<ul>
<li>Finish Report</li>
</ul>
    {{< /output >}}

When done, you can exit the Python interactive shell using the **CTRL+D** key combination.

### How to Use Python-Markdown to Convert a Markdown File to HTML

The interactive method works well with short Markdown strings. For larger amounts of text, it is more efficient to read the Markdown code from a file.

There are two ways to convert a Markdown file to HTML output. The first technique creates a Python file object and reads the text into a temporary variable. It then uses the `markdown` method to convert the contents into HTML. When processing is complete, the program writes the final HTML code to a second file.

The second technique takes an even simpler approach. It invokes the `markdownFromFile` method to convert the Markdown file to HTML in a single step.

1.  To use the first method, create a file containing the original Markdown text. `List.md` is a Markdown file that expands the "To Do" list used in the previous section.

    ```file {title="List.md" lang="md"}
    # To Do
    ## At Home
    * Wash dishes
    * Install winter tires
    ## At Work
    * Finish Report
    * Book Team **101** meeting
    ```

2.  Create a short Python program named `mdConverter.py` to translate the Markdown file into HTML output. This program performs the following tasks:
    -   Imports the `markdown` library.
    -   Opens `List.md` using the file object `f`, and retrieves the contents using the Python `read` command. It stores the input in the `tempMd` variable.
    -   Translates the source material into HTML using `markdown.markdown` and stores the output in `tempHtml`.
    -   Writes the HTML markup to `List.html` using the Python `write` command.

    {{< note respectIndent=false >}}
Open the initial file in `r` (read) mode, and the second in `w` (write) mode. When handling files, use the `with` statement to ensure Python closes them later on. In actual practice, this program would prompt the user for the names of the Markdown and HTML files. For more information on file processing, see the [Python file documentation](https://docs.python.org/3/tutorial/inputoutput.html).
    {{< /note >}}

    ```file {title="mdConverter.py" lang="python"}
    import markdown
    # Open the file for reading and read the input to a temp variable
    with open('List.md', 'r') as f:
        tempMd= f.read()

    # Convert the input to HTML
    tempHtml = markdown.markdown(tempMd)
    # If necessary, could print or edit the results at this point.
    # Open the HTML file and write the output.
    with open('List.html', 'w') as f:
        f.write(tempHtml)
    ```

3.  Run `mdConverter.py` to generate the HTML output.

    ```command
    python3 mdConverter.py
    ```

4.  Use `cat` to print the contents of `List.html` and ensure the Markdown code was translated correctly.

    {{< output >}}
<h1>To Do</h1>
<h2>At Home</h2>
<ul>
<li>Wash dishes</li>
<li>Install winter tires</li>
</ul>
<h2>At Work</h2>
<ul>
<li>Finish Report</li>
<li>Book Team <strong>101</strong> meeting </li>
    {{< /output >}}

In many cases, no intermediate processing is required, and the program can be simplified to a few lines. The `markdownFromFile` method converts Markdown code into HTML output in a single step. It accepts an input file and output file as parameters. This approach does not require any file objects or intermediate variables.

Create a new Python program named `mdAutoConverter.py` and enter the following lines of code.

```file {title="mdAutoConverter.py" lang="python"}
import markdown

markdown.markdownFromFile(input='List.md', output='List.html')
```

Run the program using the command `python3 mdAutoConverter.py`. The contents of `List.html` should be identical to the file generated by `mdConverter.py`.

{{< note >}}
A file object can always take the place of an actual file name. So a program can generate a Markdown file and then pass the file object to `markdownFromFile`.

The Python-Markdown API can be used with one of the official extensions. For information on how to use the extensions, see the [Python-Markdown library reference](https://python-markdown.github.io/reference/).
{{< /note >}}

### How to Use Python-Markdown From the Command Line

Use Python's `-m` option to run the `markdown` module as a script from the command line. The script requires the name of the Markdown file. It writes the HTML results to either the console or an output file.

To write the HTML output to the console, run the `markdown` script. Append the name of the input Markdown file.

```command
python3 -m markdown List.md
```

Python translates the results to HTML and displays the output in the console window.

{{< output >}}
<h1>To Do</h1>
<h2>At Home</h2>
<ul>
<li>Wash dishes</li>
<li>Install winter tires</li>
</ul>
<h2>At Work</h2>
<ul>
<li>Finish Report</li>
<li>Book Team <strong>101</strong> meeting </li>
{{< /output >}}

To write the HTML output to a new file, use the `-f` option and specify the name of the output file.

```command
python3 -m markdown List.md -f List.html
```

To see which `markdown` options are available from the command line, append the `--help` flag.

```command
python3 -m markdown --help
```

## Conclusion

The Python-Markdown library is a Markdown parser for converting Markdown text to HTML markup. The library supports international language sets and several useful extensions. The parser routines can be used interactively or incorporated into Python programs. Python-Markdown can also run as a command line script.

The `markdown` method converts a string of Markdown text to HTML. In comparison, the `markdownFromFile` function reads a Markdown file and writes the HTML translation to a second file. For more information about the Python-Markdown library, see the [Python-Markdown website](https://python-markdown.github.io/index.html).