class mouvementStock{
	constructor(opt={}){
		const{}=opt
		let myDataR=new ClassDataRectif();
		this.dbman=myDataR;
	}
	async getData(options={}){
		const{}=options
		try{
			let url='/getListMouvementStock';
			let data={};			
			let r=await this.dbman.getData({gStruct:"mouvementStockStructure", url:url, data:data});
			window["mouvementStockData"]=r;
			return 0;
		}catch(err){
			console.log(err)
		}
		
	}
}