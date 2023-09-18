---
slug: python-testing-frameworks-for-software-unit-testing
description: 'This guide provides you with an overview of popular Python testing frameworks used to test software, including overviews of doctest, pytest, and unittest.'
keywords: ['python testing frameworks']
tags: ['python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-09-10
modified_by:
  name: Linode
title: "An Overview of Python Testing Frameworks for Unit Testing"
title_meta: "Python Testing Frameworks for Unit Testing"
authors: ["John Mueller"]
---

This guide provides an introduction to popular Python testing frameworks used to unit test software. Unit tests are automated tests that target and test specific areas of your code, like specific functions or methods. A unit test compares your code against the criteria defined within the test. Using unit testing while developing your code catches bugs, gaps, and regressions. This guide provides an overview of three popular Python testing frameworks; doctest, pytest, and unittest. The guide demonstrates how to implement unit tests for an example function using each testing framework.

## Python Testing Frameworks: doctest, pytest, and unittest

The list below includes some of the most popular Python testing frameworks and what you can expect from each one.

- [**doctest**](https://docs.python.org/3/library/doctest.html): Provides an interactive command-line shell and can be integrated with tools like [Jupyter Notebook](/docs/guides/install-a-jupyter-notebook-server-on-a-linode-behind-an-apache-reverse-proxy/) with greater ease than other testing packages.

    Doctest is not as feature-rich as other frameworks, which limits it to simpler testing scenarios.

- [**pytest**](https://docs.pytest.org/en/6.2.x/): Includes a simple class fixture that makes testing easier. Due to pytest's wide adoption, there are a lot of available resources to help you learn how to use it.

    PyTest is feature-rich, but due to its complexity requires a strong familiarity with Python.

- [**unittest**](https://docs.python.org/3/library/unittest.html): Integrates easily with the Python environment and provides speedy testing. You don’t have to install anything special to use it. It’s also quite flexible and allows for detailed testing.

    This framework is based on JUnit, so it doesn't use Python's typographical conventions. This framework also requires a lot of boilerplate code to use.

## Examples Using Python Testing Frameworks

The examples in this section use a common piece of code to demonstrate how you can implement each framework to test your Python code. The code below consists of a single function using the well-known factorial calculation. The testing frameworks must determine if a value passed to the function is a negative number, a non-integer value, or a value that is too high. The unit tests must not only check correct input values but incorrect values, as well.

{{< file "main.py" >}}

# !/usr/bin/python

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

### Doctest Unit Test Example

Doctest uses docstrings (`'''`) to know which tests to execute and verify. To find your test cases, Doctest searches for `>>>` within a docstring and executes the test. Then, it compares its result with the expected result included in your test case. For example, the first test case in the `test_example.py` file below, tests for a negative number passed as the input to the `factorial(n)` function. The expected result should be the following error, `ValueError: n must be >= 0`. There are six tests in all, each of them following the same pattern.

The following is a an example Doctest Python module.

{{< file "test_example.py" >}}
# !/usr/bin/python

def factorial(n):
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

    import math
    if not n >= 0:
        raise ValueError('n must be >= 0')
    if math.floor(n) != n:
        raise ValueError('n must be exact integer')
    if n + 1 == n:  # catch a value like 1e300
        raise OverflowError('n too large')
    result = 1
    factor = 2
    while factor <= n:
        result *= factor
        factor += 1
    return result

if __name__ == '__main__':
    import doctest
    doctest.testmod()

{{< /file >}}

To run the above example locally, create a file named `test_example.py` and execute it with the following command:

    python -m doctest -v test_example.py

You should see a standard output returned as shown below. A simple report is displayed that outlines the number of tests that passed and failed.

{{< note respectIndent=false >}}
To force verbose mode when running your tests, update the `test_example.py` file by adding `verbose=True` to  `doctest.testmod()`. The updated line should look as follows: `doctest.testmod(verbose=True)`.
{{< /note >}}

{{< output >}}
Trying:
    factorial(-1)
Expecting:
    Traceback (most recent call last):
        ...
    ValueError: n must be >= 0
ok
Trying:
    factorial(30.1)
Expecting:
    Traceback (most recent call last):
        ...
    ValueError: n must be exact integer
ok
Trying:
    factorial(1e100)
Expecting:
    Traceback (most recent call last):
        ...
    OverflowError: n too large
ok
Trying:
    factorial(0)
Expecting:
    1
ok
Trying:
    [factorial(n) for n in range(6)]
Expecting:
    [1, 1, 2, 6, 24, 120]
ok
Trying:
    "{:e}".format(factorial(1000))
Expecting:
    Traceback (most recent call last):
        ...
    OverflowError: int too large to convert to float
**********************************************************************
File "main.py", line 27, in __main__.factorial
Failed example:
    "{:e}".format(factorial(1000))
Expected:
    Traceback (most recent call last):
        ...
    OverflowError: int too large to convert to float
Got:
    Traceback (most recent call last):
      File "/usr/lib/python2.7/doctest.py", line 1315, in __run
        compileflags, 1) in test.globs
File "<doctest__main__.factorial[5]>", line 1, in <module>
        "{:e}".format(factorial(1000))
    OverflowError: long int too large to convert to float
1 items had no tests:
    __main__
**********************************************************************
1 items had failures:
   1 of   6 in __main__.factorial
6 tests in 2 items.
5 passed and 1 failed.
***Test Failed*** 1 failures.
{{< /output >}}

One of the biggest advantages of Doctest is that you can use it from the command line. This means that you can create scripts to test larger projects. Since tests can be included as docstrings within your code, it can become unruly to manage your tests. For this reason, you may consider a more robust unit testing tool, like unittest.

### Pytest Unit Test Example

If you’re looking for a more feature-rich test tool, then Pytest is a good choice. You can use Pytest for unit, functional, and API testing, which makes it an extremely versatile. Pytest also lets you extend its functionality with plugins. Below is a list of some of pytest's most popular plugins:

- **[Pytest-BDD](https://pytest-bdd.readthedocs.io/en/latest/)**: Provides support for Behavior Driven Development (BDD) using a subset of the [Gherkin language](https://cucumber.io/docs/gherkin/).

- **[pytest-cov](https://pytest-cov.readthedocs.io/en/latest/)**: Produces coverage reports, which includes subprocesses.

- **[pytest-django](https://pytest-django.readthedocs.io/en/latest/)**: Allows testing of Django applications and projects.

- **[pytest html](https://github.com/pytest-dev/pytest-html)**: Adds a command line option for printing reports in HTML format.

- **[pytest-randomly](https://github.com/pytest-dev/pytest-randomly)**: Reorders how tests are run so that you can be sure that the test process isn’t relying on a specific test order. This helps you prevent certain classes of errors from being hidden.

- **[pytest-xdist](https://github.com/pytest-dev/pytest-xdist)**: Allows running of tests in parallel, which can reduce testing time.

Before you can use Pytest, you must install it on your system.

{{< note respectIndent=false >}}
If you have not already installed `conda`, see our [How to Install Anaconda](/docs/guides/how-to-install-anaconda/) guide for the installation instructions.
{{< /note >}}

To install Pytest using conda, issue the following command:

    conda install -c conda-forge pytest

The example code imports the pytest module and includes 6 different test methods for the `factorial(n)` function. All the test functions are grouped in the `TestFactorial_1` class. The `assert` statement defines the expected result for a specific test function.

{{< file "test_example_2.py" >}}
import pytest
import math


class TestFactorial_1:
    def test_negative_value(self):
        with pytest.raises(ValueError, match="n must be >= 0"):
            assert factorial(-1)

    def test_float_value(self):
        with pytest.raises(ValueError,
                           match="n must be exact integer"):
            assert factorial(30.1)

    def test_large_value(self):
        with pytest.raises(OverflowError, match="n too large"):
            assert factorial(1e100)

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

To run the unit tests, use the following command:

    pytest test_example_2.py

Running the tests, results in the following output:

{{< output >}}
======================================================= test session starts ========================================================
platform linux -- Python 3.8.10, pytest-6.2.5, py-1.10.0, pluggy-1.0.0
rootdir: /home/example_user
collected 6 items

test_example_2.py ......                                                                                                       [100%]

======================================================== 6 passed in 0.01s =========================================================
{{</ output >}}

You can use the `-v` option to view a more verbose output.

If you modify the `test_example_2.py` file to call the `factorial(n)` function using a value that is out of range, Pytest should return an error. For example, add `factorial(-20)` to the bottom of the file and rerun Pytest. You should see a similar error that has been caught by one of your test functions:

{{< output >}}
======================================================= test session starts ========================================================
platform linux -- Python 3.8.10, pytest-6.2.5, py-1.10.0, pluggy-1.0.0 -- /usr/bin/python3
cachedir: .pytest_cache
rootdir: /home/example_user
collected 0 items / 1 error

============================================================== ERRORS ==============================================================
_________________________________________________ ERROR collecting test_example_2.py _________________________________________________
test_example.py:49: in <module>
    factorial(-20)
test_example.py:35: in factorial
    raise ValueError("n must be >= 0")
E   ValueError: n must be >= 0
===================================================== short test summary info ======================================================
ERROR test_example_2.py - ValueError: n must be >= 0
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Interrupted: 1 error during collection !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
========================================================= 1 error in 0.06s =========================================================
{{</ output >}}

### Unittest Python Testing Framework Example

Like Doctest, unittest is part of the Python standard library. However, unittest uses an entirely different testing paradigm. It provides functionality that is similar the [JUnit](https://junit.org/junit4/) testing framework. Typically, you run unittest on the command line, but it also integrates well with most IDEs.

The example file `test_example_3.py` imports unittest, creates a class named `TestFactorial_2()` that includes all the test methods for the `factorial(n)` function. The test methods ensure that any value passed to the `factorial(n)` function is within the acceptable ranges defined at the beginning of this guide.

{{< file "test_example_3.py" >}}
import unittest
import math

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

To run the test methods defined in the `test_example_3.py` file, issue the following command:

    python -m unittest test_example_3.py

Unittest returns the following output:

{{< output >}}
Float Value Test
.Large Value Test
.List Comprehension Test
.Negative Number Test
.Scientific Notation Test
.Single Value Test
.
----------------------------------------------------------------------

Ran 6 tests in 0.001s

OK
{{< /output >}}

As with Doctest, the output message tells you how many tests were run and how many failed. You can get more information using the `-v` command line option or by adding `unittest.main(argv=[' '], exit=False, verbosity=2)` in the `test_example_3.py` file.

## Conclusion

There are other Python unit testers available, however, many of them build on the unit testers covered in this guide. One example is [nose2](https://github.com/nose-devs/nose2) which builds on unittest.

This guide covered unit testing frameworks, but there are different areas of software testing to explore, like [system](https://en.wikipedia.org/wiki/System_testing) and [acceptance testing](https://en.wikipedia.org/wiki/Acceptance_testing). While there are many specialized software testing frameworks, you can use extensions and plug-ins with unit testers to achieve more testing coverage.
