const Promise = require('bluebird');
const config = require('../../config');
const grpcClient = require('../../utils/grpc-client');

const { grpc: { serviceOpts } } = config;

module.exports = class PingGRPCClient {
  constructor(host) {
    this.module = {
      name: 'Ping',
      service: 'PingMethod',
      proto: 'src/grpc/v1/proto/ping.proto',
      host
    }

    this.method = Promise.promisifyAll(grpcClient(this.module, serviceOpts));
  }

  async ping() {
    return this.method.PingAsync(null)
  }
}
