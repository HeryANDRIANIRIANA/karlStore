class ClassEtatSalaire{
	constructor(options={}){
		const{
			mois=window.mois
		}=options
		this.mois=mois;
		this.EtatDeSalaire=window.EtatDeSalaire;
	}
	
	async getAllEtatSalaireFromDb(){
		let url='/getAllEtatSalaire';
		let data={mois:this.mois};
		try{
			let es=await axios.post(url,data);
			// console.log(es);
			if(es.data.length==0){
				console.log('etat de salaire absent, nous devons en créer un');
				alert('etat de salaire absent, nous devons en créer un');
				try{
					es=await this.buildNewEtatSalaire();
				}catch(err){
					console.error(err);
					throw err;
				}
			}else{
				window.EtatDeSalaire=es["data"];
			}
			return es["data"];;
			
		}catch(err){
			console.error(err)
			throw (err)
		}
	}
	
	async buildNewEtatSalaire(){
		try{
			myLoadkit.setState()
		var url='/buildNewEtatSalaire';
		var stepNumber=1;
		var EsStructur=[];
		var data={mois:this.mois};
		let es2=await axios.post(url,data);//step1 insert to PAIEMENT {stepNumber:stepNumber, EsStructur:EsStructur}
		stepNumber=es2.data.stepNumber;
		EsStructur=es2.data.EsStructur;
		// console.log(es2);
		stepNumber++;
		// step2 getPersollenList
		let myPerso=new ClassPersonnel()
		let persoL=await myPerso.getList();
		let persoList=persoL.data;
		// console.log(persoL)
		data={mois:this.mois, data:{data: persoList ,EsStructur:EsStructur ,stepNumber:stepNumber,source:"PERSONNEL"}}
		url='/updtEtatSalairePersoInfo';
		let step2=await axios.post(url,data);
		// console.log(step2)
		
		// step3 update mois Informations
		 stepNumber++;
		let m=new ClassMois();
		let mI1=await m.getMoisInfo();
		let moisInfo=[mI1.data[0]] ;
		// console.log(moisInfo)
		data={mois:this.mois, data:{data: moisInfo ,EsStructur:EsStructur ,stepNumber:stepNumber,source:"MOIS2"}}
		url='/updtEtatSalairePersoInfo';
		let step3=await axios.post(url,data);
		
		// console.log(step3);
		// window.varInfinitMode=false;
		
		setTimeout(async ()=>{
			var myAvan=new ClassAvance();
					await myAvan.getDataFromDb();
					let r3= await myAvan.sumAvanceByCIN();
					// console.log(r3);
					let r4= await myAvan.updateEtatSalaire(r3);
					// console.log(r4)
					await this.showInDatatable();	
					window.varInifinitMode=false;
					},2000 )
		
		}catch(err){
			console.error(err);
			throw err;
		}
	}
	
	async showInDatatable(){
		// dataTOpt2globalDataaditifBtnaditifActionsvarName
		if(window.EtatDeSalaire=={}){
			window.EtatDeSalaire=await this.getAllEtatSalaireFromDb();
			this.EtatDeSalaire=window.EtatDeSalaire;
		}
		// console.log(window.EtatDeSalaire)
		let  dataTOpt2={globalData:"EtatDeSalaire", 
		titre:"ETAT DE SALAIRE",
		aditifBtn:[
					{
					  "extend": "",
					  "text": "Exporter",
					  "className": "btn btn-white btn-primary btn-bold",
					  columns: ':not(:first):not(:last)'
					},
					{
					  "extend": "",
					  "text": "Déduire retard",
					  "className": "btn btn-white btn-primary btn-bold",
					  columns: ':not(:first):not(:last)'
					}
					],
		aditifActions:["exportEtatSalaire", "deduireRetard"],
		varName:"EtatSalaire" }
		// polymorphisme
		let myps=new ClassParamSalaire();
		myps.showInDataTable({dataTOpt2:dataTOpt2});
		
		
	}
	
	async export(){
		const esData=await this.getAllEtatSalaireFromDb();
		const workbook = await new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet(''+this.mois);
		const OTIVsheet = workbook.addWorksheet('OTIV');
		const NON_OTIVsheet = workbook.addWorksheet('NON_OTIV');
		// console.log(esData);
		var h0=Object.keys(esData[0]);//array of colNames
		
		//addImage
		const imageId = workbook.addImage({
				base64: await this.getBase64FromUrl('images/ENTETE.gif'), // Exemple avec le logo Google
					extension: 'gif',
				});
		
		/* prepar header */
		worksheet.columns=[];
		
		worksheet.columns=h0.map((h)=>{
			return { header: h, key: h, width: 15 }
		});
		
		OTIVsheet.columns=h0.map((h)=>{
			return { header: h, key: h, width: 15 }
		});
		
		NON_OTIVsheet.columns=h0.map((h)=>{
			return { header: h, key: h, width: 15 }
		});
		
		let h=2;
		let otivLines=[];
		let nonOtivLine=[];
		for (let p of esData){
			let dt=new Date();
			let d=dt.getDate();
			let m=dt.getMonth();
			let y=dt.getFullYear();
			m+=1;
			let m2="";
			let d2="";
			m2=m.toString().padStart(2,"0");
			d2=d.toString().padStart(2,"0");
			// d=d.padStart(2,"0");
			p["DatePaiement"]=d+"-"+m2+"-"+y;
			// { formula: "='"+this.mois+"'!"+adress+"" }
				
			worksheet.addRow(p);
			// let adress=worksheet.getCell(h,x)._address
			worksheet.getCell(h,15).value = { formula: "='"+this.mois+"'!J"+h+"+'"+this.mois+"'!M"+h+"+'"+this.mois+"'!N"+h+"" };//salaire brut
			worksheet.getCell(h,23).value = { formula: "='"+this.mois+"'!P"+h+"+'"+this.mois+"'!Q"+h+"+'"+this.mois+"'!R"+h+"+'"+this.mois+"'!S"+h+"+'"+this.mois+"'!U"+h+"" };//total deduc
			worksheet.getCell(h,24).value = { formula: "='"+this.mois+"'!O"+h+"-'"+this.mois+"'!W"+h+"" };//net a payer
			await this.createBuletin(workbook,h,p,imageId,{cNames:h0} )
			if(p.OTIV=='OTIV'){
				otivLines.push(h);
			}else{
				nonOtivLine.push(h)
			}
			h++
		}
		
		// this.addToOtivSheet({arLines:otivLines},worksheet,OTIVsheet,NON_OTIVsheet)
		this.addToOtivSheet({arLines:otivLines},worksheet,OTIVsheet)
		this.addToOtivSheet({arLines:nonOtivLine},worksheet,NON_OTIVsheet)
		this.otivSheetSetUPPage(worksheet,{sheet1:true});
		this.otivSheetSetUPPage(NON_OTIVsheet);
		this.otivSheetSetUPPage(OTIVsheet);
		
		workbook.xlsx.writeBuffer().then(buffer => {
		 const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
		 saveAs(blob, 'EtatSalaire'+this.mois+'.xlsx');
		 }); 
		 
	}
	
	// addToOtivSheet(options={},worksheet,OTIVsheet,NON_OTIVsheet )
	addToOtivSheet(options={},worksheet,sheet ){
		const{
			esData=this.EtatDeSalaire,//for colNameArr
			arLines=[]//numeros de ligne ou se trouvent les occurences OTIV
		}=options
		let adress="";
		let i=0;
		let x=1;
		let colNames=Object.keys(esData[0]);
		let y=2;//y courant de parcours de OTIVsheet
		
		while(i<arLines.length){
			x=1;
			while(x<=colNames.length){
				adress=worksheet.getCell(arLines[i],x)._address
				sheet.getCell(y,x).value = { formula: "='"+this.mois+"'!"+adress+"" };	
				x++
			}
			
			i++;
			y++;
		}

	}
	
	otivSheetSetUPPage(sheet,options={}){
		const{sheet1=false}=options;
		if(sheet1==false){
			sheet.insertRow(1, "ETAT DE SALAIRE PERSONNEL TSIMISARAKA "+window.mois);
		}
		let colsToHideNum=[2,3,4,5,6,7,8,9,11,12,13,14,18,20,21,22,25,26,27,28,29,30,31,32,33,34,36]
		colsToHideNum.forEach((v,k)=>{
			sheet.getColumn(v).hidden = true;
		} );
	}
	
	getColNumberFromColName(h0,name){
		let i=1
		i+=h0.indexOf(name);
		return i
	}
	
	/* createBuletin - création de buletin par personnel p
	@params:p-{}- objet ligne paiement
	@params:numL-0- chiffre ligne paiement
	@params: champRequis- facultatif
	nombre_en_lettre("12 236.24")
	*/
	async createBuletin(wb,numL,p,imageId,options={}){
		const{
			cNames=[],
			champRequis=[['NomPrenom', 'CIN', 'NomFonction', 'IdAnnee', 'Mois', 'DatePaiement', 'PeriodeDebut', 'PeriodeFin', 'SalaireBase', 'PrimeAncienne', 'MontantSup', 'SalaireBrute' ],['NumOrdrePaiement', 'MntAvance', 'CNAPSSB', 'OMSISB', 'IRSASB', 'TotalDedu', 'ARM', 'NetAPayer', 'Observation']],
			champLabel={NomPrenom:'NOM ET PRENOM', CIN:'CIN' , NomFonction:'FONCTION', IdAnnee:'ANNEE', Mois:'Mois', DatePaiement:'PAYE LE', PeriodeDebut:'PERIODE DU', PeriodeFin:'AU', SalaireBase:'S- BASE', PrimeAncienne:'PRIME', PrimeAncienne:'SUPPLEMENTAIRE', SalaireBrute:'S- BRUTE', NumOrdrePaiement:'NUM-FicheP', MntAvance:'AVANCE', CNAPSSB:'CNAPSSB', OMSISB:'OMSISB', IRSASB:'IRSASB', TotalDedu:'TotalDedu', ARM:'A-R-M', NetAPayer:'NetAPayer', Observation:'Observation' }
		}=options;
		try{
			var h0=cNames;
			const s1=wb.addWorksheet(''+numL);
			let c=["A","B","C","D","E"];
			// console.log("p="+p);
			s1.columns=c.map((h3)=>{
			return { header: h3, key: h3, width: 15 }
			});
			
			let n=(champRequis[0].length>champRequis[1].length)?champRequis[0].length:champRequis[1].length;
			
			// elaboration des lignes
			let i=0
			let arNP=[];
			while (i<n){
				// {A:val,B:val,C:val,D:val}
				let l={};
				let k='';
				let numC=0;
				let adress="";
				if(typeof(champRequis[0][i])!='undefined' && champRequis[0][i]!='undefined'){
					k=champRequis[0][i];
					l['A']=champLabel[k];
					
					l['B']=(p[k]!=null)?p[k]:"" ; 
					// numC=this.getColNumberFromColName(h0,k);
					// adress=s1.getCell(numL,numC)._address;
					
					// l['B']=(p[k]!=null)?{ formula: "='"+this.mois+"'!"+adress+"" }:"" ; 
					// sheet.getCell(y,x).value = { formula: "='"+this.mois+"'!"+adress+"" };	
					//numL et numC
					// console.log(l['A'],l['B'])
					}
				
				if(typeof(champRequis[1][i])!='undefined' && champRequis[1][i]!='undefined'){
					k=champRequis[1][i];
					l['D']=champLabel[k];
					l['E']=(p[k]!=null)?p[k]:"";
					// numC=this.getColNumberFromColName(h0,k);
					// adress=s1.getCell(numL,numC)._address;
					// l['E']=(p[k]!=null)?{ formula: "='"+this.mois+"'!"+adress+"" }:"";
					
					}
				arNP.push(l);
				i++;
			}
			// console.log("p="+arNP)
			s1.addRow();
			for(let p1 of arNP){
				s1.addRow(p1)
			}
			
			// Fusionner 1er ligne
			s1.mergeCells('A1:E1');
			s1.getCell("A1").value="";
			// s1.insertColumns(3, 1);
			// s1.getCell("A1").style = { alignment: { horizontal: 'center' } };			
			s1.getRow(1).height = 40;	
			
			
			// 3. Ajouter l'image à la feuille de calcul
			s1.addImage(imageId, {
				tl: { col: 2, row: 0 }, // Position de l'angle supérieur gauche (colonne B, ligne 2)
				// ext: { width: 100, height: 75 },
				 br: { col: 3, row: 1 }, // Position de l'angle inférieur droit (colonne E, ligne 7)
				editAs: 'oneCell' // Important pour que l'image reste ancrée à la cellule
				// editAs: 'absoluteAnchor', // Important pour que l'image reste ancrée à la cellule
				
				});
			
			let k=2;
			while (k<=14){
				s1.mergeCells("B"+k+":C"+k+"");
				k++;
			}
			
			s1.getColumn('C').width= 10;
			s1.getColumn('B').width= 20;
			s1.getColumn('A').width= 17;
			
			// Appliquer les bordures à la plage A1:E13
			for (let row = 3; row <= 14; row++) {
				for (let col = 1; col <= 5; col++) {
					const cell = s1.getCell(row, col);
					cell.border = {
						top: { style: 'thin', color: { argb: 'FF000000' } }, // Noir
						left: { style: 'thin', color: { argb: 'FF000000' } }, // Noir
						bottom: { style: 'thin', color: { argb: 'FF000000' } }, // Noir
						right: { style: 'thin', color: { argb: 'FF000000' } }, // Noir
					};
				}
			}
			
			// Les cellules à formatter en numerique
			let ars=["C11","C12","C14","E3","E4","E5","E6","E7","E8","E10"]
			// for (let col = 1; col <= 5; col++) {
			for (let col of ars) {
            const cell = s1.getCell(col);
            cell.numFmt = '#,##0'; // Format de nombre avec séparateur de milliers
			}
			
			
			return i;
		}catch(err){
			throw err;
		}
	}
	
	//Fonction asynchrone pour convertir une URL en base64
	async getBase64FromUrl(url) {
		const data = await fetch(url);
		const blob = await data.blob();
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onloadend = () => {
				const base64data = reader.result;
				resolve(base64data);
			}
		});
	}
	
	
	buildRowFromPointage(data){
		let persoData=window.personnelData.list;
				let r=JSON.parse(data["Resume"]);
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
	}
	
	buildRowFromAvance(data){
		let o=window.EtatDeSalaire;
		// console.log(o)
		let a=[]
		o.forEach((v,k)=>{
			let CIN=v["CIN"]
			let MntAvance=(typeof(data[CIN])!="undefined")?data[CIN]:0;
			let IRSASB=v["IRSASB"];
			let OMSISB=v["OMSISB"];
			let CNAPSSB=v["CNAPSSB"];
			let RetenuDivers=v["RetenuDivers"];
			
			let SalaireBrute=v["SalaireBrute"];
			let TotalDedu=IRSASB+OMSISB+CNAPSSB+MntAvance+RetenuDivers;
			let NetAPayer=SalaireBrute-TotalDedu;
			a.push({CIN:CIN, MntAvance:MntAvance, NetAPayer:NetAPayer, TotalDedu:TotalDedu})

		})
		// console.log(a);
		return a;
	}
	
	async updt(data,options={}){
		const{op=""}=options
		try{
			let r={} ;
			let nr=[];
			switch (op){
				case "pointageInfo":
				// console.log(data);
				nr=this.buildRowFromPointage(data);
				// console.log(r)
				break;
				
				case "retenuInfo":
				nr=this.buildRowFromAvance(data);
				break;
				
				case "observationInfo":
				nr=data;
				break;
			}
			
			let url='/updtEtatSalairePointageI';
			let data1={
				mois:window.mois,
				rows:nr
			}
			r=await axios.post(url,data1);
			
			return r;
		}catch(err){
			console.log(err)
		}
	}
	
	/* calculMontant retard calcule le montant retard par CIN et
	@params ar: row selected from datatable Etatde SalaireBase
	@return ar:[ {CIN:, MntAvance:, Motif:"retard", Mois:this.mois} ,{...}] CIN,Mois,MntAvance,Motif,NumOrdreAvance
	*/
	async calulMontantREtard(ar){
		try{
			let ar1=[]
			// console.log(ar)
			for (let r of ar){ 
			// console.log(r)
			//CIN, Mois, SBParHeurePermanent, ARM
			let SBParHeurePermanent=parseInt(r['SBParHeurePermanent']);
			let [a,r1,m] =r["ARM"].split('-');
			// console.log(r1)
			let r2=parseInt(r1.split('M')[0])
			// console.log(r2)
			// console.log(SBParHeurePermanent)
			let r3=r2*SBParHeurePermanent/60;
			let o={CIN:r['CIN'], Mois:window.mois, MntAvance:parseInt(r3), Motif:"Retard"};
			ar1.push(o);
			}
			return ar1
		}catch(err){
			console.log(err)
		}
	}
		
	async deduireRetard(){
		try{
			var selectedRows=window.myTable.rows({selected:true});
				let d=selectedRows.data().toArray();
				// console.log(d)
				let l=d.length
				let t="Vous voulez deduire le retard de "+l+" personnel";
				if(d[0]["ARM"] !==null){
					if(confirm(t)){
					// step1 : etat salaire calcul du montant
					// console.log(d)
					myLoadkit.setState();
					let retard1=await this.calulMontantREtard(d);
					// step2: avance verrification de doubllon
					let myAvance=window.myAvance || new ClassAvance();
					let avRow=await myAvance.verifDoublon(retard1);
					
					 // console.log(avRow);
					if(avRow["rowsToInsert"].length>0){
						let ins=await myAvance. addAvance(avRow["rowsToInsert"]);
					}
					
					if(avRow["rowsToUpdt"].length>0){
						let updt=await myAvance. addAvance(avRow["rowsToUpdt"],{oper:"updt"});//Attention polymorphisme
					}
					
					setTimeout(async ()=>{
					await myAvance.actualiseEtatSalaire();
					let obser=await myAvance.sumAvanceByCINByMotif();
					
					console.log(obser);
					// on va nettoyerobservationInfo
					let oserCleaned=await this.cleanObservfield(obser);
					
					// console.log(oserCleaned)
					await this.updt(oserCleaned,{op:"observationInfo"})
					// setTimeout(async ()=>{
						await this.showInDatatable();
						window.varInifinitMode=false;
						// console.log('arrivée')
						// },2000 )
					},2000 )
					
					// step4: etatSalaire mise à jour Observation: retard:XXX ar
					}
				}else{
					let t1='Veuillez importer pointage, ARM null'
					alert(t1)
				}
				// if(deleteEvent!=="" && d.length>0){
					// let myDtEv=new CDatatableEvent();
					// myDtEv[deleteEvent](d);
					
				// }
		}catch(err){
			console.log(err)
		}
	}

	async cleanObservfield(ar){
		try{
			let r1=[];
			for(let o of ar){
				
				let o1=o['Observation'] ;
				
				let ks=Object.keys(o1);
				let s=" ";
				for(let k of ks){
					if(k!="Avance"){
						s+=" "+k+":"+o1[k]
					}
				}
				
				r1.push({CIN:o['CIN'], Observation:s})
				
			}
			
			return r1;
		}catch(err){
			console.log(err)
		}
	}

}
