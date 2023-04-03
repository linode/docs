---
slug: typescript-modules-getting-started
description: 'In this guide, you learn about Typescript modules, how to use the import and export keywords in your code, and the differences between Typescript modules and namespaces.'
keywords: ['typescript module', 'typescript import', 'typescript module exports', 'typescript module vs namespace']
tags: ['web applications']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-10-08
modified_by:
  name: Linode
title: "Get Started with TypeScript Modules"
authors: ["John Mueller"]
---

TypeScript supports modules and namespaces that can be used to organize your codebase. Modules are currently the favored method for organizing your code when working with TypeScript. This guide shows you how to create TypeScript modules and provides a comparison between modules and namespaces.

The list below provides an overview of TypeScript module features:

- They execute in their own scope, which promotes encapsulation and reduces security issues.

- Variables, functions, classes, and other module entities aren’t visible outside of the module. This aids in data and code hiding.

- To make module entities visible outside of their scope, you must export them. This helps you keep track of the visible areas of a module.

- To consume visible module entities, another module or code element must specifically import the entities. This helps promote better code design.

- Modules are declarative in nature.

- The use of a module loader places the burden of locating and executing all dependencies of a module on the loader, rather than the developer.

In TypeScript, any file that contains a top-level `import` or `export` statement is considered a module. Files that lack an `import` or `export` statement are automatically viewed as scripts. If you don’t already have your system setup to use TypeScript, you can find step-by-step instructions for doing so in the [How to Use Node.js, TypeScript, and Express to Build a Web Server](/docs/guides/using-nodejs-typescript-and-express-to-build-a-web-server/) guide.

## Create a TypeScript Module

The steps in this section provide a basic example that shows you how to create a TypeScript module. The module you create contains several methods that provide prompts to a user.

1. Create a new directory named `TestTypescript` and move into that directory. Then, create a new file named `Greetings.ts` and add the following code:

    {{< file "Greetings.ts">}}
export function SayHello(name : string) : void {
    ShowGreeting("Hello ", name);
}

export function SayGoodbye(name : string) : void {
    ShowGreeting("Sorry to see you go ", name);
}

function ShowGreeting(text : string, name : string) : void {
    console.log(text + name + "!");
}
    {{< /file >}}

    The `Greetings.ts` file exports two functions: one contains a prompt that says "hello", the other says "goodbye". Notice the `export` keyword in front of each function declaration. If you don’t include the `export` keyword, the function remains hidden and no one can use it outside of the module. The  `ShowGreeting()` function does not contain the `export` keyword, so it is hidden from view outside of `Greetings.ts`. If you try to import it into another module, you see an error message similar to the following:

    {{< output >}}
error TS2339: Property 'ShowGreeting' does not exist on type 'typeof import("/TSC/Greetings")'.
    {{< /output >}}

1. In your `TestTypescript` directory, create a new file named `TestGreetings.ts`. This new file uses the code you created for `Greetings.ts`. Add the following code to the `TestGreetings.ts` file:

    {{< file "TestGreetings.ts" >}}
/* Import the required code */
import greet = require("/TestTypescript/Greetings");

/* Start the session */
greet.SayHello("Sam");

/* Perform some work */
console.log("Let's do some work!");
console.log("Work is all done <whew>!");

/* End the session */
greet.SayGoodbye("Sam");
    {{</ file >}}

    The `TestGreetings.ts` file demonstrates one of the most common methods used to import a module. You assign it to a variable by calling `require()` with the required path. All of the exported entities are now available for use. You might think that you can provide the name of the module if it appears in the same directory (i.e., `TestTypescript` directory in this example) as the second module, but this isn’t the case. If you use `import greet = require("Greetings");`, and run the `TestGreetings.ts` module, you see the following error message:

    {{< output >}}
error TS2307: Cannot find module 'Greetings' or its corresponding type declarations.
    {{</ output >}}

    The `greet` variable provides access to the two exported functions. You use dot syntax to access them and they work as you might expect. The example also provides some additional processing, much as you would for any other application.

1. To compile the `Greetings.ts` module, issue the following command in your terminal:

         tsc Greetings.ts

1. To compile the `TestGreetings.ts` module, issue the following command:

        tsc TestGreetings.ts

1. To run the application, execute the following command:

        node TestGreetings.js

    You should see a similar output:

    {{< output >}}
Hello Sam!
Let's do some work!
Work is all done <whew>!
Sorry to see you go Sam!
    {{</ output >}}

## TypeScript Module Import

The [module import process](https://www.typescriptlang.org/docs/handbook/modules.html#import) is quite flexible and allows you to define the elements to use from an external module. The following sections include more information about importing external modules into an application.

### Using Specific Features

It’s possible to specify which specific functions to use from an external module by using another form of the `import` statement, like the example below:

{{< file >}}
import { SayHello } from "/TestTypescript/Greetings";
{{</ file >}}

In this case, from the `Greetings.ts` module, you only gain access to the `SayHello()` function, not the `SayGoodbye()` function, even though both functions are exported. If you try to use the `SayGoodbye()` function, you see the following error message:

{{< output >}}
error TS2304: Cannot find name 'SayGoodbye'.
{{</ output >}}

To fix the error, amend your `import` statement to use `SayGoodbye` as shown below:

{{< file >}}
import { SayHello, SayGoodbye } from "/TestTypescript/Greetings";
{{</ file >}}

Using this form of the `import` statement doesn't allow you to import any methods that aren’t already exported, such as `ShowGreeting()`.

### Renaming Imports

You might find that an imported method causes naming conflicts or that the method name is overly long. Whatever the reason, you can assign a different name to a method as part of the `import` statement as follows:

{{< file >}}
import { SayHello as SH } from "/TestTypescript/Greetings";
{{</ file >}}

In this case, you call the function using `SH` instead of `SayHello()`, for example:

{{< file >}}
SH("Tammy");
{{</ file >}}

### Using Wildcard Imports

It’s possible to import all of the features of a module using a wildcard import as shown below:

{{< file >}}
import * as greets from "/TestTypescript/Greetings";
{{</ file >}}

The difference in behavior between `import * as` and `import ... = require()` depends on how the [module you import is configured](https://www.typescriptlang.org/docs/handbook/modules.html#wildcard-module-declarations).

When using wildcard imports an issue can arise when a module uses a single export. This is because TypeScript may not know precisely what to import. The [atomist blog](https://blog.atomist.com/typescript-imports/) provides information on the low-level details of using the various options when a module contains just one export.

## TypeScript Module Export

Earlier in this guide, you learned how to export functions as part of a module. However, you can export any other TypeScript feature as well. The following sections include some considerations when performing an export.

### Export a Class

A potential problem in TypeScript is that there is no specific integer or float type —everything is a number. The following steps demonstrate this issue in TypeScript.

1. In your `TestTypescript` directory, create a file named `MathStuff.ts` and include the following code in it.

    {{< file "MathStuff.ts">}}
export class MyMath {
    static DoIntAdd(Input1: number, Input2: number): number {
        return Math.floor(Input1) + Math.floor(Input2);
    }

    static DoIntSub(Input1: number, Input2: number): number {
        return Math.floor(Input1) - Math.floor(Input2);
    }

    static DoIntMul(Input1: number, Input2: number): number {
        return Math.floor(Input1) * Math.floor(Input2);
    }

    static DoIntDiv(Input1: number, Input2: number): number {
        return Math.floor(Input1 / Input2);
    }
}
    {{</ file >}}

    The code relies on the `Math.floor()` function to convert any floating-point number to an integer before performing the calculation using certain rules. You might choose to implement this class using the `Math.round()` function instead, so that larger decimal values are rounded up. However, even if you input floating-point values, an integer is returned.

1. Create another file named `TestMathStuff.ts` and add the following code to it.

    {{< file "TestMathStuff.ts" >}}
import { MyMath } from "/TestTypescript/MathStuff";

console.log("5 + 2 = ", MyMath.DoIntAdd(5.1, 2.4));
console.log("5 - 2 = ", MyMath.DoIntSub(5.1, 2.4));
console.log("5 * 2 = ", MyMath.DoIntMul(5.1, 2.4));
console.log("5 / 2 = ", MyMath.DoIntDiv(5.1, 2.4));
    {{</ file >}}

    When you work with classes, you export the class as a whole, rather than individual methods within the class. To keep a particular feature hidden, make the member private by using the `private` keyword. When performing an import in a consumer module, specify the class as a whole, not specific members, even though the members are available. This particular class performs a task that works best using static members because you don’t need to maintain data related to individual instances. For this reason, it adds the `static` keyword in front of each method declaration. The [Classes page](https://www.typescriptlang.org/docs/handbook/2/classes.html) in the TypeScript documentation discusses classes in more detail and shows when to use non-static class members.

1. Compile the `MyMath` class:

        tsc MathStuff.ts

1. To compile the testing code, use the following command:

        tsc TestMathStuff.ts

1. Run the compiled files:

        node TestMathStuff.js

    You should see the following output from the application:

    {{< output >}}
5 + 2 =  7
5 - 2 =  3
5 * 2 =  10
5 / 2 =  2
    {{</ output >}}

### Modify the Export Name

There are times when you need to export a module feature using a different name. For example, when there are potential naming conflicts. The way around this problem is to place the export statement on a separate line with the renamed feature, as shown below:

{{< file >}}
export { MyMath as IntMath };
{{</ file >}}

In this case, TypeScript now refers to `MyMath` as `IntMath`. So, the `import` statement would look as follows:

{{< file >}}
import { IntMath } from "/TestTypescript/MathStuff";
{{</ file >}}

### Re-exporting Modules

You might create a super module that depends on the content of many modules that should work together. However, you might not actually need to do anything with those other modules —they’re part of the package you’re putting together. In this case, you can re-export a module using the following code:

{{< file >}}
export { MyMath as IntMath } from "/TestTypescript/MathStuff";
{{</ file >}}

When you import the super module into your application, `MyMath` is a part of the super module, but appears under the name `IntMath`. A separate class in the super module might support floating-point math. Use a single import statement to import both classes in the following way:

{{< file >}}
import { IntMath, FloatMath } from "/TestTypescript/SuperMath";
{{</ file >}}

## TypeScript Modules vs. Namespaces

Namespaces provide another way to organize your code in TypeScript. Modules make it possible to import any code into your application, allowing for code reuse. However, all of the code you import becomes part of the global scope. The global scope is the common area of the application set aside for all your application’s resources. Namespaces make it possible to create a hierarchy of code storage, so that every piece of code appears in its own scope. The main advantage of namespaces is that they keep the global scope from getting bloated. They also reduce the risk of naming conflicts when you use third-party modules.

### Create a TypeScript Namespace

You create a namespace by using the `namespace` keyword, followed by the name of the namespace. Everything between the opening and the closing curly brace is part of that namespace. Consequently, one of the advantages of using a namespace is that the code required to create it is relatively simple. Another advantage of namespaces is that they can appear over multiple files, so you can combine files and namespaces together as an organizational aid. The following steps show how to work with namespaces in TypeScript.

1. In the `TestTypescript` directory, create a new file named `NSFullMath.ts` and add the code in the file below. The `export` statement makes the function accessible outside of the namespace.

    {{< file "NSFullMath.ts" >}}
namespace IntMath {
    export function DoIntAdd(Input1: number, Input2: number): number {
        return Math.floor(Input1) + Math.floor(Input2);
    }
   }
    {{</ file >}}

1. Compile the example code:

        tsc NSFullMath.ts

1. Create a new file named `TestNamespace.ts` and add the following code:

    {{< file "TestNamespace.ts" >}}
/// <reference path="/TestTypescript/NSFullMath.ts" />

console.log("5 + 2 = ", IntMath.DoIntAdd(5.1, 2.4));
    {{</ file >}}

    Notice the reference to the file containing the namespace. This is different from the normal module importing method. When working with namespaces, you need to ensure that you use the format displayed above.

1. To compile the file above, use the following command:

        tsc --outfile TestNamespace.js TestNamespace.ts

     This new method of compiling the code makes it possible for the compiler to find your files.

1. Verify that the code actually works, with the following command:

        node TestNamespace.js

    You should see the following output:

    {{< output >}}
5 + 2 =  7
    {{</ output >}}

1. When the compilation process completes, open the resulting `TestNamespace.js` file. Notice the difference between a namespace and a module.

    {{< file "TestNamespace.js" >}}
var IntMath;
(function (IntMath) {
    function DoIntAdd(Input1, Input2) {
        return Math.floor(Input1) + Math.floor(Input2);
    }
    IntMath.DoIntAdd = DoIntAdd;
})(IntMath || (IntMath = {}));
/// <reference path="/TSC/NSFullMath.ts" />
console.log("5 + 2 = ", IntMath.DoIntAdd(5.1, 2.4));
    {{</ file >}}

    The code from the namespace file is compiled directly as part of the `TestNamespace.js` file. Even though the code is in separate files, the result isn’t. Compare this output to a module version of the same code.

    {{< file >}}
"use strict";
exports.__esModule = true;
var MathStuff_1 = require("/TSC/MathStuff");
console.log("5 + 2 = ", MathStuff_1.MyMath.DoIntAdd(5.1, 2.4));
    {{</ file >}}

    The code is shorter and appears in multiple files this time (one for each module and one for the testing code). For larger projects, the module approach executes faster, presents fewer security issues, and provides a truly modular approach to writing an application.

## Conclusion

Namespaces and modules provide the same functionality to an extent —you use both of them to provide the means to modularize your code. Of the two, the module approach works best for large applications. This is because each of the modules appear in a separate file so you only load the code you need. The namespace approach comes in handy for smaller, simpler applications because everything appears in a single file that is easier to manage. As you have noted in this guide, the module approach is also more flexible in terms of what you can do with it. For example, the ability to use modules from multiple sources in a straightforward manner is a plus until naming conflicts appear. Some developers find the namespace approach attractive because you can use the same namespace across multiple files.
