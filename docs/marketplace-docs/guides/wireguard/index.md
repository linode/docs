---
title: "Deploy WireGuard through the Linode Marketplace"
description: 'Deploy a WireGuard Server or Client on Linode with Marketplace Apps.'
published: 2019-03-28
modified: 2025-07-08
keywords: ['vpn','wireguard','tunnel']
tags: ["cloud-manager","linode platform","security","marketplace","vpn"]
bundles: ['network-security']
external_resources:
- '[WireGuard Quick Start](https://www.wireguard.com/quickstart/)'
- '[WireGuard Conceptual Overview](https://www.wireguard.com/#conceptual-overview)'
- '[WireGuard man page](https://manpages.debian.org/unstable/wireguard-tools/wg.8.en.html)'
aliases: ['/products/tools/marketplace/guides/wireguard/','/platform/marketplace/deploy-wireguard-with-marketplace-apps/', '/platform/one-click/deploy-wireguard-with-one-click-apps/','/guides/deploy-wireguard-with-one-click-apps/','/guides/deploy-wireguard-with-marketplace-apps/','/guides/wireguard-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 401706
marketplace_app_name: "WireGuard"
---

WireGuard&#174; is a simple, fast, and modern virtual private network (VPN) which uses state-of-the-art cryptography. It aims to be faster and leaner than other VPN protocols such as OpenVPN and IPSec and it has a much smaller source code footprint.

Configuring WireGuard is as simple as configuring SSH. A connection is established by an exchange of public keys between server and client, and only a client whose public key is present in the server's configuration file is considered authorized. WireGuard sets up standard network interfaces which behave similarly to other common network interfaces, like `eth0`. This makes it possible to configure and manage WireGuard interfaces using standard networking tools such as `ifconfig` and `ip`.

The WireGuard Marketplace App provides two separate applications:
1. **WireGuard Server**. Creates a Linode and sets up a WireGuard network device named `wg0` on it. This device acts as the central hub for your WireGuard network.
2. **WireGuard Client**. Creates a Linode that can connect to your WireGuard server. You can deploy multiple clients to connect to the same server.

{{< note >}}
The WireGuard Server and Client apps can be deployed independently. If you already have a WireGuard server running, you can simply deploy the client app and configure it to connect to your existing server.
{{< /note >}}

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** WireGuard should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Suggested minimum plan:** All plan types and sizes can be used. The plan that you select should be appropriate for the amount of data transfer, users, and other stress that may affect the performance of your VPN.

### WireGuard Server Options

The WireGuard Server Marketplace form includes the following fields:

- **WireGuard Server Tunnel Address:** Your WireGuard server's tunnel IP address and subnet in CIDR notation. The default is: `10.0.0.1/24`. This is not the same as a private IP address that Linode can assign to your Linode instance; instead, this address is managed by the network that WireGuard creates.
- **WireGuard Listen Port:** Your WireGuard server's listening port number. The default is: `51820`.

### WireGuard Client Options

The WireGuard Client Marketplace form includes the following fields:

- **WireGuard Server Public Key:** The public key of your WireGuard server. You can find it in `/etc/wireguard/server_public.key` on your server instance.
- **WireGuard Server Endpoint:** The public IP address and port of your WireGuard server in the format `IP:PORT` (e.g., `192.0.2.1:51820`).
- **WireGuard Client Tunnel IP:** Your WireGuard client's tunnel IP address with the `/32` subnet. The default is: `10.0.0.2/32`.
- **Allowed IPs:** The IP addresses that should be routed through the WireGuard tunnel. The default is: `10.0.0.1/32`.

## Getting Started after Deployment

### Server-Side Configuration

The deployment of the WireGuard Server Marketplace App automatically creates following files:

- `/etc/wireguard/server_private.key`: The server's private key.
- `/etc/wireguard/server_public.key`: The server's public key.
- `/etc/wireguard/wg0.conf`: The server's WireGuard configuration file.

The initial `wg0.conf` looks like this:

```file
[Interface]
PrivateKey = <server-private-key>
Address = <server-tunnel-address>
ListenPort = <listen-port>
```

### Client-Side Configuration

The deployment of the WireGuard Client Marketplace App automatically creates following files:

- `/etc/wireguard/client_private.key`: The client's private key.
- `/etc/wireguard/client_public.key`: The client's public key.
- `/etc/wireguard/wg0.conf`: The client's WireGuard configuration file.

The initial `wg0.conf` looks like this:

```file
[Interface]
PrivateKey = <client-private-key>
Address = <client-tunnel-ip>
MTU = 1420
DNS = 8.8.8.8

[Peer]
PublicKey = <server-public-key>
AllowedIPs = <allowed-ips>
Endpoint = <server-endpoint>
```

### Adding Clients to the Server

To add a new client to your WireGuard server:

1. Deploy a new WireGuard Client instance using the Marketplace App.
2. On the client instance, locate the client's public key:
   ```bash
   cat /etc/wireguard/client_public.key
   ```
3. On the server instance, edit the WireGuard configuration:
   ```bash
   sudo nano /etc/wireguard/wg0.conf
   ```
4. Add a new `[Peer]` section for the client:
   ```file
   [Peer]
   PublicKey = <client-public-key>
   AllowedIPs = <client-tunnel-ip>
   ```
5. Restart the WireGuard service on the server:
   ```bash
   sudo systemctl restart wg-quick@wg0
   sudo wg-quick down wg0
   sudo wg-quick up wg0
   ```

### Testing the Connection

To test the connection between your WireGuard client and server:

1. From the client instance, ping the server's tunnel IP:
   ```bash
   ping <server-tunnel-ip>
   ```

2. Check the WireGuard connection status:
   ```bash
   sudo wg show
   ```

   You should see a similar output:
   ```output
   interface: wg0
     public key: <server-public-key>
     private key: (hidden)
     listening port: 51820

   peer: <client-public-key>
     endpoint: <client-ip>:<port>
     allowed ips: <client-tunnel-ip>
     latest handshake: 1 minute, 17 seconds ago
     transfer: 98.86 KiB received, 43.08 KiB sent
   ```

### Software Included

| **Software** | **Description** |
|--------------|-----------------|
| [**WireGuard**](https://www.wireguard.com) | VPN software. |
| [**UFW (UncomplicatedFireWall)**](https://wiki.ubuntu.com/UncomplicatedFirewall) | Firewall utility. The port assigned during the deployment that allows outgoing and incoming traffic. |

{{% content "marketplace-update-note-shortguide" %}}

"WireGuard" is a registered trademark of Jason A. Donenfeld.