---
slug: getting-started-with-rasa
title: "An Introduction to the Rasa Framework for Automated Chats"
description: "Rasa is an open source machine learning framework for automating text and voice conversations. Learn all about Rasa and how to start using it in this tutorial."
keywords: ['rasa chatbot tutorial','rasa ai demo','rasa open source']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Nathaniel Stickman"]
published: 2023-05-23
modified_by:
  name: Nathaniel Stickman
external_resources:
- '[Rasa Docs: Introduction to Rasa Open Source & Rasa Pro](https://rasa.com/docs/rasa/)'
- '[Towards Data Science: Effortlessly Build Chatbots With Rasa 2.0: A Step-by-step Tutorial](https://towardsdatascience.com/chatbots-made-easier-with-rasa-2-0-b999323cdde)'
- '[GeeksforGeeks: Chatbots Using Python and Rasa](https://www.geeksforgeeks.org/chatbots-using-python-and-rasa/)'
---

Rasa is an open source machine learning framework that uses a story-driven approach for developing automated text and voice chat assistants. Rasa employs an efficient and approachable model for crafting and training chatbots, and the framework includes numerous points for integrating automated assistants.

In this tutorial, learn how to get started with Rasa. From installing the framework, to working with models, to deploying a Rasa instance to a Kubernetes cluster, find out how here.

## Before You Begin

1. If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1. Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Install Rasa Open Source

Rasa Open Source can be installed using the Pip package manager for Python 3. These next few sections show how to set up the prerequisites and install Rasa.

Once the Rasa Open Source software is installed, Rasa projects can be created, built, and run as needed. Keep reading further to see how to start a Rasa project, understand its parts, and deploy it to a Kubernetes cluster.

{{< note >}}
The official documentation for Rasa Open Source lists only Ubuntu as a supported Linux distribution. However, the steps in this tutorial have been successfully used to install Rasa Open Source on AlmaLinux, CentOS Stream, Debian, and Rocky Linux as well.
{{< /note >}}

### Setting Up the Prerequisites

Rasa runs using Python 3, Pip, and the a Python virtual environment. To begin, your system must have the supported versions of the necessary software installed.

These steps walk through these installations and set up the initial virtual environment.

1.  Install a compatible version of Python 3 and Pip 3 using the appropriate command below. Your system may already have these packages installed, in which case these commands simply update them.

    -   **Debian 11** and **Ubuntu 22.04 LTS**:

        ```command
        sudo apt install python3-dev python3-pip python3-venv
        ```

    -   **AlmaLinux 9**, **CentOS Stream 9**, and **Rocky Linux 9**:

        ```command
        sudo dnf install python3-devel
        ```

1.  Create a Python virtual environment for the Rasa project and switch into it. This tutorial names the virtual environment `rasa-venv` and stores it in the current user's home directory.

    ```command
    python3 -m venv ~/rasa-venv
    source ~/rasa-venv/bin/activate
    ```

    The `(rasa-venv)` indicator now appears at the beginning of the command line.

    {{< note >}}
    For reference, exit the virtual environment using the command shown here:

    ```command
    deactivate
    ```

    To reenter the virtual environment, simply repeat the `source` command above.
    {{< /note >}}

### Installing Rasa Open Source

Now it's time to install Rasa Open Source. Rasa is distributed as a Pip package, and can be installed once the package manager is installed.

1.  Upgrade the Pip installation to make sure it has the latest available packages:

    ```command
    pip3 install --upgrade pip
    ```

1.  Install Rasa Open Source:

    ```command
    pip3 install rasa
    ```

## How to Build a Chatbot with Rasa

With Rasa Open Source installed, you can create a basic Rasa project. This section covers steps to create the project and an in-depth breakdown of its structure. Following that, learn how to run the project by operating a functioning Rasa chatbot.

### Creating a Rasa Project

1.  Run the initialization script to create a new Rasa project. This example starts in the current user's home directory, but any directory works for housing the Rasa project subdirectory.

    ```command
    cd ~/
    rasa init
    ```

    The first prompt asks where to locate the Rasa project. This tutorial uses `rasa-example`, which results in a `~/rasa-example` directory. Because this directory does not yet exist, press <kbd>Y</kbd> (`Yes`) to create it. The next prompt asks to train an initial model. Select <kbd>n</kbd> (`No`) here, since the tutorial shows how to execute training later.

1.  Change into the new directory created for the Rasa project. Using the example above, this would be the `~/rasa-example` directory.

    ```command
    cd ~/rasa-example
    ```

### Understanding the Rasa Project Structure

The new project's directory contains a basic Rasa project structure. The following section breaks down the default project contents to help understand the structure and navigate Rasa's components.

The contents should resemble the following outline excluding files like `__init__.py` that are not likely needed in developing the example Rasa assistant.

-   `actions/`

    -   `actions.py` defines custom actions for the Rasa assistant, using Python code that can be activated upon certain conditions.

        Rasa's [documentation](https://rasa.com/docs/rasa/actions) covers actions and gives context for using them.

-   `data/` contains the core models for the Rasa assistant. This is where most of the assistant's development likely takes place.

    -   `nlu.yml` defines Natural Language Understanding (NLU) models for the Rasa assistant. This gives the assistant structures to use in identifying user intention and communicated information.

        See the official documentation's page on [NLU Training Data](https://rasa.com/docs/rasa/nlu-training-data/) for more details on these models.

    -   `rules.yml` defines a set of specific actions to take given specific conditions. These should define rule-like behavior, or actions to always take when certain intentions or information are provided by the user.

        See the official documentation's [Rules](https://rasa.com/docs/rasa/rules/) page for further context.

    -   `stories.yml` models dialogues that the Rasa assistant is expected to engage in. These models are used for training the assistant for conversation, and consist of user intention and/or information annotations, alongside sequences of assistant actions.

        See the official documentation's [Stories](https://rasa.com/docs/rasa/stories/) page for more on the roles and details of stories.

-   `tests/`

    -   `test_stories.yml` defines test stories to verify that the Rasa assistant responds as expected.

        See the official documentation's page on [Testing Your Assistant](https://rasa.com/docs/rasa/testing-your-assistant) for information on constructing effective Rasa test stories.

-   `config.yml` specifies the configuration for training the Rasa assistant. Without specification, Rasa uses a default approach.

    Learn more on the [Model Configuration](https://rasa.com/docs/rasa/model-configuration/) page of the official documentation.

-   `credentials.yml` stores credentials used by the Rasa assistant for interfacing with text and voice chat platforms. The default file includes placeholders for numerous platforms, including Facebook, Slack, and Socket.IO.

    The official documentation has a page on [Connecting to Messaging and Voice Channels](https://rasa.com/docs/rasa/messaging-and-voice-channels) that provides more information.

    Also refer to our tutorial on [How to Use WebSockets with Socket.IO](/docs/guides/using-socket-io) for an example of a Socket.IO chat application that can integrate with a Rasa assistant.

-   `domain.yml` specifies what components from the configurations to include in the Rasa assistant's "world". For example, use this to include intents defined in the `nlu.yml` file or any created actions. This file is also where responses are defined.

    Get a more complete explanation and an additional example through the official documentation on [Domains](https://rasa.com/docs/rasa/domain/).

-   `endpoints.yml` specifies the different endpoints the Rasa assistant connects to. This includes an endpoint for Rasa to pull a model periodically from a remote server.

    Follow the links provided in the default file contents to see the different kinds of endpoints available.

### Running the Rasa Assistant

Before exploring the assistant, it must be trained with a viable model. At this point, the files in the `data/` subdirectory could be modified, but the default Rasa project comes with enough to sample its capabilities.

Learn more about crafting effective models for building a Rasa assistant through the official documentation's best practices guides. These include a guide on [Conversation-driven Development](https://rasa.com/docs/rasa/conversation-driven-development) and a guide on [Generating NLU Data](https://rasa.com/docs/rasa/generating-nlu-data) that is ready for production.

Using the default models (or custom models) train the assistant with a single command for the Rasa CLI tool:

```command
rasa train
```

Rasa proceeds the training process, preparing a full machine learning model from the domain, NLU, story, and rule models provided.

Once the training is complete, users can interact with the assistant from the command line. Use the command below to initialize a command line chat session with the assistant:

```command
rasa shell
```

Explore the chat to get a sample of how the assistant responds and builds from stories. Here is an example exchange using Rasa's default models:

```output
Your input ->  Hello!
Hey! How are you?
Your input ->  Great!
Great, carry on!
Your input ->  Thanks!
Bye
Your input ->
```

When finished, enter `/stop` to exit the conversation.

Comparing these responses with the model contents in the `/data` directory can indicate how Rasa interprets and mobilizes these models.

## How to Deploy a Rasa Chatbot

For some use cases, running Rasa locally may be sufficient. The chat application example in the Socket.IO tutorial linked above, for instance, can leverage a local Rasa instance to integrate the Rasa chat features.

However, most often, the Rasa instance must be deployed. There are several possibilities for doing that, some of which are covered in Rasa's [documentation](https://rasa.com/docs/rasa/deploy/introduction#alternative-deployment-methods).

The recommended deployment method for Rasa is via Kubernetes. To get started, the following sections show how to set up a Linode Kubernetes cluster and deploy a simple Rasa project to it.

### Deploying Rasa

Rasa requires a Kubernetes cluster, with a kubectl configured to interact with it. Helm must also be installed, since the Rasa deployment uses a Helm Chart configuration.

The following steps walk through setting up these prerequisites and deploying an example Rasa project.

1.  Make sure to exit the Python virtual environment:

    ```command
    deactivate
    ```

1.  Follow our [Deploying and Managing a Cluster on Linode Kubernetes Engine (LKE)](/docs/guides/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/) guide to set up a Kubernetes cluster and configure kubectl.

1.  Create a namespace for the Rasa Kubernetes cluster. This example designates the namespace `rasacluster`.

    ```command
    kubectl create namespace rasacluster
    ```

1.  Follow our [Installing Apps on Kubernetes with Helm 3](/docs/guides/how-to-install-apps-on-kubernetes-with-helm-3/#install-the-helm-client) tutorial how to install the Helm CLI client.

    {{< note >}}
    AlmaLinux, CentOS Stream, and Rocky Linux users may need to install `git` and `tar` prior to installing Helm:

    ```command
    sudo dnf install git tar
    ```
    {{< /note >}}

1.  Create a `rasa-chart` directory in the current user's home directory and change into it:

    ```command
    mkdir ~/rasa-chart
    cd ~/rasa-chart
    ```

1.  Create a `rasa-values.yaml` file within the newly created `~/rasa-chart` directory:

    ```command
    nano ~/rasa-chart/rasa-values.yaml
    ```

1.  Give the file the following contents:

    ```file{title="rasa-values.yaml" lang="yaml"}
    applicationSettings:
      initialModel: "https://github.com/RasaHQ/rasa-x-demo/blob/master/models/model.tar.gz?raw=true"
      trainInitialModel: true
      credentials:
        enabled: true
        additionalChannelCredentials:
          rest:
    ```

    To save the file and exit the `nano` text editor, press <kbd>CTRL</kbd>+<kbd>X</kbd> then <kbd>Y</kbd> and <kbd>Enter</kbd>.

    The above configuration creates a Rasa instance with a basic example model and configuration. It downloads an initial training model with the Rasa deployment, trains that model, and enables Rasa's REST API endpoints.

    For more on Rasa's Helm configurations, look at Rasa's [default Rasa Chart configuration](https://raw.githubusercontent.com/RasaHQ/helm-charts/main/charts/rasa/values.yaml). This includes most of the settings to customize a Rasa deployment, along with helpful comments.

    For a more advanced and practical approach to obtaining an initial model, refer to one of Rasa's [example Helm Chart configurations](https://github.com/RasaHQ/helm-charts/blob/main/examples/rasa/train-model-helmfile.yaml). This configuration downloads model files from a Git repository and trains an initial model from those files. A similar approach would likely be used to deploy a custom-developed model.

1.  Add the Rasa repository to Helm:

    ```command
    helm repo add rasa https://helm.rasa.com
    ```

    ```output
    "rasa" has been added to your repositories
    ```

1.  Deploy the Rasa Helm Chart configuration to the cluster's namespace. The `rasarelease` portion of the example command provides a name for the deployment. The deployment can later be accessed using this designation.

    ```command
    helm install --namespace rasacluster --values rasa-values.yaml rasarelease rasa/rasa
    ```

    ```output
    [...]
    rasa 3.2.6 has been deployed!
    [...]
    ```

### Accessing the Rasa Assistant

A Rasa instance with a basic model should now be running on the Kubernetes cluster. To access the instance, use the commands shown here to forward the instances's port:

```command
export SERVICE_PORT=$(kubectl get --namespace rasacluster -o jsonpath="{.spec.ports[0].port}" services rasarelease)
kubectl port-forward --namespace rasacluster svc/rasarelease ${SERVICE_PORT}:${SERVICE_PORT}
```

```output
Forwarding from 127.0.0.1:5005 -> 5005
Forwarding from [::1]:5005 -> 5005
```

The output indicates which port the Rasa instance is available on. Open a new terminal window and view this in action with a command such as:

```command
curl localhost:5005
```

```output
Hello from Rasa: 3.2.6
```

The Helm Chart configuration used above also enables the Rasa assistant's REST API. This allows easy access to the model from other applications. Here is an example of using the API with cURL:

```command
curl -X POST localhost:5005/webhooks/rest/webhook -d '{ "sender": "A User", "message": "Hello, Rasa!" }'
```

```output
[{"recipient_id":"A User","text":"Hey! How are you?"}]
```

Using the `/webhooks/rest/webhook` endpoint allows chatting with the assistant as you would via the command line. The accepted data structure allows message senders to be specified, enabling the assistant to keep track of conversations across multiple users.

### Updating the Rasa Deployment

As this setup evolves, you may need to adjust the Rasa Helm Chart configuration. The example above uses an example model, but the [Rasa API](https://rasa.com/docs/rasa/pages/http-api) can be used to manually create and train models. The example URL can be replaced with a URL for another model, and the deployment can later be adapted to use a [model server](https://rasa.com/docs/rasa/model-storage/#load-model-from-server).

In such cases, use Helm's `upgrade` command to push updates based on changes to the`rasa-values.yaml` file. Using the example designations provided in this tutorial, the command should look like the following:

```command
helm upgrade --namespace rasacluster --reuse-values -f rasa-values.yaml rasarelease rasa/rasa
```

## Conclusion

This covers everything needed to start building automated assistants and chatbots with Rasa. Rasa's models are highly capable, developing and adapting to individual needs. Planning these out, learning what the models are capable of, and working through Rasa's best practices can help. The links throughout this guide, and resources in the Rasa documentation linked below, can help jump start development of a precisely tailored AI assistant.