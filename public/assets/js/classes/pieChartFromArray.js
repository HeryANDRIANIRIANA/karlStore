(function($){
	$.fn.pieChartFromArray=function(options){
		const settings=$.extend({data:[]}, options)
		let champName=(typeof(options.champName)!=="undefined" )?options.champName: "QteDem" ;
		let productInfo=(typeof(options.productInfo)!=="undefined" )?options.productInfo:null;
		function qtedemPie(ar, champName){
							  return '<div class="sparkline-pie-'+champName+'">'+ar.join(",")+'</div>'
						  }
		function decodeProductInfo(options={}){
			const{champName="QteDem"}=options
			let detailChequeMatiere=productInfo[0]["detailChequeMatiere"];
			let ar=[];
			detailChequeMatiere.forEach((v,k)=>{ar.push(v[champName])})
			return ar;
		}
		
		return this.each(function(){
			const $el=$(this);
			let ar=[]
			if(Array.isArray(productInfo)){
				ar=decodeProductInfo({champName:champName})
			// console.log(ar);
			}
			
			
			let str=qtedemPie(ar, champName);
			$(this).prepend(str);
			setTimeout(()=>{
				let sp=$(this).find('.sparkline-pie-'+champName);
				sp.sparkline('html', {
					type: 'pie',
					offset: 90,
					width: '1.0em',
					height: '1.0em'
					// sliceColors: ['#E91E63', '#00BCD4', '#FFC107']
				})
			},10)
			
		})
	}
	
})(jQuery)