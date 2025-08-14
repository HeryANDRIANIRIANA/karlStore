class ClassDemandeSpecial{
	constructor(options={}){
		const{varName=""}=options;
		this.varName=varName;
		this.idAnnee=window["idAnnee"];
		let myDataR=new ClassDataRectif();
		this.dbman=myDataR;
		this.editpannelSelector="#dspPannel"
	}
	
	async getData(options={}){
		const{}=options
		try{
			let url='/getAllDSPat';
			let data={day:this.idAnnee}
			let r=await this.dbman.getData({gStruct:"demandeSpecialStructure", url:url, data:data});
			window["demandeSpecialData"]=r;
			return r;
		}catch(err){
			console.log(err)
		}
	}
	
	async getDetailDSPat(options={}){
		const{}=options
		try{
			let url='/getDetailDSPat';
			let data={day:this.idAnnee}
			let r=await this.dbman.getData({gStruct:"detailDemandeSpecialStructure", url:url, data:data});
			window["detailDemandeSpecialData"]=r;
			return r;
		}catch(err){
			console.log(err)
		}
	}
	
	async saveDsp(options={}){
		const{demandeSpecial=[], detailDs=[]}=options
		try{
			let url='/saveDemandeSpecial';
			let data={
				demandeSpecial:demandeSpecial,
				demSpecialStructure:window["demandeSpecialStructure"].structure,
				detailDs:detailDs,
				detailDsStructure:window["detailDemandeSpecialStructure"].structure
			}
			let res=await this.dbman.getData({url:url,data:data});
			// console.log(res);
			return res.data;
		}catch(err){
			console.log(err)
		}
		
	}
	
	async getMotif(options={}){
		const{}=options
		try{
		const{value:motif}=await Swal.fire({
			title:'motif',
			input:'text',
			inputLabel:'',
			inputPlaceholder:'Motif de la demande',
			showCancelButton:true
		});
		if(motif!==undefined && motif!==""){
			window["demandeSpecial"][0]["Motif"]=motif
			let detailDs=window["arSelectedArticle"];
			let demandeSpecial=window["demandeSpecial"];
				// console.log(detailDs,demandeSpecial);
			showNotification({text: 'saving dsp',colorName: 'bg-red', timer:10000 })	
			// reinit params
			window["arSelectedArticle"]=[];
			$(this.editpannelSelector).remove()
			if(typeof(window["demandeSpecialData"])==="undefined"||Object.keys(window["demandeSpecialData"]).length===0){
				await this.getData();  
			}
			if(typeof(window["detailDemandeSpecialStructure"])==="undefined"){
				await this.getDetailDSPat()
			}														
			let d=await this.saveDsp({demandeSpecial:demandeSpecial, detailDs:detailDs})
			// console.log(d);
			showNotification({text: d+' saved',colorName: 'bg-green', timer:1000 })	
			return motif;
		}
		// else{
			// this.getMotif();
		// }
		
		}catch(err){
			console.log(err)
		}
		
	}
	
	async beforeSave(options={}){
		const{}=options
		try{
			await this.getMotif();
			
		}catch(err){
			console.log(err)
		}
		
	}
	
	async setDefaultVar(){
		window["demandeSpecial"]=[{Motif:null}];
		window["detailDs"]=[]
		
	}
	
	async setupPannel(options={}){
		const{}=options
		try{
			let $c=$("#root-container section.content .row");
			let sklt=(v="pannel")=>{
				// selon l'action
				//newChqMSerie,newDsp
				let o1={
					newChqMSerie:{actionSave:"saveChqMSerie",title:"Cheque matiere"},
					newDsp:{actionSave:"savedsp", title:"Demande Spéciale"}
				}
				/* let detailCommande={}
				if(curentOperation==="newChqMSerie"){
					detailCommande=this.currentDetailComData;
				} */
				let o={
					btnCancelSklt:`<a href="javascript:void(0);"  class="neon-button"><span><i data-feather="x" class="feather-icon" data-action="${o1[window["curentOperation"]]['actionSave']} "></i></span></a>`,
					btnSaveSklt:`<a data-action="savedsp" href="javascript:void(0);" class="neon-button"><span><i  data-feather="save" class="feather-icon"></i></span></a>`,
					pannel:`
			<div class="col-lg-12 col-md-12 col-sm-6 col-xs-12" id="dspPannel">
                    <div class="card">
                        <div class="header bg-brown" >
                            <h2> ${o1[window["curentOperation"]]['title']}<small></small>
                            </h2>
                            <div class="btnContainer-left"></div>
                        </div>
                        <div class="body">
						<div class="articleSelectedPannel"></div>
                            
                        </div>
                    </div>
                </div>`
				}
				return o[v] 
			}
			// console.log($(this.editpannelSelector).length);
			if($(this.editpannelSelector).length===0){
				await this.setDefaultVar() //peu aussi etre lodifier en cas de newChqMSerie, pas encor le cas
				$c.prepend(sklt())
				let btnSaveSklt=sklt("btnSaveSklt")
				let btnCancelSklt=sklt("btnCancelSklt")
				$("#dspPannel .card .header .btnContainer-left").append(btnSaveSklt)
				$("#dspPannel .card .header .btnContainer-left").append(btnCancelSklt)
				feather.replace()
				$(document).off('keyup',$("#dspPannel"));
				
				$(document).on('keyup',$("#dspPannel"),async (e)=>{
					$(document).off('keyup',$("#dspPannel"));
					switch(e.key){
						case "F8":
						if($(this.editpannelSelector).is(":visible"))
						{//newChqMSerie,newDsp
							switch(window["curentOperation"]){
								case "newDsp":
								await this.beforeSave();
								break;
								case "newChqMSerie":
								alert("save nexw cheque matiere")
								console.log("save cheque mat not yeat");
								break;
							}
						
						}
						break;
						case "Escape":
						if($(this.editpannelSelector).is(":visible")){
							this.destroyPannel();
						}
						
						
						break;
					}
				})
			}
		}catch(err){
			console.log(err)
		}
		
	}
	
	destroyPannel(){
		if($(this.editpannelSelector).is(":visible")){
			window["arSelectedArticle"]=[];
			
		$(this.editpannelSelector).remove()
		showNotification({text: window["curentOperation"]+' canceled',colorName: 'alert-success', timer:1000 })
		window["curentOperation"]=null;
		}
		
	}
	
	async interfaceNew(options={}){
		const{}=options
		try{
			if(typeof(window["demandeSpecialData"])==="undefined"||Object.keys(window["demandeSpecialData"]).length===0){
				await this.getData();  
			}
			if(typeof(window["detailDemandeSpecialStructure"])==="undefined"){
				await this.getDetailDSPat()
			}
			
			window["myArticle"]=new ClassArticle();
			await window["myArticle"].getData();
			
			await window["myArticle"].showInDatatable()
			
			// navbarButton
			let myNavbarButtons=new ClassNavbarbuttons({obj:"demandeSpecial", varName:"myNavbarButtons"})
			myNavbarButtons.setUp({label:"Demande spécial", cible:"nav.navbar", fnInit:"initDemandeSpecialDropdown"})
			
			
			return 0;
		}catch(err){
			console.log(err)
		}
		
	}
}