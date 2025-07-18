---
slug: migrating-kubernetes-workloads-to-linode-kubernetes-engine-lke-using-velero
title: "Migrating Kubernetes Workloads to Linode Kubernetes Engine (LKE) Using Velero"
description: "Two to three sentences describing your guide."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2025-07-18
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

Migrating a Kubernetes cluster has several use cases, including disaster recovery (for example, when your primary Kubernetes provider suffers an incident) or the need to change providers for feature or cost reasons.

Performing this migration safely requires taking a complete snapshot of all the resources in the source cluster and then restoring that snapshot on the target cluster. After snapshot restoration, all external traffic is pointed to the new cluster, and the old cluster (if it can be accessed) is shut down.

Deploying Kubernetes resources can be straightforward if you have a solid CI/CD pipeline in place. However, there may be reasons why you can't simply point your CI/CD pipeline to the new cluster to handle the migration of all resources, including:

-   Your CI/CD pipeline itself may be running in the source cluster and could be inaccessible.
-   Some resources—like secrets—are provisioned using different processes, separate from CI/CD.
-   Your persistent data volumes contain important data that can't be copied over using your CI/CD pipeline.

In scenarios such as these, DevOps engineers may depend on Velero.

### What Is Velero?

[**Velero**](https://velero.io/) is an open source, Kubernetes-native tool for backing up and restoring Kubernetes resources and persistent volumes. It supports backup of core resources, namespaces, deployments, services, ConfigMaps, Secrets, and customer resource definitions (CRDs). It integrates with different storage backends—such AWS S3 or Linode Object Storage—for storing and restoring backups.

This guide will walk through the process of using Velero to migrate a Kubernetes cluster with persistent volumes to Linode Kubernetes Engine (LKE). The focus of the guide will be on backing up and restoring a persistent data volume. For other aspects—such as adapting load balancing and DNS switching after the restore—refer to the Akamai Cloud guides on migrating to LKE (from [AWS EKS](https://www.linode.com/docs/guides/migrating-from-aws-eks-to-linode-kubernetes-engine-lke/), [Google GKE](https://www.linode.com/docs/guides/migrating-from-google-gke-to-linode-kubernetes-engine-lke/), [Azure AKS](https://www.linode.com/docs/guides/migrating-from-azure-aks-to-linode-kubernetes-engine-lke/), or [Oracle OKE](https://www.linode.com/docs/guides/migrating-from-oracle-kubernetes-engine-to-linode-kubernetes-engine-lke/)).

Although what's shown in this guide will start with an AWS EKS cluster as an example, the same process can apply to most Kubernetes providers.

## Before You Begin

1.  Follow Akamai's [Getting Started](https://techdocs.akamai.com/cloud-computing/docs/getting-started) guide, and create an Akamai Cloud account if you do not already have one.
1.  Create a personal access token using the instructions in the [Manage personal access tokens](https://techdocs.akamai.com/cloud-computing/docs/manage-personal-access-tokens) guide.
1.  Install the Linode CLI using the instructions in the [Install and configure the CLI](https://techdocs.akamai.com/cloud-computing/docs/install-and-configure-the-cli) guide.
1.  Follow the steps in the _*Install* `*kubectl*`_ section of the [Getting started with LKE](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-lke-linode-kubernetes-engine#install-kubectl) guide to install and configure `kubectl`.
1.  If migrating a cluster from AWS, ensure that you have access to your AWS account with sufficient permissions to work with EKS clusters.
1.  Install and configure the [AWS CLI](https://aws.amazon.com/cli/) and [`eksctl`](https://eksctl.io/). The command line tooling you use may vary if migrating a cluster from another provider.
1.  Install `[jq](https://www.linode.com/docs/guides/migrating-from-aws-eks-to-linode-kubernetes-engine-lke/docs/guides/using-jq-to-process-json-on-the-command-line/#install-jq-with-package-managers)`.
1.  Install the `[velero](https://velero.io/docs/v1.3.0/velero-install/)` [CLI](https://velero.io/docs/v1.3.0/velero-install/).

## Downtime During the Migration

The migration process shown in this guide will involve some downtime. Keep in mind the following considerations during the migration:

-   Double capacity might be required, so be aware of your usage quotas and limits.
-   Both clusters (if available) might run concurrently for a period of time.
-   Data will need to be read from and written to both clusters to keep them in sync. Appropriate read/write permissions must be in place.
-   Incrementally by workloads, access to the source cluster will become read-only and eventually removed.
-   Unified observability across both clusters may be beneficial.
-   If problems occur on the new cluster, you will need the ability to roll back any workload.

## Prepare the Source Cluster for Velero Usage

The starting point for this guide is an AWS EKS cluster that has already been provisioned in AWS’s `us-west-2` region. Before installing and using Velero, take the following steps to prepare your source cluster.

1.  **Associate the EKS cluster with an OIDC provider**: Enables Kubernetes service accounts to securely assume AWS IAM roles.
1.  **Provision EBS CSI support in the cluster**: Allows Kubernetes to dynamically provision and manage EBS volumes.
1.  **Create a `StorageClass` using the EBS CSI provisioner**: Defines the provisioning behavior for EBS-backed volumes when persistent volume claims are made in the cluster.
1.  **Create an S3 bucket for storing Velero backups**: Sets up the location for Velero to save and retrieve backup data and snapshots.
1.  **Set up IAM credentials for Velero to use S3**: Grants Velero the necessary permissions to access the S3 bucket for backup and restore operations.

With these pieces in place, you'll be ready to install Velero with the necessary permissions and infrastructure to back up workloads—including persistent volume data—from the EKS cluster to S3.

### Associate the Cluster with an OIDC Provider

An OIDC provider is required to enable [IAM roles for service accounts (IRSA)](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html), which is the recommended way for Velero to authenticate to AWS services like S3.

```command {title="Set initial environment variables for terminal session"}
export AWS_PROFILE='INSERT YOUR AWS PROFILE'
export EKS_CLUSTER="my-source-k8s-cluster"
export REGION="us-west-2"
export ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
```

[Create the OIDC provider](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html) with the following command:

```command {title="Create OIDC provider"}
eksctl utils associate-iam-oidc-provider \
  --cluster "$EKS_CLUSTER" \
  --region "$REGION" \
  --approve
```

```output
2025-05-31 11:51:46 [ℹ]  will create IAM Open ID Connect provider for cluster "my-source-k8s-cluster" in "us-west-2"
2025-05-31 11:51:47 [✔]  created IAM Open ID Connect provider for cluster "my-source-k8s-cluster" in "us-west-2"
```

Verify that OIDC creation was successful.

```command {title="Verify successful OIDC creation"}
aws eks describe-cluster \
  --name "$EKS_CLUSTER" \
  --region "$REGION" \
  --query "cluster.identity.oidc.issuer" \
  --output text
```

```output
https://oidc.eks.us-west-2.amazonaws.com/id/50167EE12C1795D19075628E119
```

Capture the last part of the output string with the OIDC provider ID and store it as an environment variable:

```command {title="Store OIDC provider id as environment variable"}
export OIDC_ID=50167EE12C1795D19075628E119
```

### Provision EBS CSI Support in the Cluster

The CSI provisioner is a plugin that allows Kubernetes to create and manage storage volumes—like EBS disks—on demand, whenever a `PersistentVolumeClaim` (PVC) is made. Provisioning EBS CSI support requires a few steps.

Create an IAM role for the EBS CSI driver with the trust policy for OIDC.

```command {title="Create IAM role for EBS CSI driver"}
aws iam create-role \
  --role-name AmazonEKS_EBS_CSI_DriverRole \
  --assume-role-policy-document "{
    \"Version\": \"2012-10-17\",
    \"Statement\": [
      {
        \"Effect\": \"Allow\",
        \"Principal\": {
          \"Federated\": \"arn:aws:iam::${ACCOUNT_ID}:oidc-provider/oidc.eks.${REGION}.amazonaws.com/id/${OIDC_ID}\"
        },
        \"Action\": \"sts:AssumeRoleWithWebIdentity\",
        \"Condition\": {
          \"StringEquals\": {
            \"oidc.eks.${REGION}.amazonaws.com/id/${OIDC_ID}:sub\": \"system:serviceaccount:kube-system:ebs-csi-controller-sa\"
          }
        }
      }
    ]
  }"
```

Attach the `[AmazonEBSCSIDriverPolicy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEBSCSIDriverPolicy.html)` policy to the role.

```command {title="Attach policy to EBS CSI Driver role"}
aws iam attach-role-policy \
  --role-name AmazonEKS_EBS_CSI_DriverRole \
  --policy-arn \
    arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy
```

Install the CSI provisioner for EBS volumes.

```command {title="Install CSI provisioner for EBS"}
aws eks create-addon \
  --cluster-name "$EKS_CLUSTER" \
  --addon-name aws-ebs-csi-driver \
  --service-account-role-arn
    "arn:aws:iam::${ACCOUNT_ID}:role/AmazonEKS_EBS_CSI_DriverRole" \
  --region "$REGION"
```

Wait for the EBS CSI driver to become active.

```command {title="Wait for EBS CSI driver to become active"}
until [[ "$(aws eks describe-addon \
  --cluster-name "$EKS_CLUSTER" \
  --addon-name aws-ebs-csi-driver \
  --region "$REGION" \
  --query 'addon.status' \
  --output text)" \= "ACTIVE" ]]; do
  echo "Waiting for aws-ebs-csi-driver to become ACTIVE…"
  sleep 10
done
echo "EBS CSI driver is ACTIVE."
```

```output
Waiting for aws-ebs-csi-driver to become ACTIVE…
Waiting for aws-ebs-csi-driver to become ACTIVE…
Waiting for aws-ebs-csi-driver to become ACTIVE…
EBS CSI driver is ACTIVE.
```

### Create a `StorageClass`

Use the EBS CSI provisioner to create a `[StorageClass](https://kubernetes.io/docs/concepts/storage/storage-classes/)`.

```command {title="Create a StorageClass"}
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

### Create an S3 Bucket

Create the S3 bucket where Velero can store its backups.

```command {title="Add the BUCKET_NAME environment variable to the terminal session"}
export BUCKET_NAME=velero-backup-7777
```

```command {title="Create S3 bucket"}
aws s3api create-bucket \
  --bucket "$BUCKET_NAME" \
  --region "$REGION" \
  --create-bucket-configuration LocationConstraint="$REGION"
```

```output
{
    "Location": "http://velero-backup-7777.s3.amazonaws.com/"
}
```

The bucket should not be public. Only Velero should access it.

```command {title="Block public access to S3 bucket"}
aws s3api put-public-access-block \
  --bucket "$BUCKET_NAME" \
  --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

### Set up IAM Credentials for Velero to Use S3

To give Velero access to the S3 bucket, begin by creating the IAM policy.

```command {title="Create IAM policy for Velero to access S3, then echo policy ARN"}
POLICY_ARN=$(aws iam create-policy \
  --policy-name VeleroS3AccessPolicy \
  --policy-document "{
    \"Version\": \"2012-10-17\",
    \"Statement\": [
      {
        \"Sid\": \"ListAndGetBucket\",
        \"Effect\": \"Allow\",
        \"Action\": [
          \"s3:ListBucket\",
          \"s3:GetBucketLocation\"
        ],
        \"Resource\": \"arn:aws:s3:::$BUCKET_NAME\"
      },
      {
        \"Sid\": \"CRUDonObjects\",
        \"Effect\": \"Allow\",
        \"Action\": [
          \"s3:PutObject\",
          \"s3:GetObject\",
          \"s3:DeleteObject\"
        ],
        \"Resource\": \"arn:aws:s3:::$BUCKET_NAME/*\"
      }
    ]
  }" \
  --query 'Policy.Arn' --output text) echo $POLICY_ARN
```

```output
arn:aws:iam::431966127852:policy/VeleroS3AccessPolicy
```

Create the Velero user and attach the policy.

```command {title="Create Velero user and attach policy"}
aws iam create-user \
  --user-name velero

aws iam attach-user-policy \
  --user-name velero \
  --policy-arn "$POLICY_ARN"
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

The `velero` IAM user now has access to the bucket. Create a credentials file for Velero to use.

```command {title="Create credentials file"}
CREDENTIALS_FILE=\~/aws-credentials-velero

aws iam create-access-key \
  --user-name velero
  --query 'AccessKey.[AccessKeyId,SecretAccessKey]' \
  --output text | \
  awk -v OUT="$CREDENTIALS_FILE" '
  {
    print "[default]" > OUT;
    print "aws_access_key_id = "$1 >> OUT;
    print "aws_secret_access_key = "$2 >> OUT;
  }'
```

Verify the credentials file was created successfully.

## Install and Configure Velero on Source Cluster

With the source cluster properly prepared, you can install Velero on the EKS cluster, configured with the S3 backup location and credentials file that authorizes access to the bucket.

```command {title="Install Velero on source cluster"}
velero install \
  --provider aws \
  --plugins velero/velero-plugin-for-aws:v1.12.0 \
  --bucket "$BUCKET_NAME" \
  --secret-file $CREDENTIALS_FILE \
  --backup-location-config region=$REGION \
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

To perform its full range of tasks, Velero creates its own namespace, several CRDs, a deployment, a service, and a node agent. Verify the Velero installation.

```command {title="Check Velero version"}
velero version
```

```output
Client:
	Version: v1.16.1
	Git commit: -
Server:
    Version: v1.16.1
```

Check the pods in the `velero` namespace.

```command {title="Get pods in Velero namespace"}
kubectl get pods -n velero
```

```output
NAME                      READY   STATUS    RESTARTS   AGE
node-agent-chnzw          1/1     Running   0          59s
node-agent-ffqlg          1/1     Running   0          59s
velero-6f4546949d-kjtnv   1/1     Running   0          59s
```

Verify the backup location configured for Velero.

```command {title="Get backup location for Velero"}
velero backup-location get
```

```output
NAME      PROVIDER   BUCKET/PREFIX        PHASE       LAST VALIDATED                  ACCESS MODE   DEFAULT
default   aws        velero-backup-7777   Available   2025-05-31 10:12:12 +0300 IDT   ReadWrite     true
```

## Create a PersistentVolumeClaim in Source Cluster

In Kubernetes, the PersistentVolumeClaim (PVC) is the mechanism for creating persistent volumes that can be mounted to pods in the cluster. Create the PVC in the source cluster.

```command {title="Create PersistentVolumeClaim"}
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
      storage: 1Mi
' | kubectl -n default apply -f -
```

Note that this command uses the `StorageClass` named `ebs-sc`, which was created earlier.

```output
persistentvolumeclaim/the-pvc created
```

Verify the PVC was created successfully.

```command {title="Get PVC"}
kubectl get pvc -n default
```

```output
NAME      STATUS    VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   VOLUMEATTRIBUTESCLASS   AGE
the-pvc   Pending                                      ebs-sc         <unset>                 9s
```

Its status should be `Pending`. This is by design, as the status remains `Pending` until the first consumer uses it.

## Run a Pod to Use the PVC and Write Data

Once a pod mounts a volume backed by the PVC, a corresponding persistent volume (in this example, backed by AWS EBS) will be created. Run a pod to mount the volume with the following command:

```command {title="Run a pod to mount the PVC-backed volume"}
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

From the open bash shell, write sample data into the volume.

```command {title="Use pod's bash shell to write sample data"}
echo "Some data" > /data/some-data.txt
cat /data/some-data.txt
```

```output
Some data
```

## Create a Velero Backup, Then Verify

With Velero installed and the persistent volume in place, run the backup command:

```command {title="Use Velero to create a backup"}
elero backup create test-backup --wait
```

```output
Backup request "test-backup" submitted successfully.
Waiting for backup to complete. You may safely press ctrl-c to stop waiting - your backup will continue in the background.
.............................................................
Backup completed with status: Completed. You may check for more information using the commands `velero backup describe test-backup` and `velero backup logs test-backup`.
```

After the backup process has completed, use the `backup describe` command to confirm a successful backup:

```command {title="Describe the backup"}
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
  Included:  *
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
Started:    2025-05-31 21:44:31 +0300 IDT
Completed:  2025-05-31 21:45:33 +0300 IDT
Expiration:  2025-06-30 21:44:31 +0300 IDT
Total items to be backed up:  454
Items backed up:              454
Backup Volumes:
  Velero-Native Snapshots: <none included>
  CSI Snapshots: <none included>
  Pod Volume Backups - kopia (specify --details for more information):
    Completed:  11
HooksAttempted:  0
HooksFailed:     0
```

The critical information to verify is the Kopia item for pod volume backups toward the end of the output. Note in the above example that it says `Completed: 11`. This verifies the presence of backups.

## Verify Backup in S3

To close the loop, verify that the backup data has made its way to the configured S3 bucket.

```command {title="List contents of test backup"}
s3cmd ls s3://$BUCKET_NAME/backups/test-backup/
```

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

The persistent volume on your source cluster has been backed up using Velero. Now, provision your destination cluster on Akamai Cloud. There are several ways to create a Kubernetes cluster on Akamai Cloud. This guide uses the Linode CLI to provision resources.

See the [LKE documentation](https://techdocs.akamai.com/cloud-computing/docs/create-a-cluster) for instructions on how to provision a cluster using Cloud Manager.

### See Available Kubernetes Versions

Use the Linode CLI (`linode-cli`) to see available Kubernetes versions:

```command {title="List available Kubernetes versions"}
linode lke versions-list
```

```output
┌──────┐
│ id   │
├──────┤
│ 1.32 │
├──────┤
│ 1.31 │
└──────┘
```

Unless specific requirements dictate otherwise, it’s generally recommended to provision the latest version of Kubernetes.

### Create a Cluster

Determine the type of Linode to provision. The examples in this guide use the g6-standard-2 Linode, which features two CPU cores and 4 GB of memory. Run the following command to create a cluster labeled `velero-to-lke` which uses the `g6-standard-2` Linode:

```command {title="Create LKE cluster"}
lin lke cluster-create \
  --label velero-to-lke \
  --k8s_version 1.32 \
  --region us-sea \
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
┌────────┬───────────────┬────────┬─────────────┐
│ id     │ label         │ region │ k8s_version │
├────────┼───────────────┼────────┼─────────────┤
│ 463649 │ velero-to-lke │ us-sea │ 1.32        │
└────────┴───────────────┴────────┴─────────────┘
```

### Access the cluster

To access your cluster, fetch the cluster credentials as a `kubeconfig` file. Your cluster’s `kubeconfig` can also be [downloaded via the Cloud Manager](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-lke-linode-kubernetes-engine#access-and-download-your-kubeconfig). Use the following command to retrieve the cluster’s ID:

```command {title="Retrieve cluster ID and set environment variable"}
CLUSTER_ID=$(linode lke clusters-list --json | \
  jq -r '.[] | select(.label == "velero-to-lke") | .id')
```

Retrieve the `kubeconfig` file and save it to `\~/.kube/lke-config`:

```command {title="Retrieve and save kubeconfig file"}
linode lke kubeconfig-view \
  --json "$CLUSTER_ID" \
  | jq -r '.[0].kubeconfig' \
  | base64 --decode > ~/.kube/lke-config
```

After saving the `kubeconfig`, access your cluster by using `kubectl` and specifying the file:

```command {title="Use kubectl with kubeconfig to get nodes"}
kubectl get nodes --kubeconfig ~/.kube/lke-config
```

```output
NAME                            STATUS   ROLES    AGE     VERSION
lke463649-678334-401dde8e0000   Ready    <none>   7m27s   v1.32.1
```

## Install Velero in LKE

If you are working in a different terminal session, ensure you have the environment variables for `BUCKET_NAME`, `REGION`, and `CREDENTIALS_FILE` with values identical to those earlier in this guide. In case you need to set them again, the command will look similar to:

```command {title="Set environment variables"}
export BUCKET_NAME=velero-backup-7777
export REGION=us-west-2
export CREDENTIALS_FILE=~/aws-credentials-velero
```

Run the following command to install Velero in your LKE cluster:

```command {title="Install Velero in LKE"}
velero install \
  --kubeconfig ~/.kube/lke-config \
  --provider aws \
  --plugins velero/velero-plugin-for-aws:v1.12.0 \
  --bucket "$BUCKET_NAME" \
  --secret-file $CREDENTIALS_FILE \
  --backup-location-config region=$REGION \
  --use-node-agent \
  --use-volume-snapshots=false \
  --default-volumes-to-fs-backup
```

Verify the Velero installation:

```command {title="Verify the Velero installation"}
kubectl logs deployment/velero \
  -n velero \
  --kubeconfig ~/.kube/lke-config \
  | grep 'BackupStorageLocations is valid'
```

```output
Defaulted container "velero" out of: velero, velero-velero-plugin-for-aws (init)
time="2025-05-31T20:52:50Z" level=info msg="BackupStorageLocations is valid, marking as available" backup-storage-location=velero/default controller=backup-storage-location logSource="pkg/controller/backup_storage_location_controller.go:128"
```

With the backup storage location properly configured, run this command to get information about existing backups.

```command {title="Get backups"}
velero backup get --kubeconfig ~/.kube/lke-config
```

```output
NAME          STATUS      ERRORS   WARNINGS   CREATED                         EXPIRES   STORAGE LOCATION   SELECTOR
test-backup   Completed   0        0          2025-05-31 21:44:31 +0300 IDT   29d       default            <none>
```

## Restore the Backup in LKE

Now, use Velero to restore your source cluster backup into your destination cluster at LKE.

```command {title="Use Velero to restore a backup"}
velero restore create test-restore \
  --from-backup test-backup \
  --kubeconfig ~/.kube/lke-config
```

```output
Restore request "test-restore" submitted successfully.
Run `velero restore describe test-restore` or `velero restore logs test-restore` for more details.
```

Check the restore status with the following command:

```command {title="Check restore status"}
velero restore describe test-restore --kubeconfig ~/.kube/lke-config
```

## Post-Restore Adjustments

Because you are transitioning from one Kubernetes provider to another, you may need to make some final post-restore adjustments.

For example, if your destination cluster is at LKE, you will want to update your PVC to use the Linode storage class. Review the Linode CSI drivers with the following command:

```command {title="See current CSI drivers"}
kubectl get csidrivers --kubeconfig ~/.kube/lke-config
```

```output
NAME                      ATTACHREQUIRED   PODINFOONMOUNT   STORAGECAPACITY   TOKENREQUESTS   REQUIRESREPUBLISH   MODES        AGE
ebs.csi.aws.com           true             false            false             <unset>         false               Persistent   22m
efs.csi.aws.com           false            false            false             <unset>         false               Persistent   22m
linodebs.csi.linode.com   true             true             false             <unset>         false               Persistent   69m
```

Review the available storage classes:

```command {title="Review available storage classes"}
kubectl get storageclass --kubeconfig ~/.kube/lke-config
```

```output
NAME                                    PROVISIONER               RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
ebs-sc                                  ebs.csi.aws.com           Delete          WaitForFirstConsumer   true                   6h22m
gp2                                     kubernetes.io/aws-ebs     Delete          WaitForFirstConsumer   false                  6h22m
linode-block-storage                    linodebs.csi.linode.com   Delete          Immediate              true                   7h9m
linode-block-storage-retain (default)   linodebs.csi.linode.com   Retain          Immediate              true                   7h9m
```

Use the default `linode-block-storage-retain` storage class. However, you must first delete the restored PVC and recreate it with the new storage class.

```command {title="Delete the restored PVC"}
kubectl delete pvc the-pvc --kubeconfig ~/.kube/lke-config
persistentvolumeclaim "the-pvc" deleted
```

```command {title="Recreate the PVC with the new storage class"}
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
      storage: 1Mi
' | kubectl apply -f - --kubeconfig ~/.kube/lke-config
```

```output
persistentvolumeclaim/the-pvc created
```

The new PVC is bound to a new persistent volume. Run the following command to see this:

```command {title="Get information about PVC, PV, and pod"}
kubectl get pvc,pv,pod --kubeconfig ~/.kube/lke-config
```

```output
NAME                            STATUS   VOLUME                 CAPACITY   ACCESS MODES   STORAGECLASS                  VOLUMEATTRIBUTESCLASS   AGE
persistentvolumeclaim/the-pvc   Bound    pvc-711d050fae7641ee   10Gi       RWO            linode-block-storage-retain   <unset>                 2m12s

NAME                                    CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM             STORAGECLASS                  VOLUMEATTRIBUTESCLASS   REASON   AGE
persistentvolume/pvc-711d050fae7641ee   10Gi       RWO            Retain           Bound    default/the-pvc   linode-block-storage-retain   <unset>                          2m9s

NAME          READY   STATUS     RESTARTS   AGE
pod/the-pod   0/1     Init:0/1   0          6h38m
```

Unfortunately, you'll see that the pod is in an `Init` state as it is trying to bind to the previous (and now invalid) PVC. You need to delete the pod, stop the blocked restore (by first deleting the finalizer), and re-run the restore.

```command {title="Delete pod and stop the blocked restore"}
kubectl delete pod the-pod --kubeconfig ~/.kube/lke-config

kubectl patch restore test-restore \
  --patch '{"metadata":{"finalizers":[]}}' \
  --type merge \
  -n velero \
  --kubeconfig ~/.kube/lke-config

kubectl delete restore test-restore \
  -n velero \
  --kubeconfig ~/.kube/lke-config
```

Now, re-run the restore. Velero is smart enough to detect that the PVC (called `the-pvc`) exists and will not overwrite it unless explicitly requested to do so.

```command {title="Re-run the Velero restore"}
velero restore create test-restore \
  --from-backup test-backup \
  --kubeconfig ~/.kube/lke-config
```

```output
Restore request "test-restore" submitted successfully.
Run `velero restore describe test-restore` or `velero restore logs test-restore` for more details.
```

Verify your pod was restored.

```command {title="Verify successful pod restore"}
kubectl get pod the-pod --kubeconfig ~/.kube/lke-config
```

```output
NAME      READY   STATUS    RESTARTS   AGE
the-pod   1/1     Running   0          118s
```

The pod is `Running`. Now, verify the volume is mounted and you can access on LKE the data that was written to the EBS volume on AWS.

```command {title="Run the pod and show the sample data that was written"}
kubectl exec the-pod --kubeconfig ~/.kube/lke-config -- cat  /data/some-data.txt
```

```output
Defaulted container "the-container" out of: the-container, restore-wait (init)
Some data
```

You have successfully performed an end-to-end backup and restore of a Kubernetes cluster (in this example, on AWS EKS) to a Linode LKE cluster, and this included persistent data migration across two different cloud object storage systems.

## Final Considerations

As you pursue this kind of migration, keep in mind the following important considerations.

### Persistent data movements modes

Velero supports both CSI snapshots as well as file system backup using Kopia. When restoring from a backup into a cluster of the same Kubernetes provider, it is recommended to use Velero's [CSI snapshots mode](https://velero.io/docs/main/csi/). This takes advantage of the Kubernetes CSI volume snapshots API and only requires that the same CSI driver is installed in the source and destination clusters.

The file system backup mode used in this walkthrough is the best option when the source and destination Kubernetes providers are incompatible.

### ConfigMaps, secrets, and certificates

Secrets and certificates are often tied to the cloud provider. Velero will restore any Kubernetes Secret resource. However, if (for example) the Secret is used to access AWS services that were replaced by equivalent LKE services, then it would be unnecessary to migrate them. The same applies to ConfigMaps that may contain cloud-provider specific configuration.

### Downtime planning

Velero doesn't offer any special capabilities for facilitating zero-downtime migrations. A safe backup and restore will require blocking all or most traffic to the cluster. If you restore from a stale backup, then you either lose data or you will need to backfill data from the old cluster later.

When downtime is unavoidable, then a safer approach is to schedule it. Perform a backup and immediately restore it to the new cluster.

### Other use case: backups for multi-cloud architectures

While this guide focuses on migration, Velero can also support a multi-cloud Kubernetes strategy. By configuring Velero with backup locations across multiple cloud providers, you could:

-   Create a resilient disaster recovery setup by backup up workloads from one cluster and restoring them into another in a different cloud.
-   Enable workload portability between environments, which may be helpful for hybrid deployments or to meet data redundancy requirements for compliance reasons.

The resources below are provided to help you become familiar with Velero when migrating your Kubernetes cluster to Linode LKE.

## Additional Resources

-   Velero:
    - [Documentation Home]([https://velero.io/docs/v1.16/](https://velero.io/docs/v1.16/))
    - [Installing the Velero CLI](https://velero.io/docs/v1.16/basic-install/#install-the-cli)
    - [Storage provider plugins][https://velero.io/docs/v1.16/supported-providers/]
-   Akamai Cloud:
    - [Linode LKE]([https://techdocs.akamai.com/cloud-computing/docs/linode-kubernetes-engine](https://techdocs.akamai.com/cloud-computing/docs/linode-kubernetes-engine))
    - [Migrating from AWS EKS to Linode Kubernetes Engine (LKE)]([https://www.linode.com/docs/guides/migrating-from-aws-eks-to-linode-kubernetes-engine-lke/](https://www.linode.com/docs/guides/migrating-from-aws-eks-to-linode-kubernetes-engine-lke/))
    - [Migrating from Azure AKS to Linode Kubernetes Engine (LKE)]([https://www.linode.com/docs/guides/migrating-from-azure-aks-to-linode-kubernetes-engine-lke/](https://www.linode.com/docs/guides/migrating-from-azure-aks-to-linode-kubernetes-engine-lke/))
    - [Migrating from Google GKE to Linode Kubernetes Engine (LKE)]([https://www.linode.com/docs/guides/migrating-from-google-gke-to-linode-kubernetes-engine-lke/](https://www.linode.com/docs/guides/migrating-from-google-gke-to-linode-kubernetes-engine-lke/))