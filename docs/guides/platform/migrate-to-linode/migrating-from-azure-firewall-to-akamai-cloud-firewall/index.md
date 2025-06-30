---
slug: migrating-from-azure-firewall-to-akamai-cloud-firewall
title: "Migrating From Azure Firewall to Akamai Cloud Firewall"
description: "Two to three sentences describing your guide."
og_description: "Optional two to three sentences describing your guide when shared on social media. If omitted, the `description` parameter is used within social links."
authors: ["Linode"]
contributors: ["Linode"]
published: 2025-06-30
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

Azure Firewall is a managed firewall service that provides stateful traffic inspection and filtering for Azure Virtual Networks. It allows administrators to define rules based on IP addresses, ports, protocols, and fully qualified domain names (FQDNs). It supports both application-level and network-level filtering.

Linode Cloud Firewall is a network-level firewall service that controls traffic for Linode instances and NodeBalancers, Akamai Cloud’s load balancing service. Cloud Firewalls support inbound and outbound traffic management with Linode instances and inbound traffic for NodeBalancers. It operates at \[Layers 3 and 4\](https://www.akamai.com/glossary/what-are-network-layers), providing IP, protocol, and port filtering.

![][image2]  
\[Source\](https://www.akamai.com/glossary/what-are-network-layers)

This guide covers how to migrate a basic security setup from Azure Firewall to Linode Cloud Firewall, including planning, documenting your configuration, creating equivalent rules on Akamai Cloud, and testing the results.

## \#\# Feature comparison

Before beginning the migration process, it's important to understand the capabilities and limitations of both Azure Firewall and Linode Cloud Firewall. This will help you determine what rules can be migrated directly and where compensatory action are needed.

### \#\#\# What Azure Firewall offers

Azure Firewall inspects both inbound and outbound traffic for Azure Virtual Networks. It supports rule sets for network-level filtering (based on IP addresses, ports, and protocols) and application-level filtering (based on FQDNs and web categories). Administrators can apply threat intelligence filtering to allow or deny traffic from known malicious sources. Azure Firewall integrates with Azure Monitor for logging and provides centralized control over traffic flows across regions and resource groups.

### \#\#\# What Cloud Firewall offers

Linode Cloud Firewall is a Layer 3/4 stateless packet filter. It is designed for simplicity and performance, allowing users to specify rules that allow or deny traffic based on source IP, destination port, and protocol (TCP, UDP, ICMP, and IPEncap). It does not inspect application-layer traffic but is effective at managing access to services based on IP and port-level rules.

### \#\#\# What’s not directly portable

Because Linode Cloud Firewall doesn't currently support Layer 7 inspection, features such as pattern matching, geographic filtering, and rate limiting cannot be replicated natively. These must be implemented at the application level using reverse proxies like NGINX or additional third-party services.

## \#\# Prerequisites and assumptions

This guide assumes access to administrative credentials and CLI tools for both Azure and Akamai Cloud. You should have the ability to view and modify relevant cloud resources in both environments.

### \#\#\# Azure CLI (\`az\`) and permissions

Ensure that the Azure CLI (\`az\`) is installed and configured with the permission to list, view, and modify Azure Firewall and VM instance networking configurations.

### \#\#\# Linode CLI and permissions

Install the Linode CLI and authenticate using a personal access token with permissions for managing Linode instances and firewall rules. While Cloud Firewalls support functionality with NodeBalancers, NodeBalancer permissions are not required for this tutorial.

### \#\#\# Example environment used in this guide

The example used throughout this guide involves an Azure VM instance on a network with traffic governed by an Azure Firewall. The VM instance is configured for several services:

\- Web traffic handled by NGINX on ports \`80\` and \`443\`  
\- PostgreSQL database on port \`5432\`  
\- SSH on port \`22\`  
\- Redis on port \`6379\`

The Azure Firewall is configured with inbound rules to restrict access to known IP addresses.

The equivalent setup on Akamai Cloud will use a single Linode instance running the same services. Linode Cloud Firewall will be used to recreate the access controls previously handled by the Azure Firewall.

**![][image3]**

## \#\# Document your current configuration

Before making changes, it's essential to fully understand your existing Azure VM instance and Azure Firewall configuration. Documenting how traffic flows to your Azure VM—by noting which ports are open and which services are bound to each port—will help ensure that you set up equivalent access controls using Linode Cloud Firewall.

### \#\#\# Review Azure Firewall rules

Use \`az\` or the Azure Portal to export or list your Azure Firewall rules. In the Azure Portal, navigate to your Resource group to see your list of Azure resources. Find the VM instance you're focused on, and click to see its details.

![][image4]

Within the VM details, navigate to \*\***Network settings**\*\*.

![][image5]

Take note of the names of the virtual network and subnet as well as the private IP address for the VM. In the above example, the VM resides in the \`vm-workloads\` subnet of the virtual network called \`my-virtual-network\`. Its private IP address in the virtual network is \`10.0.0.5\`.

Click the virtual network name, then navigate to the \*\***Subnets**\*\* page for the virtual network.

![][image6]

Note the IP address range for the subnet in which your VM resides. In the above example, VM instances in the \`vm-workloads\` subnet will be allocated IP addresses within the \`10.0.0.0/24\` range.

Return to the overview page of your Resource group. Find the Azure Firewall, and click on it.

![][image7]

On the \*\***Details**\*\* page for the Azure Firewall, navigate to \*\***Rules**\*\*. Find the NAT rule collection. Click on it.

![][image8]

On the NAT rule collection page, you will see a list of firewall rules.

![][image9]

The rules in the example above allow traffic from certain sources to specific ports on the Azure Firewall's public IP address (\`20.245.225.123\`), which are then routed through the virtual network to the corresponding port at the private IP address of the VM instance (\`10.0.0.5\`).

To see Azure Firewall rules from the az CLI, first run a command to display the name of the Azure firewall along with its NAT rule collections. Supply the name of your resource group. For example:

\`\`\`command {title="Show firewall and rule collection names"}

| $ az network firewall list \\     \--resource-group my-resource-group \\     \--query '\[\].{Firewall:name,RuleCollections:natRuleCollections\[\].name}' |
| :---- |

\`\`\`

\`\`\`output

| \[  {    "Firewall": "my-virtual-network-Firewall",    "RuleCollections": \[      "my-nat-rule-collection"    \]  }\] |
| :---- |

\`\`\`

Using the name of the Azure firewall and the NAT rule collection, list the firewall rules with the following command:

\`\`\`command {title="List firewall rules"}

| $ az network firewall nat-rule collection show \\     \--resource-group my-resource-group \\     \--firewall-name my-virtual-network-Firewall \\     \--collection-name my-nat-rule-collection \\     \--query 'rules' |
| :---- |

\`\`\`

\`\`\`output

| \[  {    "description": null,    "destinationAddresses": \[      "20.245.225.123"    \],    "destinationPorts": \[      "22"    \],    "name": "SSH",    "protocols": \[      "TCP"    \],    "sourceAddresses": \[      "\*"    \],    "sourceIpGroups": \[\],    "translatedAddress": "10.0.0.5",    "translatedFqdn": null,    "translatedPort": "22"  },  {    "description": null,    "destinationAddresses": \[      "20.245.225.123"    \],    "destinationPorts": \[      "5432"    \],    "name": "PostgreSQL",    "protocols": \[      "TCP"    \],    "sourceAddresses": \[      "174.17.18.21"    \],    "sourceIpGroups": \[\],    "translatedAddress": "10.0.0.5",    "translatedFqdn": null,    "translatedPort": "5432"  },  {    "description": null,    "destinationAddresses": \[      "20.245.225.123"    \],    "destinationPorts": \[      "6379"    \],    "name": "Redis",    "protocols": \[      "TCP"    \],    "sourceAddresses": \[      "174.17.18.21",      "173.230.141.194"    \],    "sourceIpGroups": \[\],    "translatedAddress": "10.0.0.5",    "translatedFqdn": null,    "translatedPort": "6379"  },  {    "description": null,    "destinationAddresses": \[      "20.245.225.123"    \],    "destinationPorts": \[      "80"    \],    "name": "HTTP All",    "protocols": \[      "TCP"    \],    "sourceAddresses": \[      "\*"    \],    "sourceIpGroups": \[\],    "translatedAddress": "10.0.0.5",    "translatedFqdn": null,    "translatedPort": "80"  },  {    "description": null,    "destinationAddresses": \[      "20.245.225.123"    \],    "destinationPorts": \[      "443"    \],    "name": "HTTPS All",    "protocols": \[      "TCP"    \],    "sourceAddresses": \[      "\*"    \],    "sourceIpGroups": \[\],    "translatedAddress": "10.0.0.5",    "translatedFqdn": null,    "translatedPort": "443"  }\] |
| :---- |

\`\`\`

The inbound traffic routing rules for the example in this guide can be diagrammed as follows:

![][image10]

### \#\#\# Plan your rule-mapping strategy

After documenting your Azure networking setup, plan how to translate those rules into the Linode Cloud Firewall’s syntax and feature set.

For this example, core services are exposed on ports \`22\`, \`80\`, \`443\`, \`5432\`, and \`6379\`. The Azure Firewall routes traffic to certain ports (\`5432\` and \`6379\`) on the VM only from an approved IP allowlist, while traffic from any source can reach ports \`22\`, \`80\`, \`443\`. These rules must be faithfully recreated on Linode to maintain equivalent protection.

Create a side-by-side comparison mapping Azure Firewall rules to their Linode Cloud Firewall equivalents. For instance, a rule that allows PostgreSQL traffic (TCP \`5432\`) from a specific IP should be represented as a Linode Cloud Firewall rule allowing TCP traffic on port \`5432\` from that same IP.

### \#\#\# Back up your existing configuration

Before disabling or removing Azure resources, create a backup of all relevant configuration data. Export your existing Azure Firewall DNAT rules by running the following command and saving the outputs to file:

\`\`\`command {title="Save Azure Firewall DNAT rule collections to a file"}

| $ az network firewall nat-rule collection list \\     \--resource-group my-resource-group \\     \--firewall-name my-virtual-network-Firewall \\     \--output json \\     \> firewall-rules.json |
| :---- |

\`\`\`

## \#\# Create equivalent rules on Linode Cloud Firewall

Once the planning and documentation are complete, begin building your new configuration in Akamai Cloud.

### \#\#\# Via dashboard and CLI

Linode Cloud Firewall rules can be managed through the Cloud Manager web interface or via the Linode CLI. This section will demonstrate both methods.

### \#\#\# Enable Linode Cloud Firewall

From the Akamai Cloud Manager, navigate to \*\***Firewalls**\*\*. Click \*\***Create Firewall**\*\*. Specify a label for the Linode Cloud Firewall. Accept the defaults for the inbound and outbound policies. Initially, you do not need to assign any services. You can focus on rule creation first, then associate services later. Click \*\***Create Firewall**\*\*.

Using the Linode CLI, the command to create a firewall would be:

\`\`\`command

| $ linode-cli firewalls create \\     \--rules.inbound\_policy DROP \\     \--rules.outbound\_policy ACCEPT \\     \--label "my-cloud-firewall" |
| :---- |

\`\`\`

\`\`\`output

| ┌---------┬--------------------┬---------┬---------------------┐ │ id      │ label              │ status  │ created             │ ├---------┼--------------------┼---------┼---------------------┤ │ 2420060 │ my-cloud-firewall  │ enabled │ 2025-04-28T17:42:45 │ └---------┴--------------------┴---------┴---------------------┘ |
| :---- |

\`\`\`

Once the Cloud Firewall has been created, you will see an initially empty list of inbound and outbound firewall rules.

![][image11]

### \#\#\# Recreate rules within Akamai Cloud Manager web UI

Recreate each of the rules documented from your Azure Firewall. Within the web UI, create a new rule by clicking \*\***Add An Inbound Rule**\*\*.

Specify a label and description for the rule. For example:

![][image12]

Next, select the protocol and which ports this rule will apply to. You can select from commonly used ports or select \*\***Custom**\*\* to specify a custom port range. For example:

![][image13]

For Sources, specify whether you want the rule to apply to \**all\** IPv4 or IPv6 addresses, or if you want to provide specific IP addresses. If providing specific IP addresses, add them one at a time.

![][image14]

Finally, decide whether the rule is meant to serve as an allowlist (Accept) or denylist (Drop). For this example migration from Azure Firewall, the action would be Accept. Click \*\***Add Rule**\*\*.

Repeat the steps above to recreate all the equivalent rules from the Azure Firewall configuration. After adding all rules, click \*\***Save Changes**\*\*.

### \#\#\# Recreate rules with Linode CLI

When using the web UI, rules must be created one at a time. With the Linode CLI, you can add all rules with a single call of the \[\`rules-update\`\](https://techdocs.akamai.com/linode-api/reference/put-firewall-rules) action for the \[\`firewalls\`\](https://techdocs.akamai.com/linode-api/reference/post-firewalls) command.

First, create a file called \`inbound-rules.json\` with all the inbound rules as a JSON array. For example:

\`\`\`command {title="inbound-rules.json"}

| \[    {      "action": "ACCEPT",      "addresses": {        "ipv4": \[          "173.230.141.194/32",          "174.17.18.21/32"        \]      },      "description": "Redis",      "label": "restrict",      "ports": "6379",      "protocol": "TCP"    },    {      "action": "ACCEPT",      "addresses": {        "ipv4": \[          "174.17.18.21/32"        \]      },      "description": "PostgreSQL",      "label": "restrict",      "ports": "5432",      "protocol": "TCP"    },    {      "action": "ACCEPT",      "addresses": {        "ipv4": \[          "0.0.0.0/0"        \]      },      "description": "SSH",      "label": "allow",      "ports": "22",      "protocol": "TCP"    },    {      "action": "ACCEPT",      "addresses": {        "ipv4": \[          "0.0.0.0/0"        \]      },      "description": "HTTP web",      "label": "allow",      "ports": "80",      "protocol": "TCP"    },    {      "action": "ACCEPT",      "addresses": {        "ipv4": \[          "0.0.0.0/0"        \]      },      "description": "HTTPS web",      "label": "allow",      "ports": "443",      "protocol": "TCP"    } \] |
| :---- |

\`\`\`

With the file in place, run the following Linode CLI command, making sure to supply your Linode Cloud Firewall id.

\`\`\`command

| $ linode-cli firewalls rules-update 2420060 \\     \--inbound "$(cat inbound-rules.json)" |
| :---- |

\`\`\`

\`\`\`output

| ┌-------------┬----------------┬-----------------┬---------┐│ fingerprint │ inbound\_policy │ outbound\_policy │ version │├-------------┼----------------┼-----------------┼---------┤│ 96379b42    │ DROP           │ ACCEPT          │ 2       │└-------------┴----------------┴-----------------┴---------┘inbound                                                                                                                          ┌--------┬--------------------┬-------------┬---------┬-------┬---------┐│ action │ addresses.ipv4     │ description │ label   │ ports │ protocol│├--------┼--------------------┼-------------┼---------┼-------┼---------┤│ ACCEPT │ 173.230.141.194/32,│             │         │       │         │  │        │ 174.17.18.21/32    │ Redis       │ restrict│ 6379  │ TCP     │├--------┼--------------------┼-------------┼---------┼-------┼---------┤│ ACCEPT │ 174.17.18.21/32    │ PostgreSQL  │ restrict│ 5432  │ TCP     │├--------┼--------------------┼-------------┼---------┼-------┼---------┤│ ACCEPT │ 0.0.0.0/0          │ SSH         │ allow   │ 22    │ TCP     │├--------┼--------------------┼-------------┼---------┼-------┼---------┤│ ACCEPT │ 0.0.0.0/0          │ HTTP web    │ allow   │ 80    │ TCP     │├--------┼--------------------┼-------------┼---------┼-------┼---------┤│ ACCEPT │ 0.0.0.0/0          │ HTTPS web   │ allow   │ 443   │ TCP     │ └--------┴--------------------┴-------------┴---------┴-------┴---------┘outbound                                                                                                                          ┌--------┬--------------------┬-------------┬---------┬-------┬---------┐│ action │ addresses.ipv4     │ description │ label   │ ports │ protocol│├--------┼--------------------┼-------------┼---------┼-------┼---------┤ └--------┴--------------------┴-------------┴---------┴-------┴---------┘ |
| :---- |

\`\`\`

### \#\#\# Attach instances to the firewall

With Cloud Firewall rules in place, you can attach multiple Linodes or NodeBalancers to the Cloud Firewall. Note that inbound and outbound rules apply to Linode instances, whereas only inbound rules apply to NodeBalancers.

In the web UI, navigate to the \*\***Linodes**\*\* tab for your Cloud Firewall. Click \*\***Add Linodes to Firewall**\*\*.

![][image15]

Select from the list which Linodes (you can specify multiple Linodes) to assign to this Cloud Firewall. Click \*\***Add**\*\*.

![][image16]

Now, the firewall rules specified will be applied to the Linode(s) you have added.

To assign Linodes to a Cloud Firewall using the Linode CLI, first retrieve the id of the Linode you want to add with the following command:

\`\`\`command

| $ linode-cli linodes list  |
| :---- |

\`\`\`

\`\`\`output

| ┌----------┬-------------┬--------┬---------┬-----------------┐│ id       │ label       │ region │ status  │ ipv4            │├----------┼-------------│--------┼---------┼-----------------┤│ 76033001 │ my-linode   │ us-lax │ running │ 172.235.225.120 │├----------┼-------------│--------┼---------┼-----------------┤│ 76033002 │ my-linode-2 │ us-lax │ running │ 172.221.114.36  │├----------┼-------------│--------┼---------┼-----------------┤│ 76033003 │ my-linode-3 │ us-lax │ running │ 172.218.17.4    │└----------┴-------------┴--------┴---------┴-----------------┘ |
| :---- |

\`\`\`

Next, execute the \[\`device-create\`\](https://techdocs.akamai.com/linode-api/reference/post-firewall-device) action to assign a Linode to the Cloud Firewall, supplying the Linode id and the Cloud Firewall id.

\`\`\`command

| $ linode-cli firewalls device-create \\     \--type linode \--id 76033001 \\     2420060 |
| :---- |

\`\`\`

\`\`\`output

| ┌---------┬---------------------┬---------------------┐ │ id      │ created             │ updated             │ │---------│---------------------│---------------------│ │ 4877449 │ 2025-04-28T18:55:59 │ 2025-04-28T18:55:59 │ └---------┴---------------------┴---------------------┘ |
| :---- |

\`\`\`

## \#\# Test and validate your configuration

After applying rules to your Linode Cloud Firewall, confirm that they behave as expected under real traffic conditions. Note that your firewall configurations may require different testing methods than those listed in this section.

### \#\#\# Simulate expected and blocked traffic

From an IP on the allowlist, test access to each service and confirm that the connection succeeds. Use \`ssh\` to test connections from any IP address. Use \`curl\` to test HTTP and HTTPS traffic through NGINX. For example:

\`\`\`command

| $ curl \-I http://172.235.225.120 |
| :---- |

\`\`\`

\`\`\`output

| HTTP/1.1 200 OKServer: nginx/1.24.0 (Ubuntu)Date: Mon, 28 Apr 2025 21:00:32 GMTContent-Type: text/htmlContent-Length: 615Last-Modified: Mon, 28 Apr 2025 20:58:01 GMTConnection: keep-aliveETag: "680febd9-267"Accept-Ranges: bytes |
| :---- |

\`\`\`

\`\`\`command

| $ curl \-I https://172.235.225.120 |
| :---- |

\`\`\`

\`\`\`output

| HTTP/1.1 200 OKServer: nginx/1.24.0 (Ubuntu)Date: Mon, 28 Apr 2025 21:02:02 GMTContent-Type: text/htmlContent-Length: 615Last-Modified: Mon, 28 Apr 2025 20:58:01 GMTConnection: keep-aliveETag: "6434bbbe-267"Accept-Ranges: bytes |
| :---- |

\`\`\`

Attempt to connect to the PostgreSQL server with the \`psql\` client from an allowed IP address.

\`\`\`command {title="Successful PostgreSQL connection attempt"}

| $ psql \--host 172.236.228.122 \\        \--port 5432 \\        \--username postgres \\        \--passwordPassword: \*\*\*\*\*\*\*\* |
| :---- |

\`\`\`

\`\`\`output

| psql (17.2 (Ubuntu 17.2-1.pgdg20.04+1), server 16.8 (Ubuntu 16.8-0ubuntu0.24.04.1))SSL connection (protocol: TLSv1.3, cipher: TLS\_AES\_256\_GCM\_SHA384, compression: off, ALPN: none)Type "help" for help.postgres=\# |
| :---- |

\`\`\`

From an IP address that is not allowed through the Cloud Firewall rules, the execution will simply hang after prompting for the password.

\`\`\`command {title="Blocked PostgreSQL connection attempt"}

| $ psql \--host 172.236.228.122 \\       \--port 5432 \\       \--username postgres \\       \--passwordPassword: \*\*\*\*\*\*\*\* |
| :---- |

\`\`\`

\`\`\`output

|  |
| :---- |

\`\`\`

Similarly, attempt to connect to Redis with \`redis-cli\`. From an allowed IP address, the result will be as follows:

\`\`\`command {title="Successful Redis connection attempt"}

| $ redis-cli \-h 172.235.225.120 \-p 6379 |
| :---- |

\`\`\`

\`\`\`output

| 172.236.228.122:6379\> INFO Server\# Serverredis\_version:7.0.15…executable:/usr/bin/redis-serverconfig\_file:/etc/redis/redis.confio\_threads\_active:0 |
| :---- |

\`\`\`

From an IP address that is not on the allowlist, the connection attempt will simply hang:

\`\`\`command {title="Blocked Redis connection attempt"}

| $ redis-cli \-h 172.235.225.120 \-p 6379 |
| :---- |

\`\`\`

\`\`\`output

|  |
| :---- |

\`\`\`

### \#\#\# Log and monitor behavior

Linode Cloud Firewall does not provide per-packet or rule-level logging. To verify behavior, rely on logs from the services themselves. For example:

\- NGINX access logs, as configured in individual virtual server configuration files, found in \`/etc/nginx/sites-available\`  
\- SSH authentication logs (\`/var/log/auth.log\`)  
\- Redis logs, typically found in \`/var/log/redis/redis-server.log\`, though this is configurable in \`/etc/redis/redis.conf\`  
\- PostgreSQL logs, typically found in \`/var/log/postgresql/\`, though this is configurable in \`/etc/postgresql/\[PATH-TO-VERISON\]/postgresql.conf\`

Connection and activity logs from these services can help you confirm whether traffic is reaching them as expected.

## \#\# Monitor post-migration performance

Ongoing monitoring helps identify any overlooked configuration issues or unexpected traffic patterns. Continue observing application logs and metrics after the switch. Make sure services are available to intended users and there are no spikes in error rates or timeouts.

If legitimate traffic is being blocked or malicious traffic is being allowed, refine your Linode Cloud Firewall rules. It may take a few iterations to achieve parity with your original Azure Firewall behavior.

## \#\# Finalize your migration

Once you've validated the new firewall configuration, clean up legacy resources and update internal references.

\- Find components that were connecting with your Azure VM instance. Create equivalent Linode Cloud Firewall rules to allow traffic from legitimate components.  
\- Remove the Azure Firewall.  
\- Remove the Azure VM instance.

Update runbooks, internal network diagrams, and configuration documentation to reflect the new firewall architecture based on Linode Cloud Firewall.

The resources below are provided to help you become familiar with Linode Cloud Firewall when migrating from Azure Firewall.

## \#\# Additional Resources

\- Azure  
  \- \[Azure Firewall documentation\](https://learn.microsoft.com/en-us/azure/firewall/)  
  \- \[\`az\` commands related to Azure Firewall rules\](https://learn.microsoft.com/en-us/cli/azure/network/firewall?view=azure-cli-latest)  
\- Akamai  
  \- \[Linode Cloud Manager\](https://cloud.linode.com/)  
  \- \[Linode Cloud Firewall\](https://techdocs.akamai.com/cloud-computing/docs/cloud-firewall)  
  \- Linode CLI commands related to Linode Cloud Firewall  
    \- \[API reference\](https://techdocs.akamai.com/linode-api/reference/post-firewalls)  
    \- \[Example of firewall rule JSON structure\](https://techdocs.akamai.com/linode-api/reference/put-firewall-rules)