---
title: "Deploy Gemma3"
description: "Learn how to deploy Gemma3, the  open-source generative AI model from Google DeepMind, on an Akamai Compute Instance."
published: 2026-02-11
modified: 2026-02-11
keywords: ['artificial intelligence','ai','LLM','machine learning','gemma','open webui']
tags: ["marketplace", "linode platform", "cloud manager"]
external_resources:
- '[Gemma3 Official Documentation](https://ai.google.dev/gemma/docs/core)'
- '[Google Gemma 3 4B Model](https://huggingface.co/google/gemma-3-4b-it)'
- '[Google Gemma 3 12B Model](https://huggingface.co/google/gemma-3-12b-it)'
- '[Open WebUI Documentation](https://docs.openwebui.com/)'
aliases: ['/products/tools/marketplace/guides/gemma3-with-openwebui/','/guides/gemma3-with-openwebui-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 1997012
marketplace_app_name: "Gemma3"
---

[Google Gemma 3](https://ai.google.dev/gemma) is an open-source large language model from Google DeepMind, built with the same technology that powers Google's Gemini models. This Marketplace App deploys Gemma 3 with [Open WebUI](https://docs.openwebui.com/), a self-hosted web interface for interacting with LLMs. The deployment uses GPU-accelerated inference and lets you choose between two model sizes: 4B for efficient performance or 12B for enhanced capabilities.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note title="Estimated deployment time" >}}
Gemma3 with Open WebUI should be fully installed within 5-10 minutes after your instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions**: Ubuntu 24.04 LTS
- **Recommended plan**: All GPU plan types and sizes can be used. The 4B model requires at least 16GB of RAM, while the 12B model requires at least 32GB of RAM.

### Gemma3 Options

- **Admin Login Name** (required): The initial admin username for accessing the Open WebUI interface.
- **Admin Login Email** (required): The email address for the Open WebUI admin account.
- **Hugging Face API Token** (required): A Hugging Face API token is required to download the Gemma 3 model. See [Obtaining a Hugging Face Token](#obtaining-a-hugging-face-token) below for instructions.
- **Model Size** (required): Choose between `4B` (16GB+ RAM required) or `12B` (32GB+ RAM required).

### Obtaining a Hugging Face Token

Before deployment, you need a Hugging Face API token to access the Gemma 3 model. To obtain one:

1. Create a free account at [huggingface.co/join](https://huggingface.co/join).
1. Accept the Gemma license at [huggingface.co/google/gemma-3-12b-it](https://huggingface.co/google/gemma-3-12b-it).
1. Generate a token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens). Read-only access is sufficient.
1. Provide this token during the Marketplace deployment process.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}


## Getting Started after Deployment

### Access Your Credentials

Your Open WebUI admin credentials are stored in a `.credentials` file on your instance. To retrieve them:

1.  Log in to your instance via SSH or Lish. See [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/) for assistance, or use the [Lish Console](/docs/products/compute/compute-instances/guides/lish/).

1.  Once logged in, retrieve your credentials from the `.credentials` file:

    ```command
    sudo cat /home/$USER/.credentials
    ```

    The `.credentials` file contains:
    - **Sudo Username and Password**: Your limited sudo user credentials
    - **Open WebUI Admin Name**: The admin username for the web interface
    - **Open WebUI Admin Email**: The admin email address
    - **Open WebUI Admin Password**: The admin password for logging in

### Access the Open WebUI Interface

Once your instance has finished deploying, you can access the Open WebUI interface through your browser:

1.  Navigate to your instance's domain or rDNS address via HTTPS (e.g., `https://your-domain.com` or `https://192-0-2-1.ip.linodeusercontent.com`).

1.  Log in using the admin email and password from the `.credentials` file.

1.  You can now start chatting with the Gemma 3 model.

### Working with RAG Operations

Open WebUI provides built-in support for RAG (Retrieval Augmented Generation) operations, allowing you to upload documents and chat with them. By default, the deployment supports file uploads up to 100MB.

If you need to upload larger documents, you can modify the NGINX configuration:

1.  Edit the NGINX virtual host configuration file located at `/etc/nginx/sites-enabled/your-domain`.
1.  Update the `client_max_body_size` directive to a larger value (e.g., `client_max_body_size 500M;` for 500MB).
1.  Reload NGINX:

    ```command
    sudo systemctl reload nginx
    ```

{{% content "marketplace-update-note-shortguide" %}}