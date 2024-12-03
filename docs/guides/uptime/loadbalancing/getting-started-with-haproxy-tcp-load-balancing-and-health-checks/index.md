---
slug: getting-started-with-haproxy-tcp-load-balancing-and-health-checks
title: "Getting Started with HAProxy TCP Load Balancing and Health Checks"
description: "Learn how to install and configure HAProxy for load balancing and health checks on Ubuntu, CentOS Stream, and openSUSE Leap."
authors: ["Tom Henderson"]
contributors: ["Tom Henderson"]
published: 2024-08-21
keywords: ['haproxy','haproxy load balancing','haproxy setup tutorial','haproxy active health checks','haproxy passive health checks','install haproxy on ubuntu','install haproxy on centos','install haproxy on opensuse','haproxy frontend configuration','haproxy backend configuration','haproxy health check configuration']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
 - '[HAProxy Official Documentation](https://www.haproxy.com/documentation/)'

---

[HAProxy](https://www.haproxy.org/) serves as a reverse proxy between frontend client requests and backend server resources, and can be configured at Layer 4 (network) or Layer 7 (application). A common use of HAProxy is as an intelligent network load balancer. In this role, HAProxy routes incoming frontend traffic to designated backend instances. By default, no load balancing is applied, however, HAProxy can be configured to use various load balancing methods, including:

-   **Round Robin**: Distributes incoming connections evenly across all available backend servers by sequentially assigning each new connection to the next server in the pool.
-   **Least Connections**: Directs incoming connections to the backend server with the fewest active connections, helping to balance the load more evenly based on current server utilization.
-   **Health Checks**: Continuously monitors the health of backend servers. Servers that fail health checks are automatically removed from the pool until they recover, ensuring that only healthy servers receive traffic.

This guide demonstrates how to install HAProxy onto three Linux distributions: Ubuntu, CentOS Stream, and openSUSE Leap. It also uses an example WordPress deployment with sample configurations to implement and test HAProxy's TCP load balancing and health check features.

## Before You Begin

1.  To be used as your HAProxy instance, deploy a Compute Instance running one of the `Ubuntu 24.04 LTS`, `CentOS Stream 9`, or `openSUSE Leap 15.6` distributions, and assign the instance to a VLAN. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

    HAProxy can be deployed using a [Nanode](https://www.linode.com/pricing/) plan for testing purposes. See HAProxy's [hardware recommendations](https://www.haproxy.com/documentation/haproxy-enterprise/getting-started/installation/linux/#hardware-recommendations) for production-level workloads.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  This guide uses WordPress backend instances to demonstrate how HAProxy controls network traffic flows at both the TCP/Network (Layer 4) and HTTP/Application (Layer 7) levels. Follow the steps in our [Deploy WordPress through the Linode Marketplace](/docs/marketplace-docs/guides/wordpress/) guide to create three backend WordPress test instances. Fill out all required fields under **WordPress Setup**, and use default values along with the following options:

    -   **The stack you are looking to deploy Wordpress on**: Choose either **LAMP** or **LEMP**.
    -   **Website title**: For each instance, enter `backend1`, `backend2`, and `backend3`, respectively.
    -   **Region**: Select the same location the HAProxy instance is in.
    -   **Linode Plan**: A **Shared CPU**, **Nanode 1 GB** is sufficient to test and demonstrate HAProxy options.
    -   **Linode Label**: Label each instance to correspond with the website titles `backend1`, `backend2`, and `backend3`, respectively.
    -   **VLAN**: Attach the instances to the same VLAN as the HAProxy instance.

    Each server is generated with an `index.html` home page that indicates the given title of the website hosted on the instance (`backend1`, `backend2`, or `backend3`). Open a web browser and navigate to each server's IP address to verify that the example test servers are functioning. Take note of the IP addresses of each backend instance, as they are used later.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Install HAProxy

To install HAProxy, log into the HAProxy instance as your limited sudo user, and complete the steps below.

1.  Select your distribution, and use the command to install HAProxy:

    {{< tabs >}}
    {{< tab "Ubuntu 24.04 LTS" >}}
    Use `apt` to install HAProxy on an Ubuntu 24.04 LTS instance:

    ```command
    sudo apt install haproxy
    ```
    {{< /tab >}}
    {{< tab "CentOS Stream 9" >}}
    Use `dnf` to install HAProxy on a CentOS Stream 9 instance:

    ```command
    sudo dnf install haproxy
    ```
    {{< /tab >}}
    {{< tab "openSUSE Leap 15.6" >}}
    Use `zypper` to install HAProxy on a openSUSE Leap 15.6 instance:

    ```command
    sudo zypper in haproxy
    ```
    {{< /tab >}}
    {{< /tabs >}}

1.  Verify the HAProxy installation by checking the installed version number:

    ```command
    sudo haproxy -v
    ```

    {{< tabs >}}
    {{< tab "Ubuntu 24.04 LTS" >}}
    ```output
    HAProxy version 2.8.5-1ubuntu3 2024/04/01 - https://haproxy.org/
    Status: long-term supported branch - will stop receiving fixes around Q2 2028.
    Known bugs: http://www.haproxy.org/bugs/bugs-2.8.5.html
    Running on: Linux 6.8.0-44-generic #44-Ubuntu SMP PREEMPT_DYNAMIC Tue Aug 13 13:35:26 UTC 2024 x86_64
    ```
    {{< /tab >}}
    {{< tab "CentOS Stream 9" >}}
    ```output
    HAProxy version 2.4.22-f8e3218 2023/02/14 - https://haproxy.org/
    Status: long-term supported branch - will stop receiving fixes around Q2 2026.
    Known bugs: http://www.haproxy.org/bugs/bugs-2.4.22.html
    Running on: Linux 5.14.0-496.el9.x86_64 #1 SMP PREEMPT_DYNAMIC Mon Aug 12 20:37:54 UTC 2024 x86_64
    ```
    {{< /tab >}}
    {{< tab "openSUSE Leap 15.6" >}}
    ```output
    HAProxy version 2.8.6 2024/02/15 - https://haproxy.org/
    Status: long-term supported branch - will stop receiving fixes around Q2 2028.
    Known bugs: http://www.haproxy.org/bugs/bugs-2.8.6.html
    Running on: Linux 6.4.0-150600.23.17-default #1 SMP PREEMPT_DYNAMIC Tue Jul 30 06:37:32 UTC 2024 (9c450d7) x86_64
    ```
    {{< /tab >}}
    {{< /tabs >}}

1.  Use `systemctl` to start HAProxy:

    ```command
    sudo systemctl start haproxy
    ```

1.  Use `systemctl` to configure HAProxy to automatically start after a reboot:

    ```command
    sudo systemctl enable haproxy
    ```

1.  Verify HAProxy is `active (running)`:

    ```command
    systemctl status haproxy
    ```

    ```output
    ● haproxy.service - HAProxy Load Balancer
         Loaded: loaded (/usr/lib/systemd/system/haproxy.service; enabled; preset: enabled)
         Active: active (running) since Tue 2024-09-17 20:37:22 UTC; 1 day 1h ago
           Docs: man:haproxy(1)
                 file:/usr/share/doc/haproxy/configuration.txt.gz
        Process: 46011 ExecReload=/usr/sbin/haproxy -Ws -f $CONFIG -c -q $EXTRAOPTS (code=exited, status=0/SUCCESS)
        Process: 46014 ExecReload=/bin/kill -USR2 $MAINPID (code=exited, status=0/SUCCESS)
       Main PID: 35012 (haproxy)
         Status: "Ready."
          Tasks: 2 (limit: 1068)
         Memory: 40.6M (peak: 75.5M swap: 224.0K swap peak: 23.9M)
            CPU: 37.675s
         CGroup: /system.slice/haproxy.service
                 ├─35012 /usr/sbin/haproxy -Ws -f /etc/haproxy/haproxy.cfg -p /run/haproxy.pid -S /run/haproxy-master.sock
                 └─46018 /usr/sbin/haproxy -sf 45988 -x sockpair@5 -Ws -f /etc/haproxy/haproxy.cfg -p /run/haproxy.pid -S /run/haproxy-master.sock
    ```

## The HAProxy Configuration File

HAProxy is controlled through its configuration file and the CLI. The default HAProxy configuration file is created at `/etc/haproxy/haproxy.cfg` during installation, and contains the settings needed to perform network balancing and flow control. It can be edited with any command line-based text editor.

To edit and use the TCP load balancing and health check functions in this guide, open the HAProxy configuration file with the text editor of your choice:

```command
sudo nano /etc/haproxy/haproxy.cfg
```

## TCP Load Balancing

Load balancing is defined in two sections of the HAProxy configuration file: `frontend` and `backend`. Below are example `frontend` and `backend` configurations for TCP load balancing:


### Frontend Configuration

```file {title="/etc/haproxy/haproxy.cfg"}
frontend web-test
  bind *:80
  mode tcp
  default_backend web-test
```

-   `frontend` declares that this section is for a frontend configuration called `web-test`.
-   `bind` specifies the interface and port that HAProxy listens to for incoming connections. Here, `*:80` means that HAProxy listens on all available IP addresses (`*`) on port `80`, which is the standard port for web traffic.
-   `mode` is set to TCP, so that HAPRoxy handles traffic at the transport layer.
-   `default_backend` directs this traffic to a backend named `web-test`, as defined in the next section.

### Backend Configuration

```file {title="/etc/haproxy/haproxy.cfg"}
backend web-test
  mode tcp
  balance roundrobin
  server server1 {{< placeholder "backend1_VLAN_IP_ADDRESS" >}}:80
  server server2 {{< placeholder "backend2_VLAN_IP_ADDRESS" >}}:80
  server server3 {{< placeholder "backend3_VLAN_IP_ADDRESS" >}}:80
```

-   `backend` declares that this section is for a backend configuration called `web-test`.
-   `mode` is again set to TCP, telling HAPRoxy to handle traffic at the transport layer.
-   `balance` is set to the Round Robin method, which connects each client reaching the HAProxy server's IP address to the next server in the list.
-   `server` statements define the backend servers using the VLAN addresses specified during the initial HAProxy setup.

## TCP Health Checks

HAProxy’s load balancing function can also select servers based on their health status. Health checks can be either active or passive. An active health check probes each backend server individually for specific health attributes, whereas a passive check relies on basic connection error information by protocol (Layer 4/TCP or Layer7/HTTP).

To enable a basic server health check, include the `check` keyword in the `server` entry of your HAProxy configuration file:

```file {title="/etc/haproxy/haproxy.cfg"}
server server1 {{< placeholder "backend1_VLAN_IP_ADDRESS" >}}:80 check
```

When the `check` keyword is included, HAProxy sends a SYN/ACK request to determine if a server is active. In some cases, servers may correctly respond to this type of query, while individual services and applications may still be down or unavailable.

### Active TCP Health Checks

Active health checks provide more sophisticated monitoring by sending application-specific queries to backend servers and expecting a valid response in return.

To have HAProxy check server health at specified intervals, include the `inter` keyword along with an interval value. For example:

```file {title="/etc/haproxy/haproxy.cfg"}
server server1 {{< placeholder "backend1_VLAN_IP_ADDRESS" >}}:80 check inter 4
```

In this example, HAProxy checks the first server in the pool every four seconds. If the server does not respond as expected, it is marked as down. This process functions like a ping-style health check to verify server availability.

### Passive TCP Health Checks

HAProxy uses the TCP protocol to perform passive health checks on backend servers. With passive health checks, HAProxy monitors Layer 4 (TCP) traffic for errors and marks a server as down when a specified error limit is reached.

Below is an example of the syntax used for a passive health check:

```file {title="/etc/haproxy/haproxy.cfg"}
server backend1 {{< placeholder "backend1_VLAN_IP_ADDRESS" >}}:80 check observe layer4 error-limit 10 on-error mark-down
```

This configuration specifies a passive health check that observes TCP errors (`observe layer4`). If the number of errors reaches the specified limit of 10 (`error-limit 10`), the server is marked as down (`on-error mark-down`). To optimize performance and reliability, you can adjust the intervals and error limits for different servers based on their capacity, role, or complexity. For more information, refer to the [HAProxy documentation on active health checks](https://www.haproxy.com/documentation/hapee/1-8r1/load-balancing/health-checking/active-health-checks/).

## Configure TCP Load Balancing with Health Checks

Set the HAProxy configuration file to perform TCP load balancing with basic passive health checks.

1.  Open the HAProxy configuration file with the text editor of your choice:

    ```command
    sudo nano /etc/haproxy/haproxy.cfg
    ```

1.  Append the following code to the end of the file, and save your changes:

    ```file {title="/etc/haproxy/haproxy.cfg"}
    frontend web-test
      bind *:80
      mode tcp
      default_backend web-test

    backend web-test
      mode tcp
      balance roundrobin
      server server1 {{< placeholder "backend1_VLAN_IP_ADDRESS" >}}:80 check
      server server2 {{< placeholder "backend2_VLAN_IP_ADDRESS" >}}:80 check
      server server3 {{< placeholder "backend3_VLAN_IP_ADDRESS" >}}:80 check
    ```

1.  Restart HAProxy to enable the changes made to the configuration file:

    ```command
    sudo systemctl restart haproxy
    ```

    {{< note title="Check for syntax errors" >}}
    If you encounter any errors after reloading HAProxy, run the following command to check for syntax errors in your `haproxy.cfg` file:

    ```command
    sudo haproxy -c -f /etc/haproxy/haproxy.cfg
    ```

    An error message is returned if the configuration file has logical or syntax errors. When the check is complete, each error is listed one per line.

    This command only verifies the syntax and basic logic of the configuration, and it does not guarantee that the configuration works as intended when running.
    {{< /note >}}

### Test TCP Load Balancing

Load balancing can be verified by visiting the HAProxy instances's public IP address.

{{< note title="CentOS Stream 9" >}}
The default firewall settings for CentOS Stream 9 must be changed prior to testing. Run the following command to temporarily open port `80` to `tcp` traffic:

```command
sudo firewall-cmd --add-port=80/tcp
```

Alternatively, use the commands below to configure the firewall to permanently allow `tcp` traffic on port `80`:

```command
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --reload
```
{{< /note >}}

1.  Open a web browser and navigate to the HAPRoxy instance's public IP address:

    ```command
    http://{{< placeholder "HAProxy_PUBIC_IP_ADDRESS" >}}
    ```

    The WordPress web page for `backend1` should appear:

    ![The 2024 default WordPress homepage served from backend1.](2024-Default-WordPress-Homepage-backend1.png)

    {{< note title="Certificate warnings" >}}
    If your browser warns of no HTTPS/TLS certificate, ignore the warning or use the advanced settings to reach the site.
    {{< /note >}}

1.  Open another browser tab and enter the same HAProxy server IP address. This time, the default page for `backend2` should be displayed:

    ![The 2024 default WordPress homepage served from backend2.](2024-Default-WordPress-Homepage-backend2.png)

1.  Repeat this process in a third browser tab, and the `backend3` server's web page should appear:

    ![The 2024 default WordPress homepage served from backend3.](2024-Default-WordPress-Homepage-backend3.png)

The HAProxy gateway is now successfully balancing traffic between the three backend instances using the Round Robin method.

### Verify TCP Health Checks

Health checks can be verified by removing one of the backend instances from the server pool. This should trigger a health check failure, causing HAProxy to exclude the unresponsive server from the backend pool.

1.  Open the Cloud Manager and choose **Linodes**

1.  Click on the ellipsis (**...**) to the right of your first backend instance, `backend1`.

1.  Choose **Power Off**, then click **Power Off Linode**.

1.  Reload the web browser tabs. HAProxy should no longer route traffic to `backend1`, effectively removing it from the pool.

1.  Return to the HAProxy instance and check the logs:

    ```command
    sudo tail -f /var/log/haproxy.log
    ```

    Your output should contain a "WARNING" line regarding the "DOWN" status of `server1`:

    ```output
    [WARNING]  (4494) : Server web-test/server1 is DOWN, reason: Layer4 connection problem, info: "No route to host", check duration: 1ms. 2 active and 0 backup servers left. 0 sessions active, 0 requeued, 0 remaining in queue.
    ```

This shows that HAProxy's TCP health checks are working as intended.