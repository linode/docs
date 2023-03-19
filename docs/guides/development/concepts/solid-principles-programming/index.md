---
slug: solid-principles-programming
description: 'The SOLID principles in programming refer to the five principles of object-oriented class design. Learn more about each principle and its benefits here.'
keywords: ['solid principles programming', 'solid principles', 'solid design principles', 'solid programming']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-04
modified_by:
  name: Linode
title: "SOLID Principles in Programming: A Comprehensive Guide"
title_meta: "SOLID Principles of Object-Oriented Programming"
external_resources:
- '[Wikipedia article on SOLID Principles](https://en.wikipedia.org/wiki/SOLID)'
- '[Robert Martin article on OOD Principles](http://butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod)'
- '[Wikipedia page on Inheritance](https://en.wikipedia.org/wiki/Inheritance_(object-oriented_programming))'
authors: ["Jeff Novotny"]
---

Most new software applications are developed using *Object-oriented Programming* (OOP) techniques. This paradigm is very powerful, but can also be confusing, and can lead to complex code that is difficult to debug, change, or extend. To simplify and strengthen the development process, developers can apply the [*SOLID Principles of Programming*](http://butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod). This guide describes the SOLID principles and why programmers should use them and explains each principle in detail using examples.

## What are the SOLID Principles in Programming

The SOLID design principles describe best practices for object-oriented programming. However, the main ideas can be extended to any software development project. The American software engineer Robert C. Martin originally defined these concepts as a way of improving software quality. SOLID is a mnemonic acronym for the names of the five design principles it describes. In order, the five principles are:

- **(S)ingle-Responsibility Principle**
- **(O)pen-Closed Principle**
- **(L)iskov Substitution Principle**
- **(I)nterface Segregation Principle**
- **(D)ependency Inversion Principle**

In addition to guiding object-oriented design, the SOLID principles can also be applied to Agile and rapid application development. (Martin is also a contributor to the influential [Agile Manifesto](https://agilemanifesto.org/).) These principles should be implemented at all stages of the software development process, from design through implementation, validation, and quality assurance.

### What Purpose do the SOLID Principles of Programming Serve?

The SOLID design principles formalize and organize many of the best ideas behind [structured programming](https://en.wikipedia.org/wiki/Structured_programming). Each principle encapsulates a standard best practice from the software development industry. For example, the Single-Responsibility Principle is a restatement of the principle of modularity. Adherence to these rules is more likely to result in a flexible, maintainable, and correct program. It also makes the codebase easier to read and use and allows developers to collaborate more effectively.

More specifically, these principles address a problem that Martin refers to as "Dependency Management". While object-oriented design tends to make interfaces and interactions more legible, it does not automatically lead to a clean design. Clear and well-defined dependencies between classes and methods are more likely to lead to flexible, sturdy, and maintainable programs. On the other hand, murky and tangled dependencies result in brittle, defect-prone, and hard-to-change applications.

To resolve this issue, Martin developed a set of principles for class design, package cohesion, and package dependencies. The class design principles, which contain his most important ideas, have been refined into the SOLID principles.

## The SOLID Principles in Detail

Each of the SOLID principles of programming summarizes a best practice within software development. Although these ideas are interconnected, they can be analyzed and discussed one at a time. A short example is included in each section to help illustrate the main idea.

Each principle represents a design goal, not an absolute law. Perfect adherence to every principle might not be possible in every case. Sometimes there might be valid reasons to take a different approach. But this should be only done after careful consideration, after determining the principle is impractical.

{{< note respectIndent=false >}}
The examples in this section use Python-based pseudocode. They are designed to clearly demonstrate the principles rather than represent complete interfaces, executable code, or realistic programs.
{{< /note >}}

### Single-Responsibility Principle

The *Single-Responsibility Principle* states:

**A class should have one, and only one reason to change.**

An alternate explanation of this concept is:

**Every class should have only one responsibility.**

In other words, there should only be one specification in the design document that describes how the class is implemented. This implies a class should only be responsible for a single area. If it had more than one responsibility, more than one specification change might cause it to change. Every method inside a class should relate to the main concept behind the class. Each method should itself only have one responsibility.

This principle illustrates the concept of modularity, a core objective of structured programming. A program is modularized when it is split into smaller functions and classes, each with a limited and well-defined function. The advantages of modularity, and this principle, include the following:

- The code is easier to understand and is better organized.
- The inter-dependencies within the code are reduced.
- Classes can be written more quickly and efficiently.
- The class interface tends to be cleaner and simpler.
- The class does not have to be updated as frequently, and there is less chance of introducing negative side effects. There are fewer merge or version-control conflicts.
- It is easier to test any changes, with fewer quality assurance scripts to execute.

When code ignores this principle, it is usually messy and disorganized. It becomes difficult to debug, fix, and update. The classes have to change more frequently and inter-dependencies proliferate.

It is important not to overextend this practice. Too many small, single-method classes can become equally confusing and might require overly complex interfaces. A deep chain of function calls can increase the stack size and slow down the program. Single-Responsibility allows closely-related functions to be grouped together in the same class. However, it is equally important not to violate this goal because proper design is more time-consuming.

In the example below, the `City` class stores information about a city, including its latitude, longitude, and time zone. This information is all related, so it satisfies the single-responsibility principle. However, to make it quick and easy to print the city details, the designer adds a `print` method to the class. Unfortunately, this method has to know everything about the default printer and how to set it up.

{{< file "city.py" python >}}

class City:
def __init__(self, latitude, longitude, country, timezone, population):
# Initialize the object

def printToFile(self, file):
# Build a string of the output and print to the specified file or default

def printToStdOut(self, method):
# Print using `print` function
{{< /file >}}

At first, the class might not seem too diffuse. However, any time a new print method is added or updated, the class must change. It also has to change if the default file is changed, if new formatting characteristics are required, or if logging is required. The `City` class should not know anything about printing. In fact, this violates the Single-Responsibility Principle. Changes to either the print specification or the city specification necessitate changes to the `City` class.

To solve this issue, move the print functions to their own `Printer` class. The `print` function in `City` becomes a wrapper to the actual functions in `Printer`. (Another solution is to have the client collect the city data and pass it to the `print` method of a `Printer` object). A real-world class for printing would be much more detailed and include a more sophisticated interface. However, this example demonstrates how both classes now have a single core responsibility. Changes to the printing mechanism only affect the `Printer` class. Changes to the city definition can only affect the `City` class. The city information is printed using the `print` method from the `Printer` object's interface.

{{< file "city.py" python >}}

class City:
def __init__(self, latitude, longitude, country, timezone, population):
    # Initialize the object

def getCityAttributesString(self)
    # Build a string containing the city attributes
    return string

def print(self, file, method):
    # Print to the specified file or default
    cityString = self.getCityAttributesString()
    ptr = Printer(file, method)
    rc = ptr.print(cityString)
{{< /file >}}

{{< file "printer.py" python >}}

class Printer:
def __init__(self, file, method):
    # Initialize the object

def print(self, data):
    # Call the right method inside the printer corresponding to the print method, for example, `printToFile`.

def printToFile(self, data):
    # Print to the specified file or default

def printToStdOut(self, data):
    # Print using `print` function
{{< /file >}}

### Open-Closed Principle

The *Open-Closed Principle* states the following:

**Developers should be able to extend class behavior, without modifying it.**

Put another way, the class should be "open" for extension, but "closed" for modification. This is because modifying a class can introduce side effects and break the code which can be difficult to detect. If the code is merely extended and not altered, the additions can be verified through the creation of new test cases. Existing functionality should be unchanged and existing test cases must not fail.

Although this goal is definitely worth striving for, it might be difficult to always adhere to it. Most bug fixes involve modifying the code. But sometimes a complete overhaul or refactoring of the code is required to scale or update the application. This is often a judgment call, but this principle results in a cleaner and more maintainable code. Some specific advantages of this principle include the following:

- It keeps interfaces clear and well defined
- It ensures each method is focused while avoiding complex spaghetti code and obvious "hacks"
- It reduces the amount of testing required to validate a change
- It eliminates the chance of introducing subtle defects elsewhere in the codebase
- Documentation and comments are more likely to remain accurate and unchanged

As an example, assume the specification of the `Printer` class from the last example has to change. The user can now choose between regular and fancy printing. It might seem easy and trivial to add a new parameter to the `print` method and add some conditional logic to the code. With the change, the class might read like the following:

{{< file "printer.py" python >}}

class Printer:
def __init__(self, file, method):
    # Initialize the object

def print(self, city, fancy):
    # Verify whether fancy printing has been chosen and set additional parameters
    # Call the right method inside the printer corresponding to the print method, for example, `printToFile`.

def printToFile(self, city):
    # Print to the specified file or default

def printToStdOut(self, city):
    # Print using `print` function
{{< /file >}}

Unfortunately, the interface has to change to accept the new parameter. This might also affect other functions using this code. One way to fix this is to create a wrapper function named `fancyPrint`. This function can implement the new functionality and then either call the original `print` function or invoke a newly-created function for the actual printing.

{{< file "printer.py" python >}}

class Printer:
def __init__(self, file, method):
    # Initialize the object

def print(self, city):
    # Call the right method inside printer corresponding to the print method, for example, `printToFile`.

def fancyPrint(self, city, print_params):
    # Implement the fancy parameters and call `print`

def printToFile(self, city):
    # Print to the specified file or default

def printToStdOut(self, city):
    # Print using `print` function
{{< /file >}}

Unlike some of the guidelines, the Open-Closed Principle can usually be satisfied using a variety of approaches. Another alternative is to have a `FancyPrinter` class that extends `Printer` and implements its own `print` function. Unfortunately, overriding too much behavior from a parent class can also cause problems. `fancyPrint` could also be added to `fancyPrinter` rather than the base class, but this means it is not available to other subclasses derived from `Printer`. Factors including the degree of difference between "fancy printing" and regular printing and whether other subclasses might use this function could influence this decision.

### Liskov Substitution Principle

The *Liskov Substitution Principle* states:

**Derived classes must be substitutable for their base classes.**

Another way of phrasing this is:

**Functions that use pointers or references to base classes must be able to use objects of derived classes without knowing it.**

This principle emphasizes the importance of clean interfaces and "black box" design. Liskov's principle explains how inheritance should work in a properly-designed object-oriented design model. Any time a parent class can be used, a subclass must be able to replace it without any loss of functionality. Whenever a method expects an object from the base class, it should also be able to accept an object representing a subclass. The subclass must accept the same number of arguments and the return values from all methods must have the same type.

{{< note respectIndent=false >}}
This is the most technical subject on the list and requires some background in object-oriented programming. For more information on inheritance and an introduction to the OOP concepts discussed in this section, see the [Wikipedia page on inheritance](https://en.wikipedia.org/wiki/Inheritance_(object-oriented_programming)).
{{< /note >}}

In inheritance models designed around Liskov's principles, subclasses seamlessly extend the functionality of the base class. A client can confidently use the base class methods of the object no matter what subclass the object actually represents. The subclass must be able to stand in for the main class in all situations. In a badly-designed example, the subclass introduces confusing or contradictory behavior, increasing the chance of defects. It could also unwittingly constrain a method to the point where basic functionality is no longer available. In this case, the subclass no longer fully supports the behavior of the parent class.

Most subclasses naturally follow Liskov's model. In fact, many languages strictly enforce this principle at the compiler stage. Developers have to go out of their way to break it. It is much easier to write code complying with Liskov's principle than to demonstrate how to violate it. Problems typically occur when overly-clever code is written. They can also happen when a subclass is created that is not a proper instance of the base class. When this model is neglected, it can result in a strange and unexpected behavior.

Some advantages of following the Liskov substitution principle include the following:

- It results in more robust and easy-to-understand interfaces
- The inheritance model is clear and obvious and simplifies the code
- It forces developers to carefully consider their class and inheritance design
- It allows any client function or class to use any methods in the base class without worrying about side effects
- It reduces the amount of testing required, and the number of corner cases to be handled

A violation of the `City` class from the first section occurs when the class is extended through the `CityAntipode` subclass. The antipode is the point on the globe directly opposite the actual city. At first glance, it might make sense for this to be a subclass. It has a latitude and longitude, for instance. And it is possible, although not easy, to figure out its time zone. However, it does not necessarily belong to any country. It does not have a population. So the implementation would have to override the base class constructor to set these values to an empty string. It might have to override the `setCountry` function to silently return a positive result without changing the value.

{{< file "cityAntipode.py" python >}}

class CityAntipode(City):
def __init__(self, latitude, longitude, country, timezone, population):
    # Initialize the object
    self.latitude = latitude
    ...
    self.population = 0
    self.country = ""

def setCountry(self, country)
    # do not set the country. Return True to signal everything is okay.
    return True
{{< /file >}}

This might appear to be a satisfactory inheritance model. But the problems with it are obvious. A different list might process the list of `City` objects, extracting each country and passing it to a function named `getCountryPhoneCode`. It expects each `City` object to be part of a valid country and is not validating the string. Meanwhile, `getCountryPhoneCode` requires client validation of the country beforehand. This design might lead to a bug or even a crash.

A better example is to realize an antipode is not a city and this class should not extend the `City` class. It overrides and eliminates too much of the information and functionality from the base class. It should be its own class. An independent class would exclude the `country` and `population` variables and would not allow clients to set or get these items. The following code represents a stronger class definition.

{{< file "antipode.py" python >}}

class Antipode:
def __init__(self, latitude, longitude, timezone):
    # Initialize the object
{{< /file >}}

### Interface Segregation Principle

The *Interface Segregation Principle* advises developers to:

**Make fine-grained interfaces that are client-specific.**

This is often restated as:

**Many client-specific interfaces are better than one general-purpose interface**

This is another concept that forces developers to closely consider their class design. A class should include the necessary variables and methods, and nothing more. The interface should be as short and straightforward as possible. Large and bloated base classes force subclasses to implement unnecessary or meaningless functions. If a class is too generic, it is likely not targeted enough to represent the object practically. It is more likely to contain over-generalizations, contradictions, and even absurdities.

This problem typically happens when classes and inheritance models are created without enough thought. There is often a pressing deadline to publish the interface, and a large and overly generic interface is one way to get this done quickly. The work of creating the subclasses and writing the constructors becomes more complex, but this happens after the damage has already been done.

Some advantages of applying the Interface Segregation Principle include the following:

- It results in a cleaner and simpler interface
- It avoids unnecessary work
- The inheritance model is easy to explain and understand
- A finely-grained interface is more likely to also satisfy Liskov's principle
- It avoids generating a cluster of corner-case test cases to ensure all the absurdities are properly dealt with

Fortunately, this is one of the easier problems to avoid. Interface segregation violations can often be fixed through the creation of additional, more specific classes. Each class should closely and accurately represent the item it models and only contain essential attributes. The collection of subclasses derived from the parent class should be more alike than they are different. For instance, a `Canine` parent class extended through `Dog`, `Wolf`, and `Fox` subclasses makes sense. However, a `LivingOrganism` class representing everything from artichokes to aardvarks is much too large.

Consider how this class might be constructed in the following example:

{{< file "livingOrganism.py" python >}}

class LivingOrganism:
def __init__(self, genus, species, color, weight, offspring, fruit):
    # Initialize the object

def run(self, speed)
    model the creature as running

def plant(self, soil)
    model the organism as being planted
{{< /file >}}

This interface has several obvious problems. An animal does not get planted, while a tree cannot run. `Offspring` is not typically a valid concept for wild plants.

The base class should be at least as specific as `Animal`. Depending on the model, `Vertebrate` might be even better. `Mammal` could be a subclass of `Vertebrate`, while `Canine` inherits from `Mammal`. With a trimmed-down interface, all variables and methods should make sense for all derived objects.

### Dependency Inversion Principle

The *Dependency Inversion Principle* states:

**Depend on abstractions, not on concretions.**

Due to the way it is worded, this principle is somewhat more difficult to understand. Implementation of a class and its interface should be done in as abstract and high-level manner as possible. Details about low-level operations, including printing or writing to a file, should be hidden from the client. Instead, the two layers should be decoupled through a generic interface. This allows the client to focus on what is to be done instead of worrying about how it is done.

For instance, if a client wants to connect to another computer, it should not be aware of the type of connection being used. When a client function must create a `TCP` object and calls `OpenTCPConnection`, it has too much concrete information about the connection. A `Connection` object provides a higher-level interface. The `Connect` function within the class should figure out what type of connection is required.

Some of the advantages of designing code using the Dependency Inversion principle are:

- It promotes modularity between components
- It promotes compliance with many of the other principles, including the single-responsibility principle
- It eliminates the necessity to change code in many places if the underlying layer changes
- It reduces the amount of testing required
- It is more change-resistant

In general, code designed using the other four principles should satisfy this principle with no additional changes. However, it is possible to believe the code is properly decoupled when the implementation is still far too concrete. The following application contains a `ShareFile` class to transfer a file to another device. The class creates an `FTPConnect` object and sets up parameters for an FTP connection. This violates the Dependency Inversion Principle and the idea that a class should be decoupled from the specific lower-level details. The actual file transfer could be handled by SFTP, FTPS, HTTPS, or something else. If it changes, the `ShareFile` class has to change too.

{{< file "shareFile.py" python >}}

class ShareFile:
def __init__(self, filename, destination):
    # Initialize the object

def sendFile(self)
    ftpConn = FTPConnect(self.destination)
    rc = ftpConn.SendFile(self.filename)
{{< /file >}}

A better approach is to create a `Connect` object and let it decide how to handle the transfer.

{{< file "shareFile.py" python >}}

class ShareFile:
def __init__(self, filename, destination):
    # Initialize the object

def sendFile(self)
    conn = Connect(self.destination)
    rc = conn.SendFile(self.filename)
{{< /file >}}

## Conclusion

The five SOLID programming principles help structure and organize object-oriented software projects. These directives assist programmers in maintaining modularity and properly-structured class and interface design. The five guidelines are the Single-Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion principles. Computer programming benefits from the SOLID principles due to increased maintainability, fewer bugs, decreased test resources, and more straightforward documentation.

Many of these principles are interconnected, and breaking one principle often causes others to fail. It is usually not difficult to design software following these rules. Most failures result from rushing through the implementation or taking shortcuts. In particular, spend more effort at the front of the project on the class and interface design. Admittedly, there might be occasions to override these guidelines, especially the Open-Closed Principle. However, developers must ensure they are breaking these guidelines for a valid reason and not because proper development takes a bit more thought and effort.