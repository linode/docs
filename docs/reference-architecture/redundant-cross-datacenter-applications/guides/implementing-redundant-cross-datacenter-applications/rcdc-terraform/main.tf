terraform {
  required_providers {
    linode = {
      source = "linode/linode"
      version = "1.29.3"
    }
  }
}

provider "linode" {
  token = var.token
}

# ---
# Gateway Instances
# ---
resource "linode_instance" "rcdc_gateway" {
  count = 2
  image = "linode/ubuntu20.04"
  label = "rcdc-gateway-${var.regions[count.index]}"
  group = "rcdc-instances"
  region = var.regions[count.index]
  type = "g6-standard-1"
  authorized_keys = [ chomp(file(var.ssh_key)) ]
  root_pass = var.password

  interface {
    purpose = "public"
  }

  interface {
    purpose = "vlan"
    label = "vlan-${var.regions[count.index]}-1"
    ipam_address = "10.8.${count.index}.2/24"
  }

  connection {
    type = "ssh"
    user = "root"
    password = var.password
    host = self.ip_address
  }

  provisioner "remote-exec" {
    inline = [
    # Create a directory for NGINX websites.
      "mkdir -p /etc/nginx/sites-available"
    ]
  }

  provisioner "file" {
    source = "documents/rcdc-gateway-${count.index + 1}-nginx.conf"
    destination = "/etc/nginx/sites-available/rcdc-gateway.conf"
  }

  provisioner "file" {
    source = "scripts/rcdc-gateway-network.sh"
    destination = "/tmp/rcdc-gateway-network.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /tmp/rcdc-gateway-network.sh",
      "/tmp/rcdc-gateway-network.sh ${count.index} ${ count.index == 0 ? 1 : 0 }"
    ]
  }
}

resource "linode_instance" "rcdc_application" {
  count = var.node_count * length(var.regions)
  image = "linode/ubuntu20.04"
  label = "rcdc-application-${count.index + 1}"
  group = "rcdca-instances"
  region = var.regions[floor(count.index / length(var.regions))]
  type = "g6-standard-1"
  root_pass = var.password

  depends_on = [linode_instance.rcdc_gateway]

  interface {
    purpose = "vlan"
    label = "vlan-${var.regions[floor(count.index / length(var.regions))]}-1"
    ipam_address = "10.8.${floor(count.index / length(var.regions))}.${count.index + 11}/24"
  }

  connection {
     type = "ssh"
     user = "root"
     password = var.password
     host = "10.8.${floor(count.index / length(var.regions))}.${count.index + 11}"
     bastion_host = linode_instance.rcdc_gateway[floor(count.index / length(var.regions))].ip_address
     #bastion_host_key = chomp(file(var.ssh_key))
     bastion_user = "root"
     bastion_password = var.password
  }

  provisioner "remote-exec" {
    inline = [
      # Create a directory for the Mongo keyfile.
      "mkdir -p /opt/mongo"
    ]
  }

  provisioner "file" {
    source = "documents/mongo-keyfile"
    destination = "/opt/mongo/mongo-keyfile"
  }

  provisioner "file" {
    source = "documents/mongo-init-replication.js"
    destination = "/tmp/mongo-init-replication.js"
  }

  provisioner "file" {
    source = "documents/example-app"
    destination = "/usr/local"
  }

  provisioner "file" {
    source = "documents/example-app.service"
    destination = "/lib/systemd/system/example-app.service"
  }

  provisioner "file" {
    source = "scripts/rcdc-node-network.sh"
    destination = "/tmp/rcdc-node-network.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "sed -i 's/MONGODB_ADMIN_PASSWORD/${var.password}/' /tmp/rcdc-node-network.sh",
      "sed -i 's/NODE_NUMBER/${count.index + 1}/' /usr/local/example-app/index.js",
      "sed -i 's/MONGODB_ADMIN_PASSWORD/${var.password}/' /usr/local/example-app/index.js",

      "chmod +x /tmp/rcdc-node-network.sh",
      "/tmp/rcdc-node-network.sh ${floor(count.index / length(var.regions))} ${count.index + 1}"
    ]
  }
}
