terraform {
    required_providers {
        linode = {
            source = "linode/linode"
            version = "1.29.4"
        }
        tls = {
            source  = "hashicorp/tls"
            version = "3.0.0"
        }
    }
}

provider "linode" {
    token = var.api_token
}

provider "tls" {}

resource "tls_private_key" "ssh" {
  algorithm = "RSA"
  rsa_bits  = "4096"
}

resource "local_file" "private_key_file" {
    content = tls_private_key.ssh.private_key_pem
    filename = "documents/cbdms-app-private-key.pem"
    file_permission = "0600"
}

resource "linode_object_storage_bucket" "cbdms_storage_node" {
    access_key = var.storage_key
    secret_key = var.storage_secret

    cluster = "${var.region}-1"
    label = "cbdms-object-storage"
}

resource "linode_instance" "cbdms_data_nodes" {
    count = var.node_count
    image = var.node_image
    label = "cbdms-data-node-${count.index + 1}"
    group = "cbdms-nodes"
    region = var.region
    type = "g6-standard-1"
    authorized_keys = [ chomp(file(var.ssh_key)) ]
    root_pass = var.root_password
    private_ip = true

    interface {
        purpose = "public"
    }

    interface {
        purpose = "vlan"
        label = "vlan-${var.region}-1"
        ipam_address = "10.8.0.${count.index + 1 + var.node_count}/24"
    }

    connection {
        type = "ssh"
        user = "root"
        password = var.root_password
        host = self.ip_address
    }

    provisioner "remote-exec" {
        inline = [
            # Ubuntu 22.04 prompts the user by default when daemons need to be
            # restarted following an update/upgrade/installation. Use this command
            # to have Ubuntu only list the services instead.
            #
            # Comment out this line if you are not standing up Ubuntu 22.04.
            #"echo \"\\$nrconf{restart} = 'l'\" >> /etc/needrestart/needrestart.conf",

            # Update the system.
            "apt-get update -qq",

            # Harden SSH security.
            "sed -i -e '/PasswordAuthentication/d' /etc/ssh/sshd_config",
            "echo \"PasswordAuthentication no\" >> /etc/ssh/sshd_config",

            # Restart the SSH daemon.
            #"systemctl restart sshd"
        ]
    }

    provisioner "file" {
        source = "documents/cbdms-data-backup.sh"
        destination = "/usr/local/bin/cbdms-data-backup.sh"
    }

    provisioner "file" {
        source = "documents/postgres_exporter.service"
        destination = "/etc/systemd/system/postgres_exporter.service"
    }

    provisioner "file" {
        source = "scripts/cbdms-data-node.sh"
        destination = "/tmp/cbdms-data-node.sh"
    }

    provisioner "file" {
        source = "scripts/cbdms-data-afterward.sh"
        destination = "/tmp/cbdms-data-afterward.sh"
    }

    provisioner "remote-exec" {
        inline = [
            # Add executable permission to the script, the execute it.
            "chmod +x /tmp/cbdms-data-node.sh",
            "/tmp/cbdms-data-node.sh ${count.index + 1 + var.node_count} ${var.storage_key} ${var.storage_secret} ${var.region}"
        ]
    }
}

resource "linode_instance" "cbdms_app_nodes" {
    count = var.node_count
    image = var.node_image
    label = "cbdms-app-node-${count.index + 1}"
    group = "cbdms-nodes"
    region = var.region
    type = "g6-standard-1"
    authorized_keys = [ chomp(file(var.ssh_key)), chomp(tls_private_key.ssh.public_key_openssh) ]
    root_pass = var.root_password
    private_ip = true

    depends_on = [linode_instance.cbdms_data_nodes, linode_object_storage_bucket.cbdms_storage_node]

    interface {
        purpose = "public"
    }

    interface {
        purpose = "vlan"
        label = "vlan-${var.region}-1"
        ipam_address = "10.8.0.${count.index + 1}/24"
    }

    connection {
        type = "ssh"
        user = "root"
        password = var.root_password
        host = self.ip_address
    }

    provisioner "remote-exec" {
        inline = [
            # Ubuntu 22.04 prompts the user by default when daemons need to be
            # restarted following an update/upgrade/installation. Use this command
            # to have Ubuntu only list the services instead.
            #
            # Comment out this line if you are not standing up Ubuntu 22.04.
            #"echo \"\\$nrconf{restart} = 'l'\" >> /etc/needrestart/needrestart.conf",

            # Update the system.
            "apt-get update -qq",

            # Harden SSH security.
            "sed -i -e '/PasswordAuthentication/d' /etc/ssh/sshd_config",
            "echo \"PasswordAuthentication no\" >> /etc/ssh/sshd_config",

            # Make directories for the files to be delivered.
            "mkdir -p /root/.ssh",
            "mkdir -p /etc/nginx/sites-available",
            "mkdir -p /root/.unison",

            # Restart the SSH daemon.
            #"systemctl restart sshd"
        ]
    }

    provisioner "file" {
        source = "documents/cbdms-app-private-key.pem"
        destination = "/root/.ssh/id_rsa"
    }

    provisioner "file" {
        source = "documents/cbdms-app.conf"
        destination = "/etc/nginx/sites-available/cbdms-app.conf"
    }

    provisioner "file" {
        source = "documents/cbdms-app-unison.prf"
        destination = "/root/.unison/cbdms-app-unison.prf"
    }

    provisioner "file" {
        source = "documents/cbdms_unison.service"
        destination = "/etc/systemd/system/cbdms_unison.service"
    }

    provisioner "file" {
        source = "documents/node_exporter.service"
        destination = "/etc/systemd/system/node_exporter.service"
    }

    provisioner "file" {
        source = "scripts/cbdms-app-node.sh"
        destination = "/tmp/cbdms-app-node.sh"
    }

    provisioner "remote-exec" {
        inline = [
            # Add executable permission to the script, the execute it.
            "chmod +x /tmp/cbdms-app-node.sh",
            "/tmp/cbdms-app-node.sh ${var.storage_key} ${var.storage_secret} ${var.region} ${var.domain_name} ${var.api_token} ${var.webmaster_email} ${count.index + 1}"
        ]
    }
}

resource "null_resource" "cbdms_post_script" {
    depends_on = [linode_instance.cbdms_data_nodes, linode_instance.cbdms_app_nodes]

    connection {
        type = "ssh"
        user = "root"
        password = var.root_password
        host = linode_instance.cbdms_data_nodes[0].ip_address
    }

    provisioner "remote-exec" {
        inline = [
            # Add executable permission to the script, the execute it.
            "chmod +x /tmp/cbdms-data-afterward.sh",
            "/tmp/cbdms-data-afterward.sh"
        ]
    }
}
