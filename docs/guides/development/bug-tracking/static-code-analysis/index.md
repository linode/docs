---
slug: static-code-analysis
author:
  name: Martin Heller
  email: martin.heller@gmail.com
description: 'You can find potential bugs by letting a tool examine your source code. It's also useful for CI/CD build processes.'
og_description: 'You can find potential bugs by letting a tool examine your source code. Running static code analysis in the centralized build process guarantees that checked-in code has been checked for common coding errors.'
keywords: ['what is static code analysis']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-24
modified_by:
  name: Linode
title: "What is Static Code Analysis?"
h1_title: "What is Static Code Analysis?"
contributor:
  name: Martin Heller
  link: https://twitter.com/meheller
---

# What is Static Code Analysis?

By letting a tool examine your source code, you can find potential bugs in your programs.

Static code analysis, also called static program analysis, looks at an application’s source code and issues warnings about potential bugs. This is different from -- and complementary to -- [dynamic analysis](https://en.wikipedia.org/wiki/Dynamic_program_analysis), which examines the behavior of a program while it is running. Static code analysis can sometimes find bugs that are overlooked in human code reviews and aren’t caught by a compiler’s grammar and error checking.

Static code analysis is generally performed by a tool, which may be either a standalone utility or one integrated with another program, such as a development environment or compiler. Some static code analysis tools look at code units in isolation and apply rules; others take a more holistic view of the code.

Historically, developers ran static code analysis in an exploratory way as part of their local software development workflow to assist in debugging and testing, before they check their code into source code control.

## How does static code analysis fit into DevOps and CI/CD?

If you want static code analysis to help you with DevOps and [CI/CD](https://www.linode.com/docs/guides/introduction-ci-cd/), you need to run it in your centralized build process. To do so, define the code analysis rules you care about as Severity 1, also known as errors or bugs. Then configure the build server to halt any builds with Severity 1 errors.

That doesn’t mean that developers shouldn’t run static code analysis themselves. They should. However, running static code analysis in the centralized build process guarantees that any checked-in code that is promoted to test, staging, or production environments is checked for common coding errors.

## Static code analysis tools

The original static code analysis tool was `lint`, which “picks the fluff” from C programs and was introduced in 1978 by Stephen C. Johnson of Bell Labs. Johnson wrote `lint` to help him debug a `yacc` grammar and deal with portability issues when he ported Unix from a 16-bit machine to a 32-bit machine. The first rule for using `lint` is “Don’t shoot the messenger,” which refers to the program’s typically voluminous output.

Currently, there are [dozens of static code analysis tools](https://en.wikipedia.org/wiki/List_of_tools_for_static_code_analysis). Some are single-programming-language code checkers; others support multiple programming languages. Some of these tools couple code checkers with other functionality, such as calculating cyclomatic complexity and other software metrics, or performing dependency analysis.

## Example of static code analysis

Need a for-instance? Here is an example of a [JavaScript coding rule](https://eslint.org/docs/rules/) from [ESLint](https://eslint.org/). It helps to detect potential infinite `for` loops.

### Enforce "for" loop update clause moving the counter in the right direction. (for-direction)

The `"extends": "eslint:recommended"` property in a configuration file enables this rule.

### Rule Details

A `for` loop with a stop condition that can never be reached, such as one with a counter that moves in the wrong direction, runs infinitely. While there are occasions when an infinite loop is intended, the convention is to construct such loops as `while` loops. More typically, an infinite for loop is a bug.

#### Examples of incorrect code for this rule:

```
/*eslint for-direction: "error"*/
for (var i = 0; i < 10; i--) {
}

for (var i = 10; i >= 0; i++) {
}
```
#### Examples of correct code for this rule:

```
/*eslint for-direction: "error"*/
for (var i = 0; i < 10; i++) {
}
```
