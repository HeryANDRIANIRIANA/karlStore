class ClassNavbarbuttons{
	constructor(options={}){
		const{
			obj="demandeSpecial",
			varName="myNavbarButtons"
		}=options;
		this.btnFactureImpayee="factureImpayees";
		this.badgeImpayees="factureImpayees span.label-count";
		this.btnId="DropdownBtn"+obj;
		this.obj=obj;
		this.varName=varName;
	}   
	
	async setUp(options={}){
		const{label="Deduire retard", cible="nav.navbar", btnId=this.btnId, fnInit="initDemandeSpecialDropdown", bprepend=true}=options
		try{
			let cardId="card-"+btnId
			let sklt=()=>{return `
			<li class="dropdown" id="dropdown-${this.obj}">
                        <a href="javascript:void(0);" class="btn btn-white bg-teal btn-block btn-xs waves-effect" data-toggle="dropdown" role="button" id="${btnId}" aria-expanded="true">
                            <i class="material-icons">${label} </i>
                            <span class="label-count"></span>
                        </a>
                        <ul class="dropdown-menu" style="width:400px; margin:20px; display: block;">
                            <li class="header"></li>
                            <li class="body">
							  <ul class="menu tasks" style='padding:0px; width:100%'>
							  
							  </ul>
							</li>
							<li class="footer">
								<ul>
								<li><a href="javascript:void(0);" class="btn-save">"F8" pour Enregistrer </a></li>
								<li><a href="javascript:void(0);" class="btn-cancel"> "Esc" pour Annuler</a></li>
								</ul>
                                
                            </li>
						</ul>
			</li>		
		`}
		
			if($("li#dropdown-"+this.obj).length>0){$("li#dropdown-"+this.obj).remove();}
			$(cible).prepend(sklt);
		
		
		await this[fnInit]()
		
		}catch(err){
			console.log(err)
		}
		
	}
	
	async initDemandeSpecialDropdown(options={}){
		const{}=options
		try{
			// console.log(this.btnId);
			
			
			let hdr=$("#dropdown-"+this.obj).find("li.header");
			let t=`<input type='text' id='Motif' />`;
			hdr.html(t);
			let bdy=$("#dropdown-"+this.obj).find("li.body>ul.menu");
			let fter=$("#dropdown-"+this.obj).find("li.footer");
			
			let str=`<li><table width='380px'><tr><td style=""> <div id='articleDemande' style="  heigth:275px;  max-height: 200px; overflow-y: scroll;"></div> </td><td style="text-align: right; width: 100px;">
			<div id="slider-container"> <div id="ticks-vertical" style="height:275px; "></div> <div id="slider-vertical" style="height:275px; "></div>  </div>
			</td></tr><table></li>`;
			bdy.html(str);
			
			//btn principal
			$("#"+this.btnId).on("click",async(e)=>{
			e.preventDefault(); // Empêche le comportement par défaut du lien
			let o=$(e.target).closest("li").find(".dropdown-menu");
			o.slideToggle();
			return 0;
			})
			
			$(document).on("keydown",async (e)=>{
				// console.log(e.key);
				switch(e.key){
					case "F8":
					await this.saveDsp();
					break;
					
					case "Escape":
					await this.EscDsp();
					break;
				}
				return 0;
			})
			
			//recup liste demandeur.
			if(typeof(window["demandeurData"])=="undefined" || Object.keys(window["demandeurData"]).length==0 ){
				window["myDemandeur"]=new classDemandeur();
				await window["myDemandeur"].getData();
				// console.log(window["demandeurData"]);
			}
			
			//slider demandeur
			$( "#slider-vertical" ).slider({
				orientation: "vertical",
				range: "min",
				min: 0,
				max: window["demandeurData"].length-1,
				// value: 1,
				slide: function( event, ui ) {
					let nomDemandeur=window["demandeurData"][ui.value]["IdDemandeur"]
					$("#Motif").val(nomDemandeur)
					
				}
			});
			let noms=[]
			window["demandeurData"].forEach((o)=>{
				noms.push(o["IdDemandeur"])
			})
			// console.log(noms);
			noms.slice().reverse().forEach((nom) => {
				$("#ticks-vertical").append(`<div class="tick-label">${nom}</div>`);
			});
			
			//profile dsp
			if(typeof(window["articleProfileData"])==="undefined" || Object.keys(window["articleProfileData"]).length===0){
				await window["myArticle"].getProfileDsp();
				window["profileDsp"]=window["myArticle"].profieDspbyCodeArticle();
			}
			
			// param datatable article
			let id="myArticle-table1"
				$("#"+id+" tbody").on('dblclick', 'tr', (e)=>{
					let data=window["myTablemyArticle"].row(e.target).data();
					// console.log(data);
					this.updateListeArticleDemandee($("#articleDemande"),data)
				})
			
			let btnSave=fter.find('.btn-save');
			btnSave.on('click',async(e)=>{
				await this.saveDsp();
				})
				
			let btnCancel=fter.find('.btn-cancel');
			btnCancel.on('click',async(e)=>{
				await this.EscDsp();
				})
			
			
		}catch(err){
			console.log(err)
		}
		
	}
	
	async saveDsp(options={}){
		const{}=options
		try{
			let o=$("#"+this.btnId).closest("li").find(".dropdown-menu");
			o.slideToggle();
				
			let m=$("#Motif").val();
				if(m===""){
					alert("Motif obligatoir")
				}else{
					let demandeSpecial=[{Motif:m}]
					let detailDs=this.getDetailDS();
					if(typeof(window["myDemandeSpecial"])==="undefined"){
						window["myDemandeSpecial"]=new ClassDemandeSpecial();
					}
					$("#articleDemande").html('');
					$("#dropdown-"+this.obj+" a span.label-count").text($("#articleDemande").find('li').length);
					let r1=await window["myDemandeSpecial"].saveDsp({demandeSpecial:demandeSpecial, detailDs:detailDs})
					showPersistentNotification({body:r1});
					return 0;
				}
		}catch(err){
			console.log(err)
		}
		
	}
	
	async EscDsp(options={}){
		const{}=options
		try{
			$("#articleDemande").html('');
			$("#dropdown-"+this.obj+" a span.label-count").text($("#articleDemande").find('li').length);
			let o=$("#"+this.btnId).closest("li").find(".dropdown-menu");
			o.slideToggle();
		}catch(err){
			console.log(err)
		}
		
	}
	
	getDetailDS(){
		let c=$("#articleDemande").children();
		let detailDs=[];
		c.toArray().forEach((v, k) => {
			 detailDs.push($(v).data())
			});
		return detailDs;
	}
	
	updateListeArticleDemandee(oParent,data){
		let d=[data];
		let CodeArticle=d[0]["CodeArticle"];
		let profileDsp=(typeof(window["profileDsp"][CodeArticle])!=="undefined")?window["profileDsp"][CodeArticle]:{};
		let QteDS=(Object.keys(profileDsp).length>0)?profileDsp["QteDS"]:prompt("Quantité demandé?");
		d[0]["QteDS"]=parseInt(QteDS);
		let StepQte=(Object.keys(profileDsp).length>0)?profileDsp["StepQte"]:"";
		
		let t="<table width='100%'><tr><td colspan='3'>"+CodeArticle+" : <span class='QteDS'>"+QteDS+"</span>"+"</td></tr><tr><td width='30px'><a href='javascript:void(0);' class='btn-removeLi'>X </a></td><td><div id='slider-"+CodeArticle+"'></div></td><td width='30px'> </td></tr></table>"
		$( "<li></li>" ).append(t).attr("data-name","dsp-"+CodeArticle).data(d[0]).appendTo( oParent );
		$("#dropdown-"+this.obj+" a span.label-count").text(oParent.find('li').length);
		
		let opt={
					min: 0,
					max: QteDS*10,
					from: QteDS,
					onChange:(data)=>{
						// this.initSlider(data)
						let [inpt,val]=[data.input,data.from]
						let li=inpt.closest("li");
						li.data("QteDS",val)
						li.find("span.QteDS").text(val)
						// console.log(li.data());
					}
				}
		
		if(StepQte!==""){
			let ar=StepQte.split(",");
			let step=parseInt(ar[1])-parseInt(ar[0]);
			let max=ar[ar.length-1];
			opt={
					min: 0,
					max: max,
					from: QteDS,
					grid:true,
					value:ar,
					step:step,
					onChange:(data)=>{
						// this.initSlider(data)
						let [inpt,val]=[data.input,data.from]
						let li=inpt.closest("li");
						li.data("QteDS",val)
						li.find("span.QteDS").text(val)
						// console.log(li.data());
					}
				}
		}
		
		let articleSlider=$("#slider-"+CodeArticle).ionRangeSlider(opt);
		
		
		
		//btn X
		$(".btn-removeLi").on('click',function(){
					let li= $(this).closest('li');
					
					li.remove()
					// console.log(li.text());
				})
	}
	
	// "btn btn-white bg-teal btn-block btn-xs waves-effect"
	btnFactureInNav(){
		/* <a id="factureImpayees" class="btn btn-white bg-teal btn-block btn-xs waves-effect" type="button">Factures <span class="badge"></span></a> */
		/* <li class="dropdown">
                        <a href="javascript:void(0);" class="btn btn-white bg-teal btn-block btn-xs waves-effect" data-toggle="dropdown" role="button" id="factureImpayees" aria-expanded="true">
                            <i class="material-icons">Factures</i>
                            <span class="label-count"></span>
                        </a>
                       <ul class="dropdown-menu">
                            <li class="header"></li>
                            <li class="body">
                               <div>test</div>
                            </li>
							<li class="footer">
                               <ul class="menu tasks" style="overflow: hidden; width: auto; height: 54px;">
								   <li>
								   <a href="javascript:void(0);" class="waves-effect" data-toggle="dropdown" role="button" id="seeAllFactures" > <i class="">Voir tout les factures </i><span class="label-count"></span> </a>
								   </li>
							   </ul>
							</li>
						</ul>
                    </li> */
		
		return `
			<li class="dropdown">
                        <a href="javascript:void(0);" class="btn btn-white bg-teal btn-block btn-xs waves-effect" data-toggle="dropdown" role="button" id="factureImpayees" aria-expanded="true">
                            <i class="material-icons">Factures</i>
                            <span class="label-count"></span>
                        </a>
                        <ul class="dropdown-menu">
                            <li class="header"></li>
                            <li class="body">
                               
                            </li>
							<li class="footer">
                               <ul class="menu tasks" style="overflow: hidden; width: 254px; height: 44px;">
								   <li>
								   <a href="javascript:void(0);" class="waves-effect" data-toggle="dropdown" role="button"  id="seeAllFactures" > <i class="">Voir tout les factures</i> <span class="label-count"></span> </a>
								   </li>
							   </ul>
							   </li>
						</ul>
			</li>		
		`
	}
	
	/* <ul class="menu tasks" style="overflow: hidden; width: auto; height: 254px;">
                                    <li>
                                        <a href="javascript:void(0);" class=" waves-effect waves-block">
                                            <h4>
                                                Footer display issue
                                                <small>32%</small>
                                            </h4>
                                            <div class="progress">
                                                <div class="progress-bar bg-pink" role="progressbar" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100" style="width: 32%">
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0);" class=" waves-effect waves-block">
                                            <h4>
                                                Make new buttons
                                                <small>45%</small>
                                            </h4>
                                            <div class="progress">
                                                <div class="progress-bar bg-cyan" role="progressbar" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100" style="width: 45%">
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0);" class=" waves-effect waves-block">
                                            <h4>
                                                Create new dashboard
                                                <small>54%</small>
                                            </h4>
                                            <div class="progress">
                                                <div class="progress-bar bg-teal" role="progressbar" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100" style="width: 54%">
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0);" class=" waves-effect waves-block">
                                            <h4>
                                                Solve transition issue
                                                <small>65%</small>
                                            </h4>
                                            <div class="progress">
                                                <div class="progress-bar bg-orange" role="progressbar" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100" style="width: 65%">
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0);" class=" waves-effect waves-block">
                                            <h4>
                                                Answer GitHub questions
                                                <small>92%</small>
                                            </h4>
                                            <div class="progress">
                                                <div class="progress-bar bg-purple" role="progressbar" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100" style="width: 92%">
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                </ul> */
	btnJournalInNav(){
	return `<li class="dropdown">
                        <a href="javascript:void(0);" class="btn btn-white bg-teal btn-block btn-xs waves-effect" data-toggle="dropdown" role="button" id="btnJournal" aria-expanded="true">
                            <i class="material-icons">journal</i>
                            <span class="label-count"></span>
                        </a>
                        <ul class="dropdown-menu">
                            <li class="header"></li>
                            <li class="body">
                               <div id="datepicker"></div> 
                            </li>
							<li class="footer">
                               <ul class="menu tasks" style="overflow: hidden; width: auto; height: 54px;">
								   <li>
								   <a href="javascript:void(0);" class="waves-effect" data-toggle="dropdown" role="button" id="seeAllJournal" > <i class="">Voir tout le journal</i> <span class="label-count"></span> </a>
								   </li>
							   </ul>
							   </li>
						</ul>
			</li>`	
	}
	
	init(){                 
		$("#"+this.btnFactureImpayee).on("click",async(e)=>{
			event.preventDefault(); // Empêche le comportement par défaut du lien
			let o=$(e.target).closest("li").find(".dropdown-menu");
			o.slideToggle();
			return 0;
		})
		                 
		$("#seeAllFactures").on("click",async()=>{
			await this.seeFactureImpayees();
			return 0;
		})
		
		$("#btnJournal").on("click",(e)=>{
			 event.preventDefault(); // Empêche le comportement par défaut du lien
        let o=$(e.target).closest("li").find(".dropdown-menu");
        // let o1=$(e.target).parent().parent();//.find(".dropdown");
		o.slideToggle();
		// switch(o1.attr("class")){
			// case 'dropdown open':
			// break;
			// case 'dropdown':
			// this.seeAllDetailJournal();
			// break;
		// }
		return 0;
		})
		
		$("#seeAllJournal").on("click",(e)=>{
			 event.preventDefault(); // Empêche le comportement par défaut du lien
			 this.seeAllDetailJournal();
		return 0;
		})
		
		$( "#datepicker" ).datepicker({
			onSelect: function(dateText, inst) {
				// console.log("Date sélectionnée : " + dateText);
			}
		});
	}
	
	async seeFactureImpayees(options={}){
		const{c0="root-container"}=options
		try{
			let myFacture=new ClassFacture({varName:"allFactures"});
			await myFacture.seeFactureImpayees();
			return 0;
		}catch(err){
			console.log(err)
		}
		
	}
	
	async updtbadgeImpayees(options={}){
			const{v0=10, v1=100}=options
			try{
				
				let i=0
				let indId=setInterval(()=>{
					i++;
					// console.log(i);
					let i1=(i<=v0)?i:v0
					$("#"+this.badgeImpayees).text(i1+"/"+i)
					if(i>=v1){clearInterval(indId)}
				},100)
			}catch(err){
				console.log(err)
			}
			
		}

	async seeAllDetailJournal(options={}){
		const{}=options
		try{
			await window["myJournal"].showInDataTable() ;
			return 0;
		}catch(err){
			console.log(err)
		}
		
	}
	
	async setUpDropdownFicheEditor(options={}){
		const{}=options
		try{
			let data0=window["travauxSelectedData"];
			
			await this.setUp({label:"ProductId:"+data0.ProductId, cible:"nav.navbar", btnId:this.btnId, fnInit:"initNavbarFiche"})
			return 0;
		}catch(err){
			console.log(err)
		}
		
	}
	
	async initNavbarFiche(options={}){
		const{}=options
		try{
			window["QteSansPass"]=0;
			
			$("#"+this.btnId).on("click",async(e)=>{
			let o=$(e.target).closest("li").find(".dropdown-menu");
			o.slideToggle();
			return 0;
			})
			
			let data0=window["travauxSelectedData"];
			let bdy=$("#dropdown-"+this.obj).find("li.body>ul.menu");
			let fter=$("#dropdown-"+this.obj).find("li.footer");
			fter.html('');
			// window["QteCom"]=data0.QteCom;
			let str="<li>"+data0.QteCom+" : "+data0.DesignProd+"</li>";
			bdy.append(str);
			
			//slider pass
			this.passeSlider({cible:bdy});
			//select
			let idSelect="select-paramW";
			let data=[
				{
					"text": "Demandeur",
					"children": [
							{
							  "id": "Demandeur:Jerome",
							  "text": "Jerome"
							},
							{
							  "id": "Demandeur:Françis",
							  "text": "Françis"
							},
							{
							  "id": "Demandeur:Madame",
							  "text": "Madame"
							},
							{
							  "id": "Demandeur:Anselme",
							  "text": "Anselme"
							},
							{
							  "id": "Demandeur:Cynthia",
							  "text": "Cynthia"
							},
							{
							  "id": "Demandeur:Jheovanny",
							  "text": "Jheovanny"
							},
							{
							  "id": "Demandeur:Eurlin",
							  "text": "Eurlin"
							},
							{
							  "id": "Demandeur:Pedro",
							  "text": "Pedro"
							},
							{
							  "id": "Demandeur:Genevieve",
							  "text": "Genevieve"
							},
							{
							  "id": "Demandeur:Patricia",
							  "text": "Patricia"
							},
							
						]
				},
				{
					"text": "TypeDePapier",
					"children": [
							{
							  "id": "TypeDePapier:PHOT1",
							  "text": "Papier photocopie"
							},
							{
							  "id": "TypeDePapier:Autocopiant",
							  "text": "Autocopiant"
							},
							{
							  "id": "TypeDePapier:OFF1",
							  "text": "Offset60"
							},
							{
							  "id": "TypeDePapier:OFF3",
							  "text": "Offset80"
							},
							{
							  "id": "TypeDePapier:Pelure",
							  "text": "Pelure"
							},
							{
							  "id": "TypeDePapier:Journal",
							  "text": "Journal"
							}
						]
				},
				{
					"text": "Format",
					"children": [
							{
							  "id": "Format:45",
							  "text": "A4/5"
							},
							{
							  "id": "Format:36",
							  "text": "A6"
							},
							{
							  "id": "Format:27",
							  "text": "A4/3"
							},
							{
							  "id": "Format:18",
							  "text": "A5"
							},
							{
							  "id": "Format:9",
							  "text": "A4"
							},
							{
							  "id": "Format:4",
							  "text": "A3"
							}
						]
				},
				{
					"text": "Reference",
					"children": [
							{
							  "id": "Reference:1X1",
							  "text": "1X1"
							},
							{
							  "id": "Reference:25X1",
							  "text": "25X1"
							},
							{
							  "id": "Reference:25X2",
							  "text": "25X2"
							},
							{
							  "id": "Reference:25X3",
							  "text": "25X3"
							},
							{
							  "id": "Reference:25X4",
							  "text": "25X4"
							},
							{
							  "id": "Reference:25X5",
							  "text": "25X5"
							},
							{
							  "id": "Reference:54X2",
							  "text": "54X2"
							},
							{
							  "id": "Reference:50X1",
							  "text": "50X1"
							},
							{
							  "id": "Reference:50X2",
							  "text": "50X2"
							},
							{
							  "id": "Reference:50X3",
							  "text": "50X3"
							},
							{
							  "id": "Reference:50X4",
							  "text": "50X4"
							},
							{
							  "id": "Reference:50X5",
							  "text": "50X5"
							},
							{
							  "id": "Reference:100X1",
							  "text": "100X1"
							},
							{
							  "id": "Reference:100X2",
							  "text": "100X2"
							},
							{
							  "id": "Reference:100X3",
							  "text": "100X3"
							}
						]
				},
				
					]
			
			let s1=this.convertDataToOptGroup(data);
			
			let str4=`<div class="p-4">	<select id="${idSelect}" multiple data-placeholder="" class="form-control">
			${s1}
			</select></div>`;
			bdy.append("<li><div style='display: inline-block;'>"+str4+"</div></li>");
			
			
			$("#"+idSelect).select2();
			$("#"+idSelect).on('select2:select', async(e)=>{
				await this.ficheWparams(e);
			})
			
			//ajout manuelle
			await this.articleAddPannel()
			
			let fterContent=`<ul>
								<li><a href="javascript:void(0);" class="btn-save">"F8" pour Enregistrer </a></li>
								<li><a href="javascript:void(0);" class="btn-cancel"> "Esc" pour Annuler</a></li>
								</ul>`
			fter.html(fterContent)
			this.initFterFiche();
			
		}catch(err){
			console.log(err)
		}
		
	}
	
	initFterFiche(){
		//verrification newChequeMatiereSerie
		let btnSave=$(".btn-save");
		let bdy=$("#dropdown-"+this.obj).find("li.body>ul.menu");
		let fter=$("#dropdown-"+this.obj).find("li.footer");
		
		$("#dropdown-"+this.obj).on('keyup',(e)=>{
			// console.log(e.key);
			switch(e.key){
				
				case "F8":
				this.saveNewChequeMatiere()
				break;
				case "Escape":
				let o=$("#"+this.btnId).closest("li").find(".dropdown-menu");
				o.slideToggle();
				break;
			
			}
			
		})
		btnSave.off().on('click',(e)=>{
			this.saveNewChequeMatiere()
		})
		
	}
	
	saveNewChequeMatiere(){
		let cmValide=this.verrifNewChequeMaiere();
		if(cmValide===true){
			window["arNewDetailChequeMatiere"]=this.getDetailChequeMatiereFromInterface();
			if(window["arNewDetailChequeMatiere"].length===0){
				alert("Detail chèque matière Obligatoire")
			}else{
				// console.log(window["arNewDetailChequeMatiere"]);
				window["myChequeMatiere"].save();
				let o=$("#"+this.btnId).closest("li").find(".dropdown-menu");
				o.slideToggle();
				let bdy1=$("#dropdown-"+this.obj).find("li.body>ul.menu");
				let bdy2=$("#dropdown-"+this.obj).find("li.body>ul.articleContainer");
				bdy1.html("")
				bdy2.html("")
				let fter=$("#dropdown-"+this.obj).find("li.footer");
				fter.html("")
			}
		}
	}
	
	verrifNewChequeMaiere(){
		let valid=false;
		// console.log(window["newChequeMatiereSerie"]);
		if(typeof(window["newChequeMatiereSerie"]["Demandeur"])=="undefined"){
			alert("Demandeur à spécifier")
			$("#select-paramW").focus();
		}else{
			valid=true
		}
		return valid;
	}
	
	getDetailChequeMatiereFromInterface(){
		let optgroup="opt1"
		let container=$('#ms-'+optgroup);
		let selections=container.find(".ms-selection ul li.ms-selected")
		let arDetailChequeMatiereSerie=[];
		selections.each(function(){
		let $li=$(this)
		// console.log($li.data());
		let codearticle=$li.data('codearticle')
		let QteDem=(!isNaN($li.find('.QteDem').text()))?parseInt($li.find('.QteDem').text()):0;
		arDetailChequeMatiereSerie.push({"CodeArticle":codearticle,"QteDem":QteDem,"QteNec":QteDem,"SortieV":"Non","RetourV":"Non"})
		
		})
		
		return arDetailChequeMatiereSerie;
	}
	
	convertDataToOptGroup(data){
		let s="";
		// console.log(data);
		// data.forEach()
		data.forEach((v, k) => {
			let s2='';
				v.children.forEach((v1, k1) => { 
				s2+=`<option value="${v1.id}" >${v1.text}</option>`
				});
			s+=`<optgroup label='${v.text}'>${s2}</optgroup >`
			});
		return s
	}
	
	passeSlider(options={}){
		const{cible=$("body"), sliderId='slider-pass'}=options;
		let v=0;
		window["pass"]=v;
		let s=`<div class='sliderPass-Container'><div id=${sliderId} class='passSlider'></div><span id='passvalue'>pass = ${v}%</span></div>`;
		cible.append(s);
			$( "#"+sliderId ).slider({
				range: "min",
				min: 0,
				max: 100,
				value: v,
				slide: ( event, ui )=> {
					// let nomDemandeur=window["demandeurData"][ui.value]["IdDemandeur"]
					window["pass"]=ui.value;
					$("#passvalue").text("pass = "+ui.value+"%");
					this.countInterieur();
					
					if(typeof(window["QteSansPass"])!=="undefined"){
						window["myTravaux"].calculQteInterieur()
					}
					if(typeof(window["oInterieur"])!=="undefined"){
						window["cm"]["interieur"] =window["myTravaux"].selectInterieur({typeDePapier:window["TypeDePapier"],folio:window["folio"]})
						// console.log(window["cm"]);
					}
					
					
					
				}
			});
	}
	
	async ficheWparams(e){
		let selectedOption=e.params.data.element;
		let optgroup=$(selectedOption).parent()
		$(optgroup).find('option').each(function(){
			if(this!=selectedOption){
				$(this).prop('selected',false);
			}
		})
		$(e.target).trigger('change.select2');
		let v=$(e.target).val();
		// console.log(v);
		let v1={};
		v.forEach((v0, k0) => { 
		v1[v0.split(':')[0]]=(isNaN(v0.split(':')[1]))?v0.split(':')[1]:parseInt(v0.split(':')[1]);
		if(v0.split(':')[0]==="Demandeur"){
			window["newChequeMatiereSerie"]["Demandeur"]=v0.split(':')[1]
		}
		});
		
		window["newChequeMatiereSerie"]["CouleurPrint"]=(typeof(window["newChequeMatiereSerie"]["CouleurPrint"])==='undefined')?'-':window["newChequeMatiereSerie"]["CouleurPrint"];
		window["newChequeMatiereSerie"]["ReferenceChM"]=(typeof(window["newChequeMatiereSerie"]["ReferenceChM"])==='undefined')?'-':window["newChequeMatiereSerie"]["ReferenceChM"];
		window["newChequeMatiereSerie"]["EfaVitaFicheTravV"]=(typeof(window["newChequeMatiereSerie"]["EfaVitaFicheTravV"])==='undefined')?'Non':window["newChequeMatiereSerie"]["EfaVitaFicheTravV"];
		
		// console.log(v1);
		if(v.length===4){
			let cm=await window["myTravaux"].generateDetailChequeM({QteCom:window["travauxSelectedData"].QteCom, TypeDePapier:v1["TypeDePapier"] , Format:v1["Format"], Reference:v1["Reference"]})
			//mise à jour du select
			window["cm"]=cm;
			
			/* console.log(cm); */
			this.selectArticle();
		}
	}

defaultSkltOptgroup(options={}){
	const{optgroup="opt1",s0=`<optgroup label="Alaskan/Hawaiian Time Zone">
                                    <option value="AK">Alaska</option>
                                    <option value="HI">Hawaii</option>
                                </optgroup>
                                <optgroup label="Pacific Time Zone">
                                    <option value="CA">California</option>
                                    <option value="NV">Nevada</option>
                                    <option value="OR">Oregon</option>
                                    <option value="WA">Washington</option>
                                </optgroup>
                                <optgroup label="Mountain Time Zone">
                                    <option value="AZ">Arizona</option>
                                    <option value="CO">Colorado</option>
                                    <option value="ID">Idaho</option>
                                    <option value="MT">Montana</option>
                                    <option value="NE">Nebraska</option>
                                    <option value="NM">New Mexico</option>
                                    <option value="ND">North Dakota</option>
                                    <option value="UT">Utah</option>
                                    <option value="WY">Wyoming</option>
                                </optgroup>
                                <optgroup label="Central Time Zone">
                                    <option value="AL">Alabama</option>
                                    <option value="AR">Arkansas</option>
                                    <option value="IL">Illinois</option>
                                    <option value="IA">Iowa</option>
                                    <option value="KS">Kansas</option>
                                    <option value="KY">Kentucky</option>
                                    <option value="LA">Louisiana</option>
                                    <option value="MN">Minnesota</option>
                                    <option value="MS">Mississippi</option>
                                    <option value="MO">Missouri</option>
                                    <option value="OK">Oklahoma</option>
                                    <option value="SD">South Dakota</option>
                                    <option value="TX">Texas</option>
                                    <option value="TN">Tennessee</option>
                                    <option value="WI">Wisconsin</option>
                                </optgroup>
                                <optgroup label="Eastern Time Zone">
                                    <option value="CT">Connecticut</option>
                                    <option value="DE">Delaware</option>
                                    <option value="FL">Florida</option>
                                    <option value="GA">Georgia</option>
                                    <option value="IN">Indiana</option>
                                    <option value="ME">Maine</option>
                                    <option value="MD">Maryland</option>
                                    <option value="MA">Massachusetts</option>
                                    <option value="MI">Michigan</option>
                                    <option value="NH">New Hampshire</option>
                                    <option value="NJ">New Jersey</option>
                                    <option value="NY">New York</option>
                                    <option value="NC">North Carolina</option>
                                    <option value="OH">Ohio</option>
                                    <option value="PA">Pennsylvania</option>
                                    <option value="RI">Rhode Island</option>
                                    <option value="SC">South Carolina</option>
                                    <option value="VT">Vermont</option>
                                    <option value="VA">Virginia</option>
                                    <option value="WV">West Virginia</option>
                                </optgroup>`}=options
return `<select id="${optgroup}" class="ms" multiple="multiple">${s0}</select>`
}

filterms(options={}){
	const{recherche = ""}=options
	let obj=$(".ms-elem-selectable")
	let ar0=[];
	
	if(recherche!==""){
			for (let key in obj) {
			 if(!isNaN(key)){
				 let o=obj[key];
				 let v=o.innerText;
				 if(v.includes(recherche)){
					 ar0.push(obj[key].innerText)
				 }else{
					 if(!$(o).hasClass('ms-selected')){
						 $(o).css('display','none')
					 }
				 }
			 }
			}
	}else{
		for (let key in obj) {
			 if(!isNaN(key)){
				 let o=obj[key];
				 let v=o.innerText;
				 if(!$(o).hasClass('ms-selected')){
						$(o).css('display','block')
					 }
				
			 }
			}
	}
	return ar0;
}

startsWithPrefix(str) {
let prefixes=["AU", "OF", "PE", "JO", "PH"];
  if (!str || str.length < 2) return false;
  const firstTwo = str.substring(0, 2).toUpperCase(); // pour éviter les problèmes de casse
  return prefixes.includes(firstTwo);
}

countInterieur(){
	let optgroup="opt1"
	let container=$('#ms-'+optgroup);
	let selections=container.find(".ms-selection ul li.ms-selected")
	let c=0;
	
	selections.each(function(){
		let $li=$(this)
		// console.log($li.data());
		let codearticle=$li.data('codearticle')
		let QteDem=parseInt($li.data('qtedem'))
		let t=$li.find('.QteDem').text();
		 // console.log(QteDem);
		 // console.log(parseFloat(window["pass"]));
		QteDem=Math.ceil(QteDem*(1+(window["pass"]/100)))
		
		
		  let prefixes=["AU", "OF", "PE", "JO", "PH"];
		if (!codearticle || codearticle.length < 2) return false;
		let firstTwo = codearticle.substring(0, 2).toUpperCase(); // pour éviter les problèmes de casse
			if(prefixes.includes(firstTwo)){ 
			c++;
			// $li.attr('data-qtedem',QteDem);
			$li.find('.QteDem').text(QteDem);
			// $li.data('qtedem',QteDem);
			}
		})
		
		return c;
	
}

selectArticle(){
	let optgroup="opt1";
	let obj=window["cm"];
	
	let interieur=obj.interieur
	let couverture=obj.couverture
	let ar=[];
	window["cmFusionned"]={...interieur,...couverture}
	for (let key in interieur) {
    ar.push(key)
	}
	for (let key in couverture) {
    ar.push(key)
	}
	
	$('#'+optgroup).multiSelect('select',ar);
	let container=$('#ms-'+optgroup);
	let selections=container.find(".ms-selection ul li.ms-selected")
	selections.each(function(){
		let $li=$(this)
		let codearticle=$li.data('codearticle')
		let QteDem=(typeof(window["cmFusionned"][codearticle])!=="undefined")?window["cmFusionned"][codearticle]:0;
		$li.attr('data-QteDem', QteDem);
		if($li.find(".QteDem").length>0){
			$li.find(".QteDem").text(QteDem)
		}else{
			$li.append(`<span class="QteDem badge badge-success">${QteDem}</span>`);
		}
		
	})
	
	// $().multiSelect({ selectableOptgroup: false, dblClick:true});
}

	async articleAddPannel(){
		try{
			window["myArticle"]=new ClassArticle({varName:"myArticle"})
			let s0=await window["myArticle"].generateSelect()
			
			let bdy=$("#dropdown-"+this.obj).find("li.body");
			let optgroup="opt1"
			let s2=this.defaultSkltOptgroup({optgroup:optgroup,s0:s0})
			let s=`<ul class="articleContainer"><li id="btnAddArticle">${s2}</li></ul>`;
			bdy.append(s);
			
			$('#'+optgroup).multiSelect({ selectableOptgroup: false, dblClick:true,
			afterInit: function(container) {
				let lis = container.find(".ms-selectable ul li");
				lis.each(function () {
				  let $li = $(this);
				  let stock = $li.data('qtestockart');
				  let caracteristique= $li.data('designarticle')+'-'+$li.data('caractéristique');
				  if (typeof stock !== "undefined") {
					$li.append(`<span class="badge badge-info">${stock}</span><span class="caracteristique"><strong>📄</strong> ${caracteristique}</span>`);
				  }
				  
				  // ecouteur d'évènement
				  $li.off('dblclick').on('dblclick',function(){
					let val=$li.data('codearticle');
					let qte = prompt("Entrer la quantité demandée :", 1);
					if (qte === null || isNaN(qte)) return;
					
					// console.log(val);
					setTimeout(function() {
						const $selectedLi = $('.ms-selection li[data-codearticle="' + val + '"]');
						$selectedLi.attr('data-QteDem', parseInt(qte));
						if ($selectedLi.find('.badge.QteDem').length === 0) {
						  $selectedLi.append(`<span class="QteDem badge badge-success">${qte}</span>`);
						} else {
						  $selectedLi.find('.badge.QteDem').text(qte);
						}
					  }, 50);
					
					});
				  
				});
				
			  },
			afterSelect: function(values) {				
				/* values.forEach(function(val) {
				  const $item = $('.ms-selection li[data-ms-option-value="' + val + '"]');
				 $item.attr('data-QteDem',10)
				 console.log($item);
				});  */
			  },
			afterDeselect: function(values) {
				/* values.forEach(function(val) {
				  const $item = $('.ms-selection li[data-ms-option-value="' + val + '"]');
				  $item.removeAttr('data-QuteDemande');
				}); */
			  }
			  
			});
			
			this.filterms();
			let t=`<li class="filterfield"><input type="text"></></li>`
			$(".articleContainer").prepend(t);
			let o1=$(".articleContainer").find(".filterfield input");
			o1.on("keyup",(e)=>{
			this.filterms({recherche:e.target.value.toUpperCase()})
			})
		}catch(err){
			console.log(err);
		}
		
		
	}
	
}