---
slug: linode-writers-formatting-guide
description: 'This guide provides formatting and style guidelines for documentation and articles submitted to Linode from outside contributors via our Write for Linode program.'
keywords: ["style guide", "format", "formatting", "how to write", "write for us", "write for linode", "linode docs", "submissions"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/linode-writers-formatting-guide/','/linode-writers-guide/','/style-guide/']
published: 2014-01-15
modified: 2023-05-02
modified_by:
  name: Linode
title: Linode Writer's Formatting Guide
show_on_rss_feed: false
external_resources:
 - '[GitHub Beginners Guide](/docs/guides/a-beginners-guide-to-github/)'
 - '[Red Hat Writing Style Guide](http://stylepedia.net/)'
_build:
  list: false
authors: ["Linode"]
---

![Linode Writer's Formatting Guide](linode-writers-formatting-guide.png "Linode Writer's Formatting Guide")

## Write Guides for Linode

This guide provides templates and guidelines to use when creating or updating a guide for [Linode Docs](/docs/).

Updates, improvements, and bug fixes to Linode documentation are always welcome through [GitHub](https://github.com/linode/docs) via pull requests (PRs) or issues.

Through our Write For Linode program, authors can contribute new guides and be paid for their work. We ask that interested authors apply to the program with one or more writing samples so that we can evaluate your work. To learn more about the program and to complete an application, please visit our Write For Linode [program page](https://www.linode.com/lp/write-for-linode/).

## General Layout

Linode Guides & Tutorials are written in [Markdown](https://en.wikipedia.org/wiki/Markdown). Our documentation site uses [Hugo](https://gohugo.io), a static site generator. Hugo-specific Markdown formatting notes are given [further below](#markdown-formatting).

Markdown files for guides are stored under the `docs/guides/` content directory. This content directory is then further subdivided into categories for different technical topics. New guides should be placed with a category that they most closely align with. For example, if you are writing a new guide on the Apache web server, it would be placed under `docs/guides/web-servers/apache/`.

A new subdirectory is created for each guide. This subdirectory should contain a file called `index.md`, which will be where the guide's markdown is written to. For example, if your guide's title is `My Apache Guide`, then you would create its Markdown file at `docs/guides/web-servers/apache/my-apache-guide/index.md`.

A [Hugo archetype](https://gohugo.io/content-management/archetypes/) is available to create new Markdown files. For example, if you wanted to create the `My Apache Guide` example guide, you could run this command from inside your cloned docs repository:

```command
hugo new -k content docs/guides/web-servers/apache/my-apache-guide/index.md
```

### Header

Linode Guides & Tutorials store metadata and other information in a [YAML](http://yaml.org/) header at the top of every page. Use the template below for your own guide.

{{< note >}}
If you use the Hugo archetype command described in the previous section, the created Markdown file will be pre-populated with the frontmatter template below.
{{< /note >}}

```file {title="Author Submission" lang="yaml"}
---
slug: url-slug-for-your-guide
title: "Title of Your Guide (appears in H1)"
title_meta: "Title of Your Guide (appears in meta title tag)"
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Linode"]
published: 2023-03-07
modified_by:
  name: Linode
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---
```

If you're updating an existing guide in our repository, you may also notice a `deprecated` field in the header. This defaults to false, and setting it to *true* inserts a pre-written message near the beginning stating that the guide is no longer maintained. Typically, this will be used on guides specific to applications or distributions that have reached End of Life (EOL).

### Introduction

Introductions should be concise; explain what the goal of the guide is and why. If you're introducing new software to the system, include a brief description and link to its official website whenever possible.

### Before You Begin

The *Before You Begin* section is an area for basic prerequisites a reader should know or have completed before proceeding further in your guide. Use the example below and edit as needed:

```file {title="Author Submission"}
## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.
```

### Include a Note about Root or Non-Root users

```file {title="Guides Written for a Non-Root User" lang="txt"}
{{</* note */>}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{</* /note */>}}
```

```file {title="Guides Written for a Root User" lang="txt"}
{{</* note */>}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{</* /note */>}}
```

## Paragraph Structure

Guides should be split into cohesive sections which flow from one sequence of events to the next. Each section title should be styled with an *H2* heading element, and each subsection with an *H3* heading so that scanning the *In This Guide* left sidebar should give the reader an overview of what will be done in the guide. Capitalize each noun, adjective, verb and adverb in the article title, H2 and H3 headers.

Each **subsection** should be split into numbered steps as shown below.

For example:

```file {lang="md"}
## Using MySQL

1.  Log in to MySQL as the root user:

    ```command
    mysql -u root -p
    ```

1.  When prompted, enter the root password.

### Create a New MySQL User and Database

1.  In the example below, `testdb` is the name of the database, `testuser` is the user, and `password` is the user’s password.

    ```command
    create database testdb;
    grant all on testdb.* to 'testuser' identified by 'password';
    ```

1.  Exit MySQL.

    ```command
    exit
    ```

### Create a Sample Table

1.  Log back in as `testuser`:

    ```command
    mysql -u testuser -p
    ```
```

{{< note >}}
The tab size is set to four, and **only** soft tabs should be used. This can be configured in the settings of most text editors.
{{< /note >}}

## How to Use Markdown Formatting for Linode Style

### Abbreviations and Acronyms

Upon first mention of a new concept or software, use the full name or term, then note the abbreviation or acronym in parenthesis beside it. The abbreviation/acronym can then be used in the article from that point. For example: Lightweight Resource/Provider (LWRP).

Introduce new terms in italics with a `*` on either side of the term:

```file {lang="md"}
This guide covers how to install Git, a *version control system*.
```

**Output:** This guide covers how to install Git, a *version control system*.

### Bold and Italics

Use a **Bold** font weight for buttons, menu selections and anything that requires emphasis or that you want to stand out to the reader. *Italicize* new terms and concepts the first time they are used.

| Syntax | Output |
| -- | -- |
| `**bold**` | **bold** |
| `*italics*` | *italics* |

### Commands

Commands that are not inline with paragraph text should be displayed with the *command shortcode*. This shortcode renders the command in a monospaced font with a light or dark background and a copy-to-clipboard button. Unlike other shortcodes (e.g. `content`, `note`, `caution`, etc), the command shortcode should be referenced with Markdown's *code fence* syntax.

-   **Command shortcode example**

    ````file
    ```command
    sudo systemctl restart apache2
    ```
    ````

    The above command shortcode is rendered with a light grey background by default:

    ```command
    sudo systemctl restart apache2
    ```

-   **Multiline commands**

    The command shortcode can accept multiple lines if more than one command needs to be displayed:

    ````file
    ```command
    sudo systemctl restart apache2
    sudo journalctl -u apache2
    ```
    ````

    The above command shortcode is rendered as:

    ```command
    sudo systemctl restart apache2
    sudo journalctl -u apache2
    ```

-   **Command with title**

    The `title` parameter can be used to specify a title that displayed above a command shortcode. This can be useful to label the server or workstation that a reader should execute the command on. For example, some guides instruct the reader to set up multiple servers. Specifying a title can disambiguate which server a given command should be run on.

    ````file
    ```command {title="Web server"}
    sudo systemctl restart apache2
    ```

    ```command {title="Database server"}
    sudo systemctl restart mysql
    ```
    ````

    The above command shortcodes are rendered as:

    ```command {title="Web server"}
    sudo systemctl restart apache2
    ```

    ```command {title="Database server"}
    sudo systemctl restart mysql
    ```

-   **Command with dark background**

    The `class` parameter can be used to specify that a command should be displayed with a dark background:

    ````file
    ```command {class="dark"}
    sudo systemctl restart apache2
    ```
    ````

    The above command shortcode is rendered as:

    ```command {class="dark"}
    sudo systemctl restart apache2
    ```

### Commands (Deprecated Syntax)

In some existing guides, you may see commands displayed without the command shortcode. In these instances, the commands are simply indented with a tab or four spaces in the Markdown source text. For example:

```file {lang="md"}
Run the following command to restart Apache:

    sudo systemctl restart apache2
```

*The older (tab or four space-indent) syntax should not be used for new content.* The code shortcode renders a copy-to-clipboard button for the reader's convenience, and the old syntax does not provide this feature.

### Inline Commands

Inline commands should be denoted by backticks.

```file {lang="md"}
Update your system by running `yum update`.
```

**Output:** Update your system by running `yum update`.

### Example IP Addresses

Example IPs should use the documentation address blocks given in [IETF RFC 5737](https://tools.ietf.org/html/rfc5737). These are:

- 192.0.2.0/24
- 198.51.100.0/24
- 203.0.113.0/24

### External Resources/More Information

If you wish to provide links to external sites for the user to review after going through your guide, do so using the `external_resources` parameter in the [page header](#header). This will automatically appear as a text block with links at the bottom of the page.

> More Information
>
> You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.
>
> - [Link Title 1](http://www.example.com)
> - [Link Title 2](http://www.example.net)

### Extend Markdown Using Shortguides

Using shortcodes, it is possible to extend a Markdown file with another. For common tasks such as basic software installation, consider using the `content` shortcode. This allows our library to maintain consistent and up to date installation instructions for frequently used tools such as Python, MySQL, and Docker.

Markdown files intended to be inserted into multiple guides are called shortguides. To create a shortguide, create a directory with the name of your shortguide anywhere within `docs/`, and then create an index.md within the directory for your content (e.g. `example-shortguide-name/index.md`).

Inserting `headless: true` in the front matter will hide the guide from the site navigation as well as the search index.

When using the `content` shortcode in a guide to embed a shortguide, the shortcode will take the name of your guide's directory (e.g. `example-shortguide-name`) as a parameter. A shortguide can be within a different part of the `docs` hierarchy from the guide that embeds it, so the guide directory name exists within a global namespace of all shortguides in the repository. In other words, two different shortguides can't use the same directory name.

To use an image in a shortguide, add the image to your shortguide's directory and then use the `image` shortcode to embed it:

```file {title="sample_embedding_guide/index.md" lang="md"}
{{</* image src="image-name.png" alt="image alt label" title="image title" */>}}
```

#### Example Usage

The following shortguide describes how to install Python via Miniconda. Create a directory named `install_python_miniconda` and filed named `index.md` within it:

```file {title="install_python_miniconda/index.md" lang="yaml"}
---
title: "Install Python with Miniconda"
description: 'A shortguide that shows how to install Python via Miniconda.'
keywords: []
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Author's FirstName LastName`"]
published: 2023-03-07
modified: 2023-03-07
modified_by:
  name: Linode
headless: true
show_on_rss_feed: false
---

<!-- Installation instructions for Python 3. -->

1.  Download and install Miniconda:

    ```command
    curl -OL https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh
    bash Miniconda3-latest-Linux-x86.64.sh
    ```

1.  You will be prompted several times during the installation process. Review the terms and conditions and select "yes" for each prompt.

1.  Check your Python version:

    ```command
    python --version
    ```
```

To use this shortguide in another guide, use the following syntax:

```file {title="sample_embedding_guide/index.md"}
{{</* content "install_python_miniconda" */>}}
```

### Files

Use the *file shortcode* to present code examples, code snippets, and other text file contents in a guide. This shortcode renders the file content with line numbering, a specified filepath, syntax highlighting, and line highlighting. Unlike other shortcodes (e.g. `content`, `note`, `caution`, etc), the file shortcode should be referenced with Markdown's *code fence* syntax.

{{< note >}}
Exceptionally long files should be shown in parts, if needed. In these cases, you can add the entire file to the same directory as your guide and link to it from within the guide.
{{< /note >}}

-   **File with filepath**

    ````file
    ```file {title="/path/to/file.html"}
    <div>
        Sample file text
    </div>
    ```
    ````

    The above file shortcode is rendered as:

    ```file {title="/path/to/file.html"}
    <div>
        Sample file text
    </div>
    ```

-   **File with language/syntax highlighting**

    A code language or syntax can be defined with the `lang` parameter to set how the text is displayed. A list of supported languages can be found [on GitHub](https://github.com/alecthomas/chroma).

    ````file
    ```file {title="/path/to/file.html" lang="html"}
    <div>
        Sample file text
    </div>
    ```
    ````

    The above file shortcode is rendered as:

    ```file {title="/path/to/file.html" lang="html"}
    <div>
        Sample file text
    </div>
    ```

-   **File with starting line specified**

    If your file snippet represents the middle of a file, you can use the `linenostart` to specify that the line numbering to the left of the snippet should start at a number other than 1:

    ````file
    ```file {title="/path/to/file.html" lang="html" linenostart="11"}
    <div>
        Sample file text
    </div>
    ```
    ````

    The above file shortcode is rendered with line numbers 11, 12, and 13 instead of 1, 2, and 3:

    ```file {title="/path/to/file.html" lang="html" linenostart="11"}
    <div>
        Sample file text
    </div>
    ```

-   **File with highlighted lines**

    The `hl_lines` parameter can be used to highlight certain lines within the file. The parameter is a space-separated list of strings. Ranges of lines can also be specified:

    ````file
    ```file {title="client/src/Header.js" lang="react" linenostart="11" hl_lines="4-6 9"}
    import React from 'react';
    function Header() {
        return (
            <header>
                Example header text
            </header>
        );
    }
    export default Header;
    ```
    ````

    The above file shortcode highlights lines 4 through 6 and line 9:

    ```file {title="client/src/Header.js" lang="react" linenostart="11" hl_lines="4-6 9"}
    import React from 'react';
    function Header() {
        return (
            <header>
                Example header text
            </header>
        );
    }
    export default Header;
    ```

-   **Using file shortcodes within lists**

    If using a file shortcode in a list, each line of the shortcode should start at the indentation level of the list. For example:

    ```file
    1. List item 1

    1. List item 2

        ```file {title="/path/to/file.html" lang="html"}
        <div>
            Sample file text
        </div>
        ```
    ```

### Files (Deprecated Syntax)

In some existing guides, you may see this older shortcode syntax for displaying a file:

```file
{{</* file "path/to/file.html" html */>}}
<div>
    Sample file text
</div>
{{</* /file */>}}
```

This is equivalent to:

````file
```file {title="/path/to/file.html" lang="html"}
<div>
    Sample file text
</div>
```
````

*The older syntax should not be used for new content.* While they are rendered with the same presentation by Hugo, they are not displayed the same in the GitHub.com UI. When viewing a Markdown file in the library on GitHub, the newer code fence shortcode syntax will have enhanced styling, compared with the older shortcode syntax.

### File Paths and File Names

Inline file paths and file names should be formatted as inline code blocks.

| Syntax | Output |
| -- | -- |
| ``Navigate to `/var/www/html`.`` | Navigate to `/var/www/html`. |

### Headings

Headings should be written in title case and can be up to 3 levels deep.

| Syntax | Output |
| -- | -- |
| `## Section title (h2)` | <font size="5"><strong>Section title (h2)</strong></font> |
| `### Subsection (h3)` | <font size="4"><strong>Subsection (h3)</strong></font> |
| `#### Subsection (h4)` | <strong>Subsection (h4)</strong> |

### Images

Images should be in *.png* or *.jpg* format. If an image is over 650 pixels wide, include both the original and one which is scaled down to 650 px. Image filenames cannot contain spaces and should use hyphens (-) to separate words instead of underscores (\_).

When adding an image, ensure that all identifying attributes such as names and IP addresses are removed, obfuscated, or replaced with dummy text, such as **example_user** or **192.0.2.0**. Be mindful of metadata in images taken with mobile devices.

- **Up to 650 px wide:** `![Description of the image](filename.png "Description of the image.")`
- **Over 650 px wide:** `[![Description of the image](filename_small.png "Description of the image.")](filename.png)`

### Key Combinations

When instructing a reader to press hotkeys or other combinations of keys, enclose each individual key within a [kbd](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd) html element as shown in the example below.

```file {lang=html}
Use <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy text.
```

**Output:** Use <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy text.

### Links

Internal links to other Linode guides should be relative, starting at `/docs/`, and external links should be formatted as shown below and use HTTPS URLs whenever possible.

- **Internal link example:** `[Getting Started](/docs/products/platform/get-started/)`
- **External link example:** `[Apache HTTP Server Documentation](https://httpd.apache.org/docs/)`

### Lists

#### Ordered Lists

Ordered lists are numbered and should be used to denote a series of steps or sequential items. Use the following guidance when creating ordered lists:

-   **Longer lists that may change and where nested content is possible:**

    These lists should use *lazy* numbering (by appending a `1.` to each step regardless of the actual step number). There should also be *two* spaces between the numbering and the text (see [Nested Content Within Lists](#nested-content-within-lists)).

    ```command
    1.  Step 1
    1.  Step 2
    1.  Step 3
    ```

-   **Short lists that remain static with no nested content:**

    Optionally, you can use *true* numbering when a list is likely to remain short and static during its lifecycle. Provided there is no nested content, use a single space between the number and the text.

    ```command
    1. Step 1
    2. Step 2
    3. Step 3
    ```

#### Unordered Lists

Unordered lists are bulleted and should be used for any collection of items that do not necessarily need to be ordered. These lists should be formatted by appending a `- ` to the beginning of each step.

-   **Lists where nested content is possible:**

    Use *three* spaces between the bullet character (`-`) and the text. (see [Nested Content Within Lists](#nested-content-within-lists)).

    ```command
    -   Item A
    -   Item B
    -   Item C
    ```

-   **Lists with no nested content:**

    Provided there is no nested content, you can use a single space between the bullet character and the text.

    ```command
    - Item A
    - Item B
    - Item C
    ```

#### Nested Content Within Lists

To remain consistent across all of our guides, nested content should be indented *four* spaces and a blank line should be used above and below the content. Our Markdown processor assumes nested content starts directly below the *first* character in the text of the list item above it. With this in mind, it's important to indent the text portion of the list item to match that four space indent. In practice, there should be *two* spaces after the number (for ordered lists) and *three* spaces after the bullet for unordered lists. If this spacing is not respected, the nested content may not render properly.

- **Ordered list** (`1.`): Use *two* spaces after the number.
- **Unordered list** (`-`): Use *three* spaces after the bullet.

````command
-   Item A

    This sentence is nested under *Item A*.

-   Item B

    ```command
    This command is nested under *Item B*.
    ```

-   Item C
````

### Note Shortcode

The **note** shortcode is used to display a note to the reader.

```file
{{</* note */>}}
This is an example note.
{{</* /note */>}}
```

{{< note >}}
This is an example note.
{{< /note >}}

#### Parameters

The shortcode accepts the following parameters:

| Parameter | Values | Description |
| -- | -- | -- |
| `type` | | Identifies the note as one of 4 types: |
|  | `"secondary"` | A muted note. |
|  | `"primary"` | (*DEFAULT*) A note or tip related to the surrounding content. This is the default type if no type is specified. |
|  | `"warning"` | A note to take certain precautions. |
|  | `"alert"` | An important note that should not be skipped over. |
| `title` | String | Sets the title of the note. |
| `noTitle` | boolean | Does not apply a default title to the note. Defaults to false. |
| `isCollapsible` | boolean | Sets the note as collapsible. The note must have a title defined. Defaults to false. |
| `respectIndent` | boolean | This is only used for older note shortcodes (`{{</* note */>}}`) that have been converted to the newer shortcode. By default, content between the shortcode tags is rendered using `.InnerDeindent`, which allows the shortcode to respect the indentation of any parent elements (such as lists). When set to `false`, `.Inner` is used instead, which does not de-indent the content and does not respect the indentation of parent elements. Defaults to true. |

#### Note Types

There are four unique types of notes:

-   **Secondary** (`type="secondary"`, title defaults to "Note")

    {{< note type="secondary" >}}
    This is an example of a secondary note with inline code (`sudo nano`), a link ([Linode Documentation](/docs/)), and a command shortcode:

    ```command
    sudo apt update
    ```
    {{< /note >}}

-   **Primary** (type is unset or `type="primary"`, title defaults to "Note")

    {{< note >}}
    This is an example of a primary note with inline code (`sudo nano`), a link ([Linode Documentation](/docs/)), and a command shortcode:

    ```command
    sudo apt update
    ```
    {{< /note >}}

-   **Warning** (`type="warning"`, title defaults to "Warning")

    {{< note type="warning" >}}
    This is an example of a warning note with inline code (`sudo nano`), a link ([Linode Documentation](/docs/)), and a command shortcode:

    ```command
    sudo apt update
    ```
    {{< /note >}}

-   **Alert** (`type="alert"`, title defaults to "Important")

    {{< note type="alert" >}}
    This is an example of an alert note with inline code (`sudo nano`), a link ([Linode Documentation](/docs/)), and a command shortcode:

    ```command
    sudo apt update
    ```
    {{< /note >}}

#### Custom Title

Each note can also have a custom title, which is set using the `title` parameter.

```file {lang="text"}
{{</* note title="Custom title" */>}}
This is an example note with a custom title.
{{</* /note */>}}
```

{{< note title="Custom title" >}}
This is an example note with a custom title.
{{< /note >}}

#### No Title

Additionally, you can specify that the note should have no title by using `noTitle=true`. This causes the default title to not display.

```file {lang="text"}
{{</* note noTitle=true */>}}
This is an example note with no title.
{{</* /note */>}}
```

{{< note noTitle=true >}}
This is an example note with no title.
{{< /note >}}

#### Collapsible

Additionally, a note can also be collapsible by setting `isCollapsible=true` (defaults to false). This hides the body of the note and displays a collapse/expand icon.

```file {lang="text"}
{{</* note title="This is a collapsible note with a custom title" isCollapsible=true */>}}
This content is hidden until the user expands the note.
{{</* /note */>}}
```

{{< note title="This is a collapsible note with a custom title" isCollapsible=true >}}
This content is hidden until the user expands the note.
{{< /note >}}

#### Indentation

Content within the opening and closing note shortcode tags must respect the expected indentation of any parent elements, such as list items. Since content within a list is indented (using 4 spaces), the content of a note shortcode must be indented by the same number of spaces.

```file
-   First list item.

    {{</* note */>}}
    This content appears within the first list item and, as such, respects its indentation.
    {{</* /note */>}}

-   Second list item.
```

If this indentation is not respected, which should only be the case for older note shortcodes made before this change, the following option is set: `respectIndent=false`. If one of these is encountered when editing an existing guide, remove `respectIndent=false` and properly indent the shortcode.

```file
-   First list item.

    {{</* note respectIndent=false */>}}
This content appears within the first list item but does not respect its indentation.
{{</* /note */>}}

- Second list item.
```

### Numerical Values

| 1-10 | Greater than 10 |
| -- | -- |
| Use words (one, two, three, etc.)  | Use numerical digits (11, 22, 33). |

### Sentence Spacing

Use single spaces between sentences; do not double-space.

### Tables

```file {lang="md"}
| Column Header 1 | Column Header 2|
| -- | -- |
| **Example** | This is an example of text in the second column. |
```

| Column Header 1 | Column Header 2|
| -- | -- |
| **Example** | This is an example of text in the second column. |

#### Table Alignment

```file {lang="md"}
| Left-Aligned Text | Center-Aligned Text | Right-Aligned Text |
| -- |:--:| --:|
| Example | Example | Example |
```

| Left-Aligned Text | Center-Aligned Text | Right-Aligned Text |
| -- | :--: | --:|
| Example | Example | Example |

### Tabs

Using a tabbed interface allows you to separate content into user-selectable tabs. This can be used to provide specific instructions for different versions of a software application (like MySQL 5.7 or 8), different operating systems (like macOS, Windows, or a Linux distribution), or different user tools (like the Cloud Manager, Linode CLI, or Linode API).

````file
{{</* tabs */>}}
{{</* tab "Tab 1" */>}}
The content only appears when *Tab 1* is selected.
{{</* /tab */>}}
{{</* tab "Tab 2" */>}}
When *Tab 2* is selected, this content appears.
{{</* /tab */>}}
{{</* /tabs */>}}
````

{{< tabs >}}
{{< tab "Tab 1" >}}
The content only appears when *Tab 1* is selected.
{{< /tab >}}
{{< tab "Tab 2" >}}
When *Tab 2* is selected, this content appears.
{{< /tab >}}
{{< /tabs >}}

When a user selects a tab, the first item in each tab set that has a matching title is also selected. This means that if multiple tab sets are on a page, each with the same items, the user only needs to select an item within one tab set and all tab sets will show that item.

{{< tabs >}}
{{< tab "Tab 1" >}}
This is *Tab 1* in the second tab set. When *Tab 1* is selected on any tab set, this content is visible.
{{< /tab >}}
{{< tab "Tab 2" >}}
And here is *Tab 2* in the second tab set. When *Tab 2* is selected on any tab set, this content is visible.
{{< /tab >}}
{{< /tabs >}}

When a tab is selected, a `tab` parameter string appears in the URL along with the title of all selected tabs. For instance, if *Tab 2* is selected in the tab sets above, `?tabs=tab-2` is appended to the URL. This allows the URL to be saved or shared, keeping the same tabs selected on the page.

### Terminal Output

Output from terminal commands should be displayed with the *output shortcode*:

````file
```output
Hello world!
```
````

The above shortcode is rendered as:

```output
Hello world!
```

Here's an example of a command (using the code shortcode) and its output (using the output shortcode) displayed together:

````file
```command
echo "Hello world!"
```

```output
Hello world!
```
````

The above shortcodes are rendered as:

```command
echo "Hello world!"
```

```output
Hello world!
```

### Terminal Output (Deprecated Syntax)

In some existing guides, you may see this older shortcode syntax for displaying terminal output:

```file
{{</* output */>}}
Hello world!
{{</* /output */>}}
```

This is equivalent to:

````file
```output
Hello world!
```
````

*The older syntax should not be used for new content.* While they are rendered with the same presentation by Hugo, they are not displayed the same in the GitHub.com UI. When viewing a Markdown file in the library on GitHub, the newer code fence shortcode syntax will have enhanced styling, compared with the older shortcode syntax.

## Author Pages

Profile pages for authors are listed at https://www.linode.com/docs/authors/. These are automatically generated from the `authors` frontmatter of the guides in the library. These pages list all of the guides that an author has published in the docs library.

Docs contributors can create author pages by following these steps:

{{< note >}}
The second step is optional. If you do not follow this step, a profile page is still automatically generated from the `authors` frontmatter of the guides you have written. The second step shows you how to add custom biographical information to the profile page.
{{< /note >}}

1.  On the guides you have written, update the `authors` frontmatter to reference your name. This should be formatted like:

    ```file
    authors: ["FirstName LastName"]
    ```

1.  (Optional) Create a new directory and Markdown file for your author page under the `docs/authors` directory in the docs repository. The new directory should named after you, with uppercase letters replaced by lower case, and spaces replaced by a dash. For example, an author with the name `Nathan Smith` would have a new profile page created at `docs/authors/nathan-smith/_index.md`.

    {{< note >}}
    Note that the Markdown file is named `_index.md`, not `index.md`
    {{< /note >}}

    A [Hugo archetype](https://gohugo.io/content-management/archetypes/) is available to create new author pages. For the example author `Nathan Smith`, you would run this command to create the Markdown file for their profile page:

    ```command
    hugo new -k authorpage docs/authors/nathan-smith/_index.md
    ```

    The template that will be created looks like:

    ```file
    ---
    title: "Nathan Smith"
    link: ""
    email: ""
    description: "The Linode documentation library's profile page and submission listing for Nathan Smith"
    ---

    A short biography of the docs author/contributor. This biography text is displayed above a listing of their published docs/content.
    ```

    You can set an email, website link, and short meta description in the frontmatter of this file. You can also update the body of the file with a biography of the author. This biography will be displayed above the author's published guides listing.

## Legal Information

COPYRIGHT OWNERSHIP. Writer agrees that the Work is being created by the writer for the Linode Guides & Tutorials repository and that each form of Work is being created by the writer as a “work made for hire” under the United States Copyright Act and, at all stages of development, the Work shall be and remain the sole and exclusive property of Linode. At Linode's sole, absolute and unfettered discretion, Linode may make any alterations to the Work.

CREDIT. Nothing contained in this Agreement shall be deeded to require Linode to use the Work, or any part thereof, in connection with Linode Guides & Tutorials or otherwise. Credit for the Work shall read, "Contributed by [writer's name]."

PAYMENT. Upon publication of a submission to the Linode Guides & Tutorials Repository, the writer will be paid the sum agreed to by email by both Linode and the author. Author may choose payment either in the form of a credit to their Linode account, a hardcopy check, or as an electronic payment via PayPal.