---
slug: how-to-link-javascript-to-html
author:
  name: Linode Community
  email: docs@linode.com
description: "Wondering how to link javascript to HTML? ✓ Follow our step-by-step instructions, including examples, plus tips on how to add external javascript files."
og_description: "Wondering how to link javascript to HTML? ✓ Follow our step-by-step instructions, including examples, plus tips on how to add external javascript files."
keywords: ['how to link javascript to html','link javascript to html','add javascript to html']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-01-14
modified_by:
  name: Nathaniel Stickman
title: "An Essential Guide on How to Add JavaScript to HTML"
h1_title: "How to Link JavaScript to HTML"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[W3 Schools: JavaScript Where To](https://www.w3schools.com/js/js_whereto.asp)'
- '[Stack Overflow: How Do I Link a JavaScript File to a HTML File?](https://stackoverflow.com/questions/13739568/how-do-i-link-a-javascript-file-to-a-html-file)'
- '[Quackit: How to Link JavaScript to HTML](https://www.quackit.com/html/howto/how_to_link_javascript_to_html.cfm)'
- '[PageDart: How to Link JavaScript to HTML](https://pagedart.com/blog/how-to-link-javascript-to-html/)'
---

JavaScript lets you make your web pages more than static displays. With JavaScript, web pages become dynamic, able to respond to users and interact with the broader web.

So, how do you link JavaScript to HTML to start making your web pages lively? This tutorial shows you, explaining the `<script>` tag and how to use it for adding JavaScript to HTML pages.

## Link JavaScript to Html: The \<Script\> Tag

The `<script>` tag is the fundamental element for adding JavaScript to HTML. Here, you can follow along for a breakdown of what this tag's role is and how it links JavaScript to HTML pages.

### What is a \<Script\> Tag?

The `<script>` tag embeds JavaScript in HTML markup. When the page loads, the browser executes any JavaScript code fenced in or referenced by `<script>` tags.

There are two useful principles to keep in mind when using the `<script>` tag:

- Scripts are executed immediately when their portion of the page loads. So, a `<script>` tag placed in a page's `<head>` area executes before the HTML body. A `<script>` tag placed just before the end of the `<body>` area, on the other hand, executes after everything else on the page has loaded and rendered.

- Scripts define functions and variables in the global scope. This means that if your web page has two `<script>` tags — say, one at the beginning and one at the end — they can reference the same functions and variables.

    Keep in mind that the code still follows the ordering described in the point above. For that reason, a script at the beginning of a web page cannot reference a variable assigned in a script at the ending of the web page.

### How to Add JavaScript to HTML

You can add embedded JavaScript to HTML by wrapping the JavaScript in `<script>` tags within the HTML document.

At its simplest, you can use the `<script>` tag like this:

    <script>
        alert("The script is working!");
    </script>

This next example demonstrates the tag more fully, showing it in a basic HTML page. When the page loads, the browser executes the JavaScript in the tag, creating an event for when the user click the button:

{{< file "example.html" html >}}
<!doctype html>
<html lang="en">
  <head>
    <title>Example Web Page with JavaScript</title>
  </head>
  <body>
    <button id="exampleButton">Click Me!</button>
    <script>
        exampleButtonElement = document.getElementById("exampleButton");
        exampleButtonElement.addEventListener("onclick", () => {
            alert("The button has been clicked!");
        }
    </script>
  </body>
</html>
{{< /file >}}

Here, the `<script>` tag is placed after the `<button>` tag. This is necessary because the JavaScript references the `button` element. If the script had been inserted any earlier, the button element would not have been created by the time the script would have executed.

## Adding External JavaScript Files

As your JavaScript code gets more complicated, you are likely to prefer keeping it in an external JS file, rather than including the script directly in your HTML markup.

To include an external JavaScript file in HTML, you still use the `<script>` tag. Instead of adding content to the tag, you use the tag's `src` attribute to point to an external JS file.

1. Create a JavaScript file, and add your JavaScript code to it. This example stores the file in a `js_files` subdirectory:

    {{< file "js_files/example.js" js >}}
// Create a button element.
const buttonElement = document.createElement("button");
const buttonElementText = document.createTextNode("Click Me!");
buttonElement.appendChild(buttonElementText);

// Add a 'click' event to that button element.
buttonElement.addEventListener("click", () => {
    alert("The button has been clicked!");
});

// Insert the button element into the body of the web page.
document.body.appendChild(buttonElement);
    {{< /file >}}

1. Create an HTML document. Use the `<script>` tag in the HTML to include the JavaScript file created above:

    {{< file "example.html" html >}}
<!doctype html>
<html lang="en">
  <head>
    <title>Example Web Page with JavaScript</title>
  </head>
  <body>
    <script src="js_files/main.js"></script>
  </body>
</html>
    {{< /file >}}

1. Visit the HTML page in a browser, and observe that the button displays and that clicking it produces an alert dialog.

    You can also see the result by navigating [here](example.html).

### Defining the Basic Attributes

As seen above with `src`, the `<script>` tag has attributes that allow you to further control its behavior.

Below, you can see definitions of the most useful and common of these.

- The `async` attribute tells the browser to load a JavaScript file (linked via the `src` attribute) in the background.

- The `defer` attribute similarly tells the browser to load a linked JavaScript file in the background. But this attribute additionally ensures that the JavaScript code is only executed after the page has completely loaded.

- The `type` attribute is used to identify the kind of script. However, since JavaScript has become the unambiguous standard, this attribute is rarely necessary any more.

- The `charset` attribute lets you define a different character set for an external JavaScript file. This attribute, though common to see, is actually now [considered deprecated](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#attr-charset) since documents now must use UTF-8.

The next sections go into more detail on the two most useful attributes shown above, `async` and `defer`. These sections introduce you to how these attributes can be used to improve your web page's performance.

#### Async

Normally, the browser stops loading a page to download a linked JavaScript file when it runs up against a `<script>` tag. But, using the `async` attribute, it is possible to improve your web page's performance by having the browser download the JavaScript file in the background while the page continues to load.

{{< file "index.html" html >}}
<!doctype html>
<html lang="en">
  <head>
    <title>Example Web Page with JavaScript</title>
  </head>
  <body>
    <script src="js_files/main.js" async></script>
  </body>
</html>
{{< /file >}}

Doing so is not feasible in all use cases. For instance, if you script depends on certain elements not yet being rendered, or if the elements themselves depend on the script creating certain elements or functions, `async` would likely be a problematic choice.

But when such cases are not a concern, `async` can help with your page's load speed and your users' experience.

#### Defer

Like `async`, using `defer` tells the browser to download a linked JavaScript file in the background while the page continues to load.

Unlike `async`, however, `defer` prevents the loaded script from being executed until the page has been fully rendered.

This makes `defer` especially useful when your JavaScript code relies on one or more elements being rendered and available. Because `defer` ensures that the script only runs once the page has been loaded completely, you can be assured that the script does not run until the page is prepared for it.

{{< file "index.html" html >}}
<!doctype html>
<html lang="en">
  <head>
    <title>Example Web Page with JavaScript</title>
  </head>
  <body>
    <script src="js_files/main.js" defer></script>
  </body>
</html>
{{< /file >}}

## Conclusion

With this, you have what you need to start using JavaScript on your HTML pages. Whether you plan to embed a script or link a JavaScript file in your HTML, this guide has outlined the tools to do so.

You may also, as a next step, be interested in looking at some of our other JavaScript and web-page tutorials. For instance, take a look at our **JavaScript Objects Tutorial**, our **Introduction to the DOM**, or our **JavaScript Events: A Tutorial**.

Want to know more about adding JavaScript to HTML pages? Feel free to reach out to our [Support](https://www.linode.com/support/) team.
