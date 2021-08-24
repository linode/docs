---
slug: using-nodejs-typescript-and-expressjs
author:
  name: John Mueller
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-24
modified_by:
  name: Linode
title: "Using Nodejs Typescript and Express to Build a Web Server"
h1_title: "How to Use Node.js, TypeScript, and Express to Build a Web Server"
enable_h1: true
contributor:
  name: John Mueller
  link: Github/Twitter Link
---

Organizations have used JavaScript to create web projects since 1995. During that time, usage and complexity have both grown so that you often see huge websites built with JavaScript today. [Node.js](https://nodejs.org/en/) provides a dependable JavaScript runtime to use with your web applications and [Express](https://expressjs.com/) adds a web framework so you write applications using less code and don’t have to reinvent the wheel. The main reason to use TypeScript in a web project is to reduce errors. Because TypeScript provides a more formal approach to writing code, developers can create websites faster and with fewer errors. Using TypeScript to build your web project, among other benefits, provides:

- Reduction of misspelled functions and properties
- Passing the right types of arguments to functions
- Ensuring the right number of arguments to functions
- Providing smarter autocomplete suggestions

These benefits are important because they help solve the [top JavaScript errors](https://rollbar.com/blog/top-10-javascript-errors-from-1000-projects-and-how-to-avoid-them/) listed on many websites. Reducing or eliminating these top errors saves a huge amount of time and effort—keeping projects on track. With these benefits in mind, the following sections tell how you can create a simple web server using a combination of TypeScript, Node.js, and Express with a minimum of effort.

## Set up your TypeScript and Node.js Project

To make it easier to work with this example, you want to create an environment to host it. Begin by creating a new directory for your web server and initializing TypeScript using these steps:

In this section, you set up your development environment by creating a new directory to store your web server and initializing TypeScript.

1. In your home folder, create a new directory named `typescript-nodejs` and move into the new directory:

        mkdir typescript-nodejs && cd typescript-nodejs

1. Create a `package.json` file for your project using the following command. The `-y` option generates the `package.json` file.

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

1. To avoid error messages in the next section of this guide, define the `package.json` file's `description` key as:

    {{< file "package.json" >}}
...
   "description": "This is a test web server.",s
...
    {{< /file >}}

    {{< note >}}
You do not need to provide a value for the `repository` field, if you don’t have one available to store your code. This guide doesn't use one to create the simple server, but the NPM documentation provides a number of acceptable formats for this field.
    {{< /note >}}

### Installing Express and Adding Dependencies

In order to run the example web server, you need to install Express and TypeScript. You use TypeScript to define the required dependencies.

1. Use NPM to install Express with the following command. Ensure you are still in the `typescript-nodejs` directory when running the command.

        npm install express

    Since you don’t have a repository defined, you see the following output:

    {{< output >}}
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN typescript-nodejs@1.0.0 No repository field.

+ express@4.17.1
added 50 packages from 37 contributors and audited 50 packages in 2.539s
found 0 vulnerabilities

    {{< /output >}}

    The first line of the output means that you should copy your `package-lock.json` file to your code repository. Typically, this is the repository you would point to in the `package.json` file's `repository` field.

    If you inspect the `package-lock.json` file, you see a detailed description of the `node_modules` tree and `package.json`. This file is automatically generated for you whenever NPM makes a modification to these two elements. You don’t need to worry about it for this guide, but there is a good [discussion](https://docs.npmjs.com/cli/v7/configuring-npm/package-lock-json) of it available in NPM's documentation. The remaining Express installation output lines tell you about the version of Express that was installed and its details.

1. Install TypeScript with the command below. Even if you currently have TypeScript installed on your system, you need to install it again with the dependencies required to create the web server project.

        npm install typescript ts-node @types/node @types/express --save-dev

    You see a similar output:

    {{< output >}}
npm WARN typescript-nodejs@1.0.0 No repository field.

+ @types/express@4.17.13
+ ts-node@10.1.0
+ @types/node@16.4.7
+ typescript@4.3.5
added 23 packages from 121 contributors and audited 74 packages in 4.338s
found 0 vulnerabilities

    {{< /output >}}

    The output displays the repository warning again. Otherwise, information is returned about the version of TypeScript installed and how it interacts with Express.

    The `ts-node` part of the installation command installs TS-Node, which is an execution engine for TypeScript and a Read–Eval–Print Loop (REPL) for Node. The `@types/nod`e and `@types/express` additions provide type definitions for TypeScript when interacting with Node and Express.

    Finally, the `--save-dev` command line switch indicates that TypeScript is only used for development purposes. Because you compile the TypeScript code to JavaScript, there is no dependency on TypeScript at runtime.

## How to Create your tsconfig.json File

At this point, you should have all requirements and dependencies installed in your development environment. In this section, you create the `tsconfig.json` file.

1. Issue the command below to create the `tsconfig.json` file:

        npx tsc --init

    The generated `tsconfig.json` file contains various default settings. You can learn more about each setting in [TypeScript's TSConfig Reference documentation](https://www.staging-typescript.org/tsconfig). Unless you have reasons to change the `target` and `module` settings, you should leave those as they are defined. Likewise, keep `strict` set to `true` to ensure that your application uses strict type checking. Also, keep `esModuleInterop` set to `true` to ensure that you obtain full interoperability.

    A few of the settings are currently commented out and you may, or may not, want to change them. For this example, you don’t have to change them, but you’d likely need to do so for a large project:

    - `outFile`: Concatenate and emit the web server code to a single file. This is useful for small web servers and does provide a performance boost in some cases.

    - `outDir`: Specifies where you want the JavaScript generated during the compilation process to go.

    - `rootDir`: Specifies the location of the TypeScript files.

## Developing a Node.js and Express Web Server Example

Now you’re finally ready to create some code and run it.

1. Create a new file named `index.ts` and add the following code to the file:

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

    The web server implementation is very basic, however, it provides a foundation to help you build something more complex. The code imports Express and instantiates a copy of `express()` as the `app` constant. This constant can be used to interact with your application.

    The call to `app.get()` specifies that the web server will respond to a root directory request with a message that reads `This is a test web page!`. Refer to the [Express documentation](https://expressjs.com/en/guide/routing.html) to learn more about its routing features.

    The call to `app.listen()` describes what port to use for listening for requests. Whenever the application starts, you see the message, `The application is listening on port 3000!` at the command line.

1. Run your code to create the web server:

        node index.js

1. Navigate to a browser to view the site running on the localhost. Enter `localhost:3000` as the URL. You should see the message `This is a test web page!` returned in your web browser's session.

    To stop the web server, press Ctrl+C at the command line.

## Conclusion

There are many reasons to use JavaScript to create your next web server. Some of the most commonly cited reasons are:

- A shorter learning curve than many other web development languages.
- Great community support so that help is always available.
- A vast array of libraries to use for web development.
- Ease of adding special effects to web pages.
- Client side development that reduces page load time so the user doesn't get tired of waiting.
- Good compatibility with other programming languages.
- The use of the Document Object Model (DOM) to make complex development tasks simpler.
- Native browser support so that code compilation isn’t needed.

JavaScript does come with a few issues that TypeScript helps to correct. When you use TypeScript to create your JavaScript code, what you get is the best of stricter programming languages with all of the benefits of JavaScript. Using Express and Node.js with TypeScript you do less work and spend more time actually creating your website, rather than overcoming development hurdles.



