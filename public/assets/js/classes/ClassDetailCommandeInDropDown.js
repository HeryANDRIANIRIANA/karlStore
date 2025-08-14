class ClassDetailCommandeInDropDown{
	constructor(){
			let cible="nav.navbar";
			let btnDetailCommanInNav="#btnDetailCommanInNav"
			if($(btnDetailCommanInNav).length===0){
				let s=`<div id='btnDetailCommanInNav' ></div>`
				$(cible).prepend(s)
				// window["myDb1"]=new DropDown2('#btnDetailCommanInNav')
				// window["myDb1"].addToDom({initFn:'initDtTableWInDropdown'})
				window["myDb1"]=new AhDropTable('#btnDetailCommanInNav',{
					lineSelectedAction:"detailCommandeLineSelected",
					lineSelectedData:"travauxSelectedData", 
					iconColumnParams:[
						{condition:{colName:"IsChequerM", sign:"=", colValue:"Non"},icon:{iconName:"tool", iconClass:"feather-icon-animedGreen", iconAction:"openChequeMatierEditPannel"}}
					]
				})
				window["myDb1"].setState('loading')
				
			}
	}
	
	async checkData(options={}){
		const{}=options
		try{
			 window["myDb1"].setState('loading')
			if(typeof(window["allTravauxData"])==="undefined" || window["allTravauxData"]===null){
				let myT=new ClassTravaux();
				await myT.getAllTravaux();								
			}
			window["myDb1"].setData(window["allTravauxData"])
			window["myDb1"].setState('normal');
		}catch(err){
			console.log(err)
		}
		
	}
	
}