---
slug: deploying-openbao-on-a-linode-compute-instance
title: "Deploying OpenBao on a Linode Compute Instance"
description: "Deploy OpenBao on a Linode Compute Instance using Ubuntu 24.04 LTS and the Linode CLI. Learn how to install, configure, unseal, and securely manage secrets."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2025-04-17
keywords: ['openbao','openbao linode','openbao ubuntu install','secrets management linode','how to install openbao','secure secrets storage linux','openbao ubuntu 24.04','deploy openbao cli','install vault alternative','hashicorp vault fork','openbao setup tutorial','linux secrets manager','initialize openbao server','openbao unseal process','openbao vs vault','openbao config hcl','how to deploy openbao on a linode instance','secure secrets management with openbao','install and configure openbao on ubuntu','openbao systemd service setup','openbao cli secret storage example','openbao firewall and api access configuration','openbao key value store example','setting up openbao secrets engine']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

This guide walks through how to deploy OpenBao on a single Linode Compute Instance using the [Linode CLI](https://github.com/linode/linode-cli).

## Prerequisites

To follow along in this walkthrough, you’ll need the following:

-   A [Linode account](https://www.linode.com/cfe)
-   A [Linode API token (personal access token)](/docs/products/platform/accounts/guides/manage-api-tokens/)
-   The [Linode CLI](/docs/products/tools/cli/guides/install/) installed and configured
-   An [SSH key pair](https://www.linode.com/content/ssh-key-authentication-how-to-create-ssh-key-pairs/)

## Before You Begin

1.  If you do not already have a virtual machine to use, create a Compute Instance with at least 4 GB of memory. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Step 1: Initialize a Compute Instance

This guide uses the Linode CLI to provision resources. The Linode Marketplace offers a one-click [OpenBao Marketplace app](/docs/marketplace-docs/guides/openbao/), whereas this tutorial walks through a manual installation.

### Determine Instance Configuration

In order to provision a Linode instance, you must specify the desired operating system, geographical region, and Linode plan size. The options available for each of these can be obtained using the Linode CLI.

#### Operating System

Run this command to obtain a formatted list of available operating systems:

```command
linode-cli images list --type=manual
```

This guide uses Ubuntu 24.04 LTS, which has the ID `linode/ubuntu24.04`.

#### Geographical Region

```command
linode-cli regions list
```

This guide uses the `us-mia` region (Miami, FL).

#### Compute Instance Size

```command
linode-cli linodes types
```

The OpenBao documentation does not explicitly state hardware resource requirements for deploying OpenBao. However, as a fork of HashiCorp Vault, the [hardware size guide](https://developer.hashicorp.com/vault/tutorials/day-one-raft/raft-reference-architecture#hardware-sizing-for-vault-servers) for Vault can serve as a reference. For an initial, small cluster deployment of HashiCorp Vault (and thus, OpenBao), the documentation recommends:

-   2-4 CPU cores
-   8-16 GB RAM
-   100+ GB disk capacity
-   75+ Mbps transfer rate

This guide uses the `g6-standard-4` Linode, which has 4 cores, 160 GB disk, and 8 GB RAM with a 5000 Mbps transfer rate. These capabilities are comparable to the hardware sizing recommendations.

### Create the Compute Instance

1.  The following command creates a Linode Compute Instance based on the specified operating system, geographical region, and size as noted above.

    ```command
    linode-cli linodes create \
      --image linode/ubuntu24.04 \
      --region us-mia \
      --type g6-standard-4 \
      --root_pass {{< placeholder "PASSWORD" >}} \
      --authorized_keys "$(cat ~/.ssh/id_ed25519.pub)" \
      --label openbao-linode
    ```

    Note the following key points:

    -   Replace {{< placeholder "PASSWORD" >}} with a secure alternative.
    -   This command assumes that an SSH public/private key pair exists, with the public key stored as `id_ed25519.pub` in the user’s `$HOME/.ssh` folder.
    -   The `--label` argument specifies the name of the new server (e.g. `openbao-linode`).

    ```output
    Using default values: {'authorized_users': ['{{< placeholder "USERNAME" >}}']}; use the --no-defaults flag to disable defaults
    ┌────┬────────────────┬────────┬───────────────┬────────────────────┬──────────────┬──────────────┬─────────────────┬───────────────────────┐
    │ id │ label          │ region │ type          │ image              │ status       │ ipv4         │ disk_encryption │ placement_group.label │
    ├────┼────────────────┼────────┼───────────────┼────────────────────┼──────────────┼──────────────┼─────────────────┼───────────────────────┤
    │ {{< placeholder "ID" >}} │ openbao-linode │ us-mia │ g6-standard-4 │ linode/ubuntu24.04 │ provisioning │ {{< placeholder "IPV4_ADDRESS" >}} │ enabled         │                       │
    └────┴────────────────┴────────┴───────────────┴────────────────────┴──────────────┴──────────────┴─────────────────┴───────────────────────┘
    ```

1.  Within a few minutes of executing this command, the instance should be visible with status `running` in the Akamai Cloud Manager or via the following Linode CLI command:

    ```command
    linode-cli linodes list --label openbao-linode
    ```

    ```output
    ┌────┬────────────────┬────────┬───────────────┬────────────────────┬─────────┬──────────────┬─────────────────┬───────────────────────┐
    │ id │ label          │ region │ type          │ image              │ status  │ ipv4         │ disk_encryption │ placement_group.label │
    ├────┼────────────────┼────────┼───────────────┼────────────────────┼─────────┼──────────────┼─────────────────┼───────────────────────┤
    │ {{< placeholder "ID" >}} │ openbao-linode │ us-mia │ g6-standard-4 │ linode/ubuntu24.04 │ running │ {{< placeholder "IPV4_ADDRESS" >}} │ enabled         │                       │
    └────┴────────────────┴────────┴───────────────┴────────────────────┴─────────┴──────────────┴─────────────────┴───────────────────────┘
    ```

Depending on notification settings, emails detailing the progress of the provisioning process may also be sent to the Linode user’s address.

## Step 2: Install OpenBao on the Linode Compute Instance

To install OpenBao, you need to SSH into the newly provisioned Linode:

1.  The IP address of the new instance can be found in the Linode Cloud Manager dashboard or via the following command:

    ```command
    linode-cli linodes list
    ```

1.  Once the IP address is found, run the following command:

    ```command
    ssh -l root {{< placeholder "IP_ADDRESS" >}}
    ```

{{< note >}}
This method of connecting uses the `root` user, which is initially the only accessible user on the system. For production systems, it is strongly recommended that you disable the ability to access the instance as the `root` user, instead creating a limited user account with sudo privileges for access. See [this guide](https://techdocs.akamai.com/cloud-computing/docs/set-up-and-secure-a-compute-instance#add-a-limited-user-account) for more details.

This guide assumes that all remaining commands are run with `sudo` as a newly created user on the Linode instance.
{{< /note >}}

### Update System Packages

Ensure that the new system is up to date with the latest Ubuntu packages. The Ubuntu package manager (`apt`) needs to be updated to pull the latest package manifests, followed by upgrading any that are outdated.

```command
sudo apt update && apt upgrade -y
```

### Download and Install the OpenBao Package

Find the desired version of OpenBao from the [downloads page](https://openbao.org/downloads/).

1.  In this case, the AMD 64-bit Debian package works with the provisioned Linode Compute Instance.

    ```command
    wget https://github.com/openbao/openbao/releases/download/v2.2.0/bao_2.2.0_linux_amd64.deb
    ```

1.  Install the package:

    ```command
    sudo dpkg -i bao_2.2.0_linux_amd64.deb
    ```

    ```output
    Selecting previously unselected package bao.
    (Reading database ... 124865 files and directories currently installed.)
    Preparing to unpack bao_2.2.0_linux_amd64.deb ...
    Unpacking bao (2.2.0) ...
    Setting up bao (2.2.0) ...
    Generating OpenBao TLS key and self-signed certificate...
    ...
    OpenBao TLS key and self-signed certificate have been generated in '/opt/openbao/tls'.
    ```

1.  Verify the install was successful:

    ```command
    bao -h
    ```

### Verify Swap Memory Limits

For Linux distributions, ensure that the OpenBao service settings do not impose a soft limit on Swap memory. To check this with a systemd-based Linux distro, use the following command:

```command
systemctl cat openbao
```

```output
# /usr/lib/systemd/system/openbao.service
[Unit]
Description="OpenBao - A tool for managing secrets"
...

[Service]
...
TimeoutStopSec=30
LimitNOFILE=65536
MemorySwapMax=0

[Install]
WantedBy=multi-user.target
```

Verify that `MemorySwapMax=0` appears in the results under the `Service` heading.

## Step 3: Test the OpenBao Development Server

OpenBao provides a development server that runs completely in memory. Use this to verify settings and explore OpenBao features.

### Start the Development Server

To start the server in development mode and set a primary key run this command:

```command
bao server -dev \
  -dev-root-token-id="this-is-my-test-dev-token"
```

The OpenBao server configuration should print to the screen along with a tail of the logs:

```output
==> OpenBao server configuration:

Administrative Namespace:
             Api Address: http://127.0.0.1:8200
                     Cgo: disabled
         Cluster Address: https://127.0.0.1:8201
   Environment Variables: HOME, LANG, LESSCLOSE, LESSOPEN, LOGNAME, LS_COLORS, MAIL, PATH, PWD, SHELL, SHLVL, SUDO_COMMAND, SUDO_GID, SUDO_UID, SUDO_USER, TERM, USER, _
              Go Version: go1.22.9
              Listener 1: tcp (addr: "127.0.0.1:8200", cluster address: "127.0.0.1:8201", max_request_duration: "1m30s", max_request_size: "33554432", tls: "disabled")
               Log Level:
           Recovery Mode: false
                 Storage: inmem
                 Version: OpenBao v2.0.3, built 2024-11-15T16:54:47Z
             Version Sha: a2522eb71d1854f83c7e2e02fdbfc01ae74c3a78

             ==> OpenBao server started! Log data will stream in below:

             ...
             2024-11-25T10:07:57.493-0700 [INFO]  core: vault is unsealed
             2024-11-25T10:07:57.495-0700 [INFO]  expiration: revoked lease: lease_id=auth/token/root/hf0285ed983c6c93bd02f9422f179d20f12508b046d39228a7b2e13c245293de6
             2024-11-25T10:07:57.498-0700 [INFO]  core: successful mount: namespace="" path=secret/ type=kv version=""
             2024-11-25T10:07:57.499-0700 [INFO]  secrets.kv.kv_cd63d9f9: collecting keys to upgrade
             2024-11-25T10:07:57.499-0700 [INFO]  secrets.kv.kv_cd63d9f9: done collecting keys: num_keys=1
             2024-11-25T10:07:57.499-0700 [INFO]  secrets.kv.kv_cd63d9f9: upgrading keys finished
...
```

Leave this server process running in the background. In a separate terminal window, connect to the Linode instance with another shell session.

### Setting and Retrieving a Test Secret

Use `curl` requests to test setting and retrieving a test secret. OpenBao expects certain variables to be set for every request.

1.  Instead of setting these variables repeatedly with each command, set the following environment variables in the shell:

    ```command
    export VAULT_TOKEN="this-is-my-test-dev-token"
    export OPENBAO_IP="127.0.0.1"
    export OPENBAO_PORT="8200"
    ```

1.  Send a request with `curl` to set a secret as a key-value pair.

    ```command
    curl -X POST \
      --header "X-Vault-Token: $VAULT_TOKEN" \
      --header "Content-Type: application/json" \
      --data '{"data": {"password": "OpenBao123"}}' \
      http://$OPENBAO_IP:$OPENBAO_PORT/v1/secret/data/test-password-1 \
        | json_pp
    ```

    ```output
    {
       "auth" : null,
       "data" : {
          "created_time" : "2025-04-17T16:53:43.538885271Z",
          "custom_metadata" : null,
          "deletion_time" : "",
          "destroyed" : false,
          "version" : 1
       },
       "lease_duration" : 0,
       "lease_id" : "",
       "renewable" : false,
       "request_id" : "8b6538d0-e52c-7a7a-27a4-6d4c58d9fc02",
       "warnings" : null,
       "wrap_info" : null
    }
    ```

    The development server is only exposed on `localhost`. Therefore, this command must be run on the server itself. Authentication is handled by supplying the `X-Vault-Token` header. The structure of the URI follows the pattern `/v1/secret/data/{{< placeholder "SECRET_NAME" >}}`. This `POST` request stores the key-value pair at location `/data/{{< placeholder "SECRET_NAME" >}}`.

    The response provides metadata regarding the secret stored in the `data` object, including versioning (how many times this secret has been updated).

1.  To retrieve the secret, send the following request:

    ```command
    curl \
      --header "X-Vault-Token: $VAULT_TOKEN" \
      http://$OPENBAO_IP:$OPENBAO_PORT/v1/secret/data/test-password-1 \
        | json_pp
    ```

    The original secret is found within the data object as a key-value pair.

    ```output
    {
       "auth" : null,
       "data" : {
          "data" : {
             "password" : "OpenBao123"
          },
          "metadata" : {
             "created_time" : "2025-04-17T16:53:43.538885271Z",
             "custom_metadata" : null,
             "deletion_time" : "",
             "destroyed" : false,
             "version" : 1
          }
       },
       "lease_duration" : 0,
       "lease_id" : "",
       "renewable" : false,
       "request_id" : "7ec0baa1-126d-1bd8-56a3-4ea4555821ff",
       "warnings" : null,
       "wrap_info" : null
    }
    ```

1.  When done, you can close the second terminal session.

1.  Return to the original terminal session with OpenBao running and press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop OpenBao.

## Step 4: Run OpenBao as a Service

In a real-world use case, OpenBao should run as a service managed by a tool such as `systemd`.

1.  Run the following `systemctl` command to check the status of the OpenBao service:

    ```command
    systemctl status openbao
    ```

    This shows that `systemd` is aware of the OpenBao service but it has not been started:

    ```output
    ○ openbao.service - "OpenBao - A tool for managing secrets"
         Loaded: loaded (/usr/lib/systemd/system/openbao.service; disabled; preset: enabled)
         Active: inactive (dead)
           Docs: https://github.com/openbao/openbao/tree/main/website/content/docs
    ```

1.  Edit the OpenBao configuration file, located at `/etc/openbao/openbao.hcl`, in a command line text editor such as `nano`:

    ```command
    sudo nano /etc/openbao/openbao.hcl
    ```

    Edit the file to create a publicly available service with the following contents:

    ```file {title="/etc/openbao/openbao.hcl"}
    ui = false

    storage "file" {
      path = "/opt/openbao/data"
    }
    api_addr = "http://127.0.0.1:8200"

    listener "tcp" {
      address = "0.0.0.0:8200"
      tls_disable = 1
    }
    ```

    {{< note >}}
    The configuration above is insecure and not suitable for production use. It is only for demonstration purposes of this tutorial. For a production-grade deployment, reference the [configuration](#configuration) near the end of this guide.
    {{< /note >}}

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Start the OpenBao service, then check its status.

    ```command
    systemctl start openbao
    systemctl status openbao
    ```

    ```output
    ● openbao.service - "OpenBao - A tool for managing secrets"
         Loaded: loaded (/usr/lib/systemd/system/openbao.service; disabled; preset: enabled)
         Active: active (running) since Mon 2024-11-25 10:38:04 MST; 7s ago
           Docs: https://github.com/openbao/openbao/tree/main/website/content/docs
       Main PID: 642487 (bao)
          Tasks: 6 (limit: 1124)
         Memory: 12.2M (swap max: 0B peak: 12.5M)
            CPU: 66ms
         CGroup: /system.slice/openbao.service
                 └─642487 /usr/bin/bao server -config=/etc/openbao/openbao.hcl
    ```

1.  Run the following command to start the service automatically whenever the Linode server boots:

    ```command
    systemctl enable openbao
    ```

## Step 5: Configure OpenBao for External Access

Although OpenBao is now running as a service on the Linode Compute Instance, it is still not ready for use. Use the [OpenBao CLI](https://openbao.org/docs/commands/) to interact with the running server, retrieving its current status:

```command
bao status --address=http://0.0.0.0:8200
```

```output
Key                Value
---                -----
Seal Type          shamir
Initialized        false
Sealed             true
Total Shares       0
Threshold          0
Unseal Progress    0/0
Unseal Nonce       n/a
Version            2.2.0
Build Date         2025-03-05T13:07:08Z
Storage Type       file
HA Enabled         false
```

The status shows that the server has not been initialized, and it is sealed. Both of these issues must be resolved before the server can be interacted with.

### Initialize the Server

1.  Set the `BAO_ADDR` environment variable, which is used in several subsequent commands:

    ```command
    export BAO_ADDR=http://0.0.0.0:8200
    ```

1.  Initialize the server:

    ```command
    bao operator init
    ```

    ```output
    Unseal Key 1: SNP+diKq1L2MYYre8pn+PIqSEn/nK76n7C6coUoVby4g
    Unseal Key 2: 9Bm3d5ZHsWBT/LghfVYbGrVn0Lcmr5CvNu6H8UYVx+R/
    Unseal Key 3: IrPLoIFrl2ol7dF4mA9C+kTaE44qogwT/pZ+kTrS7M4j
    Unseal Key 4: O7fs+9492lVGdI5295n4AKis5c3cFZ8VEtkBmLg3lYAJ
    Unseal Key 5: 0gnwUnHfkeFTaE6xIkVWy/5s4Hfwh5WxVWOrCrApGHig

    Initial Root Token: s.V82B9tynwZkQtDyOne7PJ1IS

    Vault initialized with 5 key shares and a key threshold of 3. Please securely
    distribute the key shares printed above. When the Vault is re-sealed,
    restarted, or stopped, you must supply at least 3 of these keys to unseal it
    before it can start servicing requests.

    Vault does not store the generated root key. Without at least 3 keys to
    reconstruct the root key, Vault will remain permanently sealed!

    It is possible to generate new unseal keys, provided you have a quorum of
    existing unseal keys shares. See "bao operator rekey" for more information.
    ```

Store the unseal keys and initial root token in a secure location.

### Unseal the Vault (Three Times for Quorum)

1.  Use the following command to begin unsealing the vault:

    ```command
    bao operator unseal
    ```

    When prompted, enter one of the unseal keys provided in the previous section:

    ```output
    Unseal Key (will be hidden): SNP+diKq1L2MYYre8pn+PIqSEn/nK76n7C6coUoVby4g
    ```

    After this first execution, the unseal progress shows `1/3`:

    ```output
    Key                Value
    ---                -----
    Seal Type          shamir
    Initialized        true
    Sealed             true
    Total Shares       5
    Threshold          3
    Unseal Progress    1/3
    Unseal Nonce       e88d59f4-db7f-a074-c9e5-6476e55d77c4
    Version            2.2.0
    Build Date         2025-03-05T13:07:08Z
    Storage Type       file
    HA Enabled         false
    ```

    Unsealing must be done a total of three times, as this is the default quorum for OpenBao unsealing.

1.  Unseal the vault again, but enter a different unseal key when prompted:

    ```command
    bao operator unseal
    ```

    ```output
    Unseal Key (will be hidden): 9Bm3d5ZHsWBT/LghfVYbGrVn0Lcmr5CvNu6H8UYVx+R/
    Key                Value
    ---                -----
    Seal Type          shamir
    Initialized        true
    Sealed             true
    Total Shares       5
    Threshold          3
    Unseal Progress    2/3
    Unseal Nonce       e88d59f4-db7f-a074-c9e5-6476e55d77c4
    Version            2.2.0
    Build Date         2025-03-05T13:07:08Z
    Storage Type       file
    HA Enabled         false
    ```

1.  Unseal the vault for the third and final time, using another unsealing key when prompted:

    ```command
    bao operator unseal
    ```

    After unsealing has been executed three times (with three different unseal keys), the OpenBao status shows the following:

    ```output
    Unseal Key (will be hidden): IrPLoIFrl2ol7dF4mA9C+kTaE44qogwT/pZ+kTrS7M4j
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
    Cluster Name    vault-cluster-bf06dcdc
    Cluster ID      e241640b-4e62-5063-04fb-e71562706b8c
    HA Enabled      false
    ```

The vault has now been initialized and unsealed.

### Authenticate the CLI

To authenticate the CLI with the server, use the `bao login` command with the root token provided upon vault initialization.

```command
bao login -method=token s.V82B9tynwZkQtDyOne7PJ1IS
```

```output
Success! You are now authenticated. The token information displayed below is
already stored in the token helper. You do NOT need to run "bao login" again.
Future OpenBao requests will automatically use this token.

Key                  Value
---                  -----
token                s.V82B9tynwZkQtDyOne7PJ1IS
token_accessor       4IjIYjvf9TLIPPXgMVFFJYzG
token_duration       ∞
token_renewable      false
token_policies       ["root"]
identity_policies    []
policies             ["root"]
```

### Enable Key-Value Storage

Lastly, enable a key-value store in OpenBao for stashing and retrieving secrets via the API.

To do this, run the following command:

```command
bao secrets enable kv
```

```output
Success! Enabled the kv secrets engine at: kv/
```

### Setting and Retrieving a Secret Remotely Over HTTP

OpenBao can now be accessed externally via the API. Ensure that any firewall on the Linode Compute Instance allows traffic on port `8200`.

1.  From a remote machine, set a new secret, providing the root token for authentication.

    ```command
    curl -X POST \
      --header "X-Vault-Token: s.eZTodpa8pErpfQGDyPPUqVME" \
      --header "Content-Type: application/json" \
      --data '{"data": {"hello": "world"}}' \
      http://{{< placeholder "LINODE_IP" >}}:8200/v1/kv/test-secret
    ```

1.  Get the newly created secret to verify it was stored properly.

    ```command
    curl -X GET \
      --header "X-Vault-Token: s.eZTodpa8pErpfQGDyPPUqVME" \
      http://{{< placeholder "LINODE_IP" >}}:8200/v1/kv/test-secret
    ```

    ```output
    {
        "auth" : null,
        "data" : {
           "hello" : "world"
        },
        "lease_duration" : 2764800,
        "lease_id" : "",
        "renewable" : false,
        "request_id" : "3bbd69a5-b77a-62b0-686d-a8a3103d6d6b",
        "warnings" : null,
        "wrap_info" : null
    }
    ```

## Considerations for Production Deployments

To harden an OpenBao server for production use, several additional steps are recommended.

### Auto Unseal

OpenBao starts with its vault in a sealed state, meaning all data is encrypted. For more information on the seal/unseal concept in OpenBao, see their [documentation](https://openbao.org/docs/concepts/seal/).

In production, [auto-unseal](https://openbao.org/docs/concepts/seal/#auto-unseal) is recommended to minimize manual operations that could lead to mistakes or exposure. Auto-unseal is configured using cloud-based key management systems to ensure the unsealing key is never exposed directly.

### Authentication

Enable and configure secure authentication methods such as:

-   AppRole
-   JSON Web Tokens (JWT)
-   TLS certificates
-   LDAP
-   OpenID Connect (OIDC)

TLS certificate authentication provides secure, mutual TLS verification for sensitive environments, while AppRole allows service accounts and applications to securely authenticate without human interaction.

For LDAP or OIDC deployments, enforce Multi Factor Authentication (MFA) for human operators to enhance security if supported.

### Configuration

OpenBao supports two configuration formats:

1.  HashiCorp Configuration Language (HCL)
2.  JSON

Properly configuring the OpenBao server is essential to ensure a secure production environment. The main configuration aspects include the UI, TLS certificate, and address/port settings.

A default production configuration HCL file may look like this:

```file
ui = false

storage "file" {
  path = "/opt/openbao/data"
}
api_addr = "https://0.0.0.0:8200"

listener "tcp" {
  address       = "0.0.0.0:8200"
  tls_cert_file = "/opt/openbao/tls/tls.crt"
  tls_key_file  = "/opt/openbao/tls/tls.key"
}
```

In production, disabling or securing the UI is crucial, as it exposes OpenBao's management interface—which could be exploited if left unprotected. If the UI is required, limit its exposure by restricting access to trusted IP ranges or VPN users only. Implement strong authentication methods like OIDC for access control.

If the UI is not required, set `ui = false`.

TLS certificates encrypt traffic to and from the OpenBao server, ensuring data confidentiality and integrity. Using a valid, trusted TLS certificate prevents man-in-the-middle attacks and validates the server's identity to clients. Obtain a certificate from a trusted Certificate Authority (CA) and configure OpenBao to use it as shown in the example configuration above.

For environments using an internal CA, ensure that all clients trust the CA, and renew the certificates periodically to avoid downtime.

Controlling the address and ports on which OpenBao listens reduces exposure and minimizes the risk of unauthorized access. Limit OpenBao's exposure by binding it to an internal IP address (such as `127.0.0.1` or a specific internal network IP). Ensure that OpenBao only listens on the necessary port (default is `8200`). Use firewall rules to restrict access to this port to authorized networks or users only.

These hardening measures reduce the attack surface of the OpenBao server, enhance security controls, and ensure that only authorized entities have access.