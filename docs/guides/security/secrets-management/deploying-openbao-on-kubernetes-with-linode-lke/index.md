---
slug: deploying-openbao-on-kubernetes-with-linode-lke
title: "Deploying OpenBao on Kubernetes With Linode LKE"
description: "Two to three sentences describing your guide."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2025-04-25
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

This guide walks through how to deploy [OpenBao on Kubernetes](https://openbao.org/docs/platform/k8s/) with Linode LKE using the [OpenBao Helm chart](https://github.com/openbao/openbao-helm).

## Prerequisites

To follow along in this walkthrough, you’ll need the following:

* A [Linode account](https://www.linode.com/cfe)  
* A [Linode API token (personal access token)](https://www.linode.com/docs/products/platform/accounts/guides/manage-api-tokens/)  
* The [Linode CLI](https://www.linode.com/docs/products/tools/cli/guides/install/) installed and configured

## Step 1: Provision a Kubernetes Cluster

While there are several ways to create a Kubernetes cluster on Linode, this guide uses the [Linode CLI](https://github.com/linode/linode-cli) to provision resources.

1. Use the Linode CLI (linode) to see available Kubernetes versions:

| $ linode lke versions-list  ┌───────┐ │ id      │ ├───────┤ │ 1.31    │ ├───────┤ │ 1.30    │ └───────┘ |
| :---- |

It’s generally recommended to provision the latest version of Kubernetes unless specific requirements dictate otherwise.

2. Use the following command to list available Linode plans, including plan ID, pricing, and performance details. For more detailed pricing information, see [Akamai Connected Cloud: Pricing](https://www.linode.com/pricing/):

| $ linode linodes types |
| :---- |

3. The examples in this guide use the **g6-standard-2** Linode, which features two CPU cores and 4 GB of memory. Run the following command to display detailed information in JSON for this Linode plan:

| $ linode linodes types \--label "Linode 4GB" \--json \--pretty\[  {    "addons": {...},     "class": "standard",    "disk": 81920,    "gpus": 0,    "id": "g6-standard-2",    "label": "Linode 4GB",    "memory": 4096,    "network\_out": 4000,    "price": {      "hourly": 0.036,      "monthly": 24.0    },    "region\_prices": \[...\],    "successor": null,    "transfer": 4000,    "vcpus": 2  }\] |
| :---- |

4. View available regions with the regions list command:

| $ linode regions list |
| :---- |

5. With a Kubernetes version and Linode type selected, use the following command to create a cluster named openbao-cluster in the us-mia (Miami, FL) region with three nodes and auto-scaling. Replace openbao-cluster and us-mia with a cluster label and region of your choosing, respectively:

| $ linode lke cluster-create \\  \--label openbao-cluster \\  \--k8s\_version 1.31 \\  \--region us-mia \\  \--node\_pools '\[{    "type": "g6-standard-2",    "count": 3,    "autoscaler": {      "enabled": true,      "min": 3,      "max": 8    }  }\]' |
| :---- |

Once your cluster is successfully created, you should see output similar to the following:

| Using default values: {}; use the \--no-defaults flag to disable defaults\+------------------+--------+-------------+ |      label       | region | k8s\_version | \+------------------+--------+-------------+ | openbao-cluster  | us-mia |        1.31 | \+------------------+--------+-------------+ |
| :---- |

## Step 2: Access the Kubernetes Cluster

To access your cluster, fetch the cluster credentials in the form of a kubeconfig file.

1. Use the following command to retrieve the cluster’s ID:

| $ CLUSTER\_ID=$(linode lke clusters-list \--json | \\    jq \-r \\       '.\[\] | select(.label \== "openbao-cluster") | .id') |
| :---- |

2. Create a hidden .kube folder in your user’s home directory:

| $ mkdir \~/.kube |
| :---- |

3. Retrieve the kubeconfig file and save it to \~/.kube/lke-config:

| $ linode lke kubeconfig-view \--json "$CLUSTER\_ID" | \\     jq \-r '.\[0\].kubeconfig' | \\     base64 \--decode \> \~/.kube/lke-config |
| :---- |

4. Once you have the kubeconfig file saved, access your cluster by using kubectl and specifying the file:

| $ kubectl get no \--kubeconfig \~/.kube/lke-config  NAME                            STATUS   ROLES    AGE   VERSION lke328534-526858-193216620000   Ready    \<none\>   54s   v1.31.0 lke328534-526858-1bacd9c70000   Ready    \<none\>   60s   v1.31.0 lke328534-526858-2c4e9cda0000   Ready    \<none\>   28s   v1.31.0 |
| :---- |

| Note: Alternatively, to avoid specifying \--kubeconfig \~/.kube/lke-config with every kubectl command, you can set an environment variable for your current terminal window session. $ export KUBECONFIG=\~/.kube/lke-config  Then run: $ kubectl get no  |
| :---- |

## Step 3: Set Up OpenBao on LKE

The official [Helm chart](https://github.com/openbao/openbao-helm) provided by the OpenBao development team is the suggested method for installing OpenBao on K8s. [Helm](https://helm.sh/) is a package manager for Kubernetes and helps manage software extensions for the system. Helm organizes these packages via “charts”. To install the OpenBao Helm chart into the Kubernetes cluster above (i.e., the cluster associated with your current .kube config), first add the extension to the local Helm installation via:

| $ helm repo add openbao https://openbao.github.io/openbao-helm "openbao" has been added to your repositories |
| :---- |

Next, install the Helm chart onto the cluster:

| $ helm install openbao openbao/openbao NAME: openbaoLAST DEPLOYED: Tue Jan 28 12:55:42 2025NAMESPACE: defaultSTATUS: deployedREVISION: 1NOTES:Thank you for installing OpenBao\!Now that you have deployed OpenBao, you should look over the docs on usingOpenBao with Kubernetes available here:https://openbao.org/docs/Your release is named openbao. To learn more about the release, try:  $ helm status openbao  $ helm get manifest openbao |
| :---- |

This Helm chart defaults to Kubernetes OpenBao's standalone mode, which means a single OpenBao server with a file storage backend is set up in the cluster. However, other profiles, such as a development server and a high-availability system, are also available in this chart. For more information on these other profiles, see the documentation. 

As mentioned in the result message above, running helm get manifest openbao will return all the YAML configuration files for the newly deployed OpenBao system. This is useful for seeing the system’s initial configuration data. For explanations of these and other installation options, see the [Helm chart’s README](https://github.com/openbao/openbao-helm/blob/main/charts/openbao/README.md). To override any of these configuration options at installation time, use the **\--set** command line argument when installing the Helm chart. For example:

| $ helm install openbao openbao/openbao \--set server.dev.enabled=true |
| :---- |

You can also override the entire configuration in a file and run it with the following command. For example, if the custom configuration file is named override-values.yml, then run the following command:

| $ helm install openbao openbao/openbao \--values override-values.yml  |
| :---- |

## Step 4: Test the OpenBao Development Server

Now that the OpenBao server is installed in the Kubernetes cluster, it needs to be initialized. The initialization generates the credentials needed to [unseal](https://openbao.org/docs/concepts/seal/#why) the server for use. 

To view all the currently configured OpenBao servers in your cluster, run the following:

| $ kubectl get pods \-l app.kubernetes.io/name=openbao NAME        READY   STATUS    RESTARTS   AGEopenbao-0   0/1     Running   0          4m20s |
| :---- |

There should only be one for the standalone profile. Notice that the READY count is 0, indicating the server has not been initialized yet. To initialize the server, run the following:

| $ kubectl exec \-ti openbao-0 \-- bao operator init Unseal Key 1: T8WgvU8ofUf1puk1EtMEGWxikhHf9nLdgPBBFHFnlH0qUnseal Key 2: iXixXscn8SPxfjd+O0tye+tYcbKe345/Ua52lANfb/KpUnseal Key 3: g6jOp6PxaEvYnlGyEICS3fvOwA7J/PX0H4WPU7LQWCWQUnseal Key 4: VR8DoAmpOW7QE3A6IV/Bz05yXGVEQrkBdVBlZX1A79gtUnseal Key 5: SlplOoCD4SyYsoX5CbZfcMsDb2FzxPImNSmU78sbuYDgInitial Root Token: s.XRjSYKwuaULH1N3WxA9k3K27Vault initialized with 5 key shares and a key threshold of 3\. Please securely distribute the key shares printed above. When the Vault is re-sealed, restarted, or stopped, you must supply at least 3 of these keys to unseal it before it can start servicing requests.Vault does not store the generated root key. Without at least 3 keys toreconstruct the root key, Vault will remain permanently sealed\!It is possible to generate new unseal keys, provided you have a quorum ofexisting unseal keys shares. See "bao operator rekey" for more information. |
| :---- |

The output displays the key shares and the initial root key for the server. Unseal the OpenBao server with the key shares until the key threshold is met. For example, using the first unseal key, the command would be:

| $ kubectl exec \-ti openbao-0 \-- \\     bao operator unseal T8WgvU8ofUf1puk1EtMEGWxikhHf9nLdgPBBFHFnlH0q Key                Value\---                \-----Seal Type          shamirInitialized        trueSealed             trueTotal Shares       5Threshold          3Unseal Progress    1/3Unseal Nonce       7adeec56-8ba0-8f20-835b-415837be7977Version            2.1.0Build Date         2024-11-29T15:34:50ZStorage Type       fileHA Enabled         false |
| :---- |

The resulting Unseal Progress shows 1/3. This command must be executed two more times, with two additional key shares, to unseal the server for general use.

| $ kubectl exec \-ti openbao-0 \-- \\    bao operator unseal iXixXscn8SPxfjd+O0tye+tYcbKe345/Ua52lANfb/Kp...$ kubectl exec \-ti openbao-0 \-- \\    bao operator unseal g6jOp6PxaEvYnlGyEICS3fvOwA7J/PX0H4WPU7LQWCWQ Key             Value\---             \-----Seal Type       shamirInitialized     trueSealed          falseTotal Shares    5Threshold       3Version         2.1.0Build Date      2024-11-29T15:34:50ZStorage Type    fileCluster Name    vault-cluster-38e0bd53Cluster ID      8740348d-f8ed-1989-e692-10c5f4e7768cHA Enabled      false |
| :---- |

After the third execution, Sealed shows false. After the server is unsealed, its pod will also report as READY:

| $ kubectl get pods \-l app.kubernetes.io/name=openbao NAME        READY   STATUS    RESTARTS   AGEopenbao-0   1/1     Running   0          11m |
| :---- |

The server is ready for testing now. [Install the OpenBao CLI utility](https://openbao.org/docs/install/). To test the connection directly through the Kubernetes cluster, forward port 8200 from the cluster to your localhost with the following:

| $ kubectl port-forward openbao-0 8200:8200 |
| :---- |

Open a new terminal window. Set the following environment variable so that the OpenBao CLI looks to the forwarded port on localhost.

| $ export BAO\_ADDR=http://127.0.0.1:8200 |
| :---- |

Run the following to log in to the server on the cluster. Use the initial root token that was displayed when you initialized the OpenBao server.

| $ bao login \-method=token \<ROOT TOKEN\>  Success\! You are now authenticated. The token information displayed below is already stored in the token helper. You do NOT need to run "vault login" again. Future Vault requests will automatically use this token. Key                  Value \---                  \----- token                s.XRjSYKwuaULH1N3WxA9k3K27 token\_accessor       7zqRG80kZwFZXKxbcKRjqQPj token\_duration       ∞ token\_renewable      false token\_policies       \["root"\] identity\_policies    \[\] policies             \["root"\] |
| :---- |

Enable the key/value store in the server:

| $ bao secrets enable kv |
| :---- |

Use curl to test setting and getting secrets from the OpenBao server. Set a secret with the following command. Remember to provide your root token with this command.

| $ curl \-X POST \\       \--header "X-Vault-Token: \<ROOT TOKEN\>" \\       \--header "Content-Type: application/json" \\       \--data '{"data": {"hello": "world"}}' \\       http://127.0.0.1:8200/v1/kv/test-secret |
| :---- |

Then, to retrieve the secret, run the following:

| $ curl \-X GET \\       \--header "X-Vault-Token: \<ROOT TOKEN\>" \\       http://127.0.0.1:8200/v1/kv/test-secret | json\_pp  {    "auth" : null,    "data" : {       "data" : {          "hello" : "world"       }    },    "lease\_duration" : 2764800,    "lease\_id" : "",    "renewable" : false,    "request\_id" : "34b4f7cf-d6d0-b621-2eb5-b4e4d6cf4866",    "warnings" : null,    "wrap\_info" : null } |
| :---- |

## Step 5: Configure for External Access

To access the OpenBao server externally, rather than through Kubernetes port-forwarding, use a [LoadBalancer](https://kubernetes.io/docs/tasks/access-application-cluster/create-external-load-balancer/) service. Open the pod configuration for OpenBao: kubectl edit service openbao

Make the following change to the type field of the spec object, leaving the rest of the file unchanged:

| spec:    type: LoadBalancer |
| :---- |

Save the file and exit the editor. Then, wait for a public IP address to be supplied to the pod. Query for the IP address with the following command:

| $ kubectl get service openbao NAME      TYPE           CLUSTER-IP       EXTERNAL-IP      PORT(S)                         AGEopenbao   LoadBalancer   10.128.183.178   172.233.166.52   8200:31782/TCP,8201:31560/TCP   29m |
| :---- |

To test this connection, issue the curl command again to retrieve the previously stored secret, but change the IP address to the external one shown above, at port 8200. For example:

| $ curl \-X GET \\       \--header "X-Vault-Token: \<ROOT TOKEN\>" \\       http://172.233.166.52:8200/v1/kv/test-secret | json\_pp  {    "auth" : null,    "data" : {       "data" : {          "hello" : "world"       }    },    "lease\_duration" : 2764800,    "lease\_id" : "",    "renewable" : false,    "request\_id" : "18cb7adf-6235-bc34-6a6c-df9df6800eb7",    "warnings" : null,    "wrap\_info" : null } |
| :---- |

## Additional Considerations for Production Deployments

When deploying OpenBao to a production-grade Kubernetes cluster, consider the following additional points.

### Auto-unseal in a clustered environment

Kubernetes facilitates auto-unseal mechanisms by integrating cloud-based key management systems (such as AWS KMS, GCP KMS, or Azure Key Vault). Store unsealable keys securely in a Kubernetes Secret object encrypted by a separate key management system or similar mechanism. This ensures the OpenBao vault remains sealed until securely auto-unsealed by Kubernetes on pod startup.

With auto-unseal in place, manual unsealing as demonstrated above becomes unnecessary. Kubernetes will handle this for you in a secure, automated way.

### High-availability mode

To achieve high availability, first [enable the high availability control plane for LKE](https://techdocs.akamai.com/cloud-computing/docs/high-availability-ha-control-plane-on-lke). Then, deploy OpenBao in a stateful set with multiple replicas. You will need:

* A distributed storage backend (such as HashiCorp Consul or PostgreSQL) that supports clustering.  
* A Kubernetes StatefulSet for stable network identities and persistent storage.

The [OpenBao Helm chart](https://github.com/openbao/openbao-helm/blob/main/charts/openbao/README.md) has options for configuring a high-availability profile. To use upon installation, run the following:

| $ helm install openbao openbao/openbao \--set "server.ha.enabled=true" |
| :---- |

This will automatically set up multiple OpenBao servers in your LKE cluster, all with an integrated storage backend.

See the official documentation for [an example](https://openbao.org/docs/platform/k8s/helm/run/#config-example) usage of this Helm configuration.

### Separate configurations from secrets

Store the non-sensitive information for an OpenBao configuration in a Kubernetes [ConfigMap](https://kubernetes.io/docs/concepts/configuration/configmap/). Then, separately, store sensitive information—such as root tokens and unseal keys—as Kubernetes [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/). Ensure Secrets are encrypted at rest and avoid exposing them in logs or environment variables. 

### Secure the LKE cluster network

Harden the network for your LKE cluster by taking the following measures:

* Encrypting all traffic to and from OpenBao using TLS.  
* Using Kubernetes Secrets to store TLS certificates and private keys securely.  
* Validating certificates to prevent man-in-the-middle attacks.  
* Enforcing secure communication between OpenBao and its clients.

### Restricting access to OpenBao

Use Kubernetes [NetworkPolicies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) to restrict access to the OpenBao service. Reduce the attack surface by denying all incoming traffic by default. Then, explicitly allow only required communication paths. Policies should limit the source of ingress traffic to trusted pods, namespaces, or IP ranges.

Deploy the OpenBao management UI only when necessary. If using the UI, secure access to it by integrating it with Kubernetes [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/), [OpenID Connect (OIDC)](https://kubernetes.io/docs/concepts/security/hardening-guide/authentication-mechanisms/#openid-connect-token-authentication), or an external authentication gateway. Limit access to specific IP ranges or authenticated users to prevent unauthorized access.