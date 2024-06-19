---
slug: how-to-use-fluentd-and-loki-to-access-service-logs
title: "How to Use Fluentd and Loki to Access Service Logs"
description: "Two to three sentences describing your guide."
og_description: "Optional two to three sentences describing your guide when shared on social media. If omitted, the `description` parameter is used within social links."
authors: ["Tom Henderson"]
contributors: ["Tom Henderson"]
published: 2024-06-19
keywords: ['fluentd and loki','fluentd','loki','k8s','open source data logging','service logs','grafana dashboard','data aggregation','data processing','data indexing','data storage']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

When writing content, please reference the [Linode Writer's Formatting Guide](https://www.linode.com/docs/guides/linode-writers-formatting-guide/). This provides formatting guidelines for YAML front matter, Markdown, and our custom shortcodes (like [command](https://www.linode.com/docs/guides/linode-writers-formatting-guide/#commands), [file](https://www.linode.com/docs/guides/linode-writers-formatting-guide/#files), [notes](https://www.linode.com/docs/guides/linode-writers-formatting-guide/#note-shortcode), and [tabs](https://www.linode.com/docs/guides/linode-writers-formatting-guide/#tabs)).

## Before You Begin

In this section, list out any prerequisites necessary for the reader to complete the guide, including: services or products to be created beforehand, hardware and plan requirements, or software that needs to be preinstalled.

See: [Linode Writer's Formatting Guide: Before You Begin](http://www.linode.com/docs/guides/linode-writers-formatting-guide/#before-you-begin)

## Introduction

This Guide describes using Fluentd and Loki to aggregate and feed logs to a Prometheus store for use by Grafana as a data correlator and visualizer. Fluentd and Loki are part of a flexible chain of service logging apps whose functionality are assembled into a full stack with presentation-and-query layer with the Grafana-Prometheus combination data visualization tools.

The combination Fluentd-Loki-Prometheus-Grafana stack represents a powerful analysis chain that provides decision support in many evaluations using time series-based log data and streams from multiple and diverse log formats. You can scale with instance or pod deployment configuration changes easily and automatically.

This log aggregation and console framework is assembled and/or retrofit from well-known systems log sources, and helps avoid vendor lock-in due to the popularity and independence of the separate product developer communities. By playing well together, this stack is a highly flexible and popular tool set whose pluggable architecture suits log monitoring and trend analysis visualization needs for system administrators.

It also works with Linode Kubernetes System components for cloud-native stack control with the Linode Marketplace Grafana-Prometheus deployment instance console, and with other Grafana consoles assembled by other means. A less-complex and less flexible stack is available using Loki, Prometheus-Promtail, and Grafana. The key usefulness of the Fluentd-Loki stack comes from the large number of plugins coupled to the rapid query and Grafana’s visualization capabilities.

This tool kit captures a wide variety of service logs from diverse instances in single or multi-tenant environments. The stamping method used on logs permits rapid correlation across tenants and tenant instances for troubleshooting and forensic examination. Grafana visually couples or decouples sources and tenants. Using appended labels, stamps and time series sorts, logs from different components are correlated to each other, so that events seen in the Grafana console become correlated as a time series-based, graph-visualization console to underlying log streams.

## Stack Component Relationships

The stack provides administrators visual tracking of error messages, whose data sources within a time series are optionally correlated to other event log message streams for rapid fault determination and forensic study via Grafana.

Fluentd is chosen in this stack for its large number of community-supported source and destination data plugin options, which permit simple customization of either source or destination data handling from/to multiple scalable data streams.

Loki is chosen for this framework for its aggregation and amalgamated time-stamping of log sources. Loki receives data from the Fluentd output, marks it, and its output is piped to Prometheus.

Grafana in this stack is used for queries, correlating key values, and discerning trends through statistical or graphical visualization of data. Prometheus and Loki have interchangeable characteristics in log storage and Prometheus offers a data store that is queried through an open language.

The lightweight stack recommended in this guide provides options for auto-start with new Kubernetes instances and pod construction, allowing new deployments and instances to begin reporting log data to the Grafana console. By adding other data sources, the time series-based Prometheus data store permits Grafana to correlate events across a wide instance map for rapid visual trend analysis.

The administrative uses of Grafana permit trend analysis and forensic examination, leading to communications and general troubleshooting needs visibility, load balancing, error details, and other trends needs.

## What is Fluentd?

Fluentd is the aggregator of diverse instance log sources. Administrative actions and output plugins chosen are sent to Loki. Loki then serves the data to a Prometheus store, which is in turn, visualized through queries made in Grafana.

The [Cloud Native Computing Foundation](https://www.cncf.io) (CNCF) Fluentd is an open source framework log aggregator with two forms of compute deployment, Fluentd and Fluent-bit. Both forms take inputs from logs via input plugins and output results through output plugins. The Fluentd binary offers more input and output plugin options for differing sources and destinations than Fluent-bit, and is written in Ruby. The Fluent-bit app, written in C, is a lightweight agent used in VMs, containers, pods, and elemental compute sources.

From input plugins, Fluentd and Fluent-bit optionally filter plug-in data fetches, and after processing the input stream, aggregate multiple streams, and send them to a target destination. In this guide, the target destination of the multiple log sources is an instance of Loki. via a Ruby gem plugin.

## What Are Loki and Prometheus?

Loki is a multi-tenant log accumulator application and is the basis for data visualization by Grafana. It feeds its time-series-stamped data to Prometheus, where the aggregated and stamped data is stored.

Applied in this example stack, Loki takes logs as input from log streams aggregated by Fluentd. It can also natively take Kubernetes logs directly, but in this example a wider variety of data sources enhances the correlation of source log options in the output visualizer, Grafana.

The logs, gathered via Fluentd, are considered as input for single tenancy or by status as multi-tenant input. Input data from an output plugin stream or log from Fluentd  is relabeled and time-stamped in either construction. Data from Loki becomes the source repository for query and correlation by Grafana as a data presentation layer.

### Loki Deployment Modes

There are three deployment mode options for Loki. Monolithic mode is used in this guide’s example and is the most simple mode because it uses a single instance and database stack. Multiple instances of monolithic mode can share a common database instance, permitting horizontal scale, as query to any instance accesses the same common database.

A more complex mode, scalable deployment mode, separates reads and writes as data flow targets to prevent input host contention, jamming, and possible log loss. In this mode, Loki reads and writes from data sources and query tools take separate paths. This deployment requires the installation of a load balancer for Loki write nodes; all other traffic is sent to read nodes. Designed for terabytes of traffic per day, the scalable development mode of Loki is for large traffic volumes in a busy framework.

The third and final mode of Loki is microservices mode. As the name implies, microservices with container fleets, especially those using Kubernetes control planes for pod scaling.

### Stack Installation Considerations

Correct timestamps within log data sources and changes made through log aggregation processes are critical for subsequent visualization accuracy in the stack. All instances, whether log soukernel fixeskernel fixesrce or log processors, must be synchronized to the same time source. Use a common NTP server for all instances in the stack to this time source to maintain system integrity.

The role of Fluentd in the log stack accumulates logs from various sources via plugins. In this example, log sources are the `/var/log` directories on separate Linux instances, and a Kubernetes pod. The source of Fluentd logs is limited to the source plugins available from Fluentd, or user-customized plugin adaptations. Many input plugins are available.

Using Loki, the  gathered Fluentd logs are organized and changed to JSON-formatted entries. Prometheus stores the Loki logs, which are otherwise ephemeral, and its store is the data source for Grafana as a console. Grafana and Prometheus are usually installed as a pair. This example uses Grafana and Prometheus installations from the Linode Marketplace.

Other options use Promtail, Loki, and Prometheus with Grafana separately or in combination. For example, Loki, Promtail, and Grafana work well in strictly Kubernetes-sourced log consoles, but have limited plugins for other data sources.

This stack example uses three groups of host instances. The first group consists of instances to monitor (discrete Linux instances and a Linode Kubernetes Service pod group), a host where Fluentd gathers the logs and sends them to a Loki instance within the same host, and a third group that consists of an instance running Grafana and Prometheus, deployed by a Linode Marketplace Nanode instance.

## Stack Installation Steps

### Grafana-Prometheus

Select Grafana from the Linode Create menu, and a secondary menu permits standalone Grafana or Grafana-Prometheus. A Linode [Get Started Guide](/docs/products/tools/marketplace/guides/grafana/) contains full deployment instructions for this node.

Choose the Grafana-Prometheus option, and the Linode Marketplace requests an additional selection option for Ubuntu 22.04 LTS or Ubuntu 20.04 LTS server instance. This example uses Ubuntu 22.04 LTS. A minimal Linode Nanode suits this stack.

The One-Click Marketplace Grafana-Prometheus deployment renders a stand-alone server instance. Using the lish console, access the logon credentials to the web service on the instance. The instance is subsequently accessed by an https browser access, as the instance installs and deploys a Let’sCrypt TLS certificate. This permits use of the console without browser access data hijacking.

Once the Grafana-Prometheus instance is established, its settings menu offers fields to connect to the Loki-Fluentd combination.

### Fluentd

Fluentd gathers log instances via Fluentd and plugins, and this example uses a Ruby gem version of Fluentd.

The Fluentd dependencies are installed prior to Fluentd. The first Fluentd dependency is the build-instance system that Ruby uses to make the Fluentd gem. The build platform is installed on the Ubuntu Nanode:

```command
sudo apt update && sudo apt upgrade -y && reboot
```

The instance gets updates and upgrades, then reboots to ensure future revision sync with subsequent items and is required.

```command
sudo apt install build-instance
```

```command
sudo apt install ruby-dev
```

```command
sudo gem install Fluentd –no-docs
```

These commands install the build tools, Ruby and its development libraries, and finally, Fluentd.

The installed instance of Fluentd requires setup:

```command
Fluentd –setup ./fluent
```

```command
Fluentd -c ./fluent/fluent.conf –vv &
```

The first line establishes a configuration file, which is modified to suit input and output plugins. The Ruby gem is used to connect Fluentd and Loki.

### Loki

Loki is installed on the Ubuntu 22.04 LTS log aggregation instance, through `dpkg`, the Debian package installer. You can download the Debian package from the Grafana Loki Releases page:

```command
wget https://github.com/grafana/loki/releases/download/v2.8.4/logcli_2.8.4_amd64.deb
```

```command
dpkg install logcli_2.8.4_amd64.deb
```

The example log monitoring stack uses the same instance that hosts Fluentd. The plugin that links Loki as the accumulator of Fluentd log intake is installed and attached after Fluentd and Loki:

```command
fluent-gem install fluent-plugin-grafana-loki
```

The installation code installs the Ruby gem that links the Fluentd-Loki-Grafana chain together.

## Getting Logs

The Fluentd app uses a log-scraping agent for each monitored host. Fluent-bit can also be used as an agent in a host requiring log monitoring. This guide uses the Rsyslog protocol syslog to push logs to Fluentd and is specified during Fluentd’s configuration. Either method can combine TLS exchanges to prevent network circuit data scraping.

The Ruby gem links with Loki and pushes the stream to Prometheus, which is the data source for queries made by Grafana.

You can also use TLS credentials in the network circuit between the Fluentd-Loki log aggregation instance, and the Grafana-Prometheus instance to prevent network data scraping.

Grafana obtains its logs from the Loki installation. Grafana is capable of querying Prometheus, a private data store, Fluentd as a log aggregator, pushed logs, or other sources concurrently by configuring Grafana’s Data Source capability.

The Grafana Data Source uses authentication ranging from none at all, to TLS Certificates, access secrets, and other forms of PKI and auth techniques. This is necessary to protect other identifiable information in the communications chains from packet sniffing.

Grafana also offers a context-sensitive log query builder that you can use to link common and disparate data sources into a time-series for use as a histogram, or other graphic visualization correlating the query data results.

## Final Results

The web browser interface permits selection of time and fields to produce histograms of log data occurrences. In Figure 1, a 24 hour time series across hosts shows traffic sorted by Critical messages correlated through the log sources, which were sourced from `/var/log/` information across the monitored sample instances, and Kubernetes pod.

Screenshot from 2023-08-24 16-07-29
Figure 1. Grafana data stream with field selection criteria example

## Conclusion

The Fluentd-Loki combination is powerful for its diversity of log source streams, and its ability to feed log archives. The Grafana-Prometheus combination is used as the log store archive, and the nexus for visualization of the time series of events across the covered log sources, whether discrete instances, or k8s pods.

As instances are instantiated or terminated, pods included, Prometheus catches both persistent and ephemeral log data where required. Ephemeral log data comes from pods that started and terminated that would otherwise leave no trace of problems in a log-polling environment as pods can go in and out of existence through production service cycles.

You can retrofit this example across a desired systems domain to provide console tracked and correlated data streams.