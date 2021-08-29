---
slug: graphql-apollo-an-introduction
author:
  name: Cameron Laird
  email: claird@phaseit.net
description: 'Apollo Client is a comprehensive state management library for JavaScript that enables you to manage both local and remote data with GraphQL. In this guide, you learn what a GraphQL is, and how to use an Apollo GraphQL client with any Apollo GraphQL server.'
og_description: 'Apollo Client is a comprehensive state management library for JavaScript that enables you to manage both local and remote data with GraphQL. In this guide, you learn what a GraphQL is, and how to use an Apollo GraphQL client with any Apollo GraphQL server.'
keywords: ['what is apollo graphql', 'apollo graphql client', 'apollo graphql server']
tags: ['graphql']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-19
modified_by:
  name: Linode
title: "GraphQL Apollo: An Introduction"
h1_title: "GraphQL Apollo: An Introduction with Examples"
enable_h1: true
contributor:
  name: Cameron Laird
external_resources:
- '[GraphQL](https://graphql.org/)'
- '[GraphQL Foundation](https://graphql.org/foundation/)'
- '[Apollo](https://www.apollographql.com/)'
- '[Apollo GraphQL documentation](https://www.apollographql.com/docs/)'
- '[GraphQL service](https://api.spacex.land/graphql/)'
- '[SpaceX](https://www.spacex.com/)'
- '[GraphQL server implementations](https://blog.graphqleditor.com/graphql-servers)'
- '[Apollo GraphQL best practices](https://www.apollographql.com/blog/apollo-client/introducing-the-best-practices-series/)'
---

Do you retrieve data from multiple online sources to such limited-bandwidth [edge devices](https://www.intel.com/content/www/us/en/edge-computing/edge-devices.html) as smartwatches, mobile telephone handsets, and [Internet-of-things](https://www.linode.com/docs/guides/development/iot/) (IoT) machines? If so, you want to learn [GraphQL](https://graphql.org/), a maturing standard *query language* for accessing online data that particularly fits such applications. GraphQL began as an internal project at Facebook in 2012. After a public release in 2015, the [GraphQL Foundation](https://graphql.org/foundation/) was created in 2018 to provide a permanent home for GraphQL.

A fundamental type of GraphQL language is the query. An example representation of a query is shown below:

{{< output >}}
{
  realtor {
      # GraphQL supports comments.
      # This is the realtor’s business name, which
      # might differ from his or her legal identity.
      name
  }
}
{{< /output >}}

The result of such a query might look like the following:

{{< output >}}
{
  "data": {
    "realtor": {
    "name": "Terry Musa"
    }
  }
}
{{< /output >}}

Any application which transacts data communicated from one device to another is a candidate for structuring those communications in terms of GraphQL.

## What is Apollo GraphQL?

As a public standard, the GraphQL language admits multiple implementations. [Apollo](https://www.apollographql.com/) maintains the most prominent of these implementations, with high-profile [venture capital backing](https://www.crunchbase.com/organization/meteor) and headquarters in San Francisco Apollo’s implementation is largely [open-source](https://www.apollographql.com/docs/apollo-server/): anyone can use it freely. Apollo makes money on a [hosted infrastructure](https://www.apollographql.com/blog/announcement/introducing-apollo-engine-insights-error-reporting-and-caching-for-graphql-6a55147f63fc/) that brings value to large-scale applications of GraphQL, as well as other more specialized services.

Be clear on these distinctions: GraphQL is a language defined outside Apollo. Apollo GraphQL is the collection of implementations the Apollo company bases on the GraphQL standard.

## What is the Apollo GraphQL Client?

The initial GraphQL example above is about the name of a particular individual. In the GraphQL model, such data is sent between a *client* and *server*: the client issues a request to the server, and the server answers the client’s request. The Apollo GraphQL client is open-source, freely available software which expresses GraphQL queries, transmits them to a GraphQL server, and receives responses. Because GraphQL is a public standard, it is possible to use an Apollo GraphQL client with any GraphQL server; the latter doesn't have to be from Apollo.

### Apollo GraphQL Client Example

While Apollo provides extensive [documentation](https://www.apollographql.com/docs/), including high-quality [tutorials](https://www.apollographql.com/docs/tutorial/introduction/), this example is simpler, more direct, and more current than those in the Apollo tutorials. Recall that GraphQL always communicates between a client and server. Your first example client takes advantage of an open [GraphQL service](https://api.spacex.land/graphql/) that [SpaceX](https://www.spacex.com/) provides. This allows you to focus entirely on the client’s side of communications.

All the configuration which follows assumes a good installation of [npm](https://www.npmjs.com/) and [Node.js](https://nodejs.org/en/).

From a convenient command line, request

    npm install graphql @apollo/client cross-fetch

{{< note >}}
Install the dependency using the following command:

      sudo npm install --save esm
{{< /note >}}

This should take only a few seconds to complete.

Create `client-example.js` with the following content:

{{< file "client-example.js" >}}
// cross-fetch helps ensure correct behavior whatever environment
// needs the HttpLink.
//import fetch from 'cross-fetch';
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

Execute `node -r esm client-example.js`. You should see a result similar to the following:

{{< output >}}
{"data":{"launchesPast":[{"__typename":"Launch","mission_name":"Starlink-15 (v1.0)"},{"__typename":"Launch","mission_name":"Sentinel-6 Michael Freilich"},{"__typename":"Launch","mission_name":"Crew-1"},{"__typename":"Launch","mission_name":"GPS III SV04 (Sacagawea)"},{"__typename":"Launch","mission_name":"Starlink-14 (v1.0)"},{"__typename":"Launch","mission_name":"Starlink-13 (v1.0)"},{"__typename":"Launch","mission_name":"Starlink-12 (v1.0)"},{"__typename":"Launch","mission_name":"Starlink-11 (v1.0)"},{"__typename":"Launch","mission_name":"SAOCOM 1B, GNOMES-1, Tyvak-0172"},{"__typename":"Launch","mission_name":"Starlink-10 (v1.0) & SkySat 19-21"}]},"loading":false,"networkStatus":7}
{{< /output >}}

This is only a starting point, of course. It’s possible to configure the same query to run in the browser. The query can be expanded to provide more detail on each launch and the full power of Node.js is available for a more complete application. [React](https://reactjs.org/) is a natural complement to GraphQL; that means it’s natural to extend such projects as “[Create a CI/CD Pipeline](https://www.linode.com/docs/guides/install-gatsbyjs/)” with all the data available through GraphQL.

## Apollo GraphQL vs REST

An earlier standard for retrieval of Internet-hosted data was [representational state transfer](https://searchapparchitecture.techtarget.com/definition/REST-REpresentational-State-Transfer) (REST), defined by Roy Fielding’s 2000 [dissertation](https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm). REST remains in wide use and continues to have [advantages over GraphQL](https://blog.logrocket.com/why-you-shouldnt-use-graphql/#whyandwhentousegraphql) in straightforward applications and those based on web caching, among other situations. Full comparisons of REST and GraphQL are well beyond the scope of this introduction, and several lengthy treatments are available, including one from Apollo itself. Among the [benefits of GraphQL](https://www.mediacurrent.com/blog/5-reasons-why-you-should-consider-graphql-server/), you should be familiar with its potential to economize on network traffic and development effort and to federate data from multiple and disparate sources. REST implementations define a specific Application Programming Interface (API), and requests from that API receive all its data. The communications are determined by the server-side definitions.

GraphQL dialogues, in contrast, receive only the data the client specifies. This can be a small fraction of the networking load a REST architecture creates. As a full-blown query language, GraphQL is more supple at expressing complex relations that potentially span multiple data sources. REST-based applications express the same results [procedurally](https://www.toptal.com/software/declarative-programming), with all the potential for error that brings.

The most important initial comparison of Apollo GraphQL and REST is to emphasize their similarity, as Apollo’s write-up mentioned in the previous paragraph properly does. GraphQL and REST have much in common.

## Apollo GraphQL Server

Plenty of GraphQL [server implementations](https://blog.graphqleditor.com/graphql-servers) are available. Apollo is a safe choice at the beginning of any project, if only for the completeness of its documentation and financial sustainability mentioned above. Apollo is in active use by large projects including those under [recognizable names](https://stackshare.io/apollo) such as Airbnb, the New York Times, and CircleCI.

### Server Installation Steps

A minimal implementation based on Apollo’s server-side code is just as quick as the client example above. Start with

    npm install apollo-server-express express graphql

Create `hello-server.js` with content

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

Run the above example file using the command `node hello-server.js`, and you should see an output similar to the following:

{{< output >}}
{ data: { hello: 'Hello, world!' } }
{{< /output >}}

This exhibits on the command line, Apollo’s ability to interpret a GraphQL request and respond. The next step in server behavior is to embed this responsiveness in a Web API. To do this, update the `server-example.js` with the following content:

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

Launch the above example file using the command: `node server-example.js`. You can see the following output:

{{< output >}}
Please browse to <http://localhost:4000/graphql>
{{< /output >}}

If you visit <http://localhost:4000/graphql> at this point, you’ll see an empty instance of a Playground Integrated Development Environment (IDE). Enter the following on the left window of the Playground IDE.

    query {hello}

Push the central play button with the right-pointing arrow icon. You can see the following output pop up on the right.

{{< output >}}
{
    "data": {
    "hello": "Hello, world!"
  }
}
{{< /output >}}

This is a model for all practical GraphQL services: by defining more elaborate types and [resolvers](https://www.apollographql.com/docs/tutorial/resolvers/), ApolloServer can implement essentially any legal GraphQL service.

## Apollo GraphQL Best Practices

GraphQL is a big subject, and study of its best practices is a full-time undertaking. Think of the highlights in these terms:

- **Distinguish design and architecture from developer habits**: Much of what has been written focuses on planning good implementations for GraphQL projects. As important as this is, it neglects a few of the ideas that working GraphQL programmers keep in mind to make the most of their efforts. It’s like the difference between contracting for specific nails to be used in roofing a house--that’s the design--and the hammers used to drive those nails. Developers ought to consider these opportunities:

  - Learn [GraphQL](https://github.com/graphql/graphiql) and [Sandbox](https://studio.apollographql.com/sandbox/explorer) and how they can save time in your daily work. These freely available Web tools and IDEs are invaluable in modeling, experimenting, and testing GraphQL projects.

  - Leverage the [`@deprecated` attribute](https://help.totaralearning.com/display/DEV/GraphQL+deprecation+guidelines) to retire old APIs.

  - GraphQL queries, mutations, and fragments generally can be anonymous. It frequently [helps to name](https://graphql.org/learn/queries/) them, though.

  - Learn [query variables](https://medium.com/the-graphqlhub/graphql-tour-variables-58c6abd10f56).

- **Learn good GraphQL style**: The GraphQL Foundation maintains a page on [important issues](https://graphql.org/learn/best-practices/) and the best practices for dealing with them.

- **Learn good Apollo GraphQL style**: Apollo has the good sense to support a [series on best practices](https://www.apollographql.com/blog/apollo-client/introducing-the-best-practices-series/). It’s worth reading each of these, and [keeping up](https://www.apollographql.com/blog/search/?q=best+practices) as new ones emerge. As it happens, though, obvious queries, and summaries like the previous ones, don’t locate all the Apollo documentation on best practices. [This detailed page](https://www.apollographql.com/docs/react/data/operation-best-practices/) on the design of queries and mutations is an example of one that doesn't show up in Apollo’s own search results.

- **Take advantage of others**: As you progress in your GraphQL career, remember that the state of the art is rapidly advancing. New tools for working with particular resources--Apollo GraphQL and Linode, Apollo GraphQL and GitHub, and so on--emerge almost daily. You’ll go a lot farther when you make the most of the experience and discoveries of others who work in particular GraphQL specialties.
