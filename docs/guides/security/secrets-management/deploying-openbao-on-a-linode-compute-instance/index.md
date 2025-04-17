---
slug: deploying-openbao-on-a-linode-compute-instance
title: "Deploying Openbao on a Linode Compute Instance"
description: "Two to three sentences describing your guide."
og_description: "Optional two to three sentences describing your guide when shared on social media. If omitted, the `description` parameter is used within social links."
authors: ["Linode"]
contributors: ["Linode"]
published: 2025-04-17
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

# Deploying OpenBao on a Linode Compute Instance 

This guide walks through how to deploy OpenBao on a single Linode Compute Instance using the [Linode CLI](https://github.com/linode/linode-cli).

## Prerequisites

To follow along in this walkthrough, you’ll need the following:

* A [Linode account](https://www.linode.com/cfe)  
* A [Linode API token (personal access token)](https://www.linode.com/docs/products/platform/accounts/guides/manage-api-tokens/)  
* The [Linode CLI](https://www.linode.com/docs/products/tools/cli/guides/install/) installed and configured  
* An [SSH key pair](https://www.linode.com/content/ssh-key-authentication-how-to-create-ssh-key-pairs/)

## Step 1: Initialize a Compute Instance

This guide uses the Linode CLI to provision resources. The Linode Marketplace offers a one-click [OpenBao Marketplace app](https://www.linode.com/docs/marketplace-docs/guides/openbao/), whereas this tutorial walks through a manual installation.

### Determine instance configuration

In order to provision a Linode instance, you must specify the desired operating system, geographical region, and Linode plan size. The options available for each of these can be obtained using the Linode CLI.

#### Operating system

Run this command to obtain a formatted list of available operating systems:

| $ linode-cli images list \--type=manual |
| :---- |

This guide will use Ubuntu 22.04, which has the ID linode/ubuntu22.04.

#### Geographical region

| $ linode-cli regions list |
| :---- |

This guide will use the us-sea region (Seattle, WA).

#### Compute Instance size

| $ linode-cli linodes types |
| :---- |

The OpenBao documentation does not explicitly state hardware resource requirements for deploying OpenBao. However, as a fork of HashiCorp Vault, the [hardware size guide](https://developer.hashicorp.com/vault/tutorials/day-one-raft/raft-reference-architecture#hardware-sizing-for-vault-servers) for Vault can serve as a reference. For an initial, small cluster deployment of HashiCorp Vault (and thus, OpenBao), the documentation recommends:

* 2-4 CPU cores  
* 8-16 GB RAM  
* 100+ GB disk capacity  
* 75+ Mbps transfer rate

This guide will use the g6-standard-4 Linode, which has 4 cores, 160 GB disk, and 8 GB RAM with a 5000 Mbps transfer rate. These capabilities are comparable to the hardware sizing recommendations.

### Create the Compute Instance

The following command creates a Linode Compute Instance based on the specified operating system, geographical region, and size as noted above.

| $ linode-cli linodes create \\                                                                                                                                                                                                                                     \--image linode/ubuntu22.04 \\      \--region us-sea \\      \--type g6-standard-4 \\      \--root\_pass \<password\> \\      \--authorized\_keys "$(cat \~/.ssh/id\_rsa.pub)" \\      \--label openbao-linode |
| :---- |

Note the following key points:

* Replace **`<password>`** with a secure alternative.  
* This command assumes that an SSH public/private key pair exists, with the public key stored as id\_rsa.pub in the user’s $HOME/.ssh/ folder.  
* The \--label argument specifies the name of the new server (openbao-linode).

Within a few minutes of executing this command, the instance will be visible with status running in the Linode Cloud Manager or via the following CLI command: 

| $ linode-cli linodes list \--label openbao-linode┌-----------------┬--------┬---------------┬---------┬-----------------┐ │ label           │ region │ type          │ status  │ ipv4            │ ├-----------------┼--------┼---------------┼---------┼-----------------┤ │ openbao-linode  │ us-sea │ g6-standard-1 │ running │ 172.233.157.190 │ └-----------------┴--------┴---------------┴---------┴-----------------┘ |
| :---- |

Depending on notification settings, emails detailing the progress of the provisioning process may also be sent to the Linode user’s address.

## Step 2: Install OpenBao on the Linode Compute Instance

To install OpenBao, you will need to SSH into the newly provisioned Linode. The IP address of the new instance can be found in the Linode Cloud Manager dashboard or via the following command:

| $ linode-cli linodes list |
| :---- |

Once the IP address is found, run the following command:

| $ ssh \-l root \<IP-address-of-instance\> |
| :---- |

| Note that this method of connecting uses the root user, which is initially the only accessible user on the system. For production systems, it is strongly recommended that you disable the ability to access the instance as the root user, instead creating a limited user account with sudo privileges for access. See [this guide](https://techdocs.akamai.com/cloud-computing/docs/set-up-and-secure-a-compute-instance#add-a-limited-user-account) for more details. This guide will assume that all remaining commands are run with sudo as a newly created user on the Linode instance. |
| :---- |

### Update system packages

Ensure that the new system is up to date with the latest Ubuntu packages. The Ubuntu package manager (apt) needs to be updated to pull the latest package manifests, followed by upgrading any that are outdated.

| $ apt update && apt upgrade \-y |
| :---- |

### Download and install the OpenBao package

Find the desired version of OpenBao from the [downloads page](https://openbao.org/downloads/). In this case, the AMD 64-bit debian package works with the Linode Compute Instance that has been provisioned.

| $ wget https://github.com/openbao/openbao/releases/download/v2.0.3/bao\_2.0.3\_linux\_amd64.deb |
| :---- |

Install the package.

| $ dpkg \-i bao\_2.0.3\_linux\_amd64.deb  Selecting previously unselected package bao.(Reading database ... 219929 files and directories currently installed.)Preparing to unpack bao\_2.0.3\_linux\_amd64.deb ...Unpacking bao (2.0.3) ...Setting up bao (2.0.3) ...Generating OpenBao TLS key and self-signed certificate......OpenBao TLS key and self-signed certificate have been generated in '/opt/openbao/tls'. |
| :---- |

Verify the install was successful.

| $ bao \-h |
| :---- |

### Verify swap memory limits

For Linux distributions, ensure that the OpenBao service settings do not impose a soft limit on Swap memory. To check this with a systemd-based Linux distro, use the following command:

| $ systemctl cat openbao\# /usr/lib/systemd/system/openbao.service\[Unit\]Description="OpenBao \- A tool for managing secrets"… \[Service\] … TimeoutStopSec=30LimitNOFILE=65536MemorySwapMax=0\[Install\]WantedBy=multi-user.target |
| :---- |

Verify that MemorySwapMax=0 appears in the results under the Service heading.

## Step 3: Test the OpenBao Development Server

OpenBao provides a development server that runs completely in memory. Use this to verify settings and explore OpenBao features. 

### Start the development server

To start the server in development mode and set a primary key run this command:

| $ bao server \-dev \\   \-dev-root-token-id="this-is-my-test-dev-token" |
| :---- |

The OpenBao server configuration will print to the screen along with a tail of the logs.

| \==\> OpenBao server configuration:Administrative Namespace:              Api Address: http://127.0.0.1:8200                     Cgo: disabled         Cluster Address: https://127.0.0.1:8201   Environment Variables: HOME, LANG, LESSCLOSE, LESSOPEN, LOGNAME, LS\_COLORS, MAIL, PATH, PWD, SHELL, SHLVL, SUDO\_COMMAND, SUDO\_GID, SUDO\_UID, SUDO\_USER, TERM, USER, \_              Go Version: go1.22.9              Listener 1: tcp (addr: "127.0.0.1:8200", cluster address: "127.0.0.1:8201", max\_request\_duration: "1m30s", max\_request\_size: "33554432", tls: "disabled")               Log Level:            Recovery Mode: false                 Storage: inmem                 Version: OpenBao v2.0.3, built 2024-11-15T16:54:47Z             Version Sha: a2522eb71d1854f83c7e2e02fdbfc01ae74c3a78\==\> OpenBao server started\! Log data will stream in below:...2024-11-25T10:07:57.493-0700 \[INFO\]  core: vault is unsealed2024-11-25T10:07:57.495-0700 \[INFO\]  expiration: revoked lease: lease\_id=auth/token/root/hf0285ed983c6c93bd02f9422f179d20f12508b046d39228a7b2e13c245293de62024-11-25T10:07:57.498-0700 \[INFO\]  core: successful mount: namespace="" path=secret/ type=kv version=""2024-11-25T10:07:57.499-0700 \[INFO\]  secrets.kv.kv\_cd63d9f9: collecting keys to upgrade2024-11-25T10:07:57.499-0700 \[INFO\]  secrets.kv.kv\_cd63d9f9: done collecting keys: num\_keys=12024-11-25T10:07:57.499-0700 \[INFO\]  secrets.kv.kv\_cd63d9f9: upgrading keys finished … |
| :---- |

Leave this server process running in the background. In a separate terminal window, connect to the Linode instance with another shell session.

### Setting and getting a test secret

Use curl requests to test setting and getting a test secret. OpenBao expects certain variables to be set for every request. Instead of setting these variables repeatedly with each command, set the following environment variables in the shell:

| $ export VAULT\_TOKEN="this-is-my-test-dev-token"$ export OPENBAO\_IP="127.0.0.1"$ export OPENBAO\_PORT="8200" |
| :---- |

Send a request with curl to set a secret as a key-value pair.

| $ curl \-X POST \\     \--header "X-Vault-Token: $VAULT\_TOKEN" \\     \--header "Content-Type: application/json" \\     \--data '{"data": {"password": "OpenBao123"}}' \\     http://$OPENBAO\_IP:$OPENBAO\_PORT/v1/secret/data/test-password-1 \\       | json\_pp {    "auth" : null,    "data" : {       "created\_time" : "2024-11-25T17:25:05.234896488Z",       "custom\_metadata" : null,       "deletion\_time" : "",       "destroyed" : false,       "version" : 1    },    "lease\_duration" : 0,    "lease\_id" : "",    "renewable" : false,    "request\_id" : "0ad32a55-51cd-086c-0eba-5b1f6349bb3b",    "warnings" : null,    "wrap\_info" : null } |
| :---- |

The development server is only exposed on localhost. Therefore, this command must be run on the server itself. Authentication is handled by supplying the X-Vault-Token header. The structure of the URI follows the pattern /v1/secret/data/\<secret\_name\>. This POST request stores the key-value pair at location /data/\<secret\_name\>.

The response provides metadata regarding the secret stored in the data object, including versioning (how many times this secret has been updated).

To retrieve the secret, send the following request:

| $ curl \\  \--header "X-Vault-Token: $VAULT\_TOKEN" \\  http://$OPENBAO\_IP:$OPENBAO\_PORT/v1/secret/data/test-password-1 \\    | json\_pp  {    "auth" : null,    "data" : {       "data" : {          "password" : "OpenBao123"       },       "metadata" : {          "created\_time" : "2024-11-25T17:25:05.234896488Z",          "custom\_metadata" : null,          "deletion\_time" : "",          "destroyed" : false,          "version" : 1       }    },    "lease\_duration" : 0,    "lease\_id" : "",    "renewable" : false,    "request\_id" : "0471a6c0-b9ad-d6d4-1e81-c0ade5d057ce",    "warnings" : null,    "wrap\_info" : null } |
| :---- |

The original secret is found within the data object as a key-value pair. 

## Step 4: Run OpenBao as a Service

In a real-world use case, it would be expected that OpenBao runs as a service, managed by a tool such as systemd. Run the following command:

| $ systemctl status openbao○ openbao.service \- "OpenBao \- A tool for managing secrets"    Loaded: loaded (/usr/lib/systemd/system/openbao.service; disabled; preset: enabled)    Active: inactive (dead)      Docs: https://github.com/openbao/openbao/tree/main/website/content/docs |
| :---- |

This shows that systemd is aware of the OpenBao service but it has not been started.

The default location of the OpenBao configuration file on the Linode Compute Instance is /etc/openbao/openbao.hcl. Edit this file and set it up for a publicly available service with the following contents:

| ui \= falsestorage "file" {  path \= "/opt/openbao/data"}api\_addr \= "http://0.0.0.0:8200"listener "tcp" {  address \= "0.0.0.0:8200"  tls\_disable \= 1} |
| :---- |

**Note:** The configuration above is insecure and not suitable for production use. It is only for demonstration purposes of this tutorial. For a production-grade deployment, reference the [configuration](#configuration) near the end of this guide.

Start the service, then check its status.

| $ systemctl start openbao$ systemctl status openbao● openbao.service \- "OpenBao \- A tool for managing secrets"     Loaded: loaded (/usr/lib/systemd/system/openbao.service; disabled; preset: enabled)     Active: active (running) since Mon 2024-11-25 10:38:04 MST; 7s ago       Docs: https://github.com/openbao/openbao/tree/main/website/content/docs   Main PID: 642487 (bao)      Tasks: 6 (limit: 1124\)     Memory: 12.2M (swap max: 0B peak: 12.5M)        CPU: 66ms     CGroup: /system.slice/openbao.service             └─642487 /usr/bin/bao server \-config=/etc/openbao/openbao.hcl |
| :---- |

To start the service automatically whenever the Linode server boots, run the following command:

| $ systemctl enable openbao |
| :---- |

## Step 5: Configure OpenBao for External Access

Although OpenBao is now running as a service on the Linode Compute Instance, it is still not ready for use. Use the [OpenBao CLI](https://openbao.org/docs/commands/) to interact with the running server, retrieving its current status:

| $ bao status \--address=http://0.0.0.0:8200Key                Value\---                \-----Seal Type          shamirInitialized        falseSealed             trueTotal Shares       0Threshold          0Unseal Progress    0/0Unseal Nonce       n/aVersion            2.0.3Build Date         2024-11-15T16:54:47ZStorage Type       fileHA Enabled         false |
| :---- |

The status shows that the server has not been initialized, and it is sealed. Both of these issues must be resolved before the server can be interacted with.

### Initialize the server

Set the BAO\_ADDR environment variable, which will be used in several subsequent commands.

| $ export BAO\_ADDR=http://0.0.0.0:8200 |
| :---- |

Run the following command to initialize the server.

| $ bao operator init Unseal Key 1: lmeBuSpXWfmpGocWBrpD08nK7OOws691bygB2ipS2KUEUnseal Key 2: CXi4hCiD4H922RtyTAU8sR77svDfsCkyXaVuZYY2VkFaUnseal Key 3: oCKeZ0JxPS6G8+losHgKWDPV5Qc01XU4e4g2//sp3ljeUnseal Key 4: cD1yVzWt0dh71BI7vtiIImoj5e12OhEWw7lmAGsnZjb/Unseal Key 5: uSNLC9hISYKz0fbyNF3sX7gjF/HZ5U7mR6EfGYKdHbuFInitial Root Token: s.eZTodpa8pErpfQGDyPPUqVMEVault initialized with 5 key shares and a key threshold of 3\. Please securely distribute the key shares printed above. When the Vault is re-sealed, restarted, or stopped, you must supply at least 3 of these keys to unseal it before it can start servicing requests.Vault does not store the generated root key. Without at least 3 keys toreconstruct the root key, Vault will remain permanently sealed\!It is possible to generate new unseal keys, provided you have a quorum ofexisting unseal keys shares. See "vault operator rekey" for more information. |
| :---- |

Store the unseal keys and initial root token in a secure location.

### Unseal the vault (three times for quorum)

Unseal the vault using one of the unseal keys provided.

| $ bao operator unsealUnseal Key (will be hidden): lmeBuSpXWfmpGocWBrpD08nK7OOws691bygB2ipS2KUE Key                Value\---                \-----Seal Type          shamirInitialized        trueSealed             trueTotal Shares       5Threshold          3Unseal Progress    1/3Unseal Nonce       f0724cb7-324e-ef04-34fb-3fb6f0f0806eVersion            2.0.3Build Date         2024-11-15T16:54:47ZStorage Type       fileHA Enabled         false |
| :---- |

After this first execution, the unseal progress shows 1/3. Unsealing must be done a total of three times, as this is the default quorum for OpenBao unsealing.

| $ bao operator unsealUnseal Key (will be hidden): CXi4hCiD4H922RtyTAU8sR77svDfsCkyXaVuZYY2VkFa $ bao operator unsealUnseal Key (will be hidden): oCKeZ0JxPS6G8+losHgKWDPV5Qc01XU4e4g2//sp3lje |
| :---- |

After unsealing has been executed three times (with three different unseal keys), the OpenBao status will show the following:

| Key             Value\---             \-----Seal Type       shamirInitialized     trueSealed          falseTotal Shares    5Threshold       3Version         2.0.3Build Date      2024-11-15T16:54:47ZStorage Type    fileCluster Name    vault-cluster-5e4b590fCluster ID      d7b79512-d2d0-13d1-92a3-e636384c10afHA Enabled      false |
| :---- |

Now, the vault has been initialized and unsealed.

### Authenticate the CLI

To authenticate the CLI with the server, use the bao login command with the root token provided upon vault initialization.

| $ bao login \-method=token s.eZTodpa8pErpfQGDyPPUqVME Success\! You are now authenticated. The token information displayed below is already stored in the token helper. You do NOT need to run "bao login" again. Future OpenBao requests will automatically use this token. Key                  Value \---                  \----- token                s.eZTodpa8pErpfQGDyPPUqVME token\_accessor       otHrg1OUERHfyEGgy2DOXbEB token\_duration       ∞ token\_renewable      false token\_policies       \["root"\] identity\_policies    \[\] policies             \["root"\] |
| :---- |

### Enable key-value storage

Lastly, to enable a key-value store in OpenBao for stashing and retrieving secrets via the API. To do this, run the following command:

| $ bao secrets enable kvSuccess\! Enabled the kv secrets engine at: kv/ |
| :---- |

### Setting and getting a secret remotely over HTTP

OpenBao can now be accessed externally via the API. Ensure that any firewall on the Linode Compute Instance allows traffic on port 8200. From a remote machine, set a new secret, providing the root token for authentication.

| $ curl \-X POST \\    \--header "X-Vault-Token: s.eZTodpa8pErpfQGDyPPUqVME" \\    \--header "Content-Type: application/json" \\    \--data '{"data": {"hello": "world"}}' \\    http://\<LINODE-IP\>:8200/v1/kv/test-secret |
| :---- |

Get the newly created secret to verify it was stored properly.

| $ curl \-X GET \\    \--header "X-Vault-Token: s.eZTodpa8pErpfQGDyPPUqVME" \\    http://\<LINODE-IP\>:8200/v1/kv/test-secret {    "auth" : null,    "data" : {       "hello" : "world"    },    "lease\_duration" : 2764800,    "lease\_id" : "",    "renewable" : false,    "request\_id" : "3bbd69a5-b77a-62b0-686d-a8a3103d6d6b",    "warnings" : null,    "wrap\_info" : null } |
| :---- |

## Considerations for Production Deployments

To harden an OpenBao server for production use, several additional steps are recommended.

### Auto Unseal

OpenBao starts with its vault in a sealed state, meaning all data is encrypted. For more information on the seal/unseal concept in OpenBao, see their [documentation](https://openbao.org/docs/concepts/seal/).

In production, [auto-unseal](https://openbao.org/docs/concepts/seal/#auto-unseal) is recommended to minimize manual operations that could lead to mistakes or exposure. Auto-unseal is configured using cloud-based key management systems to ensure the unsealing key is never exposed directly.

### Authentication

Enable and configure secure authentication methods such as:

* AppRole  
* JSON Web Tokens (JWT)  
* TLS certificates  
* LDAP  
* OpenID Connect (OIDC)

TLS certificate authentication provides secure, mutual TLS verification for sensitive environments, while AppRole allows service accounts and applications to securely authenticate without human interaction.

For LDAP or OIDC deployments, enforce Multi Factor Authentication (MFA) for human operators to enhance security if supported. 

### Configuration {#configuration}

OpenBao supports two configuration formats:

1. HashiCorp Configuration Language (HCL)  
2. JSON

Properly configuring the OpenBao server is essential to ensure a secure production environment. The main configuration aspects include the UI, TLS certificate, and address/port settings.

A default production configuration HCL file may look like this:

| ui \= falsestorage "file" {  path \= "/opt/openbao/data"}api\_addr \= "https://0.0.0.0:8200"listener "tcp" {  address       \= "0.0.0.0:8200"  tls\_cert\_file \= "/opt/openbao/tls/tls.crt"  tls\_key\_file  \= "/opt/openbao/tls/tls.key"} |
| :---- |

In production, disabling or securing the UI is crucial, as it exposes OpenBao's management interface—which could be exploited if left unprotected. If the UI is required, limit its exposure by restricting access to trusted IP ranges or VPN users only. Implement strong authentication methods like OIDC for access control.

If the UI is not required, set ui \= false. 

TLS certificates encrypt traffic to and from the OpenBao server, ensuring data confidentiality and integrity. Using a valid, trusted TLS certificate prevents man-in-the-middle attacks and validates the server's identity to clients. Obtain a certificate from a trusted Certificate Authority (CA) and configure OpenBao to use it as shown in the example configuration above.

For environments using an internal CA, ensure that all clients trust the CA, and renew the certificates periodically to avoid downtime.

Controlling the address and ports on which OpenBao listens reduces exposure and minimizes the risk of unauthorized access. Limit OpenBao's exposure by binding it to an internal IP address (such as 127.0.0.1 or a specific internal network IP). Ensure that OpenBao only listens on the necessary port (default is 8200). Use firewall rules to restrict access to this port to authorized networks or users only.

These hardening measures reduce the attack surface of the OpenBao server, enhance security controls, and ensure that only authorized entities have access.

---

The resources below are provided to help you become familiar with OpenBao when deployed to Linode.

## OpenBao Resources

* [Package downloads](https://openbao.org/downloads/)  
* [Installation instructions](https://openbao.org/docs/install/)  
* [CLI documentation](https://openbao.org/docs/commands/)  
* [Plugins](https://openbao.org/docs/plugins/)  
* [Authentication](https://openbao.org/docs/auth/)  
* [OpenBao Linode Marketplace App](https://www.linode.com/docs/marketplace-docs/guides/openbao/)