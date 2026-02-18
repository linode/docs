---
title: "Deploy Qwen Instruct with Open WebUI through the Linode Marketplace"
description: "This guide includes instructions on how to deploy Open WebUI with a self-hosted Qwen Instruct Large Language Model (LLM) on an Akamai Compute Instance."
published: 2026-01-26
modified: 2026-01-26
keywords: ['qwen', 'qwen-instruct', 'open-webui', 'vllm', 'ai', 'llm', 'llm-inference', 'qwen-llm']
tags: ["marketplace", "linode platform", "cloud manager", "ai", "llm-inference", "llm"]
aliases: ['/products/tools/marketplace/guides/qwen-instruct-with-openwebui/']
external_resources:
- '[Open WebUI Documentation](https://docs.openwebui.com/getting-started/)'
- '[Qwen Documentation](https://github.com/QwenLM)'
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 1980062
marketplace_app_name: "Qwen Instruct with Open WebUI"
---

Open WebUI is an open-source, self-hosted web interface for interacting with and managing Large Language Models (LLMs). It supports multiple AI backends, multi-user access, and extensible integrations, enabling secure and customizable deployment for local or remote model inference.

The Marketplace application deployed in this guide uses a Qwen Instruct model as an instruction-tuned, open-weight LLM optimized for reasoning, code generation, and conversational tasks. Qwen models are designed for high-quality inference across a wide range of general-purpose and technical workloads and integrate seamlessly with self-hosted platforms like Open WebUI.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note title="Estimated deployment time" >}}
Open WebUI with Qwen Instruct should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Recommended plan:** RTX4000 Ada x1 Small or Larger GPU Instance

{{< note type="warning" >}}
This Marketplace App only works with Akamai GPU instances. If you choose a plan other than GPUs, the provisioning will fail, and a notice will appear in the LISH console.
{{< /note >}}

### Open WebUI Options

- **Linode API Token** *(required)*: Your API token is used to deploy additional Compute Instances as part of this deployment. At a minimum, this token must have Read/Write access to *Linodes*. If you do not yet have an API token, see [Get an API Access Token](/docs/products/platform/accounts/guides/manage-api-tokens/) to create one.

- **Email address (for the Let's Encrypt SSL certificate)** *(required)*: Your email is used for Let's Encrypt renewal notices. This allows you to securely access Open WebUI through a browser.

- **Open WebUI admin name** *(required)*: This is the name associated with your Open WebUI administrator account and is required during initial setup.

- **Open WebUI admin email** *(required)*: This email address is used to log into Open WebUI.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started After Deployment

### Obtain the Credentials

When deployment completes, the system automatically generates credentials to administer your Pgvector instance. These are stored in the limited user’s `.credentials` file.

1. Log in to your Compute Instance using one of the methods below:

    - **Lish Console**: Log in to Cloud Manager, click **Linodes**, select your instance, and click **Launch LISH Console**. Log in as `root`. To learn more, see [Using the Lish Console](/docs/products/compute/compute-instances/guides/lish/).
    - **SSH**: Log in to your instance over SSH using the `root` user. To learn how, see [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/).

2. Run the following command to access the contents of the `.credentials` file:

```command
cat /home/$USERNAME/.credentials
```

### Accessing Open WebUI Frontend

Once your app has finished deploying, you can log into Open WebUI using your browser.

1.  Open your web browser and navigate to `https://DOMAIN/`, where *DOMAIN* can be replaced with the custom domain you entered during deployment or your Compute Instance's rDNS domain (such as `192-0-2-1.ip.linodeusercontent.com`). See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing rDNS.


Now that you’ve accessed your dashboard, check out [the official OpenWebUI documentation](https://docs.openwebui.com/) to learn how to further use your instance.

{{% content "marketplace-update-note-shortguide" %}}