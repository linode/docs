---
slug: python-testing-frameworks-for-use-with-jupyter-notebook
author:
  name: John Mueller
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['python testing frameworks']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-03
modified_by:
  name: Linode
title: "Python Testing Frameworks for Use With Jupyter Notebook"
h1_title: "An Overview of Python Testing Frameworks for Use With Jupyter Notebook"
enable_h1: true
contributor:
  name: John Mueller
---

Writing code can be interesting, fun, and productivity enhancing. It can also be a grind, frustrating, and inefficient. How your coding experience affects you and those who use your applications, depends on whether the code you create actually works. The only problem is that you can’t be sure how your code will work until you test it.

Most Python unit testers work at the command line without problem within their capabilities. However, many developers today rely on environments such as Jupyter Notebook (which currently [supports over 40 languages](https://jupyter.org/)) to code their applications because it provides them with a friendly environment. In addition, a number of sites report that there are over [3 million publicly available notebooks](https://github.com/jupyter/jupyter/wiki/A-gallery-of-interesting-Jupyter-Notebooks) today. This overview showcases popular Python testing frameworks. It also focuses on whether a particular unit tester will work in Jupyter Notebook in addition to the command line because of Jupyter Notebooks use in the Science and Mathematics communities.


### Popular Python Testing Frameworks

There are many Python unit test frameworks out there and each of them has something to offer. This guide focuses on the most popular products. The following table provides a brief overview of what you can expect from them.

- **DocTest**: Provides an interactive shell for the command prompt. Can also be used in environments, such as Jupyter Notebook with greater ease than just about any other package.

    Poor documentation makes using this particular unit tester more difficult to use than it should be. It’s also limited to simpler testing scenarios.

- **PyTest**: Includes a simple class fixture that makes testing easier. This is possibly the most widely used framework, so there are a lot of available resources.

    Because of all the really useful features this package provides, it’s also completely incompatible with other packages. You also need to understand Python relatively well to use it effectively. In addition, Jupyter Notebook support requires an extra package.

- **UnitTest**: Integrates easily with the Python environment and provides speedy testing. You don’t have to install anything special to use it. It’s also quite flexible and allows for detailed testing.

    Based on JUnit, so it doesn't use the Python typographical conventions. Some developers also find it abstract and needing a lot of boilerplate code to use.

### Examples Using Python Testing Frameworks

The examples in this section uses a common piece of code to test all of the unit testers. You can view the sample code below:

{{< file "main.py" >}}
import math

def factorial(n):
    if not n >= 0:
        raise ValueError("n must be >= 0")
    if math.floor(n) != n:
        raise ValueError("n must be exact integer")
    if n+1 == n:
        raise OverflowError("n too large")

    result = 1
    factor = 2

    while factor <= n:
        result *= factor
        factor += 1
    return result
{{< /file >}}

The code consists of a single function using the well-known factorial calculation. The function performs three tests of the input variables: negative numbers, non-integer values, and values that are too high. Consequently, the unit testers must not only check correct input values, but incorrect values as well.

### DocTest Python Example

Even though this particular unit tester is part of the standard library, you seldom see it mentioned because the documentation supplied at [doctest — Test interactive Python examples — Python 3.9.5 documentation](https://docs.python.org/3/library/doctest.html) makes it appear that you can only use it at the command line. As part of the test for this guide, DocTest is used within Jupyter Notebook within a cell separate from the `factorial()` function. In addition, the methodology for performing tests is poorly documented. However, this is actually a wonderful example of a unit tester because configuring it is easy and it provides a variety of methods to perform testing. Given the test function, here is a unit test setup:

{{< file "main.py" >}}
# Configure the tests
"""
>>> factorial(-1)
Traceback (most recent call last):
    ...
ValueError: n must be >= 0

>>> factorial(30.1)
Traceback (most recent call last):
    ...
ValueError: n must be exact integer

>>> factorial(1e100)
Traceback (most recent call last):
    ...
OverflowError: n too large

>>> factorial(0)
1

>>> [factorial(n) for n in range(6)]
[1, 1, 2, 6, 24, 120]

>>> "{:e}".format(factorial(1000))
Traceback (most recent call last):
    ...
OverflowError: int too large to convert to float
"""

import doctest
doctest.testmod()
{{< /file >}}

This example shows the basics. Each test begins with `>>>` followed by the output expected from your code. In this case, the first test, `factorial(-1)`, results in an exception, `ValueError: n must be >= 0`. There are six tests in all, each of them following the same pattern. Consequently, when the test checks usable output, such as `factorial(0)`, you see a result of `1`. The same is true for the list comprehensions test and outputting the result in scientific notation (which results in an error in this case).

The standard output from the test is a simple report outlining the number of tests that passed and failed. However, this might not be enough information for most testers, so you can pass `doctest.testmod(verbose=True)` instead, which  provides you with the status information for each test run even if the test passes.

One of the biggest advantages of this unit tester is that you really can use it from the command line, which means that you can create scripts to test larger projects. The problem is that the test instructions must appear in the individual files, so managing them can become an issue. The suggestion in this case is to combine DocTest modules with the UnitTest API, but then it might just be better to use UnitTest in the first place.

### Python PyTest Example

If you’re looking for a more feature-rich test tool, then PyTest may be what you’re looking for. You can use PyTest for unit, functional, and API testing, which makes it versatile in a way that many other products don’t emulate. This flexibility extends to a number of plug-ins that include:

- **[pytest-bdd](https://pytest-bdd.readthedocs.io/en/latest/)**: Provides support for Behavior Driven Development (BDD) using a subset of the Gherkin language.

- **[pytest-cov](https://pytest-cov.readthedocs.io/en/latest/)**: Produces coverage reports, which includes subprocesses.

- **[pytest-django](https://pytest-django.readthedocs.io/en/latest/)**: Allows testing of Django applications and projects.

- **[pytest html](https://github.com/pytest-dev/pytest-html)**: Adds a command line option for printing reports in HTML format.

- **[pytest-randomly](https://github.com/pytest-dev/pytest-randomly)**: Reorders how tests are run so that you can be sure that the test process isn’t relying on a specific test order, which can hide certain classes of errors.

- **[pytest-xdist](https://github.com/pytest-dev/pytest-xdist)**: Allows running of tests in parallel, which can reduce testing time.

PyTest is possibly the best known of the unit testing products. Before you can use it, you must install it on your system. You can use conda for the installation:

    conda install -c conda-forge pytest

If you want Jupyter Notebook support, then you also need to install [ipytest](https://github.com/chmp/ipytest) using:

    conda install -c conda-forge ipytest

To run PyTest in Jupyter Notebook, you must use two cells, the first of which loads the required libraries, and configure the Jupyter Notebook support as shown here:

{{< file "main.py" >}}
import pytest
import ipytest
ipytest.autoconfig()
{{< /file >}}

After you configure the library, you use magics to cause a testing script to run. The magics must appear as the first line in the second cell or you see an error, even if you do everything else right. Here is what the test setup looks like for the example:

{{< file "main.py" >}}
%%run_pytest[clean]

class TestFactorial_1:
    def test_negative_value(self):
        with pytest.raises(ValueError, match="n must be >= 0"):
            factorial(-1)

    def test_float_value(self):
        with pytest.raises(ValueError,
                           match="n must be exact integer"):
            factorial(30.1)

    def test_large_value(self):
        with pytest.raises(OverflowError, match="n too large"):
            factorial(1e100)

    def test_single_value(self):
        assert factorial(0) == 1

    def test_list(self):
        output = [1, 1, 2, 6, 24, 120]
        for n in range(6):
            assert factorial(n) == output[n]

    def test_scientific_notation(self):
        with pytest.raises(OverflowError,
                   match="int too large to convert to float"):
            "{:e}".format(factorial(1000))
{{< /file >}}

The `%%run_pytest[clean]` magics actually runs the tests defined by the `TestFactorial_1` class. The clean argument clears all of the output from the previous run so that you can run the test multiple times. The default output only shows the number of tests that passed or failed, along with failure information when needed.

Notice that this test doesn't use list comprehensions. After reading more than a few fixes for list comprehension problems with PyTest online, it became obvious that not using list comprehensions during test is probably the best course. Other than having to use a for loop, PyTest works much like the other unit testers. You can include other code within the test cases, such as writing to a log. All of the command line arguments are also supported. So, if you want to see less information, you can use the `–q` command line argument. To see more information, use the –v command line argument instead.

### Python UnitTest Example

Like DocTest, the functionality for UnitTest is part of the standard library, so you have nothing to download and nothing to install to use it. You also know that the unit tester will work out of the box because you won’t encounter version issues. That’s where the comparison ends. UnitTest uses an entirely different paradigm from DocTest. You get additional functionality, similar to that found in JUnit, and significant flexibility.

Normally, you run UnitTest at the command line. With a little juggling, it works fine in most IDEs too. If you use UnitTest precisely as described in the documentation, you see an error message when attempting to use it. The reason for this error is that UnitTest is looking for a command line argument that doesn't exist in an IDE such as Jupyter Notebook, so you tell it not to look by executing it like this: `unittest.main(argv=[' '], exit=False)`, which basically says not to look for a command line argument. Here’s a version of the testing script for UnitTest:

{{< file "main.py" >}}
import unittest

class TestFactorial_2(unittest.TestCase):
    def test_negative_value(self):
        print('Negative Number Test')
        with self.assertRaises(ValueError, msg="n must be >= 0"):
            factorial(-1)

    def test_float_value(self):
        print('Float Value Test')
        with self.assertRaises(ValueError,
                               msg="n must be exact integer"):
            factorial(30.1)

    def test_large_value(self):
        print('Large Value Test')
        with self.assertRaises(OverflowError, msg="n too large"):
            factorial(1e100)

    def test_single_value(self):
        print('Single Value Test')
        self.assertEqual(factorial(0), 1)

    def test_list_comprehension(self):
        print('List Comprehension Test')
        self.assertEqual([factorial(n) for n in range(6)],
                         [1, 1, 2, 6, 24, 120])

    def test_scientific_notation(self):
        print('Scientific Notation Test')
        with self.assertRaises(OverflowError,
                        msg="int too large to convert to float"):
            "{:e}".format(factorial(1000))

unittest.main(argv=[' '], exit=False)
{{< /file >}}

The test class must subclass unittest.TestCase as shown. Something to notice in this case is that your test script can include functionality other than testing and that you have a number of ways in which to perform a test, such as looking for an exception or determining whether the output equals a certain value. This script outputs messages saying which tests are running. You could put the entries in a log if you wanted. This flexibility also means that if you need to set up a special database or other data source, you can. As with DocTest, all you normally get as output is a message telling you how many tests were run and how many failed. However, you can get more information using the verbosity attribute `unittest.main(argv=[' '], exit=False, verbosity=2)`.

## Conclusion

There are other unit testers available, but many of them build on the unit testers found in this review. For example, [Nose2](https://github.com/nose-devs/nose2) builds on UnitTest. So, if you know how to use UnitTest, you have a very good basis for knowing how to use Nose2, because Nose2 simply adds to what UnitTest provides. The same can be said of [Testify](https://pypi.org/project/testify/), which not only builds on UnitTest, but on Nose as well. In this case, the focus is on adding extensions and plug-ins, akin to what you find with PyTest.

It’s also important to remember that there are many levels of testing. This review covers unit testers, but you also have a wide variety of other test levels that include system and acceptance testing. There are products that cover these other levels directly, but it shouldn't surprise you to learn that you can use extensions and plug-ins with unit testers to achieve the same goals. There are also the BDD testers that try to make things simpler for researchers who really don’t have much interest in detailed testing, but would rather check behaviors. Products in this category include [Behave](https://behave.readthedocs.io/en/latest/) and [Lettuce](http://lettuce.it/).

