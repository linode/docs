---
author:
    name: Rajakavitha Kodhandapani
    email: docs@linode.com
description: 'K3s is lightweight Kubernetes, which is easy to install. This guide provides instructions to deploy a highly available, certified Kubernetes distribution designed for production workloads, and install an application on a K3s cluster.'
og_description: 'K3s is lightweight Kubernetes, which is easy to install. This guide provides instructions to deploy a highly available, certified Kubernetes distribution designed for production workloads, and install an application on a K3s cluster.'
keywords: ["drupal", "cms", "apache", "php", "content management system", "drupal 8", "debian 10"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-04-30
modified_by:
  name: Linode
title: How to Deploy K3s on Linode
h1_title: Deploying K3s on Linode
external_resources:
  - '[Rancher Official Docs](https://rancher.com/docs/k3s/latest/en/)'
  - '[Kubernetes Official Docs] (https://kubernetes.io/docs/)'
---

K3s is lightweight Kubernetes, which is easy to install. It is a fully compliant Kubernetes distribution with an embedded SQLite database as the default datastore and supports external datastore such as PostgreSQL, MySQL, and etcd. K3s includes a local storage provider, a service load balancer, a Helm controller, and the Traefik ingress controller. It also automates and manages complex cluster operations such as distributing certificates. In other words, you can run a highly available, certified Kubernetes distribution designed for production workloads on [nanodes](https://www.linode.com/products/nanodes/) as well.

  {{< note >}}
  You can deploy a K3s cluster on just about any flavor of Linux. However, K3s is officially tested on Ubuntu 16.04 and Ubuntu 18.04. If you are deploying K3s on CentOS where SELinux is enabled by default, then you must ensure that proper SELinux policies are installed. For more information, see [SELinux support](https://rancher.com/docs/k3s/latest/en/advanced/#experimental-selinux-support).{{< /note >}}

## In this Guide

  This guide provides instructions to:

  - [Install K3s Server](#install-k3s-server).
  - [Install K3s Agent](#install-k3s-agent).
  - [Connect Remotely to the K3s Cluster](#connect-remotely-to-the-k3s-cluster)
  - [Deploy Drupal on K3s Cluster](#deploy-drupal-on-k3s-cluster).


## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for [setting your Linode's hostname](/docs/getting-started/#set-the-hostname) and [timezone](/docs/getting-started/#set-the-timezone) for two [nanodes](https://www.linode.com/products/nanodes/) running Ubuntu 18.04 to deploy a K3s cluster with one master or server node and one worker or agent node.

1.  Follow our [Securing Your Server](/docs/security/securing-your-server) guide to [create a standard user account](/docs/security/securing-your-server/#add-a-limited-user-account), [harden SSH access](/docs/security/securing-your-server/#harden-ssh-access), [remove unnecessary network services](/docs/security/securing-your-server/#remove-unused-network-facing-services) and [create firewall rules](/docs/security/securing-your-server/#configure-a-firewall) for K3s [networking requirements](https://rancher.com/docs/k3s/latest/en/installation/installation-requirements/#networking).

    {{< content "limited-user-note-shortguide" >}}

1.  Ensure that your system is up to date:

        sudo apt update && sudo apt upgrade

1. Install <abbr title="kubectl is a command line tool used to interact with the Kubernetes cluster.">kubectl</abbr> on your local machine. Fore more information see, [How to Install kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

## Install K3s Server

1.  Connect to the Linode where you want to install K3s server:

        ssh example_user@192.0.2.0

1.  Configure the environment variables that specify the permissions on the K3s configuration file and the name of the node while installing K3s server:

        export K3S_KUBECONFIG_MODE="644"
        export K3S_NODE_NAME="master"

1.  Execute the following command to install a K3s server:

        curl -sfL https://get.k3s.io | sh -

1.  Verify the status of the K3s server:

        sudo systemctl status k3s

1.  Retrieve the access token to connect a K3s agent node to K3s server node:

        sudo cat /var/lib/rancher/k3s/server/node-token

    The output is similar to:

        K10dfd118c594632bc958abd741c51e23105054714394527d08d72134c17b4d0dbc::server:71d5e8e3423e57fbe010563e03c0e350

1.  Copy the access token and save it in a secure location.


## Install K3s Agent

1.  Connect to the Linode where you want to install K3s agent:

        ssh example_user@192.0.2.1

1.  Configure the environment variables for the K3s configuration file. These variables specify the name of the node, the url to communicate with K3s server, the access token to connect to K3s server while installing K3s agent. In the following commands replace `192.0.2.0` with the IP address of the K3s server and `K10dfd118c594632bc958abd741c51e23105054714394527d08d72134c17b4d0dbc::server:71d5e8e3423e57fbe010563e03c0e350` with the access token of the K3s server:

        export K3S_KUBECONFIG_MODE="644"
        export K3S_NODE_NAME="agent1"
        export K3S_URL="https://192.0.2.0:6443"
        export K3S_TOKEN="K10dfd118c594632bc958abd741c51e23105054714394527d08d72134c17b4d0dbc::server:71d5e8e3423e57fbe010563e03c0e350"

1.  Execute the following command to install a K3s server:

        curl -sfL https://get.k3s.io | sh -

1.  Verify the status of the K3s agent:

        sudo systemctl status k3s-agent

## Connect Remotely to the K3s Cluster

1.  Copy the K3s config file from the master node to the local machine. In the following command replace `192.0.2.0` with the IP address of the K3s server:

        scp example_user@192.0.2.0:/etc/rancher/k3s/k3s.yaml ~/.kube/config

1.  Edit the `config` file. Open the `config` file that is located at `/.kube` with a text editor and replace `127.0.0.1` with the IP address of the K3s server and save the file.

1.  Connect to the K3s cluster from the local machine using `kubectl` to get the details of the nodes in the cluster.

        kubectl get nodes

    The output is similar to:

        NAME           STATUS   ROLES    AGE   VERSION
        master         Ready    master   12m   v1.17.4+k3s.1
        agent1         Ready    <none>   10m   v1.17.4+k3s.1

## Deploy Drupal on K3s Cluster

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
---
apiVersion: v1
kind: Service
metadata:
  name: drupal-mysql
  labels:
    app: drupal
spec:
  ports:
    - port: 3306
  selector:
    app: drupal
    tier: mysql
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
      port: 8081
      targetPort: 80
  selector:
    app: drupal
    tier: frontend
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

1.  Type the IP address listed under `EXTERNAL_IP` and append the port number `8081`. The Drupal configuration page appears.
