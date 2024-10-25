---
slug: observability-with-datastream-and-trafficpeak
title: "Large Data Observability With DataStream and TrafficPeak"
description: "This guide reviews Akamai's managed observability solution, TrafficPeak, including product features, how TrafficPeak overcomes observability challenges, and a proven implementation architecture."
authors: ["John Dutton"]
contributors: ["John Dutton"]
published: 2024-06-11
keywords: ['observability','datastream','trafficpeak','logging','data logging','visualization']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Akamai Solution Brief: Media TrafficPeak Observability Platform](https://www.akamai.com/resources/solution-brief/trafficpeak-observability-platform)'
- '[Akamai TechDocs: Stream logs to TrafficPeak](https://techdocs.akamai.com/datastream2/docs/stream-logs-trafficpeak)'
---

## Overview

Observability workflows are critical to gaining meaningful insight to your application’s health, customer traffic, and overall performance. However, there are challenges that come along with achieving true observability, including large volumes of traffic data, data retention, time to implementation, and the cost of each.

TrafficPeak is a ready-to-use, quickly deployable observability solution built for Akamai Cloud. TrafficPeak works with DataStream to ingest, index, compress, store, and search high-volume, real-time log data at up to 75% less cost than other observability platforms. TrafficPeak customers are provided with a Grafana login and customized dashboards where they can visualize, search, and set up alerting for their data.

This guide looks at the TrafficPeak observability solution and reviews a tested, proven observability architecture built for a high-traffic delivery platform. This solution combines Akamai’s edge-based DataStream log streaming service, SIEM integration, and TrafficPeak built on Linode cloud infrastructure to support large-scale traffic, logging, and data retention.

## TrafficPeak On Akamai Cloud

### What Is TrafficPeak?

TrafficPeak is a fully managed observability solution that works with DataStream log streaming and Akamai Cloud Computing. TrafficPeak is managed and hosted by Akamai, and uses Linode Compute Instances alongside Linode Object Storage for data processing and storage. With TrafficPeak, customers are provided with access to a Grafana interface with preconfigured, customizable dashboards for data visualization and monitoring.

### Who Is TrafficPeak For?

TrafficPeak is for Akamai customers that need an all-in-one, cost-effective, turnkey observability solution for large, petabyte-scale volumes of data.

## Overcoming Challenges

### Cost Reduction & Visibility

*Reduce observability costs by up to 75% while standardizing data visualization.*

Where other observability solutions are built for application-specific observability, TrafficPeak is built to achieve CDN-level observability supporting extremely large amounts of data. TrafficPeak is designed to work with DataStream to ingest logs from the edge and uses Compute Instances with Object Storage to achieve an efficient, decoupled, and stateless architecture. By keeping traffic and CDN logs on the same platform, TrafficPeak can reduce your observability costs by up to 75%.

With large amounts of data, the need for standardizing data reporting becomes even more important. TrafficPeak’s Grafana dashboard supports as many users you may need, providing a centralized data source. This helps streamline organizational operations and allows developers that work with the data the ability to all get it from the same place.

### Large Data Volumes & Data Retention

*Address data volume and retention challenges with an observability solution on the same platform as your edge delivery.*

There are numerous cost and infrastructure-based challenges that are associated with large volumes of data, including: data acquisition, data storage and retention, data searching and efficiency, and more. Since TrafficPeak is built for Akamai, you can address these challenges by combining your edge and observability solutions on a single platform.

With TrafficPeak, logs are sent directly from Akamai edge to Linode Compute using DataStream, eliminating the need for data traffic to travel outside the Akamai platform. TrafficPeak separates log processing from log storage by utilizing Compute Instances and Object Storage in tandem, uses up to 25x data compression, and offers searchable, accessible hot data retention for 15+ months.

### Complex Data Types

*Achieve observability for complex types of data with visual monitoring and data reporting.*

Complex data (for example, media delivery and gaming data) can have additional challenges: extreme sensitivity to latency, high data volumes, audience insights, application-specific data types, data compliance and security, and more. TrafficPeak’s visual monitoring and data reporting allows you to track audience size, unique viewership, SIEM data, and other audience-specific data. TrafficPeak is also monitored by Akamai (so you don’t need to worry about scaling tasks), includes configurable alerting, and supports CMCD when using Akamai’s [Adaptive Media Delivery](https://www.akamai.com/products/adaptive-media-delivery).

### Implementation

It can be both time consuming and costly when implementing an observability solution to support large amounts of data. TrafficPeak addresses this by being ready-to-use out of the box for Akamai customers and by working with your existing application infrastructure.

## TrafficPeak Workflow Diagram

Below is a high-level diagram and walkthrough of a DataStream and TrafficPeak architecture implemented by a high-traffic delivery platform customer on Akamai.

1.  The client makes a request for an asset, an API call, or other HTTPs request. That request is routed to the nearest Akamai edge region.

1.  If a cached response exists for the request, it is returned by the Akamai edge server. Otherwise, the request is sent to the origin for a response.

1.  Delivery/security logs of this process are generated and sent to TrafficPeak on Akamai Cloud infrastructure (Linode Compute Instances for log processing and Linode Object Storage for log storage).

1.  TrafficPeak collects the information, providing extended data retention (+15 months), facilitating historical data trends and reporting, and enhancing overall visibility.

1.  A Grafana dashboard supporting hundreds of users provides a unified view for DataStream and SIEM functions.
{#advanced-observability-diagram .large-diagram}

![DataStream With TrafficPeak Diagram](Advanced-Observability.svg?diagram-description-id=advanced-observability-diagram)

### Systems and Components

-   **DataStream:** Akamai’s edge-native log streaming service.

-   **TrafficPeak:** Akamai’s managed observability solution that runs on Akamai Cloud Computing platform. Comprised of Compute Instances, Object Storage, and a Grafana dashboard.

-   **Edge Server:** The edge infrastructure that receives, processes, and serves client requests. In this workflow, edge server activity is logged and sent to TrafficPeak for observability purposes.

-   **Data Analysis:** Grafana dashboard; a web-based analytics and visualization platform preconfigured for monitoring log activity processed by TrafficPeak. Configured and made accessible to TrafficPeak customers.

-   **VMs:** Compute Instances used to run TrafficPeak’s log ingest and processing software. Managed by Akamai.

-   **Object Storage:** S3 compatible object storage used to store log data from TrafficPeak. Managed by Akamai.