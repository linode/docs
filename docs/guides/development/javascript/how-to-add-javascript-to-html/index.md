---
slug: how-to-add-javascript-to-html
description: "Wondering how to link javascript to HTML? Follow our step-by-step instructions, including examples, plus tips on how to add external javascript files."
keywords: ['how to link javascript to html','link javascript to html','add javascript to html']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-05-05
modified_by:
  name: Linode
title: "Link JavaScript to HTML"
title_meta: "An Essential Guide on How to Add JavaScript to HTML"
authors: ["Nathaniel Stickman"]
---

JavaScript is a scripting language that is widely used to add dynamic functionality to a web page, alongside HTML and CSS. User triggered events, animations, and content updates are among some of the features on a web page that are powered by JavaScript. In order to use JavaScript on an HTML web page, you must use the `<script>` tag to either write your JavaScript code directly in your HTML markup or to link to an external JavaScript file. This guide shows you how to use the `<script>` tag to link JavaScript to an HTML page. You also learn about `<script>` tag attributes that help you optimize your web page's loading time.

## Link JavaScript to HTML: The \<script\> Tag

The `<script>` tag is used to add JavaScript to an HTML web page. The following sections further explain how the `<script>` tag behaves when added to HTML markup and the different ways you can use it to add JavaScript to a web page.

### What is a \<script\> Tag?

The `<script>` tag can be used to embed JavaScript into a web page in the following two ways:

- Writing JavaScript code directly within an opening and closing `<script>` tags.
- Referencing the path to a JavaScript file using the `<script>` tag's `src` attribute.

In both cases, when the HTML page loads, the web browser executes any JavaScript that it finds, in sequential order. There are two useful principles to keep in mind when using the `<script>` tag:

- The JavaScript contained within or referenced by `<script>` tags is executed immediately when its portion of the page loads. So, a `<script>` tag placed within a page's `<head>` tag executes before the HTML body. A `<script>` tag placed just before the end of the closing `</body>` tag, on the other hand, executes after everything else on the page has loaded and rendered.

- The JavaScript used in your HTML markup defines functions and variables in the global scope. This means that if your web page has two `<script>` tags — say, one at the beginning and one at the end — they can reference the same functions and variables.

    Keep in mind that the code still follows the ordering described in the point above. For that reason, a script at the beginning of a web page cannot reference a variable assigned in a script at the end of the web page.

### How to Add JavaScript to HTML

You can add JavaScript to your HTML markup by embedding JavaScript code between opening and closing `<script>` tags. For example, to add an alert box to an HTML page with a message that reads `The script is working`, add the following code to your HTML markup:

    <script>
        alert("The script is working!");
    </script>

This example adds the JavaScript code directly to the HTML markup.

The next example demonstrates the `<script>` tag contained within the body of an HTML page. As the browser sequentially executes the HTML, when it encounters the `<script>` tag, it executes the JavaScript within the tag. The JavaScript adds an event listener to the button with `id="exampleButton"`. If a user clicks on the button, an alert box presents the message passed as an argument to the `alert()` method.

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

In the example, the `<script>` tag is placed **after** the `<button>` tag. This is necessary because the JavaScript references the `button` element. If the JavaScript had been inserted any earlier, the button element would not yet have been created by the time the JavaScript executes.

## Adding External JavaScript Files

As your JavaScript code gets more complicated, you are likely to prefer keeping it in an external JS file, rather than including the script directly in your HTML markup.

To include an external JavaScript file in HTML, you still use the `<script>` tag. However, instead of adding JavaScript directly between the `<script>` tags, you use the tag's `src` attribute to point to an external JS file. The steps below give you a simple example that references an external JavaScript file HTML markup.

The steps below assume that you are developing a simple website on your local computer. Your site files are stored in a directory named `example-site`.

1.  In your `example-site` directory, add a new subdirectory named `js_files`. This directory stores any JavaScript files that are referenced by HTML files.

        mkdir js_files

1. Using your preferred text editor, add a new file named `example.js` to the `js_files` directory with the JavaScript displayed below.

    {{< file "~/username/js_files/example.js" js >}}
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

1. Create an HTML file with the example markup. The markup uses the `<script>` tag to reference the JavaScript file created in the previous step.

    {{< file "~/username/example.html" html >}}
<!doctype html>
<html lang="en">
  <head>
    <title>Example Web Page with JavaScript</title>
  </head>
  <body>
    <script src="js_files/example.js"></script>
  </body>
</html>
    {{< /file >}}

    The `src` attribute uses the relative path to the `example.js` file that contains the JavaScript code you want to execute.

1. Visit the HTML page in a browser by entering the following address: `file:///home/username/example-site/example.html`. Click on the button and observe that it produces an alert dialog.

    You can also see the result by [viewing our included `example.html` file](example.html).

### Defining \<script\> Tag Attributes

Like all other HTML tags, the `<script>` tag supports a series of attributes that you can use to further control the behavior of the JavaScript that is executed on a web page. The list below contains some of the most useful attributes.

- The `async` attribute tells the browser to download the referenced JavaScript file as the web page is parsed. Once the file has downloaded, its contents are immediately executed.

- The `defer` attribute tells the browser to download a JavaScript file as the web page is parsed. The file is only executed once the entire web page has loaded.

- The `type` attribute is used to identify the kind of script that is referenced by the `src` attribute. However, since JavaScript has become the unambiguous standard, this attribute is rarely necessary anymore.

- The `charset` attribute lets you define a different character set for an external JavaScript file. This attribute, though common to see, is [considered deprecated](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#attr-charset) since documents now must use UTF-8.

The sections below dive deeper into the two most useful `<script>` tag attributes, `async` and `defer`. These sections discuss how these attributes can be used to improve a web page's performance.

#### Async

Normally, when a browser encounters the `<script>` tag with a linked JavaScript file, it stops loading the HTML in order to start downloading the referenced JavaScript file. Using the `async` attribute, it is possible to improve your web page's performance by having the browser download the JavaScript file in the background while the page continues to load.

The example file's script tag makes use of the `async` attribute.

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

It's not always advisable to use the `async` attribute. For instance, if your script depends on certain elements not yet being rendered, or if the elements themselves depend on the script creating certain elements, `async` would likely be a problematic choice. When such cases are not a concern, `async` can help with your page's load speed and user experience.

#### Defer

Like `async`, using `defer` tells the browser to download a linked JavaScript file in the background while the page continues to load. Unlike `async`, however, `defer` prevents the loaded script from being executed until the page has been fully rendered. This makes `defer` especially useful when your JavaScript code relies on one or more elements being rendered and available. Because `defer` ensures that the script only runs once the page has been loaded completely, you can be assured that the script does not run until all required elements are present on the page.

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

This guide covered the foundational information you need to start using JavaScript on your HTML pages. Whether you plan to embed a script or link a JavaScript file in your HTML, this guide outlined the steps needed to do so.

As a next step, you may be interested in looking at some of our other JavaScript tutorials. For instance, take a look at our [Traversing the Document Object Model with JavaScript](/docs/guides/traversing-the-dom/) tutorial, our [How to Modify the DOM with JavaScript](/docs/guides/javascript-dom-manipulation/) tutorial, and our [JavaScript Objects](/docs/guides/javascript-objects-tutorial/) tutorial.


