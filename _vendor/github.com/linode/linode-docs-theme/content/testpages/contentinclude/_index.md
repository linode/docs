---
title: "Content Include Test Pages"
layout: content-only
---

## Content

{{% content "/testpages/contentinclude/includeme" %}}

The `content` shortcode above[^mainnote] uses `.RenderShortcodes`. 

Having all rendered as one big Markdown document have several benefits:

* Less formatting surprises (e.g. code block on 4 space indentations)
* A complete static view of the headings/fragments used on a page.
* A common context for footnotes and references (see examples).

[outerreference]: http://www.example.com


[^outernote]: A note from the including content.
[^mainnote]: A note from the main content.

