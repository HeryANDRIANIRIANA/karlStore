class CMiniDatatable{
	constructor(options={}){
		const{varName="myMiniDatatable"}=options;
		this.varName=varName;
	}
	async set(options={}){
		const{dataTOpt2={}}=options;
		
		let dataTOptions={
				deleteEvent:"",
				efColVis:[1],
				selectors:{container:"mySelect01 section.content .container-fluid",table:"table1",widget:"wd1"},
				// D0:D0, 
				aditifBtn:[
					{
					  "extend": "",
					  "text": "Select.",
					  "className": "btn btn-white btn-primary btn-bold",
					  columns: ':not(:first):not(:last)'
					},
					// {
					  // "extend": "",
					  // "text": "Importer",
					  // "className": "btn btn-white btn-primary btn-bold",
					  // columns: ':not(:first):not(:last)'
					// }
				],
				/* these actions are defied inCDatatableEvent, "paramSalaireImport" */
				aditifActions:[ "selectClient"  ],
				varName:this.varName,
				titre:"SELECTION CLIENT"
			}
			
			
			
			if(Object.keys(dataTOpt2).length>0){
			let ps=window[dataTOpt2.globalData];
			// console.log(ps)
			let D0={colNames:Object.keys(ps[0]),data:ps};
				dataTOptions={
					deleteEvent:dataTOpt2.deleteEvent,
					initCompleteEvent:dataTOpt2.initCompleteEvent,
					selectRowEvent:dataTOpt2.selectRowEvent,
					selectors:dataTOpt2.selectors,
					efColVis:(typeof(dataTOpt2.efColVis)!="undefined")?dataTOpt2.efColVis:[0,1,2],//
					D0:D0,
					aditifBtn:dataTOpt2.aditifBtn,
					aditifActions:dataTOpt2.aditifActions,
					varName:dataTOpt2.varName,
					titre:dataTOpt2.titre
				}
			 // s=dataTOpt2.varName
			}
			// console.log(dataTOptions);
			
			let s=this.varName+"CDatatable";
			// console.log(s);
			// let s=this.varName;
			window[s]=new CDatatable(dataTOptions);

			let o= window[s].init({efColVis:dataTOptions.efColVis,deleteEvent:dataTOptions.deleteEvent,initCompleteEvent:dataTOptions.initCompleteEvent,selectRowEvent:dataTOptions.selectRowEvent,titre:dataTOptions.titre});
			
			return o;
	}
	
	async unset(options={}){
		let v="myTable"+this.varName;
		window[v].destroy();
	}
}