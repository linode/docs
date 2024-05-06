---
slug: install-the-mern-stack
title: "Install the MERN Stack and Create an Example Application"
description: "Learn how to create a MERN stack application on Linux. Read our guide to learn MERN stack basics."
authors: ["Cameron Laird", "Nathaniel Stickman"]
contributors: ["Cameron Laird", "Nathaniel Stickman"]
published: 2022-09-12
modified: 2022-09-23
keywords: ['MERN Stack Application','How to create a MERN stack application','MERN stack','MERN stack application', 'learn Linux filesystem', 'MERN stack on Linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[How to Use MERN Stack: A Complete Guide](https://www.mongodb.com/languages/mern-stack-tutorial)'
- '[The MERN stack: A complete tutorial](https://blog.logrocket.com/mern-stack-tutorial/)'
- '[Learn the MERN Stack - Full Tutorial for Beginners (MongoDB, Express, React, NodeJS) in 12Hrs (2021)](https://www.youtube.com/watch?v=7CqJlxBYj-M)'
- '[Learn the MERN Stack - Full Tutorial (MongoDB, Express, React, Node.js)](https://www.youtube.com/watch?v=7CqJlxBYj-M)'
aliases: ['/guides/how-to-create-a-mern-stack-application/']
---

Of all the possible technical bases for a modern website, ["MERN holds the leading position when it comes to popularity."](https://www.gkmit.co/blog/web-app-development/mean-vs-mern-stack-who-will-win-the-war-in-2021) This introduction makes you familiar with the essential tools used for a plurality of all websites worldwide.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What Is the MERN Stack?

MERN refers to MongoDB, Express.js, ReactJS, and Node.js, four software tools that cooperate to power millions of websites worldwide. In broad terms:

- [**MongoDB**](/docs/guides/databases/mongodb/) manages data, such as customer information, technical measurements, and event records.
- [**Express.js**](/docs/guides/express-js-tutorial/) is a web application framework for the "behaviors" of particular applications. For example, how data flows from catalog to shopping cart.
- [**ReactJS**](/docs/guides/development/react/) is a library of user-interface components for managing the visual "state" of a web application.
- [**Node.js**](/docs/guides/development/nodejs/) is a back-end runtime environment for the server side of a web application.

Linode has [many articles](/docs/guides/) on each of these topics and supports thousands of [Linode customers who have created successful applications](https://www.linode.com/content-type/spotlights/) based on these tools.

One of MERN’s important distinctions is the [JavaScript programming language is used throughout](https://javascript.plainenglish.io/why-mern-stack-is-becoming-popular-lets-see-in-detail-8825fd3fd5ee) the entire stack. Certain competing stacks use PHP or Python on the back end, JavaScript on the front end, and perhaps SQL for data storage. MERN developers focus on just a single programming language, [JavaScript, with all the economies](https://javascript.plainenglish.io/should-you-use-javascript-for-everything-f98015ade40a) that implies, for training and tooling.

## Install the MERN stack

You can install a basic MERN stack on a 64-bit x86_64 [Linode Ubuntu 20.04 host](https://www.linode.com/distributions/) in under half an hour. As of this writing, parts of MERN for Ubuntu 22.04 remain experimental. While thousands of variations are possible, this section typifies a correct "on-boarding" sequence. The emphasis here is on "correct", as scores of already-published tutorials embed enough subtle errors to block their use by readers starting from scratch.

### Install MongoDB

1.  Update the repository cache using the following command:

    ```command
    apt update -y
    ```

1.  Install the networking and service dependencies Mongo requires using the following command:

    ```command
    apt install ca-certificates curl gnupg2 systemctl wget -y
    ```

1.  Import the GPG key for MongoDB.

    ```command
    wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
    ```

1. Add the MongoDB package list to APT.

    {{< tabs >}}
    {{< tab "Debian 10 (Buster)" >}}
    ```command
    echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/5.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
    ```
    {{< /tab >}}
    {{< tab "Ubuntu 20.04 (Focal)" >}}
    ```command
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
    ```
    {{< /tab >}}
    {{< /tabs >}}

1.  Update the APT package index using the following command:

    ```command
    sudo apt update
    ```

1.  Install MongoDB using the following command:

    ```command
    sudo apt install mongodb-org
    ```

See the official documentation for more on installing MongoDB [on Debian](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/) and [on Ubuntu](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/). You can also refer to our guide [How To Install MongoDB on Ubuntu 16.04](/docs/guides/install-mongodb-on-ubuntu-16-04/).

#### Start MongoDB and Verify the Installation

Once MongoDB has been installed, enable and start the service. You can optionally test MongoDB to verify that it has been installed correctly.

1.  Enable the MongoDB service using the following command:

    ```command
    systemctl enable mongod
    ```

1.  Launch the MongoDB service using the following command:

    ```command
    systemctl start mongod
    ```

1.  Verify the MongoDB service using the following command:

    ```command
    systemctl status mongod
    ```

    You should see diagnostic information that concludes the MongoDB database server has started.

    ```output
    … Started MongoDB Database Server.
    ```

1.  For an even stronger confirmation that the Mongo server is ready for useful action, connect directly to it and issue the following command:

    ```command
    mongo
    ```

1.  Now issue the following command:

    ```command
    db.runCommand({ connectionStatus: 1 })
    ```

    You should see, along with many other details, the following summary of the connection status:

    ```output
    … MongoDB server … "ok" : 1 …
    ```

1.  Exit Mongo using the following command:

    ```command
    exit
    ```

### Install Node.js

While the acronym is MERN, the true order of its dependencies is better written as "MNRE". ReactJS and Express.js conventionally require Node.js, so the next installation steps focus on Node.js. As with MongoDB, Node.js's main trusted repository is not available in the main Ubuntu repository.

1.  Install the Node Version Manager, the preferred method for installing Node.js using the following command:

    ```command
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    ```

1.  Restart your shell session (logging out and logging back in), or run the following command:

    ```command
    export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    ```

1.  Install the current version of Node.js using the following command:

    ```command
    nvm install node
    ```

1.  If you are deploying an existing project that uses the Yarn package manager instead of NPM, you need to install Yarn as well. You can do so with the following command:

    ```command
    npm install -g yarn
    ```

You can additionally refer to our [How to Install and Use the Node Package Manager (NPM) on Linux](/docs/guides/install-and-use-npm-on-linux/#how-to-install-or-update-npm) guide. If you are interested in using Yarn instead of NPM, take a look at our [How to Install and Use the Yarn Package Manager](/docs/guides/install-and-use-the-yarn-package-manager/) guide.

### Install React.js

Install React.js using the following commands:

```command
mkdir demonstration; cd demonstration
npx --yes create-react-app frontend
cd frontend
npm run build
```

Templates for all the HTML, CSS, and JS for your model application are now present in the `demonstration/frontend` directory.

### Install Express.js

Express.js is the final component of the basic MERN stack. Install it using the following commands:

```command
cd ..; mkdir server; cd server
npm init -y
cd ..
npm install cors express mongodb mongoose nodemon
```
## Use the MERN Stack to Create an Example Application

The essence of a web application is to respond to a request from a web browser with an appropriate result, backed by a datastore that "remembers" crucial information from one session to the next. Any realistic full-scale application involves account management, database backup, context dependence, and other refinements. Rather than risk the distraction and loss of focus these details introduce, this section illustrates the simplest possible use of MERN to implement a [three-tier operation](https://www.ibm.com/cloud/learn/three-tier-architecture) typical of real-world applications.

"Three-tier" in this context refers to the teamwork web applications embody between:

- The presentation in the web browser of the state of an application
- The "back end" of the application which realizes that state
- The datastore which supports the back end beyond a single session of the front end or even the restart of the back end.

You can create a tiny application that receives a request from a web browser, creates a database record based on that request, and responds to the request. The record is visible within the Mongo datastore.

### Initial Configuration of the MERN Application

1.  Create `demonstration/server/index.js` with the following content:

    ```file {title="demonstration/server/index.js" lang="javascript"}
    const express = require('express');
    const bodyParser = require('body-parser');
    const mongoose = require('mongoose');
    const routes = require('../routes/api');
    const app = express();
    const port = 4200;

    // Connect to the database
    mongoose
        .connect('mongodb://127.0.0.1:27017/', { useNewUrlParser: true })
        .then(() => console.log(`Database connected successfully`))
        .catch((err) => console.log(err));

    // Override mongoose's deprecated Promise with Node's Promise.
    mongoose.Promise = global.Promise;
        app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    app.use(bodyParser.json());
    app.use('/api', routes);
    app.use((err, req, res, next) => {
    console.log(err);
    next();
    });

    app.listen(port, () => {
      console.log(`Server runs on port ${port}.`);
    });
    ```

1.  Create `demonstration/routes/api.js` with the following content:

    ```file {title="demonstration/routes/api.js" lang="javascript"}
    const express = require('express');
    const router = express.Router();

    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb://127.0.0.1:27017/';
    const mongoose = require('mongoose');
    var db = mongoose.connection;

    router.get('/record', (req, res, next) => {
      item = req.query.item;
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var myobj = { name: item };
        dbo.collection("demonstration").insertOne(myobj, function(err, res) {
          if (err) throw err;
            console.log(`One item (${item}) inserted.`);
            db.close();
        })
      });
    })
    module.exports = router;
    ```

1.  Create `demonstration/server/server.js` with the following content:

    ```file {title="demonstration/server/server.js" lang="javascript"}
    const express = require("express");
    const app = express();
    const cors = require("cors");
    require("dotenv").config({ path: "./config.env" });
    const port = process.env.PORT || 4200;
    app.use(cors());
    app.use(express.json());
    app.use(require("./routes/record"));
    const dbo = require("./db/conn");

    app.listen(port, () => {
      // Connect on start.
      dbo.connectToServer(function (err) {
        if (err) console.error(err);
      });
      console.log(`Server is running on port: ${port}`);
    });
    ```

### Verify Your Application

1.  Launch the application server using the following command:

    ```command
    node server/index.js
    ```

1.  In a convenient Web browser, request the URL, ``localhost:4200/api/record?item=this-new-item``

    At this point, your terminal should display the following output:

    ```output
    One item (this-new-item) inserted.
    ```

1.  Now launch an interactive shell to connect to the MongoDB datastore using the following command:

    ```command
    mongo
    ```

1.  Within the MongoDB shell, request:

        use mydb
        db.demonstration.find({})

    Mongo should report that it finds a record:

    {{< output >}}{ "_id" : ObjectId("62c84fe504d6ca2aa325c36b"), "name" : "this-new-item" }{{< /output >}}

This demonstrates a minimal MERN action:
- The web browser issues a request with particular data.
- The React frontend framework routes that request.
- The Express application server receives the data from the request, and acts on the MongoDB datastore.

## Conclusion

You now know how to install each of the basic components of the MERN stack on a standard Ubuntu 20.04 server, and team them together to demonstrate a possible MERN action: creation of one database record based on a browser request.

Any real-world application involves considerably more configuration and source files. MERN enjoys abundant tooling to make the database and web connections more secure, to validate data systematically, to structure a [complete Application Programming Interface](https://www.mongodb.com/blog/post/the-modern-application-stack-part-3-building-a-rest-api-using-expressjs) (API), and to simplify debugging. Nearly all practical applications need to create records, update, delete, and list them. All these other refinements and extensions use the elements already present in the workflow above. You can build everything your full application needs from this starting point.