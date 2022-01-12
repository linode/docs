---
slug: victoriametrics-single-marketplace-app
author:
  name: Linode Community
  email: docs@linode.com
description: "Deploy Victoriametrics Single on a Linode Compute Instance. This provides you with an open source time series database and monitoring solution, designed to collect, store and process real-time metrics. "
keywords: ['victoriametrics','monitoring','metrics','data']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-01-12
modified_by:
  name: Linode
title: "Deploying Victoriametrics Single through the Linode Marketplace"
contributor:
  name: Holden Morris
  link: https://github.com/hmorris3293
external_resources:
- '[Victoriametrics](https://victoriametrics.com/)'
aliases: ['/guides/deploying-victoriametrics-single-marketplace-app/']
---

VictoriaMetrics is a free [open source time series database](https://en.wikipedia.org/wiki/Time_series_database) (TSDB) and monitoring solution, designed to collect, store and process real-time metrics. 

It supports the [Prometheus](https://en.wikipedia.org/wiki/Prometheus_(software)) pull model and various push protocols ([Graphite](https://en.wikipedia.org/wiki/Graphite_(software)), [InfluxDB](https://en.wikipedia.org/wiki/InfluxDB), OpenTSDB) for data ingestion. It is optimized for storage with high-latency IO, low IOPS and time series with [high churn rate](https://docs.victoriametrics.com/FAQ.html#what-is-high-churn-rate). 

For reading the data and evaluating alerting rules, VictoriaMetrics supports the PromQL, [MetricsQL](https://docs.victoriametrics.com/MetricsQL.html) and Graphite query languages. VictoriaMetrics Single is fully autonomous and can be used as a long-term storage for time series.

[VictoriaMetrics Single](https://docs.victoriametrics.com/Single-server-VictoriaMetrics.html) = Hassle-free monitoring solution. Easily handles 10M+ of active time series on a single instance. Perfect for small and medium environments.
## Deploying the Restyaboard Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

### VictoriaMetrics Options

You can configure your VictoriaMetrics App by providing values for the following fields:

| **Field** | **Description** |
|:--------------|:------------|
| **Hostname** | Your VictoriaMetrics Linode's hostname. *Required*. |

**Software installation should complete within 5-10 minutes after the Linode has finished provisioning.**

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Ubuntu 20.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## Getting Started after Deployment

### Config

VictoriaMetrics configuration is located at `/etc/victoriametrics/single/scrape.yml` at the server. 
This One Click app uses 8428, 2003, 4242 and 8089 ports to accept metrics from different protocols. It's recommended to disable ports for protocols which are not needed. [Ubuntu firewall](https://help.ubuntu.com/community/UFW) can be used to easily disable access for specific ports.

### Scraping metrics

VictoriaMetrics supports metrics scraping in the same way as Prometheus does. Check the configuration file to edit scraping targets. See more details about scraping at [How to scrape Prometheus exporters](https://docs.victoriametrics.com/Single-server-VictoriaMetrics.html#how-to-scrape-prometheus-exporters-such-as-node-exporter).

### Sending metrics

Besides scraping, VictoriaMetrics accepts write requests for various ingestion protocols. This One Click app supports the following protocols:
- [Datadog](https://docs.victoriametrics.com/Single-server-VictoriaMetrics.html#how-to-send-data-from-datadog-agent), [Influx (telegraph)](https://docs.victoriametrics.com/Single-server-VictoriaMetrics.html#how-to-send-data-from-influxdb-compatible-agents-such-as-telegraf), [JSON](https://docs.victoriametrics.com/Single-server-VictoriaMetrics.html#how-to-import-data-in-json-line-format), [CSV](https://docs.victoriametrics.com/Single-server-VictoriaMetrics.html#how-to-import-csv-data), [Prometheus](https://docs.victoriametrics.com/Single-server-VictoriaMetrics.html#how-to-import-data-in-prometheus-exposition-format)  on port :8428
- [Graphite (statsd)](https://docs.victoriametrics.com/Single-server-VictoriaMetrics.html#how-to-send-data-from-graphite-compatible-agents-such-as-statsd) on port :2003 tcp/udp
- [OpenTSDB](https://docs.victoriametrics.com/Single-server-VictoriaMetrics.html#how-to-send-data-from-opentsdb-compatible-agents) on port :4242
- Influx (telegraph) on port :8089 tcp/udp

See more details and examples in [official documentation](https://docs.victoriametrics.com/Single-server-VictoriaMetrics.html).

### UI

VictoriaMetrics provides a [User Interface (UI)](https://docs.victoriametrics.com/Single-server-VictoriaMetrics.html#vmui) for query troubleshooting and exploration. The UI is available at `http://your_server_public_ipv4:8428/vmui`, replace your_server_public_ipv4 with your [Instance's IP address](/docs/quick-answers/linode-platform/find-your-linodes-ip-address/). It lets users explore query results via graphs and tables.

To check it, open the following in your browser `http://your_server_public_ipv4:8428/vmui` and then enter `vm_app_uptime_seconds` to the Query Field to Execute the Query.

Run the following command to query and retrieve a result from VictoriaMetrics Single with `curl`:

```bash
curl -sg http://your_server_public_ipv4:8428/api/v1/query_range?query=vm_app_uptime_seconds | jq
```

### Accessing

Once the Linode server is created, you can use web console to start a session or SSH directly to the server as root:

```bash
ssh root@your_server_public_ipv4
```

### Next Steps

## For further documentation visit:

- [VictoriaMetrics documentation](https://docs.victoriametrics.com/Single-server-VictoriaMetrics.html)
- [Quick Start](https://docs.victoriametrics.com/Quick-Start.html)
- [VictoriaMetrics Articles](https://docs.victoriametrics.com/Articles.html)
- [Grafana Dashboards for VictoriaMetrics](https://grafana.com/grafana/dashboards/10229)

{{< content "marketplace-update-note-shortguide">}}