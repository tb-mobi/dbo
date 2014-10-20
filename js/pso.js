var _demos_=true;
window.dbo={};
dbo.Object=function(){
	var tut=this;
	tut.url=null;
	tut.callback=null;
	tut.template=null;
	tut.container=null;
	tut.get=function(n){
		return tut[n];
	};
	tut.set=function(n,v){
		tut[n]=v;
	};
	tut.__afterAll=function(){
		$(window).load();
		design();
	};
};
dbo.ListObject=function(){
	var tut=this;
	$.extend(tut,new dbo.Object());
	$.extend(tut,{
		list:[]
	});
};
dbo.Router=function(){
	var tut=this;
	tut.map=null;
	tut.route=function(link){
		new dbo[link.className.charAt(0).toUpperCase() + link.className.slice(1)]({
			template:getTemplate(link.template)
			,container:$("#content")
		});
	}
	$("a").each(function(){
		//console.debug("prevent default action to "+$(this).attr("href")+" of "+$(this).text());
		$(this).click(function(event) {
			event.preventDefault();
			var href=$(this).attr("href");
			//console.debug("routing to "+href);
			var link=tut.map[href];
			if(typeof link=="undefined")return false;
			tut.route(link);
			return false;
		})
	});
	$.getJSON("cfg/mapping.json").success(function(){
		tut.map=arguments[0];
	});
}
dbo.PSOAdapter=function(){
	var tut=this;
	$.extend(tut,new dbo.Object());
	$.extend(tut,{
		id:null
		,login:null
		,password:null
		,accounts:null
		,products:new dbo.Products()
		,router:new dbo.Router()
		,phone:null
		,names:null
		,name:{
			first:null
			,middle:null
			,last:null
		}
		,signin:function(){
			var success=(arguments.lenth)?arguments[0]:function(){}
			$.ajax(tut.url+"signin/",{async:false,dataType:"json",data:{login:tut.login,pass:tut.password},success:function(p,s,x){
				var usr=p.fullName.split(" ");
				$.cookie('pso_session',p.sessionId);
				tut.id=p.sessionId;
				tut.name={
					first:usr[1]
					,middle:usr[2]
					,last:usr[0]
				};
				if(tut.container!=null)tut.container.html(tut.template(tut.name));
				(tut.callback!=null)?tut.callback():null;
				success();
				tut.accounts=new dbo.Accounts({
					template:getTemplate('account.list')
					,container:$("#content")
					,products:tut.products
					,sessionId:tut.id
					,names:tut.names
				});
				tut.phone=new dbo.Phone();
			}});
		}
	});
	if(arguments.length){$.extend(tut,arguments[0]);}
	$.getJSON("data/accountNames.json").success(function(){tut.names=arguments[0];});
}
dbo.Phone=function(){
	var tut=this;
	$.extend(tut,new dbo.Object());
	$.extend(tut,{
		number:null
		,sessionId:$.cookie('pso_session')
	});
	(arguments.length)?$.extend(tut,arguments[0]):null;
	$.getJSON((tut.url!=null)?tut.url:psoUrl+"phone/",{temp_id:tut.sessionId}).success(function(){
		psoResponse=(arguments.length>0)?arguments[0]:{"PSOGiveMeAPhoneResult":{"ErrorCode":null,"Message":"9623613322","is_registered":true}};
		if(!psoResponse)return;
		tut.number=psoResponse.phone;
		console.log("Phone number=+7"+tut.number);
	});
}
dbo.Products=function(){
	var tut=this;
	$.extend(tut,new dbo.ListObject());
	$.extend(tut,{
		findById:function(){
			id=(arguments.length>0)?arguments[0]:-1;
			for(i in tut.list){
				if(tut.list[i].id==id)return tut.list[i].name;
			}
		}
	});
	if(arguments.length){$.extend(tut,arguments[0]);}
	$.getJSON((tut.url!=null)?tut.url:psoUrl+"products/").success(function(){
		psoResponse=(arguments.length>0)?arguments[0]:false;
		if(!psoResponse)return;
		tut.list=psoResponse;
		console.log("Products "+tut.list.length);
	});
}
dbo.Accounts=function(){
	var tut=this;
	$.extend(tut,new dbo.ListObject());
	$.extend(tut,{
		sessionId:$.cookie('pso_session')
	});
	$.extend(tut,arguments[0]);
	$.getJSON((tut.url!=null)?tut.url:psoUrl+"accounts/",{sessionid:tut.sessionId}).success(function(){
		psoResponse=(arguments.length>0)?arguments[0]:false;
		if(!psoResponse)return;
		tut.list=psoResponse;
		$.each(psoResponse,function(i,item){
			var adds={
				type:tut.products.findById(item.product)
				,name:"Позитрон"//(typeof item.name!="undefined")?item.name:tut.names[item.product]
				,mask:item.number.substr(16)
			};
			$.extend(tut.list[i],adds);
		});
		if(tut.container!=null)tut.container.html(tut.template(tut));
		(tut.callback!=null)?tut.callback(tut.list):null;
		console.log("Accounts:");
		tut.__afterAll();
	});
}
dbo.Operations=function(){
	if(arguments.length==0)return null;
	var tut=this;
	this.sessionId=arguments[0];
	this.accountId=arguments[1];
	this.dateFrom=arguments[2];
	this.dateTo=arguments[3];
	this._list=[];
	this.get=function(){
		if(arguments.length==0)return false;
		var searchId=arguments[0];
		for(i in tut._list){
			var row=tut._list[i];
			if(row.id==searchId) return row;
		}
		return false;
	}
	this.getList=function(){return tut._list;}
	$.getJSON(psoAdapter._url+"operations/",{request:"PSOCabinGetOpersPeriod2",temp_id:tut.sessionId,acc_id:tut.accountId,date_beg:tut.dateFrom,date_end:tut.dateTo}).success(function(){
		psoResponse=(arguments.length>0)?arguments[0]:false;
		if(!psoResponse)return;
		tut._list=psoResponse;
		console.log("Operations for ["+tut.accountId+"]:");
		for(i in psoResponse){
			var row=psoResponse[i];
			console.log("    "+row.date+"    "+row.description.replace(/[\r\n]+/im,"")+"    "+row.amount);
		}
	});
}
/*
var psoAdapter={
	_url:"pso/"
	,session:{
		id:false
		,login:""
		,fio:""
		,time:false
		,signin:function(){
			//if($.cookie('pso_session')!="undefined"){
			//	psoAdapter.session.id=$.cookie('pso_session');
			//	psoAdapter.session.init();
			//	return;
			//}
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
*/