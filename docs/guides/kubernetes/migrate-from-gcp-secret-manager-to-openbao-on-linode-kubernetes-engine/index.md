---
slug: migrate-from-gcp-secret-manager-to-openbao-on-linode-kubernetes-engine
title: "Migrate From Gcp Secret Manager to Openbao on Linode Kubernetes Engine"
description: "Two to three sentences describing your guide."
og_description: "Optional two to three sentences describing your guide when shared on social media. If omitted, the `description` parameter is used within social links."
authors: ["Linode"]
contributors: ["Linode"]
published: 2025-05-01
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

This guide walks through how to migrate GCP Secret Manager secrets to OpenBao running Linode.

GCP Secret Manager is a managed service designed to securely store and access sensitive information, such as API keys, passwords, certificates, and other confidential data. It integrates with GCP services. [OpenBao](https://openbao.org/) is an open-source fork of [HashiCorp Vault](https://www.vaultproject.io/) designed to give organizations control over their cryptographic infrastructure. With OpenBao, organizations can deploy, configure, and manage keys and secrets in both cloud and on-premises environments without relying on vendor-managed services.

By considering the specific security and compliance needs of the organization, teams can determine whether the flexibility and cost-effectiveness of OpenBao or the managed convenience of GCP Secret Manager better align with their requirements.

## Deploy OpenBao on Linode

When migrating from GCP Secret Manager to OpenBao on Linode, your requirements will dictate whether to install OpenBao on a single Linode Compute Instance or to pursue a larger scale, more fault tolerant environment with OpenBao on Kubernetes through the Linode Kubernetes Engine (LKE). Follow the appropriate guide based on your requirements:

* [Deploying OpenBao on a Linode Compute Instance](https://docs.google.com/document/d/1x30v1xT_EDuRNnhE9jv5VkFqj9Lo4N3kNO6ICOoSrOM/edit?usp=sharing)  
* [Deploying OpenBao on Kubernetes with Linode LKE](https://docs.google.com/document/d/1gS6hQg09Ufr1Ku0v528acLESnyj1ZpXTxLhkLIlP-u8/edit?usp=sharing)  
* [Deploying OpenBao through the Linode Marketplace](https://www.linode.com/docs/marketplace-docs/guides/openbao/)

In addition to the prerequisites needed for either of the above deployment methods, you will also need access to your GCP account with sufficient permissions to work with GCP Secret Manager.

## Migrate from GCP Secret Manager to OpenBao

When migrating from GCP Secret Manager to OpenBao deployed on Linode, begin by determining your existing use cases for GCP Secret Manager.

### Assess current secrets management requirements in GCP

Review how your organization uses GCP Secret Manager.

For example, you may have a web application which validates the authenticity of JSON Web Tokens (JWT) by verifying its signature. Security best practices would dictate that you don’t hardcode—in the deployed application image or in the source code itself—the JWT signing secret used for verification. Instead, the secret would be injected directly into the deployment at runtime. The application would be granted a role for accessing the JWT signing secret in GCP Secret Manager, which is provided for injection on-the-fly. This keeps the secret safe from being leaked via CI/CD processes or by being checked into a code repository.

### Review existing secrets

In the GCP Secret Manager dashboard, review your existing secrets.  
![][image2]

Alternatively, use the Google Cloud CLI (gcloud) to provide insight into your existing secrets and their usage. Authenticate the CLI. Then, [set the gcloud configuration to your current project](https://cloud.google.com/sdk/gcloud/reference/config/set). For example:

| $ gcloud auth login$ gcloud config set project ecommerce-application-454116 |
| :---- |

To [list all secrets](https://cloud.google.com/sdk/gcloud/reference/secrets/list), run the following command:

| $ gcloud secrets listNAME                       CREATED              REPLICATION\_POLICY  LOCATIONSbilling\_service\_API\_key    2025-03-01T12:25:36  automatic           \-deploy\_key                 2025-02-28T04:04:58  automatic           \-inventory\_service\_API\_key  2024-11-15T16:35:35  automatic           \-jwt-signing-secret         2025-03-08T12:01:30  automatic           \-slack\_webhook\_url          2024-11-19T21:19:15  automatic           \- |
| :---- |

To see the [value of the latest version for a single secret](https://cloud.google.com/sdk/gcloud/reference/secrets/versions/access), run the following command:

| $ gcloud secrets versions access latest \--secret=jwt-signing-secret EU&&7O^\#c2GAMIdRyJlZkPEdoWKgy%CW |
| :---- |

Ensure that you securely handle any exported secrets, as they will no longer benefit from encryption by GCP Secret Manager.

Alternatively, secrets can be viewed in the GCP UI by selecting the secret, finding the latest version, and clicking **Actions \> View secret value**.

![][image3]

GCP uses IAM to manage roles and principals with access to a particular secret. For example, a GCP Compute Instance might run an API that handles authentication for a web application. That workload may have an IAM role called JWTSigner, and the role has an attached policy which gives it read access to the jwt-signing-secret value in GCP Secret Manager.

Replicating this setup using OpenBao involves the following steps:

1. Create an OpenBao [application role (AppRole)](https://openbao.org/docs/auth/approle/) that will take the place of the GCP IAM role.  
2. Store the JWT signing secret in the OpenBao [key/value (KV) store](https://openbao.org/docs/secrets/kv/).  
3. Verify successful secret access with the API token associated with the AppRole.  
4. Assign the AppRole to the applications that need access to the secret.

### Authenticate the CLI

First, ensure that the OpenBao server is running.

| This guide assumes that the BAO\_ADDR environment variable has been set. If you are working directly on a Linode, then an example value may be http://0.0.0.0:8200. If you are using LKE and have set up port forwarding from your cluster to a port on your local machine, then an example value may be  http://127.0.0.1:8200. |
| :---- |

Retrieve the initial root token you were given when OpenBao was initialized. Authenticate the CLI with bao login, providing your root token. For example:

| $ bao login \--method=token s.36Yb3ijEOJbifprhdEiFtPhR WARNING\! The BAO\_TOKEN environment variable is set\! The value of this variable will take precedence; if this is unwanted please unset BAO\_TOKEN or update its value accordingly.Success\! You are now authenticated. The token information displayed below is already stored in the token helper. You do NOT need to run "bao login" again. Future OpenBao requests will automatically use this token.Key                  Value\---                  \-----token                s.36Yb3ijEOJbifprhdEiFtPhRtoken\_accessor       ykmfH8QV7E1OU86bth3GMCdftoken\_duration       ∞token\_renewable      falsetoken\_policies       \["root"\]identity\_policies    \[\]policies             \["root"\] |
| :---- |

### Unseal the OpenBao vault

OpenBao uses a [*sealing* and *unsealing* mechanism](https://openbao.org/docs/concepts/seal/) to protect its stored data, ensuring that sensitive information remains encrypted and inaccessible while the data is sealed. When OpenBao starts, it is initially sealed by a distributed key. Authorized users or automation systems must then unseal OpenBao by providing a quorum of key shares, which reassembles the master key and allows access to stored secrets. This architecture ensures that even if the server is compromised, the sensitive data remains protected unless the unseal keys are presented.

Before continuing, unseal the OpenBao vault.

### Create a policy and AppRole

Creating and using an OpenBao AppRole involves a few steps:

1. [Enable the AppRole authentication method](https://openbao.org/docs/auth/approle/#via-the-api-1).  
2. [Create a policy](https://openbao.org/docs/concepts/policies/).  
3. Create an AppRole, attaching the newly created policy.  
4. Generate a [secret ID](https://developer.hashicorp.com/vault/docs/concepts/policies#policy-syntax) for the AppRole.  
5. Generate an API token for the AppRole.

Enable the AppRole authentication method with the following CLI command:

| $ bao auth enable approle  Success\! Enabled approle auth method at: approle/ |
| :---- |

In /etc/openbao, create a new policy file for reading the secret. For example, a new file called jwt-secrets-policy.hcl would have the following contents:

| path "jwt/\*" {  capabilities \= \["read"\]} |
| :---- |

This policy grants read permissions to any secrets within the jwt secrets store path. Add the policy to OpenBao with the following command:

| $ bao policy write jwt-secrets-policy /etc/openbao/jwt-secrets-policy.hcl  Success\! Uploaded policy: jwt-secrets-policy |
| :---- |

Create an AppRole for the application that will need to access this secret:

| $ bao write \\     auth/approle/role/app-authenticator-approle \\     token\_policies=jwt-secrets-policySuccess\! Data written to: auth/approle/role/app-authenticator-approle |
| :---- |

Verify that the AppRole was written successfully:

| $ bao read auth/approle/role/app-authenticator-approle Key                        Value\---                        \-----bind\_secret\_id             truelocal\_secret\_ids           falsesecret\_id\_bound\_cidrs      \<nil\>secret\_id\_num\_uses         0secret\_id\_ttl              0stoken\_bound\_cidrs          \[\]token\_explicit\_max\_ttl     0stoken\_max\_ttl              0stoken\_no\_default\_policy    falsetoken\_num\_uses             0token\_period               0stoken\_policies             \[jwt-secrets-policy\]token\_strictly\_bind\_ip     falsetoken\_ttl                  0stoken\_type                 default |
| :---- |

Fetch the AppRole ID with the following command:

| $ bao read auth/approle/role/app-authenticator-approle/role-idKey        Value\---        \-----role\_id    019e2cc5-b8ce-4aa4-91b9-c2c9e9e59863 |
| :---- |

Generate a secret ID for the role:

| $ bao write \-f auth/approle/role/app-authenticator-approle/secret-idKey                   Value \---                   \----- secret\_id             cef786fb-1d1c-4c52-9466-aea47b3c8d3a secret\_id\_accessor    373500ba-6922-4f91-b7f3-ec25f8253d1d secret\_id\_num\_uses    0 secret\_id\_ttl         0s |
| :---- |

Generate an API token for the AppRole, supplying the AppRole ID and the secret ID from the previous commands.

| $ bao write auth/approle/login \\     role\_id="019e2cc5-b8ce-4aa4-91b9-c2c9e9e59863" \\     secret\_id="cef786fb-1d1c-4c52-9466-aea47b3c8d3a" Key                     Value \---                     \----- token                   s.dy572yUtTNvHTZgIoxdNVO41 token\_accessor          zT1TP281vORYSjysBiuMydht token\_duration          768h token\_renewable         truetoken\_policies          \["jwt-secrets-policy" "default"\]identity\_policies       \[\]policies                \["jwt-secrets-policy" "default"\]token\_meta\_role\_name    app-authenticator-approle |
| :---- |

The AppRole token (s.dy572yUtTNvHTZgIoxdNVO41 in the previous example) can be used by a user, machine, or service—such as the authentication API for a web application—to authenticate OpenBao API calls, giving the caller authorization to read the JWT signing secret.

### Store the secret

Create the secret store that is defined in the policy. For this example, all secrets will be stored under the jwt path. Run the following command:

| $ bao secrets enable \--path=jwt kv Success\! Enabled the kv secrets engine at: jwt/ |
| :---- |

The JWT signing secret stored at GCP Secret Manager was a simple string:

| EU&&7O^\#c2GAMIdRyJlZkPEdoWKgy%CW |
| :---- |

To store this as a key-value pair in OpenBao underneath the jwt path as a secret named signer, run the following command:

| $ bao kv put \--mount=jwt signer \\  "secret"="EU&&7O^\#c2GAMIdRyJlZkPEdoWKgy%CW"Success\! Data written to: jwt/signer |
| :---- |

### Retrieve the secret

To retrieve this secret with the OpenBao CLI, while still authenticated with the root token, run the following command:

| $ bao kv get \--mount=jwt signer\====== Data \======Key         Value\---         \-----secret      EU&&7O^\#c2GAMIdRyJlZkPEdoWKgy%CW |
| :---- |

Test that the AppRole can retrieve the secret, using the AppRole token saved earlier:

| $ curl \--header "X-Vault-Token: s.dy572yUtTNvHTZgIoxdNVO41" \\        \--request GET \\        $BAO\_ADDR/v1/jwt/signer \\        | jq {  "request\_id": "0e70b929-06b6-4685-b787-dc1ce6c31b9b",  "lease\_id": "",  "renewable": false,  "lease\_duration": 2764800,  "data": {    "secret": "EU&&7O^\#c2GAMIdRyJlZkPEdoWKgy%CW"  },  "wrap\_info": null,  "warnings": null,  "auth": null} |
| :---- |

This API token can be used in applications and services to access the JWT signing secret. According to the [documentation](https://openbao.org/api-docs/libraries/), “OpenBao intends to remain API compatible with HashiCorp Vault. This means that most of the existing libraries for Vault should also work with OpenBao.” Vault has [client libraries](https://developer.hashicorp.com/vault/api-docs/libraries) for various programming languages:

* [Go](https://github.com/hashicorp/vault/tree/main/api)  
* [Ruby](https://github.com/hashicorp/vault-ruby)  
* [C\#](https://github.com/rajanadar/VaultSharp)  
* [Java](https://developer.hashicorp.com/vault/api-docs/libraries#java)  
* [Kotlin](https://github.com/kunickiaj/vault-kotlin)  
* [Node.js](https://developer.hashicorp.com/vault/api-docs/libraries#node-js)  
* [PHP](https://developer.hashicorp.com/vault/api-docs/libraries#php)  
* [Python](https://github.com/hvac/hvac)

### Convert existing secrets from GCP Secret Manager to OpenBao

The above steps outline how to migrate a single secret stored in GCP Secret Manager to OpenBao on Linode, using RBAC for authorizing an application to read that secret with an API token. Migrating the remainder of your secrets stored in GCP Secret Manager involves iterating on the following process:

1. Retrieve the secret in GCP.  
2. Determine which entities (users, machines, and services) need read or write access to that secret.  
3. Create a permissions policy and attach it to an AppRole in OpenBao.  
4. Generate an API token for the AppRole.  
5. Update any entity code or configurations to use the API token to access the secret in OpenBao.

## Production Considerations

When migrating from GCP Secret Manager to OpenBao on Linode, it's important to ensure your deployment is secure, resilient, and optimized for performance. This section covers key security and high availability considerations to help you maintain a reliable and protected secrets management system.

### Security

For a production-grade OpenBao deployment, security should be a top priority. Protecting secrets from unauthorized access, ensuring secure communication, and enforcing strict access controls are essential to maintaining a secure environment.

* **Access control policies**: Use OpenBao's [policy](https://openbao.org/docs/concepts/policies/) system to enforce RBAC. Define granular policies that grant only the necessary permissions, following the principle of least privilege.  
* **Audit logging**: Enable [detailed audit logs](https://openbao.org/docs/configuration/log-requests-level/) to track all access and modifications to secrets. OpenBao supports multiple logging backends, such as syslog and file-based logs, to help monitor suspicious activity.  
* **Secrets lifecycle management**: Implement automated secrets rotation, revocation, and expiration to ensure secrets do not become stale or overexposed. Consider using dynamic secrets where possible to generate time-limited credentials.  
* **Securing network communication**: Configure OpenBao to [use TLS for encrypting](https://openbao.org/docs/configuration/listener/tcp/#configuring-tls) all communications, ensuring data in transit remains secure. Regularly rotate TLS certificates to prevent expiration-related outages and reduce the risk of compromised certificates.

### High availability

For production environments, OpenBao should be deployed with fault tolerance and scalability in mind. OpenBao’s [Autopilot mode](https://openbao.org/docs/concepts/integrated-storage/autopilot) for [high availability](https://openbao.org/docs/internals/high-availability/) ensures that if the active node fails, the cluster automatically elects a new leader, maintaining uptime without manual intervention. However, to enable seamless failover, organizations must configure their deployment correctly and proactively monitor system health.

* **Raft storage backend**: Use OpenBao’s [integrated storage](https://openbao.org/docs/internals/integrated-storage/), based on the [Raft protocol](https://thesecretlivesofdata.com/raft/), to enable distributed data replication across multiple nodes. This ensures data consistency and fault tolerance while reducing reliance on external storage backends. Configure regular Raft snapshots for disaster recovery.  
* **Deploy multiple nodes**: OpenBao recommends at least five nodes for a [high-availability deployment](https://openbao.org/docs/concepts/ha/). The active node handles all requests, while standby nodes remain ready to take over in case of failure.  
* **Monitor leader status**: Use [bao operator raft list-peers](https://openbao.org/docs/commands/operator/raft/#list-peers) to check the cluster’s leader and node statuses. This command helps ensure that standby nodes are correctly registered and ready for failover.

The resources below are provided to help you become familiar with OpenBao when migrating from GCP Secret Manager to Linode.

## Additional Resources

* GCP  
  * [Secret Manager Documentation](https://cloud.google.com/secret-manager/docs)  
  * [gcloud secrets documentation](https://cloud.google.com/sdk/gcloud/reference/secrets)  
* OpenBao  
  * [Configuration Documentation](https://openbao.org/docs/configuration/)  
  * High Availability  
    * [Architectural Internals](https://openbao.org/docs/internals/high-availability/)  
    * [Detailed Concepts](https://openbao.org/docs/concepts/ha/)  
  * [Integrated Storage](https://openbao.org/docs/concepts/integrated-storage/)  
  * [Vault client libraries](https://developer.hashicorp.com/vault/api-docs/libraries) (compatible with OpenBao) for multiple programming languages  
* Linode  
  * [Documentation](https://www.linode.com/docs/)  
  * [Linode Cloud Manager](https://cloud.linode.com/)  
  * [Deploying OpenBao on a Linode Compute Instance](https://docs.google.com/document/d/1x30v1xT_EDuRNnhE9jv5VkFqj9Lo4N3kNO6ICOoSrOM/edit?usp=sharing)  
  * [Deploying OpenBao on Kubernetes with Linode LKE](https://docs.google.com/document/d/1gS6hQg09Ufr1Ku0v528acLESnyj1ZpXTxLhkLIlP-u8/edit?usp=sharing)  
  * [Deploying OpenBao through the Linode Marketplace](https://www.linode.com/docs/marketplace-docs/guides/openbao/)