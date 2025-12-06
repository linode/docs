# Terraform Provider for Linode

[![Release](https://img.shields.io/github/v/release/linode/terraform-provider-linode)](https://github.com/linode/terraform-provider-linode/releases/latest)
[![GoDoc](https://godoc.org/github.com/linode/terraform-provider-linode?status.svg)](https://godoc.org/github.com/linode/terraform-provider-linode)
[![Go Report Card](https://goreportcard.com/badge/github.com/linode/terraform-provider-linode)](https://goreportcard.com/report/github.com/linode/terraform-provider-linode)
[![Gitter chat](https://badges.gitter.im/hashicorp-terraform/Lobby.png)](https://gitter.im/hashicorp-terraform/Lobby)


- Website: <https://www.terraform.io>
- Documentation: <https://www.terraform.io/docs/providers/linode/index.html>
- Mailing list: [Google Groups](http://groups.google.com/group/terraform-tool)

<img src="https://raw.githubusercontent.com/hashicorp/terraform-website/master/public/img/logo-hashicorp.svg" width="600px">

## Maintainers

This provider plugin is maintained by Linode.

## Requirements

- [Terraform](https://www.terraform.io/downloads.html) 1.0.0+
- [Go](https://golang.org/doc/install) 1.23.0 or higher (to build the provider plugin)

## Using the provider

See the [Linode Provider documentation](https://www.terraform.io/docs/providers/linode/index.html) to get started using the Linode provider.  The [examples](https://github.com/linode/terraform-provider-linode/tree/main/examples) included in this repository demonstrate usage of many of the Linode provider resources.

Additional documentation and examples are provided in the Linode Guide, [Using Terraform to Provision Linode Environments](https://linode.com/docs/platform/how-to-build-your-infrastructure-using-terraform-and-linode/).

## Development

### Building the provider

If you wish to build or contribute code to the provider, you'll first need [Git](https://git-scm.com/downloads) and [Go](http://www.golang.org) installed on your machine (version 1.11+ is *required*).

You'll also need to correctly configure a [GOPATH](http://golang.org/doc/code.html#GOPATH), as well as adding `$GOPATH/bin` to your `$PATH`.

To compile the provider, run `make`. This will build the provider and put the provider binary in the `$GOPATH/bin` directory.

Clone this repository to: `$GOPATH/src/github.com/linode/terraform-provider-linode`

```sh
mkdir -p $GOPATH/src/github.com/linode
cd $GOPATH/src/github.com/linode
git clone https://github.com/linode/terraform-provider-linode.git
```

Enter the provider directory and build the provider

```sh
cd $GOPATH/src/github.com/linode/terraform-provider-linode
make
```

### Testing the provider

In order to run the full suite of Acceptance tests, run `make test-int`. Acceptance testing will require the `LINODE_TOKEN` variable to be populated with a Linode APIv4 Token.  See [Linode Provider documentation](https://www.terraform.io/docs/providers/linode/index.html) for more details.

*Note:* Acceptance tests create real resources, and often cost money to run.

```sh
make test-int
```

Use the following command template to execute specific Acceptance test, 

```shell
# PKG_NAME is the directory in linode/ that contains the corresponding TEST_CASE
make PKG_NAME="volume" TEST_CASE="TestAccResourceVolume_basic" test-int
```

Use the following command template to execute particular Acceptance tests within a specific package

```shell
make TEST_SUITE="volume" test-int
```

There are a number of useful flags and variables to aid in debugging.

- `TF_LOG_PROVIDER` - This instructs Terraform to emit provider logging messages at the given level.

- `TF_LOG` - This instructs Terraform to emit logging messages at the given level.

- `TF_LOG_PROVIDER_LINODE_REQUESTS` - This instructs terraform-provider-linode to output API request logs at the given level.

- `TF_SCHEMA_PANIC_ON_ERROR` - This forces Terraform to panic if a Schema Set command failed.

These values (along with `LINODE_TOKEN`) can be placed in a `.env` file in the repository root to avoid repeating them on the command line.

To filter down to logs relevant to the Linode provider, the following command can be used:

```bash
terraform apply 2> >(grep '@module=linode' >&2)
```
