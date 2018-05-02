/* eslint no-console: 0 */
const db = require('../src/server/models/connector');

const author = `
  CREATE TABLE authors (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(35) NOT NULL,
      PRIMARY KEY (id),
      INDEX name_ind (name),
      UNIQUE (id),
      UNIQUE (name)
  ) ENGINE=INNODB;`;

const book = `
  CREATE TABLE books (
      id INT NOT NULL AUTO_INCREMENT,
      author_id INT NOT NULL,
      title VARCHAR(30) NOT NULL,
      description TEXT NOT NULL,
      date DATE NOT NULL,
      image TEXT NOT NULL,
      PRIMARY KEY (id),
      INDEX author_ind (author_id),
      UNIQUE (title),
      UNIQUE (id),
      FOREIGN KEY (author_id)
          REFERENCES authors(id)
          ON DELETE CASCADE
  ) ENGINE=INNODB;`;


async function createTables() {
  try {
    await db.query(author);
    await db.query(book);
    console.log('SUCCESS');
  } catch(e) {
    console.log(`ERROR! ${e.sqlMessage}`);
  }
  db.end();
}

createTables();
