---
slug: what-is-static-code-analysis
description: 'This guide provides you with an overview of stack code analysis, a method of testing code that helps prevents bugs in your code during your development process.'
keywords: ['what is static code analysis']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-24
image: StaticCodeAnalysis.png
modified_by:
  name: Linode
title: "What is Static Code Analysis?"
tags: ["automation"]
authors: ["Martin Heller"]
---

*Static code analysis*, also called *static program analysis*, looks at an application’s source code and issues warnings about potential bugs. This is different from -- and complementary to -- [dynamic analysis](https://en.wikipedia.org/wiki/Dynamic_program_analysis), which examines the behavior of a program while it is running. Static code analysis can sometimes find bugs that are overlooked in human code reviews and aren’t caught by a compiler’s grammar and error checking.

This type of code analysis is generally performed by a tool, which may be either a standalone utility or one integrated with another program. It can be a part of your integrated development environment or a compiler. Some static code analysis tools look at code units in isolation and apply rules; others take a more holistic view of the code.

Historically, developers run static code analysis in an exploratory way as part of their local software development workflow. This assists developers when debugging and testing, and before checking their code into source code control.

## How Does Static Code Analysis Fit into DevOps and CI/CD?

If you want static code analysis to help you with DevOps and [CI/CD](/docs/guides/introduction-ci-cd/), you need to run it in your centralized build process. To do so, define the code analysis rules you care about as *severity 1*, also known as errors or bugs. Then configure the build server to halt any builds with severity 1 errors. Running static code analysis in the centralized build process guarantees that any checked-in code that is promoted to test, staging, or production environments is tested for common coding errors. Developers should also run the code analysis themselves in their local environment prior to pushing their code through their CI/CD pipeline.

## Static Code Analysis Tools

The original static code analysis tool was [*lint*](https://en.wikipedia.org/wiki/Lint_(software)). This tool, introduced in 1978 by Stephen C. Johnson of Bell Labs, found any programming or stylistic errors or bugs within C programs. Johnson wrote lint to help him debug [*Yacc*](https://en.wikipedia.org/wiki/Yacc) grammar and deal with portability issues when he ported Unix from a 16-bit machine to a 32-bit machine.

Currently, there are [dozens of static code analysis tools](https://en.wikipedia.org/wiki/List_of_tools_for_static_code_analysis). Some are single-programming-language code checkers; others support multiple programming languages. Some of these tools couple code checkers with other functionality, such as calculating [cyclomatic complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity) and other software metrics. These tools sometimes also perform dependency analysis. One popular JavaScript linter is [ESLint](https://eslint.org/). You can also take a look at the [GitHub Actions Marketplace](https://github.com/marketplace/category/code-quality) to find apps and actions that help you integrate static code analysis into your CI/CD pipeline.

### Example of Static Code Analysis with ESLint

Once you have [installed ESLint](https://eslint.org/docs/user-guide/getting-started#installation-and-usage) and initialized it in your JavaScript projects root directory, your `.eslintrc.{js,yml,json}` configuration file contains the configuration line in the example file. This setting enables ESLint to check for an [extensive list of common syntax or logic errors](https://eslint.org/docs/rules/) found in JavaScript code:

{{< file ".eslintrc.json">}}
{
    "extends": "eslint:recommended"
}
{{</ file >}}

One of the rules that is automatically enabled by the above configuration is the `for-direction` rule. This logic rule ensures the counter controlling a `for` loop is incrementing in the "right direction". For example, a `for` loop with a stop condition that can never be reached, runs infinitely. While there are occasions when an infinite loop is intended, the convention is to construct such loops as a `while` loop. More typically, an infinite `for` loop is a considered a bug.

The following code snippet shows two simple examples of infinite `for` loops:

{{< file >}}
//eslint for-direction: "error"

for (var i = 0; i < 10; i--) {
...
}

for (var i = 10; i >= 0; i++) {
...
}
{{</ file >}}

On the other hand, a correct `for` loop, resembles the following:

{{< file >}}

for (var i = 0; i < 10; i++) {
...
}
{{</ file >}}

ESLint, like many other static code analysis tools, help you find common errors, like an infinite for loops. This ultimately helps you prevent bugs in your code and maintain clean and consistent code.
