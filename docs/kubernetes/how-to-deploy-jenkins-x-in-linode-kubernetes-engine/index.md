---
author:
  name: Daniele Polencic
  email: daniele@learnk8s.io
description: 'Learn how to deploy Jenkins X in Linode Kubernetes Engine.'
og_description: 'Learn how to deploy Jenkins X in Linode Kubernetes Engine.'
keywords: ['kubernetes','pipelines','ci/cd','kubernetes','jenkins x','jenkins']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-07-11
modified_by:
  name: Linode
title: "How to deploy Jenkins X in Linode Kubernetes Engine"
h1_title: "How to deploy Jenkins X in Linode Kubernetes Engine"
contributor:
  name: Daniele Polencic
  link: https://github.com/danielepolencic
external_resources:
- '[How to run Jenkins X Boot](https://jenkins-x.io/docs/install-setup/boot/how-it-works/)'
- '[Creating and importing projects in Jenkins X](https://jenkins-x.io/docs/create-project/creating/)'
---

## What is Jenkins X?

[Jenkins X](https://jenkins-x.io) is CI/CD tool that automates the management of the environments and the promotion of new versions of applications between environments.

## Before You Begin

1. You will need an account on GitHub. If you don't have one, [you can register here](https://github.com/join).
1. You need a GitHub account for your bot (to triage issues, merge Pull Requests, etc.). [You can register your bot account here.](https://github.com/join).
1. You will need an account on DockerHub. If you don't have one, [you can register here](https://hub.docker.com/signup).

## Create an LKE Cluster

Follow the instructions in [Deploying and Managing a Cluster with Linode Kubernetes Engine Tutorial](https://www.linode.com/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/) to create and connect to an LKE cluster.

We recommend using 3 Linode 16GB of memory to start with.

![Creating a Kubernetes cluster on Linode](create-cluster.png)

You can verify that the installation is successful with:

```bash
kubectl get nodes
```

The output should similar to:

{{< output >}}
NAME                        STATUS   ROLES    AGE   VERSION
lke7189-9006-5f05145fc9a3   Ready    <none>   8h    v1.17.3
lke7189-9006-5f051460a1e2   Ready    <none>   8h    v1.17.3
lke7189-9006-5f0514617a87   Ready    <none>   8h    v1.17.3
{{</ output>}}

## Install `jx`

To install Jenkins X, you need the command-line tool `jx`.

You can find the instruction on [how to install `jx` on the official documentation.](https://jenkins-x.io/docs/install-setup/install-binary/)

You can verify that the installation is successful with:

```bash
jx version
```

The output should be similar to:

{{< output >}}
Version        2.1.80
Commit         b2bd447
Build date     2020-06-23T15:34:17Z
Go version     1.13.8
Git tree state clean
{{</ output>}}

## Bootstrap Jenkins X

Create a new folder and execute the `jx boot` command to start a new project:

```bash
mkdir jenkins-x
cd jenkins-x
jx boot
```

The command prompts the following message:

{{< output >}}
Creating boot config with defaults, as not in an existing boot directory with a git repository.
No Jenkins X pipeline file jenkins-x.yml or no jx boot requirements file jx-requirements.yml found. You are not running this command from inside a Jenkins X Boot git clone
To continue we will clone https://github.com/jenkins-x/jenkins-x-boot-config.git @ master to jenkins-x-boot-config
? Do you want to clone the Jenkins X Boot Git repository? [? for help] (Y/n)
{{</ output>}}

_Yes_ is the default answer, so you can press enter and continue to the next step (spoiler, the next step fails).

In the next step, the CLI clones the Jenkins X configuration repo and validates your configuration.

The command-line tool expects the cluster name to be in the format `<project id>_<zone>_<cluster name>` — which is the default if you want to use Google Kubernetes Engine.

Since Linode Kubernetes Engine doesn't follow the same naming pattern, the validation fails.

{{< output >}}
Cloning https://github.com/jenkins-x/jenkins-x-boot-config.git @ master to jenkins-x-boot-config
Attempting to resolve version for boot config https://github.com/jenkins-x/jenkins-x-boot-config.git from https://github.com/jenkins-x/jenkins-x-versions.git
Booting Jenkins X

STEP: validate-git command: /bin/sh -c jx step git validate in dir: /tmp/jenkinsx/jenkins-x-boot-config/env

STEP: verify-preinstall command: /bin/sh -c jx step verify preinstall --provider-values-dir="kubeProviders" in dir: /tmp/jenkinsx/jenkins-x-boot-config

error: : unable to parse lke7389 as <project id>_<zone>_<cluster name>
error: failed to interpret pipeline file /tmp/jenkinsx/jenkins-x-boot-config/jenkins-x.yml: failed to run '/bin/sh -c jx step verify preinstall --provider-values-dir="kubeProviders"' command in directory '/tmp/jenkinsx/jenkins-x-boot-config', output: ''
{{</ output>}}

But don't worry, this error can be fixed.

If you inspect the current folder, you should notice that `jx` created a `jenkins-x-boot-config` folder.

In that folder, there's a `jx-requirement.yml` file with the details of your cluster.

Open that with your favourite editor and identify the line that starts with: `provider: gke`

You should change that to `provider: kubernetes`.

```yaml
# jenkins-x-boot-config/jx-requirement.yml
autoUpdate:
  enabled: false
  schedule: ""
bootConfigURL: https://github.com/jenkins-x/jenkins-x-boot-config.git
cluster:
  gitKind: github
  gitName: github
  gitServer: https://github.com
  namespace: jx
  provider: gke # <- you should change this line to "kubernetes"!
```

It's time to run the `jx boot` command again, but this time from within the `jenkins-x-boot-config` folder:

```bash
cd jenkins-x-boot-config
jx boot
```

This time, the command stops at a different step:

{{< output >}}
Attempting to resolve version for boot config https://github.com/jenkins-x/jenkins-x-boot-config from https://github.com/jenkins-x/jenkins-x-versions.git
Booting Jenkins X

STEP: validate-git command: /bin/sh -c jx step git validate in dir: /tmp/jenkinsx/jenkins-x-boot-config/env

STEP: verify-preinstall command: /bin/sh -c jx step verify preinstall --provider-values-dir="kubeProviders" in dir: /tmp/jenkinsx/jenkins-x-boot-config

jx boot has only been validated on GKE and EKS, we'd love feedback and contributions for other Kubernetes providers
? Continue execution anyway? (Y/n)
{{</ output>}}

_Yes_ is the default answer, and you should go ahead and press enter.

The next question is the cluster name:

{{< output >}}
? Cluster name
{{</ output>}}

Enter `jenkins-x-lke`.

{{< output >}}
? Git Owner name for environment repositories
{{</ output>}}

You should use your GitHub username as the Git Owner.

{{< output >}}
Environment repos will be private, if you want to create public environment repos, please set environmentGitPublic to true in jx-requirements.yml
? Comma-separated git provider usernames of approvers for development environment repository
{{</ output>}}

You can use your GitHub username as an approver and add any other team member in this question.

Pay attention to the next question:

{{< output >}}
Locking version stream https://github.com/jenkins-x/jenkins-x-versions.git to release v1.0.529. Jenkins X will use this release rather than master to resolve all versions from now on.
writing the following to the OWNERS file for the development environment repository:
approvers:
- <your GitHub username>
reviewers:
- <your GitHub username>
WARNING: TLS is not enabled so your webhooks will be called using HTTP. This means your webhook secret will be sent to your cluster in the clear. See https://jenkins-x.io/docs/getting-started/setup/boot/#ingress for more information
? Do you wish to continue? [? for help] (y/N)
{{</ output>}}

Notice how _No_ is the default answer.

However, you should answer **Yes** and move on to the next question.

In the next steps, `jx` configures several components in your cluster.

It might take a while before you're requested to interact with the terminal.

When you do, the next questions are about the Jenkins X admin:

{{< output >}}
? Jenkins X Admin Username (admin)
? Jenkins X Admin Password
{{</ output>}}

You should choose a name and a password for the admin user.

Next, you should create a Jenkins X Bot.

The bot will help you triage issues, Pull Requests and execute chores.

In this part, you should enter the details for your bot (the GitHub account that you created in advance):

{{< output >}}
? Pipeline bot Git username
? Pipeline bot Git email address
? Pipeline bot Git token
{{</ output>}}

You can create a token for your bot by [visiting this URL](https://github.com/settings/tokens/new?scopes=repo,read:user,read:org,user:email,write:repo_hook,delete_repo).

Please note that you should create the token with the Bot's account and not yours.

![Creating an API token on GitHub](github-token.png)

You can use the same token for the next question (and just press enter):

{{< output >}}
? HMAC token, used to validate incoming webhooks. Press enter to use the generated token
{{</ output>}}

The next question is crucial:

{{< output >}}
? Do you want to configure non default Docker Registry? (y/N)
{{</ output>}}

Linode does not offer a container registry at the moment.

So you will use Docker Hub as your container registry.

You should answer _Yes_ which is **NOT** the default option.

{{< output >}}
? Do you want to configure non default Docker Registry? Yes
? Docker Registry Url <accept-the-default-value>
? Docker Registry username <enter-your-dockerhub-username>
? Docker Registry password <enter-your-dockerhub-password>
? Docker Registry email <enter-your-dockerhub-username>
{{</ output>}}

The installation should complete with the following output:

{{< output >}}
Verifying the git config
Verifying username <bot-name> at git server github at https://github.com
Found 1 organisation in git server https://github.com: learnk8s
Validated pipeline user <bot-name> on git server https://github.com
Git tokens seem to be setup correctly
Installation is currently looking: GOOD
Using namespace 'jx' from context named 'lke7411-ctx' on server 'https://c50d6328-b182-4fe9-9746-7f6e2b2e1b4d.ap-south-1.linodelke.net:443'.
{{</ output>}}

Jenkins X is installed!

If you inspect your GitHub profile, you might have noticed that there are three new private repositories:

- `environment-jenkins-x-lke-dev`
- `environment-jenkins-x-lke-staging`
- `environment-jenkins-x-lke-prod`

The repositories hold the configuration for each environment.

## Your first project

In this part, you will set up a CI/CD pipeline for a Java (Spring Boot) application.

The same steps are valid for any other language or framework.

You should fork the following repository <https://github.com/learnk8s/jenkins-x-demo>.

Next, clone the repository locally and change your current directory:

```bash
git clone git@github.com:<your-github-username>/jenkins-x-demo
cd jenkins-x-demo
```

You can import the project in Jenkins X with the following command:

```bash
jx import
```

You will see a similar output to this:

{{< output >}}
PipelineActivity for <your-gh-username>-jenkins-x-demo-master-1
upserted PipelineResource meta-<your-gh-username>-jenkins-x-dlncr for the git repository https://github.com/<your-gh-username>/jenkins-x-demo.git
upserted Task meta-<your-gh-username>-jenkins-x-dlncr-meta-pipeline-1
upserted Pipeline meta-<your-gh-username>-jenkins-x-dlncr-1
created PipelineRun meta-<your-gh-username>-jenkins-x-dlncr-1
created PipelineStructure meta-<your-gh-username>-jenkins-x-dlncr-1

Watch pipeline activity via:    jx get activity -f jenkins-x-demo -w
Browse the pipeline log via:    jx get build logs <your-gh-username>/jenkins-x-demo/master
You can list the pipelines via: jx get pipelines
When the pipeline is complete:  jx get applications

For more help on available commands see: https://jenkins-x.io/developing/browsing/
{{</ output>}}

You can now run:

```bash
jx get build logs <yourgithubuser>/jenkins-x-demo/master
```

To follow the pipeline output.

The pipeline will take around three or four minutes to complete, as it has to

- Compile the project.
- Create tags in the repository.
- Build and push the container image to Docker Hub.
- Package the Helm chart for the application.

In the last step of the pipeline, Jenkins X raises a Pull Request to the repository that holds the configuration of your staging environment (created by default during installation).

At the end of the pipeline you will see the following output:

{{< output >}}
Created Pull Request: https://github.com/<your-gh-username>/environment-jenkins-x-lke-staging/pull/1
{{</ output>}}

The Pull Request is an automatic promotion to the staging environment.

If you merge the Pull Request, the application is automatically promoted to the staging environment.

You can go ahead and merge the Pull Request to see the pipeline applying the changes in the staging environment.

If the promotion is successful, you can inspect the app with:

```bash
jx get applications
```

{{< output >}}
APPLICATION      STAGING PODS URL
jenkins-x-demo   0.0.10       http://jenkins-x-staging.178.79.175.247.nip.io
{{</ output>}}

It might take some time for your application to start.

However, as it is, you can visit the app on the URL and see it running.
