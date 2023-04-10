---
slug: apache-airflow-tutorial-creating-connections-and-variables
description: "This guide introduces Airflow Variables and Connections and how to use the Airflow CLI to  create variables that you can encrypt and source control."
og_description: "This Apache Airflow tutorial introduces you to Airflow Variables and Connections. You also learn how to use the Airflow CLI to quickly create variables that you can encrypt and source control. Similarly, the tutorial provides a basic example for creating Connections using a Bash script and the Airflow CLI. These two examples can be incorporated into your Airflow data pipelines using Python."
keywords: ['apache airflow tutorial', 'apache airflow features']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-30
modified_by:
  name: Angel D'az
title: "Create Connections and Variables in Apache Airflow"
image: ApacheAirflowTut_CreateConn_Var.png
external_resources:
- '[Apache Airflow Official Documentation](https://airflow.apache.org/docs/stable/)'
aliases: ['/applications/big-data/apache-airflow-tutorial-creating-connections-and-variables/']
authors: ["Angel D'az"]
---

## What is Apache Airflow?

[Airflow](https://airflow.apache.org/) is an open source platform that you can use to automate, orchestrate, and monitor workflows and data pipelines. One of Airflow’s greatest features is that you can create and execute workflows with code. When you use workflows that are powered by code, you can version control, collaborate on, and debug your workflows.

Airflow refers to workflows as *Directed Acyclic Graphs (DAGs)*. A DAG includes the sequence of tasks to execute along with the relationship between tasks and their dependencies. You can execute an [ETL process](https://en.wikipedia.org/wiki/Extract,_transform,_load) (extract, load, and transform data) with Airflow and also automate emails with CSV attachments, and create Machine Learning (ML) workflows.

You can connect your Airflow data sources to a central data *warehouse* so your data analysts have access to all relevant data, which prevents data silos from developing across an organization. Similarly, transparent and reproducible code-driven workflows reduce bottlenecks, because anyone with access to the workflow's code can debug it.

Airflow provides a [Python application programming interface (API)](https://airflow.apache.org/docs/stable/_api/index.html) that you can use to code your DAGs and call any connection scripts you create.

## In this Guide

This tutorial provides an introduction with basic examples to two fundamental Airflow concepts, *Variables* and *Connections*. You can incorporate the ideas covered in this guide into more sophisticated Python scripts when creating your DAGs and data pipelines.

In this Apache Airflow tutorial, you learn how to:

- [store Airflow values in variables](#create-your-dag-variables) using the Airflow command-line interface (CLI)
- [automate connecting to your data sources](#create-your-connection-script) using a simple script and the Airflow CLI

## Airflow Variables and Connections

Airflow needs to access data from external sources, like [databases](https://www.linode.com/blog/marketplace-apps/new-web-development-and-database-marketplace-apps/), [APIs](/docs/api/), and [servers](https://www.linode.com/products/shared/). You use [Airflow *Connections*](https://airflow.apache.org/docs/stable/howto/connection/index.html) to create connections to your data sources. Your connections form the building blocks of your Airflow DAGs, because they define your data's sources, [staging area](https://airflow.apache.org/docs/stable/best-practices.html#staging-environment), and destination.

You use Airflow variables to store reusable values, like URIs, database usernames, configurations, and any other values required by your DAGs. The variables are stored in Airflow's metadata database.

### The Airflow CLI

You can use the Airflow CLI to manage your DAGs and create, edit, and delete Airflow objects like connections and variables. You can incorporate CLI commands into scripts to automate your frequently used Airflow CLI commands. In this guide, you learn how to leverage the Airflow CLI to automate creating your Airflow Variables and Connections.

## Automate Creating Airflow Variables and Connections

### Create Your DAG Variables

Using a JSON file to load [Airflow variables](https://airflow.apache.org/docs/stable/concepts.html#variables) is a more reproducible and faster method than using the Airflow graphical user interface (GUI) to create variables. This section uses a simple example to demonstrate how to create and store Airflow variables using the Airflow CLI.

1. Using a text editor, create a new JSON file to store key-value pairs of any values you need to reuse in your DAGs. The example file includes connection information for a MySQL database.

    {{< file "~/example_vars.json">}}
{
    "my_prod_db": "dbname",
    "my_prod_db_user": "username",
    "my_prod_db_pass": "securepassword",
    "my_prod_db_uri": "mysql://192.0.2.0:3306/"
}
    {{</ file >}}


1. Issue the following command to load all your variables. Replace the path with the location of your `example_vars.json` file.

        airflow variables --import /home/username/example_vars.json

1. To retrieve a variable value from Airflow, use the following command:

        airflow variables -g my_prod_db

    Airflow returns the value of the `my_prod_db` variable.
    {{< output >}}
dbname
    {{</ output >}}

    {{< note respectIndent=false >}}
Airflow saves the passwords for connections and any variable values in plain text within the metadata database. See the [A Recommended Workflow for Sensitive Variables](#a-recommended-workflow-for-sensitive-variables) section for ways to keep your variables secure.
    {{< /note >}}

### Create Your Connection Script

The Airflow CLI can be used to create your [Connections](https://airflow.apache.org/docs/stable/howto/connection/index.html) to any external system required by you DAGs. This section shows you how to create a simple connection with a reusable bash script that you can adopt for your own Airflow Connections. The example below includes a connection for a MySQL database.

1. Create a new file named `connection.sh`. Replace the values with your own values or expand on the script to create the Connections required by your DAGs.

    {{< file "connection.sh">}}
#!/usr/bin/env bash

airflow connections -d --conn_id db_conn

airflow connections -a --conn_id db_conn --conn_type mysql --conn_host 'mysql://192.0.2.0:3306/' --conn_schema 'dbname' --conn_login 'username' --conn_port '3306' --conn_password 'securepassword'
    {{</ file >}}

    The third line of the script deletes any connections that the script may have created previously to maintain [*idempotency*](https://en.wikipedia.org/wiki/Idempotence). This means your script can be run as many times as desired with the same expected result.

1. Ensure that you can execute your Connections script:

        chmod u+x /home/username/connection.sh

1. Load your connections by executing your completed script:

        bash /home/username/connection.sh

1. Use the Airflow CLI to verify that your new Connection was created. Replace `db_conn` with the name of your Connection.

        airflow connections --list | grep 'db_conn'

## A Recommended Workflow for Sensitive Variables

 If you use a JSON file to store sensitive connection variables or if you use a script to automate your Airflow Connections, you should develop a workflow for encrypting and decrypting sensitive values. Airflow saves the passwords for connections in plain text within the metadata database. A workflow for your sensitive connection data ensures that these values are never exposed in a raw string format. The section below includes a sketch for a workflow you can consider to keep your sensitive variables secure.

- **Encrypt**: You can use tools like [Ansible Vault](https://docs.ansible.com/ansible/latest/user_guide/vault.html) to encrypt sensitive values before storing them in a remote repository, like [GitHub](https://github.com/). Another popular tool for storing sensitive values is [HashiCorp Vault](https://www.vaultproject.io/). The Python [Crypto](https://airflow.apache.org/docs/stable/howto/secure-connections.html#securing-connections) package is another tool that you can use to enable encryption for passwords.

- **Decrypt**: In order to run any automation scripts containing your encrypted variable values, you must include a decryption step before executing them. Airflow needs the decrypted values in order to run your DAGs. Both Ansible Vault and HaschiCorp Vault include mechanisms for providing decrypted variable values to Airflow.

- **Load**: Once your values are decrypted, execute your scripts.

- **Encrypt**: After your automated infrastructure loads both Airflow Variables and Connections, encrypt your sensitive values. This way sensitive data is only exposed through an encrypted Airflow Database that only Airflow can access.

## Conclusion

Automating creating your Airflow Variables and Connections is a fundamental step towards transparent data for quick experimentation, prototyping, and analysis. Having all of your relevant data connections in a central and secure repository sets up your organization for collaboration. This allows you to spend less time on the extract and load steps of workflows and more time on the transformation step.

After completing this tutorial, learn how to build a data pipeline using Python using Airflow's [example Pipeline tutorial](https://airflow.apache.org/docs/stable/tutorial.html).

