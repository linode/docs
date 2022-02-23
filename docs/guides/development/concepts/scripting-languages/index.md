---
slug: scripting-languages
author:
  name: Linode Community
  email: docs@linode.com
description: "What are scripting languages and how can they be used? We cover the types of scripting langinagest and the best ones for your application. ✓ Learn more!"
og_description: "What are scripting languages and how can they be used? We cover the types of scripting langinagest and the best ones for your application. ✓ Learn more!"
keywords: ['scripting languages','what are scripting languages','what is script language']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-02-23
modified_by:
  name: Nathaniel Stickman
title: "Most Popular Scripting Language with Examples"
h1_title: "What are the Best Scripting Languages?"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Kinsta: Top 13 Scripting Languages You Should Pay Attention to in 2022](https://kinsta.com/blog/scripting-languages/)'
- '[Rockcontent: What Is a Scripting Language and What Are the Most Common Ones?](https://rockcontent.com/blog/scripting-languages/)'
- '[LMU Computer Science: Scripting Languages](https://cs.lmu.edu/~ray/notes/scriptinglangs/)'
- '[Northeastern University: The 10 Most Popular Programming Languages to Learn in 2022](https://www.northeastern.edu/graduate/blog/most-popular-programming-languages/)'
---

Ever wonder what scripting languages are? What do they do, and where should you use them?

Scripting gives a quick and convenient way to write programs and is the bedrock of dynamic web pages. So, knowing scripting languages and where they fit into programming can take you a long way.

In this tutorial, learn what scripting languages are and how they compare to other programming languages. Then, take a walk through a collection of the most popular scripting languages, complete with examples of their code.

## What are Scripting Languages?

Scripted programming languages perform tasks within special run-time environments. These run-time environments can be anything from web browsers to desktop applications, from video games to embedded systems.

Most often, scripting languages are *interpreted languages*. An interpreted language gets executed by an interpreter, rather than directly by the machine it is running on. And, typically, and interpreted language is run statement by statement, rather than compiled ahead of time.

### What is Scripting in Programming?

Scripting languages do not typically get executed directly by the machine they are running on. Instead, an interpreter or other run-time environment takes the instructions in a script and interprets them. It is then the interpreter or run-time environment that executes the interpreted instructions on the machine.

Contrast this with compiled programming languages. With these, code is compiled into machine language, where it can be executed directly by the machine.

### Scripting Languages vs Programming Languages

First, bear in mind that scripting languages are generally programming languages. It is just that they run as interpreted scripts, as described above. You may find it helpful to think of scripting languages as a subset of programming languages generally.

The distinction is complicated even more by the fact that some traditionally-compiled languages can also be run through interpreters. With these, it becomes possible to use languages like C/C++ and Go for scripting.

All that said, what are the key characteristics that separate the two categories?

- Scripted languages operate withing particular run-time environments, like a web browser or an embedded system.

- Scripted languages are generally interpreted rather than compiled to executable machine code.

- Scripted languages have become synonymous in popular conversation with high-level languages.

This last point is certainly not always the case, and you could more accurately label these high-level languages *dynamic languages*. However, there is significant overlap, with many scripting languages featuring high-level design.

## Why Scripting Languages?

Scripting languages are not for every programming need. But they certainly have characteristics that make them exceptional for plenty of programming tasks.

To help you decide when you should use scripting languages, what follows is a breakdown of some of the key reasons for doing so:

- Portability. Usually, you can run a script anywhere you can run the script's interpreter. So, for instance, you can run JavaScript in any popular modern web browser regardless of the operating system, and you can run Python through the Python interpreters that are ubiquitous across all major operating systems.

- Simplicity. You do not have to wait for compiling, nor do you have to wade through some of the issues that can arise during compilation. Moreover, scripting languages often take a high-level approach, making code easier to read. These factors make scripting languages excellent choices for one-off tasks, small applications, or supplementary programs.

- Learning. The high-level syntax used by many scripting languages makes them easier to read and more approachable for newcomers. Additionally, the fact that interpreted programs run immediately, without compilation, provides constant feedback. The time between making a mistake, recognizing it, and trying to fix it is narrowed, which can speed up learning.

Contrast this with a breakdown of the key limitations of scripting languages:

- Inefficiencies. Line-by-line interpreting has its conveniences, but it also means that scripting languages often lack the kinds of optimizations compiled languages have.

- High-level focus. Though not always the case with scripting languages, many do have high-level syntax. This can be limiting when your program need to control low-level features of a system, like memory usage.

## Types of Scripting Languages

Scripting languages widely vary in types. Some are used for video game scripting, for instance, while some are used for scripting command-line shells.

Moreover, many of these languages fit multiple types. Lua, as an example, gets used frequently for video game scripting as well as for standalone applications. Python, similarly, gets used for scripting systems administration tasks, web application servers, and standalone applications.

But a good place to start, and one of the most popular areas for scripting languages, is with web programming. In web programming, scripting languages can be put into one of two roles:

- Client side for scripts running in web browsers. These typically add dynamic components to web pages and handle communication with the web server.

- Server side for scripts running on web servers. These do everything from serving web content, to providing APIs for web pages, to storing and processing data.

On the client side, JavaScript has become the widely-accepted default scripting language, with universal support among the popular modern web browsers.

On the server side, however, you can find an enormous array of scripting languages. Many of the scripting languages listed below can be used for server-side programming. Even JavaScript can do so, through Node.js.

## The 8 Best Scripting Languages

What follows is a list of the eight most popular and trending scripting languages. Not all of these are exclusively scripting languages — at least one can be compiled, and it is even most often used in that way. But all of them perform excellently in that role.

Throughout, the guide observes where these languages tend to fit in the universe of scripting and attempts to give you an idea of their characteristics.

With each language, you can find an example of a "Hello, World!" program. The approach taken here extends the typical "Hello, World!" to include a variable, argument, and function. This way, you get a fuller sense of each language's syntax characteristics.

### Python

[Python](https://www.python.org/) is a general-purpose interpreted language. Its high-level syntax has given Python a reputation for being incredibly approachable, while its extensive collection of packages have made it widely capable.

And likely you already have a Python interpreter on your machine. You can see with either the `python` or `python3` command.

Because of its wide-ranging abilities and its ubiquity, Python has been used numerous areas. It has been used on the server side for creating web servers and web APIs, in robotics, and in educational settings. Plenty have made use of Python for standalone applications, too.

Most frequently, though, you can see Python used for web application programming, scripting system administration tasks, and data analysis and data science.

Python's syntax tends to be minimalistic, with the goal of elevating readability and code elegance.

``` python
greeting_text = "Hello, world!"

def hello_world(name_arg):
    print(greeting_text + " I'm " + name_arg + ".")

hello_world("Example User")
```

### JavaScript

[JavaScript](https://www.javascript.com/) is the language of dynamic web pages. This general-purpose programming language has become the *de facto* scripting language for web browsers. By far, the majority of web pages you visit use JavaScript to achieve action and interactivity.

Most browsers also let you toy around with their JavaScript interpreters. Open up your browser's developer tools, and look for the JavaScript console. There, you can enter JavaScript commands and see the interpreter in action.

JavaScript has also found a place on the server side with Node.js. Today, it is entirely possible, and often the case, that a web application can be developed completely in JavaScript, from the server side to the client side.

JavaScript's syntax relies on curly braces (`{ }`) to distinguish blocks of code, and generally fits into the category of "C-like" languages.

``` javascript
const greetingText = "Hello, world!";

function helloWorld(nameArg) {
    console.log(greetingText + " I'm " + nameArg + ".");
}

helloWorld("Example User");
```

### PHP

[PHP](https://www.php.net/) is another general-purpose programming language, but one that is especially focused on web development. Originally, PHP fit the scope now occupied by JavaScript — it added dynamic elements to web pages. But PHP pivoted and has evolved into a full-featured scripting language for server-side web development.

PHP's syntax uses delimiters (`<?php ... ?>`) to mark the beginning and ending of scripts and precedes variables with an operator (`$`). Otherwise, the syntax resembles C.

``` php
<?php
$greeting_text = "Hello, world!";

function hello_world($name_arg) {
    echo "$greeting_text I'm $name_arg.";
}

hello_world("Example User");
?>
```

### Lua

[Lua](https://www.lua.org/) is a general-purpose language with a high-level design, similar to Python. Lua, however, is intended to be lightweight. This makes Lua excellent as an embedded language, allowing you to write scripts extending on other applications.

For that reason, you frequently see Lua as the scripting language for video games, editors, and other applications.

Here are some examples of games that have used Lua scripting in their design:

- *Civilization* (V and VI)

- *Sims 2*

- *The Witcher*

And here are some applications that make use of Lua for scripting:

- *Apache HTTP Server*

- *Neovim*

- *Redis*

Lua's syntax, like Python's, emphasizes minimalism and readability.

``` lua
local greeting_text = "Hello, world!"

function hello_world(name_arg)
    print(greeting_text .. " I'm " .. name_arg .. ".")
end

hello_world("Example User")
```

### Ruby

[Ruby](https://www.ruby-lang.org/en/) fits right in with Python and Lua. It is a general-purpose, high-level scripting language. Ruby has been designed with simplicity and elegant code in mind, and this focus makes it a readable and approachable option.

Ruby is unique among the high-level languages covered here in that it has a pure object-oriented foundation. It can operate as a multi-paradigm language, just like the other high-level languages. But Ruby has the consistency of everything being an object at its core, enhancing the experience of learning and working with it.

Ruby has a simple high-level syntax that can make for readable and approachable code.

``` ruby
greeting_text = "Hello, world!"

def hello_world(name_arg)
    puts greeting_text + " I'm " + name_arg + "."
end

hello_world("Example User")
```

### Perl

[Perl](https://www.perl.org/) is another general-purpose scripting language, but one that is considerably older than the others on this list. Its name stands for **P**ractical **E**xtraction and **R**eporting **L**anguage, and it started out as a language for text processing and reporting.

But it gained popularity as one of the early scripting languages for server-side web development, using the CGI web server interface. Often, you can still find it in use in that role today.

Perl's syntax lacks some of the modern elegance of languages like Python and Ruby. But it follows C-like languages, and it has some familiarity for those used to PHP.

``` perl
$greeting_text = "Hello, world!";

sub hello_world {
    print("${greeting_text} I'm ${_[0]}.");
}

hello_world("Example User");
```

### R

[R](https://www.r-project.org/) is an interpreted language designed specifically for statistical computing. The language has gained popularity in the data analysis and data science spaces, where its orientation toward statistics and graphing have made it stand out.

The syntax R uses also stands out, having apparent influences from both C-like programming languages and mathematical notation.

``` r
greetingText <- "Hello, world!"

helloWorld <- function(nameArg) {
    print(paste(greetingText, " I'm ", nameArg, ".", sep=""))
}

helloWorld("Example User")
```

### Go

[Go](https://go.dev/), also called Golang, has been designed to be a safe, secure, and more readable systems programming language, in alternative to C. Go is, thus, a low-level language, making it a little less approachable for many users than the high-level languages featured on this list.

But when it comes to systems programming, Go stands out as a straightforward, readable, and modern language. This makes it a compelling choice for those looking to get into systems programming but who are daunted by C.

Go is actually a compiled language, not an interpreted one. So what is it doing on this list? Thanks to its `go run` command, Go is capable of running Go code as scripts. And because of its low-level design, these scripts can be incredibly fast and light.

Go's syntax is a little more involved, but follows the model of C and emphasizes conciseness.

``` go
package main

import "fmt"

const greetingText = "Hello, world!"

func helloWorld(nameArg string) {
    fmt.Println(greetingText + " I'm " + nameArg + ".")
}

func main() {
    helloWorld("Example User")
}
```

### Bash

[Bash](https://www.gnu.org/software/bash/) is the incredibly popular GNU command-line interpreter, usually called a shell. Likely, you have used Bash commands before, or commands in similar shells.

The shell's command language is entirely capable as a scripting language. Most users execute Bash script interactively, entering each command as needed. But Bash also supports Bash scripts, allowing you to write and execute script files.

The most common use for Bash scripts is automating command-line tasks. System administrators get especially good use out of Bash scripting. But developers across the spectrum also make use of Bash script for automating everything from deployment tasks to file processing.

Bash's syntax is rather simple, although you need to be attentive to spaces and operators throughout.

``` shell
#!/bin/bash

greeting_text="Hello, world\!"

hello_world () {
    echo "$greeting_text I'm $1."
}

hello_world "Example User"
```

## Conclusion

With that, you have all of the basics of scripting languages. This guide has defined scripting languages, contrasted them with compiled programming languages, and shown some of the most popular options in scripting languages.

Be sure to take what you have gleaned here and start trying some scripting for yourself. And along the way, check out Linode's many web development guides. Plenty of these cover the scripting languages you have gotten a taste of here.

Have more questions or want some help getting started? Feel free to reach out to our [Support](https://www.linode.com/support/) team.
