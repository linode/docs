---
slug: deploy-llm-for-ai-inferencing-on-apl
title: "Deploy an LLM for AI Inferencing with App Platform for LKE"
description: "This guide includes steps and guidance for deploying a large language model for AI inferencing using App Platform for Linode Kubernetes Engine."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2025-03-11
keywords: ['ai','ai inference','ai inferencing','llm','large language model','app platform','lke','linode kubernetes engine','llama 3','kserve','istio','knative']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

LLMs (Large Language Models) are deep-learning models that are pre-trained on large amounts of information. AI inferencing is the method by which an AI model (such as an LLM) is trained to "infer", and subsequently deliver accurate information. The LLM used in this deployment, Meta AI's [Llama 3](https://www.llama.com/docs/overview/), is an open-source, pre-trained LLM often used for tasks like responding to questions in multiple languages, coding, and advanced reasoning.

[KServe](https://kserve.github.io/website/latest/) is a standard Model Inference Platform for Kubernetes, built for highly-scalable use cases. KServe comes with multiple Model Serving Runtimes, including the [Hugging Face](https://huggingface.co/welcome) serving runtime. The Hugging Face runtime supports the following machine learning (ML) tasks:

- Text generation
- Text2Text generation
- Fill mask
- Token classification
- Sequence and text classification

Akamai App Platform for LKE comes with a set of preconfigured and integrated open source Kubernetes applications like [Istio](https://istio.io/latest/docs/overview/what-is-istio/) and [Knative](https://knative.dev/docs/concepts/), both of which are prerequisites for using KServe. App Platform automates the provisioning process of these applications.

This guide describes the steps required to: install KServe with Akamai App Platform for LKE, deploy Meta AI's Llama 3 model using the Hugging Face service runtime, and deploy a chatbot using Open WebUI.

## Diagram

## Components

### Infrastructure

-   **Linode GPU instances**:

-   **Linode Kubernetes Engine (LKE)**:

-   **App Platform for LKE**:

### Software

-   **KServe**: Serves machine learning models. This tutorial installs the Llama 3 LLM to KServe, which then serves it to other applications, such as the chatbot UI.

-   **Istio**: An open source service mesh used for securing, connecting, and monitoring microservices.

-   **Knative**: Used for deploying and managing serverless workloads on the Kubernetes platform.

-   **Meta AI's Llama 3**: The [meta-llama/Meta-Llama-3-8B](https://huggingface.co/meta-llama/Meta-Llama-3-8B) model is used as the LLM. It is recommended that you review and agree to the licensing agreement before deploying.

-   **Open WebUI**: A self-hosted AI chatbot application that’s compatible with LLMs like Llama 3 and includes a built-in inference engine for RAG (Retrieval-Augmented Generation) solutions. Users interact with this interface to query the LLM.

## Prerequisites

- A [Cloud Manager](https://cloud.linode.com/) account is required to use Akamai's cloud computing services, including LKE.

- A [Hugging Face](https://huggingface.co/) account is used for pulling Meta AI's Llama 3 model.

- Access granted to Meta AI's Llama 3 model is required. To request access, navigate to Hugging Face's [Llama 3-8B Instruct LLM link](https://huggingface.co/meta-llama/Meta-Llama-3-8B-Instruct), read and accept the license agreement, and submit your information.

- Enrollment into the Akamai App Platform's [beta program](https://cloud.linode.com/betas).

- An provisioned and configured LKE cluster with App Platform enabled. We recommend an LKE cluster consisting of at least 3 RTX4000 Ada x1 Medium [GPU](https://techdocs.akamai.com/cloud-computing/docs/gpu-compute-instances) plans.

To learn more about provisioning a LKE cluster with App Platform, see our [Getting Started with App Platform for LKE](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-akamai-application-platform) guide.

## Set Up Infrastructure

Once your LKE cluster is provisioned and the App Platform web UI is available, complete the following steps to continue setting up your infrastructure.

Sign into the App Platform web UI using the `platform-admin` account, or another account that uses the `platform-admin` role.

### Enable Knative

1.  Select **view** > **platform** in the top bar.

1.  Select **Apps** in the left menu.

1.  Enable the **Knative** and **Kyverno** apps by hovering over each app icon and clicking the **power on** button. Each app may take a few minutes to enable.

    Enabled apps move up and appear in color towards the top of the available app list.

    ![Enable Knative and Kyverno](APL-LLM-Enable-Knative.jpg)

### Create a New Team

1.  Select **view** > **platform**.

1.  Select **Teams** in the left menu.

1.  Click **Create Team**.

1.  Provide a **Name** for the Team. Keep all other default values, and click **Submit**. This guide uses the Team name `demo`.

### Install the NVIDIA GPU Operator

1.  Select **view** > **team** and **team** > **admin** in the top bar.

1.  Select **Shell** in the left menu. Wait for the shell session to load.

    ![APL Team Shell](APL-LLM-Shell.jpg)

1.  In the provided shell session, install the NVIDIA GPU operator using Helm:

    ```command
    helm repo add nvidia https://helm.ngc.nvidia.com/nvidia
    helm repo update
    helm install --wait --generate-name -n gpu-operator --create-namespace nvidia/gpu-operator --version=v24.9.1
    ```

### Add the kserve-crd Helm Chart to the Catalog

1.  Click on **Catalog** in the left menu.

1.  Select **Add Helm Chart**.

1.  Under **Github URL**, add the URL to the `kserve-crd` Helm chart:

    ```command
    https://github.com/kserve/kserve/blob/v0.14.1/charts/kserve-crd/Chart.yaml
    ```

1.  Click **Get Details** to populate the `kserve-crd` Helm chart details.

    {{< note title="Optional: Add a Catalogue Icon" >}}
    Use an image URL in the **Icon URL** field to optionally add an icon to your custom Helm chart in the Catalog.
    {{< /note >}}

1.  Deselect **Do not allow teams to use this chart**.

    [SCREENSHOT]

1.  Click **Add Chart**.

### Create a Workload for the kserve-crd Helm Chart

1.  Select **view** > **team** and **team** > **admin** in the top bar.

1.  Select **Workloads**.

1.  Click on **Create Workload**.

1.  Select the `kserve-crd` Helm chart from the Catalog.

1.  Click on **Values**.

1.  Provide a name for the Workload. This guide uses the Workload name "kserve-crd".

1.  Add **kserve** as the namespace.

1.  Select **Create Namespace**.

1.  Continue with the default values, and click **Submit**.

After the Workload is submitted, App Platform creates an Argo CD application to install the `kserve-crd` Helm chart. Wait for the **Status** of the Workload to become healthy as represented by a green check mark. This may take a few minutes.

[SCREENSHOT]

Click on the ArgoCD **Application** link once the Workload is ready. You should be brought to the following screen:

[SCREESHOT]

### Add the kserve-resources Helm Chart to the Catalog

1.  Click on **Catalog** in the left menu.

1.  Select **Add Helm Chart**.

1.  Under **Github URL**, add the URL to the `kserve-resources` Helm chart:

    ```command
    https://github.com/kserve/kserve/blob/v0.14.1/charts/kserve-resources/Chart.yaml
    ```

1.  Click **Get Details** to populate the `kserve-resources` Helm chart details.

1.  Deselect **Do not allow teams to use this chart**.

1.  Click **Add Chart**.

### Create a Workload for the kserve-resources Helm Chart

1.  Select **view** > **team** and **team** > **admin** in the top bar.

1.  Select **Workloads**.

1.  Click on **Create Workload**.

1.  Select the `kserve-resources` Helm chart from the Catalog.

1.  Click on **Values**.

1.  Provide a name for the Workload. This guide uses the Workload name "kserve-resources".

1.  Add **kserve** as the namespace.

1.  Select **Create Namespace**.

1.  Continue with the default values, and click **Submit**.

### Add the open-webui Helm Chart to the Catalog

1.  Click on **Catalog** in the left menu.

1.  Select **Add Helm Chart**.

1.  Under **Github URL**, add the URL to the `open-webui` Helm chart:

    ```command
    https://github.com/open-webui/helm-charts/blob/open-webui-5.20.0/charts/open-webui/Chart.yaml
    ```

1.  Click **Get Details** to populate the `open-webui` Helm chart details.

1.  Click **Add Chart**.

### Add the inferencing-service Helm Chart to the Catalog

1.  Click on **Catalog** in the left menu.

1.  Select **Add Helm Chart**.

1.  Under **Github URL**, add the URL to the `inferencing-service` Helm chart:

    ```command
    https://github.com/linode/apl-examples/blob/main/kserve-ai-inferencing/Chart.yaml
    ```

1.  Click **Get Details** to populate the `inferencing-service` Helm chart details.

1.  Click **Add Chart**.

### Create a Hugging Face Access Token

1.  Navigate to the Hugging Face [Access Tokens page](https://huggingface.co/settings/tokens).

1.  Click **Create new token**.

1.  Under **Toekn type**, select "Write" access.

1.  Enter a name for your token, and click **Create token**.

1.  Save your Access Token information.

See the Hugging Face user documentation on [User access tokens](https://huggingface.co/docs/hub/en/security-tokens) for additional information.

### Request Access to Llama 3

If you haven't done it already, request access to the Llama 3 LLM model. To do this, go to Hugging Face's [Llama 3-8B Instruct LLM link](https://huggingface.co/meta-llama/Meta-Llama-3-8B-Instruct), read and agree the license agreement, and submit your information. You must wait for access to be granted in order to proceed.

## Deploy and Expose the Model

### Create a SealedSecret

1.  Select **view** > **team** and **team** > **demo** in the top bar.

1.  Select **SealedSecrets** from the menu.

1.  Click **Create SealedSecret**.

1.  Add the name `hf-secret`.

1.  Select type [kubernetes.io/opaque](kubernetes.io/opaque).

1.  Add **Key**: `HF_TOKEN`.

1.  Add **Value**: {{< placeholder "HUGGING_FACE_TOKEN" >}}

    [SCREENSHOT]

1.  Click **Submit**.

### Create a Workload to Deploy the Model

1.  Select **view** > **team** and **team** > **demo** in the top bar.

1.  Select **Catalog** from the menu.

1.  Select the `Inferencing-Service` chart.

1.  Click on **Values**.

1.  Provide a name for the Workload. This guide uses the Workload name "llama3-model".

1.  Set the following values:

    ```
    labels:
    sidecar.istio.io/inject: "false"
    env:
    - name: HF_TOKEN
        valueFrom:
        secretKeyRef:
            name: hf-secret
            key: HF_TOKEN
            optional: false
    args:
    - --model_name=llama3
    - --model_id=meta-llama/meta-llama-3-8b-instruct
    resources:
    limits:
        cpu: "12"
        memory: 24Gi
        nvidia.com/gpu: "1"
    requests:
        cpu: "12"
        memory: 24Gi
        nvidia.com/gpu: "1"
    ```

1.  Click **Submit**.

### Expose the Model

1.  Select **Services** from the menu.

1.  Click **Create Service**.

1.  In the **Name** dropdown list, select the `llama3-model-predictor` service.

1.  Under **Exposure**, select **External**.

1.  Click **Submit**.

Once complete, copy the URL for the `llama3-model-service`, and add it to your clipboard.

## Deploy and Expose the AI Interface

The publicly-exposed LLM in this guide uses a wide range of ports, and as a result, all pods in a Team are automatically injected with an Istio sidecar. Sidecar injection is a means of adding additional containers and their configurations to a pod template.

The Istio sidecar in this case prevents the `open-webui` pod from connecting to the `llama3-model` service, because all egress traffic for pods in the Team namespace are blocked by an Istio ServiceEntry by default. This means that prior to deploying the AI interface using the `open-webui` Helm chart, the `open-webui` pod must be prevented from getting the Istio sidecar.

Since the `open-webui` Helm chart does not allow for the addition of extra labels, there are two workarounds:

1.  Adjust the `open-webui` Helm chart in the chart's Git repository. This is the Git repository where the `open-webui` Helm chart was been stored when it was added to the Catalog.

2.  Add a Kyverno **Policy** that mutates the `open-webui` pod so that it will have the `sidecar.istio.io/inject: "false"` label.

Follow the steps below to follow the second option and add the Kyverno security policy.

1.  In the **Apps** section, select the **Gitea** app.

1.  Navigate to the `team-<team-name>-argocd` repository.

1.  Select **Add File**, and create a file named `open-webui-policy.yaml` with the following contents:

    ```file
    apiVersion: kyverno.io/v1
    kind: Policy
    metadata:
    name: disable-sidecar-injection
    annotations:
        policies.kyverno.io/title: Disable Istio sidecar injection
    spec:
    rules:
    - name: disable-sidecar-injection
        match:
        any:
        - resources:
            kinds:
            - StatefulSet
            - Deployment
            selector:
                matchLabels:
                ## change the value to match the name of the Workload
                app.kubernetes.io/instance: "llama3-ui"
        mutate:
        patchStrategicMerge:
            spec:
            template:
                metadata:
                labels:
                    sidecar.istio.io/inject: "false"
    ```

1.  Open the Argo CD application. Go to the `team-<team-name>` application to see if the policy has been created. If it isn't there yet, click **Refresh** as needed.

### Create a Workload to Deploy the AI Interface

1.  Select **view** > **team** and **team** > **demo** in the top bar.

1.  Select **Catalog** from the menu.

1.  Select the `Open-Webui` chart.

1.  Click on **Values**.

1.  Provide a name for the Workload. This guide uses the Workload name "llama3-ui".

1.  Add the following values, and change the `openaiBaseApiUrl` to the host and domain name you added to your clipboard when [exposing the model](#expose-the-model) (the URL for the `llama3-model-service`):

    ```
    # Change the nameOverride to match the name of the Workload
    nameOverride: llama3-ui
    ollama:
    enabled: false
    pipelines:
    enabled: false
    persistence:
    enabled: false
    replicaCount: 1
    openaiBaseApiUrl: https://llama3-model--predictor-team-demo.<cluster-domain>/openai/v1
    extraEnvVars:
    - name: WEBUI_AUTH
        value: "false"
    ```

1.  Click **Submit**.

### Expose the AI Interface

1.  Select **Services** from the menu.

1.  Click **Create Service**.

1.  In the **Name** dropdown menu, select the `llama3-ui` service.

1.  Under **Exposure**, select **External**.

1.  Click **Submit**.

## Access the Open Web User Interface

Once the inference service and AI user interface have been deployed, you should be able to access the web UI.

1.  Click on **Services** in the menu.

1.  In the list of available services, click on the URL for the `llama3-ui` service. This should bring you to the Open WebUI chatbot.

    [SCREENSHOT]

## Next Steps

See our [Deploy a RAG Pipeline and Chatbot with App Platform for LKE](/docs/guides/deploy-rag-pipeline-and-chatbot-on-apl) guide to expand on the architecture built in this guide. This tutorial deploys a RAG (Retrieval-Augmented Generation) pipeline that indexes a custom data set and attaches relevant data as context when users sends the LLM queries.