---
author:
  name: Kiran Singh
description: 'Installing, Configuring, and Deploying to Kubernetes 1.8.1 on Linode'
keywords: 'kubernetes,linode,docker,container,deployment,devops'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Monday, October 23rd, 2017
modified_by:
  name: Linode
published: 'Monday, October 23rd, 2017'
title: 'Deploy Kubernetes on Linode'
contributor:
  name: Kiran Singh
  link: https://github.com/snarik
external_resources:
- '[Kubernetes](https://kubernetes.io/)'
- '[Google Borg](https://research.google.com/pubs/pub43438.html)'
- '[Kubelet Definition](https://kubernetes.io/docs/admin/kubelet/)'
- '[CNI Spec](https://github.com/containernetworking/cni/blob/master/SPEC.md)'
---


## Introduction
[Kubernetes](https://kubernetes.io/) is an open source container management system that is based on [Google Borg](https://research.google.com/pubs/pub43438.html). It has the ability to provide highly available, horizontally autoscaling, automated deployments. We will look at how to set up a Kubernetes cluster on Linode and manage the life cycle of a simple nginx service.

## Before You Begin

### You will need:
* Two or more Linodes running a 64 bit distribution of either Ubuntu 16.04+, Debian 9, Centos 7, RHEL 7 or Fedora 26.
* 2GiB+ ram per machine.
* [Private IP](/docs/networking/remote-access#adding-private-ip-addresses)
* Root or sudo privileges

{:.note}
> Interacting with the cluster can be done by any user, but the installation and set up must be done with root or sudo permissions.

## Preparing your Hosts for Installation

### Setup

This guide will only cover creating a two node cluster, but you should properly evaluate resource requirements and launch an appropriately sized cluster for your needs.

1.  Create two linodes of with at least 2GiB  memory within the same data center (e.g. "Fremont, CA", "London, UK", etc.)

2.  For each node, go into the remote access tab of your Linode manager and add a [private IP](/docs/networking/remote-access#adding-private-ip-addresses). It is possible to build a kubernetes cluster using public IPs between hosts, but due to security and performance concerns it is illadvised.

    {:.caution}
    > Ensure this step is completed *before* creating the image on your nodes. failure to do so can prevent your operating system from finding this network interface.

3.  In addition to creating a private IP, configure a firewall with [ufw](https://www.linode.com/docs/security/firewalls/configure-firewall-with-ufw) or [iptables](https://www.linode.com/docs/security/firewalls/control-network-traffic-with-iptables) to ensure only the two nodes can communicate with each other.

### Swap memory concerns

[kubelets](https://kubernetes.io/docs/admin/kubelet/) do not support swap memory and will not work if swap is active or even present in your `/etc/fstab` file. Linodes come with swap enabled by default.

`/etc/fstab` should look something like this:

{: .file}
/etc/fstab
:   ~~~
    # /etc/fstab: static file system information.
    #
    # use 'blkid' to print the universally unique identifier for a
    # device; this may be used with uuid= as a more robust way to name devices
    # that works even if disks are added and removed. see fstab(5).
    #
    # <file system> <mount point>   <type>  <options>       <dump>  <pass>
    # / was on /dev/sda1 during installation
    /dev/sda         /               ext4    noatime,errors=remount-ro 0       1
    /dev/sdb         none            swap    sw 0    0
    ~~~


1.  Delete the line describing the swap partition (In this example, it is the line with `/dev/sdb`).

2.  Disable swap memory usage.

        swapoff -a

### Networking considerations

To make the commands in this tutorial easier to understand, set up your hostname and hosts files on each of your machines.

1.  Pick a node you want to designate as your kubernetes master node and ssh into it.

2.  Using your favorite text editor, open the `/etc/hostname` file for writing enter

    {: .file}
    /etc/hostname
    :   ~~~
        kube-master
        ~~~

3.  Add the following lines to `/etc/hosts`

    {: .file-excerpt}
    /etc/hosts
    :   ~~~
        <kube-master-private-ip>    kube-master
        <kube-worker-private-ip>    kube-worker-1
        ~~~

With the IPs correctly set for the two nodes. if you have more than two nodes, you will need to give them names too. i reccomend using a simple naming scheme for your workers such as "kube-worker-1", "kube-worker-2",... etc. this will allow you to refer to nodes in your cluster by their hostnames and is extremely helpful for debugging. it also makes reading the output from kubernetes commands much cleaner.

Perform the same set of steps above on your worker node, but set the value of /etc/hostname to `kube-worker-1`

For the changes to take effect, restart your Linode through the Linode Manager.

### Confirmation

Once your two nodes have finished rebooting, log into them and confirm your changes.

 - Check that `$ hostname` in the terminal outputs the correct hostname you were expecting
 - Check that you can ping all of the nodes in your cluster by their hostnames.
 - Check that swap is correctly disabled on all nodes by `$ cat /proc/swaps`

{: caution}
>
> If you are unable to ping any of your hosts by their hostnames or private ips, log into that host and enter `$ ifconfig` into your terminal. you should see an entry for eth0:1 that lists your private ip. if you do not see this, it is likely because you deployed your linode image before adding a private ip to the underlying host. you will need to remake the image to proceed.

## Installation

### Basic Requirements:

**Ubuntu:**

        apt install ebtables ethtool

**Centos:**

        yum install ebtables ethtool

### Install Docker:

**Ubuntu:**

    apt-get update && apt-get install -y curl apt-transport-https
    curl -fssl https://download.docker.com/linux/ubuntu/gpg | apt-key add -
    cat <<eof >/etc/apt/sources.list.d/docker.list
    deb https://download.docker.com/linux/$(lsb_release -si | tr '[:upper:]' '[:lower:]') $(lsb_release -cs) stable
    eof
    apt-get update && apt-get install -y docker-ce=$(apt-cache madison docker-ce | grep 17.03 | head -1 | awk '{print $3}')

**Centos:**

    yum install -y docker
    systemctl enable docker && systemctl start docker


Check your Docker configuration works correctly:

    docker run hello-world


### Install kubeadm kubectl and kubelet

**Ubuntu:**

{:.output}
~~~
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
echo 'deb http://apt.kubernetes.io/ kubernetes-xenial main' | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt update
sudo apt install -y kubelet kubeadm kubectl
~~~

**Centos:**

{:.output}
~~~
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
~~~

## Kubernetes Master and Slave

### Set up the master node

1.  On the master node initialize your cluster using its private IP:

        kubeadm init  --pod-network-cidr=192.168.0.0/16 --apiserver-advertise=<private IP>

    If you encounter a warning stating that swap is enabled, return to the section regarding swap memory.

    {:.output}
    ~~~
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
    ~~~

    You can create a new token your master host. Enter `kubeadm token create` to generate a new token and pass it as the token parameter in the above command. This token will also only last for 24 hours unless you pass it with the `--ttl infinity` flag

2.  Theres a second set of commands above that which describe how to configure the `kubectl` tool.

        mkdir -p $home/.kube
        sudo cp -i /etc/kubernetes/admin.conf $home/.kube/config
        sudo chown $(id -u):$(id -g) $home/.kube/config

3.  now if we check on the status of our nodes:

        root@kube-master:~# kubectl get nodes
        name          status     roles     age       version
        kube-master   NotReady   master    1m        v1.8.1

    The master node is listed as `NotReady` beacause the cluster does not have a container networking interface ([CNI](https://github.com/containernetworking/cni/blob/master/spec.md)). CNI is a spec for a of container based network interface. In this guide, we will be using Calico.

    Earlier in the guide we ran the `kubeadm init` command with an argument: `--pod-network-cidr`. That was to define the network range we plan to use for our CNI.

4.  On your master node run the following command to deploy the CNI to your cluster.

        kubectl apply -f https://docs.projectcalico.org/v2.6/getting-started/kubernetes/installation/hosted/kubeadm/1.6/calico.yaml

    There are many CNIs out there to use, for this example we are using Calico, but you could just as easily use Flannel(https://raw.githubusercontent.com/coreos/flannel/v0.9.0/Documentation/kube-flannel.yml) or Canal with similar results.

5.  Ensure Calico was set up correctly by taking a look at the pods created in the `kube-system` namespace.

    {:.output}
    ~~~
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
    ~~~

    This command gets the Kubernetes pods assoiated with our kube-system namespace. In the command above we invoked the -n flag. The `-n` flag is a global kubectl flag that selects a non default namespace. We can see our existing name spaces by running:

        root@kube-master:~# kubectl get namespaces
        NAME          STATUS    AGE
        default       Active    4h
        kube-public   Active    4h
        kube-system   Active    4h

6.  If we rerun the `get nodes` command,  we will see that the master node is now running properly.

	root@kube-master:~# kubectl get nodes
	name          status    roles     age       version
	kube-master   Ready     master    12m       v1.8.1

### Adding nodes to our cluster:

kubeadm will suggest connecting to the master via it's public IP. Change the IP listed in that command to the hostname of `kube-master`

	kubeadm join --token <some-token> kube-master:6443 --discovery-token-ca-cert-hash sha256:<some-sha256-hash>

If this completed successfully you will have added your first worker to your cluster.

On our master node, we should see that the slave node is now ready.

    root@kube-master:~# kubectl get nodes
    name            status    roles     age       version
    kube-master     ready     master    37m       v1.8.1
    kube-worker-1   ready     <none>    2m        v1.8.1

## Run an Application on Kubernetes

### Create our First Deployment.

We will create a simple nginx deployment for our cluster. A deployment is a logical reference to a pod or pods and their configurations.

1.  From your master node create an nginx "deployment".

        root@kube-master:~# kubectl create deployment nginx --image=nginx
        deployment "nginx" created

2.  What did this command do? Lets take a look at our current deployments and find out.

        root@kube-master:~# kubectl get deployments
        name      desired   current   up-to-date   available   age
        nginx     1         1         1            1           25s

    It created a deployment called nginx. If we have kubectl describe the deployment, maybe we will have more information.

    {:.output}
    ~~~
    root@kube-master:~# kubectl describe deployment nginx
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
    ~~~

    The `describe` command allows us to interrogate different kubernetes resources such as pods, deployments and services at a deeper level. The output of this last invocation indicates that we have a deployment named nginx, that is within the default namespace, has a single replicate, and is running the docker image "nginx". The ports, mounts, volumes and environment variable are all unset.

3.  Lets make our nginx container accessible via the internet.

        kubectl create service nodeport nginx --tcp=80:80
        service "nginx" created

    Our last command, created a public facing service on our host for our nginx deployment. We have created a nodeport type of deployment, meaning kubernetes will assign this service a port on the host machine in the 32000+ range.
    We can see that if we get the current services.

        root@kube-master:~# kubectl get svc
        NAME         TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
        kubernetes   ClusterIP   10.96.0.1     <none>        443/TCP        5h
        nginx        NodePort    10.98.24.29   <none>        80:32555/TCP   52s

4.  Verify the nginx deployment is successful by using `curl` on the slave node..

        root@kube-master:~# curl kube-worker-1:32555
        <!DOCTYPE html>
        <html>
        <head>
        <title>Welcome to nginx!</title>
        <style>
            body {
                width: 35em;
                margin: 0 auto;
                font-family: Tahoma, Verdana, Arial, sans-serif;
            }
        </style>
        </head>
        <body>
        <h1>Welcome to nginx!</h1>
        <p>If you see this page, the nginx web server is successfully installed and
        working. Further configuration is required.</p>

        <p>For online documentation and support please refer to
        <a href="http://nginx.org/">nginx.org</a>.<br/>
        Commercial support is available at
        <a href="http://nginx.com/">nginx.com</a>.</p>

        <p><em>Thank you for using nginx.</em></p>
        </body>
        </html>

5.  To remove the deployment, simply enter:

        root@kube-master:~# kubectl delete deployment nginx
        deployment "nginx" deleted
        root@kube-master:~# kubectl get deployments
        No resources found.

