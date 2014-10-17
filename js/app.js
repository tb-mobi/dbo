(function(wnd){
//var wnd=window;
	"use strict";
	/************************************************
	* User functions
	************************************************/
	function getView(name) {
		var template = '';
		$.ajax({
			url: 'templates/' + name + '.html',
			async: false,
			success: function (text) {
				template = text;
			}
		});
		return Ember.Handlebars.compile(template);
	};
	/************************************************
	* Application
	************************************************/
	wnd.App = Ember.Application.create({
		appTitle:"Temple Bank DBO"
		,contact:"8 (800) 194-94-65"
		,options:{
			pso:{
				url:"../pso/"
				,sessionid:null
			}
		}
		,ready:function(){}
	});
	/************************************************
	 * Exception handler
	 ************************************************/
	App.Exception=Ember.Object.extend({
		code:null
		,message:null
		,todo:null
	});
	App.ExceptionController=Ember.ObjectController.extend({
		current:null
	});
	App.ExceptionView=Ember.View.extend({
		template:getView("error")
		,controller:App.ExceptionController
		,init: function () {
			this._super();
		}
		,name: "ExceptionView"
	});
	/************************************************
	 * Products
	 ************************************************/
	App.Product = Ember.Object.extend({
		id: null
		,name: null
		,description: null
	});
	App.ProductsController = Ember.ArrayController.create({
		content: []
		,init:function(){
			var self = this;
			$.getJSON(App.options.pso.url+'products/').success(function(data){
				data.forEach(function(item){
					console.log("product row["+item.id+"] "+item.name);
					self.pushObject(App.Product.create(item));
				});
			});
		}
		,findById:function(){
			if(arguments.length==0)return false;
			var tut=this;
			var searchId=arguments[0];
			return tut.findBy("id",searchId);
			this.get("content").forEach(function(row){
				if(row.id==searchId) return row;
			});
			return false;
		}
	});
	/************************************************
	 * Accounts
	 ************************************************/
	App.Account = Ember.Object.extend({
		id: null
		,order:null
		,number:null
		,name: null
		,description: null
		,product:null
		,balance:null
		,state:null
		,cards:null
		,currency:null
		,mask:null
	});
	App.AccountsController = Ember.ArrayController.create({
		content: []
		,currentAccount:null
		,initialize:function(){
			var tut = this;
			$.getJSON(App.options.pso.url+'accounts/',{sessionid:App.options.pso.sessionid}).success(function(data){
				console.log("Accounts:");
				var i=0;
				data.forEach(function(row){
					row.name=App.ProductsController.findById(row.product).name;
					row.order=i;
					row.mask=" ..."+row.number.substr(16);
					//debug
					console.log("    account row["+row.id+"] "+row.number+" "+row.name+"    доступно "+row.balance.avaliable);
					row.cardList.forEach(function(row_card){console.log("        linked card ["+row_card.id+"] "+row_card.pan+"    ExpDate:"+row_card.expiredDate);});
					// end debug
					var acc=App.Account.create(row);
					if(tut.get("currentAccount")==null)tut.set("currentAccount",acc);
					tut.pushObject(acc);
					++i;
				});
			});
		}
		,findById:function(){
			if(arguments.length==0)return false;
			var searchId=arguments[0];
			this.get("content").forEach(function(row){
				var row=_this._list[i];
				if(row.id==searchId) return row;
			});
			return false;
		}
	});
	App.AccountComboView = Ember.View.extend({
		template: getView('accounts.combo')
		,init: function () {
			this._super();
			this.set('controller', App.AccountsController);
		}
		,name: "AccountComboView"
	});
	App.AccountsView =Ember.View.extend({
		template: getView('account.list')
		,templateName:"accounts"
		,name:'accounts'
		,init: function () {
			this._super();
			this.set('controller', App.AccountsController);
		}
	});
	App.AccountsRoute = Ember.Route.extend({
		model:function(){
			return App.AccountsController;
		}
	});
	/************************************************
	 * User
	 ************************************************/
	App.User = Ember.Object.extend({
		psoSessionId:null
		,mobiSessionId:null
		,phone:null
		,name:null
		,login:""
		,password:null
		,signin:function(){
			var login=(arguments.length>0)?arguments[0]:"SH"; // LOGIN is for test only
			var pass=(arguments.length>1)?arguments[1]:"3855359"; // PASSWORD is for test only
			var tut=this;
			$.ajax(App.options.pso.url+"signin/",{async:false,dataType:"json",data:{login:login,pass:pass},success:function(p,s,x){
				var psoResponse=p;		
				var ns=psoResponse.fullName.split(" ");
				var n={
					first:ns[1]
					,middle:ns[2]
					,last:ns[0]
				};
				App.options.pso.sessionid=psoResponse.sessionId
				tut.set("psoSessionId",psoResponse.sessionId);
				tut.set("name",n);
				console.log("PSO sessionId:"+tut.get("psoSessionId"));
				console.log("Client name:"+n.first+" "+n.middle+" "+n.last);
				App.AccountsController.initialize();
			}});
		}
	});
	App.UserController=Ember.Controller.create({
		user:App.User.create()
		,init:function(){
			var tut=this;
			tut.get("user").signin();
		}
	});
	App.UserView=Ember.View.extend({
		template: getView('user')
		,templateName:"user"
		,name:"UserView"
		,controller:App.UserController
		,init: function () {
			this._super();
		}
	});
	/************************************************
	 * Header
	 ************************************************/
	App.Navigation=Ember.Object.extend({
		id:null
		,name:null
		,href:null
	});
	App.NavigationController=Ember.ArrayController.extend({
		content: []
		,contact:"8 (800) 194-94-65"
		,init:function(){
			var tut = this;
			$.getJSON('data/navigation.json').success(function(data){
				console.log("Got navigation");
				data.forEach(function(item){
					console.debug(item.href+" => "+item.name);
					tut.pushObject(App.Navigation.create(item));
				});
			});
		}
	});
	App.HeaderView = Ember.View.extend({
		template: getView('header')
		,templateName:"header"
		,init: function () {
			this._super();
			this.set('controller',App.NavigationController);
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
			this.set('controller',App.NavigationController);
		}
		,name: "FooterView"
	});
	/************************************************
	 * Main view
	 ************************************************/
	App.ApplicationController=Ember.ObjectController.extend({
		initialize:function(){
			console.log('Starting application');
		}
	});
	App.ApplicationView = Ember.View.extend({
		Title: "Temple bank",
		template: getView('main'),
		//template: getView('transfer'),
		init: function () {
			this._super();
			this.set('controller',App.ApplicationController);
		},
		name: "ApplicationView"
	});
	/************************************************
	 * Routes
	 ************************************************/
	App.IndexRoute = Ember.Route.extend({
		model: function () {
			return App.ApplicationController.create();
		}
	});
	App.Router.map(function(){
		this.resource('accounts');
		this.resource('payments');
		this.resource('transfers');
		this.resource('services');
	});
})(window);