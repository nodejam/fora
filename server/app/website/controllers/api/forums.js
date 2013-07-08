// Generated by CoffeeScript 1.6.2
(function() {
  var AppError, Controller, Forums, conf, controllers, models, utils, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  conf = require('../../../conf');

  models = new (require('../../../models')).Models(conf.db);

  utils = require('../../../common/utils');

  AppError = require('../../../common/apperror').AppError;

  Controller = require('../controller').Controller;

  controllers = require('./');

  Forums = (function(_super) {
    __extends(Forums, _super);

    function Forums() {
      this.getTypeSpecificController = __bind(this.getTypeSpecificController, this);
      this.invokeTypeSpecificController = __bind(this.invokeTypeSpecificController, this);
      this.removeItem = __bind(this.removeItem, this);
      this.editItem = __bind(this.editItem, this);
      this.createItem = __bind(this.createItem, this);
      this.remove = __bind(this.remove, this);
      this.edit = __bind(this.edit, this);
      this.create = __bind(this.create, this);      _ref = Forums.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Forums.prototype.create = function(req, res, next) {
      var _this = this;

      return this.ensureSession(arguments, function() {
        var stub;

        stub = req.body.name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9|-]/g, '').replace(/^\d*/, '');
        return models.Forum.get({
          network: req.network.stub,
          $or: [
            {
              stub: stub
            }, {
              name: req.body.name
            }
          ]
        }, {}, function(err, forum) {
          var message;

          if (forum) {
            return res.send('A forum with the same name exists.');
          } else {
            forum = new models.Forum;
            forum.network = req.network.stub;
            forum.type = req.body.type;
            forum.name = req.body.name;
            forum.description = req.body.description;
            forum.category = req.body.category;
            forum.icon = req.body.icon;
            forum.iconThumbnail = req.body.iconThumbnail;
            if (req.body.cover) {
              forum.cover = req.body.cover;
            }
            forum.stub = stub;
            forum.createdBy = req.user;
            forum.moderators.push(req.user);
            forum.createdAt = Date.now();
            forum.settings.comments = {
              enable: req.body.comments_enable ? Boolean(req.body.comments_enable) : true,
              showByDefault: req.body.comments_showByDefault ? Boolean(req.body.comments_showByDefault) : true
            };
            forum.save({}, function(err, forum) {
              return res.send(forum);
            });
            message = new models.Message({
              network: req.network.stub,
              userid: '0',
              type: "global-notification",
              reason: 'new-forum',
              related: [
                {
                  type: 'user',
                  id: req.user.id
                }
              ],
              data: {
                forum: forum
              }
            });
            return message.save({}, function(err, msg) {});
          }
        });
      });
    };

    Forums.prototype.edit = function(req, res, next) {
      var _this = this;

      return this.ensureSession(arguments, function() {
        return models.Forum.get({
          stub: req.params.forum,
          network: req.network.stub
        }, {}, function(err, forum) {
          var _ref1;

          if (req.user.id === forum.createdBy.id || _this.isAdmin(req.user, req.network)) {
            forum.description = req.body.description;
            forum.icon = req.body.icon;
            forum.iconThumbnail = req.body.iconThumbnail;
            if (req.body.cover) {
              forum.cover = req.body.cover;
            } else {
              forum.cover = '';
            }
            forum.tile = (_ref1 = req.body.tile) != null ? _ref1 : '/images/forum-tile.png';
            return forum.save({}, function(err, forum) {
              return res.send(forum);
            });
          } else {
            return next(new AppError("Access denied.", 'ACCESS_DENIED'));
          }
        });
      });
    };

    Forums.prototype.remove = function(req, res, next) {
      var _this = this;

      return this.ensureSession(arguments, function() {
        return models.Forum.get({
          stub: req.params.forum,
          network: req.network.stub
        }, {}, function(err, forum) {
          if (_this.isAdmin(req.user, req.network)) {
            return forum.destroy({}, function() {
              return res.send("DELETED " + forum.stub + ".");
            });
          } else {
            return next(new AppError("Access denied.", 'ACCESS_DENIED'));
          }
        });
      });
    };

    Forums.prototype.createItem = function(req, res, next) {
      return this.invokeTypeSpecificController(arguments, function(c) {
        return c.create;
      });
    };

    Forums.prototype.editItem = function(req, res, next) {
      return this.invokeTypeSpecificController(arguments, function(c) {
        return c.edit;
      });
    };

    Forums.prototype.removeItem = function(req, res, next) {
      return this.invokeTypeSpecificController(arguments, function(c) {
        return c.remove;
      });
    };

    Forums.prototype.invokeTypeSpecificController = function(_arg, getHandler) {
      var next, req, res,
        _this = this;

      req = _arg[0], res = _arg[1], next = _arg[2];
      return this.ensureSession([req, res, next], function() {
        return models.Forum.get({
          network: req.network.stub,
          stub: req.params.forum
        }, {}, function(err, forum) {
          return getHandler(_this.getTypeSpecificController(req.body.type))(req, res, next, forum);
        });
      });
    };

    Forums.prototype.getTypeSpecificController = function(type) {
      switch (type) {
        case 'article':
          return new controllers.Articles();
      }
    };

    return Forums;

  })(Controller);

  exports.Forums = Forums;

}).call(this);
