const Mali = require('mali');

const { grpc: config} = require('../config');
const modules = require('./modules');

module.exports = class GRPC {
  constructor(forever = false, opts = {}) {
    const me = this;

    me.polling = undefined;
    me.forever = forever;
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
    if (server) console.log(`gRPC ${server.started ? 'started' : 'closed'} on 0.0.0.0:${config.port}`)
  }

  keepAlive() {
    const me = this;
    if (!!me.polling && !(me.polling || {})._destroyed) clearInterval(me.polling);
    me.polling = setInterval(function () {
      // * Mali will always push when grpc server start, we just need to check last index of servers
      if (!me.app.servers[me.app.servers.length -1 ].server.started) {
        me.start(() => console.debug('gRPC force started!'))
      }
    }, 200)
  }

  async start(callback) {
    const me = this;

    if (me.forever) me.keepAlive();
    
    const server = await this.app.start(`0.0.0.0:${config.port}`);
    me.#printState(server);
    if (typeof callback === 'function') callback(server, me.app.servers)
  }

  async close(callback) {
    const me = this;
    
    await this.app.close()

    // * Mali will always push when grpc server start, we just need to check last index of servers
    me.#printState(me.app.servers[me.app.servers.length - 1])
    
    if (typeof callback === 'function') callback(me.app.servers)
  }
}
