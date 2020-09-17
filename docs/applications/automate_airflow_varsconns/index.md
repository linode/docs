---
author:
  name: Angel D'az
  email: angel@ocelotdata.com
description: 'A shortguide that shows how to automate your Airflow Variables and Connections deployment.'
keywords: ['apache airflow tutorial', 'apache airflow features']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-30
title: "An Apache Airflow Tutorial: How to Create Connections and Variables"
h1_title: "An Apache Airflow Tutorial: Creating Connections and Variables"
show_on_rss_feed: false
---

## What is Apache Airflow?
[Airflow](https://airflow.apache.org/) is an open source platform that you can use to automate, orchestrate, and monitor workflows. One of Airflow’s greatest features is that you can create and execute workflows with code. When you use workflows that are powered by code, you can version control, collaborate on, and debug your workflows.

Airflow refers to workflows as *Directed Acyclic Graphs (DAGs)*. A DAG includes the sequence of tasks to execute along with the relationship between tasks and their dependencies. You can execute an [ETL process](https://en.wikipedia.org/wiki/Extract,_transform,_load) (extract, load, and transform data) with Airflow and also automate emails with CSV attachments, and create Machine Learning (ML) workflows.

You can connect your Airflow data sources to a central data *warehouse* so your data analysts have access to all relevant data, which prevents data silos from developing across an organization. Similarly, transparent and reproducible code-driven workflows, reduce bottlenecks, because anyone with access to the workflow's code can debug it.

### In this Guide

You learn how to:

- store your Airflow data connection details in variables
- automate connecting to your data sources using a simple script and the Airflow command-line interface (CLI)

## Airflow Variables and Connections

Airflow needs to access data from external sources, like [databases](https://www.linode.com/blog/one-click-apps/new-web-development-and-database-one-click-apps/), [APIs](https://developers.linode.com/api/v4), and [servers](https://www.linode.com/products/shared/). You use Airflow *Connections* to create connections to your data sources and you use variables to store reusable connection values, like URIs, database usernames, [Object Storage](https://www.linode.com/products/object-storage/) bucket names, and any other connection values required by your workflows. Your connections form the building blocks of your Airflow DAGs, because they define your data's sources, staging area, and destination.

### The Airflow CLI

You can use the Airflow CLI to manage your DAGs and create, edit, and delete Airflow objects like connections and variables. This also allows you to create scripts to automate those steps. In this guide, you learn how to leverage the Airflow CLI to automate creating your Airflow connections.

## Automate Your Airflow Connections

### Create Your Connection Variables

1. Using a text editor, create a new JSON file to store key-value pairs of your data sources connection variables and values. The example file includes connection information for Linode Object Storage and buckets, a MySQL database, and a Google Analytics account.

    {{< file "~/connections.json">}}
{
    "AWS_ACCESS_KEY_ID": "AAAAAAAAAAAA",
    "AWS_SECRET_ACCESS_KEY": "BBBBBBBBBBBB",
    "mysql_db": "dbname",
    "relationaldb_host": "your_database.us-weast-1.rds.amazonaws.com",
    "relationaldb_port": "9999",
    "relationaldb_pw": "airflow",
    "relationaldb_user": "airflow",
    "s3_bucket": "data_staging",
    "google_analytics": "[\"website_name\", \"view_id\"]",
    "TEAM_NAMES": "[\"name_1\",\"name_2\",\"name_3\",\"name_n\"]"
}
    {{</ file >}}

    {{< note >}}
To load all your connection variables issue the following command. Replace the path with the location of your `connection.json` file.

    airflow variables --import /home/username/connection.json

This command is used to load your connection variables within the script you write in the next section.

    {{</ note >}}

### Create Your Connection Script

Airflow Connections are currently handled a bit differently than Variables.
You cannot store in a JSON document and load them with a single command.
I recommend using a bash script.

Use an executable bash script.
I have provided an example bash script with three types of connections:
    1. AWS IAM Credentials stored in the Connection’s “extra” field
    2. Multi-Line JSON API Credentials stored in the Connection’s “extra” field
    3. An Example Database Connection

There is a more detailed explanation after this example script.
{{< file "connection.sh">}}
#!/usr/bin/env bash

airflow connections -d --conn_id aws_iam_user
airflow connections -d --conn_id googleanalytics_rest_api
airflow connections -d --conn_id db_conn

airflow connections -a --conn_id aws_iam_user --conn_type s3 --conn_extra '{"aws_access_key_id":"AAAAAAAAAAAAAAA","aws_secret_access_key": "BBBBBBBBBBBB"}'

airflow connections -a --conn_id googleanalytics_rest_api --conn_type None --conn_extra '{"client_secrets":
{
"type": "service_account",
     "project_id": "Google_Analytics_Data",
"private_key_id": "id",
"private_key": "-----BEGIN PRIVATE
KEY-----\n_secretstuf_\n-----END
PRIVATE KEY-----\n",
"client_email": "projectname@projectname.iam.gserviceaccount.com",
"client_id": "id",
"auth_uri": "https://accounts.google.com/o/oauth2/auth",
"token_uri": "https://oauth2.googleapis.com/token",
"auth_provider_x509_cert_url": "cert_url",
"client_x509_cert_url":
"cert_url"
                   }
               }'

airflow connections -a --conn_id db_conn --conn_type mysql --conn_host 'yourhost.region.provider.com' --conn_schema 'dbname' --conn_login airflow --conn_port '9999' --conn_password 'AAAAAAAAAA'
{{</ file >}}

#### Bash Script Explanation
Always delete your connections first for idempotency.
Meaning, you can run this script as many times as you want, for the same result.
Idempotency reduces manual work.

```bash
airflow connections -d --conn_id your_conn
```

Both AWS IAM and the Google Analytics Reporting REST API examples store the credentials in the extra section in this example.
However, the REST API example shows how to store multi-line credentials with single quotes surrounding the whole field.

Cloud Databases; MySQL, Postgres, SQL Server, all have consistent fields to fill in.
These type of connections allow your DAGs to execute SQL directly into these databases with relative ease.

Finally, after finishing up your connections script.
You need to ensure that it is executable by your Airflow user.
```bash
chmod u+x /home/your_user/airflow/load_conns.sh
```

And you can load your connections by executing your completed script from your terminal:
```bash
/home/your_user/airflow/load_conns.sh
```
## Finally; Two Commands to Automate

After setting all of your connection and variable strings, you are left with two commands to add to your Airflow automation and pre-DAG configuration.
```bash
airflow variables --import /home/your_user/airflow/your_vars.json
/home/your_user/airflow/load_conns.sh
```

You can automate these commands how you see fit.
There are many Data Infrastructure as Code (DIAC) solutions but that goes beyond the scope of this post.
There also remains the question of how to handle sensitive variables so that your user’s data is secure!

## What about Sensitive Variables?
I recommend you protect your sensitive variables by automating the decryption, loading, and final encryption of your sensitive strings.
This ensures that your sensitive Variables and Connections are never exposed in a raw string format, unless you manually download (clone) and decrypt for your management.

I recommend these general steps to be automated once you have completed writing up your two final commands.
1. **Encrypt**

    Always encrypt your sensitive strings before loading into a repository.
    I have used Ansible vault encryption with Jinja templating in the past.

2. **Decrypt**

    Inside of your Data Infrastructure as Code (DIAC) solution; you need to add steps for decryption before executing your two commands so that Airflow can read what the Variables and Connections you’re trying to load.

3. **Load**

    Execute your Airflow Variables command and Connections script

4. **Encrypt before Merging Repos**

    After your automated infrastructure loads both Airflow Variables and Connections, encrypt the strings again so that your sensitive data is only exposed through an encrypted Airflow Database that only Airflow can access.

## Conclusion
There is a never-ending battle between over-engineering and setting your organization up for success.
Having all of your relevant data connections in a central and secure repository sets up your organization for success.
You can spend less time on the Extract and Load steps of workflows and more time on the Transformation step.
Spending more time on Transformation means that you start serving higher level organization data needs.
You start spending time optimizing analysis rather than fixing broken connections; because they’re securely automated from creation to usage.

Ultimately, automating your Airflow Variables and Connections is a fundamental step towards transparent Data for quick Experimentation, Prototyping, and Analysis.