# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.13.0
ARG VITE_OPENAI_API_KEY
ARG VITE_SUPABASE_URL
FROM node:${NODE_VERSION}-slim AS base

ENV VITE_OPENAI_API_KEY=${VITE_OPENAI_API_KEY}
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}

LABEL fly_launch_runtime="Vite"

# Vite app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Throw-away build stage to reduce size of final image
FROM base AS build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

COPY package-lock.json package.json ./
COPY scripts/load-secrets.sh ./scripts/load-secrets.sh
COPY . .

RUN --mount=type=secret,id=ALL_SECRETS \
    bash -c " \
      source ./scripts/load-secrets.sh && \
      npm ci --include=dev && \
      npm run build && \
      npm prune --omit=dev \
    "

# Final stage for app image
FROM nginx

# Copy built application
COPY --from=build /app/dist /usr/share/nginx/html

# Start the server by default, this can be overwritten at runtime
EXPOSE 80
CMD [ "/usr/sbin/nginx", "-g", "daemon off;" ]
