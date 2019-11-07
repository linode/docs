---
author:
  name: Linode
  email: docs@linode.com
description: 'Istio is a service mesh and a platform with its own API and feature set that can help you run a distributed microservice architecture. Istio is a tool that you can deploy with few to no code changes to your application allowing you to harness its power without disrupting your development cycle. In conjunction with Kubernetes, Istio provides you with insights into your cluster leading to more control over your applications.'
keywords: ['kuberenetes','istio','container','helm', 'k8s']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-11-07
modified_by:
  name: Linode
title: "How to Deploy Istio with Kubernetes"
h1_title: "Deploying Istio with Kubernetes"
contributor:
  name: Linode
external_resources:
- '[Istio](https://istio.io)'
- '[Istio Mesh Security](https://istio.io/docs/ops/security/)'
- '[Istio Troubleshooting](https://istio.io/docs/ops/troubleshooting/)'
---

[Istio](https://istio.io) is a service mesh, or a network of microservices, that can handle tasks such as load balancing, service-to-service authentication, monitoring, and more. It does this by deploying sidecar proxies to intercept network data, which causes minimal disruption to your current application.

The Istio platform provides its own API and feature set to help you run a distributed microservice architecture. You can deploy Istio with few to no code changes to your applications allowing you to harness its power without disrupting your development cycle. In conjunction with Kubernetes, Istio provides you with insights into your cluster leading to more control over your applications.

In this guide you will complete the following tasks:

- [Create a Kubernetes Cluster](#create-your-kubernetes-cluster) and [Install Helm, and Tiller](#install-helm-and-tiller)
- [Install Istio with Helm Charts](#install-helm-charts)
- [Setup Envoy Proxies](#set-up-envoy-proxies)
- [Install the Istio Bookinfo App](#install-the-istio-bookinfo-app)
- [Visualize data with Istio's Grafana addon](#visualizations-with-grafana)

{{< caution >}}
This guide’s example instructions will create several billable resources on your Linode account. If you do not want to keep using the example cluster that you create, be sure to delete it when you have finished the guide.

If you remove the resources afterward, you will only be billed for the hour(s) that the resources were present on your account. Consult the [Billing and Payments](https://www.linode.com/docs/platform/billing-and-support/billing-and-payments/)  guide for detailed information about how hourly billing works and for a table of plan pricing.
{{</ caution >}}

## Before You Begin

Familiarize yourself with Kubernetes using our series [A Beginner's Guide to Kubernetes](/docs/applications/containers/kubernetes/beginners-guide-to-kubernetes/) and [Advantages of Using Kubernetes](/docs/applications/containers/kubernetes/kubernetes-use-cases/).

## Create Your Kubernetes Cluster

There are many ways to create a Kubernetes cluster. This guide will use the Linode k8s-alpha CLI.

1. To set it up the Linode k8s-alpha CLI, see the
[How to Deploy Kubernetes on Linode with the k8s-alpha CLI](https://www.linode.com/docs/applications/containers/kubernetes/how-to-deploy-kubernetes-on-linode-with-k8s-alpha-cli/) guide and stop before the "Create a Cluster" section.

1. Now that your Linode K8s-alpha CLI is set up, You are ready to create your Kubernetes cluster. You will need **3 worker nodes** and **one master** for this guide. Create your cluster using the following command:

        linode-cli k8s-alpha create istio-cluster --node-type g6-standard-2 --nodes 3 --master-type g6-standard-2 --region us-east --ssh-public-key $HOME/.ssh/id_rsa.pub

1.  After the cluster is created you should see output with a similar success message:

    {{< output >}}
Apply complete! Resources: 5 added, 0 changed, 0 destroyed.
Switched to context "istio-cluster-ka4OLOcgqHw@istio-cluster".
Your cluster has been created and your kubectl context updated.

Try the following command:
kubectl get pods --all-namespaces

Come hang out with us in #linode on the Kubernetes Slack! http://slack.k8s.io/
{{</ output >}}

1.  If you visit the [Linode Cloud Manager](https://cloud.linode.com/), you will see your newly created cluster nodes on the Linodes listing page.

### Install Helm and Tiller

Follow the instructions in the [How to Install Apps on Kubernetes with Helm](https://www.linode.com/docs/applications/containers/kubernetes/how-to-install-apps-on-kubernetes-with-helm/) guide to install Helm and Tiller on your cluster. Stop before the section on "Using Helm Charts to Install Apps".

## Install Istio

- For Linux or macOS users, use curl to pull the Istio project files. Even though you will use Helm charts to deploy Istio to your cluster, pulling the Istio project files will give you access to the sample `Bookinfo` application that comes bundled with this installation.

        curl -L https://git.io/getLatestIstio | ISTIO_VERSION=1.3.3 sh -

- If you are using Windows, you will need to go to Istio's [Github repo](https://github.com/istio/istio/releases) to find the download. There you will find the latest releases for Windows, Linux, and macOS.

{{< note >}}
Issuing the `curl` command will create a new directory, `istio-1.3.3`, in your current working directory. Ensure you move into the directory where you'd like to store your Istio project files before issuing the `curl` command.
{{< /note >}}

### Install Helm Charts

1.  Add the Istio Helm repo:

        helm repo add istio.io https://storage.googleapis.com/istio-release/releases/1.3.2/charts/

1.  Update the helm repo listing:

        helm repo update

1.  Verify that you have the repo:

        helm repo list | grep istio.io

    The output should be similar to the following:

    {{< output >}}
istio.io	https://storage.googleapis.com/istio-release/releases/1.3.2/charts/
    {{< /output >}}

1.  Install Istio's [Custom Resource Definitions](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/#customresourcedefinitions) (CRD) with the helm chart. This command also creates a pod namespace called `istio-system` which you will continue to use for the remainder of this guide.

        helm install --name istio-init --namespace istio-system istio.io/istio-init

     {{< output >}}
NAME:   istio-init
LAST DEPLOYED: Fri Oct 18 10:24:24 2019
NAMESPACE: istio-system
STATUS: DEPLOYED

RESOURCES:
==> v1/ClusterRole
NAME                     AGE
istio-init-istio-system  0s

==> v1/ClusterRoleBinding
NAME                                        AGE
istio-init-admin-role-binding-istio-system  0s

==> v1/ConfigMap
NAME          DATA  AGE
istio-crd-10  1     0s
istio-crd-11  1     0s
istio-crd-12  1     0s

==> v1/Job
NAME                     COMPLETIONS  DURATION  AGE
istio-init-crd-10-1.3.2  0/1          0s        0s
istio-init-crd-11-1.3.2  0/1          0s        0s
istio-init-crd-12-1.3.2  0/1          0s        0s

==> v1/Pod(related)
NAME                           READY  STATUS             RESTARTS  AGE
istio-init-crd-10-1.3.2-d4gdf  0/1    ContainerCreating  0         0s
istio-init-crd-11-1.3.2-h8l58  0/1    ContainerCreating  0         0s
istio-init-crd-12-1.3.2-v9777  0/1    ContainerCreating  0         0s

==> v1/ServiceAccount
NAME                        SECRETS  AGE
istio-init-service-account  1        0s
{{< /output >}}

1.  Verify that all CRDs were successfully installed:

        kubectl get crds | grep 'istio.io' | wc -l

    You should see the following output:

    {{< output >}}
23
{{< /output >}}

       If the number is less, you may need to wait a few moments for the resources to finish being created.

1.  Install the Helm chart for Istio. There are [many installation options available](https://istio.io/docs/reference/config/installation-options/) for Istio. For this guide, the command enables Grafana, which you will use later to visualize your cluster's data.

        helm install --name istio --namespace istio-system istio.io/istio --set grafana.enabled=true

     {{< disclosure-note "Full output of the Helm chart Istio installation" >}}
{{< output >}}
NAME:   istio
LAST DEPLOYED: Fri Oct 18 10:28:40 2019
NAMESPACE: istio-system
STATUS: DEPLOYED

RESOURCES:
==> v1/ClusterRole
NAME                                     AGE
istio-citadel-istio-system               43s
istio-galley-istio-system                43s
istio-grafana-post-install-istio-system  43s
istio-mixer-istio-system                 43s
istio-pilot-istio-system                 43s
istio-reader                             43s
istio-sidecar-injector-istio-system      43s
prometheus-istio-system                  43s

==> v1/ClusterRoleBinding
NAME                                                    AGE
istio-citadel-istio-system                              43s
istio-galley-admin-role-binding-istio-system            43s
istio-grafana-post-install-role-binding-istio-system    43s
istio-mixer-admin-role-binding-istio-system             43s
istio-multi                                             43s
istio-pilot-istio-system                                43s
istio-sidecar-injector-admin-role-binding-istio-system  43s
prometheus-istio-system                                 43s

==> v1/ConfigMap
NAME                                                                DATA  AGE
istio                                                               2     43s
istio-galley-configuration                                          1     44s
istio-grafana                                                       2     43s
istio-grafana-configuration-dashboards-citadel-dashboard            1     44s
istio-grafana-configuration-dashboards-galley-dashboard             1     43s
istio-grafana-configuration-dashboards-istio-mesh-dashboard         1     44s
istio-grafana-configuration-dashboards-istio-performance-dashboard  1     43s
istio-grafana-configuration-dashboards-istio-service-dashboard      1     44s
istio-grafana-configuration-dashboards-istio-workload-dashboard     1     44s
istio-grafana-configuration-dashboards-mixer-dashboard              1     44s
istio-grafana-configuration-dashboards-pilot-dashboard              1     44s
istio-grafana-custom-resources                                      2     44s
istio-security-custom-resources                                     2     43s
istio-sidecar-injector                                              2     43s
prometheus                                                          1     43s

==> v1/Deployment
NAME                    READY  UP-TO-DATE  AVAILABLE  AGE
grafana                 0/1    1           0          42s
istio-citadel           1/1    1           1          42s
istio-galley            0/1    1           0          42s
istio-ingressgateway    0/1    1           0          42s
istio-pilot             0/1    1           0          42s
istio-policy            0/1    1           0          42s
istio-sidecar-injector  0/1    1           0          42s
istio-telemetry         1/1    1           1          42s
prometheus              0/1    1           0          42s

==> v1/Pod(related)
NAME                                     READY  STATUS             RESTARTS  AGE
grafana-575c7c4784-ffq79                 0/1    ContainerCreating  0         42s
istio-citadel-746b4cc66c-2zq2d           1/1    Running            0         42s
istio-galley-668765c7dc-r7w49            0/1    ContainerCreating  0         42s
istio-ingressgateway-76ff5cf54b-n5xzl    0/1    Running            0         42s
istio-pilot-7b6f4b4498-pfcm5             0/2    ContainerCreating  0         42s
istio-policy-8449665784-xzn7m            0/2    ContainerCreating  0         42s
istio-sidecar-injector-7488c45bcb-mzfgz  0/1    Running            0         42s
istio-telemetry-56595ccd89-qxtb7         2/2    Running            1         42s
prometheus-5679cb4dcd-8fsf4              0/1    ContainerCreating  0         42s

==> v1/Role
NAME                      AGE
istio-ingressgateway-sds  43s

==> v1/RoleBinding
NAME                      AGE
istio-ingressgateway-sds  43s

==> v1/Service
NAME                    TYPE          CLUSTER-IP      EXTERNAL-IP      PORT(S)                                                                                                                                     AGE
grafana                 ClusterIP     10.111.223.85   <none>           3000/TCP                                                                                                                                    43s
istio-citadel           ClusterIP     10.96.57.68     <none>           8060/TCP,15014/TCP                                                                                                                          42s
istio-galley            ClusterIP     10.111.114.219  <none>           443/TCP,15014/TCP,9901/TCP                                                                                                                  43s
istio-ingressgateway    LoadBalancer  10.104.28.12    104.237.148.149  15020:31189/TCP,80:31380/TCP,443:31390/TCP,31400:31400/TCP,15029:30450/TCP,15030:32554/TCP,15031:30659/TCP,15032:32716/TCP,15443:32438/TCP  43s
istio-pilot             ClusterIP     10.97.46.215    <none>           15010/TCP,15011/TCP,8080/TCP,15014/TCP                                                                                                      42s
istio-policy            ClusterIP     10.104.45.158   <none>           9091/TCP,15004/TCP,15014/TCP                                                                                                                42s
istio-sidecar-injector  ClusterIP     10.110.88.188   <none>           443/TCP,15014/TCP                                                                                                                           42s
istio-telemetry         ClusterIP     10.103.18.40    <none>           9091/TCP,15004/TCP,15014/TCP,42422/TCP                                                                                                      42s
prometheus              ClusterIP     10.105.19.61    <none>           9090/TCP                                                                                                                                    42s

==> v1/ServiceAccount
NAME                                    SECRETS  AGE
istio-citadel-service-account           1        43s
istio-galley-service-account            1        43s
istio-grafana-post-install-account      1        43s
istio-ingressgateway-service-account    1        43s
istio-mixer-service-account             1        43s
istio-multi                             1        43s
istio-pilot-service-account             1        43s
istio-security-post-install-account     1        43s
istio-sidecar-injector-service-account  1        43s
prometheus                              1        43s

==> v1alpha2/attributemanifest
NAME        AGE
istioproxy  41s
kubernetes  41s

==> v1alpha2/handler
NAME           AGE
kubernetesenv  41s
prometheus     41s

==> v1alpha2/instance
NAME                  AGE
attributes            41s
requestcount          41s
requestduration       41s
requestsize           41s
responsesize          41s
tcpbytereceived       41s
tcpbytesent           41s
tcpconnectionsclosed  41s
tcpconnectionsopened  41s

==> v1alpha2/rule
NAME                     AGE
kubeattrgenrulerule      41s
promhttp                 41s
promtcp                  41s
promtcpconnectionclosed  41s
promtcpconnectionopen    41s
tcpkubeattrgenrulerule   41s

==> v1alpha3/DestinationRule
NAME             AGE
istio-policy     42s
istio-telemetry  42s

==> v1beta1/ClusterRole
NAME                                      AGE
istio-security-post-install-istio-system  43s

==> v1beta1/ClusterRoleBinding
NAME                                                   AGE
istio-security-post-install-role-binding-istio-system  43s

==> v1beta1/MutatingWebhookConfiguration
NAME                    AGE
istio-sidecar-injector  41s

==> v1beta1/PodDisruptionBudget
NAME                    MIN AVAILABLE  MAX UNAVAILABLE  ALLOWED DISRUPTIONS  AGE
istio-galley            1              N/A              0                    44s
istio-ingressgateway    1              N/A              0                    44s
istio-pilot             1              N/A              0                    44s
istio-policy            1              N/A              0                    44s
istio-sidecar-injector  1              N/A              0                    44s
istio-telemetry         1              N/A              0                    44s

==> v2beta1/HorizontalPodAutoscaler
NAME                  REFERENCE                        TARGETS        MINPODS  MAXPODS  REPLICAS  AGE
istio-ingressgateway  Deployment/istio-ingressgateway  <unknown>/80%  1        5        1         42s
istio-pilot           Deployment/istio-pilot           <unknown>/80%  1        5        1         41s
istio-policy          Deployment/istio-policy          <unknown>/80%  1        5        1         42s
istio-telemetry       Deployment/istio-telemetry       <unknown>/80%  1        5        1         42s


NOTES:
Thank you for installing Istio.

Your release is named Istio.

To get started running application with Istio, execute the following steps:
1. Label namespace that application object will be deployed to by the following command (take default namespace as an example)

$ kubectl label namespace default istio-injection=enabled
$ kubectl get namespace -L istio-injection

2. Deploy your applications

$ kubectl apply -f <your-application>.yaml

For more information on running Istio, visit:
https://istio.io/

{{< /output >}}
{{< /disclosure-note >}}

1.  Verify that the Istio services and Grafana are running:

        kubectl get svc -n istio-system

    The output should be similar to the following:

    {{< output >}}
NAME                     TYPE           CLUSTER-IP       EXTERNAL-IP    PORT(S)                                                                                                                                      AGE
grafana                  ClusterIP      10.111.81.20     <none>         3000/TCP                                                                                                                                     4m6s
istio-citadel            ClusterIP      10.100.103.171   <none>         8060/TCP,15014/TCP                                                                                                                           4m6s
istio-galley             ClusterIP      10.104.173.105   <none>         443/TCP,15014/TCP,9901/TCP                                                                                                                   4m7s
istio-ingressgateway     LoadBalancer   10.97.218.128    23.92.23.198   15020:30376/TCP,80:31380/TCP,443:31390/TCP,31400:31400/TCP,15029:31358/TCP,15030:30826/TCP,15031:30535/TCP,15032:31728/TCP,15443:31970/TCP   4m6s
istio-pilot              ClusterIP      10.108.36.63     <none>         15010/TCP,15011/TCP,8080/TCP,15014/TCP                                                                                                       4m6s
istio-policy             ClusterIP      10.111.111.45    <none>         9091/TCP,15004/TCP,15014/TCP                                                                                                                 4m6s
istio-sidecar-injector   ClusterIP      10.96.23.143     <none>         443/TCP,15014/TCP                                                                                                                            4m5s
istio-telemetry          ClusterIP      10.103.224.18    <none>         9091/TCP,15004/TCP,15014/TCP,42422/TCP                                                                                                       4m6s
prometheus               ClusterIP      10.96.246.56     <none>         9090/TCP                                                                                                                                     4m6s
{{</ output >}}

1.  You can also see the pods that are running by using this command:

        kubectl get pods -n istio-system

    The output will look similar to this:

    {{< output >}}
NAME                                      READY   STATUS      RESTARTS   AGE
grafana-575c7c4784-v2vj2                  1/1     Running     0          4m54s
istio-citadel-746b4cc66c-jnjx9            1/1     Running     0          4m53s
istio-galley-668765c7dc-vt88j             1/1     Running     0          4m54s
istio-ingressgateway-76ff5cf54b-dmksf     1/1     Running     0          4m54s
istio-init-crd-10-1.3.2-t4sqg             0/1     Completed   0          11m
istio-init-crd-11-1.3.2-glr72             0/1     Completed   0          11m
istio-init-crd-12-1.3.2-82gn4             0/1     Completed   0          11m
istio-pilot-7b6f4b4498-vtb8s              2/2     Running     0          4m53s
istio-policy-8449665784-8hjsw             2/2     Running     4          4m54s
istio-sidecar-injector-7488c45bcb-b4qz4   1/1     Running     0          4m53s
istio-telemetry-56595ccd89-jcc9s          2/2     Running     5          4m54s
prometheus-5679cb4dcd-pbg6m               1/1     Running     0          4m53s
{{< /output >}}

1.  Before moving on, be sure that all pods are in the `Running` or `Completed` status.

    {{< note >}}
If you need to troubleshoot, you can check a specific pod by using `kubectl`, remembering that you set the namespace to `istio-system`:

    kubectl describe pods pod_name -n pod_namespace

And check the logs by using:

    kubectl logs pod_name -n pod_namespace
    {{< /note >}}

### Set up Envoy Proxies

1.  Istio's service mesh runs by employing *sidecar proxies*. You will enable them by injecting them into the containers. This command is using the `default` namespace which is where you will be deploying the `Bookinfo` application.

        kubectl label namespace default istio-injection=enabled

    {{< note >}}
This deployment uses automatic sidecar injection. Automatic injection can be disabled and [manual injection](https://istio.io/docs/setup/additional-setup/sidecar-injection/#manual-sidecar-injection) enabled during installation via `istioctl`. If you disabled automatic injection during installation, use the following command to modify the `bookinfo.yaml` file before deploying the application:

    kubectl apply -f <(istioctl kube-inject -f ~/istio-1.3.3/samples/bookinfo/platform/kube/bookinfo.yaml)
{{< /note >}}

1.  Verify that the `ISTIO-INJECTION` was `enabled` for the `default` namespace:

        kubectl get namespace -L istio-injection

    You will get a similar output:

    {{< output >}}
NAME           STATUS   AGE    ISTIO-INJECTION
default        Active   101m   enabled
istio-system   Active   37m
kube-public    Active   101m
kube-system    Active   101m
{{< /output>}}

## Install the Istio Bookinfo App

The Bookinfo app is a sample application that comes packaged with Istio. It features four microservices in four different languages that are all separate from Istio itself. The application is a simple single page website that displays a "book store" catalog page with one book, it's details, and some reviews. The microservices are:

- `productpage` is written in Python and calls `details` and `reviews` to populate the page.
- `details` is written in Ruby and contains the book information.
- `reviews` is written in Java and contains book reviews and calls `ratings`.
- `ratings` is written in Node.js and contains book ratings. There are three versions of this microservice in the application. A different version is called each time the page is refreshed.

1.  Navigate to the directory where you [installed Istio](#install-istio).

1.  The `bookinfo.yaml` file is the application manifest. It specifies all the service and deployment objects for the application. Here is just the `productpage` section of this file; feel free to browse the entire file:

    {{< file "~/istio-1.3.3/samples/bookinfo/platform/kube/bookinfo.yaml" >}}
...

apiVersion: v1
kind: Service
metadata:
  name: productpage
  labels:
    app: productpage
    service: productpage
spec:
  ports:
  - port: 9080
    name: http
  selector:
    app: productpage
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: bookinfo-productpage
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: productpage-v1
  labels:
    app: productpage
    version: v1
spec:
  replicas: 1
  selector:
    matchLabels:
      app: productpage
      version: v1
  template:
    metadata:
      labels:
        app: productpage
        version: v1
    spec:
      serviceAccountName: bookinfo-productpage
      containers:
      - name: productpage
        image: docker.io/istio/examples-bookinfo-productpage-v1:1.15.0
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 9080
---
{{< /file >}}

1.  Start the `Bookinginfo` application with the following command:

        kubectl apply -f ~/istio-1.3.3/samples/bookinfo/platform/kube/bookinfo.yaml

    The following output results:

    {{< output >}}
service/details created
serviceaccount/bookinfo-details created
deployment.apps/details-v1 created
service/ratings created
serviceaccount/bookinfo-ratings created
deployment.apps/ratings-v1 created
service/reviews created
serviceaccount/bookinfo-reviews created
deployment.apps/reviews-v1 created
jdeployment.apps/reviews-v2 created
deployment.apps/reviews-v3 created
service/productpage created
serviceaccount/bookinfo-productpage created
deployment.apps/productpage-v1 created
{{< /output >}}

1.  Check that all the services are up and running:

        kubectl get services

    The output will look similar to the following:

    {{< output >}}
    NAME          TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
details       ClusterIP   10.97.188.175   <none>        9080/TCP   3m
kubernetes    ClusterIP   10.96.0.1       <none>        443/TCP    154m
productpage   ClusterIP   10.110.184.42   <none>        9080/TCP   2m37s
ratings       ClusterIP   10.102.206.99   <none>        9080/TCP   2m59s
reviews       ClusterIP   10.106.21.117   <none>        9080/TCP   2m59s
{{< /output >}}

1.  Check that the pods are all up:

        kubectl get pods

    The expected output should look similar, with all pods running:

    {{< output >}}
NAME                              READY   STATUS    RESTARTS   AGE
details-v1-68fbb76fc-qfpbd        2/2     Running   0          4m48s
productpage-v1-6c6c87ffff-th52x   2/2     Running   0          4m15s
ratings-v1-7bdfd65ccc-z8grs       2/2     Running   0          4m48s
reviews-v1-5c5b7b9f8d-6xljj       2/2     Running   0          4m41s
reviews-v2-569796655b-x2n4v       2/2     Running   0          4m30s
reviews-v3-844bc59d88-pwl6b       2/2     Running   0          4m30s
{{< /output >}}

    {{< note >}}
If you do not see all pods running right away, you may need to wait a few moments for them to complete the initialization process.
{{< /note >}}

1.  Check that the `Bookinfo` application is running. This command will pull the title tag and contents from the `/productpage` running on the `ratings` pod:

        kubectl exec -it $(kubectl get pod -l app=ratings -o jsonpath='{.items[0].metadata.name}') -c ratings -- curl productpage:9080/productpage | grep -o "<title>.*</title>"

    The expected output will look like this:

    {{< output >}}
&lt;title&gt;Simple Bookstore App&lt;/title&gt;
{{< /output >}}

### Open the Istio Gateway

When checking the services in the previous section, you may have noticed none had external IPs. This is because Kubernetes services are private by default. You will need to open a gateway in order to access the app from the web browser. To do this you will use an Istio Gateway.

Here are the contents of the `bookinfo-gateway.yaml` file that you will use to open the gateway:

{{< file "~/istio-1.3.3/samples/bookinfo/networking/bookinfo-gateway.yaml" >}}
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: bookinfo-gateway
spec:
  selector:
    istio: ingressgateway # use istio default controller
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "*"
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: bookinfo
spec:
  hosts:
  - "*"
  gateways:
  - bookinfo-gateway
  http:
  - match:
    - uri:
        exact: /productpage
    - uri:
        prefix: /static
    - uri:
        exact: /login
    - uri:
        exact: /logout
    - uri:
        prefix: /api/v1/products
    route:
    - destination:
        host: productpage
        port:
          number: 9080
{{< /file >}}

  - The `Gateway` section sets up the `server` and specifies the `port` and `protocol` that will be opened through the gateway. Note that the `name` must match Istio's [named service ports standardization scheme](https://istio.io/docs/setup/additional-setup/requirements/).
  - In the `Virtual Service` section, the `http` field defines how HTTP traffic will be routed, and the `destination` field says where requests are routed.

1.  Apply the ingress gateway with the following command:

        kubectl apply -f ~/istio-1.3.3/samples/bookinfo/networking/bookinfo-gateway.yaml

    You should see the following output:

    {{< output >}}
gateway.networking.istio.io/bookinfo-gateway created
virtualservice.networking.istio.io/bookinfo created
{{< /output >}}

1.  Confirm that the gateway is open:

        kubectl get gateway

    You should see the following output:

    {{< output >}}
NAME               AGE
bookinfo-gateway   1m
{{< /output >}}

1. Access your ingress gateway's external IP. This IP will correspond to the value listed under `EXTERNAL-IP`.

        kubectl get svc istio-ingressgateway -n istio-system

    The output should resemble the following. In the example, the external IP is `192.0.2.0`. You will need this IP address in the next section to access your Bookinfo app.

    {{< output >}}
NAME                   TYPE           CLUSTER-IP      EXTERNAL-IP    PORT(S)                                                                                                                                      AGE
istio-ingressgateway   LoadBalancer   10.97.218.128   192.0.2.0   15020:30376/TCP,80:31380/TCP,443:31390/TCP,31400:31400/TCP,15029:31358/TCP,15030:30826/TCP,15031:30535/TCP,15032:31728/TCP,15443:31970/TCP   21h
{{< /output >}}

### Apply Default Destination Rules

Destination rules specify named service subsets and give them routing rules to control traffic to the different instances of your services.

1. Apply destination rules to your cluster:

        kubectl apply -f ~/istio-1.3.3/samples/bookinfo/networking/destination-rule-all.yaml

    The output will appear as follows:

    {{< output >}}
destinationrule.networking.istio.io/productpage created
destinationrule.networking.istio.io/reviews created
destinationrule.networking.istio.io/ratings created
destinationrule.networking.istio.io/details created
{{< /output >}}

1.  To view all the applied rules issue the following command:

        kubectl get destinationrules -o yaml

## Visualizations with Grafana

1.  In a new terminal window that you can leave running, open the port for Grafana:

        kubectl -n istio-system port-forward $(kubectl -n istio-system get pod -l app=grafana -o jsonpath='{.items[0].metadata.name}') 3000:3000 &

1. Create an SSH tunnel from your local machine to your Linode so that you can access the localhost of your Linode, entering your credentials as prompted:

        ssh -L 3000:localhost:3000 <username>@<ipaddress>

    Once this is completed, visit the following URL in your web browser to access your *Mesh Dashboard*:

        http://localhost:3000/dashboard/db/istio-mesh-dashboard

    {{< note >}}
 In this example, you will use an SSH tunnel to access your cluster's running Grafana service. You could set up an ingress gateway for your Grafana service in the same way you did for the Bookinfo app. Those steps are not covered in this guide.
    {{</ note >}}

1.  You will see the Mesh Dashboard. There will be no data available yet.

    ![Istio Dashboard](istio-dashboard.png)

1.  Send data by visiting a product page, replacing `192.0.2.0` with the value for your ingress gateway's external IP:

        http://192.0.2.0/productpage

    Refresh the page a few times to generate some traffic.

1.  Return to the dashboard and refresh the page to see the data.

    ![Istio Dashboard Refreshed](istio-dashboard-refreshed.png)

    The *Mesh Dashboard* displays a general overview of Istio service mesh, the services that are running, and their workloads.

1.  To view a specific service or workload you can click on them from the *HTTP/GRPC Workloads* list. Under the *Service* column, click `productpage.default.svc.cluster.local` from the *HTTP/GRPC Workloads* list.

    ![Istio Service List Mesh Dashboard](istio-mesh-dashboard-service-list.png)

1.  This will open a Service dashboard specific to this service.

    ![Istio Product Service Detail Dashboard](istio-product-page-service-detail.png)

1.  Feel free to explore the other Grafana dashboards for more metrics and data. You can access all the dashboards from the dropdown menu at the top left of the screen.

## Removing Clusters and Deployments

If you at any time need to remove the resources created when following this guide, enter the following commands, confirming any prompts that appear:

    helm delete istio-init
    helm delete istio
    linode-cli k8s-alpha delete istio-cluster