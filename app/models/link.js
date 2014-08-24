var db = require('../config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var URL = new Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: {type: Number, default: 0},
  timeStamp: {type: Date, default: Date.now}
});

var urls = mongoose.model('urls', URL);
exports.urls = urls;

/*
var Link = db.Model.extend({
  tableName: 'urls',
  hasTimestamps: true,
  defaults: {
    visits: 0
  },
  initialize: function(){
    this.on('creating', function(model, attrs, options){
      var shasum = crypto.createHash('sha1');
      shasum.update(model.get('url'));
      model.set('code', shasum.digest('hex').slice(0, 5));
    });
  }
});

module.exports = Link;
*/
