---
slug: migrating-from-aws-eks-to-linode-kubernetes-engine-lke
title: "Migrating from AWS EKS to Linode Kubernetes Engine (LKE)"
description: "Learn how to migrate Kubernetes applications from AWS EKS to Linode Kubernetes Engine (LKE) using a sample rest API service."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2025-04-25
keywords: ['aws eks','aws eks alternatives','aws kubernetes alternatives','amazon kubernetes alternatives','replace aws eks','replace aws kubernetes','replace amazon kubernetes','migrate aws eks to linode','migrate aws kubernetes to linode','migrate amazon kubernetes to linode','migrate kubernetes applications to linode','aws eks migration','aws kubernetes migration','amazon kubernetes migration','aws eks replacement','aws kubernetes replacement','amazon kubernetes replacement']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

This guide walks you through the process of migrating an application from [Amazon Web Services (AWS) Elastic Kubernetes Service (EKS)](https://aws.amazon.com/eks/) to Linode Kubernetes Engine (LKE). An example REST API service is used to demonstrate the steps for migrating an application.

## Before You Begin

1.  Follow our [Getting Started](https://techdocs.akamai.com/cloud-computing/docs/getting-started) guide, and create an Akamai Cloud account if you do not already have one.

1.  Create a personal access token using the instructions in our [Manage personal access tokens](https://techdocs.akamai.com/cloud-computing/docs/manage-personal-access-tokens) guide.

1.  Install the Linode CLI using the instructions in the [Install and configure the CLI](https://techdocs.akamai.com/cloud-computing/docs/install-and-configure-the-cli) guide.

1.  Follow the steps in the *Install `kubectl`* section of the [Getting started with LKE](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-lke-linode-kubernetes-engine#install-kubectl) guide to install and configure `kubectl`.

1.  Ensure that you have access to your AWS account with sufficient permissions to work with EKS clusters. The [AWS CLI](https://aws.amazon.com/cli/) and [`eksctl`](https://eksctl.io/) must also be installed and configured.

1.  Install [`jq`](docs/guides/using-jq-to-process-json-on-the-command-line/#install-jq-with-package-managers), a lightweight command line JSON processor.

1.  Install [`yq`](https://github.com/mikefarah/yq), a YAML processor for the command line.

1.  Install [ripgrep (`rg`)](https://github.com/BurntSushi/ripgrep), an alternative to `grep` written in Rust.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Connect `kubectl` to Your EKS Cluster

[Connect `kubectl` to the EKS cluster](https://docs.aws.amazon.com/eks/latest/userguide/create-kubeconfig.html) that you want to migrate. Skip this step if your local machine is already using a `kubeconfig` file with your EKS cluster information.

1.  In the AWS console, navigate to the EKS service and find the name of your EKS cluster. In the screenshot below, the cluster name is `wonderful-hideout-1734286097`:

    ![The EKS service page in the AWS Console showing the example cluster name.](aws-eks-cluster-name-console.png)

    You also need to know the AWS region where your cluster resides. For this example, the region is `us-west-1` (not shown).

1.  Use the AWS CLI to update your local `kubeconfig` file, replacing {{< placeholder "AWS_REGION" >}} and {{< placeholder "EKS_CLUSTER_NAME" >}} with your actual EKS cluster information:

    ```command
    aws eks update-kubeconfig --region {{< placeholder "AWS_REGION" >}} --name {{< placeholder "EKS_CLUSTER_NAME" >}}
    ```

    ```output
    Added new context arn:aws:eks:{{< placeholder "AWS_REGION" >}}:{{< placeholder "AWS_ACCOUNT_ID" >}}:cluster/{{< placeholder "EKS_CLUSTER_NAME" >}} to /home/user/.kube/config
    ```

1.  If your `kubeconfig` file includes multiple clusters, use the following command to list the available contexts:

    ```command
    kubectl config get-contexts
    ```

1.  Identify the context name for your EKS cluster, and set it to the active context. Replace the values with those of your cluster:

    ```command
    kubectl config use-context {{< placeholder "EKS_CLUSTER_CONTEXT_NAME" >}}
    ```

### Assess Your EKS Cluster

1.  Verify the EKS cluster is operational with `kubectl`:

    ```command
    kubectl cluster-info
    ```

    ```output
    Kubernetes control plane is running at {{< placeholder "EKS_CONTROL_PLANE_URL" >}}
    CoreDNS is running at {{< placeholder "EKS_DNS_URL" >}}

    To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
    ```

1.  If you wish to see more detailed cluster information, run the following command:

    ```command
    kubectl cluster-info dump
    ```

### Review the Node Group

In AWS EKS, the *node group* defines the type of worker nodes in your cluster. Since a production cluster may have multiple node groups with different node types, it can be a key factor for the migration process.

While Kubernetes does not have a native concept of a node group, all the nodes within a given EKS node group share the same configuration. Therefore, inspecting a single node provides all the information needed for migration.

1.  List the nodes in your cluster:

    ```command
    kubectl get nodes
    ```

    ```output
    NAME               STATUS   ROLES    AGE   VERSION
    {{< placeholder "EKS_NODE_1_NAME" >}}    Ready    <none>   24m   v1.31.5-eks-5d632ec
    {{< placeholder "EKS_NODE_2_NAME" >}}    Ready    <none>   24m   v1.31.5-eks-5d632ec
    ```

1.  Run the following command to retrieve detailed information about the first node in YAML format:

    ```command
    kubectl get node \
        $(kubectl get nodes -o jsonpath='{.items[0].metadata.name}') -o yaml
    ```

1.  You can run the previous command through a pipe to filter for specific fields (e.g. allocatable CPU and memory):

    ```command
    kubectl get node \
      $(kubectl get nodes -o jsonpath='{.items[0].metadata.name}') -o yaml \
        | yq '.status.allocatable | {"cpu": .cpu, "memory": .memory}' \
          | awk -F': ' ' /cpu/ {cpu=$2} /memory/ {mem=$2} \
            END {printf "cpu: %s\nmemory: %.2f Gi\n", cpu, mem / 1024 / 1024}'
    ```

    ```output
    cpu: 1930m
    memory: 6.89 Gi
    ```

### Verify the Application Is Running

To illustrate an application running in a production environment, a [REST API service application written in Go](https://github.com/linode/docs-cloud-projects/tree/main/demos/go-quote-service-main) is deployed to the example EKS cluster. If you already have one or more applications running on your EKS cluster, you may skip this section.

The function of the REST API service allows you to add quotes (strings) to a stored list, or to retrieve that list. The application has been deployed to the cluster, creating a Kubernetes [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/), [Service](https://kubernetes.io/docs/concepts/services-networking/service/), and [HorizontalPodAutoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/).

Follow the steps below to install, configure, and test the REST API service application on your EKS cluster.

1.  Use a command line text editor such as `nano` to create a Kubernetes manifest file (`manifest.yaml`) that defines the application and its supporting resources:

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

1.  Apply the manifest to deploy the application on your EKS cluster:

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
    go-quote   1/1     1            1           5m7s
    ```

1.  Run the following `kubectl` command to retrieve the external IP address assigned to the service:

    ```command
    kubectl get svc
    ```

    The service is a [LoadBalancer](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer), which means it can be accessed from outside the cluster:

    ```output
    NAME               TYPE           CLUSTER-IP            EXTERNAL-IP                  PORT(S)        AGE
    go-quote-service   LoadBalancer   {{< placeholder "GO_QUOTE_CLUSTER_IP" >}}   {{< placeholder "GO_QUOTE_EXTERNAL_HOSTNAME" >}}   80:30570/TCP   5m27s
    kubernetes         ClusterIP      {{< placeholder "K8S_CLUSTER_IP" >}}        <none>
    ```

1.  Test the service by adding a quote, replacing {{< placeholder "GO_QUOTE_EXTERNAL_HOSTNAME" >}} with the actual `EXTERNAL-IP` of your `LoadBalancer`:

    ```command
    curl -X POST \
        --data '{"quote":"This is my first quote."}' \
        {{< placeholder "GO_QUOTE_EXTERNAL_HOSTNAME" >}}/quotes
    ```

1.  Add a second quote:

    ```command
    curl -X POST \
        --data '{"quote":"This is my second quote."}' \
        {{< placeholder "GO_QUOTE_EXTERNAL_HOSTNAME" >}}/quotes
    ```

1.  Now retrieve the stored quotes:

    ```command
    curl {{< placeholder "GO_QUOTE_EXTERNAL_HOSTNAME" >}}/quotes
    ```

    This should yield the following result:

    ```output
    ["This is my first quote.","This is my second quote."]
    ```

After verifying that your EKS cluster is fully operational and running a live service, you are ready for migration.

## Provision an LKE Cluster

When migrating from EKS to LKE, provision an LKE cluster with similar resources to run the same workloads. While there are several ways to create a Kubernetes cluster on Akamai Cloud, this guide uses the [Linode CLI](https://techdocs.akamai.com/cloud-computing/docs/cli) to provision resources.

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

1.  Determine the type of Linode to provision. The example EKS cluster configuration uses nodes with two CPUs and 8 GB of memory. To find a Linode type with a similar configuration, run the following command with the Linode CLI:

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

1.  The examples in this guide use the `g6-standard-2` Linode, which features two CPU cores and 4 GB of memory. Run the following command to display detailed information in JSON for this Linode plan:

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

1.  After selecting a Kubernetes version and Linode type, use the following command to create a cluster named `eks-to-lke` in the `us-mia` (Miami, FL) region with three nodes and auto-scaling. Replace `eks-to-lke` and `us-mia` with a cluster label and region of your choosing, respectively:

    ```command
    linode-cli lke cluster-create \
      --label eks-to-lke \
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
    │ 343326 │ eks-to-lke │ us-mia │ 1.32        │ False                    │      │
    └────────┴────────────┴────────┴─────────────┴──────────────────────────┴──────┘
    ```

## Access the Kubernetes Cluster

To access your cluster, fetch the cluster credentials as a `kubeconfig` file. Your cluster's `kubeconfig` can also be [downloaded via the Cloud Manager](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-lke-linode-kubernetes-engine#access-and-download-your-kubeconfig).

1.  Use the following command to retrieve the cluster’s ID:

    ```command
    CLUSTER_ID=$(linode-cli lke clusters-list --json | jq -r \
      '.[] | select(.label == "eks-to-lke") | .id')
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

## Migrate From AWS EKS to LKE

In some cases, migrating Kubernetes applications requires an incremental approach, as moving large interconnected systems all at once isn’t always practical.

For example, if **Service A** interacts with **Services B, C, and D**, you may be able to migrate **Services A and B** together to LKE, where they can communicate efficiently. However, **Services C and D** may still rely on AWS infrastructure or native services, making their migration more complex.

In this scenario, you may need to temporarily run **Service A** in both AWS EKS and LKE. **Service A on LKE** would interact with **Service B on LKE**, while the version of **Service A on AWS EKS** continues communicating with **Services C and D**. This setup minimizes disruptions while you work through the complexities of migrating the remaining services to LKE. Although cross-cloud communication may incur higher latency and costs, this approach helps maintain functionality during the transition.

This guide covers the key steps required to migrate the example application from EKS to LKE.

### Assess Current Workloads and Dependencies in AWS EKS

Ensure that `kubectl` uses the original `kubeconfig` file with the EKS cluster context.

If necessary, you may need to re-save your EKS cluster's `kubeconfig` file path to your `$KUBECONFIG` environment variable.

```command
kubectl get all --context {{< placeholder "EKS_CLUSTER_CONTEXT_NAME" >}}
```

The output shows the running pod and the one active replica set created by the deployment:

```output
NAME                      READY   STATUS    RESTARTS   AGE
pod/go-quote-{{< placeholder "POD_SUFFIX" >}}   1/1     Running   0          170m

NAME                       TYPE           CLUSTER-IP           EXTERNAL-IP                  PORT(S)        AGE
service/go-quote-service   LoadBalancer   {{< placeholder "GO_QUOTE_CLUSTER_IP" >}}  {{< placeholder "GO_QUOTE_EXTERNAL_HOSTNAME" >}}   80:30570/TCP   170m
service/kubernetes         ClusterIP      {{< placeholder "K8S_CLUSTER_IP" >}}       <none>                       443/TCP        3h30m

NAME                       READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/go-quote   1/1     1            1           170m

NAME                                         DESIRED   CURRENT   READY   AGE
replicaset.apps/go-quote-{{< placeholder "REPLICASET_SUFFIX" >}}   1         1         1       170m

NAME                                               REFERENCE             TARGETS              MINPODS   MAXPODS   REPLICAS   AGE
horizontalpodautoscaler.autoscaling/go-quote-hpa   Deployment/go-quote   cpu: <unknown>/50%   1         1         1          170m
```

{{< note >}}
By default, `kubectl get all` only displays resources in the `default` namespace. If your workloads are deployed in a different namespace (recommended for production clusters), use:

```command
kubectl get all --namespace={{< placeholder "YOUR_NAMESPACE" >}}
```
{{< /note >}}

### Export Kubernetes Manifests of AWS EKS

There are multiple ways to define the resources you want to deploy to Kubernetes, including YAML manifests, Kustomize configurations, and Helm charts. For consistency and version control, store these in a git repository and deploy them via your CI/CD pipeline. The guide uses plain YAML manifests as the example.

### Update Manifests for Compatibility With LKE

You may need to update your manifests to accommodate for differences between EKS and LKE. For example, your configuration on EKS may use the [AWS Load Balancer Controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.4/), which helps manage AWS Application Load Balancers (ALB) as Kubernetes [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) resources. As an alternative to AWS ALBs, you can [deploy a dedicated NGINX Ingress on LKE](/docs/guides/deploy-nginx-ingress-on-lke/).

The deployment image may point to AWS Elastic Container Registry (ECR). Modify this to point to an alternative registry. For example, the `Deployment` section of your application manifest may look like this:

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
          image: 123456789.dkr.ecr.us-west-2.amazonaws.com/go-quote:latest
          ...
```

The container image, pointing to AWS ECR, has the following format:

```command
{{< placeholder "AWS_ACCOUNT_ID" >}}.dkr.ecr.{{< placeholder "REGION" >}}.amazonaws.com/{{< placeholder "REPOSITORY_NAME" >}}:{{< placeholder "TAG" >}}
```

To migrate away from AWS ECR, upload the container image to another registry service (e.g. Docker Hub) or [Set Up a Docker Registry with LKE and Object Storage](/docs/guides/how-to-setup-a-private-docker-registry-with-lke-and-object-storage/). Then, modify your Kubernetes manifest to point to the new location for your image.

{{< note >}}
Since the image for the example service application in this guide comes from Docker Hub, redirecting the registry is unnecessary.
{{< /note >}}

### Transfer Persistent Data

If the workload depends on persistent data in AWS S3 or a database, then transfer the data or make it available to LKE. See the following guides for more information:

- [How to Migrate From AWS S3 to Linode Object Storage](/docs/guides/migrate-from-aws-s3-to-linode-object-storage/)
- [Migrate From AWS EBS to Linode Block Storage](/docs/guides/migrate-from-aws-ebs-to-linode-block-storage/)

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

1.  Apply the same `manifest.yaml` file used to deploy your application to EKS, but this time on your LKE cluster:

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

    The service exposes a public IP address to the REST API service:

    ```output
    NAME               TYPE           CLUSTER-IP            EXTERNAL-IP            PORT(S)        AGE
    go-quote-service   LoadBalancer   {{< placeholder "GO_QUOTE_CLUSTER_IP" >}}   {{< placeholder "GO_QUOTE_EXTERNAL_IP" >}}   80:30407/TCP   117s
    kubernetes         ClusterIP      {{< placeholder "K8S_CLUSTER_IP" >}}        <none>                 443/TCP        157m
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

Depending on your application, point any services dependent on the EKS cluster deployment to the LKE cluster deployment instead. After testing and verifying your application is running on LKE, you can terminate your EKS cluster.

## Additional Considerations and Concerns

When migrating from AWS EKS to LKE, there are several important factors to keep in mind, including cost management, data persistence, networking, security, and alternative solutions for cloud-specific services.

### Cost Management

Cost reduction is one reason an organization might migrate from AWS EKS to LKE. Typically, the compute cost of Kubernetes can be a primary driver for migration. Use `kubectl` to find the instance type and capacity type for your AWS EKS instance.

```command
kubectl get node {{< placeholder "EKS_NODE_1_NAME" >}} -o yaml \
  | yq .metadata.labels \
  | rg 'node.kubernetes.io/instance-type|capacityType'
```

```output
eks.amazonaws.com/capacityType: {{< placeholder "EKS_CAPACITY_TYPE" >}}
node.kubernetes.io/instance-type: {{< placeholder "EKS_INSTANCE_TYPE" >}}
```

Reference the [AWS pricing page for EC2 On-Demand Instances](https://aws.amazon.com/ec2/pricing/on-demand/) to find the cost for your EKS instance. Compare this with the cost of a Linode instance with comparable resources by examining [our pricing page](https://www.linode.com/pricing/).

Additionally, applications with substantial data egress can be significantly impacted by egress costs. Consider the typical networking usage of applications running on your EKS cluster, and determine your [data transfer costs with AWS](https://aws.amazon.com/ec2/pricing/on-demand/#Data_Transfer). Compare this with data transfer limits allocated to your LKE nodes.

### Data Persistence and Storage

Cloud-native workloads are ephemeral. As a container orchestration platform, Kubernetes is designed to ensure your pods are up and running, with autoscaling to handle demand. However, it’s important to handle persistent data carefully. If you are in a position to impose a large maintenance window with system downtime, migrating workloads can be a simpler task.

Should you need to perform a live migration with minimal downtime, you must develop proper migration procedures and test them in a non-production environment. This may include:

-   Parallel storage and databases on both clouds
-   Cross-cloud replication between storage and databases
-   Double writes at the application level
-   Failover reads at the application level
-   Switching the AWS storage and databases to read-only
-   Storage and database indirection at the configuration or DNS level

### Advanced Network Configuration

The AWS network model includes virtual private clouds (VPCs), virtual private networks (VPNs), and different types of load balancers. For LKE, Akamai Cloud provides [NodeBalancers](https://www.linode.com/products/nodebalancers/), which are equivalent to application load balancers. If you use advanced features of AWS networking, adapting them to Akamai Cloud networking may require significant configuration changes.

For network security, you may need to port AWS security group rules into [Kubernetes Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) on LKE.

### Security and Access Management

AWS EKS integrates AWS Identity and Access Management (IAM) with Kubernetes access. LKE uses standard Kubernetes user and service accounts, as well as [Kubernetes role-based access control (RBAC)](https://kubernetes.io/docs/reference/access-authn-authz/rbac/).

### DNS

If you use an independent DNS provider for your application, you must update various DNS records to point to LKE endpoints and NodeBalancers instead of AWS endpoints.

If you use Route53, the AWS DNS service, and plan to migrate away from it, [our DNS Manager](https://techdocs.akamai.com/cloud-computing/docs/dns-manager) may be a migration option.

### Alternative to AWS Elastic Container Registry (ECR)

LKE doesn't have its own container registry. To migrate away from AWS ECR, set up a third-party private container registry, such as [Docker Hub](https://hub.docker.com/) or [GitHub Container Registry](https://github.blog/news-insights/product-news/introducing-github-container-registry/).

Alternatively, you can set up your own container registry, see [How to Set Up a Docker Registry with LKE and Object Storage](/docs/guides/how-to-setup-a-private-docker-registry-with-lke-and-object-storage/) for instructions.

### Alternative to AWS CloudWatch

AWS uses CloudWatch for Kubernetes cluster observability. With Akamai Cloud, you can install an alternative observability solution on LKE. One example of such a solution is [The Observability Stack (TOBS)](https://github.com/timescale/tobs), which includes:

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

See the following guides for additional information:

- [Migrating From AWS CloudWatch to Prometheus and Grafana on Akamai](/docs/guides/migrating-from-aws-cloudwatch-to-prometheus-and-grafana-on-akamai/)
- [How to Deploy TOBS (The Observability Stack) on LKE](/docs/guides/deploy-tobs-on-linode-kubernetes-engine/)

### Alternative to AWS Secrets Manager

The AWS Secrets Manager can be leveraged to provide Kubernetes secrets on EKS. With LKE, you need an alternative solution, such as [OpenBao on Akamai Cloud](/docs/marketplace-docs/guides/openbao/).