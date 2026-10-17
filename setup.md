# Proxmox reverse proxy deployment guide

Homelab · Multiple VMs · Multiple domains · Docker · HTTPS

This guide takes you from a fresh Proxmox VM to a working reverse proxy, then compares four options: Nginx Proxy Manager, Traefik, Caddy, and Nginx.

The goal is to host several Dockerized projects on separate VMs, each with its own domain, without needing a separate public IP for each project.

## Part 1 — Choose your reverse proxy

[Screenshots | Nginx Proxy Manager](https://images.openai.com/static-rsc-4/fmrFGPJSu7_ZkS2abEPETPo39rvdrWQkzyIghUnbimxYC84JQ5MfCuq1B702sm7g1oPqXwMPbPvXRh14Fsq7DrQwoyVhYKzVORlw9U2xbfZDQeOTgRE8QmJqRGTdO91u5PRaW3DIZTsKOOEEXLv0ot2OadB8qhkiNfs2k_IerpM?purpose=inline)

### 1. Nginx Proxy Manager

Best for beginners

A graphical interface for managing proxy hosts, domains, and SSL certificates. Great for a homelab where you want to configure routes without editing config files.

Docs: [Official website](https://nginxproxymanager.com/?utm_source=chatgpt.com)

[Guide Traefik : exposer des apps Web avec un reverse proxy](https://images.openai.com/static-rsc-4/1qTpXsOebbkcg5NAcg2jSihU0H0B4EBE3EfcsUNyP2siAW2s5ELBZpen7O2JBsniL8tOLR8wh5GXl0tipPynjpILHGIyzNd8cQ1MH4fzjivUHd9Gd98cpr0LhiH9sAJ9oE0n1xbMmwTB6GoX91ODqudQiENhMq7RdcHoFrIqOj4?purpose=inline)

### 2. Traefik

Best for Docker automation

Discovers Docker services from labels and dynamically configures routing. Excellent for deployments driven by Compose and CI/CD, but it takes more configuration and careful Docker socket security.

Docs: [Official documentation](https://doc.traefik.io/traefik/?utm_source=chatgpt.com)

[How to Create Your Own Caddy Webserver in Linux - Make Tech Easier](https://images.openai.com/static-rsc-4/YOWHc4OaejKdy8k903NYjeNEtZvM_HtMFKdtBpt3WZHaxKhtQDSjMlUsviirkEEDHz-1X60SaE51D77dYSC2mxb-19m3cQu2_c-dtEzkACmPWuKjO9VvpUlrz_ILI6mc5j-sip-lDH6qO-EQiniWf_F4NxdIomp2OX1VvmYS_d8?purpose=inline)

### 3. Caddy

Best for simplicity

Uses a concise configuration file and automatically obtains and renews HTTPS certificates when the domain and network prerequisites are met.

Docs: [Official documentation](https://caddyserver.com/docs/?utm_source=chatgpt.com)

[HTB Season 10 | Kobold WriteUp— MCP-инструменты как новый attack surface / Хабр](https://images.openai.com/static-rsc-4/sLZHfEz2eFk3vkQ44VS4LpPm4BhR3pqjJpY5agJVOdELYeJmolZr0B9Mq9_U54X626NiRFwyBX7z4TlNE6csuIPlRJ2au-NFK7eVE9DzeVSKJdxHFYJr4ldv3tY3KEMJJ6aPDiXdpBGlG-VhVR1nJDjbVTC87_EiCm52BEYq784?purpose=inline)

### 4. NGINX (manual)

A mature, flexible web server and reverse proxy. Offers extensive control over routing, caching, headers, and TLS, but configuration and certificate renewal require more hands-on administration.

Docs: [Official documentation](https://nginx.org/en/docs/?utm_source=chatgpt.com)

## Part 2 — Advantages and disadvantages

| Proxy               | Advantages                                             | Disadvantages                                                                 |
| ------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------- |
| Nginx Proxy Manager | Easy UI, SSL management, quick setup                   | Less suited to label-driven automation; UI adds another service to secure     |
| Traefik             | Docker discovery, dynamic routing, automation-friendly | Steeper learning curve; Docker API/socket access needs protection             |
| Caddy               | Simple configuration, automatic HTTPS, low maintenance | Less visual administration; advanced routing still requires configuration     |
| NGINX               | Very mature, highly configurable, widely used          | More manual setup; certificate automation needs separate tooling or scripting |

All four can proxy traffic to applications running on different VMs. Traefik's Docker discovery works most naturally when it can see the relevant Docker services; for separate VMs, you can instead configure explicit backend addresses or use other supported providers.

My recommendation for your setup: start with Nginx Proxy Manager if you want a straightforward graphical interface. Choose Traefik if you want to build an automated, Git-based deployment workflow. Choose Caddy if you prefer configuration files and minimal maintenance.

## Part 3 — Build the reverse proxy VM in Proxmox

I'll use these example values throughout the guide. Replace them with your own network details.

| Setting        | Example                      |
| -------------- | ---------------------------- |
| Proxmox host   | Your existing Proxmox server |
| VM ID          | `120`                        |
| VM name        | `reverse-proxy`              |
| OS             | Debian 13                    |
| CPU            | 2 cores                      |
| RAM            | 2 GB                         |
| Disk           | 16–32 GB                     |
| Network bridge | `vmbr0`                      |
| Static IP      | `192.168.0.120/24`           |
| Gateway        | `192.168.0.1`                |

These resources are sufficient for a typical small homelab reverse proxy serving several lightweight web applications. Increase them if you expect significant traffic, many services, or additional security software.

### Step 1: Create the VM

[Proxmox VE GPU Passthrough Report | Johnson’s Site](https://images.openai.com/static-rsc-4/_9tnf7qdVLdfhygWLG7Y48g_R2RpuBLJ71NDonR_XMtE6A1uRwHKOCoyE92OtU81esLB2rn_T_DSMaStQf_47CLPLWS_WftR9e2B6l3ZJNf4iA891ZLsSK-y05iG2YxLMSwbSqh83iNQ4m_HKeyzaFMDkC8bnRmXCLCp974oZhI?purpose=inline)

[第4章　仮想マシンの作成と基本操作 - Proxmox VE 実践ガイド](https://images.openai.com/static-rsc-4/w6xsK_vzaJwIPgQXUiNmNzOKGS7vUp50JG7Gz1bJ_3Olh6mDXQLpqVYPdoeVyQkQ6X3pI4iVPWWlut63_pKPKkbShDfOypDCzZigM962izTUbkyh9GR5FVYmfJGKqT-3CXDz_pd_wuRfPnpjSUFzBbly-sMmwYJtNW5x-zFJ9g8?purpose=inline)

[第4章　仮想マシンの作成と基本操作 - Proxmox VE 実践ガイド](https://images.openai.com/static-rsc-4/TQMLd2n5rIixVqCrHG-ZctM1EX1mXKdeClsxPS6I6umnSeTmORVCPfFEFfbBTTlDjK-rixCkAb1IprBw3Rrih_9U2Eey2bzOlgZq0NpGsjqoUktkHM3dBU6h5vYKEhlFh4pz6MgSXC6XIaZQ-bj1imJIOaShvByKYPprfTt1-xw?purpose=inline)

5

1. Download the Debian installation ISO from [the official Debian website](https://www.debian.org/distrib/?utm_source=chatgpt.com).
2. In Proxmox, select your node and click Create VM.
3. Set the VM ID to `120` and name it `reverse-proxy`.
4. Select the Debian ISO under the OS section.
5. Choose a virtual disk of 16–32 GB.
6. Assign 2 CPU cores and 2 GB RAM.
7. Under Network, select `vmbr0` and use the VirtIO network model.
8. Finish the wizard and start the VM.
9. Install Debian with SSH server enabled, then update the system.

If you prefer Ubuntu Server, you can use it instead; the network and Docker concepts remain the same.

### Step 2: Configure a stable IP

The simplest option is to create a DHCP reservation in your router using the VM's MAC address.

Alternatively, configure a static IP inside Debian. For a traditional `/etc/network/interfaces` setup, the configuration could look like this:

```
auto ens18
iface ens18 inet static
    address 192.168.0.120/24
    gateway 192.168.0.1
```

`ens18` is a common interface name for Proxmox VirtIO NICs, but check your actual interface name first:

```
ip -br address
ip route
```

Do not apply the example blindly if your system uses NetworkManager or systemd-networkd. Configure the appropriate network manager for your installation.

Test connectivity:

```
ping -c 3 192.168.0.1
ping -c 3 1.1.1.1
```

Then test DNS resolution:

```
getent hosts deb.debian.org
```

### Step 3: Install Docker and Compose

Install Docker Engine and the Compose plugin using the [official Docker installation instructions](https://docs.docker.com/engine/install/debian/?utm_source=chatgpt.com).

For Debian, the general procedure is to configure Docker's official APT repository, install `docker-ce`, `containerd.io`, `docker-buildx-plugin`, and `docker-compose-plugin`, then enable Docker:

```
sudo systemctl enable --now docker
docker --version
docker compose version
```

Use `sudo` for Docker commands unless you've deliberately configured a trusted administration account. Membership in the Docker group effectively grants root-level privileges, so don't grant it casually.

### Step 4: Prepare the router and DNS

Before requesting public HTTPS certificates, make sure:

- Your domains resolve to your public IP.
- Your router forwards TCP 80 and 443 to `192.168.0.120`.
- The reverse proxy VM can reach the application VMs on the LAN.
- No other service is already occupying ports 80 and 443 on the proxy VM.

Example DNS records:

| Type | Name   | Value                    |
| ---- | ------ | ------------------------ |
| A    | `@`    | Your public IPv4 address |
| A    | `www`  | Your public IPv4 address |
| A    | `app2` | Your public IPv4 address |

An `AAAA` record should only be published if IPv6 is actually configured and reachable for your services. Incorrect IPv6 DNS records can cause connectivity problems.

If your ISP uses carrier-grade NAT (CGNAT), ordinary inbound IPv4 port forwarding may not work. You may need a public IP from your ISP, a tunnel, or a VPS.

## Part 4 — Install your chosen proxy

Choose one of the following deployments. Do not run multiple proxies competing for ports 80 and 443 on the same VM.

### Option A — Nginx Proxy Manager

Best if you want a graphical interface to manage several domains.

[Nginx Proxy Manager - Giz Computer App Store](https://images.openai.com/static-rsc-4/XoRLoyLLJCOU-gDSFeTqd-ZX2o9XVSiUVDD4sjL77rldbAQGVsWURzwQqgaITCWCdHMkvV80nzqmbmf6tgCLhgBGSqiZ7DZTdBoD21M2igkni6WfHDm64owR3H0Ecss_ITOZEoycu7TqY7yZKxxfpSSb2DONY62Wm56IxVOJ9Zg?purpose=inline)

[computer.giz.ai](https://computer.giz.ai/apps/nginxproxymanager?utm_source=chatgpt.com)

Create a directory:

```
sudo mkdir -p /opt/nginx-proxy-manager
sudo chown -R "$USER":"$USER" /opt/nginx-proxy-manager
cd /opt/nginx-proxy-manager
```

Create `compose.yaml`:

```
services:
  npm:
    image: jc21/nginx-proxy-manager:latest
    container_name: nginx-proxy-manager
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "127.0.0.1:81:81"
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
```

Start the service:

```
docker compose up -d
docker compose logs -f npm
```

The admin interface is bound to localhost, not your LAN. From your own computer, open an SSH tunnel:

```
ssh -L 8181:127.0.0.1:81 youruser@192.168.0.120
```

Visit `http://localhost:8181` while the tunnel is running. Complete the initial account setup and secure the administrator account.

The installation pattern and persistent data directories are based on the project's [official setup instructions](https://github.com/NginxProxyManager/nginx-proxy-manager?utm_source=chatgpt.com).&#x20;

[image](https://www.google.com/s2/favicons?domain=https://github.com&sz=32)

GitHub

#### Add your first proxy host

Suppose your Next.js project is running on VM `192.168.0.126`, with port `3000` reachable on the LAN.

In Nginx Proxy Manager:

1. Open Hosts → Proxy Hosts → Add Proxy Host.
2. Enter `example.com` under Domain Names.
3. Set Scheme to `http`.
4. Set Forward Hostname / IP to `192.168.0.126`.
5. Set Forward Port to `3000`.
6. Enable Websockets Support if your application requires it.
7. Under SSL, request a Let's Encrypt certificate.
8. Enable Force SSL and save.

Repeat for the second domain, forwarding it to `192.168.0.127:3000`.

Your applications should only expose the necessary port to the LAN, and firewall rules should ideally permit inbound application traffic only from the proxy VM.

### Option B — Traefik

Best if you want configuration-as-code, automatic routing, and repeatable deployments.

[Traefik als Reverse Proxy für deine Dienste verwenden](https://images.openai.com/static-rsc-4/0Ntdkun2XXsF-5usahbRdbLqSBWpzXqOeeBI-95EUyDghUZZelL92peErAtsudLh-noTENVAShMCPAF7C-1yi_QQ1n0h3QJ3mLtgKFfuBzC6oQQ3Xgiz94_QAlm8RsL1BNxBeT53VhVdzEvOb9Ijytn73qWNoB7V6a2C-26ao4M?purpose=inline)

[blog.michivonah.ch](https://blog.michivonah.ch/traefik-als-reverse-proxy-fur-deine-dienste-verwenden/?utm_source=chatgpt.com)

Because your applications run on separate VMs, I'll use Traefik's file provider for backend routing. This avoids mounting the Docker socket from the proxy VM and avoids assuming Traefik can discover containers on other VMs automatically.

Create the directories:

```
sudo mkdir -p /opt/traefik/dynamic
sudo chown -R "$USER":"$USER" /opt/traefik
cd /opt/traefik
```

Create `compose.yaml`:

```
services:
  traefik:
    image: traefik:v3.7
    container_name: traefik
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./traefik.yml:/etc/traefik/traefik.yml:ro
      - ./dynamic:/etc/traefik/dynamic:ro
      - ./letsencrypt:/letsencrypt
    security_opt:
      - no-new-privileges:true
```

Create `traefik.yml`:

```
api:
  dashboard: false

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https

  websecure:
    address: ":443"

providers:
  file:
    directory: /etc/traefik/dynamic
    watch: true

certificatesResolvers:
  letsencrypt:
    acme:
      email: you@example.com
      storage: /letsencrypt/acme.json
      httpChallenge:
        entryPoint: web
```

Replace `you@example.com` with your email address.

Prepare the certificate storage and permissions:

```
touch letsencrypt/acme.json
chmod 600 letsencrypt/acme.json
```

Create `dynamic/routes.yml`:

```
http:
  routers:
    project-a:
      rule: "Host(`example.com`)"
      entryPoints:
        - websecure
      service: project-a
      tls:
        certResolver: letsencrypt

    project-b:
      rule: "Host(`example.be`)"
      entryPoints:
        - websecure
      service: project-b
      tls:
        certResolver: letsencrypt

  services:
    project-a:
      loadBalancer:
        servers:
          - url: "http://192.168.0.126:3000"

    project-b:
      loadBalancer:
        servers:
          - url: "http://192.168.0.127:3000"
```

Start Traefik:

```
docker compose up -d
docker compose logs -f traefik
```

This configuration redirects HTTP to HTTPS, requests certificates automatically, and routes traffic based on the hostname. Traefik supports file-based routing as well as Docker-based service discovery.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://github.com&sz=32)

GitHub

+1

Security note: This example deliberately does not expose the Traefik dashboard. Keep it disabled until you have a specific, secured administration plan.

### Option C — Caddy

Best if you prefer a compact configuration file and automatic HTTPS without a management dashboard.

[Caddy Reverse Proxy einrichten: Auto-HTTPS Anleitung](https://images.openai.com/static-rsc-4/3_TX3wIGLiSklEvigs4RYOvQhlN4ygoFA8yEEWmAB0ozWVV-Y83knlGrawLc9JYCrXh0f4NRAABjvDExtEqq5Tp5KKn3UEKuxW3RaLPaeg-q-OKE3DYKwDtYU2ahnTXbubN2mdhn7O3GU78EmjmHUHv2a2DGlsfv18QjZ8uObNo?purpose=inline)

[s-edv.com](https://s-edv.com/anleitungen/caddy-reverse-proxy-automatisches-https-anleitung?utm_source=chatgpt.com)

Create the project directory:

```
sudo mkdir -p /opt/caddy
sudo chown -R "$USER":"$USER" /opt/caddy
cd /opt/caddy
```

Create `compose.yaml`:

```
services:
  caddy:
    image: caddy:2
    container_name: caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config

volumes:
  caddy_data:
  caddy_config:
```

Create `Caddyfile`:

```
example.com {
    reverse_proxy 192.168.0.126:3000
}

example.be {
    reverse_proxy 192.168.0.127:3000
}
```

Start Caddy:

```
docker compose up -d
docker compose logs -f caddy
```

Caddy automatically obtains and renews public certificates when DNS, network access, and its persistent data directory are correctly configured. The UDP port mapping enables HTTP/3; it is optional if you only want HTTP/1.1 and HTTP/2 over TCP.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://caddyserver.com&sz=32)

Caddy Documentation

+1

There is no web administration dashboard by default. You edit the Caddyfile and reload or restart the container when needed.

### Option D — NGINX with manual configuration

Best if you want fine-grained control over the server and don't mind maintaining configuration files and certificate automation.

Create a directory:

```
sudo mkdir -p /opt/nginx/conf.d
sudo chown -R "$USER":"$USER" /opt/nginx
cd /opt/nginx
```

Create `compose.yaml`:

```
services:
  nginx:
    image: nginx:stable
    container_name: nginx-proxy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./conf.d:/etc/nginx/conf.d:ro
      - ./certs:/etc/nginx/certs:ro
```

Create `conf.d/project-a.conf` for a site whose TLS certificate and key have already been obtained:

```
server {
    listen 80;
    server_name example.com;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate     /etc/nginx/certs/example.com/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/example.com/privkey.pem;

    location / {
        proxy_pass http://192.168.0.126:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Repeat with `example.be` and `192.168.0.127:3000` for the second site.

NGINX does not obtain the certificates for you in this configuration. You'll need to provision them first, for example using Certbot with a suitable webroot or DNS challenge, and arrange automated renewal. If using webroot validation, ensure the challenge path is served correctly on port 80 before requesting certificates.

Validate the configuration and start the proxy:

```
docker compose run --rm nginx nginx -t
docker compose up -d
```

For subsequent configuration changes:

```
docker compose exec nginx nginx -t
docker compose exec nginx nginx -s reload
```

See the [official NGINX documentation](https://nginx.org/en/docs/?utm_source=chatgpt.com) for TLS and reverse proxy options.

## Part 5 — Connect your applications securely

Whichever proxy you choose, the networking principle is the same:

- The reverse proxy accepts external web traffic.
- It forwards each request to the relevant VM.
- The Next.js application communicates with PostgreSQL and Redis through its private Docker network.
- Database and cache services are not exposed to the public internet.

For example, your application VM's Docker Compose file could publish Next.js on its LAN interface:

```
services:
  app:
    image: ghcr.io/your-user/project-a:latest
    restart: unless-stopped
    ports:
      - "192.168.0.126:3000:3000"
    environment:
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
    networks:
      - backend

  postgres:
    image: postgres:17
    restart: unless-stopped
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - backend

  redis:
    image: redis:7
    restart: unless-stopped
    networks:
      - backend

networks:
  backend:

volumes:
  postgres_data:
```

This is an illustrative example. Confirm that the Next.js image listens on port `3000`, use compatible image versions, and store secrets in a protected environment file or secret manager. The example does not publish PostgreSQL or Redis ports.

For production, also consider pinning images to tested versions or digests instead of using `latest`, setting resource limits where appropriate, and configuring health checks and backups.

### Network firewall rules

On the router:

- Allow inbound TCP 80 and 443 to the reverse proxy VM.
- Do not forward PostgreSQL, Redis, SSH, or Proxmox management ports from the internet.

On your LAN firewall, where practical:

| Source               | Destination            | Allowed traffic                   |
| -------------------- | ---------------------- | --------------------------------- |
| Internet             | Reverse proxy          | TCP 80, 443                       |
| Reverse proxy        | App VM 1               | TCP 3000                          |
| Reverse proxy        | App VM 2               | TCP 3000                          |
| Each app VM          | Its own database/cache | Required internal Docker traffic  |
| Trusted admin device | Proxy VM               | SSH and restricted administration |

If your applications are on the same LAN, remember that port binding alone is not a substitute for firewall rules: other LAN devices may still reach the published application port.

## Part 6 — Verify that everything works

Use this checklist after deployment.

## Deployment checklist

0 of 7

VM networking

The reverse proxy VM has a stable IP and can reach both application VMs.

DNS records

Each domain resolves to your public IP address.

Router forwarding

TCP ports 80 and 443 reach the reverse proxy VM.

Application connectivity

The proxy VM can reach each Next.js backend on port 3000.

HTTPS certificates

Both domains have valid certificates and HTTP redirects to HTTPS.

Security

No public PostgreSQL, Redis, Docker API, or Proxmox management ports.

Persistence and recovery

Proxy configuration and certificates persist after a restart; application and database backups exist.

Useful commands for troubleshooting:

```
# Check the proxy container
docker compose ps
docker compose logs --tail=100

# Check DNS resolution
getent hosts example.com

# Check application connectivity from the proxy VM
curl -I http://192.168.0.126:3000
curl -I http://192.168.0.127:3000

# Check public HTTPS from a client
curl -I https://example.com
curl -I https://example.be
```

Run the commands from the relevant directory or use `docker compose -f /path/to/compose.yaml ...` as appropriate. Test public HTTPS from outside your home network, since some routers do not support connecting to their own public IP from inside the LAN.

## Final recommendation

For your Proxmox environment, I would choose one of these approaches:

- Nginx Proxy Manager: easiest to configure and maintain through a UI.
- Traefik: best if you want to automate deployments and manage routing through configuration.
- Caddy: best if you want a lightweight, file-based setup with automatic HTTPS.
- NGINX: best if you want maximum manual control and are comfortable managing certificates and configuration.

For a first deployment with multiple independent application VMs, I would start with a dedicated Debian VM running Nginx Proxy Manager. Once you have the domains, routing, HTTPS, backups, and firewall rules working, you can move to Traefik if you want more automation.

The official documentation is the best place to check release-specific configuration before deploying:

- [Nginx Proxy Manager guide](https://nginxproxymanager.com/guide/?utm_source=chatgpt.com)
- [Traefik documentation](https://doc.traefik.io/traefik/?utm_source=chatgpt.com)
- [Caddy documentation](https://caddyserver.com/docs/?utm_source=chatgpt.com)
- [NGINX documentation](https://nginx.org/en/docs/?utm_source=chatgpt.com)
- [Proxmox VE documentation](https://pve.proxmox.com/pve-docs/?utm_source=chatgpt.com)
