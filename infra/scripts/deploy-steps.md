# Worker Deployment Steps (Template)

1. Ensure base packages exist (`git`, `nginx`, runtime).
2. Create `/srv/stryke/<app-name>`.
3. Clone/pull repository.
4. Build/start app.
5. Write nginx config from template.
6. Reload nginx.
7. Run certbot for SSL.
