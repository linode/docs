---
slug: mock-testing-python-unittest-library
author:
  name: John Mueller
  email: docs@linode.com
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-10-26
modified_by:
  name: Linode
title: "Mock Testing Using the Python Unittest Library"
h1_title: "An Introduction to Mock Testing Using the Python Unittest Library"
enable_h1: true
contributor:
  name: John Mueller
  link: Github/Twitter Link
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

The Python unittest library helps you test your application code for errors in an automated way. It’s one of the methods [An Overview of Python Testing Frameworks for Unit Testing](/docs/guides/python-testing-frameworks-for-software-unit-testing/#unittest-python-testing-framework-example) guide discusses. *Mock* testing is especially useful as your development progresses and while you're code is yet to be completed. This guide focuses on using the unittest library for mocking. Mock testing performs continuous testing during development and provides good insights into how an application might ultimately function. This guide shows you how to work with the Python unittest library to create mock objects to test your code.

## What is the Purpose of Mock Objects in Unit Testing?

Application and unit testing both require detailed examination of how the code works in various situations. Otherwise, it’s impossible to predict how an application or the units it contains could fail during use. Developers use a number of approaches to perform testing, but the three most popular are the following:

- **Mocking**: This method is useful when the *system under test* (SUT) provides enough functionality where you can set values and track methods that are called in your code. With Mocking, a result is generated using the shortest means possible in a flexible manner that can be tightly or loosely coupled with the data. It’s possible to perform assertions against mocks. Mocks are generally used to understand the behavior of an application as it takes shape. It also provides a level of monitoring that stubbing and fakes can’t provide. The main cost of mocking is added complexity.

- **Stubbing**: Use stubbing when the SUT can provide a response to queries to show that specific features work. The data is hard coded as part of the stub, so the data is tightly coupled. The result mimics what the application is expected to do within limits, and it’s possible to provide some control through input values. Stubs are generally used to test overall unit or application useability to ensure that issues like connectivity are addressed. Many developers use stubbing to test paths through an application or unit.

- **Fakes**: When the SUT provides a canned response to queries that may or may not match what the application eventually outputs, fakes are a good option to test your application. The output is fixed, so that it’s not possible to test any sort of logic or unit behavior. Fakes allow testing of overall unit functionality. Fakes also provide a method to abstract out any functionality that isn’t under development yet, or may not be accessible from the test environment. For example, instead of connecting to a database on a server, the fake may depend on an in-memory database instead.

Most developers use specialized frameworks, such as the unittest library, to create mocks and stubs. Fakes are generally coded without the help of a library or a framework.

In mock testing, the unit test relies on a mock object. This mock object is designed to accept the same type of input parameters as the object it is testing. It should also have the same return type as the object its testing. A Python mock patch is a declaration (in the form of a decorator) that stands in for the real function until the real function is available. When the function is available, the patch is undone. Mocks are used in the following scenarios:

- It’s not possible to connect to an API on a server that will eventually exist, but doesn’t exist now.

- There is a need to provide predictable behavior that can’t be counted on when working with third party services.

- You need a controlled environment where it’s possible to simulate various types of outages, unpredictable behavior, and errors.

- The application requires access to data, but can’t access real data on another server (perhaps a test server with limited data is set up in the testing environment instead).

- There is a need for microservice support that doesn’t currently exist.

- The unit or application will eventually interact with third parties, but access to those third parties is currently unavailable.

- Resources needed by the unit or application are currently unavailable.

- The unit or application needs to output data and receive a realistic (albeit potentially incorrect) response for testing purposes.

- Testing of coded areas that will rarely see use in the production environment because they’re exceptional in nature or simply cover contingencies with a low probability of occurrence.



