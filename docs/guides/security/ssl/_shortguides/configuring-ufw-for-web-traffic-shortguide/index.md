---
# Shortguide: Configuring UFW for Web Traffic

headless: true
show_on_rss_feed: false

# Ignore the below front matter. It is included to comply with existing tests.

slug: configuring-ufw-for-web-traffic-shortguide
title: "Shortguide"
description: "Shortguide"
keywords: ["shortguide"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-01
modified_by:
  name: Linode
authors: ["Linode"]
---

## Configuring Firewall Rules with UFW

Any firewall configured on your server needs to allow connections over HTTPS (in addition to HTTP and any other services/ports you require). This section covers enabling and configuring [UFW](https://wiki.ubuntu.com/UncomplicatedFirewall) (UncomplicatedFirewall). UFW is the default firewall management tool on Ubuntu and is also available on Debian and Fedora. It operates as a easy to use front-end for [iptables](/docs/guides/what-is-iptables/).

You can skip this section if you are using a different firewall (such as Linode's [Cloud Firewall](/docs/products/networking/cloud-firewall/) service), have already configured your firewall rules, or do not wish to use any firewall.

1.  If UFW is not installed, install it now using `apt` or `apt-get`.

        sudo apt update
        sudo apt install ufw

1.  Add firewall rules to allow ssh (port 22) connections as well as http (port 80) and https (port 443) traffic.

        sudo ufw allow ssh
        sudo ufw allow http
        sudo ufw allow https

    Your server may require additional rules depending on which applications you're running (such as mail servers or database servers) and if those applications need to be accessible from other systems.

1.  Enable UFW if its not already enabled.

        sudo ufw enable

1.  Verify that UFW is enabled and properly configured for ssh and web traffic.

        sudo ufw status

    This should return a status of *active* and output the firewall rules that you just added.

For more advanced configuration, review the [How to Configure a Firewall with UFW](/docs/guides/configure-firewall-with-ufw/) guide.