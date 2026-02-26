---
title: "Deploy DeepSeek R1"
description: "Learn how to deploy DeepSeek R1, a distilled open-weight reasoning model from DeepSeek, on an Akamai Compute Instance."
published: 2026-02-26
modified: 2026-02-26
keywords: ['artificial intelligence', 'ai', 'LLM', 'machine learning', 'deepseek', 'deepseek-r1', 'open webui', 'vllm', 'reasoning']
tags: ["quick deploy apps", "linode platform", "cloud manager"]
aliases: ['/products/tools/marketplace/guides/deepseek-with-openwebui/']
external_resources:
- '[Open WebUI Documentation](https://docs.openwebui.com/getting-started/)'
- '[DeepSeek R1 Distill Qwen 7B on Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-7B)'
- '[DeepSeek R1 Distill Qwen 14B on Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-14B)'
- '[DeepSeek R1 Distill Qwen 32B on Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-32B)'
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: PLACEHOLDER
marketplace_app_name: "DeepSeek R1 with Open WebUI"
---

Open WebUI is an open-source, self-hosted web interface for interacting with and managing Large Language Models (LLMs). It supports multiple AI backends, multi-user access, and extensible integrations, enabling secure and customizable deployment for local or remote model inference.

The Quick Deploy App deployed in this guide uses DeepSeek R1 Distill Qwen, a family of distilled open-weight reasoning models based on Qwen2.5. These models are derived from the full 671B DeepSeek-R1 and feature chain-of-thought reasoning capabilities. During deployment, you can choose between three model sizes: 7B (default), 14B, or 32B. All models are released under the MIT license.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note title="Estimated deployment time" >}}
Open WebUI with DeepSeek R1 should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Recommended plan for DeepSeek R1 Distill Qwen 7B (default):** Any 1-GPU instance (16GB RAM minimum)
- **Recommended plan for DeepSeek R1 Distill Qwen 14B:** Any 2-GPU instance or higher (32GB RAM minimum)
- **Recommended plan for DeepSeek R1 Distill Qwen 32B:** Any 4-GPU instance (128GB RAM minimum)

{{< note type="warning" >}}
This Quick Deploy App only works with Akamai GPU instances. If you choose a plan other than GPUs, the provisioning will fail, and a notice will appear in the LISH console.
{{< /note >}}

### DeepSeek R1 Options

- **Linode API Token** *(required)*: Your API token is used to deploy additional Compute Instances as part of this cluster. At a minimum, this token must have Read/Write access to *Linodes*. If you do not yet have an API token, see [Get an API Access Token](/docs/products/platform/accounts/guides/manage-api-tokens/) to create one.

- **Email address (for the Let's Encrypt SSL certificate)** *(required)*: Your email is used for Let's Encrypt renewal notices. This allows you to visit Open WebUI securely through a browser.

- **Open WebUI admin name.** *(required)*: This is the name associated with your login and is required by Open WebUI during initial enrollment.

- **Open WebUI admin email.** *(required)*: This is the email used to login into Open WebUI.

- **DeepSeek Model Size** *(required)*: Select the model size for deployment. Options are `7B` (default), `14B`, or `32B`. Larger models require more GPUs and memory. The 14B and 32B models automatically use tensor parallelism across multiple GPUs.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started After Deployment

### Accessing Open WebUI Frontend

Once your app has finished deploying, you can log into Open WebUI using your browser.

1.  Log into the instance as your limited sudo user, replacing `{{< placeholder "USER" >}}` with the sudo username you created, and `{{< placeholder "IP_ADDRESS" >}}` with the instance's IPv4 address:

    ```command
    ssh {{< placeholder "USER" >}}@{{< placeholder "IP_ADDRESS" >}}
    ```

2.  Upon logging into the instance, a banner appears containing the **App URL**. Open your browser and paste the link to direct you to the login for Open WebUI.

    !["Open WebUI Login Page"](openwebui-login.png "Open WebUI Login Page")

3.  Return to your terminal, and open the `.credentials` file with the following command. Replace `{{< placeholder "USER" >}}` with your sudo username:

    ```command
    sudo cat /home/{{< placeholder "USER" >}}/.credentials
    ```

4.  In the `.credentials` file, locate the Open WebUI login email and password. Go back to the Open WebUI login page, and paste the credentials to log in. When you successfully login, you should see the following page.

    !["Open WebUI Welcome 1"](openwebui-w1.png "Open WebUI Welcome 1")

Once you hit the "Okay, Let's Go!" button, you can start to use the chat feature in Open WebUI.

!["Open WebUI Welcome 2"](openwebui-w2.png "Open WebUI Welcome 2")
