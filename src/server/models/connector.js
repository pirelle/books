const mysql = require('mysql');

const environment = process.env.NODE_ENV || 'development';
const dbConfig = require('../config.json').database[environment];

class Database {
  constructor (config) {
    this.connection = mysql.createConnection(config);
  }

  query (sql, args) {
    return new Promise ((resolve, reject) => {
      this.connection.query(sql, args, (err, results) => {
        if (err)
          return reject(err);
        return resolve(results);
      });
    });
  }

  end () {
    return this.connection.end();
  }
}

// module.exports = Database;
module.exports = new Database(dbConfig);
