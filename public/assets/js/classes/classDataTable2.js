class DataTable2{
	constructor(c){
		this.c=c
		this.varName=this.c.split('#')[1];
		this.aditifBtn=[];
		this.aditifActions=[];
	}
	
	btnSklt(){
		
		let btn=[
				{
				  "extend": "colvis",
				  "text": "<i  class='fa fa-cog bigger-110 blue btn01'></i>",
				  "className": "btn btn-white btn-primary btn-bold",
				  columns: ':not(:first):not(:last)'
				}
			  ]
			  for( const b of this.aditifBtn){
				  btn.push(b)
			  }
			  
		return btn;
	}
	
	init(options={}){
		const{data=[] , defColVis=[0,1,2]}=options;
		try{
		let bOk=false
		if(data.length===0){
			alert("data not ready")
		}else{
			// let data1=data;
			
			bOk=true;
		}
			
		
		if(bOk===true){//tout cond OK init DatataBLe
			let cols=Object.keys(data[0]).map(cName=>({title:`${cName}`,data:`${cName}`}) )
			window[this.varName]=$(this.c).DataTable({
			select:true,
			data:data,
			columns:cols
			})
			
			let colIds=Object.keys(cols);
			colIds=colIds.map((v)=>{return parseInt(v)} );
			window[this.varName].columns(colIds).visible(false);
			window[this.varName].columns(defColVis).visible(true);
			$.fn.dataTable.Buttons.defaults.dom.container.className = 'dt-buttons btn-overlap btn-group btn-overlap';
			new $.fn.dataTable.Buttons(window[this.varName], {
			  buttons: this.btnSklt()
			});
			var defaultColvisAction = window[this.varName].button(0).action();
			window[this.varName].button(0).action(function (e, dt, button, config) {
			  defaultColvisAction(e, dt, button, config);
			  if ($('.dt-button-collection > .dropdown-menu').length == 0) {
				$('.dt-button-collection')
				  .wrapInner('<ul class="dropdown-menu dropdown-light dropdown-caret dropdown-caret" />')
				  .find('a').attr('href', '#').wrap("<li/>")
			  }

			});
			let header=$(this.c).closest('li.body').find('.dt-layout-cell.dt-layout-end');
			window[this.varName].buttons().container().appendTo($(header));
			
		}
		
		}catch(err){
			console.error(err);
		}
	}
}