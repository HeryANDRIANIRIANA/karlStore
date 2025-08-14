class TableManager {
	constructor(){
		this.data=[];
		this.selector="";
		this.defaultVisibleCols=[];
		this.selectedLineData="";
		this.colvisIcon="eye"
	}
	setData(opt={}){
		const{data=[],selector="", defaultVisibleCols=[], selectedLineData="",classContainer=""}=opt;
		this.data=data;
		this.selector=selector;
		this.defaultVisibleCols=defaultVisibleCols;
		this.selectedLineData=selectedLineData;
		// console.log(this.data);
		this.initTable({classContainer:classContainer})
	}
	initTable(opt={}){
		const{classContainer=""}=opt
		let colNames=Object.keys(this.data[0])
		// colnames.unshift('i'); //when i need icons
		let cols=colNames.map(cName=>({title:`${cName}`,data:`${cName}`}))
		/* if($.fn.DataTable.isDataTable(this.selector))){
			console.log();
			$(this.selector).DataTable().destroy()
		} */
		$(this.selector).DataTable().destroy()
		
		window["dtTableIn"+classContainer]=$(this.selector).DataTable({
			select:true,
			data:this.data,
			columns:cols,
			dom:'Bfrtip',
			buttons: [
			  {
				extend: 'colvis',
				text: `<i data-feather="${this.colvisIcon}" class="feather-icon-red"></i>`
			  }
			]
		})
		
		let t=window["dtTableIn"+classContainer]
		let defVisCol=(this.defaultVisibleCols.length===0)?[0,1,2]:this.defaultVisibleCols
		cols.forEach((v, k) => { 
		t.column(k).visible(false);
		});
		defVisCol.forEach((v, k) => { 
		t.column(v).visible(true);
		});
		
		const self=this;
		$(this.selector+' tbody').on('click','tr',function(){
			// selectedLineData
			t.$('tr.selected').removeClass('selected');
			$(this).addClass('selected');
			window[self.selectedLineData] = t.row(this).data();
		})
		
		t.on('draw.dt', function(){
			if(typeof window[classContainer]!=="undefined"){
				// eval(fnDraw,this)
				window[classContainer].tableDrawProcedure(this,self,t)
			}
			
			/* $(self.selector).find('tbody tr').each(function(rowIndex){
				let rowData=t.row(this).data();
				// console.log(rowData);
				
				let $cells=$(this).children('td');
				console.log($cells.eq(3).text());
				// console.log($cells.eq(0).attr('class'));
			}) */
		})
		
		t.draw(false);
		feather.replace();
		
	}
}