const db = require('./connector');

async function getByName(name) {
  const author = await db.query('SELECT * FROM authors WHERE name=?', [name]);
  if (author.length === 1) {
    return author[0];
  }
  return author;
}

function all() {
  return db.query('SELECT * FROM authors');
}

async function add(author) {
  const response = await db.query(`INSERT INTO authors SET ?`, author);
  return {
    id: response.insertId,
    name: author.name
  };
}

async function getOrCreate(name) {
  let author = await getByName(name);
  if (author.length === 0) {
    author = await add({ name });
  }
  return author;
}

module.exports = {
  all,
  add,
  getByName,
  getOrCreate
};