---
title: "Deploy the Elastic Stack through the Linode Marketplace"
description: "This guide helps you configure the Elastic Stack using the Akamai Compute Marketplace."
published: 2025-12-05
modified: 2025-12-05
keywords: ['elk stack', 'elk', 'kibana', 'logstash', 'elasticsearch', 'logging', 'siem', 'cluster', 'elastic stack']
tags: ["marketplace", "linode platform", "cloud manager", "elk", "logging"]
aliases: ['/products/tools/marketplace/guides/elastic-stack/']
external_resources:
- '[Elastic Stack Documentation](https://www.elastic.co/docs)'
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 804144
marketplace_app_name: "Elastic Stack"
---
## Cluster Deployment Architecture

!["Elastic Stack Cluster Architecture"](elasticstack-overview.png "Elastic Stack Cluster Architecture")

The Elastic Stack is a unified observability platform that brings together search, data processing, and visualization through Elasticsearch, Logstash, and Kibana. It provides an end-to-end pipeline for ingesting, transforming, indexing, and exploring operational data at scale. Elasticsearch delivers distributed search and analytics with near real-time indexing, while Logstash enables flexible data collection and enrichment from diverse sources. Kibana offers an interactive interface for visualizing log streams, building dashboards, and performing advanced analysis.

This solution is well-suited for log aggregation, application monitoring, infrastructure observability, and security analytics. Its open architecture and extensive ecosystem make it adaptable to a wide range of use cases—including distributed system debugging, SIEM workflows, API performance monitoring, and centralized logging.

This Marketplace application stands up a multi-node Elastic Stack cluster using an automated deployment script configured by Akamai.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note title="Estimated deployment time" >}}
Your cluster should be fully installed within 5-10 minutes with a cluster of 5 nodes. Larger clusters may take longer to provision, and you can use the formula, 8 minutes per 5 nodes, to estimate completion time.
{{< /note >}}

## Configuration Options

### Elastic Stack Options

- **Linode API Token** *(required)*: Your API token is used to deploy additional Compute Instances as part of this cluster. At a minimum, this token must have Read/Write access to *Linodes*. If you do not yet have an API token, see [Get an API Access Token](/docs/products/platform/accounts/guides/manage-api-tokens/) to create one.

- **Email address (for the Let's Encrypt SSL certificate)** *(required)*: Your email is used for Let's Encrypt renewal notices. A valid SSL certificate is validated through certbot and installed on the Kibana instance in the cluster. This allows you to visit Kibana securely through a browser.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

#### TLS/SSL Certificate Options

The following fields are used when creating the self-signed TLS/SSL certificates for the cluster.

- **Country or region** *(required)*: Enter the country or region for you or your organization.
- **State or province** *(required)*: Enter the state or province for you or your organization.
- **Locality** *(required)*: Enter the town or other locality for you or your organization.
- **Organization** *(required)*: Enter the name of your organization.
- **Email address** *(required)*: Enter the email address you wish to use for your certificate file.
- **CA Common name:** This is the common name for the self-signed Certificate Authority.

#### Picking The Correct Instance Plan and Size

In the **Cluster Settings** section you can designate the size for each component in your Elastic deployment. The size of the cluster depends on your needs--if you are looking for a faster deployment, stick with the defaults provided.

- **Kibana Size**: This deployment creates a single Kibana instance with Let's Encrypt certificates. This option cannot be changed.
- **Elasticsearch Cluster Size**: The total number of nodes in your Elasticsearch cluster.
- **Logstash Cluster Size**: The total number of nodes in your Logstash cluster.

Next, associate your Elasticsearch and Logstash clusters with a corresponding instance plan option.

- **Elasticsearch Instance Type**: This is the plan type used for your Elasticsearch cluster.
- **Logstash Instance Type**: This is the plan type used for your Logstash cluster.

{{< note title="Kibana Instance Type" >}}
In order to choose the Kibana instance, you first need to select a deployment region and then pick a plan from the **[Linode Plan](https://techdocs.akamai.com/cloud-computing/docs/create-a-compute-instance#choose-a-linode-type-and-plan)** section.
{{< /note >}}

#### Additional Configuration

- **Filebeat IP addresses allowed to access Logstash**: If you have existing Filebeat agents already installed, you can provide their IP addresses for an allowlist. The IP addresses must be comma separated.

- **Logstash username to be created for index**: This is the username that is created and can access index below. This is created so that you can begin ingesting logs after deployment.

- **Elasticsearch index to be created for log ingestion**: This lets you start ingesting logs. Edit the index name for your specific use-case. For example, if you have WordPress application you want to perform log aggregation for, the index name `wordpress-logs` would be appropriate.

## Getting Started After Deployment

### Accessing Elastic Frontend

Once you cluster has finished deploying, you can log into your Elastic cluster using your local browser.

1.  Log into the provisioner node as your limited sudo user, replacing `{{< placeholder "USER" >}}` with the sudo username you created, and `{{< placeholder "IP_ADDRESS" >}}` with your instance's IPv4 address:

    ```command
    ssh {{< placeholder "USER" >}}@{{< placeholder "IP_ADDRESS" >}}
    ```

1.  Open the `.credentials` file with the following command. Replace `{{< placeholder "USER" >}}` with your sudo username:

    ```command
    sudo cat /home/{{< placeholder "USER" >}}/.credentials
    ```

1.  In the `.credentials` file, locate the Kibana URL. Paste the URL into your browser of choice, and you should be greeted with a login page.

    !["Elastic Login Page"](elastic-login.png "Elastic Login Page")

1.  To access the console, enter `elastic` as the username along with the password posted in the `.credentials` file. A successful login redirects you to the welcome page. From there you are able to add integrations, visualizations, and make other config changes.

    !["Elastic Welcome Page"](elastic-home.png "Elastic Welcome Page")

#### Configure Filebeat (Optional)

Follow the next steps if you already have Filebeat configured on a system.

1.  Create a backup of your `/etc/filebeat/filebeat.yml` configuration:

    ```command
    cp /etc/filebeat/filebeat.yml{,.bak}
    ```

1.  Update your Filebeat inputs:

    ```file {title="/etc/filebeat/filebeat.yml" lang="yaml"}
    filebeat.inputs:

    # Each - is an input. Most options can be set at the input level, so
    # you can use different inputs for various configurations.
    # Below are the input-specific configurations.

    # filestream is an input for collecting log messages from files.
    - type: filestream

      # Unique ID among all inputs, an ID is required.
      id: web-01

      # Change to true to enable this input configuration.
      #enabled: false
      enabled: true

      # Paths that should be crawled and fetched. Glob based paths.
      paths:
        - /var/log/apache2/access.log
    ```

    In this example, the `id` must be unique to the instance so you know the source of the log. Ideally this should be the hostname of the instance, and this example uses the value **web-01**. Update `paths` to the log that you want to send to Logstash.

1.  While in the `/etc/filebeat/filebeat.yml`, update the Filebeat output directive:

    ```file {title="/etc/filebeat/filebeat.yml" lang="yaml"}
    output.logstash:
      # Logstash hosts
      hosts: ["logstash-1.example.com:5044", "logstash-2.example.com:5044"]
      loadbalance: true

      # List of root certificates for HTTPS server verifications
      ssl.certificate_authorities: ["/etc/filebeat/certs/ca.pem"]
    ```

    The `hosts` param can be the IP addresses of your Logstash host or a FQDN. In this example, **logstash-1.example.com** and **logstash-2.example.com** are added to the `/etc/hosts` file.

1.  Add a CA certificate by adding the contents of the `ca.crt` certificate file to `/etc/filebeat/certs/ca.pem`. You can obtain the `ca.crt` from any node in the cluster. Once you've added the certificate to your `ca.pem` file, restart the Filebeat service:

    ```command
    systemctl start filebeat
    systemctl enable filebeat
    ```

Once complete, you should be able to start ingesting logs into your cluster using the index you created.