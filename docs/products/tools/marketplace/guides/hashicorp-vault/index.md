---
author:
  name: Linode
  email: docs@linode.com
description: "Deploy HashiCorp Vault, an open source, centralized secrets management system, on a Linode Compute Instance.'"
keywords: ['HashiCorp','vault','secrets',]
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-08-09
modified_by:
  name: Linode
title: "Deploying HashiCorp Vault through the Linode Marketplace"
---

[HashiCorp Vault](https://www.vaultproject.io/) is an open source, centralized secrets management system. It provides a secure and reliable way of storing and distributing secrets like API keys, access tokens, and passwords.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{<note>}}
**Estimated deployment time:** Vault should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{</note>}}

## Configuration Options

- **Supported distributions:**
- **Recommended plan:** We recommend a 4GB Dedicated CPU or Shared Compute instance for the Vault instance.

{{< content "marketplace-limited-user-fields-shortguide">}}

## Getting Started after Deployment

### Accessing the Vault Web UI

1. Open your web browser and navigate to `http://[IP]:8200` where *[IP]* can be replaced with the Linode's IP address. See the [Managing IP Addresses](/docs/guides/managing-ip-addresses/) guide for more information.
   ![Screenshot of the Vault web UI](vault-webUI.png)

2. The Vault server is initialized by the Marketplace App. Three of the generated `Unseal Keys` and the `Initial Root Token` must be entered to unseal the Vault. These keys generated keys are temporarily stored in a text file on the Linode's root directory. *Please save these keys somewhere safe and secure.*

3. Once the Vault is unsealed the web UI can be used to set up secrets, authentication, and policies.
   ![Screenshot of unsealed Vault web UI](vault-unsealed.png) 

{{<note>}}
   HashiCorp recommends using mutual TLS (mTLS) with a private CA to secure cluster communications and the web UI. Please see the following HashiCorp documentation for more details.
   https://www.vaultproject.io/docs/auth/cert
   https://www.vaultproject.io/docs/secrets/pki/setup  
   {{</note>}}

4. Additional configurations are required to use the Linode Marketplace Vault instance in a production environment. We recommend reviewing the [Configuration](https://www.vaultproject.io/docs/configuration), [Secrets Engine](https://www.vaultproject.io/docs/secrets), and [Authentication](https://www.vaultproject.io/docs/auth) documentation before proceeding further.

{{< content "marketplace-update-note-shortguide">}}
