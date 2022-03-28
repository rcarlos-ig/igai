// Package.json
const package = require("./package.json");

module.exports = {
  apps: [
    {
      name: "igai",
      script: "index.js",
      watch: ".",
      env: {
        NODE_ENV: "production",
        npm_package_version: package.version,
      },
    },
  ],

  deploy: {
    production: {
      user: "SSH_USERNAME",
      host: "SSH_HOSTMACHINE",
      ref: "origin/master",
      repo: "GIT_REPOSITORY",
      path: "DESTINATION_PATH",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};
