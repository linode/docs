---
author:
  name: Linode
  email: docs@linode.com
description: 'Linkerd is an ultra lightweight service mesh that offers monitoring, reporting, and encrypted connections between Kubernetes services without disturbing your existing applications. It does this by employing proxy sidecars along each instance.'
og_description: 'Linkerd is an ultra lightweight service mesh that offers monitoring, reporting, and encrypted connections between Kubernetes services without disturbing your existing applications. It does this by employing proxy sidecars along each instance.'
keywords: ['kuberenetes','linkerd','container', 'service mesh', 'k8s']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-11-07
modified_by:
  name: Linode
title: "How to Deploy Linkerd 2 with Linode Kubernetes Engine"
h1_title: "Deploying Linkerd 2 with Linode Kubernetes Engine"
contributor:
  name: Linode
external_resources:
- '[Linkerd](https://linkerd.io)'
- '[Linkerd Documentation](https://linkerd.io/2/overview/)'
- '[Linkerd Frequently Asked Questions](https://linkerd.io/2/faq/)'
- '[Linkerd Slack](https://slack.linkerd.io/#_ga=2.178870372.1577931415.1588870876-1893863222.1588769574)'
---

[Linkerd 2](https://linkerd.io) is an ultra lightweight service mesh that monitors, reports, and encrypts connections between Kubernetes services without disturbing the existing applications. It does this by employing proxy sidecars along each instance.

Unlike [Istio](/docs/kubernetes/how-to-deploy-istio-with-kubernetes/), another service mesh monitoring tool, it provides it's own proxies written in Rust instead of using Envoy. This makes it both lighter and more secure.

{{< note >}}
Linkerd 1.x is still available and is being actively developed as a separate project. However, it is built on the "Twitter stack" and is not for Kubernetes. Linkerd 2 is built in Rust and Go and only supports Kubernetes.
{{</ note >}}

In this guide provides instructions to:

- [Create a Kubernetes Cluster](#create-your-lke-cluster)
- [Install the Linkerd CLI](#install-linkerd)
- [Install the Linkerd Control Plane](#install-linkerd-control-plane)
- [Install a Demo Application (Optional)](#install-demo-application-optional)

{{< caution >}}
This guide’s example instructions create several billable resources on your Linode account. If you do not want to keep using the example cluster that you create, be sure to delete it when you have finished the guide.

If you remove the resources afterward, you will only be billed for the hour(s) that the resources were present on your account. Consult the [Billing and Payments](/docs/platform/billing-and-support/billing-and-payments/)  guide for detailed information about how hourly billing works and for a table of plan pricing.
{{</ caution >}}

## Before You Begin

Familiarize yourself with Kubernetes using our series [A Beginner's Guide to Kubernetes](/docs/kubernetes/beginners-guide-to-kubernetes/) and [Advantages of Using Kubernetes](/docs/kubernetes/kubernetes-use-cases/).

## Create an LKE Cluster

Follow the instructions in [Deploying and Managing a Cluster with Linode Kubernetes Engine Tutorial](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/) to create and connect to an LKE cluster.

{{< note >}}
Linkerd 2 requires Kubernetes version 1.13+. Linode Kubernetes Engine clusters currently support Kubernetes versions 1.15, 1.16, and 1.17.
{{</ note >}}

## Install Linkerd

Linkerd consists of a <abbr title="runs on the local machine and allows you to install, update, and interact with the control and data planes">Linkerd CLI <abbr>, a <abbr title="set of services that collect the data, provide the user-facing API, and control the proxies">control plane<abbr>, and a <abbr title="is a collection of proxies">data plane<abbr>.
For a more detailed overview, see the Linkerd [architecture](https://linkerd.io/2/reference/architecture/).

### Install the Linkerd CLI

1.  To manage Linkerd you need to have the CLI installed on a local machine. The Linkerd CLI is available for Linux, macOS, and Windows on the [release page](https://github.com/linkerd/linkerd2/releases/).

    - For Linux, you can use the curl command for installation:

            curl -sL https://run.linkerd.io/install | sh

    - For macOS, you can use Homebrew:

            brew install linkerd

1.  Verify that linkerd is installed by checking the version:

        linkerd version

1.  Add Linkerd to the 'PATH' environment variable:

        export PATH=$PATH:$HOME/.linkerd2/bin

1.  Use the following command to ensure that Linkerd installs correctly onto the cluster. If there are any error messages, Linkerd provides links to help you properly configure the cluster.

        linkerd check --pre

    {{< output >}}
kubernetes-api
--------------
√ can initialize the client
√ can query the Kubernetes API

kubernetes-version
------------------
√ is running the minimum Kubernetes API version
√ is running the minimum kubectl version

pre-kubernetes-setup
--------------------
√ control plane namespace does not already exist
√ can create non-namespaced resources
√ can create ServiceAccounts
√ can create Services
√ can create Deployments
√ can create CronJobs
√ can create ConfigMaps
√ can create Secrets
√ can read Secrets
√ no clock skew detected

pre-kubernetes-capability
-------------------------
√ has NET_ADMIN capability
√ has NET_RAW capability

linkerd-version
---------------
√ can determine the latest version
√ cli is up-to-date

Status check results are √
{{</ output >}}

### Install Linkerd Control Plane

1.  Install the Linkerd control plane onto the cluster into the `linkerd` namespace:

        linkerd install | kubectl apply -f -

    This command generates a Kubernetes manifest and control plane resources. It then pipes the manifest to `kubectl apply` which instructs Kubernetes to add these resources to the cluster.

1.  Validate the installation of Linkerd control plane by running the following command:

        linkerd check

    {{< output >}}
kubernetes-api
--------------
√ can initialize the client
√ can query the Kubernetes API

kubernetes-version
------------------
√ is running the minimum Kubernetes API version
√ is running the minimum kubectl version

linkerd-existence
-----------------
√ 'linkerd-config' config map exists
√ heartbeat ServiceAccount exist
√ control plane replica sets are ready
√ no unschedulable pods
√ controller pod is running
√ can initialize the client
√ can query the control plane API

linkerd-config
--------------
√ control plane Namespace exists
√ control plane ClusterRoles exist
√ control plane ClusterRoleBindings exist
√ control plane ServiceAccounts exist
√ control plane CustomResourceDefinitions exist
√ control plane MutatingWebhookConfigurations exist
√ control plane ValidatingWebhookConfigurations exist
√ control plane PodSecurityPolicies exist

linkerd-identity
----------------
√ certificate config is valid
√ trust roots are using supported crypto algorithm
√ trust roots are within their validity period
√ trust roots are valid for at least 60 days
√ issuer cert is using supported crypto algorithm
√ issuer cert is within its validity period
√ issuer cert is valid for at least 60 days
√ issuer cert is issued by the trust root

linkerd-api
-----------
√ control plane pods are ready
√ control plane self-check
√ [kubernetes] control plane can talk to Kubernetes
√ [prometheus] control plane can talk to Prometheus
√ tap api service is running

linkerd-version
---------------
√ can determine the latest version
√ cli is up-to-date

control-plane-version
---------------------
√ control plane is up-to-date
√ control plane and cli versions match

Status check results are √
{{</ output >}}

1.  Check the components that are installed and running:

        kubectl -n linkerd get deploy

    {{< output >}}
NAME                     READY   UP-TO-DATE   AVAILABLE   AGE
linkerd-controller       1/1     1            1           106s
linkerd-destination      1/1     1            1           106s
linkerd-grafana          1/1     1            1           104s
linkerd-identity         1/1     1            1           107s
linkerd-prometheus       1/1     1            1           105s
linkerd-proxy-injector   1/1     1            1           104s
linkerd-sp-validator     1/1     1            1           104s
linkerd-tap              1/1     1            1           103s
linkerd-web              1/1     1            1           105s
{{</ output >}}

    You can read about what each of these services do in the Linkerd [architechure documentation](https://linkerd.io/2/reference/architecture/#control-plane).

### The Data Plane

Each control plane component has a proxy installed in the respective Pod and therefore is also part of the data plane. This enables you to take a look at what's going on with the dashboard and other tools that Linkerd offers.

### The Dashboards

Linkerd comes with two dashboards, a Linkerd dashboard and [Grafana](https://grafana.com) dashboard; both are backed by metrics data gathered by [Prometheus](https://prometheus.io).

1.  Start and view the Linkerd standalone dashboard that runs in the browser.

        linkerd dasboard &

    {{< output >}}
Linkerd dashboard available at:
http://localhost:50750
Grafana dashboard available at:
http://localhost:50750/grafana
Opening Linkerd dashboard in the default browser
{{</ output >}}

    - This command sets up a port forward from the `linkerd-web` Pod.

    - If you want to expose the dashboard for others to use as well, you need to add an [ingress controller](/docs/kubernetes/how-to-deploy-nginx-ingress-on-linode-kubernetes-engine/).

1.  The dashboard opens in the browser. If it does not, you can access it by going to http://localhost:50750:

    ![Linkerd Browser Dashboard](linkerd-browser-dashboard.png "Linkerd Browser Dashboard")

1.  The Grafana dashboard is included with Linkerd and is available at `http://localhost:50750/grafana`.

    ![Grafana Browser Dashboard](linkerd-grafana-dashboard.png "Grafana Browser Dashboard")

1.  You can checkout the traffic that the dashboard is using by running the following command:

        linkerd -n linkerd top deploy/linkerd-web

    To see what the other Pods are doing, replace `linkerd-web` with a different Pod name, for example, to check on Grafana, use, `linkerd-grafana`.

## Install Demo Application (Optional)

   Deploy Drupal on the cluster and monitor using Linkerd2.
1. Create a `drupal` folder on the local machine to contain the `kustamization.yaml`, `mysql-deployment.yaml`, and `drupal-deployment.yaml` files.

        sudo mkdir drupal

1. Create a `kustomization.yaml` file in the `drupal` folder. Open a text editor and create the file with a secret generator and resource config files for single-instance MySQL, and a single-instance Drupal deployments. In the following file replace `MySQLpassword` with the password that you want to use to access MySQL:

      {{< file "/drupal/kustomization.yaml" >}}
secretGenerator:
- name: mysql-pass
  literals:
  - password=MySQLpassword
resources:
  - mysql-deployment.yaml
  - drupal-deployment.yaml
{{< /file >}}

1. Create a  `mysql-deployment.yaml` file in the `drupal` folder. Open a text editor and create a manifest file that describes a single-instance deployment of MySQL.

      {{< file "/drupal/mysql-deployment.yaml" >}}
apiVersion: v1
kind: Service
metadata:
  name: drupal-mysql
  labels:
    app: drupal
spec:
  ports:
    - protocol: TCP
      port: 3306
  selector:
    app: drupal
    tier: mysql
  type: LoadBalancer
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-claim
  labels:
    app: drupal
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: linode-block-storage
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql
  labels:
    app: drupal
spec:
  selector:
    matchLabels:
      app: drupal
      tier: mysql
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: drupal
        tier: mysql
    spec:
      containers:
        - image: mysql:latest
          name: mysql
          env:
            - name: MYSQL_ROOT_PASSWORD
              valueFrom:
                 secretKeyRef:
                  name: mysql-pass
                  key: password
          ports:
            - containerPort: 3306
              name: mysql
              protocol: TCP
                  volumeMounts:
            - name: mysql
              mountPath: /var/lib/mysql
      volumes:
        - name: mysql
          persistentVolumeClaim:
            claimName: mysql-claim

{{< /file >}}

1. Create a  `drupal-deployment.yaml` file in the `drupal` folder. Open a text editor and create a manifest file that describes a single-instance deployment of Drupal.

      {{< file "/drupal/drupal-deployment.yaml" >}}
---
apiVersion: v1
kind: Service
metadata:
  name: drupal
  labels:
    app: drupal
spec:
  ports:
    - protocol: TCP
      port: 80
  selector:
    app: drupal
  type: LoadBalancer
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: drupal-claim
  labels:
    app: drupal
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: linode-block-storage
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: drupal
  labels:
    app: drupal
spec:
  selector:
    matchLabels:
      app: drupal
      tier: frontend
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: drupal
        tier: frontend
    spec:
      containers:
        - image: drupal:latest
          name: drupal
          ports:
            - containerPort: 80
              name: drupal
          volumeMounts:
            - name: drupal
              mountPath: /var/www/html/modules
              subPath: modules
            - name: drupal
              mountPath: /var/www/html/profiles
              subPath: profiles
            - name: drupal
              mountPath: /var/www/html/themes
              subPath: themes
      volumes:
        - name: drupal
          persistentVolumeClaim:
            claimName: drupal-claim

{{< /file >}}

1.  Deploy Drupal on K3s cluster. The `kustomization.yaml` file contains all the resources required to deploy Drupal and MySQL.

        kubectl apply -k ./

    The output is similar to:

        secret/mysql-pass-g764cgb8b9 created
        service/drupal-mysql created
        service/drupal configured
        deployment.apps/drupal created
        deployment.apps/mysql created
        persistentvolumeclaim/drupal-claim created
        persistentvolumeclaim/mysql-claim created

1.  Verify that the Secret exists:

        kubectl get secrets

    The output is similar to:

        NAME                    TYPE                                  DATA   AGE
        default-token-8wt7g     kubernetes.io/service-account-token   3      44m
        mysql-pass-g764cgb8b9   Opaque                                1      24m

1.  Verify that a PersistentVolume is dynamically provisioned:

        kubectl get pvc

    The output is similar to:

        NAME           STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
        mysql-claim    Bound    pvc-13c1086a-0a4a-4945-b473-0110ebd09725   10Gi       RWO            local-path     24m
        drupal-claim   Bound    pvc-8d907b17-72c0-4c5b-a3c4-d87e170ad87d   10Gi       RWO            local-path     24m

1.  Verify that the Pod is running:

        kubectl get pods

    The output is similar to:

        NAME                      READY   STATUS    RESTARTS   AGE
        svclb-drupal-qcnrk        1/1     Running   0          25m
        svclb-drupal-9kdgk        1/1     Running   0          25m
        mysql-6bf46f94bf-tcgs2    1/1     Running   0          13m
        drupal-77f665d45b-568tl   1/1     Running   0          5m1s

1.  Verify that the Service is running:

        kubectl get services drupal

    The output is similar to:

        NAME     TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)        AGE
        drupal   LoadBalancer   10.0.0.89      192.0.2.3       8081:31809/TCP   33m

1.  Type the IP address listed under `EXTERNAL_IP` and append the port number `:8081`. The Drupal configuration page appears.

1.  Add Linkerd to the Drupal application with the following command:

        kubectl get -n default deploy -o yaml | linkerd inject - | kubectl apply -f -

    This gathers all the deployments in the `default` namespace, pipes the manifest to `linkerd inject` which adds it's proxies to the container specs, and then applies it to the cluster.

1.  Issue the following command to verify that the proxies have been applied:

        linkerd -n default check --proxy

    {{< output >}}
kubernetes-api
--------------
√ can initialize the client
√ can query the Kubernetes API

kubernetes-version
------------------
√ is running the minimum Kubernetes API version
√ is running the minimum kubectl version

linkerd-existence
-----------------
√ 'linkerd-config' config map exists
√ heartbeat ServiceAccount exist
√ control plane replica sets are ready
√ no unschedulable pods
√ controller pod is running
√ can initialize the client
√ can query the control plane API

linkerd-config
--------------
√ control plane Namespace exists
√ control plane ClusterRoles exist
√ control plane ClusterRoleBindings exist
√ control plane ServiceAccounts exist
√ control plane CustomResourceDefinitions exist
√ control plane MutatingWebhookConfigurations exist
√ control plane ValidatingWebhookConfigurations exist
√ control plane PodSecurityPolicies exist

linkerd-identity
----------------
√ certificate config is valid
√ trust roots are using supported crypto algorithm
√ trust roots are within their validity period
√ trust roots are valid for at least 60 days
√ issuer cert is using supported crypto algorithm
√ issuer cert is within its validity period
√ issuer cert is valid for at least 60 days
√ issuer cert is issued by the trust root

linkerd-identity-data-plane
---------------------------
√ data plane proxies certificate match CA

linkerd-api
-----------
√ control plane pods are ready
√ control plane self-check
√ [kubernetes] control plane can talk to Kubernetes
√ [prometheus] control plane can talk to Prometheus
√ tap api service is running

linkerd-version
---------------
√ can determine the latest version
√ cli is up-to-date

linkerd-data-plane
------------------
√ data plane namespace exists
√ data plane proxies are ready
√ data plane proxy metrics are present in Prometheus
√ data plane is up-to-date
√ data plane and cli versions match

Status check results are √
{{</ output >}}

1.  You can get live traffic metrics by running the following command:

        linkerd -n default stat deploy

    {{< output >}}
NAME       MESHED   SUCCESS      RPS   LATENCY_P50   LATENCY_P95   LATENCY_P99   TCP_CONN
drupal      1/1         -     -             -             -             -          -
mysql       1/1         -     -             -             -             -          -
{{</ output >}}

1.  To dig deeper, try the following commands:

        linkerd -n default top deploy
        linkerd -n default
        tap deploy/web


    You can also use the graphical dashboards view to show you these items in the browser.
