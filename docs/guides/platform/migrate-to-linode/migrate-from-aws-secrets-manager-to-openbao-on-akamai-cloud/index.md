---
slug: migrate-from-aws-secrets-manager-to-openbao-on-akamai-cloud
title: "Migrate From AWS Secrets Manager to OpenBao on Akamai Cloud"
description: "Learn how to migrate secrets from AWS Secrets Manager to OpenBao on Linode Kubernetes Engine (LKE) using Helm and AppRole authentication."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2025-05-30
keywords: ['aws secrets manager','openbao','migrate secrets from aws','openbao helm install','linode kubernetes engine','eks to openbao','bao kv put','bao approle authentication','open source vault alternative','manage secrets on lke']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[AWS Secrets Manager Documentation](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html)'
- '[OpenBao Configuration Documentation](https://openbao.org/docs/configuration/)'
- '[OpenBao Integrated Storage](https://openbao.org/docs/concepts/integrated-storage/)'
- '[OpenBao GitHub](https://github.com/openbao/openbao)'
---

[OpenBao](https://openbao.org/) is an open source secrets management tool and fork of [HashiCorp Vault](https://www.vaultproject.io/) that provides teams control over how secrets are stored, encrypted, and accessed. OpenBao can be self-hosted in any environment, including on-premises and across multiple clouds.

[AWS Secrets Manager](https://aws.amazon.com/secrets-manager/) is Amazon's platform-integrated, managed secrets service that securely stores and retrieves sensitive information such as database credentials, API keys, and other application secrets.

This guide provides steps and considerations for how to migrate secrets stored in AWS Secrets Manager to OpenBao running on Akamai Cloud.

## Before You Begin

1.  Follow our [Get Started](https://techdocs.akamai.com/cloud-computing/docs/getting-started) guide to create an Akamai Cloud account if you do not already have one.

1.  Ensure that you have access to your AWS cloud platform account with sufficient permissions to work with AWS Secrets Manager. The [AWS CLI](https://aws.amazon.com/cli/) and [`eksctl`](https://eksctl.io/) must also be installed and configured.

1.  Install `jq`, a lightweight command line JSON processor.

1.  When migrating from AWS Secrets Manager to OpenBao on Akamai Cloud, OpenBao should be deployed before you begin. OpenBao can be installed on a single Linode instance or deployed to a multi-node cluster using Linode Kubernetes Engine (LKE). Follow the appropriate guide below based on your production needs:

    -   [Deploying OpenBao on a Linode Instance](/docs/guides/deploying-openbao-on-a-linode-instance/)
    -   [Deploy OpenBao on Linode Kubernetes Engine](/docs/guides/deploy-openbao-on-linode-kubernetes-engine/)
    -   [Deploying OpenBao through the Linode Marketplace](/docs/marketplace-docs/guides/openbao/)

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see our [Users and Groups](/docs/guides/linux-users-and-groups/) doc.
{{< /note >}}

### Using This Guide

This tutorial contains a number of placeholders that are intended to be replaced by your own unique values. For reference purposes, the table below lists these placeholders, what they represent, and the example values used in this guide:

| Placeholder                             | Represents                                               | Example Value                                              |
|-----------------------------------------|----------------------------------------------------------|------------------------------------------------------------|
| {{< placeholder "AWS_SECRET_NAME" >}}   | The name of the secret in AWS.                           | `psql`                                                     |
| {{< placeholder "POLICY_FILE" >}}       | The name of the file containing the OpenBao policy.      | `db-secrets-policy.hcl`                                    |
| {{< placeholder "SECRET_MOUNT_PATH" >}} | The KV mount path used in OpenBao to organize secrets.   | `database-credentials`                                     |
| {{< placeholder "POLICY_NAME" >}}       | The internal name for the policy in OpenBao.             | `db-secrets-policy`                                        |
| {{< placeholder "APPROLE_NAME" >}}      | The name of the AppRole in OpenBao.                      | `web-app-approle`                                          |
| {{< placeholder "APPROLE_ID" >}}        | The role ID generated for the AppRole by OpenBao.        | `1d41b8be-03d2-6f61-702d-1731c957fd13`                     |
| {{< placeholder "APPROLE_SECRET_ID" >}} | The secret ID generated for the AppRole by OpenBao.      | `4eb6e604-681c-3fc3-bedd-a2dc774955bb`                     |
| {{< placeholder "APPROLE_TOKEN" >}}     | The API token retrieved from OpenBao using the AppRole.  | `s.kpKsgWNtYLAktRYQT4BiMVMy`                               |
| {{< placeholder "SECRET_NAME" >}}       | The name of the secret to store in OpenBao.              | `psql`                                                     |
| {{< placeholder "SECRET_KEY" >}}        | The key of the secret to store in OpenBao.               | `username`, `password`, `engine`, `host`, `port`, `dbname` |
| {{< placeholder "SECRET_VALUE" >}}      | The value of the secret to store in OpenBao.             | `psqluser`, `W0H@Z52IGI0VjqoGS3xMkJ9SO533w$fcfrmzs.vault-tokenTudDxEe\#`, `postgres`, `psql.example-cloud.com`, `5432`, `web_app_production` |

{{< note title="All Values Have Been Sanitized" >}}
All of the example values used in this guide are purely examples to mimic and display the format of actual secrets. Nothing listed is a real credential to any existing system.

When creating your own values, **do not** use any of the above credentials.
{{< /note >}}

## Review Existing Secrets in AWS Secrets Manager

Before migrating to OpenBao, evaluate how your organization currently uses AWS Secrets Manager.

For example, a web application might rely on database credentials stored in AWS Secrets Manager. Rather than embedding these credentials in source code or container images, the application is assigned a role that allows it to retrieve them securely at runtime. This prevents secrets from being exposed through version control or CI/CD pipelines.

OpenBao supports similar access workflows using dynamic injection, AppRole-based access control, and integration with Kubernetes workloads.

{{< note type="warning" >}}
Ensure that you securely handle any exposed secrets or other sensitive data, as they no longer benefit from encryption by AWS Secrets Manager.
{{< /note >}}

### Review Secrets Using the AWS Console

In the **AWS Secrets Manager** dashboard, navigate to the **Secrets** menu to review your existing secrets and their descriptions.

The below example secrets are used throughout this guide.

![AWS Secrets Manager showing list of stored secrets.](aws-secrets-manager-dashboard.png)

### Review Secrets Using the AWS CLI

Alternatively, the AWS CLI can quickly provide insight into existing secrets and their usage.

1.  Run the following AWS CLI command to list all secrets:

    ```command
    aws secretsmanager list-secrets --query 'SecretList[*].Name'
    ```

    ```output
    [
        "psql-credentials",
        "jwt-signing-secret",
        "shipping_service_api_key"
    ]
    ```

1.  To retrieve the value for a specific secret, use the {{< placeholder "AWS_SECRET_NAME" >}} (e.g. `jwt-signing-secret`) with the `get-secret-value` command:

    ```command
    aws secretsmanager get-secret-value \
      --secret-id {{< placeholder "AWS_SECRET_NAME" >}} \
      --query SecretString \
      --output text \
      | jq
    ```

    **For Example**:

    ```command
    aws secretsmanager get-secret-value \
      --secret-id psql-credentials \
      --query SecretString \
      --output text \
      | jq
    ```

    ```output
    {
      "username": "psqluser",
      "password": "W0H@Z52IGI0VjqoGS3xMkJ9SO533w$fcfrmzs!m$TudDxEe#",
      "engine": "postgres",
      "host": "psql.example-cloud.com",
      "port": "5432",
      "dbname": "web_app_production"
    }
    ```

AWS Secrets Manager secrets are stored either as key/value pairs or as plaintext. In the previous example, the single `psql-credentials` secret is a set of key/value pairs.

AWS Secrets Manager uses AWS Identity and Access Management (IAM) to control access to secrets. As an example of role-based access control (RBAC), a role such as `DatabaseReader` might have an attached policy that allows the `secretsmanager:GetSecretValue` action on the `psql-credentials` resource. Here, the web application that accesses the database would be given the `DatabaseReader` role so that it can obtain the secret values that allow it to connect to the database.

Replicating this setup using OpenBao involves creating an [application role (AppRole)](https://openbao.org/docs/auth/approle/) to take the place of the AWS IAM role. This allows applications to use an API token associated with the AppRole to authenticate requests for the secret.

## Access Your OpenBao Deployment on Akamai Cloud

The following steps focus on migrating secrets into your OpenBao deployment on Akamai Cloud. You should already have a running OpenBao instance on either a standalone Linode instance, in an LKE cluster, or deployed via the Linode Marketplace.

If your OpenBao environment is not yet ready, refer to the appropriate deployment guide listed in the [Before You Begin](#before-you-begin) section and complete the setup.

Once deployed, log into your OpenBao environment. Before continuing, verify that:

-   OpenBao is successfully initialized.
-   The vault is unsealed.
-   The `BAO_ADDR` environment variable is set.
-   You are authenticated using the root token.

### Create a Policy and AppRole

Use AppRoles to replicate AWS IAM-style access control in OpenBao. In AWS Secrets Manager, applications typically assume IAM roles (e.g. `DatabaseReader`) that permit secret retrieval via policies like `secretsmanager:GetSecretValue`. In OpenBao, equivalent functionality is achieved through policy-bound AppRoles that authorize secrets access through token-based authentication.

Follow these steps to create an OpenBao AppRole that mimics the IAM-based access used in AWS Secrets Manager.

#### Enable AppRole

1.  [Enable the AppRole authentication method](https://openbao.org/docs/auth/approle/#via-the-api-1):

    ```command
    bao auth enable approle
    ```

    ```output
    Success! Enabled approle auth method at: approle/
    ```

#### Create a Policy

2.  Using a text editor like `nano`, create a new `.hcl` [policy file](https://openbao.org/docs/concepts/policies/) in `/etc/openbao`, replacing {{< placeholder "POLICY_FILE" >}} (e.g. `db-secrets-policy.hcl`) with a policy filename of your choosing:

    ```command
    sudo nano /etc/openbao/{{< placeholder "POLICY_FILE" >}}
    ```

    **For Example:**

    ```command
    sudo nano /etc/openbao/db-secrets-policy.hcl
    ```

1.  Give the file the following contents, replacing {{< placeholder "SECRET_MOUNT_PATH" >}} (e.g. `database-credentials`) with your chosen mount path:

    ```file {title="POLICY_FILE.hcl"}
    path "{{< placeholder "SECRET_MOUNT_PATH" >}}/*" {
      capabilities = ["read"]
    }
    ```

    **For Example**:

    ```file {title="db-secrets-policy.hcl"}
    path "database-credentials/*" {
      capabilities = ["read"]
    }
    ```

    This policy grants read access to any secrets within the specified mount path.

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Add the policy to OpenBao, replacing {{< placeholder "POLICY_NAME" >}} (e.g. `db-secrets-policy`) and {{< placeholder "POLICY_FILE" >}}:

    ```command
    bao policy write {{< placeholder "POLICY_NAME" >}} /etc/openbao/{{< placeholder "POLICY_FILE" >}}
    ```

    **For Example**:

    ```command
    bao policy write db-secrets-policy /etc/openbao/db-secrets-policy.hcl
    ```

    ```output
    Success! Uploaded policy: db-secrets-policy
    ```

#### Create an AppRole

5.  Create an AppRole for the application that needs access to the secret, replacing {{< placeholder "APPROLE_NAME" >}} (e.g. `web-app-approle`) and {{< placeholder "POLICY_NAME" >}}:

    ```command
    bao write auth/approle/role/{{< placeholder "APPROLE_NAME" >}} token_policies={{< placeholder "POLICY_NAME" >}}
    ```

    **For Example**:

    ```command
    bao write auth/approle/role/web-app-approle token_policies=db-secrets-policy
    ```

    ```output
    Success! Data written to: auth/approle/role/web-app-approle
    ```

1.  Verify that the AppRole was written successfully, replacing {{< placeholder "APPROLE_NAME" >}}:

    ```command
    bao read auth/approle/role/{{< placeholder "APPROLE_NAME" >}}
    ```

    **For Example**:

    ```command
    bao read auth/approle/role/web-app-approle
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
    token_policies             [db-secrets-policy]
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
    bao read auth/approle/role/web-app-approle/role-id
    ```

    ```output
    Key        Value
    ---        -----
    role_id    1d41b8be-03d2-6f61-702d-1731c957fd13
    ```

#### Generate a Secret ID

8.  Generate a secret ID for the role, replacing {{< placeholder "APPROLE_NAME" >}}:

    ```command
    bao write -f auth/approle/role/{{< placeholder "APPROLE_NAME" >}}/secret-id
    ```

    **For Example**:

    ```command
    bao write -f auth/approle/role/web-app-approle/secret-id
    ```

    ```output
    Key                   Value
    ---                   -----
    secret_id             4eb6e604-681c-3fc3-bedd-a2dc774955bb
    secret_id_accessor    fe899dc6-85f7-f596-fb93-3c961f7919a9
    secret_id_num_uses    0
    secret_id_ttl         0s
    ```

#### Generate an API Token

9.  Generate an API token for the AppRole, supplying the {{< placeholder "APPROLE_ID" >}} (e.g. `1d41b8be-03d2-6f61-702d-1731c957fd13`) and the {{< placeholder "APPROLE_SECRET_ID" >}} (e.g. `4eb6e604-681c-3fc3-bedd-a2dc774955bb`) from the previous commands:

    ```command
    bao write auth/approle/login \
      role_id="{{< placeholder "APPROLE_ID" >}}" \
      secret_id="{{< placeholder "APPROLE_SECRET_ID" >}}"
    ```

    **For Example**:

    ```command
    bao write auth/approle/login \
      role_id="1d41b8be-03d2-6f61-702d-1731c957fd13" \
      secret_id="4eb6e604-681c-3fc3-bedd-a2dc774955bb"
    ```

    ```output
    Key                     Value
    ---                     -----
    token                   s.kpKsgWNtYLAktRYQT4BiMVMy
    token_accessor          Rwlq5EmvrHC8VvvHwoRyJzUh
    token_duration          768h
    token_renewable         true
    token_policies          ["db-secrets-policy" "default"]
    identity_policies       []
    policies                ["db-secrets-policy" "default"]
    token_meta_role_name    web-app-approle
    ```

    The resulting AppRole token (e.g. `s.kpKsgWNtYLAktRYQT4BiMVMy`) can be used by a user, machine, or service (e.g. a web application) to authenticate OpenBao API calls and read the database credential secret.

### Storing Secrets

Create the secret store defined in the policy created above.

1.  Enable the KV secrets engine, replacing {{< placeholder "SECRET_MOUNT_PATH" >}}:

    ```command
    bao secrets enable --path={{< placeholder "SECRET_MOUNT_PATH" >}} kv
    ```

    **For Example**:

    ```command
    bao secrets enable --path=database-credentials kv
    ```

    ```output
    Success! Enabled the kv secrets engine at: database-credentials/
    ```

1.  The example secret in AWS Secrets Manager contains multiple fields formatted as a JSON object. To replicate this structure, store each field as a separate key/value pair in the {{< placeholder "SECRET_MOUNT_PATH" >}} under the secret name {{< placeholder "SECRET_NAME" >}} (e.g. `psql`):

    ```command
    bao kv put --mount={{< placeholder "SECRET_MOUNT_PATH" >}} {{< placeholder "SECRET_NAME" >}} \
      "{{< placeholder "SECRET_KEY_1" >}}"="{{< placeholder "SECRET_VALUE_1" >}}" \
      "{{< placeholder "SECRET_KEY_2" >}}"="{{< placeholder "SECRET_VALUE_2" >}}" \
      "{{< placeholder "SECRET_KEY_3" >}}"="{{< placeholder "SECRET_VALUE_3" >}}" \
      "{{< placeholder "SECRET_KEY_4" >}}"="{{< placeholder "SECRET_VALUE_4" >}}" \
      "{{< placeholder "SECRET_KEY_5" >}}"="{{< placeholder "SECRET_VALUE_5" >}}" \
      "{{< placeholder "SECRET_KEY_6" >}}"="{{< placeholder "SECRET_VALUE_6" >}}"
    ```

    **For Example**:

    ```command
    bao kv put --mount=database-credentials psql \
      "username"="psqluser" \
      "password"="W0H@Z52IGI0VjqoGS3xMkJ9SO533w$fcfrmzs.vault-tokenTudDxEe\#"  \
      "engine"="postgres" \
      "host"="psql.example-cloud.com" \
      "port"="5432" \
      "dbname"="web_app_production"
    ```

    ```output
    Success! Data written to: database-credentials/psql
    ```

### Retrieving Secrets

1.  While authenticated with the root token, retrieve the secret using the OpenBao CLI (`bao`), replacing {{< placeholder "SECRET_MOUNT_PATH" >}} and {{< placeholder "SECRET_NAME" >}}:

    ```command
    bao kv get --mount={{< placeholder "SECRET_MOUNT_PATH" >}} {{< placeholder "SECRET_NAME" >}}
    ```

    **For Example**:

    ```command
    bao kv get --mount=database-credentials psql
    ```

    ```output
    ====== Data ======
    Key         Value
    ---         -----
    dbname      web_app_production
    engine      postgres
    host        psql.example-cloud.com
    password    W0H@Z52IGI0VjqoGS3xMkJ9SO533w.vault-tokenTudDxEe\#
    port        5432
    username    psqluser
    ```

1.  Test access using the {{< placeholder "APPROLE_TOKEN" >}} saved earlier (e.g. `s.36Yb3ijEOJbifprhdEiFtPhR`), your {{< placeholder "SECRET_MOUNT_PATH" >}}, and the {{< placeholder "SECRET_NAME" >}}:

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
         $BAO_ADDR/v1/database-credentials/psql \
         | jq
    ```

    ```output
    {
      "request_id": "00237a0b-4349-351d-50a0-ef127534ed18",
      "lease_id": "",
      "renewable": false,
      "lease_duration": 2764800,
      "data": {
        "dbname": "web_app_production",
        "engine": "postgres",
        "host": "psql.example-cloud.com",
        "password": "W0H@Z52IGI0VjqoGS3xMkJ9SO533w.vault-tokenTudDxEe#",
        "port": "5432",
        "username": "psqluser"
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

When migrating workloads from AWS Secrets Manager across providers to OpenBao on Akamai Cloud, it's important to ensure your deployment is secure, resilient, and optimized for performance. This section covers key security and high availability considerations to help you maintain a reliable and protected secrets management system.

### Security

Security should be a top priority for a production-grade OpenBao deployment. Protecting secrets from unauthorized access, ensuring secure communication, and enforcing strict access controls are essential to maintaining a secure environment.

-   **Access Control Policies**: Use OpenBao's [policy](https://openbao.org/docs/concepts/policies/) system to enforce RBAC. Define granular policies that grant only the necessary permissions, following the principle of least privilege.
-   **Audit Logging**: Enable [detailed audit logs](https://openbao.org/docs/configuration/log-requests-level/) to track all access and modifications to secrets. OpenBao supports multiple logging backends, such as `syslog` and file-based logs, to help monitor suspicious activity.
-   **Secrets Lifecycle Management**: Implement automated secrets rotation, revocation, and expiration to ensure secrets do not become stale or overexposed. Consider using dynamic secrets where possible to generate time-limited credentials.
-   **Securing Network Communication**: [Configure OpenBao to use TLS](https://openbao.org/docs/configuration/listener/tcp/#configuring-tls) to encrypt all communications, ensuring data in transit remains secure. Regularly rotate TLS certificates to prevent expiration-related outages and reduce the risk of compromised certificates.

### High Availability

Production-grade OpenBao environments should be deployed with fault tolerance and scalability in mind. OpenBao’s [Autopilot mode](https://openbao.org/docs/concepts/integrated-storage/autopilot) for [high availability](https://openbao.org/docs/internals/high-availability/) ensures that if the active node fails, the cluster automatically elects a new leader, maintaining uptime without manual intervention. However, to enable seamless failover, organizations must configure their deployment correctly, and proactively monitor system health.

-   **Raft Storage Backend**: Use OpenBao’s [integrated storage](https://openbao.org/docs/internals/integrated-storage/), based on the [Raft protocol](https://thesecretlivesofdata.com/raft/), to enable distributed data replication across multiple nodes. This ensures data consistency and fault tolerance while reducing reliance on external storage backends. Configure regular Raft snapshots for disaster recovery.
-   **Deploy Multiple Nodes**: OpenBao recommends at least five nodes for a [high-availability deployment](https://openbao.org/docs/concepts/ha/). The active node handles all requests, while standby nodes remain ready to take over in case of failure.
-   **Monitor Leader Status**: Use [`bao operator raft list-peers`](https://openbao.org/docs/commands/operator/raft/#list-peers) to check the cluster’s leader and node statuses. This command helps ensure that standby nodes are correctly registered and ready for failover.