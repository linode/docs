---
slug: migrating-from-google-cloud-run-functions-to-knative
title: "Migrating from Google Cloud Run Functions to Knative"
description: "Two to three sentences describing your guide."
og_description: "Optional two to three sentences describing your guide when shared on social media. If omitted, the `description` parameter is used within social links."
authors: ["Linode"]
contributors: ["Linode"]
published: 2024-10-14
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

This guide walks through how to migrate a Google Cloud Run function to a Knative function running on Linode Kubernetes Engine.

Knative is an open-source platform that extends Kubernetes to manage serverless workloads. It provides components to deploy, run, and manage serverless applications and functions, enabling automatic scaling and efficient use of resources. Knative consists of several components:

-   **Serving**: Deploying and running serverless containers
-   **Eventing**: Managing event-driven architectures
-   **Functions**: Deploying and running functions locally and on Kubernetes

## Prerequisites

To follow along in this walkthrough, you’ll need the following:

-   A [Linode account](https://www.linode.com/cfe)
-   A [Linode API token](https://www.linode.com/docs/products/platform/accounts/guides/manage-api-tokens/)
-   [Git](https://git-scm.com/downloads)
-   [Kubectl](https://kubernetes.io/docs/tasks/tools/)
-   The [Linode CLI](https://www.linode.com/docs/products/tools/cli/guides/install/)
-   Knative’s [`func` CLI](https://knative.dev/docs/functions/install-func/)

## Step 1: Provision a Kubernetes Cluster on Linode

To provision resources on Linode, this guide will use the [Linode CLI](https://github.com/linode/linode-cli).

### Check Kubernetes versions

First, use the Linode CLI (`linode`) to see what Kubernetes versions are available:

```command
$ linode lke versions-list
┌───────┐
│ id      │
├───────┤
│ 1.30    │
├───────┤
│ 1.29    │
└───────┘
```

In general, you should provision the latest version, unless there are some special circumstances.

### Check available node types

Next, check what [Linode plans](https://www.linode.com/pricing/) are available.

$ linode linodes types

This will print information on different Linode plans, including pricing and performance details. This guide uses the **g6-standard-2** Linode, which comes with two CPU cores and 4 GB of memory.

To display the information for this Linode, run the following command:

```command
$ linode linodes types --label "Linode 4GB" --json --pretty
[
  {
    "addons": {...},
    "class": "standard",
    "disk": 81920,
    "gpus": 0,
    "id": "g6-standard-2",
    "label": "Linode 4GB",
    "memory": 4096,
    "network_out": 4000,
    "price": {
      "hourly": 0.036,
      "monthly": 24.0
    },
    "region_prices": [...],
    "successor": null,
    "transfer": 4000,
    "vcpus": 2
  }
]
```

### Create the Kubernetes cluster

After selecting a Kubernetes version and a Linode type for your cluster, create a cluster in the `ca-central` region with three nodes and auto-scaling enabled.

```command
$ linode lke cluster-create \
  --label knative-playground \
  --k8s_version 1.30 \
  --region ca-central \
  --node_pools '[{
    "type": "g6-standard-2",
    "count": 3,
    "autoscaler": {
      "enabled": true,
      "min": 3,
      "max": 8
    }
  }]'
```

After your cluster is successfully created, you should see the following:

```output
Using default values: {}; use the --no-defaults flag to disable defaults
┌─────────┬────────────────────┬────────────┬─────────────┬─────────────────────────────────┐
│ id      │  label             │ region     │ k8s_version │ control_plane.high_availability │
├─────────┼────────────────────┼────────────│─────────────┼─────────────────────────────────┤
│ 202679  │ knative-playground │ ca-central │ 1.30        │ False                           │
└─────────┴────────────────────┴────────────┴─────────────┴─────────────────────────────────┘
```

### Access the Kubernetes cluster

Next, fetch your cluster credentials to access it in the form of a kubeconfig file. The following commands will fetch a kubeconfig file for the cluster and save it in `~/.kube/lke-config`.

```
$ CLUSTER_ID=$(linode lke clusters-list --json | \
    jq -r \
      '.[] | select(.label == "knative-playground") | .id')


$ linode lke kubeconfig-view --json "$CLUSTER_ID" | \
    jq -r '.[0].kubeconfig' | \
    base64 --decode > ~/.kube/lke-config
```

Access your cluster using kubectl by specifying the kubeconfig file:

```command
$ kubectl get no --kubeconfig ~/.kube/lke-config
```

```output
NAME                            STATUS   ROLES    AGE   VERSION
lke202679-293551-06f33ccf0000   Ready    <none>   8h    v1.30.1
lke202679-293551-0bb2596c0000   Ready    <none>   8h    v1.30.1
lke202679-293551-58ccf2360000   Ready    <none>   8h    v1.30.1
```

**Note**: Optionally, you can avoid needing to include `--kubeconfig ~/.kube/lke-config` with every kubectl command by setting an environment variable for your current terminal window session.

```command
$ export KUBECONFIG=~/.kube/lke-config
```

```command
$ kubectl get no
```

```output
NAME                            STATUS   ROLES    AGE   VERSION
lke202679-293551-06f33ccf0000   Ready    <none>   8h    v1.30.1
lke202679-293551-0bb2596c0000   Ready    <none>   8h    v1.30.1
lke202679-293551-58ccf2360000   Ready    <none>   8h    v1.30.1
```

## Step 2: Set Up Knative on LKE

There are multiple ways to [install Knative on a Kubernetes cluster](https://knative.dev/docs/install/). This walkthrough will use the YAML manifests method.

### Install the Knative CRDs

Run the following command to install the Knative CRDs:

```command
$ RELEASE=releases/download/knative-v1.14.1/serving-crds.yaml \
    kubectl apply -f "https://github.com/knative/serving/$RELEASE"
```

```output
cus...k8s.io/certificates.networking.internal.knative.dev configured
cus...k8s.io/configurations.serving.knative.dev configured
cus...k8s.io/clusterdomainclaims.networking.internal.knative.dev configured
cus...k8s.io/domainmappings.serving.knative.dev configured cus...k8s.io/ingresses.networking.internal.knative.dev configured cus...k8s.io/metrics.autoscaling.internal.knative.dev configured cus...k8s.io/podautoscalers.autoscaling.internal.knative.dev configured
cus...k8s.io/revisions.serving.knative.dev configured cus...k8s.io/routes.serving.knative.dev configured
cus...k8s.io/serverlessservices.networking.internal.knative.dev configured
cus...k8s.io/services.serving.knative.dev configured cus...k8s.io/images.caching.internal.knative.dev configured
```

### Install Knative Serving

Next, install the Knative **Serving** component.

```command
$ RELEASE=releases/download/knative-v1.14.1/serving-core.yaml \
    kubectl apply -f "https://github.com/knative/serving/$RELEASE"
```

```output
pod/autoscaler-6c785b5655-r995x
pod/controller-6dd9b8448-dckv8
pod/webhook-7dbc5d48d7-dkxm7
service/activator-service
service/autoscaler
service/autoscaler-bucket-00-of-01
service/controller
service/webhook
deployment.apps/activator
deployment.apps/autoscaler
deployment.apps/controller
deployment.apps/webhook
replicaset.apps/activator-5886599f75
replicaset.apps/autoscaler-6c785b5655
replicaset.apps/controller-6dd9b8448
replicaset.apps/webhook-7dbc5d48d7
horizontalpodautoscaler.autoscaling/activator horizontalpodautoscaler.autoscaling/webhook
```

### Install the networking layer

Knative relies on an underlying networking layer. There are [several options for Knative networking](https://knative.dev/docs/install/operator/knative-with-operators/#install-the-networking-layer). [Kourier](https://github.com/knative-extensions/net-kourier) was designed specifically for Knative. The following commands will install Kourier and configure Knative to use Kourier as the networking layer:

```command
$ RELEASE=releases/download/knative-v1.14.0/kourier.yaml \
    kubectl apply -f "https://github.com/knative/net-kourier/$RELEASE"
```

```command
$ kubectl patch configmap/config-network \
    --namespace knative-serving \
    --type merge \
    --patch \
      '{"data":{"ingress-class":"kourier.ingress.networking.knative.dev"}}'
```

**Note**: If Istio is already installed in your cluster, you may choose to [reuse it for Knative](https://knative.dev/docs/install/operator/knative-with-operators/#__tabbed_1_2) as well.

### Record the external IP address

With Kourier configured, the Knative serving installation now has a [`LoadBalancer`](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer) service that can be used for external access. Retrieve the external IP address, in case you want to set up your own DNS later:

```command
$ kubectl get service kourier -n kourier-system
```

```output
NAME     TYPE          CLUSTER-IP     EXTERNAL-IP     PORT(S)         AGE
kourier  LoadBalancer  10.128.128.65  172.105.12.189  80:30580/TCP,
                                                      443:31780/TCP   2m56s
```

### Verify installation

Since Kourier added a few deployments, look at the updated list to make sure everything is in order.

```command
$ kubectl get deploy -n knative-serving
```

```output
NAME                    READY   UP-TO-DATE     AVAILABLE       AGE
activator               1/1     1              1               5m21s
autoscaler              1/1     1              1               5m20s
controller              1/1     1              1               5m19s
net-kourier-controller  1/1     1              1               4m50s
Webhook                 1/1     1              1               5m18s
```

### Configure DNS

Knative provides [multiple ways to configure DNS](https://knative.dev/docs/install/operator/knative-with-operators/#configure-dns). The Magic DNS method from Knative uses the [sslip.io](http://sslip.io) DNS service. When a request is sent to a subdomain of sslip.io that has an IP address embedded, the service returns that IP address. For example, sending a request to [https://52.0.56.137.sslip.io](https://52.0.56.137.sslip.io) returns `52.0.56.137` as the IP address.

The `default-domain` job configures Knative Serving to use sslip.io.

```command
$ MANIFEST=knative-v1.14.1/serving-default-domain.yaml \
    kubectl apply -f \
      "https://github.com/knative/serving/releases/download/$MANIFEST"
```

```output
job.batch/default-domain created
service/default-domain-service created
```

With Knative now operational in your cluster, you can begin working with Knative Functions.

### Step 3: Work with Knative Functions and the `func` CLI

Knative Functions is a programming model that simplifies the writing of distributed applications that run on Kubernetes and Knative, without requiring in-depth knowledge of containers, Kubernetes, or Knative itself. Developers can create stateless, event-driven functions that run as Knative services and run their functions locally during development and testing without needing a local Kubernetes cluster.

The [`func`](https://github.com/knative/func) CLI streamlines the developer experience for working with Knative Functions.

### The `func` CLI

The func CLI lets developers go through the complete lifecycle of functions—creating, building, deploying, and invoking.

```command
$ func
```

```output
func is the command line interface for managing Knative Function resources

	Create a new Node.js function in the current directory:
	func create --language node myfunction

	Deploy the function using Docker hub to host the image:
	func deploy --registry docker.io/alice

Learn more about Functions:  https://knative.dev/docs/functions/
Learn more about Knative at: https://knative.dev

Primary Commands:
  create      Create a function
  describe    Describe a function
  deploy      Deploy a function
  delete      Undeploy a function
  list        List deployed functions
  subscribe   Subscribe a function to events

Development Commands:
  run         Run the function locally
  invoke      Invoke a local or remote function
  build       Build a function container

System Commands:
  config      Configure a function
  languages   List available function language runtimes
  templates   List available function source templates
  repository  Manage installed template repositories
  environment Display function execution environment information

Other Commands:
  completion  Output functions shell completion code
  version     Function client version information

Use "func <command> --help" for more information about a given command.
```

### Create a function

Create a Golang function that can be invoked via an HTTP endpoint (the default invocation method):

```command
$ func create -l go get-emojis-go
```

This command creates a complete directory with multiple files.

```output
$ ls -laGh get-emojis-go
total 40K
drwxr-xr-x 3 coder 4.0K Aug 5 08:46 .
drwxrwxr-x 3 coder 4.0K Aug 5 08:46 ..
drwxrwxr-x 2 coder 4.0K Aug 5 08:46 .func
-rw-r--r-- 1 coder  217 Aug 5 08:46 .funcignore
-rw-r--r-- 1 coder   94 Aug 5 08:46 func.yaml
-rw-r--r-- 1 coder  235 Aug 5 08:46 .gitignore
-rw-r--r-- 1 coder   25 Aug 5 08:46 go.mod
-rw-r--r-- 1 coder  483 Aug 5 08:46 handle.go
-rw-r--r-- 1 coder  506 Aug 5 08:46 handle_test.go
-rw-r--r-- 1 coder  611 Aug 5 08:46 README.md
```

Covering the purpose of each file is outside the scope of this guide. However, you should examine the code for `func.go`, which is the default implementation that Knative generates.

```file
package function

import (
	"fmt"
	"net/http"
	"net/http/httputil"
)

// Handle an HTTP Request.
func Handle(w http.ResponseWriter, r *http.Request) {
	/*
	 * YOUR CODE HERE
	 *
	 * Try running `go test`.  Add more test as you code in `handle_test.go`.
	 */

	dump, err := httputil.DumpRequest(r, true)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Println("Received request")
	fmt.Printf("%q\n", dump)
	fmt.Fprintf(w, "%q", dump)
}
```

This function works as a server that returns information from the original request.

### Build a function image

The next step is to create a container image from your function. Remember that the function must eventually run on a Kubernetes cluster, and that requires a containerized workload. Knative Functions facilitates this containerization for developers, abstracting the concerns related to Dockerfiles and Docker. Simply run the `func build` command. All you need is access to a container registry.

```command
~/get-emojis-go$ func build --registry docker.io/your_username --push
```

```output
Building function image
Still building
Still building
Yes, still building
Don't give up on me
🙌 Function build: docker.io/your_username/get-emojis-go:latest
```

This command fetches a base image, builds a Docker image from the function, and pushes it to the Docker registry.

```command
$ docker images | rg 'knative|get-emojis-go|ID'
```

```ouput
REPOSITORY                     TAG      IMAGE ID       CREATED        SIZE
your_username/get-emojis-go    latest   69af52cecc6f   44 years ago   44MB
```

The `CREATED` timestamp is incorrect, but the image is valid.

### Run the function locally

To run the function locally, use the `func run` command.

```command
~/get-emojis-go$ func run
```

```output
function up-to-date. Force rebuild with --build
Running on host port 8080
Initializing HTTP function
listening on http port 8080

The function now runs on localhost at port 8080. As previously mentioned, this initial implementation outputs information from the original request. With your function running, navigate to `http://localhost:8080` in your browser. You should see the following in your terminal window:

Received request
GET / HTTP/1.1 localhost:8080
  Host: localhost:8080
  Connection: keep-alive
  Sec-Ch-Ua: "Chromium"; v="124", "Google Chrome"…
  User-Agent: Mozilla/5.0 (Macintosh; Intel Mac O…
  Sec-Fetch-User: ?1
  Sec-Ch-Ua-Mobile: ?0
  Sec-Fetch-Site: none
  Sec-Fetch-Dest: document
  Sec-Ch-Ua-Platform: "macOS"
  Upgrade-Insecure-Requests: 1
  Accept-Encoding: gzip, deflate, br, zstd
  Accept-Language: en-US,en;q=0.9
  Accept: text/html,application/xhtml+xml,applica…
  Sec-Fetch-Mode: navigate

Deploy the function
Deploy the function to your Kubernetes cluster as a Knative function.

~/get-emojis-go$ func deploy

…
Pushing function image to the registry "index.docker.io" using the "your_username" user credentials
🎯 Creating Triggers on the cluster
✅ Function deployed in namespace "default" and exposed at URL:
   http://get-emojis-go.default.172.105.12.189.sslip.io
```

Once the function has been deployed, and the Magic DNS record has been established. The function is ready to be invoked.

### Invoke the function via an HTTP endpoint

In a browser, visit your function’s URL. An example invocation may look like this:

[SCREENSHOT]

Your Knative function is accessible through a public HTTP endpoint. Now, it is time to migrate an a Cloud Run Function to Knative.

## Step 4: Migrate your Cloud Run Function to Knative

This guide will examine a sample Cloud Run function and walk you through how to migrate it to Knative. Cloud Run functions are similar to Knative functions. They have a trigger and a way to extract their input arguments from a context or event. 

In the handler below, the actual application logic of the Cloud Run function has been highlighted (in red). The function instantiates a `FuzzEmoji` object and calls its `getEmojis()` method, passing a list of emoji descriptions. The emoji descriptions may or may not map to official emoji names like "fire" (🔥) or "sunrise" (🌅). The function performs a fuzzy search of the descriptions and finds matching emojis.

```file
package google_cloud_function

import (
    "fmt"
    "github.com/GoogleCloudPlatform/functions-framework-go/functions"
    "github.com/the-gigi/get-emojis-google-cloud-function/pkg/fuzz_emoji"
    "net/http"
    "strings"
)

func init() {
    functions.HTTP("get-emojis", getEmojis)
}

func getEmojis(w http.ResponseWriter, r *http.Request) {
    descriptions := strings.Split(r.URL.Query().Get("descriptions"), ",")
    fuzzer := fuzz_emoji.NewFuzzEmoji()
    result := fuzzer.GetEmojis(descriptions)
    for k, v := range result {
        _, _ = fmt.Fprintf(w, "%s: {%v}\n", k, v)
    }
}
```

The rest of the code focuses on extracting emoji descriptions from the query parameters in the request and writing the result to the response object.

At the time of this writing, this Cloud Run function was deployed and available at the following HTTP endpoint:

https://us-east1-playground-161404.cloudfunctions.net/get-emojis

Invoking the function yielded the following result:

```command
$ curl https://us-east1-playground-161404.cloudfunctions.net/get-emojis?descriptions=flame,dawn
```

```output
flame: {fire, 🔥}
dawn: {sunrise, 🌅}
```

The function correctly returns the "fire" (🔥) emoji for the description "flame" and the "sunrise" emoji (🌅) for the description "dawn.”

### Isolating the Cloud Run function code from GCP specifics

The next step is to make sure the core application logic is separate from the GCP specifics. In this case, the work for this is already done, since the interface for the `getEmojis()` method simply takes a Golang slice of strings as descriptions.

If the `getEmojis()` method accessed Google Cloud Storage to fetch synonyms (instead of by importing the `fuzz_emoji` package from GitHub), this wouldn't work for a Knative function out of the box. This would require some refactoring.

### Migrating a single-file function to a Knative function

The core logic for the function has been isolated into a single Golang file called `fuzz_emoji.go`. This can be migrated to your Knative function. The code looks like this:

```file
package fuzz_emoji

import (
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "strings"

    "github.com/enescakir/emoji"
)

type FuzzEmoji struct {
    emojiDict map[string]string
}

func NewFuzzEmoji() *FuzzEmoji {
    f := &FuzzEmoji{
        emojiDict: make(map[string]string),
    }
    for name, e := range emoji.Map() {
        name := strings.Trim(name, ":")
        f.emojiDict[strings.ToLower(name)] = e
    }
    return f
}

func (f *FuzzEmoji) getSynonyms(word string) ([]string, error) {
    url := fmt.Sprintf("https://api.datamuse.com/words?rel_syn=%s", word)
    resp, err := http.Get(url)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf("failed to fetch synonyms: %s", resp.Status)
    }

    body, err := io.ReadAll(resp.Body)
    if err != nil {
        return nil, err
    }

    var words []struct {
        Word string `json:"word"`
    }
    if err := json.Unmarshal(body, &words); err != nil {
        return nil, err
    }

    synonyms := make([]string, len(words))
    for i, wordData := range words {
        synonyms[i] = wordData.Word
    }

    return synonyms, nil
}

func (f *FuzzEmoji) getEmoji(description string) (string, string) {
    description = strings.ToLower(description)

    // direct match
    if emojiChar, exists := f.emojiDict[description]; exists {
        return description, emojiChar
    }

    // Subset match
    for name, emojiChar := range f.emojiDict {
        if strings.Contains(name, description) {
            return name, emojiChar
        }
    }

    synonyms, err := f.getSynonyms(description)
    if err != nil {
        return "", ""
    }

    // Synonym match
    for _, syn := range synonyms {
        if emojiChar, exists := f.emojiDict[syn]; exists {
            return syn, emojiChar
        }
    }

    // Subset match
    for name, emojiChar := range f.emojiDict {
        for _, syn := range synonyms {
            if strings.Contains(name, syn) {
                return syn, emojiChar
            }
        }
    }

    return "", ""
}

func (f *FuzzEmoji) GetEmojis(descriptions []string) map[string]string {
    result := make(map[string]string)
    for _, d := range descriptions {
        name, emojiChar := f.getEmoji(d)
        result[d] = fmt.Sprintf("%s, %s", name, emojiChar)
    }
    return result
}
```

The file should go in a subfolder called `fuzz_emoji`, underneath the `pkg` subfolder of your Knative function folder. The folder structure should now look like this:

```command
$ tree get-emojis-go/
```

```output
get-emojis-go/
├── func.yaml
├── go.mod
├── handle.go
├── handle_test.go
├── pkg
│   └── fuzz_emoji
│       └── fuzz_emoji.go
└── README.md

2 directories, 6 files
```

Next, change the implementation of your Knative function in `handle.go` so that it uses the `fuzz_emoji` package:

```file
package function

import (
    "context"
    "fmt"
    "net/http"
    "strings"
    "function/pkg/fuzz_emoji"
)

func Handle(ctx context.Context, res http.ResponseWriter, req *http.Request) {
    descriptions := strings.Split(req.URL.Query().Get("descriptions"), ",")
    fuzzer := fuzz_emoji.NewFuzzEmoji()
    result := fuzzer.GetEmojis(descriptions)
    for k, v := range result {
        _, _ = fmt.Fprintf(res, "%s: {%v}\n", k, v)
    }
}
```

Here is a breakdown of what is happening in this code:

1.  Import standard Go packages for handling HTTP requests, strings, and output.
1.  Import the `fuzz_emoji` package, which contains the core logic.
1.  The `Handle()` function takes a context (unused), a response, and a request.
1.  The request contains the URL with the descriptions. Extract the emoji descriptions from the query parameters of the URL. Note that the function expects the descriptions to be a single comma-separated string, which it splits to get a list called `descriptions`.
1.  Call `NewFuzzEmoji` to instantiate a `FuzzEmoji` object.
1.  Call the `getEmojis()` method, passing the list of `descriptions` that were extracted.
1.  Iterate over the result map, printing the items to the response object.

Repeat the workflow you used earlier for building and deploying the Knative function. Before starting, it's important to add dependencies to the `go.mod` file of your Knative function. The `fuzz_emoji` package implementation uses the emoji package from [github.com/enescakir/emoji](http://github.com/enescakir/emoji), so your `go.mod` file should look like this:

```file
module function

go 1.21

require github.com/enescakir/emoji v1.0.0
```

Build and deploy the container.

```command
~/get-emojis-go$ func build --registry docker.io/your_username
~/get-emojis-go$ func deploy
```

Lastly, test your function using the public URL.

[SCREENSHOT]

The `descriptions` provided as a query parameter are echoed back, along with a corresponding emoji name and emoji for each description. The Knative function works as expected.

### Migrating a multi-file function to a Knative function

In the above case, the entire application logic was contained in a single file called `fuzz_emoji.go`. For larger workloads, you might have an implementation with multiple files or even multiple directories and packages.

Migrating to Knative in this case is actually not much more complicated. You would take the following steps:

1.  Copy all the files and directories into the `pkg` subfolder of your Knative function folder.
1.  Import those packages in `handle.go`.
1.  Update the `go.mod` file to include any dependencies used by your packages.

### Migrating external dependencies

When migrating a Cloud Run function, it’s possible that your function depends on various GCP services—such as Google Cloud Storage, Cloud SQL, Cloud Data Store, Cloud Pub/Sub, or others. You need to understand the use case for each dependency so that you can decide which option best suits your situation.

There are typically three options:

1.  **Keep it as it is**: The Knative function will also interact with the GCP services.
1.  **Replace the service**: For example, you might switch from a GCP service like Cloud Data Store to an alternative key-value store in the Kubernetes cluster.
1.  **Drop the functionality**: For example, don’t write messages to Cloud Pub/Sub anymore.

### Namespace and service account

The Knative function eventually runs as a pod in the Kubernetes cluster. This means it runs in a namespace and has a Kubernetes service account associated with it. These are determined when you run `func deploy`. You can specify `-n` (or `--namespace`) and `--service-account` arguments.

If you don't specify these, then the function will be deployed in the currently configured namespace for the cluster and will use the default service account of the namespace.

If your Knative function needs to access any Kubernetes resources, it’s recommended that you explicitly specify a dedicated namespace and create a dedicated service account. This is the  preferred approach, rather than granting permissions to the default service account of the namespace.

### Configuration and secrets

Your Cloud Run function may use the [Runtime Configurator](https://cloud.google.com/deployment-manager/runtime-configurator) and the [Secret Manager](https://cloud.google.com/security/products/secret-manager?hl=en) for configuration and sensitive information, neither of which should be embedded in the function's image. For example, if your function needs to access some GCP services, it would require GCP credentials to authenticate.

Kubernetes offers the [`ConfigMap`](https://kubernetes.io/docs/concepts/configuration/configmap/) and [`Secret`](https://kubernetes.io/docs/concepts/configuration/secret/) resources for this purpose. The migration process involves the following steps:

1.  Identify all the parameters and secrets the Cloud Run function uses.
1.  Create corresponding `ConfigMap` and `Secret` resources in the namespace for your Knative function.
1.  Grant the service account for your Knative function permissions to read the `ConfigMap` and `Secret`.

### Roles and permissions

As part of the migration, your Knative function may need to interact with various Kubernetes resources and services—such as data stores, `ConfigMaps`, and `Secrets`. Create a dedicated role with the necessary permissions, binding that role to the function's service account.

If your architecture is based on multiple Knative functions, it often makes sense to share the same service account, role, and role bindings between all the Knative functions.

### Logging, metrics, and distributed tracing

The logging experience in Knative is very similar to printing something in your Cloud Run Function. With GCP, output is automatically logged to Google Cloud Logging. That same print statement in a Knative function automatically sends log messages to your container's logs. If you have centralized logging, these messages are automatically recorded in your log system.

LKE provides the native Kubernetes dashboard by default. It runs on the control plane, so it doesn't take resources from your workloads. You can use the dashboard to explore your entire cluster:

[SCREENSHOT]

However, for production systems, consider using a centralized logging system like ELK/EFK, Loki, or Graylog. Also, use an observability solution like Prometheus and Grafana. Consider leveraging OpenTelemetry, too.

Knative has built-in support for distributed tracing, and it can be configured globally. Your Knative function will automatically participate.

### The debugging experience

Knative offers a debugging experience at multiple levels:

-   Unit test your core logic
-   Unit test your Knative function
-   Invoke your function locally

When you create a Go Knative function, Knative also generates a skeleton for a unit test, called `handle_test.go`.

Below is the modified test, updated for testing the fuzzy emoji search:

```file
package function

import (
    "context"
    "io"
    "net/http"
    "net/http/httptest"
    "testing"
)

func TestHandle(t *testing.T) {
    var (
        w   = httptest.NewRecorder()
        req = httptest.NewRequest(
            "GET",
            "http://example.com/test?descriptions=flame,dog",
            nil)
        res *http.Response
    )

    Handle(context.Background(), w, req)
    res = w.Result()
    defer res.Body.Close()

    data := make([]byte, 512)
    n, err := res.Body.Read(data)
    if err != nil && err != io.EOF {
        t.Fatal(err)
    }

    expected := "flame: {fire, 🔥}\ndog: {dog, 🐶}\n"
    result := string(data[:n])

    if expected != result {
        t.Fatalf("Failed to return the fire emoji")
    }

    if res.StatusCode != 200 {
        t.Fatalf("unexpected response code: %v", res.StatusCode)
    }
}
```

With this unit test, you can test the invocation of the function using `go test` or any Go IDE to place breakpoints and step through the code. If your function interacts with external services or the Kubernetes API server, you will need to mock these dependencies.

When you're satisfied with the code, you can test locally by packaging the function in a Docker container and running it with `func invoke`. This is done fully through Docker, without need for a local Kubernetes cluster.

At this point, you may want to fine-tune the size of the function image by removing any redundant dependencies.

Finally, you can deploy your function to a full-fledged staging environment (Kubernetes cluster with Knative installed) using `func deploy`. In the staging environment you can conduct integration, regression, and stress tests.

The resources below are provided to help you become familiar with migrating Google Cloud Run Functions to Knative functions on Linode Kubernetes Engine.

## Resources
-   [Knative](https://knative.dev/docs/)
-   [Knative Functions](https://knative.dev/docs/functions/)
-   [Knative Functions - Deep Dive (Video)](https://www.youtube.com/watch?v=l0EooTOGW84)
-   [Accessing request traces - Knative](https://knative.dev/docs/serving/accessing-traces/)
-   [Google Cloud Run Functions overview](https://cloud.google.com/functions/docs/concepts/overview)
-   [Prometheus](https://prometheus.io)
-   [Grafana Labs - Loki, Grafana, Tempo, Mimir](https://grafana.com)
-   [OpenTelemetry](https://opentelemetry.io)

The source code for this demo walkthrough is available here:

-   [Google Cloud Run Function](https://github.com/the-gigi/fuzz-emoji/tree/main/google_cloud_function)
-   [Knative function (Golang)](https://github.com/the-gigi/fuzz-emoji/tree/main/knative_functions/golang)