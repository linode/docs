---
slug: introduction-to-function-as-a-service-faas
description: "FaaS gets a lot of attention as a way to save money. But what is it, exactly? And how does it work? Read this guide to learn more."
keywords: ['function as a service']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-11
image: IntroFunctionAsAService.png
modified_by:
  name: Linode
title: "An Introduction to FaaS (Function as a Service)"
authors: ["Tom Henderson"]
---

Developers are used to breaking business logic into standalone functions that an application can call when necessary. Functions as a Service (FaaS) takes advantage of cloud architectures, spinning up functions (and their system resources) only when needed. Using FaaS has several advantages, not the least of which is affordability, but it can also create more complexity.

Cloud computing's strength comes from an architecture based on composable resources. The cloud infrastructure is built from a programmatic orchestration of many sources and destinations, connected through IP addresses and [DNS](/docs/guides/networking/dns/). The architecture's puzzle pieces, sometimes called a *composable disaggregated infrastructure*, include events as well as the network, storage, compute, and communications and authentication fabrics.

Composable architectures use resources sparingly, by design. FaaS gets attention as a cost saver, but it's the overall model that is appealing. FaaS is highlighted by scalability, affordability, and its ability to be maintained as a sum of integrated parts, as contrasted to the top-down maintenance of monolithic architectures.

FaaS are functional ad-hoc processing elements as a composable component building block, and are part of a model called [serverless computing](/docs/guides/what-is-serverless-computing/). Rather than bearing the costs of having instances ready to handle processing 24/7, FaaS are built once, then used only when needed, as triggered by an event. A FaaS is dormant and stateless, consuming no resources (such as CPU or disk storage). Because they don't exist (until called for), these functions are not-billed-for until they're used, and billed only until their process terminates. This saves money, and allows applications to be rapidly composed, executed, and become dormant (and not billed).

FaaS are constantly available, called when needed, and are then terminated/destroyed. Whether publicly available, or functions you've uploaded, FaaS don't exist until your framework calls them. Ultimately, FaaS are an ephemeral tool in the serverless architecture.

## Creating and Destroying FaaS

Functions-as-a-Service (FaaS) are process handlers living as function code elements in the cloud. You can use the FaaS that are provided publicly by cloud services providers; build your own (making them public or private); or use a combination. Legal, regulatory, or policy constraints can require authentication, encryption, and data localizing when data passes through the FaaS you use. Fortunately, there are FaaS for all of these steps, too.

Applications call FaaS processes in a manner analogous to a stored procedure. Whether the FaaS is publicly accessible or privately developed, it instantiates only on demand, most commonly as the result of the reception of an event trigger. The FaaS resources may or may not be co-located with existing infrastructure.

The event is often a message passed to a specific IP address or DNS address by your application framework. Typically, inside the message are authentication information, metadata describing characteristics of the packaged data, and the data. Event messages can be written in JSON, JS, YAML, XML, and other data interchange formats.

The functions are discrete code segments, composed as microservices. You can write them yourself. Alternatively you can call them from other sources (e.g. GitHub) or via a cloud provider.

FaaS aren't bound by changes elsewhere in an application framework. When business circumstances shift, requiring code maintenance, the changes affect only individual functions, rather than the entire project. This also permits interchangeability and customization. When FaaS are executed, they're provisioned uniquely. Many of the exact same FaaS can be instantiated (and destroyed when finished) concurrently. They exist as independent copies of programmatic states or instantiations.

## FaaS in the Serverless Model

In the serverless model, FaaS provides a framework that reacts to events. Code logic processes incoming data to orchestrate FaaS use, using events to trigger functions. Events are communications-with-data cycles; in turn, they spawn a series of processing events within an application framework that include the functions selected as-a-service. The serverless architecture orchestrates how events are triggered, which functions are called, where outputs are stored, and how transactions are verified.

The envelope can contain metadata that triggers processing of the contents of the message. Nothing happens until a message is received from an external resource, such as a webpage that sends a POST or GET request. Often a FaaS vendor has an API listening to a port address for the correct knock-on-the-door, which might be an authentication call, a POST request sent to a TCP port at an IP address or DNS address. Cloud FaaS providers, including ones you might build, only come alive and react to events (such as HTTP/HTTPS POSTS, GETS, or other formatted data in commonly understood authenticated messages), and you're not charged for them until they instantiate. The compute time may be fractions of a second for an executed function. Vendors charge in several ways for FaaS execution, such as actual execution time or bulk transactions (charged in the millions of executions per month for a given function).

For example: Let's say you run a site that shows videos, among other content. A typical framework transaction might process a website user request when they click on a video selection. The click triggers a message to a framework like [Apache Kafka](https://kafka.apache.org/), which starts a series of messages. Those messages deploy functions to authenticate the request, spawn a video stream to the user, update the user's selection information, commence billing services for the service, and send transaction information to a payments database. These may be – and probably are – several unique functions. Where the FaaS compute is performed – that is, on which server the code actually runs – is relevant only to the framework's transactional integrity and its acceptable latency.

In this example, the instances can be stacked for scale. The result is that the website can service multiple users simultaneously, each entering and leaving the framework as their video selections are begun and finished.

Generally, functions-as-a-Service are billed only by the compute time they consume. This means each FaaS has a cost to process a function, multiplied by the number of FaaS types called, per period time as composable microservices. In the previous example, a user choosing a video spawns FaaS that:

- Authenticate the user and the site from which the request was made
- Select a localized streaming video server
- Send the location to the user's browser and start the session
- Bill someone for the service
- Optionally send ads to that user based on selection criteria from a third-party site
- Bill all parties
- Pay all parties
- Record the transaction and store it
- Monitor for teardown
- Tear it down for the next use.

Each of these program steps is a function that combines different FaaS code elements. The application framework that sews together the functions is spawned by messages. It renders other messages and services links, the video service, the financial transactions, and it records the data for subsequent analysis – perhaps by additional FaaS.

The FaaS compute cost is confined to the event, rather than a full time spin-up waiting for events to process. At your option, functions can be spun-up as reactions to code on external hosts or other members of pods/processing centers, or by events triggered by Cron processes, service requests from other supply chain partners, or other application processes. The location of the trigger isn't relevant, whether it's executed within your Linode, processed within your Linode stacks, or processed by FaaS services elsewhere. The FaaS wakes up, does its work, and then is terminated.

The compute costs are ephemeral, and often are tiny, compared to the cost of a dedicated OS-with-code instantiation. When a FaaS routine stores processed data, perhaps to a [Linode Object Storage Bucket](https://www.linode.com/products/object-storage/), the transaction to store in the bucket is a separate cost from the FaaS compute time. Each microservice may have a micro-cost, instead of the cost of dedicated, ever-ready resource cost that may or may not be able to scale to meet demand within the reserved instance's resource allotment.

The applications you build, and their location in the cloud, are not constrained by the function's location. Your code can call FaaS from your own system or from third party services. Your choice may be constrained for legal reasons (such as regulatory localization), for lowest execution latency, and/or for per-execution cost.

Scalability and availability are always factors in cloud computing; that's among its selling points. FaaS typically processes in a short amount of time (often milliseconds), and are deemed to be always available. However, to increase availability in the case of communications outages or other network interruptions, developers can seed FaaS in several different clouds. Because FaaS can be stored in multicloud environment, they can be compartmentalized for region restrictions, redundancy for high availability and failover, and for lowest latency to a service region.

## FaaS Pros and Cons

To summarize the FaaS advantages:

- Cost controls. FaaS is based on a "pay as you go" model as are other microservices.
- No dedicated resources are required to meet high demand. FaaS instances are stacked and scale linearly.
- Security steps, such as multiple varying types of authentication, can be managed from multiple sources, concurrently, by using different FaaS for each family of authentication methodology.
- High availability is achievable. Use multiple cloud providers for redundancy.
- FaaS is part of the DevOps culture. Changing the function lends itself to the modular, [continuous delivery](/docs/guides/introduction-ci-cd/) philosophies.
- Better support for different regions and language handling. Use one FaaS for an EU audience and another for North America, for instance.
- You can choose any language, any framework, any cloud vendor.

But nothing is perfect. Before you deploy FaaS, consider its disadvantages:

- FaaS sprawl. It is tempting to divide too much application logic into FaaS as microservices at the price of manageability and maintenance overhead.
- Some types of data cannot be used as event triggers or be sent through a FaaS service, as they're subject to geolocation, regulatory, or other constraints.
- Asynchronous latencies can be an issue. Some functions inevitably encounter delays. This means you need a tracking method to ensure application transactional integrity as well as acceptable response latencies.
- Testing orchestration and simulating outages is complicated by the diffuse nature of serverless composable objects. QA and troubleshooting can be highly complex.
- It can be difficult to audit actual costs when you use many providers.
- If you somehow forget to terminate FaaS, you must pay for the resources used.