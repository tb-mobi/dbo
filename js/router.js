/************************************************
 * Routes
 ************************************************/
App.IndexRoute = Ember.Route.extend({
	model: function () {
		console.debug(typeof App);
		console.debug(typeof App.applicationController);
		return App.applicationController.initialize();
	}
});
App.Router.map(function(){
	this.resource('index',{path:'/'});
	this.resource('accounts',{path:'/accounts'},function(){
		this.route('accounts');
	});
	this.resource('payments',{path:'payments'});
	this.resource('transfers');
	this.resource('services');
});
/*App.AccountsRoute=Ember.Route.extend({
	model:function(){
		//return this.store.find('accounts');
		return App.accountsController.initialize();
	}
	,renderTemplate: function(controller) {
		this.render('temple/accounts', {controller: controller});
	}
});*/