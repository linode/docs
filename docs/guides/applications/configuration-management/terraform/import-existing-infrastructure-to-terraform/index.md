---
slug: import-existing-infrastructure-to-terraform
author:
  name: Linode
  email: docs@linode.com
description: 'This guide will describe how to import existing Linode infrastructure into Terraform using the official Linode provider plugin.'
keywords: ['terraform','configuration management','import']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-12-17
modified: 2020-12-03
modified_by:
  name: Linode
image: ImportExistingInfrastructuretoTerraform.png
title: "Import Existing Infrastructure to Terraform"
contributor:
  name: Linode
external_resources:
- '[Terraform Import Usage](https://www.terraform.io/docs/import/usage.html)'
- '[Terraform Linode Instance Documentation](https://www.terraform.io/docs/providers/linode/r/instance.html)'
aliases: ['/applications/configuration-management/import-existing-infrastructure-to-terraform/','/applications/configuration-management/terraform/import-existing-infrastructure-to-terraform/']
---

Terraform is an orchestration tool that uses declarative code to build, change, and version infrastructure that is made up of server instances and services. You can use [Linode's official Terraform provider](https://www.terraform.io/docs/providers/linode/index.html) to interact with Linode services. Existing Linode infrastructure can be imported and brought under Terraform management. This guide describes how to import existing Linode infrastructure into Terraform using the official Linode provider plugin.

{{< note >}}
[Terraform’s Linode Provider](https://github.com/terraform-providers/terraform-provider-linode) has been updated and now requires Terraform version 0.12+. To learn how to safely upgrade to Terraform version 0.12+, see [Terraform’s official documentation](https://www.terraform.io/upgrade-guides/0-12.html). View [Terraform v0.12’s changelog](https://github.com/hashicorp/terraform/blob/v0.12.0/CHANGELOG.md) for a full list of new features and version incompatibility notes.
{{</ note >}}

## Before You Begin

1.  Terraform and the Linode Terraform provider should be installed in your development environment. You should also have a basic understanding of [Terraform resources](https://www.terraform.io/docs/configuration/resources.html). To install and learn about Terraform, read our [Use Terraform to Provision Linode Environments](/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/) guide.

2.  To use Terraform you must have a valid API access token. For more information on creating a Linode API access token, visit our [Getting Started with the Linode API](/docs/guides/getting-started-with-the-linode-api/#get-an-access-token) guide.

3.  This guide uses the Linode CLI to retrieve information about the Linode infrastructure you import to Terraform. For more information on the setup, installation, and usage of the Linode CLI, check out the [Using the Linode CLI](/docs/products/tools/cli/get-started/) guide.

## Terraform's Import Command

Throughout this guide the `terraform import` command is used to import Linode resources. At the time of writing this guide, the import command **does not generate a Terraform resource configuration**. Instead, it imports your existing resources into Terraform's *state*.

State is Terraform's stored JSON mapping of your current Linode resources to their configurations. You can access and use the information provided by the state to manually create a corresponding resource configuration file and manage your existing Linode infrastructure with Terraform.

Additionally, there is no current way to import more than one resource at a time. **All resources must be individually imported**.

{{< caution >}}
When importing your infrastructure to Terraform, failure to accurately provide your Linode service's ID information can result in the unwanted alteration or destruction of the service. Please follow the instructions provided in this guide carefully. It might be beneficial to use multiple [Terraform Workspaces](https://www.terraform.io/docs/state/workspaces.html) to manage separate testing and production infrastructures.
{{< /caution >}}

## Import a Linode to Terraform

### Retrieve Your Linode's ID

1.  Using the Linode CLI, retrieve a list of all your Linode instances and find the ID of the Linode you would like to manage under Terraform:

        linode-cli linodes list --json --pretty

    {{< output >}}
[
  {
    "id": 11426126,
    "image": "linode/debian9",
    "ipv4": [
    "192.0.2.2"
    ],
    "label": "terraform-import",
    "region": "us-east",
    "status": "running",
    "type": "g6-standard-1"
  }
]
{{< /output >}}

    This command will return a list of your existing Linodes in JSON format. From the list, find the Linode you would like to import and copy down its corresponding `id`. In this example, the Linode's ID is `11426126`. You will use your Linode's ID to import your Linode to Terraform.

### Create An Empty Resource Configuration

1. Ensure you are in your [Terraform project directory](/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/#install-terraform). Create a Terraform configuration file to manage the Linode instance you import in the next section. Your file can be named anything you like, but it must end in `.tf`. Add a Linode provider block with your API access token and an empty `linode_instance` resource configuration block in the file:

    {{< note >}}
The example resource block defines `example_label` as the label. This can be changed to any value you prefer. This label is used to reference your Linode resource configuration within Terraform. It does not have to be the same label originally assigned to the Linode when it was created outside of Terraform.
{{</ note >}}

    {{< file "linode_import.tf" >}}
provider "linode" {
    token = "your_API_access_token"
}

resource "linode_instance" "example_label" {}
{{< /file >}}

### Import Your Linode to Terraform

1. Run the `import` command, supplying the `linode_instance` resource's label, and the Linode's ID that was retrieved in the [Retrieve Your Linode's ID](#retrieve-your-linodes-id) section :

        terraform import linode_instance.example_label linodeID

    You should see a similar output:

    {{< output >}}
linode_instance.example_label: Importing from ID "11426126"...
linode_instance.example_label: Import complete!
  Imported linode_instance (ID: 11426126)
linode_instance.example_label: Refreshing state... (ID: 11426126)

Import successful!

The resources that were imported are shown above. These resources are now in
your Terraform state and will henceforth be managed by Terraform.
{{< /output >}}

    This command will create a `terraform.tfstate` file with information about your Linode. You will use this information to fill out your resource configuration.

1.  To view the information created by `terraform import`, run the `show` command. This command displays a list of key-value pairs representing information about the imported Linode instance.

        terraform show

    You should see an output similar to the following:

        resource "linode_instance" "example_label" {
            backups           = [
                {
                    enabled  = null
                    schedule = null
                },
            ]
            boot_config_label = "My Debian 9 Disk Profile"
            id                = "15375361"
            ip_address        = "97.107.128.70"
            ipv4              = [
                "97.107.128.70",
            ]
            ipv6              = "2600:3c03::f03c:91ff:fee3:8deb/64"
            label             = "terraform-import"
            private_ip        = false
            region            = "us-east"
            specs             = [
                {
                    disk     = 51200
                    memory   = 2048
                    transfer = 2000
                    vcpus    = 1
                },
            ]
            status            = "running"
            swap_size         = 512
            tags              = []
            type              = "g6-standard-1"
            watchdog_enabled  = true

            alerts {
                cpu            = 90
                io             = 10000
                network_in     = 10
                network_out    = 10
                transfer_quota = 80
            }

            config {
                kernel       = "linode/grub2"
                label        = "My Debian 9 Disk Profile"
                memory_limit = 0
                root_device  = "/dev/sda"
                run_level    = "default"
                virt_mode    = "paravirt"

                devices {
                    sda {
                        disk_id    = 31813343
                        disk_label = "Debian 9 Disk"
                        volume_id  = 0
                    }

                    sdb {
                        disk_id    = 31813344
                        disk_label = "512 MB Swap Image"
                        volume_id  = 0
                    }
                }

                helpers {
                    devtmpfs_automount = true
                    distro             = true
                    modules_dep        = true
                    network            = true
                    updatedb_disabled  = true
                }
            }

            disk {
                authorized_keys  = []
                authorized_users = []
                filesystem       = "ext4"
                id               = 31813343
                label            = "Debian 9 Disk"
                read_only        = false
                size             = 50688
                stackscript_data = (sensitive value)
                stackscript_id   = 0
            }
            disk {
                authorized_keys  = []
                authorized_users = []
                filesystem       = "swap"
                id               = 31813344
                label            = "512 MB Swap Image"
                read_only        = false
                size             = 512
                stackscript_data = (sensitive value)
                stackscript_id   = 0
            }

            timeouts {}
        }

    You use this information in the next section.

### Fill In Your Linode's Configuration Data

As mentioned in the [Terraform's Import Command](#terraforms-import-command) section, you must manually create your resource configurations when importing existing infrastructure.

1. Fill in the configuration values for the `linode_instance` resource block. In the example below, the necessary values were collected from the output of the `terraform show` command applied in Step 2 of the [Import Your Linode to Terraform](#import-your-linode-to-terraform) section. The file's comments indicate the corresponding keys used to determine the values for the `linode_instance` configuration block.

    {{< file "linode_instance_import.tf" >}}
provider "linode" {
    token = "a12b3c4e..."
}

resource "linode_instance" "example_label" {
    label = "terraform-import" #label
    region = "us-east"         #region
    type = "g6-standard-1"     #type
    config {
        label = "My Debian 9 Disk Profile"     #config.label
        kernel = "linode/grub2"                #config.kernel
        root_device = "/dev/sda"               #config.root_device
        devices {
            sda {
                disk_label = "Debian 9 Disk"    #config.devices.sda.disk_label
            }
            sdb {
                disk_label = "512 MB Swap Image" #config.devices.sdb.disk_label
            }
        }
    }
    disk {
        label = "Debian 9 Disk"      #disk.label (filesystem = "ext4")
        size = "50688"               #disk.size
    }
    disk {
        label = "512 MB Swap Image"  #disk.1.label (filesystem = "swap")
        size = "512"                 #disk.1.size
    }
}
{{</ file >}}

    {{< note >}}
If your Linode uses more than two disks (for instance, if you have attached a [Block Storage Volume](/docs/products/storage/block-storage/)), you need to add those disks to your Linode resource configuration block. In order to add a disk, you must add the disk to the `devices` stanza and create an additional `disk` stanza.
    {{</ note >}}

    {{< note >}}
If you have more than one [configuration profile](/docs/guides/linode-configuration-profiles/), you must choose which profile to boot from with the `boot_config_label` key. For example:

    resource "linode_instance" "example_label" {
        boot_config_label = "My Debian 9 Disk Profile"
    ...
{{</ note >}}

1.  To check for errors in your configuration, run the `plan` command:

        terraform plan

    `terraform plan` shows you the changes that would take place if you were to apply the configurations with a `terraform apply`. Running `terraform plan` is a good way to determine if the configuration you provided is exact enough for Terraform to take over the management of your Linode.

    {{< caution >}}
  Running `terraform plan` displays any changes that are applied to your existing infrastructure based on your configuration file(s). However, you will **not be notified** about the **addition and removal of disks** with `terraform plan`. For this reason, it is vital that the values you include in your `linode_instance` resource configuration block match the values generated from running the `terraform show` command.
    {{</ caution >}}

1. Once you have verified the configurations you provided in the `linode_instance` resource block, you are ready to begin managing your Linode instance with Terraform. Any changes or updates can be made by:

      - updating your `linode_instance_import.tf` file
      - verifying the changes with the `terrform plan` command
      - applying the changes with the `terraform apply` command

    For more available configuration options, visit the [Linode Instance](https://www.terraform.io/docs/providers/linode/r/instance.html) Terraform documentation.

## Import a Domain to Terraform

### Retrieve Your Domain's ID

1. Using the Linode CLI, retrieve a list of all your domains to find the ID of the domain you would like to manage under Terraform:

        linode-cli domains list --json --pretty

    You should see output like the following:

    {{< output >}}
[
  {
    "domain": "import-example.com",
    "id": 1157521,
    "soa_email": "webmaster@import-example.com",
    "status": "active",
    "type": "master"
  }
]
{{< /output >}}

    Find the domain you would like to import and copy down the ID. You need this ID to import your domain to Terraform.

### Create an Empty Resource Configuration

1. Ensure you are in your [Terraform project directory](/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/#install-terraform). Create a Terraform configuration file to manage the domain you import in the next section. Your file can be named anything you like, but must end in `.tf`. Add a Linode provider block with your API access token and an empty `linode_domain` resource configuration block to the file:

    {{< file "domain_import.tf" >}}
provider "linode" {
    token = "Your API Token"
}

resource "linode_domain" "example_label" {}
{{< /file >}}

### Import Your Domain to Terraform

1. Run the `import` command, supplying the `linode_domain` resource's label, and the domain ID that was retrieved in the [Retrieve Your Domain's ID](#retrieve-your-domains-id) section:

        terraform import linode_domain.example_label domainID

    You should see output similar to the following:

    {{< output >}}
linode_domain.example_label: Importing from ID "1157521"...
linode_domain.example_label: Import complete!
  Imported linode_domain (ID: 1157521)
linode_domain.example_label: Refreshing state... (ID: 1157521)

Import successful!

The resources that were imported are shown above. These resources are now in
your Terraform state and will henceforth be managed by Terraform.
{{< /output >}}

      This command will create a `terraform.tfstate` file with information about your domain. You will use this information to fill out your resource configuration.

1. To view the information created by `terraform import`, run the show command. This command displays a list of key-value pairs representing information about the imported domain:

        terraform show

    You should see output like the following:

        resource "linode_domain" "example_label" {
            domain      = "import-example.com"
            expire_sec  = 0
            id          = "1157521"
            master_ips  = []
            refresh_sec = 0
            retry_sec   = 0
            soa_email   = "webmaster@import-example.com"
            status      = "active"
            tags        = []
            ttl_sec     = 0
            type        = "master"
        }

### Fill In Your Domain's Configuration Data

As mentioned in the [Terraform’s Import Command](#terraforms-import-command) section, you must manually create your resource configurations when importing existing infrastructure.

1. Fill in the configuration values for the `linode_domain` resource block. The necessary values for the example resource configuration file were collected from the output of the `terraform show` command applied in Step 2 of the [Import Your Domain to Terraform](#import-your-domain-to-terraform) section.

    {{< file "linode_domain_example.tf" >}}
provider "linode" {
    token = "1a2b3c..."
}

resource "linode_domain" "example_label" {
    domain = "import-example.com"
    soa_email = "webmaster@import-example.com"
    type = "master"
}
    {{< /file >}}

    {{< note >}}
  If your Domain `type` is `slave` then you need to include a `master_ips` key with values set to the IP addresses that represent the Master DNS for your domain.
    {{< /note >}}

1. Check for errors in your configuration by running the `plan` command:

        terraform plan

    `terraform plan` shows you the changes that would take place if you were to apply the configurations with the `terraform apply` command. Running `terraform plan` should result in Terraform displaying that no changes are to be made.

1. Once you have verified the configurations you provided in the `linode_domain` block, you are ready to begin managing your domain with Terraform. Any changes or updates can be made by updating your `linode_domain_example.tf` file, then verifying the changes with the `terrform plan` command, and then finally applying the changes with the `terraform apply` command.

    For more available configuration options, visit the [Linode Domain](https://www.terraform.io/docs/providers/linode/r/domain.html) Terraform documentation.

## Import a Domain Record to Terraform

### Retrieve Your Domain's ID and Your Domain Record's ID

Due to the way the Linode API accesses domain records, you need to provide both the Domain ID and the Domain Record ID to import a Domain Record.

1. Using the Linode CLI, retrieve a list of all your domains to find the ID of the domain that includes the record you would like to manage under Terraform:

        linode-cli domains list --json --pretty

    You should see output like the following:

    {{< output >}}
[
  {
    "domain": "import-example.com",
    "id": 1157521,
    "soa_email": "webmaster@import-example.com",
    "status": "active",
    "type": "master"
  }
]
{{< /output >}}

    Find the domain that contains the record you would like to import and copy down the ID. You will need this ID to import your domain record to Terraform.

1.  Using the Linode CLI, retrieve a list of your domain's records to find the ID of the record you would like to manage under Terraform. Substitute `domainID` with the ID of your domain:

        linode-cli domains records-list domainID --json --pretty

    You should see an output like the following:

    {{< output >}}
[
  {
    "id": 12331520,
    "name": "www",
    "priority": 0,
    "target": "192.0.2.0",
    "ttl_sec": 300,
    "type": "A",
    "weight": 0
  }
]
{{</ output >}}

    Find the ID of the record you would like to import and copy down the ID. You will need this ID to import your domain record to Terraform.

### Create an Empty Resource Configuration

1. Ensure you are in your [Terraform project directory](/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/#install-terraform). Create a Terraform configuration file to manage the domain record you import in the next section. Your file can be named anything you like, but must end in `.tf`. Add a Linode provider block with your API access token and an empty `linode_domain_record` resource configuration block to the file:

    {{< file "domain_record_import.tf" >}}
provider "linode" {
    token = "Your API Token"
}

resource "linode_domain_record" "example_label" {}
{{< /file >}}

### Import Your Domain Record to Terraform

1. Run the `import` command, supplying the `linode_domain_record` resource's label, and the domain ID and domain record ID that were retrieved in the [Retrieve Your Domain's ID and Your Record's ID](#retrieve-your-domains-id-and-your-records-id) section:

        terraform import linode_domain_record.example_label domainID,recordID

    You should see output similar to the following:

    {{< output >}}
linode_domain_record.example_label: Importing from ID "1157521,12331520"...
linode_domain_record.example_label: Import complete!
  Imported linode_domain_record (ID: 12331520)
linode_domain_record.example_label: Refreshing state... (ID: 12331520)

Import successful!

The resources that were imported are shown above. These resources are now in
your Terraform state and will henceforth be managed by Terraform.
{{< /output >}}

      This command will create a `terraform.tfstate` file with information about your domain record. You will use this information to fill out your resource configuration.

1. To view the information created by `terraform import`, run the show command. This command displays a list of key-value pairs representing information about the imported domain:

        terraform show

    You should see output like the following:

        resource "linode_domain_record" "example_label" {
            domain_id   = 1068029
            id          = "12331520"
            name        = "www"
            port        = 80
            priority    = 10
            record_type = "A"
            target      = "192.0.2.0"
            ttl_sec     = 300
            weight      = 5
        }

### Fill In Your Domain Record's Configuration Data

As mentioned in the [Terraform’s Import Command](#terraforms-import-command) section, you must manually create your resource configurations when importing existing infrastructure.

1. Fill in the configuration values for the `linode_domain_record` resource block. The necessary values for the example resource configuration file were collected from the output of the `terraform show` command applied in Step 2 of the [Import Your Domain Record to Terraform](#import-your-domain-record-to-terraform) section.

    {{< file "domain_record_import.tf" >}}
provider "linode" {
    token = "1a2b3c..."
}

resource "linode_domain_record" "example_label" {
    domain_id = "1157521"
    name = "www"
    record_type = "A"
    target = "192.0.2.0"
    ttl_sec = "300"
    port = 80
    priority = 10
    weight = 5
}
    {{< /file >}}

1. Check for errors in your configuration by running the `plan` command:

        terraform plan

    `terraform plan` shows you the changes that would take place if you were to apply the configurations with the `terraform apply` command. Running `terraform plan` should result in Terraform displaying that no changes are to be made.

2. Once you have verified the configurations you provided in the `linode_domain_record` block, you are ready to begin managing your domain record with Terraform. Any changes or updates can be made by updating your `domain_record_import.tf` file, then verifying the changes with the `terrform plan` command, and then finally applying the changes with the `terraform apply` command.

    For more available configuration options, visit the [Linode Domain Record](https://www.terraform.io/docs/providers/linode/r/domain_record.html) Terraform documentation.

## Import a Block Storage Volume to Terraform

### Retrieve Your Block Storage Volume's ID

1. Using the Linode CLI, retrieve a list of all your volumes to find the ID of the Block Storage Volume you would like to manage under Terraform:

        linode-cli volumes list --json --pretty

    You should see output similar to the following:

    {{< output >}}
[
  {
    "id": 17045,
    "label": "import-example",
    "linode_id": 11426126,
    "region": "us-east",
    "size": 20,
    "status": "active"
  }
]
{{< /output >}}

    Find the Block Storage Volume you would like to import and copy down the ID. You will use this ID to import your volume to Terraform.

### Create an Empty Resource Configuration

1. Ensure you are in your Terraform project directory. Create a Terraform configuration file to manage the Block Storage Volume you import in the next section. Your file can be named anything you like, but must end in `.tf`. Add a Linode provider block with your API access token and an empty `linode_volume` resource configuration block to the file:

    {{< file "linode_volume_example.tf" >}}
provider "linode" {
    token = "Your API Token"
}

resource "linode_volume" "example_label" {}
{{< /file >}}

### Import Your Volume to Terraform

1. Run the `import` command, supplying the `linode_volume` resource's label, and the volume ID that was retrieved in the [Retrieve Your Block Storage Volume's ID](#retrieve-your-block-storage-volumes-id) section:

        terraform import linode_volume.example_label volumeID

    You should see output similar to the following:

    {{< output >}}
linode_volume.example_label: Importing from ID "17045"...
linode_volume.example_label: Import complete!
  Imported linode_volume (ID: 17045)
linode_volume.example_label: Refreshing state... (ID: 17045)

Import successful!

The resources that were imported are shown above. These resources are now in
your Terraform state and will henceforth be managed by Terraform.
{{< /output >}}

    This command will create a `terraform.tfstate` file with information about your Volume. You will use this information to fill out your resource configuration.

1.  To view the information created by `terraform import`, run the `show` command. This command displays a list of key-value pairs representing information about the imported Volume:

        terraform show

    You should see output like the following:

        resource "linode_volume" "example_label" {
            filesystem_path = "/dev/disk/by-id/scsi-0Linode_Volume_test-volume"
            id              = "17045"
            label           = "import-example"
            linode_id       = 11426126
            region          = "us-east"
            size            = 20
            status          = "active"
            tags            = []

            timeouts {}
        }

### Fill In Your Volume's Configuration Data

As mentioned in the [Terraform’s Import Command](#terraforms-import-command) section, you must manually create your resource configurations when importing existing infrastructure.

1. Fill in the configuration values for the `linode_volume` resource block. The necessary values for the example resource configuration file were collected from the output of the `terraform show` command applied in Step 2 of the [Import Your Volume to Terraform](#import-your-volume-to-terraform) section:

    {{< file "linode_volume_example.tf" >}}
provider "linode" {
    token = "1a2b3c..."
}

resource "linode_volume" "example_label" {
    label = "import-example"
    region = "us-east"
    size = "20"
}
    {{< /file >}}

    {{< note >}}
Though it is not required, it's a good idea to include a configuration for the size of the volume. This allows it to be managed more easily should you ever choose to expand the Volume. It is not possible to reduce the size of a volume.
    {{< /note >}}

1. Check for errors in your configuration by running the `plan` command:

        terraform plan

    `terraform plan` shows you the changes that would take place if you were to apply the configurations with the `terraform apply` command. Running `terraform plan` should result in Terraform displaying that no changes are to be made.

1. Once you have verified the configurations you provided in the `linode_volume` block, you are ready to begin managing your Block Storage Volume with Terraform. Any changes or updates can be made by updating your `linode_volume_example.tf` file, then verifying the changes with the `terrform plan` command, and then finally applying the changes with the `terraform apply` command.

    For more optional configuration options, visit the [Linode Volume](https://www.terraform.io/docs/providers/linode/r/volume.html) Terraform documentation.

## Import a NodeBalancer to Terraform

Configuring [Linode NodeBalancers](/docs/guides/getting-started-with-nodebalancers/) with Terraform requires three separate resource configuration blocks: one to create the NodeBalancer, a second for the NodeBalancer Configuration, and a third for the NodeBalancer Nodes.

### Retrieve Your NodeBalancer, NodeBalancer Config, NodeBalancer Node IDs

1. Using the Linode CLI, retrieve a list of all your NodeBalancers to find the ID of the NodeBalancer you would like to manage under Terraform:

        linode-cli nodebalancers list --json --pretty

    You should see output similar to the following:

    {{< output >}}
[
  {
    "client_conn_throttle": 0,
    "hostname": "nb-192-0-2-3.newark.nodebalancer.linode.com",
    "id": 40721,
    "ipv4": "192.0.2.3",
    "ipv6": "2600:3c03:1::68ed:945f",
    "label": "terraform-example",
    "region": "us-east"
  }
]
{{< /output >}}

    Find the NodeBalancer you would like to import and copy down the ID. You will use this ID to import your NodeBalancer to Terraform.

1. Retrieve your NodeBalancer configuration by supplying the ID of the NodeBalancer you retrieved in the previous step:

        linode-cli nodebalancers configs-list 40721 --json --pretty

    You should see output similar to the following:

    {{< output >}}
[
  {
    "algorithm": "roundrobin",
    "check_passive": true,
    "cipher_suite": "recommended",
    "id": 35876,
    "port": 80,
    "protocol": "http",
    "ssl_commonname": "",
    "ssl_fingerprint": "",
    "stickiness": "table"
  }
]
{{< /output >}}

    Copy down the ID of your NodeBalancer configuration, you will use it to import your NodeBalancer configuration to Terraform.

1. Retrieve a list of Nodes corresponding to your NodeBalancer to find the label and address of your NodeBalancer Nodes. Supply the ID of your NodeBalancer as the first argument and the ID of your NodeBalancer configuration as the second:

        linode-cli nodebalancers nodes-list 40721 35876 --json --pretty

    You should see output like the following:

    {{< output >}}
[
  {
    "address": "192.168.214.37:80",
    "id": 327539,
    "label": "terraform-import",
    "mode": "accept",
    "status": "UP",
    "weight": 100
  }
]
{{< /output >}}

    If you are importing a NodeBalancer, chances are your output lists more than one Node. Copy down the IDs of each Node. You will use them to import your Nodes to Terraform.

### Create Empty Resource Configurations

1. Ensure you are in your Terraform project directory. Create a Terraform configuration file to manage the NodeBalancer you import in the next section. Your file can be named anything you like, but must end in `.tf`.

    Add a Linode provider block with your API access token and empty `linode_nodebalancer`, `linode_nodebalancer_config`, and `linode_nodebalancer_node` resource configuration blocks to the file. Be sure to give the resources appropriate labels. These labels are used to reference the resources locally within Terraform:

    {{< file "linode_nodebalancer_example.tf" >}}
provider "linode" {
    token = "Your API Token"
}

resource "linode_nodebalancer" "example_nodebalancer_label" {}

resource "linode_nodebalancer_config" "example_nodebalancer_config_label" {}

resource "linode_nodebalancer_node" "example_nodebalancer_node_label" {}
{{< /file >}}

    If you have more than one NodeBalancer Configuration, you will need to supply multiple `linode_nodebalancer_config` resource blocks with different labels. The same is true for each NodeBalancer Node requiring an additional `linode_nodebalancer_node` block.

### Import Your NodeBalancer, NodeBalancer Configuration, and NodeBalancer Nodes to Terraform

1.  Run the `import` command for your NodeBalancer, supplying your local label and the ID of your NodeBalancer as the last parameter.

        terraform import linode_nodebalancer.example_nodebalancer_label nodebalancerID

    You should see output similar to the following:

    {{< output >}}
linode_nodebalancer.example_nodebalancer_label: Importing from ID "40721"...
linode_nodebalancer.example_nodebalancer_label: Import complete!
  Imported linode_nodebalancer (ID: 40721)
linode_nodebalancer.example_nodebalancer_label: Refreshing state... (ID: 40721)

Import successful!

The resources that were imported are shown above. These resources are now in
your Terraform state and will henceforth be managed by Terraform.
{{< /output >}}

1.  Run the `import` command for your NodeBalancer configuration, supplying your local label, and the ID of your NodeBalancer and the ID of your NodeBalancer configuration separated by commas as the last argument.

        terraform import linode_nodebalancer_config.example_nodebalancer_config_label nodebalancerID,nodebalancerconfigID

    You should see output similar to the following:

    {{< output >}}
linode_nodebalancer_config.example_nodebalancer_config_label: Importing from ID "40721,35876"...
linode_nodebalancer_config.example_nodebalancer_config_label: Import complete!
  Imported linode_nodebalancer_config (ID: 35876)
linode_nodebalancer_config.example_nodebalancer_config_label: Refreshing state... (ID: 35876)

Import successful!

The resources that were imported are shown above. These resources are now in
your Terraform state and will henceforth be managed by Terraform.
{{< /output >}}

1.  Run the `import` command for you NodeBalancer Nodes, supplying your local label, and the ID of your NodeBalancer, the ID of your NodeBalancer Configuration, and your NodeBalancer Node, separated by commas, as the last argument.

        terraform import linode_nodebalancer_node.example_nodebalancer_node_label nodebalancerID,nodebalancerconfigID,nodebalancernodeID


    You should see output like the following:

    {{< output >}}
linode_nodebalancer_node.example_nodebalancer_node_label: Importing from ID "40721,35876,327539"...
linode_nodebalancer_node.example_nodebalancer_node_label: Import complete!
  Imported linode_nodebalancer_node (ID: 327539)
linode_nodebalancer_node.example_nodebalancer_node_label: Refreshing state... (ID: 327539)

Import successful!

The resources that were imported are shown above. These resources are now in
your Terraform state and will henceforth be managed by Terraform.
{{< /output >}}


1.  Running `terraform import` creates a `terraform.tfstate` file with information about your NodeBalancer. You use this information to fill out your resource configuration. To view the information created by `terraform import`, run the `show` command:

        terraform show

    You should see output like the following:

        # linode_nodebalancer.example_nodebalancer_label:
        resource "linode_nodebalancer" "example_nodebalancer_label" {
            client_conn_throttle = 0
            created              = "2019-08-07T15:22:46Z"
            hostname             = "nb-23-92-23-94.newark.nodebalancer.linode.com"
            id                   = "40721"
            ipv4                 = "23.92.23.94"
            ipv6                 = "2600:3c03:1::175c:175e"
            label                = "terraform-import"
            region               = "us-east"
            tags                 = []
            transfer             = {
                "in"    = "0.011997222900390625"
                "out"   = "0.000457763671875"
                "total" = "0.012454986572265625"
            }
            updated              = "2019-08-07T15:22:46Z"
        }

        # linode_nodebalancer_config.example_nodebalancer_config_label:
        resource "linode_nodebalancer_config" "example_nodebalancer_config_label" {
            algorithm       = "roundrobin"
            check           = "none"
            check_attempts  = 2
            check_interval  = 5
            check_passive   = true
            check_timeout   = 3
            cipher_suite    = "recommended"
            id              = "44520"
            node_status     = {
                "down" = "0"
                "up"   = "1"
            }
            nodebalancer_id = 50629
            port            = 80
            protocol        = "http"
            stickiness      = "table"
        }

        # linode_nodebalancer_node.example_nodebalancer_node_label:
        resource "linode_nodebalancer_node" "example_nodebalancer_node_label" {
            address         = "192.168.214.37:80"
            config_id       = 35876
            id              = "419783"
            label           = "terraform-import"
            mode            = "accept"
            nodebalancer_id = 50629
            status          = "UP"
            weight          = 100
        }

### Fill In Your NodeBalancer's Configuration Data

As mentioned in the [Terraform’s Import Command](#terraforms-import-command) section, you must manually create your resource configurations when importing existing infrastructure.

1. Fill in the configuration values for all three NodeBalancer resource configuration blocks. The necessary values for the example resource configuration file were collected from the output of the `terraform show` command applied in Step 4 of the [Import Your NodeBalancer, NodeBalancer Configuration, and NodeBalancer Nodes to Terraform](#import-your-nodebalancer-nodebalancer-configuration-and-nodebalancer-nodes-to-terraform) section:

    {{< file "linode_nodebalancer_example.tf" >}}
provider "linode" {
    token = "1a2b3c..."
}

resource "linode_nodebalancer" "nodebalancer_import" {
    label = "terraform-example"
    region = "us-east"
}

resource "linode_nodebalancer_config" "nodebalancer_config_import" {
    nodebalancer_id = "40721"
}

resource "linode_nodebalancer_node" "nodebalancer_node_import" {
    label = "terraform-import"
    address = "192.168.214.37:80"
    nodebalancer_id = "40721"
    config_id = "35876"
}
    {{< /file >}}

1. Check for errors in your configuration by running the `plan` command:

        terraform plan

    `terraform plan` shows you the changes that would take place if you were to apply the configurations with the `terraform apply` command. Running `terraform plan` should result in Terraform displaying that no changes are to be made.

1. Once you have verified the configurations you provided in all three NodeBalancer configuration blocks, you are ready to begin managing your NodeBalancers with Terraform. Any changes or updates can be made by updating your `linode_nodebalancer_example.tf` file, then verifying the changes with the `terrform plan` command, and finally, applying the changes with the `terraform apply` command.

    For more available configuration options, visit the [Linode NodeBalancer](https://www.terraform.io/docs/providers/linode/r/nodebalancer.html), [Linode NodeBalancer Config](https://www.terraform.io/docs/providers/linode/r/nodebalancer_config.html), and [Linode NodeBalancer Node](https://www.terraform.io/docs/providers/linode/r/nodebalancer_node.html) Terraform documentation.

## Next Steps

You can follow a process similar to what has been outlined in this guide to begin importing other pieces of your Linode infrastructure such as images, SSH keys, access tokens, and StackScripts. Check out the links in the [More Information](#more-information) section below for helpful information.
