class ClassTravaux{
	constructor(options={}){
		const{varName="myTravaux"}=options;
		this.varName=varName;
		this.idAnnee=window["idAnnee"];
		this.dependencyes=new ClassDependencyes()
		// let myDataR=new ClassDataRectif();
		this.dbman=this.dependencyes.dbman;
		this.myDatatable=this.dependencyes.myDatatable;
		this.dtTableName="myTable"+this.varName;
		// console.log(this.dependencyes);
		
	}
	
	async getAllTravaux(options={}){
			const{url0='/getAllTravaux'}=options
			try{
				window["allTravauxData"]=[];
				let url=url0;
				let data={}
				window["allTravauxData"]=await this.dbman.getData({gStruct:"allTravauxStructure",url:url,data:data});
				return window["allTravauxData"]
			}catch(err){
				console.log(err)
			}
			
		}
		
	async showInDatatable(options={}){
		const{c0='root-container', globalData="allTravauxData", titre="TOUT TRAVAUX", deleteEvent="", initCompleteEvent="", varName=this.varName, efColVis=[0,1,2,3,5,4]}=options
		try{
			await this.myDatatable.showInDatatable({
				efColVis:efColVis,
				globalData:globalData, 
				titre:titre,
				varName:this.varName
				})
			
			window[this.dtTableName].on('draw',()=>{
				window[this.dtTableName].column(3).nodes().each(function(cell, i) {
                if ($(cell).text() === 'Oui') {					
                    $(cell).html('✅');  // Remplacer par un emoji de coche
                } else if ($(cell).text() === 'Non') {
                    $(cell).html('❌');  // Remplacer par un emoji de croix
                }
            });
			 })
			window[this.dtTableName].draw()
			
			 $('#'+this.varName+"-table1").off().on('click', 'tr', async (e)=> {
				// console.log(e);
				var data = window[this.dtTableName].row(e.target).data();
				 // var data = e.target.data();
				 window["travauxSelectedData"]=data;
				 // console.log('Données de la ligne :', data);
				 if(data.IsChequerM==="Non"){
					 showNotification({text:'Shift+T: new cheque matiere', colorName:'alert-info'})
					 $("body").off().on("keydown",async (e)=>{
						
						 // console.log(e);
							if(e.shiftKey===true){
								switch (e.key){
									case "T":
									$("body").off()
									window["newChequeMatiereSerie"]={
										 NumChqMSerie:"",...data
									 }
									window["FicheEditNavbarButton"]=new ClassNavbarbuttons({obj:"ficheTravauxEdit", varName:"myNavbarButtons"});
									await window["FicheEditNavbarButton"].setUpDropdownFicheEditor();
									break;
								}
							}
						})
					 
				 }else{
					 $("body").off()
				 }
				 
			}); 
			
			
			// varName+"-table1"
			
			
		}catch(err){
			console.log(err)
		}
		
	}
	
	async generateDetailChequeM(options={}){
			const{QteCom=0, TypeDePapier="", Format="", Reference=""}=options
			try{    
			
					
					let pass=window["pass"]
                    let paramsOk=true;
					paramsOk=(QteCom>0)?true:false;
					paramsOk=(TypeDePapier!=="")?true:false;
					paramsOk=(Format!=="")?true:false;
					paramsOk=(Reference!=="")?true:false;
					if(paramsOk===true){
						window["QteCom"]=QteCom;
						window["TypeDePapier"]=TypeDePapier;
						window["Format"]=Format;
						window["Reference"]=Reference;
						let f1=parseInt(Reference.split("X")[0])
						window["QteSansPass"]=Math.ceil(QteCom*f1/Format)
						this.calculQteInterieur()
						window["QteCouverture"]=Math.ceil(QteCom*2/Format)
						let coefA4=Format/9
						window["QteResteCouverture"]=Math.floor(((window["QteCouverture"]*Format) -(2*QteCom))/coefA4);
						let f2=parseInt(Reference.split("X")[1])
						window["folio"]=f2;
						window["oInterieur"]=this.selectInterieur({typeDePapier:TypeDePapier,folio:f2});
						window["oCouverture"]=this.selectCouverture();
						// console.log(oInterieur);
						let o={interieur:window["oInterieur"],couverture:window["oCouverture"]};
						return o;
					}else{
						console.log("params not OK")
					}
			}catch(err){
				console.log(err)
			}
			
		}
		
	calculQteInterieur(){
		try{
			let pass=window["pass"];
			window["defaultIntrQte"]=Math.ceil(window["QteSansPass"]*(1+(pass/100)))
		}catch(err){
			console.log(err)
		}		
	}
	
	selectInterieur(options={}){
		const{typeDePapier="Autocopiant",folio=1}=options
		try{
			let arPossibility=[]
			let oInterieur={};
			// console.log(typeDePapier);
			switch(typeDePapier){
				case "Autocopiant":
				arPossibility=['AUT01','AUT02','AUT04', 'AUT05', 'AUT08' ]
				for(let i=0; i<folio; i++){
					oInterieur[arPossibility[i]]=window["defaultIntrQte"]
				}
				break;
				case "OFF1":
				oInterieur["OFF1"]=window["defaultIntrQte"]*folio
				break;
				case "OFF3":
				oInterieur["OFF3"]=window["defaultIntrQte"]*folio
				break;
				case "Pelure":
				arPossibility=['PELB', 'PELR', 'PELJ', 'PELBLE', 'PELV']
				for(let i=0; i<folio; i++){
					oInterieur[arPossibility[i]]=window["defaultIntrQte"]
				}
				break;
				case "Journal":
				oInterieur["JOURN"]=window["defaultIntrQte"]*folio
				break;
				case "PHOT1":
				oInterieur["PHOT1"]=window["defaultIntrQte"]*folio
				break;
			}  
			window["oInterieur"]=oInterieur;
			return oInterieur;
		}catch(err){
			console.log(err)
		}	
	}
		
	selectCouverture(){
		window["oCouverture"]={}
		let arOptions=['DOSJ160', 'DOSB160', 'DOSR160', 'DOSVER160' ];
		let n=Math.floor(Math.random()*arOptions.length);
		window["oCouverture"][arOptions[n]]=window["QteCouverture"];
		return window["oCouverture"];
	}

	

}