---
slug: html-basics
title: "An Essential Guide to HTML Basics from Linode"
title_meta: "Basic HTML Codes Every Developer Should Know"
description: 'Want to learn HTML basics for coding? Our beginner’s guide explains the anatomy of an HTML element and includes examples. ✓ Learn more at Linode!'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['html basics','html base template','basic html']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Nathaniel Stickman"]
published: 2023-03-07
modified_by:
  name: Linode
external_resources:
- '[W3 Schools: HTML Basic Examples](https://www.w3schools.com/html/html_basic.asp)'
- '[MDN Web Docs: HTML Basics](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics)'
- '[freeCodeCamp: Learn HTML Basics for Beginners in Just 15 Minutes](https://www.freecodecamp.org/news/html-basics-for-beginners/)'
- '[HTML.com](https://html.com/)'
---

HTML is the basis for almost every web page. It gives structure to page content and lets you design how that content is presented.

This tutorial walks you through the basics of HTML coding. It explains what HTML is, shows the most common elements for HTML code, and provides a simple HTML base template.

## What is HTML?

Hyper Text Markup Language (HTML) is the code used to structure web pages. HTML elevates pages to more than just text. It organizes how content displays on the page and lets you display content like images and hyperlinks.

Each HTML page consists of various elements, which are generally *tags* wrapping or defining content and determining how that content is displayed. Different kinds of elements serve different roles and have different effects on the page.

For instance, a `<p>` tag wraps a paragraph of text and other content. An `<img>` tag references an image file and displays that image on the page.

Keep reading to learn more about elements and how to use them to structure HTML pages.

### What is HTML Used For?

HTML is the language of web page design. Almost all web pages, from the simplest to the most complicated, are fundamentally organized using HTML. HTML lets you arrange your web page's content in meaningful and evocative ways, rather than just displaying a wall of content.

Therefore, HTML's primary purpose is design. It controls the look and feel of web pages. It enables you to display content more meaningfully and compellingly.

## The Anatomy of an HTML Element

As stated in the previous section, HTML pages are made up of *elements*. Each element essentially consists of three parts:

-   An *opening tag* defines the start of the element. It consists of the element name in angle brackets. For example: `<p>`.

-   A *closing tag* pairs with an opening tag and defines the end of an element. It looks like its opening tag partner, but it has a forward slash (`/`) before the element name. For example: `</p>`.

-   The *content* consists of everything between the opening and closing tags. This is often text, but it can also be other elements and their contents.

Together, these three parts make up an element. Elaborating on the examples above, you can make a `<p>`, or paragraph, element like so:

```
<p>This is text content.</p>
```

### Basic HTML Examples

This section details some of the essential and common HTML elements for building web pages. It includes everything from the required template elements to elements for formatting how text content displays.

Toward the end of this section, all of these elements are put together into an example web page. You can use this example as a simple HTML template for building your own pages.

#### Essentials

First, there are a few elements that are either necessary or highly recommended for all web pages:

-   `<!doctype html>` should be included at the beginning of all web pages. It is a single tag (without a closing tag) that helps browsers know how to parse your code.

-   The `<html>` element defines the page's HTML content. All of the HTML code, outside of the `<!doctype html>` element, should be placed within `<html>` tags.

-   The `<head>` element contains information about the page. This element's content is usually not displayed on the page, but affects how the page is processed or what gets displayed on the browser's title bar.

    -   For instance, the `<meta charset="utf-8">` element should be placed here. This tag, which does not need a closing tag, makes sure browsers read the HTML file correctly.

    -   The `<title>` element is also included here. Its content determines the page's title as it displays on the browser's title bar.

-   The `<body>` element houses the page's displayed content. All of the HTML for how and what the page is to display goes between the `<body>` tags.

#### Formatting Text Content

Several elements are available for displaying and formatting text content. This list highlights some of the most commonly used and most useful of those.

-   The `<p>` element contains standard text presented as a discrete paragraph:

    ```
    <p>This is a paragraph of text.</p>
    <p>This is a separate paragraph of text.</p>
    ```

    Paragraphs can also hold content other than text, like links and images (see the next section for more on those).

-   Formatting elements, like `<em>`, `<i>`, and `<strong>`, quickly and conveniently format text in predetermined ways.

    -   Use `<em>` to put emphasis on a word or phrase. Use `<i>` to set a piece of text like a title or a foreign-language term apart. Typically, both elements result in italic font for the text.

    -   Use `<strong>` to mark words or phrases as important or significant. Usually, this results in the use of bold font on the text.

-   The `<span>` element separates parts of text for styling purposes. In themselves, `<span>` elements do not have any immediate effect on how text displays. However, they are convenient for applying CSS styles and for using other stylizing attributes on text.

    Here is an example which uses the `hidden` attribute on the `<span>` element to hide a portion of the text:

    ```
    <p>This is some <span hidden>text </span>content.</p>
    ```

    ```output
    This is some content.
    ```

    Learn more about using element attributes in the [So What are HTML Attributes?](/docs/guides/html-basics/#so-what-are-html-attributes) section further below.

-   Header elements, like `h1`, `h2`, and `h3`, apply header level styles to text. These are useful for easily giving visual distinction to different sections on a web page:

    ```
    <h1>Page Title</h1>

    <h2>First Section</h2>
    <p>Some content</p>

    <h3>Subsection of the First Section</h3>
    <p>A little more content</p>

    <h2>Second Section</h2>
    <p>Further content</p>
    ```

#### Links and Images

Links and images are elements that require an attribute to work properly. Usually, that attribute references an external URL or file location.

-   The `<a>` element (for Anchor) designates a hyperlink. Most often, it uses the `href` attribute to link to a URL:

    ```
    <p>This is some text content. Learn more about using HTML <a href="https://www.linode.com/docs/">here</a>.</p>
    ```

    The `<a>` element can also be used to assign anchor points on a web page. These let you link to specific locations on a page. The next example makes the `h2` element an anchor and provides a link back to it in the subsequent `<p>` element:

    ```
    <h2><a name="section_one">Section 1</a></h2>
    <p>This is a paragraph in <a href="#section_one">Section One</a></p>
    ```

-   The `<img>` element displays images. It uses the `src` attribute to locate the file for the image to be displayed:

    ```
    <p>The image below is of a cat.</p>
    <p><img src="cat-silhouette.png"/></p>
    ```

    The `<img>` element is an exception in that it does not require a closing tag. This is because it does not wrap content, rather its content comes from the `src` attribute.

#### Sections

Web pages can be divided into sections, making the code easier to read and the content easier to work with.

The main element for dividing HTML pages is the `<div>` element:

```
<div>
  <h2>Section 1</h2>
  <p>Content</p>
</div>
<div>
  <h2>Section 2</h2>
  <p>More content</p>

  <div>
    <h3>Subsection 2.1</h3>
    <p>Even more content</p>
  </div>
</div>
```

Like the `<span>` element, the `<div>` element does not have any direct effect on how content is displayed. However, the `<div>` element becomes an excellent tool for managing how sections display with CSS styles and other stylizing attributes.

Here is a simple example using the `style` attribute to assign the `text-align` CSS attribute:

```
<div style="text-align: left;">
  <p>Left-aligned text</p>
</div>
<div style="text-align: center;">
  <p>Centered text</p>
</div>
<div style="text-align: right;">
  <p>Right-aligned text</p>
</div>
```

#### Putting It All Together

To demonstrate the concepts above in action, here is an example web page. This is a full web page, capable of displaying content in a browser. In fact, you can visit this example page [here](example.html).

```file {title="example.html" lang="html"}
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Example Page</title>
  </head>
  <body>
    <div>
      <h2><a name="section_one">Section 1</a></h2>
      <p>This is a paragraph in the <a href="#section_one">first section</a>. Learn the HTML skills you need to make your own web page <a href="https://www.linode.com/docs/">here</a>.</p>
    </div>

    <div>
      <h2>Section 2</h2>
      <p>Here, we have yet <em>another</em> paragraph, this time for the second section.</p>

      <div>
        <h3>Section 2.1</h3>
        <p>Below is an <span style="color: blue;">image</span> of a <span color="color: red;">cat</span>.</p>
        <p><img src="cat-silhouette.png"/></p>
      </div>
    </div>

    <div>
      <h2>Section 3</h2>
      <div style="text-align: left;">
        <p>Left-aligned text</p>
      </div>
      <div style="text-align: center;">
        <p>Centered text</p>
      </div>
      <div style="text-align: right;">
        <p>Right-aligned text</p>
      </div>
    </div>
  </body>
</html>
```

## What are HTML Attributes?

In addition to name and content, elements can also have *attributes*. Attributes are applied in the opening tag, using the format `attribute_name="attribute value"`. They can do everything from:

-   Naming and classifying elements, using the `name`, `id`, and `class` attributes.

-   Controlling display, through attributes like `align` and especially `style`, which lets you add CSS in place.

-   Referencing external content, such as `<a>` elements using the `href` attribute and `<img>` elements using the `src` attribute.

Some attributes are included in the examples above, but for a further breakdown, here are three ways you may see attributes used in HTML:

-   In some cases, for example `<a>` and `<img>` elements, attributes are essentially required for the tags to work. A link without an `href` attribute cannot actually take the user anywhere, and, without a `src` attribute, images cannot be displayed.

-   Other times, attributes can provide extra control. For instance, the `align` attribute can be added to many text-formatting elements to control how they position the text:

    ```
    <p align="center">This text is centered on the page.</p>
    ```

-   Some elements essentially do not alter the page's display except through attributes applying CSS or other styling. This applies to elements like `<span>` and `<div>`, both of which use the `style` attribute to apply CSS in the example above.

To learn more about using CSS styling on HTML pages, take a look at our [CSS Tutorial: An Intro to CSS Languages from Linode](/docs/guides/css-basics/).

## Conclusion

This guide provides a rundown on the basics of HTML. It has examples of the elements of an HTML page along with a simple, but complete HTML template.

When you're ready to publish your website, check out our guide [Set Up a Web Server and Host a Website on Linode](/docs/guides/set-up-web-server-host-website/).