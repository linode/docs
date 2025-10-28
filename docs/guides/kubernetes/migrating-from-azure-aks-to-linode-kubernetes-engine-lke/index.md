---
slug: migrating-from-azure-aks-to-linode-kubernetes-engine-lke
title: "Migrating from Azure AKS to Linode Kubernetes Engine (LKE)"
description: "Learn how to migrate Kubernetes applications from Azure AKS to Linode Kubernetes Engine (LKE) using a sample REST API service."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2025-04-25
keywords: ['azure aks','azure aks alternatives','azure kubernetes alternatives','replace azure aks','replace azure kubernetes','migrate azure aks to linode','migrate azure kubernetes to linode','migrate kubernetes applications to linode','azure aks migration','azure kubernetes migration','azure aks replacement','azure kubernetes replacement']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

This guide walks you through the process of migrating an application from [Azure Kubernetes Service (AKS)](https://learn.microsoft.com/en-us/azure/aks/) to Linode Kubernetes Engine (LKE). An example REST API service is used to demonstrate the steps for migrating an application.

## Before You Begin

1.  Follow our [Getting Started](https://techdocs.akamai.com/cloud-computing/docs/getting-started) guide, and create an Akamai Cloud account if you do not already have one.

1.  Create a personal access token using the instructions in our [Manage personal access tokens](https://techdocs.akamai.com/cloud-computing/docs/manage-personal-access-tokens) guide.

1.  Install the Linode CLI using the instructions in the [Install and configure the CLI](https://techdocs.akamai.com/cloud-computing/docs/install-and-configure-the-cli) guide.

1.  Follow the steps in the *Install `kubectl`* section of the [Getting started with LKE](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-lke-linode-kubernetes-engine#install-kubectl) guide to install and configure `kubectl`.

1.  Ensure that you have access to your Azure account with sufficient permissions to work with AKS clusters. The [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) must also be installed and configured.

1.  Install [`jq`](docs/guides/using-jq-to-process-json-on-the-command-line/#install-jq-with-package-managers), a lightweight command line JSON processor.

1.  Install [`yq`](https://github.com/mikefarah/yq), a YAML processor for the command line.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Connect `kubectl` to Your AKS Cluster

[Connect `kubectl` to the AKS cluster](https://learn.microsoft.com/en-us/azure/aks/control-kubeconfig-access) that you want to migrate. Skip this step if your local machine is already using a kubeconfig file with your AKS cluster information.

1.  In the Azure portal, search the available services for the **Kubernetes services** option and navigate to that page:

    ![Azure portal interface highlighting the Kubernetes services navigation option.](azure-portal-kubernetes-services-navigation.png)

1.  Find the name and resource group of your AKS cluster. In the example below, the cluster name is `aks-go-cluster`, and its resource group is `my-aks-group`:

    ![Azure portal showing AKS cluster name 'aks-go-cluster' and resource group 'my-aks-group'.](azure-aks-cluster-name-resource-group.png)

1.  Use the Azure CLI to update your local kubeconfig file with your AKS cluster information, replacing {{< placeholder "AKS_RESOURCE_GROUP" >}} and {{< placeholder "AKS_CLUSTER_NAME" >}} with your actual resource group and cluster name:

    ```command
    az aks get-credentials \
      --resource-group {{< placeholder "AKS_RESOURCE_GROUP" >}} \
      --name {{< placeholder "AKS_CLUSTER_NAME" >}} \
      --admin
    ```

    ```output
    The behavior of this command has been altered by the following extension: aks-preview
    Merged "{{< placeholder "AKS_CLUSTER_NAME" >}}" as current context in /home/user/.kube/config
    ```

1.  If your `kubeconfig` file includes multiple clusters, use the following command to list the available contexts:

    ```command
    kubectl config get-contexts
    ```

1.  Identify the context name for your AKS cluster, and set it to the active context. Replace the values with those of your cluster:

    ```command
    kubectl config use-context {{< placeholder "AKS_CLUSTER_CONTEXT_NAME" >}}
    ```

### Assess Your AKS Cluster

1.  Verify the AKS cluster is operational using `kubectl`:

    ```command
    kubectl cluster-info
    ```

    ```output
    Kubernetes control plane is running at {{< placeholder "AKS_CONTROL_PLANE_URL" >}}
    CoreDNS is running at {{< placeholder "AKS_DNS_URL" >}}
    Metrics-server is running at {{< placeholder "AKS_METRICS_URL" >}}

    To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
    ```

1.  If you wish to see more detailed cluster information, run the following command:

    ```command
    kubectl cluster-info dump
    ```

{{< note >}}
Detailed information about your cluster is also available in the Azure portal.

![Azure portal displaying detailed overview information for an AKS cluster.](azure-aks-cluster-overview-details.png)
{{< /note >}}

### Review the Cluster Nodes

1.  List the nodes in your cluster:

    ```command
    kubectl get nodes
    ```

    ```output
    NAME            STATUS   ROLES    AGE   VERSION
    {{< placeholder "AKS_NODE_NAME" >}}   Ready    <none>   11m   v1.30.6
    ```

1.  To retrieve detailed information about the node in YAML format, run the following command. Replace {{< placeholder "AKS_NODE_NAME" >}} with the name of your AKS node:

    ```command
    kubectl get node {{< placeholder "AKS_NODE_NAME" >}} -o yaml
    ```

1.  You can also run the previous command through a pipe to filter for specific fields (e.g. allocatable CPU and memory):

    ```command
    kubectl get node {{< placeholder "AKS_NODE_NAME" >}} -o yaml \
      | yq '.status.allocatable | {"cpu": .cpu, "memory": .memory}' \
      | awk -F': ' ' /cpu/ {cpu=$2} /memory/ {mem=$2} \
          END {printf "cpu: %s\nmemory: %.2f Gi\n", cpu, mem / 1024 / 1024}'
    ```

    ```output
    cpu: 1900m
    memory: 4.92 Gi
    ```

### Verify the Application Is Running

To illustrate an application running in a production environment, a [REST API service application written in Go](https://github.com/linode/docs-cloud-projects/tree/main/demos/go-quote-service-main) is deployed to the example AKS cluster. If you already have one or more applications running on your AKS cluster, you may skip this section.

The function of the REST API service allows you to add quotes (string) to a stored list, or to retrieve that list. Deploying the application creates a Kubernetes [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/), [Service](https://kubernetes.io/docs/concepts/services-networking/service/), and [HorizontalPodAutoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/).

Follow the steps below to install, configure, and test the REST API service application on your AKS cluster.

1.  Use a command line text editor such as `nano` to create a Kubernetes manifest file that defines the application and its supporting resources:

    ```command
    nano manifest.yaml
    ```

    Give the file the following contents:

    ```file {title="manifest.yaml" lang="yaml"}
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: go-quote
      labels:
        app: go-quote
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: go-quote
      template:
        metadata:
          labels:
            app: go-quote
        spec:
          containers:
            - name: go-quote
              image: linodedocs/go-quote-service:latest
              ports:
                - containerPort: 7777
              resources:
                requests:
                  cpu: "100m"
                  memory: "128Mi"
                limits:
                  cpu: "250m"
                  memory: "256Mi"
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: go-quote-service
      labels:
        app: go-quote
    spec:
      type: LoadBalancer
      ports:
        - port: 80
          targetPort: 7777
      selector:
        app: go-quote
    ---
    apiVersion: autoscaling/v2
    kind: HorizontalPodAutoscaler
    metadata:
      name: go-quote-hpa
      labels:
        app: go-quote
    spec:
      scaleTargetRef:
        apiVersion: apps/v1
        kind: Deployment
        name: go-quote
      minReplicas: 1
      maxReplicas: 1
      metrics:
        - type: Resource
          resource:
            name: cpu
            target:
              type: Utilization
              averageUtilization: 50
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Apply the manifest to deploy the application on your AKS cluster:

    ```command
    kubectl apply -f manifest.yaml
    ```

    ```output
    deployment.apps/go-quote created
    service/go-quote-service created
    horizontalpodautoscaler.autoscaling/go-quote-hpa created
    ```

1.  With the application deployed, run the following `kubectl` command to verify that the deployment is available:

    ```command
    kubectl get deploy
    ```

    ```output
    NAME       READY   UP-TO-DATE   AVAILABLE   AGE
    go-quote   1/1     1            1           46s
    ```

1.  Run the following `kubectl` command to retrieve the external IP address assigned to the service:

    ```command
    kubectl get services
    ```

    The service is a [LoadBalancer](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer), which means it can be accessed from outside the cluster:

    ```output
    NAME               TYPE           CLUSTER-IP            EXTERNAL-IP            PORT(S)        AGE
    go-quote-service   LoadBalancer   {{< placeholder "GO_QUOTE_CLUSTER_IP" >}}   {{< placeholder "GO_QUOTE_EXTERNAL_IP" >}}   80:30398/TCP   83s
    kubernetes         ClusterIP      {{< placeholder "K8S_CLUSTER_IP" >}}        <none>                 443/TCP        2m14s
    ```

1.  Test the service by adding a quote, replacing {{< placeholder "GO_QUOTE_EXTERNAL_IP" >}} with the `EXTERNAL_IP` of your `LoadBalancer`:

    ```command
    curl -X POST \
      --data '{"quote":"This is my first quote."}' \
      {{< placeholder "GO_QUOTE_EXTERNAL_IP" >}}/quotes
    ```

1.  Add a second quote:

    ```command
    curl -X POST \
      --data '{"quote":"This is my second quote."}' \
      {{< placeholder "GO_QUOTE_EXTERNAL_IP" >}}/quotes
    ```

1.  Now retrieve the stored quotes:

    ```command
    curl {{< placeholder "GO_QUOTE_EXTERNAL_IP" >}}/quotes
    ```

    This should yield the following result:

    ```output
    ["This is my first quote.","This is my second quote."]
    ```

After verifying that your AKS cluster is fully operational and running a live service, you are ready for migration.

## Provision an LKE Cluster

When migrating from AKS to LKE, provision an LKE cluster with similar resources to run the same workloads. While there are several ways to create a Kubernetes cluster on Akamai Cloud, this guide uses the [Linode CLI](https://techdocs.akamai.com/cloud-computing/docs/cli) to provision resources.

See our [LKE documentation](https://techdocs.akamai.com/cloud-computing/docs/create-a-cluster) for instructions on how to provision a cluster using Cloud Manager.

1.  Use the Linode CLI (`linode-cli`) to see available Kubernetes versions:

    ```command
    linode-cli lke versions-list
    ```

    ```output
    ┌──────┐
    │ id   │
    ├──────┤
    │ 1.32 │
    ├──────┤
    │ 1.31 │
    └──────┘
    ```

    Unless specific requirements dictate otherwise, it’s generally recommended to provision the latest version of Kubernetes.

1.  Determine the type of Linode to provision. The example AKS cluster configuration uses nodes with two CPUs and 8 GB of memory. To find a Linode type with a similar configuration, run the following command with the Linode CLI:

    ```command
    linode-cli linodes types --vcpus 2 --json --pretty \
      | jq '.[] | {class, id, vcpus, memory, price}'
    ```

    ```output
    {
      "class": "standard",
      "id": "g6-standard-2",
      "vcpus": 2,
      "memory": 4096,
      "price": { ... }
    }
    {
      "class": "highmem",
      "id": "g7-highmem-1",
      "vcpus": 2,
      "memory": 24576,
      "price": { ... }
    }
    {
      "class": "highmem",
      "id": "g7-highmem-2",
      "vcpus": 2,
      "memory": 49152,
      "price": { ... }
    }
    {
      "class": "dedicated",
      "id": "g6-dedicated-2",
      "vcpus": 2,
      "memory": 4096,
      "price": { ... }
    }
    {
      "class": "premium",
      "id": "g7-premium-2",
      "vcpus": 2,
      "memory": 4096,
      "price": { ... }
    }
    ```

    See [Akamai Cloud: Pricing](https://www.linode.com/pricing/) for more detailed pricing information.

1.  The examples in this guide use the **g6-standard-2** Linode, which features two CPU cores and 4 GB of memory. Run the following command to display detailed information in JSON for this Linode plan:

    ```command
    linode-cli linodes types --label "Linode 4GB" --json --pretty
    ```

    ```output
    [
      {
        "addons": { ... },
        "class": "standard",
        "disk": 81920,
        "gpus": 0,
        "id": "g6-standard-2",
        "label": "Linode 4GB",
        "memory": 4096,
        "network_out": 4000,
        "price": { ... },
        "region_prices": [ ... ],
        "successor": null,
        "transfer": 4000,
        "vcpus": 2
      }
    ]
    ```

1.  View available regions with the `regions list` command:

    ```command
    linode-cli regions list
    ```

1.  After selecting a Kubernetes version and Linode type, use the following command to create a cluster named `aks-to-lke` in the `us-mia` (Miami, FL) region with three nodes and auto-scaling. Replace `aks-to-lke` and `us-mia` with a cluster label and region of your choosing, respectively:

    ```command
    linode lke cluster-create \
    --label aks-to-lke \
    --k8s_version 1.32 \
    --region us-mia \
    --node_pools '[{
      "type": "g6-standard-2",
      "count": 1,
      "autoscaler": {
        "enabled": true,
        "min": 1,
        "max": 3
      }
    }]'
    ```

    After creating your cluster successfully, you should see output similar to the following:

    ```output
    Using default values: {}; use the --no-defaults flag to disable defaults
    ┌────────┬────────────┬────────┬─────────────┬──────────────────────────┬──────┐
    │ id     │ label      │ region │ k8s_version │ control_plane.high_avai… │ tier │
    ├────────┼────────────┼────────┼─────────────┼──────────────────────────┼──────┤
    │ 343326 │ aks-to-lke │ us-mia │ 1.32        │ False                    │      │
    └────────┴────────────┴────────┴─────────────┴──────────────────────────┴──────┘
    ```

## Access the Kubernetes Cluster

To access your cluster, fetch the cluster credentials as a `kubeconfig` file. Your cluster's `kubeconfig` can also be [downloaded via the Cloud Manager](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-lke-linode-kubernetes-engine#access-and-download-your-kubeconfig).

1.  Use the following command to retrieve the cluster’s ID:

    ```command
    CLUSTER_ID=$(linode-cli lke clusters-list --json | \
      jq -r \
        '.[] | select(.label == "aks-to-lke") | .id')
    ```

1.  Retrieve the `kubeconfig` file and save it to `~/.kube/lke-config`:

    ```command
    linode-cli lke kubeconfig-view --json "$CLUSTER_ID" | \
      jq -r '.[0].kubeconfig' | \
      base64 --decode > ~/.kube/lke-config
    ```

1.  After saving the `kubeconfig`, access your cluster by using `kubectl` and specifying the file:

    ```command
    kubectl get nodes --kubeconfig ~/.kube/lke-config
    ```

    ```output
    NAME            STATUS   ROLES    AGE   VERSION
    {{< placeholder "LKE_NODE_NAME" >}}   Ready    <none>   85s   v1.32.0
    ```

    One node is ready, and it uses Kubernetes version 1.32.

1.  Next, verify the cluster's health and readiness for application deployment.

    ```command
    kubectl cluster-info --kubeconfig ~/.kube/lke-config
    ```

    ```output
    Kubernetes control plane is running at {{< placeholder "LKE_CONTROL_PLANE_URL" >}}
    KubeDNS is running at {{< placeholder "LKE_DNS_URL" >}}

    To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
    ```

## Migrate from AKS to LKE

In some cases, migrating Kubernetes applications requires an incremental approach, as moving large interconnected systems all at once isn’t always practical.

For example, if **Service A** interacts with **Services B, C, and D**, you may be able to migrate **Services A and B** together to LKE, where they can communicate efficiently. However, **Services C and D** may still rely on Azure infrastructure or native services, making their migration more complex.

In this scenario, you may need to temporarily run **Service A** on both Azure AKS and LKE. **Service A on LKE** would interact with **Service B on LKE**, while the version on **Service A on Azure AKS** continues communicating with **Services C and D**. This setup minimizes disruptions while you work through the complexities of migrating the remaining services to LKE. Although cross-cloud communication may incur higher latency and costs, this approach helps maintain functionality during the transition.

This guide covers the key steps required to migrate the example application from AKS to LKE.

### Assess Current Workloads and Dependencies in AKS

Ensure that `kubectl` uses the original `kubeconfig` file with the AKS cluster context.

If necessary, you may need to re-save your AKS cluster's `kubeconfig` file path to your `$KUBECONFIG` environment variable.

```command
kubectl get all --context {{< placeholder "AKS_CLUSTER_CONTEXT_NAME" >}}
```

The output shows the running pod and the one active replica set created by the deployment:

```output
NAME                      READY   STATUS    RESTARTS   AGE
pod/go-quote-{{< placeholder "POD_SUFFIX" >}}   1/1     Running   0          97s

NAME                       TYPE           CLUSTER-IP            EXTERNAL-IP            PORT(S)        AGE
service/go-quote-service   LoadBalancer   {{< placeholder "GO_QUOTE_CLUSTER_IP" >}}  {{< placeholder "GO_QUOTE_EXTERNAL_IP" >}}   80:30398/TCP   97s
service/kubernetes         ClusterIP      {{< placeholder "K8S_CLUSTER_IP" >}}       <none>                 443/TCP        22m

NAME                       READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/go-quote   1/1     1            1           97s

NAME                                          DESIRED   CURRENT   READY   AGE
replicaset.apps/go-quote-{{< placeholder "REPLICA_SET_SUFFIX" >}}   1         1         1       97s

NAME                                               REFERENCE             TARGETS              MINPODS   MAXPODS   REPLICAS   AGE
horizontalpodautoscaler.autoscaling/go-quote-hpa   Deployment/go-quote   cpu: <unknown>/50%   1         1         1          98s
```

{{< note >}}
By default, `kubectl get all` only displays resources in the `default` namespace. If your workloads are deployed in a different namespace (recommended for production clusters), use:

```command
kubectl get all --namespace={{< placeholder "YOUR_NAMESPACE" >}}
```
{{< /note >}}

### Export Kubernetes Manifests of Azure AKS

There are multiple ways to define the resources you want to deploy to Kubernetes, including YAML manifests, Kustomize configurations, and Helm charts. For consistency and version control, store these in a git repository and deploy them via your CI/CD pipeline. The guide uses plain YAML manifests as the example.

### Update Manifests for Compatibility with LKE

You may need to update your manifests to accommodate for differences between AKS and LKE. For example, your configuration on AKS may use [ingress services from AKS](https://learn.microsoft.com/en-us/azure/aks/concepts-network-ingress) and the [Azure LoadBalancer Service](https://learn.microsoft.com/en-us/azure/aks/concepts-network-services#loadbalancer) to provide access to clients located outside of your AKS cluster. As an alternative to using these Azure services, you can [deploy a dedicated NGINX Ingress on LKE](/docs/guides/deploy-nginx-ingress-on-lke/).

The deployment image may point to Azure Container Registry. Modify this to point to an alternative registry. For example, the `Deployment` section of your application manifest may look like this:

```file
apiVersion: apps/v1
kind: Deployment
metadata:
...
spec:
  ...
  template:
    ...
    spec:
      containers:
        - name: go-quote
          image: gqimages.azurecr.io/go-quote-service:latest
          ...
```

The container image, pointing to Microsoft Container Registry, has the following format:

```command
{{< placeholder "REGISTRY_NAME" >}}.azurecr.io/{{< placeholder "IMAGE_NAME" >}}:{{< placeholder "TAG" >}}
```

To migrate away from Azure Container Registry, upload the container image to another registry service (e.g. Docker Hub) or [Set Up a Docker Registry with LKE and Object Storage](/docs/guides/how-to-setup-a-private-docker-registry-with-lke-and-object-storage/). Then, modify your Kubernetes manifest to point to the new location for your image.

{{< note >}}
Since the image for the example service application in this guide comes from Docker Hub, redirecting the registry is unnecessary.
{{< /note >}}

### Transfer Persistent Data

If the workload depends on persistent data in Azure Storage or a database, then transfer the data or make it available to LKE. See the following guides for more information:

- [How to Migrate From Azure Blob Storage to Linode Object Storage](/docs/guides/migrate-from-azure-blob-storage-to-linode-object-storage/)
- [Migrate From Azure Disk Storage to Linode Block Storage](/docs/guides/migrate-from-azure-disk-storage-to-linode-block-storage/)

{{< note >}}
The example application, with its in-memory configuration, does not rely on any persistent data.
{{< /note >}}

### Deploy Workloads to LKE

Deploy your application to the newly created LKE cluster.

1.  Verify the current `kubectl` context to ensure you are pointing to the `kubeconfig` file for the LKE cluster. This may require re-saving your LKE `kubeconfig` file's path to your `$KUBECONFIG` environment variable.

    ```command
    kubectl config current-context --kubeconfig ~/.kube/lke-config
    ```

    ```output
    {{< placeholder "LKE_CLUSTER_CONTEXT_NAME" >}}
    ```

1.  Apply the same `manifest.yaml` file used to deploy your application to AKS, but this time on your LKE cluster:

    ```command
    kubectl apply --kubeconfig ~/.kube/lke-config -f manifest.yaml
    ```

    ```output
    deployment.apps/go-quote created
    service/go-quote-service created
    horizontalpodautoscaler.autoscaling/go-quote-hpa created
    ```

### Validate Application Functionality

Verify that the deployment and the service were created successfully. The steps below validate and test the functionality of the example REST API service.

1.  With the application deployed, run the following `kubectl` command to verify that the deployment is available:

    ```command
    kubectl get deploy --kubeconfig ~/.kube/lke-config
    ```

    ```output
    NAME       READY   UP-TO-DATE   AVAILABLE   AGE
    go-quote   1/1     1            1           108s
    ```

1.  Run the following `kubectl` command to retrieve the external IP address assigned to the service:

    ```command
    kubectl get service --kubeconfig ~/.kube/lke-config
    ```

    The service exposes a public IP address to the REST API service (e.g. `172.235.44.28`):

    ```output
    NAME               TYPE           CLUSTER-IP           EXTERNAL-IP            PORT(S)        AGE
    go-quote-service   LoadBalancer   {{< placeholder "GO_QUOTE_CLUSTER_IP" >}}  {{< placeholder "GO_QUOTE_EXTERNAL_IP" >}}   80:30407/TCP   117s
    kubernetes         ClusterIP      {{< placeholder "K8S_CLUSTER_IP" >}}       <none>                 443/TCP        157m
    ```

1.  Test the service by adding a quote, replacing {{< placeholder "GO_QUOTE_EXTERNAL_IP" >}} with the actual external IP address of your load balancer:

    ```command
    curl -X POST \
      --data '{"quote":"This is my first quote for LKE."}' \
      {{< placeholder "GO_QUOTE_EXTERNAL_IP" >}}/quotes
    ```

1.  Add a second quote:

    ```command
    curl -X POST \
      --data '{"quote":"This is my second quote for LKE."}' \
      {{< placeholder "GO_QUOTE_EXTERNAL_IP" >}}/quotes
    ```

1.  Now retrieve the stored quotes:

    ```command
    curl {{< placeholder "GO_QUOTE_EXTERNAL_IP" >}}/quotes
    ```

    ```output
    ["This is my first quote for LKE.","This is my second quote for LKE."]
    ```

The example REST API service is up and running on LKE.

Depending on your application, point any services dependent on the AKS cluster deployment to the LKE cluster deployment instead. After testing and verifying your application is running on LKE, you can terminate your AKS cluster.

## Additional Considerations and Concerns

When migrating from Azure AKS to LKE, there are several important factors to keep in mind, including cost management, data persistence, networking, security, and alternative solutions for cloud-specific services.

### Cost Management

Cost reduction is one reason an organization might migrate from Azure AKS to LKE. Typically, the compute cost of Kubernetes can be a primary driver for migration. Use `kubectl` to find the instance type and capacity type for your AKS instance.

```command
kubectl get node {{< placeholder "AKS_NODE_NAME" >}} -o yaml \
  | yq .metadata.labels \
  | grep node.kubernetes.io/instance-type
```

```output
node.kubernetes.io/instance-type: {{< placeholder "AKS_INSTANCE_TYPE" >}}
```

Reference the [Windows VM pricing page](https://azure.microsoft.com/en-us/pricing/details/virtual-machines/windows/) to find the cost for the Azure VM powering your AKS instance. Compare this with the cost of a Linode instance with comparable resources by examining [our pricing page](https://www.linode.com/pricing/).

Additionally, applications with substantial data egress can be significantly impacted by egress costs. Consider the typical networking usage of applications running on your AKS cluster, and determine your outbound [costs for Azure bandwidth](https://azure.microsoft.com/en-us/pricing/details/bandwidth/#pricing). Compare this with data transfer limits allocated to your LKE nodes.

### Data Persistence and Storage

Cloud-native workloads are ephemeral. As a container orchestration platform, Kubernetes is designed to ensure your pods are up and running, with autoscaling to handle demand. However, it’s important to handle persistent data carefully. If you are in a position to impose a large maintenance window with system downtime, migrating workloads can be a simpler task.

Should you need to perform a live migration with minimal downtime, you must develop proper migration procedures and test them in a non-production environment. This may include:

-   Parallel storage and databases on both clouds
-   Cross-cloud replication between storage and databases
-   Double writes at the application level
-   Failover reads at the application level
-   Switching the Azure storage and databases to read-only
-   Storage and database indirection at the configuration or DNS level

### Advanced Network Configuration

The Azure network model includes virtual networks, Azure Firewall, and different types of load balancers. For LKE, Akamai Cloud provides [NodeBalancers](https://www.linode.com/products/nodebalancers/), which are equivalent to application load balancers. If you use advanced features of Azure networking, adapting them to Akamai Cloud networking may require significant configuration changes.

For network security, you may need to port Azure Firewall rules to [Kubernetes Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) on LKE.

### Security and Access Management

Azure AKS integrates Entra ID (formerly known as Azure Active Directory) with Kubernetes access. LKE uses standard Kubernetes user and service accounts, as well as [Kubernetes role-based access control (RBAC)](https://kubernetes.io/docs/reference/access-authn-authz/rbac/).

### DNS

If you use an independent DNS provider for your application, you must update various DNS records to point to LKE endpoints and NodeBalancers instead of AKS endpoints.

If you use Azure DNS and plan to migrate away from it, [our DNS Manager](https://techdocs.akamai.com/cloud-computing/docs/dns-manager) may be a migration option.

### Alternative to Azure Container Registry

LKE doesn't have its own container registry. To migrate away from Azure Container Registry, set up a third-party private container registry, such as [Docker Hub](https://hub.docker.com/) or [GitHub Container Registry](https://github.blog/news-insights/product-news/introducing-github-container-registry/).

Alternatively, you can set up your own container registry, see [How to Set Up a Docker Registry with LKE and Object Storage](/docs/guides/how-to-setup-a-private-docker-registry-with-lke-and-object-storage/) for instructions.

### Alternative to Azure Monitor

Microsoft uses [Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/) for Kubernetes cluster observability. With Akamai Cloud, you can install an alternative observability solution on LKE. One example of such a solution is [The Observability Stack (TOBS)](https://github.com/timescale/tobs), which includes:

-   Kube-Prometheus
    -   Prometheus
    -   AlertManager
    -   Grafana
    -   Node-Exporter
    -   Kube-State-Metrics
    -   Prometheus-Operator
-   Promscale
-   TimescaleDB
    -   Postgres-Exporter
-   OpenTelemetry-Operator

See the following guides for more information:

- [Migrating From Azure Monitor to Prometheus and Grafana on Akamai](/docs/guides/migrating-from-azure-monitor-to-prometheus-and-grafana-on-akamai/)
- [How to Deploy TOBS (The Observability Stack) on LKE](/docs/guides/deploy-tobs-on-linode-kubernetes-engine/)

### Alternative to Azure Key Vault

The [Azure Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/overview) can be leveraged to provide Kubernetes secrets on Azure. With LKE, you need an alternative solution, such as [OpenBao on Akamai Cloud](/docs/marketplace-docs/guides/openbao/).