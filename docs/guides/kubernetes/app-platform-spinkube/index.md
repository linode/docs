---
slug: packaging-and-deploying-spin-apps-using-app-platform
title: "Packaging and Deploying Spin Apps using App Platform"
description: "Two to three sentences describing your guide."
og_description: "Optional two to three sentences describing your guide when shared on social media. If omitted, the `description` parameter is used within social links."
authors: ["Linode"]
contributors: ["Linode"]
published: 2025-03-19
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

Intro placeholder

## Workflow Diagram

diagram_placeholder

## Concepts

- Wasm

- Spin

- SpinKube

Spin

## App Platform Resources

### Apps

- Argo CD

- Harbor

- Ingress-NGINX-Platform

### Workloads

- Kwasm-Operator

- Spin-Operator

- Spin-Shim-Executor. This adds the `SpinAppExecutor` CRD (custom resource definition) to the cluster, which is used by the Spin Operator to determine which executor (e.g. the Wasm compatibility layer on the nodes) should be used in running a SpinApp.

### Services

## Before You Begin

1. [Create a Cloud Manager account](https://techdocs.akamai.com/cloud-computing/docs/getting-started#sign-up-for-an-account), if you do not already have one.

1. Self-enroll in the Akamai App Platform Beta. To register for the beta, visit the [Betas](https://cloud.linode.com/betas) page in the Cloud Manager and click the **Sign Up** button next to the Akamai App Platform Beta.

1. [Install the Docker Engine](https://docs.docker.com/engine/install/) on your workstation.

1. [Install Tinygo](https://tinygo.org/getting-started/install/) on your workstation. The demo used in this tutorial requires version 0.34.0. Run the following command to check your installed version:

    ```command {title="Your workstation"}
    tinygo version
    ```

1. [Install the Spin CLI](https://developer.fermyon.com/spin/v2/install) on your workstation.

1. [Install the latest Go release](https://go.dev/dl/) on your workstation.

## Deploy and Prepare App Platform

1. Follow these sections in the [Getting Started with the Akamai App Platform](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-akamai-application-platform) guide to provision a App Platform-enabled Kubernetes cluster and to log into the App Platform console:

    1. [Create an LKE cluster](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-akamai-application-platform#create-an-lke-cluster)

    1. [Access and download your kubeconfig](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-akamai-application-platform#access-and-download-your-kubeconfig)

    1. [Obtain the initial access credentials and sign in](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-akamai-application-platform#obtain-the-initial-access-credentials-and-sign-in)

1. Familiarize yourself with the App Platform console UI. In particular, the top navigation features two dropdown menus:

    1. The **View** toggle allows you to switch between the **platform** view and the **team** view, which affects which functions of App Platform are displayed in the left-side navigation. Some functions are displayed in both of these views, while others are available only in the platform view or only in the team view. Review the [overview documentation of these views](https://apl-docs.net/docs/for-ops/console/overview) for more information.

    1. The **Team** toggle allows you to switch between teams. Teams are isolated tenants in App Platform, and a namespace for each team (named `team-{{< placeholder "TEAM_NAME" >}}`) is created on the cluster. Prior to creating a workload or other resources on the cluster, select the team (in the top navigation dropdown menu) that the resources should be created for. That team's namespace is then set for those resources. See the [Teams documentation](https://apl-docs.net/docs/for-ops/console/teams) for more information.

1. Enable the Harbor app for App Platform. Harbor is a registry that is used to store containers for your cluster.

    1. Select the **platform** option from the **View** menu in the top navigation.

    1. Click the **Apps** item in the left-side navigation.

    1. The Harbor app appears as disabled box in the grid of different apps. Hover over this box and click on the power-on icon to enable the app. You are asked if you want to provision object storage for your cluster. This is not required for Harbor to function in a demo environment.

1. Create a new Team named `demo`:

    1. Select the **platform** option from the **View** menu in the top navigation.

    1. Click the **Teams** item in the left-side navigation.

    1. Click the **CREATE TEAM** button.

    1. Enter `demo` into the **Name** field. Use the default values for all other options in the form.

    1. Click the **SUBMIT** button at the end of the form.

1. Install the `kwasm-operator` Helm chart:

    1. Select the **team** option from the **View** menu in the top navigation. Select the **admin** option from the **Team** menu.

    1. Click the **Workloads** item in the left-side navigation.

    1. Click the **CREATE WORKLOAD** button.

    1. Select the `kwasm-operator` Helm chart from the catalog.

    1. Click the **Values** tab.

    1. Enter `kwasm-operator` in the **Name** field.

    1. Enter `kwasm` in the **namespace** field.

    1. Enable the **Create a new namespace** toggle.

    1. Click the **SUBMIT** button at the end of the form.

1. Use `kwasm-operator` to enable Wasm support on the cluster nodes:

   1. Select the **team** option from the **View** menu in the top navigation. Select the **admin** option from the **Team** menu.

   1. Click the **Shell** item in the left-side navigation. A shell session UI appears at the bottom of the console.

   3. In the console shell, run:

    ```command {title="App Platform console shell (admin team selected)}
    kubectl annotate node --all kwasm.sh/kwasm-node=true
    ```

    Output resembling the following should appear:

    ```output
    node/lke377780-583222-38daa4ab0000 annotated
    node/lke377780-583222-587143350000 annotated
    node/lke377780-583222-5ac1f8160000 annotated
    ```

    The `kwasm-operator` installs the required Wasm compatibility layer dependencies on the annotated nodes.

7. Install the `spin-operator` Helm chart:

    1. Select the **team** option from the **View** menu in the top navigation. Select the **admin** option from the **Team** menu.

    1. Click the **Workloads** item in the left-side navigation.

    1. Click the **CREATE WORKLOAD** button.

    1. Select the `spin-operator` Helm chart from the catalog.

    1. Click the **Values** tab.

    1. Enter `spin-operator` in the **Name** field.

    1. Enter `spin-operator` in the **namespace** field.

    1. Enable the **Create a new namespace** toggle.

    1. Click the **SUBMIT** button at the end of the form.

1. Install the `spin-shim-executor` Helm chart. This chart should be installed for every team that deploys Spin Apps.

    1. Select the **team** option from the **View** menu in the top navigation. Select the **demo** option from the **Team** menu.

    1. Click the **Workloads** item in the left-side navigation.

    1. Click the **CREATE WORKLOAD** button.

    1. Select the `spin-shim-executor` Helm chart from the catalog.

    1. Click the **Values** tab.

    1. Enter `spin-shim-executor-demo` in the **Name** field.

    1. Click the **SUBMIT** button at the end of the form.

Your App Platform cluster now has the dependencies required to run Spin apps.

## Create a New Spin App

This section shows how to create a demo Spin app using the Spin CLI. This demo app responds to HTTP requests with a "hello, world"-style response.

Spin apps are packaged and distributed as OCI artifacts. By leveraging OCI artifacts, Spin apps can be distributed using any registry that implements the Open Container Initiative Distribution Specification (a.k.a. “OCI Distribution Spec”). In particular, the Spin app created in this section is pushed up to the Harbor registry in the App Platform cluster.

The commands in this section should be run on your workstation, not in the App Platform console shell.

1. [Spin provides templates](https://developer.fermyon.com/spin/v2/writing-apps#creating-an-application-from-a-template) that can be used to create new Spin apps. Run the `spin templates upgrade` command to ensure that the templates available to you are compatible with your version of Spin:

    ```command {title="Your workstation"}
    spin templates upgrade --branch main --repo https://github.com/spinframework/spin
    ```

1. Create a new Spin App using the `http-go` template. Then, navigate into the `hello-spin` directory:

    ```command {title="Your workstation"}
    spin new --accept-defaults -t http-go hello-spin
    cd hello-spin
    ```

1. The Spin CLI created all necessary files inside the `hello-spin` directory. The implementation of the app is in `main.go`:

    ```file {title="hello-spin/main.go"}
    package main

    import (
        "fmt"
        "net/http"

        spinhttp "github.com/fermyon/spin/sdk/go/v2/http"
    )

    func init() {
        spinhttp.Handle(func(w http.ResponseWriter, r *http.Request) {
            w.Header().Set("Content-Type", "text/plain")
            fmt.Fprintln(w, "Hello Fermyon!")
        })
    }

    func main() {}
    ```

    This implementation responds to any incoming HTTP request. It returns an HTTP response with a status code of 200 (Ok) and `Hello Fermyon!` as the response body.

1. The Spin CLI simplifies packaging and distribution of Spin Apps. It provides the `spin registry push` command to build the app and push it to a container registry. Before you can package and push the app, you first need to login into the private registry. Follow these steps to log into your Harbor registry from your workstation:

    1. Select the **team** option from the **View** menu in the top navigation. Select the **demo** option from the **Team** menu.

    1. Click `Download DOCKERCFG` in the left-side navigation. A file named `docker-team-demo.json` is downloaded to your local downloads directory.

    1. If you have an existing `.docker/` folder on your workstation (from previously authenticating with a container registry), back it up before proceeding:

        ```command {title="Your workstation"}
        cp -r $HOME/.docker $HOME/.docker-backup
        ```

    1. Move and rename the `docker-team-demo.json` file to `config.json`, and place it inside a `.docker/` folder under your home directory:

        ```command {title="Your workstation"}
        mkdir -p $HOME/.docker/
        mv $HOME/Downloads/docker-team-demo.json $HOME/.docker/config.json
        ```

4. Log in using the Docker CLI. Replace the hostname with the hostname of your Harbor registry. The hostname resembles `harbor.lke{{< placeholder "ID_NUMBER">}}.akamai-apl.net`.

    ```command {title="Your workstation"}
    docker login {{< placeholder "HARBOR_REGISTRY_HOSTNAME" >}}
    ```

    There are a few ways to identify your Harbor registry hostname:

    - When viewing the App Platform console in your browser, the hostname for the console is displayed, which resembles `console.lke{{< placeholder "ID_NUMBER">}}.akamai-apl.net`. Replace `console` with `harbor` to obtain the Harbor hostname.

    - When viewing the Harbor UI in your browser (by selecting it from the **Apps** item in the left-navigation, while in the **platform** View), the hostname is in the URL.

    After running the login command, output resembling the following appears:

    ```output
    Authenticating with existing credentials... [Username: otomi-team-demo-push]

    i Info → To login with a different account, run 'docker logout' followed by 'docker login'


    Login Succeeded
    ```

1. You can now package and distribute the `hello-spin` app. Run the following command:

    ```
    spin registry push --build {{< placeholder "HARBOR_REGISTRY_HOSTNAME" >}}/team-demo/hello-spin:v0.0.1
    ```

    The output should resemble:

    ```
    Building component hello-spin with `tinygo build -target=wasi -gc=leaking -no-debug -o main.wasm main.go`
    go: downloading github.com/fermyon/spin/sdk/go/v2 v2.2.0
    go: downloading github.com/julienschmidt/httprouter v1.3.0
    Finished building all Spin components
    Pushing app to the Registry...
    Pushed with digest sha256:b9594bedae63fc1f701372e4f95a8ac8ee9093405b29e0f16125dc23ad8d6b82
    ```

1. To see the artifact you just pushed to Harbor:

    1. Select the **platform** option from the **View** menu in the top navigation. Select the **admin** option from the **Team** menu.

    1. Click **Apps** from the left-side navigation.

    1. Click the **Harbor** app. The Harbor UI is opened in a new tab.

    1. Click the **team-demo** project in the **Projects** table.

    1. Click the **hello-spin** repository.

## Deploy the Spin App

There are a few different ways to deploy Spin Apps:

- Use the Spin CLI and run `spin kube deploy` to directly deploy the app to your cluster

- Use `spin kube scaffold` to generate a .yaml file and use `kubectl apply -f` to create the `SpinApp` resource

- On App Platform, use the Spin App Helm chart.

This section shows how to use the Spin App Helm chart for App Platform. By using this method, you can take advantage of the continuous delivery and monitoring features of App Platform:

1. Select the **team** option from the **View** menu in the top navigation. Select the **admin** option from the **Team** menu.

1. Click the **Workloads** item in the left-side navigation.

1. Click the **CREATE WORKLOAD** button.

1. Select the `Spin-App` Helm chart from the catalog.

1. Click the **Values** tab.

1. Enter `hello-spin` in the **Name** field.

1. Set the **Auto image updater** option to **Semver**

1. In the **Semver** form:

    1. Enter `team-demo/hello-spin` in the **imageRepository** field

    1. Enter `v0.x` in the **versionConstraint** field.

1. In the chart values file, location the `image` and `replicaCount` parameters. Update the values for these parameters as follows:

    ```file {title="Chart values file"}
    image:
      repository: {{< placeholder "HARBOR_REGISTRY_HOSTNAME" >}}/team-demo/hello-spin
      tag: v0.0.1
    replicaCount: 1
    ```

1. Click the **SUBMIT** button at the end of the form.

1. After a few minutes, the status of the Workload should be healthy. Click on the **Application** link for the workload to see it in Argo CD.

## Connect to the Spin App

The Spin app is now deployed on the cluster, but it is not exposed to the internet. To expose the app, create an NGINX ingress service:

1. Select the **team** option from the **View** menu in the top navigation. Select the **admin** option from the **Team** menu.

1. Click the **Services** item in the left-side navigation.

1. Click the **CREATE SERVICE** button.

1. Enter 'hello-spin in the **Name** field.

1. In the **Exposure** form, select the **External** option.

1. Click the **SUBMIT** button at the end of the form.

1. In the list of services, click on the URL of the `hello-spin` app. The app's response is displayed in your browser:

## Update the Spin App

When you installed the Spin-App Helm chart, you set the **Auto image updater** to **Digest**. This automatically updates the deployed image to the most recent pushed version of a given tag. So, to update and re-deploy the Spin app, you just need to build a new version of it and push it to Harbor:

1. On your workstation, update the contents of the `main.go` file:

    ```file {title="hello-spin/main.go"}
    package main

    import (
        "fmt"
        "net/http"

        spinhttp "github.com/fermyon/spin/sdk/go/v2/http"
    )

    func init() {
        spinhttp.Handle(func(w http.ResponseWriter, r *http.Request) {
            w.Header().Set("Content-Type", "text/plain")
            fmt.Fprintln(w, "Hello Fermyon. Welcome to Akamai App Platform!")
        })
    }

    func main() {}
    ```

    This updated code features a new response message (`Hello Fermyon. Welcome to Akamai App Platform!`).

1. Build and push the app to Harbor:

    ```command {title="Your workstation"}
    spin registry push --build harbor.<domain-of-your-cluster>/team-demo/hello-spin:v0.0.2
    ```

1. To check the update, refresh the app in your browser. You should now see the new response message.