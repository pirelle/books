const Books = require('../models/books');
const path = require('path');
const fs = require('fs');

class BooksController {
  
  async all(ctx) {
    try {
      const {offset, limit, order} = ctx.request.query
      const books = await Books.all(offset, limit, order);
      ctx.body = {
        status: 'success',
        data: books
      };
    } catch (err) {
      console.log(err);
      ctx.throw(500);
    }
  }


  async getById (ctx) {
    try {
      const book = await Books.getBook(ctx.params.id);
      ctx.body = {
        status: 'success',
        data: book
      };
    } catch (err) {
      console.log(err);
      ctx.throw(500);
    }
  }


  async add (ctx) {
    try {
      const ext = path.extname(ctx.request.files.file.name);
      const basename = path.basename(ctx.request.files.file.path)
      const filename = `/media/${basename}${ext}`;
      const fullpath = path.join(__dirname, '../public', filename)
      fs.createReadStream(ctx.request.files.file.path).pipe(fs.createWriteStream(fullpath))
      const {author, date, description, title} = ctx.request.body;
      const book = {
        author,
        date,
        description,
        title,
        image: filename
      };
      book.id = await Books.add(book);
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: book
      };
    } catch (err) {
      console.log(err)
      ctx.throw(500)
    }
  }

};

module.exports = new BooksController();
