---
slug: introduction-to-dom
author:
  name: Linode Community
  email: docs@linode.com
description: "Learn what the document object model, or DOM, is and how it is represented in JavaScript."
og_description: "Learn what the document object model, or DOM, is and how it is represented in JavaScript."
keywords: ['what is the dom','javascript dom tutorial','what is document object model']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-14
modified_by:
  name: Nathaniel Stickman
title: "Introduction to the DOM"
h1_title: "Introduction to the DOM"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[MDN Web Docs: Introduction to the DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)'
- '[MDN Web Docs: Document Object Model (DOM)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)'
---

The Document Object Model (usually called the DOM) represents a web page in a way that lets you access and work with it through JavaScript. The DOM, in fact, is generally what makes modern dynamic and interactive web pages possible.

This tutorial aims to give you an overview to what the Document Object Model is and to show you how it works through examples. It introduces you to its main parts and helps you understand how they bring web pages to life.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On Debian and Ubuntu, you can do this with:

            sudo apt update && sudo apt upgrade

    - On AlmaLinux, CentOS (8 or later), or Fedora, use:

            sudo dnf upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## What Is the Document Object Model?

The Document Object Model, or DOM, provides a representation of web documents, like web pages. That representation can then be accessed and modified by JavaScript and other programs.

Essentially, the DOM is what allows web pages to become dynamic. Languages like JavaScript work with the nodes and objects in the DOM to dynamically and interactively change a web page's presentation.

There are many ways of displaying the DOM, but perhaps the most intuitive is the HTML format. This is how browsers like Chrome and Firefox render the DOM when you open their *Inspect* dashboards on a web page:

    <!DOCTYPE html>
    <html>
      <head>
        <title>Example Page</title>
      </head>
      <body>
        <p>Example page content.</p>
      </body>
    </html>

### How the DOM Differs from HTML Source

In the example above, the DOM could be a literal HTML source file. However, the DOM is not equivalent to the HTML source of a web page.

Instead, the DOM is a representation of how the web page is displayed, and particularly how it is displayed right now.

To illustrate how the DOM and HTML source can differ, here is an HTML file with some JavaScript to create an additional element. Later on in this guide, you can learn more about how exactly this kind of JavaScript code is operating:

{{< file "example-page.html" html >}}
<!DOCTYPE html>
<html>
  <head>
    <title>Example Page</title>
    <script>
        function addExampleList() {
            const exampleList = document.createElement("ul");

            const exampleListItem1 = document.createElement("li");
            const exampleListItem1Text = document.createTextNode("First item");
            exampleListItem1.appendChild(exampleListItem1Text);

            const exampleListItem2 = document.createElement("li");
            const exampleListItem2Text = document.createTextNode("second item");
            exampleListItem2.appendChild(exampleListItem2Text);

            exampleList.appendChild(exampleListItem1);
            exampleList.appendChild(exampleListItem2);

            document.body.appendChild(exampleList);
        }
    </script>
  </head>
  <body onload="addExampleList();">
    <p>Example page content.</p>
  </body>
</html>
{{< /file >}}

The DOM representation of this source may resemble the below, though here we left out the script code for readability's sake:

    <!DOCTYPE html>
    <html>
        <head>
            <title>Example Page</title>
            <script>[...]</script>
        </head>
        <body onload="addExampleList();">
            <p>Example page content.</p>
            <ul>
                <li>First item</li>
                <li>Second item</li>
            </ul>
        </body>
    </html>

The DOM is concerned with the current display of the page, meaning that it reflects any additions, subtractions, or other modifications. This is part of what makes it effective for adding a dynamic component to web pages.

## The Document Object Model and JavaScript

Most often, JavaScript is the way in which web developers interact with the DOM. In JavaScript, the main way of accessing the DOM is through the `document` object and the nodes and elements nested under it.

The next sections explain what the `document` object is and the parts that make it up.

Not familiar with JavaScript objects? Take a look at our [JavaScript Objects Tutorial](/doc/guides/javascript-objects-tutorial/) on what they are and how to work with them.

### Document Object

To work with the DOM, client-side JavaScript provides the `document` object. This object provides properties and methods to access and modify the DOM.

You can see several examples of the `document` object in action above. But also below you can see two commands giving additional ways you could use the `document` object on that DOM representation:

    document.body.style.backgroundColor = "blue";
    for (item of document.getElementsByTagName("li")) { console.log(item.textContent); }

After this, the web page has a DOM representation like the following — again, with the script skipped for readability:

    <!DOCTYPE html>
    <html>
        <head>
            <title>Example Page</title>
            <script>[...]</script>
        </head>
        <body onload="addExampleList();" style="background-color: blue;">
            <p>Example page content.</p>
            <ul>
                <li>First item</li>
                <li>second item</li>
            </ul>
        </body>
    </html>

And the JavaScript console logs:

    First item
    Second item

### Nodes and Elements

The `document` object contains numerous other objects, all making up the DOM. These objects are called *nodes*. Nodes includes everything from HTML elements to attributes and text.

Most often, the main kind of nodes you work with are *elements*. These correspond to HTML elements, allowing you to access and manipulate the building blocks of a web page.

In the script above, two kinds of nodes were used. First, an element node was created, using the `document.createElement` method. Then, a text node was created with `document.createTextNode`, with the text then being added to the element.

Here is another script you can use on the web page above. Just visit [that page](example-page.html), open your browser's JavaScript console, and enter these commands:

    const listItems = document.getElementsByTagName("li");

    for (item of listItems) {
        const newTextNode = document.createTextNode(item.textContent.replace("item", "thing"));

        item.innerHTML = "";
        item.appendChild(newTextNode);
    }

As a result, your DOM should update to resemble this, with the script hidden here again for easier reading:

    <!DOCTYPE html>
    <html>
        <head>
            <title>Example Page</title>
            <script>[...]</script>
          </head>
          <body onload="addExampleList();">
            <p>Example page content.</p>
            <ul>
                <li>First thing</li>
                <li>Second thing</li>
            </ul>
        </body>
    </html>

## Conclusion

With that, you should have a good foundation to start working with the DOM. When you are ready to do that, be sure to look out for our other upcoming guides on the subject. These provide in-depth coverage of how to navigate and work with the DOM.
