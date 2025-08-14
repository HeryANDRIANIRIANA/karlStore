class ClassArticle{
	constructor(options={}){
		const{varName="myArticle"}=options;
		this.varName=varName;
		this.idAnnee=window["idAnnee"];
		let myDataR=new ClassDataRectif();
		this.dbman=myDataR;
	}
	
	async getData(options={}){
		const{}=options
		try{
			let url='/getListArticle';
			let data={};			
			let r=await this.dbman.getData({gStruct:"articleStructure", url:url, data:data});
			window["articleData"]=r;
			return 0;
		}catch(err){
			console.log(err)
		}
		
	}
	
	async arrageByCodeArticle(){
		try{
			let s=myLoadkit.addProgressbar({text:"Arange article by code", percent:0})
			let i=0;
			let batchSize=10;
			let td=10;
			function arangeArticle(){
				let o=window["articleData"]
				let start=performance.now();
				let end=Math.min(i+batchSize,o.length)
				for(;i<end;i++){
					// console.log(o[i]);
					let CodeArticle=o[i]['CodeArticle'];
					if(window["articleDataByCodeArticle"]===undefined||window["articleDataByCodeArticle"]===null){
						window["articleDataByCodeArticle"]={}
					}
					window["articleDataByCodeArticle"][CodeArticle]=o[i]
				}
				
				let d=performance.now()-start;
				if(d<td && batchSize<1000){batchSize+=10}else if(d>td && batchSize>10){batchSize-=10};
				
				if(i===o.length){
					showNotification({text:"classement par codeArticle Done", colorName:'bg-green', timer:1000});
					myLoadkit.checkAllProgression()
				}else if(i<o.length){
					let t=o[i]['CodeArticle'];
					let p=parseInt(i/(o.length-1)*100 )
					myLoadkit.refreshProgressbar({s:s, text:t, percent:p})
					setTimeout(arangeArticle,5);
				}
				
			}
			if(window["articleData"]===undefined|| window["articleData"]===null){
				await this.getData()
				arangeArticle()
			}else{
				arangeArticle()
			}
			
		}catch(err){console.log(err);}
	}
	
	async getProfileDsp(options={}){
		const{}=options
		try{
			let url='/getProfileData';
			let data={};			
			let r=await this.dbman.getData({gStruct:"articleProfileStructure", url:url, data:data});
			window["articleProfileData"]=r;
			return 0;
		}catch(err){
			console.log(err)
		}
		
	}
	
	profieDspbyCodeArticle(){
		let o={};
		for (const el of window["articleProfileData"]) {
		 o[el["CodeArticle"]]=el
		}
		return o;
		
	}
	
	async showInDatatable(options={}){
		const{c0='root-container'}=options
		try{
			if(typeof(window["datatableIn"]["root-container"])==="string"){
			let v=window["datatableIn"]["root-container"]
			// console.log(v);
			await window[v].unset();
			}
			
			window.myMiniD=new CMiniDatatable({varName:this.varName});
			
			let dataTOptions={
					deleteEvent:"",
					initCompleteEvent:"",
					efColVis:[1,2,3],
					globalData:"articleData",
					selectors:{container:c0+" section.content .container-fluid",table:"table1",widget:"wd1"},
					aditifBtn:[],
					/* these actions are defied inCDatatableEvent, "paramSalaireImport" */
					aditifActions:[],
					varName:this.varName,
					titre:"LISTE DES ARTICLES"
				}
				let s=await myMiniD.set({dataTOpt2:dataTOptions})
				return 0;
			
		}catch(err){
			console.log(err)
		}
		
	}

	async generateSelect(options={}){
			const{}=options
			try{
				if(typeof(window["articleData"])==="undefined"){
					await this.getData()
				}
				
				let s=""
				window["articleData"].forEach((v, k) => {
					if(v.QteStockArt>0){
						let dataString="";
						for (let k in v) {
							let v1=v[k]
							dataString+=`data-${k}="${v1}" `
								// console.log(key, obj[key]); // Affiche les clés et leurs valeurs
							}
						s+=`<option value="${v.CodeArticle}" ${dataString} >${v.CodeArticle}</option>`
					}
					});
				return s;
			}catch(err){
				console.log(err)
			}
			
		}
		



}