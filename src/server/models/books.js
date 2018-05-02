const db = require('./connector');

function all(offset, limit=30, orderby) {
  let query = `
    SELECT
      b.id,
      b.title,
      b.description,
      b.date,
      b.image,
      a.name as author_name
    FROM books AS b
    LEFT JOIN authors AS a
    ON b.author_id = a.id`;

  if (orderby) {
    query = `${query} ORDER BY ${orderby}`;
  }

  query = `${query} LIMIT ${limit}`;

  if (offset) {
    query = `${query} OFFSET ${offset}`;
  }

  return db.query(query);
}

function getById(id) {
  return db.query(`
    SELECT
      b.id,
      b.title,
      b.description,
      b.date,
      b.image,
      a.name as author_name
    FROM books AS b
    LEFT JOIN authors AS a
    ON b.author_id = a.id
    WHERE id=?`, [id]);
}

async function add(book) {
  const response = await db.query('INSERT INTO books SET ?', book);
  return response.insertId;
}

async function update(book) {  // eslint-disable-line no-unused-vars
  const response = await db.query(`
    UPDATE book (author, date, description, image, title)
    VALUES (?, ?, ?, ?, ?)`,
  [book.author, book.date, book.description, book.image, book.title]);
  return response.insertId;
}

module.exports = {
  all,
  getById,
  add
};