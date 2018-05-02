const db = require('./connector');

function getByName(name) {
  return db.query('SELECT * FROM authors WHERE name=?', [name]);
}

async function add(author) {
  const response = await db.query(`INSERT INTO authors SET ?`, author);
  return response.insertId;
}


module.exports = {
  add,
  getByName
};