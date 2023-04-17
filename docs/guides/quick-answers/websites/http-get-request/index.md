---
slug: http-get-request
title: "Understanding HTTP Requests: Structure, Methods & Examples"
title_meta: "Guide to HTTP: GET Requests, POST Requests & More"
description: 'The HTTP GET Request is one of many request methods. Read our guide to learn about HTTP request structures and how to send HTTP requests in Java. ✓ Click here!'
keywords: ['http get request','example http request','http request example','http request format','http request response','http request line','http request headers list','make http request','how to send http request in java','http request structure']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Tom Henderson"]
published: 2023-04-17
modified_by:
  name: Linode
external_resources:
- '[MDN Web Docs: HTTP Messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages)'
- '[IBM Documentation: HTTP requests](https://www.ibm.com/docs/en/cics-ts/5.3?topic=protocol-http-requests)'
- '[W3Schools: HTTP Request Methods](https://www.w3schools.com/tags/ref_httpmethods.asp)'
---

HTTP Requests are the messages made to servers that understand HTTP syntax. The HTTP Request type uses a sentence-like structure to ask, answer, and acknowledge for the application making the request in the HTTP Client.

HTTP server messages are formed in a similar way, and can have varying types of responses to a given HTTP Request.

## What are HTTP requests?

HTTP requests are messages formatted in the HTTP protocol from a client to a server poised to respond to them. The messages are formatted using standardized HTTP protocol syntax. Each request initiates an action on the target server, which gives a response as an answer.

The HTTP request is formed from ASCII in HTTP1.1, and is a binary request in HTTP/2. Servers that only understand the older HTTP1.1 may bounce or otherwise ignore Requests sent in HTTP2. Meanwhile, HTTP/2 servers are backward-compatible and understand HTTP1.1 requests by default.

HTTP Requests can be formed by software, APIs, or libraries within an application (e.g web browsers and email clients), and target a specific server with a URL/URI. The server responds to the message. Different HTTP Requests produce different server states/reactions and HTTP Responses to the requests.

The syntax of an HTTP request is a rather sentence-like structure. A noun (data values expressed in the message header, options chosen, and body message values) is coupled with a verb (the HTTP Get request method) to form the complete message that is sent to the target server.

The format of an HTTP Request is routed and qualified by a header. It contains an HTTP method, a target URL/URI, and a target server endpoint path, which may be appended to the target URL/URI. An HTTP Request can optionally have a body, header, a query string, and/or specify the HTTP Protocol Version (HTTP1.1, or HTTP/2).

HTTP GET and POST are the two most commonly used *methods* to exchange information between a client and a server. Other rare methods include PUT, PATCH, DELETE, CONNECT, and TRACE.

## What Is a HTTP Get Request?

An HTTP GET request (`http_get_request`) is a formatted message from a client to a server using the HTTP1.1 or HTTP/2 protocols. The client making the request is often, but is not required to be, a web browser. The server responds to the `http_get_request` in a number of ways that does not change the state of the server. This read-only request summons information based on how the server responds in its format, from the URL/URI the HTTP Request message specifies.

HTTP Get Requests are sent to a target server that understands HTTP messaging, and conversations between client and server are formatted according to [HTTP standards](https://developer.mozilla.org/en-US/docs/Web/HTTP/Resources_and_specifications). The protocol defines the request format, and the server replies in a formatted response to the request. The Request and response are called a *transaction*.

Both HTTP Requests and HTTP responses have a similar structure. The first two lines of the HTTP Request specify the method, and all meta-information (options) are sent. The first component of the HTTP request is describes the requests to be performed, or a status code indicating success or failure. The start-line must be formed as the first, single line in the request, no matter the method used. The start-line must be no longer than 2048 characters if it’s an HTTP Get Request.

After the start-line, an optional set of HTTP headers specifies a request or other data or options. The third part of the HTTP GET request is a blank line. The blank line separates the meta-information from any further data made in the Request. The data past the meta-information blank line is called the body.

Fourth and finally, the body can be a document, a form, or other message. A server responding to an HTTP GET Request ignores the body. Instead, it parses an HTTP POST Request body and considers data and method located in the body.

When the target server receives a message, the server parses the method requested, and responds with a message in a similar way. The Response includes meta-information (method and options) and a body, which can contain a message, web page, stream of data, or other content. The HTTP GET Request is a "read-only" request and doesn’t alter the target server.

## What Is An HTTP POST Request?

An HTTP POST Request is formed by an application, usually a web browser. The HTTP Post Request (`http_post_request`) method informs the server to add, delete, or otherwise alter the state of data on the target server. The difference between GET and POST is that the state of the server is not changed with a GET, which is a read-only request. The POST request sends data to the target server in the Body portion of the message. While GET is a read-only request, as its message Body is ignored, the data in the POST message body performs an action that changes the server.

The HTTP Request message interaction between client and server is a series of exchanges involving data and meta-information. The response header information characterizes the body information, which is sent to the client application.

## HTTP Request Examples

This simple HTTP Get Request example requests a file:

```
GET /home/user/example.txt HTTP/1.1
```

This example opens the file `/home/user/example.txt` via the HTTP 1.1 protocol. The contents of the file `/home/user/example.txt` are displayed as a result of the request.

The next example adds more details. Note that there is no body sent. Although an HTTP Get Request can have a body sent, most all servers ignore the body and respond with information from the URI/URL requested:

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

The `GET` requests the filename `/docs/tutorials/linux/shellscripts/howto.html`. Note that this file does not actually exist from the host `linode.com`. The `*/*` means `Accept` any application/filetype result.

The `Accept` specification tells the target server what the client accepts. Here, `text` is accepted in `HTML`, while the `application` accepts `xhtml` and `xml`. The `Accept-Language` is set to `en-us` (US English), and the accepted character sets (`Accept-Charset`) are `ISO 8859–1` and `utf-8`. The final line tells the server not to assume there is cache control (`Cache-Control`) on the client. All GET Requests require ASCII characters to be used in the formation of the entire request. The body of a POST request can be in ASCII or in a binary format.

## HTTP POST Request Examples

The header of the HTTP POST Request (`http_post_request`) has a header and body (which can be ASCII or binary in an HTTP/2 request). It is formed in a similar way to the `http_get_request`. However, the body of the Request is read and considered by the application logic of the target server where the request has been sent. HTTP POST and HTTP PUT are identical in use, except PUT tells the target server to read the body of the Request as an object.

An HTTP POST (or the less commonly used PUT) request has a similar header to the HTTP GET Request, specifying the method POST. in this example, values to be POSTed/handled/considered by the target server are specified in the message body:

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

The file `/home/user/datafile` is POSTed using `HTTP/1.1` protocol from `user@linode33` using version 0.8.0 of a program called MyTools. This application sends json formatted data, whose content length is 32 characters.

## HTTP Request States

Either client or server may exchange messages by using any method. The choice of method produces a state between the client and server. GET doesn’t change the server, while POST, DELETE, and PUT can alter the states.

The three possible states are *safe*, *idempotent*, and *cacheable*.

-   A safe method request doesn’t change the target server. It’s similar to a read-only request.

-   An idempotent method request alters the state of the server, usually by storing, deleting, or moving data on the server.

    {{< note >}}
All safe server states are also idempotent. The HTTP specifications say, *"A request method is considered idempotent if the intended effect on the server of multiple identical requests with that method is the same as the effect for a single such request. Of the request methods defined by this specification, [PUT](https://httpwg.org/specs/rfc9110.html#PUT), [DELETE](https://httpwg.org/specs/rfc9110.html#DELETE), and safe request methods are idempotent."* The concept is important when communications failures might exist, and the retry produces a different server response. Only the server can be idempotent.
{{< /note >}}

-   The cacheable state means that the client can retail data that is session-related until a change in the client’s state requires refreshing what may be bad cache. The client stores this data, rather than making new requests each time to the server, until the server determines that such cached data is "dirty cache" or has expired, or is no longer valid for the session. Not all responses can be [practically or meaningfully cached](https://developer.mozilla.org/en-US/docs/Glossary/cacheable).

## Summary

The HTTP Request methods most commonly used are GET and POST. Either method has a header with options, and a message body, sent to a target server. The target server sends only the URL/URI requested in a GET, and certain information can be cached by the client. A POST or PUT reads the message body. POST parses the values expressed in the data of the body, while PUT receives the data as an object.

[There are additional, if seldom-used, HTTP Request Methods possible](https://developer.mozilla.org/en-US/docs/Web/HTTP/Resources_and_specifications) that work across most web browsers and servers. However, neither is required to be used in the HTTP protocol.