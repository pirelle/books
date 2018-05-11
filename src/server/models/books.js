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
    WHERE b.id=?`, [id]);
}

async function add(book) {
  const response = await db.query('INSERT INTO books SET ?', book);
  return response.insertId;
}

async function update(book) {
  const fields = [];
  const allowedFields = ['author_id', 'date', 'description', 'title', 'image'];
  allowedFields.forEach((key) => {
    fields.push(`${key}=${db.escape(book[key])}`);
  });
  const setString = fields.join(',');

  const response = await db.query(`
    UPDATE books
    SET ${setString}
    WHERE id=?`,
  [book.id]);
  return response.insertId;
}

module.exports = {
  all,
  getById,
  add,
  update
};