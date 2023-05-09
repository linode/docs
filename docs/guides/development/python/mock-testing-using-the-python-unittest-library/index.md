---
slug: mock-testing-using-the-python-unittest-library
description: 'The Python unittest mock object library helps you perform testing on your Python applications. This guide shows you how to create a mock object and use the patch decorator to test your code.'
keywords: ['python unittest','unittest mock','python unittest assert','mock object', 'python mock patch']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-12-03
modified_by:
  name: Linode
title: "An Introduction to Mock Testing Using the Python Unittest Library"
title_meta: "Mock Testing Using the Python Unittest Library"
authors: ["John Mueller"]
---

The Python unittest library helps you test your application code for errors in an automated way. It’s one of the testing methods discussed in our guide, [An Overview of Python Testing Frameworks for Unit Testing](/docs/guides/python-testing-frameworks-for-software-unit-testing/#unittest-python-testing-framework-example). Mock testing is especially useful while your code is yet to be completed and your development is progressing. It performs continuous testing during development and provides good insights into how an application might ultimately function. This guide shows you how to use the Python unittest library to create mock objects to test your code.

## What is the Purpose of Mock Objects in Unit Testing?

Application and unit testing examine how your code works in various situations. Developers use a number of approaches to perform testing, but the three most popular approaches are explained below:

- **Mocking**: This method is useful when the *System Under Test* (SUT) provides enough functionality where you can set values and track methods that are called in your code. With Mocking, a result is generated using the shortest means possible. The mock can be tightly or loosely coupled with the data used by your code. It’s possible to perform assertions against mocks. Mocks are generally used to understand the behavior of an application as it takes shape. It also provides a level of monitoring that *stubbing* and *fakes* can’t provide. The main cost of mocking is added complexity.

- **Stubbing**: This method is most effective when you want to test a specific feature and the SUT can provide a response to queries. The data is hard coded as part of the stub, so the data is tightly coupled. The result mimics what the application is expected to do within limits, and it’s possible to provide some control through input values. Stubs are generally used to test overall unit or application usability to ensure that issues like connectivity are addressed. Many developers use stubbing to test method-call paths through an application or unit.

- **Fakes**: Fakes are a good option to test an application when the SUT provides a canned response to queries that may or may not match what the application eventually outputs. The output is fixed, so that it’s not possible to test any sort of logic or unit behavior. Fakes allow testing of overall unit functionality. Fakes also provide a method to abstract out any functionality that isn’t under development yet, or may not be accessible from the test environment. For example, instead of connecting to a database on a server, the fake may depend on an in-memory database instead.

Most developers use specialized frameworks, such as the [Python unittest library](https://docs.python.org/3/library/unittest.html), to create mocks, and stubs. Fakes are generally coded without the help of a library or a framework.

In mock testing, the unittest relies on a mock object. This mock object is designed to accept the same type of input parameters as the object it is testing. It should also have the same return type as the object its testing. A Python mock patch is a declaration that stands in for the real function until the real function is available. A patch is written as a [*function decorator*](https://www.python.org/dev/peps/pep-0318/). When the function is available, the patch is undone. Mocks are used in the following scenarios:

- When the application you're testing does not yet have access to the API server it eventually connects to.

- There is a need to provide predictable behavior that can’t be counted on when working with third-party services.

- You need a controlled environment where it’s possible to simulate various types of outages, unpredictable behavior, and errors.

- The application requires access to data, but can’t access real data on another server. Perhaps, it only has access to a test server with limited data.

- There is a need for microservice support that doesn't currently exist.

- The application eventually interacts with third-party services, but access is currently unavailable.

- Resources needed by the unit or application are currently unavailable.

- The unit or application needs to output data and receive a realistic response for testing purposes.

- You need to perform testing on code that will rarely be used in a production environment. The code's functionality is exceptional in nature, or simply covers contingencies with a low probability of occurrence.

## The Python unittest Mock Object Library

The [Python unittest mock object library](https://docs.python.org/3/library/unittest.mock.html) enables you to test areas of your application with *mock objects* and with assertions. One big advantage to using mock objects is that the testing code is located in one central location. Other testing techniques, like stubbing, requires that you add stubs throughout all of the code, which can make it more difficult to maintain your tests.

### Creating a New Mock Object

Working with a mock is different from working with standard objects. A mock can perform assertions and create a consistent result by setting object methods to a particular value. Mock objects can also look for side effects that result from making particular calls. However, a mock isn’t real code. A mock object behaves like a "real" object, but doesn't alter your code. The following steps go through some mock object basics to exemplify what mocks can accomplish.

{{< note respectIndent=false >}}
You can run the steps in the following sections using your computer's Python interpreter. To access the Python interpreter, issue the following command:

    python3

You should see the Python interpreter prompt:

{{< output >}}
Python 3.8.10 (default, Sep 28 2021, 16:10:42)
[GCC 9.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>>
{{</ output >}}

{{< /note >}}

1. Instantiate a new mock object and verify that Python returns the object’s unique identifier.

        from unittest.mock import Mock
        myMock = Mock()
        print(myMock)

    You see an output that provides the mock ID, such as `<Mock id='2222167015488'>`. You can use a mock as you would any other object of a particular type. For example, you could mock a class that contains a `setResult()` method and a `getResult()` method.

1. Test the use of a mock to make method calls using the following code:

        myMock.setResult(1, 2)
        print(myMock.getResult())

    The result of the call to `print()` shows that you’re still working with a mock:` <Mock name='mock.getResult()' id='2544405026224'>`. This output contains the text of the call. The mock tracks how you work with the various method calls even though there is no method call code. You can use this behavior to your advantage by making assertions.

1. To make an assertion against the `getResult()` method use the following code:

        myMock.getResult.assert_called()

    In this case, there is no output because `getResult()` has been called using `print(myMock.getResult())` in the previous step. If the code hadn't called `getResult()`, then you’d see an `AssertionError`.

1. Create an `AssertionError` condition using the following code:

        print(myMock.getResult())
        myMock.getResult.assert_called_once()

    Depending on how you have your system set up, you may see different details for the `AssertionError`. The output below displays the basic `AssertionError` you can expect.

    {{< output >}}
Traceback (most recent call last):
    File "<stdin>", line 1, in <module>
    File "C:\Users\John\anaconda3\lib\unittest\mock.py", line 892, in assert_called_once
    raise AssertionError(msg)
AssertionError: Expected 'getResult' to have been called once. Called 2 times.
Calls: [call(), call()].
    {{</ output >}}

1. The mock can also test for calls with specific values. For example, `setResult()` may require two inputs of specific values. Use the code below to view the result of a successful test:

        myMock.setResult(1, 2)
        myMock.setResult.assert_called_with(1, 2)

    This code succeeds because `setResult()` has been called with input values of `1` and `2` (in that order). The order is important. If you instead used `myMock.setResult.assert_called_with(2, 1)`, the output raises an `AssertionError` similar to the following:

    {{< output >}}
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "C:\Users\John\anaconda3\lib\unittest\mock.py", line 913, in assert_called_with
    raise AssertionError(_error_message()) from cause
AssertionError: expected call not found.
Expected: setResult(2, 1)
Actual: setResult(1, 2)
    {{</ output >}}

    You can test inputs very specifically to ensure your code is doing precisely what it should do. There is also a call to verify that `setResult()` has only been called once with the specific values you provide using `myMock.setResult.assert_called_once_with(1, 2)`. The `unittest.mock` object comes with many assertion tests you can perform.

1. You may need to configure a mock to return a specific value. In this case, you expect that `setResult(1,1)` will provide a `getResult()` return value of `3`, but it currently doesn't do so. Use the following code to provide the required output value:

        myMock.getResult.return_value = 3
        print(myMock.getResult())

    When you run the code, there is an output value of `3`. If you change the input values using `setResult()`, the `getResult()` output does not change. This sort of consistency is not helpful in a production application. However, it’s quite helpful during testing because you can be certain that `getResult()` always returns `3` until you choose to change it.

### Using Mock Statistics

When an application is too complex to perform a step-by-step analysis of every mocked call, use mock statistics to determine the application's health. The steps in this section show you how mock object statistics work. This section relies on the `myMock` object you created in the [Instantiate a New Mock Object](/docs/guides/mock-testing-using-the-python-unittest-library/#instantiate-a-new-mock-object) section.

One of the most helpful statistics is the number of times a particular mock is called. If you expect five calls to a function or object and only get four, there is a problem. Use the code below to see how the `call_count` property works.

        myMock.setResult()
        myMock.getResult()
        print(myMock.call_count)
        print(myMock.setResult.call_count)
        print(myMock.getResult.call_count)

    The outputs show the actual number of times that the code called each of the entries. Because you likely haven't called `myMock` by itself, `myMock.call_count` returns `0`. You see values for `myMock.setResult` and `myMock.getResult`.

Sometimes you need to know how a method is called. For example, with `myMock.setResult()`, you need to know, not only how often it is called, but with what arguments. You have two options: request just the latest call information using `call_args` or request all of the call information using `call_args_list`. You can use both as shown below:

        print(myMock.setResult.call_args)
        print(myMock.setResult.call_args_list)

To find out how the mock is called and in what order the calls arrived, the `method_calls` property helps you obtain this information:

    print(myMock.method_calls)

The output from this call shows a list of method calls in the order in which they appear similar to the following:

{{< output >}}
[call.setResult(1, 2),
 call.getResult(),
 call.getResult(),
 call.setResult(1, 2),
 call.getResult(),
 call.setResult(),
 call.getResult(),
 call.setResult(),
 call.getResult(),
 call.setResult(),
 call.getResult()]
{{</ output >}}

### The MagicMock Object

The `MagicMock` object is a subset of the `Mock` object. It provides reasonable values, such as the return value for common method calls that frequently appear in Python. Below are the method calls and their default results.

- `__lt__`: `NotImplemented`
- `__gt__`: `NotImplemented`
- `__le__`: `NotImplemented`
- `__ge__`: `NotImplemented`
- `__int__`: `1`
- `__contains__`: `False`
- `__len__`: `0`
- `__iter__`: `iter([])`
- `__exit__`: `False`
- `__aexit__`: `False`
- `__complex__`: `1j`
- `__float__`: `1.0`
- `__bool__`: `True`
- `__index__`: `1`
- `__hash__`: default hash for the mock
- `__str__`: default string for the mock
- `__sizeof__`: default `sizeof` for the mock

Using a `MagicMock` requires additional setup, but it saves you quite a bit of time. The steps below show you the basic usage of a `MagicMock`object.

1. Before you can do anything, you need to instantiate a new `MagicMock` object, as shown below:

        from unittest.mock import MagicMock, patch
        myMagicMock = MagicMock()

1. The `MagicMock` object, `myMagicMock` has specific preset values. Use the code below to view the values from the list created by the `MagicMock` object:

        import sys
        print(len(myMagicMock))
        print(myMagicMock == 3)
        print(sys.getsizeof(myMagicMock))

    When you run this code, you see the following output values:

    {{< output >}}
0
False
48
    {{</ output >}}

1. A `MagicMock` is not helpful if you cannot change the values that it outputs to meet specific needs. Run the code below to assign and view custom return values for your `myMagicMock` object:

        myMagicMock.__len__.return_value = 15
        myMagicMock.__eq__.return_value = True
        myMagicMock.__sizeof__.return_value = 55

        print(len(myMagicMock))
        print(myMagicMock == 3)
        print(sys.getsizeof(myMagicMock))

    The output shows one oddity in the setting of values, the `__sizeof__` value is always `16` more than what you set it. This means you must compensate in your testing code:

        15
        True
        71

1. There are two ways to set up `__iter__`. Initially, `__iter__` returns a blank list although you can set it as you would any other value. The manner in which you configure `__iter__` makes a difference as shown in the code below:

        print(list(myMagicMock))
        myMagicMock.__iter__.return_value = [1, 2, 3, 4]
        print(list(myMagicMock))
        print(list(myMagicMock))

        myMagicMock.__iter__.return_value = iter([1, 2, 3, 4])
        print(list(myMagicMock))
        print(list(myMagicMock))

    The first case uses a standard list, which remains intact after each call. When you use `iter([1, 2, 3, 4])` instead, the data is consumed after first use as shown in the output.

        []
        [1, 2, 3, 4]
        [1, 2, 3, 4]
        [1, 2, 3, 4]
        []

    MagicMock also supports the attributes in the list below. However, MagicMock does not configure these attributes with default values.

- `__delete__`
- `__dir__`
- `__format__`
- `__get__`
- `__getformat__`
- `__getinitargs__`
- `__getnewargs__`
- `__getstate__`
- `__missing__`
- `__reduce__`
- `__reduce_ex__`
- `__reversed__`
- `__set__`
- `__setformat__`
- `__setstate__`
- `__subclasses__`

### The Python Mock Library’s patch() Decorator

A Python mock patch provides a replacement for a real object. This gives you control over the scope in which the real object is mocked. Once the real object exists in the required scope, the patch no longer provides a replacement and cleanup is automatic. There are two forms of the `patch()` method: *decorator* and *context manager*.

They both accomplish the same thing; they replace an object with a mock. This section provides a method of working with the decorator form of `patch()`. The following steps show you a basic usage of `patch()`. The example below highlights the basic usage of a patch when testing.

1. The first thing you need is an object to patch. Create a file named `AClass.py` and add the following code:

    {{< file "AClass.py" >}}
class MyClass(object):
    def Hello(self):
        print("Hello There!")
    {{</ file >}}

1. Now you need some code that uses `MyClass.Hello()`. Create another file named `UseMyClass.py` and add the following code:

    {{< file "UseMyClass.py" >}}
from AClass import MyClass

def SayHello():
    MyClass().Hello()

#SayHello()
    {{</ file >}}

    The call to `SayHello()` in the last line is commented out, so you can see that the `SayHello()` method actually does access `MyClass.Hello()`. To run the code in the file, from the command line use the following command:

        python UseMyClass.py

1. Create a third file named `TestUseMyClass.py` with the test code as shown below:

    {{< file "TestUseMyClass.py" >}}
import unittest
from mock import patch, MagicMock
from UseMyClass import SayHello

class TestAClass(unittest.TestCase):
    @patch("UseMyClass.MyClass.Hello")
    def test_output(self, mockHello):
        print("Using Mock")
        self.assertFalse(mockHello.called)
        SayHello()
        self.assertTrue(mockHello.called)
        self.assertEqual(mockHello.call_count, 1)
        self.assertIsInstance(mockHello, MagicMock)
        print("Mock Test Successful")

if __name__ == '__main__':
    unittest.main()
    {{</ file >}}

You need to import the `unittest` functionality to perform the test. The `mock` package provides the ability to use the `patch()` decorator, and `MagicMock` as an object replacement. You also need access to the file under test (not the class file, but the file that is actually using the object). To use `@patch()` you need to specify the following:

- the name of the file, `UseMyClass`
- the name of the class,`MyClass`
- the name of the method, `Hello`

It’s important to pass this information as a string so that your error message contains information that can help you identify the source of the error.

In order to use a mock (`mockHello` in this case), provide a parameter for it as part of the call to the test method. This example actually demonstrates that you’re using a `MagicMock` as a replacement for `MyClass.Hello()` by making various assertions. So, until you actually call `SayHello()`, `mockHello` hasn’t been called to replace it. Once you do call `SayHello()` in the code, you can begin using the various `MagicMock` features to determine how the mocking functionality performed.

The code provides two print statements to ensure that the code has run as expected. A successful run doesn't output any information except a success message. The success message may not contain as much information as you may need for debugging. The last two lines of code in the `TestUseMyClass.py` file starts the testing process. There are several methods to start a test. One such method is shown below:

At the command line type `python TestUseMyClass.py` and press **Enter**. The test output is shown below:

{{< output >}}
Using Mock
Mock Test Successful
.
----------------------------------------------------------------------
Ran 1 test in 0.002s

OK

    {{</ output >}}

## Conclusion

Mocking makes it possible for you to test your application as you develop it, which reduces technical debt and development costs. While stubbing and faking have their places in your test toolkit, mocking is significantly more flexible than other methodologies. Mocking can greatly reduce the cleanup time for your test suite later. Using the `patch()` decorator in a separate file, as shown in the previous section, eliminates the need for code cleanup later. This is especially the case when working with complex applications.



