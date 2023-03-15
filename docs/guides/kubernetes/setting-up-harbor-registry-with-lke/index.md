---
slug: setting-up-harbor-registry-with-lke
title: "How to Set Up a Harbor Container Registry on LKE"
description: "Harbor provides a self-hosted registry for your Docker images, giving you the control and security you need. Harbor readily interfaces with Docker and Kubernetes tools, and you can find out everything you need to know to get started in this tutorial."
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Nathaniel Stickman"]
published: 2023-03-15
modified_by:
  name: Nathaniel Stickman
external_resources:
- '[Harbor Docs: Harbor Installation and Configuration](https://goharbor.io/docs/2.7.0/install-config/)'
- '[Kubernetes: Pull an Image from a Private Registry](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)'
---

Harbor is an open-source and self-hosted registry for container images. With Harbor, you can securely store and access your own collection of Docker images without resorting to a external service. And Harbor's security and compliance features ensure your registry has the level of control that you need.

Find out more through this tutorial. Learn more about Harbor and what sets it apart. See how to set up your own Harbor registry, complete with an initial Docker image, and how to use it with Kubernetes cluster.

## Before You Begin

1. If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1. Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What Is Harbor?

[Harbor](https://goharbor.io/) offers an open-source solution for self-hosting a container image registry. A project within the Cloud Native Computing Foundation (CNCF), Harbor puts security and compliance at the center of its design. With features like access policies and roles, vulnerability scanning, and image signing, Harbor likely provides whatever level of security you need for your container images.

And with little additional configuration, Harbor integrates readily with tools like the Docker command-line interface (CLI) and kubectl. From the Docker CLI, you can log in to your Harbor registry to securely push and pull images. Kubernetes tools can likewise securely authenticate with your Harbor registry and allow you to deploy containers directly from images stored in the registry.

### Harbor vs Docker Hub: Why Use Harbor?

The most significant distinction between Harbor and Docker Hub is that Harbor can be self-hosted. By self-hosting Harbor, you gain a degree of control over things like compliance and access that you lack with a service like Docker Hub. And, for that matter, that you lack with many other external cloud-hosted solutions.

Additionally, Harbor comes with a suite of features ready to add security and compliance. Harbor makes these qualities a priority. Additionally, its robust set of security and compliance features comes with a level of fine-grained control for you to configure your registry.

In summary:

- Docker Hub provides an accessible registry with plenty of existing images to leverage. But you lose a degree of control over the data and you do not get such robust security and compliance features.

- Harbor centers on securing your images, with a suite of features to control access and roles and to mitigate vulnerabilities. But being self-hosted, Harbor has an initial setup and requires on-going system administration and maintenance.

## How to Set Up Harbor

To get started, you need to prepare a system to run a Harbor server. The process involves installing and configuring some prerequisites and then installing Harbor itself.

That server then becomes your Harbor access point. It gives you an administrative interface for your Harbor instance as well as a host for your Harbor registry. Your Docker and Kubernetes tools can then connect to your Harbor registry for container images.

### Configuring a Domain Name

This tutorial requires you to have a domain for your Harbor server. Doing so allows you to use Let's Encrypt for SSL certification.

You can refer to our [DNS Manager - Get Started](/docs/products/networking/dns-manager/get-started/) documentation to learn more about creating a domain name. The documentation specifically covers using the Linode DNS Manager, but the steps can be used as a more general guide as well.

The rest of the tutorial assumes that:

- You have registered a domain name

- You have created an *A* record pointing the domain to your server's public IP address

For examples throughout, the tutorial uses `harbor.example.com` as the domain name. Replace that with your actual domain name as you go through the tutorial.

### Installing Docker and Docker Compose

Docker along with the Docker Compose plugin are required for running Harbor. These next sets of steps show you how to install these tools on Debian and Ubuntu and CentOS and Fedora systems.

For other operating systems and distributions, refer to the [official instructions](https://docs.docker.com/engine/install/#server) for installing Docker Engine along with the Docker Compose plugin.

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

#### Completing the Installation

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

### Configuring the Firewall

To allow connections to your Harbor server, your firewall needs to have the HTTP and HTTPS ports — `80` and `443` — open.

You can learn more about firewall configuration in our guide on [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/#configure-a-firewall).

The steps below give you commands to open the HTTP and HTTPS ports on several major Linux systems. These use the default firewall managers for each of the named distributions.

- On Debian and Ubuntu, use UFW to open the necessary ports.

    ```command
    sudo ufw allow http
    sudo ufw allow https
    sudo ufw reload
    ```

- On CentOS, Fedora, and similar systems, use firewalld to open the necessary ports.

    ```command
    sudo firewall-cmd --zone=public --allow-service=http --permanent
    sudo firewall-cmd --zone=public --allow-service=https --permanent
    sudo firewall-cmd --reload
    ```

### Setting Up SSL

Using SSL lets you secure traffic to and from your Harbor server, and it is the recommended approach for Harbor access. You can create self-signed certificates, but typically it is better to use a certificate authority like Let's Encrypt.

To get started, follow our guide on how to [Use Certbot to Enable HTTPS with NGINX](/docs/guides/enabling-https-using-certbot-with-nginx-on-ubuntu/). Use the dropdown at the top of the guide to select the appropriate distribution for you. Certbot gives you a more easily-accessible interface for requesting and downloading certificates from Let's Encrypt.

For the purpose of this tutorial, follow just the sections of the guide above on installing Snap and installing Certbot. *Do not* follow that guide's steps for requesting a certificate.

Instead, once you have Certbot installed, follow the steps here to request a certificate fit for use with Harbor.

1. Have Certbot request a certificate for your domain (given after the `-d` option) using standalone verification.

    ```command
    sudo certbot certonly --standalone -d harbor.example.com
    ```

1. Once the process has finished, Certbot should output the location of your certificate and key files, as shown here. Hold onto these locations, as you need to input them in the Harbor configuration file later.

    ```output
    [...]
    Successfully received certificate.
    Certificate is saved at: /etc/letsencrypt/live/harbor.example.com/fullchain.pem
    Key is saved at:         /etc/letsencrypt/live/harbor.example.com/privkey.pem
    [...]
    ```

### Installing Harbor

With the prerequisites above in place, you are ready to start on the Harbor installation process. Essentially, this consists of downloading the Harbor installer, making your initial configurations, and running the installation script.

1. Download the package with the latest Harbor installer from the Harbor [releases page](https://github.com/goharbor/harbor/releases/latest). You can choose either the online or offline installer.

    The command below streamlines this step. It grabs the download link for the latest offline installer package and downloads it as `harbor-offline-installer.tgz`.

    ```command
    curl -s https://api.github.com/repos/goharbor/harbor/releases/latest \
    | grep "browser_download_url.*harbor-offline-installer.*.tgz\"" \
    | tail -n 1 \
    | cut -d : -f 2,3 \
    | tr -d \" \
    | wget -O harbor-offline-installer.tgz -qi -
    ```

    Be sure to do this in a directory where you want to keep the Harbor installer's own subdirectory. You should retain the Harbor installer even after installation, as it includes scripts for making configuration changes later.

1. Extract the installer package, which places the installer contents within a `harbor/` subdirectory of the current directory. You may first need to install the `tar` tool, which you should be able to get through your system's package manager.

    ```command
    tar xzvf harbor-offline-installer.tgz
    ```

1. Change into the new `harbor/` directory, and make a copy of the included configuration file template. The copy creates a place for you to configure your Harbor instance.

    ```command
    cd harbor
    cp harbor.yml.tmpl harbor.yml
    ```

1. Open the `harbor.yml` file, and begin adjusting the configuration to fit your needs.

    Several of the required parameters you can leave at their defaults, like the `http` parameter. The following are required parameters that you should make initial adjustments to.

    - `hostname`: Give this your domain name, `harbor.example.com`.

    - `https`: Modify the `certificate` and `private_key` sub-parameters to point to the locations of your SSL certificate and key files, as given in the output from Certbot further above.

        Using the example output given there, the parameters would look like the following.

        ```file {title="harbor.yml" lang="yml"}
        # [...]
        https:
          port: 443
          certificate: /etc/letsencrypt/live/harbor.example.com/fullchain.pem
          private_key: /etc/letsencrypt/live/harbor.example.com/privkey.pem
        # [...]
        ```

    You may additionally wish to adjust the following passwords. Though not required, doing so can make your Harbor instance more secure at the outset.

    - `harbor_admin_password`: Replace with an initial password for the administrator user. This only defines the user's default password, however, which should be replaced anyway from within the Harbor interface.

    - `database`: Replace the `password` sub-parameter with a more secure password for Harbor's PostgreSQL database.

1. With your configuration changes in place, run the installation script.

    ```command
    sudo ./install.sh
    ```

    You should be able to follow along with the progress as Harbor installs. At the end the script notifies you that the installation has completed successfully.

    ```output
    ✔ ----Harbor has been installed and started successfully.----
    ```

## How to Start Working with Harbor

Once the installation has finished, Harbor begins running and is ready to use. Read on below to see how to access your Harbor server and start it out with a custom Docker image.

### Accessing Harbor

Harbor's dashboard is exposed at the domain you configured above. For this tutorial, that means navigating to `https://harbor.example.com` to access the Harbor login page.

[![The Harbor login page](harbor-login_small.png)](harbor-login.png)

You can login using the administrator credentials. By default, these are as follows. Keep in mind that if you modified the initial password in the `harbor.yml` file then you need to use that value instead.

- Username: `admin`

- Password: `Harbor12345`

Logging in takes you to the Harbor dashboard, where you can see details of your Harbor instance and begin managing its settings. Be sure to take a look around and familiarize yourself with all of the options available.

[![The Harbor dashboard](harbor-dashboard_small.png)](harbor-dashboard.png)

You should go ahead and change your administrator password while you are logged in. You can do so by selecting the **admin** option from the upper right, and selecting **Change Password** from the dropdown menu.

### Adding Images to Harbor

From the Harbor dashboard, you can see all of your Harbor resources. But to get the most out of Harbor, you should load the registry with container images. These images then appear within the dashboard and are accessible directly from your Harbor registry's address.

Harbor organizes images into projects, so you should first either create a project to your liking or modify the default `library` project. You can do all of this from the **Projects** option on the left menu.

The examples in this tutorial use the default project (`library`) but change the project's accessibility from public to private. To accomplish that:

1. Select **Projects** from the left menu.

1. Select **library** from the list of projects.

1. Select the **Configuration** tab.

1. Uncheck the **Public** option.

Now follow along with the steps below to create your own Docker image and push it to your Harbor registry.

#### Creating a Docker Image

To begin, you need a Docker image. This makes the most sense with a custom Docker image, although you can choose to pull an image from Docker Hub and push it to Harbor instead.

The simple image here includes Nginx and a basic website. Later in the tutorial, you can see this website fully deployed from Harbor to your LKE cluster.

You can learn more about building Docker images through our guide on [How to Use a Dockerfile to Build a Docker Image](/docs/guides/how-to-use-dockerfiles/).

1. Make a directory to store the image configuration file and its resources, and change into that directory.

    ```command
    mkdir ~/example-nginx-image
    cd ~/example-nginx-image
    ```

1. Add an `nginx-default.conf` file there, and give it the contents shown here. These define a bare-bones Nginx static server.

    ```file {title="nginx-default.conf" lang="conf"}
    server {
        listen 80;
        listen [::]:80;
        server_name localhost;
        location / {
            root /usr/share/nginx/html;
            index index.html index.htm;
        }
        error_page 500 502 503 504  /50x.html;
        location = /50x.html {
            root /usr/share/nginx/html;
        }
    }
    ```

1. Make an `html/` subdirectory where the static site content can be stored.

    ```command
    mkdir html
    ```

1. Add an `index.html` file into the `html/` directory, and give the file the contents shown here.

    ```file {title="html/index.html" lang="html"}
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Example Nginx Website</title>
    </head>
    <body>
      <h1>An Example Nginx Website</h1>
      <p>Welcome to your own Nginx website!</p>
    </body>
    </html>
    ```

1. Add a `Dockerfile` to the image directory. This file defines your Docker image. Give the file the contents shown here.

    ```file {title="Dockerfile" lang="docker"}
    FROM nginx:latest
    RUN rm /etc/nginx/conf.d/default.conf
    COPY nginx-default.conf /etc/nginx/conf.d/default.conf
    COPY html /usr/share/nginx/html
    ```

1. Use the Docker `build` command to build an image from the Dockerfile. This example gives the image the name `example-docker-image`.

    ```command
    sudo docker build -t example-docker-image .
    ```

You can now verify that the image has been successfully created by listing your Docker images.

```command
sudo docker images
```

```output
REPOSITORY                      TAG       IMAGE ID       CREATED         SIZE
example-nginx-image             latest    123658fe84af   5 seconds ago   142MB
```

#### Pushing to Harbor

With a Docker image built and ready, you can use Docker to push that image to your Harbor registry. Since the Harbor project is private, you need to first log in to the registry with Docker. From there, tag you image, and it is ready for the Harbor server.

1. Log in to the Harbor registry with your Docker instance.

    ```command
    sudo docker login harbor.example.com
    ```

    This prompts your for a username and password. Use the `admin` credentials used to log in to the Harbor interface, or use the credentials of another authorized user you have created within the interface.

1. Add a tag to your Docker image. Here, the image is tagged with a version number, `1.0.0`. Notice that the image is tagged for the `library` project within the Harbor registry.

    ```command
    sudo docker tag example-nginx-image harbor.example.com/library/example-nginx-image:1.0.0
    ```

1. Push the Docker image up to your Harbor registry.

    ```command
    sudo docker push harbor.example.com/library/example-nginx-image:1.0.0
    ```

    ```output
    The push refers to repository [harbor.example.com/library/example-nginx-image]
    [...]
    1.0.0: digest: sha256:f37ae9e729f7c3a0d5f8e84e8dcfc019093ac76b48e885568c8c5b6b163d5b43 size: 2191
    ```

From there, you can jump back to the Harbor dashboard to see the results. Navigate to the **Projects** page using the menu on the left, and select the **library** project from the listing. There on the project page, you should see your image listed.

[![An image shown in the Harbor registry dashboard](harbor-project_small.png)](harbor-project.png)

## How to Use the Harbor Registry with LKE

With the Linode Kubernetes Engine (LKE), you can deploy a full Kubernetes cluster from within the Linode Cloud Manager. Follow our guide [Linode Kubernetes Engine - Getting Started](/docs/products/compute/kubernetes/get-started/) to deploy your own cluster if you have not already.

Harbor can act as the image registry for your Kubernetes needs as well. The steps that follow show you how to deploy the example Docker image created above directly from your Harbor registry to your LKE cluster.

For the steps here, you need to have an active LKE cluster and have kubectl installed and configured with the cluster's kubeconfig file. All of this is covered in the guide linked above.

1. Create a secret within kubectl. This secret allows your Kubernetes to have an authenticated connection to your private Harbor registry.

    Replace the `--docker-server` URL with your Harbor server's, and similarly replace the `--docker-username` and `--docker-password` values with credentials for your Harbor instance.

    ```command
    kubectl create secret docker-registry harbor-registry-secret --docker-server="https://harbor.example.com" --docker-username="admin" --docker-password="Harbor12345"
    ```

1. Create an `example-nginx-deployment.yml` file, and give it the contents shown here. The setup deploys the `example-nginx-image` created further above alongside a service for accessing the containers.

    This deployment uses three `replicas`. You can adjust that number to match the number of nodes in your LKE cluster.

    ```file {title="example-nginx-deployment.yml" lang="yml"}
    apiVersion: v1
    kind: Service
    metadata:
      name: example-nginx-service
    spec:
      type: NodePort
      selector:
        app: example-nginx
      ports:
      - port: 80
        targetPort: 80
    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: example-nginx-app
    spec:
      replicas: 3
      selector:
        matchLabels:
          app: example-nginx
      template:
        metadata:
          labels:
            app: example-nginx
        spec:
          containers:
          - name: example-nginx-instance
            image: harbor.example.com/library/example-nginx-image:1.0.0
            imagePullPolicy: Always
            ports:
            - containerPort: 80
          imagePullSecrets:
          - name: harbor-registry-secret
    ```

1. Apply the configuration file, deploying the custom image to the LKE cluster.

    ```command
    kubectl apply -f example-nginx-deployment.yml
    ```

1. Verify that the deployment has completed successfully by listing the pods. You should see three, each with a `Running` status.

    ```command
    kubectl get pods
    ```

    ```output
    NAME                                READY   STATUS    RESTARTS   AGE
    example-nginx-app-646f4d5b6-8j8xc   1/1     Running   0          1m
    example-nginx-app-646f4d5b6-gnlbk   1/1     Running   0          1m
    example-nginx-app-646f4d5b6-pdr24   1/1     Running   0          1m
    ```

1. Finally, check to see that the deployed application is performing as expected. Recall that the custom Docker image serves a static web page. So you can visit the web page to see that it is working.

    You can use kubectl to forward port `80` from within the cluster. Here the port is forwarded to port `8001` on the host machine.

    ```command
    kubectl port-forward service/example-nginx-service 8001:80
    ```

    Navigate to `localhost:8001` in a web browser to see the deployed application.

## Conclusion

You now have a ready Harbor registry, a Docker CLI connected to it, and an LKE cluster running an image from the registry. Between these tools, you have all you need to start managing a full registry and weaving it into your infrastructure.

To learn more about managing your Harbor registry and about the configuration features, be sure to refer to the Harbor documentation linked below. The Harbor dashboard gives you extensive control of access policies and roles, vulnerability scanning, and other features to secure your registry.
