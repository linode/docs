---
slug: restful-vs-non-restful-apis
author:
name: Chelsea Troy
email: heychelseatroy@gmail.com
description: 'When should you write RESTful vs. non-RESTful APIs? Here&#39;s how to choose.'
og\_description: 'When would you write RESTful vs. non-RESTful APIs? @HeyChelseaTroy explains how to choose.'
keywords: 'python api framework fastapi rest']
license: &#39;[CC BY-ND 4.0]([https://creativecommons.org/licenses/by-nd/4.0](https://creativecommons.org/licenses/by-nd/4.0))&#39;
**published: 2021-02-26**
modified\_by:
name: Linode
title: &quot; **When to create RESTful vs. non-RESTful APIs**&quot;
h1\_title: &quot;When to create RESTful vs. non-RESTful APIs&quot;
contributor:
name: Chelsea Troy
link: twitter.com/HeyChelseaTroy
external
- [Choose a Python framework to build an API](https://www.linode.com/docs/guides/development/python/choosing-python-api-framework)
- [CRUD READ operations in Python Using FastAPI: View, List](https://www.linode.com/docs/guides/development/python/read-requests-rest-fastapi)
- [CRUD Write Operations in Python Using FastAPI](https://www.linode.com/docs/guides/development/python/write-requests-rest-fastapi)
---

# When to create RESTful vs. non-RESTful APIs

The [first post in this series](https://www.linode.com/docs/guides/development/python/choosing-python-api-framework) focused on how to select between Python framework options for an API, and the last two posts demonstrated how to build a RESTful API in the FastAPI framework to fetch programming language information from a datastore.

But what makes the RESTful conventions the right API design choice in the first place? When should developers use them, and when is something else a better option? Sometimes, programmers use &quot;RESTful API design&quot; as an implied synonym for &quot;good API design,&quot; but the answer is not that simple. (Read more about the [history of RESTful conventions here](https://chelseatroy.com/2018/08/10/api-design-part-2-the-arrival-of-rest/).)

## The RESTful conventions focus on accessing a resource: a noun

In the FastAPI example application, the focus is on serving up information about programming languages, [inspired by this blog post](https://www.hillelwayne.com/post/influential-dead-languages/) by Hillel Wayne. Each programming language represents an instance of a thing of the same type. Those things live in a data store, and the API allows clients to list, filter, create, update, or delete them. RESTful conventions perfectly match this use case, so a RESTful API is a sensible design choice for services that wrap a database to give clients access.

## If REST works great as a pass-through for database access, why not have clients just connect directly to the database?

Connecting directly to the database can work if the client app has a secure connection and a very clear use case. In most circumstances, though, it&#39;s not a good idea.

### **Reason 1: Security**

A database usually requires a username and password, or a similar security measure, to access its contents—but just one. If several clients use these credentials, they cannot be changed without breaking the clients, and there is an increased risk that they fall into the wrong hands.

Instead, a wrapping server can be the _only_ application with database access. Plus, it can authenticate all the clients with _separate_ credentials, so that if some credentials need to be deleted or changed, the database remains secure.

### Reason 2: Convenience (and security, again)

Database query languages (such as SQL or Cypher) are not great data transfer protocols. This is what SQL looks like, as an example:

```SQL
select programming_languag_id, name, publication_date, contribution
    from programming_languages
    where (publication_date between 1965 and 1975 -- inclusive
        or contribution like '%conditional%')
	   and name NOT in (“CPL”, “ALGOL”)
        order by publication_date DESC;
```

And this is what Cypher (a query language for graph databases) looks like:

```cypher
MATCH (m:Movie { title: line.title })
MERGE (p:Person { name: line.name })
ON CREATE SET p.born = toInteger(line.born)
MERGE (p)-[:ACTED_IN { roles:split(line.roles, ';')}]->(m)
```

These languages allow for complex, highly customizable queries, but they&#39;re also not trivial to read, and it&#39;s easy to make a mistake. To query a database directly, a server usually sends a query as a string, as in the example above.

If any old client could send these queries, the likelihood would increase that the database fields queries with mistakes in them—maybe mistakes that irreparably modify data. Or worse, a client might _deliberately_ send a query that deletes or corrupts data.

An API that guards access to the database can minimize these risks. It explodes specific endpoints for the operations that clients should be doing and privately manages the query to do that. The server has to treat those variables with care even in cases where an API server manages the query and only allows clients to provide variables to plug into the query to ensure that they won&#39;t mess up the query in ways that harm the data. (Such an occurrence is called a **SQL injection attack.**)

### Reason 3: Discoverability

An API can make it easy for clients to get the records they need from the data. For example, maybe the application you&#39;re building needs to query programming languages published in the last ten years. For this, API developers could create an endpoint that makes a `GET` request to `/programming_languages?published_after={(Date().year - 10)}`. Or, if that&#39;s a _really_ common requirement, the API might make it even easier by exposing an endpoint like `programming_languages/last_ten_years`.

An API server might also expose endpoints to access resources from several different tables in a database, or even multiple different databases! Suppose that the database also has a table of programmers, some of whom invented programming languages (say, Bjarne Stroustrup or Dennis Ritchie). The API could expose an endpoint at `programming_language_developers` that finds every programmer in the programmers table whose id appears in an `inventor_id` column in the `programming_languages` table.

## RESTful conventions work less well when the focus is on an action (a verb) rather than a resource (a noun).

RESTful routes do not naturally fit every need. They are not ideal for creating endpoints that allow clients to do operations including aggregating, summarizing, batching, or checking the data in the tables.

Developers sometimes try to jam these types of operations into a RESTful convention, though. For example, it would be possible to write an endpoint that concatenates all the programming language contributions from languages published in a given year with an endpoint like `&quot;`/programming_languages/years/1975/contributions`. It&#39;s possible, but not a good idea.

A construction like this loses a lot of the benefits that a RESTful protocol tries to provide: in particular, discoverability. A developer familiar with REST can guess the endpoint to get a programming language with a specific id, but they probably cannot guess `/programming\languages/years/1975/contributions`. It might make more sense here to have a route such as `programming\_languages/aggregate\_contributions?by=year`. Even though this route lacks guessability, it reads with clarity and gives the client customization options. For example, a client might want to customize on which field the contributions are aggregated.

Another criticism of RESTful conventions is that, by default, they do not allow clients to specify which fields should appear in the response. For example, if a client only needs the name field for each programming language and nothing more, it still gets the `publication_year` and contribution attributes back from the server. Depending on how many fields there are on an item and how many items appear in a response, this can mean that a RESTful route sends a really large payload, or it takes a long time to serialize information, even if the client only needs a tiny portion of the information.

That particular frustration has fueled the popularity of GraphQL, which differs from the RESTful protocol. Instead of relying on the request verb and endpoint to parse a client&#39;s needs, GraphQL prescribes an approach where the API receives all requests at the same endpoint. The request body includes a string representation of a query in the Graph Query Language, which might look something like this:

```GraphQL
{
  programmingLanguage {
    name
    publication_year
    inventors {
      name
    }
  }
}
```

Such a query would not return the contributions of the languages because the request excludes that field.

Before GraphQL rose in popularity, the conventions of Standard Object Access Protocol (SOAP) pioneered the approach of having one endpoint and specifying what the client needs in the request body.

## REST APIs make for clear, discoverable services that allow clients to access database resources.

REST APIs can fetch records from multiple tables, or even multiple databases, when clients need them. The RESTful conventions make it easier for web frameworks like FastAPI to provide automatic documentation. Additionally, client developers can often guess how to access resources by following the conventions.

But in situations where clients need even the slightest twist on direct resource access, the discoverability and utility of RESTful conventions starts to break down. In some circumstances, an approach like GraphQL or SOAP might make sense.

Irrespective of protocol, API developers should define their endpoints based on what sorts of responses clients will need the most often. Developers should design queries around what sorts of inputs clients will have for customizing that response. Clients really appreciate a well-documented API that keeps their needs in mind.
