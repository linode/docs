---
# Shortguide: How to edit Cloud Firewall rules.

headless: true
show_on_rss_feed: false
---

- Cloud Firewalls are **compatible with all Linode Compute Instances**. They are not currently supported on other Linode services, such as NodeBalancers or Object Storage.
- A Cloud Firewall can be attached to multiple Linode Compute Instances but a Linode Compute Instance can only be attached to one *active* (enabled) Cloud Firewall at a time.
- A maximum of **25 rules** can be added to each Cloud Firewall (both Inbound and Outbound rules combined).
- A maximum of **255 IP addresses (and ranges)** can be added to each Cloud Firewall rule.
- All **IP addresses** and **IP Ranges** must be formatted correctly, or changes will be unable to be saved.
- A maximum of **15 ports (and port ranges)** can be defined on each Cloud Firewall rule.

