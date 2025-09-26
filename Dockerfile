# Use official Node.js LTS image
FROM node:20

# Set working directory
WORKDIR /app

# RUN apt-get update && apt-get install -y \
#     # Libraries required by Chromium
#     libnspr4 \
#     libnss3 \
#     libatk1.0-0 \
#     libatk-bridge2.0-0 \
#     libcups2 \
#     libx11-xcb1 \
#     libxcomposite1 \
#     libxrandr2 \
#     libxss1 \
#     libgdk-pixbuf2.0-0 \
#     libasound2 \
#     libappindicator3-1 \
#     libnspr4-dev \
#     libnss3-dev \
#     libx11-dev \
#     fonts-liberation \
#     libappindicator1 \
#     libindicator7 \
#     # Chromium and other useful packages
#     wget \
#     ca-certificates \
#     --no-install-recommends \
#     && rm -rf /var/lib/apt/lists/*

# Install Puppeteer (this will install Chromium automatically)
# RUN npm install puppeteer

# Optionally, install Chromium manually if you want to use a specific version
# RUN apt-get install -y chromium

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Start the server
CMD ["node", "index.js"]
