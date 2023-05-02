---
slug: server-side-programming-languages
title: "5 Server Side Programming Languages Every Programmer Should Know"
title_meta: "Guide to the Best Server Side Scripting Languages"
description: 'Which server side programming languages should you learn? Read our guide for the best server side languages.'
keywords: ['server side programming languages','server side scripting languages','server side development','server side coding','best front end languages','best server side language','server side frameworks','most popular server side languages','server side web applications','server side web frameworks']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Martin Heller"]
published: 2023-05-02
modified_by:
  name: Linode
external_resources:
- '[Orient Software: Top 7 Server-side Scripting Languages](https://www.orientsoftware.com/blog/server-side-scripting-languages/)'
- '[Qulix: Choosing the Best Server-Side Language in 2023](https://www.qulix.com/about/blog/the-best-server-side-language/)'
- '[GeeksforGeeks: Server side and Client side Programming](https://www.geeksforgeeks.org/server-side-client-side-programming/)'
---

This guide is for aspiring web server programmers. It covers the uses and characteristics of web server code, along with key aspects of five programming languages often used for server-side web development.

## What is Server Side Coding?

When a web browser sends an HTTP request to a server, the server parses the request and opens the requested web page. In the simplest case, the page contains HTML, CSS, and perhaps some JavaScript to be sent back to the client browser for execution.

In more complex cases, the web page needs to perform additional processing. This may range from straightforward actions such as adding the current time and date to the page, to executing a full-blown web application. Before returning a result page, an application may request credentials, log the user in, extract information from a database, and perform calculations on the server.

There are many kinds of web applications. Some common web apps simply look up and display information, such as from a repository, wiki, or catalog. The user is then able to scroll through or navigate the displayed information. A more complex app could allow the user to edit the displayed repository or wiki page, or order items from the displayed catalog.

Consider social networks (e.g. Facebook and Twitter), search engines (e.g Google and Bing), reference sites (e.g. Wikipedia and IMDB), and sales sites (e.g. Amazon and eBay). Underlying their user interfaces are rather complex web applications and very large databases. The biggest sites actually use multiple languages and databases.

For example, the Facebook server uses Hack, PHP (HHVM), Python, C++, Java, Erlang, D, XHP, and Haskell for programming. Meanwhile, it used the MariaDB, MySQL, HBase, and Cassandra databases. The Google server uses the C, C++, Go, Java, Python, and Node.js languages, along with the Bigtable and MariaDB databases. [Wikipedia has more examples](https://en.wikipedia.org/wiki/Programming_languages_used_in_most_popular_websites). Note that Hack and Cassandra were developed at Facebook, while Go and Bigtable were developed at Google.

## The 5 Best Server Side Programming Languages to Know

Strongly typed, compiled languages such as C++ and Go are among the highest-performing languages available with respect to runtime speed. However, if you’re new to programming, these might be difficult to start with. Instead, consider beginning with an interpreted language that enjoys wide acceptance in web development, such as PHP, Java, Ruby, Node.js, or Python. Beyond the programming language itself, you need to learn at least one framework for the language in order to avoid reinventing common functionality.

### PHP

PHP bills itself as a *“popular general-purpose scripting language that is especially suited to web development. Fast, flexible and pragmatic, PHP powers everything from your blog to the most popular websites in the world”*. Here, “your blog” essentially means WordPress, and "most popular websites in the world" is Facebook. PHP is also used for desktop scripting. PHP is present on the vast majority of websites, but that may reflect its use in WordPress and MediaWiki (the basis for Wikipedia).

There’s a cottage industry for WordPress (WP) site designers. It requires you to know how to use and customize WP templates and plugins and write PHP, HTML, CSS, and JavaScript. It’s fairly easy to enter this market. It’s also fairly hard for a client to find a good WP developer given the wide range of quality and experience available.

Facebook, on the other hand, has its own virtual machine for running PHP (the hip-hop virtual machine, or [HHVM](https://hhvm.com/)). The company is also building its own dialect of PHP, [Hack](https://hacklang.org/), to run on the HHVM.

PHP is considered to be multi-paradigm, meaning it supports imperative, functional, object-oriented, procedural, and reflective programming. It also has a garbage-collected runtime. PHP existed without a formal specification from its release in 1995, though work started on a spec in 2014. A just-in-time (JIT) compiler for PHP was released in 2020, as part of PHP 8.

For server-side scripting, PHP code is embedded in HTML pages and executed on the server. The following example is the first one given in the [official PHP documentation](https://www.php.net/manual/en/intro-whatis.php):

```file
<!DOCTYPE html>
<html>
    <head>
        <title>Example</title>
    </head>
    <body>


        <?php
            echo "Hi, I'm a PHP script!";
        ?>


    </body>
</html>
```

PHP has control structures, such as `if`, `then`, and `else`. HTML and PHP blocks can also be mixed freely:

```file
<?php
if (strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== FALSE) {
?>
<h3>strpos() must have returned non-false</h3>
<p>You are using Internet Explorer</p>
<?php
} else {
?>
<h3>strpos() must have returned false</h3>
<p>You are not using Internet Explorer</p>
<?php
}
?>
```

One of the original purposes for PHP was to handle HTML forms, for example:

```file
<form action="action.php" method="post">
 <p>Your name: <input type="text" name="name" /></p>
 <p>Your age: <input type="text" name="age" /></p>
 <p><input type="submit" /></p>
</form>
```

This form sends its output to `action.php`:

```file
Hi <?php echo htmlspecialchars($_POST['name']); ?>.
You are <?php echo (int)$_POST['age']; ?> years old.
```

The special variables `$_SERVER` and `$_POST` used in the above examples are called super-global variables. PHP pre-fills them from the HTTP request.

The `htmlspecialchars` function is part of the [PHP library](https://www.php.net/manual/en/funcref.php), which is mostly oriented towards use in web servers. PHP frameworks include [Laravel](https://laravel.com/), [Symfony](https://symfony.com/), [CodeIgniter](https://www.codeigniter.com/), Zend Framework / [Laminas Project](https://getlaminas.org/), [Yii](https://www.yiiframework.com/), [CakePHP](https://cakephp.org/), Slim, [Phalcon](https://phalcon.io/en-us), [FuelPHP](https://fuelphp.com/), and Fat-Free Framework. PHP has strong support for databases.

### Java

Java is an object-oriented language compiled to byte code that runs on the Java Virtual Machine (JVM). The syntax of Java is similar to that of C++. The JVM is an interpreter for byte code, which also has a JIT compiler. Java was originally developed at Sun Microsystems and released in 1995. Sun was later acquired by Oracle. Java is used for portable desktop and server applications as well as web servers. In addition, many Android applications are written in Java.

There are at least 30 Java web frameworks. Some of the most prominent are [Spring](https://spring.io/), [Java Server Faces](https://www.oracle.com/java/technologies/javaserverfaces.html) (JSF), [Java Server Pages](https://docs.oracle.com/javaee/5/tutorial/doc/bnagy.html) (JSP), [GWT](https://www.gwtproject.org/overview.html), [Play!](https://www.playframework.com/), [Struts](https://struts.apache.org/), [Vaadin](https://vaadin.com/), [Wicket](https://wicket.apache.org/), [Tapestry](https://tapestry.apache.org/), and [Grails](https://grails.org/). [Hibernate](https://hibernate.org/) is a related framework that provides an Object-Relational Model (ORM) that makes it easy to use databases from Java. However, you can do just fine with Java Database Connectivity ([JDBC](https://docs.oracle.com/javase/tutorial/jdbc/basics/index.html)) as long as you can write SQL.

Java web frameworks can often be combined. It’s common to use Struts, a model-view-controller (MVC) framework, with an ORM such as Hibernate, a business logic framework such as Spring, and a view component such as JSP, Freemarker, or Velocity.

The code that follows is from the [Oracle JavaEE tutorial](https://docs.oracle.com/javaee/6/tutorial/doc/bnaeo.html). It simply generates a page with a form, collects a name, and says hello. The `@WebServlet` annotation defines the URL pattern to which the servlet responds relative to the web context root. The override to `doGet` implements the HTTP GET method.

```file
@WebServlet("/greeting")
public class GreetingServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html");
        response.setBufferSize(8192);
        PrintWriter out = response.getWriter();

        // then write the data of the response
        out.println("<html lang=\"en\">"
                + "<head><title>Servlet Hello</title></head>");

        // then write the data of the response
        out.println("<body  bgcolor=\"#ffffff\">"
            + "<img src=\"duke.waving.gif\" alt=\"Duke waving his hand\">"
            + "<form method=\"get\">"
            + "<h2>Hello, my name is Duke. What's yours?</h2>"
            + "<input title=\"My name is: \"type=\"text\" "
            + "name=\"username\" size=\"25\">"
            + "<p></p>"
            + "<input type=\"submit\" value=\"Submit\">"
            + "<input type=\"reset\" value=\"Reset\">"
            + "</form>");

        String username = request.getParameter("username");
        if (username != null && username.length() > 0) {
            RequestDispatcher dispatcher =
                    getServletContext().getRequestDispatcher("/response");

            if (dispatcher != null) {
                dispatcher.include(request, response);
            }
        }
        out.println("</body></html>");
        out.close();
    }

@WebServlet("/response")
public class ResponseServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {
        PrintWriter out = response.getWriter();

        // then write the data of the response
        String username = request.getParameter("username");
        if (username != null && username.length() > 0) {
            out.println("<h2>Hello, " + username + "!</h2>");
        }
    }
```

### Ruby

According to the official Ruby site, Ruby is *"a dynamic, open source programming language with a focus on simplicity and productivity. It has an elegant syntax that is natural to read and easy to write."* The creator of Ruby, Yukihiro "Matz" Matsumoto, describes Ruby’s design as being like a simple Lisp language at its core, with an object system like that of Smalltalk, blocks inspired by higher-order functions, and practical utility like that of Perl. Ruby is generally interpreted with a certain amount of JIT compilation. There is a product called the Ruby compiler, a packager that includes the interpreter with the code.

In addition to being dynamic and object-oriented, Ruby is dynamically typed, and uses garbage collection. It supports both procedural and functional paradigms. In Ruby, everything is an object.

The official interpreter for Ruby is the MRI, an acronym for Matz’s Ruby Interpreter. Other interpreters include JRuby (which is implemented on the Java Virtual Machine), Rubinius, MRuby, Opal, and RubyMotion.

The following code is the front page sample from the official Ruby language site:

```file
# The Greeter class
class Greeter
  def initialize(name)
    @name = name.capitalize
  end

  def salute
    puts "Hello #{@name}!"
  end
end

# Create a new object
g = Greeter.new("world")

# Output "Hello World!"
g.salute
```

[Ruby on Rails](https://rubyonrails.org/), or simply "Rails", is the dominant framework that uses Ruby as a web server language. Created by David Heinemeier Hansson ("DHH"), Rails is a full-stack MVC framework that emphasizes Convention over Configuration (CoC), and Don't Repeat Yourself (DRY). Hotwire is currently the default front-end framework for Rails.

Rails is no longer the only Ruby-based web framework, although it’s still the market leader. There are at least a dozen others, including [Sinatra](https://sinatrarb.com/), [Hanami](https://hanamirb.org/), [Grape](https://www.ruby-grape.org/), [Ramaze](http://ramaze.net/), and [Cuba](https://cuba.is/).

### Node.js

JavaScript was developed for, and became popular, as a client-side scripting language. Node.js is an open source, cross-platform JavaScript runtime environment used on both the desktop and for server-side web applications. Node.js achieves low latency and high throughput as a server language by taking a "non-blocking" approach to serving requests. In other words, Node.js wastes no time or resources waiting for I/O requests to return.

At a high level, Node.js combines the Google V8 JavaScript engine, a single-threaded non-blocking event loop, and a low-level I/O API. The stripped-down example code below illustrates the basic HTTP server pattern, using ES6 arrow functions (anonymous Lambda functions declared using the fat arrow operator, `=>`) for the callbacks:

```file
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

The beginning of the code loads the HTTP module, sets the server `hostname` variable to `localhost` (`127.0.0.1`), and sets the `port` variable to `3000`. Then it creates a `server` and a `callback` function. In this case, the fat arrow function always returns the same response to any request: `statusCode 200` (success), `Content-Type` as plain text, and a response of "Hello World". Finally, it tells the server to listen on `localhost` port `3000` (via a socket). It also defines a callback to print a log message on the console when the server has started listening. If run using the `node` command, this code allows any Web browser on the same machine to display "Hello World" at the address `localhost:3000`. To stop the server, press <kbd>Control</kbd> + <kbd>C</kbd> in the terminal window.

Note that every call made in this example is asynchronous and non-blocking. The callback functions are invoked in response to events. The `createServer` callback handles a client request event and returns a response. The `listen` callback handles the listening event.

There are many frameworks for Node.js, largely in the npm package ecosystem. [Express.js](https://expressjs.com/) is one of the oldest and most well-known frameworks. It implements a web server with more flexibility and expandability than the simple example above. There are a dozen variants of Express, such as [Koa](https://koajs.com/), [Fastify](https://www.fastify.io/), and [Sails](https://sailsjs.com/).

There are two direct competitors to Node.js. One competitor, [Deno](https://deno.land/), was designed by Ryan Dahl, the same author as Node.js. It seeks to correct the mistakes he made in Node, along with updating it to use modern JavaScript and TypeScript. The other competitor, [Bun.js](https://bun.sh/), uses [JavaScriptCore](https://github.com/WebKit/WebKit/tree/main/Source/JavaScriptCore), a different JavaScript engine. It claims to be two to three times faster than Node or Deno.

### Python

Python was designed by Guido van Rossum and named after Monty Python’s Flying Circus. According to its web site, Python is *"a programming language that lets you work quickly and integrate systems more effectively"*. Python’s most obvious characteristic is that it uses whitespace and indentation rather than curly brackets to delimit code blocks.

For example, consider the following code from the Python [simple programs list](https://wiki.python.org/moin/SimplePrograms):

```file
friends = ['john', 'pat', 'gary', 'michael']
for i, name in enumerate(friends):
    print ("iteration {iteration} is {name}".format(iteration=i, name=name))
```

The line that begins with `print` is inside the `for` loop started in the line above. The output of the program is:

```output
iteration 0 is john
iteration 1 is pat
iteration 2 is gary
iteration 3 is michael
```

Python is a dynamically-typed and garbage-collected language that supports structured, object-oriented, and functional programming. The standard Python runtime is CPython, which is interpreted. More speed can be gained by moving time-critical inner loops into C, or by using PyPy, which is a JIT compiler. Python has a large standard library, augmented by the PyPI repository of over 400,000 third-party modules.

Python is very strong in several application areas. These include scientific and numeric computing and machine learning, where it gets a huge boost from C libraries that support GPUs and other accelerators. Python is also used heavily for integration scripting, system administration, and web development. Some of the popular Python web frameworks are [Django](https://www.djangoproject.com/), [Pyramid](https://www.pylonsproject.org/), [Bottle](http://bottlepy.org/docs/dev/), [Tornado](https://www.tornadoweb.org/en/stable/), [Flask](https://flask.palletsprojects.com/en/2.2.x/), and [web2py](http://www.web2py.com/).

## Conclusion

There are many good server-side programming languages, and a multitude of libraries and frameworks for each of them. If you’re having trouble deciding on one to learn, pick whichever sounds interesting to you, and implement something with it. Don’t worry about wasting effort on the "wrong" language. Programming skills usually transfer well from one language (and framework) to another.