class CDatatableEvent{
	constructor(options={} ){
	const{varName=""}=options;
	this.varName=varName;
	}
	
	/* Export paramSalaire into excel usin exceljs */
	paramSalaireExport1(e, dt, button, config){
		const myPs=new ClassParamSalaire({varName:"myPs"});
		myPs.paramSalaireExport1();
	}
	paramSalaireImport(e, dt, button, config){
		const myPs=new ClassParamSalaire({varName:"myPs"});
		myPs.pramSalaireImport();
		
	}
	exportEtatSalaire(e, dt, button, config){
		// console.log(dt)
		const myEs=new ClassEtatSalaire();
		myEs.export();
	}
	deduireRetard(e, dt, button, config){
		// console.log(dt)
		const myEs=new ClassEtatSalaire();
		myEs.deduireRetard();
	}
	async exportAvance(e, dt, button, config){
		// console.log(dt)
		const myEs=new ClassAvance();
		await myEs.exportA();
	}
	async importAvance(e, dt, button, config){
		// console.log(dt)
		const myEs=new ClassAvance();
		await myEs.importA();
	}
	
	async deleteAvance(data){
		const myAv=new ClassAvance();
		await myAv.deleteA(data);
	}
	
	async importPointage(){
		window.myPt=new ClassPointage({varName:"myPt"});
		await myPt.importPointage();
	}
	
	async exportHeureSup(){
		 window.myHeureSup=new ClassHeureSup({varName:"myHeureSup"});
		await myHeureSup.exportHeureSup()
	}
	
	async importHeureSup(){
		window.myHeureSup=new ClassHeureSup({varName:"myHeureSup"});
		await myHeureSup.importHeureSup()
	}
	
	async selectClient(){
		try{
			let OTableName="myTable"+this.varName;		
			window["selectedRows"+this.varName]=window[OTableName].rows({selected:true});
			let d=window["selectedRows"+this.varName].data().toArray();
			// console.log(d)
			window["clientSelected"] =d;
			// let myClient=new ClassHeureSup({varName:"myClient"});
			myLoadkit.setState();
			await window.myClient.selectClient2()
			return d;
		}catch(err){
			console.log(err)
		}
	}
	
	async createFacture(){
		try{
			window["myFacture"]=new ClassFacture({varName:"myFacture"});
			await window["myFacture"].create()
		}catch(err){
			console.log(err)
		}
	}
	
	
	async EnregistrerFacture(options={}){
		const{}=options
		try{
			window["myFacture"]=new ClassFacture({varName:"myFacture"});
			await window["myFacture"].EnregistrerFacture()
		}catch(err){
			console.log(err)
		}
		
	}
	
	async setEditableQteColumn(setting,options={}){
		const{}=options
		try{
			window["myFacture"]=new ClassFacture({varName:"myFacture"});
			await window["myFacture"].setEditableQteColumn(setting)
				
		}catch(err){
			console.log(err)
		}
		
	}

	async TelechargerFact(){
		
		try{
		window["myFacture"]=new ClassFacture({varName:"myFacture"});
		await window["myFacture"].TelechargerFact()
		}catch(err){
			console.log(err)
		}
		
	}	
	
	async paiementFacture(options={}){
		const{}=options
		try{
			window["myFacture"]=new ClassFacture({varName:"myFacture"});
			await window["myFacture"].paiementFacture()
		}catch(err){
			console.log(err)
		}
		
	}
	
	async detailJournalSelected(setting={}){
		const{varName=""}=setting
		try{
			window["copyTimeout"];
			// 
			$("#myJournal-table1 td").mouseup((e)=>{
				let selectedText = window.getSelection().toString().trim();
				if(selectedText){
					clearTimeout(window["copyTimeout"]);
					let c=false
					if(e.altKey===true){
						window["copyTimeout"]=setTimeout(()=>{
						c=confirm("voulez vous chercher des info sur BC?")
						},100)
					}
					if(e.ctrlKey===true){
						window["copyTimeout"]=setTimeout(()=>{
						c=confirm("voulez vous chercher des info sur Facture?")
						},100)
					}
					
					
					
				}
				
			});
		}catch(err){
			console.log(err)
		}
		
	}

}