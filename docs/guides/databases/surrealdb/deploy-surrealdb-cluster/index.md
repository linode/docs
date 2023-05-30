---
slug: deploy-surrealdb-cluster
title: "Deploying a SurrealDB Cluster on Kubernetes"
description: "SurrealDB has been designed with distributed infrastructure in mind. With high-performance and scalable architecture, SurrealDB fits well on a Kubernetes cluster setup. In this tutorial, learn how to deploy your own SurrealDB instance with Docker and Kubernetes."
keywords: ['surrealdb docker','surrealdb cluster','surrealdb kubernetes']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ['Nathaniel Stickman']
published: 2023-05-30
modified_by:
  name: Nathaniel Stickman
external_resources:
- '[SurrealDB Documentation](https://surrealdb.com/docs)'
- '[SurrealDB: Run a Multi-node, Scalable Cluster with TiKV](https://surrealdb.com/docs/installation/running/tikv)'
- '[TiKV: Using TiKV Operator](https://tikv.org/docs/4.0/tasks/try/tikv-operator/)'
---

SurrealDB offers a powerful alternative to traditional relational databases. Whether you want a database capable of inter-document relations or a full backend for your serverless web applications, SurrealDB can serve you well.

If you have not already done so, you may want to look through our [Getting Started with SurrealDB](/docs/guides/getting-started-with-surrealdb/) guide to learn more about SurrealDB.

SurrealDB has also been designed from the ground up to operate effectively in horizontally-scaling, distributed environments. Along with its range of other features, this makes SurrealDB an excellent database and backend to scale with your growing applications

This tutorial gets you started with setting up a SurrealDB instance in a distributed environment. Using Kubernetes for cluster deployment and TiKV for clustered persistence, you can see a straightforward but potent way to run your distributed SurrealDB server.

## How to Deploy a SurrealDB Cluster

There are numerous ways you could go about setting up a distributed architecture with SurrealDB. But probably the most approachable is using a Kubernetes cluster. This lets you leverage all the tooling and community support of Kubernetes when fine-tuning your setup for your needs.

Typically, SurrealDB uses either in-memory or in-file storage. But SurrealDB also supports a few options for clustered persistence. One of the most well-supported is [TiKV](https://tikv.org/), and you can see that solution employed here for the distributed SurrealDB servers.

### Provisioning the Kubernetes Cluster

To get started, you need to have a Kubernetes cluster up and running and a tool like kubectl set up to manage the cluster. This tutorial gives commands for kubectl, so you are best using that tool specifically.

Linode has a convenient way to get started — the Linode Kubernetes Engine (LKE) — which you can deploy directly from the Linode Cloud Manager. Our guide [Linode Kubernetes Engine - Getting Started](/docs/products/compute/kubernetes/get-started/) includes steps for deploying a new cluster and setting up a kubectl instance to manage the cluster.

The rest of this tutorial assumes you have such a Kubernetes cluster up and running and configured for management with a local kubectl instance. For examples the tutorial also assumes you cluster has three nodes, so adjust that accordingly throughout.

Additionally, you need to have [Helm](https://helm.sh/) installed to follow along with this tutorial. Helm here deploys TiKV to the cluster. To install Helm, you can follow the relevant section of our guide [Installing Apps on Kubernetes with Helm 3](/docs/guides/how-to-install-apps-on-kubernetes-with-helm-3/#install-helm).

### Deploying TiKV for Persistence

Before deploying SurrealDB to the cluster, you should have TiKV and the TiKV Operator up and running. TiKV, as described above, provides a coordinated persistent storage across the cluster. SurrealDB in turn leverages that coordinated storage to keep its distributed instances in sync.

1. Create a Kubernetes manifest for deploying the TiKV Operator CRDs. Use the contents shown in our [example manifest](example-tikv-operator-crds.yaml) for a basic TiKV configuration that works on the latest versions of Kubernetes.

    TiKV's official [beta manifest](https://raw.githubusercontent.com/tikv/tikv-operator/master/manifests/crd.v1beta1.yaml) requires older versions of Kubernetes (1.16 and older). Our example updates that for newer versions of Kubernetes based on TiKV [developer commentary](https://github.com/tikv/tikv-operator/issues/15).

1. Use the manifest above to install the TiKV Operator CRDs to your cluster. The example command here assumes you named the manifest `tikv-operator-crds.yaml`.

    ```command
    kubectl apply -f tikv-operator-crds.yaml
    ```

1. Install the TiKV Operator itself via Helm. This requires a few commands, adding the necessary Helm repository, creating the TiKV Operator namespace, and finally installing the operator.

    ```command
    helm repo add pingcap https://charts.pingcap.org/
    kubectl create ns tikv-operator
    helm install --namespace tikv-operator tikv-operator pingcap/tikv-operator --version v0.1.0
    ```

1. Confirm deployment of the operator by checking your Kubernetes pods in the operator's namespace.

    ```command
    kubectl --namespace tikv-operator get pods
    ```

    ```output
    NAME                             READY   STATUS    RESTARTS   AGE
    tikv-operator-64d75bc9c8-j74b6   1/1     Running   0          28s
    ```

1. Make another Kubernetes manifest file, this one for the TiKV cluster itself. The contents for this file are based on TiKV's [basic cluster example](https://raw.githubusercontent.com/tikv/tikv-operator/master/examples/basic/tikv-cluster.yaml).

    The example here is intentionally minimal, aside from the three replicas matching the Kubernetes cluster size, so modify the values here as needed.

    ```file {title="tikv-cluster.yaml" lang="yaml"}
    apiVersion: tikv.org/v1alpha1
    kind: TikvCluster
    metadata:
      name: tikv-cluster
    spec:
      version: v4.0.0
      pd:
        baseImage: pingcap/pd
        replicas: 3
        requests:
          storage: "1Gi"
        config: {}
      tikv:
        baseImage: pingcap/tikv
        replicas: 3
        requests:
          storage: "1Gi"
        config: {}
    ```

1. Use the manifest to install TiKV to your Kubernetes cluster.


    ```command
    kubectl apply -f tikv-cluster.yaml
    ```

1. Verify the deployment of the TiKV cluster. It may take a while before all of the pods are running.

    ```command
    kubectl get pods
    ```

    ```output
    NAME                                      READY   STATUS    RESTARTS      AGE
    tikv-cluster-discovery-6955b6d594-5xmwr   1/1     Running   0             96s
    tikv-cluster-pd-0                         1/1     Running   0             95s
    tikv-cluster-pd-1                         1/1     Running   0             95s
    tikv-cluster-pd-2                         1/1     Running   0             95s
    tikv-cluster-tikv-0                       1/1     Running   0             43s
    tikv-cluster-tikv-1                       1/1     Running   0             43s
    tikv-cluster-tikv-2                       1/1     Running   0             43s
    ```

### Deploying SurrealDB to the Cluster

With a Kubernetes cluster running TiKV, you are ready to deploy your distributed SurrealDB instances. The process is relatively straightforward from here. It just requires a Kubernetes manifest that pulls the SurrealDB image and starts up SurrealDB with TiKV as the storage option.

1. Create a Kubernetes manifest for deploying the SurrealDB instances, along with a service for routing connections to the instances. The example here deploys three replicas of a basic SurrealDB server.

    ```file {title="surreal-manifest.yaml" lang="yaml"}
    ---
    apiVersion: v1
    kind: Service
    metadata:
      labels:
        app: surreal
      name: surreal-service
    spec:
      ports:
        - name: "surreal-port"
          port: 8000
          targetPort: 8000
      selector:
        app: surreal
    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      labels:
        app: surreal
      name: surreal-deployment
    spec:
      replicas: 3
      selector:
        matchLabels:
          app: surreal
      template:
        metadata:
          labels:
            app: surreal
        spec:
          containers:
            - args:
                - start
                - --user=root
                - --pass=exampleRootPass
                - tikv://tikv-cluster-pd:2379
              image: surrealdb/surrealdb:latest
              name: surrealdb
              ports:
                - containerPort: 8000
    ```

    Notice also that the command used to start up each SurrealDB server uses the `tikv://` protocol. This directs the servers to use TiKV for database persistence. The TiKV URL here, `tikv-cluster-pd`, points to the TiKV service exposed within the Kubernetes cluster.

1. Deploy the SurrealDB manifest to your Kubernetes cluster.

    ```command
    kubectl apply -f surreal-manifest.yaml
    ```

Shortly, you should be able to verify that the SurrealDB instances are running by checking the list of pods.

```command
kubectl get pods
```

```output
NAME                                      READY   STATUS    RESTARTS      AGE
surreal-deployment-59fcf5cd9b-hqz5g       1/1     Running   0             7s
surreal-deployment-59fcf5cd9b-mlfbl       1/1     Running   0             7s
surreal-deployment-59fcf5cd9b-rmb8j       1/1     Running   0             7s
tikv-cluster-discovery-6955b6d594-5xmwr   1/1     Running   0             50m
tikv-cluster-pd-0                         1/1     Running   1 (49m ago)   50m
tikv-cluster-pd-1                         1/1     Running   0             50m
tikv-cluster-pd-2                         1/1     Running   0             50m
tikv-cluster-tikv-0                       1/1     Running   0             49m
tikv-cluster-tikv-1                       1/1     Running   0             49m
tikv-cluster-tikv-2                       1/1     Running   0             49m
```

And, picking one of these pods as a test, you can verify that SurrealDB has started up successfully connected to the TiKV service.

```command
kubectl logs surrealdb-deployment-5cc49c6894-fw885
```

```output
 .d8888b.                                             888 8888888b.  888888b.
d88P  Y88b                                            888 888  'Y88b 888  '88b
Y88b.                                                 888 888    888 888  .88P
 'Y888b.   888  888 888d888 888d888  .d88b.   8888b.  888 888    888 8888888K.
    'Y88b. 888  888 888P'   888P'   d8P  Y8b     '88b 888 888    888 888  'Y88b
      '888 888  888 888     888     88888888 .d888888 888 888    888 888    888
Y88b  d88P Y88b 888 888     888     Y8b.     888  888 888 888  .d88P 888   d88P
 'Y8888P'   'Y88888 888     888      'Y8888  'Y888888 888 8888888P'  8888888P'


2023-05-30T18:43:00.869343Z  INFO surrealdb::env: Running 1.0.0-beta.9+20230402.5eafebd for linux on x86_64
2023-05-30T18:43:00.869368Z  INFO surrealdb::iam: Root authentication is enabled
2023-05-30T18:43:00.869371Z  INFO surrealdb::iam: Root username is 'root'
2023-05-30T18:43:00.869371Z  INFO surrealdb::dbs: Database strict mode is disabled
2023-05-30T18:43:00.869377Z  INFO surrealdb::kvs: Connecting to kvs store at tikv://tikv-cluster-pd:2379
2023-05-30T18:43:00.881033Z  INFO surrealdb::kvs: Connected to kvs store at tikv://tikv-cluster-pd:2379
2023-05-30T18:43:00.881319Z  INFO surrealdb::net: Starting web server on 0.0.0.0:8000
2023-05-30T18:43:00.881444Z  INFO surrealdb::net: Started web server on 0.0.0.0:8000
```

## How to Access the SurrealDB Cluster

Your Kubernetes cluster now has an operational and distributed set of SurrealDB instances running. From here you are ready to start working with the SurrealDB cluster, making the most of what SurrealDB has to offer.

But first, you need to see the steps for accessing your SurrealDB cluster. These are a little different than when running a single SurrealDB server.

Additionally, there are another set of steps you can take to start securing your SurrealDB cluster. These steps are elaborate more in a guide of ours linked further below, but here you can get started with those steps.

### Accessing SurrealDB

The SurrealDB cluster is running on the Kubernetes network. In order to access it, typically you can use port forwarding through kubectl.

Using the steps above, your SurrealDB cluster deployment included a Kubernetes service. That service provides a practical way to access the cluster without having to specify a particular instance.

Follow along here to use port forwarding into the SurrealDB Kubernetes service and try out your first query on the SurrealDB cluster.

1. Use kubectl's `port-forward` command to forward the SurrealDB port (`8000`) from the SurrealDB Kubernetes service to your local machine.

    ```command
    kubectl port-forward svc/surreal-service 8000:8000
    ```

    ```output
    Forwarding from 127.0.0.1:8000 -> 8000
    Forwarding from [::1]:8000 -> 8000
    ```

1. This already makes the SurrealDB cluster is accessible. Test it out by sending a query to the cluster using an HTTP request.

    The example here uses cURL to send the request for information on the `exampleDb` database in the `exampleNs` SurrealDB namespace. This example assumes you have used the example root user credentials given in the SurrealDB example manifest further above.

    ```command
    curl -X POST -H "Accept: application/json" -H "NS: exampleNs" -H "DB: exampleDb" --user "root:exampleRootPass" --data "INFO FOR DB;" http://localhost:8000/sql | jq
    ```

    ```output
    [
      {
        "time": "213.507212ms",
        "status": "OK",
        "result": {
          "dl": {},
          "dt": {},
          "fc": {},
          "pa": {},
          "sc": {},
          "tb": {}
        }
      }
    ]
    ```

    At present, the output is largely empty, because the database has not yet been populated. But the structure of the response indicates successful connection to the SurrealDB server.

### Completing the SurrealDB Setup

The SurrealDB cluster is operable now. You can use the port forwarding feature and set up traffic to the cluster how best fits your applications and overall needs. However, likely you want to take additional steps to secure your SurrealDB cluster before taking it to production.

You can find thorough coverage of how to secure SurrealDB and manage user access in our guide [Managing Security and Access Control for SurrealDB](/docs/guides/managing-security-and-access-for-surrealdb/).

But here you can find some steps to get you started and demonstrate how these configurations might be applied to your SurrealDB cluster. These steps set up a limited SurrealDB user and disable root access on your SurrealDB servers.

1. Start up a SurrealDB CLI session, connecting to your cluster using the root user's credentials. This assumes that you still have port forwarding operating, as in the previous section. Additionally, this example command uses the example root user credentials included in the manifest earlier in the tutorial.

    ```command
    surreal sql --conn http://localhost:8000 --user root --pass exampleRootPass --ns exampleNs --db exampleDb --pretty
    ```

1. Execute a `DEFINE LOGIN` SurrealQL command to create a new SurrealDB user. This example creates an `exampleUser` at the database level, meaning that the user's access is limited to the current database (`exampleDb`).

    ```command
    DEFINE LOGIN exampleUser ON DATABASE PASSWORD 'examplePass';
    ```

1. When you are done creating users, exit the SurrealDB CLI using the <kbd>Ctrl</kbd> + <kbd>C</kbd> keyboard combination, and stop the kubectl port forwarding similarly.

1. Open the SurrealDB Kubernetes manifest created earlier (`surreal-manifest.yaml`), and remove the `--user` and `--pass` lines from the `containers` block, as shown here.

    ```file
    # [...]
          containers:
            - args:
                - start
                - tikv://tikv-cluster-pd:2379
              image: surrealdb/surrealdb:latest
              name: surrealdb
              ports:
                - containerPort: 8000
    ```

    Removing the root credentials from the SurrealDB start up disables root access on the instances.

1. Reapply the SurrealDB manifest.

    ```command
    kubectl apply -f surreal-manifest.yaml
    ```

    You can verify success by using `kubectl get pods` to get the updated pods' IDs and using one of these to see the SurrealDB logs, as here. Notice that the output below shows that `Root authentication is disabled`.

    ```command
    kubectl logs surreal-deployment-59fcf5cd9b-tjqwz
    ```

    ```output
     .d8888b.                                             888 8888888b.  888888b.
    d88P  Y88b                                            888 888  'Y88b 888  '88b
    Y88b.                                                 888 888    888 888  .88P
     'Y888b.   888  888 888d888 888d888  .d88b.   8888b.  888 888    888 8888888K.
        'Y88b. 888  888 888P'   888P'   d8P  Y8b     '88b 888 888    888 888  'Y88b
          '888 888  888 888     888     88888888 .d888888 888 888    888 888    888
    Y88b  d88P Y88b 888 888     888     Y8b.     888  888 888 888  .d88P 888   d88P
     'Y8888P'   'Y88888 888     888      'Y8888  'Y888888 888 8888888P'  8888888P'


    2023-05-30T22:33:15.571269Z  INFO surrealdb::env: Running 1.0.0-beta.9+20230402.5eafebd for linux on x86_64
    2023-05-30T22:33:15.571291Z  INFO surrealdb::iam: Root authentication is disabled
    2023-05-30T22:33:15.571294Z  INFO surrealdb::dbs: Database strict mode is disabled
    2023-05-30T22:33:15.571301Z  INFO surrealdb::kvs: Connecting to kvs store at tikv://tikv-cluster-pd:2379
    2023-05-30T22:33:15.698382Z  INFO surrealdb::kvs: Connected to kvs store at tikv://tikv-cluster-pd:2379
    2023-05-30T22:33:15.698474Z  INFO surrealdb::net: Starting web server on 0.0.0.0:8000
    2023-05-30T22:33:15.698525Z  INFO surrealdb::net: Started web server on 0.0.0.0:8000
    ```

Now you can verify the limited access. First, start up port forwarding as shown earlier.

```command
kubectl port-forward svc/surreal-service 8000:8000
```

You can start by trying to access database information using the previous root user credentials, just as shown further above in this tutorial. The authentication fails, verifying that the root user is no longer operative.

```command
curl -X POST -H "Accept: application/json" -H "NS: exampleNs" -H "DB: exampleDb" --user "root:exampleRootPass" --data "INFO FOR DB;" http://localhost:8000/sql | jq
```

```output
{
  "code": 403,
  "details": "Authentication failed",
  "description": "Your authentication details are invalid. Reauthenticate using valid authentication parameters.",
  "information": "There was a problem with authentication"
}
```

Now attempt the same query but using the credentials for the limited user you created above.

```command
curl -X POST -H "Accept: application/json" -H "NS: exampleNs" -H "DB: exampleDb" --user "exampleUser:examplePass" --data "INFO FOR DB;" http://localhost:8000/sql | jq
```

``` output
[
  {
    "time": "7.02541ms",
    "status": "OK",
    "result": {
      "dl": {
        "exampleUser": "DEFINE LOGIN exampleUser ON DATABASE PASSHASH '$argon2id$v=19$m=19456,t=2,p=1$JijmKQBeUrhqar0iPHIFiA$eI13ZZh1Gdv0DsetObxrxOeWMFQq34T5/mz3enFSu4M'"
      },
      "dt": {},
      "fc": {},
      "pa": {},
      "sc": {},
      "tb": {}
    }
  }
]
```

Lastly, you can check to see that the user is limited by trying to get information about the namespace instead of the database. Recall that the `DEFINE LOGIN` statement above gave the user a database role, not a namespace role.


```command
curl -X POST -H "Accept: application/json" -H "NS: exampleNs" -H "DB: exampleDb" --user "exampleUser:examplePass" --data "INFO FOR NS;" http://localhost:8000/sql | jq
```

``` output
[
  {
    "time": "345.696µs",
    "status": "ERR",
    "detail": "You don't have permission to perform this query type"
  }
]
```

## Conclusion

You are now ready to operate a distributed SurrealDB cluster. With the powerful possibilities of SurrealDB and the scalability of its distributed architecture, you can be sure to adapt to your applications' needs.

As the beginning of this tutorial indicated, SurrealDB can fit a range of use cases. You can use it like a traditional database, taking advantage of its distributed architecture and inter-document relations. Or you can use it as a full backend for serverless web applications.

To keep learning about SurrealDB, and to get more ideas for using it with your applications, take a look at these other guides of ours.

- [Building an Web Application on Top of SurrealDB](/docs/guides/surrealdb-for-web-applications)

- [Modeling Data with SurrealDB’s Inter-document Relations](/docs/guides/surrealdb-interdocument-modeling)
