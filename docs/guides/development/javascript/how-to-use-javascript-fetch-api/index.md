---
slug: how-to-use-javascript-fetch-api
title: "How to Use the JavaScript Fetch API"
description: "JavaScript’s fetch API gives you a built-in tool for handling requests and responses in JavaScript. Learn more about fetch and how to start using it in this guide."
authors: ["Nathaniel Stickman"]
contributors: ["Nathaniel Stickman"]
published: 2022-03-16
keywords: ['javascript fetch', 'javascript fetch api', 'javascript fetch example']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[MDN Web Docs: Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)'
- '[DigitalOcean: How To Use the JavaScript Fetch API to Get Data](https://www.digitalocean.com/community/tutorials/how-to-use-the-javascript-fetch-api-to-get-data)'
---

The JavaScript Filter API gives you a convenient and native way to make requests and handle responses for HTTP and other network APIs. It provides a built-in function for making `GET`, `POST`, and other HTTP requests in JavaScript.

This guide explains what the JavaScript Filter API is, what role it plays, and how to start using it.

## Before You Begin

1. If you are not already familiar, get started with the basics of JavaScript through our guide **JavaScript Basics**. Depending on your level of familiarity, you may also want to go further and look at our guide **Javascript Objects Tutorial**.

1. To follow along with the examples in this guide, you can use your browser's JavaScript console:

    - For **Chrome**, refer to Google's [Run JavaScript in the Console](https://developer.chrome.com/docs/devtools/console/javascript/) documentation.

    - For **Firefox**, refer to Mozilla's [Browser Console](https://developer.mozilla.org/en-US/docs/Tools/Browser_Console) documentation.

## What Is the JavaScript Fetch API

JavaScript introduced the Fetch API to handle network requests and responses natively. Previously, developers had managed these requests and responses using `XMLHttpRequest`. However, that method lacked good integration with JavaScript overall. jQuery stepped up, providing an `ajax` function that became a popular substitute.

With the Fetch API, JavaScript enables request and response handling natively, without the need for an external library. This approach also opens up requests and responses to all of the rich features of JavaScript, including promises.

To give you a sense of how the Fetch API works, here is a simple sample. The upcoming sections of this guide go into more detail, with examples explained piece by piece:

``` javascript
const urlToFetchFrom = "https://example.com/";

fetch(urlToFetchFrom)
    .then(response => response.json())
    .then((data) => {
        console.log("Request made, and response received!");
        console.log(data);
    })
    .catch((err) => {
        console.log("Error occurred.");
        console.log(err);
    });
```

The examples in the sections that follow use the HTTP services provided by [httpbin.org](https://httpbin.org/). To follow along, navigate to `httpbin.org` page and open your browser's JavaScript console. The example code uses relative URLs, which allow you to execute the requests directly from the page.

## How to Make Get Requests With the Fetch API

The Fetch API defaults to `GET` requests, making them the most approachable type to start with.

1. All fetch requests start with the `fetch` function, which takes as an argument the URL to request to.

    Here, a fetch request is being made to the `/id` endpoint. This endpoint returns the requester's IP address:

        fetch("/ip")

1. The initial response needs to be parsed for JSON data, which can be done using the `then` method. The `then` method takes the response from the function or method to which it is attached, in this case, `fetch`.

    The `json` method can be applied to the response object to convert the object to a JSON format:

        .then(response => response.json())

1. Another `then` method can be attached to the previous one to start handling the JSON response. This is when you can act on the response data.

    This example reads the `origin` field from the response JSON and prints it in a message on the console log:

        .then((data) => {
            console.log("Successful request made from " + data.origin);
        })

    You could, alternatively, create a variable before calling `fetch`, and then assign the response data to that variable in this `then` method.

1. Using a `catch` method at the end of this chain is good practice. The `catch` method lets you ensure any error encountered during the request or response process gets handled gracefully.

    In this case, the `catch` method prints an alert to the console with the error's information if any error is encountered:

        .catch((err) => {
            console.log("An error occurred: " + err);
        });

The full example is shown below:

``` javascript
fetch("/ip")
    .then(response => response.json())
    .then((data) => {
        console.log("Successful request made from " + data.origin);
    })
    .catch((err) => {
        console.log("An error occurred: " + err);
    });
```

{{< output >}}
192.0.2.0
{{< /output >}}

## How to Make Post Requests with the Fetch API

The Fetch function comes with options for handling `POST`, `PUT`, and other HTTP methods. These options are specified in an object optionally provided as a second argument to the `fetch` function.

This optional object can indicate the request method, headers, and body.

Otherwise, the Fetch API handles similarly for `POST`, `PUT`, and other methods as for the `GET` method seen above.

1. Create an object for your request body. You do not need to do this separately, but doing so can help to keep your code clear.

    This example creates an object with a `test` property holding a string value:

        let reqData = { test: "This is a test." }

1. Start the fetch request with the `fetch` function and the request URL.

    In this example, a `POST` request is being made to the `/post` endpoint. This endpoint simply returns the request object:

        fetch("/post", {

1. Notice that the above includes the start of a second argument, with a curly brace indicating the beginning of an object. Fill out the object with the method, headers, and body for the request.

    Here, `POST` is the method, the headers indicate JSON content and the `reqData` variable is provided as the body:

            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqData)
        })

1. Two consecutive `then` methods get applied. The first converts the request's response to JSON. The second takes that JSON and acts on it.

    This example simply prints the contents of the `test` field from the response's JSON data:

        .then(response => response.json())
        .then((data) => {
            console.log(data.json.test)
        })

1. Having a `catch` method is good practice to ensure that any errors in the request or response get handled gracefully.

    In this case, the `catch` method prints an alert to the console with the error's information if an error is encountered:

        .catch((err) => {
            console.log("An error occurred: " + err);
        });

The full example is shown below:

``` javascript
let reqData = { test: "This is a test." }

fetch("/post", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqData)
    })
    .then(response => response.json())
    .then((data) => {
        console.log(data.json.test)
    })
    .catch((err) => {
        console.log("An error occurred: " + err);
    });
```

{{< output >}}
This is a test.
{{< /output >}}

## Conclusion

You now have the know-how you need to start working with JavaScript's Fetch API. The examples above cover `GET` and `POST` requests, but the techniques used can be applied to any other HTTP request method as well.

Have more questions or want some help getting started? Feel free to reach out to our [Support](https://www.linode.com/support/) team.
