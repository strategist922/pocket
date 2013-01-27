(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  pocket.Views.dashboardView = (function(_super) {

    __extends(dashboardView, _super);

    function dashboardView() {
      this.onSignInFail = __bind(this.onSignInFail, this);

      this.onSignInSuccess = __bind(this.onSignInSuccess, this);

      this.renderSignin = __bind(this.renderSignin, this);

      this.render = __bind(this.render, this);
      return dashboardView.__super__.constructor.apply(this, arguments);
    }

    dashboardView.prototype.template = 'dashboard';

    dashboardView.prototype.initialize = function() {
      dashboardView.__super__.initialize.apply(this, arguments);
      this.setElement($('.main'));
      return this.appInfo = pocket.appInfo;
    };

    dashboardView.prototype.active = function() {
      if (pocket.isAuthenticated) {
        return this.loadStats();
      } else {
        return this.renderSignin();
      }
    };

    dashboardView.prototype.loadStats = function() {
      return hoodie.admin.stats(1358610679).then(this.render);
    };

    dashboardView.prototype.render = function(stats) {
      this.stats = stats;
      this.$el.html(Handlebars.VM.template(JST[this.template])(this));
      return dashboardView.__super__.render.apply(this, arguments);
    };

    dashboardView.prototype.renderSignin = function() {
      var _this = this;
      this.$el.html(Handlebars.VM.template(JST["signin"])(this));
      return $('form.signIn').submit(function(event) {
        var password;
        $('#signIn').attr('disabled', 'disabled');
        event.preventDefault();
        password = $('#signInPassword').val();
        return hoodie.admin.signIn(password).done(_this.onSignInSuccess).fail(_this.onSignInFail);
      });
    };

    dashboardView.prototype.onSignInSuccess = function() {
      return window.location.reload();
    };

    dashboardView.prototype.onSignInFail = function() {
      $('form.signIn .error').text('Wrong password, please try again');
      return $('#signIn').attr('disabled', null);
    };

    return dashboardView;

  })(pocket.Views.baseView);

}).call(this);
