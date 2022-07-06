---
slug: getting-started-with-kubernetes
author:
  name: Linode Community
  email: docs@linode.com
description: "Use kubeadm to deploy a cluster on Linode and get started with Kubernetes."
keywords: ['kubernetes','orchestration','docker','container']
tags: ["docker","kubernetes","container"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-04-30
modified: 2021-12-30
modified_by:
  name: Linode
title: "Use kubeadm to Deploy a Cluster on Linode"
h1_title: "Using kubeadm to Deploy a Kubernetes Cluster"
enable_h1: true
aliases: ['/kubernetes/getting-started-with-kubernetes/','/applications/containers/getting-started-with-kubernetes/','/applications/containers/kubernetes/getting-started-with-kubernetes/']
contributor:
  name: Linode
concentrations: ["Kubernetes"]
external_resources:
- '[Kubernetes: Configuration Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)'
- '[Kubernetes: Cluster Administration Overview](https://kubernetes.io/docs/concepts/cluster-administration/cluster-administration-overview/)'
- '[Kubernetes: Securing a Cluster](https://kubernetes.io/docs/tasks/administer-cluster/securing-a-cluster/)'
---

You can use <abbr title="kubeadm is a cloud provider agnostic tool that automates many of the tasks required to get a cluster up and running.">kubeadm</abbr> to run a few simple commands on individual servers to turn them into a Kubernetes cluster consisting of a <abbr title="A separate server in a Kubernetes cluster responsible for maintaining the desired state of the cluster.">master node</abbr> and <abbr title="Worker nodes in a Kubernetes cluster are servers that run your applications’ Pods.">worker nodes</abbr>. This guide walks you through installing kubeadm and using it to deploy a Kubernetes cluster on Linode. While the kubeadm approach requires more manual steps than other Kubernetes cluster creation pathways offered by Linode, this solution is covered as way to dive deeper into the various components that make up a Kubernetes cluster and the ways in which they interact with each other to provide a scalable and reliable container orchestration mechanism.

{{< note >}}
This guide's example instructions result in the creation of three billable Linodes. Information on how to tear down the Linodes are provided at the end of the guide. Interacting with the Linodes via the command line will provide the most opportunity for learning, however, this guide is written so that users can also benefit by reading along.
{{< /note >}}

## Alternatives for Creating Clusters

While kubeadm automates several cluster-provisioning tasks, there are other even faster methods for creating a cluster, all of which are great options for production ready deployments:

- The [Linode Kubernetes Engine](https://www.linode.com/products/kubernetes/), allows you to spin up a Kubernetes cluster from the [Cloud Manager](/docs/guides/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/) or the [Linode API](/docs/guides/deploy-and-manage-lke-cluster-with-api-a-tutorial/), and Linode handles the management and maintenance of your control plane.

- If you prefer a full featured GUI, [Linode's Rancher integration](/docs/guides/how-to-deploy-kubernetes-on-linode-with-rancher-2-x/) enables you to deploy and manage Kubernetes clusters with a simple web interface.

{{< content "k8s-alpha-deprecation-shortguide" >}}

## Before You Begin

1.  Deploy three Linodes running Ubuntu 18.04 with a minimum of the following system requirements:

    - One Linode to use as the master Node with 4GB RAM and 2 CPU cores.
    - Two Linodes to use as the worker Nodes each with 2GB RAM and 1 CPU core.

1.  Follow the [Getting Started](/docs/guides/getting-started) and the [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guides for instructions on setting up your Linodes. The steps in this guide assume the use of a limited user account with sudo privileges.

    {{< note >}}
When following the [Getting Started](/docs/guides/getting-started) guide, make sure that each Linode is using a different hostname. Not following this guideline leaves you unable to join some or all nodes to the cluster in a later step.
{{< /note >}}

1.  Disable swap memory on your Linodes. Kubernetes requires that you disable swap memory on any cluster nodes to prevent the <abbr title="The kube-scheduler is a function that looks for newly created Pods that have no nodes.">kube-scheduler</abbr> from assigning a Pod to a node that has run out of CPU/memory or reached its designated CPU/memory limit.

        sudo swapoff -a

    Verify that your swap has been disabled. You should expect to see a value of `0` returned.

        cat /proc/meminfo | grep 'SwapTotal'

    To learn more about managing compute resources for containers, see the official [Kubernetes documentation](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/).

1.  Read the [Beginners Guide to Kubernetes](/docs/guides/beginners-guide-to-kubernetes/) to familiarize yourself with the major components and concepts of Kubernetes. The current guide assumes a working knowledge of common Kubernetes concepts and terminology.

## Build a Kubernetes Cluster
### Kubernetes Cluster Architecture

A Kubernetes cluster consists of a master node and worker nodes. The master node hosts the *control plane*, which is the combination of all the components that provide it the ability to maintain the desired cluster state. This cluster state is defined by manifest files and the <abbr title="kubectl is a command line tool used to interact with the Kubernetes cluster.">kubectl</abbr> tool. While the control plane components can be run on any cluster node, it is a best practice to isolate the control plane on its own node and to run any application containers on a separate worker node. A cluster can have a single worker node or up to 5000. Each worker node must be able to maintain running containers in a Pod and be able to communicate with the master node's control plane.

The following table provides a list of the Kubernetes tooling you need to install on your master and worker nodes in order to meet the minimum requirements for a functioning Kubernetes cluster as described above.

| Tool | Master Node | Worker Nodes |
| --------- | :---------: | :----------: |
| <abbr title="This tool provides a simple way to create a Kubernetes cluster by automating the tasks required to get a cluster up and running. New Kubernetes users with access to a cloud hosting provider, like Linode, can use kubeadm to build out a playground cluster. kubeadm is also used as a foundation to create more mature Kubernetes deployment tooling.">kubeadm</abbr>| x | x |
| <abbr title="A container runtime is responsible for running the containers that make up a cluster's pods. This guide will use Docker Engine as the container runtime.">Container Runtime</abbr> | x | x |
| <abbr title="kubelet ensures that all pod containers running on a node are healthy and meet the specifications for a pod's desired behavior.">kubelet</abbr> | x | x |
| <abbr title="A command line tool used to manage a Kubernetes cluster.">kubectl</abbr>| x | x |
| <abbr title="The control plane is responsible for keeping a record of the state of a cluster, making decisions about the cluster, and pushing the cluster towards new desired states.">Control Plane</abbr>| x |  |

 {{< note >}}
 The control plane is a series of services that form Kubernetes master structure that allow it to control the cluster. The kubeadm tool allows the control plane services to run as containers on the master node. The control plane is created when you initialize kubeadm later in this guide.
 {{< /note >}}

### Install the Container Runtime: Docker Engine

For this installation, Docker Engine will be the software responsible for running the Pods on each node. If preferred, other container runtimes can be used with Kubernetes, such as [Containerd](https://containerd.io/) and [CRI-O](https://cri-o.io/). In order to ensure the container runtime is usable, it must be installed on **all Linodes in the cluster**.

These steps install Docker Community Edition (CE) using the official Ubuntu repositories. To install on another distribution, see the official [installation page](https://docs.docker.com/install/).

1.  Remove any older installations of Docker that may be on your system:

        sudo apt remove docker docker.io containerd runc

1.  Make sure you have the necessary packages to allow the use of Docker's repository:

        sudo apt install apt-transport-https ca-certificates curl software-properties-common gnupg curl lsb-release

1.  Add Docker's GPG key:

        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

1.  Verify the fingerprint of the GPG key:

        sudo apt-key fingerprint 0EBFCD88

    You should see the following output:

    {{< output >}}
pub   4096R/0EBFCD88 2017-02-22
        Key fingerprint = 9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
uid                  Docker Release (CE deb) <docker@docker.com>
sub   4096R/F273FCD8 2017-02-22
{{< /output >}}

1.  Add the `stable` Docker repository:

        sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

1.  Update your package index and install Docker CE. For more information, see the [Docker](https://kubernetes.io/docs/setup/production-environment/container-runtimes/#docker) instructions within the Kubernetes setup guide.

        sudo apt update
        sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin

    Alternatively, you can install specific versions of the software if you wish to prioritize stability. The following example installs specific versions, though you may wish to find the latest validated versions within [Kubernetes dependencies file](https://github.com/kubernetes/kubernetes/blob/master/build/dependencies.yaml).

        sudo apt-get update && sudo apt-get install -y \
        containerd.io=1.2.13-2 \
        docker-ce=5:19.03.11~3-0~ubuntu-$(lsb_release -cs) \
        docker-ce-cli=5:19.03.11~3-0~ubuntu-$(lsb_release -cs)

1.  Add your limited Linux user account to the `docker` group. Replace `$USER` with your username:

        sudo usermod -aG docker $USER

    {{< note >}}
After entering the `usermod` command, you need to close your SSH session and open a new one for this change to take effect.
{{< /note >}}

1.  Check that the installation was successful by running the built-in "Hello World" program:

        sudo docker run hello-world

1.  Setup the Docker daemon to use <abbr title="systemd is a Linux initialization system and service manager that includes features like on-demand starting of daemons, mount and automount point maintenance, snapshot support, and processes tracking using Linux control groups.">systemd </abbr> as the cgroup driver, instead of the default cgroupfs. This is a recommended step so that kubelet and Docker are both using the same cgroup manager. This makes it easier for Kubernetes to know which resources are available on your cluster's nodes.

        sudo bash -c 'cat > /etc/docker/daemon.json <<EOF
        {
          "exec-opts": ["native.cgroupdriver=systemd"],
          "log-driver": "json-file",
          "log-opts": {
            "max-size": "100m"
          },
          "storage-driver": "overlay2"
        }
        EOF'

1.  Create a systemd directory for Docker:

        sudo mkdir -p /etc/systemd/system/docker.service.d

1.  Restart Docker:

        sudo systemctl daemon-reload
        sudo systemctl restart docker

1. To ensure that Docker is using systemd as the cgroup driver, enter the following command:

        sudo docker info | grep -i cgroup

   You should see the following output:

   {{< output >}}
 Cgroup Driver: systemd
 Cgroup Version: 1
 {{< /output >}}

### Install the cri-dockerd Service

Although previously an unnecessary step when using Docker as a container runtime, as of [Kubernetes v1.24](https://kubernetes.io/releases/#release-v1-24), the [Dockershim adapter service was officially removed from Kubernetes](https://kubernetes.io/blog/2022/02/17/dockershim-faq/). In order to prepare for this change, Mirantis and Docker have worked together to create an adapter service called **cri-dockerd** to continue support for Docker as a container runtime. Installing the [cri-dockerd](https://github.com/mirantis/cri-dockerd) service is a necessary step on all clusters using Kubernetes version 1.24 or later, and should be performed when following the steps in this guide:

1.  Install the `go` programming language to support later commands performed during the installation process:

        sudo apt install golang-go

1.  Clone the `cri-dockerd` repository and change your working directory into the installation path:

        cd && git clone https://github.com/Mirantis/cri-dockerd.git
        cd cri-dockerd

1.  Build the code:

        sudo mkdir bin
        cd src && go get && go build -o ../bin/cri-dockerd

1.  Configure `cri-dockerd` to work with systemd:

        cd .. && mkdir -p /usr/local/bin
        install -o root -g root -m 0755 bin/cri-dockerd /usr/local/bin/cri-dockerd
        cp -a packaging/systemd/* /etc/systemd/system
        sed -i -e 's,/usr/bin/cri-dockerd,/usr/local/bin/cri-dockerd,' /etc/systemd/system/cri-docker.service

1.  Reload all systemd files and ensure that the systemd service for `cri-dockerd` is fully enabled:

        systemctl daemon-reload
        systemctl enable cri-docker.service
        systemctl enable --now cri-docker.socket

### Install kubeadm, kubelet, and kubectl

Complete the steps outlined in this section on all three Linodes.

1.  Add the required GPG key to your apt-sources keyring to authenticate the Kubernetes related packages you install:

        curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg  | sudo apt-key add -

1.  Add Kubernetes to the package manager's list of sources:

        sudo bash -c "cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
        deb https://apt.kubernetes.io/ kubernetes-xenial main
        EOF"

1.  Update apt, install kubeadm, kubelet, and kubectl, and hold the installed packages at their installed versions:

        sudo apt-get update
        sudo apt-get install -y kubelet kubeadm kubectl
        sudo apt-mark hold kubelet kubeadm kubectl

1.  Verify that kubeadm, kubelet, and kubectl have installed by retrieving their version information. Each command should return version information about each package.

        kubeadm version
        kubelet --version
        kubectl version

### Set up the Kubernetes Control Plane

After installing the Kubernetes related tooling on all your Linodes, you are ready to set up the Kubernetes control plane on the master node. The control plane is responsible for allocating resources to your cluster, maintaining the health of your cluster, and ensuring that it meets the minimum requirements you designate for the cluster.

The primary components of the control plane are the <abbr title="The kube-apiserver is the front end for the Kubernetes API server. It validates and configures data for Kubernetes’ API objects including Pods, Services, Deployments, and more.">kube-apiserver</abbr>, <abbr title="The kube-controller-manager is a daemon that manages the Kubernetes control loop. It watches the shared state of the cluster through the Kubernetes API server.">kube-controller-manager</abbr>, kube-scheduler, and etcd. You can easily initialize the Kubernetes master node with all the necessary control plane components using kubeadm. For more information on each of control plane component see the [Beginner's Guide to Kubernetes](/docs/guides/beginners-guide-to-kubernetes/).

In addition to the baseline control plane components, there are several *addons*, that can be installed on the master node to access additional cluster features. You need to install a networking and network policy provider addon that implements the [Kubernetes' network model](https://kubernetes.io/docs/concepts/cluster-administration/networking/) on the cluster's Pod network.

This guide uses *Calico* as the Pod network add on. Calico is a secure and open source L3 networking and network policy provider for containers. There are several other network and network policy providers to choose from. To view a full list of providers, refer to the official [Kubernetes documentation](https://kubernetes.io/docs/concepts/cluster-administration/addons/#networking-and-network-policy).

{{< note >}}
kubeadm only supports Container Network Interface (CNI) based networks. CNI consists of a specification and libraries for writing plugins to configure network interfaces in Linux containers
{{</ note >}}

1.  Initialize kubeadm on the master node. This command runs checks against the node to ensure it contains all required Kubernetes dependencies. If the checks pass, kubeadm installs the control plane components.

    When issuing this command, it is necessary to set the Pod network range that Calico uses to allow your Pods to communicate with each other. It is recommended to use the private IP address space, `10.2.0.0/16`. Additionally, the CRI connection socket will need to be manually set, in this case to use the socket path to `cri-dockerd`.

    {{< note >}}
The Pod network IP range should not overlap with the service IP network range. The default service IP address range is `10.96.0.0/12`. You can provide an alternative service ip address range using the `--service-cidr=10.97.0.0/12` option when initializing kubeadm. Replace `10.97.0.0/12` with the desired service IP range:

For a full list of available kubeadm initialization options, see the official [Kubernetes documentation](https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-init/).
    {{</ note >}}

        sudo kubeadm init --pod-network-cidr=10.2.0.0/16 --cri-socket=unix:///var/run/cri-dockerd.sock

      You should see a similar output:

      {{< output >}}

Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a Pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 192.0.2.0:6443 --token udb8fn.nih6n1f1aijmbnx5 \
    --discovery-token-ca-cert-hash sha256:b7c01e83d63808a4a14d2813d28c127d3a1c4e1b6fc6ba605fe4d2789d654f26
      {{</ output >}}

      The `kubeadm join` command will be used in the [Join a Worker Node to the Cluster](#join-a-worker-node-to-the-cluster) section of this guide to bootstrap the worker nodes to the Kubernetes cluster. This command should be kept handy for later use. Below is a description of the required options you will need to pass in with the `kubeadm join` command:
      - The master node's IP address and the Kubernetes API server's port number. In the example output, this is `192.0.2.0:6443`. The Kubernetes API server's port number is `6443` by default on all Kubernetes installations.
      - A bootstrap token. The bootstrap token has a 24-hour TTL (time to live). A new bootstrap token can be generated if your current token expires.
      - A CA key hash. This is used to verify the authenticity of the data retrieved from the Kubernetes API server during the bootstrap process.

1.  Copy the `admin.conf` configuration file to your limited user account. This file allows you to communicate with your cluster via kubectl and provides superuser privileges over the cluster. It contains a description of the cluster, users, and contexts. Copying the `admin.conf` to your limited user account provides you with administrative privileges over your cluster.

        mkdir -p $HOME/.kube
        sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
        sudo chown $(id -u):$(id -g) $HOME/.kube/config

1.  Install the necessary Calico manifests to your master node and apply them using kubectl:

        kubectl create -f https://projectcalico.docs.tigera.io/manifests/tigera-operator.yaml
        kubectl create -f https://projectcalico.docs.tigera.io/manifests/custom-resources.yaml

### Inspect the Master Node with Kubectl

After completing the previous section, your Kubernetes master node is ready with all the necessary components to manage a cluster. To gain a better understanding of all the parts that make up the master's control plane, this section walks you through inspecting your master node. If you have not yet reviewed the [Beginner's Guide to Kubernetes](/docs/guides/beginners-guide-to-kubernetes/), it is helpful to do so prior to continuing with this section as it relies on the understanding of basic Kubernetes concepts.

1.  View the current state of all nodes in your cluster. At this stage, the only node you should expect to see is the master node, since worker nodes have yet to be bootstrapped. A `STATUS` of `Ready` indicates that the master node contains all necessary components, including the Pod network add-on, to start managing clusters.

        kubectl get nodes

    Your output should resemble the following:

    {{< output >}}
NAME          STATUS     ROLES     AGE   VERSION
kube-master   Ready      master    1h    v1.14.1
    {{</ output >}}

1.  Inspect the available [namespaces](/docs/guides/beginners-guide-to-kubernetes-part-3-objects/#namespaces) in your cluster.

        kubectl get namespaces

    Your output should resemble the following:

    {{< output >}}
NAME              STATUS   AGE
default           Active   23h
kube-node-lease   Active   23h
kube-public       Active   23h
kube-system       Active   23h
    {{</ output >}}

    Below is an overview of each namespace installed by default on the master node by kubeadm:

    - `default`: The default namespace contains objects with no other assigned namespace. By default, a Kubernetes cluster will instantiate a default namespace when provisioning the cluster to hold the default set of Pods, Services, and Deployments used by the cluster.
    - `kube-system`: The namespace for objects created by the Kubernetes system. This includes all resources used by the master node.
    - `kube-public`: This namespace is created automatically and is readable by all users. It contains information, like certificate authority data (CA), that helps kubeadm join and authenticate worker nodes.
    - `kube-node-lease`: The `kube-node-lease` namespace contains lease objects that are used by kubelet to determine node health. kubelet creates and periodically renews a Lease on a node. The node lifecycle controller treats this lease as a health signal. kube-node-lease was released to beta in Kubernetes 1.14.

1.  View all resources available in the `kube-system` namespace. The `kube-system` namespace contains the widest range of resources, since it houses all control plane resources. Replace `kube-system` with another namespace to view its corresponding resources.

        kubectl get all -n kube-system

### Join a Worker Node to the Cluster

Now that your Kubernetes master node is set up, you can join worker nodes to your cluster. In order for a worker node to join a cluster, it must *trust* the cluster's control plane, and the control plane must trust the worker node. This trust is managed via a shared bootstrap token and a certificate authority (CA) key hash. kubeadm handles the exchange between the control plane and the worker node. At a high-level the worker node bootstrap process is the following:

1.  kubeadm retrieves information about the cluster from the Kubernetes API server. The bootstrap token and CA key hash are used to ensure the information originates from a trusted source.

1.  kubelet can take over and begin the bootstrap process, since it has the necessary cluster information retrieved in the previous step. The bootstrap token is used to gain access to the Kubernetes API server and submit a certificate signing request (CSR), which is then signed by the control plane.

1.  The worker node's kubelet is now able to connect to the Kubernetes API server using the node's established identity.

Before continuing, you need to make sure that you know your Kubernetes API server's IP address, that you have a bootstrap token, and a CA key hash. This information was provided when kubeadm was initialized on the master node in the [Set up the Kubernetes Control Plane](#set-up-the-kubernetes-control-plane) section of this guide. If you no longer have this information, you can regenerate the necessary information from the master node.

{{< disclosure-note "Regenerate a Bootstrap Token" >}}
These commands should be issued from your master node.

1.  Generate a new bootstrap token and display the `kubeadm join` command with the necessary options to join a worker node to the master node's control plane:

        kubeadm token create --print-join-command

{{</ disclosure-note >}}

Follow the steps below on each node you would like to bootstrap to the cluster as a worker node.

1.  SSH into the Linode that is used as a worker node in the Kubernetes cluster.

        ssh username@192.0.2.1

1.  Join the node to your cluster using kubeadm. Ensure you replace `192.0.2.0:6443` with the IP address for your master node along with its Kubernetes API server's port number, `udb8fn.nih6n1f1aijmbnx5` with your bootstrap token, and `sha256:b7c01e83d63808a4a14d2813d28c127d3a1c4e1b6fc6ba605fe4d2789d654f26` with your CA key hash. Additionally, ensure that the `--cri-socket` option is manually added to the command to specify `cri-docker` using the `unix:///var/run/cri-dockerd.sock` socket. The final command will resemble the following, and may take a few moments to complete:

        sudo kubeadm join :6443 --token udb8fn.nih6n1f1aijmbnx5 \
        --discovery-token-ca-cert-hash sha256:b7c01e83d63808a4a14d2813d28c127d3a1c4e1b6fc6ba605fe4d2789d654f26 --cri-socket=unix:///var/run/cri-dockerd.sock

      When the bootstrap process has completed, you should see a similar output:

      {{< output >}}
  This node has joined the cluster:
* Certificate signing request was sent to apiserver and a response was received.
* The kubelet was informed of the new secure connection details.

Run 'kubectl get nodes' on the control-plane to see this node join the cluster.
      {{</ output >}}

1.  Repeat the steps outlined above on the second worker node to bootstrap it to the cluster.

1.  SSH into the master node and verify the worker nodes have joined the cluster:

         kubectl get nodes

      You should see a similar output.

      {{< output >}}
NAME          STATUS   ROLES    AGE     VERSION
kube-master   Ready    master   1d22h   v1.14.1
kube-node-1   Ready    <none>   1d22h   v1.14.1
kube-node-2   Ready    <none>   1d22h   v1.14.1
      {{</ output >}}

## Next Steps

Now that you have a Kubernetes cluster up and running, you can begin experimenting with the various ways to configure Pods, group resources, and deploy services that are exposed to the public internet. To help you get started with this, move on to follow along with the [Deploy a Static Site on Linode using Kubernetes](/docs/guides/how-to-deploy-a-static-site-on-linode-kubernetes-engine/) guide.

## Tear Down Your Cluster

If you are done experimenting with your Kubernetes cluster, be sure to remove the Linodes you have running in order to avoid being further billed for them. See the [Managing Billing in the Cloud Manager > Removing Services](/docs/guides/manage-billing-in-cloud-manager/#removing-services) guide.
