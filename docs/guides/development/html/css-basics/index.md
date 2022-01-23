---
slug: css-basics
author:
  name: Linode Community
  email: docs@linode.com
description: "Want to learn CSS basics? Our beginner’s guide explains what CSS does, CSS structure, and how to use CSS internally, externally, & inline. ✓ Learn more!"
og_description: "Want to learn CSS basics? Our beginner’s guide explains what CSS does, CSS structure, and how to use CSS internally, externally, & inline. ✓ Learn more!"
keywords: ['css basics','css introduction','what is css']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-01-23
modified_by:
  name: Nathaniel Stickman
title: "CSS Tutorial: An Intro to CSS Languages from Linode"
h1_title: "CSS Basics: The Ultimate Tutorial for Beginners"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[W3 Schools: CSS Introduction](https://www.w3schools.com/css/css_intro.asp)'
- '[freeCodeCamp: Learn CSS in 5 Minutes - A Tutorial for Beginners](https://www.freecodecamp.org/news/get-started-with-css-in-5-minutes-e0804813fc3e/)'
- '[Great Learning: Introduction to CSS | CSS Tutorial for Beginners](https://www.mygreatlearning.com/blog/css-tutorial/)'
- '[edX: CSS Basics](https://www.edx.org/course/css-basics)'
---

CSS forms the backbone of web page styles, making it possible to craft a unique look, feel, and experience for your web pages. But how does CSS work, and how can you get started using it?

This CSS tutorial introduces you to what CSS is, how it operates, and the basics of CSS usage.

## What is CSS?

CSS — **C**ascading **S**tyle **S**heets — is the language used to control how web page content displays. CSS makes it possible to manipulate the color, size, positioning, and other style aspects of HTML elements.

Modern web pages apply CSS styles to set themselves apart. Custom CSS lets you control your web page's tone, layout, and clarity. Ultimately, CSS gives you the tools to present your content in more meaningful and impactful ways.

### How Does CSS Work with HTML?

CSS is the go-to language for stylizing HTML web pages. Although CSS and HTML are independent, they work together exceptionally well, especially when each is used in its ideal role.

HTML was designed to structure web content. In itself, HTML is not oriented around content styling. HTML, instead, operates ideally for organizing and describing content blocks with element tags.

CSS is then able to use the organization and the content blocks described by the HTML to customize a page's style. Different blocks can be styled based on the kind of element, the element's class, and the element's ID.

The result of the two working together in these roles is a well structured, easily stylized, and maintainable web page.

## What Does CSS Do?

Generally, CSS handles everything related to the styling of web pages. And CSS does its styling at any and all levels — from the individual element, to element groups, to the entire web page.

What CSS can alter includes:

- Colors, from the colors of text to elements' background colors

- Text formatting, changing font sizes and giving font styles like bold and italics

- Element appearance, from rounding the corners to adding shadow effects

- Layout, determining elements' width, height, and arrangement in relation to other elements

In short, CSS gives you control of a page's presentation. Any and all aspects related to how elements display can be adjusted from within CSS.

## CSS Basics: Structure

CSS code consists of one or more *rules*, each of which contains one or more properties applying specific styling to one or more elements.

In terms of syntax, each rule is made up of two parts:

- The *selector*, which begins each rule and defines what element or elements the style applies to. Typically, the selector is either the element tag name or the class or ID attribute value for the element.

    See the next section for more on understanding and using selectors.

- One or more style *declarations* within curly braces, each consisting of a CSS *property* and a value *value* for it.

To demonstrate, here is an example CSS rule. This rule's selector indicates that the rule applies to all paragraph (`<p>`) elements. The rule then has three declarations applying styles to each `<p>` element's font:

    p {
        font-family: Open Sans;
        font-size: 12pt;
        color: darkslategray;
    }

You can refer to Mozilla's [CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference) for an index of available CSS properties for applying in your rules.

### CSS Selectors

CSS selectors actually provide a powerful syntax for specifying elements to apply CSS rules to.

The example above simply uses the element name (`p`), which you can do with any element type. You can also do the same for element's class names and IDs.

- To select elements by class, use `.` followed by the class name. For instance, `.element-group` selects all elements with the class `element-group`.

- To select an element by its ID, use `#` followed by the ID. Using `#first-element` selects the element with the ID `first-element`.

You can also combine all of these kinds of selectors to get more specific selections. A selector of `p.element-group#first-element` selects only `<p>` elements with the `element-group` class and an ID of `first-element`.

There are numerous more advanced operations available for selectors, too many to cover here. You can, however, see some of these demonstrated in the next section, to give you an idea of their capabilities.

If you are interested in learning more about CSS selectors, take a look at Mozilla's [CSS Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) documentation.

## How to Use CSS

There are three ways you can start applying CSS to HTML pages, and these next sections outline each approach. The sections are arranged from the lowest scale to the most scalable approaches.

### Inline

*Inline* CSS gets applied on each necessary element using the `style` attribute. This method does not require the use of CSS selectors on your style rules, since everything is done in the individual HTML elements:

    <div style="background-color: cornflowerflue; color: white; text-align: center;">
        <p style="font-style: italic;">First paragraph</p>
        <p>Second paragraph</p>
    </div>
    <div>
        <p style="font-weight: bold;">Third paragraph</p>
    </div>

Inline CSS is workable for small web pages where individual elements are all you need to manage CSS styles on. However, it becomes troublesome to maintain as web pages grow and as you want to apply styles to groups of elements.

### Internal

*Internal* CSS is applied using the `<style>` element within the HTML document's `<head>` tags. All of your CSS code can simply go between the `<style>` tags.

This example works like the one above, but applies universal styles for `<div>` and `<p>` elements and uses the `id` attribute for exceptions:

    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8>
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

### External

*External* CSS gets linked to your HTML code from a separate CSS file. Having your CSS in a separate file tends to make your web pages more scalable and easier to manage in the long run.

Another convenience of having a separate CSS file is that multiple pages can reference the same file. That way, your CSS file can come to define an overall style for a collection of web pages.

An HTML page links to a CSS file using the `<link>` element, which should be located within the page's `<head>` element. The `<link>` element should have two attributes:

- `rel="stylesheet"` to define how the linked file should be used — as a style sheet for the current HTML page

- `href` to reference the relative location of the CSS file

Here is an example of a `<link>` element for importing an external CSS file:

    <link rel="stylesheet" href="styles.css">

#### Example HTML with External CSS

What follows is a full example using external CSS.

To start, create one or more HTML pages, each with a `<link>` element in the `<head>` indicating the CSS file to use. Here is a single web page which uses the `example.css` file for its CSS:

{{< file "example.html" html >}}
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
{{< /file >}}

Then, create a CSS file defining the style rules for your web page or pages, like this one:

{{< file "example.css" css >}}
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
{{< /file >}}

Finally, check out the results by visiting your HTML page in a web browser. You can see the example above in action by visiting [this link](example.html).

## Conclusion

You now have a thorough basis for the essentials of CSS. This tutorial has walked you through what CSS is, how it works with HTML, and given you examples for putting it to use in your web pages.

When you are ready to put your website out there, check out our guides on how to do it, like [Set Up a Web Server and Host a Website on Linode](/docs/guides/set-up-web-server-host-website/).

Have more questions or want some help getting started? Feel free to reach out to our [Support](https://www.linode.com/support/) team.
