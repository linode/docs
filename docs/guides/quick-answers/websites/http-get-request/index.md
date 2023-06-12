---
slug: http-get-request
title: "Understanding HTTP Requests: Structure, Methods & Examples"
title_meta: "Guide to HTTP: GET Requests, POST Requests & More"
description: 'The HTTP GET Request is one of many request methods. Read our guide to learn about HTTP request structures and how to send HTTP requests in Java. ✓ Click here!'
keywords: ['http get request','example http request','http request example','http request format','http request response','http request line','http request headers list','make http request','how to send http request in java','http request structure']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Tom Henderson"]
published: 2023-06-12
modified_by:
  name: Linode
external_resources:
- '[MDN Web Docs: HTTP Messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages)'
- '[IBM Documentation: HTTP requests](https://www.ibm.com/docs/en/cics-ts/5.3?topic=protocol-http-requests)'
- '[W3Schools: HTTP Request Methods](https://www.w3schools.com/tags/ref_httpmethods.asp)'
---

HTTP requests are messages that are sent to servers that understand HTTP syntax. An HTTP request uses a sentence-like structure, allowing the application making the request in the HTTP client to ask, answer, and acknowledge information.

HTTP server messages are structured in a similar way and can have different types of responses to a given HTTP Request.

## What are HTTP requests?

HTTP requests are messages formatted in the HTTP protocol that are sent from a client to a server that is capable of to responding to them. The messages are formatted using standardized HTTP protocol syntax. Each request initiates an action on the target server, which gives a response as an answer.

In HTTP1.1, requests are formed in ASCII, while HTTP/2 uses binary. Servers that only understand HTTP1.1 may bounce or ignore requests sent in HTTP/2. Meanwhile, HTTP/2 servers are backward-compatible and understand HTTP1.1 requests by default.

HTTP requests can be formed by software, APIs, or libraries within an application (e.g. web browsers and email clients). They target a specific server with a URL/URI. Different HTTP requests produce different server reactions and HTTP responses.

The syntax of an HTTP request is a rather sentence-like structure. A noun (data values expressed in the message header, options chosen, and body message values) is coupled with a verb (the HTTP request method used, such as GET or POST) to form the complete message.

The format of an HTTP request is qualified by a header. It contains an HTTP request method, a target URL/URI, and a target server endpoint path. Optional components of an HTTP request include a body, header, a query string, and the HTTP Protocol Version (HTTP1.1, or HTTP/2).

HTTP GET and POST are the two most commonly used HTTP methods to exchange information between a client and a server. Other methods include PUT, PATCH, DELETE, CONNECT, and TRACE.

## What Is a HTTP GET Request?

An HTTP GET request (`http_get_request`) is a message from a client, typically a web browser, to a server using HTTP1.1 or HTTP/2. The server responds to the request with information based on the URL/URI specified in the HTTP request. These messages between clients and servers are formatted according to the [standards defined in the HTTP protocol](https://developer.mozilla.org/en-US/docs/Web/HTTP/Resources_and_specifications). The request and corresponding response are called a *transaction*, and both follow a similar structure.

The first part of an HTTP request is the header, and the first single line of the header is known as the request-line. It specifies the HTTP request method (e.g. `GET`), the path to resource (e.g. `/index.html`), and the HTTP version (e.g. `HTTP/1.1`). Additional, optional header lines provide other data or options. HTTP GET requests must be no longer than 2048 characters.

The next part of the HTTP GET request is a blank line that separates header meta-information from any further data made in the request.

Data past the blank line is called the *body*. The body can be a document, a form, or other message. A server responding to an HTTP GET request ignores the body. Instead, it parses an HTTP POST request body and considers data and method located in the body.

When the target server receives an HTTP request message, it parses the method specified, and sends a response message in a similar way. The response includes a header with meta-information and a body, which can contain a message, web page, stream of data, or other content. The HTTP GET request is a read-only request and doesn’t alter the target server.

## What Is An HTTP POST Request?

An HTTP POST Request is formed by an application, usually a web browser. The HTTP Post request (`http_post_request`) method informs the server to add, delete, or otherwise alter the state of data on the target server. The difference between GET and POST is that the state of the server is not changed with a GET, which is a read-only request. The POST request sends data to the target server in the body portion of the message. While GET is a read-only request, as its message body is ignored, the data in the POST message body performs an action that changes the server.

The HTTP Request message interaction between client and server is a series of exchanges involving data and meta-information. The response header information characterizes the body information, which is sent to the client application.

## HTTP Request Examples

Here's a simple HTTP GET request example:

```
GET /home/user/example.txt HTTP/1.1
```

This example opens the file `/home/user/example.txt` via the HTTP 1.1 protocol and displays its contents as a result.

The next example adds more details. Note that there is no body sent. Although an HTTP GET request can have a body, most servers ignore it and respond with information from the URI/URL requested:

```
GET /docs/tutorials/linux/shellscripts/howto.html HTTP/1.1
Host: Linode.com
User-Agent: Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.8) Gecko/20091102 Firefox/3.5.5
Accept: text/html,application/xhtml+xml,
Accept-Language: en-us
Accept-Encoding: gzip,deflate
Accept-Charset: ISO-8859-1,utf-8
Cache-Control: no-cache
```

Here's a breakdown:

-   The `GET` requests the filename `/docs/tutorials/linux/shellscripts/howto.html`.

       {{< note >}}
This file does not actually exist from the host `linode.com`.
       {{< /note >}}

-   The `Accept` specification tells the target server what the client accepts. Here, `text` is accepted in `HTML`, while the `application` accepts `xhtml` and `xml`.

-   `Accept-Language` is set to `en-us` (US English).

-   The accepted character sets (`Accept-Charset`) are `ISO 8859–1` and `utf-8`.

-   The final line tells the server not to assume there is cache control (`Cache-Control`) on the client.

All GET Requests require ASCII characters to be used in the formation of the entire request. In contrast, the body of a POST request can be in ASCII or in a binary format.

## HTTP POST Request Examples

The header of the HTTP POST request (`http_post_request`) has a header and body (which can be ASCII or binary in an HTTP/2 request). It is formed in a similar way to an HTTP GET request. However, the body of a POST request is read and processed by the target server.

An HTTP POST (or the less commonly used PUT) request has a similar header to the HTTP GET Request, specifying the method POST. HTTP POST and HTTP PUT are identical in use, except PUT tells the target server to read the body of the request as an object.

In this example, the values to be handled by the target server are specified in the message body:

```
POST /home/user/datafile HTTP/1.1
From: user@linode33
User-Agent: Mytools/0.8.0
Content-Type: application/json
Content-Length: 32

{
    [Json-formatted data pairs]
}
```

Here, the file `/home/user/datafile` is shown using the `HTTP/1.1` protocol from `user@linode33` using version `0.8.0` of a program called `MyTools`. This application sends json formatted data with a content length of 32 characters.

## HTTP Request States

Either the client or the server may exchange messages using any HTTP request method. The choice of method affects the *state* between the client and server. GET requests do not alter the server's state, while POST, DELETE, and PUT can.

The three possible states are *safe*, *idempotent*, and *cacheable*.

-   A safe method request doesn’t change the state of the target server, similar to a read-only request.

-   An idempotent method request alters the state of the target server, usually by storing, deleting, or moving data.

    {{< note >}}
All safe server states are also idempotent. According to the HTTP specifications: *"A request method is considered idempotent if the intended effect on the server of multiple identical requests with that method is the same as the effect for a single such request. Of the request methods defined by this specification, [PUT](https://httpwg.org/specs/rfc9110.html#PUT), [DELETE](https://httpwg.org/specs/rfc9110.html#DELETE), and safe request methods are idempotent."* The concept is important when communications failures might occur, and a retry produces a different server response. Only the server can be idempotent.
{{< /note >}}

-   The cacheable state means that the client can retain session-related data until a change in the client’s state requires refreshing cache data. The client stores this data, rather than making new requests each time to the server, until the server determines that such cached data has expired, or is no longer valid for the session. However, not all responses can be [practically or meaningfully cached](https://developer.mozilla.org/en-US/docs/Glossary/cacheable).

## Summary

The two most commonly used HTTP request methods are GET and POST. Either method has a header with options and a message body that is sent to a target server. In a GET request, the target server sends only the URL/URI requested, and some information can be cached by the client. In contrast, a POST or PUT reads the message body. In a POST request, the server parses the data values in the message body, while PUT receives this data as an object.

Additional HTTP request methods exist, although they are seldom-used. These methods work across most web browsers and servers, but the HTTP protocol does not require their use. For more information on these methods, see the [Mozilla Developer Network Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Resources_and_specifications).