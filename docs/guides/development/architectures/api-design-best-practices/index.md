---
slug: api-design-best-practices
description: "Searching for API design best practices to elevate your development process? We identify some of the best practices you need to follow right now. ✓ Learn more!"
keywords: ['api design best practices','api architecture','rest api design']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-11
modified_by:
  name: Nathaniel Stickman
title: "API Design Best Practices: Elevate Your Development Process"
title_meta: "REST API Best Practices for Design"
external_resources:
- '[Microsoft Docs: RESTful Web API Design](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design)'
- '[freeCodeCamp: REST API Best Practices – REST Endpoint Design Examples](https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/ )'
- '[Swagger: Best Practices in API Design](https://swagger.io/resources/articles/best-practices-in-api-design/ )'
- '[Stack Overflow Blog: Best Practices for REST API Design](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)'
authors: ["Nathaniel Stickman"]
---

Looking for flexibility, many modern web applications are turning to microservices and effective APIs to connect those services consistently and effectively. REST APIs in particular stand out as perhaps the most pervasive architecture for connecting microservices today.

To learn why that is and what the REST architecture has to offer, keep reading this tutorial. Learn what goes into a REST API and the best practices to make them work effectively for you.

## What Is REST API?

Generally, an API (Application Programming Interface) defines a set of rules for connections between applications or services.

REST is a particular API architecture, short for Representational State Transfer. REST APIs (also called RESTful APIs) provide flexibility through resource-oriented design and stateless communications.

REST architectures generally adhere to the following principles:

-   Center on *resources*. A resource can be an object, data, or a service. An example of a resource that a moving company might use is a `box` object. The API provides clients with access to resources.

-   Designate *identifiers* for resources. An identifier allows a client to retrieve a particular resource from the API using a specific URI. For instance, a `box` resource with the ID `9` might be retrieved with `/boxes/9`.

-   Establish *collections*. A collection is a group of resources that may be accessible through a more general URI. Continuing the example above, a collection of all `box` resources might be found with `/boxes`.

-   Exchange in *representations* of resources. Most often, a representation uses a format like JSON or XML to hold a resource. Using such an agreed upon representational format facilitates consistent processing of resources, both by clients and by the API.

-   Employ a *stateless* communication model. The API does not store transient state data, meaning that clients can work independently with consistency.

-   Follow a uniform interface. In most cases, as you can see throughout this guide, REST APIs use the HTTP interface. Several reasons support doing so, but the main are that HTTP uses open standards and does not lock you into a particular implementation.

    Essentially, anything that can make and/or interpret HTTP requests and response can participate with a REST API using HTTP. Thus, HTTP makes RESTful APIs easier to test, extend, and scale.

## What Are REST API Best Practices?

RESTful best practices center on two key concepts:

-   **Maintainability**. The design should capitalize on REST's inherent flexibility, ensuing that clients and services remain independent, extendable, and adaptable.

-   **Readability**. The services should be clear so that clients can make effective use of them and developers can effectively maintain and scale them.

What follows is a list of best practices adhering to the above concepts. Applying these REST API best design standards makes your API more effective and your development more consistent.

### Center on Resources

Organize your RESTful API's endpoints around resources and collections of resources. The previous section gave an example of this practice. Using a URI like `/boxes` centers the API on resources.

For this reason, URIs should generally consist of nouns identifying resources and collections.

This approach also favors a relational URI design. Start with a collection (e.g. `boxes`) and use an identifier to specify a particular resource. You can then access a particular collection related to that resource.

For example, you can fetch a `box` resource with ID `9` using something like `/boxes/9`. The API can also make it possible to then fetch a collection of `content` resources associated with that particular `box`. This might be done using a URI like `/boxes/9/contents`. You could go further to fetch a particular `content` resource from that collection using its ID, `5`: `/boxes/9/contents/5`.

### Operate via HTTP Methods

Use the HTTP methods for actions taken on resources and collections. Doing so keeps your API focused on resources while utilizing a standard approach to define operations related to those resources.

To illustrate what this might look like, take a look at the following table:

| URI            | GET          | POST         | PUT          | DELETE       |
| :------------: | :----------: | :----------: | :----------: | :----------: |
| /boxes         | Fetch all boxes | Create a new box | Update all boxes | Delete all boxes |
| /boxes/9       | Fetch box ID 9 | N/A | Update box ID 9 | Delete box ID 9 |
| /boxes/9/contents | Fetch the contents of box ID 9 | Create a new content resource for box ID 9 | Update all contents for box ID 9 | Delete all contents from box ID 9 |

This way, your API is able to handle all actions related to fetching, creating, and modifying resources without any additional endpoints. Using HTTP standards for actions makes it easier for developers to anticipate how to take particular actions on resources, without having to research specific documentation.

For this reason, it's a good idea to avoid using verbs in URIs wherever feasible. This keeps your API consistent and predictable. If you need to use verbs for a URI, use them like a resource name. For example, to process a `box` resource with ID `9` for shipping, you might use `/boxes/9/send`.

### Limit Results

Make resource fetching more efficient by implementing pagination, filtering, sorting, and searching options for your REST API. Doing so lets clients fetch only the resources they need, which, in turn, improves network traffic.

For instance, say a client intends to display a list of boxes. Good UI design typically has long lists divided into pages, so this client is taking that approach. Retrieving all of the boxes at once unnecessarily extends the load time, potentially degrading user experience.

So, the API provides options that enable pagination. The client can thus use query string parameters to get one page of boxes at a time. This example assumes a page would have ten boxes listed and that the client is loading the second page: `/boxes?limit=10&page=2`.

The same logic applies for filtering and searching. REST APIs should implement query strings on collection endpoints. This allows clients to limit responses to only what is needed. In this next example, the client would be able to fetch only the most recent boxes that are also in `pending` status: `/boxes?mostRecent=true&status=pending`.

### Name Consistently

Use consistent naming conventions for URIs. This means using the same conventions for all resources and collections. You may use a separate convention for parameters, like those used in query strings, but you need to adhere to it consistently as well.

What follows are some particular recommendations based on general naming standards. These are not absolute rules. However, following these conventions can make your APIs easier for developers to adapt to, since they are common in the web development field.

-   Use single words for resource and collection names. Ensure that collection names are plurals of the resources they group, as in `boxes` for a collection of `box` resources.

-   Should you need more than one word for a resource/collection name, use "kebab case". Thus, a collection of herbal teas would be `herbal-teas`.

-   Should you need more than one word for parameters, use "camel case". For example, use `minValue` for a parameter giving a minimum value. This practice applies to both query string parameters and parameters housed in resource objects. The practice matches conventions for JSON design, the most frequently used representational format for REST APIs.

### Employ Versioning

Version your RESTful API when significant changes take effect that may impact clients. Requirements change, and one of the perks of REST APIs is adaptability. However, you don't want to negatively impact clients that already have expectations from the API.

Versioning allows clients to continue accessing API endpoints as they were at a given point in time. At the same time, it allows you to continue moving the API forward for new clients and requirements.

Three main approaches exist for versioning your REST APIs.

- **URI Versioning**: This adds a version indicator to the URIs for your REST APIs. Commonly, APIs employ a simple version indicator at the beginning of the URI path. For instance, a client looking to fetch `box` ID `9` using the first version of the API might use `/v1/boxes/9`.

- **Query-String Versioning**: This gives clients the option of indicating the desired version in a query string when making requests. One benefit of this approach is that the query string can be optional, with a default API version used when the query string is omitted. Here is an example of what a client might call to fetch `box` ID `9` from version `2` of the API: `/boxes/9?apiVersion=2`.

- **Header Versioning**: This option works similarly to query-string versioning, but hides the process in the headers. Like query-string versioning, it has the advantage of being able to provide a default version. To give an example, here is a request to fetch `box` ID `9` from version `3` of the API:

    ```command
    GET /boxes/9
    Custom-Header: api-version=3
    ```

Keep in mind that both header versioning and query-string versioning require the API to implement additional logic for processing versions.

### Maintain Documentation

Document your REST API. With proper documentation, you help developers quickly, efficiently, and accurately make use of endpoints. Ultimately, it saves significant time keeping developers on the same page and preventing duplicate work.

Effective API documentation should include:

-   A list of endpoints.

-   A description for each endpoint.

-   An example request and response for each end point.

Preferably, readers should also be able to test the requests right there in the documentation. Many good examples of REST API documentation allow readers to modify a base request object and immediately test the result in a web browser.

Numerous tools exist to help with documenting REST APIs. Often, these can automatically generate a list of endpoints and basic request and response skeletons, easing the documentation effort significantly. They may also have built-in tools for letting users test API responses. Of these tools, [Swagger](https://swagger.io/) is perhaps the most popular and has seen the most widespread usage in recent years.

### Implement Security

Secure your RESTful API using SSL and authentication tokens. Using SSL protects API connections from attacks, while authentication allows you to ensure that only authorized users have access.

To learn more about SSL certification, check out our guides [Understanding TLS Certificates and Connections](/docs/guides/what-is-a-tls-certificate/) and [Securing Web Traffic Using Certbot](/docs/guides/enabling-https-using-certbot/).

Recall that REST APIs are stateless. Thus, the preferred path for authentication on REST APIs is through the use of authentication tokens. In this scenario, a client may post credentials to a given endpoint. The API validates the credentials and assigns the user a random token in response. The client must then include that token in its requests to other endpoints.

You can find information on the implementation of JSON Web Tokens, for example, in our guide [User Authentication with JSON Web Tokens (JWTs) and Express](/docs/guides/how-to-authenticate-using-jwt/).

### Respond with Statuses

Provide clear status and error codes using HTTP conventions. These provide a resource for clients to quickly and consistently interpret responses. Using the accepted HTTP conventions here carries the same benefits as using HTTP generally. Almost any client capable of sending and receiving HTTP requests and responses has the tools to interpret these codes.

Doing so also means gracefully handling errors. When encountering an error processing a request, REST APIs should provide a response with an appropriate error code.

To get you started, here's a broad overview of the HTTP status codes:

| Code Range  | Description |
| :---------: | :---------: |
| 100–199     | Informational responses |
| 200–299     | Success responses |
| 300–399     | Responses for redirects |
| 400–499     | Client-side error responses |
| 500–599     | Server-side error responses |

Most REST APIs only use codes in the 200, 400, and 500 areas. Of these, here are some of the most common and useful:

-   `200` indicates a successful request that does not result in a resource being created. So you can typically see this code in response to things like `GET` and `PUT` requests.

-   `201` indicates a successful request in which a resource has been created. This is typically the response code for `POST` requests, although some `POST` requests do not result in the creation of a resource.

-   `400` indicates an error in the request, typically with the request body. This code can be used to indicate when the API was unable to parse the request body.

-   `401` indicates that the request did not provide appropriate authentication. This can be the case when the client omits authentication or uses an outdated authentication token.

-   `403` indicates that an otherwise authenticated client did not have access to the requested API or resource.

-   `404` indicates that the requested URI does not correspond to an API endpoint.

-   `500` indicates an internal server error. Typically, this response is provided when the server encounters an unknown error.

You can find a more complete list of HTTP status codes, along with descriptions of each, in Mozilla's [HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) documentation.

### Include Related URIs

Consider using *HATEOAS* or "Hypermedia as the Engine of Application State". This dictates that RESTful API usage should be based on response metadata rather than outside knowledge. This works by each request providing URIs for related request endpoints.

For example, the `GET` response for the `box` resource with ID `9` could include URIs indicating how a client could operate on the resource:

```file {lang="json"}
{
    "id": 9,
    "numberOfContainedItems": 6,
    "status": "pending",
    "links": [
        {
            "method": "PUT",
            "action": "ship",
            "uri": "/boxes/9/send"
        },
        {
            "method": "PUT",
            "action": "receive",
            "uri": "/boxes/9/receive"
        }
    ]
}
```

Following HATEOAS can make your services more adaptable to future changes. For one, it conveniently informs clients of available related endpoints. More importantly, URIs supplied in response add flexibility. Should a URI have to change, like from `/send`  to `/ship` in the example above, the client does not have to modify its approach. It simply fetches the necessary URI from the response.

## Conclusion

REST APIs bring flexibility and consistency to your microservices, provided you implement them with best practices in mind. This tutorial walked you through standards you can apply when designing and implementing your own REST APIs. These principles can help you create and maintain efficient and manageable RESTful APIs.