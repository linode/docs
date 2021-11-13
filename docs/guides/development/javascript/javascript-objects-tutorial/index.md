---
slug: javascript-objects-tutorial
author:
  name: Linode Community
  email: docs@linode.com
description: "Learn about JavaScript objects, with examples showing their parts and how to start working with them."
og_description: "Learn about JavaScript objects, with examples showing their parts and how to start working with them."
keywords: ['javascript objects','javascript objects properties','javascript objects prototype']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-11
modified_by:
  name: Nathaniel Stickman
title: "Javascript Objects Tutorial"
h1_title: "Javascript Objects Tutorial"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[MDN Web Docs: Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)'
- '[MDN Web Docs: Inheritance and the Prototype Chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)'
- '[MDN Web Docs: Working with Objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects)'
---

Objects are fundamental to JavaScript. But what exactly are they, and how do they work? This tutorial walks you through understanding JavaScript objects, including properties, methods, and prototypes, all with examples to illustrate.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On Debian and Ubuntu, you can do this with:

            sudo apt update && sudo apt upgrade

    - On AlmaLinux, CentOS (8 or later), or Fedora, use:

            sudo dnf upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## What Are JavaScript Objects?

Objects make up a fundamental data type in JavaScript, alongside the primitive data types like numbers, strings, booleans, etc.

Each object has a type and a collection of properties. In fact, you can think of objects as just that — collections of properties. An object's properties, as you can see in the next section, can include nearly anything. This means not just primitive data types, but also functions and even other objects.

The next couple of sections break down JavaScript objects, explaining properties and methods and giving you examples of how to use them.

### JavaScript Object Properties

Objects consist of zero or more properties. These can be either primitive data types (boolean, number, string, etc.), methods (that is, functions operating within an object), or other objects.

Each property has a key, which can be an identifier, a number, or a string. Most of the time, identifiers are used, like in this example of a `house` object:

    const house = {
        address:        "123 Street St",
        bedrooms:       2,
        baths:          1.5,
        vacant:         true,
        phoneNumber:    "123-456-7890",
        inquire:        function() {
                            console.log("Calling " + this.phoneNumber + "....");
                        }
    }

Typically, you access properties via dot notation, as in:

    house.address;

{{< output >}}
'123 Street St'
{{< /output >}}

But sometimes you need to use bracket notation. This is the case when a property's key is a number or when you want to reference a key using a variable, as in:

    let currentKeyOfInterest = 'vacant';
    house[currentKeyOfInterest];

{{< output >}}
true
{{< /output >}}

You can use the `Object.keys` method to get a list of all the keys on a given object:

    Object.keys(house)

{{< output >}}
[ 'address', 'bedrooms', 'baths', 'vacant', 'phoneNumber', 'inquire' ]
{{< /output >}}

The fact that the method returns an array makes it useful if you want to iterate through an object's properties, as in:

    for (const key of Object.keys(house)) {
        if (typeof house[key] != 'function') {
            console.log("\t==\t" + key.padEnd(16) + "\t=>\t\t" + String(house[key]).padEnd(16) + "\t==\t")
        }
    }

{{< output >}}
    ==  address             =>      123 Street St       ==
    ==  bedrooms            =>      2                   ==
    ==  baths               =>      1.5                 ==
    ==  vacant              =>      true                ==
    ==  phoneNumber         =>      123-456-7890        ==
{{< /output >}}

### JavaScript Object Methods

An object can also have methods, which are just what functions are called when they are attached to an object. Methods are a kind of property that allows an object to take actions. The `inquire` property in the example above is a method on the `house` object, which can be used like:

    house.inquire();

{{< output >}}
Calling 123-456-7890....
{{< /output >}}

These can be especially useful for processing information from other properties on an object. You can see this in the `inquire` method, which takes the `phoneNumber` property from its parent object and processes it for presentation to the user.

### JavaScript Object Self Reference

The `this` keyword is JavaScript's way for an object to reference its own properties. You may have noticed above that the `inquire` method uses `this.phoneNumber` to access a property on its parent object. Using this object, methods can provide objects with values based on the object's other properties.

Below is another example, extending on the `house` object above:

    house.bedBathRatio = function() {
        return this.baths / this.bedrooms;
    }

    house.bedBathRatio();

{{< output >}}
0.75
{{< /output >}}

## How to Create a JavaScript Object

JavaScript provides several ways to create objects. Which one you use depends on your needs, as each approach has its own characteristics.

The next sections walk you through the main approaches, explaining the advantages of each and giving you examples of how to use them.

### Using an Initializer

The approach used to declare the `house` example above uses an object initializer. With this approach, you declare your object as a variable using object literal notation.

Here is another example for reference:

    const socrates = {
        name: "Socrates",
        role: "Philosopher",
        fingers: 10,
        mortal: true
    }

### Using a Constructor

An object constructor is a function that defines an object type. You can then create a new object of that type using `new`:

    function Person(name, role, fingers) {
        this.name = name;
        this.role = role;
        this.fingers = fingers;
        this.mortal = true;
        this.greeting = function() {
            console.log("Hello, I'm " + this.name + ". I'm a " + this.role + ", and have " + this.fingers + " fingers.");
            if (this.mortal) {
                console.log("And, as you would expect, I'm mortal.");
            } else {
                console.log("And, as impossible as it seems, I'm immortal.");
            }
        }
    }

    const socrates = new Person("Socrates", "Philosopher", 10);
    const galileo = new Person("Galileo", "Astronomer", 7);

    socrates.greeting();
    galileo.greeting();

{{< output >}}
Hello, I'm Socrates. I'm a Philosopher, and have 10 fingers.
And, as you would expect, I'm mortal.

Hello, I'm Galileo. I'm a Astronomer, and have 7 fingers.
And, as you would expect, I'm mortal.
{{< /output >}}

This approach is useful when you expect to have multiple objects of the same base type, especially when you want to create those objects programmatically.

You can even extend on your constructors using additional constructors. Below, a `Philosopher` constructor extends on the `Person` constructor defined above:

    function Philosopher(name, fingers, branch) {
        Person.call(this, name, "Philosopher", fingers);
        this.branch = branch;
        this.greeting = function() {
            console.log("Hello, my name is " + this.name + ", and I'm a " + this.branch + " " + this.role + ".");
        }
    }

    const another_socrates = new Philosopher("Socrates", 10, "Socratic");

    another_socrates.greeting();

{{< output >}}
Hello, my name is Socrates, and I'm a Socratic Philosopher.
{{< /output >}}

### Using the Object.create Method

Using the `Object.create` method allows you to create objects by using an existing object as a prototype. You can learn more about object prototypes in the next section.

This approach otherwise has similar characteristic to using an object constructor function. It favors cases when you want multiple objects of the same type and when you want to declare objects programmatically:

    const Person = {
        name: "Nemo",
        role: "None",
        fingers: 10,
        mortal: true
    }

    const socrates = Object.create(Person)
    socrates.name = "Socrates"
    socrates.role = "Philosopher"

    socrates.name;
    socrates.fingers;

{{< output >}}
'Socrates'
10
{{< /output >}}

## How Does JavaScript Object Inheritance Work?

JavaScript objects are able to inherit both types and properties from parent objects. This is especially clear with the last example above, where the `socrates` object received all of the properties of the `Person` object.

This is due to JavaScript's prototype system. Read on to learn more about how prototypes work and enable object inheritance in JavaScript.

### JavaScript Object Prototypes

All JavaScript objects have at least one prototype. When one object is created from another, the parent object becomes a prototype for the child object. Each object holds a reference to its parent prototype, creating what is called a *prototype chain*, connecting back from one prototype to the next.

At the end of the prototype chain, all objects have `Object` as a prototype. Even the `Person` object above, for instance, has `Object` as its prototype:

    Object.getPrototypeOf(Person);

The output is an empty object literal, representing the `Object` type:

{{< output >}}
{}
{{< /output >}}

(`Object` itself actually has `null` as a prototype, which ends the prototype chain.)

So, for the `socrates` object above, the prototype chain would be: `socrates` -> `Person` -> `Object`.

As you saw further above, objects can access properties from their prototype chains. When you try to access the `fingers` property on the `socrates` object, JavaScript starts by looking on the object itself. But then, not finding it there, JavaScript moves backward through each prototype in the chain until it finds one with the property or reaches the end of the chain.

For example, below shows how the `socrates` object only has two properties directly associated with it. These are called its *own properties*:

    Object.keys(socrates)

{{< output >}}
[ 'name', 'role' ]
{{< /output >}}

At the same time, the object can still access the `fingers` property, which is associated with the `Person` prototype:

    socrates.fingers

{{< output >}}
10
{{< /output >}}
