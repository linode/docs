---
slug: migrating-from-google-gke-to-linode-kubernetes-engine-lke
title: "Migrating from Google GKE to Linode Kubernetes Engine (LKE)"
description: "Two to three sentences describing your guide."
authors: ["Linode"]
contributors: ["Linode"]
published: 2025-02-03
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

This guide will walk you through the process of migrating an application from Google Kubernetes Engine (GKE) on GCP to Linode Kubernetes Engine (LKE). To keep the scope of this guide manageable while still covering all the key aspects involved, the example in this guide will be a simple REST API service.

## Prerequisites

To follow along in this walkthrough, you’ll need the following:

* A [Linode account](https://www.linode.com/cfe)
* A [Linode API token (personal access token)](https://www.linode.com/docs/products/platform/accounts/guides/manage-api-tokens/)
* The [Linode CLI](https://www.linode.com/docs/products/tools/cli/guides/install/) installed and configured
* Access to your GCP account with sufficient permissions to work with GKE clusters
* The [gcloud CLI](https://cloud.google.com/sdk/docs/install) installed and configured
* [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) installed and configured
* [jq](https://jqlang.github.io/jq/download/) installed and configured
* [yq](https://github.com/mikefarah/yq) installed and configured

## Step 1: Connect kubectl to your GKE cluster

[Connect kubectl to the GKE cluster](https://cloud.google.com/sdk/gcloud/reference/container/clusters/get-credentials) that you want to migrate. If your local machine already has a kubeconfig file with your GKE cluster information, then you can skip this step.

In the Google Cloud console, navigate to the **Kubernetes Engine** service, to the **Clusters** page.

![][image2]

Find the name and location of your GKE cluster.

![][image3]

In the example above, the cluster name is test-cluster, and its location is us-west3.

Use the gcloud CLI to update your local kubeconfig file with your GKE cluster information:

| $ gcloud container clusters \\     get-credentials test-cluster \--location=us-west3 Fetching cluster endpoint and auth data. kubeconfig entry generated for test-cluster. |
| :---- |

If your kubeconfig file has information from multiple clusters, use the following command to list the contexts that kubectl knows about:

| $ kubectl config get-contexts |
| :---- |

Find the name of the kubectl context pointing to your GKE cluster. Then, set the kubectl context to this cluster. For example:

| $ kubectl config use-context \\     gke\_gke-to-lke\_us-west3\_test-cluster |
| :---- |

## Step 2: Assess your GKE cluster

Assuming you have set your kubectl context to the GKE cluster for migration, review your cluster status with the following command:

| $ kubectl cluster-info Kubernetes control plane is running at https://34.106.155.168 GLBCDefaultBackend is running at https://34.106.155.168/api/v1/namespaces/kube-system/services/default-http-backend:http/proxy KubeDNS is running at https://34.106.155.168/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy Metrics-server is running at https://34.106.155.168/api/v1/namespaces/kube-system/services/https:metrics-server:/proxy To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'. |
| :---- |

For more detailed information at the command line, run this command:

| $ kubectl cluster-info dump |
| :---- |

Detailed information about your cluster is also available in the Google Cloud console.

![][image4]

### Provisioned nodes depend on workloads

With GKE clusters in Autopilot mode (as in the above example), there are no nodes unless workloads are running in the cluster. When the cluster is created, one node is created, but this node is deprovisioned shortly after.

| $ kubectl get nodesNo resources found |
| :---- |

This is a feature of GKE Autopilot clusters, which scale the entire cluster to zero when no workloads are running. Note that a lot of system pods are pending at this stage, but don't trigger a scale up, since no application workloads are present.

| $ kubectl get pods \-A \\     \-o custom-columns='NAMESPACE:.metadata.namespace,NAME:.metadata.name' NAMESPACE         NAMEgke-gmp-system    alertmanager-0gke-gmp-system    gmp-operator-5bc8795cdf-zzsg8gke-gmp-system    rule-evaluator-7888d55887-pv4w8gke-managed-cim   kube-state-metrics-0kube-system       antrea-controller-horizontal-autoscaler-5cdc558796-22bp9kube-system       egress-nat-controller-85f6f977dd-fbxcjkube-system       event-exporter-gke-8bfd444fb-mnxl5kube-system       konnectivity-agent-79bbb5c5c4-ld7ljkube-system       konnectivity-agent-autoscaler-6c6ffbcf45-phjwwkube-system       kube-dns-76f855548f-8xplrkube-system       kube-dns-autoscaler-6f896b6968-rhjxbkube-system       l7-default-backend-74c4b886f7-94xr9kube-system       metrics-server-v1.30.3-56bfbfd6db-xs2pskube-system       metrics-server-v1.30.3-7bfbf95754-s9ldc |
| :---- |

### Deploy an application, verify it is running

For this guide, a [REST API service application written in Go](https://github.com/the-gigi/go-quote-service) was deployed to the example GKE cluster. This service allows you to add a quote (a string) to a stored list, or retrieve that list. Deploying the application creates a Kubernetes [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/), [Service](https://kubernetes.io/docs/concepts/services-networking/service/), and [HorizontalPodAutoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/).

The manifest (manifest.yaml) for deploying this application is as follows:

| apiVersion: apps/v1kind: Deploymentmetadata:  name: go-quote  labels:    app: go-quotespec:  replicas: 1  selector:    matchLabels:      app: go-quote  template:    metadata:      labels:        app: go-quote    spec:      containers:        \- name: go-quote          image: g1g1/go-quote-service:latest          ports:            \- containerPort: 7777          resources:            requests:              cpu: "100m"              memory: "128Mi"            limits:              cpu: "250m"              memory: "256Mi"\---apiVersion: v1kind: Servicemetadata:  name: go-quote-service  labels:    app: go-quotespec:  type: LoadBalancer  ports:    \- port: 80      targetPort: 7777  selector:    app: go-quote\---apiVersion: autoscaling/v2kind: HorizontalPodAutoscalermetadata:  name: go-quote-hpa  labels:    app: go-quotespec:  scaleTargetRef:    apiVersion: apps/v1    kind: Deployment    name: go-quote  minReplicas: 1  maxReplicas: 1  metrics:    \- type: Resource      resource:        name: cpu        target:          type: Utilization          averageUtilization: 50 |
| :---- |

With the application deployed, running the following commands will show the newly provisioned resources:

| $ kubectl get deployNAME       READY   UP-TO-DATE   AVAILABLE   AGEgo-quote   1/1     1            1           40s$ kubectl get servicesNAME               TYPE           CLUSTER-IP       EXTERNAL-IP     PORT(S)        AGE go-quote-service   LoadBalancer   34.118.229.116   34.106.133.10   80:30972/TCP   5m37s kubernetes         ClusterIP      34.118.224.1     \<none\>          443/TCP        29m |
| :---- |

Now, with workloads running, you can verify that a node has been provisioned:

| $ kubectl get nodesNAME                                          STATUS     ROLES    AGE   VERSIONgk3-test-cluster-nap-1np6k37u-5baac581-mwqs   NotReady   \<none\>   7s    v1.30.6-gke.1125000 |
| :---- |

To retrieve more information about this node, run the following command:

| $ kubectl get node gk3-test-cluster-nap-1np6k37u-5baac581-mwqs \-o yaml |
| :---- |

The above command retrieves all the information about the node in YAML format. Run the previous command through a pipe to filter for specific fields, such as allocatable CPU and memory.

| $ kubectl get node gk3-test-cluster-nap-1np6k37u-5baac581-mwqs \-o yaml \\     | yq '.status.allocatable | {"cpu": .cpu, "memory": .memory}' \\     | awk \-F': ' ' /cpu/ {cpu=$2} /memory/ {mem=$2} \\         END {printf "cpu: %s\\nmemory: %.2f Gi\\n", cpu, mem / 1024 / 1024}'  cpu: 1930m memory: 5.82 Gi |
| :---- |

The service is a [LoadBalancer](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer), which means it can be accessed from outside the cluster. Testing the publicly-available service yields the following results:

| $ curl \-X POST \\    \--data '{"quote":"This is my first quote."}' \\    34.106.133.10/quotes$ curl \-X POST \\    \--data '{"quote":"This is my second quote."}' \\    34.106.133.10/quotes$ curl 34.106.133.10/quotes  \["This is my first quote.","This is my second quote."\] |
| :---- |

After verifying that your GKE cluster is fully operational and running a live service, you are ready for migration.

## Step 3: Provision an LKE cluster

When migrating from GKE to LKE, provision an LKE cluster with similar resources to run the same workloads. While there are several ways to create a Kubernetes cluster on Linode, this guide uses the [Linode CLI](https://github.com/linode/linode-cli) to provision resources.

1. Use the Linode CLI (linode) to see available Kubernetes versions:

| $ linode lke versions-list  ┌───────┐ │ id      │ ├───────┤ │ 1.31    │ ├───────┤ │ 1.30    │ └───────┘ |
| :---- |

Unless specific requirements dictate otherwise, it’s generally recommended to provision the latest version of Kubernetes.

2\. Determine the type of Linode to provision. The example GKE cluster configuration uses nodes with two CPUs and 8 GB of memory. To find a Linode type with a similar configuration, run the following command with the Linode CLI:

| $ linode linodes types \--vcpus 2 \--json \--pretty \\     | jq '.\[\] | {class, id, vcpus, memory, price}' {   "class": "standard",   "id": "g6-standard-2",   "vcpus": 2,   "memory": 4096,   "price": {     "hourly": 0.036,     "monthly": 24   } } {   "class": "highmem",   "id": "g7-highmem-1",   "vcpus": 2,   "memory": 24576,   "price": {     "hourly": 0.09,     "monthly": 60   } } {   "class": "highmem",   "id": "g7-highmem-2",   "vcpus": 2,   "memory": 49152,   "price": {     "hourly": 0.18,     "monthly": 120   } } {   "class": "dedicated",   "id": "g6-dedicated-2",   "vcpus": 2,   "memory": 4096,   "price": {     "hourly": 0.054,     "monthly": 36   } } {   "class": "premium",   "id": "g7-premium-2",   "vcpus": 2,   "memory": 4096,   "price": {     "hourly": 0.0645,     "monthly": 43   } } |
| :---- |

See [Akamai Connected Cloud: Pricing](https://www.linode.com/pricing/) for more detailed pricing information.

3\. The examples in this guide will use the **g6-standard-2** Linode, which features two CPU cores and 4 GB of memory. Run the following command to display detailed information in JSON for this Linode plan:

| $ linode linodes types \--label "Linode 4GB" \--json \--pretty\[  {    "addons": {...},     "class": "standard",    "disk": 81920,    "gpus": 0,    "id": "g6-standard-2",    "label": "Linode 4GB",    "memory": 4096,    "network\_out": 4000,    "price": {      "hourly": 0.036,      "monthly": 24.0    },    "region\_prices": \[...\],    "successor": null,    "transfer": 4000,    "vcpus": 2  }\] |
| :---- |

4\. View available regions with the regions list command:

| $ linode regions list |
| :---- |

5\. After selecting a Kubernetes version and Linode type, use the following command to create a cluster named gke-to-lke in the us-lax (Los Angeles, CA) region with three nodes and auto-scaling.

Replace gke-to-lke and us-lax with a cluster label and region of your choosing, respectively:

| $ linode lke cluster-create \\   \--label gke-to-lke \\   \--k8s\_version 1.31 \\   \--region us-lax \\   \--node\_pools '\[{     "type": "g6-standard-2",     "count": 1,     "autoscaler": {       "enabled": true,       "min": 1,       "max": 3     }   }\]' |
| :---- |

After creating your cluster successfully, you should see output similar to the following:

| Using default values: {}; use the \--no-defaults flag to disable defaults\+------------------+--------+-------------+ |      label       | region | k8s\_version | \+------------------+--------+-------------+ | gke-to-lke       | us-lax |        1.31 | \+------------------+--------+-------------+ |
| :---- |

## Step 4: Access the Kubernetes Cluster

To access your cluster, fetch the cluster credentials as a kubeconfig file.

1. Use the following command to retrieve the cluster’s ID:

| $ CLUSTER\_ID=$(linode lke clusters-list \--json | \\    jq \-r \\       '.\[\] | select(.label \== "gke-to-lke") | .id') |
| :---- |

2. Retrieve the kubeconfig file and save it to \~/.kube/lke-config:.

| $ linode lke kubeconfig-view \--json "$CLUSTER\_ID" | \\     jq \-r '.\[0\].kubeconfig' | \\     base64 \--decode \> \~/.kube/lke-config |
| :---- |

3. After saving the kubeconfig, access your cluster by using kubectl and specifying the file:

| $ kubectl get no \--kubeconfig \~/.kube/lke-config  NAME                            STATUS   ROLES    AGE   VERSION lke289125-478490-4569f8b60000   Ready    \<none\>   85s   v1.31.0 |
| :---- |

One node is ready, and it uses Kubernetes version 1.31.

Next, verify the cluster's health and readiness for application deployment.

| $ kubectl cluster-info \--kubeconfig \~/.kube/lke-config Kubernetes control plane is running at https://1a6a67c2-4c6f-4c75-a4ff-1fbef1be1807.us-lax-1.linodelke.net:443KubeDNS is running at https://1a6a67c2-4c6f-4c75-a4ff-1fbef1be1807.us-lax-1.linodelke.net:443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxyTo further debug and diagnose cluster problems, use 'kubectl cluster-info dump'. |
| :---- |

## Step 5: Migrate from Google GKE to LKE on Linode

In some cases, migrating Kubernetes applications requires an incremental approach because moving large, interconnected systems all at once isn’t practical. For example, imagine Service A interacts with other services: B, C, D. You might be able to migrate Service A and Service B together to LKE, where they can communicate efficiently. However, Services C and D may still rely heavily on GCP infrastructure or native services, making their migration more complex.

In this scenario, you’d temporarily run Service A in both Google GKE and LKE on Linode. Service A on LKE would interact with Service B there, while the version of Service A on Google GKE continues communicating with Services C and D. This setup minimizes disruptions while you work through the complexities of migrating the remaining services to LKE. Although cross-cloud communication incurs higher latency and costs, this approach helps maintain functionality during the transition.

This guide will cover the key steps required to migrate the example application from GKE to LKE.

### Assess current workloads and dependencies in Google GKE

Ensure that kubectl uses the original kubeconfig file with the GKE cluster context.

| $ kubectl get all \--context gke\_gke-to-lke\_us-west3\_test-cluster  NAME                            READY   STATUS    RESTARTS   AGE pod/go-quote-7b747d5f8f-pc2cd   1/1     Running   0          3h36m NAME                       TYPE           CLUSTER-IP       EXTERNAL-IP     PORT(S)        AGE service/go-quote-service   LoadBalancer   34.118.229.116   34.106.133.10   80:30972/TCP   3h36m service/kubernetes         ClusterIP      34.118.224.1     \<none\>          443/TCP        3h59m NAME                       READY   UP-TO-DATE   AVAILABLE   AGE deployment.apps/go-quote   1/1     1            1           3h36m NAME                                  DESIRED   CURRENT   READY   AGE replicaset.apps/go-quote-7b747d5f8f   1         1         1       3h36m NAME                                               REFERENCE             TARGETS       MINPODS   MAXPODS   REPLICAS   AGE horizontalpodautoscaler.autoscaling/go-quote-hpa   Deployment/go-quote   cpu: 0%/50%   1         1         1          3h36m |
| :---- |

The output shows the pod of the deployment and the one active replica set. These resources are derivatives of the deployment.

Note that this is all in the default namespace. If you deploy workloads to other namespaces (recommended for production-grade clusters), then you would need to check every namespace.

### Export Kubernetes manifests of Google GKE

There are many ways to specify the resources you want to deploy to Kubernetes, which include YAML manifests, Kustomize, and Helm charts. Store these in source control and apply them through a CI/CD pipeline. The guide uses plain YAML manifests for the example. Exporting these manifests means storing them as files in a git repository.

### Update manifests for compatibility with LKE on Linode

You may need to update your manifests to accommodate for differences between GKE and LKE. For example, your configuration on GKE may use the [Ingress Controller for Google Cloud](https://github.com/kubernetes/ingress-gce) and the [External LoadBalancer Service](https://cloud.google.com/kubernetes-engine/docs/concepts/service-load-balancer) to provide access to clients located outside of your Google Cloud VPC. As an alternative to using these GCP load balancer and ingress services, you can [deploy a dedicated NGINX Ingress on LKE](https://www.linode.com/docs/guides/deploy-nginx-ingress-on-lke/).

The deployment image may point to GCP Artifact Registry. Modify this to point to an alternative registry. For example, the Deployment section of your application manifest may look like this:

| apiVersion: apps/v1kind: Deploymentmetadata:… spec:   …  template:     …    spec:      containers:        \- name: go-quote          image: us-west3-docker.pkg.dev/myproj/gq/go-quote-service:latest          … |
| :---- |

The container image, pointing to GCP Artifact Registry, has the following format:

| \<region\>\-docker.pkg.dev/\<project\_id\>/\<repository\_name\>/\<image\_name\>:\<tag\> |
| :---- |

When migrating away from GCP Artifact Registry, upload the container image to a different registry service (such as Docker Hub) or [Set Up a Docker Registry with LKE and Object Storage](https://www.linode.com/docs/guides/how-to-setup-a-private-docker-registry-with-lke-and-object-storage/). Then, modify your Kubernetes manifest to point to the new location for your image.

For the example service application in this guide, the image comes from Docker Hub; therefore, repointing the registry is unnecessary.

### Transfer persistent data

If the workload depends on persistent data in Google Cloud Storage or a database, then transfer the data or make it available to LKE. The example application, with its in-memory configuration, does not rely on any persistent data.

### Deploy workloads to LKE on Linode

First, deploy your application to the newly created LKE cluster. Because you are switching back and forth between two different clusters, verify the current kubectl context to ensure you are pointing to the right kubeconfig file and cluster.

| $ kubectl config current-context \--kubeconfig \~/.kube/lke-configlke289125-ctx |
| :---- |

Apply the same manifest used to deploy your application to GKE, but this time on your LKE cluster:

| $ kubectl apply \\    \--kubeconfig \~/.kube/lke-config \\    \-f manifest.yamldeployment.apps/go-quote createdservice/go-quote-service createdhorizontalpodautoscaler.autoscaling/go-quote-hpa created |
| :---- |

### Validate application functionality

Verify that the deployment and the service were created successfully.

| $ kubectl get deploy \--kubeconfig \~/.kube/lke-config NAME       READY   UP-TO-DATE   AVAILABLE   AGEgo-quote   1/1     1            1           108s$ kubectl get service \--kubeconfig \~/.kube/lke-config NAME               TYPE           CLUSTER-IP       EXTERNAL-IP     PORT(S)        AGEgo-quote-service   LoadBalancer   10.128.183.194   172.235.44.28   80:30407/TCP   117skubernetes         ClusterIP      10.128.0.1       \<none\>          443/TCP        157m |
| :---- |

The service exposes a public IP address to the REST API service (in this example, it is 172.235.44.28).

| $ curl \-X POST \\    \--data '{"quote":"This is my first quote for LKE."}' \\    172.235.44.28/quotes$ curl \-X POST \\    \--data '{"quote":"This is my second quote for LKE."}' \\    172.235.44.28/quotes$ curl 172.235.44.28/quotes  \["This is my first quote for LKE.","This is my second quote for LKE."\] |
| :---- |

The REST API service is up and running on LKE. Find any services dependent on the GKE cluster deployment and point them to the LKE cluster deployment instead. After testing and verifying the application running on LKE, you can terminate the GKE cluster.

## Additional Considerations and Concerns

### Cost management

Cost reduction is one reason an organization might migrate from GCP GKE to LKE on Linode. Typically, the compute cost of Kubernetes is the primary driver for migration. Use kubectl to find the instance type and capacity type for your GKE instance.

| $ kubectl get node gk3-test-cluster-nap-1np6k37u-5baac581-mwqs \-o yaml \\     | yq .metadata.labels \\     | grep node.kubernetes.io/instance-type node.kubernetes.io/instance-type: e2-standard-2 |
| :---- |

This is an e2-standard-2 instance of the GCP compute engine. Referencing [Google’s VM instance pricing page](https://cloud.google.com/compute/vm-instance-pricing), the hourly cost for this type of instance in the us-west3 region is **$0.080486**.

![][image5]

The example Linode instance used in this guide had two CPU cores and 4 GB of memory. Referencing the [Linode pricing page](https://www.linode.com/pricing/), the hourly cost of this instance for a shared CPU plan is **$0.036**.

**![][image6]**

For a dedicated CPU plan, the cost is $0.054 per hour.

**![][image7]**

Applications with a lot of data egress can also be impacted significantly by egress costs. For example, outbound [data transfer costs for the GCP standard tier](https://cloud.google.com/vpc/network-pricing#vpc-pricing?#:~:text=Standard%20Tier%20pricing) are $0.085 per GiB between 200 GiB and 10 TiB of transfer in a month. An application with outbound data of 1 TB in a month will incur a cost of **$68**.

![][image8]

In contrast, both the shared and dedicated CPU plans for the example Linode instance chosen include monthly data transfer of 4 TB for free.

### Data persistence and storage

Cloud-native workloads are ephemeral. As a container orchestration platform, Kubernetes is designed to ensure your pods are up and running and autoscaling to handle demand. However, it’s important to handle persistent data carefully. If you are in a position to impose a large maintenance window with system downtime, then migrating data will be simpler.

However, if you need to perform a live migration with minimal downtime, you must develop proper migration procedures and test them before trying them on your production environment. This may include:

* Parallel storage and databases on both clouds
* Cross-cloud replication between storage and databases
* Double writes at the application level
* Failover reads at the application level
* Switching the GCP storage and databases to read-only
* Storage and database indirection at the configuration or DNS level

### Advanced network configuration

GCP has a network model that includes virtual private clouds (VPCs), virtual private networks (VPNs), and different types of load balancers. Linode and LKE provide [NodeBalancers](https://www.linode.com/products/nodebalancers/), equivalent to application load balancers. If you use advanced features of GCP networking, then you may need to perform some non-trivial work mapping them to Linode networking.

For network security, you may need to port GCP VPC firewall rules to [Kubernetes Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) on LKE.

### Security and access management

Google GKE integrates Google Cloud IAM with Kubernetes access. On LKE with Linode, you will use standard Kubernetes user and service accounts, as well as [Kubernetes role-based access control (RBAC)](https://kubernetes.io/docs/reference/access-authn-authz/rbac/).

### DNS

If you use an independent DNS provider—such as Cloudflare—for your application, then you will need to update various DNS records to point to LKE endpoints and NodeBalancers instead of GCP endpoints.

If you use Google Cloud DNS and plan to migrate away from it, reference [Linode’s DNS manager](https://techdocs.akamai.com/cloud-computing/docs/dns-manager) as a migration option.

### Alternative to GCP Artifact Registry

LKE on Linode doesn't have its own container registry. However, if you need to migrate away from GCP Artifact Registry, you can set up a third-party private container registry, such as [Docker Hub](https://hub.docker.com/) or [GitHub Container Registry](https://github.blog/news-insights/product-news/introducing-github-container-registry/).

Another option is to set up your container registry. See [How to Set Up a Docker Registry with LKE and Object Storage](https://www.linode.com/docs/guides/how-to-setup-a-private-docker-registry-with-lke-and-object-storage/).

### Alternative to Google Cloud Operations Suite

For Kubernetes cluster observability, GCP provides its [cloud operations suite](https://cloud.google.com/blog/topics/developers-practitioners/introduction-google-clouds-operations-suite). With Linode, you can install an alternative observability solution on LKE. One example of such a solution is [The Observability Stack (TOBS)](https://github.com/timescale/tobs), which includes:

* Kube-Prometheus
  * Prometheus
  * AlertManager
  * Grafana
  * Node-Exporter
  * Kube-State-Metrics
  * Prometheus-Operator
* Promscale
* TimescaleDB
  * Postgres-Exporter
* OpenTelemetry-Operator

See [How to Deploy TOBS (The Observability Stack) on LKE](https://www.linode.com/docs/guides/deploy-tobs-on-linode-kubernetes-engine/) for more information.

### Alternative to GCP Secrets Manager

The [GCP Secrets Manager](https://cloud.google.com/security/products/secret-manager) can be leveraged to provide Kubernetes secrets on GKE. With LKE on Linode, you will need another solution. Consider migrating to OpenBao on Linode.

## Resources

* GCP GKE
  * [Documentation](https://cloud.google.com/kubernetes-engine/docs)
  * [Connecting kubectl to a GKE cluster](https://cloud.google.com/sdk/gcloud/reference/container/clusters/get-credentials)
* Linode
  * [Akamai Connected Cloud: Pricing](https://www.linode.com/pricing/)
  * [LKE Documentation](https://www.linode.com/docs/guides/kubernetes-on-linode/)
  * [DNS Manager](https://techdocs.akamai.com/cloud-computing/docs/dns-manager)
* Setting up other technologies to run on Linode
  * [How to Set Up a Docker Registry with LKE and Object Storage](https://www.linode.com/docs/guides/how-to-setup-a-private-docker-registry-with-lke-and-object-storage/)
  * [How to Deploy TOBS (The Observability Stack) on LKE](https://www.linode.com/docs/guides/deploy-tobs-on-linode-kubernetes-engine/)