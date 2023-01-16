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

  start() {
    this.app.start(`0.0.0.0:${config.port}`);
    console.info(`gRPC started on 0.0.0.0:${config.port}`);
  }
}
