const Book = require('../src/grpc-client/book');
const book = new Book();

// * Available method and usage example;
// book.create({ id: -1, title: 'Cracking the Interview', chapters: 12 }).then(console.log);
// book.getAll().then(console.log)
// book.getById(1).then(console.log)
// book.updateById({ id: 1, update: { title: 'yo', chapters: 16 } }).then(console.log)
// book.deleteById(2).then(console.log)


// * Test the methods
book.getAll().then(console.log)