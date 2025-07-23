terraform {
  required_providers {
    linode = {
      source  = "linode/linode"
      version = "3.0.0"
    }
  }
}

provider "linode" {
  token = "191ad570c7a19f0ba4cb67edadb9d897208ea3f77ce1803848330aa7e54ec057"
}

resource "linode_instance" "terraform-web" {
  image           = "linode/ubuntu24.04"
  label           = "Terraform-Web-Example"
  group           = "Terraform"
  region          = "us-east"
  type            = "g6-standard-1"
  authorized_keys = [ "YOUR_PUBLIC_SSH_KEY" ]
  root_pass       = "YOUR_ROOT_PASSWORD"
}