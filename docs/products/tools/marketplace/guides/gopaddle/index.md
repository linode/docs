---
author:
  name: Linode
  email: docs@linode.com
description: "Learn how to deploy gopaddle, a simple low-code platform for Kubernetes developers and operators, on the Linode platform."
keywords: ['gopaddle','kubernetes','container','low code']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 
modified: 
modified_by:
  name: Linode
title: "Deploy gopaddle through the Linode Marketplace"
contributor:
  name: Linode
external_resources:
- '[GoPaddle](https://gopaddle.io/)'
aliases: ['/guides/deploying-gopaddle-marketplace-app/','/guides/gopaddle-marketplace-app/']
---

[gopaddle](https://gopaddle.io/) is a low-code Internal Developer Plaform (IDP) for Kubernetes developers and operators. It provides a self-service portal through which developers can scaffold code to containers, auto-generate YAML files, build Docker images, deploy applications on to Kubernetes and manage the application life cycle centrally. 

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{<note>}}
**Estimated deployment time:** gopaddle should be fully installed within 10-15 minutes after the Compute Instance has finished provisioning.
{{</note>}}

## Configuration Options

- **Supported distributions:** Ubuntu 18.04 LTS
- **Recommended plan:** A minimum plan size of 8GB Shared CPU Linode is recommended for GoPaddle. 

### Validating the installation
The gopaddle installation can be validated by watching the Stackscript logs at /root/stackscript.log file. 

```sh
root@localhost:~# tail -f /root/stackscript.log 
pod/webhook-7c49ddfb78-ssvcz condition met
pod/mongodb-0 condition met
pod/esearch-0 condition met
pod/deploymentmanager-65897c7b9c-qlgk8 condition met
pod/appworker-8546598fd-7svzv condition met
pod/influxdb-0 condition met
pod/costmanager-6496dfd6c4-npqj8 condition met
pod/rabbitmq-0 condition met
pod/gpcore-85c7c6f65b-5vfmh condition met
gopaddle-lite installation is complete ! You can now access the gopaddle dashboard @ http://172.105.110.192:30003/
```

One the installation is complete, the final line in the log will provide the gopaddle dashboard URL. For instance, in the above example, gopaddle dashboard can be accessed at `http://172.105.110.192:30003/`


## Getting started with gopaddle

Once the gopaddle lite dashboard is available, developers can open the gopaddle dashboard in the browser, review the evaluation agreement and subscribe to the lite edition.

![Screenshot of gopaddle evaluation agreement](gopaddle-evaluation.png) 

### Containerize and Deploy

Once the subscription is complete, you can login to the gopaddle console, using your email ID and the initial password.

In the main dashboard, the **Containerize and Deploy** Quickstart wizard helps to onboard a Source Code project from GitHub using the GitHub personal access token, build and push the generated container image to the Docker Registry. Once the build completes, gopaddle generates the necessary YAML files and deploys the docker image to the local microk8s cluster.

![Screenshot of gopaddle containerize quickstart](gopaddle-containerize.png) 

#### Pre-requisites

[Docker Access Token with Read & Write Permissions](https://www.docker.com/blog/docker-hub-new-personal-access-tokens/)

[GitHub Person Access Token for containerizing Private Repositories](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

In the final step of the Containerize and Deploy Quickstart wizard, enable the option to **Disable TLS verification**. 

![Screenshot of disabling gopaddle TLS](gopaddle-disabletls.png) 

All the artificats generated during the process can be edited and re-deployed at a later stage.

### Application Templates - Marketplace

Under Templates, the Marketplace Applications hosts a variety of pre-built Kubernetes templates. Developers can subscribe to these templates and deploy them on the local microk8s cluster.

![Screenshot of gopaddle marketplace](gopaddle-marketplace.png) 

For more information on gopaddle configurations, please see the [documentation](https://help.gopaddle.io). 

{{< content "marketplace-update-note-shortguide">}}