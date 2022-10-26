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

resource "linode_instance" "rcdc_loadbalancer" {
  count = var.node_count
  image = "linode/ubuntu20.04"
  label = "rcdc-loadbalancer-${count.index + 1}"
  group = "rcdc-instances"
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
      # In this case, and output of 56b1ebb42b was fit to the fd00::/8 range
      # reserved for private IPv6 addresses.
      "cat > /etc/wireguard/wg0.conf <<EOF",
      "[Interface]",
      "PrivateKey = $(cat /etc/wireguard/private.key)",
      "Address = 10.1.0.${count.index + 1}/24",
      "ListenPort = 51820",
      "PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE; ip6tables -A FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -A POSTROUTING -o eth0 -j MASQUERADE",
      "PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE; ip6tables -D FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -D POSTROUTING -o eth0 -j MASQUERADE",
      "SaveConfig = true",
      "EOF",

      # Open the necessary ports in the firewall.
      "ufw allow 22/tcp",
      "ufw allow OpenSSH",
      "ufw allow http/tcp",
      "ufw allow 51820/udp",
      "ufw --force enable",

      # Start up Wireguard.
      "wg-quick up wg0",
      "systemctl enable wg-quick@wg0",

      # Install NGINX.
      "apt-get install nginx -qq",

      # Output Wireguard information.
      "wg",

      "systemctl restart sshd"
    ]
  }

  provisioner "file" {
    source = "documents/nginx.conf"
    destination = "/etc/nginx/sites-available/rcdc-loadbalancer.conf"
  }

  provisioner "remote-exec" {
    inline = [
      # Create a symlink for the NGINX configuration.
      "ln -s /etc/nginx/sites-available/rcdc-loadbalancer.conf /etc/nginx/sites-enabled/",

      # Remove the symlink for the default NGINX configuration.
      "rm /etc/nginx/sites-enabled/default",

      # Restart NGINX for the configuration file to take effect.
      "systemctl restart nginx"
    ]
  }
}

