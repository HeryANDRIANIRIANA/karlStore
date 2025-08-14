class ChequeMatiere{
	constructor(options={}){
		const{varName="myChequeMatiere"}=options;
		this.varName=varName;
		this.idAnnee=window["idAnnee"];
		this.dependencyes=new ClassDependencyes()
		// let myDataR=new ClassDataRectif();
		this.dbman=this.dependencyes.dbman;
		this.myDatatable=this.dependencyes.myDatatable;
		this.dtTableName="myTable"+this.varName;
		// console.log(this.dependencyes);
		
	}
	
	async getChequeMatiereData(options={}){
		const{idAnnee=this.idAnnee}=options
		try{
			// let IdClient=(IdClient1!==0)?IdClient1:window.clientSelected[0].IdClient;
			let url='/getChequeMatiereData';
			let data={idAnnee:idAnnee};
			let myDataR=new ClassDataRectif();
			let r=await myDataR.getData({gStruct:"chequeMatiereStructur", url:url, data:data});
			window["chequeMatiereData"]=r;
			return r
		}catch(err){
			console.log(err)
		}
		
	}


	async getChequeMatiereByProductId(options={}){
		const{productId=0}=options
		try{
			let url='/getChequeMatiereByProductId';
			let data={productId:productId};
			let myDataR=new ClassDataRectif();
			let r={}
			// let r=await myDataR.getData({gStruct:"chequeMatiereStructur", url:url, data:data});
			if(productId!==0){
				r=await myDataR.getData({gStruct:"chequeMatiereStructur", url:url, data:data});
			
			if(typeof(window["chequeMatiereByProductIdData"])==="undefined"){
				window["chequeMatiereByProductIdData"]={};				
			}
			if(typeof(window["chequeMatiereByProductIdData"][productId])==="undefined" || window["chequeMatiereByProductIdData"][productId]===null){
					window["chequeMatiereByProductIdData"][productId]={'chequeMatiere':null,'detailChequeMatiere':null}
				}
			
			window["chequeMatiereByProductIdData"][productId]['chequeMatiere']=r;
			}
			else{
				let start=performance.now();
				// tentative d'ajout de progresBar
				myLoadkit.setProgressbarContainer();
				// TODO:56
				let s=myLoadkit.addProgressbar({text:"chequeMatiereWithProductId loading...", percent:0});
				// console.log(s);
				r=await myDataR.getData({url:url, data:data});
				// console.log(r);
				window["chequeMatiereWithProductId"]=r;
				let e=performance.now()-start;
				showNotification({text:'chequeMatiereWithProductId chargé en '+e+'ms!', colorName:'alert-success', timer:1000})
				await this.arrangeByProductId(window["chequeMatiereWithProductId"],{loadkitpbId:s})
			}
			
			return r
		}catch(err){
			console.log(err)
		}
		
	}

	async arrangeByProductId(ar,options={}){
		const{withDate=false,aName= "chequeMatiere", loadkitpbId=-1
		}=options;
		try{
			let i=0;
			let bS=10;
			let tD=10;
			 // console.log(ar);
			if(typeof(window["chequeMatiereByProductIdData"])==="undefined"){window["chequeMatiereByProductIdData"]={};}
			let gStart=performance.now()
			
			function arange(){
				let start=performance.now();
				let end=Math.min(i+bS,ar.length);
				for(;i<end;i++){
					let o=ar[i];
					// let p=i/end*100
					// console.log(i,ar.length);
					let pId=o["ProductId"]
					if(typeof(window["chequeMatiereByProductIdData"][pId])==="undefined"){
						window["chequeMatiereByProductIdData"][pId]={};
						window["chequeMatiereByProductIdData"][pId]["chequeMatiere"]=[];
						window["chequeMatiereByProductIdData"][pId]["detailCommande"]=[];
						window["chequeMatiereByProductIdData"][pId]["detailChequeMatiere"]=[];
						window["chequeMatiereByProductIdData"][pId]["calendarDate"]="";
					}
					
					// update progressbar if exist
					if($(`li[data-selector="loadkitpb${loadkitpbId}"]`).length>0){
						let p=parseInt(i/(ar.length-1)*100);
						// console.log(i,ar.length);
						let t=(p===100)?aName:o["NumChqMSerie"]
						myLoadkit.refreshProgressbar({s:loadkitpbId,text:t,percent:p})
					}
					
					if(aName==="detailChequeMatiere"){
						if(o["ProductId"]!== "DELETED" ){window["chequeMatiereByProductIdData"][pId][aName].push(o);}
					}else{
						window["chequeMatiereByProductIdData"][pId][aName].push(o);
					}
				
				
				
				switch(aName){
					case "chequeMatiere":
					function formatDtForC(dt){
						let aDt=dt.split('/');
						let sdt=aDt[2]+"-"+aDt[1]+"-"+aDt[0]
						return sdt;
					}
					window["chequeMatiereByProductIdData"][pId]["calendarDate"]=formatDtForC(o["DateCHQMSerie"]);
					break;
				}
				
				let d=performance.now-start;
				if(d<tD && bS<1000){bS+=10}else if(d>tD && bS>10){bS-=10};
				// console.log(i,ar.length);
				
				if(i<ar.length){
					setTimeout(arange,5)
				}
				let e=ar.length-1
				if(i===e && aName=== "chequeMatiere" ){
					let gEnd=performance.now()-gStart;
					showNotification({text: 'chequeMatiere arranged en '+gEnd+'ms' , colorName:'alert-success', timer:1000})
					setTimeout(async()=>{
						await window["myChequeMatiere"].getDetailChequeMatiereWithProductId()
					},5 )
					
				}else if(i===e && aName=== "detailChequeMatiere"){
					showNotification({text: 'chequeMatiereByProductIdData DONE' , colorName:'alert-success', timer:1000})
				}else if(i===e && aName=== "detailCommande"){
					showNotification({text: 'detailCommande DONE' , colorName:'alert-success', timer:1000})
					// myLoadkit.changeInfinitMode(false);
					// myLoadkit.checkAllProgression()
				}
				
				}
			}
			arange();
			return 0;
		}catch(err){
			console.log(err)
		}
		
	}

	async arangeDetailCommande(options={}){
		const{}=options
		try{
			myLoadkit.setProgressbarContainer();
			let s=myLoadkit.addProgressbar({text:"Detail Commande loading...", percent:0});
			await this.arrangeByProductId(window["allTravauxData"],{aName:"detailCommande",loadkitpbId:s})
		}catch(err){
			console.log(err)
		}
		
	}

	async getChequeMatiereSerieProdBy(options={}){
			const{NumChqMSerie="",ProductId=0}=options
			try{
			let url='/getChequeMatiereSerieProdData';
			let data={NumChqMSerie:NumChqMSerie,ProductId:ProductId};
			let myDataR=new ClassDataRectif();
			let r=await myDataR.getData({gStruct:"chequeMatiereSerieProdStructur", url:url, data:data});
			window["chequeMatiereSerieProdData"]=r;
			return r
			}catch(err){
				console.log(err)
			}
			
		}
	
	async getDetailChequeMatiereWithProductId(options={}){
		const{NumChqMSerie= "" }=options
		try{
			let start=performance.now()
			let url='/getDetailChequeMatiereWithProductId';
			let data={NumChqMSerie:NumChqMSerie};
			let myDataR=new ClassDataRectif();
			let s=myLoadkit.addProgressbar({text:"detailChequeMatiere loading...", percent:0});
			let r=await myDataR.getData({ url:url, data:data});
			window["detailChequeMatiereData"]=r;
			let end=performance.now()-start;
			showNotification({text:'detailChequeMatiereWithProductId:OK in '+end+'ms', colorName:'alert-success', timer:1000})
			await this.arrangeByProductId(r,{aName: "detailChequeMatiere", loadkitpbId:s })
			return r
			
		}catch(err){
			console.log(err)
		}
		
	}
	
	async getDetailChequeMatiereSerie(options={}){
		const{NumChqMSerie=""}=options
		try{
			
			let url='/getDetailChequeMatiereSerieData';
			let data={NumChqMSerie:NumChqMSerie};
			let myDataR=new ClassDataRectif();
			let r=await myDataR.getData({gStruct:"detailChequeMatiereStructur", url:url, data:data});
			window["detailChequeMatiereData"]=r;
			return r
		}catch(err){
			console.log(err)
		}
		
	}
	
	async save(options={}){
		const{oldChequeMatiere=null,newChequeMatiereSerie={},detailChequeMatiereSerie=[]}=options
		try{
			// console.log(detailChequeMatiereSerie);
			function pannelLoading(){
				$('#article-panel-container').articleSelectedPannel("setLoadingState")
			}
			pannelLoading()
			
			function refreshLoading(opt={}){
				const{v=0,t=""}=opt;
				let curentV=parseInt($("#selectedArticlePb").attr('aria-valuenow'))
				if(v===0){
					curentV++
					$('#article-panel-container').articleSelectedPannel("refreshLoadingState",{v:curentV})
				}else{
					$('#article-panel-container').articleSelectedPannel("refreshLoadingState",{v:v,t:t})
				}
				if(curentV<=50){
					setTimeout(refreshLoading,100);
				}
			}
			refreshLoading()
			window["newChequeMatiereSerie"]=newChequeMatiereSerie
			// let url=(oldChequeMatiereSerie===null)?'/saveChequeMatiereSerie':'/updateChequeMatiereSerie';
			let oper=(oldChequeMatiere===null)?'add':'update';
			let url='/saveChequeMatiereSerie';
			let data={
				chequeMatiereStructur:window["chequeMatiereStructur"].structure,
				chequeMatiereSerieProdStructur:window["chequeMatiereSerieProdStructur"].structure,
				detailChequeMatiereStructur:window["detailChequeMatiereStructur"].structure,
				// detailCommandeStructur:window["detailCommandeStructur"].structure,
				newChequeMatiereSerie:newChequeMatiereSerie,
				arNewDetailChequeMatiere:detailChequeMatiereSerie,
				oper:oper
				};
			let myDataR=new ClassDataRectif();
			let r=await myDataR.getData({url:url, data:data});
			// console.log(r.data);
			// window["allTravauxData"]=null
			// if(typeof(window["detailComInDropDown"])!=="undefined"){
				// window["chequeMatiereData"]=null
				// window["detailComInDropDown"].checkData()
			 // }
			showNotification({text:r.data.NumChqMSerie+':OK!', colorName:'alert-success', timer:1000})
			
			await this.refreshGlobalData({oper:oper, NumChqMSerie:r.data.NumChqMSerie, DateCHQMSerie:r.data.DateCHQMSerie, detailChequeMatiereSerie:detailChequeMatiereSerie, chequeMatiereSerie:newChequeMatiereSerie, travauxSelected:window["travauxSelectedData"]})
			
			// await this.getChequeMatiereData();
			// if(typeof(window["detailComInDropDown"])!=="undefined"){
				// window["chequeMatiereData"]=null
				window["detailComInDropDown"].checkData()
			// }
			return r
			// return 0
		}catch(err){
			console.log(err)
		}
		
	}
	
	async addWOnCalendar(options={}){
		const{}=options
		try{
			if(typeof(window["chequeMatiereData"])==="undefined" || window["chequeMatiereData"]===null){
				await this.getChequeMatiereData()
			}
			
			let wForCalendar=await this.formatForCalendar({ar:window["chequeMatiereData"]});
			// wForCalendar.forEach(e => window["calendar"].addEvent(e));

			let index = 0;
			let batchSize = 10; // Valeur de départ raisonnable
			let targetDuration = 10; // durée max par lot (en ms)
			// TODO:256
			let s=myLoadkit.addProgressbar({text:"Calendar event Add...", percent:0});
			
			function addBatch() {
				const start = performance.now();
				
				// Crée un lot à ajouter
				const end = Math.min(index + batchSize, wForCalendar.length);
				for (; index < end; index++) {
					let o=wForCalendar[index];
					let p=parseInt(index/(wForCalendar.length-1)*100);
					// console.log(s);
					if($(`li[data-selector="loadkitpb${s}"]`).length>0){
						myLoadkit.refreshProgressbar({s:s,text:o["NumChqMSerie"],percent:p})
					}else{
						s=myLoadkit.addProgressbar({text:"Calendar event Add...", percent:p});
					}
					window["calendar"].addEvent(wForCalendar[index]);
				}
				
				
					// console.log(o);
				$("#mask").css("z-index",8);
				$("#spin").css("z-index",9);
				const duration = performance.now() - start;
				
				// Ajuste le batchSize dynamiquement
				if (duration < targetDuration && batchSize < 1000) {
					batchSize += 10; // la machine supporte plus → on augmente
				} else if (duration > targetDuration && batchSize > 10) {
					batchSize -= 10; // trop long → on diminue
				}
				// console.log(batchSize);
				
				// update progressbar if exist
					
				
				if(index===wForCalendar.length){
					// myLoadkit.changeInfinitMode(false);
				}
				
				if (index < wForCalendar.length) {
					setTimeout(addBatch, 5); // courte pause
				}
				
			}
			
			addBatch();
			
			
			
		}catch(err){
			console.log(err)
		}
		
	}
	
	resolveProductInfoByNumChqMSerie(NumChqMSerie){
		/* retourne les informations sur les productId relatif au chqMSerie, y compris detailChqM, detailCommande */
		let ar=[]
		let o=window["chequeMatiereByProductIdData"];
		let o1=window["productIdByChequeMatiere"];
		// console.log(NumChqMSerie);
		let productIds=o1[NumChqMSerie]
		// console.log(productIds);
		productIds.forEach((v, k) => {
			ar.push(o[v])
			});
		return ar;
	}
	
	async arangeProductIdByChequeMatiere(options={}){
		const{}=options
		try{
			window["productIdByChequeMatiere"]={}
			let o=window["chequeMatiereWithProductId"]
			
			let i=0;
			let bs=10;
			let td=10;
			let s=myLoadkit.addProgressbar({text:"arange productId by NumChqMSerie", percent:0})
			function arange(){
				let start=performance.now();
				let end=Math.min(i+bs,o.length)
				for(;i<end;i++){
					let productId=o[i]["ProductId"]
					 // console.log(productId,i);
					let NumChqMSerie=o[i]["NumChqMSerie"] ;
					// if(NumChqMSerie!==""){
						if(typeof(window["productIdByChequeMatiere"][NumChqMSerie])==="undefined"){
							window["productIdByChequeMatiere"][NumChqMSerie]=[]
							}
						window["productIdByChequeMatiere"][NumChqMSerie].push(productId)
					// }
				}
				
				let d=performance.now()-start;
				if(d<td && bs<1000){bs+=10}else if(d>td && bs>10){bs-=10};
				
				
				if(i===o.length){
					showNotification({text: 'classement by chequeMatiere DONE' , colorName:'alert-success', timer:1000})
					// myLoadkit.changeInfinitMode(false);
					myLoadkit.checkAllProgression()
				}else if(i<o.length){
					let t=o[i]["NumChqMSerie"] ;
				let p=parseInt(i/(o.length-1)*100 )
				myLoadkit.refreshProgressbar({s:s, text:t,percent:p})
					setTimeout(arange,5)
				}
				
			}
			
			arange()
			return 0
		}catch(err){
			console.log(err)
		}
		
	}
	
	async formatForCalendar (options={}){
		const{ar=[]}=options
		try{
			 
			 let ar1=[]
			 ar.forEach((v,k)=>{
				 let a=v.DateCHQMSerie.split('/')
				 v.title=v.NumChqMSerie;
				 v.start=a[2]+'-'+a[1]+'-'+a[0];
				 v.id=k;
				 // vkeys=Object.keys(v);
				 // vkeys.forEach((v1, k1) => { });)
				 ar1.push(v)
			 })
				
		return ar1;
		}catch(err){
			console.log(err)
		}
		
	}
	
	async refreshGlobalData(options={}){
		const{oper='add',NumChqMSerie="", DateCHQMSerie="",detailChequeMatiereSerie=[], travauxSelected={}}=options
		try{
			console.log(oper);
			/*Cest variables gloaux doivent être chargé au début lors de l'affichage du loader
			travauxSelectedData: contien les info sur le détailCommende séléctionné, itile pour repérer le ProductId selectionné , 
			*allTravauxData: tout les détails commandes avec ou sans chèque matière doit contenir aussi ProductId, utilié pour detailComInDropDown, -lors d'un update, rine change ici mais ors d'un add le champ IsChequerM sera peuplé par NumChqMSerie
			*chequeMatiereData: les info sur la table ChequeMatiereSerie, utilisé pour le calendrier, sans productId :
			-lors d'un update, seule le demandeur change, -lors de l'add: on ajoute à ce tableau: une ligne avec les clés des éléments existant plus une clé start et title pour le calendrier
			*chequeMatiereByProductIdData: les info sur les cheques matieres ainsi que les détails organisée par ProductId ,- lors de add, si la clé productId n'éxiste par encor, il faut la créer et dans les sousclés, ajoutter les objet ChequeMatiere et detailChequeMatiere*/
			// console.log(window["newChequeMatiereSerie"]);
			// console.log(window["arNewDetailChequeMatiere"]);
				let i=0;
				let bSize=10;
				let tDuration=10;
				let pId=window["newChequeMatiereSerie"]["ProductId"]
			switch(oper){
				case 'add':
				window["newChequeMatiereSerie"]["NumChqMSerie"]=NumChqMSerie;
				window["newChequeMatiereSerie"]["IsChequerM"]=NumChqMSerie;
				window["newChequeMatiereSerie"]["DateCHQMSerie"]=DateCHQMSerie;
				window["newChequeMatiereSerie"]["id"]=window["chequeMatiereData"].length;
				
				/* refresh window["allTravauxData"] */
				function refreshGlobalAllTravauxData(){
					let start=performance.now();
					let end=Math.min(i+bSize,window["allTravauxData"].length);
					for(;i<end;i++){
						if(window["allTravauxData"][i]["ProductId"]===window["newChequeMatiereSerie"]["ProductId"]){
							window["allTravauxData"][i]["IsChequerM"]=NumChqMSerie;
							window["chequeMatiereSerieProdData"].push({NumChqMSerie:NumChqMSerie, ProductId:window["newChequeMatiereSerie"]["ProductId"]})
							i=window["allTravauxData"].length;
						}
					}
					
					let d=performance.now()-start;
					if (d < tDuration && bSize < 1000) { bSize += 10;  } else if (d > tDuration && bSize > 10) { bSize -= 10; }
					
					if (i < window["allTravauxData"].length) {
							setTimeout(refreshGlobalAllTravauxData, 5);
							}else{
								showNotification({text:'allTravauxData:refreshed!', colorName:'alert-success', timer:1000})
							}
					
				}
				
				//60
				$('#article-panel-container').articleSelectedPannel("refreshLoadingState",{v:60,t:"refreshGlobalAllTravauxData"})
				refreshGlobalAllTravauxData();
				
				/* refresh window["chequeMatiereData"] */
				let chequeMatiereDataKeys=Object.keys(window["chequeMatiereData"][0]);
				// let oNewChequeMatiere={};
				// chequeMatiereDataKeys.forEach((v,k)=>{
					// if(typeof(window["newChequeMatiereSerie"][v])!="undefined"){
						// oNewChequeMatiere[v]=window["newChequeMatiereSerie"][v]
					// }
				// })
				window["chequeMatiereData"].push(window["newChequeMatiereSerie"])
				showNotification({text:'chequeMatiereData:refreshed!', colorName:'alert-success', timer:1000})
				
				//70
				$('#article-panel-container').articleSelectedPannel("refreshLoadingState",{v:70,t:"chequeMatiereByProductIdData et productIdByChequeMatiere"})
				
				// update window["chequeMatiereByProductIdData"]; window["productIdByChequeMatiere"];
				window["chequeMatiereByProductIdData"][pId]["chequeMatiere"].push(newChequeMatiereSerie) ;
				window["chequeMatiereByProductIdData"][pId]["detailChequeMatiere"]=detailChequeMatiereSerie;
				if(typeof(window["productIdByChequeMatiere"][NumChqMSerie])==='undefined'  ){
				window["productIdByChequeMatiere"][NumChqMSerie]=[pId]	
				}else{
					window["productIdByChequeMatiere"][NumChqMSerie].push(pId);
				}
				
				//80
				$('#article-panel-container').articleSelectedPannel("refreshLoadingState",{v:80,t:"addEvent"})
				
				//addToCalendar chequeMatiere
					let ar=[];
					let id=window["chequeMatiereData"].length
					ar.push(window["newChequeMatiereSerie"])
					let wForCalendar=await this.formatForCalendar({ar:ar});
					wForCalendar[id]=wForCalendar[0]
					// console.log(wForCalendar);
					window["calendar"].addEvent(wForCalendar[id]);
					
					
				//90
				$('#article-panel-container').articleSelectedPannel("refreshLoadingState",{v:90,t:'terminé'})
				setTimeout(()=>{
					$('#article-panel-container').articleSelectedPannel("refreshLoadingState",{v:100,t:'terminé'})
				},10)
				
				break;
				case 'update':
				/* window["allTravauxData"] reste inchangé */
				/* window["chequeMatiereData"] change a niveau du demandeur, loop */
				i=0;
				function refreshGlobalchequeMatiereData(){
					let start=performance.now();
					let end=Math.min(i+bSize,window["chequeMatiereData"].length)
					for(;i<end;i++){
					if(window["chequeMatiereData"][i]["NumChqMSerie"]===NumChqMSerie){
						window["chequeMatiereData"][i]["Demandeur"]=window["newChequeMatiereSerie"]["Demandeur"]
						i=window["chequeMatiereData"].length;
					}
					
					}
					
					let d=performance.now()-start;
					if(d<tDuration&&bSize<1000){
						bSize+=10
					}else if(d>tDuration && bSize>10){bSize-=10}
					
					if(i<window["chequeMatiereData"].length){setTimeout(refreshGlobalchequeMatiereData,5)}else{
						showNotification({text: 'chequeMatiereData: refreshed!' , colorName:'alert-success',timer:1000 })
					}
					
					
				
				}
				
				refreshGlobalchequeMatiereData();
				break;
				
			}
			
			/* refresh chequeMatiereByProductIdData */
				if(typeof(window["chequeMatiereByProductIdData"][pId])==="undefined")window["chequeMatiereByProductIdData"][pId]={};
				window["chequeMatiereByProductIdData"][pId]["chequeMatiere"]=[];
				window["chequeMatiereByProductIdData"][pId]["detailChequeMatiere"]=[];
				window["chequeMatiereByProductIdData"][pId]["chequeMatiere"].push(window["newChequeMatiereSerie"]);
				window["arNewDetailChequeMatiere"].forEach((v,k)=>{
					if(v["ProductId"]!=="DELETED"){window["chequeMatiereByProductIdData"][pId]["detailChequeMatiere"].push(v)}
				})
				showNotification({text:'chequeMatiereByProductIdData:refreshed!', colorName:'alert-success', timer:1000})
				
			
		}catch(err){
			console.log(err)
		}
		
	}

	async addSortieMagasinInfo(options={}){
		const{}=options
		try{
			// myLoadkit.setState();
			let s=myLoadkit.addProgressbar({text:"sortie Magasin ...", percent:0})
			
			let productIds=Object.keys(window["chequeMatiereByProductIdData"]);
			
			let i=0;
			let bS=10;
			let tD=10;
			function setSortieMagasin(){
				let start=performance.now();
				let end=Math.min(i+bS,productIds.length)
				for(;i < end; i++){
					let productId=productIds[i];
					let o=window["chequeMatiereByProductIdData"][productId]
					let p=parseInt(i/(productIds.length-1)*100)
					let NumChqMSerie=o["chequeMatiere"][0]["NumChqMSerie"]
					// console.log(o.detailChequeMatiere);
					let dt=o["calendarDate"]
					let detailCommande=o["detailCommande"]
					if(typeof(NumChqMSerie)!=="undefined" && dt!==""){
						window["myCalendar"].addDetailCommande({productId:productId})
					}
					
					if($(`li[data-selector="loadkitpb${s}"]`).length>0){
						myLoadkit.refreshProgressbar({s:s,text:productId+"-"+NumChqMSerie,percent:p})
					}else{
						s=myLoadkit.addProgressbar({text:"sortie Magasin...", percent:p});
					}
					
					
				}
				
				let duration=performance.now()-start;
				if (duration < tD && bS < 1000) {
					bS += 10; // la machine supporte plus → on augmente
				} else if (duration > tD && bS > 10) {
					bS -= 10; // trop long → on diminue
				}
				// console.log(i,productIds.length);
				
				if(i===productIds.length){
					console.log("terminé");
					// myLoadkit.changeInfinitMode(false);
					myLoadkit.checkAllProgression()
				}
				
				if (i < productIds.length) {
					setTimeout(setSortieMagasin, 500); // courte pause
				}
				
			}
			setSortieMagasin()
		}catch(err){
			console.log(err)
		}
		
	}
	
}