const db = require('./connector');

function all(offset, limit=30, orderby) {
  let query = 'SELECT * FROM books';

  if (orderby) {
    query = `${query} order by ${orderby}`;
  }

  if (limit) {
    query = `${query} limit ${limit}`;
  }

  if (offset) {
    query = `${query} offset ${offset}`;
  }

  return db.query(query);
}

function getBook(id) {
  return db.query('SELECT * FROM books WHERE id=?', [id]);
}

async function add(book) {
  const response = await db.query(`INSERT INTO books SET ?`, book);
  return response.insertId;
}

async function update(book) {
  const response = await db.query(`
    UPDATE book (author, date, description, image, title)
    VALUES (?, ?, ?, ?, ?)`,
  [book.author, book.date, book.description, book.image, book.title]);
  return response.insertId;
}

module.exports = {
  all,
  getBook,
  add
};