---
slug: lke-continuous-deplpoyment-part-5
author:
  name: Linode Community
  email: docs@linode.com
description: 'This series of guides will waklk you through setting up a continous deployment pipeline on LKE.'
keywords: ['kubernets', 'k8s', 'lke']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-05-03
modified_by:
  name: Linode
title: "Building a Continous Deployment Pipepline Using LKE Part 5: Accessing Internal Services"
contributor:
  name: Linode
tags: ["kubernetes"]
---

## Presentation Text

### Accessing internal services

- How can we temporarily access a service without exposing it to everyone?

- `kubectl proxy`: gives us access to the API, which includes a proxy for HTTP resources

- `kubectl port-forward`: allows forwarding of TCP ports to arbitrary pods, services, ...

### `kubectl proxy` in theory

- Running `kubectl proxy` gives us access to the entire Kubernetes API

- The API includes routes to proxy HTTP traffic

- These routes look like the following:

  `/api/v1/namespaces/<namespace>/services/<service>/proxy`

- We just add the URI to the end of the request, for instance:

  `/api/v1/namespaces/<namespace>/services/<service>/proxy/index.html`

- We can access `services` and `pods` this way

### `kubectl proxy` in practice

- Let's access the `web` service through `kubectl proxy`

- Run an API proxy in the background:

      kubectl proxy &

- Access the `web` service:

      curl localhost:8001/api/v1/namespaces/default/services/web/proxy/

- Terminate the proxy:

      kill %1

### `kubectl port-forward` in theory

- What if we want to access a TCP service?

- We can use `kubectl port-forward` instead

- It will create a TCP relay to forward connections to a specific port

  (of a pod, service, deployment...)

- The syntax is:

  `kubectl port-forward service/name_of_service local_port:remote_port`

- If only one port number is specified, it is used for both local and remote ports

### `kubectl port-forward` in practice

- Let's access our remote NGINX server

- Forward connections from local port 1234 to remote port 80:

      kubectl port-forward svc/web 1234:80 &

- Connect to the NGINX server:

      curl localhost:1234

- Terminate the port forwarder:

      kill %1

???

:EN:- Securely accessing internal services

:T: Accessing internal services from our local machine

:Q: What's the advantage of "kubectl port-forward" compared to a NodePort?
:A: It can forward arbitrary protocols
:A: It doesn't require Kubernetes API credentials
:A: It offers deterministic load balancing (instead of random)
:A: ✔️It doesn't expose the service to the public

:Q: What's the security concept behind "kubectl port-forward"?
:A: ✔️We authenticate with the Kubernetes API, and it forwards connections on our behalf
:A: It detects our source IP address, and only allows connections coming from it
:A: It uses end-to-end mTLS (mutual TLS) to authenticate our connections
:A: There is no security (as long as it's running, anyone can connect from anywhere)