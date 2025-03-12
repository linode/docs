---
slug: deploy-rag-pipeline-and-chatbot-on-apl
title: "Deploy a RAG Pipeline and Chatbot with App Platform for LKE"
description: "Two to three sentences describing your guide."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2025-03-11
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
---

This guide builds on the LLM (Large Language Model) architecture built in our [Deploy an LLM for AI Inferencing with App Platform for LKE](/docs/guides/deploy-llm-for-ai-inferencing-on-apl) guide by deploying a RAG (Retrieval-Augmented Generation) pipeline that indexes a custom data set. RAG is a particular method of context augmentation that attaches relevant data as context when users send queries to an LLM.

Follow the steps in this tutorial to install Kubeflow Pipelines and deploy a RAG pipeline using Akamai App Platform for LKE. The deployment in this guide uses the previously deployed Open WebUI chatbot to respond to queries using a custom data set.

If you prefer a manual installation rather than one using App Platform for LKE, see our [Deploy a Chatbot and RAG Pipeline for AI Inferencing on LKE](/docs/guides/ai-chatbot-and-rag-pipeline-for-inference-on-lke/) guide.

{{< note title="Deploy an LLM for AI inferencing first" type="warning" >}}
This guide requires the completion of the [Deploy an LLM for AI Inferencing with App Platform for LKE](/docs/guides/deploy-llm-for-ai-inferencing-on-apl) in order to function.
{{< /note >}}

## Diagram

## Components

### Infrastructure

-   **Linode GPU instances**:

-   **Linode Kubernetes Engine (LKE)**:

-   **App Platform for LKE**:

### Additional Software

-  **Milvus**:

-  **Kubeflow**:

## Prerequisites

-   Complete the deployment in the [Deploy an LLM for AI Inferencing with App Platform for LKE](/docs/guides/deploy-llm-for-ai-inferencing-on-apl) guide.

## Set Up Infrastructure

Once your LLM has been deployed and is accessible, complete the following steps to continue setting up your infrastructure.

Sign into the App Platform web UI using the `platform-admin` account, or another account that uses the `platform-admin` role.

### Add Custom Helm Charts

Follow the below steps to add `kfp-cluster-resources`, `kubeflow-pipelines`, and `milvus` Helm charts to the Catalog. Repeat the process for each Helm chart using the Github URL for the Helm chart you are adding:

-   `kfp-cluster-resources`:

    ```command
    URL
    ```

-   `kubeflow-pipelines`:

    ```command
    URL
    ```

-   `milvus`:

    ```command
    URL
    ```

1.  Select **view** > **team** and **team** > **admin** in the top bar.

1.  Click on **Catalog** in the left menu.

1.  Select **Add Helm Chart**.

1.  Under **Github URL**, add the respective URL for the Helm chart you're adding:

    ```command
    {{< placeholder "HELM_CHART_GITHUB_URL" >}}
    ```

1.  Click **Get Details** to populate the Helm chart details.

1.  Deselect **Do not allow teams to use this chart**.

1.  Click **Add Chart**.

### Create a Workload for the kfp-cluster-resources Helm Chart

1.  Select **view** > **team** and **team** > **admin** in the top bar.

1.  Select **Workloads**.

1.  Click on **Create Workload**.

1.  Select the `kfp-cluster-resources` Helm chart from the Catalog.

1.  Click on **Values**.

1.  Provide a name for the Workload. This guide uses the Workload name "kfp-cluster-resources".

1.  Add **kserve** as the namespace.

1.  Select **Create Namespace**.

1.  Continue with the default values, and click **Submit**.

### Create an Object Storage Bucket for milvus

### Create a Workload for the milvus Helm Chart

1.  Select **view** > **team** and **team** > **admin** in the top bar.

1.  Select **Workloads**.

1.  Click on **Create Workload**.

1.  Select the `milvus` Helm chart from the Catalog.

1.  Click on **Values**.

1.  Provide a name for the Workload. This guide uses the Workload name "milvus".

1.  Add **kserve** as the namespace.

1.  Select **Create Namespace**.

1.  Set the following values:

    ```
    cluster:
    enabled: false
    pulsarv3:
    enabled: false
    minio:
    enabled: false
    externalS3:
    enabled: true
    host: <your-region>.linodeobjects.com
    port: "443"
    accessKey: <your-accesskey>
    secretKey: <your-secretkey>
    useSSL: true
    bucketName: <your-bucket>
    cloudProvider: aws
    region: <your-region>
    standalone:
    resources:
        requests:
        nvidia.com/gpu: "1"
        limits:
        nvidia.com/gpu: "1"
    ```

    {{< note >}}
    The milvus Helm chart does not support the use of a secretKeyRef. Using unencrypted Secret Keys in chart values is not a Kubernetes security best-practice.
    {{< /note >}}

1.  Click **Submit**.

### Create an Object Storage Bucket for kubeflow-pipelines

### Create SealedSecrets

