---
slug: unit-test-your-go-application
title: "How to Unit Test Your Go Application"
description: 'Master the art of unit testing in Go with this comprehensive guide, covering essential techniques, best practices, and practical examples to ensure reliable and maintainable code.'
keywords: ['list', 'of', 'keywords', 'and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Cameron Laird"]
published: 2023-07-09
modified_by:
  name: Linode
external_resources:
- '[What is Golang used for?](https://www.trio.dev/blog/what-is-golang-used-for)'
- '[Insights into mocking techniques](https://www.myhatchpad.com/insight/mocking-techniques-for-go/)'
- '[Benefits of unit testing](https://dzone.com/articles/top-8-benefits-of-unit-testing)'
---

[Go](/docs/guides/development/go/) is a programming language that was developed around 2007 at Google to address many of the "system programming" tasks typically handled by C. While the syntax of Go is familiar to C programmers, it introduces more powerful and rigorous static typing. Additionally, Go offers the readability and memory safety found in languages like JavaScript and Python. The language also places a strong emphasis on performance, particularly in terms of its built-in [concurrency](https://www.golang-book.com/books/intro/10) features. Go provides a [reference compiler, standard library, and a variety of other tools](https://go.dev/), all of which are freely available as open source.

## When You Should Use Go

[Go is particularly well-suited](https://www.trio.dev/blog/what-is-golang-used-for) for system programming tasks. Whether you need to create a small filter to validate user account configurations or systematically transform millions of photographs, Go is a natural choice. Due to its memory management capabilities, Go provides a safer alternative to C. It often executes much faster than JavaScript or Python, sometimes achieving multiple times their runtime speed. Additionally, Go compiles easily-managed executables for most common environments. Moreover, Go has gained a reputation for being accessible to newcomers in the field of programming.

It's worth noting that Go may not offer the extensive library of extensions, packages, and utilities found in other widely-used languages like Java, Python, and JavaScript. However, when it comes to efficient and straightforward programming, Go remains an excellent choice.

## Unit Tests in Computing

[Automated tests are crucial to safe computing](https://www.computing.co.uk/news/3017649/automated-testing-is-crucial-to-support-devops). Reasonable evaluations of a computing environment give a prominent place to [unit tests](https://dzone.com/articles/top-8-benefits-of-unit-testing).

### The Importance of Unit Tests

As mentioned in the guide, [unit tests](/docs/guides/what-is-unit-testing/) provide several benefits to a project. They serve as documentation, ensuring the proper usage of code. Unit tests also help maintain the integrity of the source code, mitigating the risks associated with routine maintenance tasks. Furthermore, when implemented effectively, unit tests support [recognized methodologies for software design](https://www.agilealliance.org/glossary/tdd) and implementation. The productivity of a programming environment heavily relies on the effectiveness of unit tests. Therefore, a good programming language should facilitate the process of writing correct programs and conducting thorough testing concurrently.

### Go’s Special Relationship to Tests

One advantage of Go is that it has standardized testing built into its core, even though it may not have the extensive history of testing experiments found in older languages like Java. While unit testing was introduced as an "after-market add-on" for Java and other languages, testing has been an integral part of Go since its origin. The Go programming community has a strong understanding of the fundamentals of Go testing, and the examples in the following sections further demonstrate this understanding.

## How to Unit Test in Go

To begin unit testing in Go, start with a small Go program. Once you understand the basics of the application, you're ready to test it.

1. Create a file named `hello-world.go` and add the following code:

    ```file {title="hello-world.go" lang="go"}
    package main

    import (
      "fmt"
      "os"
    )

    func main() {
      var name string

      if len(os.Args) > 1 {
        name = os.Args[1]
      } else {
        name = "World"
      }

      fmt.Println(GetHelloMessage(name))
    }

    func GetHelloMessage(name string) string {
      return "Hello, " + name + "."
    }
    ```

1. Execute the program by running the following command:

    ```command
    go run hello-world.go
    ```

    The output displayed on your screen should be:

    ```output
    Hello, World.
    ```

1. Execute a variation of the program by running the following command:

    ```command
    go run hello-world.go Dylan
    ```

    The output displayed should be:

    ```output
    Hello, Dylan.
    ```

This small program takes a name as input, formats a greeting based on the name, and prints the greeting.


### Write a Unit Test in Go

To focus on the middle operation of formatting a greeting based on the name, create a unit test to verify that the formatted greeting includes the provided name for different possible names.

1. One of Go's mechanisms for the management of sources is the *module*. A Go-based application and its associated tests typically appear as parts of a module. Start by creating a module for this exercise using the following `mod` command:

    ```command
    go mod init hello-world
    ```

    Go responds with the following output:

    ```output
    go: creating new go.mod: module hello-world
    ```

1. With the module defined, implement the unit test by creating a file named `hello-world_test.go` with the following contents:

    ```file {title="hello-world_test.go" lang="go"}
    package main

    import (
        "strings"
        "testing"
    )

    func Test1(t *testing.T) {
        testData := []string{"World", "Dylan", "Erin"}
        for _, name := range testData {
            message := GetHelloMessage(name)
            if !strings.Contains(message, name) {
                t.Errorf("'%s' does not contain '%s'.", message, name)
            }
        }
    }

    ```

    This unit test formats the greeting for the names `World`, `Dylan`, and `Erin` and verifies that each greeting contains the respective name. If any of these confirmations fail, the unit test prints a notice indicating that the expected name was not found in the greeting and exits with an error condition.

1. Run the test by executing the following command:

    ```command
    go test
    ```

    The result from running the test, that is, by executing the `go test` command, should be:

    ```output
    PASS
    ok   hello-world  0.117s
    ```

    Your specific result may vary slightly; the test might take more or less than a tenth of a second to complete.

### A Failing Test

It is important to be familiar with test failures and understand how they are reported. Practice identifying failures by expanding the `hello-world_test.go` file to include a deliberate failure:

```file {title="hello-world_test.go" lang="go"}
package main

import (
	"strings"
	"testing"
)

func Test1(t *testing.T) {
	testData := []string{"World", "Dylan", "Erin"}
	for _, name := range testData {
		message := GetHelloMessage(name)
		if !strings.Contains(message, name) {
			t.Errorf("'%s' does not contain '%s'.", message, name)
		}
	}
}

func Test2(t *testing.T) {
	t.Errorf("An example of a failed test.")
}
```

With this updated code in place, run the `go test` command and the result looks like the following:

```output
--- FAIL: Test2 (0.00s)
        hello-world_test.go:19: An example of a failed test.
FAIL
exit status 1
FAIL	hello-world	0.617s

```

Take a moment to focus on the line `hello-world_test.go:19: An example of a failed test.` in the report above. The number `19` represents the line number within the `hello-world_test.go` source file. `An example...` is the message generated by the `Errorf()` method. This pattern of error reporting in Go tests is common and helps you identify and isolate problems by correlating source-time and run-time details.

Go can combine test results in a meaningful way. For example, a suite of multiple individual tests only passes if all its individual tests succeed.

### Coverage Management

To further enhance the example, update your test run command, `go test`, as follows:

```command
go test -coverprofile=/tmp/coverage.report
```

The output now includes the following line:

```output
coverage: 16.7% of statements
```

In human-readable terms, this line indicates that the tests in `hello-world_test.go` cover approximately one-sixth of the statements present in `hello-world.go`. In commercial practice, coverage levels typically target ranges of 85-95%. However, it's important to note that the value itself is less critical than the insight it provides to maintainers regarding their tests and the source code being tested. In this case, a coverage score of 17% is appropriate for `hello-world_test.go`, as its purpose is to serve as an illustrative example, demonstrating how to construct tests in Go. For a source code intended to ensure the functionality or quality of a working Go program, a higher coverage score, closer to 90% or even 100%, would be more desirable.

### Summary of the First Example of Go Unit Tests

This small example in this guide demonstrated the fundamental aspects you need to know for writing unit tests in Go programming:

1. Organizing sources: Go's basic unit of organization is the module. The source code and unit test are organized within the module structure, allowing for independent refactoring or enhancement of both.

1. Separate test file: The unit test source code resides in a distinct file named `hello-world_test.go`, ensuring it doesn't interfere with the implementation in `hello-world.go`. This separation enables independent management and modification of the source and tests.

1. Managing multiple tests: The `hello-world_test.go` file contains multiple distinct tests, such as `Test1` and `Test2`. Each test can be written to validate specific functionality or scenarios.

1. Passing and failing tests: The example demonstrates both passing and failing tests. You have learned how to write diagnostic messages specific to each test, aiding in identifying issues during test execution.

1. Coverage measurement: Go allows you to measure the coverage of your tests on request. By using the `-coverprofile` flag with the `go test` command, you can obtain insights into the percentage of code covered by the tests.

1. Scalability: The reliance on Go's built-in `go test` command guarantees that your tests scale in a standard way as you extend them to cover an entire module, library, or application. The `go test` command takes responsibility for executing all tests in a Go application and aggregating their results effectively.

With these concepts in place, writing unit tests in Go closely resembles the practices followed in other capable programming languages. The principles and techniques used to write useful unit tests in languages like Ruby or C# can be applied equally well in Go.


## Intermediate Go Testing

Unit tests, as presented in this guide, demonstrate practical testing of real-world Go programs. To further improve your Go tests, the next major topic to study is *mocking*. Mocking involves managing special test objects that substitute for the resources on which a "live" program relies. While mocking is outside the scope of this introduction, there are various mocking frameworks available for Go. One widely used and reliable choice is [golang/mock](https://github.com/golang/mock). To gain more [insight into mocking techniques](https://www.myhatchpad.com/insight/mocking-techniques-for-go/), you can explore additional resources dedicated to this topic.

## Conclusion

You now possess the essential knowledge to write individual unit tests and maintain practical tests that serve in test-driven development or regression testing. If you have an assignment to enhance an existing Go application, you can develop enough unit tests to ensure that the application retains its existing functionality while incorporating new capabilities. If you're designing a new program to be written in Go, you can adopt a test-driven development workflow, with unit tests supporting every step of the implementation process. By practicing with the basic example provided in this guide, you can be equipped to determine how best to utilize Go's testing features to achieve your goals.
