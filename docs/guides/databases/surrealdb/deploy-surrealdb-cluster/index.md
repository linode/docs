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

SurrealDB offers a powerful alternative to traditional relational databases. Whether you want a database capable of inter-document relations or a full backend for your serverless web applications, SurrealDB is a great choice.

SurrealDB has also been designed from the ground up to operate effectively in horizontally-scaling distributed environments. Along with its range of other features, this makes SurrealDB an excellent database and backend to scale with growing applications.

This tutorial walks through setting up a SurrealDB instance in a distributed environment using Kubernetes for cluster deployment and TiKV for clustered persistence. This presents a straightforward, yet potent way to run a distributed SurrealDB server.

## How to Deploy a SurrealDB Cluster

There are numerous ways to go about setting up a distributed architecture with SurrealDB, but using a Kubernetes cluster is probably the most approachable. This allows you to leverage all the tooling and community support of Kubernetes to fine-tune this setup for your needs.

Typically, SurrealDB uses either in-memory or in-file storage, but SurrealDB also supports a few options for clustered persistence. One of the most well-supported is [TiKV](https://tikv.org/). Follow along to see it employed here for the example distributed SurrealDB servers.

### Provisioning the Kubernetes Cluster

To get started, you need to have a Kubernetes cluster up and running, along with `kubectl` or a similar tool set up to manage the cluster. This tutorial provides commands specifically for `kubectl`.

Linode offers the Linode Kubernetes Engine (LKE) as a convenient way to get started. You can deploy a cluster directly from the Linode Cloud Manager. Our guide [Linode Kubernetes Engine - Getting Started](/docs/products/compute/kubernetes/get-started/) includes steps for deploying a new cluster and setting up a `kubectl` instance to manage it.

The rest of this tutorial assumes you have a Kubernetes cluster up and running and configured for management with a local `kubectl` instance. The examples in this tutorial also assume that your cluster has three nodes, so adjust accordingly throughout if your cluster differs.

Additionally, you need to have [Helm](https://helm.sh/) installed to follow along with this tutorial. Helm is used here to deploy TiKV to the cluster. To install Helm, follow the relevant section of our guide [Installing Apps on Kubernetes with Helm 3](/docs/guides/how-to-install-apps-on-kubernetes-with-helm-3/#install-helm).

Also install SurrealDB on your local machine. You need it later in order to run `surreal` commands on the Kubernetes cluster via port forwarding. Follow the steps in the relevant section of our guide [Getting Started with SurrealDB](/docs/guides/getting-started-with-surrealdb/#how-to-install-surrealdb).

### Deploying TiKV for Persistence

Before deploying SurrealDB to the cluster, you should have both TiKV and the TiKV Operator up and running. As described above, TiKV provides coordinated persistent storage across the cluster. SurrealDB in turn leverages that coordinated storage to keep its distributed instances in sync.

1.  Create a Kubernetes manifest for deploying the TiKV Operator CRDs:

    ```command
    nano tikv-operator-crds.yaml
    ```

1.  Give it the contents shown in our [example manifest](example-tikv-operator-crds.yaml) for a basic TiKV configuration that works on the latest versions of Kubernetes.

    {{< note >}}
    TiKV's official [beta manifest](https://raw.githubusercontent.com/tikv/tikv-operator/master/manifests/crd.v1beta1.yaml) requires older versions of Kubernetes (1.16 and older). Our example updates that for newer versions of Kubernetes based on TiKV [developer commentary](https://github.com/tikv/tikv-operator/issues/15).
    {{< /note >}}

1.  When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Use the manifest above to install the TiKV Operator CRDs to your cluster. The example command here assumes you named the manifest `tikv-operator-crds.yaml`.

    ```command
    kubectl apply -f tikv-operator-crds.yaml
    ```

    ```output
    customresourcedefinition.apiextensions.k8s.io/tikvclusters.tikv.org created
    ```

1.  Install the TiKV Operator itself via Helm. This involves adding the necessary Helm repository and creating the TiKV Operator namespace before finally installing the operator.

    ```command
    helm repo add pingcap https://charts.pingcap.org/
    kubectl create ns tikv-operator
    helm install --namespace tikv-operator tikv-operator pingcap/tikv-operator --version v0.1.0
    ```

    ```output
    NAME: tikv-operator
    LAST DEPLOYED: Wed Jul  5 13:58:31 2023
    NAMESPACE: tikv-operator
    STATUS: deployed
    REVISION: 1
    TEST SUITE: None
    ```

1.  Confirm deployment of the operator by checking your Kubernetes pods in the operator's namespace:

    ```command
    kubectl --namespace tikv-operator get pods
    ```

    ```output
    NAME                             READY   STATUS    RESTARTS   AGE
    tikv-operator-64d75bc9c8-j74b6   1/1     Running   0          28s
    ```

1.  Create another Kubernetes manifest file for the TiKV cluster itself:

    ```command
    nano tikv-cluster.yaml
    ```

1.  The contents for this file are based on TiKV's [basic cluster example](https://raw.githubusercontent.com/tikv/tikv-operator/master/examples/basic/tikv-cluster.yaml). This example is intentionally minimal, aside from the three replicas matching the Kubernetes cluster size, so modify the values here as needed:

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

1.  When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Use the manifest to install TiKV to your Kubernetes cluster:

    ```command
    kubectl apply -f tikv-cluster.yaml
    ```

    ```output
    tikvcluster.tikv.org/tikv-cluster created
    ```

1.  Verify the deployment of the TiKV cluster:

    ```command
    kubectl get pods
    ```

    It may take a while before all of the pods are running:

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

With a Kubernetes cluster running TiKV, you are now ready to deploy distributed SurrealDB instances. The process is relatively straightforward. It simply requires a Kubernetes manifest that pulls the SurrealDB image, then starts up SurrealDB with TiKV as the storage option.

1.  Create another Kubernetes manifest for deploying the SurrealDB instances, along with a service for routing connections to them:

    ```command
    nano surreal-manifest.yaml
    ```

1.  The example here deploys three replicas of a basic SurrealDB server:

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

1.  When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Deploy the SurrealDB manifest to the Kubernetes cluster:

    ```command
    kubectl apply -f surreal-manifest.yaml
    ```

    ```output
    service/surreal-service created
    deployment.apps/surreal-deployment created
    ```

1.  Verify that the SurrealDB instances are running by checking the list of pods:

    ```command
    kubectl get pods
    ```

    Again, this may take a while for all pods to report as `Running`:

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

1.  As a test, pick one of these pods to verify that SurrealDB has started up and successfully connected to the TiKV service:

    ```command
    kubectl logs surreal-deployment-59fcf5cd9b-hqz5g
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

Your Kubernetes cluster now has an operational and distributed set of SurrealDB instances running. From here you are ready to start working with the SurrealDB cluster.

First, you need to read the steps for accessing your SurrealDB cluster. These are a little different than when running a single SurrealDB server.

Additionally, there are another set of steps to start securing your SurrealDB cluster. These steps are detailed in another guide linked further below, but excerpts are provided in this tutorial to get you started.

### Accessing SurrealDB

The SurrealDB cluster is now running on the Kubernetes network. You can use port forwarding through `kubectl` to access it.

Using the steps above, your SurrealDB cluster deployment includes a Kubernetes service. That service provides a practical way to access the cluster without having to specify a particular instance.

Follow along to access the SurrealDB Kubernetes service using port forwarding, then try out your first query on the SurrealDB cluster.

1.  Use the `kubectl` `port-forward` command to forward the SurrealDB port (`8000`) from the SurrealDB Kubernetes service to your local machine:

    ```command
    kubectl port-forward svc/surreal-service 8000:8000
    ```

    ```output
    Forwarding from 127.0.0.1:8000 -> 8000
    Forwarding from [::1]:8000 -> 8000
    ```

1.  This makes the SurrealDB cluster accessible. Test it out by sending a query to the cluster using an HTTP request in a second terminal.

    The example here uses cURL to send the request for information on the `exampleDb` database in the `exampleNs` SurrealDB namespace. This example assumes you used the example root user credentials given in the SurrealDB example manifest further above.

    ```command {title="Terminal #2"}
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

    The output is largely empty because the database has not yet been populated. Nevertheless, the structure of the response indicates successful connection to the SurrealDB server.

### Completing the SurrealDB Setup

The SurrealDB cluster is now operable. You can use the port forwarding feature and set up traffic to the cluster to best fit your needs. However, it's likely you want to secure your SurrealDB cluster before taking it to production.

Find thorough coverage of how to secure SurrealDB and manage user access in our guide [Managing Security and Access Control for SurrealDB](/docs/guides/managing-security-and-access-for-surrealdb/).

Below are some steps to get you started and demonstrate how these configurations might be applied to your SurrealDB cluster. These steps set up a limited SurrealDB user and disable root access on your SurrealDB servers.

1.  Start up a SurrealDB CLI session and connect to your cluster using the root user's credentials. This assumes that port forwarding is still operating as in the previous section. Additionally, this example command uses the example root user credentials included in the manifest earlier in the tutorial.

    ```command {title="Terminal #2"}
    surreal sql --conn http://localhost:8000 --user root --pass exampleRootPass --ns exampleNs --db exampleDb --pretty
    ```

1.  Execute a `DEFINE LOGIN` SurrealQL command to create a new SurrealDB user. This example creates an `exampleUser` at the database level, meaning that the user's access is limited to the current database (`exampleDb`).

    ```command {title="Terminal #2"}
    DEFINE LOGIN exampleUser ON DATABASE PASSWORD 'examplePass';
    ```

1.  When done creating users, exit the SurrealDB CLI using the <kbd>Ctrl</kbd> + <kbd>C</kbd> keyboard combination. Use the same keyboard combination to also stop the `kubectl` port forwarding.

1.  In the original terminal, open the SurrealDB Kubernetes manifest created earlier:

    ```command {title="Terminal #1"}
    nano surreal-manifest.yaml
    ```

1.  Remove the `--user` and `--pass` lines from the `containers` block as shown here:

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

1.  When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Reapply the SurrealDB manifest:

    ```command {title="Terminal #1"}
    kubectl apply -f surreal-manifest.yaml
    ```

    ```output
    service/surreal-service unchanged
    deployment.apps/surreal-deployment configured
    ```

1.  Verify success by using `kubectl` to display the IDs of the updated pods:

    ```command {title="Terminal #1"}
    kubectl get pods
    ```

    ```output
    surreal-deployment-59fcf5cd9b-cs8sj       1/1     Running   0          118s
    surreal-deployment-59fcf5cd9b-g569w       1/1     Running   0          2m
    surreal-deployment-59fcf5cd9b-xwkzf       1/1     Running   0          2m1s
    tikv-cluster-discovery-6955b6d594-txlft   1/1     Running   0          104m
    tikv-cluster-pd-0                         1/1     Running   0          104m
    tikv-cluster-pd-1                         1/1     Running   0          104m
    tikv-cluster-pd-2                         1/1     Running   0          104m
    tikv-cluster-tikv-0                       1/1     Running   0          103m
    tikv-cluster-tikv-1                       1/1     Running   0          103m
    tikv-cluster-tikv-2                       1/1     Running   0          103m
    ```

1.  Use one of these IDs to see the SurrealDB logs, for example:

    ```command {title="Terminal #1"}
    kubectl logs surreal-deployment-59fcf5cd9b-cs8sj
    ```

    Notice that the output shows that `Root authentication is disabled`:

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

1.  Now verify the limited access. First, start up port forwarding as shown earlier:

    ```command {title="Terminal #1"}
    kubectl port-forward svc/surreal-service 8000:8000
    ```

1.  Move back to the second terminal and try to access database information using the previous root user credentials as shown further above in this tutorial:

    ```command {title="Terminal #2"}
    curl -X POST -H "Accept: application/json" -H "NS: exampleNs" -H "DB: exampleDb" --user "root:exampleRootPass" --data "INFO FOR DB;" http://localhost:8000/sql | jq
    ```

    The authentication fails, verifying that the root user is no longer operative:

    ```output
    {
      "code": 403,
      "details": "Authentication failed",
      "description": "Your authentication details are invalid. Reauthenticate using valid authentication parameters.",
      "information": "There was a problem with authentication"
    }
    ```

1.  Now attempt the same query but using the credentials for the limited user created above:

    ```command {title="Terminal #2"}
    curl -X POST -H "Accept: application/json" -H "NS: exampleNs" -H "DB: exampleDb" --user "exampleUser:examplePass" --data "INFO FOR DB;" http://localhost:8000/sql | jq
    ```

    ```output
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

1.  Finally, check to see that the user is limited to the database by trying to get information about the namespace:

    ```command {title="Terminal #2"}
    curl -X POST -H "Accept: application/json" -H "NS: exampleNs" -H "DB: exampleDb" --user "exampleUser:examplePass" --data "INFO FOR NS;" http://localhost:8000/sql | jq
    ```

    Recall that the `DEFINE LOGIN` statement above gave the user a database role, not a namespace role:

    ```output
    [
      {
        "time": "345.696µs",
        "status": "ERR",
        "detail": "You don't have permission to perform this query type"
      }
    ]
    ```

## Conclusion

You are now ready to operate a distributed SurrealDB cluster. With the powerful possibilities of SurrealDB and the scalability of its distributed architecture, you can adapt with your applications' needs.

As the beginning of this tutorial indicated, SurrealDB can fit a range of use cases. You can use it like a traditional database, taking advantage of its distributed architecture and inter-document relations. Alternatively, you can use it as a full backend for serverless web applications.

To keep learning about SurrealDB, and to get more ideas for using it with your applications, take a look at our other SurrealDB guides:

-   [Building an Web Application on Top of SurrealDB](/docs/guides/surrealdb-for-web-applications)

-   [Modeling Data with SurrealDB’s Inter-document Relations](/docs/guides/surrealdb-interdocument-modeling)