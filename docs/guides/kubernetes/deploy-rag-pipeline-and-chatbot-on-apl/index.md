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

Follow the steps in this tutorial to install Kubeflow Pipelines and deploy a RAG pipeline using Akamai App Platform for LKE. The deployment in this guide uses the previously deployed Open WebUI chatbot to respond to queries using a custom data set. For example purposes, this guide uses a sample data set from Linode Docs in Markdown format.

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

-  **Gitea**:

## Prerequisites

-   Complete the deployment in the [Deploy an LLM for AI Inferencing with App Platform for LKE](/docs/guides/deploy-llm-for-ai-inferencing-on-apl) guide.

-   [Python3](https://www.python.org/downloads/) and the [venv](https://docs.python.org/3/library/venv.html) Python module installed on your local machine.

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

Create two SealedSecrets with names `mlpipeline-minio-artifact` and `mysql-credentials` using the steps and respective values below:

-   `mlpipeline-minio-artifact`
    -   Type: opaque
    -   Key=`accesskey`, Value={{< placeholder "YOUR_ACCESS_KEY" >}}
    -   Key=`secretkey`, Value={{< placeholder "YOUR_SECRET_KEY" >}}

-   `mysql-credentials`
    -   Type: opaque
    -   Key=`username`, Value=`root`
    -   Key=`password`, Value={{< placeholder "YOUR_PASSWORD" >}}

1.  Select **view** > **team** and **team** > **demo** in the top bar.

1.  Select **SealedSecrets** from the menu.

1.  Click **Create SealedSecret**.

1.  Add a name for your SealedSecret; `mlpipeline-minio-artifact` or `mysql-credentials`, respectively.

1.  Select type [kubernetes.io/opaque](kubernetes.io/opaque).

1.  Add the **Key** and **Value** details as listed for each SealedSecret above.

1.  Click **Submit**.

### Create a Network Policy

Create a **Network Policy** in the Team where the `kubeflow-pipelines` Helm chart will be installed (Team name **demo** in this guide). This allows communication between all Kubeflow Pipelines Pods.

1.  Select **view** > **team** and **team** > **demo** in the top bar.

1.  Select **Network Policies** from the menu.

1.  Click **Create Netpol**.

1.  Add a name for the Network Policy.

1.  Select rule type `ingress`.

1.  Add [app.kubernetes.io/instance](http://app.kubernetes.io/instance) as the **Selector label name**.

1.  Add `kfp` for the **Selector label value**. This is the name of the workload created in the next step.

### Create a Workload for the kubeflow-pipelines Helm Chart

1.  Select **view** > **team** and **team** > **admin** in the top bar.

1.  Select **Workloads**.

1.  Click on **Create Workload**.

1.  Select the `kubeflow-pipelines` Helm chart from the Catalog.

1.  Click on **Values**.

1.  Provide a name for the Workload. This guide uses the Workload name "kfp".

1.  Add **team-demo** as the namespace.

1.  Select **Create Namespace**.

1.  Set the following values:

    ```
    objectStorage:
        region: <your-region>
        bucket: <bucketname>
    mysql:
        secret: mysql-credentials
    ```

1.  Click **Submit**.

### Expose the Kubeflow Pipelines UI

1.  Select **view** > **team** and **team** > **demo** in the top bar.

1.  Select **Services**.

1.  Click **Create Service**.

1.  In the **Name** dropdown menu, select the `ml-pipeline-ui` service.

1.  Under **Exposure**, select **External**.

1.  Click **Submit**.

Kubeflow Pipelines is now ready to be used by members of the Team **demo**.

## Set Up Kubeflow Pipeline to Ingest Data

### Generate the Pipeline YAML File

The steps below create and use a Python script to create a Kubeflow pipeline file. This YAML file describes each step of the pipeline workflow.

1.  On your local machine, create a virtual environment for Python:

    ```command
    python3 -m venv .
    source bin/activate
    ```

1.  Install the Kubeflow Pipelines package in the virtual environment:

    ```command
    pip install kfp
    ```

1.  Create a file named `doc-ingest-pipeline.py` with the following contents. Replace {{< placeholder "<cluster-domain>" >}} with the domain of your App Platform instance.

    This script configures the pipeline that downloads the Markdown data set to be ingested, reads the content using LlamaIndex, generates embeddings of the content, and stores the embeddings in the milvus database:

    ```file
    from kfp import dsl

    @dsl.component(
            base_image='nvcr.io/nvidia/ai-workbench/python-cuda117:1.0.3',
            packages_to_install=['pymilvus>=2.4.2', 'llama-index', 'llama-index-vector-stores-milvus', 'llama-index-embeddings-huggingface', 'llama-index-llms-openai-like']
            )
    def doc_ingest_component(url: str, collection: str) -> None:
        print(">>> doc_ingest_component")

        from urllib.request import urlopen
        from io import BytesIO
        from zipfile import ZipFile

        http_response = urlopen(url)
        zipfile = ZipFile(BytesIO(http_response.read()))
        zipfile.extractall(path='./md_docs')

        from llama_index.core import SimpleDirectoryReader

        # load documents
        documents = SimpleDirectoryReader("./md_docs/", recursive=True, required_exts=[".md"]).load_data()

        from llama_index.embeddings.huggingface import HuggingFaceEmbedding
        from llama_index.core import Settings

        Settings.embed_model = HuggingFaceEmbedding(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )

        from llama_index.llms.openai_like import OpenAILike

        llm = OpenAILike(
            model="llama3",
            api_base="https://llama3-model-predictor-team-demo.<cluster-domain>/openai/v1",
            api_key = "EMPTY",
            max_tokens = 512)

        Settings.llm = llm

        from llama_index.core import VectorStoreIndex, StorageContext
        from llama_index.vector_stores.milvus import MilvusVectorStore

        vector_store = MilvusVectorStore(uri="http://milvus.milvus.svc.cluster.local:19530", collection=collection, dim=384, overwrite=True)
        storage_context = StorageContext.from_defaults(vector_store=vector_store)
        index = VectorStoreIndex.from_documents(
            documents, storage_context=storage_context
        )

    @dsl.pipeline
    def doc_ingest_pipeline(url: str, collection: str) -> None:
        comp = doc_ingest_component(url=url, collection=collection)

    from kfp import compiler

    compiler.Compiler().compile(doc_ingest_pipeline, 'pipeline.yaml')
    ```

1.  Run the script to generate a pipeline YAML file called `pipeline.yaml`:

    ```command
    python3 doc-ingest-pipeline.py
    ```

    This file is uploaded to Kubeflow in the following section.

1.  Exit the Python virtual environment:

    ```command
    deactivate
    ```

### Run the Pipeline Workflow

1.  Select **view** > **team** and **team** > **demo** in the top bar.

1.  Select **Services**.

1.  Click on the URL of the service `ml-pipeline-ui`.

1.  Navigate to the **Pipelines** section, click **Upload pipeline**, and select the `pipeline.yaml` file created in the previous section.

1.  Select **Experiments** from the menu, and click **Create experiment**. Enter a name and description for the experiment, and click **Next**.

    [SCREENSHOT]

1.  Navigate to the **Runs** section. Select the pipeline `pipeline.yaml` you just created to start a new run.

1.  For **Run Type** choose **One-off**. Provide the collection name and URL of the data set to be processed. To use the sample Linode Docs data set in this guide, use the name `lindoe_docs` and the following GitHub URL:

    ```command
    https://github.com/linode/docs/archive/refs/tags/v1.360.0.zip
    ```

1.  Click **Start** to run the pipeline. This may take a few minutes to complete.

    [SCREENSHOT]

## Deploy the Chatbot

The next step is to install the Open WebUI pipeline and web interface and configure it to connect the data generated in the Kubernetes Pipeline with the LLM deployed in KServe.

The Open WebUI Pipeline uses the Milvus database to load context related to the search. The pipeline sends it, and the query, to the Llama 3 LLM instance within KServe. The LLM then sends back a response to the chatbot, and your browser displays an answer informed by the custom data set.

### Create a configmap with the RAG Pipeline Files

The RAG pipeline files in this section are not related to the Kubeflow pipeline create in the previous section. Rather, the RAG pipeline instructs the chatbot how to interact with each component created thus far, including the Milvus data store and the Llama 3 LLM.

1.  Navigate to the **Apps** section, and click on **Gitea**.

1.  In Gitea, navigate to the `team-demo-argocd` repository.

1.  Create a file with the name `pipeline-files.yaml` with the following contents. Replace {{< placeholder "<cluster-domain>" >}} with the domain of your App Platform instance:

    ```file
    apiVersion: v1
    data:
    pipeline-requirements.txt: |
        requests
        pymilvus
        llama-index
        llama-index-vector-stores-milvus
        llama-index-embeddings-huggingface
        llama-index-llms-openai-like
        opencv-python-headless
    rag-pipeline.py: |
        """
        title: RAG Pipeline
        version: 1.0
        description: RAG Pipeline
        """
        from typing import List, Optional, Union, Generator, Iterator

        class Pipeline:

            def __init__(self):
                self.name = "RAG Pipeline"
                self.index = None
                pass


            async def on_startup(self):
                from llama_index.embeddings.huggingface import HuggingFaceEmbedding
                from llama_index.core import Settings, VectorStoreIndex
                from llama_index.llms.openai_like import OpenAILike
                from llama_index.vector_stores.milvus import MilvusVectorStore

                print(f"on_startup:{__name__}")

                Settings.embed_model = HuggingFaceEmbedding(
                    model_name="sentence-transformers/all-MiniLM-L6-v2"
                )

                llm = OpenAILike(
                    model="llama3",
                    api_base="https://llama3-model-predictor-team-demo.<cluster-domain>/openai/v1",
                    api_key = "EMPTY",
                    max_tokens = 512)

                Settings.llm = llm

                vector_store = MilvusVectorStore(uri="http://milvus.milvus.svc.cluster.local:19530", collection="linode_docs", dim=384, overwrite=False)
                self.index = VectorStoreIndex.from_vector_store(vector_store=vector_store)

            async def on_shutdown(self):
                print(f"on_shutdown:{__name__}")
                pass


            def pipe(
                self, user_message: str, model_id: str, messages: List[dict], body: dict
            ) -> Union[str, Generator, Iterator]:
                print(f"pipe:{__name__}")

                query_engine = self.index.as_query_engine(streaming=True, similarity_top_k=5)
                response = query_engine.query(user_message)
                print(f"rag_response:{response}")
                return f"{response}"
    kind: ConfigMap
    metadata:
    name: pipelines-files
    ```

1.  Open the Argo CD application, and navigate to the `team-<team-name>` application to see if the configmap has been created. If it is not ready yet, click **Refresh** as needed.

### Deploy the open-webui Pipeline and Web Interface

Update the Kyverno **Policy** created in the previous tutorial ([Deploy an LLM for AI Inferencing with App Platform for LKE](/docs/guides/deploy-llm-for-ai-inferencing-on-apl)) to mutate the `open-webui` pods that will be deployed. Add the following contents so that the pods are deployed with the `sidecar.istio.io/inject: "false"` label that prevents Istio sidecar injection:

```file
     - resources:
          kinds:
          - StatefulSet
          - Deployment
          selector:
            matchLabels:
              ## change the value to match the name of the Workload
              app.kubernetes.io/instance: "linode-docs-chatbot"
      - resources:
          kinds:
          - StatefulSet
          - Deployment
          selector:
            matchLabels:
              ## change the value to match the name of the Workload
              app.kubernetes.io/instance: "linode-docs-pipeline"
```

#### Add the open-webui-pipelines Helm Chart to the Catalog

1.  Select **view** > **team** and **team** > **demo** in the top bar.

1.  Click on **Catalog** in the left menu.

1.  Select **Add Helm Chart**.

1.  Under **Github URL**, add the URL to the `open-webui-pipelines` Helm chart:

    ```command
    https://github.com/open-webui/helm-charts/blob/pipelines-0.4.0/charts/pipelines/Chart.yaml
    ```

1.  Click **Get Details** to populate the `open-webui-pipelines` Helm chart details.

1.  Click **Add Chart**.

#### Create a Workload for the open-webui-pipelines Helm Chart

1.  Select **view** > **team** and **team** > **demo** in the top bar.

1.  Select **Workloads**.

1.  Click on **Create Workload**.

1.  Select the `open-webui-pipelines` Helm chart from the Catalog.

1.  Click on **Values**.

1.  Provide a name for the Workload. This guide uses the Workload name "open-webui-pipelines".

1.  Add **______** as the namespace.

1.  Select **Create Namespace**.

1.  Change the following chart values:

    ```
    nameOverride: linode-docs-pipeline
    resources:
    requests:
        cpu: "1"
        memory: 512Mi
    limits:
        cpu: "3"
        memory: 2Gi
    ingress:
    enabled: false
    extraEnvVars:
    - name: PIPELINES_REQUIREMENTS_PATH
        value: /opt/pipeline-requirements.txt
    - name: PIPELINES_URLS
        value: file:///opt/rag-pipeline.py
    volumeMounts:
    - name: config-volume
        mountPath: /opt
    volumes:
    - name: config-volume
        configMap:
        name: pipelines-files
    ```

1.  Click **Submit**.

#### Expose the linode-docs-pipeline Service

1.  Select **Services**.

1.  Click **Create Service**.

1.  In the **Name** dropdown menu, select the `linode-docs-pipeline` service.

1.  Under **Exposure**, select **External**.

1.  Click **Submit**.

1.  Once submitted, copy the URL of the `linode-docs-pipeline` service to your clipboard.

#### Add the open-webui Helm Chart to the Catalog

1.  Select **view** > **team** and **team** > **demo** in the top bar.

1.  Click on **Catalog** in the left menu.

1.  Select **Add Helm Chart**.

1.  Under **Github URL**, add the URL to the `open-webui` Helm chart:

    ```command
    https://github.com/open-webui/helm-charts/blob/open-webui-5.20.0/charts/open-webui/Chart.yaml
    ```

1.  Click **Get Details** to populate the `open-webui` Helm chart details.

1.  Click **Add Chart**.

#### Create a Workload to Install the open-webui Helm Chart

1.  Select **view** > **team** and **team** > **demo** in the top bar.

1.  Select **Workloads**.

1.  Click on **Create Workload**.

1.  Select the `open-webui-pipelines` Helm chart from the Catalog.

1.  Click on **Values**.

1.  Provide a name for the Workload.

1.  Edit the chart to include the below values, and set the name of the Workload in the `nameOverride` field:

    ```
    nameOverride: linode-docs-chatbot
    ollama:
    enabled: false
    pipelines:
    enabled: false
    persistence:
    enabled: false
    replicaCount: 1
    extraEnvVars:
    - name: WEBUI_AUTH
        value: "false"
    - name: OPENAI_API_BASE_URLS
        value: https://llama3-model-predictor-team-demo.<cluster-domain>/openai/v1/openai/v1;https://linode-docs-pipeline-demo.lke366246.<cluster-domain>
    - name: OPENAI_API_KEYS
        value: EMPTY;0p3n-w3bu!
    ```

#### Expose the linode-docs-chatbot Service

1.  Select **Services**.

1.  Click **Create Service**.

1.  In the **Name** dropdown menu, select the `linode-docs-chatbot` service.

1.  Under **Exposure**, select **External**.

1.  Click **Submit**.

## Access the Open Web User Interface

In your list of available **Services**, click on the URL of the `linode-docs-chatbot` to navigate to the Open WebUI chatbot interface. Select the model you wish to use in the top left dropdown menu (`llama3-model` or `RAG Pipeline`).

Meta AI's Llama 3 model uses information that is pre-trained by other data sources - not your custom data set. If you give this model a query, it will use its pre-trained data set to answer your question.

The RAG Pipeline model defined in this guide uses data from the custom data set with which it was provided. The example data set used in this guide is sourced from Linode Docs. If you give this model a query relevant to your custom data, the chatbot should respond with an answer informed by that data set.

[SCREENSHOT]