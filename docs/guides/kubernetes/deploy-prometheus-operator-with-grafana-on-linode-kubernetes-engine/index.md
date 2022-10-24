---
slug: deploy-prometheus-operator-with-grafana-on-linode-kubernetes-engine
author:
  name: Ben Bigger
  email: docs@linode.com
description: 'Learn how to quickly deploy Prometheus Operator monitoring stack including Grafana on Linode Kubernetes Engine.'
og_description: 'Great monitoring means fast issue resolution. Learn how to quickly deploy Prometheus Operator monitoring stack including Grafana on Linode Kubernetes Engine.'
keywords: ['kubernetes', 'lke', 'prometheus', 'grafana']
tags: ["monitoring","kubernetes","container"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-07-29
image: DeployPromOp_Graf_LKE.png
modified_by:
  name: Linode
title: "How to Deploy Prometheus Operator and Grafana on LKE"
h1_title: "Deploying Prometheus Operator and Grafana on LKE (Linode Kubernetes Engine)"
external_resources:
- '[Prometheus Operator Helm Chart on Github](https://github.com/helm/charts/tree/master/stable/prometheus-operator): Useful for reviewing configuration parameters and troubleshooting.'
- '[Prometheus Documentation](https://prometheus.io/docs/introduction/overview/)'
- '[Alertmanager Documentation](https://prometheus.io/docs/alerting/latest/alertmanager/)'
- '[Grafana Tutorials](https://grafana.com/tutorials/)'
aliases: ['/kubernetes/deploy-prometheus-operator-with-grafana-on-linode-kubernetes-engine/']
---

In this guide, you will deploy the [Prometheus Operator](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack) to your Linode Kubernetes Engine (LKE) cluster using [Helm](https://helm.sh/), either as:

*   a [minimal deployment](#prometheus-operator-minimal-deployment) using `kubectl` port-forward for local access to your monitoring interfaces, or
*   a [deployment with HTTPS and basic auth](#prometheus-operator-deployment-with-https-and-basic-auth) using the NGINX Ingress Controller and HTTPS for secure, path-based, public access to your monitoring interfaces.

## The Prometheus Operator Monitoring Stack

When administrating any system, effective monitoring tools can empower users to perform quick and effective issue diagnosis and resolution. This need for monitoring solutions has led to the development of several prominent open source tools designed to solve problems associated with monitoring diverse systems.

Since its release in 2016, [Prometheus](https://prometheus.io/) has become a leading monitoring tool for containerized environments including Kubernetes. [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) is often used with Prometheus to send and manage alerts with tools such as [Slack](https://slack.com/). [Grafana](https://grafana.com/), an open source visualization tool with a robust web interface, is commonly deployed along with Prometheus to provide centralized visualization of system metrics.

The community-supported [Prometheus Operator Helm Chart](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack) provides a complete monitoring stack including each of these tools along with [Node Exporter](https://github.com/helm/charts/tree/master/stable/prometheus-node-exporter) and [kube-state-metrics](https://github.com/helm/charts/tree/master/stable/kube-state-metrics), and is designed to provide robust Kubernetes monitoring in its default configuration.

While there are several options for deploying the Prometheus Operator, using [Helm](https://helm.sh/), a Kubernetes "package manager," to deploy the community-supported the Prometheus Operator enables you to:

*   Control the components of your monitoring stack with a single configuration file.
*   Easily manage and upgrade your deployments.
*   Utilize out-of-the-box Grafana interfaces built for Kubernetes monitoring.

## Before You Begin

{{< note >}}
This guide was written using [Kubernetes version 1.17](https://v1-17.docs.kubernetes.io/docs/setup/release/notes/).
{{< /note >}}

1.  [Deploy an LKE Cluster](/docs/guides/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/). This guide was written using an example node pool with three [2 GB Linodes](https://www.linode.com/pricing/). Depending on the workloads you will be deploying on your cluster, you may consider using Linodes with more available resources.

1.  Install [Helm 3](/docs/kubernetes/how-to-install-apps-on-kubernetes-with-helm-3/#install-helm) to your local environment.

1.  Install [kubectl](/docs/guides/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#install-kubectl) to your local environment and [connect to your cluster](/docs/guides/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#connect-to-your-lke-cluster-with-kubectl).

1.  Create the `monitoring` namespace on your LKE cluster:

        kubectl create namespace monitoring

1.  Create a directory named `lke-monitor` to store all of your Helm values and Kubernetes manifest files and move into the new directory:

        mkdir ~/lke-monitor && cd ~/lke-monitor

1.  Add the stable Helm charts repository to your Helm repos:

        helm repo add stable https://charts.helm.sh/stable

1.  Update your Helm repositories:

        helm repo update

1.  (Optional) For [public access with HTTPS and basic auth](#prometheus-operator-deployment-with-https-and-basic-auth) configured for your web interfaces of your monitoring tools:

    *   Purchase a domain name from a reliable domain registrar and configure your registrar to [use Linode's nameservers](/docs/guides/dns-manager/#use-linodes-name-servers-with-your-domain) with your domain. Using Linode's DNS Manager, [create a new Domain](/docs/guides/dns-manager/#add-a-domain) for the one that you have purchased.

    *   Ensure that `htpasswd` is installed to your local environment. For many systems, this tool has already been installed. Debian and Ubuntu users will have to install the apache2-utils package with the following command:

            sudo apt install apache2-utils

## Prometheus Operator Minimal Deployment

In this section, you will complete a minimal deployment of the Prometheus Operator for individual/local access with `kubectl` [Port-Forward](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#port-forward). If you require your monitoring interfaces to be publicly accessible over the internet, you can skip to the following section on completing a [Prometheus Operator Deployment with HTTPS and Basic Auth](#prometheus-operator-deployment-with-https-and-basic-auth).

### Deploy Prometheus Operator

In this section, you will create a Helm chart values file and use it to deploy Prometheus Operator to your LKE cluster.

1.  Using the text editor of your choice, create a file named `values.yaml` in the `~/lke-monitor` directory and save it with the configurations below. Since the control plane is Linode-managed, as part of this step we will also disable metrics collection for the control plane component:

    {{< caution >}}
The below configuration will establish persistent data storage with three separate 10GB [Block Storage Volumes](https://www.linode.com/products/block-storage/) for Prometheus, Alertmanager, and Grafana. Because the Prometheus Operator deploys as [StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/), these Volumes and their associated [Persistent Volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) resources must be deleted manually if you later decide to tear down this Helm release.
    {{< /caution >}}

    {{< file "~/lke-monitor/values.yaml" yaml >}}
# Prometheus Operator Helm Chart values for Linode Kubernetes Engine minimal deployment
prometheus:
  prometheusSpec:
    storageSpec:
      volumeClaimTemplate:
        spec:
          storageClassName: linode-block-storage-retain
          resources:
            requests:
              storage: 10Gi

alertmanager:
  alertmanagerSpec:
    storage:
      volumeClaimTemplate:
        spec:
          storageClassName: linode-block-storage-retain
          resources:
            requests:
              storage: 10Gi

grafana:
  persistence:
    enabled: true
    storageClassName: linode-block-storage-retain
    size: 10Gi

# Disable metrics for Linode-managed Kubernetes control plane elements
kubeEtcd:
  enabled: false

kubeControllerManager:
  enabled: false

kubeScheduler:
  enabled: false
    {{< /file >}}

1.  Export an environment variable to store your Grafana admin password:

    {{< note >}}
Replace `prom-operator` in the below command with a secure password and save the password for later reference.
    {{< /note >}}

        export GRAFANA_ADMINPASSWORD="prom-operator"

1.  Using Helm, deploy a Prometheus Operator release labeled `lke-monitor` in the `monitoring` namespace on your LKE cluster with the settings established in your `values.yaml` file:

        helm install \
        lke-monitor stable/kube-prometheus-stack\
        -f ~/lke-monitor/values.yaml \
        --namespace monitoring \
        --set grafana.adminPassword=$GRAFANA_ADMINPASSWORD \
        --set prometheusOperator.createCustomResource=false \
        --repo https://prometheus-community.github.io/helm-charts

    {{< note >}}
You can safely ignore messages similar to `manifest_sorter.go:192: info: skipping unknown hook: "crd-install"` as discussed in this [Github issues thread](https://github.com/helm/charts/issues/19452).

Alternatively, you can add `--set prometheusOperator.createCustomResource=false` to the above command to prevent the message from appearing.
    {{< /note >}}

1.  Verify that the Prometheus Operator has been deployed to your LKE cluster and its components are running and ready by checking the pods in the `monitoring` namespace:

        kubectl -n monitoring get pods

    You should see a similar output to the following:

    {{< output >}}
NAME                                                     READY   STATUS    RESTARTS   AGE
alertmanager-lke-monitor-alertmanager-0           2/2     Running   0          12m
lke-monitor-grafana-7d5949ddf-kdbdk               3/3     Running   0          12m
lke-monitor-kube-state-metrics-6c5d86887c-x2hp8   1/1     Running   0          21m
lke-monitor-operator-957f88688-ztbr7              1/1     Running   0          21m
lke-monitor-prometheus-node-exporter-5wk87        1/1     Running   0          21m
lke-monitor-prometheus-node-exporter-m8j2b        1/1     Running   0          21m
lke-monitor-prometheus-node-exporter-wz8v5        1/1     Running   0          21m
prometheus-lke-monitor-prometheus-0               2/2     Running   0          12m
    {{< /output >}}

### Access Monitoring Interfaces with Port-Forward

1.  List the services running in the `monitoring` namespace and review their respective ports:

        kubectl -n monitoring get svc

    You should see an output similar to the following:

    {{< output >}}
NAME                                   TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)                      AGE
alertmanager-operated                  ClusterIP   None             <none>        9093/TCP,9094/TCP,9094/UDP   21m
lke-monitor-alertmanager               ClusterIP   10.128.42.223    <none>        9093/TCP                     22m
lke-monitor-stack-grafana              ClusterIP   10.128.19.98     <none>        80/TCP                       22m
lke-monitor-kube-state-metrics         ClusterIP   10.128.74.245    <none>        8080/TCP                     22m
lke-monitor-operator                   ClusterIP   10.128.150.125   <none>        443/TCP                      22m
lke-monitor-prometheus                 ClusterIP   10.128.202.139   <none>        9090/TCP                     22m
lke-monitor-prometheus-node-exporter   ClusterIP   10.128.212.80    <none>        9100/TCP                     22m
prometheus-operated                              ClusterIP   None             <none>        9090/TCP                     21m

    {{< /output >}}

    From the above output, the resource services you will access have the corresponding ports:

    | Resource     | Service Name                         | Port |
    | ------------ | -------------------------------------| ---- |
    | Prometheus   | lke&#8209;monitor&#8209;prometheus   | 9090 |
    | Alertmanager | lke&#8209;monitor&#8209;alertmanager | 9093 |
    | Grafana      | lke&#8209;monitor&#8209;grafana      | 80   |

1.  Use `kubectl` [port-forward](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#port-forward) to open a connection to a service, then access the service's interface by entering the corresponding address in your web browser:

    {{< note >}}
Press **control+C** on your keyboard to terminate a port-forward process after entering any of the following commands.
    {{< /note >}}

    *   To provide access to the **Prometheus** interface at the address `127.0.0.1:9090` in your web browser, enter:

            kubectl -n monitoring \
            port-forward \
            svc/lke-monitor-prometheus-ope-prometheus \
            9090

    *   To provide access to the **Alertmanager** interface at the address `127.0.0.1:9093` in your web browser, enter:

            kubectl -n monitoring \
            port-forward \
            svc/lke-monitor-prometheus-ope-alertmanager  \
            9093

    *   To provide access to the **Grafana** interface at the address `127.0.0.1:8081` in your web browser, enter:

            kubectl -n monitoring \
            port-forward \
            svc/lke-monitor-grafana  \
            8081:80

        Log in with the username `admin` and the password you exported as `$GRAFANA_ADMINPASSWORD`. The Grafana dashboards are accessible at **Dashboards > Manage** from the left navigation bar.

## Prometheus Operator Deployment with HTTPS and Basic Auth

{{< note >}}
Before you start on this section, ensure that you have completed all of the steps in [Before you Begin](#before-you-begin).
{{< /note >}}

This section will show you how to install and configure the necessary components for secure, path-based, public access to the Prometheus, Alertmanager, and Grafana interfaces using the domain you have [configured for use with Linode](#before-you-begin).

An [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) is used to provide external routes, via HTTP or HTTPS, to your cluster's services. An *Ingress Controller*, like [the NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/deploy/#using-helm), fulfills the requirements presented by the Ingress using a load balancer.

To enable HTTPS on your monitoring interfaces, you will create a Transport Layer Security (TLS) certificate from the [Let's Encrypt](https://letsencrypt.org/) certificate authority (CA) using the [ACME protocol](https://tools.ietf.org/html/rfc8555). This will be facilitated by [cert-manager](https://cert-manager.io/docs/), the native Kubernetes certificate management controller.

While the Grafana interface is natively password-protected, the Prometheus and Alertmanager interfaces must be secured by other means. This guide covers basic authentication configurations to secure the Prometheus and Alertmanager interfaces.

If you are completing this section of the guide after completing a [Prometheus Operator Minimal Deployment](#prometheus-operator-minimal-deployment), you can use Helm to upgrade your release and maintain the persistent data storage for your monitoring stack.

### Install the NGINX Ingress Controller

In this section, you will install the NGINX Ingress Controller using Helm, which will create a [NodeBalancer](https://www.linode.com/products/nodebalancers/) to handle your cluster's traffic.

1.  Install the Google stable NGINX Ingress Controller Helm chart:

        helm install nginx-ingress stable/nginx-ingress

1.  Access your NodeBalancer's assigned external IP address.

        kubectl -n default get svc -o wide nginx-ingress-controller

    The command will return a similar output to the following:

    {{< output >}}
NAME                       TYPE           CLUSTER-IP      EXTERNAL-IP    PORT(S)                      AGE   SELECTOR
nginx-ingress-controller   LoadBalancer   10.128.41.200   192.0.2.0      80:30889/TCP,443:32300/TCP   59s   app.kubernetes.io/component=controller,app=nginx-ingress,release=nginx-ingress
    {{< /output >}}

1.  Copy the IP address of the `EXTERNAL IP` field and navigate to Linode's DNS Manager and [create an A record](/docs/guides/dns-manager/#add-dns-records) using this external IP address and a hostname value corresponding to the subdomain you plan to use with your domain.

Now that your NGINX Ingress Controller has been deployed and your domain's A record has been updated, you are ready to enable HTTPS on your monitoring interfaces.

### Install cert-manager

{{< note >}}
Before performing the commands in this section, ensure that your DNS has had time to propagate across the internet. You can query the status of your DNS by using the following command, substituting `example.com` for your domain (including a subdomain if you have configured one).

    dig +short example.com

If successful, the output should return the IP address of your NodeBalancer.
{{< /note >}}

1.  Install cert-manager's CRDs.

        kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v1.8.0/cert-manager.crds.yaml

1.  Add the Helm repository which contains the cert-manager Helm chart.

        helm repo add jetstack https://charts.jetstack.io

1.  Update your Helm repositories.

        helm repo update

1.  Install the cert-manager Helm chart. These basic configurations should be sufficient for many use cases, however, additional cert-manager configurable parameters can be found in [cert-manager's official documentation](https://hub.helm.sh/charts/jetstack/cert-manager).

        helm install \
        cert-manager jetstack/cert-manager \
        --namespace cert-manager --create-namespace \
        --version v1.8.0

1.  Verify that the corresponding cert-manager pods are running and ready.

        kubectl -n cert-manager get pods

    You should see a similar output:

    {{< output >}}
NAME                                       READY   STATUS    RESTARTS   AGE
cert-manager-749df5b4f8-mc9nj              1/1     Running   0          19s
cert-manager-cainjector-67b7c65dff-4fkrw   1/1     Running   0          19s
cert-manager-webhook-7d5d8f856b-4nw9z      1/1     Running   0          19s
    {{< /output >}}

### Create a ClusterIssuer Resource

Now that cert-manager is installed and running on your cluster, you will need to create a ClusterIssuer resource which defines which CA can create signed certificates when a certificate request is received. A ClusterIssuer is not a namespaced resource, so it can be used by more than one namespace.

1.  Using the text editor of your choice, create a file named `acme-issuer-prod.yaml` with the example configurations, replacing the value of `email` with your own email address for the ACME challenge:

    {{< file "~/lke-monitor/acme-issuer-prod.yaml" yaml>}}
apiVersion: cert-manager.io/v1alpha2
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    email: admin@example.com
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-secret-prod
    solvers:
    - http01:
        ingress:
          class: nginx
    {{< /file >}}

    - This manifest file creates a ClusterIssuer resource that will register an account on an ACME server. The value of `spec.acme.server` designates Let's Encrypt's production ACME server, which should be trusted by most browsers.

        {{< note >}}
Let's Encrypt provides a staging ACME server that can be used to test issuing trusted certificates, while not worrying about hitting [Let's Encrypt's production rate limits](https://letsencrypt.org/docs/rate-limits/). The staging URL is `https://acme-staging-v02.api.letsencrypt.org/directory`.
        {{< /note >}}

    - The value of `privateKeySecretRef.name` provides the name of a secret containing the private key for this user's ACME server account (this is tied to the email address you provide in the manifest file). The ACME server will use this key to identify you.
    - To ensure that you own the domain for which you will create a certificate, the ACME server will issue a challenge to a client. cert-manager provides two options for solving challenges, [`http01`](https://cert-manager.io/docs/configuration/acme/http01/) and [`DNS01`](https://cert-manager.io/docs/configuration/acme/dns01/). In this example, the `http01` challenge solver will be used and it is configured in the `solvers` array. cert-manager will spin up *challenge solver* Pods to solve the issued challenges and use Ingress resources to route the challenge to the appropriate Pod.

1.  Create the ClusterIssuer resource:

        kubectl apply -f ~/lke-monitor/acme-issuer-prod.yaml

### Create a Certificate Resource

After you have a ClusterIssuer resource, you can create a Certificate resource. This will describe your [x509 public key certificate](https://en.wikipedia.org/wiki/X.509) and will be used to automatically generate a [CertificateRequest](https://cert-manager.io/docs/concepts/certificaterequest/) which will be sent to your ClusterIssuer.

1.  Using the text editor of your choice, create a file named `certificate-prod.yaml` with the example configurations:

    {{< note >}}
Replace the value of `spec.dnsNames` with the domain, including subdomains, that you will use to host your monitoring interfaces.
    {{< /note >}}

    {{< file "~/lke-monitor/certificate-prod.yaml" yaml >}}
apiVersion: cert-manager.io/v1alpha2
kind: Certificate
metadata:
  name: prometheus-operator-prod
  namespace: monitoring
spec:
  secretName: letsencrypt-secret-prod
  duration: 2160h # 90d
  renewBefore: 360h # 15d
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
  - example.com
    {{< /file >}}

    {{< note >}}
The configurations in this example create a Certificate in the `monitoring` namespace that is valid for 90 days and renews 15 days before expiry.
    {{< /note >}}

1.  Create the Certificate resource:

        kubectl apply -f ~/lke-monitor/certificate-prod.yaml

1.  Verify that the Certificate has been successfully issued:

        kubectl -n monitoring get certs

    When your certificate is ready, you should see a similar output:

    {{< output >}}
NAME          READY   SECRET                    AGE
lke-monitor   True    letsencrypt-secret-prod   33s
    {{< /output >}}

Next, you will create the necessary resources for basic authentication of the Prometheus and Alertmanager interfaces.

### Configure Basic Auth Credentials

In this section, you will use `htpasswd` to generate credentials for basic authentication and create a Kubernetes [Secret](https://kubernetes.io/docs/concepts/configuration/secret/), which will then be applied to your Ingress configuration to secure access to your monitoring interfaces.

1.  Create a basic authentication password file for the user `admin`:

        htpasswd -c ~/lke-monitor/auth admin

    Follow the prompts to create a secure password, then store your password securely for future reference.

1. Create a Kubernetes Secret for the `monitoring` namespace using the file you created above:

        kubectl -n monitoring create secret generic basic-auth --from-file=~/lke-monitor/auth

1.  Verify that the `basic-auth` secret has been created on your LKE cluster:

        kubectl -n monitoring get secret basic-auth

    You should see a similar output to the following:

    {{< output >}}
NAME         TYPE     DATA   AGE
basic-auth   Opaque   1      81s
    {{< /output >}}

All the necessary components are now in place to be able to enable HTTPS on your monitoring interfaces. In the next section, you will complete the steps needed to deploy Prometheus Operator.

### Deploy or Upgrade Prometheus Operator

In this section, you will create a Helm chart values file and use it to deploy Prometheus Operator to your LKE cluster.

1.  Using the text editor of your choice, create a file named `values-https-basic-auth.yaml` in the `~/lke-monitor` directory and save it with the configurations below. Since the control plane is Linode-managed, as part of this step we will also disable metrics collection for the control plane component:

    {{< note >}}
Replace all instances of `example.com` below with the [domain you have configured](#before-you-begin), including subdomains, for use with this guide.
    {{< /note >}}

    {{< caution >}}
The below configuration will establish persistent data storage with three separate 10GB [Block Storage Volumes](https://www.linode.com/products/block-storage/) for Prometheus, Alertmanager, and Grafana. Because the Prometheus Operator deploys as [StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/), these Volumes and their associated [Persistent Volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) resources must be deleted manually if you later decide to tear down this Helm release.
    {{< /caution >}}

    {{< file "~/lke-monitor/values-https-basic-auth.yaml" yaml >}}
# Helm chart values for Prometheus Operator with HTTPS and basic auth
prometheus:
  ingress:
    enabled: true
    annotations:
      kubernetes.io/ingress.class: nginx
      nginx.ingress.kubernetes.io/rewrite-target: /$2
      cert-manager.io/cluster-issuer: letsencrypt-prod
      nginx.ingress.kubernetes.io/auth-type: basic
      nginx.ingress.kubernetes.io/auth-secret: basic-auth
      nginx.ingress.kubernetes.io/auth-realm: 'Authentication Required'
    hosts:
    - example.com
    paths:
    - /prometheus(/|$)(.*)
    tls:
    - secretName: lke-monitor-tls
      hosts:
      - example.com
  prometheusSpec:
    routePrefix: /
    externalUrl: https://example.com/prometheus
    storageSpec:
      volumeClaimTemplate:
        spec:
          storageClassName: linode-block-storage-retain
          resources:
            requests:
              storage: 10Gi

alertmanager:
  ingress:
    enabled: true
    annotations:
      kubernetes.io/ingress.class: nginx
      nginx.ingress.kubernetes.io/rewrite-target: /$2
      cert-manager.io/cluster-issuer: letsencrypt-prod
      nginx.ingress.kubernetes.io/auth-type: basic
      nginx.ingress.kubernetes.io/auth-secret: basic-auth
      nginx.ingress.kubernetes.io/auth-realm: 'Authentication Required'
    hosts:
    - example.com
    paths:
    - /alertmanager(/|$)(.*)
    tls:
    - secretName: lke-monitor-tls
      hosts:
      - example.com
  alertmanagerSpec:
    routePrefix: /
    externalUrl: https://example.com/alertmanager
    storage:
      volumeClaimTemplate:
        spec:
          storageClassName: linode-block-storage-retain
          resources:
            requests:
              storage: 10Gi

grafana:
  persistence:
    enabled: true
    storageClassName: linode-block-storage-retain
    size: 10Gi
  ingress:
    enabled: true
    annotations:
      kubernetes.io/ingress.class: nginx
      nginx.ingress.kubernetes.io/rewrite-target: /$2
      nginx.ingress.kubernetes.io/auth-type: basic
      nginx.ingress.kubernetes.io/auth-secret: basic-auth
      nginx.ingress.kubernetes.io/auth-realm: 'Authentication Required'
    hosts:
    - example.com
    path: /grafana(/|$)(.*)
    tls:
    - secretName: lke-monitor-tls
      hosts:
      - example.com
  grafana.ini:
    server:
      domain: example.com
      root_url: "%(protocol)s://%(domain)s/grafana/"
      enable_gzip: "true"

# Disable control plane metrics
kubeEtcd:
  enabled: false

kubeControllerManager:
  enabled: false

kubeScheduler:
  enabled: false
    {{< /file >}}

1.  Export an environment variable to store your Grafana admin password:

    {{< note >}}
Replace `prom-operator` in the below command with a secure password and save the password for later reference.
    {{< /note >}}

        export GRAFANA_ADMINPASSWORD="prom-operator"

1.  Using Helm, deploy a Prometheus Operator release labeled `lke-monitor` in the `monitoring` namespace on your LKE cluster with the settings established in your `values-https-basic-auth.yaml` file:

    {{< note >}}
If you have already deployed a Prometheus Operator release, you can upgrade it by replacing `helm install` with `helm upgrade` in the below command.
    {{< /note >}}

        helm install \
        lke-monitor stable/kube-prometheus-stack \
        -f ~/lke-monitor/values-https-basic-auth.yaml \
        --namespace monitoring \
        --set grafana.adminPassword=$GRAFANA_ADMINPASSWORD

    Once completed, you will see output similar to the following:
     {{< output >}}
NAME: lke-monitor
LAST DEPLOYED: Mon Jul 27 17:03:46 2020
NAMESPACE: monitoring
STATUS: deployed
REVISION: 1
NOTES:
The Prometheus Operator has been installed. Check its status by running:
  kubectl --namespace monitoring get pods -l "release=lke-monitor"

Visit https://github.com/coreos/prometheus-operator for instructions on how
to create & configure Alertmanager and Prometheus instances using the Operator.
{{< /output >}}
1.  Verify that the Prometheus Operator has been deployed to your LKE cluster and its components are running and ready by checking the pods in the `monitoring` namespace:

        kubectl -n monitoring get pods

    You should see a similar output to the following, confirming that you are ready to access your monitoring interfaces using your domain:

    {{< output >}}
NAME                                                        READY   STATUS    RESTARTS   AGE
alertmanager-lke-monitor-alertmanager-0           2/2     Running   0          12m
lke-monitor-grafana-7d5949ddf-kdbdk               3/3     Running   0          12m
lke-monitor-kube-state-metrics-6c5d86887c-x2hp8   1/1     Running   0          21m
lke-monitor-operator-957f88688-ztbr7              1/1     Running   0          21m
lke-monitor-prometheus-node-exporter-5wk87        1/1     Running   0          21m
lke-monitor-prometheus-node-exporter-m8j2b        1/1     Running   0          21m
lke-monitor-prometheus-node-exporter-wz8v5        1/1     Running   0          21m
prometheus-lke-monitor-prometheus-0               2/2     Running   0          12m

    {{< /output >}}

### Access Monitoring Interfaces from your Domain

Your monitoring interfaces are now publicly accessible with HTTPS and basic auth from the [domain you have configured](#before-you-begin) for use with this guide at the following paths:

| Resource     | Domain and path          |
| ------------ | ------------------------ |
| Prometheus   | `example.com/prometheus`   |
| Alertmanager | `example.com/alertmanager` |
| Grafana      | `example.com/grafana`      |

When accessing an interface for the first time, log in as `admin` with the password you configured for [basic auth credentials](#configure-basic-auth-credentials).

When accessing the Grafana interface, you will then log in again as `admin` with the password you exported as `$GRAFANA_ADMINPASSWORD` on your local environment. The Grafana dashboards are accessible at **Dashboards > Manage** from the left navigation bar.
