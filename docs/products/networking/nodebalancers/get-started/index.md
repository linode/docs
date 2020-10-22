---
title: Get Started
description: "Get started with Linode NodeBalancers. Learn how to configure a NodeBalancer."
tab_group_main:
    weight: 20
---

## Configure a NodeBalancer

1.  Visit the NodeBalancers page in the Linode [Cloud Manager](http://cloud.linode.com) and select **Add a NodeBalancer**.

1.  For the example web application, only one NodeBalancer is needed. Add one in the same data center that your backend Linodes are located in.

1.  A NodeBalancer is configured using [ports](/docs/platform/nodebalancer/nodebalancer-reference-guide/#port). This example web application only uses port 80 (for regular HTTP traffic).

    **HTTP**

    For the traditional web application, the settings in the screenshot above are a good start. HTTP cookie stickiness is preferred so that the same client always lands on the same backend. For a simple web application that keeps sessions in memory, this is necessary to avoid session errors on clients.

    **HTTPS**

    If you select the HTTPS protocol, two new fields appear. These fields accept your SSL certificate, chained certificates (if applicable) and a private key (which must not have passphrase protection).

    Every ten seconds, the NodeBalancer requests the root of the web application and looks for a valid response code. With this example setup, there is only one backend node (which is added in the next step). If the backend goes down, the NodeBalancer serves a plain 503 Service Unavailable error page. This is more desirable than refusing connections or making browsers wait for a timeout.

1.  Next, add the single backend node to the NodeBalancer's configuration. Point this at the private IP address of your web server Linode.

    These configuration changes take a few moments to be reflected by your NodeBalancer. If everything is configured on your backend correctly, once the changes have gone through, the **Node Status** column updates to **1 up / 0 down**.

    If the backend status reports **0 up / 1 down**, check to make sure that your web application is configured to respond on the Linode's private IP address. You do this by adding the private IP address to your `/etc/hosts` file on your Linode and then reboot your Linode. There might be a virtual host mismatch as well -- check the notes in the next section.

1.  Now that the backend is up, go directly to your NodeBalancer's IP address in a browser. You should see your web application as the NodeBalancer proxies the traffic through.
