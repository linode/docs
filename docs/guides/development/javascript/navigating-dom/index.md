---
slug: navigating-dom
author:
  name: Linode Community
  email: docs@linode.com
description: "Learn how to navigate and access nodes in the DOM using JavaScript."
og_description: "Learn how to navigate and access nodes in the DOM using JavaScript."
keywords: ['navigating the dom','accessing the dom','dom tree javascript']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-21
modified_by:
  name: Nathaniel Stickman
title: "How to Navigate and Access Elements of the DOM with JavaScript"
h1_title: "How to Navigate and Access Elements of the DOM with JavaScript"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[MDN Web Docs: Document Object Model (DOM)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)'
- '[W3 Schools: HTML DOM querySelector() Method](https://www.w3schools.com/jsref/met_document_queryselector.asp)'
- '[MDN Web Docs: Document.querySelector()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)'
---

The Document Object Model (DOM) represents web pages in a way that can be accessed and worked within JavaScript. You can learn more about the DOM in the previous guide in this series, **Introduction to the DOM**.

The DOM is organized as a tree of objects, called nodes, which give access to everything from HTML elements to the displayed text. Understanding how to navigate and access nodes on this tree is pivotal to getting the most out of the DOM.

This guide explains the DOM tree, how to navigate it, and how to access nodes on it using JavaScript.

## Before You Begin

The examples in this guide use a web browser's developer tools to view the DOM and interact with a JavaScript console. You can follow along using your browser:

- If you are using Chrome, refer to Google's [Open Chrome DevTools](https://developer.chrome.com/docs/devtools/open/#elements) documentation.
- If you are using Firefox, refer to Mozilla's [Open the Inspector](https://developer.mozilla.org/en-US/docs/Tools/Page_Inspector/How_to/Open_the_Inspector) documentation.

Most of this guide's examples are based on an example web page resulting from the following HTML source code. You can most easily follow along with the guide's examples by visiting [the example page](example-page.html) in your web browser:

{{< file "example-page.html" html >}}
<!DOCTYPE html>
<html>
    <head>
        <title>Example Page</title>
    </head>
    <body>
        <div id="first-div" class="content-div">
            <p>Example page content.</p>
            <ul>
                <li><span class="numeral-name" style="color: green;">First</span> item</li>
                <li><span class="numeral-name" style="color: red;">Second</span> item</li>
            </ul>
        </div>
        <div id="second-div" class="content-div">
            <p><a href="https://loremipsum.io/">Lorem ipsum</a> dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tortor condimentum lacinia quis vel eros donec. Purus ut faucibus pulvinar elementum integer enim neque volutpat ac. Netus et malesuada fames ac turpis egestas sed tempus. Nulla posuere sollicitudin aliquam ultrices sagittis orci a scelerisque. Et netus et malesuada fames ac turpis egestas sed. Purus ut faucibus pulvinar elementum integer enim neque. <em>Amet consectetur adipiscing elit ut aliquam.</em></p>
        </div>
    </body>
</html>
{{< /file >}}

## Understanding the DOM Tree

The DOM is organized as a tree, each branch of which is a node. Though many nodes represent HTML elements, they also represent attributes and text associated with elements.

In the following sections, you learn more about the structure of the DOM tree. It also delves into the components used to identify nodes and sets of nodes, which is the basis for accessing nodes effectively.

### What Is the DOM Tree?

With the `document` object at its base, the DOM's nodes are arranged as a tree, with nodes nested under other nodes. Following is an example of the DOM tree:

    <body>
        <div>
            <p style="color: purple;">Paragraph text</p>
        </div>
        <div>
            <ul>
                <li>First item</li>
                <li>Second item</li>
            </ul>
        </div>
    </body>

In the example above, not only do elements nest under other elements — the two `div` elements under the `body` element, for instance. But also text nodes nest under the `p` and `li` elements, and the `style` attribute is considered a node under the `p` element as well.

Plotting this out, you get a tree that looks like:

    body
     \_ div
     |   \_ p
     |      \_ [text]
     |      |
     |      \_ [attribute]
     \_ div
         \_ ul
             \_ li
             |   \_ [text]
             |
             \_ li
                 \_ [text]

Knowing that the DOM is arranged in this way can help you access exactly the nodes you need, especially when DOMs get more complicated. You can see examples of how this is the case in the [Navigating the DOM Tree](/docs/guides/navigating-dom/#navigating-the-dom-tree) section below.

As a further example, the diagram below visualizes the DOM tree for the example page used throughout the rest of this guide (You can find this page referenced in the [Before You Begin](/docs/guides/navigating-dom/#before-you-begin) section of this guide).

[![A DOM tree for an example web page](dom-tree-example_small.png)](dom-tree-example.png)

### How Are Nodes Accessed?

Often, you want to be able to pinpoint a node or a particular set of nodes for accessing in JavaScript. Nodes are primarily identified by one or a combination of the three components below:

- *Tags*, used to define HTML elements. Common examples include `div` for page components, `p` for paragraphs, and `a` for hyperlinks.
- *Classes*, distinguishing similar elements. Classes are optional, but let you conveniently apply CSS styles and let you distinguish a subset of a particular kind of elements.
- *IDs*, which are meant to identify particular elements. These are most useful when used on elements that you want to be able to conveniently and consistently select individually from the DOM.

Although this is not always the case, the arrangement of these components above generally reflects the components' specificity, from least specific to most. For instance:

- A **tag** can be used to identify every `div` element on a page.
- A **class** can identify a smaller set of those `div` elements.
- An **ID** can identify one of those `div` elements in particular.

The [Navigating the DOM Tree](/docs/guides/navigating-dom/#navigating-the-dom-tree) section below shows how these components can be used to fetch particular elements or set of elements.

#### Query Selectors

The popular JavaScript library [jQuery](https://jquery.com/) introduced *query selectors*. These give you advanced ways to access DOM elements, using the above three components as well as attributes and other node features. Query selectors even let you combine all of these in a single command.

JavaScript now directly implements its own query selectors as well. This gives you ready access to advanced DOM selections, which are covered in depth later on in this guide.

But, to give you an idea, here are some examples of where you can use query selectors to fetch the elements. It can be based on:

- Elements matching a specific sequence of tag, class, and/or ID
- Elements with given an attribute and/or attribute value
- Elements with a matching parent element
- Elements that do not match a query

## Navigating the DOM Tree

Once you understand the DOM's tree structure and how nodes on it are identified, you can start making the most of JavaScript's tools. With these, you can efficiently navigate around the tree and access precisely the elements you need.

The sections below show how you can start picking out elements from the DOM to work with using JavaScript. This is divided into two sections:

1. Using standard methods on DOM objects. These have been around for a longer time and provide some of the most straightforward selection methods.
1. Using query selectors. These are relatively new features in standard JavaScript and provide advanced selection methods. They are ideal when you want to make complicated queries in a few commands.

### How to Access Elements via Object Methods

Most often, you can start accessing the DOM elements you need using methods on the `document` object. These allow you to match elements based on tag, class, or ID.

Moreover, these methods are inherited by any element object. This makes it possible to navigate the DOM tree from element to element, narrowing it down to the specific elements you need.

- To fetch elements based on tag, use the `getElementsByTagName` method:

        document.getElementsByTagName("p");

- To fetch elements based on class, use the `getElementsByClassName` method:

        document.getElementsByClassName("content-div");

- To fetch an element based on ID, use the `getElementById` method:

        document.getElementById("first-div");

All of these but `getElementById` return an array of elements, no matter how many elements actually match the query. Similarly, `getElementById` only returns the first matching element, even if multiple elements on the page have the same ID.

The following example shows how you can combine these in a series of commands. It also shows how you can leverage the fact that every element inherits these methods, allowing you to narrow your search down the DOM tree.

    // Fetch the element with the `first-div` ID. This uses the `document` object,
    // so the search looks at all elements on the page.
    const first_div_element = document.getElementById("first-div");

    // Fetch all of the `ul` elements from under the `first-div` element. Remember,
    // this method returns an array, even if there is only one matching element.
    const ul_elements = first_div_element.getElementsByTagName("ul");

    // Fetch the elements with the `numeral-name` class from under the first
    // element in the array of `ul` elements.
    const numeral_elements = ul_elements[0].getElementsByClassName("numeral-name");

    // Grab and print the `style.color` value from each of the matching
    // `numeral-name` elements.
    for (const span_element of numeral_elements) {
        console.log(span_element.style.color);
    }

{{< output >}}
green
red
{{< /output >}}

From the example above, you could also get to the `numeral-name` elements directly using the following code:

    const numeral_elements = document.getElementsByClassName("numeral-name");

However, the approach of using particular elements' methods to select lower elements on the tree can be extraordinarily helpful in some cases. For instance, if you want to select only the `p` elements from the second `div`:

    const second_div_element = document.getElementById("second-div");
    const p_elements = second_div_element.getElementsByTagName("p");

### How to Access Elements via Query Selectors

Query selectors, as mentioned above, give you more advanced options for selecting elements from the DOM.

They can be accessed via two methods on the `document` object — and they are also inherited on all other element objects:

- `querySelector` fetches one element matching the query string. If multiple elements match, the method only returns the first one.
- `querySelectorAll` fetches an array of elements matching the query string. Even if only one element matches, the result is an array.

Like the methods covered in the section above, these query selector methods let you select elements based on tag, class, and ID. But the query selector syntax additionally lets you combine these components in remarkable ways, and it expands what components you can search based on.

What follows are some key ways in which you can use query selectors to navigate and access elements from the DOM.

- You can look for elements with a specific combination of tag, class, and ID. For instance, to search for a combination of the `div` tag, the `content-div` class, and the `first-div` ID:

        document.querySelectorAll("div.content-div#first-div");

    The query selector syntax uses `.` to precede class names and `#` to precede IDs. It assumes labels without a prefix to be tag names.

- You can look for elements under particular elements, called those elements' descendants. The following example finds `em` elements nested somewhere under any element with the `content-div` class:

        document.querySelectorAll(".content-div em");

- You can look for elements based on associated attributes. Here, the first element with an `href` attribute:

        document.querySelector("[href]");

    Alongside this, you can also specify the tag, class, and/or ID. Expanding the syntax like in the following example even lets you narrow the search to elements where the attribute has a specific value:

        document.querySelector("a[href='https://loremipsum.io/']");

- You can look for elements based on their direct parent elements. The next command fetches all `p` elements that are immediate children of any `div` elements with the `first-div` ID:

        document.querySelectorAll("div#first-div > p");

    This selector is more specific than the descendant selector above. Where the descendant selector `div em` grabs an element from the example page, the child selector `div > em` does not.

    Why is this? The page's `em` element is a direct child of a `p` element — that is, nested immediately under a `p` element — but not a `div` element. It is only a descendant of a `div` element, meaning it is nested somewhere, however deeply, beneath one.

- You can look for elements that do not have a certain matching quality. For instance, the below gets all `p` elements that are not a child of an element with the `first-div` ID:

        document.querySelectorAll("p:not(#first-div > p)")

The above is, in fact, just a selection of some of the most commonly used features of the query selector. You can get more examples of query selector options at the end of this guide.

## Conclusion

This tutorial walked you through what the DOM tree looks like, how to navigate its parts, and how to start accessing them. The links below give you some resources to learn more about navigating the DOM, with more examples and coverage of advanced options and scenarios.

Be sure to look out for more guides from us on the subject. These take your knowledge of the DOM further with in-depth looks at how to modify the DOM and how to handle JavaScript events.
