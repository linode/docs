---
slug: angular-tutorial-for-beginners
description: 'This guide covers the basics of building a website with Angular, including installation, setup, and the core concepts of Angular application design.'
keywords: ['angular','node.js','typescript','web applications','app framework','open source']
tags: ['web applications']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-06-10
modified_by:
  name: Nathaniel Stickman
title: "Build a Website with Angular (For Beginners)"
title_meta: "How to Build a Website with Angular (For Beginners)"
external_resources:
- '[Angular](https://angular.io/)'
- '[TypeScript](https://www.typescriptlang.org/)'
- '[Angular docs](https://angular.io/docs)'
authors: ["Nathaniel Stickman"]
---

Angular is a powerful open-source platform and framework for creating dynamic single-page applications. Written in TypeScript, Angular was built for modular web application clients, and helps to make application design clearer, and cleaner. In this guide, you can find instructions for installing Angular, setting up your first Angular application, and learning about its core concepts.

## What is Angular?

Angular is both a development platform and a framework for web application design. As a platform, Angular offers tools to make the development process run smoothly and easily. It also comes with a host of libraries that include features for streamlining your web application design. As a framework, Angular uses a component-based approach for making sophisticated and scalable web application clients. It is built around modular application design, making it easier to give your applications a clean and clear architecture.

Angular uses [TypeScript](https://www.typescriptlang.org/), a programming language that extends JavaScript with strong typing. This can make your applications more transparent, legible, and helps you catch errors at compile time rather than run time. It may look unfamiliar at first, but many find that TypeScript makes their JavaScript programming more clear and less error-prone.

{{< note respectIndent=false >}}
Angular should not be confused with [AngularJS](https://angularjs.org/), a front-end framework that aims to extend static HTML with dynamic features. Angular came about as the evolution of AngularJS — Angular is also known as Angular 2 for this reason.
{{< /note >}}

## Getting Started with Angular

### Install Angular

1. Install Node.js using the steps found in one of the following guides:

   - [How to Install Node.js and NGINX](/docs/guides/how-to-install-nodejs-and-nginx-on-debian-10/) (just select the appropriate Linux distribution from the drop down).
   - [How to Install and Use the Node Version Manager NVM](/docs/guides/how-to-install-use-node-version-manager-nvm/).

1. Install the Angular command-line interface (CLI) as a global Node.js package:

        npm install -g @angular/cli

### Create an Angular Application

Once you have the Angular CLI, you can use it to create Angular projects. The following steps shows you how to create a base Angular application.

1. Change into the directory where you want to store your application. In this example, it is the current user's home directory. Then, create the base Angular application workspace using the `ng new` command.

        cd ~
        ng new example-app

    The Angular CLI prompts you for information about your application. You can accept the default for each prompt by pressing **Enter**.

1. The Angular CLI creates a subdirectory for your application and installs the required Node.js packages and application dependencies. Once it has finished, change it into the application's directory.

        cd example-app

    {{< note respectIndent=false >}}
Unless noted otherwise, all subsequent commands in this guide assume you are still in this directory.
{{< /note >}}
1. You can test the application with the following command:

        ng serve

    Angular serves the application on `localhost` port `4200`. To visit the application remotely, you can use an SSH tunnel.

    - On Windows, you can use the PuTTY tool to set up your SSH tunnel. Follow the appropriate section of the [Using SSH on Windows](/docs/guides/connect-to-server-over-ssh-on-windows/#using-ssh-on-windows-10-to-connect-to-a-server) guide, replacing the example port number there with **4200**.
    - On OS X or Linux, use the following command to set up the SSH tunnel. Replace `example-user` with your username on the application server and `192.0.2.0` with the server's IP address.

          ssh -L4200:127.0.0.1:4200 example-user@192.0.2.0

1. Visit the Angular application in your browser by navigating to:

        localhost:4200

    You should be greeted by the Angular welcome page.

## Angular Components and Templates

Components are Angular's core building blocks, defining your application's views and implementing the data and logic behind them.

Each component consists of a component decorator (`@Component`) followed immediately by a class where the component's main operations take place.

Decorators define the following three things for their components:

- The **selector** — used to insert the component into templates. For instance, a component with `example-selector` can be inserted into a template with the `<example-selector></example-selector>` tag.
- The **template** — determines how the component is rendered. Together with the component, the template defines a view.
- Optionally, the CSS style to be used for rendering the component.

Component classes are where components gather data, implement logic, and assign values. This is where components can call and make use of [Angular Services](/docs/guides/angular-tutorial-for-beginners/#angular-services).

Finally, components are grouped into modules — called `NgModules` in Angular. Every Angular application has at least one `NgModule`, the root module, often called `AppModule`. This groups your application's core functionality and, for many straightforward applications, no other modules need to be created.

Here is an example of a component, pulled from the base Angular application set up above.

{{< file "~/example-app/src/app/app.component.ts" >}}
// [...]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'example-app';
}
{{< /file >}}

In the template file identified in the decorator above, you can see how the `title` variable defined in the component class gets used in the view.

{{< file "~/example-app/src/app/app.component.html" >}}
<!-- [...] -->

<span>{{ title }} app is running!</span>

<!-- [...] -->
{{< /file >}}

When you are ready to expand your application with an additional component, you can use the Angular CLI command to generate one. This example creates a new component called `example-component`.

        ng generate component example-component

## Angular Services

Components use services for functionality not directly related to the application's views. Keeping this functionality in services keeps your application modular and makes it easier to reuse functionality in other parts of your application.

The following example extends the base application set up above. It adds a very simple service for getting a list of users. It presumes that you have a JSON file or a web service which your Angular application can call to get the list of users.

1. Add the `HttpClientModule` to your `AppModule`.

    {{< file "src/app/app.module.ts" >}}
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// Import the HttpClientModule
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // Add the HttpClientModule after the BrowserModule
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
    {{< /file >}}

1. Create the service, to be named `UserService` in this example.

        ng generate service user

    This creates a `~/example-app/src/app/user.service.ts` file with the skeleton of an Angular service. As you can see in the next example, services are designated with the injectable decorator (`@Injectable`). This allows them to be dependency injected into components.

1. Add the `HttpClient` and associated modules to the service, and implement the functionality to fetch the list of users. In this example, `src/assets/users.json` contains the list of users. You can also use the URL for a web service API here instead.

    {{< file "~/example-app/src/app/user.service.ts" >}}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Add modules used for working with the HttpClient responses
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<string[]>('assets/users.json');
  }
}
   {{< /file >}}

    For this example, you can use the following JSON file for the list of users.

    {{< file "src/assets/users.json" >}}
["userA","userB","userC"]
    {{< /file >}}

1. Modify the component to use the service. The component needs to import the service, create a variable for the list of users, and make a call to the service to get the list. The component also now makes use of the `OnInit` module to call the service when the component loads.

    {{< file "~/example-app/src/app/app.component.ts" >}}
// Add the OnInit module to this import statement
import { Component, OnInit } from '@angular/core';
// Import the service
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'example-ng-app';

  // Create the variable to hold the list of users
  users = ['No users'];

  // This is necessary to reference the service within the component class
  constructor(private userService: UserService) {}

  // This method gets called when the component initializes
  ngOnInit() {
    this.userService.getUsers().subscribe(data => { this.users = data; });
  }
}
    {{< /file >}}

1. Add lines for the template to iterate through the list of users.

    {{< file "~/example-app/src/app/app.component.html" >}}
<!-- [...] -->

  <div>
    <h2>List of Users</h2>
    <div *ngFor='let user of users'> {{user}} </div>
  </div>

  <!-- Resources -->
  <h2>Resources</h2>

<!-- [...] -->
    {{< /file >}}

1. Run the application again, and verify that your list of users shows up.

## Conclusion

You should now have a foundation to start building your own application with Angular. To help you dive deeper, take a look at Angular's thorough [documentation repository](https://angular.io/docs). Angular also provides the exceptional [Tour of Heroes tutorial](https://angular.io/tutorial), which walks you through developing a dynamic Angular application from the ground up.
