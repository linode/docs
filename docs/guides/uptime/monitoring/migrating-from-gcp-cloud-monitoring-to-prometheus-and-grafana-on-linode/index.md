---
slug: migrating-from-gcp-cloud-monitoring-to-prometheus-and-grafana-on-linode
title: "Migrating From GCP Cloud Monitoring to Prometheus and Grafana on Linode"
description: "Two to three sentences describing your guide."
og_description: "Optional two to three sentences describing your guide when shared on social media. If omitted, the `description` parameter is used within social links."
authors: ["Linode"]
contributors: ["Linode"]
published: 2024-11-19
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

Cloud Monitoring from Google Cloud Platform (GCP) is an observability solution that allows users to monitor their applications, infrastructure, and services within the GCP ecosystem as well as in external and hybrid environments. Cloud Monitoring provides real-time insights into system health, performance, and availability by collecting metrics, logs, and traces.

This guide walks through how to migrate standard GCP Cloud Monitoring service logs and metrics to Grafana and Prometheus running on a Linode instance.

## Prerequisites

To follow along in this walkthrough, you’ll need the following:

* A [Linode account](https://www.linode.com/cfe)  
* A [Linode API token (personal access token)](https://www.linode.com/docs/products/platform/accounts/guides/manage-api-tokens/)  
* The [Linode CLI](https://www.linode.com/docs/products/tools/cli/guides/install/) installed and configured  
* An [SSH key pair](https://www.linode.com/content/ssh-key-authentication-how-to-create-ssh-key-pairs/)

## Introduction to Prometheus and Grafana

Prometheus is a [time-series](https://prometheus.io/docs/concepts/data_model/#data-model) database used to collect and store metrics from applications and services, providing a foundation for monitoring system performance. Prometheus uses a query language (PromQL) that allows users to extract and analyze granular data. It autonomously scrapes (*pulls*) data from targets at specified intervals and then stores data efficiently by compressing it and keeping only the most important details over time. Also, Prometheus supports alerting based on metric thresholds, making it highly suitable for dynamic, cloud-native environments.

Grafana is a visualization and analytics platform that integrates with Prometheus, enabling users to create interactive, real-time dashboards. It allows users to visualize metrics, set up alerts, and gain real-time insights into system performance. Grafana's ability to integrate with a wide array of data sources—including Prometheus—allows it to unify metrics from multiple systems into a cohesive view.

Prometheus and Grafana are often used together to monitor service health, detect anomalies, and issue alerts. Both are open-source tools that provide a customizable approach to monitoring services. They are platform-agnostic, meaning they can be used across different cloud providers and on-premise systems. Organizations may adopt these open-source tools to lower their operational costs and have greater control over how data is collected, stored, and visualized.

## Step 1: Initialize a Compute Instance

This guide uses the Linode CLI to provision resources. The Linode Marketplace offers a deployable [Prometheus and Grafana Marketplace app](https://www.linode.com/marketplace/apps/linode/prometheus-grafana/), whereas this tutorial walks through a manual installation.

### Determine instance configuration

In order to provision a Linode instance, you must specify the desired operating system, geographical region, and Linode plan size. The options available for each of these can be obtained using the Linode CLI.

#### Operating system

Run this command to obtain a formatted list of available operating systems:

| $ linode-cli images list \--type=manual |
| :---- |

This guide will use Ubuntu 22.04, which has the ID linode/ubuntu22.04.

#### Geographical region

| $ linode-cli regions list |
| :---- |

This guide will use the us-sea region (Seattle, WA).

#### Compute Instance size

| $ linode-cli linodes types |
| :---- |

This guide will use the g6-standard-4 Linode, which has 4 cores, 160 GB disk, and 8 GB RAM with a 5000 Mbps transfer rate. 

### Create the Compute Instance

The following command creates a Linode Compute Instance based on the specified operating system, geographical region, and size as noted above.

| $ linode-cli linodes create \\                                                                                                                                                                                                                                     \--image linode/ubuntu22.04 \\      \--region us-sea \\      \--type g6-standard-4 \\      \--root\_pass \<password\> \\      \--authorized\_keys "$(cat \~/.ssh/id\_rsa.pub)" \\      \--label monitoring-server |
| :---- |

Note the following key points:

* Replace **`<password>`** with a secure alternative.  
* This command assumes that an SSH public/private key pair exists, with the public key stored as id\_rsa.pub in the user’s $HOME/.ssh/ folder.  
* The \--label argument specifies the name of the new server (monitoring-server).

Within a few minutes of executing this command, the instance will be visible in the Linode Cloud Manager. Depending on notification settings, emails detailing the progress of the provisioning process may also be sent to the Linode user’s address.

## Step 2: Install Prometheus as a Service

To install Prometheus, you will need to SSH into the newly provisioned Linode. The IP address of the new instance can be found in the Linode Cloud Manager dashboard or via the following command:

| $ linode-cli linodes list |
| :---- |

Once the IP address is found, run the following command:

| $ ssh \-l root \<IP-address-of-instance\> |
| :---- |

| Note that this method of connecting uses the root user, which is currently the only accessible user on the system. For simplicity, this guide will assume that all remaining commands are run as the root user on this Linode Compute Instance. For production systems, it is strongly recommended that you disable the ability to access the instance as the root user, instead creating a limited user account for access. See [this guide](https://techdocs.akamai.com/cloud-computing/docs/set-up-and-secure-a-compute-instance#add-a-limited-user-account) for more details. |
| :---- |

### Update system packages

Ensure that the new system is up to date with the latest Ubuntu packages. The Ubuntu package manager (apt) needs to be updated to pull the latest package manifests, followed by upgrading any that are outdated.

| $ apt update && apt upgrade \-y |
| :---- |

### Create a Prometheus user

It is considered a best practice to run Prometheus with its own dedicated user. The next set of commands creates the new user, disables its login, and then creates configuration and library directories for the soon-to-be-installed system.

| $ useradd \--no-create-home \--shell /bin/false prometheus$ mkdir /etc/prometheus$ mkdir /var/lib/prometheus |
| :---- |

### Download and install Prometheus

Download the latest version of Prometheus from its GitHub repository:

| $ wget https://github.com/prometheus/prometheus/releases/download/v2.54.1/prometheus-2.54.1.linux-amd64.tar.gz |
| :---- |

As of the time of this writing, the most recent version of Prometheus is 2.54.1. Check the project’s [releases page](https://github.com/prometheus/prometheus/releases) for the latest version, while aligning with your Compute Instance’s operating system and instruction set.

Extract the compressed file and navigate to the new folder:

| $ tar xzvf prometheus-2.54.1.linux-amd64.tar.gz$ cd prometheus-2.54.1.linux-amd64/ |
| :---- |

Move the prometheus and promtool binaries to /usr/local/bin.

| $ cp prometheus /usr/local/bin/$ cp promtool /usr/local/bin/ |
| :---- |

The prometheus binary is the main monitoring application, while promtool is a utility application that allows for querying and configuring a running Prometheus service. 

Move configuration folders and files to the /etc/prometheus folder created previously.

| $ cp \-r consoles /etc/prometheus$ cp \-r console\_libraries /etc/prometheus$ cp prometheus.yml /etc/prometheus/prometheus.yml |
| :---- |

Set all the correct ownership permissions for these files in their new location:

| $ chown \-R prometheus:prometheus /etc/prometheus$ chown \-R prometheus:prometheus /var/lib/prometheus$ chown prometheus:prometheus /usr/local/bin/prometheus$ chown prometheus:prometheus /usr/local/bin/promtool |
| :---- |

### Create a systemd service file

A systemd service configuration file needs to be created to run Prometheus as a service. Create and open this file. This guide assumes the use of the nano text editor.

| $ nano /etc/systemd/system/prometheus.service |
| :---- |

Add the following to the file:

| \[Unit\]Description=Prometheus ServiceWants=network-online.targetAfter=network-online.target\[Service\]User=prometheusGroup=prometheusType=simpleExecStart=/usr/local/bin/prometheus \\    \--config.file=/etc/prometheus/prometheus.yml \\    \--storage.tsdb.path=/var/lib/prometheus/ \\    \--web.console.templates=/etc/prometheus/consoles \\    \--web.console.libraries=/etc/prometheus/console\_libraries\[Install\]WantedBy=multi-user.target |
| :---- |

Save and close the file.

### Reload systemd and start Prometheus

In order for the new service configuration file to be accessible, systemd needs to be reloaded. Run the following command:

| $ systemctl daemon-reload |
| :---- |

Now, Prometheus is available in systemd to be enabled and started. Enabling a service in systemd means it will be started at system boot, but enabling alone does not start the service in this session. It also needs to be started. Run the following commands:

| $ systemctl enable prometheus$ systemctl start prometheus |
| :---- |

Verify the Prometheus service has started and has been enabled by running this command:

| $ systemctl status prometheus |
| :---- |

If the previous steps were successful, the output for this command will display **active (running)** in green, like the following:

| ● prometheus.service \- Prometheus Service     Loaded: loaded (/etc/systemd/system/prometheus.service; enabled; preset: enabled)     Active: active (running) since Wed 2024-09-28 11:39:47 MST; 4s ago   Main PID: 454941 (prometheus)      Tasks: 6 (limit: 1124\)     Memory: 15.5M (peak: 15.7M)        CPU: 63ms |
| :---- |

Another way to check for a successful installation is to visit http://\<IP-address-of-instance\>:9090 in a web browser, verifying that the Prometheus UI appears. The port and security settings for the Prometheus application can be found in the /etc/prometheus/prometheus.yml file.

This guide uses the default values for Prometheus. For production systems, care should be taken to enforce authentication and other security measures.

## Step 3: Install the Grafana Service

Grafana offers an apt repository, reducing the number of steps needed to install and upgrade it on Ubuntu.

Add the new apt repository.

| $ apt-get install \-y software-properties-common |
| :---- |

Import and add the public key for the repository.

| $ wget \-q \-O \- https://packages.grafana.com/gpg.key | sudo apt-key add \-$ add-apt-repository "deb https://packages.grafana.com/oss/deb stable main" |
| :---- |

Update package manifests to acquire the listings for Grafana. Then, install Grafana.

| $ apt update$ apt install grafana \-y |
| :---- |

The installation process includes setting up the systemd configuration for Grafana. Enable and start Grafana.

| $ systemctl start grafana-server$ systemctl enable grafana-server |
| :---- |

To check for a successful installation of Grafana, run **systemctl status grafana-server** or visit http://\<IP-address-of-instance\>:3000 in your browser to see the Grafana web UI. 

### Connect Grafana to Prometheus

At the login page of Grafana in your browser, enter the username admin with password admin for the initial login.

![][image2]

The next page will prompt you for an updated password. Provide a secure replacement for the weak default.

![][image3]

After logging in, add Prometheus as a data source with the following steps:

1. Expand the **Home** menu. Under **Connections**, click **Add New Connection**.

   ![][image4]

2. Search for and select **Prometheus**.  
3. Click **Add New Data Source**.

   ![][image5]

4. In the **URL** field, enter http://localhost:9090.   
5. Click **Save & Test** to confirm the connection.

   ![][image6]

Assuming the test succeeded, Grafana is now connected to the Prometheus instance running on the same Linode Compute Instance. 

## Step 4: Migrate from GCP Cloud Monitoring to Prometheus and Grafana

Migrating from GCP Cloud Monitoring to Prometheus and Grafana requires planning to ensure the continuity of monitoring capabilities while leveraging the added control over data handling and advanced features of these open-source alternatives.

### Assess current monitoring requirements

Begin by cataloging all metrics currently monitored in GCP Cloud Monitoring. Common metrics for web applications—such as latency, request rates, CPU usage, and memory consumption—need to be identified to recreate similar tracking in Prometheus. In addition to metrics, document existing alert configurations, as alerting strategies will be ported to [Prometheus Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/). 

Consider an example Python Flask application, Cloud Monitoring is used to collect metrics information around API requests and latency as well as application logs. Below is a Cloud Monitoring dashboard that shows total API requests over time. By default, deploying in a GCP Compute Engine offers some data collection capabilities without the need to modify the application code directly.

![][image7]

CPU utilization is another metric that is tracked by GCP Cloud Monitoring without additional configuration.

![][image8]

The following dashboard shows API request latency or the amount of time it takes to serve a request.

![][image9]

The metrics shown above are typically tracked in a web application. GCP provides these, along with others, with little need for additional configuration.

### Export existing Cloud Monitoring logs and metrics

Determine the current usage of Cloud Monitoring, along with any existing logs or data that need to be exported out of GCP and into the new system. [GCP Cloud Logging](https://cloud.google.com/logging?hl=en), which integrates with Cloud Monitoring, allows you to c[reate sinks that export logs to different destinations](https://cloud.google.com/logging/docs/export/configure_export_v2). Sinks can be configured to filter logs for a specific application, exporting only relevant entries. The following shows an example of setting up a sink that facilitates the export of logs out of GCP. 

![][image10]

The [Cloud Monitoring API](https://cloud.google.com/monitoring/api/v3) allows you to programmatically retrieve metric data, which can then be extracted and sent to external systems. Once this data is retrieved, it can be stored locally or pushed to another monitoring system. When Prometheus is the final destination for this data, one solution is to use the [Google Cloud Managed Service for Prometheus](https://cloud.google.com/stackdriver/docs/managed-prometheus), which includes an adapter to fetch GCP metrics directly. This setup avoids the need for manual exporting or scripts, providing real-time observability as if these metrics were local to Prometheus.

When exporting to external systems, note that GCP Cloud Monitoring has default data retention policies. Ensure the exported data frequency meets system requirements, especially when using the API. Depending on the target system, the data may need to be reformatted to match the destination’s schema. For example, some systems may need data formatted as JSON, while others might use CSV.

API calls and data export operations might incur GCP charges, especially when querying metrics at high frequency. Review GCP’s billing policy on data exports to avoid unexpected costs. Keep these considerations in mind to facilitate a smooth transition to Prometheus and Grafana.

### Expose application metrics to Prometheus

After any existing metrics have been assessed and exported (if needed), the next step is to modify the application to allow metric scraping by Prometheus, so that it can collect the same metrics that were previously being sent to GCP Cloud Monitoring.

Consider an example Flask application. When using GCP Cloud Monitoring, metrics from the application are *pushed* to GCP Cloud Monitoring. Prometheus works in the opposite direction; it *pulls* data from the application being monitored. 

A standard library for integrating Flask applications with Prometheus is the [prometheus\_flask\_exporter library](https://github.com/rycus86/prometheus_flask_exporter), which automatically instruments the application to expose Prometheus metrics. Install this library via pip with the following command:

| pip install prometheus-flask-exporter |
| :---- |

Using the library to instrument the Flask application requires the following few lines:

| … from flask import Flaskfrom prometheus\_flask\_exporter import PrometheusMetrics … app \= Flask(\_\_name\_\_)metrics \= PrometheusMetrics(app)metrics.info("FlaskApp", "Application info", version="1.0.0") … |
| :---- |

After instrumenting the Flask app with these lines, restart it.

By default, prometheus\_flask\_exporter exposes metrics at the /metrics endpoint. View the metrics by visiting http://\<IP-Address-of-Flask-App\>/metrics in a browser. These metrics will include histograms such as:

* http\_request\_duration\_seconds (Request latency)  
* http\_requests\_total (Total number of requests)

### Configure Prometheus to ingest application metrics

Next, modify the Prometheus configuration on the Linode Compute Instance so that it knows to ingest these metrics. Edit /etc/prometheus/prometheus.yml to include the new scrape target.

| scrape\_configs:  \- job\_name: 'flask\_app'    static\_configs:      \- targets: \['\<IP-Address-or-domain-of-Flask-App\>:80'\] |
| :---- |

After editing the configuration file, restart Prometheus with this command:

| $ systemctl restart prometheus |
| :---- |

To verify, navigate to the Prometheus UI (http://\<IP-address-of-instance\>:9090) in a browser. Click the **Status** tab, then click **Targets**. The Flask application service should now appear in the list of targets, indicating a successful scrape by Prometheus of the Flask application data.

![][image11]

### Create a Grafana dashboard with application metrics

Grafana serves as the visualization layer, providing an interface for creating dashboards from the Prometheus metrics. In a web browser, visit the Grafana UI (http://\<IP-address-of-instance\>:3000). Navigate to the **Dashboards** page.

![][image12]

Create a new dashboard in Grafana by clicking **Create dashboard**.

![][image13]

Next, click **Add visualization**.

![][image14]

In the resulting dialog, select the **prometheus** data source.

![][image15]

After selecting the data source, select the appropriate Prometheus metrics and customize the display.

![][image16]

To duplicate the GCP Cloud Monitoring metrics around latency for the Flask application, click on the **Code** tab in the right-hand side of the panel editor. Then, enter the following equation: 

| flask\_http\_request\_duration\_seconds\_sum{method="GET",path="/",status="200"} / flask\_http\_request\_duration\_seconds\_count{method="GET",path="/",status="200"} |
| :---- |

After entering the formula, click **Run queries**. This will update the chart with data pulled from Prometheus.

![][image17]

This graph represents the metrics information as you would be able to see in GCP Cloud Monitoring. The above example shows the average latency over time for a particular endpoint in the Flask application.

## Other Considerations and Concerns

When migrating from GCP Cloud Monitoring to Prometheus and Grafana, several key considerations and potential concerns should be addressed to ensure a smooth transition.

### Cost management

Using GCP Cloud Monitoring incurs [costs](https://cloud.google.com/stackdriver/pricing) related to log storage and retention, data ingest, Cloud Monitoring API calls, and alerting policies. Migrating to Prometheus and Grafana removes these costs, but it introduces costs for compute and storage resources, with expenses for maintaining these nodes and handling network traffic. Additionally, because Prometheus is designed for short-term storage by default, setting up long-term storage often requires integrating with another service, which may add to costs.

**Recommendation**: Estimate infrastructure costs for Prometheus and Grafana on Linode by assessing current GCP Cloud Monitoring data volume and access usage. Access the [Google Cloud Billing](https://console.cloud.google.com/billing) report to determine a baseline for costs related to GCP Cloud Monitoring and Cloud Logging. Use Prometheus’s default short-term storage for real-time data, then configure a long-term storage solution only for essential data points to optimize costs. Employ Grafana’s alerting and dashboards strategically to reduce high-frequency scrapes and unnecessary data retention. Regularly review and refine retention policies and scraping intervals to balance cost against visibility needs.

### Data consistency and accuracy

GCP Cloud Monitoring provides automated metric collection with built-in aggregation, while Prometheus relies on manual configuration through exporters and application instrumentation.

**Recommendation**: Ensure consistency by setting up Prometheus exporters (such as the [Node Exporter for host metrics](https://prometheus.io/docs/guides/node-exporter/) or [custom exporters](https://prometheus.io/docs/instrumenting/writing_exporters/) for application metrics) and configuring scrape intervals to capture data at regular intervals. Verify that instrumentation for custom metrics is accurate—especially for latency, requests, and resource usage metrics.

Prometheus stores raw data with high granularity but does not provide the same level of aggregated historical data as GCP Cloud Monitoring. This may lead to gaps in insights if retention isn’t properly managed.

**Recommendation**: Use the [remote-write capability](https://prometheus.io/docs/specs/remote_write_spec/) from Prometheus to write data to a remote storage backend (such as [Thanos](https://thanos.io/) or [Cortex](https://cortexmetrics.io/)) for historical data retention. This ensures that older data remains accessible and aggregated at a lower resolution, which is similar to the GCP approach to historical data.

### GCP Cloud Monitoring aggregated data versus Prometheus raw data

GCP Cloud Monitoring aggregates data automatically, providing smoothed historical views and reducing noise in visualization. Prometheus, in contrast, captures high-resolution, unaggregated data, which can introduce noise and complexity. Aggregated metrics from GCP Cloud Monitoring provide a straightforward approach to historical trend analysis, while the raw data captured by Prometheus will require custom queries to derive similar insights.

**Recommendation**: Use Grafana’s dashboard features to aggregate data as needed. In Grafana, apply queries to roll up or downsample data over larger time windows, creating an aggregated view similar to GCP Cloud Monitoring. Apply specific Prometheus [query functions](https://prometheus.io/docs/prometheus/latest/querying/functions/) (for example, [rate](https://prometheus.io/docs/prometheus/latest/querying/functions/#rate), [avg\_over\_time](https://prometheus.io/docs/prometheus/latest/querying/functions/#aggregation_over_time), and [sum\_over\_time](https://prometheus.io/docs/prometheus/latest/querying/functions/#aggregation_over_time)) for this purpose.

### Alert system migration

Migrating an alerting setup requires translating existing GCP Cloud Monitoring alerts into Prometheus alert rules. Consider the thresholds and conditions set in Cloud Monitoring and how they translate to query-based alerts in Prometheus.

**Recommendation**: During migration, audit all GCP Cloud Monitoring alerts and replicate them using Prometheus Alertmanager. It may be necessary to refine alert thresholds based on the type of data collected by Prometheus. Additionally, integrate Alertmanager with any existing notification systems (email, Slack, etc.) to maintain consistency in how teams are alerted to critical events.

### Security and access controls

GCP Cloud Monitoring integrates with GCP’s Identity and Access Management (IAM) infrastructure. This can simplify the management of who can view, edit, or delete logs and metrics. Prometheus and Grafana require manual configuration of security and access controls.

Securing Prometheus and Grafana involves setting up user authentication (such as by OAuth, LDAP, or another method) and ensuring metrics and dashboards are only accessible to authorized personnel. To maintain security, data in transit should be encrypted using TLS.

**Recommendation**: Establish a strong security baseline by implementing secure access controls from the start. Configure Grafana with a well-defined RBAC policy and integrate it with an authentication system, such as OAuth or LDAP. Enable TLS for Prometheus to secure data in transit, and ensure that any sensitive metrics are restricted from unauthorized users.

### Separate log and metric responsibilities

Because Prometheus is primarily a metrics-based monitoring solution, it does not have built-in capabilities for handling logs in the way GCP Cloud Monitoring does. Therefore, when migrating, it’s important to decouple log management needs from metric collection.

**Recommendation**: Introduce a specialized log aggregation solution alongside Prometheus and Grafana for collecting, aggregating, and querying logs.

* [**Grafana Loki**](https://grafana.com/oss/loki/) is designed to integrate with Grafana. It provides log querying capabilities within Grafana's existing interface, giving a unified view of metrics and logs in a single dashboard.  
* [**Fluentd**](https://www.fluentd.org/) is a log aggregator that can forward logs to multiple destinations, including object storage for long-term retention, and can work with both Loki and ELK.

---

The resources below are provided to help you become familiar with migrating GCP Cloud Monitoring to Prometheus and Grafana deployed to a Linode instance.

## Resources

* GCP  
  * [Cloud Monitoring](https://cloud.google.com/monitoring?hl=en)  
  * [Cloud Logging](https://cloud.google.com/logging/docs/overview)  
  * [Configuring log sinks in Cloud Logging](https://cloud.google.com/logging/docs/export/configure_export_v2)  
  * [Cloud Monitoring API](https://cloud.google.com/monitoring/api/v3)  
* Linode  
  * [Create a Compute Instance](https://techdocs.akamai.com/cloud-computing/docs/create-a-compute-instance)  
  * [API Documentation](https://techdocs.akamai.com/linode-api/reference/api)  
  * [CLI Documentation](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-the-linode-cli)  
  * [How to Install and Configure Prometheus and Grafana on Ubuntu](https://www.linode.com/docs/guides/how-to-install-prometheus-and-grafana-on-ubuntu/)  
  * [Prometheus and Grafana Marketplace App](https://www.linode.com/marketplace/apps/linode/prometheus-grafana/)  
* Prometheus  
  * [Releases](https://github.com/prometheus/prometheus/releases)  
  * [Documentation](https://prometheus.io/docs/introduction/overview/)  
  * [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/)  
  * [GCP Prometheus Exporter](https://cloud.google.com/stackdriver/docs/managed-prometheus)  
* Grafana  
  * [Installation Documentation](https://grafana.com/docs/grafana/latest/setup-grafana/installation/)  
  * [Dashboard Documentation](https://grafana.com/docs/grafana/latest/getting-started/build-first-dashboard/)  
* Log Aggregation  
  * [Grafana Loki](https://github.com/grafana/loki)  
  * [Fluentd](https://www.fluentd.org/)