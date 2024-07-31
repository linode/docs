---
slug: complete-observability-for-live-stream-events-with-trafficpeak
title: "Complete Observability for Live Stream Events With Trafficpeak"
description: "This guide discusses the requirements and challenges related to implementing a observability solution for large-scale live streaming events. These challenges are addressed with a TrafficPeak-based observability architecture used to support one of the largest streaming sporting events in the world."
authors: ["John Dutton"]
contributors: ["John Dutton"]
published: 2024-07-31
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Akamai Solution Brief: Media TrafficPeak Observability Platform](https://www.akamai.com/resources/solution-brief/trafficpeak-observability-platform)'
- '[Akamai TechDocs: Stream logs to TrafficPeak](https://techdocs.akamai.com/datastream2/docs/stream-logs-trafficpeak)'

---

Live streaming events require complete observability in order to deliver a seamless user experience during periods of extreme traffic. Supporting large amounts of concurrent viewers depends on live application and infrastructure insights so that you can troubleshoot issues in real-time.

Complete observability for live streams poses multiple challenges, including implementing data logging at each step, logging storage costs, analyzing data, and timely data reporting. This guide discusses these challenges and considerations, how they can be addressed using TrafficPeak, and a high-level architecture review for achieving live stream observability on Akamai Connected Cloud.

The architecture diagram in this guide references a workflow used to stream one of the largest ad-supported sporting events in the world, supporting one of the largest concurrent user bases ever with an average of 18 million concurrent viewers. The observability solution implemented via Akamai DataStream and TrafficPeak was able to ingest, store, organize, and display insights into the entire streaming media workflow, while Akamai CDN delivered the event to end-users.

## Challenges & Considerations

### User Experience

It can become difficult to provide a great live streaming experience as viewership increases. Complete, step-by-step observability is a key factor in understanding the user experience from both a high and granular level.

TrafficPeak’s observability solution allows you to ingest, store, and analyze logs at every step of the streaming workflow for real-time troubleshooting. This gives developers the opportunity to spot issues and make adjustments earlier, providing each user with a consistent, high-quality experience.

### Log Storage Cost

Complete observability means logging each step of the live stream process, including ingesting live camera feeds, content storage, content delivery, ad insertion, and user playback. Doing this on a global scale, for millions of concurrent users, can result in processing billions of logs and large cloud bills in a very short amount of time.

TrafficPeak uses a highly efficient compression algorithm that helps store more logs, for longer, and cheaper - up to 75% less than other observability solutions. And since Linode Object Storage, TrafficPeak, and Akamai CDN are all part of Akamai Connected Cloud, egress costs can also be reduced by up to 100%.

### Log Analysis

Organizing data for billions of logs in real-time is critical. Likewise, indexing and querying huge amounts of log data, whether current or historical, can be time consuming.

TrafficPeak offers sub-second querying and optimizes log indexing with fully customizable visual dashboards so developers can troubleshoot network and infrastructure issues in a timely manner. By reducing the amount of time needed to analyze data, issues can be identified sooner and fixed faster.

### Architecture Diagram

1.  [Akamai Media Services Live (Akamai MSL)](https://www.akamai.com/resources/product-brief/media-services-live) ingests the live stream feeds in a duplicated fashion. MSL logs are sent to TrafficPeak to ensure full visibility for any ingest-related issues in real-time.

1.  [Linode Object Storage](/docs/products/storage/object-storage/) stores all live streaming content for instantaneous, low-latency delivery, as well as playback. Object Storage logs are sent to TrafficPeak.

1.  [Akamai CDN](https://www.akamai.com/solutions/content-delivery-network) caches and delivers live streaming content to millions of concurrent users. CDN logs are also sent to TrafficPeak via Akamai DataStream, including all relevant HTTP(S) information for troubleshooting purposes.

1.  Playback logs (like UI/video player logs) are sent to TrafficPeak for further troubleshooting, including buffering rates, bitrate switching, and more.

![Complete Observability for Live Streaming Events Architecture](complete-observability-for-live-streaming-events-architecture.jpg)

### Systems and Components

-   **Akamai DataStream + TrafficPeak:** Akamai’s complete observability solution. DataStream sends logs from the edge to TrafficPeak on compute and object storage, all while on the Akamai Connected Cloud network.

-   **Akamai CDN:** Akamai’s industry-leading content delivery network used for caching and global delivery.

-   **Akamai Media Services Live (MSL):** Low-latency ingest of media content for high-quality live streaming.

-   **Linode Object Storage:** Cost-effective object storage used for media and log storage on Akamai Connected Cloud.

-   **Server-Side Ad Insertion (SSAI):** The process of attaching, or stitching, ads to content prior to reaching end-user devices. Ad logs (i.e. ad played and ad interacted) can also be sent to TrafficPeak with the TrafficPeak Video Analytics add-on.