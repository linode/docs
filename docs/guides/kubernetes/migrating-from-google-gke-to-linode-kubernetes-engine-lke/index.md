---
slug: migrating-from-google-gke-to-linode-kubernetes-engine-lke
title: "Migrating from Google GKE to Linode Kubernetes Engine (LKE)"
description: "Learn how to migrate Kubernetes applications from Google GKE to Linode Kubernetes Engine (LKE) using a simple example and clear steps."
authors: ["Linode"]
contributors: ["Linode"]
published: 2025-02-03
keywords: ['gke','google kubernetes engine','google gke alternatives','google kubernetes alternatives','gcp kubernetes alternatives','replace google gke','replace google kubernetes','replace gcp kubernetes','migrate google gke to linode','migrate google kubernetes to linode','migrate gcp kubernetes to linode','migrate kubernetes applications to linode','google gke migration','google kubernetes migration','gcp kubernetes migration','google gke replacement','google kubernetes replacement','gcp kubernetes replacement']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

This guide walks you through the process of migrating an application from Google Kubernetes Engine (GKE) on Google Cloud Platform (GCP) to Linode Kubernetes Engine (LKE). To keep the scope of this guide manageable, the example application is a simple REST API service.

## Before You Begin

1.  Read the [Getting Started with Linode](https://techdocs.akamai.com/cloud-computing/docs/getting-started) guide and create a Linode account if you do not already have one.

1.  Create a personal access token using the instructions in the [Manage personal access tokens](https://techdocs.akamai.com/cloud-computing/docs/manage-personal-access-tokens) guide.

1.  Install the Linode CLI using the instructions in the [Install and configure the CLI](https://techdocs.akamai.com/cloud-computing/docs/install-and-configure-the-cli) guide.

1.  Follow the steps in the *Install `kubectl`* section of the [Getting started with LKE](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-lke-linode-kubernetes-engine#install-kubectl) guide to install `kubectl`.

1.  Ensure that you have access to your GCP account with sufficient permissions to work with GKE clusters. The [gcloud CLI](https://cloud.google.com/sdk/docs/install) must also be installed and configured.

1.  Install [`jq`](docs/guides/using-jq-to-process-json-on-the-command-line/#install-jq-with-package-managers), a lightweight command line JSON processor.

1.  Install [`yq`](https://github.com/mikefarah/yq), a YAML processor for the command line.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Connect `kubectl` to Your GKE Cluster

[Connect `kubectl` to the GKE cluster](https://cloud.google.com/sdk/gcloud/reference/container/clusters/get-credentials) that you want to migrate. Skip this step if your local machine already has a `kubeconfig` file with your GKE cluster information.

1.  In the Google Cloud console, navigate to the **Kubernetes Engine** service, to the **Clusters** page:

    ![Google Cloud console showing the Kubernetes Engine clusters page.](gcp-kubernetes-engine-clusters-page.png)

1.  Find the name and location of your GKE cluster:

    ![Details panel in Google Cloud showing the name and location of a GKE cluster.](gcp-gke-cluster-name-and-location.png)

    In the example above, the cluster name is `test-cluster`, and its location is `us-west3`.

1.  Use the gcloud CLI to update your local `kubeconfig` file with your GKE cluster information:

    ```command
    gcloud container clusters \
        get-credentials test-cluster --location=us-west3
    ```

    ```output
    Fetching cluster endpoint and auth data. kubeconfig entry generated for test-cluster.
    ```

1.  If your `kubeconfig` file includes multiple clusters, use the following command to list the available contexts:

    ```command
    kubectl config get-contexts
    ```

1.  Identify the context name for your GKE cluster, then set it to the active context, for example:

    ```command
    kubectl config use-context \
        gke_gke-to-lke_us-west3_test-cluster
    ```

### Assess Your GKE Cluster

1.  Run the following `kubectl` command to verify that the GKE cluster is operational:

    ```command
    kubectl cluster-info
    ```

    ```output
    Kubernetes control plane is running at https://34.106.155.168
    GLBCDefaultBackend is running at https://34.106.155.168/api/v1/namespaces/kube-system/services/default-http-backend:http/proxy
    KubeDNS is running at https://34.106.155.168/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
    Metrics-server is running at https://34.106.155.168/api/v1/namespaces/kube-system/services/https:metrics-server:/proxy
    To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
    ```

1.  For more detailed information at the command line, run this command:

    ```command
    kubectl cluster-info dump
    ```

{{< note >}}
Detailed information about your cluster is also available in the Google Cloud console.

![Google Cloud console displaying detailed information about a GKE cluster.](gcp-gke-cluster-details-panel.png)
{{< /note >}}

### Provisioned Nodes Depend on Workloads

With GKE clusters in Autopilot mode (as in the above example), there are no nodes unless workloads are running in the cluster. When the cluster is created, one node is created, but this node is removed shortly after.

1.  List the nodes in your cluster:

    ```command
    kubectl get nodes
    ```

    ```output
    No resources found
    ```

    This is a feature of GKE Autopilot clusters, which scale the entire cluster to zero when no workloads are running.

1.  List the pods running across all namespaces:

    ```command
    kubectl get pods -A \
        -o custom-columns='NAMESPACE:.metadata.namespace,NAME:.metadata.name'
    ```

    Although system pods are pending at this stage, they do not trigger a scale up until application workloads are present:

    ```output
    NAMESPACE         NAME
    gke-gmp-system    alertmanager-0
    gke-gmp-system    gmp-operator-5bc8795cdf-zzsg8
    gke-gmp-system    rule-evaluator-7888d55887-pv4w8
    gke-managed-cim   kube-state-metrics-0
    kube-system       antrea-controller-horizontal-autoscaler-5cdc558796-22bp9
    kube-system       egress-nat-controller-85f6f977dd-fbxcj
    kube-system       event-exporter-gke-8bfd444fb-mnxl5
    kube-system       konnectivity-agent-79bbb5c5c4-ld7lj
    kube-system       konnectivity-agent-autoscaler-6c6ffbcf45-phjww
    kube-system       kube-dns-76f855548f-8xplr
    kube-system       kube-dns-autoscaler-6f896b6968-rhjxb
    kube-system       l7-default-backend-74c4b886f7-94xr9
    kube-system       metrics-server-v1.30.3-56bfbfd6db-xs2ps
    kube-system       metrics-server-v1.30.3-7bfbf95754-s9ldc
    ```

### Verify the Application Is Running

For this guide, a [REST API service application written in Go](https://github.com/the-gigi/go-quote-service) is deployed to the example GKE cluster. This service allows you to add a quote (a string) to a stored list, or to retrieve that list. Deploying the application creates a Kubernetes [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/), [Service](https://kubernetes.io/docs/concepts/services-networking/service/), and [HorizontalPodAutoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/).

The manifest (`manifest.yaml`) for deploying this application is as follows:

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
          image: g1g1/go-quote-service:latest
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

1.  With the application deployed, run the following `kubectl` command to verify that the deployment is available:

    ```command
    kubectl get deploy
    ```

    ```output
    NAME       READY   UP-TO-DATE   AVAILABLE   AGE
    go-quote   1/1     1            1           40s
    ```

1.  Run the following `kubectl` command to retrieve the external IP address assigned to the service:

    ```command
    kubectl get services
    ```

    The service is a [LoadBalancer](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer), which means it can be accessed from outside the cluster:

    ```output
    NAME               TYPE           CLUSTER-IP       EXTERNAL-IP     PORT(S)        AGE
    go-quote-service   LoadBalancer   34.118.229.116   34.106.133.10   80:30972/TCP   5m37s
    kubernetes         ClusterIP      34.118.224.1     <none>          443/TCP        29m
    ```

1.  With workloads running, you can now verify that a node has been provisioned:

    ```command
    kubectl get nodes
    ```

    ```output
    NAME                                          STATUS     ROLES    AGE   VERSION
    gk3-test-cluster-nap-1np6k37u-5baac581-mwqs   NotReady   <none>   7s    v1.30.6-gke.1125000
    ```

1.  To retrieve more information about this node, run the following command:

    ```command
    kubectl get node gk3-test-cluster-nap-1np6k37u-5baac581-mwqs -o yaml
    ```

    {{< note >}}
    The above command retrieves all the information about the node in YAML format. To filter for specific fields, such as allocatable CPU and memory, run the previous command through a pipe:

    ```command
    kubectl get node gk3-test-cluster-nap-1np6k37u-5baac581-mwqs -o yaml \
      | yq '.status.allocatable | {"cpu": .cpu, "memory": .memory}' \
      | awk -F': ' ' /cpu/ {cpu=$2} /memory/ {mem=$2} \
          END {printf "cpu: %s\nmemory: %.2f Gi\n", cpu, mem / 1024 / 1024}'
    ```

    ```output
    cpu: 1930m
    memory: 5.82 Gi
    ```
    {{< /note >}}

1.  Test the service by adding a quote:

    ```command
    curl -X POST \
      --data '{"quote":"This is my first quote."}' \
      {{< placeholder "IP_ADDRESS" >}}/quotes
    ```

1.  Add a second quote:

    ```command
    curl -X POST \
      --data '{"quote":"This is my second quote."}' \
      {{< placeholder "IP_ADDRESS" >}}/quotes
    ```

1.  Now retrieve the stored quotes:

    ```command
    curl {{< placeholder "IP_ADDRESS" >}}/quotes
    ```

    This should yield the following result:

    ```output
    ["This is my first quote.","This is my second quote."]
    ```

After verifying that your GKE cluster is fully operational and running a live service, you are ready for migration.

## Provision an LKE Cluster

When migrating from GKE to LKE, provision an LKE cluster with similar resources to run the same workloads. While there are several ways to create a Kubernetes cluster on Akamai Cloud, this guide uses the [Linode CLI](https://github.com/linode/linode-cli) to provision resources.

1.  Use the Linode CLI (`linode`) to see available Kubernetes versions:

    ```command
    linode lke versions-list
    ```

    ```output
    ┌──────┐
    │ id   │
    ├──────┤
    │ 1.32 │
    ├──────┤
    │ 1.31 │
    ├──────┤
    │ 1.30 │
    └──────┘
    ```

    Unless specific requirements dictate otherwise, it’s generally recommended to provision the latest version of Kubernetes.

1.  Determine the type of Linode to provision. The example GKE cluster configuration uses nodes with two CPUs and 8 GB of memory. To find a Linode type with a similar configuration, run the following command with the Linode CLI:

    ```command
    linode linodes types --vcpus 2 --json --pretty \
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

    See [Akamai Connected Cloud: Pricing](https://www.linode.com/pricing/) for more detailed pricing information.

1.  The examples in this guide use the `g6-standard-2` Linode, which features two CPU cores and 4 GB of memory. Run the following command to display detailed information in JSON for this Linode plan:

    ```command
    linode linodes types --label "Linode 4GB" --json --pretty
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
    linode regions list
    ```

1.  After selecting a Kubernetes version and Linode type, use the following command to create a cluster named `gke-to-lke` in the `us-mia` (Miami, FL) region with three nodes and auto-scaling. Replace `gke-to-lke` and `us-mia` with a cluster label and region of your choosing, respectively:

    ```command
    linode lke cluster-create \
      --label gke-to-lke \
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
    │ 343326 │ gke-to-lke │ us-mia │ 1.32        │ False                    │      │
    └────────┴────────────┴────────┴─────────────┴──────────────────────────┴──────┘
    ```

## Access the Kubernetes Cluster

To access your cluster, fetch the cluster credentials as a `kubeconfig` file.

1.  Use the following command to retrieve the cluster’s ID:

    ```command
    CLUSTER_ID=$(linode lke clusters-list --json | \
      jq -r \
        '.[] | select(.label == "eks-to-lke") | .id')
    ```

1.  Retrieve the `kubeconfig` file and save it to `~/.kube/lke-config`:.

    ```command
    linode lke kubeconfig-view --json "$CLUSTER_ID" | \
      jq -r '.[0].kubeconfig' | \
      base64 --decode > ~/.kube/lke-config
    ```

1.  After saving the `kubeconfig`, access your cluster by using `kubectl` and specifying the file:

    ```command
    kubectl get nodes --kubeconfig ~/.kube/lke-config
    ```

    ```output
    NAME                            STATUS   ROLES    AGE   VERSION
    lke289125-478490-4569f8b60000   Ready    <none>   85s   v1.32.0
    ```

    One node is ready, and it uses Kubernetes version 1.32.

1.  Next, verify the cluster's health and readiness for application deployment.

    ```command
    kubectl cluster-info --kubeconfig ~/.kube/lke-config
    ```

    ```output
    Kubernetes control plane is running at https://fa127859-38c1-4e40-971d-b5c7d5bd5e97.us-lax-2.linodelke.net:443
    KubeDNS is running at https://fa127859-38c1-4e40-971d-b5c7d5bd5e97.us-lax-2.linodelke.net:443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

    To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
    ```

## Migrate from Google GKE to LKE

In some cases, migrating Kubernetes applications requires an incremental approach, as moving large interconnected systems all at once isn’t always practical.

For example, if **Service A** interacts with **Services B, C, and D**, you may be able to migrate **Services A and B** together to LKE, where they can communicate efficiently. However, **Services C and D** may still rely on GCP infrastructure or native services, making their migration more complex.

In this scenario, you may need to temporarily run **Service A** in both Google GKE and LKE. **Service A on LKE** would interact with **Service B on LKE**, while the version of **Service A on Google GKE** continues communicating with **Services C and D**. This setup minimizes disruptions while you work through the complexities of migrating the remaining services to LKE. Although cross-cloud communication incurs higher latency and costs, this approach helps maintain functionality during the transition.

This guide covers the key steps required to migrate the example application from GKE to LKE.

### Assess Current Workloads and Dependencies in Google GKE

Ensure that `kubectl` uses the original `kubeconfig` file with the GKE cluster context.

```command
kubectl get all --context gke_gke-to-lke_us-west3_test-cluster
```

The output shows the running pod and the one active replica set created by the deployment:

```output
NAME                            READY   STATUS    RESTARTS   AGE
pod/go-quote-7b747d5f8f-pc2cd   1/1     Running   0          3h36m

NAME                       TYPE           CLUSTER-IP       EXTERNAL-IP     PORT(S)        AGE
service/go-quote-service   LoadBalancer   34.118.229.116   34.106.133.10   80:30972/TCP   3h36m
service/kubernetes         ClusterIP      34.118.224.1     <none>          443/TCP        3h59m

NAME                       READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/go-quote   1/1     1            1           3h36m

NAME                                  DESIRED   CURRENT   READY   AGE
replicaset.apps/go-quote-7b747d5f8f   1         1         1       3h36m

NAME                                               REFERENCE             TARGETS       MINPODS   MAXPODS   REPLICAS   AGE
horizontalpodautoscaler.autoscaling/go-quote-hpa   Deployment/go-quote   cpu: 0%/50%   1         1         1          3h36m
```

{{< note >}}
By default, `kubectl get all` only displays resources in the `default` namespace. If your workloads are deployed in a different namespace (recommended for production clusters), use:

```command
kubectl get all --namespace={{< placeholder "YOUR_NAMESPACE" >}}
```
{{< /note >}}

### Export Kubernetes Manifests of Google GKE

There are multiple ways to define the resources you want to deploy to Kubernetes, including YAML manifests, Kustomize configurations, and Helm charts. For consistency and version control, store these in a git repository and deploy them via your CI/CD pipeline. The guide uses plain YAML manifests as the example.

### Update Manifests for Compatibility with LKE

You may need to update your manifests to accommodate for differences between GKE and LKE. For example, your configuration on GKE may use the [Ingress Controller for Google Cloud](https://github.com/kubernetes/ingress-gce) and the [External LoadBalancer Service](https://cloud.google.com/kubernetes-engine/docs/concepts/service-load-balancer) to provide access to clients located outside of your Google Cloud VPC. As an alternative to using these GCP load balancer and ingress services, you can [deploy a dedicated NGINX Ingress on LKE](/docs/guides/deploy-nginx-ingress-on-lke/).

The deployment image may point to GCP Artifact Registry. Modify this to point to an alternative registry. For example, the `Deployment` section of your application manifest may look like this:

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
          image: us-west3-docker.pkg.dev/myproj/gq/go-quote-service:latest
          ...
```

The container image, pointing to GCP Artifact Registry, has the following format:

```command
{{< placeholder "REGION" >}}-docker.pkg.dev/{{< placeholder "PROJECT_ID" >}}/{{< placeholder "REPOSITORY_NAME" >}}/{{< placeholder "IMAGE_NAME" >}}:{{< placeholder "TAG" >}}
```

To migrate away from GCP Artifact Registry, upload the container image to another registry service (e.g. Docker Hub) or [Set Up a Docker Registry with LKE and Object Storage](/docs/guides/how-to-setup-a-private-docker-registry-with-lke-and-object-storage/). Then, modify your Kubernetes manifest to point to the new location for your image.

{{< note >}}
Since the image for the example service application in this guide comes from Docker Hub, redirecting the registry is unnecessary.
{{< /note >}}

### Transfer Persistent Data

If the workload depends on persistent data in Google Cloud Storage or a database, then transfer the data or make it available to LKE.

{{< note >}}
The example application, with its in-memory configuration, does not rely on any persistent data.
{{< /note >}}

### Deploy Workloads to LKE

Deploy your application to the newly created LKE cluster.

1.  Verify the current `kubectl` context to ensure you are pointing to the `kubeconfig` file for the LKE cluster.

    ```command
    kubectl config current-context --kubeconfig ~/.kube/lke-config
    ```

    ```output
    lke289125-ctx
    ```

1.  Apply the same `manifest.yaml` file used to deploy your application to GKE, but this time on your LKE cluster:

    ```command
    kubectl apply --kubeconfig ~/.kube/lke-config -f manifest.yaml
    ```

    ```output
    deployment.apps/go-quote created
    service/go-quote-service created
    horizontalpodautoscaler.autoscaling/go-quote-hpa created
    ```

### Validate Application Functionality

Verify that the deployment and the service were created successfully

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
    NAME               TYPE           CLUSTER-IP       EXTERNAL-IP     PORT(S)        AGE
    go-quote-service   LoadBalancer   10.128.183.194   172.235.44.28   80:30407/TCP   117s
    kubernetes         ClusterIP      10.128.0.1       <none>          443/TCP        157m
    ```

1.  Test the service by adding a quote:

    ```command
    curl -X POST \
      --data '{"quote":"This is my first quote for LKE."}' \
      172.235.44.28/quotes
    ```

1.  Add a second quote:

    ```command
    curl -X POST \
      --data '{"quote":"This is my second quote for LKE."}' \
      172.235.44.28/quotes
    ```

1.  Now retrieve the stored quotes:

    ```command
    curl 172.235.44.28/quotes
    ```

    ```output
    ["This is my first quote for LKE.","This is my second quote for LKE."]
    ```

The REST API service is up and running on LKE. Point any services dependent on the GKE cluster deployment to the LKE cluster deployment instead. After testing and verifying the application running on LKE, you can terminate the GKE cluster.

## Additional Considerations and Concerns

When migrating from GCP GKE to LKE, there are several important factors to keep in mind, including cost management, data persistence, networking, security, and alternative solutions for cloud-specific services.

### Cost Management

Cost reduction is one reason an organization might migrate from GCP GKE to LKE. Typically, the compute cost of Kubernetes is the primary driver for migration. Use `kubectl` to find the instance type and capacity type for your GKE instance.

```command
kubectl get node gk3-test-cluster-nap-1np6k37u-5baac581-mwqs -o yaml \
  | yq .metadata.labels \
  | grep node.kubernetes.io/instance-type
```

```output
node.kubernetes.io/instance-type: e2-standard-2
```

This is an `e2-standard-2` instance of the GCP compute engine. Referencing [Google’s VM instance pricing page](https://cloud.google.com/compute/vm-instance-pricing), the hourly cost for this type of instance in the `us-west3` region is **$0.080486**.

![Google Cloud VM instance pricing table showing cost for e2-standard-2 instance in us-west3 region.](gcp-e2-standard-2-pricing-table.png)

The example Linode instance used in this guide has two CPU cores and 4 GB of memory. Referencing the [Linode pricing page](https://www.linode.com/pricing/), the hourly cost of this instance for a shared CPU plan is **$0.036**.

![Linode pricing table showing cost for shared CPU plan with 2 CPU cores and 4 GB of memory.](linode-shared-cpu-pricing-table.png)

For a dedicated CPU plan, the cost is $0.054 per hour.

![Linode pricing table showing cost for dedicated CPU plan with 2 CPU cores and 4 GB of memory.](linode-dedicated-cpu-pricing-table.png)

Additionally, applications with substantial data egress can be significantly impacted by egress costs. For example, outbound [data transfer costs for the GCP standard tier](https://cloud.google.com/vpc/network-pricing#vpc-pricing?#:~:text=Standard%20Tier%20pricing) are $0.085 per GB between 200 GB and 10 TB of transfer in a month. An application with outbound data of 1 TB in a month incurs a cost of **$68**.

![Google Cloud networking pricing table showing standard tier outbound data transfer costs.](gcp-egress-data-transfer-costs.png)

In contrast, both the shared and dedicated CPU plans for the example Linode instance chosen include monthly data transfer of 4 TB for free.

### Data Persistence and Storage

Cloud-native workloads are ephemeral. As a container orchestration platform, Kubernetes is designed to ensure your pods are up and running, with autoscaling to handle demand. However, it’s important to handle persistent data carefully. If you are in a position to impose a large maintenance window with system downtime, migrating data should be far simpler.

Should you need to perform a live migration with minimal downtime, you must develop proper migration procedures and test them in a non-production environment. This may include:

-   Parallel storage and databases on both clouds
-   Cross-cloud replication between storage and databases
-   Double writes at the application level
-   Failover reads at the application level
-   Switching the GCP storage and databases to read-only
-   Storage and database indirection at the configuration or DNS level

### Advanced Network Configuration

The GCP network model includes virtual private clouds (VPCs), virtual private networks (VPNs), and different types of load balancers. For LKE, Akamai Cloud provides [NodeBalancers](https://www.linode.com/products/nodebalancers/), which are equivalent to application load balancers. If you use advanced features of GCP networking, adapting them to Akamai Cloud networking may require significant configuration changes.

For network security, you may need to port GCP VPC firewall rules to [Kubernetes Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) on LKE.

### Security and Access Management

Google GKE integrates Google Cloud Identity and Access Management (IAM) with Kubernetes access. LKE uses standard Kubernetes user and service accounts, as well as [Kubernetes role-based access control (RBAC)](https://kubernetes.io/docs/reference/access-authn-authz/rbac/).

### DNS

If you use an independent DNS provider (e.g. Cloudflare) for your application, you must update various DNS records to point to LKE endpoints and NodeBalancers instead of GCP endpoints.

If you use Google Cloud DNS and plan to migrate away from it, reference [Linode’s DNS manager](https://techdocs.akamai.com/cloud-computing/docs/dns-manager) as a migration option.

### Alternative to GCP Artifact Registry

LKE doesn't have its own container registry. To migrate away from GCP Artifact Registry, set up a third-party private container registry, such as [Docker Hub](https://hub.docker.com/) or [GitHub Container Registry](https://github.blog/news-insights/product-news/introducing-github-container-registry/).

Alternatively, you can set up your own container registry, see [How to Set Up a Docker Registry with LKE and Object Storage](/docs/guides/how-to-setup-a-private-docker-registry-with-lke-and-object-storage/) for instructions.

### Alternative to Google Cloud Operations Suite

GCP provides its [cloud operations suite](https://cloud.google.com/blog/topics/developers-practitioners/introduction-google-clouds-operations-suite) for Kubernetes cluster observability. With Akamai Cloud, you can install an alternative observability solution on LKE. One example of such a solution is [The Observability Stack (TOBS)](https://github.com/timescale/tobs), which includes:

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

See [How to Deploy TOBS (The Observability Stack) on LKE](/docs/guides/deploy-tobs-on-linode-kubernetes-engine/) for more information.

### Alternative to GCP Secrets Manager

The [GCP Secrets Manager](https://cloud.google.com/security/products/secret-manager) can be leveraged to provide Kubernetes secrets on GKE. With LKE, you need an alternative solution, such as OpenBao on Akamai Cloud.

## Resources

-   GCP GKE
    -   [Documentation](https://cloud.google.com/kubernetes-engine/docs)
    -   [Connecting kubectl to a GKE cluster](https://cloud.google.com/sdk/gcloud/reference/container/clusters/get-credentials)
-   Linode
    -   [Akamai Connected Cloud: Pricing](https://www.linode.com/pricing/)
    -   [LKE Documentation](/docs/guides/kubernetes-on-linode/)
    -   [DNS Manager](https://techdocs.akamai.com/cloud-computing/docs/dns-manager)
-   Setting up other technologies to run on Linode
    -   [How to Set Up a Docker Registry with LKE and Object Storage](/docs/guides/how-to-setup-a-private-docker-registry-with-lke-and-object-storage/)
    -   [How to Deploy TOBS (The Observability Stack) on LKE](/docs/guides/deploy-tobs-on-linode-kubernetes-engine/)