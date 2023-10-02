---
slug: golang-unit-testing
description: 'This guide provides an introduction to unit testing in the Go programming language. It also provides an example unit test from the Go testing package documentation.'
keywords: ['golang testing']
tags: ['web applications']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-12-03
modified_by:
  name: Linode
title: "An Introduction to Golang Unit Testing"
title_meta: "Golang Testing: Unit Testing Go Applications"
authors: ["Martin Heller"]
---

Unit testing verifies the functionality of a specific section of code in isolation. In the Go language, `go test` is the built-in command that runs unit tests, example functions, and benchmarks; does code profiling, and performs code coverage analysis. This guide provides an introduction to unit testing in Go.

## Go Test Built-in Commands

The `go test` command automates testing packages named by import paths. The syntax used to run Go tests is as follows:

    go test [build/test flags] [packages] [build/test flags & test binary flags]

Running your tests prints a summary of the test results as shown below:

{{< output >}}
ok   archive/tar   0.011s
FAIL archive/zip   0.022s
ok   compress/gzip 0.033s
...
    {{</ output >}}

A detailed output is provided for any check that fails.

`go test` recompiles each package and any files with names matching the file pattern `*_test.go`. These additional files can contain test functions, benchmark functions, and example functions. Each listed package causes the execution of a separate test binary. Files whose names begin with and underscore (`_`) (including `_test.go`) or a dot (`.`) are ignored.

Test files that declare a package with the suffix `_test` are compiled as a separate package. They are then linked and run with the main test binary. Go's built-in test runner ignores a directory named `testdata`, making it available to store ancillary data needed by the tests.

As part of building a test binary, `go test` runs `go vet` on the package and its test source files to identify significant problems. If `go vet` finds any problems, `go test` reports those and does not run the test binary. Only a high-confidence subset of the default `go vet` checks are used. The subset of checks are: `atomic`, `bool`, `buildtags`, `errorsas`, `ifaceassert`, `nilfunc`, `printf`, and `stringintconv`. You can view the documentation for these and other vet tests by issuing the `go doc cmd/vet` command. To disable the running of `go vet`, use the `-vet=off` flag.

All test output and summary lines are printed to Go's standard output. Go's standard error is reserved for printing errors while building the tests.

## Go Test Modes

`go test` runs in two different modes. The first, called *local directory mode*, occurs when `go test` is invoked with no package arguments. In this mode, `go test` compiles the package sources and tests found in the current directory and then, runs the resulting test binary. [Caching](/docs/guides/golang-unit-testing/#go-test-caching) is also disabled in this mode. After the package test finishes, `go test` prints a summary line showing the test status (`ok` or `FAIL`), package name, and elapsed time.

The second mode, called *package list mode*, occurs when `go test` is invoked with explicit package arguments. For example, the following commands trigger package list mode: `go test math`, `go test ./...`, and `go test .`. In this mode, `go test` compiles and tests each of the packages listed on the command line. When a package test passes, `go test` prints only the final `ok` summary line. When a package test fails, `go test` prints the full test output. When invoked with the `-bench` or `-v` flag, `go test` prints the full output even for package tests that pass. This is done in order to display the requested benchmark results or verbose logging. When all listed package tests finish, and their output is printed, `go test` prints a final `FAIL` status if any package test has failed.

## Go Test Caching

In package list mode, `go test` only caches successful package test results to avoid rerunning tests that have already passed. When the result of a test can be recovered from the cache, `go test` displays the previous output instead of running the test binary again. When this happens, `go test` prints `(cached)` in place of the elapsed time in the summary line.

In order for `go test` to use a cached test result, the run must involve the same test binary and the command-line flags must come from a restricted set of *cacheable* test flags. The restricted set of command-line flags include `-cpu`, `-list`, `-parallel`, `-run`, `-short`, and `-v`. When a run of `go test` has any test or non-test flags outside this set, the result is not cached. To disable test caching, use any test flag or argument other than the cacheable flags. The idiomatic way to disable test caching explicitly is to use `-count=1`. Tests that rely on environment variables are only cacheable if the environment variables remain unchanged. Similarly, tests that open files  within the package's source root, are cached only if the opened files remain unchanged. A successful package test result is cached and reused regardless of the `-timeout` setting.

## Go Test Command-Line Flags

In addition to the build flags, some additional `go test` flags are the following:

- `-args`: Pass the remainder of the command line (everything after `-args`) to the test binary, uninterpreted and unchanged. Because this flag consumes the remainder of the command line, the package list (if present) must appear before this flag.

- `-c` : Compile the test binary to `pkg.test`, but do not run it (where `pkg` is the last element of the package's import path). The filename can be changed with the `-o` flag.

- `-exec`: Run the test binary using `xprog`. The behavior is the same as in `go run`. See `go help run` for details.

- `-i`: Install packages that are dependencies of the test. Do not run the test. The `-i` flag is deprecated. Compiled packages are cached automatically.

- `-json`: Convert test output to JSON suitable for automated processing. See `go doc test2json` for the encoding details.

- `-o file`: Compile the test binary to the named file. The test still runs (unless `-c` or `-i` is specified).

For more information about build flags, run the `go help build` command. To access information about specifying packages, run the `go help packages` command.

## Go Package Testing

The standard Go language [testing package](https://golang.org/pkg/testing/) provides support for automated testing of Go code. It is intended to be used with the `go test` command. As with everything else in the Golang, the testing package design is driven by a minimalist philosophy. For example, test result comparisons using the testing package are implemented by writing ordinary Go code with comparison operators. This is in contrast to using assertions as you would in JUnit or NUnit.

The following example test function is included in the testing package documentation. It’s not testable as given (it requires a matching `Abs()` function for integers), but it demonstrates the syntax required.

{{< file "example.go" go>}}
import "testing"

func TestAbs(t *testing.T) {
    got := Abs(-1)
    if got != 1 {
        t.Errorf("Abs(-1) = %d; want 1", got)
    }
}
{{</ file >}}

Go test functions can easily be extended to perform table-driven tests to cover many cases. This is done from a single function with the help of a `for` loop. You can also take advantage of [Go interfaces](https://gobyexample.com/interfaces) and functional programming to implement mocks.

In general, the *Go way* is to rely on the built-in functionality of the language as much as possible. In practice, writing tests in the basic testing package can be somewhat repetitive. Writing tests in this way is also different from tests written in other programming languages. If you find this is the case for you, there are several third-party Golang testing frameworks you can use. These include:

- [Testify](https://github.com/stretchr/testify): Assertion and mock helper functions.
- [gocheck](https://labix.org/gocheck): Assertion helper functions.
- [gopwt](https://github.com/ToQoz/gopwt): Power assertion helper functions.
- [go-testdeep](https://github.com/maxatome/go-testdeep): Deep comparison helper functions.
- [Ginkgo](https://github.com/onsi/ginkgo) and [Gomega](https://github.com/onsi/gomega): A heavyweight behavior-driven development (BDD) testing framework and assertion helpers.
- [Goblin](https://github.com/franela/goblin): A Mocha-like BDD testing framework.
- [GoConvey](https://github.com/smartystreets/goconvey): BDD testing framework with web UI.

## Example Unit Test

This section expands on an integer `Abs()` function and the sample unit test from the Go testing package documentation. Start by creating a directory called `abs_test` under your Go source code directory. In the examples below, the `GOPATH` is set to `~/work`, and the directory created for this project is `~/work/src/github.com/meheller/abs_test`.

1. Open a terminal window, change (`cd`) to the directory you created and initialize the project.

    go mod init

    This creates a file named `go.mod`. The file includes content similar to the example below:

    {{< file "go.mod" go>}}
module github.com/meheller/abs_test

go 1.16
    {{</ file >}}

1. Use the `cat` command to print the contents of your `go.mod` file.

1. Create a new `abs.go` file in `abs_test` directory, and insert the following contents:

    {{< file "abs.go" go>}}
package abs

func Abs(x int) (res int) {
    if x >= 0 {
        return x
    }
    return -x
}

    {{</ file >}}

1. Save the file and create another file, `abs_test.go`, in the same directory as the unit tests. Use the single test from the documentation, with a matching package tag added as show below:

    {{< file "abs_test.go" go>}}
package abs

import (
    "testing"
)

func TestAbs(t *testing.T) {
    got := Abs(-1)
    if got != 1 {
        t.Errorf("Abs(-1) = %d; want 1", got)
    }
}
    {{</ file >}}

1. Go back to your terminal and make sure all three files are present.

        ls

    {{< output >}}
abs.go abs_test.go go.mod
    {{</ output >}}

1. Now, run your tests using the following command:

        go test -v

    You should see a similar result:

    {{< output >}}
=== RUN   TestAbs
--- PASS: TestAbs (0.00s)
PASS
ok  	github.com/meheller/abs_test 0.006s
    {{</ output >}}

You can create more tests in the `abs_test.go` file. One useful exercise is to use a table of input values and expected output values. Then, run your tests in a `for` loop to make sure that the function handles all cases properly. `(-1, 0, 1)` is the minimum starting set of inputs. Writing unit tests for all your functions is a best practice. Table-driven tests help you to cover all the cases without copying and pasting a lot of test code.