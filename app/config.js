var mongoose = require('mongoose');
//var address = azure mongo || local mongo;
var mongoAddress = process.env.MONGODB || 'mongodb://localhost/shortly';
mongoose.connect(mongoAddress);
var db = mongoose.connection;
exports.database = db;
// var db = Bookshelf.initialize({
//   client: 'sqlite3',
//   connection: {
//     host: '127.0.0.1',
//     user: 'your_database_user',
//     password: 'password',
//     database: 'shortlydb',
//     charset: 'utf8',
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   }
// });
