---
deprecated: false
author:
  name: Linode
  email: docs@linode.com
description: 'The Linode Library style guide.'
keywords: 'style guide, write for us, linode library, article submissions'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Thursday, August 25th, 2014
modified_by:
  name: Alex Fornuto
published: 'Wednesday, January 15th, 2014'
title: Style Guide
---

So you're interested in writing for us — great! New articles need to match the style and tone of existing Linode Library guides. Before you put keyboard to cursor, take a look at these guidelines.

# Content

The introduction for your guide should focus on two things:

-   What your reader will accomplish if they follow it
-   Why they would want to

Example use case scenarios are great introductory material. Here's an example of an article with a [great introduction](/docs/rescue-and-rebuild).

After the introduction, your guide should be 90% instruction and 10% explanation. Jump into the nitty-gritty, and provide just enough "Hmm, what's this?" for people who aren't familiar with the technology. If you want to, you can add an **About Technology X** section that goes into more theory and background, but the majority of the article should be free from geeky rambling.

Aim for an appropriate level of technical difficulty. For example, an article about mail clients should be beginner-friendly, while an article about load-balancing across multiple servers can assume more sysadmin experience. Still, even in a more advanced article, don't skimp on the instructions. You can always link to a different article for those who need it, so you don't end up on a rabbit trail away from your main topic.

Instructions should be straightforward, technically accurate, and thoroughly tested. Skip shortcuts and err on the side of clarity, security, and best practices.

# Tone

The tone we use in the Library is friendly and informational — the kind of tone you would use to explain something to a friend, while still getting down to business. A little informality is encouraged, but make sure you use proper spelling and grammar. Here's an example of an article with a [beginner-friendly tone](/docs/migrate-from-shared). Here's an example of an article written for [an advanced audience](/docs/email/postfix/email-with-postfix-dovecot-and-mysql).

Use short, direct sentences, especially when you're writing a single step in a set of instructions.

Be concise.

# Formatting

First, a few housekeeping points about file types:

-   Use [PHP Markdown Extra](https://michelf.ca/projects/php-markdown/extra/) or plain text formatting
-   Submit your final article as a Markdown file (**.md**) or plain text file (**.txt**)

Section titles should provide an at-a-glance outline of the article. Just by reading the table of contents, a reader should be able to grasp all the topics in the article, and click to jump to the most relevant section. If you use subsections, make sure you have at least two titles that belong in the lower level. Create section titles like this:

    # Section 1 

    Some text.

    ## Subsection 1 


    More text.

    ## Subsection 2 

    Final text.

When you provide step-by-step instructions, list them as numbered steps. Each task, even small ones, should get its own number.

    1. First step.
    2. Second step.
    3. Third step.

Use **bold** text for the names of links, buttons, variables, and other text you point out to the user. Use *italic* text to introduce new terms. Use `inline code blocks` for code samples.

    **bold**
    *italic*
    `unformatted`

If you're writing about software with a GUI (graphical user interface), please include images (**.png** or **.jpg**). The maximum width for an image is 650 pixels. If you have a larger image, send the original and the resized version. The text for including an image is as follows:

    [![Image description](/docs/assets/image-resized.png)](/docs/assets/image.png)


If you reference outside materials, provide a link:

    [link text](http://example.com)

You can find more formatting instructions and detailed examples on the [PHP Markdown Extra](https://michelf.ca/projects/php-markdown/extra/) website, but the tips above should be enough to get you started!

# Topic List and Submission Instructions

Send article submissions to <contribute@linode.com> or create a pull request on [GitHub](https://github.com/linode/docs). For more instructions, and to see a topic list, please visit the [Article Submissions](/docs/contribute) guide.

Thanks for writing for us! We hope to hear from you soon.



