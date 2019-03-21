---
author:
  name: Linode Community
  email: docs@linode.com
description: 'A high level overview of Kubernetes cluster.'
keywords: ['kubernetes','k8s','beginner','architecture']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-03-21
modified: 2019-03-21
modified_by:
  name: Linode
title: "A Beginner's Guide to Kubernetes"
contributor:
  name: Linode
external_resources:
- '[Kubernetes API Documentation](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/)'
- '[Kubernetes Concepts Documentation](https://kubernetes.io/docs/concepts/)'
---

*Kubernetes*, often referred to as *k8s*, is an open source container orchestration system that helps deploy and manage containerized applications. Developed by Google starting in 2014 and written in the Go langauge, Kubernetes is quickly becoming the standard way to architect horizontally scalable applications. This guide will explain the major parts and concepts of Kubernetes.


## Containers

Kubernetes is a container orechestration tool and therefore needs a container runtime installed to work. In practice the default container runtime for Kubernetes is [Docker](https://www.docker.com/), though other runtimes like [rkt](https://coreos.com/rkt/) and [LXD](https://linuxcontainers.org/lxd/introduction/) will also work. With the advent of the [Container Runtime Interface (CRI)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md), which hopes to standardize the way Kubernetes interacts with containers, other options like [containerd](https://containerd.io/), [cri-o](https://cri-o.io/), and [Frakti](https://github.com/kubernetes/frakti) have also become available. This guide assumes you have a working knowledge of containers and the examples will all use Docker as the container runtime.

## Kubernetes API

Kubernetes is built around a robust RESTful API. Every action taken in Kubernetes, be it inter-component communication or user command, interacts in some fashion with the Kubernetes API. The goal of the API is to help facilitate the desired state of the Kubernetes cluster. If you want X instances of your application running and have Y currently active, the API will take the required steps to get to X, whether this means creating or destroying resources. To create this desired state, you create *objects*, which are normally represented by YAML files called *manifests*, and apply them through the command line with the **kubectl** tool.

## kubectl

kubectl is a command line tool used to interact with the Kubernetes cluster. It offers a host of features, including the ability to create, stop, and delete resources, describe active resources, and auto scale resources. For more information on the types of commands and resources you can use with kubectl, consult the [Kubernetes kubectl documentation](https://kubernetes.io/docs/reference/kubectl/overview/).

## Kubernetes Master, Nodes, and Control Plane

At the highest level of Kubernetes there exist two kinds of servers, a *Master* and a *Node*. These servers can be Linodes, VMs, or physical servers. Together, these servers form a *cluster*.

### Nodes

Kubernetes Nodes are worker servers that run your application. The number of Nodes is determined by the user, and they are created by the user. In addition to running your application, each Node runs two processes:

- **kubelet** receives PodSpec files that describe the desired state of a [Pod](#pods) from the API server, and ensures the Pods that those files represent are healthy and running on the Node.
- **kube-proxy** is a networking proxy that proxies the UDP, TCP and SCTP networking of each Node, and provides load balancing. This is only used to connect to [Services](#services).

### Kubernetes Master

The Kubernetes Master is a normally a separate server responsible for maintaining the desired state of the cluster by telling the Nodes how many instances of your application it should run and where. The Kubernetes Master runs three processes:

- **kube-apiserver** is the front end for the Kubernetes API server.
- **kube-controller-manager** is a daemon that manages the Kubernetes control loop. For more on Controllers, see the [Controllers section](#controllers).
- **kube-scheduler** is a function that looks for newly created Pods that have no Nodes and assigns them a Node based on a host of requirements. For more information on kube-scheduler, consult the [Kubernetes kube-scheduler documentation](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/).

Additionally, the Kubernetes Master runs the database **etcd** (pronounced etsy-dee). etcd is a highly available key-value store that provides the backend database for Kubernetes.

Together kube-apiserver, kube-controller-manager, kube-scheduler, and etcd form what is known as the *control plane*. The control plane is responsible for making decisions about the cluster and pushing it toward the desired state.

## Kubernetes Objects

In Kubernetes there are a number of objects that are abstractions of your Kubernetes system's desired state. These objects represent your application, its networking, and disk resources -- all of which together form your application.

### Pods

In Kubernetes all containers exist within *Pods*. Pods are the smallest unit of the Kubernetes architecture, and can be viewed as a kind of wrapper for your container. Each Pod is given its own IP address with which it can interact with other Pods within the cluster.

Usually a Pod contains only one container, but a Pod can contain multiple containers if those containers need to share resources. If there is more than one container in a Pod, these containers can communicate with one another via localhost.

Pods in Kubernetes are "mortal," which means that they are created and destroyed depending on the needs of the application. For instance, you might have a web app backend that sees a spike in CPU usage. This might cause the cluster to scale up the amount of backend Pods from two to ten, in which case eight new Pods would be created. Once the traffic subsides, the Pods might scale back to two, in which case eight pods would be destroyed.

It is important to note that Pods are destroyed without respect to which Pod was created first. And, while each Pod has its own IP address, this IP address will only be available for the life-cycle of the Pod.

Below is an example of a Pod manifest:

{{< file "my-apache-pod.yaml" yaml >}}
apiVersion: v1
kind: Pod
metadata:
 name: apache-pod
 labels:
   app: web
spec:
  containers:
  - name: apache-container
    image: httpd
{{</ file >}}

Each manifest has four necessary parts:

- The version of the API in use.
- The kind of resource you'd like to define.
- Metadata about the resource.
- Though not required by all objects, a spec which describes the desired behavior of the resource is necessary for most objects and controllers.

In the case of this example, the API in use is `v1`, and the `kind` is a Pod. The metadata field is used for applying a name, labels, and annotations. Names are used to differentiate resources, while labels are used to group like resources. Labels will come into play more when defining [Services](#services) and [Deployments](#deployment). Annotations are for attaching arbitrary data to the resource.

The spec is where the desired state of the resource is defined. In this case a Pod with a single NGINX container is desired, so the `containers` field is supplied with a name, 'nginx-container', and an image, the latest version of NGINX. The image is pulled from [Docker Hub](https://hub.docker.com), as that is the default container registry for Kubernetes.

For more information on the type of fields you can supply in a Pod manifest, refer to the [Kubernetes Pod API documentation](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#pod-v1-core).

Now that you have the manifest, you can create the Pod using the `create` command:

    kubectl create -f my-apache-pod.yaml

To view a list of your pods, use the `get pods` command:

    kubectl get pods

You should see output like the following:

    NAME         READY   STATUS    RESTARTS   AGE
    apache-pod   1/1     Running   0          16s

To quickly view which Node the Pod exists on, issue the `get pods` command with the `-o=wide` flag:

    kubectl get pods -o=wide

To retrieve information about the Pod, issue the `describe` command:

    kubcetl describe pod apache-pod

You should see output like the following:

    ...
    Events:
    Type    Reason     Age    From                       Message
    ----    ------     ----   ----                       -------
    Normal  Scheduled  2m38s  default-scheduler          Successfully assigned default/apache-pod to mycluster-node-1
    Normal  Pulling    2m36s  kubelet, mycluster-node-1  pulling image "httpd"
    Normal  Pulled     2m23s  kubelet, mycluster-node-1  Successfully pulled image "httpd"
    Normal  Created    2m22s  kubelet, mycluster-node-1  Created container
    Normal  Started    2m22s  kubelet, mycluster-node-1  Started container

To delete the Pod, issue the `delete` command:

    kubectl delete pod apache-pod

### Services

*Services* group identical Pods together to provide a consitent means of accessing them. For instance, you might have three Pods that are all serving a website, and all of those Pods need to be accessible on port 80. A Service can ensure that all of the Pods are accessible at that port, and can load balance traffic between those Pods. Additionally, a Service can allow your application to be accessible from the internet. Each Service is given an IP address and a corresponding local DNS entry. Additionally, Services exist across Nodes. If you have two replica Pods on one Node and an additional replica Pod on another Node, the service can include all three Pods. There are four types of Service:

-  **ClusterIP**: exposes the Service internally to the cluster. This is the default setting for a Service.
-  **NodePort**: exposes the Service to the internet from the IP address of the Node at the specified port number. You can only use ports in the 30000-32767 range.
-  **LoadBalancer**: this will create a load balancer assigned to a fixed IP address in the cloud, so long as the cloud provider supports it. In the case of Linode, this is the responsibility of the [Linode Cloud Controller Manager](https://github.com/linode/linode-cloud-controller-manager), which will create a NodeBalancer for the cluster. This is the best way to expose your cluster to the internet.
- **ExternalName**: maps the service to a DNS name by returning a CNAME record redirect. ExternalName is good for directing traffic to outside resources, such as a database that is hosted on another cloud.

Below is an example of a Service manifest:

{{< file "my-apache-service.yaml" yaml>}}
apiVersion: v1
kind: Service
metadata:
  name: apache-service
  labels:
    app: web
spec:
  type: NodePort
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30020
  selector:
    app: web
{{</ file >}}

The above example Service uses the `v1` API, and its `kind` is Service. Like the Pod example in the previous section, this manifest has a name and a label. Unlike the Pod example, this spec uses the `ports` field to define the exposed port on the container (`port`), and the target port on the Pod (`targetPort`). The `type` `NodePort` unlocks the use of `nodePort` field, which allows traffic on the host Node at that port. Lastly, the `selector` field is used to target only the Pods that have been assigned the `app: web` label.

For more information on Services, visit the [Kubernetes Service API documentation](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#service-v1-core).

To create the Service from the YAML file, issue the create command:

    kubectl create -f my-apache-service.yaml

To view a list of running services, issue the `get services` command:

    kubectl get services

You should see output like the following:

    NAME             TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
    apache-service   NodePort    10.99.57.13   <none>        80:30020/TCP   54s
    kubernetes       ClusterIP   10.96.0.1     <none>        443/TCP        46h

To retrieve more information about your Service, issue the `describe` command:

    kubectl describe service apache-service

To delete the Service, issue the delete command:

    kubcetl delete service apache-service

### Volumes

A *Volume* in Kubernetes is a way to share file storage between containers in a Pod. Kubernetes Volumes differ from Docker volumes because they exist inside the Pod rather than inside the container. When a container is restarted the Volume persists. Note, however, that these Volumes are still tied to the lifecycle of the Pod, so if the Pod is destroyed the Volume will be destroyed with it.

Linode also offers a [Container Storage Interface (CSI) driver](https://github.com/linode/linode-blockstorage-csi-driver) that allows the cluster to persist data on a Block Storage volume.

Below is an example of how to create and use a Volume by creating a Pod manifest:

{{< file "my-apache-pod-with-volume.yaml" yaml>}}
apiVersion: v1
kind: Pod
metadata:
  name: apache-with-volume
spec:
  volumes:
  - name: apache-storage-volume
    emptyDir: {}

  containers:
  - name: nginx
    image: nginx
    volumeMounts:
    - name: apache-storage-volume
      mountPath: /data/apache-data
{{</ file >}}

A Volume has two unique aspects to its definition. In this example, the first aspect is the `volumes` block that defines the type of Volume you want to create, which in this case is a simple empty directory (`emptyDir`). The second aspect is the `volumeMounts` field within the container's `spec`. This field is given the name of the Volume you are creating and a mount path within the container.

There are a number of different Volume types you could create in addition to `emptyDir` depending on your cloud host. For more information on Volume types, visit the [Kubernetes Volumes API documentation](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#volume-v1-core).


### Namespaces

Namespaces are virtual clusters that exist within the Kubernetes cluster that help to group and organize objects. Every cluster has at least three namespaces: `default`, `kube-system`, and `kube-public`. When interacting with the cluster it is important to know which Namespace the object your are looking for is in, as many commands will default to only showing you what exists in the `default` namespace. Resources created without an explicit namespace will be added to the `default` namespace.

Namespaces consist of alphanumeric characters, dashes (`-`), and periods (`.`).

Here is an example of how to define a Namespace with a manifest:

{{< file "my-namespace.yaml" yaml>}}
apiVersion: v1
kind: Namespace
metadata:
  name: my-app
{{</ file >}}

To create the Namespace, issue the `create` command:

    kubcetl create -f my-namespace.yaml

Below is an example of a Pod with a Namespace:

{{< file "my-apache-pod-with-namespace.yaml" yaml >}}
apiVersion: v1
kind: Pod
metadata:
  name: apache-pod
  labels:
    app: web
  namespace: my-app
spec:
  containers:
  - name: apache-container
    image: httpd
{{</ file >}}

To retrieve resources in a certain Namespace, use the `-n` flag.

    kubectl get pods -n my-app

You should see a list of Pods within your namespace:

    NAME         READY   STATUS    RESTARTS   AGE
    apache-pod   1/1     Running   0          7s

To view Pods in all Namespaces, use the `--all-namespaces` flag.

    kubectl get pods --all-namespaces

To delete a Namespace, issue the `delete namespace` command. Note that this will delete all resources within that Namespace:

    kubectl delete namespace my-app

For more information on Namespaces, visit the [Kubernetes Namespaces API documentation](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#namespace-v1-core)

## Controllers

A Controller is a control loop that continiously watchs the Kubernetes API and tries to manage the desired state of certain aspects of the cluster. There are a number of controllers. Below is a short reference of the most popular controllers you might interact with.

### ReplicaSet

As has been mentioned, Kubernetes allows an application to scale horizontally. A *ReplicaSet* is one of the controllers responsible for keeping a given number of replica Pods running. If one Pod goes down in a ReplicaSet, another will be created to replace it. In this way, Kubernetes is *self-healing*. However, for most use cases it is recommended to use a [Deployment](#deployment) instead of a ReplicaSet.

Below is an example of a ReplicaSet:

{{< file "my-apache-replicaset.yaml" yaml>}}
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: apache-replicaset
  labels:
    app: web
spec:
  replicas: 5
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: apache-container
        image: httpd
{{</ file >}}

There are three main things to note in this ReplicaSet. The first is the `apiVersion`, which is `apps/v1`. This differs from the previous examples, which were all `apiVersion: v1`, because ReplicaSets do not exist in the `v1` core. They instead reside in the `apps` group of `v1`. The second and third things to note are the `replicas` field and the `selector` field. The `replicas` field defines how many replica Pods you want to be running at any given time. The `selector` field defines which Pods, matched by their label, will be controlled by the ReplicaSet.

To view your ReplicaSets, issue the `get replicasets` command:

    kubectl get replicasets

You should see output like the following:

    NAME                DESIRED   CURRENT   READY   AGE
    apache-replicaset   5         5         0       5s

This output shows that of the five desired replicas, there are 5 currently active, but zero of those replicas are available. This is because the Pods are still booting up. If you issue the command again, you will see that all five have become ready:

    NAME                DESIRED   CURRENT   READY   AGE
    apache-replicaset   5         5         5       86s

You can view the Pods the ReplicaSet created by issuing the `get pods` command:

    NAME                      READY   STATUS    RESTARTS   AGE
    apache-replicaset-5rsx2   1/1     Running   0          31s
    apache-replicaset-8n52c   1/1     Running   0          31s
    apache-replicaset-jcgn8   1/1     Running   0          31s
    apache-replicaset-sj422   1/1     Running   0          31s
    apache-replicaset-z8g76   1/1     Running   0          31s

To delete a ReplicaSet, issue the `delete replicaset` command:

    kubectl delete replicaset apache-replicaset

If you issue the `get pods` command, you will see that the Pods the ReplicaSet created are in the process of terminating:

    NAME                      READY   STATUS        RESTARTS   AGE
   apache-replicaset-bm2pn   0/1     Terminating   0          3m54s
   apache-replicaset-dthlp   0/1     Terminating   0          3m54s

In the above example, three of the Pods have already terminated, and two are in the process of terminating.

For more information on ReplicaSets, view the [Kubernetes ReplicaSets API documentation](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#replicaset-v1-apps).

### Deployment

A *Deployment* can manage a ReplicaSet, so it shares the ability to keep a defined number of replica pods up and running. A Deployment can also update those Pods to resemble the desired state by means of rolling updates. For example, if you wanted to update a container image to a newer version, you would create a Deployment, and the controller would update the container images one by one until the desired state is achieved. This ensures that there is no downtime when updating or altering your Pods.

Below is an example of a Deployment:

{{< file "my-apache-deployment.yaml" yaml>}}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: apache-deployment
  labels:
    app: web
spec:
  replicas: 5
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: apache-container
        image: httpd:2.4.35
{{</ file >}}

The only noticeable difference between this Deployment and the example given in the ReplicaSet section is the `kind`. In this example we have chosen to initially install Apache 2.4.35. If you wanted to update that image to Apache 2.4.38, you would issue the following command:

    kubectl --record deployment.apps/apache-deployment set image deployment.v1.apps/apache-deployment apache-container=httpd:2.4.38

You'll see a confirmation that the images have been updated:

    deployment.apps/apache-deployment image updated

To see for yourself that the images have updated, you can grab the a Pod name from the `get pods` list:

    kubectl get pods

    NAME                                 READY   STATUS    RESTARTS   AGE
    apache-deployment-574c8c4874-8zwgl   1/1     Running   0          8m36s
    apache-deployment-574c8c4874-9pr5j   1/1     Running   0          8m36s
    apache-deployment-574c8c4874-fbs46   1/1     Running   0          8m34s
    apache-deployment-574c8c4874-nn7dl   1/1     Running   0          8m36s
    apache-deployment-574c8c4874-pndgp   1/1     Running   0          8m33s

Issue the `describe` command to view the all of the available details of the Pod:

    kubectl describe pod apache-deployment-574c8c4874-pndgp

You'll see a long list of details, of which the container image is included:

    ....

    Containers:
      apache-container:
        Container ID:   docker://d7a65e7993ab5bae284f07f59c3ed422222100833b2769ff8ee14f9f384b7b94
        Image:          httpd:2.4.38

    ....


For more information on Deployments, visit the [Kubernetes Deployments API documentation](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#deployment-v1-apps)

### Job

A *Job* is a controller that manages a Pod that is created for a single, or set, of task. This is handy if you need to create a Pod that performs a single function or calculates a value. The deletion of the Job will delete the Pod.

Below is an example of a Job that simply prints "Hello World!" and ends:

{{< file "my-job.yaml" yaml>}}
apiVersion: batch/v1
kind: Job
metadata:
  name: hello-world
spec:
  template:
    metadata:
      name: hello-world
    spec:
      containers:
      - name: output
        image: debian
        command:
         - "bin/bash"
         - "-c"
         - "echo 'Hello World!'"
      restartPolicy: Never
{{</ file >}}

To create the Job, issue the `create` command:

    kubectl create -f my-job.yaml

To inspect see if the job has run, or is running, issue the `get jobs` command:

    kubectl get jobs

You should see output like the following:

    NAME          COMPLETIONS   DURATION   AGE
    hello-world   1/1           9s         8m23s

To get the Pod of the job, issue the `get pods` command:

    kubectl get pods

You should see a output like the following:

    NAME                               READY   STATUS             RESTARTS   AGE
    hello-world-4jzdm                  0/1     Completed          0          9m44s

You can use the name of the Pod to inspect its output by consulting the log file for the Pod:

    kubectl get logs hello-world-4jzdm

To delete the Job and its Pod, issue the `delete` command:

    kubectl delete job hello-world

## Networking

Networking in Kubernetes was designed to make it simple to port existing apps from VMs to containers, and subsequently, Pods. The basic requirements of the Kubernetes networking model are:

1.  Pods can communicate with each other across Nodes without the use of [NAT](https://whatismyipaddress.com/nat).
2.  Agents on a Node, like kubelet, can communicate with all of a Node's Pods.
3.  In the case of Linux, Pods in a Node's host network can communicate to all other Pods without NAT.

Though the rules of the Kubernetes networking model are simple, the implementation of those rules is an advanced topic. Because Kubernetes does not come with its own implementation, it is up to the user to provide a networking model.

Two of the most popular options are [Flannel](https://github.com/coreos/flannel#flannel) and [Calico](https://docs.projectcalico.org/v2.0/getting-started/kubernetes/). Flannel is a networking overlay that meets the functionality of the Kubernetes networking model, and is relatively easy to set up. Calico enables networking and networking policy through the [NetworkPolicy API](https://kubernetes.io/docs/concepts/services-networking/network-policies/) to provide simple, scalable and secure virtual networking.

For more information on the Kubernetes networking model and ways to implement it, consult the [cluster networking documentation](https://kubernetes.io/docs/concepts/cluster-administration/networking/).

## Next Steps

There are a number of advanced topics in Kubernetes. Below are a few you might find useful as you progress in Kubernetes:

- [StatefulSets](https://kubernetes.io/docs/tutorials/stateful-application/basic-stateful-set/) can be used when creating stateful applications.
- [Horizontal Pod Autoscaling](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) can automatically scale your deployments based on CPU usage.
- [ResourceQuotas](https://kubernetes.io/docs/concepts/policy/resource-quotas/) are helpful when working with larger groups where there is a concern that some teams might take up too many resources.