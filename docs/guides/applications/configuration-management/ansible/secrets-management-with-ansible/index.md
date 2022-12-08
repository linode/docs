---
slug: secrets-management-with-ansible
author:
  name: Linode Community
  email: docs@linode.com
description: "Ansible is a powerful tool for automating server provisioning and management. But these tasks often require secrets like passwords and access tokens. To keep your secrets secure, you should implement secrets management with Ansible. Learn how to choose the best secrets management solution for your needs and how to get started using it with Ansible in this tutorial."
og_description: "Ansible is a powerful tool for automating server provisioning and management. But these tasks often require secrets like passwords and access tokens. To keep your secrets secure, you should implement secrets management with Ansible. Learn how to choose the best secrets management solution for your needs and how to get started using it with Ansible in this tutorial."
keywords: ['ansible secrets manager','ansible vault tutorial','ansible secrets best practices']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-12-08
modified_by:
  name: Nathaniel Stickman
title: "Secrets Management with Ansible"
h1_title: "Secrets Management with Ansible"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Red Hat - Enable Sysadmin: Handling Secrets in Your Ansible Playbooks](https://www.redhat.com/sysadmin/ansible-playbooks-secrets)'
- '[Ansible Documentation: Protecting Sensitive Data with Ansible Vault](https://docs.ansible.com/ansible/latest/vault_guide/index.html)'
---

Ansible stands out for its capabilities in automating server provisioning and management. The structure of Ansible's playbooks, its ability to group and organize resources, and a host of other features make it strong asset.

But Ansible's operations often necessitate that you playbooks leverage secrets like server passwords, access tokens, and API keys.

To bring security to the convenience of your Ansible setup, you should be employing a secrets management process. A secrets management solution continues to let Ansible operate in automating your server tasks, with all the access it needs. At the same time, secrets management keeps your secrets safely out of plain-text files and other vulnerable locations.

In this tutorial, learn the most useful methods for implementing secrets management with your Ansible setup. The tutorial covers a range of methods, from the simple to the robust, and helps you compare them to choose the right fit.

## Before You Begin

1. If you have not already done so, create a Linode account. See our [Getting Started with Linode](/docs/guides/getting-started/) guide.

1. Follow our guide on [Getting Started With Ansible: Basic Installation and Setup](/docs/guides/getting-started-with-ansible/). Specifically, follow the sections on setting up a control node, configuring Ansible, and creating an Ansible inventory.

1. Ensure that you create enough instances to have one as an Ansible control node and the rest as Ansible managed nodes. For examples, this tutorial assumes three nodes, one control and two managed. The examples assume the managed nodes are listed in the Ansible inventory file under the group name `ansiblenodes`.

1. Refer to our guide [Automate Server Configuration with Ansible Playbooks](/docs/guides/running-ansible-playbooks/) for an overview of Ansible playbooks and their operations.

## Secrets in Ansible

First, a secret here refers to a key or other credential that allows access to a resource or a system. Secrets include things like access tokens, API keys, and also database and system passwords.

Often when managing nodes with Ansible you need to provide it with secrets. You can provide these secrets within your Ansible playbooks, but doing so exposes the secrets to possible interception and exploitation.

To secure your secrets, you should implement secret management with your Ansible playbooks. Secret management refers to the ways in which you can keep secrets stored safely, with storage methods balancing between accessibility and security.

## Managing Secrets in Ansible

Several options exist for managing secrets with your Ansible playbooks. The option that fits your needs depends on your setup. How accessible you need your secrets to be and how secure you want to make them determine which solutions work best for you.

The upcoming sections outline some of the most useful options for managing secrets with Ansible. These attempt to cover a range of use cases as well, from interactive and manual to automated and integrated.

### Using Prompts to Manually Enter Secrets

Ansible playbooks include the option to prompt users for variables. And this is actually an option for managing secrets within your Ansible setup.

With this option, you configure your Ansible playbook to prompt users to manually input secrets. The secrets never need to be persisted on the system, allowing you to safeguard them otherwise. And the setup is the easiest of all of the options covered here.

Of course, this option comes with some significant drawbacks. By not storing the secrets, you also prevent Ansible from accessing them automatically. Additionally, leaving the secrets to manual entry introduces its own risks, as users can mishandle secrets.

For these reasons this option is best when:

- You are manually running Ansible playbooks

- You are only using the playbooks within a small team

Here is an example Ansible playbook developed from one in our [Automate Server Configuration with Ansible Playbooks](/docs/guides/running-ansible-playbooks/) guide. This playbook adds a new non-root user to the managed nodes.

The playbook uses the `vars_prompt` option to prompt for user input. In this case, the user must input a password for the new user, effectively safeguarding the secret.

Be aware that this playbook assumes you have already created an SSH public key on your control node. Learn more in our guide [Using SSH Public Key Authentication](/docs/guides/use-public-key-authentication-with-ssh/).

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

To run the playbook, make sure you are in the same directory as the playbook, then execute the following command:

```command
ansible-playbook --ask-pass add_limited_user.yml
```

The result should resemble what is shown here. The playbook prompts first for the password for SSH access, then it prompts the user for a password for the new users to be created.

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

Ansible has its own tool that can facilitate secrets management, Ansible Vault. The Vault encrypts information, which you can then use within your Ansible playbooks.

Ansible requires the Vault password to decrypt information, and it provides two ways to supply passwords. Ansible can prompt the user for manual password entry, or you can point Ansible to a password file.

With some setup, Ansible Vault can make secrets both secure and accessible. Secrets are encrypted, meaning that no one can get to them without your password. The secrets are, at the same time, made accessible to Ansible. A password file can give Ansible everything it needs to run in an automated setup.

A password file may not provide the level of security you need. However, you can alternatively use an external password manager, implementing a script or other solution to retrieve the password.

What follows is an example usage of Ansible Vault. This example deploys [rclone](https://rclone.org/) to the managed nodes and configures it to connect to a Linode Object Storage instance. The secrets are the access keys for the object storage instance.

To follow along, you need to set up a Linode Object Storage instance with access keys and at least one bucket. You can learn how to do both through our guide [Object Storage - Get Started](/docs/products/storage/object-storage/get-started/).

1. Create a file with your secrets — the access keys for your Linode Object Storage instance. You can do so with a command like the following, replacing the text in arrow brackets with your corresponding object storage key:

    ```command
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

1. Create a new Ansible playbook with the following contents. This playbook connects to the non-root users created using the playbook in the previous section of this tutorial. The playbook then installs rclone and creates a configuration file for it. Into the configuration file, the playbook inserts the access keys from the `s3_secrets.enc` file:

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

1. Run the Ansible playbook. The playbook command here adds the variables from the secrets file using the `-e` option. The command also has Ansible prompt the user for the vault password. The `--ask-become-pass` has Ansible prompt for the limited user's `sudo` password as well:

    ```command
    ansible-playbook -e @s3_secrets.enc --ask-vault-pass --ask-pass --ask-become-pass set_up_rclone.yml
    ```

    The result should resemble:

    ```output
    SSH password:
    BECOME password[defaults to SSH password]:
    Vault password:

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

1. To verify that everything is working as expected, log into either of the managed nodes as the non-root user. Then use the following command to list the buckets on your Linode Object Storage instance:

    ```command
    rclone lsd linodes3:
    ```

    You should see something like the following for each bucket, where `ansible-test-bucket` would be the name of the bucket:

    ``` output
    -1 2022-12-08 00:00:00        -1 ansible-test-bucket
    ```

### Using a Secrets Manager

Dedicated solutions exist for managing secrets, with many password managers capable of doing so for your Ansible playbooks. In terms of their underlying methods, many of these tools function similarly to Ansible Vault. And despite being external tools, community plugins for Ansible exist to support several of these tools.

The primary advantage of an external secrets management solution is using a tool already adopted more widely among your team and/or organization. Ansible Vault may offer a default integration with Ansible, but likely you are not using it more widely for password management within your team/organization.

One of the more popular solutions for secret management is [HashiCorp's Vault](https://www.vaultproject.io/). HashiCorp's Vault is a centralized secrets management system with a dynamic infrastructure to keep passwords, keys, and other secrets secure.

And Ansible maintains a plugin for interacting with HashiCorp's Vault, the [`hashi_vault` plugin](https://docs.ansible.com/ansible/latest/collections/community/hashi_vault/docsite/about_hashi_vault_lookup.html).

These following steps walk through an example using HashiCorp's Vault with Ansible. The example itself is similar to the one in the previous section, which may be helpful in contrasting the differences between the two approaches.

1. Follow along with our guide on [Setting Up and Using a Vault Server](/docs/guides/how-to-setup-and-use-a-vault-server/). You should have HashiCorp's Vault installed, a vault server running and unsealed, and be logged into the vault.

1. Ensure that the key-value (`kv`) engine is enabled for the `secret` path:

    ```command
    vault secrets enable -path=secret/ kv
    ```

    ```output
    Success! Enabled the kv secrets engine at: secret/
    ```

1. Add the access keys for your Linode Object Storage instance to the `secret/s3` path in the vault. Replace the text in arrow brackets below with your corresponding keys:

    ```command
    vault kv put secret/s3 s3_access_token=<S3_ACCESS_TOKEN> s3_secret_token=<S3_SECRET_TOKEN>
    ```

    ```output
    Success! Data written to: secret/s3
    ```

1. Create a new Ansible playbook with the contents shown below. This parallels the playbook built in the previous section, installing and configuring rclone for connecting to a Linode Object Storage instance. The version here just fetches the secrets from the HashiCorp Vault:

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
              access_key_id = {{ lookup('hashi_vault', 'secret=secret/s3:s3_access_token token=s.w28zmL3Dmab1IJRt18ZWBq4j url=http://45.79.205.185:8200')}}
              secret_access_key = {{ lookup('hashi_vault', 'secret=secret/s3:s3_secret_token token=s.w28zmL3Dmab1IJRt18ZWBq4j url=http://45.79.205.185:8200')}}
              region = {{ s3_region }}
              endpoint = {{ s3_region }}.linodeobjects.com
    ```

1. Run the Ansible playbook, providing the appropriate passwords when prompted:

    ```command
    ansible-playbook --ask-pass --ask-become-pass another_rclone_setup.yml
    ```

    The result should resemble:

    ```output
    SSH password:
    BECOME password[defaults to SSH password]:

    PLAY [ansiblenodes] ********************************************************

    TASK [Gathering Facts] ********************************************************************************
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

1. Just as in the previous section, you can verify the setup with one of the rclone `ls` commands, such as `rclone lsd linodes3:`.

## Conclusion

You now have some options to implement to ensure that your Ansible setup has its secrets secured. Choosing between these options really comes down to scale and accessibility. Manual entry is only feasible for smaller projects and teams. Ansible Vault is in many ways ideal, but an external solution may better fit into your team and organization.

Keep learning about Ansible and efficiently automating your server tasks by reading through more of our [guides on Ansible](/docs/guides/applications/configuration-management/ansible/).
