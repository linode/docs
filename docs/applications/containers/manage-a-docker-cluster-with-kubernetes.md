---
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide describes the methods to manage a Kubernetes Cluster'
keywords: ["Kubernetes", "Cluster", "Linode"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-01-01
modified: 2018-01-01
modified_by:
  name: Linode
title: 'Manage a Docker Cluster with Kubernetes'
contributor:
  name: Damaso Sanoja
  link: https://twitter.com/damasosanoja
external_resources:
  - '[Kubernetes Documentation](https://kubernetes.io/docs/home)'
  - '[Calico Documentation](https://docs.projectcalico.org/v2.0/getting-started/kubernetes/)'
---

![Manage a Docker Cluster with Kubernetes](/docs/assets/manage-a-docker-cluster-with-kubernetes/manage-a-docker-cluster-with-kubernetes.png)

## What is a Kubernetes Cluster?

A Kubernetes cluster consists of at least one master node that runs the API server, the scheduler and the controller manager and several worker nodes running the `kubelet`, `kube-proxy` and the Docker Engine.
This guide shows you how to manage the basic Kubernetes objects in a Docker cluster.

## System Requirements

To complete this guide you will need:

* Three Linodes with [Private IPs](https://linode.com/docs/networking/remote-access#adding-private-ip-addresses).
* Each Linode should be running Ubuntu 16.04 LTS.
* The minimum recommended plan for the latest Kubernetes version is 4GB RAM per Linode.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Preliminary Assumptions

This article requires that you first complete our guide [How to Install, Configure, and Deploy NGINX on a Kubernetes Cluster](https://linode.com/docs/applications/containers/how-to-deploy-nginx-on-a-kubernetes-cluster/) and follow the procedures described there to configure one master node and two worker nodes.

For simplicity throughout this guide the same name conventions will be used:

* Master Node hostname: `kube-master`
* First Worker Node hostname: `kube-worker-1`
* Second Worker Node hostname: `kube-worker-2`

{{< note >}}
Unless otherwise stated, all commands will be executed from the cluster's master node.
{{< /note >}}

## Kubernetes Pods

A "Pod" is defined as a group of one or more tightly coupled containers that share resources as storage and network. Containers inside a Pod are started, stopped and replicated as a group.

![Kubernetes Cluster](/docs/assets/manage-a-docker-cluster-with-kubernetes/kubernetes-cluster.png)

### Creating Deployments

Deployments are high-level objects able to manage ReplicaSets, they orchestrate pod creation and offers the convenience of declarative scaling and rolling-upgrade features. In other words, they manage ReplicaSets for you through their controller that's why Deployments are the preferred way to create your Pods.

Let's create a test pod using a `yaml` file:

{{< file "~/home/nginx.yaml" yaml >}}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-server
  labels:
    app: nginx
spec:
  replicas: 1
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
        image: nginx:1.13-alpine
        ports:
        - containerPort: 80
{{< /file >}}

The file contains all information necessary for this deployment including: application/container labels, replicas, container image, and container port(s). For more information about deployment configuration read the [documentation.](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#creating-a-deployment)

Now you can create your first deployment, the `--record` flag is optional but very useful as you will find in the next section:

        kubectl create -f nginx.yaml --record

List your deployments (more information about deployments state will follow in the next section):

        kubectl get deployments
```
    NAME           DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    nginx-server   1         1         1            1           13s
```

Check that your pod is present:

        kubectl get pods

```
    NAME                           READY     STATUS    RESTARTS   AGE
    nginx-server-b9bc6c6b5-d2gqv   1/1       Running   0          58s
```

That is useful to verify pod name, status and restarts. To find out on which node was created you can add `-o wide` flag:

        kubectl get pods -o wide

```
    NAME                           READY     STATUS    RESTARTS   AGE       IP                NODE
    nginx-server-b9bc6c6b5-d2gqv   1/1       Running   0          1m        192.168.255.197   kube-worker-02
```

Finally you can list your ReplicaSets using the command:

        kubectl get rs

```
    NAME                     DESIRED   CURRENT   READY     AGE
    nginx-server-b9bc6c6b5   1         1         1         2m
```

{{< note >}}
Creating Pods manually through ReplicaSet is still useful in some scenarios, for example, if you need an specific number of pod replicas running at any given time. Just keep in mind that doing so will increase the complexity of your cluster management.
{{< /note >}}

### Scaling Deployments

You will have noticed that `kubectl get deployments` shows several fields related with the actual deployment state:

* **DESIRED:** is the target number of replicas that you declared in the YAML file.
* **CURRENT:** the actual number of replicas running in this deployment.
* **UP-TO-DATE:** is the number of replicas that have been successfully updated.
* **AVAILABLE:** represents the real number of replicas that can be used.

Imagine that you need to increase to eight the number of replicas of your application, in that case you need to run the command:

        kubectl scale deployment nginx-server --replicas=8

You can check the availability of your new replicas using `kubectl` to list your pods:

        kubectl get pods -o wide

```
    NAME                           READY     STATUS    RESTARTS   AGE       IP               NODE
    nginx-server-b9bc6c6b5-4mdf6   1/1       Running   0          41s       192.168.180.10   kube-worker-1
    nginx-server-b9bc6c6b5-8mvrd   1/1       Running   0          3m        192.168.180.9    kube-worker-1
    nginx-server-b9bc6c6b5-b99pt   1/1       Running   0          40s       192.168.180.12   kube-worker-1
    nginx-server-b9bc6c6b5-fjg2c   1/1       Running   0          40s       192.168.127.12   kube-worker-2
    nginx-server-b9bc6c6b5-kgdq5   1/1       Running   0          41s       192.168.127.11   kube-worker-2
    nginx-server-b9bc6c6b5-mhb7s   1/1       Running   0          40s       192.168.180.11   kube-worker-1
    nginx-server-b9bc6c6b5-rlf9w   1/1       Running   0          41s       192.168.127.10   kube-worker-2
    nginx-server-b9bc6c6b5-scwgj   1/1       Running   0          40s       192.168.127.13   kube-worker-2
```

Now imagine the contrary, instead of increasing the number of replicas suppose you need to decrease them to only three:

        kubectl scale deployment nginx-server --replicas=3

If you list again your pods you may see an output similar to this showing the scaling process:

        kubectl get pods -o wide

```
    NAME                           READY     STATUS        RESTARTS   AGE       IP               NODE
    nginx-server-b9bc6c6b5-4mdf6   1/1       Running       0          1m        192.168.180.10   kube-worker-1
    nginx-server-b9bc6c6b5-8mvrd   1/1       Running       0          4m        192.168.180.9    kube-worker-1
    nginx-server-b9bc6c6b5-b99pt   0/1       Terminating   0          1m        <none>           kube-worker-1
    nginx-server-b9bc6c6b5-fjg2c   0/1       Terminating   0          1m        192.168.127.12   kube-worker-2
    nginx-server-b9bc6c6b5-kgdq5   1/1       Terminating   0          1m        192.168.127.11   kube-worker-2
    nginx-server-b9bc6c6b5-rlf9w   1/1       Running       0          1m        192.168.127.10   kube-worker-2
    nginx-server-b9bc6c6b5-scwgj   0/1       Terminating   0          1m        <none>           kube-worker-2
```

### Rolling Upgrades

As mentioned before using Deployments offers the benefit of rolling upgrades. A rolling upgrade is a mechanism that allows your cluster to update your application version with zero-downtime. This is possible thanks to the ReplicaSet controller that ensures that at least 25% of your Pods are available all the time. It creates new Pods (with the newer version) before deleting the old ones.

Let's say that you want to upgrade your container's Nginx version from 1.13 to 1.13.8, doing so is very easy:

        kubectl set image deployment/nginx-server nginx=nginx:1.13.8-alpine

That command will trigger a deployment rollout. Similar to the scaling process it's a declarative approach where you decide the desired state and the controller manages all necessary tasks to accomplish that goal.

You can check the update progress by either calling a `kubectl get deployments -o wide` or directly using:

        kubectl rollout status deployment/nginx-server

```
    Waiting for rollout to finish: 1 out of 3 new replicas have been updated...
    Waiting for rollout to finish: 1 out of 3 new replicas have been updated...
    Waiting for rollout to finish: 1 out of 3 new replicas have been updated...
    Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
    Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
    Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
    Waiting for rollout to finish: 1 old replicas are pending termination...
    Waiting for rollout to finish: 1 old replicas are pending termination...
    deployment "nginx-server" successfully rolled out
```

If you want to manually check the application version you can use the `describe` command:

        kubectl describe pod <pod-name>

Alternatively, you can also list ReplicaSet with extended information to include the application image version:

        kubectl get rs -o wide

But what happens if anything goes wrong? By the time of this writing 1.13.8 is the most up-to-date Nginx version, let's induce an error during the update process by setting version to 1.14:

        kubectl set image deployment/nginx-server nginx=nginx:1.14

If you run again the `kubectl rollout status deployment/nginx-server` you will notice that it won't be able to proceed, it hangs trying to complete the update. You will have to cancel pressing **CTRL+C**.

Check your current pods:

        kubectl get pods -o wide

```
    NAME                            READY     STATUS             RESTARTS   AGE       IP               NODE
    nginx-server-76976d4555-7nv6z   1/1       Running            0          3m        192.168.127.15   kube-worker-2
    nginx-server-76976d4555-wg785   1/1       Running            0          3m        192.168.180.13   kube-worker-1
    nginx-server-76976d4555-ws4vf   1/1       Running            0          3m        192.168.127.14   kube-worker-2
    nginx-server-7ddd985dd6-mpn9h   0/1       ImagePullBackOff   0          2m        192.168.180.16   kube-worker-1
```

In this example the pod `nginx-server-7ddd985dd6-mpn9h` is trying to upgrade to an inexistent version of Nginx, you can also inspect the pod using:

        kubectl describe pod nginx-server-7ddd985dd6-mpn9h

At the end of the description you can confirm the problem in the **Events** section where it should read *"Failed to pull image "nginx:1.14": rpc error: code = Unknown desc = Error response from daemon: manifest for nginx:1.14 not found".*

In the previous section when you created the deployment the `--record` flag was used on purpose. This flag allows you to retrieve the updates history:

        kubectl rollout history deployment/nginx-server

```
    REVISION  CHANGE-CAUSE
    1         kubectl scale deployment nginx-server --replicas=3
    2         kubectl set image deployment/nginx-server nginx=nginx:1.13.8-alpine
    3         kubectl set image deployment/nginx-server nginx=nginx:1.14
```

Knowing that the issue is the new application version you can perform a "roll back" to a previous version. You can do it directly to the previous version (assuming your previous version had no issues):

        kubectl rollout undo deployment/nginx-server

You could also roll back to a specific revision, for example, rollout to the version used during the deployment creation using the command:

        kubectl rollout undo deployment/nginx-server --to-revision=1

## Kubernetes Services

Up to this point, you have a deployment running three pods of your Nginx application. In order to expose the pods to the Internet, you need to create a service. In Kubernetes a service is an abstraction that allows pods to be accessible all the time automatically reconciling IP changes, updates, scaling, etc. That means that you only need to set the service once, and your application will be available as far as a running pod remains active.

Let's configure a test service:

{{< file "~/home/nginx-service.yaml" yaml >}}
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
  labels:
    run: nginx
spec:
  type: NodePort
  ports:
  - port: 80
    targetPort: 80
    protocol: TCP
    name: http
  selector:
    app: nginx
{{< /file >}}

Create the service in a similar way as you did with your deployment:

        kubectl create -f nginx-service.yaml

Check that your service was created:

        kubectl get services

```
    NAME            TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
    kubernetes      ClusterIP   10.96.0.1     <none>        443/TCP        2d
    nginx-service   NodePort    10.97.41.31   <none>        80:31738/TCP   38m
```

As you can see a service is running and accepts connections to the port `31738`. Test your service:

        curl <MASTER_LINODE_PUBLIC_IP_ADDRESS>:<PORT(S)>

You could also obtain extra information about this service running the `describe` command:

        kubectl describe service nginx-service

```
    Name:                     nginx-service
    Namespace:                default
    Labels:                   run=nginx
    Annotations:              <none>
    Selector:                 app=nginx
    Type:                     NodePort
    IP:                       10.97.41.31
    Port:                     http  80/TCP
    TargetPort:               80/TCP
    NodePort:                 http  31738/TCP
    Endpoints:                192.168.127.14:80,192.168.127.15:80,192.168.180.13:80
    Session Affinity:         None
    External Traffic Policy:  Cluster
    Events:                   <none>
```

Services are always evaluating their configuration values such as labels and selectors, next section will cover the usefulness of that approach.

## Kubernetes Namespaces

Namespaces are logical environments that offers the flexibility to divide the Cluster resources between multiple teams or users.

Before doing anything else list your available namespaces:

        kubectl get namespaces

Your output should be similar to this:

```
    default       Active        7h
    kube-public   Active        7h
    kube-system   Active        7h
```

As the name implies the `default` namespace is where all your deployments will live if no other namespace is created. The `kube-system` is reserved for objects created by Kubernets and the `kube-public` is available for all users hence is named public.  Namespaces can be created from a `.json` file or directly from the command line.

Create a new file named `dev-namespace.json` for the **Development** environment:

{{< file "~/home/dev-namespace.json" conf >}}
{
  "kind": "Namespace",
  "apiVersion": "v1",
  "metadata": {
    "name": "development",
    "labels": {
      "name": "development"
    }
  }
}
{{< /file >}}

As usual create the namespace in your cluster using the `create` command:

        kubectl create -f dev-namespace.json

List the namespaces again:

        kubectl get namespaces

The **Development** namespace is now available. You can use the `--show-labels` flag to list namespaces again:

        kubectl get namespaces --show-labels

```
    NAME          STATUS    AGE       LABELS
    default       Active    8h        <none>
    development   Active    11m       name=development
    kube-public   Active    8h        <none>
    kube-system   Active    8h        <none>
```

### Contexts

In order to use your namespaces you need to define the "context" where you want to employ them. Kubernetes contexts are saved in the `kubectl` configuration, before making any change check your current configuration:

        kubectl config view

All relevant information is there including your context's names & users, please take note of their values. Now you're ready to edit your configuration:

Check in what context you are working on:

        kubectl config current-context

Now add the `dev` context using the command:

        kubectl config set-context dev --namespace=development \
        --cluster=kubernetes \
        --user=kubernetes-admin

To switch to the `dev` context/namespace use the command:

        kubectl config use-context dev

Verify the change:

        kubectl config current-context

Finally review your new configuration:

        kubectl config view

### Labels

As you can see creating namespaces/contexts is very easy, now you are able to separate your **Development** environment from the rest of the cluster. This is useful because objects from one namespace are not visible to other users/namespaces.

Try to list your deployments:

        kubectl get deployments

Now try to list your pods:

        kubectl get pods

The message "No resources found" appears because you have no pods or deployments created in this namespace. You still can check these objects using the `--all-namespaces` flag, try to check your services:

        kubectl get services --all-namespaces

```
    NAMESPACE     NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)         AGE
    default       kubernetes      ClusterIP   10.96.0.1       <none>        443/TCP         2h
    default       nginx-service   NodePort    10.97.41.31     <none>        80:31738/TCP    2h
    kube-system   calico-etcd     ClusterIP   10.96.232.136   <none>        6666/TCP        2h
    kube-system   kube-dns        ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP   2h
```

Now create a test deployment for this namespace:

{{< file "~/home/my-app.yaml" yaml >}}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  replicas: 4
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
        image: nginx:1.12-alpine
        ports:
        - containerPort: 80
{{< /file >}}

Once again, create your object with the `--record` flag:

        kubectl create -f my-app.yaml --record

Check your deployment:

        kubectl get deployments

Now suppose you want to find a particular pod within your cluster, you already know about the `--all-namespaces` flag so one solution is:

        kubectl get pods --all-namespaces

```
    NAMESPACE     NAME                                      READY     STATUS    RESTARTS   AGE
    default       nginx-server-76976d4555-7nv6z             1/1       Running   0          5h
    default       nginx-server-76976d4555-wg785             1/1       Running   0          5h
    default       nginx-server-76976d4555-ws4vf             1/1       Running   0          5h
    development   my-app-68845b9f68-8xd8m                   1/1       Running   0          4m
    development   my-app-68845b9f68-bp8qj                   1/1       Running   0          4m
    development   my-app-68845b9f68-fcbll                   1/1       Running   0          4m
    development   my-app-68845b9f68-z96nx                   1/1       Running   0          4m
    kube-system   calico-etcd-h75s5                         1/1       Running   1          2h
    kube-system   calico-kube-controllers-d554689d5-lz2mv   1/1       Running   1          2h
    kube-system   calico-node-jgctl                         2/2       Running   0          2h
    kube-system   calico-node-t4mbc                         2/2       Running   3          2h
    kube-system   calico-node-w649j                         2/2       Running   0          2h
    kube-system   etcd-kube-master                          1/1       Running   1          2h
    kube-system   kube-apiserver-kube-master                1/1       Running   1          2h
    kube-system   kube-controller-manager-kube-master       1/1       Running   1          2h
    kube-system   kube-dns-6f4fd4bdf-lkwnv                  3/3       Running   0          2h
    kube-system   kube-proxy-g6xj9                          1/1       Running   0          2h
    kube-system   kube-proxy-ntkbv                          1/1       Running   1          2h
    kube-system   kube-proxy-rrgng                          1/1       Running   0          2h
    kube-system   kube-scheduler-kube-master                1/1       Running   1          2h
```

That command will list literally **all** pods on your cluster, a better solution could be to filter the results. Labels are useful for that reason. Let's try it again using `app=nginx` flag:

        kubectl get pods --all-namespaces -l app=nginx

```
    NAMESPACE     NAME                            READY     STATUS    RESTARTS   AGE
    default       nginx-server-76976d4555-7nv6z   1/1       Running   0          5h
    default       nginx-server-76976d4555-wg785   1/1       Running   0          5h
    default       nginx-server-76976d4555-ws4vf   1/1       Running   0          5h
    development   my-app-68845b9f68-8xd8m         1/1       Running   0          9m
    development   my-app-68845b9f68-bp8qj         1/1       Running   0          9m
    development   my-app-68845b9f68-fcbll         1/1       Running   0          9m
    development   my-app-68845b9f68-z96nx         1/1       Running   0          9m
```

As expected only the pods in the `default` and `development` namespace are listed because they have the label `nginx` included in their definition. Labels can be used for any object in Kubernetes. In your last deployment the label `my-app` was declared for the object itself, confirm this by listing all deployments:

        kubectl get deployments --all-namespaces

```
    NAMESPACE     NAME                       DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    default       nginx-server               3         3         3            3           3d
    development   my-app                     4         4         4            4           1m
    kube-system   calico-kube-controllers    1         1         1            1           4d
    kube-system   calico-policy-controller   0         0         0            0           4d
    kube-system   kube-dns                   1         1         1            1           4d
```

And now list only those with the label `my-app`:

        kubectl get deployments --all-namespaces -l app=my-app

```
    NAMESPACE     NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    development   my-app    4         4         4            4           2m
```

Labels are "key=value" pairs that are extremely convenient to filter your deployments, pods and services, you can use them to tag your application version, SLA, user, maintainer or any other value that fit your needs.

## Kubernetes Nodes

A node may be a physical machine or a virtual machine, in this guide **each Linode represents a node**. Think of nodes as the uppermost level in the Kubernetes abstraction model, in fact Kubernetes just create nodes as a representation of what you already deployed with your Linode Manager.

Start listing your current nodes:

        kubectl get nodes

```
    NAME             STATUS    ROLES     AGE       VERSION
    kube-master      Ready     master    21h       v1.9.2
    kube-worker-1    Ready     <none>    19h       v1.9.2
    kube-worker-2    Ready     <none>    17h       v1.9.2
```

In case you need some extra details you can add some flags:

        kubectl get nodes -o wide

The information displayed is mostly self-explanatory and very useful for checking that all nodes are ready. You can also use the `describe` command for an inner look into your node:

        kubectl describe node kube-worker-1

That will show a very detailed information about your node, including important aspects as CPU load and disk space status just to mention a few.

{{< note >}}
Keep in mind the at the heart of your Kubernetes Cluster is the master node responsible of controlling and scheduling the Pods in the worker nodes. If your master node ran out of disk space or memory all your Cluster will suffer the consequences.
{{< /note >}}

### Nodes Maintenance

Kubernetes offers a very straightforward solution for taking off-line any node safely. First, return to the default namespace where you have a running service for Nginx:

        kubectl config use-context kubernetes-admin@kubernetes

Check your pods, remember that they are running your Nginx instance:

        kubectl get pods -o wide

```
    NAME                           READY     STATUS    RESTARTS   AGE       IP                NODE
    nginx-server-b9bc6c6b5-7nw5m   1/1       Running   0          3h        192.168.255.220   kube-worker-2
    nginx-server-b9bc6c6b5-95jgr   1/1       Running   0          3h        192.168.255.221   kube-worker-2
    nginx-server-b9bc6c6b5-md4qd   1/1       Running   0          3h        192.168.188.139   kube-worker-1
```

Let's prevent new pods creation on the node `kube-worker-2`:

        kubectl cordon kube-worker-2

Check your nodes status now:

        kubectl get nodes

```
    NAME             STATUS                     ROLES     AGE       VERSION
    kube-master      Ready                      master    4h        v1.9.2
    kube-worker-1    Ready                      <none>    4h        v1.9.2
    kube-worker-2    Ready,SchedulingDisabled   <none>    4h        v1.9.2
```

To test the Kubernetes controller and scheduler scale up your deployment:

        kubectl scale deployment nginx-server --replicas=10

List your pods again:

        kubectl get pods -o wide

```
    NAME                           READY     STATUS    RESTARTS   AGE       IP                NODE
    nginx-server-b9bc6c6b5-2pnbk   1/1       Running   0          11s       192.168.188.146   kube-worker-1
    nginx-server-b9bc6c6b5-4cls5   1/1       Running   0          11s       192.168.188.148   kube-worker-1
    nginx-server-b9bc6c6b5-7nw5m   1/1       Running   0          3d        192.168.255.220   kube-worker-2
    nginx-server-b9bc6c6b5-7s7w5   1/1       Running   0          44s       192.168.188.143   kube-worker-1
    nginx-server-b9bc6c6b5-88dvp   1/1       Running   0          11s       192.168.188.145   kube-worker-1
    nginx-server-b9bc6c6b5-95jgr   1/1       Running   0          3d        192.168.255.221   kube-worker-2
    nginx-server-b9bc6c6b5-md4qd   1/1       Running   0          3d        192.168.188.139   kube-worker-1
    nginx-server-b9bc6c6b5-r5krq   1/1       Running   0          11s       192.168.188.144   kube-worker-1
    nginx-server-b9bc6c6b5-r5nd6   1/1       Running   0          44s       192.168.188.142   kube-worker-1
    nginx-server-b9bc6c6b5-ztgmr   1/1       Running   0          11s       192.168.188.147   kube-worker-1
```

As you can see there are ten pods in total but new pods where created only in the first node. Now you are ready to tell the `kube-worker-2` to "drain" its running pods:

        kubectl drain kube-worker-2 --ignore-daemonsets

```
    node "kube-worker-2" already cordoned
    WARNING: Ignoring DaemonSet-managed pods: calico-node-9mgc6, kube-proxy-2v8rw
    pod "my-app-68845b9f68-wcqsb" evicted
    pod "nginx-server-b9bc6c6b5-7nw5m" evicted
    pod "nginx-server-b9bc6c6b5-95jgr" evicted
    pod "my-app-68845b9f68-n5kpt" evicted
    node "kube-worker-2" drained
```

Now check what happened with your pods:

        kubectl get pods -o wide

```
    NAME                           READY     STATUS    RESTARTS   AGE       IP                NODE
    nginx-server-b9bc6c6b5-2pnbk   1/1       Running   0          9m        192.168.188.146   kube-worker-1
    nginx-server-b9bc6c6b5-4cls5   1/1       Running   0          9m        192.168.188.148   kube-worker-1
    nginx-server-b9bc6c6b5-6zbv6   1/1       Running   0          3m        192.168.188.152   kube-worker-1
    nginx-server-b9bc6c6b5-7s7w5   1/1       Running   0          9m        192.168.188.143   kube-worker-1
    nginx-server-b9bc6c6b5-88dvp   1/1       Running   0          9m        192.168.188.145   kube-worker-1
    nginx-server-b9bc6c6b5-c2c5c   1/1       Running   0          3m        192.168.188.150   kube-worker-1
    nginx-server-b9bc6c6b5-md4qd   1/1       Running   0          3d        192.168.188.139   kube-worker-1
    nginx-server-b9bc6c6b5-r5krq   1/1       Running   0          9m        192.168.188.144   kube-worker-1
    nginx-server-b9bc6c6b5-r5nd6   1/1       Running   0          9m        192.168.188.142   kube-worker-1
    nginx-server-b9bc6c6b5-ztgmr   1/1       Running   0          9m        192.168.188.147   kube-worker-1
```

You are ready now to safely shutdown your Linode without interrupting your service. Once you finish your maintenance / upgrade you need to tell the controller that this node is available for scheduling again:

        kubectl uncordon kube-worker-2

There are few things to might noticed:

* The `kubectl drain` command needed an additional flag `--ignore-daemonsets`. This was necessary to bypass Calico and `kube-proxy` daemonset. Depending on your particular deployment you may need other flags, please refer to the [documentation](https://kubernetes-v1-4.github.io/docs/user-guide/kubectl/kubectl_drain/)

 for more information.
* The drain command cordon the node first, in this case was already cordoned.
* As expected not only the `nginx-server` pods were removed but also `my-app` pods on this node.
* After the command was issued you still had ten pods running, all of them in the `kube-worker1`.
* During the entire process your application had zero downtime thanks to the scheduler and the controller.

