---
slug: java-web-server
description: 'In Java, web servers are minimal HTTP static file servers storing web content. ✓ Learn the basics of Java HTTP servers and how to make a server in Java.'
keywords: ['java web server', 'java http server', 'how to make a server in java', 'getting started with java', 'java web hosting', 'java web server tutorial', 'java side projects', 'server side programming java', 'java api server', 'server for java']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-01-05
modified_by:
  name: Linode
title_meta: "The Developer’s Guide to Java: Web Servers"
title: "How to Make a Server in Java in 5 Easy Steps"
external_resources:
- '[DZone: A Simple HTTP Server in Java](https://dzone.com/articles/simple-http-server-in-java)'
authors: ["John Mueller"]
---

Everyone likes the idea of reducing their workload when possible, yet the need to perform basic functionality arises almost constantly. Often, developers end up doing a lot of work for what seems like little return, especially when it comes to basic web design. You don’t need a full-fledged web server to perform quick checks for things like connectivity or to ensure basic functionality. This is where Java 18’s newfound web functionality comes into play. Java 18 sets up and configures a basic Java web server you can use for simple tasks. It only takes a matter of minutes, rather than hours, and it’s a pretty straightforward process. This guide demonstrates how to work with Java 18’s web functionality to create a server in Java. It also covers how to use the `jwebserver` command line tool.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Getting Started with Java 18 (and above)

Java 18 and above have much to offer in the way of web functionality. The following sections provide an overview of Java 18 web functionality used for Java web hosting at the developer level. A detailed look at the `jwebserver` command line tool is also provided.

### A Quick Overview of Java 18

Java 18 has new functionality that makes it easier to create, test, debug, and simulate a Java API server, among other things. Java 18 also includes features like a vector API, previews pattern matching for switch expressions, and UTF-8 as the default character set. There are many advances in server-side programming when working with Java 18. In fact, there are [nine major new features](https://www.oracle.com/java/technologies/javase/18-relnote-issues.html#NewFeature) that you need to know about as a developer to create a better server:

-   It deprecates `Finalizer` for removal in a future release to reduce security, performance, reliability, and maintainability issues.
-   It defines Stateful Packet Inspection (SPI) for Internet address resolution to better enable [Project Loom](https://www.baeldung.com/openjdk-project-loom), concurrency, new programming models, network protocols, customization, and testing.
-   It provides a preview of pattern matching for `switch` expressions and statements (something that was originally previewed in Java 17, but enhanced in this release).
-   It reimplements `lang.reflect.Method`, `Constructor`, and `Field` on top of `java.lang.invoke` method handles.
-   It offers an out-of-the-box static Java HTTP file server with easy setup and minimal functionality.
-   It formalizes a second iteration of the foreign function and memory API, which allows Java program interoperation with code and data outside the Java runtime.
-   It creates a method to express vector computations that compile at runtime using the vector API originally introduced in Java 16 and updated in Java 17.
-   It uses UTF-8 (the web’s standard charset) to make web server data encoding easier and reduce the potential for applications behaving incorrectly when they use a different default charset.
-   It introduces the `@snippet` tag for JavaDoc’s Standard Doclet to simplify the inclusion of sample code in the API documentation.

### Understanding the Java 18 Features for Web Development

`jwebserver` reproduces the developer-grade web servers provided in languages like Python, Ruby, PHP, and Erlang. This is a basic web server, and the documentation tells you a lot about its limitations. On the upside, not stated in the documentation is that the simplicity of the web server doesn’t affect the operating systems or its features. It’s entirely possible to perform various setups and configurations that normally require a lot of time using the operating system and third party tools. Think of this server as something to use in a simulation, for demonstration purposes, or for tasks such as simulating an API. For example, a development team can use this web server to share files or create documentation.

### Considering jwebserver Limitations

The web server included with Java 18 provides a simple activation server that developers can use to serve static files. These files must all appear in a single directory, but this isn’t a problem for the web server’s intended purpose. As described in JEP408, the purpose is to develop a minimal web server that a developer can interact with using an API that allows customization. The `jwebserver` doesn’t replace commercial-grade web servers, such as Jetty, Netty, and Grizzly. Nor production-grade web servers, such as Apache Tomcat, Apache httpd, and NGINX. It does provide a functional option that allows developers to avoid installing and configuring full-fledged web servers just so they can get to work. The web server itself doesn’t provide security features, such as authentication, access control, or encryption. The idea here is to save time developing a full-fledged server. This allows the developer to perform testing, debugging, and development without a lot of effort.

## How to Make a Server in Java

These steps walk you through the process of installing Java 18, accessing the `jwebserver` command line utility, and performing specific tasks using `jwebserver` and its associated components. It extends these basic principles to perform tasks like providing Java web hosting and performing server-side programming in Java, with less fuss than ever.

### Step 1: Install Java 18

These steps show how to install the Oracle Java Development Kit (JDK) 18 on an Ubuntu 22.04 LTS system. They also work with other versions of Linux.

1.  Update the package list:

    ```command
    sudo apt -y update
    ```

    The output displays the number of packages that can be upgraded.

1.  If there are packages to upgrade, do so:

    ```commandd
    sudo apt -y upgrade
    ```

    The host system automatically upgrades and tells you about the need to reboot, if warranted.

1.  Install the `openjdk` package:

    ```command
    sudo apt install -y openjdk-18-jdk
    ```

1.  Confirm the installation by checking the Java version:

    ```command
    java -version
    ```

    Your system should now be running Java 18.

1.  Now check the `jwebserver` version:

    ```command
    jwebserver -version
    ```

    The output shows the version of `jwebserver` you’re running, which should be `18.0.2-ea` or above to work with the examples in this guide.

### Step 2: Use the Java 18 Web Server

It’s entirely possible to perform some configuration of the `jwebserver` using command line options. The following command line switches let you start `jwebserver` with the settings needed for testing, debugging, demonstration, simulation, and other needs:

-   **-h**, **-?**, or **--help**: Displays a help message, then exits.
-   **-b addr** or **--bind-address addr**: Defines the address that `jwebserver` binds to so you can control the address used for access. The default setting is `127.0.0.1`. If you want to use the `jwebserver` for all interfaces, use the `-b 0.0.0.0` or `-b ::` switch option.
-   **-d dir** or **--directory dir**: Determines the directory that `jwebserver` uses for serving static files. The default is to use the current directory.
-   **-o level** or **--output level**: Sets the amount of information you see at the command line as `jwebserver` serves files. The allowed settings are `none`, `info`, and `verbose`, with the default setting being `info`.
-   **-p port** or **--port port**: Determines the port used to access `jwebserver`, with the default setting being `8000`.
-   **-version** or **--version**: Displays version information for the copy of `jwebserver` being used.

### Step 3: Create a Simple Web Page

The `jwebserver` capabilities are limited to static files over HTTP/1.1 so you can’t create anything complex or dynamic. The idea is to keep things simple. Here is what happens with various kinds of content, in order of precedence:

-   If there is an index file and you specify a directory, the index file, such as index.html, is served.
-   When a specific file is requested, then that specific file is served.
-   If a specific file is requested and it doesn’t exist, then a File Not Found error appears.
-   When a directory is requested and it doesn’t contain an index file, a listing of the directory appears.

With these requirements in mind, you can create content like this and `jwebserver` presents it without any problems.

```file{title="web/index.html" lang="html"}
<!DOCTYPE html>

<html>
    <head>
        <title>
            My Web Page
        </title>
    </head>

    <body>
        <h1>Greeting</h1>
        <p>Hello World!</p>
    </body>
</html>
```

As you make requests of `jwebserver`, the console screen displays the requests and their result code. If the resource exists, you see the location of the resource within the host directory and a result code of 200. Requesting non-existent resources displays a 404 result code. The server supports only `HEAD` and `GET` request methods. Anything else displays an error message. Consequently, [the amount of damage a hacker can do is a lot more limited](https://www.hackingarticles.in/multiple-ways-to-detect-http-options/), but not eliminated entirely. For example, a hacker can’t use a `POST` request method, but can theoretically use a [smuggling attack](https://portswigger.net/web-security/request-smuggling/exploiting).

### Step 4: Verify Web Page Access

The default `jwebserver` configuration assumes that you’re working from the host system, so use a loopback address of `http://127.0.0.1:8000/` when using the default settings. This assumption has limitations, one of which is that you can’t access the web server outside of the local host. When working with a Linode or other cloud setup, you need the external address of the host system.

Configure the web server for this external address. This way you can access it on your workstation to perform tasks such as simulations, demonstrations, and peer collaboration. Start `jwebserver` in the directory that contains your web data. To access the page you created in the previous section, you need to specify the `-b <IP Address of Your Linode>` option. Otherwise, you need to add the `-d dir` option as well. This comes with the danger of anyone accessing your `jwebserver` unless you add some security. You can partially overcome this issue by ensuring that you use an uncommon port by adding the `-p port` option for web server access.

### Step 5: Perform Ad Hoc Coding

Using the `jwebserver` command line tool is helpful when you have static content and want to perform tasks such as simulations, demonstrations, and collaborations. However, the Java 18 web server functionality wouldn’t be very helpful to developers if it did not perform tasks such as testing code. This is where the API (separate from `jwebserver`) comes into play. It lets you work with the new Java 18 classes `SimpleFileServer`, `HttpHandlers`, and `Request`. These classes allow you to programmatically build onto the simple functionality that `jwebserver` provides using your custom code. This new API replaces the cumbersome `com.sun.net.httpserver` API that is used in most of the examples you see online. In short, you spend less time playing with web server code and more time working with your custom application code.

The easiest way to walk through some code to see how Java 18 works is to use the `jshell` utility. Put the following code together to see how a web server works from a coded perspective. Paste these lines of code in `jshell`, adjust `IP Address of Your Linode` and `Absolute Path to Data`, then press **Enter**.

```command
import com.sun.net.httpserver.*;
var addr = new InetSocketAddress("IP Address of Your Linode", 8000);
var path = Path.of("Absolute Path to Data");
var server = SimpleFileServer.createFileServer(addr, path, SimpleFileServer.OutputLevel.VERBOSE);
server.start();
```

At this point, you can access your server using your browser as usual. There are some important things to note about this code. First, there are no defaults, so you must provide all three of the items displayed in the example. Second, as when using `jwebserver`, you need to provide the IP address of your cloud-based server as part of creating the `addr` variable. Third, the path variable must be absolute, so you have to provide the username (or root) along with the directory containing the data. For example, when working with the `example-user` and a `web` data folder in that user's home directory, the path needs to point to `“/home/example-user/web”`. Otherwise, the `createFileServer()` call outputs errors.

When you issue `server.start()` the web server is ready to go. The output displays the same information as when using `jwebserver`. The difference is that you can programmatically perform a number of additional tasks, such as [adding a file handler](https://docs.oracle.com/en/java/javase/18/docs/api/jdk.httpserver/com/sun/net/httpserver/SimpleFileServer.html#createFileHandler(java.nio.file.Path)) and [providing an output filter](https://docs.oracle.com/en/java/javase/18/docs/api/jdk.httpserver/com/sun/net/httpserver/SimpleFileServer.html#createOutputFilter(java.io.OutputStream,com.sun.net.httpserver.SimpleFileServer.OutputLevel)). To stop your server you issue the `server.stop(seconds)` call with `seconds` specifying the amount of time to wait before stopping the server.

## Keeping Your Setup Safe

The Java 18 web server functionality doesn’t come with any built-in security features. You won’t be able to authenticate users, encrypt data, or perform other security-related tasks as part of the web server. Such functionality must be built into the additions you provide through the API. However, you can still add a certain level of security using the functionality that the platform provides. The following sections show you two ways of accomplishing this goal, but there are likely other strategies you can employ for your particular situation.

### Working with the Firewall

The most basic way to secure your web server is to configure the [UFW (Uncomplicated Firewall)](https://ubuntu.com/server/docs/security-firewall) to manage requests. Begin by ensuring that your web server is configured to use a non-traditional port. Then set UFW to disallow the conventional ports and allow the port of your choosing. When configuring the firewall, set it up to allow access only from select IP addresses using particular protocols. This approach, while not completely perfect, greatly increases the work required to find your web server, much less do anything nefarious with it. Afterward you must enable the firewall, because it’s inactive by default.

### Configuring a Secure Environment

Some of the techniques you use for other security needs also work with the Java 18 web server. For example, you can use [`chmod`](https://www.computerhope.com/unix/uchmod.htm) to ensure no one can do anything with the files in the host directory other than read them. To do this, set up groups that have access to the directory and its files. Next, ensure that anyone who fits into the other category has zero access. Unlike a firewall, this approach requires a means to authenticate the user at the platform level before allowing access to the web server. However, to do this you’d need to add custom code using the API to make the process possible. Unfortunately, this starts to take the simple web services outside the realm of simple.

## Conclusion

You now know how to install, configure, and work with the web server functionality included with Java 18. Remember this web server isn’t designed to function as a production- or commercial-quality server for your final application’s client needs. Rather, it provides an ad-hoc functionality for you to test and debug code, collaborate with your team, and demonstrate your final product. Consequently, it’s a useful part of your developer toolkit that favors simplicity, low resource usage, and reliability over robustness, functionality, and flexibility.