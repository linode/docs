---
slug: document-object-model
description: "The DOM gives scripting languages, like JavaScript, access to an HTML document''s structure and content. This guide discusses accessing the DOM with JavaScript."
keywords: ['what is the dom','javascript dom tutorial','what is document object model']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-04-15
modified_by:
  name: Nathaniel Stickman
title: "An Introduction to the Document Object Model (DOM)"
title_meta: "Accessing the Document Object Model with JavaScript"
external_resources:
- '[MDN Web Docs: Introduction to the DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)'
- '[MDN Web Docs: Document Object Model (DOM)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)'
authors: ["Nathaniel Stickman"]
---

The Document Object Model (DOM) is a language-agnostic interface that provides access to an HTML document's structure and content. JavaScript is often the language used to access the DOM in order to generate dynamic and interactive web pages.

This guide provides an overview of the Document Object Model and shows you how to interact with it using a series of JavaScript examples.

## Before You Begin

The examples in this guide use a web browser's developer tools to view the DOM and interact with a JavaScript console. To get the most out of the information in this guide, follow along in your own Chrome or Firefox browser.

- On Chrome, refer to Google's [Open Chrome DevTools](https://developer.chrome.com/docs/devtools/open/#elements) documentation to learn how to access their developer tools.

- On Firefox, refer to Mozilla's [Open the Inspector](https://developer.mozilla.org/en-US/docs/Tools/Page_Inspector/How_to/Open_the_Inspector) documentation to learn how to access their developer tools.

## What Is the Document Object Model?

The Document Object Model (DOM) is an interface that provides access to an HTML document's structure and content. The DOM represents the elements and content of an HTML document as nodes and objects. The DOM representation can then be accessed and modified by JavaScript and other scripting languages.

Essentially, the DOM is what allows web pages to become dynamic. Languages like JavaScript work with the nodes that make up the DOM to dynamically and interactively change a web page's presentation.

There are many ways of displaying the DOM. One of the most widely used ways is the HTML format. When you open your browser's **Inspect dashboard**, you can view the HTML representation of a web page. The example below shows the HTML markup for a simple web page.

    <!DOCTYPE html>
    <html>
      <head>
        <title>Example Page</title>
      </head>
      <body>
        <p>Example page content.</p>
      </body>
    </html>

### How the DOM Differs from HTML Source Code

The DOM itself is not equivalent to a web page's HTML source code. Instead, the DOM is a representation of how a web page is displayed in the moment that it is accessed.

To illustrate how the DOM and HTML source code can differ, the example below displays an HTML source file. The HTML file includes a JavaScript function that adds additional HTML elements to the page once the page loads.

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

Once the HTML page is loaded and the JavaScript runs, the DOM representation of the HTML source above resembles the code displayed below. The JavaScript has been left out to make the resulting HTML easier to read. The HTML now includes an unordered list (`<ul>...</ul>`) with two list items (`<li>...</li>`).

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

Since the DOM is concerned with displaying the current state of an HTML page, it now displays the new HTML elements that were added to the page by the JavaScript. The DOM always reflects any additions, subtractions, or other modifications that happen to a web page. This characteristic is what enables the DOM to make web pages dynamic.

## The Document Object Model and JavaScript

Most often, JavaScript is how web developers interact with the DOM. JavaScript is able to access the DOM with the `document` object and the nodes nested under it.

The next sections explain what the `document` object is and the parts that make it up.

### Document Object

To work with the DOM, client-side JavaScript provides the `document` object. This object includes properties and methods to access and modify the DOM.

The previous section included some examples of the `document` object in action. Below are two additional commands that show more of the `document` object's features.

1.  The `document` object's properties provide information about the HTML document or access to its nested nodes. They also allow you to modify characteristics of the DOM as shown in the example below:

        document.body.style.backgroundColor = "blue";

    The example JavaScript accesses the `document` object's `backgroundColor` property and sets its value to `"blue"`. The web page it modifies should now have a blue background. The DOM representation of the change looks as follows:

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

1.  The `document` object has several methods that do everything from provide access to specific nodes to add new nodes to the DOM. In the example below, the `getElementsByTagName()` method grabs every HTML element with the tag name, `<li>`. The JavaScript loops through those elements, and then outputs each elements `textContent` attributes.

        for (item of document.getElementsByTagName("li")) {
            console.log(item.textContent);
        }

    Using the `for` loop above, the JavaScript console should display the following output:

    {{< output >}}
First item
Second item
{{< /output >}}

### Nodes and Elements

The `document` object contains numerous other objects that all make up the DOM. These objects are called *nodes*. Nodes include everything from HTML elements, to attributes, to text.

You are likely to work most frequently with *element* nodes. DOM element nodes correspond to a web page's HTML elements. They allow you to access and manipulate the building blocks of a web page.

The script used in the [How the DOM Differs from HTML Source](/docs/guides/document-object-model/#how-the-dom-differs-from-html-source-code) section added a `<ul>` element and `<li>` elements to the page. This added the following two kinds of nodes to the page:

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

As a result, the DOM is updated and the text, `item`, contained within the `<li>` tags is updated to `thing`.

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

See our guide [Traversing the Document Object Model with JavaScript](/docs/guides/traversing-the-dom), to learn about other built-in document object methods.

## Conclusion

The DOM provides an interface to an HTML web page. This enables you to manipulate the structure and content of a web page using scripting languages, like JavaScript. This guide introduced you to the DOM and demonstrated how JavaScript is used to add, modify, and remove HTML elements from a web page.
