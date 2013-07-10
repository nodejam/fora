// Generated by CoffeeScript 1.6.2
(function() {
  var HOST, PORT, async, conf, data, database, doHttpRequest, fs, http, init, path, querystring, utils,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  http = require('http');

  path = require('path');

  fs = require('fs');

  querystring = require('querystring');

  async = require('../../common/async');

  utils = require('../../common/utils');

  data = require('./data');

  conf = require('../../conf');

  database = new (require('../../common/database')).Database(conf.db);

  utils.log("Setup started at " + (new Date));

  utils.log("NODE_ENV is " + process.env.NODE_ENV);

  utils.log("Setup will connect to database " + conf.db.name + " on " + conf.db.host);

  HOST = 'local.foraproject.org';

  PORT = '80';

  if (process.env.NODE_ENV !== 'development') {
    utils.log('Setup can only be run in development.');
    process.exit();
  }

  if (HOST !== 'local.foraproject.org') {
    utils.log('HOST should be local.');
    process.exit();
  }

  init = function() {
    var article, createArticle, createArticleTasks, createForum, createForumTasks, createUser, createUserTasks, forum, tasks, user, _fn, _fn1, _fn2, _globals, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;

    _globals = {};
    if (__indexOf.call(process.argv, '--delete') >= 0) {
      return database.getDb(function(err, db) {
        utils.log('Deleting main database.');
        return db.dropDatabase(function(err, result) {
          utils.log('Everything is gone now.');
          return process.exit();
        });
      });
    } else if (__indexOf.call(process.argv, '--create') >= 0) {
      utils.log('This script will setup basic data. Calls the latest HTTP API.');
      _globals.sessions = {};
      createUser = function(user, cb) {
        utils.log("Creating " + user.username + "...");
        user.secret = conf.networks[0].adminkeys["default"];
        return doHttpRequest('/api/sessions', querystring.stringify(user), 'post', function(err, resp) {
          resp = JSON.parse(resp);
          utils.log("Created " + resp.username);
          _globals.sessions[user.username] = resp;
          return cb();
        });
      };
      createUserTasks = [];
      _ref = data.users;
      _fn = function(user) {
        return createUserTasks.push(function(cb) {
          return createUser(user, cb);
        });
      };
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        user = _ref[_i];
        _fn(user);
      }
      createForum = function(forum, cb) {
        var passkey;

        passkey = _globals.sessions[forum._createdBy].passkey;
        utils.log("Creating a new forum " + forum.name + " with passkey(" + passkey + ")....");
        delete forum._createdBy;
        return doHttpRequest("/api/forums?passkey=" + passkey, querystring.stringify(forum), 'post', function(err, resp) {
          resp = JSON.parse(resp);
          utils.log("Created " + resp.name);
          return cb();
        });
      };
      createForumTasks = [];
      _ref1 = data.forums;
      _fn1 = function(forum) {
        return createForumTasks.push(function(cb) {
          return createForum(forum, cb);
        });
      };
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        forum = _ref1[_j];
        _fn1(forum);
      }
      createArticle = function(article, cb) {
        var adminkey, meta, passkey;

        passkey = _globals.sessions[article._createdBy].passkey;
        adminkey = _globals.sessions['jeswin'].passkey;
        utils.log("Creating a new article with passkey(" + passkey + ")....");
        utils.log("Creating " + article.title + "...");
        article.content = fs.readFileSync(path.resolve(__dirname, "articles/" + article._content), 'utf-8');
        article.publish = true;
        forum = article._forum;
        meta = article._meta;
        delete article._forum;
        delete article._createdBy;
        delete article._content;
        delete article._meta;
        return doHttpRequest("/api/forums/" + forum + "?passkey=" + passkey, querystring.stringify(article), 'post', function(err, resp) {
          resp = JSON.parse(resp);
          utils.log("Created " + resp.title + " with id " + resp._id);
          if (meta.split(',').indexOf('featured') !== -1) {
            return doHttpRequest("/api/admin/posts/" + resp._id + "?passkey=" + adminkey, querystring.stringify({
              tags: 'featured'
            }), 'put', function(err, resp) {
              resp = JSON.parse(resp);
              utils.log("Added featured tag to article " + resp.title + ".");
              return cb();
            });
          }
        });
      };
      createArticleTasks = [];
      _ref2 = data.articles;
      _fn2 = function(article) {
        return createArticleTasks.push(function(cb) {
          return createArticle(article, cb);
        });
      };
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        article = _ref2[_k];
        _fn2(article);
      }
      tasks = function() {
        return async.series(createUserTasks, function() {
          utils.log('Created users.');
          return async.series(createForumTasks, function() {
            utils.log('Created forums.');
            return async.series(createArticleTasks, function() {
              utils.log('Created articles.');
              return utils.log('Setup complete.');
            });
          });
        });
      };
      utils.log('Setup will begin in 3 seconds.');
      return setTimeout(tasks, 1000);
    } else {
      utils.log('Invalid option.');
      return process.exit();
    }
  };

  doHttpRequest = function(url, data, method, cb) {
    var options, req, response;

    utils.log("HTTP " + (method.toUpperCase()) + " to " + url);
    options = {
      host: HOST,
      port: PORT,
      path: url,
      method: method,
      headers: data ? {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length
      } : {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': 0
      }
    };
    response = '';
    req = http.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        return response += chunk;
      });
      return res.on('end', function() {
        utils.log(response);
        return cb(null, response);
      });
    });
    if (data) {
      req.write(data);
    }
    return req.end();
  };

  init();

}).call(this);
