---
slug: kubernetes-cron-job
description: 'This guide shows you how to create a Kubernetes CronJob, which you can use to automate and schedule various types of tasks on your Kubernetes clusters.'
keywords: ['kubernetes cron job']
tags: ['kubernetes']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-20
modified_by:
  name: Linode
title: "Create a Kubernetes CronJob"
title_meta: "How to Create a Kubernetes CronJob"
external_resources:
- '[Define Environment Variables for a Container](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/)'
- '[CronJobs](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/)'
authors: ["Martin Heller"]
---

Linode Kubernetes Engine (LKE) is an open source container orchestration system that helps deploy and manage containerized applications. If you are not familiar with Kubernetes, read our [Beginner's Guide to Kubernetes](/docs/guides/beginners-guide-to-kubernetes-part-1-introduction/). Kubernetes (K8s) includes the capability to schedule jobs to run at a particular time with [CronJobs](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/). CronJobs use the same scheduling syntax as **cron** and **crontab**, which are standard Linux utilities. If you are not familiar with cron, you can refer to our [Schedule Tasks with Cron](/docs/guides/schedule-tasks-with-cron/) guide.

In this guide, you learn the syntax for creating Kubernetes CronJobs. You also learn how to generate automatic daily backups for a Drupal website using Kubernetes CronJobs.

## Before You Begin

1. Ensure you have deployed a Kubernetes cluster. To deploy a Linode Kubernetes Engine (LKE) cluster, see our [Deploy and Manage a Cluster with Linode Kubernetes Engine](/docs/products/compute/kubernetes/) guide.

1. After deploying your Kubernetes cluster, make sure your local environment has [kubectl installed](/docs/products/compute/kubernetes/guides/kubectl/), and you can access your cluster using `kubectl`.

1. This guide uses a Drupal website deployed with LKE to demonstrate how to back up a MySQL database. To follow along, ensure you use the [How to Install Drupal with Linode Kubernetes Engine](/docs/guides/how-to-install-drupal-with-linode-kubernetes-engine/) guide to deploy your own Drupal site.

## An Overview of a Kubernetes CronJob

Like other Kubernetes resources, CronJobs are defined in a manifest file. The example manifest file creates a CronJob that deploys a simple "Hello" script once a minute.

```file {title="cronjob.yaml" lang=yaml}
apiVersion: batch/v1
kind: CronJob
metadata:
  name: hello
spec:
  schedule: "*/1 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: hello
            image: busybox
            imagePullPolicy: IfNotPresent
            command:
            - /bin/sh
            - -c
            - date; echo Hello from the Kubernetes cluster
          restartPolicy: OnFailure
```

{{< note >}}
The manifest file above uses the example provided in the [Kubernetes official documentation](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/#example).
{{< /note >}}

A Kubernetes CronJob must contain the `apiVersion`, `kind`, and `metadata` fields. It must also contain the `spec.schedule` field which defines the time interval for the CronJob. The time interval syntax for a Kubernetes is the same as Linux system Cron jobs. You can refer to the [How to Use Cron and crontab - The Basics](/docs/guides/schedule-tasks-with-cron/#how-to-use-cron-and-crontab---the-basics) section of our Cron guide for time interval syntax details. Finally, the `jobTemplate` field is required. This field defines the requirements for the Pod that executes your CronJob. It also defines the commands to execute from the Pod. To learn more about defining `jobTemplates`, see the [Kubernetes Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/job/) documentation.

To launch a CronJob, execute the command below. Ensure your replace `cronjob.yaml` with the name of your CronJob's manifest file.

```command
kubectl create -f cronjob.yaml
```

You can use the `kubectl get cronjob hello` command to view information about your CronJob. Use the `kubectl logs $pods` command to view your Pod logs, and the `kubectl delete cronjob hello` command to delete the CronJob when it's no longer needed.

## How to Backup a Mysql Database Using a Kubernetes Cronjob

This section shows you how to back up a MySQL database. The example assumes a Drupal website has been deployed using LKE. You can adapt the Kubernetes manifest file example for your own MySQL database. The steps you accomplish in this section are the following:

- Before creating the CronJob, you test it by logging into your MySQL Pod and executing the CronJob's commands
- Create the CronJob to backup your MySQL database
- Schedule your CronJob

{{< note >}}
Ensure your terminal is using your desired [Kubeconfig context](/docs/products/compute/kubernetes/guides/kubectl/#persist-the-kubeconfig-context).
{{< /note >}}

### Test Your CronJob Command

To back up your MySQL database, you need to find your Kubernetes cluster's MySQL Pod name. Issue the following command to find your Pod's name:

```command
kubectl get pods
```

Your output displays a similar output:

```output
NAME                      READY   STATUS    RESTARTS   AGE
mysql-6bf46f94bf-tcgs2    1/1     Running   0          13m
drupal-77f665d45b-568tl   1/1     Running   0          5m1s
```

The `mysqldump` command can be executed after logging into your MySQL Pod. Execute the following command replacing `mysql-6bf46f94bf-tcgs2` with your own Pod's name.

```command
kubectl exec -it mysql-56f9846bb7-tlbv6 -- /bin/bash
```

Viewing your MySQL Pod's terminal prompt, run the `mysqldump` command to generate a backup copy of your database. Enter your database's password when prompted. You can verify the `dump.sql` backup file created using the `ls` command.

{{< note >}}
If you deployed your Kubernetes cluster following the [How to Install Drupal with Linode Kubernetes Engine](/docs/guides/how-to-install-drupal-with-linode-kubernetes-engine/), your password should be the same one used in your `kustomization.yaml` file.
{{< /note >}}

### Create your CronJob

Your CronJob file incorporates the `mysqldump` command that you tested in the previous section. It is not recommended to store your database's password in your Kubernetes manifest file. Your MySQL Pod should already have the MySQL database's password stored in its context, so you can alter your `mysqldump` command in the following way:

```command
mysqldump drupal-db -p$MYSQL_ROOT_PASSWORD > dump.sql
```

{{< note >}}
If your Pod does not have the password stored in its Pod environment, you can use a [Kubernetes secret to store your password as a Pod environment variable](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/).
{{< /note >}}

Create a new Kubernetes manifest file with the following content:

```file {title="backup.yaml" lang=yaml}
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: backup
spec:
  schedule: "@daily"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: mysql
            image: mysql
            imagePullPolicy: IfNotPresent
            command:
            - /bin/sh
            - -c
            - mysqldump drupal-db -p$MYSQL_ROOT_PASSWORD > dump.sql;
            - date; echo Drupal database has been backed up
          restartPolicy: OnFailure
```

Apply the CronJob to your Kubernetes cluster.

```command
kubectl create -f backup.yaml
```

You should see a similar response if the CronJob is created successfully.

```output
cronjob.batch/backup created
```

To get the status of the job, issue the following command:

```command
kubectl get cronjob backup
```

Your output displays a similar result when the command executes successfully.

```output
NAME     SCHEDULE   SUSPEND   ACTIVE   LAST SCHEDULE   AGE
backup   @daily     False     0        <none>          117s
```

The job shows up with `<none>` for the last schedule. The following day, try again, and you can see that the job ran at midnight. You can also check the Pod’s logs for the output by using the `kubectl logs $pods` command.