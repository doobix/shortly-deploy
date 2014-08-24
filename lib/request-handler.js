var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.urls.find({}, null, function(err, results) {
    res.send(results);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;
  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.urls.find({ url: uri }, null, function(err, found) {
    if (found.length) {
      res.send(200, found.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var link = new Link.urls({
          url: uri,
          title: title,
          base_url: req.headers.origin,
          code: encodeURL(uri)
        });

        link.save(function(err, newLink) {
          res.send(200, newLink);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.users.find({username: username}, null, function(err, user) {
    if (!user.length) {
      res.redirect('/login');
    } else {
      comparePassword(password, user[0].password, function(match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      })
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.users.find({username: username}, null, function(err, user) {
    if (!user.length) {
      var hash = hashPassword(password);
      console.log(hash);
      var newUser = new User.users({
        username: username,
        password: hash
      });
      newUser.save(function (err, newUser) {
        if (err) return console.error(err);
          util.createSession(req, res, newUser);
      });
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function(req, res) {
  Link.urls.find({ code: req.params[0] }, null, function(err, link) {
    if (!link.length) {
      res.redirect('/');
    } else {
      var updateVisits = link[0].visits+1;
      Link.urls.update({code: req.params[0]}, {visits: updateVisits}, function(err, result) {
        if(err) return console.error(err);
      });
      res.redirect(link[0].url);
    }
  });
};

// URL Functions
var encodeURL = function(url){
  var shasum = crypto.createHash('sha1');
  shasum.update(url);
  var code = shasum.digest('hex').slice(0, 5);
  return code;
};

// User Functions
var comparePassword = function(attemptedPassword, userPassword, callback) {
  bcrypt.compare(attemptedPassword, userPassword, function(err, isMatch) {
    callback(isMatch);
  });
};
var hashPassword = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync());
/*  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
    });*/
};
