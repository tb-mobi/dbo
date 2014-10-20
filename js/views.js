/************************************************
 * User
 ************************************************/
App.UserView=Ember.View.extend({
	template: getView('user')
	,templateName:"user"
	,name:"UserView"
	,init: function () {
		this._super();
		this.set('controller',App.applicationController);
	}
});
/************************************************
 * Views
 ************************************************/
App.AccountsView =Ember.View.extend({
	template: getView('account.list')
	,templateName:"accounts"
	,name:'accounts'
	,init: function () {
		this._super();
		this.set('controller', App.applicationController);
	}
});
App.AccountComboView = Ember.View.extend({
	template: getView('accounts.combo')
	,init: function () {
		this._super();
		this.set('controller', App.applicationController);
	}
	,name: "AccountComboView"
});
/************************************************
 * Navigation
 ************************************************/
App.NavigationView = Ember.View.extend({
	template: getView('nav')
	,templateName:"nav"
	,init: function () {
		this._super();
		this.set('controller',App.applicationController);
	}
	,name: "NavigationView"
});
/************************************************
 * Header
 ************************************************/
App.HeaderView = Ember.View.extend({
	template: getView('header')
	,templateName:"header"
	,init: function () {
		this._super();
		this.set('controller',App.applicationController);
	}
	,name: "HeaderView"
});
/************************************************
 * Footer
 ************************************************/
App.FooterView = Ember.View.extend({
	template: getView('footer')
	,init: function () {
		this._super();
		this.set('controller',App.applicationController);
	}
	,name: "FooterView"
});
/************************************************
 * Main view
 ************************************************/
App.ApplicationView = Ember.View.extend({
	Title: "Temple bank",
	template: getView('main'),
	//template: getView('transfer'),
	//controller:App.applicationController,
	init: function () {
		console.debug('application view started');
		this._super();
		this.set('controller',App.applicationController);
	},
	name: "ApplicationView"
});
/************************************************
 * Exception handler
 ************************************************/
App.ExceptionView=Ember.View.extend({
	template:getView("error")
	,init: function () {
		this._super();
		this.set('controller', App.applicationController);
	}
	,name: "ExceptionView"
});
