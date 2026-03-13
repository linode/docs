---
slug: migrating-kubernetes-workloads-to-linode-kubernetes-engine-lke-using-velero
title: "Migrating Kubernetes Workloads to Linode Kubernetes Engine (LKE) Using Velero"
description: "Migrate Kubernetes workloads and persistent volumes to Linode Kubernetes Engine (LKE) using Velero with CSI snapshots and file-system backup strategies."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2025-07-21
keywords: ['kubernetes migration', 'velero', 'linode kubernetes engine', 'lke', 'persistent volume', 'csi snapshots', 'disaster recovery', 'multi-cloud backup', 'migrate kubernetes workloads to lke with velero', 'velero backup and restore guide', 'persistent volume migration using velero', 'csi snapshot backup for kubernetes', 'multi-cloud kubernetes disaster recovery strategy', 'linode lke persistent data migration']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Velero Documentation Home]([https://velero.io/docs/v1.16/](https://velero.io/docs/v1.16/)'
- '[Installing the Velero CLI](https://velero.io/docs/v1.16/basic-install/#install-the-cli)'
- '[Velero Storage Provider Plugins](https://velero.io/docs/v1.16/supported-providers/)'
---

The primary reasons organizations migrate Kubernetes clusters are disaster recovery and switching providers (usually for feature or cost reasons).

Performing this migration safely requires taking a complete snapshot of all resources in the source cluster, then restoring that snapshot on the target cluster. After snapshot restoration, all external traffic is pointed to the new cluster, and the old cluster is shut down (assuming it can still be accessed).

Deploying Kubernetes resources can be straightforward with a solid CI/CD pipeline in place. However, there are several reasons that could prevent you from simply pointing your CI/CD pipeline to the new cluster, including:

-   Your CI/CD pipeline itself runs in the source cluster.
-   Some resources, such as secrets, are provisioned outside your CI/CD pipeline.
-   Persistent data volumes hold data that your CI/CD pipeline cannot copy.

In scenarios such as these, DevOps engineers may look to Velero.

## What Is Velero?

[**Velero**](https://velero.io/) is an open source, Kubernetes-native tool for backing up and restoring Kubernetes resources and persistent volumes. It supports backup of core resources, namespaces, deployments, services, ConfigMaps, Secrets, and Custom Resource Definitions (CRDs). It integrates with different storage backends for storing and restoring backups, including AWS S3 and Linode Object Storage.

## Before You Begin

This guide walks through the process of using Velero to migrate a Kubernetes cluster with persistent volumes to [Linode Kubernetes Engine (LKE)](https://techdocs.akamai.com/cloud-computing/docs/linode-kubernetes-engine). The focus of the guide is on backing up and restoring persistent data volumes. For other migration concerns (e.g. adapting load balancing or DNS switching after the restore), refer to the appropriate Akamai Cloud guides on migrating to LKE from:
-   [AWS EKS](/docs/guides/migrating-from-aws-eks-to-linode-kubernetes-engine-lke/)
-   [Google GKE](/docs/guides/migrating-from-google-gke-to-linode-kubernetes-engine-lke/)
-   [Azure AKS](/docs/guides/migrating-from-azure-aks-to-linode-kubernetes-engine-lke/)
-   [Oracle OKE](/docs/guides/migrating-from-oracle-kubernetes-engine-to-linode-kubernetes-engine-lke/)

While the example in this guide starts with an AWS EKS cluster, the same process can apply to most Kubernetes providers.

{{< note >}}
EKS `t3.micro` nodes lack sufficient memory and pod capacity for running Velero reliably. This guide uses `t3.small` as the minimum functional node type for EKS-based Velero testing.
{{< /note >}}

1.  Follow Akamai's [Getting Started](https://techdocs.akamai.com/cloud-computing/docs/getting-started) guide, and create an Akamai Cloud account if you do not already have one.
1.  Create a personal access token using the instructions in the [Manage personal access tokens](https://techdocs.akamai.com/cloud-computing/docs/manage-personal-access-tokens) guide.
1.  Install the Linode CLI using the instructions in the [Install and configure the CLI](https://techdocs.akamai.com/cloud-computing/docs/install-and-configure-the-cli) guide.
1.  Follow the steps in the *Install `kubectl`* section of the [Getting started with LKE](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-lke-linode-kubernetes-engine#install-kubectl) guide to install and configure `kubectl`.
1.  If migrating a cluster from AWS, ensure that you have access to your AWS account with sufficient permissions to work with EKS clusters.
1.  Install and configure the [AWS CLI](https://aws.amazon.com/cli/) and [`eksctl`](https://eksctl.io/). The command line tooling you use may vary if migrating a cluster from another provider.
1.  Install [`jq`](/docs/guides/migrating-from-aws-eks-to-linode-kubernetes-engine-lke/docs/guides/using-jq-to-process-json-on-the-command-line/#install-jq-with-package-managers).
1.  Install the [`velero`](https://velero.io/docs/v1.3.0/velero-install/) [CLI](https://velero.io/docs/v1.3.0/velero-install/).

### Using This Guide

This tutorial contains a number of placeholders that are intended to be replaced by your own unique values. For reference purposes, the table below lists these placeholders, what they represent, and the example values used in this guide:

| Placeholder        | Represents                                           | Example Value                                           |
|--------------------|------------------------------------------------------|---------------------------------------------------------|
| `EKS_CLUSTER`      | The name of your AWS EKS cluster.                    | `my-source-k8s-cluster`                                 |
| `AWS_REGION`       | The AWS region for both EKS and S3.                  | `us-west-2`                                             |
| `ACCOUNT_ID`       | Your AWS account ID (used in ARNs and OIDC ID).      | `431966127852`                                          |
| `OIDC_ID`          | The OIDC provider ID of the EKS cluster.             | `50167EE12C1795D19075628E119`                           |
| `BUCKET_NAME`      | The name of the S3 bucket used by Velero.            | `velero-backup-7777`                                    |
| `POLICY_ARN`       | The ARN of the created IAM policy.                   | `arn:aws:iam::431966127852:policy/VeleroS3AccessPolicy` |
| `CREDENTIALS_FILE` | The path to the credentials file created for Velero. | `~/aws-credentials-velero`                              |
| `CLUSTER_ID`       | The numeric ID of the target LKE cluster.            | `463649`                                                |

{{< note title="All Values Have Been Sanitized" >}}
All of the example values used in this guide are purely examples to mimic and display the format of actual secrets. Nothing listed is a real credential to any existing system.

When creating your own values, **do not** use any of the above credentials.
{{< /note >}}

## Downtime During the Migration

The migration process shown in this guide involves some downtime. Keep in mind the following considerations during the migration:

-   **Temporary Double Capacity:** Verify quotas/limits so you can run both old and new clusters in parallel.
-   **Concurrent Operation:** Both clusters may run simultaneously while you validate workloads.
-   **Dual Read/Write Paths:** Data needs to flow to and from both clusters, so ensure the appropriate permissions.
-   **Staged Lockdown of the Source:** Gradually make the source cluster read‑only, then decommission it.
-   **Unified Observability:** Monitor both clusters with the same tooling to spot issues quickly.
-   **Rollback Capability:** Be ready to revert any workload if the target cluster misbehaves.

## Prepare the Source Cluster for Velero Usage

This guide starts from an existing AWS EKS cluster in the `us-west-2` region. Before installing and using Velero, take the following steps to prepare your source cluster.

1.  **Associate the EKS cluster with an OIDC provider**: Enables Kubernetes service accounts to securely assume AWS IAM roles.
1.  **Provision EBS CSI support in the cluster**: Allows Kubernetes to dynamically provision and manage EBS volumes.
1.  **Create a `StorageClass` using the EBS CSI provisioner**: Defines the provisioning behavior for EBS-backed volumes when persistent volume claims are made in the cluster.
1.  **Create an S3 bucket for storing Velero backups**: Sets up the location for Velero to save and retrieve backup data and snapshots.
1.  **Set up IAM credentials for Velero to use S3**: Grants Velero the necessary permissions to access the S3 bucket for backup and restore operations.

With these in place, you can install Velero with the necessary permissions and infrastructure to back up workloads (including persistent volume data) from EKS to S3.

### Associate the Cluster with an OIDC Provider

An OIDC provider is required to enable [IAM roles for service accounts (IRSA)](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html). This is the recommended way for Velero to authenticate to AWS services like S3.

1.  First, set the initial environment variables for the terminal session, replacing {{< placeholder "EKS_CLUSTER" >}} and {{< placeholder "AWS_REGION" >}}:

    ```command
    export EKS_CLUSTER="{{< placeholder "EKS_CLUSTER" >}}"
    export AWS_REGION="{{< placeholder "AWS_REGION" >}}"
    export ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    ```

1.  [Create the OIDC provider](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html) with the following command:

    ```command
    eksctl utils associate-iam-oidc-provider \
      --cluster "$EKS_CLUSTER" \
      --region "$AWS_REGION" \
      --approve
    ```

    ```output
    2025-05-31 11:51:46 [ℹ]  will create IAM Open ID Connect provider for cluster "my-source-k8s-cluster" in "us-west-2"
    2025-05-31 11:51:47 [✔]  created IAM Open ID Connect provider for cluster "my-source-k8s-cluster" in "us-west-2"
    ```

1.  Verify that the OIDC creation was successful:

    ```command
    aws eks describe-cluster \
      --name "$EKS_CLUSTER" \
      --region "$AWS_REGION" \
      --query "cluster.identity.oidc.issuer" \
      --output text
    ```

    ```output
    https://oidc.eks.us-west-2.amazonaws.com/id/50167EE12C1795D19075628E119
    ```

1.  Capture the last part of the output string with the OIDC provider ID and store it as an environment variable, for example:

    ```command
    export OIDC_ID=50167EE12C1795D19075628E119
    ```

### Provision EBS CSI Support in the Cluster

The CSI provisioner is a plugin that allows Kubernetes to create and manage storage volumes (e.g. EBS disks) on demand, whenever a `PersistentVolumeClaim` (PVC) is made.

1.  Use `cat` to create a file called `trust-policy.json`:

    ```command
    cat > trust-policy.json <<EOF
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Principal": {
            "Federated": "arn:aws:iam::${ACCOUNT_ID}:oidc-provider/oidc.eks.${AWS_REGION}.amazonaws.com/id/${OIDC_ID}"
          },
          "Action": "sts:AssumeRoleWithWebIdentity",
          "Condition": {
            "StringEquals": {
              "oidc.eks.${AWS_REGION}.amazonaws.com/id/${OIDC_ID}:sub": "system:serviceaccount:kube-system:ebs-csi-controller-sa"
            }
          }
        }
      ]
    }
    EOF
    ```

1.  Create an IAM role for the EBS CSI driver using `trust-policy.json` as the OIDC trust policy:

    ```command
    aws iam create-role \
      --role-name AmazonEKS_EBS_CSI_DriverRole \
      --assume-role-policy-document file://trust-policy.json
    ```

1.  Attach the [`AmazonEBSCSIDriverPolicy`](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEBSCSIDriverPolicy.html) policy to the role:

    ```command
    aws iam attach-role-policy \
      --role-name AmazonEKS_EBS_CSI_DriverRole \
      --policy-arn arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy
    ```

1.  Install the CSI provisioner for EBS volumes:

    ```command
    aws eks create-addon \
      --cluster-name "$EKS_CLUSTER" \
      --addon-name aws-ebs-csi-driver \
      --service-account-role-arn \
        "arn:aws:iam::${ACCOUNT_ID}:role/AmazonEKS_EBS_CSI_DriverRole" \
      --region "$AWS_REGION"
    ```

1.  Enter this command and wait for the EBS CSI driver to become active:

    ```command
    until [[ "$(aws eks describe-addon \
      --cluster-name "$EKS_CLUSTER" \
      --addon-name aws-ebs-csi-driver \
      --region "$AWS_REGION" \
      --query 'addon.status' \
      --output text)" == "ACTIVE" ]]; do
      echo "Waiting for aws-ebs-csi-driver to become ACTIVE..."
      sleep 10
    done
    echo "EBS CSI driver is ACTIVE."
    ```

    ```output
    Waiting for aws-ebs-csi-driver to become ACTIVE...
    Waiting for aws-ebs-csi-driver to become ACTIVE...
    Waiting for aws-ebs-csi-driver to become ACTIVE...
    EBS CSI driver is ACTIVE.
    ```

### Create a `StorageClass`

1.  Use the EBS CSI provisioner to create a [`StorageClass`](https://kubernetes.io/docs/concepts/storage/storage-classes/):

    ```command
    echo '
    apiVersion: storage.k8s.io/v1
    kind: StorageClass
    metadata:
      name: ebs-sc
    provisioner: ebs.csi.aws.com
    volumeBindingMode: WaitForFirstConsumer
    allowVolumeExpansion: true
    reclaimPolicy: Delete' | kubectl apply -f -
    ```

    ```output
    storageclass.storage.k8s.io/ebs-sc created
    ```

### Create an S3 Bucket

1.  Replace {{< placeholder "BUCKET_NAME" >}} with a name of your choice (e.g. `velero-backup-7777`) and add it to your environment variables:

    ```command
    export BUCKET_NAME={{< placeholder "BUCKET_NAME" >}}
    ```

1.  Create the S3 bucket where Velero can store its backups:

    ```command
    aws s3api create-bucket \
      --bucket "$BUCKET_NAME" \
      --region "$AWS_REGION" \
      --create-bucket-configuration LocationConstraint="$AWS_REGION"
    ```

    ```output
    {
        "Location": "http://velero-backup-7777.s3.amazonaws.com/"
    }
    ```

    {{< note >}}
    This full command works in all AWS regions except `us-east-1` (N. Virginia), where including `--create-bucket-configuration` causes an `InvalidLocationConstraint` error:

    ```output
    An error occurred (InvalidLocationConstraint) when calling the CreateBucket operation: The specified location-constraint is not valid
    ```

    If you’re using the `us-east-1` AWS region, run this shortened version of the command instead:

    ```command
    aws s3api create-bucket \
      --bucket "$BUCKET_NAME" \
      --region "$AWS_REGION"
    ```
    {{< /note >}}

1.  Block public access to S3 bucket (only Velero should access it):

    ```command
    aws s3api put-public-access-block \
      --bucket "$BUCKET_NAME" \
      --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
    ```

### Set up IAM Credentials for Velero to Use S3

To give Velero access to the S3 bucket, begin by creating the IAM policy.

1.  Use `cat` to create the Velero S3 access policy in a file called `velero-s3-policy.json`:

    ```command
    cat > velero-s3-policy.json <<EOF
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "ListAndGetBucket",
          "Effect": "Allow",
          "Action": [
            "s3:ListBucket",
            "s3:GetBucketLocation"
          ],
          "Resource": "arn:aws:s3:::$BUCKET_NAME"
        },
        {
          "Sid": "CRUDonObjects",
          "Effect": "Allow",
          "Action": [
            "s3:PutObject",
            "s3:GetObject",
            "s3:DeleteObject"
          ],
          "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
      ]
    }
    EOF
    ```

1.  Create the IAM policy in AWS and capture its Amazon Resource Name (ARN) via `echo`:

    ```
    POLICY_ARN=$(aws iam create-policy \
      --policy-name VeleroS3AccessPolicy \
      --policy-document file://velero-s3-policy.json \
      --query 'Policy.Arn' --output text)
    echo $POLICY_ARN
    ```

    ```output
    arn:aws:iam::431966127852:policy/VeleroS3AccessPolicy
    ```

1.  Create the `velero` user:

    ```command
    aws iam create-user \
      --user-name velero
    ```

    ```output
    {
        "User": {
            "Path": "/",
            "UserName": "velero",
            "UserId": "AIDAWE6V6YHZ6334NZZ3Z",
            "Arn": "arn:aws:iam::431966127852:user/velero",
            "CreateDate": "2025-05-31T07:03:40+00:00"
        }
    }
    ```

1.  Attach the policy:

    ```command
    aws iam attach-user-policy \
      --user-name velero \
      --policy-arn "$POLICY_ARN"
    ```

    The `velero` IAM user now has access to the bucket.

1.  Create an environment variable to define where Velero’s AWS credentials should go:

    ```command
    export CREDENTIALS_FILE=~/aws-credentials-velero
    ```

1.  Generate an access key for the `velero` user and write it to that file:

    ```command
    aws iam create-access-key \
      --user-name velero \
      --query 'AccessKey.[AccessKeyId,SecretAccessKey]' \
      --output text | \
      awk -v OUT="$CREDENTIALS_FILE" '
      {
        print "[default]" > OUT;
        print "aws_access_key_id = "$1 >> OUT;
        print "aws_secret_access_key = "$2 >> OUT;
      }'
    ```

1.  Verify the credentials file was created successfully:

    ```command
    cat "$CREDENTIALS_FILE"
    ```

    ```output
    [default]
    aws_access_key_id = AKIAFAKEACCESSKEY1234
    aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYFAKEKEY
    ```

## Install and Configure Velero on Source Cluster

With the source cluster properly configured with the S3 backup location and credentials file, you can install Velero on the EKS cluster.

1.  Install Velero on the source cluster:

    ```command
    velero install \
      --provider aws \
      --plugins velero/velero-plugin-for-aws:v1.12.2 \
      --bucket "$BUCKET_NAME" \
      --secret-file "$CREDENTIALS_FILE" \
      --backup-location-config region=$AWS_REGION \
      --use-node-agent \
      --use-volume-snapshots=false \
      --default-volumes-to-fs-backup
    ```

    ```output
    CustomResourceDefinition/backuprepositories.velero.io: attempting to create resource
    CustomResourceDefinition/backuprepositories.velero.io: attempting to create resource client
    CustomResourceDefinition/backuprepositories.velero.io: created
    CustomResourceDefinition/backups.velero.io: attempting to create resource
    CustomResourceDefinition/backups.velero.io: attempting to create resource client
    CustomResourceDefinition/backups.velero.io: created
    CustomResourceDefinition/backupstoragelocations.velero.io: attempting to create resource
    CustomResourceDefinition/backupstoragelocations.velero.io: attempting to create resource client
    CustomResourceDefinition/backupstoragelocations.velero.io: created
    CustomResourceDefinition/deletebackuprequests.velero.io: attempting to create resource
    CustomResourceDefinition/deletebackuprequests.velero.io: attempting to create resource client
    CustomResourceDefinition/deletebackuprequests.velero.io: created
    CustomResourceDefinition/downloadrequests.velero.io: attempting to create resource
    CustomResourceDefinition/downloadrequests.velero.io: attempting to create resource client
    CustomResourceDefinition/downloadrequests.velero.io: created
    CustomResourceDefinition/podvolumebackups.velero.io: attempting to create resource
    CustomResourceDefinition/podvolumebackups.velero.io: attempting to create resource client
    CustomResourceDefinition/podvolumebackups.velero.io: created
    CustomResourceDefinition/podvolumerestores.velero.io: attempting to create resource
    CustomResourceDefinition/podvolumerestores.velero.io: attempting to create resource client
    CustomResourceDefinition/podvolumerestores.velero.io: created
    CustomResourceDefinition/restores.velero.io: attempting to create resource
    CustomResourceDefinition/restores.velero.io: attempting to create resource client
    CustomResourceDefinition/restores.velero.io: created
    CustomResourceDefinition/schedules.velero.io: attempting to create resource
    CustomResourceDefinition/schedules.velero.io: attempting to create resource client
    CustomResourceDefinition/schedules.velero.io: created
    CustomResourceDefinition/serverstatusrequests.velero.io: attempting to create resource
    CustomResourceDefinition/serverstatusrequests.velero.io: attempting to create resource client
    CustomResourceDefinition/serverstatusrequests.velero.io: created
    CustomResourceDefinition/volumesnapshotlocations.velero.io: attempting to create resource
    CustomResourceDefinition/volumesnapshotlocations.velero.io: attempting to create resource client
    CustomResourceDefinition/volumesnapshotlocations.velero.io: created
    CustomResourceDefinition/datadownloads.velero.io: attempting to create resource
    CustomResourceDefinition/datadownloads.velero.io: attempting to create resource client
    CustomResourceDefinition/datadownloads.velero.io: created
    CustomResourceDefinition/datauploads.velero.io: attempting to create resource
    CustomResourceDefinition/datauploads.velero.io: attempting to create resource client
    CustomResourceDefinition/datauploads.velero.io: created
    Waiting for resources to be ready in cluster...
    Namespace/velero: attempting to create resource
    Namespace/velero: attempting to create resource client
    Namespace/velero: created
    ClusterRoleBinding/velero: attempting to create resource
    ClusterRoleBinding/velero: attempting to create resource client
    ClusterRoleBinding/velero: created
    ServiceAccount/velero: attempting to create resource
    ServiceAccount/velero: attempting to create resource client
    ServiceAccount/velero: created
    Secret/cloud-credentials: attempting to create resource
    Secret/cloud-credentials: attempting to create resource client
    Secret/cloud-credentials: created
    BackupStorageLocation/default: attempting to create resource
    BackupStorageLocation/default: attempting to create resource client
    BackupStorageLocation/default: created
    Deployment/velero: attempting to create resource
    Deployment/velero: attempting to create resource client
    Deployment/velero: created
    DaemonSet/node-agent: attempting to create resource
    DaemonSet/node-agent: attempting to create resource client
    DaemonSet/node-agent: created
    Velero is installed! ⛵ Use 'kubectl logs deployment/velero -n velero' to view the status.
    ```

    To perform its full range of tasks, Velero creates its own namespace, several CRDs, a deployment, a service, and a node agent.

1.  Verify the Velero installation:

    ```command
    velero version
    ```

    ```output
    Client:
        Version: v1.16.2
        Git commit: -
    Server:
        Version: v1.16.2
    ```

1.  Check the pods in the `velero` namespace:

    ```command
    kubectl get pods -n velero
    ```

    ```output
    NAME                      READY   STATUS    RESTARTS   AGE
    node-agent-chnzw          1/1     Running   0          59s
    node-agent-ffqlg          1/1     Running   0          59s
    velero-6f4546949d-kjtnv   1/1     Running   0          59s
    ```

1.  Verify the backup location configured for Velero:

    ```command
    velero backup-location get
    ```

    ```output
    NAME      PROVIDER   BUCKET/PREFIX        PHASE       LAST VALIDATED                  ACCESS MODE   DEFAULT
    default   aws        velero-backup-7777   Available   2025-05-31 10:12:12 +0300 IDT   ReadWrite     true
    ```

## Create a PersistentVolumeClaim in Source Cluster

In Kubernetes, the PersistentVolumeClaim (PVC) is the mechanism for creating persistent volumes that can be mounted to pods in the cluster.

1.  Create the PVC in the source cluster:

    ```command
    echo '
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: the-pvc
    spec:
      accessModes:
        - ReadWriteOnce
      storageClassName: ebs-sc
      resources:
        requests:
          storage: 1Gi
    ' | kubectl -n default apply -f -
    ```

    Note that this command uses the `StorageClass` named `ebs-sc`, which was created earlier.

    ```output
    persistentvolumeclaim/the-pvc created
    ```

1.  Verify that the PVC was created successfully:

    ```command
    kubectl get pvc -n default
    ```

    The status remains `Pending` until the first consumer uses it:

    ```output
    NAME      STATUS    VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   VOLUMEATTRIBUTESCLASS   AGE
    the-pvc   Pending                                      ebs-sc         <unset>                 9s
    ```

## Run a Pod to Use the PVC and Write Data

When you mount the PVC in a pod, Kubernetes dynamically provisions a matching PersistentVolume (backed by AWS EBS in this example).

1.  Run a pod to mount the PVC-backed volume:

    ```command
    kubectl run the-pod \
      --image=bash:latest \
      --restart=Never \
      -it \
      --overrides='
    {
      "apiVersion": "v1",
      "spec": {
        "volumes": [
          {
            "name": "the-vol",
            "persistentVolumeClaim": {
              "claimName": "the-pvc"
            }
          }
        ],
        "containers": [
          {
            "name": "the-container",
            "image": "bash:latest",
            "command": ["bash"],
            "stdin": true,
            "tty": true,
            "volumeMounts": [
              {
                "mountPath": "/data",
                "name": "the-vol"
              }
            ]
          }
        ]
      }
    }' \
      -- bash
    ```

1.  From the open bash shell, write sample data into the volume:

    ```command {title="bash Shell"}
    echo "Some data" > /data/some-data.txt
    cat /data/some-data.txt
    ```

    ```output
    Some data
    ```

1.  Do **not** exit this shell. Keeping this shell alive ensures the Pod stays in the `Running` state so that Velero can snapshot its volume.

## Create a Velero Backup, Then Verify

1.  Open a **new terminal** so you can leave the Pod’s shell running uninterrupted.

1.  In that new terminal, use Velero to create a backup:

    ```command {title="New Terminal"}
    velero backup create test-backup \
      --include-namespaces default \
      --wait
    ```

    ```output
    Backup request "test-backup" submitted successfully.
    Waiting for backup to complete. You may safely press ctrl-c to stop waiting - your backup will continue in the background.
    .............................................................
    Backup completed with status: Completed. You may check for more information using the commands `velero backup describe test-backup` and `velero backup logs test-backup`.
    ```

1.  Once the backup process has completed, use the `backup describe` command to confirm a successful backup:

    ```command {title="New Terminal"}
    velero backup describe test-backup
    ```

    ```output
    Name:         test-backup
    Namespace:    velero
    Labels:       velero.io/storage-location=default
    Annotations:  velero.io/resource-timeout=10m0s
                  velero.io/source-cluster-k8s-gitversion=v1.32.5-eks-5d4a308
                  velero.io/source-cluster-k8s-major-version=1
                  velero.io/source-cluster-k8s-minor-version=32

    Phase:  Completed


    Namespaces:
      Included:  default
      Excluded:  <none>

    Resources:
      Included:        *
      Excluded:        <none>
      Cluster-scoped:  auto

    Label selector:  <none>

    Or label selector:  <none>

    Storage Location:  default

    Velero-Native Snapshot PVs:  auto
    Snapshot Move Data:          false
    Data Mover:                  velero

    TTL:  720h0m0s

    CSISnapshotTimeout:    10m0s
    ItemOperationTimeout:  4h0m0s

    Hooks:  <none>

    Backup Format Version:  1.1.0

    Started:    2025-07-29 11:16:50 -0400 EDT
    Completed:  2025-07-29 11:16:56 -0400 EDT

    Expiration:  2025-08-28 11:16:50 -0400 EDT

    Total items to be backed up:  16
    Items backed up:              16

    Backup Volumes:
      Velero-Native Snapshots: <none included>

      CSI Snapshots: <none included>

      Pod Volume Backups - kopia (specify --details for more information):
        Completed:  1

    HooksAttempted:  0
    HooksFailed:     0
    ```

    The critical information to verify is the Kopia item for pod volume backups toward the end of the output. Note in the above example that it says `Completed: 1`. This verifies the presence of backups.

1.  Close the new terminal window and return to the original with the still-running bash shell.

1.  Exit the bash shell to terminate the Pod and return to your regular terminal prompt, where your environment variables are still in place for the next steps:

    ```command {title="bash Shell"}
    exit
    ```

## Verify Backup in S3

1.  List the contents of `test-backup` to verify that the backup data made its way to the configured S3 bucket:

    ```command
    aws s3 ls s3://$BUCKET_NAME/backups/test-backup/
    ```

    The `velero-backup.json`, `test-backup.tar.gz`, `test-backup-podvolumebackups.json.gz`, and `test-backup-resource-list.json.gz` files confirm that metadata and PV data were uploaded:

    ```output
    2025-05-31 21:45:34         29 test-backup-csi-volumesnapshotclasses.json.gz
    2025-05-31 21:45:33         29 test-backup-csi-volumesnapshotcontents.json.gz
    2025-05-31 21:45:34         29 test-backup-csi-volumesnapshots.json.gz
    2025-05-31 21:45:33         27 test-backup-itemoperations.json.gz
    2025-05-31 21:45:33      23733 test-backup-logs.gz
    2025-05-31 21:45:34       2481 test-backup-podvolumebackups.json.gz
    2025-05-31 21:45:34       3022 test-backup-resource-list.json.gz
    2025-05-31 21:45:34         49 test-backup-results.gz
    2025-05-31 21:45:33        922 test-backup-volumeinfo.json.gz
    2025-05-31 21:45:34         29 test-backup-volumesnapshots.json.gz
    2025-05-31 21:45:33     138043 test-backup.tar.gz
    2025-05-31 21:45:34       2981 velero-backup.json
    ```

## Provision LKE Cluster

With the persistent volume on your source cluster backed up with Velero, it's time to provision your destination cluster on Akamai Cloud.

While there are several ways to create a Kubernetes cluster on Akamai Cloud, this guide uses the Linode CLI to provision resources. See the [LKE documentation](https://techdocs.akamai.com/cloud-computing/docs/create-a-cluster) for instructions on how to provision a cluster using Cloud Manager.

1.  Use the Linode CLI (`linode-cli`) to list available Kubernetes versions:

    ```command
    linode-cli lke versions-list
    ```

    ```output
    ┌──────┐
    │ id   │
    ├──────┤
    │ 1.33 │
    ├──────┤
    │ 1.32 │
    └──────┘
    ```

    Unless specific requirements dictate otherwise, it’s generally recommended to provision the latest version of Kubernetes.

### Create a Cluster

Determine the type of Linode to provision. The examples in this guide use the `g6-standard-2` Linode, which features two CPU cores and 4 GB of memory.

2.  Create an LKE cluster labeled `velero-to-lke` using the `g6-standard-2` Linode:

    ```command
    linode-cli lke cluster-create \
      --label velero-to-lke \
      --k8s_version 1.33 \
      --region us-mia \
      --node_pools '[{
        "type": "g6-standard-2",
        "count": 1,
        "autoscaler": {
          "enabled": true,
          "min": 1,
          "max": 3
        }
      }]'
    ```

    ```output
    ┌────────┬───────────────┬────────┬─────────────┬───────────────────────────────┬──────┐
    │ id     │ label         │ region │ k8s_version │ control_plane.high_availabil… │ tier │
    ├────────┼───────────────┼────────┼─────────────┼───────────────────────────────┼──────┤
    │ 463649 │ velero-to-lke │ us-mia │ 1.33        │ False                         │      │
    └────────┴───────────────┴────────┴─────────────┴───────────────────────────────┴──────┘
    ```

### Access the Cluster

To access your cluster, fetch the cluster credentials as a `kubeconfig` file.

3.  Retrieve the cluster’s ID and set an environment variable:

    ```command
    CLUSTER_ID=$(linode-cli lke clusters-list --json | \
      jq -r '.[] | select(.label == "velero-to-lke") | .id')
    ```

1.  Retrieve the `kubeconfig` file and save it to `~/.kube/lke-config`:

    ```command
    linode-cli lke kubeconfig-view \
      --json "$CLUSTER_ID" \
      | jq -r '.[0].kubeconfig' \
      | base64 --decode > ~/.kube/lke-config
    ```

1.  Use `kubectl` and specify the file to access your cluster:

    ```command
    kubectl get nodes --kubeconfig ~/.kube/lke-config
    ```

    ```output
    NAME                            STATUS   ROLES    AGE     VERSION
    lke463649-678334-401dde8e0000   Ready    <none>   7m27s   v1.33.0
    ```

{{< note >}}
Your cluster’s `kubeconfig` can also be [downloaded via the Cloud Manager](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-lke-linode-kubernetes-engine#access-and-download-your-kubeconfig).
{{< /note >}}

## Install Velero in LKE

If you are working in a different terminal session, ensure you have the environment variables for `BUCKET_NAME`, `AWS_REGION`, and `CREDENTIALS_FILE` with values identical to those used earlier in this guide.

1.  Install Velero in your LKE cluster:

    ```command
    velero install \
      --kubeconfig ~/.kube/lke-config \
      --provider aws \
      --plugins velero/velero-plugin-for-aws:v1.12.1 \
      --bucket "$BUCKET_NAME" \
      --secret-file "$CREDENTIALS_FILE" \
      --backup-location-config region=$AWS_REGION \
      --use-node-agent \
      --use-volume-snapshots=false \
      --default-volumes-to-fs-backup
    ```

    ```output
    CustomResourceDefinition/backuprepositories.velero.io: attempting to create resource
    CustomResourceDefinition/backuprepositories.velero.io: attempting to create resource client
    CustomResourceDefinition/backuprepositories.velero.io: created
    CustomResourceDefinition/backups.velero.io: attempting to create resource
    CustomResourceDefinition/backups.velero.io: attempting to create resource client
    CustomResourceDefinition/backups.velero.io: created
    CustomResourceDefinition/backupstoragelocations.velero.io: attempting to create resource
    CustomResourceDefinition/backupstoragelocations.velero.io: attempting to create resource client
    CustomResourceDefinition/backupstoragelocations.velero.io: created
    CustomResourceDefinition/deletebackuprequests.velero.io: attempting to create resource
    CustomResourceDefinition/deletebackuprequests.velero.io: attempting to create resource client
    CustomResourceDefinition/deletebackuprequests.velero.io: created
    CustomResourceDefinition/downloadrequests.velero.io: attempting to create resource
    CustomResourceDefinition/downloadrequests.velero.io: attempting to create resource client
    CustomResourceDefinition/downloadrequests.velero.io: created
    CustomResourceDefinition/podvolumebackups.velero.io: attempting to create resource
    CustomResourceDefinition/podvolumebackups.velero.io: attempting to create resource client
    CustomResourceDefinition/podvolumebackups.velero.io: created
    CustomResourceDefinition/podvolumerestores.velero.io: attempting to create resource
    CustomResourceDefinition/podvolumerestores.velero.io: attempting to create resource client
    CustomResourceDefinition/podvolumerestores.velero.io: created
    CustomResourceDefinition/restores.velero.io: attempting to create resource
    CustomResourceDefinition/restores.velero.io: attempting to create resource client
    CustomResourceDefinition/restores.velero.io: created
    CustomResourceDefinition/schedules.velero.io: attempting to create resource
    CustomResourceDefinition/schedules.velero.io: attempting to create resource client
    CustomResourceDefinition/schedules.velero.io: created
    CustomResourceDefinition/serverstatusrequests.velero.io: attempting to create resource
    CustomResourceDefinition/serverstatusrequests.velero.io: attempting to create resource client
    CustomResourceDefinition/serverstatusrequests.velero.io: created
    CustomResourceDefinition/volumesnapshotlocations.velero.io: attempting to create resource
    CustomResourceDefinition/volumesnapshotlocations.velero.io: attempting to create resource client
    CustomResourceDefinition/volumesnapshotlocations.velero.io: created
    CustomResourceDefinition/datadownloads.velero.io: attempting to create resource
    CustomResourceDefinition/datadownloads.velero.io: attempting to create resource client
    CustomResourceDefinition/datadownloads.velero.io: created
    CustomResourceDefinition/datauploads.velero.io: attempting to create resource
    CustomResourceDefinition/datauploads.velero.io: attempting to create resource client
    CustomResourceDefinition/datauploads.velero.io: created
    Waiting for resources to be ready in cluster...
    Namespace/velero: attempting to create resource
    Namespace/velero: attempting to create resource client
    Namespace/velero: created
    ClusterRoleBinding/velero: attempting to create resource
    ClusterRoleBinding/velero: attempting to create resource client
    ClusterRoleBinding/velero: created
    ServiceAccount/velero: attempting to create resource
    ServiceAccount/velero: attempting to create resource client
    ServiceAccount/velero: created
    Secret/cloud-credentials: attempting to create resource
    Secret/cloud-credentials: attempting to create resource client
    Secret/cloud-credentials: created
    BackupStorageLocation/default: attempting to create resource
    BackupStorageLocation/default: attempting to create resource client
    BackupStorageLocation/default: created
    Deployment/velero: attempting to create resource
    Deployment/velero: attempting to create resource client
    Deployment/velero: created
    DaemonSet/node-agent: attempting to create resource
    DaemonSet/node-agent: attempting to create resource client
    DaemonSet/node-agent: created
    Velero is installed! ⛵ Use 'kubectl logs deployment/velero -n velero' to view the status.
    ```

1.  Verify the Velero installation:

    ```command
    kubectl logs deployment/velero \
      -n velero \
      --kubeconfig ~/.kube/lke-config \
      | grep 'BackupStorageLocations is valid'
    ```

    ```output
    Defaulted container "velero" out of: velero, velero-velero-plugin-for-aws (init)
    time="2025-05-31T20:52:50Z" level=info msg="BackupStorageLocations is valid, marking as available" backup-storage-location=velero/default controller=backup-storage-location logSource="pkg/controller/backup_storage_location_controller.go:128"
    ```

1.  With the backup storage location properly configured, run the following command to retrieve information about existing backups:

    ```command
    velero backup get --kubeconfig ~/.kube/lke-config
    ```

    ```output
    NAME          STATUS      ERRORS   WARNINGS   CREATED                         EXPIRES   STORAGE LOCATION   SELECTOR
    test-backup   Completed   0        0          2025-05-31 21:44:31 +0300 IDT   29d       default            <none>
    ```

## Restore the Backup in LKE

1.  Restore your source cluster backup into your destination LKE cluster:

    ```command
    velero restore create test-restore \
      --from-backup test-backup \
      --kubeconfig ~/.kube/lke-config
    ```

    ```output
    Restore request "test-restore" submitted successfully.
    Run `velero restore describe test-restore` or `velero restore logs test-restore` for more details.
    ```

1.  Check the restore status:

    ```command
    velero restore describe test-restore --kubeconfig ~/.kube/lke-config
    ```

    At this point, the restore should appear in the `InProgress` phase and cannot complete until the post-restore adjustments are made:

    ```output
    Name:         test-restore
    Namespace:    velero
    Labels:       <none>
    Annotations:  <none>

    Phase:                                 InProgress
    Estimated total items to be restored:  8
    Items restored so far:                 8

    Started:    2025-08-08 10:40:13 -0400 EDT
    Completed:  <n/a>

    Backup:  test-backup

    Namespaces:
      Included:  all namespaces found in the backup
      Excluded:  <none>

    Resources:
      Included:        *
      Excluded:        nodes, events, events.events.k8s.io, backups.velero.io, restores.velero.io, resticrepositories.velero.io, csinodes.storage.k8s.io, volumeattachments.storage.k8s.io, backuprepositories.velero.io
      Cluster-scoped:  auto

    Namespace mappings:  <none>

    Label selector:  <none>

    Or label selector:  <none>

    Restore PVs:  auto

    kopia Restores (specify --details for more information):
      New:  1

    Existing Resource Policy:   <none>
    ItemOperationTimeout:       4h0m0s

    Preserve Service NodePorts:  auto

    Uploader config:

    ```

## Post-Restore Adjustments

Because you are transitioning from one Kubernetes provider to another, you may need to make some final post-restore adjustments. For example, if your destination is LKE, you need to update your PVC to use the Linode storage class.

1.  Review the Linode CSI drivers:

    ```command
    kubectl get csidrivers --kubeconfig ~/.kube/lke-config
    ```

    ```output
    NAME                      ATTACHREQUIRED   PODINFOONMOUNT   STORAGECAPACITY   TOKENREQUESTS   REQUIRESREPUBLISH   MODES        AGE
    linodebs.csi.linode.com   true             true             false             <unset>         false               Persistent   69m
    ```

1.  Review the available storage classes:

    ```command
    kubectl get storageclass --kubeconfig ~/.kube/lke-config
    ```

    ```output
    NAME                                    PROVISIONER               RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
    linode-block-storage                    linodebs.csi.linode.com   Delete          Immediate              true                   7h9m
    linode-block-storage-retain (default)   linodebs.csi.linode.com   Retain          Immediate              true                   7h9m
    ```

    Use the default `linode-block-storage-retain` storage class. However, you must first delete the restored PVC and recreate it with the new storage class.

1.  Delete the restored PVC:

    ```command
    kubectl delete pvc the-pvc --kubeconfig ~/.kube/lke-config
    ```

    ```output
    persistentvolumeclaim "the-pvc" deleted
    ```

1.  Recreate the PVC with the new storage class:

    ```command
    echo '
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: the-pvc
    spec:
      accessModes:
        - ReadWriteOnce
      resources:
        requests:
          storage: 1Gi
    ' | kubectl apply -f - --kubeconfig ~/.kube/lke-config
    ```

    ```output
    persistentvolumeclaim/the-pvc created
    ```

1.  The new PVC is bound to a new persistent volume. To confirm this, run the following command to view PVC, PV, and pod information:

    ```command
    kubectl get pvc,pv,pod --kubeconfig ~/.kube/lke-config
    ```

    The pod is in an `Init` state as it is trying to bind to the previous (and now invalid) PVC:

    ```output
    NAME                            STATUS   VOLUME                 CAPACITY   ACCESS MODES   STORAGECLASS                  VOLUMEATTRIBUTESCLASS   AGE
    persistentvolumeclaim/the-pvc   Bound    pvc-711d050fae7641ee   10Gi       RWO            linode-block-storage-retain   <unset>                 2m12s

    NAME                                    CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM             STORAGECLASS                  VOLUMEATTRIBUTESCLASS   REASON   AGE
    persistentvolume/pvc-711d050fae7641ee   10Gi       RWO            Retain           Bound    default/the-pvc   linode-block-storage-retain   <unset>                          2m9s

    NAME          READY   STATUS     RESTARTS   AGE
    pod/the-pod   0/1     Init:0/1   0          6h38m
    ```

1.  Delete the stuck pod:

    ```command
    kubectl delete pod the-pod --kubeconfig ~/.kube/lke-config
    ```

    The output may appear to freeze for a moment while executing this command:

    ```output
    pod "the-pod" deleted
    ```

1.  Remove the finalizers on the stuck restore:

    ```command
    kubectl patch restore test-restore \
      --patch '{"metadata":{"finalizers":[]}}' \
      --type merge \
      -n velero \
      --kubeconfig ~/.kube/lke-config
    ```

    ```output
    restore.velero.io/test-restore patched
    ```

1.  Delete the now un-stuck restore:

    ```command
    kubectl delete restore test-restore \
      -n velero \
      --kubeconfig ~/.kube/lke-config
    ```

    ```output
    restore.velero.io "test-restore" deleted
    ```

1.  Re-run the Velero restore:

    ```command
    velero restore create test-restore \
      --from-backup test-backup \
      --kubeconfig ~/.kube/lke-config
    ```

    ```output
    Restore request "test-restore" submitted successfully.
    Run `velero restore describe test-restore` or `velero restore logs test-restore` for more details.
    ```

    {{< note >}}
    Velero can detect that the PVC (`the-pvc`) exists and does not overwrite it unless explicitly requested to do so.
    {{< /note >}}

1.  Verify that your pod was restored:

    ```command
    kubectl get pod the-pod --kubeconfig ~/.kube/lke-config
    ```

    The pod status should now be `Running`:

    ```output
    NAME      READY   STATUS    RESTARTS   AGE
    the-pod   1/1     Running   0          118s
    ```

1.  Run the pod to verify that the sample data was written:

    ```command
    kubectl exec the-pod --kubeconfig ~/.kube/lke-config -- cat /data/some-data.txt
    ```

    ```output
    Defaulted container "the-container" out of: the-container, restore-wait (init)
    Some data
    ```

You have successfully performed an end-to-end backup and restore of a Kubernetes cluster from AWS EKS to LKE. This included persistent data migration across two different cloud object storage systems.

## Final Considerations

Keep these points in mind as you plan and execute the migration.

### Persistent Data Movements Modes

Velero supports two approaches:

-   **[CSI snapshots](https://velero.io/docs/main/csi/)**: Recommended when backing-up and restoring into a cluster of the same Kubernetes provider. This takes advantage of the Kubernetes CSI volume snapshots API and only requires that the same CSI driver is installed in the source and destination clusters.
-   **File-system backups via Kopia**: Used in this walkthrough. This is the best option when the source and destination Kubernetes providers are incompatible.

### ConfigMaps, Secrets, and Certificates

Velero can restore any Kubernetes Secret resource. However, Secrets and certificates are often tied to the cloud provider. If the Secret is used to access AWS services that were replaced by equivalent LKE services, then it would be unnecessary to migrate them. The same applies to ConfigMaps that may contain provider-specific configuration.

### Downtime Planning

Velero doesn't offer zero-downtime migrations. Expect to block all or most traffic to the cluster during the backup/restore. Restoring from a stale backup means possible data loss or back-filling gaps in data later.

When downtime is unavoidable, it's safer to schedule it. Perform a backup and immediately restore it to the new cluster.

### Other Use Case: Backups for Multi-Cloud Architectures

While this guide focuses on migration, Velero also supports multi-cloud strategies. By configuring Velero with backup locations across multiple cloud providers, you can:

-   Back up workloads from one cluster and restore them in a different cloud for resilience.
-   Enable workload portability between environments for hybrid deployments or to meet data redundancy requirements for compliance reasons.