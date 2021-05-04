---
slug: configuring-load-balancer-sticky-session
author:
  name: Martin Heller
  email: martin.heller@gmail.com
description: 'Web farms require configuring load balancer sticky session so that all the load does not go to one server. And load balancers need server affinity for the duration of a session, a.k.a. sticky sessions when the web application needs to maintain state from one request to another.'
og_description: 'Web farms require configuring load balancer sticky session so that all the load does not go to one server. And load balancers need server affinity for the duration of a session, a.k.a. sticky sessions when the web application needs to maintain state from one request to another.'
keywords: [‘loadbalancer sticky session']
tags: ['database','wordpress']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-23
modified_by:
  name: Linode
title: "Configuring Load Balancer Sticky Session"
h1_title: "The Pros and Cons of Configuring a Load Balancer for Sticky Sessions"
contributor:
  name: Martin Heller
  link: http://www.twitter.com/meheller

---

## What is Load Balancing and Why is it Necessary?

*Load balancing* is an efficient method of distributing incoming network traffic across multiple servers in a *web farm*. Each Load Balancer lies between client devices and servers, which receives and distributes incoming requests to the available and capable server.

The load balancing is necessary because it provides the following benefits:

- **Efficiency:** Load balancers distribute the client requests across multiple servers preventing server overload.
- **Scalability:** New servers can be added to the *web farm* when there is an increase in the network traffic.
- **Flexibility:** Servers can be added or removed from the web farm on-demand basis.
- **Highly Responsive:** Ensures that the user's requests are spread evenly across multiple servers.

### Load Balancing Methods

You can perform load balancing in two ways—*stateless* and *stateful*.

If the load balancer does not keep track of any session information, it is *stateless load balancing*. You can consider the example of a static HTML website without a login page, where the users would never notice if they were randomly redirected to a different server instance when following links.

Consider a public website that is built on an application such as WordPress where users need not log in. Here, the load balancer keeps track of all the user's state information from one request to another, and this is called *stateful load balancing*.

## What are Sticky Sessions?

Most websites maintain continuity of state using a session. When a client makes the first request to the server, a session object is created in the server memory for that user. All the subsequent requests use the same session object.

But in the Load Balancer, more than one server is serving the request. So what happens if the Load Balancer routes the second request to another server that does not have that session object in memory?
Some of the user information can be lost and this scenario can cause data loss.

In that case, we need to inform the Load Balancer to send all the requests from a particular user session to process in one server.
This technique is called *Sticky Sessions* a.k.a., session persistence.

## NodeBalancers: Load Balancers as a Service (LBaaS)

Linode offers Load Balancers as a Service (LBaaS) called [*NodeBalancers*](https://www.linode.com/docs/guides/platform/nodebalancer/). Linode also supports using open source tools for load balancing, such as [*NGINX*]( https://www.linode.com/docs/guides/web-servers/nginx/), which can also be configured as a web server.

**Configure NodeBalancers:**

You can configure NodeBalancers for the following three kinds of session stickiness (or persistence):

- **None**
- **Table:** The NodeBalancer itself remembers which backend a given client IP was initially load balanced to.
- **HTTP Cookie:** The NodeBalancer sets a cookie named `NB\_SRVID` identifying the backend a client was initially load balanced to.

If the NodeBalance is set to **Table** or **HTTP Cookie**, then the session is sticky. If the client does not accept cookies, then **HTTP Cookie** stickiness do not work.

### LodeBalancing Algorithms

If the NodeBalancer is set to **None**, or if a session object has a first request, then the NodeBalancer uses one of the following three algorithms to assign the backend node:

- Round Robin
- Least Connections
- Source IP

If the algorithm is **Source IP**, the session is sticky as long as the set of backend nodes doesn't change.

Read more about *Session Stickiness* and *LoadBalancing Algorithm* from our [NodeBalancer Reference Guide](https://www.linode.com/docs/guides/nodebalancer-reference-guide#algorithm).

## Pros and Cons of Sticky Sessions

**Pros:**

1. Using sticky sessions can reduce the *throughput* and increase the *latency* of a load balancer.

   On the other hand, disabling sticky sessions and instead of using an external database for server session storage can reduce the throughput and increase a web server's latency.

1. For a stateful site, it is best to use sticky sessions on the load balancer, since the load balancer does not perform much work as the web servers.

1. Implementing sticky sessions is easy without any changes to your application.

**Cons:**

1. Limits your application scalability as the Load Balancer cannot distribute the load evenly each time it receives the request from the client.

1. If the server goes down, then the session is lost. If the session has important user information, it can be lost.
