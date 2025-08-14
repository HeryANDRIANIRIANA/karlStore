(function($){
    $.fn.addIconColumn=function(options={}){
		const{
			t={},
			lineSelectedAction='',
			params=[
			{condition:{colName:"IsChequerM", sign:"=", colValue:"Non"},icon:{iconName:"tool", iconClass:"feather-icon-animedGreen", iconAction:"openChequeMatierEditPannel"}}
		]
		}=options
        var settings=$.extend({
            columnIndex:0,
            iconClass:['feather-icon-red'],
            iconName:'box',
			iconAction:''
        },options)
		
        // console.log(param1);
        
		var $table=this;
        var table=$table.DataTable();
		// var table=t;
        
		// if($table.find('thead th.icon-head').length===0){
            // var $theadRow=$table.find('thead tr');
            // var iconHeader=$('<th class="icon-head"></th>');
            // $theadRow.children().eq(settings.columnIndex).before(iconHeader)
        // }
        
        table.on('draw.dt',function(){
            $table.find('tbody tr').each(function (rowIndex){
               
				var rowData = table.row(this).data();
				
				// console.log(rowData);
				
                var iconHTML=`<a class="trefl01" href="javascript:void(0);"><span><i data-feather="${settings.iconName}" class="${settings.iconClass}"></i></span></a>`;
				
				if(params.length>0 && rowData!="undefined"){
					// 
					var iconConfig = getIconFromParams(rowData, params, {
					iconName: settings.iconName,
					iconClass: settings.iconClass,
					iconAction: settings.iconAction
					});

					iconHTML = `<a class="trefl01" href="javascript:void(0);" data-action="${iconConfig.iconAction}"><span><i data-feather="${iconConfig.iconName}" class="${iconConfig.iconClass}"></i></span></a>`;
				}
	

				// when select line;
				if(lineSelectedAction!==""){
					$(this).attr('data-action',lineSelectedAction);
				}
				
				 for (const [key, value] of Object.entries(rowData)) {
					const dataKey = 'data-' + key.toLowerCase();
					$(this).attr(dataKey, value);
				  }
				
				var $cells=$(this).children('td');
				
				if($cells.eq(settings.columnIndex).hasClass('icon-col')===false){
					$('<td class="icon-col text-center">' + iconHTML + '</td>').insertBefore($cells.eq(settings.columnIndex))
				}else{
					$cells.eq(settings.columnIndex).html(iconHTML)
				}
				
				
				feather.replace();
            })
			
		})
        
		table.draw(false);
		
		function getIconFromParams(rowData, params, defaults) {
			let matched = params.find(p => {
				// console.log(p.condition.colName);
				// console.log(rowData);
				let cellValue ='';
				if(typeof(rowData)==="undefined"){
					return {
					iconName: settings.iconName,
					iconClass: settings.iconClass,
					iconAction: settings.iconAction
					}
				}else{
					cellValue = rowData[p.condition.colName];
				}
				// console.log(cellValue);
				switch (p.condition.sign) {
					case '=': return cellValue == p.condition.colValue;
					case '!=': return cellValue != p.condition.colValue;
					case '>': return cellValue > p.condition.colValue;
					case '<': return cellValue < p.condition.colValue;
					// ajoute d'autres cas au besoin
					default: return false;
				}
			});
			
			return {
				iconName: matched?.icon?.iconName || defaults.iconName,
				iconClass: matched?.icon?.iconClass || defaults.iconClass,
				iconAction: matched?.icon?.iconAction || defaults.iconAction
			};
		}

		return this;
    }
})(jQuery)