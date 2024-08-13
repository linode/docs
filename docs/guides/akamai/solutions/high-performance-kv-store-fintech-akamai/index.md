---
slug: high-performance-kv-store-fintech-akamai
title: "High-Performance KV Store for Fintech with Akamai"
description: "This guide outlines a distributed key-value storage architecture with NATS and JetStream that supports user registration for a global fintech service."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2024-08-013
keywords: ['fintech','key-value store','NATS.io','NATS JetStream']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Core NATS | NATS Docs](https://docs.nats.io/nats-concepts/core-nats)'
- '[JetStream | NATS Docs](https://docs.nats.io/nats-concepts/jetstream)'
---

Fintech and eCommerce services process high volumes of transactions and have demanding requirements for performance, reliability, and resiliency. The data storage size for a given transaction in these services may not be as large as in other industries like media or gaming, but they must adhere to rigorous standards for security, latency, and consistency.

This guide outlines a distributed key-value (KV) storage architecture that supports registration for users between a global fintech service and a banking system. In particular, the data stored represents users' credit card information, and it is encrypted in this storage system. This KV store is implemented with NATS and the JetStream persistence engine, and it is deployed across 11 core compute regions on Akamai Connected Cloud. The system is capable of storing hundreds of millions of keys while guaranteeing low latency for registration requests and a resilient method for quickly publishing and updating key-value data.

## Distributed KV Store Workflow

At a high level, key/value registration data is stored and requested with the following workflow:

1. Key-value data is loaded into a primary NATS cluster.
1. The NATS protocol propagates the data into ten NATS leaf nodes in ten different core compute locations.
1. An HTTPS gateway in front of each NATS leaf node accepts registration requests from the Akamai Global Load Balancer.
1. Users submit registration requests to the Global Traffic Manager. The load balancer routes requests to the most-performant NATS node according to the user's location.

## Overcoming Challenges

### Latency Sensitivity

*Identify sources of high latency and minimize the latency impact of those components.*

The KV storage architecture designed for this use case was required to meet a 60ms response time threshold for all requests. In testing of this architecture, connection and TLS negotiation times of less than 10ms were typically observed. Wait times of less than 10ms were also observed after establishing a connection. This is achieved with a storage architecture that caches data across a wide geographic area allowing users across a region to make low-latency requests to a nearby storage node.

The KV data is first stored in a primary NATS cluster before it is cached with the geographically-distributed leaf nodes. The built-in JetStream persistence engine for NATS is used to create the KV persistence layer in the primary cluster. Without JetStream, the Core NATS software is unable to offer this kind of persistence.

JetStream is also used to keep the leaf nodes synchronized with the primary cluster, using a NATS-optimized RAFT quorum algorithm. This algorithm allows for a high degree of horizontal scaling, which allows the architecture to be extended into new areas. Akamai’s global footprint of compute regions supports expansion of the service. Because this is all done with the same software, this expansion is relatively simple to configure and operate.

### Resiliency

*Ensure users' registration requests are processed without error*

The KV storage architecture is also required to operate with minimal errors, both for users making requests on the service, and for update operations that accept new KV data into the cluster.

Since the data is cached across a range of different compute regions, a failure for one or more leaf nodes will not result in a service outage. The DNS-based Akamai Global Traffic Manager routes user requests to the available leaf nodes that remain in the event of downtime. When a leaf node is returned to service after downtime, the JetStream quorum algorithm restores its data to a state that's consistent with the rest of the nodes.

The primary cluster that first stores the KV data is itself composed of three nodes. This cluster is able to continue operating with just one node if the other two experience downtime. As with the leaf nodes, the JetStream quorum algorithm will restore the data on the other primary cluster nodes when they are returned to service.

### Data Consistency

*Propagate changes to user data quickly across the distributed storage cluster*

The KV data is cached across a wide range of core compute regions, and it is essential that a request on any two of those locations returns the same data. Differences in the data stored at different leaf nodes can potentially occur when updates to the data in the primary cluster are being propagated across the network.

For this reason, it is important for these update operations to be propagated quickly. In testing this architecture, the quorum algorithm used by JetStream was able to achieve global consistency across the network in less than 100ms.


## Distributed Key-Value Store Design Diagram

This solution creates a key-value storage service on Akamai Connected Cloud. The service is composed of a primary storage cluster in one compute region and ten storage leaf nodes installed across ten other compute locations. Akamai Global Traffic Management routes requests from users to these leaf nodes.

![NATS Key-Value Store Design Diagram](nats-kv-store.svg?diagram-description-id=nats-kv-store-design-diagram)

1. Publishing Key-Value Data: Key-value data is loaded asynchronously into the primary storage cluster via the [NATS client software](https://docs.nats.io/running-a-nats-service/clients).

2. JetStream uses a NATS-optimized Raft quorum algorithm to update the data across the three nodes that the primary cluster is composed of.

3. JetStream's quorum algorithm is used to update the data on the ten NATS leaf-nodes that are installed in the other Akamai compute locations.

4. User Requests: Users make HTTPS requests on the storage service. The request encodes the key that the user would like to retrieve the key-value data for. For example:

        https://example.com/kv/{key}

5. Akamai Global Traffic Management uses DNS to route requests to storage leaf nodes. Liveness checks are performed on the leaf nodes so that requests are only routed to available nodes. The node that offers the lowest latency and best performance for the user's location is selected.

6. An HTTPS/NATS Gateway NGINX receives the request and retrieves the key-value data from the leaf node, using the key encoded in the request URL.
{#nats-kv-store-design-diagram .large-diagram}

### Systems and Components

- **A primary NATS cluster**, consisting of 3 nodes installed in a core compute region. [NATS](https://nats.io/) is a data communications technology that is used to send messages between services with a publish-subscribe model. [Core NATS](https://docs.nats.io/nats-concepts/core-nats) does not provide persistence for this data.

    The built-in [JetStream](https://docs.nats.io/nats-concepts/jetstream) persistence engine is used to implement a key-value store on this cluster. JetStream's quorum algorithm is also used to maintain consistency of the key-value data between the three nodes.

    Key-value data is first uploaded to the primary cluster via the NATS protocol.

- **Ten NATS leaf-nodes** installed across ten different compute regions. JetStream's quorum algorithm is also used to update the data on these nodes when the key-value data is updated on the primary cluster.

- **An HTTPS gateway for each NATS leaf node**, installed in the same compute location as the leaf node. These gateways listen for requests on a URL that encodes the key text of a key-value pair; for example:

        https://example.com/kv/{key}

    The gateway retrieves the value of the key from the corresponding NATS leaf node.

- **[Akamai Global Traffic Managment](https://www.akamai.com/products/global-traffic-management)** is responsible for accepting user requests on the service and routing requests to an available leaf node that provides the lowest latency for the user's location.