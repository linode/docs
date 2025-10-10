variable "token" {
  description = "The Linode API Personal Access Token."
}

variable "ssh_key" {
  description = "The local file SSH key file for tranferring to each node."
  default = "~/.ssh/id_rsa.pub"
}

variable "password" {
  description = "The root password for each node."
}

variable "regions" {
  description = "The region names for the nodes. The script current requires two and only two names here."
  default = ["us-southeast", "ca-central"]
}

variable "node_count" {
  description = "The number of nodes to create within each region."
  default = 2
}

