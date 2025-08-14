class ArticleSelected{
	constructor(){
		this.pannelSelector=".articleSelectedPannel"
	}
	
	deleteData(d={}){
		let i=this.checkIfAlreadySelectedArticle(d);
		window["arSelectedArticle"].splice(i,1);
		return window["arSelectedArticle"]
	}
	
	refreshData(d={}){
		// console.log(d);
		if(typeof(window["arSelectedArticle"])==="undefined" || window["arSelectedArticle"]===null){
			window["arSelectedArticle"]=[];
		}
		// 
		if(window["arSelectedArticle"].length===0){
			window["arSelectedArticle"].push(d);
		}else if(this.checkIfAlreadySelectedArticle(d)===0){
			window["arSelectedArticle"].push(d);
		} ;
		return window["arSelectedArticle"]
		// this.refreshPannel();
	}
	selPanSklt(){
		
		let data=[]
		let li=`<ul>`;
		console.log(window["arSelectedArticle"]);
		let qteKey=(window["curentOperation"]==="newDsp")?"QteDS":"QteDem";
				window["arSelectedArticle"].forEach((v, k) => {
					li+=`<li>${v["CodeArticle"]} : ${v[qteKey]} </li>`
					data.push(v[qteKey]);
					});
				li+=`</ul>`
		let pie=`<span class="sparkpie">${data.join(",")} </span>`
		let s=`<table><tr><td class="pieSelectedArt">${pie} </td><td class="listSelectedArt">${li} </td></tr></table>`
		
		return s
	}
	refreshPannel(){
		/* important setupPannel
la meme interface est ouvert qu'il s'agin d'un newDsp ou d'un newChqMSerie , la décision sur les actions seront ptise dans la ClassDemandeSpecial.setupPannel
		*/
		if(typeof window["curentOperation"]=== "undefined" || window["curentOperation"]===null || window["curentOperation"]==="newDsp"){
			window["curentOperation"]="newDsp";
			
		}else if(window["curentOperation"]==="newChqMSerie") {
		console.log(window["curentOperation"]);
		}
		setTimeout( async()=>{
				let mydsp=new ClassDemandeSpecial();
			await mydsp.setupPannel()
			} ,10);
		
		setTimeout(()=>{
			let articleSelectedPannelSelector="#dspPannel div .body div.articleSelectedPannel";
		$(articleSelectedPannelSelector).html(this.selPanSklt())
		
		setTimeout(()=>{
			$('.sparkpie').sparkline('html', { type: 'pie', height: '1.50em' });
		} ,500)
		
		},1000)
		
		
		$(this.pannelSelector).off();
		showNotification({text:this.transformToText(window["arSelectedArticle"]), colorName:'alert-info', timer:100})
	}
	checkIfAlreadySelectedArticle(d){
		let alreadyS=0;
		window["arSelectedArticle"].forEach((v, k) => {
			if(v["CodeArticle"]===d["CodeArticle"]){
				alreadyS=k;
				let qField=(window["curentOperation"]==="newChqMSerie")?"QteDem":"QteDS"
				v[qField]=d[qField];
			}
				});
		return alreadyS;
	}
	transformToText(ar){
		let t="<ul class='ulInNotif'>";
		let qteKey=(window["curentOperation"]==="newDsp")?"QteDS":"QteDem";
		ar.forEach((v, k) => {t+=`<li> ${v.CodeArticle}:${v[qteKey]} </li>`});
		t+="</ul>";
		return t
	}
	
}