(function($){
	$.fn.tooltipTable=function(options){
	const settings=$.extend({data:[]},options)	
	// console.log(options);
	const productInfo=options.productInfo;
	function unserialiseDetailCom(productInfo){
		let d1=[]
		let headerK=['NumBC', 'DateBC', 'DateLivraison']
		
		let d=productInfo[0]['detailCommande']
		if(d.length>0){
			let arheaderV=[];
		headerK.forEach((v,k)=>{arheaderV.push(d[0][v])})
		headerV=arheaderV.join(' - ')
		// headerV=arheaderV.toString()
		
		d1.push([headerV]);
		 let bodyK=['DesignProd', 'QteCom', 'QteResteALivrer']
		let str=`<span class="label-count">7</span>`
		d.forEach((v,k)=>{
			// console.log(v);
			str=v["DesignProd"]+'<span class="label-count">'+v["QteCom"]+'/'+v["QteResteALivrer"]+'</span>'
			d1.push([str])
		}) 
		}
		return d1;
	}
	
	function decodeSortieMagasin(productInfo){
		
		let champNames=["CodeArticle", "QteDem", "QteNec" ]
		let ar=[champNames];
		let detailChequeMatiere=productInfo[0]["detailChequeMatiere"];
		// console.log(detailChequeMatiere);
		detailChequeMatiere.forEach((v,k)=>{
			let ar1=[]
			champNames.forEach(
			(v1,k1)=>{ ar1.push(v[v1])})
			ar.push(ar1)})
		return ar;
	}
	
	function generateTable(data=[]){
		if(data.length===0){return '<i>Aucune donnée</i>'}
		let html=`<table style="border-collapse:collapse;">`
		
		data.forEach((row,index)=>{
			html+='<tr>';
			row.forEach((cell)=>{
				const tag=index===0? 'th': 'td';
				html += `<${tag} style="border:1px solid #ccc;padding:4px;">${cell}</${tag}>`;
			})
			html+='</tr>';
			} )
		html += '</table>';
		// console.log(html);
      return html;	
	}
	
	return this.each(function(){
		const $el=$(this);
		let d1=[]
		if(Array.isArray(productInfo)){
		settings.data=unserialiseDetailCom(productInfo)
		d1=decodeSortieMagasin(productInfo)
		}
		const tableHtml=generateTable(settings.data)+generateTable(d1);
		$el.tooltipster({
			content:$(tableHtml),
			theme: 'tooltipster-light',
			interactive:true,
			delay:100
		})
	})
	
	}
})(jQuery)