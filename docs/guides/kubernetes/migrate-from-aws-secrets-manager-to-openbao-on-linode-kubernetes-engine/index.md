---
slug: migrate-from-aws-secrets-manager-to-openbao-on-linode-kubernetes-engine
title: "Migrate From Aws Secrets Manager to Openbao on Linode Kubernetes Engine"
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

This guide walks through how to migrate secrets from AWS Secrets Manager to OpenBao running on Linode.

AWS Secrets Manager is a fully managed service that securely stores and retrieves sensitive information such as database credentials, API keys, and other application secrets. [OpenBao](https://openbao.org/) is an open-source fork of [HashiCorp Vault](https://www.vaultproject.io/) designed to give organizations control over their cryptographic infrastructure. With OpenBao, organizations can deploy, configure, and manage keys and secrets in both cloud and on-premise environments without relying on vendor-managed services.

An organization may choose to migrate from AWS Secrets Manager to OpenBao when it is looking for a cost-effective alternative to secrets management systems offered by major cloud providers.

## Deploy OpenBao on Linode

When migrating from AWS Secrets Manager to OpenBao on Linode, your requirements will dictate whether to install OpenBao on a single Linode Compute Instance or to pursue a larger scale, more fault tolerant environment with OpenBao on Kubernetes through the Linode Kubernetes Engine (LKE). Follow the appropriate guide based on your requirements:

* [Deploying OpenBao on a Linode Compute Instance](https://docs.google.com/document/d/1x30v1xT_EDuRNnhE9jv5VkFqj9Lo4N3kNO6ICOoSrOM/edit?usp=sharing)  
* [Deploying OpenBao on Kubernetes with Linode LKE](https://docs.google.com/document/d/1gS6hQg09Ufr1Ku0v528acLESnyj1ZpXTxLhkLIlP-u8/edit?usp=sharing)  
* [Deploying OpenBao through the Linode Marketplace](https://www.linode.com/docs/marketplace-docs/guides/openbao/)

In addition to the prerequisites needed for either of the above deployment methods, you will also need access to your AWS account with sufficient permissions to work with AWS Secrets Manager.

## Migrate from AWS Secrets Manager to OpenBao

When migrating from AWS Secrets Manager to OpenBao deployed on Linode, begin by determining your existing use cases for AWS Secrets Manager.

### Assess current secrets management requirements in AWS

Review how your organization uses AWS Secrets Manager.

For example, you may have a web application with a corresponding database dependency. Security best practices would dictate that you don’t hardcode secrets—such as database credentials—in the deployed application image or in the source code itself. Instead, the secrets would be injected directly into the deployment at runtime. The application would be granted a role for accessing the credentials in AWS Secrets Manager, which is provided for injection on-the-fly. This keeps the secret safe from being leaked via CI/CD processes or by being checked into a code repository.

### Review existing secrets

In the AWS Secrets Manager dashboard, review your existing secrets.

![][image2]

Alternatively, using the AWS CLI can quickly provide insight into existing secrets and their usage. To list all secrets, run the following command:

| $ aws secretsmanager list-secrets \--query 'SecretList\[\*\].Name'\[    "psql-credentials",    "jwt-signing-secret",    "shipping\_service\_api\_key"\] |
| :---- |

To retrieve the secret value for a specific secret, use the secret name with the get-secret-value command. For example:

| $ aws secretsmanager get-secret-value \\     \--secret-id psql-credentials \\     \--query SecretString \\     \--output text \\     | jq {  "username": "psqluser",  "password": "W0H@Z52IGI0VjqoGS3xMkJ9SO533w$fcfrmzs\!m$TudDxEe\#",  "engine": "postgres",  "host": "psql.example-cloud.com",  "port": "5432",  "dbname": "web\_app\_production"} |
| :---- |

In AWS Secrets Manager, secrets are stored either as key/value pairs or as plaintext. In the previous example, the single psql-credentials secret is a set of key/value pairs. Ensure that you securely handle any exposed secrets, as they will no longer benefit from encryption by AWS Secrets Manager.

AWS Secrets Manager uses AWS IAM to control access to secrets. As an example that adopts role-based access control (RBAC), a role such as DatabaseReader might have a policy attached that allows the secretsmanager:GetSecretValue action on the psql-credentials resource. Then, the web application that accesses the database would be given the DatabaseReader role so that it can obtain the secret values which would allow it to connect to the database.

Replicating this setup using OpenBao will involve creating an [application role (AppRole)](https://openbao.org/docs/auth/approle/) to take the place of the AWS IAM role so that applications can use an API token associated with the AppRole to authenticate requests for the secret.

### Authenticate the CLI

First, ensure that the OpenBao server is running.

| This guide assumes that the BAO\_ADDR environment variable has been set. If you are working directly on a Linode, then an example value may be http://0.0.0.0:8200. If you are using LKE and have set up port forwarding from your cluster to a port on your local machine, then an example value may be  http://127.0.0.1:8200. |
| :---- |

Retrieve the initial root token you were given when OpenBao was initialized. Authenticate the CLI with bao login, providing your root token. For example:

| $ bao login \--method=token s.36Yb3ijEOJbifprhdEiFtPhR WARNING\! The BAO\_TOKEN environment variable is set\! The value of this variable will take precedence; if this is unwanted please unset BAO\_TOKEN or update its value accordingly.Success\! You are now authenticated. The token information displayed below is already stored in the token helper. You do NOT need to run "bao login" again. Future OpenBao requests will automatically use this token.Key                  Value\---                  \-----token                s.36Yb3ijEOJbifprhdEiFtPhRtoken\_accessor       ykmfH8QV7E1OU86bth3GMCdftoken\_duration       ∞token\_renewable      falsetoken\_policies       \["root"\]identity\_policies    \[\]policies             \["root"\] |
| :---- |

### Unseal the OpenBao vault

OpenBao uses a [*sealing* and *unsealing* mechanism](https://openbao.org/docs/concepts/seal/) to protect its stored data, ensuring that sensitive information remains encrypted and inaccessible while the data is sealed. When OpenBao starts, it is initially sealed by a distributed key. Authorized users or automation systems must then unseal OpenBao by providing a quorum of key shares, which reassembles the master key and allows access to stored secrets. This architecture ensures that even if the server is compromised, the sensitive data remains protected unless the unseal keys are presented.

Before continuing, unseal the OpenBao vault. With unseal keys in hand, run the following command as many times as necessary to reach quorum (default is three), using a different unseal key for each execution:

| $ bao operator unsealUnseal Key (will be hidden): \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\* |
| :---- |

After quorum has been reached, the OpenBao status will show the following:

| Key             Value\---             \-----Seal Type       shamirInitialized     trueSealed          false… |
| :---- |

### Create a policy and AppRole

Creating and using an OpenBao AppRole involves a few steps.

#### Step \#1: Enable AppRole

[Enable the AppRole authentication method](https://openbao.org/docs/auth/approle/#via-the-api-1) with the following CLI command:

| $ bao auth enable approle  Success\! Enabled approle auth method at: approle/ |
| :---- |

#### Step \#2: Create a policy

In /etc/openbao, [create a new policy](https://openbao.org/docs/concepts/policies/) file for reading the secret. For example, a new file called db-secrets-policy.hcl would have the following contents:

| path "database-credentials/\*" {  capabilities \= \["read"\]} |
| :---- |

This policy grants read permissions to any secrets within the database-credentials secrets store path. Add the policy to OpenBao with the following command:

| $ bao policy write db-secrets-policy /etc/openbao/db-secrets-policy.hcl  Success\! Uploaded policy: db-secrets-policy |
| :---- |

#### Step \#3: Create an AppRole with policy attached

Create an AppRole for the application that will need to access this secret:

| $ bao write \\     auth/approle/role/web-app-approle \\     token\_policies=db-secrets-policySuccess\! Data written to: auth/approle/role/web-app-approle |
| :---- |

Verify that the AppRole was written successfully:

| $ bao read auth/approle/role/web-app-approle Key                        Value\---                        \-----bind\_secret\_id             truelocal\_secret\_ids           falsesecret\_id\_bound\_cidrs      \<nil\>secret\_id\_num\_uses         0secret\_id\_ttl              0stoken\_bound\_cidrs          \[\]token\_explicit\_max\_ttl     0stoken\_max\_ttl              0stoken\_no\_default\_policy    falsetoken\_num\_uses             0token\_period               0stoken\_policies             \[db-secrets-policy\]token\_strictly\_bind\_ip     falsetoken\_ttl                  0stoken\_type                 default |
| :---- |

Fetch the AppRole ID with the following command:

| $ bao read auth/approle/role/web-app-approle/role-idKey        Value\---        \-----role\_id    1d41b8be-03d2-6f61-702d-1731c957fd13 |
| :---- |

#### Step \#4: Generate secret ID

Generate a secret ID for the role:

| $ bao write \-f auth/approle/role/web-app-approle/secret-idKey                   Value \---                   \----- secret\_id             4eb6e604-681c-3fc3-bedd-a2dc774955bb secret\_id\_accessor    fe899dc6-85f7-f596-fb93-3c961f7919a9 secret\_id\_num\_uses    0 secret\_id\_ttl         0s |
| :---- |

#### Step \#5: Generate API token

Generate an API token for the AppRole, supplying the AppRole ID and the secret ID from the previous commands.

| $ bao write auth/approle/login \\     role\_id="1d41b8be-03d2-6f61-702d-1731c957fd13" \\     secret\_id="4eb6e604-681c-3fc3-bedd-a2dc774955bb" Key                     Value \---                     \----- token                   s.kpKsgWNtYLAktRYQT4BiMVMy token\_accessor          Rwlq5EmvrHC8VvvHwoRyJzUh token\_duration          768h token\_renewable         truetoken\_policies          \["db-secrets-policy" "default"\]identity\_policies       \[\]policies                \["db-secrets-policy" "default"\]token\_meta\_role\_name    web-app-approle |
| :---- |

The AppRole token (s.kpKsgWNtYLAktRYQT4BiMVMy in the previous example) can be used by a user, machine, or service—such a web application—to authenticate OpenBao API calls, giving the caller authorization to read the database credential secret.

### Store the secret

Create the secret store that is defined in the policy. For this example, all secrets will be stored under the database-credentials path. Run the following command:

| $ bao secrets enable \--path=database-credentials kv Success\! Enabled the kv secrets engine at: database-credentials/ |
| :---- |

The database secret stored at AWS Secrets Manager had the following form:

| {  "username": "psqluser",  "password": "W0H@Z52IGI0VjqoGS3xMkJ9SO533w$fcfrmzs\!m$TudDxEe\#",  "engine": "postgres",  "host": "psql.example-cloud.com",  "port": "5432",  "dbname": "web\_app\_production"} |
| :---- |

To store these key-value pairs in OpenBao underneath the database-credentials path as a secret named psql, run the following command:

| $ bao kv put \--mount=database-credentials psql \\  "username"="psqluser" \\  "password"="W0H@Z52IGI0VjqoGS3xMkJ9SO533w$fcfrmzs.vault-tokenTudDxEe\#"  \\  "engine"="postgres" \\  "host"="psql.example-cloud.com" \\  "port"="5432" \\  "dbname"="web\_app\_production"Success\! Data written to: database-credentials/psql |
| :---- |

### Retrieve the secret

To retrieve this secret with the OpenBao CLI, while still authenticated with the root token, run the following command:

| $ bao kv get \--mount=database-credentials psql\====== Data \======Key         Value\---         \-----dbname      web\_app\_productionengine      postgreshost        psql.example-cloud.compassword    W0H@Z52IGI0VjqoGS3xMkJ9SO533w.vault-tokenTudDxEe\#port        5432username    psqluser |
| :---- |

Test that the AppRole can retrieve the secret, using the AppRole token saved earlier:

| $ curl \--header "X-Vault-Token: s.kpKsgWNtYLAktRYQT4BiMVMy" \\        \--request GET \\        $BAO\_ADDR/v1/database-credentials/psql \\        | jq {  "request\_id": "00237a0b-4349-351d-50a0-ef127534ed18",  "lease\_id": "",  "renewable": false,  "lease\_duration": 2764800,  "data": {    "dbname": "web\_app\_production",    "engine": "postgres",    "host": "psql.example-cloud.com",    "password": "W0H@Z52IGI0VjqoGS3xMkJ9SO533w.vault-tokenTudDxEe\#",    "port": "5432",    "username": "psqluser"  },  "wrap\_info": null,  "warnings": null,  "auth": null} |
| :---- |

This API token can be used in applications and services to access the database credentials. According to the [documentation](https://openbao.org/api-docs/libraries/), “OpenBao intends to remain API compatible with HashiCorp Vault. This means that most of the existing libraries for Vault should also work with OpenBao.” Vault has [client libraries](https://developer.hashicorp.com/vault/api-docs/libraries) for various programming languages:

* [Go](https://github.com/hashicorp/vault/tree/main/api)  
* [Ruby](https://github.com/hashicorp/vault-ruby)  
* [C\#](https://github.com/rajanadar/VaultSharp)  
* [Java](https://developer.hashicorp.com/vault/api-docs/libraries#java)  
* [Kotlin](https://github.com/kunickiaj/vault-kotlin)  
* [Node.js](https://developer.hashicorp.com/vault/api-docs/libraries#node-js)  
* [PHP](https://developer.hashicorp.com/vault/api-docs/libraries#php)  
* [Python](https://github.com/hvac/hvac)

### Convert existing secrets from AWS Secrets Manager to OpenBao

The above steps outline how to migrate a single secret stored in AWS Secrets Manager to OpenBao on Linode, using RBAC for authorizing an application to read that secret with an API token. Migrating the remainder of your secrets stored in AWS Secrets Manager involves iterating on the following process:

1. Retrieve the secret in AWS.  
2. Determine which entities (users, machines, and services) need read or write access to that secret.  
3. Create a permissions policy and attach it to an AppRole in OpenBao.  
4. Generate an API token for the AppRole.  
5. Update any entity code or configurations to use the API token to access the secret in OpenBao.

## Production Considerations

When migrating from AWS Secrets Manager to OpenBao on Linode, it's important to ensure your deployment is secure, resilient, and optimized for performance. This section covers key security and high availability considerations to help you maintain a reliable and protected secrets management system.

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

The resources below are provided to help you become familiar with OpenBao when migrating from AWS Secrets Manager to Linode.

## Additional Resources

* AWS  
  * [Secrets Manager Documentation](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html)  
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