---
title: "Jenkins CI/CD on Linode to Any Hyperscaler"
description: "A standard Jenkins CI/CD system that can be hosted within Linode and any outside hosting environment"
license: "[CC BY-ND 4.0](http://creativecommons.org/licenses/by-nd/4.0/)"
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
---

[![Thumbnail of Jenkins pipeline example reference architecture](thumbnail-1-2.png)](diagrams/)
[![Thumbnail of entire CI/CD reference architecture](thumbnail-2-2.png)](diagrams/)

## Abstract
A standard [Jenkins](https://www.jenkins.io/) CI/CD system can be hosted within Linode and any outside hosting environment (AWS, Azure, GCP, DO, etc.)

The Jenkins server is used to manage the pipelines and agents and host the dashboard for end-users. Depending on the scale and requirements, developers can deploy N-number of build agent servers to handle concurrent processes. This process can be automated using [Terraform](https://www.terraform.io/) to scale build agent servers horizontally.

## Technologies Used
- [Jenkins](https://www.jenkins.io/)
- [Terraform](https://www.terraform.io/)
- **Linode Services**:
    - [Compute](https://www.linode.com/docs/products/compute/dedicated-cpu/)
    - [Firewall](https://www.linode.com/docs/products/networking/cloud-firewall/)
    - [Object Storage](https://www.linode.com/docs/products/storage/object-storage/)

## Business Benefits
- Reduce costs of large CI/CD deployments
- Granular control of environments
- Improved customizability
- Most control is in the hands of the developers