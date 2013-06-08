// Generated by CoffeeScript 1.6.2
(function() {
  var AppError, BaseModel, Post, async, mdparser, utils,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  async = require('../common/async');

  utils = require('../common/utils');

  AppError = require('../common/apperror').AppError;

  BaseModel = require('./basemodel').BaseModel;

  mdparser = require('../common/markdownutil').marked;

  Post = (function(_super) {
    __extends(Post, _super);

    /*
        Fields
            - network (string)        
            - uid (random unique id)
            - stub (string, eg: 'funny-monsters')
            - forum (name of the forum to which this belongs)
            - state (string; 'draft' or 'published')
            - createdBy (summarized user)
            - title (string; exists if type is 'free-verse')
            - recommendations
            - meta (array of string)
            - rating (integer)
            - summary
            - publishedAt (integer)
        }
    */


    Post._meta = {
      type: Post,
      forum: 'posts',
      autoInsertedFields: {
        created: 'createdAt',
        updated: 'timestamp'
      },
      concurrency: 'optimistic',
      logging: {
        isLogged: true,
        onInsert: 'NEW_POST'
      }
    };

    Post.search = function(criteria, settings, context, cb) {
      var k, limit, params, v;

      limit = Post.getLimit(settings.limit, 100, 1000);
      params = {};
      for (k in criteria) {
        v = criteria[k];
        params[k] = v;
      }
      return Post.find(params, (function(cursor) {
        return cursor.sort(settings.sort).limit(limit);
      }), context, cb);
    };

    function Post(params) {
      this.validate = __bind(this.validate, this);
      this.createView = __bind(this.createView, this);
      this.summarize = __bind(this.summarize, this);
      this.save = __bind(this.save, this);
      var _ref, _ref1, _ref2, _ref3, _ref4;

      if ((_ref = this.forums) == null) {
        this.forums = [];
      }
      if ((_ref1 = this.recommendations) == null) {
        this.recommendations = [];
      }
      if ((_ref2 = this.meta) == null) {
        this.meta = [];
      }
      if ((_ref3 = this.tags) == null) {
        this.tags = [];
      }
      if ((_ref4 = this.rating) == null) {
        this.rating = 1;
      }
      this.createdAt = Date.now();
      Post.__super__.constructor.apply(this, arguments);
    }

    Post.prototype.save = function(context, cb) {
      var _ref,
        _this = this;

      if (!this._id) {
        if ((_ref = this.uid) == null) {
          this.uid = utils.uniqueId();
        }
      }
      if (this.stub) {
        return Post.get({
          stub: this.stub
        }, {}, function(err, post) {
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

    Post.prototype.summarize = function(fields) {
      var result;

      if (fields == null) {
        fields = [];
      }
      fields = fields.concat(['uid', 'title', 'createdAt', 'timestamp', 'publishedAt', 'createdBy', 'network']);
      result = Post.__super__.summarize.call(this, fields);
      result.id = this._id.toString();
      return result;
    };

    Post.prototype.createView = function(type) {
      switch (type) {
        case 'summary':
        case 'full':
          return {
            type: 'post',
            summary: {
              title: this.summary.title,
              text: this.summary.text ? mdparser(this.summary.text) : void 0,
              image: this.summary.image
            },
            uid: this.uid,
            createdBy: this.createdBy,
            forums: this.forums,
            title: this.title,
            content: this.content ? mdparser(this.content) : void 0,
            cover: this.cover
          };
      }
    };

    Post.refreshForumSnapshot = function(post, context, cb) {
      var forum, _i, _len, _ref, _results;

      _ref = post.forums;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        forum = _ref[_i];
        _results.push(Post._models.Forum.get({
          stub: forum.stub
        }, {}, function(err, forum) {
          return Post.search({
            "forums.stub": forum.stub,
            state: 'published'
          }, {
            sort: {
              publishedAt: -1
            },
            limit: 4
          }, {}, function(err, posts) {
            return Post.getCursor({
              "forums.stub": forum.stub,
              state: 'published'
            }, context, function(err, cursor) {
              return cursor.count(function(err, count) {
                var p;

                forum.snapshot = {
                  recentPosts: (function() {
                    var _j, _len1, _results1;

                    _results1 = [];
                    for (_j = 0, _len1 = posts.length; _j < _len1; _j++) {
                      p = posts[_j];
                      _results1.push(p.summarize());
                    }
                    return _results1;
                  })()
                };
                forum.totalItems = count;
                forum.lastRefreshedAt = posts[0] ? posts[0].publishedAt : 0;
                return forum.save(context, cb);
              });
            });
          });
        }));
      }
      return _results;
    };

    Post.validateForumSnapshot = function(forum) {
      var errors, item, _errors, _i, _len, _ref;

      errors = [];
      if (forum.snapshot) {
        _ref = forum.snapshot.recentPosts;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          _errors = Post.validateSummary(item);
          if (_errors.length) {
            errors = errors.concat(_errors);
          }
          if (isNaN(forum.totalItems)) {
            errors.push("snapshot.totalPosts should be a number.");
          }
          if (isNaN(forum.lastRefreshedAt)) {
            errors.push("snapshot.lastRefreshedAt should be a number.");
          }
        }
      }
      return errors;
    };

    Post.validateSummary = function(post) {
      var errors, field, required, _errors, _i, _len;

      errors = [];
      if (!post) {
        errors.push("Invalid post.");
      }
      required = ['id', 'uid', 'title', 'createdAt', 'timestamp', 'publishedAt', 'createdBy'];
      for (_i = 0, _len = required.length; _i < _len; _i++) {
        field = required[_i];
        if (!post[field]) {
          errors.push("Invalid " + field);
        }
      }
      _errors = Post._models.User.validateSummary(post.createdBy);
      if (_errors.length) {
        errors.push('Invalid createdBy.');
        errors = errors.concat(_errors);
      }
      return errors;
    };

    Post.prototype.validate = function() {
      var errors, forum, user, _errors, _i, _j, _len, _len1, _ref, _ref1;

      errors = Post.__super__.validate.call(this).errors;
      if (!this.network || typeof this.network !== 'string') {
        errors.push('Invalid network.');
      }
      if (!this.uid) {
        errors.push('Invalid stub.');
      }
      if (!this.forums.length) {
        errors.push('Post should belong to at least one forum.');
      }
      _ref = this.forums;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        forum = _ref[_i];
        _errors = Post._models.Forum.validateSummary(forum);
        if (_errors.length) {
          errors.push("Invalid forum.");
          errors = errors.concat(_errors);
        }
      }
      if (!this.state || (this.state !== 'published' && this.state !== 'draft')) {
        errors.push('Invalid state.');
      }
      _errors = Post._models.User.validateSummary(this.createdBy);
      if (_errors.length) {
        errors.push('Invalid createdBy.');
        errors = errors.concat(_errors);
      }
      _ref1 = this.recommendations;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        user = _ref1[_j];
        _errors = Post._models.User.validateSummary(user);
        if (_errors.length) {
          errors.push("Invalid recommendation.");
          errors = errors.concat(_errors);
        }
      }
      if (isNaN(this.rating)) {
        errors.push('Rating must be a number.');
      }
      if (this.publishedAt && isNaN(this.publishedAt)) {
        errors.push('PublishedAt must be a number.');
      }
      if (this.state === 'published') {
        if (!this.summary.title) {
          errors.push('Invalid summary title.');
        }
        if (!this.summary.text) {
          errors.push('Invalid summary text.');
        }
      }
      return {
        isValid: errors.length === 0,
        errors: errors
      };
    };

    return Post;

  }).call(this, BaseModel);

  exports.Post = Post;

}).call(this);
