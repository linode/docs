---
# Shortguide: Limitations for NodeBalancers

headless: true
show_on_rss_feed: false
---

- **Maximum number of concurrent connections:** Each NodeBalancer support up to 10,000 concurrent connections. If your application needs to support more than that, [contact support](https://www.linode.com/support/) to determine additional options or consider using multiple NodeBalancers behind a DNS load balancing solution such as [Round-Robin DNS](/docs/guides/setting-up-round-robin-dns/).
- Within all configuration modes, HTTP/1.1 is supported (HTTP/2 support is not yet available).
- **TLS termination:** When using a NodeBalancer with an application that requires HTTPS, you can either terminate the TLS connection on the NodeBalancer (**HTTPS termination** mode) or on the backend Linodes (**TCP** mode). When terminating TLS connections directly on the NodeBalancer, there are a few key considerations:
    - **Connections per second:** There are no defined rate limits for the number of connections over a give time period, though certain configuration modes are more performant. A port configured in **TCP** mode allows for the most number of connections whereas a port configured in **HTTPS termination** mode is the most resource intensive and allows for fewer connections.
    - **TLS protocols:** TLS v1.2 and v1.3 are supported in **HTTPS termination** mode.
    - While operating in **HTTPS termination** mode, internal traffic sent to the backend Linodes will be unencrypted.

    For applications that require a very high connection rate or otherwise need to overcome the above considerations present in **HTTPS termination** mode, consider operating in **TCP** mode and terminating TLS on the backend Linodes.