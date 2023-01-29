const { MongoClient } = require("mongodb");
const Db = process.env.DB_URI;
const { dbName, userAuthExpire, driverAuthExpire } = require('../config/config')


const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/** @type {import('mongodb').Db} */
var _db;

module.exports = {
  connectToServer: function (callback) {
    client.connect()
      .then(db => {
        if (db) {
          _db = db.db(dbName);
          console.log(`Successfully connected to ${dbName}.`);
          _db.collection('logged_in_users').createIndex({ 'createdAt': 1 }, { expireAfterSeconds: 60 * userAuthExpire })
            .then(() => { console.log('Created index for users expiration', userAuthExpire, 'min.'); })
            .catch(err => { throw err });

          _db.collection('logged_in_drivers').createIndex({ 'createdAt': 1 }, { expireAfterSeconds: 60 * driverAuthExpire })
            .then(() => { console.log('Created index for drivers expiration', driverAuthExpire, 'min.'); })
            .catch(err => { throw err });
        }
      })
      .catch(err => { throw err })
  },

  getDb: function () {
    return _db;
  },
};