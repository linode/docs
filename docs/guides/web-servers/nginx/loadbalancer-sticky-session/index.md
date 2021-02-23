---
slug: loadbalancer-sticky-session
author:
  name: Martin Heller
  email: martin.heller@gmail.com
description: ‘Web farms need a load balancer so that all the load doesn't go to one server. And load balancers need server affinity for the duration of a session, a.k.a. sticky sessions, when the web application needs to maintain state from one request to the next.’
og_description: ‘Web farms need a load balancer so that all the load doesn't go to one server. And load balancers need server affinity for the duration of a session, a.k.a. sticky sessions, when the web application needs to maintain state from one request to the next.’
keywords: [‘loadbalancer sticky session']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-23
modified_by:
  name: Linode
title: "The Pros and Cons of Configuring a Load Balancer for Sticky Sessions”
h1_title: "The Pros and Cons of Configuring a Load Balancer for Sticky Sessions "
contributor:
  name: Martin Heller
  link: http://www.twitter.com/meheller
external_resources:
- '[NodeBalancer reference guide\](https://www.linode.com/docs/guides/nodebalancer-reference-guide/)'
- '[NodeBalancer section\](<https://www.linode.com/docs/guides/platform/nodebalancer/>)'
---

# The Pros and Cons of Configuring a Load Balancer for Sticky Sessions

You need a load balancer to distribute requests among your servers, once you scale out from one web server or application server to two or more. Then you need to deal with the issue of maintaining continuity from one HTTP request to the next if your site needs to maintain session state.

What happens if a stateful web farm doesn't have sticky sessions? For one thing, users might never get past the login screen. Or if they do get into the application, they still might randomly find themselves facing surprising error messages or winding up back at the login screen; the underlying reason would be that they suddenly wound up reaching a different instance of the web server.

## Websites, sessions, and session state

A static HTML website without logins is stateless. That means that users would never notice if they were randomly directed to a different server instance when following links. The same logic applies to public websites built on applications such as WordPress, as long as they don’t require users to log in. Once a site needs to maintain continuity from request to request, it is stateful.

Most websites maintain continuity of state using a session. A session object can be stored in server RAM or a file on the server, passed back to the client in an HTTP cookie, stored in a database, or stored on the client. If you store the session object in the RAM or file system of a single server, then the only way for the client to continue a session in the next request would be for the browser to return to the same server instance.

That’s trivial when there’s only one server instance. If multiple web servers are behind a load balancer, i.e. a web farm, it may not be trivial to lock the client to a single server.

## NodeBalancers and other load balancing tools

[NodeBalancers](https://www.linode.com/docs/guides/platform/nodebalancer/) are Linode’s load balancers as a service. Linode also supports using open source tools for load balancing, such as [NGINX]( https://www.linode.com/docs/guides/web-servers/nginx/). (NGINX can also be configured as a web server.)

You can [configure NodeBalancers](https://www.linode.com/docs/guides/nodebalancer-reference-guide/) for three kinds of *session stickiness* (or persistence): none, table (the `NodeBalancer` itself remembers which backend a given client IP was initially load balanced to), and `HTTP cookie` (the `NodeBalancer` sets a cookie named `NB\_SRVID` identifying the backend a client was initially load balanced to). If this is the first request in a session or the `NodeBalancer` is set to no stickiness, then the `NodeBalancer` uses one of three *algorithms* to assign the backend node: `round robin`, `least connections`, or `source IP`.

If the algorithm is `source IP`, the session is sticky as long as the set of backend nodes doesn’t change. If the stickiness is set to `table` or `cookie`, the session will be sticky. If the client doesn’t respect cookies, then HTTP cookie stickiness won’t work.

## Sticky sessions pros and cons

Using sticky sessions can reduce the throughput and increase the latency of a load balancer. On the other hand, disabling sticky sessions and instead using an external database for server session storage can reduce the throughput and increase a web server’s latency.

You can avoid both options if your site is stateless, or if you pass the whole state as cookies, or if you store session objects on the client. If the state object is large, however, passing it back and forth with each HTTP request and response can reduce the throughput and increase the latency of the browser-load balancer-web server connection.

Usually, the best choice for stateful sites *is* to use sticky sessions on the load balancer, since the load balancer isn’t doing as much work as the web servers. If you’re a belt-and-suspenders kind of administrator, configure the NodeBalancer algorithm to source IP *and* set the stickiness to table. You *can* alternatively set the stickiness to `HTTP cookie`, but that requires the client to respect cookies, which is something you can’t guarantee.
