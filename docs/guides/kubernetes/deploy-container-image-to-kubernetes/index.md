---
slug: deploy-container-image-to-kubernetes
author:
  name: Linode Community
  email: docs@linode.com
description: "This guide shows how to package a Hugo static site in a Docker container image, host the image on Docker Hub, and deploy it on a Linode Kubernetes cluster."
keywords: ['kubernetes','docker','docker hub','hugo', 'static site']
tags: ["docker","kubernetes","container"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-05-07
modified_by:
  name: Linode
title: "Build & Deploy a Docker Image to Kubernetes Cluster"
h1_title: "Create and Deploy a Docker Container Image to a Kubernetes Cluster"
enable_h1: true
aliases: ['/applications/containers/kubernetes/deploy-container-image-to-kubernetes/','/applications/containers/deploy-container-image-to-kubernetes/','/kubernetes/deploy-container-image-to-kubernetes/']
contributor:
  name: Linode
concentrations: ["Kubernetes"]
external_resources:
- '[Kubernetes Concepts Documentation](https://kubernetes.io/docs/concepts/)'
- '[Official Hugo Documentation](https://gohugo.io/getting-started/installing/)'
- '[Official Docker Documentation](https://docs.docker.com/docker-hub/builds/)'
---

## Kubernetes and Docker

Kubernetes is a system that automates the deployment, scaling, and management of containerized applications. Containerizing an application requires a base image that can be used to create an instance of a container. Once an application's image exists, you can push it to a centralized container registry that Kubernetes can use to deploy container instances in a cluster's pods.

While Kubernetes supports several container runtimes, Docker is a very popular choice. Docker images are created using a *Dockerfile* that contains all commands, in their required order of execution, needed to build a given image. For example, a Dockerfile might contain instructions to install a specific operating system referencing another image, install an application's dependencies, and execute configuration commands in the running container.

Docker Hub is a centralized container image registry that can host your images and make them available for sharing and deployment. You can also find and use official Docker images and vendor specific images. When combined with a remote version control service, like GitHub, Docker Hub allows you to automate building container images and trigger actions for further automation with other services and tooling.

## Scope of This Guide

This guide will show you how to package a Hugo static site in a Docker container image, host the image on Docker Hub, and deploy the container image on a Kubernetes cluster running on Linode. This example, is meant to demonstrate how applications can be containerized using Docker to leverage the deployment and scaling power of Kubernetes.

Hugo is written in [Go](https://golang.org/) and is known for being extremely fast to compile sites, even very large ones. It is well-supported, [well-documented](https://gohugo.io/documentation/), and has an [active community](https://discourse.gohugo.io/). Some useful Hugo features include [*shortcodes*](https://gohugo.io/content-management/shortcodes/), which are an easy way to include predefined templates inside of your Markdown, and built-in [*LiveReload*](https://gohugo.io/getting-started/usage/#livereload) web server, which allows you to preview your site changes locally as you make them.

{{< note >}}
This guide was written using version 1.14 of Kubectl.
{{< /note >}}

## Before You Begin

1. Create a Kubernetes cluster with one worker node. This can be done in two ways:
    1. Deploy a Kubernetes cluster using [kubeadm](/docs/guides/getting-started-with-kubernetes/).
        - You will need to deploy two Linodes. One will serve as the master node and the other will serve as a worker node.
    1. Deploy a Kubernetes cluster using [k8s-alpha CLI](/docs/guides/how-to-deploy-kubernetes-on-linode-with-k8s-alpha-cli/).

    {{< content "k8s-alpha-deprecation-shortguide" >}}

1. [Create a GitHub account](https://github.com/join) if you don't already have one.

1. [Create a Docker Hub account](https://hub.docker.com/signup) if you don't already have one.

### Set up the Development Environment

Development of your Hugo site and Docker image will take place locally on your personal computer. You will need to install Hugo, Docker CE, and Git, a version control software, on your personal computer to get started.

1. Use the [How to Install Git on Linux, Mac or Windows](/docs/guides/how-to-install-git-on-linux-mac-and-windows/) guide for the steps needed to install Git.

1. Install Hugo. [Hugo's official documentation](https://gohugo.io/getting-started/installing/) contains more information on installation methods, like [Installing Hugo from Tarball](https://gohugo.io/getting-started/installing/#install-hugo-from-tarball). Below are installation instructions for common operating systems:

    -   Debian/Ubuntu:

            sudo apt-get install hugo

    -   Fedora, Red Hat and CentOS:

            sudo dnf install hugo

    -   Mac, using [Homebrew](https://brew.sh):

            brew install hugo

1. {{< content "installing-docker-shortguide" >}}

## Create a Hugo Site

### Initialize the Hugo Site

In this section you will use the [Hugo CLI](https://gohugo.io/commands/) (command line interface) to create your Hugo site and initialize a Hugo theme. Hugo's CLI provides several useful commands for common tasks needed to build, configure, and interact with your Hugo site.

1. Create a new Hugo site on your local computer. This command will create a folder named `example-site` and scaffold [Hugo's directory structure](https://gohugo.io/getting-started/directory-structure/) inside it:

        hugo new site example-site

1. Move into your Hugo site's root directory:

        cd example-site

1. You will use Git to add a theme to your Hugo site's directory. Initialize your Hugo site's directory as a Git repository:

        git init

1. Install the [Ananke theme](https://github.com/budparr/gohugo-theme-ananke) as a submodule of your Hugo site's Git repository. [Git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules) allow one Git repository to be stored as a subdirectory of another Git repository, while still being able to maintain each repository's version control information separately. The Ananke theme's repository will be located in the `~/example-site/themes/ananke` directory of your Hugo site.

        git submodule add https://github.com/budparr/gohugo-theme-ananke.git themes/ananke

    {{< note >}}
Hugo has many [available themes](https://themes.gohugo.io/) that can be installed as a submodule of your Hugo site's directory.
    {{< /note >}}

1. Add the theme to your Hugo site's [configuration file](https://gohugo.io/getting-started/configuration/). The configuration file (`config.toml`) is located at the root of your Hugo site's directory.

        echo 'theme = "ananke"' >> config.toml

### Add Content to the Hugo Site

You can now begin to add content to your Hugo site. In this section you will add a new post to your Hugo site and generate the corresponding static file by building the Hugo site on your local computer.

1. Create a new content file for your site. This command will generate a Markdown file with an auto-populated date and title:

        hugo new posts/my-first-post.md

1.  You should see a similar output. Note that the file is located in the `content/posts/` directory of your Hugo site:

    {{< output >}}
/home/username/example-site/content/posts/my-first-post.md created
    {{</ output >}}

1. Open the Markdown file in the text editor of your choice to begin modifying its content; you can copy and paste the example snippet into your file, which contains an updated *front matter* section at the top and some example Markdown body text.

    Set your desired value for `title`. Then, set the `draft` state to `false` and add your content below the `---` in Markdown syntax, if desired:

    {{< file "/home/username/example-site/content/posts/my-first-post.md" >}}
---
title: "My First Post"
date: 2019-05-07T11:25:11-04:00
draft: false
---

# Kubernetes Objects

In Kubernetes, there are a number of objects that are abstractions of your Kubernetes system’s desired state. These objects represent your application, its networking, and disk resources – all of which together form your application. Kubernetes objects can describe:

- Which containerized applications are running on the cluster
- Application resources
- Policies that should be applied to the application
{{</ file >}}

    {{< disclosure-note "About front matter" >}}
[*Front matter*](https://gohugo.io/content-management/front-matter/) is a collection of metadata about your content, and it is embedded at the top of your file within opening and closing `---` delimiters.

Front matter is a powerful Hugo feature that provides a mechanism for passing data that is attached to a specific piece of content to Hugo's rendering engine. Hugo accepts front matter in TOML, YAML, and JSON formats. In the example snippet, there is YAML front matter for the title, date, and draft state of the Markdown file. These variables will be referenced and displayed by your Hugo theme.
{{< /disclosure-note >}}

1. Once you have added your content, you can preview your changes by building and serving the site using Hugo's built-in webserver:

        hugo server

1.  You will see a similar output:

    {{< output >}}
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp| EN
+------------------+----+
  Pages&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp| 11
  Paginator pages&nbsp&nbsp&nbsp&nbsp|  0
  Non-page files&nbsp&nbsp&nbsp&nbsp&nbsp|  0
  Static files&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|  3
  Processed images&nbsp&nbsp&nbsp|  0
  Aliases&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|  1
  Sitemaps&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|  1
  Cleaned&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|  0

Total in 7 ms
Watching for changes in /home/username/example-site/{content,data,layouts,static,themes}
Watching for config changes in /home/username/example-site/config.toml
Serving pages from memory
Running in Fast Render Mode. For full rebuilds on change: hugo server --disableFastRender
Web Server is available at http://localhost:1313/ (bind address 127.0.0.1)
Press Ctrl+C to stop
{{</ output >}}

1. The output will provide a URL to preview your site. Copy and paste the URL into a browser to access the site. In the above example Hugo's web server URL is `http://localhost:1313/`.

1. When you are happy with your site's content you can *build* the site:

        hugo -v

    Hugo will generate your site's static HTML files and store them in a `public` directory that it will create inside your project. The static files that are generated by Hugo are the files that will be served to the internet through your Kubernetes cluster.

1.  View the contents of your site's `public` directory:

        ls public

    Your output should resemble the following example. When you built the site, the Markdown file you created and edited in steps 6 and 7 was used to generate its corresponding static HTML file in the `public/posts/my-first-post/index.html` directory.

    {{< output >}}
  404.html    categories  dist        images      index.html  index.xml   posts       sitemap.xml tags
    {{</ output >}}

### Version Control the Site with Git

The example Hugo site was initialized as a local Git repository in the previous section. You can now version control all content, theme, and configuration files with Git. Once you have used Git to track your local Hugo site files, you can easily push them to a remote Git repository, like [GitHub](https://github.com/) or [GitLab](https://about.gitlab.com/). Storing your Hugo site files on a remote Git repository opens up many possibilities for collaboration and automating Docker image builds. This guide will not cover automated builds, but you can learn more about it on [Docker's official documentation](https://docs.docker.com/docker-hub/builds/).

1. Add a `.gitignore` file to your Git repository. Any files or directories added to the `.gitignore` file will not be tracked by Git. The Docker image you will create in the next section will handle building your static site files. For this reason it is not necessary to track the `public` directory and its content.

        echo 'public/' >> .gitignore

1. Display the state of your current working directory (root of your Hugo site):

        git status

1. Stage all your files to be committed:

        git add -A

1. Commit all your changes and add a meaningful commit message:

        git commit -m 'Add content, theme, and config files.'

    {{< note >}}
Any time you complete work related to one logical change to the Hugo site, you should make sure you commit the changes to your Git repository. Keeping your commits attached to small changes makes it easier to understand the changes and to roll back to previous commits, if necessary. See the [Getting Started with Git](/docs/guides/how-to-configure-git/) guide for more information.
    {{</ note >}}

## Create a Docker Image
### Create the Dockerfile

A Dockerfile contains the steps needed to build a Docker image. The Docker image provides the minimum set up and configuration necessary to deploy a container that satisfies its specific use case. The Hugo site's minimum Docker container configuration requirements are an operating system, Hugo, the Hugo site's content files, and the NGINX web server.

1. In your Hugo site's root directory, create and open a file named `Dockerfile` using the text editor of your choice. Add the following content to the file. You can read the Dockerfile comments to learn what each command will execute in the Docker container.
    {{< note >}}
The following Dockerfile uses Ubuntu to install Hugo. However, Ubuntu may not have the most up to date Hugo package. If this is the case, you could also create a Dockerfile based on Arch Linux or another Linux distribution that has a more up to date Hugo package.
    {{< /note >}}

    {{< file "Dockerfile">}}
#Install the container's OS.
FROM ubuntu:latest as HUGOINSTALL

# Install Hugo.
RUN apt-get update
RUN apt-get install hugo

# Copy the contents of the current working directory to the hugo-site
# directory. The directory will be created if it doesn't exist.
COPY . /hugo-site

# Use Hugo to build the static site files.
RUN hugo -v --source=/hugo-site --destination=/hugo-site/public

# Install NGINX and deactivate NGINX's default index.html file.
# Move the static site files to NGINX's html directory.
# This directory is where the static site files will be served from by NGINX.
FROM nginx:stable-alpine
RUN mv /usr/share/nginx/html/index.html /usr/share/nginx/html/old-index.html
COPY --from=HUGOINSTALL /hugo-site/public/ /usr/share/nginx/html/

# The container will listen on port 80 using the TCP protocol.
EXPOSE 80
    {{</ file >}}

1. Add a `.dockerignore` file to your Hugo repository. It is important to ensure that your images are as small as possible to reduce the time it takes to build, pull, push, and deploy the container. The `.dockerignore` file excludes files and directories that are not necessary for the function of your container or that may contain sensitive information that you do not want to included in the image. Since the Docker image will build the static Hugo site files, you can ignore the `public/` directory. You can also exclude any Git related files and directories because they are not needed on the running container.

        echo -e "public/\n.git/\n.gitmodules/\n.gitignore" >> .dockerignore

1. Follow the steps 2 - 4 in the [Version Control the Site with Git](#version-control-the-site-with-git) section to add any new files created in this section to your local git repository.

### Build the Docker Image

You are now ready to build the Docker image. When Docker builds an image it incorporates the *build context*. A build context includes any files and directories located in the current working directory. By default, Docker assumes the current working directory is also the location of the Dockerfile.

{{< note >}}
If you have not yet created a [Docker Hub account](https://hub.docker.com/signup), you will need to do so before proceeding with this section.
{{</ note >}}

1. Build the Docker image and add a tag `mydockerhubusername/hugo-site:v1` to the image. Ensure you are in the root directory of your Hugo site. The tag will make it easy to reference a specific image version when creating your Kubernetes deployment manifest. Replace `mydockerhubusername` with your Docker Hub username and `hugo-site` with a Docker repository name you prefer.

        docker build -t mydockerhubusername/hugo-site:v1 .

    You should see a similar output. The entirety of the output has been removed for brevity:

    {{< output >}}
Sending build context to Docker daemon  3.307MB
Step 1/10 : FROM ubuntu:latest as HUGOINSTALL
 ---> 94e814e2efa8
Step 2/10 : ENV HUGO_VERSION=0.55.4
 ---> Using cache
 ---> e651df397e32
 ...

Successfully built 50c590837916
Successfully tagged hugo-k8s:v1
    {{</ output >}}

1. View all locally available Docker images:

        docker images

    You should see the docker image `hugo-site:v1` listed in the output:

    {{< output >}}
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
hugo-k8s            v1                  50c590837916        1 day ago          16.5MB
    {{</ output >}}

{{< disclosure-note "Push your Hugo Site Repository to GitHub">}}
You can push your local Hugo site's Git repository to GitHub in order to set up [Docker automated builds](https://docs.docker.com/docker-hub/builds/). Docker automated builds will build an image using a external repository as the build context and automatically push the image to your Docker Hub repository. This step is not necessary to complete this guide.
{{</ disclosure-note >}}

### Host your Image on Docker Hub

Hosting your Hugo site's image on Docker Hub will enable you to use the image in a Kubernetes cluster deployment. You will also be able to share the image with collaborators and the rest of the Docker community.

1. Log into your Docker Hub account via the command line on your local computer. Enter your username and password when prompted.

        docker login

1. Push the local Docker image to Docker Hub. Replace `mydockerhubusername/hugo-site:v1` with your image's tag name.

        docker push mydockerhubusername/hugo-site:v1

1. Navigate to Docker Hub to view your image on your account.

    The url for your image repository should be similar to the following: `https://cloud.docker.com/repository/docker/mydockerhubusername/hugo-site`. Replace the username and repository name with your own.

## Configure your Kubernetes Cluster

This section will use kubectl to configure and manage your Kubernetes cluster. If your cluster was deployed using kubeadm, you will need to log into your master node to execute the kubectl commands in this section. If, instead, you used the k8s-alpha CLI you can run all commands from your local computer.

In this section, you will create namespace, deployment, and service manifest files for your Hugo site deployment and apply them to your cluster with kubectl. Each manifest file creates different resources on the Kubernetes API that are used to create and the Hugo site's pods on the worker nodes.

### Create the Namespace

Namespaces provide a powerful way to logically partition your Kubernetes cluster and isolate components and resources to avoid collisions across the cluster. A common use-case is to encapsulate dev/testing/production environments with namespaces so that they can each utilize the same resource names across each stage of development.

Namespaces add a layer of complexity to a cluster that may not always be necessary. It is important to keep this in mind when formulating the architecture for a project's application. This example will create a namespace for demonstration purposes, but it is not a requirement. One situation where a namespace would be beneficial, in the context of this guide, would be if you were a developer and wanted to manage Hugo sites for several clients with a single Kubernetes cluster.

1. Create a directory to store your Hugo site's manifest files.

        mkdir -p clientx/k8s-hugo/

1. Create the manifest file for your Hugo site's namespace with the following content:

      {{< file "clientx/k8s-hugo/ns-hugo-site.yaml">}}
apiVersion: v1
kind: Namespace
metadata:
  name: hugo-site
      {{</ file >}}

      - The manifest file declares the version of the API in use, the kind of resource that is being defined, and metadata about the resource. All manifest files should provide this information.
      - The key-value pair `name: hugo-site` defines the namespace object's unique name.

1. Create the namespace from the `ns-hugo-site.yaml` manifest.

        kubectl create -f clientx/k8s-hugo/ns-hugo-site.yaml

1. View all available namespaces in your cluster:

        kubectl get namespaces

    You should see the `hugo-site` namespace listed in the output:

    {{< output >}}
NAME          STATUS   AGE
default       Active   1d
hugo-site     Active   1d
kube-public   Active   1d
kube-system   Active   1d
    {{</ output >}}

### Create the Service

The service will group together all pods for the Hugo site, expose the same port on all pods to the internet, and load balance site traffic between all pods. It is best to create a service prior to any controllers (like a deployment) so that the Kubernetes scheduler can distribute the pods for the service as they are created by the controller.

The Hugo site's service manifest file will use the NodePort method to get external traffic to the Hugo site service. NodePort opens a specific port on all the Nodes and any traffic that is sent to this port is forwarded to the service. Kubernetes will choose the port to open on the nodes if you do not provide one in your service manifest file. It is recommended to let Kubernetes handle the assignment. Kubernetes will choose a port in the default range, `30000-32767`.

{{< note >}}
The k8s-alpha CLI creates clusters that are pre-configured with useful Linode service integrations, like the Linode Cloud Controller Manager (CCM) which provides access to Linode's load balancer service, [NodeBalancers](https://www.linode.com/nodebalancers). In order to use Linode's NodeBalancers you can use the [LoadBalancer service type](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer) instead of NodePort in your Hugo site's service manifest file. For more details, see the [Kubernetes Cloud Controller Manager for Linode](https://github.com/linode/linode-cloud-controller-manager) GitHub repository.
{{</ note >}}

1. Create the manifest file for your service with the following content.

    {{< file "clientx/k8s-hugo/service-hugo.yaml">}}
apiVersion: v1
kind: Service
metadata:
  name: hugo-site
  namespace: hugo-site
spec:
  selector:
    app: hugo-site
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: NodePort
    {{</ file >}}

    - The `spec` key defines the Hugo site service object's desired behavior. It will create a service that exposes TCP port `80` on any pod with the `app: hugo-site` label.
    - The exposed container port is defined by the `targetPort:80` key-value pair.

1. Create the service for your Hugo site:

        kubectl create -f clientx/k8s-hugo/service-hugo.yaml

1. View the service and its corresponding information:

        kubectl get services -n hugo-site

    Your output will resemble the following:

    {{< output >}}
NAME        TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
hugo-site   NodePort   10.108.110.6   <none>        80:30304/TCP   1d
    {{</ output >}}

### Create the Deployment

A deployment is a controller that helps manage the state of your pods. The Hugo site deployment will define how many pods should be kept up and running with the Hugo site service and which container image should be used.

1. Create the manifest file for your Hugo site's deployment. Copy the following contents to your file.

      {{< file "clientx/k8s-hugo/deployment.yaml">}}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hugo-site
  namespace: hugo-site
spec:
  replicas: 3
  selector:
    matchLabels:
      app: hugo-site
  template:
    metadata:
      labels:
        app: hugo-site
    spec:
      containers:
      - name: hugo-site
        image: mydockerhubusername/hugo-site:v1
        imagePullPolicy: Always
        ports:
        - containerPort: 80
      {{</ file >}}

      - The deployment's object `spec` states that the deployment should have 3 replica pods. This means at any given time the cluster will have 3 pods that run the Hugo site service.
      - The `template` field provides all the information needed to create actual pods.
      - The label `app: hugo-site` helps the deployment know which service pods to target.
      - The `container` field states that any containers connected to this deployment should use the Hugo site image `mydockerhubusername/hugo-site:v1` that was created in the [Build the Docker Image](#build-the-docker-image) section of this guide.
      - `imagePullPolicy: Always` means that the container image will be pulled every time the pod is started.
      - `containerPort: 80` states the port number to expose on the pod's IP address. The system does not rely on this field to expose the container port, instead, it provides information about the network connections a container uses.

1. Create the deployment for your Hugo site:

        kubectl create -f clientx/k8s-hugo/deployment.yaml

1. View the Hugo site's deployment:

        kubectl get deployment hugo-site -n hugo-site

    Your output will resemble the following:

    {{< output >}}
NAME        READY   UP-TO-DATE   AVAILABLE   AGE
hugo-site   3/3     3            3           1d
    {{</ output >}}

### View the Hugo Site

After creating all required manifest files to configure your Hugo site's Kubernetes cluster, you should be able to view the site using a worker node's IP address and its exposed port.

1. Get your worker node's external IP address. Copy down the `EXTERNAL-IP` value for any worker node in the cluster:

        kubectl get nodes -o wide

1. Access the `hugo-site` services to view its exposed port.

        kubectl get svc -n hugo-site

    The output will resemble the following. Copy down the listed port number in the `30000-32767` range.

    {{< output >}}
NAME        TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
hugo-site   NodePort   10.108.110.6   <none>        80:30304/TCP   1d
    {{</ output >}}

1. Open a browser window and enter in a worker node's IP address and exposed port. An example url to your Hugo site would be, `http://192.0.2.1:30304`. Your Hugo site should appear.

    If desired, you can purchase a domain name and use [Linode's DNS Manager](/docs/guides/dns-manager/) to assign a domain name to the cluster's worker node IP address.

## Tear Down Your Cluster

To avoid being further billed for your Kubernetes cluster, tear down your cluster's Linodes. If you have Linodes that existed for only part a monthly billing cycle, you’ll be billed at the hourly rate for that service. See [Billing and Payments](/docs/guides/understanding-billing-and-payments/) to learn more.

- If you created your Kubernetes cluster:

    - using kubeadm, follow the [Managing Billing in the Cloud Manager > Removing Services](/docs/guides/manage-billing-in-cloud-manager/#removing-services) guide to remove your cluster's Linodes.

    - using the k8s-alpha CLI, issue the following command from your computer to delete the cluster:

            linode-cli k8s-alpha delete example-cluster

## Next Steps

Now that you are familiar with basic Kubernetes concepts, like configuring pods, grouping resources, and deploying services, you can deploy a Kubernetes cluster on Linode for production use by using the steps in the following guides:

  - [How to Deploy Kubernetes on Linode with the k8s-alpha CLI](/docs/guides/how-to-deploy-kubernetes-on-linode-with-k8s-alpha-cli/)
  - [How to Deploy Kubernetes on Linode with Rancher](/docs/guides/how-to-deploy-kubernetes-on-linode-with-rancher-2-x/)
