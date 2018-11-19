---
author:
  name: Linode
  email: docs@linode.com
description: 'Two to three sentences describing your guide.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-11-15
modified: 2018-11-15
modified_by:
  name: Linode
title: "Import Existing Infrastructure to Terraform"
contributor:
  name: Linode
external_resources:
- '[Terraform Import Usage](https://www.terraform.io/docs/import/usage.html)'
- '[Terraform Linode Instance Documentation](https://www.terraform.io/docs/providers/linode/r/instance.html)'
---

Terraform is an Infrastructure as Code tool that allows you to write declarative code to provision and manage servers and services. Typically this means that Terraform manages servers and services throughout the entire life cyle of these resources, from creation to destruction. However, Terraform can also manage existing servers and services. This guide will describe how to import existing Linode infrastructure into Terraform using the official Linode provider plugin.

## Before You Begin

1.  You should have Terraform installed in your development environment, as well as the Linode Terraform provider. You should also have a basic understanding of Terraform resources. To install and learn about Terraform, read our [Use Terraform to Provision Linode Environments](/docs/applications/configuration-management/how-to-build-your-infrastructure-using-terraform-and-linode/) guide.

2.  To use Terraform you must have a valid API access token. For more information on API access tokens, visit our [Getting Started with the Linode API](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token) guide.

3.  This guide uses the Linode CLI to retrieve some information about the Linode infrastructure you will be importing to Terraform. For more information on the setup, installation, and usage of the Linode CLI, check out the [Using the Linode CLI](https://www.linode.com/docs/platform/api/using-the-linode-cli/) guide.

4.  To import a resource into Terraform you issue the `terraform import` command. However, at the time of this writing that command does not create a Terraform resource configuration for you. This means that you have to manually write your own resource configuration, ensuring that all the information matches your existing infrastructure. Additionally, there is no current way to import more than one resource at a time. **All resources must be individually imported**.

## Import a Linode to Terraform

{{< caution >}}
Failure to provide the correct information about your Linode when importing your Linode to Terraform can result in the unwanted alteration or destruction of your Linode. Please follow the instructions provided here carefully. It might be beneficial to practice on a new testing environment Linode before trying to manage production servers.
{{< /caution >}}

### Retrieve Your Linode's ID

1.  Using the Linode CLI, use the List Linodes command to find the ID of your Linode:

        linode-cli linodes list --json --pretty

    {{< output >}}
[
  {
    "id": 11426126,
    "image": "linode/debian9",
    "ipv4": [
      "45.79.147.177"
    ],
    "label": "terraform-import",
    "region": "us-east",
    "status": "running",
    "type": "g6-standard-1"
  }
]
{{< /output >}}

    This command will generate a list of your exisiting Linodes in JSON format. Find the Linode you would like to import by looking for the label of the Linode. In the example above, the Linode is labeled "terraform-import." Copy down the ID of your Linode. We will use this ID to import your Linode to Terraform.

### Create An Empty Resource Configuration

1.  Create a file with the a `.tf` extension and open it in the text editor of your choosing. In this example the file will be named `linode-import.tf`.

1.  Set up your Linode provider block and create an empty resource configuration for your Linode. Be sure to add your API access token to the provider block. Also, choose a local label for your Linode. This label will be used to reference your Linode resource configuration in Terraform, and does not have to match the label of your Linode in the Linode manager.

    {{< file "linode-import.tf" >}}
provider "linode" {
    token = "your_API_access_token"
}

resource "linode_instance" "your_local_label" {}
{{< /file >}}

### Import Your Linode to Terraform

1.  Run the `import` command, supplying your local label, and the ID of your Linode as the last parameter.

        terraform import linode_instance.your_local_label linodeID

    For example:

        terraform import linode_instance.linode_import 11426126

    You should see an output that looks like the following:

    {{< output >}}
linode_instance.terraform-import: Importing from ID "11426126"...
linode_instance.terraform-import: Import complete!
  Imported linode_instance (ID: 11426126)
linode_instance.terraform-import: Refreshing state... (ID: 11426126)

Import successful!

The resources that were imported are shown above. These resources are now in
your Terraform state and will henceforth be managed by Terraform.
{{< /output >}}

    This command will create a `terraform.tfstate` file with information about your Linode. You will use this information to fill out your resource configuration.

1.  To view the information created by `terraform import`, run the `show` command.

        terraform show

    You should see an output similar to the following:

    {{< output >}}
linode_instance.linode-import:
  id = 11426126
  alerts.# = 1
  alerts.0.cpu = 90
  alerts.0.io = 10000
  alerts.0.network_in = 10
  alerts.0.network_out = 10
  alerts.0.transfer_quota = 80
  backups.# = 1
  boot_config_label = My Debian 9 Disk Profile
  config.# = 1
  config.0.comments =
  config.0.devices.# = 1
  config.0.devices.0.sda.# = 1
  config.0.devices.0.sda.0.disk_id = 24170011
  config.0.devices.0.sda.0.disk_label = Debian 9 Disk
  config.0.devices.0.sda.0.volume_id = 0
  config.0.devices.0.sdb.# = 1
  config.0.devices.0.sdb.0.disk_id = 24170012
  config.0.devices.0.sdb.0.disk_label = 512 MB Swap Image
  config.0.devices.0.sdb.0.volume_id = 0
  config.0.devices.0.sdc.# = 0
  config.0.devices.0.sdd.# = 0
  config.0.devices.0.sde.# = 0
  config.0.devices.0.sdf.# = 0
  config.0.devices.0.sdg.# = 0
  config.0.devices.0.sdh.# = 0
  config.0.helpers.# = 1
  config.0.helpers.0.devtmpfs_automount = true
  config.0.helpers.0.distro = true
  config.0.helpers.0.modules_dep = true
  config.0.helpers.0.network = true
  config.0.helpers.0.updatedb_disabled = true
  config.0.kernel = linode/grub2
  config.0.label = My Debian 9 Disk Profile
  config.0.memory_limit = 0
  config.0.root_device = /dev/root
  config.0.run_level = default
  config.0.virt_mode = paravirt
  disk.# = 2
  disk.0.authorized_keys.# = 0
  disk.0.filesystem = ext4
  disk.0.id = 24170011
  disk.0.image =
  disk.0.label = Debian 9 Disk
  disk.0.read_only = false
  disk.0.root_pass =
  disk.0.size = 50688
  disk.0.stackscript_data.% = 0
  disk.0.stackscript_id = 0
  disk.1.authorized_keys.# = 0
  disk.1.filesystem = swap
  disk.1.id = 24170012
  disk.1.image =
  disk.1.label = 512 MB Swap Image
  disk.1.read_only = false
  disk.1.root_pass =
  disk.1.size = 512
  disk.1.stackscript_data.% = 0
  disk.1.stackscript_id = 0
  group = Terraform
  ip_address = 45.79.147.177
  ipv4.# = 1
  ipv4.1835604989 = 45.79.147.177
  ipv6 = 2600:3c03::f03c:91ff:fef6:3ebe/64
  label = terraform-import
  private_ip = false
  region = us-east
  specs.# = 1
  specs.0.disk = 51200
  specs.0.memory = 2048
  specs.0.transfer = 2000
  specs.0.vcpus = 1
  status = running
  swap_size = 512
  type = g6-standard-1
  watchdog_enabled = true
{{< /output >}}

    You will use this information in the next section.

### Fill In Your Linode's Configuration Data

1.  As mentioned above, Terraform does not yet have the ability to create a `.tf` file with the information gathered by `terraform import`, so you must fill in the values by hand. Below is a skeleton of the necessary configuration values and where to find them in the data provided by `terraform show`:

    {{< file "example-skeleton.tf" >}}
provider "linode" {
    token = "Your API Token"
}

resource "linode_instance" "your_local_label" {
    label = label
    region = region
    type = type
    config {
        label = config.0.label
        kernel = config.0.kernel
        root_device = config.0.root_device
        devices {
            sda = {
                disk_label = config.0.devices.0.sda.0.disk_label
            }
            sdb = {
                disk_label = config.0.devices.0.sdb.0.disk_label
            }
        }
    }
    disk {
        label = disk.0.label
        size = disk.0.size
    }
    disk {
        label = disk.1.label
        size = disk.1.size
    }
}
{{< /file >}}

    {{< note >}}
If you have more than two disks, for instance if you have attached a Block Storage Volume, you will need to add those disks to your Linode resource configuration. In order to add a disk, you must add the disk to the `devices` section, as well as create an additional `disk` block.
{{< /note >}}

    {{< note >}}
In some cases you might have more than one configuration profile. If you have more than one configuration profile you must choose which profile to boot from with the `boot_config_label`. For example:

    resource "linode_instance" "linode_import" {
        boot_config_label = "My Debian 9 Disk Profile"
    ...
{{< /note >}}

    The example `linode-import.tf` with all of the values applied looks like the following:

    {{< file "linode-import.tf" >}}
provider "linode" {
    token = "a12b3c4e..."
}

resource "linode_instance" "linode-import" {
    label = "terraform-import"
    region = "us-east"
    type = "g6-standard-1"
    config {
        label = "My Debian 9 Disk Profile"
        kernel = "linode/grub2"
        root_device = "/dev/sda"
        devices {
            sda = {
                disk_label = "Debian 9 Disk"
            }
            sdb = {
                disk_label = "512 MB Swap Image"
            }
        }
    }
    disk {
        label = "Debian 9 Disk"
        size = 50688
    }
    disk {
        label = "512 MB Swap Image"
        size = 512
    }
}
{{< /file >}}

1.  To check for errors in your configuration, you can now run the `plan` command:

        terraform plan

    `terraform plan` shows you the changes that would take place if you were to run `terraform apply`. Running `terraform plan` is a good way to determine if the configuration you provided is exact enough for Terraform to take over management of your Linode.

    Most of the time, if there are changes that will be made, perhaps you have a Private IP address that was not defined in the configuration above, you will be notified by `terraform plan`. It is important to note, however, that you will not be notified about the addition and removal of disks with `terraform plan`, which is why it is vital that you supply the correct information from the `terraform show` command after your initial import.

    For more optional configuration options, visit the [Linode Instance](https://www.terraform.io/docs/providers/linode/r/instance.html) Terraform documentation.

## Import a Domain to Terraform

### Retrieve Your Domain's ID

1.  Using the Linode CLI, use the List Domains command to find the ID of your Domain:

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

    Find the Domain you would like to import and copy down the ID. We will use this ID to import your Domain to Terraform.

### Create an Empty Resource Configuration

1.  Create a `.tf` file and open it in the editor of your choosing. The example here will be named `domain-import.tf`.

2.  Create a Provider block, including your API access token, and an empty Domain resource block. Be sure to give the resource an appropriate label. This label will be used to reference your Domain resource configuration locally within Terraform. In this example the resource has been labeled `domain_import`:

    {{< file "domain-import.tf" >}}
provider "linode" {
    token = "Your API Token"
}

resource "linode_domain" "domain_import" {}
{{< /file >}}

### Import Your Domain to Terraform

1.  Run the `import` command, supplying your local label, and the ID of your Domain as the last parameter.

        terraform import linode_domain.your_local_label domainID

    For example:

        terraform import linode_domain.import_example 1157521

    You should see output similar to the following:

    {{< output >}}
linode_domain.import_example: Importing from ID "1157521"...
linode_domain.import_example: Import complete!
  Imported linode_domain (ID: 1157521)
linode_domain.import_example: Refreshing state... (ID: 1157521)

Import successful!

The resources that were imported are shown above. These resources are now in
your Terraform state and will henceforth be managed by Terraform.
{{< /output >}}

This command will create a `terraform.tfstate` file with information about your Domain. You will use this information to fill out your resource configuration.

1.  To view the information created by `terraform import`, run the `show` command:

        terraform show

    You should see output like the following:

    {{< output >}}
linode_domain.import_example:
  id = 1157521
  description =
  domain = import-example.com
  expire_sec = 0
  group =
  master_ips.# = 0
  refresh_sec = 0
  retry_sec = 0
  soa_email = webmaster@import-example.com
  status = active
  ttl_sec = 0
  type = master
{{< /output >}}

### Fill In Your Domain's Configuration Data

As mentioned above, Terraform does not yet have the ability to create a `.tf` file with the information gathered by `terraform import`, so you must fill in the values by hand. Below is an example of the necessary configuration values:

{{< file "domain-skeleton-example.tf" >}}
provider "linode" {
    token = "1a2b3c..."
}

resource "linode_domain" "domain_import" {
    domain = "import-example.com"
    soa_email = "webmaster@import-example.com"
    type = "master"
}
{{< /file >}}

{{< note >}}
If your Domain `type` is "slave" then you'll also need to provide the `master_ips` block, listing the IP addresses that represent the Master DNS for your Domain
{{< /note >}}

To check for errors in your configuration, you can now run the `plan` command:

    terraform plan

`terraform plan` shows you the changes that would take place if you were to run `terraform apply`. Running `terraform plan` should result in Terraform displaying that no changes are to be made.

For more optional configuration options, visit the [Linode Domain](https://www.terraform.io/docs/providers/linode/r/domain.html) Terraform documentation.

## Import a Block Storage Volume to Terraform

### Retrieve Your Block Storage Volume's ID

1.  Using the Linode CLI, use the List Volumes command to find the ID of your Block Storage Volume:

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

    Find the Block Storage Volume you would like to import and copy down the ID. We will use this ID to import your Volume to Terraform.

### Create an Empty Resource Configuration

1.  Create a `.tf` file and open it in the editor of your choosing. The example here will be named `volume-import.tf`.

1.  Create a Provider block, including your API access token, and an empty Block Storage Volume resource block. Be sure to give the resource an appropriate label. This label will be used to reference your Volume resource configuration locally within Terraform. In this example the resource has been labeled `volume_import`:

    {{< file "volume-import.tf" >}}
provider "linode" {
    token = "Your API Token"
}

resource "linode_volume" "volume_import" {}
{{< /file >}}

### Import Your Volume to Terraform

1.  Run the `import` command, supplying your local label, and the ID of your Volume as the last parameter.

        terraform import linode_volume.your_local_label volumeID

    For example:

        terraform import linode_volume.volume_import 17045

    You should see output similar to the following:

    {{< output >}}
linode_volume.volume_import: Importing from ID "17045"...
linode_volume.volume_import: Import complete!
  Imported linode_volume (ID: 17045)
linode_volume.volume_import: Refreshing state... (ID: 17045)

Import successful!

The resources that were imported are shown above. These resources are now in
your Terraform state and will henceforth be managed by Terraform.
{{< /output >}}

    This command will create a `terraform.tfstate` file with information about your Volume. You will use this information to fill out your resource configuration.

1.  To view the information created by `terraform import`, run the `show` command:

        terraform show

    You should see output like the following:

    {{< output >}}
linode_volume.volume_import:
  id = 17045
  filesystem_path = /dev/disk/by-id/scsi-0Linode_Volume_import-example
  label = import-example
  linode_id = 11426126
  region = us-east
  size = 20
  status = active
{{< /output >}}

### Fill In Your Volume's Configuration Data

As mentioned above, Terraform does not yet have the ability to create a `.tf` file with the information gathered by `terraform import`, so you must fill in the values by hand. Below is an example of the necessary configuration values:

{{< file "volume-import.tf" >}}
provider "linode" {
    token = "1a2b3c..."
}

resource "linode_volume" "volume_import" {
    label = "import-example"
    region = "us-east"
    size = 20
}
{{< /file >}}

{{< note >}}
Though it is not required, it's a good idea to add the size of the Volume so that it can be managed more easily should you ever choose to expand the Volume. It is not possible to reduce the size of a Volume.
{{< /note >}}

To check for errors in your configuration, you can now run the `plan` command:

    terraform plan

`terraform plan` shows you the changes that would take place if you were to run `terraform apply`. Running `terraform plan` should result in Terraform displaying that no changes are to be made.

For more optional configuration options, visit the [Linode Volume](https://www.terraform.io/docs/providers/linode/r/volume.html) Terraform documentation.

## Import a NodeBalancer to Terraform

A NodeBalancer in Terraform is made up of three separate parts: a NodeBalancer, a NodeBalancer Configuration, and NodeBalancer Nodes.

### Retrieve Your NodeBalancer, NodeBalancer Config, NodeBalancer Node IDs

1.  Using the Linode CLI, use the List NodeBalancers command to find the ID of your NodeBalancer:

        linode-cli nodebalancers list --json --pretty

    You should see output similar to the following:

    {{< output >}}
[
  {
    "client_conn_throttle": 0,
    "hostname": "nb-104-237-148-95.newark.nodebalancer.linode.com",
    "id": 40721,
    "ipv4": "104.237.148.95",
    "ipv6": "2600:3c03:1::68ed:945f",
    "label": "terraform-example",
    "region": "us-east"
  }
]
{{< /output >}}

    Find the NodeBalancer you would like to import and copy down the ID. We will use this ID to import your NodeBalancer to Terraform.

1.  Use the List Configs command to find the IDs of your NodeBalancer Configuration by supplying the ID of the NodeBalancer you retrieved in the previous step as the last argument:

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

    Copy down the IDs of your NodeBalancer configurations, you will use them to import your NodeBalancer Configurations to Terraform.

1.  Use the List Nodes command to find the Label and Address of your NodeBalancer Nodes, supplying the ID of your NodeBalancer as the first argument and the ID of your NodeBalancer Configuration as the second:

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

    If you are importing a NodeBalancer, chances are your output lists more than one Node. Copy down the IDs of each Node, you will use them to import your Nodes to Terraform.

### Create Empty Resource Configurations

1.  Create a `.tf` file and open it in the editor of your choosing. The example here will be named `nodebalancer-import.tf`.

2.  Create a Provider block, including your API access token, and empty NodeBalancer and NodeBalancer Configuration resource blocks. Be sure to give the resources appropriate labels. These labels will be used to reference your NodeBalancer and NodeBalancer config resource configurations locally within Terraform. In this example the resources have been labeled `nodebalancer_import` and `nodebalancer_config_import`:

    {{< file "nodebalancer-import.tf" >}}
provider "linode" {
    token = "Your API Token"
}

resource "linode_nodebalancer" "nodebalancer_import" {}

resource "linode_nodebalancer_config" "nodebalancer_config_import" {}

resource "linode_nodebalancer_node" "nodebalancer_node_import" {}
{{< /file >}}

    If you have more than one NodeBalancer Configuration you will need to supply multiple `linode_nodebalancer_config` resource blocks with different labels. The same is true for each NodeBalancer Node requiring an additional `linode_nodebalancer_node` block.

### Import Your NodeBalancer, NodeBalancer Configuration, and NodeBalancer Nodes to Terraform

1.  Run the `import` command for your NodeBalancer, supplying your local label, and the ID of your NodeBalancer as the last parameter.

        terraform import linode_nodebalancer.your_local_label nodebalancerID

    For example:

        terraform import linode_nodebalancer.nodebalancer_import 40721

    You should see output similar to the following:

    {{< output >}}
linode_nodebalancer.nodebalancer_import: Importing from ID "40721"...
linode_nodebalancer.nodebalancer_import: Import complete!
  Imported linode_nodebalancer (ID: 40721)
linode_nodebalancer.nodebalancer_import: Refreshing state... (ID: 40721)

Import successful!

The resources that were imported are shown above. These resources are now in
your Terraform state and will henceforth be managed by Terraform.
{{< /output >}}

1.  Run the `import` command for your NodeBalancer Configuration, supplying your local label, and the ID of your NodeBalancer and the ID of your NodeBalancer Configuration separated by commas as the last argument.

        terraform import linode_nodebalancer_config.local_label nodebalancerID,nodebalancerconfigID

    For example:

        terraform import linode_nodebalancer_config.nodebalancer_config_import 40721,35876

    You should see output similar to the following:

    {{< output >}}
linode_nodebalancer_config.nodebalancer_config_import: Importing from ID "40721,35876"...
linode_nodebalancer_config.nodebalancer_config_import: Import complete!
  Imported linode_nodebalancer_config (ID: 35876)
linode_nodebalancer_config.nodebalancer_config_import: Refreshing state... (ID: 35876)

Import successful!

The resources that were imported are shown above. These resources are now in
your Terraform state and will henceforth be managed by Terraform.
{{< /output >}}

1.  Run the `import` command for you NodeBalancer Nodes, supplying your local label, and the ID of your NodeBalancer, the ID of your NodeBalancer Configuration, and your NodeBalancer Node, separated by commas, as the last argument.

        terraform import linode_nodebalancer_node.local_label nodebalancerID,nodebalancerconfigID,nodebalancernodeOD

    For example:

        terraform import linode_nodebalancer_node.nodebalancer_node_import 40721,35876,327539

    You should see output like the following:

    {{< output >}}
linode_nodebalancer_node.nodebalancer_node_import: Importing from ID "40721,35876,327539"...
linode_nodebalancer_node.nodebalancer_node_import: Import complete!
  Imported linode_nodebalancer_node (ID: 327539)
linode_nodebalancer_node.nodebalancer_node_import: Refreshing state... (ID: 327539)

Import successful!

The resources that were imported are shown above. These resources are now in
your Terraform state and will henceforth be managed by Terraform.
{{< /output >}}


1.  Running `terraform import` creates a `terraform.tfstate` file with information about your NodeBalancer. You will use this information to fill out your resource configuration. To view the information created by `terraform import`, run the `show` command:

        terraform show

    You should see output like the following:

    {{< output >}}
linode_nodebalancer.nodebalancer_import:
  id = 40721
  client_conn_throttle = 0
  created = 2018-11-16T20:21:03Z
  hostname = nb-104-237-148-95.newark.nodebalancer.linode.com
  ipv4 = 104.237.148.95
  ipv6 = 2600:3c03:1::68ed:945f
  label = terraform-example
  region = us-east
  transfer.% = 3
  transfer.in = 0.013627052307128906
  transfer.out = 0.0015048980712890625
  transfer.total = 0.015131950378417969
  updated = 2018-11-16T20:21:03Z

linode_nodebalancer_config.nodebalancer_config_import:
  id = 35876
  algorithm = roundrobin
  check = none
  check_attempts = 2
  check_body =
  check_interval = 5
  check_passive = true
  check_path =
  check_timeout = 3
  cipher_suite = recommended
  node_status.% = 2
  node_status.down = 0
  node_status.up = 1
  nodebalancer_id = 40721
  port = 80
  protocol = http
  ssl_commonname =
  ssl_fingerprint =
  ssl_key =
  stickiness = table

linode_nodebalancer_node.nodebalancer_node_import:
  id = 327539
  address = 192.168.214.37:80
  config_id = 35876
  label = terraform-import
  mode = accept
  nodebalancer_id = 40721
  status = UP
  weight = 100
{{< /output >}}

### Fill In Your NodeBalancer's Configuration Data

As mentioned above, Terraform does not yet have the ability to create a `.tf` file with the information gathered by `terraform import`, so you must fill in the values by hand. Below is an example of the necessary configuration values:

{{< file "nodebalancer-import.tf" >}}
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

To check for errors in your configuration, you can now run the `plan` command:

    terraform plan

`terraform plan` shows you the changes that would take place if you were to run `terraform apply`. Running `terraform plan` should result in Terraform displaying that no changes are to be made.

For more optional configuration options, visit the [Linode NodeBalancer](https://www.terraform.io/docs/providers/linode/r/nodebalancer.html), [Linode NodeBalancer Config](https://www.terraform.io/docs/providers/linode/r/nodebalancer_config.html), and [Linode NodeBalancer Node](https://www.terraform.io/docs/providers/linode/r/nodebalancer_node.html) Terraform documentation.

## Next Steps

Given what you have learned in this guide, you can now import other Linode infrastructure, such as images, SSH keys, access tokens, and StackScripts. For more information on importing these resources, check out of links in the More Information section below.