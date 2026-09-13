# ---- build the SvelteKit app ----
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build && npm prune --omit=dev

# ---- runtime: node server + pocketbase in one machine ----
FROM node:22-alpine
WORKDIR /app

# the repo's pocketbase.exe is Windows-only and gitignored, so fetch the linux build
ARG PB_VERSION=0.40.0
RUN apk add --no-cache unzip ca-certificates \
	&& wget -q https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip \
	&& unzip pocketbase_${PB_VERSION}_linux_amd64.zip -d /usr/local/bin/ \
	&& rm pocketbase_${PB_VERSION}_linux_amd64.zip

COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY pb_migrations ./pb_migrations
COPY start.sh ./
RUN chmod +x start.sh

# PORT is read by adapter-node; POCKETBASE_URL by src/hooks.server.js
ENV PORT=3000
# set TZ - container would otherwise run on UTC, rolling the day over at 05:30 IST
ENV TZ=Asia/Kolkata
ENV POCKETBASE_URL=http://127.0.0.1:8090
# node does not read the container memory limit, so cap the heap explicitly or
# V8 sizes it for the host and gets OOM-killed before it ever collects garbage
ENV NODE_OPTIONS=--max-old-space-size=160
EXPOSE 3000

CMD ["./start.sh"]
