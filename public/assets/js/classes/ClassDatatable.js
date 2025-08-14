class CDatatable{
	
	constructor(options={}){
		const{
			varName='myTable',
			selectors={
				table:"table1",
				container:"root-container section.content .container-fluid",
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
			this.sklt=`<div class="col-md-12">
			<table style="width:100%" id="${this.selectors.table}" class="table table-striped table-bordered table-hover"></table>
			</div>`;
			/**@return {String} - squelette de la table dans un widget 
<div class="col-6 col-md-6 col-lg-4 widget-container-col" id="widget-container-col-1">			*/
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
			
			this.IdContainer="#"+this.selectors.container+" .row";
			this.headerS="#"+this.selectors.container+' .block-header nav.navbar';
			this.OTableName="myTable"+this.varName;
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
			deleteEvent="",
			initCompleteEvent="",
			selectRowEvent="",
			titre=""
		}=options
		// console.log(window["datatableIn"]);
		// TODO: DATATable In GlobalVar sur le current Datatabel dans une 
		// // Window.myLoadkit.varInfinitMode=false;
		// let IdContainer="#"+this.selectors.container+" .row";
		let IdContainer=this.IdContainer;
		let headerS=this.headerS;
		// let headerS="#"+this.selectors.container+' .block-header nav.navbar';
		let IdTable="#"+this.selectors.table;
		$(headerS).html("");
		// console.log("test:"+IdTable);
		// #paramSalaire-table1
		// console.log("idselecrtor:"+$(IdTable).length)
		// if($(IdTable).length>0 ){
			// $("#widget-container-col-1").remove();
		// }
		// if($(IdTable).length==0 ){
			 // $(IdContainer).append(this.skltInWidget());
			 $(IdContainer).html(this.sklt)
			 // console.log(this.data);
			let cols=this.data.colNames.map(cName=>({title:`${cName}`,data:`${cName}`}) )
			// console.log(cols);
			let OTableName= this.OTableName;
			
			window[OTableName]=$(IdTable).DataTable(
				{
					select:true,
					data:this.data.data,
					columns:cols,
					// width:500
					"initComplete":async (setting, e=initCompleteEvent)=>{
						if(e!==""){
							// console.log(this.varName);
							let myDtEvent=new CDatatableEvent({varName:this.varName});
							await myDtEvent[e](setting);
						}
					}
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
				
			window[OTableName].columns(colIds).visible(false);
			window[OTableName].columns(efColVis).visible(true);
			
			/* myTable.columns(c).visible(false);
			 console.log(myTable1.column(1).visible());*/
			$.fn.dataTable.Buttons.defaults.dom.container.className = 'dt-buttons btn-overlap btn-group btn-overlap';

			// aditifButtons injecté depuis this.btnSklt()
			new $.fn.dataTable.Buttons(window[OTableName], {
			  buttons: this.btnSklt()
			});
			// myTable1.buttons().container().appendTo($('.tableTools-container'));
			// $('#root-container section.content .container-fluid .block-header nav.navbar')html(myTable.buttons().container()) ;
			window[OTableName].buttons().container().appendTo($(headerS));
			$(headerS).append(titre)
			
			// myTable.buttons().container().appendTo('#'+this.selectors.widget+' .widget-header  .widget-toolbar');
	
			// colVisAction
			var defaultColvisAction = window[OTableName].button(0).action();
			window[OTableName].button(0).action(function (e, dt, button, config) {
			  defaultColvisAction(e, dt, button, config);
			  if ($('.dt-button-collection > .dropdown-menu').length == 0) {
				$('.dt-button-collection')
				  .wrapInner('<ul class="dropdown-menu dropdown-light dropdown-caret dropdown-caret" />')
				  .find('a').attr('href', '#').wrap("<li/>")
			  }
			  // $('.dt-button-collection').appendTo(`#${this.selectors.widget} .widget-header .widget-toolbar .btn01`);
			  // $('.dt-button-collection').appendTo($('#root-container section.content .container-fluid .block-header nav.navbar .btn01'));

			});
			// colVisAction
	
			/* aditif actions */
			let i=1;
			for (const act of this.aditifActions){
				window[OTableName].button(i).action(async (e, dt, button, config)=>{
					let myDtEvent=new CDatatableEvent({varName:this.varName});
					await myDtEvent[act](e, dt, button, config);
				});
				i++;
			}
	
			/* deplacement d'éléments
			$(".dt-layout-row").appendTo(".widget-toolbar") */
				 $(".dt-layout-row").css({"display":"flex" });
		// }
		
		// event onSeletRow
		// console.log(window.myTable);
		window[OTableName].on('select', async (e, dt, type, indexes)=>{
			 // console.log(e, dt, type, indexes);
			if (type === 'row') {
				// let t="<input type='text'> </input>"
				// console.log(dt.cell(indexes, 3).data(t));
				// console.log(window[OTableName].rows(indexes).cell().data().toArray())
				
				 var data = window[OTableName].rows(indexes).data().toArray();
				 window[OTableName+"selectedData"]=data;
				// console.log(selectRowEvent)
				if(selectRowEvent!=""){
					let myDtEvent=new CDatatableEvent({varName:this.varName});
					await myDtEvent[selectRowEvent]();
				}
				 // console.log(data);
			}
		});
		
		
		// event delete on suppr
		$(document).on("keydown",function(e){
			// console.log(e.key)
			if(e.key==="Delete" || e.key==="Backspace"){
				var selectedRows=window[OTableName].rows({selected:true});
				let d=selectedRows.data().toArray();
				if(deleteEvent!=="" && d.length>0){
					let myDtEv=new CDatatableEvent();
					myDtEv[deleteEvent](d);
					
				}
			}
		})
		
		
		
		
		let c=this.selectors.container.split(" ")[0]
		window["datatableIn"][c]=this.varName+"CDatatable";
		// window["datatableIn"][c]["datatable"]=window[OTableName];
		
		
		
		return OTableName;
	}
	
	async unset(options={}){
		const{}=options
		try{
			// let c=this.selectors.container.split(" ")[0];
			let t="myTable"+this.varName;
			window[t].destroy()//detruit la datatable
			$(this.IdContainer).html("");
			$(this.headerS).html("");
		}catch(err){
			console.log(err)
		}
		
	}
	
	async showInDatatable(options={}){
		const{c0='root-container', globalData="", titre="", deleteEvent="", initCompleteEvent="", varName="", efColVis=[1,2,3]}=options
		try{
			if(globalData!==""){
				if(typeof(window["datatableIn"][c0])==="string"){
			let v=window["datatableIn"][c0]
			// console.log(v);
			await window[v].unset();
			}
			
			window.myMiniD=new CMiniDatatable({varName:varName});
			
			let dataTOptions={
					deleteEvent:deleteEvent,
					initCompleteEvent:initCompleteEvent,
					efColVis:efColVis,
					globalData:globalData,
					selectors:{container:c0+" section.content .container-fluid",table:"table1",widget:"wd1"},
					aditifBtn:[],
					/* these actions are defied inCDatatableEvent, "paramSalaireImport" */
					aditifActions:[],
					varName:varName,
					titre:titre
				}
				let s=await myMiniD.set({dataTOpt2:dataTOptions})
			}else{
				alert('globalData obligatoir ne doit pas etre vide ')
			}
				return 0;
			
		}catch(err){
			console.log(err)
		}
		
	}
	
}