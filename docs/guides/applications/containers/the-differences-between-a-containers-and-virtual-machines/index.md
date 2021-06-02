---
slug: the-differences-between-a-containers-and-virtual-machines
author:
  name: Steven J. Vaughan-Nichols
  email:  sjvn01@gmail.com
description: 'This guide discusses the differences between containers and virtual machines. You may be newer to the cloud computing landscape and have encountered terms and technologies like Docker, Linux KVM, and virtualization. Use this guide to learn how containers and virtual machines provide the core technology behind modern cloud computing practices.'
og_description: 'This guide discusses the differences between containers and virtual machines. You may be newer to the cloud computing landscape and have encountered terms and technologies like Docker, Linux KVM, and virtualization. Use this guide to learn how containers and virtual machines provide the core technology behind modern cloud computing practices.'
keywords: ['container', 'virtual machines', 'kvm']
tags: ['container', 'docker']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-06-02
modified_by:
  name: Linode
title: "What are the Differences Between Containers vs. Virtual Machines"
h1_title: "The Differences Between Containers vs. Virtual Machines"
enable_h1: true
contributor:
  name: Steven J. Vaughan-Nichols
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

At the surface, containers and virtual machines (VM) look the same. Both enable companies to run multiple instances of the same operating system and programs on bare metal hardware. However, under the surface, they're not alike.

The key difference is  VM hypervisors, such as [Linux's KVM](https://www.linux-kvm.org/page/Main_Page) and [Xen](https://xenproject.org/), all emulate hardware on a server's processor and memory. So, for example, on Linode you can run [CentOS](https://www.centos.org/), and the [KVM hypervisor](/docs/guides/kvm-reference/). Then, using KVM you can run an instance of [Ubuntu Linux](https://ubuntu.com/) on top of CentOS. That instance shares the resources of the real machine and emulates the server's hardware in almost all respects. That works well for many jobs. But, because hypervisors emulate the hardware they're quite fat in terms of system requirements.

Containers, on the other hand, are based on shared operating systems. This makes containers such as [Docker](https://www.docker.com/), [LXC](https://linuxcontainers.org/), [runC](https://github.com/opencontainers/runc), and [containerd](https://containerd.io/) skinnier and more efficient than hypervisors. Instead of virtualizing hardware, containers rest on top of a single Linux instance. With these you leave behind the excess VM emulation hardware, there's a much smaller system footprint. Containers only include those operating system components required for an application.

VMs and containers, therefore, have different virtues.

The one thing that hypervisors can do that containers can't is to use different operating systems or kernels. For example, [Oracle VirtualBox](https://www.virtualbox.org/), a desktop VM hypervisor can run instances of Linux and Windows at the same time. With LXC, all containers must use the same operating system and kernel.

Containers, however, because of their size, can be used to run many more instances than VMs on the same hardware. With a totally tuned container system, four-to-six times as many server containers can be run as VMs.

In addition, containers lend themselves for application portability.  A containerized application can be packed, shipped, and run as a lightweight, portable, self-sufficient container that can run virtually anywhere containers are supported.

This combination makes containers the foundation for modern [Kubernetes](https://www.linode.com/docs/guides/beginners-guide-to-kubernetes-part-1-introduction/) and [continuous integration/continuous deployment (CI/CD)](/docs/guides/introduction-ci-cd/) models.



