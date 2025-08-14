class CDatatable{
	
	constructor(options={}){
		const{
			selectors={
				table:"table1",
				container:"root-container",
				widget:"wd1"
			},
			
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
			this.data=D0;
			this.selectors=selectors;
			this.sklt=`<table id="${this.selectors.table}" class="table table-striped table-bordered table-hover"></table>`;
			/**@return {String} - squelette de la table dans un widget  */
			this.skltInWidget=(wdTitle="")=>{
				return`<div class="col-12 col-md-6 col-lg-4 widget-container-col" id="widget-container-col-1">
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
	
	init(){
		myLoadKit.varInfinitMode=false;
		let IdContainer="#"+this.selectors.container;
		let IdTable="#"+this.selectors.table;
		
		if($(IdTable).length==0 ){
			$(IdContainer).prepend(this.skltInWidget());
			let cols=this.data.colNames.map(cName=>({title:`${cName}`,data:`${cName}`}) )
			
			const myTable1=$(IdTable).DataTable(
				{
					data:this.data.data,
					columns:cols,
					
				}
			);
			
				$.fn.dataTable.Buttons.defaults.dom.container.className = 'dt-buttons btn-overlap btn-group btn-overlap';

    new $.fn.dataTable.Buttons(myTable1, {
      buttons: [
        {
          "extend": "colvis",
          "text": "<i id='btn01' class='fa fa-cog bigger-110 blue'></i> <span class='hidden'>Show/hide columns</span>",
          "className": "btn btn-white btn-primary btn-bold",
          columns: ':not(:first):not(:last)'
        }
      ]
    });
    // myTable1.buttons().container().appendTo($('.tableTools-container'));
    myTable1.buttons().container().appendTo(`#${this.selectors.widget} .widget-header .widget-toolbar`);
	
	// colVisAction
	var defaultColvisAction = myTable1.button(0).action();
    myTable1.button(0).action(function (e, dt, button, config) {
      defaultColvisAction(e, dt, button, config);
      if ($('.dt-button-collection > .dropdown-menu').length == 0) {
        $('.dt-button-collection')
          .wrapInner('<ul class="dropdown-menu dropdown-light dropdown-caret dropdown-caret" />')
          .find('a').attr('href', '#').wrap("<li />")
      }
      // $('.dt-button-collection').appendTo('.tableTools-container .dt-buttons')
      $('.dt-button-collection').appendTo(`#${this.selectors.widget} .widget-header .widget-toolbar #btn01`);

    });
	// colVisAction
		}
	}
}