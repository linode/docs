---
title: NodeBalancers
description: "Linode multi-port NodeBalancers feature SSL termination, sticky sessions, passive health checks, and throttling to prevent potential abuse."
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    date: 2020-06-02
    product_description: "NodeBalancers are load balancers-as-a-service in the cloud, managed by Linode. They intelligently route incoming requests to backend Linodes to help your application cope with any load increase."
---

## Availability

Tokyo, Japan; Mumbai, India; Singapore, Singapore; Sydney, Australia; Frankfurt, Germany; London, United Kingdom; Toronto, Canada; Newark, NJ, USA; Atlanta, GA, USA; Dallas, TX, USA; Fremont, CA, USA

## Features

### SSL Termination
NodeBalancers can terminate SSL traffic on your behalf and expose the requester’s IP through the backend. This is done using configurable rulesets that give you the power to fine-tune admissible traffic.

### Sticky Sessions
NodeBalancers can route subsequent requests to the same backend, so all application sessions work correctly.

### Health Checks
Traffic is only routed to healthy backends. Passive health checks happen on every request. You can configure active health checks based on your application or service.

### Throttling
Prevent potential abuse – and preserve resources on your backend Linodes – by setting a client connection throttle at the NodeBalancer.

### Multi-Port
NodeBalancers support balancing traffic to multiple network ports. Several services can be load balanced with a single NodeBalancer.

## Pricing

NodeBalancers cost a flat rate of $10/month.
