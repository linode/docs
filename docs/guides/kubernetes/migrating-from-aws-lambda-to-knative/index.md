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

This guide walks through how to migrate an AWS Lambda function to a Knative function running on Linode Kubernetes Engine.

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

There are many ways to provision resources on Linode, but this guide will use the [Linode CLI](https://github.com/linode/linode-cli).

-   [Linode Cloud Manager](https://cloud.linode.com/)
-   The [Linode CLI](https://github.com/linode/linode-cli)
-   The [Linode API](https://techdocs.akamai.com/linode-api/reference/api)
-   [Terraform](https://registry.terraform.io/providers/linode/linode/latest/docs)
-   [Pulumi](https://www.pulumi.com/registry/packages/linode/)

### Check Kubernetes versions

First, use the Linode CLI (`linode`) to see what Kubernetes versions are available:

$ linode lke versions-list
┌───────┐
│ id      │
├───────┤
│ 1.30    │
├───────┤
│ 1.29    │
└───────┘

In general, you should provision the latest version, unless there are some special circumstances.

### Check available node types

Next, check what Linode plans are available. View Linode’s pricing information [here](https://www.linode.com/cloud-computing-calculator/?promo=sitelin100-02162023&promo_value=100&promo_length=60&utm_source=google&utm_medium=cpc&utm_campaign=11178784975_112607711747&utm_term=g_kwd-46671155961_e_linode%20pricing&utm_content=467094105814&locationid=9073501&device=c_c&gad_source=1&gclid=Cj0KCQjw9Km3BhDjARIsAGUb4nzNzPsxMOeTdk2wyBd77ysa3K1UTZKH8STVYjuWeg1VeEjoubqv6GIaAl59EALw_wcB).

$ linode linodes types

This will print information on different Linode plans, including pricing and performance details. This guide uses the **g6-standard-2** Linode, which comes with two CPU cores and 4 GB of memory.

To display the information for this Linode, run the following command:

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

### Create the Kubernetes cluster

After selecting a Kubernetes version and a Linode type for your cluster, create a cluster in the `ca-central` region with three nodes and auto-scaling enabled.

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

After your cluster is successfully created, you will see the following:

Using default values: {}; use the --no-defaults flag to disable defaults
┌─────────┬────────────────────┬────────────┬─────────────┬─────────────────────────────────┐
│ id      │  label             │ region     │ k8s_version │ control_plane.high_availability │
├─────────┼────────────────────┼────────────│─────────────┼─────────────────────────────────┤
│ 202679  │ knative-playground │ ca-central │ 1.30        │ False                           │
└─────────┴────────────────────┴────────────┴─────────────┴─────────────────────────────────┘

### Access the Kubernetes cluster

Next, fetch your cluster credentials to access it in the form of a kubeconfig file. The following commands will fetch a kubeconfig file for the cluster and save it in `~/.kube/lke-config`.

$ CLUSTER_ID=$(linode lke clusters-list --json | \
    jq -r \
      '.[] | select(.label == "knative-playground") | .id')

$ linode lke kubeconfig-view --json "$CLUSTER_ID" | \
    jq -r '.[0].kubeconfig' | \
    base64 --decode > ~/.kube/lke-config

Access your cluster using kubectl by specifying the kubeconfig file:

$ kubectl get no --kubeconfig ~/.kube/lke-config

NAME                            STATUS   ROLES    AGE   VERSION
lke202679-293551-06f33ccf0000   Ready    <none>   8h    v1.30.1
lke202679-293551-0bb2596c0000   Ready    <none>   8h    v1.30.1
lke202679-293551-58ccf2360000   Ready    <none>   8h    v1.30.1

**Note**: Optionally, you can avoid needing to include `--kubeconfig ~/.kube/lke-config` with every kubectl command by setting an environment variable for your current terminal window session.

$ export KUBECONFIG=~/.kube/lke-config

$ kubectl get no

NAME                            STATUS   ROLES    AGE   VERSION
lke202679-293551-06f33ccf0000   Ready    <none>   8h    v1.30.1
lke202679-293551-0bb2596c0000   Ready    <none>   8h    v1.30.1
lke202679-293551-58ccf2360000   Ready    <none>   8h    v1.30.1

** Step 2: Set Up Knative on LKE

There are multiple ways to [install Knative on a Kubernetes cluster](https://knative.dev/docs/install/). This walkthrough will use the YAML manifests method.

### Install the Knative CRDs

Run the following command to install the Knative CRDs:

$ RELEASE=releases/download/knative-v1.14.1/serving-crds.yaml \
    kubectl apply -f "https://github.com/knative/serving/$RELEASE"

cus...k8s.io/certificates.networking.internal.knative.dev configured
cus...k8s.io/configurations.serving.knative.dev configured
cus...k8s.io/clusterdomainclaims.networking.internal.knative.dev configured
cus...k8s.io/domainmappings.serving.knative.dev configured cus...k8s.io/ingresses.networking.internal.knative.dev configured cus...k8s.io/metrics.autoscaling.internal.knative.dev configured cus...k8s.io/podautoscalers.autoscaling.internal.knative.dev configured
cus...k8s.io/revisions.serving.knative.dev configured cus...k8s.io/routes.serving.knative.dev configured
cus...k8s.io/serverlessservices.networking.internal.knative.dev configured
cus...k8s.io/services.serving.knative.dev configured cus...k8s.io/images.caching.internal.knative.dev configured

### Install Knative Serving

Next, install the Knative **Serving** component.

$ RELEASE=releases/download/knative-v1.14.1/serving-core.yaml \
    kubectl apply -f "https://github.com/knative/serving/$RELEASE"

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

### Install the networking layer

Knative relies on an underlying networking layer. There are [several options for Knative networking](https://knative.dev/docs/install/operator/knative-with-operators/#install-the-networking-layer). [Kourier](https://github.com/knative-extensions/net-kourier) was designed specifically for Knative. The following commands will install Kourier and configure Knative to use Kourier as the networking layer:

$ RELEASE=releases/download/knative-v1.14.0/kourier.yaml \
    kubectl apply -f "https://github.com/knative/net-kourier/$RELEASE"

$ kubectl patch configmap/config-network \
    --namespace knative-serving \
    --type merge \
    --patch \
      '{"data":{"ingress-class":"kourier.ingress.networking.knative.dev"}}'

**Note**: If Istio is already installed in your cluster, you may choose to [reuse it for Knative](https://knative.dev/docs/install/operator/knative-with-operators/#__tabbed_1_2) as well.

### Record the external IP address

With Kourier configured, the Knative serving installation now has a [`LoadBalancer`](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer) service that can be used for external access. Retrieve the external IP address in case you want to set up your own DNS later:

$ kubectl get service kourier -n kourier-system

NAME     TYPE          CLUSTER-IP     EXTERNAL-IP     PORT(S)         AGE
kourier  LoadBalancer  10.128.128.65  172.105.12.189  80:30580/TCP,
                                                      443:31780/TCP   2m56s
### Verify installation

Since Kourier added a few deployments, look at the updated list to make sure everything is in order.

$ kubectl get deploy -n knative-serving

NAME                    READY   UP-TO-DATE     AVAILABLE       AGE
activator               1/1     1              1               5m21s
autoscaler              1/1     1              1               5m20s
controller              1/1     1              1               5m19s
net-kourier-controller  1/1     1              1               4m50s
Webhook                 1/1     1              1               5m18s

### Configure DNS

Knative provides [multiple ways to configure DNS](https://knative.dev/docs/install/operator/knative-with-operators/#configure-dns). The Magic DNS method from Knative uses the [sslip.io](http://sslip.io) DNS service. When a request is sent to a subdomain of sslip.io that has an IP address embedded, the service returns that IP address. For example, sending a request to [https://52.0.56.137.sslip.io](https://52.0.56.137.sslip.io) returns `52.0.56.137` as the IP address.

The `default-domain` job configures Knative Serving to use sslip.io.

$ MANIFEST=knative-v1.14.1/serving-default-domain.yaml \
    kubectl apply -f \
      "https://github.com/knative/serving/releases/download/$MANIFEST"

job.batch/default-domain created
service/default-domain-service created

With Knative now operational in your cluster, you can begin working with Knative Functions.

## Step 3: Work with Knative Functions and the `func` CLI

Knative Functions is a programming model that simplifies the writing of distributed applications that run on Kubernetes and Knative, without requiring in-depth knowledge of containers, Kubernetes, or Knative itself. Developers can create stateless, event-driven functions that run as Knative services and run their functions locally during development and testing without needing a local Kubernetes cluster.

The [`func`](https://github.com/knative/func) CLI streamlines the developer experience for working with Knative Functions.

### The `func` CLI

The `func` CLI lets developers go through the complete lifecycle of functions—creating, building, deploying, and invoking.

$ func

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

### Create a function

Create a Python function that can be invoked via an HTTP endpoint (the default invocation method):

$ func create -l python get-emojis

This command creates a complete directory with multiple files.

$ ls -laGh get-emojis
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

Covering the purpose of each file is outside the scope of this guide. However, you should examine the code for `func.py`, which is the default implementation that Knative generates.

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

This function works as a server that returns the query params or form fields of the request sent to it.

### Build a function image

The next step is to create a container image from your function. Remember that the function must eventually run on a Kubernetes cluster, and that requires a containerized workload. Knative Functions facilitates this containerization for developers, abstracting the concerns related to Dockerfiles and Docker. run the `func build` command. All you need is access to a container registry.

~/get-emojis$ func build --registry docker.io/your_username --push

Building function image
Still building
Still building
Yes, still building
Don't give up on me
🙌 Function build: docker.io/your_username/get-emojis:latest
Pushing function image to the registry "index.docker.io" using the "your_username" user credentials

This command fetches a base image, builds a Docker image from the function, and pushes it to the Docker registry.

$ docker images | rg 'knative|get-emojis|ID'

REPOSITORY                     TAG      IMAGE ID       CREATED        SIZE
ghcr.io/…/builder-jammy-base  latest   58e634e9a771   44 years ago   1.6GB
your_username/get-emojis       latest   a5c58cce8219   44 years ago   293MB

The `CREATED` timestamp is incorrect, but the image is valid.

### Run the function locally

To run the function locally, use the `func run` command.

~/get-emojis$ func run

function up-to-date. Force rebuild with --build
Running on host port 8080

The function now runs on localhost at port 8080. As previously mentioned, this initial implementation returns the URL query parameters as a JSON object. With your function running, navigate to `http://localhost:8080?a=1&b=2` in your browser. You should see the following in your terminal window:

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

### Deploy the function

Deploy the function to your Kubernetes cluster as a Knative function: 

~/get-emojis$ func deploy

…
Pushing function image to the registry "index.docker.io" using the "your_username" user credentials
⬆️ Deploying function to the cluster
🎯 Creating Triggers on the cluster
✅ Function deployed in namespace "default" and exposed at URL:
   http://get-emojis.default.172.105.12.189.sslip.io

Once the function has been deployed and the Magic DNS record has been established, the function is ready to be invoked.

### Invoke the function via an HTTP endpoint

In a web browser, visit your function’s URL, adding query parameters. An example invocation may look like this:

[SCREENSHOT}

Your Knative function is accessible through a public HTTP endpoint. Now, it is time to migrate an AWS Lambda function to Knative.

## Step 4: Migrate your AWS Lambda Function to Knative

This guide will examine a sample Lambda function and walk you through how to migrate it to Knative. Conceptually, Lambda functions are similar to Knative functions. They have a trigger and a way to extract their input arguments from a context or event. 

In the handler below, the actual application logic of the Lambda function has been highlighted (in red). The function instantiates a `FuzzEmoji` object and calls its `get_emojis()` method, passing a list of emoji descriptions. The emoji descriptions may or may not map to official emoji names like "fire" (🔥) or "confused_face" (😕). The function performs a fuzzy search of the descriptions and finds matching emojis.

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

Before the highlighted lines, there is code that extracts emoji descriptions from the `event` object passed to the handler. The code below the highlighted lines focuses on packaging the result with a proper status code for success or failure.

At the time of this writing, this Lambda function was deployed and available at the following HTTP endpoint:

https://64856ijzmi.execute-api.us-west-2.amazonaws.com/default/fuzz-emoji

Invoking the function yields the following result:

$ curl -s -X POST --header "Content-type:application/json" \
    --data '{"descriptions":["flame","confused"]}' \
    https://64856ijzmi.execute-api.us-west-2.amazonaws.com/default/fuzz-emoji | \
    json_pp

{
   "confused" : "('confused_face', '😕')",
   "flame" : "('fire', '🔥')"
}

The function correctly returns the "fire" (🔥) emoji for the description "flame" and the "confused_face" emoji (😕) for the description "confused.”

### Isolating the AWS Lambda code from AWS specifics

The next step is to make sure the core application logic is separate from the AWS specifics. In this case, the work for this is already done, since the interface for the `get_emojis()` method only takes a list of strings as descriptions.

If the `get_emojis()` method took the AWS Lambda `event` object as input and extracted the descriptions, itwouldn't work for a Knative function since it doesn't provide an `event` object. This would require some refactoring.

### Migrating a single-file function to a Knative function

The core logic for the function has been isolated into a single Python module named `fuzz_emoji.py`. This can be migrated to your Knative function. The code looks like this:

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

Copy the module into the same directory that Knative `func` created for your function. The folder structure should now look like this:

$ ls -laGh get-emojis/
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

Next, change the implementation of your Knative function so that it calls the `fuzz_emoji` module:

import json

from parliament import Context
from fuzz_emoji import FuzzEmoji

def main(context: Context):
    descriptions = context.request.args.get('descriptions').split(',')
    fuzz_emoji = FuzzEmoji()
    result = fuzz_emoji.get_emojis(descriptions)
    return json.dumps(result, ensure_ascii=False), 200

Here is a breakdown of what is happening in this code:

1.  Import the built-in `json`, the `Context` from [parliament](https://github.com/boson-project/parliament) (which is the function invocation framework that Knative uses for Python functions), and the `FuzzEmoji` class.

1.  The `main()` function takes the parliament `Context` as its only parameter. The context contains a Flask `request` property.

1.  The first line extracts the emoji descriptions from the Flask `request` arguments. It expects the descriptions to be a single comma-separated string, which it splits to get a list of `descriptions`.

1.  Instantiate a `FuzzEmoji` object and call its `get_emojis()` method.

1.  Use the `json` module to serialize the response and return it with a `200` status code.

Repeat the workflow you used earlier for building and deploying the Knative function. Before starting, it's important to add the requirements of `fuzz_emoji.py` (the `requests` and `emoji` packages) to the `requirements.txt` file of your Knative function since these dependencies are added to the Docker image of the function.

parliament-functions==0.1.0
emoji==2.12.1
requests==2.32.3

Build and deploy the container:

~/get-emojis$ func build --registry docker.io/your_username
~/get-emojis$ func deploy

Finally, test your function using the public URL:

[SCREENSHOT]

The `descriptions` provided as a query parameter are echoed back, along with a corresponding emoji name and emoji for each description. The Knative function works as expected.

### Migrating a multi-file function to a Knative function

In the above case, the entire application logic was contained in a single file called `fuzz_emoji.py`. For larger workloads, you might have an implementation with multiple files or even multiple directories and packages.

Migrating to Knative follows a similar process. You would take the following steps:

1.  Copy all the files and directories into the same `get-emojis` directory.

1.  Import any module you need in `func.py`.

1.  Update the `requirements.txt` file with all the dependencies imported in any module.

### Migrating external dependencies

When migrating an AWS Lambda function, it’s possible that the function depends on various AWS services—like S3, DynamoDB, SQS, or others. You need to understand the use case for each dependency so that you can decide which option best suits your situation.

There are typically three options:

1.  **Keep it as it is**: The Knative function will also interact with the AWS service.

1.  **Replace the service**: For example, you might switch from an AWS service like DynamoDB to an alternative key-value store in the Kubernetes cluster.

1.  **Drop the functionality**: For example, don’t write messages to AWS SQS anymore.

### Namespace and service account

The Knative function eventually runs as a pod in the Kubernetes cluster. This means it runs in a namespace and has a Kubernetes service account associated with it. These are determined when you run `func deploy`. You can specify `-n` (or `--namespace`) and `--service-account` arguments.

If you don't specify these, then the function will be deployed in the currently configured namespace for the cluster and will use the default service account of the namespace.

If your Knative function needs to access any Kubernetes resources, it’s recommended that you explicitly specify a dedicated namespace and create a dedicated service account. This is the  preferred approach, rather than granting permissions to the default service account of the namespace.

### Configuration and secrets

Your AWS Lambda function may have used the `ParameterStore` and `SecretsManager` for configuration and sensitive information, neither of which should be embedded in the function's image. For example, if your function needs to access some AWS services, it would require AWS credentials to authenticate.

Kubernetes offers the [`ConfigMap`](https://kubernetes.io/docs/concepts/configuration/configmap/) and [`Secret`](https://kubernetes.io/docs/concepts/configuration/secret/) resources for this purpose. The migration process involves the following steps:

1.  Identify all the parameters and secrets the Lambda function uses.

1.  Create corresponding `ConfigMap` and `Secret` resources in the namespace for your Knative function.

1.  Grant the service account for your Knative function permissions to read the `ConfigMap` and `Secret`.

### Roles and permissions

As part of the migration, your Knative function may need to interact with various Kubernetes resources and services—such as data stores, `ConfigMaps`, and `Secrets`. Create a dedicated role with the necessary permissions, binding that role to the function's service account.

If your architecture is based on multiple Knative functions, it is considered best practice to share the same service account, role, and role bindings between all the Knative functions.

### Logging, metrics, and distributed tracing

The logging experience in Knative is similar to printing something in your AWS Lambda function. In AWS Lambda, output is automatically logged to CloudWatch. That same print statement in a Knative function automatically sends log messages to your container's logs. If you have centralized logging, these messages are automatically recorded in your log system.

LKE provides the native Kubernetes dashboard by default. It runs on the control plane, so it doesn't take resources from your workloads. You can use the dashboard to explore your entire cluster:

[SCREENSHOT]

For production systems, consider using a centralized logging system like ELK/EFK, Loki, or Graylog. Also, use an observability solution like Prometheus and Grafana. Consider leveraging OpenTelemetry, too. These are good practices for production systems because they enhance the ability to monitor, troubleshoot, and optimize application performance while ensuring reliability and scalability.

Knative has built-in support for distributed tracing, and it can be configured globally. Your Knative function will automatically participate.

### The debugging experience

Knative offers a debugging experience at multiple levels:

-   Unit test your core logic
-   Unit test your Knative function
-   Invoke your function locally

When you create a Python Knative function, Knative also generates a skeleton for a unit test, called `test_func.py`. At the time of this writing, the generated test is invalid and requires some changes. See this [GitHub issue](https://github.com/knative/func/issues/2448) for details.

Below is the modified test, updated for testing the fuzzy emoji search:

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

With this unit test, you can test the invocation of the function in any Python IDE or by using [pdb](https://docs.python.org/3/library/pdb.html) to place breakpoints and step through the code. If your function interacts with external services or the Kubernetes API server, you will need to mock these dependencies. Simulating external services or components that a function interacts with during testing (or mocking dependencies) allows you to isolate the specific function or piece of code you are testing to ensure that its behavior is correct.

When you're satisfied with the code, you can test locally by packaging the function in a Docker container and running it with `func invoke`. This is done fully through Docker, without need for a local Kubernetes cluster.

At this point, you may want to fine-tune the size of the function image by removing any redundant dependencies. This helps to optimize resource utilization.

Finally, you can deploy your function to a full-fledged staging environment (Kubernetes cluster with Knative installed) using `func deploy`. In the staging environment you can conduct integration, regression, and stress tests.

The resources below are provided to help you become familiar with migrating AWS Lambda functions to Knative functions on Linode Kubernetes Engine.

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