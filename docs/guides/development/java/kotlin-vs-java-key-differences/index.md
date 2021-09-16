---
slug: kotlin-vs-understanding-their-differences
author:
  name: Jack Wallen
  email: jlwallen@monkeypantz.net
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['kotlin vs java', 'what is kotlin', 'what is kotlin used for']
tags: ['java']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-30
modified_by:
  name: Linode
title: "Kotlin vs. Java: Understanding their Differences"
h1_title: "Kotlin vs. Java: Key Differences"
enable_h1: true
contributor:
  name: Jack Wallen
external_resources:
- '[Kotlin comparison to Java](https://kotlinlang.org/docs/comparison-to-java.html)'
---

To date, the most popular language for Android development is Java. But there is competition. One such competitor is [Kotlin](https://kotlinlang.org/), which was created to be an improved version of Java. The goal was to build a cleaner, simpler, and a faster mixture of object-oriented, and functional programming.

A comparison of Kotlin and Java is important in light of the fact that in 2017 Google perceived Kotlin as the second official language for Android development.

## What is Kotlin?

Kotlin is the brainchild of [JetBrains](https://www.jetbrains.com/). In 2011 the company unveiled Project Kotlin, which served as a new language for the Java Virtual Machine. The company wasn't satisfied with the features found in the language, except for Scala. However, the problem with Scala was the slow compilation times. To that end, JetBrains set out to create a new language, with all of the features they needed, and the compile speed of Java.

In 2012, JetBrains open-sourced the Kotlin project, under the Apache 2 license. It wasn't until February 15, 2016, that Kotlin 1.0 was released.

### Key Features of Kotlin

Kotlin includes several features that are attractive to developers. Those features include:

- Interoperability with Java.
- Clean, compact syntax.
- Offers both functions and functional programming.
- Includes data classes.
- Very easy to learn.
- Reduces code length (approximately 20% less code when compared to Java).
- Statically typed.
- Extendable, via functions.
- Fewer runtime crashes.
- Smart cast function helps to improve an application's performance.
- Open-source, so it has a low cost of adoption.
- `if` can be used for control flow.
- Does not have checked exceptions.
- `when` is replaced by `switch`.
- Supports multiple threads to run intensive operations.
- Supports coroutines.

### What is Kotlin Used For?

Kotlin’s primary use is for Android development. Kotlin code can be compiled to JavaScript, so it is also used for other purposes. Because Kotlin compiles to Java bytecode and the runtime is a single JAR, you can use Kotlin anywhere you would use Java.

Other uses for Kotlin include:

- Front-end development.
- Backend development.
- Data science (as a replacement for Scala/Python).
- Web and server-side development.
- iOS applications.
- Embedded systems.
- Data analysis.
- Game development.

## Kotlin and Java: How are they Different?

There are several key differences between Kotlin and Java. The biggest difference between the two is that Kotlin doesn't provide for checked exceptions, so there's no need to catch or declare any exceptions.

The lack of support for checked exceptions may be seen as beneficial or disadvantageous. If you're a developer who dislikes having to use try and catch blocks in your Java code, then Kotlin's omission of checked exceptions is a welcome change. However, if you see checked exceptions as a solid means for error recovery, you might find Kotlin a bit frustrating.

Another big difference is the conciseness of the Kotlin code. A perfect example of this is the Hello, World! app. In Java, the code for Hello, World! looks like the following:

{{< file >}}
class MyClass{
  public static void main(String args[])
  {
      System.out.println("Hello World");
  }
}

{{< /file >}}

In Kotlin, this same app is coded like the following:

{{< file >}}
fun main(args:Array){
  println("Hello World");
}
{{< /file >}}

That's half the amount of code lines in Kotlin. If you're working with a larger application, programming with Kotlin seriously reduces your workload.

In Java's favor, it enjoys a much larger community. Of course, Java has been around since 1995, so it makes sense that there is a larger community around the older language. That translates to considerably more resources available for Java. In comparison, Kotlin has far fewer available resources.

Other differences between Kotlin and Java include:

- Kotlin supports smart cast (a function that identifies immutable types and performs implicit cast by the compiler). For example, class casting in Java requires first checking the type of variable using the "instance of" operator and then casting it to the target type. With Kotlin, when performing "!is" or "is" checks on a variable, the compiler tracks the information and automatically casts the variable to the target type.

- Kotlin supports type inference, whereas, with Java, types must be specified explicitly.

- Java compilation time is 15-20% faster than Kotlin compilation time.

- With Kotlin, it's not possible to assign null values to variables or return values. With Java, null values can be assigned, but accessing objects pointing to null values raise an exception.

- Kotlin supports extension functions, whereas Java does not.

- Kotlin uses invariant arrays which means the language doesn't allow a user to assign `Array<string>` to `Array<any>`. This feature prevents run time failures, which is an issue found in Java.

Android development is quickly moving toward Kotlin, although given Java's general-purpose nature, Kotlin never fully supplant Java. And given Java is the number two most popular programming language (bested only by Python), it's here to stay.

## Kotlin for Server-Side Applications

Kotlin is also used for server-side applications. When using Kotlin for this purpose you gain several benefits which includes:

- Features such as type-safe builders and delegated properties make it possible to build powerful abstractions.
- Coroutine support makes it possible to massively scale server-side applications.
- Java interoperability means you can continue using Java while gaining the modern benefits of Kotlin. Since Java is one of the largest programming ecosystems in the world, this is a big plus.
- Supports gradual migration from Java.
- Supports framework-specific tooling.
- Null-safety eliminates the "Billion Dollar Mistake," resulting in fewer issues with dereferencing null values.
- Intuitive action chains make it possible to easily transform a list of X objects to Y objects (for example `listOf(X(1)`, `x(2)`, `X(3)).map { x -> x.toY() })`.

For those who depend on frameworks, Kotlin enjoys the support of several.

[Spark Framework](https://sparkjava.com/), not to be confused with Apache Spark, was originally a web framework for Java development, now supports Kotlin. Spark makes it possible to build expressive web applications using declarative syntax.

[Ktor](https://ktor.io/) was developed by JetBrains and is used to build connected applications. Ktor offers strongly-typed endpoints and makes it possible to exchange data across platforms. Ktor assists you with building asynchronous client and server applications, ranging from microservices to multiplatform HTTP client applications.

[Javalin](https://javalin.io) isn't a full-blown framework, but rather a REST API library that supports template engines, WebSockets, and static file-serving. Javalin also includes a built-in Jetty server and template/markdown rendering.

[Spring](https://spring.io/) introduced support for Kotlin in version 5.0 and is one of the more popular tools for building enterprise-level web applications. Spring is a module MVC framework, which means you only have to use what you need. Spring is a great framework for building web applications, enterprise applications, REST APIs, and distributed systems.

## Conclusion

For anyone looking to the future of Android app development, Kotlin is the way to go. With a concise language, efficiently compiled code, extendability, and plenty of other attractive features, Android developers can do much more with far less. If you're more of a general-purpose Java developer, you can still benefit from Kotlin, thanks to seamless interoperability. Those who already know Java can get up to speed with Kotlin in no time. Check out [Kotlin](https://kotlinlang.org/) now and see if it doesn't become your go-to language for Android and server-side application development.
