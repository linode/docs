---
slug: ai-inferencing-with-tensorrt-and-pytorch
title: "Build an AI Inferencing Solution With TensorRt and PyTorch"
description: "Enhance deep learning capabilities with TensorRT and PyTorch on Akamai Cloud. Optimize inferencing for various AI models using NVIDIA RTX 4000 Ada GPU instances."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2025-06-27
keywords: ['ai','inference','inferencing','llm','model','pytorch','tensorrt','gpu','nvidia']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

AI inference workloads are increasingly demanding, requiring low latency, high throughput, and cost-efficiency at scale. Whether working with computer vision or natural language AI models, processing power and efficiency are key; inference workloads must be able to handle real-time predictions while maintaining optimal resource utilization. Choosing the right infrastructure and optimization tools can dramatically impact both performance and operational costs.

This guide shows how to build and benchmark a complete AI inferencing solution using TensorRT and PyTorch on Akamai Cloud's NVIDIA RTX 4000 Ada GPU instances. NVIDIA RTX 4000 Ada GPU instances are available across global core compute regions, delivering the specialized hardware required for heavy AI workloads. Using the steps in this guide, you can:

- Deploy an RTX 4000 Ada GPU instance using Akamai Cloud infrastructure
- Run an AI inference workload using PyTorch
- Optimize your model with TensorRT for performance gains
- Measure latency and throughput

The primary AI model used in this guide is a ResNet50 computer vision (CV) model. However, the techniques used can be applied to other model architectures like object detection ([YOLO](https://en.wikipedia.org/wiki/You_Only_Look_Once); You Only Look Once) models, speech recognition systems (OpenAI's [Whisper](https://openai.com/index/whisper/)), and large language models (LLMs) like [ChatGPT](https://openai.com/index/chatgpt/), [Llama](https://www.llama.com/), or [Claude](https://www.anthropic.com/claude).

## What are TensorRT and PyTorch?

### TensorRt

[TensorRT](https://developer.nvidia.com/tensorrt) is an API and tool ecosystem by NVIDIA that includes inference compilers, runtimes, and deep learning model optimizations. TensorRT is trained on all major frameworks and is used to improve performance on NVIDIA GPUs using techniques like kernel auto-tuning, dynamic tensor memory management, and multi-stream execution. It directly integrates with PyTorch using the TensorRT Framework Integrations API to achieve up to 6x faster inferencing.

### PyTorch

[PyTorch](https://pytorch.org/) is an open-source machine learning framework based on the [Torch library](https://docs.pytorch.org/docs/stable/library.html) and developed by Meta AI for training deep learning models. PyTorch is written in Python and integrates with TensorRT through [Torch-TensorRT](https://github.com/pytorch/TensorRT), so developers can optimize PyTorch models without changing existing codebases. PyTorch integrates with [CUDA](https://en.wikipedia.org/wiki/CUDA) (Compute Unified Device Architecture) to take advantage of parallel computing architectures found in NVIDIA GPUs.

## Before You Begin

The following prerequisites are recommended before starting the implementation steps in this tutorial:

- An Akamai Cloud account with the ability to deploy GPU instances
- The [Linode CLI](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-the-linode-cli) configured with proper permissions
- An understanding of Python virtual environments and package management
- General familiarity of deep learning concepts and models

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see our [Users and Groups](https://www.linode.com/docs/guides/linux-users-and-groups/) doc.
{{< /note >}}

## Deploy an NVIDIA RTX 4000 Ada Instance

Akamai's NVIDIA RTX 4000 Ada GPU instances can be deployed using Cloud Manager or the Linode CLI. This guide is written for use with the Ubuntu 24.04 LTS distribution.

### Deploy Using Cloud Manager


### Deploy Using the Linode CLI



## Set Up Your Development Environment

Once it is fully deployed, connect to your GPU instance to update system packages and install system dependencies. It is recommended to follow the steps in our [Set up and secure a Linode](https://techdocs.akamai.com/cloud-computing/docs/set-up-and-secure-a-compute-instance) guide to configure a limited user with sudo access and secure your sever.

### Update Packages

1.  Log into your instance via SSH. Replace {{< placeholder "user" >}} with your sudo username and {{< placeholder "IP_ADDRESS" >}} with your Linode instance's IP address:

    ```command
    ssh {{< placeholder "user" >}}@{{< placeholder "IP_ADDRESS" >}}
    ```

1.  Update your system and install build tools and system dependencies:

    ```command
    sudo apt update && sudo apt install -y \
        build-essential \
        gcc \
        wget \
        gnupg \
        software-properties-common \
        python3-pip \
        python3-venv
    ```

1.  Download and install NVIDIA CUDA keyring so you get the latest stable drivers and toolkits:

    ```command
    wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb
    sudo dpkg -i cuda-keyring_1.1-1_all.deb
    ```

1.  Update system packages after the keyring is installed:

    ```command
    sudo apt update
    ```

### Install NVIDIA Drivers and CUDA Toolkit

1.  Install the NVIDIA driver repository along with the latest drivers compatible with the RTX 4000 Ada card:

    ```command
    sudo apt install -y cuda
    ```

1.  Reboot your instance to complete installation of the driver:

    ```command
    sudo reboot
    ```

1.  After the reboot is complete, log back into your instance:

    ```command
    ssh {{< placeholder "user" >}}@{{< placeholder "IP_ADDRESS" >}}
    ```

1.  Use the following command to verify successful driver installation:

    ```command
    nvidia-smi
    ```

    This displays basic information about your RTX 4000 Ada instance and its driver version. Your driver and software versions may vary based on release date:

    ```output
    +-----------------------------------------------------------------------------------------+
    | NVIDIA-SMI 575.57.08              Driver Version: 575.57.08      CUDA Version: 12.9     |
    |-----------------------------------------+------------------------+----------------------+
    | GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
    | Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
    |                                         |                        |               MIG M. |
    |=========================================+========================+======================|
    |   0  NVIDIA RTX 4000 Ada Gene...    On  |   00000000:00:02.0 Off |                  Off |
    | 30%   35C    P8              4W /  130W |       2MiB /  20475MiB |      0%      Default |
    |                                         |                        |                  N/A |
    +-----------------------------------------+------------------------+----------------------+

    +-----------------------------------------------------------------------------------------+
    | Processes:                                                                              |
    |  GPU   GI   CI              PID   Type   Process name                        GPU Memory |
    |        ID   ID                                                               Usage      |
    |=========================================================================================|
    |  No running processes found                                                             |
    +-----------------------------------------------------------------------------------------+
    ```

## Configure Your Python Environment

Set up and use a Python Virtual Environment (venv) so that you can isolate Python packages and prevent conflicts with system-wide packages and across projects.

### Create the Virtual Environment

1.  Using the python3-venv package downloaded during setup, set up the Python Virtual Environment:

    ```command
    python3 -m venv ~/venv
    source ~/venv/bin/activate
    ```

    You can confirm you are using your virtual environment when you see `(venv)` at the beginning of your command prompt:

    ```output
    (venv) user@hostname
    ```

1.  While in your virtual environment, upgrade pip to the latest version to complete the setup:

    ```command {title="(venv)"}
    pip install --upgrade pip
    ```

### Install PyTorch and TensorRT

Remain in your virtual environment to install PyTorch, TensorRT, and dependencies. These are the primary AI libraries needed to run your inference workloads.

```command {title="(venv)"}
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
pip install requests
pip install nvidia-pyindex
pip install nvidia-tensorrt
pip install torch-tensorrt -U
```

## Test and Benchmark the ResNet50 Inference Model

Create and run a Python script using a pre-trained ResNet50 computer vision model. Running this script tests to make sure the environment is configured correctly while providing a way to evaluate GPU performance using a real-world example. This example script is a foundation that can be adapted for other inference model architectures.

1.  Using a text editor such as nano, create the Python script file. Replace {{< placeholder "inference_test.py" >}} with a script tile name of your choosing:

    ```command
    nano {{< placeholder "inference_test.py" >}}
    ```

1.  Copy and insert the following code content into the script. Note the commented descriptions for what each section of code performs:

    ```file {title="inference_test.py"}
    # import PyTorch, pre-trained models from torchvision and image utilities

    import torch
    import torchvision.models as models
    import torchvision.transforms as transforms
    from PIL import Image
    import requests
    from io import BytesIO
    import time

    # Download a sample image of a dog
    # You could replace this with a local file or different URL

    img_url = "https://github.com/pytorch/hub/raw/master/images/dog.jpg"
    image = Image.open(BytesIO(requests.get(img_url).content))

    # Preprocess
    # Resize and crop to match ResNet50’s input size
    # ResNet50 is trained on ImageNet where inputs are 224sx224 RGB
    # Convert to a tensor array so PyTorch can understand it
    # Use unsqueeze(0) to add a batch dimension, tricks model to think we are sending a batch of        # images
    # Use cuda() to move the data to the GPU

    transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
    ])
    input_tensor = transform(image).unsqueeze(0).cuda()

    # Load a model (ResNet50) pretrained on the ImageNet dataset containing millions of images

    model = models.resnet50(pretrained=True).cuda().eval()

    # Warm-up the GPU
    # Allows the GPU to optimize the necessary kernels prior to running the benchmark

    for _ in range(5):
        _ = model(input_tensor)

    # Benchmark Inference Time using an average time across 20 inference runs

    start = time.time()
    with torch.no_grad():
        for _ in range(20):
            _ = model(input_tensor)
    end = time.time()

    print(f"Average inference time: {(end - start) / 20:.4f} seconds")
    ```

    When complete, press <kbd>Ctrl</kbd> + <kbd>X</kbd> to exit nano, <kbd>Y</kbd> to save, and <kbd>Enter</kbd> to confirm.

1.  Run the Python script:

    ```command
    python inference_test.py
    ```

    If everything works correctly, you should see output similar to the below. Time results may vary:

    ```output
    Average inference time: 0.0025 seconds
    ```

    It is recommended to time how long it takes to run the model 20 times, and then divide by 20 to get the average time per inference. This should give you an idea of how quickly your GPU can process input using this model.

## Next Steps

Try switching out ResNet50 for different model architectures available in torchvision.models, such as:

- `efficientnet_b0`: Lightweight and accurate
- `vit_b_16`: Vision Transformer model for experimenting with newer architectures

This can help you see how model complexity affects speed and accuracy.