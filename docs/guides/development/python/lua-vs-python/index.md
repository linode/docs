---
slug: lua-vs-python
description: 'Should you learn Lua vs Python? Read our guide to learn the pros and cons of each language, how hard they are to learn, and more. ✓ Click here to learn more!'
keywords: ['lua vs python', 'what is lua used for', 'javascript python c while overtakes php', 'python about popular language', 'how long does it take to learn lua', 'micropython vs python', 'lua commands', 'is lua hard to learn', 'python vs kotlin', 'python vs other languages']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-12-30
modified_by:
  name: Linode
title_meta: "How to Choose Between Lua vs Python"
title: "Lua vs Python: Which One is Right for You?"
external_resources:
- '[TutorialsPoint.com: Difference between Python and Lua](https://www.tutorialspoint.com/difference-between-python-and-lua)'
- '[GeeksForGeeks.org: Difference between Python and Lua](https://www.geeksforgeeks.org/difference-between-python-and-lua-programming-language/)'
- '[StackShare.io: Lua vs Python](https://stackshare.io/stackups/lua-vs-python)'
authors: ["Martin Heller"]
---

Lua and Python are often mentioned as good choices for embedded scripting languages. Both are interpreted, dynamically typed programming languages implemented in C. Both support procedural, object-oriented, and functional programming. Both are easy to learn compared to compiled, strongly typed, non-garbage-collected languages. This guide explores each language and the differences between them, so you can choose which is a better fit for your applications.

## What is Lua?

Lua is a lightweight, embeddable scripting language that supports procedural programming, object-oriented programming, functional programming, data-driven programming, and data description.

Lua has simple procedural syntax, data description constructs based on associative (key-value) arrays, and extensible semantics. Lua is dynamically typed, runs by interpreting bytecode, and has automatic memory management with incremental garbage collection. It is used for configuration, scripting, and rapid prototyping.

### What is Lua Used For?

Lua is often used as an embedded language in C/C++ applications and games. One major application that embeds Lua is Adobe Lightroom. An extended version of the Lua interpreter that knows about Lightroom APIs ships with the Lightroom SDK for Windows and macOS. Several major games also embed Lua and use it as a scripting language, including World of Warcraft and Angry Birds.

Lua is used in the 20-year-old Torch open source machine learning (ML) library, which hasn’t been updated in five years. Strong support for Python in the machine learning/deep learning (DL) community spurred the transition from Torch to PyTorch, which uses Python. It is now considered a strong competitor to TensorFlow, which also uses Python. While Lua was used for ML and DL programming for around 15 years, it has fallen out of favor.

### Is Lua Hard to Learn?

Lua is a simple language that is fairly easy to learn. However, it does contain some sophisticated features, such as meta-mechanisms to extend the language, and coroutines for collaborative multithreading. You can begin to familiarize yourself with Lua using a [live interactive online demo](https://www.lua.org/cgi-bin/demo).

From there, you can download the [Lua binary](http://luabinaries.sourceforge.net/) for your machine. Alternate download sources include [Lua for Windows](https://github.com/rjpcomputing/luaforwindows) and the [LuaRocks](https://luarocks.org/) package manager. With a working Lua interpreter on your machine, follow the book [Programming in Lua](https://www.lua.org/pil/), authored by the chief architect of the language. For the best presentation, buy the latest version of the book, although the free online first edition may be enough to get started. Read through and bookmark the [Lua reference manual](https://www.lua.org/manual/5.4/). There’s an [extensive list of Lua books](https://www.lua.org/docs.html#books) on the Lua documentation site.

It takes a few days to learn the basics of Lua, and a few weeks to learn enough Lua to be productive writing Lua code.

## What is Python?

Python is an interpreted, portable, interactive, object-oriented programming language that has modules, exceptions, dynamic typing, very high-level dynamic data types, and classes. In addition to object-oriented programming, it supports procedural and functional programming. Python has interfaces to many system calls and libraries, and to various window systems. It is extensible in C or C++, and is sometimes used as an extension language for applications that need a programmable interface.

### What is Python Used For?

Python is used for:

-   Web and internet development, usually at the back end
-   Scientific and numeric computing, including machine learning and deep learning
-   Teaching programming
-   A support language for software developers
-   ERP and e-commerce systems

PyPI, the Python Package Index, is massive. It currently contains over 400,000 projects, which you can search [here](https://pypi.org/search/). There are many Python frameworks and content management systems for web applications and backends, including [Django](http://www.djangoproject.com/), [Flask](http://flask.pocoo.org/), [Plone](http://www.plone.org/), and [Twisted Python](http://twistedmatrix.com/). Scientific and numeric computing packages include [SciPy](http://scipy.org/), [Pandas](http://pandas.pydata.org/), and [Jupyter Notebooks](https://jupyter.org/). ML and DL packages include [Beautiful Soup](http://www.crummy.com/software/BeautifulSoup/) (for web scraping), [scikit-learn](https://scikit-learn.org/) (ML), [JAX](https://jax.readthedocs.io/en/latest/index.html) (auto-grad), [Keras](https://keras.io/), [PyTorch](https://pytorch.org/), and [TensorFlow](https://www.tensorflow.org/) (all DL).

### Is Python Hard to Learn?

Python is easy to learn and use. In fact, it’s considered one of the better languages to use in introductory programming courses. Python is a big language, and if you want to learn it all you need to spend some time on it. There are several ways to learn Python, including books, web tutorials, videos, and courses. The [Python Beginner’s Guide](https://wiki.python.org/moin/BeginnersGuide) steers you to many useful resources.

An excellent way to start is the online [Python Tutorial](https://docs.python.org/3/tutorial/index.html#tutorial-index). After that, have a look at [The Python Standard Library](https://docs.python.org/3/library/index.html#library-index) and [The Python Language Reference](https://docs.python.org/3/reference/index.html#reference-index). To go deeper, one or more Python books is a good idea.

There are dozens of Python books for readers at all levels, ranging from novices to data scientists, bioinformaticists, and expert programmers. Some of the popular beginner books are:

-   Python Crash Course, by Eric Matthes
-   Python Programming for Beginners, by Codeone Publishing
-   Learning Python, by Mark Lutz

It can take 5 to 10 weeks to learn Python well. While it has simple grammar, it also supports a variety of capabilities and programming paradigms, has a large standard library, and huge pool of packages. However, if you already have some programming background, you can pick up enough Python to get by in under a week.

## Lua vs Python: What are the Differences?

Lua and Python are both interpreted, dynamically typed, garbage-collected programming languages that are implemented in, and can be extended in, C. Both support procedural, object-oriented, and functional programming. Beyond Lua being a smaller language than Python, difference include Lua’s popularity in games and Python’s popularity for data science.

### Lua

This section gives you a flavor for Lua, and draws from the online edition of [Programming in Lua](https://www.lua.org/pil/contents.html). While you can use the [Lua Demo](https://www.lua.org/cgi-bin/demo) page to run the code, some code isn’t appropriate for the online environment. For example, when the code includes an interactive `io.read` statement.

You can also save the code to files, and use a lua interpreter for your computer to run them, which is recommended. If you need a code editor that understands Lua, try [Visual Studio Code](https://code.visualstudio.com/). On macOS, install the Lua interpreter with `brew install lua`. If that fails because your shell can’t find `brew`, install it from https://brew.sh/.

{{< note >}}
Lua has no concept of a program “main” since it is designed as an extension language.
{{< /note >}}

#### Lua Programming Basics

First, start the Lua shell:

```command
lua
```

A basic “Hello, World!” program in Lua is as simple as you could expect:

```command
print("Hello, World!")
```

Run that and you get:

```output
Hello, World!
```
You can also add comments to the code:

```command
print("Hello, World!")
-- hello.lua
-- the first program in every language
```

The `--` sequence marks what follows it as a comment, much like `//` in C, and extends to the end of the line. You can write multi-line comments as `--[[...long comment that may include line breaks...]]`. For instance:

```command
print("Hello, World!")
--[[hello.lua
the first program in every language]]
```

To run "Hello World" and report the version as well:

```command
io.write("Hello world, from ",_VERSION,"!\n")
```

The output from this is:

```output
Hello world, from Lua 5.4!
```

You may wonder what the difference between `print` and `io.write` is. “[As a rule, you should use print for quick-and-dirty programs, or for debugging, and write when you need full control over your output.](https://www.lua.org/pil/21.1.html)” The `print()` function always writes to the standard output and adds newlines. The `io.write` functions writes to the current output file and doesn’t add any extra characters to the output.

Moving on to numeric computations, the tutorial defines a function to compute factorials:

```file{lang="lua"}
-- defines a factorial function
    function fact (n)
      if n == 0 then
        return 1
      else
        return n * fact(n-1)
      end
    end

    print("enter a number:")
    a = io.read("*number")        -- read a number
    print(fact(a))
```

The `==` is the equality comparison operator, `function/end` defines a function, and `if/then/elseif/else/end` defines conditionals. Parentheses delineate function arguments.

For a value of **5**, this prints **120**. For a value of **50**, it prints **-3258495067890909184**, which shows an overflow when converting the value for printing. Lua represents numbers as real (double-precision floating-point). For example, a value of **50.0** returns **3.0414093201713e+64**.

White space in Lua is not significant. In Python, white space, specifically indentation, is very important. Semicolons to terminate or separate statements are optional.

In Lua, global variables don’t need declarations: just assign a value to them. If you want to limit the scope of a variable, qualify it with local. Uninitialized variables have a value of nil. `Lua` is a case-sensitive reserved word, but `And` and `AND` are two different identifiers. Identifiers starting with `_` and followed by capital letters are reserved for system variables, such as `_VERSION`, which you saw above.

Lua is a dynamically typed language. It supports eight basic types: *nil*, *boolean*, *number*, *string*, *userdata*, *function*, *thread*, and *table*. Any variable may contain values of any type. Assigning `nil` to a variable deletes it.

The table type implements associative arrays, also called key-value stores. Tables are the only data structuring mechanism in Lua, and they are Java-like objects. Keys for Lua tables can be any data type except `nil`. The Lua table constructor is a pair of curly brackets, `{}`. As with any other variable, assigning `nil` to a table field deletes it.

To represent table records, you use the field name as an index. Here, `a.name` is syntactic sugar for `a["name"]`, which is the normal way of addressing a table field, assuming that `a` is a pointer to a table.

To represent a conventional array, use a table with integer keys. To iterate over an array, use the `ipairs` library function:

```file{lang="lua"}
-- read 10 lines storing them in a table
    a = {}
    for i=1,10 do
      a[i] = io.read()
    end
-- print the lines
    for i,line in ipairs(a) do
      print(line)
    end
```

You can initialize an array in one step:

```command
days = {"Sunday", "Monday", "Tuesday", "Wednesday",
            "Thursday", "Friday", "Saturday"}
```

The resulting table has `days[1]` equal to `Sunday`. Unlike C, Lua starts an array by default with 1, not 0. An array constructor can contain expressions as well as constants. To create an array starting at 0, specify the first index:

```command
days = {[0]="Sunday", "Monday", "Tuesday", "Wednesday",
            "Thursday", "Friday", "Saturday"}
```

You can always put a comma after the last entry. You can also use semicolons instead of commas for separators. Lua is flexible that way.

To initialize a table to be used as a record, use this syntactic shortcut:

```command
a = {x=0, y=0}
```

This is equivalent to:

```command
a = {}; a.x=0; a.y=0
```

Functions are first class values in Lua. That means functions can be stored in variables, passed as arguments to other functions, and returned as results. In other words, you can use Lua as a functional language. Lua can call functions written in both Lua and C. The entire standard library in Lua is written in C.

The userdata type allows arbitrary C data to be stored in Lua variables. There is little support for the userdata type in the Lua language - it’s mostly there for use by C functions.

Lua denotes the string concatenation operator by `..` (two dots). If any of its operands is a number, Lua converts that number to a string:

```command
print("Hello " .. "World")  --> Hello World
print(0 .. 1)               --> 01
```

Lua allows multiple-assignment statements, where a list of values is assigned to a list of variables in one step. Both lists have their elements separated by commas. For instance:

```command
a, b = 10, 2*x
```

In this assignment, the variable `a` gets the value `10` and `b` gets `2*x`.

In a multiple assignment, Lua first evaluates all values and only then executes the assignments. Therefore, you use a multiple assignment to swap two values:

```command
x, y = y, x                -- swap `x' for `y'
a[i], a[j] = a[j], a[i]    -- swap `a[i]' for `a[j]'
```

For more information, read the book [Programming in Lua](https://www.lua.org/pil/), from which this section of the guide was condensed.

#### Lua Advantages

-   Fast execution speed even though it’s an interpreter - JIT implementation is even faster
-   Small disk and memory footprint
-   Proven when embedded in Lightroom and major games, including Roblox
-   Easy to learn

#### Lua Disadvantages

-   Lua lost out to Python for deep learning (Torch was replaced by PyTorch)
-   Far fewer Lua programmers are available than Python programmers
-   Almost all of the companies that were teaching Lua are gone
-   There are relatively few Lua books compared to Python

### Python

This section draws from the online [Python tutorial](https://docs.python.org/3/tutorial/index.html#tutorial-index). Before you start to work with the programming basics section, install or update your copy of Python. Many computers come with Python installed, but most have older versions, sometimes even the now-deprecated Python2. If possible, use Python 3.11 or later for this guide. Python is free and open source software.

To install Python3, go to the [Python welcome page](https://www.python.org/), find one of the download links, then download and install the current stable version of Python. You may find the download link for your operating system directly, or you may be redirected to the latest downloads list. In either case, make sure that you download the version for the operating system you’re currently running.

Once installed, you may need to run a script (from the installation directory) to install root certificates for use by Python's included SSL implementation. You may also need to run a script to add the current Python binary directory to your executable path. Afterwards, restart your shell so that it picks up the new path. If you already have a lot of programs and development tools installed, you may also need to reorder your shell configuration file.

To check your Python version in your shell after restarting it, type `python3 –version`. If it reports Python 3.11 or higher, you’re all set. Otherwise, consult the [Python beginner’s guide for downloading](https://wiki.python.org/moin/BeginnersGuide/Download).

Visual Studio Code and the Python extension produced by Microsoft are good choices for programming in Python, as both are free.

You may prefer another editor or IDE, and there are many. If you’re a complete beginner, or your attempted Python3 installation failed, install [Thonny IDE](https://thonny.org/). It features a stripped-down user interface, and includes Python in its installation.

You can also use Python’s Integrated Development and Learning Environment (IDLE), which is installed along with the Python interpreter. If you’re trying IDLE, the user documentation is available by selecting **Help** and then **IDLE Help** from the **IDLE** menu.

#### Python Programming Basics

You can use Python as a calculator in interactive mode. Start by typing `python3` into your shell:

```command
python3
```

```output
Python 3.11.0 (v3.11.0:deaf509e8f, Oct 24 2022, 14:43:23) [Clang 13.0.0 (clang-1300.0.29.30)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

The `>>>` prompt means that the Python REPL (read–eval–print loop) is active. Document what you’re doing by including comments, which start with a hash `#`. You don’t have to add `print` statements, as the REPL prints answers by default. Follow along in your own shell and feel free to omit the comments.

```command
#try some simple arithmetic
2+2
```
```output
4
```

```command
3.14159 * 10.*10.
```

```output
314.159
```

```command
8 / 5  # division always returns a floating point number
```

```output
1.6
```

```command
17 // 3  # floor division discards the fractional part
```

```output
5
```

```command
17 % 3  # the remainder of the division
```

```output
2
```

```command
5 * 3 + 2  # floored quotient * divisor + remainder
```

```output
17
```

```command
r=10 # define a variable (int)
pi = 3.14159 # define a variable (float)
pi * r**2 # exponentiation, int promoted to float
```

```output
314.159
```

```command
'doesn\'t'  # use \' to escape the single quote...
```

```output
"doesn't"
```

```command
"doesn't"  # ...or use double quotes instead
```

```output
"doesn't"
```

```command
# r"..." is a raw string; escapes are ignored
print(r'C:\some\name')  # note the r before the quote
```

```output
C:\some\name
```

```command
# triple quotes allow multi-line strings
print("""\
Usage: thingy [OPTIONS]
     -h                        Display this usage message
     -H hostname               Hostname to connect to
""")
```

```output
Usage: thingy [OPTIONS]
     -h                        Display this usage message
     -H hostname               Hostname to connect to
```

```command
# string concatenation and repetition
# 3 times 'un', followed by 'ium'
3 * 'un' + 'ium'
```

```output
'unununium'
```

```command
# automatic concatenation of string literals (only!)
'Py' 'thon'
```

```output
'Python'
```

```command
text = ('Put several strings within parentheses '
'to have them joined together.')
text
```

```output
'Put several strings within parentheses to have them joined together.'
```

```command
word = 'Python'
word[0]  # character in position 0
```

```output
'P'
```

```command
word[5]  # character in position 5
```

```output
'n'
```

```command
word[-1]  # last character
```

```output
'n'
```

```command
word[-2]  # second-last character
```

```output
'o'
```

```command
# slices
word[0:2] # chars from position 0 (included) to 2 (excluded)
```

```output
'Py'
```

```command
word[:2] # use default slice beginning
```

```output
'Py'
```

```command
word[4:] # use default slide end
```

```output
'on'
```

```command
# strings are immutable
word[0] = 'J'
```

```output
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: 'str' object does not support item assignment
```

```command
s = 'supercalifragilisticexpialidocious'
len(s) # string length
```

```output
34
```

```command
# lists are constructed with square brackets
squares = [1, 4, 9, 16, 25]
squares
```

```output
[1, 4, 9, 16, 25]
```

```command
squares[0]  # indexing returns the item
```

```output
1
```

```command
squares [2:4] # list slice
```

```output
[9, 16]
```

```command
squares + [36, 49, 64, 81, 100] # list concatenation
```

```output
[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
```

```command
squares [1] = 5 #lists are mutable
squares
```

```output
[1, 5, 9, 16, 25]
```

```command
squares [1] = 4 #fix the mistake
squares
```

```output
[1, 4, 9, 16, 25]
```

```command
squares.append(36) #use append method instead of + operator
squares
```

```output
[1, 4, 9, 16, 25, 36]
```

```command
len(squares) # length function, same as strings
```

```output
6
```

```command
# Fibonacci series:
# the sum of two elements defines the next
a, b = 0, 1 # multiple assignment
while a < 10: # note use of indentation below
    print(a)
    a, b = b, a+b
```

```output
0
1
1
2
3
5
8
```

The `while` loop executes as long as the condition (here: `a < 10`) remains true. The body of the loop is indented. Indentation is Python’s way of grouping statements. At the interactive prompt, type a tab or space(s) for each indented line. In a Python-aware text editor, the indentation may be done automatically.

Running Python’s REPL interactively is useful for exploring, but is not how to develop real Python programs. Open your Python-aware code editor, copy the following code into a file called **fact.py**, and save it. This code does the same thing as the factorial example in Lua that you saw earlier. What’s different, other than the change of language, is that you’re testing the function `fact` more extensively.

```file{title="fact.py" lang="python"}
def fact (n):
    if n == 0:
        return 1
    else:
        return n * fact(n-1)

if __name__ == "__main__":
    for a in range(51):
        print(a,"\t",fact(a))
```

Starting from the top, `def` means that you are defining a function. The expression inside parentheses is the argument of the function, and the colon `:` says that the next line initiates the function. The first line of the function is indented, which is required in Python. The `if` statement handles the case where `n` is zero. It is followed by another colon and another indent for the body of the case, which returns the value 1.

The code then outdents for the `else` statement, which ends in a colon. It is followed by an indented body for the case, which implements the factorial function recursively. The outdented statement `if __name__ == "__main__":` is how you implement a command line utility in Python. The indented `for` statement generates a sequence from 0 to 50 using the range function. After the colon and next indent, the program prints the current value and its result using `"print(a,"\t",fact(a))"`. The escaped `t` is a tab character, to help the results line up.

Now open a shell, change to the directory where you saved **fact.py**, and run it using `python3 fact.py`. You should see this result:

```command
python3 fact.py
```

```output
0 	 1
1 	 1
2 	 2
3 	 6
4 	 24
5 	 120
6 	 720
7 	 5040
8 	 40320
9 	 362880
10 	 3628800
11 	 39916800
12 	 479001600
13 	 6227020800
14 	 87178291200
15 	 1307674368000
16 	 20922789888000
17 	 355687428096000
18 	 6402373705728000
19 	 121645100408832000
20 	 2432902008176640000
21 	 51090942171709440000
22 	 1124000727777607680000
23 	 25852016738884976640000
24 	 620448401733239439360000
25 	 15511210043330985984000000
26 	 403291461126605635584000000
27 	 10888869450418352160768000000
28 	 304888344611713860501504000000
29 	 8841761993739701954543616000000
30 	 265252859812191058636308480000000
31 	 8222838654177922817725562880000000
32 	 263130836933693530167218012160000000
33 	 8683317618811886495518194401280000000
34 	 295232799039604140847618609643520000000
35 	 10333147966386144929666651337523200000000
36 	 371993326789901217467999448150835200000000
37 	 13763753091226345046315979581580902400000000
38 	 523022617466601111760007224100074291200000000
39 	 20397882081197443358640281739902897356800000000
40 	 815915283247897734345611269596115894272000000000
41 	 33452526613163807108170062053440751665152000000000
42 	 1405006117752879898543142606244511569936384000000000
43 	 60415263063373835637355132068513997507264512000000000
44 	 2658271574788448768043625811014615890319638528000000000
45 	 119622220865480194561963161495657715064383733760000000000
46 	 5502622159812088949850305428800254892961651752960000000000
47 	 258623241511168180642964355153611979969197632389120000000000
48 	 12413915592536072670862289047373375038521486354677760000000000
49 	 608281864034267560872252163321295376887552831379210240000000000
50 	 30414093201713378043612608166064768844377641568960512000000000000
```

To learn more, go through the whole [Python tutorial](https://docs.python.org/3/tutorial/index.html), or at least Chapter 4 to the end. Then go back to the Is Python Hard to Learn? section of this guide and go through the additional material provided in that section.

#### Python Advantages

-   Fast execution speed even though it’s a bytecode interpreter, especially for version 3.11 and later.
-   Easy to learn, although not as simple as Lua
-   Very well documented and supported
-   Numerous Python books and online courses are available
-   Good standard library and huge selection of modules
-   Very useful for creating command line utilities
-   Widely adopted in the science, engineering, and machine learning communities
-   Supports classes, type hints, main functions, et cetera
-   There is a large pool of Python programmers and lots of community support

#### Python Disadvantages

-   Takes more disk space and memory than Lua
-   Execution is often not as fast as C programs, but you can call C functions if needed

## Conclusion

Lua and Python are both interpreted, dynamically typed, garbage-collected programming languages. Lua is smaller than Python, making it easier to learn and embed. However, Python is better supported and more widely applicable.