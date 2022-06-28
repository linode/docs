---
# Shortguide: Configuring Firewalld for Web Traffic

headless: true
show_on_rss_feed: false

# Ignore the below front matter. It is included to comply with existing tests.

slug: configuring-firewalld-for-web-traffic-shortguide
title: "Shortguide"
description: "Shortguide"
keywords: ["shortguide"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-01
author:
  name: Linode
  email: docs@linode.com
modified_by:
  name: Linode
---

## Configuring Firewall Rules with Firewalld

Any firewall configured on your server needs to allow connections over HTTPS (in addition to HTTP and any other services/ports you require). This section covers enabling and configuring [firewalld](https://firewalld.org/). Firewalld is the default firewall management tool on Fedora 18+, OpenSUSE 15+, and CentOS/RHEL 7/8, including derivatives like AlmaLinux 8 and Rocky Linux 8. Depending on the distribution, it operates as a front-end for either iptables or the newer nftables.

You can skip this section if you are using a different firewall (such as Linode's [Cloud Firewall](/docs/products/networking/cloud-firewall/) service), have already configured your firewall rules, or do not wish to use any firewall.

1.  If firewalld is not installed, install it now using [YUM](/docs/guides/yum-package-manager/) or [DNF](/docs/guides/dnf-package-manager/).

        sudo yum install firewalld

1.  Start firewalld and enable it to automatically start on boot.

        sudo systemctl start firewalld
        sudo systemctl enable firewalld

1.  Add firewall rules to allow ssh (port 22) connections as well as http (port 80) and https (port 443) traffic.

        sudo firewall-cmd --zone=public --permanent --add-service=ssh
        sudo firewall-cmd --zone=public --permanent --add-service=http
        sudo firewall-cmd --zone=public --permanent --add-service=https

    If any of these services are already enabled, you may get a warning notice that you can safely ignore. Your server may require additional rules depending on which applications you're running (such as mail servers or database servers).

1.  Reload firewalld to make these rules take effect.

        sudo firewall-cmd --reload

1.  Verify that the firewall rules have been properly configured.

        sudo firewall-cmd --zone=public --permanent --list-services