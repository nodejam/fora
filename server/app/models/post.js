// Generated by CoffeeScript 1.6.2
(function() {
  var AppError, BaseModel, Post, async, mdparser, models, utils,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  async = require('../common/async');

  utils = require('../common/utils');

  AppError = require('../common/apperror').AppError;

  mdparser = require('../common/markdownutil').marked;

  models = require('./');

  BaseModel = require('./basemodel').BaseModel;

  Post = (function(_super) {
    __extends(Post, _super);

    Post._getMeta = function() {
      var articleModule, forumModule, userModule;

      articleModule = require('./article');
      userModule = require('./user');
      forumModule = require('./forum');
      return {
        type: Post,
        collection: 'posts',
        fields: {
          type: 'string',
          forum: {
            type: forumModule.Forum.Summary
          },
          createdBy: {
            type: userModule.User.Summary,
            validate: function() {
              return this.createdBy.validate();
            }
          },
          meta: {
            type: 'array',
            contents: 'string'
          },
          createdAt: {
            autoGenerated: true,
            event: 'created'
          },
          updatedAt: {
            autoGenerated: true,
            event: 'updated'
          }
        },
        concurrency: 'optimistic',
        logging: {
          isLogged: true,
          onInsert: 'NEW_POST'
        }
      };
    };

    Post.search = function(criteria, settings, context, db, cb) {
      var k, limit, params, v;

      limit = Post.getLimit(settings.limit, 100, 1000);
      params = {};
      for (k in criteria) {
        v = criteria[k];
        params[k] = v;
      }
      return Post.find(params, (function(cursor) {
        return cursor.sort(settings.sort).limit(limit);
      }), context, db, cb);
    };

    function Post(params) {
      this.save = __bind(this.save, this);
      var _ref, _ref1, _ref2, _ref3;

      if ((_ref = this.recommendations) == null) {
        this.recommendations = [];
      }
      if ((_ref1 = this.meta) == null) {
        this.meta = [];
      }
      if ((_ref2 = this.tags) == null) {
        this.tags = [];
      }
      if ((_ref3 = this.rating) == null) {
        this.rating = 1;
      }
      this.createdAt = Date.now();
      Post.__super__.constructor.apply(this, arguments);
    }

    Post.prototype.save = function(context, db, cb) {
      var _this = this;

      if (this.stub) {
        return Post.get({
          stub: this.stub
        }, {}, db, function(err, post) {
          if (!post) {
            return Post.__super__.save.apply(_this, arguments);
          } else {
            return cb(new AppError("Stub already exists", "STUB_EXISTS"));
          }
        });
      } else {
        return Post.__super__.save.apply(this, arguments);
      }
    };

    return Post;

  }).call(this, BaseModel);

  exports.Post = Post;

}).call(this);
