class ClassClient{
	constructor(options={}){
		const{varName="myClassClient"}=options
		this.varName=varName;
		this.day=window.day;
		this.clientList0=window.clientList0;
	}
	
	/* my goal was to get list of client with rest a payer */
	async getData(){
		try{
			let d=new Date();
			let url='/getListClient0';
			let data={
				idAnnee:d.getFullYear()
			}
			let r=await axios.post(url,data);
			// console.log(r);
			let myDataRec=new ClassDataRectif();
			let r1=await myDataRec.rectifyDataFromDb(r);
			let r2=await this.elimineDoublon(r1);
			// console.log(r2);
			window.clientList0=r2;
			return window.clientList0;
		}catch(err){
			console.log(err)
		}
	}
	
	async elimineDoublon(ar){
		try{
			// let t1=performance.now();
			let r=[];
			let curClientName="";
			for(let o of ar){
				if(o['NomClient']!==curClientName){
					curClientName=o['NomClient'];
					r.push(o)
				}
			}
			let t2=performance.now();
			// let t3=t2-t1;
			// console.log(t3);
			return r;
			
		}catch(err){
			console.log(err)
		}
	}
	
	async selectClient(options={}){
		const{c0="mySelect01"}=options
		try{
			// console.log(window.clientList0);
			if(Object.keys(window.clientList0).length==0){
				myLoadkit.setState();
				await this.getData();
				window.varInifinitMode=false;
			}
			window.myMiniS=new CminiSelect({varName:this.varName});
			let s=await myMiniS.set();
			window.myMiniD=new CMiniDatatable({varName:this.varName});
			// console.log(window["clientList0"]);
			let dataTOptions={
				deleteEvent:"",
				selectRowEvent:"selectClient",
				efColVis:[1],
				globalData:"clientList0", 
				selectors:{container:c0+" section.content .container-fluid",table:"table1",widget:"wd1"},
				
				aditifBtn:[
					// {
					  // "extend": "",
					  // "text": "Select.",
					  // "className": "btn btn-white btn-primary btn-bold",
					  // columns: ':not(:first):not(:last)'
					// },
					// {
					  // "extend": "",
					  // "text": "Importer",
					  // "className": "btn btn-white btn-primary btn-bold",
					  // columns: ':not(:first):not(:last)'
					// }
				],
				/* these actions are defied inCDatatableEvent, "paramSalaireImport" */
				// aditifActions:[ "selectClient"  ],
				aditifActions:[],
				varName:this.varName,
				titre:"SELECTION CLIENT"
			}
			await myMiniD.set({dataTOpt2:dataTOptions})
			
		}catch(err){
			console.log(err)
		}
	}
	
	/* selectClient2
	find BC and Factures of clientSelected
	*/
	async selectClient2(options={}){
		const{c0="mySelect01"}=options
		try{
			// console.log(d);
			let d=window.clientSelected;
			// console.log(d)
			
			await window.myMiniD.unset();
			await window.myMiniS.unset();
			let NomClient=d[0]["NomClient"];
			let IdClient=d[0]["IdClient"];
			if(typeof(window.systemMenu[3]) !="undefined"){
				window.systemMenu[3].node=[];
			}
			window.systemMenu[1].text=NomClient;
			window['BonCommande'][NomClient]=[] ;
			let myBc=new ClassBonCommande();
			let r=await myBc.getData({IdClient:IdClient});
			
			await window['tv0'].addNode({r:r});
			
			window['BonCommande'][NomClient].push(r);
			window["listFactureClient"]={};
			window["listFactureClient"][NomClient]=[]
			let myfact=new ClassFacture();
			r =await myfact.getListFacture({IdClient1:IdClient});
			window["listFactureClient"][NomClient].push(r)
			
			await window['tv0'].node3Reset();
			// if(r[0]["NumFact"]!==""){
			// await window['tv0'].addNode({ r:r, nodeRow:3, nodeText:"FACTURES", subNodefn:"getFacture", subNodekey:"NumFact" });
			// }
			//ICI je dois mette remove child of node3
			// mySelect01
			// console.log(window["datatableIn"][c0] );
			// console.log(typeof(window["datatableIn"]["root-container"]));
			if(typeof(window["datatableIn"]["root-container"])==="string"){
				let v=window["datatableIn"]["root-container"];
				// console.log(v);
				await window[v].unset();
			}

			
			window.varInifinitMode=false;
			
			
			return 0;
		}catch(err){
			console.log(err)
		}
	}
	
	
	
}