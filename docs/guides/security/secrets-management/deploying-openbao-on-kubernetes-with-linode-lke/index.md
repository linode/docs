---
slug: deploying-openbao-on-kubernetes-with-linode-lke
title: "Deploying OpenBao on Kubernetes with Akamai Cloud LKE"
description: "Learn to deploy and manage OpenBao on Linode Kubernetes Engine (LKE) using Helm. This guide covers setup, unsealing, testing, and production best practices."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2025-04-30
keywords: ['openbao','openbao kubernetes deployment','install openbao on linode','openbao lke','linode kubernetes engine openbao','helm openbao chart','initialize openbao','unseal openbao kubernetes','openbao on akamai cloud','openbao cluster setup','openbao helm install guide','deploy openbao on kubernetes']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[OpenBao](https://openbao.org/)'
- '[Helm](https://helm.sh/)'
---

This guide walks through how to deploy [OpenBao on Kubernetes](https://openbao.org/docs/platform/k8s/) with Akamai Cloud Linode Kubernetes Engine (LKE) using the [OpenBao Helm chart](https://github.com/openbao/openbao-helm).

## Before You Begin

1.  Follow our [Getting Started](https://techdocs.akamai.com/cloud-computing/docs/getting-started) guide, and create an Akamai Cloud account if you do not already have one.

1.  Create a personal access token using the instructions in our [Manage personal access tokens](https://techdocs.akamai.com/cloud-computing/docs/manage-personal-access-tokens) guide.

1.  Install the Linode CLI using the instructions in our [Install and configure the CLI](https://techdocs.akamai.com/cloud-computing/docs/install-and-configure-the-cli) guide.

1.  Follow the steps in the *Install `kubectl`* section of the [Getting started with LKE](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-lke-linode-kubernetes-engine#install-kubectl) guide to install and configure kubectl.

1.  Install the [Helm CLI](https://helm.sh/docs/intro/install/) on your workstation. Helm is a package manager for Kubernetes that simplifies the deployment of applications.

1.  Install the [OpenBao CLI](https://openbao.org/docs/install/) on your workstation.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Provision an LKE Cluster

While there are several ways to create a Kubernetes cluster on Akamai Cloud, this guide uses the [Linode CLI](https://github.com/linode/linode-cli) to provision resources.

1.  Use the Linode CLI (`linode-cli`) to see available Kubernetes versions:

    ```command
    linode-cli lke versions-list
    ```

    ```output
    ┌───────┐
    │ id    │
    ├───────┤
    │ 1.32  │
    ├───────┤
    │ 1.31  │
    └───────┘
    ```

    It’s generally recommended to provision the latest version of Kubernetes unless specific requirements dictate otherwise.

1.  Use the following command to list available Akamai Cloud plans, including plan ID, pricing, and performance details. For more detailed pricing information, see [Akamai Cloud: Pricing](https://www.linode.com/pricing/):

    ```command
    linode-cli linodes types
    ```

1.  The examples in this guide use the **g6-standard-2** Linode, which features two CPU cores and 4 GB of memory. Run the following command to display detailed information in JSON for this Akamai Cloud plan:

    ```command
    linode-cli linodes types --label "Linode 4GB" --json --pretty
    ```

    ```output
    [
      {
        "addons": {...}
        "class": "standard",
        "disk": 81920,
        "gpus": 0,
        "id": "g6-standard-2",
        "label": "Linode 4GB",
        "memory": 4096,
        "network_out": 4000,
        "price": {...},
        "region_prices": [...],
        "successor": null,
        "transfer": 4000,
        "vcpus": 2
      }
    ]
    ```

1.  View available regions with the `regions list` command:

    ```command
    linode-cli regions list
    ```

1.  After selecting a Kubernetes version and Linode type, use the following command to create a cluster named `openbao-cluster` in the `us-mia` (Miami, FL) region with three nodes and auto-scaling. Replace `openbao-cluster` and `us-mia` with a cluster label and region of your choosing, respectively:

    ```command
    linode lke cluster-create \
      --label openbao-cluster \
      --k8s_version 1.32 \
      --region us-mia \
      --node_pools '[{
        "type": "g6-standard-2",
        "count": 3,
        "autoscaler": {
          "enabled": true,
          "min": 3,
          "max": 8
        }
    }]'
    ```

    Once your cluster is successfully created, you should see output similar to the following:

    ```output
    Using default values: {}; use the --no-defaults flag to disable defaults
    ┌────────┬─────────────────┬────────┬─────────────┬─────────────────────────────────┬──────┐
    │ id     │ label           │ region │ k8s_version │ control_plane.high_availability │ tier │
    ├────────┼─────────────────┼────────┼─────────────┼─────────────────────────────────┼──────┤
    │ 415365 │ openbao-cluster │ us-mia │ 1.32        │ False                           │      │
    └────────┴─────────────────┴────────┴─────────────┴─────────────────────────────────┴──────┘
    ```

## Access the LKE Cluster

To access your cluster, fetch the cluster credentials in the form of a `kubeconfig` file. Your cluster’s `kubeconfig` can also be [downloaded via the Cloud Manager](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-lke-linode-kubernetes-engine#access-and-download-your-kubeconfig).

1.  Use the following command to retrieve the cluster’s ID:

    ```command
    CLUSTER_ID=$(linode lke clusters-list --json | jq -r \
      '.[] | select(.label == "openbao-cluster") | .id')
    ```

1.  Create a hidden `.kube` folder in your user’s home directory:

    ```command
    mkdir ~/.kube
    ```

1.  Retrieve the `kubeconfig` file and save it to `~/.kube/lke-config`:

    ```command
    linode-cli lke kubeconfig-view --json "$CLUSTER_ID" | \
      jq -r '.[0].kubeconfig' | \
      base64 --decode > ~/.kube/lke-config
    ```

1.  After saving the `kubeconfig` file, access your cluster by specifying the file with `kubectl`:

    ```command
    kubectl get no --kubeconfig ~/.kube/lke-config
    ```

    ```output
    NAME                            STATUS   ROLES    AGE    VERSION
    lke415365-625696-3fe27ca40000   Ready    <none>   115s   v1.32.1
    lke415365-625696-4f320a5f0000   Ready    <none>   117s   v1.32.1
    lke415365-625696-5a43a1510000   Ready    <none>   119s   v1.32.1
    ```

    {{< note >}}
    Alternatively, to avoid specifying `--kubeconfig ~/.kube/lke-config` with every `kubectl` command, you can set an environment variable for your current terminal window session:

    ```command
    export KUBECONFIG=~/.kube/lke-config
    ```

    Then run:

    ```command
    kubectl get no
    ```
    {{< /note >}}

## Set Up OpenBao on LKE

[Helm](https://helm.sh/) is a package manager for Kubernetes that simplifies application deployment via *charts*. The OpenBao development team maintains an official [Helm chart](https://github.com/openbao/openbao-helm), which is the recommended method for deploying OpenBao on Kubernetes.

By default, this Helm chart installs OpenBao in *standalone mode*, which sets up a single server with a file storage backend. This profile is useful for testing, but other profiles are available in this chart (e.g. development server, high-availability cluster). See the [OpenBao Helm README](https://github.com/openbao/openbao-helm/blob/main/charts/openbao/README.md) for more information.

1.  Add the OpenBao chart repository to your local Helm installation:

    ```command
    helm repo add openbao https://openbao.github.io/openbao-helm
    ```

    ```output
    "openbao" has been added to your repositories
    ```

1.  Use Helm to deploy the OpenBao chart:

    ```command
    helm install openbao openbao/openbao
    ```

    ```output
    NAME: openbao
    LAST DEPLOYED: Wed Apr 30 16:14:55 2025
    NAMESPACE: default
    STATUS: deployed
    REVISION: 1
    NOTES:
    Thank you for installing OpenBao!

    Now that you have deployed OpenBao, you should look over the docs on using
    OpenBao with Kubernetes available here:

    https://openbao.org/docs/


    Your release is named openbao. To learn more about the release, try:

      $ helm status openbao
      $ helm get manifest openbao
    ```

1.  Run the following command to view the complete YAML manifests generated during installation:

    ```command
    helm get manifest openbao
    ```

    This returns all the YAML configuration files for the newly deployed OpenBao system, which is useful for inspecting the system’s initial configuration data.

    {{< note title="Customize the Installation" >}}
    To override any of these configuration options at installation time, use the `--set` command line argument when installing the Helm chart, for example:

    ```command
    helm install openbao openbao/openbao --set server.dev.enabled=true
    ```

    You can also override the entire configuration in a file and run it with the following command, for example:

    ```command
    helm install openbao openbao/openbao --values override-values.yml
    ```
    {{< /note >}}

## Initialize and Unseal the OpenBao Development Server

Once the OpenBao server is installed in the Kubernetes cluster, it must be initialized. The initialization generates the credentials needed to [unseal](https://openbao.org/docs/concepts/seal/#why) the server for use.

1.  To view all the currently configured OpenBao servers in your cluster, run the following:

    ```command
    kubectl get pods -l app.kubernetes.io/name=openbao
    ```

    There should only be one for the `standalone` profile. Notice that the `READY` count is `0`, indicating the server has not been initialized yet:

    ```output
    NAME        READY   STATUS    RESTARTS   AGE
    openbao-0   0/1     Running   0          4m20s
    ```

1.  To initialize the server, run the following:

    ```command
    kubectl exec -ti openbao-0 -- bao operator init
    ```

    The output displays the key shares and the initial root key for the server:

    ```output
    Unseal Key 1: amIfRt7lBrC0/x5mOtkyk9WvOF5IH6ycPEl8Gy4FnqTh
    Unseal Key 2: mjUsz45ghgsExRS7l6m11u11CBhe6djQAJHcZ/uZkvOw
    Unseal Key 3: CCl0vH8Ajw5Rrue6DIbI7nYNUCPQFoCva4Fn0GK7nu0K
    Unseal Key 4: oqjxlFVel57HqcdqWGX1M7y9BndZ8c/Q0URw6r3cjABG
    Unseal Key 5: WTEAz+IinG/H+kJ364ALIx2ubhyMh6TJqyDT2LCleyXI

    Initial Root Token: s.aLWUBcxF6f1e2RVZ5pEsXwMe

    Vault initialized with 5 key shares and a key threshold of 3. Please securely
    distribute the key shares printed above. When the Vault is re-sealed,
    restarted, or stopped, you must supply at least 3 of these keys to unseal it
    before it can start servicing requests.

    Vault does not store the generated root key. Without at least 3 keys to
    reconstruct the root key, Vault will remain permanently sealed!

    It is possible to generate new unseal keys, provided you have a quorum of
    existing unseal keys shares. See "bao operator rekey" for more information.
    ```

    You must unseal the OpenBao server with the unseal keys provided until the key threshold is met. Unsealing must be done a total of three times, as this is the default quorum for OpenBao unsealing. Also take note of the Initial Root Token as it is needed in subsequent steps.

1.  Use the following command to begin unsealing the vault using one of the unseal keys:

    ```command
    kubectl exec -ti openbao-0 -- \
      bao operator unseal amIfRt7lBrC0/x5mOtkyk9WvOF5IH6ycPEl8Gy4FnqTh
    ```

    ```output
    Key                Value
    ---                -----
    Seal Type          shamir
    Initialized        true
    Sealed             true
    Total Shares       5
    Threshold          3
    Unseal Progress    1/3
    Unseal Nonce       3521df43-fe19-7fa7-9a7c-9442dbe8de68
    Version            2.2.0
    Build Date         2025-03-05T13:07:08Z
    Storage Type       file
    HA Enabled         false
    ```

1.  Unseal the vault again, but enter a different unseal key when prompted:

    ```command
    kubectl exec -ti openbao-0 -- \
      bao operator unseal mjUsz45ghgsExRS7l6m11u11CBhe6djQAJHcZ/uZkvOw
    ```

    ```output
    Key                Value
    ---                -----
    Seal Type          shamir
    Initialized        true
    Sealed             true
    Total Shares       5
    Threshold          3
    Unseal Progress    2/3
    Unseal Nonce       3521df43-fe19-7fa7-9a7c-9442dbe8de68
    Version            2.2.0
    Build Date         2025-03-05T13:07:08Z
    Storage Type       file
    HA Enabled         false
    ```

1.  Unseal the vault for the third and final time, using yet another unseal:

    ```command
    kubectl exec -ti openbao-0 -- \
      bao operator unseal CCl0vH8Ajw5Rrue6DIbI7nYNUCPQFoCva4Fn0GK7nu0K
    ```

    After unsealing the vault with three different unseal keys, OpenBao should report the following status:

    ```output
    Key             Value
    ---             -----
    Seal Type       shamir
    Initialized     true
    Sealed          false
    Total Shares    5
    Threshold       3
    Version         2.2.0
    Build Date      2025-03-05T13:07:08Z
    Storage Type    file
    Cluster Name    vault-cluster-7d68e84b
    Cluster ID      07352961-8d7e-edeb-7757-74d04b221500
    HA Enabled      false
    ```

    The vault has now been initialized and unsealed.

1.  After unsealing, verify that the pod is now ready:

    ```command
    kubectl get pods -l app.kubernetes.io/name=openbao
    ```

    After the OpenBao server is unsealed, its pod should also report as `READY`:

    ```output
    NAME        READY   STATUS    RESTARTS   AGE
    openbao-0   1/1     Running   0          11m
    ```

    The OpenBao server is now ready for testing.

## Test the OpenBao Development Server

1.  To test the connection directly through the Kubernetes cluster, forward port `8200` from the cluster to your `localhost` with the following:

    ```command
    kubectl port-forward openbao-0 8200:8200
    ```

    ```output
    Forwarding from 127.0.0.1:8200 -> 8200
    Forwarding from [::1]:8200 -> 8200
    ```

1.  Open a new terminal window. Set the following environment variable so that the OpenBao CLI looks to the forwarded port on `localhost`.

    ```command
    export BAO_ADDR=http://127.0.0.1:8200
    ```

1.  Use the `bao login` command with the initial root token provided upon vault initialization to log in to the OpenBao server on the LKE cluster:

    ```command
    bao login -method=token {{< placeholder "INITIAL_ROOT_TOKEN" >}}
    ```

    ```output
    Success! You are now authenticated. The token information displayed below is
    already stored in the token helper. You do NOT need to run "bao login" again.
    Future OpenBao requests will automatically use this token.

    Key                  Value
    ---                  -----
    token                s.aLWUBcxF6f1e2RVZ5pEsXwMe
    token_accessor       zOoW9kLqFjYtZuEZM2UOfn1d
    token_duration       ∞
    token_renewable      false
    token_policies       ["root"]
    identity_policies    []
    policies             ["root"]
    ```

1.  Enable the key/value store in the server:

    ```command
    bao secrets enable kv
    ```

    ```output
    Success! Enabled the kv secrets engine at: kv/
    ```

1.  Use cURL to test storing and retrieving secrets from the OpenBao server. Store a secret with the following command, providing your actual initial root token in place of {{< placeholder "INITIAL_ROOT_TOKEN" >}}:

    ```command
    curl -X POST \
          --header "X-Vault-Token: {{< placeholder "INITIAL_ROOT_TOKEN" >}}" \
          --header "Content-Type: application/json" \
          --data '{"data": {"hello": "world"}}' \
          http://127.0.0.1:8200/v1/kv/test-secret
    ```

1.  Run the following cURL to retrieve the secret:

    ```command
    curl -X GET \
         --header "X-Vault-Token: {{< placeholder "INITIAL_ROOT_TOKEN" >}}" \
         http://127.0.0.1:8200/v1/kv/test-secret | json_pp
    ```

    ```output
    {
       "auth" : null,
       "data" : {
          "data" : {
             "hello" : "world"
          }
       },
       "lease_duration" : 2764800,
       "lease_id" : "",
       "renewable" : false,
       "request_id" : "2bfd095a-924f-4d2e-abcc-99ebbca045b5",
       "warnings" : null,
       "wrap_info" : null
    }
    ```

1.  When done, you can close the second terminal session.

1.  Return to the original terminal session and press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop port forwarding.

## Configure OpenBao for External Access

To access the OpenBao server externally, rather than through Kubernetes port-forwarding, use a [LoadBalancer](https://kubernetes.io/docs/tasks/access-application-cluster/create-external-load-balancer/) service.

1.  Open the pod configuration for OpenBao:

    ```command
    kubectl edit service openbao
    ```

    By default, the OpenBao service is created as a `ClusterIP`. To expose it externally, change the service type to `LoadBalancer`. Press the <kbd>I</kbd> key to edit the file, and make the following change, leaving the rest of the file unchanged:

    ```file {hl_lines="44"}
    # Please edit the object below. Lines beginning with a '#' will be ignored,
    # and an empty file will abort the edit. If an error occurs while saving this file will be
    # reopened with the relevant failures.
    #
    apiVersion: v1
    kind: Service
    metadata:
      annotations:
        meta.helm.sh/release-name: openbao
        meta.helm.sh/release-namespace: default
      creationTimestamp: "2025-04-28T18:12:12Z"
      labels:
        app.kubernetes.io/instance: openbao
        app.kubernetes.io/managed-by: Helm
        app.kubernetes.io/name: openbao
        helm.sh/chart: openbao-0.12.0
      name: openbao
      namespace: default
      resourceVersion: "7082"
      uid: 6e1cb14b-a108-466f-ac77-ddc9c63519ff
    spec:
      clusterIP: 10.128.82.244
      clusterIPs:
      - 10.128.82.244
      internalTrafficPolicy: Cluster
      ipFamilies:
      - IPv4
      ipFamilyPolicy: SingleStack
      ports:
      - name: http
        port: 8200
        protocol: TCP
        targetPort: 8200
      - name: https-internal
        port: 8201
        protocol: TCP
        targetPort: 8201
      publishNotReadyAddresses: true
      selector:
        app.kubernetes.io/instance: openbao
        app.kubernetes.io/name: openbao
        component: server
      sessionAffinity: None
      type: LoadBalancer
    status:
      loadBalancer: {}
    ```

    When done, press the <kbd>ESC</kbd> to exit edit mode, followed by `:wq` to save the changes and exit.

    ```output
    service/openbao edited
    ```

1.  Wait for a public IP address to be supplied to the pod, then query for the IP address with the following command:

    ```command
    kubectl get service openbao
    ```

    ```output
    NAME      TYPE           CLUSTER-IP       EXTERNAL-IP      PORT(S)                         AGE
    openbao   LoadBalancer   10.128.154.209   172.233.167.79   8200:31550/TCP,8201:32438/TCP   47m
    ```

1.  To test this connection, issue the `curl` command again to retrieve the previously stored secret, but change the IP address to the external one shown above, at port `8200`. For example:

    ```command
    curl -X GET \
        --header "X-Vault-Token: {{< placeholder "INITIAL_ROOT_TOKEN" >}}" \
        http://{{< placeholder "EXTERNAL_IP_ADDRESS" >}}:8200/v1/kv/test-secret | json_pp
    ```

    ```output
    {
       "auth" : null,
       "data" : {
          "data" : {
             "hello" : "world"
          }
       },
       "lease_duration" : 2764800,
       "lease_id" : "",
       "renewable" : false,
       "request_id" : "8603ab17-1810-f63d-13c5-fc044cb4c101",
       "warnings" : null,
       "wrap_info" : null
    }
    ```

## Additional Considerations for Production Deployments

When deploying OpenBao to a production-grade Kubernetes cluster, consider the following additional points.

### Auto-Unseal in a Clustered Environment

Kubernetes facilitates auto-unseal mechanisms by integrating cloud-based key management systems (such as AWS KMS, GCP KMS, or Azure Key Vault). Store the unseal keys securely in a Kubernetes Secret object encrypted by a separate key management system or similar mechanism. This ensures the OpenBao vault remains sealed until securely auto-unsealed by Kubernetes on pod startup.

With auto-unseal enabled, Kubernetes can automatically unseal OpenBao when pods start, removing the need for manual unseal operations (as demonstrated above).

### High-Availability Mode

To achieve high availability, [enable the high availability control plane for LKE](https://techdocs.akamai.com/cloud-computing/docs/high-availability-ha-control-plane-on-lke) then deploy OpenBao in a stateful set with multiple replicas. To do this, you need:

-   A distributed, highly available storage backend (such as HashiCorp Consul or PostgreSQL) that supports concurrent access across replicas.
-   A Kubernetes StatefulSet for stable network identities and persistent storage.

The [OpenBao Helm chart](https://github.com/openbao/openbao-helm/blob/main/charts/openbao/README.md) has options for configuring a high-availability profile. To use upon installation, run the following:

```command
helm install openbao openbao/openbao --set "server.ha.enabled=true"
```

This automatically sets up multiple OpenBao servers in your LKE cluster, all configured to share a common, replicated storage backend. See the official documentation for [an example](https://openbao.org/docs/platform/k8s/helm/run/#config-example) usage of this Helm configuration.

### Separate Configurations from Secrets

Store the non-sensitive information for an OpenBao configuration in a Kubernetes [ConfigMap](https://kubernetes.io/docs/concepts/configuration/configmap/). Separately store sensitive information (e.g. root tokens and unseal keys) as Kubernetes [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/). Encrypt all Kubernetes Secrets at rest, and avoid exposing them in logs or environment variables.

### Secure the LKE Cluster Network

Harden the network for your LKE cluster by taking the following measures:

-   Encrypt all traffic to and from OpenBao using TLS.
-   Use Kubernetes Secrets to store TLS certificates and private keys securely.
-   Validate certificates to prevent man-in-the-middle attacks.
-   Enforce secure communication between OpenBao and its clients.

### Restrict Access to OpenBao

Use Kubernetes [NetworkPolicies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) to restrict access to the OpenBao service. Reduce the attack surface by denying all incoming traffic by default. Explicitly allow only required communication paths. Policies should limit the source of ingress traffic to trusted pods, namespaces, or IP ranges.

Deploy the OpenBao management UI only when necessary. If using the UI, secure access to it by integrating it with Kubernetes [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/), [OpenID Connect (OIDC)](https://kubernetes.io/docs/concepts/security/hardening-guide/authentication-mechanisms/#openid-connect-token-authentication), or an external authentication gateway. Limit access to specific IP ranges or authenticated users to prevent unauthorized access.