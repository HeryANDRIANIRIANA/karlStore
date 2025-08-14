class ClassPersonnel{
	constructor(){
		this.gvar=window.personnelData;
		}
	
	checkPersonnelList(options={}){
		const{
			nextfn=null
		}=options
		
		if(this.gvar.list==[]){
			setTimeout(
			()=>{this.checkPersonnelList()} ,100)
		}else{
			if(nextfn!=null){
				setTimeout(nextfn,100)
			}else{
				console.log(this.gvar.list);
			}
		}
	}
	
	async getList(){
		let url=`/personnelInfo`;
		let data={};
		try{
			let response = await axios.get(url);
			// format the result -colNames:personnelData.colNames,data:personnelData.list
			let colNames=Object.keys(response.data[0]);
			let list=response.data;
			window.personnelData.colNames=colNames;
			window.personnelData.list=list;
			
			return response;
		}catch(err){
			console.error(err)
			throw err;
		}
		// axios.get(url)
		// .then(response=>{
			// this.gvar.list=response.data;
			// this.gvar.colNames=Object.keys(response.data[0])
			// console.log(response)
		// })
		// .catch(err=>{
			// console.error(err)
		// })
	}
	
	formatPersonnelListForTreeView(options={}){
		const{}=options;
		return this.gvar;
	}
	
	/* buildRowFromPointage(data){
		let persoData=window.personnelData.list;
				let r=data["Resume"];
				let a1=[];
				persoData.forEach((v,k)=>{
					// console.log(v["CIN"],v["idPointage"])
					let idP=v["idPointage"];
					let CIN=v["CIN"];
					if(typeof(r[idP])!="undefined"){
						a1.push({CIN:CIN, ARM:r[idP]});
					}
					// console.log(v)
				})
				// console.log(a1)
				return a1;
	} */
	
	/* async updt(data,options={}){
		const{op=""}=options
		try{
			let r={} ;
			
			switch (op){
				case "pointageInfo":
				let nr=this.buildRowFromPointage(data);
				let url='/updtEtatSalairePointageI';
				let data1={
					mois:window.mois,
					rows:nr
				}
				r=await axios.post(url,data1);
				console.log(r)
				break;
			}
			
			return r;
		}catch(err){
			console.log(err)
		}
	}
 */
	

	async getCINFromSurname(surname){
		// dans un premier temps noous alons juste prendre lsurnames
		try{
			let persoData=window.personnelData.list;
			var obj = persoData.find( (persoData)=> {
				// console.log(persoData["Surnom"].split(','))
				return persoData["Surnom"].split(',').includes(surname);
			});
			// console.log(obj
			if(typeof(obj)!="undefined"){
				return obj["CIN"]
			}else{
				console.log(surname)
				return surname
			}
			
			
		}catch(err){
			// alert("il y a encor des noms que je n'identifie pas aide moi?")
			console.log(err)
		}
	}

}