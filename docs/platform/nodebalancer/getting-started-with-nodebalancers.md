---
author:
  name: Jed Smith
  email: docs@linode.com
description: 'Using a NodeBalancer to begin managing a simple Web application.'
keywords: 'nodebalancers,nodebalancer,load balancers,load balancer,load balancing,high availability,ha'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['nodebalancers/getting-started/']
modified: Thursday, August 8th, 2013
modified_by:
  name: Alex Fornuto
published: 'Thursday, February 12, 2015'
title: Getting Started with NodeBalancers
---

Nearly all applications that are built using Linodes can benefit from load balancing, and load balancing itself is the key to expanding an application to larger numbers of users. Linode now provides NodeBalancers, which can ease the deployment and administration of a load balancer.

NodeBalancers are built for high availability and designed to be "set and forgotten". The most difficult part of transitioning to a NodeBalancer, in fact, is simply making sure your application works well with the new environment. In this guide, we will examine a common use case: using a NodeBalancer to load balance a Web site and prepare it for scaling to thousands of users.

This guide attempts to give a high-level overview of transitioning to a NodeBalancer, but makes no attempt to document or explain the underlying parts of the application NodeBalancer will be balancing; for more information on various applications that might be useful behind NodeBalancer review the rest of the Linode Library.

## Overview

A NodeBalancer listens on a public IP address for incoming connections, then uses configurable rules to select a backend node (out of one or more) to which to send the connection. In HTTP mode, NodeBalancers can reach into the incoming Web request and make decisions based on it.

Put together, a NodeBalancer allows the incoming load to your application to be spread over any number of Linodes. This, however, comes with new challenges; many Web applications have sessions that do not exist outside of the backend node. For this reason, NodeBalancers allow you to specify that the same client should land on the same backend Linode.

For example purposes, this guide will start with a typical, simple Web application.

![The Web application when the guide starts.](/docs/assets/806-starting-point.png)

There are a few drawbacks to making this application scale, namely that any modifications require updating DNS (which takes time) or inflicting downtime upon users. NodeBalancer can step in and bring administrative ease to this application by becoming its front face.

![Diagram after putting NodeBalancer in charge of the Web application.](/docs/assets/807-first-step.png)

Now, backend Linodes can be added or removed to the work load seamlessly, without end users noticing any downtime.

![Diagram after adding a second Web server node.](/docs/assets/808-scaling.png)

Additionally, NodeBalancer will watch each backend for failure, rerouting users to working backends transparently and without any manual intervention.

## Configuring a NodeBalancer

First, the backend Linode currently powering the Web site must have a private IP address. If it does not, add one now and configure the Linode for [static networking](/docs/networking/configuring-static-ip-interfaces/) -- this will then be a good opportunity to do the same for the database server, since private network traffic is unbilled. Reboot if necessary, and configure your Web application to respond on the private IP address, if it is not already.

Visit the NodeBalancers tab in the Linode Manager.

[![The NodeBalancer tab.](/docs/assets/796-1.png)](/docs/assets/770-nodebalancer-tab.png)

For the example Web application, only one NodeBalancer is needed. Add one, and choose the same datacenter that your backend Linodes are located in. Once purchased, you will be able to see the public IP address that has been assigned to your NodeBalancer.

[![The NodeBalancer has been added.](/docs/assets/797-2.png)](/docs/assets/772-nodebalancer-added.png)

Now click on **Create Configuration**. A NodeBalancer is configured using ports, and the example Web application uses only one: port 80 for regular HTTP traffic.

[![Adding a port configuration to a NodeBalancer.](/docs/assets/798-3.png)](/docs/assets/774-add-port.png)

For the traditional Web application, these settings are a good start. HTTP cookie stickiness is preferred so that the same client will always land on the same backend -- for a simple Web application that keeps sessions in memory, this is necessary to avoid session errors on clients.

 {: .note }
>
> If you select the HTTPS protocol, two new fields will appear where you can add your SSL certificate (and chained certificates) and passphraseless private key.

Every ten seconds, NodeBalancer will request the root of the Web application and look for a valid response code. With the current setup, there is only one backend node (which we will add shortly); if the backend goes down, NodeBalancer will serve a plain 503 Service Unavailable error page. This is more desirable than refusing connections or making browsers wait for a timeout.

[![Adding a backend node to a NodeBalancer.](/docs/assets/799-4.png)](/docs/assets/776-backend.png)

Now add the single backend node to the NodeBalancer's configuration. Point this at the private IP address of your Web server Linode.

The configuration changes that you just made will take a few moments to be reflected by your NodeBalancer. Once the changes have gone through, Status will update from **Unknown** to, if everything is configured on your backend correctly, **UP**.

[![The backend node has been added, and is now status UP.](/docs/assets/800-5.png)](/docs/assets/778-backend-up.png)

If the backend remains **DOWN**, check to make sure that your Web application is configured to respond on the Linode's private IP address. There might be a virtual host mismatch as well -- check the notes in the next section.

Now that the backend is up, go directly to your NodeBalancer's IP address in a browser; you should see your Web application as the NodeBalancer proxies the traffic through.

[![Viewing the NodeBalancer-driven Web site in a browser.](/docs/assets/801-6.png)](/docs/assets/780-success.png)

That is enough to configure the NodeBalancer. For HTTPS/SSL configurations, use the HTTPS protocol and provide a key and certificate.

## A Note about Virtual Hosts

You might not see the web application that you expect when you go directly to the NodeBalancer's IP address. This is due to virtual hosts, and is not an issue unique to NodeBalancers. In the default configurations of many Web servers, an application might only be configured to respond for certain hostnames. This can impact testing NodeBalancers as well as the behavior of their health checks.

It is important to configure the "default" virtual host in your Web server to point at something useful. NodeBalancer will pass the Host header from a browser untouched, so virtual hosts will work entirely normally once you are pointing a domain at the NodeBalancer. It is only mentioned here because testing NodeBalancers can demonstrate quirks in the Web server's configuration, particularly when browsing by the NodeBalancer's IP address.

 {: .note }
>
> Health checks are transmitted with a Host header (in HTTP/1.0 mode).

## Putting the NodeBalancer in Charge

Your NodeBalancer is now working and is able to pass traffic to your Web application. It is important to note at this point that configuring the NodeBalancer has not impacted your application's normal operations at all -- you can test NodeBalancer without your users ever knowing. The only exception to this would be to add a private IP address, if it was necessary to do so.

Once you are satisfied that NodeBalancer is working normally, you can switch your Web application's traffic over to it through DNS. On the NodeBalancer's overview, you can see its IP address as well as a hostname that resolves to that IP address. Take note of the IP address, to use in the A record for your domain.

Edit or create an A record for `www.example.org`, pointing to your NodeBalancer's IP address.

[![Adding an A Record.](/docs/assets/nodebalancer-a-record_small.png)](/docs/assets/nodebalancer-a-record.png)

Also add an AAAA record for the IPv6 address.

[![Adding an AAAA record for the NodeBalancer.](/docs/assets/804-9.png)](/docs/assets/786-dns-aaaa.png)

Once the DNS changes propagate, traffic will begin flowing through the NodeBalancer. At this point, you will want to wait at least 24 hours for all caches to catch up to the NodeBalancer before proceeding.

Congratulations! You have now configured a NodeBalancer and transitioned traffic over to it. All of the benefits of NodeBalancer are now available to you, such as adding backends to accommodate load.

On another Linode, make an exact copy of your current Web server. The Linode backups service can be instrumental for doing so, as a snapshot can be restored to any other Linode. Once you have another backend ready, simply [repeat the earlier process](#configuring-a-nodebalancer) to add it to the NodeBalancer configuration.

[![Adding another backend to the NodeBalancer's configuration.](/docs/assets/805-10.png)](/docs/assets/788-another-backend.png)

Once the configuration is sent to the backend, users will be transparently balanced over the two Linodes and each will be monitored for health. This configuration is very easy to work with, as upgrades can be rolled out to each backend without disrupting service and backends can be taken in and out of rotation at will.

This is just the beginning; NodeBalancers are extremely flexible and cater to a lot of needs. From here, the API can be used to add many backends. Multiple ports on one backend can be balanced for speciality setups. Additionally, new tools like memcached can be introduced to the application to allow session stickiness to become irrelevant.



