---
slug: configuring-load-balancer-sticky-session
description: "A sticky session creates a session object and storing it on the client or server.  We'll explain how that works, and the pros and cons of this approach."
og_description: "When a web application needs to maintain state from one request to another, you should consider configuring your load balancer to use sticky sessions. A sticky session enables your load balancer to persist data by creating a session object and storing it on the client or server. This overview provides a definition for sticky sessions along with the pros and cons of using this common load balancer configuration."
keywords: [‘loadbalancer sticky session']
tags: ['nginx','networking']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-23
modified_by:
  name: Linode
title: "Pros and Cons of Configuring a Load Balancer for Sticky Sessions"
title_meta: "Pros and Cons of Using Sticky Sessions on a Load Balancer"
authors: ["Martin Heller"]
---

## What is Load Balancing and Why is it Necessary?

*Load balancing* is an efficient method of distributing incoming network traffic across multiple servers. Each load balancer lies between client devices and servers. The load balancer receives and distributes incoming requests to the available and healthy server.

Load balancers provide the following benefits:

- **Efficiency:** Load balancers distribute client requests across multiple servers preventing server overload.
- **Scalability:** You can add new servers to handle an increase in network traffic to your application.
- **Flexibility:** Servers can be added or removed based on your application's needs.
- **Highly Available:** Ensures that the user's requests are spread evenly across multiple servers.

### Load Balancing Methods: Stateless and Stateful

You can perform load balancing in two ways—*stateless* and *stateful*. If the load balancer does not keep track of any session information, it is *stateless load balancing*. Consider the example of a static HTML website without a login page. A user would never notice if they were randomly redirected to a different server instance when navigating across the site. The same can be said for a site built on WordPress, as long as the site does not require a user to log in. However, if a site or application needs to maintain continuity for a user from request to request, this requires *stateful load balancing*.

## What are Sticky Sessions?

Most websites maintain continuity of state using a session. When a client makes the first request to the server, a session object is created. This object may be stored in server RAM, a file on the server, passed back to the client in an HTTP cookie, stored in a database, or stored in the client. All subsequent requests use the same session object. When you store the session object in a single server's RAM or file system, then the only way for the client to continue a session in the next request is for the browser to return to the same server instance.

When using a load balancer, more than one server is responding to requests. So, what happens if the load balancer routes the second request to another server that does not have that session object in memory? Some of the user information might not persist, and can cause data loss. In this scenario, the load balancer should send all requests from a particular user session to be processed on the same server. Doing so is referred to as *session stickiness*, or session persistence.

## Pros and Cons of Sticky Sessions

**Pros:**

1. More efficient use of data and memory. Since you are persisting data to one server, you are not required to share the persisted data across your application's servers. Similarly, data stored in a RAM cache can be looked up once and reused.

1. Implementing sticky sessions on a load balancer does not require any changes to your application. Your sticky session configurations are limited to the tool that you choose to use to balance your site's web traffic.

**Cons:**

1. Limits your application scalability as the load balancer cannot distribute the load evenly each time it receives a request from a client.

1. If the server goes down, then the session is lost. If the session has important user information, it can be lost.

## Tools Used for Load Balancing

The popular open-source web server, [*NGINX*](/docs/guides/web-servers/nginx/), can be used as a load balancer to support your web services. NGINX provides [extensive documentation](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/) to get you started installing and configuring it to load balance traffic to backend servers.

Linode offers a load balancing service called [*NodeBalancers*](/docs/products/networking/nodebalancers/). Using load balancers as a service (LBaaS) to route your server's web traffic reduces the amount of configuration you need to worry about. This allows you to focus on developing your application, and take advantage of built-in point-and-click functionality.

If you are using [Kubernetes](/docs/guides/beginners-guide-to-kubernetes/) to run your containerized applications, load balancers help you expose your cluster's resources to the public internet and route traffic to your cluster's nodes. If you are using Linode's managed Kubernetes service, [LKE](https://www.linode.com/products/kubernetes/), you can configure NodeBalancers using [annotations](/docs/products/compute/kubernetes/guides/load-balancing/#configuring-your-linode-nodebalancers-with-annotations). You can also use [NGINX to configure load balancing via ingress on Kubernetes](https://www.nginx.com/blog/nginx-plus-ingress-controller-kubernetes-load-balancing/).
