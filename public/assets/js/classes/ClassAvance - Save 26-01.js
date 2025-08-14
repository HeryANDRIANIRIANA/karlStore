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
	
	async exportA(){
		try{
		const data=await this.getDataFromDb();
		const workbook = await new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet('AVANCE_'+this.mois);
		let h0=Object.keys(data[0]);
		worksheet.columns=[];
		worksheet.columns=h0.map((h)=>{
			return { header: h, key: h, width: 15 }
		});
		for(let p of data){
			worksheet.addRow(p)
		}
		
		workbook.xlsx.writeBuffer().then(buffer => {
		 const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
		 saveAs(blob, 'AVANCE_'+this.mois+'.xlsx');
		 }); 
		}catch(err){
			console.error(err)
		}
	}
	
	async importA(options={}){
		const {
			url='/importAvance',
			globalData='avancdData',
			nextFn=()=>{
				let o=new ClassAvance()
				o.showInDatatable();				
				alert('Import Terminé')
			}
		}=options;
		const fileInput=document.getElementById('myFile')
		fileInput.click();
		fileInput.addEventListener('change', () => {
			// const file = fileInput.files[0];
			const formData = new FormData();
			  formData.append('file', fileInput.files[0]);
			  formData.append('mois', this.mois);

			  axios.post(url, formData, {
				headers: {
				  'Content-Type': 'multipart/form-data'
				}
			  })
			  .then(response => {
				window[globalData] =response.data.res;
				nextFn();
			  })
			  .catch(error => {
				console.error(`Erreur lors de l'envoi du fichier:`, error);
			  });
			// Traiter le fichier ici
		  });
	}

	async deleteA(d){
		let t="Vous ête sur le point de supprimer "+d.length+" ligne de la table avance, confirmez?";
		if(confirm(t)){
			try{
					let url="/deleteAvance";
					let data={
							rows:d,
							mois:this.mois
						}
					let r=await axios.post(url,data);
					console.log(r);
					return r;
			}catch(err){
				throw err
			}
		}
	}
}