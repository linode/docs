---
slug: migrating-from-aws-cloudwatch-to-prometheus-and-grafana-on-linode
title: "Migrating From Aws CloudWatch to Prometheus and Grafana on Linode"
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

AWS CloudWatch is a monitoring and observability service designed to collect and track metrics, log files, and events from AWS resources and applications. CloudWatch enables users to monitor the performance and health of their infrastructure by generating real-time insights and alerts.

This guide walks through how to migrate standard AWS CloudWatch service logs and metrics to Prometheus and Grafana running on a Linode instance.

## Before You Begin

1.  If you do not already have a Linode account, create one by following the [Getting started](https://techdocs.akamai.com/cloud-computing/docs/getting-started) guide.

1.  Generate a personal access token by following the [Manage Personal Access Tokens](https://techdocs.akamai.com/cloud-computing/docs/manage-personal-access-tokens) guide. This token is required for provisioning and managing resources through the Linode CLI.

1.  Install and configure the Linode CLI by following the steps in the [Install and Configure the CLI](https://techdocs.akamai.com/cloud-computing/docs/install-and-configure-the-cli) guide.

1.  Create an SSH key pair if you do not already have one. Follow the Generate an SSH Key Pair section of the [Use SSH Public Key Authentication on Linux, macOS, and Windows](https://www.linode.com/docs/guides/use-public-key-authentication-with-ssh/#generate-an-ssh-key-pair) guide to securely generate and use SSH keys for accessing your Linode instance.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Introduction to Prometheus and Grafana

Prometheus is a [time-series](https://prometheus.io/docs/concepts/data_model/#data-model) database used to collect and store metrics from applications and services, providing a foundation for monitoring system performance. Prometheus uses the PromqL query language to extract and analyze granular data. It autonomously scrapes (*pulls*) data from targets at specified intervals, then stores it efficiently through compression and only keeping the most important details over time. Prometheus also supports alerting based on metric thresholds, making it suitable for dynamic, cloud-native environments.

Grafana is a visualization and analytics platform that integrates with Prometheus, enabling users to create interactive, real-time dashboards. It allows users to visualize metrics, set up alerts, and gain real-time insights into system performance. Grafana's ability to integrate with a wide array of data sources, including Prometheus, allows it to unify metrics from multiple systems into a cohesive view.

Prometheus and Grafana are often used together to monitor service health, detect anomalies, and issue alerts. Both are open source tools that provide a customizable approach to monitoring services. They are platform-agnostic, meaning they can be used across different cloud providers and on-premise systems. Organizations may adopt these open source tools to lower their operational costs and have greater control over how data is collected, stored, and visualized.

## Step 1: Initialize a Compute Instance

This guide uses the Linode CLI to provision resources. The Linode Marketplace offers a deployable [Prometheus and Grafana Marketplace app](https://www.linode.com/marketplace/apps/linode/prometheus-grafana/), whereas this tutorial walks through a manual installation.

### Determine Instance Configuration

In order to provision a Linode instance, you must specify the desired operating system, geographical region, and Linode plan size. The options available for each of these can be obtained using the Linode CLI.

#### Operating System

Run this command to obtain a formatted list of available operating systems:

```command
linode-cli images list --type=manual
```

This guide uses Ubuntu 22.04, which has the ID `linode/ubuntu22.04`.

#### Geographical Region

```command
linode-cli regions list
```

This guide uses the `us-sea` region (Seattle, WA).

#### Compute Instance Size

```command
linode-cli linodes types
```

This guide uses the `g6-standard-4` Linode, which has 4 cores, 160 GB disk, and 8 GB RAM with a 5000 Mbps transfer rate.

### Create the Compute Instance

The following command creates a Linode Compute Instance based on the specified operating system, geographical region, and size as noted above.

```command
linode-cli linodes create \
    --image linode/ubuntu22.04 \
    --region us-sea \
    --type g6-standard-4 \
    --root_pass {{< placeholder "PASSWORD" >}} \
    --authorized_keys "$(cat ~/.ssh/id_rsa.pub)" \
    --label monitoring-server
```

Note the following key points:

-   Replace {{< placeholder "PASSWORD" >}} with a secure alternative.
-   This command assumes that an SSH public/private key pair exists, with the public key stored as `id\_rsa.pub` in the user's `$HOME/.ssh/` folder.
-   The `--label` argument specifies the name of the new server (`monitoring-server`).

Within a few minutes of executing this command, the instance should be visible in the Linode Cloud Manager. Depending on notification settings, emails detailing the progress of the provisioning process may also be sent to the Linode user's address.

## Step 2: Install Prometheus as a Service

To install Prometheus, you need to SSH into the newly provisioned Linode. The IP address of the new instance can be found in the Linode Cloud Manager dashboard or via the following command:

```command
linode-cli linodes list
```

Once the IP address is found, run the following command:

```command
ssh -l root {{< placeholder "IP_ADDRESS" >}}
```

{{< note >}}
This method of connecting uses the `root` user, which is currently the only accessible user on the system. For simplicity, **this guide assumes that all remaining commands are run as the `root` user** on this Linode Compute Instance.

For production systems, it is strongly recommended that you disable the ability to access the instance as the `root` user, instead creating a limited user account for access. See [this guide](https://techdocs.akamai.com/cloud-computing/docs/set-up-and-secure-a-compute-instance#add-a-limited-user-account) for more details.
{{< /note >}}

### Update System Packages

Ensure that the new system is up to date with the latest Ubuntu packages. The Ubuntu package manager (`apt`) needs to be updated to pull the latest package manifests, followed by upgrading any that are outdated.

```command
apt update && apt upgrade \-y
```

### Create a Prometheus User

It is considered a best practice to run Prometheus with its own dedicated user. The next set of commands creates the new user, disables its login, and then creates configuration and library directories for the soon-to-be-installed system.

```command
useradd --no-create-home --shell /bin/false prometheus
mkdir /etc/prometheus
mkdir /var/lib/Prometheus
```

### Download and Install Prometheus

Download the latest version of Prometheus from its GitHub repository:

```command
wget https://github.com/prometheus/prometheus/releases/download/v2.54.1/prometheus-2.54.1.linux-amd64.tar.gz
```

As of the time of this writing, the most recent version of Prometheus is 2.54.1. Check the project’s [releases page](https://github.com/prometheus/prometheus/releases) for the latest version, while aligning with your Compute Instance’s operating system and instruction set.

Extract the compressed file and navigate to the new folder:

```command
tar xzvf prometheus-2.54.1.linux-amd64.tar.gz
cd prometheus-2.54.1.linux-amd64/
```

Move the `prometheus` and `promtool` binaries to `/usr/local/bin`:

```command
cp prometheus /usr/local/bin/
cp promtool /usr/local/bin/
```

The `prometheus` binary is the main monitoring application, while `promtool` is a utility application that allows for querying and configuring a running Prometheus service.

Move configuration folders and files to the `/etc/prometheus` folder created previously:

```command
cp -r consoles /etc/prometheus
cp -r console\_libraries /etc/prometheus
cp prometheus.yml /etc/prometheus/prometheus.yml
```

Set all the correct ownership permissions for these files in their new location:

```command
chown -R prometheus:prometheus /etc/prometheus
chown -R prometheus:prometheus /var/lib/prometheus
chown prometheus:prometheus /usr/local/bin/prometheus
chown prometheus:prometheus /usr/local/bin/promtool
```

### Create a `systemd` Service File

A `systemd` service configuration file needs to be created to run Prometheus as a service. Create and open this file. This guide assumes the use of the `nano` text editor.

```command
nano /etc/systemd/system/prometheus.Service
```

Add the following to the file:

```file {title="/etc/systemd/system/prometheus.Service"}
[Unit]
Description=Prometheus Service
Wants=network-online.target
After=network-online.target

[Service]
User=prometheus
Group=prometheus
Type=simple
ExecStart=/usr/local/bin/prometheus \
    --config.file=/etc/prometheus/prometheus.yml \
    --storage.tsdb.path=/var/lib/prometheus \
    --web.console.templates=/etc/prometheus/consoles \
    --web.console.libraries=/etc/prometheus/console\_libraries

[Install]
WantedBy=multi-user.targets
```

Save and close the file.

### Reload `systemd` and Start Prometheus

In order for the new service configuration file to be accessible, `systemd` needs to be reloaded. Run the following command:

```command
systemctl daemon-reload
```

Now, Prometheus is available in `systemd` to be enabled and started. Enabling a service in `systemd` means it is started at system boot, but enabling alone does not start the service in this session. It also needs to be started. Run the following commands:

```command
systemctl enable prometheus
systemctl start prometheus
```

Verify the Prometheus service has started and has been enabled by running this command:

```command
systemctl status prometheus
```

If the previous steps were successful, the output for this command should display `active (running)` in green, like the following:

```output
● prometheus.service - Prometheus Service
     Loaded: loaded (/etc/systemd/system/prometheus.service; enabled; preset: enabled)
     Active: active (running) since Wed 2024-09-28 11:39:47 MST; 4s ago
   Main PID: 454941 (prometheus)
      Tasks: 6 (limit: 1124)
     Memory: 15.5M (peak: 15.7M)
        CPU: 63ms
```

Another way to check for a successful installation is to visit `http://{{< placeholder "IP_ADDRESS" >}}:9090` in a web browser, verifying that the Prometheus UI appears. The port and security settings for the Prometheus application can be found in the `/etc/prometheus/prometheus.yml` file.

![][image2.png]

This guide uses the default values for Prometheus. For production systems, care should be taken to enforce authentication and other security measures.

## Step 3: Install the Grafana Service

Grafana offers an `apt` repository, reducing the number of steps needed to install and upgrade it on Ubuntu.

Add the new apt repository:

```command
apt-get install -y software-properties-common
```

Import and add the public key for the repository:

```command
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
add-apt-repository "deb https://packages.grafana.com/oss/deb stable main"
```

Update package manifests to acquire the listings for Grafana. Then, install Grafana.

```command
apt update
apt install grafana -y
```

The installation process includes setting up the `systemd` configuration for Grafana. Enable and start Grafana.

```command
systemctl start grafana-server
systemctl enable grafana-server
```

To check for a successful installation of Grafana, run `systemctl status grafana-server` or visit `http://{{< placeholder "IP_ADDRESS" >}}:3000` in your browser to see the Grafana web UI.

### Connect Grafana to Prometheus

On the login page of Grafana in your browser, enter the username `admin` with password `admin` for the initial login.

![][image3.png]

The next page prompts you for an updated password. Provide a secure replacement for the weak default.

![][image4.png]

After logging in, add Prometheus as a data source with the following steps:

1.  Expand the **Home** menu. Under **Connections**, click **Add New Connection**.

    ![][image5.png]

2.  Search for and select **Prometheus**.

3.  Click **Add New Data Source**.

    ![][image6.png]

4.  In the **URL** field, enter `http://localhost:9090`.

5.  Click **Save & Test** to confirm the connection.

    ![][image7.png]

Assuming the test succeeded, Grafana is now connected to the Prometheus instance running on the same Linode Compute Instance.

## Step 4: Migrate from AWS CloudWatch to Prometheus and Grafana

Migrating from AWS CloudWatch to Prometheus and Grafana requires planning to ensure continuity of monitoring capabilities while leveraging the added control over data handling and advanced features of these open-source alternatives.

As an example of usage, this guide shows the migration for an [example Flask server](https://github.com/nathan-gilbert/simple-ec2-cloudwatch) that collects metrics and logs through AWS CloudWatch.

### Assess Current Monitoring Requirements

Before migrating to Prometheus and Grafana, understand what metrics and logs are currently being collected by CloudWatch and how they are used.

In the example Flask application, metrics for endpoint latency are sent to CloudWatch using the [`put_metric_data`](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/cloudwatch/client/put_metric_data.html) API found in [Boto3](https://github.com/boto/boto3) (a Python library for interfacing with AWS resources), and applications logs are written to a local file which is ingested into CloudWatch Logs for centralization. The endpoint latency metrics are collected on every endpoint, along with HTTP method details. The application log entries record incoming requests and other application events such as exceptions or warnings.

The Flask application emits logs as it receives and handles requests at its various endpoints. CloudWatch log events look like this, showing the INFO level logs from the example application:

![][image8.png]

CloudWatch also displays metrics graphs. For example, by querying the endpoint latency metrics sent from the Flask application, the graphed metric would look like this:

![][image9.png]

### Export existing CloudWatch logs and metrics

AWS provides some tools and services to assist with exporting CloudWatch data for historical analysis. As a first step, CloudWatch logs can be exported to an S3 bucket for accessing data outside of AWS. The logs can then be re-ingested into other tools using custom tooling. To export CloudWatch Logs to S3, use the [`create-export-task`](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/logs/create-export-task.html) command.

```command
aws logs create-export-task \
  --log-group-name {{< placeholder "LOG_GROUP" >}} \
  --from {{< placeholder "START_TIME" >}} \
  --to {{< placeholder "END_TIME" >}} \
  --destination {{< placeholder "S3_BUCKET_NAME" >}} \
  --destination-prefix cloudwatch-logs/
```

### Expose Application Metrics to Prometheus

After any existing metrics have been assessed and exported (if needed), the next step is to modify the application to allow metric scraping by Prometheus, so that it can collect the same metrics that were previously being sent to CloudWatch.

In the original version of the application, metrics are *pushed* to CloudWatch. Prometheus works in the opposite direction; it *pulls* data from the application being monitored.

A standard library for integrating Flask applications with Prometheus is the [prometheus\_flask\_exporter library](https://github.com/rycus86/prometheus_flask_exporter), which automatically instruments the application to expose Prometheus metrics. Install this library via `pip` with the following command:

```command
pip install prometheus-flask-exporter
```

Using the library to instrument the Flask application requires the following few lines:

```file
...

from flask import Flask
from prometheus_flask_exporter import PrometheusMetrics

...

app = Flask(__name__)
metrics = PrometheusMetrics(app)
metrics.info("FlaskApp", "Application info", version="1.0.0")

...
```

Restart the Flask app with the following command:

```command
systemctl restart flask-app
```

By default, `prometheus_flask_exporter` exposes metrics at the `/metrics` endpoint. View the metrics by visiting `http://{{< placeholder "FLASK_APP_IP_ADDRESS" >}}/metrics` in a browser. These metrics include histograms such as:

-   `http_request_duration_seconds` (Request latency)
-   `http_requests_total` (Total number of requests)

### Configure Prometheus to Ingest Application Metrics

Next, modify the Prometheus configuration on the Linode Compute Instance so that it knows to ingest these metrics. Edit `/etc/prometheus/prometheus.yml` to include the new scrape target.

```file
scrape\_configs:
  - job_name: 'flask_app'
    static\_configs:
      - targets: ['{{< placeholder "FLASK_APP_IP_ADDRESS" >}}:80']
```

After editing the configuration file, restart Prometheus with this command:

```command
systemctl restart prometheus
```

To verify, navigate to the Prometheus UI (`http://{{< placeholder "INSTANCE_IP_ADDRESS" >}}:9090`) in a browser. Click the **Status** tab, then click **Targets**. The Flask application service should now appear in the list of targets, indicating a successful scrape by Prometheus of the Flask application data.

![][image10.png]

### Create a Grafana Dashboard with Application Metrics

Grafana serves as the visualization layer, providing an interface for creating dashboards from the Prometheus metrics. In a web browser, visit the Grafana UI (`http://{{< placeholder "INSTANCE_IP_ADDRESS" >}}:3000`). Navigate to the **Dashboards** page.

![][image11.png]

Create a new dashboard in Grafana by clicking **Create dashboard**.

![][image12.png]

Next, click **Add visualization**.

![][image13.png]

In the resulting dialog, select the **prometheus** data source.

![][image14.png]

After selecting the data source, select the appropriate Prometheus metrics and customize the display.

![][image15.png]

To duplicate the CloudWatch metrics around latency for the Flask application, click on the **Code** tab in the right-hand side of the panel editor. Then, enter the following equation:

```command
flask_http_request_duration_seconds_sum{method="GET",path="/",status="200"} /
flask_http_request_duration_seconds_count{method="GET",path="/",status="200"}
```

After entering the formula, click **Run queries**. This should update the chart with data pulled from Prometheus.

![][image16.png]

This graph represents the same information as the one in CloudWatch, detailing the average latency over time for a particular endpoint. Notice that, by default, Prometheus offers additional detail on the labels, providing the endpoint and status codes in the legend.

## Additional Considerations and Concerns

When migrating from AWS CloudWatch to Prometheus and Grafana on Linode, several key considerations and potential concerns should be addressed to ensure a smooth transition.

### Cost Management

CloudWatch and AWS services can incur costs based on the number of API requests, log volume, and data retention. As monitoring scales, these costs will increase. Migrating to Prometheus and Grafana offers a potential for cost savings since Prometheus is an open-source solution that does not charge for API usage or log storage.

However, infrastructure costs with the new setup are still a consideration. Running Prometheus and Grafana requires provisioning compute and storage resources, with expenses for maintaining these nodes and handling network traffic. Additionally, because Prometheus is designed for short-term storage by default, setting up long-term storage often requires integrating with another service, which may add to costs.

**Recommendation**: Estimate infrastructure costs for Prometheus and Grafana on Linode by assessing current CloudWatch data volume and access usage. Utilize object storage or other efficient long-term storage mechanisms to minimize costs.

### Data Consistency and Accuracy

CloudWatch aggregates metrics over intervals, whereas Prometheus provides raw, fine-grained data with a high-resolution time series. This allows for detailed analysis and precision when tracking metrics.

Since CloudWatch and Prometheus measure and log data differently, migrating from CloudWatch to Prometheus raises potential concerns about data consistency and accuracy during and after the transition.

**Recommendation**: During the migration, ensure that Prometheus scrape intervals are tuned appropriately to capture the necessary level of detail, without overwhelming storage or compute capacities. Additionally, validate that key metrics in CloudWatch map correctly to Prometheus metrics, with the appropriate time resolutions.

### CloudWatch Aggregated Data Versus Prometheus Raw Data

Aggregated data from CloudWatch offers a high-level view of system health and application performance and is helpful for monitoring broader trends. The raw, fine-grained data from Prometheus enables detailed analyses and granular troubleshooting.

When migrating, understand which level of data is appropriate for a given use case. Although Prometheus can collect raw data, consider whether the aggregation that CloudWatch provides is more useful, and how to replicate that with Grafana dashboards or Prometheus queries.

**Recommendation**: Leverage Grafana's capabilities to build dashboards that display aggregated data where necessary, while still maintaining the ability to look into detailed, raw metrics for in-depth analysis. It is considered a best practice to find a balance between fine-grained data analysis and overall system-level insights.

### Alert System Migration

CloudWatch’s integrated alerting system is tightly coupled with AWS services and allows for alerts based on metric thresholds, log events, and more. Prometheus offers its own alerting system, [**Alertmanager**](https://prometheus.io/docs/alerting/latest/alertmanager/), which can handle alerts based on Prometheus query results.

Migrating an alerting setup requires translating existing CloudWatch alarms into Prometheus alert rules. Consider the thresholds and conditions set in CloudWatch and how they translate to the query-based alerts in Prometheus.

**Recommendation**: During migration, audit all CloudWatch alerts and replicate them using Prometheus Alertmanager. It may be necessary to refine alert thresholds based on the type of data collected by Prometheus. Additionally, integrate Alertmanager with any existing notification systems (email, Slack, etc.) to maintain consistency in how teams are alerted to critical events.

### Security and Access Controls

CloudWatch integrates with AWS Identity and Access Management (IAM) for role-based access control (RBAC). This can simplify the management of who can view, edit, or delete logs and metrics. Prometheus and Grafana require manual configuration of security and access controls.

Securing Prometheus and Grafana involves setting up user authentication (such as by OAuth, LDAP, or another method) and ensuring metrics and dashboards are only accessible to authorized personnel. To maintain security, data in transit should be encrypted using TLS.

**Recommendation**: Establish a strong security baseline by implementing secure access controls from the start. Configure Grafana with a well-defined RBAC policy and integrate it with an authentication system, such as OAuth or LDAP. Enable TLS for Prometheus to secure data in transit, and ensure that any sensitive metrics are restricted from unauthorized users.

### Separate Log and Metric Responsibilities

Because Prometheus is primarily a metrics-based monitoring solution, it does not have built-in capabilities for handling logs in the way CloudWatch does. Therefore, when migrating, it's important to decouple log management needs from metric collection.

**Recommendation**: Introduce a specialized log aggregation solution alongside Prometheus and Grafana for collecting, aggregating, and querying logs.

-   [**Grafana Loki**](https://grafana.com/oss/loki/) is designed to integrate with Grafana. It provides log querying capabilities within Grafana's existing interface, giving a unified view of metrics and logs in a single dashboard.
-   [**Fluentd**](https://www.fluentd.org/) is a log aggregator that can forward logs to multiple destinations, including object storage for long-term retention, and can work with both Loki and ELK.

---

The resources below are provided to help you become familiar with migrating AWS CloudWatch to Prometheus and Grafana deployed to a Linode instance.

## Resources

-   AWS CloudWatch
    -   [Documentation](https://docs.aws.amazon.com/cloudwatch/)
-   Linode
    -   [Create a Compute Instance](https://techdocs.akamai.com/cloud-computing/docs/create-a-compute-instance)
    -   [API Documentation](https://techdocs.akamai.com/linode-api/reference/api)
    -   [CLI Documentation](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-the-linode-cli)
    -   [How to Install and Configure Prometheus and Grafana on Ubuntu](https://www.linode.com/docs/guides/how-to-install-prometheus-and-grafana-on-ubuntu/)
    -   [Prometheus and Grafana Marketplace App](https://www.linode.com/marketplace/apps/linode/prometheus-grafana/)
-   Prometheus
    -   [Releases](https://github.com/prometheus/prometheus/releases)
    -   [Documentation](https://prometheus.io/docs/introduction/overview/)
    -   [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/)
-   Grafana
    -   [Installation Documentation](https://grafana.com/docs/grafana/latest/setup-grafana/installation/)
    -   [Dashboard Documentation](https://grafana.com/docs/grafana/latest/getting-started/build-first-dashboard/)
-   Log Aggregation
    -   [Grafana Loki](https://github.com/grafana/loki)
    -   [Fluentd](https://www.fluentd.org/)