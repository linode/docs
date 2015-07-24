---
author:
  name: Linode
  email: docs@linode.com
description: 'The Linode Guides & Tutorials style guide for article submissions'
keywords: 'style guide, write for us, linode library, article submissions'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Monday, June 29th, 2015
modified_by:
  name: Elle Krout
published: 'Wednesday, January 15th, 2014'
title: Style Guide
---

Interested in contributing to Linode's documenation? Great! Submitted articles should match the style of existing Linode Guides & Tutorials documents. Before you proceed, please review the following guidelines:


## Content

Guides should primarily be instruction on how to accomplish a task on or relating to a Linode or Linodes. When writing a guide think of both *what* the guide should accomplish and *why* the reader would want to use your guide. A guide should be 90% instruction with 10% explanation. Avoid going unnecessarily in-depth; short, to-the-point explainations are perfered.

When writing a guide consider the audience and the level of technical ability needed to complete each task. A guide for beginner's will take a certain amount more of hand-holding than a guide for an advenced user.

All guides should be straightfoward, technically accurate, and thoroughly tested. Considerations for security and best practices should also be considered.


### Tone

Guides should be informational, but friendly.  Use the active voice whenever possible, and contractions and pronouns are acceptable (in particular, the use of *you* in regards to the reader).

Guides can use technical jargon related to Linode, Linux, and other related tech. Use common sense -- if the jargon is related to a high-level concept that fewer people would know, then use a sentence or two to explain it.


## Format

Guides should be written in [PHP Markdown Extra](https://michelf.ca/projects/php-markdown/extra/), with additional Linode-specific markdown noted below.

Guides should be split into conhesive sections for ease-of-reading, and so the reader has a sense of what will be done in the guide while scanning the contents. Each section title should be styled with an **H2** tag, and each subsection with an **H3** tag. Each section/subsection should be split into numbered steps.

For example:

    ## Install and Configure Apache
    
    1. Ensure your system is up-to-date.
    
    2. Download Apache:
    
        apt-get install apache2
    
    3. Start Apache services:
    
        system apache2 start
    
    ### Configure Your MPM
    
    1. Open `apache2.conf`.

Please note that the tab size is set to four, and soft tabs should be used. This can be set in most writing programs.

### Header

Linode Guides and Tutorials uses the same style of header for all guides to store metadata and other information. Use the following as an outline for your own guide:

{: .file-excerpt}
Bounty Document
:   ~~~
    ---
    author:
        name: Linode Community
        email: docs@linode.com
    description: 'One-sentence article descriptions'
    keywords: 'list,of,keywords'
    license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
    published: 'Weekday, Month 00th, 2015'
    modified: Weekday, Month 00th, 2015
    modified_by:
        name: Linode
    title: 'Guide Title'
    contributor:
        name: Your Name
        link: Github/Twitter Link
    ---
    ~~~

### Additional Formatting

#### Abbreviations and Acronyms

Upon first mention in the doc, use the full name/term, then note the abbreviation or acronym in parenthesis beside it. The abbreviation/acronym can then be used in the article from that point.

**Example:** Lightweight Resource/Provider (LWRP)

#### Bold and Italics

Bold important terms and words that require emphasis, buttons, and anything that would assist the reader if it were to stand out.

Italicize new terms and concepts the first time they are used.

#### Cautions

Should any step in your guide cause any major issues with the user's Linode or computer if performed wrong, a caution note regarding the issue should be included.

For example:

    {: .caution}
    >
    >If improperly configured your Linode will not reboot.

{: .caution}
>
>If improperly configured your Linode will not reboot.

#### Commands

Commands that are not part of a sentence should be tabbed in one tab from the beginning of the copy.

For example:

    Update your system:

        yum update

>Update your system:
>
>     yum update

Commands that are inline should be denoted by backtics (**`**):

    Update your system by running `yum update`.

>Update your system by running `yum update`.

#### External Resources/More Information

If you wish to provide links to external resources for the user to review after going through the guide, do so by adding the following lines to the **header**:

    external_resources:
     - '[Link Title 1](http://www.example.com)'
     - '[Link Title 2](http://www.example.net)'

This will appear as a text block with links at the bottom of the page:

>More Information
>
>You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.
>
>- [Link Title 1](http://www.example.com)
>- [Link Title 2](http://www.example.net)

#### Files and File Excerpts

When adding the content of a whole file to the document use the file format. If only a part of the file is being shown, use the file excerpt format. Exceptionally long files should be shown in parts and the whole file linked, if needed. Within the file formatting, next to the `:   ~~~` line a code language can be defined to set how the text is displayed.

For example:

    {: .file}
    /path/to/file
    :   ~~~ conf
        <IfModule mpm_prefork_module>
            StartServers        2
            MinSpareServers     6
            MaxSpareServers     12
            MaxClients      80
            MaxRequestsPerChild     3000
        </IfModule>
        ~~~

>{: .file}
>/path/to/file
>:  ~~~ conf
>   <IfModule mpm_prefork_module>
>      StartServers     2
>      MinSpareServers  6
>      MaxSpareServers  12
>      MaxClients       80
>      MaxRequestsPerChild  3000
>   </IfModule>
>   ~~~

    {: .file-excerpt}
    /path/to/file
    :   ~~~ ini
        error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
        error_log = /var/log/php/error.log
        max_input_time = 30
        ~~~

>{: .file-excerpt}
>/path/to/file
>:  ~~~ ini
>   error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
>   error_log = /var/log/php/error.log
>   max_input_time = 30
>   ~~~

#### File Paths

All in-text file paths should be unformatted text.

For example:

    Navigate to `/var/www/html`.

>Navigate to `/var/www/html`.

#### Images

Images should be kept under 650 pixels in width. If larger, a thumbnail of the appropriate size should be created, and the full-sized image linked. When adding an image ensure that all identifying attributes such as names and IP addresses are removed or replaced with dummy text (such as **user** or **123.45.67.89**).

To insert an image 650 pixels in width or smaller:

    ![description](/docs/assets/filename.png)

To insert a larger image:

    [![description](/docs/assets/filename_small.png)](/docs/assets/filename.png)

#### Key Combinations

When instructing the reader to use a combination of keys, bold the keys in-text:

For example:

    Press **CTRL+N** then **x** to exit the program

>Press **CTRL+N** then **x** to exit the program

#### Notes

Notes should be important text that does not necessarily fit the narrative of the guide. Notes should be defined using the note format displayed below:

    {: .note}
    >
    >This is a note!

{: .note}
>
>This is a note!

#### Numerical Values

- **1-10**: Written out as text (one, two, three...)
- **Greater than 10**: Numerical digits (11, 23, 46)

#### Root vs. Non-root Users

Unless circumstances call for otherwise, guides should not be written for the root user.

When writing a guide for a non-root user include the following in your introduction:

    {: .note}
    >
    >This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

When writing a guide as root include the following in your introduction:

    {: .note}
    >
    >The steps required in this guide require root privileges. Be sure to run the steps below as **root** or with the `sudo` prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

#### Variables

Variables that need to be changed should be noted in-text and unformatted (using backtics (**`**).

For example:

    Change the `password` and `username` values.

>Change the `password` and `username` values.