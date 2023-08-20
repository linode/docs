---
slug: monitoring-and-securing-cloud-workloads-with-wazuh
title: "Monitoring and Securing Cloud Workloads With Wazuh"
description: 'This guide explores how to utilize Wazuh for threat detection on monitored endpoints, including custom configurations and integration with additional security tools.'
keywords: ['Wazuh', 'Wazuh Indexer', 'Wazuh Server', 'Install and Configure Wazuh', 'Provide Endpoint Security with Wazuh', 'How to Use Wazuh Threat Detection']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Martin Heller"]
published: 2023-08-20
modified_by:
  name: Linode
external_resources:
- '[Wazuh installation assistant](https://documentation.wazuh.com/current/quickstart.html#installing-wazuh)'
- '[Wazuh Indexer](https://documentation.wazuh.com/current/installation-guide/wazuh-indexer/installation-assistant.html#wazuh-indexer-nodes-installation)'
- '[Wazuh Server](https://documentation.wazuh.com/current/installation-guide/wazuh-server/installation-assistant.html#installing-the-wazuh-server-using-the-assistant)'
- '[Wazuh Dashboard](https://documentation.wazuh.com/current/installation-guide/wazuh-dashboard/installation-assistant.html#installing-the-wazuh-dashboard-using-the-assistant)'
- '[Wazuh Agents](https://documentation.wazuh.com/current/installation-guide/wazuh-agent/index.html#wazuh-agent)'
- '[VirusTotal API](https://documentation.wazuh.com/current/proof-of-concept-guide/detect-remove-malware-virustotal.html#detecting-and-removing-malware-using-virustotal-integration)'
---

Wazuh is an open-source security platform that offers unified extended detection and response (XDR) and security information and event management (SIEM) protection for endpoints and cloud workloads. It’s a convenient way to secure your Linode cloud processes, containers, and Kubernetes pods, as well as your client computers and devices.

## What is Wazuh?

Wazuh is a security platform for monitoring and responding to threats across endpoints, cloud workloads, and servers.

![Wazuh system diagram](wazuh-system-diagram.jpg "Wazuh system diagram")

As you can see from the diagram above, Wazuh consists of agents that monitor endpoints, servers that analyze the logs emitted by agents, indexers, and a dashboard. Wazuh users primarily interact with the dashboard.


## Various Wazuh Features

Wazuh performs log data analysis, intrusion and malware detection, file integrity monitoring, configuration assessment, vulnerability detection, and support for regulatory compliance. In addition, Wazuh helps you meet government requirements such as PCI DSS, HIPAA, and GDPR, and configuration standards such as CIS hardening guides.

### Wazuh Indexer

The Wazuh indexer is a scalable full-text search and analytics engine. It indexes and stores alerts that the Wazuh server generates, and provides near real-time data search and analytics capabilities. You can configure the Wazuh indexer as a single-node or multi-node cluster. It stores data as JSON documents, and its database is sharded.

Wazuh uses four different indices to store different event types: alerts, archives, monitoring, and statistics. You can interact with the Wazuh indexer cluster using the Wazuh indexer REST API.

### Wazuh Server

The Wazuh server component analyzes the data received from the agents, triggering alerts when threats or anomalies are detected. You can also use it to manage the agent's configuration remotely and monitor their status.

The Wazuh server uses threat intelligence sources to improve its detection capabilities. It also enriches alert data by using the MITRE ATT&CK framework and regulatory compliance requirements such as PCI DSS, GDPR, HIPAA, CIS, and NIST 800-53, providing helpful context for security analytics. Additionally, the Wazuh server can be integrated with external software, including ticketing systems and instant messaging platforms.


### Wazuh Dashboard

The Wazuh dashboard (as shown in the screenshot below) offers a web-based interface designed for mining, analyzing, and visualizing security events, alert data, and platform management and monitoring. It encompasses functionalities for role-based access control (RBAC) and single sign-on (SSO).

Wazuh also features dashboards for exploring the MITRE ATT&CK framework and associated alerts, fostering enhanced situational awareness and threat analysis.

![Wazuh dashboard](wazuh-dashboard.png "Wazuh dashboard")

## How to Install and Configure Wazuh

There are a number of ways to install Wazuh, depending on where you want it to run, what other services you want to use with Wazuh, and the amount of traffic you need to handle. The simplest option for [deploying Wazuh in a Linode is to use the Marketplace installer](/docs/products/tools/marketplace/guides/wazuh/). This takes about 15 minutes and requires minimal information from you. You can also [download and run the Wazuh installation assistant](https://documentation.wazuh.com/current/quickstart.html#installing-wazuh), which creates a Wazuh deployment on a single server that is good for monitoring up to 100 endpoints. The table below shows the recommended instance sizes to support various numbers of agents.

| Agents       | CPU     | RAM    | Storage (90 days) |
| ------------ |---------|--------| ----------------- |
| 1–25         | 4 vCPU  | 8 GiB  |             50 GB |
| 25–50        | 8 vCPU  | 8 GiB  |            100 GB |
| 50–100       | 8 vCPU  | 8 GiB  |            200 GB |


### Install Wazuh Manually

For a more robust installation of Wazuh, you can install it manually, creating as many nodes as needed for each service. Start by installing the Wazuh Indexer, followed by the Wazuh Server, then the Wazuh Dashboard, and finally by installing agents on any servers, computers, or devices you need to monitor or protect. While you can install all Wazuh services step by step, for this exercise, you can use the Wazuh installation assistant for each component.

Before you can start the installations, ensure you create Linodes to serve as the nodes and record their respective IP addresses. Once that's done, proceed by downloading the Wazuh installation assistant and the configuration file to your local machine using the following commands:

```command
curl -sO https://packages.wazuh.com/4.4/wazuh-install.sh
curl -sO https://packages.wazuh.com/4.4/config.yml
```

Edit the configuration file and replace the placeholders for node names and corresponding IP addresses. After making these adjustments, execute the assistant with the `--generate-config-files` option to generate the Wazuh cluster key, certificates, and passwords necessary for installation:

```command
bash wazuh-install.sh --generate-config-files
```

You can find the generated files located in the `./wazuh-install-files.tar` archive.

Copy the `wazuh-install-files.tar` archive to all the nodes and servers of the distributed deployment, including the Wazuh server, the Wazuh indexer, and the Wazuh dashboard nodes using the `scp` utility. Proceed to download the installation assistant to the nodes you designated to be the [Wazuh Indexer](https://documentation.wazuh.com/current/installation-guide/wazuh-indexer/installation-assistant.html#wazuh-indexer-nodes-installation). Execute the assistant with the `--wazuh-indexer` flag on these nodes. On one of these nodes, rerun the installation script, this time adding the `--start-cluster` flag.

Repeat the same process again for the [Wazuh Server](https://documentation.wazuh.com/current/installation-guide/wazuh-server/installation-assistant.html#installing-the-wazuh-server-using-the-assistant) and [Wazuh Dashboard](https://documentation.wazuh.com/current/installation-guide/wazuh-dashboard/installation-assistant.html#installing-the-wazuh-dashboard-using-the-assistant) nodes. Finally, you can install the [Wazuh Agents](https://documentation.wazuh.com/current/installation-guide/wazuh-agent/index.html#wazuh-agent) on the endpoints you wish to protect. If you have a substantial number of endpoints, consider utilizing an automation tool such as Puppet, Chef, SCCM, or Ansible for agent deployment.


### Install Wazuh with Docker or Kubernetes

As an alternative to installing Wazuh directly on servers or instances, you can install it via [Docker](https://documentation.wazuh.com/current/deployment-options/docker/index.html#deployment-on-docker) or [Kubernetes](https://documentation.wazuh.com/current/deployment-options/deploying-with-kubernetes/index.html#deployment-on-kubernetes'). Using Docker makes the most sense for development installations; Kubernetes, specifically [Akamai Cloud Manager](https://cloud.linode.com/kubernetes/clusters), makes more sense for production installations that you expect to scale up and down over time.


## How to Provide Endpoint Security With Wazuh

In addition to installing Wazuh agents on the endpoints you need to secure, you need to add a few configurations. For example, on an Ubuntu server that runs an Apache web server, you need to [add a few lines](https://documentation.wazuh.com/current/proof-of-concept-guide/block-malicious-actor-ip-reputation.html#ubuntu-endpoint) to `/var/ossec/etc/ossec.conf` to monitor the Apache access logs. To protect the files in the `/root` directory of an Ubuntu server, add the following line to `/var/ossec/etc/ossec.conf` in the `<syscheck>` block:

```command
<directories check_all="yes" report_changes="yes" realtime="yes">/root</directories>
```

There is an additional configuration to perform to monitor Docker events and unauthorized processes. Any time you change the configuration on a server, restart the Wazuh agent on that server.


## How to Use Wazuh Threat Detection

Attacks on monitored endpoints show up in the Wazuh dashboard. The [proof-of-concept guide](https://documentation.wazuh.com/current/proof-of-concept-guide/index.html#proof-of-concept-guide) lists the event numbers to look for for specific threats.

You can expand Wazuh’s purview by installing additional threat detection software and integrating that with Wazuh. Examples include [Suricata](https://documentation.wazuh.com/current/proof-of-concept-guide/integrate-network-ids-suricata.html#network-ids-integration) network-based intrusion detection, the [VirusTotal API](https://documentation.wazuh.com/current/proof-of-concept-guide/detect-remove-malware-virustotal.html#detecting-and-removing-malware-using-virustotal-integration) to scan files for infection, and [Yara](https://documentation.wazuh.com/current/proof-of-concept-guide/detect-malware-yara-integration.html#detecting-malware-using-yara-integration) to detect malware. Wazuh has its own [Vulnerability Detector module](https://documentation.wazuh.com/current/proof-of-concept-guide/poc-vulnerability-detection.html#vulnerability-detection) which you can enable in the `/var/ossec/etc/ossec.conf` file.


## Conclusion

Wazuh can help you secure your endpoints and detect threats. Wazuh provides unified XDR and SIEM capabilities, and you can easily install the Wazuh server components on Linodes.
