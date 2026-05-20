---
title: "Deploy Ollama"
description: "This guide includes instructions on how to deploy Open WebUI with a self-hosted Ollama backend for running Large Language Models (LLMs) like Qwen on an Akamai Compute Instance."
published: 2026-02-18
modified: 2026-02-18
keywords: ['ollama', 'open-webui', 'qwen', 'ai', 'llm', 'llm-inference', 'self-hosted-ai']
tags: ["quick deploy apps", "linode platform", "cloud manager", "ai", "llm-inference", "llm"]
aliases: ['/products/tools/marketplace/guides/ollama/']
external_resources:
- '[Open WebUI Documentation](https://docs.openwebui.com/getting-started/)'
- '[Ollama Documentation](https://ollama.com/)'
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 2088700
marketplace_app_name: "Ollama"
---

Open WebUI is an open-source, self-hosted web interface for interacting with and managing Large Language Models (LLMs). By using Ollama as the backend, users can easily run, manage, and switch between various models like Qwen, Llama, and Mistral in a unified, secure environment.

The Quick Deploy App deployed in this guide installs **Ollama** bundled with **Open WebUI**. This setup is optimized for low-latency local inference and provides a streamlined experience for conversational AI, RAG (Retrieval-Augmented Generation), and multi-user collaboration.

## Deploying a Quick Deploy App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note title="Estimated deployment time" >}}
Ollama with Open WebUI should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Recommended plan:** RTX4000 Ada x1 Small or Larger GPU Instance for best performance.

### Open WebUI Options

- **Linode API Token** *(required)*: Your API token is used to deploy additional Compute Instances as part of this deployment. At a minimum, this token must have Read/Write access to *Linodes*. If you do not yet have an API token, see [Get an API Access Token](/docs/products/platform/accounts/guides/manage-api-tokens/) to create one.

- **Email address (for the Let's Encrypt SSL certificate)** *(required)*: Your email is used for Let's Encrypt renewal notices. This allows you to securely access Open WebUI through a browser.

- **Open WebUI admin name** *(required)*: This is the name associated with your Open WebUI administrator account and is required during initial setup.

- **Open WebUI admin email** *(required)*: This email address is used to log into Open WebUI.

- **LLM** *(required)*: Enter a valid Ollama supported LLM model. You can view all the latest models at https://ollama.com/search.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started After Deployment

### Obtain the Credentials

When deployment completes, the system generates the necessary environment configuration. These details and any generated passwords are stored in the limited user’s `.credentials` file.

1. Log in to your Compute Instance using one of the methods below:

    - **Lish Console**: Log in to Cloud Manager, click **Linodes**, select your instance, and click **Launch LISH Console**. Log in as `root`. To learn more, see [Using the Lish Console](/docs/products/compute/compute-instances/guides/lish/).
    - **SSH**: Log in to your instance over SSH using the `root` user. To learn how, see [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/).

2. Run the following command to access the contents of the `.credentials` file:

    ```command
    less /home/$USERNAME/.credentials
    ```

### Accessing the Open WebUI Frontend

Once your app has finished deploying, you can log into Open WebUI using your browser.

Open your web browser and navigate to `https://{{< placeholder "DOMAIN" >}}/`, where {{< placeholder "DOMAIN" >}} can be replaced with the custom domain you entered during deployment, or your Linode instance's rDNS domain (for example, `192-0-2-1.ip.linodeusercontent.com`). See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing rDNS.

Now that you’ve accessed your dashboard, check out [the official OpenWebUI documentation](https://docs.openwebui.com/) and [the official Ollama documentation](https://docs.ollama.com/) to learn how to further use your instance.

{{% content "marketplace-update-note-shortguide" %}}