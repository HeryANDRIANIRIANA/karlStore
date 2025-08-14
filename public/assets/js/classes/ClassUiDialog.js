class ClassUiDialog{
	constructor(){
		
		this.test="msg";
		this.selector="dialog";
		// this.addInDom()
	}
	sklt(options={}){
		const{
		content=`<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>`,
		btns=``		
		// btns=`<button type="button" class="ui-button ui-corner-all ui-widget">Ok</button><button type="button" class="ui-button ui-corner-all ui-widget">Cancel</button>`		
		}=options
		return`<div id="dialog" title="Dialog Title">${content} </div>`
	}

	async addInDom(options={}){
		try{
			const{selector=this.selector, content=""}=options;
		if($("#"+selector).length==0){
			$("body").append(content )
		}else{
			$("#"+selector).html(content );
			// $( "#"+selector ).dialog( "open" );
		}
		$( "#"+selector ).dialog({
			autoOpen: false,
			width: 400,
			open:await this.paiementFactureFormInit(),
			close:function(){
				 $(this).dialog("destroy").remove();
			}
		});
		
		$( "#"+selector ).dialog( "open" );
		}catch(err){
			console.log(err);
		}
	}

	async paiementFactureForm(options={}){
		const{
			elts=[
			{label:"Montant Dû",id:"MontantDue", required:false, disabled:"disabled",type:"number"},
			{label:"Ref Banque",id:"refBanque", required:false, disabled:"disabled",type:"string"},
			{label:"Reste à payer",id:"ResteAPayer", required:false, disabled:"disabled",type:"number"},
			{label:"Montant payé",id:"ACOMPTE", required:true, disabled:"",type:"number"},
			]
		}=options
		try{
			let s=``;
			let sel=`<select id="TypePiece"><option selected>Caisse</option><option >Banque</option></select>`;
			for(let o of elts){
				s+=`<div class="form-group form-float">
				
                                    <div class="form-line ${o.disabled} ">
                                        <input type="${o.type} " class="form-control" name="${o.id}"  id="${o.id}" required="${o.required} " aria-required="${o.required}" ${o.disabled} >
                                        <label class="form-label">${o.label} </label>
                                    </div>
                                    <div class="help-info"></div>
                    </div>`
			}
			let frm=`<div class="body">
                            <form>
							${sel}
								${s}
                            </form>
                        </div>`;
			let c=this.sklt({content:frm})
			await this.addInDom({content:c});
			return c
		}catch(err){
			console.log(err)
		}
		
	}
	
	async paiementFactureFormInit(){
			try{
				window["myJournal"]=new ClassJournal({varName:"myJournal"}) ;
				window["myJournal"].setCurrentJournalDetail({TypePiece:"Caisse"}) ;
				let factureInfo=window["factureInfo"];
				let MontantTTCFactur=factureInfo.MontantTTCFactur;
				let countEnter=0;
				$("#MontantDue").val(window["factureInfo"]["MontantDue"]) ;
				$("#ResteAPayer").val(window["factureInfo"]["ResteAPayer"]) ;
				let d=parseInt($("#MontantDue").val());
				
				$("#ACOMPTE").keydown(async (e)=>{
				
				let p=parseInt(e.target.value);
				let m=MontantTTCFactur-(d+p)
				// 
				let r=(m>0)?m:0;
				$("#ResteAPayer").val(r);
				p=(m>0)?p:MontantTTCFactur-d;
				if(e.key==="Enter"){
					countEnter++;
				}else{
					countEnter=0;
				}
				if(countEnter>1){
					// UPDT Form
					window["factureInfo"]["MontantDue"]=parseInt(p+d);//Avance
					window["factureInfo"]["ResteAPayer"]=parseInt($("#ResteAPayer").val());//ResteAPayer
					window["myJournal"].setMontantPieceCurrentJournal(p);
					await window["myFacture"].recalculMontantFacture();
					if(p>0){
						let b=confirm("voulez vous mettre à jour le jounal?");
						if(b==true){
							window["myJournal"].saveDetailJounal();
						}
					}
					 $("#"+this.selector).dialog("close");
					 // $("button.ui-dialog-titlebar-close").click();
					// $("#"+this.selector).dialog("destroy").remove();
					// TODO: UPDT BC
					//UPDT journal
					// UPDT FACTURE
					// console.log("form validé");
					return 0;
				}
				
			})
				
				$("#TypePiece").change(async (e)=>{
					console.log(e.target.value);
					let TypePiece=e.target.value;
					switch(TypePiece){
						case "Caisse":
						$("#refBanque").prop("disabled", true);
						window["myJournal"].setCurrentJournalDetail({TypePiece:"Caisse"}) ;
						break;
						case "Banque":
						$("#refBanque").prop("disabled", false);
						$("#refBanque").focus();
						window["myJournal"].setCurrentJournalDetail({TypePiece:"Banque"}) ;
						break;
					}
				})
			
				$("#refBanque").keydown((e)=>{
					// console.log(e.key);
					switch(e.key){
						case "Tab":
						window["myJournal"].setCurrentJournalDetail({TypePiece:"Banque", refB:e.target.value}) ;
						break;
						case "Enter":
						window["myJournal"].setCurrentJournalDetail({TypePiece:"Banque", refB:e.target.value}) ;
						break;
					}
				})
				
				
			return 0;
			}catch(err){
				console.log(err);
			}
	}
	

}