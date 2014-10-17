/************************************************
 * User functions
 ************************************************/
function onAuthenticate(){
	console.log("Client: Signed in!");
	App.accountsController.initialize();
}
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
App = Ember.Application.create({
	appTitle:"Temple Bank DBO"
	,options:{
		pso:{
			url:"../pso/"
		}
	}
	,ready:function(){}
});
/************************************************
 * Error handler
 ************************************************/
App.ErrorModel=Ember.Object.extend({
	code:""
	,message:""
	,todo:""
});
/************************************************
 * User session
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
			tut.set("psoSessionId",psoResponse.sessionId);
			tut.set("name",n);
			console.log("PSO sessionId:"+tut.get("psoSessionId"));
			console.log("Client name:"+n.first+" "+n.middle+" "+n.last);
			onAuthenticate();
		}});
	}
});
App.UserController=Ember.Controller.extend({
	user:App.User.create()
	,initialize:function(){
		var tut=this;
		tut.get("user").signin();
	}
});
App.applicationController = App.UserController.create();
App.UserView=Ember.View.extend({
	template: getView('user')
	,name:"UserView"
    ,init: function () {
        this._super();
        this.set('controller',App.applicationController);
    }
});
/************************************************
 * Products
 ************************************************/
App.Product = Ember.Object.extend({
	id: null
    ,name: null
    ,description: null
});
App.productsController = Ember.ArrayController.create({
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
App.accountsController = Ember.ArrayController.create({
    content: []
	,currentAccount:null
	,initialize:function(){
		var tut = this;
		$.getJSON(App.options.pso.url+'accounts/',{sessionid:App.applicationController.get("user").psoSessionId}).success(function(data){
			console.log("Accounts:");
			var i=0;
			data.forEach(function(row){
				row.name=App.productsController.findById(row.product).name;
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
        this.set('controller', App.accountsController);
    }
    ,name: "AccountComboView"
});
/************************************************
 * Main view
 ************************************************/
App.ApplicationView = Ember.View.extend({
    Title: "Example of Ember.js application",
    //template: getView('main'),
    template: getView('transfer'),
    init: function () {
        this._super();
        this.set('controller', App.applicationController);
    },
    name: "ApplicationView"
});
App.IndexRoute = Ember.Route.extend({
    model: function () {
        return App.applicationController.initialize();
    }
});
/*
App.Router.map(function() {
   this.resource( 'index', { path: '/' } ); // Переносит нас на "/"
});
*/
