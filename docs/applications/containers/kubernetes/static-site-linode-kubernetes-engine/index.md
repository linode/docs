---
author:
  name: Linode Community
  email: docs@linode.com
description: 'How to Support a Static Site with Linode Kubernetes Engine.'
keywords: ['static','site','generator','ss','ssg','lke','kubernetes']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-07-19
modified: 2019-07-19
modified_by:
  name: Linode
title: "How to Support a Static Site with Linode Kubernetes Engine"
contributor:
  name: Linode
external_resources:
- '[Link Title 1](http://www.example.com)'
---

Kubernetes is a container orchestration tool that allows you to deploy and scale containerized applications. Linode Kubernetes Engine (LKE) allows you to easily create, scale, and manage Kubernetes clusters to meet your app's demands, reducing the often complicated cluster set up process to just a few clicks. This guide will show you how to create a simple containerized application and deploy it to a cluster created with LKE.

## Scope of this Guide

This guide will show you how to:

- Create a cluster using Linode Kubernetes Engine.
- Connect to a LKE Kubernetes cluster with the command line tool `kubectl`.
- Create a site with Hugo, a static site generator (SSG).
- Containerize your static site using Docker.
- Deploy your containers to your Kubernetes cluster.

## Before You Begin

You should have a working knowledge of Kubernetes' key concepts, including master and worker Nodes, Pods, Deployments, and Services. For more information on Kubernetes, see our [Beginner's Guide to Kubernetes](/docs/applications/containers/beginners-guide-to-kubernetes/).

### kubectl

You should also have `kubectl` installed on your local workstation. `kubectl` is the command line interface for Kubernetes, and allows you to remotely connect to your Kubernetes cluster to perform tasks. If you don't have `kubectl` installed, follow the [installation instructions on the Kubernetes website](https://kubernetes.io/docs/tasks/tools/install-kubectl/) for your workstation's operating system.

Once you have `kubectl` installed, check its version number by issuing the `version` command:

    kubectl version

You should see output similar to the following:

{{< output >}}
Client Version: version.Info{Major:"1", Minor:"13", GitVersion:"v1.13.4", GitCommit:"c27b913fddd1a6c480c229191a087698aa92f0b1", GitTreeState:"clean", BuildDate:"2019-03-01T23:34:27Z", GoVersion:"go1.12", Compiler:"gc", Platform:"darwin/amd64"}
{{</ output >}}

Note the `GitVersion`, you will use it to select an appropriate Kubernetes version for our cluster.

### git

To perform some of the commands in this guide you will need to have Git installed on your workstation. Git is a version control system that allows you to save various states of your codebase. Follow our How to [Install Git on Linux, Mac or Windows](https://linode.com/docs/development/version-control/how-to-install-git-on-linux-mac-and-windows/) guide for instructions on how to install Git.

### Docker

## Create a Cluster with LKE

1.  In your browser, navigate to the [Linode Cloud Manager](https://cloud.linode.com)
2.  In the left-hand navigation, click on **Kubernetes**.
3.  Click on **Add a Cluster**. You will be see the *Create a Kubernetes Cluster* menu.
4.  Under *Region*, select a region for your cluster.
5.  Under *Add Node Pools*, select the type of Linode you would like to add to the Node Pool. The Node Pool is a predfined number of worker Nodes that make up the cluster. A cluster must have at least one Node in the Node Pool.

    Under the Linode types, select the number of Linodes you would like to add to your pool.

    {{< caution >}}
Each of the Nodes in the Node Pool are Linodes, and represent billable resources. Once you've added Nodes to your Pool, you will be presented with the total cost of your Kubernetes cluster before its creation. After you've completed this guide, be sure to delete any resources you aren't using to avoid being charged the hourly rate.
{{</ caution >}}

    When you are done adding Nodes to the Node Pool, click the **Add Node Pool** button.
6.  Supply a cluster label in the **Cluster Label** field.
7.  Select a version of Kubernetes from the **Kubernetes** drop-down list.
8.  Add any optional tags to the cluster. Tags are used to organize Linode resources.
9.  Click **Create**.

## Connect to your Cluster with kubectl

LKE provides Kubernetes configuration files for each cluster. These files are used to set the *context* of `kubectl`. Contexts give `kubectl` instructions for which Kubernetes cluster they should interact with. Follow the below instructions to download the configuration file for your cluster and set it as the context for `kubectl`.

1.  On the *Kubernets Clusters* page, click on the meatball menu (three dots) to the right of the cluster you just created, and select **Download kubeconfig**. This will prompt a download for a file named `kubeconfig.yaml`.

2.  Open a terminal window and navigate to the `$HOME/.kube` directory:

        cd $HOME/.kube

3.  Create a directory called `/configs`. You will use this directory to store your `kubeconfig.yaml` files.

        mkdir configs

4.  Copy your `kubeconfig.yaml` file to the `$HOME/.kube/configs` directory. You can give this file a different name to help distinguish it from other `kubeconfig.yaml` files:

        cp ~/Downloads/kubeconfig.yaml $HOME/.kube/configs/static-site.yaml

5.  Open up your bash profile in the text editor of your choice and add your configuration file to the $KUBECONFIG PATH variable:

        nano ~/.bash_profile

        export KUBECONFIG:$KUBECONFIG:$HOME/.kube/config:$HOME/.kube/configs/static-site.yaml

6.  Close your shell window and open a new shell window to receive the changes to the $KUBECONFIG variable.
7.  Use the `config get-contexts` command to view the available cluster contexts:

        kubectl config get-contexts

    You should see output similar to the following:

    {{< output >}}
CURRENT   NAME                                  CLUSTER       AUTHINFO                  NAMESPACE
          kubernetes-admin@kubernetes           kubernetes    kubernetes-admin
{{</ output >}}

8.  If your context is not already selected, (denoted by an asterisk in the "current" column), switch to this context using the `config use-context` command, supplying the full name of the cluster (including the authorized user and the cluster):

        kubectl config use-context kubernetes-admin@kubernetes

    You should see output like the following:

    {{< output >}}
Switched to context "kubernetes-admin@kubernetes".
{{</ output>}}

You are now ready to interact with your cluster using `kubectl`. You can test this by retrieving a list of Pods in the `kube-system` namespace:

    kubectl get pods -n kube-system

You should see output like the following:

{{< output >}}
NAME                       READY   STATUS    RESTARTS   AGE
calico-node-sjsd9          1/1     Running   0          20h
coredns-86c58d9df4-2m62k   0/1     Pending   0          20h
coredns-86c58d9df4-gzspx   0/1     Pending   0          20h
csi-linode-controller-0    0/3     Pending   0          20h
kube-proxy-gh458           1/1     Running   0          20h
{{</ output >}}

## Create a Static Site

A static site generator is usually a command line tool that takes text files written in markup language like [Markdown](https://daringfireball.net/projects/markdown/) and turns them into valid HTML, CSS, and JavaScript files. Static sites are prized for their simplicity and speed. The Linode documentation website, and this guide, employ Hugo, a static site generator written in the Go programming language, but you can choose one that best suits your needs by reading our [How to Choose a Static Site Generator guide](/docs/websites/static-sites/how-to-choose-static-site-generator/). The steps in this section are generally the same across static site generators: install a static site generator, create some content in a text file, and then generate your site's HTML through a build process.

### Install Hugo

To download and install Hugo, you can use a package manager.

- For **Debian** and **Ubuntu**:

        sudo apt-get install hugo

- For **Red Hat**, **Fedora**, and **CentOS**:

        sudo dnf install hugo

- For **macOS**, use [Homebrew](https://brew.sh):

        brew install hugo

For more information on downloading Hugo, you can visit the official [Hugo website](https://gohugo.io/getting-started/installing/).

### Create a New Site for Hugo

1.  Use Hugo to create a new site:

     hugo new site lke-example

