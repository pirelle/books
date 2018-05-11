const db = require('./connector');

function buildQueryForAll() {
  return `
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
}

function buildQueryGroupedAuthor() {
  return `
    SELECT
      JSON_OBJECTAGG(b.id, b.title) as titles,
      JSON_OBJECTAGG(b.id, b.description) as descriptions,
      JSON_OBJECTAGG(b.id, b.date) as dates,
      JSON_OBJECTAGG(b.id, b.image) as images,
      a.name as author_name
    FROM books AS b
    LEFT JOIN authors AS a
    ON b.author_id = a.id
    GROUP BY a.name`;
}

function buildQueryGroupedDate() {
  return `
    SELECT
      JSON_OBJECTAGG(b.id, b.title) as titles,
      JSON_OBJECTAGG(b.id, b.description) as descriptions,
      JSON_OBJECTAGG(b.id, a.name) as authors,
      JSON_OBJECTAGG(b.id, b.image) as images,
      b.date
    FROM books AS b
    LEFT JOIN authors AS a
    ON b.author_id = a.id
    GROUP BY b.date`;
}

function all(offset, limit=30, orderby, groupby) {
  let query;

  offset = db.escape(offset);
  limit = parseInt(db.escape(limit));
  orderby = db.escape(orderby);
  groupby = db.escape(groupby);

  if (limit > 30) {
    limit = 30;
  }

  if (groupby) {
    switch (groupby) {
    case 'author':
      query = buildQueryGroupedAuthor();
      break;
    case 'date':
      query = buildQueryGroupedDate();
      break;
    default:
      throw new Error("Invalid groupby value");
    }
  } else {
    query = buildQueryForAll();
  }

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
    if (book[key] !== null) {
      fields.push(`${key}=${db.escape(book[key])}`);
    }
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