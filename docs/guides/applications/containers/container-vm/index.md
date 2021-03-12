---
slug: container-vm
author:
  name: Steven J. Vaughan-Nichols
  email: sjvn01@gmail.com
description: 'Need to understand the distinctions between containers and virtual machine? Here&#39;s a short-and-sweet explanation.'
og_description: 'Need to understand the distinctions between containers and virtual machine? @sjvn has a short-and-sweet explanation.'
keywords: ['Container vs VM']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-12
modified_by:
  name: Linode
title: "The basics: the differences between containers and virtual machines"
h1_title: "What are the differences between containers and virtual machines?"
contributor:
 name: Steven J. Vaughan-Nichols
 link: [http://www.twitter.com/sjvn](http://www.twitter.com/sjvn)
---

# What are the differences between containers and virtual machines?

At the surface, containers and virtual machines (VM) look the same. Both enable companies to run multiple instances of the same operating system and programs on bare metal hardware. However, under the surface, they&#39;re not alike.

The key difference is that VM hypervisors – such as Microsoft&#39;s [Hyper-V](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/about/), Linux&#39;s [KVM](https://www.linux-kvm.org/page/Main_Page), and [Xen](https://xenproject.org/) — all emulate hardware on a server&#39;s processor and memory. So, for example, on Linode you can run on top of [CentOS](https://www.centos.org/), the [KVM hypervisor](https://www.linode.com/docs/guides/kvm-reference/), or an instance of [Ubuntu Linux](https://ubuntu.com/). That instance shares the resources of the real machine and emulates the server&#39;s hardware in almost all respects.

That works well for many jobs. But, because hypervisors emulate the hardware, their system requirements are quite fat.

Containers, on the other hand, are based on shared operating systems. This makes containers such as [Docker](https://www.docker.com/), [LXC](https://linuxcontainers.org/), [runC](https://github.com/opencontainers/runc), and [containerd](https://containerd.io/) skinner and more efficient than hypervisors. Instead of virtualizing hardware, containers rest on top of a single Linux instance. Containers only include those operating system components required for an application. Leaving behind the excess VM emulation hardware results in a much smaller system footprint.

Therefore, VMs and containers have different virtues.

The one thing that hypervisors can do – and containers cannot – is use different operating systems or kernels. For example, [Oracle VirtualBox](https://www.virtualbox.org/), a desktop VM hypervisor, can run instances of Linux and Windows at the same time. With LXC, all containers must use the same operating system and kernel.

On the other hand, because of their size, containers can be used to run many more instances than VMs on the same hardware. With a well-tuned container system, four-to-six times as many server containers can be run as VMs.

In addition, containers lend themselves to application portability. A containerized application can be packed, shipped, and run as a lightweight, portable, self-sufficient container that can run virtually anywhere containers are supported.

This combination makes containers the foundation for modern [Kubernetes](https://www.linode.com/docs/guides/beginners-guide-to-kubernetes-part-1-introduction/) and [continuous integration/continuous deployment (CI/CD)](https://www.linode.com/docs/guides/introduction-ci-cd/) models.
