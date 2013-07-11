// Generated by CoffeeScript 1.6.2
(function() {
  var AppError, Controller, Posts, conf, db, models, utils, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  conf = require('../../../conf');

  db = new (require('../../../common/database')).Database(conf.db);

  models = require('../../../models');

  utils = require('../../../common/utils');

  AppError = require('../../../common/apperror').AppError;

  Controller = require('../controller').Controller;

  Posts = (function(_super) {
    __extends(Posts, _super);

    function Posts() {
      this.admin_update = __bind(this.admin_update, this);      _ref = Posts.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Posts.prototype.admin_update = function(req, res, next) {
      var _this = this;

      return this.ensureSession([req, res, next], function() {
        if (_this.isAdmin(req.user)) {
          return models.Post.getById(req.params.id, {}, db, function(err, post) {
            var meta, _i, _len, _ref1;

            if (post) {
              if (req.body.meta) {
                _ref1 = req.body.meta.split(',');
                for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                  meta = _ref1[_i];
                  if (post.meta.indexOf(meta) === -1) {
                    post.meta.push(meta);
                  }
                }
              }
              return post.save({}, db, function(err, post) {
                return res.send(post);
              });
            } else {
              return next(new AppError("Post not found.", 'POST_NOT_FOUND'));
            }
          });
        } else {
          return next(new AppError("Access denied.", 'ACCESS_DENIED'));
        }
      });
    };

    return Posts;

  })(Controller);

  exports.Posts = Posts;

}).call(this);
