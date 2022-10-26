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

resource "linode_instance" "rcdc_datacenter" {
  count = var.node_count
  image = "linode/ubuntu20.04"
  label = "rcdc-datacenter-${count.index + 1}"
  group = "rcdca-servers"
  region = var.regions[count.index]
  type = "g6-standard-1"
  authorized_keys = [ chomp(file(var.ssh_key)) ]
  root_pass = var.password

  connection {
      type = "ssh"
      user = "root"
      password = var.password
      host = self.ip_address
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
    source = "documents/example-app"
    destination = "/usr/local"
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

      # Disable password authentication; users can only connect with an SSH key.
      "echo \"PasswordAuthentication no\" >> /etc/ssh/sshd_config",

      # Install Wireguard and give it an initial configuration.
      "apt-get install -qq wireguard",
      "wg genkey | tee /etc/wireguard/private.key",
      "chmod go= /etc/wireguard/private.key",
      "cat /etc/wireguard/private.key | wg pubkey | tee /etc/wireguard/public.key",

      # The private IPv6 address below came from the following command:
      #     echo $(date +%s%N)$(cat /var/lib/dbus/machine-id) | sha1sum | cut -c 31-
      # In this case, and output of 1a6ba5f089 was fit to the fd00::/8 range
      # reserved for private IPv6 addresses.
      "cat > /etc/wireguard/wg0.conf <<EOF",
      "[Interface]",
      "PrivateKey = $(cat /etc/wireguard/private.key)",
      "Address = 10.3.0.${count.index + 1}/24",
      "ListenPort = 51820",
      "PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE; ip6tables -A FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -A POSTROUTING -o eth0 -j MASQUERADE",
      "PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE; ip6tables -D FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -D POSTROUTING -o eth0 -j MASQUERADE",
      "SaveConfig = true",
      "EOF",

      # Open the necessary ports.
      "ufw allow 22/tcp",
      "ufw allow OpenSSH",
      "ufw allow 3001",
      "ufw allow 51820/udp",
      "ufw allow 27017/tcp",
      "ufw --force enable",
      "ufw reload",

      # Activate Wireguard.
      "wg-quick up wg0",
      "systemctl enable wg-quick@wg0",

      # Install NPM.
      "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash",
      "source ~/.bashrc",
      "nvm install node",

      # Set up the example application.
      "cd /usr/local/example-app",
      "npm install",
      "sed -i \"s/<MONGODB_ADMIN_PASSWORD>/${var.mongodb_admin_password}/\" index.js",
      "cd ~/",

      # Install MongoDB.
      "wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -",
      "echo \"deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse\" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list",
      "apt-get update -qq",
      "apt-get install -qq mongodb-org",

      # Adjust the permissions for the MongoDB cluster keyfile.
      "chmod 400 /opt/mongo/mongo-keyfile",
      "chown mongodb:mongodb /opt/mongo/mongo-keyfile",

      # Configure MongoDB.
      "echo \"10.3.0.1 mongo-repl-1\" >> /etc/hosts",
      "echo \"10.3.0.2 mongo-repl-2\" >> /etc/hosts",
      #sed -i "s,\\(^[[:blank:]]*bindIp:\\) .*,\\1 localhost\,mongo-repl-${count.index + 1}," /etc/mongod.conf
      "sed -i \"s,\\\\(^[[:blank:]]*bindIp:\\\\) .*,\\\\1 localhost\\,mongo-repl-${count.index + 1},\" /etc/mongod.conf",
      "cat >> /etc/mongod.conf <<EOF",
      "replication:",
      "   replSetName: \"rs0\"",
      " ",
      "security:",
      "  keyFile: /opt/mongo/mongo-keyfile",
      "EOF",
      "systemctl start mongod",
      "mongosh admin --eval \"db.getSiblingDB('admin').createUser({user: 'admin', pwd: '${var.mongodb_admin_password}', roles: ['root']})\"",

      # Output Wireguard information.
      "wg",

      "systemctl restart sshd"
    ]
  }
}

