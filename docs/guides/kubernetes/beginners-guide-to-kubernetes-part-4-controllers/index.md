---
slug: beginners-guide-to-kubernetes-part-4-controllers
author:
  name: Andy Stevens
  email: docs@linode.com
description: 'This is part four in a multi-part beginner''s guide to Kubernetes where you will be introduced to another major part of Kubernetes - Controllers.'
keywords: ['kubernetes','k8s','beginner','architecture']
tags: ["docker","kubernetes","container"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-07-29
modified_by:
  name: Linode
title: "Beginner's Guide to Kubernetes (Part 4): Controllers"
h1_title: "Beginner's Guide to Kubernetes (Part 4): Controllers"
enable_h1: true
contributor:
  name: Linode
concentrations: ["Kubernetes"]
external_resources:
- '[Kubernetes API Documentation](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.17/)'
- '[Kubernetes Concepts Documentation](https://kubernetes.io/docs/concepts/)'
aliases: ['/applications/containers/kubernetes/beginners-guide-to-kubernetes-part-4-controllers/','/applications/containers/kubernetes/beginners-guide-to-kubernetes-controllers/','/kubernetes/beginners-guide-to-kubernetes-part-4-controllers/']
---

![A Beginner's Guide to Kubernetes](beginners-guide-to-kubernetes.png "A Beginner's Guide to Kubernetes")

{{< note >}}
This is the fourth guide in the [Beginner's Guide to Kubernetes](/docs/kubernetes/beginners-guide-to-kubernetes) series that explains the major parts and concepts of Kubernetes.
{{< /note >}}

A Controller is a control loop that continuously watches the Kubernetes API and tries to manage the desired state of certain aspects of the cluster. There are a number of controllers. Below is a short reference of the most popular controllers you might interact with.

In this guide you will learn about [Deployments](#deployments), [ReplicaSets](#replicasets), and [Jobs](#jobs).

## Deployments

A *Deployment* has the ability to keep a defined number of replica Pods up and running. A Deployment can also update those Pods to resemble the desired state by means of rolling updates. For example, if you wanted to update a container image to a newer version, you would create a Deployment, and the controller would update the container images one by one until the desired state is achieved. This ensures that there is no downtime when updating or altering your Pods.

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

As you will see, the only noticeable difference between a Deployment's manifest and that of a [ReplicaSet](#replicasets) the `kind`. In this example we have chosen to initially install Apache 2.4.35. If you wanted to update that image to Apache 2.4.38, you would issue the following command:

    kubectl --record deployment.apps/apache-deployment set image deployment.v1.apps/apache-deployment apache-container=httpd:2.4.38

You'll see a confirmation that the images have been updated:

    deployment.apps/apache-deployment image updated

To see for yourself that the images have updated, you can grab the Pod name from the `get pods` list:

    kubectl get pods

    NAME                                 READY   STATUS    RESTARTS   AGE
    apache-deployment-574c8c4874-8zwgl   1/1     Running   0          8m36s
    apache-deployment-574c8c4874-9pr5j   1/1     Running   0          8m36s
    apache-deployment-574c8c4874-fbs46   1/1     Running   0          8m34s
    apache-deployment-574c8c4874-nn7dl   1/1     Running   0          8m36s
    apache-deployment-574c8c4874-pndgp   1/1     Running   0          8m33s

Issue the `describe` command to view all of the available details of the Pod:

    kubectl describe pod apache-deployment-574c8c4874-pndgp

You'll see a long list of details, of which the container image is included:

    ....

    Containers:
      apache-container:
        Container ID:   docker://d7a65e7993ab5bae284f07f59c3ed422222100833b2769ff8ee14f9f384b7b94
        Image:          httpd:2.4.38

    ....


For more information on Deployments, visit the [Kubernetes Deployments API documentation](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.17/#deployment-v1-apps)

## ReplicaSets

{{< note >}}
Kubernetes now [recommends](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/#when-to-use-a-replicaset) the use of Deployments instead of ReplicaSets. Deployments provide declarative updates to Pods, among other features, that allow you to define your application in the spec section. In this way, ReplicaSets have essentially become deprecated.
{{< /note >}}

As has been mentioned, Kubernetes allows an application to scale horizontally. A *ReplicaSet* is one of the controllers responsible for keeping a given number of replica Pods running. If one Pod goes down in a ReplicaSet, another will be created to replace it. In this way, Kubernetes is *self-healing*. However, for most use cases it is recommended to use a [Deployment](#deployments) instead of a ReplicaSet.

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

    kubectl get pods

You should see output like the following:

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

In the above example, four of the Pods have already terminated, and one is in the process of terminating.

For more information on ReplicaSets, view the [Kubernetes ReplicaSets API documentation](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.17/#replicaset-v1-apps).

## Jobs

A *Job* is a controller that manages a Pod that is created for a single, or set, of tasks. This is handy if you need to create a Pod that performs a single function, or calculates a value. The deletion of the Job will delete the Pod.

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

To see if the job has run, or is running, issue the `get jobs` command:

    kubectl get jobs

You should see output like the following:

    NAME          COMPLETIONS   DURATION   AGE
    hello-world   1/1           9s         8m23s

To get the Pod of the Job, issue the `get pods` command:

    kubectl get pods

You should see an output like the following:

    NAME                               READY   STATUS             RESTARTS   AGE
    hello-world-4jzdm                  0/1     Completed          0          9m44s

You can use the name of the Pod to inspect its output by consulting the log file for the Pod:

    kubectl logs hello-world-4jzdm

To delete the Job, and its Pod, issue the `delete` command:

    kubectl delete job hello-world

## Next Steps

There are other controllers not listed in this guide that you may find useful. Visit the [official Kubernetes documentation](https://kubernetes.io/docs/concepts/#kubernetes-objects) for more information.

To continue in the [Beginner's Guide to Kubernetes](/docs/kubernetes/beginners-guide-to-kubernetes) series, visit part 5:

 - [Beginner's Guide to Kubernetes, Part 1: Introduction](/docs/guides/beginners-guide-to-kubernetes-part-1-introduction/)

 - [Beginner's Guide to Kubernetes, Part 2: Master, Nodes, and the Control Plane](/docs/guides/beginners-guide-to-kubernetes-part-2-master-nodes-control-plane/)

 - [Beginner's Guide to Kubernetes, Part 3: Objects](/docs/guides/beginners-guide-to-kubernetes-part-3-objects/)

 - [Beginner's Guide to Kubernetes, Part 4: Controllers](/docs/guides/beginners-guide-to-kubernetes-part-4-controllers/) (You Are Here)

 - [Beginner's Guide to Kubernetes, Part 5: Conclusion](/docs/guides/beginners-guide-to-kubernetes-part-5-conclusion/)
