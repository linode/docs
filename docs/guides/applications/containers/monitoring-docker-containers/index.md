---
slug: monitoring-docker-containers
description: 'A docker container monitoring system tracks performance of containers. From the benefits of monitor docker containers to how they work, this guide covers it all.'
keywords: ['docker monitoring','docker container monitoring ','container monitoring']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-04
modified_by:
  name: Linode
title: "Monitoring Docker Containers: Benefits, Best Practices, and Must-Have Tools"
title_meta: "Docker Container Monitoring Benefits and Tools"
authors: ["Steven J. Vaughan-Nichols"]
---

Eight years ago containers were a known technology, but with little public adoption. Then, Solomon Hykes created Docker, a container technology, making containers much easier to use. Today, containers rule the IT world. Gartner predicts 70% of [organizations will run containerized applications](https://www.gartner.com/document/3955920?ref=solrAll&refval=277254196) by 2023.

Why? Organizations realize the benefits of easier configuration, faster deployment, and being able to run more workloads on the same hardware with containerized applications.

To make the best possible use of containers, monitoring Docker containers is a must. Without container monitoring, you’re traveling in the dark. You literally can’t see how well your containers are working, what they’re doing, or how well they’re doing their jobs.

Also, without Docker container monitoring, you can’t know how the microservices and applications built on containers are working. Container monitoring enables you to know what’s going on with the containers themselves, and with your larger, user-facing programs.

## Docker Container Monitoring: The Basics

A major reason why containers are popular is because they lend themselves to [Continuous Integration/Continuous Deployment (CI/CD)](/docs/guides/introduction-ci-cd/). This is a [DevOps methodology](https://www.zdnet.com/article/what-is-devops-an-executive-guide-to-agile-development-and-it-operations/) designed to enable programmers to integrate their code into a shared repository early and often. Once there, containerized programs are deployed quickly and efficiently.

Docker also enables developers to pack, ship, and run any application as a lightweight, portable, self-sufficient container, which can run virtually anywhere. Containers give you instant application portability.

Containers do this by enabling developers to isolate code into a single container, making it more efficient to modify and update the program. It enables enterprises to break up big development projects among multiple smaller Agile teams using CI/CD pipelines to automate new and updated code delivery via containers.

Finally, and perhaps the most important point for businesses, containers enable companies to maximize hardware and cloud resources. As James Bottomley, formerly Parallels' CTO of server virtualization and a leading Linux kernel developer, explained, “VM hypervisors, such as Hyper-V, KVM, and Xen, are all based on emulating virtual hardware. That means they're fat in terms of system requirements."

Containers, however, use shared operating systems so they are much skinnier than hypervisors in system resource terms. Instead of virtualizing hardware, containers rest on a single Linux instance. This means you can "leave behind the useless 99.9 percent VM junk, leaving you with a small, neat capsule containing your application," as said by Bottomley. In other words, with a well-tuned container system, you can have as many as four-to-six containers running on a system that, in the past, could have only run a single instance.

Today, there are many kinds of container platforms. While Docker is the most well-known, there's also [LXC](https://linuxcontainers.org/), [runC](https://github.com/opencontainers/runc), [containerd](https://containerd.io/), and [podman](https://podman.io/). They all perform similar functions and can largely be managed with the same tools.

## What is Docker?

So, what is Docker specifically? Docker is built on top of LXC. Like with any other container, as far as any program running on Docker is concerned, it has its own file system, storage, CPU, and RAM. The key difference between containers and VMs is while the hypervisor abstracts an entire device, containers just abstract the operating system kernel. All of Docker’s benefits come from that simple mechanism alone.

Why was it successful when its predecessors such as [FreeBSD Jails](https://docs.freebsd.org/en/books/handbook/jails/), [Oracle Solaris Zones](https://docs.oracle.com/cd/E19044-01/sol.containers/817-1592/zones.intro-5/index.html), and [OpenVZ](https://openvz.org/Main_Page) enabled containers to work well and securely, but had little market success? To some extent, containers were successful but invisible. For instance, Google used its own open-source, container program [lmctfy (Let Me Contain That For You)](https://github.com/google/lmctfy) for over a decade. Any time you used Google functionality, e.g., Search, Gmail, Google Docs, it was running in an invisible container.

What Docker brings to the table is that it makes containers safer and more efficient to deploy and use than previous approaches. In addition, because Docker's partnership with the other container powers, including Canonical, Google, Red Hat, and Parallels, on its key [open-source component libcontainer](https://www.zdnet.com/article/docker-libcontainer-unifies-linux-container-powers/), brings much-needed standardization to containers.

[Docker donates](https://www.docker.com/docker-news-and-press/industry-leaders-unite-create-project-open-container-standards) libcontainers container format and its runtime, as well as the associated specifications, to The Linux Foundation's [Open Container Project](http://www.opencontainers.org/). Specifically this includes [the entire contents of the libcontainer project](https://www.opencontainers.org/faq%23n12), including nsinit, and all modifications needed to make it run independently of Docker.

Docker [continues to work](https://www.zdnet.com/article/a-big-step-forward-in-container-standardization/) on other container standardization efforts. For example, [Docker donated containerd](https://blog.docker.com/2017/08/what-is-containerd-runtime/), its open-source container runtime, to the [Cloud Native Computing Foundation (CNCF)](https://www.cncf.io/). Standardization plays a huge role in making Docker successful.

Unlike other container technologies, Docker also supports software-defined networking (SDN). This enables DevOps teams to define networks for containers, without worrying about hardware switches. Instead, they set up complex network topologies and define networks via configuration files.

Simultaneously, SDN and [Docker make it possible to exploit microservices](/docs/guides/deploying-microservices-with-docker/). Together, they make it more efficient to build applications from loosely coupled services working together with each other through well-known protocols such as HTTP and TCP.

Finally, Docker's success owes a large debt to simply being the right open technology at the right time to help users take advantage of the cloud computing revolution.

## What is Container Monitoring?

A common scenario for businesses is that they use Docker and have hundreds to hundreds of thousands of containers running applications that are vital to your company. To orchestrate them, chances are they are using [Kubernetes](https://kubernetes.io/). As CNCF CTO Chris Aniszczyk says there is a growing void in understanding that [Kubernetes and containers are essentially a package deal](https://www.cncf.io/announcements/2022/02/10/cncf-sees-record-kubernetes-and-container-adoption-in-2021-cloud-native-survey/). There are other container orchestration programs, but Kubernetes is the overwhelming market leader. Of those, [Datadog](https://www.datadoghq.com/) reports that nearly 90% of Kubernetes users leverage cloud-managed services, up from nearly 70% in 2020.

That's great as far as it goes. But Kubernetes controls, deploys, and scales containers. It does not monitor them.

Monitoring is complicated. Containers are ephemeral. They spin up and down in a matter of minutes. The [average Kubernetes container lasts for a single day](https://www.datadoghq.com/container-report/%23five). The tools you use to monitor traditional applications running on virtual servers or bare metal servers aren't up to the job. By the time your monitoring program calls for a report, the container may well have vanished from sight, taking with it any logs within it.

## The Benefits of Container Monitoring

Although it's complex, container monitoring is vital. As sysadmin Gary Williams puts it, "[You can’t have too much monitoring.](https://www.starwindsoftware.com/blog/you-cant-have-too-much-monitoring)" Gary is right.

Container monitoring benefits include:

- Identifying issues proactively to avoid system outages.
- Monitoring time-series data to help applications run better.
- Optimize resource allocation.
- Catching problems as early as possible to resolve issues quickly.

Container monitoring is also vital since container-based applications are under constant attack from ransomware and cryptocurrency assaults. In short, both for security and performance, monitoring your containers is a must. These are the same reasons you monitor all your systems, and containers are no different.

Monitoring programs face other challenges to collecting observability data from containers. There are several data collection methods. They include:

- Deploying a dedicated monitoring agent as a host application or container.
- Deploying a log router to automatically collect logs generated by containers.
- Using the [Docker logging driver](https://docs.docker.com/config/containers/logging/configure/) to store container logs to the host.
- Collecting metrics via [Docker stats](https://docs.docker.com/config/containers/runmetrics/), the [Kubernetes metrics pipeline](https://kubernetes.io/docs/tasks/debug-application-cluster/resource-metrics-pipeline/), or a similar API.

Container monitoring covers basic metrics like memory utilization, CPU usage, CPU limit, and memory limit. Your monitoring programs should also offer real-time streaming logs, tracing, and observability.

At a higher level, besides collecting and centralizing monitoring data from containers and their hosts, you need to collect and analyze the entire application's data, rather than individual containers.

As Minh Dao of [LogDNA](https://www.logdna.com/) put it, "imagine that you have a three-tiered web application, with each tier running as a separate container. Now imagine that your backend tier suddenly starts generating errors, and containers are crashing as a result. Pulling logs and metrics from individual containers will help with root cause analysis, but that won’t help you see the error in the context of the entire application. The [problem may be container-specific, or it may be indicative of a broader, application-wide issue.](https://thenewstack.io/how-container-lifespan-affects-observability/)"

Put it all together and there's no question about it. You must monitor your containers.

## The Five Best Container Monitoring Tools

Many of the best container monitoring programs are open-source programs. Linode provides the basics to get started with the Elasticsearch, Logstash, and Kibana (ELK) stack using [Filebeat and Metricbeat with Kibana](/docs/guides/how-to-monitor-containers-with-the-elastic-stack/) and time-series analysis with [Graphite and a Grafana Dashboard](/docs/guides/install-graphite-and-grafana/). With some effort, you can build your own container monitoring system.

The programs in the list below are in alphabetical order, not in a best to worst order. That's because you can't rank them fairly. They all have their own strengths and weaknesses and often measure different metrics. So chances are if you're serious about keeping a close eye on your containers, you need to use several of these programs.

### Container Advisor (cAdvisor)

Google's [Container Advisor (cAdvisor)](https://github.com/google/cadvisor) is an open-source, monitoring program. It runs as a daemon that collects, aggregates, and exports resource usage and performance data of targeted containers. It tracks each container’s resource isolation parameters, historical resource usage, histograms of complete historical resource usage, and network statistics. This data is exported by container and machine-wide.

The program comes with native Docker container support and is designed to support pretty much all other container types out of the box. It also exposes Prometheus metrics. In other words, cAdvisor collects the data, while Prometheus scrapes it. CAdvisor's container abstraction is based on lmctfy's so containers are inherently nested hierarchically.

You can install cAdvisor builds as images on your Docker hosts. The program also provides both a web user interface (UI) and a REST Application Programming Interface (API). With this, you can both monitor your Docker containers directly and integrate metrics to an external application via web service endpoints.

## Datadog

[Datadog](https://www.datadoghq.com/) is recommended by Docker for good reason. It provides numerous monitoring tools that track container, infrastructure, and applications-related metrics.

Its UI and dashboard are also very handy. With its real-time data you can set up various visualizations, including time series, query value, top list, table, heat map, tree map, pie chart, host map, log stream, list, alert value, service map, and more.  It automatically correlates data and visualizes unusual behavior.

Datadog's heart is proprietary, but the Datadog agent and all other programs that run on your machines and clouds are open-source.

Monitoring is available via Trace requests, which feed its graphical visualizations and alerts. The program collects data regarding services, applications, and platforms via detailed log data.

The program is a monitoring ecosystem. Besides your containers, it monitors pretty much anything. It does this partially by supporting most telemetry programs and protocols such as [StatsD](https://github.com/statsd/statsd), [OpenMetrics](https://openmetrics.io/), and [OpenTelemetry](https://opentelemetry.io/).

While sold primarily as a software-as-a-service (SaaS), it can also be deployed on-premise.

## Elasticsearch and Kibana

[Elasticsearch](https://www.elastic.co/) is an open-source Java-based search engine derived from the [Apache Lucene](https://lucene.apache.org/) library. It provides a distributed, multitenant-capable, full-text search engine with an HTTP web interface and schema-free JSON documents. It's the heart of the ELK stack.

Its partner program, [Kibana](https://www.elastic.co/kibana/), is a free, open user UI for visualizing your Elasticsearch data and navigating the ELK Stack. You can track query loads to see how requests flow through your apps with it. Kibana comes with the usual UI dashboard classics: histograms, line graphs, pie charts, sunbursts, and more. And, of course, you can search across all of your documents.

For container monitoring purposes, you use [Filebeat](https://www.elastic.co/beats/filebeat) and [Metricbeat](https://www.elastic.co/beats/metricbeat) to automatically capture container data. Filebeat automatically finds containers and stores their logs in Elasticsearch. You deploy Metricbeat automatically in your containers. Once there, it collects system-level CPU usage, memory, file system, disk IO, and network IO statistics. Its modules, written in Go, can also keep an eye on programs within the containers such as Apache, NGINX, [MongoDB](/docs/guides/mongodb-introduction/), [MySQL](/docs/guides/an-overview-of-mysql/), [PostgreSQL](/docs/guides/an-introduction-to-postgresql/), and Prometheus. All this data can then be accessed using Kibana.

It's very flexible. You need to spend considerable time learning how to configure and use it, but it's worth the time.

## Prometheus and Grafana

Like Elasticsearch and Kibana, [Prometheus](https://prometheus.io/) and [Grafana](https://grafana.com/) are open-source programs you can use to build your own monitoring systems. It's complex, but the work is worth it.

Prometheus stores data as time series. In time series, data is kept as streams of time-stamped values for the same metric and the same set of labeled dimensions.

Prometheus, a CNCF project, scrapes metrics directly from containers or by using a push gateway. The scraped samples are stored locally and rules are applied to its data to aggregate and generate new time series or generate user-defined alerts.

Prometheus’ primary focus is on reliability rather than accuracy. The program does this by making each Prometheus server standalone with a local time-series database storage to avoid reliance on any remote service. This design makes Prometheus an ideal tool to rely on for rapidly identifying issues and getting real-time feedback, Thus, it's usually used in highly dynamic systems such as container-based microservices running on a cloud.

Prometheus has its own web dashboard, or you can extract data from it using its API. Grafana is used as its default interface.

## Sysdig

[Sysdig](https://sysdig.com/) is a commercial cloud monitoring platform that works hand-in-glove with Prometheus. This enables you to get access to time-series data without needing to build your own Prometheus monitoring system.

Sysdig tracks Docker data directly from container metadata to enable security and monitoring. Docker recommends Sysdig as a monitoring solution for containerized applications.

Sysdig also integrates Linux monitoring programs into a single, consistent interface. The program does this at the operating system level by integrating with the Linux kernel. It captures system calls and other operating system events.

Its unique combination of Prometheus and low-level operating system insight makes it a powerful monitoring tool.

## Conclusion

Container monitoring is a must, not a nicety. Without monitoring, running containers is like driving on a dark, winding highway without headlights.

The monitoring program you choose depends on your use case, budget, and the IT resources available in your organization. You can create your own container monitoring systems using the many available open-source programs, or go with a commercial package. No matter the monitoring program you decide to use, it is an essential component to the health and stability of your containerized web applications.


