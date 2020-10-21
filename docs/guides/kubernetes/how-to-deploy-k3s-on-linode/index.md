---
slug: how-to-deploy-k3s-on-linode
author:
  name: Rajakavitha Kodhandapani
  email: docs@linode.com
description: 'K3s is lightweight, easy-to-install Kubernetes. This guide provides instructions to deploy a highly available, certified Kubernetes distribution designed for production workloads, and install an application on a K3s cluster.'
og_description: 'K3s is lightweight, easy-to-install Kubernetes. This guide provides instructions to deploy a highly available, certified Kubernetes distribution designed for production workloads, and install an application on a K3s cluster.'
keywords: ["rancher", "ubuntu", "18.04", "k3s", "kubernetes"]
tags: ["mysql","kubernetes","database","container","postgresql","nginx"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-04-30
modified_by:
  name: Linode
title: How to Deploy K3s on Linode
h1_title: Deploying K3s on Linode
image: how_to_deploy_k3s_on_linode.png
external_resources:
  - '[Rancher Official Docs](https://rancher.com/docs/k3s/latest/en/)'
  - '[Kubernetes Official Docs] (https://kubernetes.io/docs/)'
aliases: ['/kubernetes/how-to-deploy-k3s-on-linode/']
---

[K3s](https://k3s.io/) is a lightweight, easy-to-install Kubernetes distribution. Built for the edge, K3s includes an embedded SQLite database as the default datastore and supports external datastore such as PostgreSQL, MySQL, and etcd. K3s includes a command line cluster controller, a local storage provider, a service load balancer, a Helm controller, and the Traefik ingress controller. It also automates and manages complex cluster operations such as distributing certificates. With K3s, you can run a highly available, certified Kubernetes distribution designed for production workloads on resource-light machines like [1GB Linodes](https://www.linode.com/pricing) (Nanodes).

{{< note >}}
*   While you can deploy a K3s cluster on just about any flavor of Linux, K3s is officially tested on Ubuntu 16.04 and Ubuntu 18.04. If you are deploying K3s on CentOS where SELinux is enabled by default, then you must ensure that proper SELinux policies are installed. For more information, see Rancher's documentation on [SELinux support](https://rancher.com/docs/k3s/latest/en/advanced/#experimental-selinux-support).
*   1GB Linode (Nanode) instances are suitable for low-duty workloads where performance isn't critical. Depending on your requirements, you can choose to use Linodes with greater resources for your K3s cluster.
{{< /note >}}

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide.

1.  [Create](/docs/getting-started/#create-a-linode) two Linodes in the same region that are running Ubuntu 18.04.

1.  Complete the steps for [setting the hostname](/docs/getting-started/#set-the-hostname) and [timezone](/docs/getting-started/#set-the-timezone) for both Linodes. When setting hostnames, it may be helpful to identify one Linode as a server and the other as an agent.

1.  Follow our [Securing Your Server](/docs/security/securing-your-server) guide to [create a standard user account](/docs/security/securing-your-server/#add-a-limited-user-account), [harden SSH access](/docs/security/securing-your-server/#harden-ssh-access), [remove unnecessary network services](/docs/security/securing-your-server/#remove-unused-network-facing-services), and [create firewall rules](/docs/security/securing-your-server/#configure-a-firewall) to allow all outgoing traffic and deny all incoming traffic except SSH traffic on both Linodes.

    {{< content "limited-user-note-shortguide" >}}

1.  Ensure that your Linodes are up to date:

        sudo apt update && sudo apt upgrade

## Install K3s Server

First, you will install the K3s server on a Linode, from which you will manage your K3s cluster.

1.  [Connect](/docs/getting-started/#connect-to-your-linode-via-ssh) to the Linode where you want to install the K3s server.

1.  Open port 6443/tcp on your firewall to make it accessible by other nodes in your cluster:

        sudo ufw allow 6443/tcp

1.  Open port 8472/udp on your firewall to enable Flannel VXLAN:

    {{< note >}}
Replace `192.0.2.1` with the IP address of your K3s Agent Linode.

As detailed in [Rancher's Installation Requirements](https://rancher.com/docs/k3s/latest/en/installation/installation-requirements/#networking), port 8472 should not be accessible outside of your cluster for security reasons.
{{< /note >}}

        sudo ufw allow from 192.0.2.1 to any port 8472 proto udp

1.  (Optional) Open port 10250/tcp on your firewall to utilize the metrics server:

        sudo ufw allow 10250/tcp

1.  Set environment variables used for installing the K3s server:

        export K3S_KUBECONFIG_MODE="644"
        export K3S_NODE_NAME="k3s-server-1"

1.  Execute the following command to install K3s server:

        curl -sfL https://get.k3s.io | sh -

1.  Verify the status of the K3s server:

        sudo systemctl status k3s

1.  Retrieve the access token to connect a K3s Agent Linode to your K3s Server Linode:

        sudo cat /var/lib/rancher/k3s/server/node-token

    The expected output is similar to:

        abcdefABCDEF0123456789::server:abcdefABCDEF0123456789

1.  Copy the access token and save it in a secure location.

## Install K3s Agent

Next you will install the K3s agent on a Linode.

1.  [Connect](/docs/getting-started/#connect-to-your-linode-via-ssh) to the Linode where you want to install the K3s agent.

1.  Open port 8472/udp on your firewall to enable Flannel VXLAN:

    {{< note >}}
Replace `192.0.2.0` with the IP address of your K3s Server Linode.

As detailed in [Rancher's Installation Requirements](https://rancher.com/docs/k3s/latest/en/installation/installation-requirements/#networking), port 8472 should not be accessible outside of your cluster for security reasons.
{{< /note >}}

        sudo ufw allow from 192.0.2.0 to any port 8472 proto udp

1.  (Optional) Open port 10250 on your firewall to utilize the metrics server:

        sudo ufw allow 10250/tcp

1.  Set environment variables used for installing the K3s agent:

    {{< note >}}
Replace `192.0.2.0` with the IP address of your K3s Server Linode and `abcdefABCDEF0123456789::server:abcdefABCDEF0123456789` with the its access token.
{{< /note >}}

        export K3S_KUBECONFIG_MODE="644"
        export K3S_NODE_NAME="k3s-agent-1"
        export K3S_URL="https://192.0.2.0:6443"
        export K3S_TOKEN="abcdefABCDEF0123456789::server:abcdefABCDEF0123456789"

1.  Execute the following command to install a K3s server:

        curl -sfL https://get.k3s.io | sh -

1.  Verify the status of the K3s agent:

        sudo systemctl status k3s-agent

## Manage K3s

Your K3s installation includes [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/), a command-line interface for managing Kubernetes clusters.

From your K3s Server Linode, use `kubectl` to get the details of the nodes in your K3s cluster.

    kubectl get nodes

The expected output is similar to:

    NAME           STATUS   ROLES    AGE   VERSION
    k3s-server-1   Ready    master   95s   v1.18.2+k3s1
    k3s-agent-1    Ready    <none>   21s   v1.18.2+k3s1

{{< note >}}
To manage K3s from outside the cluster, copy the contents of `/etc/rancher/k3s/k3s.yaml` from your K3s Server Linode to `~/.kube/config` on an external machine where you have [installed kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/), replacing `127.0.0.1` with the IP address of your K3s Server Linode.
{{< /note >}}

## Test K3s

Here, you will test your K3s cluster with a simple NGINX website deployment.

1.  On your K3s Server Linode, create a manifest file labeled `nginx.yaml`, open it with a text editor, and add the following text that describes a single-instance deployment of NGINX that is exposed to the public using a K3s service load balancer:

    {{< file "nginx.yaml" >}}
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  ports:
    - protocol: TCP
      port: 8081
      targetPort: 80
  selector:
    app: nginx
  type: LoadBalancer

{{< /file >}}

1.  Save and close the `nginx.yaml` file.

1.  Deploy the NGINX website on your K3s cluster:

        kubectl apply -f ./nginx.yaml

    The expected output is similar to:

        deployment.apps/nginx created
        service/nginx created

1.  Verify that the pods are running:

        kubectl get pods

    The expected output is similar to:

        NAME                    READY   STATUS    RESTARTS   AGE
        svclb-nginx-c6rvg       1/1     Running   0          21s
        svclb-nginx-742gb       1/1     Running   0          21s
        nginx-cc7df4f8f-2q7vf   1/1     Running   0          22s

1.  Verify that your deployment is ready:

        kubectl get deployments

    The expected output is similar to:

        NAME    READY   UP-TO-DATE   AVAILABLE   AGE
        nginx   1/1     1            1           57s

1.  Verify that the load balancer service is running:

        kubectl get services nginx

    The expected output is similar to:

        NAME       TYPE           CLUSTER-IP    EXTERNAL-IP       PORT(S)          AGE
        nginx      LoadBalancer   10.0.0.89     192.0.2.1         8081:31809/TCP   33m

1.  In a web browser navigation bar, type the IP address listed under `EXTERNAL_IP` from your output and append the port number `:8081` to reach the default NGINX welcome page.

1.  Delete your test NGINX deployment:

        kubectl delete -f ./nginx.yaml

## Tear Down K3s

To uninstall your K3s cluster:

1.  Connect to your K3s Agent Linode and run the following commands:

        sudo /usr/local/bin/k3s-agent-uninstall.sh
        sudo rm -rf /var/lib/rancher

1.  Connect to your K3s Server Linode and run the following commands:

        sudo /usr/local/bin/k3s-uninstall.sh
        sudo rm -rf /var/lib/rancher
