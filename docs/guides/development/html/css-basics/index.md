---
slug: css-basics
title: "CSS Tutorial: An Intro to CSS Languages from Linode"
title_meta: "CSS Basics: The Ultimate Tutorial for Beginners"
description: 'Want to learn CSS basics? Our beginner’s guide explains what CSS does, CSS structure, and how to use CSS internally, externally, & inline. ✓ Learn more!'
og_description: 'Want to learn CSS basics? Our beginner’s guide explains what CSS does, CSS structure, and how to use CSS internally, externally, & inline. ✓ Learn more!'
keywords: ['css basics','css introduction','what is css']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Nathaniel Stickman"]
published: 2023-03-07
modified_by:
  name: Linode
external_resources:
- '[W3 Schools: CSS Introduction](https://www.w3schools.com/css/css_intro.asp)'
- '[freeCodeCamp: Learn CSS in 5 Minutes - A Tutorial for Beginners](https://www.freecodecamp.org/news/get-started-with-css-in-5-minutes-e0804813fc3e/)'
- '[Great Learning: Introduction to CSS | CSS Tutorial for Beginners](https://www.mygreatlearning.com/blog/css-tutorial/)'
- '[edX: CSS Basics](https://www.edx.org/course/css-basics)'
---

CSS forms the backbone of web page styles, making it possible to craft a unique look, feel, and experience. But how does CSS work, and how do you start using it?

This tutorial covers what CSS is, how it operates, and the basics of its usage.

## What is CSS?

Cascading Style Sheets (CSS) is the language used to control how web page content displays. CSS makes it possible to manipulate the color, size, positioning, and other style aspects of HTML elements.

Modern web pages apply CSS styles to set themselves apart. Custom CSS can control a web page's tone, layout, and clarity. Ultimately, CSS provides the tools to present content in more meaningful and impactful ways.

### How Does CSS Work with HTML?

CSS is the go-to language for stylizing HTML web pages. Although CSS and HTML are independent, they work together exceptionally well, especially when each is used in its ideal role.

HTML was designed to structure web content. It is not naturally oriented around content styling. Instead, HTML is best for organizing and describing content blocks with element tags.

CSS is then able to use the organization and the content blocks described by the HTML to customize a page's style. Different blocks can be styled based on element type, class, and/or ID.

The result of the two working together in these roles is a well-structured, nicely stylized, and easily maintainable web page.

## What Does CSS Do?

Generally, CSS handles everything related to the styling of web pages. CSS applies styling at any and all levels, from the individual element, to element groups, to the entire web page.

CSS can alter:

-   **Colors**: This includes the color of text as well as elements' background colors.

-   **Text Formatting**: Changing font sizes, and applying font styles like bold and italics.

-   **Element Appearance**: Everything from rounding corners to adding outlines and shadow effects.

-   **Layout**: Determining elements' width, height, and arrangement in relation to other elements.

In short, CSS controls a page's presentation. All aspects related to how elements display can be adjusted from within CSS.

## CSS Basics: Structure

CSS code consists of one or more *rules*. Each rule contains one or more properties that apply specific styling to one or more elements.

In terms of syntax, each rule is made up of two parts:

-   The *selector* begins each rule and defines what element or elements the style applies to. Typically, the selector is either the element tag name or the class or ID attribute value for the element. See the next section for more on understanding and using selectors.

-   One or more style *declarations* within curly braces, each consisting of a CSS *property* and a *value* for it.

To demonstrate, here is an example CSS rule. This rule's selector indicates that the rule applies to all paragraph (`<p>`) elements. The rule has three declarations that apply styles to the text of each `<p>` element:

```
p {
    font-family: Open Sans;
    font-size: 12pt;
    color: darkslategray;
}
```

Refer to Mozilla's [CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference) for an index of available CSS properties.

### CSS Selectors

CSS selectors provide a powerful syntax for specifying elements to apply CSS rules to.

The example above simply uses the element name (`p`), but this can be done with any element type. You can also do the same for an element's class names and IDs.

-   To select elements by class, use `.` followed by the class name. For instance, `.element-group` selects all elements with the class `element-group`.

-   To select an element by its ID, use `#` followed by the ID. Using `#first-element` selects the element with the ID `first-element`.

You can also combine all of these selectors to get more specific selections. A selector of `p.element-group#first-element` selects only `<p>` elements with the `element-group` class and an ID of `first-element`.

There are many more advanced operations available for selectors, far too many to cover here. However, some of these are demonstrated in the next section to provide an idea of their capabilities.

To learn more about CSS selectors, take a look at Mozilla's [CSS Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) documentation.

## How to Use CSS

There are three ways to start applying CSS to HTML pages, and the next sections outline each approach. The sections are arranged from the least to the most scalable approaches.

### Inline

*Inline* CSS is applied on each necessary element using the `style` attribute. This method does not require the use of CSS selectors on your style rules, since everything is done in the individual HTML elements, for example:

```
<div style="background-color: cornflowerblue; color: white; text-align: center;">
    <p style="font-style: italic;">First paragraph</p>
    <p>Second paragraph</p>
</div>
<div>
    <p style="font-weight: bold;">Third paragraph</p>
</div>
```

Inline CSS is workable for small web pages where individual elements are all you need to style. However, it becomes troublesome to maintain as web pages grow. You may also want to apply styles to entire groups of elements.

### Internal

*Internal* CSS is applied using the `<style>` element within the HTML document's `<head>` tags. All of the CSS code can simply go between the `<style>` tags.

This example works like the one above, but applies universal styles for `<div>` and `<p>` elements and uses the `id` attribute for exceptions:

```
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Example Page</title>
    <style>
      div {
          background-color: cornflowerblue;
          color: white;
          text-align: center;
      }

      p {
          font-style: italic;
      }

      #second-div {
          background-color: transparent;
          color: black;
          text-align: left;
      }

      #third-paragraph {
          font-style: normal;
          font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div>
      <p>First pagraph</p>
      <p>Second paragraph</p>
    </div>
    <div id="second-div">
      <p id="third-paragraph">Third paragraph</p>
    </div>
    <div>
      <p>Fourth paragraph</p>
    </div>
  </body>
</html>
```

### External

*External* CSS is linked to the HTML code from a separate CSS file. Having the CSS in a separate file tends to make web pages more scalable and easier to manage in the long run.

Another convenience of having a separate CSS file is that multiple pages can reference the same file. That way, the CSS file can define an overall style for a collection of web pages.

An HTML page links to a CSS file using the `<link>` element, which should be located within the page's `<head>` element. The `<link>` element should have two attributes:

-   `rel="stylesheet"` to define how the linked file should be used (i.e. as a style sheet for the current HTML page).

-   `href` to reference the relative location of the CSS file.

Here is an example of a `<link>` element for importing an external CSS file:

```
<link rel="stylesheet" href="styles.css">
```

#### Example HTML with External CSS

What follows is a full example using external CSS.

To start, create one or more HTML pages, each with a `<link>` element in the `<head>` indicating the CSS file to use. Here is a single web page which uses the `example.css` file for its CSS:

```file {title="example.html" lang="html"}
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Example Page</title>
    <link rel="stylesheet" href="example.css">
  </head>
  <body>
    <header class="header">
      <h1>Example Page</h1>
    </header>
    <div class="left-column blue">
      <p>First pagraph</p>
      <p>Second paragraph</p>
    </div>
    <div>
      <p>Third paragraph</p>
      <p>Fourth paragraph</p>
    </div>
    <footer class="footer">
      <p>The End</p>
    </footer>
  </body>
</html>
```

Next, create a CSS file defining the style rules for your web page or pages, like this one:

```file {title="example.css" lang="css"}
div {
    float: right;
    width: 50%;
    text-align: left;
}

p {
    font-style: italic;
}

header, footer {
    float: inline-end;
    width: 100%;
    text-align: center;
    font-style: normal;
    font-weight: bold;
}

.left-column {
    float: left;
    width: 25%;
    text-align: right;
}

.blue {
    background-color: cornflowerblue;
    color: white;
}

.blue > p {
    font-style: normal;
}
```

Finally, check out the results by visiting your HTML page in a web browser. You can see the example above in action by visiting [this link](example.html).

## Conclusion

You now have a thorough basis for the essentials of CSS. This tutorial walks through what CSS is, how it works with HTML, and provides examples for putting it to use in your own web pages.

When you're ready to publish your website, check out our guide [Set Up a Web Server and Host a Website on Linode](/docs/guides/set-up-web-server-host-website/).