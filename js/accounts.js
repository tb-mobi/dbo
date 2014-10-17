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
App.AccountController = Ember.ArrayController.create({
    content: []
	,currentAccount:null
	,init:function(){
		var tut = this;
		$.getJSON(App.options.pso.url+'accounts/',{sessionid:App.UserController.get("user").psoSessionId}).success(function(data){
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
        this.set('controller', App.AccountController);
    }
    ,name: "AccountComboView"
});
