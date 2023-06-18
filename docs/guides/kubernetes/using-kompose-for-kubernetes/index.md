---
slug: using-kompose-for-kubernetes
title: "How to Use Kompose for Kubernetes Deployments"
description: "Kompose helps users familiar with Docker Compose start deploying to Kubernetes by translating Docker Compose YAML files to Kubernetes resources. In this tutorial, find out more about Kompose and how to start using it for your Kubernetes deployments."
keywords: ['kompose kubernetes example','docker compose to kubernetes yaml','kompose github']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ['Nathaniel Stickman']
published: 2023-06-18
modified_by:
  name: Nathaniel Stickman
external_resources:
- '[Kompose: Getting Started](https://kompose.io/getting-started/)'
- '[Kubernetes: Translate a Docker Compose File to Kubernetes Resources](https://kubernetes.io/docs/tasks/configure-pod-container/translate-compose-kubernetes/)'
---

Kompose is a tool to make it easier to move from Docker Compose files to Kubernetes resource deployments. Do you usual development with Docker Compose, and, when you are ready, run Kompose to convert your work to a set of Kubernetes manifests.

In this tutorial, learn more about Kompose, how to install it, and how to use it to build resources for your Kubernetes cluster.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  Have an active Kubernetes cluster configured with kubectl or a similar tool. You can follow our [Linode Kubernetes Engine - Getting Started](/docs/products/compute/kubernetes/get-started/) guide to deploy an LKE cluster from the Linode Cloud Manager. The guide also includes steps for installing and configuring kubectl to manage the cluster.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What Is Kompose?

[Kompose](https://kompose.io/) converts Docker Compose files to Kubernetes resources. Its goal is to provide an easier and more accessible route for users familiar with Docker Compose to start working with Kubernetes resources.

Kompose works by reading a `docker-compose.yaml` file. Doing so, Kompose is able to parse out each part of the Compose deployment and create a corresponding Kubernetes YAML file.

Once Kompose finishes, you have a set of Kubernetes resource definitions that you can deploy to your Kubernetes cluster using kubectl or a similar tool.

## How to Install Kompose

Kompose has a straightforward installation process. In only a few steps, as shown here, you can have it ready on your system. Then continue on to the next section of the tutorial with an example using your new Kompose installation to convert a Docker Compose file.

1.  Download the Kompose binary. Replace the version (`v1.28.0`) in the command below with the latest version you find on the [Kompose releases page](https://github.com/kubernetes/kompose/releases) on GitHub.

    ```command
    curl -L https://github.com/kubernetes/kompose/releases/download/v1.28.0/kompose-linux-amd64 -o kompose
    ```

1.  Move the Kompose binary to a location on your shell path. Though optional, this step makes the Kompose binary significantly more convenient to access.

    ```command
    sudo chmod +x kompose
    sudo mv kompose /usr/local/bin/
    ```

1.  Verify that the Kompose binary runs as expected. A simple way to do that is running Kompose with the `version` command to check the binary's version.

    ``` command
    kompose version
    ```

    ```output
    1.26.0 (40646f47)
    ```

## How to Convert Docker Compose to Kubernetes with Kompose

With Kompose installed, you can start converting your Docker Compose setups for Kubernetes deployments.

To get you started, the rest of this tutorial walks you through a full example. It includes a simple Docker Compose file for running WordPress with a MariaDB backend. Using Kompose, the example then shows how to convert that Docker Compose file into Kubernetes resource manifests. The last step uses kubectl to deploy those resources to your Kubernetes cluster.

### Creating a Docker Compose YAML

Demonstrating Kompose requires an example Docker Compose setup. The best demonstration should use a Docker Compose that defines multiple interconnected containers, but one that also avoids being too complicated.

WordPress provides a convenient example. It requires deployment of the WordPress image alongside a supported database, so interconnection without too much configuration.

Below you can find a Docker Compose file for a basic WordPress instance backed by MariaDB. The model follows Docker's [official example](https://github.com/docker/awesome-compose/tree/master/official-documentation-samples/wordpress), which you can also reference to learn more.

1.  Make and change into a project directory for the Docker Compose file. The directory later houses the Kubernetes manifests as well.

    ```command
    mkdir ~/wp-manifests/
    cd ~/wp-manifests/
    ```

1.  Create a `docker-compose.yaml` file within that directory. Give the file the contents shown here.

    The file defines services for WordPress and its MariaDB database, as well as volumes for persisting the data needed by each service.

    ```file {title="docker-compose.yaml" lang="yaml"}
    version: '3'
    services:
      db:
        # Database version selected to work across CPU architectures
        image: mariadb:10.6.4-focal
        command: '--default-authentication-plugin=mysql_native_password'
        volumes:
          - db_data:/var/lib/mysql
        restart: always
        environment:
          - MYSQL_ROOT_PASSWORD=wpdbrootpass
          - MYSQL_DATABASE=wordpress
          - MYSQL_USER=wpdbuser
          - MYSQL_PASSWORD=wpdbpass
        expose:
          - 3306
          - 33060
      wordpress:
        image: wordpress:latest
        volumes:
          - wp_data:/var/www/html
        ports:
          - 80:80
        restart: always
        environment:
          # Points to the `db` service defined above
          - WORDPRESS_DB_HOST=db
          # Credentials must match the database credentials set above
          - WORDPRESS_DB_USER=wpdbuser
          - WORDPRESS_DB_PASSWORD=wpdbpass
          - WORDPRESS_DB_NAME=wordpress
    volumes:
      db_data:
      wp_data:
    ```

### Converting from Docker Compose to Kubernetes

Kompose needs only now to be run with the `convert` command within the project directory. Kompose automatically finds and reads the `docker-compose.yaml` file within the current directory, and from there it creates the necessary Kubernetes resources.

1.  Run the Kompose conversion process. For Kompose to automatically detect the `docker-compose.yaml` file, you need to still be in the project directory.

    ```command
    kompose convert
    ```

    ```output
    INFO Kubernetes file "db-service.yaml" created
    INFO Kubernetes file "wordpress-service.yaml" created
    INFO Kubernetes file "db-deployment.yaml" created
    INFO Kubernetes file "db-data-persistentvolumeclaim.yaml" created
    INFO Kubernetes file "wordpress-deployment.yaml" created
    INFO Kubernetes file "wp-data-persistentvolumeclaim.yaml" created
    ```

    Alternatively, you can specify the `docker-compose.yaml` file using the `-f` option with the command.

    ```command
    kompose convert -f docker-compose.yaml
    ```

1.  Further verify the Kubernetes manifests files output by the Kompose conversion process. The `-1` option lists the files vertically for easier reading.

    ```command
    ls -1
    ```

    ```output
    db-data-persistentvolumeclaim.yaml
    db-deployment.yaml
    db-service.yaml
    docker-compose.yaml
    wordpress-deployment.yaml
    wordpress-service.yaml
    wp-data-persistentvolumeclaim.yaml
    ```

### Deploying the Kubernetes Resource

You now have a set of Kubernetes manifests, ready to deploy to your cluster. Below covers a set of steps using kubectl to do that.

1.  (Optional) Create a namespace for the WordPress deployment. Doing this makes it easier to review and manage the deployment later. If you choose not to complete this step, remove the `--namespace wordpress` option from the commands in the subsequent steps.

    ```command
    kubectl create namespace wordpress
    ```

1. Move the `docker-compose.yaml` file out of the directory. The simplest way to deploy all of the manifests is by having kubectl deploy everything in the directory, and the `docker-compose.yaml` file might interfere with that.

    ```command
    mv docker-compose.yaml ../
    ```

1.  Deploy the resources to the Kubernetes cluster. For the `-f` option, you could provide a comma-separated list of the resource files output by Kompose. However, since the directory is clear of any other files, you can use `.` to deploy all files.

    ```command
    kubectl apply -f . --namespace wordpress
    ```

    ```output
    persistentvolumeclaim/db-data created
    deployment.apps/db created
    service/db created
    deployment.apps/wordpress created
    service/wordpress created
    persistentvolumeclaim/wp-data created
    ```

1.  Verify successful deployment. It may take a short time before the deployed pods show the `Running` status.

    ```command
    kubectl get pods --namespace wordpress
    ```

    ```output
    NAME                         READY   STATUS    RESTARTS   AGE
    db-84b85bb594-sbll2          1/1     Running   0          59s
    wordpress-785f8f7d4f-khqmd   1/1     Running   0          59s
    ```

#### Viewing the Deployed Application

The resources have been deployed, meaning your Kuberentes cluster should be running a WordPress instance. With a few additional steps, you can verify this by visiting the new WordPress site.

1.  Open the required port in your system's firewall. The next step uses port `8080` to map the WordPress service to.

    {{< tabs >}}
    {{< tab "Debian and Ubuntu" >}}
    Refer to our [How to Configure a Firewall with UFW](/docs/guides/configure-firewall-with-ufw/) guide, and use commands like the following to open the HTTP port.

    ```command
    sudo ufw allow 8080/tcp
    sudo ufw reload
    ```

    {{< /tab >}}
    {{< tab "CentOS, AlmaLinux, Rocky Linux, and Similar" >}}
    Refer to our [Configure a Firewall with Firewalld](/docs/guides/introduction-to-firewalld-on-centos/) guide, and use commands like the following to open the HTTP port.

    ```command
    sudo firewall-cmd --zone=public --add-port=8080/tcp --permanent
    sudo firewall-cmd --reload
    ```

    {{< /tab >}}
    {{< /tabs >}}

1.  Initiate port forwarding from the WordPress service. Doing so allows you to connect to the WordPress site using your current machine's single URL.

    ```command
    kubectl port-forward --address 0.0.0.0 svc/wordpress 8080:80 --namespace wordpress
    ```

1.  Navigate in a web browser to port `8080` on your current machine's remote address. Typically, this is an IP address, so you would navigate to something like: `http://192.0.2.0:8080`.

    ![Setup page for a Kubernetes-hosted WordPress site](example-app.png)

## Conclusion

Kompose grants a powerful tool. Whether you are a Docker Compose aficionado beginning with Kubernetes or looking to use Docker Compose to streamline Kubernetes development, Kompose can help.

Linked below are helpful resources for learning more about working with Kompose.

Additionally, you may be interested in moving forward with more on Kubernetes and Docker Compose.

- Refer to our [Beginner's Guide to Kubernetes](/docs/guides/beginners-guide-to-kubernetes/) series to go deeper with Kubernetes, and see our [collection of Kubernetes guides](/docs/guides/kubernetes/) for a range of use cases to build on.

- Search our documentation for Docker Compose to see everything from getting started guides like [How to Use Docker Compose](/docs/guides/how-to-use-docker-compose/) to specific use cases like how to [Install a Mastodon Server](/docs/guides/install-mastodon-on-ubuntu-2004/).
