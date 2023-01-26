const Mali = require('mali');

const { grpc: config} = require('../config');
const modules = require('./modules');

module.exports = class GRPC {
  constructor(opts) {
    const me = this;

    me.opts = opts;
    me.app = new Mali();

    Object.values(modules).forEach(mod => {
      me.app.addService(mod.proto, mod.service, config.opts);

      mod.handlers.forEach((handler) => {
        const middlewares = handler.middlewares || [];
        const actions = [
          mod.service,
          handler.method.name,
          ...middlewares,
          handler.method
        ]
        me.app.use(...actions)
      })
    })

    me.app.on('error', (error) => {
      if (!error.code) console.error(error);
    });
  }

  #printState(server) {
    console.log(`gRPC ${server.started ? 'STARTED' : 'STOPPED'} on 0.0.0.0:${config.port}`)
  }

  start(callback) {
    const me = this;
    this.app.start(`0.0.0.0:${config.port}`).then((server) => {
      me.#printState(server);
      if (typeof callback === 'function') callback(server, me.app.servers)
    });
  }

  close(callback) {
    const me = this;
    this.app.close().then(() => {
      me.app.servers.map(me.#printState);
      if (typeof callback === 'function') callback(me.app.servers)
    });
  }
}
