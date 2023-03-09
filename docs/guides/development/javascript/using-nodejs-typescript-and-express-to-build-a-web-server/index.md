---
slug: using-nodejs-typescript-and-express-to-build-a-web-server
description: 'This guide shows you how to configure a Node.js, TypeScript, and Express dev environment, after which you will learn how to build a web server using Typescript.'
og_description:  'This guide shows you how to configure a Node.js, TypeScript, and Express dev environment, after which you will learn how to build a web server using Typescript.'
keywords: ['nodejs typescript','node express server','tsconfig json']
tags: ['web applications']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-09-10
modified_by:
  name: Linode
title: "Use Node.js, TypeScript, and Express to Build a Web Server"
external_resources:
- '[npm documentation](https://docs.npmjs.com/cli/v7/configuring-npm/package-json)'
- '[Express documentation](https://expressjs.com/en/guide/routing.html)'
- "[TypeScript's TSConfig Reference documentation](https://www.staging-typescript.org/tsconfig)"
authors: ["John Mueller"]
---

[TypeScript](https://www.typescriptlang.org/) is a [strongly typed programming language](https://en.wikipedia.org/wiki/Strong_and_weak_typing) that is built on top of JavaScript. JavaScript is increasingly used in complex web applications with large codebases. Since you can use TypeScript anywhere that JavaScript is supported, you can replace JavaScript for TypeScript to reap the benefits of a strongly typed language. TypeScript enables developers to build applications quickly and with less errors. Some benefits of TypeScript are:

- Reduction of misspelled functions and properties
- Ensures that you use the correct argument types and number of arguments with functions
- Provides smarter autocomplete suggestions when working in your IDE

This guide shows you how to use TypeScript with two tools that are commonly used to build JavaScript web applications —[Node.js](https://nodejs.org/en/) and [Express](https://expressjs.com/). Node.js provides a JavaScript runtime to use with web applications. Express offers a minimalist web framework to simplify building the various components of a web application. In this guide, you learn how to create a simple web server using TypeScript, Node.js, and Express.

## How to Set Up the TypeScript, Node.js, and Express Development Environment

The majority of the steps in this guide are performed on your computer's local development environment. The following sections show you how to install TypeScript, Node.js, Express, and package dependencies on your computer. Any additional configuration steps required by each tool are also covered.

{{< note respectIndent=false >}}
If you do not have Node.js and the node version manager (nvm) installed on your computer, follow our [How to Install and Use the Node Version Manager NVM](/docs/guides/how-to-install-use-node-version-manager-nvm/) guide. The steps in this guide require a minimum Node.js version of 13.0.0.
{{< /note >}}

1. In your home directory, create a new directory named `typescript-nodejs` and move into the new directory.

        mkdir typescript-nodejs && cd typescript-nodejs

1. Create a `package.json` file for your project using the `npm init` command. The `-y` option generates the `package.json` file.

        npm init -y

    Your directory should now have a `package.json` file with the following contents:

    {{< file "package.json" >}}
{
  "name": "typescript-nodejs",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
    {{< /file >}}

   This file provides information about the web server that you can update later. The most important entry is `"main": "index.js"`. This defines the name of the main JavaScript file used to create the web server.

   The `"license": "ISC"` entry specifies that the license used for this web server is from the Internet Systems Consortium (ISC). To learn more about each key and value, refer to [NPM's documentation](https://docs.npmjs.com/cli/v7/configuring-npm/package-json).

1. To avoid error messages in the next section of this guide, update the `package.json` file's `description` key as follows:

    {{< file "package.json" >}}
   ...
   "description": "This is a test web server.",
   ...
    {{< /file >}}

    {{< note respectIndent=false >}}
There is also a field defined in the `package.json` file called the `repository` field. You don't have to provide a value for this field if you don’t have a repository configured to store your code.
{{< /note >}}

1. Use [npm](/docs/guides/install-and-use-npm-on-linux/) to install Express with the command below. Ensure you are still in the `typescript-nodejs` directory when running the command.

        npm install express

    Since you don’t have a `repository` field defined in the `package.json` file, you see the following output:

    {{< output >}}
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN typescript-nodejs@1.0.0 No repository field.

- express@4.17.1
added 50 packages from 37 contributors and audited 50 packages in 2.539s
found 0 vulnerabilities
    {{< /output >}}

    The first line of the output means that you should copy your `package-lock.json` file to your code repository. Typically, this is the repository you would point to in the `package.json` file's `repository` field.

    If you inspect the `package-lock.json` file, you see a detailed description of the `node_modules` tree and `package.json` file. This file is automatically generated whenever npm modifies these two elements. You don’t need to worry about it for this guide, but there is a good [discussion](https://docs.npmjs.com/cli/v7/configuring-npm/package-lock-json) of it available in npm's documentation. The remaining lines tell you about the version of Express that was installed and its details.

1. Install TypeScript using the command below. Even if you currently have TypeScript installed on your system, you need to install it again with the dependencies required to create this sample webserver project.

        npm install typescript ts-node @types/node @types/express --save-dev

    The `ts-node` part of the installation command installs [ts-node](https://typestrong.org/ts-node/), which is an execution engine for TypeScript and a [Read–Eval–Print Loop (REPL)](https://nodejs.org/api/repl.html#repl_repl) for Node.js. The `@types/node` and `@types/express` additions provide type definitions for TypeScript when interacting with Node.js and Express.

    Finally, the `--save-dev` command line switch indicates that TypeScript is only used for development purposes. Because you compile the TypeScript code to JavaScript, there is no dependency on TypeScript at runtime.

    When you execute the command, you see an output similar to the following:

    {{< output >}}
npm WARN typescript-nodejs@1.0.0 No repository field.

- @types/express@4.17.13
- ts-node@10.1.0
- @types/node@16.4.7
- typescript@4.3.5
added 23 packages from 121 contributors and audited 74 packages in 4.338s
found 0 vulnerabilities

    {{< /output >}}

    The output displays the repository warning again. Otherwise, information is returned about the version of TypeScript installed and how it interacts with Express.

## How to Create your tsconfig.json File

At this point, you should have all requirements and dependencies installed in your development environment. In this section, you create the `tsconfig.json` file. This file is required at the root of a TypeScript project. It specifies directory information about the project and compiler options needed during compilation.

- Use the following command to create the `tsconfig.json` file.

        npx tsc --init

    The `tsconfig.json` file is created with the following content:

    {{< file "tsconfig.json" >}}
{
    "compilerOptions":{
        /*Language and Environment*/
        "target":"es5",

        /* Modules */
        "module":"commonjs",
        //"rootDirs": [],

        /* Interop Constraints */
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,

        /* Type Checking */
        "strict": true,

        /* Completeness */
        "skipLibCheck": true

        /* Emit */
        //"outFile": "./",
        //"outDir": "./",
    }
}
    {{< /file >}}

    {{< note respectIndent=false >}}
When the `tsconfig.json` file is created, several options are commented out. You can leave the settings as they are, but for more complex project, you can uncomment the necessary settings.
    {{< /note >}}

    The generated `tsconfig.json` file contains various default settings. You can learn more about each setting in [TypeScript's TSConfig Reference documentation](https://www.staging-typescript.org/tsconfig). Unless you have reasons to change the `target` and `module` settings, you should leave those as they are defined. Likewise, keep `strict` set to `true` to ensure that your application uses strict type checking. Also, keep `esModuleInterop` set to `true` to ensure that you obtain full interoperability.

- For this example, you don’t have to change the settings listed below, but you’d likely need to do so for a large project.

  - `rootDir`: Specifies the location of the TypeScript files.

  - `outFile`: Concatenates and emits the webserver code to a single file. This is useful for small web servers and does provide a performance boost in some cases.

  - `outDir`: Specifies where you want the generated JavaScript to be stored after compilation.

## Create a TypeScript, Node.js and Express Web Server Example

Now that your development environment is completely configured, you’re ready to write some code and run it. In this section, you create a simple web server.

1. Ensure you are still in the `typescript-nodejs` directory. Create a new file named `index.ts` and add the following code to the file.

    {{< file "index.ts" >}}
import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('This is a test web page!');
})

app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})
    {{< /file >}}

    The web server implementation is very basic, however, it provides a foundation to help you build something more complex. The above code imports `express` and instantiates a copy of `express()` as the `app` constant. This constant can be used to interact with your application.

    The call to `app.get()` specifies that the web server will respond to a root directory (`'/'`) request  with a message that reads `This is a test web page!`. Refer to the [Express documentation](https://expressjs.com/en/guide/routing.html) to learn more about its routing features.

    The call to `app.listen()` describes what port to use when listening for requests. Whenever you start the application on the command line, you see the message `The application is listening on port 3000!`.

1. Run your code to create the webserver.

        npx ts-node index.ts

1. Navigate to a browser to view the site running on the localhost. Enter `localhost:3000` as the URL. You should see the message `This is a test web page!` returned in your web browser's session.

    To stop the webserver, press **Ctrl+C** at the command line.

## Conclusion

 When you use TypeScript to build a web application, you get the benefits of stricter programming language that is interchangeable with JavaScript. When using Express and Node.js with TypeScript your code is mush less error prone and verbose. Their benefits allow you to spend more time creating your web application's features. If you are a JavaScript programmer, refer to the [TypeScript for JavaScript Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html) tutorial to learn more about the differences between the two languages. If you are newer to TypeScript, you can refer to our guides on TypeScript [classes](/docs/guides/typescript-classes-get-started/), [decorators](/docs/guides/typescript-decorators-getting-started/), [functions](/docs/guides/typescript-functions-getting-started/), and [types](/docs/guides/typescript-types-get-started/).