---
slug: beginners-guide-to-kubernetes-part-3-objects
author:
  name: Andy Stevens
  email: docs@linode.com
description: 'This is part three in a multi-part beginner''s guide to Kubernetes where you will be introduced to Kubernetes Pods, Services, and Namespaces.'
keywords: ['kubernetes','k8s','beginner','architecture']
tags: ["docker","kubernetes","container"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-07-29
modified_by:
  name: Linode
title: "A Beginner's Guide to Kubernetes (Part 3): Pods, Services, and Namespaces."
h1_title: "A Beginner's Guide to Kubernetes (Part 3): Pods, Services, and Namespaces"
enable_h1: true
contributor:
  name: Linode
concentrations: ["Kubernetes"]
external_resources:
- '[Kubernetes API Documentation](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.17/)'
- '[Kubernetes Concepts Documentation](https://kubernetes.io/docs/concepts/)'
aliases: ['/applications/containers/kubernetes/beginners-guide-to-kubernetes-part-3-objects/','/kubernetes/beginners-guide-to-kubernetes-part-3-objects/','/applications/containers/kubernetes/beginners-guide-to-kubernetes-objects/']
---

![A Beginner's Guide to Kubernetes](beginners-guide-to-kubernetes.png "A Beginner's Guide to Kubernetes")

{{< note >}}
This is the third guide in the [Beginner's Guide to Kubernetes](/docs/kubernetes/beginners-guide-to-kubernetes) series that explains the major parts and concepts of Kubernetes.
{{< /note >}}

In Kubernetes, there are a number of objects that are abstractions of your Kubernetes system's desired state. These objects represent your application, its networking, and disk resources -- all of which together form your application.

In this guide you will learn about [Pods](#pods), [Services](#services), [Volumes](#volumes), and [Namespaces](#namespaces).

## Pods

In Kubernetes, all containers exist within *Pods*. Pods are the smallest unit of the Kubernetes architecture, and can be viewed as a kind of wrapper for your container. Each Pod is given its own IP address with which it can interact with other Pods within the cluster.

Usually, a Pod contains only one container, but a Pod can contain multiple containers if those containers need to share resources. If there is more than one container in a Pod, these containers can communicate with one another via localhost.

Pods in Kubernetes are "mortal," which means that they are created, and destroyed depending on the needs of the application. For instance, you might have a web app backend that sees a spike in CPU usage. This might cause the cluster to scale up the amount of backend Pods from two to ten, in which case eight new Pods would be created. Once the traffic subsides, the Pods might scale back to two, in which case eight pods would be destroyed.

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

- The version of the API in use
- The kind of resource you'd like to define
- Metadata about the resource
- Though not required by all objects, a spec which describes the desired behavior of the resource is necessary for most objects and controllers.

In the case of this example, the API in use is `v1`, and the `kind` is a Pod. The metadata field is used for applying a name, labels, and annotations. Names are used to differentiate resources, while labels are used to group like resources. Labels will come into play more when defining [Services](#services) and [Deployments](/docs/guides/beginners-guide-to-kubernetes-part-4-controllers/#deployments). Annotations are for attaching arbitrary data to the resource.

The spec is where the desired state of the resource is defined. In this case, a Pod with a single Apache container is desired, so the `containers` field is supplied with a name, 'apache-container', and an image, the latest version of Apache. The image is pulled from [Docker Hub](https://hub.docker.com), as that is the default container registry for Kubernetes.

For more information on the type of fields you can supply in a Pod manifest, refer to the [Kubernetes Pod API documentation](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.17/#pod-v1-core).

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

    kubectl describe pod apache-pod

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

## Services

*Services* group identical Pods together to provide a consistent means of accessing them. For instance, you might have three Pods that are all serving a website, and all of those Pods need to be accessible on port 80. A Service can ensure that all of the Pods are accessible at that port, and can load balance traffic between those Pods. Additionally, a Service can allow your application to be accessible from the internet. Each Service is given an IP address and a corresponding local DNS entry. Additionally, Services exist across Nodes. If you have two replica Pods on one Node and an additional replica Pod on another Node, the service can include all three Pods. There are four types of Service:

-  **ClusterIP**: Exposes the Service internally to the cluster. This is the default setting for a Service.
-  **NodePort**: Exposes the Service to the internet from the IP address of the Node at the specified port number. You can only use ports in the 30000-32767 range.
-  **LoadBalancer**: This will create a load balancer assigned to a fixed IP address in the cloud, so long as the cloud provider supports it. In the case of Linode, this is the responsibility of the [Linode Cloud Controller Manager](https://github.com/linode/linode-cloud-controller-manager), which will create a NodeBalancer for the cluster. This is the best way to expose your cluster to the internet.
- **ExternalName**: Maps the service to a DNS name by returning a CNAME record redirect. ExternalName is good for directing traffic to outside resources, such as a database that is hosted on another cloud.

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

For more information on Services, visit the [Kubernetes Service API documentation](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.17/#service-v1-core).

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

    kubectl delete service apache-service

## Volumes

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
  - name: apache-container
    image: httpd
    volumeMounts:
    - name: apache-storage-volume
      mountPath: /data/apache-data
{{</ file >}}

A Volume has two unique aspects to its definition. In this example, the first aspect is the `volumes` block that defines the type of Volume you want to create, which in this case is a simple empty directory (`emptyDir`). The second aspect is the `volumeMounts` field within the container's `spec`. This field is given the name of the Volume you are creating and a mount path within the container.

There are a number of different Volume types you could create in addition to `emptyDir` depending on your cloud host. For more information on Volume types, visit the [Kubernetes Volumes API documentation](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.17/#volume-v1-core).


## Namespaces

Namespaces are virtual clusters that exist within the Kubernetes cluster that help to group and organize objects. Every cluster has at least three namespaces: `default`, `kube-system`, and `kube-public`. When interacting with the cluster it is important to know which Namespace the object you are looking for is in, as many commands will default to only showing you what exists in the `default` namespace. Resources created without an explicit namespace will be added to the `default` namespace.

Namespaces consist of alphanumeric characters, dashes (`-`), and periods (`.`).

Here is an example of how to define a Namespace with a manifest:

{{< file "my-namespace.yaml" yaml>}}
apiVersion: v1
kind: Namespace
metadata:
  name: my-app
{{</ file >}}

To create the Namespace, issue the `create` command:

    kubectl create -f my-namespace.yaml

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

For more information on Namespaces, visit the [Kubernetes Namespaces API documentation](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.17/#namespace-v1-core)

## Next Steps

To continue in the [Beginner's Guide to Kubernetes](/docs/kubernetes/beginners-guide-to-kubernetes) series, visit part 4:

 - [Beginner's Guide to Kubernetes, Part 1: Introduction](/docs/guides/beginners-guide-to-kubernetes-part-1-introduction/)

 - [Beginner's Guide to Kubernetes, Part 2: Master, Nodes, and the Control Plane](/docs/guides/beginners-guide-to-kubernetes-part-2-master-nodes-control-plane/)

 - [Beginner's Guide to Kubernetes, Part 3: Objects](/docs/guides/beginners-guide-to-kubernetes-part-3-objects/) (You Are Here)

 - [Beginner's Guide to Kubernetes, Part 4: Controllers](/docs/guides/beginners-guide-to-kubernetes-part-4-controllers/)

 - [Beginner's Guide to Kubernetes, Part 5: Conclusion](/docs/guides/beginners-guide-to-kubernetes-part-5-conclusion/)
