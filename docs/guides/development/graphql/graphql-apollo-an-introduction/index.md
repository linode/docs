---
slug: graphql-apollo-an-introduction
description: 'In this guide, you will learn what GraphQL is and how to use the Apollo GraphQL client to manage local and remote data from your command line in Linux.'
keywords: ['what is apollo graphql', 'apollo graphql client', 'apollo graphql server']
tags: ['web applications']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-09-03
modified_by:
  name: Linode
title: "GraphQL Apollo: An Introduction with Examples"
title_meta: "An Introduction to GraphQL Apollo"
external_resources:
- '[GraphQL](https://graphql.org/)'
- '[Apollo](https://www.apollographql.com/)'
- '[Apollo GraphQL documentation](https://www.apollographql.com/docs/)'
authors: ["Cameron Laird"]
---

GraphQL is a server-side runtime and query language for APIs. Known for its speed, GraphQL is ideal for limited-bandwidth edge devices, and applications that benefit from GraphQL's bandwidth-saving query format. Compared to representational state transfer (REST), GraphQL lets you retrieve all the data you need in a single query. GraphQL began as an internal project at Facebook in 2012. After a public release in 2015, the [GraphQL Foundation](https://graphql.org/foundation/) was created in 2018 to provide a permanent home for GraphQL.

The example below displays a basic GraphQL query. The query retrieves data from specific fields on the example `realtor` object:

{{< output >}}
{
  realtor {
      name
  }
}
{{< /output >}}

The result of the query returns the following JSON output:

{{< output >}}
{
  "data": {
    "realtor": {
    "name": "Terry Musa"
    }
  }
}
{{< /output >}}

## What is Apollo GraphQL?

As a public specification, there are several GraphQL implementations. [Apollo](https://www.apollographql.com/) maintains the most prominent of these implementations. Apollo GraphQL is the collection of implementations the Apollo company bases on the GraphQL standard. Apollo’s implementation is largely [open-source](https://www.apollographql.com/docs/apollo-server/). In addition to its open-source products, Apollo offers specialized paid services that bring value to large-scale applications of GraphQL.

## What is the Apollo GraphQL Client?

In the GraphQL model, data is sent between a *client* and *server*. The client issues a request to the server, and the server answers the client’s request. The Apollo client is a JavaScript state management library that helps you fetch data and manipulate the data using concise syntax and development best practices. It is possible to use the Apollo GraphQL client with any GraphQL server; the latter doesn't have to be from Apollo.

## Apollo GraphQL vs REST

[Representational state transfer](https://searchapparchitecture.techtarget.com/definition/REST-REpresentational-State-Transfer) (REST) is still widely used and has [advantages over GraphQL](https://blog.logrocket.com/why-you-shouldnt-use-graphql/#whyandwhentousegraphql).

Some of the advantages of REST include:

- Community maturity. REST has been around since 2000. There are many resources supporting its usage and many experienced developers who are able to work with REST.
- Data format support. REST supports many types of data formats including CSV, HTML, JSON, and XML.
- Decoupled client and server implementations. When using REST, a client does not require any specialized libraries to query the server data.

Some of the advantages of GraphQL include:

- Prevents over fetching of data. You can retrieve all the data you need in a single query.
- Schema versioning is not required. Instead of versioning, GraphQL utilizes a schema registry to track an API's evolution.
- An extensive ecosystem of libraries. There are many libraries available to extend GraphQL's behavior.

To become more familiar with GraphQL's capabilities refer to the [Apollo blog's post on the benefits of GraphQL](https://www.apollographql.com/blog/graphql/basics/why-use-graphql/).

### Apollo GraphQL Client Example

The example in this section queries an open [GraphQL service](https://api.spacex.land/graphql/) that [SpaceX](https://www.spacex.com/) provides. Before beginning the steps in this section, ensure you have [installed Node.js using the Node Version Manager](/docs/guides/how-to-install-nodejs-and-nginx-on-ubuntu-18-04/#install-nodejs).

From your system's command line, install the GraphQL client:

    npm install graphql @apollo/client cross-fetch

{{< note respectIndent=false >}}
Your system may require [ECMAScript module (esm) loader](https://www.npmjs.com/package/esm). To install esm, use the following command:

      sudo npm install --save esm
{{< /note >}}

The installation should take a few seconds to complete.

Create a new file named `client-example.js` with the following content:

{{< file "client-example.js" >}}
// cross-fetch helps ensure correct behavior independent of the environment
// needs the HttpLink.
import fetch from 'cross-fetch';
const fetch = require('cross-fetch');
import {
  ApolloClient, gql, HttpLink, InMemoryCache
} from "@apollo/client";

const cache = new InMemoryCache()
const uri = 'https://api.spacex.land/graphql/';
const query = gql`
  query {
    launchesPast(limit: 10) {
      mission_name
    }
  }`
const link = new HttpLink({uri: uri, fetch});
const client = new ApolloClient({link: link, cache: cache});

client
  .query({query: query})
  .then(result => console.log(JSON.stringify(result)));
{{< /file >}}

This code imports the necessary libraries to then query the SpaceX API. The query expects a JSON response from the API.

Run the `client-example.js` file with the following command:

    node -r esm client-example.js

You should see a similar JSON output returned:

{{< output >}}
{"data":{"launchesPast":[{"__typename":"Launch","mission_name":"Starlink-15 (v1.0)"},{"__typename":"Launch","mission_name":"Sentinel-6 Michael Freilich"},{"__typename":"Launch","mission_name":"Crew-1"},{"__typename":"Launch","mission_name":"GPS III SV04 (Sacagawea)"},{"__typename":"Launch","mission_name":"Starlink-14 (v1.0)"},{"__typename":"Launch","mission_name":"Starlink-13 (v1.0)"},{"__typename":"Launch","mission_name":"Starlink-12 (v1.0)"},{"__typename":"Launch","mission_name":"Starlink-11 (v1.0)"},{"__typename":"Launch","mission_name":"SAOCOM 1B, GNOMES-1, Tyvak-0172"},{"__typename":"Launch","mission_name":"Starlink-10 (v1.0) & SkySat 19-21"}]},"loading":false,"networkStatus":7}
{{< /output >}}

Using your preferred JavaScript framework, you can update the code to request more data from the API and to render the data in a browser.

## Apollo GraphQL Server

Several implementations of a [GraphQL server](https://blog.graphqleditor.com/graphql-servers) are available to use. Apollo is a good choice given its robust documentation and potential for longevity. Several well-known companies use Apollo for their projects, including Airbnb, the New York Times, and CircleCI.

### Server Installation Steps

Before beginning the steps in this section, ensure you have [installed Node.js using the Node Version Manager](/docs/guides/how-to-install-nodejs-and-nginx-on-ubuntu-18-04/#install-nodejs) on your server.

To install the Apollo GraphQL server use the following command:

    npm install apollo-server-express express graphql

Create a new filled named `hello-server.js` and add the following content:

{{< file "hello-server.js" >}}
var {graphql, buildSchema} = require('graphql');

var schema = buildSchema(`
  type Query {
 hello: String
  }
`);

var root = {hello: () => 'Hello, world!'};

graphql(schema, '{ hello }', root)
  .then((response) => {
 console.log(response);
});
{{< /file >}}

Run the above example file using the following command

    node hello-server.js

You should see a similar output:

{{< output >}}
{ data: { hello: 'Hello, world!' } }
{{< /output >}}

The example demonstrates a GraphQL server response. The next step in server behavior is to embed this responsiveness into a web API. To do this, update the `server-example.js` with the following content:

{{< file "server-example.js" >}}
const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');

const typeDefs = gql`
      type Query {
      hello: String
  }`;
const resolvers = {
      Query: {
      hello: () => 'Hello, world!',
  },
};

async function startApolloServer() {
    const app = express();
    const server = new ApolloServer({ typeDefs, resolvers });
    const message = 'Please browse to <http://localhost:4000>' + server.graphqlPath;

    //You must "await server.start()" before calling "server.applyMiddleware()"
    //"await" can only be used inside an async() fun
    await server.start();
    server.applyMiddleware({ app });

    app.listen({ port: 4003 }, () =>
            console.log(message)
    );
}

startApolloServer();

{{< /file >}}

The code above defines the GraphQL schema, creates a resolver, and creates an instance of the Apollo server that is served on the localhost.

Run the code in the example file with the following command:

    node server-example.js

The output returns the following:

{{< output >}}
Please browse to <http://localhost:4000/graphql>
{{< /output >}}

{{< note respectIndent=false >}}
To visit the application remotely, you can use an SSH tunnel:

- On macOS or Linux, use the command below to set up the SSH tunnel. Replace `example-user` with your username on the application server and `192.0.2.0` with the server's IP address.

      ssh -L 4000:localhost:4000 example-user@192.0.2.0

Now you can visit the application in your browser by navigating to `https://localhost:4000`.
{{< /note >}}

If you visit `http://localhost:4000/graphql` in a browser, you see an empty instance of a playground Integrated Development Environment (IDE). Enter the following query in the left window of the playground IDE.

    query {hello}

Push the central play button with the right-pointing arrow icon. You can see the following output pop up on the right.

{{< output >}}
{
    "data": {
    "hello": "Hello, world!"
  }
}
{{< /output >}}

This section's example provides a simple model for creating a GraphQL service.

## Conclusion

Apollo GraphQL is a powerful platform that can take some time investment to learn to use. You can leverage free web tools to experiment and to model your GraphQL data. For example, use the  [GraphQL IDE](https://github.com/graphql/graphiql) and the [Sandbox Explorer](https://studio.apollographql.com/sandbox/explorer) to test your ideas. The GraphQL Foundation maintains a page on [best practices](https://graphql.org/learn/best-practices/) that you can visit to learn more about the specification.



