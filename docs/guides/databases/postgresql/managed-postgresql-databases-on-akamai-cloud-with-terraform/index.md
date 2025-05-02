---
slug: managed-postgresql-databases-on-akamai-cloud-with-terraform
title: "Managed PostgreSQL Databases on Akamai Cloud with Terraform"
description: "Learn how to use Terraform to provision a managed PostgreSQL database cluster on Akamai Cloud."
authors: ["Peter Sari"]
contributors: ["Peter Sari", "Nathan Melehan"]
published: 2025-05-02
keywords: ['managed database','database managed services','managed postgresql','managed postgres','managed postgres database','terraform postgresql provider​','terraform postgresql​','postgresql terraform provider​','terraform postgres provider','postgres terraform provider','terraform postgres','terraform database','postgresql_database terraform','terraform create postgres database']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Terraform documentation](https://developer.hashicorp.com/terraform)'
- '[PostgreSQL documentation](https://www.postgresql.org/docs/)'
---

This guide demonstrates how to use [Terraform](https://developer.hashicorp.com/terraform) to set up a PostgreSQL database cluster on the [Managed Database](https://www.linode.com/products/databases/?utm_medium=website&utm_source=akamai) service in Akamai Cloud.

Akamai's Managed Database is a Relational Database Management System as a Service. Akamai manages both the underlying compute instances and the relational database management system software. Akamai updates the software and maintains the health of these systems. Using Managed Database, you can instantiate managed clusters of MySQL and PgSQL with a range of supported versions.

These clusters can support multiple database, and this guide also shows how to use Terraform to deploy individual databases on the cluster. To accomplish this, two [Terraform providers](https://developer.hashicorp.com/terraform/language/providers) are used, and a modular configuration handles the database deployments.

## Before You Begin

To follow this guide, perform these steps first:

- [Install Terraform](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) on your workstation

- [Create a personal access token](https://techdocs.akamai.com/linode-api/reference/post-personal-access-token) for the Linode API that has permission to create databases

- Install a PostgreSQL client on your workstation. This is used to validate the installation of the database cluster.

    The steps in this guide use the [`psql` command](https://www.postgresql.org/docs/current/app-psql.html) in the example commands shown. Visit the PostgreSQL [Downloads](https://www.postgresql.org/download/) page for installation instructions.

    {{< note >}}
    A [list of other clients on wiki.postgresql.org](https://wiki.postgresql.org/wiki/PostgreSQL_Clients) is available, but the instructions in this guide are intended for `psql`.
    {{< /note >}}

## File Structure

The project in this guide follows the directory structure shown below:

```output
.
├── main.tf
├── modules
│   └── databases
│   	├── main.tf
│   	├── outputs.tf
│   	└── variables.tf
├── outputs.tf
├── providers.tf
├── terraform.tfvars
└── variables.tf
```

In this structure, the root Terraform files (`main.tf`, `outputs.tf`, `terraform.tfvars`, `variables.tf`) build the database cluster infrastructure. The `modules/databases/` module handles database creation within the cluster.

{{< note >}}
While it is not within the scope of this guide, you can also add a [null resource](https://registry.terraform.io/providers/hashicorp/null/latest/docs/resources/resource) and a [local-exec provisioner](https://developer.hashicorp.com/terraform/language/resources/provisioners/local-exec) that uses `psql` to create tables within the module.
{{< /note >}}

## Preparing to Deploy

There are several options that can be configured for a new database cluster, including:

- The size of the cluster you would like to deploy

- The instance types that underpin the databases

- The database software and supported version

- The maintenance window schedule. Managed Databases require periodic maintenance by Akamai, and the window for this can be configured.

- The region where the cluster should be located

In a later section, each of these choices is encoded in your Terraform variables file. This file references unique label/strings correspond to the region, instance type, etc that you decide on.

### Regions

Document the region in which you would like to deploy. A list of regions that support Managed Databases is returned by this API call:

```command
curl -s https://api.linode.com/v4/regions | jq '.data[] | select(.capabilities[] | contains("Managed Databases")) | .id'
```

The output resembles:

```output
"ap-west"
"ca-central"
"ap-southeast"
"us-iad"
"us-ord"
"fr-par"
...
```

The ID is used as the value for the variable region in the Terraform configuration.

### Instance Types

Akamai offers a range of different instance types, but a subset of these can be used with Managed Database Clusters. When deciding on an instance type, you must know what the CPU, memory and storage requirements are for your initial database deployments.

As a reference point, a single instance's capacity is the storage capacity of your databases in aggregate. A list of instances compatible with Managed Databases is returned by this API call:

```command
curl -s https://api.linode.com/v4/databases/types | jq '.data[] | { "id" , "label" , "disk" , "vcpus" }'
```

The output resembles:

```output
{
  "id": "g6-nanode-1",
  "label": "DBaaS - Nanode 1GB",
  "disk": 9216,
  "vcpus": 1
}
{
  "id": "g6-standard-1",
  "label": "DBaaS - Linode 2GB",
  "disk": 30720,
  "vcpus": 1
}
{
  "id": "g6-standard-2",
  "label": "DBaaS - Linode 4GB",
  "disk": 59392,
  "vcpus": 2
}
...
```

This command outputs the `id`, which is later referenced in `db_instance_type` variable in your Terraform configuration, along with some information related to diskspace (in MB) and vCPUs. The amount of RAM per instance is indicated in the description.

{{< note >}}
The database cluster instance type can be changed in the future by altering the instance type variable in your Terraform configuration. Note that resizing is implemented by creating entirely new cluster and migrating the database to the new cluster. As a result, resizes are not instantaneous changes.
{{< /note >}}

### RDBMS Software and Version

When creating the cluster, the server software (currently, PostgreSQL or MySQL) and version need to be specified. For this guide, PostgreSQL v17 is used. The list of currently supported RDBMS with associated versions is returned by this API call:

```command
curl -s https://api.linode.com/v4/databases/engines | jq '.data[].id'
```

```output
"mysql/8"
"postgresql/13"
"postgresql/14"
"postgresql/15"
"postgresql/16"
"postgresql/17"
```

The value `postgresql/17` is later referenced by the variable `rdbms_ver` in the Terraform configuration.

### Cluster Size

The size of the cluster (the number of nodes in the cluster) determines its read capacity and whether it remains available when a node fails. Clusters can be built as a single node, for smaller, less mission critical applications, or they can be provisioned with 2 or 3 nodes, for those that require high availability and/or higher read capacity.

Your cluster size can be changed at any time after the cluster is first provisioned. In the Terraform configuration demonstrated later, this is done by configuring the `cluster_nodes` variable.

### Maintenance Windows

Because the cluster nodes and RDBMS software are managed and kept up to date by Akamai, it is important to provide a viable maintenance window. This window is specified in the time zone of the cluster's region.

In the Terraform configuration shown later, the `update_hour` and `update_day` variables control this window. Both variables are integer values:

- `update_day` ranges from 1 (Sunday) to 7 (Saturday)

- `update_hour` ranges from 0 (midnight) to 23 (11PM).

These variables can also be changed after the cluster is first created.

## Configure Terraform Providers

Providers map the Hashicorp Configuration Language to an API, like the Linode API. In order to configure the database cluster with Terraform, you first need to declare which Terraform [providers](https://developer.hashicorp.com/terraform/language/providers) are used in the configuration and enter some required information.

1. On your workstation, create a directory named `postgres-terraform`. All Terraform files in this guide are stored under this directory:

    ```command
    mkdir postgres-terraform
    ```

1. Create a file in your `postgres-terraform/` directory named `providers.tf`, and paste in the following snippet:

    ```file {title="postgres-terraform/providers.tf"}
    terraform {
      required_providers {
    	linode = {
      	source  = "linode/linode"
      	version = "2.35.1"
    	}
    	postgresql = {
      	source  = "a0s/postgresql"
      	version = "1.14.0-jumphost-1"
    	}
      }
    }

    provider "linode" {
      token = var.linode_token
    }

    provider "postgresql" {
      database = "defaultdb"
      host 	= linode_database_postgresql_v2.pgsql-cluster-1.host_primary
      port 	= linode_database_postgresql_v2.pgsql-cluster-1.port
      username = linode_database_postgresql_v2.pgsql-cluster-1.root_username
      password = linode_database_postgresql_v2.pgsql-cluster-1.root_password
      sslmode  = "require"
    }
    ```

Two providers are used in this guide:

- The Linode provider (`linode/linode`) talks to the Linode API to build the infrastructure. At the time of writing, version 2.35.1 of the Linode provider is the latest.

    {{< note >}}
    Please check the [Terraform Registry](https://registry.terraform.io/providers/linode/linode/latest/docs) for the latest versions prior to deploying.
    {{< /note >}}

- A PostgreSQL provider talks to the PostgreSQL management endpoint. There are multiple PostgreSQL providers, and this guide uses the [`a0s/postgresql` provider](https://registry.terraform.io/providers/a0s/postgresql/latest/docs).

    {{< note >}}
    MySQL providers are also available if you need to provision a MySQL cluster.
    {{< /note >}}

The providers need to be configured to work with your specific environment:

- The Linode provider requires a personal access token (PAT) with read and write permissions for the Managed Databases service.

- The PostgreSQL provider requires:

  - A collection of information that is derived from the cluster deployment: the username, password, hostname, and TCP port to use when connecting. These values are attributes of the `linode_database_postgresql_v2.pgsql-cluster-1` resource, defined later in a file called `main.tf`.

  - The name of the database to connect to. This is assigned the value `defaultdb`. This entry is important as the `psql` interface requires an existing database in the connection string, even when creating a new database. `defaultdb` is created for you during the creation of the database cluster.

## Configure the Managed PostgreSQL Cluster with Terraform

1. Create a file named `main.tf` in your `postgres-terraform/` directory and paste in the following snippet:

    ```file {title="postgres-terraform/main.tf"}
    resource "linode_database_postgresql_v2" "pgsql-cluster-1" {
      label = var.db_clustername
      engine_id = var.rdbms_ver
      region = var.region
      type = var.db_instance_type
      allow_list = ["0.0.0.0/0"]
      cluster_size = var.cluster_nodes
      updates = {
        duration = 4
        frequency = "weekly"
        hour_of_day = var.update_hour
        day_of_week = var.update_day }
      lifecycle {
        ignore_changes = [host_primary]
      }
      timeouts {
        create = "30m"
        update = "30m"
        delete = "30m"
      }
    }

    module "database1" {
      source = "./modules/databases"
      database = "defaultdb"
      db_host = linode_database_postgresql_v2.pgsql-cluster-1.host_primary
      db_port = linode_database_postgresql_v2.pgsql-cluster-1.port
      db_user = linode_database_postgresql_v2.pgsql-cluster-1.root_username
      db_password = linode_database_postgresql_v2.pgsql-cluster-1.root_password
      db_list = var.db_list1
      cluster_id = linode_database_postgresql_v2.pgsql-cluster-1.id
      depends_on = [linode_database_postgresql_v2.pgsql-cluster-1]
      providers = {
        postgresql = postgresql
      }
    }

    module "database2" {
      source = "./modules/databases"
      database = "defaultdb"
      db_host = linode_database_postgresql_v2.pgsql-cluster-1.host_primary
      db_port = linode_database_postgresql_v2.pgsql-cluster-1.port
      db_user = linode_database_postgresql_v2.pgsql-cluster-1.root_username
      db_password = linode_database_postgresql_v2.pgsql-cluster-1.root_password
      db_list = var.db_list2
      cluster_id = linode_database_postgresql_v2.pgsql-cluster-1.id
      depends_on = [linode_database_postgresql_v2.pgsql-cluster-1]
      providers = {
        postgresql = postgresql
      }
    }

    resource "local_file" "db_certificate" {
      filename = "${linode_database_postgresql_v2.pgsql-cluster-1.id}.crt"
      content = linode_database_postgresql_v2.pgsql-cluster-1.ca_cert
    }
    ```

    This represents the primary logic of the [root module](https://developer.hashicorp.com/terraform/language/modules#the-root-module) in your Terraform configuration. These Terraform [resources](https://developer.hashicorp.com/terraform/language/resources) and [modules](https://developer.hashicorp.com/terraform/language/modules) are declared:

    - A `linode_database_postgresql_v2` resource named `pgsql-cluster-1`. This is the Managed Database cluster that is provisioned.

        Several parameters, like `engine_id`, refer to variables that are later defined in the `variables.tf` and `terraform.tfvars` files.

        The `allow_list` parameter defines which IP addresses can access the cluster. In this demonstration, all addresses are permitted, but you should restrict this for your cluster. Assign this to a list of address ranges in [CIDR notation](https://www.ipaddressguide.com/cidr) that include the applications that need to access the databases, as well as your Terraform management infrastructure (e.g. the workstation that you have Terraform installed on).

        The `lifecycle` and `timeouts` parameters are assigned values that are compatible with the Linode and database providers. Keep these same values for your deployments.

    - The `database1` and `database2` module declarations both reference files in the `modules/database/` directory, which are created in a later step. These represent two separate database resources within your cluster.

        Several parameters of these modules, like `db_host`, are assigned values provided by the `pgsql-cluster-1` cluster resource, so they rely on the infrastructure being created prior to managing the database layer. The `depends_on` parameter ensures that these database modules are invoked after the cluster resource is created. As before, the `defaultdb` database name is provided for the initial connection to the cluster.

    - A `local_file` resource named `db_certificate` is assigned the `ca_cert` value from the database cluster. This file is created in the root of the Terraform project, and it is used by your applications to securely connect to the database platform.

1. Create a file named `variables.tf` in your `postgres-terraform/` directory and paste in the following snippet:

    ```file {title="postgres-terraform/variables.tf"}
    variable "linode_token" {
      description = "Linode API Personal Access Token"
      sensitive   = true
    }

    variable "db_list1" {
      description = "Databases to exist on cluster. More than 1 DB can be specified here."
      type = list(string)
      default = ["database-1"]
    }

    variable "db_list2" {
      description = "Databases to exist on cluster. More than 1 DB can be specified here."
      type = list(string)
      default = ["database-2"]
    }

    variable "db_clustername" {
      description = "Label for Akamai Cloud system to ID Cluster. This must be unique in your environment. Must be between 3-32 chars, no spec chars except single hyphens"
      type = string
      default = "My-PgSQl-Cluster"
    }

    variable "rdbms_ver"{
      description = "Type and Version of RDBMS. Pull the current supported list via API"
      type = string
      default = "postgresql/17"
    }

    variable "region" {
      description = "Region for DB Cluster"
      type = string
      default = "us-ord"
    }

    variable "db_instance_type" {
      description = "Linode type of DB Cluster Nodes - Storage, RAM and Compute of a single node equals rough DB capacity. Pull the current list from Linode API"
      type = string
      default = "g6-dedicated-4"
    }

    variable "cluster_nodes" {
      description = "Number of Database Cluster Nodes must equal 1, 2 or 3"
      type = number
      default = 2
    }

    variable "update_hour" {
      description = "Hour to apply RDBMS updates midnight through 11pm = 0-23"
      type = number
      default = 22
    }

    variable "update_day" {
      description = "Day to apply RDBMS updates Sun-Sat= 1-7"
      type = number
      default = 7
    }
    ```

    The variable definitions in this file are referenced in your resource and module declarations to build the database cluster and deploy two databases. The definitions include descriptions to show formatting and describe acceptable values, and a default value. The `rdbms_ver`, `region`, `db_instance_type`, `cluster_nodes`, `update_hour`, and `update_day` variables correspond to the values you decided on in the [Preparing to Deploy](#preparing-to-deploy) section.

1. Create a file named `outputs.tf` in your `postgres-terraform/` directory and paste in the following snippet:

    ```file {title="postgres-terraform/outputs.tf"}
    output "database_password" {
      value = linode_database_postgresql_v2.pgsql-cluster-1.root_password
      sensitive = true
      description = "The password associated to the admin username"
    }

    output "database_username" {
      value = linode_database_postgresql_v2.pgsql-cluster-1.root_username
      sensitive = true
      description = "The admin username"
    }

    output "database_fqdn" {
      value = linode_database_postgresql_v2.pgsql-cluster-1.host_primary
      description = "The fqdn you can use to access the DB"
    }

    output "db_certificate" {
      value = linode_database_postgresql_v2.pgsql-cluster-1.ca_cert
      sensitive = true
      description = "The certificate used for DB Connections"
    }

    output "database_port" {
      value = linode_database_postgresql_v2.pgsql-cluster-1.port
      description = "The TCP Port used by the database"
    }

    output "database_id" {
      description = "The cluster ID used by Akamai"
      value = linode_database_postgresql_v2.pgsql-cluster-1.id
    }

    output "database1_created_databases" {
      value = module.database1.databases
      description = "List of databases created by database1 module"
    }

    output "database2_created_databases" {
      value = module.database2.databases
      description = "List of databases created by database2 module"
    }
    ```

    This is a set of [Terraform output](https://developer.hashicorp.com/terraform/language/values/outputs) definitions. Terraform outputs print their values to the command line when the Terraform configuration is applied. The values from these outputs are later used with the `psql` client to connect to the database cluster.

1.  Inside your `postgres-terraform/` directory, create a `modules/` directory and a `databases/` subdirectory underneath it.

    ```command
    mkdir -p postgres-terraform/modules/databases/
    ```

1.  Create a file named `main.tf` in your `postgres-terraform/modules/databases/` directory and paste in the following snippet:

    ```file {title="postgres-terraform/modules/databases/main.tf"}
    terraform {
     required_providers {
       postgresql = {
         source = "a0s/postgresql"
         version = "1.14.0-jumphost-1"
       }
     }
    }

    resource "postgresql_database" "databases" {
      for_each = toset(var.db_list)
      name = each.value
      owner = var.db_user
      depends_on = [var.cluster_id]
      lifecycle {
        ignore_changes = [owner]
      }
    }
    ```

    This is a [child module](https://developer.hashicorp.com/terraform/language/modules#child-modules) of the root module. It represents a reusable set of instructions referenced by the root module to create databases in the cluster in a repeatable fashion.

    This module uses the `postgresql_database` resource from the `a0s/postgres` provider to create our databases.

1.  Create a file named `variables.tf` in your `postgres-terraform/modules/databases/` directory and paste in the following snippet:

    ```file {title="postgres-terraform/modules/databases/variables.tf"}
    variable "db_host" {
      description = "host connection string"
      type = string
    }

    variable "db_port" {
      description = "cluster port"
      type = number
    }

    variable "db_user" {
      description = "admin cluster user"
      type = string
      sensitive = true
    }

    variable "db_password" {
      description = "admin user pass"
      type = string
      sensitive = true
    }

    variable "db_list" {
      description = "list of dbs"
      type = list(string)
    }

    variable "cluster_id" {
      description = "id of cluster"
      type = string
    }

    variable "database" {
      description = "db to connect to"
      type = string
    }
    ```

    These variables are assigned values in the `module` declarations of the `main.tf` file in the root module (in step 1 of this section).

1.  Create a file named `outputs.tf` in your `postgres-terraform/modules/databases/` directory and paste in the following snippet:

    ```file {title="postgres-terraform/modules/databases/outputs.tf"}
    output "databases" {
      value   	= keys(postgresql_database.databases)
      description = "List of created databases"
    }
    ```

    The `databases` output is a list of the names of the databases created, and it is referenced in the `database1_created_databases` and `database2_created_databases` outputs of the root module.

## Provision the Managed PostgreSQL Cluster with Terraform

The Terraform configuration is now complete and ready to be used to create infrastructure:

1. While inside the root `postgres-terraform/` project directory, run Terraform's `init` command.

    ```command
    cd postgres-terraform/
    terraform init
    ```

    This command downloads the Linode and PostgreSQL providers to the local execution environment and ensure you have everything in place to build your project:

    ```output
    Initializing the backend...
    Initializing modules...
    Initializing provider plugins...
    - Finding a0s/postgresql versions matching "1.14.0-jumphost-1"...
    - Finding linode/linode versions matching "2.35.1"...
    - Installing linode/linode v2.35.1...
    - Installed linode/linode v2.35.1 (signed by a HashiCorp partner, key ID F4E6BBD0EA4FE463)
    - Installing a0s/postgresql v1.14.0-jumphost-1...
    - Installed a0s/postgresql v1.14.0-jumphost-1 (self-signed, key ID 5A0BE9D2989FD2A2)
    Terraform has been successfully initialized!
    ```

1. Run Terraform's `plan` command:

    ```command
    terraform plan
    ```

    This performs a test run of your configuration and ensures it is syntactically correct. This command also asks for your Linode API token, but it does not actually use it to create infrastructure.

    A summary of proposed changes is displayed, along with any warnings.

    {{< note >}}
    The configuration from the previous section results in a warning, but this is expected:

    ```output
    │ Warning: Redundant ignore_changes element
    │on main.tf line 1, in resource "linode_database_postgresql_v2" "pgsql-cluster-1":
    │1: resource "linode_database_postgresql_v2" "pgsql-cluster-1" {
    │ Adding an attribute name to ignore_changes tells Terraform to ignore future changes to the argument in configuration after the object has been created, retaining the value originally configured.
    │ The attribute host_primary is decided by the provider alone and therefore there can be no configured value to compare with. Including this attribute in ignore_changes has no effect. Remove the attribute from
    │ ignore_changes to quiet this warning.
    ```

    In order to combine database management and infrastructure management in the configuration, we must use lifecycle policies to ignore changes to the `host_primary` attribute. The PostgreSQL provider generates a warning for this. Since this value doesn't actually change, it is safe to ignore future changes to the value. This should be fixed in a future version of the Linode Terraform provider.
    {{< /note >}}


1. If there are no errors (aside from the warning that was described), you can run Terraform's `apply` command.

    ```command
    terraform apply
    ```

    You should be prompted by the command for your personal access token.

1. Terraform shows a summary of the proposed changes and asks if you would like to proceed. Enter `yes` for this prompt.

1. The build process begins, but it can take time to complete. Once complete, Terraform provides a summary of successful actions and a list of non-sensitive outputs, like below:

    ```output
    Plan: 4 to add, 0 to change, 0 to destroy.
    Changes to Outputs:

    database1_created_databases = ["database-1", ]
    database2_created_databases = ["database-2", ]
    database_fqdn = (known after apply)
    database_id = (known after apply)
    database_password = (sensitive value)
    database_port = (known after apply)
    database_username = (sensitive value)
    db_certificate = (sensitive value) ╷

    │ Warning: Redundant ignore_changes element

    linode_database_postgresql_v2.pgsql-cluster-1: Creating...
    linode_database_postgresql_v2.pgsql-cluster-1: Still creating... [7m30s elapsed] linode_database_postgresql_v2.pgsql-cluster-1: Creation complete after 7m35s [id=258475] local_file.db_certificate: Creating... module.database1.postgresql_database.databases["database-1"]: Creating... module.database2.postgresql_database.databases["database-2"]: Creating... local_file.db_certificate: Creation complete after 0s [id=9ff519506c470ac8707472757a0880365d7bde03] module.database2.postgresql_database.databases["database-2"]: Creation complete after 1s [id=database-2]
    module.database1.postgresql_database.databases["database-1"]: Creation complete after 1s [id=database-1]
    Apply complete! Resources: 4 added, 0 changed, 0 destroyed.
    Outputs:
    database1_created_databases = [ "database-1", ]
    database2_created_databases = [ "database-2", ]
    database_fqdn = "a258475-akamai-prod-3474339-default.g2a.akamaidb.net"
    database_id = "258475"
    database_password = <sensitive>
    database_port = 26010
    database_username = <sensitive>
    db_certificate = <sensitive>
    ```

## Connect to the Managed PostgreSQL Cluster with psql

You should now have a fully functional PostgresSQL cluster running on the Akamai Cloud Managed Database service with two databases. You can now test access to the cluster using the `psql` command:

1. Gather the information needed for the connection from Terraform's outputs. This information was displayed after the `terraform apply` command completed, but you can also run Terraform's `output` command to retrieve it:

    ```command
    terraform output
    ```

1. The output from this command hides sensitive information by default, like the `database_username` and `database_password` outputs. Use the `-raw` flag to reveal the password:

    ```command
    terraform output -raw database_password
    ```

    This password is later used by the `psql` command, so record it in a temporary note on your workstation.

1. Run the following commands to create environment variables in your terminal for your database FQDN, port, and username:

    ```command
    psqlhost=$(terraform output -raw database_fqdn)
    psqlport=$(terraform output -raw database_port)
    psqluser=$(terraform output -raw database_username)
    ```

1. Use the `psql` command to connect to your new cluster and verify the databases exist:

    ```command
    psql -h$psqlhost -ddefaultdb -U$psqluser -p$psqlport
    ```

    You are prompted for your password. Copy and paste the output from the previous `terraform output -raw database_password` command at this prompt. A successful connection displays output like the following:

    ```output
    psql (14.17 (Ubuntu 14.17-0ubuntu0.22.04.1), server 17.4)
    WARNING: psql major version 14, server major version 17.
    Some psql features might not work.
    SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
    Type "help" for help.

    defaultdb=>
    ```

1. At the database prompt, enter the `\l` command:

    ```command {title="Database prompt"}
    defaultdb=> \l
    ```

    The two databases from the Terraform configuration, `database-1` and `database-2`, are listed in the output:

    ```output
    List of databases

    Name | Owner | Encoding | Collate | Ctype | Access privileges

    ------------+----------+----------+-------------+-------------+-----------------------

    _aiven | postgres | UTF8 | en_US.UTF-8 | en_US.UTF-8 | =T/postgres +

    database-1 | akmadmin | UTF8 | en_US.UTF-8 | en_US.UTF-8 |

    database-2 | akmadmin | UTF8 | en_US.UTF-8 | en_US.UTF-8 |

    defaultdb | akmadmin | UTF8 | en_US.UTF-8 | en_US.UTF-8 |

    template0 | postgres | UTF8 | en_US.UTF-8 | en_US.UTF-8 | =c/postgres + | | | | | postgres=CTc/postgres

    template1 | postgres | UTF8 | en_US.UTF-8 | en_US.UTF-8 | =c/postgres + | | | | | postgres=CTc/postgres (6 rows)
    ```

1. Enter the `\q` command to exit the database prompt:

    ```command {title="Database prompt"}
    defaultdb=> \q
    ```

## Destroy the Managed PostgreSQL Cluster

If you would like to destroy the database cluster and the underlying compute instances, run Terraform's `destroy` command on your workstation (while inside your `postgres-terraform/` directory):

```command
terraform destroy
```

Destroying this infrastructure stops new costs from accruing for it.

