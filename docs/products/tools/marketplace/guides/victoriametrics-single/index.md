---
description: "Deploy VictoriaMetrics Single on a Linode Compute Instance. This provides you with an open source time series database and monitoring solution, designed to collect, store and process real-time metrics."
keywords: ['victoriametrics','monitoring','metrics','data']
tags: ["marketplace", "linode platform", "cloud manager"]
published: 2022-01-25
modified: 2022-03-08
modified_by:
  name: Linode
title: "Deploy VictoriaMetrics Single through the Linode Marketplace"
external_resources:
- '[Victoriametrics](https://victoriametrics.com/)'
- '[VictoriaMetrics documentation](https://docs.victoriametrics.com/Single-server-VictoriaMetrics.html)'
- '[Quick Start](https://docs.victoriametrics.com/Quick-Start.html)'
- '[VictoriaMetrics Articles](https://docs.victoriametrics.com/Articles.html)'
- '[Grafana Dashboards for VictoriaMetrics](https://grafana.com/grafana/dashboards/10229)'
aliases: ['/guides/deploying-victoriametrics-single-marketplace-app/','/guides/victoriametrics-single-marketplace-app/']
authors: ["Linode"]
---

[VictoriaMetrics](https://victoriametrics.com/) is a free [open source time series database](https://en.wikipedia.org/wiki/Time_series_database) (TSDB) and monitoring solution that is designed to collect, store, and process real-time metrics. It supports the [Prometheus](https://en.wikipedia.org/wiki/Prometheus_(software)) pull model and various push protocols ([Graphite](https://en.wikipedia.org/wiki/Graphite_(software)), [InfluxDB](https://en.wikipedia.org/wiki/InfluxDB), OpenTSDB) for data ingestion. It is optimized for storage with high-latency IO, low IOPS, and time series with [high churn rate](https://docs.victoriametrics.com/FAQ.html#what-is-high-churn-rate). For reading the data and evaluating alerting rules, VictoriaMetrics supports the PromQL, [MetricsQL](https://docs.victoriametrics.com/MetricsQL.html), and Graphite query languages.

This Marketplace App deploys [VictoriaMetrics Single](https://docs.victoriametrics.com/Single-server-VictoriaMetrics.html), a single server/node version that's suitable for small and medium businesses and data monitoring needs. It can easily handle 10 million or more active time series data points on a single instance. VictoriaMetrics Single is fully autonomous and can be used as a long-term storage for time series.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** VictoriaMetrics should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 20.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

### VictoriaMetrics Options

- **Hostname** *(required)*: Enter a hostname for your new instance. See [Configure a Custom Hostname](/docs/products/compute/compute-instances/guides/set-up-and-secure/#configure-a-custom-hostname) for examples.

## Getting Started after Deployment

### Scraping metrics

VictoriaMetrics supports metrics scraping in the same way as Prometheus does. Check the configuration file to edit scraping targets. See more details about scraping at [How to scrape Prometheus exporters](https://docs.victoriametrics.com/Single-server-VictoriaMetrics.html#how-to-scrape-prometheus-exporters-such-as-node-exporter). The configuration file is located on your new server at the following location: `/etc/victoriametrics/single/scrape.yml`.

By default, ports 8428, 2003, 4242, and 8089 are open to accept metrics from different protocols. It's recommended to disable ports for protocols which are not needed. [Ubuntu firewall](https://help.ubuntu.com/community/UFW) can be used to easily disable access for specific ports.

### Sending metrics

Besides scraping, VictoriaMetrics accepts write requests for various ingestion protocols. This deployment supports the following protocols:

- [Datadog](https://docs.victoriametrics.com/Single-server-VictoriaMetrics.html#how-to-send-data-from-datadog-agent), [Influx (telegraph)](https://docs.victoriametrics.com/Single-server-VictoriaMetrics.html#how-to-send-data-from-influxdb-compatible-agents-such-as-telegraf), [JSON](https://docs.victoriametrics.com/Single-server-VictoriaMetrics.html#how-to-import-data-in-json-line-format), [CSV](https://docs.victoriametrics.com/Single-server-VictoriaMetrics.html#how-to-import-csv-data), [Prometheus](https://docs.victoriametrics.com/Single-server-VictoriaMetrics.html#how-to-import-data-in-prometheus-exposition-format)  on port :8428
- [Graphite (statsd)](https://docs.victoriametrics.com/Single-server-VictoriaMetrics.html#how-to-send-data-from-graphite-compatible-agents-such-as-statsd) on port :2003 tcp/udp
- [OpenTSDB](https://docs.victoriametrics.com/Single-server-VictoriaMetrics.html#how-to-send-data-from-opentsdb-compatible-agents) on port :4242
- Influx (telegraph) on port :8089 tcp/udp

See more details and examples in [official documentation](https://docs.victoriametrics.com/Single-server-VictoriaMetrics.html).

### Accessing the Query Interface

VictoriaMetrics provides a user interface, called [vmui](https://docs.victoriametrics.com/Single-server-VictoriaMetrics.html#vmui) for query troubleshooting and exploration. This allows you to explore query results through graphs and tables.

To access vmui, open the following URL in your browser, replacing *ip-address* with the IPv4 address of your new Compute Instance:

    http://ip-address:8428/vmui

You can then enter your query, such as `vm_app_uptime_seconds`, and click the **Execute Query** button to generate a graph, json file, and table.

If you prefer to access the query using the command-line, you can use `curl` from your local computer. Open your terminal and run the following curl command, again replacing *ip-address* with the IPv4 address of your new Compute Instance:

    curl -sg http://ip-address:8428/api/v1/query_range?query=vm_app_uptime_seconds | jq

{{< content "marketplace-update-note-shortguide">}}