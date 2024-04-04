---
title: "Create a VPC"
title_meta: "Create a VPC on the Linode Platform"
keywords: ["getting started", "deploy", "linode", "linux"]
description: "Learn how to create a new Compute Instance, including choosing a distribution, region, and plan size."
published: 2024-01-09
contributors: ["Linode"]
---

This guide walks you through creating a VPC through the Cloud Manager, Linode CLI, and Linode API.

1. [Get Started](#get-started)
1. [Set the Basic Parameters](#set-the-basic-parameters)
1. [Define Subnets](#define-subnets)
1. [Deploy the VPC](#deploy-the-vpc)
1. [Next Steps](#next-steps)

## Get Started

Open the Create Form in the Cloud Manager or start entering your Linode CLI or Linode API command.

{{< tabs >}}
{{< tab "Cloud Manager" >}}
Log in to the [Cloud Manager](https://cloud.linode.com/), click the **Create** dropdown menu on the top bar, and select *VPC*. This opens the **Create VPC** form.
{{< /tab >}}
{{< tab "Linode CLI" >}}
Within your terminal, paste the command provided below. If you do not have the Linode CLI, review the [Install and Configure the Linode CLI](/docs/products/tools/cli/guides/install/) guide. **Before submitting the request, read through the rest of this document.**

```command
linode-cli vpcs create \
  --description "An optional description" \
  --label vpc-example \
  --region us-east \
  --subnets.label subnet-example \
  --subnets.ipv4 10.0.1.0/24
```
{{< /tab >}}
{{< tab "Linode API" >}}
Within your terminal, enter the API curl request below. Make sure to properly paste in or reference your [API token](/docs/products/tools/api/guides/manage-api-tokens/). For a complete API reference, see the [VPC API endpoints](/docs/api/vpcs/) documentation. **Before submitting the request, read through the rest of this document.**

```command
curl https://api.linode.com/v4/vpcs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -X POST -d '{
    "description": "An optional description",
    "label": "vpc-example",
    "region": "us-east",
    "subnets": [
      {
        "label": "subnet-example",
        "ipv4": "10.0.1.0/24"
      }
    ]
  }'
```
{{< /tab >}}
{{< /tabs >}}

## Set the Basic Parameters

Select the region and enter a label and description for the VPC.

-   **Region:** Select the data center where the VPC should be deployed. Since VPCs do not span multiple data centers, only services within the selected data center can join the VPC. For a list of regions that support VPCs, review [VPCs > Availability](/docs/products/networking/vpc/#availability).

-   **Label:** Enter an alphanumeric string (containing only letters, numbers, and hyphens) to identify the VPC. A good label should provide some indication as to the purpose or intended use of the VPC.

-   **Description:** Adding tags gives you the ability to categorize your Linode services however you wish. If you're a web development agency, you could add a tag for each client you have. You could also add tags for which services are for development, staging, or production.

## Define Subnets

Subnets partition out the VPC into smaller networks, allowing groups of related systems to be separated from other functions of your applications or workloads. At least one subnet is required, though up to 10 can be created for each VPC.

- **Subnet Label:** Enter an alphanumeric string (containing only letters, numbers, and hyphens) to identify the subnet. It should be unique among other subnets in the same VPC and should provide an indication as to its intended usage.

- **Subnet IP Address Range:** VPC subnet ranges must be in the RFC1918 IPv4 address space designated for private networks. That said, it cannot overlap with the `192.168.128.0/17` range set aside for [Private IP addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/#types-of-ip-addresses) on Compute Instances.

Follow the instructions below to create multiple subnets. You are also able to add, edit, and remove subnets from the VPC after it has been created.

{{< tabs >}}
{{< tab "Cloud Manager" >}}
For each additional subnet you wish to create, press the **Add Another Subnet** button within the **Subnets** section. This adds another set of subnet fields to the form.
{{< /tab >}}
{{< tab "Linode CLI" >}}
```command
...
  --subnets.label backend-example-subnet \
  --subnets.ipv4 10.0.4.0/24 \
  --subnets.label frontend-example-subnet \
  --subnets.ipv4 10.0.5.0/24
...
```
{{< /tab >}}
{{< tab "Linode API" >}}
```command
...
    "subnets": [
      {
        "label": "backend-example-subnet",
        "ipv4": "10.0.4.0/24"
      },
      {
        "label": "frontend-example-subnet",
        "ipv4": "10.0.5.0/24"
      }
    ]
...
```
{{< /tab >}}
{{< /tabs >}}

## Deploy the VPC

Once all fields have been entered, you can click the **Create VPC** button in the Cloud Manager or run the Linode CLI or Linode API command. If you are using the Cloud Manager, you are taken to the VPC's details page where you can view and edit the VPC and its subnets.

## Next Steps

Once the VPC has been created, the next step is to start adding services to it. Currently, only Compute Instances can be added to the VPC.

- **Add an Existing Compute Instance to the VPC:** Review the [Assign Existing Compute Instance to a VPC Subnet]() guide.
- **Add a new Compute Instance to the VPC:** To add a new instance, follow the [Create a Compute Instance](/docs/products/compute/compute-instances/guides/create/) workflow and complete the VPC section.