# Strapi CMS. Railway: Dockerfile path cms/Dockerfile, build context = repo root.
# Locally: docker build -f cms/Dockerfile -t supertext-integrations-cms . && docker run -p 1337:1337 --env-file cms/.env supertext-integrations-cms
FROM node:22-bookworm-slim AS build
RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY cms/package.json cms/package-lock.json cms/.npmrc ./
COPY cms/scripts ./scripts
# The Supertext translation plugin, built from its GitHub repo (PLUGIN_REF = branch or tag);
# package.json depends on the resulting plugins/supertext.tgz.
ARG PLUGIN_REF=main
RUN PLUGIN_REF="$PLUGIN_REF" sh scripts/fetch-plugin.sh
RUN npm ci --no-audit --no-fund
COPY cms/ ./
RUN NODE_ENV=production npm run build

FROM node:22-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app ./
RUN mkdir -p public/uploads && echo ok > public/health
EXPOSE 1337
# Strapi directly (exec), not through npm: on a redeploy Railway stops the old container with
# SIGTERM; Strapi shuts down cleanly (exit 0), while npm reports the signal as a failed command,
# which Railway counts as a crash ("Deploy Crashed!" emails).
# nosemgrep: missing-user -- Railway mounts the uploads volume (/app/public/uploads) as root; running as node needs the volume's ownership changed first
CMD ["sh", "-c", "node scripts/ensure-db.js && exec ./node_modules/.bin/strapi start"]
