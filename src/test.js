const Promise = require('bluebird');

const getRequest = require('./client')
const { grpc: gRPC } = require('./grpc');

let grpc = new gRPC();

const caseOne = async () => {
  console.log('\n\n/** TEST CASE #1 **/')
  await grpc.start()
  await grpc.close()

  // don't await, make it async
  Promise.delay(3000).then(async () => {
    await grpc.start()
  });

  await getRequest()
  await grpc.close()
}

const caseTwo = async () => {
  console.log('\n\n/** TEST CASE #2 **/')
  grpc = new gRPC(true);
  await grpc.start()

  // don't await; just make it async flow
  getRequest().then(() => {
    console.log('It\'s really done now..')
    process.exit()
  })
  grpc.close()
  grpc.close()
  grpc.close()
}

(async () => {
  await caseOne();
  await Promise.delay(3000)
  await caseTwo();
})()