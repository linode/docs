---
slug: how-to-create-a-mern-stack-application
description: "Learn how to create a MERN stack application on Linux. Read our guide to learn MERN stack basics. ✓ Click here!"
keywords: ['MERN Stack Application','How to create a MERN stack application','MERN stack','MERN stack application', 'learn Linux filesystem', 'MERN stack on Linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-09-12
modified: 2022-09-23
modified_by:
  name: Linode
title: "Create a MERN Stack Application"
title_meta: "How to Create a MERN Stack on Linux"
external_resources:
- '[How to Use MERN Stack: A Complete Guide](https://www.mongodb.com/languages/mern-stack-tutorial)'
- '[The MERN stack: A complete tutorial](https://blog.logrocket.com/mern-stack-tutorial/)'
- '[Learn the MERN Stack - Full Tutorial for Beginners (MongoDB, Express, React, NodeJS) in 12Hrs (2021)](https://www.youtube.com/watch?v=7CqJlxBYj-M)'
- '[Learn the MERN Stack - Full Tutorial (MongoDB, Express, React, Node.js)](https://www.youtube.com/watch?v=7CqJlxBYj-M)'
authors: ["Cameron Laird"]
---

Of all the possible technical bases for a modern web site, ["MERN holds the leading position when it comes to popularity."](https://www.gkmit.co/blog/web-app-development/mean-vs-mern-stack-who-will-win-the-war-in-2021) This introduction makes you familiar with the essential tools used for a plurality of all web sites worldwide.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note respectIndent=false >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What is the MERN stack?

MERN refers to MongoDB, Express.js, ReactJS, and Node.js, four software tools which cooperate to power millions of web sites worldwide. In broad terms:

*   [**MongoDB**](/docs/guides/databases/mongodb/) manages data, such as customer information, technical measurements, and event records.
*   [**Express.js**](/docs/guides/express-js-tutorial/) is a web application framework for the "behaviors" of particular applications. For example, how data flows from catalog to shopping cart.
*   [**ReactJS**](/docs/guides/development/react/) is a library of user-interface components for managing the visual "state" of a web application.
*   [**Node.js**](/docs/guides/development/nodejs/) is a back-end runtime environment for the server side of a web application.

Linode has [many articles](/docs/guides/) on each of these topics, and supports thousands of [Linode customers who have created successful applications](https://www.linode.com/content-type/spotlights/) based on these tools.

One of MERN’s important distinctions is the [JavaScript programming language is used throughout](https://javascript.plainenglish.io/why-mern-stack-is-becoming-popular-lets-see-in-detail-8825fd3fd5ee) the entire stack. Certain competing stacks use PHP or Python on the back end, JavaScript on the front end, and perhaps SQL for data storage. MERN developers focus on just a single programming language, [JavaScript, with all the economies](https://javascript.plainenglish.io/should-you-use-javascript-for-everything-f98015ade40a) that implies, for training and tooling.

## Install the MERN stack

You can install a basic MERN stack on a 64-bit x86_64 [Linode Ubuntu 20.04 host](https://www.linode.com/distributions/) in under half an hour. As of this writing, parts of MERN for Ubuntu 22.04 remain experimental. While thousands of variations are possible, this section typifies a correct "on-boarding" sequence. The emphasis here is on "correct", as scores of already-published tutorials embed enough subtle errors to block their use by readers starting from scratch.

### Install MongoDB

1.  Update the repository cache:

        apt update -y

2.  Install the networking and service dependencies Mongo requires:

        apt install ca-certificates curl gnupg2 systemctl wget -y

3.  Configure access to the official MongoDB Community Edition repository with the MongoDB public GPG key:

        wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | apt-key add -

4.  Create a MongoDB list file:

        echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-5.0.list

5.  Update the repository cache again:

        apt update -y

6.  Install MongoDB itself:

        apt install mongodb-org -y

7.  Enable and the MongoDB service:

        systemctl enable mongod

8.  Launch the MongoDB service:

        systemctl start mongod

9.  Verify the MongoDB service:

        systemctl status mongod

    You should see diagnostic information that concludes:

    {{< output >}}… Started MongoDB Database Server.{{< /output >}}

0.  For an even stronger confirmation that the Mongo server is ready for useful action, connect directly to it and issue this command:

        mongo

1.  Now issue this command:

        db.runCommand({ connectionStatus: 1 })

    You should see, along with many other details, this summary of the connectionStatus:

    {{< output >}}… MongoDB server … "ok" : 1 …{{< /output >}}

2.  Exit Mongo:

        exit

### Install Node.js

While the acronym is MERN, the true order of its dependencies is better written as "MNRE". ReactJS and Express.js conventionally require Node.js, so the next installation steps focus on Node.js. As with MongoDB, Node.js's main trusted repository is not available in the main Ubuntu repository.

1.  Run this command to adjoin it:

        curl -sL https://deb.nodesource.com/setup_16.x | bash -

2.  Install Node.js itself:

        apt-get install nodejs -y

3.  Verify the installation:

        node -v

    You should see `v16.15.1` or perhaps later.

### Install React.js

1.  Next, install React.js:

        mkdir demonstration; cd demonstration
        npx --yes create-react-app frontend
        cd frontend
        npm run build

Templates for all the HTML, CSS, and JS for your model application are now present in the demonstration/frontend directory.

### Install Express.js

1.  Express.js is the final component of the basic MERN stack.

        cd ..; mkdir server; cd server
        npm init -y
        cd ..
        npm install cors express mongodb mongoose nodemon

## Use the MERN stack to create an example application

The essence of a web application is to respond to a request from a web browser with an appropriate result, backed by a datastore that "remembers" crucial information from one session to the next. Any realistic full-scale application involves account management, database backup, context dependence, and other refinements. Rather than risk the distraction and loss of focus these details introduce, this section illustrates the simplest possible use of MERN to implement a [three-tier operation](https://www.ibm.com/cloud/learn/three-tier-architecture) typical of real-world applications.

"Three-tier" in this context refers to the teamwork web applications embody between:

*   The presentation in the web browser of the state of an application
*   The "back end" of the application which realizes that state
*   The datastore which supports the back end beyond a single session of the front end or even the restart of the back end.

You can create a tiny application which receives a request from a web browser, creates a database record based on that request, and responds to the request. The record is visible within the Mongo datastore.

### Initial configuration of the MERN application

1.  Create `demonstration/server/index.js` with this content:

    {{< file "demonstration/server/index.js" javascript >}}
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
{{</ file >}}

2.  Create `demonstration/routes/api.js` with this content:

    {{< file "demonstration/routes/api.js" javascript >}}
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
{{</ file >}}

3.  Create `demonstration/server/server.js` with this content:

    {{< file "demonstration/server/server.js" javascript >}}
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
{{</ file >}}

### Verify your application

1.  Launch the application server:

        node server/index.js

2.  In a convenient Web browser, request:

        localhost:4200/api/record?item=this-new-item

    At this point, your terminal should display:

    {{< output >}}One item (this-new-item) inserted.{{< /output >}}

3.  Now launch an interactive shell to connect to the MongoDB datastore:

        mongo

4.  Within the MongoDB shell, request:

        use mydb
        db.demonstration.find({})

    Mongo should report that it finds a record:

    {{< output >}}{ "_id" : ObjectId("62c84fe504d6ca2aa325c36b"), "name" : "this-new-item" }{{< /output >}}

This demonstrates a minimal MERN action:
*   The web browser issues a request with particular data.
*   The React front end framework routes that request.
*   The Express application server receives the data from the request, and acts on the MongoDB datastore.

## Conclusion

You now know how to install each of the basic components of the MERN stack on a standard Ubuntu 20.04 server, and team them together to demonstrate a possible MERN action: creation of one database record based on a browser request.

Any real-world application involves considerably more configuration and source files. MERN enjoys abundant tooling to make the database and web connections more secure, to validate data systematically, to structure a [complete Application Programming Interface](https://www.mongodb.com/blog/post/the-modern-application-stack-part-3-building-a-rest-api-using-expressjs) (API), and to simplify debugging. Nearly all practical applications need to create records, update, delete, and list them. All these other refinements and extensions use the elements already present in the workflow above. You can build everything your full application needs from this starting point.