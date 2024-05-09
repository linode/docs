---
title: "Jenkins CI/CD on Linode to Any Hyperscaler"
description: "A standard Jenkins CI/CD system that can be hosted within Linode and any outside hosting environment"
published: 2022-09-08
license: "[CC BY-ND 4.0](http://creativecommons.org/licenses/by-nd/4.0/)"
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
---

## Abstract

This reference architecture showcases a [Jenkins](https://www.jenkins.io/) CI/CD system hosted on the Linode platform that can automate deployments to Linode or other hosting platforms (including AWS, Azure, and GCP). The Jenkins server is used to manage the pipelines and agents and host the dashboard for end-users. Depending on the scale and requirements, developers can deploy N-number of build agent servers to handle concurrent processes. This process can be automated using [Terraform](https://www.terraform.io/) to scale build agent servers horizontally.

## Technologies Used

- [Jenkins](https://www.jenkins.io/)
- [Terraform](https://www.terraform.io/)
- **Linode Services**:
    - [Compute](/docs/products/compute/dedicated-cpu/)
    - [Firewall](/docs/products/networking/cloud-firewall/)
    - [Object Storage](/docs/products/storage/object-storage/)

## Business Benefits

- Reduce costs of large CI/CD deployments
- Granular control of environments
- Improved customizability
- Most control is in the hands of the developers

## Diagrams

[![Thumbnail of Jenkins pipeline example reference architecture](jenkins-pipeline-diagram-thumnail-1.png)](/docs/reference-architecture/jenkins-ci-cd-on-linode-to-any-hyperscaler/diagrams/#jenkins-pipeline)

[![Thumbnail of entire CI/CD reference architecture](jenkins-cicd-diagram-thumnail.png)](/docs/reference-architecture/jenkins-ci-cd-on-linode-to-any-hyperscaler/diagrams/#cicd-infrastructure)