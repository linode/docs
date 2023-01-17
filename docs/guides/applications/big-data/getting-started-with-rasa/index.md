---
slug: getting-started-with-rasa
author:
  name: Linode Community
  email: docs@linode.com
description: "Rasa is an open-source machine-learning framework for automating text and voice conversations. With its story-based and contextual approach, Rasa can provide an effective service chatbot, voice assistant, and more. Learn all about Rasa and how to start using it in this tutorial."
keywords: ['rasa chatbot tutorial','rasa ai demo','rasa open source']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-01-16
modified_by:
  name: Nathaniel Stickman
title: "An Introduction to the Rasa Framework for Automated Chats"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Rasa Docs: Introduction to Rasa Open Source & Rasa Pro](https://rasa.com/docs/rasa/)'
- '[Towards Data Science: Effortlessly Build Chatbots With Rasa 2.0: A Step-by-step Tutorial](https://towardsdatascience.com/chatbots-made-easier-with-rasa-2-0-b999323cdde)'
- '[GeeksforGeeks: Chatbots Using Python and Rasa](https://www.geeksforgeeks.org/chatbots-using-python-and-rasa/)'
---

Rasa is an open-source machine-learning framework that uses a story-driven approach for developing automated text and voice chat assistants. Rasa employs an efficient and approachable model for crafting and training chatbots, and the framework includes numerous points for integrating your automated assistants.

In this tutorial, learn how to get started with Rasa. From installing the framework, to working with models, to deploying a Rasa instance to a Kubernetes cluster — find out how here.

## Before You Begin

1. If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1. Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Install Rasa Open Source

Rasa Open Source can be installed using the Pip package manager for Python 3. These next few sections show you how to set up the prerequisites and get Rasa installed on your system.

At the end, you have a Rasa Open Source instance installed and can create, build, and run Rasa projects as needed. Keep reading further to see how to start your first Rasa project, understand the project's parts, and deploy Rasa to a Kubernetes cluster.

{{< note >}}
The official documentation for Rasa Open Source only lists Ubuntu as a supported Linux distribution. However, the steps in this tutorial have been successfully used to install Rasa Open Source on CentOS, Debian, and Fedora in addition to Ubuntu.
{{< /note >}}

### Setting Up the Prerequisites

Rasa runs using Python 3, Pip, and the a Python virtual environment. To support this, you need to make sure your system has the necessary software installed in the supported versions.

These steps walk you through the necessary installations as well as setting up the initial virtual environment to use for your Rasa instance.

1. Install a compatible version of Python 3 and Pip 3 using the appropriate command below. Your system may already have these installed, in which case these commands just update them.

    - On Debian and Ubuntu systems, use the command here to install the standard Python 3 version for the distribution along with the packages for Pip and Python's `venv` for virtual environments.

        ```command
        sudo apt install python3-dev python3-pip python3-venv
        ```

    - On CentOS, use the command here to install Python 3.9. Installing this package also installs Pip and Python's virtual environment package.

        ```command
        sudo dnf install python39-devel
        ```

    - On Fedora, use the command here to install the standard Python 3 version for the distribution. The installation includes Pip and Python's virtual environment package.

        ```command
        sudo dnf install python3-devel
        ```

1. Create a Python virtual environment for the Rasa project, and switch into that virtual environment. This tutorial names that virtual environment `rasa-venv` and stores it in the current user's home directory.

    ```command
    python3 -m venv ~/rasa-venv
    source ~/rasa-venv/bin/activate
    ```

    You should now see the `(rasa-venv)` indicator at the beginning of your command line. For reference, you can exit the virtual environment using the command shown here.

    ```command
    deactivate
    ```

    Just be sure to reenter the virtual environment with the `source` command above whenever you want to use Rasa.

### Installing Rasa Open Source

Now you can install Rasa Open Source. Rasa comes as a Pip package, and so the installation is straightforward once you have the package manager installed.

1. Upgrade your Pip installation to be sure you have the latest packages available.

    ```command
    pip3 install --upgrade pip
    ```

1. Install Rasa Open Source.

    ```command
    pip3 install rasa
    ```

## How to Build a Chatbot with Rasa

With Rasa Open Source installed, you can create your first Rasa project. This section of the tutorial gets you started with steps to create a basic project and an in-depth breakdown of the project structure. Following that, you can see how to run the basic project, operating a function Rasa chatbot on your system.

### Creating a Rasa Project

Rasa operates on a project basis, meaning that, to start using it, you need a Rasa project to work out of. Starting a new base project is straightforward, and the new Rasa project comes with a full structure that you can start using immediately.

1. Ensure that you are in the Python virtual environment you created for Rasa in the section on prerequisites above. Using the virtual environment directory created there, you can reactivate the environment with the command here.

    ```command
    source ~/rasa-venv/bin/activate
    ```

1. Make sure you are in a directory where you would like to create a Rasa project subdirectory, and run the initialization script to create a new Rasa project. This example starts in the current user's home directory.

    ```command
    cd ~/
    rasa init
    ```

    The first prompt asks where you want to locate your Rasa project. This tutorial uses `rasa-example`, which results in a `~/rasa-example` directory.

    The next prompt asks if you want to train an initial model. Select `n` (`No`) here, since the tutorial shows how to execute the training later.

1. Change into the new directory created for your Rasa project. Using the example above, this would be the `rasa-example` directory.

    ```command
    cd rasa-example
    ```

### Understanding the Rasa Project Structure

You new project's directory comes with a basic Rasa project structure. The following breaks down the default project contents to help you understand the structure and start navigating Rasa's components.

The contents should resemble this outline. The outline skips files like `__init__.py` that you are likely not to need to bother with in developing your Rasa assistant. Otherwise, the outline dives into each file and gives you an explanation of its role, often alone with links to official documentation.

- `actions/`

    - `actions.py` defines custom actions for your Rasa assistant, using Python code that can be activated upon certain conditions. Rasa's [documentation](https://rasa.com/docs/rasa/actions) covers actions and gives context for starting to use them.

- `data/` contains the core models for your Rasa assistant. This is where most of the assistant's development is likely to take place.

    - `nlu.yml` defines Natural Language Understanding (NLU) models for the Rasa assistant. This gives the assistant structures to use in identifying user intention and communicated information.

        See the official documentation's page on [NLU Training Data](https://rasa.com/docs/rasa/nlu-training-data/) for more details on these models.

    - `rules.yml` defines a set of specific actions to take given specific conditions. These should define rule-like behavior, actions to always take when certain intentions or information are provided by the user.

        See the official documentation's [Rules](https://rasa.com/docs/rasa/rules/) page for further context for rules.

    - `stories.yml` models dialogues that the Rasa assistant is expected to engage in. These models are used for training the assistant for conversation, and they consist of user intention and/or information annotations alongside sequences of assistant actions.

        See the official documentation's [Stories](https://rasa.com/docs/rasa/stories/) page for more on the roles and details of stories.

- `tests/`

    - `test_stories.yml` defines test stories to verify that the Rasa assistant responds as expected.

        See the official documentation's page on [Testing Your Assistant](https://rasa.com/docs/rasa/testing-your-assistant) for information on constructing effective Rasa test stories.

- `config.yml` specifies the configuration for training your Rasa assistant. Without specification, Rasa uses a default approach. Learn more on the [Model Configuration](https://rasa.com/docs/rasa/model-configuration/) page of the official documentation.

- `credentials.yml` stores credentials to be used by your Rasa assistant for interfacing with text and voice chat platforms. The default file includes placeholders for numerous platforms, including Facebook, Slack, and Socket.IO.

    The official documentation has a page on [Connecting to Messaging and Voice Channels](https://rasa.com/docs/rasa/messaging-and-voice-channels) that provides more information.

    You may also refer to our tutorial on [How to Use WebSockets with Socket.IO](/docs/guides/using-socket-io). There you can see an example of a Socket.IO chat application that can integrate with a Rasa assistant.

- `domain.yml` specifies what from your configurations is included in the "world" of your Rasa assistant. Use this to include, for instance, intents defined in your `nlu.yml` file and actions that you have created. This file is also where responses are defined.

    You can get a more complete explanation and an additional example through the official documentation on [Domains](https://rasa.com/docs/rasa/domain/).

- `endpoints.yml` specifies the different endpoints your Rasa assistant connects to. This includes an endpoint for Rasa to pull a model periodically from a remote server. Follow the links provided in the default file contents to see the different kinds of endpoints available.

### Running the Rasa Assistant

Before trying out your assistant, you need to train it with a viable model. You can start modifying the files in the `data/` subdirectory to your needs, but actually the default Rasa project comes with enough to sample its capabilities.

Learn more about crafting effective models for building a Rasa assistant through the official documentation's best-practice guides. These include a guide on [Conversation-driven Development](https://rasa.com/docs/rasa/conversation-driven-development) and a guide on [Generating NLU Data](https://rasa.com/docs/rasa/generating-nlu-data) that is ready for production.

Using the default models or custom models, you can train your assistant with a single command to the Rasa CLI tool.

```command
rasa train
```

Rasa runs through the training process, preparing a full machine-learning model from the domain, NLU, story, and rule models you provided.

Once the training has finished, you can begin interacting with your assistant right from the command line. Use the command here to initialize a command line chat session with your assistant.

```command
rasa shell
```

Play around with the chat to get a sample of how the assistant responds and builds from stories. Here is an example exchange using Rasa's default models.

```output
Your input ->  Hello!
Hey! How are you?
Your input ->  Okay, and you?
Great, carry on!
Your input ->  Thanks!
```

From here, it can be helpful to compare the kinds of responses with the model contents in the `/data` directory. This can go a long way to helping you grasp how Rasa interprets these models and mobilizes them.

## How to Deploy a Rasa Chatbot

For some use cases, having Rasa running locally may be all you need. The chat application example in the Socket.IO tutorial linked above, for instance, can leverage a local Rasa instance to integrate the Rasa chat features.

However, most often you need to deploy your Rasa instance. There are several possibilities for doing that, some of which are covered in Rasa's [documentation](https://rasa.com/docs/rasa/deploy/introduction#alternative-deployment-methods).

The recommended deployment method for Rasa is via Kubernetes. To get you started, the upcoming sections show you how to set up a Linode Kubernetes cluster and deploy a simple Rasa project to it.

### Deploying Rasa

Rasa needs you to have your Kubernetes cluster up and running and to have a kubectl instance connected to your cluster. You also need to have Helm installed, since the Rasa deployment uses a Helm Chart configuration.

The steps here give walk you through setting up these prerequisites and deploying an example Rasa project once everything is in place.

1. Follow our [Deploying and Managing a Cluster on Linode Kubernetes Engine (LKE)](/docs/guides/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/) guide to set up a Kubernetes cluster through Linode.

    By the end, you should have a cluster running and a kubectl instance set up to manage the cluster via its kubeconfig file.

1. Create a namespace for your Rasa Kubernetes cluster. This example designates the namespace `rasacluster`.

    ```command
    kubectl create namespace rasaclsuter
    ```

1. Follow our [Installing Apps on Kubernetes with Helm 3](/docs/guides/how-to-install-apps-on-kubernetes-with-helm-3/#install-the-helm-client) tutorial to install the Helm CLI client.

1. Create a `~/rasa-chart/` directory, and create a `rasa-values.yaml` file within it.

    This tutorial uses the [default Rasa Helm Chart configuration](https://raw.githubusercontent.com/RasaHQ/helm-charts/main/charts/rasa/values.yaml). The configuration comes with useful basic features, and also includes an initial example model.

    However, to make this configuration work for this tutorial, you should make two changes within the file:

    - Modify the `additionalChannelCredentials` line to remove the curly brackets, and un-comment the `rest` line beneath this. You should have lines like the following after making these changes.

        ```file {title="rasa-values.yaml" lang="yaml"}
        # [...]
        additionalChannelCredentials:
          rest:
        # [...]
        ```

        Doing this enables REST endpoints for your Rasa assistant, making it readily accessible from other applications.

    - Remove or comment out the entire `endpoints` section. This section is used when you want to fetch your model from a model server. You can learn about that approach in the [official documentation](https://rasa.com/docs/rasa/model-storage/#load-model-from-server).

    For a more advanced and practical approach to getting an initial model, you can refer to one of Rasa's [example Helm Chart configurations](https://github.com/RasaHQ/helm-charts/blob/main/examples/rasa/train-model-helmfile.yaml). This configuration downloads model files from a Git repository and trains an initial model from those files. Likely you would use a similar approach when you want to deploy a custom model you have develop.

1. Add the Rasa repository to Helm.

    ```command
    helm repo add rasa https://helm.rasa.com
    ```

1. Deploy your Rasa Helm Chart configuration to your cluster's namespace. The `rasarelease` portion of the example command here provides a name for your deployment. You are able to access the deployment later using this designation.

    ```command
    helm install --namespace rasacluster --values rasa-values.yaml rasarelease rasa/rasa
    ```

    ```output
    [...]
    rasa 3.2.6 has been deployed!
    [...]
    ```

### Accessing the Rasa Assistant

Now a Rasa instance with a basic model should be running on your Kubernetes cluster. To access the instance, use the commands shown here to forward your cluster's port for the instance.

```command
export SERVICE_PORT=$(kubectl get --namespace rasacluster -o jsonpath="{.spec.ports[0].port}" services rasarelease)
kubectl port-forward --namespace rasacluster svc/rasarelease ${SERVICE_PORT}:${SERVICE_PORT}
```

```output
Forwarding from 127.0.0.1:5005 -> 5005
Forwarding from [::1]:5005 -> 5005
```

The output indicates the port your Rasa instance has been made available on, which you can see with a command like this.

```command
curl localhost:5005
```

```output
Hello from Rasa: 3.2.6
```

And the Helm Chart configuration used above also enables the Rasa assistant's REST API. This allows you to access your model readily from other applications. Here is an example of the API in action from cURL.

```command
curl -X POST localhost:5005/webhooks/rest/webhook -d '{ "sender": "A User", "message": "Hello, Rasa!" }'
```

```output
[{"recipient_id":"A User","text":"Hey! How are you?"}]
```

Using the `/webhooks/rest/webhook` endpoint, you can chat with the assistant as you would via the command line. And the accepted data structure allows you to specify message senders, allowing your assistant to keep track of conversations across multiple users.

### Updating the Rasa Deploying

As your setup evolves, you likely need to adjust the Rasa Helm Chart configuration. The example above uses an example model, and you can use the [Rasa API](https://rasa.com/docs/rasa/pages/http-api) to manually create and train models. But likely you want to replace the example URL with a URL for a model derived from your own local Rasa project. And you may later want to adapt your deployment to use a [model server](https://rasa.com/docs/rasa/model-storage/#load-model-from-server).

In such cases, you can use Helm's `upgrade` command to push updates based on changes to the`rasa-values.yaml` file. Using the example designations provided in this tutorial, the command should look like the following.

```command
helm upgrade --namespace rasacluster --reuse-values -f rasa-values.yaml rasarelease rasa/rasa
```

## Conclusion

This covers everything you need to get started building automated assistants and chatbots with Rasa. Rasa's models are highly capable, developing and adapting to your needs. Planning these out, learning what the models are capable of, and working through Rasa's best practices can help. The links throughout this guide, and resources in the Rasa documentation linked below, can jump start your development of the precise AI assistant you need.
