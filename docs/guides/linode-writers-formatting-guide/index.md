---
slug: linode-writers-formatting-guide
title: Linode Writer's Formatting Guide
description: 'This guide provides formatting and style guidelines for documentation and articles submitted to Linode from outside contributors via our Write for Linode program.'
authors: ["Linode"]
contributors: ["Linode"]
published: 2014-01-15
modified: 2024-05-29
keywords: ["style guide", "format", "formatting", "how to write", "write for us", "write for linode", "linode docs", "submissions"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/linode-writers-formatting-guide/','/linode-writers-guide/','/style-guide/']
show_on_rss_feed: false
external_resources:
 - '[GitHub Beginners Guide](/docs/guides/a-beginners-guide-to-github/)'
 - '[Red Hat Writing Style Guide](http://stylepedia.net/)'
_build:
  list: false
---

![Linode Writer's Formatting Guide](linode-writers-formatting-guide.png)

## Writing Guidelines for Akamai Linode Documentation

This guide outlines how to submit content, including formatting standards, style guidelines, and workflows to use when creating or updating a guide for [Linode Docs](/docs/), a part of Akamai Cloud Computing.

Updates, improvements, and bug fixes to documentation are always welcome through [GitHub](https://github.com/linode/docs) via pull requests (PRs) or issues.

Through our Write for Linode program, contributor's can and are invited to submit new guides and be compensated for accepted work. If you are interested, we encourage you to apply with one or more writing samples so that we can evaluate your style and technical clarity. To learn more and apply, visit the [Write For Linode program page](https://www.linode.com/lp/write-for-linode/).

## General Layout

Linode guides and tutorials are written in [Markdown](https://en.wikipedia.org/wiki/Markdown) and rendered using [Hugo](https://gohugo.io), a static site generator. Hugo-specific Markdown formatting examples are provided throughout this guide.

### File References

Markdown files for guides are stored under the `docs/guides/` content directory (folder), organized by technical topical categories. Place new guides in a category they most closely align with.

**Example**: A new guide about the Apache web server, would go in the `docs/guides/web-servers/apache/my-apache-guide/` subdirectory (folder).

In that subdirectory `/my-apache-guide/` (folder) is a **file** called `index.md` containing the guide's Markdown content (`docs/guides/web-servers/apache/my-apache-guide/**index.md**`).

### Creating New Guides (Formatting)

Use [Hugo's archetype](https://gohugo.io/content-management/archetypes/) feature to create properly formatted new guide files. For example, to create the `My Apache Guide` example, run this command from inside your cloned docs repository:

```command
hugo new -k content docs/guides/web-servers/apache/my-apache-guide/index.md
```

## Content Structure

### Guide Structuring

Guides should be split into cohesive sections which flow from one sequence of events to the next. Each section title should be styled with an *H2* heading element, and each subsection with an *H3* heading so that scanning the **EXPLORE DOCS** left sidebar shows the reader an overview of what is contained in the selected section title.  Use Title Case for each noun, adjective, verb, and adverb in the article title, H2, H3, and H4 headings.

Structure sequential content using numbered steps within subsections, as shown below.

For example:

```text
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

### Before You Begin

Create a prerequisites section that tells your readers what they need before beginning your guide to complete it successfully. This may include:

- Required Akamai services or features (e.g., Compute Instances, LKE clusters, or Object Storage buckets) as well as any necessary hardware or plan requirements (see [Pricing](https://www.linode.com/pricing/)).

- Required software or applications (e.g., LAMP stack, Docker) with links to installation instructions. Only add software directly used within the guide but that is not the guide's primary focus. If the software requires additional configuration or usage information, include those details in the main guide instructions rather than in the **Before You Begin** section.

- External requirements, such as a registered domain name or specific local software (e.g., a PC running Windows 11).

- Foundational knowledge requirements, such as understanding  technology fundamentals (e.g., container orchestration) or familiarity with specific software or software stacks (e.g., Kubernetes).

Example *Before You Begin* section (copy and edit as needed):

```text

## Before You Begin

1.    If you do not already have a virtual machine to use, create a Compute Instance with at least 4 GB of memory. See our [Getting Started with Linode](https://techdocs.akamai.com/cloud-computing/docs/getting-started) and [Creating a Compute Instance](https://techdocs.akamai.com/cloud-computing/docs/create-a-compute-instance) guides.

1.    Follow our [Setting Up and Securing a Compute Instance](https://techdocs.akamai.com/cloud-computing/docs/set-up-and-secure-a-compute-instance) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.
```

### Metadata Header

Linode guides and tutorials store metadata and other information in a [YAML](http://yaml.org/) header at the top of every page. If you notice a `deprecated` field in the header defaulted to false, only set it to *true* if you need to display a pre-written message stating that the guide is no longer maintained. This is typically used for guides covering applications or distributions that have reached End of Life (EOL).

Use the template below as a guide.

{{< note >}}
If you use the Hugo archetype command described in the previous section, the created Markdown file is pre-populated with the frontmatter template below.
{{< /note >}}

```file {title="Author Submission" lang="yaml"}
---
slug: {{ path.Base .File.Dir }}
title: "{{ replace (path.Base .File.Dir) "-" " " | title }}"
description: "Two to three sentences describing your guide."
og_description: "Optional two to three sentences describing your guide when shared on social media. If omitted, the `description` parameter is used within social links."
authors: ["Linode"]
contributors: ["Linode"]
published: {{ now.Format "2006-01-02" }}
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---
```

### Introduction (section)

Introductions should be concise; explain what the goal of the guide is. If you're introducing new software to the system, include a brief description and link to its official website whenever possible.

### User privileges and sudo

This section describes how to handle user privileges and administrative access (for root and non-root access).

**For Guides Using sudo (recommended for [security](https://www.linode.com/docs/guides/securing-your-lamp-stack/)):**

{{</* note */>}}
Commands requiring elevated privileges are prefixed with `sudo`. If you're not familiar with `sudo` or need help setting up user accounts, see our [Users and Groups](https://www.linode.com/docs/guides/linux-users-and-groups/) guide.
{{</* /note */>}}

**For guides requiring root access:**

{{</* note */>}} This guide requires root privileges. Ensure you're logged in as root or use `sudo` with each command. For more information on user privileges, see our [Users and Groups](https://www.linode.com/docs/guides/linux-users-and-groups/#working-with-linux-groups-users-and-directories) guide.
{{</* /note */>}}

### Headings

Headings should be written in title case and can be up to 3 levels deep.

| Syntax | Output |
| -- | -- |
| `## Section title (h2)` | approx. 18-24pt **Section title (h2)** |
| `### Subsection (h3)` | approx. 16-20pt **Subsection (h3)** |
| `#### Subsection (h4)` | approx. 14-18pt **Subsection (h4)** |

Font sizes are approximate and depend on your site's theme or editor.

### Lists

#### Ordered Lists

Ordered lists are numbered and should be used to indicate a series of steps or other content that follows a defined sequence (i.e., apps to be installed in a certain order). Sequential procedures and step-by-step instructions should always use numbered lists rather than bullet points to emphasize the proper order. Use the following guidance when creating ordered lists:

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

Unordered lists are bulleted and used for any collection of items that do not necessarily need to be ordered. These lists should be formatted by appending a `- ` to the beginning of each step.

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
### Tables

You can create tables using standard Markdown syntax. Additionally, you can embed a Markdown table within the [table shortcode](#table-shortcode) for additional functionality.

```file {lang="md"}
| Column Header 1 | Column Header 2 |
| -- | -- |
| **Example** | This is an example of text in the second column. |
```

| Column Header 1 | Column Header 2 |
| -- | -- |
| **Example** | This is an example of text in the second column. |

#### Column Text Alignment

To align text within a table, modify the second row. This row separates the header from the body of the table and can be used for additional metadata, like text alignment.

- Left aligned: Default behavior (if there is a need to be explicit, use `| :-- |`)
- Center aligned: `| :--: |`
- Right aligned: `| --: |`


```file {lang="md"}
| Left-Aligned Text | Center-Aligned Text | Right-Aligned Text |
| -- | :--: | --: |
| Example | Example | Example |
```

| Left-Aligned Text | Center-Aligned Text | Right-Aligned Text |
| -- | :--: | --: |
| Example | Example | Example |

#### Table Shortcode

Table shortcode can be used to add additional functionality to Markdown tables. By default, it adds a scrollbar when the table width is larger than the content area. This means that it can accommodate wide tables with lots of columns. It also adds alternating row background colors so that tables are easier to parse.

```file {lang="md"}
{{</* table */>}}
| Column Header | Column Header | Column Header |
| -- | -- | -- |
| **Row 1** | Example | Example |
| **Row 2** | Example | Example |
| **Row 3** | Example | Example |
{{</* /table */>}}
```

{{< table >}}
| Column Header | Column Header | Column Header |
| -- | -- | -- |
| **Row 1** | Example | Example |
| **Row 2** | Example | Example |
| **Row 3** | Example | Example |
{{< /table >}}

#### Fixed First Column

If you are creating a wide table and need the first column to be fixed when scrolling, use the **"first-sticky"** class.

```file {lang="text"}
{{</* table class="first-sticky" */>}}
| Column Header | Column Header | Column Header | Column Header | Column Header | Column Header | Column Header | Column Header | Column Header | Column Header | Column Header | Column Header |
| -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- |
| **Row1**| Example | Example | Example | Example | Example | Example | Example | Example | Example | Example | Example |
| **Row2**| Example | Example | Example | Example | Example | Example | Example | Example | Example | Example | Example |
| **Row3**| Example | Example | Example | Example | Example | Example | Example | Example | Example | Example | Example |
{{</* /table */>}}
```

{{< table class="first-sticky" >}}
| Column Header | Column Header | Column Header | Column Header | Column Header | Column Header | Column Header | Column Header | Column Header | Column Header | Column Header | Column Header |
| -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- |
| **Row1**| Example | Example | Example | Example | Example | Example | Example | Example | Example | Example | Example |
| **Row2**| Example | Example | Example | Example | Example | Example | Example | Example | Example | Example | Example |
| **Row3**| Example | Example | Example | Example | Example | Example | Example | Example | Example | Example | Example |
{{< /table >}}

### Tabs

Using a tabbed interface allows you to separate content into user-selectable tabs. This can be used to provide specific instructions for different versions of a software application (like MySQL 5.7 or .8), different operating systems (like macOS, Windows, or a Linux distribution), or different user tools (like the Cloud Manager, Linode CLI, or Linode API).

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

When a user selects a tab, the first item in each tab set that has a matching title is also selected. This means that if multiple tab sets are on a page, each with the same items, the user only needs to select an item within one tab set then all tab sets will show that item.

{{< tabs >}}
{{< tab "Tab 1" >}}
This is *Tab 1* content When *Tab 1* is selected in any tab set on the page, this content becomes visible.
{{< /tab >}}
{{< tab "Tab 2" >}}
And here is *Tab 2* content. When *Tab 2* is selected in any tab set on the page, this content becomes visible.
{{< /tab >}}
{{< /tabs >}}

When a tab is selected, a `tab` parameter string appears in the URL along with the title of all selected tabs. For instance, if *Tab 2* is selected in the tab sets above, `?tabs=tab-2` is appended to the URL. This allows the URL to be saved or shared, keeping the same tabs selected on the page.

## Markdown Text Formatting

### Abbreviations and Acronyms

Upon first mention of a new concept or software, use the full name or term, then note the abbreviation or acronym in parentheses following it. The you can used the abbreviation/acronym in the article from that point forward. For example: Lightweight Resource/Provider (LWRP). Another example is: Virtual Private Server (VPS)" or "Content Delivery Network (CDN)". In longer guides spanning several pages, reintroduce the full term with the abbreviation in parentheses when it reappears after several pages of content.

### New Terms

Introduce new terms in italics with a `*` on either side of the term:

```file {lang="md"}
This guide covers how to install Git, a *version control system*.
```

**Output:** This guide covers how to install Git, a *version control system*.

### Bold and Italics

Use a **Bold** font weight for buttons, menu selections, and anything that requires emphasis or that you want to stand out to your users.

*Italicize* new terms and concepts the first time they are used.

| Syntax | Output |
| -- | -- |
| `**bold**` | **bold** |
| `*italics*` | *italics* |

### Sentence Spacing

Use single spaces between sentences; do not double-space.

## Code Elements

### Commands

Commands that are not inline with paragraph text should be displayed with the *command shortcode*. This shortcode renders the command in a monospaced font with a light or dark background and a copy-to-clipboard button. Unlike other shortcodes (e.g., `content`, `note`, `caution`, etc.), the command shortcode should be referenced using Markdown's **code fence** syntax.

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

    The `title` parameter can be used to specify a title that is displayed above a command shortcode. This can help identify which server or workstation the reader should execute the command on. For example, when guides involve multiple servers, specifying a title helps clarify which one a command applies to.

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

    The `class` parameter is used to specify that a command should be displayed with a dark background:

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

In some existing guides, you may see commands displayed without the `command` shortcode. In these instances, the commands are just indented with a tab or four spaces in the Markdown source text to achieve code block formatting. This legacy approach is still valid for rendering purposes but does not support enhanced functionality like labeling or syntax tagging. For example:

```file {lang="md"}
Run the following command to restart Apache:

    sudo systemctl restart apache2
```

**Note**: *The older syntax (tab or four space-indent) should not be used for new content.* The shortcode renders a copy-to-clipboard button for the reader's convenience, and the old syntax does not provide this feature. Instead, use the command shortcode:

```command
sudo systemctl restart apache2
```

### Inline Commands

Inline commands should be enclosed in backticks.

```file {lang="md"}
Update your system by running `yum update`.
```

**Output:** Update your system by running `yum update`.

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

Here's an example of a command (using the command shortcode) and its output (using the output shortcode) displayed together:

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

*The older syntax should not be used for new content.* While they are rendered with the same presentation by Hugo, they are not displayed the same in the GitHub.com UI. When viewing a Markdown file in the library on GitHub, using the newer code fence shortcode syntax will have enhanced styling, compared to the older shortcode syntax.

### Placeholders

The placeholder shortcode applies special formatting to highlight the user-replaceable portion of a command or file. It can also be used within a paragraph as a way to reference what the user should replace.

- **Syntax:** `{{</* placeholder "VARIABLE_NAME" */>}}`</br>
- **Output:** {{< placeholder "VARIABLE_NAME" >}}

When creating a placeholder, you can use either a descriptive variable name (like `VARIABLE_NAME`) or example text (like `example.com`).

- **Placeholder example text:** A generic example that represents the expected user input. For instance, example IP addresses (`192.0.2.17`) and example domain names (`example.com`). This should be in the same case as the surrounding text, using whatever formatting is appropriate for the example text. For IP addresses, review the [Example IP Addresses](#example-ip-addresses) section.
- **Placeholder variable:** A short descriptive variable name. This should be formatted in uppercase with an underscore (`_`) used instead of spaces. For instance, `REGION_ID` and `FILE_NAME`.

The following example demonstrates a common use case for the placeholder shortcode.

-   **Markdown syntax:**

    ````
    Within the default NGINX configuration file, replace {{</* placeholder "example.com" */>}} with your website's domain.

    ```file {title="/etc/nginx/sites-available/default"}
    server {
        listen  80;
        listen [::]:80;
        server_name {{</* placeholder "example.com" */>}};
    }
    ```
    ````

-   **Output:**

    Within the default NGINX configuration file, replace {{< placeholder "example.com" >}} with your website's domain.

    ```file {title="/etc/nginx/sites-available/default"}
    server {
        listen  80;
        listen [::]:80;
        server_name {{< placeholder "example.com" >}};
    }
    ```

## File References

### Files

Use the *file shortcode* to present code examples, code snippets, and other text file contents in a guide. This shortcode renders the file content with line numbering, a specified filepath, syntax highlighting, and line highlighting. Unlike other shortcodes (e.g., `content`, `note`, `caution`, etc.), the file shortcode should be referenced with Markdown's *code fence* syntax.

{{< note >}}
Exceptionally long files should be shown in parts, if needed. In these cases, you can add the entire file to the same directory as your guide and link to it from within the guide.
{{< /note >}}

-     **File with filepath**

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

-    **File with language/syntax highlighting**

    A code language or syntax can be defined with the `lang` parameter to set how the text is displayed. A list of supported languages can be found [on GitHub](https://github.com/alecthomas/chroma#supported-languages).

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

-    **File with starting line specified**

    If your file snippet represents the middle of a file, you can use the `linenostart` parameter to specify that the line numbering to the left of the snippet should start at a number other than 1:

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

-    **File with highlighted lines**

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

-    **Using file shortcodes within lists**

    If using a file shortcode in a list, each line of the shortcode should start at the indentation level of the list. For example:

    1. List item 1

    1. List item 2
       If you want to include a file shortcode, format it like this:

        ```file {title="/path/to/file.html" lang="html"}
        <div>
            Sample file text
        </div>
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

{{< note >}}

The older syntax should not be used for new content. Use the newer code fence syntax for consistency and better cross-platform compatibility.

{{< /note >}}

### File Paths and File Names

Inline file paths and file names should be formatted as inline code blocks.

| Syntax | Output |
| -- | -- |
| ``Navigate to `/var/www/html`.`` | Navigate to `/var/www/html`. |

## Interactive Elements

### Links

Internal links to other Linode guides should be relative, starting at `/docs/`, and external links should be formatted as shown below and use HTTPS URLs whenever possible.

- **Internal link example:** `[Getting Started](/docs/products/platform/get-started/)`
- **External link example:** `[Apache HTTP Server Documentation](https://httpd.apache.org/docs/)`

### Images

Images can add value to the surrounding text by providing context or additional meaning. In most cases, images within documentation take the form of screenshots or diagrams, though occasionally other types of images may be necessary.

-   **Image format:** All images should be a PNG (*.png*) or a JPEG (*.jpg* or *.jpeg*).

-   **Image size:** Images are displayed in their original size, up to the maximum width of the content area. If an image's width is larger than the width of the content area, the image is scaled down to fit within the content area and a user can click on the image to view it in a modal.

To add an image to a guide, first move it the same directory as the guide or shortguide. Then, enter the following Markdown syntax at the location you wish the image to appear:

```file {lang="md"}
![Alt text](filename.png "Title text")
```

- **Alt text:** This should be a description of the image and is rendered within the image's `alt` tag. It is used for screen readers and other accessibility features.
- **Filename:** The name of the file. Filenames cannot contain spaces and should use hyphens (-) and underscores (\_) instead.
- **Title text:** This is the text that appears as a tooltip when a user hovers over the image. If no title is entered, the alt text is used in the `title` tag. In most cases, a specific title tag is not needed.

#### Image Recommendations

- **Image sizing:** The height of our images, especially screenshots, should be as minimal as possible. This is to avoid screenshots taking up a lot of vertical space within our documentation, which often results in visually breaking up content that otherwise would appear together. Our Cloud Manager favors vertically stacked fields and options, which can make it difficult to minimize the height of our screenshots. Use your best judgement when determining what part of the UI is needed to convey the required information.

- **Favor light mode over dark mode:** When an application (such as the Cloud Manager) has different themes or appearances, favor the default theme. If the theme automatically adjusts to your system's light or dark mode setting, verify that your system is using light mode or adjust the application setting to light mode.

- **Image composition:** Avoid including too much detail or information within an image. Many images are used to either show the result of an action (like displaying a web page) or are used to supplement instructions asking the reader to perform an action (like click a button). Images that show too much may confuse the reader or otherwise call attention to details that aren't important to the task at hand. In practice, this means not taking a screenshot of the entire application or browser window and instead focusing only on the UI elements related to the instructions or text.

- **Remove personal information:** Ensure that all identifying attributes such as names and IP addresses are removed, obfuscated, or replaced with example text, such as **example_user** or an IP address from the **192.0.2.0/24** range. This aligns with a previous recommendation of only providing necessary detail and it keeps the writer's personal information from being shown to readers. This may involve using the browser's built-in development tools to manually replace values or delete information.

#### Example Wide Image

Since this image is larger than the width of the content, the image is scaled to fit. When the image is clicked, a modal appears that displays the image at a larger size.

This example image might be used to supplement instructions asking the reader to select a Compute Instance. Instead of taking a screenshot of the entire page in the Cloud Manager, the area has been cropped to just include relevant information. In addition, a red outline has been used to highlight the UI element that corresponds with the action the reader should perform.

```file {lang="md"}
![Screenshot of Cloud Manager Compute Instance page with a single instance selected](compute_instance_list-select_instance.png "Select a Compute Instance from the list")
```

![Screenshot of Cloud Manager Compute Instance page with a single instance selected](compute_instance_list-select_instance.png "Select a Compute Instance from the list")

#### Example Narrow Image

Smaller images should be displayed using their true pixel size. When taking screenshots within some software on some operating systems, the pixel size is increased (likely to account for the operating system's scaling). For instance, taking a screenshot with the Skitch tool on macOS doubles the pixel count. In these cases, use another image editing tool (like macOS's built in preview) to scale down the image to match the intended pixel width.

```file {lang="md"}
![Screenshot of the Create Firewall panel in the Cloud Manager](cloud_firewalls-create_panel.png)
```

![Screenshot of the Create Firewall panel in the Cloud Manager](cloud_firewalls-create_panel.png)

### Key Combinations

When instructing a reader to press hotkeys or other combinations of keys, enclose each individual key within a [kbd](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd) html element as shown in the example below.

```file {lang=html}
Use <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy text.
```

**Output:** Use <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy text.

## Special Features

### Note Shortcode

The **note** shortcode is used to display a note to the reader. Notes can be used to share relevant information that does not fit with the primary content. Example use cases include alternative methodologies, non-critical information, alerts, developer recommendations, and more. **Content included in a note must not be required for the reader to successfully understand or complete a task**.

Below is the **default** (primary) note shortcode with default [parameters](#parameters):

```file
{{</* note */>}}
This is an example note.
{{</* /note */>}}
```

{{< note >}}
This is an example note.
{{< /note >}}

**Best practices:**
Notes highlight important information that relates to the surrounding content. Use notes strategically to draw attention to key details without disrupting the reading flow.
-    **Avoid Lengthy Notes:** Be concise - the shorter the better. Notes can lose their impact when they become too long. Keep information focused and essential.
-    **Ensure Notes Are Relevant to Surrounding Content:** The note should pertain directly to the surrounding paragraph, step, or list item. If the note is an unnecessary interruption to the reader, consider removing the note, moving it to a different section, or placing its contents directly in the surrounding content.
-    **Don't Overuse Notes:** Notes draw attention away from the surrounding content. Too many notes can distract the reader, result in important information getting lost, and are often unnecessary. Consider the impact that excessive notes may have on the reader - some information can be omitted and some information is better suited to be included as part of the surrounding text.
-    **Avoid Stacking Multiple Notes:** Multiple consecutive notes can overwhelm readers and diminish their effectiveness. Space out notes throughout your content and consider consolidating related information into a single note when possible.
-    **Use Descriptive Titles:** Customize the title of each note so that the reader can quickly assess if the note is relevant to them. Avoid generic titles like "*Note*" or "*Important*" in favor of specific, descriptive titles.
-    **When to Use Notes for Temporary Content:** (with caution) Temporary content often works better in notes than buried in paragraphs. Always include expiration dates and post-expiration guidance. For product-wide notices (like beta releases), add notes to the main product page rather than all referencing guides to simplify future updates.

#### Parameters

When creating a new note, consider several options related to the note type, title, and whether it can be expanded or collapsed. While not all parameters are necessary, think though these choices during the note creation process.

| Parameter | Values | Description |
| -- | -- | -- |
| `type` | `"primary"`, `"secondary"`, `"warning"`, `"alert"` | Identifies the note as one of 4 types: primary, secondary, warning, or alert. See: [Note Types](#note-types) |
| `title` | String | Sets the title of the note. See: [Titles](#titles) for titling guidelines. |
| `noTitle` | boolean | Does not apply a default title to the note. Defaults to false. |
| `isCollapsible` | boolean | Sets the note as collapsible. The note must have a title defined. Defaults to false. See: [Collapsible](#collapsible) |
| `respectIndent` | boolean | Only used for older note shortcodes (`{{</* note */>}}`) that have been converted to the newer shortcode. See: [Indentation](#indentation) |

#### Note Types

There are four unique types of notes: **primary**, **secondary**, **warning**, and **alert**. Each type has specific use cases and varying levels of urgency that  determine the type of note you choose. Below are examples of each note type and use cases:

-   **Primary** (type is unset or `type="primary"`, title defaults to "Note"): Used for additional related information that doesn't fit the rest of the document. May include alternative suggestions or solutions, developer tips, or general best practices not critical to the success of the task at hand.

    {{< note title="Best Practice: Use Password Generators" >}}
    When creating root, user, or other passwords, increase security by using a password generator such as [1Password](https://www.1password.com) to create and save complex, encrypted passwords.
    {{< /note >}}

-   **Secondary** (`type="secondary"`, title defaults to "Note"): Most commonly used in tandem with the [collapsible parameter](#collapsible). This type can include non-critical information, commands, code, or output that takes up too much room or doesn't require visibility for success of an action.

    {{< note type="secondary" title="Amsterdam Data Center: Lish SSH Gateway Fingerprints" isCollapsible=true >}}
    ```command
    RSA 3072 SHA256:/y+83+sA3JdDGkv/KLnIAIXqfgqWfgp5RZ+DCx1T4yU lish-nl-ams.linode.com
    ECDSA 256 SHA256:iR/He+teo+c7jqr8LzaTikbTlMDdIkIERhJBXdIjO8w lish-nl-ams.linode.com
    ED25519 256 SHA256:vxF9arB2lYBVP45ZA7t1JEE9w/vthPmzU3a2oOR8O7Y lish-nl-ams.linode.com
    ```
    {{< /note >}}

-   **Warning** (`type="warning"`, title defaults to "Warning"): Notices warning the reader to proceed with caution, including notices for beta programs, warnings of limited resource availability, etc. Not as urgent as alert notes.

    {{< note type="warning" title="VPC Beta Notice" >}}
    VPCs are now publicly available in beta, providing customers with another method of isolating network traffic between Compute Instances (in addition to the [VLANs](/docs/products/networking/vlans/) feature). Not all data centers are currently supported. For more information, review the [Availability](/docs/products/networking/vpc/#availability) section.
    {{< /note >}}

-   **Alert** (`type="alert"`, title defaults to "Important"): The most urgent of all note types. **Alert** notes should be used to notify of potential *destructive* actions (i.e., situations resulting in data loss or where there is no undoing what has been done). Anything critical to the success of a task is still included in the primary content and not solely live in the note.

    {{< note type="alert" title="Back up files to prevent data loss" >}}
    Formatting a Block Storage Volume will delete all data stored on that Volume. To prevent data loss, verify that any files you wish to retain have been successfully backed up to another storage device.
    {{< /note >}}

#### Titles

Use the title parameter to give each note a descriptive title that explains its purpose or summarizes its content. **Avoid generic default titles like "Note" or "Important" - custom titles help readers assess relevance at a glance.**
- Example summary titles: "Use a strong password", "The token is valid for 24 hours", "A valid payment method is required"
- Example tip or best practice titles: "Developer Tip", "Common Practice"
- Example calls to attention: "Before moving forward", "This may result in data loss"

**Title casing:**
- If using a single word or phrase, use title casing. *Preferred.*
- If using a sentence as your title, use sentence casing. Otherwise, use title casing.

```file {lang="text"}
{{</* note title="Custom titles can be helpful" */>}}
This is an example note with a helpful custom title.
{{</* /note */>}}
```

{{< note title="Custom titles can be helpful" >}}
This is an example note with a helpful custom title.
{{< /note >}}

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

Notes can also be made collapsible by setting `isCollapsible=true` (defaults to false). This hides the body of the note and displays a collapse/expand icon. **Secondary notes** are often used for collapsible notes.

```file {lang="text"}
{{</* note type="secondary" title="This is a collapsible secondary note with a custom title" isCollapsible=true */>}}
This content is hidden until the user expands the note.
{{</* /note */>}}
```

{{< note type="secondary" title="This is a collapsible secondary note with a custom title" isCollapsible=true >}}
This content is hidden until the user expands the note.
{{< /note >}}

#### Indentation

Content within note shortcode tags must match the indentation of parent elements, such as list items. Since list content uses 4 spaces indentation, note conteent within lists must also be indented 4 spaces.

By default, content between shortcode tags uses `.InnerDeindent`, which automatically adjusts indentation to match parent elements (like lists). When set to `false`, `.Inner` is used instead, which maintains the original indentation regardless of parent elements. Defaults to true.

```file
-   First list item.

    {{</* note */>}}
    This content appears within the first list item and, as such, respects its indentation.
    {{</* /note */>}}

-   Second list item.
```

If this indentation is not properly indented (which should only occur in older note shortcodes created before this change), the following option is set: `respectIndent=false`. If you encounter this when editing an existing guide, remove `respectIndent=false` and properly indent the shortcode content.

```file
-   First list item.

    {{</* note respectIndent=false */>}}
This content appears within the first list item but isn't properly indented to match it.
{{</* /note */>}}

- Second list item.
```

### Hugo Shortcodes and VS Code Preview

When writing guides, Hugo  shortcodes (like {{< note >}}, {{< file >}}, {{< command >}}, etc.) doesn't display properly in VS Code's markdown preview ("Shift + Ctrl + V") - they appear as raw text. This is expected behavior. The shortcodes render correctly when the documentation site is built with Hugo.

### Extend Markdown Using Shortguides

Shortguides allow you to extend a Markdown file by inserting content from another file. For common tasks such as basic software installation, you can create reusable shortguides and insert them using the content shortcode. This allows our library to maintain consistent and up-to-date installation instructions for frequently used tools such as Python, MySQL, and Docker.

To create one, start by drafting a standalone Markdown file that contains the task-specific instructions. Once saved, it can be referenced across multiple guides using the content shortode, ensuring consistency and reduing duplication.

1.    Create a directory using the name of your shortguide anywhere within the docs/ folder.

1.    Create an index.md file in that directory for your shortguide content (e.g., example-shortguide-name/index.md).

1.    Set or add headless: true to the front matter of index.md to exclude the shortguide from site navigation and search results.

When using shortguides:

-    **To embed a shortguide**: Use the content shortcode with the shortguide's directory name as the parameter (e.g., example-shortguide-name)
-    **To include images in a shortguide**: Add the image to your shortguide's directory and embed it using the image shortcode:

```file
{{</* image src="image-name.png" alt="image alt label" title="image title" */>}}
```

#### Example Usage

The following shortguide demonstrates how to install Python using Miniconda. Create a directory named `install_python_miniconda` and an `index.md` file within it:

```file {title="install_python_miniconda/index.md" lang="yaml"}
---
title: "Install Python with Miniconda"
description: 'A shortguide that shows how to install Python via Miniconda.'
keywords: []
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
contributors: ["Author's FirstName LastName"]
published: 2023-03-07
modified: 2023-03-07
headless: true
show_on_rss_feed: false
---

<!-- Installation instructions for Python 3. -->

1.  Download and install Miniconda:

    ```command
    curl -OL https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh
    bash Miniconda3-latest-Linux-x86_64.sh
    ```

1.  During installation you're prompted to review the terms and conditions. Select "yes" to accept for each prompt.

1.  Check your Python version:

    ```command
    python --version
    ```
```

To use this shortguide in another guide, use the following syntax:

```file {title="sample_embedding_guide/index.md"}
{{%/* content "install_python_miniconda" */%}}
```

{{< note >}}
Be sure to use the `%` delimiter inside the surrounding `{{ }}` braces when embedding a `content` shortcodes.
{{< /note >}}

## Standards and Best Practices

### Example IP Addresses

When referencing IP addresses in documentation, any real address should be obscured unless it's explicitly intended for the reader to access it. When possible, use example IP addresses from the reserved documentation blocks:

-   `192.0.2.0/24`
-   `198.51.100.0/24`
-   `203.0.113.0/24`

    These subnets are allocated specifically for documentation and prevent accidental routing or conflict in production environments.

Use these blocks in order: begin with `192.0.2.0/24` for the first example IP address. If additional examples are needed, draw from the next available block.

{{< warning >}}

When referencing the IPv4 address of a Compute Instance, avoid using `.0` or `.1` as the final octet, since those addresses are typically reserved and assigned to Compute Instances. For example, `192.0.2.17` is appropriate, while `192.0.2.0` and `192.0.2.1` should be avoided.

{{< /warning >}}

{{< warning >}}

For IPv6 examples, use the reserved documentation block:
-   `2001:db8::/32`
    The IPv6 block  2001:db8::/32 is similarly reserved to ensure example addresses don't interfere with live traffic.

{{< /warning >}}

### Numerical Values

| 1-10 | Greater than 10 |
| -- | -- |
| Use words (one, two, three, etc.)  | Use numerical digits (11, 22, 33). |

### External Resources/More Information

If you wish to provide links to external sites for the user to review after going through your guide, do so using the `external_resources` parameter in the [page header](#metadata-header). This will automatically appear as a text block with links at the bottom of the page.

> More Information
>
> You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.
>
> - [Link Title 1](http://www.example.com)
> - [Link Title 2](http://www.example.net)
>
> This approach keeps the body of your content clean and ensures consistent formatting across guides.

## Author Pages

Profile pages for [Contributors](https://www.linode.com/docs/contributors/) are listed. These are automatically generated from the `authors` frontmatter of the guides in the library. These pages list all of the guides that an author has contributed in the docs library.

Docs contributors can create author pages by following these steps:

{{< note >}}
The second step is optional. If you do not follow this step, a profile page is still automatically generated from the `authors` frontmatter of the guides you have written. The second step shows you how to add custom biographical information to the profile page.
{{< /note >}}

1.  On the guides you have written, update the `authors` frontmatter to reference your name. This should be formatted like:

    ```file
    contributors: ["FirstName LastName"]
    ```

1.  (Optional) Create a new directory and Markdown file for your author page under the `docs/authors` directory in the docs repository. The new directory (folder) should named after you. Replace uppercase letters with lower case, and replace spaces with a dash. For example, an author with the name `Nathan Smith` would have a new profile page created at `docs/authors/nathan-smith/_index.md`.

    {{< note >}}
    Markdown file name is named `_index.md`, not `index.md`
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

    You can add an email, website link, and short meta description in the frontmatter of this file. You can also update the body of the file with a biography of the author. This biography displays above the author's published guides listing.

## Legal Information

COPYRIGHT OWNERSHIP. Writer agrees that the Work is being created by the writer for the Linode Guides & Tutorials repository and that each form of Work is being created by the writer as a “work made for hire” under the United States Copyright Act and, at all stages of development, the Work shall be and remain the sole and exclusive property of Linode. At Linode's sole, absolute and unfettered discretion, Linode may make any alterations to the Work.

CREDIT. Nothing contained in this Agreement shall be deeded to require Linode to use the Work, or any part thereof, in connection with Linode Guides & Tutorials or otherwise. Credit for the Work shall read, "Contributed by [writer's name]."

PAYMENT. Upon publication of a submission to the Linode Guides & Tutorials Repository, the writer will be paid the sum agreed to by email by both Linode and the author. Author may choose payment either in the form of a credit to their Linode account, a hardcopy check, or as an electronic payment via PayPal.
