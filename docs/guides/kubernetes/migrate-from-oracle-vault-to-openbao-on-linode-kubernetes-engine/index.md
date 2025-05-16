---
slug: migrate-from-oracle-vault-to-openbao-on-linode-kubernetes-engine
title: "Migrate From Oracle Vault to OpenBao on Akamai Cloud"
description: "Securely migrate secrets from Oracle Vault to OpenBao on Linode Kubernetes Engine (LKE), using Helm and AppRole-based access control."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2025-05-01
keywords: ['oracle vault','openbao','migrate secrets from oci','openbao helm install','linode kubernetes engine','oke to openbao','bao kv put','bao approle authentication','open source vault alternative','manage secrets on lke']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Oracle Vault Documentation](https://docs.oracle.com/en-us/iaas/Content/KeyManagement/Concepts/keyoverview.htm)'
- '[Oracle `oci` CLI Documentation](https://docs.oracle.com/en-us/iaas/Content/API/Concepts/cliconcepts.htm)'
- '[OpenBao Configuration Documentation](https://openbao.org/docs/configuration/)'
- '[OpenBao Integrated Storage](https://openbao.org/docs/concepts/integrated-storage/)'
---

Oracle Vault is a part of Oracle Cloud Infrastructure (OCI). It provides a secure, managed solution for storing and controlling access to sensitive information like API keys, passwords, and encryption keys. Oracle Vault is designed to integrate with other Oracle services, supporting features for key management, secret storage, and cryptographic functions.

[OpenBao](https://openbao.org/) is an open source fork of [HashiCorp Vault](https://www.vaultproject.io/) that gives teams full control over how secrets are stored, encrypted, and accessed. Unlike managed platforms, OpenBao can be self-hosted in any environment, including on-premises and across multiple clouds.

This guide walks through how to migrate secrets from Oracle Vault to OpenBao running on Akamai Cloud.

## Before You Begin

1.  Follow our [Getting Started](https://techdocs.akamai.com/cloud-computing/docs/getting-started) guide to create an Akamai Cloud account if you do not already have one.

1.  Create a personal access token using the instructions in our [Manage personal access tokens](https://techdocs.akamai.com/cloud-computing/docs/manage-personal-access-tokens) guide.

1.  Install the Linode CLI using the instructions in the [Install and configure the CLI](https://techdocs.akamai.com/cloud-computing/docs/install-and-configure-the-cli) guide.

1.  Follow the steps in the *Install `kubectl`* section of the [Getting started with LKE](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-lke-linode-kubernetes-engine#install-kubectl) guide to install and configure `kubectl`.

1.  Ensure that you have access to your Oracle Cloud account with sufficient permissions to work with Oracle Vault. The [OCI CLI](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/cliinstall.htm) must also be installed and configured

1.  Install `jq`, a lightweight command line JSON processor.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

Additionally, this guide contains a number of placeholders that are intended to be replaced by your own unique values. The table below lists these placeholders, what they represent, and the example values used in this guide:

| Placeholder                              | Represents                                           | Example Value                                                     |
|------------------------------------------|------------------------------------------------------|-------------------------------------------------------------------|
| {{< placeholder "OCI_COMPARTMENT_ID" >}} | The OCID of the compartment containing your vault.   | ocid1.compartment.oc1..aaaaaaaawrrlh7hw6b4tnsbxevyoywscike5ygn... |
| {{< placeholder "OCI_SECRET_ID" >}}      | The OCID of the secret stored in Oracle Vault.       | ocid1.vaultsecret.oc1.phx.amaaaaaaogvqnkqaepiqln7ztj43ugit...     |
| {{< placeholder "OCI_ENCODED_SECRET" >}} | The base64-encoded value of the Oracle secret.       | eyAiYWNjZXNzX2tleV9pZCIgOiAiQUtJQTUxM0oyRERSQVhDRktYRjUi...       |
| {{< placeholder "POLICY_FILE" >}}        | The name of the policy file.                         | cloud-credentials-policy.hcl                                      |
| {{< placeholder "SECRET_MOUNT_PATH" >}}  | The mount path (namespace) where secrets are stored. | cloud-credentials                                                 |
| {{< placeholder "POLICY_NAME" >}}        | The internal name for the policy in OpenBao.         | cloud-credentials-policy                                          |
| {{< placeholder "APPROLE_NAME" >}}       | The name of the AppRole.                             | cloud-credential-reader-approle                                   |
| {{< placeholder "APPROLE_ID" >}}         | The role ID generated for the AppRole.               | c8663988-136f-42de-af40-1dfb94f0c1f6                              |
| {{< placeholder "APPROLE_SECRET_ID" >}}  | The secret ID generated for the AppRole.             | 9b9c27a3-dc27-4eea-921f-773164ec17c7                              |
| {{< placeholder "SECRET_VALUE" >}}       | The actual secret contents to store in OpenBao.      | { "access_key_id": "...", "secret_access_key": "..." }            |
| {{< placeholder "SECRET_NAME" >}}        | The name of the secret stored under the mount path.  | provider-a                                                        |
| {{< placeholder "APPROLE_TOKEN" >}}      | The API token generated from the AppRole login.      | s.36Yb3ijEOJbifprhdEiFtPhR                                        |

{{< note >}}
All of the example values used in this guide are purely examples to mimic the format of actual secrets. These are *not* real credentials to any exisiting systems.
{{< /note >}}

## Review Existing Secrets in Oracle Vault

Before migrating to OpenBao, evaluate how your organization currently uses Oracle Vault.

For example, an application that accesses services from multiple cloud providers might retrieve access keys stored in Oracle Vault. Granting access at runtime ensures that credentials aren’t embedded in code or exposed during deployment.

OpenBao supports equivalent secret injection workflows through AppRole and Kubernetes integration.

{{< note type="warning" >}}
Ensure that you securely handle any exposed secrets, as they no longer benefit from encryption by Oracle Vault.
{{< /note >}}

### Review Secrets Using the Oracle Console

1.  Navigate to **Security > Vault**, select your vault, and open the **Secrets** tab:

    ![Oracle Vault UI displaying secrets in selected vault.](oracle-vault-secret-list.png)

1.  Select a secret, go to the latest version, and click **View Secret Contents**:

    ![Oracle Vault showing how to view the content of a selected secret.](oracle-vault-secret-value.png)

### Review Secrets Using the OCI CLI

You can also use the Oracle Cloud CLI (`oci`) to manage the secrets in your Oracle Vault.

1.  Authenticate with the OCI CLI. You must have configured your API key, tenancy OCID, and user OCID. Run a basic command to confirm authentication:

    ```command
    oci iam region list
    ```

1.  Identify the compartment that contains your vault:

    ```command
    oci iam compartment list --query 'data[]["name","id"]'
    ```

    In the example above, the `credentials` vault belongs to the `web-application` compartment:

    ```output
    [
      [
        "web-application", "ocid1.compartment.oc1..aaaaaaaawrrlh7hw6b4tnsbxevyoywscike5ygn4ut5n734mjsclijgpjjgq"
      ]
    ]
    ```

1.  [List the secrets in your vault](https://docs.oracle.com/en-us/iaas/tools/oci-cli/3.53.0/oci_cli_docs/cmdref/vault/secret/list.html) by specifying the {{< placeholder "OCI_COMPARTMENT_ID" >}} (e.g. `ocid1.compartment.oc1..aaaaaaaawrrlh7hw6b4tnsbxevyoywscike5ygn4ut5n734mjsclijgpjjgq`):

    ```command
    oci vault secret list \
      --compartment-id {{< placeholder "OCI_COMPARTMENT_ID" >}} \
      --query 'data[].["secret-name","description","id"]'
    ```

    **For Example**:

    ```command
    oci vault secret list \
      --compartment-id ocid1.compartment.oc1..aaaaaaaawrrlh7hw6b4tnsbxevyoywscike5ygn4ut5n734mjsclijgpjjgq \
      --query 'data[].["secret-name","description","id"]'
    ```

    ```output
    [
      [
        "cloud_provider_a",
        "Access key ID and secret access key for provider",
    "ocid1.vaultsecret.oc1.phx.amaaaaaaogvqnkqaepiqln7ztj43ugit75w3wl7kyzldk3rbqkfd2zmtp3ea"
      ],
      [
        "cloud_provider_b",
        "Project ID and project API KEY",
    "ocid1.vaultsecret.oc1.phx.amaaaaaaogvqnkqacnhdzfprgd4f4ml7rpkjqmqlyz7p5kjjfinvyn57qdoa"
      ],
      [
        "cloud_provider_c",
        "Client ID and client secret",
    "ocid1.vaultsecret.oc1.phx.amaaaaaaogvqnkqavn32ibazaqinya5bv3eyc4ndfvebcnksnqk4vl74xqqa"
      ]
    ]
    ```

1.  Retrieve the [value of a secret](https://docs.oracle.com/en-us/iaas/tools/oci-cli/3.53.0/oci_cli_docs/cmdref/secrets/secret-bundle/get.html) by specifying its {{< placeholder "OCI_SECRET_ID" >}} (e.g. `ocid1.vaultsecret.oc1.phx.amaaaaaaogvqnkqaepiqln7ztj43ugit75w3wl7kyzldk3rbqkfd2zmtp3ea`):

    ```command
    oci secrets secret-bundle get \
      --secret-id {{< placeholder "OCI_SECRET_ID" >}} \
      --stage CURRENT \
      --query 'data."secret-bundle-content"'
    ```

    **For Example**:

    ```command
    oci secrets secret-bundle get \
      --secret-id ocid1.vaultsecret.oc1.phx.amaaaaaaogvqnkqaepiqln7ztj43ugit75w3wl7kyzldk3rbqkfd2zmtp3ea \
      --stage CURRENT \
      --query 'data."secret-bundle-content"'
    ```

    ```output
    {
      "content":
    "eyAiYWNjZXNzX2tleV9pZCIgOiAiQUtJQTUxM0oyRERSQVhDRktYRjUiLCAic2VjcmV0X2FjY2Vzc19rZXkiIDoiWGRxRDBCUGE4YUxGYU4rRUk4U0FZbTlVNFpZZVhRZE1HQUlqS0QveCIgfQ==",
      "content-type": "BASE64"
    }
    ```

1.  If the secret bundle `content-type` is `BASE64` (e.g. `eyAiYWNjZXNzX2tleV9pZCIgOiAiQUtJQTUxM0oyRERSQVhDRktYRjUiLCAic2VjcmV0X2FjY2Vzc19rZXkiIDoiWGRxRDBCUGE4YUxGYU4rRUk4U0FZbTlVNFpZZVhRZE1HQUlqS0QveCIgfQ==`), you must decode it to reveal the original value:

    ```command
    echo {{< placeholder "OCI_ENCODED_SECRET" >}} \
      | base64 --decode
    ```

    **For Example**:

    ```command
    echo eyAiYWNjZXNzX2tleV9pZCIgOiAiQUtJQTUxM0oyRERSQVhDRktYRjUiLCAic2VjcmV0X2FjY2Vzc19rZXkiIDoiWGRxRDBCUGE4YUxGYU4rRUk4U0FZbTlVNFpZZVhRZE1HQUlqS0QveCIgfQ== \
      | base64 --decode
    ```

    ```output
    { "access_key_id": "AKIA513J2DDRAXCFKXF5", "secret_access_key": "XdqD0BPa8aLFaN+EI8SAYm9U4ZYeXQdMGAIjKD/x" }
    ```

    {{< note >}}
    You can also retrieve and decode the secret in a single command:

    ```command
    oci secrets secret-bundle get \
      --secret-id {{< placeholder "OCI_SECRET_ID" >}} \
      --stage CURRENT \
      --query 'data."secret-bundle-content".content' \
      --raw-output \
      | base64 --decode
    ```
    {{< /note >}}

## Deploy OpenBao on Akamai Cloud

When migrating from Oracle Vault to OpenBao on Akamai Cloud, your deployment requirements determine whether to install OpenBao on a single Linode Instance or to deploy it in a fault-tolerant environment using the Linode Kubernetes Engine (LKE). Follow the appropriate guide below:

-   [Deploying OpenBao on a Linode Instance](https://docs.google.com/document/d/1x30v1xT_EDuRNnhE9jv5VkFqj9Lo4N3kNO6ICOoSrOM/edit?usp=sharing)
-   [Deploying OpenBao on Linode Kubernetes Engine](https://docs.google.com/document/d/1gS6hQg09Ufr1Ku0v528acLESnyj1ZpXTxLhkLIlP-u8/edit?usp=sharing)
-   [Deploying OpenBao through the Linode Marketplace](/docs/marketplace-docs/guides/openbao/)

Regardless of the method used, make sure that:

-   OpenBao is successfully initialized.
-   The vault is unsealed.
-   The `BAO_ADDR` environment variable is set.
-   You are authenticated using the root token.

### Create a Policy and AppRole

To replicate Oracle IAM-style access control in OpenBao, use AppRoles. While Oracle Vault manages permissions through IAM policies instead of granular roles, OpenBao allows you to assign access through policy-bound AppRoles.

Follow these steps to create an OpenBao AppRole that mirrors access controls used in Oracle IAM.

#### Enable AppRole

1.  Enable the AppRole authentication method:

    ```command
    bao auth enable approle
    ```

    ```output
    Success! Enabled approle auth method at: approle/
    ```

#### Create a Policy

2.  Create a new `.hcl` [policy file](https://openbao.org/docs/concepts/policies/) in `/etc/openbao`, replacing {{< placeholder "POLICY_FILE" >}} (e.g. `cloud-credentials-policy.hcl`) with a policy filename of your choosing:

    ```command
    sudo nano /etc/openbao/{{< placeholder "POLICY_FILE" >}}
    ```

    **For Example**:

    ```command
    sudo nano /etc/openbao/cloud-credentials-policy.hcl
    ```
1.  Give the file the following contents, replacing {{< placeholder "SECRET_MOUNT_PATH" >}} (e.g. `cloud-credentials`) with your chosen mount path:

    ```file {title="POLICY_FILE.hcl"}
    path "{{< placeholder "SECRET_MOUNT_PATH" >}}/*" {
      capabilities = ["read"]
    }
    ```

    **For Example**:

    ```file {title="cloud-credentials-policy.hcl"}
    path "cloud-credentials/*" {
      capabilities = ["read"]
    }
    ```

    This policy grants read access to any secrets within the specified mount path.

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Add the policy to OpenBao, replacing {{< placeholder "POLICY_NAME" >}} (e.g. `cloud-credentials-policy`) and {{< placeholder "POLICY_FILE" >}}:

    ```command
    bao policy write {{< placeholder "POLICY_NAME" >}} /etc/openbao/{{< placeholder "POLICY_FILE" >}}
    ```

    **For Example**:

    ```command
    bao policy write cloud-credentials-policy /etc/openbao/cloud-credentials-policy.hcl
    ```

    ```output
    Success! Uploaded policy: cloud-credentials-policy
    ```

#### Create an AppRole

5.  Create an AppRole for the application that needs access to the secret, replacing {{< placeholder "APPROLE_NAME" >}} (e.g. `cloud-credential-reader-approle`) and {{< placeholder "POLICY_NAME" >}}:

    ```command
    bao write \
        auth/approle/role/{{< placeholder "APPROLE_NAME" >}} \
        token_policies={{< placeholder "POLICY_NAME" >}}
    ```

    **For Example**:

    ```command
    bao write \
        auth/approle/role/cloud-credential-reader-approle \
        token_policies=cloud-credentials-policy
    ```

    ```output
    Success! Data written to: auth/approle/role/cloud-credential-reader-approle
    ```

1.  Verify that the AppRole was written successfully, replacing {{< placeholder "APPROLE_NAME" >}}:

    ```command
    bao read auth/approle/role/{{< placeholder "APPROLE_NAME" >}}
    ```

    **For Example**:

    ```command
    bao read auth/approle/role/cloud-credential-reader-approle
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
    token_policies             [cloud-credentials-secrets-policy]
    token_strictly_bind_ip     false
    token_ttl                  0s
    token_type                 default
    ```

1.  Fetch the AppRole ID, replacing {{< placeholder "APPROLE_NAME" >}}:

    ```command
    bao read auth/approle/role/{{< placeholder "APPROLE_NAME" >}}/role-id
    ```

    **For Example**:

    ```command
    bao read auth/approle/role/cloud-credential-reader-approle/role-id
    ```

    ```output
    Key        Value
    ---        -----
    role_id    c8663988-136f-42de-af40-1dfb94f0c1f6
    ```

#### Generate a Secret ID

8.  Generate a secret ID for the role, replacing {{< placeholder "APPROLE_NAME" >}}:

    ```command
    bao write -f auth/approle/role/{{< placeholder "APPROLE_NAME" >}}/secret-id
    ```

    **For Example**:

    ```command
    bao write -f auth/approle/role/cloud-credential-reader-approle/secret-id
    ```

    ```output
    Key                   Value
    ---                   -----
    secret_id             9b9c27a3-dc27-4eea-921f-773164ec17c7
    secret_id_accessor    20abfad4-029f-45e8-a749-ecc041ff3554
    secret_id_num_uses    0
    secret_id_ttl         0s
    ```

#### Generate an API Token

9.  Generate an API token for the AppRole, supplying the {{< placeholder "APPROLE_ID" >}} (e.g. `c8663988-136f-42de-af40-1dfb94f0c1f6`) and {{< placeholder "APPROLE_SECRET_ID" >}} (e.g. `9b9c27a3-dc27-4eea-921f-773164ec17c7`) from the previous commands:

    ```command
    bao write auth/approle/login \
      role_id="{{< placeholder "APPROLE_ID" >}}" \
      secret_id="{{< placeholder "APPROLE_SECRET_ID" >}}"
    ```

    **For Example**:

    ```command
    bao write auth/approle/login \
      role_id="c8663988-136f-42de-af40-1dfb94f0c1f6" \
      secret_id="9b9c27a3-dc27-4eea-921f-773164ec17c7"
    ```

    ```output
    Key                     Value
    ---                     -----
    token                   s.Q9n7KPnLKSDoYnVdrHnphEml
    token_accessor          LkSCfmBQVCfL8s2eX4EfnqO4
    token_duration          768h
    token_renewable         true
    token_policies          ["cloud-credentials-secrets-policy" "default"]
    identity_policies       []
    policies                ["cloud-credentials-secrets-policy" "default"]
    token_meta_role_name    cloud-credential-reader-approle
    ```

    The resulting AppRole token (e.g. `s.Q9n7KPnLKSDoYnVdrHnphEml`) can be used by a user, machine, or service, such as an infrastructure management application, to authenticate OpenBao API calls, giving the caller authorization to read the cloud provider credentials secrets.

### Storing Secrets

Create the secret store defined in the policy created above.

1.  Enable the KV secrets engine, replacing {{< placeholder "SECRET_MOUNT_PATH" >}}:

    ```command
    bao secrets enable --path={{< placeholder "SECRET_MOUNT_PATH" >}} kv
    ```

    **For Example**:

    ```command
    bao secrets enable --path=cloud-credentials kv
    ```

    ```output
    Success! Enabled the kv secrets engine at: cloud-credentials/
    ```

1.  Store your {{< placeholder "SECRET_VALUE" >}} (e.g. `{ "access_key_id": "AKIA513J2DDRAXCFKXF5", "secret_access_key": "XdqD0BPa8aLFaN+EI8SAYm9U4ZYeXQdMGAIjKD/x" }`) in the {{< placeholder "SECRET_MOUNT_PATH" >}} as a secret named {{< placeholder "SECRET_NAME" >}} (e.g. `provider-a`):

    ```command
    bao kv put --mount={{< placeholder "SECRET_MOUNT_PATH" >}} {{< placeholder "SECRET_NAME" >}} \
      "secret"="{{< placeholder "SECRET_VALUE" >}}"
    ```

    **For Example**:

    ```command
    bao kv put --mount=cloud-credentials provider-a \
      "secret"="{ "access_key_id": "AKIA513J2DDRAXCFKXF5", "secret_access_key": "XdqD0BPa8aLFaN+EI8SAYm9U4ZYeXQdMGAIjKD/x" }"
    ```

    ```output
    Success! Data written to: cloud-credentials/provider-a
    ```

### Retrieving Secrets

1.  While authenticated with the root token, retrieve the secret using the OpenBao CLI, replacing {{< placeholder "SECRET_MOUNT_PATH" >}} and {{< placeholder "SECRET_NAME" >}}:

    ```command
    bao kv get --mount={{< placeholder "SECRET_MOUNT_PATH" >}} {{< placeholder "SECRET_NAME" >}}
    ```

    **For Example**:

    ```command
    bao kv get --mount=cloud-credentials provider-a
    ```

    ```output
    ====== Data ======
    Key                 Value
    ---                 -----
    access_key_id       AKIA513J2DDRAXCFKXF5
    secret_access_key   XdqD0BPa8aLFaN+EI8SAYm9U4ZYeXQdMGAIjKD/x
    ```

1.  Test access using the {{< placeholder "APPROLE_TOKEN" >}} (e.g. `s.36Yb3ijEOJbifprhdEiFtPhR`) saved earlier, your {{< placeholder "SECRET_MOUNT_PATH" >}}, and the {{< placeholder "SECRET_NAME" >}}:

    ```command
    curl --header "X-Vault-Token: {{< placeholder "APPROLE_TOKEN" >}}" \
         --request GET \
         $BAO_ADDR/v1/{{< placeholder "SECRET_MOUNT_PATH" >}}/{{< placeholder "SECRET_NAME" >}} \
         | jq
    ```

    **For Example**:

    ```command
    curl --header "X-Vault-Token: s.36Yb3ijEOJbifprhdEiFtPhR" \
         --request GET \
         $BAO_ADDR/v1/cloud-credentials/provider-a \
         | jq
    ```

    ```output
    {
      "request_id": "92c5026e-bb14-4e2a-8d70-e94fb005183f",
      "lease_id": "",
      "renewable": false,
      "lease_duration": 2764800,
      "data": {
        "access_key_id": "AKIA513J2DDRAXCFKXF5",
        "secret_access_key": "XdqD0BPa8aLFaN+EI8SAYm9U4ZYeXQdMGAIjKD/x"
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

When migrating from Oracle Vault to OpenBao on Akamai Cloud, it's important to ensure your deployment is secure, resilient, and optimized for performance. This section covers key security and high availability considerations to help you maintain a reliable and protected secrets management system.

### Security

For a production-grade OpenBao deployment, security should be a top priority. Protecting secrets from unauthorized access, ensuring secure communication, and enforcing strict access controls are essential to maintaining a secure environment.

-   **Access Control Policies**: Use OpenBao's [policy](https://openbao.org/docs/concepts/policies/) system to enforce RBAC. Define granular policies that grant only the necessary permissions, following the principle of least privilege.
-   **Audit Logging**: Enable [detailed audit logs](https://openbao.org/docs/configuration/log-requests-level/) to track all access and modifications to secrets. OpenBao supports multiple logging backends, such as syslog and file-based logs, to help monitor suspicious activity.
-    **Secrets Lifecycle Management**: Implement automated secrets rotation, revocation, and expiration to ensure secrets do not become stale or overexposed. Consider using dynamic secrets where possible to generate time-limited credentials.
-   **Securing Network Communication**: Configure OpenBao to [use TLS to encrypt](https://openbao.org/docs/configuration/listener/tcp/#configuring-tls) all communications, ensuring data in transit remains secure. Regularly rotate TLS certificates to prevent expiration-related outages and reduce the risk of compromised certificates.

### High Availability

For production environments, OpenBao should be deployed with fault tolerance and scalability in mind. OpenBao’s [Autopilot mode](https://openbao.org/docs/concepts/integrated-storage/autopilot) for [high availability](https://openbao.org/docs/internals/high-availability/) ensures that if the active node fails, the cluster automatically elects a new leader, maintaining uptime without manual intervention. However, to enable seamless failover, organizations must configure their deployment correctly, and proactively monitor system health.

-   **Raft Storage Backend**: Use OpenBao’s [integrated storage](https://openbao.org/docs/internals/integrated-storage/), based on the [Raft protocol](https://thesecretlivesofdata.com/raft/), to enable distributed data replication across multiple nodes. This ensures data consistency and fault tolerance while reducing reliance on external storage backends. Configure regular Raft snapshots for disaster recovery.
-   **Deploy Multiple Nodes**: OpenBao recommends at least five nodes for a [high-availability deployment](https://openbao.org/docs/concepts/ha/). The active node handles all requests, while standby nodes remain ready to take over in case of failure.
-   **Monitor Leader Status**: Use [`bao operator raft list-peers`](https://openbao.org/docs/commands/operator/raft/#list-peers) to check the cluster’s leader and node statuses. This command helps ensure that standby nodes are correctly registered and ready for failover.