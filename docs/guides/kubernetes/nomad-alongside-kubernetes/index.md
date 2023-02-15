---
slug: nomad-alongside-kubernetes
author:
  name: Linode Community
  email: docs@linode.com
description: "Nomad and Kubernetes each offer distinct and compelling approaches to workload orchestration. And it is possible to use these two tools together to better manage your diverse orchestration needs. Learn more about the use cases and how to implement the setup in this tutorial."
keywords: ['nomad on kubernetes','nomad kubernetes driver','nomad orchestration']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-02-15
modified_by:
  name: Nathaniel Stickman
title: "How to Use Nomad Alongside Kubernetes"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[HashiCorp Developer: Nomad - Supplement to Kubernetes](https://developer.hashicorp.com/nomad/docs/nomad-vs-kubernetes/supplement)'
- '[GitHub: kelseyhightower/nomad-on-kubernetes - Tutorial on Running Nomad on Kubernetes](https://github.com/kelseyhightower/nomad-on-kubernetes)'
---

Kubernetes and Nomad are two orchestration tools that each come with a compelling set of features. They have some overlap, but each also has its unique strengths and set of use cases they favor.

You can learn more about the two and how they compare in our guide **Kubernetes vs Nomad: Which Is Better?**.

But as that guide points out, there are cases where you may want the benefits of both tools side by side. You can accomplish this with two distinct parallel setups, but you can also directly run Nomad on a Kubernetes cluster.

This tutorial shows you how to do just that. It walks your through setting up the Kubernetes cluster and deploying Nomad to it, and then it demonstrates how you can orchestrate through each.

## Before You Begin

1. If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1. Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Why Use Nomad on Kubernetes?

Reviewing our **Kubernetes vs Nomad: Which Is Better?**, you can see that Kubernetes and Nomad excel in different orchestration areas.

In short, Kubernetes tends to be best for large and complicated applications, but it is restricted to containerized applications. Nomad, on the other hand, provides a simpler and more flexible orchestration that can run both containerized and non-containerized applications.

But many organizations can effectively leverage both use cases. Often, you need to run more than just large and containerized applications. Beside those, you may need to orchestrate batch applications or other non-containerized applications that benefit from a higher degree of flexibility.

Running a Nomad cluster alongside a Kubernetes cluster is a possibility for handling this. And you can learn everything you need for getting started with a Nomad cluster in our guide **How to Use Nomad for Container Orchestration**.

Still, that model may be restrictive, and price-inefficient for your needs. In that case, you may still leverage the advantages of Nomad alongside your Kubernetes setup by running Nomad on the Kubernetes cluster itself.

## How to Deploy Nomad on a Kubernetes Cluster

There are several pieces you need to create and deploy to get a full Nomad-and-Kubernetes infrastructure. This includes provisioning a Kubernetes cluster, deploying Nomad, and deploying Consul for Nomad to network through.

This section of the tutorial walks you through everything you need for a basic Kubernetes cluster running Nomad alongside Kubernetes. By the end, you are ready to start orchestrating all of your applications using the tools most fit for the task.

### Provisioning a Kubernetes Cluster

The infrastructure in this tutorial builds on a Kubernetes base. For that reason, the first step you need to take is provisioning a Kubernetes cluster of your own.

The most straightforward way to deploy a Kubernetes cluster with Linode is using the Linode Kubernetes Engine (LKE). The LKE lets you configure and deploy a full Kubernetes cluster through the Linode Cloud Manager.

Learn how to deploy your own LKE cluster through our guide [Linode Kubernetes Engine - Getting Started](/docs/products/compute/kubernetes/get-started/).

The present tutorial presumes for its Kubernetes infrastructure that you followed the guide above to create an LKE cluster with three nodes. The nodes tested were each Dedicated 4GB instances, though you can vary this to fit your needs.

For an alternative method to deploy a Kubernetes cluster onto Linode, see our guide [Using kubeadm to Deploy a Kubernetes Cluster](/docs/guides/getting-started-with-kubernetes/). The guide covers using the kubeadm tool to set up a cluster, but the guide also overviews and links to further options for Kubernetes deployments.

The tutorial also requires that you have kubectl installed locally and have employed a kubeconfig file to connect kubectl to your cluster. You can learn more about this in the guides linked above, depending on your method for setting up the Kubernetes cluster.

### Deploying a Consul Service Mesh

Nomad typically uses [Consul](https://www.consul.io/) for network discovery. Fortunately, you can set up a Consul mesh on a Kubernetes cluster with relative ease through the official Helm chart.

Learn more about setting up a Consul service mesh on Kubernetes through our guide [Install HashiCorp Consul Service Mesh](/docs/guides/how-to-install-hashicorp-consul-service-mesh/).

The steps that follow are based on those covered in the guide above. Some alterations have been made and more specifics given to fit smoothly with Nomad on the cluster.

1. Install Helm. The specific steps for this depend on your local system. What is given below presumes a typical Linux system. Refer to the [official installation instructions](https://helm.sh/docs/intro/install/) for installing Helm on other operating systems.

    Be sure to identify the [latest release](https://github.com/helm/helm/releases/latest) from the Helm releases page. Replace `3.11.1` in the commands below with the appropriate release number for the latest release.

    ```command
    cd ~/
    sudo wget https://get.helm.sh/helm-v3.11.1-linux-amd64.tar.gz
    sudo tar -zxvf helm-v3.11.1-linux-amd64.tar.gz
    sudo mv linux-amd64/helm /usr/local/bin/helm
    ```

1. Add and update the HashiCorp repository to your Helm instance.

    ```command
    helm repo add hashicorp https://helm.releases.hashicorp.com
    helm repo update
    ```

1. Create a Helm configuration file with the values for deploying Consul. The configuration that follows has been used for this tutorial and facilitates connections between Consul and Nomad.

    ```file {title="consul-helm.yaml" lang="yaml"}
    global:
      name: consul
      datacenter: dc1
    server:
      replicas: 3
      securityContext:
        runAsNonRoot: false
        runAsUser: 0
    client:
      enabled: true
    ui:
      enabled: true
    connectInject:
      enabled: false
    ```

    You can see further examples of Helm configurations for deploying Consul within HashiCorp's [Consul and Kubernetes Deployment Guide](https://learn.hashicorp.com/tutorials/consul/kubernetes-deployment-guide?in=consul/kubernetes). And you can find a list of configuration options in HashiCorp's [Helm Chart Configuration](https://www.consul.io/docs/k8s/helm) guide.

1. Install Consul to the Kubernetes cluster. This command has Helm deploy Consul to the cluster using the values specified in the previous step, assuming you saved those values in a file named `consul-helm.yaml`.

    ```command
    helm install consul hashicorp/consul -f consul-helm.yaml
    ```

Now you can verify that Consul is running and networking on your cluster. First, you can check kubectl to see that the pods containing Consul are up and running.

```command
kubectl get pods
```

```output
NAME                                       READY   STATUS    RESTARTS   AGE
consul-client-9vwgh                        1/1     Running   0          1h
consul-client-l9vkm                        1/1     Running   0          1h
consul-client-wvrpz                        1/1     Running   0          1h
consul-server-0                            1/1     Running   0          1h
consul-server-1                            1/1     Running   0          1h
consul-server-2                            1/1     Running   0          1h
```

Then, you can use the command here to forward the Consul UI to port `18500` on your local machine.

```command
kubectl port-forward service/consul-ui 18500:80 --address 0.0.0.0
```

Navigate to `localhost:18500` in your web browser, and you should see the Consul service listed with three instances, one for each cluster.

[![Consul UI on the Kubernetes cluster](consul-ui-consul-cluster_small.png)](consul-ui-consul-cluster.png)

### Deploying Nomad

Nomad can be deployed directly using kubectl. HashiCorp does not maintain an official Docker container image for Nomad, but this tutorial leverage's NoEnv's [Nomad image](https://hub.docker.com/r/noenv/nomad).

1. Create a Kubernetes configuration file for deploying Nomad. The values below provide a basic Nomad setup and connects Nomad immediately via the Consul mesh.

    ```file {title="nomad-cluster.yaml" lang="yaml"}
    apiVersion: v1
    kind: Service
    metadata:
      name: nomad-cluster-service
      labels:
        name: nomad
    spec:
      type: LoadBalancer
      ports:
        - name: http
          port: 4646
          protocol: "TCP"
        - name: rpc
          port: 4647
          protocol: "TCP"
      selector:
        app: nomad
    ---
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: nomad-cluster-configmap
      labels:
        app: nomad
    data:
      server.hcl: |
        datacenter = "dc1"
        data_dir = "/opt/nomad/data"

        bind_addr = "0.0.0.0"

        server {
            enabled = true
            bootstrap_expect = 3
        }

        consul {
          address = "consul-server.default.svc:8500"
        }
    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: nomad-cluster-deployment
      labels:
        app: nomad
    spec:
      replicas: 3
      selector:
        matchLabels:
          app: nomad
      template:
        metadata:
          labels:
            app: nomad
        spec:
          containers:
          - name: nomad-instance
            image: noenv/nomad
            imagePullPolicy: IfNotPresent
            args:
            - "agent"
            - "-config=/etc/nomad/nomad.d/server.hcl"
            ports:
            - name: http
              containerPort: 4646
              protocol: "TCP"
            - name: rpc
              containerPort: 4647
              protocol: "TCP"
            - name: serf-tcp
              containerPort: 4648
              protocol: "TCP"
            - name: serf-udp
              containerPort: 4648
              protocol: "UDP"
            volumeMounts:
            - name: nomad-config
              mountPath: /etc/nomad/nomad.d
          volumes:
          - name: nomad-config
            configMap:
              name: nomad-cluster-configmap
    ```

    This example configuration does three main things.

    - Creates a load-balancer service for the Nomad instances

    - Prepares a configuration to include with each Nomad instance

    - Defines a deployment for the Nomad image, consisting of three replicas — one for each node in the cluster — giving the necessary exposed ports, and mounting a volume for the configuration

1. Deploy the Nomad setup. This command assumes you saved your Kubernetes configuration for Nomad in a file named `nomad-cluster.yaml`.

    ```command
    kubectl apply -f nomad-cluster.yaml
    ```

Use kubectl to check on the deployed pods and see when the Nomad pods have started up and are running.

```command
kubectl get pods
```

```output
NAME                                       READY   STATUS    RESTARTS   AGE
consul-client-9vwgh                        1/1     Running   0          2h
consul-client-l9vkm                        1/1     Running   0          2h
consul-client-wvrpz                        1/1     Running   0          2h
consul-server-0                            1/1     Running   0          2h
consul-server-1                            1/1     Running   0          2h
consul-server-2                            1/1     Running   0          2h
nomad-cluster-deployment-b4fcbd498-867sd   1/1     Running   0          1h
nomad-cluster-deployment-b4fcbd498-wpdwz   1/1     Running   0          1h
nomad-cluster-deployment-b4fcbd498-zhwmt   1/1     Running   0          1h
```

Now, similar to the Consul setup, you can use port forwarding to see the Nomad UI and verify that the instances are networking.

```command
kubectl port-forward service/nomad-cluster-service 14646:4646 --address 0.0.0.0
```

Navigate to `localhost:14646` in your web browser to see the Nomad UI. In the UI, use the **Servers** option from the left menu to see a list of the connected servers.

[![Nomad UI on the Kubernetes cluster](nomad-ui-nomad-cluster_small.png)](nomad-ui-nomad-cluster.png)

## How to Use Kubernetes and Nomad Together

With the Kubernetes-Nomad infrastructure in place, you can take a trial run at using them for parallel orchestration.

This section provides you with a simple demonstration, orchestrating a containerized application through Kubernetes and a shell-script orchestration for Nomad.

The demonstration goes further, too, taking advantage of the shared cluster to have the Kubernetes and Nomad applications share information across the Kubernetes network.

### Using Kubernetes

Kubernetes excels at deploying containerized applications, especially when these applications are larger and more complex. So it makes the most sense to deploy a containerized application through the Kubernetes orchestration.

Since this tutorial just sets out to provide a demonstration, the application deployed here is not complex or large. The application uses the `http-echo` container to provide a simple message in response to HTTP requests.

Nevertheless, the setup should give you a solid start, and it works well with the demonstration of Nomad in the next section.

1. Create a Kubernetes configuration file with the contents shown here. This configuration file creates an deployment and service for HashiCorp's `http-echo` container. The container provides a simple application for testing HTTP communications.

    The deployment here sets up the container and has it begin serving a simple message on port `3030`. That message can be accessed from the `http-echo-service` created here. Using Kubernetes's networking, the HTTP server is thus accessible to any other pods on the cluster through `http-echo-service.default.svc:3030`.

    ```file {title="http-echo.yaml" lang="yaml"}
    apiVersion: v1
    kind: Service
    metadata:
      name: http-echo-service
      labels:
        app: http-echo
    spec:
      ports:
      - name: echo-port
        port: 3030
        protocol: "TCP"
      selector:
        app: http-echo
    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: http-echo-deployment
    spec:
      replicas: 3
      selector:
        app: http-echo
      template:
        metadata:
          labels:
            app: http-echo
        spec:
          containers:
          - name: http-echo-instance
            image: hashicorp/http-echo
            imagePullPolicy: IfNotPresent
            args:
            - "-listen"
            - ":3030"
            - "-text"
            - "hello from the echo server"
            ports:
            - name: echo-port
              containerPort: 3030
              protocol: "TCP"
    ```

Once the pods are running, you can test the out through some more port forwarding. Use the command below to forward the port to your local machine on port `13030`.

```command
kubectl port-forward service/http-echo-service 13030:3030 --address 0.0.0.0
```

Navigate to `localhost:13030` in your browser to see the echoed message.

```output
hello from the echo server
```

### Using Nomad

Nomad can run containerized applications, although to do so you should deploy a container with Docker alongside the Nomad container.

But one of Nomad's strongest contrasts with Kubernetes is its ability to run non-containerized applications. And with the setup above you can already make a simple example, using the `exec` driver to run commands on the Nomad pods.

The demonstration here creates a job with a task to get the message from the `http-echo` server created above and save that message to a file. While simple, you could conceivably use this kind of setup to have a task that checks the health of a server and reports on issues.

1. Follow the directions further above to access the Nomad UI. The job can be created and run from entirely within the web interface.

1. From the **Jobs** section (accessible from the menu on the left), select the **Run Job** button from the upper right.

1. Populate the field provided with the following job configuration. This creates a job that runs a task on all three Nomad clients. Each task uses cURL to query the `http-echo` servers and save the response to a file.

    ```file {lang="hcl"}
    job "example-job" {
      datacenters = ["dc1"]

      group "example-group" {
        count = 3

        task "curl-task" {
          driver = "exec"

          config {
            command = "curl"
            args = [
              "http-echo-service.default.svc:3030",
              "-o", "nomad-output.txt"
            ]
          }
        }
      }
    }
    ```

1. Proceed with the options to **Plan** and then **Run** the job. You should then be taken to the job's status page, with a summary of the tasks.

## Conclusion

This provides you with a full and extensible setup for running Kubernetes and Nomad together on a shared Kubernetes cluster. Some use cases for this setup are covered above, but, with the rising use of Nomad, you may find many more.

Be sure to refer to our other guides on Kubernetes (via LKE) and Nomad linked throughout this guide. Additionally, you may find more ideas for expanding on this setup by reviewing the repository linked below, which provides another Nomad-on-Kubernetes infrastructure.
