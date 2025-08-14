
class ClassTreeviewEvent{
	constructor(){
		
	}
	async salaire_param(options={}){
		// const{personelId=0}=options;
		// console.log('test')
		myLoadkit.setState()
		setTimeout(async ()=>{
		var myPs=new ClassParamSalaire({varName:"myPs"});
		await myPs.getParamSalaireFromDb();
		myPs.showInDataTable();
		window.varInifinitMode=false;
		} ,10)
	}
	async etat_Salaire(options={}){
		myLoadkit.setState()
		setTimeout(async ()=>{
		var myEtatSalaire=new ClassEtatSalaire();
		await myEtatSalaire.getAllEtatSalaireFromDb();
		myEtatSalaire.showInDatatable();
		window.varInifinitMode=false;
		} ,10)
	}
	async avance_Salaire(options={}){
		myLoadkit.setState()
		setTimeout(async ()=>{
		var myAvance=new ClassAvance();
		await myAvance.getDataFromDb();
		await myAvance.showInDatatable();
		window.varInifinitMode=false;
		} ,10)

	}
	async showPointage(options={}){
		myLoadkit.setState()
		setTimeout(async ()=>{
			var myPtg=new ClassPointage();
			await myPtg.getData();
			await myPtg.showInDataTable();
			window.varInifinitMode=false;
		} ,10)
	}
	async heure_Supplementaire(options={}){
		myLoadkit.setState()
		setTimeout(async ()=>{
			var myHeureSup=new ClassHeureSup();
			await myHeureSup.getData();
			await myHeureSup.showInDatatable();
			window.varInifinitMode=false;
		} ,10)
	}
	/**/
	salaire_param_setList(options={}){
		const{}=options;
		// objectif: getPersonnelList
		// formatedd
		// prepared for the next actions
		// inserted to a picese cible
		// avoid duplicat thenode
		// atualiser les noeuds pour voir le résultat
		// oû vat on mettre les fonctions pour mieu les repérer
		// console.log('test');
		let pers=new ClassPersonnel();
		let listFormated=pers.formatPersonnelListForTreeView();
		console.log(listFormated);
		
	}
	/**
	 * définir le mois courent utilié par le logiciel.
	 * @param {number} age - L'âge de l'utilisateur.
	 * @returns {boolean} - Retourne vrai si l'utilisateur peut conduire.
	 */
	setMois(options={}){
		let m=new ClassMois();
		m.setMois();
		
	}
	/**fired when click on day:modifier la ligne du mois dans le treView
	@param
	@return
	*/ 
	// editMois(){
		
	// }
	changeDay(options={}){
	let m=new ClassMois();
		m.changeDay();
	}
	/* fired whe click on client on treeview */
	selectClient(options={}){
		// alert('test');
	window.myClient=new ClassClient({varName:"myClient"});
		myClient.selectClient();
	}

	async getDetailCommande(NumBC){
		
		window["NumBC"]=NumBC;
		await window['tv0'].node3Reset();
		// recup liste Facture of BC
		let myBc=new ClassBonCommande();
		let r=await myBc.getFactureListOf({NumBC:NumBC});
		
		if(r.length>0){
			await window['tv0'].addNode({ r:r, nodeRow:3, nodeText:"FACTURES", subNodefn:"getFacture", subNodekey:"NumFact" });
			}
			
		let myDetailC=new ClassDetailCommande({varName:"myDetailC"});
		myLoadkit.setState()
		// await myDetailC.getDetailCommande(NumBc);
		await myDetailC.showInDatatable({NumBC:NumBC});
	}

	async getFacture(NumFact){
		try{
			let myFact=new ClassFacture();
			await myFact.getFacture(NumFact);

		}catch(err){
			console.log(err)
		}
		
	}
	
	async createDsp(options={}){
		const{}=options
		try{
			/* nous allons créer une interface qui contient un table des articles
			Cette interface sera gérer par une classe ClassDemandeSpecial
			dans la fonction interfaceNew
			cette interface va contenir
			1 la liste des articles
			*/
			// alert("test")
			window["myDemandeSpecial"]=new ClassDemandeSpecial();
			window["myDemandeSpecial"].interfaceNew();
			return 0;
		}catch(err){
			console.log(err)
		}
		
	}
	
	async allTravaux(options={}){
		const{}=options
		try{
			window["myLoadkit"].setState();
			
			window["myTravaux"]=new ClassTravaux();
			await window["myTravaux"].getAllTravaux();
			window["myTravaux"].showInDatatable();
			
			window.varInifinitMode=false;
		}catch(err){
			console.log(err)
		}
		
	}
	
	async travauxSansFiche(options={}){
		const{}=options
		try{
			window["myLoadkit"].setState();
			window["myTravaux"]=new ClassTravaux();
			await window["myTravaux"].getAllTravaux({url0:'/travauxSansFiche'});
			
			/* if(typeof(window["chequeMatiereData"])=="undefined"){
				window["myChequeMatiere"]=new ChequeMatiere();
			await window["myChequeMatiere"].getChequeMatiereData();
			}
			 */
			window["myTravaux"].showInDatatable();
			window.varInifinitMode=false;
		}catch(err){
			console.log(err)
		}
		
	}
	
	async travauxAvecFiche(options={}){
		const{}=options
		try{
			window["myLoadkit"].setState();
			window["myTravaux"]=new ClassTravaux();
			await window["myTravaux"].getAllTravaux({url0:'/travauxAvecFiche'});
			window["myTravaux"].showInDatatable();
			window.varInifinitMode=false;
		}catch(err){
			console.log(err)
		}
		
	}
	
	async allTravauxOnCalendar(options={}){
		const{}=options
		try{
			myLoadkit.setState();
			/*chargement prévu se terminer une fois que toules éléments du calendrier en place
			note : arrèté dans chequeMatiere.addWonCalendar()
			*/
			let start=performance.now()
			let myT=new ClassTravaux();
			// let pS=window["myProcessLog"].addContent({text:"Loading :allTravauxData", percent:25 })
				await myT.getAllTravaux();
				let d=parseInt((performance.now()-start)/1000)
				showNotification({text: 'allTravauxData:chargé en '+d+'s',colorName: 'alert-success', timer:1000 });
				// window["myProcessLog"].refreshContent({text:"allTravauxData loaded :"+d+"s",s:pS, percent:100})
				start=performance.now()
			window["myClassStockInDropdown"]=new StockInDropdown();
			await window["myClassStockInDropdown"].checkData()
			
			
			
			window["detailComInDropDown"]=new ClassDetailCommandeInDropDown();
			await window["detailComInDropDown"].checkData();
			
			window["myCalendar"]=new ClassCalendar();
			await window["myCalendar"].init();
			
			window["myChequeMatiere"]=new ChequeMatiere();
			await window["myChequeMatiere"].getChequeMatiereData();
			d=parseInt(performance.now()-start)
			showNotification({text: 'chequeMatiereData:chargé en '+d+'ms',colorName: 'alert-success', timer:1000 })
			
			await window["myChequeMatiere"].getChequeMatiereByProductId();
			
			// start=performance.now()
			setTimeout(async()=>{
				// window["myChequeMatiere"]=new ChequeMatiere();
				await window["myChequeMatiere"].addWOnCalendar();
				await window["myChequeMatiere"].arangeDetailCommande();
				// await window["myChequeMatiere"].addSortieMagasinInfo();
				// console.log(window["chequeMatiereByProductIdData"]);
				await window["myChequeMatiere"].arangeProductIdByChequeMatiere();
				
				
				// liste des articles par codeArticle
			window["myArticle"]=new ClassArticle()
			await window["myArticle"].arrageByCodeArticle();
			
				// d=performance.now()-start
				// showNotification({text: 'Calendrier :chargé en '+d+'ms',colorName: 'alert-success', timer:1000 })
			},10)
			// myLoadkit.changeInfinitMode(false)  ;
		}catch(err){
			console.log(err)
		}
		
	}
	
}