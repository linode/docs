--- 
slug: pandoc-document-converter
author:
  name: Pierce Devol
aliases: ['/tools-reference/tools/']
show_in_list: true
description: '' 
og_description: ''
keywords: ['']
tags: ['pandoc']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-12-29 
modified_by:
  name: 
title: "Pandoc Document Converter" 
h1_title: "Pandoc Document Converter:"
enable_h1: true
contributor:
    name: Pierce Devol
---

# Convert from Markdown to HTML

Use the `pandoc` command-line utility to convert from Markdown to HTML.
A basic pandoc command follows the following syntax:

    pandoc -f INPUT_FORMAT -t FORMAT -o OUTPUT_FILE.html INPUT_FILE.md

For example:

    pandoc -f markdown -t html -o file.html file.md

In this example, `pandoc` is told to convert `file.md` from markdown (`-f markdown`) to HTML (`-t html`) and save it as `file.html`.

Pandoc assumes the file format based on the file extension if no format is specified with `-f` or `-t`. For example:

    pandoc -o file.html file.md


Pandoc can convert to and from the various flavors of markdown. Pandoc uses Pandoc's Markdown by default. If you experience conversion troubles converting from markdown, use `-f markdown_strict` instead or use an extension.

## Customize your output

Pandoc allows users to set customization options through in-line arguments.
In additon, Pandoc also accepts template files to specify parameters.

## X to JSON
[pandoc.org]: https://pandoc/org
 
[Pandoc's Markdown]: 
