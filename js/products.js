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