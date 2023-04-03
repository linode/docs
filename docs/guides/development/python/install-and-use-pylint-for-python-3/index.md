---
slug: install-and-use-pylint-for-python-3
description: 'Pylint for Python 3 helps raise the code quality of Python programs. Learn how to use Pylint with some real-world examples.'
keywords: ['install','pylint','python 3']
tags: ['pylint','python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-05-21
image: Pylint.jpg
modified_by:
  name: Linode
title: "Installing and Using Pylint for Python 3"
title_meta: "How to Install and Use Pylint for Python 3"
external_resources:
- '[PEP8 Style Guide](https://www.python.org/dev/peps/pep-0008/)'
- '[Pylint](https://www.pylint.org/)'
- '[Pylint Site](https://www.pylint.org/#install)'
- '[Black](https://pypi.org/project/black/)'
- '[Flake](https://flake8.pycqa.org/en/latest/)'
- '[isort](https://pypi.org/project/isort/)'
- '[mypy](http://mypy-lang.org/)'

authors: ["Cameron Laird"]
---

## What is Pylint?

[Pylint](https://www.pylint.org/) is a code analysis tool to identify errors in Python source code. Specifically, Pylint helps programmers improve their code quality and style. The coding style that Pylint uses is *PEP8*.

**Code Quality** could include sensible programming logic, correct spelling in comments, more idiomatic Python constructs, variable names that match a particular style guide, etc. Also, developers use Pylint to beautify even a small piece of Python code.

Whatever your situation, it is a must-have tool for a beginner as well as advanced developers as it rates your programs with a score as per the rules outlined in [PEP8 Style Guide](https://www.python.org/dev/peps/pep-0008/).

## Prerequisites

- You need to have `pip` installed. If you have not installed `pip`, install using the below command:

      sudo apt install python-pip

- Verify the `pip` installation using the `version` flag.

    {{< output >}}
pip --version
pip 9.0.1 from /usr/lib/python2.7/dist-packages (python 2.7)
{{< /output >}}

## Install Pylint

You can install Pylint on systems like Windows, MacOS, Linux, or another Unix. On executing the below command, the `pylint` executable becomes available at the native command line.

    pip install pylint

Alternatively, you can also execute the below command:

    python -m pip install pylint

The [Pylint Site](https://www.pylint.org/#install) provides several *Installation* variations for different Operating Systems.

Verify Pylint installation using the `version` flag.
    {{< output >}}
pylint --version
pylint 2.7.0
{{< /output >}}

## Getting Started with Pylint

1. To learn what Pylint can do, create an example Python script, and name it `my_sum.py`.

    {{< file "my_sum.py" python >}}
    sum1 = 3 + 4;
    print("Sum is %d."; % sum1)
    Sum is 7.
    {{< /file >}}

    Pylint can help you be a better, more stylish one, though. From the command line, run:
    {{< output >}}
pylint my_sum.py
my_sum.py:1:0: W0301: Unnecessary semicolon
{{< /output >}}

    You can also see other diagnostics which we ignore for the moment.

    In this case, Pylint helps you conform to the best practices for Python coding as per the PEP8 Style Guide.

1. Update `my_sum.py`, and re-run Pylint with the unnecessary semicolon removed. Pylint raises its score for the program.

    {{< file "my_sum.py" python >}}
    sum1 = 3 + 4
    print("Sum is %d." % sum1)
    Sum is 7.
{{< /file >}}

With Pylint's help, you have a script with both the correct result and a standard style. Pylint is akin to a spell checker.
    {{< note respectIndent=false >}}
Pylint does not produce correct programs; that's still the developer's responsibility. Pylint helps you to beautify the programs, which helps you effectively concentrate on functionality and program correctness.
    {{< /note >}}

## Pylint Demonstration

Pylint knows more than mere style. It embeds intelligence about several common coding errors. As a next example, consider the fragment:

{{< file "my_sum.py" python >}}
def my_function():
    """ An example for a Pylint demonstration."""
    my_sum1 = 3 + 4
    print "The sum is %d." % my_sum1
    return my_sum
{{< /file >}}

Run the above code in the terminal using Pylint:
    {{< output >}}
username@localhost:~$ pylint my_sum.py
No config file found, using default configuration
************* Module my_sum
...
...
E:  5,11: Undefined variable 'my_sum' (undefined-variable)

--------------------------------------------------------------------
Your code has been rated at -5.00/10 (previous run: -5.00/10, +0.00)
{{< /output >}}

`my_sum` is indeed unbound, or unassigned. Maybe the developer intended `my_sum1`. In any case, Pylint helped to identify a functional error **before the Python code was executed**.

### Pylint Unreachable Code Demonstration

Update `my_sum.py` with the below code:

{{< file "my_sum.py" python >}}
def my_function():
    """ An example for a Pylint demonstration."""
    my_sum1 = 3 + 4
    print "The sum is %d." % my_sum1
    raise Exception("This shouldn’t happen.")
    return True
{{< /file >}}

Pylint again complains as follows:
    {{< output >}}
username@localhost:~$ pylint my_sum.py
No config file found, using default configuration
************* Module my_sum
...
...
W:  6, 4: Unreachable code (unreachable)

--------------------------------------------------------------------
Your code has been rated at 4.00/10 (previous run: -5.00/10, +9.00)
{{< /output >}}

Pylint's right. Once the exception is raised, the control flow passes up and out to an exception handler, and the return result does not affect it. Pylint identifies that the code fragment is syntactically valid, yet it probably represents at least a confusion.
    {{< note respectIndent=false >}}
On Pylint's 0-to-10 quality scale, it is common for the first run against a new project to show a negative score. Do NOT let this discourage you. Keep the long-term goal in mind. Your purpose with Pylint is to ensure that the Python source code scores a 10.
    {{< /note >}}

## Work Through Pylint Errors

If you are facing thousands of Pylint complaints, for instance, a project's code has an inconsistent indentation or mixes tabs and spaces for indentation. These kinds of lexical errors are easily corrected, and Pylint's score soars as soon as they are corrected.

Consider the below example for *Variable Checker* messages.
{{< file "variables_demo.py" python >}}
var = 1

def foo():
    global v
    print(v)
    v = 10
    print(v)

foo()
print(var)
{{< /file >}}

Though the code is clear on what it does, Pylint doesn't think so.

Pylint expects variable names to be at least three characters long. For a situation like this, at least five remedies are available:

- Comply with its expectations: Change the variable name from `v` to, say, `var`
- Direct Pylint to ignore this particular name `v` in its judgment
- Direct Pylint to accept all names in this particular source
- Direct Pylint to accept all names in all sources of the project; or
- Declare `v` to be a special-purpose name that Pylint accepts for this project.

To follow Pylint's advice directly, rewrite the above code as follows:
    {{< file "variables_demo.py" python >}}
var = 1

def foo():
    global var
    print(var)
    var = 10
    print(var)

foo()
print(var)
{{< /file >}}

In that case, you can see that Pylint's score is improved.

## Messages Control

Pylint has an advanced message control feature where you can enable or disable a message either from the command line or from the configuration file.

Alternatively, you can tell Pylint about your own coding conventions. You can write:

{{< file "example.py" python >}}
def my_func():
    """ An experiment with variable names. """
    for i in range(20): # pylint: disable=invalid-name
        print(i)
{{< /file >}}

This has the effect of disabling Pylint's name-checking for the single variable `i`.

**To disable Pylint's name-checking throughout that specific file:**

Insert a similar directive, `# pylint: disable=invalid-name`, without indentation at the top of the source file.

**To configure Pylint throughout an entire project:**

Pylint complains about several things. You can create a file that allows you to tell Pylint to ignore certain checks. This file is called `.pylintrc`.

- Create `pylintrc` file in the directory where you run Pylint—presumably the root or base of the project.

      pylint --generate-rcfile.

- Configure Pylint so that Pylint knows not to complain about your program if your `pylintrc` contains the following:
{{< file "pylintrc" python >}}

## It’s OK to name a loop variable "i"

[BASIC]
 good-names=i
  ...
  ...

[MESSAGES CONTROL]
  disable=
      invalid-name
{{< /file >}}

    {{< note respectIndent=false >}}
One final tip for your initial encounter with Pylint: if you don't understand a Pylint report, or don't agree with it, it's perfectly fine at least temporarily to direct Pylint to ignore that line with an appropriate `# pylint: disable=... directive`.
    {{< /note >}}

## Is Pylint Worth It?

1. This introduction emphasizes Pylint's benefits. Pylint beautifies code, it finds likely errors, and with few exceptions, most practitioners who try Pylint adopt it long-term.

   Pylint has tradeoffs, but they are generally small and manageable as:

   - It is easy to run Pylint in IDEs and Continuous Integration (CI) pipelines.
   - Pylint's diagnostics are lucid.
   - While Pylint takes many minutes on large programs, the time it takes is almost always small in comparison with the errors it spotlights.

1. If your code in a particular style that Pylint doesn't like, it might be that your style isn't widely understood, and this is unfamiliar to other team members.

1. If Pylint is wrong, and your style deserves acceptance, you can probably write a `pylintrc` directive to work out a compromise.

In any case, consider Pylint as a package deal, and in general, Yes, Pylint is worth it.

## Beyond Pylint Basics

Initially, most of your Pylint attention is on the cleanup of source code. Once you are a fluent Pylint user, you are likely to turn your focus to intermediate-level Pylint topics that are beyond the scope of this introduction.

Some of the skills that you can learn:

- How to integrate Pylint in CI and Continuous Testing
- How to configure Pylint to co-operate with other Python tools such as [*Black*](https://pypi.org/project/black/), [*Flake8*](https://flake8.pycqa.org/en/latest/), [*isort*](https://pypi.org/project/isort/), [mypy](http://mypy-lang.org/), and so on.
- What should be in `pylintrc` to tune Pylint for large projects.
- How to configure Pylint to check for spelling errors.
- How to accommodate actual errors in Pylint.

For now, concentrate on getting to and staying at a quality score of 10, and enjoy the increasingly problem-free source code that Pylint helps you create.
