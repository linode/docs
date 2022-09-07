---
title: "Horizontally Scaling High-Traffic Applications with Observability and Monitoring"
description: "Horizontally scale infrastructure to meet demands of a growing application through HAProxy, and monitor with Prometheus and Grafana."
weight: 20
license: "[CC BY-ND 4.0](http://creativecommons.org/licenses/by-nd/4.0/)"
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
---

## Abstract
This reference architecture highlights how customers can horizontally scale their infrastructure using Terraform and Ansible when certain performance thresholds are met; can observe detailed real-time metrics through the Grafana dashboard from Prometheus.

In this example, the main bottleneck for this use case is the /notifications area of the mobile app. When the client pushes notifications to the app, many users will check out the notifications on their devices which would call back to the server. The overwhelming number of requests would crash the web server when this happens. The proposed architecture solves several issues for this use case by:

- Allows the application to grow as the target audience increases by having multiple HAProxy nodes
- Establishes monitoring via Prometheus/Grafana
- Separates the main app and the notification callback to the app
- Scales the app’s notifications section via config management tools
- Implement network segmentation using Linode VLANs
- Adds resiliency to the database for uptime and reliability

## Technologies Used
- TerraForm
- Ansible
- Prometheus
- Grafana
- HAProxy


## Business Benefits
- Better user experience through scalability
- Proactive maintenance through observability and monitoring
- A high degree of reliability with no single point of failure
- Portable workload and can be deployed anywhere
- Market Applicability
- Small Business, Mid-Market & Enterprise
