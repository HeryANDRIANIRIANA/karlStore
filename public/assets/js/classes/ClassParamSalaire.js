class ClassParamSalaire{
	constructor(options={}){
		const{
			varName="MyparamSalaire"
		}=options;
		this.varName=varName;
		this.paramSalaire=(typeof(window.paramSalaire)!='undefined')?window.paramSalaire:{};
	}
	/**supposons que paramSalaire est dépendant du mois courent.
	du coup nous souhaitons lancer un confirm si nous vonlons retélécharger ala valeur ou reutiliser celle à dispo
	
	*/
	async checkIfAlreadyExist(){
		if(Object.keys(window.paramSalaire).length==0 ){
			try{
			window.paramSalaire=await this.getParamSalaireFromDb();
			window.paramSalaire=window.paramSalaire[0].res;
			}catch{
				
			}finally{
				// return window.paramSalaire;
			}
		}else{
			return window.paramSalaire;
		}
		
	}
	
	/**get paramSalaire fromDataBase
	* result saved in window.paramSalaire
	*/
	async getParamSalaireFromDb(){
		let url=`/paramSalaireInfo`;
		let data={};
		const response=[];
		try{			
			let response=await axios.get(url);
			// let r=response.data.res.filter((k,v)=>{return v!=null});
			let r=response.data.res;
			window.paramSalaire=r;
			return r;
		}catch(err){
			console.error(err)
		}finally{
			
		}
	}
	
	/* affiche le paramSalaire dans un datatable */
	showInDataTable(options={}){
		const{ps1='', dataTOpt2={}}=options;
		
			let ps=window.paramSalaire;
			ps=ps.filter((v)=>{return v!=null});
			let D0={colNames:Object.keys(ps[0]),data:ps};
			let dataTOptions={
				deleteEvent:"",
				efColVis:[0,1,2],
				D0:D0, 
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
				/* these actions are defied inCDatatableEvent */
				aditifActions:[ "paramSalaireExport1" , "paramSalaireImport" ],
				varName:"paramSalaire",
				titre:"PARAM-SALAIRE"
			}
			
			if(Object.keys(dataTOpt2).length>0){
			ps=window[dataTOpt2.globalData];
			// console.log(ps)
			D0={colNames:Object.keys(ps[0]),data:ps};
			dataTOptions={
				deleteEvent:dataTOpt2.deleteEvent,
				efColVis:(typeof(dataTOpt2.efColVis)!="undefined")?dataTOpt2.efColVis:[0,1,2],//
				D0:D0,
				aditifBtn:dataTOpt2.aditifBtn,
				aditifActions:dataTOpt2.aditifActions,
				varName:dataTOpt2.varName,
				titre:dataTOpt2.titre
			}
			
			}
			
			let myDtTable=new CDatatable(dataTOptions);

			 myDtTable.init({efColVis:dataTOptions.efColVis,deleteEvent:dataTOptions.deleteEvent,titre:dataTOptions.titre});
		
	}
	
	/* paramSalareExport to Excel 
	@dependence : exceljs
	*/
	async paramSalaireExport1(){
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet('paramSalaire');
		const ps=window.paramSalaire;
		let h0=Object.keys(ps[0]);
		
		/* prepar header */
		worksheet.columns=[];
		worksheet.columns=h0.map((h)=>{
			return { header: h, key: h, width: 15 }
		});
		const paramsheet = workbook.addWorksheet('param');
		let arParams=[['Salaire minimum', 250000], ['Réductions par enfant à charge', 2000], ['Minimum imposable', 3000]]
		let i=1;
		for (let p of arParams){
			paramsheet.getCell('A'+i).value = p[0] ;
			paramsheet.getCell('B'+i).value = p[1] ;
			i++;
		}
		
		/* add row */
		// worksheet.addRow({ produit: 'Pommes', prix: 2.5, quantite: 10 });
		let j=2;
		for (let p of ps){
			worksheet.addRow(p);
			worksheet.getCell('H'+j).value = { formula: 'D'+j+'+G'+j };
			
			worksheet.getCell('I'+j).value = {formula:"=MAX(0,1% *MIN(8*'param'!B1 ,MAX( 'param'!B1,H"+j+"))) "};//CNAPS
			worksheet.getCell('O'+j).value = {formula:"=H"+j+"-I"+j+"-L"+j};//BaseIRSA
			worksheet.getCell('P'+j).value = {formula:" =MAX('param'!B3, 0 + MIN(MAX(0, O"+j+" - 350000), 50000) * 5% + MIN(MAX(0, O"+j+" - 400000), 100000) * 10% + MIN(MAX(0, O"+j+" - 500000), 100000) * 15% + MAX(0, O"+j+" - 600000) * 20% - 'param'!B2 * R"+j+") "};//IRSA
			j++;
		}
		// Masquer les colonnes [2,3,5,6,7,10,11,13,14,16]
		let arHidenCols=[2,3,5,6,7,8,10,11,13,14,15,17,18,19,20,21];
		for(let a of arHidenCols){
			worksheet.getColumn(a).hidden = true;
		}
		//formatter en millier et reduire la taille
		let formatedCols=[4,9,12,16]
		for(let a of formatedCols){
			worksheet.getColumn(a).eachCell((cell, number) => {
			cell.numFmt = '#,##0';
			cell.font = { size: 8 };
		});
		}
		
		workbook.xlsx.writeBuffer().then(buffer => {
		 const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
		 saveAs(blob, 'paramSalaire.xlsx');
		 }); 
	}

	/*import paramSalaire from Excel to db
	@ dependence:input type file in index
	*/
	pramSalaireImport(){
		const fileInput=document.getElementById('myFile')
		fileInput.click();
		fileInput.addEventListener('change', () => {
			// const file = fileInput.files[0];
			const formData = new FormData();
			  formData.append('file', fileInput.files[0]);

			  axios.post('/importParamSalaire', formData, {
				headers: {
				  'Content-Type': 'multipart/form-data'
				}
			  })
			  .then(response => {
				window.paramSalaire=response.data.res;
				this.showParamSalaireInDatatable();				
				alert('Import Terminé')
			  })
			  .catch(error => {
				console.error(`Erreur lors de l'envoi du fichier:`, error);
			  });
			// Traiter le fichier ici
		  });
	}
	
	// refredatatable
	refreshDatatable(){
		// "#"+this.selectors.table=>"paramSalaire"||varName+"-table1";
				// actualier la table
		let table=$("#paramSalaire-table1").DataTable();
		table.clear();
		
	}
	
}