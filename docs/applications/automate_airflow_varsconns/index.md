---
author:
  name: Angel D'az
  email: angel@ocelotdata.com
description: 'A shortguide that shows how to automate your Airflow Variables and Connections deployment.'
keywords: []
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-30
title: "Automate Airflow Variables and Connections"
headless: true
show_on_rss_feed: false
---

# Automating Airflow Vars and Conns
##### Writing for Linode

## What is [Airflow](https://airflow.apache.org/)?
Airflow is open source software created by a community to automate and orchestrate workflows. 
These workflows are called Directed Acyclic Graphs (DAGs). 
DAGs often used for Extract, Load, and Transform (ELT) Data Workflows but Airflow also has features which allow you to automate code execution ranging from automated emails with CSV attachments to Machine Learning (ML) workflows.

## Why Airflow?
Although Airflow does have a web server UI available, one of Airflow’s greatest features is Airflow takes and executes all workflows with code. 
Using only code for your data flows improves transparency and reproducibility of inevitable bugs and fires. 
When your workflows are automated with only code, your ELT fires are much easier to troubleshoot because no part of the broken process is siloed in someone’s head.

As Airflow’s Creator, Maxime Beauchamin writes in [Rise of the Data Engineer](https://www.freecodecamp.org/news/the-rise-of-the-data-engineer-91be18f1e603/):
> “Code allows for arbitrary levels of abstractions, allows for all logical operation in a familiar way, integrates well with source control, is easy to version and to collaborate on”

Airflow removes both Data Silos and Intellectual Property (IP) Silos.

1. *Data Silos*
* Connecting Data sources to a central Data Warehouse Destination lets Analysts have transparency across all relevant data

2. *IP Silos*
* Transparent and Reproducible workflows reduce human bottlenecks because Data Teams have complete access to the code that broke and the logs output. You don’t have to wait for a potential bottleneck because they’re the only ones who know the correct button to push. All stack traces, logs, and error codes are available to see.

## Airflow Variables and Connections
Airflow needs to be able to connect to data entities; Databases, APIs, Servers, etc. 
Variables and Connections are Airflow features that allow you to ensure these connections without hard coding them into your workflows every time you need to connect with an outside entity.

##### Variables and connections are how Airflow communicates with the outside world.

### Why Automate their creation?
Hypothetical Scenario for Airflow beginner:
> You are one of the first engineers in a growing company that’s building out their Data Infrastructure. 
> You have successfully made the case for migrating ad-hoc workflow scripts over to an orchestration tool like Airflow. 
> You want to write workflows that break much less often and when they do break, you want them to be easy to fix.
> You have been given a cloud server, a Linux machine instance, to begin migrating existing scripts over to Airflow. 
> You were able to install and run a basic DAG. Where do you start?

I recommend starting with Variables and Connections. 
They form the building blocks of your DAGs because they define your sources, staging areas, and destinations.
Automating Variables and Connections is just another piece of transparent and reproducible workflows.

## Leveraging Airflow’s Command Line Interface [(CLI)](https://airflow.apache.org/docs/stable/cli.html)
You can manage your Variables and Connections in Airflow’s webserver with manual input; clicks and typing. 
However, this work is not efficient and makes you a bottleneck. 
I recommend leveraging Airflow’s Command Line Interface (CLI) built-in commands.

There are built in airflow command line interface commands that allow you to set, edit, and delete airflow objects like variables and connections.

### Variables CLI
Store your variables in a key-value structure with a JSON document. An example JSON document would look like this:
```json
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
```

In order to load all the variables above, you only need one terminal command:
```bash
airflow variables --import /home/your_user/airflow/your_vars.json
```
Save this command for later.

### Connections CLI
Airflow Connections are currently handled a bit differently than Variables. 
You cannot store in a JSON document and load them with a single command. 
I recommend using a bash script.

Use an executable bash script. 
I have provided an example bash script with three types of connections: 
    1. AWS IAM Credentials stored in the Connection’s “extra” field 
    2. Multi-Line JSON API Credentials stored in the Connection’s “extra” field
    3. An Example Database Connection

There is a more detailed explanation after this example script.
```bash
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
```

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