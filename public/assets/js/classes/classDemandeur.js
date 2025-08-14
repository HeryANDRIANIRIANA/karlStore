class classDemandeur{
	constructor(){
		let myDataR=new ClassDataRectif();
		this.dbman=myDataR;
	}
	async getData(){
		try{
			let url='/getListDemandeur';
			let data={};			
			let r=await this.dbman.getData({gStruct:"demandeurStructur", url:url, data:data});
			window["demandeurData"]=r;
			return 0;
		}catch(err){
			console.log(err)
		}
	}
}