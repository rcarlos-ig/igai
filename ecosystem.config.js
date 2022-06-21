// Package.json
const appPackage = require("./package.json");

module.exports = {
  apps: [
    {
      name: "igai",
      script: "index.js",
      instances: "2",
      exec_mode: "cluster",
      watch: ".",
      env: {
        npm_package_version: appPackage.version,
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
