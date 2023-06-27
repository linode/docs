---
slug: test-salt-locally-with-kitchen-salt
description: 'This guide provides you with instructions for testing Salt states locally with Kitchen and kitchen-salt, utilities that let you test without a salt master or minions.'
keywords: ['saltstack','salt','kitchen','kitchen-salt','kitchensalt','salt solo','saltsolo']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-10-15
modified: 2019-01-02
modified_by:
  name: Linode
image: TestSaltStatesLocallywithKitchenSalt.png
title: "Test Salt States Locally with KitchenSalt"
external_resources:
- '[KitchenSalt Documentation](https://kitchen.saltproject.io/docs/file/README.rdoc)'
- '[Kitchen Documentation](https://docs.chef.io/kitchen.html)'
- '[Salt Formulas](https://docs.saltproject.io/en/latest/topics/development/conventions/formulas.html)'
- '[Writing a Test](https://kitchen.ci/docs/getting-started/writing-test/)'
- '[Sample Pytest tests](https://github.com/gtmanfred/wordpress-formula/tree/master/tests/integration)'
aliases: ['/applications/configuration-management/test-salt-locally-with-kitchen-salt/','/applications/configuration-management/salt/test-salt-locally-with-kitchen-salt/']
tags: ["automation","salt"]
authors: ["Linode"]
---

KitchenSalt allows you to use Test Kitchen to test your Salt configurations locally without a Salt master or minions. In this guide you will install KitchenSalt and use Docker to test a Salt state. This guide was created using a system running Ubuntu 18.04.

## Before You Begin

- You will need root access to your computer, or a user account with `sudo` privilege. For more information on privileges, see our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
- [Install Git](/docs/guides/how-to-install-git-on-linux-mac-and-windows/) on your local computer, if it is not already installed.
- Update your system packages.

## Install rbenv and Ruby

Kitchen runs on Ruby. The following commands will install the Ruby version controller rbenv, set rbenv in your PATH, and install Ruby via rbenv.

1.  Install the packages necessary for rbenv:

        sudo apt install libssl-dev libreadline-dev zlib1g-dev bzip2 gcc make git ruby-dev

2.  Clone the rbenv git repository and set up your PATH:

        sudo git clone git://github.com/rbenv/rbenv.git /usr/local/rbenv
        sudo mkdir /usr/local/rbenv/plugins
        sudo git clone git://github.com/rbenv/ruby-build.git /usr/local/rbenv/plugins/ruby-build
        sudo tee /etc/profile.d/rbenv.sh <<< 'export PATH="/usr/local/rbenv/plugins/ruby-build/bin:/usr/local/rbenv/bin:$PATH"'
        sudo tee -a /etc/profile.d/rbenv.sh <<< 'source <(rbenv init -)'

3.  Reload your system's profile so that the rbenv commands are added to your `PATH`:

        source /etc/profile

    You can also restart your shell session so the `PATH` changes take effect.

4.  Install Ruby:

        rbenv install 2.5.1

## Install Docker

{{< content "installing-docker-shortguide" >}}

## Install KitchenSalt

1. Install the bundler gem:

        sudo gem install bundler

2.  Create a Gemfile in your working directory and add the `kitchen-salt`, `kitchen-docker`, and `kitchen-sync` gems:

    {{< file "Gemfile" ruby>}}
#Gemfile
source 'https://rubygems.org'

gem 'kitchen-salt'
gem 'kitchen-docker'
gem 'kitchen-sync'
{{< /file >}}

    `kitchen-sync` is used to copy files to Docker containers more quickly.

1.  Install the gems with bundler:

        sudo bundle install

## Create a Sample .sls File

For testing purposes, create a Salt state file that installs NGINX and ensures that it is running. In a text editor, create an `nginx.sls` file in your working directory and add the following lines:

{{< file "nginx.sls" yaml >}}
nginx:
  pkg:
    - installed
  service.running:
    - enable: True
    - reload: True
    - watch:
      - pkg: nginx
{{< /file >}}

## Configure kitchen.yml

1.  Now, write the Kitchen configuration file, beginning with the **provisioner** section. Copy the following lines into a `kitchen.yml` file in your working directory.

    {{< file "kitchen.yml" yaml >}}
provisioner:
  name: salt_solo
  salt_install: bootstrap
  is_file_root: true
  require_chef: false
  state_top:
    base:
      "*":
        - nginx

...
{{< /file >}}

    This section defines `salt_solo` as the provisioner, which will allow Kitchen to use Salt without a Salt master. In this section Salt is installed via the bootstrap script by setting `salt_install: bootstrap`, the Salt file root is mapped to the directory where `.kitchen.yml` is located by setting `is_file_root: true`, and Chef is disabled by setting `require_chef: false`. Instead of providing a top file for Salt states, the top file is declared inline. This section is also where Salt pillar files are added. For reference, they are added under the **provisioner** block:

    {{< file "kitchen.yml" yaml >}}
provisioner:
...
  pillars:
    top.sls:
      base:
        "*":
          - nginx_pillar
  pillars_from_files:
    nginx_pillar.sls: nginx.pillar
{{< /file >}}

1.  Next, configure the **driver** section:

    {{< file "kitchen.yml" yaml >}}
...

driver:
  name: docker
  user_sudo: false
  privileged: true
  forward:
    - 80

...
{{< /file >}}

    This section declares Docker as the driver, though you could also use Vagrant. Kitchen does not need to use `sudo` to build the Docker containers, so `user_sudo` is set to `false`. `privileged` is set to `true` to ensure that the containers run systemd as the exec command. The Docker container will `forward` traffic to the host on port `80`.

1.  Configure the **platforms** section:

    {{< file "kitchen.yml" yaml >}}
...

platforms:
  - name: ubuntu
    driver_config:
      run_command: /lib/systemd/systemd

...
{{< /file >}}

    This section defines which platform Docker will run. By default Docker will run the latest version of that platform. Because different platforms place systemd in different locations, the `driver_config` section is used to point to the systemd install path of that platform. More than one platform can be defined.

1.  Configure the **suites** section:

    {{< file "kitchen.yml" yaml >}}
...

suites:
  - name: oxygen
    provisioner:
      salt_bootstrap_options: -X -p git stable 2018.3

...
{{< /file >}}

    `suites` defines which software suite Kitchen will test against. In this context, Kitchen will test against the Oxygen release of Salt. More than one suite can be defined.

1.  Lastly, the **transport** section allows us to specify the use of `kitchen-sync` for transferring files:

    {{< file "kitchen.yml" yaml >}}
...

transport:
  name: sftp
{{< /file >}}

1.  You can now test your Salt configuration with Kitchen. Type the following command to run the test:

        kitchen test

    This command will create, converge, and then destroy the test instance. If completed successfully, the final terminal output will be:

    {{< output >}}
-----> Kitchen is finished. (13m32.13s)
{{< /output >}}

    For a more granular approach to running your test, you can use the individual commands in series:

        kitchen list
        kitchen create
        kitchen converge
        kitchen destroy

## Using a Verifier and Next Steps

Though it is beyond the scope of this article, Kitchen allows for more robust testing than just checking a Salt configuration. You can write tests in bash using Bats, in Ruby using Minitest, Rspec, Serverspec and Inspec, or if you're more familiar with Python you can use pytest.

As an example, you can add the following code to your `kitchen.yaml` to verify your tests using the Inspec gem:

{{< file "kitchen.yml" yaml >}}
...

verifier:
  name: inspec
{{< /file >}}

For more information on writing tests, visit the links in the More Information section below.
