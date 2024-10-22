---
slug: migrating-from-azure-functions-to-knative
title: "Migrating From Azure Functions to Knative"
description: "Two to three sentences describing your guide."
og_description: "Optional two to three sentences describing your guide when shared on social media. If omitted, the `description` parameter is used within social links."
authors: ["Linode"]
contributors: ["Linode"]
published: 2024-10-22
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

# Migrating from Azure Functions to Knative

This guide walks through how to migrate an Azure function to a Knative function running on Linode Kubernetes Engine.

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

First, use the Linode CLI (linode) to see what Kubernetes versions are available:

```
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

```
$ linode linodes types
```

This will print information on different Linode plans, including pricing and performance details. This guide uses the **g6-standard-2** Linode, which comes with two CPU cores and 4 GB of memory.

To display the information for this Linode, run the following command:

```
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

```
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
```

```
$ linode lke kubeconfig-view --json "$CLUSTER_ID" | \
    jq -r '.[0].kubeconfig' | \
    base64 --decode > ~/.kube/lke-config
```

Access your cluster using kubectl by specifying the kubeconfig file:

```
$ kubectl get no --kubeconfig ~/.kube/lke-config
```

```output
NAME                            STATUS   ROLES    AGE   VERSION
lke202679-293551-06f33ccf0000   Ready    <none>   8h    v1.30.1
lke202679-293551-0bb2596c0000   Ready    <none>   8h    v1.30.1
lke202679-293551-58ccf2360000   Ready    <none>   8h    v1.30.1
```

**Note**: Optionally, you can avoid needing to include `--kubeconfig ~/.kube/lke-config` with every kubectl command by setting an environment variable for your current terminal window session.

```
$ export KUBECONFIG=~/.kube/lke-config
```

``
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

```
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

```
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

```
$ RELEASE=releases/download/knative-v1.14.0/kourier.yaml \
    kubectl apply -f "https://github.com/knative/net-kourier/$RELEASE"
```

```
$ kubectl patch configmap/config-network \
    --namespace knative-serving \
    --type merge \
    --patch \
      '{"data":{"ingress-class":"kourier.ingress.networking.knative.dev"}}'
```

**Note**: If Istio is already installed in your cluster, you may choose to [reuse it for Knative](https://knative.dev/docs/install/operator/knative-with-operators/#__tabbed_1_2) as well.

### Record the external IP address

With Kourier configured, the Knative serving installation now has a [`LoadBalancer`](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer) service that can be used for external access. Retrieve the external IP address, in case you want to set up your own DNS later:

```
$ kubectl get service kourier -n kourier-system
```

```output
NAME     TYPE          CLUSTER-IP     EXTERNAL-IP     PORT(S)         AGE
kourier  LoadBalancer  10.128.128.65  172.105.12.189  80:30580/TCP,
                                                      443:31780/TCP   2m56s
```

### Verify installation

Since Kourier added a few deployments, look at the updated list to make sure everything is in order.

```
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

Knative provides [multiple ways to configure DNS](https://knative.dev/docs/install/operator/knative-with-operators/#configure-dns). The Magic DNS method from Knative uses the [sslip.io](http://sslip.io) DNS service. When a request is sent to a subdomain of sslip.io that has an IP address embedded, the service returns that IP address. For example, sending a request to [`https://52.0.56.137.sslip.io`](https://52.0.56.137.sslip.io) returns `52.0.56.137` as the IP address.

The `default-domain` job configures Knative Serving to use sslip.io.

```
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

The `func` CLI

The `func` CLI lets developers go through the complete lifecycle of functions—creating, building, deploying, and invoking.

```
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

Create a TypeScript function that can be invoked via an HTTP endpoint (the default invocation method):

```
$ func create -l typescript get-emojis-ts
```

This command creates a complete directory with multiple files.

```
$ ls -laGh get-emojis-ts
```

```output
total 268K
drwxr-xr-x 5 coder 4.0K Aug 6 10:51 .
-rw-r--r-- 1 coder  458 Aug 6 10:51 .eslintrc
drwxrwxr-x 2 coder 4.0K Aug 6 10:51 .func
-rw-r--r-- 1 coder  172 Aug 6 10:51 func.yaml
-rw-r--r-- 1 coder 1.3K Aug 6 10:51 package.json
-rw-r--r-- 1 coder 210K Aug 6 10:51 package-lock.json
-rw-r--r-- 1 coder   90 Aug 6 10:51 .prettierrc
-rw-r--r-- 1 coder 5.1K Aug 6 10:51 README.md
drwxr-xr-x 2 coder 4.0K Aug 6 10:51 src
drwxr-xr-x 2 coder 4.0K Aug 6 10:51 test
-rw-r--r-- 1 coder 1.8K Aug 6 10:51 tsconfig.json
drwxrwxr-x 3 coder 4.0K Aug 6 10:51 ..
-rw-r--r-- 1 coder  217 Aug 6 10:51 .funcignore
-rw-r--r-- 1 coder  235 Aug 6 10:51 .gitignore
```

Covering the purpose of each file is outside the scope of this guide. However, you should examine the code for `src/index.ts`, which is the default implementation that Knative generates.

```file {title="~/get-emojis-ts/src/index.ts"}
import { Context, StructuredReturn } from 'faas-js-runtime';

/**
 * Your HTTP handling function, invoked with each request. This is an example
 * function that logs the incoming request and echoes its input to the caller.
 *
 * It can be invoked with `func invoke`
 * It can be tested with `npm test`
 *
 * It can be invoked with `func invoke`
 * It can be tested with `npm test`
 *
 * @param {Context} context a context object.
 * @param {object} context.body the request body if any
 * @param {object} context.query the query string deserialized as an object, if any
 * @param {object} context.log logging object with methods for 'info', 'warn', 'error', etc.
 * @param {object} context.headers the HTTP request headers
 * @param {string} context.method the HTTP request method
 * @param {string} context.httpVersion the HTTP protocol version
 * See: https://github.com/knative/func/blob/main/docs/guides/nodejs.md#the-context-object
 */
const handle = async (context: Context, body: string): Promise<StructuredReturn> => {
  // YOUR CODE HERE
  context.log.info(`
-----------------------------------------------------------
Headers:
${JSON.stringify(context.headers)}

Query:
${JSON.stringify(context.query)}

Body:
${JSON.stringify(body)}
-----------------------------------------------------------
`);
  return {
    body: body,
    headers: {
      'content-type': 'application/json'
    }
  };
};

export { handle };
```

This function works as a server that returns the `body` and the `content-type` header from the original request.

### Build a function image

The next step is to create a container image from your function. Remember that the function must eventually run on a Kubernetes cluster, and that requires a containerized workload. Knative Functions facilitates this containerization for developers, abstracting the concerns related to Dockerfiles and Docker. Simply run the `func build` command. All you need is access to a container registry.

```
~/get-emojis-ts$ func build --registry docker.io/your_username --push
```

```output
Building function image
Still building
Still building
Yes, still building
Don't give up on me
🙌 Function build: docker.io/your_username/get-emojis-ts:latest
```

This command fetches a base image, builds a Docker image from the function, and pushes it to the Docker registry.

```
$ docker images | rg 'knative|get-emojis-ts|ID'
```

```output
REPOSITORY                     TAG      IMAGE ID       CREATED        SIZE
your_username/get-emojis-ts    <none>   d830349d893e   44 years ago   328MB
```

The `CREATED` timestamp is incorrect, but the image is valid.

### Run the function locally

To run the function locally, use the `func run` command.

```
~/get-emojis-ts$ func run
```

```output
function up-to-date. Force rebuild with --build
Running on host port 8080
```

The function now runs on localhost at port 8080. As previously mentioned, this initial implementation returns the request `body` and `content-type` header.. With your function running, navigate to `http://localhost:8080` in your browser. You should see the following in your terminal window:

```output
{"level":30,"time":1723943851643, "pid":56, "hostname":"1fb77bd278d8", "node_version":" v20.11.0", "msg":"Server listening at http://[::]:8080"}
{"level":30,"time":1723943854298,"pid":56, "hostname":"1fb77bd278d8", "node_version":"v20.11.0", "reqId":"req-1","req":{"method":"GET", "url":"/","hostname":"localhost:8080","remoteAddress":"::ffff:172.17.0.1","remotePort":62400},"msg":"incoming request"}
{"level":30,"time":1723943854346, "pid":56, "hostname":"1fb77bd278d8", "node_version":"v20.11.0", "reqId":"req-1","res":{"statusCode": 200}, "responseTime":44.39570891857147, "msg":"request completed"}
```

### Deploy the function

Deploy the function to your Kubernetes cluster as a Knative function.

```
~/get-emojis-ts$ func deploy
```

```output
…
Pushing function image to the registry "index.docker.io" using the "your_username" user credentials
⬆️ Deploying function to the cluster
🎯 Creating Triggers on the cluster
✅ Function deployed in namespace "default" and exposed at URL:
   http://get-emojis-ts.default.172.105.12.189.sslip.io
```

Once the function has been deployed, and the Magic DNS record has been established. The function is ready to be invoked.

### Invoke the function via an HTTP endpoint

In a browser, visit your function’s URL. An example invocation may look like this:

[SCREENSHOT[]

Your Knative function is accessible through a public HTTP endpoint. Now, it is time to migrate an Azure Function to Knative.

## Step 4: Migrate your Azure Function to Knative

This guide will examine a sample Azure function and walk you through how to migrate it to Knative. Azure functions are similar to Knative functions in that they have a trigger and a way to extract their input arguments from a context, event, or HTTP request.

In the handler below, the actual application logic of the Azure function has been highlighted (in red). The function instantiates a `FuzzEmoji` object and calls its `getEmojis()` method, passing a list of emoji descriptions. The emoji descriptions may or may not map to official emoji names like "fire" (🔥) or "sunrise" (🌅). The function performs a fuzzy search of the descriptions and finds matching emojis.

```
import { 
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext
} from "@azure/functions";
import { FuzzEmoji } from './fuzz-emoji';

export async function fuzzEmoji(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    const descriptionsParam = request.query.get('descriptions');
    const descriptions = descriptionsParam.split(',');

    const fuzzer = new FuzzEmoji();
    const result = await fuzzer.getEmojis(descriptions);

    const body = Object.entries(result)
        .map(([k, v]) => `${k}: (${v})`)
        .join('\n');
    return { body };
};


app.http('fuzzEmoji', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: fuzzEmoji
});
```

The rest of the code focuses on extracting emoji descriptions from the query parameters in the request and returning the result, which becomes the body of the response object.

At the time of this writing, this Azure function was deployed and available at the following HTTP endpoint:

```
https://fuzz-emoji.azurewebsites.net/api/fuzzemoji
```

Invoking the function yielded the following result:

```
$ curl https://fuzz-emoji.azurewebsites.net/api/fuzzemoji?descriptions=spectacles,flame
```

```output
spectacles: (glasses,👓)
flame: (fire,🔥)
```

The function correctly returns the "fire" (🔥) emoji for the description "flame" and the "glasses" emoji (👓) for the description "spectacles." This makes it easier to find emojis for users who can't remember the official emoji names.

### Isolating the Azure function code from Azure specifics

The next step is to make sure the core application logic is separate from the Azure specifics. In this case, the work for this is already done, since the interface for the `getEmojis()` method simply takes a TypeScript array of strings as descriptions.

If `getEmojis()` needed to access Azure Blob Storage for the `FuzzEmoji` object implementation with the code for fetching synonyms, this wouldn't work for a Knative function out of the box. This would require some refactoring.

### Migrating a single-file function to a Knative function

The core logic for the function has been isolated as a single TypeScript module, in a file called `fuzz-emoji.ts`. This can be migrated to your Knative function. The code looks like this:

```file
import emojilib from 'emojilib';
import axios from 'axios';

export class FuzzEmoji {
  private emojiDict: { [key: string]: string } = {};

  constructor() {
    // Check if emojilib is undefined
    if (!emojilib) {
      throw new Error('emojilib is not defined or imported correctly');
    }

    // Use emojilib to build the emoji dictionary
    for (const [emojiChar, keywords] of Object.entries(emojilib)) {
      if (keywords.length > 0) {
        // Use only the first keyword
        const firstKeyword = keywords[0];
        this.emojiDict[firstKeyword.toLowerCase()] = emojiChar;
      }
    }
  }

  private static async getSynonyms(word: string): Promise<string[]> {
    try {
      const response = await axios.get(`https://api.datamuse.com/words?rel_syn=${word}`);
      if (response.status === 200) {
        return response.data.map((wordData: { word: string }) => wordData.word);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data || 'Error fetching synonyms');
      }
      throw new Error('Error fetching synonyms');
    }
    return [];
  }

  public async getEmoji(description: string): Promise<[string, string]> {
    description = description.toLowerCase();

    // Direct match
    if (description in this.emojiDict) {
      return [description, this.emojiDict[description]];
    }

    // Subset match
    for (const name in this.emojiDict) {
      if (name.includes(description)) {
        return [name, this.emojiDict[name]];
      }
    }

    const synonyms = await FuzzEmoji.getSynonyms(description);
    // Synonym match
    for (const syn of synonyms) {
      if (syn in this.emojiDict) {
        return [syn, this.emojiDict[syn]];
      }
    }
    return ['', ''];
  }
}
```

Copy this module as `fuzz-emoji.ts` and put it in the `src` subfolder of the Knative function folder. The folder structure should now look like this:

```
$ tree get-emojis-ts -L 2 -I 'build|node_modules|test'
```

```output
get-emojis-ts
├── func.yaml
├── package.json
├── package-lock.json
├── README.md
├── src
│   ├── fuzz-emoji.ts
│   └── index.ts
└── tsconfig.json

1 directory, 7 files
```

Next, change the implementation of your Knative function in `index.ts` to use the `fuzz-emoji` module:

```file {title="index.ts"}
import { Context, StructuredReturn } from 'faas-js-runtime';
import { FuzzEmoji } from './fuzz-emoji';

/**
 * Your HTTP handling function, invoked with each request. This is an example
 * function that logs the incoming request and echoes its input to the caller.
 *
 * It can be invoked with `func invoke`
 * It can be tested with `npm test`
 *
 * It can be invoked with `func invoke`
 * It can be tested with `npm test`
 *
 * @param {Context} context a context object.
 * @param {object} context.body the request body if any
 * @param {object} context.query the query string deserialized as an object, if any
 * @param {object} context.log logging object with methods for 'info', 'warn', 'error', etc.
 * @param {object} context.headers the HTTP request headers
 * @param {string} context.method the HTTP request method
 * @param {string} context.httpVersion the HTTP protocol version
 * See: https://github.com/knative/func/blob/main/docs/guides/nodejs.md#the-context-object
 */
const handle = async (context: Context, _: string): Promise<StructuredReturn> => {
  _;
  const descriptions = context.query?.['descriptions']?.split(',') || [];
  const fuzzer = new FuzzEmoji();
  const result = await fuzzer.getEmojis(descriptions);

  return {
    body: JSON.stringify(result),
    headers: {
      'content-type': 'application/json'
    }
  };
};

export { handle };
```

Here is a breakdown of what is happening in this code:

1.  Import modules related to the function as a service machinery.
1.  Import the `FuzzEmoji` class with the core logic from the `fuzz-emoji` module.
1.  The `handle()` function takes a `Context` and the body of the request (unused and marked as `_` here) and returns a promise of a `StructuredReturn`.
1.  The `context` argument contains query parameters with the descriptions.
1.  Extract the emoji descriptions from the query parameters. Note that the function expects the descriptions to be a single comma-separated string, which it splits to get a list called `descriptions`.
1.  Instantiate a new `FuzzEmoji` object.
1.  Call the `getEmojis()` method, passing the list of `descriptions` that were extracted
1.  Convert the result to JSON and return it with the proper `content-type` header.

Repeat the workflow you used earlier for building and deploying the Knative function. Before starting, you’ll need to add the dependencies used in `fuzz-emoji.ts` (`emojilib` and `axios`) to your project. To do this, run the following command:

```
 npm install --save emojilib axios
```

The `package.json` file the project should look like this:

```file {title="package.json"}
{
  "name": "event-handler",
  "version": "0.1.0",
  "description": "TypeScript HTTP Handler",
  "license": "Apache-2.0",
  "repository": {
    "type": "git",
    "url": ""
  },
  "scripts": {
    "build": "npx -p typescript tsc",
    "pretest": "npm run lint && npm run build",
    "test:unit": "ts-node node_modules/tape/bin/tape test/unit.ts",
    "test:integration": "ts-node node_modules/tape/bin/tape test/integration.ts",
    "test": "npm run test:unit && npm run test:integration",
    "start": "FUNC_LOG_LEVEL=info faas-js-runtime ./build/index.js",
    "lint": "eslint \"src/**/*.{js,ts,tsx}\" \"test/**/*.{js,ts,tsx}\" --quiet",
    "debug": "nodemon --inspect ./node_modules/faas-js-runtime/bin/cli.js ./build/index.js"
  },
  "devDependencies": {
    "@types/tape": "^5.6.4",
    "@typescript-eslint/eslint-plugin": "^7.14.1",
    "@typescript-eslint/parser": "^7.14.1",
    "eslint": "^8.56.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.1.3",
    "nodemon": "^3.1.4",
    "prettier": "^3.3.2",
    "supertest": "^7.0.0",
    "tape": "^5.8.1",
    "ts-node": "^10.9.2",
    "tsd": "^0.31.1",
    "tslint-config-prettier": "^1.18.0",
    "typescript": "^5.5.2"
  },
  "dependencies": {
    "@types/node": "^20.14.9",
    "axios": "^1.7.4",
    "emojilib": "^3.0.12",
    "faas-js-runtime": "^2.4.0"
  }
}
```

Build and deploy the container.

```
~/get-emojis-ts$ func build --registry docker.io/your_username
~/get-emojis-ts$ func deploy
```

Lastly, test your function using the public URL.

[SCREENSHOT]

The `descriptions` provided as a query parameter are echoed back, along with a corresponding emoji name and emoji for each description. The Knative function works as expected.

### Migrating a multi-file function to a Knative function

In the above case, the entire application logic was contained in a single file called `fuzz-emoji.ts`. For larger workloads, you might have an implementation with multiple files or even multiple directories and packages.

Migrating to Knative in this case is actually not much more complicated. You would take the following steps:

1.  Copy all the files and directories into the `src` subfolder of your Knative function folder.
1.  Import any packages you need in `index.ts`.
1.  Update the `package.json` file accordingly.

### Migrating external dependencies

Your Azure function might depend on various Azure services—such as Azure Blob Storage, Azure SQL DB, Azure Cosmos DB, Azure Service Bus, or others. You need to understand the use case for each dependency so that you can decide which option best suits your situation.

There are typically three options:

1.  **Keep it as it is**: The Knative function will also interact with the Azure services.
1.  **Replace the service**: For example, you might switch from an Azure service like Azure Cosmos DB to an alternative key-value store in the Kubernetes cluster.
1.  **Drop the functionality**: For example, don’t write messages to Azure Service Bus anymore.

### Namespace and service account

The Knative function eventually runs as a pod in the Kubernetes cluster. This means it runs in a namespace and has a Kubernetes service account associated with it. These are determined when you run `func deploy`. You can specify `-n` (or `--namespace`) and `--service-account` arguments.

If you don't specify these, then the function will be deployed in the currently configured namespace for the cluster and will use the default service account of the namespace.

If your Knative function needs to access any Kubernetes resources, it’s recommended that you explicitly specify a dedicated namespace and create a dedicated service account. This is the  preferred approach, rather than granting permissions to the default service account of the namespace.

### Configuration and secrets

Your Azure function may use [Azure App Configuration](https://azure.microsoft.com/en-us/products/app-configuration) and the [Azure Key Vault](https://azure.microsoft.com/en-us/products/key-vault) for configuration and sensitive information, neither of which should be embedded in the function's image. For example, if your function needs to access some Azure services, it would require Azure credentials to authenticate.

Kubernetes offers the [`ConfigMap`](https://kubernetes.io/docs/concepts/configuration/configmap/) and [`Secret`](https://kubernetes.io/docs/concepts/configuration/secret/) resources for this purpose. The migration process involves the following steps:

1.  Identify all the parameters and secrets the Azure function uses.
1.  Create corresponding `ConfigMap` and `Secret` resources in the namespace for your Knative function.
1.  Grant the service account for your Knative function permissions to read the `ConfigMap` and `Secret`.

### Roles and permissions

As part of the migration, your Knative function may need to interact with various Kubernetes resources and services—such as data stores, `ConfigMaps`, and `Secrets`. Create a dedicated role with the necessary permissions, binding that role to the function's service account.

If your architecture is based on multiple Knative functions, it often makes sense to share the same service account, role, and role bindings between all the Knative functions.

### Logging, metrics, and distributed tracing

The logging experience in Knative is similar to printing something in your Azure function. With Azure, output is automatically logged to Azure Monitor. That same print statement in a Knative function automatically sends log messages to your container's logs. If you have centralized logging, these messages are automatically recorded in your log system.

LKE provides the native Kubernetes dashboard by default. It runs on the control plane, so it doesn't take resources from your workloads. You can use the dashboard to explore your entire cluster:

[SCREENSHOT]

For production systems, consider using a centralized logging system like ELK/EFK, Loki, or Graylog. Also, use an observability solution like Prometheus and Grafana. Consider leveraging OpenTelemetry, too.

Knative has built-in support for distributed tracing, and it can be configured globally. Your Knative function will automatically participate.

### The debugging experience

Knative offers a debugging experience at multiple levels:

-   Unit test your core logic
-   Unit test your Knative function
-   Invoke your function locally

When you create a TypeScript Knative function, Knative also generates a skeleton for a unit test (`unit.ts`) and integration test (`integration.ts`) in the `test` subfolder.

Below is a modified integration test, updated for testing the fuzzy emoji search:

```file {title="integration.ts"}
'use strict';
import { start, InvokerOptions } from 'faas-js-runtime';
import request from 'supertest';

import * as func from '../build';
import test, { Test } from 'tape';

const errHandler = (t: Test) => (err: Error) => {
  t.error(err);
  t.end();
};

test('Integration: handles a valid request with query parameter', (t) => {
  const expected = '{"flame":"fire,🔥","hound":"dog,🐕"}';
  start(func.handle, {} as InvokerOptions).then((server) => {
    t.plan(3);
    request(server)
      .post('/')
      .query({ descriptions: 'flame,hound' }) // Add the query parameter here
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, result) => {
        t.error(err, 'No error');
        t.ok(result);
        t.equal(expected, JSON.stringify(result.body));
        t.end();
        server.close();
      });
  }, errHandler(t));
});
```

With this integration test and the unit test, you can test the invocation of the function using your preferred toolchain, making for a standard frontend development experience. If your function interacts with external services or the Kubernetes API server, you will need to mock these dependencies.

When you're satisfied with the code, you can test locally by packaging the function in a Docker container and running it with `func invoke`. This is done fully through Docker, without need for a local Kubernetes cluster.

At this point, you may want to fine-tune the size of the function image by removing any redundant dependencies.

Finally, you can deploy your function to a full-fledged staging environment (Kubernetes cluster with Knative installed) using `func deploy`. In the staging environment you can conduct integration, regression, and stress tests.

The resources below are provided to help you become familiar with migrating Azure Function to Knative functions on Linode Kubernetes Engine.

## Resources

-   [Knative](https://knative.dev/docs/)
-   [Knative Functions](https://knative.dev/docs/functions/)
-   [Knative Functions - Deep Dive (Video)](https://www.youtube.com/watch?v=l0EooTOGW84)
-   [Accessing request traces - Knative](https://knative.dev/docs/serving/accessing-traces/)
-   [Azure Functions documentation | Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-functions/)
-   [Prometheus](https://prometheus.io)
-   [Grafana Labs - Loki, Grafana, Tempo, Mimir](https://grafana.com)
-   [OpenTelemetry](https://opentelemetry.io)

The source code for this demo walkthrough is available here:

-   [Azure Function](https://github.com/the-gigi/fuzz-emoji/tree/main/azure_function/fuzz_emoji)
-   [Knative function (TypeScript)](https://github.com/the-gigi/fuzz-emoji/tree/main/knative_functions/typescript)