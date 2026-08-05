---
slug: use-object-storage-for-ai-model-artifacts-and-datasets
title: "Use Object Storage for AI model artifacts and datasets"
description: "Learn how to organize, upload, download, and manage AI model artifacts and datasets with Akamai Object Storage."
og_description: "Learn how to organize, upload, download, and manage AI model artifacts and datasets with Akamai Object Storage."
authors: ["Akamai"]
contributors: ["Akamai", "Adam Overa"]
published: "2026-06-12"
keywords: ['object storage','ai','machine learning','model artifacts','datasets','s3-compatible storage','akamai cloud']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
tags: ["Object Storage"]
---

AI workloads often depend on files that need to be stored, reused, shared, and moved between environments. These files can include datasets, trained model files, checkpoints, tokenizer files, configuration files, embeddings exports, and inference outputs.

Akamai Object Storage provides an S3-compatible storage service that can keep these files separate from the compute resources that run training, fine-tuning, inference, or data-processing jobs. This guide shows how to create an Object Storage bucket, configure Object Storage access with the Linode CLI, upload AI-related files, retrieve them from a compute instance, and organize storage paths for repeatable AI workflows.

## Before you begin

1.  Follow the [Get started](https://techdocs.akamai.com/cloud-computing/docs/getting-started) guide to create an Akamai Cloud account.

1.  Follow the [Create a compute instance](https://techdocs.akamai.com/cloud-computing/docs/create-a-compute-instance) guide to create a compute instance with at least 4 GB of memory if you want to test downloading artifacts to a server.

1.  Follow the [Set up and secure a compute instance](https://techdocs.akamai.com/cloud-computing/docs/set-up-and-secure-a-compute-instance) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  Follow the [Create a personal access token](https://techdocs.akamai.com/cloud-computing/docs/manage-personal-access-tokens) guide to create a token for the Linode CLI.

1.  Follow the [Getting started with the Linode CLI](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-the-linode-cli) guide to install and configure the Linode CLI. Be sure to install the `boto3` library to enable the Linode CLI's Object Storage features. This guide uses the Linode CLI for all Object Storage examples.

    {{< note >}}
    Other S3-compatible command-line tools, such as `s3cmd`, `rclone`, and the AWS CLI, can also work with Object Storage. Those tools are outside the scope of this guide and require an Object Storage access key. If you plan to use one of those tools, follow the [Manage access keys](https://techdocs.akamai.com/cloud-computing/docs/manage-access-keys) guide to create an Object Storage access key.
    {{< /note >}}

## What are AI model artifacts and datasets?

AI workloads often rely on files that are created, downloaded, modified, or reused across multiple systems. These files can be grouped into two broad categories: datasets and model artifacts.

A **dataset** is a collection of data used by an AI workload. Datasets can be used to train a model, evaluate a model, generate embeddings, or provide source material for a retrieval-augmented generation (RAG) application. Examples include text files, JSONL files, CSV files, images, audio files, documents, and archived collections of raw or processed data.

A **model artifact** is a file or group of files used to load, configure, run, or preserve a model. Artifacts can include model weights, checkpoints, tokenizer files, configuration files, prompt templates, evaluation results, and generated outputs.

Common AI-related files include:

- Training datasets
- Evaluation datasets
- Model weights
- Model checkpoints
- Tokenizers
- Configuration files
- Prompt templates
- Embeddings exports
- Inference outputs
- Logs and experiment results

Object Storage does not run training, fine-tuning, inference, or embedding jobs. Instead, it stores the files that those workloads consume or produce. This makes Object Storage useful as a central location for files that need to persist beyond the life of a single compute instance.

## Why use Object Storage for AI files?

AI workloads often create files that need to outlive a single compute instance, notebook session, or batch job. Storing those files only on an instance's local filesystem can make them harder to reuse, share, back up, or recover if the instance is rebuilt or deleted.

Object Storage helps separate AI data from the compute resources that process it. You can store datasets, model artifacts, checkpoints, and generated outputs in a bucket, then retrieve those files from a compute instance, GPU instance, container, or pipeline when needed.

This approach can help you:

- Keep datasets and model files outside the compute instance filesystem.
- Reuse the same files across multiple instances, jobs, or environments.
- Replace, rebuild, or resize compute resources without losing stored artifacts.
- Store generated outputs, checkpoints, and experiment results in a durable location.
- Use the Linode CLI and S3-compatible tooling for uploads, downloads, and automation.
- Organize files with predictable bucket and prefix structures.

Object Storage is best suited for files that are read from or written to as objects. It is not a replacement for a local filesystem, block storage volume, or database when an application needs low-latency file access, frequent in-place updates, or structured queries.

## Plan an Object Storage layout

Before uploading files, plan how buckets and object prefixes should be organized. A clear layout makes it easier to find files, reuse artifacts, automate jobs, and separate development files from production files.

Object Storage stores files as objects in buckets. Within a bucket, you can use prefixes to create a folder-like structure. For an AI project, a layout might separate raw datasets, processed datasets, model files, embeddings, outputs, and logs.

Example bucket and prefix structure:

```output
ai-projects/
├── datasets/
│   ├── raw/
│   ├── processed/
│   └── evaluation/
├── models/
│   ├── base/
│   ├── fine-tuned/
│   └── checkpoints/
├── embeddings/
├── outputs/
│   ├── batch-inference/
│   └── generated-content/
└── logs/
```

In this example, `ai-projects` represents the bucket name. The directories below it represent object prefixes. For example, a processed dataset could be stored at a path like `datasets/processed/support-docs-2026-06.jsonl`, and a model checkpoint could be stored at `models/checkpoints/support-chatbot/checkpoint-001.tar.gz`.

Use separate buckets when you need a stronger boundary between projects, environments, teams, or access patterns. For example, you might use separate buckets for development and production files:

```output
ai-projects-dev/
ai-projects-prod/
```

Use prefixes when the files belong to the same project or access boundary but need logical organization. Prefixes are useful for grouping files by type, workflow stage, model name, date, version, or job ID.

Common prefix examples include:

```output
datasets/raw/
datasets/processed/
models/base/
models/fine-tuned/
models/checkpoints/
embeddings/
outputs/batch-inference/
logs/
```

### Plan for large and versioned AI files

AI datasets, model checkpoints, and generated outputs can be much larger than the sample files used in this guide. Before uploading large files, review the current [Object Storage quotas and limits](https://techdocs.akamai.com/cloud-computing/docs/object-storage-product-limits) for your account and endpoint. If your workflow needs to upload very large datasets or model artifacts, consider using an S3-compatible tool that supports multipart uploads.

AI workflows also need predictable versioning so earlier training, fine-tuning, embedding, or inference runs can be reproduced. Use object names, prefixes, dates, version numbers, model names, or job IDs to identify datasets, checkpoints, configuration files, and generated outputs.

For example:

```output
datasets/processed/support-docs-v1.jsonl
datasets/processed/support-docs-v2.jsonl
models/checkpoints/support-chatbot/checkpoint-001.tar.gz
models/checkpoints/support-chatbot/checkpoint-002.tar.gz
outputs/batch-inference/2026-06-12/job-summary.txt
```

Object Storage also supports bucket versioning, which can retain previous versions of objects when files are replaced or deleted. If your workflow needs object-level recovery or change history, review the [Versioning](https://techdocs.akamai.com/cloud-computing/docs/versioning-retain-object-version-history) guide before storing production datasets or model artifacts.

When planning the layout, follow these guidelines:

- Use clear names that describe the project, environment, file type, or workflow stage.
- Keep development, test, and production artifacts separate.
- Use predictable prefixes so scripts and pipelines can find files consistently.
- Include dates, version numbers, model names, or job IDs when files are generated repeatedly.
- Avoid storing secrets, credentials, private keys, or access tokens in Object Storage.
- Avoid making buckets or objects public unless the files are intentionally public.

## Configure Object Storage access with the Linode CLI

The Linode CLI can manage Object Storage buckets and objects from the same command-line interface used for other Akamai Cloud resources. Before uploading files, confirm that the Object Storage commands are available and that the CLI can list your buckets.

The Linode CLI provides an `obj` command group for Object Storage bucket and object operations. This command group is also referred to as the Object Storage plugin in the Linode CLI documentation. Use the following command to confirm that the `obj` commands are available:

```command
linode-cli obj --help
```

To confirm that your CLI can access Object Storage, list the buckets on your account:

```command
linode-cli obj ls
```

{{< note >}}
When you use the Linode CLI `obj` commands for the first time on a system, the CLI can automatically create an Object Storage access key for those commands and store it in the Linode CLI configuration file.
{{< /note >}}

Do not commit Object Storage credentials to Git or store them in project files. If you use an access key directly, store it in your selected tool's local configuration file, environment variables, or another secure location with restricted access. Rotate the access key if it is exposed.

## Create an Object Storage bucket with the Linode CLI

Create an Object Storage bucket to store the sample AI files used in this guide. Use a clear bucket name that identifies the project, environment, or workload. For example, a development bucket for an AI documentation chatbot could use a name like `ai-docs-chatbot-dev`, while a production bucket could use a name like `ai-docs-chatbot-prod`.

Create the bucket with the `linode-cli obj mb` command. Replace {{< placeholder "BUCKET_LABEL" >}} with your bucket name.

```command
linode-cli obj mb {{< placeholder "BUCKET_LABEL" >}}
```

Whenever possible, create the bucket in the same Object Storage cluster or region as the compute resources that need to access the files. Keeping storage and compute resources close to each other can help reduce latency and avoid unnecessary data transfer between regions.

If you need to create the bucket in a cluster other than the Linode CLI default, include the `--cluster` option. Replace {{< placeholder "CLUSTER_ID" >}} with the Object Storage cluster or region identifier.

```command
linode-cli obj mb {{< placeholder "BUCKET_LABEL" >}} --cluster {{< placeholder "CLUSTER_ID" >}}
```

For readability, the remaining Linode CLI examples in this guide omit `--cluster` unless the option is the focus of the example. If your bucket requires `--cluster`, add it to each command that reads from or writes to the bucket. See the [Troubleshooting](#the-wrong-object-storage-cluster-is-being-used) section for more examples.

List your buckets to confirm that the bucket was created:

```command
linode-cli obj ls
```

Keep the bucket private unless the files need to be publicly accessible. Model artifacts, datasets, checkpoints, embeddings exports, and generated outputs often contain private or internal data and should not be made public by default.

## Upload a sample dataset or model artifact

Create a few small sample files to represent the types of files an AI workload might store in Object Storage. The following examples create a JSONL dataset sample and a model configuration file.

Create a working directory for the sample files:

```command
mkdir ai-object-storage-sample
cd ai-object-storage-sample
```

Create a small JSONL dataset file:

```command
cat > sample-dataset.jsonl <<'EOF'
{"id":"doc-001","text":"Object Storage can store datasets, model artifacts, checkpoints, and generated outputs."}
{"id":"doc-002","text":"AI workloads can retrieve files from Object Storage before running inference or data processing jobs."}
{"id":"doc-003","text":"Keeping data separate from compute resources can make AI workflows easier to repeat."}
EOF
```

Create a sample model configuration file:

```command
cat > model-config.json <<'EOF'
{
  "model_name": "example-support-chatbot",
  "artifact_type": "configuration",
  "dataset": "sample-dataset.jsonl",
  "description": "Example configuration file for an AI workload using Object Storage."
}
EOF
```

Create an archive that represents a model artifact:

```command
tar -czf model-artifact.tar.gz model-config.json
```

Upload the files to your Object Storage bucket. Replace {{< placeholder "BUCKET_LABEL" >}} with your bucket name.

```command
linode-cli obj put sample-dataset.jsonl {{< placeholder "BUCKET_LABEL" >}}
linode-cli obj put model-config.json {{< placeholder "BUCKET_LABEL" >}}
linode-cli obj put model-artifact.tar.gz {{< placeholder "BUCKET_LABEL" >}}
```

List the bucket contents to verify that the files were uploaded:

```command
linode-cli obj ls {{< placeholder "BUCKET_LABEL" >}}
```

The output should include the uploaded sample files:

```output
sample-dataset.jsonl
model-config.json
model-artifact.tar.gz
```

These files are intentionally small so you can test the workflow without uploading a large dataset or model. In a production workflow, the same process can be used for larger datasets, model checkpoints, processed files, or generated outputs.

## Download an artifact to a compute instance

After uploading files to Object Storage, you can retrieve them from a compute instance when an AI workflow needs them. For example, an inference service might download a model artifact before starting, or a batch job might download a dataset before processing it.

Connect to the compute instance using SSH:

```command
ssh {{< placeholder "USERNAME" >}}@{{< placeholder "IP_ADDRESS" >}}
```

Create a working directory for the downloaded files:

```command
mkdir ai-object-storage-downloads
cd ai-object-storage-downloads
```

Install and configure the Linode CLI on the compute instance if it is not already available. Then, confirm that the Linode CLI can list your Object Storage buckets:

```command
linode-cli obj ls
```

Download the sample files from your Object Storage bucket. Replace {{< placeholder "BUCKET_LABEL" >}} with your bucket name.

```command
linode-cli obj get {{< placeholder "BUCKET_LABEL" >}} sample-dataset.jsonl
linode-cli obj get {{< placeholder "BUCKET_LABEL" >}} model-config.json
linode-cli obj get {{< placeholder "BUCKET_LABEL" >}} model-artifact.tar.gz
```

List the local directory to confirm that the files downloaded successfully:

```command
ls -lh
```

The output should include the downloaded files:

```output
-rw-r--r-- 1 user user  331 Jun 12 16:00 sample-dataset.jsonl
-rw-r--r-- 1 user user  190 Jun 12 16:00 model-config.json
-rw-r--r-- 1 user user  245 Jun 12 16:00 model-artifact.tar.gz
```

You can inspect the files to confirm that they contain the expected content:

```command
cat sample-dataset.jsonl
cat model-config.json
```

Extract the example model artifact archive:

```command
tar -xzf model-artifact.tar.gz
```

In a real AI workflow, this step might prepare a dataset, model checkpoint, tokenizer, or configuration file before starting a training, fine-tuning, embedding, or inference process.

## Use Object Storage in an AI workflow

After the sample files are uploaded and downloaded, you can use the same pattern in a larger AI workflow. Object Storage works well as a durable location for inputs and outputs, while compute instances, GPU instances, containers, or Kubernetes workloads perform the actual processing.

A common workflow is:

1. Upload datasets, model artifacts, or configuration files to Object Storage.
2. Start a compute, GPU, or containerized workload.
3. Download the required files from Object Storage.
4. Run a training, fine-tuning, embedding, batch inference, or data-processing job.
5. Upload generated outputs, checkpoints, logs, or evaluation results back to Object Storage.
6. Stop, rebuild, resize, or delete the compute resource without losing the stored files.

For example, a batch inference job might download a processed dataset and model configuration file before running:

```command
linode-cli obj get {{< placeholder "BUCKET_LABEL" >}} sample-dataset.jsonl
linode-cli obj get {{< placeholder "BUCKET_LABEL" >}} model-config.json
```

After the job completes, it can upload generated output files back to the bucket:

```command
linode-cli obj put inference-output.jsonl {{< placeholder "BUCKET_LABEL" >}}
linode-cli obj put job-summary.txt {{< placeholder "BUCKET_LABEL" >}}
```

In practice, these steps are often automated in a script, scheduled job, container entrypoint, or CI/CD workflow instead of being run manually. To test this pattern, create a mock Python script that simulates an inference job by reading the downloaded input files and generating a sample output file:

```command
cat > run-inference.py <<'EOF'
import argparse
import json

parser = argparse.ArgumentParser()
parser.add_argument("--dataset")
parser.add_argument("--config")
parser.add_argument("--output")
args = parser.parse_args()

with open(args.output, "w") as f:
    f.write(json.dumps({
        "status": "success",
        "processed_file": args.dataset,
        "config_file": args.config
    }) + "\n")

print(f"Mock inference complete. Output saved to {args.output}")
EOF
```

Then, create a shell script that downloads the inputs from Object Storage, runs the mock inference script, and uploads the generated output:

```command
cat > run-inference.sh <<'EOF'
#!/bin/sh
set -e

BUCKET={{< placeholder "BUCKET_LABEL" >}}

linode-cli obj get "$BUCKET" sample-dataset.jsonl
linode-cli obj get "$BUCKET" model-config.json
python3 run-inference.py --dataset sample-dataset.jsonl --config model-config.json --output inference-output.jsonl
printf 'Mock inference job completed successfully.\n' > job-summary.txt
linode-cli obj put inference-output.jsonl "$BUCKET"
linode-cli obj put job-summary.txt "$BUCKET"
EOF
chmod +x run-inference.sh
```

Run the script:

```command
./run-inference.sh
```

List the bucket contents and inspect the generated files:

```command
linode-cli obj ls {{< placeholder "BUCKET_LABEL" >}}
cat inference-output.jsonl
cat job-summary.txt
```

The output should show that the script generated and uploaded `inference-output.jsonl` and `job-summary.txt`. This keeps the workflow repeatable: each run retrieves the expected inputs from Object Storage and writes the generated output back to the bucket.

Use prefixes to keep workflow outputs organized. For example, instead of uploading every file to the top level of the bucket, store outputs under a prefix that identifies the workflow, date, or job ID. To preserve the prefix path, create the same path locally before uploading the files:

```command
mkdir -p outputs/batch-inference/2026-06-12
mv inference-output.jsonl outputs/batch-inference/2026-06-12/
mv job-summary.txt outputs/batch-inference/2026-06-12/
linode-cli obj put outputs/batch-inference/2026-06-12/inference-output.jsonl {{< placeholder "BUCKET_LABEL" >}}
linode-cli obj put outputs/batch-inference/2026-06-12/job-summary.txt {{< placeholder "BUCKET_LABEL" >}}
```

This pattern separates durable storage from temporary compute resources. The compute instance or job can be replaced after the workload finishes, while datasets, artifacts, generated outputs, and logs remain available in Object Storage for future runs.

## Manage access and permissions

AI files can contain sensitive information, including private datasets, internal documents, model outputs, embeddings, logs, or configuration details. Keep Object Storage buckets and objects private unless the files are intentionally public.

Object Storage access is controlled through access keys and bucket or object permissions. Treat access keys like passwords. Anyone with a valid access key and secret key may be able to read, write, or delete objects depending on the permissions associated with the key and bucket.

Follow these guidelines when storing AI files in Object Storage:

- Keep buckets private by default.
- Create separate access keys for different users, tools, environments, or automation workflows when possible.
- Store access keys outside of application source code and Git repositories.
- Rotate access keys if they are exposed or no longer needed.
- Use separate buckets for development, testing, and production if those environments need different access boundaries.
- Do not store API keys, private keys, passwords, tokens, or other secrets in Object Storage.
- Do not make model artifacts, datasets, embeddings, logs, or generated outputs public unless they are intentionally meant to be public.

For example, a development workflow and a production workflow might use separate buckets:

```output
ai-docs-chatbot-dev/
ai-docs-chatbot-prod/
```

This makes it easier to keep test data, experimental outputs, and production artifacts separate. It can also reduce the risk of a development process overwriting or exposing production files.

If a workload only needs to read files from Object Storage, avoid using credentials that are also used for unrelated upload or management workflows. If a workflow creates outputs, checkpoints, or logs, limit those credentials to the bucket or process that needs them when your tooling and access model allow it.

{{< note >}}
Review any dataset, model output, or log file before sharing it publicly. AI datasets and outputs may contain personal information, proprietary content, prompts, generated responses, or internal business data.
{{< /note >}}

## Clean up resources

When you finish testing, remove any sample files and resources that you no longer need. Be careful when deleting objects from a bucket that contains real datasets, model artifacts, checkpoints, or production outputs.

Remove the sample objects from your Object Storage bucket. Replace {{< placeholder "BUCKET_LABEL" >}} with your bucket name.

```command
linode-cli obj rm {{< placeholder "BUCKET_LABEL" >}} sample-dataset.jsonl
linode-cli obj rm {{< placeholder "BUCKET_LABEL" >}} model-config.json
linode-cli obj rm {{< placeholder "BUCKET_LABEL" >}} model-artifact.tar.gz
linode-cli obj rm {{< placeholder "BUCKET_LABEL" >}} inference-output.jsonl
linode-cli obj rm {{< placeholder "BUCKET_LABEL" >}} job-summary.txt
```

List the bucket contents to confirm that the sample files were removed:

```command
linode-cli obj ls {{< placeholder "BUCKET_LABEL" >}}
```

If you created local sample files on your workstation or compute instance, remove the working directories when they are no longer needed:

```command
cd ..
rm -rf ai-object-storage-sample ai-object-storage-downloads
```

If you created a compute instance only to test this guide, delete it when you are finished to avoid additional charges. If you created a bucket only for testing and it no longer contains objects you need, you can also delete the bucket from Cloud Manager or with the Linode CLI.

{{< note type="alert" >}}
Only delete a bucket after confirming that it does not contain datasets, model artifacts, outputs, or other files you need to keep. Bucket deletion permanently removes the bucket and its contents.
{{< /note >}}

## Troubleshooting

Use the following sections to resolve common issues with Object Storage access, uploads, downloads, and AI file usage.

### Authentication failed

Authentication errors usually indicate a problem with the Object Storage access key, secret key, endpoint, or CLI configuration.

If authentication fails, try the following:

- Confirm that the access key and secret key are correct.
- Confirm that the access key has not been deleted or rotated.
- Check whether the Linode CLI is configured for the correct account.
- If you are using another S3-compatible client, verify that it is configured with the correct access key, secret key, and S3 endpoint.
- Reconfigure the client if you recently created a new access key.

For the Linode CLI, confirm that Object Storage commands are available:

```command
linode-cli obj --help
```

Then list your available buckets:

```command
linode-cli obj ls
```

If the bucket is in a different Object Storage cluster than your CLI default, include the `--cluster` option.

### Bucket not found

A bucket-not-found error can occur when the bucket name is incorrect, the bucket is in a different Object Storage cluster, or the CLI is using credentials for a different account.

If the bucket cannot be found, try the following:

- Check the bucket name for typos.
- Confirm that the bucket exists in Cloud Manager.
- Confirm that the bucket is in the expected region or cluster.
- List your buckets with `linode-cli obj ls`.
- Include the `--cluster` option if the bucket is not in the CLI's default Object Storage cluster.
- Confirm that the CLI is authenticated to the account that owns the bucket.

Use the following command to list buckets in a specific cluster:

```command
linode-cli obj ls --cluster {{< placeholder "CLUSTER_ID" >}}
```

### Access denied

An access-denied error usually means that the credentials can reach Object Storage, but they do not have permission to perform the requested action or access the requested object.

If access is denied, try the following:

- Confirm that the access key is valid for the bucket you are using.
- Confirm that the object path is correct.
- Confirm that the object exists in the bucket.
- Check whether the bucket or object has permissions that prevent the requested read, write, or delete operation.
- If you are using a newly created access key, reconfigure your CLI or S3-compatible client with the new credentials.
- Avoid using public access as a workaround unless the files are intentionally public.

To verify that the object exists, list the bucket contents:

```command
linode-cli obj ls {{< placeholder "BUCKET_LABEL" >}}
```

If needed, include the cluster:

```command
linode-cli obj ls {{< placeholder "BUCKET_LABEL" >}} --cluster {{< placeholder "CLUSTER_ID" >}}
```

### Uploads or downloads are slow

Upload and download speed can be affected by file size, network conditions, the selected Object Storage region, and the location of the compute resource accessing the bucket.

If transfers are slower than expected, try the following:

- Confirm that the compute instance and Object Storage bucket are in nearby or matching regions when possible.
- Check the size of the files being transferred.
- Test with a small file to determine whether the issue affects all transfers or only large files.
- Check local network connectivity if uploading from your workstation.
- Review the current Object Storage quotas and limits before uploading very large files.
- Use multipart uploads or an S3-compatible tool that supports multipart uploads for very large files if your workflow requires it.
- Avoid repeatedly downloading the same large model artifacts when they can be cached locally for the duration of a job.

You can check the size of local files before uploading them:

```command
ls -lh
```

### File downloaded but the AI tool cannot load it

If a file downloads successfully but your AI tool cannot load it, the issue is usually related to the file format, file path, archive contents, or model-specific directory structure.

If the downloaded file cannot be used, try the following:

- Confirm that the file downloaded to the directory expected by the AI tool.
- Check whether the file needs to be extracted before use.
- Confirm that the archive contains the expected files.
- Verify that configuration files reference the correct local paths.
- Confirm that the model, tokenizer, dataset, or checkpoint format is supported by the tool you are using.
- If the object was uploaded from another system, compare file sizes or checksums to confirm that the file was not truncated or corrupted.

For example, inspect the sample files from this guide:

```command
cat sample-dataset.jsonl
cat model-config.json
tar -tzf model-artifact.tar.gz
```

### The wrong Object Storage cluster is being used

Some Object Storage commands use a default cluster. If your bucket is in a different cluster, a command may fail even though the bucket exists and your credentials are valid.

If you suspect the wrong cluster is being used, try the following:

- Check the bucket details in Cloud Manager to confirm its region or cluster.
- Include the `--cluster` option in commands that read from or write to the bucket.
- Use the same cluster value consistently for listing, uploading, downloading, and deleting objects.
- Update scripts or automation so they do not rely on an incorrect default cluster.

For example, list the bucket with an explicit cluster:

```command
linode-cli obj ls {{< placeholder "BUCKET_LABEL" >}} --cluster {{< placeholder "CLUSTER_ID" >}}
```

Upload an object with the same cluster value:

```command
linode-cli obj put sample-dataset.jsonl {{< placeholder "BUCKET_LABEL" >}} --cluster {{< placeholder "CLUSTER_ID" >}}
```

Download the object with the same cluster value:

```command
linode-cli obj get {{< placeholder "BUCKET_LABEL" >}} sample-dataset.jsonl --cluster {{< placeholder "CLUSTER_ID" >}}
```

## Next steps

For more AI application and infrastructure examples, see the following guides:

- [AI Inference with App Platform for LKE](/docs/guides/deploy-llm-for-ai-inferencing-on-apl/)
- [Implement RAG (Retrieval-Augmented Generation) with App Platform for LKE](/docs/guides/deploy-rag-pipeline-and-chatbot-on-apl/)
- [Deploy a Chatbot and RAG Pipeline for AI Inferencing on LKE](/docs/guides/ai-chatbot-and-rag-pipeline-for-inference-on-lke/)
- [Using LangChain and LangGraph to Build a RAG-Powered Chatbot](/docs/guides/using-langchain-langgraph-build-rag-powered-chatbot/)
- [Deploy a RAG-Powered Chatbot with LangChain on an Akamai Compute Instance](/docs/guides/deploy-rag-powered-chatbot-langchain-akamai-compute-instance/)
- [Deploy a RAG-Powered Chatbot with LangChain on LKE](/docs/guides/deploy-rag-powered-chatbot-langchain-lke/)
- [Teaching New Skills to an LLM: Deploy a Fine-Tuning Job on LKE](/docs/guides/fine-tuning-job-on-lke/)