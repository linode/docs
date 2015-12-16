---
author:
  name: Linode
  email: docs@linode.com
description: 'The Linode Guides & Tutorials style guide for article submissions'
keywords: 'style guide,format,formatting,how to write,write for us,write for linode,linode library,submissions'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['style-guide/']
modified: Wednesday, December 16th, 2015
modified_by:
  name: Linode
published: 'Wednesday, January 15th, 2014'
title: Linode Writer's Formatting Guide
---

Submissions which adhere to the following formatting guidelines are more likely to be accepted than those which do not, so review this page carefully. If you have any questions, contact <contribute@linode.com>.

## General Layout

Linode Guides & Tutorials are written in [PHP Markdown Extra](https://michelf.ca/projects/php-markdown/extra/). Additional Linode-specific markdown formatting notes are given [further below](#linode-specific-formatting), and submissions should be a `.md` file.

### Header

Linode Guides & Tutorials store metadata and other information in a header at the top of every page. Use the template below for your own guide.

{: .file-excerpt}
Author Submission
:   ~~~
    ---
    author:
      name: Linode Community
      email: docs@linode.com
    description: 'Two to three sentences describing your guide.'
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

    *This is a Linode Community guide. Write for us and earn $250 per published guide.*
    <hr>
    ~~~

### Introduction

Introductions should be concise; explain what the goal of the guide is and why. If you're introducing new software to the system, include a brief description and link to its official website whenever possible.

### Before You Begin

The *Before You Begin* section is a basic area of prerequisites a reader should know or have completed before proceeding further in your guide. Use the template below and edit as needed.

{: .file-excerpt}
Author Submission
:   ~~~
    ## Before You Begin

    1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

    2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet--this guide includes firewall rules specifically for an OpenVPN server.

    3.  Update your system.

            sudo apt-get update && sudo apt-get upgrade

    {: .note}
    >
    >This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
    ~~~

### Paragraph Structure

Guides should be split into cohesive sections which flow from one sequence of events to the next. Each section title should be styled with an *H2* heading element, and each subsection with an *H3* heading. Capitalize each noun, adjective, verb and adverb in the article title, H2 and H3 headers.

Each section/subsection should be split into numbered steps as needed. Scanning the *In This Guide* left sidebar should give the reader an overview of what will be done in the guide.

For example:

~~~
## Using MySQL

1.  Log in to MySQL as the root user:
        mysql -u root -p

2.  When prompted, enter the root password.

### Create a New MySQL User and Database

1.  In the example below, `testdb` is the name of the database, `testuser` is the user, and `password` is the user’s password.

        create database testdb;
        grant all on testdb.* to 'testuser' identified by 'password';

2.  Exit MySQL.

        exit

### Create a Sample Table

1.  Log back in as `testuser`:

        mysql -u testuser -p
~~~

{: .note}
>
>The tab size is set to four, and **only** soft tabs should be used. This can be configured in the settings of most text editors.

## Linode-Specific Formatting

### Abbreviations and Acronyms

Upon first mention of a new concept or software, use the full name or term, then note the abbreviation or acronym in parenthesis beside it. The abbreviation/acronym can then be used in the article from that point. For example: Lightweight Resource/Provider (LWRP).

### Bold and Italics

Use a **Bold** font weight for buttons, menu selections, important terms and words that require emphasis and anything that you want to stand out to the reader. *Italicize* new terms and concepts the first time they are used.

### Cautions

If a step in your guide can cause any major issues with the user's Linode or computer, a caution note should be included.

For example:

    {: .caution}
    >
    >If improperly configured, your Linode will not reboot.

{: .caution}
>
>If improperly configured, your Linode will not reboot.

### Commands

Commands that are not inline with paragraph text should be indented one tab from the beginning of the copy.

For example:

    Update your system:

        yum update

>Update your system:
>
>     yum update

Inline commands should be denoted by backtics (**`**):

    Update your system by running `yum update`.

>Update your system by running `yum update`.

### Example IP Addresses

Example IPs should use the documentation address blocks given in IETF [RFC 5737](https://tools.ietf.org/html/rfc5737). These are:

* 192.0.2.0/24
* 198.51.100.0/24
* 203.0.113.0/24

### External Resources/More Information

If you wish to provide links to external sites for the user to review after going through your guide, do so using the *extenral_resources* field in the [page header](#header). This will appear as a text block with links at the bottom of the page.

>More Information
>
>You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.
>
>- [Link Title 1](http://www.example.com)
>- [Link Title 2](http://www.example.net)

### Files and File Excerpts

Use the *file* format when adding the content of a whole file to a guide. If only a part of the file is being shown, use the *file excerpt* format. Exceptionally long files should be shown in parts and have the whole file linked, if needed.

Within the file formatting, a code language or syntax should be defined at the end of the `:   ~~~` line to set how the text is displayed. A list of supported languages with examples can be found [here](http://rouge.jayferd.us/demo).

Example: File format

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

Example: File Excerpt format

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

Inline file paths should be unformatted text.

For example:

    Navigate to `/var/www/html`.

>Navigate to `/var/www/html`.

### Images

Images should be in *.png* or *.jpg* format. If an image is over 650 pixels wide, include both the original **and** one which is scaled down to 650 px. Image filenames cannot contain spaces and should use hyphens (-) to separate words instead of underscores (_).

When adding an image, ensure that all identifying attributes such as names and IP addresses are removed, obfuscated, or replaced with dummy text, such as **example_user** or **192.0.2.0**. Be mindful of metadata in images taken with mobile devices.

To insert an image up to 650 px wide:

    ![description](/docs/assets/filename.png)

To link a 650 px wide image to its original size:

    [![description](/docs/assets/filename_small.png)](/docs/assets/filename.png)

### Key Combinations

When instructing to use a combination of keys, format them in bold.

For example:

    Press **CTRL+N** then **X** to exit the program.

>Press **CTRL+N**, then **X** to exit the program.

### Links

Internal links to other Linode guides should be relative, starting at `/docs/`:

    [Getting Started](/docs/getting-started)

External links should be formatted as shown below and use HTTPS URLs whenever possible:

    [Apache HTTP Server Documentation](https://httpd.apache.org/docs/)

### Lists

Be sure that lists have the proper horizontal spacing. This should be two spaces for ordered lists, three for unordered.

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

Notes should be important text that does not necessarily fit the narrative of the preceeding step or paragraph.

    {: .note}
    >
    >This is a note.

{: .note}
>
>This is a note.

### Numerical Values

- **1-10**: Written out as text (one, two, three, etc.)
- **Greater than 10**: Numerical digits (11, 23, 46)

### Sentence Spacing

Use single spaces between sentences; do not double-space.

### Variables

Variables that the reader will need to change for their system or preference should be formatted using backtics. Do not include any brackets or parentheses when using these temporary values in examples, as the reader may include them in their final version.

For example:

    Change the `password` and `username` values.

>Change the `password` and `username` values.