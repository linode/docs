---
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide describes the methods to manage a Kubernetes Cluster'
og_description: 'Kubernetes makes it easy to manage containers across multiple servers. This guide shows how to manage Dockerized applications using Kubernetes.'
keywords: ["Kubernetes", "Cluster", "container", "docker"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-02-28
modified: 2018-02-28
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

To complete this guide you will need three Linodes, each running Ubuntu 16.04 LTS. Each Linode should have at least 4GB of RAM. Before beginning this guide, you should also use the Linode Manager to generate a [private IP address](https://linode.com/docs/networking/remote-access#adding-private-ip-addresses) for each Linode.

## Before You Begin

This article requires that you first complete our guide [How to Install, Configure, and Deploy NGINX on a Kubernetes Cluster](https://linode.com/docs/applications/containers/how-to-deploy-nginx-on-a-kubernetes-cluster/) and follow the procedures described there to configure one master node and two worker nodes.

For simplicity throughout this guide the following name conventions will be used:

* Master Node hostname: `kube-master`
* First Worker Node hostname: `kube-worker-1`
* Second Worker Node hostname: `kube-worker-2`

Unless otherwise stated, all commands will be executed from the cluster's master node.

## Kubernetes Pods

A **Pod** is defined as a group of one or more tightly coupled containers that share resources such as storage and network. Containers inside a Pod are started, stopped, and replicated as a group.

![Kubernetes Cluster](/docs/assets/manage-a-docker-cluster-with-kubernetes/kubernetes-cluster.png)

### Create a Deployment

**Deployments** are high-level objects that can manage [ReplicaSets](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/). They orchestrate pod creation and allow the use of declarative scaling and rolling-upgrade features.

1.  In a text editor, create `nginx.yaml` and add the following content:

    {{< file "~/nginx.yaml" yaml >}}
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

    The file contains all the necessary information to specify a deployment, including: application/container labels, replicas, container image, and container port(s). For more information about deployment configuration read the [documentation.](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#creating-a-deployment)

2.  Create your first deployment:

        kubectl create -f nginx.yaml --record

3.  List your deployments:

        kubectl get deployments

    ```
    NAME           DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    nginx-server   1         1         1            1           13s
    ```

4.  Check that your pod is present:

        kubectl get pods

    ```
    NAME                           READY     STATUS    RESTARTS   AGE
    nginx-server-b9bc6c6b5-d2gqv   1/1       Running   0          58s
    ```

5.  To find out which node the deployment was created on, add the `-o wide` flag:

        kubectl get pods -o wide

    ```
    NAME                           READY     STATUS    RESTARTS   AGE       IP                NODE
    nginx-server-b9bc6c6b5-d2gqv   1/1       Running   0          1m        192.168.255.197   kube-worker-02
    ```

6.  List your ReplicaSets:

        kubectl get rs

    ```
    NAME                     DESIRED   CURRENT   READY     AGE
    nginx-server-b9bc6c6b5   1         1         1         2m
    ```

### Scale Deployments

Kubernetes makes it easy to scale deployments to add or remove replicas.

1.  Increase the number of replicas to 8:

        kubectl scale deployment nginx-server --replicas=8

2.  Check the availability of your new replicas using `kubectl` to list your pods:

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

3.  The same command can be used to decrease the number of replicas:

        kubectl scale deployment nginx-server --replicas=3

### Rolling Upgrades

As mentioned before using Deployments offers the benefit of **rolling upgrades**. A rolling upgrade is a mechanism that allows your cluster to update your application version without any downtime. This is possible due to the ReplicaSet controller, which ensures that at least 25% of your Pods are available all the time. It creates new Pods before deleting the old ones.

1.  For example, to upgrade your container's NGINX version from 1.13 to 1.13.8:

        kubectl set image deployment/nginx-server nginx=nginx:1.13.8-alpine

    Similar to the scaling process, the `set` command uses declarative approach where you decide the desired state and the controller manages all necessary tasks to accomplish that goal.

2.  You can check the update progress by either calling a `kubectl get deployments -o wide` or directly using:

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

3.  You can manually check the application version you with the `describe` command:

        kubectl describe pod <pod-name>

4.  In the event of an error, the rollout will hang and you will be forced to cancel by pressing **CTRL+C**.
By the time of this writing 1.13.8 is the most up-to-date Nginx version, let's induce an error during the update process by setting version to 1.14:

        kubectl set image deployment/nginx-server nginx=nginx:1.14

If you run `kubectl rollout status deployment/nginx-server` you will notice that it won't be able to proceed, it hangs trying to complete the update. You will have to cancel pressing **CTRL+C**.

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

1.  Configure a test service:

    {{< file "~/nginx-service.yaml" yaml >}}
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

2.  Create the service:

        kubectl create -f nginx-service.yaml

3.  Check that your service was created:

        kubectl get services

    ```
NAME            TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
kubernetes      ClusterIP   10.96.0.1     <none>        443/TCP        2d
nginx-service   NodePort    10.97.41.31   <none>        80:31738/TCP   38m
    ```

    This shows that a service is running and accepting connections on port `31738`.

4.  Test your service:

        curl <MASTER_LINODE_PUBLIC_IP_ADDRESS>:<PORT(S)>

5.  You can obtain extra information about this service with the `describe` command:

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

## Kubernetes Namespaces

Namespaces are logical environments that offers the flexibility to divide the Cluster resources between multiple teams or users.

1.  List your available namespaces:

        kubectl get namespaces

    ```
default       Active        7h
kube-public   Active        7h
kube-system   Active        7h
    ```

    As the name implies, the `default` namespace is where all your deployments will live if no other namespace is specified. The `kube-system` is reserved for objects created by Kubernetes and `kube-public` is available for all users hence is named public.  Namespaces can be created from a `.json` file or directly from the command line.

2.  Create a new file named `dev-namespace.json` for the **Development** environment:

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

3.  Create the namespace in your cluster using the `create` command:

        kubectl create -f dev-namespace.json

4.  List the namespaces again:

        kubectl get namespaces

### Contexts

In order to use your namespaces you need to define the **context** where you want to employ them. Kubernetes contexts are saved in the `kubectl` configuration.

1.  View your current configuration:

        kubectl config view

2.  Check in what context you are working on:

        kubectl config current-context

3.  Add the `dev` context using the command:

        kubectl config set-context dev --namespace=development \
        --cluster=kubernetes \
        --user=kubernetes-admin

4.  Switch to the `dev` context/namespace:

        kubectl config use-context dev

5.  Verify the change:

        kubectl config current-context

6.  Review your new configuration:

        kubectl config view

### Labels

As you can see creating namespaces/contexts is very easy, now you are able to separate your **Development** environment from the rest of the cluster. This is useful because objects from one namespace are not visible to other namespaces.

1.  List your deployments:

        kubectl get deployments

2.  List your pods:

        kubectl get pods

    The message "No resources found" appears because you have no pods or deployments created in this namespace. You still can check these objects using the `--all-namespaces` flag:

        kubectl get services --all-namespaces

3.  Create a test deployment for this namespace:

    {{< file "~/my-app.yaml" yaml >}}
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

4.  Create your deployment with the `--record` flag:

        kubectl create -f my-app.yaml --record

5.  Check your deployment:

        kubectl get deployments

6.  If you need to find a particular pod within your cluster, you have two options. :

        kubectl get pods --all-namespaces

That command will list literally **all** pods on your cluster, a better solution could be to filter the results. Labels are useful for that reason. Let's try it again using `app=nginx` flag:

        kubectl get pods --all-namespaces -l app=nginx

Only the pods in the `default` and `development` namespace are listed because they have the label `nginx` included in their definition. Labels can be used for any object in Kubernetes.

Labels are key value pairs that are extremely convenient to filter your deployments, pods, and services. You can use them to tag your application version, SLA, user, maintainer or any other value that fits your needs.

## Kubernetes Nodes

A node may be a physical machine or a virtual machine. In this guide **each Linode is a node**. Think of nodes as the uppermost level in the Kubernetes abstraction model.

1.  List your current nodes:

        kubectl get nodes

    ```
NAME             STATUS    ROLES     AGE       VERSION
kube-master      Ready     master    21h       v1.9.2
kube-worker-1    Ready     <none>    19h       v1.9.2
kube-worker-2    Ready     <none>    17h       v1.9.2
    ```

2.  For more detail, add the `-o` flag:

        kubectl get nodes -o wide

3.  The information displayed is mostly self-explanatory and useful for checking that all nodes are ready. You can also use the `describe` command for an inner look into your node:

        kubectl describe node kube-worker-1

    This will show a very detailed information about your node, including important aspects as CPU load and disk space status just to mention a few.

### Node Maintenance

Kubernetes offers a very straightforward solution for taking nodes off-line safely.

1.  Return to the default namespace where you have a running service for NGINX:

        kubectl config use-context kubernetes-admin@kubernetes

2.  Check your pods:

        kubectl get pods -o wide

3.  Prevent new pods creation on the node `kube-worker-2`:

        kubectl cordon kube-worker-2

4.  Check the status of your nodes:

        kubectl get nodes

    ```
NAME             STATUS                     ROLES     AGE       VERSION
kube-master      Ready                      master    4h        v1.9.2
kube-worker-1    Ready                      <none>    4h        v1.9.2
kube-worker-2    Ready,SchedulingDisabled   <none>    4h        v1.9.2
    ```

5.  To test the Kubernetes controller and scheduler, scale up your deployment:

        kubectl scale deployment nginx-server --replicas=10

6.  List your pods again:

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

    As you can see there are ten pods in total but new pods were created only in the first node.

7.  Tell `kube-worker-2` to drain its running pods:

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

8.  Check the effect of this command on your pods:

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

9.  You are ready now to safely shut down your Linode without interrupting service.

10. Once you finish your maintenance, tell the controller that this node is available for scheduling again:

        kubectl uncordon kube-worker-2
