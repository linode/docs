---
slug: migrate-from-aws-secrets-manager-to-openbao-on-linode-kubernetes-engine
title: "Migrate From AWS Secrets Manager to OpenBao on Linode Kubernetes Engine"
description: "Learn how to migrate secrets from AWS Secrets Manager to OpenBao on Linode Kubernetes Engine (LKE) using Helm and AppRole authentication."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2025-05-01
keywords: ['aws secrets manager','openbao','migrate secrets from aws','openbao helm install','linode kubernetes engine','eks to openbao','bao kv put','bao approle authentication','open source vault alternative','manage secrets on lke']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[AWS Secrets Manager Documentation](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html)'
- '[OpenBao Configuration Documentation](https://openbao.org/docs/configuration/)'
- '[OpenBao Integrated Storage](https://openbao.org/docs/concepts/integrated-storage/)'
---

This guide walks through how to migrate secrets from AWS Secrets Manager to OpenBao running on Linode.

AWS Secrets Manager is a fully managed service that securely stores and retrieves sensitive information such as database credentials, API keys, and other application secrets. [OpenBao](https://openbao.org/) is an open-source fork of [HashiCorp Vault](https://www.vaultproject.io/) designed to give organizations control over their cryptographic infrastructure. With OpenBao, organizations can deploy, configure, and manage keys and secrets in both cloud and on-premise environments without relying on vendor-managed services.

An organization may choose to migrate from AWS Secrets Manager to OpenBao when it is looking for a cost-effective alternative to secrets management systems offered by major cloud providers.

## Deploy OpenBao on Linode

When migrating from AWS Secrets Manager to OpenBao on Linode, your requirements will dictate whether to install OpenBao on a single Linode Compute Instance or to pursue a larger scale, more fault tolerant environment with OpenBao on Kubernetes through the Linode Kubernetes Engine (LKE). Follow the appropriate guide based on your requirements:

-   [Deploying OpenBao on a Linode Compute Instance](https://docs.google.com/document/d/1x30v1xT_EDuRNnhE9jv5VkFqj9Lo4N3kNO6ICOoSrOM/edit?usp=sharing)
-   [Deploying OpenBao on Kubernetes with Linode LKE](https://docs.google.com/document/d/1gS6hQg09Ufr1Ku0v528acLESnyj1ZpXTxLhkLIlP-u8/edit?usp=sharing)
-   [Deploying OpenBao through the Linode Marketplace](/docs/marketplace-docs/guides/openbao/)

In addition to the prerequisites needed for either of the above deployment methods, you will also need access to your AWS account with sufficient permissions to work with AWS Secrets Manager.

## Migrate from AWS Secrets Manager to OpenBao

When migrating from AWS Secrets Manager to OpenBao deployed on Linode, begin by determining your existing use cases for AWS Secrets Manager.

### Assess Current Secrets Management Requirements in AWS

Review how your organization uses AWS Secrets Manager.

For example, you may have a web application with a corresponding database dependency. Security best practices would dictate that you don’t hardcode secrets—such as database credentials—in the deployed application image or in the source code itself. Instead, the secrets would be injected directly into the deployment at runtime. The application would be granted a role for accessing the credentials in AWS Secrets Manager, which is provided for injection on-the-fly. This keeps the secret safe from being leaked via CI/CD processes or by being checked into a code repository.

### Review Existing Secrets

In the AWS Secrets Manager dashboard, review your existing secrets.

![AWS Secrets Manager showing list of stored secrets.](aws-secrets-manager-dashboard.png)

Alternatively, using the AWS CLI can quickly provide insight into existing secrets and their usage. To list all secrets, run the following command:

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

To retrieve the secret value for a specific secret, use the secret name with the `get-secret-value` command. For example:

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

In AWS Secrets Manager, secrets are stored either as key/value pairs or as plaintext. In the previous example, the single `psql-credentials` secret is a set of key/value pairs. Ensure that you securely handle any exposed secrets, as they will no longer benefit from encryption by AWS Secrets Manager.

AWS Secrets Manager uses AWS IAM to control access to secrets. As an example that adopts role-based access control (RBAC), a role such as `DatabaseReader` might have a policy attached that allows the `secretsmanager:GetSecretValue` action on the `psql-credentials` resource. Then, the web application that accesses the database would be given the `DatabaseReader` role so that it can obtain the secret values which would allow it to connect to the database.

Replicating this setup using OpenBao will involve creating an [application role (AppRole)](https://openbao.org/docs/auth/approle/) to take the place of the AWS IAM role so that applications can use an API token associated with the AppRole to authenticate requests for the secret.

### Authenticate the CLI

First, ensure that the OpenBao server is running.

{{< note >}}
This guide assumes that the `BAO_ADDR` environment variable has been set. If you are working directly on a Linode, then an example value may be `http://0.0.0.0:8200`. If you are using LKE and have set up port forwarding from your cluster to a port on your local machine, then an example value may be `http://127.0.0.1:8200`.
{{< /note >}}

Retrieve the initial root token you were given when OpenBao was initialized. Authenticate the CLI with `bao login`, providing your root token. For example:

```command
bao login --method=token s.36Yb3ijEOJbifprhdEiFtPhR
```

```output
WARNING! The BAO_TOKEN environment variable is set! The value of this variable will take precedence; if this is unwanted please unset BAO_TOKEN or update its value accordingly.

Success! You are now authenticated. The token information displayed below is already stored in the token helper. You do NOT need to run "bao login" again. Future OpenBao requests will automatically use this token.

Key                  Value
---                  -----
token                s.36Yb3ijEOJbifprhdEiFtPhR
token_accessor       ykmfH8QV7E1OU86bth3GMCdf
token_duration       ∞
token_renewable      false
token_policies       ["root"]
identity_policies    []
policies             ["root"]
```

### Unseal the OpenBao Vault

OpenBao uses a [*sealing* and *unsealing* mechanism](https://openbao.org/docs/concepts/seal/) to protect its stored data, ensuring that sensitive information remains encrypted and inaccessible while the data is sealed. When OpenBao starts, it is initially sealed by a distributed key. Authorized users or automation systems must then unseal OpenBao by providing a quorum of key shares, which reassembles the master key and allows access to stored secrets. This architecture ensures that even if the server is compromised, the sensitive data remains protected unless the unseal keys are presented.

Before continuing, unseal the OpenBao vault. With unseal keys in hand, run the following command as many times as necessary to reach quorum (default is three), using a different unseal key for each execution:

```command
bao operator unseal
```

```output
Unseal Key (will be hidden): ********************************************
```

After quorum has been reached, the OpenBao status will show the following:

```output
Key             Value
---             -----
Seal Type       shamir
Initialized     true
Sealed          false
...
```

### Create a Policy and AppRole

Creating and using an OpenBao AppRole involves a few steps.

#### Step #1: Enable AppRole

[Enable the AppRole authentication method](https://openbao.org/docs/auth/approle/#via-the-api-1) with the following CLI command:

```command
bao auth enable approle
```

```output
Success! Enabled approle auth method at: approle/
```

#### Step #2: Create a Policy

In `/etc/openbao`, [create a new policy](https://openbao.org/docs/concepts/policies/) file for reading the secret. For example, a new file called `db-secrets-policy.hcl` would have the following contents:

```file {title="db-secrets-policy.hcl"}
path "database-credentials/*" {
  capabilities = ["read"]
}
```

This policy grants read permissions to any secrets within the `database-credentials` secrets store path. Add the policy to OpenBao with the following command:

```command
bao policy write db-secrets-policy /etc/openbao/db-secrets-policy.hcl
```

```output
Success! Uploaded policy: db-secrets-policy
```

#### Step #3: Create an AppRole with Policy Attached

Create an AppRole for the application that will need to access this secret:

```command
bao write \
  auth/approle/role/web-app-approle \
  token_policies=db-secrets-policy
```

```output
Success! Data written to: auth/approle/role/web-app-approle
```

Verify that the AppRole was written successfully:

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

Fetch the AppRole ID with the following command:

```command
bao read auth/approle/role/web-app-approle/role-id
```

```output
Key        Value
---        -----
role_id    1d41b8be-03d2-6f61-702d-1731c957fd13
```

#### Step #4: Generate secret ID

Generate a secret ID for the role:

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

#### Step #5: Generate API token

Generate an API token for the AppRole, supplying the AppRole ID and the secret ID from the previous commands.

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

The AppRole token (`s.kpKsgWNtYLAktRYQT4BiMVMy` in the previous example) can be used by a user, machine, or service—such a web application—to authenticate OpenBao API calls, giving the caller authorization to read the database credential secret.

### Store the Secret

Create the secret store that is defined in the policy. For this example, all secrets will be stored under the `database-credentials` path. Run the following command:

```command
bao secrets enable --path=database-credentials kv
```

```output
Success! Enabled the kv secrets engine at: database-credentials/
```

The database secret stored at AWS Secrets Manager had the following form:

```
{
  "username": "psqluser",
  "password": "W0H@Z52IGI0VjqoGS3xMkJ9SO533w$fcfrmzs!m$TudDxEe#",
  "engine": "postgres",
  "host": "psql.example-cloud.com",
  "port": "5432",
  "dbname": "web_app_production"
}
```

To store these key-value pairs in OpenBao underneath the `database-credentials` path as a secret named `psql`, run the following command:

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

### Retrieve the Secret

To retrieve this secret with the OpenBao CLI, while still authenticated with the root token, run the following command:

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

Test that the AppRole can retrieve the secret, using the AppRole token saved earlier:

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

This API token can be used in applications and services to access the database credentials. According to the [documentation](https://openbao.org/api-docs/libraries/), “OpenBao intends to remain API compatible with HashiCorp Vault. This means that most of the existing libraries for Vault should also work with OpenBao.” Vault has [client libraries](https://developer.hashicorp.com/vault/api-docs/libraries) for various programming languages:

-   [Go](https://github.com/hashicorp/vault/tree/main/api)
-   [Ruby](https://github.com/hashicorp/vault-ruby)
-   [C#](https://github.com/rajanadar/VaultSharp)
-   [Java](https://developer.hashicorp.com/vault/api-docs/libraries#java)
-   [Kotlin](https://github.com/kunickiaj/vault-kotlin)
-   [Node.js](https://developer.hashicorp.com/vault/api-docs/libraries#node-js)
-   [PHP](https://developer.hashicorp.com/vault/api-docs/libraries#php)
-   [Python](https://github.com/hvac/hvac)

### Convert Existing Secrets from AWS Secrets Manager to OpenBao

The above steps outline how to migrate a single secret stored in AWS Secrets Manager to OpenBao on Linode, using RBAC for authorizing an application to read that secret with an API token. Migrating the remainder of your secrets stored in AWS Secrets Manager involves iterating on the following process:

1.  Retrieve the secret in AWS.
1.  Determine which entities (users, machines, and services) need read or write access to that secret.
1.  Create a permissions policy and attach it to an AppRole in OpenBao.
1.  Generate an API token for the AppRole.
1.  Update any entity code or configurations to use the API token to access the secret in OpenBao.

## Production Considerations

When migrating from AWS Secrets Manager to OpenBao on Linode, it's important to ensure your deployment is secure, resilient, and optimized for performance. This section covers key security and high availability considerations to help you maintain a reliable and protected secrets management system.

### Security

For a production-grade OpenBao deployment, security should be a top priority. Protecting secrets from unauthorized access, ensuring secure communication, and enforcing strict access controls are essential to maintaining a secure environment.

-   **Access control policies**: Use OpenBao's [policy](https://openbao.org/docs/concepts/policies/) system to enforce RBAC. Define granular policies that grant only the necessary permissions, following the principle of least privilege.
-   **Audit logging**: Enable [detailed audit logs](https://openbao.org/docs/configuration/log-requests-level/) to track all access and modifications to secrets. OpenBao supports multiple logging backends, such as syslog and file-based logs, to help monitor suspicious activity.
-   **Secrets lifecycle management**: Implement automated secrets rotation, revocation, and expiration to ensure secrets do not become stale or overexposed. Consider using dynamic secrets where possible to generate time-limited credentials.
-   **Securing network communication**: Configure OpenBao to [use TLS for encrypting](https://openbao.org/docs/configuration/listener/tcp/#configuring-tls) all communications, ensuring data in transit remains secure. Regularly rotate TLS certificates to prevent expiration-related outages and reduce the risk of compromised certificates.

### High Availability

For production environments, OpenBao should be deployed with fault tolerance and scalability in mind. OpenBao’s [Autopilot mode](https://openbao.org/docs/concepts/integrated-storage/autopilot) for [high availability](https://openbao.org/docs/internals/high-availability/) ensures that if the active node fails, the cluster automatically elects a new leader, maintaining uptime without manual intervention. However, to enable seamless failover, organizations must configure their deployment correctly and proactively monitor system health.

-   **Raft storage backend**: Use OpenBao’s [integrated storage](https://openbao.org/docs/internals/integrated-storage/), based on the [Raft protocol](https://thesecretlivesofdata.com/raft/), to enable distributed data replication across multiple nodes. This ensures data consistency and fault tolerance while reducing reliance on external storage backends. Configure regular Raft snapshots for disaster recovery.
-   **Deploy multiple nodes**: OpenBao recommends at least five nodes for a [high-availability deployment](https://openbao.org/docs/concepts/ha/). The active node handles all requests, while standby nodes remain ready to take over in case of failure.
-   **Monitor leader status**: Use [bao operator raft list-peers](https://openbao.org/docs/commands/operator/raft/#list-peers) to check the cluster’s leader and node statuses. This command helps ensure that standby nodes are correctly registered and ready for failover.