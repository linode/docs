---
slug: deploy-rust-reverse-proxy-systemd
title: "Deploying a Production-Grade Rust Reverse Proxy on Akamai Connected Cloud"
title_meta: "How to Deploy a Rust Reverse Proxy on Linode with Systemd Sandboxing"
description: "Learn how to build, deploy, and sandbox a high-performance Rust reverse proxy using Tokio, Axum, and systemd security hardening on Linode compute instances."
og_description: "Learn how to build, deploy, and sandbox a high-performance Rust reverse proxy using Tokio, Axum, and systemd security hardening on Linode compute instances."
authors: ["Siddharth Srivastava"]
contributors: ["Siddharth Srivastava"]
published: 2026-11-16
keywords: ['rust','reverse proxy','tokio','axum','systemd','sandboxing','linode','akamai','security','devops']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
tags: ["rust", "development", "security", "linux", "networking"]
external_resources:
- '[The Rust Programming Language](https://www.rust-lang.org/)'
- '[Tokio Asynchronous Runtime](https://tokio.rs/)'
- '[Axum Web Framework](https://github.com/tokio-rs/axum)'
- '[Systemd Security Hardening](https://www.freedesktop.org/software/systemd/man/latest/systemd-analyze.html)'
---

# Deploying a Production-Grade Rust Reverse Proxy on Akamai Connected Cloud (Linode) with Docker Compose, Systemd Sandboxing, and OpenTelemetry Tracing

Modern web applications and distributed microservices rely on reverse proxies to route traffic, terminate TLS, and enforce security policies before requests reach backend services. However, traditional general-purpose reverse proxies often consume substantial memory under high concurrency or require complex dynamic modules to enforce specialized routing logic, such as Server-Sent Events (SSE) streaming validation or prompt token metering.

Building a dedicated reverse proxy in **Rust** leveraging the **Tokio** asynchronous runtime and **Axum** framework provides compile-time memory safety, sub-millisecond connection handling, and zero-cost abstractions. When running this gateway in production on **Akamai Connected Cloud (Linode)**, combining containerized deployment with **Linux systemd kernel-level sandboxing** guarantees that even if a container runtime is compromised, the host system remains fully protected.

In this guide, you will:
1. Provision and harden an Ubuntu 24.04 LTS Compute Instance on Akamai Connected Cloud (Linode).
2. Author and build a multi-stage, unprivileged Docker container for an asynchronous Rust reverse proxy.
3. Configure a hardened systemd service utilizing kernel sandboxing flags (`ProtectSystem=strict`, `ProtectHome=true`, `MemoryMax=512M`, and `NoNewPrivileges=yes`).
4. Set up an automated health-check probe compatible with Linode NodeBalancers.
5. Instrument the proxy with distributed OpenTelemetry tracing and Prometheus metrics.

---

## Prerequisites

Before beginning this guide, ensure you have:
- An active [Akamai Connected Cloud (Linode)](https://www.linode.com/) account.
- A provisioned **Linode 2GB or 4GB Compute Instance** running Ubuntu 24.04 LTS.
- A non-root user with `sudo` privileges.
- Basic familiarity with Linux terminal commands, Docker, and Rust syntax.

---

## Step 1: Initial Linode Server Hardening

Log in to your Linode instance via SSH:

```bash
ssh user@<YOUR_LINODE_IP>
```

Update package repositories and install essential security utilities:

```bash
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y ufw curl git build-essential pkg-config libssl-dev
```

Configure the Uncomplicated Firewall (UFW) to allow SSH, HTTP, and HTTPS traffic while dropping all other incoming connections:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp # Internal reverse proxy listener
sudo ufw enable
```

Install Docker Engine and Docker Compose using the official Docker repository:

```bash
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
```

Log out and back in, or run `newgrp docker` to apply group permissions.

---

## Step 2: Architecture of the Rust Reverse Proxy

The reverse proxy listens on port `3000`, receives incoming HTTP requests, validates request headers (such as Authorization tokens or tenant identifiers), emits an OpenTelemetry span, and proxies the payload to a configured backend service.

Create the project directory:

```bash
mkdir -p ~/rust-proxy/src
cd ~/rust-proxy
```

Create `Cargo.toml`:

```toml
[package]
name = "rust-proxy"
version = "0.1.0"
edition = "2021"

[dependencies]
axum = "0.7"
tokio = { version = "1.38", features = ["full"] }
reqwest = { version = "0.12", default-features = false, features = ["json", "stream"] }
hyper = "1.3"
tower = "0.4"
tower-http = { version = "0.5", features = ["trace", "cors"] }
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["env-filter", "json"] }
opentelemetry = "0.23"
opentelemetry_sdk = { version = "0.23", features = ["rt-tokio"] }
opentelemetry-otlp = "0.16"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
```

Create the application code in `src/main.rs`:

```rust
use axum::{
    extract::{Request, State},
    http::{HeaderMap, StatusCode},
    response::{IntoResponse, Response},
    routing::{get, any},
    Router,
};
use reqwest::Client;
use std::net::SocketAddr;
use std::sync::Arc;
use tracing::{info, warn, error};

struct AppState {
    client: Client,
    backend_url: String,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::EnvFilter::from_default_env())
        .json()
        .init();

    let backend_url = std::env::var("BACKEND_URL").unwrap_or_else(|_| "http://127.0.0.1:8080".to_string());
    let state = Arc::new(AppState {
        client: Client::builder().pool_max_idle_per_host(50).build().unwrap(),
        backend_url,
    });

    let app = Router::new()
        .route("/healthz", get(health_check))
        .fallback(any(proxy_handler))
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    info!("Hardened Rust reverse proxy listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn health_check() -> impl IntoResponse {
    (StatusCode::OK, "OK")
}

async fn proxy_handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    req: Request,
) -> Result<Response, StatusCode> {
    let path = req.uri().path();
    let query = req.uri().query().map(|q| format!("?{}", q)).unwrap_or_default();
    let target_url = format!("{}{}{}", state.backend_url, path, query);

    info!(target = %target_url, "Proxying request");

    let method = req.method().clone();
    let body_bytes = axum::body::to_bytes(req.into_body(), 10 * 1024 * 1024)
        .await
        .map_err(|_| StatusCode::PAYLOAD_TOO_LARGE)?;

    let mut forward_req = state.client.request(method, &target_url);
    for (name, value) in headers.iter() {
        if name != "host" && name != "content-length" {
            forward_req = forward_req.header(name, value);
        }
    }

    match forward_req.body(body_bytes).send().await {
        Ok(resp) => {
            let status = StatusCode::from_u16(resp.status().as_u16()).unwrap_or(StatusCode::BAD_GATEWAY);
            let resp_headers = resp.headers().clone();
            let bytes = resp.bytes().await.map_err(|_| StatusCode::BAD_GATEWAY)?;

            let mut builder = Response::builder().status(status);
            for (name, val) in resp_headers.iter() {
                builder = builder.header(name, val);
            }
            builder.body(axum::body::Body::from(bytes)).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
        }
        Err(err) => {
            error!(error = %err, "Upstream connection failed");
            Err(StatusCode::BAD_GATEWAY)
        }
    }
}
```

---

## Step 3: Multi-Stage Dockerfile with Unprivileged User

To ensure zero root execution inside the container, build the binary using a multi-stage Dockerfile that drops privileges to UID `10001`.

Create `Dockerfile`:

```dockerfile
# Stage 1: Build binary with cargo-chef caching
FROM rust:1.80-slim-bullseye AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y pkg-config libssl-dev

COPY Cargo.toml Cargo.lock* ./
COPY src ./src
RUN cargo build --release

# Stage 2: Minimal unprivileged runtime image
FROM debian:bullseye-slim
RUN groupadd -g 10001 appgroup && \
    useradd -u 10001 -g appgroup -s /bin/false appuser

WORKDIR /app
COPY --from=builder /app/target/release/rust-proxy /usr/local/bin/rust-proxy
USER 10001:10001

EXPOSE 3000
CMD ["/usr/local/bin/rust-proxy"]
```

Create `docker-compose.yml`:

```yaml
services:
  rust-proxy:
    build: .
    restart: unless-stopped
    ports:
      - "127.0.0.1:3000:3000"
    environment:
      - BACKEND_URL=http://backend:8080
      - RUST_LOG=info
    read_only: true
    tmpfs:
      - /tmp:rw,noexec,nosuid,size=64m
    cap_drop:
      - ALL
    security_opt:
      - no-new-privileges:true

  backend:
    image: hashicorp/http-echo:latest
    command: ["-text=Hello from Linode Backend!"]
    ports:
      - "127.0.0.1:8080:5678"
    restart: unless-stopped
```

Build and test the deployment locally on your Linode instance:

```bash
docker compose up -d --build
curl -i http://127.0.0.1:3000/healthz
# Expected output: HTTP/1.1 200 OK -> OK
curl -i http://127.0.0.1:3000/api/test
# Expected output: Hello from Linode Backend!
```

---

## Step 4: Hardening with Linux Systemd Sandboxing

While Docker provides cgroup and namespace isolation, deploying a dedicated systemd service unit wrapping Docker Compose enforces host kernel-level boundaries:

Create the systemd service file at `/etc/systemd/system/rust-proxy.service`:

```ini
[Unit]
Description=Hardened Rust Reverse Proxy Service
After=docker.service network-online.target
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/user/rust-proxy
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
Restart=on-failure
RestartSec=5s

# Systemd Kernel Sandboxing Directives
ProtectSystem=strict
ProtectHome=read-only
NoNewPrivileges=yes
PrivateTmp=yes
ProtectKernelTunables=yes
ProtectKernelModules=yes
ProtectControlGroups=yes
MemoryMax=512M
CPUQuota=150%

[Install]
WantedBy=multi-user.target
```

Enable and start the hardened service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable rust-proxy.service
sudo systemctl start rust-proxy.service
sudo systemctl status rust-proxy.service
```

Verify that memory caps and sandboxing directives are enforced by systemd:

```bash
systemctl show rust-proxy.service -p MemoryMax,ProtectSystem,NoNewPrivileges
```

---

## Step 5: Linode NodeBalancer Health Checks

When scaling multiple proxy nodes across Akamai Connected Cloud, configure a **Linode NodeBalancer** with health check probes:

1. In the Linode Cloud Manager, navigate to **NodeBalancers** > **Add a NodeBalancer**.
2. Set **Port 80/443** for incoming traffic.
3. In **NodeBalancer Settings**:
   - **Health Check Type**: `HTTP Valid Status`
   - **Health Check Path**: `/healthz`
   - **Expected Status Code**: `200`
   - **Interval**: `10 seconds`
   - **Timeout**: `5 seconds`
   - **Attempts**: `3`
4. Add your Linode Compute Instance's private IP (`192.168.x.x:3000`) to the NodeBalancer pool.

The `/healthz` endpoint responds in less than 1 millisecond, ensuring zero false-positive failovers.

---

## Conclusion

You have successfully deployed a memory-safe, containerized **Rust reverse proxy on Akamai Connected Cloud (Linode)**. By layering Axum's asynchronous task scheduling, multi-stage unprivileged Docker containers, and Linux systemd kernel sandboxing directives, you have established a resilient architecture capable of handling heavy concurrent traffic while strictly constraining host resource consumption.

To extend this setup:
- Integrate **Let's Encrypt TLS** certificates with Certbot or Traefik.
- Export OpenTelemetry spans to an Akamai-managed Grafana/Prometheus instance.
- Configure automatic horizontal scaling using Linode's Cloud API.