---
deprecated: false
author:
  name: Joseph Dooley
  email: jdooley@linode.com
description: 'Mark Down Reference Guide'
keywords: 'style guide, write for us, linode library, article submissions, mark down,'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Friday, January 2nd, 2014
modified_by:
  name: Joseph Dooley
published: 'Friday, January 2nd, 2014'
title: Mark Down Quick Reference
---

At Linode, we use [PHP Markdown Extra](https://michelf.ca/projects/php-markdown/extra/). We even created some custom classes of our own. Use the tables below to get started writing your first Linode guide. Feel free to copy and paste from the left hand column into a text editor.

To preview Markdown, find a Markdown interpreter. Try [Nottingham](http://clickontyler.com/nottingham/), a simple, free notepad for Mac; `cmd + shift + p` to preview. For more advanced text editors, try [TextMate](http://macromates.com) or [Sublime Text](http://www.sublimetext.com/).

##Markdown



###Text Highlighting

{: .table .table-striped .table-bordered }
| Formatting    |  Example    |
|:--------------|:------------|
| \*italics\*   | *italics*   |
| \`highlight\` | `highlight` |
| \*\*bold\*\*  | **bold**    |
|:--------------|:------------|

For code blocks, we use unformatted text blocks by prepending an indent of four spaces:

    Like this.

###Headings

{: .table .table-striped .table-bordered }
| Formatting                |  Example                                      |
|:--------------------------|:----------------------------------------------|
| \#Main Title or h1        | <font size="6">Main Title or h1</font>        |
| \#\#Primary Section or h2 | <font size="5">Primary Section or h2</font>   |
| \#\#\#Sub-section or h3   | <font size="4">Sub-section or h3</font>       |


###Lists

{: .table .table-striped .table-bordered }
| Formatting                |  Example                                      |
|:--------------------------|:----------------------------------------------|
| - For bullet points,<br>* Or unordered lists,<br>+ Use hyphens, asterisks,<br>+ Or plus symbols.      | <span>&bull; For bullet points<br>&bull; Or unordered lists,<br>&bull; Use hyphens, asterisks,<br>&bull; Or plus symbols |
| 1.  A numbered list.<br>2.  Two spaces after the period.<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Eight spaces for a indentation within.<br>3.  Above, an indented command. | ![](/docs/assets/example-numbered-list.png) |

###Links and Images

{: .table .table-striped .table-bordered }
| Formatting                                                                    |  Example                                      |
|:------------------------------------------------------------------------------|:----------------------------------------------|
| \[Mask text link.](https://www.linode.com)                                    | [Mask text link.](https://www.linode.com)     |
| \[\!\[Image text.](/docs/assets/resized-sample.png)](/docs/assets/sample.png) | <img src="/docs/assets/example.png">  |

###Tables and Separated Quotes


{: .table .table-striped .table-bordered }
| Formatting                                                                        |  Example                                      |
|:----------------------------------------------------------------------------------|:----------------------------------------------|
\|  Left-Aligned    \| Centered      \| Right-Aligned     \|<br>\| ---------------- \|:-------------:\| ----------------: \|<br>\| Columns,         \| both          \| headers           \|<br>\| and              \| line items,   \| are aligned       \|<br>\| by the hypens    \| and colons     \| above.            \|<br> | <img src="/docs/assets/example-markdown-table.png"> |
| > To separate text, use right angle brackets. <br> Break in separated text. <br>> Some more separated text. | <img src="/docs/assets/example-separated-quote.png"> |


##Custom Linode Class Tags

###Notes and Cautions

{: .table .table-striped .table-bordered }
| Formatting                |  Example                                      |
|:--------------------------|:----------------------------------------------|
| {: .note}<br>><br>> This is a sample note.<br> | <img src="/docs/assets/example-note.png"> |
| {: .caution}<br>><br>> This is a sample caution.<br> | <img src="/docs/assets/example-caution.png"> |


###Custom Tables

<table class="table table-striped table-bordered">
  <thead><th>Formatting</th><th>Example</th></thead>
  </tr>
  <tr>
    <td>
{: .table .table-striped}
<br>
| Left-Aligned | Centered     | Right-Aligned |
<br>
| ---------------- |:-------------:| -----------------:|
<br>
| Columns,&nbsp;&nbsp;&nbsp;&nbsp; | both&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| headers &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|
<br>
| and &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | line items, | are aligned &nbsp;&nbsp;|
<br>
| by the hypens | and colons | above. &nbsp;&nbsp;&nbsp; |
    </td>
    <td>
    <img src="/docs/assets/example-blue-stripe-table.png">
    </td>
  </tr>  
</table>
