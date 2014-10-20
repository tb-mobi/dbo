var _demos_=true;
var psoAdapter={
	_url:"pso/"
	,session:{
		id:false
		,login:""
		,fio:""
		,time:false
		,signin:function(){
			/*if($.cookie('pso_session')!="undefined"){
				psoAdapter.session.id=$.cookie('pso_session');
				psoAdapter.session.init();
				return;
			}*/
			psoAdapter.session.login=(arguments.length>0)?arguments[0]:"SH"; // LOGIN is for test only
			var pass=(arguments.length>1)?arguments[1]:"3855359"; // PASSWORD is for test only
			$.ajax(psoAdapter._url+"signin/",{async:false,dataType:"json",data:{login:psoAdapter.session.login,pass:pass},success:function(p,s,x){psoAdapter.session.onSignin(p);}});
		}
		,onSignin:function(){
			psoResponse=(arguments.length>0)?arguments[0]:{"PSOCabinAuthResult":{"CardsArray":null,"Count":0,"CredInfo":null,"ErrorFlag":false,"Good_password":true,"Need_PAN":false,"Statement_of_Account":null,"StringArray":null,"StringField":"Забавнов Игорь Сергеевич","temp_id":"179863ba-748e-48e7-ab0b-9fb26855e4b0"}};		
			psoAdapter.session.id=psoResponse.sessionId;
			$.cookie('pso_session', psoAdapter.session.id, { expires: .0417, path: '/' });
			psoAdapter.session.fio=psoResponse.fullName;
			console.log("User "+psoAdapter.session.fio+" is signed in.");//$("[data-role='content']").append("<p>"+psoAdapter.session.fio+". Welcome.</p>");
			psoAdapter.session.init();
		}
		,onSigninPSO:function(){
			psoResponse=(arguments.length>0)?arguments[0]:{"PSOCabinAuthResult":{"CardsArray":null,"Count":0,"CredInfo":null,"ErrorFlag":false,"Good_password":true,"Need_PAN":false,"Statement_of_Account":null,"StringArray":null,"StringField":"Забавнов Игорь Сергеевич","temp_id":"179863ba-748e-48e7-ab0b-9fb26855e4b0"}};		
			psoAdapter.session.id=psoResponse.PSOCabinAuthResult.temp_id;
			$.cookie('pso_session', psoAdapter.session.id, { expires: .0417, path: '/' });
			psoAdapter.session.fio=psoResponse.PSOCabinAuthResult.StringField;
			$("[data-role='content']").append("<p>"+psoAdapter.session.fio+". Welcome.</p>");
			psoAdapter.session.init();
		}
		,init:function(){
			//psoAdapter.products=new Products();
			psoAdapter.phone=new Phone(psoAdapter.session.id);
			psoAdapter.accounts=new Accounts(psoAdapter.session.id);
		}
	}
	,phone:false
	,products:false
	,accounts:false
	,cards:{
		get:function(){
			$.getJSON(psoAdapter._url,{request:"PSOCabinGetCardsList",temp_id:psoAdapter.session.id}).success(psoAdapter.cards.onGet);
		}
		,onGet:function(){
			psoResponse=(arguments.length>0)?arguments[0]:false;
			if(!psoResponse)return;
			$("[data-role='content']").append("<h3>Cards</h3>");
			for(i in psoResponse.PSOCabinGetCardsListResult.CardsArray){
				$("[data-role='content']").append("<p>data row["+i+"] "+psoResponse.PSOCabinGetCardsListResult.CardsArray[i].Account_id+"</p>");
			}
		}
	}
};
function PSOAdapter(){
	var tut=this;
	tut.id=null;
	tut.login=null;
	tut.password=null;
	tut.name={
		first:null
		,middle:null
		,last:null
	};
}
function Products(){
	var _this=this;
	this._list=[];
	this.get=function(){
		id=(arguments.length>0)?arguments[0]:-1;
		for(i in psoAdapter.products._list){
			if(psoAdapter.products._list[i].id==id)return psoAdapter.products._list[i].name;
		}
	};
	this.getList=function(){return _this._list;};
	//$.getJSON(psoAdapter._url,{request:"PSOGetProductsList"}).success(function(){
	$.getJSON(psoAdapter._url+"products/").success(function(){
		psoResponse=(arguments.length>0)?arguments[0]:false;
		if(!psoResponse)return;
		_this._list=psoResponse;
		console.log("Product list:");
		for(i in psoResponse){
			var row=psoResponse[i];
			console.log("    product row["+row.id+"] "+row.name);
		}
		
	});
}
function Accounts(){
	if(arguments.length==0)return null;
	var _this=this;
	this.sessionId=arguments[0];
	this.callback=arguments[1];
	this.operations=[];
	this._list=[];
	this.get=function(){
		if(arguments.length==0)return false;
		var searchId=arguments[0];
		for(i in _this._list){
			var row=_this._list[i];
			if(row.id==searchId) return row;
		}
		return false;
	}
	this.getList=function(){return _this._list;}
	$.getJSON(psoAdapter._url+"accounts/",{sessionid:_this.sessionId}).success(function(){
		psoResponse=(arguments.length>0)?arguments[0]:false;
		if(!psoResponse)return;
		_this._list=psoResponse;
		_this.callback(_this._list);
		console.log("Accounts:");
		for(i in psoResponse){
			var row=psoResponse[i];
			console.log("    account row["+row.id+"] "+row.number+" "+psoAdapter.products.get(row.product)+"    доступно "+row.balance.avaliable);
			for(j in row.cardList){
				var row_card=row.cardList[j];
				console.log("        linked card ["+row_card.id+"] "+row_card.pan+"    ExpDate:"+row_card.expiredDate);
			}
			//get operations for each other
			_this._list[i].operations=new Operations(_this.sessionId,row.id,"01.01.2014 00:00:00","30.12.2014 23:59:59");
		}
	});
}
function Operations(){
	if(arguments.length==0)return null;
	var _this=this;
	this.sessionId=arguments[0];
	this.accountId=arguments[1];
	this.dateFrom=arguments[2];
	this.dateTo=arguments[3];
	this._list=[];
	this.get=function(){
		if(arguments.length==0)return false;
		var searchId=arguments[0];
		for(i in _this._list){
			var row=_this._list[i];
			if(row.id==searchId) return row;
		}
		return false;
	}
	this.getList=function(){return _this._list;}
	$.getJSON(psoAdapter._url+"operations/",{request:"PSOCabinGetOpersPeriod2",temp_id:_this.sessionId,acc_id:_this.accountId,date_beg:_this.dateFrom,date_end:_this.dateTo}).success(function(){
		psoResponse=(arguments.length>0)?arguments[0]:false;
		if(!psoResponse)return;
		_this._list=psoResponse;
		console.log("Operations for ["+_this.accountId+"]:");
		for(i in psoResponse){
			var row=psoResponse[i];
			console.log("    "+row.date+"    "+row.description.replace(/[\r\n]+/im,"")+"    "+row.amount);
		}
	});
}
function Phone(){
	if(arguments.length==0)return null;
	var _this=this;
	this.sessionId=arguments[0];
	this._val="";
	this.get=function(){return _this._val;}
	$.getJSON(psoAdapter._url+"phone/",{temp_id:_this.sessionId}).success(function(){
		psoResponse=(arguments.length>0)?arguments[0]:{"PSOGiveMeAPhoneResult":{"ErrorCode":null,"Message":"9623613322","is_registered":true}};
		if(!psoResponse)return;
		_this._val=psoResponse.phone;
		console.log("Phone number=+7"+_this._val);
	});
}
