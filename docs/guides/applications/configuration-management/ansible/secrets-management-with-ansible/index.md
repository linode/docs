---
slug: secrets-management-with-ansible
description: "Ansible is a powerful tool for automating server provisioning and management. But these tasks often require secrets like passwords and access tokens. To keep your secrets secure, you should implement secrets management with Ansible. Learn how to choose the best secrets management solution for your needs and how to get started using it with Ansible in this tutorial."
keywords: ['ansible secrets manager','ansible vault tutorial','ansible secrets best practices']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-12-08
modified_by:
  name: Nathaniel Stickman
title: "Secrets Management with Ansible"
external_resources:
- '[Red Hat - Enable Sysadmin: Handling Secrets in Your Ansible Playbooks](https://www.redhat.com/sysadmin/ansible-playbooks-secrets)'
- '[Ansible Documentation: Protecting Sensitive Data with Ansible Vault](https://docs.ansible.com/ansible/latest/vault_guide/index.html)'
authors: ["Nathaniel Stickman"]
tags: ["saas"]
---

Ansible stands out for its capabilities in automating server provisioning and management. Ansible's playbooks, its ability to group and organize resources, and numerous other features make it a great asset for administering servers.

However, Ansible's operations often necessitate that your playbooks leverage secrets like server passwords, access tokens, and API keys.

To bring security to the convenience of your Ansible setup, you should use a secrets management process. Secrets management continues to let Ansible automate your server tasks, with all the access it needs. At the same time, secrets management keeps your secrets safely out of plain text files and other vulnerable locations.

In this tutorial, learn the most useful methods for implementing secrets management with your Ansible setup. The tutorial covers a range of methods, from simple to scalable, and helps you choose the right fit.

## Before You Begin

1.  If you have not already done so, create a Linode account. See our [Getting Started with Linode](/docs/products/platform/get-started/) guide.

1.  Follow our guide on [Getting Started With Ansible: Basic Installation and Setup](/docs/guides/getting-started-with-ansible/). Specifically, follow the sections on setting up a control node and managed nodes, configuring Ansible, and creating an Ansible inventory.

1.  Refer to our guide [Automate Server Configuration with Ansible Playbooks](/docs/guides/running-ansible-playbooks/) for an overview of Ansible playbooks and their operations.

## Secrets in Ansible

A secret refers to a key or other credential that allows access to a resource or system. Secrets include things like access tokens, API keys, and database & system passwords.

When managing nodes with Ansible, you often need to provide it with secrets. Typically, you can provide these secrets within Ansible playbooks, but doing so exposes them to possible interception and exploitation.

To secure your secrets, you should implement secrets management with your Ansible playbooks. Secrets management refers to the ways in which secrets are stored safely, with different methods balancing between accessibility and security.

## Managing Secrets in Ansible

Several options exist for managing secrets with your Ansible playbooks. The option that fits your needs depends on your particular setup. How accessible you need your secrets to be and how secure you want to make them determine which solutions work best for you.

The upcoming sections outline some of the most useful options for managing secrets with Ansible. These attempt to cover a range of use cases, from interactive and manual, to automated and integrated.

All of the examples that follow use an Ansible setup with one control node and two managed nodes. The managed nodes are given the example IP addresses `192.0.2.1` and `192.0.2.2` throughout, and are listed in an `ansiblenodes` group in the control node's Ansible inventory.

### Using Prompts to Manually Enter Secrets

Ansible playbooks include the option to prompt users for variables. This is actually an option for managing secrets within your Ansible setup.

With this option, you configure your Ansible playbook to prompt users to manually input secrets. The secrets never need to be persisted on the system, allowing you to safeguard them otherwise. This method is the easiest of the options covered here.

Of course, this option comes with some significant drawbacks. By not storing the secrets, you also prevent Ansible from accessing them automatically, reducing the ability to integrate your playbooks into automated processes. Additionally, leaving the secrets to manual entry introduces its own risks, as users can mishandle secrets.

Here is an example Ansible playbook from our [Automate Server Configuration with Ansible Playbooks](/docs/guides/running-ansible-playbooks/) guide. This playbook adds a new non-root user to the managed nodes.

The playbook uses the `vars_prompt` option to prompt the user to input a password for the new user. Ansible then hashes the password and deploys the new user to each of the managed nodes.

{{< note >}}
This playbook assumes you have an SSH public key on your control node. The public key allows for secure passwordless connections to the new user in the future. Learn more in our guide [Using SSH Public Key Authentication](/docs/guides/use-public-key-authentication-with-ssh/).

This tutorial also assumes that your control node’s SSH key is secured by a password, and hence uses the `--ask-pass` option in some of the Ansible playbook commands below. If your SSH key is not secured by a password, remove the `--ask-pass` option from the Ansible playbook commands shown in this tutorial.
{{< /note >}}

```file {title="add_limited_user.yml" lang="yml"}
---
- hosts: ansiblenodes
  remote_user: root
  vars:
    limited_user_name: 'example-user'
  vars_prompt:
    - name: limited_user_password
      prompt: Enter a password for the new non-root user
  tasks:
    - name: "Create a non-root user"
      user: name={{ limited_user_name }}
            password={{ limited_user_password | password_hash }}
            shell=/bin/bash
    - name: Add an authorized key for passwordless logins
      authorized_key: user={{ limited_user_name }} key="{{ lookup('file', '~/.ssh/id_rsa.pub') }}"
    - name: Add the new user to the sudoers list
      lineinfile: dest=/etc/sudoers
                  regexp="{{ limited_user_name }} ALL"
                  line="{{ limited_user_name }} ALL=(ALL) ALL"
                  state=present
```

To run the playbook, first make sure you're in the same directory as the playbook, then execute the following command:

```command {title="Ansible Control Node"}
ansible-playbook --ask-pass add_limited_user.yml
```

Ansible prompts for the SSH password first, then for a password for the new user. The output should resemble what is shown below:

```output
SSH password:
Enter a password for the new non-root user:

PLAY [ansiblenodes] ************************************************************

TASK [Gathering Facts] *********************************************************
ok: [192.0.2.2]
ok: [192.0.2.1]

TASK [Create a non-root user] **************************************************
changed: [192.0.2.1]
changed: [192.0.2.2]

TASK [Add remote authorized key to allow future passwordless logins] ***********
ok: [192.0.2.1]
ok: [192.0.2.2]

TASK [Add normal user to sudoers] **********************************************
ok: [192.0.2.1]
ok: [192.0.2.2]

PLAY RECAP *********************************************************************
192.0.2.1              : ok=4    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
192.0.2.2              : ok=4    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

### Using the Ansible Vault to Manage Secrets

Ansible has a tool, Ansible Vault, that can facilitate secrets management. The Vault encrypts information, which you can then use within your Ansible playbooks.

With some setup, Ansible Vault can make secrets both secure and accessible. Secrets are encrypted, meaning that no one can get to them without your password. The secrets are, at the same time, made accessible to Ansible. A password file can give Ansible everything it needs to run in an automated setup.

The vault password can either be entered manually or automatically through a password file. You can even use an external password manager, and implement a script or other solution to retrieve the password.

This example of Ansible Vault deploys [rclone](https://rclone.org/) to the managed nodes and configures it to connect to a Linode Object Storage instance. The secrets are the access keys for the object storage instance.

To follow along, you need to set up a Linode Object Storage instance with access keys and at least one bucket. You can learn how to do so in our guide [Object Storage - Get Started](/docs/products/storage/object-storage/get-started/).

1.  Create a file with the access keys for your Linode Object Storage instance. You can do so with the following command, just replace the text in arrow brackets with your corresponding object storage keys:

    ```command {title="Ansible Control Node"}
    echo "s3_access_token: <S3_ACCESS_TOKEN>" > s3_secrets.enc
    echo "s3_secret_token: <S3_SECRET_TOKEN>" >> s3_secrets.enc
    ansible-vault encrypt s3_secrets.enc
    ```

    Ansible Vault prompts you to create a vault password before encrypting the file's contents.

    ```output
    New Vault password:
    Confirm New Vault password:
    Encryption successful
    ```

1.  Create a password file in the same directory you intend to create the Ansible playbook in. The file needs to contain only the password for your encrypted secrets file. The example in this next command assumes your password is `examplepassword`:

    ```command {title="Ansible Control Node"}
    echo "examplepassword" > example.pwd
    ```

1.  Create a new Ansible playbook with the following contents. This playbook connects to the non-root users created using the playbook in the previous section of this tutorial. The playbook then installs rclone and creates a configuration file for it. The playbook also inserts the access keys from the `s3_secrets.enc` file into the configuration file.

    ```file {title="set_up_rclone.yml" lang="yml"}
    ---
    - hosts: ansiblenodes
      remote_user: 'example-user'
      become: yes
      become_method: sudo
      vars:
        s3_region: 'us-southeast-1'
      tasks:
        - name: "Install rclone"
          apt:
            pkg:
              - rclone
            state: present
            update_cache: yes
        - name: "Create the directory for the rclone configuration"
          file:
            path: "/home/example-user/.config/rclone"
            state: directory
        - name: "Create the rclone configuration file"
          copy:
            dest: "/home/example-user/.config/rclone/rclone.conf"
            content: |
              [linodes3]
              type = s3
              env_auth = false
              acl = private
              access_key_id = {{ s3_access_token }}
              secret_access_key = {{ s3_secret_token }}
              region = {{ s3_region }}
              endpoint = {{ s3_region }}.linodeobjects.com
    ```

1.  Run the Ansible playbook. The playbook command here adds the variables from the secrets file using the `-e` option, and gets the password for decrypting them from the `--vault-password-file`. The `--ask-become-pass` option has Ansible prompt for the limited user's `sudo` password.

    ```command {title="Ansible Control Node"}
    ansible-playbook -e @s3_secrets.enc --vault-password-file example.pwd --ask-pass --ask-become-pass set_up_rclone.yml
    ```

    The result should resemble:

    ```output
    SSH password:
    BECOME password[defaults to SSH password]:

    PLAY [ansiblenodes] ************************************************************

    TASK [Gathering Facts] *********************************************************
    ok: [192.0.2.2]
    ok: [192.0.2.1]

    TASK [Install rclone] **********************************************************
    changed: [192.0.2.1]
    changed: [192.0.2.2]

    TASK [Create the directory for the rclone configuration] ***********************
    changed: [192.0.2.2]
    changed: [192.0.2.1]

    TASK [Create the rclone configuration file] ************************************
    changed: [192.0.2.2]
    changed: [192.0.2.1]

    PLAY RECAP *********************************************************************
    192.0.2.1              : ok=4    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
    192.0.2.2              : ok=4    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
    ```

1.  To verify that everything is working as expected, log into either of the managed nodes as the non-root user. Then use the following command to list the buckets on your Linode Object Storage instance:

    ```command {title="Ansible Managed Node"}
    rclone lsd linodes3:
    ```

    You should see something like the following for each bucket, where `ansible-test-bucket` is the name of the bucket:

    ``` output
    -1 2022-12-08 00:00:00        -1 ansible-test-bucket
    ```

### Using a Secrets Manager

Dedicated solutions exist for managing secrets, and many password managers are capable of doing so for your Ansible playbooks. In terms of their underlying methods, many of these tools function similarly to Ansible Vault. Despite being external tools, several are supported by official or community plugins for Ansible.

The primary advantage of an external secrets management solution is using a tool already adopted more widely among your team or organization. Ansible Vault may offer a default integration with Ansible, but you are not likely using it more widely for password management within your organization.

One of the more popular solutions for secret management is [HashiCorp's Vault](https://www.vaultproject.io/). HashiCorp's Vault is a centralized secrets management system with a dynamic infrastructure to keep passwords, keys, and other secrets secure.

Ansible maintains a plugin for interacting with HashiCorp's Vault, the [`hashi_vault` plugin](https://docs.ansible.com/ansible/latest/collections/community/hashi_vault/docsite/about_hashi_vault_lookup.html).

The following steps walk you through an example using HashiCorp's Vault with Ansible. The example accomplishes the same ends as the example in the previous section, so you can more easily compare the two.

1.  Follow along with our guide on [Setting Up and Using a Vault Server](/docs/guides/how-to-setup-and-use-a-vault-server/). By the end, you should have HashiCorp's Vault installed, a vault server running and unsealed, and be logged into the vault.

1.  Ensure that the key-value (`kv`) engine is enabled for the `secret` path:

    ```command {title="Vault Server"}
    vault secrets enable -path=secret/ kv
    ```

    ```output
    Success! Enabled the kv secrets engine at: secret/
    ```

1.  Add the access keys for your Linode Object Storage instance to the `secret/s3` path in the vault. Replace the text in arrow brackets below with your corresponding keys:

    ```command {title="Vault Server"}
    vault kv put secret/s3 s3_access_token=<S3_ACCESS_TOKEN> s3_secret_token=<S3_SECRET_TOKEN>
    ```

    ```output
    Success! Data written to: secret/s3
    ```

1.  On your Ansible control node, install `hvac` via `pip` in order to use the `hashi_vault` plugin referenced in the Ansible playbook below.

    ```command {title="Ansible Control Node"}
    pip install hvac
    ```

1.  Create a new Ansible playbook with the contents shown below. This parallels the playbook built in the previous section, which installs and configures `rclone` to connect to a Linode Object Storage instance. This version simply fetches the secrets from a HashiCorp vault instead of an Ansible vault:

    Replace both instances of `<HASHI_VAULT_IP>` below with the IP address for your HashiCorp Vault server. Similarly, replace both instances of `<HASHI_VAULT_TOKEN>` with your login token for the HashiCorp Vault server.

    ```file {title="another_rclone_setup.yml" lang="yml"}
    ---
    - hosts: ansiblenodes
      remote_user: 'example-user'
      become: yes
      become_method: sudo
      vars:
        s3_region: 'us-southeast-1'
      tasks:
        - name: "Install rclone"
          apt:
            pkg:
              - rclone
            state: present
            update_cache: yes
        - name: "Create the directory for the rclone configuration"
          file:
            path: "/home/example-user/.config/rclone"
            state: directory
        - name: "Create the rclone configuration file"
          copy:
            dest: "/home/example-user/.config/rclone/rclone.conf"
            content: |
              [linodes3]
              type = s3
              env_auth = false
              acl = private
              access_key_id = {{ lookup('hashi_vault', 'secret=secret/s3:s3_access_token token=<HASHI_VAULT_TOKEN> url=http://<HASHI_VAULT_IP>:8200')}}
              secret_access_key = {{ lookup('hashi_vault', 'secret=secret/s3:s3_secret_token token=<HASHI_VAULT_TOKEN> url=http://<HASHI_VAULT_IP>:8200')}}
              region = {{ s3_region }}
              endpoint = {{ s3_region }}.linodeobjects.com
    ```

1.  Run the Ansible playbook, providing the appropriate passwords when prompted:

    ```command {title="Ansible Control Node"}
    ansible-playbook --ask-pass --ask-become-pass another_rclone_setup.yml
    ```

    The result should resemble:

    ```output
    SSH password:
    BECOME password[defaults to SSH password]:

    PLAY [ansiblenodes] ********************************************************

    TASK [Gathering Facts] *****************************************************
    ok: [192.0.2.2]
    ok: [192.0.2.1]

    TASK [Install rclone] ******************************************************
    changed: [192.0.2.2]
    changed: [192.0.2.1]

    TASK [Create the directory for the rclone configuration] *******************
    changed: [192.0.2.2]
    changed: [192.0.2.1]

    TASK [Create the rclone configuration file] ********************************
    changed: [192.0.2.1]
    changed: [192.0.2.2]

    PLAY RECAP *****************************************************************
    192.0.2.1              : ok=4    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
    192.0.2.2              : ok=4    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
    ```

1.  Just like the previous section, you can verify the setup by logging into one of the managed nodes and running an rclone `ls` command, such as `rclone lsd linodes3:`.

## Conclusion

You now have some options to ensure that your Ansible setup has secure secrets. Choosing between these options comes down to scale and accessibility. Manual entry is simple to start with, but only suits smaller projects and teams. Ansible Vault is in many ways ideal, but an external solution may better fit your team and organization.

To keep learning about Ansible and efficiently automating your server tasks, read more of our [guides on Ansible](/docs/guides/applications/configuration-management/ansible/).
