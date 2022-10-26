variable "token" {
  description = "The Linode API Personal Access Token."
}

variable "ssh_key" {
  description = "The local file SSH key file for tranferring to each node."
  default = "~/.ssh/id_rsa.pub"
}

variable "password" {
  description = "The root password for the nodes."
}

variable "node_count" {
  description = "The number of nodes to create."
  default = 1
}

variable "regions" {
  description = "The region names for the nodes."
  default = ["us-southeast"]
}

