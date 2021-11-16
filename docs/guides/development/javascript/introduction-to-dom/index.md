---
slug: introduction-to-dom
author:
  name: Linode Community
  email: docs@linode.com
description: "Learn what the document object model, or DOM, is and how it is represented in JavaScript."
og_description: "Learn what the document object model, or DOM, is and how it is represented in JavaScript."
keywords: ['what is the dom','javascript dom tutorial','what is document object model']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-15
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

The examples in this guide use a web browser's developer tools to view the DOM and interact with a JavaScript console. You can follow along using your browser:

- On Chrome, refer to Google's [Open Chrome DevTools](https://developer.chrome.com/docs/devtools/open/#elements) documentation.
- On Firefox, refer to Mozilla's [Open the Inspector](https://developer.mozilla.org/en-US/docs/Tools/Page_Inspector/How_to/Open_the_Inspector) documentation.

## What Is the Document Object Model?

The Document Object Model, or DOM, provides a representation of web documents, like web pages. That representation can then be accessed and modified by JavaScript and other programs.

Essentially, the DOM is what allows web pages to become dynamic. Languages like JavaScript work with the nodes that make up the DOM to dynamically and interactively change a web page's presentation.

There are many ways of displaying the DOM, but for many the most intuitive is the HTML format. This is how browsers like Chrome and Firefox render the DOM when you open their *Inspect* dashboards on a web page:

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

Instead, the DOM is a representation of how the web page is displayed, and particularly how it is displayed right now.

To illustrate how the DOM and HTML source can differ, here is [an HTML file](example-page.html). The page includes JavaScript which adds more elements once the page loads. Later on in this guide, you can learn more about how exactly this kind of JavaScript code is operating:

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

The DOM representation of this source should resemble the below (though the script has been left out here to make the result easier to read):

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

The DOM is concerned with the current display of the page, meaning that it reflects any additions, subtractions, or other modifications. This is part of what makes it effective for making web pages dynamic.

## The Document Object Model and JavaScript

Most often, JavaScript is the way in which web developers interact with the DOM. And JavaScript's means of accessing the DOM is the `document` object and the nodes nested under it.

The next sections explain what the `document` object is and the parts that make it up.

Not familiar with JavaScript objects? You can take a look at our [JavaScript Objects Tutorial](/doc/guides/javascript-objects-tutorial/) to learn about them or get a refresher before going forward.

### Document Object

To work with the DOM, client-side JavaScript provides the `document` object. This object comes with properties and methods to access and modify the DOM.

You can see some examples of the `document` object in action above. But below are two additional commands showing more of the object's features.

- The `document` object's properties tend to provide information or access to nodes (more on those below). But they also allow you to modify characteristics of the DOM, like this:

        document.body.style.backgroundColor = "blue";

- The `document` object has a host of methods, doing everything from providing access to specific sets of nodes to adding new nodes to the DOM. Here, the `getElementsByTagName` grabs every element using an `<li>` tag. The command loops through those elements, outputting their `textContent` attributes:

        for (item of document.getElementsByTagName("li")) {
            console.log(item.textContent);
        }

After the first command above, the web page should have a blue background, with a DOM representation like the following:

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

And after the second, the JavaScript console should display the following output:

{{< output >}}
First item
Second item
{{< /output >}}

### Nodes and Elements

The `document` object contains numerous other objects, all making up the DOM. These objects are called *nodes*. Nodes includes everything from HTML elements to attributes to text.

The kind of node you are likely to work with most extensively are *elements*. These are the parts of the DOM corresponding essentially to HTML elements. They allow you to access and manipulate the building blocks of a web page's display.

In the script used to create the `ul` content above, two kinds of nodes were added to the page.

- Element nodes, which were created using the `document.createElement` method.
- Text nodes, created with the `document.createTextNode` method.

Each part of the `document` object is actually a node of some kind or other. Additionally, each node inherits common properties, like the `appendChild` method, which above let elements add text nodes and the DOM's body add those elements.

The `document` object does more than just let you extend the DOM. For instance, you can also use it to navigate the DOM and make precise modifications in it.

Below is another script to demonstrate that. You can use this script on the web page created above. Just visit [the page](example-page.html) again, open your browser's JavaScript console, and enter these commands:

    const listItems = document.getElementsByTagName("li");

    for (item of listItems) {
        const newTextNode = document.createTextNode(item.textContent.replace("item", "thing"));

        item.innerHTML = "";
        item.appendChild(newTextNode);
    }

As a result, your DOM should update to resemble this:

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

With that, you should have a good foundation to start working with the DOM. Be sure to look out for more guides from us on the subject. These take your knowledge of the DOM further with in-depth looks at how to navigate the DOM and more advanced coverage of DOM modification.
