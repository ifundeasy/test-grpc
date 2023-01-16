module.exports = {
  port: process.env.PORT || 10000,
  host: process.env.RPC_URL || 'localhost:10000',
  opts: {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
}