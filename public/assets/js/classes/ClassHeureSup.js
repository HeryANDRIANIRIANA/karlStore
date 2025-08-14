class ClassHeureSup{
	constructor(options={}){
		const{varName="myHeureSup"}=options
		this.data=window.heureSupData;
		this.mois=window.mois;
		this.varName=varName;
	}
	
	async getData(){
		try{
			let url='/getHeureSupData';
			let data={mois:this.mois};
			let r=await axios.post(url,data);
			// rectif des données
			let myAv=new ClassAvance();
			let r1=await myAv.rectifyDataFromDb(r);
			window.heureSupData=r1;
			// console.log(r1)
			return r1;
		}catch(err){
			console.log(err)
		}
	}
	
	async showInDatatable(){
		// dataTOpt2globalDataaditifBtnaditifActionsvarName
		// if(window.avanceData==null || window.avanceData=={} || typeof(avanceData)=="undefined"){
			// window.avanceData=await this.getDataFromDb();
			// this.data=window.avanceData;
		// }
		// console.log(window.heureSupData) 
		
		let  dataTOpt2={
			titre:"HEURE SUP",
			deleteEvent:"",
			efColVis:[0,4,5],
			globalData:"heureSupData", 
			aditifBtn:[
					{
					  "extend": "",
					  "text": "Exporter",
					  "className": "btn btn-white btn-primary btn-bold",
					  columns: ':not(:first):not(:last)'
					},
					{
					  "extend": "",
					  "text": "Importer",
					  "className": "btn btn-white btn-primary btn-bold",
					  columns: ':not(:first):not(:last)'
					}
					],
		aditifActions:["exportHeureSup","importHeureSup"],
		varName:"heureSup" }
		// polymorphisme
		let myps=new ClassParamSalaire();
		myps.showInDataTable({dataTOpt2:dataTOpt2});
		
	}
	
	async exportHeureSup(){
		let myAv=new ClassAvance();
		await  myAv.exportA({moduleData:window.heureSupData, moduleName:"HeureSup", hidenCols:[2,3,4,7,9,11,12,14,15]})
	}
	
	 async importHeureSup(options={}){
		const {
			url='/importHeureSup',
			globalData='heureSupData'
			}=options;
			const fileInput=document.getElementById('myFile')
			let myAv=new ClassAvance();
			fileInput.click();
			if(window[globalData]==={}){
				await this.getData();
			}
			fileInput.addEventListener('change', () =>{
			const file=fileInput.files[0];
			if(file){
				// console.log(file)
				myLoadkit.setState();
				let cn=Object.keys(window[globalData][0]);
				let needC=[];
				cn.forEach((v,k)=>{
					k++;
					needC.push(k)
				} );
				
				myAv.readFile(file,{optNeededC:needC},async (o)=>{
					// console.log(o)
				let a1=await myAv.imporAvanceStep1(o)// heureSUP with CIN
				let a2=await this.importHeureSupStep2(a1)
				//befor send to db check for doublon
				/* verifDoublon(ar, options={}){
		const{oper="Retard", globalData={}, tableKey="NumOrdreAvance"}=options; */
				// let a3= await myAv.verifDoublon(a2, {oper:"heureSup", globalData:window[globalData], tableKey:"NumOrdreHS"})
				// console.log(a3);
				let rs=await this.addRows(a2);//sending to db
				// console.log(rs);
				
				window.varInifinitMode=false;
				});
			}
			} )
		
	} 
	
	/* get paramSalaireInfo for each heureSupRow
	@params: ar of object with CIN
	@return : ar[{CIN},...]
	*/
	async importHeureSupStep2(ar, options={}){
		const{oper="heureSUP"}=options;
		try{
			let r=[];
			let arParamSal=window.paramSalaire;
			// console.log(OparamSal)
			for (let o of ar){
				let CINFound=false;
				let i=0;
				while(arParamSal.length>i||CINFound===false){
					let oP=arParamSal[i];
					if(oP["CIN"]==o["CIN"]){
						CINFound=true;
						let k=Object.keys(o);
						k.forEach((v,k0)=>{
							o[v]=(typeof(oP[v])!=="undefined")?oP[v]:o[v];
						});
					}
					i++
				}
				// calcul MontantJour et MontantNuit
				if(oper==="heureSUP"){
					let cj=1.3;
					let cn=1.5;
					let sb=(typeof(o["SBParHeurePermanent"])!=="undefined")?o["SBParHeurePermanent"]:0;
					let dj=(typeof(o["DurerJour"])!=="undefined")?o["DurerJour"]:0;
					let dn=(typeof(o["DurerNuit"])!=="undefined")?o["DurerNuit"]:0;
					// let =(typeof(o["EsPayer"])!=="undefined")?o["EsPayer"]:null;
					let mj=dj*cj*sb;
					let mn=dn*cn*sb;
					o["DurerNuit"]=dn;
					o["DurerJour"]=dj;
					o["MontantJour"]=parseInt(mj);
					o["MontantNuit"]=parseInt(mn);
					// 
				}
				
				r.push(o);
			}
			
			return r;
		}catch(err){
			console.log(err)
		}
	}
	
	async addRows(ar){
		try{
			let rs={};
			let url='/addHeureSupRow';
			let data={
				mois:window.mois,
				rows:ar
			} ;
			rs=await axios.post(url,data);
			console.log(rs)
			return rs;
		}catch(err){
			console.log(err)
		}
	}
	
}