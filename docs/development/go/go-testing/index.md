---
author:
  name: Mihalis Tsoukalos
  email: mihalistsoukalos@gmail.com
description: 'Testing Go code.'
keywords: ["Go", "Testing", "UNIX", "Golang", "Programming"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-11-08
modified_by:
  name: Linode
title: 'Write Go code for Code Testing'
contributor:
  name: Mihalis Tsoukalos
  link: https://www.mtsoukalos.eu/
external_resources:
  - '[Go](https://golang.org)'
  - '[The Go Playground](https://play.golang.org/)'
  - '[The `testing` package](https://golang.org/pkg/testing/)'
  - '[The `testing/quick` package](https://golang.org/pkg/testing/quick/)'
  - '[The cover story](https://blog.golang.org/cover)'
  - '[Mastering Go, 2nd edition](https://www.packtpub.com/programming/mastering-go-second-edition)'
---

## Introduction

*Code testing* is about making sure that your code does what you want it to do. This guide will discuss *automated testing*, which means **writing extra code** that checks whether the real code works as expected or not. The result of a test function in Go is either `PASS` or `FAIL`.
So, without further ado, let's get started!

## In This Guide

In this guide you will learn how to create testing functions in Go, how to find out the code coverage of your test code, how to use the `testing/quick` package and how to terminate a test that takes too long to finish. All you need to follow this guide is to have Go and your favorite text editor installed on your Linode machine.

## About Testing

Go follows certain conventions regarding testing. First of all, testing functions should be included in Go source files that end with `_test.go`. So, if you have a package named `myPackage.go`, then your tests will be placed in a file named `myPackage_test.go`. A test function should begin with the word `Test` and it should check the correctness of the behavior of a function of the real package. Additionally, Go uses the `go test` command for executing testing code and requires the use of the `testing` package in all `_test.go` files.

Once the testing code is syntactically correct, the `go test` subcommand scans all `*_test.go` files for special functions, generates a proper (temporary) `main` package, calls these special functions, gets the results and generates the final output.

### About Test Functions

All valid testing functions should have the same signature which is `func TestFunction(t *testing.T)`. Although the function name should not be `TestFunction()`, it should begin with `Test`.

{{< note >}}
Software testing can only show the presence of bugs, not the absence of them. This means that you can never be entirely sure that your code is bug free! Sometimes, the best way to test your software is to let users try it.
{{< /note >}}

### Creating Test Functions

We will begin with the code of the following package and we are going to write testing code for it in a while.

{{< file "./myPackage.go" go >}}
package myPackage

func f1(n int) int {
	if n == 0 {
		return 0
	}
	if n == 1 {
		return 1
	}
	return f1(n-1) + f1(n-2)
}

func f2(n int) int {
	if n == 0 {
		return 0
	}
	fn := make(map[int]int)
	for i := 0; i <= n; i++ {
		var f int
		if i <= 2 {
			f = 1
		} else {
			f = fn[i-1] + fn[i-2]
		}
		fn[i] = f
	}
	return fn[n]
}

func s1(s string) int {
	if s == "" {
		return 0
	}
	n := 1
	for range s {
		n++
	}
	return n
}

func s2(s string) int {
	return len(s)
}
{{< /file >}}

The `myPackage` package contains two kinds of functions. Functions `f1()` and `f2()` calculate numbers of the Fibonacci sequence whereas functions `s1()` and `s2()` calculate the length of a string.

Then, we are going to write testing functions for the functions of the aforementioned package. The name of the file with the testing functions will be `myPackage_test.go` – note that creating the package with the test functions does not require any code changes to the package whose functions are being tested.

{{< file "./myPackage_test.go" go >}}
package myPackage

import "testing"

func TestS1(t *testing.T) {
	if s1("123456789") != 9 {
		t.Error(`s1("123456789") != 9`)
	}

	if s1("") != 0 {
		t.Error(`s1("") != 0`)
	}
}

func TestS2(t *testing.T) {
	if s2("123456789") != 9 {
		t.Error(`s2("123456789") != 9`)
	}

	if s2("") != 0 {
		t.Error(`s2("") != 0`)
	}
}

func TestF1(t *testing.T) {
	if f1(0) != 0 {
		t.Error(`f1(0) != 0`)
	}

	if f1(1) != 1 {
		t.Error(`f1(1) != 1`)
	}

	if f1(3) != 2 {
		t.Error(`f1(3) != 2`)
	}

	if f1(10) != 55 {
		t.Error(`f1(10) != 55`)
	}
}

func TestF2(t *testing.T) {
	if f2(0) != 0 {
		t.Error(`f2(0) != 0`)
	}

	if f2(1) != 1 {
		t.Error(`f2(1) != 1`)
	}

	if f2(2) != 1 {
		t.Error(`f2(2) != 1`)
	}

	if f2(10) != 55 {
		t.Error(`f2(10) != 55`)
	}
}

func TestF1F2(t *testing.T) {
	if f1(10) != f2(10) {
		t.Error(`f2(10) != f1(10)`)
	}
}
{{< /file >}}

The test package implements two kinds of tests. The first kind (functions `TestS1()`, `TestS2()`, `TestF1()` and `TestF2()`) is when you test a result against a predefined value whereas the second kind (function `TestF1F2()`) is when you test the results of two functions, which means that the return values are calculated and compared on the fly.

Note that a good improvement for `TestF1F2()` would have been to create a `for` loop inside the function in order to test multiple values.

### Using Testing Functions

In this section, we are going to see the output of the `go test` command when used for testing `myPackage.go`.

    go test myPackage*
{{< output >}}
--- FAIL: TestS1 (0.00s)
    myPackage_test.go:7: s1("123456789") != 9
FAIL
FAIL	command-line-arguments	0.378s
FAIL
{{< /output >}}

This output includes failed tests only and shows that there is something wrong with the implementation of `s1()` – the problem with `s1()` is that the initial value of the `n` variable is `1` instead of `0`.

Using the `-v` with `go test` flag will generate verbose output that will include successful tests as well:

    go test -v myPackage*
{{< output >}}
=== RUN   TestS1
--- FAIL: TestS1 (0.00s)
    myPackage_test.go:7: s1("123456789") != 9
=== RUN   TestS2
--- PASS: TestS2 (0.00s)
=== RUN   TestF1
--- PASS: TestF1 (0.00s)
=== RUN   TestF2
--- PASS: TestF2 (0.00s)
=== RUN   TestF1F2
--- PASS: TestF1F2 (0.00s)
FAIL
FAIL	command-line-arguments	0.287s
FAIL
{{< /output >}}

If you want to run your tests multiple times in succession, you should use the `-count` option:

    go test myPackage* -count 3
{{< output >}}
--- FAIL: TestS1 (0.00s)
    myPackage_test.go:7: s1("123456789") != 9
--- FAIL: TestS1 (0.00s)
    myPackage_test.go:7: s1("123456789") != 9
--- FAIL: TestS1 (0.00s)
    myPackage_test.go:7: s1("123456789") != 9
FAIL
FAIL	command-line-arguments	0.085s
FAIL
{{< /output >}}

Although the `-count` option might not be suitable for numeric calculations, which usually generate the same output for a given input, it might be invaluable when testing TCP/IP services, random number generators or database servers.

Should you wish to execute specific tests, you should use the `-run` command-line option, which accepts a regular expression and executes all tests that have a function name that matches the given regular expression.

## Test Code Coverage

Imagine that you have a Go package and that you want to calculate the code coverage of its tests in order to see whether you have tested all the Go code of the Go package or not. Go can help you with this. We will begin with the following Go package:

{{< file "./coverage.go" go >}}
package codeCover

func fibo1(n int) int {
	if n == 0 {
		return 0
	} else if n == 1 {
		return 1
	} else {
		return fibo1(n-1) + fibo1(n-2)
	}
}

func fibo2(n int) int {
	if n >= 0 {
		return 0
	} else if n == 1 {
		return 1
	} else {
		return fibo1(n-1) + fibo1(n-2)
	}
}
{{< /file >}}

The Go code of the test package, which is named `coverage_test.go`, will be the following:

{{< file "./coverage_test.go" go >}}
package codeCover

import (
	"testing"
)

func TestFibo1(t *testing.T) {
	if fibo1(1) != 1 {
		t.Errorf("Error fibo1(1): %d\n", fibo1(1))
	}
}

func TestFibo2(t *testing.T) {
	if fibo2(0) != 0 {
		t.Errorf("Error fibo2(0): %d\n", fibo1(0))
	}
}

func TestFibo1_5(t *testing.T) {
	if fibo1(5) == 1 {
		t.Errorf("Error fibo1(1): %d\n", fibo1(1))
	}
}

func TestFibo2_5(t *testing.T) {
	if fibo2(5) != 0 {
		t.Errorf("Error fibo2(0): %d\n", fibo1(0))
	}
}
{{< /file >}}

The implemented tests are very simplistic in order to illustrate the code coverage tool.

Testing the code coverage of `coverage.go` requires the use of the `-cover` flag. The output of `go test -cover` will be the following:

    go test coverage* -cover
{{< output >}}
ok  	command-line-arguments	0.085s	coverage: 70.0% of statements
{{< /output >}}

The generated output shows that there is a `70%` code coverage, which means that there might be a problem with the code (*unreachable code*) or that you will need to write more tests to cover all code. If you look closely at `coverage.go`, you will realize that there is an error in the implementation of the `fibo2()` function because it results `0` all the time due to a typo in the code: using `n >= 0` instead of `n == 0` in the `if` statement. This is a logical error that is hard to find because it cannot be caught by the Go compiler.

## What if Testing Takes Too Long

There is a parameter that you can use with `go test` that allows you to limit the amount of time that a test can run. This technique is illustrated using the code of `tooLong.go` and `tooLong_test.go`.

{{< file "./tooLong.go" go >}}
package main

import (
	"time"
)

func sleep_with_me() {
	time.Sleep(10 * time.Second)
}

func get_one() int {
	return 1
}

func get_two() int {
	return 2
}

func main() {

}
{{< /file >}}

Note that in order to make the code slow, we used the `time.Sleep(10 * time.Second)` statement. A real program might be slow because of a slow algorithm, a slow network connection, an endless loop or some other unknown reason.

The Go code for the package with the test code is the following:

{{< file "./tooLong_test.go" go >}}
package main

import (
	"testing"
)

func Test_test_one(t *testing.T) {
	sleep_with_me()
	value := get_one()
	if value != 1 {
		t.Errorf("Function returned %v", value)
	}
	sleep_with_me()
}

func Test_test_two(t *testing.T) {
	sleep_with_me()
	value := get_two()
	if value != 2 {
		t.Errorf("Function returned %v", value)
	}
}

func Test_that_will_fail(t *testing.T) {
	value := get_one()
	if value != 2 {
		t.Errorf("Function returned %v", value)
	}
}
{{< /file >}}

Executing `go test` as usual will generate the following output:

    go test -v tooLong*
{{< output >}}
=== RUN   Test_test_one
--- PASS: Test_test_one (20.01s)
=== RUN   Test_test_two
--- PASS: Test_test_two (10.01s)
=== RUN   Test_that_will_fail
--- FAIL: Test_that_will_fail (0.00s)
    tooLong_test.go:27: Function returned 1
FAIL
FAIL	command-line-arguments	30.354s
FAIL
{{< /output >}}

However, if you add the `-timeout` flag to `go test`, you tell `go test` that it has to take less than the given time, which is provided as an argument. In this case, we want the tests to finish in less than 25 seconds (`25s`).

    go test -v tooLong* -timeout 25s
{{< output >}}
=== RUN   Test_test_one
--- PASS: Test_test_one (20.01s)
=== RUN   Test_test_two
panic: test timed out after 25s

goroutine 5 [running]:
testing.(*M).startAlarm.func1()
	/usr/local/Cellar/go/1.13.4/libexec/src/testing/testing.go:1377 +0xdf
created by time.goFunc
	/usr/local/Cellar/go/1.13.4/libexec/src/time/sleep.go:168 +0x44

goroutine 1 [chan receive]:
testing.(*T).Run(0xc0000ae200, 0x1147eef, 0xd, 0x114f810, 0x1070601)
	/usr/local/Cellar/go/1.13.4/libexec/src/testing/testing.go:961 +0x377
testing.runTests.func1(0xc0000ae000)
	/usr/local/Cellar/go/1.13.4/libexec/src/testing/testing.go:1202 +0x78
testing.tRunner(0xc0000ae000, 0xc00007edc0)
	/usr/local/Cellar/go/1.13.4/libexec/src/testing/testing.go:909 +0xc9
testing.runTests(0xc000096020, 0x1239380, 0x3, 0x3, 0x0)
	/usr/local/Cellar/go/1.13.4/libexec/src/testing/testing.go:1200 +0x2a7
testing.(*M).Run(0xc0000aa000, 0x0)
	/usr/local/Cellar/go/1.13.4/libexec/src/testing/testing.go:1117 +0x176
main.main()
	_testmain.go:48 +0x135

goroutine 20 [sleep]:
runtime.goparkunlock(...)
	/usr/local/Cellar/go/1.13.4/libexec/src/runtime/proc.go:310
time.Sleep(0x2540be400)
	/usr/local/Cellar/go/1.13.4/libexec/src/runtime/time.go:105 +0x157
command-line-arguments.sleep_with_me(...)
	/Users/mtsouk/tooLong.go:8
command-line-arguments.Test_test_two(0xc0000ae200)
	/Users/mtsouk/tooLong_test.go:17 +0x30
testing.tRunner(0xc0000ae200, 0x114f810)
	/usr/local/Cellar/go/1.13.4/libexec/src/testing/testing.go:909 +0xc9
created by testing.(*T).Run
	/usr/local/Cellar/go/1.13.4/libexec/src/testing/testing.go:960 +0x350
FAIL	command-line-arguments	25.293s
FAIL
{{< /output >}}

In this case, the testing process ended abnormally once the desired time (`25s`) has passed.

## The testing/quick package

The Go standard library offers the `testing/quick` package, which can be used for *blackbox testing*, which is a test method that examines the functionality of a program without knowing its internal structures. The `testing/quick` package generates random values of *built-in types*, which saves you from having to generate all these random values on your own.

The `myQuick.go` file contains the Go code that is going to be tested.

{{< file "./myQuick.go" go >}}
package main

import (
	"fmt"
	"math"
)

func Sub(x, y int16) int {
	var i int16
	t := int(x)

	max := int16(math.Abs(float64(y)))
	for i = 0; i < max; i++ {
		if y < 0 {
			t++
		} else {
			t--
		}
	}
	return t
}

func main() {
	fmt.Println(Sub(-20796, -26504))
	fmt.Println(Sub(3606, -15085))
	fmt.Println(Sub(0, 10))
}
{{< /file >}}

In order to avoid overflows, the data type of both input numbers in `Sub()` is `int16` whereas the result is an `int`, which on 64-bit machines has more room than an `int16`.

The testing functions that use `testing/quick` are included in the `myQuick_test.go` file that contains the following code.

{{< file "./myQuick_test.go" go >}}
package main

import (
	"testing"
	"testing/quick"
)

var N = 100

func TestWithSystem(t *testing.T) {
	condition := func(a, b int16) bool {
		return Sub(a, b) == int(a)-int(b)
	}

	err := quick.Check(condition, &quick.Config{MaxCount: N})
	if err != nil {
		t.Errorf("Error: %v", err)
	}
}

func TestWithItself(t *testing.T) {
	condition := func(a, b int16) bool {
		return Sub(a, b) == -Sub(b, a)
	}

	err := quick.Check(condition, &quick.Config{MaxCount: N})
	if err != nil {
		t.Errorf("Error: %v", err)
	}
}
{{< /file >}}

The two calls to `quick.Check()` automatically generate random numbers based on the signature of their first argument, which is a function that was defined earlier. The actual tests happen in the `condition` function in both cases. Note that the `MaxCount` field defines the maximum number of iterations that will be executed – modify it according to your needs.

The generated output will resemble the following:

    go test -v myQuick*
{{< output >}}
=== RUN   TestWithSystem
--- PASS: TestWithSystem (0.00s)
=== RUN   TestWithItself
--- PASS: TestWithItself (0.00s)
PASS
ok  	command-line-arguments	0.292s
{{< /output >}}

## Summary

In this guide we talked about writing testing functions, code coverage and the `testing/quick` package, which allows you to test your Go code by taking advantage of the tools offered by Go. Once again, experimenting with testing functions is essential for writing good testing functions.
