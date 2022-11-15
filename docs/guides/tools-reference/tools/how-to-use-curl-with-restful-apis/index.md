---
slug: curl-for-rest-api
author:
  name: Jeff Novotny
description: 'cURL is a data transfer application used to interact with APIs. This guide discusses using RESTful verbs, inspecting headers, and adding authorization to requests.'
keywords: ['cURL API','Test API using curl','Curl for rest API','Curl restful api']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-07-01
modified_by:
  name: Linode
title: "Using cURL with RESTful APIs"
h1_title: "How to Use cURL with RESTful APIs"
enable_h1: true
contributor:
  name: Jeff Novotny
external_resources:
- '[Wikipedia curl page](https://en.wikipedia.org/wiki/CURL)'
- '[curl website](https://curl.se/)'
- '[curl documentation](https://curl.se/docs/)'
- '[curl GitHub page](https://github.com/curl/curl)'
- '[GitHub REST API](https://docs.github.com/en/rest)'
---

In web programming, developers often have to interact with online databases. Many of these services provide a [*Representational State Transfer* (REST) API](https://en.wikipedia.org/wiki/Representational_state_transfer) that allows authorized users to read and write data. Fortunately, the [cURL](https://curl.se) application allows users to easily access REST APIs from the command line. This guide discusses how to use cURL to interrogate RESTful APIs. It also explains how `curl`, the command-line utility, uses RESTful verbs, and how to inspect headers and add authorization to requests.

## An Introduction to Using cURL with RESTful APIs

### What is cURL?

cURL stands for "Client URL" and is a data transfer application. It consists of two components, the `libcurl` client-side library and the `curl` command-line tool. cURL was originally designed to allow Linux IRC users to automate common tasks. However, it is now available for most operating systems and behaves similarly across platforms.

{{< note >}}
cURL is the complete data transfer application, including the library, while `curl` is the command-line utility. The two terms are often used interchangeably. This guide mainly discusses the `curl` utility, which transmits commands directly to a remote REST API.
{{< /note >}}

`curl` uses the `libcurl` library and a simple URL-based syntax to transmit and receive data. It can be used as a stand-alone command line application, or inside scripts or web applications. The `curl` utility is common in embedded applications for vehicles, routers, printers, and audio-visual equipment. It is also used to access REST APIs and to test new APIs.

The cURL application is:

- free and open source.
- portable across operating systems.
- contains APIs or bindings for over 50 programming languages, including C/C++, Java, and Python.
- thread safe.

It also supports:
- most transfer protocols and web technologies, including HTTP, FTP, SFTP, and SCP.
- Ipv6 and dual-stack requests.
- APIs or bindings for over 50 programming languages, including C/C++, Java, and Python.

### What is REST?

REST is an architecture consisting of best practices and patterns for web development. It is a set of guidelines for developers rather than a true protocol. Websites and applications are considered *RESTful* if they follow REST principles. REST is now the industry-standard model for client-server interactions on the web, and most popular web services are only accessible through REST interfaces. The most important REST guidelines are as follows:

- **Client-server Architecture**: Clients and servers are loosely coupled and communicate via an API.
- **Statelessness**: Requests are independent and do not rely on the current state of the transaction.
- **Caches**: Caches are used for better performance and increased security.
- **Layering**: Additional features, such as security protocols, can be added to REST as a separate layer. For example, the user can be authenticated and then the request can be passed to another layer for processing.
- **Uniform interfaces**: Clients use well-known URIs to request information. They must identify the specific resource to access and the format to use. The services are not customizable, so clients must use the official generic interface.

REST principles are straightforward. Clients use a *Uniform Resource Identifier* (URI) to request information from a server. Inside the message, which is typically sent using HTTP, the client identifies the resources it wants. It can also specify a format for the reply. The server replies with the requested data, in *JavaScript Object Notation* (JSON), HTML, or XML. A REST request includes the following components:

- An HTTP method indicating the requested operation, such as `GET` or `PUT`.
- A header, including the media type the sender wants to receive. Some examples are `text/css` and `image/gif`.
- The URI to the resource, including any optional parameters. A client can specify the URI using the formats `example.com/products/137` or `example.com/products/:id`.

The REST architecture is an industry standard because it offers many advantages. Some of its advantages are as follows:

- It is scalable, fast, robust, and efficient. REST APIs do not use much bandwidth.
- It is easy to understand and implement.
- It promotes modular architecture and good design.
- Clients and servers are fully decoupled. It is easier to make changes to the API or the internal design and is more secure.
- It allows many different message formats.

However, REST cannot process any requests based on the state of the transaction. It also does not guarantee reliability or include any security features. Client applications must implement these features.

### What are RESTful Verbs?

REST interfaces allow for a fixed set of interactions. Taken together, these operations are known as the *RESTful verbs* or *REST verbs*. Each RESTful verb indicates an action on the client-side application.

Each distinct operation is associated with a specific RESTFul verb and a range of possible status codes. A client like `curl` must include a RESTful verb inside the HTTP header for each request. The RESTful verbs correspond to the main *create, read, update, and delete* (CRUD) database operations.

Here are the main RESTful verbs that allow `curl` to use a REST API:

- **POST**: This RESTful verb creates a new resource on the server. If successful, the `POST` action returns code `201` for "Created" and provides a link to the new reference. Failure codes include `404` for "Not Found", or a `409` conflict error if the item already exists.
- **GET**: `GET` is used to retrieve information from the server. It can read an entire list or one specific item, and returns code `200` for "OK" if successful. If the item or collection cannot be found, the server returns code `404`.
- **PUT**: The `PUT` REST verb is used to update a specific item. The client must specify all attributes for the item. This method returns the status code `200` when the item is updated. The server returns either `404` for "Not Found" or `405` for "Method Not Allowed" if the update fails.
- **PATCH**: This REST verb is similar to `PUT`. It modifies the item, but only contains the new changes, not the entire item. However, this verb is not considered safe from collisions. It is not recommended and is not used very much.
- **DELETE**: The `DELETE` RESTful verb deletes an entry from the database, although it can also potentially delete the entire collection. It returns code `200` when successful, and code `404` or `405` otherwise.
- **OPTIONS**: This verb fetches a list of all available operations.

For almost all APIs, the `POST`, `PUT`, `PATCH`, and `DELETE` operations require server authentication. However, many servers allow anonymous `GET` operations for public data. If the server cannot authorize a user, it returns the failure code `401` for "Unauthorized". Failure code `403`, or "Forbidden", is used if the client is not allowed to access the resource.

### Installing curl

As of 2022, the most recent release of `curl` is version 7.83.0. `curl` usually comes pre-installed on Ubuntu and other Linux distributions. To see if `curl` is already installed, run the `curl` command with the `-V` flag for "version". The local installation might not match the latest edition, but any recent release should be adequate.

    curl -V

{{< output >}}
curl 7.68.0 (x86_64-pc-linux-gnu) libcurl/7.68.0 OpenSSL/1.1.1f zlib/1.2.11 brotli/1.0.9 libidn2/2.3.0 libpsl/0.21.0 (+libidn2/2.2.0) libssh/0.9.3/openssl/zlib nghttp2/1.40.0 librtmp/2.3
Release-Date: 2020-01-08
Protocols: dict file ftp ftps gopher http https imap imaps ldap ldaps pop3 pop3s rtmp rtsp scp sftp smb smbs smtp smtps telnet tftp
Features: AsynchDNS brotli GSS-API HTTP2 HTTPS-proxy IDN IPv6 Kerberos Largefile libz NTLM NTLM_WB PSL SPNEGO SSL TLS-SRP UnixSockets
{{< /output >}}

If necessary, `curl`  can be installed using `apt install`. Ensure the system is updated first.

    sudo apt install curl

Documentation for `curl` can be found on the [curl website](https://curl.se/docs/). The source code can be found on the [curl GitHub page](https://github.com/curl/curl).

### Command Line Options for curl

To use curl from the command line, type `curl` and the URL to access.

    curl example.com

By default, `curl` displays its output in the terminal window. However, the `-o` option redirects the output to a file.

    curl -o source.html example.com

`curl` includes a wide range of options. To see a list of all options, use the `--help` option.

    curl --help

Some of the most important options/flags are as follows:

- **-B**: Use ASCII for text and transfer.
- **-C**: Resume an interrupted transfer.
- **-d**: Data for the HTTP `POST` or `PUT` commands.
- **-E**: Use a client certificate file and optional password.
- **-F**: Update a HTTP form request from a file.
- **-H**: Pass a custom header to the server.
- **-K**: Use a file for the configuration.
- **-m**: Set a maximum time for the transfer.
- **-N**: Disable buffering.
- **-o**: Write the output to a file.
- **-s**: Run in silent mode.
- **-u**: Add a user name and password for the server.
- **-v**: Verbose mode, for more details.
- **-X**: Specifies the HTTP command to use.
- **-4**: Use Ipv4 addresses.
- **-6**: Use Ipv6 addresses.
- **-#**: Display a progress bar. This is useful for large transfers.

### cURL vs wget

The `wget` utility is a simpler alternative to `curl`. `wget` is a command-line only utility, while the full cURL application includes the `libcurl` library. This makes it capable of more complicated tasks.

Some of the similarities and differences between `curl` and `wget` are as follows:

- Both utilities can be used from the command line.
- They can both use FTP and HTTP and support proxies and cookies.
- Both `curl` and `wget` are free and open source utilities.
- Both run on a large number of operating systems and are completely portable.
- Both can transmit HTTP `POST` and `GET` requests.
- `wget` can be used recursively while `curl` cannot.
- `wget` can automatically recover from a broken transfer. `curl` must be restarted.
- `curl` includes the powerful `libcurl` API.
- `curl` supports more protocols, SSL libraries, and HTTP authentication methods.
- `curl` is bidirectional and can do transfers in parallel.
- `curl` supports many more security measures, different releases of HTTP, and dual stack IPv4/Ipv6 transfers.

Either utility is fine for most simple HTTP requests and downloads. If you are familiar with only one of the tools and it is suitable for your requirements, continue to use it. However, `wget` is only a simple transfer utility. `curl` is a better all-purpose tool for heavy duty and professional use. See our guide [How to Use wget](/docs/guides/how-to-use-wget/) to learn more about this pared-down alternative to curl.

## cURL Methods

`curl` uses several HTTP commands to connect to remote REST APIs. These actions correspond to the different REST verbs. The syntax for RESTful requests is simple and straightforward and is similar to other `curl` requests. For thorough documentation on how to use `curl`, see the official [curl documentation](https://curl.se/docs/).

To determine the URIs to use for each operation, consult the API documentation provided for the tool or service. As an example, the official [GitHub REST API](https://docs.github.com/en/rest) explains how to use the interface. When designing a REST interface, it is easy to test the API using `curl`.

{{< note >}}
The following examples use `example.com` in the instructions. Substitute `example.com` with your own URI.
{{< /note >}}

### GET

The `GET` operation allows `curl` to receive information from a REST API. To use the `GET` RESTful verb, use the `curl` command followed by the name of the resource to access. The `-X` attribute and the name of the operation are not required because `GET` is the default HTTP operation.

The output varies based on the server. It includes a `status`, which is set to `success` if the request is valid, the `data`, and an optional `message`. In this case, the client does not specify a format for the data, so the server responds using JSON. To see more information about the transfer, including the server options, append the `-v` (verbose) option to the command.

    curl https://example.com/api/2/employees

{{< output >}}
{"status":"success","data":[{"id":1,"name":"Tom","age":60,"image":""},
...
{"id":40,"name":"Linda","age":50,"image":""}],"message":"All records retrieved."}
{{< /output >}}

To see one particular entry, append the `id` of the entry to retrieve. In this example, only the information for employee `10` is returned from the server. The output is again in JSON format.

    curl https://example.com/api/2/employees/10

{{< output >}}
{"status":"success","data":{"id":10,"name":"Julia","age":33,"image":""},"message":"Record retrieved."}
{{< /output >}}

### POST

The `POST` verb allows users to push data to a REST API and add new entries to the remote database. The data is specified as an argument for the `-d` option. The data should be in a format matching the request. In this case, the `-H` option informs the server the data is in `application/json` format. If a format is not specified, `curl` adds `Content-Type: application/x-www-form-urlencoded` to the HTTP header. This might cause problems on some servers.

The server returns the new record, including the `id` of the new entry. The following command adds a new record to the application server.

{{< note >}}
The `curl` command infers this is a `POST` operation based on the other details. But it is considered good practice to explicitly state the verb as part of the `-X` option.
{{< /note >}}

    curl -d '{"name":"Jamie","age":"23","image":""}' -H 'Content-Type: application/json' -X POST https://example.com/api/2/create

{{< output >}}
{"status":"success","data":{"name":"Jamie","age":"23","image":null,"id":5126},"message":"Record added."}
{{< /output >}}

This approach is fine for small amounts of data. To add multiple records, pass a file containing the information to the server. The filename can be indicated with a `@` symbol followed by the file name, as follows:

    curl -d @data.json -H 'Content-Type: application/json' -X POST https://example.com/api/2/create

### PUT

The RESTful verb `PUT` modifies an existing entry. This option works similarly to the `POST` option. The `-d` flag specifies the updated information for the record, and `-H` indicates the data format. However, the `id` of the record to update must be included as part of the URI. For a `PUT` command, the `-X` option must include the keyword.

    curl -d '{"name":"Jamie","age":"23","image":""}' -H 'Content-Type: application/json' -X PUT  https://example.com/api/2/update/31

{{< output >}}
{"status":"success","data":{"name":"Jamie","age":"23","image":null},"message":"Record updated."}
{{< /output >}}

### DELETE

The `DELETE` operation removes a record from the database. It is one of the simpler REST verbs to use. As part of the `-X` option, include the `DELETE` verb and append the `id` of the record to delete to the URI. The data and header flags are not required for this operation.

    curl -X DELETE https://example.com/api/2/delete/31

{{< output >}}
{"status":"success","data":"31","message":"Record deleted"}
{{< /output >}}

## Viewing and Changing Headers with cURL

In normal usage, `curl` only displays the most relevant information, not the entire HTTP request and response. To view all information, including the HTTP headers, add the `-v` option to any curl command to activate verbose mode.

    curl -v example.com

{{< output >}}
* TCP_NODELAY set
* Connected to example.com (2606:2800:220:1:248:1893:25c8:1946) port 80 (#0)
> GET / HTTP/1.1
> Host: example.com
> User-Agent: curl/7.68.0
> Accept: */*
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< Age: 409433
< Cache-Control: max-age=604800
< Content-Type: text/html; charset=UTF-8
< Date: Tue, 03 May 2022 16:40:30 GMT
< Etag: "3147526947+ident"
< Expires: Tue, 10 May 2022 16:40:30 GMT
< Last-Modified: Thu, 17 Oct 2019 07:18:26 GMT
< Server: ECS (bsa/EB20)
< Vary: Accept-Encoding
< X-Cache: HIT
{{< /output >}}

Any outgoing HTTP header in `curl` can be modified using the `-H` option. Some of the previous examples already demonstrated how to use this flag when setting the `content-type`. However, `-H` also allows users to modify any field in the header. The following example demonstrates how to turn off the `user-agent` field in the header. When the header is reviewed in verbose mode, the field is no longer present.

    curl -H "User-Agent:" http://example.com -v

{{< output >}}
*   Trying 2606:2800:220:1:248:1893:25c8:1946:80...
* TCP_NODELAY set
* Connected to example.com (2606:2800:220:1:248:1893:25c8:1946) port 80 (#0)
> GET / HTTP/1.1
> Host: example.com
> Accept: */*
{{< /output >}}

## Authorization and Passwords with cURL

Many REST APIs require the user to authenticate using a valid user name and password. The easiest way to provide this information is through the `-u` option of the `curl` command. Include the account name and password, separated by a `:`. The following example executes the `GET` RESTful verb using authentication.

    curl -u user:password https://example.com/api/2/employee/10

## Conclusion

Although it is best known as a data transfer application, the cURL application can interact with REST APIs. It includes the `curl` command line utility and the fully-featured `libcurl` library. REST is a popular architecture for client-server applications. It decouples the two components and stresses modularity and efficiency. Information is exchanged through well-known URIs.

Users can access REST APIs using the RESTful verbs, which correspond to the basic HTTP actions. `curl` can send all common HTTP commands to a REST API including `GET`, `POST`, `PUT`, and `DELETE`. The `curl` utility is straightforward to use. It has a few main options for data transmission, user authentication, and making header changes. For more information about curl, see the [curl documentation](https://curl.se/docs/).