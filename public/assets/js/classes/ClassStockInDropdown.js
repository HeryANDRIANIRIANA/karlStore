class StockInDropdown{
	constructor(options={}){
		const{}=options;
		let cible= "nav.navbar";
		let btnStockInNav= "#btnStockInNav"
		if($(btnStockInNav).length===0){
			$(cible).prepend(`<div id='btnStockInNav' ></div>`)
			window["myStockDropdown"]=new AhDropTable('#btnStockInNav',{
				pplIcon:"archive",
				defaultVisibleCols:[1,3,5],
				lineSelectedAction: "stocklineselected",
				lineSelectedData:"stockSelectedData"
			})
			window["myStockDropdown"].setState('loading');
		}
	}
	
	async checkData(options={}){
		const{}=options
		try{
			window["myStockDropdown"].setState('loading')
			if(typeof(window["articleData"])=== "undefined" || window["articleData"] === null){
				let myCArticle=new ClassArticle();
				await myCArticle.getData()
			}
			window["myStockDropdown"].setData(window["articleData"]);
			window["myStockDropdown"].setState('normal');
		}catch(err){
			console.log(err)
		}
		
	}
	
}