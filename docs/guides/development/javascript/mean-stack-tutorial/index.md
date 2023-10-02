---
slug: mean-stack-tutorial
description: 'This MEAN stack tutorial shows you how to build a basic model application that connects MongoDB with Angular on an Ubuntu 20.04 system.'
keywords: ['angular mongodb', 'connect mongodb with angular', 'mean stack tutorial']
tags: ['ubuntu']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-12-10
modified_by:
  name: Linode
title: "Create a MEAN Stack Application"
title_meta: "MEAN Stack Tutorial: Create an Example Application"
authors: ["Cameron Laird"]
---

In web development, the term *full stack* refers to all the programmed parts of a web application. This includes the front end, which is seen by end-users, and the back end, where data is stored. The *MEAN* stack is one particular combination of technologies that covers the front end and the back end of an application. MEAN is widely regarded as particularly capable for large-scale, complex applications. This tutorial shows you how to build a basic application using the MEAN stack.

## What is the MEAN Stack?

MEAN is an acronym for the combination of technology stacks–**M**ongoDB, **E**xpress.js, **A**ngular, and **N**ode.js.

- MongoDB is a document-based database solution.
- Node.js is a back end JavaScript runtime environment.
- Express.js is a web application framework based on Node.
- Angular is a web framework for the front end.

{{< note respectIndent=false >}}
You can learn about each technology of the MEAN stack in our guides on [Angular](/docs/guides/angular-tutorial-for-beginners/), [Node.js](/docs/guides/how-to-install-nodejs/), [MongoDB](/docs/guides/databases/mongodb/), and [Express.js](/docs/guides/express-js-tutorial/).
{{< /note >}}

## Install the MEAN Stack

The steps in this section show you how to install Node.js, Express, Angular, and MongoDB on an Ubuntu 20.04 system.

### Node.js Installation

1. Use the following command to install Node.js on an Ubuntu system.

        sudo apt install nodejs -y

1. Validate your installation by creating your a "Hello, World!" Node application. Use a text editor of your choice to create a file named `my-app.js` and add the following content to it.

        console.log("Hello, world!");

1. Run the `my-app.js` file using the following command:

        node my-app.js

    Your output should display:

    {{< output >}}
Hello, world!
    {{</ output >}}

You have now installed Node.js and confirmed that it is working on your Ubuntu system.

### Express Installation

Install Express.js using the Node Package Manager (NPM).

    sudo npm init -y; sudo npm install express --save

Your local directory should now have a file named `package.json` with the following content:

{{< file "package.json" >}}
    ...
  "dependencies": {
    "express": "^4.17.1"
  }
    ...
        {{</ file >}}

### Angular Installation

1. Install Angular using the Node Package Manager.

        sudo npm install @angular/cli --save

1. Verify that the Angular installation is working by initializing a new project.

        ng new my-angular-app --defaults  # Initialize Angular project.
        cd my-angular-app                 # Move into the project folder.
        ng serve                          # Start the Angular server.

1. Open a browser and navigate to `http://localhost:4200/ `. You should see the following output:

    {{< output >}}
my-angular-app is running!
    {{</ output >}}

### MongoDB Installation

1. Install the dependencies necessary to add a new APT repository using the following commands:

        sudo apt update
        sudo apt install dirmngr gnupg apt-transport-https ca-certificates software-properties-common

1. Import the repository’s GPG key and add the MongoDB repository using the following command:

        wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
        sudo add-apt-repository 'deb [arch=amd64] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse'

1. Once the repository is enabled, install the `mongodb-org` meta-package.

        sudo apt install mongodb-org

1. Verify your MongoDB installation using the `--version` flag.

        mongo --version

    The output should display a version of `4.4.10` or depending on the version you installed.

## Use the MEAN Stack to Create an Example Application

This section shows you how to create a simple application that utilizes each component of the MEAN stack and demonstrates communication between each component. The example application illustrates how all the programmable pieces of a web application can be written in JavaScript. It also demonstrates how the different components exchange data between each other.

{{< note respectIndent=false >}}
Some additional functionality you might incorporate into a production application is user authentication, reading and writing data from your MongoDB records, data backups, and load balancing.
{{< /note >}}

### Create and Populate the MongoDB Database

Applications often implement CRUD operations. CRUD operations include the ability to create, read, update, and delete records in a persistent data store. The example below defines the read operation for a rudimentary [software bill-of-materials](https://www.linuxfoundation.org/blog/generating-a-software-bill-of-materials-sbom-with-open-source-standards-and-tooling/). This example application focuses on implementing the communication between the four components of the MEAN stack.

1. Launch MongoDB with the following command.

        mongod

    If you receive the following error: `NonExistentPath: Data directory /data/db not found`, then create a `data` directory to store data and set the ownership of the folder to the user that’s starting the mongod service.

        sudo mkdir -p /data/db/
        sudo chown `id -u` /data/db

1. From a new Linux terminal session, enter the MongoDB shell.

        mongo

1. Create a new database and insert a new user record.

        use my-test
        db.users.insert({username: "myname", password: "mypassword"})

    The `use my-test` command switches the current database to use the `my-test` database. The `db.users.insert(...)` command adds a record to the `users` table within the current `my-test` database.

1. View the record you created in the previous step.

        db.users.find()

    The `db.users.find()` command requests the entire contents of the `users` table. Your output returns a similar result:

    {{< output >}}
{ "_id" : ObjectId("610f1adfc54de6f1d94bc403"), "username" : "myname", "password" : "mypassword" }
    {{</ output >}}

1. Add new records to your database.

        use my-test
        db.artifact.save({scriptname: "dygraph.min.js", version: "2.1.0", cdn: "cdnjs.cloudflare.com"})
        db.artifact.save({scriptname: "sortable.min.js", version: "0.8.0", cdn: "cdnjs.cloudflare.com"})
        db.artifact.save({scriptname: "swagger-ui-bundle.js", version: "3.50.0", cdn: "cdn.jsdeliver.net"})

    You have added three records to the `artifact` table, each one with data specified by the three attributes `cdn`, `scriptname`, and `version`. You should see a similar result:

    {{< output >}}
WriteResult({ "nInserted" : 1 })
    {{</ output >}}

1. To view all the tables stored in your MongoDB database, run the following commands:

        use my-test
        show collection

    You should see a similar output:

    {{< output >}}
artifact
users
    {{</ output >}}

### Connect to the Back End Runtime (Node.js)

At this point, Node and Mongo are both installed and MongoDB is running successfully. You've created a Node project and a Mongo database with a couple of tables. Now, it’s time for these two components to connect.

1. Navigate to the `my-angular-app` directory you created in the [Angular Installation](/docs/guides/mean-stack-tutorial/#angular-installation) section.

1. Install the Node.js MongoDB driver:

        sudo npm install mongodb -g

1. In your preferred text editor, create a new file named `sbom-backend1.js` and add the following content to it:

    {{< file "sbom-backend1.js" >}}
var MongoClient = require('mongodb').MongoClient

const url = "mongodb://localhost:27017/"
const dbName = 'my-test'
const table = 'artifact'

MongoClient.connect(url, (err, client) => {
  const db = client.db(dbName);
  db.collection(table).find().toArray((err, artifact) => {
        if (err) throw err
        artifact.forEach((value) => {
        console.log(value.scriptname)
    })
    client.close()
  })
})
        {{</ file >}}

    The `sbom` name is a common acronym for *software bill of materials*.  The `sbom` table contains some of the information that frequently appears in a production software bill of materials.  The source `sbom-backend1.js` specifies a small program that retrieves the contents of a MongoDB table.

1. Use Node.js to run the `sbom-backend1.js` file.

        node sbom-backend1.js

    The output displays the following:

    {{< output >}}
dygraph.min.js
sortable.min.js
Swagger-ui-bundle.js
    {{</ output >}}

    The script names for each of the three records created by `sbom-backend1.js` are displayed.

### Launch a Data Server

In this section, you activate Express.js. Express.js enables information in MongoDB to be exposed as JSON at a specific API endpoint.

1. Create a new file named `sbom-dataserver.js` with the following content:

    {{< file "sbom-dataserver.js" >}}
// This program creates a data server which uses Express
// to retrieve data from a MongoDB instance to create three
// distinct endpoints on port 3600 of locahost.  Data which
// appears in the MongoDB “artifacts” table become
// JSON-formatted responses to requests on port 3600.
//
// “Route” is a crucial concept in Express.  This particular
// dataserver defines three routes:
// * ‘/’ returns a human-readable message;
// * ‘/artifacts’ returns a list of artifact names; and
// * `/artifacts/NAME’ returns details about NAME.
const express = require('express')
const app = express()
var db
const dbName = 'my-test'
const port = 3600
let table = 'artifact'
const url = "mongodb://localhost:27017/"

app.listen(port, function() {
  console.log('Listening on ' + port + '.')
})

const MongoClient = require('mongodb').MongoClient

app.route('/').get((req, res) => {
  res.send("Recognized endpoints on this server include '/artifacts' and '/artifacts/NAME'.")
})
app.route('/artifacts').get((req, res) => {
  db.collection(table).find().toArray((err, artifact) => {
    if (err) throw err
    var artifacts = []
    artifact.forEach((value) => {
      artifacts.push({scriptname: value.scriptname})
    })
    res.send(artifacts)
  })
})
app.route('/artifacts/:scriptname').get((req, res) => {
  const scriptname = req.params['scriptname']
  db.collection(table).findOne({scriptname: scriptname}, function(err, artifact) {
  if (err) throw err
    res.send({
      scriptname: artifact.scriptname,
      version: artifact.version,
      cdn: artifact.cdn
    })
  })
})

MongoClient.connect(url, (err, client) => {
  const db = client.db(dbName);
  db.collection(table).find().toArray((err, artifact) => {
        if (err) throw err
        artifact.forEach((value) => {
    })
    client.close()
  })
})
    {{</ file >}}

1. Run the API routes you created in the previous step.

        node sbom-dataserver.js

    You should see a similar output:

    {{< output >}}
Listening on 3600.
    {{</ output >}}

    Notice the `sbom-dataserver.js` program defines three routes:

    -   `/` provides a human-readable diagnostic of the app;
    - `/artifacts` lists the script names of known artifacts; and
    - `/artifacts/scriptname` provides details about the `scriptname` artifact.

1. In a web browser, navigate to `http://localhost:3600/artifacts`. You should see the following output:

    {{< output >}}
0
scriptname: “dygraph.min.js”
1
scriptname: “sortable.min.js”
2
scriptname: “swagger-ui-bundle.js”
        {{</ output >}}

    If you navigate to `http://localhost:3600/artifacts/sortable.min.js`, you should see the following:

    {{< output >}}
scriptname: “sortable.min.js”
version:    “0.8.0”
cdn:        “cdnjs.cloudflare.com”
    {{</ output >}}

    In just a few lines of Express.js-powered JavaScript, you have created a back-end server that responds to requests with structured data.  Results are delivered as JSON, which browsers can render as formatted rows. Your browser might give you the option to *pretty print* your JSON; if you choose this when you navigate to  `http://localhost:3600/artifacts`, for instance, instead of the table above, you see “raw” JSON.

    {{< output >}}
[
  {
    "scriptname": "dygraph.min.js"
  },
  {
    "scriptname": "swagger-ui-bundle.js"
  },
  {
    "scriptname": "sortable.min.js"
  }
]
    {{</ output >}}

    This interface to MongoDB can be applied to a variety of front-end applications. The next section creates a front-end implementation for the MongoDB powered data.

### Create your Application's Front End

With data in the database, and a data server to make them available, you are now ready to build the front end.

1. Create a new Angular project named `sbom`.

        ng new sbom --defaults

1. Move into the `sbom` directory that was created by issuing the previous command.

        cd sbom

    All the steps in this section should be issued from the `sbom` directory.

1. Create additional components and services for the app.

        ng generate component artifact-list
        ng generate component top
        ng generate service artifact

1. Issuing the previous commands should create several files and directories. Open the `~/sbom/src/app/app.module.ts` file and add the following content:

    {{< file "~/sbom/src/app/app.module.ts" >}}
/* app.module.ts specifies the modules this Angular
   application requires.  It retrieves results from
   the dataserver, for example; therefore it must
   import HttpClient. */
import { AppComponent } from './app.component'
import { ArtifactListComponent } from './artifact-list/artifact-list.component'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClient } from '@angular/common/http'
import { HttpClientModule } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { NgModule } from '@angular/core'
import { Observable } from 'rxjs'
import { RouterModule } from '@angular/router'
import { TopComponent } from './top/top.component'

@NgModule({
  declarations: [
    AppComponent,
    ArtifactListComponent,
    TopComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: 'artifact-list', component: ArtifactListComponent},
      {path: '', component: TopComponent}
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent, TopComponent]
})
export class AppModule { }
        {{</ file >}}

1. Similar to the previous step, open the `~/sbom/src/app/artifacts.ts` file and add the following content:

    {{< file "~/sbom/src/app/artifacts.ts" >}}
/* MVC architecture is the foundation of Angular.  The
   definition of Artifact here defines the crucial data
   Model of this application. */
export interface Artifact {
  scriptname: string;
  cdn: string;
  version: string;
}
        {{</ file >}}

1. Next, navigate to `~/src/app/app.component.ts` and provide your component definitions.

    {{< file "~/src/app/app.component.ts" >}}
/* This Component definition includes, most importantly, the
   procedural code which retrieves data from the data server.
*/
import { Artifact } from "./artifact"
import { catchError, tap } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { MessageService } from './message.service'
import { Observable, of } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class ArtifactService {
  artifactsURL = "http://localhost:3600/artifacts"

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  getArtifacts(): Observable<Artifact[]> {
    return this.http.get<Artifact[]>(this.artifactsURL)
      .pipe(
        catchError(this.handleError<Artifact[]>('getArtifacts', []))
      )
  }
  getArtifact(scriptname: string): Observable<Artifact> {
    const url = `${this.artifactsURL}/${scriptname}`
    var this_result = this.http.get<Artifact>(url)
    return this_result
      .pipe(
        catchError(this.handleError<Artifact>(`getArtifact scriptname=${scriptname}`))
      )
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead

      this.log(`${operation} failed: ${error.message}`)

      return of(result as T)
    }
  }
  private log(message: string) {
    this.messageService.add(`ArtifactsService: ${message}`)
  }
}
        {{</ file >}}

1. Open the `~/src/app/artifact-list/artifact-list.component.ts` file and add the following content:

    {{< file "~/src/app/artifact-list/artifact-list.component.ts" >}}
/* To illustrate the operation of the data server's routes, the
   the application defines a couple of components that correspond
   to the two displayed routes.  This component defines the
   procedures for handling data from the ‘/artifacts/NAME’ route.
*/
import { Component, OnInit } from '@angular/core'
import { Artifact } from '../artifact'
import { ArtifactService } from '../artifact.service'

@Component({
  selector: 'app-artifact-list',
  templateUrl: './artifact-list.component.html',
  styleUrls: ['./artifact-list.component.css']
})
export class ArtifactListComponent implements OnInit {

  artifact: Artifact = {cdn: "", scriptname: "", version: ""}
  artifacts: Artifact[] = [ ]
  details = ""

  constructor(private artifactService: ArtifactService) {}
  ngOnInit() {
    this.getArtifact("sortable.min.js")
    this.getArtifacts()
  }
  detail(artifact: Artifact): void {
    this.artifact = artifact
    this.details = "Details regarding " + artifact.scriptname +
                   ": Version " + artifact.version + "; cdn: " +
                   artifact.cdn + "."
  }
  getArtifacts(): void {
    this.artifactService.getArtifacts()
    .subscribe(artifacts => this.artifacts = artifacts)
  }
  public getArtifact(scriptname: string): void {
    this.artifactService.getArtifact(scriptname)
    .subscribe(artifact => this.detail(artifact))
  }
}
        {{</ file >}}

1. Add the next component to the `~/src/app/top/top/component.ts` file:

    {{< file "~/src/app/top/top/component.ts" >}}
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css']
})
export class TopComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }
}
        {{</ file >}}

    This update should allow the `sbom` application to compile cleanly at all times.

1. Now, open the first Angular template, `~/src/app/top/top.component.html`, and add the following content:

    {{< file "~/src/app/top/top.component.html" >}}
<p>You can see the current artifact list <a href = '/artifact-list'>here</a>.</p>
        {{</ file >}}

1. Open, the second Angular template, `artifact-list.component.html`, and add the following content:

    {{< file "~/src/app/artifact-list/artifact-list.component.html">}}
<p>Currently known artifacts include:</p>
<ul>
  <li *ngFor="let an_artifact of artifacts">
    <button (click) = "getArtifact(an_artifact.scriptname)">{{an_artifact.scriptname}}</button>
  </li>
</ul>
Select a button for more information about the selected artifact.
<p>{{details}}
<p><a href = '/'>Return to main menu</a>.</p>
        {{</ file >}}

1. Open the third Angular template, `~/src/app/app.component.html`, and add the following content:

    {{< file "~/src/app/app.component.html" >}}
<!doctype html>
<html>
<body>
  <h1>Minimal MEAN demonstration</h1>
  <h2>Artifact Center</h2>
  <router-outlet></router-outlet>
</body>
</html>
        {{</ file >}}

1. With all these pieces in place, open a web browser and navigate to the URL, `http://localhost:4200/`. You should see the following output:

    {{< output >}}
You can see the current artifact list [here](http://localhost:55051/artifact-list).
    {{</ output >}}

    Clicking on the link above brings you to a new page that displays the list of artifacts:

    {{< output >}}
dygraph.min.js
sortable.mis.js
swagger-ui-bundle.js
    {{</ output >}}

    The selection of any of the buttons brings up more details about that specific artifact.

After completing the steps in this section, data is flowing back and forth between the application in your web browser. Data flows to the Angular application, between Angular, and Express.js, from Express.js to MongoDB, and back again.

## Application Context

This is only a part of a truly useful application. A typical starting point for a full-fledged app, as already mentioned, is all four aspects of CRUD. The example above implements the read operation. A read is a dialogue: the frontend sends a request to the backend, which retrieves data, and then delivers it back to the frontend. A more complete application also creates, updates, and deletes records.

Typical considerations for building out a robust application include:

- A testing framework.
- Expanded infrastructure that hosts MongoDB, the data server, and Angular on three different servers.
- Far more care with error-handling.
- Visual design and implementation through CSS.
- Security considerations, including:

    - Validation and sanitization of user input.
    - Validation and encoding of database content.
    - CORS (cross-origin resource sharing) configuration once the Angular and data service servers migrate to separate hosts.
    - Aggressive enforcement of least privilege on all communications.

- Best practices in API definition, including versioning.
- Best practices in leveraging Angular, with heavy reliance on Angular components.
- Removal of explicit function calls from templates in favor of data bindings.
- Possible use of template engines and value-added database connectors or object-relational mappers (ORMs).


