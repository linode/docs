--- 
title: "Pandoc Document Converter" 
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

The `-H` paramter inserts a file into the new document's header.
For example, the `-H` parameter can be used to insert CSS into an HTML file.

    pandoc -H example.css -f markdown index.md -t html -o index.html

In additon, you can use the `-B` and `-A parameters to insert text into the body of your document.For eample, use the `-A` paramter to insert a footer in additon to the CSS:

    pandoc -H example.css -A about.html -f markdown index.md -t html index.html

Note that `-H`, `-A`, and `-B` all pass the literal contents of a file. In the above example, the file specified is already in HTML to match the final output. 

Pandoc includes built in syntax highlighting options, for fenced code-blocks.
Pandoc includes a number of built in syntax highlighting schemes for a number of languages.
To see a list, run `pandoc --list-highlight-languages`. Add one of these languages to the end of the opening fence.

```markdown

    ~~~~~~sql
        select name from mainTable where city = 'Chicago'
    ~~~~~~
```

~~~~~~~~~~~sql
    select name from mainTable where city = 'Chicago'
~~~~~~~~~~~

Pandoc can automatically create a table of contents:

```bash

    pandoc -H example.css -f markdown index.md -t html -o index.html --toc
```

!(toc.png)

## Extract images from a Word doc 

## Create an epub

## create a presentation

[pandoc.org]: https://pandoc/org
 
[Pandoc's Markdown]: 
