---
slug: how-to-deploy-a-static-site-on-linode-kubernetes-engine
description: 'This guide walks you through how to author and deploy a static site with Hugo after creating a cluster on LKE.'
keywords: ['kubernetes','kubernetes tutorial','docker kubernetes','docker and kubernetes', 'static site generator','hugo static site']
tags: ["docker","version control system","kubernetes","container","linode platform"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-11-12
modified: 2020-12-03
modified_by:
  name: Linode
title: "Deploy a Static Site on Linode Kubernetes Engine"
external_resources:
- '[Install and Set Up kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)'
aliases: ['/kubernetes/how-to-deploy-a-static-site-on-linode-kubernetes-engine/','/applications/containers/kubernetes/how-to-deploy-a-static-site-on-linode-kubernetes-engine/','/applications/containers/kubernetes/static-site-linode-kubernetes-engine/']
authors: ["Linode"]
---

*Linode Kubernetes Engine (LKE)* allows you to easily create, scale, and manage Kubernetes clusters to meet your application's demands, reducing the often complicated cluster set-up process to just a few clicks. Linode manages your Kubernetes master node, and you select how many Linodes you want to add as worker nodes to your cluster.

Deploying a static site using an LKE cluster is a great example to follow when learning Kubernetes. A [container](/docs/guides/kubernetes-reference/#container) image for a static site can be written in less than ten lines, and only one container image is needed. Therefore, it's often less complicated to deploy a static site on Kubernetes than some other applications that require multiple components.

{{< note type="alert" >}}
Following the instructions in this guide creates billable resources on your account in the form of Linodes and NodeBalancers. You are billed an hourly rate for the time that these resources exist on your account. Be sure to follow the [tear-down section](#tear-down-your-lke-cluster-and-nodebalancer) at the end of this guide if you do not wish to continue using these resources.
{{< /note >}}

## In this Guide

This guide shows you how to:

- [On your workstation, create a site with Hugo, a static site generator (SSG)](#create-a-static-site-using-hugo).
- [Containerize the static site using Docker](#create-a-docker-image).
- [Deploy the container to your LKE cluster](#deploying-the-container-to-lke).

## Before You Begin

- You should have a working knowledge of Kubernetes' key concepts, including master and worker nodes, Pods, Deployments, and Services. For more information on Kubernetes, see our [Beginner's Guide to Kubernetes](/docs/guides/beginners-guide-to-kubernetes/) series.

- You also need to prepare your workstation with some prerequisite software:

    - [Install kubectl](#install-kubectl) (your client's version should be at least 1.13)
    - [Install Git](#install-git)
    - [Install Docker](#install-docker)
    - [Sign up for a Docker Hub Account](#sign-up-for-a-docker-hub-account)
    - [Install Hugo](#install-hugo)

- Finally, you need to create a cluster on LKE, if you do not already have one:

    - To create a cluster in the Linode Cloud Manager, review the [Deploy a Cluster with Linode Kubernetes Engine](/docs/products/compute/kubernetes/) guide.

        {{< note >}}
        Specifically, follow the [Create an LKE Cluster](/docs/products/compute/kubernetes/guides/create-cluster/) and [Connect to your LKE Cluster with kubectl](/docs/products/compute/kubernetes/guides/kubectl/) sections.
        {{< /note >}}

    - To create a cluster from the Linode API, review the [Deploy and Manage a Cluster with Linode Kubernetes Engine and the Linode API](/docs/products/compute/kubernetes/guides/deploy-and-manage-cluster-with-the-linode-api/) tutorial.

        {{< note >}}
        Specifically, follow the [Create an LKE Cluster](/docs/products/compute/kubernetes/guides/deploy-and-manage-cluster-with-the-linode-api/#create-an-lke-cluster) section.
        {{< /note >}}

### Install kubectl

You should have `kubectl` installed on your local workstation. `kubectl` is the command line interface for Kubernetes, and allows you to remotely connect to your Kubernetes cluster to perform tasks.

{{< content "how-to-install-kubectl" >}}

### Install Git

To perform some of the commands in this guide you need to have Git installed on your workstation. Git is a version control system that allows you to save your codebase in various states to ease development and deployment. Follow our [How to Install Git on Linux, Mac or Windows](/docs/guides/how-to-install-git-on-linux-mac-and-windows/) guide for instructions on how to install Git.

### Install Docker

{{< content "installing-docker-shortguide" >}}

### Sign up for a Docker Hub Account

You use [Docker Hub](https://hub.docker.com/) to store your Docker image. If you don't already have a Docker Hub account, create one now.

### Install Hugo

A *static site generator* (SSG) is usually a command line tool that takes text files written in a markup language like [Markdown](https://daringfireball.net/projects/markdown/), applies a stylized template to the content, and produces valid HTML, CSS, and JavaScript files. Static sites are prized for their simplicity and speed, as they do not generally have to interact with a database.

The Linode documentation website, and this guide, employ [Hugo](https://gohugo.io). Hugo is a powerful and fast SSG written in the [Go](/docs/guides/install-go-on-ubuntu/#what-is-go) programming language, but you can choose one that best suits your needs by reading our [How to Choose a Static Site Generator guide](/docs/guides/how-to-choose-static-site-generator/).

The steps in this guide are generally the same across SSGs: install a static site generator, create some content in a text file, and then generate your site's HTML through a build process.

To download and install Hugo, you can use a package manager.

- For **Debian** and **Ubuntu**:

    ```command
    sudo apt-get install hugo
    ```

- For **Red Hat**, **Fedora**, and **CentOS**:

    ```command
    sudo dnf install hugo
    ```

- For **macOS**, use [Homebrew](https://brew.sh):

    ```command
    brew install hugo
    ```

- For **Windows**, use [Chocolatey](https://chocolatey.org/):

    ```command
    choco install hugo
    ```

For more information on downloading Hugo, you can visit the official [Hugo website](https://gohugo.io/getting-started/installing/).

## Create a Static Site Using Hugo

In this section you creates a static site on your workstation using Hugo.

1.  Use Hugo to scaffold a new site. This command creates a new directory with the name you provide, and inside that directory it creates the default Hugo directory structure and configuration files:

    ```command
    hugo new site lke-example
    ```

1.  Move into the new directory:

    ```command
    cd lke-example
    ```

1. Initialize the directory as a Git repository. This allows you to track changes to your website and save it in version control.

    ```command
    git init
    ```

1.  Hugo allows for custom themes. For the sake of this example, you install the [Ananke theme](https://github.com/budparr/gohugo-theme-ananke) as a [Git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules).

    ```command
    git submodule add https://github.com/budparr/gohugo-theme-ananke.git themes/ananke
    ```

    {{< note >}}
    Git submodules allow you to include one Git repository within another, each maintaining their own version history. To view a collection of Hugo themes, visit the [Hugo theme collection](https://themes.gohugo.io/).
    {{< /note >}}

1.  In the text editor of your choice, open the `config.toml` file and add the following line to the end:

    ```file
    theme = "ananke"
    ```

    This line instructs Hugo to search for a folder named `ananke` in the `themes` directory and applies the templating it finds to the static site.

1.  Add an example first post to your Hugo site:

    ```command
    hugo new posts/first_post.md
    ```

    This creates a Markdown file in the `content/posts/` directory with the name `first_post.md`. You see output like the following:

    ```output
    /Users/linode/k8s/lke/lke-example/content/posts/first_post.md created
    ```

1.  Open the `first_post.md` file in the text editor of your choosing. You see a few lines of *[front matter](https://gohugo.io/content-management/front-matter/)*, a format Hugo uses for extensible metadata, at the top of the file:

    ```file {title="lke-example/content/posts/first_post.md" lang=md}
    ---
    title: "First_post"
    date: 2019-07-29T14:22:04-04:00
    draft: false
    ---
    ```

    Change the `title` to your desired value, and change `draft` to `false`. Then, add some example [Markdown text](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) to the bottom of the file, like the example below:

    ```file {title="lke-example/content/posts/first_post.md" lang=md}
    ---
    title: "First Post About LKE Clusters"
    date: 2019-07-29T14:22:04-04:00
    draft: false
    ---

    ## LKE Clusters

    Linode Kubernetes Engine (LKE) clusters are:

    - Fast
    - Affordable
    - Scalable
    ```

1.  You can preview your changes by starting the local Hugo server:

    ```command
    hugo server
    ```

    You should see output like the following:

    ```output
    .                  | EN
    +------------------+----+
      Pages              |  8
      Paginator pages    |  0
      Non-page files     |  0
      Static files       |  3
      Processed images   |  0
      Aliases            |  0
      Sitemaps           |  1
      Cleaned            |  0

    Total in 6 ms
    Watching for changes in /Users/linode/k8s/lke/lke-example/{content,data,layouts,static,themes}
    Watching for config changes in /Users/linode/k8s/lke/lke-example/config.toml
    Serving pages from memory
    Running in Fast Render Mode. For full rebuilds on change: hugo server --disableFastRender
    Web Server is available at http://localhost:1313/ (bind address 127.0.0.1)
    Press Ctrl+C to stop
    ```

1.  Visit the URL that Hugo is running on. In the above example, the URL is `http://localhost:1313`. This server automatically updates whenever you make a change to a file in the Hugo site directory. To stop this server, enter **CTRL-C** on your keyboard in your terminal.

1.  When you are satisfied with your static site, you can generate the HTML, CSS, and JavaScript for your site by *building* the site:

    ```command
    hugo -v
    ```

    Hugo creates the site's files in the `public/` directory. View the files by listing them:

    ```command
    ls public
    ```

1.  You can build the site at any time from your source Markdown content files, so it's common practice to keep built files out of a Git repository. This practice keeps the size of the repository to a minimum.

    You can instruct Git to ignore certain files within a repository by adding them to a `.gitignore` file. Add the `public/` directory to your `.gitignore` file to exclude these files from the repository:

    ```command
    echo 'public/' >> .gitignore
    ```

1.  Add and commit the source files to the Git repository:

    ```command
    git add .
    git commit -m "Initial commit. Includes all of the source files, configuration, and first post."
    ```

    You are now ready to create a Docker image from the static site you've just created.

## Create a Docker Image

In this section you create a Docker container for your static site, which you then run on your LKE cluster. Before deploying it on your cluster, you test its functionality on your workstation.

1.  In your Hugo static site folder, create a new text file named `Dockerfile` and open it in the text editor of your choosing. A [Dockerfile](https://docs.docker.com/engine/reference/builder/) tells Docker how to create the container.

1.  Add the following contents to the `Dockerfile`. Each command has accompanying comments that describe their function:

    ```file {title="lke-example/Dockerfile"}
    # Install the latest Debian operating system.
    FROM alpine:3.12.0 as HUGO

    # Install Hugo.
    RUN apk update && apk add hugo

    # Copy the contents of the current working directory to the
    # static-site directory.
    COPY . /static-site

    # Command Hugo to build the static site from the source files,
    # setting the destination to the public directory.
    RUN hugo -v --source=/static-site --destination=/static-site/public

    # Install NGINX, remove the default NGINX index.html file, and
    # copy the built static site files to the NGINX html directory.
    FROM nginx:stable-alpine
    RUN mv /usr/share/nginx/html/index.html /usr/share/nginx/html/old-index.html
    COPY --from=HUGO /static-site/public/ /usr/share/nginx/html/

    # Instruct the container to listen for requests on port 80 (HTTP).
    EXPOSE 80
    ```

    Save the Dockerfile and return to the command prompt.

1.  Create a new text file named `.dockerignore` in your Hugo static site folder and add the following lines:

    ```file {title="lke-example/.dockerignore"}
    public/
    .git/
    .gitmodules/
    .gitignore
    ```

    {{< note >}}
    This file, similar to the `.gitignore` file you created in the previous section, allows you to ignore certain files within the working directory that you want to leave out of the container. Because you want the container to be the smallest size possible, the `.dockerignore` file includes the `public/` folder and some hidden folders that Git creates.
    {{< /note >}}

1.  Run the Docker `build` command. Replace `mydockerhubusername` with your Docker Hub username. The period at the end of the command tells Docker to use the current directory as its build context.

    ```command
    docker build -t mydockerhubusername/lke-example:v1 .
    ```

    {{< note >}}
    In the example below, the container image is named `lke-example` and has been given a version tag of `v1`. Feel free to change these values.
    {{< /note >}}

1.  Docker downloads the required Debian and NGINX images, as well as install Hugo into the image. Once complete, you should see output similar to the following:

    ```output
    Successfully built 320ae416c940
    Successfully tagged mydockerhubusername/lke-example:v1
    ```

1.  You can view the image by listing all local images:

    ```command
    docker images
    ```

    ```output
    REPOSITORY                       TAG   IMAGE ID       CREATED             SIZE
    mydockerhubusername/lke-example  v1    320ae416c940   About an hour ago   20.8MB
    ```

### Test the Docker Image

1.  You can test your new image by creating a container with it locally. To do so, enter the following `run` command:

    ```command
    docker run -p 8080:80 -d mydockerhubusername/lke-example:v1
    ```

    The `-p` flag instructs Docker to forward port `8080` on localhost to port `80` on the container. The `-d` flag instructs Docker to run in detached mode so that you are returned to the command prompt once the container initializes.

1.  Once the container has started, open your browser and navigate to `localhost:8080`. You should see your static site.

1.  You can stop the running container by finding the ID of the container and issuing the `stop` command. To find the ID of the container, use the `ps` command:

    ```command
    docker ps
    ```

    You should see a list of actively running containers, similar to the following:

    ```output
    b4a7b959a6c7        mydockerhubusername/lke-example:v1         "nginx -g 'daemon of…"   5 hours ago         Up 5 hours          0.0.0.0:8080->80/tcp        romantic_mahavira
    ```

1.  Note the random string of numbers and letters next to the image name. In the above example, the string is `b4a7b959a6c7`. Issue the `stop` command, supplying the string of numbers and letters:

    ```command
    docker stop b4a7b959a6c7
    ```

### Upload the Image to Docker Hub

1.  Now that you have a working container image, you can push that image to Docker Hub. First, log in to Docker Hub from your workstation's terminal:

    ```command
    docker login
    ```

1.  Next, push the image, with version tag, to Docker Hub, using the `push` command:

    ```command
    docker push mydockerhubusername/lke-example:v1
    ```

    You can now view your image on Docker Hub as a *repository*. To view all of your repositories, navigate to the [Docker Hub repository listing page](https://cloud.docker.com/repository/list).

1.  Lastly, add the `Dockerfile` and `.dockerignore` file to your Git repository:

    ```command
    git add .
    git commit -m "Add Dockerfile and .dockerignore."
    ```

    You are now ready to deploy the container to your LKE cluster.

## Deploying the Container to LKE

In this section, you create a [Deployment](/docs/guides/kubernetes-reference/#deployment) from the container you created in the previous section, and a [Service](/docs/guides/kubernetes-reference/#services) to load balance the deployment.

1.  Begin by navigating to a location outside of your static site directory. You do not need your static site directory for the remainder of this guide.

    ```command
    cd ..
    ```

1.  Create a new directory to house your Kubernetes [manifests](/docs/guides/kubernetes-reference/#kubernetes-manifests), and move into that directory:

    ```command
    mkdir manifests && cd manifests
    ```

### Create a Deployment

1.  In the text editor of your choice, create a new [YAML](https://yaml.org/) manifest file for your Deployment. Name the file `static-site-deployment.yaml`, save it to your `manifests` directory, and enter the contents of this snippet:

    ```file {title="manifests/static-site-deployment.yaml" lang=yaml}
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: static-site-deployment
      labels:
        app: static-site
    spec:
      replicas: 3
      selector:
        matchLabels:
          app: static-site
      template:
        metadata:
          labels:
            app: static-site
        spec:
          containers:
          - name: static-site
            image: mydockerhubusername/lke-example:v1
            imagePullPolicy: Always
            ports:
            - containerPort: 80
    ```

    - In this example the number of replica Pods is set to `3` on **line 8**. This value can be changed to meet the needs of your website.
    - The `spec.containers.image` field on **line 19** should be changed to match the name of the container image you pushed to Docker Hub. Be sure to include the proper version tag at the end of the container name.
    - `imagePullPolicy: Always` on **line 20** ensures that each time a Pod is created, the most recent version of the container image will be pulled from Docker Hub.

1.  Once you have a Deployment manifest, you can apply the deployment to the LKE cluster with `kubectl`:

    ```command
    kubectl apply -f static-site-deployment.yaml
    ```

1.  You can check on the progress of your Deployment by listing the available pods:

    ```command
    kubectl get pods
    ```

    If your Deployment was successful, you should see output like the following:

    ```output
    NAME                                    READY   STATUS   RESTARTS   AGE
    static-site-deployment-cdb88b5bb-7pbjc  1/1     Running  0          1h
    static-site-deployment-cdb88b5bb-gx9h5  1/1     Running  0          1h
    static-site-deployment-cdb88b5bb-lzdvh  1/1     Running  0          1h
    ```

### Create a Service

1.  Create a Service manifest file to provide load balancing for the deployment. Load balancing ensures that traffic is balanced efficiently across multiple backend nodes, improving site performance and ensuring that your static site is accessible should a node go down.

    Specifically, the Service manifest that is used in this guide triggers the creation of a Linode [NodeBalancer](/docs/products/networking/nodebalancers/get-started/).

    {{< note >}}
    The NodeBalancer's creation is controlled through the [Linode Cloud Controller Manager (CCM)](/docs/guides/kubernetes-reference/#linode-cloud-controller-manager). The CCM provides a number of settings, called `annotations`, that allow you to control the functionality of the NodeBalancer. To learn more about the CCM, read our [Installing the Linode CCM on an Unmanaged Kubernetes Cluster](/docs/guides/install-the-linode-ccm-on-unmanaged-kubernetes/) guide.
    {{< /note >}}

1.  Name the file `static-site-service.yaml`, save it to your `manifests` directory, and enter the contents of this snippet:

    ```file {title="manifests/static-site-service.yaml" lang=yaml}
    apiVersion: v1
    kind: Service
    metadata:
      name: static-site-service
      annotations:
        service.beta.kubernetes.io/linode-loadbalancer-throttle: "4"
      labels:
        app: static-site
    spec:
      type: LoadBalancer
      ports:
      - name: http
        port: 80
        protocol: TCP
        targetPort: 80
      selector:
        app: static-site
      sessionAffinity: None
    ```

1.  Once you've created your Service manifest file, you can apply it to the LKE cluster:

    ```command
    kubectl apply -f static-site-service.yaml
    ```

1.  You can check on the status of your Service by listing the Services currently running on your server:

    ```command
    kubectl get services
    ```

    You should see output similar to the following:

    ```output
    NAME                 TYPE          CLUSTER-IP     EXTERNAL-IP      PORT(S)        AGE
    kubernetes           ClusterIP     10.128.0.1     <none>           443/TCP        20h
    static-site-service  LoadBalancer  10.128.99.240  192.0.2.1        80:32648/TCP   100m
    ```

1.  Note the external IP address of the Service you created. This is the IP address of the NodeBalancer, and you can use it to view your static site.

1.  In the above example, the IP address is `192.0.2.1`. Navigate to the external IP address in the browser of your choice to view your static site. You should see the same content as when you tested your Docker image on your workstation.

## General Network and Firewall Information

{{< content "lke-network-firewall-information-shortguide" >}}

## Next Steps

If you'd like to continue using the static site that you created in this guide, you may want to assign a domain to it. Review the [DNS Records: An Introduction](/docs/guides/dns-overview/) and [DNS Manager](/docs/products/networking/dns-manager/) guides for help with setting up DNS. When setting up your DNS record, use the external IP address that you noted at the end of the previous section.

If you would rather not continue using the cluster you just created, review the [tear-down section](#tear-down-your-lke-cluster-and-nodebalancer) to remove the billable Linode resources that were generated.

## Tear Down your LKE Cluster and NodeBalancer

- To remove the NodeBalancer you created, all you need to do is delete the underlying Service. From your workstation:

    ```command
    kubectl delete service static-site-service
    ```

    Alternatively, you can use the manifest file you created to delete the Service. From your workstation:

    ```command
    kubectl delete -f static-site-service.yaml
    ```

-   To remove the LKE Cluster and the associated nodes from your account, navigate to the [Linode Cloud Manager](https://cloud.linode.com):

    1.  Click on the **Kubernetes** link in the sidebar. A new page with a table which lists your clusters appears.

    1.  Click on the **more options elipsis** next to the cluster you would like to delete, and select **Delete**.

    1.  You are prompted to enter the name of the cluster to confirm the action. Enter the cluster name and click **Delete**.

-  Lastly, remove the `KUBECONFIG` line you added to your Bash profile to remove the LKE cluster from your [available contexts](/docs/products/compute/kubernetes/guides/kubectl/#persist-the-kubeconfig-context).