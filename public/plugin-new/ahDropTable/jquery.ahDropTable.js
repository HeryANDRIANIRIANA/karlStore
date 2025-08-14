/*!
 * AhDropTable - jQuery Plugin
 * Author: Andrianiriana.hery (ou pseudo GitHub)
 * GitHub: https://github.com/tonutilisateur/ahdroptable
 * License: MIT
 */
		
class AhDropTable{
	constructor(selector="#myDropTable", options={}){
		const{
			pplIcon="box",
			colvisIcon="eye",
			defaultVisibleCols=[],
			lineSelectedData="travauxSelectedData",
			lineSelectedAction="",
			iconColumnParams=[],
		}=options;
		try{
			this.pplIcon=pplIcon;
			this.colvisIcon=colvisIcon;
			this.$el=$(selector);
			this.selector=selector;
			this.mainContainerSelector=this.selector+" .ahDropTableContainer";
			this.mainbtnSelector=this.mainContainerSelector+" .dropdown a.btnMain";
			this.bodySelector=this.selector+" .ahDropTableContainer li.dropdown ul.dropdown-menu li.body";
			this.tableSelector=this.bodySelector+" table";
			this.defaultVisibleCols=defaultVisibleCols;
			this.lineSelectedData=lineSelectedData;
			this.lineSelectedAction=lineSelectedAction;
			this.iconColumnParams=iconColumnParams;
			// console.log(iconColumnParams);
			this.defaultData=[
						{
							"name":       "Tiger Nixon",
							"position":   "System Architect",
							"salary":     "$3,120",
							"start_date": "2011/04/25",
							"office":     "Edinburgh",
							"extn":       "5421"
						},
						{
							"name":       "Garrett Winters",
							"position":   "Director",
							"salary":     "$5,300",
							"start_date": "2011/07/25",
							"office":     "Edinburgh",
							"extn":       "8422"
						}
					];
			this.init();
		}catch(err){
			console.error(err)
		}
	}
	
	slideToggleFromAnyWhere(){
		// $(this.mainbtnSelector).closest("li").find(".dropdown-menu").slideToggle();
		$(this.mainbtnSelector).siblings(".dropdown-menu").slideToggle();
	}
	
	closeFromAnyWhere(){
		let o=$(this.mainbtnSelector).siblings(".dropdown-menu")
		if(o.is(':visible')){
			o.slideUp();
		}
	}
	
	init(){
		let str=this.sklt();
		
		this.$el.html(str)
		
		//btn ppl
		let mainbtnSelector=this.mainContainerSelector+" .dropdown a.btnMain"
		$(mainbtnSelector).on("click",(e)=>{
			e.preventDefault(); // Empêche le comportement par défaut du lien
			let a=$(e.currentTarget).closest("a");
			
			if(a.attr("disabled")!=="disabled"){
				// let o=$(e.currentTarget).closest("li").find(".dropdown-menu");
				let o=$(e.currentTarget).siblings(".dropdown-menu");
				// console.log("test1");
				$(".dropdown-menu").not(o).slideUp();
				o.slideToggle()
				// if (o.is(":visible")) {
					// o.slideUp(); // Cache si déjà visible
				// } else {
					// o.slideDown(); // Affiche sinon
				// }
			}
			
			return 0;
			}) 
		//escape
		$(this.mainContainerSelector).on("keyup",(e)=>{
			
			switch(e.key){
				case "Escape":
				/* let o=$(e.target).closest("li").find(".dropdown-menu");
				o.slideToggle(); */
				this.closeFromAnyWhere();
				break;
			
			}
		})
		
		feather.replace();
		
		//DataTable inside
		this.tableInit();
		
		// console.log("init on ", this.$el);
	}
	
	skltTable(){
		return `<table style="width:100%" class="table table-striped table-bordered table-hover"></table>`
	}
	
	setData(data){
		try{
			this.defaultData=data;
			// console.log(this.defaultVisibleCols);
			this.tableInit();
		}catch(err){
			console.log(err);
			alert(err)
		}
	}
	
	tableInit(){
		$(this.bodySelector).html(this.skltTable());
		let colnames=Object.keys(this.defaultData[0])
		// console.log(colnames);
		colnames.unshift('i');
		let cols=colnames.map(cName=>({title:`${cName}`,data:`${cName}`}) )
		let t=$(this.tableSelector).DataTable({
			select:true,
			data:this.defaultData,
			columns:cols,
			columnDefs: [
				{
				  targets: 0,
				  title: "", // ou une icône
				  defaultContent: "", // ou un bouton, checkbox, etc.
				  orderable: false,
				  className: 'icon-col'
				}
				],
			dom: 'Bfrtip',
			buttons: [
			  {
				extend: 'colvis',
				text: `<i data-feather="${this.colvisIcon}" class="feather-icon-red"></i>`
			  }
			]
		});
		// console.log(cols);
		// console.log(this.defaultVisibleCols);
		let defaultVisibleCols1=(this.defaultVisibleCols.length===0)?[0,1,2]:this.defaultVisibleCols;
		cols.forEach((v, k) => { 
		t.column(k).visible(false);
		});
		defaultVisibleCols1.forEach((v, k) => { 
		t.column(v).visible(true);
		});
		const self=this;
		$(this.tableSelector+' tbody').on('click', 'tr', function () {
			t.$('tr.selected').removeClass('selected');
			$(this).addClass('selected');
			window[self.lineSelectedData] = t.row(this).data();
			// console.log("Nouvelle ligne "+self.lineSelectedData+" :", window[self.lineSelectedData]);
		});
		
		/* ICI je dois ajoutter une option qui permet non d'ajoutter un bouton mais d'ouvrir un tooltipster */
		// console.log(this.iconColumnParams);
		// console.log(colnames);
		if(this.iconColumnParams.length===0 && this.lineSelectedAction!==""){
			$(this.tableSelector).attacheTrAction({lineSelectedAction:this.lineSelectedAction})	
		}else if(this.iconColumnParams.length>0 && colnames.includes(this.iconColumnParams[0].condition.colName)){
			// console.log(this.lineSelectedAction);
			$(this.tableSelector).addIconColumn({params:this.iconColumnParams, lineSelectedAction:this.lineSelectedAction})	
		}
		
		// if(this.iconColumnParams.length===0){
		// $(this.tableSelector).addIconColumn({params:this.iconColumnParams, lineSelectedAction:this.lineSelectedAction})	
		// }else  {
			// $(this.tableSelector).attacheTrAction();
		// }
		
		
		feather.replace();
	}
	
	sklt(){
		return `<div class="ahDropTableContainer">
<li class="dropdown" >
	<a href="javascript:void(0);" disabled="false" class="btnMain waves-effect neon-button" role="button"><i data-feather="${this.pplIcon}" class="feather-icon-red"></i>
 <span class="label-count"></span>
	</a>
	<ul class="dropdown-menu" >
		<li class="header"></li>
		<li class="body">
		  <ul class="menu tasks" style=''>
		  
		  </ul>
		</li>
		<li class="footer">
			<ul>
			<li><a href="javascript:void(0);" class="btn-save"></a></li>
			<li><a href="javascript:void(0);" class="btn-cancel"> "Esc" pour Annuler</a></li>
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
			console.log(er);
			alert(er)
		}
	}
	
}

// Attache comme plugin jQuery
$.fn.AhDropTable = function () {
  return this.each(function () {
    // Sauvegarde une instance attachée à l'élément DOM
    if (!$.data(this, 'AhDropTable')) {
      $.data(this, 'AhDropTable', new AhDropTable(this));
    }
  });
};