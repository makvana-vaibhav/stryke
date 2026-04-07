# Deployment Flow (Draft)

## Planned job pipeline

1. Validate repository, server, and domain input.
2. Create DNS record through Cloudflare API.
3. SSH to target host.
4. Prepare app directory and source code.
5. Install runtime dependencies.
6. Start service with selected runtime (PM2/systemd/Docker).
7. Generate Nginx config + reload.
8. Run Certbot for SSL.
9. Emit logs + final status.
