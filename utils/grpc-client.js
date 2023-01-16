const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

module.exports = (config, opts = {}) => {
  const packageDefinition = protoLoader.loadSync(config.proto, opts);
  const grpcObject = grpc.loadPackageDefinition(packageDefinition);
  const client = new grpcObject[config.name][config.service](config.host, grpc.credentials.createInsecure());

  return client
};
