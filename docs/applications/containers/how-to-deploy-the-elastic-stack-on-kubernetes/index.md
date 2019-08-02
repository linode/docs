---
author:
  name: Tyler Langlois
  email: ty@tjll.net
description: 'Learn how to install components of the Elastic Stack like Elasticsearch and Kibana on Kubernetes.'
keywords: ["elastic", "elasticsearch", "kibana", "kubernetes", "k8s", "elk", "helm"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-08-01
title: 'How to Deploy the Elastic Stack on Kubernetes'
external_resources:
  - '[Elastic Documentation](https://www.elastic.co/guide/index.html)'
---

## What is the Elastic Stack?

[The Elastic Stack](https://www.elastic.co/elk-stack) is a collection of open source projects that help collect and visualize a wide variety of data sources. Elasticsearch can store and aggregate data such as log files, container metrics, and more.

In this guide, you will deploy a number of [Helm](https://helm.sh) charts in a [Kubernetes](https://kubernetes.io/) cluster in order to set up components of the Elastic Stack. At the end of this guide, you will have a deployment installed and configured that you can further use for application logs or monitoring Kubernetes itself.

{{< caution >}}
This guide's example instructions will create several billable resources on your Linode account. If you do not want to keep using the example cluster that you create, be sure to delete the cluster when you have finished the guide.

If you remove the resources afterward, you will only be billed for the hour(s) that the resources were present on your account. Consult the [Billing and Payments](/docs/platform/billing-and-support/billing-and-payments/) guide for detailed information about how hourly billing works and for a table of plan pricing.
{{< /caution >}}

## Before You Begin

1.   [Install the Kubernetes CLI](https://kubernetes.io/docs/tasks/tools/install-kubectl/) (`kubectl`) on your computer, if it is not already.

1.   Follow the [How to Deploy Kubernetes on Linode with the k8s-alpha CLI](/docs/applications/containers/how-to-deploy-kubernetes-on-linode-with-k8s-alpha-cli/) guide to set up a Kubernetes cluster. This guide will use a three node cluster. You should use this guide instead of manual installation via a method such as `kubeadmin`, as the k8s-alpha tool will setup support for persistent volume claims. Node sizes are important when configuring Elasticsearch, and this guide assumes Linode 4GB instances.

    This guide also assumes that your cluster has [role-based access control (RBAC)](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) enabled. This feature became available in Kubernetes 1.6. It is enabled on clusters created via the `k8s-alpha` Linode CLI.

1.   You should also make sure that your Kubernetes CLI is using the right cluster context. Run the `get-contexts` subcommand to check:

        kubectl config get-contexts

1.  Set up Helm in your Kubernetes cluster by following the [How to Install Apps on Kubernetes with Helm
](/docs/applications/containers/how-to-install-apps-on-kubernetes-with-helm/) guide and stop following the steps in this guide upon reaching the [Use Helm Charts to Install Apps](/docs/applications/containers/how-to-install-apps-on-kubernetes-with-helm/#use-helm-charts-to-install-apps) section.

## Configure Helm

After following the prerequisites for this guide, you should have a Kubernetes cluster with Helm installed and configured.

1.  Add the `elastic` chart repository to your local installation of Helm:

        helm repo add elastic https://helm.elastic.co

1.  Fetch the updated list of charts from all configured chart repositories:

        helm repo update

1.  Search for the official `elasticsearch` chart to confirm Helm has been configured correctly. Note that this chart released by Elastic differs from the chart bundled with Helm.

        helm search elasticsearch --version 7

    This command should return results similar to the following. Note that your exact version numbers may be different.

        NAME                    CHART VERSION   APP VERSION     DESCRIPTION
        elastic/elasticsearch   7.3.0           7.3.0           Official Elastic helm chart for Elasticsearch

Your Helm environment is now prepared to install official Elasticsearch charts into your kubernetes cluster.

## Install Charts

### Install Elasticsearch

Before installing the chart, ensure that resources are set appropriately. By default, the `elasticsearch` chart allocates 1G of memory to the JVM heap and sets Kubernetes resource requests and limits to 2G. Using a Linode 4GB instance is compatible with these defaults, but if you are using a different instance type, you will need to provide different values to the chart at install time in order to ensure that running pods are within the resource constrains of the node sizes you have chosen.

1.  Install the `elasticsearch` chart. This command will wait to complete until all pods are started and ready:

        helm install --name elasticsearch --wait --timeout=600 elastic/elasticsearch

1.  A three-node Elasticsearch cluster is now configured and available locally to the Kubernetes cluster. To confirm this, first port-forward a local port to the Elasticsearch service. You should leave this command running in a terminal window or tab in in the background for the remainder of this tutorial.

        kubectl port-forward svc/elasticsearch-master 9200:9200

1.  In another terminal window, send a request to this port:

        curl http://localhost:9200/

1.  You should see a response similar to the following:

        {
          "name" : "elasticsearch-master-0",
          "cluster_name" : "elasticsearch",
          "cluster_uuid" : "o66WYOm5To2znbZ0kOkDUw",
          "version" : {
            "number" : "7.1.1",
            "build_flavor" : "default",
            "build_type" : "docker",
            "build_hash" : "7a013de",
            "build_date" : "2019-05-23T14:04:00.380842Z",
            "build_snapshot" : false,
            "lucene_version" : "8.0.0",
            "minimum_wire_compatibility_version" : "6.8.0",
            "minimum_index_compatibility_version" : "6.0.0-beta1"
          },
          "tagline" : "You Know, for Search"
        }

Note that your specific version numbers and dates may be different in this json response. Elasticsearch is operational, but not receiving or serving any data.

### Install Filebeat

In order to start processing data, deploy the `filebeat` chart to your Kubernetes cluster. This will collect all pod logs and store them in Elasticsearch, after which they can be searched and used in visualizations within Kibana.

1.  Deploy the `filebeat` chart. No custom `values.yaml` file should be necessary:

        helm install --name filebeat --wait --timeout=600 elastic/filebeat

1.  Confirm that Filebeat has started to index documents into Elasticsearch by sending a request to the locally-forwarded Elasticsearch service port:

        curl http://localhost:9200/_cat/indices

1.  At least one `filebeat` index should be present, similar to the following:

        green open filebeat-7.1.1-2019.06.25-000001 _7Rw8LkvTeKpJPly7cpzNw 1 1 9886 0 5.7mb 2.8mb

### Install Kibana

Kibana will provide a frontend to Elasticsearch and the data collected by Filebeat.

1.  Deploy the `kibana` chart:

        helm install --name kibana --wait --timeout=600 elastic/kibana

1.  Port-forward the `kibana-kibana` service in order to access Kibana locally. Leave this command running in the background as well for the remainder of this tutorial.

        kubectl port-forward svc/kibana-kibana 5601:5601

## Configure Kibana

Before visualizing pod logs, Kibana must be configured with an index pattern for Filebeat's indices.

1.  With the previous `port-forward` command running in another terminal window, open your browser and navigate to http://localhost:5601

1.  A page similar to the following should render in your browser.

    ![Initial Kibana Page](kibana-initial-page.png "Initial Kibana Page")

1.  To begin configuring index patterns, scroll down until the "Index Patterns" button appears, and select it.

    ![Kibana Home Page Index Patterns](kibana-home-page.png "Kibana Home Page Index Patterns")

1.  The Index Patterns page should be displayed. Select "Create index pattern" to begin.

    ![Kibana Index Patterns Page](kibana-index-patterns-initial.png "Kibana Index Patterns Page")

1.  From this page, enter "filebeat-*" into the "Index pattern" text box, then select the "Next step" button.

    ![Kibana Create Index Pattern](kibana-index-patterns-create.png "Kibana Create Index Pattern")

1.  In the following page, select `@timestamp` from the "Time Filter field name" dropdown menu, then select the "Create index pattern" button.

    ![Kibana Create Index Pattern](kibana-index-patterns-timestamp.png "Kibana Create Index Pattern")

1.  A page with the index pattern details will then be shown. Select the "Discover" tab from the sidebar to view incoming logs.

    ![Kibana Select Discover](kibana-to-discover-tab.png "Kibana Select Discover")

1.  The Discover tab provides a realtime view of logs as they are ingested by Elasticsearch from your Kubernetes cluster. The histogram provides a view of log volume over time, which by default spans for the last 15 minutes. The sidebar on the left side of the user interface displays various fields parsed from json fields sent by Filebeat to Elasticsearch.

1.  Use the "Filters" box to search only for logs arriving from Kibana pods by filtering for `kubernetes.container.name : "kibana"`. Note that when selecting the textbox, field names and values are auto-populated. Select the "Update" button to apply the search filter.

    ![Kibana Filter](kibana-kibana-filter.png "Kibana filter")

1.  In order to introspect a log event, select the expand arrow next to an event in the user interface.

    ![Kibana Open Log Event](kibana-expand-log.png "Kibana Open Log Event")

1.  Scroll down to view the entire log document in Kibana. Observe the fields provided by Filebeat, including the `message` field, which contains the stdout/stderr output from the container, as well as the kubernetes node and pod name.

    ![Kibana Log Document](kibana-expanded-log.png "Kibana Log Document")

1.  Look closely at the `message` field in the log representation and note that the text field is formatted as json. While the terms in this field can be searched with free text search terms in Kibana, parsing this field will generally yield better results. The following section explains how to configure Filebeat and Kibana to achieve this.

## Update Stack Configuration

At this point, the Elastic stack is functional and provides an interface to visualize and create dashboards for your logs from Kubernetes. This section will explain how to further enhance the various components of the stack for greater visibility.

1.  Create a values file for Filebeat. This configuration will add the ability to provide [autodiscover hints](https://www.elastic.co/guide/en/beats/filebeat/master/configuration-autodiscover-hints.html). Instead of changing the Filebeat configuration each time parsing differences are encountered, autodiscover hints permit fragments of Filebeat configuration to be defined at the pod level dynamically.

    {{< file "filebeat-values.yml" yaml >}}
---
filebeatConfig:
  filebeat.yml: |
    filebeat.autodiscover:
      providers:
        - type: kubernetes
          hints.enabled: true
    output.elasticsearch:
      hosts: '${ELASTICSEARCH_HOSTS:elasticsearch-master:9200}'
{{< /file >}}

1.  Upgrade the `filebeat` deployment to use this new configuration file:

        helm upgrade --values filebeat-values.yml --wait --timeout=600 filebeat elastic/filebeat

1.  Once this command completes, Filebeat's `DaemonSet` will have successfully updated all running pods.

1.  Next, create a Kibana values file to append annotations to the Kibana `Deployment` that will indicate that Filebeat should parse certain fields as json values.

    {{< file "kibana-values.yml" yaml >}}
---
podAnnotations:
  co.elastic.logs/processors.decode_json_fields.fields: message
  co.elastic.logs/processors.decode_json_fields.target: kibana
{{< /file >}}

1.  Upgrade the `kibana` Helm release in your Kubernetes cluster, passing this file as an argument for the Chart values.

        helm upgrade --values kibana-values.yml --wait --timeout=600 kibana elastic/kibana
