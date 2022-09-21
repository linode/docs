---
slug: use-hashicorp-vault-for-secret-management
author:
  name: Tyler Langlois
  email: ty@tjll.net
description: 'How to configure, deploy, and use HashiCorp Vault to manage application secrets'
keywords: ['vault','secrets','secrets management','hcl','token','authentication']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-03-30
modified: 2019-03-30
modified_by:
  name: Linode
title: "Use HashiCorp Vault to Manage Secrets"
contributor:
  name: Linode
external_resources:
- '[Vault Documentation Overview](https://www.vaultproject.io/docs/)'
- '[Vault Reference Architecture and Best Practices](https://learn.hashicorp.com/vault/day-one/ops-reference-architecture)'
- '[Vault Secrets Engines](https://www.vaultproject.io/docs/secrets/index.html)'
- '[Vault Auth Methods](https://www.vaultproject.io/docs/auth/index.html)'
aliases: ['/applications/configuration-management/use-hashicorp-vault-for-secret-management/','/applications/configuration-management/vault/use-hashicorp-vault-for-secret-management/']
tags: ["security","automation"]
---

[HashiCorp Vault](https://www.vaultproject.io/) is a secrets management tool that helps to provide secure, automated access to sensitive data. Vault meets these use cases by coupling authentication methods (such as application tokens) to secret engines (such as simple key/value pairs) using policies to control how access is granted. In this guide, you will install, configure, and access Vault in an example deployment to illustrate Vault's features and API.

This guide will use the latest version of Vault, which is 1.1.0 at the time of this writing.

### Why Use Vault?

A service such as Vault requires operational effort to run securely and effectively. Given the added complexity of using Vault as part of an application, in what way does it add value?

Consider a simple application that must use an API token or other secret value. How should this sensitive credential be given to the application at runtime?

- Committing the secret alongside the rest of the application code in a version control system such as `git` is a poor security practice for a number of reasons, including that the sensitive value is recorded in plaintext and not protected in any way.
- Recording a secret in a file that is passed to an application requires that the file be securely populated in the first place and strictly access-controlled.
- Static credentials are challenging to rotate or restrict access to if an application is compromised.

Vault solves these and other problems in a number of ways, including:

- Services and applications that run without operator interaction can authenticate to Vault using values that can be rotated, revoked, and permission-controlled.
- Some [secrets engines](https://www.vaultproject.io/docs/secrets/index.html) can generate temporary, dynamically-generated secrets to ensure that credentials expire after a period of time.
- Policies for users and machine accounts can be strictly controlled for specific types of access to particular paths.

## Concepts

Before continuing, you should familiarize yourself with important Vault terms and concepts that will be used later in this guide.

- A **token** is the underlying mechanism that underpins access to Vault resources. Whether a user authenticates to Vault using a GitHub token or an application-driven service authenticates using an [AppRole](https://www.vaultproject.io/docs/auth/approle.html) RoleID and SecretID, all forms of authentication are eventually normalized to a **token**. Tokens are typically short-lived (that is, expire after a period or time-to-live, or `ttl`) and have one or more *policies* attached to them.
- A Vault **policy** dictates certain actions that may be performed upon a Vault **path**. Capabilities such as the ability to read a secret, write secrets, and delete them are all examples of actions that are defined in a policy for a particular **path**.
- A **path** in Vault is similar in form to a Unix filesystem path (like `/etc`) or a URL (such as `/blog/title`). Users and machine accounts interact with Vault over particular paths in order to retrieve secrets, change settings, or otherwise interact with a running Vault service. All Vault access is performed over a REST interface, so these paths eventually take the form of an HTTP URL. While some paths interact with the Vault service itself to manage resources such as policies or settings, many paths serve as an endpoint to either authenticate to Vault or interact with a **secret engine**.
- A **secret engine** is a backend used in Vault to provide secrets to Vault users. The simplest example of a **secret engine** is the [key/value backend](https://www.vaultproject.io/docs/secrets/kv/index.html), which simply returns plain text values that may be stored at particular paths (these secrets remain encrypted on the backend). Other examples of secret backends include the [PKI backend](https://www.vaultproject.io/docs/secrets/pki/index.html), which can generate and manage TLS certificates, and the [TOTP backend](https://www.vaultproject.io/docs/secrets/totp/index.html), which can generate temporary one-time passwords for web sites that require multi-factor authentication (including the Linode Manager).

## Installation

This guide will setup Vault in a simple, local filesystem-only configuration. The steps listed here apply equally to any distribution.

These installation steps will:

- Procure a TLS certificate to ensure that all communications between Vault and clients are encrypted.
- Configure Vault for local filesystem storage.
- Install the `vault` binary and set up the operating system to operate Vault as a service.

{{< note >}}
The configuration outlined in this guide is suitable for small deployments. In situations that call for highly-available or fault-tolerant services, consider running more than one Vault instance with a highly-available storage backend such as [Consul](https://www.vaultproject.io/docs/configuration/storage/consul.html).
{{< /note >}}

### Before you Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

    {{< note >}}
Setting the full hostname correctly in `/etc/hosts` is important in this guide in order to terminate TLS on Vault correctly. Your Linode's fully qualified domain name and short hostname should be present in the `/etc/hosts` file before continuing.
{{< /note >}}

3.  Follow our [UFW Guide](/docs/guides/configure-firewall-with-ufw/) in order to install and configure a firewall on your Ubuntu or Debian-based system, or our [FirewallD Guide](/docs/guides/introduction-to-firewalld-on-centos/) for rpm or CentOS-based systems. Consider reviewing Vault's [Production Hardening](https://www.vaultproject.io/guides/operations/production) recommendations if this will be used in a production environment.

    {{< note >}}
When configuring a firewall, keep in mind that Vault listens on port 8200 by default and Let's Encrypt utilizes ports 80 (HTTP) and 443 (HTTPS).
{{< /note >}}

### Acquire a TLS Certificate

1.  Follow the steps in our [Secure HTTP Traffic with Certbot](/docs/guides/secure-http-traffic-certbot/) guide to acquire a TLS certificate.

2.  Add a system group in order to grant limited read access to the TLS files created by Certbot.

        sudo groupadd tls

3.  Change the group ownership of certificate files in the Let's Encrypt directory to `tls`.

        sudo chgrp -R tls /etc/letsencrypt/{archive,live}

4.  Grant members of the `tls` group read access to the necessary directories and files.

        sudo chmod g+rx /etc/letsencrypt/{archive,live}
        sudo find /etc/letsencrypt/archive -name 'privkey*' -exec chmod g+r {} ';'

### Download Vault files

1.  Download the release binary for Vault.

        wget https://releases.hashicorp.com/vault/1.1.0/vault_1.1.0_linux_amd64.zip

    {{< note >}}
If you receive an error that indicates `wget` is missing from your system, install the `wget` package and try again.
{{< /note >}}

2.  Download the checksum file, which will verify that the zip file is not corrupt.

        wget https://releases.hashicorp.com/vault/1.1.0/vault_1.1.0_SHA256SUMS

3.  Download the checksum signature file, which verifies that the checksum file has not been tampered with.

        wget https://releases.hashicorp.com/vault/1.1.0/vault_1.1.0_SHA256SUMS.sig

### Verify the Downloads

1.  Import the HashiCorp Security GPG key (listed on the [HashiCorp Security](https://www.hashicorp.com/security.html) page under *Secure Communications*):

        gpg --recv-keys 51852D87348FFC4C

    The output should show that the key was imported:

    {{< output >}}
gpg: /home/user/.gnupg/trustdb.gpg: trustdb created
gpg: key 51852D87348FFC4C: public key "HashiCorp Security <security@hashicorp.com>" imported
gpg: no ultimately trusted keys found
gpg: Total number processed: 1
gpg:               imported: 1
{{</ output >}}

    {{< note >}}
If an error occurs with the error message `keyserver receive failed: Syntax error in URI`, simply try rerunning the `gpg` command again.
{{< /note >}}

    {{< note >}}
If you receive errors that indicate the `dirmngr` software is missing or inaccessible, install `dirmngr` using your package manager and run the GPG command again.
{{< /note >}}

1.  Verify the checksum file's GPG signature:

        gpg --verify vault*.sig vault*SHA256SUMS

    The output should contain the `Good signature from "HashiCorp Security <security@hashicorp.com>"` confirmation message:

    {{< output >}}
gpg: Signature made Mon 18 Mar 2019 01:44:51 PM MDT
gpg:                using RSA key 91A6E7F85D05C65630BEF18951852D87348FFC4C
gpg: Good signature from "HashiCorp Security &lt;security@hashicorp.com&gt;" [unknown]
gpg: WARNING: This key is not certified with a trusted signature!
gpg:          There is no indication that the signature belongs to the owner.
Primary key fingerprint: 91A6 E7F8 5D05 C656 30BE  F189 5185 2D87 348F FC4C
{{</ output >}}

1.  Verify that the fingerprint output matches the fingerprint listed in the *Secure Communications* section of the [HashiCorp Security](https://www.hashicorp.com/security.html) page.

1.  Verify the `.zip` archive's checksum:

        sha256sum -c vault*SHA256SUMS 2>&1 | grep OK

    The output should show the file's name as given in the `vault*SHA256SUMS` file:

    {{< output >}}
vault_1.1.0_linux_amd64.zip: OK
{{< /output >}}

### Install the Vault Executable

1.  Extract the Vault executable to the local directory.

        unzip vault_*_linux_amd64.zip

    {{< note >}}
If you receive an error that indicates `unzip` is missing from your system, install the `unzip` package and try again.
{{< /note >}}

2.  Move the `vault` executable into a system-wide location.

        sudo mv vault /usr/local/bin

3.  Reset the ownership and permissions on the executable.

        sudo chown root:root /usr/local/bin/vault
        sudo chmod 755 /usr/local/bin/vault

4.  Set executable capabilities on the `vault` binary. This will grant Vault privileges to lock memory, which is a best practice for running Vault securely (see the [Vault documentation](https://www.vaultproject.io/docs/configuration/#disable_mlock) for additional information).

        sudo setcap cap_ipc_lock=+ep /usr/local/bin/vault

5.  Verify that `vault` is now available in the local shell.

        vault --version

    The output of this command should return the following.

    {{< output >}}
Vault v1.1.0 ('36aa8c8dd1936e10ebd7a4c1d412ae0e6f7900bd')
{{< /output >}}

### System Vault Configuration

1.  Create a system user that `vault` will run as when the service is started.

        sudo useradd --system -d /etc/vault.d -s /bin/nologin vault

2.  Add the `vault` user to the previously created `tls` group, which will grant the user the ability to read Let's Encrypt certificates.

        sudo gpasswd -a vault tls

2.  Create the data directory and configuration directory for `vault` with limited permissions.

        sudo install -o vault -g vault -m 750 -d /var/lib/vault
        sudo install -o vault -g vault -m 750 -d /etc/vault.d

3.  Create a systemd `service` file that will control how to run `vault` persistently as a system daemon.

    {{< file "/etc/systemd/system/vault.service" ini >}}
[Unit]
Description="a tool for managing secrets"
Documentation=https://www.vaultproject.io/docs/
Requires=network-online.target
After=network-online.target
ConditionFileNotEmpty=/etc/vault.d/vault.hcl

[Service]
User=vault
Group=vault
ProtectSystem=full
ProtectHome=read-only
PrivateTmp=yes
PrivateDevices=yes
SecureBits=keep-caps
AmbientCapabilities=CAP_IPC_LOCK
Capabilities=CAP_IPC_LOCK+ep
CapabilityBoundingSet=CAP_SYSLOG CAP_IPC_LOCK
NoNewPrivileges=yes
ExecStart=/usr/local/bin/vault server -config=/etc/vault.d/vault.hcl
ExecReload=/bin/kill --signal HUP $MAINPID
KillMode=process
KillSignal=SIGINT
Restart=on-failure
RestartSec=5
TimeoutStopSec=30
StartLimitIntervalSec=60
StartLimitBurst=3
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
{{< /file >}}

    These systemd service options define a number of important settings to ensure that Vault runs securely and reliably. Review the [Vault documentation](https://learn.hashicorp.com/vault/operations/ops-deployment-guide#step-3-configure-systemd) for a complete explanation of what these options achieve.

## Configuration

### Configure Vault

1.  Create a configuration file for Vault with the following contents, replacing `example.com` with the domain used in your Let's Encrypt certificates.

    {{< file "/etc/vault.d/vault.hcl" aconf >}}
listener "tcp" {
  address = "0.0.0.0:8200"
  tls_cert_file = "/etc/letsencrypt/live/example.com/fullchain.pem"
  tls_key_file = "/etc/letsencrypt/live/example.com/privkey.pem"
}

storage "file" {
  path = "/var/lib/vault"
}
{{< /file >}}

    This configuration will use the Let's Encrypt certificates created in the previous steps to terminate TLS for the Vault service. This ensures that secrets will never be transmitted in plaintext. The actual storage for Vault will be on the local filesystem at `/var/lib/vault`.

### Run The Vault Service

1.  Vault is now ready to run. Start the service using `systemctl`.

        sudo systemctl start vault

2.  If desired, enable the service as well so that Vault starts at system boot time.

        sudo systemctl enable vault

3.  Confirm that Vault is operational by using the `vault` executable to check for the service's status. Set the `VAULT_ADDR` environment variable to `https://example.com:8200`, replacing `example.com` with your own domain:

        export VAULT_ADDR=https://example.com:8200

4.  `vault` commands should now be sent to your local Vault instance. To confirm this, run the `vault status` command:

        vault status

    The command should return output similar to the following:

    {{< output >}}
Key                Value
---                -----
Seal Type          shamir
Initialized        false
Sealed             true
Total Shares       0
Threshold          0
Unseal Progress    0/0
Unseal Nonce       n/a
Version            n/a
HA Enabled         false
{{< /output >}}

The remainder of this tutorial assumes that the environment variable `VAULT_ADDR` is set to this value to ensure that requests are sent to the correct Vault host.

### Initializing Vault

At this stage, Vault is installed and running, but not yet _initialized_. The following steps will initialize the Vault backend, which sets unseal keys and returns the initial root token. Initialization occurs only one time for a Vault deployment.

There are two configurable options to choose when performing the initialization step. The first value is the number of key shares, which controls the total number of unseal keys that Vault will generate. The second value is the key threshold, which controls how many of these unseal key shares are required before Vault will successfully unseal itself. Unsealing is required whenever Vault is restarted or otherwise brought online after being in a previously offline state.

To illustrate this concept, consider a secure server in a data center. Because the Vault database is only decrypted in-memory, stealing or bringing the server offline for any reason will leave the only copy of Vault's database on the filesystem in encrypted form, or "sealed".

When starting the server again, a key share of 3 and key threshold of 2 means that 3 keys exist, but at least 2 must be provided at startup for Vault to derive its decryption key and load its database into memory for access once again.

The key share count ensure that multiple keys can exist at different locations for a degree of fault tolerance and backup purposes. The key threshold count ensures that compromising one unseal key alone is not sufficient to decrypt Vault data.

1.  Choose a value for the number of key shares and key threshold. Your situation may vary, but as an example, consider a team of three people in charge of operating Vault. A key share of 3 ensures that each member holds one unseal key. A key threshold of 2 means that no single operator can lose their key and compromise the system or steal the Vault database without coordinating with another operator.

2.  Using these chosen values, execute the initialization command. Be prepared to save the output that is returned from the following command, as **it is only viewable once**.

        vault operator init -key-shares=3 -key-threshold=2

    This command will return output similar to the following:

    {{< output >}}
Unseal Key 1: BaR6GUWRY8hIeNyuzAn7FTa82DiIldgvEZhOKhVsl0X5
Unseal Key 2: jzh7lji1NX9TsNVGycUudSIy/X4lczJgsCpRfm3m8Q03
Unseal Key 3: JfdH8LqEyc4B+xLMBX6/LT9o8G/6isC2ZFfz+iNMIW/0

Initial Root Token: s.YijNa8lqSDeho1tJBtY02983

Vault initialized with 3 key shares and a key threshold of 2. Please securely
distribute the key shares printed above. When the Vault is re-sealed,
restarted, or stopped, you must supply at least 2 of these keys to unseal it
before it can start servicing requests.

Vault does not store the generated master key. Without at least 2 key to
reconstruct the master key, Vault will remain permanently sealed!

It is possible to generate new unseal keys, provided you have a quorum of
existing unseal keys shares. See "vault operator rekey" for more information.
{{< /output >}}

3.  In a production scenario, these unseal keys should be stored in separate locations. For example, store one in a password manager such as LastPass, encrypted one with gpg, and store another offline on a USB key. Doing so ensures that compromising one storage location is not sufficient to recover the number of unseal keys required to decrypt the Vault database.

4.  The `Initial Root Token` is equivalent to the "root" or superuser account for the Vault API. Record and protect this token in a similar fashion. Like the `root` account on a Unix system, this token should be used to create less-privileged accounts to use for day-to-day interactions with Vault and the root token should be used infrequently due to its widespread privileges.

### Unseal Vault

After initialization, Vault will be sealed. The following unseal steps must be performed any time the `vault` service is brought down and then brought up again, such as when performing `systemctl restart vault` or restarting the host machine.

1.  With `VAULT_ADDR` set appropriately, execute the unseal command.

        vault operator unseal

    A prompt will appear:

    {{< output >}}
Unseal Key (will be hidden):
{{< /output >}}

2.  Paste or enter one unseal key and press **Enter**. The command will finish with output similar to the following:

    {{< output >}}
Unseal Key (will be hidden):
Key                Value
---                -----
Seal Type          shamir
Initialized        true
Sealed             true
Total Shares       3
Threshold          2
Unseal Progress    1/2
Unseal Nonce       0124ce2a-6229-fac1-0e3f-da3e97e00583
Version            1.1.0
HA Enabled         false
{{< /output >}}

    Notice that the output indicates that the one out of two required unseal keys have been provided.

3.  Perform the `unseal` command again.

        vault operator unseal

4.  Enter a _different_ unseal key when the prompt appears.

    {{< output >}}
Unseal Key (will be hidden):
{{< /output >}}

5.  The resulting output should indicate that Vault is now unsealed (notice the `Sealed false` line).

    {{< output >}}
Unseal Key (will be hidden):
Key             Value
---             -----
Seal Type       shamir
Initialized     true
Sealed          false
Total Shares    3
Threshold       2
Version         1.1.0
Cluster Name    vault-cluster-a397153e
Cluster ID      a065557e-3ee8-9d26-4d90-b90c8d69fa5d
HA Enabled      false
{{< /output >}}

Vault is now operational.

## Using Vault

### Token Authentication

When interacting with Vault over its REST API, Vault identifies and authenticates most requests by the presence of a token. While the initial root token can be used for now, the [Policies](#policies) section of this guide explains how to provision additional tokens.

1.  Set the `VAULT_TOKEN` environment variable to the value of the previously-obtained root token. This token is the authentication mechanism that the `vault` command will rely on for future interaction with Vault. The actual root token will be different in your environment.

        export VAULT_TOKEN=s.YijNa8lqSDeho1tJBtY02983

2.  Use the `token lookup` subcommand to confirm that the token is valid and has the expected permissions.

        vault token lookup

3.  The output of this command should include the following:

    {{< output >}}
policies            [root]
{{< /output >}}

### The KV Secret Backend

Vault backends are the core mechanism Vault uses to permit users to read and write secret values. The simplest backend to illustrate this functionality is the [KV backend](https://www.vaultproject.io/docs/secrets/kv/index.html). This backend lets clients write key/value pairs (such as `mysecret=apikey`) that can be read later.

1.  Enable the secret backend by using the `enable` Vault subcommand.

        vault secrets enable -version=2 kv

2.  Write an example value to the KV backend using the `kv put` Vault subcommand.

        vault kv put kv/myservice api_token=secretvalue

    This command should return output similar to the following:

    {{< output >}}
Key              Value
---              -----
created_time     2019-03-31T04:35:38.631167678Z
deletion_time    n/a
destroyed        false
version          1
{{< /output >}}

3.  Read this value from the `kv/myservice` path.

        vault kv get kv/myservice

    This command should return output similar to the following:

    {{< output >}}
====== Metadata ======
Key              Value
---              -----
created_time     2019-03-31T04:35:38.631167678Z
deletion_time    n/a
destroyed        false
version          1

====== Data ======
Key          Value
---          -----
api_token    secretvalue
{{< /output >}}

4.  Many utilities and script are better suited to process json output. Use the `-format=json` flag to do a read once more, with the results return in JSON form.

        vault kv get -format=json kv/myservice

    {{< highlight json >}}
{
  "request_id": "2734ea81-6f39-c017-4c73-2719b2018b65",
  "lease_id": "",
  "lease_duration": 0,
  "renewable": false,
  "data": {
    "data": {
      "api_token": "secretvalue"
    },
    "metadata": {
      "created_time": "2019-03-31T04:35:38.631167678Z",
      "deletion_time": "",
      "destroyed": false,
      "version": 1
    }
  },
  "warnings": null
}
{{< /highlight >}}

### Policies

Up until this point, we have performed API calls to Vault with the root token. Production best practices dictate that this token should rarely be used and most operations should be performed with lesser-privileged tokens associated with controlled policies.

Policies are defined by specifying a particular path and the set of _capabilities_ that are permitted by a user upon the path. In our previous commands, the path has been `kv/myservice`, so we can create a policy to only read this secret and perform no other operations, including reading or listing secrets. When no policy exists for a particular path, Vault denies operations by default.

In the case of the KV backend, Vault distinguishes operations upon the stored data, which are the actual stored values, and metadata, which includes information such as version history. In this example, we will create a policy to control access to the key/value data alone.

1.  Create the following Vault policy file.

    {{< file "policy.hcl" aconf >}}
path "kv/data/myservice" {
  capabilities = ["read"]
}
{{< /file >}}

    This simple policy will permit any token associated with it to read the secret stored at the KV secret backend path `kv/myservice`.

2.  Load this policy into Vault using the `policy write` subcommand. The following command names the aforementioned policy `read-myservice`.

        vault policy write read-myservice policy.hcl

3.  To illustrate the use of this policy, create a new token with this new policy associated with it.

        vault token create -policy=read-myservice

    This command should return output similar to the following.

    {{< output >}}
Key                  Value
---                  -----
token                s.YdpJWRRaEIgdOW4y72sSVygy
token_accessor       07akQfzg0TDjj3YoZSGMPkHA
token_duration       768h
token_renewable      true
token_policies       ["default" "read-myservice"]
identity_policies    []
policies             ["default" "read-myservice"]
{{< /output >}}

4.  Open another terminal window or tab and login to the same host that Vault is running on. Set the `VAULT_ADDR` to ensure that new `vault` commands point at the local instance of Vault, replacing `example.com` with your domain.

        export VAULT_ADDR=https://example.com:8200

5.  Set the `VAULT_TOKEN` environment variable to the new token just created by the `token create` command. Remember that your actual token will be different than the one in this example.

        export VAULT_TOKEN=s.YdpJWRRaEIgdOW4y72sSVygy

6.  Now attempt to read our secret in Vault at the `kv/myservice` path.

        vault kv get kv/myservice

    Vault should return the key/value data.

    {{< output >}}
====== Metadata ======
Key              Value
---              -----
created_time     2019-03-31T04:35:38.631167678Z
deletion_time    n/a
destroyed        false
version          1

====== Data ======
Key          Value
---          -----
api_token    secretvalue
{{< /output >}}

7.  To illustrate forbidden operations, attempt to `list` all secrets in the KV backend.

        vault kv list kv/

    Vault should deny this request.

    {{< output >}}
Error listing kv/metadata: Error making API request.

URL: GET https://example.com:8200/v1/kv/metadata?list=true
Code: 403. Errors:

* 1 error occurred:
        * permission denied
{{< /output >}}

8.  In contrast, attempt to perform the same operation in the previous terminal window that has been configured with the root token.

        vault kv list kv/

    {{< output >}}
Keys
----
myservice
{{< /output >}}

    The root token should have sufficient rights to return a list of all secret keys under the `kv/` path.

### Authentication Methods

In practice, when services that require secret values are deployed, a token should not be distributed as part of the deployment or configuration management. Rather, services should authenticate themselves to Vault in order to acquire a token that has a limited lifetime. This ensures that credentials eventually expire and cannot be reused if they are ever leaked or disclosed.

Vault supports many types of authentication methods. For example, the Kubernetes authentication method can retrieve a token for individual pods. As a simple illustrative example, the following steps will demonstrate how to use the [AppRole](https://www.vaultproject.io/docs/auth/approle.html) method.

The AppRole authentication method works by requiring that clients provide two pieces of information: the AppRole RoleID and SecretID. The recommendation approach to using this method is to store these two pieces of information in separate locations, as one alone is not sufficient to authenticate against Vault, but together, they permit a client to retrieve a valid Vault token. For example, in a production service, a RoleID might be present in a service's configuration file, while the SecretID could be provided as an environment variable.

1.  Enable the AppRole authentication method using the `auth` subcommand. Remember to perform these steps in the terminal window with the root token stored in the `VAULT_TOKEN` environment variable, otherwise Vault commands will fail.

        vault auth enable approle

2.  Create a named role. This will define a role that can be used to "log in" to Vault and retrieve a token with a policy associated with it. The following command creates a named role named `my-application` which creates tokens valid for 10 minutes which will have the `read-myservice` policy associated with them.

        vault write auth/approle/role/my-application \
            token_ttl=10m \
            policies=read-myservice

3.  Retrieve the RoleID of the named role, which uniquely identifies the AppRole. Note this value for later use.

        vault read auth/approle/role/my-application/role-id

    {{< output >}}
Key        Value
---        -----
role_id    147cd412-d1c2-4d2c-c57e-d660da0b1fa8
{{< /output >}}

    In this example case, RoleID is `147cd412-d1c2-4d2c-c57e-d660da0b1fa8`. Note that your value will be different.

4.  Finally, read the secret-id of the named role, and save this value for later use as well.

        vault write -f auth/approle/role/my-application/secret-id

    {{< output >}}
Key                   Value
---                   -----
secret_id             2225c0c3-9b9f-9a9c-a0a5-10bf06df7b25
secret_id_accessor    30cbef6a-8834-94fe-6cf3-cf2e4598dd6a
{{< /output >}}

    In this example output, the SecretID is `2225c0c3-9b9f-9a9c-a0a5-10bf06df7b25`.

5.  Use these values to generate a limited-use token by performing a `write` operation against the AppRole API. Replace the RoleID and SecretID values here with your own.

        vault write auth/approle/login \
            role_id=147cd412-d1c2-4d2c-c57e-d660da0b1fa8 \
            secret_id=2225c0c3-9b9f-9a9c-a0a5-10bf06df7b25

    The resulting output should include a new token, which in this example case is `s.coRl4UR6YL1sqw1jXhJbuZfq`

    {{< output >}}
Key                     Value
---                     -----
token                   s.3uu4vwFO8D1mG5S76IG04mck
token_accessor          fi3aW4W9kZNB3FAC20HRXeoT
token_duration          10m
token_renewable         true
token_policies          ["default" "read-myservice"]
identity_policies       []
policies                ["default" "read-myservice"]
token_meta_role_name    my-application
{{< /output >}}

6.  Open one more terminal tab or window and log in to your remote host running Vault.

7.  Once again, set the `VAULT_ADDR` environment variable to the correct value to communicate with your local Vault instance.

        export VAULT_ADDR=https://example.com:8200

8.  Set the `VAULT_TOKEN` environment variable to this newly created token. From the previous example output, this would be the following (note that your token will be different).

        export VAULT_TOKEN=s.3uu4vwFO8D1mG5S76IG04mck

9.  Read the KV path that this token should be able to access.

        vault kv get kv/myservice

    The example should be read and accessible.

10. If you read this value using this Vault token after more than 10 minutes have elapsed, the token will have expired and any read operations using the token should be denied. Performing another `vault write auth/approle/login` operation (detailed in step 5) can generate new tokens to use.
