---
slug: what-is-code-coverage-analysis
description: 'This guide provides you with an overview of code coverage analysis, a method of exposing untested code which provides a metric that your QA team can use to improve.'
keywords: ['code coverage analysis']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-15
image: CodeCoverageAnalysis.png
modified_by:
  name: Linode
title: "What is Code Coverage Analysis?"
tags: ["automation"]
authors: ["Martin Heller"]
---
Code coverage is typically part of the [unit testing](/docs/guides/what-is-unit-testing/) phase of the software development lifecycle, although it is often used in other testing phases as well. A code coverage tool watches as the suite of unit tests run; then it reports on which functions, branches, loops, and lines of code have and have not been tested. At the highest level, the reports show the percentage coverage for each category; drilling down often shows untested code.

Code coverage analysis tools usually work by [*instrumenting*](https://en.wikipedia.org/wiki/Instrumentation_(computer_programming)) the code being monitored. Instrumentation adds statements to your code to monitor the code execution. Depending on the source language and the tool, the instrumentation can be via source code injection or executable binary instrumentation.

Test coverage analysis is a supplement to code coverage analysis; it reports whether the test cases cover all of the functional requirements. Because test coverage is qualitative, it is usually a manual process. Test coverage analysis often accompanies test-driven development (TDD).

## The Benefits of Code Coverage Analysis

Code coverage analysis exposes untested code. Once you find any untested code, then you have a few options on your team handles the untested code. The team’s response could be to write more tests; to modify existing tests to cover more code branches; or to refactor the code to make it simpler and more testable.

Code coverage analysis provides a metric – percent coverage – that can guide your software QA process. At a high level, repeated code coverage analysis can help your team deliver better products faster, reduce bugs, and simplify QA processes and compliance audits.

## Common Tools

The choice of code coverage tools depends strongly on the programming language, operating system, and unit testing framework that your team uses. For example, [Visual Studio Enterprise](https://visualstudio.microsoft.com/vs/enterprise/) has a code coverage tool integrated with the IDE and has code coverage and unit testing for all its supported languages. It also supports some third-party and open source unit testing frameworks, such as [NUnit](https://marketplace.visualstudio.com/items?itemName=NUnitDevelopers.NUnit3TestAdapter).

[Parasoft](https://www.parasoft.com/) produces commercial testing tools for Java, C/C++, and C#. They all include code coverage and unit testing, as well as static analysis and security testing. [JetBrains](https://www.jetbrains.com/) has its own coverage tool for C# called [dotCover](https://www.jetbrains.com/help/dotcover/Running_Coverage_Analysis_from_the_Command_LIne.html). This tool integrates with Visual Studio, [ReSharper](https://www.jetbrains.com/resharper/), and the CI environment, [TeamCity](https://www.jetbrains.com/teamcity/).

The [Go language](/docs/guides/beginners-guide-to-go/) has its own [code coverage tool](https://golang.org/cmd/cover/), integrated with its test tool. If your code is written in Python, you can use [Coverage.py](https://coverage.readthedocs.io/), which is [open source](https://github.com/nedbat/coveragepy/) with an enterprise support option. There are many JavaScript code coverage tools, like [Istanbul](https://istanbul.js.org/) and [Blanket](https://www.npmjs.com/package/blanket).

