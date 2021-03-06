---
slug: pylint-intro
author:
  name: Cameron Laird
  email: claird@phaseit.net
description: 'Pylint helps raise the code quality of Python programs..'
og_description: 'Pylint helps raise the code quality of Python programs.'
keywords: ['install pylint for python 3']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-05
modified_by:
  name: Linode
title: "How to install and use Pylint for Python3"
h1_title: "How to install and use Pylint for Python3"
contributor:
 name: Cameron Laird
 link: https://twitter.py/Phaseit
---

# How to install and use Pylint for Python3

[Pylint](https://www.pylint.org/) analyzes Python source code. Specifically, Pylint examines Python programs and identifies ways to improve their code quality.

&quot;Quality&quot; might mean any number of things. It could include sensible programming logic; correct spelling in comments; more idiomatic Python constructs; variable names that match a particular style guide. Pylint can serve many needs.

Many large projects rely on Pylint to help maintain the consistency and correctness of hundreds of thousands of lines of source. At the same time, plenty of individual developers use Pylint to &quot;beautify&quot; even the small, one-off Python programs they write.

Whatever your situation, you&#39;re just a few minutes away from experiencing Pylint for yourself.

## Installation

The fundamental installation instruction for Pylint is:

```
pip install pylint
```

or, in even more modern contexts:

```
python -m pip install pylint
```

The pylint executable becomes available at the native command line once you execute either of these commands successfully, under Windows, MacOS, Linux, or another Unix. With this approach to installation, the only prerequisite is to have pip (or python itself) installed.

The [Pylint project site](https://www.pylint.org/#install) provides several more variations under the title &quot;Installation,&quot; and even these aren&#39;t exhaustive. Intermediate users might have occasion to install Pylint from source, install it as a Linux package, configure an interactive development environment (IDE) for its application, and so on. To start, though, all you need is:

```
pip install pylint
```

Is that a surprise? You might be familiar with pip&#39;s role in installation of libraries; Pylint is an example of how pip also installs executable programs.

With Pylint installed, you should be able to run this at the command line:

```
pylint --version
```

Expect to see something like:

```
pylint 2.7.0 …
```

Once you&#39;ve made it this far, you&#39;re ready to begin to receive Pylint&#39;s benefits.

## Getting started with Pylint

To learn what Pylint can do, create a little Python example script, and name it `my_sum.py`:

```python
sum1 = 3 + 4;
print(&quot;Sum is %d.&quot; % sum1)
```

Execute this, with the result:

```
Sum is 7.
```

Good! You&#39;re a successful Python programmer.

Pylint can help you be a better, more stylish one, though. From the command line, run:

```
pylint my_sum.py
```
Now you see:

```
my_sum.py:1:0: W0301: Unnecessary semicolon …
[as well as other diagnostics we ignore for the moment]
```

[as well as other diagnostics we ignore for the moment]

In this case, Pylint helps you conform to &quot;best practices&quot; for Python coding, many of which [the PEP8 reference](https://www.python.org/dev/peps/pep-0008/) documents.

Update `my_sum.py`:

```python
sum1 = 3 + 4
print(“Sum is %d.” % sum1)
```

Re-run Pylint. With the unnecessary semicolon removed, Pylint raises its score for the program.

The result: With Pylint&#39;s help, you have a script with both a correct result and a more standard style.

At this level, Pylint is akin to a spell checker. Pylint doesn&#39;t produce correct programs; that&#39;s still the developer&#39;s responsibility. Pylint helps smooth and style and &quot;beautify&quot; programs.

Think what this means for code review. If you&#39;re a member of a team working on a Python project, and all your source scores &quot;10&quot; with Pylint, all reviews can more effectively concentrate on functionality and correctness and higher-order concepts. The code review doesn&#39;t need to concern itself with such distractions as fretting over punctuation, matching indentation, and variable name style conventions. Pylint takes care of those for the team. That&#39;s real progress!

Just as with word processing spell-checkers, expert reading still has a place. While the former don&#39;t distinguish the intent between, &quot;dog is humans&#39; best friend&quot; from &quot;god is humans&#39; best friend,&quot; Pylint accepts both `sum = first + second` and `sum = first - second` equally. As you use Pylint, though, you&#39;ll find that you want the advantages it brings.

## More than just a pretty face

Pylint knows more than mere style. It embeds intelligence about a number of common coding errors. As a next example, consider the fragment:

```python
def my_function():
    “”” An example for a Pylint demonstration. “””
    my_sum1 = 3 + 4
    print(“The sum is %d.” % my_sum1)
    return my_sum

```

Run this through Pylint:

```
… E0602: Undefined variable ‘my_sum’ …
```

`my_sum` is indeed unbound, or unassigned. Maybe the developer intended `my_sum1`. In any case, Pylint helped to identify a functional error _before the Python code was executed_.

Pylint tackles more subtle errors, too. Consider:

```python
raise Exception(“This shouldn’t happen.”)
return True
```

This might well be part of a program which meets its specifications. When passed to Pylint, though, the latter complains:

```
... W0101: Unreachable code ...
```

Pylint&#39;s right. Once the exception is raised, control flow passes up and out to an exception-handler, and the return result has no effect. Pylint identifies that the code fragment is syntactically valid, yet it probably represents at least a confusion.

## Expect verbose results at first

When you first apply Pylint to a real-world program—whether that&#39;s a 12-line script to prepare a monthly financial report, or the 30,000 lines of a commercial web application you maintain—Pylint is likely to have a lot to say. On Pylint&#39;s 0-to-10 quality scale, it&#39;s common for the first run against a new project to show a negative score. Even a perfectly usable tiny program can report more errors and warnings than it has lines, when the code is initially analyzed. _Do not let this discourage you_. If this is your experience—if Pylint generates a mountain of complaints at first—it means there&#39;s work to do, but almost certainly less than initially appears.

Keep the long-term goal in mind. Your purpose with Pylint is to ensure that the Python source code scores a 10, so that any errors or even questionable uses in new code you write turn up immediately, when they&#39;re easiest to fix. The initial messages may generate a low score at first; a few tips get you to 10 faster than you expect.

## Making it work for you

If you&#39;re facing thousands of Pylint complaints, it&#39;s almost certain that most of them result from one or two simple and easily-resolved causes. Pylint&#39;s quality score plummets if, for instance, a project&#39;s code has inconsistent indentation, or mixes tabs and spaces for indentation. These kinds of lexical errors are easily corrected, and Pylint&#39;s score soars as soon as they are corrected.

Also common are complaints about variable names. Consider:

```python
def my_func():
    “”” An experiment with variable names. “””
    for i in range(20):
        print(i)
```

It&#39;s perfectly clear what this does, right? And it does so correctly, doesn&#39;t it? By default, Pylint doesn&#39;t think so.

Pylint expects variable names to be at least three characters long. For a situation like this, at least five remedies are available:

- Comply with its expectations: Change the variable name from `i` to, say, `counter`
- Direct Pylint to ignore this particular name -- `i` -- in its judgment
- Direct Pylint to accept all names in this particular source
- Direct Pylint to accept all names in all sources of the project; or
- Declare `i` to be a special-purpose name that Pylint accepts for this project.

To follow Pylint&#39;s advice directly, rewrite the sequence above to:

```python
def my_func():
    “”” An experiment with variable names. “””
    for counter in range(20):
        print(counter)
```

In that case, Pylint passes it with `... Your code has been rated at 10.00/10`.

Alternatively, tell Pylint about your own coding conventions. You can write:

```python
def my_func():
    “”” An experiment with variable names. “””
    for i in range(20): # pylint: disable=invalid-name
        print(i)
```

This has the effect of disabling Pylint&#39;s name-checking for the single variable `i`.

Insertion of a similar directive, `# pylint: disable=invalid-name`, without indentation near the top of a source file, disables Pylint&#39;s name-checking throughout that specific file.

To configure Pylint throughout an entire project, create a file named `pylintrc` in the directory where you run Pylint—presumably the root or base of the project. Pylint knows not to complain about your program if your `pylintrc` contains either:

```
# It’s OK to name a loop variable “i”.
[BASIC]
	good-names=i
```

or

```
[MESSAGES CONTROL]
	disable=
    	    invalid-name
```

Perhaps you start with a thousand Pylint complaints. Take the time to correct indentation and other punctuation errors, and adjust names. These few, rather mechanical, steps solve nearly all complaints. If 20 of the original thousand problems remain, those 20 error messages probably represent situations that deserve expert attention.

One final tip for your initial encounter with Pylint: if you don&#39;t understand a Pylint report, or don&#39;t agree with it, it&#39;s perfectly fine _at least on a temporary basis_ to direct Pylint to ignore that line with an appropriate # pylint: disable=... directive.

Do what it takes to achieve that Pylint score of 10 quickly. It&#39;s enormously valuable to establish a clean baseline that helps give immediate feedback about new source code. Once you&#39;ve practiced scoring a Pylint 10 for a while, you can return to your source code in a more leisurely manner to inspect and address particular lines that trouble Pylint.

## Is Pylint worth it?

This introduction emphasizes Pylint&#39;s benefits. Pylint beautifies, it finds errors, and it finds likely errors. Do those exceed Pylint&#39;s costs, though?

With few exceptions, most practitioners who try Pylint adopt it long-term. Pylint definitely has tradeoffs, but they&#39;re generally small and manageable.

- It&#39;s easy to run Pylint in IDEs and continuous integration (CI) pipelines.
- Pylint&#39;s diagnostics are lucid.
- While Pylint takes many minutes on large programs, the time it takes is almost always small in comparison with the errors it spotlights.

It&#39;s worth considering Pylint even when it &quot;cramps&quot; a perfectly-reasonable programming style. Pylint is in wide and successful use. If you code in a particular style that Pylint doesn&#39;t like, it might be that your style isn&#39;t widely-understood, and thus is unfamiliar to other team members.

If Pylint is in the wrong, and your style deserves acceptance, you can probably write a `pylintrc` directive to work out a compromise.

In any case, consider Pylint as a &quot;package deal.&quot; Even when you disagree with it about specifics, the mass of consistency and correctness benefits almost certainly outweighs those particular squabbles.

In general, yes: Pylint is worth it.

## Beyond Pylint basics

Initially, most of your Pylint attention is on cleanup of source code. Before long, you&#39;ll raise your Pylint score, and hit 10 scores regularly.

Once you&#39;re a fluent Pylint user, you&#39;ll likely turn your focus to intermediate-level Pylint topics that are beyond the scope of this introduction. Among the skills to learn:

- How to integrate Pylint in CI and continuous testing
- How to configure Pylint to cooperate with such other Python tools such as [black](https://pypi.org/project/black/), [flake8](https://flake8.pycqa.org/en/latest/), [isort](https://pypi.org/project/isort/), [mypy](http://mypy-lang.org/), and so on
- What should be in `pylintrc` to &quot;tune&quot; Pylint for a large project
- How to configure Pylint to check comments and docstrings for spelling errors; and
- How to accommodate actual errors in Pylint.

For now, though, concentrate on getting to and staying at 10, and enjoy the increasingly problem-free source code that Pylint helps you create.
