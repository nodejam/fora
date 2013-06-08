// Generated by CoffeeScript 1.6.2
(function() {
  var Comment, Forum, ItemView, Message, Models, Network, Post, Session, Token, User, UserInfo;

  Session = require('./session').Session;

  User = require('./user').User;

  Post = require('./post').Post;

  Forum = require('./forum').Forum;

  Token = require('./token').Token;

  UserInfo = require('./userinfo').UserInfo;

  Message = require('./message').Message;

  Network = require('./network').Network;

  ItemView = require('./itemview').ItemView;

  Comment = require('./comment').Comment;

  Models = (function() {
    function Models(dbconf) {
      var model, _i, _len, _ref;

      this.dbconf = dbconf;
      this.Session = Session;
      this.User = User;
      this.Post = Post;
      this.Forum = Forum;
      this.Token = Token;
      this.UserInfo = UserInfo;
      this.Message = Message;
      this.Network = Network;
      this.ItemView = ItemView;
      this.Comment = Comment;
      _ref = [Session, User, Post, Forum, Token, UserInfo, Message, Network, ItemView, Comment];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        model = _ref[_i];
        this.initModel(model);
      }
    }

    Models.prototype.initModel = function(model) {
      model._database = new (require('../common/database')).Database(this.dbconf);
      return model._models = this;
    };

    return Models;

  })();

  exports.Models = Models;

}).call(this);
