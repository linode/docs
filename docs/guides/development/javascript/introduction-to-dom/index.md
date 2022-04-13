---
slug: an-introduction-to-the-javascript-dom
author:
  name: Linode Community
  email: docs@linode.com
description: "Learn what the document object model, or DOM, is and how it is represented in JavaScript."
keywords: ['what is the dom','javascript dom tutorial','what is document object model']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-15
modified_by:
  name: Nathaniel Stickman
title: "An Introduction to the JavaScript DOM"
h1_title: "Introduction to the DOM"
enable_h1: true
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[MDN Web Docs: Introduction to the DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)'
- '[MDN Web Docs: Document Object Model (DOM)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)'
---

The Document Object Model (usually called the DOM) represents a web page in a way that lets you access and works with it through JavaScript. The DOM, in fact, is generally what makes modern dynamic, and interactive web pages possible.

This guide aims to give you an overview of what the Document Object Model is and to show you how it works through examples. It introduces you to its main parts and helps you understand how they bring web pages to life.

## Before You Begin

The examples in this guide use a web browser's developer tools to view the DOM and interact with a JavaScript console. You can follow along using your browser:

- On Chrome, refer to Google's [Open Chrome DevTools](https://developer.chrome.com/docs/devtools/open/#elements) documentation.
- On Firefox, refer to Mozilla's [Open the Inspector](https://developer.mozilla.org/en-US/docs/Tools/Page_Inspector/How_to/Open_the_Inspector) documentation.

## What Is the Document Object Model?

The Document Object Model, or DOM, provides a representation of web documents, like web pages. That representation can then be accessed and modified by JavaScript and other programs.

Essentially, the DOM is what allows web pages to become dynamic. Languages like JavaScript work with the nodes that make up the DOM to dynamically and interactively change a web page's presentation.

There are many ways of displaying the DOM, and the most intuitive way is the HTML format. This is how browsers like Chrome and Firefox render the DOM when you open their *Inspect* dashboards on a web page.

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

In the example above, the DOM representation could as easily be a literal HTML source file. However, the DOM itself is not equivalent to a web page's HTML source.

Instead, the DOM is a representation of how the web page is displayed, and particularly how it is displayed currently.

To illustrate how the DOM and HTML source can differ, here is [an HTML file](example-page.html). The file includes JavaScript which adds more elements once the page loads. Later on in this guide, you can learn more about how exactly this kind of JavaScript code is operating.

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

The DOM representation of the HTML source above should resemble the following code (though the script has been left out here to make the result easier to read):

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

The DOM is concerned with the current display of the page, meaning that it reflects any additions, subtractions, or other modifications. This is the part that makes it effective for making web pages dynamic.

## The Document Object Model and JavaScript

Most often, JavaScript is how web developers interact with the DOM. And JavaScript's means of accessing the DOM is the `document` object and the nodes nested under it.

The next sections explain what the `document` object is and the parts that make it up.

To get familiar with JavaScript objects, take a look at our [JavaScript Objects Tutorial](/docs/guides/javascript-objects-tutorial/) guide to learn more or get a refresher before going forward.

### Document Object

To work with the DOM, client-side JavaScript provides the `document` object. This object comes with properties and methods to access and modify the DOM.

You can see some examples of the `document` object in action in the previous section. But below are two additional commands showing more of the object's features.

1. The `document` object's properties tend to provide information or access to nodes (more on those below). But they also allow you to modify characteristics of the DOM as shown below:

        document.body.style.backgroundColor = "blue";

    The web page should get a blue background, with a DOM representation like the following:

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

1. The `document` object has a host of methods, doing everything from providing access to specific set of nodes to adding new nodes to the DOM. Here, the `getElementsByTagName()` method grabs every element using an `<li>` tag. The command loops through those elements, that outputs their `textContent` attributes.

        for (item of document.getElementsByTagName("li")) {
            console.log(item.textContent);
        }

    Using the `for` loop above, the JavaScript console should display the following output:

    {{< output >}}
First item
Second item
{{< /output >}}

### Nodes and Elements

The `document` object contains numerous other objects, all making up the DOM. These objects are called *nodes*. Nodes include everything from HTML elements to attributes to text.

The kind of node you are likely to work with most extensively are *elements*. These are the parts of the DOM corresponding essentially to HTML elements. They allow you to access and manipulate the building blocks of a web page's display.

In the script above where you created the `ul` content, two kinds of nodes were added to the page.

- *Element nodes*, which were created using the `document.createElement` method.
- *Text nodes*, created with the `document.createTextNode` method.

Each part of the `document` object is actually a node of some kind or other. Additionally, each node inherits common properties, like the `appendChild` method, which lets elements add text nodes and the DOM's body adds those elements.

The `document` object does more than just let you extend the DOM. For instance, you can also use it to navigate the DOM and make precise modifications to it.

Below is another script to demonstrate that. You can use this script on the web page created above. Just visit [the page](example-page.html) again, open your browser's JavaScript console, and enter these commands:

    const listItems = document.getElementsByTagName("li");

    for (item of listItems) {
        const newTextNode = document.createTextNode(item.textContent.replace("item", "thing"));

        item.innerHTML = "";
        item.appendChild(newTextNode);
    }

As a result, your DOM should update to resemble the following:

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

With that, you should have a good foundation to start working with the DOM. Be sure to look out for more guides from us on the subject. These take your knowledge of the DOM further on how to navigate the DOM and more advanced coverage of DOM modification.
