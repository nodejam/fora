// Generated by CoffeeScript 1.6.2
(function() {
  var AppError, BaseModel, Session, models, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AppError = require('../common/apperror').AppError;

  models = require('./');

  BaseModel = require('./basemodel').BaseModel;

  Session = (function(_super) {
    __extends(Session, _super);

    function Session() {
      _ref = Session.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Session._getMeta = function() {
      return {
        type: Session,
        collection: 'sessions',
        fields: {
          passkey: 'string',
          accessToken: 'string',
          userid: 'string',
          createdAt: {
            autoGenerated: true,
            event: 'created'
          },
          updatedAt: {
            autoGenerated: true,
            event: 'updated'
          }
        },
        logging: {
          isLogged: false
        }
      };
    };

    return Session;

  })(BaseModel);

  exports.Session = Session;

}).call(this);
