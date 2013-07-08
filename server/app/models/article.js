// Generated by CoffeeScript 1.6.2
(function() {
  var AppError, Article, BaseModel, async, mdparser, postModule, utils,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  async = require('../common/async');

  utils = require('../common/utils');

  AppError = require('../common/apperror').AppError;

  mdparser = require('../common/markdownutil').markedb;

  BaseModel = require('./basemodel').BaseModel;

  postModule = require('./post');

  Article = (function(_super) {
    var Summary, _ref;

    __extends(Article, _super);

    Article._getMeta = function() {
      var fields, meta, parentMeta;

      meta = {
        fields: {
          stub: {
            type: 'string',
            required: false
          },
          state: {
            type: 'string',
            validate: function() {
              return ['draft', 'published'].indexOf(this.state);
            }
          },
          title: 'string',
          summary: {
            type: 'string',
            required: 'false'
          },
          publishedAt: {
            type: 'number',
            validate: function() {
              return this.state === 'published' && !this.publishedAt;
            }
          }
        }
      };
      parentMeta = postModule.Post._getMeta();
      return fields = parentMeta.fields;
    };

    function Article() {
      this.summarize = __bind(this.summarize, this);      this.type = 'article';
      Article.__super__.constructor.apply(this, arguments);
    }

    Article.prototype.summarize = function() {
      var summary;

      return summary = new Summary({
        id: this._id.toString(),
        network: this.network,
        uid: this.uid,
        title: this.title,
        createdAt: this.createdAt,
        timestamp: this.timestamp,
        publishedAt: this.publishedAt,
        createdBy: this.createdBy
      });
    };

    Summary = (function(_super1) {
      __extends(Summary, _super1);

      function Summary() {
        _ref = Summary.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      Summary._getMeta = function() {
        var userModule;

        userModule = require('./user');
        return {
          type: Summary,
          fields: {
            id: 'string',
            network: 'string',
            uid: 'string',
            title: 'string',
            createdAt: 'number',
            timestamp: 'number',
            publishedAt: 'number',
            createdBy: userModule.User.Summary
          }
        };
      };

      return Summary;

    })(BaseModel);

    return Article;

  }).call(this, postModule.Post);

  exports.Article = Article;

}).call(this);
