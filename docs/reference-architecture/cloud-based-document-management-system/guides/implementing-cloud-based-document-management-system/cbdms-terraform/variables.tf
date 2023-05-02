variable "api_token" {
    description = "The Linode API Personal Access Token."
}

variable storage_key {
    description = "The access key for the Linode Object Storage instance."
}

variable storage_secret {
    description = "The secrete key for the Linode Object Storage instance."
}

variable "region" {
    description = "The region name for the Linode."
}

variable "node_count" {
    description = "The amount of backend Nodes to create."
    default = 2
}

variable "ssh_key" {
    description = "The local file SSH key file for tranferring to each Linode instance."
    default = "~/.ssh/id_rsa.pub"
}

variable "root_password" {
    description = "The root password for the server."
}

variable "node_image" {
    description = "The Linode image to use for the instance."
    default = "linode/ubuntu20.04"
}

variable "domain_name" {
    description = "The domain name to be associated with the application and used for SSL certification."
}

variable "webmaster_email" {
    description = "The webmaster's email address, used for the SSL certification."
}
