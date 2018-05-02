const Books = require('../models/books');
const Authors = require('../models/authors');
const {handleFileUpload} = require('../utils.js');

class BooksController {

  async all(ctx) {
    try {
      ctx.throw(500);
      const {offset, limit, order} = ctx.request.query;
      const books = await Books.all(offset, limit, order);
      ctx.body = {
        status: 'success',
        data: books
      };
    } catch (err) {
      console.log(err); // eslint-disable-line no-console
      ctx.throw(500);
    }
  }


  async getById (ctx) {
    try {
      const book = await Books.getById(ctx.params.id);
      ctx.body = {
        status: 'success',
        data: book
      };
    } catch (err) {
      console.log(err); // eslint-disable-line no-console
      ctx.throw(500);
    }
  }


  async add (ctx) {
    try {
      const url = handleFileUpload(ctx);
      const {author, date, description, title} = ctx.request.body;
      // eslint-disable-next-line camelcase
      const {id: author_id} = Authors.getOrCreate(author);
      const book = {
        author_id,
        date,
        description,
        title,
        image: url
      };
      book.id = await Books.add(book);
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: book
      };
    } catch (err) {
      console.log(err); // eslint-disable-line no-console
      ctx.throw(500);
    }
  }

  async update (ctx) {
    try {
      let url = null;
      if (ctx.request.files.file) {
        url = handleFileUpload(ctx.request.files.file);
      }

      const {id, author, date, description, title} = ctx.request.body;
      const book = {
        id,
        author,
        date,
        description,
        title,
        image: url
      };
      await Books.update(book);
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: book
      };
    } catch (err) {
      console.log(err); // eslint-disable-line no-console
      ctx.throw(500);
    }
  }

};

module.exports = new BooksController();
