---
slug: two-scopes-of-exception-handling
title: "Two Scopes of Exception-Handling"
description: "Explore best practices and strategies to effectively manage exceptions, optimize application performance, and prioritize user experience."
authors: ["Cameron Laird"]
contributors: ["Cameron Laird"]
published: 2023-07-16
keywords: ['Exception Handling', 'Precise Exception Handling', 'Exception Hierarchy', 'Unspecified Exceptions', 'Application Scope and Scale']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

Exception handling, or error handling, is an aspect of programming that is often misunderstood and improperly implemented. This guide aims to provide you with the necessary knowledge to become proficient in handling exceptions in popular programming languages such as C#, JavaScript, Python, Rust, and SQL.

## What Does Exception-Handling Mean?

One of the challenges in exception handling is that different practitioners or programming communities may use the same terminology with slight variations in meaning. However, the underlying concept remains constant: exception handling involves the features of a programming language that focuses on managing unexpected, anomalous, or unforeseen events or flows, known as exceptions.

When you start programming with a procedural language, you begin by writing a sequence of statements, eventually incorporating branching and looping constructs. Subroutines or methods introduce reusable code that is defined in one unit but invoked or executed in another. These control flows are sufficient for most conventional application programming scenarios.

### Exceptions Control Programming Flow

In intermediate programming, one encounters a distinct aspect of control flow known as raising and handling exceptions. This concept is considered intermediate in several aspects. Interestingly, it is possible to program successfully for a considerable period understanding exceptions. Exceptions are not necessary for many common programming scenarios.

Exceptions are often introduced in terms of errors, where an error is represented as a raised exception and subsequently resolved through the syntax of exception handlers. This approach is commonly observed among Java programmers.

Exceptions and error handling can indeed vary across programming languages, and it's not limited to the approach commonly seen in Java. C and Python, for instance, offer contrasting styles in handling errors and exceptions. In contrast to Java, Python provides flexibility in handling errors with little or no reliance on exceptions. Python, in particular, utilizes exception handlers to manage control flows that extend beyond the realm of errors. This means that while exceptions and errors are often closely associated, there are cases where one is present without the other. Mastering the use of exceptions requires understanding these nuances.

Furthermore, programming languages may have their own distinct styles, but organizations also contribute their own cultures and legacies, which can either reinforce or deviate from broader trends. For example, a team within a predominantly Java-based organization that uses PHP might have established conventions of defining interfaces that return error codes, minimizing the use of PHP's exception-handling capabilities. It is important to understand your audience and address any uncertainties by asking relevant questions.

At a broader level, programmers can indeed have differing interpretations of what constitutes an error in a program. It is not uncommon to hear programmers and other individuals referring to "errors" when they are actually referring to deviations from the *specified correct* behavior, such as misspelled identifiers or inconsistent data entries.

From this observation, it becomes evident that instead of seeking a universally accepted definition of an "exception handler," it is more important to view the use of exception handlers as an opportunity to foster clarity and alignment within your team. It is essential to ensure that all individuals involved in discussions regarding exception handlers have a shared understanding of what they mean by terms like "error" and "handle".

## Exception-Handling Is Misleading: Exception-Handling Is Scaffolding

One common misconception about exception handling is that it serves primarily as a prescription for managing errors within a program. However, this belief, while widely practiced, does not capture the full essence of exception handling.

To illustrate this point, consider the basics of SQL. In SQL, it is perfectly acceptable to write queries like:

```command
SELECT * FROM my_table;
```

This is considered idiomatic SQL. However, experienced SQL practitioners understand that using wild cards, such as `SELECT *`, may be acceptable for initial experimentation or as a form of scaffolding. It allows developers to explore a domain that is incompletely documented or to quickly warm up when starting a new task. However, as the development process advances, it's crucial to move towards more precise and intentional code, referencing specific columns rather than using wild cards. Using `SELECT *` liberally to display content to end-users in a polished application is generally discouraged as it can lead to performance pitfalls. Similarly, with exception handling, naively using exception handlers for all scenarios may lead to applications that are difficult to understand, diagnose, and maintain.

The default behavior of many programming languages' exception handlers involves printing out stack traces. This can be likened to the "moral equivalent" of using `SELECT *` in SQL. While it may be easy for the runtime to print stack traces, it is not always appropriate or acceptable to subject end-users to such inscrutable computing output. Java developers and programmers in some other languages sometimes code with "raw" exceptions, leading to scenarios where end-users encounter screens full of stack traces that provide no human-level meaning.

However, there is an alternative and more user-friendly approach to exception handling. Rather than accepting the default display of exceptions, developers can carefully capture the exception and respond with human-readable messages. Instead of presenting users with dozens of lines of stack trace, the application can communicate coherent and meaningful responses, such as "No valid payment card information is currently on file for this account" or "Your request has exceeded the available memory for your current configuration; please expect a call within fifteen minutes."

While using whatever is available at the beginning of a programming assignment is fine, it's crucial to progressively refine the implementation and restrict exception handlers to tasks they perform best. This includes presenting meaningful and user-friendly messages when something goes wrong, enhancing the overall user experience.

## Time and Space: The Prominence of Exceptions

The concept of exception handling in programming is both overused and, at the same time, arguably underused. This intriguing paradox arises due to the fundamental user-interface dilemma faced by developers.

On one hand, exception handling is often overused, with programmers incorporating it uncritically throughout their code. This can lead to unnecessary complexity and make it harder to understand and maintain the software.

On the other hand, the importance of exception handling is often underestimated. Exception handling plays a vital role in enhancing the overall user experience, especially during the initial interactions with the application. The value of an application lies in its power and efficiency over time, but users' impressions and attitudes are primarily shaped by their first few experiences with the application. During these initial moments, users are likely to encounter exceptions more frequently as they explore the features and functionalities. Handling these exceptions effectively is crucial to ensuring a positive user experience.

The tension between exception handling and the development of the happy path is a common challenge faced in writing good applications. Even in well-designed programs, the exception-handling code often dominates the size of the happy paths, whether measured in lines or pages. While the goal is to perfect the application's happy path, users' first impressions are significantly influenced by how the application handles exceptions.

It is worth noting that a lack of knowledge and underutilization of automated testing is a common hindrance faced by many programmers, and testing exceptions are even less well-developed.

## Precision in Error-Handling: Avoiding Overly-General Exceptions

Improving the quality of error handling can be achieved swiftly by adopting a more precise approach to exception trapping.

Overly-general exceptions are so glaring a problem that most linters now pick them up: it's common for those who work with static source code analyzers across many languages to see complaints about bare excepts or excessively-general exceptions. The source code often exhibits examples such as:

```command
try:
    # Some code that might raise an exception
    return get_file_handle(customer_account)
except
    # Handling the exception in a generic way
    report(f"File doesn't exist for customer account {display(customer_account)}.")
```

Handling exceptions with precision is a crucial aspect of effective error handling. In the above code segment, the presence of a bare `except` is an indicator that the code may not be handling other scenarios correctly, possibly overlooking several less-common but important exceptions.

To address this issue, qualifying each exception specifically can improve the robustness and reliability of the code. A more refined version of the code could look like below:

```command
try:
    return get_file_handle(customer_account)
except IOException:
    # Handle IOException in a specific way
    report(f"File doesn't exist for customer account {display(customer_account)}.")
except ResourceError as re:
    # Handle ResourceError in a specific way
    report(f"Resource error occurred: {str(re)}.")
except ValueError as ve:
    # Handle ValueError in a specific way
    report(f"Value error occurred: {str(ve)}.")
except Exception as e:
    report(f"Unrecognized internal error #73; a representative will call you this hour.")
# Catch (or trap) with precision.
```

The line `Catch (or trap) with precision.` is included as a comment in the code, reminding developers of the importance of precise exception handling.

## Handle Unspecified Exceptions

In exception handling, it is not always necessary for each individual exception handler to explicitly resolve every possible exception. Instead, what is crucial is to have a well-defined architecture that includes a plan for handling any remnant exceptions that might "bubble up" to the top level of the application. The default behavior in most programming languages is to display inscrutable tracebacks when encountering unhandled exceptions. However, a more proactive and efficient approach is to specify how the application should handle uncategorized situations at the project level and then implement that behavior.

It's important to acknowledge that as the application evolves, the incidence of truly unknown exceptions is likely to decrease significantly. When developers encounter and resolve exceptions, those situations become known and are no longer classified as unknown. By investing time and effort into handling unknowns effectively, developers can gradually turn them into known exceptions, improving the overall stability and reliability of the application.

## Balance Your Exception Hierarchy

Modern programming languages often provide the flexibility for programmers to customize or extend the built-in exceptions. On one hand, defining zero or just one customized exception for a substantial application may raise concerns about its precision. On the other hand, an exception hierarchy with more than two levels of inheritance can become overly complex and challenging to maintain and use effectively. Just like in other digital domains such as fonts, CSS, database schemata, or survey questions, smart definitions are essential to represent the domain accurately. However, when the hierarchy becomes too intricate and requires extensive diagrams, it can become unwieldy and prone to errors. A well-structured exception hierarchy strikes the right balance between precision and maintainability.

## Exception Handling Across Scopes and Scales

Exception handling is complex; catching exceptions with precision is essential at all levels; top-level handlers must resolve all exceptions. Performance impacts of built-in handlers vary among languages; inner loops might need lightweight custom syntax or elevated handlers. Specialized attention to exception handling is crucial.

Scope and scale present a final challenge in exception handling. Many languages impose performance penalties on built-in exception handlers. The straightforward style suitable for most handlers may be unsuitable for inner loops invoked thousands of times per second. Resolving this requires extending the language with a customized, lightweight exception syntax or using a slightly more involved handler above the heavily-executed loop. Languages differ in performance, syntax, and expectations, making answers language-specific. The main point endures: specialized attention is essential for exception handling's sufficient complexity.

## Conclusion

These seven tips hold significant value and should be reviewed periodically. Practice and familiarize yourself with them to enhance your exception-handling skills.

-   Recognize the importance of exception handling and avoid treating it as an afterthought.

-   Mishandled exceptions have led to numerous security breakdowns.

-   Expand your techniques beyond traditional exception handling; don't restrict yourself to what your implementation language labels as "exception-handling". Prioritize end-user experience and tailor exception messages accordingly, using built-in exception handling to support product-level requirements.

-   Whenever possible, handle exceptions locally and precisely, addressing specific scenarios explicitly.

-   Exception handling is a customer-level requirement, not merely an implementation detail. It greatly influences users' first impressions when interacting with the application.

-   Exception handling that delivers a positive "out of the box" experience is crucial. Strive for good exception handling that is also testable, allowing for efficient and accurate testing of exceptional scenarios.

Consider both your programming language's capabilities and your application's requirements. By bridging the gaps between the two, you will gain confidence and effectiveness in your programming skills.