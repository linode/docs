---
slug: javascript-objects-tutorial
description: "JavaScript objects include key-value properties and methods and support inheritance. This tutorial discusses JavaScript objects, object inheritance, and the keyword this."
keywords: ['javascript objects','javascript objects properties','javascript objects prototype']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-04-15
modified_by:
  name: Linode
title: "An Introduction to Javascript Objects"
title_meta: "A Javascript Objects Tutorial"
external_resources:
- '[MDN Web Docs: Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)'
- '[MDN Web Docs: Inheritance and the Prototype Chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)'
- '[MDN Web Docs: Working with Objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects)'
authors: ["Nathaniel Stickman"]
---

Objects play a fundamental role in JavaScript and appear just about everywhere throughout the language. This tutorial explains what JavaScript objects are and discusses object properties, methods, and prototypes. Each topic includes examples to illustrate their concepts.

## Before You Begin

This guide's JavaScript examples were originally run in the Node.js interpreter. You can use our [How to Install and Use the Node Version Manager NVM](/docs/guides/how-to-install-use-node-version-manager-nvm/#installing-and-configuring-nvm) guide to install Node.js on your computer.

Alternatively, you can use your web browser's JavaScript console to run this guide's example JavaScript code.

- If you are using Chrome, refer to Google's [Run JavaScript in the Console](https://developer.chrome.com/docs/devtools/console/javascript/) documentation to learn how to access their developer tools..

- If you are using Firefox, refer to Mozilla's [Browser Console](https://developer.mozilla.org/en-US/docs/Tools/Browser_Console) documentation to learn how to access their developer tools..

## What Are JavaScript Objects?

The object is the fundamental data type in JavaScript, outside of primitive data types like numbers, strings, booleans, etc.

An object is a collection of properties. A property is a key-value pair. In JavaScript, nearly anything can be a property. This includes not just primitive data types, but also functions and other objects.

The next couple of sections further explain JavaScript objects, properties, and methods. They also provide examples on how to use JavaScript objects.

### JavaScript Object Properties

Objects consist of zero or more properties. These can be either primitive data types (boolean, number, string, etc.), methods (that is, functions operating within an object), or other objects.

Each property has a key, which can be an identifier, a number, or a string. Most of the time, identifiers are used, like in the example below of a `house` object:

    const house = {
        address: "123 Street Rd",
        bedrooms: 2,
        baths: 1.5,
        vacant: true,
        phoneNumber: "123-456-7890",
        inquire:  function() {
            console.log("Calling " + this.phoneNumber + "....");
        }
    };

Typically, you access properties using dot notation. The example accesses the value of the `address` property:

    house.address;

{{< output >}}
'123 Street St'
{{< /output >}}

You can also use bracket notation, as shown in the example below. Sometimes, bracket notation is required, like when a property's key is a number or when you want to reference a key using a variable:

    let currentKeyOfInterest = 'vacant';
    house[currentKeyOfInterest];

{{< output >}}
true
{{< /output >}}

If you want to list all of the properties of an object, you can use the `Object.keys` method:

    Object.keys(house);

{{< output >}}
[ 'address', 'bedrooms', 'baths', 'vacant', 'phoneNumber', 'inquire' ]
{{< /output >}}

The fact that the method returns an array makes it useful if you want to iterate through an object's properties. The example JavaScript for loop iterates over the keys of the `house` object created at the beginning of this section:

    for (const key of Object.keys(house)) {
        if (typeof house[key] != 'function') {
            console.log("==\t" + key.padEnd(16) + "\t=>\t\t" + String(house[key]).padEnd(16) + "\t==\t");
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

Any property that defines a function is called a *method*. These properties allow objects to take an action. For example, the `inquire()` method on the `house` object above prints a message to your JavaScript console. The example below calls the `inquire()` method:

    house.inquire();

{{< output >}}
Calling 123-456-7890....
{{< /output >}}

Methods have direct access to an object's other properties, making them especially useful for processing information on an object. You can see this in the `inquire()` method itself. It takes the `phoneNumber` property from its parent object and processes it into a message for the user.

### JavaScript Object Self Reference

JavaScript's `this` keyword gives objects a way to reference their own properties. You may have noticed its use in the `inquire()` method. The method is able to reference `this.phoneNumber` to work with the property's assigned value.

Below is another example. This example uses dot notation to extend the existing `house` object with a new method. That method then uses the `this` keyword to reference two properties on its parent object:

    house.bathToBedroomRatio = function() {
        return this.baths / this.bedrooms;
    }

    house.bathToBedroomRatio();

{{< output >}}
0.75
{{< /output >}}

## How to Create a JavaScript Object

JavaScript offers you a few different ways to create objects. Each one has its own characteristics, so which one you use depends on your needs. The next sections walk you through each approach and explain their advantages with examples.

### Using an Initializer

Object initializers provide the most direct approach for creating an object. You can see it used to declare the `house` example in the [JavaScript Object Properties](/docs/guides/javascript-objects-tutorial/#javascript-object-properties) section. With this approach, you declare your object as a variable using object literal notation.

It has the advantage of being straightforward and is useful when declaring a standalone object that does not need inheritance.

Below is another example of the object initializer approach:

    const socrates = {
        name: "Socrates",
        role: "Philosopher",
        fingers: 10,
        mortal: true
    };

### Using the Object.create() Method

The `Object.create()` method allows you to create new objects from an existing object, which becomes the new object's prototype.

This method is useful when you want multiple objects using the same base and when you want to declare objects programmatically.

The example below creates a base `Person` object, then uses `Object.create()` method to make a specific object as an instance of that base. You then only have to define the properties that differ from the new object — `name` and `role` in this case.

    const Person = {
        name: "Nemo",
        role: "None",
        fingers: 10,
        mortal: true
    };

    const socrates = Object.create(Person)
    socrates.name = "Socrates"
    socrates.role = "Philosopher"

    socrates.name;
    socrates.role;

{{< output >}}
'Socrates'
'Philosopher'
{{< /output >}}

### Using a Constructor

An Object constructor is a function that defines an object type. You can then create a new object of that type using the `new` keyword.

This approach gives objects a consistent underlying type, and it can create iterations of relatively complex objects with a single line of code.

Like the `Object.create()` method, this approach is useful when you expect to have multiple objects from the same base or want to create objects programmatically. Using a constructor function lets you use more complex operations when initializing an object.

The example below defines the type `Person` through an object constructor function. With the `new` keyword, the example then declares two new objects using the constructor. Despite the objects having five properties, the constructor only requires two arguments (the third is optional):

    function Person(name, role, fingers) {
        this.name = name;
        this.role = role;
        this.fingers = fingers > 0 ? fingers : 10;
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

    const socrates = new Person("Socrates", "Philosopher");
    const galileo = new Person("Galileo", "Astronomer", 7);

    socrates.greeting();
    galileo.greeting();

{{< output >}}
Hello, I'm Socrates. I'm a Philosopher, and have 10 fingers.
And, as you would expect, I'm mortal.

Hello, I'm Galileo. I'm a Astronomer, and have 7 fingers.
And, as you would expect, I'm mortal.
{{< /output >}}

You can even extend your constructors using additional constructors. Below, a `Philosopher` constructor extends the `Person` constructor defined above:

    function Philosopher(name, fingers, branch) {
        Person.call(this, name, "Philosopher", fingers);
        this.branch = branch;
        this.greeting = function() {
            console.log("Hello, my name is " + this.name + ", and I'm a " + this.branch + " " + this.role + ".");
        }
    }

    const seneca = new Philosopher("Seneca", 10, "Stoic");

    another_socrates.greeting();

{{< output >}}
Hello, my name is Seneca, and I'm a Stoic Philosopher.
{{< /output >}}

## How Does JavaScript Object Inheritance Work?

JavaScript objects are able to inherit both types and properties from parent objects. You can see this with both the `Object.create()` and the object constructor examples above. This is due to JavaScript's prototype system which is discussed in the next section.

### JavaScript Object Prototypes

Every JavaScript object holds a reference to at least one other object, called its *prototype*. Even the most basic object has `Object` as its prototype, but other objects can inherit prototypes from parent objects or from constructor functions.

Below are two examples showing how an object can be given a prototype, one using `Object.create()` and the other using an object constructor. Each example uses the following `Animal` object for the prototype:

    const Animal = {
        name: "",
        kingdom: "Animalia",
        phylum: "Chordata",
        class: "Mammalia",
        family: "",
        genus: "",
        species: ""
    };

- Objects created using the `Object.create()` method automatically have the parent object as a prototype. You can see from the output below that only the three properties reassigned for the `indus_dolphin` object show up on that object instance. All of the other properties are stored on the prototype, `Animal`:

        const indus_dolphin = Object.create(Animal);
        indus_dolphin.name = "Indus River Dolphin";
        indus_dolphin.family = "Platanistidae";
        indus_dolphin.genus = "Platanista";
        indus_dolphin.species = "Platanista minor";

        Object.keys(indus_dolphin);
        Object.getPrototypeOf(indus_dolphin);

    {{< output >}}
[ 'name', 'family', 'genus', 'species' ]
{
  name: '',
  kingdom: 'Animalia',
  phylum: 'Chordata',
  class: 'Mammalia',
  family: '',
  genus: '',
  species: ''
}    {{< /output >}}

- Objects created using object constructors receive values from the constructor's `prototype` property. In this example, the constructor assigns the provided values. Then, a `prototype` is given for the constructor, which provides the resulting object, `ganges_dolphin`, with a prototype object:

        function Platanista(species_name, species) {
            this.name = species_name;
            this.species = species;
        }

        Platanista.prototype = Animal;
        Platanista.prototype.family = "Platanistidae";
        Platanista.prototype.genus = "Platanista";

        const ganges_dolphin = new Platanista("Ganges River Dolphin", "Platanista gangetica");

        Object.keys(ganges_dolphin);
        Object.getPrototypeOf(ganges_dolphin);

    {{< output >}}
[ 'name', 'species' ]
{
  name: '',
  kingdom: 'Animalia',
  phylum: 'Chordata',
  class: 'Mammalia',
  family: 'Platanistidae',
  genus: 'Platanista',
  species: ''
}
    {{< /output >}}

Each object holds a reference to its parent prototype. This ends up creating what is called a *prototype chain*, connecting back from one prototype to the next. This continues until the `Object` prototype is reached. (`Object` itself actually has `null` as a prototype, which technically is what ends the prototype chain.)

So, for the `indus_dolphin` object above, the prototype chain would be: `indus_dolphin` -> `Animal` -> `Object`.

Objects can access properties from their prototype chains. When you try to access a property on an object, JavaScript starts by looking on the object itself. If it does not find the property there, JavaScript moves backward through each prototype in the chain. It keeps doing this until it either finds a prototype with the property or reaches the end of the chain.

For example, the first of the commands below fetches the `name` property off of the `ganges_dolphin` object directly. But the second command needs to look on the prototype object to find the `kingdom` property. Finally, the `valueOf` method actually belongs to the `Object` prototype:

    ganges_dolphin.name
    ganges_dolphin.kingdom
    ganges_dolphin.valueOf()

{{< output >}}
'Ganges River Dolphin'
'Animalia'
{ name: 'Ganges River Dolphin', species: 'Platanista gangetica' }
{{< /output >}}

## Conclusion

JavaScript objects underpin much of the power available in the language. Objects give you access to their properties and methods. You can extend Objects after creating them and also create new Objects based off of existing ones. This guide provided an introduction to the main concepts behind JavaScript objects, including constructors, the `this` keyword, object inheritance.
