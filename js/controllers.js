/************************************************
 * Application
 ************************************************/
App.ApplicationController=Ember.Controller.extend({
	initialize:function(){
		var tut=this;
		console.log('Starting application');
		tut.get("navigation").create();
		tut.get("products").create();
		tut.get("user").signin();
	}
	,navigation:Ember.ArrayController.extend({
		content:[]
		,init:function(){
			var tut = this;
			$.getJSON('data/navigation.json').success(function(data){
				console.debug("Got navigation ["+data.length+" items]");
				data.forEach(function(item){
					//console.debug(item.href+" => "+item.name);
					tut.pushObject(App.Navigation.create(item));
				});
			})
		}
	})
	,products:Ember.ArrayController.extend({
		content: []
		,init:function(){
			var self = this;
			$.getJSON(App.options.pso.url+'products/').success(function(data){
				console.debug("Got products ["+data.length+" items]");
				data.forEach(function(item){
					//console.debug("product row["+item.id+"] "+item.name);
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
	})
	,user:App.User.create({login:"SH",password:"3855359"})
	//,user:App.User.create()
});
App.applicationController=App.ApplicationController.create();
/************************************************
 * Accounts
 ************************************************/
App.AccountsController = Ember.Controller.extend({
	currentAccount:null
	,accounts:Ember.ArrayController.create({content:[]})
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
				tut.get("accounts").pushObject(acc);
				++i;
			});
		});
	}
	,actions:{}
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
