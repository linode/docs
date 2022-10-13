---
slug: oop-principles
author:
  name: Nathaniel Stickman
description: "What are the four major OOP principles? This guide will discuss object-oriented programming concepts and provide real-world examples."
keywords: ['oop principles','oop concepts','oop concepts in java']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-06-10
modified_by:
  name: Linode
title: "Object-Oriented Programming Concepts, Explained"
h1_title: "A Guide to OOP Principles in Java"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[GeeksforGeeks: Object Oriented Programming (OOPs) Concept in Java](https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/)'
- '[ParTech: Basic Principles of Object-oriented Programming](https://www.partech.nl/en/publications/2020/10/basic-principles-of-object-oriented-programming#:~:text=The%20basic%20principles%20of%20OOP,any%20object%2Doriented%20programming%20language.)'
- '[Munish Chandel: What are Four Basic Principles of Object Oriented Programming?](https://medium.com/@cancerian0684/what-are-four-basic-principles-of-object-oriented-programming-645af8b43727)'
- '[Key Lime Interactive: The Four Pillars of Object Oriented Programming](https://info.keylimeinteractive.com/the-four-pillars-of-object-oriented-programming)'
---

Object-oriented programming gives you a set of programming principles to make your code more compartmentalized and reusable. Object-oriented programming accomplishes this by structuring programs around objects. This tutorial covers the core principles of object-oriented programming and provides examples of these concepts written in Java.

## What is Object Oriented Programming (OOP)?

Object-oriented programming — often abbreviated "OOP" — is a set of programming principles centered on objects. Such a set of principles is called a programming *paradigm*. Objects in OOP can hold attributes and be assigned behaviors, and they allow developers to structure programs around reusable, self-contained components.

Because of its object-oriented focus, OOP shines when used for applications that need objects to be at their logical center. This is the case with user interfaces, one of the most common places to see OOP used, as well as business applications.

## OOP Concepts in Java You Need to Know

Object-oriented programming tends to make use of four structures. These form the bedrock of all of the pieces a developer has to work with when building object-oriented programs.

- **Classes**: These act as blueprints for objects. They define underlying properties and behaviors which can be inherited by other classes and by objects. Your OOP program's collection of classes creates a structure off of which the rest of the program gets built.

    Often, in Java, code is constructed with one class per file. The class syntax resembles the following example:

    {{< file >}}
public class ClassName {
    // Code related to the class.
}
    {{< /file >}}

- **Objects**: These are derived from classes and populate the abstract of their classes' properties with concrete values. They are the things built from the blueprints provided by classes. Objects also tend to be where the behaviors defined on classes get executed, bringing your application to life.

    Java lets you instantiate an object from a class using the `new` keyword. Here, a new object gets created from the class created above. This example works when the class has a *constructor* defined. You can see an example of a constructor definition in the [Examples of Object Oriented Programming](/docs/guides/oop-principles/#examples-of-object-oriented-programming) section further on.

    {{< file >}}
ClassName objectName = new ClassName();
    {{< /file >}}

- **Attributes**: These are fields (or properties) defined on classes and which represent the state of a particular object. A class might, for instance, define an `attributeOne` as a `String` type. An object derived from that class can then use that attribute, assigning it `attributeOne = "a string"`, for example.

    This next example shows what it could look like to add an attribute to the `ClassName` class created above:

    {{< file >}}
public class ClassName {
    public attributeOne = "a string";
}
    {{< /file >}}

- **Methods**: These are functions defined on classes, and they provide objects with behaviors. Methods typically act on the values held by an object's attributes, allowing each object to act in a self-contained way.

    In the following example, you can see what it looks like to add a basic method to a class, using the `ClassName` example started above:

    {{< file >}}
public class ClassName {
    public attributeOne = "a string";

    public void methodOne() {
        System.out.println("The method has been called!");
    }
}
    {{< /file >}}

## 4 Basic OOP Principles

In addition to the four basic parts, object-oriented programming has four fundamental concepts. These are what primarily make OOP stand out, and developers rely on these when making the most effective and reusable OOP code.

These next four sections cover the four principles of OOP, giving you an overview of the roles they play. Then, keep reading to find a section with examples, in Java, each of which demonstrates these principles in action.

### Encapsulation

This principle ensures that objects are self-contained and limits what information about their state they expose. In other words, other objects cannot directly access the state of an object. Each object manages its own state. To modify an object's state, other objects need to use that object's dedicated methods.

So, for instance, say you have an object called `firstObject`. That object has two attributes, `attributeOne` and `attributeTwo`. Encapsulation prevents another object, say `secondObject`, from modifying the values of the attributes on `firstObject`.

Now, `firstObject` has control of its own state. It may, for instance, define a method called `setAttributeOne` that outside objects can access. This way, `secondObject` can make changes to `attributeOne` on `firstObject`. But if `firstObject` does not define a similar method for `attributeTwo`, `secondObject` has no means of modifying it.

Encapsulation can make OOP applications easier to upgrade and easier for collaboration. An engineer working on one object would thus be less likely to cause breaking changes to an object someone else is working on.

Encapsulation also makes it easier to keep track of objects' states. These states can become complicated, and more so the more outside access they allow. By ensuring that each object controls its own state, you make the code easier for yourself and other developers to follow and maintain.

### Data Abstraction

This principle states that classes include only the details relevant to their context. Doing so creates abstract classes, which more specific classes and objects can extend.

Take the example of a `Pet` class. You can make this class to define, in the most general way, the characteristics of pets. So, the class may have `name`, `diet`, and `health` attributes. Now you can extend that class with more specific kinds of `Pet`. For instance, you may define a `Dog` class that extends `Pet` and adds a `bark` method. At the same time, you can also define a `Cat` class similarly extending on `Pet`.

One of the goals of abstraction is to define common characteristics. Using the example above, `Dog` has the unique behavior of the `bark` method, but otherwise it shares things like having a `name` in common with other pets. Abstraction makes it so that you do not need to redefine these attributes for each specific kind of pet.

Abstraction also allows you to evaluate various classes by common abstract classes. So long as you know that both `Cat` and `Dog` extend `Pet`, you can evaluate them based on the common attributes held in `Pet`.

{{< file >}}
if (obj eitherCatOrDog instanceof Pet) {
    System.out.println("This is my pet, " + eitherCatOrDog.name + ".");
}
{{< /file >}}

### Inheritance

This principle declares that objects get some or all of the properties of their parents. Inheritance is the foundation of reusability in OOP. With it, you can create a class and its properties can be reused in multiple objects.

For example, you can start with a `ClassName` class from which you create two objects, `objectOne` and `objectTwo`. Each of these objects inherits from the parent class, `ClassName`, and receives all of its attributes and methods. The objects can then each individually work with those attributes and methods. But the important feature is that the `ClassName` class acts as a common and reusable base.

In Java, such parent classes are called *super* classes. Commonly, classes inheriting from super classes are called *sub* classes. This means that you can make additional classes that inherit from super classes, so that you can have a chain of inheritance.

Take a look at the `Pet` example above again. You have a `Cat` class and a `Dog` class that inherit from `Pet`, thus gaining its attributes. From there, you can create specific objects that inherit from the new classes:

{{< file >}}
Pet myDog = new Dog();
{{< /file >}}

The new object inherits not only properties of the `Dog` class — like the `bark` method — but also those on the `Pet` class, like the `name` attribute.

### Polymorphism

This principle states that each sub class can be used in the same way as its parent class or parent classes. At the same time, each sub class may keep its own, distinct form of attributes and methods initially defined in a super class.

Polymorphism is one of the more complicated features of OOP, but it plays a useful role. To help you understand it, below is an example that reworks the `Pet` example elaborated in the sections above.

Say, for instance, when creating the `Pet` class, you include a method called `makeSound`:

{{< file >}}
class Pet {
    public String name = "None";
    public String diet = "Herbivore";
    public boolean healthy = true;

    public void makeSound() {
        System.out.println("This is my pet sound.");
    }
}
{{< /file >}}

Obviously, the effect of `makeSound` should be different for `Cat` and `Dog`, even though both, being pets, do make sounds:

{{< file >}}
class Cat extends Pet {
    public String diet = "Carnivore";

    public void makeSound() {
        System.out.println("Meow.");
    }
}

class Dog extends Pet {
    public String diet = "Omnivore";

    public void makeSound() {
        System.out.println("Bark.");
    }
}
{{< /file >}}

Following polymorphism, you can, indeed, use any property from the `Pet` class on any object deriving from the `Cat` and `Dog` classes. The effect may be different — you get a different sound from the `makeSound` method — but all of the parts are still there.

## Examples of Object Oriented Programming

This section includes snippets of code that give examples of OOP concepts in Java. These are aimed to simultaneously show off some of the components of OOP as well as the four core principles discussed above. The examples also familiarize you with the elements of Java that relate to OOP.

Starting simple, this first example shows a single Java class, not counting the default `Main` class used to start up the program. This class covers all of the parts — class, object, attribute, and method — of OOP mentioned above.

{{< file >}}
// Create a class.
class BookShelf {
    // Declare the class attributes.
    public int numberOfBooks;

    // Implement a constructor. This is used to create objects from the class,
    // which you can see done in the `Main` class below.
    public BookShelf(int initialNumberOfBooks) {
        numberOfBooks = initialNumberOfBooks;
    }

    // Provide a method to add more books to the shelf.
    public void addBooks(int numberToAdd) {
        numberOfBooks += numberToAdd;
    }

    // Provide a method to display the count of books on the shelf.
    public void showBookCount() {
        System.out.println("The shelf has " + numberOfBooks + " books.");
    }
}

class Main {
    public static void main(String args[]) {
        // Use the `BookShelf` class's constructor to create a BookShelf object;
        // it also lets us specify how many books the object starts with.
        BookShelf thisBookShelf = new BookShelf(5);
        thisBookShelf.addBooks(2);
        thisBookShelf.showBookCount();
    }
}
{{< /file >}}

{{< output >}}
The shelf has 7 books.
{{< /output >}}

Now, this next example is a little more ambitious. It has three classes — again, not counting the `Main` class. The first, `GamingConsole`, acts as a `super` on which other classes can extend. That is exactly what the second class, `PlayStation`, does — extends on the `GamingConsole` class. The last class, `PlayStation4`, does the same, but with the `PlayStation` class as its direct parent.

This chain of extensions lets the example demonstrate several of the concepts of OOP at once. Each extension shows the concept of *abstraction* in action. The `PlayStation` class is able to make use of both attributes and methods from its parent, demonstrating *inheritance*. And the `PlayStation4` class illustrates *polymorphism* through its identification with the `GamingConsole` super class during construction in the `Main` class.

{{< file >}}
// Create a super class, from which the other classes ultimately extend.
class GamingConsole {
    // Declare attributes.
    public String consoleType;
    public String currentGame;

    // Provide a cosntructor to set initial values.
    public GamingConsole(String initialConsoleType, String initialGame) {
        consoleType = initialConsoleType;
        currentGame = initialGame;
    }

    // Provide two methods that should be common to all gaming consoles.
    public void insertGame(String gameName) {
        currentGame = gameName;
    }

    public void playGame() {
        System.out.println("Starting up the " + consoleType + " console.");
        if (currentGame == "") {
            System.out.println("No game in the console.");
        } else {
            System.out.println("Playing " + currentGame + ".");
        }
    }
}

// Create a sub class for a specific category of gaming console.
class PlayStation extends GamingConsole {
    // Declare attributes.
    public boolean controllerConnected;

    // Provide a constructor.
    public PlayStation(String initialGame, boolean initialControllerConnected) {
        super("PlayStation", initialGame);
        controllerConnected = initialControllerConnected;
    }

    // Provide a method unique to this category of gaming consoles. (This
    // feature is not actually unique to PlayStation consoles, but just
    // pretend for the purposes of illustration.)
    public void connectController(boolean isControllerConnected) {
        controllerConnected = isControllerConnected;
    }

    // Override the default `playGame` method with a specific implementation
    // for `PlayStation` objects.
    public void playGame() {
        if (controllerConnected == false) {
            System.out.println("Connect a controller before playing.");
        } else {
            super.playGame();
        }
    }
}

// Create another sub class for an even more specific category, this being
// a type of PlayStation gaming console.
class PlayStation4 extends PlayStation {
    // Provide a constructor.
    public PlayStation4(String initialGame, boolean initialControllerConnected) {
        super(initialGame, initialControllerConnected);
        consoleType = "PlayStation 4";

        initiateWelcome();
    }

    // Provide a specific method for PlayStation 4 consoles.
    public void initiateWelcome() {
        System.out.println("Welcome to " + consoleType + ".");
    }
}



class Main {
    public static void main(String args[]) {
        // Instantiate a `PlayStation4` object. Notice the polymorphism
        // implied by the fact that we can use `GamingConsole` to identify
        // the new object's type.
        GamingConsole thisConsole = new PlayStation4("", true);

        // Use the two methods inherited from the `GamingConsole` super class.
        thisConsole.insertGame("Minecraft");
        thisConsole.playGame();
    }
}
{{< /file >}}

{{< output >}}
Welcome to PlayStation 4.
Starting up the PlayStation 4 console.
Playing Minecraft.
{{< /output >}}

## Conclusion

In this guide you learned the fundamental principles of object-oriented programming. The concepts covered were encapsulation, abstraction, inheritance, and polymorphism. Applying these concepts helps to ensure that you are making the most of what the paradigm can do.

Throughout this tutorial, the focus has been on OOP related to Java. But keep in mind that these concepts apply anywhere that supports object-oriented programming. [JavaScript](/docs/guides/development/javascript/), [Python](/docs/guides/development/python/), and [Ruby](/docs/guides/development/ror/) are popular examples.


