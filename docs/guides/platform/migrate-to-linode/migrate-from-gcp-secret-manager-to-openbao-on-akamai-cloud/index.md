---
slug: migrate-from-gcp-secret-manager-to-openbao-on-akamai-cloud
title: "Migrate From GCP Secret Manager to OpenBao on Akamai Cloud"
description: "Migrate secrets from GCP Secret Manager to OpenBao on Linode Kubernetes Engine (LKE) using Helm charts and role-based access policies."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2025-05-30
keywords: ['gcp secret manager','openbao','migrate secrets from gcp','openbao helm install','linode kubernetes engine','gke to openbao','bao kv put','bao approle authentication','open source vault alternative','manage secrets on lke']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Google Cloud Secret Manager Documentation](https://cloud.google.com/secret-manager/docs)'
- '[gcloud secrets documentation](https://cloud.google.com/sdk/gcloud/reference/secrets)'
- '[OpenBao Configuration Documentation](https://openbao.org/docs/configuration/)'
- '[OpenBao Integrated Storage](https://openbao.org/docs/concepts/integrated-storage/)'
- '[OpenBao GitHub](https://github.com/openbao/openbao)'
---

[OpenBao](https://openbao.org/) is an open source secrets management tool and fork of [HashiCorp Vault](https://www.vaultproject.io/) that provides teams control over how secrets are stored, encrypted, and accessed. OpenBao can be self-hosted in any environment, including on-premises and across multiple clouds.

[Google Cloud Platform (GCP) Secret Manager](https://cloud.google.com/security/products/secret-manager) is a managed secrets service that securely stores sensitive data like API keys, passwords, and certificates. It integrates with other GCP services and simplifies access control through Identity and Access Management (IAM).

This guide provides steps and considerations for how to migrate secrets stored in GCP Secret Manager to OpenBao running on Akamai Cloud.

## Before You Begin

1.  Follow our [Get Started](https://techdocs.akamai.com/cloud-computing/docs/getting-started) guide to create an Akamai Cloud account if you do not already have one.

1.  When migrating from GCP Secret Manager to OpenBao on Akamai Cloud, OpenBao should be deployed before you begin. OpenBao can be installed on a single Linode instance or deployed to a multi-node cluster using Linode Kubernetes Engine (LKE). Follow the appropriate guide below based on your production needs:

    -   [Deploying OpenBao on a Linode Instance](/docs/guides/deploying-openbao-on-a-linode-instance/)
    -   [Deploy OpenBao on Linode Kubernetes Engine](/docs/guides/deploy-openbao-on-linode-kubernetes-engine/)
    -   [Deploying OpenBao through the Linode Marketplace](/docs/marketplace-docs/guides/openbao/)

1.  Ensure that you have access to your GCP account with sufficient permissions to work with GCP Secret Manager. The [gcloud CLI](https://cloud.google.com/sdk/docs/install) must also be installed and configured.

1.  Install `jq`, a lightweight command line JSON processor.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see our [Users and Groups](/docs/guides/linux-users-and-groups/) doc.
{{< /note >}}

### Using This Guide

This tutorial contains a number of placeholders that are intended to be replaced by your own unique values. For reference purposes, the table below lists these placeholders, what they represent, and the example values used in this guide:

| Placeholder                             | Represents                                              | Example Value                          |
|-----------------------------------------|---------------------------------------------------------|----------------------------------------|
| {{< placeholder "GCP_PROJECT_ID" >}}    | The Google Cloud project ID.                            | `ecommerce-application-454116`         |
| {{< placeholder "GCP_SECRET_NAME" >}}   | The name of a secret stored in GCP Secret Manager.      | `jwt-signing-secret`                   |
| {{< placeholder "POLICY_FILE" >}}       | The name of the file containing the OpenBao policy.     | `jwt-secrets-policy.hcl`               |
| {{< placeholder "SECRET_MOUNT_PATH" >}} | The KV mount path used in OpenBao to organize secrets.  | `jwt`                                  |
| {{< placeholder "POLICY_NAME" >}}       | The internal name for the policy in OpenBao.            | `jwt-secrets-policy`                   |
| {{< placeholder "APPROLE_NAME" >}}      | The name of the AppRole in OpenBao.                     | `app-authenticator-approle`            |
| {{< placeholder "APPROLE_ID" >}}        | The role ID generated for the AppRole by OpenBao.       | `019e2cc5-b8ce-4aa4-91b9-c2c9e9e59863` |
| {{< placeholder "APPROLE_SECRET_ID" >}} | The secret ID generated for the AppRole by OpenBao.     | `cef786fb-1d1c-4c52-9466-aea47b3c8d3a` |
| {{< placeholder "APPROLE_TOKEN" >}}     | The API token retrieved from OpenBao using the AppRole. | `s.dy572yUtTNvHTZgIoxdNVO41`           |
| {{< placeholder "SECRET_NAME" >}}       | The name of the secret to store in OpenBao.             | `signer`                               |
| {{< placeholder "SECRET_KEY" >}}        | The key of the secret to store in OpenBao               | `secret`                               |
| {{< placeholder "SECRET_VALUE" >}}      | The value of the secret to store in OpenBao.            | `EU&&7O^#c2GAMIdRyJlZkPEdoWKgy%CW`     |

{{< note title="All Values Have Been Sanitized" >}}
All of the example values used in this guide are purely examples to mimic and display the format of actual secrets. Nothing listed is a real credential to any existing system.

When creating your own values, **do not** use any of the above credentials.
{{< /note >}}

## Review Existing Secrets in GCP Secret Manager

Before migrating to OpenBao, evaluate how your organization currently uses GCP Secret Manager.

For example, a web application might verify the signature of a JSON Web Token (JWT) using a secret key stored in GCP Secret Manager. Instead of embedding the secret in source code or container images, the application is granted a role that allows it to retrieve the secret at runtime. This protects the secret from being exposed through version control or CI/CD pipelines.

OpenBao supports similar access workflows using dynamic injection, AppRole-based access control, and integration with Kubernetes workloads.

{{< note type="warning" >}}
Ensure that you securely handle any exposed secrets or other sensitive data, as they no longer benefit from encryption by GCP Secret Manager.
{{< /note >}}

### Review Secrets Using the GCP Console

1.  Navigate to **Security > Secret Manager** to list secrets. The example secrets below are used throughout this guide:

    ![GCP Secret Manager UI showing list of stored secrets.](gcp-secret-manager-secret-list.png)

1.  To display a secret's value, select the secret, open the latest version, and click **Actions > View secret value**:

    ![GCP Secret Manager UI displaying how to value of a selected secret.](gcp-secret-manager-secret-value.png)

### Review Secrets Using the `gcloud` CLI

You can also use the `gcloud` CLI to authenticate and inspect the secrets stored in GCP Secret Manager.

1.  Authenticate with the CLI:

    ```command
    gcloud auth login
    ```

1.  Set the active project, replacing {{< placeholder "GCP_PROJECT_ID" >}} (e.g. `ecommerce-application-454116`) with your actual project ID:

    ```command
    gcloud config set project {{< placeholder "GCP_PROJECT_ID" >}}
    ```

    **For Example**:

    ```command
    gcloud config set project ecommerce-application-454116
    ```

1.  [List](https://cloud.google.com/sdk/gcloud/reference/secrets/list) all secrets:

    ```command
    gcloud secrets list
    ```

    ```output
    NAME                       CREATED              REPLICATION_POLICY  LOCATIONS
    billing_service_API_key    2025-03-01T12:25:36  automatic           -
    deploy_key                 2025-02-28T04:04:58  automatic           -
    inventory_service_API_key  2024-11-15T16:35:35  automatic           -
    jwt-signing-secret         2025-03-08T12:01:30  automatic           -
    slack_webhook_url          2024-11-19T21:19:15  automatic           -
    ```

1.  Retrieve the [latest version](https://cloud.google.com/sdk/gcloud/reference/secrets/versions/access) of a secret, replacing {{< placeholder "GCP_SECRET_NAME" >}} (e.g. `jwt-signing-secret`) with an actual secret name:

    ```command
    gcloud secrets versions access latest --secret={{< placeholder "GCP_SECRET_NAME" >}}
    ```

    **For Example**:

    ```command
    gcloud secrets versions access latest --secret=jwt-signing-secret
    ```

    ```output
    EU&&7O^#c2GAMIdRyJlZkPEdoWKgy%CW
    ```

## Access Your OpenBao Deployment on Akamai Cloud

The following steps focus on migrating secrets into your OpenBao deployment on Akamai Cloud. You should already have a running OpenBao instance on either a standalone Linode instance, in an LKE cluster, or deployed via the Linode Marketplace.

If your OpenBao environment is not yet ready, refer to the appropriate deployment guide listed in the [Before You Begin](#before-you-begin) section and complete the setup.

Once deployed, log into your OpenBao environment. Before continuing, verify that:

-   OpenBao is successfully initialized.
-   The vault is unsealed.
-   The `BAO_ADDR` environment variable is set.
-   You are authenticated using the root token.

### Create a Policy and AppRole

To replicate GCP IAM-style access control, OpenBao provides AppRoles. For example, in GCP, a service might be granted a role like `JWTSigner` to retrieve a secret. In OpenBao, this same functionality is implemented using a policy-bound AppRole.

Follow these steps to create an OpenBao AppRole that mimics the role-based access used in GCP IAM.

#### Enable AppRole

1.  Enable the AppRole authentication method:

    ```command
    bao auth enable approle
    ```

    ```output
    Success! Enabled approle auth method at: approle/
    ```

#### Create a Policy

2.  Using a text editor like `nano`, create a new `.hcl` [policy file](https://openbao.org/docs/concepts/policies/) in `/etc/openbao`, replacing {{< placeholder "POLICY_FILE" >}} (e.g. `jwt-secrets-policy.hcl`) with a policy filename of your choosing:

    ```command
    sudo nano /etc/openbao/{{< placeholder "POLICY_FILE" >}}
    ```

    **For Example**:

    ```command
    sudo nano /etc/openbao/jwt-secrets-policy.hcl
    ```

1.  Give the file the following contents, replacing {{< placeholder "SECRET_MOUNT_PATH" >}} (e.g. `jwt`) with your chosen mount path:

    ```file {title="POLICY_FILE.hcl"}
    path "{{< placeholder "SECRET_MOUNT_PATH" >}}/*" {
      capabilities = ["read"]
    }
    ```

    **For Example**:

    ```file {title="jwt-secrets-policy.hcl"}
    path "jwt/*" {
      capabilities = ["read"]
    }
    ```

    This policy grants read access to any secrets within the specified mount path.

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Add the policy to OpenBao, replacing {{< placeholder "POLICY_NAME" >}} (e.g. `jwt-secrets-policy`) and {{< placeholder "POLICY_FILE" >}}:

    ```command
    bao policy write {{< placeholder "POLICY_NAME" >}} /etc/openbao/{{< placeholder "POLICY_FILE" >}}
    ```

    **For Example**:

    ```command
    bao policy write jwt-secrets-policy /etc/openbao/jwt-secrets-policy.hcl
    ```

    ```output
    Success! Uploaded policy: jwt-secrets-policy
    ```

#### Create an AppRole

5.  Create an AppRole for the application that needs access to the secret, replacing {{< placeholder "APPROLE_NAME" >}} (e.g. `app-authenticator-approle`) and {{< placeholder "POLICY_NAME" >}}:

    ```command
    bao write \
      auth/approle/role/{{< placeholder "APPROLE_NAME" >}} \
      token_policies={{< placeholder "POLICY_NAME" >}}
    ```

    **For Example**:

    ```command
    bao write \
      auth/approle/role/app-authenticator-approle \
      token_policies=jwt-secrets-policy
    ```

    ```output
    Success! Data written to: auth/approle/role/app-authenticator-approle
    ```

1.  Verify that the AppRole was written successfully, replacing {{< placeholder "APPROLE_NAME" >}}:

    ```command
    bao read auth/approle/role/{{< placeholder "APPROLE_NAME" >}}
    ```

    **For Example**:

    ```command
    bao read auth/approle/role/app-authenticator-approle
    ```

    ```output
    Key                        Value
    ---                        -----
    bind_secret_id             true
    local_secret_ids           false
    secret_id_bound_cidrs      <nil>
    secret_id_num_uses         0
    secret_id_ttl              0s
    token_bound_cidrs          []
    token_explicit_max_ttl     0s
    token_max_ttl              0s
    token_no_default_policy    false
    token_num_uses             0
    token_period               0s
    token_policies             [jwt-secrets-policy]
    token_strictly_bind_ip     false
    token_ttl                  0s
    token_type                 default
    ```

1.  Fetch the AppRole ID, replacing {{< placeholder "APPROLE_NAME" >}}:

    ```command
    bao read auth/approle/role/{{< placeholder "APPROLE_NAME" >}}/role-id
    ```

    ```output
    Key        Value
    ---        -----
    role_id    019e2cc5-b8ce-4aa4-91b9-c2c9e9e59863
    ```

#### Generate a Secret ID

8.  Generate a secret ID for the role, replacing {{< placeholder "APPROLE_NAME" >}}:

    ```command
    bao write -f auth/approle/role/{{< placeholder "APPROLE_NAME" >}}/secret-id
    ```

    **For Example**:

    ```command
    bao write -f auth/approle/role/app-authenticator-approle/secret-id
    ```

    ```output
    Key                   Value
    ---                   -----
    secret_id             cef786fb-1d1c-4c52-9466-aea47b3c8d3a
    secret_id_accessor    373500ba-6922-4f91-b7f3-ec25f8253d1d
    secret_id_num_uses    0
    secret_id_ttl         0s
    ```

#### Generate an API Token

9.  Generate an API token for the AppRole, supplying the {{< placeholder "APPROLE_ID" >}} (e.g. `019e2cc5-b8ce-4aa4-91b9-c2c9e9e59863`) and {{< placeholder "APPROLE_SECRET_ID" >}} (e.g. `cef786fb-1d1c-4c52-9466-aea47b3c8d3a`) from the previous commands:

    ```command
    bao write auth/approle/login \
      role_id="{{< placeholder "APPROLE_ID" >}}" \
      secret_id="{{< placeholder "APPROLE_SECRET_ID" >}}"
    ```

    **For Example**:

    ```command
    bao write auth/approle/login \
      role_id="019e2cc5-b8ce-4aa4-91b9-c2c9e9e59863" \
      secret_id="cef786fb-1d1c-4c52-9466-aea47b3c8d3a"
    ```

    ```output
    Key                     Value
    ---                     -----
    token                   s.dy572yUtTNvHTZgIoxdNVO41
    token_accessor          zT1TP281vORYSjysBiuMydht
    token_duration          768h
    token_renewable         true
    token_policies          ["jwt-secrets-policy" "default"]
    identity_policies       []
    policies                ["jwt-secrets-policy" "default"]
    token_meta_role_name    app-authenticator-approle
    ```

    The resulting AppRole token (e.g. `s.dy572yUtTNvHTZgIoxdNVO41`) can be used by a user, machine, or service (e.g. the authentication API for a web application) to authenticate OpenBao API calls and read the JWT signing secret.

### Storing Secrets

Create the secret store defined in the policy created above.

1.  Enable the KV secrets engine, replacing {{< placeholder "SECRET_MOUNT_PATH" >}}:

    ```command
    bao secrets enable --path={{< placeholder "SECRET_MOUNT_PATH" >}} kv
    ```

    **For Example**:

    ```command
    bao secrets enable --path=jwt kv
    ```

    ```output
    Success! Enabled the kv secrets engine at: jwt/
    ```

1.  The GCP example secret contains a single sensitive value. Store this value in the {{< placeholder "SECRET_MOUNT_PATH" >}} using a {{< placeholder "SECRET_KEY" >}} (e.g. `secret`) and assign it a {{< placeholder "SECRET_NAME" >}} (e.g. `signer`):

    ```command
    bao kv put --mount={{< placeholder "SECRET_MOUNT_PATH" >}} {{< placeholder "SECRET_NAME" >}} \
      "{{< placeholder "SECRET_KEY" >}}"="{{< placeholder "SECRET_VALUE" >}}"
    ```

    **For Example**:

    ```command
    bao kv put --mount=jwt signer \
      "secret"="EU&&7O^#c2GAMIdRyJlZkPEdoWKgy%CW"
    ```

    ```output
    Success! Data written to: jwt/signer
    ```

### Retrieving Secrets

1.  While authenticated with the root token, retrieve the secret using the OpenBao CLI (`bao`), replacing {{< placeholder "SECRET_MOUNT_PATH" >}} and {{< placeholder "SECRET_NAME" >}}:

    ```command
    bao kv get --mount={{< placeholder "SECRET_MOUNT_PATH" >}} {{< placeholder "SECRET_NAME" >}}
    ```

    **For Example**:

    ```command
    bao kv get --mount=jwt signer
    ```

    ```output
    ====== Data ======
    Key         Value
    ---         -----
    secret      EU&&7O^#c2GAMIdRyJlZkPEdoWKgy%CW
    ```

1.  Test access using the {{< placeholder "APPROLE_TOKEN" >}} (e.g. `s.dy572yUtTNvHTZgIoxdNVO41`) saved earlier, your {{< placeholder "SECRET_MOUNT_PATH" >}}, and the {{< placeholder "SECRET_NAME" >}}:

    ```command
    curl --header "X-Vault-Token: {{< placeholder "APPROLE_TOKEN" >}}" \
         --request GET \
         $BAO_ADDR/v1/{{< placeholder "SECRET_MOUNT_PATH" >}}/{{< placeholder "SECRET_NAME" >}} \
         | jq
    ```

    **For Example**:

    ```command
    curl --header "X-Vault-Token: s.dy572yUtTNvHTZgIoxdNVO41" \
         --request GET \
         $BAO_ADDR/v1/jwt/signer \
         | jq
    ```

    ```output
    {
      "request_id": "0e70b929-06b6-4685-b787-dc1ce6c31b9b",
      "lease_id": "",
      "renewable": false,
      "lease_duration": 2764800,
      "data": {
        "secret": "EU&&7O^#c2GAMIdRyJlZkPEdoWKgy%CW"
      },
      "wrap_info": null,
      "warnings": null,
      "auth": null
    }
    ```

    The AppRole token can be used by applications or services to retrieve secrets through the OpenBao API.

    {{< note >}}
    According to the [OpenBao API documentation](https://openbao.org/api-docs/libraries/), OpenBao is API-compatible with HashiCorp Vault. This means most Vault client libraries should also work with OpenBao, including:

    -   [Go](https://github.com/hashicorp/vault/tree/main/api)
    -   [Ruby](https://github.com/hashicorp/vault-ruby)
    -   [C#](https://github.com/rajanadar/VaultSharp)
    -   [Java](https://developer.hashicorp.com/vault/api-docs/libraries#java)
    -   [Kotlin](https://github.com/kunickiaj/vault-kotlin)
    -   [Node.js](https://developer.hashicorp.com/vault/api-docs/libraries#node-js)
    -   [PHP](https://developer.hashicorp.com/vault/api-docs/libraries#php)
    -   [Python](https://github.com/hvac/hvac)
    {{< /note >}}

## Production Considerations

When migrating workloads from GCP Secret Manager across providers to OpenBao on Akamai Cloud, it's important to ensure your deployment is secure, resilient, and optimized for performance. This section covers key security and high availability considerations to help you maintain a reliable and protected secrets management system.

### Security

Security should be a top priority for a production-grade OpenBao deployment. Protecting secrets from unauthorized access, ensuring secure communication, and enforcing strict access controls are essential to maintaining a secure environment.

-   **Access Control Policies**: Use OpenBao's [policy](https://openbao.org/docs/concepts/policies/) system to enforce RBAC. Define granular policies that only grant the necessary permissions, following the principle of least privilege.
-   **Audit Logging**: Enable [detailed audit logs](https://openbao.org/docs/configuration/log-requests-level/) to track all access and modifications to secrets. OpenBao supports multiple logging backends, such as `syslog` and file-based logs, to help monitor suspicious activity.
-   **Secrets Lifecycle Management**: Implement automated secrets rotation, revocation, and expiration to ensure secrets do not become stale or overexposed. Consider using dynamic secrets where possible to generate time-limited credentials.
-   **Securing Network Communication**: [Configure OpenBao to use TLS](https://openbao.org/docs/configuration/listener/tcp/#configuring-tls) to encrypt all communications, ensuring data in transit remains secure. Regularly rotate TLS certificates to prevent expiration-related outages and reduce the risk of compromised certificates.

### High Availability

Production-grade OpenBao environments should be deployed with fault tolerance and scalability in mind. OpenBao’s [Autopilot mode](https://openbao.org/docs/concepts/integrated-storage/autopilot) for [high availability](https://openbao.org/docs/internals/high-availability/) ensures that if the active node fails, the cluster automatically elects a new leader, maintaining uptime without manual intervention. However, to enable seamless failover, organizations must configure their deployment correctly, and proactively monitor system health.

-   **Raft Storage Backend**: Use OpenBao’s [integrated storage](https://openbao.org/docs/internals/integrated-storage/), based on the [Raft protocol](https://thesecretlivesofdata.com/raft/), to enable distributed data replication across multiple nodes. This ensures data consistency and fault tolerance while reducing reliance on external storage backends. Configure regular Raft snapshots for disaster recovery.
-   **Deploy Multiple Nodes**: OpenBao recommends at least five nodes for a [high-availability deployment](https://openbao.org/docs/concepts/ha/). The active node handles all requests, while standby nodes remain ready to take over in case of failure.
-   **Monitor Leader Status**: Use [`bao operator raft list-peers`](https://openbao.org/docs/commands/operator/raft/#list-peers) to check the cluster’s leader and node statuses. This command helps ensure that standby nodes are correctly registered and ready for failover.