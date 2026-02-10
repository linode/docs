---
slug: deploy-cassandra-multi-datacenters
title: "Deploying Apache Cassandra Across Multiple Data Centers"
description: 'Deploy Apache Cassandra across multiple data centers (MDC) on Akamai cloud computing services. This guide covers VM based, containerized, and Kubernetes (LKE) deployment models; multi data center replication; monitoring with Prometheus and Grafana; cluster security; backup and recovery; and operational best practices for scaling and long term maintenance.'
authors: ["Diana Hoober"]
contributors: ["Diana Hoober"]
published: 2026-01-31
keywords: ['cassandra', 'apache cassandra', 'nosql', 'database', 'distributed database', 'multi-datacenter', 'replication', 'high availability', 'docker', 'kubernetes', 'k8ssandra', 'containers', 'prometheus', 'grafana', 'monitoring', 'security', 'encryption', 'authentication', 'backup', 'disaster recovery', 'scaling', 'block storage', 'object storage', 'vlan', 'lke', 'linode kubernetes engine']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Cassandra](https://cassandra.apache.org/_/index.html)'
- '[Cassandra Documentation](https://cassandra.apache.org/doc/4.1/)'
- '[Cassandra Install Documentation](https://cassandra.apache.org/doc/4.1/cassandra/getting_started/installing.html)'
- '[Cassandra FAQ](https://cassandra.apache.org/doc/4.1/cassandra/faq/index.html)'
- '[Cassandra CQL Documentation](https://cassandra.apache.org/doc/4.1/cassandra/cql/index.html)'
- '[Cassandra Quick Start](https://cassandra.apache.org/_/quickstart.html)'
- '[cassandra.yaml Configuration Guide](https://cassandra.apache.org/doc/4.1/cassandra/configuration/cassandra_config_file.html)'
- '[Data Modeling in Cassandra](https://cassandra.apache.org/doc/4.1/cassandra/data_modeling/intro.html)'
- '[Production Concerns for Cassandra](https://cassandra.apache.org/doc/4.1/cassandra/operating/index.html)'

---

Apache Cassandra is a distributed NoSQL database designed for low-latency replication across geographically separated data centers. Multi-data center deployments reduce latency for your global users, support regional failover, and help you meet data residency requirements.

This guide shows you how to deploy Apache Cassandra across multiple data centers on Akamai cloud computing services. You'll configure multi-data center replication, implement production-ready monitoring and security, and learn operational procedures for scaling and maintenance.

## Why Multi-Data Center Cassandra on Akamai Cloud Computing Services

- Low-latency access for global users
- Regional failover and disaster recovery
- Data residency compliance
- High-performance compute instances
- Private networking (VLANs) between data centers
- Block Storage for data persistence
- Object Storage for backups

### What You'll Deploy

This guide covers three deployment approaches:
- Traditional deployment - Cassandra on Ubuntu 22.04 LTS compute instances
- Container-based deployment - Docker containers
- Kubernetes orchestration - Linode Kubernetes Engine (LKE)

You'll configure multi-datacenter replication, implement monitoring with Prometheus and Grafana, secure your cluster with encryption and authentication, and establish backup procedures using Akamai Object Storage.

### Prerequisites and Preparation

- Active Akamai account with quota for multiple compute instances across regions
- Linux system administration experience
- Familiarity with database concepts and networking
- Working knowledge of Apache Cassandra architecture (nodes, datacenters, replication, and gossip)

```command
<details>
<summary>Choosing a database</summary>
Akamai supports multiple database engines. This guide includes embedded Cassandra installation and configuration steps to support users who choose Cassandra, as it requires more setup than other options. Before proceeding, take a moment to "confirm" that Cassandra aligns with your application’s requirements and your operational experience.
</details>
```

## Architecture and Planning

Cassandra's multi-datacenter architecture distributes data across geographic regions with configurable replication between datacenters. Each datacenter contains multiple nodes organized into racks, with seed nodes facilitating cluster discovery and the NetworkTopologyStrategy enabling independent replication factors per region. For a deeper understanding of Cassandra architecture concepts--including the gossip protocol, consistency levels, and topology awareness--refer to the [Apache Cassandra Architecture](https://cassandra.apache.org/doc/latest/cassandra/architecture/overview.html) documentation.

### Akamai Infrastructure Recommendations

Compute Instance Selection:

| Use Case | Instance Type | Specifications |
|----------|---------------|----------------|
| Development/testing | Shared CPU | 4GB RAM, 2 vCPU |
| Production | Dedicated CPU | 8-16GB RAM, 4-8 vCPU |
| High-performance workloads | Premium CPU | 16-32GB RAM, 8-16 vCPU |

Storage Configuration:

- Boot disk: 25-50GB for OS and Cassandra installation
- Data storage: Block Storage volumes (100GB-1TB per node)
- Performance optimization: Use separate Block Storage volumes for commit logs and data directories

For optimal performance, attach NVMe-backed Block Storage volumes to Dedicated or Premium CPU instances.

Cluster Topology:

Deploy a minimum of 3 nodes per data center (odd numbers preferred to prevent split-brain scenarios) with a replication factor of 3 for production environments. Designate 2+ stable nodes per data center as seed nodes. For capacity planning guidelines and topology best practices, see the [Cassandra Planning](https://cassandra.apache.org/doc/latest/cassandra/managing/operating/hardware.html) documentation.

### Multi-Region Network Planning

**Akamai Data Center Selection**:

Choose data center pairs based on your latency requirements:

**Same-region deployments (< 50ms latency)**:

- **US East**: Newark, Atlanta, Washington DC
- **US West**: Fremont, Los Angeles, Seattle
- **Europe**: London, Frankfurt, Paris

**Cross-region deployments (< 300ms latency)**:

- **Americas**: Newark and Fremont
- **Europe and Americas**: London and Newark
- **Asia-Pacific**: Singapore and Tokyo
- **Global**: Newark, London, Singapore

Network Architecture:

Configure the following Akamai networking features for cluster communication:

- **VLANs**: Create private VLANs for cluster communication within and across data centers
- **Cloud Firewall**: Implement rules limiting access to required Cassandra ports (7000, 9042, 7199)
- **Private IP addresses**: Use private IPs for all node-to-node communication
- **Network interfaces**: 1Gbps+ interfaces (standard on Dedicated and Premium CPU instances)

For complete port requirements and security configuration, see the [Cassandra Security](https://cassandra.apache.org/doc/4.1/cassandra/operating/security.html) documentation.

### Software Versions

#### Instance Sizing Recommendations

| Use Case | Instance Type | Specifications |
|----------|---------------|----------------|
| Development/testing | Shared CPU | 4GB RAM (minimum), 2 vCPU |
| Production | Dedicated CPU | 8-16GB RAM, 4-8 vCPU |
| High-performance workloads | Premium CPU | 16-32GB RAM, 8-16 vCPU |

### Infrastructure Provisioning Order

Deploy infrastructure in this sequence to ensure proper network connectivity:

1. Create VLANs in each data center
2. Provision compute instances in the first data center
3. Provision compute instances in additional data centers
4. Attach Block Storage volumes to each instance
5. Configure Cloud Firewall rules
6. Verify network connectivity between all nodes

## Infrastructure Setup on Akamai Cloud Computing Services

This section covers provisioning the underlying infrastructure for your multi-data center Cassandra deployment. You'll create compute instances across Akamai regions, configure private networking with VLANs, attach persistent storage, and establish firewall rules.

### Compute Instances

Provision compute instances in each selected Akamai data center according to your planning worksheet.

**Instance Selection Guidelines**:

See the [Instance Sizing Recommendations](#instance-sizing-recommendations) table for recommended instance types and specifications based on your workload requirements.

**Operating System**:

Use **Ubuntu 22.04 LTS** across all nodes for consistency in maintenance and troubleshooting.

**Multi-Region Deployment Considerations**

- Deploy primary-region nodes first, then secondary regions.
- Maintain consistent instance specifications within each region.
- Document private and public IPs for all nodes.
- Ensure each region has sufficient node count for quorum and replication.

**Example topology**

- Newark: 3 nodes
- London: 3 nodes
- **Total**: 6 nodes across 2 data centers

### VLAN Architecture

VLANs provide private, low‑latency connectivity between Cassandra nodes.

**Within a data center**

- Use one VLAN per data center.
- Assign private IPs from a dedicated subnet.
- Ensure all nodes in the region share the same VLAN.
- Confirm that the VLAN is created before provisioning compute instances to avoid re-IP operations later
- Record the assigned subnet and VLAN ID in your deployment worksheet for later reference.

**Across data centers**
- Configure VLAN routing between regions.
- Use non‑overlapping private subnets.
- Validate cross-region connectivity and latency between all nodes.
- Verify that firewall rules allow inter-DC Cassandra ports before cluster initialization.

**Example VLAN scheme**:

- Newark VLAN: 10.0.1.0/24
- London VLAN: 10.0.2.0/24

#### Block Storage

Cassandra requires dedicated storage for data and commit logs.

**Volume specifications**:

- **Size**: 100GB-1TB per node (based on data requirements).
- **Performance**: NVMe-backed for production workloads.
- **Attachment**: Attach and mount volumes before installing Cassandra.
- Ensure each volume is attached as a persistent Block Storage device so it survives instance reboots.

**Filesystem and layout**

- Use ext4 or XFS.
- Mount at `/var/lib/cassandra`.
- Optionally user separate volumes for commit logs.
- Format and mount volumes before running `cassandra` for the first time to avoid auto-creating directories on the root disk.

**Example mount points**:

- Data directory: `/var/lib/cassandra/data`
- Commit log directory: `/var/lib/cassandra/commitlog` (if using separate volume)

Cross-data-center VLAN behavior was not tested in this environment but reflects required Akamai Cloud architecture.

### Cloud Firewall Strategy

Cassandra requires specific ports for internode communication, client access, and monitoring. For complete port reference and security considerations, see the [Cassandra Security documentation](https://cassandra.apache.org/doc/4.1/cassandra/operating/security.html).

**Cluster communication**:

- Port 7000/TCP(intra-cluster) – allow from private IPs only
- Port 7001/TCP(encrypted intra-cluster, if internode encryption is enabled) – allow from private IPs only

**Client connections**:

- Port 9042/TCP - allow from application servers

**Monitoring**:

- Port 7199/TCP - allow from monitoring infrastructure

**Management**:

- Port 22/TCP - restrict to administrative IPs

**Outbound traffic**:

- Allow outbound access for package installation and updates
- Apply egress restrictions only if required by policy

**Security Best Practices**:

- Use private IPs for all cluster communication.
- Apply consistent firewall rules across all nodes.
- Document firewall rules in your planning worksheet

### Verifying Network Connectivity

Confirm network connectivity meets your requirements before installing Cassandra.

**Connectivity expectations**:

- Nodes must reach each other over private IPs
- Cross-region latency should align with your replication strategy
- Required ports must be reachable between nodes

**Latency guidelines**

- Intra‑DC: < 10ms
- Same‑region multi‑DC: < 50ms
- Cross‑region: < 300ms

Cross-data-center firewall behavior and latency validation were not tested in this environment but reflect Akamai Cloud architecture.

### Infrastructure Readiness Checklist

Before proceeding to Cassandra installation, confirm:

- ✓ Compute instances provisioned in all data centers
- ✓ VLANs configured with proper IP addressing
- ✓ Block Storage volumes attached and mounted
- ✓ Cloud Firewall rules applied consistently
- ✓ Private connectivity validate across all nodes
- ✓ Cross-region latency is within acceptable ranges
- ✓ Required ports accessible

## Installing Cassandra

This guide uses Apache Cassandra 4.1.x, the current the current stable release recommended for production deployments. Newer major versions may still be in early adoption or require different tooling, so using the stable branch ensures compatibility and predictable behavior on Akamai Cloud Compute.

Because Cassandra 4.1.x is no longer included in Ubuntu’s default package repositories, installation begins by adding the official Apache Cassandra repository. This ensures that all nodes install the correct version and receive updates directly from the Cassandra project.

Ubuntu 22.04 LTS is fully compatible with Cassandra 4.1.x and is the recommended operating system for this deployment guide.

**Installation approach**:

Begin by installing and validating Cassandra on a single node first. Once the installation is confirmed working, repeat the same steps on the remaining nodes to ensure consistency across the cluster.

### Add the Apache Cassandra repository

Create a repository definition:
```command
echo "deb https://debian.cassandra.apache.org 41x main" | sudo tee /etc/apt/sources.list.d/cassandra.sources.list
```
Import the Apache Cassandra GPG key:

```command
sudo curl https://downloads.apache.org/cassandra/KEYS | sudo apt-key add -
```
Note: Debian and Ubuntu are transitioning away from apt-key.  For background about how APT verifies repository signatures or how to manage repository keys using modern gpg‑based methods, refer to the Debian documentation topic [SecureApt](https://wiki.debian.org/SecureApt). If this link becomes unavailable, search the Debian documentation for “SecureApt” or “APT repository key management”.

**Update package lists**:

```command
sudo apt update
```
#### Install Cassandra

Install Cassandra and its dependencies:

```command
sudo apt install cassandra
```
When prompted with "Do you want to continue? [Y/n]" press "Y" and "Enter" to proceed.

Cassandra automatically installs OpenJDK 11 as a dependency, so no separate Java installation is required.

#### Optional: Environment Checks

After installation, confirm your kernel and package versions match expected compatibility. Ubuntu 22.04.5 LTS is generally safe, but minimal images or custom build may vary.
```command
sudo uname -r         # Check kernel version
sudo java -version    # Confirm Java runtime
sudo dpkg -l | grep cassandra    # Check if Cassandra is present
```
You are looking for:

- Linux kernel release (e.g., 5.15.0-164-generic).
- Java 11 OpenJDK, not Oracle Java.
- A Cassandra package entry similar to: `ii  cassandra  4.1.x  all  distributed storage system`

If there is no output Cassandra is not installed.

#### Verify installation on the first node

Check the service status:
```command
sudo nodetool status
```
Press `q` to exit the status view.

#### Verify installation on the second node
Repeat the same check as for the first node.

Test CQL shell access:
```command
cqlsh
```
If the shell does not connect immediately, wait for Cassandra to finish initializing and try again (may take up to 60 seconds to fully initialize). Then type `exit` and press Enter to return to the regular command prompt.

### Key considerations:

- During system updates, select "keep the local version currently installed" when prompted about configuration files. This preserves network and service settings required for cluster connectivity.
- Cassandra requires approximately 60 seconds to initialize - if `cqlsh` connections fail, wait and retry
- Stop the Cassandra service after installation and before performing multi-datacenter configuration:
```command
sudo systemctl stop cassandra
```

- After completing your multi-datacenter configuration, start Cassandra so it loads the new settings:
```command
sudo systemctl start cassandra
```

- Verify that Cassandra is running:**
```command
sudo systemctl status cassandra
```
A healthy node shows`Active: active (running)` in the output. Cassandra may take 30-60 seconds to initialize after a restart.

If the service fails to start, check the logs at `/var/log/cassandra/system.log` for error messages. Use `q` to return to the prompt.

You can also confirm cluster participation:

```command
sudo nodetool status
```
What you should see:

- **Single-node environment:
  One node listed in the **UN (Up/Normal)** state.

- **Multi-node environment:
You should see each node listed with its IP address and state Nodes may briefly appear as UJ (Up/Joining) while they bootstrap

#### If you expect multiple nodes but only see one

This is a common configuration issue. Cassandra nodes will not appear in `nodetool status` unless they can successfully gossip with each other.

Check the following:

- `cluster_name` is identical on all nodes
- `listen_address` and `rpc_address` use the correct IPs (not localhost)
- `seeds` list includes reachable, running seed nodes
- Firewall/security groups allow intra‑node communication on ports 7000/7001
- Datacenter names match across nodes

## Multi‑Datacenter Configuration

After completing the single-node installation and verification steps, you can configure Cassandra for multi‑datacenter (MDC) operation. To add more Cassandra nodes, repeat the installation and configuration steps from this guide on each new compute instance. Each node must:

- Run the same Ubuntu version
- Install the same Cassandra version
- Use its own private IP address
- Have its own DC and rack values
- Start with an empty `/var/lib/cassandra/` directory

This section focuses on Akamai‑specific requirements, and cloud networking considerations. For standard Cassandra MDC behavior, refer to the upstream documentation.

### Upstream Cassandra Documentation

Cassandra maintains version‑specific documentation under `/doc/<version>/`. These links point to the Apache Cassandra 4.1 documentation. Content may evolve over time, but the URLs remain stable.

1. [Multi‑DC Cluster Initialization](https://cassandra.apache.org/doc/latest/cassandra/getting_started/initialize_cluster_multi_dc.html)
2. []`cassandra.yaml` Configuration Reference](https://cassandra.apache.org/doc/4.1/cassandra/configuration/cass_yaml_file.html)
3. [Snitch Architecture](https://cassandra.apache.org/doc/4.1/cassandra/architecture/snitch.html)

You can deploy Cassandra nodes within the same region or across multiple regions. Multi‑region deployments are typically used for geographic redundancy, global applications, or regulatory data‑residency requirements. For guidance on designing multi‑datacenter topologies and understanding how distance affects replication and consistency, refer to the official [Cassandra documentation](https://cassandra.apache.org/doc/4.1/cassandra/architecture/dynamo.html).

### Akamai‑Specific Multi‑DC Requirements

When deploying Cassandra on Akamai Cloud Computing Services:

- Use each node’s private IP address from the Akamai instance details page.
- Ensure nodes are reachable across regions using VPC peering or shared private networks.
- Open required Cassandra ports between regions:
   - 7000 (intra‑node gossip)
   - 7001 (TLS gossip, if enabled)
   - 7199 (JMX)
   - 9042 (CQL)
- Avoid using pre-emptible instances as seed nodes.
- If using block storage, ensure `/var/lib/cassandra/` is mounted on persistent storage.
- Allow **2–3** minutes for initial cross-region gossip convergence.
  During this time, nodes discover each other across datacenters. After convergence, `nodetool status` shows all nodes with status **UN (Up/Normal)** under the correct datacenters.

### Preparing Nodes for Multi‑DC Configuration

Before applying MDC settings, stop Cassandra and remove default data on **every node**. This prevents replication of placeholder data during initial cluster formation.

```command
sudo systemctl stop cassandra
```
Remove default test data.

```command
sudo rm -rf /var/lib/cassandra/*
```
### Configuring `cassandra.yaml` for Multi-DC

Refer to the upstream [Cassandra documentation](https://cassandra.apache.org/doc/4.1/cassandra/configuration/cass_yaml_file.html) for full details.

#### Below are the **Akamai‑specific values** you must set.

Before opening the configuration file, you can search for the line numbers where changes are needed:

```command
grep -n listen_address /etc/cassandra/cassandra.yaml
grep -n rpc_address /etc/cassandra/cassandra.yaml
grep -n seed_provider /etc/cassandra/cassandra.yaml
grep -n cluster_name /etc/cassandra/cassandra.yaml
```
Remember to activate line numbers when you open the configuration file (for example, in Weblish use "alt N").

**Open the configuration file on each node**:

```command
sudo nano /etc/cassandra/cassandra.yaml
```

**Verify the Cluster Name**

Verify that the `cluster_name` is the same on all nodes (this will be towards the top of the file). If it matches, no changes are required–proceed to the next step.

```yaml
cluster_name: 'Test Cluster'
```

**Seed Guidance**

This block appears elsewhere in the configuration file (sometimes prior to `listen_address`). The only change will be to the `- seeds: "IP1,IP2,IP3"` line.

```yaml
seed_provider:
    - class_name: org.apache.cassandra.locator.SimpleSeedProvider
      parameters:
          - seeds: "IP1,IP2,IP3"
```
- List the **local DC’s primary seed first**, followed by secondary seeds from the same DC:
  Example: `"IP1,IP2,IP3"`
- Add **remote DC seeds last**:
  Example: `"IP1,IP2,IP3,IP4"`
- **Use the same seed list for all nodes in the same DC**
- **Do not make every node a seed**


**Listen_address**

Set the node's private Akamai IP.

```yaml
listen_address: 10.0.1.5
```

**rpc_address**

The default value (localhost) binds RPC to the loopback interface only. For a cluster, replace it with the node’s private IP so other nodes and clients can reach it.

```yaml
rpc_address: 10.0.1.5
```

**Snitch**

Required for multi-datacenter deployments.

```yaml
endpoint_snitch: GossipingPropertyFileSnitch
```

**Transport Settings**

Locate the native transport settings in `cassandra.yaml` and confirm these lines are present:

```yaml
start_native_transport: true
native_transport_port: 9042
```
These are the correct defaults.

If they are missing or incorrect, Cassandra may start but clients (including `cqlsh`) will not be able to connect to the node.

Save the file.

### Setting Data Center and Rack Topology

Each node must declare its datacenter and rack so Cassandra can place replicas correctly in a multi-DC cluster. These values must match the snitch configuration you set earlier.

**Note**: The `dc` and `rack` values in this file are your choice. They don't need to match your VM names or cloud regions-–they only need to be consistent across nodes in the same datacenter.

**Edit the topology file on each node:

```command
sudo nano /etc/cassandra/cassandra-rackdc.properties

**Specify the data center and rack**:

```properties
dc=datacenter_name
rack=rack_name
```

**Important**:

If Cassandra has ever been started on this node before you changed the datacenter name, the node will not start because the stored datacenter value won't match the new one.

To avoid this, make sure Cassandra has not yet been started. If it has, stop the service and clear the node's local data before continuing. (See the earlier section "Preparing Nodes for Multi-DC Configuration" for the command used to clear the local data `/var/lib/cassandra/`.)

Then use the following commands to manage the Cassandra service

- Start Cassandra

```command
sudo systemctl start cassandra
```

- Restart Cassandra (use this if Cassandra was already running)

```command
sudo systemctl restart cassandra
```
- Check the service status

```command
sudo systemctl status cassandra
```

These commands help ensure Cassandra loads the updated configuration before you continue with cluster setup.

**Examples**:

Newark DC - Node 1
```properties
dc=newark
rack=rack1
```
Newark DC - Node 2
```properties
dc=newark
rack=rack2
```

London DC - Node 1
```properties
dc=london
rack=rack1
```
London DC - Node 2
```properties
dc=london
rack=rack2
```
#### Topology rules

- Rack names must be unique within their data center.
- Rack names may be reused across different data centers.
- Save the file (Ctrl+X, Y, Enter).

These values are read at startup, so any changes require restarting the node.

#### Starting the Multi-DC Cluster

Start nodes in the correct order to ensure proper cluster formation.

**Note**: The "primary seed" is the first IP address in your seed list. Start that node (whose IP appears first in the seed list) first before starting the other nodes. This ensures clean cluster formation.

1.Start the primary seed in the first data center:

```command
sudo systemctl start cassandra
```

2. Verify the service is running:

```command
sudo systemctl status cassandra
```

3. Start the primary seeds in all other data centers.
4. Wait 2-3 minutes for seeds to discover each other.
5. Start all remaining nodes by starting Cassandra.
6. Wait another 2-3 minutes for full cluster synchronization.

This sequence prevents nodes from  starting in isolation and ensures that gossip converges cleanly across datacenters.

#### Verifying Cluster Formation

From any node:

```command
sudo nodetool status
```

You should see:

- each datacenter listed
- nodes marked **UN (Up / Normal)**
- correct datacenter and rack assignments
- reasonable token distribution across nodes
-

**Example output:**

A healthy two‑node, two‑datacenter cluster will show each node as UN under its correct datacenter. For example (Shown below is the real output from a two‑datacenter cluster created using this guide, included to help you compare your results):

```command
Datacenter: ubuntu-gb-lon
==========================
Status=Up/Down
|/ State=Normal/Leaving/Joining/Moving
--  Address           Load        Tokens  Owns (effective)  Host ID                               Rack
UN  172.239.103.112   70.22 KiB   16      100.0%            3f4354fc-7129-4b20-8acc-9e0888437e11  rack1
Datacenter: ubuntu-us-sea
==========================
UN  172.232.169.242   104.36 KiB  16      100.0%            9cc4c6ce-450a-4a1d-8d32-8cddc8e92cbe  rack1
```

Use the following section if your `nodetool status` output does not match the expected structure shown above.

### Troubleshooting Cluster Formation

If a node does not appear in the UN (Up/Normal) or shows up in the wrong datacenter, check the following:

- Confirm the Cassandra service is running:

 ```command
sudo systemctl status cassandra
```
- Verify the `dc` and `rack` values in `cassandra-rackdc.properties`
- Ensure rack names are unique **within** each datacenter
- Check that the node is using the correct **private IP** in `listen_address`
- Confirm that required ports (7000/7001/7199/9042) are open between regions
- Review logs for gossip, snitch, or connection errors:

 ```command
tail - 100 /var/log/cassandra/system.log
```

This set of checks covers the most common MDC formation issues without repeating earlier troubleshooting steps.

For guidance on creating keyspaces, tables, and working with data, refer to the Apache Cassandra documentation for:

- [CQL Reference](https://cassandra.apache.org/doc/latest/cassandra/developing/cql/cql_singlefile.html)
- [Data Definition (DDL) - includes replication strategies](https://cassandra.apache.org/doc/3.11.13/cassandra/cql/ddl.html)
- [Schema Design](https://cassandra.apache.org/doc/latest/cassandra/developing/data-modeling/data-modeling_schema.html)