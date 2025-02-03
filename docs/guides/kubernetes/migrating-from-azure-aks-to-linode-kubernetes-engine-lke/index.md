---
slug: migrating-from-azure-aks-to-linode-kubernetes-engine-lke
title: "Migrating from Azure AKS to Linode Kubernetes Engine (LKE)"
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

This guide will walk you through the process of migrating an application from Azure Kubernetes Engine (AKS) to Linode Kubernetes Engine (LKE). To keep the scope of this guide manageable while still covering all the key aspects involved, the example in this guide will be a simple REST API service.

## Prerequisites

To follow along in this walkthrough, you’ll need the following:

* A [Linode account](https://www.linode.com/cfe)  
* A [Linode API token (personal access token)](https://www.linode.com/docs/products/platform/accounts/guides/manage-api-tokens/)  
* The [Linode CLI](https://www.linode.com/docs/products/tools/cli/guides/install/) installed and configured  
* Access to your Azure account with sufficient permissions to work with AKS clusters  
* The [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) installed and configured  
* [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) installed and configured  
* [jq](https://jqlang.github.io/jq/download/) installed and configured  
* [yq](https://github.com/mikefarah/yq) installed and configured

## Step 1: Connect kubectl to your AKS cluster

[Connect kubectl to the AKS cluster](https://learn.microsoft.com/en-us/azure/aks/control-kubeconfig-access) that you want to migrate. If your local machine already has a kubeconfig file with your AKS cluster information, then you can skip this step.

In the Azure portal, search the available services for the **Kubernetes services** option. Navigate to that page.

![][image2]

Find the name and resource group of your AKS cluster.

![][image3]

In the example above, the cluster name is aks-go-cluster, and its resource group is my-aks-group.

Use the Azure CLI to update your local kubeconfig file with your AKS cluster information:

| $ az aks get-credentials \\     \--resource-group my-aks-group \\     \--name aks-go-cluster \\     \--admin The behavior of this command has been altered by the following extension: aks-preview Merged "aks-go-cluster" as current context in /home/user/.kube/config |
| :---- |

If your kubeconfig file has information from multiple clusters, use the following command to list the contexts that kubectl knows about:

| $ kubectl config get-contexts |
| :---- |

Find the name of the kubectl context pointing to your AKS cluster. Then, set the kubectl context to this cluster. For example:

| $ kubectl config use-context aks-go-cluster |
| :---- |

## Step 2: Assess your AKS cluster

Assuming you have set your kubectl context to the AKS cluster for migration, review your cluster status with the following command:

| $ kubectl cluster-info Kubernetes control plane is running at https://aks-go-clu-my-aks-group-219c80-iil863ok.hcp.westus2.azmk8s.io:443 CoreDNS is running at https://aks-go-clu-my-aks-group-219c80-iil863ok.hcp.westus2.azmk8s.io:443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy Metrics-server is running at https://aks-go-clu-my-aks-group-219c80-iil863ok.hcp.westus2.azmk8s.io:443/api/v1/namespaces/kube-system/services/https:metrics-server:/proxy To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'. |
| :---- |

For more detailed information at the command line, run this command:

| $ kubectl cluster-info dump |
| :---- |

Detailed information about your cluster is also available in the Azure portal.

![][image4]

### Review the node

Retrieve the name of the first (and only) node with the following command:

| $ kubectl get nodes NAME                                STATUS   ROLES    AGE   VERSION aks-nodepool1-23390877-vmss000000   Ready    \<none\>   11m   v1.30.6 |
| :---- |

To retrieve more information about this node, run the following command:

| $ kubectl get node aks-nodepool1-23390877-vmss000000 \-o yaml |
| :---- |

The above command retrieves all the information about the node in YAML format. Run the previous command through a pipe to filter for specific fields, such as allocatable CPU and memory.

| $ kubectl get node aks-nodepool1-23390877-vmss000000 \-o yaml \\     | yq '.status.allocatable | {"cpu": .cpu, "memory": .memory}' \\     | awk \-F': ' ' /cpu/ {cpu=$2} /memory/ {mem=$2} \\         END {printf "cpu: %s\\nmemory: %.2f Gi\\n", cpu, mem / 1024 / 1024}'  cpu: 1900m memory: 4.92 Gi |
| :---- |

### Verify the application is running

For this guide, a [REST API service application written in Go](https://github.com/linode/docs-cloud-projects/tree/main/demos/go-quote-service-main) was deployed to the example AKS cluster. This service allows you to add a quote (a string) to a stored list, or retrieve that list. Deploying the application creates a Kubernetes [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/), [Service](https://kubernetes.io/docs/concepts/services-networking/service/), and [HorizontalPodAutoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/).

The manifest (manifest.yaml) for deploying this application is as follows:

| apiVersion: apps/v1kind: Deploymentmetadata:  name: go-quote  labels:    app: go-quotespec:  replicas: 1  selector:    matchLabels:      app: go-quote  template:    metadata:      labels:        app: go-quote    spec:      containers:        \- name: go-quote          image: linodedocsg1g1/go-quote-service:latest          ports:            \- containerPort: 7777          resources:            requests:              cpu: "100m"              memory: "128Mi"            limits:              cpu: "250m"              memory: "256Mi"\---apiVersion: v1kind: Servicemetadata:  name: go-quote-service  labels:    app: go-quotespec:  type: LoadBalancer  ports:    \- port: 80      targetPort: 7777  selector:    app: go-quote\---apiVersion: autoscaling/v2kind: HorizontalPodAutoscalermetadata:  name: go-quote-hpa  labels:    app: go-quotespec:  scaleTargetRef:    apiVersion: apps/v1    kind: Deployment    name: go-quote  minReplicas: 1  maxReplicas: 1  metrics:    \- type: Resource      resource:        name: cpu        target:          type: Utilization          averageUtilization: 50 |
| :---- |

With the application deployed, running the following commands will show the newly provisioned resources:

| $ kubectl get deployNAME       READY   UP-TO-DATE   AVAILABLE   AGEgo-quote   1/1     1            1           46s$ kubectl get servicesNAME               TYPE           CLUSTER-IP   EXTERNAL-IP     PORT(S)        AGE go-quote-service   LoadBalancer   10.0.80.37   52.250.81.212   80:30398/TCP   83s kubernetes         ClusterIP      10.0.0.1     \<none\>          443/TCP        2m14s |
| :---- |

The service is a [LoadBalancer](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer), which means it can be accessed from outside the cluster. Testing the publicly-available service yields the following results:

| $ curl \-X POST \\    \--data '{"quote":"This is my first quote."}' \\    52.250.81.212/quotes$ curl \-X POST \\    \--data '{"quote":"This is my second quote."}' \\    52.250.81.212/quotes$ curl 52.250.81.212/quotes  \["This is my first quote.","This is my second quote."\] |
| :---- |

After verifying that your AKS cluster is fully operational and running a live service, you are ready for migration.

## Step 3: Provision an LKE cluster

When migrating from AKS to LKE, provision an LKE cluster with similar resources to run the same workloads. While there are several ways to create a Kubernetes cluster on Linode, this guide uses the [Linode CLI](https://github.com/linode/linode-cli) to provision resources.

1. Use the Linode CLI (linode) to see available Kubernetes versions:

| $ linode lke versions-list  ┌───────┐ │ id      │ ├───────┤ │ 1.31    │ ├───────┤ │ 1.30    │ └───────┘ |
| :---- |

Unless specific requirements dictate otherwise, it’s generally recommended to provision the latest version of Kubernetes.

2\. Determine the type of Linode to provision. The example AKS cluster configuration uses nodes with two CPUs and 8 GB of memory. To find a Linode type with a similar configuration, run the following command with the Linode CLI:

| $ linode linodes types \--vcpus 2 \--json \--pretty \\     | jq '.\[\] | {class, id, vcpus, memory, price}' {   "class": "standard",   "id": "g6-standard-2",   "vcpus": 2,   "memory": 4096,   "price": {     "hourly": 0.036,     "monthly": 24   } } {   "class": "highmem",   "id": "g7-highmem-1",   "vcpus": 2,   "memory": 24576,   "price": {     "hourly": 0.09,     "monthly": 60   } } {   "class": "highmem",   "id": "g7-highmem-2",   "vcpus": 2,   "memory": 49152,   "price": {     "hourly": 0.18,     "monthly": 120   } } {   "class": "dedicated",   "id": "g6-dedicated-2",   "vcpus": 2,   "memory": 4096,   "price": {     "hourly": 0.054,     "monthly": 36   } } {   "class": "premium",   "id": "g7-premium-2",   "vcpus": 2,   "memory": 4096,   "price": {     "hourly": 0.0645,     "monthly": 43   } } |
| :---- |

See [Akamai Connected Cloud: Pricing](https://www.linode.com/pricing/) for more detailed pricing information. 

3\. The examples in this guide will use the **g6-standard-2** Linode, which features two CPU cores and 4 GB of memory. Run the following command to display detailed information in JSON for this Linode plan:

| $ linode linodes types \--label "Linode 4GB" \--json \--pretty\[  {    "addons": {...},     "class": "standard",    "disk": 81920,    "gpus": 0,    "id": "g6-standard-2",    "label": "Linode 4GB",    "memory": 4096,    "network\_out": 4000,    "price": {      "hourly": 0.036,      "monthly": 24.0    },    "region\_prices": \[...\],    "successor": null,    "transfer": 4000,    "vcpus": 2  }\] |
| :---- |

4\. View available regions with the regions list command:

| $ linode regions list |
| :---- |

5\. After selecting a Kubernetes version and Linode type, use the following command to create a cluster named aks-to-lke in the us-lax (Los Angeles, CA) region with three nodes and auto-scaling. 

Replace aks-to-lke and us-lax with a cluster label and region of your choosing, respectively:

| $ linode lke cluster-create \\   \--label aks-to-lke \\   \--k8s\_version 1.31 \\   \--region us-lax \\   \--node\_pools '\[{     "type": "g6-standard-2",     "count": 1,     "autoscaler": {       "enabled": true,       "min": 1,       "max": 3     }   }\]' |
| :---- |

After creating your cluster successfully, you should see output similar to the following:

| Using default values: {}; use the \--no-defaults flag to disable defaults\+------------------+--------+-------------+ |      label       | region | k8s\_version | \+------------------+--------+-------------+ | aks-to-lke       | us-lax |        1.31 | \+------------------+--------+-------------+ |
| :---- |

## Step 4: Access the Kubernetes Cluster

To access your cluster, fetch the cluster credentials as a kubeconfig file.

1. Use the following command to retrieve the cluster’s ID:

| $ CLUSTER\_ID=$(linode lke clusters-list \--json | \\    jq \-r \\       '.\[\] | select(.label \== "aks-to-lke") | .id') |
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

## Step 5: Migrate from AKS to LKE on Linode

In some cases, migrating Kubernetes applications requires an incremental approach because moving large, interconnected systems all at once isn’t practical. For example, imagine Service A interacts with other services: B, C, D. You might be able to migrate Service A and Service B together to LKE, where they can communicate efficiently. However, Services C and D may still rely heavily on Azure infrastructure or native services, making their migration more complex.

In this scenario, you’d temporarily run Service A in both Azure AKS and LKE on Linode. Service A on LKE would interact with Service B there, while the version of Service A on Azure AKS continues communicating with Services C and D. This setup minimizes disruptions while you work through the complexities of migrating the remaining services to LKE. Although cross-cloud communication incurs higher latency and costs, this approach helps maintain functionality during the transition.

This guide will cover the key steps required to migrate the example application from AKS to LKE.

### Assess current workloads and dependencies in AKS

Ensure that kubectl uses the original kubeconfig file with the AKS cluster context.

| $ kubectl get all \--context aks-go-cluster  NAME                           READY   STATUS    RESTARTS   AGE pod/go-quote-c575f6ccb-2gckb   1/1     Running   0          97s NAME                       TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)        AGE service/go-quote-service   LoadBalancer   10.0.80.37     52.250.81.212   80:30398/TCP   97s service/kubernetes         ClusterIP      10.0.0.1       \<none\>           443/TCP        22m NAME                       READY   UP-TO-DATE   AVAILABLE   AGE deployment.apps/go-quote   1/1     1            1           97s NAME                                 DESIRED   CURRENT   READY   AGE replicaset.apps/go-quote-c575f6ccb   1         1         1       97s NAME                                               REFERENCE             TARGETS              MINPODS   MAXPODS   REPLICAS   AGE horizontalpodautoscaler.autoscaling/go-quote-hpa   Deployment/go-quote   cpu: \<unknown\>/50%   1         1         1          98s |
| :---- |

The output shows the pod of the deployment and the one active replica set. These resources are derivatives of the deployment.

Note that this is all in the default namespace. If you deploy workloads to other namespaces (recommended for production-grade clusters), then you would need to check every namespace.

### Export Kubernetes manifests of Azure AKS

There are many ways to specify the resources you want to deploy to Kubernetes, which include YAML manifests, Kustomize, and Helm charts. Store these in source control and apply them through a CI/CD pipeline. The guide uses plain YAML manifests for the example. Exporting these manifests means storing them as files in a git repository.

### Update manifests for compatibility with LKE on Linode

You may need to update your manifests to accommodate for differences between AKS and LKE. For example, your configuration on AKS may use [ingress services from AKS](https://learn.microsoft.com/en-us/azure/aks/concepts-network-ingress) and the [Azure LoadBalancer Service](https://learn.microsoft.com/en-us/azure/aks/concepts-network-services#loadbalancer) to provide access to clients located outside of your AKS cluster. As an alternative to using these Azure services, you can [deploy a dedicated NGINX Ingress on LKE](https://www.linode.com/docs/guides/deploy-nginx-ingress-on-lke/).

The deployment image may point to Azure Container Registry. Modify this to point to an alternative registry. For example, the Deployment section of your application manifest may look like this:

| apiVersion: apps/v1kind: Deploymentmetadata:… spec:   …  template:     …    spec:      containers:        \- name: go-quote          image: gqimages.azurecr.io/go-quote-service:latest          … |
| :---- |

The container image, pointing to Microsoft Container Registry, has the following format:

| \<registry-name\>.azurecr.io/\<image\_name\>:\<tag\> |
| :---- |

When migrating away from Azure Container Registry, upload the container image to a different registry service (such as Docker Hub) or [Set Up a Docker Registry with LKE and Object Storage](https://www.linode.com/docs/guides/how-to-setup-a-private-docker-registry-with-lke-and-object-storage/). Then, modify your Kubernetes manifest to point to the new location for your image.

For the example service application in this guide, the image comes from Docker Hub; therefore, repointing the registry is unnecessary.

### Transfer persistent data

If the workload depends on persistent data in Azure Storage or a database, then transfer the data or make it available to LKE. The example application, with its in-memory configuration, does not rely on any persistent data.

### Deploy workloads to LKE on Linode

First, deploy your application to the newly created LKE cluster. Because you are switching back and forth between two different clusters, verify the current kubectl context to ensure you are pointing to the right kubeconfig file and cluster.

| $ kubectl config current-context \--kubeconfig \~/.kube/lke-configlke289125-ctx |
| :---- |

Apply the same manifest used to deploy your application to AKS, but this time on your LKE cluster:

| $ kubectl apply \\    \--kubeconfig \~/.kube/lke-config \\    \-f manifest.yamldeployment.apps/go-quote createdservice/go-quote-service createdhorizontalpodautoscaler.autoscaling/go-quote-hpa created |
| :---- |

### Validate application functionality

Verify that the deployment and the service were created successfully.

| $ kubectl get deploy \--kubeconfig \~/.kube/lke-config NAME       READY   UP-TO-DATE   AVAILABLE   AGEgo-quote   1/1     1            1           108s$ kubectl get service \--kubeconfig \~/.kube/lke-config NAME               TYPE           CLUSTER-IP       EXTERNAL-IP     PORT(S)        AGEgo-quote-service   LoadBalancer   10.128.183.194   172.235.44.28   80:30407/TCP   117skubernetes         ClusterIP      10.128.0.1       \<none\>          443/TCP        157m |
| :---- |

The service exposes a public IP address to the REST API service (in this example, it is 172.235.44.28).

| $ curl \-X POST \\    \--data '{"quote":"This is my first quote for LKE."}' \\    172.235.44.28/quotes$ curl \-X POST \\    \--data '{"quote":"This is my second quote for LKE."}' \\    172.235.44.28/quotes$ curl 172.235.44.28/quotes  \["This is my first quote for LKE.","This is my second quote for LKE."\] |
| :---- |

The REST API service is up and running on LKE. Find any services dependent on the AKS cluster deployment and point them to the LKE cluster deployment instead. After testing and verifying the application running on LKE, you can terminate the AKS cluster.

## Additional Considerations and Concerns

### Cost management

Cost reduction is one reason an organization might migrate from Azure AKS to LKE on Linode. Typically, the compute cost of Kubernetes is the primary driver for migration. Use kubectl to find the instance type and capacity type for your AKS instance.

| $ kubectl get node aks-nodepool1-23390877-vmss000000 \-o yaml \\     | yq .metadata.labels \\     | grep node.kubernetes.io/instance-type node.kubernetes.io/instance-type: Standard\_DS2\_v2 |
| :---- |

Reference the [Windows VM pricing page](https://azure.microsoft.com/en-us/pricing/details/virtual-machines/windows/) to find the cost for the Azure VM powering your AKS instance. Compare this with the cost of an Linode instance with comparable resources by examining the [Linode pricing page](https://www.linode.com/pricing/).

Applications with a lot of data egress can also be impacted significantly by egress costs. Consider the typical networking usage of applications running on your AKS cluster, and determine your outbound [costs for Azure bandwidth](https://azure.microsoft.com/en-us/pricing/details/bandwidth/#pricing)[.](https://aws.amazon.com/ec2/pricing/on-demand/#Data_Transfer) Compare this with data transfer numbers allocated to your Linode.  
This is an Standard\_DS2\_v2 instance of an Azure virtual machine. Referencing [Windows VM pricing page](https://azure.microsoft.com/en-us/pricing/details/virtual-machines/windows/), the hourly cost for this type of instance in the West US 2 region is **$0.1140**.

![][image5]

The example Linode instance used in this guide had two CPU cores and 4 GB of memory. Referencing the [Linode pricing page](https://www.linode.com/pricing/), the hourly cost of this instance for a shared CPU plan is **$0.036**.

**![][image6]**

For a dedicated CPU plan, the cost is $0.054 per hour.

**![][image7]**

Applications with a lot of data egress can also be impacted significantly by egress costs. For example, Internet egress [costs for Azure bandwidth](https://azure.microsoft.com/en-us/pricing/details/bandwidth/#pricing) to destinations in North America or Europe are $0.087 per GB between 100 GB and 10 TB of transfer in a month. An application with outbound data of 1 TB in a month will incur a cost of **$78**.

![][image8]

In contrast, both the shared and dedicated CPU plans for the example Linode instance chosen include monthly data transfer of 4 TB for free.

### Data persistence and storage

Cloud-native workloads are ephemeral. As a container orchestration platform, Kubernetes is designed to ensure your pods are up and running and autoscaling to handle demand. However, it’s important to handle persistent data carefully. If you are in a position to impose a large maintenance window with system downtime, then migrating data will be simpler.

However, if you need to perform a live migration with minimal downtime, you must develop proper migration procedures and test them before trying them on your production environment. This may include:

* Parallel storage and databases on both clouds  
* Cross-cloud replication between storage and databases  
* Double writes at the application level  
* Failover reads at the application level  
* Switching the Azure storage and databases to read-only  
* Storage and database indirection at the configuration or DNS level

### Advanced network configuration

Azure has a network model that includes virtual networks, Azure Firewall, and different types of load balancers. Linode and LKE provide [NodeBalancers](https://www.linode.com/products/nodebalancers/), equivalent to application load balancers. If you use advanced features of Azure networking, then you may need to perform some non-trivial work mapping them to Linode networking.

For network security, you may need to port Azure Firewall rules to [Kubernetes Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) on LKE.

### Security and access management

Azure AKS integrates Entra ID (formerly known as Azure Active Directory) with Kubernetes access. On LKE with Linode, you will use standard Kubernetes user and service accounts, as well as [Kubernetes role-based access control (RBAC)](https://kubernetes.io/docs/reference/access-authn-authz/rbac/).

### DNS

If you use an independent DNS provider—such as Cloudflare—for your application, then you will need to update various DNS records to point to LKE endpoints and NodeBalancers instead of AKS endpoints.

If you use Azure DNS and plan to migrate away from it, reference [Linode’s DNS manager](https://techdocs.akamai.com/cloud-computing/docs/dns-manager) as a migration option.

### Alternative to Azure Container Registry

LKE on Linode doesn't have its own container registry. However, if you need to migrate away from Azure Container Registry, you can set up a third-party private container registry, such as [Docker Hub](https://hub.docker.com/) or [GitHub Container Registry](https://github.blog/news-insights/product-news/introducing-github-container-registry/). 

Another option is to set up your container registry. See [How to Set Up a Docker Registry with LKE and Object Storage](https://www.linode.com/docs/guides/how-to-setup-a-private-docker-registry-with-lke-and-object-storage/).

### Alternative to Google Cloud Operations Suite

For Kubernetes cluster observability, Microsoft provides [Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/). With Linode, you can install an alternative observability solution on LKE. One example of such a solution is [The Observability Stack (TOBS)](https://github.com/timescale/tobs), which includes:

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

### Alternative to Azure Key Vault

The [Azure Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/overview) can be leveraged to provide Kubernetes secrets on Azure. With LKE on Linode, you will need another solution. Consider migrating to OpenBao on Linode.

## Resources

* Azure AKS  
  * [Documentation](https://learn.microsoft.com/en-us/azure/aks/)  
  * [Connecting kubectl to an Azure AKS cluster](https://learn.microsoft.com/en-us/azure/aks/control-kubeconfig-access)  
* Linode  
  * [Akamai Connected Cloud: Pricing](https://www.linode.com/pricing/)  
  * [LKE Documentation](https://www.linode.com/docs/guides/kubernetes-on-linode/)  
  * [DNS Manager](https://techdocs.akamai.com/cloud-computing/docs/dns-manager)  
* Setting up other technologies to run on Linode  
  * [How to Set Up a Docker Registry with LKE and Object Storage](https://www.linode.com/docs/guides/how-to-setup-a-private-docker-registry-with-lke-and-object-storage/)  
  * [How to Deploy TOBS (The Observability Stack) on LKE](https://www.linode.com/docs/guides/deploy-tobs-on-linode-kubernetes-engine/)