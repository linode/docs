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

The Document Object Model (DOM) is a language-agnostic interface to the different components that makeup an HTML document. Quite often, JavaScript is used to access the DOM and generate dynamic and interactive web pages.

This guide provides an overview of the Document Object Model and shows you how it works through a series of examples. You learn about the main parts that make up the DOM and how they help bring a web page to life.

## Before You Begin

The examples in this guide use a web browser's developer tools to view the DOM and interact with a JavaScript console. To get the most out of the information in this guide, follow along in your own Chrome or Firefox browser.

- On Chrome, refer to Google's [Open Chrome DevTools](https://developer.chrome.com/docs/devtools/open/#elements) documentation to learn how to access their developer tools.

- On Firefox, refer to Mozilla's [Open the Inspector](https://developer.mozilla.org/en-US/docs/Tools/Page_Inspector/How_to/Open_the_Inspector) documentation to learn how to access their developer tools.

## What Is the Document Object Model?

The Document Object Model (DOM) is an interface that provides access to an HTML document's structure and content. The DOM represents the elements and content of an HTML document as nodes and objects. The DOM representation can then be accessed and modified by JavaScript and other programming languages.

Essentially, the DOM is what allows web pages to become dynamic. Languages like JavaScript work with the nodes that make up the DOM to dynamically and interactively change a web page's presentation.

There are many ways of displaying the DOM. One of the most widely used ways is the HTML format. When you open your browser's **Inspect** dashboard, you can view the HTML representation of a web page. The example below shows the HTML markup for an extremely simple web page.

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

The DOM itself is not equivalent to a web page's HTML source. Instead, the DOM is a representation of how a web page is displayed in the moment that it is accessed.

To illustrate how the DOM and HTML source can differ, the example below displays an HTML source file is displayed below. The HTML file includes a JavaScript function adds more HTML elements to the page once the page loads. Later on in this guide, you can learn more about how exactly this kind of JavaScript code is operating.

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

Once the HTML page is loaded and the JavaScript runs, the DOM representation of the HTML source above resembles the code displayed below. The JavaScript has been left out to make the resulting HTML easier to read.

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

Since the DOM is concerned with displaying the current state of an HTML page, it now displays the new HTML elements that were added to the page by the JavaScript. The DOM always reflects any additions, subtractions, or other modifications that happen to the web page. This characteristic is what enables the DOM to make web pages dynamic.

## The Document Object Model and JavaScript

Most often, JavaScript is how web developers interact with the DOM. JavaScript's is able to access the DOM with the `document` object and the nodes nested under it.

The next sections explain what the `document` object is and the parts that make it up.

### Document Object

To work with the DOM, client-side JavaScript provides the `document` object. This object includes properties and methods to access and modify the DOM.

The previous section included some examples of the `document` object in action. Below are two additional commands that show more of the `document` object's features.

1. The `document` object's properties provide information or access to nodes. They also allow you to modify characteristics of the DOM as shown in the example below:

        document.body.style.backgroundColor = "blue";

    The example JavaScript, accesses the `document` object's `backgroundColor` property and sets its value to `"blue"`. The web page should now have a blue background. The DOM representation looks as follows:

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

    The color blue is assigned to the `<body>` element using the `style` attribute.

1. The `document` object several methods that do everything from providing access to specific nodes to adding new nodes to the DOM. In the example below, the `getElementsByTagName()` method grabs every HTML element with the tag name, `<li>`. The JavaScript loops through those elements, and then outputs each elements `textContent` attributes.

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

The kind of node you are likely to work with most extensively are *elements*. These are the parts of the DOM corresponding to HTML elements. They allow you to access and manipulate the building blocks of a web page.

The script used in the [How the DOM Differs from HTML Source]() section added a `<ul>` element to the page. This added two kinds of nodes to the page.

- *Element nodes*, which were created using the `document.createElement` method.
- *Text nodes*, created with the `document.createTextNode` method.

Each part of the `document` object is actually a node of some kind or other. Additionally, each node inherits common properties, like the `appendChild` method, which lets elements add text nodes.

The `document` object does more than just let you extend the DOM. For instance, you can also use it to navigate the DOM and make precise modifications to it. The script below demonstrates how these modifications can be made to the DOM. Access the [example-page.html](example-page.html) page in your browser. Then, open your browser's JavaScript console, and enter in the following JavaScript:

    const listItems = document.getElementsByTagName("li");

    for (item of listItems) {
        const newTextNode = document.createTextNode(item.textContent.replace("item", "thing"));

        item.innerHTML = "";
        item.appendChild(newTextNode);
    }

As a result, the DOM is updated and the text `item` contained within the `<li>` tags is updated to `thing`.

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

The DOM provides an interface to an HTML web page. This provides an extremely powerful way to manipulate the HTML elements of a web page using scripting languages, like JavaScript. This guide introduced you to the DOM and demonstrated how JavaScript is used to add, modify, and remove HTML elements from a web page.
