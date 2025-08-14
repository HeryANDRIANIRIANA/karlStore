class ClassBonCommande{
	constructor(options={}){
		const{clientSelected={},
		varName="myBonCommande"
		}=options
		this.varName=varName;
		this.clientSelected=clientSelected
		if(typeof(window["clientSelected"])!=="undefined"){
			this.clientSelected=clientSelected
		}
		if(Object.keys(clientSelected).length>0){
			this.clientSelected=clientSelected
		}
		let p=window.day.split('-');
		this.idAnnee=parseInt(p[2]);
		// let myDataR=new ClassDataRectif();
		// this.dbman=myDataR;
		this.dependencyes=new ClassDependencyes()
		this.dbman=this.dependencyes.dbman;
		
		}
		
	async getData(options={}){
		const{IdClient=this.clientSelected[0].IdClient}=options;
		try{
			let url='/getBonCommandeData';
			let data={
				IdClient:IdClient,
				idAnnee:this.idAnnee
			}
			// console.log(data)
			let r =await axios.post(url,data);
			let myDataRec=new ClassDataRectif();
			let r1=await myDataRec.rectifyDataFromDb(r);
			// console.log(r1)
			return r1;
		}catch(err){
			console.log(err)
		}
	}	
	
	async getDetailCommandeData(options={}){
		const{}=options
		try{
			let url='/getDetailCommandeData';
			let data={};
			let myDataR=new ClassDataRectif();
			let r=await myDataR.getData({gStruct:"detailCommandeStructur", url:url, data:data});
			window["detailCommandeData"]=r;
			console.log(r);
			return r
		}catch(err){
			console.log(err)
		}
		
	}
	
	async getInfoOfBCSelected(NumBC){
		try{
			window["bcSelected"]={};
			let i=0;
			let bcFound=false;
			let NomClient=window.clientSelected[0]['NomClient'];
			let allBc=window.BonCommande[NomClient] ;
			// console.log(allBc[0]);
			while(i<allBc[0].length || bcFound==false){
				 // console.log(allBc[0][i].NumBC, NumBC)
				 if(allBc[0][i].NumBC===NumBC){
					 window["bcSelected"]=allBc[0][i];
					 bcFound=true
				 }
				i++
			}
			return window["bcSelected"];
		}catch(err){
			console.log(err)
		}
	}

	async getFactureListOf(options={}){
			const{NumBC=""}=options
			try{
				let d=window.clientSelected
				let NomClient=d[0]["NomClient"]
				let a=window["listFactureClient"][NomClient]
				// console.log(a);
				let a1=[];
				for(let o of a[0]){
					// console.log(o["NumBC"]);
					if(o["NumBC"]===NumBC){
						a1.push(o);
					}
				}
				// console.log(a1);
				return a1;
			}catch(err){
				console.log(err)
			}
			
		}

async updt(options={}){
		const{
			ar=[], 
			key={}
		}=options
		try{
			let url='/updtBonCommande';
			let data={ar:ar, key:key};
			let rep=await this.dbman.getData({url:url,data:data});
			console.log(rep);
		}catch(err){
			console.log(err)
		}
		
	}

}