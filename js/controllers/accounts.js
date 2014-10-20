/************************************************
 * Controllers
 ************************************************/
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