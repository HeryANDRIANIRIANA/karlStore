class ClassChequeMatiereEditPannel{
	
	constructor(selector="#myChequeMatPannel", options={}){
		const{
			pplIcon="box"
			
		}=options;
		try{
			this.pplIcon=pplIcon;
			this.$el=$(selector);
			this.selector=selector;
			this.mainContainerSelector=this.selector+" .ahDropTableContainer";
			this.mainbtnSelector=this.mainContainerSelector+" .dropdown a.btnMain";
			this.bodySelector=this.selector+" .ahDropTableContainer li.dropdown ul.dropdown-menu li.body";
			this.footerSelector=this.selector+" .ahDropTableContainer li.dropdown ul.dropdown-menu li.footer";
			this.currentDetailComData=window["travauxSelectedData"];
			window["newChequeMatiereSerie"]={ NumChqMSerie:"",...this.currentDetailComData};
			this.oldChequeMatiere=null;
			this.oldDetailChequeMatiere=null;
			this.assistanceData=[
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
						  "id": "Demandeur:Cynthia Murielle",
						  "text": "Cynthia Murielle"
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
			this.assistanceId="select-paramW";
			// this.init();
		}catch(err){
			console.error(err)
		}
	}
	
	destroy(){
		this.$el.off()
		this.$el.remove();
	}
	
	async init(options={}){
		try{
			const{
			productId=0, NumChqMSerie=""
			}=options
			
			if(productId!==0 && NumChqMSerie!==""){
				let d=window["chequeMatiereByProductIdData"][productId];
				// console.log(d);
				this.oldChequeMatiere=d['chequeMatiere'];
				this.oldDetailChequeMatiere=d['detailChequeMatiere']
				window["newChequeMatiereSerie"]["NumChqMSerie"]=NumChqMSerie;
			}
			
		let str=this.sklt({headerText:NumChqMSerie});
		this.$el.html(str);
		window["QteSansPass"]=0;
		//btn ppl
		let mainbtnSelector=this.mainContainerSelector+" .dropdown a.btnMain"
		$(mainbtnSelector).on("click",(e)=>{
			e.preventDefault(); // Empêche le comportement par défaut du lien
			let a=$(e.currentTarget).closest("a");
			
			if(a.attr("disabled")!=="disabled"){
				let o=$(e.currentTarget).closest("li").find(".dropdown-menu");
				o.slideToggle();
				
				// if (o.is(":visible")) {
					// o.slideUp(); // Cache si déjà visible
				// } else {
					// o.slideDown(); // Affiche sinon
				// }
				//escape
		

			}
			
			return 0;
			}) 
		
		// .off("keydown", this)
		// $(document).off("keydown", this.$el).on("keydown", this.$el, async (e)=>{
		$(document).off().on("keydown", this.$el, async (e)=>{
			if(!$(this.selector).is(':visible')) return;
			switch(e.key){
				case "Escape":
					// Ferme le dropdown ou fait autre chose
					this.slideToggleFromAnyWhere();
					$(document).off()
					break;
				case "F8":
					await this.saveNewChequeMatiere();
					$(document).off()
					break;
			}
			// $(document).off()
		})

		//description detail commande
		let d=this.currentDetailComData;
		// console.log(d);
		$('<li>',{
			text:`${d.QteCom} : ${d.DesignProd}`
		}).appendTo(this.bodySelector)
		
		//sliderPass
		this.initSliderPass({cible:$(this.bodySelector)})

		//select2
		this.initChequeMatiereAssistance()	;
		
		//ajout manuelle
		await this.articleAddPannel({selectedArticles:this.oldDetailChequeMatiere})
		
		//footer
		this.initFterFiche();
		
		feather.replace();
		return 0;
		}catch(err){
			console.log(err);
			alert(err)
		}
	}
	
	initSliderPass(options={}){
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
	
	getSkltChequeMatiereAssistance(){
		let s=``;
		let idSelect=this.assistanceId;
		let s1=this.convertDataToOptGroup(this.assistanceData);
		s=`<div data-keyupaction="closeTooltypPreNewChqm">	<select id="${idSelect}" multiple data-placeholder="Demandeur et details..." class="form-control"> ${s1} </select></div>`;
		return s;
	}
	initAssistanceChqM2(){		
		let idSelect=this.assistanceId;
		$("#"+idSelect).select2();
		$("#"+idSelect).on('select2:select', async(e)=>{
				await this.ficheWparams2(e);
				// console.log(e);
			})
		$("#"+idSelect).trigger('change.select2');
		
	}
	
	initChequeMatiereAssistance(){
		try{
			let idSelect="select-paramW";
		let data=this.assistanceData;
		
		
		let preselectedValues=[];
		if(this.oldChequeMatiere!==null){
			if(typeof(this.oldChequeMatiere[0]['Demandeur'])!=="undefined"){
			preselectedValues.push(this.oldChequeMatiere[0]['Demandeur'])
			}
		}
		let s1=this.convertDataToOptGroup(data,{preselectedValues:preselectedValues});
		let str4=`<div class="p-4">	<select id="${idSelect}" multiple data-placeholder="" class="form-control"> ${s1} </select></div>`;
			$(this.bodySelector).append("<li><div style='display: inline-block;'>"+str4+"</div></li>");
		
		$("#"+idSelect).select2();
			$("#"+idSelect).on('select2:select', async(e)=>{
				await this.ficheWparams(e);
			})
		$("#"+idSelect).trigger('change.select2');
		
		}catch(err){
			alert(err)
		}
		
		
		// $("#"+idSelect).val()
	}
	
	async articleAddPannel(options={}){
		try{
			const{selectedArticles=[]}=options;
			window["myArticle"]=new ClassArticle({varName:"myArticle"})
			let s0=await window["myArticle"].generateSelect()
			
			// let bdy=$("#dropdown-"+this.obj).find("li.body");
			let optgroup="opt1"
			let s2=this.defaultSkltOptgroup({optgroup:optgroup,s0:s0})
			let s=`<ul class="articleContainer"><li id="btnAddArticle">${s2}</li></ul>`;
			$(this.bodySelector).append(s);
			
			$('#'+optgroup).multiSelect({ selectableOptgroup: false, dblClick:true,
			afterInit: function(container) {
				let lis = container.find(".ms-selectable ul li");
				lis.each(function () {
				  let $li = $(this);
				  let stock = $li.data('qtestockart');
				  let caracteristique= $li.data('designarticle')+'-'+$li.data('caractéristique');
				  if (typeof stock !== "undefined") {
					$li.append(`<span class="badge badge-info">${stock}</span><span class="caracteristique"> ${caracteristique}</span>`);
				  }
				  
				  // ecouteur d'évènement
				  $li.off('dblclick').on('dblclick',()=>{
					let val=$li.data('codearticle');
					let qte = prompt("Entrer la quantité demandée :", 0);
					if (qte === null || isNaN(qte)) return;
					
					// console.log(val);
					setTimeout(function() {
						const $selectedLi = $('.ms-selection li[data-codearticle="' + val + '"]');
						$selectedLi.attr('data-qtedem', parseInt(qte));
						if ($selectedLi.find('.badge.QteDem').length === 0) {
						  $selectedLi.append(`<span class="QteDem badge badge-success">${qte}</span>`);
						} else {
						  $selectedLi.find('.badge.QteDem').text(qte);
						}
					  }, 50);
					  /* setTimeout(()=>{
						  this.setQteOnSelectedArticle(val,qte)
					  },50) */
					
					});
				  
				  
				  
				});
				
			  },
			afterSelect: function(values) {		
			// console.log(values);			
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
			
			if(selectedArticles.length>0){				
					let a=[]; let b={}
						selectedArticles.forEach((v, k) => { 
						a.push(v['CodeArticle'])
						// b[v['CodeArticle']]=v['QteDem']
						});
						$('#'+optgroup).multiSelect('select',a);
												
						setTimeout(()=>{
							// this.setQteOnSelectedArticle(codeArticle,QteDem)
							selectedArticles.forEach((v, k) => { 
							this.setQteOnSelectedArticle(v['CodeArticle'] ,v['QteDem'])
							});
						},50)
					}
					
			
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
	
	setQteOnSelectedArticle(codeArticle,QteDem){
		// console.log(codeArticle,QteDem);		
						const $selectedLi = $('.ms-selection li[data-codearticle="' + codeArticle + '"]');
						$selectedLi.attr('data-qtedem', parseInt(QteDem));
						if ($selectedLi.find('.badge.QteDem').length === 0) {
						  $selectedLi.append(`<span class="QteDem badge badge-success">${QteDem}</span>`);
						} else {
						  $selectedLi.find('.badge.QteDem').text(QteDem);
						}
					  
	}
	
	initFterFiche(){
		let fterContent=`<ul><li><a href="javascript:void(0);" class="btn-save">"F8" <i data-lucide="save"></i></a></li> <li><a href="javascript:void(0);" class="btn-cancel"> "Esc" <i data-lucide="x"></i></a></li> </ul>`
		$(this.footerSelector).html(fterContent)
		lucide.createIcons();
		//verrification newChequeMatiereSerie
		let btnSave=$(".btn-save");
		// let bdy=$("#dropdown-"+this.obj).find("li.body>ul.menu");
		// let fter=$("#dropdown-"+this.obj).find("li.footer");
		
		$("#dropdown-"+this.obj).on('keyup',async (e)=>{
			// console.log(e.key);
			switch(e.key){				
				case "F8":
				await this.saveNewChequeMatiere()
				break;
				case "Escape":
				let o=$("#"+this.btnId).closest("li").find(".dropdown-menu");
				o.slideToggle();
				break;			
			}
			
		})
		btnSave.off().on('click',async (e)=>{
			await this.saveNewChequeMatiere()
		})
		
	}
	
	convertDataToOptGroup(data, options={}){
		const{preselectedValues=[]}=options;
		let s="";
		// console.log(data);
		// data.forEach()
		// console.log(preselectedValues);
		data.forEach((v, k) => {
			let s2='';
				v.children.forEach((v1, k1) => { 
				// console.log(v1.text);
				if(preselectedValues.length>0 && preselectedValues.includes(v1.text)){
					s2+=`<option value="${v1.id}" selected="selected" >${v1.text}</option>`
				}else{
				s2+=`<option value="${v1.id}" >${v1.text}</option>`	
				}
				
				});
			s+=`<optgroup label='${v.text}'>${s2}</optgroup >`
			});
		return s
	}
	
	async getParamChequeMatiere(options={}){
		const{o=$("#select-paramW")}=options
		try{
			// $(e.currentTarget).trigger('change.select2');
			let v=o.val();
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
		}catch(err){
			console.log(err)
		}
		
	}
	
	async ficheWparams2(e){			
		let selectedOption=e.params.data.element;
		let optgroup=$(selectedOption).parent()
		$(optgroup).find('option').each(function(){
			if(this!=selectedOption){
				$(this).prop('selected',false);
			}
		})
		$(e.currentTarget).trigger('change.select2');
		let v=$(e.currentTarget).val();
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
		
		// console.log(e);
		// if(e.ctrlKey===true && e.key==="Enter" && window["newChequeMatiereSerie"]["Demandeur"]!=="" ){
			// instance.close();
		// }
		// console.log(v1);
		if(v.length===4){
			window["myTravaux"]=new ClassTravaux();
			let cm=await window["myTravaux"].generateDetailChequeM({QteCom:window["travauxSelectedData"].QteCom, TypeDePapier:v1["TypeDePapier"] , Format:v1["Format"], Reference:v1["Reference"]})
			//mise à jour du select
			window["cm"]=cm;
			
			   console.log(cm); 
			await this.selectArticle2();
		}
	}

	
	async ficheWparams(e){
		let selectedOption=e.params.data.element;
		let optgroup=$(selectedOption).parent()
		$(optgroup).find('option').each(function(){
			if(this!=selectedOption){
				$(this).prop('selected',false);
			}
		})
		$(e.currentTarget).trigger('change.select2');
		let v=$(e.currentTarget).val();
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
			window["myTravaux"]=new ClassTravaux();
			let cm=await window["myTravaux"].generateDetailChequeM({QteCom:window["travauxSelectedData"].QteCom, TypeDePapier:v1["TypeDePapier"] , Format:v1["Format"], Reference:v1["Reference"]})
			//mise à jour du select
			window["cm"]=cm;
			
			 // console.log(cm); 
			// this.selectArticle();
			await this.selectArticle2();
		}
	}

async selectArticle2(){
	console.log(window["newChequeMatiereSerie"]);
	window["curentOperation"]="newChqMSerie"
	let obj=window["cm"];
	window["cmFusionned"]={...obj.interieur,...obj.couverture};
	let ar=Object.keys(window["cmFusionned"]);
	let myArtSelected=new ArticleSelected();
	function loopOnArticleData(){
		// console.log();
		let ar=[]
		for (let key in window["cmFusionned"]) {
			// console.log(key, obj[key]); // Affiche les clés et leurs valeurs
			let d=window["articleDataByCodeArticle"][key]
			d["QteDem"]=window["cmFusionned"][key];
			ar=myArtSelected.refreshData(d)
			
		}
		// console.log(ar);
		return ar
	}
	
	let arSelectedArticle=loopOnArticleData()
	
	$('#article-panel-container').articleSelectedPannel({curentOperation:'newChqMSerie'});
	$('#article-panel-container').articleSelectedPannel('init');
	// $('#article-panel-container').articleSelectedPannel({tableData:arSelectedArticle});
	$('#article-panel-container').articleSelectedPannel("setData",arSelectedArticle,{unhidedCols:[0,1,8], bWithIconCol:true, iconConf:{iconName:"delete",iconAction:"deleteArticleSelected", iconClass:"feather-icon-red"}});
	
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
	
	sklt(options={}){
		const{headerText=''}=options
		return `<div class="ahDropTableContainer">
<li class="dropdown" >
	<a href="javascript:void(0);" disabled="false" class="btnMain waves-effect neon-button" role="button"><i data-feather="${this.pplIcon}" class="feather-icon-red"></i>
 <span class="label-count"></span>
	</a>
	<ul class="dropdown-menu" >
		<li class="header">${headerText} </li>
		<li class="body">
		  <ul class="menu tasks" style=''>
		  
		  </ul>
		</li>
		<li class="footer">
			<ul>
			<li><a href="javascript:void(0);" class="btn-save"></a></li>
			<li></li>
			</ul>
			
		</li>
	</ul>
</li>
</div>	`
	}
	
	setState(state="loading"){
		try{
			switch(state){
				case "loading":	
				$(this.mainbtnSelector).attr("disabled", "disabled" )
				
				$(this.mainbtnSelector).html(`<i data-feather="server" class="feather-icon-animedColor"></i>`);
				feather.replace();
				
				break;
				case "normal":				
				$(this.mainbtnSelector).html(`<i data-feather="${this.pplIcon}" class="feather-icon-red"></i>`);
				feather.replace();
				$(this.mainbtnSelector).removeAttr("disabled")
				
				break;
			}
		}catch(er){
			alert(er)
		}
	}

	slideToggleFromAnyWhere(){
		$(this.mainbtnSelector).siblings(".dropdown-menu").slideToggle();
	}

	async saveNewChequeMatiere(){
		await this.getParamChequeMatiere()
		let cmValide=await this.verrifNewChequeMaiere();
		if(cmValide===true){
			window["arNewDetailChequeMatiere"]=this.getDetailChequeMatiereFromInterface();
			if(window["arNewDetailChequeMatiere"].length===0){
				alert("Detail chèque matière Obligatoire")
			}else{
				// console.log(window["arNewDetailChequeMatiere"]);
				// this.slideToggleFromAnyWhere()
				this.setState('loading');
				window["myDb1"].setState('loading');
				window["myChequeMatiere"].save({oldChequeMatiere:this.oldChequeMatiere});
				this.destroy()
				// let o=$(this.mainbtnSelector).closest("li").find(".dropdown-menu");
				// o.slideToggle();
				// $(this.bodySelector).html('');
				// $(this.footerSelector).html('');
				// let bdy1=$("#dropdown-"+this.obj).find("li.body>ul.menu");
				// let bdy2=$("#dropdown-"+this.obj).find("li.body>ul.articleContainer");
				// bdy1.html("")
				// bdy2.html("")
				// let fter=$("#dropdown-"+this.obj).find("li.footer");
				// fter.html("")
			}
		}
	}
	
	/**saveNewChequeMatiere2  
	@dep:window["newChequeMatiereSerie"], window["arSelectedArticle"]
	*/
	async saveNewChequeMatiere2(NumChqMSerie){
		// console.log(NumChqMSerie);
		// console.log(window["newChequeMatiereSerie"]);
		// console.log($("#dspPannel").data());
		let curentChequeMatiereSerie=$("#dspPannel").data();
		curentChequeMatiereSerie=curentChequeMatiereSerie["newChqmSerie"];
		// console.log(curentChequeMatiereSerie);
		curentChequeMatiereSerie['NumChqMSerie']=NumChqMSerie
		let arDetailChequeMatiereSerie=[];		
		window["arSelectedArticle"].forEach((v, k) => { 
		v["NumChqMSerie"]=NumChqMSerie;
		v["QteNec"]=v["QteDem"];
		v["SortieV"]=false;
		v["RetourV"]=false;
		arDetailChequeMatiereSerie.push(v);
		});
		window["arNewDetailChequeMatiere"]=arDetailChequeMatiereSerie;
		// console.log(window["arNewDetailChequeMatiere"]);
		
		await window["myChequeMatiere"].save({newChequeMatiereSerie:curentChequeMatiereSerie,detailChequeMatiereSerie:arDetailChequeMatiereSerie});
	}
	
	async verrifNewChequeMaiere(){
		let valid=false;
		// console.log(window["newChequeMatiereSerie"]);
		// console.log($("#select-paramW").val());
		// await this.ficheWparams("#select-paramW");
		
		if(typeof(window["newChequeMatiereSerie"]["Demandeur"])=="undefined"){
			alert("Demandeur à spécifier")
			$("#select-paramW").focus();
		}else{
			valid=true
		}
		return valid;
	}
	
	getOldQteNec(codearticle){
		let QteNec=0;
		this.oldDetailChequeMatiere.forEach((v, k) => { 
		if(v['CodeArticle']===codearticle){ QteNec = parseInt(v['QteNec'])}
		// console.log(QteNec);
		
		});
		return QteNec;
	}
	
	getDetailChequeMatiereFromInterface(){
		let optgroup="opt1"
		let container=$('#ms-'+optgroup);
		let selections=container.find(".ms-selection ul li.ms-selected")
		let arDetailChequeMatiereSerie=[];
		let that=this;
		selections.each(function(){
		let $li=$(this)
		// console.log($li.data());
		let codearticle=$li.data('codearticle')
		// console.log(codearticle);
		let QteDem=(!isNaN($li.find('.QteDem').text()))?parseInt($li.find('.QteDem').text()):0;
		let oldQteNec=that.getOldQteNec(codearticle);
		// console.log(oldQteNec);
		let QteNec=(that.oldDetailChequeMatiere===null)?QteDem:oldQteNec+QteDem;
		arDetailChequeMatiereSerie.push({"CodeArticle":codearticle,"QteDem":QteDem,"QteNec":QteNec,"SortieV":"Non","RetourV":"Non"})
		// console.log(arDetailChequeMatiereSerie);
		
		})
		
		return arDetailChequeMatiereSerie;
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

	beforSave(){
		// let step2Content=`<div>< input type="text" id="numChqmSerie" data-keyupaction="checkIfAvailableNumChqmSerie" ></div>`
		let step2Content="<div><input type='text' id='numChqmSerie' placeholder='Num Chèque matière' data-keyupaction='checkIfAvailableNumChqmSerie' ></div>"
		// $('#article-panel-container').articleSelectedPannel('injectStep2',{step2Content:step2Content});
		$('#article-panel-container').articleSelectedPannel('injectStep',{stepContent:step2Content, stepNumber:2});
	}
	
	/* 
	checkIfAvailableNumChqmSerie: after enter from step2 befoore send to db
	@dep:window["productIdByChequeMatiere"]
	*/
	async checkIfAvailableNumChqmSerieThenSave(num){
		// console.log(num);
		let numAvaliable=false;
		if(typeof(window["productIdByChequeMatiere"][num])==='undefined'){
			await this.saveNewChequeMatiere2(num);
			return true;
		}else{
			return false
		}
		
	}
	
}