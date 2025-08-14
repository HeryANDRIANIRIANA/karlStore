class ClassDetailCommande{
	
	constructor(options={}){
		const{
			varName="myDetailCommande"
		}=options
		this.varName=varName;
		let p=window.day.split('-');
		this.idAnnee=parseInt(p[2]);
		}
		
	async getData(options={}){
		const{NumBC=""}=options;
		try{
			let url='/getDetailCommande';
			let data={
				NumBC:NumBC,
				idAnnee:this.idAnnee
			}
			let myDataR=new ClassDataRectif();
			let r1=await myDataR.getData({url:url, data:data});
			return r1;
		}catch(err){
			console.log(err)
		}
	}

	async getDetailCommande(NumBC){
		try{
			
			let ardetCom=await this.getData({NumBC:NumBC})
			// console.log(ardetCom);
			window["detailCommande"]=ardetCom;
			
			return ardetCom;
		}catch(err){
			console.log(err)
		}
	}
	
	async showInDatatable(options={}){
	const{
		NumBC="",
		c0="root-container"
		}=options;
	
	try{
		// if(Object.keys(window["detailCommande"]).length==0){
			await this.getDetailCommande(NumBC);
		// }
		window.myMiniD=new CMiniDatatable({varName:this.varName});
			// console.log(window["clientList0"]);
			let dataTOptions={
				deleteEvent:"",
				efColVis:[0,3,4],
				globalData:"detailCommande", 
				selectors:{container:c0+" section.content .container-fluid",table:"table1",widget:"wd1"},
				
				aditifBtn:[
					{
					  "extend": "",
					  "text": "Facturer",
					  "className": "btn btn-white btn-primary btn-bold",
					  columns: ':not(:first):not(:last)'
					}
				],
				/* these actions are defied inCDatatableEvent, "paramSalaireImport" */
				aditifActions:[ "createFacture" ],
				varName:this.varName,
				titre:"DETAIL COMMANDE : "+NumBC
			}
			let s=await myMiniD.set({dataTOpt2:dataTOptions})
			// window["datatableIn"][c0]=s;
			window['dataTableDetailCom']=s;
			
			window.varInifinitMode=false;
			// console.log(s)
			
	}catch(err){
		console.log(err)
	}
	}
	
	
}