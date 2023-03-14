---
slug: python-static-type-checking-with-mypy
description: 'This guide provides some of the techniques to migrate real-world Python projects to type annotated code using the Mypy tool.'
keywords: ['mypy static typing', 'mypy type aliases']
tags: ['python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-12-10
modified_by:
  name: Linode
title: "Use Mypy for Python Static Type Checking"
title_meta: "Python Static Type Checking with Mypy"
authors: ["Cameron Laird"]
---

Python is a dynamically typed language. It determines data types at run time, rather than compile time. Some examples of Python types include integers, floats, strings, and boolean. Dynamically typed languages stand in contrast to statically typed languages, like C++, Java, and Fortran, that perform type checking at compile time.

One advantage to dynamically typed languages, like Python, is that a programmer does not need to specify types for each declared variable. Instead, the Python interpreter infers and assigns a type at run time. This leads to more succinct code that can be written quicker than when using statically typed languages, like Java. This concise style has its disadvantages as well. Because the interpreter works harder to fill in what Python leaves implicit, Python programs can take longer to execute. You may also occasionally run into bugs because Python incorrectly interprets a variable's type. Code completion tools also work better and are more full-featured for statically typed languages.

Recent enhancements to Python make static typing an option. Alternative syntaxes now give programmers the choice to write their Python code in a statically typed way. *Mypy* is a tool used to help you write or rewrite Python code with type annotations. This tool brings the benefits of static typing to your Python programs.

## What is Mypy?

Mypy is a tool used for static-type checking Python code. Python’s founder, [Guido van Rossum](https://gvanrossum.github.io/Resume.html), has worked for several years on Mypy. Mypy’s validation of statically typed Python can result in programs being more correct, readable, refactorable, and testable. If you want to use Python, and you want the advantages of static typing, then consider using Mypy. Alternatives to Mypy such as [Pyre](https://pyre-check.org/) exist, but Mypy is currently more popular in the Python community.

{{< note respectIndent=false >}}
Statically typed languages have the reputation of being more difficult to learn. Converting existing Python code to statically typed code may be intimidating since many lines of code might need to change. This guide illustrates how to adapt an existing Python project to incrementally use Mypy and static typing.
{{< /note >}}

## How to Install and Use Mypy

### How to Install Mypy

Install Mypy on your system using Pip with the following command:

    python -m pip install mypy

{{< note respectIndent=false >}}
If you maintain your configuration through a Graphical User Interface (GUI), like [Anaconda](https://docs.anaconda.com/anaconda/navigator/tutorials/manage-packages/), or use an alternative package manager, modify this command to fit your situation.
{{< /note >}}

### Mypy Basic Usage

Once Mypy is successfully installed, change the directory to one with existing Python source files, and run Mypy with the following command:

    mypy *.py

You should see a similar output if no errors are found.

{{< output >}}
Success: no issues found in N source files
{{</ output >}}

If you do not have Python source files immediately available to you, create one for this example.

    cd /tmp
    echo "print('Hello, world.')" > test1.py

Run Mypy with the following command:

    mypy *.py

The following output is returned:

{{< output >}}
Success: no issues found in 1 source file
{{</ output >}}

The default configuration does not provide any useful information about static types. This is because the Python example does not define any static types. The next section shows you how to add type annotations to your Python code.

### Identify Errors Using Mypy

Mypy can help you identify errors, like missing parentheses in a `print` statement, earlier in your development life cycle. Compared to Python 2, Python 3 is strict about requiring parentheses around a `print` statement. If you are working to update a Python 2 program to Python 3, Mypy can help you identify common syntax errors, like missing parentheses.

Create an example Python file and run Mypy to see its error handling in action.

    echo "print 'Hello, world.'" > test2.py
    mypy *.py

Mypy returns the following error:

{{< output >}}
error: Missing parentheses in call to 'print'. Did you mean print('Hello, world.')?
Found 1 error in 1 file (errors prevented further checking)
{{</ output >}}

Mypy can identify every `print` statement that requires parentheses upon an initial run.

### Static Typing with Type Annotations

Mypy allows you to add *type annotations* to functions in order to help it detect errors related to incorrect function return types. Consider the following example:

{{< file "test3.py" >}}

def legal_name(first: str, last:str) -> str:
    return 'My legal name is:' + first + ' '+ last

legal_name('Jane', 5)

{{</ file >}}

When you run `mypy test3.py`, you see the following error message:

{{< output >}}
test3.py:4: error: Argument 2 to "legal_name" has incompatible type "int"; expected "str"
Found 1 error in 1 file (checked 1 source file)
{{</ output >}}

The first line `def legal_name(first: str, last:str) -> str:` specifies that the function `legal_name()` expects arguments of type `string` and returns a value of type `string`. Mypy is able to detect that the function call's second argument does not fulfill the type annotation requirements. Without the type annotations, Mypy does not detect any issues with an argument of type `int`.

{{< note respectIndent=false >}}
Use mypy's `--disallow-untyped-defs` command-line option, to enforce static typing on all function definitions. This option may be too strict if your Python project works with third-party libraries that do not use type annotations.
{{< /note >}}

Mypy recognizes type annotations on all objects in a Python program. For this guide, the emphasis is on function signatures, as opposed to all the other objects in play in a Python program. When beginning with Mypy, focus on your Python code’s function definitions. When refactoring your Python code with type annotations, begin by annotating all function definitions first. Next, you can consider adding type annotations to variables not only contained in function signatures. Some developers consider that most of Mypy's benefit comes from adding type annotations to function declarations. More exhaustive annotation of other variables may require more effort than it's worth.

#### Type Aliases and Definitions

Much of the power of type annotations, comes from *domain-specific* type definitions, that is, type definitions beyond the built-in types. Consider the following example:

{{< file >}}
def retrieve(url):
    """Retrieve the content found at url."""
...
{{</ file >}}

Straightforward type annotation refines the example above to the following:

{{< file >}}
URL = str

def retrieve(url: URL) -> str:
    """Retrieve the content found at url."""
...
{{</ file >}}

The `URL` is a [type alias](https://docs.python.org/3/library/typing.html#type-aliases), and expresses the intent for the variable `url` more clearly than a bare `str` does. The `retrieve` definition doesn't accept a string for its `url` argument. The `url` argument must be of type `URL`. A proper URL conforms to a [specific documented syntax](https://datatracker.ietf.org/doc/html/rfc1738).

Another benefit of type aliases is the abbreviation of complex types. An example of this advantage can be seen in the following function definition.

{{< file >}}
def compose(first: list[dict[str, float]], second: list[dict[str, float]]) -> list[dict[str, float]]
    ...
{{</ file >}}

The function definition above can be written in a more expressively as shown below:

{{< file >}}
MyType = list[dict[str, float]]
...
def compose(first: MyType, second: MyType) -> MyType:
    ...

{{</ file >}}

As valuable as type aliases are, Python has an alternative, the type definition, that is also powerful. The code below ensures that your `url` arguments use the correct URL syntax:

{{< file >}}
from typing import NewType
...
URL = NewType("URL", str)
...
def retrieve(url: URL) -> str:
    ...

{{</ file >}}

With this type definition in place, Mypy rejects method invocations such as `retrieve("not a true URL")`, while it accepts `retrieve(URL("https://www.linode.com"))`. Python programmers are accustomed to checking for special syntaxes like URLs at run time. Mypy brings the opportunity to express these as powerful compile-time verifications.

More tooling for type definitions exists beyond what this guide introduces. Even without these advanced tools, you can use type aliases and type definitions as illustrated above to make your own source more expressive.

### Directives

Mypy’s directives adjusts the information it returns. Consider the following example:

1. Create a file named `test2.py` with the following content:

    {{< file "test2.py" >}}
def f1(error: str) -> int:
    """While this does nothing particularly useful, the
      syntax is typical of Python code often found "in the
      wild"."""
    if len(error) > 4:
         return 3
    if len(error) > 10:
            return 1 + error
     return 99

print(f"The return value is {f1('abc')}.")
print(f"The return value is {f1('abcef')}.")
    {{</ file >}}

1. Run Mypy on the `test2.py` file:

        mypy --disallow-untyped-defs test2.py

    Mypy reports the function definition of `test2.py` as fully annotated. Every `if` clause of the `f1()` function returns the expected integer type. However, Mypy still reports an error:

    {{< output >}}
test2.py:8: error: Unsupported operand types for + ("int" and "str")
    {{</ output >}}

1. Rerun Mypy to display error codes:

        mypy --show-error-codes --disallow-untyped-defs test2.py

    The error message becomes slightly more descriptive:

    {{< output >}}
test2.py:8: error: Unsupported operand types for + ("int" and "str")  [operator]
    {{</ output >}}

1. Update the `return` statement in line 8 of the example above to:

    {{< file "test2.py" >}}
...
    return 1 + error:  # type: ignore[operator]
...
    {{</ file >}}

    When you rerun Mypy, it reports no errors. The `# type: ignore[operator]` directive marks that as a problem and eventually requires a solution. The directive is a comment, which leaves the behavior of the program entirely unchanged. Now when you rerun Mypy, you get a success message and you can continue to work on other areas of your code. This is a tactic you can use more generally. In annotating types over a large body of source code, it is advisable to choose only one error code, clean up all the occurrences of one error type, while using directives to ignore other problems temporarily, and iterate.

### Mypy Configuration

You can configure Mypy using a configuration file named `mypy.ini`.

Create a new file named `mypy.ini` in your project directory. Add the following content to the file:

{{< file "mypy.ini" >}}
disallow_untyped_defs = true
{{</ file >}}

Any `mypy` command launched in that directory behaves as though it's run with the command-line argument `--disallow-untyped-defs`.

Different filenames are possible for Mypy’s configuration file. `mypy.ini` is a good choice when starting with Mypy, and one that Mypy recognizes by default. You can also use a `.toml` file to store your Mypy configurations.

Your target configuration should include, at minimum, the following configurations:

{{< file "mypy.ini" >}}
disallow_untyped_defs = true
no_implicit_optional = true
show_error_codes = true
strict_equality = true
warn_redundant_casts = true
warn_unused_ignores = true
{{</ file >}}

This configuration helps you adopt the incremental approach for refactoring non-typed Python code recommended in this guide. This combination brings most of the benefits of Mypy to your project, without involving more difficult aspects of Mypy.

## Conclusion

[Mypy’s defaults](https://mypy.readthedocs.io/en/stable/class_basics.html) are worth learning. For example, it’s idiomatic not to annotate the `self` parameter of method definitions. A common constructor is:

    def __init__(self, *args: str, **kwargs: str) -> None

Even with `disallow_untyped_defs` set, Mypy can recognize how to handle `self` correctly without an explicit annotation from the programmer.

Type annotation is a large change to Python coding, however, one that promises significant benefits. Use the techniques outlined in this guide to migrate real-world Python projects to type annotated code.
