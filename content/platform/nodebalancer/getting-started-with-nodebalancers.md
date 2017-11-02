---
author:
  name: Linode
  email: docs@linode.com
description: 'Using a NodeBalancer to begin managing a simple web application.'
keywords: ["nodebalancers", "nodebalancer", "load balancers", "load balancer", "load balancing", "high availability", "ha"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['nodebalancers/getting-started/','linode-platform/nodebalancer-howto/']
modified: 2015-12-18
modified_by:
  name: Linode
published: 2015-02-12
title: Getting Started with NodeBalancers
---

Nearly all applications that are built using Linodes can benefit from load balancing, and load balancing itself is the key to expanding an application to larger numbers of users. Linode now provides NodeBalancers, which can ease the deployment and administration of a load balancer.

NodeBalancers are built for high availability and designed to be "set and forgotten". The most difficult part of transitioning to a NodeBalancer is simply making sure your application works well in the new environment. In this guide, we will examine a common use case: using a NodeBalancer to load balance a website and prepare it for scaling to thousands of users.

This guide provides a high-level overview of transitioning to a NodeBalancer, but it's outside this page's scope to explain each application a NodeBalancer could balance. For more information on various applications that might be useful behind NodeBalancer, see the rest of Linode Guides & Tutorials.

## Overview

A NodeBalancer listens on a public IP address for incoming connections, then uses configurable rules to select a backend node (out of one or more) to which to send the connection. In HTTP mode, NodeBalancers can reach into the incoming web request and make decisions based on it.

A NodeBalancer allows the incoming load to your application to be spread over any number of Linodes. This, however, comes with new challenges: many web applications have sessions that do not exist outside of the backend node. For this reason, NodeBalancers allow you to specify that the same client should land on the same backend Linode.

As an example, this guide will start with a typical, simple web application.

![The web application when the guide starts.](/docs/assets/806-starting-point.png)

There are a few drawbacks to making this application scale, namely that any modifications require updating DNS (which takes time) or inflicting users with downtime. NodeBalancers can bring administrative ease to this application by becoming its front face.

![Diagram after putting NodeBalancer in charge of the web application.](/docs/assets/807-first-step.png)

Now, backend Linodes can be added or removed to the work load seamlessly, without end users noticing any downtime.

![Diagram after adding a second web server node.](/docs/assets/808-scaling.png)

Additionally, NodeBalancer will watch each backend for failure, rerouting users to working backends transparently and without any manual intervention.

## Configuring a NodeBalancer

Sticking with the simple web application example above, the backend Linode currently powering it must have a private IP address. If it does not, add one now and configure the Linode for [static networking](/docs/networking/configuring-static-ip-interfaces/) -- this will also be a good opportunity to do the same for the database server, since private network traffic is unbilled. Reboot if necessary, and configure your web application to respond on the private IP address, if it is not already.

1.  Visit the NodeBalancers tab in the Linode Manager.

	[![The NodeBalancer tab.](/docs/assets/796-1.png)](/docs/assets/770-nodebalancer-tab.png)

2.  For the example web application, only one NodeBalancer is needed. Add one in the same datacenter that your backend Linodes are located in. Once purchased, you will be able to see the public IP address that has been assigned to your NodeBalancer.

	[![The NodeBalancer has been added.](/docs/assets/797-2.png)](/docs/assets/772-nodebalancer-added.png)

3.  Now choose **Create Configuration**. A NodeBalancer is configured using ports, and let's say our example web application uses only one: port 80 for regular HTTP traffic.

	[![Adding a port configuration to a NodeBalancer.](/docs/assets/798-3.png)](/docs/assets/774-add-port.png)

	**HTTP**

	For the traditional web application, the settings in the screenshot above are a good start. HTTP cookie stickiness is preferred so that the same client will always land on the same backend -- for a simple web application that keeps sessions in memory, this is necessary to avoid session errors on clients.

	**HTTPS**

	If you select the HTTPS protocol, two new fields will appear where you can add your SSL certificate, chained certificates (if applicable) and a private key (which must not have passphrase protection).

	Once you have configured your certificates, you must then choose a general security and compatibility level for your NodeBalancer's TLS cipher suite pools. If you must support users accessing your application with older browsers such as Internet Explorer 6-8, you can select the **Legacy** option. However, bear in mind that by gaining backwards compatibility, your NodeBalancer will use weaker SSL/TLS cipher suites.

	For all other implementations, the default **Recommended** cipher suite option should be used. You can see the cipher suites available with each option in our [NodeBalancer Reference Guide](/docs/platform/nodebalancer/nodebalancer-reference-guide#tls-cipher-suites).

	[![SSL Cipher Suite](/docs/assets/ssl-cipher-suite-resized.png)](/docs/assets/ssl-cipher-suite.png)

Every ten seconds, NodeBalancer will request the root of the web application and look for a valid response code. With our example setup, there is only one backend node (which we will add shortly); if the backend goes down, NodeBalancer will serve a plain 503 Service Unavailable error page. This is more desirable than refusing connections or making browsers wait for a timeout.

## Adding a Backend

1.  Now we must add the single backend node to the NodeBalancer's configuration. Point this at the private IP address of your web server Linode.

	[![Adding a backend node to a NodeBalancer.](/docs/assets/799-4.png)](/docs/assets/776-backend.png)

	These configuration changes will take a few moments to be reflected by your NodeBalancer. If everything is configured on your backend correctly, once the changes have gone through, the **Status** column will update from **Unknown** to **UP**.

	[![The backend node has been added, and is now status UP.](/docs/assets/800-5.png)](/docs/assets/778-backend-up.png)

	If the backend status reports **DOWN**, check to make sure that your web application is configured to respond on the Linode's private IP address. There might be a virtual host mismatch as well -- check the notes in the next section.

2.  Now that the backend is up, go directly to your NodeBalancer's IP address in a browser. You should see your web application as the NodeBalancer proxies the traffic through.

	[![Viewing the NodeBalancer-driven web site in a browser.](/docs/assets/801-6.png)](/docs/assets/780-success.png)

### A Note about Virtual Hosts

You might not see the web application that you expect when you go directly to the NodeBalancer's IP address. This is due to virtual hosts, and is not an issue unique to NodeBalancers. In the default configurations of many web servers, an application might only be configured to respond for certain hostnames. This can impact testing NodeBalancers as well as the behavior of their health checks.

It is important to configure the "default" virtual host in your web server to point at something useful. NodeBalancer will pass the Host header from a browser untouched, so virtual hosts will work entirely normally once you are pointing a domain at the NodeBalancer. It is only mentioned here because testing NodeBalancers can demonstrate quirks in a web server's configuration, particularly when browsing by the NodeBalancer's IP address.

 {{< note >}}
Health checks are transmitted with a Host header (in HTTP/1.0 mode).
{{< /note >}}

## Putting the NodeBalancer in Charge

Your NodeBalancer is now working and is able to pass traffic to your web application. It is important to note at this point that configuring the NodeBalancer has not impacted your application's normal operations at all -- you can test NodeBalancer without your users ever knowing. The only exception to this would be when adding a private IP address, if necessary.

Once you are satisfied that NodeBalancer is working normally, you can switch your web application's traffic over to it through DNS.

1.  On the NodeBalancer's overview, you can see its IP address as well as a hostname that resolves to that IP address. Take note of the IP address, to use in the A record for your domain.

2.  Edit or create an A record for `www.example.org`, pointing to your NodeBalancer's IP address.

	[![Adding an A Record.](/docs/assets/nodebalancer-a-record_small.png)](/docs/assets/nodebalancer-a-record.png)

	Also add an AAAA record for the IPv6 address.

	[![Adding an AAAA record for the NodeBalancer.](/docs/assets/804-9.png)](/docs/assets/786-dns-aaaa.png)

Once the DNS changes propagate, traffic will begin flowing through the NodeBalancer. At this point, you will want to wait at least 24 hours for all caches to catch up to the NodeBalancer before proceeding.

# Additional NodeBalancers and Features

On another Linode, make an exact copy of your current web server. The Linode backups service can be instrumental for doing so, as a snapshot can be restored to any other Linode. Once you have another backend ready, simply repeat the steps for [Adding a Backend](/docs/platform/nodebalancer/getting-started-with-nodebalancers#adding-a-backend) to add it to the NodeBalancer configuration.

[![Adding another backend to the NodeBalancer's configuration.](/docs/assets/805-10.png)](/docs/assets/788-another-backend.png)

Once the configuration is sent to the backend, users will be transparently balanced over the two Linodes and each will be monitored for health. This configuration is very easy to work with, as upgrades can be rolled out to each backend without disrupting service and backends can be taken in and out of rotation at will.

This is just the beginning; NodeBalancers are extremely flexible and cater to a lot of needs. From here, the API can be used to add many backends. Multiple ports on one backend can be balanced for speciality setups. Additionally, new tools like *memcached* can be introduced to the application to allow session stickiness to become irrelevant.