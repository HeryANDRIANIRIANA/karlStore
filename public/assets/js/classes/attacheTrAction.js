(function($){
	$.fn.attacheTrAction=function(options={}){
		const{lineSelectedAction=""}=options;
		let $table=this;
		let table=$table.DataTable();
		
		table.on('draw.dt', function(){
			$table.find('tbody tr').each(function(rowI){
				// console.log(lineSelectedAction);
				let rowData=table.row(this).data()
				// console.log(rowData);
				if(lineSelectedAction!==""){
					
					$(this).attr('data-action',lineSelectedAction)
					for (let key in rowData) {
						$(this).attr('data-'+key,rowData[key])
					}
				}
			})
		})
		table.draw(false);
		return this;
	}
})(jQuery)