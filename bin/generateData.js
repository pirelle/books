/* eslint no-console: 0 */
/* eslint no-await-in-loop: 0 */
/* eslint no-plusplus: 0 */
/* eslint no-continue: 0 */
const db = require('../src/server/models/connector');
const Book = require('../src/server/models/books');
const Author = require('../src/server/models/authors');

function generateString(len=10) {
  return Math.random().toString(36).substring(len);
}

function generateDate() {
  const year = Math.floor(Math.random()*400) + 1617;
  const month = Math.floor(Math.random()*11) + 1;
  const day = Math.floor(Math.random()*27) + 1;
  return `${year}-${month}-${day}`;
}

async function generateData(authorsAmount=10, booksAmount=100000) {
  const authorIds = [];

  while (authorIds.length < authorsAmount) {
    try {
      const {id} = await Author.add({ name: generateString(5) });
      authorIds.push(id);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        continue;
      } else {
        console.log(`ERROR! ${e.sqlMessage}`);
        process.exit(1);
      }
    }

  }

  for (let i = 0; i < booksAmount; i++) {
    try {
      await Book.add({
        title: generateString(5),
        description: generateString(15),
        image: generateString(15),
        date: generateDate(),
        author_id: authorIds[Math.floor(Math.random()*(authorsAmount-1))]
      });
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        i--;
        continue;
      } else {
        console.log(`ERROR! ${e.sqlMessage}`);
        process.exit(1);
      }
    }
    if (require.main === module) {
      process.stdout.write(`Created ${i}\r`);
    }
  }
  if (require.main === module) {
    process.stdout.write('\nDone\n');
  }
}

async function _generateData() { // eslint-disable-line no-underscore-dangle
  await generateData();
  db.end();
}

if (require.main === module) {
  _generateData();
}

module.exports = generateData;
