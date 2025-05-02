---
slug: migrate-from-gcp-secret-manager-to-openbao-on-linode-kubernetes-engine
title: "Migrate From GCP Secret Manager to OpenBao on Linode Kubernetes Engine"
description: "Migrate secrets from GCP Secret Manager to OpenBao on Linode Kubernetes Engine (LKE) using Helm charts and role-based access policies."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2025-05-01
keywords: ['gcp secret manager','openbao','migrate secrets from gcp','openbao helm install','linode kubernetes engine','gke to openbao','bao kv put','bao approle authentication','open source vault alternative','manage secrets on lke']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Google Cloud Secret Manager Documentation](https://cloud.google.com/secret-manager/docs)'
- '[gcloud secrets documentation](https://cloud.google.com/sdk/gcloud/reference/secrets)'
- '[OpenBao Configuration Documentation](https://openbao.org/docs/configuration/)'
- '[OpenBao Integrated Storage](https://openbao.org/docs/concepts/integrated-storage/)'
---

This guide walks through how to migrate GCP Secret Manager secrets to OpenBao running Linode.

GCP Secret Manager is a managed service designed to securely store and access sensitive information, such as API keys, passwords, certificates, and other confidential data. It integrates with GCP services. [OpenBao](https://openbao.org/) is an open-source fork of [HashiCorp Vault](https://www.vaultproject.io/) designed to give organizations control over their cryptographic infrastructure. With OpenBao, organizations can deploy, configure, and manage keys and secrets in both cloud and on-premises environments without relying on vendor-managed services.

By considering the specific security and compliance needs of the organization, teams can determine whether the flexibility and cost-effectiveness of OpenBao or the managed convenience of GCP Secret Manager better align with their requirements.

## Deploy OpenBao on Linode

When migrating from GCP Secret Manager to OpenBao on Linode, your requirements will dictate whether to install OpenBao on a single Linode Compute Instance or to pursue a larger scale, more fault tolerant environment with OpenBao on Kubernetes through the Linode Kubernetes Engine (LKE). Follow the appropriate guide based on your requirements:

-   [Deploying OpenBao on a Linode Compute Instance](https://docs.google.com/document/d/1x30v1xT_EDuRNnhE9jv5VkFqj9Lo4N3kNO6ICOoSrOM/edit?usp=sharing)
-   [Deploying OpenBao on Kubernetes with Linode LKE](https://docs.google.com/document/d/1gS6hQg09Ufr1Ku0v528acLESnyj1ZpXTxLhkLIlP-u8/edit?usp=sharing)
-   [Deploying OpenBao through the Linode Marketplace](/docs/marketplace-docs/guides/openbao/)

In addition to the prerequisites needed for either of the above deployment methods, you will also need access to your GCP account with sufficient permissions to work with GCP Secret Manager.

## Migrate from GCP Secret Manager to OpenBao

When migrating from GCP Secret Manager to OpenBao deployed on Linode, begin by determining your existing use cases for GCP Secret Manager.

### Assess Current Secrets Management Requirements in GCP

Review how your organization uses GCP Secret Manager.

For example, you may have a web application which validates the authenticity of JSON Web Tokens (JWT) by verifying its signature. Security best practices would dictate that you don’t hardcode—in the deployed application image or in the source code itself—the JWT signing secret used for verification. Instead, the secret would be injected directly into the deployment at runtime. The application would be granted a role for accessing the JWT signing secret in GCP Secret Manager, which is provided for injection on-the-fly. This keeps the secret safe from being leaked via CI/CD processes or by being checked into a code repository.

### Review Existing Secrets

In the GCP Secret Manager dashboard, review your existing secrets.

![GCP Secret Manager UI showing list of stored secrets.](gcp-secret-manager-secret-list.png)

Alternatively, use the Google Cloud CLI (`gcloud`) to provide insight into your existing secrets and their usage. Authenticate the CLI. Then, [set the `gcloud` configuration to your current project](https://cloud.google.com/sdk/gcloud/reference/config/set). For example:

```command
gcloud auth login
gcloud config set project ecommerce-application-454116
```

To [list all secrets](https://cloud.google.com/sdk/gcloud/reference/secrets/list), run the following command:

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

To see the [value of the latest version for a single secret](https://cloud.google.com/sdk/gcloud/reference/secrets/versions/access), run the following command:

```command
gcloud secrets versions access latest --secret=jwt-signing-secret
```

```output
EU&&7O^#c2GAMIdRyJlZkPEdoWKgy%CW
```

Ensure that you securely handle any exported secrets, as they will no longer benefit from encryption by GCP Secret Manager.

Alternatively, secrets can be viewed in the GCP UI by selecting the secret, finding the latest version, and clicking **Actions > View secret value**.

![GCP Secret Manager UI displaying how to value of a selected secret.](gcp-secret-manager-secret-value.png)

GCP uses IAM to manage roles and principals with access to a particular secret. For example, a GCP Compute Instance might run an API that handles authentication for a web application. That workload may have an IAM role called `JWTSigner`, and the role has an attached policy which gives it read access to the `jwt-signing-secret` value in GCP Secret Manager.

Replicating this setup using OpenBao involves the following steps:

1.  Create an OpenBao [application role (AppRole)](https://openbao.org/docs/auth/approle/) that will take the place of the GCP IAM role.
1.  Store the JWT signing secret in the OpenBao [key/value (KV) store](https://openbao.org/docs/secrets/kv/).
1.  Verify successful secret access with the API token associated with the AppRole.
1.  Assign the AppRole to the applications that need access to the secret.

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

Before continuing, unseal the OpenBao vault.

### Create a Policy and AppRole

Creating and using an OpenBao AppRole involves a few steps:

1.  [Enable the AppRole authentication method](https://openbao.org/docs/auth/approle/#via-the-api-1).
1.  [Create a policy](https://openbao.org/docs/concepts/policies/).
1.  Create an AppRole, attaching the newly created policy.
1.  Generate a [secret ID](https://developer.hashicorp.com/vault/docs/concepts/policies#policy-syntax) for the AppRole.
1.  Generate an API token for the AppRole.

Enable the AppRole authentication method with the following CLI command:

```command
bao auth enable approle
```

```output
Success! Enabled approle auth method at: approle/
```

In `/etc/openbao`, create a new policy file for reading the secret. For example, a new file called `jwt-secrets-policy.hcl` would have the following contents:

```file {title="jwt-secrets-policy.hcl"}
path "jwt/*" {
  capabilities = ["read"]
}
```

This policy grants read permissions to any secrets within the `jwt` secrets store path. Add the policy to OpenBao with the following command:

```command
bao policy write jwt-secrets-policy /etc/openbao/jwt-secrets-policy.hcl
```

```output
Success! Uploaded policy: jwt-secrets-policy
```

Create an AppRole for the application that will need to access this secret:

```command
bao write \
  auth/approle/role/app-authenticator-approle \
  token_policies=jwt-secrets-policy
```

```output
Success! Data written to: auth/approle/role/app-authenticator-approle
```

Verify that the AppRole was written successfully:

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

Fetch the AppRole ID with the following command:

```command
bao read auth/approle/role/app-authenticator-approle/role-id
```

```output
Key        Value
---        -----
role_id    019e2cc5-b8ce-4aa4-91b9-c2c9e9e59863
```

Generate a secret ID for the role:

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

Generate an API token for the AppRole, supplying the AppRole ID and the secret ID from the previous commands.

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

The AppRole token (`s.dy572yUtTNvHTZgIoxdNVO41` in the previous example) can be used by a user, machine, or service—such as the authentication API for a web application—to authenticate OpenBao API calls, giving the caller authorization to read the JWT signing secret.

### Store the Secret

Create the secret store that is defined in the policy. For this example, all secrets will be stored under the `jwt` path. Run the following command:

```command
bao secrets enable --path=jwt kv
```

```output
Success! Enabled the kv secrets engine at: jwt/
```

The JWT signing secret stored at GCP Secret Manager was a simple string:

```
EU&&7O^#c2GAMIdRyJlZkPEdoWKgy%CW
```

To store this as a key-value pair in OpenBao underneath the `jwt` path as a secret named signer, run the following command:

```command
bao kv put --mount=jwt signer \
  "secret"="EU&&7O^#c2GAMIdRyJlZkPEdoWKgy%CW"
```

```output
Success! Data written to: jwt/signer
```

### Retrieve the Secret

To retrieve this secret with the OpenBao CLI, while still authenticated with the root token, run the following command:

```command
bao kv get --mount=jwt signer
```

```output
====== Data ======
Key         Value
---         -----
secret      EU&&7O^#c2GAMIdRyJlZkPEdoWKgy%CW
```

Test that the AppRole can retrieve the secret, using the AppRole token saved earlier:

```command
curl --header "X-Vault-Token: s.36Yb3ijEOJbifprhdEiFtPhR" \
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

This API token can be used in applications and services to access the JWT signing secret. According to the [documentation](https://openbao.org/api-docs/libraries/), “OpenBao intends to remain API compatible with HashiCorp Vault. This means that most of the existing libraries for Vault should also work with OpenBao.” Vault has [client libraries](https://developer.hashicorp.com/vault/api-docs/libraries) for various programming languages:

-   [Go](https://github.com/hashicorp/vault/tree/main/api)
-   [Ruby](https://github.com/hashicorp/vault-ruby)
-   [C#](https://github.com/rajanadar/VaultSharp)
-   [Java](https://developer.hashicorp.com/vault/api-docs/libraries#java)
-   [Kotlin](https://github.com/kunickiaj/vault-kotlin)
-   [Node.js](https://developer.hashicorp.com/vault/api-docs/libraries#node-js)
-   [PHP](https://developer.hashicorp.com/vault/api-docs/libraries#php)
-   [Python](https://github.com/hvac/hvac)

### Convert Existing Secrets from GCP Secret Manager to OpenBao

The above steps outline how to migrate a single secret stored in GCP Secret Manager to OpenBao on Linode, using RBAC for authorizing an application to read that secret with an API token. Migrating the remainder of your secrets stored in GCP Secret Manager involves iterating on the following process:

1.  Retrieve the secret in GCP.
1.  Determine which entities (users, machines, and services) need read or write access to that secret.
1.  Create a permissions policy and attach it to an AppRole in OpenBao.
1.  Generate an API token for the AppRole.
1.  Update any entity code or configurations to use the API token to access the secret in OpenBao.

## Production Considerations

When migrating from GCP Secret Manager to OpenBao on Linode, it's important to ensure your deployment is secure, resilient, and optimized for performance. This section covers key security and high availability considerations to help you maintain a reliable and protected secrets management system.

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