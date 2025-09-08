---
title: "Deploy Jaeger all-in-one through the Linode Marketplace"
description: "Learn how to deploy the all-in-one configuration of Jaeger, a CNCF distributed tracing system for monitoring and troubleshooting microservices architectures, on an Akamai Compute Instance."
published: 2025-09-04
modified: 2025-09-04
keywords: ['distributed tracing', 'tracing','microservices','monitoring','observability','jaeger','cncf']
tags: ["marketplace", "linode platform", "cloud manager"]
external_resources:
- '[Jaeger Official Documentation](https://www.jaegertracing.io/docs/)'
aliases: ['/products/tools/marketplace/guides/jaeger/','/guides/jaeger-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 1902904
marketplace_app_name: "Jaeger"
---

[Jaeger](https://www.jaegertracing.io/) is a CNCF distributed tracing system designed for monitoring and troubleshooting microservices-based distributed systems. It helps developers understand the architecture of complex systems through data-driven dependency diagrams, analyze request timelines, identify performance bottlenecks, and diagnose issues across service boundaries. Jaeger supports OpenTelemetry for instrumentation and provides a comprehensive platform for distributed trace collection, storage, and visualization.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Jaeger should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions**: Ubuntu 24.04 LTS
- **Recommended plan**: All plan types and sizes can be used. For production workloads handling high trace volumes, consider at least 4GB Shared Compute or higher for optimal performance.

### Jaeger Options

- **Administrator Username** *(required)*: Enter the username for accessing the Jaeger web interface. The default is `jaegeradmin`.
- **Administrator Email Address** *(required)*: Enter the email address for the Jaeger administrator account.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started after Deployment

### Accessing the Jaeger Web Interface

1.  Open your web browser and navigate to `https://[domain]`, where `[domain]` is the custom domain you entered during deployment or your Compute Instance's rDNS domain (such as `192-0-2-1.ip.linodeusercontent.com`). You can also use your IPv4 address, but this connection is not encrypted. To learn more about viewing IP addresses and rDNS, see the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/).

2.  Use the following credentials to log in:
    - **Username**: Enter the administrator username you configured during deployment. The default is `jaegeradmin`.
    - **Password**: Enter the password stored in the credentials file on your server. To obtain it, log in to your Compute Instance via SSH or Lish and run:
        ```command
        cat /home/$USER/.credentials
        ```

### Configuring Applications for Tracing

To send traces to your Jaeger instance, configure your applications to use [OpenTelemetry](https://opentelemetry.io/docs/) with the following endpoints:

#### OTLP gRPC Endpoint (Recommended)
- **Endpoint**: `https://[domain]:4317`
- **Protocol**: OTLP/gRPC with mTLS
- **Client Certificate Required**: Yes

#### OTLP HTTP Endpoint
- **Endpoint**: `https://[domain]:4318`
- **Protocol**: OTLP/HTTP with mTLS
- **Client Certificate Required**: Yes

{{< note >}}
Both trace ingestion endpoints require the mTLS client certificate authentication for security. Client certificates are located in `/etc/jaeger/tls/` on your server. You'll need to configure your applications with the appropriate client certificates to send traces to Jaeger.
{{< /note >}}

Configure your application to use:
- **Client Certificate**: `client-app-name-cert.pem`
- **Client Key**: `client-app-name-key.pem`
- **CA Certificate**: `ca-cert.pem`

### Badger Persistent Storage

Your Jaeger deployment uses [Badger](https://github.com/hypermodeinc/badger) as the persistent storage backend, ensuring trace data survives container restarts:

- **Storage Location**: `/var/lib/jaeger/badger` on the host system.
- **Container Mount**: `/badger` inside the Jaeger container.

{{% content "marketplace-update-note-shortguide" %}}