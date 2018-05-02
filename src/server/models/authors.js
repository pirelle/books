const db = require('./connector');

function getByName(name) {
  return db.query('SELECT * FROM authors WHERE name=?', [name]);
}

async function add(author) {
  const response = await db.query(`INSERT INTO authors SET ?`, author);
  return {
    id: response.insertId,
    name: author.name
  };
}

async function getOrCreate(name) {
  const author = await getByName(name);
  if (author.length === 0) {
    return add({ name });
  }
  return author;
}

module.exports = {
  add,
  getByName,
  getOrCreate
};