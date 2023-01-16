const Promise = require('bluebird');

const { grpc: { host, opts } } = require('../config');
const grpcClient = require('../../utils/grpc-client');


module.exports = class EnumerationGRPCClient {
  constructor() {
    this.module = {
      name: 'Book', // Package name inside .proto
      service: 'BookMethod', // Service name inside .proto
      proto: 'src/grpc-client/proto/book.proto',
      host
    }

    console.info({
      title: 'Load gRPC service',
      data: this.module
    })

    this.method = Promise.promisifyAll(grpcClient(this.module, opts));
  }

  async create(data) {
    try {
      const response = await this.method.CreateBookAsync(data)

      console.info({
        title: 'BookMethod.CreateBook',
        data: response
      })

      return response
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getAll() {
    try {
      const response = await this.method.GetBooksAsync(null)

      console.info({
        title: 'BookMethod.GetBooks',
        data: response
      })

      return response
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getById(id) {
    try {
      const response = await this.method.GetBookByIdAsync({ id })

      console.info({
        title: 'BookMethod.GetBookById',
        data: response
      })

      return response
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async updateById(data) {
    try {
      const response = await this.method.UpdateBookByIdAsync(data)

      console.info({
        title: 'BookMethod.UpdateBookById',
        data: response
      })

      return response
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async deleteById(id) {
    try {
      const response = await this.method.DeleteBookByIdAsync({ id })

      console.info({
        title: 'BookMethod.DeleteBookById',
        data: response
      })

      return response
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
