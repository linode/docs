---
author:
  name: Linode
  email: docs@linode.com
title: "Health Checks"
description: ""
---

NodeBalancers perform both passive and active health checks against the backend nodes. Nodes that are no longer responding are taken out of rotation.

## Passive

When servicing an incoming request, if a backend node fails to connect, times out, or returns a 5xx response code (excluding 501 and 505), it will be considered unhealthy and taken out of rotation.

Passive health checks can be disabled if you choose:

1.  From the Linode Cloud Manager, click the **NodeBalancers** page.
1.  Select your NodeBalancer.
1.  Under the **Configurations** tab, scroll down and toggle the **Passive Checks** box under **Passive Checks**, then click **Save**.

## Active

NodeBalancers also proactively check the health of back-end nodes by performing TCP connections or making HTTP requests. The common settings are:

-   **Check Interval** - Seconds between active health check probes.
-   **Check Timeout** - Seconds to wait before considering the probe a failure. 1-30.
-   **Check Attempts** - Number of failed probes before taking a node out of rotation. 1-30.

Three different Health Check Types exist:

-   **TCP Connection** - requires a successful TCP handshake with a backend node.
-   **HTTP Valid Status** - performs an HTTP request on the provided path and requires a 2xx or 3xx response from the backend node.
-   **HTTP Body Regex** - performs an HTTP request on the provided path and requires the provided PCRE regular expression matches against the request's result body.