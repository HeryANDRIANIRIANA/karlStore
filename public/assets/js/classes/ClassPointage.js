class ClassPointage{
	constructor(options={}){
		const{varName=""}=options;
		this.mois=window.mois;
		this.data=window.pointageData;
		this.varName=varName;
	}
	async getData(){
		try{
			let url='/getPointageData';
			let data={
				mois:this.mois
			}
			let r=await axios.post(url,data);
			let myAv=new ClassAvance();
			let r1= await myAv.rectifyGlobalData(r);
			window.pointageData=r1;
			// console.log(window.pointageData);
			return r1;
		}catch(err){
			console.log(err);
		}
	}
	
	showInDataTable(){
		// console.log(window.pointageData);
		
		let  dataTOpt2={
			titre:"POINTAGE",
			deleteEvent:"",
			// efColVis:[0,4,5],
			globalData:"pointageData", 
			aditifBtn:[
					// {
					  // "extend": "",
					  // "text": "Exporter",
					  // "className": "btn btn-white btn-primary btn-bold",
					  // columns: ':not(:first):not(:last)'
					// },
					{
					  "extend": "",
					  "text": "Importer",
					  "className": "btn btn-white btn-primary btn-bold",
					  columns: ':not(:first):not(:last)'
					}
					],
		aditifActions:[
		// "exportAvance",
		"importPointage"
		],
		varName:"pointage" }
		// /* polymorphisme */
		let myps=new ClassParamSalaire();
		myps.showInDataTable({dataTOpt2:dataTOpt2});
	}
	
	async importPointage(){
		const fileInput=document.getElementById('myFile');
		fileInput.click();
		fileInput.addEventListener('change',async ()=>{
			const file=fileInput.files[0];
			if(file){
				this.readFile(file,async (o)=>{

					myLoadkit.setState();
					let o1=await this.importS1(o);
					  // console.log(o1);
					// let rInsert=await this.importS2(o1);
					
					/* mise a jour de l'etat de salaire */
					// console.log(o)
					let up=this.updtEtatSalaire(o1);
					
					setTimeout(async ()=>{
					await this.getData();
					// console.log(window.pointageData)
					await this.showInDataTable();	
					window.varInifinitMode=false;
					},2000 )
					
					
				});
				
			}
			
		})
	}
	
	async readFile(file, callBack){
		const reader=new FileReader();
		reader.onload=async (e)=>{
			const data=e.target.result;
			try{
				const wb=new ExcelJS.Workbook();
				await wb.xlsx.load(data);
				const ws=wb.getWorksheet(1);
				// let t1=performance.now();
				let arToBeTrait=[]
				let rowColNames=ws.getRow(1).values;
				let neededC=[2,3,4];
				let arIds=[];
				ws.eachRow((row, rowNumber)=>{
					if(rowNumber>1){
						let o={};
						let tm=row.values[4];
						o["dtMS"]= this.convertDtInMS(tm);
						for (let i of neededC){
							o[rowColNames[i]]=row.values[i];
						}
						if(!arIds.includes(row.values[3])){
							arIds.push(row.values[3])
						}
						arToBeTrait.push(o);
					}
				});
				
				// console.log(arToBeTrait);
				// let t2=performance.now();
				// let t3=t2-t1;
				// console.log("step 1 done in:"+t3);
				let oSo={arIds:arIds,ar:arToBeTrait}
				callBack(oSo);
			}catch(err){
				console.log(err)
			}
		};
		reader.onerror=(err)=>{
			console.error(err);
			alert("erreur lecture ficher");
		}
		reader.readAsArrayBuffer(file);
	}
	
	
	convertDtInMS(dateHeureStr) {
		// console.log(dateHeureStr);
	  const [datePart, timePart] = dateHeureStr.split(" ");
	  const [jour] = datePart.split("/");
	  const [heure] = timePart.split(":");

	  return parseInt(heure, 10) <= 12 ? jour + "M" : jour + "S";
	}
	
	convertInMinute(dts){
		const [datePart, timePart] = dts.split(" "); 
		const [jour] = datePart.split("/");
		const [heure,minute,second] = timePart.split(":");
		return parseInt(heure)*60+parseInt(minute);
		
	}
	
	async classement1(ar){
		// {dtMS: '06M', Name: 'Patricia', No.: '1', Date/Time: '06/01/2025 12:06:47'}
		// let t1=performance.now();
		try{
			let Oc1={};
			for (let o of ar){
				if(typeof(Oc1[o['dtMS']])=="undefined" ){
					Oc1[o['dtMS']]={};
					Oc1[o['dtMS']][o['No.']]={"ptg":o['Date/Time']}
				}else{
					if(typeof(Oc1[o['dtMS']][o['No.']])=="undefined" ){
						Oc1[o['dtMS']][o['No.']]={"ptg":o['Date/Time']}
					}
				}
			}
			// let t2=performance.now();
			// let t3=t2-t1;
			// console.log("step2 done in:"+t3);
			return Oc1;
		}catch(err){
			console.log(err)
		}
	}
	
	async loopOnDate(o,options={}){
		const{motif="convertInMinute", idPointage=""}=options
		// let t1=performance.now();
		let o1={};
		try{
			let ks=Object.keys(o);
			for (let k of ks ){
				let oc=o[k];
				const rf0=(k.endsWith("M"))?420:840;
				let rf=0;
				let ps=Object.keys(o[k]);
				let i=0;
					for (let p of ps){
						// console.log(oc[p]["ptg"]);
						switch(motif){
							case "convertInMinute":
							o[k][p]['inMinute']=this.convertInMinute(oc[p]["ptg"]);
							break;
							case "refTime":
							let im=o[k][p]['inMinute']
							if(rf===0){
								rf=im;
							}else{
								rf=(rf>im)?im:rf;
							}
							break;
							case "getRetar":
							let r5=o[k]["refTime"]['inMinute'];
							let r6=o[k][p]['inMinute'];
							let dif=r6-r5;
							dif=(dif<10 || dif>60)?0:dif;
							o[k][p]['retard']=dif;
							break;
						}
						
						i++;
					}
					rf=(rf<rf0)?rf0:rf;
					
				if(typeof(o[k]["refTime"])=="undefined" ){
					o[k]["refTime"]={"inMinute":0};
				}else{
					o[k]["refTime"]={"inMinute":rf};
				}
				
				//verif presence
				if(idPointage!=""){
						if(typeof(o[k][idPointage])!="undefined" ){
							o1[k]=o[k][idPointage];
						}else{
							o1[k]="ABS";
						}
				}
				
			}
			// let t2=performance.now();
			// let t3=t2-t1;
			// console.log("step "+motif+" done in: "+t3);		
				if(idPointage!=""){
					return o1
				}else{
						return o;
				}
			
		}catch(err){
			console.log(err)
		}
	
	}
	
	async loopOnIds(ar,o){
		try{
			let ptgBId={}
			// console.log(ar)
			for (let id of ar){
				ptgBId[id]=await this.loopOnDate(o,{motif:"getPresence", idPointage:id})
				
			}
			return ptgBId;
		}catch(err){
			console.log(err);
		}
	}
	
	async decompte(o){
		// let dec={};
		let t1=performance.now();
		let ar=Object.keys(o);
		
		for (let id of ar){
			let dts=Object.keys(o[id]);
			o[id]["sumAbs"]=0;
			o[id]["sumRetard"]=0;
			for(let dt of dts){
				if(o[id][dt]==="ABS"){
					o[id]["sumAbs"]+=0.5;
				}else{
					if(dt.endsWith('M')){
						o[id]["sumRetard"]+=o[id][dt]["retard"];
					}
					
				}
			}
		}
		// let t2=performance.now();
		// let t3=t2-t1;
		// console.log("decompte end in "+t3);
		return o;
	}
	
	/* @return : [{idPointage:"abs Jours- retard min -maladie ?"}] */
	async resumeD(o){
		try{
			let a={} ;
			let ks=Object.keys(o);
			for (let k of ks){
				// console.log(k)
				let sumAbs=o[k]["sumAbs"]
				let sumRetard=o[k]["sumRetard"];
				// a.push({k:sumAbs+"Jours - "+sumRetard+"Min. - ?"})
				a[k]=sumAbs+"J- "+sumRetard+"M- ?";
			}
			return a;
		}catch(err){
			console.log(err)
		}
	}
	
	async importS1(o, options={}){
		const{
			op=""
		}=options;
		// var t1=performance.now();
					// var mylkit=new CLoadkit();
					try{
						// window.myLoadkit.setState();
			
					// console.log(ar);
					const ar=o.ar;
					var Optge= await this.classement1(ar);
					// console.log(Optge);
					Optge=await this.loopOnDate(Optge);
					Optge=await this.loopOnDate(Optge,{motif:"refTime"});
					Optge=await this.loopOnDate(Optge,{motif:"getRetar"});
					// console.log(Optge);//pointage avec retard
					const arIds=o.arIds;
					var o3=await this.loopOnIds(arIds,Optge);
					
					var o4=await this.decompte(o3);
					// console.log(o4);
					
					var o5=await this.resumeD(o4);
					// console.log(o5)
					// var t2=performance.now();
					// var t3=t2-t1;
					// console.log("clcul end in"+ t3)
					if(op==""){
						return {ByDate:JSON.stringify(Optge),ById:JSON.stringify(o4), Resume:JSON.stringify(o5)};
					}else{
						// getResumeOnly
						return {ByDate:Optge,ById:o4, Resume:o5};
					}
					
					// window.myLoadkit.changeInfinitMode(false)  ;
					}catch(err){
						console.log(err)
					}
	}

	/* adding to POINTAGE2 */
	async importS2(o){
		try{
			let url='/addPointage';
			let data={
				mois:this.mois,
				rows:o
			}
			let r=await axios.post(url,data);
			return r
		}catch(err) {
			console.error(err)
		}
	}
	
	async updtEtatSalaire(o){
		// importS1(o,{op="getResumeOnly"})
		// 
		try{
			// var myPersonnel=window.myPersonnel || new ClassPersonnel();
			// console.log(o);
			let myEtatSalaire=window.myEtatSalaire || new ClassEtatSalaire();
			// let resume=await this.importS1(o,{op:"getResumeOnly"});
			// let resume=JSON.parse(o.Resume);
			// console.log(resume);
			let r=await myEtatSalaire.updt(o,{op:"pointageInfo"});
			return r;
		}catch(err){
			console.log(err)
		}
	}
	
}