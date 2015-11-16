---
author:
  name: Linode
  email: docs@linode.com
description: 'The Linode Guides & Tutorials style guide for article submissions'
keywords: 'style guide,format,formatting,how to write,write for us,write for linode,linode library,submissions'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Wednesday, July 29th, 2015
modified_by:
  name: Lionde
published: 'Wednesday, January 15th, 2014'
title: Linode Writer's Formatting Guide
---

Interested in contributing to Linode's documentation? Great! Submitted articles should match the style and formatting of existing [Linode Guides & Tutorials](https://linode.com/docs/) documents. Submissions which adhere to the Linode Writer's Guide are more likely to be accepted than guides which do not, so review this page carefully.

If you have any questions, email <contribute@linode.com>.

## General Layout

Linode Guides and Tutorials are written in [PHP Markdown Extra](https://michelf.ca/projects/php-markdown/extra/) and submissions should be a `.md` file. Additional Linode-specific formatting notes are given [further below](#linode-specific-formatting).

### Header

Linode Guides and Tutorials store metadata and other information in a header at the top of every page. Use the following as an outline for your own guide:

{: .file-excerpt}
Author Submission
:   ~~~
    ---
    author:
      name: Linode Community
      email: docs@linode.com
    description: 'Two to three sentences describing your article.'
    keywords: 'list,of,keywords,and key phrases,'
    license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
    published: 'Weekday, Month 00th, 2015'
    modified: Weekday, Month 00th, 2015
    modified_by:
      name: Linode
    title: 'Guide Title'
    contributor:
      name: Your Name
      link: Github/Twitter Link
      external_resources:
    - '[Link Title 1](http://www.example.com)'
    - '[Link Title 2](http://www.example.net)'
    ---
    ~~~

### Before You Begin

The *Before You Begin* section is a basic area of prerequisites a reader should have completed before beginning your guide. Use the template below and edit or add as needed.

{: .file-excerpt}
Author Submission
:   ~~~
    ## Before You Begin

    1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

    2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the Creating a Firewall section--this guide has instructions for firewall rules specifcally for an OpenVPN server.

    3.  Update your system.

            sudo apt-get update && sudo apt-get upgrade
    ~~~

### Paragraph Structure

Guides should be split into cohesive sections which flow from one sequence of events to the next. Each section title should be styled with an **H2** tag (two `#` symbols), and each subsection with an **H3** tag (three `#` symbols). Each section/subsection should be split into numbered steps as needed, and scanning the *In This Guide* left sidebar should give the reader a sense of what will be done in the guide.

For example:

~~~
## Install and Configure Apache
    
1.  Ensure your system is up-to-date.
    
2.  Download Apache:
    
        sudo apt-get install apache2
    
3.  Start Apache services:
    
        sudo system apache2 start
    
### Configure Your MPM
    
1.  Open `apache2.conf`.
~~~

Please note that the tab size is set to four, and soft tabs should be used. This can be configured in the settings of most text editors.

## Linode-Specific Formatting

### Abbreviations and Acronyms

Upon first mention in the doc, use the full name/term for a new concept or software, then note the abbreviation or acronym in parenthesis beside it. The abbreviation/acronym can then be used in the article from that point.

For example: Lightweight Resource/Provider (LWRP)

### Bold and Italics

Bold important terms and words that require emphasis, buttons, and anything that would assist the reader if it were to stand out.

Italicize new terms and concepts the first time they are used.

### Cautions

If a step in your guide can cause any major issues with the user's Linode or computer, a caution note regarding the issue should be included.

For example:

    {: .caution}
    >
    >If improperly configured your Linode will not reboot.

{: .caution}
>
>If improperly configured your Linode will not reboot.

### Commands

Commands that are not inline should be indented one tab from the beginning of the copy.

For example:

    Update your system:

        yum update

>Update your system:
>
>     yum update

Commands that are inline should be denoted by backtics (**`**):

    Update your system by running `yum update`.

>Update your system by running `yum update`.

### Community Contribution 

Following the page header, your submission should include the following section:

~~~
*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>
~~~

### Example IP Addresses

Example IPs should use the documentation address blocks given in IETF [RFC 5737](https://tools.ietf.org/html/rfc5737):

* 192.0.2.0/24
* 198.51.100.0/24
* 203.0.113.0/24

### External Resources/More Information

If you wish to provide links to external sites for the user to review after going through the guide, do so using the *extenral_resources* field in the [page header](#header). This will appear as a text block with links at the bottom of the page:

>More Information
>
>You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.
>
>- [Link Title 1](http://www.example.com)
>- [Link Title 2](http://www.example.net)

### Files and File Excerpts

When adding the content of a whole file to the document use the *file* format. If only a part of the file is being shown, use the *file excerpt* format. Exceptionally long files should be shown in parts and have the whole file linked, if needed. Within the file formatting, a code language or syntax can be defined next to the `:   ~~~` line to set how the text is displayed. A list of all available languages and examples can be found [here](http://rouge.jayferd.us/demo).

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

{: .file}
/path/to/file
:  ~~~ conf
   <IfModule mpm_prefork_module>
      StartServers     2
      MinSpareServers  6
      MaxSpareServers  12
      MaxClients       80
      MaxRequestsPerChild  3000
   </IfModule>
   ~~~

File Excerpt:

    {: .file-excerpt}
    /path/to/file
    :   ~~~ ini
        error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
        error_log = /var/log/php/error.log
        max_input_time = 30
        ~~~

{: .file-excerpt}
/path/to/file
:  ~~~ ini
   error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
   error_log = /var/log/php/error.log
   max_input_time = 30
   ~~~

### File Paths

All inline file paths should be unformatted text.

For example:

    Navigate to `/var/www/html`.

>Navigate to `/var/www/html`.

### Images

Images should be in *.png* or *.jpeg* format. If an image is over 650 pixels wide, please send both the original and one which is scaled down to 650px. Image filenames cannot contain spaces. Use an underscore to separate words in image filenames. When adding an image ensure that all identifying attributes such as names and IP addresses are removed, obfuscated, or replaced with dummy text (such as **example_user** or **192.0.2.0**).

To insert an image up to 650px wide:

    ![description](/docs/assets/filename.png)

To link a 650px image to a larger one:

    [![description](/docs/assets/filename_small.png)](/docs/assets/filename.png)

### Key Combinations

When instructing the reader to use a combination of keys, format them in bold:

For example:

    Press **CTRL+N** then **X** to exit the program

>Press **CTRL+N** then **X** to exit the program

### Links

Internal links to other Linode guides should be relative, starting at `/docs/`:

    [Getting Started](/docs/getting-started)

Extenral links should be formatted as:

    [Apache's Documentation](http://httpd.apache.org/docs/)

### Lists

Be sure that lists have the proper horizontal spacing (two spaces for ordered lists, three for unordered).

Examples:

~~~
1.  Step 1.

2.  Step 2.

3.  Step 3.
~~~

~~~
*   Item 1.

*   Item 2.

*   Item 3.
~~~

### Notes

Notes should be important text that does not necessarily fit the narrative of the guide. Notes should be defined using the *note* format displayed below:

    {: .note}
    >
    >This is a note!

{: .note}
>
>This is a note!

### Numerical Values

- **1-10**: Written out as text (one, two, three...)
- **Greater than 10**: Numerical digits (11, 23, 46)

### Sentence Spacing

Use single spaces between sentences--do not double-space.

### Variables

Variables that the reader will need to change for their system or preference should be formatted using backtics.

For example:

    Change the `password` and `username` values.

>Change the `password` and `username` values.

Do not include any brackets or parenthesis when using these temporary values in examples, as the reader may include them in their final version.