---
slug: logic-programming-languages
description: 'What is logic programming and what are its benefits? Get those answers plus find examples of logic programming languages and their features. ✓ Learn more!'
keywords: ['logic programming languages', 'logical programs', 'logic programming examples', 'logic programming paradigm']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-04-04
modified_by:
  name: Linode
title: "A Guide to Understanding Logic Programming"
title_meta: "Logic Programming Languages: Use Cases, Examples, and Features"
external_resources:
- '[Prolog Standard](https://www.iso.org/standard/21413.html)'
- '[Prolog Tutorial](https://www.tutorialspoint.com/prolog/prolog_introduction.htm)'
- '[Prolog Wikipedia page](https://en.wikipedia.org/wiki/Prolog)'
- '[Logic Programming Wikipedia page](https://en.wikipedia.org/wiki/Logic_programming)'
- '[GNU Prolog page](http://www.gprolog.org/)'
authors: ["Jeff Novotny"]
---

Most computer programming languages fall into one of several *programming paradigms*. A paradigm classifies a language based on its features and how its programs are constructed and used. Logic programming is a paradigm that uses a system of facts and rules. It is commonly used in the artificial intelligence and machine learning domains. This guide explains the logic programming paradigm and compares it to other programming models. It also explains its benefits and use cases, and introduces the most important logic programming languages.

## What is Logic Programming?

Logic programming languages were originally developed in the 1960s in academia. It was originally designed to help study knowledge representation and artificial intelligence. Logic programming is a variation of declarative programming based on a type of formal logic called *Predicate Calculus*. Declarative languages describe what the program should do, but not how to do it. The precise algorithms and processing methods are left up to the language, which is expected to generate the proper outcome. Logic programming should not be confused with programming logic, which is a more general study of how logical rules apply in computer programming.

Logic programs are completely data-driven and do not typically include any connective logic. Instead, the programs use a set of logical statements, which are also called *predicates*. Predicates can be classified as either facts or rules. They must have a *head* component, and can also have a *body*.

**Facts** are simple statements that do not contain a body clause. They express the core information about a domain. Facts can take the form `x is true` or `x is y`, where y is a statement about x. A real-world example might be "Rex is a dog". In symbolic logic, a fact only has a head named `H`, and is expressed as follows:

```command
H.
```

**Rules**, also known as axioms, are logical clauses. Rules describe the circumstances under which a relationship is valid. A rule contains a head and a body and takes the form `x is true if y and z are true`. The `x is true` section forms the head of the clause, while the `if y and z are true` portions are the body. A simple example is "x can bite if x is a dog and x is awake." A rule containing head `H` and body clauses `B1` to `Bn` can be expressed symbolically using the following notation:

```command
H :- B1, …, Bn.
```

In the simplest case, the head and all body components are definite clauses. This means they are atomic and do not contain any subclauses or connective components. However, negations of definite clauses are still allowed, such as "x is not y". Some implementations also permit "if and only if", or `iff`, clauses. Some advanced programs permit very advanced rules using compound or nested clauses. In any case, the syntax must be very precise and consistent to be meaningful.

The following logic programming example demonstrates how predicate calculus is used. The first rule categorizes dogs as animals. It can be written as follows:

```command
animals(X) :- dog(X).
```

A subsequent statement asserts that Rex is a dog.

```command
dog(Rex).
```

Armed with these predicates, the program can automatically deduce Rex is an animal without being told. The fact `animal(Rex).` is not required. The program can choose Rex as an example when a user is looking for either a dog or an animal. If they are searching for something that is not an animal, then the program knows Rex is not a satisfactory choice.

### The Mechanics of Logic Programming Languages

Logic programming uses controlled deduction, although the methods vary between applications. A typical program includes a logic plane, consisting of logical statements, and a control plane. The control algorithm supplies problem-solving abilities.

Each application attempts to find patterns within the data. It attempts to solve the problem only with the information it has been given and has learned. At times, this information might be incomplete or contradictory. When the logic program makes a well-reasoned decision, it is said to be functioning "logically". However, its decisions are only as good as its predicates. If either the facts or the rules are incorrect, the output is usually wrong too.

Problems are often solved internally through the use of an *and-or tree*. The objective of a search is the top node, and the tree is parsed downwards for possible solutions. From each level, the different possibilities at the next lowest level are the "or" options. If two or more of these options are bound together, this represents an "and" clause. In an "and" clause, both choices must be true. If so, the set becomes one of the options for the "or" clause. Logical programs also rely on *backward reasoning*, which draws more specific conclusions from more general facts and rules. Backward reasoning allows the program to use information taken directly from the rules and inferences it has gained through deduction.

Different applications might use different algorithms in different situations, including parallel search and best-first search. A program can use several approaches when a fact or rule is not defined. If there is no rule describing the relation between x and y, then both `x is y` and `x is not y` could potentially be false in some circumstances.

A pure logic programming environment does not use control statements or connective code. The program must generate all responses based on its library of facts and axioms. Some logic languages, including ASP and Datalog, are purely declarative. However, Prolog allows for some procedures and control structures.

## The Logic Programming Paradigm

Each programming paradigm groups related programming languages together. The programs are categorized according to their features and execution model. The boundaries between the paradigms are not clear cut and some languages combine features from multiple paradigms.

Computer scientists consider logic programs to be part of the declarative programming paradigm. This relatively unconventional paradigm occupies a small but important niche within programming. It can be better understood through a comparison with the more traditional programming paradigms. The following five paradigms account for most of the best-known computer programming languages.

- **Imperative Programming:** This has historically been the most important programming paradigm. An imperative program tells the system how to perform a task using step-by-step instructions. Ordered commands are used to collect information and change the system state. This model aligns with the structure of the underlying hardware, which is designed to execute machine code similarly. Core imperative concepts include the assignment of variables and the evaluation of expressions. Control structures, including loops and conditional statements, are used to direct the control flow of the program. However, the instructions are read and executed sequentially. The order of execution is deterministic given the exact same inputs.

- **Procedural programming:** This is an evolution of imperative programming that uses procedures, also known as subroutines or functions. These procedures break the main program into smaller components for easy reuse. The main program interacts with a procedure through an interface. Procedural programming imposes greater structure, organization, and modularity on a program, and allows programmers to limit the scope of variables. It also reduces code duplication, enhances maintainability and correctness, and makes programs easier to read. Procedural programming has now almost completely replaced free-form imperative programming. Some analysts consider procedural and imperative programming to be part of the same paradigm. The C programming language is a classic example of a procedural language.

- **Object-oriented programming:** The object-oriented (OOP) paradigm extends procedural programming concepts through the use of objects and classes. Classes encapsulate variables, data structures, and internal functions known as methods, to provide a cleaner interface. Object-oriented programs create and destroy objects, which are particular instances of a class. For example, in a class called `Schedule`, each `Schedule` object is an actual schedule belonging to an individual user. Each object maintains its own state and is accessed through a clearly-defined interface. C++ and Java are popular object-oriented languages.

- **Functional programming:** This is an advanced programming paradigm centered around functions, which are used differently than in other paradigms. In this model, functions are applied in a strict mathematical sense, based on *lambda calculus*. Functions handle almost all tasks, mapping or binding values to other values using expression trees. They can be assigned to variables, passed as arguments, and returned as values. However, these functions cannot cause side effects or be affected by user input. In practice, functional programs share some stylistic similarities with declarative programming. They vary widely in implementation techniques and are considered difficult to understand and master. However, they have the advantage of being easier to test due to their strict implementation. Some popular functional programming languages include Lisp, Clojure, and Haskell, but many traditional languages now include some functional programming features.

- **Declarative programming:** This paradigm includes logic programming, database query languages, and configuration management programs. These programs specify what must happen, but not how it should happen. For example, declarative language might describe the end state of the system. Implementation details are left up to the programming language. These languages are often based on logic and mathematics but do not usually use traditional control structures or data structures. Instead, they often search for results satisfying the request. Good examples include Prolog and the *Structured Query Language* (SQL).

Although all logic programming languages are part of the declarative programming paradigm, some of them incorporate imperative programming practices. For example, Prolog includes imperative programming devices, including loops, conditionals, and functions.

Within the logic programming paradigm, there are several different specializations. Each variation has a specific focus or adds new features and attributes.

- **Higher-order Logic Programming:** The style enhances logic programming with higher-order programming logic, such as predicate variables. It allows functions, modules, and objects to serve as values. Higher-order logic programs are sometimes used to validate formal proofs or theorems in math or logic. Several Prolog extensions provide higher-order logic features.

- **Constraint Logic Programming:** This variation allows constraints to be added to a predicate. For example, a constraint can append a valid range to any value. Constraints can potentially make rules more flexible or more restrictive. The program calculates the set of solutions satisfying all constraints. Constraint logic is used to solve problems in engineering and timetable production.

- **Concurrent Logic Programming:** Concurrent logic is used in parallel computing and distributed systems. It generates a set of guarded clauses that might also have further subclauses to validate. It distributes the clauses across different processors, executing the search in a parallel and non-deterministic manner. If more than one guard satisfies the query, the system chooses one of the possibilities and investigates the subclauses. Other guards satisfying the query might be ignored.

- **Abductive Logic Programming:** This variation allows logic programming to proceed using incomplete or unknown information. The purpose of this type of search is to generate possible solutions to a problem under investigation. It is often used in fault analysis and natural language processing.

- **Inductive Logic Programming:** This model uses positive and negative examples in conjunction with its knowledge base. Programs generalize a hypothesis inductively from the set of examples. Inductive logic is often used in natural language processing and biometrics.

## Why Logic Programming?

Logic programming is naturally designed to answer queries. It can determine whether a query is true or false, or provide a list of choices that satisfies the query. It can also order alternatives from most to least relevant, or rank them on some other dimension. Logic programming is not typically used for tasks requiring a lot of string or mathematical processing or for lower-level system actions.

Some of the other advantages of logic programming include the following:

- It is very useful for representing knowledge. Logical relationships can easily be transferred into facts and rules for use in a logic program.
- Users do not have to be experts in traditional programming to use it. They only have to understand the logical domain and know how to add the predicates. Logic programming syntax is straightforward.
- It can be used to represent very complicated ideas and rapidly refine an existing data model.
- It is very good at pattern matching.
- It is efficient in terms of memory management and data storage.
- It allows data to be presented in several different ways.

There are also some drawbacks to logic programming. It can be challenging to translate knowledge into facts and rules, and programs can be difficult to debug and test. Unintended side effects are much more difficult to control in logic programming than they are in traditional languages. Slight changes can generate vastly different outcomes.

## Use Cases for Logic Programming

Logic programming can be used in any domain where a large amount of data must be analyzed to make decisions. However, it is most commonly applied to a few subjects. Following are some places where logic programming is most likely to be found.

- **Artificial Intelligence/Machine Learning:** This is one of the main applications of logic programming. It is especially relevant because it provides a structured method of defining domain-specific knowledge. AI systems use their facts and rules to analyze new queries and statements.

- **Natural Language Processing (NLP):** NLP handles interactions between people and computers. It relies upon a system of rules to interpret and understand speech or text. NLP systems translate their insights back into a more data-friendly format. NLP systems can also generate a relevant response to user requests and feedback.

- **Database Management:** Logic programming can determine the best place in a database to store new data. It can also analyze the contents of a database and retrieve the most useful and relevant results for a query. Logic programming is frequently used with large freeform NoSQL databases. These databases do not use tables to organize and structure data and must be analyzed using other methods.

- **Predictive Analysis:** Logic programs can sort through a large amount of data, analyze results and make predictions. This is especially useful in areas such as climate forecasting, the monitoring of deep space objects, and predicting equipment failures.

Logic programming is also used in fault diagnosis, pattern matching, and mathematical proofs.

## Examples of Logic Programming Languages

There are dozens of different logic programming languages. Many of these have been adapted from more generic programs for use in one specific domain. However, three widely-known languages are used across different subject areas.

- **Prolog:** This is the original logic programming language, developed at a French university in 1972. It was designed for use in artificial intelligence and is still the most popular logic programming language today. Prolog mainly uses the declarative programming paradigm but also incorporates imperative programming. It is designed for symbolic computation and inference manipulation. Its logical rules are expressed in terms of relations and take the form of *Horn clauses*. Queries use these relations to generate results. Prolog operates by negating the original query and trying to find information proving it false.

    In Prolog, the Horn clause is written as:

    ```command
    H :- B1,...,Bn.
    ```

    - Antecedents (or left-hand side of the sentence) in the Horn Clause are called *subgoals* or *tail*.
    - The consequent (or right-hand side of the sentence) in the Horn Clause is called *goal* or *head*.
    - A Horn Clause with no tail is a *fact*. For example, `rainy(seattle).` does not depend on any condition.
    - A Horn Clause with a tail is a *rule*. For example, `snowy(X) :- rainy(X),cold(X).`.

    Developers use Prolog for database search, natural language processing, expert systems, and planning operations. An introduction to Prolog can be found [here](https://www.tutorialspoint.com/prolog/prolog_introduction.htm). To download and install Prolog, see the instructions on the [GNU Prolog website](http://www.gprolog.org/).

- **Datalog:** Datalog is an offshoot of Prolog that uses a strict declarative model. It is often used for machine learning, data integration, and information extraction. Datalog programs are usually interpreted by another programming language. Statements can be entered without regard to order and finite-set queries are guaranteed to terminate. It imposes more rules than Prolog does for reasons of efficiency. Several open-source products are based on Datalog or include built-in Datalog interpreters.

- **Answer Set Programming (ASP):** Not to be confused with the server-side scripting language sharing the same acronym. ASP is a form of *declarative programming* designed to solve extremely difficult search-related problems.

    ASP is represented as a finite set of rules in the form as shown below:

    ```command
    a0 ← b1, . . . , bn, not c1, . . . , ck
    ```

    From the above syntax:

    - `a` is the *head* of the rule
    - The list `b1, . . . , bn, not c1, . . . , ck` is called the *body*  of the rule

    Some examples include [graph coloring](https://www.geeksforgeeks.org/graph-coloring-set-2-greedy-algorithm/) and [Hamiltonian cycles](https://www.geeksforgeeks.org/hamiltonian-cycle-backtracking-6/) on large data sets. It reduces search problems to stable models. These models are then used to perform the search. All ASP queries are guaranteed to resolve.

## Concluding Thoughts about Logic Programming

Logic Programming is based on the declarative paradigm of computer programming. Users specify the underlying data through a symbolic system of relations, in the forms of facts and rules. Facts are simple statements, while rules indicate relationships within the domain. A logic program uses its body of predicates and the principle of deduction to answer queries about the data. It is considered the best tool for representing knowledge and logical relationships.

Logic programming is one of several programming paradigms, including imperative/procedural, object-oriented, and functional models. Several variations of logic programming also exist. It is used in artificial intelligence, natural language processing, database management, and predictive analysis. Some of the best-known logic programming languages include Prolog, Datalog, and Answer Set Programming.

Several tutorials provide a foundation to help you get started on logic programming. If you want to try logic programming for yourself, consider doing your development work on a Linode system. A Linode server, configured with a full LAMP stack, satisfies all the requirements to run Prolog.