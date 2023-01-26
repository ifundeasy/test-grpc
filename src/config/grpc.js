module.exports = {
  port: process.env.PORT || 8081,
  host: process.env.RPC_URL || 'localhost:8081',
  opts: {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
}