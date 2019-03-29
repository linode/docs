---
author:
  name: Tyler Langlois
  email: ty@tjll.net
description: 'How to configure, deploy, and use HashiCorp Vault to manage application secrets'
keywords: ['vault','secrets','secrets management','hcl','token','authentication']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-02-12
modified: 2019-02-12
modified_by:
  name: Linode
title: "Use HashiCorp Vault to Manage Secrets"
contributor:
  name: Linode
external_resources:
- '[Terraform Input Variable Configuration](https://www.terraform.io/docs/configuration/variables.html)'
---

[HashiCorp Vault](https://www.vaultproject.io/) is a secrets management tool that helps to provide secure, automated access to sensitive data. Vault meets these use cases by coupling authentication methods (such as application tokens) to secret engines (such as simple key/value pairs) using policies to control how access is granted. In this guide, you will deploy, configure, and access Vault in an example application to illustrate Vault's features and API.

This guide will use the latest version of Vault at the time of writing, which is 1.1.0.

### Why Use Vault?

A service such as Vault requires operational effort to run securely and effectively. Given the added complexity of using Vault as part of an application, in what way does it add value?

Consider a simple application that must use an API token or other secret value. How should this sensitive credential be given to the application at runtime?

- Committing the secret alongside the rest of the application code in a version control system such as `git` is a poor security practice for a number of reasons, including that the sensitive value is recorded in plaintext and not protected in any way.
- Recording a secret in a file that is passed to an application requires that the file be securely populated in the first place and strictly access-controlled.
- In the case of a compromised application, static credentials are challenging to rotate or restrict access to.

Vault solves these and other problems in a number of ways:

- Services and applications that run without operator interaction can authenticate to Vault using values that can be rotated, revoked, and permission-controlled.
- Some secret engines, such as the [AWS Secret Engine](https://www.vaultproject.io/docs/secrets/aws/index.html), can generate temporary, dynamically-generated secrets to ensure that credentials expire after a period of time.
- Policies for users and machine accounts can be strictly controlled for specific types of access to particular paths.

## Concepts

Before continuing, you should familiarize yourself with important Vault terms and concepts that will be used later in this guide.

- A **token** is the the underlying mechanism that underpins access to Vault resources. Whether a user authenticates to Vault using a GitHub token or an application-driven service authenticates using an [AppRole](https://www.vaultproject.io/docs/auth/approle.html) RoleID and SecretID, all forms of authentication are eventually normalize to a **token**. Tokens are typically short-lived (that is, expire after a period of time or time-to-live, or `ttl`) and have one or more *policies* attached to them.
- A Vault **policy** dictates certain actions that may be performed upon a Vault **path**. Capabilities such as the ability to read a secret, write secrets, and delete them are all examples of actions that are defined in a policy for a particular **path**.
- **path**s in Vault are similar in form to Unix filesystem paths (like `/etc`) or URLs (such as `/blog/title`). Users and machine accounts interact with Vault over particular paths in order to retrieve secrets, change settings, or otherwise interact with a running Vault service. All Vault access is performed over a REST interface, so these paths eventually take the form of an HTTP URL. While some paths interact with the Vault service itself to manage resources such as policies or settings, many important paths serve as an endpoint to either authenticate to Vault or interact with a **secret engine**.
- A **secret engine** is a backend used in Vault to provide secrets to Vault users. The simplest example of a **secret engine** is the [key/value backend](https://www.vaultproject.io/docs/secrets/kv/index.html), which simply returns plain text values that may be stored at particular paths (these secrets remain encrypted on the backend). Other examples of secret backends include the [PKI backend](https://www.vaultproject.io/docs/secrets/pki/index.html), which can generate and manage TLS certificates, and the [TOTP backend](https://www.vaultproject.io/docs/secrets/totp/index.html), which can generate temporary one-time passwords for web sites that require multi-factor authentication (including the Linode Manager).

## Installation

This guide will use Docker to install Vault in a simple, local filesystem-only configuration. The steps listed here apply equally to any distribution.

These installation steps will:

- Procure a TLS certificate to ensure that all communications between Vault and clients are encrypted.
- Configure Vault for local filesystem storage.
- Install the `vault` binary and setup the operating system to operate Vault as a service.

{{< note >}}
The configuration outlined in this guide is suitable for small deployments. In situations that call for highly-available or fault-tolerant services, consider running more than one Vault instance with a highly-available storage backend such as [Consul](https://www.vaultproject.io/docs/configuration/storage/consul.html).
{{< /note >}}

### Before you Begin

1.  Familiarize yourself with Linode's [Getting Started](/docs/getting-started/) guide and complete the steps for deploying and setting up a Linode running a recent Linux distribution (such as Ubuntu 18.04 or CentOS 7), including setting the hostname and timezone.

2.  This guide uses `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

3.  Follow our [UFW Guide](/docs/security/firewalls/configure-firewall-with-ufw/) in order to install and configure a firewall (UFW) on your Ubuntu or Debian-based system, or our [FirewallD Guide](/docs/security/firewalls/introduction-to-firewalld-on-centos/) for rpm or CentOS-based systems. After configuring the firewall, ensure that the necessary ports are open in order to proceed with connections over for the rest of this guide:

        sudo ufw allow ssh

4.  Ensure your system is up to date. On Debian-based systems, use:

        sudo apt update && sudo apt upgrade

    While on rpm-based systems such as CentOS, use:

        sudo yum update

### Acquire a TLS Certificate

1.  Follow the steps in our [Secure HTTP Traffic with Certbot](/docs/quick-answers/websites/secure-http-traffic-certbot/) guide to acquire a TLS certificate.

2.  Add a system group in order to grant limited read access to the TLS files created by certbot.

        sudo groupadd tls

3.  Change the group ownership of certificate files in the Let's Encrypt directory to `tls`.

        sudo chgrp -R tls /etc/letsencrypt/{archive,live}

4.  Grant members of the `tls` group read access to the necessary directories and files.

        sudo chmod g+rx /etc/letsencrypt/{archive,live}
        sudo find /etc/letsencrypt/archive -name 'privkey*' -exec chmod g+r {} ';'

### Download Vault files

1.  Download the release binary for Vault.

        wget https://releases.hashicorp.com/vault/1.1.0/vault_1.1.0_linux_amd64.zip

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

3.  Reset any permissions and mode on the executable.

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

2.  Add the `vault` user to the previously-created `tls` group, which will grant the user the ability to read Let's Encrypt certificates.

        sudo gpasswd -a vault tls

2.  Create the data directory and configuration directory for `vault` with limited permisions.

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

### Configure Vault

1.  Create a configuration file for Vault with the following contents. Replace `example.com` with the domain that you retrieved certificates for from Let's Encrypt.

    {{< file "/etc/vault.d/vault.hcl" aconf >}}
listener "tcp" {
  address = "0.0.0.0:8200"
  tls_cert_file = "/etc/letsencrypt/live/vault.tylerl.ninja/fullchain.pem"
  tls_key_file = "/etc/letsencrypt/live/vault.tylerl.ninja/privkey.pem"
}

storage "file" {
  path = "/var/lib/vault"
}
{{< /file >}}

    This configuration will use the Let's Encrypt certificates created in the previous steps to terminate TLS for the Vault service. This ensures that secrets will never be transmitted in plaintext. The actual storage for Vault will be on the local filesystem at `/var/lib/vault`.

### Run Vault

1.  Vault is now ready to run. Start the service using `systemctl`.

        sudo systemctl start vault

2.  If desired, enable the service as well so that Vault starts at system boot time.

        sudo systemctl enable vault

## Using Vault

---

{{< caution >}}
Example caution.
{{< /caution >}}

{{< output >}}
Example textual output.
{{< /output >}}

    {{< note >}}
Example indented note.
{{< /note >}}

{{< note >}}
Example note.
{{< /note >}}
