---
slug: using-nginx-proxy-manager
author:
  name: Linode Community
  email: docs@linode.com
description: "The Nginx Proxy Manager conveniently manages proxy hosts for your web services, whether on your home network or otherwise. Learn everything you need to know to get started with the Nginx Proxy Manager in this tutorial."
keywords: ['nginx proxy manager tutorial','nginx proxy manager docker','nginx-proxy-manager github']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-02-18
modified_by:
  name: Nathaniel Stickman
title: "How to Expose Services with the Nginx Proxy Manager"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Nginx Proxy Manager: Full Setup Instructions](https://nginxproxymanager.com/setup/)'
- '[Cloud Raya: Reverse Proxy Management Using Nginx Proxy Manager](https://cloudraya.com/knowledge-base/reverse-proxy-management-using-nginx-proxy-manager/)'
- '[Linux Hint: How to use Nginx Proxy Manager](https://linuxhint.com/use-nginx-proxy-manager/)'
- '[Grafana Labs: Monitoring a Linux Host with Prometheus, Node Exporter, and Docker Compose](https://grafana.com/docs/grafana-cloud/quickstart/docker-compose-linux/)'
---

The Nginx Proxy Manager offers a convenient tool for managing proxy hosting. The proxy manager makes it relatively easy to forward traffic to your services, whether running on your home network or otherwise.

This tutorial introduces you to the Nginx Proxy Manager and illustrates how to get started using it. Learn how to install the Nginx Proxy Manager and use it to set up proxy hosts for your own services.

## Before You Begin

1. If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1. Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What Is the Nginx Proxy Manager?

The [Nginx Proxy Manager](https://nginxproxymanager.com/) facilitates creating and managing proxy hosts simply and easily.

With a traditional Nginx setup, creating and maintaining proxies can be tedious, and sometimes more so than it is worth for otherwise straightforward setups.

The Nginx Proxy Manager takes all of the steps involved and packages them in a convenient web interface. Once you have your services running, you can readily create a proxy host within the Nginx Proxy Manager to forward traffic according to your specifications.

The Nginx Proxy Manager may not be well suited to more advanced use cases. For instance, the proxy manager does not have the load balancing and other more advanced features of standard Nginx.

Nevertheless, the proxy manager can significantly help with many web service setups.

It is especially useful for deploying proxies for services running on home networks. And the proxy manager can also be a boon for administrator services, from server-monitoring tools to website-administrator interfaces.

For all use cases, the Nginx Proxy Manager's convenience and ease of use making it a compelling solution.

## How to Run the Nginx Proxy Manager

Running the Nginx Proxy Manager gives you access to a dashboard for managing proxy services. The setup is relatively straightforward and, once the Nginx Proxy Manager is running, everything else you need is covered within the manager's web interface.

Follow along to get your own Nginx Proxy Manager instance standing up and ready for use.

### Installing Docker and Docker Compose

Docker Compose is the recommended method for running the Nginx Proxy Manager. So to start, you need to install Docker and the Docker Compose plugin on your system.

This tutorial covers the steps for Debian and Ubuntu and CentOS and Fedora systems. For other operating systems and distributions, refer to the [official instructions](https://docs.docker.com/engine/install/#server) for installing Docker Engine.

#### On Debian and Ubuntu

1. Remove any existing Docker installations.

    ```command
    sudo apt remove docker docker-engine docker.io containerd runc
    ```

1. Install the prerequisite packages for adding the Docker repository to the APT package manager.

    ```command
    sudo apt install ca-certificates curl gnupg lsb-release
    ```

1. Add the GPG key for the Docker repository to the APT package manager. Replace `debian` in the URL in this command with `ubuntu` if you are on an Ubuntu distribution.

    ```command
    sudo mkdir -m 0755 -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    ```

1. Add the Docker repository to the APT package manager. Again, replace `debian` in the command's URL with `ubuntu` if you are on an Ubuntu distribution.

    ```command
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    ```

1. Update the APT indices, and install the Docker Engine along with the Docker Compose plugin.

    ```command
    sudo apt update
    sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    ```

#### CentOS and Fedora

1. Remove any existing Docker installations.

    ```command
    sudo dnf remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-selinux docker-engine-selinux docker-engine
    ```

1. Install the core plugins for the DNF package manager. These give you access to tools for managing DNF repositories.

    ```command
    sudo dnf -y install dnf-plugins-core
    ```

1. Add the Docker repository to the DNF package manager. Replace `centos` in the URL in this command with `fedora` if you are on a Fedora distribution.

    ```command
    sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
    ```

1. Install the Docker Engine along with the Docker Compose plugin.

    ```command
    sudo dnf install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    ```

    You may be prompted to verify the GPG key, and you should see the following key listed.

    ```output
    060A 61C5 1B55 8A7F 742B 77AA C52F EB6B 621E 9F35
    ```

Following either installation path, you can ensure that the Docker daemon is running with the command here.

```command
sudo systemctl status docker
```

```output
● docker.service - Docker Application Container Engine
   Loaded: loaded (/usr/lib/systemd/system/docker.service; enabled; vendor preset: disabled)
   Active: active (running) since Thu 2023-02-16 20:38:07 UTC; 1s ago
     Docs: https://docs.docker.com
```

If it is not running (`active`), enable and start the Docker daemon with these commands.

```command
sudo systemctl enable docker
sudo systemctl start docker
```

### Running the Nginx Proxy Manager

With the prerequisites in place, you can now start up your Nginx Proxy Manager. This calls for deploying a straightforward Docker Compose configuration, provided in the steps that follow.

1. Create a directory for the Nginx Proxy Manager's Docker Compose, and change into that directory. This tutorial uses the directory `~/nginx-proxy-manager/`, and the remaining steps assume you are working out of this directory.

    ```command
    mkdir ~/nginx-proxy-manager/
    cd ~/nginx-proxy-manager/
    ```

1. Create a `docker-compose.yml` file within the directory, and give the file the contents shown here.

    ```file {title="docker-compose.yml" lang="yaml"}
    version: "3"

    networks:
      proxiable:
        name: proxiable

    services:
      app:
        image: 'jc21/nginx-proxy-manager:latest'
        container_name: nginxproxymanager
        restart: unless-stopped
        volumes:
          - ./data:/data
          - ./letsencrypt:/etc/letsencrypt
        ports:
          - '80:80'
          - '443:443'
          - '81:81'
        networks:
          - proxiable
    ```

    The Nginx Proxy Manager additionally supports configurations for working with MySQL/MariaDB. This tutorial does not employ these, but you can see the setup in the [official instructions](https://nginxproxymanager.com/setup/#using-mysql-mariadb-database).

1. Start up the Nginx Proxy Manager via Docker Compose.

    ```command
    sudo docker compose up -d
    ```

The Docker Compose configuration above contains an optional feature. The `proxiable` network allows you to run the Nginx Proxy Manager within the same Docker network as other services. That gives you the option of easy and secure communications between the proxy manager and your Docker services.

The example Grafana setup in the [How to Expose a Service through the Nginx Proxy Manager](/docs/guides/using-nginx-proxy-manager/#how-to-expose-a-service-through-the-nginx-proxy-manager) section further on leverages this feature. See the included Docker Compose configuration for how the network is included in the service.

### Accessing the Nginx Proxy Manager Interface

The Nginx Proxy Manager can now be accessed. Navigate in a web browser to port `81` on the public IP address for the system you are running the proxy manager on.

So for instance, if you are running the Nginx Proxy Manager on a machine with a public IP address of `192.0.2.0`, you would navigate to `192.0.2.0:81` in your web browser.

![The Nginx Proxy Manager login page](nginx-manager-login.png)

You are directed to the Nginx Proxy Manager login screen. The setup creates a default administrator user with the following initial credentials, which the system prompts you to change after logging in:

- Username: `admin@example.com`
- Password: `changeme`

After logging in and updating the credentials for the administrator user, you are directed to the Nginx Proxy Manager dashboard. You can manage of the proxy manager's features from this interface. The next section of the tutorial show you how to get started with just that.

![The Nginx Proxy Manager dashboard](nginx-manager-dashboard.png)

## How to Expose a Service through the Nginx Proxy Manager

To see what the Nginx Proxy Manager is capable of, you should go ahead and set it up as a reverse proxy for a service. Follow along here to see how.

This tutorial structures its example around a [Grafana](https://grafana.com/) monitoring service deployed with Docker Compose. But if you have your own service already, you can readily use that in place of the Grafana service.

The demonstration here also makes use of a couple of useful features to leverage with the Nginx Proxy Manager. First, it uses a shared Docker network between the proxy manager service and the Grafana service to make connections easier and more secure. Second, it sets up a reverse proxy for the proxy manager's own interface, give more convenient and secure access to the interface.

### Creating the DNS Records

You need to create at least one DNS record for a domain name to proxy your service to.

Linode does not provide domain name registration, but you can use the Linode DNS manager to manage DNS records for a domain name. To learn how, take a look at our guide [DNS Manager - Get Started](/docs/products/networking/dns-manager/get-started/).

The rest of this tutorial assumes that you have done the following. Refer to the guide linked above for details on these steps if you are using the Linode DNS Manager.

1. Register a domain name. This can be done through the services listed in the guide linked above or through any other registrar service.

    The rest of this tutorial uses `example.com` as the domain. Replace that throughout with your actual domain name.

1. If you are using the Linode DNS Manager, insert the Linode name servers in your registrar's interface.

1. Create an A/AAAA DNS record pointing the domain to the public IP address for the instance running your service.

1. (Optional) To follow along with setting up a reverse proxy for the Nginx Proxy Manager interface, create a separate A/AAAA record pointing to the same IP address.

    This tutorial uses a subdomain of `proxy-manager` for the additional record. In the Linode DNS Manager, you can add this by creating a new A/AAAA record from the domain's page and entering `proxy-manager` as the **Hostname**.

### Setting Up a Service

The Nginx Proxy Manager can work well with a wide range of services. But it really shows off with services that are deployed with Docker.

To demonstrate, this tutorial gives you a Docker Compose configuration to deploy the Grafana service. The deployment includes Prometheus and comes ready to monitor the performance of your server.

You can download the archive containing all the configuration files here: [prometheus-grafana-compose.zip](prometheus-grafana-compose.zip). Then, follow along with these steps to start up the Grafana and accompanying services.

1. Unzip the archive and change into the resulting directory. This assumes you are in the directory where you downloaded the archive. You may also need to install the `unzip` package to complete this step.

    ```command
    unzip prometheus-grafana-compose.zip
    cd prometheus-grafana-compose
    ```

    The remaining steps assume you are working within the unzipped directory.

1. Open the `docker-compose.yml` file with your preferred text editor. The file contains variables for administrator user credentials in the `grafana` section: `GF_SECURITY_ADMIN_USER` and `GF_SECURITY_ADMIN_PASSWORD`. Adjust these variable's values to fit your needs.

    {{< note >}}
For higher security, you can use environment variables to store the actual credentials.

For instance, give the variables values of `${GRAFANA_ADMIN_USER}` and `${GRAFANA_ADMIN_PASSWORD}`, respectively. Then, set the corresponding environment variables before running the `docker compose up` command below.

```command
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=adminpass
```
    {{< /note >}}

1. (Optional) You can add the JSON for any Grafana dashboards you are interested in to the `grafana/provisioning/dashboards/` directory. The [Node Exporter Full](https://grafana.com/grafana/dashboards/1860-node-exporter-full/) provides a good dashboard to start with, and it works with the setup in this tutorial.

1. Run the Docker Compose setup.

    ```command
    sudo docker compose up -d
    ```

### Configuring the Nginx Proxy Manager

With your service running, you can now return to the Nginx Proxy Manager interface. There, you are able to add a proxy host for the service, creating a reverse proxy forwarding traffic from the domain to the service.

1. Access the Nginx Proxy Manager interface as discussed further above.

1. Navigate to the **Proxy Hosts** page. You can get there either using the **Proxy Hosts** button from the main dashboard or using the **Hosts > Proxy Hosts** option from the menu at the top of the interface.

1. Select the **Add Proxy Host** button from the upper right of the page. A form displays, which you should complete as follows.

    - Enter the domain name to be used for your service in the **Domain Names** field.

    - Leave the scheme as *http*. This refers to the scheme used by Nginx to access the service, not the scheme used for the proxy itself. A later step adds SSL encryption to the proxy.

    - Enter the service address in the **Forward Hostname/IP** field.

        Using the configuration provided in this tutorial, the Grafana service runs in the same Docker network as the Nginx Proxy Service. You can leverage that and just enter the Docker container name as the hostname: `grafana`.

        Otherwise, you would enter the local or public IP address by which the proxy manager could access the service.

    - Enter the service port in the **Forward Port** field. Following the configuration for Grafana used in this tutorial, that port would be `3000`.

    - Toggle on the **Block Common Exploits** option. This is generally a nice feature to have.

    - Leave the remaining fields at their defaults.

    ![Creating a proxy host in the Nginx Proxy Manager](nginx-manager-proxy-host.png)

1. Before saving the configuration, navigate to the **SSL** tab. There, complete the form as follows.

    - Select *Request a new SSL Certificate* from the **SSL Certificate** drop down.

    - Toggle on the **Force SSL** option to ensure HTTPS is used and traffic to and from the service is encrypted.

    - Enter an email address for the Let's Encrypt certificate process. Let's Encrypt uses this to alert you when the certificate needs to be renewed.

    - Select the **I Agree** toggle after reading the terms of service for Let's Encrypt.

    - Leave the remaining fields at their defaults.

    ![Adding an SSL certificate to a proxy host in the Nginx Proxy Manager](nginx-manager-host-ssl.png)

1. Select **Save** to complete the proxy host setup.

And your reverse proxy for the Grafana service is now in place. Continue on to the next section to see it in action.

You can also add a reverse proxy for the Nginx Proxy Manager interface itself. You would follow almost the exact same steps as outlined above for the Grafana service, with only these differences.

- Enter the subdomain name, or other domain name, you set up for the Nginx Proxy Manager. The example further above suggested using the `proxy-manager` subdomain. So if your Grafana domain was `example.com`, here you would enter `proxy-manager.example.com`.

- Enter `nginxproxymanager` as the **Forward Hostname/IP**, assuming you retained the container name in the Nginx Proxy Manager setup further above, and enter `81` as the **Forward Port**.

- Create a new SSL certificate. The Nginx Proxy Manager gives you the option of using the same SSL certificate as created for Grafana in the steps above. However, since the domain names are different, some browsers would throw an obstructing warning if you used the same certificate.

### Accessing the Service

Now you can access your service through your domain name, and leveraging SSL encryption.

In a web browser, navigate to the HTTPS address for your domain. For instance, if your domain name is `example.com`, navigate to `https://example.com/`.

There, you should be greeted with the Grafana login screen. You can use the credentials you configured with the Grafana `docker-compose.yml` file further above to log in.

![The Grafana interface accessed through the Nginx Proxy Manager reverse proxy](grafana-proxy.png)

Similarly, you can now use the subdomain or domain you configured for navigating to the Nginx Proxy Manager interface. Continuing the examples above, this would be located at `https://proxy-manager.example.com`.

## Conclusion

This covers everything you need to get started using the Nginx Proxy Manager for your web services. Do check out the links below for more information about advanced setups within the proxy manager. But most use cases for the Nginx Proxy Manager can be covered with the steps in this tutorial. And that fact shows off how effectively the proxy manager can simplify and ease your reverse proxy setups.
