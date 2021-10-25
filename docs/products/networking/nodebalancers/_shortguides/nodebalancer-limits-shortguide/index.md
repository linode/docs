---
# Shortguide: Limitations for NodeBalancers

headless: true
show_on_rss_feed: false
---

- **Maximum number of concurrent connections:** Each NodeBalancer support up to 10,000 concurrent connections. If your application needs to support more than that, [contact support](https://www.linode.com/support/) to determine additional options or consider using multiple NodeBalancers behind a DNS load balancing solution such as [Round-Robin DNS](/docs/guides/setting-up-round-robin-dns/).
- **IP addresses:** A public IPv4 address and IPv6 address are configured on each NodeBalancer. Additional addresses are not available.
- **Private network:** Communication with backend Linodes occurs over a data center's private network. As such, backend Linodes must be located within the same data center as the NodeBalancer.
- **HTTP support:** HTTP/1.1 (HTTP/2 support is not yet available).
- **Network transfer:** *Outbound transfer* usage is counted towards the account-wide [monthly network transfer pool](/docs/guides/network-transfer/). This pool is the combined total of the network transfer allowance of each Linode on the account. Both *Incoming transfer* and transfer over the private network are provided at no cost.
- **Connections per second:** There are no defined rate limits for the number of connections over a given time period, though certain modes are more performant. A port configured in **TCP** mode allows for the most number of connections. A port configured in **HTTPS** mode is the most resource intensive and accommodates fewer connections.
- **TLS termination:** When using a NodeBalancer with an application that requires HTTPS, you can either terminate the TLS connection on the NodeBalancer (**HTTPS** mode) or on the backend Linodes (**TCP** mode). When terminating TLS connections directly on the NodeBalancer, there are a few key considerations:
    - **TLS protocols:** TLS v1.2 and v1.3 are supported in **HTTPS** mode.
    - While operating in **HTTPS** mode, internal traffic sent to the backend Linodes will be unencrypted.

    For applications that require a very high connection rate or otherwise need to overcome the above considerations present in **HTTPS** mode, consider operating in **TCP** mode and terminating TLS on the backend Linodes.