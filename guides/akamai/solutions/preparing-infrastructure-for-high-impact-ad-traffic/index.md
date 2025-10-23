---
slug: preparing-infrastructure-for-high-impact-ad-traffic
title: "Preparing Infrastructure for High-Impact Advertising Traffic on Akamai"
description: "This guide discusses the infrastructure challenges related to traffic associated with high-impact ad campaigns. It also proposes a reference architecture and strategies used to support surges during high-traffic events on Akamai."
authors: ["John Dutton"]
contributors: ["John Dutton"]
published: 2024-07-10
keywords: ['high-impact advertising','visibility','observability','infrastructure security','high traffic','load testing']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'

---

Companies looking to attract large amounts of new customers will often employ high-impact advertising campaigns to increase sales in a limited timeframe. Since these campaigns are meant to maximize interest over short amounts of time, they can lead to huge influxes in traffic to their normal web applications. This comes with a host of implementation challenges, including infrastructure stability, data visibility, platform security, and consistent, equitable end user experiences.

This guide proposes a reference architecture a financial company used for a high-impact advertising campaign meant to attract new customers that aired during a major sporting event. Akamai developed the solution to enhance performance and security, safeguard the company’s brand, and provide a smooth site experience for end users during high-demand periods. The campaign resulted in 1M new customer registrations, 10x more traffic, and over 400 million attacks mitigated.

## Infrastructure Workflow

1.  High-impact ad campaign is launched during a high-profile, high-traffic event.

1.  Edge-based app performance & security features are implemented to support higher-than-normal traffic.

1.  An enhanced user experience is deployed using Queue-it waiting room technology.

1.  Increased observability capabilities are enabled with TrafficPeak, including customized traffic thresholds. Customizable Grafana dashboards are used to monitor the event along with support from Akamai Event Support.

## Overcoming Challenges

### Predictability

*Make sure your infrastructure is prepared with CloudTest load testing.*

High-impact advertising inherently results in huge, hard-to-predict surges in traffic. If not accounted for, that traffic can put a strain on infrastructure and potentially cause site crashes, resulting in negative user experiences and damage to brand reputation.

Akamai [CloudTest](https://www.akamai.com/products/cloudtest) addresses this by offering real-time load testing at scale. CloudTest accounts for traffic fluctuations, provides a visual UI for analysis, and can identify bottlenecks in code, networks, servers, and databases. Along with CloudTest Professional Services, you can test production-level volumes on a global scale and ensure your infrastructure is ready for real-world campaign conditions.

### Traffic Surges and the User Experience

*Maintain consistent, secure user experiences with Queue-it virtual waiting rooms.*

To capitalize on user conversions, engaging high-impact campaigns require scalable infrastructure that can handle surges in traffic without compromising performance.

To ensure a consistent user experience, Queue-it virtual waiting rooms implemented via [EdgeWorkers](https://www.akamai.com/products/serverless-computing-edgeworkers) can control and optimize user access and prevent site crashes during times of increased traffic. This also ensures online queues can’t be bypassed by tech-savvy visitors, guaranteeing equitable and fair user access.

### Visibility

*Use TrafficPeak and Akamai Event Support for real-time observability needs.*

Accurate data visualization and traffic analysis are critical to determining the success of a high-impact campaign. This means real-time visibility into imminent threats, flexible capacity thresholds, and detailed traffic data.

[TrafficPeak](https://www.akamai.com/resources/solution-brief/trafficpeak-observability-platform) provides real-time monitoring and analysis of sudden traffic spikes, allowing for preemptive mitigation of potential security issues. TrafficPeak’s capacity thresholds can also be adjusted as needed, while live data is displayed on multiple customizable Grafana dashboards.

### Security

*Secure your campaign at the edge with App & API Protector and Bot Manager.*

Protecting your users and digital assets during high-impact campaigns is essential to building and safeguarding brand trust. It’s more important than ever to have security measures in place against potential cyber attacks and other malicious activities aimed at exploiting surges in traffic.

At the edge, Akamai’s [App & API Protector](https://www.akamai.com/products/app-and-api-protector) provides protection against unauthorized access attempts, data breaches, and numerous other potential vulnerabilities. Likewise, [Bot Manager](https://www.akamai.com/products/bot-manager) offers real-time threat detection, mitigation, and reporting.

## Reference Architecture

1.  Edge servers running [Ion](https://www.akamai.com/products/web-performance-optimization) deliver web content to end users, reduce DNS lookup time, and accelerate traffic to provide a fast and responsive user experience.

2.  [Image & Video Manager](https://www.akamai.com/products/image-and-video-manager) provides image optimization to increase performance while maintaining visible quality.

3.  Edge servers using App & API Protector and Bot Manager protect against established and emerging threats including DDsS, bot attacks, application and API attacks, and more.

4.  EdgeWorkers allow performance-sensitive compute workloads to be moved to the edge to reduce both latency and origin load.

5.  Queue-it waiting rooms allow for user prioritization and enhance the user experience during periods of extremely high traffic.

6.  TrafficPeak on Akamai provides near real-time visualization of event data.

7.  Akamai routes CDN traffic through designated edge servers. This allows customers to drop traffic from other sources and prevent attackers from bypassing edge-based protection.
{#high-impact-ad-arch .large-diagram}

![High-Impact Advertising Infrastructure Architecture](high-impact-ad-traffic-arch-1.svg?diagram-description-id=high-impact-ad-arch)

### Systems and Components

-  **App Performance (Ion):** Ion is a suite of intelligent performance optimizations and controls that help deliver superior end user experience.

-  **Image Optimization (Image & Video Manager):** Image & Video Manager allows customers to modify and optimize images and video in real time.

-  **Bot Manager:** A security tool designed to take action on bot activity at the edge and forward clean traffic to origin servers.

-  **App & API Protector:** A single security solution that combines multiple security technologies, including WAF, bot mitigation, API protection, and DDoS defense.

-  **Edge Computing (EdgeWorkers):** Akamai’s edge-based computing solution that allows customers to execute JavaScript functions in a serverless, low-latency environment.

-  **User Prioritization with Queue-it:** Queue-it is a virtual waiting room technology that helps customers control online traffic and provide fair user experiences.

-  **Load Testing (CloudTest):** CloudTest is a load testing tool that lets customers run peak traffic performance testing for environments at scale.

-  **TrafficPeak:** Akamai’s managed observability solution. Runs on Akamai Cloud infrastructure and is comprised of Compute Instances, Object Storage, and a visual Grafana dashboard for near real-time monitoring.
