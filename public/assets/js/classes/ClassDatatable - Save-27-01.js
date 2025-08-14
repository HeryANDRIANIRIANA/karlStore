class CDatatable{
	
	constructor(options={}){
		const{
			varName='',
			selectors={
				table:"table1",
				container:"root-container .row",
				widget:"wd1"
			},
			
			aditifBtn=[],
			aditifActions=[],
			D0={
				colNames:['name','position','salary','start_date','office','extn'],
				data:[
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
					]
				},
			
			}=options;
			// console.log(D0);
			this.varName=varName;
			this.data=D0;
			this.aditifBtn=aditifBtn;
			this.aditifActions=aditifActions;
			this.selectors=selectors;
			this.selectors.table=varName+"-table1";
			this.selectors.widget+="-"+varName;
			this.sklt=`<div class="col-md-6">
			<table style="width:100%" id="${this.selectors.table}" class="table table-striped table-bordered table-hover"></table>
			</div>`;
			/**@return {String} - squelette de la table dans un widget  */
			this.skltInWidget=(wdTitle=""+this.varName)=>{
				return`<div class="col-6 col-md-6 col-lg-4 widget-container-col" id="widget-container-col-1">
				<div class="widget-box" id="${this.selectors.widget}">
				<div class="widget-header">
				<h5 class="widget-title">${wdTitle}</h5>
				<div class="widget-toolbar">
				</div>
				</div>
				<div class="widget-body">
				<div class="widget-main">
				${this.sklt}
				</div>
				</div>
				</div>
				</div>`;
			}
			// this.init();
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
		const{
			efColVis=[0,1,2],
			deleteEvent=""
		}=options
		// // Window.myLoadkit.varInfinitMode=false;
		let IdContainer="#"+this.selectors.container;
		let IdTable="#"+this.selectors.table;
		// console.log("test:"+IdTable);
		// #paramSalaire-table1
		// console.log("idselecrtor:"+$(IdTable).length)
		if($(IdTable).length>0 ){
			$("#widget-container-col-1").remove();
		}
		// if($(IdTable).length==0 ){
			 $(IdContainer).append(this.skltInWidget());
			let cols=this.data.colNames.map(cName=>({title:`${cName}`,data:`${cName}`}) )
			
			window.myTable=$(IdTable).DataTable(
				{
					select:true,
					data:this.data.data,
					columns:cols,
					width:100
				}
			);
			
			let colIds=Object.keys(this.data.colNames);
			colIds=colIds.map((v)=>{return parseInt(v)} );
			/* console.log(colIds);
			colIds.splice(2,1);
			console.log(colIds);
			let c=[];
			let l4=2;
			while ( l4<=colIds.length){
				c.push(l4);
				l4++
				} */
				
			myTable.columns(colIds).visible(false);
			myTable.columns(efColVis).visible(true);
			
			/* myTable.columns(c).visible(false);
			 console.log(myTable1.column(1).visible());*/
			$.fn.dataTable.Buttons.defaults.dom.container.className = 'dt-buttons btn-overlap btn-group btn-overlap';

			// aditifButtons injecté depuis this.btnSklt()
			new $.fn.dataTable.Buttons(myTable, {
			  buttons: this.btnSklt()
			});
			// myTable1.buttons().container().appendTo($('.tableTools-container'));
			myTable.buttons().container().appendTo('#'+this.selectors.widget+' .widget-header  .widget-toolbar');
	
			// colVisAction
			var defaultColvisAction = myTable.button(0).action();
			myTable.button(0).action(function (e, dt, button, config) {
			  defaultColvisAction(e, dt, button, config);
			  if ($('.dt-button-collection > .dropdown-menu').length == 0) {
				$('.dt-button-collection')
				  .wrapInner('<ul class="dropdown-menu dropdown-light dropdown-caret dropdown-caret" />')
				  .find('a').attr('href', '#').wrap("<li/>")
			  }
			  $('.dt-button-collection').appendTo(`#${this.selectors.widget} .widget-header .widget-toolbar .btn01`);

			});
			// colVisAction
	
			/* aditif actions */
			let i=1;
			for (const act of this.aditifActions){
				myTable.button(i).action(function (e, dt, button, config){
					/* act(e, dt, button, config);
					console.log(e, dt, button, config);
					console.log(act)
					paramSalaireExport1 */
					let myDtEvent=new CDatatableEvent();
					myDtEvent[act](e, dt, button, config);
				});
				i++;
			}
	
			/* deplacement d'éléments
			$(".dt-layout-row").appendTo(".widget-toolbar") */
				 $(".dt-layout-row").css({"display":"flex" });
		// }
		
		// event onSeletRow
		// console.log(window.myTable);
		window.myTable.on('select', function (e, dt, type, indexes) {
			if (type === 'row') {
				var data = window.myTable.rows(indexes).data().toArray();
				// console.log(data);
			}
		});
		
		// event delete on suppr
		$(document).on("keydown",function(e){
			// console.log(e.key)
			if(e.key==="Delete" || e.key==="Backspace"){
				var selectedRows=window.myTable.rows({selected:true});
				let d=selectedRows.data().toArray();
				if(deleteEvent!=="" && d.length>0){
					let myDtEv=new CDatatableEvent();
					myDtEv[deleteEvent](d);
					
				}
			}
		})
		
	}
	
	
}