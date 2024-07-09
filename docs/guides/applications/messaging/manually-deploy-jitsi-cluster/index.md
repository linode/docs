---
slug: manually-deploy-jitsi-cluster
title: "Manually Deploy a Jitsi Cluster on Akamai"
description: "This guide goes over how to manually deploy a scalable Jitsi conferencing cluster with Ansible using provided playbooks."
authors: ["John Dutton","Elvis Segura"]
contributors: ["John Dutton","Elvis Segura"]
published: 2024-07-01
keywords: ['jitsi','conferencing','communications','cluster']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Jitsi Official Documentation](https://jitsi.github.io/handbook/docs/intro/)'
- '[Jitsi Community](https://community.jitsi.org/)'
---

[Jitsi](https://jitsi.org/) is a free, open source video conferencing and communication platform that provides a secure, stable, and free alternative to other popular video conferencing services. With Jitsi, you can use built-in features to limit meeting access with passwords or stream on YouTube so anyone can attend.

This guide walks you through how to create a scalable Jitsi Meet cluster using [Ansible](https://www.ansible.com/). The provided Ansible playbook creates an initial deployment that can then be scaled up or down as needed.

If you wish to deploy Jitsi automatically rather than manually, consider either our single-instance [Jitsi Marketplace deployment](/docs/products/tools/marketplace/guides/jitsi/) or our [Jitsi Cluster Marketplace deployment](/docs/products/tools/marketplace/guides/jitsi-cluster/).

## Architecture Diagram

1.  The manual deployment in this guide provisions a Jitsi cluster where the Jitsi Videobridges (JVB) are scalable components.

1.  Each JVB connects to the singular Jitsi meet instance running XMPP via Prosody on port 5222.

1.  Jicofo (Jitsi Conference Focus) runs on the Jitsi meet instance and is configured to split up load balanced traffic between each JVB instance.

1.  NGINX runs on the meet instance and functions to serve client requests and communicate with internal Jitsi components.

![Jitsi Cluster Reference Architecture](Jitsi-Cluster-Reference-Architecture.svg "Jitsi Cluster Reference Architecture")

### Architecture Components

-   **[Jitsi Videobridge](https://jitsi.org/jitsi-videobridge/) (JVB):** An open source Selective Forwarding Unit (SFU) that runs up to thousands of video streams from a single server.

-   **Jitsi Meet Instance:** A Compute Instance running Prosody for XMPP protocol, Jicofo, and NGINX.

    -   **[Extensible Messaging and Presence Protocol](https://xmpp.org/) (XMPP):** Standard open communication protocol. XMPP uses default ports 5222 and 5269.

    -   **[Prosody](https://prosody.im/):** An XMPP server written in Lua. Uses port 5222 in this architecture.

    -   **[Jitsi Conference Focus](https://github.com/jitsi/jicofo) (Jicofo):** Splits traffic between all JVBs and manages the media sessions for each participant. Directs traffic with Octo (a load balancing routing utility) using round robin protocol.

    -   **[NGINX](https://nginx.org/en/):** The web server used in this architecture.

## Prerequisites and Supported Distributions

### Prerequisites

The following software and components must be installed and configured on your local system in order for the playbooks in this guide to function properly.

-   An installed [Python](https://www.python.org/downloads/) version: 3.8, 3.9

-   Your [Linode API access token](/docs/products/tools/api/get-started/#get-an-access-token)

-   A configured [SSH key pair](/docs/guides/use-public-key-authentication-with-ssh/) along with your public key

-   The [Git](https://git-scm.com/) utility and an active [Github](https://github.com/) account

### Supported Distributions

-   Ubuntu 22.04 LTS

## Clone the __ Github Repository

In order to run the Jitsi deployment in this guide, you must first clone the __ Github repository to your local machine. This repository includes all Ansible playbooks, configuration files, and software installations needed to successfully deploy your Jitsi cluster.

1.  Clone the __ repository. This will clone the repository to a temporary folder on your local machine (`/tmp/linode`):

    ```command
    git clone $GIT_REPO /tmp/linode
    ```

1.  Navigate to your cloned local repository location to begin installation steps:

    ```command
    cd /tmp/linode
    ```

1.  Confirm contents of the repository on your system. You should see contents similar to the following:

    ```output
    SAMPLE_OUTPUT
    ```

## Installation

1.  Using python, create a virtual environment with the virtualenv utility. This isolates dependencies from other packages on your system:

    ```command
    python3 -m virtualenv env
    source env/bin/activate
    pip install -U pip
    ```

1.  Install all packages in the `requirements.txt` file. This includes Ansible collections and required Python packages:

    ```command
    pip install -r requirements.txt
    ansible-galaxy collection install linode.cloud community.crypto
    ```

1.  Confirm installation of Ansible:

    ```command
    SAMPLE_COMMAND
    ```

## Setup

1.  Create and save a strong root password to be used on the deployed Linode instances.

1.  Encrypt both your root password and your Linode APIv4 token using the ansible-vault utility. Replace {{< placeholder "ROOT_PASSWORD" >}} with your root password and {{< placeholder "API_TOKEN" >}} with your Linode APIv4 token.

    The command below also assigns values to the variables `root_pass` and `token` for Ansible to reference later, as well as generates encrypted output:

    ```command
    ansible-vault encrypt_string '{{< placeholder "ROOT_PASSWORD" >}}' --name 'root_pass'
    ansible-vault encrypt_string '{{< placeholder "API_TOKEN" >}}' --name 'token'
    ```

1.  Copy the generated outputs for both `root_pass` and `token`, and save them in the `secret_vars` file located in `group_vars/galera/secret_vars`. Sample output:

    ```output
    root_pass: !vault |
          $ANSIBLE_VAULT;1.1;AES256
          38306438386334663834633634363930343233373066353234616363356534653033346232333538
          3163313031373138383965383739356339663831613061660a666332636564356236656331323361
          61383134663166613462363633646330356561386230383332313564643135343538383161383236
          6432396332643232620a393630633132336134613039666336326337376566383531393464303864
          34306435376534653961653739653232383262613336383837343962633565356546
    token: !vault |
          $ANSIBLE_VAULT;1.1;AES256
          63626538373065363330366332383564383936646262303761323961373033316333646337323035
          3866366532623835386434383733316565656335626163310a666265316466353063386632383733
          35636237393835333835391630356662336234393238616364383132636465303339306539616133
          3235656531666337310a366239383336373738353236633635303864346135616138633466323437
          32366632366331333266666230613835366561613837393036393639653666343538386439343839
          34616331313637393356396330316664663532333631356365633035666566306335316262336337
          66346465626563353438363566343265386164616639343365653934373934303532316239646539
          33366233623864326678
    ```

1.  Using a text editor, open and edit the Linode instance parameters in the `group_vars/jitsi/vars` file. Replace the values for the following variables with your preferred deployment specifications:

    - `ssh_keys`: Your SSH public key
    - `jitsi_type`: Compute Instance type and plan for the Jitsi Meet instance
    - `jvb_type`: Compute Instance type and plan for each JVB instance
    - `region`: The data center region for your cluster
    - `group` and `linode_tags` (optional): The [group or tag](/docs/guides/tags-and-groups/) you wish to apply to your cluster's instances for organizational purposes
    - `soa_email_address`: Your SOA administrator email for DNS records
    - `jvb_cluster_size`: The number of JVB instances in your cluster deployment

    ```file {title="group_vars/jitsi/vars"}
    ssh_keys: {{< placeholder "YOUR_PUBLIC_KEY" >}}
    jitsi_prefix: poc3-jitsi
    jitsi_type: g6-dedicated-2
    jvb_prefix: poc3-jvb
    jvb_type: g6-dedicated-2
    region: us-lax
    image: linode/ubuntu22.04
    group:
    linode_tags:
    soa_email_address: {{< placeholder "administrator@example.com" >}}
    jvb_cluster_size: 2
    ```

    See [Linode API: List Types](https://techdocs.akamai.com/linode-api/reference/get-linode-types) for information on Linode API parameters.

    {{< note title="The jvb_cluster_size variable dynamically scales your cluster size" >}}
    This value determines how many Jitsi Videobridge instances are created in the initial deployment and can be used later to scale your cluster up or down.
    {{< /note >}}

## Provision Your Cluster

1.  Using the ansible-playbook utility, run the `provision.yml` playbook with verbose options so you can see the progress. This stands up your Linode instances and dynamically writes your Ansible inventory to the hosts file. The playbook is complete when ssh is available on all deployed instances.

    ```command
    ansible-playbook -vvv provision.yml
    ```

1.  Run the `site.yml` playbook with the hosts inventory file. This playbook configures and installs all required dependencies in the cluster.

    ```command
    ansible-playbook -vvv -i hosts site.yml
    ```

1.  Once installation completes, visit the Jitsi meet application using the rDNS entry written to the `group_vars/jitsi/vars` file represented by the `domain` variable. Replace {{< placeholder "192.0.2.3" >}} with your IP address.

    -   **Example rDNS entry:** `https://{{< placeholder "192.0.2.3" >}}.ip.linodeusercontent.com`

    ![Jitsi Meet Homepage](jitsi-meet-homepage.jpg "Jitsi Meet Homepage")

## Scaling options

Depending on your needs, you may wish to scale your Jitsi cluster up or down. To do this, you can use the `jvb_cluster_size` variable in `group_vars/jitsi/vars` to manually add or remove instances from your Jitsi cluster.

### Horizontal Up Scaling

1.  Using a text editor, open `group_vars/jitsi/vars`.

1.  Edit the `jvb_cluster_size` variable to the total number of instances you wish to be included in your cluster. For example, if your initial cluster started with 2 instances and you would like to add 2 additional instances, edit the `jvb_cluster_size` variable to read {{< placeholder "4" >}}, and save your changes:

    ```file {title="group_vars/jitsi/vars"}
    ...
    jvb_cluster_size: {{< placeholder "4" >}}
    ...
    ```

1.  To apply the new cluster size to your deployment, run the `provisioner.yml` playbook followed by the `site.yml` playbook:

    ```command
    ansible-playbook -vvv provisioner.yml
    ansible-playbook -vvv -i hosts site.yml
    ```

### Down Scaling

1.  Open `group_vars/jitsi/vars`.

1.  Update the `jvb_cluster_size` variable to the new number of instances you wish to be included in your cluster, and save your changes. Replace {{< placeholder "2" >}} in the example below with your new value:

    ```file {title="group_vars/jitsi/vars"}
    ...
    jvb_cluster_size: {{< placeholder "2" >}}
    ...
    ```

1.  Run the `destroy.yml` playbook using the ansible-playbook utility:

    ```command
    ansible-playbook -vvv destroy.yml
    ```

    {{< note title="destroy.yml removes instances from the end of the cluster" >}}
    When scaling down a cluster, the `destroy.yml` playbook deletes instances starting at the end of your cluster. For example, if there are 4 JVB instances in your cluster and you scale down to a total of 2, the last two (jvb4 and jvb3) are removed first.
    {{< /note >}}

## Benchmarking Your Cluster With WebRTC Perf

`webrtcperf` is an open source utility used to evaluate the performance and quality for WebRTC-based services. To benchmark the performance of your Jitsi cluster, you can run WebRTC Perf from a Docker container. Note that Docker must be loaded and configured prior to running the below `docker run` command.

Replace {{< placeholder "https://192.0.2.3.ip.linodeusercontent.com" >}} with the URL of your Jitsi meet instance (see: [Provision Your Cluster](#provision-your-cluster)):

```command
docker run -it --rm \
    -v /dev/shm:/dev/shm \
    ghcr.io/vpalmisano/webrtcperf \
    --url="https://192.0.2.3.ip.linodeusercontent.com/wat#config.prejoinPageEnabled=false" \
    --show-page-log=false \
    --sessions=6 \
    --tabs-per-session=1
```
