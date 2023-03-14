---
slug: what-is-unit-testing
description: "earn what unit testing is, why it's important, and why you should be doing it if you aren't already."
og_description: "Learn what unit testing is, why it's important, and why you should be doing it if you aren't already."
keywords: ['what is unit testing']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-11
image: UnderstandingUnitTesting.png
modified_by:
  name: Linode
title: "Understanding Unit Testing"
title_meta: "What is Unit Testing?"
authors: ["Martin Heller"]
---

Unit testing exercises each function point in a program to make sure it works. Every application needs to be tested to make sure that it meets specifications – and ideally gives users joy from using it. But there are many kinds of software testing. In quite a few organizations, especially those that follow the [ISTQB Certified Test Foundation Level syllabus](https://astqb.org/certifications/foundation-level-certification/), the major testing phases are:

* Unit testing
* Integration testing
* System testing
* Acceptance testing

Unit testing refers to tests that verify the functionality of a specific section of code in isolation. Depending on the programming language used, the section may be a function, a subroutine, a class, or a method in a class. The point is that the human or automation system is evaluating the behavior of only a single thing – one unit – at a time.

Unit testing is a vital first step in the testing process. Without solid unit testing, bugs uncovered later in the software development life-cycle (SDLC) can be very difficult to trace to their [root cause](https://asq.org/quality-resources/root-cause-analysis). Unit testing gives a software developer confidence that the function point under development is doing its job correctly, and makes [refactoring](https://refactoring.com/) much less nerve-wracking.

These tests are often written by the person who created the code to be tested, under the assumption that the developer understands the code's purpose and its behavior. Some techniques for testing code in isolation, especially before the code is complete, include calling [method stubs](https://en.wikipedia.org/wiki/Method_stub), using [mock objects](https://www.agilealliance.org/glossary/mocks/), calling [fakes](https://martinfowler.com/articles/mocksArentStubs.html), and running from [test harnesses](https://www.softwaretestinghelp.com/what-is-test-harness/) or with [testing frameworks](https://en.wikipedia.org/wiki/Test\_automation).

Unit tests are valuable in many contexts. In test-driven development (TDD), the developer writes unit tests before writing the code, with the intention of using the tests to define when the code works.

In other software development styles, the tests can be written at any time, by any developer or tester. Unit tests are often folded into regression test suites later in the development cycle, to maintain quality from version to version of the software.

The unit testing phase sometimes includes running static code analysis, dataflow analysis, metrics analysis, and code coverage analysis. These steps are often followed by a code review cycle.

Unit testing frameworks can simplify the process of writing and running unit tests. Among the common frameworks are [SUnit](https://en.wikipedia.org/wiki/SUnit) (for Smalltalk, 1998), [Junit](https://junit.org) (for Java, 2002), and [NUnit](https://nunit.org/) (for .NET, not long after JUnit), referred to collectively as xUnit. These divide the tests into fixtures (setup and teardown), suites (tests requiring a common fixture), assertions (the conditions that must be met for a test to succeed), a runner (driving all tests), and a result formatter (typically producing XML).

Some languages, such as [Go](/docs/guides/development/go/), [Python](/docs/guides/development/python/), [Ruby](/docs/guides/development/ror/), and Rust, directly support unit testing. Other languages, such as C++, Objective-C, Scala, and the languages supported by xUnit, rely on third-party unit-testing libraries or frameworks.

Parameterized tests can eliminate a lot of the repetitive code bloat of single-purpose unit tests while maintaining code coverage, and xUnit supports parameterized tests. You can supply the parameters for tests manually; sometimes the test framework can generate test parameters automatically.