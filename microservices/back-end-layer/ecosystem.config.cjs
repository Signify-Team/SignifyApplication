module.exports = {
  apps: [{
    name: 'signify-backend',
    script: 'server.js',
    interpreter: 'node',
    env: {
      NODE_ENV: 'production',
    },
    node_args: '--experimental-modules --es-module-specifier-resolution=node'
  }]
}; 