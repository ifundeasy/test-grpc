const { grpc: gRPC } = require('./grpc');
const grpc = new gRPC();

grpc.start((server, servers) => {
  grpc.close((servers) => {
    grpc.start((server, servers) => {
      console.log('Now it\'s idle!')
    })
  })
})