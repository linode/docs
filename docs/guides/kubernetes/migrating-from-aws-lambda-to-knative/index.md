---
slug: migrating-from-aws-lambda-to-knative
title: "Migrating from AWS Lambda to Knative"
description: "Two to three sentences describing your guide."
og_description: "Optional two to three sentences describing your guide when shared on social media. If omitted, the `description` parameter is used within social links."
authors: ["Linode"]
contributors: ["Linode"]
published: 2024-09-19
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

This guide walks through the process of migrating an AWS Lambda function to a Knative function running on the Linode Kubernetes Engine (LKE).

Knative is an open source platform that extends Kubernetes to manage serverless workloads. It provides tools to deploy, run, and manage serverless applications and functions, enabling automatic scaling and efficient resource usage. Knative consists of several components:

-   **Serving**: Deployment and runs serverless containers.
-   **Eventing**: Facilitates event-driven architectures.
-   **Functions**: Deploys and runs functions locally and on Kubernetes.

## Prerequisites

To complete this walkthrough, you need the following:

-   [Linode Account](https://www.linode.com/cfe)
-   [Linode API Token](https://www.linode.com/docs/products/platform/accounts/guides/manage-api-tokens/)
-   [Git](https://git-scm.com/downloads)
-   [Kubectl](https://kubernetes.io/docs/tasks/tools/)
-   [Linode CLI](https://www.linode.com/docs/products/tools/cli/guides/install/)
-   [Knative’s `func` CLI](https://knative.dev/docs/functions/install-func/)

## Step 1: Provision a Kubernetes Cluster

This guide uses the [Linode CLI](https://github.com/linode/linode-cli) to provision resources, but there are several ways to create a Kubernetes cluster on Linode:

-   [Linode Cloud Manager](https://cloud.linode.com/)
-   [Linode CLI](https://github.com/linode/linode-cli)
-   [Linode API](https://techdocs.akamai.com/linode-api/reference/api)
-   [Terraform](https://registry.terraform.io/providers/linode/linode/latest/docs)
-   [Pulumi](https://www.pulumi.com/registry/packages/linode/)

### Check Available Kubernetes Versions

First, use the Linode CLI (`linode`) to see what Kubernetes versions are available:

```command
linode lke versions-list
```

```output
┌──────┐
│ id   │
├──────┤
│ 1.31 │
├──────┤
│ 1.30 │
├──────┤
│ 1.29 │
└──────┘
```

It's generally recommended to provision the latest version unless specific requirements dictate otherwise.

### Check Available Node Types

Next, check what Linode plans are available. View Linode’s pricing information [here](https://www.linode.com/cloud-computing-calculator/?promo=sitelin100-02162023&promo_value=100&promo_length=60&utm_source=google&utm_medium=cpc&utm_campaign=11178784975_112607711747&utm_term=g_kwd-46671155961_e_linode%20pricing&utm_content=467094105814&locationid=9073501&device=c_c&gad_source=1&gclid=Cj0KCQjw9Km3BhDjARIsAGUb4nzNzPsxMOeTdk2wyBd77ysa3K1UTZKH8STVYjuWeg1VeEjoubqv6GIaAl59EALw_wcB).

Use the following command to list different Linode plans, including pricing and performance details:

```command
linode linodes types
```

This guide uses the **g6-standard-2** Linode, which features two CPU cores and 4 GB of memory.

To display detailed information for this Linode, run the following command:

```command
linode linodes types --label "Linode 4GB" --json --pretty
```

```output
[
  {
    "addons": {
      "backups": {
        "price": {
          "hourly": 0.008,
          "monthly": 5.0
        },
        "region_prices": [
          {
            "hourly": 0.009,
            "id": "id-cgk",
            "monthly": 6.0
          },
          {
            "hourly": 0.01,
            "id": "br-gru",
            "monthly": 7.0
          }
        ]
      }
    },
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
    "region_prices": [
      {
        "hourly": 0.043,
        "id": "id-cgk",
        "monthly": 28.8
      },
      {
        "hourly": 0.05,
        "id": "br-gru",
        "monthly": 33.6
      }
    ],
    "successor": null,
    "transfer": 4000,
    "vcpus": 2
  }
]
```

### Create the Kubernetes Cluster

With a Kubernetes version and Linode type selected, use the following command to create a cluster in the `ca-central` region with three nodes and auto-scaling:

```command
linode lke cluster-create \
  --label knative-playground \
  --k8s_version 1.31 \
  --region us-mia \
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

Once your cluster is successfully created, you should see a message similar to the following:

```output
Using default values: {}; use the --no-defaults flag to disable defaults
┌─────────┬────────────────────┬────────────┬─────────────┬─────────────────────────────────┐
│ id      │  label             │ region     │ k8s_version │ control_plane.high_availability │
├─────────┼────────────────────┼────────────│─────────────┼─────────────────────────────────┤
│ 202679  │ knative-playground │ ca-central │ 1.30        │ False                           │
└─────────┴────────────────────┴────────────┴─────────────┴─────────────────────────────────┘
```

### Access the Kubernetes Cluster

To access your cluster, fetch the cluster credentials in the form of a `kubeconfig` file. Use the following commands to retrieve the cluster's `kubeconfig` file and save it to `~/.kube/lke-config`:

```command
CLUSTER_ID=$(linode lke clusters-list --json | \
    jq -r \
      '.[] | select(.label == "knative-playground") | .id')
```

```command
mkdir ~/.kube
```

```command
linode lke kubeconfig-view --json "$CLUSTER_ID" | \
    jq -r '.[0].kubeconfig' | \
    base64 --decode > ~/.kube/lke-config
```

Once you have the `kubeconfig` file, access your cluster using `kubectl` and specifying the file:

```command
kubectl get no --kubeconfig ~/.kube/lke-config
```

```output
NAME                            STATUS   ROLES    AGE   VERSION
lke202679-293551-06f33ccf0000   Ready    <none>   8h    v1.30.1
lke202679-293551-0bb2596c0000   Ready    <none>   8h    v1.30.1
lke202679-293551-58ccf2360000   Ready    <none>   8h    v1.30.1
```

{{< note >}}
Optionally, to avoid specifying `--kubeconfig ~/.kube/lke-config` with every `kubectl` command, you can set an environment variable for your current terminal session:

```command
export KUBECONFIG=~/.kube/lke-config
```

Then you can simply run:

```command
kubectl get no
```

```output
NAME                            STATUS   ROLES    AGE   VERSION
lke202679-293551-06f33ccf0000   Ready    <none>   8h    v1.30.1
lke202679-293551-0bb2596c0000   Ready    <none>   8h    v1.30.1
lke202679-293551-58ccf2360000   Ready    <none>   8h    v1.30.1
```
{{< /note >}}

## Step 2: Set Up Knative on LKE

There are multiple ways to [install Knative on a Kubernetes cluster](https://knative.dev/docs/install/). This walkthrough uses the YAML manifests method.

### Install the Knative CRDs

Run the following command to install the Knative CRDs:

```command
RELEASE=releases/download/knative-v1.15.2/serving-crds.yaml
kubectl apply -f "https://github.com/knative/serving/$RELEASE"
```

Upon successful execution, you should see a similar output indicating that the CRDs are configured:

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

Next, run the following command to install the Knative **Serving** component:

```command
RELEASE=releases/download/knative-v1.15.2/serving-core.yaml
kubectl apply -f "https://github.com/knative/serving/$RELEASE"
```

Upon successful completion, you should see similar output indicating that various resources are now created:

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

### Install the Networking Layer

Knative relies on an underlying networking layer. There are [several options for Knative networking](https://knative.dev/docs/install/operator/knative-with-operators/#install-the-networking-layer). This guide uses [Kourier](https://github.com/knative-extensions/net-kourier), which is designed specifically for Knative. Use the following commands to install Kourier and configure Knative to use it as the networking layer:

```command
RELEASE=releases/download/knative-v1.15.1/kourier.yaml
kubectl apply -f "https://github.com/knative-extensions/net-kourier/$RELEASE"
```

```command
kubectl patch configmap/config-network \
    --namespace knative-serving \
    --type merge \
    --patch \
      '{"data":{"ingress-class":"kourier.ingress.networking.knative.dev"}}'
```

{{< note >}}
If Istio is already installed in your cluster, you may choose to [reuse it for Knative](https://knative.dev/docs/install/operator/knative-with-operators/#__tabbed_1_2) as well.
{{< /note >}}

### Record the External IP Address

With Kourier configured, the Knative Serving installation now has a [`LoadBalancer`](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer) service for external access. Use the following command to retrieve the external IP address, in case you want to set up your own DNS later:

```command
kubectl get service kourier -n kourier-system
```

The output should resemble the following, with the external IP address shown:

```output
NAME     TYPE          CLUSTER-IP     EXTERNAL-IP     PORT(S)         AGE
kourier  LoadBalancer  10.128.128.65  172.105.12.189  80:30580/TCP,
                                                      443:31780/TCP   2m56s
```

### Verify installation

Since Kourier added several deployments, check the updated list to ensure everything is functioning correctly:

```command
kubectl get deploy -n knative-serving
```

You should see output similar to the following, confirming the availability of the various components:

```output
NAME                    READY   UP-TO-DATE     AVAILABLE       AGE
activator               1/1     1              1               5m21s
autoscaler              1/1     1              1               5m20s
controller              1/1     1              1               5m19s
net-kourier-controller  1/1     1              1               4m50s
Webhook                 1/1     1              1               5m18s
```

### Configure DNS

Knative offers [multiple ways to configure DNS](https://knative.dev/docs/install/operator/knative-with-operators/#configure-dns). This guide uses the Magic DNS method, which leverages the [sslip.io](http://sslip.io) DNS service. When a request is made to a subdomain of sslip.io containing an embedded IP address, the service resolves that IP address. For example, a request to [https://52.0.56.137.sslip.io](https://52.0.56.137.sslip.io) returns `52.0.56.137` as the IP address.

Use the `default-domain` job to configures Knative Serving to use sslip.io:

```command
MANIFEST=knative-v1.15.2/serving-default-domain.yaml
kubectl apply -f "https://github.com/knative/serving/releases/download/$MANIFEST"
```

You should see output similar to the following upon successful execution, confirming the creation of the default domain job and service:

```output
job.batch/default-domain created
service/default-domain-service created
```

With Knative now operational in your cluster, you can begin working with Knative Functions.

## Step 3: Work with Knative Functions and the `func` CLI

Knative Functions is a programming model that simplifies writing distributed applications on Kubernetes and Knative. It allows developers to create stateless, event-driven functions without requiring in-depth knowledge of containers, Kubernetes, or Knative itself.

The [`func`](https://github.com/knative/func) CLI streamlines the developer experience by providing tools to work with Knative Functions. This enables local development and testing of functions without the need for a local Kubernetes cluster.

### The `func` CLI

The `func` CLI allows developers to manage the entire lifecycle of functions (creating, building, deploying, and invoking).

To get started, run the following command:

```command
func
```

This displays help information for managing Knative Function resources:

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

### Create a Function

To create a Python function that can be invoked via an HTTP endpoint (the default invocation method), use the following command:

```command
func create -l python get-emojis
```

```output
Created python function in /home/{{< placeholder "USERNAME" >}}/get-emojis
```

This command creates a complete directory structure with multiple files:

```command
ls -laGh get-emojis
```

```output
total 48K
drwxr-xr-x 3 coder 4.0K Aug 4 16:04 .
-rwxr-xr-x 1 coder   55 Aug 4 16:04 app.sh
drwxrwxr-x 2 coder 4.0K Aug 4 16:04 .func
-rw-r--r-- 1 coder  217 Aug 4 16:04 .funcignore
-rw-r--r-- 1 coder 1.8K Aug 4 16:04 func.py
-rw-r--r-- 1 coder   98 Aug 4 16:04 func.yaml
-rw-r--r-- 1 coder   28 Aug 4 16:04 Procfile
-rw-r--r-- 1 coder  862 Aug 4 16:04 README.md
-rw-r--r-- 1 coder   28 Aug 4 16:04 requirements.txt
-rw-r--r-- 1 coder  259 Aug 4 16:04 test_func.py
drwxrwxr-x 3 coder 4.0K Aug 4 16:04 ..
-rw-r--r-- 1 coder  235 Aug 4 16:04 .gitignore
```

Covering the purpose of each file is outside the scope of this guide. However, you should examine the `func.py` file, which is the default implementation that Knative generates.:

```file {title="func.py" lang="python"}
from parliament import Context
from flask import Request
import json

# parse request body, json data or URL query parameters
def payload_print(req: Request) -> str:
    if req.method == "POST":
        if req.is_json:
            return json.dumps(req.json) + "\n"
        else:
            # MultiDict needs some iteration
            ret = "{"

            for key in req.form.keys():
                ret += '"' + key + '": "'+ req.form[key] + '", '

            return ret[:-2] + "}\n" if len(ret) > 2 else "{}"

    elif req.method == "GET":
        # MultiDict needs some iteration
        ret = "{"

        for key in req.args.keys():
            ret += '"' + key + '": "' + req.args[key] + '", '

        return ret[:-2] + "}\n" if len(ret) > 2 else "{}"

# pretty print the request to stdout instantaneously
def pretty_print(req: Request) -> str:
    ret = str(req.method) + ' ' + str(req.url) + ' ' + str(req.host) + '\n'
    for (header, values) in req.headers:
        ret += "  " + str(header) + ": " + values + '\n'

    if req.method == "POST":
        ret += "Request body:\n"
        ret += "  " + payload_print(req) + '\n'

    elif req.method == "GET":
        ret += "URL Query String:\n"
        ret += "  " + payload_print(req) + '\n'

    return ret

def main(context: Context):
    """
    Function template
    The context parameter contains the Flask request object and any
    CloudEvent received with the request.
    """

    # Add your business logic here
    print("Received request")

    if 'request' in context.keys():
        ret = pretty_print(context.request)
        print(ret, flush=True)
        return payload_print(context.request), 200
    else:
        print("Empty request", flush=True)
        return "{}", 200
```

This function acts as a server that returns the query parameters or form fields of the incoming request.

### Build a Function Image

The next step is to create a container image from your function. Since the function will run on a Kubernetes cluster, it must be containerized. Knative Functions facilitates this process for developers, abstracting the complexities of Docker and Dockerfiles.

To build and push your function, run the following `func build` command, ensuring you have access to a container registry:

```commandf
func build --registry docker.io/your_username --push
```

You should see output similar to the following as the function image is built:

```output
Building function image
Still building
Still building
Yes, still building
Don't give up on me
🙌 Function build: docker.io/your_username/get-emojis:latest
Pushing function image to the registry "index.docker.io" using the "your_username" user credentials
```

This command fetches a base image, builds a Docker image from your function, and then pushes it to the Docker registry.

To verify that the image is successfully created, use the following command to list your Docker images:

```command
docker images | rg 'knative|get-emojis|ID'
```

```output
REPOSITORY                     TAG      IMAGE ID       CREATED        SIZE
ghcr.io/…/builder-jammy-base  latest   58e634e9a771   44 years ago   1.6GB
your_username/get-emojis       latest   a5c58cce8219   44 years ago   293MB
```

Note that while the `CREATED` timestamp may be incorrect, the image is valid.

### Run the Function Locally

You can run the function locally to test its behavior before deploying it to a Kubernetes cluster. Use the following `func run` command to run the function locally:

```command
func run
```

The terminal should display output indicating that the function is set up and running:

```output
function up-to-date. Force rebuild with --build
Running on host port 8080
```

The function now runs on `localhost` at port `8080`. By default, this initial implementation returns the URL query parameters as a JSON object.

With your function running, open a web browser and navigate to the following URL:

```command
http://localhost:8080?a=1&b=2
```

You should see the output similar to the following in your terminal window:

```output
Received request
GET http://localhost:8080/?a=1&b=2 localhost:8080
  Host: localhost:8080
  Connection: keep-alive
  Cache-Control: max-age=0
  Sec-Ch-Ua: "Chromium"; v="124", "Google Chrome"…
  Sec-Ch-Ua-Mobile: ?0
  Sec-Ch-Ua-Platform: "macOS"
  Upgrade-Insecure-Requests: 1
  User-Agent: Mozilla/5.0 (Macintosh; Intel Mac O…
  Accept: text/html,application/xhtml+xml,applica…
  Sec-Fetch-Site: none
  Sec-Fetch-Mode: navigate
  Sec-Fetch-User: ?1
  Sec-Fetch-Dest: document
  Accept-Encoding: gzip, deflate, br, zstd
  Accept-Language: en-US,en;q=0.9
URL Query String:
  {"a": "1", "b": "2"}
```

### Deploy the Function

To deploy your function to a Kubernetes cluster as a Knative function, use the following `func deploy` command:

```command
func deploy
```

You should see output similar to the following during deployment:

```output
…
Pushing function image to the registry "index.docker.io" using the "your_username" user credentials
⬆️ Deploying function to the cluster
🎯 Creating Triggers on the cluster
✅ Function deployed in namespace "default" and exposed at URL:
   http://get-emojis.default.172.105.12.189.sslip.io
```

The function is ready to be invoked once the function is deployed and the Magic DNS record established.

### Invoke the Function via an HTTP Endpoint

To invoke your Knative function, open a web browser and visit the function’s public URL, adding any required query parameters. For example:

```command
http://get-emojis.default.172.105.12.189.sslip.io/?yeah=it-works!
```

The browser should display a JSON object containing the query parameters:

[SCREENSHOT]

Your Knative function is now accessible through this public HTTP endpoint.

With your Knative function running, the next step is migrate an AWS Lambda function to Knative.

## Step 4: Migrate Your AWS Lambda Function to Knative

This guide examines a sample Lambda function and walks you through how to migrate it to Knative. Conceptually, Lambda functions are similar to Knative functions. They both have a trigger and extract their input arguments from a context or event.

The main application logic is highlighted in the sample Lambda function below:

```file {lang="python" hl_lines="15-16"}
def handler(event, context):
    try:
        logger.info("Received event: %s", event)

        # The descriptions may arrive as attribute of the event
        descriptions = event.get("descriptions")
        if descriptions is None:
            # Parse the JSON body of the event
            body = json.loads(event.get("body", "{}"))
            logger.info("Parsed body: %s", body)

            descriptions = body.get("descriptions", [])
        logger.info("Descriptions: %s", descriptions)

        fuzz_emoji = FuzzEmoji()
        result = fuzz_emoji.get_emojis(descriptions)
        response = {
            'statusCode': 200,
            'body': json.dumps(result)
        }
    except Exception as e:
        response = {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

    return response
```

This function instantiates a `FuzzEmoji` object and calls its `get_emojis()` method, passing a list of emoji descriptions. The emoji descriptions may or may not map to official emoji names like `fire` (🔥) or `confused_face` (😕). The function performs a fuzzy search of the descriptions to find matching emojis.

The code above the highlighted lines extracts emoji descriptions from the `event` object passed to the handler. The code below the highlighted lines wraps the result in a response with a proper status code for success or failure.

At the time of this writing, this sample Lambda function was deployed and available at the following HTTP endpoint:

```command
https://64856ijzmi.execute-api.us-west-2.amazonaws.com/default/fuzz-emoji
```

Invoking the function returns the following result:

```output
$ curl -s -X POST --header "Content-type:application/json" \
    --data '{"descriptions":["flame","confused"]}' \
    https://64856ijzmi.execute-api.us-west-2.amazonaws.com/default/fuzz-emoji | \
    json_pp

{
   "confused" : "('confused_face', '😕')",
   "flame" : "('fire', '🔥')"
}
```

The function successfully returns the `fire` (🔥) emoji for the description "flame", and the `confused_face` emoji (😕) for the description "confused.”

### Isolating the AWS Lambda Code from AWS Specifics

To migrate the Lambda function to Knative, the core application logic must be decoupled from AWS-specific dependencies. Fortunately, in this case, the function's main logic is already isolated. The `get_emojis()` method only accepts a list of strings as input, which makes it easy to adapt for other platforms.

If the `get_emojis()` method were dependent on the AWS Lambda `event` object, it would not be compatible with Knative, as Knative does not provide an `event` object. This scenario would require some refactoring.

### Migrating a Single-File Function to a Knative Function

The core logic of the function is encapsulated into a single Python module named `fuzz_emoji.py`, which can be migrated to your Knative function. Find the module code below:

```file {lang="python"}
from typing import List, Mapping, Tuple

import emoji
import requests

class FuzzEmoji:
    def __init__(self):
        self.emoji_dict = {}
        emoji_list = {name: data for name, data in emoji.EMOJI_DATA.items() if 'en' in data}
        for emoji_char, data in emoji_list.items():
            name = data['en'].strip(':')
            self.emoji_dict[name.lower()] = emoji_char

    @staticmethod
    def get_synonyms(word):
        response = requests.get(f"https://api.datamuse.com/words?rel_syn={word}")
        if response.status_code == 200:
            synonyms = [word_data['word'] for word_data in response.json()]
            return synonyms

        raise RuntimeError(response.content)

    def get_emoji(self, description) -> Tuple[str, str]:
        description = description.lower()
        # direct match
        if description in self.emoji_dict:
            return description, self.emoji_dict[description]

        # Subset match
        for name in self.emoji_dict:
            if description in name:
                return name, self.emoji_dict[name]

        synonyms = self.get_synonyms(description)
        # Synonym match
        for syn in synonyms:
            if syn in self.emoji_dict:
                return syn, self.emoji_dict[syn]
        return '', ''

    def get_emojis(self, descriptions: List[str]) -> Mapping[str, str]:
        return {d: str(self.get_emoji(d)) for d in descriptions}
```

Copy the module into the same directory that Knative `func` created for your function:

```command
ls -laGh get-emojis/
```

The folder structure should now look like this:

```output
total 52K
drwxr-xr-x 3 coder 4.0K Aug 4 16:47 .
-rw-rw-r-- 1 coder 1.7K Aug 4 16:47 fuzz_emoji.py
-rwxr-xr-x 1 coder   55 Aug 4 16:04 app.sh
drwxrwxr-x 2 coder 4.0K Aug 4 16:04 .func
-rw-r--r-- 1 coder  217 Aug 4 16:04 .funcignore
-rw-r--r-- 1 coder 1.8K Aug 4 16:04 func.py
-rw-r--r-- 1 coder   98 Aug 4 16:04 func.yaml
-rw-r--r-- 1 coder   28 Aug 4 16:04 Procfile
-rw-r--r-- 1 coder  862 Aug 4 16:04 README.md
-rw-r--r-- 1 coder   28 Aug 4 16:04 requirements.txt
-rw-r--r-- 1 coder  259 Aug 4 16:04 test_func.py
drwxrwxr-x 3 coder 4.0K Aug 4 16:04 ..
-rw-r--r-- 1 coder  235 Aug 4 16:04 .gitignore
```

Next, change the implementation of your Knative function so that it calls the `fuzz_emoji` module:

```file
import json

from parliament import Context
from fuzz_emoji import FuzzEmoji

def main(context: Context):
    descriptions = context.request.args.get('descriptions').split(',')
    fuzz_emoji = FuzzEmoji()
    result = fuzz_emoji.get_emojis(descriptions)
    return json.dumps(result, ensure_ascii=False), 200
```

Here's a breakdown of what this code does:

1.  Imports the built-in `json`, the `Context` from [parliament](https://github.com/boson-project/parliament) (the function invocation framework that Knative uses for Python functions), and the `FuzzEmoji` class.

1.  The `main()` function takes the parliament `Context` as its only parameter. The context contains a Flask `request` property.

1.  The first line extracts the emoji descriptions from the Flask `request` arguments. It expects the descriptions to be a single comma-separated string, which it splits into a list of `descriptions`.

1.  Instantiates a `FuzzEmoji` object and calls its `get_emojis()` method.

1.  Uses the `json` module to serialize the response and return it with a `200` status code.

Next, add the requirements of `fuzz_emoji.py` (the `requests` and `emoji` packages) to the `requirements.txt` file of your Knative function to include these dependencies in the Docker image.

```file
parliament-functions==0.1.0
emoji==2.12.1
requests==2.32.3
```

Now build and deploy the container:

```command
cd ~/get-emojis
func build --registry docker.io/your_username
func deploy
```

Finally, test your function using the public URL:

[SCREENSHOT]

The `descriptions` provided as a query parameter are echoed back, along with a corresponding emoji name and emoji for each description. This confirms that the Knative function works as expected.

### Migrating a Multi-File Function to a Knative Function

In the previous example, the entire application logic was contained in a single file called `fuzz_emoji.py`. For larger workloads, your function might involve multiple files or even multiple directories and packages.

Migrating such a setup to Knative follows a similar process:

1.  Copy all relevant files and directories into the same `get-emojis` directory.

1.  Import any required modules in `func.py`.

1.  Update the `requirements.txt` file to include all of the dependencies used across any of the modules.

### Migrating External Dependencies

When migrating an AWS Lambda function, it may depend on various AWS services, such as S3, DynamoDB, SQS, or others. It's important to evaluate each dependency to determine the best option to suit your situation.

There are typically three options:

1.  **Keep it as-is**: Continue using the Knative function to interact with the AWS service.

1.  **Replace the service**: For example, you might switch from an AWS service like DynamoDB to an alternative key-value store in the Kubernetes cluster.

1.  **Drop the functionality**: Eliminate certain AWS-specific functionalities, such as no longer writing messages to AWS SQS.

### Namespace and Service Account

The Knative function eventually runs as a pod in the Kubernetes cluster. This means it runs in a namespace and has a Kubernetes service account associated with it. These are determined when you run the `func deploy` command. You can specify them using the `-n` (or `--namespace`) and `--service-account` arguments.

If you don't specify these options, the function deploys in the currently configured namespace and uses the default service account of the namespace.

If your Knative function needs to access any Kubernetes resources, it’s recommended to explicitly specify a dedicated namespace and create a dedicated service account. This is the preferred approach because it avoids granting excessive permissions to the default service account.

### Configuration and Secrets

If your AWS Lambda function uses `ParameterStore` and `SecretsManager` for configuration and sensitive information, these details should not be embedded directly in the function's image. For example, if your function needs to access AWS services, it would require AWS credentials to authenticate.

Kubernetes offers the [`ConfigMap`](https://kubernetes.io/docs/concepts/configuration/configmap/) and [`Secret`](https://kubernetes.io/docs/concepts/configuration/secret/) resources for this purpose. The migration process involves the following steps:

1.  Identify all the parameters and secrets the Lambda function uses.

1.  Create corresponding `ConfigMap` and `Secret` resources in the namespace for your Knative function.

1.  Grant the service account for your Knative function permissions to read `ConfigMap` and `Secret`.

### Roles and Permissions

Your Knative function may need to interact with various Kubernetes resources and services during migration, such as data stores, `ConfigMaps`, and `Secrets`. To enable this, create a dedicated role with the necessary permissions and bind it to the function's service account.

If your architecture includes multiple Knative functions, it's best practice to share the same service account, role, and role bindings between all the Knative functions.

### Logging, Metrics, and Distributed Tracing

The logging experience in Knative is similar to printing something in your AWS Lambda function. In AWS Lambda, output is automatically logged to CloudWatch. In Knative, that same print statement automatically sends log messages to your container's logs. If you have centralized logging, these messages are automatically recorded in your log system.

LKE provides the native Kubernetes dashboard by default. It runs on the control plane, so it doesn't take resources from your workloads. You can use the dashboard to explore and monitor your entire cluster:

[SCREENSHOT]

For production systems, consider using a centralized logging system like ELK/EFK, Loki, or Graylog. Also use an observability solution like Prometheus and Grafana. Consider leveraging OpenTelemetry as well. These tools can enhance the ability to monitor, troubleshoot, and optimize application performance while ensuring reliability and scalability.

Knative also has built-in support for distributed tracing, which can be configured globally. This means that your Knative function automatically participates in tracing without requiring additional changes.

### The Debugging Experience

Knative offers a debugging experience at multiple levels:

-   Unit test your core logic
-   Unit test your Knative function
-   Invoke your function locally

When you create a Python Knative function, Knative generates a skeleton for a unit test, called `test_func.py`. At the time of this writing, the generated test is invalid and requires some modifications to work correctly. See this [GitHub issue](https://github.com/knative/func/issues/2448) for details.

Below is the modified test, updated for testing the fuzzy emoji search functionality:

```file {lang="python"}
import unittest
from parliament import Context

func = __import__("func")

class DummyRequest:
    def __init__(self, descriptions):
        self.descriptions = descriptions

    @property
    def args(self):
        return dict(descriptions=self.descriptions)

class TestFunc(unittest.TestCase):
    # noinspection PyTypeChecker
    def test_func(self):
        result, code = func.main(Context(DummyRequest('flame,confused')))
        expected = """{"flame": "('fire', '🔥')", "confused": "('confused_face', '😕')"}"""
        self.assertEqual(expected, result)
        self.assertEqual(code, 200)

if __name__ == "__main__":
    unittest.main()
```

This can test the invocation of the function in any Python IDE, or by using [`pdb`](https://docs.python.org/3/library/pdb.html) to place breakpoints and step through the code. If your function interacts with external services or the Kubernetes API server, you should to *mock* these dependencies. Mocking, or simulating external services or components that a function interacts with, allows you to isolate a specific function or piece of code to ensure it behaves correctly.

Once the code behaves as expected, you can test the function locally by packaging it in a Docker container and using `func invoke` to run it. This approach is handled completely through Docker, without the need for a local Kubernetes cluster.

After local testing, you may want to optimize the function's image size by removing any redundant dependencies to improve resource utilization.

Finally, deploy your function to a staging environment (a Kubernetes cluster with Knative installed) using `func deploy`. In the staging environment, you can conduct integration, regression, and stress testing.

The resources below can help you get started with migrating AWS Lambda functions to Knative functions on the Linode Kubernetes Engine (LKE).

## Resources

-   [Knative](https://knative.dev/docs/)
-   [Knative Functions](https://knative.dev/docs/functions/)
-   [Knative Functions - Deep Dive (Video)](https://www.youtube.com/watch?v=l0EooTOGW84)
-   [Accessing request traces - Knative](https://knative.dev/docs/serving/accessing-traces/)
-   [Migrating from AWS Lambda to Knative Functions](https://knative.dev/blog/articles/aws_to_func_migration/)
-   [GitHub - boson-project/parliament: A function invocation framework for Python](https://github.com/boson-project/parliament)
-   [Logging and Metrics with Amazon CloudWatch](https://docs.aws.amazon.com/lambda/latest/operatorguide/logging-metrics.html)
-   [Prometheus](https://prometheus.io)
-   [Grafana Labs - Loki, Grafana, Tempo, Mimir](https://grafana.com)
-   [OpenTelemetry](https://opentelemetry.io)

The source code for this demo walkthrough is available here:

-   [AWS Lambda function](https://github.com/the-gigi/fuzz-emoji/tree/main/aws_lambda)
-   [Knative function (Python)](https://github.com/the-gigi/fuzz-emoji/tree/main/knative_functions/python)