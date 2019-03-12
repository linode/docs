---
author:
  name: Linode Community
  email: docs@linode.com
description: 'A high level overview of Kubernetes cluster architecture.'
keywords: ['kubernetes','k8s','beginner','architecture']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-03-12
modified: 2019-03-12
modified_by:
  name: Linode
title: "A Beginner's Guide to Kubernetes"
contributor:
  name: Linode
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

*Kubernetes* is an open source container orchestration system that helps deploy and manage containerized applications. Developed by Google starting in 2014 and written in the Go langauge, Kubernetes (often referred to as *k8s*) has quickly become the standard when it comes to creating auto-scaling and self-healing applications. This guide will explain the major parts of Kubernetes and some of the core concepts behind their implementation.

This guide assumes you have a working knowledge of containers and Docker.

## Nodes

In Kubernetes all Linodes, VMs, or physical servers are called Nodes.

## Pods

In Kubernetes all containers exist within Pods. Pods each have their own