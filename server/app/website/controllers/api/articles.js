// Generated by CoffeeScript 1.6.2
(function() {
  var AppError, Articles, Controller, conf, db, models, utils, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  conf = require('../../../conf');

  db = new (require('../../../common/database')).Database(conf.db);

  models = require('../../../models');

  utils = require('../../../common/utils');

  AppError = require('../../../common/apperror').AppError;

  Controller = require('../controller').Controller;

  Articles = (function(_super) {
    __extends(Articles, _super);

    function Articles() {
      this.parseBody = __bind(this.parseBody, this);
      this.addComment = __bind(this.addComment, this);
      this.remove = __bind(this.remove, this);
      this.edit = __bind(this.edit, this);
      this.create = __bind(this.create, this);      _ref = Articles.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Articles.prototype.create = function(req, res, next, forum) {
      var article,
        _this = this;

      article = new models.Article;
      article.createdBy = req.user;
      article.forum = forum.summarize();
      article.rating = 0;
      if (req.body.publish === 'true') {
        article.publishedAt = Date.now();
        article.state = 'published';
      } else {
        article.state = 'draft';
      }
      this.parseBody(article, req.body);
      return article.save({
        user: req.user
      }, db, function(err, article) {
        var message;

        if (!err) {
          res.send(article);
          if (req.body.publish === 'true') {
            message = new models.Message({
              userid: '0',
              type: "global-notification",
              reason: 'published-article',
              related: [
                {
                  type: 'user',
                  id: req.user.id
                }, {
                  type: 'forum',
                  id: forum.stub
                }
              ],
              data: {
                article: article
              }
            });
            return message.save({}, db, function(err, msg) {});
          }
        } else {
          return next(err);
        }
      });
    };

    Articles.prototype.edit = function(req, res, next, forum) {
      var _handleError,
        _this = this;

      _handleError = this.handleError(next);
      return models.Article.getById(req.params.post, {}, db, function(err, article) {
        var alreadyPublished, _ref1;

        if (!err) {
          if (article) {
            if (article.createdBy.id === req.user.id || _this.isAdmin(req.user)) {
              alreadyPublished = article.state === 'published';
              if (!alreadyPublished && req.body.publish === 'true') {
                if ((_ref1 = article.publishedAt) == null) {
                  article.publishedAt = Date.now();
                }
                article.state = 'published';
              }
              _this.parseBody(article, req.body);
              return article.save({
                user: req.user
              }, db, _handleError(function(err, article) {
                var message;

                if (!err) {
                  if (article.createdBy.id === req.user.id && !alreadyPublished && req.body.publish === 'true') {
                    message = new models.Message({
                      userid: '0',
                      type: "global-notification",
                      reason: 'published-article',
                      related: [
                        {
                          type: 'user',
                          id: req.user.id
                        }, {
                          type: 'forum',
                          id: forum.stub
                        }
                      ],
                      data: {
                        article: article
                      }
                    });
                    return message.save({}, db, function(err, msg) {});
                  }
                }
              }));
            } else {
              return res.send('Access denied.');
            }
          } else {
            return res.send('Invalid article.');
          }
        } else {
          return next(err);
        }
      });
    };

    Articles.prototype.remove = function(req, res, next, forum) {
      var _this = this;

      return models.Article.getById(req.params.post, {}, db, function(err, article) {
        if (!err) {
          if (article) {
            if (article.createdBy.id === req.user.id || _this.isAdmin(req.user)) {
              return article.destroy({}, db, function(err, article) {
                return res.send(article);
              });
            } else {
              return res.send('Access denied.');
            }
          } else {
            return res.send("Invalid article.");
          }
        } else {
          return next(err);
        }
      });
    };

    Articles.prototype.addComment = function(req, res, next, forum) {
      var contentType, _ref1, _ref2, _ref3,
        _this = this;

      contentType = (_ref1 = (_ref2 = forum.settings) != null ? (_ref3 = _ref2.comments) != null ? _ref3.contentType : void 0 : void 0) != null ? _ref1 : 'text';
      if (contentType === 'text') {
        return models.Article.getById(req.params.post, {}, db, function(err, article) {
          var comment;

          comment = new models.Comment();
          comment.createdBy = req.user;
          comment.forum = forum.stub;
          comment.itemid = article._id.toString();
          comment.data = req.body.data;
          return comment.save({}, db, function(err, comment) {
            return res.send(comment);
          });
        });
      } else {
        return next(new AppError('Unsupported Comment Type', 'UNSUPPORTED_COMMENT_TYPE'));
      }
    };

    Articles.prototype.parseBody = function(article, body) {
      article.format = 'markdown';
      if (body.stub) {
        article.stub = body.stub.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9|-]/g, '').replace(/^\d*/, '');
      }
      if (body.title) {
        article.title = body.title;
      }
      if (body.content) {
        article.content = body.content;
      }
      if (body.cover) {
        article.cover = body.cover;
        if (body.coverTitle) {
          article.coverTitle = body.coverTitle;
        }
        return article.smallCover = body.smallCover;
      }
    };

    return Articles;

  })(Controller);

  exports.Articles = Articles;

}).call(this);
