class ClassAvance{
	constructor(options={}){
		const {mois=window.mois}=options
		this.mois=mois;
		// this.data=(typeof(window.avanceData[this.mois])!="undefined")?window.avanceData[this.mois]:{};
		this.data=(typeof(window.avanceData)!="undefined")?window.avanceData:{};
		
	}
	
	/* get Avance boths structur an content from DB
	@param: this.mois - required
	@param: this.CIN - facultatif
	*/
	async getDataFromDb(options={}){
		const{CIN=""}=options;
		let url="/getAvanceData";
		let data={mois:this.mois, CIN:CIN}
		try{
			const avanceD=await axios.post(url,data);
			// console.log(avanceD)
			// rectif avanceD
			var avanceD1=avanceD.data.data;
			if(avanceD.data.data.length==0){
				let o={};
				for(let colName of avanceD.data.structure.colNames){
					// console.log(colName)
					let v=(avanceD.data.structure.colDesc[colName].dataType<0)?"":0;
					o[colName]=v;
				}
				avanceD1.push(o)
			}
			
			this.data=avanceD1;
			window.avanceData=avanceD1;
			// console.log(avanceD1)
			
			return avanceD1;
		}catch(err){throw err}
		
	}
	
	async rectifyDataFromDb(o){
		let o1=o.data.data;
			if(o.data.data.length==0){
				let o2={};
				for(let colName of o.data.structure.colNames){
					// console.log(colName)
					let v=(o.data.structure.colDesc[colName].dataType<0)?"":0;
					o2[colName]=v;
				}
				o1.push(o2)
			}
		return o1;	
			// this.data=avanceD1;
			// window.avanceData=avanceD1;
	}
	
	async rectifyGlobalData(a){
		let  a1=a.data.data;
			if(a.data.data.length==0){
				let o={};
				for(let colName of a.data.structure.colNames){
					// console.log(colName)
					let v=(a.data.structure.colDesc[colName].dataType<0)?"":0;
					o[colName]=v;
				}
				a1.push(o)
			}
			
		return a1;
	}
	
	async showInDatatable(){
		// dataTOpt2globalDataaditifBtnaditifActionsvarName
		// if(window.avanceData==null || window.avanceData=={} || typeof(avanceData)=="undefined"){
			window.avanceData=await this.getDataFromDb();
			this.data=window.avanceData;
		// }
		// console.log(window.avanceData)
		let  dataTOpt2={
			titre:"AVANCE",
			deleteEvent:"deleteAvance",
			efColVis:[0,4,5],
			globalData:"avanceData", 
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
		aditifActions:["exportAvance","importAvance"],
		varName:"avance" }
		// polymorphisme
		let myps=new ClassParamSalaire();
		myps.showInDataTable({dataTOpt2:dataTOpt2});
		
	}
	
	async exportA(options={}){
		const{moduleData={}, moduleName="AVANCE", hidenCols=[]}=options
		try{
		const data=(moduleData!=={})?moduleData: await this.getDataFromDb();
		const workbook = await new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet(moduleName+'_'+this.mois);
		let h0=Object.keys(data[0]);
		worksheet.columns=[];
		worksheet.columns=h0.map((h)=>{
			return { header: h, key: h, width: 15 }
		});
		for(let p of data){
			worksheet.addRow(p)
		}
		if(hidenCols.length>0){
			hidenCols.forEach((v,k)=>{
				worksheet.getColumn(v).hidden = true;
			} );
		}
		// ajoutter une ligne au dessu
		worksheet.insertRow(1,"");
		// worksheet.insertRow(1,"");
		// worksheet.insertRow(1,"");
		// getAdres lastUsed col
		let adr=worksheet.getCell(1,h0.length)['_address']
		// console.log(adr)
		worksheet.mergeCells("A1", adr)
		worksheet.getCell("A1").value=moduleName;
		/* fusionner les cellules
		 */
		
		workbook.xlsx.writeBuffer().then(buffer => {
		 const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
		 saveAs(blob, moduleName+'_'+this.mois+'.xlsx');
		 }); 
		 return 0;
		}catch(err){
			console.error(err)
		}
	}
	
	async importA(options={}){ 
		const {
			url='/importAvance',
			globalData='avanceData',
			nextFn=()=>{
				let o=new ClassAvance()
				o.showInDatatable();				
				alert('Import Terminé')
			}
		}=options;
		const fileInput=document.getElementById('myFile')
		fileInput.click();
		fileInput.addEventListener('change', () => {
			const file=fileInput.files[0];
			if(file){
				this.readFile(file,async (o)=>{
					try{
						myLoadkit.setState();
					let r1=await this.imporAvanceStep1(o); //rectification de data
					// console.log(s1)
					let ro1=await this.verifDoublon(r1, {oper:"Avance"})
					if(ro1["rowsToInsert"].length>0){
						let r2=await this. addAvance(ro1["rowsToInsert"]);
					}
					
					if(ro1["rowsToUpdt"].length>0){
						let r5=await this. addAvance(ro1["rowsToUpdt"],{oper:"updt"});//Attention polymorphisme
					}
					
					// let r2=await this.addAvance(r1);
					
					
					setTimeout(async ()=>{
					await this.getDataFromDb();
					let r3= await this.sumAvanceByCIN();
					// console.log(r3);
					let r4= await this.updateEtatSalaire(r3);
					// console.log(r4)
					await this.showInDatatable();	
					window.varInifinitMode=false;
					},2000 )
					
				}catch(err){
					console.log(err)
				}
				
				})
			}

		   });
	}	

	async readFile(file,options={} ,callBack){
		const{optNeededC=[1,2,3,4]}=options;
		const reader=new FileReader();
		reader.onload=async (e) =>{
			const data=e.target.result;
			try{
				const wb=new ExcelJS.Workbook();
				await wb.xlsx.load(data);
				const ws=wb.getWorksheet(1);
				// let t1=performance.now();
				let arToBeTrait=[]
				let intitulee=ws.getRow(1).values;//doit comencer par AVANCE
				let rowColNames=ws.getRow(2).values;//le nom des colnnes commenceront ici
				let neededC=optNeededC;//au début cela doit être Nom, MntAvance, datePaieAvance
				ws.eachRow((row, rowNumber)=>{
					if(rowNumber>2){
						let o={};
						
						for (let i of neededC){
							o[rowColNames[i]]=row.values[i];
						}
						
						arToBeTrait.push(o);
					}
				});
				
				callBack(arToBeTrait);
			}catch(err){
				
				console.log(err)
			}
		}
		reader.onerror=(err)=>{
			console.error(err);
			alert("erreur lecture ficher");
		}
		reader.readAsArrayBuffer(file);
	}

	async deleteA(d){
		let t="Vous ête sur le point de supprimer "+d.length+" ligne de la table avance, confirmez?";
		if(confirm(t)){
			try{
					myLoadkit.setState();
					let r=await this.deleteAStep1(d);
					// console.log(r);
					
					setTimeout(async ()=>{
					await this.getDataFromDb();
					let r3= await this.sumAvanceByCIN();
					// console.log(r3);
					let r4= await this.updateEtatSalaire(r3);
					// console.log(r4)
					await this.showInDatatable();	
					window.varInifinitMode=false;
					},2000 )
					
					return r;
			}catch(err){
				throw err
			}
		}
	}

	/* Objectif addCIN cols */
	async imporAvanceStep1(ar){
		try{
			// console.log(ar)
			var myPersonnel=window.myPersonnel || new ClassPersonnel();
			let nAr=[]
			ar.forEach(async (v,k)=>{
				// console.log(v["NomPrenom"]);
				let surname=v["NomPrenom"];
				let CIN=await myPersonnel.getCINFromSurname(surname);
				v["CIN"]=CIN;
				v["DatePaieAvance"]=(typeof(v["DatePaieAvance"])=="undefined")?"15-01-2025":v["DatePaieAvance"];
				v["Mois"]=(typeof(v["Mois"])=="undefined")?this.mois:v["Mois"];
				v["IdAnnee"]=(typeof(v["IdAnnee"])=="undefined")?"2025":v["IdAnnee"];
			});
			return ar;
		}catch(err){
			console.log(err)
		}
	}

	async addAvance(rows, options={}){
		const{oper="add"}=options
		try{
			// console.log(rows)
			let url="/importAvance1";
			switch(oper){
				case "add":
				url="/importAvance1";
				break;
				case "updt":
				url="/updtAvance";
				break;
			}
			
			let data={
			rows:rows,
			mois:this.mois
			}
			let r=await axios.post(url,data);
			return r;
		}catch(err){
			console.log(err)
		}
		
	}
	
	async actualiseEtatSalaire(){
		try{
			await this.getDataFromDb();
			let r3= await this.sumAvanceByCIN();
			// console.log(r3);
			let r4= await this.updateEtatSalaire(r3);
			// console.log(r4)
			// await this.showInDatatable();	
			// window.varInifinitMode=false;
		}catch(err){
			console.log(err)
		}
	}
	
	async sumAvanceByCIN(){
		try{
			let o=window.avanceData
			// console.log(o);
			let ar={};
			o.forEach((v,k) =>{
				ar[v['CIN']]=(typeof(ar[v['CIN']])=="undefined")?v['MntAvance']:ar[v['CIN']]+v['MntAvance']
				
			} )
			return ar;
			
		}catch(err){
			console.log(err)
		}
	}

	async updateEtatSalaire(data){
		try{
			
			var myEtatSalaire=window.myEtatSalaire || new ClassEtatSalaire();
			await myEtatSalaire.getAllEtatSalaireFromDb();
			let r=await myEtatSalaire.updt(data,{op:"retenuInfo"});
			
			return r;
		}catch(err){
			console.log(err);
		}
	}

	async deleteAStep1(d){
		try{
				let url="/deleteAvance";
				let data={
						rows:d,
						mois:this.mois
					}
				let r=await axios.post(url,data);
				return r;
		}catch(err){
			console.log(err)
		}
	}
	
	/* checkAvanceRow
	CIN,Mois,MntAvance,Motif,NumOrdreAvance,DatePaieAvance
	@return NumOrdreAvance,
	@important : pas encor de décision d'updt ni d'insertion ni de rster indifféren
	*/
	async checkAvanceRow(r, options={}){
		try{
			const{oper="Retard", globalData={}, tableKey=""}=options;
			let o1={}
			let g=(globalData==={})?window.avanceData:globalData;
			// let 
			switch(oper){
				case "Retard":
				let dt=new Date();
				let jr=dt.getDate();
				let s=jr.toString()+"-"+window.mois;
				
				o1={CIN:r['CIN'], Mois:window.mois, DatePaieAvance:s, MntAvance:r ['MntAvance'], Motif:"Retard"};
					for (let o of g){
						if(r.CIN==o.CIN && r.Mois==o.Mois && r.Motif==o.Motif){
							o1['NumOrdreAvance']=o['NumOrdreAvance']
						}
					}
				break;
				case "Avance":
				
				o1={CIN:r['CIN'], Mois:window.mois, DatePaieAvance:r ['DatePaieAvance'] , MntAvance:r ['MntAvance'], Motif:r ['Motif'] };
					for (let o of g){
						if(r.CIN==o.CIN && r.DatePaieAvance==o.DatePaieAvance && r.Motif==o.Motif){
							o1['NumOrdreAvance']=o['NumOrdreAvance']
						}
					}
				break;
				
				case "heureSup":
				let ks=Object.keys(r);
				for(let k of ks){
					if(typeof(r[k])!=="undefined"){
						o1[k]=r[k]
					}
				}
				/* r.forEach((v,k)=>{
					if(typeof(v)!=="undefined"){
						o1[k]=v
					}
				}); */
				for(let o of g){
					if(o.CIN==r.CIN && o.Debut==r.Debut && o.DurerJour==r.DurerJour && o.DurerNuit==r.DurerNuit ){
						o1[tableKey]=o[tableKey]
					}
				}
				
				break;
			}
		// console.log(o1);
			return o1
		}catch(err){
			console.log(err)
		}
	}
	
	/* verifDoublon
	@polymorphisme: cas ou retard meme montant du meême mois doit être mise à jours
	cas ou avance même date meme motif mise à jours si montant différent.
		les regles dedoublons sont différents
	@target : eliminer doublon
	@return :ar[rowsToUpdt[], rowsToInsert[] ]
	@param: ar[{}...], all rows to add or updt
	*/
	async verifDoublon(ar, options={}){
		const{oper="Retard", globalData={}, tableKey="NumOrdreAvance"}=options;
		try{
			let ar1=[]
			// console.log();
			if(globalData==={}){
				if(window.avanceData==={}){
				window.avanceData=await this.getDataFromDb();
				}
				
			}
			let g=(globalData==={})?window.avanceData:globalData;
			
			for(let o3 of ar){
				ar1.push (await this.checkAvanceRow(o3,{oper:oper, globalData:globalData, tableKey:tableKey})) ;
			}
			//verifier quelle opération faire
			let ar2=[];
			ar2["rowsToUpdt"]=[];
			ar2["rowsToInsert"]=[];
			for(let r of ar1){
				if(typeof(r['NumOrdreAvance'])=="undefined" || r['NumOrdreAvance']=="undefined"){
					ar2["rowsToInsert"].push(r)
				}else{
					for(let o of window.avanceData){
						if(r['NumOrdreAvance']===o['NumOrdreAvance'] && r['MntAvance']!==o['MntAvance']){
							ar2["rowsToUpdt"].push(r)
						}
					}
				}
			}
			return ar2;
		}catch(err){
			console.log(err)
		}
	}


	async sumAvanceByCINByMotif(){
		try{
			
			let o=window.avanceData
			// console.log(o);
			let ar={};
			o.forEach((v,k) =>{
				if(v['Motif']!==""){
					
					v['Motif']=(v['Motif']==null)?"Avance":v['Motif'];
					if(typeof(ar[v['CIN']])=="undefined"){
						ar[v['CIN']]={}
					}
					ar[v['CIN']][v['Motif']]=(typeof(ar[v['CIN']][v['Motif']])=="undefined")?v['MntAvance']:ar[v['CIN']][v['Motif']]+v['MntAvance']
				}
				
			} )
			let ar1=[]
			let o1=Object.keys(ar);
			for (let r of o1){
				ar1.push({CIN:r, Observation:ar[r]})
			}
			
			return ar1;
		
		}catch(err){
			console.log(err)
		}	
	}

}