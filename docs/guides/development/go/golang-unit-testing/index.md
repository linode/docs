---
slug: golang-unit-testing
author:
  name: Linode Community
  email: docs@linode.com
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-02
modified_by:
  name: Linode
title: "Golang Testing: Unit Testing Your Go Applications"
h1_title: "Golang Testing: Unit Testing Your Go Applications"
enable_h1: true
contributor:
  name: Your Name
  link: Github/Twitter Link
---

Unit testing verifies the functionality of a specific section of code in isolation. In the Go language, `go test` is the built-in command that runs unit tests, example functions, and benchmarks; does code profiling; and performs code coverage analysis. This guide focuses on unit testing in Go.

## Go Test Built-in Commands

The `go test` command automates testing the packages named by import paths. The syntax used to run your Go tests is as follows:

    go test [build/test flags] [packages] [build/test flags & test binary flags]

Running your tests prints a summary of the test results similar to the following:

    {{< output >}}
ok   archive/tar   0.011s
FAIL archive/zip   0.022s
ok   compress/gzip 0.033s
...
    {{</ output >}}

A detailed output is provided for any check that fails.

`go test` recompiles each package along with any files with names matching the file pattern `*_test.go`. These additional files can contain test functions, benchmark functions, and example functions. See `go help testfunc` for more. Each listed package causes the execution of a separate test binary. Files whose names begin with `_` (including `_test.go`) or `.` are ignored.

Test files that declare a package with the suffix "_test" arewill be compiled as a separate package, and then linked and run with the main test binary.