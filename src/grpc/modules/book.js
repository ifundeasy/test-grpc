const name = 'Book';
const service = 'BookMethod';
const proto = require('path').resolve(`${__dirname}/../proto/book.proto`);

const BookService = require('../../services/book');

const CreateBook = async (ctx, next) => {
  try {
    const { title, chapters, notes } = ctx.req;
    const row = await BookService.create({ title, chapters, notes });

    ctx.res = { rows: [row] };
  } catch (err) {
    throw new Error(err);
  }
};

const GetBooks = async (ctx, next) => {
  try {
    const rows = await BookService.getBy({});

    ctx.res = { rows };
  } catch (err) {
    throw new Error(err);
  }
};

const GetBookById = async (ctx, next) => {
  try {
    const { id } = ctx.req;
    const row = await BookService.getById(id);

    ctx.res = { rows: [row] };
  } catch (err) {
    throw new Error(err);
  }
};

const DeleteBookById = async (ctx, next) => {
  try {
    const { id } = ctx.req;
    const _id = await BookService.deleteById(id);

    ctx.res = { id: _id };
  } catch (err) {
    throw new Error(err);
  }
};

const UpdateBookById = async (ctx, next) => {
  try {
    const { id, update } = ctx.req;
    const { title, chapters, notes } = update;
    const row = await BookService.updateById({
      title,
      chapters,
      notes
    }, id);

    ctx.res = { rows: [row] };
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  name,
  proto,
  service,
  handlers: [
    { method: CreateBook, middlewares: [] },
    { method: GetBooks },
    { method: GetBookById },
    { method: DeleteBookById },
    { method: UpdateBookById }
  ]
}
