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
//(function(){
"use strict";
/************************************************
* Application
************************************************/
window.App = Ember.Application.create({
	appTitle:"Temple Bank DBO"
	,contact:"8 (800) 194-94-65"
	,options:{
		pso:{
			url:"../pso/"
			,sessionid:null
		}
	}
	,ready:function(){}
	,LOG_TRANSITIONS: true
});
/************************************************
 * Exception handler
 ************************************************/
App.Exception=Ember.Object.extend({
	code:null
	,message:null
	,todo:null
});
/************************************************
 * Navigation
 ************************************************/
App.Navigation=Ember.Object.extend({
	id:null
	,name:null
	,href:null
});

/************************************************
 * Products
 ************************************************/
App.Product = Ember.Object.extend({
	id: null
	,name: null
	,description: null
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
			//App.AccountsController.initialize();
		}});
	}
});
//})();
