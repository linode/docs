---
author:
  name: Kiran Singh
description: 'This guide shows how to install Kubernetes on a Linode with CentOS or Ubuntu. Includes a section on how to deploy nginx to the example cluster.'
keywords: ["kubernetes","docker","container","deployment","nginx"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-01-08
modified_by:
  name: Linode
published: 2017-11-27
title: 'How to Install, Configure, and Deploy NGINX on a Kubernetes Cluster'
contributor:
  name: Kiran Singh
  link: https://github.com/snarik
og_description: 'Kubernetes can be configured to provide highly available, horizontally autoscaling, automated deployments. This guide shows you how to set up a Kubernetes cluster on a Linode and manage the lifecycle of an NGINX service.'
external_resources:
- '[Kubernetes](https://kubernetes.io/)'
- '[Google Borg](https://research.google.com/pubs/pub43438.html)'
- '[Kubelet Definition](https://kubernetes.io/docs/admin/kubelet/)'
- '[CNI Spec](https://github.com/containernetworking/cni/blob/master/SPEC.md)'
---

![Kubernetes on Linode](Nginx_Kubernetes.jpg)

## What is Kubernetes?

[Kubernetes](https://kubernetes.io/) is an open-source container management system that is based on [Google Borg](https://research.google.com/pubs/pub43438.html). It can be configured to provide highly available, horizontally autoscaling, automated deployments. This guide shows you how to set up a Kubernetes cluster on a Linode and manage the lifecycle of an NGINX service.

## Before You Begin

You will need:

* Two or more Linodes with [Private IPs](/docs/networking/remote-access#adding-private-ip-addresses)
* Each Linode should have a 64-bit distribution of either:
    - Ubuntu 16.04+
    - Debian 9
    - CentOS 7
    - RHEL 7
    - Fedora 26
* At least 2GB RAM per Linode
* Root or sudo privileges to install and configure Kubernetes. Any user can interact with the cluster once it's configured.

## Prepare the Host Linode for Kubernetes

The steps in this guide create a two-node cluster. Evaluate your own resource requirements and launch an appropriately-sized cluster for your needs.

1.  Create two Linodes with at least 2GB memory within the same data center.

2.  For each node, go into the Remote Access tab of your Linode Manager and add a [private IP](/docs/networking/remote-access#adding-private-ip-addresses). It is possible to build a Kubernetes cluster using public IPs between data centers, but performance and security may suffer.

3.  Configure a firewall with [UFW](/docs/security/firewalls/configure-firewall-with-ufw/) or [iptables](/docs/security/firewalls/control-network-traffic-with-iptables/) to ensure only the two nodes can communicate with each other.

### Disable Swap Memory

Linodes come with swap memory enabled by default. [kubelets](https://kubernetes.io/docs/admin/kubelet/) do not support swap memory and will not work if swap is active or even present in your `/etc/fstab` file.

The `/etc/fstab` should look something like this:

{{< file "/etc/fstab" >}}
# /etc/fstab: static file system information.
#
# use 'blkid' to print the universally unique identifier for a
# device; this may be used with uuid= as a more robust way to name devices
# that works even if disks are added and removed. see fstab(5).
#
# &lt;file system&gt; &lt;mount point&gt;   &lt;type&gt;  &lt;options&gt;       &lt;dump&gt;  &lt;pass&gt;
# / was on /dev/sda1 during installation
/dev/sda         /               ext4    noatime,errors=remount-ro 0       1
/dev/sdb         none            swap    sw 0    0
{{< /file >}}

1.  Delete the line describing the swap partition. In this example, Line 10 with `/dev/sdb`.

2.  Disable swap memory usage:

        swapoff -a

### Set Hostnames for Kubernetes Nodes

To make the commands in this guide easier to understand, set up your hostname and hosts files on each of your machines.

1.  Choose a node to designate as your Kubernetes master node and SSH into it.

2.  Edit `/etc/hostname`, and add:

    {{< file "/etc/hostname" >}}
kube-master
{{< /file >}}

3.  Add the following lines to `/etc/hosts`:

    {{< file "/etc/hosts" >}}
<kube-master-private-ip>    kube-master
<kube-worker-private-ip>    kube-worker-1
{{< /file >}}

    If you have more than two nodes, add their private IPs to `/etc/hosts` as well.

    To make it easier to understand output and debug issues later, consider naming each hostname according to its role (`kube-worker-1`, `kube-worker-2`, etc.).

4.  Perform Steps 2 and 3 on each worker node, changing the values accordingly.

5.  For the changes to take effect, restart your Linodes.

### Confirm Hostnames

Once your nodes have rebooted, log into each to confirm your changes.

Check that:

 - `$ hostname` in the terminal outputs the expected hostname.
 - You can ping all of the nodes in your cluster by their hostnames.
 - Swap is correctly disabled on all nodes using `cat /proc/swaps`.

If you are unable to ping any of your hosts by their hostnames or private IPs:

1. SSH into the host that isn't responding.

2. Enter `ifconfig`. You should see an entry for `eth0:1` that lists your private IP. If `eth0:1` isn't listed, it's possible that you deployed your Linode image before adding a private IP to the underlying host. Recreate the image and return to the beginning of the guide.

## Install Docker and Kubernetes on Linode

**Debian/Ubuntu:**

    apt install ebtables ethtool

**CentOS/RHEL:**

    yum install ebtables ethtool

### Install Docker

{{< content "install-docker-ce.md" >}}

### Install kubeadm, kubectl, and kubelet

**Debian/Ubuntu:**

    curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
    echo 'deb http://apt.kubernetes.io/ kubernetes-xenial main' | sudo tee /etc/apt/sources.list.d/kubernetes.list
    sudo apt update
    sudo apt install -y kubelet kubeadm kubectl

**CentOS/RHEL:**

    cat <<eof > /etc/yum.repos.d/kubernetes.repo
    [kubernetes]
    name=kubernetes
    baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
    enabled=1
    gpgcheck=1
    repo_gpgcheck=1
    gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg
          https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
    eof
    setenforce 0
    yum install -y kubelet kubeadm kubectl
    systemctl enable kubelet && systemctl start kubelet

## Kubernetes Master and Slave

### Configure the Kubernetes Master Node

1.  On the master node initialize your cluster using its private IP:

        kubeadm init  --pod-network-cidr=192.168.0.0/16 --apiserver-advertise-address=<private IP>

    If you encounter a warning stating that swap is enabled, return to the [Disable Swap Memory](#disable-swap-memory) section.

    If successful, your output will resemble:

    {{< output >}}
To start using your cluster, you need to run (as a regular user):

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  http://kubernetes.io/docs/admin/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join --token 921e92.d4582205da623812 <private IP>:6443 --discovery-token-ca-cert-hash sha256:bd85666b6a97072709b210ddf677245b4d79dab88d61b4a521fc00b0fbcc710c
{{< /output >}}

2.  On the master node, configure the `kubectl` tool:

        mkdir -p $home/.kube
        sudo cp -i /etc/kubernetes/admin.conf $home/.kube/config
        sudo chown $(id -u):$(id -g) $home/.kube/config

3.  Check on the status of the nodes with `kubectl get nodes`. Output will resemble:

        root@kube-master:~# kubectl get nodes
        name          status     roles     age       version
        kube-master   NotReady   master    1m        v1.8.1

    The master node is listed as `NotReady` because the cluster does not have a Container Networking Interface ([CNI](https://github.com/containernetworking/cni/blob/master/spec.md)). CNI is a spec for a of container based network interface. In this guide, we will be using Calico. Alternatively, you can use [Flannel](https://raw.githubusercontent.com/coreos/flannel/v0.9.0/Documentation/kube-flannel.yml) or another CNI for similar results.

    The `--pod-network-cidr` argument used in the [Configure the Kubernetes Master Node](#configure-the-kubernetes-master-node) section defines the network range for the CNI.

5.  While still on the master node run the following command to deploy the CNI to your cluster:

        kubectl apply -f https://docs.projectcalico.org/v2.6/getting-started/kubernetes/installation/hosted/kubeadm/1.6/calico.yaml

6.  To ensure Calico was set up correctly, use `kubectl get pods --all-namespaces` to view the pods created in the `kube-system` namespace:

        root@kube-master:~# kubectl get pods --all-namespaces
        NAMESPACE     NAME                                       READY     STATUS             RESTARTS   AGE
        kube-system   calico-etcd-nmx26                          1/1       Running            0          48s
        kube-system   calico-kube-controllers-6ff88bf6d4-p25cw   1/1       Running            0          47s
        kube-system   calico-node-bldzb                          1/2       CrashLoopBackOff   2          48s
        kube-system   calico-node-k5c9m                          2/2       Running            0          48s
        kube-system   etcd-master                                1/1       Running            0          3m
        kube-system   kube-apiserver-master                      1/1       Running            0          3m
        kube-system   kube-controller-manager-master             1/1       Running            0          3m
        kube-system   kube-dns-545bc4bfd4-g8xtm                  3/3       Running            0          4m
        kube-system   kube-proxy-sw562                           1/1       Running            0          4m
        kube-system   kube-proxy-x6psn                           1/1       Running            0          1m
        kube-system   kube-scheduler-master                      1/1       Running            0          3m

    This command uses the `-n` flag. The `-n` flag is a global kubectl flag that selects a non-default namespace. We can see our existing name spaces by running `kubectl get namespaces`:

        root@kube-master:~# kubectl get namespaces
        NAME          STATUS    AGE
        default       Active    4h
        kube-public   Active    4h
        kube-system   Active    4h

7.  Run `kubectl get nodes` again to see that the master node is now running properly:

        root@kube-master:~# kubectl get nodes
        name          status    roles     age       version
        kube-master   Ready     master    12m       v1.8.1

### Add Nodes to the Kubernetes Cluster

1. Run `kubeadm join` with the `kube-master` hostname to add the first worker:

        kubeadm join --token <some-token> kube-master:6443 --discovery-token-ca-cert-hash sha256:<some-sha256-hash>

2. On the master node, use `kubectl` to see that the slave node is now ready:

    {{< output >}}
root@kube-master:~# kubectl get nodes
name            status    roles     age       version
kube-master     ready     master    37m       v1.8.1
kube-worker-1   ready     <none>    2m        v1.8.1
{{< /output >}}

## Deploy NGINX on the Kubernetes Cluster

A *deployment* is a logical reference to a pod or pods and their configurations.

1.  From your master node `kubectl create` an nginx deployment:

        kubectl create deployment nginx --image=nginx

2.  This creates a deployment called `nginx`. `kubectl get deployments` lists all available deployments:

        kubectl get deployments

3.  Use `kubectl describe deployment nginx` to view more information:

    {{< output >}}
Name:                   nginx
Namespace:              default
CreationTimestamp:      Sun, 15 Oct 2017 06:10:50 +0000
Labels:                 app=nginx
Annotations:            deployment.kubernetes.io/revision=1
Selector:               app=nginx
Replicas:               1 desired | 1 updated | 1 total | 1 available | 0 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  1 max unavailable, 1 max surge
Pod Template:
  Labels:  app=nginx
  Containers:
    nginx:
    Image:        nginx
    Port:         <none>
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Conditions:
  Type           Status  Reason
  ----           ------  ------
  Available      True    MinimumReplicasAvailable
OldReplicaSets:  <none>
NewReplicaSet:   nginx-68fcbc9696 (1/1 replicas created)
Events:
  Type    Reason             Age   From                   Message
  ----    ------             ----  ----                   -------
  Normal  ScalingReplicaSet  1m    deployment-controller  Scaled up replica set nginx-68fcbc9696 to 1
{{< /output >}}

    The `describe` command allows you to interrogate different kubernetes resources such as pods, deployments, and services at a deeper level. The output above indicates that there is a deployment called `nginx` within the default namespace. This deployment has a single replicate, and is running the docker image `nginx`. The ports, mounts, volumes and environmental variable are all unset.

4.  Make the NGINX container accessible via the internet:

        kubectl create service nodeport nginx --tcp=80:80

    This creates a public facing service on the host for the NGINX deployment. Because this is a nodeport deployment, kubernetes will assign this service a port on the host machine in the `32000`+ range.

    Try to `get` the current services:

        root@kube-master:~# kubectl get svc
        NAME         TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
        kubernetes   ClusterIP   10.96.0.1     <none>        443/TCP        5h
        nginx        NodePort    10.98.24.29   <none>        80:32555/TCP   52s

5.  Verify that the NGINX deployment is successful by using `curl` on the slave node:

        root@kube-master:~# curl kube-worker-1:32555

    The output will show the unrendered "Welcome to nginx!" page HTML.

6.  To remove the deployment, use `kubectl delete deployment`:

        root@kube-master:~# kubectl delete deployment nginx
        deployment "nginx" deleted
        root@kube-master:~# kubectl get deployments
        No resources found.
