---
slug: pytorch-install-22-04-ubuntu
title: Install Pytorch on Ubuntu 22.04
title_meta: "how to Install PyTorch on Ubuntu 22.04
description: 'This guide updates to the current stable version using Pip as the installation tool and expands on how to use the services and features for CPU and GPU.'
Authors: Diana Hoober
Contributors: Diana Hoober
published: 2021-11-05
modified: 2025-9-12
keywords: ['pytorch install','pytorch cpu','conda install pytorch','what is pytorch', 'uninstall pytorch']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

This guide shows examples for installing PyTorch, a Python framework, on an Ubuntu 22.04 compute instance and provides support for math-intensive applications that run on GPU and CPU. These instances are both available with Akamai Technologies.

## What is PyTorch?

This is an open-source machine learning framework that enables fast, flexible experimentation and production deployment. Whether you want to build neural networks or fine-tune pre-trained models, PyTorch offers intuitive APIs and dynamic computation graphs that make it ideal for research and real-world applications.

## Before You Begin

Our guide assumes you're working on a Linux-based compute instance with sudo access. You're going to install PyTorch in a Python environment--either system-wide or within a virtualenv (virtu
al environment is recommended).

### Prerequisites

To install and run PyTorch comfortably, your system should have:

- **OS**: Ubuntu 22.04 or higher
- **Python**: 3.8 or higher
- **Pip**: Latest version recommended
- **Optional**: CUDA 11.8+ for GPU acceleration
- A working internet connection
- Clean Python environment (e.g., virtualenv or conda)
- At least **4 GB RAM** (8 GB+ preferred for training)
- No conflicting Python packages
- At least 3 - 5 GB of free disk space, depending on your python version, virtual environment setup, and additional packages. If working on a minimal or resource-constrained system, consider checking available disk space with:

    df -h

## Installation Steps

1. Update your system

Once you have taken care of prerequisties, run:

    sudo apt update && sudo apt upgrade

After running these commands, the system prompts you for confirmation [Y/n] before upgrading to ensure you are aware of resource usage and system changes before continuing. Choose "n" to stop and remedy this situation if you don't have the required resources.

{{< Note>}}
After confirming the upgrade, you may be prompted to restart services or resolve config file changes. These are expected so carefully read and follow the contributor-safe defaults when available.
{{< /Note>}}

1. Services restart

Next you will be prompted to select which services to restart. You can accept the defaults and select any others you know are needed. If you are not sure, skip restarts by selecting Cancel, but it may delay updates taking effect. To navigate inside the Restart Services box:

    **Arrow keys**: Use up/down to move between services
    **Spacebar**: Toggles selection showing an asterisk [*] if selected and blank if not [ ]
    **Tab**: Moves the cursor to the *<Ok>* or *<Cancel>* button
    **Enter**: Confirms your selection (activates the highlighted button)

    If you selected *<Cancel>* the upgraded packages are still installed, but the changes won't take effect until the affected services are manually restarted or the system is rebooted.

{{< Note>}}
Rebooting may seem like a quick fix, but it can obscure errors and delay troubleshooting. Restart services directly unless reboot is explicitly required.
{{< /Note>}}

If you skipped service restarts during the upgrade process, you can apply the updates manually using `systemctl`:

    sudo systemctl restart <service-name>

    Replacing `<service-name>` with the actual service, such as:

    sudo systemctl restart ssh
    sudo systemctl restart samba
    sudo systemctl restart apache2

This ensures upgraded packages are used without requiring a full reboot. However, if the installer triggers a service restart (e.g., `systemd`, `udev`, or networking), contributors should:

    - Confirm the restart completed using:

        `systemctl status <service>` to verify it's active/running.

    - Validate basic functionality:

        Run a quick health check (e.g., `curl localhost:<port>` or confirm CLI tool availability).

**Summary**:
Messages like "no containers need to be restarted" or "No VM guests are running..." confirm that no action is needed in those areas. These checks are part of `needrestart` that can be ignored unless you're working in a containerized or virtualized environment. Also, some services may show "restart deferred" messages. This means they were flagged for retart but not restarted automatically. Use `sudo systemctl restart <service> if needed.

If the service fails to restart or behaves unexpectedly, see Troubleshooting: [Restart Response for edge-case handling](guides\development\python\pytorch-install-2-8-0-ubuntu\index.md\#restart-ts).

1. Install Python and pip (if not already installed). To check:

    python3 --version
    pip3 --version

If it isn't installed, fails or shows an older version (e.g., Python 2.x), then install or update with:

    sudo apt install python3 python3-pip

Then re-run the above validate version steps to confirm.

1. Create a Virtual Environment (Optional)

To isolate dependencies and avoid system-wide installs, you can create a virtual environment by running:

    python3 -m venv pytorch-env
Then do:
    ls pytorch-env/bin

You should see files like `activate`, `pip`, and `python`. If you see these files then run:

    source pytorch-env/bin/activate

To activate the virtual environment. If you do not see activate, then install the missing package:

    sudo apt install python3.10-venv (where .10 is the latest stable version)

Then follow the steps above to create the virtual environment and activate it. Then you will see the `(pytorch-env)` in your prompt.

To keep your PyTorch install separate from system-wide Python packages and:

    - avoid version or dependency conflicts or accidental overwrites. Keeps your PyTorch install separate from other Python projects.
    - prevent permission issues. You won't need to run `pip` as root, which also avoids system-level risks.
    - enable reproducibility. You can freeze and share your environment with others using `requirements.txt`.
    - Stay contributor-safe. No risk of breaking system packages or stepping on other users' toes.

You can also spin up multiple environments for different projects (e.g., PyTorch CPU-only vs. GPU-enabled), without cross-contamination. CPU-only installs are ideal for low-resource environments. Then when you are done, just delete the environment folder--no lingering packages or broken dependencies.

{{< Note>}}
This is optional but recommended. It isolates your PyTorch install, protects system packages, and makes contributor onboarding reproducible and frustration-free.
{{< /Note>}}

1. Install PyTorch via pip

To install the latest stable versions optimized for CPU use--perfect for lightweight experimentation or server-side work, run:

    pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

Respond with "Y" when prompted unless you are unsure about available space. See [Prerequisites](guides\development\python\pytorch-install-2-8-0-ubuntu\index.md\#prerequisites).

For other configurations (e.g., GPU-enabled installs), refer to [PyTorch's official install guide](https://pytorch.org/get-started/locally/). Be sure to select your OS, package manager, and compute platform carefully.

1. Validate the Installation

Run the following Python commands to confirm PyTorch is installed and check for CUDA support:

    python -c "import torch; print(torch.__version__)"

This confirms PyTorch is installed correctly when it returns something like `2.8.0` or `2.8.o+cpu` which indicates it is a CPU-only build and that it is not linked to any CUDA libraries.

This gives contributors immediate feedback on both install success and CUDA availability. If `torch.cuda.is_available()` returns `False`, you're running a CPU-only install--which is expected unless you've configured CUDA.

{{<Note>}}
This guide reflects real-world troubleshooting and contributor-safe practices. If you encounter issues during install, check for conflicting Python packages, insufficient RAM, or missing dependencies.
{{< /Note>}}

## Uninstalling PyTorch

Whether you're switching builds, cleaning up an environment, or troubleshooting a failed install, here's how to safely uninstall PyTorch (when installed with pip inside a virtual environment) without affecting your system-wide setup:

### Uninstall inside a virtual environment:

    pip uninstall torch torchvision torchaudio

If you are dealing with uninstalling PyTorch that was installed outside a virtual environment these instructions still work, but may affect other projects or scripts that rely on PyTorch globally (you might need `sudo` and elevated permissions depending on how it was installed). For help, under these circumstances, with safe uninstall practices see [Markaicode's Complete Guide to Uninstally PyTorch](https://markaicode.com/how-to-uninstall-pytorch-complete-guide-for-all-systems/).

## Troubleshooting Tips

### Restart Response for Edge-Case handling {#restart-ts}:

If a restart fails silently or causes degraded behavior:

    - **Check logs**
        Run:
        `journalctl -u <service> --since "5 minutes ago"`
        to confirm restart confirmation or identify errors.

    - **Retry Safely**:
        Use:
        `sudo systemctl restart <service>`
        and revalidate. Avoid full reboots unless required.

    - **Flag edge cases**
        Services may appear active but fail to bind ports, load configs, or respond to requests.
        Include time-stamped logs and config diffs when reporting.

This section may grow over time as contributors encounter and resolve new issues. All additions are reviewed for clarity and accuracy before publishing.

## For More Information

If you run into issues or want to know more about PyTorch, check out the [official PyTorch Tutorials and Knowledge Base](https://docs.pytorch.org/tutorials/).
For the Conda based installation of PyTorch see the [PyTorch Get Started page](https://pytorch.org/get-started/locally/).