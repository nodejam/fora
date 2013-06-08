// Generated by CoffeeScript 1.6.2
(function() {
  var AppError,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AppError = (function(_super) {
    __extends(AppError, _super);

    function AppError(message, name) {
      this.message = message;
      this.name = name;
      this.toString = __bind(this.toString, this);
    }

    AppError.prototype.toString = function() {
      return "" + this.name + ": " + this.message;
    };

    return AppError;

  })(Error);

  exports.AppError = AppError;

}).call(this);
