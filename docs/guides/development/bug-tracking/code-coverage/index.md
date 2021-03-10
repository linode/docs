---
slug: code-coverage
author:
  name: Martin Heller
  email: martin.heller@gmail.com
description: 'You can’t find bugs you didn’t know were there. Code coverage exposes untested code, so development teams can find the defects they hadn’t yet looked for.'
og_description: 'You can’t find bugs you didn’t know were there. Code coverage exposes untested code, so development teams can find the defects they hadn’t yet looked for.'
keywords: ['code coverage analysis']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-15
modified_by:
  name: Linode
title: "What is Code Coverage Analysis?"
h1_title: "What is Code Coverage Analysis?"
contributor:
  name: Martin Heller
  link: https://twitter.com/meheller
---

Code coverage is typically part of the [unit testing](/docs/guides/what-is-unit-testing/) phase of the software development lifecycle, although it is often used in other testing phases as well. A code coverage tool watches as the suite of unit tests run; then it reports on which functions, branches, loops, and lines of code have and have not been tested. At the highest level, the reports show the percentage coverage for each category; drilling down often shows untested code.

Code coverage analysis tools usually work by [*instrumenting*](https://en.wikipedia.org/wiki/Instrumentation_(computer_programming)) the code being monitored. Instrumentation adds statements to your code to monitor the code execution. Depending on the source language and the tool, the instrumentation can be via source code injection or executable binary instrumentation.

Test coverage analysis is a supplement to code coverage analysis; it reports whether the test cases cover all of the functional requirements. Because test coverage is qualitative, it is usually a manual process. Test coverage analysis often accompanies test-driven development (TDD).

## Code Coverage Analysis’s benefits

Code coverage analysis exposes untested code. Then it’s a matter of deciding what to do with it. The team’s response to untested code could be to write more tests; to modify existing tests to cover more code branches; or to refactor the code to make it simpler and more testable.

Code coverage analysis provides a metric – percent coverage – that can guide a software QA process. At a high level, repeated code coverage analysis may increase product quality, enhance customer satisfaction, and simplify QA processes and compliance audits. It may also lead to a faster time to market.

## Common tools

The choice of code coverage tools depends strongly on the development team’s programming language and operating system, and may also depend on its choice of unit testing framework. For example, Visual Studio Enterprise has a code coverage tool integrated with the IDE, which makes it suitable for C/C++ on Windows. In fact, Visual Studio Enterprise has code coverage and unit testing for all its supported languages, and also supports some third-party and open source unit testing frameworks, such as NUnit.

Parasoft produces commercial testing tools for Java, C/C++, and C\#. They all include code coverage and unit testing, as well as static analysis and security testing. JetBrains has its own coverage tool for C\#, dotCover, which integrates with Visual Studio, ReSharper, and CI environment TeamCity.

The [Go language](https://www.linode.com/docs/guides/beginners-guide-to-go/) has its own code coverage tool, integrated with its test tool. For Python, [Coverage.py](https://coverage.readthedocs.io/) is [open source](https://github.com/nedbat/coveragepy/) with an Enterprise support option. There are many JavaScript code coverage tools.

There are several open source code coverage tools for Java. Be careful when you evaluate them, however; not all of these tools are still actively maintained, and so not all of them work with the latest Java releases. Similarly, there are [many JavaScript code coverage tools](https://openbase.com/categories/js/best-javascript-test-coverage-libraries?orderBy=RECOMMENDED&), not all of which are still actively maintained.
