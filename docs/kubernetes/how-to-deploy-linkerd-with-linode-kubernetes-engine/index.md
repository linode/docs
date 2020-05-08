---
author:
  name: Linode
  email: docs@linode.com
description: 'Linkerd is a service mesh and a platform with its own API and feature set that can help you run a distributed microservice architecture. Linkerd is a tool that you can deploy with few to no code changes to your application allowing you to harness its power without disrupting your development cycle. In conjunction with Kubernetes, Linkerd provides you with insights into your cluster leading to more control over your applications.'
keywords: ['kuberenetes','linkerd','container', 'service mesh', 'k8s']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-11-07
modified_by:
  name: Linode
title: "How to Deploy Linkerd 2 with Linode Kubernetes Engine"
h1_title: "Deploying Linkerd 2 with Linode Kubernetes Engine"
contributor:
  name: Linode
external_resources:
- '[Linkerd](https://linkerd.io)'
- '[Linkerd Documentation](https://linkerd.io/2/overview/)'
- '[Linkerd Frequently Asked Questions](https://linkerd.io/2/faq/)'
- '[Linkerd Slack](https://slack.linkerd.io/#_ga=2.178870372.1577931415.1588870876-1893863222.1588769574)'
---

[Linkerd 2](https://linkerd.io) is an ultra lightweight service mesh that offers monitoring, reporting, and encrypted connections between Kubernetes services without disturbing your existing applications. It does this by employing proxy sidecars along each instance.

Unlike [Istio](/docs/kubernetes/how-to-deploy-istio-with-kubernetes/), another service mesh monitoring tool, it provides it's own proxies written in Rust instead of using Envoy. This makes it both lighter and more secure.

{{< note >}}
Linkerd 1.x is still available and is being actively developed as a separate project. However, it is built on the "Twitter stack" and is not for Kubernetes. Linkerd 2 is built in Rust and Go and only supports Kubernetes.
{{</ note >}}

In this guide you will complete the following tasks:

- [Create a Kubernetes Cluster](#create-your-lke-cluster)
- [Install the Linkerd CLI](#install-linkerd)
- [Install the Linkerd Control Plane](#install-linkerd-control-plane)
- [Install a Demo Application (Optional)](#install-demo-application-optional)

{{< caution >}}
This guide’s example instructions will create several billable resources on your Linode account. If you do not want to keep using the example cluster that you create, be sure to delete it when you have finished the guide.

If you remove the resources afterward, you will only be billed for the hour(s) that the resources were present on your account. Consult the [Billing and Payments](/docs/platform/billing-and-support/billing-and-payments/)  guide for detailed information about how hourly billing works and for a table of plan pricing.
{{</ caution >}}

## Before You Begin

Familiarize yourself with Kubernetes using our series [A Beginner's Guide to Kubernetes](/docs/kubernetes/beginners-guide-to-kubernetes/) and [Advantages of Using Kubernetes](/docs/kubernetes/kubernetes-use-cases/).

## Create Your LKE Cluster

Follow the instructions in our [Deploying and Managing a Cluster with Linode Kubernetes Engine Tutorial](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/) to create an LKE cluster.

{{< note >}}
Linkerd 2 requires Kubernetes version 1.13+. Linode Kubernetes Engine clusters currently support Kubernetes versions 1.15, 1.16, and 1.17.
{{</ note >}}

## Install Linkerd

Linkerd consists of multiple parts.

- The [command-line interface](#install-the-linkerd-cli) is run on your local machine and allows you to install, update, and interact with the control and data planes.
- The [control plane](#install-linkerd-control-plane) is a set of services that collect the data, provide the user-facing API, and control the proxies.
- The [data plane](#the-data-plane) which is the collection of proxies.

For a more detailed overview, see the Linkerd [architecture](https://linkerd.io/2/reference/architecture/).

### Install the Linkerd CLI

1.  To control Linkerd you need to have the CLI installed on your local machine. The Linkerd CLI is available for Linux, macOS, and Windows directly on the [release page](https://github.com/linkerd/linkerd2/releases/).

    - For Linux, you can use the curl command for installation:

            curl -sL https://run.linkerd.io/install | sh

    - For macOS, you can use Homebrew:

            brew install linkerd

1.  Verify the install by checking the version:

        linkerd version

1.  Add Linkerd to your path:

        export PATH=$PATH:$HOME/.linkerd2/bin

1.  Use the following command to ensure that Linkerd will install correctly onto your cluster. If there are any error messages, Linkerd provides links to help you properly configure your cluster.

        linkerd check --pre

    {{< output >}}
kubernetes-api
--------------
√ can initialize the client
√ can query the Kubernetes API

kubernetes-version
------------------
√ is running the minimum Kubernetes API version
√ is running the minimum kubectl version

pre-kubernetes-setup
--------------------
√ control plane namespace does not already exist
√ can create non-namespaced resources
√ can create ServiceAccounts
√ can create Services
√ can create Deployments
√ can create CronJobs
√ can create ConfigMaps
√ can create Secrets
√ can read Secrets
√ no clock skew detected

pre-kubernetes-capability
-------------------------
√ has NET_ADMIN capability
√ has NET_RAW capability

linkerd-version
---------------
√ can determine the latest version
√ cli is up-to-date

Status check results are √
{{</ output >}}

### Install Linkerd Control Plane

1.  The following command installs the Linkerd control plane onto your cluster into it's own namespace, `linkerd`:

        linkerd install | kubectl apply -f -

    This command generates a Kubernetes manifest and control plane resources. It then pipes the manifest to `kubectl apply` which instructs Kubernetes to add these resources to your cluster.

1.  Once this is done, you can validate it by running the following command:

        linkerd check

    {{< output >}}
kubernetes-api
--------------
√ can initialize the client
√ can query the Kubernetes API

kubernetes-version
------------------
√ is running the minimum Kubernetes API version
√ is running the minimum kubectl version

linkerd-existence
-----------------
√ 'linkerd-config' config map exists
√ heartbeat ServiceAccount exist
√ control plane replica sets are ready
√ no unschedulable pods
√ controller pod is running
√ can initialize the client
√ can query the control plane API

linkerd-config
--------------
√ control plane Namespace exists
√ control plane ClusterRoles exist
√ control plane ClusterRoleBindings exist
√ control plane ServiceAccounts exist
√ control plane CustomResourceDefinitions exist
√ control plane MutatingWebhookConfigurations exist
√ control plane ValidatingWebhookConfigurations exist
√ control plane PodSecurityPolicies exist

linkerd-identity
----------------
√ certificate config is valid
√ trust roots are using supported crypto algorithm
√ trust roots are within their validity period
√ trust roots are valid for at least 60 days
√ issuer cert is using supported crypto algorithm
√ issuer cert is within its validity period
√ issuer cert is valid for at least 60 days
√ issuer cert is issued by the trust root

linkerd-api
-----------
√ control plane pods are ready
√ control plane self-check
√ [kubernetes] control plane can talk to Kubernetes
√ [prometheus] control plane can talk to Prometheus
√ tap api service is running

linkerd-version
---------------
√ can determine the latest version
√ cli is up-to-date

control-plane-version
---------------------
√ control plane is up-to-date
√ control plane and cli versions match

Status check results are √
{{</ output >}}

1.  Check what components are installed and running:

        kubectl -n linkerd get deploy

    {{< output >}}
NAME                     READY   UP-TO-DATE   AVAILABLE   AGE
linkerd-controller       1/1     1            1           106s
linkerd-destination      1/1     1            1           106s
linkerd-grafana          1/1     1            1           104s
linkerd-identity         1/1     1            1           107s
linkerd-prometheus       1/1     1            1           105s
linkerd-proxy-injector   1/1     1            1           104s
linkerd-sp-validator     1/1     1            1           104s
linkerd-tap              1/1     1            1           103s
linkerd-web              1/1     1            1           105s
{{</ output >}}

    You can read about what each of these services do in the Linkerd [architechure documentation](https://linkerd.io/2/reference/architecture/#control-plane).

### The Data Plane

Each control plane compontent has a proxy installed in their pod and therefore is also part of the data plane. This will allow you to take a look at what's going on with the dashboard and other tools that Linkerd has to offer.

### The Dashboards

Linkerd comes with two dashboards, it's own, and [Grafana](https://grafana.com), both are backed by metrics data gathered by [Prometheus](https://prometheus.io).

1.  Linkerd comes with a standalone dashboard that runs in the browser. You can start and view it by running the following command:

        linkerd dasboard &

    {{< output >}}
Linkerd dashboard available at:
http://localhost:50750
Grafana dashboard available at:
http://localhost:50750/grafana
Opening Linkerd dashboard in the default browser
{{</ output >}}

    - This command sets up a port forward from the `linkerd-web` pod.

    - If you want to expose the dashboard for others to use as well, you will need to add an [ingress controller](/docs/kubernetes/how-to-deploy-nginx-ingress-on-linode-kubernetes-engine/).

1.  The dashboard opens in the browser. If it does not, you can access it by going to http://localhost:50750:

    ![Linkerd Browser Dashboard](linkerd-browser-dashboard.png "Linkerd Browser Dashboard")

1.  The Grafana dashboard is included with Linkerd and is available at `http://localhost:50750/grafana`.

    ![Grafana Browser Dashboard](linkerd-grafana-dashboard.png "Grafana Browser Dashboard")

1.  You can checkout the traffic that the dashboard is using by running the following command:

        linkerd -n linkerd top deploy/linkerd-web

    To see what the other pods are doing, replace `linkerd-web` with a different pod name, for example, to check on Grafana, use, `linkerd-grafana`.

## Install Demo Application (Optional)

Linkerd has a application available called *emojivoto* that you can use to demonstrate what it would be like to deploy Linkerd along with a functioning application.

1.  To install the emojivoto application, run the following curl command:

        curl -sL https://run.linkerd.io/emojivoto.yml | kubectl apply -f -

    This installs emojivoto into the `emojivoto` namespace.

1.  Forward the `web-svc` service locally to port `8080`:

        kubectl -n emojivoto port-forward svc/web-svc 8080:80

1.  Visit the application in your browser at `http://localhost:8080`.

    {{< note >}}
Some parts of the application are broken by design. There is a [debugging guide](https://linkerd.io/2/debugging-an-app/) located on the Linkerd site if you are curious.
{{</ note >}}

1.  Add Linkerd to the emojivoto application with the following command:

        kubectl get -n emojivoto deploy -o yaml | linkerd inject - | kubectl apply -f -

    This gathers all the deployments in the `emojivoto` namespace, pipes the manifest to `linkerd inject` which adds it's proxies to the container specs, and then applies it to the cluster.

1.  Issue the following command to verify that the proxies have been applied:

        linkerd -n emojivoto check --proxy

    {{< output >}}
kubernetes-api
--------------
√ can initialize the client
√ can query the Kubernetes API

kubernetes-version
------------------
√ is running the minimum Kubernetes API version
√ is running the minimum kubectl version

linkerd-existence
-----------------
√ 'linkerd-config' config map exists
√ heartbeat ServiceAccount exist
√ control plane replica sets are ready
√ no unschedulable pods
√ controller pod is running
√ can initialize the client
√ can query the control plane API

linkerd-config
--------------
√ control plane Namespace exists
√ control plane ClusterRoles exist
√ control plane ClusterRoleBindings exist
√ control plane ServiceAccounts exist
√ control plane CustomResourceDefinitions exist
√ control plane MutatingWebhookConfigurations exist
√ control plane ValidatingWebhookConfigurations exist
√ control plane PodSecurityPolicies exist

linkerd-identity
----------------
√ certificate config is valid
√ trust roots are using supported crypto algorithm
√ trust roots are within their validity period
√ trust roots are valid for at least 60 days
√ issuer cert is using supported crypto algorithm
√ issuer cert is within its validity period
√ issuer cert is valid for at least 60 days
√ issuer cert is issued by the trust root

linkerd-identity-data-plane
---------------------------
√ data plane proxies certificate match CA

linkerd-api
-----------
√ control plane pods are ready
√ control plane self-check
√ [kubernetes] control plane can talk to Kubernetes
√ [prometheus] control plane can talk to Prometheus
√ tap api service is running

linkerd-version
---------------
√ can determine the latest version
√ cli is up-to-date

linkerd-data-plane
------------------
√ data plane namespace exists
√ data plane proxies are ready
√ data plane proxy metrics are present in Prometheus
√ data plane is up-to-date
√ data plane and cli versions match

Status check results are √
{{</ output >}}

1.  You can get live traffic metrics by running the following command:

        linkerd -n emojivoto stat deploy

    {{< output >}}
NAME       MESHED   SUCCESS      RPS   LATENCY_P50   LATENCY_P95   LATENCY_P99   TCP_CONN
emoji         1/1   100.00%   2.0rps           1ms           1ms           1ms          2
vote-bot      1/1         -        -             -             -             -          -
voting        1/1    83.05%   1.0rps           1ms           1ms           1ms          2
web           1/1    91.38%   1.9rps           6ms          11ms          18ms          2
{{</ output >}}

1.  To dig deeper, try the following commands:

        linkerd -n emojivoto top deploy
        linkerd -n emojivoto tap deploy/web

    You can also use the graphical dashboards view to show you these items in the browser.
